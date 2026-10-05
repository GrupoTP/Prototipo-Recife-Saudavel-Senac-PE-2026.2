Abaixo está uma especificação consolidada para o **Recife Saudável**, considerando o enunciado do Projeto Integrador, o protótipo atual do Figma, os requisitos que você acrescentou e as exigências técnicas, de acessibilidade, segurança, privacidade e governança aplicáveis a um sistema de saúde.

Importante: como o projeto é acadêmico, o MVP pode ser implementado como ambiente de demonstração. Porém, a arquitetura deve ser construída como se fosse evoluir para produção. Dados reais de pacientes não devem ser usados no ambiente acadêmico sem a devida base legal, controles e autorização institucional.

# Especificação geral do projeto

**Nome oficial:** Recife Saudável
**Instituição:** Faculdade Senac Pernambuco, Recife, PE
**Curso:** Análise e Desenvolvimento de Sistemas
**Projeto:** Projeto Integrador, 3º período
**Período:** Agosto a dezembro de 2026
**Professor focal:** Prof. Ícaro Santos Ferreira
**Alunas:** Thayná Batista da Silva e Poliana Fontes
**Frontend:** React Native, JavaScript/TypeScript
**PWA:** React Native Web ou arquitetura web compatível
**Backend preferencial:** Java + Spring Boot
**API:** REST + JSON
**Banco:** PostgreSQL
**Arquitetura:** Cliente, API, serviços, banco de dados
**Objetivo:** pré-triagem e agendamento de consultas médicas.

O sistema deve ser entendido como uma **plataforma de apoio ao atendimento**, não como substituto de avaliação médica.

---

# 1. Objetivo funcional

O Recife Saudável deve permitir que:

1. O paciente crie uma conta.
2. Cadastre nome completo e nome social.
3. Cadastre até dois telefones.
4. Identifique quais telefones possuem WhatsApp.
5. Realize uma pré-triagem.
6. Informe sintomas e histórico.
7. Informe medicamentos e suplementos.
8. Consulte profissionais e especialidades disponíveis.
9. Escolha data e horário disponíveis.
10. Agende uma consulta.
11. Visualize suas consultas.
12. Altere informações permitidas.
13. Cancele ou reprograme consultas, conforme regras da clínica.
14. Receba informações sobre o agendamento.
15. Controle suas preferências e dados pessoais.
16. Tenha acesso às informações sobre privacidade e tratamento de dados.

O profissional deverá ter acesso somente às informações necessárias para suas atribuições.

---

# 2. Regra fundamental da pré-triagem

A pré-triagem **não deve diagnosticar o paciente**.

Ela deve apenas:

> coletar informações fornecidas pelo paciente para auxiliar a organização do atendimento e encaminhamento.

O sistema não deve apresentar frases como:

> "Você tem dengue."

ou:

> "Seu diagnóstico provável é..."

Deve utilizar mensagens como:

> "As informações foram registradas e serão consideradas no processo de atendimento."

Essa separação é importante porque a finalidade pretendida do software influencia seu enquadramento regulatório. A Anvisa esclarece que aplicações destinadas a agenda, marcação, prontuário e comunicação podem não ser consideradas SaMD, enquanto softwares destinados a diagnóstico, auxílio ao diagnóstico ou tratamento podem estar sujeitos à regulamentação específica. ([Serviços e Informações do Brasil][1])

---

# 3. Perfis do sistema

O sistema deverá possuir quatro perfis principais:

### Paciente

Pode:

* criar conta;
* editar dados pessoais permitidos;
* configurar nome social;
* cadastrar dois telefones;
* indicar WhatsApp;
* realizar pré-triagem;
* visualizar suas próprias informações;
* solicitar agendamento;
* visualizar consultas;
* cancelar ou reagendar quando permitido;
* visualizar histórico de utilização permitido;
* gerenciar privacidade.

### Médico

Pode:

* visualizar pacientes vinculados ao atendimento;
* visualizar informações necessárias à consulta;
* visualizar pré-triagem;
* visualizar consultas próprias;
* atualizar informações relacionadas ao atendimento dentro de sua competência.

Não pode:

* acessar pacientes sem vínculo;
* administrar usuários;
* alterar dados administrativos sem autorização.

### Enfermeiro

Pode:

* acessar informações necessárias às suas atividades;
* consultar pré-triagens autorizadas;
* visualizar atendimentos vinculados;
* executar funções previstas pela instituição.

Não pode:

* acessar informações sem necessidade;
* executar funções administrativas exclusivas.

### Administrador

Pode:

* administrar usuários;
* administrar profissionais;
* administrar especialidades;
* administrar horários;
* administrar clínicas;
* consultar registros administrativos;
* gerenciar permissões;
* gerenciar administradores.

---

# 4. Regra dos administradores

Essa regra deve ser implementada no backend, não somente na interface.

**Obrigatório existir no mínimo 2 administradores ativos.**

Consequentemente:

* não permitir excluir o último administrador;
* não permitir desativar o segundo administrador quando isso deixar somente um;
* exigir confirmação para alterações críticas;
* registrar quem executou a operação;
* registrar data e horário;
* registrar o tipo de operação.

### Recuperação administrativa

Caso todos os administradores sejam perdidos:

* deve existir mecanismo de recuperação;
* a recuperação deve exigir autenticação forte;
* deve utilizar código de recuperação previamente configurado;
* a recuperação deve ser registrada em auditoria;
* o código mestre não deve ficar exposto no frontend;
* o código não deve ser armazenado em texto puro no banco.

Para produção, o ideal seria substituir o conceito de "código mestre" por um procedimento de recuperação administrativa controlado.

---

# 5. Pré-triagem

A pré-triagem deverá possuir quatro etapas.

## Etapa 1, dados pessoais

Campos:

* nome completo;
* nome social;
* data de nascimento;
* telefone principal;
* telefone secundário;
* indicador de WhatsApp para cada telefone;
* contato de emergência;
* telefone do contato de emergência.

