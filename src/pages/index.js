import { useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import styles from '../styles/index.module.css';
import { FaFacebook, FaTwitter, FaInstagram, FaYoutube, FaTelegramPlane } from 'react-icons/fa';

export default function Home() {
  const [latestArticles, setLatestArticles] = useState([]);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [currentSong, setCurrentSong] = useState('Carregando...');
  const [currentArtist, setCurrentArtist] = useState('Carregando...');
  const [songRequest, setSongRequest] = useState('');
  const audioRef = useRef(null);

  useEffect(() => {
    // Simulate fetching data from an API
    setLatestArticles([
      { id: 1, title: 'A Importância da Fé na Vida Cristã', date: '2024-12-01' },
      { id: 2, title: 'Estudo Bíblico: O Sermão da Montanha', date: '2024-11-25' },
      { id: 3, title: 'Como Fortalecer sua Comunhão com Deus', date: '2024-11-20' },
    ]);

    setUpcomingEvents([
      { id: 1, title: 'Culto de Natal', date: '2024-12-24' },
      { id: 2, title: 'Encontro de Jovens', date: '2024-12-31' },
    ]);
  }, []);

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
        <title>Portal Evangélico</title>
        <meta name="description" content="Portal com artigos e eventos sobre a fé cristã evangélica." />
      </Head>

      <header className={styles.header}>
        <h1>Portal Evangélico</h1>
        <nav className={styles.nav}>
          <a href="#home">Home</a>
          <a href="#articles">Artigos</a>
          <a href="#events">Eventos</a>
          <a href="#contact">Contato</a>
          <a href="/radio" rel="noopener noreferrer">Rádio</a>
          <a href="https://play.google.com/store/apps/details?id=br.com.sinforme.thanksgivin.thanksgiving" target="_blank" rel="noopener noreferrer">App</a>
        </nav>
      </header>

      <main className={styles.main}>
        <section id="home" className={styles.section}>
          <h2>Bem-vindo ao Portal Evangélico</h2>
          <p>
            Aqui você encontrará artigos inspiradores, estudos bíblicos, e informações sobre eventos futuros da
            comunidade evangélica. Junte-se a nós e fortaleça sua fé!
          </p>
        </section>

        <section id="music" className={styles.section}>
          <h2>Rádio</h2>
          <div className={styles.musicPlayer}>
            <audio ref={audioRef} controls onEnded={handleAudioEnded}>
              <source src="https://stream.zeno.fm/cdycmbajedhtv" type="audio/mpeg" />
              Seu navegador não suporta o elemento de áudio.
            </audio>
          </div>
          <div className={styles.musicInfo}>
            <h3>Música Atual: {currentSong}</h3>
            <h4>Artista: {currentArtist}</h4>
          </div>
          <div className={styles.songRequest}>
            <h3>Solicitar Música:</h3>
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
          </div>
        </section>

        <section id="articles" className={styles.section}>
          <h2>Últimos Artigos</h2>
          <ul>
            {latestArticles.map((article) => (
              <li key={article.id}>
                <h3>{article.title}</h3>
                <p>{new Date(article.date).toLocaleDateString()}</p>
              </li>
            ))}
          </ul>
        </section>

        <section id="events" className={styles.section}>
          <h2>Próximos Eventos</h2>
          <ul>
            {upcomingEvents.map((event) => (
              <li key={event.id}>
                <h3>{event.title}</h3>
                <p>{new Date(event.date).toLocaleDateString()}</p>
              </li>
            ))}
          </ul>
        </section>

        <section id="contact" className={styles.section}>
          <h2>Contato</h2>
          <p>
            Siga-nos nas redes sociais e fique por dentro das novidades!
          </p>
          <div className={styles.socialLinks}>
            {/* <a href="https://www.facebook.com/yourpage" target="_blank" rel="noopener noreferrer" className={styles.icon}>
              <FaFacebook size={30} />
            </a> */}
            <a href="https://www.twitter.com/yourprofile" target="_blank" rel="noopener noreferrer" className={styles.icon}>
              <FaTwitter size={30} />
            </a>
            <a href="https://www.instagram.com/app.daigracas" target="_blank" rel="noopener noreferrer" className={styles.icon}>
              <FaInstagram size={30} />
            </a>
            <a href="https://www.youtube.com/yourchannel" target="_blank" rel="noopener noreferrer" className={styles.icon}>
              <FaYoutube size={30} />
            </a>
            <a href="https://t.me/appdaigracas" target="_blank" rel="noopener noreferrer" className={styles.icon}>
              <FaTelegramPlane size={30} />
            </a>
          </div>
        </section>
      </main>

      <footer className={styles.footer}>
        <p>&copy; 2024 Portal Evangélico. Todos os direitos reservados.</p>
      </footer>
    </div>
  );
}
