
// CONSTANTS

const PROVIDER_JSON_PATH = './data/providers-processed.json';
const SEARCH_FAIL_MESSAGE = 'No results found!';
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

const searchInput = document.querySelector('#search-input');
const resultsHolderDiv = document.querySelector('#search-results-holder');

// EVENT BINDINGS

searchInput.addEventListener('input', function() {
  const queryString = this.value;

  handleQueryInput(queryString);
});

// EVENT HANDLERS

function handleQueryInput(queryString) {
  queryString = queryString.trim();
  const validQuery = queryString != '';

  // don't display the entire trie on backspace to empty string or spaces only
  if (validQuery) {
    const searchResults = multiWordSearch(queryString);

    if (searchResults.length === 0) {
      displayMessageInDom(SEARCH_FAIL_MESSAGE);
    } else {
      const resultBundleObj = bundleResults(searchResults);

      addResultsToDom(resultBundleObj);
    }
  } else {
    clearResultsDiv();
  }
}

// FUNCTIONS

function loadProviderJson(callback) {
  const request = new XMLHttpRequest();

  request.open('GET', PROVIDER_JSON_PATH, true);
  request.onreadystatechange = function () {
    if (request.readyState == 4 && request.status == '200') {
      const providerDataObj = JSON.parse(request.responseText);

      console.log('Imported provider data from JSON:');
      console.log(providerDataObj);

      callback(providerDataObj);
    }
  };

  request.send();
}

// run a search for each word and only return the results common between all.
function multiWordSearch(queryString) {
  const queryWords = queryString.split(' ');
  const searchResultSets = [];

  for (queryWord of queryWords) {
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

  for (result of firstSet) {
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
function bundleResults(resultNpis) {
  const idSet = new Set();
  const resultObj = {};

  for (const providerNpi of resultNpis) {
    const provider = providerDict[providerNpi];

    const duplicate = idSet.has(providerNpi);

    // ignore duplicates
    if (!duplicate) {
      idSet.add(providerNpi);

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
    };
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

function addResultsToDom(resultObj) {
  const tempDiv = document.createElement('div');

  for (let displayName in resultObj) {
    const nameBundle = resultObj[displayName];

    const providerNameCard = createProviderNameCard(displayName, nameBundle);

    tempDiv.appendChild(providerNameCard);

    providerNameCard.addEventListener('click', function() {
      const providersJson = JSON.stringify(nameBundle.providers);
      alert(`${displayName} Provider Data:\n\n${providersJson}`);
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
    summaryText = `We found 1 ${displayName} nearby`;
  } else {
    const pluralName = getPluralName(displayName);
    const locationCount = nameBundle.locationSet.size;
    const locationPluralizer = locationCount > 1 ? 's' : '';

    summaryText = `We found ${nameCount} ${pluralName} practicing in ${locationCount} location${locationPluralizer} nearby`;
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

// must be a better way to make these available to events than making them global variables
const providerTrie = new Trie();
let providerDict = {};

loadProviderJson(function(providerDataObj) {
  // trie only imports nodes in string form, for safety
  const trieJsonText = JSON.stringify(providerDataObj.trie);

  providerTrie.importNodesFromJsonString(trieJsonText);
  providerDict = providerDataObj.dict;

  searchInput.focus();
});
