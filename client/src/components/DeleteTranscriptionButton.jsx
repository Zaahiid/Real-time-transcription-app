import { AlertDialog, Button } from '@heroui/react';
import { Trash2 } from 'lucide-react';

import IconButton from './IconButton.jsx';

export default function DeleteTranscriptionButton({ onConfirm }) {
  return (
    <AlertDialog>
      <IconButton label="Delete" size="sm" className="text-danger">
        <Trash2 className="size-4" />
      </IconButton>

      <AlertDialog.Backdrop>
        <AlertDialog.Container>
          <AlertDialog.Dialog className="sm:max-w-100">
            <AlertDialog.Header>
              <AlertDialog.Icon status="danger" />
              <AlertDialog.Heading>Delete this transcription?</AlertDialog.Heading>
            </AlertDialog.Header>
            <AlertDialog.Body>
              <p>It will be permanently removed from your history.</p>
            </AlertDialog.Body>
            <AlertDialog.Footer>
              <Button slot="close" variant="tertiary">
                Cancel
              </Button>
              <Button slot="close" variant="danger" onPress={onConfirm}>
                Delete
              </Button>
            </AlertDialog.Footer>
          </AlertDialog.Dialog>
        </AlertDialog.Container>
      </AlertDialog.Backdrop>
    </AlertDialog>
  );
}
