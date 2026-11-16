# Integração Supabase — Q.E.

## Configuração
1. Copie `Backend/.env.example` para `Backend/.env`.
2. Preencha as variáveis com os dados em Supabase > Project Settings > API.
3. Copie `QueroEstagio/.env.example` para `QueroEstagio/.env`.
4. Nunca publique `.env` nem coloque a chave service role em variáveis `VITE_*`.
5. Em `Backend`: execute `npm install` e `npm run dev`.

## Endpoints
- `GET /api/health`: status da API.
- `GET /api/teste-banco`: teste de leitura de `profiles`.
- `POST /api/auth/register`: cadastro público de estudante.
- `POST /api/auth/login`: login por e-mail e senha.
- `GET /api/auth/me`: perfil do token Bearer.

O cadastro público cria somente estudantes. Contas de servidores (staff) devem ser provisionadas por um administrador; não permita que qualquer visitante escolha a função staff.

O cliente administrativo usa service role e ignora RLS. Mantenha-o exclusivamente no backend e implemente autorização por usuário/função em cada rota de negócio antes de publicar.
