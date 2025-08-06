import Notificacion from "./classes/Notificacion.js";

const formulario = document.querySelector("#formulario");
const monedaSelect = formulario.querySelector("#moneda");
const criptomonedasSelect = formulario.querySelector("#criptomonedas");
const resultado = formulario.querySelector("#resultado");

const objBusqueda = {
  moneda: "",
  criptomoneda: "",
};

document.addEventListener("DOMContentLoaded", () => {
  consultarCriptomonedas();

  formulario.addEventListener("submit", submitFormulario);

  monedaSelect.addEventListener("change", leerValor);
  criptomonedasSelect.addEventListener("change", leerValor);
});

function consultarCriptomonedas() {
  const url =
    "https://min-api.cryptocompare.com/data/top/mktcapfull?limit=10&tsym=USD";

  fetch(url)
    .then((respuesta) => respuesta.json())
    .then((resultado) => obtenerCriptomonedas(resultado.Data))
    .then((criptomonedas) => selectCriptomonedas(criptomonedas));
}

// Crear un  Promise
const obtenerCriptomonedas = (criptomonedas) =>
  new Promise((resolve) => {
    resolve(criptomonedas);
  });

function selectCriptomonedas(criptomonedas) {
  criptomonedas.forEach((cripto) => {
    const { FullName, Name } = cripto.CoinInfo;

    const option = document.createElement("option");
    option.value = Name;
    option.textContent = FullName;
    criptomonedasSelect.appendChild(option);
  });
}

function leerValor(e) {
  objBusqueda[e.target.name] = e.target.value;
  // console.log('objBusqueda: ', objBusqueda);
}

function submitFormulario(e) {
  e.preventDefault();

  // validar
  const { moneda, criptomoneda } = objBusqueda;

  if (moneda === "" || criptomoneda === "") {
    // Mostrar mensaje de error
    new Notificacion({
      texto: "Ambos campos son obligatorios",
      tipo: "error",
      elementoPadre: formulario,
    });
    return;
  }

  consultarAPI();
}

function consultarAPI(){
  const { moneda, criptomoneda } = objBusqueda;

  const url = `https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${criptomoneda}&tsyms=${moneda}`;

  mostrarSpinner();

  fetch(url)
    .then((respuesta) => respuesta.json())
    .then((cotizacion) => {
      mostrarCotizacionHTML(cotizacion.DISPLAY[criptomoneda][moneda]);
    })
}

function mostrarCotizacionHTML(cotizacion){
  // console.log(cotizacion);
  limpiarHTML(resultado);
  const { PRICE, HIGHDAY, LOWDAY, CHANGEPCT24HOUR, LASTUPDATE } = cotizacion;

  const precio = document.createElement('P');
  precio.classList.add('precio');
  precio.innerHTML = `El precio es: <span>${PRICE}</span>`;

  const precioAlto = document.createElement('P');
  precioAlto.innerHTML = `Precio más alto del día: <span>${HIGHDAY}</span>`;

  const precioBajo = document.createElement('P');
  precioBajo.innerHTML = `Precio más bajo del día: <span>${LOWDAY}</span>`;

  const variacionUltimas24Horas = document.createElement('P');
  variacionUltimas24Horas.innerHTML = `Variación últimas 24 horas: <span>${CHANGEPCT24HOUR}%</span>`;

  const ultimaActualizacion = document.createElement('P');
  ultimaActualizacion.innerHTML = `Última actualización: <span>${LASTUPDATE}</span>`;

  resultado.appendChild(precio);
  resultado.appendChild(precioAlto);
  resultado.appendChild(precioBajo);
  resultado.appendChild(variacionUltimas24Horas);
  resultado.appendChild(ultimaActualizacion);
}

function limpiarHTML(selector) {
  while (selector.firstChild) {
    selector.removeChild(selector.firstChild);
  }
}

function mostrarSpinner(){
  limpiarHTML(resultado);

  const spinner = document.createElement('DIV');
  spinner.classList.add('loader');

  resultado.appendChild(spinner);
}