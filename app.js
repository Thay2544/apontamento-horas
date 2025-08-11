// app.js
// Configuração do Firebase
const firebaseConfig = {
  apiKey: "AIzaSyAeUjzTidf-cBI_zOvsX_1R-Wqc4Q7EU7k",
  authDomain: "apontamento-horas-679d2.firebaseapp.com",
  databaseURL: "https://apontamento-horas-679d2-default-rtdb.firebaseio.com",
  projectId: "apontamento-horas-679d2",
  storageBucket: "apontamento-horas-679d2.appspot.com",
  messagingSenderId: "911710775164",
  appId: "1:911710775164:web:abf328ce42a062d50626f9",
  measurementId: "G-JSZYLG59D5"
};

// Inicializa Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const provider = new firebase.auth.GoogleAuthProvider();
const db = firebase.database();

// Elementos do DOM
const loginBtn = document.getElementById('loginBtn');
const userNameElem = document.getElementById('userName');
const userPhoto = document.getElementById('userPhoto');
const greetingText = document.getElementById('greeting-text');
const userCellElem = document.getElementById('userCell');
const nameField = document.getElementById('name');
const dateField = document.getElementById('date');
const subsystemSelect = document.getElementById('subsystem');
const stageSelect = document.getElementById('stage');
const projectSelect = document.getElementById('project');
const observationInput = document.getElementById('observation');
const startBtn = document.getElementById('startBtn');
const stopBtn = document.getElementById('stopBtn');
const timerDisplay = document.getElementById('timer');
const historyTableBody = document.getElementById('historyTableBody');

const adminOptions = [
  'Gestão Documentos',
  'Gestão Auditoria Interna',
  'Treinamentos / Capacitação',
  'Deslocamento',
  'Atividades administrativas',
  'Follow-up'
];
const stageOptions = ['Planejamento','Execução','Comunicação','Monitoramento','Revisão'];

