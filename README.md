# OpenPDF - DOI to PDF Resolver

A lightweight web application that resolves Digital Object Identifiers (DOIs) to their full-text PDF documents using the OpenAlex API.

## Features

- Simple, clean interface for entering DOIs
- Supports both plain DOIs and DOI URLs 
- Resolves DOIs using the OpenAlex API
- Provides landing page links when direct PDF is unavailable
- Shareable links with DOI hash parameters
- Mobile-friendly responsive design
- Content Security Policy enabled for enhanced security
- Robust error handling and validation
- Fallback to primary location when best OA location is unavailable

## Usage

1. Enter a DOI (e.g., `10.4018/IJWLTT.20211101.oa4`) or DOI URL
2. Click "Find PDF" to search for the full-text document
3. If found, the PDF will open in a new tab
4. If no direct PDF is available, the landing page link will be displayed
5. Publication metadata will be shown including access status, title, authors, and publication date

The application automatically extracts the DOI from the input and displays publication metadata.

### URL Parameters

Share direct links to papers by using the hash parameter:
- `index.html#10.4018/IJWLTT.20211101.oa4`

## How It Works

OpenPDF uses the [OpenAlex API](https://openalex.org/) to retrieve metadata about academic works by their DOI. It follows this process:

1. Extracts and validates the DOI from user input
2. Queries the OpenAlex API to retrieve metadata
3. First checks for PDF availability in the best_oa_location field
4. Falls back to primary_location if needed
5. Displays comprehensive metadata with color-coded badges for access status (Gold, Green, Bronze, Closed)
6. Provides direct access buttons for PDF and landing page when available

## Design

- Responsive design with CSS custom properties for consistent theming
- Clean, minimalist interface focused on usability
- Color-coded badges for different Open Access statuses
- Informative alerts for success, warnings, and errors
- Sanitized input and output to prevent XSS attacks