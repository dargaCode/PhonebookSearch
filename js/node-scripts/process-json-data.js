
// CONSTANTS

const TRIE_CLASS_PATH = '../trie-class.js';
const PROVIDERS_SOURCE_PATH = '../../data/providers-input.json';
const PROCESSED_TRIE_PATH = './data/providers-processed.json';

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
    storeProvider(providersTrie, provider);
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

storeProvider = function(trie, provider) {
  const providerKeywords = getProviderKeywords(provider);

  for (keyword of providerKeywords) {
    trie.store(keyword, provider);
  }
}

// we'll store each provider by multiple words, so they can be searched more easily. For people, the full name and last name. For orgs, the full org name, and each word of the org name after the first word.
// Don't need to store the first name or the first org word, since those are already included by storing the entire name.
function getProviderKeywords(provider) {
  let keywords = [];

  // people
  if (provider.first_name) {
    const firstName = provider.first_name;
    const lastName = provider.last_name;
    const fullName = `${firstName} ${lastName}`;

    keywords = [fullName, lastName];
  // organizations
  } else {
    const orgName = provider.organization_name;
    const orgWords = orgName.split(' ')

    keywords.push(orgName);

    // skip the first word, since it's already included in the full org name
    for (let i = 0; i < orgWords.length; i++) {
      if (i >= 1) {
        keywords.push(orgWords[i]);
      }
    }
  }

  return keywords;
}

function saveTrieJson(trie) {
  const jsonString = trie.getJsonString();

  fs.writeFile(PROCESSED_TRIE_PATH, jsonString, function (err) {
    if (err) {
      console.log(err);
    } else {
      console.log('Saved trie json:\n');
      console.log(jsonString);
    }
  });
}

// MAIN

(function main() {
  const providersTrie = processProviders(providers);

  saveTrieJson(providersTrie);
}());
