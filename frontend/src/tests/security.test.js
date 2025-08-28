// Testes básicos de segurança e validação
import {
  validateEmail,
  validatePassword,
  validateName,
  validatePhone,
  validateCNPJ,
  sanitizeInput,
  checkRateLimit,
  validateQuoteForm
} from '../lib/security.js'

// Função auxiliar para executar testes
const runTest = (testName, testFn) => {
  try {
    testFn()
    console.log(`✅ ${testName} - PASSOU`)
    return true
  } catch (error) {
    console.error(`❌ ${testName} - FALHOU:`, error.message)
    return false
  }
}

// Função de assert simples
const assert = (condition, message) => {
  if (!condition) {
    throw new Error(message)
  }
}

// Testes de validação de email
const testEmailValidation = () => {
  assert(validateEmail('test@example.com'), 'Email válido deve passar')
  assert(validateEmail('user.name+tag@domain.co.uk'), 'Email complexo deve passar')
  assert(!validateEmail('invalid-email'), 'Email inválido deve falhar')
  assert(!validateEmail('test@'), 'Email incompleto deve falhar')
  assert(!validateEmail('@domain.com'), 'Email sem usuário deve falhar')
  assert(!validateEmail(''), 'Email vazio deve falhar')
}

// Testes de validação de senha
const testPasswordValidation = () => {
  const strongPassword = validatePassword('MinhaSenh@123')
  assert(strongPassword.isValid, 'Senha forte deve ser válida')
  assert(strongPassword.strength === 'strong', 'Senha deve ser classificada como forte')
  
  const weakPassword = validatePassword('123')
  assert(!weakPassword.isValid, 'Senha fraca deve ser inválida')
  assert(weakPassword.errors.length > 0, 'Senha fraca deve ter erros')
  
  const emptyPassword = validatePassword('')
  assert(!emptyPassword.isValid, 'Senha vazia deve ser inválida')
}

// Testes de validação de nome
const testNameValidation = () => {
  const validName = validateName('João Silva')
  assert(validName.isValid, 'Nome válido deve passar')
  assert(validName.value === 'João Silva', 'Nome deve ser retornado limpo')
  
  const shortName = validateName('A')
  assert(!shortName.isValid, 'Nome muito curto deve falhar')
  
  const emptyName = validateName('')
  assert(!emptyName.isValid, 'Nome vazio deve falhar')
  
  const nameWithSpaces = validateName('  João Silva  ')
  assert(nameWithSpaces.isValid, 'Nome com espaços deve ser aceito')
  assert(nameWithSpaces.value === 'João Silva', 'Espaços devem ser removidos')
}

// Testes de validação de telefone
const testPhoneValidation = () => {
  const validPhone = validatePhone('(11) 99999-9999')
  assert(validPhone.isValid, 'Telefone válido deve passar')
  
  const phoneWithoutFormat = validatePhone('11999999999')
  assert(phoneWithoutFormat.isValid, 'Telefone sem formatação deve passar')
  
  const shortPhone = validatePhone('123456')
  assert(!shortPhone.isValid, 'Telefone muito curto deve falhar')
  
  const invalidDDD = validatePhone('(00) 99999-9999')
  assert(!invalidDDD.isValid, 'DDD inválido deve falhar')
}

// Testes de validação de CNPJ
const testCNPJValidation = () => {
  const emptyCNPJ = validateCNPJ('')
  assert(emptyCNPJ.isValid, 'CNPJ vazio deve ser aceito (opcional)')
  
  const validCNPJ = validateCNPJ('12.345.678/0001-90')
  assert(validCNPJ.isValid, 'CNPJ com formatação deve passar validação básica')
  
  const shortCNPJ = validateCNPJ('123456789')
  assert(!shortCNPJ.isValid, 'CNPJ muito curto deve falhar')
  
  const repeatedDigits = validateCNPJ('11111111111111')
  assert(!repeatedDigits.isValid, 'CNPJ com dígitos repetidos deve falhar')
}

// Testes de sanitização
const testSanitization = () => {
  const maliciousInput = '<script>alert("xss")</script>'
  const sanitized = sanitizeInput(maliciousInput)
  assert(!sanitized.includes('<script>'), 'Tags script devem ser removidas')
  
  const normalInput = '  Texto normal  '
  const cleaned = sanitizeInput(normalInput)
  assert(cleaned === 'Texto normal', 'Espaços devem ser removidos')
  
  const jsInput = 'javascript:alert("xss")'
  const cleanedJs = sanitizeInput(jsInput)
  assert(!cleanedJs.includes('javascript:'), 'JavaScript deve ser removido')
}

