import './style.css'

// ==================== FORCE SCROLL TO TOP ON LOAD ====================
if ('scrollRestoration' in history) {
  history.scrollRestoration = 'manual';
}
window.scrollTo(0, 0);

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

// Hero contract address copy
const copyBtnHero = document.getElementById('copyCAHero');
const caTextHero = document.getElementById('caTextHero');
const toastHero = document.getElementById('copiedToastHero');

if (copyBtnHero) {
  copyBtnHero.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(caTextHero.textContent);
      toastHero.classList.add('show');
      setTimeout(() => toastHero.classList.remove('show'), 2000);
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

// Start bouncing immediately on load
if (musicToggle) musicToggle.classList.add('bounce');

function setPlayingUI() {
  isPlaying = true;
  musicIcon.textContent = '\u{1F50A}';
  musicLabel.textContent = 'PLAYING';
  musicToggle.classList.add('playing');
  musicToggle.classList.remove('bounce');
}

function setMutedUI() {
  isPlaying = false;
  musicIcon.textContent = '\u{1F507}';
  musicLabel.textContent = 'PLAY ME';
  musicToggle.classList.remove('playing');
  musicToggle.classList.add('bounce');
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
      autoplay: 0,
      loop: 1,
      start: 38,
      playlist: 'RBw7uvG19uw',
      controls: 0,
      showinfo: 0,
      modestbranding: 1,
      playsinline: 1,
    },
    events: {
      onReady: () => {
        // Don't autoplay — wait for user to click PLAY ME
      },
    },
  });
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

// ==================== SIZE MATTERS AUTO-SCROLL ====================
const catsScroll = document.querySelector('.cats-scroll');
let autoScrollStarted = false;
let autoScrollId = null;

if (catsScroll) {
  const sizeObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !autoScrollStarted) {
          autoScrollStarted = true;
          let speed = 0.8;
          const autoScroll = () => {
            // Stop if user has manually scrolled or we've reached the end
            const maxScroll = catsScroll.scrollWidth - catsScroll.clientWidth;
            if (catsScroll.scrollLeft >= maxScroll) return;
            catsScroll.scrollLeft += speed;
            autoScrollId = requestAnimationFrame(autoScroll);
          };
          autoScrollId = requestAnimationFrame(autoScroll);
        }
        // If it leaves view, allow re-trigger and stop current scroll
        if (!entry.isIntersecting) {
          autoScrollStarted = false;
          if (autoScrollId) cancelAnimationFrame(autoScrollId);
        }
      });
    },
    { threshold: 0.3 }
  );
  sizeObserver.observe(catsScroll);

  // Stop auto-scroll if user touches/scrolls manually
  catsScroll.addEventListener('pointerdown', () => {
    if (autoScrollId) cancelAnimationFrame(autoScrollId);
  });
  catsScroll.addEventListener('wheel', () => {
    if (autoScrollId) cancelAnimationFrame(autoScrollId);
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

// ==================== SIGHTINGS BIGCAT PEEK ====================
const folderBigcat = document.querySelector('.folder-bigcat');
const sightingsSection = document.querySelector('.sightings');

if (folderBigcat && sightingsSection) {
  const peekObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          folderBigcat.classList.add('peek-anim');
          folderBigcat.addEventListener('animationend', () => {
            folderBigcat.classList.remove('peek-anim');
          }, { once: true });
        }
      });
    },
    { threshold: 0.4 }
  );
  peekObserver.observe(sightingsSection);
}
