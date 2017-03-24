
// CLASSES

function Trie() {
  rootNode = {};

  this.store = function(word) {
    if (word === '') {
      return;
    }

    let node = rootNode;

    for (const char of word) {
      if (!node[char]) {
        node[char] = {};
      }

      node = node[char];
    }

    if (!node.word) {
      node.word = word;
    }
  }

  this.contains = function(word) {
    let wordFound = true;

    if (word === '') {
      wordFound = false;
    } else {
      let node = rootNode;

      for (const char of word) {
        if (node[char]) {
          node = node[char];
        } else {
          wordFound = false;
          break;
        }
      }
    }

    return wordFound;
  }

  this.prefixSearch = function(prefix) {
    let node = rootNode;
    let results = [];

    for (const char of prefix) {
      if (node[char]) {
        node = node[char];
      } else {
        // prefix string not found at all
        return results;
      }
    }

    // append all words which include the prefix
    recursiveSearch(node, results);

    return results;
  }

  function recursiveSearch(node, results) {
    for (const key in node) {
      if (key === 'word') {
        results.push(node.word);
      } else {
        const childNode = node[key];
        recursiveSearch(childNode, results);
      }
    }
  }

  this.getJsonString = function() {
    const json = JSON.stringify(rootNode);

    return json;
  }
}

// CONSTANTS

const DEFAULT_RESULT_MESSAGE = 'results go here';
const SEARCH_FAIL_MESSAGE = 'no results found';

// DOM HOOKS

const searchInput = document.querySelector('#search-input');
const resultsDiv = document.querySelector('#results-div');

// EVENT BINDINGS

searchInput.addEventListener('input', function() {
  const input = searchInput.value;

  let searchResults;

  // don't display the entire trie on backspace to empty string
  if (input === '') {
    searchResults = null;
  } else  {
    searchResults = trie.prefixSearch(input);
  }

  displayResults(searchResults);
});

// FUNCTIONS

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

const names = 'by bye bus bust busted buster bustier burr but butt butte butts butted butter buttress bury buried burn burned a an art arthritis arts arty artist artsy'.split(' ').sort();
const searchPrefixes = 'a by bus buster but butte'.split(' ');

for (const name of names) {
  trie.store(name);
}

searchInput.focus();
