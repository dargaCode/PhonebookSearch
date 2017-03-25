
// CONSTANTS

const TRIE_CLASS_PATH = '../js/trie.js';
const PROVIDERS_SOURCE_PATH = './providers-input.json';
const PROCESSED_TRIE_PATH = './data/provider-trie.json';

// DEPENDENCIES

const providers = require(PROVIDERS_SOURCE_PATH);
const Trie = require(TRIE_CLASS_PATH);
const fs = require('fs');

// FUNCTIONS

function processProviders(providers) {
  const providersTrie = new Trie();

  for (const provider of providers) {
    providersTrie.store(provider.first_name || 'blah');
  }

  return providersTrie;
}

function saveTrieJson(trie) {
  const jsonString = trie.getJsonString();

  console.log('Saved trie json:\n');
  console.log(jsonString);

  fs.writeFile(PROCESSED_TRIE_PATH, jsonString, function (err) {
    if (err) {
      console.log(err);
    }
  });
}

// MAIN

(function main() {
  const providersTrie = processProviders(providers);

  saveTrieJson(providersTrie);
}());