O sistema deve evitar solicitar dados que não sejam necessários para a finalidade.

---

## Etapa 2, queixa principal

Campos:

* motivo da consulta;
* sintomas atuais;
* quando começaram;
* duração;
* intensidade, caso seja considerada necessária;
* observações adicionais.

Evitar perguntas excessivamente abertas quando uma seleção estruturada resolver o problema.

---

## Etapa 3, histórico médico

Campos:

* doenças anteriores;
* cirurgias;
* alergias conhecidas;
* tratamento atual;
* observações relevantes.

Como são informações de saúde, são dados pessoais sensíveis segundo a LGPD. ([Planalto][2])

---

## Etapa 4, medicamentos

Campos:

* medicamentos utilizados regularmente;
* medicamentos de uso contínuo;
* suplementos;
* outros medicamentos utilizados atualmente;
* observações.

O sistema deve deixar claro que o paciente deve informar os medicamentos conforme seu conhecimento, sem o aplicativo recomendar alterações de tratamento.

---

# 6. Agendamento

O fluxo deve ser:

**Paciente → especialidade → profissional → data → horário → confirmação.**

Os dados pessoais já preenchidos na pré-triagem devem ser reutilizados.

O usuário poderá editar os dados permitidos antes de confirmar.

### Informações

* nome completo;
* telefone;
* e-mail;
* especialidade;
* profissional;
* data;
* horário;
* motivo da consulta;
* observação.

### Regras

O backend deve impedir:

* dois pacientes ocuparem o mesmo horário;
* agendamento em horário indisponível;
* agendamento com profissional inativo;
* agendamento fora do período configurado;
* alteração de consulta sem autorização;
* manipulação do horário diretamente pelo frontend.

A disponibilidade deve ser determinada pelo servidor.

---

# 7. Modelo de dados

Uma estrutura inicial adequada seria:

```text
Usuario
Paciente
Profissional
Administrador
Perfil
Permissao
Telefone
ContatoEmergencia
PreTriagem
Sintoma
HistoricoMedico
Medicamento
Consulta
Especialidade
Clinica
HorarioDisponivel
Auditoria
Consentimento
Notificacao
Sessao
```

Relacionamentos principais:

```text
Usuario 1:N Telefone

Usuario 1:N Perfil

Paciente 1:1 PreTriagem

Paciente 1:N Consulta

Profissional 1:N Consulta

Especialidade 1:N Profissional

Clinica 1:N Profissional

Consulta N:1 Profissional

Consulta N:1 Especialidade

Usuario 1:N Auditoria

Usuario 1:N Consentimento
```

---

# 8. Arquitetura recomendada

Para atender à preferência por Java, eu adotaria:

```text
React Native
      ↓
React Native Web / PWA
      ↓
REST API
      ↓
Spring Boot
      ↓
Spring Security
      ↓
JPA / Hibernate
      ↓
PostgreSQL
```

O Spring possui suporte oficial para construção de APIs REST e o próprio guia oficial utiliza Java e Spring Boot para esse tipo de arquitetura. ([Spring][3])

---

# 9. Backend Java

O backend deve concentrar as regras críticas.

Estrutura sugerida:

```text
src/main/java
└── br.edu.senac.recifesaudavel
    ├── controller
    ├── service
    ├── repository
    ├── entity
    ├── dto
    ├── mapper
    ├── security
    ├── exception
    ├── validation
    ├── audit
    └── config
```

### Responsabilidades

**Controller**

Recebe requisições HTTP.

**Service**

Contém regras de negócio.

**Repository**

Acesso ao banco.

**Entity**

Representação das entidades.

**DTO**

Dados enviados e recebidos pela API.

**Security**

Autenticação e autorização.

**Audit**

Registros de operações importantes.

---

# 10. REST API

Exemplos:

```http
POST /api/auth/login
POST /api/auth/register

GET /api/pacientes/me
PUT /api/pacientes/me

POST /api/pre-triagens
GET /api/pre-triagens/{id}

GET /api/especialidades
GET /api/profissionais
GET /api/horarios-disponiveis

POST /api/consultas
GET /api/consultas
PUT /api/consultas/{id}
DELETE /api/consultas/{id}

GET /api/admin/usuarios
GET /api/admin/auditoria
```

Nunca confiar em IDs enviados pelo frontend para definir autorização.

Por exemplo:

```text
GET /api/pacientes/123
```

não significa automaticamente que o usuário autenticado pode visualizar o paciente 123.

O backend deve verificar a relação entre usuário e recurso.

Spring Security oferece autorização por requisição e também autorização em nível de método, permitindo regras mais granulares. ([Home][4])

---

# 11. Autenticação

O sistema deve implementar:

* login;
* senha protegida por hash;
* expiração de sessão;
* recuperação de senha;
* logout;
* proteção contra tentativas excessivas;
* controle de sessão;
* autenticação baseada em token;
* autorização por perfil.

Para produção, considerar MFA principalmente para administradores.

Nunca:

* armazenar senha em texto puro;
* colocar senha no código;
* colocar segredo JWT no frontend;
* colocar código mestre no JavaScript;
* retornar informações sensíveis desnecessárias na API.

---

# 12. Autorização RBAC

Implementar RBAC, Role Based Access Control.

Exemplo:

```text
ROLE_PATIENT
ROLE_DOCTOR
ROLE_NURSE
ROLE_ADMIN
```

E, se necessário:

```text
PERMISSION_PATIENT_READ
PERMISSION_PATIENT_UPDATE
PERMISSION_APPOINTMENT_CREATE
PERMISSION_APPOINTMENT_CANCEL
PERMISSION_ADMIN_MANAGE
PERMISSION_AUDIT_READ
```

Isso permite separar:

**quem o usuário é**

de:

**o que ele pode fazer.**

---

# 13. LGPD

Este é um dos pontos mais importantes do projeto.

A LGPD classifica dados referentes à saúde como **dados pessoais sensíveis**. ([Planalto][2])

