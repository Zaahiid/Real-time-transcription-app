import { Button, Tooltip } from '@heroui/react';

export default function IconButton({ label, children, ...props }) {
  return (
    <Tooltip delay={400}>
      <Button isIconOnly variant="ghost" aria-label={label} {...props}>
        {children}
      </Button>
      <Tooltip.Content>{label}</Tooltip.Content>
    </Tooltip>
  );
}
