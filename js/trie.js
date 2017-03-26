
// CLASSES

function Trie() {
  rootNode = {};

  this.importNodesFromJsonString = function(jsonString) {
    const parsedObject = JSON.parse(jsonString);

    console.log('Data parsed from JSON:');
    console.log(parsedObject);

    rootNode = parsedObject;
  }

  this.store = function(keyword) {
    if (keyword === '') {
      return;
    }

    let node = rootNode;

    for (let char of keyword) {
      char = char.toLowerCase();

      if (!node[char]) {
        node[char] = {};
      }

      node = node[char];
    }

    if (!node.keyword) {
      node.keyword = keyword;
    }
  }

  this.contains = function(keyword) {
    let wordFound = true;

    if (keyword === '') {
      wordFound = false;
    } else {
      let node = rootNode;

      for (let char of keyword) {
        char = char.toLowerCase();

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

    for (let char of prefix) {
      char = char.toLowerCase();

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
    for (let key in node) {
      if (key === 'keyword') {
        results.push(node.keyword);
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
