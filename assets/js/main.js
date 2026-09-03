/* ============================================================
   SMART CONTROL - main.js
   JavaScript Vanilla + jQuery (apenas para máscara de telefone)
   Organizado por blocos funcionais.
============================================================ */

/* ========================================
   CHAVES DE LOCALSTORAGE (evita strings soltas)
======================================== */
const CHAVE_USUARIO = "usuarioSmartControl";
const CHAVE_DISPOSITIVOS = "smartControlDispositivos";
const CHAVE_TEMA = "smartControlTema";

/* ========================================
   RELÓGIO + SAUDAÇÃO
======================================== */
const elementoSaudacao = document.querySelector("#saudacao");
const elementoHora = document.querySelector("#hora");
const elementoData = document.querySelector("#data");

const usuarioSalvo = localStorage.getItem(CHAVE_USUARIO);
let nomeVariavel = "Usuário";

if (usuarioSalvo) {
    const usuario = JSON.parse(usuarioSalvo);
    if (usuario.nome) {
        nomeVariavel = usuario.nome;
    }
}

const diasSemana = [
    "Domingo", "Segunda-feira", "Terça-feira", "Quarta-feira",
    "Quinta-feira", "Sexta-feira", "Sábado"
];

function saudacaoPorHorario(hora) {
    if (hora < 12) return "Bom dia";
    if (hora < 18) return "Boa tarde";
    return "Boa noite";
}

function atualizarRelogio() {
    const agora = new Date();

    const dia = String(agora.getDate()).padStart(2, "0");
    const mes = String(agora.getMonth() + 1).padStart(2, "0");
    const hora = String(agora.getHours()).padStart(2, "0");
    const minuto = String(agora.getMinutes()).padStart(2, "0");
    const segundo = String(agora.getSeconds()).padStart(2, "0");

    if (elementoSaudacao) {
        elementoSaudacao.textContent =
            `${saudacaoPorHorario(agora.getHours())}, ${nomeVariavel}!`;
    }

    if (elementoHora) {
        elementoHora.textContent = `${hora}:${minuto}:${segundo}`;
    }

    if (elementoData) {
        elementoData.textContent =
            `${diasSemana[agora.getDay()]}, ${dia}/${mes}/${agora.getFullYear()}`;
    }
}

atualizarRelogio();
setInterval(atualizarRelogio, 1000);

/* ========================================
   BUSCA (tabela de acessos recentes)
======================================== */
const campoBusca = document.querySelector("#campoBusca");

if (campoBusca) {
    campoBusca.addEventListener("input", function () {
        const texto = this.value.toLowerCase();

        document.querySelectorAll("tbody tr").forEach(function (linha) {
            const primeiraCelula = linha.querySelector("td");
            if (!primeiraCelula) return;

            linha.style.display =
                primeiraCelula.textContent.toLowerCase().includes(texto)
                    ? ""
                    : "none";
        });
    });
}

/* ========================================
   TEMA CLARO / ESCURO (persistente entre páginas)
======================================== */
const botaoTema = document.querySelector("#botaoTema");

function aplicarTema(tema) {
    if (tema === "light") {
        document.body.classList.remove("dark-theme");
        if (botaoTema) botaoTema.textContent = "🌙 Dark Mode";
    } else {
        document.body.classList.add("dark-theme");
        if (botaoTema) botaoTema.textContent = "☀️ Light Mode";
    }
}

// tema padrão do projeto é o escuro (identidade visual original)
const temaSalvo = localStorage.getItem(CHAVE_TEMA) || "dark";
aplicarTema(temaSalvo);

if (botaoTema) {
    botaoTema.addEventListener("click", function () {
        const novoTema = document.body.classList.contains("dark-theme")
            ? "light"
            : "dark";

        aplicarTema(novoTema);
        localStorage.setItem(CHAVE_TEMA, novoTema);
    });
}

/* ========================================
   ACCORDION - LINKS ÚTEIS
======================================== */
const botaoLinks = document.querySelector("#botaoLinks");
const painelLinks = document.querySelector("#painelLinks");
const iconeLinks = document.querySelector("#iconeLinks");

