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
const userProjects = {"José": [
    "classificação de grãos",
    "Destilaria e apontamentos"
  ],
  "maria": [
    "Inventários",
    "Controle de Diesel",
    "Fluxo frotas",
    "Investigação 07 - Conferência de pagamento dos transportadores"
  ],
  "pedro": [
    "Frota de veículo",
    "Estoque de Milho"
  ],
  "natasha": [
    "NP16_2T_2025_AOP Due dilligence fornecedores"
  ],
  "miguel": [
    "projetos iniciais de obras",
    "planejamento de materiais de obras CAPEX"
  ],
  "leticia": [
    "Investigação",
    "Balanço Patrimonial"
  ],
  "josefina": [
  "Demandas Etanol",
  "Cavaco e biomassas"
  ],
  "lucas": [
    "procedimento de uso de aguas"
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
    'jose','maria','pedro','natasha','miguel',
    'leticia','josefina','lucas'
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
    auditoriaTecnica: ['natasha','pedro'],
    auditoriaContinua: ['maria','leticia','lucas'],
    gestao: ['jose']
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
