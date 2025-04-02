document.getElementById("loginForm").addEventListener("submit", async function (event) {
    event.preventDefault();
  
    const emailInput = document.getElementById("email");
    const senhaInput = document.getElementById("senha");
    const emailError = document.getElementById("emailError");
    const senhaError = document.getElementById("senhaError");
    const loginAlert = document.getElementById("loginAlert");
    
    const email = emailInput.value.trim();
    const senha = senhaInput.value;
    
    // Resetar mensagens de erro anteriores
    emailError.style.display = "none";
    senhaError.style.display = "none";
    loginAlert.style.display = "none";
    
    // Validação de campos
    let hasError = false;
    
    if (!email) {
      emailError.textContent = "O email é obrigatório";
      emailError.style.display = "block";
      emailInput.focus();
      hasError = true;
    } else if (!isValidEmail(email)) {
      emailError.textContent = "Por favor, insira um email válido";
      emailError.style.display = "block";
      emailInput.focus();
      hasError = true;
    }
    
    if (!senha) {
      senhaError.textContent = "A senha é obrigatória";
      senhaError.style.display = "block";
      if (!hasError) {
        senhaInput.focus();
      }
      hasError = true;
    }
    
    if (hasError) {
      return;
    }
  
    // Mostrar indicador de carregamento
    const btnLogin = document.querySelector(".btn-login");
    const btnText = btnLogin.innerHTML;
    btnLogin.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Entrando...';
    btnLogin.disabled = true;
  
    try {
      const response = await fetch("https://barbeariadodi.vercel.app/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, senha }),
      });
  
      // Restaurar botão
      btnLogin.innerHTML = btnText;
      btnLogin.disabled = false;
  
      if (response.ok) {
        // Animação de sucesso
        btnLogin.innerHTML = '<i class="fas fa-check"></i> Sucesso!';
        btnLogin.style.backgroundColor = "#28a745";
        
        // Redirecionamento com pequeno delay para mostrar o sucesso
        setTimeout(() => {
          window.location.href = "home.html";
        }, 1000);
      } else {
        const data = await response.json();
        
        if (response.status === 401) {
          displayError(loginAlert, data.message || "Email ou senha incorretos.");
        } else if (response.status === 400) {
          displayError(loginAlert, data.message || "Dados inválidos. Verifique os campos.");
        } else if (response.status === 404) {
          displayError(loginAlert, data.message || "Usuário não encontrado");
        } else {
          displayError(loginAlert, `Erro inesperado: ${response.status}`);
        }
      }
    } catch (error) {
      // Restaurar botão
      btnLogin.innerHTML = btnText;
      btnLogin.disabled = false;
      
      displayError(loginAlert, "Erro ao conectar com o servidor. Tente novamente mais tarde.");
      console.error("Erro durante o login:", error);
    }
  });
  
  // Função para exibir mensagens de erro com animação
  function displayError(element, message) {
    element.textContent = message;
    element.className = "alert alert-danger";
    element.style.display = "block";
    
    // Adiciona efeito de shake para chamar atenção
    element.classList.add("shake");
    setTimeout(() => {
      element.classList.remove("shake");
    }, 500);
  }
  
  // Função para validar email
  function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
  
  // Adiciona animação de shake para alertas
  const shakeAnimation = `
  @keyframes shake {
    0%, 100% { transform: translateX(0); }
    10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
    20%, 40%, 60%, 80% { transform: translateX(5px); }
  }
  .shake {
    animation: shake 0.5s cubic-bezier(.36,.07,.19,.97) both;
  }`;
  
  // Adiciona o estilo de animação ao documento
  const styleElement = document.createElement('style');
  styleElement.textContent = shakeAnimation;
  document.head.appendChild(styleElement);
  