// Projetos por usuário
const userProjects = {"vitor": [
    "2.6 Auditoria de controles de contratos venda etanol",
    "S/N Cessões de créditos",
    "11_1T_2025_AOP Recebimento e classificação",
    "17_2T_2025_AOP Cadastro/tesouraria/fluxo de caixa",
    "18_2T_2025_AOP Ciclo de negociação",
    "21_2T_2025_ATC Segurança de acesso terceiros",
    "NP01_1T_2025_AOP Investigação Balsas/Sinop Especialista de obras x Muninsc",
    "NP03_1T_2025_AOP Supervisor obras x Aço Ferro MS",
    "NP03_4T_2024_AOP Dourados Supervisor de manutenção x Medina Oliveira/3R",
    "NP04_1T_2025_AOP Fretes DDGS",
    "NP04_4T_2024_AOP Sidrolândia Especialista de obras x WM montagens",
    "NP06_2T_2025_AOP Validação de pontos Consultoria Prado e Suzuki",
    "NP25_2T_2025_AOP Recebimento de propina MF inspeções e montagens"
  ],
  "marcio": [
    "01_2T_2025_AOP Processo de transferência de milho de armazenagem para a indústria",
    "02_2T_2025_AOP Processo de aquisição, arrendamento, venda de caminhões e reboques",
    "03_2T_2025_AOP Biomassa - Contratos de classificação",
    "07_2T_2025_AOP Contratos de compras",
    "17_2T_2025_AOP Cadastro/tesouraria/fluxo de caixa",
    "18_2T_2025_AOP Ciclo de negociação",
    "38_2T_2025_AOP Verificações de inventários cíclicos OPEX 07_2025",
    "NP06_2T_2025_AOP Validação de pontos Consultoria Prado e Suzuki",
    "NP09_2T2025_AOP Conferência de inspeções de saída (patrimonial) - Nova Mutum",
    "NP13_2T_2025_AOP Estoque de Milho - Ajustes e inventário",
    "NP21_2T_2025_AOP Inventários rotativos, controles de estoques",
    "NP23_2T_2025_AOP Transportes DDGS - Imbituba",
    "29_2T_2025_AOP Verificações de inventários cíclicos OPEX 06_2025",
    "Supervisor de manutenção automotiva",
    "Fluxo de compras frotas",
    "Investigação 07 - Conferência de pagamento dos transportadores"
  ],
  "pedro": [
    "02_2T_2025_AOP Processo de aquisição, arrendamento, venda de caminhões e reboques",
    "11_1T_2025_AOP Recebimento e classificação",
    "15_2T_2025_AOP Contratos de serviços corporativos consultorias INPASA",
    "16_2T_2025_AOP Consultorias INFINITI",
    "29_2T_2025_AOP Verificações de inventários cíclicos OPEX 06_2025",
    "38_2T_2025_AOP Verificações de inventários cíclicos OPEX 07_2025",
    "Verificações de inventários cíclicos OPEX 08_2025",
    "Verificações de inventários cíclicos OPEX 09_2025",
    "Verificações de inventários cíclicos OPEX 10_2025",
    "Verificações de inventários cíclicos OPEX 11_2025",
    "Verificações de inventários cíclicos OPEX 12_2025",
    "NP08_2T_2025_AOP Conferência de inspeções de saída (patrimonial) - DRD",
    "NP10_2T_2025_ATC Faturamento - Processo de refaturamento (CORP)",
    "NP13_2T_2025_AOP Estoque de Milho - Ajustes e inventário",
    "NP29_2T_2025_AOP Desfazimento de contratos de Etanol 2025",
    "NP32_3T_2025_AOP Investigação Saulo Supervisor Sinop",
    "NP33_3T_2025_AOP Investigação Ana vs Maneira Advogados",
    "NP34_3T_2025_AOP Investigação Tiago Roberto do Nascimento",
    "NP35_3T_2025_AOP Investigação do Comercial de Biomassa"
  ],
  "jakeline": [
    "07_2T_2025_AOP Contratos de compras",
    "NP16_2T_2025_AOP Due dilligence novos fornecedores"
  ],
  "raquel": [
    "01_2T_2025_AOP Processo de transferência de milho de armaze nagem para a indústria",
    "29_2T_2025_AOP Verificações de inventários cíclicos OPEX 06_2025",
    "38_3T_2025_AOP Verificações de inventários cíclicos OPEX 07_2025",
    "Verificações de inventários cíclicos OPEX 08_2025",
    "Verificações de inventários cíclicos OPEX 09_2025",
    "Verificações de inventários cíclicos OPEX 10_2025",
    "Verificações de inventários cíclicos OPEX 11_2025",
    "Verificações de inventários cíclicos OPEX 12_2025",
    "31_3T_2025_AOP Serviços de plantio Francio/serviços de locação de equipamentos estradas",
    "30_3T_2025_AOP Ciclo de compras negociações"
  ],
  "elaine": [
    "Contratos de classificação (prestadores de serviço)",
    "Cobranças de caixinha carregamentos DDGS Dourados",
    "03_2T_2025_ACN Diagnóstico Deloitte",
    "07_2T_2025_AOP Contratos de compras",
    "15_2T_2025_AOP Contratos de serviços corporativos consultorias INPASA",
    "16_2T_2025_AOP Consultorias INFINITI",
    "29_2T_2025_AOP Verificações de inventários cíclicos OPEX 06_2025",
    "38_2T_2025_AOP Verificações de inventários cíclicos OPEX 07_2025",
    "Verificações de inventários cíclicos OPEX 08_2025",
    "Verificações de inventários cíclicos OPEX 09_2025",
    "Verificações de inventários cíclicos OPEX 10_2025",
    "Verificações de inventários cíclicos OPEX 11_2025",
    "Verificações de inventários cíclicos OPEX 12_2025",
    "NP07_2T_2025_AOP Avaliação da contratação de média tensão Balsas",
    "NP11_2T_2025_AOP Avaliação da contratação de isolamentos Caldeiras Balsas",
    "NP13_2T_2025_AOP Estoque de Milho - Ajustes e inventário",
    "NP17_2T_2025_ACN Rotina de Faturamento x Retorno x Refaturamento",
    "NP19_2T_2025_ACN Rotina de Preço Médio",
    "NP25_2T_2025_AOP Recebimento de propina MF inspeções e montagens",
    "NP32_3T_2025_AOP Investigação Saulo Supervisor Sinop",
    "NP33_3T_2025_AOP Investigação Ana vs Maneira Advogados",
    "NP34_3T_2025_AOP Investigação Tiago Roberto do Nascimento",
    "NP35_3T_2025_AOP Investigação do Comercial de Biomassa"
  ],
  "rafael": [
    "Cobranças de caixinha carregamentos DDGS Dourados",
    "08_2T_2025_ACN Validação de 10 SQLs junto com à Tetra",
    "10_2T_2025_ACN Validação do KPI de Rendimento de Etanol",
    "14_2T_2025_AOP Integridade de informações imóveis grupo",
    "NP02_1T_2024_AOP Inventário de ativos eletrônicos",
    "NP05_1T_2025_AOP Supervisora obras x CONSTRUBEM",
    "NP07_2T_2025_AOP Avaliação da contratação de média tensão Balsas",
    "NP08_2T2025_AOP Conferência de inspeções de saída (patrimonial) - DRD",
    "NP09_2T2025_AOP Conferência de inspeções de saída (patrimonial) - Nova Mutum",
    "NP11_2T_2025_AOP Avaliação da contratação de isolamentos Caldeiras Balsas",
    "NP22_2T_2025_AOP Falsificação documental homologação TGM",
    "NP25_2T_2025_AOP Recebimento de propina MF inspeções e montagens"
  ],
  "joel": [
    "29_2T_2025_AOP Verificações de inventários cíclicos OPEX 2025",
    "Verificações de inventários cíclicos OPEX 08_2025",
    "Verificações de inventários cíclicos OPEX 09_2025",
    "Verificações de inventários cíclicos OPEX 10_2025",
    "Verificações de inventários cíclicos OPEX 11_2025",
    "Verificações de inventários cíclicos OPEX 12_2025",
    "31_3T_2025_AOP Serviços de plantio Francio/serviços de locação de equipamentos estradas",
    "30_3T_2025_AOP Ciclo de compras negociações"
  ],
  "cely": [
    "08_2T_2025_ACN Validação de 10 SQLs junto com à Tetra",
    "09_2T_2025_ACN Monitoramento (Catraca x Ponto)",
    "10_2T_2025_ACN Validação do KPI de Rendimento de Etanol",
    "25_2T_2025_ACN Painel de Aderência às Recomendações da Auditoria",
    "26_2T_2025_ACN Workflow Auditoria Contínua",
    "32_3T_2025_ACN Manutenção de Rotinas no Highbond",
    "34_3T_2025_ACN Prorrogação de títulos a Pagar",
    "36_3T_2025_ACN Pagamento à funcionários CLT fora da folha de pagamento",
    "37_3T_2025_ACN Rotina de Jornada de Trabalho Fantasma - (Parte II)",
    "NP02_1T_2024_AOP Inventário de ativos eletrônicos",
    "NP18_2T_2025_ACN Desenvolvimento One Lake",
    "NP19_2T_2025_ACN Rotina de Jornada de Trabalho Fantasma (Parte I)",
    "NP20_2T_2025_ACN Integração entre o SOGI e o Painel de Obrigações",
    "NP30_3T_2025_ACN Painel de Movimentação Catraca (Obras)",
    "NP31_3T_2025_ACN Rotina de Preço Médio (Preventivo)"
  ],
  "sandra": [
    "05_2T_2025_ATC Almoxarifado Capex - Inventário e Controle de Estoque",
    "12_2T_2025_ATC Manutenção Industrial - Manutenções Externas",
    "27_2T_2025_ATC Gestão de cabos elétricos - Conformidades procedimentos de gestão BALSAS-MA",
    "NP24_2T_2025_ATC Cadastro de códigos de itens CS BRINDES",
    "NP28_2T_2025_ATC Inventário Surpresa - Almoxarifado Capex - 07_2025",
  ],
  "thayanne": [
    "03_2T_2025_ATC Processo de triangulação de nota fiscal",
    "04_2T_2025_ATC Insumos industriais - Processo de recebimento de Ureia",
    "06_2T_2025_ATC Manutenção Industrial - Indicadores KPI (ICOT)",
    "13_2T_2025_ATC Ciclo de verificação Zortea",
    "NP15_2T_2025_ACN Avaliação de Compras x Movimentação de Materiais em Estoque",
    "NP26_2T_2025_ATC Investigação venda de sucata",
    "NP27_2T_2025_ATC Medições de serviços CH Master",
    "38_3T_2025_ATC Outorgas de água",
    "NP_32_3T_2025_AOP Incêndio Torre de resfriamento SNP"
  ],
  "wellington": [
    "Supervisor de manutenção automotiva",
    "Gerente de manutenção x JÁ manutenção",
    "Fluxo de compras frotas",
    "28_3T_2025_ATC Mapear processo atrelado ao ADM Obras",
    "20_2T_2025_ATC Boletim de medições - Remodelagem de documento processo",
    "24_2T_2025_ATC Medições de contratos (criação de inspeções operacionais)"
  ],
  "bruno": [
    "08_2T_2025_ACN Validação de 10 SQLs junto com à Tetra",
    "10_2T_2025_ACN Validação do KPI de Rendimento de Etanol",
    "NP20_2T_2025_ACN Integração entre o SOGI e o Painel de Obrigações"
  ],
   "denise": [
    "38_3T_2025_ATC Outorgas de água"
  ],
   "cristian": [
    "38_3T_2025_ATC Outorgas de água"
  ]
};

