import { useEffect, useState } from 'react';

import { formatDuration } from '../lib/format.js';

export default function RecordingTimer({ startedAt }) {
  const [now, setNow] = useState(Date.now);

  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 500);
    return () => clearInterval(timer);
  }, []);

  return <span className="font-mono tabular-nums">{formatDuration(now - startedAt)}</span>;
}