Portanto, o Recife Saudável deve trabalhar com:

* finalidade;
* necessidade;
* transparência;
* segurança;
* prevenção;
* não discriminação;
* responsabilização;
* controle de acesso;
* minimização de dados.

A LGPD também exige medidas técnicas e administrativas para proteger os dados contra acessos não autorizados, perda, alteração, divulgação e tratamento inadequado. ([Planalto][2])

---

# 14. Privacy by Design

A privacidade deve existir desde a arquitetura.

Não deixar para implementar no final.

O projeto deve considerar:

```text
Coleta mínima
      ↓
Finalidade definida
      ↓
Acesso restrito
      ↓
Criptografia
      ↓
Auditoria
      ↓
Retenção
      ↓
Eliminação
```

A própria ANPD recomenda incorporar proteção de dados desde as etapas iniciais do desenvolvimento e utilizar minimização, pseudonimização e mecanismos que permitam ao usuário exercer seus direitos. ([Serviços e Informações do Brasil][5])

---

# 15. Direitos do paciente como titular dos dados

O sistema deve prever mecanismos para:

* consultar dados;
* corrigir dados;
* solicitar informações sobre tratamento;
* conhecer compartilhamentos aplicáveis;
* solicitar eliminação quando juridicamente possível;
* revogar consentimento quando essa for a base legal aplicável;
* solicitar informações sobre tratamento automatizado, quando aplicável.

Esses direitos são previstos e explicados pela ANPD. ([Serviços e Informações do Brasil][6])

---

# 16. Política de privacidade

O aplicativo deve possuir uma tela:

**Privacidade e Proteção de Dados**

Deve explicar, em linguagem simples:

* quem trata os dados;
* quais dados são coletados;
* por que são coletados;
* como são utilizados;
* com quem podem ser compartilhados;
* por quanto tempo são mantidos;
* como são protegidos;
* direitos do titular;
* canal de atendimento;
* informações sobre o encarregado, quando aplicável.

---

# 17. Consentimento

Não utilizar um único:

> "Aceito tudo."

O ideal é separar finalidades quando necessário.

Exemplo:

```text
[ ] Li e estou ciente da Política de Privacidade.

[ ] Concordo com o tratamento necessário para realização
    do agendamento.

[ ] Desejo receber comunicações e lembretes.
```

O consentimento precisa ser específico, informado e inequívoco quando utilizado como base legal. ([Planalto][2])

Importante: consentimento não deve ser tratado como solução automática para todo tratamento de dados de saúde. A base legal deve ser definida para cada finalidade.

---

# 18. RIPD

Para uma versão que trate dados reais de saúde, recomendo documentar um:

**Relatório de Impacto à Proteção de Dados Pessoais, RIPD.**

A ANPD orienta que o RIPD descreva os dados tratados, titulares, finalidades, compartilhamentos, retenção, hipóteses legais, riscos e medidas de mitigação. ([Serviços e Informações do Brasil][7])

Para o projeto acadêmico, o RIPD pode ser apresentado como artefato de governança.

Isso acrescentaria bastante qualidade ao Projeto Integrador.

---

# 19. Segurança da informação

O sistema deve adotar:

### Comunicação

```text
HTTPS
TLS
```

Nunca transmitir dados de saúde por HTTP em produção.

### Banco

* criptografia em repouso quando suportada pela infraestrutura;
* backups protegidos;
* controle de acesso;
* usuários separados por ambiente;
* princípio do menor privilégio.

### API

* validação de entrada;
* rate limiting;
* autenticação;
* autorização;
* proteção contra IDOR;
* proteção contra SQL Injection;
* proteção contra XSS;
* proteção contra CSRF quando aplicável;
* CORS configurado corretamente;
* mensagens de erro sem exposição de informações internas.

---

# 20. Logs e auditoria

O sistema deve registrar eventos críticos.

Exemplo:

```text
Usuário: 284
Ação: VISUALIZOU_PRE_TRIAGEM
Recurso: PRE_TRIAGEM_829
Data: 03/09/2026 22:14
Resultado: SUCESSO
```

Também:

* login;
* logout;
* tentativa de login inválida;
* alteração de senha;
* criação de usuário;
* alteração de perfil;
* alteração de permissões;
* acesso a dados sensíveis;
* criação de consulta;
* cancelamento;
* alteração de consulta;
* inclusão de administrador;
* remoção de administrador;
* recuperação administrativa.

Não registrar senhas, tokens ou dados sensíveis desnecessários nos logs. A OWASP recomenda registrar decisões de autenticação e autorização sem armazenar identificadores de sessão sensíveis ou senhas. ([OWASP Wiki][8])

---

# 21. Segurança específica para saúde

O sistema deve seguir o princípio:

> **necessidade de saber.**

O paciente pode acessar seus próprios dados.

O médico deve acessar dados relacionados aos seus atendimentos.

O enfermeiro deve acessar somente o necessário à sua função.

O administrador não deve receber automaticamente acesso irrestrito ao conteúdo clínico apenas por possuir perfil administrativo.

Essa separação é fundamental.

O Ministério da Saúde também destaca que o prontuário eletrônico deve restringir o acesso aos dados clínicos e permitir acesso aos profissionais cadastrados conforme sua atuação. ([Serviços e Informações do Brasil][9])

---

# 22. Identificação correta do paciente

O sistema deve evitar confusão entre pacientes.

Não utilizar somente:

```text
Nome
```

como identificador.

Deve existir identificador interno único.

Exemplo:

```text
patientId: UUID
```

Na confirmação de atendimento, apresentar informações suficientes para conferência.

A identificação correta do paciente é um dos protocolos básicos de segurança do paciente do Ministério da Saúde. ([Serviços e Informações do Brasil][10])

---

# 23. Segurança clínica

O aplicativo deve possuir aviso permanente ou contextual:

> **O Recife Saudável não realiza diagnóstico médico e não substitui atendimento profissional.**

Na pré-triagem:

