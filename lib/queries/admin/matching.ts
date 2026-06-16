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

export async function getAdminMatchingQueue() {
  try {
    const res = await fetch(`${API_BASE}/admin_matching_queue.php`, {
      cache: "no-store",
    });

    return await readJsonSafe(res);
  } catch {
    return {
      success: false,
      matches: [],
      summary: {
        totalPending: 0,
        unmatchedEbay: 0,
        unmatchedPriceCharting: 0,
        unmatchedPsa: 0,
      },
    };
  }
}

export async function resolveAdminMatch(payload: {
  id: string;
  action: "approve" | "reject";
  user_id?: number;
}) {
  try {
    const res = await fetch(`${API_BASE}/admin_matching_queue.php`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      cache: "no-store",
      body: JSON.stringify(payload),
    });

    return await readJsonSafe(res);
  } catch {
    return {
      success: false,
      message: "Failed to resolve match.",
    };
  }
}