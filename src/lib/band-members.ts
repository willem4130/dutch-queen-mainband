// Band line-up for the schema.org MusicGroup that Google reads (layout.tsx).
// Source: CMS profile.seo.structuredData.musicGroup.members ({ name, role }),
// which the band manages in the admin.

type CmsMember = { name?: unknown; role?: unknown };

export type MemberJsonLd = {
  "@type": "Person";
  name: string;
  roleName?: string;
};

/** CMS members → schema.org Person entries; skips entries without a name. */
export function membersJsonLd(members: unknown): MemberJsonLd[] {
  if (!Array.isArray(members)) return [];
  return members.flatMap((m: CmsMember) => {
    const name = typeof m?.name === "string" ? m.name.trim() : "";
    if (!name) return [];
    const role = typeof m?.role === "string" ? m.role.trim() : "";
    return [{ "@type": "Person" as const, name, ...(role && { roleName: role }) }];
  });
}