> **As informações fornecidas servem para auxiliar a organização e preparação do atendimento. Em caso de emergência, procure imediatamente um serviço de atendimento de urgência.**

Não transformar esse aviso em um mecanismo de diagnóstico automático.

---

# 24. Telemedicina

Se futuramente o sistema incorporar consultas por vídeo, mensagens clínicas ou atendimento remoto, será necessário ampliar a governança.

A Lei nº 14.510/2022 disciplina a telessaúde no Brasil e estabelece princípios como consentimento livre e informado, confidencialidade, assistência segura e responsabilidade digital. ([Planalto][11])

Portanto, para o MVP atual:

**Agendamento:** sim.

**Pré-triagem:** sim.

**Teleconsulta:** não é necessária.

**Diagnóstico automatizado:** não.

---

# 25. Interoperabilidade

A arquitetura deve deixar espaço para integração futura.

Exemplo:

```text
Recife Saudável
       ↓
REST API
       ↓
Sistema da clínica
```

Formato:

```json
{
  "patientId": "uuid",
  "appointmentId": "uuid",
  "specialty": "Cardiologia",
  "professionalId": "uuid",
  "date": "2026-10-10",
  "time": "14:00"
}
```

No futuro, a interoperabilidade poderá considerar padrões nacionais de saúde. A RNDS é a infraestrutura oficial do Ministério da Saúde para interoperabilidade e compartilhamento padronizado de dados de saúde. ([Serviços e Informações do Brasil][12])

Para o projeto acadêmico, **não é necessário implementar RNDS**, mas é importante deixar a arquitetura preparada para integração futura.

---

# 26. UX

O aplicativo deve priorizar:

* simplicidade;
* poucos cliques;
* linguagem simples;
* botões grandes;
* hierarquia visual clara;
* feedback imediato;
* confirmação antes de ações críticas;
* navegação previsível;
* textos curtos;
* formulários divididos em etapas;
* progress bar;
* possibilidade de voltar;
* preservação dos dados já preenchidos.

---

# 27. Usuário idoso

Como o projeto possui foco explícito no paciente idoso, o design deve considerar:

* fonte grande;
* alto contraste;
* botões grandes;
* áreas de toque adequadas;
* ícones acompanhados de texto;
* linguagem simples;
* ausência de informações desnecessárias;
* poucos elementos por tela;
* mensagens de erro claras;
* confirmação de ações importantes;
* navegação consistente;
* evitar gestos obrigatórios;
* evitar informações transmitidas somente por cor.

No React Native existem APIs específicas para `accessibilityLabel`, `accessibilityRole`, `accessibilityState`, `accessibilityHint` e integração com TalkBack e VoiceOver. ([React Native][13])

---

# 28. WCAG

A meta deve ser:

**WCAG 2.2, nível AA.**

O contraste normal de texto deve ser no mínimo:

**4,5:1**

e texto grande:

**3:1**. ([W3C][14])

Além disso:

* não utilizar somente cor para transmitir informação;
* permitir redimensionamento;
* foco visível;
* navegação por teclado no PWA;
* labels acessíveis;
* mensagens de erro identificáveis;
* ordem lógica de foco;
* componentes compatíveis com leitores de tela.

A WCAG também determina que a cor não seja o único meio visual utilizado para transmitir informação. ([W3C][15])

---

# 29. Identidade visual

Manter a proposta existente:

### Cores

Tons frios e suaves:

* azul gelo;
* azul claro acinzentado;
* azul jeans;
* verde sálvia;
* verde água;
* lavanda;
* lilás acinzentado;
* violeta pastel;
* cinza azulado;
* off-white.

Evitar excesso de saturação.

O contraste deve ser validado individualmente, não presumido pela escolha da cor.

A combinação já indicada no protótipo, **#2D7DD2 sobre branco**, deve ser efetivamente validada no contexto em que for utilizada.

---

# 30. Campos obrigatórios

Todo campo obrigatório deve apresentar:

```text
Nome completo *
```

E não depender apenas da cor vermelha.

Também apresentar mensagens:

```text
Este campo é obrigatório.
```

ou:

```text
Informe sua data de nascimento.
```

---

# 31. Nome social

O sistema deve permitir:

```text
Nome completo
Nome social
```

O nome social deve poder ser alterado nas configurações.

A interface deve utilizar o nome social quando essa for a preferência configurada, sem apagar o dado cadastral necessário.

---

# 32. Telefones

Máximo:

**2 telefones.**

Cada telefone deverá possuir:

```text
Número
[ ] Este número possui WhatsApp
```

O indicador deve ser armazenado separadamente.

Exemplo:

```text
telefone1
telefone1Whatsapp

telefone2
telefone2Whatsapp
```

---

# 33. Configurações

Tela:

**Configurações da conta**

Deve apresentar:

* nome completo;
* nome social;
* e-mail;
* telefone 1;
* WhatsApp telefone 1;
* telefone 2;
* WhatsApp telefone 2;
* alteração de senha;
* privacidade;
* consentimentos;
* dispositivos/sessões, se implementado;
* data de criação;
* último login;
* exclusão ou solicitação de exclusão;
* logout.

---

# 34. PWA

A versão PWA deve possuir:

* Web App Manifest;
* nome Recife Saudável;
* short name;
* ícone;
* `start_url`;
* `scope`;
* `display: standalone`;
* `theme_color`;
* `background_color`;
* Service Worker;
* HTTPS;
* estratégia de cache;
* tela offline.

PWAs utilizam manifest para identidade e instalação, e Service Workers podem fornecer recursos offline e operações em segundo plano. ([MDN Web Docs][16])

A instalação de PWA exige conexão segura HTTPS, exceto ambientes locais de desenvolvimento. ([MDN Web Docs][17])

---

# 35. Cuidado com dados de saúde no modo offline

Este ponto é muito importante.

**Não armazenar indiscriminadamente pré-triagens e dados médicos em cache público do Service Worker.**

O Service Worker deve armazenar somente o que for seguro.

