
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
      const resultObj = bundleResults(searchResults);
      displayResultsInDom(resultObj);
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

  const messageParagraph = createParagraph(message);

  tempDiv.appendChild(messageParagraph);

  resultsDiv.innerHTML = tempDiv.innerHTML;
}

// bundle the providers array into object keys by their common display names. Track how many unique providers and locations match each display name.
function bundleResults(providers) {
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
  }

  return resultObj;
}

function displayResultsInDom(resultObj) {
  console.log(resultObj);

  const tempDiv = document.createElement('div');

  for (let displayName in resultObj) {
    const nameBundle = resultObj[displayName];

    const providerNameCard = createProviderNameCard(displayName, nameBundle);

    tempDiv.appendChild(providerNameCard);
  }

  resultsDiv.innerHTML = tempDiv.innerHTML;
}

function createProviderNameCard(displayName, nameBundle) {
  const nameCardDiv = document.createElement('div');
  const nameParagraph = createDisplayNameParagraph(displayName);
  const summaryParagraph = createSummaryParagraph(displayName, nameBundle);

  nameCardDiv.appendChild(nameParagraph);
  nameCardDiv.appendChild(summaryParagraph);

  return nameCardDiv;
}

function createDisplayNameParagraph(displayName) {
  const nameParagraph = createParagraph(displayName);

  return nameParagraph;
}

function createSummaryParagraph(displayName, nameBundle) {
  const nameCount = nameBundle.providers.length;

  let summaryText;

  if (nameCount === 1) {
    summaryText = `We found 1 ${displayName} nearby`;
  } else {
    const locationCount = nameBundle.locationSet.size;
    const locationPlural = nameCount > 1 ? 's' : '';

    summaryText = `We found ${nameCount} ${displayName}s practicing in ${locationCount} location${locationPlural} nearby`;
  }

  const summaryParagraph = createParagraph(summaryText);

  return summaryParagraph;
}

function createParagraph(textContent) {
  const paragraph = document.createElement('p');

  paragraph.textContent = textContent;

  return paragraph;
}

// MAIN

const trie = new Trie();

loadTrieJson(function(responseText) {
  trie.importNodesFromJsonString(responseText);
});

searchInput.focus();
