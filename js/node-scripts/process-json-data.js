
// CONSTANTS

const TRIE_CLASS_PATH = '../trie-class.js';
const RAW_DATA_JSON_PATH = '../../data/phonebook-raw.json';
const PROCESSED_DATA_JSON_PATH = `${__dirname}/../../data/phonebook-processed.json`;

// DEPENDENCIES

const phonebookData = require(RAW_DATA_JSON_PATH);
const Trie = require(TRIE_CLASS_PATH);
const fs = require('fs');

// FUNCTIONS

function processData(phonebookEntries) {
  const phonebookTrie = new Trie();
  const phonebookDict = {};

  for (const entry of phonebookEntries) {
    // store the entry's id in a tree by its display name for fast lookup.
    storeEntryInTrie(entry, phonebookTrie);
    // store the entry's other data in a dict by its id, to help keep the tree as small as possible.
    storeEntryInDict(entry, phonebookDict);
  }

  // combine both structures for storage into json, for fewer requests
  const processedObj = {
    // Trie only surfaces a jsonString, not references to its actual nodes.
    trie: JSON.parse(phonebookTrie.getJsonString()),
    dict: phonebookDict,
  };

  return processedObj;
}

function storeEntryInTrie(entry, trie) {
  const entryKeywords = getEntryKeywords(entry);
  const entryId = entry.id;

  for (const keyword of entryKeywords) {
    trie.store(keyword, entryId);
  }
}

function storeEntryInDict(entry, dict) {
  const entryId = entry.id;
  const duplicateId = dict[entryId];

  if (!duplicateId) {
    dict[entryId] = entry;
  }
}

// we'll store each entry by all the words in its name, so searches can start with any word.
function getEntryKeywords(entry) {
  const keywords = entry.name.split(' ');

  return keywords;
}

function saveProcessedData(outputObj) {
  const jsonString = JSON.stringify(outputObj);

  fs.writeFile(PROCESSED_DATA_JSON_PATH, jsonString, function (err) {
    if (err) {
      console.log(err);
    } else {
      console.log('Saved processed data JSON:\n');
      console.log(jsonString);
    }
  });
}

// MAIN

(function main() {
  const processedDataObj = processData(phonebookData);

  saveProcessedData(processedDataObj);
}());
