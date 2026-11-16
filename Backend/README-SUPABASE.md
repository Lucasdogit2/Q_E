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


## Criar o primeiro acesso de servidor (staff)

O formulário público não cria contas staff. Para liberar um servidor:
1. No Supabase, abra Authentication > Users e crie o usuário com o e-mail institucional.
2. Copie o UUID desse usuário.
3. No SQL Editor, execute o comando abaixo substituindo os valores:

```sql
INSERT INTO public.profiles (id, full_name, email, role)
VALUES ('UUID_DO_USUARIO_AUTH', 'Nome do servidor', 'servidor@ifap.edu.br', 'staff');

INSERT INTO public.staff (profile_id, sector)
VALUES ('UUID_DO_USUARIO_AUTH', 'Setor responsável');
```

Faça isso somente para servidores autorizados pela instituição. O UUID precisa ser o mesmo criado em Authentication > Users. Não crie perfil de servidor para estudantes.


## Vagas, candidaturas e frequência

- `GET /api/internships`: lista vagas abertas.
- `GET /api/internships/mine`: lista vagas do servidor autenticado.
- `POST /api/internships`: servidor cadastra vaga.
- `POST /api/internships/:id/applications`: estudante envia candidatura.
- `GET /api/applications/mine`: estudante acompanha suas candidaturas.
- `GET /api/applications/pending`: servidor consulta candidaturas pendentes de suas vagas.
- `GET /api/applications/approved`: servidor lista estudantes aprovados em suas vagas.
- `PATCH /api/applications/:id/decision`: servidor aprova ou recusa candidatura.
- `GET /api/attendance/progress/mine`: estudante consulta o progresso pela view `internship_progress`.
- `GET /api/attendance/:applicationId`: servidor consulta frequência de inscrição sob sua responsabilidade.
- `POST /api/attendance/:applicationId`: servidor registra/atualiza presença diária.

Todas as rotas de negócio exigem `Authorization: Bearer <access_token>`. A API confere o perfil e a propriedade da vaga antes das operações do servidor.

## Fluxo de teste manual

1. Crie uma conta de estudante pelo formulário do frontend e confirme o e-mail se o Supabase solicitar.
2. Crie um usuário de servidor em Supabase Authentication > Users e cadastre seu perfil em `profiles` e `staff` usando o SQL acima.
3. Entre pela área de servidor, cadastre uma vaga com título, descrição, área, local, carga horária total, datas e número de vagas.
4. Entre como estudante, localize a vaga e envie candidatura.
5. Entre como servidor, abra Aprovação de estágio e aprove a candidatura.
6. Na lista de vagas do servidor, abra Registrar frequência, selecione o estudante e registre presença/falta e horas.
7. Entre como estudante e abra Meus Estágios > Acompanhar para conferir o progresso.

## Observações antes de produção

- A checagem de limite de vagas na aprovação é uma validação na API; em uso simultâneo intenso, migre a decisão para uma função SQL transacional com bloqueio da linha da vaga para impedir corrida entre aprovações.
- A chave service role ignora RLS. A API faz verificações de usuário e propriedade, mas antes de produção habilite e teste RLS em todas as tabelas e mantenha a chave somente no servidor.
- O fluxo de login usa e-mail e senha do Supabase Auth. Ainda não existe autenticação SUAP nem login direto por matrícula.
