
function ResultsModal() {

  // CONSTANTS

  const HIDE_CLASS = 'hidden';
  const LOCK_SCROLL_CLASS = 'prevent-body-scroll';
  const PROVIDER_DATA_CLASS = 'data-card';
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
  const closeModalButton  = document.querySelector('#close-modal-button');

  // EVENT BINDINGS

  searchOverlayDiv.addEventListener('click', hideModal);
  closeModalButton.addEventListener('click', hideModal);

  // EVENT HANDLERS

  function showModal() {
    providerInfoModal.classList.remove(HIDE_CLASS);
    searchOverlayDiv .classList.remove(HIDE_CLASS);

    preventBodyScrolling();
  }

  function hideModal() {
    providerInfoModal.classList.add(HIDE_CLASS);
    searchOverlayDiv .classList.add(HIDE_CLASS);

    enableBodyScrolling();
  }

  // FUNCTIONS

  function preventBodyScrolling() {
    body          .classList.add(LOCK_SCROLL_CLASS);
    bodyWrapperDiv.classList.add(LOCK_SCROLL_CLASS);
  }

  function enableBodyScrolling() {
    body          .classList.remove(LOCK_SCROLL_CLASS);
    bodyWrapperDiv.classList.remove(LOCK_SCROLL_CLASS);
  }

  this.displayProviders = function(displayName, providers) {
    const tempDiv = document.createElement('div');

    for (const provider of providers) {
      const providerDataCard = getProviderDataCard(provider);

      providerDataCard.classList.add(PROVIDER_DATA_CLASS);

      tempDiv.appendChild(providerDataCard);
    }

    dataHolderDiv.innerHTML = tempDiv.innerHTML;
    providerNameH2.textContent = displayName;

    showModal();
  };

  function getProviderDataCard(provider) {
    const div = document.createElement('div');

    // only some key/value pairs from the provider object are displayed
    for (let key of VISIBLE_DATA_KEYS) {
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
