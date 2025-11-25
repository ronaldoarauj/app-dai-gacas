export default async function handler(req, res) {
  try {
    const CHANNEL_ID = "UCVXK7c7T4UISfavhY0edE7w";
    const API_KEY = process.env.NEXT_PUBLIC_YOUTUBE_KEY; // sem NEXT_PUBLIC

    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/search?key=${API_KEY}&channelId=${CHANNEL_ID}&part=snippet,id&order=date&maxResults=8`
    );

    const data = await response.json();

    return res.status(200).json(data);
  } catch (err) {
    return res.status(500).json({ error: "Erro ao buscar vídeos" });
  }
}
