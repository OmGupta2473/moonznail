import Link from "next/link";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

type EnquiryListRow = {
  id: string;
  reference_number: string;
  name: string;
  email: string | null;
  service_title: string | null;
  look_title: string | null;
  status: string;
  created_at: string;
};

export default async function AdminEnquiriesPage() {
  const supabase = await createServerSupabaseClient();
  const { data: enquiries } = await supabase
    .from("enquiries")
    .select("id, reference_number, name, email, service_title, look_title, status, created_at")
    .order("created_at", { ascending: false })
    .limit(200);

  return (
    <main id="main">
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-display text-3xl tracking-tight">Enquiries</h1>
      </div>
      {(!enquiries || enquiries.length === 0) ? (
        <p className="mt-8 text-mn-ink-soft">No enquiries yet.</p>
      ) : (
        <div className="border border-mn-border rounded-xl overflow-hidden bg-mn-canvas">
          <table className="w-full text-left text-sm">
            <thead className="bg-mn-surface-3 border-b border-mn-border">
              <tr>
                <th className="px-4 py-3 font-medium text-mn-ink-soft">Reference</th>
                <th className="px-4 py-3 font-medium text-mn-ink-soft">Name</th>
                <th className="px-4 py-3 font-medium text-mn-ink-soft">About</th>
                <th className="px-4 py-3 font-medium text-mn-ink-soft">Status</th>
                <th className="px-4 py-3 font-medium text-mn-ink-soft">Received</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-mn-border">
              {(enquiries as EnquiryListRow[]).map((e) => (
                <tr key={e.id} className="hover:bg-mn-surface-3/50">
                  <td className="px-4 py-3 font-mono text-xs">{e.reference_number}</td>
                  <td className="px-4 py-3">{e.name}</td>
                  <td className="px-4 py-3 text-mn-ink-soft">{e.service_title ?? e.look_title ?? "—"}</td>
                  <td className="px-4 py-3">{e.status}</td>
                  <td className="px-4 py-3 text-mn-ink-soft text-xs">{new Date(e.created_at).toLocaleString()}</td>
                  <td className="px-4 py-3 text-right">
                    <Link href={`/admin/enquiries/${e.id}`} className="text-mn-rose-deep underline text-xs">View</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}