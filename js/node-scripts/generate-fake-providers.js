
// CONSTANTS

const PROVIDER_OUTPUT_PATH = `${__dirname}/../../data/providers-input.json`;
const PROVIDER_COUNT = 1000;


// DEPENDENCIES

const fs = require('fs');

// duplicate values adjust probabilities
const providerTypes = [
  'person',
  'person',
  'person',
  'org',
  'org',
]

// most common male and female names in the US
const firstNames = [
  'James',
  'John',
  'Robert',
  'Michael',
  'William',
  'David',
  'Richard',
  'Charles',
  'Joseph',
  'Thomas',
  'Christopher',
  'Daniel',
  'Paul',
  'Mark',
  'Donald',
  // 'George',
  // 'Kenneth',
  // 'Steven',
  // 'Edward',
  // 'Brian',
  // 'Ronald',
  // 'Anthony',
  // 'Kevin',
  // 'Jason',
  // 'Matthew',
  // 'Gary',
  // 'Timothy',
  // 'Jose',
  // 'Larry',
  // 'Jeffrey',
  'Mary',
  'Patricia',
  'Linda',
  'Barbara',
  'Elizabeth',
  'Jennifer',
  'Maria',
  'Susan',
  'Margaret',
  'Dorothy',
  'Lisa',
  'Nancy',
  'Karen',
  'Betty',
  'Helen',
  // 'Sandra',
  // 'Donna',
  // 'Carol',
  // 'Ruth',
  // 'Sharon',
  // 'Michelle',
  // 'Laura',
  // 'Sarah',
  // 'Kimberly',
  // 'Deborah',
  // 'Jessica',
  // 'Shirley',
  // 'Cynthia',
  // 'Angela',
  // 'Melissa',
]

const lastNames = [
  'Smith',
  'Johnson',
  'Williams',
  'Brown',
  'Jones',
  'Miller',
  'Davis',
  'Garcia',
  'Rodriguez',
  'Wilson',
  'Martinez',
  'Anderson',
  'Taylor',
  'Thomas',
  'Hernandez',
  'Moore',
  'Martin',
  'Jackson',
  'Thompson',
  'White',
  'Lopez',
  'Lee',
  'Gonzalez',
  'Harris',
  'Clark',
  'Lewis',
  'Robinson',
  'Walker',
  'Perez',
  'Hall',
]

const cityNames = [
  'Springfield',
  'Franklin',
  'Greenville',
  'Bristol',
  'Clinton',
  'Fairview',
  'Salem',
  'Madison',
  'Georgetown',
  'Hillsdale',
  'Oceanside',
  'Williamsport',
  'Eagleton',
  'Chesterfield',
  'Oakland',
  'Riverside',
]

const orgTypes = [
  'locale',
  'locale',
  'locale',
  'locale',
  'locale',
  'locale',
  'locale',
  'saint',
  'saint',
]

const orgSuffixes = [
  'Hospital',
  'Hospital',
  'Hospital',
  'Hospital',
  'Pediatric Hospital',
  'Medical Center',
  'General Hospital',
  'Trauma Center',
]

const zips = [
  '11111',
  '22222',
  '33333',
  '44444',
  '55555',
  // '66666',
  // '77777',
  // '88888',
  // '99999',
]

function createProviders(num) {
  const providers = [];

  for (let i = 0; i < num; i ++) {
    const provider = {};

    const providerType = randomElement(providerTypes);
    const orgType = randomElement(orgTypes);
    const orgSuffix = randomElement(orgSuffixes);

    const firstName = randomElement(firstNames);
    const lastName = randomElement(lastNames);
    const cityName = randomElement(cityNames);
    const zip = randomElement(zips);
    const npi = 1000 + i;

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

    provider.zip = zip;
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

// MAIN

const providers = createProviders(PROVIDER_COUNT);

saveJson(providers);
