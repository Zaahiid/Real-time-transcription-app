import { pool } from './index.js';

const FIELDS = `
  id,
  title,
  text,
  duration_ms AS "durationMs",
  created_at  AS "createdAt",
  updated_at  AS "updatedAt"
`;

const MATCHES_SEARCH = '($1::text IS NULL OR title ILIKE $1 OR text ILIKE $1)';

export async function list({ search, limit, offset }) {
  const pattern = search ? `%${search}%` : null;

  const [page, count] = await Promise.all([
    pool.query(
      `SELECT ${FIELDS} FROM transcriptions
       WHERE ${MATCHES_SEARCH}
       ORDER BY created_at DESC
       LIMIT $2 OFFSET $3`,
      [pattern, limit, offset],
    ),
    pool.query(`SELECT count(*)::int AS total FROM transcriptions WHERE ${MATCHES_SEARCH}`, [pattern]),
  ]);

  return { items: page.rows, total: count.rows[0].total };
}

export async function find(id) {
  const { rows } = await pool.query(`SELECT ${FIELDS} FROM transcriptions WHERE id = $1`, [id]);
  return rows[0] ?? null;
}

export async function create({ title, text, durationMs = null }) {
  const { rows } = await pool.query(
    `INSERT INTO transcriptions (title, text, duration_ms)
     VALUES ($1, $2, $3)
     RETURNING ${FIELDS}`,
    [title, text, durationMs],
  );
  return rows[0];
}

export async function update(id, { title = null, text = null }) {
  const { rows } = await pool.query(
    `UPDATE transcriptions
     SET title = COALESCE($2, title),
         text = COALESCE($3, text),
         updated_at = now()
     WHERE id = $1
     RETURNING ${FIELDS}`,
    [id, title, text],
  );
  return rows[0] ?? null;
}

export async function remove(id) {
  const { rowCount } = await pool.query('DELETE FROM transcriptions WHERE id = $1', [id]);
  return rowCount > 0;
}
