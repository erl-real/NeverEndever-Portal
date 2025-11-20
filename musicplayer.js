// musicplayer.js

document.addEventListener("DOMContentLoaded", () => {
  const audio      = document.getElementById('audio');
  const btnPlay    = document.getElementById('btn-play');
  const btnPause   = document.getElementById('btn-pause');
  const btnPrev    = document.getElementById('btn-prev');
  const btnNext    = document.getElementById('btn-next');
  const bar        = document.getElementById('bar');
  const barFill    = document.getElementById('bar-fill');
  const barScrub   = document.getElementById('bar-scrub');
  const timeCurrent= document.getElementById('time-current');
  const timeTotal  = document.getElementById('time-total');
  const vol        = document.getElementById('vol');
  const volFill    = document.getElementById('vol-fill');
  const volVal     = document.getElementById('vol-val');

  const titleEl    = document.getElementById('title');
  const artistEl   = document.getElementById('artist');
  const artEl      = document.getElementById('art');

  // Playlist
  const tracks = [
    {
      title: 'Sierra Leone',
      artist: 'Mt Eden Dubstep',
      src: 'https://www.kozco.com/tech/piano2-CoolEdit.mp3',
      art: 'https://images.unsplash.com/photo-1499428665502-503f6c608263?q=80&w=600&auto=format&fit=crop'
    },
    {
      title: 'First Of The Year (Equinox)',
      artist: 'Skrillex',
      src: 'https://www.kozco.com/tech/LRMonoPhase4.mp3',
      art: 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?q=80&w=600&auto=format&fit=crop'
    }
  ];
  let index = 0;

  // Helpers
  function fmt(s){
    const m = Math.floor(s/60);
    const r = Math.floor(s%60);
    return `${m}:${r<10?'0':''}${r}`;
  }

  function loadTrack(i){
    const t = tracks[i];
    titleEl.textContent  = t.title;
    artistEl.textContent = t.artist;
    artEl.src            = t.art;
    audio.src            = t.src;
    audio.load();
  }

  // Init
  loadTrack(index);

  // Events
  audio.addEventListener('loadedmetadata', ()=>{
    timeTotal.textContent = fmt(audio.duration || 0);
  });

  audio.addEventListener('timeupdate', ()=>{
    const p = (audio.currentTime / (audio.duration || 1)) * 100;
    barFill.style.width = `${p}%`;
    barScrub.style.left = `${p}%`;
    timeCurrent.textContent = fmt(audio.currentTime);
  });

  btnPlay.addEventListener('click', ()=> audio.play());
  btnPause.addEventListener('click', ()=> audio.pause());

  btnPrev.addEventListener('click', ()=>{
    index = (index - 1 + tracks.length) % tracks.length;
    loadTrack(index);
    audio.play();
  });

  btnNext.addEventListener('click', ()=>{
    index = (index + 1) % tracks.length;
    loadTrack(index);
    audio.play();
  });

  // Scrubbing
  bar.addEventListener('click', (e)=>{
    const rect = bar.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const pct = Math.min(Math.max(x / rect.width, 0), 1);
    audio.currentTime = pct * (audio.duration || 0);
  });

  // Volume
  vol.addEventListener('click', (e)=>{
    const rect = vol.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const pct = Math.min(Math.max(x / rect.width, 0), 1);
    audio.volume = pct;
    volFill.style.width = `${pct*100}%`;
    volVal.textContent = `${Math.round(pct*100)}%`;
  });
});
