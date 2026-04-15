export default function Option({ label, active, onClick, style }) {
  return (
    <button
      type="button"
      role="option"
      aria-selected={active}
      data-active={active}
      onClick={onClick}
      style={style}
      className="df-option"
    >
      <span className="df-option-check-slot relative w-4 h-4 shrink-0">
        <svg
          className="df-option-check absolute inset-0"
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          aria-hidden
        >
          <path
            d="M3 8.5L6.5 12L13 5"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
      <span>{label}</span>
    </button>
  );
}
