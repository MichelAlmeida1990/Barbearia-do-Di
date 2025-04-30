// Script para a página de atendimento virtual

document.addEventListener('DOMContentLoaded', function() {
    // Elementos do DOM
    const chatMessages = document.getElementById('chat-messages');
    const messageInput = document.getElementById('message-input');
    const sendButton = document.getElementById('send-button');
    const iniciarChatBtn = document.getElementById('iniciar-chat');
    const iniciarChatCtaBtn = document.getElementById('iniciar-chat-cta');
    const chatFloatButton = document.getElementById('chat-float-button');
    const agendarHorarioBtn = document.getElementById('agendar-horario');
    const chatSection = document.getElementById('chat-section');
    const chatContainer = document.querySelector('.chat-container');
    const chatOffline = document.getElementById('chat-offline');

    // Verificar horário de funcionamento do chat
    function verificarHorarioFuncionamento() {
        // Para testes: sempre retorna true (chat sempre disponível)
        return true;
        
        /* Código original comentado para referência futura
        const agora = new Date();
        const diaSemana = agora.getDay(); // 0 = Domingo, 1 = Segunda, ..., 6 = Sábado
        const hora = agora.getHours();

        // Simulação de horário de funcionamento
        // Segunda a Sexta (1-5): 9h às 19h
        // Sábado (6): 9h às 17h
        // Domingo (0): fechado
        
        if (diaSemana === 0) {
            return false; // Domingo fechado
        } else if (diaSemana >= 1 && diaSemana <= 5) {
            return (hora >= 9 && hora < 19); // Segunda a Sexta: 9h às 19h
        } else if (diaSemana === 6) {
            return (hora >= 9 && hora < 17); // Sábado: 9h às 17h
        }
        
        return false;
        */
    }

    // Inicializar estado do chat
    function inicializarChat() {
        const chatAberto = verificarHorarioFuncionamento();
        
        if (chatAberto) {
            chatContainer.style.display = 'flex';
            chatOffline.style.display = 'none';
            
            // Mensagem de boas-vindas inicial
            setTimeout(() => {
                adicionarMensagem('Olá! Bem-vindo à Barbearia do DI. Como posso ajudar você hoje?', 'received');
            }, 500);
            
            // Mensagens de boas-vindas adicionais após um pequeno delay
            setTimeout(() => {
                adicionarMensagem('Posso fornecer informações sobre nossos serviços ou ajudar a agendar um horário. Como posso ser útil?', 'received');
            }, 1500);
        } else {
            chatContainer.style.display = 'none';
            chatOffline.style.display = 'block';
        }
    }

    // Função para rolar o chat para o final
    function scrollToBottom() {
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    // Adicionar mensagem ao chat
    function adicionarMensagem(texto, tipo) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${tipo}`;
        
        const messageContent = document.createElement('div');
        messageContent.className = 'message-content';
        
        const messageText = document.createElement('p');
        messageText.innerHTML = texto; // Usando innerHTML para permitir formatação HTML
        
        const messageTime = document.createElement('span');
        messageTime.className = 'message-time';
        messageTime.textContent = obterHoraAtual();
        
        messageContent.appendChild(messageText);
        messageContent.appendChild(messageTime);
        messageDiv.appendChild(messageContent);
        
        chatMessages.appendChild(messageDiv);
        scrollToBottom();
    }

    // Obter hora atual formatada
    function obterHoraAtual() {
        const agora = new Date();
        let horas = agora.getHours();
        let minutos = agora.getMinutes();
        
        // Formatar para sempre ter dois dígitos
        horas = horas < 10 ? '0' + horas : horas;
        minutos = minutos < 10 ? '0' + minutos : minutos;
        
        return `${horas}:${minutos}`;
    }

    // Mostrar indicador de digitação
    function mostrarDigitando() {
        const typingDiv = document.createElement('div');
        typingDiv.className = 'typing';
        typingDiv.id = 'typing-indicator';
        
        const typingIndicator = document.createElement('div');
        typingIndicator.className = 'typing-indicator';
        
        for (let i = 0; i < 3; i++) {
            const dot = document.createElement('div');
            dot.className = 'typing-dot';
            typingIndicator.appendChild(dot);
        }
        
        typingDiv.appendChild(typingIndicator);
        chatMessages.appendChild(typingDiv);
        scrollToBottom();
    }

    // Remover indicador de digitação
    function removerDigitando() {
        const typingIndicator = document.getElementById('typing-indicator');
        if (typingIndicator) {
            typingIndicator.remove();
        }
    }

    // Função para lidar com pedidos de agendamento
    function processarAgendamento(mensagem) {
        const msgLower = mensagem.toLowerCase();
        
        if (msgLower.includes("agendar") || msgLower.includes("marcar") || msgLower.includes("horário") || msgLower.includes("reservar")) {
            let dia = "hoje";
            
            if (msgLower.includes("amanhã") || msgLower.includes("dia seguinte")) {
                dia = "amanhã";
            }
            
            let servico = "";
            if (msgLower.includes("corte")) servico = "corte de cabelo";
            else if (msgLower.includes("barba")) servico = "barba";
            else if (msgLower.includes("sobrancelha")) servico = "design de sobrancelha";
            else if (msgLower.includes("completo") || msgLower.includes("combo")) servico = "combo completo";
            
            let horario = null;
            const regexHorario = /(\d{1,2})[h:]\d{0,2}/;
            const matchHorario = msgLower.match(regexHorario);
            if (matchHorario) {
                horario = matchHorario[0];
            }
            
            mostrarDigitando();
            
            setTimeout(() => {
                removerDigitando();
                
                if (servico && horario) {
                    adicionarMensagem(`Ótimo! Vou verificar a disponibilidade para ${servico} ${dia} às ${horario}.`, 'received');
                    
                    setTimeout(() => {
                        mostrarDigitando();
                        
                        setTimeout(() => {
                            removerDigitando();
                            adicionarMensagem("✅ Horário disponível! Para confirmar seu agendamento, preciso de algumas informações:", 'received');
                            
                            setTimeout(() => {
                                mostrarDigitando();
                                
                                setTimeout(() => {
                                    removerDigitando();
                                    adicionarMensagem("1. Seu nome completo<br>2. Telefone para contato<br><br>Ou se preferir, você pode agendar diretamente pelo nosso sistema online clicando aqui: <a href='agendamento.html' class='text-primary'>Sistema de Agendamento</a>", 'received');
                                }, 1000);
                            }, 500);
                        }, 1500);
                    }, 1000);
                } else if (servico) {
                    adicionarMensagem(`Entendi que você quer agendar ${servico} para ${dia}. Qual horário você prefere?`, 'received');
                } else {
                    adicionarMensagem(`Posso ajudar com seu agendamento para ${dia}. Qual serviço você deseja e em qual horário?`, 'received');
                }
            }, 1500);
            
            return true; // Indica que a mensagem foi tratada como agendamento
        }
        
        return false; // Não é um pedido de agendamento
    }

    // Simular resposta do atendente
    function simularRespostaAtendente(mensagemUsuario) {
        // Primeiro, verifica se é um pedido de agendamento
        if (processarAgendamento(mensagemUsuario)) {
            return; // Se for agendamento, encerra aqui
        }
        
        mostrarDigitando();
        
        // Tempo aleatório entre 1 e 3 segundos para simular digitação
        const tempoResposta = Math.floor(Math.random() * 2000) + 1000;
        
        setTimeout(() => {
            removerDigitando();
            
            let resposta = '';
            const msgLower = mensagemUsuario.toLowerCase();
            
            // Respostas automatizadas baseadas em palavras-chave
            if (msgLower.includes('horário') || 
                msgLower.includes('hora') || 
                msgLower.includes('funcionamento')) {
                resposta = 'Nosso horário de funcionamento é de segunda a sexta das 9h às 20h, sábados das 9h às 18h e domingos das 9h às 13h.';
            } 
            else if (msgLower.includes('preço') || 
                     msgLower.includes('valor') || 
                     msgLower.includes('custo')) {
                resposta = 'Nossos preços variam conforme o serviço:<br>- Corte de cabelo: a partir de R$ 45,00<br>- Barba: a partir de R$ 35,00<br>- Combo (corte + barba): R$ 70,00<br>- Design de sobrancelha: R$ 20,00<br><br>Qual serviço você tem interesse?';
            }
            else if (msgLower.includes('corte') || 
                     msgLower.includes('cabelo')) {
                resposta = 'Temos diversos estilos de corte disponíveis. Você prefere algo mais tradicional ou moderno? Nossos barbeiros são especialistas em degradê, disfarçado, social, entre outros estilos.';
            }
            else if (msgLower.includes('barba')) {
                resposta = 'Para barba oferecemos aparagem simples, modelagem completa e tratamentos especiais com produtos premium. Qual serviço você tem interesse?';
            }
            else if (msgLower.includes('obrigado') || 
                     msgLower.includes('valeu') || 
                     msgLower.includes('agradeço')) {
                resposta = 'Por nada! Estamos sempre à disposição. Esperamos vê-lo em breve na Barbearia do DI!';
            }
            else if (msgLower.includes('endereço') || 
                     msgLower.includes('localização') || 
                     msgLower.includes('onde fica')) {
                resposta = 'Estamos localizados na Rua da Barbearia, 123 - Centro. Temos estacionamento próprio para clientes!';
            }
            else if (msgLower.includes('estacionamento') || 
                     msgLower.includes('parar') || 
                     msgLower.includes('carro')) {
                resposta = 'Sim, temos estacionamento próprio e gratuito para nossos clientes.';
            }
            else if (msgLower.includes('pagamento') || 
                     msgLower.includes('cartão') || 
                     msgLower.includes('pix')) {
                resposta = 'Aceitamos diversas formas de pagamento: dinheiro, cartões de crédito/débito, Pix e transferência bancária.';
            }
            else if (msgLower.includes('cancelar') || 
                     msgLower.includes('desmarcar')) {
                resposta = 'Para cancelar ou remarcar um agendamento, por favor, informe seu nome completo e a data/horário agendado. Pedimos que cancele com pelo menos 2 horas de antecedência.';
            }
            else {
                resposta = 'Obrigado pelo contato! Como posso ajudar com nossos serviços de barbearia? Temos cortes, barba, tratamentos capilares e muito mais.';
            }
            
            adicionarMensagem(resposta, 'received');
        }, tempoResposta);
    }

    // Enviar mensagem
    function enviarMensagem() {
        const mensagem = messageInput.value.trim();
        
        if (mensagem !== '') {
            adicionarMensagem(mensagem, 'sent');
            messageInput.value = '';
            
            // Simular resposta do atendente
            simularRespostaAtendente(mensagem);
        }
    }

    // Event Listeners
    sendButton.addEventListener('click', enviarMensagem);
    
    messageInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            enviarMensagem();
        }
    });
    
    if (iniciarChatBtn) {
        iniciarChatBtn.addEventListener('click', function() {
            chatSection.scrollIntoView({ behavior: 'smooth' });
        });
    }
    
    if (iniciarChatCtaBtn) {
        iniciarChatCtaBtn.addEventListener('click', function() {
            chatSection.scrollIntoView({ behavior: 'smooth' });
        });
    }
    
    if (chatFloatButton) {
        chatFloatButton.addEventListener('click', function() {
            chatSection.scrollIntoView({ behavior: 'smooth' });
        });
    }
    
    if (agendarHorarioBtn) {
        agendarHorarioBtn.addEventListener('click', function() {
            window.location.href = 'agendamento.html';
        });
    }

    // Inicializar chat ao carregar a página
    inicializarChat();
});
