export interface PipelineJob {
  id: string;
  target_source: 'ebay_scraper' | 'price_charting_sync' | 'psa_ingestion' | 'image_cdn_optimize';
  status: 'running' | 'completed' | 'failed' | 'queued';
  records_processed: number;
  speed_rate: string; // e.g., "45 rec/s"
  progress_percent: number;
  started_at: string;
  duration: string;
  error_message?: string;
}