// Feriados nacionais
const feriados = [
  { dia: 1, mes: 1 },   // Confraternização Universal
  { dia: 21, mes: 4 },  // Tiradentes
  { dia: 1, mes: 5 },   // Dia do Trabalho
  { dia: 7, mes: 9 },   // Independência do Brasil
  { dia: 12, mes: 10 }, // Nossa Senhora Aparecida
  { dia: 2, mes: 11 },  // Finados
  { dia: 15, mes: 11 }, // Proclamação da República
  { dia: 25, mes: 12 }  // Natal
];
function isHoliday(date) {
  return feriados.some(f => f.dia === date.getDate() && f.mes === date.getMonth() + 1);
}

// Habilita/desabilita botão Iniciar
function verifyFields() {
  startBtn.disabled = !(subsystemSelect.value && projectSelect.value && stageSelect.value);
}

// Popula etapas
function populateStages() {
  stageSelect.innerHTML = '<option value="">Selecione</option>';
  stageOptions.forEach(s => stageSelect.add(new Option(s, s)));
  verifyFields();
}

// Popula projetos
function populateProjects() {
  projectSelect.innerHTML = '<option value="">Selecione</option>';
  if (subsystemSelect.value === 'Administrativo') {
    adminOptions.forEach(p => projectSelect.add(new Option(p, p)));
  } else {
    const uname = nameField.value;
    (userProjects[uname] || []).forEach(p => projectSelect.add(new Option(p, p)));
  }
  verifyFields();
}

