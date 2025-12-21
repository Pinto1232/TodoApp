'use client';

import { Button } from '../ui';

interface TodoFilterProps {
  hideCompleted: boolean;
  onToggle: () => void;
}

export function TodoFilter({ hideCompleted, onToggle }: TodoFilterProps) {
  return (
    <div className="text-right mb-4">
      <Button variant="link" onClick={onToggle} className="text-sm">
        {hideCompleted ? 'Show Completed' : 'Hide Completed'}
      </Button>
    </div>
  );
}
