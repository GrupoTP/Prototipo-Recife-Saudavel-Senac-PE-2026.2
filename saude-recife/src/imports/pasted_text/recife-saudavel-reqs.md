RECIFE SAUDÁVEL
Documentação de Requisitos de Software
Especificação funcional, não funcional, de segurança, privacidade, acessibilidade e governança

Item
Informação
Projeto
App Recife Saudável
Instituição
Faculdade Senac Pernambuco, Recife-PE, Brasil
Curso
Análise e Desenvolvimento de Sistemas
Projeto Integrador
3º período, Saúde na Palma da Mão
Professor focal
Prof. Ícaro Santos Ferreira
Alunas
Thayná Batista da Silva e Poliana Fontes
Início do projeto
Agosto de 2026
Período acadêmico
Agosto a dezembro de 2026
Versão do documento
1.0
Status
Baseline de requisitos para desenvolvimento e validação



Documento elaborado a partir do escopo acadêmico informado, do protótipo funcional existente e das premissas técnicas e regulatórias aplicáveis ao domínio de saúde. Normas e leis devem ser revalidadas antes de uso em produção.

Controle de versão e aprovação
Versão
Data
Responsável
Descrição
1.0
03/09/2026
Equipe do projeto
Consolidação inicial e formalização dos requisitos.
1.1
A definir
Equipe do projeto
Revisões futuras após validação do professor e testes.


Convenções deste documento
RF = Requisito Funcional.
RN = Regra de Negócio.
RNF = Requisito Não Funcional.
RS = Requisito de Segurança.
RP = Requisito de Privacidade e Proteção de Dados.
RA = Requisito de Acessibilidade.
RT = Requisito Técnico.
CA = Critério de Aceite.
Prioridade Obrigatório significa que o requisito integra a baseline do MVP, salvo alteração formal aprovada.
Sumário
1. Visão geral e finalidade
2. Contexto acadêmico e problema
3. Objetivos do sistema
4. Escopo do produto
5. Fora do escopo
6. Stakeholders e usuários
7. Premissas, restrições e dependências
8. Descrição da solução
9. Requisitos funcionais
10. Regras de negócio
11. Requisitos não funcionais
12. Segurança da informação
13. Privacidade e LGPD
14. Governança no domínio da saúde
15. Acessibilidade e UX
16. PWA
17. Arquitetura e tecnologias
18. Dados e modelo conceitual
19. API e integração cliente-servidor
20. Auditoria, logs e rastreabilidade
21. Validação e tratamento de erros
22. Desempenho e disponibilidade
23. Testes e garantia da qualidade
24. Critérios de aceite do MVP
25. Matriz de rastreabilidade
26. Riscos e mitigação
27. Entregáveis do projeto
28. Checklist de conclusão
29. Referências normativas e técnicas

1. Visão geral e finalidade
O Recife Saudável é um aplicativo centrado no paciente para apoiar dois processos principais: coleta estruturada de informações de pré-triagem e agendamento de consultas em clínicas parceiras. O sistema deverá reduzir atrito na jornada do paciente, organizar informações para o atendimento e conectar o aplicativo móvel/PWA a um servidor por meio de uma API REST.
A solução não deverá realizar diagnóstico médico, prescrição, recomendação terapêutica ou decisão clínica autônoma. A pré-triagem é um mecanismo de coleta e organização de informações fornecidas pelo paciente. Esta delimitação é também uma decisão de escopo e de governança do produto.
A Anvisa diferencia softwares de gestão e agenda de soluções destinadas a diagnóstico, auxílio ao diagnóstico ou tratamento. O escopo aqui definido deve permanecer limitado às funcionalidades de cadastro, coleta informativa, comunicação de atendimento e agendamento, sem adicionar função clínica automatizada sem nova análise regulatória. [1]
2. Contexto acadêmico e problema
O projeto integra as disciplinas de User Experience, Mobile, Cliente-Servidor e Análise e Projeto de Sistemas. O desafio acadêmico é construir um MVP funcional em React Native, conectado a servidor de testes, com foco em experiência do usuário e em um fluxo de agendamento modelado em UML.
O contexto regional informado pelo projeto utiliza Recife como referência de um importante polo médico. O sistema deve, entretanto, tratar essa informação como contexto motivacional e não como requisito funcional, salvo se dados oficiais forem incorporados posteriormente.
Problema a ser resolvido
Reduzir etapas desnecessárias no processo de agendamento.
Evitar repetição de dados ao passar da pré-triagem para o agendamento.
Melhorar clareza e acessibilidade da jornada, especialmente para pessoas idosas.
Organizar informações fornecidas pelo paciente antes do atendimento.
Demonstrar integração real entre cliente, API e banco de dados.
3. Objetivos do sistema
Tipo
Objetivo
Objetivo geral
Oferecer ao paciente uma jornada simples para cadastro, pré-triagem e agendamento de consulta.
Objetivo técnico
Demonstrar aplicativo React Native/PWA consumindo API REST desenvolvida preferencialmente em Java com Spring Boot.
Objetivo de UX
Aplicar acessibilidade, clareza, baixo esforço cognitivo e redução do número de interações.
Objetivo de segurança
Proteger dados pessoais e dados referentes à saúde, com autenticação, autorização, registros de auditoria e controles técnicos.
Objetivo acadêmico
Materializar requisitos, casos de uso, fluxos, UML, arquitetura e testes em um MVP demonstrável.