// Função auxiliar para preencher projetos
function fillProjectSelect(selProj, subsistema, userName) {
  selProj.innerHTML = '';
  const lista = subsistema === 'Administrativo' ? adminOptions : (userProjects[userName] || []);
  lista.forEach(p => selProj.add(new Option(p, p)));
  if (!selProj.value) selProj.selectedIndex = -1;
}

// Ações de autenticação
loginBtn.addEventListener('click', () => auth.signInWithPopup(provider));

auth.onAuthStateChanged(user => {
  if (!user) return;
  const email = user.email.toLowerCase();
  const lista = [
    'thayanne','manoel','celly','elaine','daniele',
    'hubner','izu','juliana','lacerda','joelviana',
    'pedro','rafael','raquel','sanbacetto','jakeline',
    'denise','thiago','cristian'
  ];
  userPhoto.src = (lista.find(n => email.includes(n)) || 'padrao') + '.jpg';
  const fn = user.displayName.split(' ')[0];
  userNameElem.textContent = `Olá, ${fn}!`;
  nameField.value = fn.toLowerCase();
  dateField.value = new Date().toLocaleDateString('pt-BR');

  const hoje = new Date();
  const amanha = new Date(hoje);
  amanha.setDate(hoje.getDate() + 1);
  if (isHoliday(amanha)) {
    greetingText.textContent = `Olá, ${fn}! Já feriadou aí?`;
  } else if (hoje.getDay() === 5) {
    greetingText.textContent = `Olá, ${fn}! Sextou!!!`;
  } else {
    greetingText.textContent = `Olá, ${fn}! Tenha um excelente dia!`;
  }

  const teams = {
    auditoriaTecnica: ['sandra','hubner','thayanne','denise','daniele','cristian'],
    auditoriaContinua: ['celly','manoel','thiago'],
    gestao: ['izu']
  };
  let team = 'Auditoria de Operações';
  const uname = fn.toLowerCase();
  if (teams.auditoriaTecnica.includes(uname)) team = 'Auditoria Técnica';
  else if (teams.auditoriaContinua.includes(uname)) team = 'Auditoria Contínua';
  else if (teams.gestao.includes(uname)) team = 'Gestão';
  userCellElem.textContent = `Equipe: ${team}`;

  loginBtn.style.display = 'none';
  [subsystemSelect, projectSelect, stageSelect, observationInput].forEach(el => el.disabled = false);
  populateStages();
  populateProjects();
  loadHistory();
});

