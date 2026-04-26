import React from 'react';

export default function Footer() {
  return (
    <footer style={{ backgroundColor: '#152238', padding: '2rem 0', textAlign: 'center', color: '#fff' }}>
      <div className="footer-content">
        <ul style={{ listStyle: 'none', display: 'flex', justifyContent: 'center', gap: '20px', padding: 0 }}>
          
        </ul>
        <p>&copy; {new Date().getFullYear()} Your Company Name. All rights reserved.</p>
      </div>
    </footer>
  );
}