4. Escopo do produto
4.1 Aplicativo centrado no paciente
O aplicativo apresentado ao usuário final será focado no paciente. Não deverá existir tela de seleção de perfil para Médico, Enfermeiro, Administrador ou Paciente. O paciente entra diretamente na jornada de autenticação/cadastro e utiliza as funcionalidades destinadas a ele.
Perfis e permissões internas de operação, administração ou atendimento, quando necessários ao servidor e ao ambiente da clínica, serão tratados como componentes de backend e sistemas administrativos, não como perfis selecionáveis pelo paciente no aplicativo.
4.2 Funcionalidades incluídas
Boas-vindas e apresentação do serviço.
Cadastro e login do paciente.
Nome social editável.
Até dois telefones, com indicação individual de WhatsApp.
Contato de emergência.
Pré-triagem em quatro etapas.
Agendamento em três etapas.
Pré-preenchimento dos dados do paciente no agendamento.
Consulta e gerenciamento das marcações.
Configurações da conta.
Informações de privacidade e direitos do titular.
Rodapé de autoria em todas as páginas.
PWA para acesso instalável na web.
Integração com backend por REST/JSON.
5. Fora do escopo
Diagnóstico automatizado ou probabilístico.
Prescrição ou ajuste de medicamentos.
Teleconsulta ou atendimento clínico por vídeo.
Chat clínico em tempo real.
Integração oficial com prontuários reais de hospitais no MVP acadêmico.
Integração com RNDS no MVP.
Processamento real de pagamentos.
Uso de dados reais de pacientes no ambiente acadêmico.
Tela pública de seleção entre perfis privilegiados.
Qualquer item fora do escopo deverá ser tratado como mudança de requisito e passar por análise de impacto em segurança, LGPD, UX, arquitetura, testes e eventual enquadramento regulatório.
6. Stakeholders e usuários
Stakeholder/ator
Interesse
Responsabilidade/uso
Paciente
Alta
Realizar cadastro, pré-triagem e agendamento, consultar e editar dados permitidos.
Clínica parceira
Alta
Disponibilizar profissionais, especialidades e horários e receber solicitações conforme integração.
Profissional autorizado
Média/Alta
Acessar somente informações necessárias ao atendimento, fora da interface principal do paciente.
Administrador autorizado
Alta
Gerenciar recursos operacionais e segurança conforme permissões, fora do fluxo do paciente.
Equipe do projeto
Alta
Desenvolver, testar, documentar e manter o MVP acadêmico.
Professor focal
Alta
Avaliar aderência ao projeto integrador e às entregas acadêmicas.


7. Premissas, restrições e dependências
7.1 Premissas
O MVP utilizará dados fictícios.
O frontend final será desenvolvido em React Native.
A experiência web deverá ser disponibilizada como PWA.
A preferência tecnológica do projeto é Java no backend e JavaScript/TypeScript no cliente.
A API será baseada em REST e JSON.
O backend será responsável pelas regras críticas de negócio e autorização.
O banco de dados será relacional, com PostgreSQL como opção recomendada.
7.2 Restrições
Tempo acadêmico limitado ao período de agosto a dezembro de 2026.
Recursos do MVP são limitados ao que é necessário para demonstrar o fluxo.
Não utilizar dados reais de saúde em ambiente acadêmico sem governança e autorização apropriadas.
Não expor segredos, tokens ou credenciais no repositório GitHub.
7.3 Dependências
Disponibilidade da API.
Banco de dados.
Infraestrutura HTTPS para publicação do PWA.
Configuração de domínio, quando houver publicação externa.
Dados de teste para profissionais, especialidades e horários.
8. Descrição da solução
A solução terá quatro camadas lógicas: interface do paciente, camada de serviços do cliente, API/backend e persistência. A comunicação será realizada por HTTPS e JSON. O backend deverá validar novamente todas as entradas recebidas pelo cliente.
Fluxo principal:
Paciente acessa a tela inicial.
Paciente realiza login ou cadastro.
Paciente acessa o dashboard.
Paciente realiza a pré-triagem em quatro etapas.
Sistema salva as informações.
Paciente inicia o agendamento.
Sistema reaproveita os dados cadastrais da pré-triagem, mantendo edição permitida.
Paciente escolhe especialidade, profissional, data e horário disponível.
Backend valida disponibilidade e regras de negócio.
Sistema confirma o agendamento e o apresenta ao paciente.
9. Requisitos funcionais
ID
Título
Descrição
Prioridade
RF-001
Exibir tela de boas-vindas
Apresentar a marca Recife Saudável, proposta do serviço, ação principal e acesso à conta.
Obrigatório
RF-002
Cadastrar paciente
Permitir criação de conta com dados mínimos definidos neste documento.
Obrigatório
RF-003
Autenticar paciente
Permitir login com credenciais válidas e bloquear acesso às áreas protegidas sem autenticação.
Obrigatório
RF-004
Recuperar acesso
Permitir recuperação de senha por fluxo seguro e sem revelar se uma conta existe além do necessário.
Obrigatório
RF-005
Gerenciar nome social
Permitir informar e modificar nome social nas configurações.
Obrigatório
RF-006
Cadastrar telefones
Permitir até dois telefones e indicar individualmente se cada um possui WhatsApp.
Obrigatório
RF-007
Cadastrar emergência
Permitir informar contato de emergência.
Obrigatório
RF-008
Visualizar dashboard
Apresentar saudação personalizada, ações rápidas e próximas consultas.
Obrigatório
RF-009
Iniciar pré-triagem
Permitir acesso ao formulário de pré-triagem.
Obrigatório
RF-010
Executar pré-triagem em quatro etapas
Coletar dados pessoais, queixa principal, histórico médico e medicamentos/suplementos.
Obrigatório
RF-011
Salvar progresso da triagem
Preservar dados preenchidos ao avançar e retornar entre etapas.
Obrigatório
RF-012
Validar campos obrigatórios
Exibir indicação visual e mensagem de erro compreensível para campos obrigatórios ou inválidos.
Obrigatório
RF-013
Finalizar pré-triagem
Persistir a pré-triagem associada ao paciente autenticado.
Obrigatório
RF-014
Iniciar agendamento
Permitir seleção de especialidade e consulta.
Obrigatório
RF-015
Reutilizar dados da pré-triagem
Preencher automaticamente os dados cadastrais necessários para agendamento.
Obrigatório
RF-016
Editar dados no agendamento
Permitir modificar dados permitidos sem alterar indevidamente a informação histórica da triagem.
Obrigatório
RF-017
Consultar disponibilidade
Obter do backend as datas e horários disponíveis.
Obrigatório
RF-018
Filtrar profissional
Apresentar profissionais vinculados à especialidade selecionada e à disponibilidade aplicável.
Obrigatório
RF-019
Confirmar consulta
Registrar a marcação após validação de todas as regras.
Obrigatório
RF-020
Evitar conflito de horário
Impedir que duas consultas ocupem a mesma vaga.
Obrigatório
RF-021
Visualizar consultas
Permitir visualizar consultas agendadas e seus detalhes.
Obrigatório
RF-022
Cancelar consulta
Permitir cancelamento quando a política de negócio da clínica autorizar.
Obrigatório
RF-023
Reagendar consulta
Permitir reagendamento quando disponível e autorizado.
Desejável
RF-024
Editar configurações
Permitir gestão dos dados pessoais editáveis e preferências.
Obrigatório
RF-025
Visualizar data de criação e último login
Exibir os dados na área de configurações.
Obrigatório
RF-026
Visualizar privacidade
Apresentar política de privacidade, informações sobre tratamento e direitos do titular.
Obrigatório
RF-027
Gerenciar consentimentos aplicáveis
Apresentar e registrar escolhas que dependam de consentimento, quando essa for a base legal utilizada.
Obrigatório
RF-028
Solicitar exercício de direitos
Disponibilizar canal para solicitações relacionadas a acesso, correção e demais direitos aplicáveis.
Obrigatório
RF-029
Sinalizar emergência
Apresentar orientação de que o aplicativo não substitui atendimento de urgência e que situações emergenciais exigem busca imediata de serviço apropriado.
Obrigatório
RF-030
Exibir rodapé em todas as páginas
Apresentar o texto de copyright definido pelo projeto em todas as telas do aplicativo.
Obrigatório
RF-031
Funcionamento responsivo
Adaptar a interface para diferentes tamanhos de tela e orientação suportada.
Obrigatório
RF-032
PWA instalável
Permitir instalação quando suportada pelo navegador e ambiente.
Obrigatório
RF-033
Sessão segura
Encerrar ou invalidar sessão conforme regras de segurança configuradas.
Obrigatório
RF-034
Mensagens de sucesso e erro
Informar ao usuário o resultado de operações sem expor detalhes técnicos internos.
Obrigatório
RF-035
Acessibilidade em componentes
Aplicar propriedades de acessibilidade e suporte a leitores de tela no React Native e no PWA.
Obrigatório


