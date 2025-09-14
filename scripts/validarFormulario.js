const formulario = document.getElementById("formulario");
const idadeInput = document.getElementById("idade");
const idadeError = document.getElementById("idade-error");

formulario.addEventListener("submit", function (event) {
  idadeError.textContent = ""; // Limpa mensagens de erro anteriores

  const idade = parseInt(idadeInput.value);

  if (idade < 18) {
    idadeError.textContent = "Você deve ter pelo menos 18 anos.";
    event.preventDefault();
  }
});