'use strict';

// The native app plays the bundled files through Android. The PWA uses the
// same recordings through Web Audio, unlocked by the driver's tap.
(() => {
  let ticket = 0;
  let timer = null;
  let context = null;
  const buffers = new Map();
  const playing = new Set();
  const gongPath = 'audio/chimes/ding_dong.mp3';
  const noticeGong = 'audio/chimes/dong_dong_ding.mp3';
  const phrase = name => `audio/phrases/${name}.mp3`;

  // The driver's current stop is also the arrival event in this simulation.
  window.buildStopAnnouncement = (name, trip = state.active) => {
    const stop = (window.STOP_ANNOUNCEMENTS || {})[name];
    if (!stop) return null;
    const paths = [gongPath, phrase('naechste_haltestelle'), stop];
    if (name === 'Hauptbahnhof') {
      paths.push(phrase('next_stop_central_station'), phrase('umstieg_stadtbus_busbahnhof'));
      const previous = trip?.plan?.stops?.[trip.position - 1]?.name;
      if (String(trip?.plan?.line).trim() === '5' && previous === 'Anger') {
        paths.push(noticeGong, phrase('fahrt_endet_hier'));
      }
    } else if (name === 'Anger') {
      paths.push(phrase('next_stop_town_hall'), noticeGong, phrase('umstieg_alle_stadtbahnlinien'));
    }
    return paths;
  };

  function nativeAvailable() {
    return window.AndroidAnnouncements &&
      typeof window.AndroidAnnouncements.playSequence === 'function';
  }

  function audioContext() {
    if (!context) {
      const Context = window.AudioContext || window.webkitAudioContext;
      if (!Context) throw new Error('Dieses Gerät unterstützt die Audiowiedergabe nicht.');
      context = new Context();
    }
    return context;
  }

  function loadBuffer(path) {
    if (!buffers.has(path)) {
      const promise = fetch(path).then(response => {
        if (!response.ok) throw new Error('Eine Audiodatei konnte nicht geladen werden.');
        return response.arrayBuffer();
      }).then(bytes => audioContext().decodeAudioData(bytes)).catch(error => {
        buffers.delete(path);
        throw error;
      });
      buffers.set(path, promise);
    }
    return buffers.get(path);
  }

  window.onAnnouncementError = message => {
    if (typeof showToast === 'function') {
      showToast(message || 'Die Haltestellenansage konnte nicht abgespielt werden.');
    }
  };

  window.prepareAnnouncementAudio = () => {
    if (nativeAvailable()) return;
    try {
      const ctx = audioContext();
      // resume() must be called during the button's user gesture, before the
      // one-second timer runs; otherwise mobile browsers can block sound.
      ctx.resume().catch(() => {});
      const paths = [gongPath, noticeGong, phrase('naechste_haltestelle'),
        ...Object.values(window.STOP_ANNOUNCEMENTS || {})];
      paths.forEach(path => { loadBuffer(path).catch(() => {}); });
    } catch (error) {
      // Show an error only when an actual announcement is requested.
    }
  };

  window.cancelStopAnnouncement = () => {
    ++ticket;
    clearTimeout(timer);
    timer = null;
    for (const source of playing) {
      source.onended = null;
      try { source.stop(); } catch (error) { /* Already finished. */ }
      source.disconnect();
    }
    playing.clear();
    if (window.speechSynthesis) window.speechSynthesis.cancel();
    if (window.AndroidAnnouncements && typeof window.AndroidAnnouncements.stop === 'function') {
      window.AndroidAnnouncements.stop();
    }
  };

  function playBuffer(buffer, expectedTicket) {
    return new Promise(resolve => {
      if (expectedTicket !== ticket) { resolve(false); return; }
      const source = audioContext().createBufferSource();
      source.buffer = buffer;
      source.connect(context.destination);
      playing.add(source);
      source.onended = () => {
        playing.delete(source);
        source.disconnect();
        resolve(expectedTicket === ticket);
      };
      source.start();
    });
  }

  function speakCustomStop(name) {
    if (!window.speechSynthesis || !window.SpeechSynthesisUtterance) {
      throw new Error('Für diesen Haltestellennamen ist keine deutsche Sprachausgabe verfügbar.');
    }
    const voices = window.speechSynthesis.getVoices().filter(voice => /^de(?:-|_)/i.test(voice.lang));
    voices.sort((a, b) => {
      const score = voice => (voice.localService ? 10 : 0) +
        (/Kerstin|Katja|Anna|Marlene|Vicki|female|weiblich/i.test(voice.name) ? 20 : 0);
      return score(b) - score(a);
    });
    const utterance = new SpeechSynthesisUtterance(`Nächste Haltestelle, ${name}.`);
    utterance.lang = 'de-DE';
    utterance.rate = 0.94;
    if (voices[0]) utterance.voice = voices[0];
    utterance.onerror = event => {
      if (!['canceled', 'interrupted'].includes(event.error)) {
        window.onAnnouncementError('Die deutsche Sprachausgabe ist auf diesem Gerät nicht verfügbar.');
      }
    };
    window.speechSynthesis.speak(utterance);
  }

  async function playAnnouncement(name, expectedTicket) {
    const paths = window.buildStopAnnouncement(name);
    if (!paths) {
      // Imported, unrecorded station names retain the existing speech fallback.
      if (window.AndroidAnnouncements?.play) window.AndroidAnnouncements.play(name, '');
      else speakCustomStop(name);
      return;
    }
    if (nativeAvailable()) {
      window.AndroidAnnouncements.playSequence(name, JSON.stringify(paths));
      return;
    }
    const ctx = audioContext();
    if (ctx.state !== 'running') {
      throw new Error('Ton ist noch gesperrt. Bitte „Nächster Halt“ erneut antippen.');
    }
    // Decode the complete queue first; await each clip's end before the next.
    const queue = await Promise.all(paths.map(loadBuffer));
    if (expectedTicket !== ticket) return;
    for (const buffer of queue) {
      if (expectedTicket !== ticket || !await playBuffer(buffer, expectedTicket)) break;
    }
  }

  window.scheduleStopAnnouncement = (tripId, position, name) => {
    const expectedTicket = ticket;
    clearTimeout(timer);
    timer = setTimeout(() => {
      timer = null;
      const active = state.active;
      if (expectedTicket !== ticket || !active || active.id !== tripId ||
          active.status !== 'running' || active.position !== position ||
          currentView !== 'driver' || document.hidden ||
          document.getElementById('currentStop')?.textContent !== name) return;
      playAnnouncement(name, expectedTicket).catch(error => {
        if (expectedTicket === ticket) window.onAnnouncementError(error.message);
      });
    }, 1000);
  };

  window.onNativeAnnouncementPause = window.cancelStopAnnouncement;
  window.onNativeBackupResult = (success, message) => {
    if (typeof showToast === 'function') showToast(message || (success ? 'Datensicherung gespeichert.' : 'Die Datensicherung konnte nicht gespeichert werden.'));
  };

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) window.cancelStopAnnouncement();
  });
  window.addEventListener('pagehide', window.cancelStopAnnouncement);
})();
