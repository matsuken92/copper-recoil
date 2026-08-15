const menu = document.querySelector('.menu-panel');
const openButton = document.querySelector('.menu-trigger');
const closeButton = document.querySelector('.menu-close');

function setMenu(open) {
  menu.classList.toggle('is-open', open);
  menu.setAttribute('aria-hidden', String(!open));
  openButton.setAttribute('aria-expanded', String(open));
  document.body.classList.toggle('menu-open', open);
  openButton.querySelector('.sr-only').textContent = open ? 'メニューを閉じる' : 'メニューを開く';
  if (open) window.setTimeout(() => closeButton.focus(), 300);
}

openButton.addEventListener('click', () => setMenu(!menu.classList.contains('is-open')));
closeButton.addEventListener('click', () => setMenu(false));
document.querySelectorAll('.menu-panel__nav a').forEach((link) => link.addEventListener('click', () => setMenu(false)));
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && menu.classList.contains('is-open')) setMenu(false);
});

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add('is-visible');
    observer.unobserve(entry.target);
  });
}, { threshold: .12 });

document.querySelectorAll('.reveal').forEach((element) => observer.observe(element));

document.querySelectorAll('.tracks button').forEach((track) => {
  track.addEventListener('click', () => {
    const active = track.classList.contains('is-playing');
    document.querySelectorAll('.tracks button').forEach((item) => {
      item.classList.remove('is-playing');
      item.querySelector('b').textContent = '▶';
    });
    if (!active) {
      track.classList.add('is-playing');
      track.querySelector('b').textContent = 'Ⅱ';
    }
  });
});
