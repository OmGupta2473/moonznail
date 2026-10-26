"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { updateFulfilment } from "@/app/actions/orders";
import type { FulfilmentStatus } from "@/lib/orders/types";

interface OrderActionsProps {
  orderId: string;
  currentFulfilment: FulfilmentStatus;
}

export function OrderActions({ orderId, currentFulfilment }: OrderActionsProps) {
  const [status, setStatus] = useState<"processing" | "shipped" | "delivered" | "cancelled" | "">("");
  const [trackingNumber, setTrackingNumber] = useState("");
  const [confirmMessage, setConfirmMessage] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [result, setResult] = useState<{ ok: boolean; message: string } | null>(null);

  const getAllowedActions = (): string[] => {
    const allowed: Record<string, string[]> = {
      unfulfilled: ["processing"],
      processing: ["shipped", "cancelled"],
      shipped: ["delivered", "cancelled"],
      delivered: ["cancelled"],
    };
    return allowed[currentFulfilment] ?? [];
  };

  const handleUpdate = async () => {
    if (!status) return;

    setIsUpdating(true);
    setResult(null);

    const tracking = status === "shipped" ? trackingNumber : undefined;
    const res = await updateFulfilment(orderId, status, tracking);

    setIsUpdating(false);

    if (res.ok) {
      setResult({ ok: true, message: "Order updated successfully." });
      setStatus("");
      setTrackingNumber("");
      setConfirmMessage(null);
    } else {
      setResult({ ok: false, message: res.message });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Order Actions</CardTitle>
      </CardHeader>
      <CardContent>
        {!confirmMessage ? (
          <>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-mn-ink mb-1">Fulfilment Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as typeof status)}
                  className="h-12 w-full rounded-xl border border-mn-border-strong bg-mn-canvas px-4 text-base"
                  disabled={isUpdating}
                >
                  <option value="">Select status</option>
                  {getAllowedActions().map((s) => (
                    <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                  ))}
                </select>
              </div>

              {status === "shipped" && (
                <div className="space-y-2">
                  <Input
                    id="tracking"
                    label="Tracking Number"
                    value={trackingNumber}
                    onChange={(e) => setTrackingNumber(e.target.value)}
                    disabled={isUpdating}
                  />
                </div>
              )}

              <Button
                onClick={handleUpdate}
                disabled={!status || isUpdating}
                className="w-full"
              >
                {isUpdating ? "Updating..." : `Update to ${status?.charAt(0).toUpperCase() + status?.slice(1)}`}
              </Button>
            </div>
          </>
        ) : (
          <div className="space-y-2">
            <p className="text-sm text-mn-ink-soft">{confirmMessage}</p>
            <Button
              onClick={() => setConfirmMessage(null)}
              variant="secondary"
              className="w-full"
            >
              Cancel
            </Button>
          </div>
        )}

        {result && (
          <p
            className={`mt-4 text-sm ${
              result.ok ? "text-mn-green-600" : "text-mn-error"
            }`}
          >
            {result.message}
          </p>
        )}
      </CardContent>
    </Card>
  );
}