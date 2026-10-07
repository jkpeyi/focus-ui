import { ProgressRing } from '@jkpeyi/focus-ui';

export default function Example() {
  return (
    <>
      <ProgressRing value={72} />
      <ProgressRing value={45} tone="success" size={72} thickness={8} />
      <ProgressRing value={88} tone="warning" size={88} thickness={10}>
        <span className="flex flex-col items-center leading-tight">
          <span className="text-base font-semibold">88%</span>
          <span className="text-[10px] font-normal text-fg-muted">OTIF</span>
        </span>
      </ProgressRing>
    </>
  );
}
