import React, { useState, useRef, useEffect } from 'react';

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

const leafSvg = (
    <svg width="32" height="32" viewBox="0 0 32 32" style={{ marginRight: 8 }}>
        <ellipse cx="16" cy="16" rx="15" ry="10" fill="#a5d6a7" />
        <path d="M16 30 Q22 18 30 16 Q22 14 16 2 Q10 14 2 16 Q10 18 16 30Z" fill="#388e3c" />
    </svg>
);

const Chat: React.FC = () => {
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState<{ from: 'user' | 'api'; text: string; image?: string }[]>([]);
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement | null>(null);
    const [image, setImage] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, loading]);

    const typeMessage = (fullText: string) => {
        return new Promise<void>((resolve) => {
            let index = -1;
            const interval = setInterval(() => {
                if (index >= fullText.length) {
                    clearInterval(interval);
                    resolve();
                } else {
                    setMessages((prev) => {
                        const lastMessage = prev[prev.length - 1];
                        if (lastMessage && lastMessage.from === 'api') {
                            const updatedMessages = [...prev];
                            updatedMessages[updatedMessages.length - 1] = {
                                ...lastMessage,
                                text: lastMessage.text + fullText.charAt(index),
                            };
                            return updatedMessages;
                        } else {
                            return [...prev, { from: 'api', text: fullText.charAt(index) }];
                        }
                    });
                    index++;
                }
            }, 30);
        });
    };

    const handleSend = async () => {
        if (!input.trim() && !image) return;

        const userMessage = image
            ? { from: 'user' as const, text: input, image }
            : { from: 'user' as const, text: input };

        setMessages((prev) => [...prev, userMessage]);
        setInput('');
        setImage(null);
        setLoading(true);

        try {
            const formData = new FormData();
            formData.append('prompt', input.trim() || '[imagem]');
            if (image) {
                const res = await fetch(image);
                const blob = await res.blob();
                formData.append('img', blob, 'image.png');
            }

            const response = await fetch(
                'https://hackaton-ezbbbegfggfxahd4.brazilsouth-01.azurewebsites.net/api/v1/chat/',
                {
                    method: 'POST',
                    body: formData,
                }
            );

            if (!response.ok) {
                throw new Error(`Erro HTTP! status: ${response.status}`);
            }

            const data = await response.json();
            setMessages((prev) => [...prev, { from: 'api', text: '' }]);
            await typeMessage(data.mensagem);
        } catch (error) {
            setMessages((prev) => [...prev, { from: 'api', text: 'Erro ao obter resposta da API.' }]);
        } finally {
            setLoading(false);
        }
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (ev) => {
                const base64Image = ev.target?.result as string;
                setImage(base64Image);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            if (!loading) handleSend();
        }
    };

    const handleBack = () => {
        window.history.back();
    };

    return (
        <div
            style={{
                minHeight: '100vh',
                width: '100vw',
                background: ecoColors.background,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: 0,
                margin: 0,
                fontFamily: 'Segoe UI, Arial, sans-serif',
            }}
        >
            <div
                style={{
                    maxWidth: 500,
                    width: '100%',
                    background: '#fff',
                    borderRadius: 28,
                    boxShadow: '0 8px 32px 0 rgba(56,142,60,0.12)',
                    padding: 32,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    border: `2px solid ${ecoColors.border}`,
                    position: 'relative',
                }}
            >
                {/* Eco leaf icon and title */}
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: 16 }}>
                    {leafSvg}
                    <h2 style={{
                        margin: 0,
                        color: ecoColors.primary,
                        fontWeight: 800,
                        letterSpacing: 1,
                        fontSize: 28,
                        textShadow: '0 2px 8px #a5d6a7',
                    }}>
                        EcoChat
                    </h2>
                </div>
                <span style={{
                    color: ecoColors.primary,
                    fontSize: 15,
                    marginBottom: 18,
                    textAlign: 'center',
                    fontWeight: 500,
                    opacity: 0.85,
                }}>
                    Converse sobre sustentabilidade, meio ambiente e descubra dicas ecológicas!
                </span>

                {/* Back button */}
                <button
                    onClick={handleBack}
                    style={{
                        alignSelf: 'flex-start',
                        marginBottom: 12,
                        background: ecoColors.secondary,
                        color: ecoColors.primary,
                        border: 'none',
                        borderRadius: 8,
                        padding: '7px 16px',
                        fontWeight: 600,
                        cursor: 'pointer',
                        fontSize: 14,
                        transition: 'background 0.2s',
                        boxShadow: '0 2px 8px 0 rgba(56,142,60,0.08)',
                        position: 'absolute',
                        left: 24,
                        top: 24,
                    }}
                >
                    ← Voltar
                </button>

                <div
                    style={{
                        height: 350,
                        width: '100%',
                        border: `1.5px solid ${ecoColors.border}`,
                        padding: 16,
                        overflowY: 'auto',
                        marginBottom: 18,
                        background: ecoColors.accent,
                        borderRadius: 18,
                        boxShadow: '0 2px 8px 0 rgba(56,142,60,0.06)',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 8,
                        scrollbarColor: `${ecoColors.secondary} #fffde7`,
                        scrollbarWidth: 'thin',
                    }}
                >
                    {messages.length === 0 && (
                        <div style={{
                            color: ecoColors.primary,
                            opacity: 0.7,
                            textAlign: 'center',
                            marginTop: 60,
                            fontSize: 16,
                        }}>
                            🌱 Comece a conversa! Pergunte sobre reciclagem, energia limpa, ou envie uma foto para análise ecológica.
                        </div>
                    )}
                    {messages.map((msg, idx) => (
                        <div
                            key={idx}
                            style={{
                                display: 'flex',
                                justifyContent: msg.from === 'user' ? 'flex-end' : 'flex-start',
                            }}
                        >
                            <div
                                style={{
                                    background: msg.from === 'user'
                                        ? ecoColors.userBubble
                                        : ecoColors.apiBubble,
                                    color: msg.from === 'user' ? '#fff' : ecoColors.primary,
                                    padding: '10px 16px',
                                    borderRadius: 18,
                                    maxWidth: 320,
                                    minWidth: 40,
                                    whiteSpace: 'pre-wrap',
                                    wordBreak: 'break-word',
                                    fontSize: 15,
                                    boxShadow: msg.from === 'user'
                                        ? '0 2px 8px 0 rgba(56,142,60,0.10)'
                                        : '0 2px 8px 0 rgba(56,142,60,0.04)',
                                    position: 'relative',
                                    marginBottom: msg.image ? 8 : 0,
                                    border: msg.from === 'user'
                                        ? `1.5px solid #66bb6a`
                                        : `1.5px solid ${ecoColors.border}`,
                                    transition: 'background 0.2s, border 0.2s',
                                }}
                            >
                                {msg.text}
                                {msg.image && (
                                    <img
                                        src={msg.image}
                                        alt="Enviada"
                                        style={{
                                            display: 'block',
                                            marginTop: 8,
                                            maxWidth: 180,
                                            borderRadius: 10,
                                            boxShadow: '0 2px 8px 0 rgba(56,142,60,0.10)',
                                            border: `1.5px solid ${ecoColors.secondary}`,
                                        }}
                                    />
                                )}
                            </div>
                        </div>
                    ))}
                    <div ref={messagesEndRef} />
                </div>

                <textarea
                    placeholder="Digite sua mensagem ecológica..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    rows={3}
                    style={{
                        width: '100%',
                        padding: 12,
                        boxSizing: 'border-box',
                        resize: 'vertical',
                        borderRadius: 12,
                        border: `1.5px solid ${ecoColors.border}`,
                        fontSize: 15,
                        marginBottom: 12,
                        outline: 'none',
                        background: ecoColors.accent,
                        transition: 'border 0.2s',
                        color: ecoColors.primary,
                        fontFamily: 'Segoe UI, Arial, sans-serif',
                        boxShadow: '0 2px 8px 0 rgba(56,142,60,0.04)',
                    }}
                    disabled={loading}
                />

                <div style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <button
                            onClick={() => fileInputRef.current?.click()}
                            disabled={loading}
                            style={{
                                marginRight: 12,
                                background: ecoColors.secondary,
                                color: ecoColors.primary,
                                border: 'none',
                                borderRadius: 8,
                                padding: '8px 14px',
                                fontWeight: 600,
                                cursor: 'pointer',
                                fontSize: 14,
                                transition: 'background 0.2s',
                                boxShadow: '0 2px 8px 0 rgba(56,142,60,0.08)',
                            }}
                        >
                            📷 Anexar Imagem
                        </button>
                        {image && (
                            <div style={{ position: 'relative', marginRight: 10 }}>
                                <img
                                    src={image}
                                    alt="Preview"
                                    style={{
                                        width: 60,
                                        height: 60,
                                        objectFit: 'cover',
                                        borderRadius: 8,
                                        boxShadow: '0 2px 8px 0 rgba(56,142,60,0.08)',
                                        border: `1.5px solid ${ecoColors.secondary}`,
                                    }}
                                />
                                <button
                                    onClick={() => setImage(null)}
                                    style={{
                                        position: 'absolute',
                                        top: -8,
                                        right: -8,
                                        background: '#ff5252',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '50%',
                                        width: 22,
                                        height: 22,
                                        cursor: 'pointer',
                                        fontWeight: 700,
                                        fontSize: 16,
                                        boxShadow: '0 2px 8px 0 rgba(56,142,60,0.08)',
                                    }}
                                    title="Remover imagem"
                                >
                                    ×
                                </button>
                            </div>
                        )}
                        <input
                            type="file"
                            accept="image/*"
                            style={{ display: 'none' }}
                            ref={fileInputRef}
                            onChange={handleImageChange}
                            disabled={loading}
                        />
                    </div>
                    <button
                        onClick={handleSend}
                        disabled={loading || (!input.trim() && !image)}
                        style={{
                            padding: '10px 24px',
                            background: ecoColors.button,
                            color: ecoColors.buttonText,
                            border: 'none',
                            borderRadius: 12,
                            fontWeight: 700,
                            fontSize: 15,
                            cursor: loading || (!input.trim() && !image) ? 'not-allowed' : 'pointer',
                            boxShadow: '0 2px 8px 0 rgba(56,142,60,0.10)',
                            transition: 'background 0.2s',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 6,
                        }}
                    >
                        {loading ? (
                            <>
                                <span className="loader" style={{
                                    width: 16,
                                    height: 16,
                                    border: '2px solid #fff',
                                    borderTop: `2px solid ${ecoColors.primary}`,
                                    borderRadius: '50%',
                                    display: 'inline-block',
                                    animation: 'spin 1s linear infinite',
                                }} />
                                Enviando...
                            </>
                        ) : (
                            <>
                                <span role="img" aria-label="enviar">🌿</span> Enviar
                            </>
                        )}
                    </button>
                </div>
                {/* Loader animation style */}
                <style>
                    {`
                    @keyframes spin {
                        0% { transform: rotate(0deg);}
                        100% { transform: rotate(360deg);}
                    }
                    ::-webkit-scrollbar {
                        width: 8px;
                        background: #fffde7;
                    }
                    ::-webkit-scrollbar-thumb {
                        background: #a5d6a7;
                        border-radius: 8px;
                    }
                    `}
                </style>
            </div>
        </div>
    );
};

export default Chat;
