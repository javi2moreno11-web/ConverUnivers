const themeToggle = document.querySelector('.theme-toggle');
const navToggle = document.querySelector('.nav-toggle-input');
const mainNav = document.querySelector('.main-nav');
const preferredTheme = localStorage.getItem('theme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');

function setTheme(theme) {
  document.body.classList.toggle('light-mode', theme === 'light');
  document.body.classList.toggle('dark-mode', theme === 'dark');
  localStorage.setItem('theme', theme);

  if (themeToggle) {
    themeToggle.textContent = theme === 'light' ? '🌙' : '☀️';
    themeToggle.setAttribute('aria-label', theme === 'light' ? 'Modo oscuro' : 'Modo claro');
  }
}

function toggleTheme() {
  const currentTheme = document.body.classList.contains('light-mode') ? 'light' : 'dark';
  setTheme(currentTheme === 'light' ? 'dark' : 'light');
}

function syncNavigationState() {
  if (!navToggle) return;
  const isMobile = window.matchMedia('(max-width: 720px)').matches;
  navToggle.setAttribute('aria-expanded', navToggle.checked ? 'true' : 'false');

  if (!isMobile && navToggle.checked) {
     navToggle.checked = false;
     navToggle.setAttribute('aria-expanded', 'false');
  }
}

if (themeToggle) {
  themeToggle.addEventListener('click', toggleTheme);
}

if (navToggle) {
  navToggle.addEventListener('change', syncNavigationState);

  if (mainNav) {
     mainNav.querySelectorAll('a').forEach((link) => {
        link.addEventListener('click', () => {
           if (navToggle.checked) {
              navToggle.checked = false;
              syncNavigationState();
           }
        });
     });
  }

  window.addEventListener('resize', syncNavigationState);
}

setTheme(preferredTheme);
syncNavigationState();

const currentPage = window.location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.main-nav a').forEach((link) => {
  if (link.getAttribute('href') === currentPage) {
   link.setAttribute('aria-current', 'page');
  }
});