Por exemplo:

Pode armazenar:

```text
shell da aplicação
CSS
JavaScript
ícones
recursos públicos
```

Evitar armazenar:

```text
histórico médico
medicamentos
alergias
sintomas
pré-triagem
dados de outros pacientes
```

em cache público.

---

# 36. React Native

O frontend deve ser organizado por componentes reutilizáveis:

```text
components/
screens/
navigation/
services/
hooks/
contexts/
utils/
validators/
types/
assets/
```

Exemplo:

```text
components/
  Button
  Input
  Select
  PhoneInput
  ProgressBar
  AppointmentCard
  ErrorMessage
  RequiredLabel
  Header
  Footer
```

---

# 37. Separação frontend/backend

Nunca colocar regras críticas somente no React Native.

Errado:

```javascript
if (user.role === "ADMIN") {
   mostrarDadosSecretos();
}
```

Isso é apenas controle visual.

O backend deve também verificar:

```text
Usuário autenticado?
Perfil autorizado?
Recurso pertence ao usuário?
Operação permitida?
```

---

# 38. Validação

Frontend:

```text
campo vazio
formato
tamanho
feedback visual
```

Backend:

```text
validação definitiva
regra de negócio
autorização
integridade
```

Exemplo:

O frontend pode verificar se o telefone possui formato válido.

Mas o backend deve verificar novamente.

---

# 39. Tratamento de erros

Não apresentar:

```text
500 Internal Server Error
NullPointerException
SQL Error
```

ao usuário.

Apresentar:

> "Não foi possível concluir o agendamento. Tente novamente."

O detalhe técnico deve ficar no log do servidor.

---

# 40. Concorrência no agendamento

O backend deve impedir condição de corrida.

Exemplo:

Paciente A seleciona:

```text
10:00
```

Paciente B seleciona simultaneamente:

```text
10:00
```

O banco deve garantir que somente um agendamento seja confirmado.

Isso deve ser tratado com:

* transação;
* constraint;
* controle de concorrência;
* validação no servidor.

---

# 41. Banco de dados

Preferência:

**PostgreSQL.**

Recomenda-se utilizar:

* UUID;
* timestamps;
* foreign keys;
* constraints;
* índices;
* migrations;
* integridade referencial.

Não apagar registros clínicos simplesmente com `DELETE` sem avaliar requisitos legais de retenção.

---

# 42. Datas e horários

O backend deve armazenar timestamps de maneira consistente.

Recomendo:

```text
UTC no backend
Timezone configurado para apresentação
```

Para Recife:

```text
America/Recife
```

A interface deve sempre deixar claro:

```text
10/10/2026 às 14:00
```

e não somente:

```text
14:00
```

quando houver risco de ambiguidade.

---

# 43. Notificações

Podem existir:

* confirmação de consulta;
* lembrete;
* cancelamento;
* alteração de horário.

Mas a notificação não deve revelar informações médicas na tela bloqueada.

Evitar:

> "Sua consulta para tratamento de depressão foi confirmada."

Preferir:

> "Você possui uma consulta agendada para 10/10 às 14:00."

---

# 44. Administrador

Dashboard:

```text
Usuários
Profissionais
Clínicas
Especialidades
Agendamentos
Horários
Administradores
Auditoria
Configurações
```

O administrador deve visualizar apenas aquilo necessário à sua função.

---

# 45. Auditoria administrativa

Exemplo:

```text
Administrador
    ↓
Desativou profissional
    ↓
Profissional X
    ↓
03/09/2026 22:45
```

A auditoria deve ser preferencialmente somente de leitura para administradores comuns.

A alteração ou exclusão de registros de auditoria deve ser altamente restrita.

---

# 46. Governança

O projeto deve possuir formalmente:

### Política de controle de acesso

Define quem pode acessar cada informação.

### Política de privacidade

Define como os dados pessoais são tratados.

### Política de segurança

Define controles técnicos.

### Política de retenção

Define quanto tempo cada categoria de informação permanece armazenada.

### Política de incidentes

Define o que acontece em caso de:

* vazamento;
* invasão;
* acesso indevido;
* perda de dados;
* indisponibilidade.

### Política de backup

Define:

* frequência;
* retenção;
* restauração;
* proteção.

---

# 47. Gestão de incidentes

Deve existir fluxo:

```text
Detecção
   ↓
Registro
   ↓
Classificação
   ↓
Contenção
   ↓
Investigação
   ↓
Correção
   ↓
Comunicação quando aplicável
   ↓
Prevenção de recorrência
```

---

# 48. Backup

O backend deve possuir:

* backup automático;
* cópias protegidas;
* teste periódico de restauração;
* controle de acesso;
* registro das operações.

Backup não pode ser considerado simplesmente:

```text
copiar banco.sql
```

e esquecer.

É necessário comprovar que o backup pode ser restaurado.

---

# 49. Ambiente acadêmico

Separar:

```text
DEV
TEST
PROD
```

Para o projeto:

```text
DEV
TEST
DEMO
```

Recomendo fortemente utilizar apenas:

**dados fictícios.**

Exemplo:

```text
Maria Silva
CPF fictício
telefone fictício
histórico médico fictício
```

Não utilizar prontuários reais de pessoas no GitHub.

---

# 50. GitHub

O repositório deve possuir:

```text
README.md
LICENSE
.gitignore
.env.example
docs/
frontend/
backend/
```

Nunca subir:

```text
.env
senha
JWT secret
database password
API keys
código mestre
credenciais
tokens
dados reais
```

---

# 51. Documentação acadêmica

O GitHub deveria conter:

```text
docs/
├── requisitos.md
├── arquitetura.md
├── banco-de-dados.md
├── api.md
├── seguranca.md
├── lgpd.md
├── acessibilidade.md
├── governanca.md
├── casos-de-uso.md
├── diagramas/
│   ├── caso-de-uso.png
│   ├── sequencia-agendamento.png
│   ├── arquitetura.png
│   └── modelo-dados.png
└── testes.md
```

