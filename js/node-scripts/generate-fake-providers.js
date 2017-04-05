
// CONSTANTS

const PROVIDER_OUTPUT_PATH = `${__dirname}/../../data/providers-input.json`;
const MAX_ADDRESS_NUMBER = 5000;
const PHONE_NUMBER_LENGTH = 10;
const PROVIDER_COUNT = 2000;

// duplicate values adjust probabilities
const PROVIDER_TYPES = [
  'person',
  'person',
  'person',
  'person',
  'person',
  'org',
  'org',
];

const FIRST_NAMES = [
  // male
  'Ahmed',
  'Adam',
  'Benjamin',
  'Charles',
  'David',
  'Evan',
  'Feng',
  'George',
  'Hideo',
  'Ichiro',
  'John',
  'Krishna',
  'Liang',
  'Louis',
  'Mohammed',
  'Michael',
  'Matthew',
  'Nathan',
  'Omar',
  'Pablo',
  'Qasim',
  'Richard',
  'Samuel',
  'Tyrone',
  'Timothy',
  'Uriah',
  'Vincent',
  'Walter',
  'Xiu',
  'Youssef',
  'Zhen',
  // female
  'Angela',
  'Bethany',
  'Chun',
  'Christina',
  'Dana',
  'Ebony',
  'Elizabeth',
  'Fatima',
  'Georgia',
  'Hannah',
  'Ito',
  'Jasmine',
  'Jessica',
  'Kara',
  'Lyndsay',
  'Maria',
  'Nour',
  'Nancy',
  'Olivia',
  'Padma',
  'Qi',
  'Rachel',
  'Sophia',
  'Theresa',
  'Umeko',
  'Veronica',
  'Wen',
  'Xiulan',
  'Yumiko',
  'Zara',
];

const LAST_NAMES = [
  'Anderson',
  'Bashir',
  'Carter',
  'Davis',
  'Edwards',
  'Ford',
  'Gonzalez',
  'Hernandez',
  'Imam',
  'Jones',
  'Kamal',
  'Lee',
  'Miller',
  'Nguyen',
  'Oates',
  'Patel',
  'Quan',
  'Rodriguez',
  'Singh',
  'Tran',
  'Udvadia',
  'Valenti',
  'Wahab',
  'Xiong',
  'Yang',
  'Zhukov',
];

const ORG_TYPES = [
  'locale',
  'saint',
  'saint',
  'saint',
  'saint',
  'saint',
  'saint',
];

const ORG_SUFFIXES = [
  'Hospital',
  'Pediatric Hospital',
  'Medical Center',
  'General Hospital',
  'Trauma Center',
];

const STREET_NAMES = [
  'Main',
  'Oak',
  'Elm',
  'Pine',
  'Cedar',
  'Birch',
  'Park',
  'First',
  'Second',
  'Third',
  'Fourth',
  'Fifth',
  'Sixth',
  'Seventh',
  'Eighth',
  'Ninth',
];

const STREET_SUFFIXES = [
  'Street',
  'Street',
  'Street',
  'Avenue',
  'Avenue',
  'Court',
  'Place',
  'Lane',
];

const ZIP_CODES = [
  '11111',
  '22222',
  '33333',
  '44444',
  '55555',
  '66666',
  '77777',
  '88888',
  '99999',
];

const ZIP_CODES_TO_CITY_NAMES = {
  11111: 'Oceanside',
  22222: 'Franklin',
  33333: 'Greenville',
  44444: 'Williamsport',
  55555: 'Oakland',
  66666: 'Fairview',
  77777: 'Salem',
  88888: 'Madison',
  99999: 'Georgetown',
};

// DEPENDENCIES

const fs = require('fs');

// FUNCTIONS

function createProviders(num) {
  const providers = [];

  for (let i = 0; i < num; i ++) {
    const provider = {};
    const npi = 1000 + i;
    const phoneNumber = getPhoneNumber();
    // name
    const firstName = randomElement(FIRST_NAMES);
    const lastName = randomElement(LAST_NAMES);
    // organization
    const providerType = randomElement(PROVIDER_TYPES);
    const orgType = randomElement(ORG_TYPES);
    const orgSuffix = randomElement(ORG_SUFFIXES);
    // address
    const addressNumber = getRandomNumberUpTo(MAX_ADDRESS_NUMBER);
    const streetName = randomElement(STREET_NAMES);
    const streetType = randomElement(STREET_SUFFIXES);
    const address = `${addressNumber} ${streetName} ${streetType}`;
    // locale
    const zipCode = randomElement(ZIP_CODES);
    const cityName = ZIP_CODES_TO_CITY_NAMES[zipCode];

    // mutually exclusive elements
    if (providerType === 'person') {
      provider.first_name = firstName;
      provider.last_name = lastName;
    } else {
      let orgName;

      if (orgType === 'saint') {
        orgName = `St. ${firstName}'s ${orgSuffix}`;
      } else {
        orgName = `${cityName} ${orgSuffix}`;
      }

      provider.organization_name = orgName;
    }

    // build it
    provider.address = address;
    provider.city = cityName;
    provider.zip = zipCode;
    provider.phone = phoneNumber;
    provider.npi = npi;

    providers.push(provider);
  }

  return providers;
}

function randomElement(array) {
  const index = getRandomNumberUpTo(array.length);
  const element = array[index];

  return element;
}

function getRandomNumberUpTo(max) {
  const random = Math.floor(Math.random() * max);

  return random;
}

function saveJson(providers) {
  const jsonString = JSON.stringify(providers);

  fs.writeFile(PROVIDER_OUTPUT_PATH, jsonString, function (err) {
    if (err) {
      console.log(err);
    } else {
      console.log('Saved provider json:\n');
      console.log(jsonString);
    }
  });
}

function getPhoneNumber() {
  let phoneNumberStr = '';

  for (let i = 0; i < PHONE_NUMBER_LENGTH; i++) {
    const digit = getRandomNumberUpTo(9);

    phoneNumberStr += digit.toString();
  }

  return phoneNumberStr;
}

// MAIN

(function main() {
  const providers = createProviders(PROVIDER_COUNT);

  saveJson(providers);
}());
