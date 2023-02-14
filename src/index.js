import './css/styles.css';
import debounce from 'lodash.debounce';
import Notiflix from 'notiflix/build/notiflix-notify-aio';

const inputCountry = document.querySelector('#search-box');
const countryList = document.querySelector('.country-list');
const countryInfo = document.querySelector('.country-info');
const DEBOUNCE_DELAY = 300;

function fetchCountries(name) {
  return fetch(
    `https://restcountries.com/v2/name/${name}?fields=name,capital,population,flags,languages`
  ).then(response => {
    if (!response.ok) {
      throw new Error(
        Notiflix.Notify.failure('Oops, there is no country with that name')
      );
    }
    return response.json();
  });
}

function renderCountryList(countries) {
  const markup = countries
    .map(({ name, flags }) => {
      return `
      <li>                 
      <img src='${flags.svg}' width='24'></img>
      <span>${name}</span>        
      </li>
      `;
    })
    .join('');
  countryList.innerHTML = markup;
  countryInfo.innerHTML = '';
}

function renderCountryInfo({ name, flags, capital, population, languages }) {
  const markup = `                       
      <img src='${flags.svg}' width='24'></img>
      <span>${name}</span>        
      <p>${capital}</p>
      <p>${population}</p>
      <p>${languages.map(language => language.name)}</p>
      `;
  countryInfo.innerHTML = markup;
  countryList.innerHTML = '';
}

function handleInput(event) {
  fetchCountries(event.target.value)
    .then(names => {
      if (names.length > 10) {
        countryInfo.innerHTML = '';
        countryList.innerHTML = '';
        Notiflix.Notify.info(
          'Too many matches found. Please enter a more specific name.'
        );
      } else if (names.length <= 10 && names.length >= 2) {
        renderCountryList(names);
      } else if (names.length === 1) {
        renderCountryInfo(names[0]);
      }
    })
    .catch(error => console.error(error));
}

inputCountry.addEventListener('input', debounce(handleInput, DEBOUNCE_DELAY));
