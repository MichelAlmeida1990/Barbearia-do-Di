// Script para a página de atendimento virtual

document.addEventListener('DOMContentLoaded', function() {
    // Elementos do DOM
    const chatMessages = document.getElementById('chat-messages');
    const messageInput = document.getElementById('message-input');
    const sendButton = document.getElementById('send-button');
    const iniciarChatBtn = document.getElementById('iniciar-chat');
    const iniciarChatCtaBtn = document.getElementById('iniciar-chat-cta');
    const chatFloatButton = document.getElementById('chat-float-button');
    const closeChat = document.getElementById('close-chat');
    const minimizeChat = document.getElementById('minimize-chat');
    const agendarHorarioBtn = document.getElementById('agendar-horario');
    const chatSection = document.getElementById('chat-section');
    const chatContainer = document.getElementById('chat-container');
    const chatOffline = document.getElementById('chat-offline');
    const chatOverlay = document.getElementById('chat-overlay');

    // Dados de serviços para respostas precisas
    const servicos = {
        cortes: [
            {nome: "Fade Americano", preco: 40, tempo: "35 min", descricao: "Corte navalhado mais raspadinho, perfeito para quem busca um visual moderno e bem definido."},
            {nome: "Navalhado com Degradê na Barba", preco: 60, tempo: "45 min", descricao: "Combinação perfeita de corte navalhado com acabamento premium na barba com degradê."},
            {nome: "Corte Social", preco: 35, tempo: "30 min", descricao: "Corte clássico e elegante, ideal para ambiente de trabalho e ocasiões formais."},
            {nome: "Nudred Infantil", preco: 35, tempo: "30 min", descricao: "Corte infantil especializado para cabelos afro utilizando a técnica de esponja."},
            {nome: "Corte Infantil Básico", preco: 30, tempo: "25 min", descricao: "Corte confortável e rápido para crianças."},
            {nome: "Corte Infantil Personalizado", preco: 45, tempo: "40 min", descricao: "Corte especial com desenhos, listras ou estilos personalizados."}
        ],
        barba: [
            {nome: "Barba Completa", preco: 35, tempo: "30 min", descricao: "Tratamento completo para barba inclui toalha quente, óleo essencial, modelagem e finalização."},
            {nome: "Acabamento de Barba", preco: 20, tempo: "15 min", descricao: "Serviço rápido para manter sua barba alinhada e com acabamento perfeito."},
            {nome: "Design de Barba", preco: 40, tempo: "35 min", descricao: "Modelagem personalizada da barba de acordo com o formato do rosto."}
        ],
        combos: [
            {nome: "Corte + Barba Simples", preco: 65, tempo: "55 min", descricao: "Combinação de corte de cabelo com acabamento simples de barba."},
            {nome: "Corte + Barba Completa", preco: 70, tempo: "60 min", descricao: "Combinação de corte de cabelo com tratamento completo de barba."}
        ]
    };

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

    // Função para abrir o chat
    function abrirChat() {
        if (verificarHorarioFuncionamento()) {
            // Verificar se o chat já tem mensagens antes de adicionar a mensagem de boas-vindas
            const mensagensExistentes = chatMessages.querySelectorAll('.message');
            
            chatContainer.classList.add('active');
            chatOverlay.classList.add('active');
            chatFloatButton.style.display = 'none';
            
            // Mensagem de boas-vindas APENAS se não houver mensagens no chat
            if (mensagensExistentes.length === 0) {
                setTimeout(() => {
                    adicionarMensagem('Olá! Como posso ajudar você hoje? Posso fornecer informações sobre cortes, barba ou agendar um horário.', 'received');
                }, 500);
            }
            
            // Rolar para o final das mensagens
            scrollToBottom();
            
            // Focar no campo de entrada
            messageInput.focus();
        } else {
            chatOffline.style.display = 'block';
            chatOverlay.classList.add('active');
            chatFloatButton.style.display = 'none';
        }
    }

    // Função para fechar o chat
    function fecharChat() {
        chatContainer.classList.remove('active');
        chatOverlay.classList.remove('active');
        chatOffline.style.display = 'none';
        chatFloatButton.style.display = 'flex';
        chatContainer.classList.remove('minimized');
    }

    // Função para minimizar/maximizar o chat
    function toggleMinimize() {
        chatContainer.classList.toggle('minimized');
    }

    // Inicializar estado do chat
    function inicializarChat() {
        // Garantir que o chat comece fechado
        // Limpar mensagens existentes para evitar duplicação
        chatMessages.innerHTML = '';
        
        chatContainer.classList.remove('active');
        chatOverlay.classList.remove('active');
        chatOffline.style.display = 'none';
        chatFloatButton.style.display = 'flex';
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
    
    // Criar link para WhatsApp
    function criarLinkWhatsApp(servico, horario, dia) {
        const numeroWhatsApp = "5511999999999"; // Substitua pelo número real
        let mensagem = `Olá! Gostaria de agendar um horário para ${servico}`;
        
        if (dia) {
            mensagem += ` ${dia}`;
        }
        
        if (horario) {
            mensagem += ` às ${horario}`;
        }
        
        const mensagemCodificada = encodeURIComponent(mensagem);
        return `https://wa.me/${numeroWhatsApp}?text=${mensagemCodificada}`;
    }

    // Função para lidar com pedidos de agendamento
    function processarAgendamento(mensagem) {
        const msgLower = mensagem.toLowerCase();
        
        if (msgLower.includes("agendar") || msgLower.includes("marcar") || msgLower.includes("horário") || msgLower.includes("reservar")) {
            let dia = "hoje";
            
            if (msgLower.includes("amanhã") || msgLower.includes("dia seguinte")) {
                dia = "amanhã";
            }
            
            // Identificar serviço
            let servico = "";
            let tipoServico = "";
            
            // Verificar cortes
            if (msgLower.includes("fade") || msgLower.includes("americano")) {
                servico = "Fade Americano";
                tipoServico = "corte";
            } else if (msgLower.includes("social")) {
                servico = "Corte Social";
                tipoServico = "corte";
            } else if (msgLower.includes("navalhado")) {
                servico = "Navalhado com Degradê";
                tipoServico = "corte";
            } else if (msgLower.includes("infantil")) {
                servico = "Corte Infantil";
                tipoServico = "corte";
            } else if (msgLower.includes("nudred")) {
                servico = "Nudred Infantil";
                tipoServico = "corte";
            } else if (msgLower.includes("corte")) {
                servico = "Corte de Cabelo";
                tipoServico = "corte";
            }
            
            // Verificar barba
            else if (msgLower.includes("design") && msgLower.includes("barba")) {
                servico = "Design de Barba";
                tipoServico = "barba";
            } else if (msgLower.includes("acabamento") && msgLower.includes("barba")) {
                servico = "Acabamento de Barba";
                tipoServico = "barba";
            } else if (msgLower.includes("barba completa")) {
                servico = "Barba Completa";
                tipoServico = "barba";
            } else if (msgLower.includes("barba")) {
                servico = "Barba";
                tipoServico = "barba";
            }
            
            // Verificar combo
            else if ((msgLower.includes("cabelo") && msgLower.includes("barba")) || 
                     msgLower.includes("combo") || msgLower.includes("completo")) {
                servico = "Combo Corte + Barba";
                tipoServico = "combo";
            }
            
            // Identificar horário
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
                    const whatsappLink = criarLinkWhatsApp(servico, horario, dia);
                    adicionarMensagem(`Ótimo! Vou verificar a disponibilidade para ${servico} ${dia} às ${horario}.`, 'received');
                    
                    setTimeout(() => {
                        mostrarDigitando();
                        
                        setTimeout(() => {
                            removerDigitando();
                            adicionarMensagem(`✅ Horário disponível! Você pode confirmar seu agendamento de duas formas:<br><br>1. <a href="${whatsappLink}" target="_blank" class="text-success">Confirmar pelo WhatsApp</a><br>2. <a href="agendamento.html" class="text-primary">Usar nosso sistema online</a>`, 'received');
                        }, 1500);
                    }, 1000);
                } else if (servico) {
                    adicionarMensagem(`Entendi que você quer agendar ${servico} para ${dia}. Qual horário você prefere?`, 'received');
                } else {
                    adicionarMensagem(`Posso ajudar com seu agendamento para ${dia}. Temos cortes a partir de R$30, barba a partir de R$20 e combos a partir de R$65. Qual serviço você deseja?`, 'received');
                }
            }, 1000);
            
            return true; // Indica que a mensagem foi tratada como agendamento
        }
        
        return false; // Não é um pedido de agendamento
    }

    // Listar serviços específicos
    function listarServicos(tipo) {
        let resposta = "";
        let listaServicos = [];
        
        if (tipo === "cortes" || tipo === "corte" || tipo === "cabelo") {
            resposta = "<strong>Cortes de Cabelo:</strong><br>";
            listaServicos = servicos.cortes;
        } else if (tipo === "barba") {
            resposta = "<strong>Serviços de Barba:</strong><br>";
            listaServicos = servicos.barba;
        } else {
            // Lista todos os serviços
            resposta = "<strong>Nossos Serviços:</strong><br><br><strong>Cortes:</strong><br>";
            servicos.cortes.forEach(s => {
                resposta += `• ${s.nome}: R$ ${s.preco},00 (${s.tempo})<br>`;
            });
            
            resposta += "<br><strong>Barba:</strong><br>";
            servicos.barba.forEach(s => {
                resposta += `• ${s.nome}: R$ ${s.preco},00 (${s.tempo})<br>`;
            });
            
            resposta += "<br><strong>Combos:</strong><br>";
            servicos.combos.forEach(s => {
                resposta += `• ${s.nome}: R$ ${s.preco},00 (${s.tempo})<br>`;
            });
            
            return resposta;
        }
        
        listaServicos.forEach(s => {
            resposta += `• ${s.nome}: R$ ${s.preco},00 (${s.tempo})<br>`;
        });
        
        return resposta;
    }

    // Simular resposta do atendente
    function simularRespostaAtendente(mensagemUsuario) {
        // Primeiro, verifica se é um pedido de agendamento
        if (processarAgendamento(mensagemUsuario)) {
            return; // Se for agendamento, encerra aqui
        }
        
        mostrarDigitando();
        
        // Tempo para simular digitação (mais curto)
        const tempoResposta = Math.floor(Math.random() * 1000) + 800;
        
        setTimeout(() => {
            removerDigitando();
            
            let resposta = '';
            const msgLower = mensagemUsuario.toLowerCase();
            
            // Respostas assertivas baseadas em palavras-chave
            if (msgLower.includes('horário') && (msgLower.includes('funcionamento') || msgLower.includes('aberto'))) {
                resposta = '<strong>Horário de Funcionamento:</strong><br>• Segunda a Sexta: 9h às 20h<br>• Sábados: 9h às 18h<br>• Domingos: 9h às 13h<br><br>Atendimento Virtual:<br>• Segunda a Sexta: 9h às 19h<br>• Sábados: 9h às 17h';
            } 
            else if ((msgLower.includes('preço') || msgLower.includes('valor') || msgLower.includes('custo')) && 
                    (msgLower.includes('corte') || msgLower.includes('cabelo'))) {
                resposta = '<strong>Preços de Cortes:</strong><br>• Fade Americano: R$ 40,00<br>• Corte Social: R$ 35,00<br>• Navalhado com Degradê: R$ 60,00<br>• Corte Infantil Básico: R$ 30,00<br>• Corte Infantil Personalizado: R$ 45,00<br><br>Deseja agendar algum desses serviços?';
            }
            else if ((msgLower.includes('preço') || msgLower.includes('valor') || msgLower.includes('custo')) && 
                    msgLower.includes('barba')) {
                resposta = '<strong>Preços de Barba:</strong><br>• Barba Completa: R$ 35,00<br>• Acabamento de Barba: R$ 20,00<br>• Design de Barba: R$ 40,00<br><br>Deseja agendar algum desses serviços?';
            }
            else if (msgLower.includes('preço') || msgLower.includes('valor') || msgLower.includes('custo')) {
                resposta = listarServicos("todos");
            }
            else if (msgLower.includes('fade')) {
                resposta = '<strong>Fade Americano</strong><br>Corte navalhado mais raspadinho, perfeito para quem busca um visual moderno e bem definido.<br>• Preço: R$ 40,00<br>• Duração: 35 min<br><br>Deseja agendar este serviço?';
            }
            else if (msgLower.includes('corte') && msgLower.includes('infantil')) {
                resposta = '<strong>Cortes Infantis:</strong><br>• Corte Infantil Básico: R$ 30,00 (25 min)<br>• Corte Infantil Personalizado: R$ 45,00 (40 min)<br>• Nudred Infantil: R$ 35,00 (30 min)<br><br>Qual você prefere?';
            }
            else if (msgLower.includes('corte') || msgLower.includes('cabelo')) {
                resposta = listarServicos("cortes");
            }
            else if (msgLower.includes('barba')) {
                resposta = listarServicos("barba");
            }
            else if (msgLower.includes('combo') || msgLower.includes('promoção')) {
                resposta = '<strong>Combos e Promoções:</strong><br>• Corte + Barba Simples: R$ 65,00 (55 min)<br>• Corte + Barba Completa: R$ 70,00 (60 min)<br>• PROMOÇÃO DE MARÇO: 20% OFF em qualquer serviço às quartas-feiras!<br><br>Deseja agendar algum desses combos?';
            }
            else if (msgLower.includes('endereço') || msgLower.includes('localização') || msgLower.includes('onde fica')) {
                resposta = '<strong>Localização:</strong><br>Estamos na Rua da Barbearia, 123 - Centro.<br>Temos estacionamento próprio para clientes!<br><br><a href="https://maps.app.goo.gl/exemplo" target="_blank">Ver no Google Maps</a>';
            }
            else if (msgLower.includes('whatsapp')) {
                const whatsappLink = `https://wa.me/5511999999999?text=${encodeURIComponent("Olá! Gostaria de informações sobre a Barbearia do Di.")}`;
                resposta = `Você pode nos contatar pelo WhatsApp: (11) 99999-9999<br><br><a href="${whatsappLink}" target="_blank" class="text-success">Iniciar conversa no WhatsApp</a>`;
            }
            else if (msgLower.includes('pagamento') || msgLower.includes('cartão') || msgLower.includes('pix')) {
                resposta = '<strong>Formas de Pagamento:</strong><br>Aceitamos dinheiro, cartões de crédito/débito, Pix e transferência bancária.';
            }
            else if (msgLower.includes('especialidades') || msgLower.includes('serviços')) {
                resposta = '<strong>Nossas Especialidades:</strong><br>• Cortes modernos (fade, degradê, navalhado)<br>• Cortes clássicos e sociais<br>• Cortes infantis<br>• Barba completa e design personalizado<br>• Tratamentos capilares<br>• Sobrancelha masculina<br><br>Em qual serviço você tem interesse?';
            }
            else if (msgLower.includes('estacionamento') || msgLower.includes('parar') || msgLower.includes('carro')) {
                resposta = 'Sim, temos estacionamento próprio e gratuito para nossos clientes.';
            }
            else if (msgLower.includes('cancelar') || msgLower.includes('desmarcar')) {
                resposta = 'Para cancelar ou remarcar um agendamento, por favor, informe seu nome completo e a data/horário agendado. Pedimos que cancele com pelo menos 2 horas de antecedência.';
            }
            else if (msgLower.includes('obrigado') || msgLower.includes('valeu') || msgLower.includes('agradeço')) {
                resposta = 'Por nada! Estamos sempre à disposição. Esperamos vê-lo em breve na Barbearia do DI!';
            }
            else if (msgLower.includes('olá') || msgLower.includes('oi') || msgLower.includes('bom dia') || msgLower.includes('boa tarde') || msgLower.includes('boa noite')) {
                resposta = 'Olá! Como posso ajudar você hoje? Posso fornecer informações sobre nossos cortes, barba ou ajudar a agendar um horário.';
            }
            else {
                resposta = 'Posso ajudar com informações sobre nossos serviços de barbearia. Temos cortes masculinos a partir de R$ 35, serviços de barba a partir de R$ 20 e combos promocionais. Em que posso ser útil?';
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
            abrirChat();
        });
    }
    
    if (iniciarChatCtaBtn) {
        iniciarChatCtaBtn.addEventListener('click', function() {
            abrirChat();
        });
    }
    
    if (chatFloatButton) {
        chatFloatButton.addEventListener('click', function() {
            abrirChat();
        });
    }
    
    if (closeChat) {
        closeChat.addEventListener('click', function() {
            fecharChat();
        });
    }
    
    if (minimizeChat) {
        minimizeChat.addEventListener('click', function() {
            toggleMinimize();
        });
    }
    
    if (chatOverlay) {
        chatOverlay.addEventListener('click', function() {
            fecharChat();
        });
    }
    
    if (agendarHorarioBtn) {
        agendarHorarioBtn.addEventListener('click', function() {
            window.location.href = 'agendamento.html';
        });
    }

    // Inicializar chat ao carregar a página (fechado por padrão)
    inicializarChat();
});
