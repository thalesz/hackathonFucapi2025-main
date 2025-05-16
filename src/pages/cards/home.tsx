import React from 'react';

const cardData = [
  {
    title: 'Nova Coleta',
    description: 'Adicione uma nova coleta ao sistema e contribua para um planeta mais limpo.',
    href: './coleta',
    button: 'Adicionar',
    color: '#27ae60',
    icon: '🌱',
  },
  {
    title: 'Ver Coletas',
    description: 'Veja suas coletas cadastradas e acompanhe seu impacto ambiental.',
    href: './coleta2',
    button: 'Visualizar',
    color: '#2980b9',
    icon: '♻️',
  },
  {
    title: 'EcoChat',
    description: 'Tire dúvidas e receba dicas de sustentabilidade com o EcoChat.',
    href: './ecochat',
    button: 'Interagir',
    color: '#8e44ad',
    icon: '💬',
  },
];

const Home: React.FC = () => {
  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        background: 'linear-gradient(135deg, #1e5631 0%, #a4de02 100%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'auto',
      }}
    >
      <h1
        style={{
          color: '#fff',
          fontWeight: 700,
          fontSize: '2.5rem',
          marginBottom: '1.5rem',
          letterSpacing: '1px',
          textShadow: '0 2px 8px rgba(30,86,49,0.3)',
        }}
      >
        🌍 EcoFucapi - Preservando o Meio Ambiente
      </h1>
      <div
        style={{
          display: 'flex',
          gap: '2rem',
          flexWrap: 'wrap',
          justifyContent: 'center',
        }}
      >
        {cardData.map((card) => (
          <div
            key={card.title}
            style={{
              background: 'rgba(44,44,44,0.95)',
              padding: '2rem',
              borderRadius: '16px',
              width: '260px',
              textAlign: 'center',
              boxShadow: '0 6px 18px rgba(30,86,49,0.25)',
              color: '#fff',
              transition: 'transform 0.2s, box-shadow 0.2s',
              cursor: 'pointer',
              border: `2px solid ${card.color}`,
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLDivElement).style.transform = 'scale(1.05)';
              (e.currentTarget as HTMLDivElement).style.boxShadow = `0 12px 32px ${card.color}55`;
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLDivElement).style.transform = 'scale(1)';
              (e.currentTarget as HTMLDivElement).style.boxShadow = '0 6px 18px rgba(30,86,49,0.25)';
            }}
          >
            <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>{card.icon}</div>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: card.color }}>{card.title}</h2>
            <p style={{ marginBottom: '1.5rem', color: '#d4efdf' }}>{card.description}</p>
            <a
              href={card.href}
              style={{
                backgroundColor: card.color,
                border: 'none',
                padding: '12px 24px',
                borderRadius: '8px',
                color: '#fff',
                fontWeight: 'bold',
                cursor: 'pointer',
                fontSize: '1rem',
                boxShadow: `0 2px 8px ${card.color}55`,
                transition: 'background 0.2s',
                textDecoration: 'none',
                display: 'inline-block',
              }}
              onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#145a32')}
              onMouseLeave={e => (e.currentTarget.style.backgroundColor = card.color)}
            >
              {card.button}
            </a>
          </div>
        ))}
      </div>
      <footer
        style={{
          marginTop: '2.5rem',
          color: '#eafaf1',
          fontSize: '1rem',
          opacity: 0.85,
        }}
      >
        Juntos pela sustentabilidade! 🌳
      </footer>
    </div>
  );
};

export default Home;
