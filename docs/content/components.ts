import type { PropDoc } from '../site/PropsTable';

export interface ExampleRef {
  file: string;
  title: string;
  description?: string;
  bleed?: boolean;
}

export interface ComponentDoc {
  slug: string;
  title: string;
  group: 'Foundations' | 'Forms' | 'Feedback' | 'Overlays' | 'Navigation' | 'Data display';
  description: string;
  import: string;
  examples: ExampleRef[];
  props?: { title?: string; props: PropDoc[] }[];
  guidelines?: string[];
}

const className: PropDoc = {
  name: 'className',
  type: 'string',
  description: 'Extra classes, merged with tailwind-merge so yours win.',
};

export const componentDocs: ComponentDoc[] = [
  // ───────────────────────── Foundations
  {
    slug: 'button',
    title: 'Button',
    group: 'Foundations',
    description: 'Triggers an action. Six variants map to clear intent levels — use one primary action per view.',
    import: "import { Button, IconButton } from 'focus-ui';",
    examples: [
      {
        file: 'button/Variants',
        title: 'Variants',
        description: 'primary for the main action, secondary for most others, tinted for emphasis without dominance.',
      },
      {
        file: 'button/Sizes',
        title: 'Sizes',
        description: 'md is the default for app UIs; lg suits touch-first screens and marketing pages.',
      },
      { file: 'button/WithIcons', title: 'With icons', description: 'Pass any icon — Lucide, Heroicons, SF Symbols exports…' },
      {
        file: 'button/Loading',
        title: 'Loading & disabled',
        description: 'loading disables the button and shows an activity indicator.',
      },
      {
        file: 'button/IconButtons',
        title: 'Icon buttons',
        description: 'A label is required and is used for aria-label and the native tooltip.',
      },
    ],
    props: [
      {
        title: 'Button',
        props: [
          {
            name: 'variant',
            type: "'primary' | 'secondary' | 'tinted' | 'plain' | 'destructive' | 'destructive-tinted'",
            default: "'secondary'",
            description: 'Visual style / intent.',
          },
          { name: 'size', type: "'xs' | 'sm' | 'md' | 'lg'", default: "'md'", description: 'Height and padding.' },
          { name: 'loading', type: 'boolean', default: 'false', description: 'Show a spinner and disable interaction.' },
          { name: 'leadingIcon', type: 'ReactNode', description: 'Icon before the label.' },
          { name: 'trailingIcon', type: 'ReactNode', description: 'Icon after the label.' },
          { name: 'fullWidth', type: 'boolean', default: 'false', description: 'Stretch to the container width.' },
          {
            name: '...props',
            type: 'ButtonHTMLAttributes',
            description: 'All native button attributes. type defaults to "button".',
          },
        ],
      },
      {
        title: 'IconButton',
        props: [
          { name: 'label', type: 'string', description: 'Required. Accessible name and tooltip.' },
          { name: 'icon', type: 'ReactNode', description: 'The icon to render.' },
          {
            name: 'variant',
            type: "ButtonVariant | 'ghost'",
            default: "'ghost'",
            description: 'Ghost is borderless, ideal for toolbars and table rows.',
          },
          { name: 'size', type: "'xs' | 'sm' | 'md' | 'lg'", default: "'md'", description: 'Square size.' },
          { name: 'shape', type: "'rounded' | 'circle'", default: "'rounded'", description: 'Corner style.' },
        ],
      },
    ],
    guidelines: [
      'Use verbs for labels: “Create invoice”, not “Invoice”.',
      'Keep a single primary button per surface; group the rest as secondary or inside a menu.',
      'Destructive actions should be confirmed with ConfirmDialog.',
    ],
  },
  {
    slug: 'badge',
    title: 'Badge',
    group: 'Foundations',
    description: 'Compact status label. The dot variant is the recommended way to show document states (orders, invoices, POs).',
    import: "import { Badge } from 'focus-ui';",
    examples: [
      { file: 'badge/Tones', title: 'Tones' },
      { file: 'badge/Variants', title: 'Solid & outline' },
      {
        file: 'badge/OrderStatus',
        title: 'Document status',
        description: 'A consistent mapping from workflow state to tone helps users scan long lists.',
      },
    ],
    props: [
      {
        props: [
          {
            name: 'tone',
            type: "'neutral' | 'accent' | 'success' | 'warning' | 'danger' | 'info'",
            default: "'neutral'",
            description: 'Semantic color.',
          },
          { name: 'variant', type: "'soft' | 'solid' | 'outline'", default: "'soft'", description: 'Fill style.' },
          { name: 'size', type: "'sm' | 'md'", default: "'md'", description: 'Height.' },
          { name: 'dot', type: 'boolean', default: 'false', description: 'Leading status dot.' },
          { name: 'icon', type: 'ReactNode', description: 'Leading icon.' },
        ],
      },
    ],
  },
  {
    slug: 'avatar',
    title: 'Avatar',
    group: 'Foundations',
    description:
      'Represents a person or organization. Falls back to initials on a deterministic gradient when no image is available.',
    import: "import { Avatar, AvatarGroup } from 'focus-ui';",
    examples: [
      { file: 'avatar/Basic', title: 'Sizes, status & shape' },
      { file: 'avatar/Group', title: 'Group' },
    ],
    props: [
      {
        title: 'Avatar',
        props: [
          { name: 'name', type: 'string', description: 'Used for initials, gradient and aria-label.' },
          { name: 'src', type: 'string', description: 'Image URL. Falls back to initials on error.' },
          { name: 'size', type: "'xs' | 'sm' | 'md' | 'lg' | 'xl'", default: "'md'", description: '24 → 64px.' },
          { name: 'shape', type: "'circle' | 'rounded'", default: "'circle'", description: 'Use rounded for companies.' },
          { name: 'status', type: "'online' | 'away' | 'busy' | 'offline'", description: 'Presence indicator.' },
        ],
      },
      {
        title: 'AvatarGroup',
        props: [
          { name: 'max', type: 'number', default: '4', description: 'Avatars shown before “+N”.' },
          { name: 'size', type: 'AvatarSize', default: "'sm'", description: 'Applied to every child.' },
        ],
      },
    ],
  },
  {
    slug: 'card',
    title: 'Card',
    group: 'Foundations',
    description: 'The base surface for grouping content. Compose with CardHeader, CardContent and CardFooter.',
    import: "import { Card, CardHeader, CardContent, CardFooter } from 'focus-ui';",
    examples: [
      { file: 'card/Basic', title: 'Composition' },
      { file: 'card/Variants', title: 'Variants', bleed: true },
    ],
    props: [
      {
        title: 'Card',
        props: [
          { name: 'variant', type: "'elevated' | 'outline' | 'flat'", default: "'elevated'", description: 'Surface style.' },
          {
            name: 'padding',
            type: "'none' | 'sm' | 'md' | 'lg'",
            default: "'none'",
            description: 'Inner padding. Use none with CardHeader/Content.',
          },
          { name: 'interactive', type: 'boolean', default: 'false', description: 'Lift on hover for clickable cards.' },
        ],
      },
      {
        title: 'CardHeader',
        props: [
          { name: 'title', type: 'ReactNode', description: 'Heading.' },
          { name: 'description', type: 'ReactNode', description: 'Secondary text.' },
          { name: 'actions', type: 'ReactNode', description: 'Right-aligned controls.' },
        ],
      },
    ],
  },
  {
    slug: 'tag',
    title: 'Tag',
    group: 'Foundations',
    description: 'Removable chip for active filters and multi-value fields.',
    import: "import { Tag } from 'focus-ui';",
    examples: [{ file: 'tag/Filters', title: 'Active filters' }],
    props: [
      {
        props: [
          { name: 'onRemove', type: '() => void', description: 'Shows a remove button when provided.' },
          { name: 'selected', type: 'boolean', description: 'Accent styling for toggled filter chips.' },
          { name: 'icon', type: 'ReactNode', description: 'Leading icon.' },
        ],
      },
    ],
  },
  {
    slug: 'loading',
    title: 'Spinner, Skeleton & Kbd',
    group: 'Foundations',
    description: 'Small building blocks: an Apple-style activity indicator, shimmering skeletons, keyboard keys and dividers.',
    import: "import { Spinner, Skeleton, Kbd, Divider } from 'focus-ui';",
    examples: [
      { file: 'loading/Spinners', title: 'Spinner' },
      { file: 'loading/Skeletons', title: 'Skeleton' },
      { file: 'loading/Kbd', title: 'Kbd & Divider' },
    ],
    props: [
      {
        title: 'Spinner',
        props: [
          { name: 'size', type: "'xs' | 'sm' | 'md' | 'lg'", default: "'md'", description: 'Diameter.' },
          { name: 'label', type: 'string', default: "'Loading'", description: 'Screen reader text.' },
        ],
      },
      {
        title: 'Skeleton',
        props: [
          { name: 'lines', type: 'number', description: 'Render N text lines.' },
          { name: 'circle', type: 'boolean', description: 'Round shape (avatars).' },
          className,
        ],
      },
      {
        title: 'Divider',
        props: [
          { name: 'orientation', type: "'horizontal' | 'vertical'", default: "'horizontal'", description: 'Direction.' },
          { name: 'label', type: 'ReactNode', description: 'Centered label.' },
        ],
      },
    ],
  },

  // ───────────────────────── Forms
  {
    slug: 'input',
    title: 'Input & Field',
    group: 'Forms',
    description:
      'Field provides the label, helper text and error message, and wires ids and ARIA attributes to any control inside it automatically.',
    import: "import { Field, Input, Textarea } from 'focus-ui';",
    examples: [
      {
        file: 'input/Basic',
        title: 'Input',
        description: 'Prefix and suffix slots for icons, currencies and units. numeric right-aligns with tabular figures.',
      },
      { file: 'input/FieldValidation', title: 'Field & validation' },
      {
        file: 'input/HorizontalForm',
        title: 'Horizontal layout',
        description: 'Labels on the left from the sm breakpoint — dense, scannable ERP forms.',
      },
    ],
    props: [
      {
        title: 'Field',
        props: [
          { name: 'label', type: 'ReactNode', description: 'Label linked to the control.' },
          { name: 'description', type: 'ReactNode', description: 'Helper text (hidden while an error is shown).' },
          { name: 'error', type: 'ReactNode', description: 'Error message. Marks the control aria-invalid.' },
          { name: 'required', type: 'boolean', description: 'Shows an asterisk and sets required on the control.' },
          { name: 'disabled', type: 'boolean', description: 'Disables the control.' },
          { name: 'labelAside', type: 'ReactNode', description: 'Right side of the label row (“Optional”, a link…).' },
          { name: 'orientation', type: "'vertical' | 'horizontal'", default: "'vertical'", description: 'Label placement.' },
        ],
      },
      {
        title: 'Input',
        props: [
          { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", description: 'Control height.' },
          { name: 'prefix', type: 'ReactNode', description: 'Content before the value.' },
          { name: 'suffix', type: 'ReactNode', description: 'Content after the value.' },
          { name: 'numeric', type: 'boolean', description: 'Right-aligned tabular numbers.' },
          { name: 'invalid', type: 'boolean', description: 'Error styling (automatic inside a Field with error).' },
          { name: 'wrapperClassName', type: 'string', description: 'Classes for the wrapper when prefix/suffix are used.' },
        ],
      },
      {
        title: 'Textarea',
        props: [
          { name: 'autoResize', type: 'boolean', description: 'Grow with content (CSS field-sizing).' },
          { name: 'invalid', type: 'boolean', description: 'Error styling.' },
        ],
      },
    ],
  },
  {
    slug: 'select',
    title: 'Select',
    group: 'Forms',
    description:
      'A styled native select. Native means flawless keyboard, mobile picker and screen reader behavior for short lists.',
    import: "import { Select } from 'focus-ui';",
    examples: [{ file: 'select/Basic', title: 'Select' }],
    props: [
      {
        props: [
          {
            name: 'options',
            type: '{ value: string; label: ReactNode; disabled?: boolean }[]',
            description: 'Shortcut for <option> children.',
          },
          { name: 'placeholder', type: 'string', description: 'Disabled first option.' },
          { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", description: 'Control height.' },
          { name: 'invalid', type: 'boolean', description: 'Error styling.' },
        ],
      },
    ],
    guidelines: ['Use Select for fewer than ~15 options; use Combobox for searchable lists like customers or products.'],
  },
  {
    slug: 'combobox',
    title: 'Combobox',
    group: 'Forms',
    description: 'Searchable select for large lists — customers, products, GL accounts, cost centers. Fully keyboard operable.',
    import: "import { Combobox } from 'focus-ui';",
    examples: [{ file: 'combobox/CustomerPicker', title: 'Customer picker' }],
    props: [
      {
        props: [
          {
            name: 'options',
            type: 'ComboboxOption[]',
            description: '{ value, label, description?, icon?, disabled? }. description is searchable too.',
          },
          { name: 'value / defaultValue', type: 'string | null', description: 'Selected value.' },
          { name: 'onValueChange', type: '(value: string | null) => void', description: 'Called on selection.' },
          { name: 'placeholder', type: 'string', default: "'Select…'", description: 'Shown when empty.' },
          {
            name: 'emptyText',
            type: 'ReactNode',
            default: "'No results'",
            description: 'Shown when the filter matches nothing.',
          },
          { name: 'filter', type: '(option, query) => boolean', description: 'Custom matching logic.' },
        ],
      },
    ],
  },
  {
    slug: 'checkbox',
    title: 'Checkbox',
    group: 'Forms',
    description: 'Binary choice, with indeterminate state for parent/child selections.',
    import: "import { Checkbox } from 'focus-ui';",
    examples: [
      { file: 'checkbox/Basic', title: 'Basic' },
      { file: 'checkbox/Indeterminate', title: 'Indeterminate' },
    ],
    props: [
      {
        props: [
          { name: 'label', type: 'ReactNode', description: 'Clickable label.' },
          { name: 'description', type: 'ReactNode', description: 'Secondary text under the label.' },
          { name: 'indeterminate', type: 'boolean', description: 'Mixed state.' },
          { name: 'onChange', type: '(checked: boolean, event) => void', description: 'Receives the new checked value first.' },
        ],
      },
    ],
  },
  {
    slug: 'switch',
    title: 'Switch',
    group: 'Forms',
    description: 'iOS-style toggle for settings that take effect immediately.',
    import: "import { Switch } from 'focus-ui';",
    examples: [{ file: 'switch/Settings', title: 'Settings list' }],
    props: [
      {
        props: [
          { name: 'checked / defaultChecked', type: 'boolean', description: 'Controlled / uncontrolled state.' },
          { name: 'onCheckedChange', type: '(checked: boolean) => void', description: 'Change handler.' },
          { name: 'label', type: 'ReactNode', description: 'Label text.' },
          { name: 'description', type: 'ReactNode', description: 'Helper text.' },
          { name: 'labelPosition', type: "'left' | 'right'", default: "'right'", description: 'left = settings-row layout.' },
          { name: 'size', type: "'sm' | 'md'", default: "'md'", description: 'Track size.' },
        ],
      },
    ],
    guidelines: ['Switches act immediately. Inside forms that need a Save button, prefer a Checkbox.'],
  },
  {
    slug: 'radio-group',
    title: 'Radio Group',
    group: 'Forms',
    description: 'Single choice from a short list. The cards variant suits plan, shipping or payment method selection.',
    import: "import { RadioGroup } from 'focus-ui';",
    examples: [
      { file: 'radio/Basic', title: 'Basic' },
      { file: 'radio/Cards', title: 'Cards', bleed: true },
    ],
    props: [
      {
        props: [
          { name: 'options', type: 'RadioOption[]', description: '{ value, label, description?, disabled? }' },
          { name: 'value / defaultValue', type: 'string', description: 'Selected value.' },
          { name: 'onValueChange', type: '(value: string) => void', description: 'Change handler.' },
          { name: 'variant', type: "'default' | 'cards'", default: "'default'", description: 'Visual style.' },
          { name: 'orientation', type: "'vertical' | 'horizontal'", default: "'vertical'", description: 'Layout.' },
          { name: 'label', type: 'ReactNode', description: 'Group label.' },
        ],
      },
    ],
  },
  {
    slug: 'segmented-control',
    title: 'Segmented Control',
    group: 'Forms',
    description: 'The signature macOS/iOS control for switching views, periods or filters, with a sliding selection thumb.',
    import: "import { SegmentedControl } from 'focus-ui';",
    examples: [{ file: 'segmented/Basic', title: 'Segmented control' }],
    props: [
      {
        props: [
          {
            name: 'options',
            type: '{ value: string; label: ReactNode; icon?: ReactNode; disabled?: boolean }[]',
            description: 'Segments.',
          },
          { name: 'value / defaultValue', type: 'string', description: 'Selected segment.' },
          { name: 'onValueChange', type: '(value: string) => void', description: 'Change handler.' },
          { name: 'size', type: "'sm' | 'md'", default: "'md'", description: 'Height.' },
          { name: 'fullWidth', type: 'boolean', description: 'Stretch segments evenly.' },
        ],
      },
    ],
  },
  {
    slug: 'search-field',
    title: 'Search Field',
    group: 'Forms',
    description: 'Filled search input with clear button and an optional global ⌘K shortcut.',
    import: "import { SearchField } from 'focus-ui';",
    examples: [{ file: 'search/Basic', title: 'Search field' }],
    props: [
      {
        props: [
          { name: 'value / defaultValue', type: 'string', description: 'Query.' },
          { name: 'onValueChange', type: '(value: string) => void', description: 'Called on every keystroke.' },
          { name: 'shortcut', type: 'string', description: 'Key used with ⌘/Ctrl to focus the field.' },
          { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", description: 'Height.' },
        ],
      },
    ],
  },

  // ───────────────────────── Feedback
  {
    slug: 'alert',
    title: 'Alert',
    group: 'Feedback',
    description: 'Inline, persistent message about the state of a page or record.',
    import: "import { Alert } from 'focus-ui';",
    examples: [{ file: 'alert/Tones', title: 'Tones' }],
    props: [
      {
        props: [
          {
            name: 'tone',
            type: "'info' | 'success' | 'warning' | 'danger' | 'neutral'",
            default: "'info'",
            description: 'Semantic color and icon.',
          },
          { name: 'title', type: 'ReactNode', description: 'Bold first line.' },
          { name: 'actions', type: 'ReactNode', description: 'Buttons under the message.' },
          { name: 'onDismiss', type: '() => void', description: 'Shows a close button.' },
          { name: 'icon', type: 'ReactNode | false', description: 'Override or hide the icon.' },
        ],
      },
    ],
  },
  {
    slug: 'toast',
    title: 'Toast',
    group: 'Feedback',
    description: 'Transient notifications. Wrap your app in ToastProvider once, then call toast() from anywhere.',
    import: "import { ToastProvider, useToast } from 'focus-ui';",
    examples: [{ file: 'toast/Basic', title: 'Toasts' }],
    props: [
      {
        title: 'toast(options)',
        props: [
          { name: 'title', type: 'ReactNode', description: 'Main message.' },
          { name: 'description', type: 'ReactNode', description: 'Secondary text.' },
          {
            name: 'tone',
            type: "'neutral' | 'success' | 'warning' | 'danger' | 'info'",
            default: "'neutral'",
            description: 'Icon and semantics.',
          },
          {
            name: 'duration',
            type: 'number',
            default: '5000',
            description: 'Auto-dismiss in ms. Infinity to persist. Pauses on hover.',
          },
          { name: 'action', type: '{ label: string; onClick: () => void }', description: 'Inline action, e.g. Undo.' },
        ],
      },
      {
        title: 'ToastProvider',
        props: [
          {
            name: 'position',
            type: "'bottom-right' | 'bottom-center' | 'top-right' | 'top-center'",
            default: "'bottom-right'",
            description: 'Stack position (centered on phones).',
          },
          { name: 'limit', type: 'number', default: '4', description: 'Max visible toasts.' },
        ],
      },
    ],
  },
  {
    slug: 'progress',
    title: 'Progress',
    group: 'Feedback',
    description: 'Linear bars for quotas and capacity, and activity-style rings for compact KPIs.',
    import: "import { Progress, ProgressRing } from 'focus-ui';",
    examples: [
      { file: 'progress/Bars', title: 'Progress bar' },
      { file: 'progress/Rings', title: 'Progress ring' },
    ],
    props: [
      {
        title: 'Progress',
        props: [
          { name: 'value', type: 'number', description: 'Current value.' },
          { name: 'max', type: 'number', default: '100', description: 'Maximum.' },
          { name: 'tone', type: "'accent' | 'success' | 'warning' | 'danger'", default: "'accent'", description: 'Fill color.' },
          { name: 'label', type: 'ReactNode', description: 'Label above the bar.' },
          { name: 'showValue', type: 'boolean', description: 'Show the percentage.' },
        ],
      },
      {
        title: 'ProgressRing',
        props: [
          { name: 'size', type: 'number', default: '56', description: 'Diameter in px.' },
          { name: 'thickness', type: 'number', default: '6', description: 'Stroke width.' },
          { name: 'children', type: 'ReactNode', description: 'Center content (defaults to percentage).' },
        ],
      },
    ],
  },
  {
    slug: 'empty-state',
    title: 'Empty State',
    group: 'Feedback',
    description: 'Explains why a view is empty and what to do next.',
    import: "import { EmptyState } from 'focus-ui';",
    examples: [{ file: 'empty/Basic', title: 'Empty state' }],
    props: [
      {
        props: [
          { name: 'title', type: 'ReactNode', description: 'Headline.' },
          { name: 'description', type: 'ReactNode', description: 'Explanation.' },
          { name: 'icon', type: 'ReactNode', description: 'Illustration icon.' },
          { name: 'actions', type: 'ReactNode', description: 'Call-to-action buttons.' },
        ],
      },
    ],
  },

  // ───────────────────────── Overlays
  {
    slug: 'modal',
    title: 'Modal & Confirm',
    group: 'Overlays',
    description:
      'Focused tasks that interrupt the flow. Centered on desktop, a bottom sheet on phones. Focus is trapped and restored, body scroll locked, Escape closes.',
    import: "import { Modal, ConfirmDialog } from 'focus-ui';",
    examples: [
      { file: 'modal/Basic', title: 'Form modal' },
      {
        file: 'modal/Confirm',
        title: 'Confirm dialog',
        description:
          'onConfirm may return a promise — the button shows a spinner until it resolves. Destructive dialogs focus Cancel by default.',
      },
    ],
    props: [
      {
        title: 'Modal',
        props: [
          { name: 'open', type: 'boolean', description: 'Visibility.' },
          { name: 'onClose', type: '() => void', description: 'Called on Escape, backdrop click or close button.' },
          { name: 'title', type: 'ReactNode', description: 'Dialog title (aria-labelledby).' },
          { name: 'description', type: 'ReactNode', description: 'Subtitle (aria-describedby).' },
          { name: 'footer', type: 'ReactNode', description: 'Action buttons. Stacked full width on phones.' },
          { name: 'size', type: "'sm' | 'md' | 'lg' | 'xl' | 'full'", default: "'md'", description: 'Max width.' },
          { name: 'dismissible', type: 'boolean', default: 'true', description: 'Allow backdrop / Escape to close.' },
          { name: 'initialFocus', type: 'RefObject<HTMLElement>', description: 'Element focused on open.' },
          { name: 'role', type: "'dialog' | 'alertdialog'", default: "'dialog'", description: 'ARIA role.' },
        ],
      },
      {
        title: 'ConfirmDialog',
        props: [
          { name: 'onConfirm', type: '() => void | Promise<void>', description: 'Confirm handler. Closes when it resolves.' },
          { name: 'destructive', type: 'boolean', description: 'Red confirm button; Cancel gets initial focus.' },
          { name: 'confirmLabel / cancelLabel', type: 'string', description: 'Button labels.' },
        ],
      },
    ],
  },
  {
    slug: 'sheet',
    title: 'Sheet',
    group: 'Overlays',
    description: 'Side panel for previewing or editing a record without leaving the list — a core ERP pattern.',
    import: "import { Sheet } from 'focus-ui';",
    examples: [{ file: 'sheet/RecordDetail', title: 'Record detail' }],
    props: [
      {
        props: [
          { name: 'open / onClose', type: 'boolean / () => void', description: 'Visibility control.' },
          { name: 'side', type: "'right' | 'left'", default: "'right'", description: 'Edge to slide from.' },
          { name: 'size', type: "'sm' | 'md' | 'lg' | 'xl'", default: "'md'", description: 'Max width. Full width on phones.' },
          { name: 'title / description', type: 'ReactNode', description: 'Header content.' },
          { name: 'headerActions', type: 'ReactNode', description: 'Extra header buttons.' },
          { name: 'footer', type: 'ReactNode', description: 'Sticky footer actions.' },
        ],
      },
    ],
  },
  {
    slug: 'popover',
    title: 'Popover',
    group: 'Overlays',
    description: 'Floating panel anchored to a trigger — filters, quick settings, inline forms.',
    import: "import { Popover } from 'focus-ui';",
    examples: [{ file: 'popover/Filters', title: 'Filter popover' }],
    props: [
      {
        props: [
          { name: 'trigger', type: 'ReactElement', description: 'A focusable element; receives ref, onClick and ARIA props.' },
          { name: 'children', type: 'ReactNode | ({ close }) => ReactNode', description: 'Content, or a render function.' },
          { name: 'placement', type: 'Placement', default: "'bottom-start'", description: 'Preferred side; flips when needed.' },
          {
            name: 'open / defaultOpen / onOpenChange',
            type: 'boolean / boolean / fn',
            description: 'Controlled or uncontrolled.',
          },
        ],
      },
    ],
  },
  {
    slug: 'tooltip',
    title: 'Tooltip',
    group: 'Overlays',
    description: 'Short, non-essential hint on hover and keyboard focus.',
    import: "import { Tooltip } from 'focus-ui';",
    examples: [{ file: 'tooltip/Basic', title: 'Tooltip' }],
    props: [
      {
        props: [
          { name: 'content', type: 'ReactNode', description: 'Tooltip text.' },
          { name: 'children', type: 'ReactElement', description: 'The anchor (must accept a ref).' },
          { name: 'placement', type: 'Placement', default: "'top'", description: 'Preferred side.' },
          { name: 'delay', type: 'number', default: '450', description: 'Hover delay in ms.' },
        ],
      },
    ],
  },
  {
    slug: 'dropdown-menu',
    title: 'Dropdown Menu',
    group: 'Overlays',
    description:
      'Contextual actions, with shortcuts, sections, check items and full keyboard navigation (↑ ↓ Home End Enter Esc).',
    import: "import { DropdownMenu } from 'focus-ui';",
    examples: [{ file: 'menu/RowActions', title: 'Action menus' }],
    props: [
      {
        props: [
          { name: 'trigger', type: 'ReactElement', description: 'Button that opens the menu.' },
          { name: 'items', type: 'MenuItem[]', description: "Items, { type: 'separator' } or { type: 'label', label }." },
          { name: 'placement', type: 'Placement', default: "'bottom-end'", description: 'Preferred position.' },
        ],
      },
      {
        title: 'MenuItem',
        props: [
          { name: 'label', type: 'ReactNode', description: 'Item text.' },
          { name: 'icon', type: 'ReactNode', description: 'Leading icon.' },
          { name: 'shortcut', type: 'string', description: 'Shortcut hint (display only).' },
          { name: 'description', type: 'ReactNode', description: 'Secondary line.' },
          { name: 'onSelect', type: '() => void', description: 'Selection handler.' },
          { name: 'tone', type: "'default' | 'danger'", description: 'Danger styling for destructive items.' },
          { name: 'checked', type: 'boolean', description: 'Turns the item into a check item.' },
          { name: 'disabled', type: 'boolean', description: 'Skip in navigation.' },
        ],
      },
    ],
  },

  // ───────────────────────── Navigation
  {
    slug: 'app-shell',
    title: 'App Shell',
    group: 'Navigation',
    description:
      'Responsive application frame: a translucent sidebar (collapsible to icons on desktop, a drawer on tablets and phones) and a sticky top bar.',
    import: "import { AppShell, Sidebar, SidebarSection, SidebarItem, Topbar, PageHeader } from 'focus-ui';",
    examples: [],
    props: [
      {
        title: 'AppShell',
        props: [
          { name: 'sidebar', type: 'ReactNode', description: 'Usually a <Sidebar>.' },
          { name: 'topbar', type: 'ReactNode', description: 'Usually a <Topbar>.' },
          {
            name: 'defaultCollapsed',
            type: 'boolean',
            default: 'false',
            description: 'Start with an icon-only sidebar on desktop.',
          },
        ],
      },
      {
        title: 'Sidebar',
        props: [
          { name: 'header', type: 'ReactNode', description: 'Logo / workspace switcher.' },
          { name: 'footer', type: 'ReactNode', description: 'User profile, settings.' },
        ],
      },
      {
        title: 'SidebarSection',
        props: [
          { name: 'title', type: 'ReactNode', description: 'Section heading.' },
          { name: 'collapsible', type: 'boolean', description: 'Toggle by clicking the title.' },
        ],
      },
      {
        title: 'SidebarItem',
        props: [
          { name: 'icon', type: 'ReactNode', description: 'Icon (shown alone when collapsed, with tooltip).' },
          { name: 'label', type: 'ReactNode', description: 'Text.' },
          { name: 'active', type: 'boolean', description: 'Current page.' },
          { name: 'badge', type: 'ReactNode', description: 'Count, e.g. pending approvals.' },
          {
            name: '...props',
            type: 'AnchorHTMLAttributes',
            description: 'href, onClick… Render your router link by passing href.',
          },
        ],
      },
      {
        title: 'Topbar',
        props: [
          { name: 'start', type: 'ReactNode', description: 'Left content (breadcrumbs, search).' },
          { name: 'end', type: 'ReactNode', description: 'Right content (notifications, user menu).' },
        ],
      },
      {
        title: 'PageHeader',
        props: [
          { name: 'title', type: 'ReactNode', description: 'Page title.' },
          { name: 'breadcrumbs', type: 'ReactNode', description: 'Above the title.' },
          { name: 'meta', type: 'ReactNode', description: 'Inline next to the title (status badge).' },
          { name: 'description', type: 'ReactNode', description: 'Subtitle.' },
          { name: 'actions', type: 'ReactNode', description: 'Right-aligned buttons; wrap under the title on phones.' },
        ],
      },
    ],
  },
  {
    slug: 'page-header',
    title: 'Page Header',
    group: 'Navigation',
    description: 'Title area for record and list pages with breadcrumbs, status and actions.',
    import: "import { PageHeader, Breadcrumbs } from 'focus-ui';",
    examples: [{ file: 'pageheader/Basic', title: 'Record header', bleed: true }],
  },
  {
    slug: 'tabs',
    title: 'Tabs',
    group: 'Navigation',
    description: 'Switch between related views of the same record. Arrow keys move between tabs.',
    import: "import { Tabs, TabList, Tab, TabPanel } from 'focus-ui';",
    examples: [
      { file: 'tabs/Underline', title: 'Underline', bleed: true },
      { file: 'tabs/Pill', title: 'Pill', bleed: true },
    ],
    props: [
      {
        title: 'Tabs',
        props: [
          { name: 'value / defaultValue', type: 'string', description: 'Active tab.' },
          { name: 'onValueChange', type: '(value: string) => void', description: 'Change handler.' },
          { name: 'variant', type: "'underline' | 'pill'", default: "'underline'", description: 'Visual style.' },
        ],
      },
      {
        title: 'Tab',
        props: [
          { name: 'value', type: 'string', description: 'Identifier.' },
          { name: 'count', type: 'ReactNode', description: 'Counter pill.' },
          { name: 'icon', type: 'ReactNode', description: 'Leading icon.' },
        ],
      },
      {
        title: 'TabPanel',
        props: [
          { name: 'value', type: 'string', description: 'Matching tab.' },
          { name: 'keepMounted', type: 'boolean', description: 'Preserve state when hidden.' },
        ],
      },
    ],
  },
  {
    slug: 'breadcrumbs',
    title: 'Breadcrumbs',
    group: 'Navigation',
    description: 'Shows the location within the module hierarchy. Collapses to the parent link on phones.',
    import: "import { Breadcrumbs } from 'focus-ui';",
    examples: [{ file: 'breadcrumbs/Basic', title: 'Breadcrumbs' }],
    props: [
      {
        props: [
          {
            name: 'items',
            type: '{ label: ReactNode; href?: string; onClick?: () => void }[]',
            description: 'Path, last item is the current page.',
          },
        ],
      },
    ],
  },
  {
    slug: 'pagination',
    title: 'Pagination',
    group: 'Navigation',
    description: 'Page navigation with range summary and page-size selector. Use with server-side data.',
    import: "import { Pagination } from 'focus-ui';",
    examples: [{ file: 'pagination/Basic', title: 'Pagination', bleed: true }],
    props: [
      {
        props: [
          { name: 'page', type: 'number', description: '1-based current page.' },
          { name: 'pageSize', type: 'number', description: 'Rows per page.' },
          { name: 'total', type: 'number', description: 'Total rows.' },
          { name: 'onPageChange', type: '(page: number) => void', description: 'Page handler.' },
          { name: 'onPageSizeChange', type: '(size: number) => void', description: 'Shows the size selector when set.' },
          { name: 'pageSizeOptions', type: 'number[]', default: '[10, 25, 50, 100]', description: 'Size choices.' },
        ],
      },
    ],
  },

  // ───────────────────────── Data display
  {
    slug: 'data-table',
    title: 'Data Table',
    group: 'Data display',
    description:
      'The workhorse of ERP list views: sorting, row selection with a floating bulk-action bar, totals footer, pagination, loading skeletons, density, sticky header/column and responsive column hiding.',
    import: "import { DataTable, type DataTableColumn } from 'focus-ui';",
    examples: [
      {
        file: 'table/Orders',
        title: 'Sales orders',
        description:
          'Toolbar with filters & search, sortable columns, selection + bulk actions, totals and pagination. Select rows to see the action bar.',
        bleed: true,
      },
      {
        file: 'table/Density',
        title: 'Density, sticky column & striping',
        description: 'Compact density fits ~40% more rows. Resize the window to see columns hide.',
        bleed: true,
      },
      { file: 'table/States', title: 'Loading & empty states', bleed: true },
    ],
    props: [
      {
        title: 'DataTable',
        props: [
          { name: 'columns', type: 'DataTableColumn<T>[]', description: 'Column definitions (see below).' },
          { name: 'data', type: 'T[]', description: 'Rows.' },
          { name: 'rowKey', type: 'keyof T | (row) => Key', description: 'Unique row identifier.' },
          { name: 'density', type: "'compact' | 'regular' | 'comfortable'", default: "'regular'", description: 'Row height.' },
          { name: 'variant', type: "'card' | 'plain'", default: "'card'", description: 'Wrap in a surface or render bare.' },
          { name: 'loading', type: 'boolean', description: 'Skeleton rows.' },
          { name: 'empty', type: 'ReactNode', description: 'Empty state content.' },
          { name: 'onRowClick', type: '(row: T) => void', description: 'Row click handler.' },
          { name: 'activeRowKey', type: 'Key', description: 'Highlight a row (e.g. open in a Sheet).' },
          {
            name: 'sort / defaultSort / onSortChange',
            type: 'SortState | null',
            description: 'Sorting state ({ id, direction }).',
          },
          { name: 'manualSorting', type: 'boolean', description: 'Data is sorted server-side.' },
          { name: 'selectable', type: 'boolean', description: 'Checkbox column.' },
          { name: 'selectedKeys / defaultSelectedKeys / onSelectionChange', type: 'Key[]', description: 'Selection state.' },
          {
            name: 'bulkActions',
            type: '(rows: T[], clear: () => void) => ReactNode',
            description: 'Floating action bar when rows are selected.',
          },
          { name: 'pageSize', type: 'number', description: 'Enable client-side pagination.' },
          { name: 'toolbar', type: 'ReactNode', description: 'Content above the table (filters, search).' },
          { name: 'maxHeight', type: 'number | string', description: 'Scroll area height; header stays sticky.' },
          { name: 'striped', type: 'boolean', description: 'Zebra rows.' },
          { name: 'caption', type: 'string', description: 'Accessible table caption.' },
        ],
      },
      {
        title: 'DataTableColumn<T>',
        props: [
          { name: 'id', type: 'string', description: 'Unique id; also the property read when no accessor is given.' },
          { name: 'header', type: 'ReactNode', description: 'Header content.' },
          { name: 'accessor', type: '(row: T) => primitive | Date', description: 'Value used for sorting and default display.' },
          { name: 'cell', type: '(row: T, index) => ReactNode', description: 'Custom renderer.' },
          { name: 'footer', type: '(rows: T[]) => ReactNode', description: 'Footer cell — totals, averages.' },
          { name: 'sortable', type: 'boolean', description: 'Click header to sort asc → desc → none.' },
          { name: 'align', type: "'left' | 'center' | 'right'", description: 'Right also enables tabular numbers.' },
          { name: 'width', type: 'number | string', description: 'Column width.' },
          { name: 'hideBelow', type: "'sm' | 'md' | 'lg' | 'xl'", description: 'Hide on smaller screens.' },
          { name: 'sticky', type: 'boolean', description: 'Pin while scrolling horizontally.' },
        ],
      },
    ],
    guidelines: [
      'Right-align numbers and amounts; keep currency formatting consistent with formatCurrency().',
      'Use hideBelow on secondary columns so the table stays readable on tablets and phones.',
      'For datasets above a few thousand rows, paginate on the server and use <Pagination> with manualSorting.',
    ],
  },
  {
    slug: 'stat-card',
    title: 'Stat Card',
    group: 'Data display',
    description:
      'KPI tile with period-over-period change and a sparkline. invertDelta flips colors for metrics where lower is better.',
    import: "import { StatCard, Sparkline } from 'focus-ui';",
    examples: [{ file: 'stat/Kpis', title: 'KPI row', bleed: true }],
    props: [
      {
        props: [
          { name: 'label', type: 'ReactNode', description: 'Metric name.' },
          { name: 'value', type: 'ReactNode', description: 'Formatted value.' },
          { name: 'delta', type: 'number', description: 'Relative change (0.12 = +12%).' },
          { name: 'deltaLabel', type: 'ReactNode', description: 'Comparison period.' },
          { name: 'invertDelta', type: 'boolean', description: 'A decrease is good (costs, DSO).' },
          { name: 'trend', type: 'number[]', description: 'Sparkline values.' },
          { name: 'icon', type: 'ReactNode', description: 'Top-right icon.' },
          { name: 'footer', type: 'ReactNode', description: 'Footnote.' },
        ],
      },
    ],
  },
  {
    slug: 'description-list',
    title: 'Description List',
    group: 'Data display',
    description: 'Read-only key/value pairs for record details.',
    import: "import { DescriptionList } from 'focus-ui';",
    examples: [
      { file: 'description/Inline', title: 'Inline' },
      { file: 'description/Grid', title: 'Grid', bleed: true },
    ],
    props: [
      {
        props: [
          { name: 'items', type: '{ term: ReactNode; description: ReactNode; fullWidth?: boolean }[]', description: 'Entries.' },
          {
            name: 'layout',
            type: "'inline' | 'grid'",
            default: "'inline'",
            description: 'Rows with dividers, or a column grid.',
          },
          { name: 'columns', type: '1 | 2 | 3', default: '2', description: 'Grid columns (responsive).' },
        ],
      },
    ],
  },
  {
    slug: 'stepper',
    title: 'Stepper',
    group: 'Data display',
    description: 'Shows progress through a workflow — document lifecycle, approval chain, wizard.',
    import: "import { Stepper } from 'focus-ui';",
    examples: [
      { file: 'stepper/Horizontal', title: 'Order lifecycle', bleed: true },
      { file: 'stepper/Vertical', title: 'Approval chain (with error)' },
    ],
    props: [
      {
        props: [
          { name: 'steps', type: '{ label: ReactNode; description?: ReactNode }[]', description: 'Steps.' },
          { name: 'current', type: 'number', description: '0-based current step; earlier steps are complete.' },
          {
            name: 'orientation',
            type: "'horizontal' | 'vertical'",
            default: "'horizontal'",
            description: 'Horizontal stacks vertically on phones.',
          },
          { name: 'error', type: 'boolean', description: 'Current step failed.' },
        ],
      },
    ],
  },
  {
    slug: 'timeline',
    title: 'Timeline',
    group: 'Data display',
    description: 'Chronological activity — audit trails, comments and status changes on a record.',
    import: "import { Timeline } from 'focus-ui';",
    examples: [{ file: 'timeline/Activity', title: 'Activity' }],
    props: [
      {
        props: [{ name: 'items', type: 'TimelineItem[]', description: '{ title, description?, time?, icon?, tone? }' }],
      },
    ],
  },
];

export const groups = ['Foundations', 'Forms', 'Feedback', 'Overlays', 'Navigation', 'Data display'] as const;
