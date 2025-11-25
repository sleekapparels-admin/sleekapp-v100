/**
 * Check if Microsoft Clarity resources are reachable
 * Handles environments with HTTPS inspection/blocking
 */

interface ClarityCheckResult {
  reachable: boolean;
  stage: 'pixel' | 'script' | 'none';
  error?: string;
  host?: string;
}

let cachedResult: ClarityCheckResult | null = null;

/**
 * Test if Clarity's tracking pixel is reachable
 */
const checkClarityPixel = (): Promise<{ success: boolean; error?: string }> => {
  return new Promise((resolve) => {
    const img = new Image();
    const timeout = setTimeout(() => {
      resolve({ success: false, error: 'Timeout reaching c.clarity.ms' });
    }, 3000);

    img.onload = () => {
      clearTimeout(timeout);
      resolve({ success: true });
    };

    img.onerror = (e) => {
      clearTimeout(timeout);
      resolve({ 
        success: false, 
        error: `Failed to load pixel from c.clarity.ms (likely HTTPS inspection)` 
      });
    };

    // Add timestamp to prevent caching
    img.src = `https://c.clarity.ms/c.gif?t=${Date.now()}`;
  });
};

/**
 * Test if Clarity's main script is reachable
 */
const checkClarityScript = (): Promise<{ success: boolean; error?: string }> => {
  return new Promise((resolve) => {
    const script = document.createElement('script');
    const timeout = setTimeout(() => {
      script.remove();
      resolve({ success: false, error: 'Timeout reaching scripts.clarity.ms' });
    }, 3000);

    script.onload = () => {
      clearTimeout(timeout);
      script.remove();
      resolve({ success: true });
    };

    script.onerror = () => {
      clearTimeout(timeout);
      script.remove();
      resolve({ 
        success: false, 
        error: 'Failed to load script from scripts.clarity.ms (likely HTTPS inspection)' 
      });
    };

    script.async = true;
    script.src = `https://scripts.clarity.ms/0.8.38/clarity.js`;
    document.head.appendChild(script);
  });
};

/**
 * Check if Microsoft Clarity is reachable
 * Returns cached result if already checked in this session
 */
export const checkClarityReachability = async (): Promise<ClarityCheckResult> => {
  // Return cached result if available
  if (cachedResult) {
    return cachedResult;
  }

  // First try the tracking pixel (lightest check)
  const pixelResult = await checkClarityPixel();
  
  if (pixelResult.success) {
    cachedResult = {
      reachable: true,
      stage: 'pixel',
    };
    return cachedResult;
  }

  // If pixel fails, try the script
  const scriptResult = await checkClarityScript();
  
  if (scriptResult.success) {
    cachedResult = {
      reachable: true,
      stage: 'script',
    };
    return cachedResult;
  }

  // Both failed - Clarity is blocked
  cachedResult = {
    reachable: false,
    stage: 'none',
    error: pixelResult.error || scriptResult.error,
    host: 'c.clarity.ms / scripts.clarity.ms',
  };

  return cachedResult;
};

/**
 * Reset cached result (useful for testing)
 */
export const resetClarityCheck = () => {
  cachedResult = null;
};
