import { Badge, Footer, IconButton } from '@jkpeyi/focus-ui';
import { Globe, Mail } from 'lucide-react';

export default function Example() {
  return (
    <div className="w-full overflow-hidden rounded-xl border border-line">
      <Footer
        brand="Acme Supplier Portal"
        description="Submit invoices, track payments and manage purchase orders with Acme Industries."
        columns={[
          {
            title: 'Portal',
            links: [
              { label: 'Purchase orders', href: '#' },
              { label: 'Invoices', href: '#' },
              { label: 'Payments', href: '#' },
            ],
          },
          {
            title: 'Resources',
            links: [
              { label: 'Onboarding guide', href: '#' },
              { label: 'API documentation', href: '#' },
              { label: 'Status', href: '#' },
            ],
          },
          {
            title: 'Company',
            links: [
              { label: 'About', href: '#' },
              { label: 'Supplier code of conduct', href: '#' },
              { label: 'Contact', href: '#' },
            ],
          },
        ]}
        copyright="© 2026 Acme Industries B.V."
        links={[
          { label: 'Privacy', href: '#' },
          { label: 'Terms', href: '#' },
          { label: 'Cookies', href: '#' },
        ]}
        meta={
          <>
            <Badge tone="success" dot>
              All systems operational
            </Badge>
            <IconButton label="Language" icon={<Globe />} size="sm" />
            <IconButton label="Contact support" icon={<Mail />} size="sm" />
          </>
        }
      />
    </div>
  );
}
