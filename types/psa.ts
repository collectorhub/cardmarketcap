// types/admin/psa.ts
export interface PSAGradeBreakdown {
  psa_10: number;
  psa_9: number;
  psa_8: number;
  psa_7_or_lower: number;
  qualifiers: number; // e.g., MC, OC, ST marks
}

export interface PSAPopulationItem {
  id: string; // Internal operational lookup ID
  cert_prefix: string; // e.g., "4xxx", "8xxx"
  scraped_psa_name: string; // The raw messy string coming from the registry scrape
  total_pop: number;
  grade_breakdown: PSAGradeBreakdown;
  is_matched: boolean;
  issue_type: 'none' | 'reverse_holo_mixup' | 'variant_mismatch' | 'unlinked_pop';
  
  // Linked canonical target details if mapped
  proposed_canonical?: {
    id: string;
    name: string;
    set_name: string;
    image_url?: string;
  };
}