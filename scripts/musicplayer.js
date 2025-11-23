// musicplayer.js

document.addEventListener("DOMContentLoaded", async () => {
  const audio       = document.getElementById('audio');
  const btnPlay     = document.getElementById('btn-play');
  const btnPause    = document.getElementById('btn-pause');
  const btnPrev     = document.getElementById('btn-prev');
  const btnNext     = document.getElementById('btn-next');
  const bar         = document.getElementById('bar');
  const barFill     = document.getElementById('bar-fill');
  const barScrub    = document.getElementById('bar-scrub');
  const timeCurrent = document.getElementById('time-current');
  const timeTotal   = document.getElementById('time-total');
  const vol         = document.getElementById('vol');
  const volFill     = document.getElementById('vol-fill');
  const volVal      = document.getElementById('vol-val');

  const titleEl     = document.getElementById('title');
  const artistEl    = document.getElementById('artist');
  const artEl       = document.getElementById('art');

  const linkSpotify    = document.getElementById('link-spotify');
  const linkSoundCloud = document.getElementById('link-soundcloud');
  const linkYouTube    = document.getElementById('link-youtube');

  // 👉 Replace with your published Google Sheet CSV link
  const CSV_URL = "";

  // Parse CSV into track objects
  async function fetchPlaylist() {
    const res = await fetch(CSV_URL);
    const text = await res.text();
    const lines = text.trim().split("\n");
    const headers = lines[0].split(",");

    return lines.slice(1).map(line => {
      const cols = line.split(",");
      return {
        title: cols[0],
        artist: cols[1],
        src: cols[2],
        art: cols[3],
        links: {
          spotify: cols[4],
          soundcloud: cols[5],
          youtube: cols[6]
        }
      };
    });
  }

  const tracks = await fetchPlaylist();
  let index = Math.floor(Math.random() * tracks.length);

  function fmt(s) {
    const m = Math.floor(s / 60);
    const r = Math.floor(s % 60);
    return `${m}:${r < 10 ? '0' : ''}${r}`;
  }

  function loadTrack(i) {
    const t = tracks[i];
    titleEl.textContent  = t.title;
    artistEl.textContent = t.artist;
    artEl.src            = t.art;
    audio.src            = t.src;
    linkSpotify.href     = t.links.spotify;
    linkSoundCloud.href  = t.links.soundcloud;
    linkYouTube.href     = t.links.youtube;
    audio.load();
  }

  loadTrack(index);

  audio.addEventListener('loadedmetadata', () => {
    timeTotal.textContent = fmt(audio.duration || 0);
  });

  audio.addEventListener('timeupdate', () => {
    const p = (audio.currentTime / (audio.duration || 1)) * 100;
    barFill.style.width = `${p}%`;
    barScrub.style.left = `${p}%`;
    timeCurrent.textContent = fmt(audio.currentTime);
  });

  btnPlay.addEventListener('click', () => audio.play());
  btnPause.addEventListener('click', () => audio.pause());

  btnPrev.addEventListener('click', () => {
    index = (index - 1 + tracks.length) % tracks.length;
    loadTrack(index);
    audio.play();
  });

  btnNext.addEventListener('click', () => {
    index = (index + 1) % tracks.length;
    loadTrack(index);
    audio.play();
  });

  bar.addEventListener('click', (e) => {
    const rect = bar.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const pct = Math.min(Math.max(x / rect.width, 0), 1);
    audio.currentTime = pct * (audio.duration || 0);
  });

  vol.addEventListener('click', (e) => {
    const rect = vol.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const pct = Math.min(Math.max(x / rect.width, 0), 1);
    audio.volume = pct;
    volFill.style.width = `${pct * 100}%`;
    volVal.textContent = `${Math.round(pct * 100)}%`;
  });
});
async function loadPlaylist() {
  const res = await fetch('https://docs.google.com/spreadsheets/d/12NclIyIJ-Qq4OWQt-_Md7Ksz1ImjHUQg5rrmr_8cDhg/pub?output=csv');
  const text = await res.text();
  // parse CSV into track objects
}
