import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import prisma from './prismaClient.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function splitSqlStatements(sql) {
  const statements = [];
  let current = '';
  let inDollarQuote = false;
  let dollarTag = '';
  let inSingleQuote = false;

  let i = 0;
  while (i < sql.length) {
    const char = sql[i];

    // Handle single-quoted string literals (ignoring inside dollar quotes)
    if (char === "'" && !inDollarQuote) {
      if (inSingleQuote && sql[i + 1] === "'") {
        // Escaped single quote in SQL ('')
        current += "''";
        i += 2;
        continue;
      }
      inSingleQuote = !inSingleQuote;
      current += char;
      i++;
      continue;
    }

    // Check for dollar quotes ($$ or $tag$) when not inside a single-quoted string
    if (char === '$' && !inSingleQuote) {
      const match = sql.slice(i).match(/^(\$[a-zA-Z0-9_]*\$)/);
      if (match) {
        const tag = match[1];
        if (!inDollarQuote) {
          inDollarQuote = true;
          dollarTag = tag;
        } else if (tag === dollarTag) {
          inDollarQuote = false;
          dollarTag = '';
        }
        current += tag;
        i += tag.length;
        continue;
      }
    }

    if (char === ';' && !inDollarQuote && !inSingleQuote) {
      if (current.trim().length > 0) {
        statements.push(current.trim());
      }
      current = '';
      i++;
      continue;
    }

    current += char;
    i++;
  }

  if (current.trim().length > 0) {
    statements.push(current.trim());
  }

  return statements;
}

export async function initDb() {
  const schemaPath = path.join(__dirname, 'schema.sql');
  if (!fs.existsSync(schemaPath)) {
    throw new Error(`[Database Init] schema.sql not found at ${schemaPath}. Cannot initialize database schema.`);
  }

  const sqlContent = fs.readFileSync(schemaPath, 'utf-8');

  // Split SQL statements safely, respecting $$ ... $$ dollar-quoted blocks
  const statements = splitSqlStatements(sqlContent);

  console.log('[Database Init] Verifying DDL schema tables in database...');

  for (const statement of statements) {
    try {
      await prisma.$executeRawUnsafe(statement);
    } catch (err) {
      if (!err.message.includes('already exists') && !err.message.includes('duplicate_object')) {
        console.warn(`[Database Init Warning] ${err.message.split('\n')[0]}`);
      }
    }
  }

  console.log('[Database Init] Database ready.');
}