10. Regras de negócio
ID
Regra
Definição
RN-001
Foco do produto
O aplicativo de usuário final é exclusivamente orientado ao paciente. Não haverá seletor de perfil Médico, Enfermeiro ou Administrador.
RN-002
Identidade única
Cada paciente deve possuir identificador interno único, preferencialmente UUID.
RN-003
Nome social
Nome social é editável e deve ser usado na experiência quando configurado pelo paciente, sem eliminar o nome cadastral quando este for necessário.
RN-004
Telefones
Cada paciente pode cadastrar no máximo dois telefones. O status de WhatsApp é mantido separadamente para cada telefone.
RN-005
Obrigatoriedade
Todo campo obrigatório deve indicar visualmente sua obrigatoriedade e apresentar erro compreensível quando não preenchido.
RN-006
Pré-triagem informativa
Pré-triagem somente coleta e organiza informações fornecidas pelo paciente. Não diagnostica, não prescreve e não altera tratamento.
RN-007
Dados de saúde
Informações sobre sintomas, doenças, cirurgias, alergias, tratamentos, medicamentos e suplementos são tratadas como informações especialmente protegidas e devem receber controles reforçados.
RN-008
Reaproveitamento de dados
Dados cadastrais necessários ao agendamento devem ser recuperados da conta/pré-triagem e permitir edição nos campos definidos para o agendamento.
RN-009
Origem da disponibilidade
Horários válidos devem ser provenientes do servidor e não somente de dados locais do aplicativo.
RN-010
Concorrência
O backend e o banco devem garantir que uma vaga não seja confirmada duas vezes.
RN-011
Vínculo profissional
A consulta somente pode ser criada se profissional, especialidade, data e horário forem válidos no backend.
RN-012
Cancelamento
Cancelamento deve respeitar regras configuradas para a clínica e manter histórico necessário à auditoria.
RN-013
Acesso ao dado
O acesso a informações deve ser autorizado por função, vínculo e necessidade de acesso.
RN-014
Administração interna
Quando houver módulo administrativo externo ao app do paciente, deve existir no mínimo dois administradores ativos e não poderá ser removido/desativado o último administrador se isso deixar o sistema com menos de dois.
RN-015
Recuperação administrativa
Se existir mecanismo de recuperação administrativa, credenciais ou códigos de recuperação não podem ser expostos no frontend nem armazenados em texto puro.
RN-016
Dados fictícios
O ambiente acadêmico deve operar com dados fictícios e não publicar dados reais de saúde.
RN-017
Notificações
Mensagens de notificação não devem expor informações médicas desnecessárias em tela bloqueada ou canais externos.
RN-018
Timezone
O backend deve tratar datas e horários de maneira consistente e a interface deve apresentar o horário local aplicável à operação do serviço.
RN-019
Footer
Todas as telas, sem exceção, devem conter o rodapé institucional definido na seção de identidade e copyright.
RN-020
Mudança de escopo
Inclusão de diagnóstico, tratamento, telemedicina ou decisão clínica automatizada exige nova análise técnica, jurídica e regulatória.


