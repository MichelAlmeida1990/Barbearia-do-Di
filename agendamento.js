// agendamento.js - Sistema de agendamento para a Barbearia do DI

// Inicialização do banco de dados local
const DB = {
    init: function() {
        if (!localStorage.getItem('clientes')) {
            localStorage.setItem('clientes', JSON.stringify({}));
        }
        if (!localStorage.getItem('agendamentos')) {
            localStorage.setItem('agendamentos', JSON.stringify([]));
        }
    },
    
    // Funções para gerenciar clientes
    clientes: {
        adicionar: function(cliente) {
            const clientes = JSON.parse(localStorage.getItem('clientes'));
            clientes[cliente.telefone] = cliente;
            localStorage.setItem('clientes', JSON.stringify(clientes));
        },
        
        obter: function(telefone) {
            const clientes = JSON.parse(localStorage.getItem('clientes'));
            return clientes[telefone];
        }
    },
    
    // Funções para gerenciar agendamentos
    agendamentos: {
        adicionar: function(agendamento) {
            const agendamentos = JSON.parse(localStorage.getItem('agendamentos'));
            agendamento.id = Date.now(); // ID único baseado no timestamp
            agendamentos.push(agendamento);
            localStorage.setItem('agendamentos', JSON.stringify(agendamentos));
            return agendamento.id;
        },
        
        verificarDisponibilidade: function(data, hora) {
            const agendamentos = JSON.parse(localStorage.getItem('agendamentos'));
            return !agendamentos.some(a => a.data === data && a.hora === hora);
        }
    }
};

// Inicializa o banco de dados
DB.init();

// Função para formatar telefone
function formatarTelefone(telefone) {
    // Remove caracteres não numéricos
    const numeros = telefone.replace(/\D/g, '');
    
    // Formata o número de telefone
    if (numeros.length === 11) {
        return `(${numeros.slice(0, 2)}) ${numeros.slice(2, 7)}-${numeros.slice(7)}`;
    } else if (numeros.length === 10) {
        return `(${numeros.slice(0, 2)}) ${numeros.slice(2, 6)}-${numeros.slice(6)}`;
    }
    
    return telefone;
}

// Função para formatar data
function formatarData(data) {
    const partes = data.split('-');
    return `${partes[2]}/${partes[1]}/${partes[0]}`;
}

// Função para obter nome do serviço
function getNomeServico(codigo) {
    const servicos = {
        'corte': 'Corte de Cabelo',
        'barba': 'Barba',
        'combo': 'Combo (Corte + Barba)'
    };
    
    return servicos[codigo] || codigo;
}

// Função para obter preço do serviço
function getPrecoServico(codigo) {
    const precos = {
        'corte': 40.00,
        'barba': 35.00,
        'combo': 60.00
    };
    
    return precos[codigo] || 0;
}

// Configurar datas disponíveis (não permitir datas passadas e domingos)
function configurarDatasDisponiveis() {
    const inputData = document.getElementById('data');
    if (!inputData) return;
    
    // Define a data mínima como hoje
    const hoje = new Date();
    const ano = hoje.getFullYear();
    const mes = String(hoje.getMonth() + 1).padStart(2, '0');
    const dia = String(hoje.getDate()).padStart(2, '0');
    
    inputData.min = `${ano}-${mes}-${dia}`;
    
    // Define a data máxima como 30 dias a partir de hoje
    const trintaDiasDepois = new Date();
    trintaDiasDepois.setDate(trintaDiasDepois.getDate() + 30);
    const anoMax = trintaDiasDepois.getFullYear();
    const mesMax = String(trintaDiasDepois.getMonth() + 1).padStart(2, '0');
    const diaMax = String(trintaDiasDepois.getDate()).padStart(2, '0');
    
    inputData.max = `${anoMax}-${mesMax}-${diaMax}`;
    
    // Desabilitar domingos ao selecionar data
    inputData.addEventListener('input', function() {
        const dataSelecionada = new Date(this.value);
        if (dataSelecionada.getDay() === 0) { // 0 = Domingo
            alert('Não atendemos aos domingos. Por favor, selecione outro dia.');
            this.value = '';
        }
    });
}

// Função para pré-selecionar serviço no modal
function preencherServicoNoModal() {
    // Quando os botões de serviço são clicados
    document.querySelectorAll('.btn-schedule, .btn-promocao').forEach(btn => {
        btn.addEventListener('click', function() {
            const servico = this.getAttribute('data-servico');
            if (servico) {
                const selectServico = document.getElementById('servico');
                if (selectServico) {
                    selectServico.value = servico;
                }
            }
        });
    });
}

