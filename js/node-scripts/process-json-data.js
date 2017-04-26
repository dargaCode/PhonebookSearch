
// CONSTANTS

const TRIE_CLASS_PATH = '../trie-class.js';
const PROVIDERS_JSON_PATH = '../../data/phonebook-raw.json';
const PROCESSED_DATA_JSON_PATH = `${__dirname}/../../data/phonebook-processed.json`;

// DEPENDENCIES

const providers = require(PROVIDERS_JSON_PATH);
const Trie = require(TRIE_CLASS_PATH);
const fs = require('fs');

// FUNCTIONS

function processProviders(providers) {
  const providerTrie = new Trie();
  const providerDict = {};

  for (const provider of providers) {
    // store the provider's id in a tree by its display name for fast lookup.
    storeProviderInTrie(provider, providerTrie);
    // store the provider's other data in a dict by its id, to help keep the tree as small as possible.
    storeProviderInDict(provider, providerDict);
  }

  // combine both structures for storage into json, for fewer requests
  const processedObj = {
    // Trie only surfaces a jsonString, not references to its actual nodes.
    trie: JSON.parse(providerTrie.getJsonString()),
    dict: providerDict,
  };

  return processedObj;
}

function storeProviderInTrie(provider, trie) {
  const providerKeywords = getProviderKeywords(provider);
  const providerId = provider.id;

  for (const keyword of providerKeywords) {
    trie.store(keyword, providerId);
  }
}

function storeProviderInDict(provider, dict) {
  const providerId = provider.id;
  const duplicateId = dict[providerId];

  if (!duplicateId) {
    dict[providerId] = provider;
  }
}

// we'll store each provider by first and last name, or all of the words in its org name. Then prefix searches will work for all the words in a query, so long as we filter the results in the browser script to providers that match all queries.
function getProviderKeywords(provider) {
  let keywords = [];

  // people
  if (provider.first_name) {
    const firstName = provider.first_name;
    const lastName = provider.last_name;

    keywords = [firstName, lastName];
  // organizations
  } else {
    const orgName = provider.organization_name;

    keywords = orgName.split(' ');
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
  const providerDataObj = processProviders(providers);

  saveProviderJson(providerDataObj);
}());
