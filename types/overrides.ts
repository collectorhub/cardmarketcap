export interface OverrideRule {
  id: string;
  type: 'alias_cleanup' | 'global_exclusion' | 'frontend_helper';
  raw_incoming_string: string;
  mapped_canonical_target: string;
  scope_target: 'eBay Scraper' | 'PriceCharting' | 'PSA Pop Ingest' | 'All Ingest';
  created_by: string;
  created_at: string;
  status: 'active' | 'suspended';
}