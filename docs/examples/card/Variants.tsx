import { Card } from '@jkpeyi/focus-ui';

export default function Example() {
  return (
    <div className="grid w-full gap-4 sm:grid-cols-3">
      {(['elevated', 'outline', 'flat'] as const).map((variant) => (
        <Card key={variant} variant={variant} padding="md" interactive={variant === 'elevated'}>
          <div className="text-sm font-semibold capitalize">{variant}</div>
          <p className="mt-1 text-[13px] text-fg-muted">
            {variant === 'elevated'
              ? 'Soft shadow. Hover me — interactive.'
              : variant === 'outline'
                ? 'Hairline border.'
                : 'Subtle fill, no border.'}
          </p>
        </Card>
      ))}
    </div>
  );
}
