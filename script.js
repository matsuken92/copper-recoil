const menu = document.querySelector('.menu-panel');
const openButton = document.querySelector('.menu-trigger');
const closeButton = document.querySelector('.menu-close');

function setMenu(open) {
  if (open) {
    menu.showModal();
    closeButton.focus();
  } else {
    menu.close();
  }
  openButton.setAttribute('aria-expanded', String(open));
  document.body.classList.toggle('menu-open', open);
}

openButton.addEventListener('click', () => setMenu(true));
closeButton.addEventListener('click', () => setMenu(false));
document.querySelectorAll('.menu-panel__nav a').forEach((link) => {
  link.addEventListener('click', () => setMenu(false));
});

// Native dialog handles Escape, focus containment, and return to the trigger.
menu.addEventListener('close', () => {
  openButton.setAttribute('aria-expanded', 'false');
  document.body.classList.remove('menu-open');
});

// Content remains readable when JavaScript or IntersectionObserver is unavailable.
if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.remove('is-pending');
      observer.unobserve(entry.target);
    });
  }, { threshold: .08 });

  document.querySelectorAll('.reveal').forEach((element) => {
    element.classList.add('is-pending');
    observer.observe(element);
  });
}

const revealContact = document.querySelector('.contact__reveal');
const contactDetails = document.querySelector('.contact__details');
const contactEmail = document.querySelector('.contact__email');
const copyContact = document.querySelector('.contact__copy-button');
const contactStatus = document.querySelector('.contact__status');

// Obfuscation deters simple address harvesters; it cannot block bots that run JS.
// Decode only after an explicit click, never during the initial page render.
revealContact.hidden = false;
revealContact.addEventListener('click', () => {
  const address = atob('Y29wcGVyLnJlY29pbEBnbWFpbC5jb20=');
  contactEmail.textContent = address;
  contactEmail.href = `mailto:${address}`;
  contactDetails.hidden = false;
  revealContact.setAttribute('aria-expanded', 'true');
  revealContact.hidden = true;
  contactStatus.textContent = 'アドレスを選ぶとメールアプリが開きます。';
  contactEmail.focus({ preventScroll: true });
}, { once: true });

copyContact.addEventListener('click', async () => {
  try {
    await navigator.clipboard.writeText(contactEmail.textContent);
    contactStatus.textContent = 'メールアドレスをコピーしました。';
  } catch {
    contactStatus.textContent = 'コピーできませんでした。アドレスを選択してコピーしてください。';
  }
});