if (botaoLinks && painelLinks) {
    botaoLinks.setAttribute("aria-expanded", "false");

    botaoLinks.addEventListener("click", function () {
        const aberto = painelLinks.classList.toggle("aberto");

        botaoLinks.setAttribute("aria-expanded", String(aberto));

        if (iconeLinks) {
            iconeLinks.textContent = aberto ? "▲" : "▼";
        }
    });
}

/* ========================================
   VALIDADORES REUTILIZÁVEIS (Regex)
======================================== */
function emailValido(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function telefoneValido(telefone) {
    return /^\(\d{2}\) \d{5}-\d{4}$/.test(telefone);
}

function cpfValido(cpf) {
    return /^\d{3}\.\d{3}\.\d{3}-\d{2}$/.test(cpf);
}

function ipValido(ip) {
    const ipRegex =
        /^(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}$/;
    return ipRegex.test(ip);
}

/* ========================================
   MÁSCARAS JQUERY (CPF / Telefone)
======================================== */
if (typeof $ !== "undefined") {
    $(document).ready(function () {
        if ($("#cpf").length) $("#cpf").mask("000.000.000-00");
        if ($("#telefone").length) $("#telefone").mask("(00) 00000-0000");
        if ($("#telefoneSuporte").length) $("#telefoneSuporte").mask("(00) 00000-0000");
    });
}

/* ========================================
   CADASTRO DE USUÁRIO
======================================== */
const formCadastro = document.querySelector("#formCadastro");

if (formCadastro) {
    formCadastro.addEventListener("submit", function (event) {
        event.preventDefault();

        const nome = document.querySelector("#nome").value.trim();
        const cpf = document.querySelector("#cpf").value.trim();
        const email = document.querySelector("#email").value.trim();
        const telefone = document.querySelector("#telefone").value.trim();
        const senha = document.querySelector("#senha").value;
        const confirmarSenha = document.querySelector("#confirmarSenha").value;
        const cargo = document.querySelector("#cargo").value;
        const turno = document.querySelector("#turno").value;
        const termos = document.querySelector("#termos");

        if (nome.length < 3) {
            alert("Digite o nome completo!");
            return;
        }

        if (!cpfValido(cpf)) {
            alert("Digite o CPF no formato 000.000.000-00!");
            return;
        }

        if (!emailValido(email)) {
            alert("Digite um e-mail válido!");
            return;
        }

        if (!telefoneValido(telefone)) {
            alert("Digite o telefone no formato (00) 00000-0000!");
            return;
        }

        if (senha.length < 8) {
            alert("A senha deve possuir pelo menos 8 caracteres!");
            return;
        }

        if (senha !== confirmarSenha) {
            alert("As senhas não são iguais!");
            return;
        }

        if (!cargo) {
            alert("Selecione um cargo!");
            return;
        }

        if (!turno) {
            alert("Selecione um turno!");
            return;
        }

        if (termos && !termos.checked) {
            alert("Você precisa aceitar os termos de uso!");
            return;
        }

        // Permissões (checkboxes opcionais)
        const permissoes = [];
        ["relatorios", "usuarios", "configuracoes"].forEach(function (id) {
            const campo = document.querySelector("#" + id);
            if (campo && campo.checked) permissoes.push(id);
        });

        const usuario = { nome, cpf, email, telefone, cargo, turno, permissoes };

        localStorage.setItem(CHAVE_USUARIO, JSON.stringify(usuario));

        alert(`Cadastro realizado com sucesso, ${nome}!`);

        formCadastro.reset();

        window.location.href = "dashboard.html";
    });
}

/* ========================================
   MOSTRAR USUÁRIO NO DASHBOARD
======================================== */
if (usuarioSalvo) {
    const usuario = JSON.parse(usuarioSalvo);

    const nomeUsuario = document.querySelector("#nomeUsuario");
    const cargoUsuario = document.querySelector("#cargoUsuario");
    const turnoUsuario = document.querySelector("#turnoUsuario");

    if (nomeUsuario) nomeUsuario.textContent = `Nome: ${usuario.nome}`;
    if (cargoUsuario) cargoUsuario.textContent = `Cargo: ${usuario.cargo}`;
    if (turnoUsuario) turnoUsuario.textContent = `Turno: ${usuario.turno}`;
}

/* ========================================
   FILTRO DE DIGITAÇÃO DO CAMPO IP
======================================== */
const campoIP = document.querySelector("#ipDispositivo");

if (campoIP) {
    campoIP.addEventListener("input", function () {
        this.value = this.value.replace(/[^0-9.]/g, "");
    });
}

/* ========================================
   CADASTRO DE DISPOSITIVOS
======================================== */
const formDispositivo = document.querySelector("#formDispositivo");
const listaDispositivos = document.querySelector("#listaDispositivos");

function lerDispositivos() {
    const dados = localStorage.getItem(CHAVE_DISPOSITIVOS);
    return dados ? JSON.parse(dados) : [];
}

function salvarDispositivos(lista) {
    localStorage.setItem(CHAVE_DISPOSITIVOS, JSON.stringify(lista));
}

if (formDispositivo) {
    formDispositivo.addEventListener("submit", function (event) {
        event.preventDefault();

        const nome = document.querySelector("#nomeDispositivo").value.trim();
        const tipo = document.querySelector("#tipoDispositivo").value;
        const ip = document.querySelector("#ipDispositivo").value.trim();
        const statusBase = document.querySelector("#statusDispositivo").value;

        if (nome.length < 2) {
            alert("Digite um nome para o dispositivo!");
            return;
        }

        if (!tipo) {
            alert("Selecione o tipo do dispositivo!");
            return;
        }

        if (!ipValido(ip)) {
            alert("Digite um endereço IP válido! Ex: 192.168.0.100");
            return;
        }

        if (!statusBase) {
            alert("Selecione o status inicial do dispositivo!");
            return;
        }

        const dispositivos = lerDispositivos();

        const dispositivo = {
            id: Date.now(),
            nome,
            tipo,
            ip,
            statusBase,     // status definido manualmente (Ativo / Inativo)
            emAlerta: false, // calculado pela telemetria
            inicializando: true
        };

        dispositivos.push(dispositivo);
        salvarDispositivos(dispositivos);

        alert("Dispositivo cadastrado com sucesso!");

        formDispositivo.reset();

        renderizarDispositivos();

        // Simula o "boot" do dispositivo antes da primeira leitura real
        // (uso de setTimeout, conforme exigido pela atividade)
        setTimeout(function () {
            const listaAtual = lerDispositivos();
            const alvo = listaAtual.find(function (d) { return d.id === dispositivo.id; });

            if (alvo) {
                alvo.inicializando = false;
                salvarDispositivos(listaAtual);
                renderizarDispositivos();
            }
        }, 1500);
    });
}

/* ---------- Faixas de telemetria por tipo de dispositivo ---------- */
const FAIXAS_TELEMETRIA = {
    "Sensor": {
        campos: [
            { chave: "temperatura", rotulo: "Temperatura", unidade: "°C", min: 15, max: 45, limite: 40 },
            { chave: "umidade", rotulo: "Umidade", unidade: "%", min: 20, max: 90, limite: 85 }
        ]
    },
    "Câmera": {
        campos: [
            { chave: "consumo", rotulo: "Consumo", unidade: "W", min: 5, max: 40, limite: 35 },
            { chave: "sinal", rotulo: "Sinal", unidade: "%", min: 10, max: 100, limite: 20, alertaAbaixoDoLimite: true }
        ]
    },
    "Controlador": {
        campos: [
            { chave: "pressao", rotulo: "Pressão", unidade: "bar", min: 0.5, max: 10, limite: 8.5 }
        ]
    },
    "Motor": {
        campos: [
            { chave: "velocidade", rotulo: "Velocidade", unidade: "RPM", min: 0, max: 3000, limite: 2800 },
            { chave: "consumo", rotulo: "Consumo", unidade: "W", min: 50, max: 500, limite: 450 }
        ]
    }
};

function numeroAleatorio(min, max, casas) {
    const valor = min + Math.random() * (max - min);
    return Number(valor.toFixed(casas));
}

/* ---------- Renderização dos cards de dispositivos ---------- */
function statusExibido(dispositivo) {
    if (dispositivo.statusBase === "Inativo") return "Inativo";
    return dispositivo.emAlerta ? "Alerta" : "Ativo";
}

function classeStatus(status) {
    if (status === "Inativo") return "status-inativo";
    if (status === "Alerta") return "status-alerta";
    return "status-ativo";
}

function badgeStatus(status) {
    const classe = status === "Alerta" ? "alerta" : (status === "Inativo" ? "inativo" : "ativo");
    return `<span class="badge-status ${classe}"><span class="dot"></span>${status}</span>`;
}

function renderizarDispositivos() {
    if (!listaDispositivos) return;

    const dispositivos = lerDispositivos();

    if (dispositivos.length === 0) {
        listaDispositivos.innerHTML = "<p>Nenhum dispositivo cadastrado.</p>";
        return;
    }

    listaDispositivos.innerHTML = "";

    dispositivos.forEach(function (dispositivo) {
        const status = statusExibido(dispositivo);

        const card = document.createElement("div");
        card.classList.add("card-dispositivo", classeStatus(status));
        card.dataset.id = dispositivo.id;

        let corpoTelemetria = '<p class="dispositivo-inicializando">Inicializando dispositivo...</p>';

        if (!dispositivo.inicializando) {
            if (status === "Inativo") {
                corpoTelemetria = "<p>Dispositivo inativo — sem leituras de telemetria.</p>";
            } else {
                const faixas = FAIXAS_TELEMETRIA[dispositivo.tipo] || { campos: [] };

                corpoTelemetria = faixas.campos.map(function (campo) {
                    return `<p><span class="campo-telemetria" data-campo="${campo.chave}">-- ${campo.unidade}</span> <small>(${campo.rotulo})</small></p>`;
                }).join("");

                corpoTelemetria += `<p class="alerta-telemetria">✅ Funcionamento normal</p>`;
            }
        }

        card.innerHTML = `
            <h3>${dispositivo.nome} ${badgeStatus(status)}</h3>
            <p><strong>Tipo:</strong> ${dispositivo.tipo}</p>
            <p><strong>IP:</strong> ${dispositivo.ip}</p>
            <div class="telemetria" aria-live="polite">
                <hr>
                ${corpoTelemetria}
            </div>
        `;

        listaDispositivos.appendChild(card);
    });
}

renderizarDispositivos();

/* ========================================
   TELEMETRIA + ALERTAS (setInterval)
======================================== */
function atualizarTelemetria() {
    const dispositivos = lerDispositivos();
    if (dispositivos.length === 0) return;

    let houveMudancaDeStatus = false;
    let ativos = 0;
    let emAlerta = 0;

    dispositivos.forEach(function (dispositivo) {
        if (dispositivo.inicializando || dispositivo.statusBase === "Inativo") {
            if (dispositivo.statusBase !== "Inativo") ativos++;
            return;
        }

        const faixas = FAIXAS_TELEMETRIA[dispositivo.tipo] || { campos: [] };
        const card = listaDispositivos
            ? listaDispositivos.querySelector(`.card-dispositivo[data-id="${dispositivo.id}"]`)
            : null;

        let algumForaDoLimite = false;

        faixas.campos.forEach(function (campo) {
            const valor = numeroAleatorio(campo.min, campo.max, 1);

            const foraDoLimite = campo.alertaAbaixoDoLimite
                ? valor <= campo.limite
                : valor >= campo.limite;

            if (foraDoLimite) algumForaDoLimite = true;

            if (card) {
                const elemento = card.querySelector(`[data-campo="${campo.chave}"]`);
                if (elemento) elemento.textContent = `${valor} ${campo.unidade}`;
            }
        });

        const estavaEmAlerta = dispositivo.emAlerta;
        dispositivo.emAlerta = algumForaDoLimite;

        if (estavaEmAlerta !== dispositivo.emAlerta) {
            houveMudancaDeStatus = true;
        }

        if (dispositivo.emAlerta) {
            emAlerta++;
        } else {
            ativos++;
        }

        if (card) {
            const mensagem = card.querySelector(".alerta-telemetria");
            if (mensagem) {
                mensagem.textContent = dispositivo.emAlerta
                    ? "⚠️ Alerta: valor fora da faixa segura!"
                    : "✅ Funcionamento normal";
            }
        }
    });

    salvarDispositivos(dispositivos);

    // Só re-renderiza os cards inteiros quando algum status realmente mudou,
    // evitando piscar a tela sem necessidade.
    if (houveMudancaDeStatus) {
        renderizarDispositivos();
    }

    atualizarGraficoTelemetria(ativos, emAlerta);
}

setInterval(atualizarTelemetria, 2000);
atualizarTelemetria();

/* ========================================
   GRÁFICO DE TELEMETRIA (Chart.js)
======================================== */
let graficoTelemetria = null;
const historicoLabels = [];
const historicoAtivos = [];
const historicoAlertas = [];
const LIMITE_PONTOS = 15;

function inicializarGrafico() {
    const canvas = document.querySelector("#graficoTelemetria");
    if (!canvas || typeof Chart === "undefined") return;

    graficoTelemetria = new Chart(canvas, {
        type: "line",
        data: {
            labels: historicoLabels,
            datasets: [
                {
                    label: "Dispositivos ativos",
                    data: historicoAtivos,
                    borderColor: "#9b5de5",
                    backgroundColor: "rgba(155, 93, 229, 0.2)",
                    tension: 0.3,
                    fill: true
                },
                {
                    label: "Dispositivos em alerta",
                    data: historicoAlertas,
                    borderColor: "#ff6b6b",
                    backgroundColor: "rgba(255, 107, 107, 0.2)",
                    tension: 0.3,
                    fill: true
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            animation: { duration: 300 },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: { color: "#c99cff", precision: 0 },
                    grid: { color: "rgba(155, 93, 229, 0.15)" }
                },
                x: {
                    ticks: { color: "#c99cff" },
                    grid: { color: "rgba(155, 93, 229, 0.05)" }
                }
            },
            plugins: {
                legend: { labels: { color: "#ffffff" } }
            }
        }
    });
}

function atualizarGraficoTelemetria(ativos, emAlerta) {
    const canvas = document.querySelector("#graficoTelemetria");
    if (!canvas) return;

    if (!graficoTelemetria) {
        inicializarGrafico();
        if (!graficoTelemetria) return;
    }

    const agora = new Date();
    const rotulo =
        String(agora.getHours()).padStart(2, "0") + ":" +
        String(agora.getMinutes()).padStart(2, "0") + ":" +
        String(agora.getSeconds()).padStart(2, "0");

    historicoLabels.push(rotulo);
    historicoAtivos.push(ativos);
    historicoAlertas.push(emAlerta);

    if (historicoLabels.length > LIMITE_PONTOS) {
        historicoLabels.shift();
        historicoAtivos.shift();
        historicoAlertas.shift();
    }

    graficoTelemetria.update();
}

/* ========================================
   FORMULÁRIO DE SUPORTE
======================================== */
const formSuporte = document.querySelector("#formSuporte");

if (formSuporte) {
    const mensagemSucesso = document.querySelector("#mensagemSucessoSuporte");

    formSuporte.addEventListener("submit", function (event) {
        event.preventDefault();

        const nome = document.querySelector("#nomeSuporte").value.trim();
        const email = document.querySelector("#emailSuporte").value.trim();
        const telefone = document.querySelector("#telefoneSuporte").value.trim();
        const assunto = document.querySelector("#assuntoSuporte").value;
        const mensagem = document.querySelector("#mensagemSuporte").value.trim();

        if (nome.length < 3) {
            alert("Digite seu nome completo!");
            return;
        }

        if (!emailValido(email)) {
            alert("Digite um e-mail válido!");
            return;
        }

        if (!telefoneValido(telefone)) {
            alert("Digite o telefone no formato (00) 00000-0000!");
            return;
        }

        if (!assunto) {
            alert("Selecione o assunto da solicitação!");
            return;
        }

        if (mensagem.length < 10) {
            alert("Descreva sua solicitação com pelo menos 10 caracteres!");
            return;
        }

        // Em um sistema real, aqui seria feito o envio para um servidor.
        // Como o projeto é client-side, apenas confirmamos visualmente.
        if (mensagemSucesso) {
            mensagemSucesso.textContent =
                `Solicitação enviada com sucesso! Em breve entraremos em contato pelo e-mail ${email}.`;
            mensagemSucesso.classList.add("visivel");
        } else {
            alert("Solicitação enviada com sucesso!");
        }

        formSuporte.reset();
    });

    formSuporte.addEventListener("reset", function () {
        if (mensagemSucesso) mensagemSucesso.classList.remove("visivel");
    });
}