11. Requisitos não funcionais
ID
Requisito
Critério
Prioridade
RNF-001
Usabilidade
A jornada principal deve exigir o menor número razoável de interações, sem sacrificar compreensão ou segurança.
Obrigatório
RNF-002
Legibilidade
Tipografia deve ser legível, com hierarquia visual consistente e tamanho adaptável.
Obrigatório
RNF-003
Contraste
Texto e imagens de texto devem atender ao contraste mínimo de WCAG 2.2 AA, 4,5:1 para texto normal e 3:1 para texto grande. [2]
Obrigatório
RNF-004
Redimensionamento
Conteúdo web deve suportar aumento de texto sem perda de conteúdo ou funcionalidade, conforme WCAG 2.2 AA. [2]
Obrigatório
RNF-005
Sem dependência exclusiva de cor
Erros, estados e informações não podem depender somente de cor. [2]
Obrigatório
RNF-006
Responsividade
Layout deve funcionar em smartphones e navegadores desktop suportados.
Obrigatório
RNF-007
Desempenho
Requisições devem ser objetivas, listas grandes devem ser paginadas e recursos devem ser carregados de forma eficiente.
Obrigatório
RNF-008
Manutenibilidade
Código deve ser modular, organizado, documentado e com separação de responsabilidades.
Obrigatório
RNF-009
Testabilidade
Regras críticas devem ser cobertas por testes automatizados.
Obrigatório
RNF-010
Observabilidade
Backend deve fornecer logs estruturados e health check, sem exposição de dados sensíveis.
Obrigatório
RNF-011
Compatibilidade
O aplicativo deve considerar Android, iOS e web por meio da estratégia React Native/React Native Web adotada.
Obrigatório
RNF-012
Disponibilidade
O fluxo de agendamento deve falhar de forma controlada quando a API estiver indisponível e nunca confirmar localmente uma marcação não persistida.
Obrigatório


12. Segurança da informação
A segurança deverá seguir defesa em profundidade e princípio do menor privilégio. A segurança não poderá depender somente da interface. O backend deverá autenticar, autorizar e validar todas as operações críticas.
12.1 Autenticação
Senhas armazenadas somente em formato de hash apropriado para senha.
Sessões/token com expiração e invalidação conforme política.
Proteção contra tentativas repetidas de autenticação.
Recuperação de conta com mecanismo que não revele informações desnecessárias.
MFA é recomendado para perfis administrativos externos ao app do paciente.
12.2 Autorização
Toda API protegida deve validar a identidade do usuário.
Toda operação de leitura/escrita deve validar autorização sobre o recurso.
Não confiar em IDs enviados pelo cliente para conceder acesso.
Aplicar RBAC e, quando necessário, regras de vínculo paciente-recurso.
12.3 Proteção das APIs
HTTPS/TLS em ambientes publicados.
Validação de entrada no cliente e no servidor.
CORS restritivo para web.
Rate limiting em endpoints sensíveis.
Mensagens de erro sem stack trace, SQL, secrets ou detalhes internos.
Proteção contra injeção, manipulação de parâmetros, IDOR/BOLA e demais riscos de APIs.
12.4 Segredos
Segredos fora do código fonte.
Uso de variáveis de ambiente/secret manager na infraestrutura.
Arquivo .env fora do Git quando contiver segredos.
Arquivo .env.example sem credenciais reais.
Nunca armazenar código mestre de recuperação em JavaScript público.
13. Privacidade e LGPD
A LGPD considera dados referentes à saúde como dados pessoais sensíveis. O Recife Saudável deverá aplicar princípios de finalidade, adequação, necessidade, livre acesso, qualidade, transparência, segurança, prevenção, não discriminação e responsabilização. [3]
13.1 Mapeamento inicial de dados
Categoria
Exemplos
Natureza
Finalidade principal
Controle
Identificação
Nome, nome social, data de nascimento
Pessoal
Cadastro e identificação
Acesso restrito, correção
Contato
Telefone 1, telefone 2, WhatsApp, e-mail
Pessoal
Contato e agendamento
Acesso restrito, validação
Emergência
Nome e telefone do contato
Pessoal de terceiro
Contato em situação prevista
Minimização e transparência
Pré-triagem
Sintomas, tempo, doenças, cirurgias, alergias, tratamentos
Sensível
Preparação/organização do atendimento
Acesso reforçado e auditoria
Medicamentos
Medicamentos, suplementos, uso contínuo
Sensível
Informação para atendimento
Acesso reforçado e auditoria
Agendamento
Especialidade, profissional, data, horário, motivo breve
Pessoal/sensível conforme conteúdo
Marcação e organização do atendimento
Acesso por necessidade
Segurança
Último login, eventos de autenticação
Pessoal/técnico
Segurança e auditoria
Retenção e acesso restritos


