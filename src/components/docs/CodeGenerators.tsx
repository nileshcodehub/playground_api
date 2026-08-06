'use client';

import React, { useState } from 'react';
import { Icon } from '@iconify/react';
import { EndpointDef } from '@/config/api-catalog';
import config from '@/config/env';

interface CodeGeneratorsProps {
  endpoint: EndpointDef;
}

export function CodeGenerators({ endpoint }: CodeGeneratorsProps) {
  const [activeLang, setActiveLang] = useState('javascript');
  const [copied, setCopied] = useState(false);

  const fullUrl = `${config.apiUrl}${endpoint.path}`;

  const generators: Record<string, string> = {
    javascript: `fetch('${fullUrl}', {
  method: '${endpoint.method}',
  headers: { 'Content-Type': 'application/json' }${
    ['POST', 'PUT', 'PATCH'].includes(endpoint.method)
      ? `,\n  body: JSON.stringify(${JSON.stringify(endpoint.requestBody || {}, null, 2)})`
      : ''
  }
})
  .then(res => res.json())
  .then(data => console.log(data));`,

    axios: `import axios from 'axios';

axios.${endpoint.method.toLowerCase()}('${fullUrl}'${
      ['POST', 'PUT', 'PATCH'].includes(endpoint.method)
        ? `, ${JSON.stringify(endpoint.requestBody || {}, null, 2)}`
        : ''
    })
  .then(response => console.log(response.data))
  .catch(error => console.error(error));`,

    curl: `curl -X ${endpoint.method} "${fullUrl}" \\
  -H "Content-Type: application/json"${
    ['POST', 'PUT', 'PATCH'].includes(endpoint.method)
      ? ` \\\n  -d '${JSON.stringify(endpoint.requestBody || {})}'`
      : ''
  }`,

    python: `import requests

url = "${fullUrl}"
response = requests.${endpoint.method.toLowerCase()}(url${
      ['POST', 'PUT', 'PATCH'].includes(endpoint.method)
        ? `, json=${JSON.stringify(endpoint.requestBody || {})}`
        : ''
    })
print(response.json())`,

    go: `package main

import (
	"fmt"
	"io"
	"net/http"
)

func main() {
	req, _ := http.NewRequest("${endpoint.method}", "${fullUrl}", nil)
	resp, _ := http.DefaultClient.Do(req)
	defer resp.Body.Close()
	body, _ := io.ReadAll(resp.Body)
	fmt.Println(string(body))
}`,
  };

  const code = generators[activeLang] || generators.javascript;

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="rounded-xl border border-border-theme bg-code-bg overflow-hidden shadow-xs">
      <div className="flex items-center justify-between bg-bg-tertiary px-3 py-1.5 border-b border-border-theme overflow-x-auto">
        <div className="flex items-center gap-1">
          {['javascript', 'axios', 'curl', 'python', 'go'].map((lang) => (
            <button
              key={lang}
              onClick={() => setActiveLang(lang)}
              className={`px-2.5 py-1 rounded-md text-[11px] font-mono font-medium capitalize transition-colors cursor-pointer shrink-0 ${
                activeLang === lang
                  ? 'bg-accent-primary text-white font-bold'
                  : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              {lang}
            </button>
          ))}
        </div>
        <button
          onClick={handleCopy}
          className="text-text-muted hover:text-text-primary text-xs flex items-center gap-1 font-mono transition-colors cursor-pointer shrink-0 ml-2"
        >
          <Icon icon={copied ? 'ph:check-bold' : 'ph:copy-bold'} className="w-3.5 h-3.5" />
          <span>{copied ? 'Copied' : 'Copy'}</span>
        </button>
      </div>

      <pre className="p-4 font-mono text-xs text-gray-200 overflow-x-auto">
        <code>{code}</code>
      </pre>
    </div>
  );
}
