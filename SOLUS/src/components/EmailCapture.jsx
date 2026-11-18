import { useState } from 'react';
import { Mail } from 'lucide-react';
import './EmailCapture.css';

const EmailCapture = ({ layout = 'inline' }) => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if(email) {
      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 3000);
      setEmail('');
    }
  };

  return (
    <div className={`email-capture-wrapper ${layout}`}>
      {layout === 'stacked' && (
        <div className="email-capture-text">
          <div className="email-icon-wrapper" style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>
            <Mail size={32} strokeWidth={1} color="var(--text-primary)" />
          </div>
          <h3>JOIN THE INNER CIRCLE</h3>
          <p>Exclusive updates, direct communiques, and more.</p>
        </div>
      )}
      <form className="email-capture-form" onSubmit={handleSubmit}>
        <input 
          type="email" 
          placeholder="ENTER EMAIL" 
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button type="submit" disabled={submitted} className="btn-subscribe">
          {submitted ? 'JOINED' : 'SUBSCRIBE'}
        </button>
      </form>
    </div>
  );
};

export default EmailCapture;