Isso conecta diretamente o projeto às disciplinas.

---

# 52. UML obrigatório

Produzir pelo menos:

### Diagrama de Casos de Uso

Atores:

```text
Paciente
Médico
Enfermeiro
Administrador
```

Casos:

```text
Cadastrar
Login
Realizar pré-triagem
Agendar consulta
Consultar consulta
Cancelar consulta
Editar dados
Gerenciar usuários
Gerenciar profissionais
Gerenciar horários
Gerenciar administradores
Consultar auditoria
```

### Diagrama de sequência

Principal:

```text
Paciente
   ↓
App
   ↓
API
   ↓
Serviço de Agendamento
   ↓
Banco
```

---

# 53. Testes

O projeto deve ter:

### Testes unitários

Principalmente backend Java.

Testar:

* regras de agendamento;
* regra dos dois administradores;
* autorização;
* validações;
* conflitos de horários.

### Testes de integração

Testar:

```text
React Native → API → Banco
```

### Testes de segurança

Testar:

* acesso sem login;
* acesso com perfil errado;
* tentativa de acessar paciente diferente;
* tentativa de manipular consulta;
* tentativa de excluir último administrador.

### Testes de acessibilidade

Testar:

* TalkBack;
* VoiceOver;
* teclado;
* zoom;
* contraste;
* foco;
* leitura dos campos.

---

# 54. Segurança do React Native

O frontend deve:

* não armazenar dados sensíveis desnecessariamente;
* não armazenar tokens de forma insegura;
* não expor secrets;
* limpar dados temporários;
* tratar logout corretamente;
* impedir acesso a telas protegidas sem autenticação.

Para recursos de acessibilidade, React Native fornece suporte específico para leitores de tela, labels, roles, estados e hints. ([React Native][13])

---

# 55. Safe Area

O que já foi implementado no protótipo deve permanecer.

Manter:

```css
env(safe-area-inset-top)
env(safe-area-inset-bottom)
env(safe-area-inset-left)
env(safe-area-inset-right)
```

Principalmente para:

* notch;
* Dynamic Island;
* barra de navegação;
* home indicator.

Isso evita que elementos importantes fiquem escondidos.

---

# 56. Rodapé obrigatório

Todas as páginas devem possuir o rodapé:

Copyright © 2026, Polyana Fontes; Thayná Batista da Silva; App Recife Saudável, Senac PE. Todos os direitos reservados.

Eu recomendo, porém, **não utilizar o travessão original no texto**, mantendo exatamente a informação de autoria sem o símbolo, para evitar inconsistência tipográfica.

O rodapé deve aparecer:

* tela inicial;
* login;
* cadastro;
* seleção de perfil;
* dashboard;
* pré-triagem;
* agendamento;
* consultas;
* configurações;
* administração;
* telas institucionais;
* política de privacidade.

No mobile, deve ficar no final do conteúdo, sem bloquear a navegação.

---

# 57. Tela inicial

Estrutura recomendada:

```text
LOGO

Recife Saudável

Sua saúde na palma da mão.

Pré-triagem
Agendamento
Atendimento organizado

[ Começar ]

[ Acessar minha conta ]

Rodapé
Copyright © 2026...
```

---

# 58. Tela de seleção de perfil

Cards:

```text
Paciente
Médico(a)
Enfermeiro(a)
Administrador(a)
```

Mas existe uma regra importante.

O usuário **não deve conseguir escolher livremente um perfil privilegiado e ganhar aquela permissão**.

A seleção deve significar:

> "Qual perfil autorizado você deseja utilizar?"

A autorização verdadeira vem do backend.

---

# 59. Dashboard

Paciente:

```text
Olá, Nome Social

[ Fazer pré-triagem ]
[ Agendar consulta ]

Próxima consulta
Especialidade
Profissional
Data
Horário

Minhas consultas

Configurações
```

Profissional:

```text
Agenda
Pacientes vinculados
Pré-triagens
Consultas
Perfil
```

Administrador:

```text
Usuários
Profissionais
Clínicas
Agendamentos
Administradores
Auditoria
```

---

# 60. Acessibilidade no formulário

Cada campo deve possuir:

```text
Label
Campo
Texto de ajuda
Mensagem de erro
Estado
```

Exemplo:

```text
Data de nascimento *

DD/MM/AAAA

Informe sua data de nascimento.

[erro]
Informe uma data válida.
```

Não depender exclusivamente de placeholder.

---

# 61. Performance

O aplicativo deve:

* carregar rapidamente;
* evitar requisições desnecessárias;
* paginar listas;
* utilizar cache apenas para dados apropriados;
* evitar renderizações excessivas;
* comprimir recursos;
* carregar componentes sob demanda quando apropriado.

---

# 62. Observabilidade

O backend deve possuir:

* logs estruturados;
* monitoramento de erros;
* métricas;
* health check.

Exemplo:

```http
GET /actuator/health
```

O endpoint não deve expor informações internas sensíveis.

---

# 63. Versionamento da API

Recomendo:

```text
/api/v1/
```

Exemplo:

```text
/api/v1/pacientes
/api/v1/consultas
/api/v1/pre-triagens
```

Isso facilita evolução futura.

---

# 64. Documentação da API

Utilizar:

**OpenAPI/Swagger.**

Documentar:

* endpoint;
* método;
* parâmetros;
* autenticação;
* resposta;
* erros;
* permissões.

Isso também demonstra domínio de arquitetura cliente servidor.

---

# 65. Critérios de aceite do MVP

O MVP poderá ser considerado funcional quando:

### Cadastro

[ ] Cadastro funciona.
[ ] Nome social funciona.
[ ] Dois telefones funcionam.
[ ] WhatsApp pode ser marcado individualmente.
[ ] Campos obrigatórios possuem indicação visual.

### Autenticação

[ ] Login funciona.
[ ] Logout funciona.
[ ] Rotas protegidas funcionam.
[ ] Perfis são respeitados pelo backend.

