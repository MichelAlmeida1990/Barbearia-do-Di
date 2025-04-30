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

    // Dados de contato e horários
    const dadosContato = {
        endereco: "R. Maria Margarete da Cruz, 519 - Serpa, Caieiras - SP, 07700-000",
        telefone: "(11) 99999-9999",
        email: "contato@barbeariadodi.com.br",
        horarios: {
            barbearia: {
                segunda_sexta: "09:00 às 20:00",
                sabado: "09:00 às 18:00",
                domingo: "09:00 às 14:00"
            },
            atendimento_virtual: {
                segunda_sexta: "09:00 às 19:00",
                sabado: "09:00 às 17:00",
                domingo: "Fechado"
            }
        }
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
    
    // Função simplificada para criar link do WhatsApp
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

    // Função para verificar múltiplas variações de palavras-chave
    function contemPalavraChave(texto, palavras) {
        const textoLower = texto.toLowerCase();
        return palavras.some(palavra => textoLower.includes(palavra));
    }

    // Função para lidar com pedidos de agendamento - VERSÃO MELHORADA
    function processarAgendamento(mensagem) {
        const msgLower = mensagem.toLowerCase();
        
        // Verificar se a mensagem contém palavras relacionadas a agendamento
        const palavrasAgendamento = [
            "agendar", "marcar", "horario", "horário", "reservar", "quero cortar", "quero fazer", 
            "agendar horario", "agendar horário", "marcar horario", "marcar horário", "vaga", 
            "disponibilidade", "tem vaga", "tem horario", "tem horário", "agendamento",
            "reserva", "reservar horário", "reservar horario", "marcar um", "agendar um",
            "posso ir", "quando posso", "quando dá pra ir", "quando da pra ir", "tem como marcar",
            "consegue me encaixar", "encaixar", "encaixe", "tem como encaixar", "tem como agendar"
        ];
        
        if (contemPalavraChave(msgLower, palavrasAgendamento) || 
            (contemPalavraChave(msgLower, ["quero", "gostaria", "preciso", "queria", "preciso de", "gostaria de", "queria fazer"]) && 
             contemPalavraChave(msgLower, ["corte", "cortar", "cabelo", "barba", "fazer barba", "aparar", "serviço", "servico"]))) {
            
            // Identificar serviço
            let servico = "um serviço";
            
            // Verificar cortes
            if (contemPalavraChave(msgLower, ["fade", "americano", "feid", "feidi", "fadi", "degrade americano"])) {
                servico = "Fade Americano";
            } else if (contemPalavraChave(msgLower, ["social", "classico", "clássico", "tradicional", "executivo", "comum"])) {
                servico = "Corte Social";
            } else if (contemPalavraChave(msgLower, ["navalhado", "navalha", "degrade", "degradê", "sombreado", "disfarçado", "disfarcado"])) {
                servico = "Navalhado com Degradê";
            } else if (contemPalavraChave(msgLower, ["infantil", "criança", "crianca", "menino", "kids", "filho", "meu filho", "moleque", "garoto", "pequeno"])) {
                servico = "Corte Infantil";
            } else if (contemPalavraChave(msgLower, ["nudred", "nudread", "afro", "black", "nudret", "nudrid"])) {
                servico = "Nudred Infantil";
            } else if (contemPalavraChave(msgLower, ["corte", "cortar", "cabelo", "cabeleireiro", "cabeleireiro", "pelo", "pelos"])) {
                servico = "Corte de Cabelo";
            }
            // Verificar barba
            else if (contemPalavraChave(msgLower, ["design", "desenho", "desing", "dezenho", "modelar", "modelagem"]) && 
                     contemPalavraChave(msgLower, ["barba", "barbear", "bigode"])) {
                servico = "Design de Barba";
            } else if (contemPalavraChave(msgLower, ["acabamento", "finalização", "finalizacao", "aparar", "ajuste", "retocar", "retoque"]) && 
                       contemPalavraChave(msgLower, ["barba", "barbear", "bigode"])) {
                servico = "Acabamento de Barba";
            } else if (contemPalavraChave(msgLower, ["barba completa", "barba cheia", "tratamento barba", "barba toda", "barba inteira"])) {
                servico = "Barba Completa";
            } else if (contemPalavraChave(msgLower, ["barba", "barbear", "fazer a barba", "barbado", "barbudos", "barbudo"])) {
                servico = "Barba";
            }
            // Verificar combo
            else if ((contemPalavraChave(msgLower, ["cabelo", "corte", "pelos", "pelo"]) && 
                      contemPalavraChave(msgLower, ["barba", "barbear", "bigode"])) || 
                     contemPalavraChave(msgLower, ["combo", "completo", "pacote", "dois", "2 serviços", "os dois", "ambos", "tudo", "completo"])) {
                servico = "Combo Corte + Barba";
            }
            
            // Identificar dia
            let dia = "hoje";
            if (contemPalavraChave(msgLower, ["amanhã", "amanha", "dia seguinte", "proximo dia"])) {
                dia = "amanhã";
            } else if (contemPalavraChave(msgLower, ["segunda", "segunda-feira", "segunda feira", "2a", "2ª", "2a feira", "2ª feira"])) {
                dia = "segunda-feira";
            } else if (contemPalavraChave(msgLower, ["terça", "terca", "terça-feira", "terca-feira", "terça feira", "3a", "3ª", "3a feira", "3ª feira"])) {
                dia = "terça-feira";
            } else if (contemPalavraChave(msgLower, ["quarta", "quarta-feira", "quarta feira", "4a", "4ª", "4a feira", "4ª feira"])) {
                dia = "quarta-feira";
            } else if (contemPalavraChave(msgLower, ["quinta", "quinta-feira", "quinta feira", "5a", "5ª", "5a feira", "5ª feira"])) {
                dia = "quinta-feira";
            } else if (contemPalavraChave(msgLower, ["sexta", "sexta-feira", "sexta feira", "6a", "6ª", "6a feira", "6ª feira"])) {
                dia = "sexta-feira";
            } else if (contemPalavraChave(msgLower, ["sabado", "sábado", "sab", "sáb", "fim de semana"])) {
                dia = "sábado";
            } else if (contemPalavraChave(msgLower, ["domingo", "dom", "final de semana"])) {
                dia = "domingo";
            }
            
            // Identificar horário
            let horario = null;
            // Regex para capturar horários em diferentes formatos: 14h, 14:00, 14h00, 14hrs, etc.
            const regexHorario = /(\d{1,2})[:h\s](\d{0,2})|(\d{1,2})\s*(hrs|horas|h$|hs)/i;
            const matchHorario = msgLower.match(regexHorario);
            if (matchHorario) {
                if (matchHorario[1]) {
                    // Formato com hora e possivelmente minutos
                    const hora = matchHorario[1];
                    const minutos = matchHorario[2] || "00";
                    horario = `${hora}:${minutos.padEnd(2, '0')}`;
                } else if (matchHorario[3]) {
                    // Formato apenas com hora (ex: 14hrs)
                    horario = `${matchHorario[3]}:00`;
                }
            }
            
            mostrarDigitando();
            
            setTimeout(() => {
                removerDigitando();
                
                // Criar link para WhatsApp com o serviço identificado
                const whatsappLink = criarLinkWhatsApp(servico, horario, dia);
                
                // Resposta com opções de agendamento - mais direta e eficiente
                let resposta = `Ótimo! Você pode agendar ${servico} de duas formas:<br><br>
                <div class="booking-options">
                    <a href="${whatsappLink}" target="_blank" class="booking-option whatsapp">
                        <i class="fab fa-whatsapp"></i>
                        <span>Agendar pelo WhatsApp</span>
                    </a>
                    <a href="agendamento.html" class="booking-option online">
                        <i class="far fa-calendar-check"></i>
                        <span>Agendar Online</span>
                    </a>
                </div>`;
                
                // Adicionar informação sobre horário se foi especificado
                if (horario) {
                    resposta += `<p class="mt-2">Vou verificar a disponibilidade para ${dia} às ${horario}.</p>`;
                }
                
                adicionarMensagem(resposta, 'received');
            }, 1000);
            
            return true; // Indica que a mensagem foi tratada como agendamento
        }
        
        return false; // Não é um pedido de agendamento
    }

    // Listar serviços específicos com formatação em negrito para os nomes dos serviços
    function listarServicos(tipo) {
        let resposta = "";
        let listaServicos = [];
        
        if (contemPalavraChave(tipo, ["cortes", "corte", "cabelo", "cabeleireiro"])) {
            resposta = "<strong>Cortes de Cabelo:</strong><br>";
            listaServicos = servicos.cortes;
        } else if (contemPalavraChave(tipo, ["barba", "barbear", "barba completa"])) {
            resposta = "<strong>Serviços de Barba:</strong><br>";
            listaServicos = servicos.barba;
        } else {
            // Lista todos os serviços
            resposta = "<strong>Nossos Serviços:</strong><br><br><strong>Cortes:</strong><br>";
            servicos.cortes.forEach(s => {
                resposta += `• <strong>${s.nome}</strong>: R$ ${s.preco},00 (${s.tempo})<br>`;
            });
            
            resposta += "<br><strong>Barba:</strong><br>";
            servicos.barba.forEach(s => {
                resposta += `• <strong>${s.nome}</strong>: R$ ${s.preco},00 (${s.tempo})<br>`;
            });
            
            resposta += "<br><strong>Combos:</strong><br>";
            servicos.combos.forEach(s => {
                resposta += `• <strong>${s.nome}</strong>: R$ ${s.preco},00 (${s.tempo})<br>`;
            });
            
            return resposta;
        }
        
        listaServicos.forEach(s => {
            resposta += `• <strong>${s.nome}</strong>: R$ ${s.preco},00 (${s.tempo})<br>`;
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
            // Horário de funcionamento - múltiplas variações
            if ((contemPalavraChave(msgLower, ["horario", "horário", "hora", "horas", "hrs", "expediente", "periodo", "período"]) && 
                 contemPalavraChave(msgLower, ["funcionamento", "aberto", "abre", "fecha", "fechamento", "atendimento", "trabalho"])) ||
                contemPalavraChave(msgLower, ["que horas abre", "que horas fecha", "horario de abertura", "horário de abertura", 
                                           "quando abre", "quando fecha", "dias de funcionamento", "dias que abre", 
                                           "fim de semana", "domingo", "sabado", "sábado", "vocês abrem", "voces abrem", "vocês fecham", "voces fecham"])) {
                resposta = `<strong>Horário de Funcionamento:</strong><br>
                • Segunda a Sexta: ${dadosContato.horarios.barbearia.segunda_sexta}<br>
                • Sábados: ${dadosContato.horarios.barbearia.sabado}<br>
                • Domingos: ${dadosContato.horarios.barbearia.domingo}<br><br>
                <strong>Atendimento Virtual:</strong><br>
                • Segunda a Sexta: ${dadosContato.horarios.atendimento_virtual.segunda_sexta}<br>
                • Sábados: ${dadosContato.horarios.atendimento_virtual.sabado}`;
            } 
            // Preços de cortes
            else if ((contemPalavraChave(msgLower, ["preço", "preco", "valor", "custo", "quanto custa", "quanto é", "quanto e", "preços", "precos", "valores"]) && 
                     contemPalavraChave(msgLower, ["corte", "cortar", "cabelo", "cabeleireiro", "fade", "degrade", "degradê", "navalhado", "cortes"]))) {
                resposta = '<strong>Preços de Cortes:</strong><br>• <strong>Fade Americano</strong>: R$ 40,00 (35 min)<br>• <strong>Corte Social</strong>: R$ 35,00 (30 min)<br>• <strong>Navalhado com Degradê</strong>: R$ 60,00 (45 min)<br>• <strong>Corte Infantil Básico</strong>: R$ 30,00 (25 min)<br>• <strong>Corte Infantil Personalizado</strong>: R$ 45,00 (40 min)<br><br>Deseja agendar algum desses serviços?';
            }
            // Preços de barba
            else if ((contemPalavraChave(msgLower, ["preço", "preco", "valor", "custo", "quanto custa", "quanto é", "quanto e", "preços", "precos", "valores"]) && 
                     contemPalavraChave(msgLower, ["barba", "barbear", "aparar barba", "fazer a barba", "barbas"]))) {
                resposta = '<strong>Preços de Barba:</strong><br>• <strong>Barba Completa</strong>: R$ 35,00 (30 min)<br>• <strong>Acabamento de Barba</strong>: R$ 20,00 (15 min)<br>• <strong>Design de Barba</strong>: R$ 40,00 (35 min)<br><br>Deseja agendar algum desses serviços?';
            }
            // Preços gerais
            else if (contemPalavraChave(msgLower, ["preço", "preco", "valor", "custo", "quanto custa", "quanto é", "quanto e", "preços", "precos", "tabela", "valores", "lista de preços", "lista de precos"])) {
                resposta = listarServicos("todos");
            }
            // Fade
            else if (contemPalavraChave(msgLower, ["fade", "feid", "feidi", "degrade americano", "degradê americano", "fadi", "americano"])) {
                resposta = '<strong>Fade Americano</strong><br>Corte navalhado mais raspadinho, perfeito para quem busca um visual moderno e bem definido.<br>• <strong>Preço</strong>: R$ 40,00<br>• <strong>Duração</strong>: 35 min<br><br>Deseja agendar este serviço?';
            }
            // Cortes infantis
            else if ((contemPalavraChave(msgLower, ["corte", "cabelo", "cortar", "pelos"]) && 
                     contemPalavraChave(msgLower, ["infantil", "criança", "crianca", "menino", "garoto", "filho", "kids", "infantis", "moleque", "pequeno", "criancas", "crianças"]))) {
                resposta = '<strong>Cortes Infantis:</strong><br>• <strong>Corte Infantil Básico</strong>: R$ 30,00 (25 min)<br>• <strong>Corte Infantil Personalizado</strong>: R$ 45,00 (40 min)<br>• <strong>Nudred Infantil</strong>: R$ 35,00 (30 min)<br><br>Qual você prefere?';
            }
            // Cortes gerais
            else if (contemPalavraChave(msgLower, ["corte", "cortar", "cabelo", "cabeleireiro", "cortes", "tipos de corte", "estilos de corte", "modelos de corte"])) {
                resposta = listarServicos("cortes");
            }
            // Barba
            else if (contemPalavraChave(msgLower, ["barba", "barbear", "aparar barba", "fazer a barba", "barba completa", "design barba", "barbudo", "barbudos", "bigode"])) {
                resposta = listarServicos("barba");
            }
            // Combos e promoções
            else if (contemPalavraChave(msgLower, ["combo", "combos", "promoção", "promocao", "desconto", "pacote", "oferta", "especial", "promocional", "promo", "economizar", "economia", "mais barato", "melhor preço", "melhor preco"])) {
                resposta = '<strong>Combos e Promoções:</strong><br>• <strong>Corte + Barba Simples</strong>: R$ 65,00 (55 min)<br>• <strong>Corte + Barba Completa</strong>: R$ 70,00 (60 min)<br><br><span style="color: #FF8C00; font-weight: bold;">PROMOÇÃO DE MA: 20% OFF em qualquer serviço às quartas-feiras!</span><br><br>Deseja agendar algum desses combos?';
            }
                        // Endereço e localização
                        else if (contemPalavraChave(msgLower, ["endereço", "endereco", "localização", "localizacao", "onde fica", "como chegar", "lugar", "local", "bairro", "rua", "avenida", "av", "r.", "onde vocês ficam", "onde voces ficam", "onde estão", "onde estao"])) {
                            resposta = `<strong>Localização:</strong><br>${dadosContato.endereco}<br>Temos estacionamento próprio para clientes!<br><br><a href="https://maps.app.goo.gl/exemplo" target="_blank">Ver no Google Maps</a>`;
                        }
                        // WhatsApp
                        else if (contemPalavraChave(msgLower, ["whatsapp", "whats", "wpp", "zap", "zapzap", "whatzapp", "watsapp", "whatsap", "whatzap"])) {
                            const whatsappLink = `https://wa.me/5511999999999?text=${encodeURIComponent("Olá! Gostaria de informações sobre a Barbearia do Di.")}`;
                            resposta = `Você pode nos contatar pelo WhatsApp: <strong>${dadosContato.telefone}</strong><br><br><a href="${whatsappLink}" target="_blank" class="text-success">Iniciar conversa no WhatsApp</a>`;
                        }
                        // Formas de pagamento
                        else if (contemPalavraChave(msgLower, ["pagamento", "pagar", "cartão", "cartao", "credito", "crédito", "debito", "débito", "pix", "dinheiro", "transferência", "transferencia", "boleto", "parcelar", "parcelas", "à vista", "a vista", "forma de pagamento", "aceita", "aceitam"])) {
                            resposta = '<strong>Formas de Pagamento:</strong><br>Aceitamos dinheiro, cartões de crédito/débito, Pix e transferência bancária.';
                        }
                        // Especialidades e serviços
                        else if (contemPalavraChave(msgLower, ["especialidades", "especialidade", "serviços", "servicos", "fazem", "oferecem", "tem", "trabalham", "vocês fazem", "voces fazem", "vocês têm", "voces tem", "disponível", "disponivel"])) {
                            resposta = '<strong>Nossas Especialidades:</strong><br>• <strong>Cortes modernos</strong> (fade, degradê, navalhado)<br>• <strong>Cortes clássicos e sociais</strong><br>• <strong>Cortes infantis</strong><br>• <strong>Barba completa</strong> e design personalizado<br>• <strong>Tratamentos capilares</strong><br>• <strong>Sobrancelha masculina</strong><br><br>Em qual serviço você tem interesse?';
                        }
                        // Estacionamento
                        else if (contemPalavraChave(msgLower, ["estacionamento", "parar", "carro", "moto", "veiculo", "veículo", "estacionar", "estacionar carro", "tem estacionamento", "tem vaga", "tem vaga para carro", "onde estaciono", "onde deixo o carro"])) {
                            resposta = 'Sim, temos <strong>estacionamento próprio e gratuito</strong> para nossos clientes.';
                        }
                        // Cancelamento
                        else if (contemPalavraChave(msgLower, ["cancelar", "desmarcar", "remarcar", "reagendar", "adiar", "cancelamento", "desmarcação", "desmarcacao", "alterar horário", "alterar horario", "mudar horário", "mudar horario"])) {
                            resposta = 'Para <strong>cancelar ou remarcar</strong> um agendamento, por favor, informe seu nome completo e a data/horário agendado. Pedimos que cancele com pelo menos 2 horas de antecedência.';
                        }
                        // Agradecimento
                        else if (contemPalavraChave(msgLower, ["obrigado", "obrigada", "valeu", "agradeço", "agradecido", "grato", "grata", "thanks", "vlw", "brigado", "brigada", "obg", "vlww", "vleu", "obgd", "agradecendo"])) {
                            resposta = 'Por nada! Estamos sempre à disposição. Esperamos vê-lo em breve na Barbearia do DI!';
                        }
                        // Saudações
                        else if (contemPalavraChave(msgLower, ["olá", "ola", "oi", "bom dia", "boa tarde", "boa noite", "e ai", "e aí", "eai", "hello", "hi", "tudo bem", "tudo bom", "como vai", "opa", "hey", "ei", "salve"])) {
                            resposta = 'Olá! Como posso ajudar você hoje? Posso fornecer informações sobre nossos cortes, barba ou ajudar a agendar um horário.';
                        }
                        // Contato
                        else if (contemPalavraChave(msgLower, ["contato", "telefone", "email", "e-mail", "fone", "ligar", "numero", "número", "contatos", "contatar", "falar com", "entrar em contato", "comunicar"])) {
                            resposta = `<strong>Contatos:</strong><br>
                            • Telefone/WhatsApp: <strong>${dadosContato.telefone}</strong><br>
                            • E-mail: <strong>${dadosContato.email}</strong><br>
                            • Endereço: ${dadosContato.endereco}`;
                        }
                        // Promoções específicas
                        else if (contemPalavraChave(msgLower, ["promoção", "promocao", "desconto", "oferta", "promo", "barato", "mais barato", "economia", "economizar", "black friday"])) {
                            resposta = '<strong>Promoções Atuais:</strong><br><br><span style="color: #FF8C00; font-weight: bold;">• QUARTA DO CLIENTE: 20% OFF em qualquer serviço às quartas-feiras!</span><br><br><span style="color: #FF8C00; font-weight: bold;">• COMBO PAI E FILHO: Corte adulto + infantil por R$ 65,00</span><br><br><span style="color: #FF8C00; font-weight: bold;">• INDIQUE UM AMIGO: Ganhe 15% de desconto na próxima visita</span><br><br>Deseja aproveitar alguma dessas promoções?';
                        }
                        else {
                            resposta = 'Posso ajudar com informações sobre nossos serviços de barbearia. Temos <strong>cortes masculinos</strong> a partir de R$ 35, <strong>serviços de barba</strong> a partir de R$ 20 e <strong>combos promocionais</strong>. Em que posso ser útil?';
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
            
                // Rastrear cliques nos botões de agendamento
                document.addEventListener('click', function(e) {
                    // Verificar se o clique foi em um botão de agendamento
                    if (e.target.closest('.booking-option.whatsapp')) {
                        // Registrar que o usuário escolheu WhatsApp (você pode enviar para analytics)
                        console.log('Usuário escolheu agendar pelo WhatsApp');
                    } else if (e.target.closest('.booking-option.online')) {
                        // Registrar que o usuário escolheu agendamento online
                        console.log('Usuário escolheu agendar online');
                    }
                });
            
                // Adicionar estilos CSS para os botões de agendamento e formatação de promoções
                const style = document.createElement('style');
                style.textContent = `
                    /* Estilos para os botões de agendamento */
                    .booking-options {
                        display: flex;
                        flex-direction: column;
                        gap: 10px;
                        margin: 10px 0;
                    }
                    
                    .booking-option {
                        display: flex;
                        align-items: center;
                        padding: 12px 15px;
                        border-radius: 8px;
                        text-decoration: none;
                        font-weight: 500;
                        transition: all 0.3s ease;
                    }
                    
                    .booking-option i {
                        margin-right: 10px;
                        font-size: 20px;
                    }
                    
                    .booking-option.whatsapp {
                        background-color: #25D366;
                        color: white;
                    }
                    
                    .booking-option.whatsapp:hover {
                        background-color: #128C7E;
                    }
                    
                    .booking-option.online {
                        background-color: #007bff;
                        color: white;
                    }
                    
                    .booking-option.online:hover {
                        background-color: #0056b3;
                    }
                    
                    .mt-2 {
                        margin-top: 10px;
                    }
            
                    /* Estilo para promoções */
                    .promocao {
                        color: #FF8C00;
                        font-weight: bold;
                    }
                `;
                document.head.appendChild(style);
            
                // Inicializar chat ao carregar a página (fechado por padrão)
                inicializarChat();
            });
            
