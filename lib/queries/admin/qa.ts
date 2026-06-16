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

export async function getAdminQAReport() {
  if (!API_BASE) {
    return {
      success: false,
      message: "Missing NEXT_PUBLIC_API_BASE_URL.",
      metrics: [],
      issues: [],
    };
  }

  try {
    const res = await fetch(`${API_BASE}/admin_qa_reporting.php`, {
      cache: "no-store",
    });

    const data = await readJsonSafe(res);

    if (!res.ok) {
      return {
        success: false,
        message: data.message || `Backend error. HTTP ${res.status}`,
        metrics: [],
        issues: [],
      };
    }

    return {
      success: Boolean(data.success),
      message: data.message || "",
      metrics: Array.isArray(data.metrics) ? data.metrics : [],
      issues: Array.isArray(data.issues) ? data.issues : [],
      refreshedAt: data.refreshedAt || null,
    };
  } catch (error) {
    console.error("getAdminQAReport error:", error);

    return {
      success: false,
      message: "Failed to fetch QA report.",
      metrics: [],
      issues: [],
    };
  }
}