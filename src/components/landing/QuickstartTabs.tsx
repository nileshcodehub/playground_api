'use client';

import React, { useState, useEffect } from 'react';
import { CodeBlock } from '@/components/ui/CodeBlock';
import config from '@/config/env';

export function QuickstartTabs() {
  const [baseUrl, setBaseUrl] = useState<string>(config.publicApiUrl || 'https://playground-api-xi.vercel.app/api/v1');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const origin = window.location.origin;
      const apiPrefix = config.apiUrl.startsWith('http')
        ? config.apiUrl
        : `${origin}${config.apiUrl.startsWith('/') ? '' : '/'}${config.apiUrl}`;
      setBaseUrl(apiPrefix);
    }
  }, []);

  const snippets: Record<string, string> = {
    javascript: `// Fetch posts using standard JavaScript fetch
const response = await fetch('${baseUrl}/posts?_limit=5');
const posts = await response.json();
console.log('Posts:', posts);

// Create a new post in your session sandbox
const createRes = await fetch('${baseUrl}/posts', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ title: 'New Prototype Article', user_id: 1 })
});
const newPost = await createRes.json();
console.log('Created post:', newPost);`,

    axios: `import axios from 'axios';

// Fetch posts using Axios
const { data: posts } = await axios.get('${baseUrl}/posts', {
  params: { _limit: 5 }
});
console.log('Fetched posts:', posts);

// Create a new post overlay
const { data: newPost } = await axios.post('${baseUrl}/posts', {
  title: 'New Prototype Article',
  user_id: 1
});
console.log('Created post:', newPost);`,

    python: `import requests

# Fetch posts
url = "${baseUrl}/posts"
response = requests.get(url, params={"_limit": 5})
posts = response.json()
print("Posts:", posts)

# Create a new sandboxed post
new_post = {"title": "New Prototype Article", "user_id": 1}
created = requests.post(url, json=new_post).json()
print("Created Post:", created)`,

    go: `package main

import (
\t"fmt"
\t"io"
\t"net/http"
)

func main() {
\tresp, err := http.Get("${baseUrl}/posts?_limit=5")
\tif err != nil {
\t\tpanic(err)
\t}
\tdefer resp.Body.Close()

\tbody, _ := io.ReadAll(resp.Body)
\tfmt.Println(string(body))
}`,

    swift: `import Foundation

let url = URL(string: "${baseUrl}/posts?_limit=5")!
let task = URLSession.shared.dataTask(with: url) { data, response, error in
    if let data = data, let json = String(data: data, encoding: .utf8) {
        print("Response:", json)
    }
}
task.resume()`,

    rust: `use reqwest;

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    let resp = reqwest::get("${baseUrl}/posts?_limit=5")
        .await?
        .text()
        .await?;
    println!("{:#?}", resp);
    Ok(())
}`,

    curl: `# Fetch paginated posts
curl -X GET "${baseUrl}/posts?_limit=5"

# Create a new sandboxed post
curl -X POST "${baseUrl}/posts" \\
  -H "Content-Type: application/json" \\
  -d '{"title": "New Prototype Article", "user_id": 1}'`,
  };

  return (
    <section className="py-20 bg-bg-primary border-b border-border-theme">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-text-primary tracking-tight">
            Quickstart Integration Snippets
          </h2>
          <p className="text-sm sm:text-base text-text-secondary leading-relaxed">
            Copy and paste integration code in Fetch, Axios, Python, Go, Swift, Rust, or cURL.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <CodeBlock
            snippets={snippets}
            defaultTab="javascript"
            maxHeight="max-h-[32rem]"
            className="shadow-xl"
          />
        </div>
      </div>
    </section>
  );
}

export default QuickstartTabs;
