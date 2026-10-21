'use strict';

// The native app plays the bundled files through Android. The PWA uses the
// same recordings through Web Audio, unlocked by the driver's tap.
(() => {
  let ticket = 0;
  let timer = null;
  let context = null;
  const buffers = new Map();
  const playing = new Map();
  const gongPath = 'audio/chimes/ding_dong.mp3';
  const noticeGong = 'audio/chimes/dong_dong_ding.mp3';
  const phrase = name => `audio/phrases/${name}.mp3`;
  const recordedAliases = {
    'Lutherkirche/SWE': 'Lutherkirche Stadtwerke',
    'Boyneburgufer': 'Boyneburg Ufer',
    'Stadtmuseum/Kaisersaal': 'Stadtmuseum Kaisersaal',
    'S-Finanzzentrum': 'Sparkassen Finanzzentrum',
    'Vilniuser Straße': 'Vilniusser Straße',
    'Volkenroder Weg': 'Volkenrodaer Weg'
  };
  const recordingKey = name => String(name).toLowerCase().normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '').replace(/ß/g, 'ss').replace(/[^a-z0-9]/g, '');
  window.recordedStopPath = name => {
    const mapping = window.STOP_ANNOUNCEMENTS || {};
    const recordedName = recordedAliases[name] || name;
    if (Object.prototype.hasOwnProperty.call(mapping, recordedName)) return mapping[recordedName];
    const key = recordingKey(recordedName);
    const matches = Object.keys(mapping).filter(candidate => recordingKey(candidate) === key);
    return matches.length === 1 ? mapping[matches[0]] : null;
  };
  let driverEffect = false;
  let nativeEffect = null;
  window.onNativeDriverSoundEnd = (requestId, completed) => {
    if (!nativeEffect || nativeEffect.ticket !== requestId) return;
    const pending = nativeEffect;
    nativeEffect = null;
    driverEffect = false;
    pending.resolve(completed === true);
  };
  const effects = new Set(['door_open','door_close','door_closed','emergency','traffic','passenger','finish','back']);
  window.stopDriverSound = () => { if (driverEffect) window.cancelStopAnnouncement(); };
  window.playDriverSound = async (id, bundle = null) => {
    if (!effects.has(id)) return false;
    if (id!=='door_closed' && cabFollowSoundGate) { const queuedTicket=ticket; if (!await cabFollowSoundGate.promise || queuedTicket!==ticket) return false; }
    window.cancelStopAnnouncement();
    if (state.settings.cockpit_muted) return true;
    driverEffect = true;
    const expectedTicket = ticket;
    const fallback = `audio/effects/${id}.mp3`;
    const path = (bundle?.sounds.effects[id] || driverSoundPath(id)) || fallback;
    try {
      if (nativeAvailable() && typeof window.AndroidAnnouncements.playEffect === 'function') {
        return await new Promise(resolve => {
          nativeEffect = {ticket:expectedTicket, resolve};
          if (path !== fallback && typeof window.AndroidAnnouncements.playEffectAsset === 'function') {
            window.AndroidAnnouncements.playEffectAsset(path, id, expectedTicket);
          } else window.AndroidAnnouncements.playEffect(id, expectedTicket);
        });
      }
      await audioContext().resume();
      let buffer;
      try { buffer = await loadBuffer(path); }
      catch (error) {
        if (path === fallback || expectedTicket !== ticket) throw error;
        buffer = await loadBuffer(fallback);
      }
      const completed = expectedTicket === ticket && await playBuffer(buffer, expectedTicket);
      if (expectedTicket === ticket) driverEffect = false;
      return completed;
    } catch (error) {
      if (expectedTicket === ticket) { driverEffect = false; window.onAnnouncementError('Der Fahrpult-Sound konnte nicht abgespielt werden.'); }
      if (nativeEffect?.ticket === expectedTicket) { nativeEffect.resolve(false); nativeEffect = null; }
      return false;
    }
  };

  // The driver's current stop is also the arrival event in this simulation.
  window.buildStopAnnouncement = (name, trip = state.active) => {
    const stop = window.recordedStopPath(name);
    if (!stop) return null;
    const paths = [gongPath, phrase('naechste_haltestelle'), stop];
    if (name === 'Hauptbahnhof') {
      paths.push(phrase('next_stop_central_station'), phrase('umstieg_stadtbus_busbahnhof'));
      const previous = trip?.plan?.stops?.[trip.position - 1]?.name;
      if (String(trip?.plan?.line).trim() === '5' && previous === 'Anger') {
        paths.push(noticeGong, phrase('fahrt_endet_hier'));
      }
    } else if (name === 'Anger') {
      paths.push(noticeGong, phrase('umstieg_alle_stadtbahnlinien'));
    } else if (name === 'Fischmarkt/Rathaus') {
      paths.push(phrase('next_stop_town_hall'));
    }
    return paths;
  };

  // Audition an example announcement without creating or advancing a trip.
  window.playStopAnnouncementPreview = async name => {
    window.cancelStopAnnouncement();
    if (state.settings.cockpit_muted) return true;
    const paths = window.buildStopAnnouncement(name, null), expectedTicket = ticket;
    if (!paths) return false;
    driverEffect = true;
    try {
      if (nativeAvailable()) {
        window.AndroidAnnouncements.playSequence(name, JSON.stringify(paths));
        return null; // Native announcement sequences have no completion callback.
      }
      await audioContext().resume();
      const queue = await Promise.all(paths.map(loadBuffer));
      for (const buffer of queue) {
        if (expectedTicket !== ticket || !await playBuffer(buffer, expectedTicket)) return false;
      }
      if (expectedTicket === ticket) driverEffect = false;
      return expectedTicket === ticket;
    } catch {
      if (expectedTicket === ticket) { driverEffect = false; window.onAnnouncementError('Die Hörprobe konnte nicht abgespielt werden.'); }
      return false;
    }
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
    if (nativeEffect) { nativeEffect.resolve(false); nativeEffect = null; }
    driverEffect = false;
    ++ticket;
    clearTimeout(timer);
    timer = null;
    for (const [source, resolve] of playing) {
      source.onended = null;
      try { source.stop(); } catch (error) { /* Already finished. */ }
      source.disconnect();
      resolve(false);
    }
    playing.clear();
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
      playing.set(source, resolve);
      source.onended = () => {
        playing.delete(source);
        source.disconnect();
        resolve(expectedTicket === ticket);
      };
      source.start();
    });
  }

  async function playAnnouncement(name, expectedTicket) {
    if (cabFollowSoundGate && !await cabFollowSoundGate.promise) return;
    if (expectedTicket !== ticket) return;
    const paths = window.buildStopAnnouncement(name);
    if (!paths) {
      window.onAnnouncementError(`Für „${name}“ ist keine Aufnahme vorhanden.`);
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
