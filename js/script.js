
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

  // don't display the entire trie on backspace to empty string
  if (queryString === '') {
    searchResults = null;
  } else  {
    searchResults = trie.prefixSearch(queryString);
  }

  displayResults(searchResults);
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

function displayResults(results) {
  const tempDiv = document.createElement('div');

  if (results === null) {
    results = [];
    results.push(DEFAULT_RESULT_MESSAGE);
  } else if (results.length === 0) {
    results.push(SEARCH_FAIL_MESSAGE);
  }

  for (const result of results) {
    const paragraph = document.createElement('p');

    paragraph.textContent = result;
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
