export default function Health() {
  const buildId = document.querySelector('meta[name="build-id"]')?.getAttribute('content') || 'unknown';
  const timestamp = new Date().toISOString();
  
  const healthData = {
    app: 'ok',
    buildId,
    timestamp,
    environment: import.meta.env.MODE,
    version: 'v7'
  };

  return (
    <div style={{ 
      fontFamily: 'monospace', 
      padding: '20px',
      maxWidth: '600px',
      margin: '0 auto'
    }}>
      <pre style={{ 
        background: '#1a1a1a', 
        color: '#4ade80', 
        padding: '20px', 
        borderRadius: '8px',
        overflow: 'auto'
      }}>
        {JSON.stringify(healthData, null, 2)}
      </pre>
    </div>
  );
}
