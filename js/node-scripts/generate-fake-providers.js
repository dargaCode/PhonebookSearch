
// CONSTANTS

const JSON_OUTPUT_PATH = `${__dirname}/../../data/phonebook-raw.json`;
const MINIMUM_ID = 1000;
const MAX_ADDRESS_NUMBER = 5000;
const PHONE_NUMBER_LENGTH = 7;
const ENTRY_COUNT = 2000;

// duplicate values act as weights to adjust probabilities
const ENTRY_TYPES = [
  'person',
  'person',
  'person',
  'person',
  'person',
  'person',
  'person',
  'person',
  'person',
  'person',
  'person',
  'person',
  'business',
  'business',
  'business',
  'business',
  'business',
  'organization',
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

const BUSINESS_PREFIX_TYPES = [
  'firstName',
  'firstName',
  'firstName',
  'firstName',
  'lastName',
  'lastName',
  'lastName',
  'lastName',
  'streetName',
  'streetName',
  'streetName',
  'streetName',
  'cityName',
];

const BUSINESS_SUFFIXES = [
  'Restaurant',
  'Cafe',
  'Bistro',
  'Bakery',
  'Garage',
  'Motors',
  'Salon',
  'Boutique',
  'Construction',
  'Roofing',
  'Plumbing',
  'Dance Studio',
  'Gallery',
  'Day Care',
];

const ORGANIZATION_SUFFIXES = [
  'Preschool',
  'Elementary School',
  'High School',
  'College',
  'Hospital',
  'Children\'s Hospital',
  'Medical Center',
  'Theater',
  'Museum',
];

const STREET_PREFIXES = [
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

const CITY_NAMES = [
  'Oceanside',
  'Franklin',
  'Greenville',
  'Williamsport',
  'Oakland',
  'Fairview',
  'Salem',
  'Madison',
  'Georgetown',
];

const CITY_CODES = {
  'Oceanside': {
    zipCode: '11111',
    areaCode: '111',
  },
  'Franklin': {
    zipCode: '22222',
    areaCode: '222',
  },
  'Greenville': {
    zipCode: '33333',
    areaCode: '333',
  },
  'Williamsport': {
    zipCode: '44444',
    areaCode: '444',
  },
  'Oakland': {
    zipCode: '55555',
    areaCode: '555',
  },
  'Fairview': {
    zipCode: '66666',
    areaCode: '666',
  },
  'Salem': {
    zipCode: '77777',
    areaCode: '777',
  },
  'Madison': {
    zipCode: '88888',
    areaCode: '888',
  },
  'Georgetown': {
    zipCode: '99999',
    areaCode: '999',
  },
};

// DEPENDENCIES

const fs = require('fs');

// FUNCTIONS

function generatePhoneBookEntries(entryCount) {
  const phonebookEntries = [];

  for (let i = 0; i < entryCount; i ++) {
    // id
    const id = MINIMUM_ID + i;
    // address
    const addressNumber = getRandomNumberUpTo(MAX_ADDRESS_NUMBER);
    const streetPrefix = getRandomElement(STREET_PREFIXES);
    const streetSuffix = getRandomElement(STREET_SUFFIXES);
    const streetName = `${streetPrefix} ${streetSuffix}`;
    const address = `${addressNumber} ${streetName}`;
    // locale
    const cityName = getRandomElement(CITY_NAMES);
    const zipCode = CITY_CODES[cityName].zipCode;
    // phone
    const areaCode = CITY_CODES[cityName].areaCode;
    const phoneNumber = `${areaCode}${getPhoneNumber()}`;

    let name = getEntryName(streetName, cityName);

    // build it
    const entry = {
      name: name,
      address: address,
      city: cityName,
      zip: zipCode,
      phone: phoneNumber,
      id: id,
    }

    phonebookEntries.push(entry);
  }

  return phonebookEntries;
}

function getRandomElement(array) {
  const index = getRandomNumberUpTo(array.length);
  const randomElement = array[index];

  return randomElement;
}

function getRandomNumberUpTo(max) {
  const random = Math.floor(Math.random() * max);

  return random;
}

function getEntryName(streetName, cityName) {
  const entryType = getRandomElement(ENTRY_TYPES);
  const firstName = getRandomElement(FIRST_NAMES);
  const lastName = getRandomElement(LAST_NAMES);

  let name;

  if (entryType === 'person') {
    name = `${firstName} ${lastName}`;
  } else if (entryType === 'business') {
    // easier to use a dict than a switch statement to assign prefix strings.
    const prefixes = {
      firstName: firstName,
      lastName: lastName,
      streetName: streetName,
      cityName: cityName,
    };
    const businessPrefixType = getRandomElement(BUSINESS_PREFIX_TYPES);
    const businessSuffix = getRandomElement(BUSINESS_SUFFIXES);
    const businessPrefix = prefixes[businessPrefixType];

    name = `${businessPrefix} ${businessSuffix}`;
  } else if (entryType === 'organization') {
    const organizationSuffix = getRandomElement(ORGANIZATION_SUFFIXES);

    name = `${cityName} ${organizationSuffix}`;
  }

  return name;
}

function getPhoneNumber() {
  let phoneNumberStr = '';

  for (let i = 0; i < PHONE_NUMBER_LENGTH; i++) {
    const digit = getRandomNumberUpTo(9);

    phoneNumberStr += digit.toString();
  }

  return phoneNumberStr;
}

function saveJson(phonebookEntries) {
  const jsonString = JSON.stringify(phonebookEntries);

  fs.writeFile(JSON_OUTPUT_PATH, jsonString, function (err) {
    if (err) {
      console.log(err);
    } else {
      console.log('Saved raw phonebook JSON:\n');
      console.log(jsonString);
    }
  });
}

// MAIN

(function main() {
  const phonebookEntries = generatePhoneBookEntries(ENTRY_COUNT);

  saveJson(phonebookEntries);
}());
