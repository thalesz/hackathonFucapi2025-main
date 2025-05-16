import React from 'react';

const LandingPage: React.FC = () => {
  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #56ab2f 0%, #a8e063 100%)',
        color: '#fff',
        textAlign: 'center',
        overflow: 'hidden',
      }}
    >
      {/* Eco-friendly illustration */}
      <svg
        width="160"
        height="160"
        viewBox="0 0 160 160"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ marginBottom: '2rem' }}
      >
        <circle cx="80" cy="80" r="75" fill="#eafbea" />
        <path
          d="M80 40c-22 0-40 18-40 40s18 40 40 40 40-18 40-40"
          stroke="#56ab2f"
          strokeWidth="6"
          fill="none"
        />
        <path
          d="M80 120c-10-10-20-30-20-40s10-30 20-40"
          stroke="#2ecc40"
          strokeWidth="6"
          fill="none"
        />
        <ellipse
          cx="80"
          cy="80"
          rx="18"
          ry="28"
          fill="#a8e063"
          opacity="0.7"
        />
        {/* Recycle arrows */}
        <g>
          <path
            d="M110 60l10-5-5 10"
            stroke="#388e3c"
            strokeWidth="3"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M120 55c-5-10-20-20-40-20"
            stroke="#388e3c"
            strokeWidth="3"
            fill="none"
            strokeLinecap="round"
          />
          <path
            d="M50 100l-10 5 5-10"
            stroke="#388e3c"
            strokeWidth="3"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M40 105c5 10 20 20 40 20"
            stroke="#388e3c"
            strokeWidth="3"
            fill="none"
            strokeLinecap="round"
          />
          <path
            d="M80 35v-12"
            stroke="#388e3c"
            strokeWidth="3"
            strokeLinecap="round"
          />
        </g>
      </svg>
      <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>
        Bem-vindo ao Condomínio Eco
      </h1>
      <p style={{ fontSize: '1.2rem', maxWidth: 420, marginBottom: '2rem', color: '#eafbea' }}>
        Viva a experiência de um condomínio sustentável! Recicle, preserve o meio ambiente e faça parte da mudança para um futuro mais verde.
      </p>
      <a
        href="./cards"
        style={{
          display: 'inline-block',
          padding: '14px 36px',
          fontSize: '20px',
          backgroundColor: '#2980ef',
          color: '#fff',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer',
          fontWeight: 'bold',
          textDecoration: 'none',
          boxShadow: '0 4px 16px rgba(41,128,239,0.15)',
          transition: 'background 0.2s',
        }}
        onMouseOver={e => (e.currentTarget.style.backgroundColor = '#1565c0')}
        onMouseOut={e => (e.currentTarget.style.backgroundColor = '#2980ef')}
      >
        Entrar
      </a>
    </div>
  );
};

export default LandingPage;
