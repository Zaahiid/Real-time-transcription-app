import { cn } from '@heroui/react';
import { AudioLines } from 'lucide-react';

export default function LogoMark({ className }) {
  return (
    <span className={cn('grid size-9 place-items-center rounded-xl bg-accent text-accent-foreground', className)}>
      <AudioLines className="size-1/2" />
    </span>
  );
}
