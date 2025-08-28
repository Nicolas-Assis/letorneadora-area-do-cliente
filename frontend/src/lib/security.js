// Utilitários de segurança e validação

// Validação de email
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// Validação de senha
export const validatePassword = (password) => {
  const errors = []
  
  if (!password) {
    errors.push('Senha é obrigatória')
    return { isValid: false, errors }
  }
  
  if (password.length < 6) {
    errors.push('Senha deve ter pelo menos 6 caracteres')
  }
  
  if (password.length > 128) {
    errors.push('Senha muito longa (máximo 128 caracteres)')
  }
  
  // Verificar se tem pelo menos uma letra
  if (!/[a-zA-Z]/.test(password)) {
    errors.push('Senha deve conter pelo menos uma letra')
  }
  
  return {
    isValid: errors.length === 0,
    errors,
    strength: getPasswordStrength(password)
  }
}

// Calcular força da senha
export const getPasswordStrength = (password) => {
  let score = 0
  
  if (password.length >= 8) score += 1
  if (password.length >= 12) score += 1
  if (/[a-z]/.test(password)) score += 1
  if (/[A-Z]/.test(password)) score += 1
  if (/[0-9]/.test(password)) score += 1
  if (/[^A-Za-z0-9]/.test(password)) score += 1
  
  if (score < 3) return 'weak'
  if (score < 5) return 'medium'
  return 'strong'
}

