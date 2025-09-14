const obterValorUrlPorParametro = (parametro) => {
  const url = window.location.href;
  parametro = parametro.replace(/[\[\]]/g, "\\$&");
  const regex = new RegExp("[?&]" + parametro + "(=([^&#]*)|&|#|$)");
  const results = regex.exec(url);

  if (!results) return null;
  if (!results[2]) return "";

  return decodeURIComponent(results[2].replace(/\+/g, " "));
};

const nome = obterValorUrlPorParametro("nome");
const email = obterValorUrlPorParametro("email");
const idade = obterValorUrlPorParametro("idade");

setTimeout(() => {
  document.querySelector(".loading-container").style.display = "none";
  document.querySelector(".card").style.display = "block";
  document.getElementById("nome").textContent = nome;
  document.getElementById("email").textContent = email;
  document.getElementById("idade").textContent = idade;
}, 1000);