import './css/styles.css';
import debounce from 'lodash.debounce';
import Notiflix from 'notiflix/build/notiflix-notify-aio';
import { fetchCountries } from './fetchCountries';

const inputCountry = document.querySelector('#search-box');
const countryList = document.querySelector('.country-list');
const countryInfo = document.querySelector('.country-info');
const DEBOUNCE_DELAY = 300;

function renderCountryList(countries) {
  const markup = countries
    .map(({ name, flags }) => {
      return `
      <li>                 
      <img src='${flags.svg}' alt='flag of ${name}' width='24'></img>
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
      <h1>
        <img src='${flags.svg}' alt='flag of ${name}' width='30'></img>
        <span>${name}</span>
      </h1>        
      <p><b>Capital:</b> ${capital}</p>
      <p><b>Population:</b> ${population}</p>
      <p><b>Languages:</b> ${languages
        .map(language => language.name)
        .join(', ')}</p>
      `;
  countryInfo.innerHTML = markup;
  countryList.innerHTML = '';
}

function onFetchError(error) {
  console.error(error);
  countryInfo.innerHTML = '';
  countryList.innerHTML = '';
  Notiflix.Notify.failure('Oops, there is no country with that name');
}

function handleInput(event) {
  if (event.target.value.trim() === '') {
    countryInfo.innerHTML = '';
    countryList.innerHTML = '';
  } else {
    fetchCountries(event.target.value.trim())
      .then(countries => {
        if (countries.length > 10) {
          countryInfo.innerHTML = '';
          countryList.innerHTML = '';
          Notiflix.Notify.info(
            'Too many matches found. Please enter a more specific name.'
          );
        } else if (countries.length <= 10 && countries.length >= 2) {
          renderCountryList(countries);
        } else if (countries.length === 1) {
          renderCountryInfo(countries[0]);
        }
      })
      .catch(onFetchError);
  }
}

inputCountry.addEventListener('focus', () => {
  inputCountry.style.borderColor = '#9393f1';
  inputCountry.style.outline = 'none';
});
inputCountry.addEventListener('input', debounce(handleInput, DEBOUNCE_DELAY));