13.2 Base legal
A base legal deve ser definida pelo controlador para cada finalidade concreta. Não é correto projetar o sistema presumindo que consentimento será sempre a base legal de todos os tratamentos. A equipe deve documentar finalidade, categoria de dado, base legal, prazo de retenção e compartilhamento antes de uma implantação real.
13.3 Direitos do titular
Confirmação da existência de tratamento.
Acesso aos dados.
Correção de dados incompletos, inexatos ou desatualizados.
Anonimização, bloqueio ou eliminação nos casos previstos.
Informações sobre compartilhamentos.
Revogação do consentimento quando aplicável.
Revisão e explicação de decisões tomadas unicamente por tratamento automatizado, quando aplicável.
A ANPD descreve esses direitos e orienta que o exercício deve ser solicitado inicialmente ao controlador. [4]
13.4 RIPD
A elaboração de Relatório de Impacto à Proteção de Dados Pessoais, RIPD, deve ser considerada para o tratamento previsto, especialmente pela presença de dados sensíveis e pelo potencial risco aos direitos dos titulares. A ANPD informa que o RIPD deve descrever tratamentos, dados, finalidades, bases legais, compartilhamentos, retenção, riscos e medidas de mitigação. [5]
13.5 Privacidade desde a concepção
Minimizar coleta.
Definir finalidade antes de criar campo.
Separar dados cadastrais de dados clínicos quando tecnicamente apropriado.
Restringir acesso.
Auditar acesso a informações sensíveis.
Definir retenção.
Evitar exposição em notificações.
Proteger dados em trânsito e em repouso quando aplicável.
14. Governança no domínio da saúde
O domínio de saúde requer governança adicional porque falhas de identificação, acesso, comunicação ou registro podem produzir consequências clínicas. O Ministério da Saúde mantém protocolos de segurança do paciente, incluindo identificação do paciente e segurança relacionada ao uso de medicamentos. [6][7]
14.1 Identificação segura
O sistema deve trabalhar com identificador interno único e apresentar informações suficientes para reduzir risco de confusão. Em ambientes assistenciais, recomenda-se a utilização de pelo menos dois identificadores em processos de identificação do paciente. [8]
14.2 Necessidade de acesso
Paciente acessa seus próprios dados.
Profissionais autorizados, quando houver sistema externo, acessam somente informações necessárias à atividade.
Administrador não deve receber automaticamente acesso irrestrito ao conteúdo clínico apenas por possuir função administrativa.
14.3 Segurança clínica da informação
Não apresentar diagnóstico gerado pelo aplicativo.
Não apresentar recomendação de medicamento ou tratamento.
Não alterar informação clínica sem rastreabilidade e autorização.
Manter indicação de que o aplicativo não substitui atendimento médico.
Em caso de informação incompatível, erro ou indisponibilidade, informar o usuário sem gerar falsa segurança.
14.4 Registros e prontuário
O projeto deve evitar denominar automaticamente toda informação da pré-triagem como prontuário médico. Caso a solução passe a criar, armazenar ou operar como prontuário eletrônico assistencial, deve-se analisar também a Lei nº 13.787/2018 e os requisitos específicos aplicáveis ao prontuário do paciente. [9]
15. Acessibilidade e UX
15.1 Princípios de UX
Uma tarefa principal por tela quando possível.
Textos objetivos.
Botões de ação claramente identificados.
Feedback imediato após ações.
Persistência dos dados durante o fluxo.
Progress bar nas etapas.
Confirmar ações irreversíveis.
Evitar elementos decorativos que prejudiquem legibilidade.
15.2 Público idoso
Fonte legível e redimensionável.
Áreas de toque amplas.
Ícones acompanhados de texto quando necessário.
Evitar instruções dependentes exclusivamente de cor.
Mensagens de erro simples e acionáveis.
Navegação consistente.
Redução de etapas e escolhas simultâneas.
Compatibilidade com leitor de tela.
React Native fornece propriedades e APIs de acessibilidade para integrar o aplicativo com tecnologias assistivas como VoiceOver e TalkBack. [10]
15.3 WCAG 2.2 AA
Critério
Aplicação no Recife Saudável
1.4.1 Uso de cor
Cor nunca deve ser único meio de comunicar estado, erro ou ação.
1.4.3 Contraste
Mínimo de 4,5:1 para texto normal e 3:1 para texto grande.
1.4.4 Redimensionamento
Texto deve poder ser ampliado sem perda de conteúdo/funcionalidade no PWA.
2.1 Teclado
PWA deve permitir operação adequada via teclado.
2.4 Navegação
Foco e ordem de navegação devem ser previsíveis.
3.3 Entrada de dados
Erros devem ser identificados e descritos em linguagem compreensível.
4.1 Compatibilidade
Semântica deve ser programaticamente determinável quando aplicável.


Fonte: W3C, Web Content Accessibility Guidelines, WCAG 2.2. [2]
16. PWA
Manifest configurado com nome Recife Saudável.
Ícones adequados para instalação.
start_url e scope coerentes.
display standalone quando suportado.
theme_color e background_color definidos.
Service Worker configurado de forma segura.
HTTPS em produção.
Estratégia de cache que não exponha informações clínicas privadas.
Experiência de instalação e atualização documentada.
O PWA não deve utilizar cache público para armazenar sintomas, medicamentos, alergias, histórico médico ou pré-triagem de pacientes. Conteúdo público do shell da aplicação pode ser armazenado, desde que não contenha dados privados. A arquitetura PWA deve considerar os mecanismos de manifest, Service Worker e HTTPS previstos para aplicações web progressivas. [11]
17. Arquitetura e tecnologias
17.1 Stack recomendada
Camada
Tecnologia preferencial
Finalidade
Aplicativo
React Native
Aplicação móvel Android/iOS.
Web/PWA
React Native Web / estratégia web compatível
Disponibilização da experiência web instalável.
Linguagem cliente
JavaScript/TypeScript
Interface e lógica de apresentação.
Backend
Java + Spring Boot
API e regras de negócio.
Segurança
Spring Security
Autenticação e autorização.
Persistência
Spring Data JPA / Hibernate
Mapeamento objeto-relacional.
Banco
PostgreSQL
Persistência relacional.
API
REST/JSON
Integração cliente-servidor.
Documentação API
OpenAPI/Swagger
Contrato e teste da API.
Testes
JUnit, Mockito e testes de integração
Qualidade do backend.
Versionamento
Git/GitHub
Controle de versão e colaboração.