// Listeners de selects
subsystemSelect.addEventListener('change', () => { populateProjects(); verifyFields(); });
stageSelect.addEventListener('change', verifyFields);
projectSelect.addEventListener('change', verifyFields);

// Timer e gravação de apontamento
let startTime, timerId;
startBtn.addEventListener('click', () => {
  startTime = new Date();
  startBtn.disabled = true;
  stopBtn.disabled = false;
  timerId = setInterval(() => {
    const diff = new Date(Date.now() - startTime);
    const hh = String(diff.getUTCHours()).padStart(2,'0');
    const mm = String(diff.getUTCMinutes()).padStart(2,'0');
    const ss = String(diff.getUTCSeconds()).padStart(2,'0');
    timerDisplay.textContent = `Tempo: ${hh}:${mm}:${ss}`;
  }, 1000);
});

stopBtn.addEventListener('click', async () => {
  clearInterval(timerId);
  const end = new Date();
  const mins = Math.floor((end - startTime) / 60000);
  const apont = {
    nome: nameField.value,
    data: dateField.value,
    subsistema: subsystemSelect.value,
    projeto: projectSelect.value,
    etapa: stageSelect.value,
    observacao: observationInput.value,
    inicio: startTime.toLocaleTimeString('pt-BR'),
    fim: end.toLocaleTimeString('pt-BR'),
    duracaoMin: mins
  };
  await db.ref('apontamentos').push(apont);
  observationInput.value = '';
  timerDisplay.textContent = 'Tempo: 00:00:00';
  startBtn.disabled = false;
  stopBtn.disabled = true;
  loadHistory();
});

// Função única de edição em célula
async function onCellEdit(key, field, newVal) {
  const ref = db.ref(`apontamentos/${key}`);
  const snap = await ref.once('value');
  const obj = snap.val() || {};
  obj[field] = newVal;
  if (['inicio','fim'].includes(field) && obj.inicio && obj.fim) {
    const [h1,m1] = obj.inicio.split(':').map(Number);
    const [h2,m2] = obj.fim.split(':').map(Number);
    obj.duracaoMin = Math.max(0, Math.floor((new Date(0,0,0,h2,m2) - new Date(0,0,0,h1,m1)) / 60000));
  }
  await ref.set(obj);
  loadHistory();
}

// Carrega histórico
async function loadHistory() {
  historyTableBody.innerHTML = '';
  const snap = await db.ref('apontamentos')
    .orderByChild('nome')
    .equalTo(nameField.value)
    .once('value');
  const entries = Object.entries(snap.val() || {});
  entries.sort(([,a],[,b]) => {
    const da = a.data.split('/').reverse().join();
    const db_ = b.data.split('/').reverse().join();
    if (db_ !== da) return db_.localeCompare(da);
    const [hA,mA] = a.inicio.split(':').map(Number);
    const [hB,mB] = b.inicio.split(':').map(Number);
    return (hB*60 + mB) - (hA*60 + mA);
  });
  for (const [key, data] of entries) {
    if (data.etapa === undefined) {
      await db.ref(`apontamentos/${key}`).update({ etapa: '' });
      data.etapa = '';
    }
    renderRow(data, key);
  }
}

