
// CONSTANTS

const DISPLAY_NAME = 'Providers named "Salem Pediatric Hospital"';
const TEST_PROVIDERS = [
  {
    address: '2200 Main Street',
    city: 'Townville Acres',
    organization_name:"Salem Pediatric Hospital",
    zip:"55555",
    npi:1151,
    phone: '1234567890',
  },
  {
    address: '2200 Main Street',
    city: 'Townville Acres',
    organization_name:"Salem Pediatric Hospital",
    zip:"55555",
    npi:1355,
    phone: '5555555555',
  },
  {
    address: '2200 Main Street',
    city: 'Townville Acres',
    organization_name:"Salem Pediatric Hospital",
    zip:"22222",
    npi:1372,
    phone: '5555555555',
  },
  {
    address: '2200 Main Street',
    city: 'Townville Acres',
    organization_name:"Salem Pediatric Hospital",
    zip:"44444",
    npi:1585,
    phone: '5555555555',
  },
  {
    address: '2200 Main Street',
    city: 'Townville Acres',
    organization_name:"Salem Pediatric Hospital",
    zip:"11111",
    npi:1877,
    phone: '5555555555',
  },
];
const VISIBLE_DATA_KEYS = [
  'address',
  'city',
  'phone',
]

// DOM HOOKS

const providerNameH2 = document.querySelector('#provider-name-h2');
const dataHolderDiv = document.querySelector('#provider-data-holder');

// EVENT BINDINGS


// EVENT HANDLERS


// FUNCTIONS

function displayProviders(displayName, providers) {
  const tempDiv = document.createElement('div');

  for (provider of providers) {
    const providerDataCard = getProviderDataCard(provider);

    providerDataCard.classList.add('data-card');

    tempDiv.appendChild(providerDataCard);
  }

  dataHolderDiv.innerHTML = tempDiv.innerHTML;
  providerNameH2.textContent = displayName;
}

function getProviderDataCard(provider) {
  const div = document.createElement('div');

  const visibleKeys = []

  // only some key/value pairs from the provider object are displayed
  for (key of VISIBLE_DATA_KEYS) {
    let value = provider[key];

    // a couple of values need special formatting
    if (key === 'city') {
      value = `${provider.city} (${provider.zip})`;
    } else if (key === 'phone') {
      value = formatPhoneNumber(provider.phone);
    }

    const dataParagraph = getDataParagraph(key, value);

    div.appendChild(dataParagraph);
  }

  return div;
}

function formatPhoneNumber(phoneStr) {
  const areaCode = phoneStr.slice(0, 3);
  const prefix =   phoneStr.slice(3, 6);
  const body =     phoneStr.slice(6);

  const formatted = `(${areaCode}) ${prefix}-${body}`;

  return formatted;
}

function getDataParagraph(key, value) {
  const paragraph = document.createElement('p');

  const titleCasedKey = titleCaseWord(key);

  const htmlString = `<strong>${titleCasedKey}:</strong> ${value}`;

  paragraph.innerHTML = htmlString;

  return paragraph;
}

function titleCaseWord(word) {
  const first = word.charAt(0);
  const firstUpper = first.toUpperCase();
  const remainder = word.slice(1);
  const remainderLower = remainder.toLowerCase();

  const titleCased = `${firstUpper}${remainderLower}`;

  return titleCased;
}

// MAIN

displayProviders(DISPLAY_NAME, TEST_PROVIDERS);
