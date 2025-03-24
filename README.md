# OpenPDF - DOI to PDF Resolver

A lightweight web application that resolves Digital Object Identifiers (DOIs) to their full-text PDF documents using the OpenAlex API.

## Features

- Simple, clean interface for entering DOIs
- Supports both plain DOIs and DOI URLs 
- Resolves DOIs using the OpenAlex API
- Displays PDFs directly in the browser
- Shareable links with DOI hash parameters
- Mobile-friendly design

## Usage

1. Enter a DOI (e.g., `10.4018/IJWLTT.20211101.oa4`) or DOI URL
2. Click "Find PDF" to search for the full-text document
3. If found, the PDF will display in the embedded viewer
4. Use the controls to return home or open in a new tab

## How It Works

OpenPDF uses the [OpenAlex API](https://openalex.org/) to retrieve metadata about academic works by their DOI. If the work has an open access PDF available, it will be displayed directly in the browser using [PDFObject](https://pdfobject.com/).

## Development

This is a static HTML/JavaScript application with no build steps required.

To run locally:
```
# Using Python's built-in HTTP server
python -m http.server

# Or with Node.js
npx serve
```

## License

MIT