import { useState, useEffect, useRef } from "react";
import Head from "next/head";
import styled from "styled-components";
import {
  FaGooglePlay,
  FaTwitter,
  FaInstagram,
  FaYoutube,
  FaTelegramPlane,
} from "react-icons/fa";

// Importando o novo Header
import Header from "../components/Header";

export default function Home() {
  const [latestArticles, setLatestArticles] = useState([]);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [currentSong, setCurrentSong] = useState("Carregando...");
  const [currentArtist, setCurrentArtist] = useState("Carregando...");
  const [songRequest, setSongRequest] = useState("");
  const audioRef = useRef(null);

  useEffect(() => {
    setLatestArticles([
      {
        id: 1,
        title: "A Importância da Fé na Vida Cristã",
        date: "2024-12-01",
      },
      {
        id: 2,
        title: "Estudo Bíblico: O Sermão da Montanha",
        date: "2024-11-25",
      },
      {
        id: 3,
        title: "Como Fortalecer sua Comunhão com Deus",
        date: "2024-11-20",
      },
    ]);

    setUpcomingEvents([
      { id: 1, title: "Culto de Natal", date: "2024-12-24" },
      { id: 2, title: "Encontro de Jovens", date: "2024-12-31" },
    ]);
  }, []);

  useEffect(() => {
    const eventSource = new EventSource(
      "https://api.zeno.fm/mounts/metadata/subscribe/cdycmbajedhtv"
    );

    eventSource.onmessage = (event) => {
      if (event.data) {
        const data = JSON.parse(event.data);
        if (data.streamTitle) {
          const [artist, song] = data.streamTitle.split(" - ");
          setCurrentArtist(artist?.trim() || "");
          setCurrentSong(song?.trim() || "");
        }
      }
    };

    eventSource.onerror = () => eventSource.close();
    return () => eventSource.close();
  }, []);

  const handleRequestSubmit = async (event) => {
    event.preventDefault();
    try {
      const TOKEN = process.env.NEXT_PUBLIC_TELEGRAM_BOT_TOKEN;
      const res = await fetch(`https://api.telegram.org/${TOKEN}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: "351354199",
          text: `Solicitação de música: ${songRequest}`,
        }),
      });
      if (!res.ok) throw new Error();
      setSongRequest("");
      alert("Solicitação enviada!");
    } catch {
      alert("Erro ao enviar solicitação.");
    }
  };

  const [videos] = useState([
    {
      id: "dQw4w9WgXcQ",
      title: "Mensagem de esperança e fé",
    },
    {
      id: "jNQXAC9IVRw",
      title: "Louvor que toca o coração",
    },
    {
      id: "M7FIvfx5J10",
      title: "Palavra de motivação espiritual",
    },
  ]);

  return (
    <Container>
      <Head>
        <title>Portal Evangélico</title>
      </Head>

      {/* HEADER IMPORTADO */}
      <Header />

      <Main>
        {/* HERO */}
        <Hero id="home">
          <h2>Bem-vindo ao Portal Evangélico</h2>
          <p>
            Artigos, estudos bíblicos, louvores, vídeos e eventos da comunidade
            cristã.
          </p>
        </Hero>

        {/* RÁDIO */}
        <Section id="music">
          <SectionTitle>Rádio Online</SectionTitle>

          <RadioCard>
            <audio ref={audioRef} controls>
              <source
                src="https://stream.zeno.fm/cdycmbajedhtv"
                type="audio/mpeg"
              />
            </audio>

            <RadioInfo>
              <h3>{currentSong}</h3>
              <p>Artista: {currentArtist}</p>
            </RadioInfo>

            <form onSubmit={handleRequestSubmit}>
              <input
                type="text"
                value={songRequest}
                onChange={(e) => setSongRequest(e.target.value)}
                placeholder="Solicitar música"
                required
              />
              <button type="submit">Enviar</button>
            </form>
          </RadioCard>
        </Section>

        {/* ARTIGOS */}
        <Section id="articles">
          <SectionTitle>Últimos Artigos</SectionTitle>
          <Grid>
            {latestArticles.map((a) => (
              <Card key={a.id}>
                <h3>{a.title}</h3>
                <span>{new Date(a.date).toLocaleDateString()}</span>
              </Card>
            ))}
          </Grid>
        </Section>

        {/* EVENTOS */}
        <Section id="events">
          <SectionTitle>Próximos Eventos</SectionTitle>
          <Grid>
            {upcomingEvents.map((e) => (
              <Card key={e.id}>
                <h3>{e.title}</h3>
                <span>{new Date(e.date).toLocaleDateString()}</span>
              </Card>
            ))}
          </Grid>
        </Section>

        {/* VÍDEOS */}
        <Section id="videos">
          <SectionTitle>Vídeos Recentes</SectionTitle>

          <VideosGrid>
            {videos.map((video) => (
              <VideoCard key={video.id}>
                <iframe
                  src={`https://www.youtube.com/embed/${video.id}`}
                  title={video.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture;"
                  allowFullScreen
                ></iframe>
                <h3>{video.title}</h3>
              </VideoCard>
            ))}
          </VideosGrid>
        </Section>

        {/* CONTATO */}
        <Section id="contact">
          <SectionTitle>Contato</SectionTitle>
          <p>Acompanhe nossas redes sociais:</p>
          <SocialRow>
            <FaGooglePlay size={28} />
            <FaTwitter size={28} />
            <FaInstagram size={28} />
            <FaYoutube size={28} />
            <FaTelegramPlane size={28} />
          </SocialRow>
        </Section>
      </Main>

      <Footer>© 2024 Portal Evangélico</Footer>
    </Container>
  );
}

