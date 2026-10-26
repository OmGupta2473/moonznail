import { cn } from "@/lib/cn";

export function Input({
  id,
  label,
  error,
  hint,
  disabled,
  defaultValue,
  value,
  onChange,
  onBlur,
  type = "text",
}: {
  id: string;
  label: string;
  error?: string;
  hint?: string;
  disabled?: boolean;
  defaultValue?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  type?: string;
}) {
  const describedBy = error ? `${id}-error` : hint ? `${id}-hint` : undefined;

  return (
    <div className="space-y-2">
      <label htmlFor={id} className="block text-sm font-medium text-mn-ink">
        {label}
      </label>
      <input
        id={id}
        type={type}
        defaultValue={defaultValue}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        disabled={disabled}
        aria-invalid={Boolean(error)}
        aria-describedby={describedBy}
        className={cn(
          "h-12 w-full rounded-xl border bg-mn-canvas px-4 text-base text-mn-ink placeholder:text-mn-ink-soft/70",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mn-rose-ink focus-visible:ring-offset-2 focus-visible:ring-offset-mn-canvas",
          "disabled:cursor-not-allowed disabled:opacity-45",
          error ? "border-mn-error" : "border-mn-border-strong"
        )}
      />
      {hint && !error ? (
        <p id={`${id}-hint`} className="text-sm text-mn-ink-soft">
          {hint}
        </p>
      ) : null}
      {error ? (
        <p id={`${id}-error`} className="text-sm text-mn-error">
          {error}
        </p>
      ) : null}
    </div>
  );
}