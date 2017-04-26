
// CONSTANTS

const PROVIDER_JSON_PATH = './data/providers-processed.json';
const SEARCH_FAIL_MESSAGE = 'No results found!';
const DISABLED_CLASS = 'disabled';
const NAME_CARD_DIV_CLASS = 'name-card';
const DISPLAY_NAME_PARAGRAPH_CLASS = 'display-name';
const SUMMARY_PARAGRAPH_CLASS = 'summary';
const ES_PLURALIZER_WORD_ENDINGS = new Set([
  's',
  'x',
  'z',
  'ch',
  'sh',
]);

// DOM HOOKS

const searchInput =      document.querySelector('#search-input');
const resultsHolderDiv = document.querySelector('#search-results-holder');

// EVENT BINDINGS

// use a callback as event handler so that main can pass data structures through it.
function bindSearchEvent(eventHandlerCallback) {
  searchInput.addEventListener('input', function() {
    const queryString = this.value;

    eventHandlerCallback(queryString);
  });
}

// FUNCTIONS

function loadProviderJson(processDataCallback) {
  const request = new XMLHttpRequest();

  request.open('GET', PROVIDER_JSON_PATH, true);
  request.onreadystatechange = function () {
    if (request.readyState == 4 && request.status == '200') {
      const providerDataObj = JSON.parse(request.responseText);

      console.log('Imported phonebook data from JSON:');
      console.log(providerDataObj);

      processDataCallback(providerDataObj);
    }
  };

  request.send();
}

// called once the JSON has finished loading
function enableSearchBox() {
  searchInput.disabled = false;
  searchInput.classList.remove(DISABLED_CLASS);
  // was 'loading' before
  searchInput.placeholder = '';
  searchInput.focus();
}

// duplicate words and especially empty query words (which get every single result in the Trie) slow down performance drastically, so make sure each query word is unique and non-empty.
function getUniqueQueryWords(queryString) {
  let results = [];
  const trimmedQuery = queryString.trim();
  const nonEmptyQuery = Boolean(trimmedQuery);

  if (nonEmptyQuery) {
    // strip out consecutive spaces, to make sure there are no empty query words,
    const queryWords = trimmedQuery.split(/\s+/);
    const uniqueWords = new Set(queryWords);

    results = Array.from(uniqueWords);
  }

  return results;
}

// run a search for each word and only return the results common between all.
function multiWordSearch(queryWords, providerTrie) {
  const searchResultSets = [];

  for (const queryWord of queryWords) {
    const results = providerTrie.prefixSearch(queryWord);
    const resultSet = new Set(results);

    searchResultSets.push(resultSet);
  }

  const commonResults = getCommonResults(searchResultSets);

  return commonResults;
}

function getCommonResults(searchResultSets) {
  const commonResults = [];
  const firstSet = searchResultSets.shift();

  for (const result of firstSet) {
    const commonResult = searchResultSets.every(function(set) {
      return set.has(result);
    });

    if (commonResult) {
      commonResults.push(result);
    }
  }

  return commonResults;
}

function displayMessageInDom(message) {
  const tempDiv = document.createElement('div');
  const messageParagraph = createParagraph(message);

  tempDiv.appendChild(messageParagraph);

  resultsHolderDiv.innerHTML = tempDiv.innerHTML;
}

// bundle the providers array into object keys by their common display names. Track how many unique providers and locations match each display name.
function bundleResults(resultIds, providerDict) {
  const idSet = new Set();
  const resultObj = {};

  for (const providerId of resultIds) {
    const provider = providerDict[providerId];
    const duplicate = idSet.has(providerId);

    // ignore duplicates
    if (!duplicate) {
      idSet.add(providerId);

      const providerDisplayName = getDisplayName(provider);
      const providerZip = provider.zip;

      // matching display name already tracked; add onto it
      if (resultObj[providerDisplayName]) {
        const existingProviderBundle = resultObj[providerDisplayName];

        existingProviderBundle.locationSet.add(providerZip);
        existingProviderBundle.providers.push(provider);
      // begin tracking display name
      } else {
        const newProviderBundle = {
            locationSet: new Set(),
            providers: [],
        };

        newProviderBundle.locationSet.add(providerZip);
        newProviderBundle.providers.push(provider);

        resultObj[providerDisplayName] = newProviderBundle;
      }
    }
  }

  return resultObj;
}