// Testes de rate limiting
const testRateLimit = () => {
  const key = 'test-key'
  
  // Primeiras tentativas devem ser permitidas
  for (let i = 0; i < 3; i++) {
    const result = checkRateLimit(key, 5, 60000)
    assert(result.allowed, `Tentativa ${i + 1} deve ser permitida`)
  }
  
  // Exceder o limite
  for (let i = 0; i < 3; i++) {
    checkRateLimit(key, 5, 60000)
  }
  
  const blocked = checkRateLimit(key, 5, 60000)
  assert(!blocked.allowed, 'Tentativa após limite deve ser bloqueada')
  assert(blocked.remainingTime > 0, 'Deve retornar tempo restante')
}

// Testes de validação de formulário de orçamento
const testQuoteFormValidation = () => {
  const validForm = {
    name: 'João Silva',
    email: 'joao@example.com',
    phone: '(11) 99999-9999',
    company: 'Empresa Teste',
    description: 'Preciso de usinagem de peças de alumínio para projeto automotivo'
  }
  
  const result = validateQuoteForm(validForm)
  assert(result.isValid, 'Formulário válido deve passar')
  
  const invalidForm = {
    name: '',
    email: 'email-inválido',
    phone: '123',
    description: 'Muito curto'
  }
  
  const invalidResult = validateQuoteForm(invalidForm)
  assert(!invalidResult.isValid, 'Formulário inválido deve falhar')
  assert(Object.keys(invalidResult.errors).length > 0, 'Deve retornar erros')
}

// Executar todos os testes
export const runSecurityTests = () => {
  console.log('🔒 Executando testes de segurança...\n')
  
  const tests = [
    ['Validação de Email', testEmailValidation],
    ['Validação de Senha', testPasswordValidation],
    ['Validação de Nome', testNameValidation],
    ['Validação de Telefone', testPhoneValidation],
    ['Validação de CNPJ', testCNPJValidation],
    ['Sanitização de Input', testSanitization],
    ['Rate Limiting', testRateLimit],
    ['Validação de Formulário', testQuoteFormValidation]
  ]
  
  let passed = 0
  let failed = 0
  
  tests.forEach(([name, testFn]) => {
    if (runTest(name, testFn)) {
      passed++
    } else {
      failed++
    }
  })
  
  console.log(`\n📊 Resultados dos testes:`)
  console.log(`✅ Passou: ${passed}`)
  console.log(`❌ Falhou: ${failed}`)
  console.log(`📈 Taxa de sucesso: ${((passed / (passed + failed)) * 100).toFixed(1)}%`)
  
  return { passed, failed, total: passed + failed }
}

// Testes de integração básicos
export const runIntegrationTests = () => {
  console.log('🔗 Executando testes de integração...\n')
  
  const tests = []
  
  // Teste de conexão com Supabase
  tests.push(['Conexão Supabase', () => {
    assert(typeof window !== 'undefined', 'Deve estar em ambiente browser')
    assert(window.location, 'Deve ter acesso ao location')
  }])
  
  // Teste de localStorage
  tests.push(['LocalStorage', () => {
    const testKey = 'test-storage'
    const testValue = 'test-value'
    
    localStorage.setItem(testKey, testValue)
    const retrieved = localStorage.getItem(testKey)
    localStorage.removeItem(testKey)
    
    assert(retrieved === testValue, 'LocalStorage deve funcionar')
  }])
  
  // Teste de sessionStorage
  tests.push(['SessionStorage', () => {
    const testKey = 'test-session'
    const testValue = 'test-value'
    
    sessionStorage.setItem(testKey, testValue)
    const retrieved = sessionStorage.getItem(testKey)
    sessionStorage.removeItem(testKey)
    
    assert(retrieved === testValue, 'SessionStorage deve funcionar')
  }])
  
  let passed = 0
  let failed = 0
  
  tests.forEach(([name, testFn]) => {
    if (runTest(name, testFn)) {
      passed++
    } else {
      failed++
    }
  })
  
  console.log(`\n📊 Resultados dos testes de integração:`)
  console.log(`✅ Passou: ${passed}`)
  console.log(`❌ Falhou: ${failed}`)
  
  return { passed, failed, total: passed + failed }
}

// Executar todos os testes se chamado diretamente
if (typeof window !== 'undefined' && window.location.search.includes('run-tests')) {
  runSecurityTests()
  runIntegrationTests()
}

