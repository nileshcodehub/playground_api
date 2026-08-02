document.addEventListener('DOMContentLoaded', () => {
  // Toast Notification System
  function showToast(message, type = 'copy', duration = 3000) {
    let toastContainer = document.getElementById('toast-container');
    if (!toastContainer) {
      toastContainer = document.createElement('div');
      toastContainer.id = 'toast-container';
      document.body.appendChild(toastContainer);
    }

    const icons = {
      success: '✅',
      copy: '📋',
      info: 'ℹ️',
      warning: '⚠️',
      error: '❌'
    };
    const icon = icons[type] || icons.copy;

    const toast = document.createElement('div');
    toast.className = `toast-message toast-${type}`;
    toast.innerHTML = `<span style="font-size: 1.1rem;">${icon}</span><span>${message}</span>`;

    toastContainer.appendChild(toast);

    requestAnimationFrame(() => {
      toast.classList.add('toast-visible');
    });

    setTimeout(() => {
      toast.classList.remove('toast-visible');
      setTimeout(() => {
        if (toast.parentNode) {
          toast.parentNode.removeChild(toast);
        }
      }, 300);
    }, duration);
  }

  window.showToast = showToast;

  // Unified Copy Helper with Clipboard API + Fallback + Toast
  async function copyTextToClipboard(text, toastMsg = 'Copied to clipboard!') {
    if (!text) return false;
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(text);
      } else {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }
      showToast(toastMsg, 'copy');
      return true;
    } catch (err) {
      console.error('Copy to clipboard failed:', err);
      showToast('Failed to copy to clipboard', 'error');
      return false;
    }
  }

  window.copyTextToClipboard = copyTextToClipboard;

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
            <button type="button" class="copy-btn" title="Copy code snippet">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
              <span>Copy</span>
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
              <span style="font-size: 0.8rem; font-weight: normal; opacity: 0.8;">Test now</span>
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
      btn.addEventListener('click', async () => {
        const url = btn.getAttribute('data-url');
        if (url) {
          const originalText = btn.innerHTML;
          const success = await copyTextToClipboard(url, '🔗 Endpoint URL copied to clipboard!');
          if (success) {
            btn.innerHTML = '<span>✅ Copied URL!</span>';
            setTimeout(() => {
              btn.innerHTML = originalText;
            }, 2000);
          }
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
              block.removeAttribute('hidden');
              block.style.display = 'block';
            } else {
              block.hidden = true;
              block.setAttribute('hidden', '');
              block.style.display = 'none';
            }
          });
        });
      });

      if (copyBtn) {
        copyBtn.addEventListener('click', async () => {
          const activeTab = container.querySelector('.snippet-tab-btn.active');
          const target = activeTab ? activeTab.getAttribute('data-target') : 'curl';
          const visibleBlock = container.querySelector(`.snippet-code-block[data-snippet="${target}"]`) 
            || Array.from(codeBlocks).find(b => !b.hidden && b.style.display !== 'none')
            || codeBlocks[0];

          if (visibleBlock) {
            const codeText = visibleBlock.textContent || visibleBlock.innerText;
            const originalHTML = copyBtn.innerHTML;
            const successHTML = `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg><span style="color:#10b981;">Copied!</span>`;

            const success = await copyTextToClipboard(codeText.trim(), '📋 Code snippet copied to clipboard!');
            if (success) {
              copyBtn.innerHTML = successHTML;
              setTimeout(() => {
                copyBtn.innerHTML = originalHTML;
              }, 2000);
            }
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

        const delayInput = form.querySelector('.sim-delay-input');
        const statusInput = form.querySelector('.sim-status-input');

        // Execute request
        try {
          const headers = {
            'Content-Type': 'application/json'
          };

          if (delayInput && delayInput.value.trim()) {
            headers['X-Simulate-Delay'] = delayInput.value.trim();
          }

          if (statusInput && statusInput.value.trim()) {
            headers['X-Simulate-Status'] = statusInput.value.trim();
          }

          const options = {
            method,
            headers,
            credentials: 'include' // Crucial: send pg_identity cookie
          };

          if (requestBody && ['POST', 'PUT', 'PATCH'].includes(method)) {
            options.body = JSON.stringify(requestBody);
          }

          const startTime = performance.now();
          const response = await fetch(fullUrl, options);
          const durationMs = Math.round(performance.now() - startTime);

          const statusPillClass = response.ok ? 'status-2xx' : (response.status >= 500 ? 'status-5xx' : 'status-4xx');
          const statusHeader = `HTTP ${response.status} ${response.statusText || (response.ok ? 'OK' : 'Error')}`;

          const rawText = await response.text();
          const sizeBytes = new Blob([rawText]).size;
          const sizeFormatted = sizeBytes >= 1024 ? `${(sizeBytes / 1024).toFixed(2)} KB` : `${sizeBytes} B`;

          // Extract response headers
          const responseHeaders = {};
          response.headers.forEach((value, key) => {
            responseHeaders[key] = value;
          });

          resultBlock.textContent = '';
          resultBlock.innerHTML = '';

          // Inspector Toolbar
          const inspectorBar = document.createElement('div');
          inspectorBar.className = 'try-it-inspector-bar';

          const statusBadge = document.createElement('span');
          statusBadge.className = `status-badge-pill ${statusPillClass}`;
          statusBadge.textContent = statusHeader;
          inspectorBar.appendChild(statusBadge);

          const timeBadge = document.createElement('span');
          timeBadge.className = 'inspector-badge';
          timeBadge.textContent = `⏱️ ${durationMs} ms`;
          inspectorBar.appendChild(timeBadge);

          const sizeBadge = document.createElement('span');
          sizeBadge.className = 'inspector-badge';
          sizeBadge.textContent = `📦 ${sizeFormatted}`;
          inspectorBar.appendChild(sizeBadge);

          const cookieBadge = document.createElement('span');
          cookieBadge.className = 'inspector-badge inspector-badge--cookie';
          cookieBadge.textContent = `🍪 Session Identity Active`;
          inspectorBar.appendChild(cookieBadge);

          resultBlock.appendChild(inspectorBar);

          // Collapsible Response Headers Drawer
          const headersDetails = document.createElement('details');
          headersDetails.className = 'inspector-headers-details';
          const summary = document.createElement('summary');
          summary.textContent = `📋 Response Headers (${Object.keys(responseHeaders).length})`;
          headersDetails.appendChild(summary);

          const headersGrid = document.createElement('div');
          headersGrid.className = 'inspector-headers-grid';
          Object.entries(responseHeaders).forEach(([k, v]) => {
            const row = document.createElement('div');
            row.className = 'inspector-header-row';
            row.innerHTML = `<span class="header-name">${k}:</span> <span class="header-val">${v}</span>`;
            headersGrid.appendChild(row);
          });
          headersDetails.appendChild(headersGrid);
          resultBlock.appendChild(headersDetails);

          // Response Body Content
          let dataText = rawText;
          if (response.status === 204) {
            dataText = '204 No Content (Record updated/deleted in session overlay)';
          } else {
            try {
              const json = JSON.parse(rawText);
              dataText = JSON.stringify(json, null, 2);
            } catch {
              dataText = rawText;
            }
          }

          const preBody = document.createElement('pre');
          preBody.className = 'inspector-response-body';
          preBody.textContent = dataText;
          resultBlock.appendChild(preBody);
        } catch (err) {
          resultBlock.textContent = `❌ Network Error: ${err.message}`;
        }
      });
    });
  }

  // Initial wiring for pre-rendered DOM elements
  wireAllInteractions(document);

  // Copy Session Token Button Wiring
  const copyBtn = document.getElementById('copy-session-id-btn');
  const sessionDisplay = document.getElementById('session-id-display');
  if (copyBtn && sessionDisplay) {
    copyBtn.addEventListener('click', async () => {
      const token = sessionDisplay.getAttribute('data-session-token');
      if (!token) {
        showToast('No active session token found.', 'warning');
        return;
      }
      const originalHTML = copyBtn.innerHTML;
      const successHTML = `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg><span style="color:#10b981;">Copied!</span>`;

      const success = await copyTextToClipboard(token, '🔑 Session token copied for X-Playground-Identity header!');
      if (success) {
        copyBtn.innerHTML = successHTML;
        setTimeout(() => { copyBtn.innerHTML = originalHTML; }, 2000);
      }
    });
  }

  // Reset Session Sandbox Button Wiring
  const resetBtn = document.getElementById('reset-sandbox-btn');
  if (resetBtn) {
    resetBtn.addEventListener('click', async () => {
      const confirmReset = confirm('Are you sure you want to reset your session sandbox? All your created, updated, and deleted records will be purged.');
      if (!confirmReset) return;

      const originalText = resetBtn.innerHTML;
      resetBtn.disabled = true;
      resetBtn.innerHTML = '⏳ Resetting...';

      try {
        let res = await fetch('/session/reset', { method: 'DELETE' });
        if (!res.ok) {
          // Fallback to POST /session/reset if DELETE fails
          res = await fetch('/session/reset', { method: 'POST' });
        }

        if (res.ok) {
          resetBtn.innerHTML = '✅ Reset Done!';
          setTimeout(() => {
            window.location.reload();
          }, 400);
        } else {
          alert('Failed to reset session sandbox. Please try again.');
          resetBtn.disabled = false;
          resetBtn.innerHTML = originalText;
        }
      } catch (err) {
        alert('Network error resetting session sandbox: ' + err.message);
        resetBtn.disabled = false;
        resetBtn.innerHTML = originalText;
      }
    });
  }

  // Dynamic Export Resource Select Wiring
  const exportSelect = document.getElementById('export-resource-select');
  if (exportSelect) {
    const updateExportHrefs = () => {
      const selected = exportSelect.value;
      const query = (selected && selected !== 'all') ? `?resource=${selected}` : '';

      const openapiBtn = document.getElementById('export-btn-openapi');
      const postmanBtn = document.getElementById('export-btn-postman');
      const brunoBtn = document.getElementById('export-btn-bruno');
      const insomniaBtn = document.getElementById('export-btn-insomnia');

      if (openapiBtn) openapiBtn.href = `/downloads/openapi.json${query}`;
      if (postmanBtn) postmanBtn.href = `/downloads/postman.json${query}`;
      if (brunoBtn) brunoBtn.href = `/downloads/bruno.json${query}`;
      if (insomniaBtn) insomniaBtn.href = `/downloads/insomnia.json${query}`;
    };

    exportSelect.addEventListener('change', updateExportHrefs);
  }

  // Session Dashboard Modal Wiring
  const openModalBtn = document.getElementById('open-session-dashboard-btn');
  const dashboardModal = document.getElementById('session-dashboard-modal');
  const closeModalBtn = document.getElementById('close-session-dashboard-btn');
  const dismissModalBtn = document.getElementById('modal-dismiss-btn');
  const modalCopyTokenBtn = document.getElementById('modal-copy-token-btn');
  const modalResetBtn = document.getElementById('modal-reset-sandbox-btn');
  const modalBody = document.getElementById('modal-dashboard-body');

  const openDashboard = async () => {
    if (!dashboardModal || !modalBody) return;
    dashboardModal.removeAttribute('hidden');
    modalBody.innerHTML = `<div style="text-align: center; padding: 2rem; color: var(--text-secondary);">⏳ Loading session statistics...</div>`;

    try {
      const res = await fetch('/session/stats');
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();

      const createdDate = new Date(data.identity.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
      const lastSeenDate = new Date(data.identity.lastSeenAt).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });

      let resourcesHtml = '';
      const resources = ['users', 'posts', 'comments', 'todos'];
      let totalCreated = 0;
      let totalUpdated = 0;
      let totalDeleted = 0;

      resources.forEach((resKey) => {
        const item = data.stats.byResource[resKey] || { created: 0, updated: 0, deleted: 0, total: 0 };
        totalCreated += item.created;
        totalUpdated += item.updated;
        totalDeleted += item.deleted;

        const pct = Math.min(100, Math.round((item.created / data.quota.maxCreatedPerResource) * 100));
        resourcesHtml += `
          <tr style="border-bottom: 1px solid var(--border-color);">
            <td style="padding: 0.6rem 0.5rem; font-weight: 600; text-transform: capitalize;">/${resKey}</td>
            <td style="padding: 0.6rem 0.5rem; text-align: center;">${item.created} / ${data.quota.maxCreatedPerResource}</td>
            <td style="padding: 0.6rem 0.5rem; text-align: center;">${item.updated}</td>
            <td style="padding: 0.6rem 0.5rem; text-align: center;">${item.deleted}</td>
            <td style="padding: 0.6rem 0.5rem; width: 110px;">
              <div class="quota-progress-container">
                <div class="quota-progress-bar" style="width: ${pct}%;"></div>
              </div>
            </td>
          </tr>
        `;
      });

      modalBody.innerHTML = `
        <!-- Identity Summary Row -->
        <div style="background: var(--bg-sidebar); border: 1px solid var(--border-color); border-radius: 8px; padding: 0.85rem 1rem; margin-bottom: 1.25rem;">
          <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 0.5rem; margin-bottom: 0.5rem;">
            <span style="font-size: 0.82rem; font-weight: 600; color: var(--text-secondary);">IDENTITY UUID</span>
            <span class="resource-badge-tag" style="margin: 0; font-size: 0.72rem;">10-DAY INACTIVITY RETENTION ACTIVE</span>
          </div>
          <div style="font-family: 'Fira Code', monospace; font-size: 0.88rem; color: var(--primary-accent); word-break: break-all;">
            ${data.identity.id}
          </div>
          <div style="display: flex; gap: 1.25rem; font-size: 0.78rem; color: var(--text-muted); margin-top: 0.5rem;">
            <span>📅 Created: ${createdDate}</span>
            <span>⚡ Last Active: ${lastSeenDate}</span>
          </div>
        </div>

        <!-- Metric Stat Counters Grid -->
        <div class="metric-stat-grid">
          <div class="metric-stat-card">
            <div class="metric-stat-value">${data.stats.totalRecords}</div>
            <div class="metric-stat-label">Total Sandbox Records</div>
          </div>
          <div class="metric-stat-card">
            <div class="metric-stat-value" style="color: var(--get-badge);">${totalCreated}</div>
            <div class="metric-stat-label">Records Created</div>
          </div>
          <div class="metric-stat-card">
            <div class="metric-stat-value" style="color: #f59e0b;">${totalUpdated}</div>
            <div class="metric-stat-label">Records Updated</div>
          </div>
          <div class="metric-stat-card">
            <div class="metric-stat-value" style="color: var(--delete-badge);">${totalDeleted}</div>
            <div class="metric-stat-label">Records Deleted</div>
          </div>
        </div>

        <!-- Quotas & Activity Table -->
        <h4 style="font-size: 0.9rem; margin-bottom: 0.6rem; color: var(--text-primary);">Resource Quotas & Mutations</h4>
        <div style="overflow-x: auto; background: var(--bg-sidebar); border: 1px solid var(--border-color); border-radius: 8px;">
          <table style="width: 100%; border-collapse: collapse; font-size: 0.82rem; text-align: left;">
            <thead>
              <tr style="border-bottom: 1px solid var(--border-color); color: var(--text-secondary); background: rgba(255,255,255,0.02);">
                <th style="padding: 0.6rem 0.5rem;">Resource</th>
                <th style="padding: 0.6rem 0.5rem; text-align: center;">Created (Quota)</th>
                <th style="padding: 0.6rem 0.5rem; text-align: center;">Updated</th>
                <th style="padding: 0.6rem 0.5rem; text-align: center;">Deleted</th>
                <th style="padding: 0.6rem 0.5rem;">Usage</th>
              </tr>
            </thead>
            <tbody>
              ${resourcesHtml}
            </tbody>
          </table>
        </div>
      `;
    } catch (err) {
      modalBody.innerHTML = `<div style="text-align: center; padding: 2rem; color: var(--delete-badge);">❌ Failed to load session stats: ${err.message}</div>`;
    }
  };

  const closeModal = () => {
    if (dashboardModal) dashboardModal.setAttribute('hidden', '');
  };

  if (openModalBtn) openModalBtn.addEventListener('click', openDashboard);
  if (closeModalBtn) closeModalBtn.addEventListener('click', closeModal);
  if (dismissModalBtn) dismissModalBtn.addEventListener('click', closeModal);

  if (dashboardModal) {
    dashboardModal.addEventListener('click', (e) => {
      if (e.target === dashboardModal) closeModal();
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && dashboardModal && !dashboardModal.hasAttribute('hidden')) {
      closeModal();
    }
  });

  if (modalCopyTokenBtn) {
    modalCopyTokenBtn.addEventListener('click', async () => {
      const sessionDisplay = document.getElementById('session-id-display');
      const token = sessionDisplay ? sessionDisplay.getAttribute('data-session-token') : null;
      if (!token) return alert('No active session token found.');

      try {
        await navigator.clipboard.writeText(token);
        modalCopyTokenBtn.textContent = '✅ Copied!';
        setTimeout(() => { modalCopyTokenBtn.textContent = '📋 Copy Signed Token'; }, 2000);
      } catch {
        alert(token);
      }
    });
  }

  if (modalResetBtn) {
    modalResetBtn.addEventListener('click', async () => {
      if (!confirm('Are you sure you want to reset all session sandbox mutations?')) return;
      try {
        const res = await fetch('/session/reset', { method: 'DELETE' });
        if (res.ok) {
          closeModal();
          window.location.reload();
        } else {
          alert('Failed to reset session sandbox.');
        }
      } catch (err) {
        alert('Network error: ' + err.message);
      }
    });
  }

  // Header & Footer Triggers Wiring
  const statsBtns = document.querySelectorAll('.header-stats-btn');
  const footerStatsTrigger = document.getElementById('footer-stats-trigger');
  statsBtns.forEach(btn => btn.addEventListener('click', openDashboard));
  if (footerStatsTrigger) {
    footerStatsTrigger.addEventListener('click', (e) => {
      e.preventDefault();
      openDashboard();
    });
  }

  const copyBtns = document.querySelectorAll('.header-copy-btn');
  copyBtns.forEach(btn => {
    btn.addEventListener('click', async () => {
      const sessionDisplay = document.getElementById('session-id-display');
      const token = sessionDisplay ? sessionDisplay.getAttribute('data-session-token') : null;
      if (!token) return showToast('No active session token found.', 'warning');

      const origText = btn.innerHTML;
      const success = await copyTextToClipboard(token, '🔑 Session token copied for X-Playground-Identity header!');
      if (success) {
        btn.innerHTML = '<span>✅ Copied!</span>';
        setTimeout(() => { btn.innerHTML = origText; }, 2000);
      }
    });
  });

  // Mobile Drawer Toggle Wiring
  const mobileToggleBtn = document.getElementById('mobile-menu-toggle');
  const appSidebar = document.getElementById('app-sidebar');
  if (mobileToggleBtn && appSidebar) {
    mobileToggleBtn.addEventListener('click', () => {
      appSidebar.classList.toggle('mobile-open');
    });
  }

  // Architecture Explainer Modal Wiring
  const openExplainerBtn = document.getElementById('open-explainer-modal-btn');
  const footerExplainerTrigger = document.getElementById('footer-explainer-trigger');
  const explainerModal = document.getElementById('sandbox-explainer-modal');
  const closeExplainerBtn = document.getElementById('close-explainer-modal-btn');
  const dismissExplainerBtn = document.getElementById('dismiss-explainer-modal-btn');

  const openExplainer = () => {
    if (explainerModal) explainerModal.removeAttribute('hidden');
  };

  const closeExplainer = () => {
    if (explainerModal) explainerModal.setAttribute('hidden', '');
  };

  if (openExplainerBtn) openExplainerBtn.addEventListener('click', openExplainer);
  if (footerExplainerTrigger) {
    footerExplainerTrigger.addEventListener('click', (e) => {
      e.preventDefault();
      openExplainer();
    });
  }
  if (closeExplainerBtn) closeExplainerBtn.addEventListener('click', closeExplainer);
  if (dismissExplainerBtn) dismissExplainerBtn.addEventListener('click', closeExplainer);

  if (explainerModal) {
    explainerModal.addEventListener('click', (e) => {
      if (e.target === explainerModal) closeExplainer();
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && explainerModal && !explainerModal.hasAttribute('hidden')) {
      closeExplainer();
    }
  });
});
