'use client';

import React, { useState } from 'react';
import { Icon } from '@iconify/react';
import { CodeBlock } from '@/components/ui/CodeBlock';
import config from '@/config/env';

const languages = [
  { id: 'javascript', name: 'JavaScript (fetch)', icon: 'simple-icons:javascript' },
  { id: 'axios', name: 'Axios', icon: 'simple-icons:axios' },
  { id: 'python', name: 'Python (requests)', icon: 'simple-icons:python' },
  { id: 'go', name: 'Go', icon: 'simple-icons:go' },
  { id: 'swift', name: 'Swift', icon: 'simple-icons:swift' },
  { id: 'rust', name: 'Rust', icon: 'simple-icons:rust' },
  { id: 'curl', name: 'cURL', icon: 'ph:terminal-window-bold' },
];

export function QuickstartTabs() {
  const [activeLang, setActiveLang] = useState('javascript');
  const [copied, setCopied] = useState(false);

  const snippets: Record<string, string> = {
    javascript: `// Fetch posts using standard JavaScript fetch
const response = await fetch('${config.apiUrl}/posts?_limit=5');
const posts = await response.json();
console.log('Posts:', posts);

// Create a new post in your session sandbox
const createRes = await fetch('${config.apiUrl}/posts', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ title: 'New Prototype Article', user_id: 1 })
});
const newPost = await createRes.json();
console.log('Created post:', newPost);`,

    axios: `import axios from 'axios';

// Fetch posts using Axios
const { data: posts } = await axios.get('${config.apiUrl}/posts', {
  params: { _limit: 5 }
});
console.log('Fetched posts:', posts);

// Create a new post overlay
const { data: newPost } = await axios.post('${config.apiUrl}/posts', {
  title: 'New Prototype Article',
  user_id: 1
});
console.log('Created post:', newPost);`,

    python: `import requests

# Fetch posts
url = "${config.apiUrl}/posts"
response = requests.get(url, params={"_limit": 5})
posts = response.json()
print("Posts:", posts)

# Create a new sandboxed post
new_post = {"title": "New Prototype Article", "user_id": 1}
created = requests.post(url, json=new_post).json()
print("Created Post:", created)`,

    go: `package main

import (
	"fmt"
	"io"
	"net/http"
)

func main() {
	resp, err := http.Get("${config.apiUrl}/posts?_limit=5")
	if err != nil {
		panic(err)
	}
	defer resp.Body.Close()

	body, _ := io.ReadAll(resp.Body)
	fmt.Println(string(body))
}`,

    swift: `import Foundation

let url = URL(string: "${config.apiUrl}/posts?_limit=5")!
let task = URLSession.shared.dataTask(with: url) { data, response, error in
    if let data = data, let json = String(data: data, encoding: .utf8) {
        print("Response:", json)
    }
}
task.resume()`,

    rust: `use reqwest;

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    let resp = reqwest::get("${config.apiUrl}/posts?_limit=5")
        .await?
        .text()
        .await?;
    println!("{:#?}", resp);
    Ok(())
}`,

    curl: `# Fetch paginated posts
curl -X GET "${config.apiUrl}/posts?_limit=5"

# Create a new sandboxed post
curl -X POST "${config.apiUrl}/posts" \\
  -H "Content-Type: application/json" \\
  -d '{"title": "New Prototype Article", "user_id": 1}'`,
  };

  const currentSnippet = snippets[activeLang];

  const handleCopy = () => {
    navigator.clipboard.writeText(currentSnippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="py-20 bg-bg-primary border-b border-border-theme">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <h2 className="text-3xl font-extrabold text-text-primary tracking-tight">
            Quickstart Integration Snippets
          </h2>
          <p className="text-sm text-text-secondary">
            Copy and paste integration code in Fetch, Axios, Python, Go, Swift, Rust, or cURL.
          </p>
        </div>

        <div className="max-w-4xl mx-auto rounded-2xl border border-border-theme overflow-hidden bg-code-bg shadow-2xl">
          {/* Tabs Header */}
          <div className="flex items-center justify-between bg-bg-tertiary px-4 py-2 border-b border-border-theme overflow-x-auto">
            <div className="flex items-center gap-1">
              {languages.map((lang) => (
                <button
                  key={lang.id}
                  onClick={() => setActiveLang(lang.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer shrink-0 ${
                    activeLang === lang.id
                      ? 'bg-accent-primary text-white font-bold shadow-xs'
                      : 'text-text-secondary hover:text-text-primary hover:bg-bg-secondary'
                  }`}
                >
                  <Icon icon={lang.icon} className="w-4 h-4" />
                  {lang.name}
                </button>
              ))}
            </div>

            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-bg-secondary hover:bg-border-theme text-text-primary text-xs font-semibold transition-colors cursor-pointer ml-2 shrink-0"
            >
              <Icon icon={copied ? 'ph:check-bold' : 'ph:copy-bold'} className="w-3.5 h-3.5" />
              <span>{copied ? 'Copied!' : 'Copy'}</span>
            </button>
          </div>

          {/* Snippet Code Body */}
          <CodeBlock
            code={currentSnippet}
            copyable={false}
            showHeader={false}
            className="border-0 bg-transparent rounded-none shadow-none"
            codeClassName="p-6 text-xs leading-relaxed"
          />
        </div>
      </div>
    </section>
  );
}
