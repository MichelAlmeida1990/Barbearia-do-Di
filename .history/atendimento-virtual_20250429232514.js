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
    }

    // Inicializar estado do chat
    function inicializarChat() {
        const chatAberto = verificarHorarioFuncionamento();
        
        if (chatAberto) {
            chatContainer.style.display = 'flex';
            chatOffline.style.display = 'none';
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
        messageText.textContent = texto;
        
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

    // Simular resposta do atendente
    function simularRespostaAtendente(mensagemUsuario) {
        mostrarDigitando();
        
        // Tempo aleatório entre 1 e 3 segundos para simular digitação
        const tempoResposta = Math.floor(Math.random() * 2000) + 1000;
        
        setTimeout(() => {
            removerDigitando();
            
            let resposta = '';
            
            // Respostas automatizadas baseadas em palavras-chave
            if (mensagemUsuario.toLowerCase().includes('horário') || 
                mensagemUsuario.toLowerCase().includes('hora') || 
                mensagemUsuario.toLowerCase().includes('funcionamento')) {
                resposta = 'Nosso horário de funcionamento é de segunda a sexta das 9h às 20h, sábados das 9h às 18h e domingos das 9h às 13h.';
            } 
            else if (mensagemUsuario.toLowerCase().includes('preço') || 
                     mensagemUsuario.toLowerCase().includes('valor') || 
                     mensagemUsuario.toLowerCase().includes('custo')) {
                resposta = 'Nossos preços variam conforme o serviço. Corte de cabelo a partir de R$ 45,00, barba a partir de R$ 35,00. Para um orçamento mais preciso, pode me dizer qual serviço você tem interesse?';
            }
            else if (mensagemUsuario.toLowerCase().includes('agendar') || 
                     mensagemUsuario.toLowerCase().includes('marcar') || 
                     mensagemUsuario.toLowerCase().includes('reservar')) {
                resposta = 'Ótimo! Para agendar um horário, preciso de algumas informações: qual serviço você deseja, qual dia e horário de preferência? Temos disponibilidade para esta semana ainda.';
            }
            else if (mensagemUsuario.toLowerCase().includes('corte') || 
                     mensagemUsuario.toLowerCase().includes('cabelo')) {
                resposta = 'Temos diversos estilos de corte disponíveis. Você prefere algo mais tradicional ou moderno? Nossos barbeiros são especialistas em degradê, disfarçado, social, entre outros estilos.';
            }
            else if (mensagemUsuario.toLowerCase().includes('barba')) {
                resposta = 'Para barba oferecemos aparagem simples, modelagem completa e tratamentos especiais com produtos premium. Qual serviço você tem interesse?';
            }
            else if (mensagemUsuario.toLowerCase().includes('obrigado') || 
                     mensagemUsuario.toLowerCase().includes('valeu') || 
                     mensagemUsuario.toLowerCase().includes('agradeço')) {
                resposta = 'Por nada! Estamos sempre à disposição. Esperamos vê-lo em breve na Barbearia do DI!';
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
    
    iniciarChatBtn.addEventListener('click', function() {
        chatSection.scrollIntoView({ behavior: 'smooth' });
    });
    
    iniciarChatCtaBtn.addEventListener('click', function() {
        chatSection.scrollIntoView({ behavior: 'smooth' });
    });
    
    chatFloatButton.addEventListener('click', function() {
        chatSection.scrollIntoView({ behavior: 'smooth' });
    });
    
    agendarHorarioBtn.addEventListener('click', function() {
        window.location.href = 'agendamento.html';
    });

    // Inicializar chat ao carregar a página
    inicializarChat();

    // Mensagens de boas-vindas adicionais após um pequeno delay
    setTimeout(() => {
        adicionarMensagem('Como posso ajudar você hoje? Gostaria de informações sobre nossos serviços ou deseja agendar um horário?', 'received');
    }, 1000);
});