// Validação de nome
export const validateName = (name) => {
  const errors = []
  
  if (!name || name.trim().length === 0) {
    errors.push('Nome é obrigatório')
    return { isValid: false, errors }
  }
  
  const trimmedName = name.trim()
  
  if (trimmedName.length < 2) {
    errors.push('Nome deve ter pelo menos 2 caracteres')
  }
  
  if (trimmedName.length > 100) {
    errors.push('Nome muito longo (máximo 100 caracteres)')
  }
  
  // Verificar se contém apenas letras, espaços e alguns caracteres especiais
  if (!/^[a-zA-ZÀ-ÿ\s'-]+$/.test(trimmedName)) {
    errors.push('Nome contém caracteres inválidos')
  }
  
  return {
    isValid: errors.length === 0,
    errors,
    value: trimmedName
  }
}

// Validação de telefone brasileiro
export const validatePhone = (phone) => {
  const errors = []
  
  if (!phone) {
    errors.push('Telefone é obrigatório')
    return { isValid: false, errors }
  }
  
  // Remover caracteres não numéricos
  const cleanPhone = phone.replace(/\D/g, '')
  
  // Verificar se tem 10 ou 11 dígitos (com DDD)
  if (cleanPhone.length < 10 || cleanPhone.length > 11) {
    errors.push('Telefone deve ter 10 ou 11 dígitos')
  }
  
  // Verificar se o DDD é válido (11-99)
  const ddd = cleanPhone.substring(0, 2)
  if (parseInt(ddd) < 11 || parseInt(ddd) > 99) {
    errors.push('DDD inválido')
  }
  
  return {
    isValid: errors.length === 0,
    errors,
    value: formatPhone(cleanPhone)
  }
}

// Formatar telefone
export const formatPhone = (phone) => {
  const clean = phone.replace(/\D/g, '')
  
  if (clean.length === 10) {
    return clean.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3')
  } else if (clean.length === 11) {
    return clean.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3')
  }
  
  return phone
}

// Sanitizar entrada de texto
export const sanitizeInput = (input) => {
  if (typeof input !== 'string') return input
  
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove < e >
    .replace(/javascript:/gi, '') // Remove javascript:
    .replace(/on\w+=/gi, '') // Remove event handlers
}

// Validar CNPJ (básico)
export const validateCNPJ = (cnpj) => {
  const errors = []
  
  if (!cnpj) {
    return { isValid: true, errors } // CNPJ é opcional
  }
  
  const cleanCNPJ = cnpj.replace(/\D/g, '')
  
  if (cleanCNPJ.length !== 14) {
    errors.push('CNPJ deve ter 14 dígitos')
  }
  
  // Verificação básica de dígitos repetidos
  if (/^(\d)\1+$/.test(cleanCNPJ)) {
    errors.push('CNPJ inválido')
  }
  
  return {
    isValid: errors.length === 0,
    errors,
    value: formatCNPJ(cleanCNPJ)
  }
}

// Formatar CNPJ
export const formatCNPJ = (cnpj) => {
  const clean = cnpj.replace(/\D/g, '')
  
  if (clean.length === 14) {
    return clean.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5')
  }
  
  return cnpj
}

// Rate limiting simples (client-side)
const rateLimitStore = new Map()

export const checkRateLimit = (key, maxAttempts = 5, windowMs = 15 * 60 * 1000) => {
  const now = Date.now()
  const windowStart = now - windowMs
  
  if (!rateLimitStore.has(key)) {
    rateLimitStore.set(key, [])
  }
  
  const attempts = rateLimitStore.get(key)
  
  // Remove tentativas antigas
  const recentAttempts = attempts.filter(timestamp => timestamp > windowStart)
  rateLimitStore.set(key, recentAttempts)
  
  if (recentAttempts.length >= maxAttempts) {
    return {
      allowed: false,
      remainingTime: Math.ceil((recentAttempts[0] + windowMs - now) / 1000)
    }
  }
  
  // Adicionar nova tentativa
  recentAttempts.push(now)
  rateLimitStore.set(key, recentAttempts)
  
  return {
    allowed: true,
    remainingAttempts: maxAttempts - recentAttempts.length
  }
}

// Validar dados do formulário de orçamento
export const validateQuoteForm = (data) => {
  const errors = {}
  
  // Validar nome
  const nameValidation = validateName(data.name)
  if (!nameValidation.isValid) {
    errors.name = nameValidation.errors
  }
  
  // Validar email
  if (!validateEmail(data.email)) {
    errors.email = ['Email inválido']
  }
  
  // Validar telefone
  const phoneValidation = validatePhone(data.phone)
  if (!phoneValidation.isValid) {
    errors.phone = phoneValidation.errors
  }
  
  // Validar empresa (opcional)
  if (data.company && data.company.trim().length > 100) {
    errors.company = ['Nome da empresa muito longo']
  }
  
  // Validar CNPJ (opcional)
  if (data.cnpj) {
    const cnpjValidation = validateCNPJ(data.cnpj)
    if (!cnpjValidation.isValid) {
      errors.cnpj = cnpjValidation.errors
    }
  }
  
  // Validar descrição
  if (!data.description || data.description.trim().length < 10) {
    errors.description = ['Descrição deve ter pelo menos 10 caracteres']
  }
  
  if (data.description && data.description.length > 2000) {
    errors.description = ['Descrição muito longa (máximo 2000 caracteres)']
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  }
}

// Escapar HTML para prevenir XSS
export const escapeHtml = (text) => {
  const div = document.createElement('div')
  div.textContent = text
  return div.innerHTML
}

// Gerar token CSRF simples
export const generateCSRFToken = () => {
  return Math.random().toString(36).substring(2) + Date.now().toString(36)
}

// Verificar se está em ambiente seguro (HTTPS)
export const isSecureContext = () => {
  return window.location.protocol === 'https:' || window.location.hostname === 'localhost'
}

// Configurações de segurança
export const SECURITY_CONFIG = {
  PASSWORD_MIN_LENGTH: 6,
  PASSWORD_MAX_LENGTH: 128,
  NAME_MAX_LENGTH: 100,
  DESCRIPTION_MAX_LENGTH: 2000,
  RATE_LIMIT_ATTEMPTS: 5,
  RATE_LIMIT_WINDOW: 15 * 60 * 1000, // 15 minutos
  SESSION_TIMEOUT: 24 * 60 * 60 * 1000 // 24 horas
}

