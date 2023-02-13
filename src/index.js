import './css/styles.css';
import debounce from 'lodash.debounce';
// import Notiflix from 'notiflix/build/notiflix-notify-aio';

const DEBOUNCE_DELAY = 300;

const inputCountry = document.querySelector('#search-box');
const countryList = document.querySelector('.country-list');

function fetchCountries(name) {
  return fetch(`https://restcountries.com/v2/name/${name}`).then(response => {
    if (!response.ok) {
      throw new Error(response.status);
    }
    return response.json();
  });
}

function renderCountryList(countries) {
  const markup = countries
    .map(({ name, capital, flags }) => {
      return `
      <li>                 
      <img src='${flags.svg}' width='24'></img>
      <span>${name}</span>
        <p>${capital}</p>
        
      </li>
      `;
    })
    .join('');
  countryList.innerHTML = markup;
}

function handleInput(event) {
  fetchCountries(event.target.value)
    .then(names => renderCountryList(names))
    .catch(error => console.error(error));
}

inputCountry.addEventListener('input', debounce(handleInput, DEBOUNCE_DELAY));