// Renderiza linha de histórico
function renderRow(data, key) {
  const tr = document.createElement('tr');
  tr.dataset.key = key;

  // Data
  const tdDate = document.createElement('td');
  const inpDate = document.createElement('input');
  inpDate.type = 'date';
  const [d,m,y] = data.data.split('/');
  inpDate.value = `${y}-${m.padStart(2,'0')}-${d.padStart(2,'0')}`;
  inpDate.addEventListener('change', () => {
    const [yy,mm,dd] = inpDate.value.split('-');
    onCellEdit(key, 'data', `${dd}/${mm}/${yy}`);
  });
  tdDate.appendChild(inpDate);
  tr.appendChild(tdDate);

  // Subsistema
  const tdSub = document.createElement('td');
  const selSub = document.createElement('select');
  ['Administrativo','Auditoria','Investigação']
    .forEach(v => selSub.add(new Option(v, v)));
  selSub.value = data.subsistema || '';
  selSub.addEventListener('change', () => onCellEdit(key, 'subsistema', selSub.value));
  tdSub.appendChild(selSub);
  tr.appendChild(tdSub);

  // Projeto
  const tdProj = document.createElement('td');
  const selProj = document.createElement('select');
  fillProjectSelect(selProj, selSub.value, nameField.value);
  selProj.value = data.projeto || '';
  selProj.addEventListener('change', () => onCellEdit(key, 'projeto', selProj.value));
  tdProj.appendChild(selProj);
  tr.appendChild(tdProj);

  // Etapa
  const tdEt = document.createElement('td');
  const selEt = document.createElement('select');
  stageOptions.forEach(opt => {
    const o = new Option(opt, opt);
    if (data.etapa === opt) o.selected = true;
    selEt.add(o);
  });
  selEt.addEventListener('change', () => onCellEdit(key, 'etapa', selEt.value));
  tdEt.appendChild(selEt);
  tr.appendChild(tdEt);

  // Início
  const tdIni = document.createElement('td');
  tdIni.contentEditable = true;
  tdIni.textContent = data.inicio || '';
  tdIni.addEventListener('blur', () => onCellEdit(key, 'inicio', tdIni.textContent));
  tr.appendChild(tdIni);

  // Fim
  const tdFim = document.createElement('td');
  tdFim.contentEditable = true;
  tdFim.textContent = data.fim || '';
  tdFim.addEventListener('blur', () => onCellEdit(key, 'fim', tdFim.textContent));
  tr.appendChild(tdFim);

  // Duração
  const tdDur = document.createElement('td');
  const mn = data.duracaoMin || 0;
  tdDur.textContent = `${mn} min / ${Math.floor(mn/60)}h ${mn%60}m`;
  tr.appendChild(tdDur);

  // Observação
  const tdObs = document.createElement('td');
  const inpObs = document.createElement('input');
  inpObs.type = 'text';
  inpObs.maxLength = 100;
  inpObs.value = data.observacao || '';
  inpObs.addEventListener('change', () => onCellEdit(key, 'observacao', inpObs.value));
  tdObs.appendChild(inpObs);
  tr.appendChild(tdObs);

  // Ações
  const tdAct = document.createElement('td');
  const btnDel = document.createElement('button');
  btnDel.type = 'button';
  btnDel.textContent = '🗑️';
  btnDel.title = 'Excluir apontamento';
  btnDel.addEventListener('click', async () => {
    if (confirm('Deseja realmente excluir este apontamento?')) {
      await db.ref(`apontamentos/${key}`).remove();
      loadHistory();
    }
  });
  const btnAdd = document.createElement('button');
  btnAdd.type = 'button';
  btnAdd.textContent = '➕';
  btnAdd.title = 'Duplicar apontamento';
  btnAdd.addEventListener('click', async () => {
    const snap = await db.ref(`apontamentos/${key}`).once('value');
    await db.ref('apontamentos').push(snap.val());
    loadHistory();
  });
  tdAct.append(btnDel, btnAdd);
  tr.appendChild(tdAct);

  historyTableBody.appendChild(tr);
}