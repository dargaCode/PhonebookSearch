
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
  let searchResults;

  // don't display the entire trie on backspace to empty string or spaces only
  if (queryString.trim() === '') {
    displayMessage(DEFAULT_RESULT_MESSAGE);
  } else  {
    searchResults = trie.prefixSearch(queryString);

    if (searchResults.length === 0) {
      displayMessage(SEARCH_FAIL_MESSAGE);
    } else {
      displayResults(searchResults);
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

function displayResults(results) {
  const tempDiv = document.createElement('div');

  for (const result of results) {
    const paragraph = document.createElement('p');
    const displayText = `${result.display_name} (${result.npi})`;

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
