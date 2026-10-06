import { forwardRef, type TextareaHTMLAttributes } from 'react';
import { cn } from '../utils/cn';
import { controlBase } from './controlStyles';
import { useFieldControlProps } from './Field';

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  invalid?: boolean;
  /** Automatically grow with content (CSS field-sizing, progressive enhancement). */
  autoResize?: boolean;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  { invalid, autoResize, className, rows = 3, ...props },
  ref,
) {
  const { invalid: _invalid, ...fieldProps } = useFieldControlProps({ ...props, invalid });
  return (
    <textarea
      ref={ref}
      rows={rows}
      {...props}
      {...fieldProps}
      className={cn(controlBase, 'min-h-16 px-3 py-2 text-sm leading-relaxed', autoResize && '[field-sizing:content]', className)}
    />
  );
});
