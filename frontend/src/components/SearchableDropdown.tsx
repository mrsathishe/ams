import { useMemo, useState } from "react";

export interface SearchOption {
  id: string;
  label: string;
}

export default function SearchableDropdown({
  id,
  label,
  options,
  value,
  onChange,
  placeholder,
  disabled = false,
}: {
  id: string;
  label: string;
  options: SearchOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  disabled?: boolean;
}) {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const filteredOptions = useMemo(() => {
    const filter = query.trim().toLocaleLowerCase();
    return options.filter((option) =>
      option.label.toLocaleLowerCase().includes(filter),
    );
  }, [options, query]);

  return (
    <div className="relative">
      <label htmlFor={id} className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      <input
        id={id}
        role="combobox"
        aria-autocomplete="list"
        aria-expanded={isOpen}
        aria-controls={`${id}-options`}
        autoComplete="off"
        value={query}
        disabled={disabled}
        placeholder={placeholder}
        onFocus={() => setIsOpen(true)}
        onBlur={() => setIsOpen(false)}
        onChange={(event) => {
          setQuery(event.target.value);
          setIsOpen(true);
          if (value) onChange("");
        }}
        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:border-emerald-700 focus:outline-none focus:ring-1 focus:ring-emerald-700 disabled:bg-gray-100"
      />
      {isOpen && !disabled && (
        <ul
          id={`${id}-options`}
          role="listbox"
          className="absolute z-10 mt-1 max-h-48 w-full overflow-y-auto border border-gray-300 bg-white shadow-lg"
        >
          {filteredOptions.length > 0 ? (
            filteredOptions.map((option) => (
              <li key={option.id} role="option" aria-selected={value === option.id}>
                <button
                  type="button"
                  onMouseDown={(event) => event.preventDefault()}
                  onClick={() => {
                    onChange(option.id);
                    setQuery(option.label);
                    setIsOpen(false);
                  }}
                  className="w-full px-3 py-2 text-left text-sm hover:bg-emerald-50 focus:bg-emerald-50 focus:outline-none"
                >
                  {option.label}
                </button>
              </li>
            ))
          ) : (
            <li className="px-3 py-2 text-sm text-gray-500">
              No matching options
            </li>
          )}
        </ul>
      )}
    </div>
  );
}
