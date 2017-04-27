
// CONSTANTS

const PHONEBOOK_JSON_PATH = './data/phonebook-processed.json';
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

function loadPhonebookJson(processDataCallback) {
  const request = new XMLHttpRequest();

  request.open('GET', PHONEBOOK_JSON_PATH, true);
  request.onreadystatechange = function () {
    if (request.readyState == 4 && request.status == '200') {
      const phonebookDataObj = JSON.parse(request.responseText);

      console.log('Imported phonebook data from JSON:');
      console.log(phonebookDataObj);

      processDataCallback(phonebookDataObj);
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
function multiWordSearch(queryWords, phonebookTrie) {
  const searchResultSets = [];

  for (const queryWord of queryWords) {
    const results = phonebookTrie.prefixSearch(queryWord);
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

// bundle the resultss array into object keys by their common display names. Track how many unique results and locations match each display name.
function bundleResults(resultIds, phonebookDict) {
  const idSet = new Set();
  const resultObj = {};

  for (const resultId of resultIds) {
    const result = phonebookDict[resultId];
    const duplicate = idSet.has(resultId);

    // ignore duplicates
    if (!duplicate) {
      idSet.add(resultId);

      const resultName = result.name;
      const resultZip = result.zip;

      // matching display name already tracked; add onto it
      if (resultObj[resultName]) {
        const existingResultBundle = resultObj[resultName];

        existingResultBundle.locationSet.add(resultZip);
        existingResultBundle.results.push(result);
      // begin tracking display name
      } else {
        const newResultBundle = {
            locationSet: new Set(),
            results: [],
        };

        newResultBundle.locationSet.add(resultZip);
        newResultBundle.results.push(result);

        resultObj[resultName] = newResultBundle;
      }
    }
  }

  return resultObj;
}

function addResultsToDom(resultObj, resultsModal) {
  const tempDiv = document.createElement('div');

  for (let displayName in resultObj) {
    const nameBundle = resultObj[displayName];
    const resultNameCard = createResultNameCard(displayName, nameBundle);

    tempDiv.appendChild(resultNameCard);

    resultNameCard.addEventListener('click', function() {
      resultsModal.displayResults(displayName, nameBundle.results);
    });
  }

  // append elements (rather than using innerHTML assignment) so that divs can bring along their events.
  clearResultsDiv();
  resultsHolderDiv.appendChild(tempDiv);
}

function createResultNameCard(displayName, nameBundle) {
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
  const nameCount = nameBundle.results.length;

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
  const phonebookTrie = new Trie();
  const resultsModal = new ResultsModal();
  let phonebookDict = {};

  loadPhonebookJson(function(phonebookDataObj) {
    // trie only imports nodes in string form, for safety
    const trieJsonText = JSON.stringify(phonebookDataObj.trie);

    phonebookTrie.importNodesFromJsonString(trieJsonText);
    phonebookDict = phonebookDataObj.dict;

    enableSearchBox();
  });

  // use callback function so data structures can be passed to helper functions
  bindSearchEvent(function(queryString) {
    const uniqueQueryWords = getUniqueQueryWords(queryString);
    const anyQueryWords = uniqueQueryWords.length > 0;

    if (anyQueryWords) {
      const searchResults = multiWordSearch(uniqueQueryWords, phonebookTrie);
      const anySearchResults = searchResults.length > 0;

      if (anySearchResults) {
        const resultBundleObj = bundleResults(searchResults, phonebookDict);

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
