# Backend Clean Architecture - Login + Anti-Fraude + 40 Camadas de Segurança

## Estrutura
- `src/domain` - Entidades e repositórios
- `src/application` - Casos de uso
- `src/infrastructure` - Repositórios SQLite para testes + InMemory
- `src/interface` - Controllers, rotas, middlewares, segurança
- `public` - Frontend simples HTML/JS

## Endpoints
- POST `/api/auth/register` - Cadastro com validadores anti-fraude
- POST `/api/auth/login` - Login retorna JWT
- POST `/api/data/process` - Filtra, sanitiza e organiza dados por campo, salva no SQLite dev.db
- GET `/api/data/user/:userId` - Retorna apenas dados do próprio usuário (ownership)

## Frontend
Acesse `http://localhost:3000/` para formulário de registro, login, envio de dados e consulta própria.

## Segurança
40 camadas de middleware aplicadas em ordem crescente de complexidade, de RequestId até QuantumResistantCheck.
Validadores anti-fraude: email descartável, CPF, padrão de nome, força de senha.

## Rodar
```bash
npm install
npm run dev
```

Banco de testes: SQLite `dev.db` criado automaticamente.