A documentação oficial do Spring demonstra a construção de serviços REST com Spring Boot e Java, incluindo exposição de recursos JSON. [12]
17.2 Estrutura sugerida do backend
src/main/java/br/edu/senac/recifesaudavel/controller, service, repository, entity, dto, mapper, security, validation, exception, audit e config.
17.3 Estrutura sugerida do frontend
src/components, screens, navigation, services, hooks, contexts, validators, utils, types e assets.
18. Dados e modelo conceitual
18.1 Entidades principais
Entidade
Descrição
Usuario
Conta autenticada do sistema.
Paciente
Dados do paciente associados à conta.
Telefone
Até dois telefones por paciente, cada um com flag de WhatsApp.
ContatoEmergencia
Pessoa/canal de contato para emergência conforme coleta definida.
PreTriagem
Registro estruturado das respostas informadas pelo paciente.
HistoricoMedico
Informações de doenças, cirurgias, alergias e tratamento.
Medicamento
Medicamentos, suplementos e uso contínuo.
Especialidade
Especialidade médica disponível.
Profissional
Profissional relacionado à especialidade e clínica.
Clinica
Clínica parceira.
HorarioDisponivel
Vaga disponível para agendamento.
Consulta
Agendamento realizado pelo paciente.
Consentimento
Registro de escolhas de consentimento quando aplicável.
Auditoria
Registro de operações de segurança e negócio.
Sessao
Controle de sessões/dispositivos quando implementado.


18.2 Integridade
Chaves estrangeiras devem preservar integridade.
UUID recomendado para IDs expostos em API.
Timestamps devem ser armazenados de forma consistente.
Índices devem existir para consultas frequentes e filtros de segurança.
Migrations devem ser versionadas.
Campos sensíveis não devem ser expostos em DTOs desnecessariamente.
19. API e integração cliente-servidor
Método
Endpoint de referência
Finalidade
Autenticação
POST
/api/v1/auth/register
Criar conta
Não
POST
/api/v1/auth/login
Autenticar
Não
POST
/api/v1/auth/password-recovery
Iniciar recuperação
Não
GET
/api/v1/patients/me
Consultar dados do paciente autenticado
Sim
PUT
/api/v1/patients/me
Atualizar dados permitidos
Sim
POST
/api/v1/pre-triagens
Criar pré-triagem
Sim
GET
/api/v1/pre-triagens/{id}
Consultar pré-triagem autorizada
Sim
GET
/api/v1/specialties
Listar especialidades disponíveis
Sim ou pública conforme desenho
GET
/api/v1/professionals
Consultar profissionais
Sim
GET
/api/v1/availability
Consultar horários disponíveis
Sim
POST
/api/v1/appointments
Criar agendamento
Sim
GET
/api/v1/appointments
Listar consultas do paciente
Sim
PATCH
/api/v1/appointments/{id}/cancel
Cancelar consulta
Sim
GET
/api/v1/settings
Consultar configurações
Sim


O contrato definitivo dos endpoints deverá ser documentado em OpenAPI e versionado junto ao projeto. O backend deve controlar regras de negócio, autorização e consistência da operação.
20. Auditoria, logs e rastreabilidade
Eventos críticos devem ser rastreáveis. Logs técnicos e auditoria de negócio devem ser tratados como artefatos diferentes quando necessário.
Evento
Registrar
Não registrar
Login
identificador técnico, data/hora, resultado, origem conforme necessidade
senha, token completo
Consulta sensível
usuário, recurso, ação, data/hora, resultado
conteúdo clínico desnecessário
Agendamento
usuário, consulta, ação, data/hora, resultado
segredos de autenticação
Alteração de dados
usuário, recurso, campos/ação conforme política
valor sensível completo sem necessidade
Administração crítica
administrador, ação, recurso, data/hora, resultado
senha/código secreto


Os registros devem permitir investigação sem se transformar em novo repositório indiscriminado de dados sensíveis.
21. Validação e tratamento de erros
Situação
Comportamento esperado
Campo obrigatório vazio
Bloquear avanço e indicar o campo com mensagem clara.
Formato inválido
Informar formato esperado e manter o valor quando seguro.
Sessão expirada
Redirecionar para autenticação e preservar apenas dados não sensíveis permitidos.
API indisponível
Informar indisponibilidade sem afirmar sucesso.
Horário ocupado
Informar que o horário não está mais disponível e atualizar disponibilidade.
Acesso não autorizado
Negar acesso sem revelar existência indevida do recurso.
Erro interno
Exibir mensagem genérica e registrar detalhe técnico no servidor.
Dados conflitantes
Solicitar correção ou confirmação conforme regra de negócio.


