const HEROUI_THEME_KEY = 'heroui-theme';

const savedTheme = localStorage.getItem(HEROUI_THEME_KEY) ?? 'system';
const prefersDark = matchMedia('(prefers-color-scheme: dark)').matches;
const theme = savedTheme === 'system' ? (prefersDark ? 'dark' : 'light') : savedTheme;

document.documentElement.classList.add(theme);
document.documentElement.dataset.theme = theme;
