
// CONSTANTS

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

function saveJsonFile(trie) {
  const jsonString = trie.getJsonString();

  fs = require('fs');
  fs.writeFile('trie.json', jsonString);
}

// MAIN

const trie = new Trie();

const names = 'by bye bus bust busted buster bustier burr but butt butte butts butted butter buttress bury buried burn burned a an art arthritis arts arty artist artsy'.split(' ').sort();
const searchPrefixes = 'a by bus buster but butte'.split(' ');

for (const name of names) {
  trie.store(name);
}

for (prefix of searchPrefixes) {
  const searchResults = trie.prefixSearch(prefix);

  console.log('\nsearch prefix "%s":\n ', prefix, searchResults);
}

saveJsonFile(trie);