/* ===================== STYLES ===================== */

const Container = styled.div`
  background: #f7f8fa;
  color: #222;
  font-family: "Inter", sans-serif;
`;

const Main = styled.main`
  padding: 40px;
`;

const Hero = styled.section`
  background: linear-gradient(120deg, #0070f3, #54a0ff);
  color: white;
  padding: 80px 40px;
  border-radius: 16px;
  text-align: center;
  margin-bottom: 40px;
`;

const Section = styled.section`
  margin: 60px 0;
`;

const SectionTitle = styled.h2`
  margin-bottom: 20px;
  font-size: 1.8rem;
  font-weight: 700;
`;

const Grid = styled.div`
  display: grid;
  gap: 25px;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
`;

const Card = styled.div`
  background: white;
  padding: 25px;
  border-radius: 14px;
  box-shadow: 0 4px 14px #00000010;
  transition: 0.2s;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 6px 20px #00000025;
  }
`;

const RadioCard = styled.div`
  background: white;
  padding: 25px;
  border-radius: 14px;
  box-shadow: 0 4px 14px #00000010;
  display: flex;
  flex-direction: column;
  gap: 20px;

  audio {
    width: 100%;
  }

  form {
    display: flex;
    gap: 10px;

    input {
      flex: 1;
      padding: 10px;
      border-radius: 8px;
      border: 1px solid #ccc;
    }

    button {
      padding: 10px 20px;
      background: #0070f3;
      color: white;
      border: none;
      border-radius: 8px;
      cursor: pointer;
    }
  }
`;

const RadioInfo = styled.div`
  h3 {
    margin: 0;
  }
  p {
    margin: 0;
    color: #777;
  }
`;

const VideosGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 25px;
`;

const VideoCard = styled.div`
  background: white;
  padding: 20px;
  border-radius: 14px;
  box-shadow: 0 4px 14px #00000010;
  transition: 0.2s;

  iframe {
    width: 100%;
    height: 200px;
    border-radius: 12px;
    margin-bottom: 10px;
  }

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 6px 20px #00000025;
  }
`;

const SocialRow = styled.div`
  display: flex;
  gap: 15px;
  margin-top: 20px;

  svg {
    cursor: pointer;
    transition: 0.2s;
  }

  svg:hover {
    color: #0070f3;
    transform: translateY(-4px);
  }
`;

const Footer = styled.footer`
  padding: 25px;
  text-align: center;
  margin-top: 50px;
  color: #777;
`;
