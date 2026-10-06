import { Breadcrumbs } from 'focus-ui';

export default function Example() {
  return <Breadcrumbs items={[{ label: 'Sales', href: '#' }, { label: 'Orders', href: '#' }, { label: 'SO-24180' }]} />;
}
