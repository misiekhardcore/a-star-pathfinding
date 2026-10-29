import type { ReactNode } from 'react';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@konopskidev/ui/components/card';
import { cn } from '@konopskidev/ui/lib/utils';

interface PanelProps {
  title: string;
  description?: string;
  /** Optional control rendered on the right side of the panel header. */
  action?: ReactNode;
  children: ReactNode;
  className?: string;
  contentClassName?: string;
}

/**
 * A titled card that groups related controls.
 *
 * The title is exposed as a level-2 heading so the page keeps a document
 * outline under the header's `h1`.
 */
export function Panel({
  title,
  description,
  action,
  children,
  className,
  contentClassName,
}: PanelProps) {
  return (
    <Card className={className}>
      <CardHeader className="flex-row items-start justify-between gap-3">
        <div className="flex min-w-0 flex-col gap-2">
          <CardTitle role="heading" aria-level={2}>
            {title}
          </CardTitle>
          {description ? <CardDescription>{description}</CardDescription> : null}
        </div>
        {action ? <div className="shrink-0">{action}</div> : null}
      </CardHeader>
      <CardContent className={cn('flex flex-col gap-4', contentClassName)}>{children}</CardContent>
    </Card>
  );
}
