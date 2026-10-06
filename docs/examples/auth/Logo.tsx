// Shared brand mark for the auth samples — replace with your own logo.
export function AcmeLogo({ size = 44 }: { size?: number }) {
  return (
    <span
      className="flex items-center justify-center rounded-[28%] bg-gradient-to-br from-indigo-500 to-violet-600 text-white shadow-raised"
      style={{ width: size, height: size }}
    >
      <svg
        viewBox="0 0 24 24"
        width={size * 0.5}
        height={size * 0.5}
        fill="none"
        stroke="currentColor"
        strokeWidth={2.4}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M4 19 12 5l8 14" />
        <path d="M7.5 13.5h9" />
      </svg>
    </span>
  );
}
