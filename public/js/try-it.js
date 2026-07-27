document.addEventListener('DOMContentLoaded', () => {
  // 0. Theme Controller Switcher
  const themeBtns = document.querySelectorAll('.theme-btn');
  const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';

  themeBtns.forEach(btn => {
    if (btn.getAttribute('data-theme-val') === currentTheme) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }

    btn.addEventListener('click', () => {
      const selectedTheme = btn.getAttribute('data-theme-val');
      document.documentElement.setAttribute('data-theme', selectedTheme);
      localStorage.setItem('playground_theme', selectedTheme);

      themeBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    });
  });

  // 1. Live Sidebar Search Filter
  const searchInput = document.getElementById('sidebar-search');
  const endpointCards = document.querySelectorAll('.endpoint-card');
  const navItems = document.querySelectorAll('.nav-item');

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      const query = e.target.value.toLowerCase().trim();

      // Filter endpoint cards
      endpointCards.forEach(card => {
        const text = card.getAttribute('data-endpoint-text') || card.textContent;
        if (text.toLowerCase().includes(query)) {
          card.style.display = 'block';
        } else {
          card.style.display = 'none';
        }
      });

      // Filter nav items
      navItems.forEach(item => {
        const text = item.textContent.toLowerCase();
        if (text.includes(query) || query === '') {
          item.style.display = 'flex';
        } else {
          item.style.display = 'none';
        }
      });
    });
  }

  // 2. Copy Endpoint URL Button
  const copyUrlBtns = document.querySelectorAll('.copy-url-btn');
  copyUrlBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const url = btn.getAttribute('data-url');
      if (url) {
        navigator.clipboard.writeText(url).then(() => {
          const originalText = btn.innerHTML;
          btn.innerHTML = '<span>✅ Copied URL!</span>';
          setTimeout(() => {
            btn.innerHTML = originalText;
          }, 2000);
        }).catch(err => console.error('Copy URL error:', err));
      }
    });
  });

  // 3. Interactive Code Snippet Tabs & Copy Button
  const snippetContainers = document.querySelectorAll('.snippet-container');

  snippetContainers.forEach(container => {
    const tabBtns = container.querySelectorAll('.snippet-tab-btn');
    const codeBlocks = container.querySelectorAll('.snippet-code-block');
    const copyBtn = container.querySelector('.copy-btn');

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
          }).catch(err => console.error('Copy error:', err));
        }
      });
    }
  });

  // 4. Interactive Try It Request Tester with HTTP Status Badges
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
        resultBlock.textContent = '❌ Error: Please provide values for all path parameters.';
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
            resultBlock.textContent = `❌ JSON Parse Error: Invalid request body JSON.\n${err.message}`;
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
        const statusPillClass = response.ok ? 'status-2xx' : 'status-4xx';
        const statusHeader = `HTTP ${response.status} ${response.statusText}`;

        if (response.status === 204) {
          resultBlock.textContent = '';
          const badge = document.createElement('span');
          badge.className = `status-badge-pill ${statusPillClass}`;
          badge.textContent = statusHeader;
          resultBlock.appendChild(badge);
          resultBlock.appendChild(document.createTextNode('\n\n204 No Content (Record updated/deleted in session overlay)'));
          return;
        }

        let data;
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          data = await response.json();
        } else {
          data = await response.text();
        }
        // Build output safely using DOM methods (no innerHTML with untrusted content)
        resultBlock.textContent = '';
        const badge = document.createElement('span');
        badge.className = `status-badge-pill ${statusPillClass}`;
        badge.textContent = statusHeader;
        resultBlock.appendChild(badge);
        const body = typeof data === 'object'
          ? JSON.stringify(data, null, 2)
          : String(data);
        resultBlock.appendChild(document.createTextNode('\n\n' + body));
      } catch (err) {
        resultBlock.textContent = `❌ Network Error: ${err.message}`;
      }
    });
  });
});
