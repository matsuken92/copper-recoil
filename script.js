// Analytics must never interrupt playback or contact actions, even if blocked.
function trackEvent(name, parameters = {}) {
  if (typeof window.gtag !== 'function') return;
  try {
    window.gtag('event', name, parameters);
  } catch {
    // Keep the site usable if the analytics integration fails.
  }
}

const menu = document.querySelector('.menu-panel');
const openButton = document.querySelector('.menu-trigger');
const closeButton = document.querySelector('.menu-close');

function setMenu(open) {
  if (open) {
    menu.showModal();
    closeButton.focus();
  } else {
    menu.close();
  }
  openButton.setAttribute('aria-expanded', String(open));
  document.body.classList.toggle('menu-open', open);
}

openButton.addEventListener('click', () => setMenu(true));
closeButton.addEventListener('click', () => setMenu(false));
document.querySelectorAll('.menu-panel__nav a').forEach((link) => {
  link.addEventListener('click', () => setMenu(false));
});

// Native dialog handles Escape, focus containment, and return to the trigger.
menu.addEventListener('close', () => {
  openButton.setAttribute('aria-expanded', 'false');
  document.body.classList.remove('menu-open');
});

// Content remains readable when JavaScript or IntersectionObserver is unavailable.
if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.remove('is-pending');
      observer.unobserve(entry.target);
    });
  }, { threshold: .08 });

  document.querySelectorAll('.reveal').forEach((element) => {
    element.classList.add('is-pending');
    observer.observe(element);
  });
}

const trackSources = {
  'track-audio': ['YXNzZXRzL21lZGlh', 'L2hpa2FyaV9ub19r', 'b2t5dS5tcDM/dj1k', 'NzZhMzYxMjQ0NzY='],
};
const stopTracks = new Map();

