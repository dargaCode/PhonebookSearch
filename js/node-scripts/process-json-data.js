
// CONSTANTS

const TRIE_CLASS_PATH = '../trie-class.js';
const PROVIDERS_JSON_PATH = '../../data/providers-input.json';
const PROCESSED_DATA_JSON_PATH = './data/providers-processed.json';

// DEPENDENCIES

const providers = require(PROVIDERS_JSON_PATH);
const Trie = require(TRIE_CLASS_PATH);
const fs = require('fs');

// FUNCTIONS

function processProviders(providers) {
  const providerTrie = new Trie();
  const providerDict = {};

  for (const provider of providers) {
    categorizeProvider(provider);
    addDisplayName(provider);
    // store the provider's npi id in a tree by its display name for fast lookup.
    storeProviderInTrie(provider, providerTrie);
    // store the provider's other data in a dict by its npi id, to help keep the tree as small as possible.
    storeProviderInDict(provider, providerDict);
  }

  // combine both structures for storage into json, for fewer requests
  const processedObj = {
    // Trie only surfaces a jsonString, not references to its actual nodes.
    trie: JSON.parse(providerTrie.getJsonString()),
    dict: providerDict,
  }

  return processedObj;
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

function storeProviderInTrie(provider, trie) {
  const providerKeywords = getProviderKeywords(provider);
  const providerNpi = provider.npi;

  for (keyword of providerKeywords) {
    trie.store(keyword, providerNpi);
  }
}

function storeProviderInDict(provider, dict) {
  const providerNpi = provider.npi;

  const duplicateNpi = dict[providerNpi];

  if (!duplicateNpi) {
    dict[providerNpi] = provider;
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

function saveProviderJson(outputObj) {
  const jsonString = JSON.stringify(outputObj);

  fs.writeFile(PROCESSED_DATA_JSON_PATH, jsonString, function (err) {
    if (err) {
      console.log(err);
    } else {
      console.log('Saved provider json:\n');
      console.log(jsonString);
    }
  });
}

// MAIN

(function main() {
  const providerObj = processProviders(providers);

  saveProviderJson(providerObj);
}());
