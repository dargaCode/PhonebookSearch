
// CLASSES

function Trie() {
  rootNode = {};

  this.importNodesFromJsonString = function(jsonString) {
    const parsedObject = JSON.parse(jsonString);

    console.log('Data parsed from JSON:');
    console.log(parsedObject);

    rootNode = parsedObject;
  }

  this.storeProvider = function(provider) {
    const providerKeywords = getProviderKeywords(provider);

    for (keyword of providerKeywords) {
      this.store(keyword);
    }
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

  // HELPER METHODS

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
}

// Enable this class to be called by both browser scripts and nodejs require statements.

// Detect that the environment is nodejs, so this code doesn't break the browser.
if (typeof module !== 'undefined' && module.exports) {
  // Export Trie from this module for inclusion in nodejs require statement.
  module.exports = Trie;
}
