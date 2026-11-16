interface HeaderLeftProps {
  onToggleMobileSidebar: () => void;
}

export default function HeaderLeft({ onToggleMobileSidebar }: HeaderLeftProps) {
  return (
    <div className="flex items-center gap-3">
      <button
        type="button"
        onClick={onToggleMobileSidebar}
        className="rounded-md p-2 text-gray-600 hover:bg-gray-100 md:hidden"
        aria-label="Toggle navigation"
      >
        <svg
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
      </button>
      <div className="flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-700 font-bold text-white">
          K
        </div>
        <span className="text-xl font-bold tracking-tight text-emerald-800">
          Kootukudil
        </span>
      </div>
    </div>
  );
}
