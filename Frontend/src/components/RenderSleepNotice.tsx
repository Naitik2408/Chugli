import './RenderSleepNotice.css';

interface RenderSleepNoticeProps {
  onRetry?: () => void;
}

export default function RenderSleepNotice({ onRetry }: RenderSleepNoticeProps) {
  return (
    <div className="render-sleep-notice">
      <div className="notice-content">
        <div className="sleep-emoji">😴</div>
        <h2>Oops! Our server took a little nap 💤</h2>
        <p>
          We're on Render's free tier, so the backend goes to sleep after being inactive.
          Don't worry though - it's waking up right now! ☕️
        </p>
        <div className="notice-details">
          <p>⏰ This usually takes about 50 seconds to 1 minute</p>
          <p>✨ Please retry in a moment, and everything will work perfectly!</p>
        </div>
        {onRetry && (
          <button className="retry-button" onClick={onRetry}>
            🔄 Retry Connection
          </button>
        )}
        <div className="fun-fact">
          <small>💡 Fun fact: Once awake, the server stays active for a while!</small>
        </div>
      </div>
    </div>
  );
}
