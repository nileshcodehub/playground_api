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

  // 1. Smart Tokenized Fuzzy & Synonym Search Engine
  function calcLevenshtein(a, b) {
    if (a === b) return 0;
    if (!a.length) return b.length;
    if (!b.length) return a.length;
    const matrix = Array(b.length + 1).fill(null).map(() => Array(a.length + 1).fill(null));
    for (let i = 0; i <= a.length; i++) matrix[0][i] = i;
    for (let j = 0; j <= b.length; j++) matrix[j][0] = j;
    for (let j = 1; j <= b.length; j++) {
      for (let i = 1; i <= a.length; i++) {
        const indicator = a[i - 1] === b[j - 1] ? 0 : 1;
        matrix[j][i] = Math.min(
          matrix[j][i - 1] + 1,
          matrix[j - 1][i] + 1,
          matrix[j - 1][i - 1] + indicator
        );
      }
    }
    return matrix[b.length][a.length];
  }

  const METHOD_MAP = {
    get: 'GET',
    fetch: 'GET',
    read: 'GET',
    list: 'GET',
    retrieve: 'GET',
    find: 'GET',
    lisr: 'GET',
    show: 'GET',
    post: 'POST',
    create: 'POST',
    add: 'POST',
    new: 'POST',
    insert: 'POST',
    put: 'PUT',
    update: 'PUT',
    edit: 'PUT',
    replace: 'PUT',
    patch: 'PATCH',
    modify: 'PATCH',
    partial: 'PATCH',
    delete: 'DELETE',
    remove: 'DELETE',
    destroy: 'DELETE',
    drop: 'DELETE'
  };

  const SINGLE_KEYWORDS = ['single', 'one', 'first', 'id', 'byid', 'specific'];
  const LIST_KEYWORDS = ['list', 'all', 'many', 'paginated', 'multiple', 'lisr', 'page'];

  const RESOURCE_MAP = {
    user: 'users',
    users: 'users',
    profile: 'users',
    account: 'users',
    member: 'users',
    post: 'posts',
    posts: 'posts',
    article: 'posts',
    blog: 'posts',
    comment: 'comments',
    comments: 'comments',
    reply: 'comments',
    todo: 'todos',
    todos: 'todos',
    task: 'todos'
  };

  function scoreEndpointMatch(rawQuery, ep) {
    if (!rawQuery) return 0;
    const tokens = rawQuery.toLowerCase().trim().split(/\s+/).filter(Boolean);
    if (tokens.length === 0) return 0;

    const methodLower = (ep.method || '').toLowerCase();
    const pathLower = (ep.path || '').toLowerCase();
    const summaryLower = (ep.summary || '').toLowerCase();
    const resourceLower = (ep.resource || '').toLowerCase();
    const fullText = `${methodLower} ${pathLower} ${summaryLower} ${resourceLower}`;

    let score = 0;
    const isSingleEndpoint = pathLower.includes(':id');

    tokens.forEach(token => {
      // Direct substring match
      if (fullText.includes(token)) {
        score += 8;
      }

      // Method match / synonym
      const mappedMethod = METHOD_MAP[token];
      if (mappedMethod && mappedMethod === ep.method) {
        score += 12;
      } else if (calcLevenshtein(token, methodLower) <= 1) {
        score += 8;
      }

      // Resource match / synonym
      const mappedResource = RESOURCE_MAP[token];
      if (mappedResource && mappedResource === resourceLower) {
        score += 15;
      } else if (token.length >= 3 && calcLevenshtein(token, resourceLower) <= 1) {
        score += 10;
      }

      // Endpoint path granularity match (single vs list)
      if (SINGLE_KEYWORDS.includes(token)) {
        if (isSingleEndpoint) score += 14;
      }
      if (LIST_KEYWORDS.includes(token)) {
        if (!isSingleEndpoint) score += 14;
      }

      // Fuzzy check against summary & path words for typos (e.g. lisr -> list)
      const words = fullText.split(/[\s/:_-]+/).filter(w => w.length >= 3);
      words.forEach(w => {
        const dist = calcLevenshtein(token, w);
        if (dist === 1) score += 6;
        else if (dist === 2 && token.length >= 4) score += 4;
      });
    });

    return score;
  }

  function createNoResultsHTML(queryText) {
    return `
      <div class="no-search-results">
        <div class="no-results-icon">🔍</div>
        <h3>No matching endpoints found for "<span style="color: var(--primary-accent);">${escapeHTML(queryText)}</span>"</h3>
        <p>Try searching with terms like <strong>"get single user"</strong>, <strong>"create post"</strong>, <strong>"delete comment"</strong>, or <strong>"list todos"</strong>.</p>
        <button type="button" class="btn btn-secondary clear-search-btn">Clear Search Filter</button>
      </div>
    `;
  }

  function escapeHTML(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function renderEndpointCardHTML(ep) {
    const sampleBodyStr = ep.bodyExample ? ep.bodyExample.replace(/\n\s*/g, ' ') : '';
    const formattedBodyForCurl = ep.bodyExample || '{}';

    const origin = (typeof window !== 'undefined' && window.location && window.location.origin)
      ? window.location.origin
      : 'http://localhost:3000';

    const curlCmd = ep.method === 'GET' 
      ? `curl -X GET '${origin}${ep.path}' \\\n  -H 'Content-Type: application/json' \\\n  -b "pg_identity=your_cookie_uuid"`
      : ep.method === 'DELETE'
      ? `curl -X DELETE '${origin}${ep.path}' \\\n  -H 'Content-Type: application/json' \\\n  -b "pg_identity=your_cookie_uuid"`
      : `curl -X ${ep.method} '${origin}${ep.path}' \\\n  -H 'Content-Type: application/json' \\\n  -b "pg_identity=your_cookie_uuid" \\\n  -d '${formattedBodyForCurl}'`;

    const fetchCmd = ep.method === 'GET' || ep.method === 'DELETE'
      ? `fetch('${origin}${ep.path}', {\n  method: '${ep.method}',\n  credentials: 'include'\n})\n  .then(res => res.json())\n  .then(data => console.log(data));`
      : `fetch('${origin}${ep.path}', {\n  method: '${ep.method}',\n  headers: { 'Content-Type': 'application/json' },\n  credentials: 'include',\n  body: JSON.stringify(${sampleBodyStr || '{}'})\n})\n  .then(res => res.json())\n  .then(data => console.log(data));`;

    const axiosCmd = ep.method === 'GET'
      ? `import axios from 'axios';\n\naxios.get('${origin}${ep.path}', {\n  withCredentials: true\n}).then(response => console.log(response.data));`
      : ep.method === 'DELETE'
      ? `import axios from 'axios';\n\naxios.delete('${origin}${ep.path}', {\n  withCredentials: true\n}).then(response => console.log(response.data));`
      : `import axios from 'axios';\n\naxios.${ep.method.toLowerCase()}('${origin}${ep.path}', ${sampleBodyStr || '{}'}, {\n  withCredentials: true\n}).then(response => console.log(response.data));`;

    const pythonCmd = ep.method === 'GET'
      ? `import requests\n\nresponse = requests.get('${origin}${ep.path}')\nprint(response.json())`
      : ep.method === 'DELETE'
      ? `import requests\n\nresponse = requests.delete('${origin}${ep.path}')\nprint(response.status_code)`
      : `import requests\n\npayload = ${sampleBodyStr || '{}'}\nresponse = requests.${ep.method.toLowerCase()}('${origin}${ep.path}', json=payload)\nprint(response.json())`;

    const goCmd = ep.method === 'GET' || ep.method === 'DELETE'
      ? `package main\n\nimport (\n\t"fmt"\n\t"io"\n\t"net/http"\n)\n\nfunc main() {\n\turl := "${origin}${ep.path}"\n\treq, err := http.NewRequest("${ep.method}", url, nil)\n\tif err != nil {\n\t\tpanic(err)\n\t}\n\n\treq.Header.Set("Content-Type", "application/json")\n\tclient := &http.Client{}\n\tresp, err := client.Do(req)\n\tif err != nil {\n\t\tpanic(err)\n\t}\n\tdefer resp.Body.Close()\n\n\tbody, _ := io.ReadAll(resp.Body)\n\tfmt.Println(string(body))\n}`
      : `package main\n\nimport (\n\t"bytes"\n\t"fmt"\n\t"io"\n\t"net/http"\n)\n\nfunc main() {\n\turl := "${origin}${ep.path}"\n\tpayload := []byte(\`${sampleBodyStr || '{}'}\`)\n\n\treq, err := http.NewRequest("${ep.method}", url, bytes.NewBuffer(payload))\n\tif err != nil {\n\t\tpanic(err)\n\t}\n\n\treq.Header.Set("Content-Type", "application/json")\n\tclient := &http.Client{}\n\tresp, err := client.Do(req)\n\tif err != nil {\n\t\tpanic(err)\n\t}\n\tdefer resp.Body.Close()\n\n\tbody, _ := io.ReadAll(resp.Body)\n\tfmt.Println(string(body))\n}`;

    const swiftCmd = ep.method === 'GET' || ep.method === 'DELETE'
      ? `import Foundation\n\nlet url = URL(string: "${origin}${ep.path}")!\nvar request = URLRequest(url: url)\nrequest.httpMethod = "${ep.method}"\nrequest.setValue("application/json", forHTTPHeaderField: "Content-Type")\n\nlet task = URLSession.shared.dataTask(with: request) { data, response, error in\n    guard let data = data, error == nil else { return }\n    let responseString = String(data: data, encoding: .utf8)\n    print(responseString ?? "")\n}\ntask.resume()`
      : `import Foundation\n\nlet url = URL(string: "${origin}${ep.path}")!\nvar request = URLRequest(url: url)\nrequest.httpMethod = "${ep.method}"\nrequest.setValue("application/json", forHTTPHeaderField: "Content-Type")\n\nlet jsonString = """\n${sampleBodyStr || '{}'}\n"""\nrequest.httpBody = jsonString.data(using: .utf8)\n\nlet task = URLSession.shared.dataTask(with: request) { data, response, error in\n    guard let data = data, error == nil else { return }\n    let responseString = String(data: data, encoding: .utf8)\n    print(responseString ?? "")\n}\ntask.resume()`;

    const kotlinCmd = ep.method === 'GET' || ep.method === 'DELETE'
      ? `import okhttp3.OkHttpClient\nimport okhttp3.Request\n\nval client = OkHttpClient()\nval request = Request.Builder()\n    .url("${origin}${ep.path}")\n    .${ep.method.toLowerCase()}()\n    .addHeader("Content-Type", "application/json")\n    .build()\n\nclient.newCall(request).execute().use { response ->\n    println(response.body?.string())\n}`
      : `import okhttp3.MediaType.Companion.toMediaType\nimport okhttp3.OkHttpClient\nimport okhttp3.Request\nimport okhttp3.RequestBody.Companion.toRequestBody\n\nval client = OkHttpClient()\nval mediaType = "application/json; charset=utf-8".toMediaType()\nval body = """${sampleBodyStr || '{}'}""".toRequestBody(mediaType)\n\nval request = Request.Builder()\n    .url("${origin}${ep.path}")\n    .${ep.method.toLowerCase()}(body)\n    .addHeader("Content-Type", "application/json")\n    .build()\n\nclient.newCall(request).execute().use { response ->\n    println(response.body?.string())\n}`;

    const rustCmd = ep.method === 'GET' || ep.method === 'DELETE'
      ? `use reqwest::Error;\n\n#[tokio::main]\nasync fn main() -> Result<(), Error> {\n    let client = reqwest::Client::new();\n    let response = client\n        .${ep.method.toLowerCase()}("${origin}${ep.path}")\n        .header("Content-Type", "application/json")\n        .send()\n        .await?\n        .text()\n        .await?;\n\n    println!("{}", response);\n    Ok(())\n}`
      : `use reqwest::Error;\nuse serde_json::json;\n\n#[tokio::main]\nasync fn main() -> Result<(), Error> {\n    let client = reqwest::Client::new();\n    let payload = json!(${sampleBodyStr || '{}'});\n\n    let response = client\n        .${ep.method.toLowerCase()}("${origin}${ep.path}")\n        .header("Content-Type", "application/json")\n        .json(&payload)\n        .send()\n        .await?\n        .text()\n        .await?;\n\n    println!("{}", response);\n    Ok(())\n}`;

    const phpCmd = ep.method === 'GET' || ep.method === 'DELETE'
      ? `<?php\nrequire 'vendor/autoload.php';\n\nuse GuzzleHttp\\Client;\n\n$client = new Client();\n$response = $client->request('${ep.method}', '${origin}${ep.path}', [\n    'headers' => [\n        'Content-Type' => 'application/json'\n    ]\n]);\n\necho $response->getBody();`
      : `<?php\nrequire 'vendor/autoload.php';\n\nuse GuzzleHttp\\Client;\n\n$client = new Client();\n$response = $client->request('${ep.method}', '${origin}${ep.path}', [\n    'headers' => [\n        'Content-Type' => 'application/json'\n    ],\n    'json' => json_decode('${sampleBodyStr || '{}'}', true)\n]);\n\necho $response->getBody();`;

    let paramsHTML = '';
    if (ep.params && ep.params.length > 0) {
      const rowsHTML = ep.params.map(p => `
        <tr>
          <td><code>${escapeHTML(p.name)}</code></td>
          <td><code>${escapeHTML(p.type)}</code></td>
          <td><span class="param-in">${escapeHTML(p.in)}</span></td>
          <td>${escapeHTML(p.description)}</td>
        </tr>
      `).join('');

      paramsHTML = `
        <div class="params-container">
          <div class="params-title">Request Parameters</div>
          <table class="params-table">
            <thead>
              <tr><th>Name</th><th>Type</th><th>Location</th><th>Description</th></tr>
            </thead>
            <tbody>${rowsHTML}</tbody>
          </table>
        </div>
      `;
    }

    let formParamsHTML = '';
    if (ep.params) {
      ep.params.filter(p => p.in === 'path' || p.in === 'query').forEach(p => {
        formParamsHTML += `
          <div class="form-group">
            <label for="param-${ep.method}-${ep.path}-${p.name}">${escapeHTML(p.name)} (${escapeHTML(p.in)}):</label>
            <input 
              type="text" 
              id="param-${ep.method}-${ep.path}-${p.name}" 
              data-param-name="${escapeHTML(p.name)}" 
              data-param-in="${escapeHTML(p.in)}" 
              placeholder="${escapeHTML(p.description)}"
              class="form-control"
            >
          </div>
        `;
      });
    }

    let bodyInputHTML = '';
    if (ep.bodyExample) {
      bodyInputHTML = `
        <div class="form-group">
          <label for="body-${ep.method}-${ep.path}">JSON Request Body:</label>
          <textarea 
            id="body-${ep.method}-${ep.path}" 
            class="form-control body-input" 
            rows="5"
          >${escapeHTML(ep.bodyExample)}</textarea>
        </div>
      `;
    }

    return `
      <div class="endpoint-card" data-endpoint-text="${escapeHTML(ep.method)} ${escapeHTML(ep.path)} ${escapeHTML(ep.summary)} ${escapeHTML(ep.resource)}">
        <div class="endpoint-header">
          <div class="endpoint-header-left">
            <span class="badge badge-${ep.method.toLowerCase()}">${escapeHTML(ep.method)}</span>
            <span class="endpoint-path">${escapeHTML(ep.path)}</span>
            <span class="resource-badge-tag">/${escapeHTML(ep.resource)}</span>
          </div>
          <button type="button" class="copy-url-btn" data-url="${origin}${escapeHTML(ep.path)}">
            <span>🔗 Copy URL</span>
          </button>
        </div>


        <p class="endpoint-summary">${escapeHTML(ep.summary)}</p>

        ${paramsHTML}

        <div class="snippet-container">
          <div class="snippet-header">
            <div class="snippet-tabs">
              <button type="button" class="snippet-tab-btn active" data-target="curl">cURL</button>
              <button type="button" class="snippet-tab-btn" data-target="node">Node (fetch)</button>
              <button type="button" class="snippet-tab-btn" data-target="axios">Axios</button>
              <button type="button" class="snippet-tab-btn" data-target="python">Python</button>
              <button type="button" class="snippet-tab-btn" data-target="go">Go</button>
              <button type="button" class="snippet-tab-btn" data-target="swift">Swift</button>
              <button type="button" class="snippet-tab-btn" data-target="kotlin">Kotlin</button>
              <button type="button" class="snippet-tab-btn" data-target="rust">Rust</button>
              <button type="button" class="snippet-tab-btn" data-target="php">PHP</button>
            </div>
            <button type="button" class="copy-btn">
              <span>📋 Copy Code</span>
            </button>
          </div>
          <div class="snippet-content">
            <pre class="snippet-code-block" data-snippet="curl"><code>${escapeHTML(curlCmd)}</code></pre>
            <pre class="snippet-code-block" data-snippet="node" hidden><code>${escapeHTML(fetchCmd)}</code></pre>
            <pre class="snippet-code-block" data-snippet="axios" hidden><code>${escapeHTML(axiosCmd)}</code></pre>
            <pre class="snippet-code-block" data-snippet="python" hidden><code>${escapeHTML(pythonCmd)}</code></pre>
            <pre class="snippet-code-block" data-snippet="go" hidden><code>${escapeHTML(goCmd)}</code></pre>
            <pre class="snippet-code-block" data-snippet="swift" hidden><code>${escapeHTML(swiftCmd)}</code></pre>
            <pre class="snippet-code-block" data-snippet="kotlin" hidden><code>${escapeHTML(kotlinCmd)}</code></pre>
            <pre class="snippet-code-block" data-snippet="rust" hidden><code>${escapeHTML(rustCmd)}</code></pre>
            <pre class="snippet-code-block" data-snippet="php" hidden><code>${escapeHTML(phpCmd)}</code></pre>
          </div>
        </div>


        <div class="examples-grid">
          ${ep.bodyExample ? `<div class="example-box"><h4>Request Payload Example</h4><pre><code>${escapeHTML(ep.bodyExample)}</code></pre></div>` : ''}
          ${ep.responseExample ? `<div class="example-box"><h4>Response Schema Example</h4><pre><code>${escapeHTML(ep.responseExample)}</code></pre></div>` : ''}
        </div>

        <div class="try-it-container">
          <details class="try-it-details">
            <summary>
              <span>⚡ Try it out — Test endpoint live</span>
              <span style="font-size: 0.8rem; font-weight: normal; opacity: 0.8;">Run fetch</span>
            </summary>
            <div class="try-it-body">
              <form class="try-it__form" data-method="${escapeHTML(ep.method)}" data-path="${escapeHTML(ep.path)}">
                ${formParamsHTML}
                ${bodyInputHTML}
                <div style="margin-top: 0.5rem;">
                  <button type="submit" class="btn btn-primary">Execute Request</button>
                </div>
              </form>
              <pre class="try-it__result" hidden></pre>
            </div>
          </details>
        </div>
      </div>
    `;
  }

  // Bind Search Listeners across Sidebar Search & Hero Search
  const sidebarSearch = document.getElementById('sidebar-search');
  const heroSearch = document.getElementById('hero-search');
  const rootSearchContainer = document.getElementById('root-search-container');
  const rootSearchHeading = document.getElementById('root-search-heading');
  const rootSearchResultsList = document.getElementById('root-search-results-list');
  const rootOverviewContent = document.getElementById('root-overview-content');

  function clearAllSearch() {
    if (sidebarSearch) sidebarSearch.value = '';
    if (heroSearch) heroSearch.value = '';
    performSearch('');
  }

  document.addEventListener('click', (e) => {
    if (e.target && e.target.classList.contains('clear-search-btn')) {
      clearAllSearch();
    }
  });

  function performSearch(rawQuery) {
    const query = rawQuery.trim();
    const navItems = document.querySelectorAll('.nav-item');

    // Filter sidebar nav links based on query
    navItems.forEach(item => {
      const text = item.textContent.toLowerCase();
      if (text.includes(query.toLowerCase()) || query === '') {
        item.style.display = 'flex';
      } else {
        item.style.display = 'none';
      }
    });

    // 1. Root Landing Page Dynamic Endpoint Search
    if (rootSearchContainer && rootOverviewContent && window.ALL_ENDPOINTS_CATALOG) {
      if (!query) {
        rootSearchContainer.hidden = true;
        rootOverviewContent.style.display = 'block';
        return;
      }

      rootOverviewContent.style.display = 'none';
      rootSearchContainer.hidden = false;

      // Score all catalog endpoints
      const scoredEndpoints = window.ALL_ENDPOINTS_CATALOG.map(ep => ({
        ep,
        score: scoreEndpointMatch(query, ep)
      })).filter(item => item.score >= 5);

      // Sort descending by match score
      scoredEndpoints.sort((a, b) => b.score - a.score);

      if (scoredEndpoints.length > 0) {
        rootSearchHeading.textContent = `Search Results (${scoredEndpoints.length} endpoint${scoredEndpoints.length > 1 ? 's' : ''} found for "${query}")`;
        rootSearchResultsList.innerHTML = scoredEndpoints.map(item => renderEndpointCardHTML(item.ep)).join('');
        wireAllInteractions(rootSearchResultsList);
      } else {
        rootSearchHeading.textContent = `Search Results`;
        rootSearchResultsList.innerHTML = createNoResultsHTML(query);
      }
      return;
    }

    // 2. Resource Specific Page Search Filter
    const existingCards = document.querySelectorAll('.main-area .endpoint-card');
    if (existingCards.length > 0) {
      let visibleCount = 0;
      const cardContainer = existingCards[0].parentElement;

      // Clean up existing no-results card if any
      const existingNoResults = cardContainer.querySelector('.no-search-results');
      if (existingNoResults) {
        existingNoResults.remove();
      }

      existingCards.forEach(card => {
        if (!query) {
          card.style.display = 'block';
          visibleCount++;
          return;
        }

        const dataText = card.getAttribute('data-endpoint-text') || card.textContent;
        const methodMatch = dataText.match(/^(GET|POST|PUT|PATCH|DELETE)\s+(\/[^\s]+)/i);
        const epData = {
          method: methodMatch ? methodMatch[1] : '',
          path: methodMatch ? methodMatch[2] : '',
          summary: dataText,
          resource: window.location.pathname.replace('/docs/', '')
        };

        const score = scoreEndpointMatch(query, epData);
        if (score >= 5 || dataText.toLowerCase().includes(query.toLowerCase())) {
          card.style.display = 'block';
          visibleCount++;
        } else {
          card.style.display = 'none';
        }
      });

      if (query && visibleCount === 0) {
        const noResultsDiv = document.createElement('div');
        noResultsDiv.innerHTML = createNoResultsHTML(query);
        cardContainer.appendChild(noResultsDiv.firstElementChild);
      }
    }
  }

  function handleSearchInput(e) {
    const val = e.target.value;
    if (sidebarSearch && e.target !== sidebarSearch) sidebarSearch.value = val;
    if (heroSearch && e.target !== heroSearch) heroSearch.value = val;
    performSearch(val);
  }

  if (sidebarSearch) {
    sidebarSearch.addEventListener('input', handleSearchInput);
  }
  if (heroSearch) {
    heroSearch.addEventListener('input', handleSearchInput);
  }

  // 2. Interactive Components Wiring (Copy URLs, Snippets, Try-It Form)
  function wireAllInteractions(parent = document) {
    // Copy Endpoint URL Buttons
    const copyUrlBtns = parent.querySelectorAll('.copy-url-btn');
    copyUrlBtns.forEach(btn => {
      if (btn.dataset.wired) return;
      btn.dataset.wired = 'true';
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

    // Snippet Containers (Tabs & Copy)
    const snippetContainers = parent.querySelectorAll('.snippet-container');
    snippetContainers.forEach(container => {
      if (container.dataset.wired) return;
      container.dataset.wired = 'true';

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

    // Interactive Try It Forms
    const forms = parent.querySelectorAll('.try-it__form');
    forms.forEach(form => {
      if (form.dataset.wired) return;
      form.dataset.wired = 'true';

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
  }

  // Initial wiring for pre-rendered DOM elements
  wireAllInteractions(document);
});
