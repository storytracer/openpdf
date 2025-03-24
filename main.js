
    // Constants
    const DOI_REGEX = /\b(10\.[0-9]{3,}(?:\.[0-9]+)*\/(?:(?![\"&\'])\S)+)\b/gi;
    const API_BASE_URL = 'https://api.openalex.org/works/https://doi.org/';
    
    // DOM elements
    const elements = {
      doiForm: document.getElementById('doi-form'),
      doiInput: document.getElementById('doi-input'),
      alertContainer: document.getElementById('alert-container'),
      metadataContainer: document.getElementById('metadata-container'),
      metadataContent: document.getElementById('metadata-content')
    };

    // Utility functions
    const utils = {
      // Safely sanitize a string to prevent XSS attacks
      sanitizeString(str) {
        return str.replace(/[<>"'&]/g, '');
      },
      
      // Format a date string
      formatDate(dateString) {
        if (!dateString) return 'Unknown';
        try {
          const date = new Date(dateString);
          return date.toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          });
        } catch (e) {
          return dateString;
        }
      },
      
      // Extract DOI from input string
      extractDoi(input) {
        const match = input.match(DOI_REGEX);
        return match ? match[0] : null;
      },
      
      // Safely create HTML element with text content
      createElement(tag, className, textContent) {
        const element = document.createElement(tag);
        if (className) element.className = className;
        if (textContent) element.textContent = textContent;
        return element;
      }
    };

    // UI Functions
    const ui = {
      // Show alert message
      showAlert(message, type = 'error') {
        const alertDiv = utils.createElement('div', `alert alert-${type.replace(/[^\w-]/g, '')}`);
        alertDiv.appendChild(document.createTextNode(message));
        
        elements.alertContainer.innerHTML = '';
        elements.alertContainer.appendChild(alertDiv);
      },
      
      // Create a metadata row
      createMetadataRow(label, value) {
        const row = utils.createElement('div', 'metadata-row');
        const labelDiv = utils.createElement('div', 'metadata-label', label);
        const valueDiv = utils.createElement('div', 'metadata-value');
        
        // If value contains HTML (for links), set it safely
        if (typeof value === 'string' && (value.includes('<a ') || value.includes('<span '))) {
          valueDiv.innerHTML = value;
        } else {
          valueDiv.textContent = value;
        }
        
        row.appendChild(labelDiv);
        row.appendChild(valueDiv);
        return row;
      },
      
      // Get OA status badge
      getOaBadge(oaStatus) {
        const badge = utils.createElement('span', 'oa-badge');
        
        if (!oaStatus) {
          badge.classList.add('oa-closed');
          badge.textContent = 'Closed';
          return badge.outerHTML;
        }
        
        // Validate and sanitize oaStatus
        const validStatuses = ['gold', 'green', 'bronze'];
        const sanitizedStatus = validStatuses.includes(oaStatus) ? oaStatus : 'closed';
        
        badge.classList.add(`oa-${sanitizedStatus}`);
        badge.textContent = sanitizedStatus.charAt(0).toUpperCase() + sanitizedStatus.slice(1);
        
        return badge.outerHTML;
      },
      
      // Display publication metadata
      displayMetadata(work, pdfUrl, landingPageUrl) {
        // Clear previous content and show container
        elements.metadataContent.innerHTML = '';
        elements.metadataContainer.style.display = 'block';
        
        // PDF Access row
        if (pdfUrl) {
          const sanitizedPdfUrl = encodeURI(pdfUrl);
          const pdfLink = `
            <a href="${sanitizedPdfUrl}" target="_blank" rel="noopener noreferrer" class="access-button oa-button">
              Open PDF
            </a>
          `;
          elements.metadataContent.appendChild(this.createMetadataRow('PDF Link', pdfLink));
        } else {
          elements.metadataContent.appendChild(this.createMetadataRow('PDF Link', `
            <span class="no-access">No PDF found</span>
          `));
        }
        
        // Landing page link
        if (landingPageUrl) {
          const sanitizedLandingPageUrl = encodeURI(landingPageUrl);
          const landingPageLink = `
            <a href="${sanitizedLandingPageUrl}" target="_blank" rel="noopener noreferrer" class="access-button landing-page-button">
              Landing Page
            </a>
          `;
          elements.metadataContent.appendChild(this.createMetadataRow('Landing Page', landingPageLink));
        }
        
        // Publication details
        elements.metadataContent.appendChild(this.createMetadataRow('Access Status', this.getOaBadge(work.open_access?.oa_status)));
        elements.metadataContent.appendChild(this.createMetadataRow('Title', work.title || 'Unknown Title'));
        
        const authors = work.authorships?.map(a => a.author?.display_name).filter(Boolean).join(', ') || 'Unknown';
        elements.metadataContent.appendChild(this.createMetadataRow('Authors', authors));
        
        elements.metadataContent.appendChild(this.createMetadataRow('Published', utils.formatDate(work.publication_date)));
        
        const venue = work.primary_location?.source?.display_name || work.host_venue?.display_name || 'Unknown';
        elements.metadataContent.appendChild(this.createMetadataRow('Journal', venue));
      }
    };

    // API Functions
    const api = {
      // Fetch work data from OpenAlex API
      async getOpenAlexWork(doi) {
        const encodedDoi = encodeURIComponent(doi);
        try {
          const response = await fetch(`${API_BASE_URL}${encodedDoi}`);
          
          if (!response.ok) {
            if (response.status === 404) {
              throw new Error(`DOI not found in OpenAlex database (${response.status})`);
            } else if (response.status === 429) {
              throw new Error(`OpenAlex API rate limit exceeded (${response.status}). Please try again later.`);
            } else if (response.status >= 500) {
              throw new Error(`OpenAlex server error (${response.status}). Please try again later.`);
            } else {
              throw new Error(`Failed to fetch from OpenAlex: ${response.status}`);
            }
          }
          
          const data = await response.json();
          
          // Check if OpenAlex found the work but it's a placeholder/error response
          if (data.id === null || data.error) {
            throw new Error(`Article metadata not available in OpenAlex: ${data.error || 'Unknown error'}`);
          }
          
          return data;
        } catch (error) {
          // Enhance network/fetch errors
          if (error.name === 'TypeError' && error.message.includes('fetch')) {
            throw new Error(`Network error when connecting to OpenAlex. Please check your internet connection.`);
          }
          throw error;
        }
      },
      
      // Find PDF URL from work data
      findPdfUrl(work) {
        // Use OpenAlex's best_oa_location pdf_url if available
        if (work.best_oa_location?.pdf_url) {
          return work.best_oa_location.pdf_url;
        }
        
        // Fallback to primary_location if best_oa_location is not available
        if (work.primary_location?.pdf_url) {
          return work.primary_location.pdf_url;
        }
        
        return null;
      },
      
      // Find landing page URL from work data
      findLandingPageUrl(work) {
        // Use OpenAlex's best_oa_location landing_page_url if available
        let landingPageUrl = work.best_oa_location?.landing_page_url;
        
        // Fallback to primary_location landing_page_url if best_oa_location is not available
        if (!landingPageUrl && work.primary_location?.landing_page_url) {
          landingPageUrl = work.primary_location.landing_page_url;
        }
        
        return landingPageUrl;
      }
    };

    // Event Handlers
    const handlers = {
      // Handle form submission
      async handleFormSubmit(event) {
        event.preventDefault();
        
        const doiInput = elements.doiInput.value.trim();
        
        // Check if input is empty
        if (!doiInput) {
          ui.showAlert('Please enter a DOI before submitting.');
          return;
        }
        
        // Validate DOI
        const extractedDoi = utils.extractDoi(doiInput);
        if (!extractedDoi) {
          ui.showAlert('The provided input does not appear to be a valid DOI. Please check and try again.');
          return;
        }
        
        try {
          // Show loading state
          ui.showAlert('Looking up DOI...', 'success');
          
          // Fetch data from OpenAlex
          const work = await api.getOpenAlexWork(extractedDoi);
          const pdfUrl = api.findPdfUrl(work);
          const landingPageUrl = api.findLandingPageUrl(work);
          
          // Show appropriate alert based on available data
          if (!pdfUrl && !landingPageUrl) {
            ui.showAlert(`No PDF or landing page link found for DOI: ${extractedDoi}. The article might not be properly indexed.`, 'error');
          } else if (!pdfUrl) {
            ui.showAlert(`No direct PDF link found.`, 'warning');
          } else {
            ui.showAlert(`PDF available for this Open Access publication.`, 'success');
          }
          
          // Display metadata with access links
          ui.displayMetadata(work, pdfUrl, landingPageUrl);
          
        } catch (error) {
          ui.showAlert(`Failed to resolve DOI: ${extractedDoi}. ${error.message || 'Unknown error'}`);
        }
      },
      
      // Process URL hash for DOI
      processHashDoi() {
        const hashDoi = window.location.hash.replace('#', '');
        if (hashDoi && hashDoi.trim()) {
          try {
            const decodedHash = decodeURIComponent(hashDoi);
            const extractedDoi = utils.extractDoi(decodedHash);
            if (extractedDoi) {
              elements.doiInput.value = utils.sanitizeString(extractedDoi);
              elements.doiForm.dispatchEvent(new Event('submit'));
            } else {
              ui.showAlert(`The DOI in the URL hash does not appear to be valid: ${utils.sanitizeString(decodedHash)}`);
            }
          } catch (e) {
            console.error('Error processing hash DOI:', e);
            ui.showAlert('Error processing the DOI from URL hash. Please enter a DOI manually.');
          }
        }
      }
    };

    // Initialize the application
    function initApp() {
      // Add event listeners
      elements.doiForm.addEventListener('submit', handlers.handleFormSubmit);
      
      // Process hash on load
      document.addEventListener('DOMContentLoaded', () => {
        handlers.processHashDoi();
      });
      
      // Also process hash when it changes
      window.addEventListener('hashchange', handlers.processHashDoi);
    }

    // Start the application
    initApp();