// Função para validar formulário
function validarFormulario() {
    const form = document.getElementById('formAgendamento');
    if (!form) return false;
    
    const nome = form.querySelector('#nome').value.trim();
    const telefone = form.querySelector('#telefone').value.trim();
    const data = form.querySelector('#data').value;
    const hora = form.querySelector('#hora').value;
    const servico = form.querySelector('#servico').value;
    const concordo = form.querySelector('#concordo').checked;
    
    if (!nome || !telefone || !data || !hora || !servico || !concordo) {
        alert('Por favor, preencha todos os campos obrigatórios.');
        return false;
    }
    
    // Validar formato do telefone (simplificado)
    const telefoneNumeros = telefone.replace(/\D/g, '');
    if (telefoneNumeros.length < 10 || telefoneNumeros.length > 11) {
        alert('Por favor, informe um número de telefone válido.');
        return false;
    }
    
    // Verificar disponibilidade do horário
    if (!DB.agendamentos.verificarDisponibilidade(data, hora)) {
        alert('Este horário já está reservado. Por favor, escolha outro horário.');
        return false;
    }
    
    return true;
}

// Função para processar o agendamento
function processarAgendamento() {
    if (!validarFormulario()) return;
    
    const form = document.getElementById('formAgendamento');
    
    // Obter dados do formulário
    const nome = form.querySelector('#nome').value.trim();
    const telefone = form.querySelector('#telefone').value.trim();
    const telefoneFormatado = formatarTelefone(telefone);
    const data = form.querySelector('#data').value;
    const hora = form.querySelector('#hora').value;
    const servico = form.querySelector('#servico').value;
    const barbeiro = form.querySelector('#barbeiro').value;
    const observacoes = form.querySelector('#observacoes').value.trim();
    
    // Cadastrar ou atualizar cliente
    const cliente = {
        nome: nome,
        telefone: telefoneFormatado,
        ultimoAgendamento: new Date().toISOString()
    };
    
    DB.clientes.adicionar(cliente);
    
    // Criar agendamento
    const agendamento = {
        telefoneCliente: telefoneFormatado,
        nomeCliente: nome,
        data: data,
        hora: hora,
        servico: servico,
        nomeServico: getNomeServico(servico),
        preco: getPrecoServico(servico),
        barbeiro: barbeiro,
        observacoes: observacoes,
        status: 'agendado',
        dataCriacao: new Date().toISOString()
    };
    
    // Salvar agendamento
    const idAgendamento = DB.agendamentos.adicionar(agendamento);
    
    // Mostrar confirmação
    exibirConfirmacao(agendamento);
    
    // Fechar modal de agendamento
    const modalAgendamento = bootstrap.Modal.getInstance(document.getElementById('agendamentoModal'));
    modalAgendamento.hide();
    
    // Limpar formulário
    form.reset();
}

// Função para exibir confirmação
function exibirConfirmacao(agendamento) {
    const detalhesDiv = document.getElementById('detalhesAgendamento');
    
    detalhesDiv.innerHTML = `
        <div class="confirmation-details">
            <p><strong>Nome:</strong> ${agendamento.nomeCliente}</p>
            <p><strong>Data:</strong> ${formatarData(agendamento.data)}</p>
            <p><strong>Horário:</strong> ${agendamento.hora}</p>
            <p><strong>Serviço:</strong> ${agendamento.nomeServico}</p>
            <p><strong>Valor:</strong> R$ ${agendamento.preco.toFixed(2)}</p>
            ${agendamento.barbeiro ? `<p><strong>Barbeiro:</strong> ${agendamento.barbeiro}</p>` : ''}
        </div>
    `;
    
    // Abrir modal de confirmação
    const modalConfirmacao = new bootstrap.Modal(document.getElementById('confirmacaoModal'));
    modalConfirmacao.show();
}

// Inicializar quando o documento estiver pronto
document.addEventListener('DOMContentLoaded', function() {
    // Configurar datas disponíveis
    configurarDatasDisponiveis();
    
    // Configurar pré-seleção de serviço
    preencherServicoNoModal();
    
    // Configurar botão de confirmar agendamento
    const btnConfirmar = document.getElementById('btnConfirmarAgendamento');
    if (btnConfirmar) {
        btnConfirmar.addEventListener('click', processarAgendamento);
    }
    
    // Máscara para telefone
    const inputTelefone = document.getElementById('telefone');
    if (inputTelefone) {
        inputTelefone.addEventListener('input', function() {
            let valor = this.value.replace(/\D/g, '');
            
            if (valor.length > 0) {
                // Limita a 11 dígitos
                valor = valor.substring(0, 11);
                
                // Aplica a máscara
                if (valor.length > 2) {
                    valor = `(${valor.substring(0, 2)}) ${valor.substring(2)}`;
                }
                if (valor.length > 10) {
                    valor = `${valor.substring(0, 10)}-${valor.substring(10)}`;
                }
            }
            
            this.value = valor;
        });
    }
});
