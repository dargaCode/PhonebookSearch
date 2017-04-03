
function ResultsModal() {

  // CONSTANTS

  const VISIBLE_DATA_KEYS = [
    'address',
    'city',
    'phone',
  ];

  // DOM HOOKS

  const providerInfoModal = document.querySelector('#provider-info-modal');
  const providerNameH2    = document.querySelector('#provider-name-h2');
  const dataHolderDiv     = document.querySelector('#provider-data-holder');
  const searchOverlayDiv  = document.querySelector('#search-overlay-div');
  const body              = document.querySelector('body');
  const bodyWrapperDiv    = document.querySelector('#body-wrapper-div');

  // EVENT BINDINGS

  providerInfoModal.addEventListener('click', hideModal);
  searchOverlayDiv.addEventListener('click', hideModal);

  // EVENT HANDLERS

  function showModal() {
    providerInfoModal.classList.remove('hidden');
    searchOverlayDiv .classList.remove('hidden');

    preventBodyScrolling();
  };

  function hideModal() {
    providerInfoModal.classList.add('hidden');
    searchOverlayDiv .classList.add('hidden');

    enableBodyScrolling();
  }

  // FUNCTIONS

  function preventBodyScrolling() {
    body          .classList.add('prevent-body-scroll');
    bodyWrapperDiv.classList.add('prevent-body-scroll');
  }

  function enableBodyScrolling() {
    body          .classList.remove('prevent-body-scroll');
    bodyWrapperDiv.classList.remove('prevent-body-scroll');
  }

  this.displayProviders = function(displayName, providers) {
    const tempDiv = document.createElement('div');

    for (provider of providers) {
      const providerDataCard = getProviderDataCard(provider);

      providerDataCard.classList.add('data-card');

      tempDiv.appendChild(providerDataCard);
    }

    dataHolderDiv.innerHTML = tempDiv.innerHTML;
    providerNameH2.textContent = displayName;

    showModal();
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
}
