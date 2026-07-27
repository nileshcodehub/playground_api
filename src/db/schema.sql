-- Enable pgcrypto extension for UUID generation
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Enum for overlay operations if not using text check
DO $$ BEGIN
  CREATE TYPE "OperationType" AS ENUM ('create', 'update', 'delete');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- 1. Identities table
CREATE TABLE IF NOT EXISTS "identities" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "ip_hash" TEXT,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "last_seen_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS "identities_last_seen_at_idx" ON "identities"("last_seen_at");
CREATE INDEX IF NOT EXISTS "identities_ip_hash_idx" ON "identities"("ip_hash");

-- 2. Overlay Records table
CREATE TABLE IF NOT EXISTS "overlay_records" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "identity_id" UUID NOT NULL REFERENCES "identities"("id") ON DELETE CASCADE,
  "resource" TEXT NOT NULL CHECK ("resource" IN ('users', 'posts', 'comments', 'todos')),
  "target_id" INTEGER,
  "op" "OperationType" NOT NULL,
  "data" JSONB,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "overlay_records_identity_id_resource_target_id_key" UNIQUE ("identity_id", "resource", "target_id")
);

-- 3. Global Users Table
CREATE TABLE IF NOT EXISTS "users_global" (
  "id" SERIAL PRIMARY KEY,
  "name" TEXT NOT NULL,
  "username" TEXT NOT NULL,
  "email" TEXT NOT NULL,
  "phone" TEXT,
  "website" TEXT,
  "address" JSONB,
  "company" JSONB
);

-- 4. Global Posts Table
CREATE TABLE IF NOT EXISTS "posts_global" (
  "id" SERIAL PRIMARY KEY,
  "user_id" INTEGER NOT NULL,
  "title" TEXT NOT NULL,
  "body" TEXT NOT NULL
);

-- 5. Global Comments Table
CREATE TABLE IF NOT EXISTS "comments_global" (
  "id" SERIAL PRIMARY KEY,
  "post_id" INTEGER NOT NULL,
  "name" TEXT NOT NULL,
  "email" TEXT NOT NULL,
  "body" TEXT NOT NULL
);

-- 6. Global Todos Table
CREATE TABLE IF NOT EXISTS "todos_global" (
  "id" SERIAL PRIMARY KEY,
  "user_id" INTEGER NOT NULL,
  "title" TEXT NOT NULL,
  "completed" BOOLEAN NOT NULL DEFAULT false
);
