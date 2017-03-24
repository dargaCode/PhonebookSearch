
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

// FUNCTIONS

function processProviders(providers) {
  const providersTrie = new Trie();

  for (const provider of providers) {
    providersTrie.store(provider.first_name || 'blah');
  }

  return providersTrie;
}

function saveTrieJson(trie) {
  const fs = require('fs');
  const jsonString = trie.getJsonString();

  fs.writeFile('provider-trie.json', jsonString, function (err) {
    if (err) {
      console.log(err);
    }
  });
}

// MAIN

(function main() {
  const providers = require('./providers.json');

  const providersTrie = processProviders(providers);

  saveTrieJson(providersTrie);
}());