### Pré-triagem

[ ] Quatro etapas funcionam.
[ ] Progress bar funciona.
[ ] Dados são persistidos.
[ ] Dados não são perdidos ao avançar/voltar.
[ ] Dados ficam associados ao paciente correto.

### Agendamento

[ ] Especialidade funciona.
[ ] Profissional é filtrado.
[ ] Horários vêm do backend.
[ ] Conflito de horário é impedido.
[ ] Consulta é persistida.

### Administração

[ ] Existem pelo menos dois administradores.
[ ] O sistema impede ficar com menos de dois.
[ ] Recuperação administrativa funciona.
[ ] Operações críticas são auditadas.

### Segurança

[ ] HTTPS em ambiente publicado.
[ ] Senhas protegidas.
[ ] APIs autenticadas.
[ ] RBAC implementado.
[ ] Dados sensíveis protegidos.
[ ] Segredos não estão no GitHub.

### Acessibilidade

[ ] WCAG 2.2 AA considerada.
[ ] Contraste mínimo validado.
[ ] TalkBack testado.
[ ] VoiceOver testado.
[ ] Navegação por teclado testada no PWA.
[ ] Campos possuem labels acessíveis.

### PWA

[ ] Manifest configurado.
[ ] Ícones configurados.
[ ] HTTPS configurado.
[ ] Service Worker configurado.
[ ] Instalação testada.
[ ] Cache não expõe dados clínicos.

---

# 66. Critérios de governança de saúde

Para considerar a arquitetura adequada ao domínio, o Recife Saudável deve cumprir:

| Área               | Critério                              |
| ------------------ | ------------------------------------- |
| Privacidade        | LGPD                                  |
| Dados de saúde     | Tratamento como dado pessoal sensível |
| Segurança          | Controle de acesso e proteção técnica |
| Auditoria          | Registro de operações relevantes      |
| Paciente           | Identificação correta                 |
| Clínico            | Não diagnosticar automaticamente      |
| Profissionais      | Acesso conforme função                |
| Administração      | Mínimo de 2 ADMs                      |
| Transparência      | Política de privacidade               |
| Titular            | Mecanismos para exercer direitos      |
| Acessibilidade     | WCAG 2.2 AA                           |
| PWA                | Manifest + Service Worker + HTTPS     |
| API                | REST + JSON                           |
| Backend            | Java + Spring Boot                    |
| Banco              | PostgreSQL                            |
| Mobile             | React Native                          |
| Interoperabilidade | Arquitetura preparada para integração |
| Documentação       | UML + API + arquitetura               |
| Qualidade          | Testes automatizados                  |
| Continuidade       | Backup e recuperação                  |
| Incidentes         | Processo formal de resposta           |

---

# 67. Ponto regulatório importante

Para o escopo atual, **não recomendo transformar o Recife Saudável em um sistema de diagnóstico ou decisão clínica automatizada**.

O escopo ideal do MVP é:

```text
Cadastro
      ↓
Pré-triagem informativa
      ↓
Organização das informações
      ↓
Busca de especialidade/profissional
      ↓
Agendamento
      ↓
Consulta
```

Isso mantém o projeto coerente com o desafio acadêmico e evita adicionar, desnecessariamente, uma finalidade clínica automatizada que poderia alterar o enquadramento regulatório do software. A Anvisa diferencia aplicações de agenda, marcação e prontuário de softwares destinados a diagnóstico, auxílio ao diagnóstico ou tratamento. ([Serviços e Informações do Brasil][18])

---

# 68. Stack final que eu recomendaria

```text
FRONTEND
React Native
JavaScript / TypeScript
React Native Web
PWA
HTML
CSS

BACKEND
Java
Spring Boot
Spring Security
Spring Data JPA
Hibernate
Bean Validation
OpenAPI / Swagger

DATABASE
PostgreSQL

API
REST
JSON
HTTPS

SECURITY
JWT
RBAC
Hash de senha
Auditoria
Rate limiting
Validação
Controle de sessão

QUALITY
JUnit
Mockito
Testes de integração
Testes de API
Testes de acessibilidade

DOCUMENTATION
UML
Figma
Swagger
README
Architecture Decision Records, se necessário

DEPLOY
Frontend/PWA
Backend Java
PostgreSQL
HTTPS
```

---

# 69. Estrutura final recomendada

```text
recife-saudavel/
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── screens/
│   │   ├── navigation/
│   │   ├── services/
│   │   ├── hooks/
│   │   ├── contexts/
│   │   ├── validators/
│   │   └── utils/
│   │
│   ├── public/
│   │   ├── manifest.json
│   │   └── icons/
│   │
│   └── service-worker
│
├── backend/
│   └── src/
│       ├── controller/
│       ├── service/
│       ├── repository/
│       ├── entity/
│       ├── dto/
│       ├── security/
│       ├── validation/
│       ├── audit/
│       └── config/
│
├── database/
│   └── migrations/
│
├── docs/
│   ├── requisitos/
│   ├── uml/
│   ├── arquitetura/
│   ├── lgpd/
│   ├── seguranca/
│   ├── acessibilidade/
│   ├── governanca/
│   └── api/
│
├── .env.example
├── .gitignore
├── README.md
└── LICENSE
```

## Resultado esperado

O **Recife Saudável** deve ser apresentado não apenas como "um aplicativo que agenda consultas", mas como um **MVP de plataforma de saúde digital com arquitetura cliente servidor, acessibilidade, proteção de dados, controle de acesso, auditoria, governança e segurança desde a concepção**.

Isso atende diretamente às quatro frentes do Projeto Integrador:

**UX:** jornada acessível do paciente, especialmente idosos.

**Mobile:** React Native.

**Cliente servidor:** React Native/PWA consumindo API REST Java.

**Análise de Sistemas:** requisitos, UML, casos de uso, sequência, arquitetura e regras de negócio.

