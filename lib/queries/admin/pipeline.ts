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

export async function getAdminPipelineMonitor() {
  try {
    const res = await fetch(`${API_BASE}/admin_pipeline_monitor.php`, {
      cache: "no-store",
    });

    return await readJsonSafe(res);
  } catch (error) {
    console.error("getAdminPipelineMonitor error:", error);
    return {
      success: false,
      summary: {
        activeJobs: 0,
        totalProcessedToday: 0,
        failedJobsCount: 0,
        successRate: "0%",
      },
      jobs: [],
    };
  }
}

export async function triggerAdminPipelineJob(source: string) {
  try {
    const res = await fetch(`${API_BASE}/admin_pipeline_monitor.php`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      cache: "no-store",
      body: JSON.stringify({
        action: "trigger",
        source,
      }),
    });

    return await readJsonSafe(res);
  } catch (error) {
    console.error("triggerAdminPipelineJob error:", error);
    return {
      success: false,
      message: "Failed to trigger pipeline job.",
    };
  }
}