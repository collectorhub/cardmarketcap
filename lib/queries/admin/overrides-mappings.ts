"use server";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

async function readJsonSafe(res: Response) {
  const text = await res.text();

  try {
    return JSON.parse(text);
  } catch {
    return { success: false, message: text || `Invalid JSON. HTTP ${res.status}` };
  }
}

export async function getAdminOverrideRules(params: {
  search?: string;
  tab?: string;
}) {
  const qs = new URLSearchParams();
  qs.set("search", params.search || "");
  qs.set("tab", params.tab || "all");

  try {
    const res = await fetch(`${API_BASE}/admin_overrides_mappings.php?${qs.toString()}`, {
      cache: "no-store",
    });

    return await readJsonSafe(res);
  } catch {
    return {
      success: false,
      rules: [],
      summary: {
        totalRules: 0,
        aliasCleanups: 0,
        globalExclusions: 0,
        frontendHelpers: 0,
      },
    };
  }
}

export async function createAdminOverrideRule(payload: any) {
  const res = await fetch(`${API_BASE}/admin_overrides_mappings.php`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    cache: "no-store",
    body: JSON.stringify(payload),
  });

  return await readJsonSafe(res);
}

export async function toggleAdminOverrideRule(id: string) {
  const res = await fetch(`${API_BASE}/admin_overrides_mappings.php`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    cache: "no-store",
    body: JSON.stringify({ id }),
  });

  return await readJsonSafe(res);
}

export async function deleteAdminOverrideRule(id: string) {
  const res = await fetch(`${API_BASE}/admin_overrides_mappings.php`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    cache: "no-store",
    body: JSON.stringify({ id }),
  });

  return await readJsonSafe(res);
}