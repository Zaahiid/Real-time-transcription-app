import { Button, Card, Input, Label, Spinner, TextArea, TextField } from '@heroui/react';
import { useState } from 'react';

export default function TranscriptionEditor({ transcription, onCancel, onSave }) {
  const [title, setTitle] = useState(transcription.title);
  const [text, setText] = useState(transcription.text);
  const [saving, setSaving] = useState(false);

  async function save() {
    setSaving(true);
    try {
      await onSave({ title: title.trim(), text: text.trim() });
    } finally {
      setSaving(false);
    }
  }

  return (
    <Card>
      <Card.Content className="gap-4">
        <TextField value={title} onChange={setTitle} isRequired>
          <Label>Title</Label>
          <Input variant="secondary" />
        </TextField>
        <TextField value={text} onChange={setText} isRequired>
          <Label>Transcript</Label>
          <TextArea variant="secondary" rows={5} />
        </TextField>
      </Card.Content>

      <Card.Footer className="justify-end gap-2">
        <Button size="sm" variant="tertiary" onPress={onCancel} isDisabled={saving}>
          Cancel
        </Button>
        <Button size="sm" onPress={save} isPending={saving} isDisabled={!title.trim() || !text.trim()}>
          {saving && <Spinner color="current" size="sm" />}
          Save
        </Button>
      </Card.Footer>
    </Card>
  );
}
