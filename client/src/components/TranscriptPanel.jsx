import { Card, Chip } from '@heroui/react';
import { useEffect, useRef } from 'react';

export default function TranscriptPanel({ text, interim, isLive }) {
  const scroller = useRef(null);
  const isEmpty = !text && !interim;

  useEffect(() => {
    scroller.current.scrollTo({ top: scroller.current.scrollHeight, behavior: 'smooth' });
  }, [text, interim]);

  return (
    <Card className="min-h-32 w-full flex-1">
      <Card.Header className="flex-row items-center justify-between">
        <Card.Title>Transcript</Card.Title>
        {isLive && (
          <Chip color="danger" variant="soft" size="sm">
            <span className="size-1.5 rounded-full bg-current motion-safe:animate-pulse" />
            <Chip.Label>Live</Chip.Label>
          </Chip>
        )}
      </Card.Header>

      <Card.Content>
        <div ref={scroller} className="flex-1 overflow-y-auto leading-relaxed contain-size sm:text-lg">
          {isEmpty ? (
            <p className="text-muted">{isLive ? 'Listening…' : 'Your words will appear here as you speak.'}</p>
          ) : (
            <p className="wrap-break-word whitespace-pre-wrap">
              {text}
              {text && interim && ' '}
              <span className="text-muted">{interim}</span>
              {isLive && <span className="ml-0.5 inline-block h-5 w-0.5 translate-y-1 bg-accent motion-safe:animate-pulse" />}
            </p>
          )}
        </div>
      </Card.Content>
    </Card>
  );
}
