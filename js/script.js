/* =========================================================
   Personal Portfolio - interactions
   Loaded with "defer", so the DOM is ready when this runs.
   ========================================================= */

/* ---------- Theme toggle ---------- */
const THEME_STORAGE_KEY = "theme";
const rootElement = document.documentElement;
const themeToggleButton = document.querySelector(".theme-toggle");
const themeToggleIcon = document.querySelector(".theme-toggle-icon");
const themeToggleLabel = document.querySelector(".theme-toggle-label");

function applyTheme(theme) {
    const isDark = theme === "dark";
    rootElement.setAttribute("data-theme", theme);

    // The button shows the theme you will switch TO
    themeToggleIcon.textContent = isDark ? "☀️" : "🌙";
    themeToggleLabel.textContent = isDark ? "Light mode" : "Dark mode";
    themeToggleButton.setAttribute("aria-pressed", String(isDark));
    themeToggleButton.setAttribute("aria-label", isDark ? "Switch to light mode" : "Switch to dark mode");
}

function getInitialTheme() {
    // localStorage can throw in private browsing, so guard it
    try {
        const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);
        if (savedTheme === "light" || savedTheme === "dark") {
            return savedTheme;
        }
    } catch (error) {
        // Ignore and fall back to the system preference
    }
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function toggleTheme() {
    const nextTheme = rootElement.getAttribute("data-theme") === "dark" ? "light" : "dark";
    applyTheme(nextTheme);
    try {
        localStorage.setItem(THEME_STORAGE_KEY, nextTheme);
    } catch (error) {
        // Theme still switches; it just won't be remembered
    }
}

applyTheme(getInitialTheme());
themeToggleButton.addEventListener("click", toggleTheme);

/* ---------- Dynamic greeting ---------- */
function getGreeting(hour) {
    if (hour < 12) {
        return "Good Morning";
    }
    if (hour < 17) {
        return "Good Afternoon";
    }
    return "Good Evening";
}

const greetingElement = document.getElementById("greeting");
greetingElement.textContent = `${getGreeting(new Date().getHours())}! 👋`;

/* ---------- Welcome interaction ---------- */
const welcomeButton = document.getElementById("welcome-button");
const welcomeMessage = document.getElementById("welcome-message");

welcomeButton.addEventListener("click", () => {
    welcomeMessage.textContent =
        "Thanks for stopping by! Feel free to explore my skills and projects, " +
        "and drop me a message in the contact section.";
    welcomeMessage.hidden = false;
});

/* ---------- Navigation ---------- */
const menuToggleButton = document.querySelector(".menu-toggle");
const menuToggleText = menuToggleButton.querySelector(".visually-hidden");
const navLinksList = document.getElementById("nav-links");
const navLinks = document.querySelectorAll(".nav-link");

function setMenuOpen(isOpen) {
    navLinksList.classList.toggle("open", isOpen);
    menuToggleButton.setAttribute("aria-expanded", String(isOpen));
    menuToggleText.textContent = isOpen ? "Close menu" : "Open menu";
}

menuToggleButton.addEventListener("click", () => {
    const isOpen = menuToggleButton.getAttribute("aria-expanded") === "true";
    setMenuOpen(!isOpen);
});

// Close the mobile menu after a link is chosen
navLinks.forEach((link) => {
    link.addEventListener("click", () => setMenuOpen(false));
});

// Close the mobile menu with the Escape key
document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && navLinksList.classList.contains("open")) {
        setMenuOpen(false);
        menuToggleButton.focus();
    }
});

// Highlight the nav link for the section currently on screen
function setActiveLink(sectionId) {
    navLinks.forEach((link) => {
        const isActive = link.getAttribute("href") === `#${sectionId}`;
        link.classList.toggle("active", isActive);
        if (isActive) {
            link.setAttribute("aria-current", "true");
        } else {
            link.removeAttribute("aria-current");
        }
    });
}

const sectionObserver = new IntersectionObserver(
    (entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                setActiveLink(entry.target.id);
            }
        });
    },
    // A thin band in the upper-middle of the viewport decides which section is "current"
    { rootMargin: "-40% 0px -55% 0px" }
);

document.querySelectorAll("main section[id]").forEach((section) => sectionObserver.observe(section));

/* ---------- Footer year ---------- */
document.getElementById("current-year").textContent = new Date().getFullYear();
