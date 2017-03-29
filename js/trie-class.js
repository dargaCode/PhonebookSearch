
// CLASSES

function Trie() {
  rootNode = {};

  this.importNodesFromJsonString = function(jsonString) {
    const parsedObject = JSON.parse(jsonString);

    rootNode = parsedObject;
  }

  // store a simple keyword or store a specified value by a keyword
  this.store = function(keyword, value = null) {
    // don't bother continuing for an empty string
    if (keyword === '') {
      return;
    }

    // allow override of the keyword, so that the keyword and value stored don't have to be identital. If no value override is provided, though, keyword is stored as the value.
    if (!value) {
      value = keyword;
    }

    let node = rootNode;

    for (let char of keyword) {
      char = char.toLowerCase();

      if (!node[char]) {
        node[char] = {};
      }

      node = node[char];
    }

    if (!node.values) {
      node.values = [];
    }

    node.values.push(value);
  }

  this.containsKey = function(keyword) {
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
    results = recursiveSearch(node, results);

    return results;
  }

  function recursiveSearch(node, results) {
    for (let key in node) {
      if (key === 'values') {
        results = results.concat(node.values);
      } else {
        const childNode = node[key];
        results = recursiveSearch(childNode, results);
      }
    }

    return results;
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
