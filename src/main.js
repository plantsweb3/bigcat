import './style.css'

// ==================== SCROLL FADE-IN ====================
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  },
  { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
);

document.querySelectorAll('.fade-in').forEach((el) => observer.observe(el));

// ==================== CONTRACT ADDRESS COPY ====================
const copyBtn = document.getElementById('copyCA');
const caText = document.getElementById('caText');
const toast = document.getElementById('copiedToast');

if (copyBtn) {
  copyBtn.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(caText.textContent);
      toast.classList.add('show');
      setTimeout(() => toast.classList.remove('show'), 2000);
    } catch {
      // Clipboard API not available
    }
  });
}

// ==================== YOUTUBE MUSIC PLAYER ====================
let player = null;
let isPlaying = false;

const musicToggle = document.getElementById('musicToggle');
const musicIcon = document.getElementById('musicIcon');
const musicLabel = document.getElementById('musicLabel');

function setPlayingUI() {
  isPlaying = true;
  musicIcon.textContent = '\u{1F50A}';
  musicLabel.textContent = 'PLAYING';
  musicToggle.classList.add('playing');
}

function setMutedUI() {
  isPlaying = false;
  musicIcon.textContent = '\u{1F507}';
  musicLabel.textContent = 'UNMUTE';
  musicToggle.classList.remove('playing');
}

// Load YouTube IFrame API
const tag = document.createElement('script');
tag.src = 'https://www.youtube.com/iframe_api';
document.head.appendChild(tag);

window.onYouTubeIframeAPIReady = function () {
  player = new YT.Player('ytPlayerWrap', {
    width: '1',
    height: '1',
    videoId: 'RBw7uvG19uw',
    playerVars: {
      autoplay: 1,
      loop: 1,
      start: 38,
      playlist: 'RBw7uvG19uw',
      controls: 0,
      showinfo: 0,
      modestbranding: 1,
      playsinline: 1,
    },
    events: {
      onReady: (event) => {
        // Try to play unmuted immediately
        event.target.unMute();
        event.target.setVolume(50);
        event.target.playVideo();
        setPlayingUI();
      },
      onStateChange: (event) => {
        // If the browser blocked unmuted autoplay, the player won't actually play.
        // Detect that and fall back to muted autoplay + prompt user.
        if (event.data === YT.PlayerState.PLAYING && !isPlaying) {
          setPlayingUI();
        }
      },
    },
  });

  // Browsers may block unmuted autoplay. After a short delay, check if
  // the player is actually muted despite our request — if so, update UI.
  setTimeout(() => {
    if (player && typeof player.isMuted === 'function' && player.isMuted()) {
      setMutedUI();
    }
  }, 1500);
};

if (musicToggle) {
  musicToggle.addEventListener('click', () => {
    if (!player) return;

    if (isPlaying) {
      player.mute();
      setMutedUI();
    } else {
      player.unMute();
      player.setVolume(50);
      player.playVideo();
      setPlayingUI();
    }
  });
}

// ==================== PARALLAX (subtle) ====================
const heroBigcat = document.querySelector('.hero-bigcat');
const heroLogo = document.querySelector('.hero-logo');

window.addEventListener('scroll', () => {
  const scrollY = window.scrollY;
  if (heroBigcat && scrollY < window.innerHeight) {
    heroBigcat.style.transform = `translateY(${-15 + scrollY * 0.05}px)`;
  }
  if (heroLogo && scrollY < window.innerHeight) {
    heroLogo.style.transform = `translateY(${scrollY * 0.1}px)`;
  }
});
