import { useEffect, useState, useRef } from 'react';
import Head from 'next/head';
import styles from '../styles/Home.module.css';

function Home() {
  const [currentSong, setCurrentSong] = useState('Carregando...');
  const [currentArtist, setCurrentArtist] = useState('Carregando...');
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
    // Aqui você pode adicionar lógica para atualizar o nome da música
    setCurrentSong('Carregando próxima música...');
    // Você pode também reiniciar a conexão com a API se necessário
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>Rádio Gospel Zeno.FM</title>
      </Head>
      <header className={styles.header}>
        <h1>Rádio App Dai Graças</h1>
            <img 
              src="https://zeno.fm/_ipx/q_85&fit_cover&s_64x64/https://images.zeno.fm/5pJY3rvxOMMIEO3JhQkQIpE-mjTW55l-gTo6ss8nq5A/rs:fill:288:288/g:ce:0:0/aHR0cHM6Ly9wcm94eS56ZW5vLmZtL2NvbnRlbnQvc3RhdGlvbnMvODRlYWE2YmQtNWJmZS00MWMzLTkwNjUtMWUzMGIwNjc4MjgyL2ltYWdlLz91PTE3MzI1NjY5MTMwMDA.webp" 
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
          <h2>Música Atual:</h2>
          <p>{currentSong}</p>
          <h3>Artista:</h3>
          <p>{currentArtist}</p>
        </section>
        {/* <section className={styles.highlight}>
          <h2>Músicas em Destaque</h2>
          <p>Confira as músicas mais tocadas da semana!</p>
        </section> */}
      </main>
      <footer className={styles.footer}>
        <p>&copy; 2024 Rádio App Dai Graças. Todos os direitos reservados.</p>
      </footer>
    </div>
  );
}

export default Home;