document.querySelectorAll('.music-player').forEach((player) => {
  const source = trackSources[player.querySelector('audio').id];
  const title = player.closest('.music-track').querySelector('h3').textContent.trim();
  const trackAudio = player.querySelector('audio');
  const trackControls = player.querySelector('.music-player__controls');
  const trackToggle = player.querySelector('.music-player__toggle');
  const trackPlayIcon = player.querySelector('.music-player__play');
  const trackPauseIcon = player.querySelector('.music-player__pause');
  const trackSeek = player.querySelector('.music-player__seek');
  const trackElapsed = player.querySelector('.music-player__elapsed');
  const trackDuration = player.querySelector('.music-player__duration');
  const trackStatus = player.querySelector('.music-player__status');
  let trackRequested = false;
  let trackRequestId = 0;
  let trackStarted = false;
  const trackParameters = { track_id: trackAudio.id, track_name: title };

  function formatTrackTime(seconds) {
    const total = Math.max(0, Math.floor(seconds || 0));
    return `${Math.floor(total / 60)}:${String(total % 60).padStart(2, '0')}`;
  }

  function updateTrackButton(playing) {
    trackRequested = playing;
    trackToggle.setAttribute('aria-label', `${title}を${playing ? '一時停止' : '再生'}`);
    trackPlayIcon.toggleAttribute('hidden', playing);
    trackPauseIcon.toggleAttribute('hidden', !playing);
  }

  function updateTrackTime() {
    const duration = Number.isFinite(trackAudio.duration) ? trackAudio.duration : 0;
    const current = trackAudio.currentTime;
    trackSeek.disabled = duration <= 0 || Boolean(trackAudio.error);
    trackSeek.max = duration;
    trackSeek.value = current;
    trackSeek.style.setProperty('--progress', `${duration ? current / duration * 100 : 0}%`);
    trackSeek.setAttribute('aria-valuetext', `${Math.floor(current / 60)}分${Math.floor(current % 60)}秒`);
    trackElapsed.textContent = formatTrackTime(current);
    trackDuration.textContent = duration ? formatTrackTime(duration) : '—:—';
  }

  function stopTrack() {
    ++trackRequestId;
    trackAudio.pause();
    updateTrackButton(false);
    trackStatus.textContent = '';
  }

  stopTracks.set(trackAudio, stopTrack);
  trackControls.hidden = false;
  trackToggle.addEventListener('click', async () => {
    const requestId = ++trackRequestId;
    if (trackRequested) {
      trackAudio.pause();
      updateTrackButton(false);
      trackStatus.textContent = '';
      return;
    }

    stopTracks.forEach((stop, audio) => {
      if (audio !== trackAudio) stop();
    });

    // A small deterrent to casual saving, not encryption or access control.
    // Keep the source out of the initial HTML/DOM and load only on user request.
    if (!trackAudio.hasAttribute('src')) {
      trackAudio.src = atob(source.join(''));
    } else if (trackAudio.error) {
      trackAudio.load();
    }
    updateTrackButton(true);
    trackStatus.textContent = '読み込み中…';
    try {
      // Call play in the click handler to preserve mobile user activation.
      await trackAudio.play();
      if (requestId === trackRequestId) trackStatus.textContent = '';
    } catch (error) {
      if (requestId !== trackRequestId) return;
      updateTrackButton(false);
      trackStatus.textContent = error.name === 'NotAllowedError'
        ? '再生ボタンをもう一度押してください。'
        : '音源を再生できませんでした。時間をおいて再度お試しください。';
    }
  });

  trackAudio.addEventListener('play', () => {
    stopTracks.forEach((stop, audio) => {
      if (audio !== trackAudio) stop();
    });
    updateTrackButton(true);
  });
  trackAudio.addEventListener('playing', () => {
    trackStatus.textContent = '';
    // Count actual playback once, not play attempts, resumes, or buffering.
    if (!trackStarted) {
      trackStarted = true;
      trackEvent('music_start', trackParameters);
    }
  });
  trackAudio.addEventListener('pause', () => {
    updateTrackButton(false);
    if (!trackAudio.error) trackStatus.textContent = '';
  });
  trackAudio.addEventListener('waiting', () => {
    if (trackRequested) trackStatus.textContent = '読み込み中…';
  });
  trackAudio.addEventListener('ended', () => {
    updateTrackButton(false);
    trackStatus.textContent = '再生が終了しました。';
    updateTrackTime();
    // ended means the playhead reached the end, including after seeking.
    if (trackStarted) {
      trackStarted = false;
      trackEvent('music_complete', trackParameters);
    }
  });
  trackAudio.addEventListener('error', () => {
    ++trackRequestId;
    updateTrackButton(false);
    trackSeek.disabled = true;
    trackStatus.textContent = '音源を再生できませんでした。時間をおいて再度お試しください。';
  });
  ['loadedmetadata', 'durationchange', 'timeupdate'].forEach((event) => {
    trackAudio.addEventListener(event, updateTrackTime);
  });
  trackSeek.addEventListener('input', () => {
    trackAudio.currentTime = Number(trackSeek.value);
    updateTrackTime();
  });
});

const revealContact = document.querySelector('.contact__reveal');
const contactDetails = document.querySelector('.contact__details');
const contactEmail = document.querySelector('.contact__email');
const copyContact = document.querySelector('.contact__copy-button');
const contactStatus = document.querySelector('.contact__status');

// Obfuscation deters simple address harvesters; it cannot block bots that run JS.
// Decode only after an explicit click, never during the initial page render.
revealContact.hidden = false;
revealContact.addEventListener('click', () => {
  const address = atob('Y29wcGVyLnJlY29pbEBnbWFpbC5jb20=');
  contactEmail.textContent = address;
  contactEmail.href = `mailto:${address}`;
  contactDetails.hidden = false;
  revealContact.setAttribute('aria-expanded', 'true');
  revealContact.hidden = true;
  contactStatus.textContent = 'アドレスを選ぶとメールアプリが開きます。';
  contactEmail.focus({ preventScroll: true });
  trackEvent('contact_reveal');
}, { once: true });

contactEmail.addEventListener('click', () => {
  // This records intent to contact, not a sent email. Do not send the address.
  trackEvent('contact_email_click');
});

copyContact.addEventListener('click', async () => {
  try {
    await navigator.clipboard.writeText(contactEmail.textContent);
    contactStatus.textContent = 'メールアドレスをコピーしました。';
    trackEvent('contact_copy');
  } catch {
    contactStatus.textContent = 'コピーできませんでした。アドレスを選択してコピーしてください。';
  }
});
