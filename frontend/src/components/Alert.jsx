export default function Alert({ type = 'error', message, onClose }) {
  if (!message) return null;
  return (
    <div className={`alert alert-${type}`} role="alert">
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem' }}>
        <span>{message}</span>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: 'inherit',
              cursor: 'pointer',
              fontSize: '1.1rem',
            }}
            aria-label="Dismiss"
          >
            ×
          </button>
        )}
      </div>
    </div>
  );
}
