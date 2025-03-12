document.getElementById("loginForm").addEventListener("submit", async function (event) {
  event.preventDefault();

  const emailInput = document.getElementById("email"); // Armazena os elementos, não só os valores
  const senhaInput = document.getElementById("senha");
  const email = emailInput.value.trim(); // .trim() remove espaços em branco
  const senha = senhaInput.value; // Mantém a senha como está (espaços podem ser relevantes)
  const loginAlert = document.getElementById("loginAlert");

  // Validação básica do lado do cliente (antes de enviar)
  if (!email) {
      displayError(loginAlert, "Por favor, insira um email.");
      emailInput.focus(); // Foca no campo de email
      return; // Interrompe a execução
  }

  if (!senha) {
      displayError(loginAlert, "Por favor, insira uma senha.");
      senhaInput.focus(); // Foca no campo de senha
      return; // Interrompe a execução
  }

  // Validação de formato de email (opcional, mas recomendado)
  if (!isValidEmail(email)) {
      displayError(loginAlert, "Por favor, insira um email válido.");
      emailInput.focus();
      return;
  }


  try {
      const response = await fetch("https://barbeariadodi.vercel.app/api/login", {
          method: "POST",
          headers: {
              "Content-Type": "application/json",
              // Adicione outros headers se necessário (ex: Authorization)
          },
          body: JSON.stringify({ email, senha }),
      });

      if (response.ok) {
          // Redirecionamento *após* verificar a resposta do servidor
          window.location.href = "home.html";
      } else {
          // Trata diferentes tipos de erros
          const data = await response.json(); // Tenta obter o corpo da resposta como JSON

          if (response.status === 401) { // Unauthorized (comum para login inválido)
              displayError(loginAlert, data.message || "Email ou senha incorretos."); // Usa mensagem do servidor, se houver
          } else if (response.status === 400) { // Bad Request (ex: dados inválidos)
               displayError(loginAlert, data.message || "Dados inválidos. Verifique os campos.");
          } else if (response.status === 404){
              displayError(loginAlert, data.message || "Usuário não encontrado");
          }
          else {
              displayError(loginAlert, `Erro inesperado: ${response.status}`); // Erro genérico
          }
      }
  } catch (error) {
      // Erro de rede ou outro erro inesperado (ex: servidor offline)
      displayError(loginAlert, "Erro ao conectar com o servidor. Tente novamente mais tarde.");
      console.error("Erro durante o login:", error); // Loga o erro no console
  }
});

// Função auxiliar para exibir mensagens de erro
function displayError(element, message) {
  element.textContent = message;
  element.className = "alert alert-danger"; // Usa classes CSS consistentes
  element.style.display = "block";
}

// Função auxiliar para validar email (simples, pode ser melhorada)
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

//Função para esconder a mensagem de erro ao digitar nos campos (opcional)
document.getElementById("email").addEventListener("input", () => {
  document.getElementById("loginAlert").style.display = "none";
});

document.getElementById("senha").addEventListener("input", () => {
  document.getElementById("loginAlert").style.display = "none";
});

