
// CLASSES

function Trie() {
  rootNode = {};

  this.importNodesFromJsonString = function(jsonString) {
    const parsedObject = JSON.parse(jsonString);

    console.log('Data parsed from JSON:');
    console.log(parsedObject);

    rootNode = parsedObject;
  }

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

// Enable this class to be called by both browser scripts and nodejs require statements.

// Detect that the environment is nodejs, so this code doesn't break the browser.
if (typeof module !== 'undefined' && module.exports) {
  // Export Trie from this module for inclusion in nodejs require statement.
  module.exports = Trie;
}