function getDisplayName(provider) {
  let displayName;

  // person
  if (provider.first_name) {
    displayName = `${provider.first_name} ${provider.last_name}`;
  // organization
  } else {
    displayName = provider.organization_name;
  }

  return displayName;
}

function addResultsToDom(resultObj, resultsModal) {
  const tempDiv = document.createElement('div');

  for (let displayName in resultObj) {
    const nameBundle = resultObj[displayName];
    const providerNameCard = createProviderNameCard(displayName, nameBundle);

    tempDiv.appendChild(providerNameCard);

    providerNameCard.addEventListener('click', function() {
      resultsModal.displayProviders(displayName, nameBundle.providers);
    });
  }

  // append elements (rather than using innerHTML assignment) so that divs can bring along their events.
  clearResultsDiv();
  resultsHolderDiv.appendChild(tempDiv);
}

function createProviderNameCard(displayName, nameBundle) {
  const nameCardDiv = document.createElement('div');
  const nameParagraph = createDisplayNameParagraph(displayName);
  const summaryParagraph = createSummaryParagraph(displayName, nameBundle);

  nameCardDiv.appendChild(nameParagraph);
  nameCardDiv.appendChild(summaryParagraph);
  nameCardDiv.classList.add(NAME_CARD_DIV_CLASS);

  return nameCardDiv;
}

function createDisplayNameParagraph(displayName) {
  const nameParagraph = createParagraph(displayName);

  nameParagraph.classList.add(DISPLAY_NAME_PARAGRAPH_CLASS);

  return nameParagraph;
}

function createSummaryParagraph(displayName, nameBundle) {
  const nameCount = nameBundle.providers.length;

  let summaryText;

  if (nameCount === 1) {
    summaryText = `We found 1 ${displayName}`;
  } else {
    const pluralName = getPluralName(displayName);
    const locationCount = nameBundle.locationSet.size;
    const locationPluralizer = locationCount > 1 ? 's' : '';

    summaryText = `We found ${nameCount} ${pluralName} in ${locationCount} location${locationPluralizer}`;
  }

  const summaryParagraph = createParagraph(summaryText);

  summaryParagraph.classList.add(SUMMARY_PARAGRAPH_CLASS);

  return summaryParagraph;
}

function getPluralName(name) {
  const lastLetter = name.slice(-1);
  const lastTwoLetters = name.slice(-2);
  let pluralName;
  const esPluralizer = ES_PLURALIZER_WORD_ENDINGS.has(lastLetter) || ES_PLURALIZER_WORD_ENDINGS.has(lastTwoLetters);

  if (esPluralizer) {
    pluralName = `${name}es`;
  } else {
    pluralName = `${name}s`;
  }

  return pluralName;
}

function createParagraph(textContent) {
  const paragraph = document.createElement('p');

  paragraph.textContent = textContent;

  return paragraph;
}

function clearResultsDiv() {
  resultsHolderDiv.innerHTML = '';
}

// MAIN

(function main() {
  const providerTrie = new Trie();
  const resultsModal = new ResultsModal();
  let providerDict = {};

  loadProviderJson(function(providerDataObj) {
    // trie only imports nodes in string form, for safety
    const trieJsonText = JSON.stringify(providerDataObj.trie);

    providerTrie.importNodesFromJsonString(trieJsonText);
    providerDict = providerDataObj.dict;

    enableSearchBox();
  });

  // use callback function so data structures can be passed to helper functions
  bindSearchEvent(function(queryString) {
    const uniqueQueryWords = getUniqueQueryWords(queryString);
    const anyQueryWords = uniqueQueryWords.length > 0;

    if (anyQueryWords) {
      const searchResults = multiWordSearch(uniqueQueryWords, providerTrie);
      const anySearchResults = searchResults.length > 0;

      if (anySearchResults) {
        const resultBundleObj = bundleResults(searchResults, providerDict);

        addResultsToDom(resultBundleObj, resultsModal);
      // no search results
      } else {
        displayMessageInDom(SEARCH_FAIL_MESSAGE);
      }
    // no query words
    } else {
      clearResultsDiv();
    }
  });
}());
