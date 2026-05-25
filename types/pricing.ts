export interface TransactionSale {
  id: string;
  card_title: string;
  source_platform: 'ebay' | 'price_charting';
  price: number;
  sale_date: string;
  grade_status: 'raw' | 'graded';
  grade_value?: string; // e.g., "PSA 10", "BGS 9.5"
  is_outlier: boolean;
  anomaly_reason?: 'price_spike' | 'suspicious_shill' | 'polluted_title_match' | 'none';
}