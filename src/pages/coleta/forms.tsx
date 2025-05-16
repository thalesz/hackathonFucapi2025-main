import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Spinner from '../../hooks/Spinner';
interface Condominio {
  id: number;
  name: string;
}

interface Morador {
  id: number;
  nome: string;
}

const NovaColetaForm: React.FC = () => {
  const [morador, setMorador] = useState<number | ''>('');
  const [moradores, setMoradores] = useState<Morador[]>([]);
  const [condominio, setCondominio] = useState<number | ''>('');
  const [condominios, setCondominios] = useState<Condominio[]>([]);
  const [imagem, setImagem] = useState<File | null>(null);
  const [cadastroFinalizado, setCadastroFinalizado] = useState(false);
  const [respostaColeta, setRespostaColeta] = useState<{ nome: string; quantidade: number }[]>([]);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchCondominios = async () => {
      try {
        setLoading(true);
        const res = await fetch('https://hackaton-ezbbbegfggfxahd4.brazilsouth-01.azurewebsites.net/api/v1/condominio/all');
        const data = await res.json();
        setCondominios(data.data || []);
      } catch (err) {
        console.error('Erro ao buscar condomínios:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchCondominios();
  }, []);

  useEffect(() => {
    const fetchMoradores = async () => {
      if (condominio !== '') {
        try {
          setLoading(true);
          const res = await fetch(`https://hackaton-ezbbbegfggfxahd4.brazilsouth-01.azurewebsites.net/api/v1/morador/${condominio}`);
          const data = await res.json();
          setMoradores(data.data || []);
        } catch (err) {
          console.error('Erro ao buscar moradores:', err);
        } finally {
          setLoading(false);
        }
      } else {
        setMoradores([]);
      }
    };
    fetchMoradores();
  }, [condominio]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!condominio || !morador || !imagem) return;

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append('img', imagem);

      const response = await fetch(
        `https://hackaton-ezbbbegfggfxahd4.brazilsouth-01.azurewebsites.net/api/v1/coleta/${condominio}/${morador}`,
        {
          method: 'POST',
          body: formData,
        }
      );

      const result = await response.json();
      setRespostaColeta(result.resposta || []);

      if (response.ok) {
        setCadastroFinalizado(true);
      } else {
        alert('Erro ao cadastrar coleta. Verifique os dados e tente novamente.');
      }
    } catch (error) {
      console.error('Erro na requisição:', error);
      alert('Erro de conexão ao tentar cadastrar a coleta.');
    } finally {
      setLoading(false);
    }
  };

  const handleNovoCadastro = () => {
    setMorador('');
    setCondominio('');
    setImagem(null);
    setCadastroFinalizado(false);
    setRespostaColeta([]);
  };

  const handleVoltar = () => navigate('/');

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        <button onClick={handleVoltar} style={backButtonStyle} aria-label="Voltar para o início">
          ← Início
        </button>

        <div style={ecoBannerStyle}>
          <span role="img" aria-label="folha">🌱</span>
          <span>
            Obrigado por contribuir para um mundo mais sustentável!
            <br />
            <span style={{ fontSize: '0.95rem', color: '#b2ffb2' }}>
              Cada coleta ajuda a preservar o meio ambiente.
            </span>
          </span>
        </div>

        {loading ? (
          <Spinner />
        ) : cadastroFinalizado ? (
          <>
            <h2 style={{ fontSize: '1.8rem', color: '#27ae60' }}>Cadastro realizado com sucesso !</h2>
            <p style={{ color: '#b2ffb2' }}>Sua ação faz a diferença para o planeta! ♻️</p>
            {respostaColeta.length > 0 && (
              <div style={coletaCardStyle}>
                <h3 style={{ color: '#27ae60' }}>Itens coletados:</h3>
                <ul style={{ paddingLeft: '1.5rem' }}>
                  {respostaColeta.map((item, index) => (
                    <li key={index}><strong>{item.nome}</strong>: {item.quantidade}</li>
                  ))}
                </ul>
              </div>
            )}
            <button onClick={handleNovoCadastro} style={successButtonStyle}>Nova Coleta</button>
          </>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
            <h2 style={{ fontSize: '1.8rem', color: '#27ae60' }}>Nova Coleta</h2>
            <p style={{ color: '#27ae60' }}>Separe corretamente seus resíduos e ajude a natureza!</p>

            <label>
              Condomínio
              <select value={condominio} onChange={(e) => setCondominio(Number(e.target.value))} required style={inputStyle}>
                <option value="">Selecione um condomínio</option>
                {condominios.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </label>

            <label>
              Morador
              <select value={morador} onChange={(e) => setMorador(Number(e.target.value))} required style={inputStyle} disabled={!condominio}>
                <option value="">Selecione um morador</option>
                {moradores.map((m) => (
                  <option key={m.id} value={m.id}>{m.nome}</option>
                ))}
              </select>
            </label>

            <label>
              Imagem:
              <input
              type="file"
              accept="image/*"
              onChange={(e) => setImagem(e.target.files?.[0] || null)}
              required
              disabled={!condominio || !morador}
              style={{
                ...inputStyle,
                padding: '8px',
                backgroundColor: '#ffffff', // fundo branco para remover parte escura
                color: '#2d4030', // verde escuro para contraste
                border: '1px solid #27ae60', // verde eco
              }}
              />
            </label>

            <button type="submit" style={submitButtonStyle} disabled={!condominio || !morador || !imagem}>
              Cadastrar Coleta
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

// Novo estilo para o card de coleta
const coletaCardStyle: React.CSSProperties = {
  textAlign: 'left',
  backgroundColor: '#3a3a3a',
  padding: '1rem',
  borderRadius: '8px',
  marginTop: '1rem',
  color: '#fff',
};
const containerStyle: React.CSSProperties = {
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100vw',
  height: '100vh',
  background: 'linear-gradient(135deg, #e6f4ea 60%, #d1f1d6 100%)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  color: '#2d4030',
  zIndex: 1000,
};

const cardStyle: React.CSSProperties = {
  backgroundColor: '#f9fff9',
  padding: '2rem',
  borderRadius: '16px',
  boxShadow: '0 8px 24px rgba(39, 174, 96, 0.15)',
  width: '100%',
  maxWidth: '500px',
  display: 'flex',
  flexDirection: 'column',
  gap: '1.2rem',
  textAlign: 'center',
  border: '2px solid #27ae60',
};

const ecoBannerStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '0.7rem',
  backgroundColor: '#27ae60',
  borderRadius: '8px',
  padding: '0.7rem 1rem',
  marginBottom: '1rem',
  fontWeight: 'bold',
  color: '#fff',
  fontSize: '1.1rem',
  justifyContent: 'center',
  boxShadow: '0 2px 8px rgba(39, 174, 96, 0.15)',
};

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '10px',
  borderRadius: '6px',
  border: '1px solid #a3d9a5',
  backgroundColor: '#ffffff',
  color: '#2d4030',
  fontSize: '1rem',
  marginTop: '4px',
};

const backButtonStyle: React.CSSProperties = {
  backgroundColor: '#27ae60',
  border: 'none',
  padding: '0.5rem 1rem',
  borderRadius: '8px',
  color: '#fff',
  fontSize: '1rem',
  cursor: 'pointer',
  alignSelf: 'flex-start',
  marginBottom: '1rem',
  fontWeight: 'bold',
  transition: 'background 0.2s',
};

const successButtonStyle: React.CSSProperties = {
  backgroundColor: '#3498db',
  border: 'none',
  padding: '12px',
  borderRadius: '8px',
  color: '#fff',
  fontWeight: 'bold',
  fontSize: '1rem',
  cursor: 'pointer',
};

const submitButtonStyle: React.CSSProperties = {
  backgroundColor: '#27ae60',
  border: 'none',
  padding: '12px',
  borderRadius: '8px',
  color: '#fff',
  fontWeight: 'bold',
  fontSize: '1rem',
  cursor: 'pointer',
};
 export default NovaColetaForm;