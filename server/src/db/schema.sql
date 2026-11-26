CREATE TABLE IF NOT EXISTS transcriptions (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title       TEXT NOT NULL,
  text        TEXT NOT NULL,
  duration_ms INTEGER CHECK (duration_ms >= 0),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS transcriptions_created_at_idx ON transcriptions (created_at DESC);
