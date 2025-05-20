import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const ecoColors = {
    primary: '#388e3c',
    secondary: '#a5d6a7',
    accent: '#fffde7',
    userBubble: 'linear-gradient(135deg, #388e3c 0%, #66bb6a 100%)',
    apiBubble: 'linear-gradient(135deg, #e8f5e9 0%, #fffde7 100%)',
    background: 'linear-gradient(135deg, #e8f5e9 0%, #fffde7 100%)',
    button: 'linear-gradient(135deg, #388e3c 0%, #66bb6a 100%)',
    buttonText: '#fff',
    border: '#c8e6c9',
};

interface Condominio {
    id: number;
    name: string;
}

interface Morador {
    id: number;
    nome: string;
}

interface Coleta {
    id: number;
    data: string;
    residuos: string[];
}

const ecoTips = [
    "Reduza, Reutilize e Recicle sempre que possível.",
    "Separe corretamente seus resíduos para facilitar a reciclagem.",
    "Evite o desperdício de água e energia em casa.",
    "Prefira produtos reutilizáveis ao invés de descartáveis.",
    "Plante uma árvore e contribua para um planeta mais verde.",
];

const NovaColetaForm2: React.FC = () => {
    const [morador, setMorador] = useState<number | ''>('');
    const [moradores, setMoradores] = useState<Morador[]>([]);
    const [condominio, setCondominio] = useState<number | ''>('');
    const [condominios, setCondominios] = useState<Condominio[]>([]);
    const [cadastroFinalizado, setCadastroFinalizado] = useState(false);
    const [respostaColeta, setRespostaColeta] = useState<Coleta[]>([]);
    const [loading, setLoading] = useState(false);
    const [ecoTip, setEcoTip] = useState('');

    const navigate = useNavigate();

    useEffect(() => {
        setEcoTip(ecoTips[Math.floor(Math.random() * ecoTips.length)]);
        fetch('https://hackaton-ezbbbegfggfxahd4.brazilsouth-01.azurewebsites.net/api/v1/condominio/all')
            .then((res) => res.json())
            .then((data) => {
                setCondominios(data.data || []);
            })
            .catch((err) => {
                console.error('Erro ao buscar condomínios:', err);
            });
    }, []);

    useEffect(() => {
        if (condominio !== '') {
            setLoading(true);
            fetch(`https://hackaton-ezbbbegfggfxahd4.brazilsouth-01.azurewebsites.net/api/v1/morador/${condominio}`)
                .then((res) => res.json())
                .then((data) => {
                    setMoradores(data.data || []);
                })
                .catch((err) => {
                    console.error('Erro ao buscar moradores:', err);
                })
                .finally(() => setLoading(false));
        } else {
            setMoradores([]);
        }
    }, [condominio]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!condominio || !morador) return;

        setLoading(true);
        try {
            const response = await fetch(
                `https://hackaton-ezbbbegfggfxahd4.brazilsouth-01.azurewebsites.net/api/v1/coleta/${condominio}/${morador}`
            );

            const result = await response.json();
            setRespostaColeta(result.coletas || []);
            setCadastroFinalizado(true);
        } catch (error) {
            alert('Erro de conexão ao tentar consultar a coleta.');
        } finally {
            setLoading(false);
        }
    };

    const handleNovoCadastro = () => {
        setMorador('');
        setCondominio('');
        setCadastroFinalizado(false);
        setRespostaColeta([]);
        setEcoTip(ecoTips[Math.floor(Math.random() * ecoTips.length)]);
    };

    const handleVoltar = () => {
        navigate('/cards');
    };

    return (
        <div style={containerStyle}>
            <div style={cardStyle}>
                <button onClick={handleVoltar} style={backButtonStyle} aria-label="Voltar para o início">
                    ←
                </button>
                <div style={ecoBannerStyle}>
                    <span role="img" aria-label="folha" style={{ fontSize: '1.5rem', marginRight: 8 }}>🌱</span>
                    <span>{ecoTip}</span>
                </div>
                {cadastroFinalizado ? (
                    <>
                        <h2 style={{ fontSize: '1.8rem', color: ecoColors.primary }}>Consulta Realizada!</h2>
                        {respostaColeta.length > 0 ? (
                            <div style={cardsContainerStyle}>
                                {respostaColeta.map((coleta) => (
                                    <div key={coleta.id} style={coletaCardStyle}>
                                        <h3>Coleta #{coleta.id}</h3>
                                        <p>
                                            <strong>Data:</strong>{' '}
                                            {new Date(coleta.data).toLocaleString('pt-BR')}
                                        </p>
                                        <p><strong>Resíduos:</strong></p>
                                        <ul style={{ marginTop: '0.3rem', paddingLeft: '1.2rem' }}>
                                            {coleta.residuos.map((residuo, idx) => (
                                                <li key={idx}>{residuo}</li>
                                            ))}
                                        </ul>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p style={{ color: '#f1c40f' }}>Nenhuma coleta encontrada para este morador.</p>
                        )}
                        <button onClick={handleNovoCadastro} style={successButtonStyle}>
                            Nova Consulta
                        </button>
                    </>
                ) : (
                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                        <h2 style={{ fontSize: '1.8rem', color: ecoColors.primary }}>Consultar Coletas</h2>
                        <label>
                            Condomínio
                            <select
                                value={condominio}
                                onChange={(e) => setCondominio(Number(e.target.value))}
                                required
                                style={inputStyle}
                                aria-label="Selecione o condomínio"
                            >
                                <option value="">Selecione um condomínio</option>
                                {condominios.map((c) => (
                                    <option key={c.id} value={c.id}>
                                        {c.name}
                                    </option>
                                ))}
                            </select>
                        </label>
                        <label>
                            Morador
                            <select
                                value={morador}
                                onChange={(e) => setMorador(Number(e.target.value))}
                                required
                                disabled={moradores.length === 0 || loading}
                                style={inputStyle}
                                aria-label="Selecione o morador"
                            >
                                <option value="">Selecione um morador</option>
                                {moradores.map((m) => (
                                    <option key={m.id} value={m.id}>
                                        {m.nome}
                                    </option>
                                ))}
                            </select>
                        </label>
                        <button
                            type="submit"
                            style={submitButtonStyle}
                            disabled={!condominio || !morador || loading}
                        >
                            {loading ? 'Consultando...' : 'Consultar Coleta'}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
};

// Estilos
const containerStyle: React.CSSProperties = {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    background: ecoColors.background,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    color: ecoColors.primary,
    zIndex: 1000,
};

const cardStyle: React.CSSProperties = {
    background: ecoColors.apiBubble,
    padding: '2rem',
    borderRadius: '16px',
    boxShadow: '0 8px 24px rgba(56, 142, 60, 0.15)',
    width: '100%',
    maxWidth: '800px',
    display: 'flex',
    flexDirection: 'column',
    gap: '1.2rem',
    textAlign: 'center',
    border: `2px solid ${ecoColors.border}`,
};

const ecoBannerStyle: React.CSSProperties = {
    background: ecoColors.secondary,
    color: ecoColors.primary,
    borderRadius: '8px',
    padding: '0.6rem 1rem',
    marginBottom: '1rem',
    fontWeight: 'bold',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '1.1rem',
};

const cardsContainerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    maxHeight: '400px',
    overflowY: 'auto',
    paddingRight: '0.5rem',
};

const coletaCardStyle: React.CSSProperties = {
    background: ecoColors.accent,
    color: ecoColors.primary,
    padding: '1rem',
    borderRadius: '8px',
    width: '100%',
    textAlign: 'left',
    boxShadow: '0 4px 8px rgba(56, 142, 60, 0.10)',
    borderLeft: `4px solid ${ecoColors.primary}`,
};

const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '10px',
    borderRadius: '6px',
    border: `1px solid ${ecoColors.primary}`,
    background: ecoColors.apiBubble,
    color: ecoColors.primary,
    fontSize: '1rem',
    marginTop: '4px',
    outline: 'none',
};

const backButtonStyle: React.CSSProperties = {
    background: 'transparent',
    border: 'none',
    padding: '0.5rem',
    borderRadius: '50%',
    color: ecoColors.primary,
    fontSize: '1.5rem',
    cursor: 'pointer',
    alignSelf: 'flex-start',
    marginBottom: '1rem',
    transition: 'background 0.2s',
};

const successButtonStyle: React.CSSProperties = {
    background: ecoColors.button,
    border: 'none',
    padding: '12px',
    borderRadius: '8px',
    color: ecoColors.buttonText,
    fontWeight: 'bold',
    fontSize: '1rem',
    cursor: 'pointer',
    marginTop: '1rem',
    transition: 'background 0.2s',
};

const submitButtonStyle: React.CSSProperties = {
    background: ecoColors.button,
    border: 'none',
    padding: '12px',
    borderRadius: '8px',
    color: ecoColors.buttonText,
    fontWeight: 'bold',
    fontSize: '1rem',
    cursor: 'pointer',
    transition: 'background 0.2s',
};

export default NovaColetaForm2;
