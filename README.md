# OpenPDF - DOI to PDF Resolver

A lightweight web application that resolves Digital Object Identifiers (DOIs) to their full-text PDF documents using the OpenAlex API.

## Features

- Simple, clean interface for entering DOIs
- Supports both plain DOIs and DOI URLs 
- Resolves DOIs using the OpenAlex API
- Opens PDFs directly in a new tab
- Shareable links with DOI hash parameters or path
- Mobile-friendly design

## Usage

1. Enter a DOI (e.g., `10.4018/IJWLTT.20211101.oa4`) or DOI URL
2. Click "Find PDF" to search for the full-text document
3. If found, the PDF will open in a new tab
4. For non-Open Access publications, you'll be redirected to the publisher's website

The application will automatically extract the DOI and redirect to the PDF.

## How It Works

OpenPDF uses the [OpenAlex API](https://openalex.org/) to retrieve metadata about academic works by their DOI. If the work has an open access PDF available, it will be opened in a new tab. For non-Open Access publications, you'll be redirected to the publisher's website.

## License

MIT