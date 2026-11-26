import { Router } from 'express';
import { z } from 'zod';

import * as transcriptions from '../db/transcriptions.js';
import { HttpError } from '../lib/http-error.js';

const TITLE_WORDS = 8;

const idParams = z.object({ id: z.uuid() });

const listQuery = z.object({
  search: z.string().trim().max(200).optional(),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  offset: z.coerce.number().int().min(0).default(0),
});

const createBody = z.object({
  title: z.string().trim().min(1).max(200).optional(),
  text: z.string().trim().min(1).max(100_000),
  durationMs: z.number().int().nonnegative().optional(),
});

const updateBody = createBody
  .pick({ title: true, text: true })
  .partial()
  .refine((body) => body.title || body.text, 'Provide a title or text to update');

export const transcriptionsRouter = Router();

transcriptionsRouter.get('/', async (req, res) => {
  res.json(await transcriptions.list(listQuery.parse(req.query)));
});

transcriptionsRouter.get('/:id', async (req, res) => {
  const { id } = idParams.parse(req.params);
  res.json(orNotFound(await transcriptions.find(id)));
});

transcriptionsRouter.post('/', async (req, res) => {
  const body = createBody.parse(req.body);
  const created = await transcriptions.create({ ...body, title: body.title || titleFrom(body.text) });
  res.status(201).json(created);
});

transcriptionsRouter.patch('/:id', async (req, res) => {
  const { id } = idParams.parse(req.params);
  res.json(orNotFound(await transcriptions.update(id, updateBody.parse(req.body))));
});

transcriptionsRouter.delete('/:id', async (req, res) => {
  const { id } = idParams.parse(req.params);
  orNotFound(await transcriptions.remove(id));
  res.status(204).end();
});

function orNotFound(result) {
  if (!result) throw new HttpError(404, 'Transcription not found');
  return result;
}

function titleFrom(text) {
  const words = text.split(/\s+/);
  const title = words.slice(0, TITLE_WORDS).join(' ');
  return words.length > TITLE_WORDS ? `${title}…` : title;
}
