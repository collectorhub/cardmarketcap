const API_URL = 'https://pokecollectorhub.com/api/newsletter.php';

export interface Subscriber {
  id: number;
  email: string;
  subscribed_at: string;
  active: number;
}

/**
 * Highly optimized fetch for existing subscribers
 */
export async function fetchSubscribers(): Promise<Subscriber[]> {
  try {
    const response = await fetch(API_URL, { cache: 'no-store' });
    if (!response.ok) return [];
    
    const result = await response.json();
    return result.success ? result.data : [];
  } catch (error) {
    console.error("Subscriber fetch error:", error);
    return [];
  }
}

/**
 * Securely writes a new subscriber to the DB
 */
export async function addSubscriber(email: string) {
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });

    const result = await response.json();
    if (!response.ok) throw new Error(result.message || 'Server error');
    
    return result;
  } catch (error) {
    console.error("Subscription write error:", error);
    throw error;
  }
}