export interface ProposedMatchItem {
  id: string; // Internal match log ID
  source_platform: 'ebay' | 'price_charting' | 'psa';
  scraped_title: string;
  scraped_raw_meta: {
    set_guess?: string;
    grade_guess?: string;
    raw_price?: number;
    scraped_at: string;
  };
  confidence_score: 'high' | 'medium' | 'low';
  proposed_canonical: {
    id: string;
    name: string;
    set_name: string;
    image_url?: string;
  };
}