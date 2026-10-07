import { useState } from 'react';
import { Highlight, themes } from 'prism-react-renderer';
import { cn, IconButton, useTheme } from '@jkpeyi/focus-ui';
import { Check, Copy } from 'lucide-react';

export function CodeBlock({ code, language = 'tsx', className }: { code: string; language?: string; className?: string }) {
  const { resolved } = useTheme();
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    await navigator.clipboard?.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };
  return (
    <div className={cn('group relative', className)}>
      <Highlight code={code.trimEnd()} language={language} theme={resolved === 'dark' ? themes.vsDark : themes.github}>
        {({ tokens, getLineProps, getTokenProps }) => (
          <pre className="scrollbar-thin overflow-x-auto bg-surface-2 p-4 font-mono text-[12.5px] leading-relaxed dark:bg-[#111113]">
            {tokens.map((line, i) => (
              <div key={i} {...getLineProps({ line })} style={undefined}>
                {line.map((token, key) => {
                  const props = getTokenProps({ token });
                  return <span key={key} {...props} style={{ ...props.style, backgroundColor: undefined }} />;
                })}
              </div>
            ))}
          </pre>
        )}
      </Highlight>
      <IconButton
        label={copied ? 'Copied' : 'Copy code'}
        icon={copied ? <Check /> : <Copy />}
        size="sm"
        onClick={copy}
        className="absolute top-2 right-2 bg-surface/80 opacity-0 shadow-raised backdrop-blur group-hover:opacity-100 focus-visible:opacity-100"
      />
    </div>
  );
}
