import { useEffect, useState, useRef } from 'react';
import Head from 'next/head';
import styled from 'styled-components';
import { FaTelegramPlane, FaTwitter, FaInstagram, FaYoutube } from 'react-icons/fa';
import Header from "../components/Header"; // ⬅️ NOVO HEADER

export default function Radio() {

  const [currentSong, setCurrentSong] = useState('Carregando...');
  const [currentArtist, setCurrentArtist] = useState('Carregando...');
  const [songRequest, setSongRequest] = useState('');
  const audioRef = useRef(null);

  useEffect(() => {
    const eventSource = new EventSource(
      'https://api.zeno.fm/mounts/metadata/subscribe/cdycmbajedhtv'
    );

    eventSource.onmessage = (event) => {
      if (event.data) {
        const data = JSON.parse(event.data);
        if (data.streamTitle) {
          const [artist, song] = data.streamTitle.split(' - ');
          setCurrentArtist(artist?.trim() || '');
          setCurrentSong(song?.trim() || '');
        }
      }
    };

    eventSource.onerror = (error) => {
      console.error('Erro na conexão com o servidor:', error);
    };

    return () => eventSource.close();
  }, []);

  const handleAudioEnded = () => {
    setCurrentSong('Carregando próxima música...');
  };

  const handleRequestSubmit = async (event) => {
    event.preventDefault();

    try {
      const TELEGRAM_BOT_TOKEN = process.env.NEXT_PUBLIC_TELEGRAM_BOT_TOKEN;
      const response = await fetch(`https://api.telegram.org/${TELEGRAM_BOT_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: '351354199',
          text: `Solicitação de música: ${songRequest}`,
        }),
      });

      if (!response.ok) throw new Error('Erro ao enviar');

      setSongRequest('');
      alert('Solicitação enviada!');
    } catch (error) {
      alert('Erro ao enviar solicitação.');
    }
  };

  return (
    <Container>
      <Head>
        <title>Rádio App Dai Graças</title>
      </Head>

      {/* NOVO TOPO — importado de components/Header.js */}
      <Header />

      {/* SEU TOPO ANTIGO → agora renomeado para PageHeader */}
      <PageHeader>
        <Logo
          src="https://ideogram.ai/assets/image/lossless/response/H9SJbNfIR2GWogzrxjvF1Q"
          alt="Logo"
        />
        <h1>Rádio App Dai Graças</h1>
        <p>Ouça ao vivo 24h com a melhor seleção gospel</p>
      </PageHeader>

      <Main>
        <PlayerSection>
          <audio ref={audioRef} controls onEnded={handleAudioEnded}>
            <source src="https://stream.zeno.fm/cdycmbajedhtv" type="audio/mpeg" />
            Seu navegador não suporta o player.
          </audio>
        </PlayerSection>

        <MusicInfo>
          <h2>Música Atual</h2>
          <Song>{currentSong}</Song>
          <Artist>{currentArtist}</Artist>
        </MusicInfo>

        <RequestSection>
          <h2>Solicitar Música</h2>
          <form onSubmit={handleRequestSubmit}>
            <Input
              type="text"
              placeholder="Nome da música ou artista"
              value={songRequest}
              onChange={(e) => setSongRequest(e.target.value)}
              required
            />
            <Button type="submit">Enviar</Button>
          </form>
        </RequestSection>
      </Main>

      <Footer>
        <p>&copy; 2024 Rádio App Dai Graças</p>
        <Social>
          <a href="https://t.me/appdaigracas" target="_blank"><FaTelegramPlane size={26} /></a>
          <a href="https://twitter.com/appdaigracas" target="_blank"><FaTwitter size={26} /></a>
          <a href="https://instagram.com/app.daigracas" target="_blank"><FaInstagram size={26} /></a>
          <a href="https://www.youtube.com/@DaiGracas" target="_blank"><FaYoutube size={26} /></a>
        </Social>
      </Footer>
    </Container>
  );
}

/* ------------------------- ESTILOS ------------------------- */

const Container = styled.div`
  background: #f5f7fa;
  color: #333;
  min-height: 100vh;
  padding-bottom: 40px;
`;

const PageHeader = styled.header`
  text-align: center;
  padding: 40px 20px;
`;

const Logo = styled.img`
  width: 130px;
  height: 130px;
  border-radius: 50%;
  margin-bottom: 15px;
`;

const Main = styled.main`
  display: flex;
  flex-direction: column;
  gap: 40px;
  padding: 0 20px;
  max-width: 700px;
  margin: auto;
`;

const PlayerSection = styled.section`
  background: white;
  padding: 25px;
  border-radius: 14px;
  box-shadow: 0 4px 14px #00000015;

  audio {
    width: 100%;
  }
`;

const MusicInfo = styled.section`
  background: white;
  padding: 25px;
  border-radius: 14px;
  box-shadow: 0 4px 14px #00000015;
  text-align: center;

  h2 {
    margin-bottom: 10px;
  }
`;

const Song = styled.h3`
  font-size: 1.3rem;
  font-weight: bold;
  color: #222;
`;

const Artist = styled.p`
  font-size: 1.1rem;
  color: #555;
`;

const RequestSection = styled.section`
  background: white;
  padding: 25px;
  border-radius: 14px;
  box-shadow: 0 4px 14px #00000015;

  h2 {
    text-align: center;
    margin-bottom: 20px;
  }
`;

const Input = styled.input`
  width: 100%;
  padding: 14px;
  border-radius: 10px;
  border: 1px solid #d1d5db;
  margin-bottom: 15px;
  font-size: 1rem;

  &:focus {
    outline: none;
    border-color: #4b7bec;
  }
`;

const Button = styled.button`
  width: 100%;
  padding: 14px;
  background: #4b7bec;
  color: white;
  font-size: 1.1rem;
  font-weight: bold;
  border: none;
  border-radius: 10px;
  cursor: pointer;

  &:hover {
    background: #3867d6;
  }
`;

const Footer = styled.footer`
  margin-top: 50px;
  text-align: center;
  color: #555;
`;

const Social = styled.div`
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-top: 15px;

  a {
    color: #333;
    transition: 0.2s;
  }

  a:hover {
    color: #4b7bec;
  }
`;
