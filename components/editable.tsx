import { getAdminContext } from "@/lib/auth/current-user";
import { isEditModeOn } from "@/lib/auth/edit-mode";

type EditablePathMap = {
  // Per-page editors
  "settings/site": string;
  "settings/press": string;
  "settings/programs": string;
  "settings/knowledge-tracks": string;
  "settings/faqs": string;
  "pages/home": string;
  "pages/about": string;
  "pages/faculty": string;
  "pages/results": string;
  "pages/hub": string;
  "pages/enroll": string;
  "showcase": string;
  "media": string;
  "blog": string;
  // Locations are dynamic — the slug goes in the field
  "locations": string;
};

type Props = {
  /** Which admin editor to deep-link into. e.g. "pages/home" */
  scope: keyof EditablePathMap | `locations/${string}`;
  /** Optional field name; the admin editor scrolls to / highlights this. */
  field?: string;
  /** Short label shown in the edit affordance tooltip. */
  label: string;
  /** Wrapping element. Defaults to span so layouts don't break. */
  as?: "span" | "div" | "section" | "article";
  /** Optional className applied to the wrapping element. */
  className?: string;
  children: React.ReactNode;
};

function buildEditorHref(scope: string, field?: string) {
  const base = scope.startsWith("locations/")
    ? `/admin/${scope}`
    : `/admin/${scope}`;
  return field
    ? `${base}?focus=${encodeURIComponent(field)}#field-${field}`
    : base;
}

/**
 * Wraps a region of public content so an authenticated admin in edit mode
 * sees a hover outline + pencil button. The pencil deep-links to the matching
 * admin editor page with the relevant field scrolled into view.
 *
 * For non-admins (or when edit mode is off), this renders just the children
 * with zero extra DOM — no overhead on the public site.
 */
export async function Editable({
  scope,
  field,
  label,
  as: Tag = "span",
  className,
  children,
}: Props) {
  const ctx = await getAdminContext();
  const editMode = await isEditModeOn();

  if (!ctx.authenticated || !editMode) {
    if (className) {
      return <Tag className={className}>{children}</Tag>;
    }
    return <>{children}</>;
  }

  const href = buildEditorHref(scope, field);

  return (
    <Tag
      className={`editable-region ${className ?? ""}`}
      data-editable-scope={scope}
      data-editable-field={field ?? ""}
    >
      {children}
      <a
        href={href}
        className="editable-pencil"
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`Edit ${label}`}
        title={`Edit ${label}`}
      >
        <span aria-hidden="true">✎</span>
        <span className="editable-pencil-label">{label}</span>
      </a>
    </Tag>
  );
}
