"use client";

import { useTransition, useState } from "react";
import { updateEnquiryStatus } from "@/app/actions/enquiries";

export function EnquiryActions({
  enquiryId,
  currentStatus,
}: {
  enquiryId: string;
  currentStatus: "new" | "replied" | "archived";
}) {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState(currentStatus);

  function change(next: "new" | "replied" | "archived") {
    setError(null);
    startTransition(async () => {
      const result = await updateEnquiryStatus(enquiryId, next);
      if (result.ok) setStatus(next);
      else setError(result.message);
    });
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      {status !== "replied" && (
        <button
          type="button"
          disabled={pending}
          onClick={() => change("replied")}
          className="rounded-full bg-mn-rose-deep px-4 py-2 text-sm text-white hover:bg-mn-rose-ink disabled:opacity-60"
        >
          Mark replied
        </button>
      )}
      {status !== "archived" && (
        <button
          type="button"
          disabled={pending}
          onClick={() => change("archived")}
          className="rounded-full border border-mn-border-strong px-4 py-2 text-sm hover:bg-mn-blush disabled:opacity-60"
        >
          Archive
        </button>
      )}
      {status !== "new" && (
        <button
          type="button"
          disabled={pending}
          onClick={() => change("new")}
          className="rounded-full border border-mn-border-strong px-4 py-2 text-sm hover:bg-mn-blush disabled:opacity-60"
        >
          Reopen
        </button>
      )}
      {error && <p className="text-sm text-mn-error">{error}</p>}
      <span className="text-xs text-mn-ink-soft">Current: {status}</span>
    </div>
  );
}