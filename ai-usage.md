# AI Usage Report

## AI tools used
- **Claude Code** (Anthropic, Claude Opus 5.5 model), used through the VS Code extension.

## Tasks where AI helped
AI was used heavily on this project. Claude Code:
- Read the assignment PDF and my CV (PDF) and planned the sections from them.
- Fetched my public GitHub repository list and project READMEs to choose real projects and write accurate descriptions.
- Downloaded my GitHub profile picture to use as the profile photo.
- Wrote the first versions of `index.html`, `css/style.css` and `js/script.js`.
- Wrote an automated browser test script (Puppeteer + Microsoft Edge) to check the required user flow and to take the README screenshots.
- Drafted `README.md` and this report.

## Representative prompts
> "[assignment PDF] [my CV PDF] lemme know if you need any info from my side. my github username is rudri1202, linkedin: ... dont include past experiences just say past internship experience. ... keep good visuals but keep it simple so that i can explain easily."

## Code accepted, modified or rejected
- **Accepted:** the overall page structure, the CSS design tokens (custom properties for light and dark themes), the Grid/Flexbox layouts, the theme toggle, the greeting, the welcome message, the mobile menu and the form validation logic.
- **Modified (my instructions):** the About section was changed so it does not list individual past companies. It only mentions "past internship experience", as I asked. My phone number and the client name from my current job were left out on purpose.
- **Modified / rejected (by the AI during development):** an inline `<script>` in `<head>` that applied the saved theme before the page painted was removed. The assignment requires HTML, CSS and JS in separate files, so all JavaScript now lives in `js/script.js`. The trade-off is a very brief theme flash on reload in dark mode.

## Bugs or incorrect suggestions
- The first dark-mode screenshot looked broken (dark text on a dark background). This turned out to be the screenshot being taken during the 0.3s colour transition, not a real bug. Waiting 600ms before the screenshot confirmed that dark mode renders correctly.
- No functional bugs were found by the tests below. *(Add any issues you find while reviewing the code yourself here.)*

## How the implementation was tested and verified
An automated test in headless Microsoft Edge (Puppeteer) ran the full user flow from the assignment:

| Check | Result |
|-------|--------|
| Every `#` link points to an existing section | ✅ all 6 found |
| Clicking a nav link scrolls the section just below the sticky header | ✅ |
| Welcome button shows the welcome message | ✅ |
| Theme toggles light → dark → light, and the button label updates | ✅ |
| Greeting matches the current time (tested at 9 AM: "Good Morning") | ✅ |
| Empty submit shows all 3 errors, no success message | ✅ |
| Whitespace-only name/message is rejected | ✅ |
| Invalid email (`priya@invalid`) shows an email error only | ✅ |
| Valid input: button shows "Sending..." and is disabled during repeated clicks, then the success message appears and the form resets | ✅ |
| Horizontal overflow at 820px, 375px and 320px widths | ✅ 0px |
| Mobile menu opens, and closes after choosing a link | ✅ |
| JavaScript errors / failed resource loads | ✅ none |

`node --check js/script.js` was also run to confirm there are no syntax errors, and the screenshots in both themes and at mobile width were reviewed by eye.

*(Before submitting, I should also test manually in my own browser: keyboard Tab navigation, the theme toggle, and the form flow.)*
