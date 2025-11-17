// Development-only check for React duplication issues
export const checkReactDuplication = () => {
  if (import.meta.env.DEV) {
    try {
      const reactInstances: Set<string> = new Set();
      
      // Check if React is loaded multiple times by looking at window
      if (typeof window !== 'undefined') {
        const allScripts = Array.from(document.querySelectorAll('script[src*="react"]'));
        
        allScripts.forEach((script) => {
          const src = (script as HTMLScriptElement).src;
          if (src) {
            reactInstances.add(src);
          }
        });
        
        if (reactInstances.size > 1) {
          console.warn(
            '⚠️ Multiple React instances detected. This can cause issues with hooks and context.',
            '\nDetected sources:',
            Array.from(reactInstances)
          );
        }
      }
    } catch (error) {
      console.error('Error checking React duplication:', error);
    }
  }
};
