'use client';

import React from 'react';
import { EndpointDef } from '@/config/api-catalog';
import { CodeBlock } from '@/components/ui/CodeBlock';
import config from '@/config/env';

interface CodeGeneratorsProps {
  endpoint: EndpointDef;
}

export function CodeGenerators({ endpoint }: CodeGeneratorsProps) {
  const fullUrl = `${config.apiUrl}${endpoint.path}`;
  const hasBody = ['POST', 'PUT', 'PATCH'].includes(endpoint.method) && endpoint.requestBody;
  const bodyStr = hasBody ? JSON.stringify(endpoint.requestBody, null, 2) : '';

  const snippets: Record<string, string> = {
    javascript: `fetch('${fullUrl}', {
  method: '${endpoint.method}',
  headers: { 'Content-Type': 'application/json' }${
    hasBody ? `,\n  body: JSON.stringify(${bodyStr})` : ''
  }
})
  .then(res => res.json())
  .then(data => console.log(data));`,

    axios: `import axios from 'axios';

axios.${endpoint.method.toLowerCase()}('${fullUrl}'${
      hasBody ? `, ${bodyStr}` : ''
    })
  .then(response => console.log(response.data))
  .catch(error => console.error(error));`,

    curl: `curl -X ${endpoint.method} "${fullUrl}" \\
  -H "Content-Type: application/json"${
    hasBody ? ` \\\n  -d '${JSON.stringify(endpoint.requestBody)}'` : ''
  }`,

    python: `import requests

url = "${fullUrl}"
response = requests.${endpoint.method.toLowerCase()}(url${
      hasBody ? `, json=${JSON.stringify(endpoint.requestBody)}` : ''
    })
print(response.json())`,

    go: `package main

import (
\t"fmt"
\t"io"
\t"net/http"${hasBody ? '\n\t"strings"' : ''}
)

func main() {
\treq, _ := http.NewRequest("${endpoint.method}", "${fullUrl}", ${
      hasBody ? `strings.NewReader(\`${bodyStr}\`)` : 'nil'
    })
\treq.Header.Set("Content-Type", "application/json")
\tresp, err := http.DefaultClient.Do(req)
\tif err != nil {
\t\tpanic(err)
\t}
\tdefer resp.Body.Close()
\tbody, _ := io.ReadAll(resp.Body)
\tfmt.Println(string(body))
}`,

    swift: `import Foundation

var request = URLRequest(url: URL(string: "${fullUrl}")!)
request.httpMethod = "${endpoint.method}"
request.setValue("application/json", forHTTPHeaderField: "Content-Type")${
      hasBody
        ? `\nrequest.httpBody = """\n${bodyStr}\n""".data(using: .utf8)`
        : ''
    }
let task = URLSession.shared.dataTask(with: request) { data, response, error in
    if let data = data, let str = String(data: data, encoding: .utf8) {
        print(str)
    }
}
task.resume()`,

    kotlin: `import okhttp3.*

val client = OkHttpClient()
val request = Request.Builder()
    .url("${fullUrl}")
    .method("${endpoint.method}", ${
      hasBody
        ? `RequestBody.create(MediaType.parse("application/json"), """${bodyStr}""")`
        : `null`
    })
    .build()

client.newCall(request).execute().use { response ->
    println(response.body()?.string())
}`,

    rust: `use reqwest;

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    let client = reqwest::Client::new();
    let res = client.${endpoint.method.toLowerCase()}("${fullUrl}")
        .header("Content-Type", "application/json")${
          hasBody ? `\n        .body(r#"${bodyStr}"#)` : ''
        }
        .send()
        .await?
        .text()
        .await?;
    println!("{}", res);
    Ok(())
}`,

    php: `<?php
$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, "${fullUrl}");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "${endpoint.method}");
curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);${
      hasBody
        ? `\ncurl_setopt($ch, CURLOPT_POSTFIELDS, '${JSON.stringify(endpoint.requestBody)}');`
        : ''
    }
$response = curl_exec($ch);
curl_close($ch);
echo $response;`,
  };

  return <CodeBlock snippets={snippets} defaultTab="javascript" maxHeight="max-h-72" />;
}
