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

/* ---------- Contact form validation ---------- */
const contactForm = document.getElementById("contact-form");
const submitButton = document.getElementById("submit-button");
const formStatus = document.getElementById("form-status");

// Simple check: something@something.domain, with no spaces
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

// Each field has a validator that returns an error message, or "" if valid.
// Values are trimmed first, so whitespace-only input counts as empty.
const formFields = [
    {
        input: document.getElementById("full-name"),
        validate(value) {
            if (value === "") return "Please enter your full name.";
            if (value.length < 2) return "Name must be at least 2 characters long.";
            return "";
        },
    },
    {
        input: document.getElementById("email"),
        validate(value) {
            if (value === "") return "Please enter your email address.";
            if (!EMAIL_PATTERN.test(value)) return "Please enter a valid email address, e.g. name@example.com.";
            return "";
        },
    },
    {
        input: document.getElementById("message"),
        validate(value) {
            if (value === "") return "Please enter a message.";
            if (value.length < 10) return "Message must be at least 10 characters long.";
            return "";
        },
    },
];

function showFieldError(input, message) {
    const errorElement = document.getElementById(`${input.id}-error`);
    // The warning icon means the error is not shown by color alone
    errorElement.textContent = message ? `⚠ ${message}` : "";
    input.setAttribute("aria-invalid", String(Boolean(message)));
}

function validateField(field) {
    const errorMessage = field.validate(field.input.value.trim());
    showFieldError(field.input, errorMessage);
    return errorMessage === "";
}

// After a field has been marked invalid, re-check it while the user types
// so the error disappears as soon as it is fixed
formFields.forEach((field) => {
    field.input.addEventListener("input", () => {
        if (field.input.getAttribute("aria-invalid") === "true") {
            validateField(field);
        }
        formStatus.hidden = true;
    });
});

contactForm.addEventListener("submit", (event) => {
    event.preventDefault(); // No backend: handle everything on the page

    // Ignore repeated clicks while a submission is already in progress
    if (submitButton.disabled) {
        return;
    }

    formStatus.hidden = true;

    // Validate every field (not just the first) so all errors show at once
    const results = formFields.map(validateField);
    const firstInvalidIndex = results.indexOf(false);

    if (firstInvalidIndex !== -1) {
        formFields[firstInvalidIndex].input.focus();
        return;
    }

    const visitorName = formFields[0].input.value.trim();

    // Simulate sending, and lock the button so it can't be clicked twice
    submitButton.disabled = true;
    submitButton.textContent = "Sending...";

    setTimeout(() => {
        formStatus.textContent = `✔ Thank you, ${visitorName}! Your message has been sent successfully. I'll get back to you soon.`;
        formStatus.hidden = false;
        contactForm.reset();
        formFields.forEach((field) => showFieldError(field.input, ""));
        submitButton.disabled = false;
        submitButton.textContent = "Send Message";
    }, 1000);
});

/* ---------- Footer year ---------- */
document.getElementById("current-year").textContent = new Date().getFullYear();