22. Desempenho e disponibilidade
O fluxo principal deve evitar chamadas redundantes à API.
Listagens devem ter paginação quando houver potencial de crescimento.
Dados estáticos podem ser cacheados quando não forem pessoais/sensíveis.
A disponibilidade de horários deve ser sempre validada pelo servidor no momento da confirmação.
Falha do backend não pode produzir falsa confirmação de consulta.
O frontend deve fornecer estados de carregamento, sucesso e erro.
23. Testes e garantia da qualidade
23.1 Testes unitários
Validação de dados.
Regra de disponibilidade.
Regra de conflito de horário.
Cancelamento.
Permissões.
Regra de mínimo de dois administradores no módulo administrativo externo, se implementado.
23.2 Testes de integração
Cliente → API → banco.
Criação e recuperação de pré-triagem.
Criação de consulta.
Falha de concorrência no agendamento.
Autorização de acesso a recursos.
23.3 Testes de acessibilidade
TalkBack no Android.
VoiceOver no iOS.
Navegação por teclado no PWA.
Zoom/redimensionamento.
Contraste.
Foco visível.
Ordem de leitura.
23.4 Testes de segurança
Acesso sem autenticação.
Acesso com token inválido/expirado.
Acesso a paciente diferente.
Manipulação de ID de consulta.
Tentativa de criar agendamento em vaga inexistente.
Tentativa de ocupar a mesma vaga em concorrência.
Exposição de dados em logs.
Exposição de segredos no bundle frontend.
24. Critérios de aceite do MVP
ID
Área
Critério
Resultado
CA-001
Cadastro
Paciente consegue criar conta com validação de campos obrigatórios.
Aprovado/Reprovado
CA-002
Login
Paciente autenticado acessa área protegida; não autenticado não acessa.
Aprovado/Reprovado
CA-003
Nome social
Nome social pode ser editado em configurações e refletido na saudação conforme regra.
Aprovado/Reprovado
CA-004
Telefones
Até dois telefones podem ser mantidos e cada um possui indicador de WhatsApp independente.
Aprovado/Reprovado
CA-005
Pré-triagem
As quatro etapas são concluídas e persistidas.
Aprovado/Reprovado
CA-006
Obrigatoriedade
Campos obrigatórios apresentam indicação visual e mensagens.
Aprovado/Reprovado
CA-007
Agendamento
Dados da pré-triagem são reutilizados nos campos permitidos.
Aprovado/Reprovado
CA-008
Disponibilidade
Somente horários válidos do backend podem ser confirmados.
Aprovado/Reprovado
CA-009
Conflito
Dois usuários concorrentes não conseguem confirmar a mesma vaga.
Aprovado/Reprovado
CA-010
Consultas
Paciente visualiza seus próprios agendamentos.
Aprovado/Reprovado
CA-011
Privacidade
Política e informações de direitos são acessíveis.
Aprovado/Reprovado
CA-012
Acessibilidade
Fluxos críticos são operáveis com leitor de tela e atendem critérios definidos de contraste.
Aprovado/Reprovado
CA-013
PWA
Aplicação pode ser instalada quando o ambiente suportar o recurso.
Aprovado/Reprovado
CA-014
Segurança
Segredos não estão no GitHub e APIs críticas exigem autenticação/autorização.
Aprovado/Reprovado
CA-015
Footer
Rodapé obrigatório aparece em todas as páginas.
Aprovado/Reprovado
CA-016
Escopo clínico
Aplicação não produz diagnóstico, prescrição ou decisão terapêutica.
Aprovado/Reprovado


25. Matriz de rastreabilidade
Objetivo
Requisitos
Regras/atributos
Critérios de aceite
Objetivo O1, jornada paciente
RF-001 a RF-008
RA-001 a RA-008
CA-001 a CA-004
Objetivo O2, pré-triagem
RF-009 a RF-013
RN-006, RN-007
CA-005, CA-006, CA-016
Objetivo O3, agendamento
RF-014 a RF-023
RN-008 a RN-012
CA-007 a CA-010
Objetivo O4, privacidade
RF-024 a RF-029
RP-001 a RP-008
CA-011
Objetivo O5, acessibilidade
RF-031, RF-035
RNF-002 a RNF-006, RA-*
CA-012
Objetivo O6, arquitetura
RF-032 a RF-034
RT-001 a RT-012
CA-013, CA-014
Objetivo O7, identidade/autoria
RF-030
RN-019
CA-015


26. Riscos e mitigação
ID
Risco
Criticidade
Mitigação
R-01
Vazamento de dados de saúde
Alto
Criptografia, RBAC, auditoria, minimização, testes e ausência de dados reais no MVP.
R-02
Acesso indevido por ID manipulável
Alto
Autorização no backend por usuário/recurso e testes BOLA/IDOR.
R-03
Duplo agendamento
Alto
Transação, constraint e validação de disponibilidade no servidor.
R-04
Falsa percepção de diagnóstico
Alto
Escopo clínico restrito, mensagens claras e revisão de conteúdo.
R-05
Baixa acessibilidade para idosos
Alto
Testes com leitor de tela, contraste, tamanho de toque e validação de jornada.
R-06
Exposição de dados no PWA
Alto
Não cachear dados clínicos em cache público, revisar Service Worker e armazenamento local.
R-07
Credenciais no GitHub
Alto
Secrets fora do código, .gitignore, revisão de repositório e secret scanning.
R-08
Requisito regulatório alterado por mudança de escopo
Médio/Alto
Change control e nova análise regulatória antes de inserir diagnóstico/telemedicina.
R-09
Perda de dados durante falha
Médio
Transações, persistência incremental quando aplicável, backup e restauração.
R-10
Confusão de paciente
Alto
Identificador único e conferência segura de identidade.


27. Entregáveis do projeto
Aplicativo React Native funcional.
Versão PWA funcional.
Backend Java/Spring Boot.
Banco PostgreSQL ou equivalente relacional.
API REST documentada.
Protótipo Figma atualizado.
Casos de uso UML.
Diagramas de sequência.
Diagrama de arquitetura.
Modelo de dados/DER.
Documentação de requisitos, este documento.
Documentação de segurança e LGPD.
Plano e evidências de testes.
README do GitHub.
Pitch/apresentação no Canva.
27.1 Links do projeto
Recurso
Link
GitHub
https://github.com/GrupoTP/App-Recife-Saudavel-Senac-PE-2026.2
Figma
https://www.figma.com/make/HgsxSju4V0c9LixmfcUxm7/App-Recife-Saud%C3%A1vel-Development?fullscreen=1&t=qW8P0oS0T6RXnKZX-1&code-node-id=0-6


