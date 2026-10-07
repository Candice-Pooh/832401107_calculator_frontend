# Frontend Code Style

## 1. Reference Standard

The JavaScript implementation uses the
Google JavaScript Style Guide as a reference.

Reference:
https://google.github.io/styleguide/jsguide.html

Project-specific formatting conventions are
documented below.

## 2. JavaScript Naming

Variables and functions use camelCase.

Examples:

- calculateExpression
- loadHistory
- deleteHistory
- updateConnection

Constants that represent configuration values
may use UPPER_SNAKE_CASE.

Example:

- API_BASE_URL

## 3. JavaScript Formatting

The project uses:

- Four spaces for indentation
- Double quotation marks for strings
- Semicolons at the end of statements
- Braces for function blocks
- Consistent spacing around operators

The four-space indentation and double-quote
conventions are project-specific choices
rather than strict Google Style requirements.

## 4. Variable Declarations

Use const when a variable does not require
reassignment.

Use let when reassignment is necessary.

Avoid var.

## 5. Function Design

Each function should perform a clearly
defined responsibility.

API communication, DOM manipulation,
calculation requests, and history rendering
are organized into separate functions.

## 6. Security

User-provided content is rendered using
textContent rather than inserted as
untrusted HTML.

The frontend does not use eval().

Mathematical expressions are evaluated
only by the backend.

## 7. HTML Style

HTML uses semantic elements where practical.

Element attributes use consistent formatting.

Buttons include appropriate types.

Interactive controls use accessibility labels
when necessary.

## 8. CSS Style

CSS class names use kebab-case.

Examples:

- calculator-card
- history-list
- result-container

Related CSS rules are grouped by component.

Responsive layouts are implemented
using media queries.

## 9. Error Handling

Network requests use async/await.

Failed requests are handled through try/catch.

User-facing error messages should be clear
and avoid exposing internal server details.