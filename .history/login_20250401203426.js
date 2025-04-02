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
    
    // Remover classes de erro anteriores
    emailInput.classList.remove('has-error');
    senhaInput.classList.remove('has-error');
    
    // Validação de campos
    let hasError = false;
    
    if (!email) {
      emailError.textContent = "O email é obrigatório";
      emailError.style.display = "block";
      emailInput.classList.add('has-error');
      emailInput.focus();
      hasError = true;
    } else if (!isValidEmail(email)) {
      emailError.textContent = "Por favor, insira um email válido";
      emailError.style.display = "block";
      emailInput.classList.add('has-error');
      emailInput.focus();
      hasError = true;
    }
    
    if (!senha) {
      senhaError.textContent = "A senha é obrigatória";
      senhaError.style.display = "block";
      senhaInput.classList.add('has-error');
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
    toggleLoadingState(btnLogin, true);
  
    try {
      const response = await fetch("https://barbeariadodi.vercel.app/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, senha }),
      });
  
      // Restaurar botão
      toggleLoadingState(btnLogin, false);
  
      if (response.ok) {
        // Animação de sucesso
        btnLogin.innerHTML = '<i class="fas fa-check"></i> Sucesso!';
        btnLogin.style.backgroundColor = "#28a745";
        
        // Salvar token de autenticação se o servidor retornar um
        const data = await response.json();
        if (data.token) {
          localStorage.setItem('authToken', data.token);
          
          // Opcionalmente salvar informações do usuário
          if (data.user) {
            localStorage.setItem('userData', JSON.stringify(data.user));
          }
        }
        
        // Redirecionamento com pequeno delay para mostrar o sucesso
        setTimeout(() => {
          window.location.href = "home.html";
        }, 1000);
      } else {
        const data = await response.json();
        
        if (response.status === 401) {
          displayError(loginAlert, data.message || "Email ou senha incorretos.");
          senhaInput.classList.add('has-error');
          emailInput.classList.add('has-error');
        } else if (response.status === 400) {
          displayError(loginAlert, data.message || "Dados inválidos. Verifique os campos.");
        } else if (response.status === 404) {
          displayError(loginAlert, data.message || "Usuário não encontrado");
          emailInput.classList.add('has-error');
        } else {
          displayError(loginAlert, `Erro inesperado: ${response.status}`);
        }
      }
    } catch (error) {
      // Restaurar botão
      toggleLoadingState(btnLogin, false);
      
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
    
    // Scroll para o erro se estiver fora da visualização
    setTimeout(() => {
      element.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 100);
  }
  
  // Função para validar email
  function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
  
  // Função para alternar estado de carregamento do botão
  function toggleLoadingState(button, isLoading) {
    if (isLoading) {
      const originalText = button.innerHTML;
      button.setAttribute('data-original-text', originalText);
      button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Entrando...';
      button.disabled = true;
      button.classList.add('is-loading');
    } else {
      const originalText = button.getAttribute('data-original-text');
      button.innerHTML = originalText;
      button.disabled = false;
      button.classList.remove('is-loading');
    }
  }
  
  // Validação em tempo real para o campo de email
  document.getElementById("email").addEventListener("input", function() {
    const emailInput = this;
    const emailError = document.getElementById("emailError");
    
    if (emailInput.value.trim() === "") {
      emailError.textContent = "O email é obrigatório";
      emailError.style.display = "block";
      emailInput.classList.add('has-error');
    } else if (!isValidEmail(emailInput.value)) {
      emailError.textContent = "Por favor, insira um email válido";
      emailError.style.display = "block";
      emailInput.classList.add('has-error');
    } else {
      emailError.style.display = "none";
      emailInput.classList.remove('has-error');
    }
    
    // Esconde alerta geral quando usuário começa a corrigir
    document.getElementById("loginAlert").style.display = "none";
  });
  
  // Validação em tempo real para o campo de senha
  document.getElementById("senha").addEventListener("input", function() {
    const senhaInput = this;
    const senhaError = document.getElementById("senhaError");
    
    if (senhaInput.value === "") {
      senhaError.textContent = "A senha é obrigatória";
      senhaError.style.display = "block";
      senhaInput.classList.add('has-error');
    } else {
      senhaError.style.display = "none";
      senhaInput.classList.remove('has-error');
    }
    
    // Esconde alerta geral quando usuário começa a corrigir
    document.getElementById("loginAlert").style.display = "none";
  });
  
  // Função para alternar visibilidade da senha
  function togglePasswordVisibility() {
    const passwordInput = document.getElementById('senha');
    const eyeIcon = document.querySelector('.password-toggle i');
  
    if (passwordInput.type === 'password') {
      passwordInput.type = 'text';
      eyeIcon.classList.remove('fa-eye');
      eyeIcon.classList.add('fa-eye-slash');
    } else {
      passwordInput.type = 'password';
      eyeIcon.classList.remove('fa-eye-slash');
      eyeIcon.classList.add('fa-eye');
    }
  }
  