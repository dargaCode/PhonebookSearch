
// CONSTANTS

const TRIE_JSON_PATH = '/data/provider-trie.json';
const DEFAULT_RESULT_MESSAGE = 'results go here';
const SEARCH_FAIL_MESSAGE = 'no results found';

// DOM HOOKS

const searchInput = document.querySelector('#search-input');
const resultsDiv = document.querySelector('#results-div');

// EVENT BINDINGS

searchInput.addEventListener('input', function() {
  const queryString = this.value;

  handleQueryInput(queryString);
});

// EVENT HANDLERS

function handleQueryInput(queryString) {
  // don't display the entire trie on backspace to empty string or spaces only
  if (queryString.trim() === '') {
    displayMessage(DEFAULT_RESULT_MESSAGE);
  } else  {
    const searchResults = trie.prefixSearch(queryString);

    if (searchResults.length === 0) {
      displayMessage(SEARCH_FAIL_MESSAGE);
    } else {
      const resultObj = buildResultObject(searchResults);
      displayResults(resultObj);
    }
  }
}

// FUNCTIONS

function loadTrieJson(callback) {
  const request = new XMLHttpRequest();
  // request.overrideMimeType("application/json");
  request.open('GET', TRIE_JSON_PATH, true);

  request.onreadystatechange = function () {
    if (request.readyState == 4 && request.status == "200") {
      callback(request.responseText);
    }
  };
  request.send();
}

function displayMessage(message) {
  const tempDiv = document.createElement('div');
  const paragraph = document.createElement('p');

  paragraph.textContent = message;
  tempDiv.appendChild(paragraph);

  resultsDiv.innerHTML = tempDiv.innerHTML;
}

function buildResultObject(providers) {
  const idSet = new Set();
  const resultObj = {};

  for (const provider of providers) {
    const providerId = provider.npi;
    const duplicate = idSet.has(providerId);

    // ignore duplicates
    if (!duplicate) {
      idSet.add(providerId);

      const providerDisplayName = provider.display_name;
      const providerZip = provider.zip;

      // matching display name already tracked; add onto it
      if (resultObj[providerDisplayName]) {
        const existingProviderObj = resultObj[providerDisplayName];

        existingProviderObj.locationSet.add(providerZip);
        existingProviderObj.providers.push(provider);
      // begin tracking display name
      } else {
        const newProviderObj = {
            locationSet: new Set(),
            providers: [],
        };

        newProviderObj.locationSet.add(providerZip);
        newProviderObj.providers.push(provider);

        resultObj[providerDisplayName] = newProviderObj;
      }
    };

    // console.log(idSet);
    // console.log(resultObj);

  }

  return resultObj;
}

function displayResults(resultObj) {
  console.log(resultObj);

  const tempDiv = document.createElement('div');

  for (let name in resultObj) {
    console.log(name);
    const paragraph = document.createElement('p');

    const nameCount = resultObj[name].providers.length;
    const locationCount = resultObj[name].locationSet.size;
    const namePlural = nameCount > 1 ? 's' : '';
    const locationPlural = nameCount > 1 ? 's' : '';
    const displayText = `${name} (${nameCount} provider${namePlural} in ${locationCount} location${locationPlural})`;

    paragraph.textContent = displayText;
    tempDiv.appendChild(paragraph);
  }

  resultsDiv.innerHTML = tempDiv.innerHTML;
}

// MAIN

const trie = new Trie();

loadTrieJson(function(responseText) {
  trie.importNodesFromJsonString(responseText);
});

searchInput.focus();
