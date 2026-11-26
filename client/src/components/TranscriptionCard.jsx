import { Card, toast } from '@heroui/react';
import { CalendarDays, Clock, Copy, Pencil } from 'lucide-react';
import { useState } from 'react';

import { formatDate, formatDuration } from '../lib/format.js';
import DeleteTranscriptionButton from './DeleteTranscriptionButton.jsx';
import IconButton from './IconButton.jsx';
import TranscriptionEditor from './TranscriptionEditor.jsx';

export default function TranscriptionCard({ transcription, onUpdate, onDelete }) {
  const { id, title, text, durationMs, createdAt } = transcription;
  const [editing, setEditing] = useState(false);

  async function save(changes) {
    try {
      await onUpdate(id, changes);
      setEditing(false);
      toast.success('Transcription updated');
    } catch (error) {
      toast.danger(error.message);
    }
  }

  async function remove() {
    try {
      await onDelete(id);
      toast.success('Transcription deleted');
    } catch (error) {
      toast.danger(error.message);
    }
  }

  function copy() {
    navigator.clipboard.writeText(text).then(
      () => toast.success('Copied to clipboard'),
      () => toast.danger('Could not copy to clipboard'),
    );
  }

  if (editing) {
    return <TranscriptionEditor transcription={transcription} onCancel={() => setEditing(false)} onSave={save} />;
  }

  return (
    <Card className="motion-safe:animate-fade-up">
      <Card.Header>
        <Card.Title className="wrap-break-word">{title}</Card.Title>
        <Card.Description className="flex flex-wrap gap-x-4 gap-y-1">
          <span className="inline-flex items-center gap-1.5">
            <CalendarDays className="size-3.5" />
            <time dateTime={createdAt}>{formatDate(createdAt)}</time>
          </span>
          {durationMs != null && (
            <span className="inline-flex items-center gap-1.5">
              <Clock className="size-3.5" />
              {formatDuration(durationMs)}
            </span>
          )}
        </Card.Description>
      </Card.Header>

      <Card.Content>
        <p className="leading-relaxed wrap-break-word whitespace-pre-wrap">{text}</p>
      </Card.Content>

      <Card.Footer className="justify-end gap-1">
        <IconButton label="Copy" size="sm" onPress={copy}>
          <Copy className="size-4" />
        </IconButton>
        <IconButton label="Edit" size="sm" onPress={() => setEditing(true)}>
          <Pencil className="size-4" />
        </IconButton>
        <DeleteTranscriptionButton onConfirm={remove} />
      </Card.Footer>
    </Card>
  );
}
