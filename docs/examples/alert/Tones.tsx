import { Alert, Button } from '@jkpeyi/focus-ui';

export default function Example() {
  return (
    <div className="grid w-full max-w-xl gap-3">
      <Alert tone="info" title="Fiscal year closing">
        Period 12 closes on Oct 31. Post all journal entries before then.
      </Alert>
      <Alert tone="success" title="Payment run completed">
        148 vendor payments were exported to your bank.
      </Alert>
      <Alert
        tone="warning"
        title="Credit limit almost reached"
        actions={
          <>
            <Button size="sm" variant="secondary">
              Review account
            </Button>
            <Button size="sm" variant="plain">
              Request increase
            </Button>
          </>
        }
      >
        Northwind Traders is at 92% of its $250,000 credit limit.
      </Alert>
      <Alert tone="danger" title="Sync failed" onDismiss={() => {}}>
        Bank feed for account •••4821 could not be refreshed.
      </Alert>
    </div>
  );
}
