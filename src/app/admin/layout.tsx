import { verifyOwner } from "@/lib/admin-auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { signOut } from "@/app/actions/auth";

const navItems = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/orders", label: "Orders" },
  { href: "/admin/enquiries", label: "Enquiries" },
  { href: "/admin/products", label: "Products" },
  { href: "/admin/collections", label: "Collections" },
  { href: "/admin/looks", label: "Looks" },
  { href: "/admin/services", label: "Services" },
];

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  try {
    await verifyOwner();
  } catch {
    redirect("/pending");
  }

  return (
    <div className="flex min-h-screen bg-mn-canvas">
      {/* Sidebar (Desktop) / Top Bar (Mobile) */}
      <aside className="fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-mn-border bg-mn-surface-3 lg:static lg:flex">
        <div className="flex h-16 items-center border-b border-mn-border px-6">
          <Link href="/admin" className="flex items-center gap-2">
            <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5 text-mn-moon" fill="none">
              <path
                d="M16 4C10 5 6 10 7 16C8 20 12 22 17 21C13 19 11 14 13 9C14 7 15 5 16 4Z"
                fill="currentColor"
              />
            </svg>
            <span className="font-display text-lg tracking-tight">Admin</span>
          </Link>
        </div>
        
        <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="block rounded-lg px-3 py-2 text-sm font-medium text-mn-ink-soft hover:bg-mn-blush hover:text-mn-ink"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="border-t border-mn-border p-4">
          <form action={signOut}>
            <button className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-mn-ink-soft hover:bg-mn-blush hover:text-mn-ink">
              <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M16 17L21 12L16 7" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M21 12H9" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Sign Out
            </button>
          </form>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 lg:pl-0">
        <div className="p-6 lg:p-10 max-w-6xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}