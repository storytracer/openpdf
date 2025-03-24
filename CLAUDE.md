# OpenPDF Development Guidelines

## Project Setup and Commands
- **Run locally:** Simply open index.html in a browser or use a local server
- **Testing:** No automated tests yet; manual testing via browser
- **Linting:** No linters configured; follow existing code style

## Code Style Guidelines
- **Formatting:** Use 2-space indentation for all files (HTML, CSS, JS)
- **Naming:** camelCase for JS variables/functions, kebab-case for CSS classes
- **JS Organization:** Group related functionality in namespaced objects (utils, ui, api, handlers)
- **Error Handling:** Use try/catch blocks with informative error messages
- **Security:** Always sanitize user input and validate URLs before use
- **CSS Variables:** Use CSS custom properties for consistent theming
- **DOM Manipulation:** Use utility functions to ensure XSS protection

## Best Practices
- Validate and sanitize all user inputs
- Properly handle API errors with meaningful messages
- Follow content security policy rules in index.html
- Use JavaScript modules pattern for code organization
- Maintain responsive design for mobile compatibility
- Implement proper error states and loading indicators