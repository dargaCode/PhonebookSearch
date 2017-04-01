
// CONSTANTS

const SUBMIT_DISABLED_MESSAGE = 'Complete the form to continue enrollment';
const SUBMIT_ENABLED_MESSAGE = 'I understand and wish to continue with enrollment';
const CURRENT_PAGE = 'index.html';
const SEARCH_PAGE = 'search.html';

// DOM HOOKS

const form  =           document.querySelector('#registration-form');
const firstNameInput =  document.querySelector('#first-name-input');
const lastNameInput =   document.querySelector('#last-name-input');
const cityInput =       document.querySelector('#city-input');
const consentCheckbox = document.querySelector('#consent-checkbox');
const submitButton =    document.querySelector('#submit-button');

// EVENT BINDINGS

firstNameInput.addEventListener( 'input', updateSubmitButton);
lastNameInput.addEventListener(  'input', updateSubmitButton);
cityInput.addEventListener(      'input', updateSubmitButton);
consentCheckbox.addEventListener('click', updateSubmitButton);

form.addEventListener(           'submit', function(event) {
  // don't use the default submit functionality
  event.preventDefault();

  handleSubmitClick();
});

// EVENT HANDLERS

// using `required` html property to actually prevent submit, so all that needs to change on the submit button is changing its appearance.
function updateSubmitButton() {
  if (isAnyInputEmpty()) {
    submitButton.classList.add('disabled');
    submitButton.value = SUBMIT_DISABLED_MESSAGE;
  } else {
    submitButton.classList.remove('disabled');
    submitButton.value = SUBMIT_ENABLED_MESSAGE;
  }
}

function handleSubmitClick() {
  const payloadObj = getFormContents();

  sentRequestFromObj(payloadObj);

  // It's impossible to see the request in devtools before the redirect happens, so I'm also adding it to the search url as a query string.
  const queryString = generateQueryString(payloadObj);

  redirectToSearch(queryString);
}

// FUNCTIONS

function isAnyInputEmpty() {
  const textInputs = [firstNameInput, lastNameInput, cityInput];
  let anyInputEmpty = false;

  if (!consentCheckbox.checked) {
    anyInputEmpty = true;
  } else {
    for (textInput of textInputs) {
      const empty = textInput.value === '';

      if (empty) {
        anyInputEmpty = true;

        break;
      }
    }
  }

  return anyInputEmpty;
}

function getFormContents() {
  const firstName = firstNameInput.value;
  const lastName = lastNameInput.value;
  const city = cityInput.value;

  const payload = {
    firstName: firstName,
    lastName: lastName,
    city: city,
  };

  return payload;
}

function sentRequestFromObj(payload) {
  const payloadString = JSON.stringify(payload);
  const request = new XMLHttpRequest();

  request.open('POST', CURRENT_PAGE, true);
  request.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
  request.onreadystatechange = function () {
    if (request.readyState == 4 && request.status == '200') {
      console.log(request.responseText);
    }
  };

  request.send(payloadString);
}

// not recursive, for simple objects only
function generateQueryString(payloadObj) {
  const queryChunks = [];

  for (key in payloadObj) {
    const value = payloadObj[key];
    const queryChunk = `${key}=${value}`;

    queryChunks.push(queryChunk);
  }

  const queryString = `?${queryChunks.join('&')}`;

  return queryString;
}

function redirectToSearch(queryString) {
  const searchUrl = `${SEARCH_PAGE}${queryString}`;

  window.location = searchUrl;
}

// MAIN

updateSubmitButton();
firstNameInput.focus();
