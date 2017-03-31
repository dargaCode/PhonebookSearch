
// CONSTANTS

const SUBMIT_DISABLED_MESSAGE = 'Complete the form to continue enrollment';
const SUBMIT_ENABLED_MESSAGE = 'I understand and wish to continue with enrollment';

// DOM HOOKS

const firstNameInput =  document.querySelector('#first-name-input');
const lastNameInput =   document.querySelector('#last-name-input');
const cityInput =       document.querySelector('#city-input');
const consentCheckbox = document.querySelector('#consent-checkbox');
const submitButton =    document.querySelector('#submit-button');

const labels =          document.querySelectorAll('label');

// EVENT BINDINGS

firstNameInput.addEventListener( 'input', updateSubmitButton);
lastNameInput.addEventListener(  'input', updateSubmitButton);
cityInput.addEventListener(      'input', updateSubmitButton);
consentCheckbox.addEventListener('click', updateSubmitButton);

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

// MAIN

updateSubmitButton();
firstNameInput.focus();
