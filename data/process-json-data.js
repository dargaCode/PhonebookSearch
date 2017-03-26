
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
    categorizeProvider(provider);
    addDisplayName(provider);
    providersTrie.storeProvider(provider);
  }

  return providersTrie;
}

// add useful tagging to provider for later use
function categorizeProvider(provider) {
  let providerType;

  if (provider.first_name) {
    providerType = 'person';
  } else if (provider.organization_name) {
    providerType = 'organization';
  } else {
    console.log('ERROR: malformed provider json');
  }

  provider.type = providerType;
}

// add common field to display later
function addDisplayName(provider) {
  let displayName;

  if (provider.type === 'person') {
    displayName = `${provider.first_name} ${provider.last_name}`;
  } else {
    displayName = provider.organization_name;
  }

  provider.display_name = displayName;
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
