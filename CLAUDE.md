# OpenPDF Development Guidelines

## Development Setup
- This is a static HTML/JS project with no build system
- Run locally: Open index.html in a browser or use a local server: `python -m http.server` or `npx serve`
- Testing: Manual browser testing is required; no automated tests exist

## Code Style Guidelines
- HTML: Use semantic tags, double quotes for attributes
- CSS: Use kebab-case for class names, organize by component
- JavaScript:
  - Use camelCase for variables and functions
  - Use const/let, avoid var
  - Prefer async/await over raw promises
  - Include error handling in all async functions
  - Follow defensive coding practices with null checks

## Organization
- Keep functions small and focused on a single task
- Group related functions together in the codebase
- Use descriptive variable and function names
- Always validate user input (as done with DOI regex)
- Handle API errors with user-friendly messages

## Error Handling
- Always include try/catch blocks around async operations
- Provide specific, user-friendly error messages
- Log errors to console for debugging