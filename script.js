document
  .getElementById("cadastroForm")
  .addEventListener("submit", async function (event) {
    event.preventDefault();

    const nome = document.getElementById("nome").value;
    const sobrenome = document.getElementById("sobrenome").value;
    const telefone = document.getElementById("telefone").value;
    const email = document.getElementById("email").value;
    const senha = document.getElementById("senha").value;
    const form = document.getElementById("cadastroForm");

    const response = await fetch(
      "https://barbeariadodi.vercel.app/api/barbearia",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ nome, telefone, email, sobrenome, senha }),
      }
    );

    const messageElement = document.getElementById("alerta");
    if (response.ok) {
      messageElement.textContent = "Usuário cadastrado com sucesso!";
      messageElement.className = "alert alert-success";
      messageElement.style.display = "block";
      form.reset();
      window.location.href = "login.html";
    } else {
      messageElement.textContent = "Erro ao cadastrar usuário.";
      messageElement.className = "alert alert-danger";
      messageElement.style.display = "block";
    }

    setTimeout(() => {
      messageElement.style.display = "none";
    }, 2000);
  });
