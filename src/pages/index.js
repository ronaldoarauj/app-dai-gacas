import { useEffect, useState, useRef } from 'react';
import Head from 'next/head';
import styles from '../styles/Home.module.css';

function Home() {
  const [currentSong, setCurrentSong] = useState('Carregando...');
  const [currentArtist, setCurrentArtist] = useState('Carregando...');
  const [songRequest, setSongRequest] = useState('');
  const audioRef = useRef(null);

  useEffect(() => {
    const eventSource = new EventSource('https://api.zeno.fm/mounts/metadata/subscribe/cdycmbajedhtv');

    eventSource.onmessage = (event) => {
      if (event.data) {
        const data = JSON.parse(event.data);
        if (data.streamTitle) {
          const [artist, song] = data.streamTitle.split(' - ');
          setCurrentArtist(artist.trim());
          setCurrentSong(song.trim());
        }
      }
    };

    eventSource.onerror = (error) => {
      console.error('Erro na conexão com o servidor:', error);
    };

    return () => {
      eventSource.close();
    };
  }, []);

  const handleAudioEnded = () => {
    setCurrentSong('Carregando próxima música...');
  };

  const handleRequestChange = (event) => {
    setSongRequest(event.target.value);
  };

  const handleRequestSubmit = async (event) => {
    event.preventDefault();

    // Aqui você pode enviar a solicitação para um servidor
    try {
      const TELEGRAM_BOT_TOKEN = process.env.NEXT_PUBLIC_TELEGRAM_BOT_TOKEN;
      const response = await fetch(`https://api.telegram.org/${TELEGRAM_BOT_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chat_id: "351354199",
          text: `Solicitação de música: ${songRequest}`,
          disable_notification: false
        }),
      });

      if (!response.ok) {
        throw new Error('Erro ao enviar a solicitação');
      }

      // Limpa o campo de entrada após o envio
      setSongRequest('');
      alert('Solicitação enviada com sucesso!');
    } catch (error) {
      console.error('Erro ao enviar a solicitação:', error);
      alert('Falha ao enviar a solicitação. Tente novamente.');
    }
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>Rádio App Dai Graças</title>
        <meta property="og:title" content="Rádio App Dai Graças" />
        <meta property="og:description" content="Ouça a melhor rádio gospel ao vivo!" />
        <meta property="og:image" content="https://ideogram.ai/assets/image/lossless/response/H9SJbNfIR2GWogzrxjvF1Q" />
        <meta property="og:url" content="https://app-dai-gacas.vercel.app/" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Rádio App Dai Graças" />
        <meta name="twitter:description" content="Ouça a melhor rádio gospel ao vivo!" />
        <meta name="twitter:image" content="https://ideogram.ai/assets/image/lossless/response/H9SJbNfIR2GWogzrxjvF1Q" />
        <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8828793479535455"
     crossorigin="anonymous"></script>
      </Head>
      <header className={styles.header}>
        <h1>Rádio App Dai Graças</h1>
        <img
          src="https://ideogram.ai/assets/image/lossless/response/H9SJbNfIR2GWogzrxjvF1Q"
          alt="Logo da Rádio App Dai Graças"
          className={styles.logo}
        />
        <h2>
          <a
            href="https://play.google.com/store/apps/details?id=br.com.sinforme.thanksgivin.thanksgiving"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.link}
          >
            Baixe nosso App
          </a>
        </h2>
      </header>
      <main className={styles.main}>
        <section className={styles.musicPlayer}>
          <audio
            ref={audioRef}
            controls
            onEnded={handleAudioEnded}
          >
            <source src="https://stream.zeno.fm/cdycmbajedhtv" type="audio/mpeg" />
            Seu navegador não suporta o elemento de áudio.
          </audio>
        </section>
        <section className={styles.musicInfo}>
          <h2>Música Atual: {currentSong}</h2>
          <h3>Artista: {currentArtist}</h3>
        </section>
        <section className={styles.songRequest}>
          <h2>Solicitar Música:</h2>
          <form onSubmit={handleRequestSubmit} className={styles.requestForm}>
            <input
              type="text"
              value={songRequest}
              onChange={handleRequestChange}
              placeholder="Música ou artista"
              required
              className={styles.requestInput}
            />
            <button type="submit" className={styles.requestButton}>Enviar</button>
          </form>
        </section>
      </main>
      <footer className={styles.footer}>
        <p>&copy; 2024 Rádio App Dai Graças. Todos os direitos reservados.</p>
      </footer>
    </div>
  );
}

export default Home;