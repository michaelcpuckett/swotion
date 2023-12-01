window.history.scrollRestoration = 'manual';

window.addEventListener('pageshow', (event) => {
  if (event.persisted) {
    window.location.reload(true);
  }
});

new BroadcastChannel('sw-messages').onmessage = (event) => {
  if (event.data === 'unregister') {
    navigator.serviceWorker.getRegistrations().then((registrations) => {
      for (const registration of registrations) {
        registration.unregister();
      }
    });

    window.location.reload();
  }
};

(() => {
  const currentUrl = new URL(window.location.href);

  if (currentUrl.searchParams.get('autofocus')) {
    const nextUrl = new URL(window.location.href);
    nextUrl.searchParams.delete('autofocus');
    window.history.replaceState({}, '', nextUrl.href);
  }

  const SCROLL_STORAGE_KEY = 'scroll-position-y';

  const scrollValue = sessionStorage.getItem(SCROLL_STORAGE_KEY) || 0;
  const cssSafeHeightValue = `calc(${scrollValue}px + 101vh)`;
  window.document.documentElement.style.minHeight = cssSafeHeightValue;

  const scrollbarWidth =
    window.innerWidth - document.documentElement.clientWidth;
  window.document.documentElement.style.setProperty(
    '--scrollbar-width',
    `${scrollbarWidth}px`,
  );

  window.scrollTo(0, Number(scrollValue));
  sessionStorage.removeItem(SCROLL_STORAGE_KEY);

  const handleScroll = () => {
    window.sessionStorage.setItem(SCROLL_STORAGE_KEY, `${window.scrollY}`);
  };

  window.addEventListener('scroll', handleScroll);
})();

window.addEventListener('DOMContentLoaded', () => {
  const FOCUSED_ELEMENT_ID_STORAGE_KEY = 'focus-element-id';
  const SCROLL_STORAGE_KEY = 'scroll-position-y';

  const scrollValue = sessionStorage.getItem(SCROLL_STORAGE_KEY) || 0;

  window.document.documentElement.style.minHeight = null;

  const autofocusElement = window.document.querySelector(
    '[data-auto-focus="true"]',
  );
  const focusedElementId =
    sessionStorage.getItem(FOCUSED_ELEMENT_ID_STORAGE_KEY) || '';
  const focusElement = window.document.getElementById(focusedElementId);
  const elementToAutoFocus = autofocusElement || focusElement;

  if (elementToAutoFocus instanceof HTMLElement) {
    window.scrollTo(0, Number(scrollValue));

    elementToAutoFocus.focus();

    if (
      elementToAutoFocus instanceof HTMLInputElement &&
      elementToAutoFocus.value.length > 0 &&
      (elementToAutoFocus.type === 'text' ||
        elementToAutoFocus.type === 'search')
    ) {
      elementToAutoFocus.selectionStart = elementToAutoFocus.selectionEnd =
        elementToAutoFocus.value.length;
    }
  }

  const handleFocus = () => {
    const focusedElement = window.document.activeElement;
    const focusedElementId = focusedElement?.id ?? '';
    sessionStorage.setItem(FOCUSED_ELEMENT_ID_STORAGE_KEY, focusedElementId);
  };

  window.document.body.addEventListener('focusin', handleFocus);
});