E acrescenta uma camada que é particularmente importante para esse domínio: **LGPD, segurança da informação, governança e segurança do paciente**. O Ministério da Saúde trata identificação do paciente, comunicação, gerenciamento de riscos e práticas seguras como componentes da segurança do paciente. ([Serviços e Informações do Brasil][19])

### Fontes principais

* [LGPD, Lei nº 13.709/2018, Planalto](https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2018/lei/l13709.htm?utm_source=chatgpt.com)
* [Lei nº 14.510/2022, Telessaúde, Planalto](https://planalto.gov.br/ccivil_03/_ato2019-2022/2022/lei/l14510.htm?utm_source=chatgpt.com)
* [ANPD, Direitos dos Titulares](https://www.gov.br/anpd/pt-br/assuntos/titular-de-dados-1/direito-dos-titulares?utm_source=chatgpt.com)
* [ANPD, Relatório de Impacto à Proteção de Dados, RIPD](https://www.gov.br/anpd/pt-br/canais_atendimento/agente-de-tratamento/relatorio-de-impacto-a-protecao-de-dados-pessoais-ripd?utm_source=chatgpt.com)
* [ANVISA, Software como Dispositivo Médico](https://www.gov.br/anvisa/pt-br/assuntos/noticias-anvisa/2022/software-como-dispositivo-medico-perguntas-e-respostas?utm_source=chatgpt.com)
* [W3C, WCAG 2.2](https://www.w3.org/TR/WCAG22/?utm_source=chatgpt.com)
* [React Native, Acessibilidade](https://reactnative.dev/docs/accessibility.html?utm_source=chatgpt.com)
* [Spring Security, Autorização](https://docs.spring.io/spring-security/reference/servlet/authorization/index.html?utm_source=chatgpt.com)
* [MDN, Progressive Web Apps](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Guides/What_is_a_progressive_web_app?utm_source=chatgpt.com)
* [Ministério da Saúde, Segurança do Paciente](https://www.gov.br/saude/pt-br/composicao/saes/seguranca-do-paciente?utm_source=chatgpt.com)
* [Ministério da Saúde, Identificação do Paciente](https://www.gov.br/saude/pt-br/composicao/saes/seguranca-do-paciente/publicacoes/protocolos-de-seguranca-do-paciente/protocolo-de-identificacao-do-paciente/view?utm_source=chatgpt.com)

[1]: https://www.gov.br/anvisa/pt-br/assuntos/noticias-anvisa/2022/software-como-dispositivo-medico-perguntas-e-respostas?utm_source=chatgpt.com "Software como dispositivo médico: perguntas e respostas"
[2]: https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2018/lei/l13709.htm "L13709"
[3]: https://spring.io/guides/tutorials/rest/?utm_source=chatgpt.com "Getting Started | Building REST services with Spring"
[4]: https://docs.spring.io/spring-security/reference/servlet/authorization/method-security.html?utm_source=chatgpt.com "Method Security :: Spring Security"
[5]: https://www.gov.br/anpd/pt-br/cnpd-2/relatorios-gts-2a-formacao/compilacao-relatorios-do-cnpd.pdf?utm_source=chatgpt.com "cnpd
Conselho NaciConselho Nacional de
Proteção de"
[6]: https://www.gov.br/anpd/pt-br/assuntos/titular-de-dados-1/direito-dos-titulares?utm_source=chatgpt.com "Direito dos Titulares"
[7]: https://www.gov.br/anpd/pt-br/canais_atendimento/agente-de-tratamento/relatorio-de-impacto-a-protecao-de-dados-pessoais-ripd?utm_source=chatgpt.com "Relatório de Impacto à Proteção de Dados Pessoais (RIPD)"
[8]: https://wiki.owasp.org/images/d/d4/OWASP_Application_Security_Verification_Standard_4.0-en.pdf?utm_source=chatgpt.com "Application Security Verification Standard 4.0"
[9]: https://www.gov.br/saude/pt-br/composicao/saps/informatiza-aps/prontuario-eletronico?utm_source=chatgpt.com "O que é prontuário eletrônico — Ministério da Saúde"
[10]: https://www.gov.br/saude/pt-br/composicao/saes/seguranca-do-paciente/publicacoes/protocolos-de-seguranca-do-paciente/protocolo-de-identificacao-do-paciente/view?utm_source=chatgpt.com "Identificação do Paciente — Ministério da Saúde"
[11]: https://planalto.gov.br/ccivil_03/_ato2019-2022/2022/lei/l14510.htm?utm_source=chatgpt.com "L14510"
[12]: https://www.gov.br/saude/pt-br/composicao/seidigi/rnds?utm_source=chatgpt.com "Rede Nacional de Dados em Saúde — Ministério da Saúde"
[13]: https://reactnative.dev/docs/accessibility.html?utm_source=chatgpt.com "Accessibility · React Native"
[14]: https://www.w3.org/TR/WCAG22/?utm_source=chatgpt.com "Web Content Accessibility Guidelines (WCAG) 2.2"
[15]: https://www.w3.org/TR/wcag/?utm_source=chatgpt.com "Web Content Accessibility Guidelines (WCAG) 2.2"
[16]: https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Reference?utm_source=chatgpt.com "Progressive Web Apps reference - Progressive web apps | MDN"
[17]: https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Tutorials/CycleTracker/Manifest_file?utm_source=chatgpt.com "CycleTracker: Manifest and iconography - Progressive web apps | MDN"
[18]: https://www.gov.br/anvisa/pt-br/centraisdeconteudo/publicacoes/produtos-para-a-saude/manuais/software-como-dispositivo-medico-perguntas-e-respostas/%40%40download/file?utm_source=chatgpt.com "?
 
PERGUNTAS  
& RESPOSTAS 
  
 
 
RDC Nº 657, de"
[19]: https://www.gov.br/saude/pt-br/composicao/saes/seguranca-do-paciente/publicacoes/protocolos-de-seguranca-do-paciente?utm_source=chatgpt.com "Protocolos de Segurança do Paciente — Ministério da Saúde"
