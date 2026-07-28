const themeToggle = document.querySelector('.theme-toggle');
const preferredTheme = localStorage.getItem('theme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');

function getThemeColorMeta() {
  let meta = document.querySelector('meta[name="theme-color"]');
  if (!meta) {
    meta = document.createElement("meta");
    meta.setAttribute("name", "theme-color");
    document.head.appendChild(meta);
  }
  return meta;
}

function setTheme(theme) {
  document.body.classList.toggle('light-mode', theme === 'light');
  document.body.classList.toggle('dark-mode', theme === 'dark');
  document.documentElement.style.colorScheme = theme;
  localStorage.setItem('theme', theme);

  const themeColor = theme === "light" ? "#eef2ff" : "#070814";
  getThemeColorMeta().setAttribute("content", themeColor);

  if (themeToggle) {
    themeToggle.textContent = theme === 'light' ? '🌙' : '☀️';
    themeToggle.setAttribute('aria-label', theme === 'light' ? 'Modo oscuro' : 'Modo claro');
    themeToggle.setAttribute('aria-pressed', theme === 'dark' ? 'true' : 'false');
  }
}

function toggleTheme() {
  const currentTheme = document.body.classList.contains('light-mode') ? 'light' : 'dark';
  setTheme(currentTheme === 'light' ? 'dark' : 'light');
}

if (themeToggle) {
  themeToggle.addEventListener('click', toggleTheme);
}

setTheme(preferredTheme);
