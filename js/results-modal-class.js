
function ResultsModal() {

  // CONSTANTS

  const HIDE_CLASS = 'hidden';
  const LOCK_SCROLL_CLASS = 'prevent-body-scroll';
  const RESULT_CARD_CLASS = 'result-data-card';
  const VISIBLE_DATA_KEYS = [
    'address',
    'city',
    'phone',
  ];

  // DOM HOOKS

  const resultInfoModal = document.querySelector('#result-info-modal');
  const resultNameH2    = document.querySelector('#result-name-h2');
  const dataHolderDiv     = document.querySelector('#result-data-holder');
  const searchOverlayDiv  = document.querySelector('#search-overlay-div');
  const body              = document.querySelector('body');
  const bodyWrapperDiv    = document.querySelector('#body-wrapper-div');
  const closeModalButton  = document.querySelector('#close-modal-button');

  // EVENT BINDINGS

  searchOverlayDiv.addEventListener('click', hideModal);
  closeModalButton.addEventListener('click', hideModal);

  // EVENT HANDLERS

  function showModal() {
    resultInfoModal.classList.remove(HIDE_CLASS);
    searchOverlayDiv .classList.remove(HIDE_CLASS);

    preventBodyScrolling();
  }

  function hideModal() {
    resultInfoModal.classList.add(HIDE_CLASS);
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

  this.displayResults = function(displayName, results) {
    const tempDiv = document.createElement('div');

    for (const result of results) {
      const resultDataCard = getResultDataCard(result);

      resultDataCard.classList.add(RESULT_CARD_CLASS);

      tempDiv.appendChild(resultDataCard);
    }

    dataHolderDiv.innerHTML = tempDiv.innerHTML;
    resultNameH2.textContent = displayName;

    showModal();
  };

  function getResultDataCard(result) {
    const div = document.createElement('div');

    // only some key/value pairs from the result object are displayed
    for (let key of VISIBLE_DATA_KEYS) {
      let value = result[key];

      // a couple of values need special formatting
      if (key === 'city') {
        value = `${result.city} (${result.zip})`;
      } else if (key === 'phone') {
        value = formatPhoneNumber(result.phone);
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
