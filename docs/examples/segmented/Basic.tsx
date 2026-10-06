import { useState } from 'react';
import { SegmentedControl } from 'focus-ui';
import { LayoutGrid, List, Rows3 } from 'lucide-react';

export default function Example() {
  const [period, setPeriod] = useState('month');
  return (
    <div className="flex flex-col items-center gap-5">
      <SegmentedControl
        aria-label="Period"
        value={period}
        onValueChange={setPeriod}
        options={[
          { value: 'day', label: 'Day' },
          { value: 'week', label: 'Week' },
          { value: 'month', label: 'Month' },
          { value: 'quarter', label: 'Quarter' },
          { value: 'year', label: 'Year' },
        ]}
      />
      <SegmentedControl
        size="sm"
        aria-label="Layout"
        options={[
          { value: 'list', label: 'List', icon: <List /> },
          { value: 'grid', label: 'Grid', icon: <LayoutGrid /> },
          { value: 'board', label: 'Board', icon: <Rows3 /> },
        ]}
      />
      <span className="text-[13px] text-fg-muted">Selected period: {period}</span>
    </div>
  );
}