28. Checklist de conclusão
[ ] Nome oficial utilizado em toda a aplicação: Recife Saudável.
[ ] Aplicativo final centrado no paciente.
[ ] Não existe seleção de perfil no aplicativo do paciente.
[ ] Cadastro/login implementados.
[ ] Nome social editável.
[ ] Dois telefones e flag individual de WhatsApp.
[ ] Data de criação e último login em configurações.
[ ] Pré-triagem com quatro etapas.
[ ] Agendamento com três etapas.
[ ] Dados de agendamento pré-preenchidos a partir da conta/pré-triagem.
[ ] Especialidade, profissional, data e horário validados pelo backend.
[ ] Conflito de horário impedido no banco/backend.
[ ] Campos obrigatórios sinalizados visualmente.
[ ] WCAG 2.2 AA usada como referência de acessibilidade.
[ ] Testado contraste mínimo.
[ ] Testado TalkBack/VoiceOver.
[ ] PWA com manifest, Service Worker e HTTPS.
[ ] Dados sensíveis fora do cache público.
[ ] API REST/JSON documentada.
[ ] Backend preferencialmente Java/Spring Boot.
[ ] Autenticação e autorização implementadas.
[ ] Logs e auditoria sem exposição de segredos.
[ ] Política de privacidade disponível.
[ ] Fluxo de exercício de direitos disponível/documentado.
[ ] RIPD analisado/documentado para cenário de tratamento real.
[ ] Dados acadêmicos são fictícios.
[ ] GitHub não contém secrets.
[ ] Rodapé obrigatório em todas as páginas.
[ ] Nenhuma funcionalidade de diagnóstico ou prescrição no MVP.
29. Referências normativas e técnicas
[1] ANVISA. Software como Dispositivo Médico, perguntas e respostas. Documento oficial que diferencia funcionalidades de gestão/agenda de funções destinadas a diagnóstico, auxílio ao diagnóstico ou tratamento. https://www.gov.br/anvisa/pt-br/centraisdeconteudo/publicacoes/produtos-para-a-saude/manuais/software-como-dispositivo-medico-perguntas-e-respostas/%40%40download/file
[2] W3C. Web Content Accessibility Guidelines (WCAG) 2.2. Critérios de contraste, redimensionamento, uso de cor e demais requisitos de acessibilidade. https://www.w3.org/TR/WCAG22/
[3] BRASIL, Planalto. Lei nº 13.709/2018, Lei Geral de Proteção de Dados Pessoais, LGPD. https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2018/lei/l13709.htm
[4] ANPD. Direito dos Titulares. Direitos de acesso, correção, eliminação, revogação e outros direitos. https://www.gov.br/anpd/pt-br/assuntos/titular-de-dados-1/direito-dos-titulares
[5] ANPD. Relatório de Impacto à Proteção de Dados Pessoais, RIPD. Conteúdo mínimo, análise de risco e medidas de mitigação. https://www.gov.br/anpd/pt-br/canais_atendimento/agente-de-tratamento/relatorio-de-impacto-a-protecao-de-dados-pessoais-ripd
[6] Ministério da Saúde. Protocolos Básicos de Segurança do Paciente. https://www.gov.br/saude/pt-br/composicao/saes/seguranca-do-paciente/publicacoes/protocolos-de-seguranca-do-paciente
[7] Ministério da Saúde. Segurança na Prescrição, uso e Administração de Medicamentos. https://www.gov.br/saude/pt-br/composicao/saes/seguranca-do-paciente/publicacoes/protocolos-de-seguranca-do-paciente/protocolo-seguraca-na-prescricao-uso-e-administracao-de-medicamentos.pdf/view
[8] Ministério da Saúde. Protocolo de Identificação do Paciente. https://www.gov.br/saude/pt-br/composicao/saes/seguranca-do-paciente/publicacoes/protocolos-de-seguranca-do-paciente/protocolo-de-identificacao-do-paciente/view
[9] BRASIL, Planalto. Lei nº 13.787/2018, digitalização e utilização de sistemas informatizados para guarda, armazenamento e manuseio de prontuário de paciente. https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2018/lei/l13787.htm
[10] React Native. Accessibility. APIs e propriedades de acessibilidade para Android e iOS, incluindo integração com TalkBack e VoiceOver. https://reactnative.dev/docs/accessibility
[11] MDN Web Docs. Progressive Web Apps. Manifest, Service Worker, instalação e requisitos web. https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Guides/What_is_a_progressive_web_app
[12] Spring. Building a RESTful Web Service. Spring Boot, Java, HTTP e JSON. https://spring.io/guides/gs/rest-service/
Declaração de escopo e responsabilidade
Este documento consolida requisitos para um projeto acadêmico de software. A presença de referências legais, normativas ou técnicas não significa que o MVP esteja automaticamente autorizado para operação assistencial real. Antes de produção, devem ser definidos controlador e operadores de dados, bases legais, políticas de retenção, segurança, resposta a incidentes, avaliação de riscos, eventual RIPD, contratos com terceiros e demais obrigações aplicáveis ao serviço concreto.
Mudanças que introduzam novas finalidades clínicas, integração com prontuário, telemedicina, decisão automatizada, inteligência artificial clínica, biometria ou compartilhamento com novas entidades devem gerar revisão formal deste documento e nova análise de impacto.
