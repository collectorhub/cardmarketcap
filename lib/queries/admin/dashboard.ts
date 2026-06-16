"use server";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

async function readJsonSafe(res: Response) {
  const text = await res.text();

  try {
    return JSON.parse(text);
  } catch {
    return {
      success: false,
      message: text || `Invalid JSON response. HTTP ${res.status}`,
    };
  }
}

export async function getAdminDashboard() {
  if (!API_BASE) {
    return {
      success: false,
      message: "Missing NEXT_PUBLIC_API_BASE_URL.",
      metrics: null,
      engagement: null,
      qa: null,
      activities: [],
    };
  }

  try {
    const res = await fetch(`${API_BASE}/admin_dashboard.php`, {
      cache: "no-store",
    });

    const data = await readJsonSafe(res);

    if (!res.ok) {
      return {
        success: false,
        message: data.message || `Backend error. HTTP ${res.status}`,
        metrics: null,
        engagement: null,
        qa: null,
        activities: [],
      };
    }

    return {
      success: Boolean(data.success),
      message: data.message || "",
      metrics: data.metrics || null,
      engagement: data.engagement || null,
      qa: data.qa || null,
      activities: Array.isArray(data.activities) ? data.activities : [],
      refreshedAt: data.refreshedAt || null,
    };
  } catch (error) {
    console.error("getAdminDashboard error:", error);

    return {
      success: false,
      message: "Failed to fetch admin dashboard.",
      metrics: null,
      engagement: null,
      qa: null,
      activities: [],
    };
  }
}