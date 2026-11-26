import { Button, Spinner, cn } from '@heroui/react';
import { Mic, Square } from 'lucide-react';

export default function MicButton({ status, onStart, onStop }) {
  const recording = status === 'recording';
  const busy = status !== 'idle' && !recording;
  const Icon = recording ? Square : Mic;

  return (
    <div className="relative grid size-32 place-items-center sm:size-40 short:size-32">
      {recording && (
        <>
          <span className="absolute inset-[20%] rounded-full bg-danger/40 motion-safe:animate-ripple" />
          <span className="absolute inset-[20%] rounded-full bg-danger/30 motion-safe:animate-ripple [animation-delay:0.9s]" />
        </>
      )}

      <Button
        isIconOnly
        isPending={busy}
        variant={recording ? 'danger' : 'primary'}
        aria-label={recording ? 'Stop recording' : 'Start recording'}
        onPress={recording ? onStop : onStart}
        className={cn(
          'relative size-[60%] rounded-full shadow-xl transition-transform hover:scale-105',
          status === 'idle' && 'motion-safe:animate-breathe',
        )}
      >
        {busy ? (
          <Spinner color="current" />
        ) : (
          <Icon className={cn('size-[38%]', recording && 'size-[30%] fill-current')} />
        )}
      </Button>
    </div>
  );
}
