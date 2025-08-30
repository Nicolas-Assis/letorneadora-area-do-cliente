# TODO - Refatoração Backend Letorneadora

## Fase 1: Configurar ambiente e analisar estrutura atual ✅
- [x] Clonar repositório
- [x] Analisar estrutura do projeto
- [x] Identificar componentes JWT existentes
- [x] Criar branch refactor/auth-firebase-cleanup

## Fase 2: Remover JWT e implementar Firebase Auth
- [x] Remover dependências JWT do package.json
- [x] Instalar Firebase Admin SDK
- [x] Remover guards JWT existentes
- [x] Criar novo guard Firebase Auth
- [x] Atualizar AuthService para Firebase
- [ ] Remover configurações JWT do .env

## Fase 3: Implementar RBAC com roles admin/operator/client
- [x] Atualizar enum de roles (já existe)
- [x] Criar decorator @Roles
- [x] Implementar RolesGuard para Firebase
- [x] Aplicar guards nas rotas dos controllers
- [x] Definir permissões por role

## Fase 4: Corrigir services comentados e limpar código
- [x] Descomentar e corrigir AuthService
- [x] Revisar e corrigir outros services comentados (OrdersService)
- [x] Remover arquivos não utilizados
- [x] Padronizar entidades e DTOs
- [x] Limpar imports não utilizados

## Fase 5: Implementar integração inicial com Asaas
- [x] Instalar dependências para Asaas
- [x] Criar service para Asaas
- [x] Implementar endpoint POST /payments/checkout
- [x] Implementar endpoint POST /webhooks/asaas
- [x] Implementar endpoint GET /payments/:id
- [x] Configurar validação de webhook

## Fase 6: Atualizar documentação e configurações
- [x] Atualizar .env.example com Firebase e Asaas
- [x] Atualizar README com novo fluxo de auth
- [x] Documentar RBAC e permissões
- [x] Documentar endpoints de pagamento

## Fase 7: Testar build e abrir PR
- [ ] Instalar dependências
- [ ] Testar build sem erros
- [ ] Verificar se não há referências JWT
- [ ] Commit das mudanças
- [ ] Push do branch
- [ ] Abrir PR na main

