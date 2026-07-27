document.addEventListener('DOMContentLoaded', () => {
  // 1. Interactive Code Snippet Tabs & Copy Button
  const snippetContainers = document.querySelectorAll('.snippet-container');

  snippetContainers.forEach(container => {
    const tabBtns = container.querySelectorAll('.snippet-tab-btn');
    const codeBlocks = container.querySelectorAll('.snippet-code-block');
    const copyBtn = container.querySelector('.copy-btn');

    // Tab switcher
    tabBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const target = btn.getAttribute('data-target');

        tabBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        codeBlocks.forEach(block => {
          if (block.getAttribute('data-snippet') === target) {
            block.hidden = false;
          } else {
            block.hidden = true;
          }
        });
      });
    });

    // Copy to clipboard
    if (copyBtn) {
      copyBtn.addEventListener('click', () => {
        const visibleBlock = Array.from(codeBlocks).find(b => !b.hidden);
        if (visibleBlock) {
          const codeText = visibleBlock.textContent;
          navigator.clipboard.writeText(codeText).then(() => {
            const originalText = copyBtn.innerHTML;
            copyBtn.innerHTML = '<span>✅ Copied!</span>';
            setTimeout(() => {
              copyBtn.innerHTML = originalText;
            }, 2000);
          }).catch(err => {
            console.error('Copy error:', err);
          });
        }
      });
    }
  });

  // 2. Interactive Try It Request Tester
  const forms = document.querySelectorAll('.try-it__form');

  forms.forEach(form => {
    form.addEventListener('submit', async (event) => {
      event.preventDefault();

      const method = form.getAttribute('data-method').toUpperCase();
      let pathTemplate = form.getAttribute('data-path');
      const resultBlock = form.parentElement.querySelector('.try-it__result');

      if (!resultBlock) return;

      resultBlock.hidden = false;
      resultBlock.textContent = '⏳ Executing request...';

      const pathInputs = form.querySelectorAll('input[data-param-in="path"]');
      const queryInputs = form.querySelectorAll('input[data-param-in="query"]');
      const bodyInput = form.querySelector('.body-input');

      // Substitute path variables
      let targetPath = pathTemplate;
      let missingPathParam = false;

      pathInputs.forEach(input => {
        const paramName = input.getAttribute('data-param-name');
        const value = input.value.trim();
        if (!value) {
          missingPathParam = true;
        }
        targetPath = targetPath.replace(`:${paramName}`, encodeURIComponent(value));
      });

      if (missingPathParam && pathTemplate.includes(':')) {
        resultBlock.textContent = 'Error: Please provide values for all path parameters.';
        return;
      }

      // Build query string
      const queryParams = new URLSearchParams();
      queryInputs.forEach(input => {
        const paramName = input.getAttribute('data-param-name');
        const value = input.value.trim();
        if (value) {
          queryParams.append(paramName, value);
        }
      });

      const queryString = queryParams.toString();
      const fullUrl = queryString ? `${targetPath}?${queryString}` : targetPath;

      // Handle body JSON
      let requestBody = null;
      if (bodyInput && ['POST', 'PUT', 'PATCH'].includes(method)) {
        const bodyText = bodyInput.value.trim();
        if (bodyText) {
          try {
            requestBody = JSON.parse(bodyText);
          } catch (err) {
            resultBlock.textContent = `JSON Parse Error: Invalid request body JSON.\n${err.message}`;
            return;
          }
        }
      }

      // Execute request
      try {
        const options = {
          method,
          headers: {
            'Content-Type': 'application/json'
          },
          credentials: 'include' // Crucial: send pg_identity cookie
        };

        if (requestBody && ['POST', 'PUT', 'PATCH'].includes(method)) {
          options.body = JSON.stringify(requestBody);
        }

        const response = await fetch(fullUrl, options);
        const statusText = `HTTP Status: ${response.status} ${response.statusText}`;

        if (response.status === 204) {
          resultBlock.textContent = `${statusText}\n\n204 No Content`;
          return;
        }

        let data;
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          data = await response.json();
          resultBlock.textContent = `${statusText}\n\n${JSON.stringify(data, null, 2)}`;
        } else {
          const text = await response.text();
          resultBlock.textContent = `${statusText}\n\n${text}`;
        }
      } catch (err) {
        resultBlock.textContent = `Network Error: ${err.message}`;
      }
    });
  });
});
