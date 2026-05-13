import Link from "next/link";

import { EditModeToggle } from "@/components/edit-mode-toggle";
import { getAdminContext } from "@/lib/auth/current-user";
import { isEditModeOn } from "@/lib/auth/edit-mode";

/**
 * Floating pill that appears on every public page when the admin is logged
 * in. Toggles edit-mode on/off — when on, the <Editable> wrappers throughout
 * the public site light up with hover affordances.
 *
 * Renders nothing for non-admins, so the public site stays clean.
 */
export async function EditModeRibbon() {
  const ctx = await getAdminContext();
  if (!ctx.authenticated) return null;

  const editMode = await isEditModeOn();

  return (
    <div className="fixed bottom-4 right-4 z-50 flex items-center gap-2 rounded-full border border-slate-200/80 bg-white/90 px-3 py-2 shadow-[0_18px_50px_-30px_rgba(15,23,42,0.55)] backdrop-blur-xl">
      <span className="hidden text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 md:inline">
        Admin
      </span>
      <EditModeToggle initial={editMode} />
      <Link
        href="/admin"
        className="rounded-full border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-700 transition-colors hover:border-primary hover:text-primary"
      >
        Open admin
      </Link>
    </div>
  );
}
