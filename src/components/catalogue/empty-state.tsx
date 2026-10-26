import { ButtonLink } from "@/components/ui/button-link";

export function EmptyState({
  title,
  body,
  actionHref,
  actionLabel,
}: {
  title: string;
  body?: string;
  actionHref: string;
  actionLabel: string;
}) {
  return (
    <div className="py-24 text-center">
      <h2 className="font-display text-2xl">{title}</h2>
      {body && <p className="mt-3 text-mn-ink-soft">{body}</p>}
      <div className="mt-8 flex justify-center">
        <ButtonLink href={actionHref} variant="secondary">
          {actionLabel}
        </ButtonLink>
      </div>
    </div>
  );
}