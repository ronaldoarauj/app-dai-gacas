import { useEffect, useState } from "react";
import styled from "styled-components";
import Header from "../components/Header";

export default function Videos() {
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    async function loadVideos() {
      try {
        const res = await fetch("/api/youtube");
        const data = await res.json();
        setVideos(data.items || []);
      } catch (error) {
        console.error("Erro ao carregar vídeos:", error);
      }
    }

    loadVideos();
  }, []);

  return (
    <PageWrapper>
      <Header />

      <Content>
        <Title>🎬 Últimos Vídeos do YouTube</Title>
        
        <VideosGrid>
          {videos.map((v) => (
            <VideoCard key={v.id.videoId}>
              <iframe
                width="100%"
                height="180"
                src={`https://www.youtube.com/embed/${v.id.videoId}`}
                title={v.snippet.title}
                frameBorder="0"
                allowFullScreen
              />
              <VideoTitle>{v.snippet.title}</VideoTitle>
            </VideoCard>
          ))}
        </VideosGrid>
      </Content>
    </PageWrapper>
  );
}

// --------------------------------------------------
// STYLED COMPONENTS
// --------------------------------------------------

const PageWrapper = styled.div`
  background: #f7f7f7;
  min-height: 100vh;
`;

const Content = styled.div`
  max-width: 1100px;
  margin: 0 auto;
  padding: 30px 20px;
`;

const Title = styled.h2`
  font-size: 32px;
  font-weight: 700;
  margin-bottom: 20px;
  color: #222;
`;

const PlayerBox = styled.div`
  background: #ffffff;
  padding: 20px;
  border-radius: 14px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
  margin-bottom: 40px;
`;

const SectionTitle = styled.h3`
  font-size: 26px;
  margin-bottom: 20px;
  color: #333;
`;

const VideosGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 20px;
`;

const VideoCard = styled.div`
  background: white;
  border-radius: 14px;
  padding: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
`;

const VideoTitle = styled.p`
  font-size: 15px;
  margin-top: 10px;
  color: #444;
  font-weight: 500;
`;
