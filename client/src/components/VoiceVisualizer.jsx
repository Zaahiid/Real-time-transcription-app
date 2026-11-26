import { cn } from '@heroui/react';
import { useEffect, useRef } from 'react';

const BAR_COUNT = 21;
const CENTER = Math.floor(BAR_COUNT / 2);
const LOWEST_VOICE_BIN = 1;

export default function VoiceVisualizer({ analyser }) {
  const bars = useRef([]);

  useEffect(() => {
    if (!analyser) return;

    const levels = new Uint8Array(analyser.frequencyBinCount);
    let frame;

    const draw = () => {
      analyser.getByteFrequencyData(levels);
      bars.current.forEach((bar, index) => {
        const distanceFromCenter = Math.abs(index - CENTER);
        const level = levels[LOWEST_VOICE_BIN + distanceFromCenter] / 255;
        bar?.style.setProperty('scale', `1 ${Math.max(0.12, level)}`);
      });
      frame = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(frame);
      bars.current.forEach((bar) => bar?.style.removeProperty('scale'));
    };
  }, [analyser]);

  return (
    <div aria-hidden className="flex h-10 items-center justify-center gap-1 sm:h-14 short:h-10">
      {Array.from({ length: BAR_COUNT }, (_, index) => (
        <span
          key={index}
          ref={(bar) => {
            bars.current[index] = bar;
          }}
          className={cn(
            'h-full w-1 scale-y-[0.12] rounded-full bg-accent transition-[scale,opacity] duration-100',
            analyser ? 'opacity-100' : 'opacity-25',
          )}
        />
      ))}
    </div>
  );
}
