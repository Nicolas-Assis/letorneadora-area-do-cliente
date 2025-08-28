import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { supabase } from './supabase'

// Store para autenticação
export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      session: null,
      loading: false,
      
      // Ações de autenticação
      setUser: (user) => set({ user }),
      setSession: (session) => set({ session }),
      setLoading: (loading) => set({ loading }),
      
      // Login
      signIn: async (email, password) => {
        set({ loading: true })
        try {
          const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password
          })
          
          if (error) throw error
          
          set({ user: data.user, session: data.session })
          return { success: true }
        } catch (error) {
          return { success: false, error: error.message }
        } finally {
          set({ loading: false })
        }
      },
      
      // Registro
      signUp: async (email, password, userData) => {
        set({ loading: true })
        try {
          const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
              data: userData
            }
          })
          
          if (error) throw error
          
          return { success: true, data }
        } catch (error) {
          return { success: false, error: error.message }
        } finally {
          set({ loading: false })
        }
      },
      
      // Logout
      signOut: async () => {
        set({ loading: true })
        try {
          await supabase.auth.signOut()
          set({ user: null, session: null })
          return { success: true }
        } catch (error) {
          return { success: false, error: error.message }
        } finally {
          set({ loading: false })
        }
      },
      
      // Inicializar sessão
      initialize: async () => {
        set({ loading: true })
        try {
          const { data: { session } } = await supabase.auth.getSession()
          if (session) {
            set({ user: session.user, session })
          }
        } catch (error) {
          console.error('Erro ao inicializar sessão:', error)
        } finally {
          set({ loading: false })
        }
      }
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ user: state.user, session: state.session })
    }
  )
)

// Store para carrinho de compras
export const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      
      // Ações do carrinho
      addItem: (product, quantity = 1) => {
        const items = get().items
        const existingItem = items.find(item => item.product.id === product.id)
        
        if (existingItem) {
          set({
            items: items.map(item =>
              item.product.id === product.id
                ? { ...item, quantity: item.quantity + quantity }
                : item
            )
          })
        } else {
          set({
            items: [...items, { product, quantity, id: Date.now() }]
          })
        }
      },
      
      removeItem: (productId) => {
        set({
          items: get().items.filter(item => item.product.id !== productId)
        })
      },
      
      updateQuantity: (productId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(productId)
          return
        }
        
        set({
          items: get().items.map(item =>
            item.product.id === productId
              ? { ...item, quantity }
              : item
          )
        })
      },
      
      clearCart: () => set({ items: [] }),
      
      toggleCart: () => set({ isOpen: !get().isOpen }),
      
      openCart: () => set({ isOpen: true }),
      
      closeCart: () => set({ isOpen: false }),
      
      // Getters
      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0)
      },
      
      getTotalPrice: () => {
        return get().items.reduce((total, item) => total + (item.product.price * item.quantity), 0)
      },
      
      getItemCount: (productId) => {
        const item = get().items.find(item => item.product.id === productId)
        return item ? item.quantity : 0
      }
    }),
    {
      name: 'cart-storage'
    }
  )
)

// Store para configurações da aplicação
export const useAppStore = create((set, get) => ({
  // Estado da aplicação
  loading: false,
  sidebarOpen: false,
  theme: 'light',
  
  // Configurações da empresa
  companyInfo: {
    name: 'Le Torneadora',
    phone: '(11) 3456-7890',
    email: 'contato@letorneadora.com.br',
    whatsapp: '5511987654321'
  },
  
  // Ações
  setLoading: (loading) => set({ loading }),
  toggleSidebar: () => set({ sidebarOpen: !get().sidebarOpen }),
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  setTheme: (theme) => set({ theme }),
  
  // Carregar configurações da empresa
  loadCompanyInfo: async () => {
    try {
      const { data, error } = await supabase
        .from('app_config')
        .select('key, value')
        .in('key', ['company_info', 'company_address', 'social_media'])
      
      if (error) throw error
      
      const config = {}
      data.forEach(item => {
        config[item.key] = item.value
      })
      
      if (config.company_info) {
        set({ companyInfo: { ...get().companyInfo, ...config.company_info } })
      }
      
      return config
    } catch (error) {
      console.error('Erro ao carregar configurações:', error)
      return null
    }
  }
}))

// Listener para mudanças de autenticação
supabase.auth.onAuthStateChange((event, session) => {
  const { setUser, setSession } = useAuthStore.getState()
  
  if (event === 'SIGNED_IN' && session) {
    setUser(session.user)
    setSession(session)
  } else if (event === 'SIGNED_OUT') {
    setUser(null)
    setSession(null)
  }
})

