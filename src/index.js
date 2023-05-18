import { Notify } from 'notiflix/build/notiflix-notify-aio';
import './css/styles.css';
import { refs } from './js/refs';
import { fetchCountries } from './js/fetchCountries';

const debounce = require('lodash.debounce');
const DEBOUNCE_DELAY = 300;

refs.input.addEventListener('input', debounce(handlerInput, DEBOUNCE_DELAY));

function handlerInput(evt) {
  const value = evt.target.value.trim();
  if (value === '') {
    clearHTML();
    return;
  }
  fetchCountries(value)
    .then(data => {
      if (data.length > 10) {
        clearHTML();
        Notify.info(
          'Too many matches found. Please enter a more specific name.'
        );
      } else {
        createMarkup(data);
      }
    })
    .catch(() => {
      clearHTML();
      Notify.failure('Oops, there is no country with that name');
    });
}

function createMarkup(countriesArray) {
  let markup = '';
  if (countriesArray.length === 1) {
    const {
      name: { official },
      capital,
      population,
      flags: { svg },
      languages,
    } = countriesArray[0];

    markup = `<div class="country-info-wrap">
    <div class="country-name-wrap">
      <img src="${svg}" alt="Flag of ${official}">
      <h2 class="country-name">${official}</h2>
    </div>
    <ul>
      <li><span>Capital: </span>${capital.join('')}</li>
      <li><span>Population: </span>${population}</li>
      <li><span>Languages: </span>${Object.values(languages).join(', ')}</li>
    </ul>
    </div>`;

    clearHTML();
    refs.infoContainer.innerHTML = markup;
  } else {
    countriesArray.forEach(country => {
      const {
        name: { official },
        flags: { svg },
      } = country;

      markup += `<li class="country-item">
      <img src="${svg}" alt="Flag of ${official}">
      <p clas="country-item-name">${official}</p>
    </li>`;
    });

    clearHTML();
    refs.list.innerHTML = markup;
  }
}

function clearHTML() {
  refs.infoContainer.innerHTML = '';
  refs.list.innerHTML = '';
}