
(function() {
  'use strict';

  // === Configuration ===
  const CONFIG = {
    donateLink: 'https://paypal.me/iFredZ',
    reportEmail: 'finjalrac@gmail.com',
    defaultLatitude: 44.21446,
    defaultLongitude: 4.028,
    clippingAdjustment: 10,
    sensorEventName: ('ondeviceorientationabsolute' in window) ? 'deviceorientationabsolute' : 'deviceorientation',
    stability: { samples: 10, tiltTol: 0.6, azTol: 4 } // ~1s at 60Hz
  };

  // === Texts (FR only for Play Store Android) ===
  const t = {
    geoloc_error: "Erreur géoloc.",
    geoloc_not_supported: "Géolocalisation non supportée.",
    location_unavailable: "Impossible d’obtenir la position.",
    location_getting: "Obtention de la position...",
    activate_sensors: "Utiliser Capteurs",
    stop_sensors: "Arrêter Capteurs",
    manual_entry: "Saisie Manuelle",
    location: "Localisation",
    latitude_placeholder: "Latitude requise",
    target_date: "Date Cible",
    current_angle: "Angle Actuel",
    orientation: "Orientation",
    memorize_action: "Mémoriser",
    memorized: "Mémorisé !",
    calibrate_tilt: "Calibrer à plat",
    calibrate_tilt_success: "Calibration effectuée !",
    calibrate_tilt_failed: "Échec calibration.",
    now: "Aujourd'hui",
    spring: "Printemps",
    summer: "Été",
    autumn: "Automne",
    winter: "Hiver",
    recommended_tilt: "Inclinaison recommandée",
    with_clipping: "(optimisée écrêtage)",
    non_optimized: "(non optimisée)",
    orientation_south: "Sud",
    orientation_deviation: "Écart orientation",
    estimation_title: "Estimation de Production",
    peak_power: "Puissance crête (kWc)",
    prod_current_settings: "Production (votre inclinaison)",
    prod_optimal_settings: "Production (inclinaison optimale)",
    prod_truly_optimal: "Production vraiment optimale (0° / Sud)",
    daily_gain: "Gain potentiel quotidien",
    monthly_gain: "Gain potentiel mensuel",
    export_pdf: "Exporter en PDF",
    donation_message: "Si cette application vous aide, vous pouvez m'offrir un café ☕",
    pvgis_error: "Erreur communication PVGIS.",
    fill_all_fields_error: "Veuillez remplir tous les champs valides.",
    settings_already_optimal: "Vos réglages actuels sont déjà optimaux.",
    main_guide_title: "Guide d'Utilisation",
    got_it: "Compris",
    estimation_guide_title: "Guide Estimation",
    estimation_guide_step1_title: "Renseignez vos paramètres",
    estimation_guide_step1_desc: "Indiquez la puissance crête, la technologie et les pertes si nécessaire.",
    estimation_guide_step2_title: "Lancez le calcul",
    estimation_guide_step2_desc: "Nous interrogeons PVGIS et affichons la production.",
    light_theme_label: "Thème clair",
    button_style_label: "Style du bouton Mémoriser",
    button_style_default: "Classique HD",
    button_style_neon: "Neon Reactor",
    button_style_glass: "Glass Core",
    button_style_radar: "Radar Lock-On",
    onboarding_prev: "Précédent",
    onboarding_next: "Suivant",
    onboarding_finish: "C'est parti",
    onboarding_step1_title: "Calibrez à plat",
    onboarding_step1_desc: "Posez le téléphone bien à plat puis appuyez sur “Calibrer à plat”.",
    onboarding_step2_title: "Activez les capteurs",
    onboarding_step2_desc: "Autorisez l'accès capteurs pour mesurer inclinaison et orientation.",
    onboarding_step3_title: "Placez le téléphone",
    onboarding_step3_desc: "Parfaitement parallèle au bord supérieur du panneau.",
    onboarding_step4_title: "Mémorisez",
    onboarding_step4_desc: "Quand l'icône devient stable, appuyez sur “Mémoriser”.",
    truly_optimal_hint: "Pour référence : production vraiment optimale si le panneau était orienté 0°/Sud et incliné à l'angle recommandé.",
    calculate_gain_long: "Calculer le gain"
  };

  // === DOM ===
  const $ = (id) => document.getElementById(id);
  const dom = {
    // Header / nav
    mainPage: $('app-container'),
    mainSection: $('main-page'),
    settingsPage: $('settings-page'),
    backButton: $('back-button'),
    settingsButton: $('settings-button'),
    settingsModal: $('settings-modal'),
    clippingHelpButton: $('clipping-help-button'),
    mainHelpModal: $('main-help-modal'),
    settingsHelpModal: $('settings-help-modal'),
    settingsHelpButton: $('settings-help-button'),

    // Inputs + displays (Main)
    latInput: $('latitude-input'),
    dateInput: $('date-input'),
    tiltDisplay: $('measured-tilt'),
    compassDisplay: $('current-compass'),
    currentAngleDisplay: $('current-angle'),
    recommendedTiltDisplay: $('recommended-tilt-display'),
    seasonal: {
      today: $('today-tilt-small'),
      spring: $('spring-tilt'),
      summer: $('summer-tilt'),
      autumn: $('autumn-tilt'),
      winter: $('winter-tilt')
    },
    sensorsReadout: $('sensors-readout'),
    sensorError: $('sensor-error'),
    compassRoseContainer: $('compass-rose-container'),

    // Controls
    activateSensorsBtn: $('activate-sensors-button'),
    useManualBtn: $('use-manual-button'),
    geolocateBtn: $('geolocate-btn'),
    calibrateTiltBtn: $('calibrate-tilt-btn'),
    memorizeWrapper: $('memorize-btn-wrapper'),
    memorizeBtn: $('memorize-btn'),
    gotoEstimationBtn: $('calculate-gain'),
    clippingCheckbox: $('clipping-checkbox'),

    // Manual inputs
    manualTiltInput: $('manual-tilt-input'),
    manualAzimuthInput: $('manual-azimuth-input'),

    // Estimation page
    peakPowerInput: $('peak-power'),
    lonInput: $('longitude-input'),
    currentTiltInput: $('current-tilt-input'),
    currentAzimuthInput: $('current-azimuth-input'),
    calculateProductionBtn: $('calculate-production'),
    calculateText: $('calculate-text'),
    calculateLoader: $('calculate-loader'),
    resultsBox: $('production-results'),
    currentProductionDisplay: $('current-production'),
    optimalProductionDisplay: $('optimal-production'),
    trulyOptimalProductionDisplay: $('truly-optimal-production'),
    potentialGainDisplay: $('potential-gain'),
    potentialGainMonthlyDisplay: $('potential-gain-monthly'),
    pvgisError: $('pvgis-error'),
    exportPdfBtn: $('export-pdf-btn'),
    donationMessage: $('donation-message'),

    // Onboarding
    onboardingModal: $('onboarding-modal'),
    onboardingSlides: document.querySelectorAll('.onboarding-slide'),
    onboardingDots: document.querySelectorAll('.onboarding-dot'),
    onboardingPrevBtn: $('onboarding-prev-btn'),
    onboardingNextBtn: $('onboarding-next-btn'),
    onboardingFinishBtn: $('onboarding-finish-btn'),

    // Theming & styles
    themeToggle: $('theme-toggle'),
    memorizeStyleRadios: document.querySelectorAll('.memorize-style-radio'),

    // Footer
    donateButtonFab: $('donate-button-fab'),
    bugReportButton: $('bug-report-button')
  };

  // === State ===
  const state = {
    sensorsActive: false,
    zeroTiltOffset: 0, // calibration offset
    lastTilt: null,
    lastAzimuth: null,
    tiltBuffer: [],
    azBuffer: [],
    lastRecommendedTilt: null
  };

  // === Utils ===
  const utils = {
    log: (...args) => console.log('[OptiSolar]', ...args),
    toRadians: (deg) => deg * Math.PI / 180,
    toDegrees: (rad) => rad * 180 / Math.PI,
    getDayOfYear: (date) => Math.floor((date - new Date(date.getFullYear(), 0, 0)) / 86400000),
    getDeclination: (dayOfYear) => -23.44 * Math.cos(utils.toRadians((360 / 365) * (dayOfYear + 10))),
    clamp: (x, min, max) => Math.min(Math.max(x, min), max),
    normalizeAngle: (a) => (a % 360 + 360) % 360,
    fmt: (n, dec=2) => Number(n).toLocaleString('fr-FR', {minimumFractionDigits: dec, maximumFractionDigits: dec}),
    safeParseFloat: (v, fallback = NaN) => {
      if (v === null || v === undefined || v === '') return fallback;
      const s = String(v).replace(',', '.').trim();
      const n = parseFloat(s);
      return Number.isFinite(n) ? n : fallback;
    },
    playSuccess: async () => {
      try {
        const { Haptics, ImpactStyle } = Capacitor.Plugins;
        await Haptics.impact({ style: ImpactStyle.Light });
      } catch(e) {
        if (navigator.vibrate) navigator.vibrate(50);
      }
      try {
        const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(880, audioCtx.currentTime);
        gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
        gain.gain.linearRampToValueAtTime(0.0001, audioCtx.currentTime + 0.15);
        osc.connect(gain); gain.connect(audioCtx.destination);
        osc.start(); osc.stop(audioCtx.currentTime + 0.15);
      } catch(e) {}
    }
  };

  // === Theming ===
  const theme = {
    apply: (name) => {
      document.body.classList.toggle('light-mode', name === 'light');
      if (dom.themeToggle) dom.themeToggle.checked = (name === 'light');
      try { localStorage.setItem('userTheme', name); } catch(e){}
    },
    load: () => {
      let name = 'dark';
      try { name = localStorage.getItem('userTheme') || 'dark'; } catch(e){}
      theme.apply(name);
    },
    toggle: () => {
      const name = (dom.themeToggle && dom.themeToggle.checked) ? 'light' : 'dark';
      theme.apply(name);
    }
  };

  // === Sensors ===
  const sensors = {
    handleOrientation: (ev) => {
      // Some Android browsers provide 'alpha' relative; 'absolute' event preferred.
      let alpha = (typeof ev.alpha === 'number') ? ev.alpha : null;  // 0..360 (compass)
      let beta = (typeof ev.beta === 'number') ? ev.beta : null;    // -180..180 (front-back tilt)
      let gamma = (typeof ev.gamma === 'number') ? ev.gamma : null; // -90..90 (left-right tilt)

      if (alpha == null || beta == null || gamma == null) return;

      // Compute panel tilt from device orientation: assume device flat on panel top edge (portrait or landscape both work using absolute tilt magnitude)
      const x = beta, y = gamma;
      const rawTilt = utils.clamp(Math.abs(Math.atan(Math.sqrt(x*x + y*y) / 57.2958)) * 57.2958, 0, 90); // approx
      const tilt = utils.clamp(rawTilt - state.zeroTiltOffset, 0, 90);

      // Azimuth: convert alpha (0=N) to degrees from South (0=South, East negative)
      const compassFromNorth = utils.normalizeAngle(alpha);
      let azFromSouth = utils.normalizeAngle(180 - compassFromNorth);
      if (azFromSouth > 180) azFromSouth -= 360; // map to [-180, 180] where 0 is South, East negative

      state.lastTilt = tilt;
      state.lastAzimuth = azFromSouth;

      // push buffers
      sensors.pushSample(tilt, azFromSouth);
      sensors.updateUI();
    },
    pushSample: (tilt, az) => {
      state.tiltBuffer.push(tilt);
      state.azBuffer.push(az);
      if (state.tiltBuffer.length > CONFIG.stability.samples) state.tiltBuffer.shift();
      if (state.azBuffer.length > CONFIG.stability.samples) state.azBuffer.shift();
      // stability check
      if (state.tiltBuffer.length === CONFIG.stability.samples) {
        const tmin = Math.min(...state.tiltBuffer), tmax = Math.max(...state.tiltBuffer);
        const amin = Math.min(...state.azBuffer), amax = Math.max(...state.azBuffer);
        const stable = (tmax - tmin) <= CONFIG.stability.tiltTol && (amax - amin) <= CONFIG.stability.azTol;
        dom.memorizeWrapper.classList.toggle('stable', stable);
        dom.memorizeBtn.disabled = !stable;
        dom.memorizeBtn.setAttribute('aria-disabled', (!stable).toString());
      } else {
        dom.memorizeWrapper.classList.remove('stable');
        dom.memorizeBtn.disabled = true;
      }
    },
    updateUI: () => {
      if (state.lastTilt != null) {
        dom.tiltDisplay.textContent = utils.fmt(state.lastTilt, 1) + "°";
        dom.currentAngleDisplay.textContent = utils.fmt(state.lastTilt, 1) + "°";
      }
      if (state.lastAzimuth != null) {
        const abs = Math.abs(state.lastAzimuth);
        const dir = state.lastAzimuth < 0 ? "Est" : "Ouest";
        dom.compassDisplay.textContent = (abs < 1 ? "0" : utils.fmt(abs, 0)) + "° / " + (abs < 1 ? t.orientation_south : dir);
        const needle = document.querySelector('#compass-rose-container .needle');
        if (needle) needle.style.transform = `rotate(${state.lastAzimuth}deg)`;
      }
    },
    start: async () => {
      if (state.sensorsActive) return;
      state.tiltBuffer = []; state.azBuffer = [];
      state.sensorsActive = true;
      dom.sensorError.textContent = "";
      dom.activateSensorsBtn.classList.add('active');
      dom.activateSensorsBtn.querySelector('span').textContent = t.stop_sensors;

      // Android (WebView) generally doesn't require permissions; handle gracefully anyway
      try {
        if (window.DeviceOrientationEvent && typeof DeviceOrientationEvent.requestPermission === 'function') {
          const r = await DeviceOrientationEvent.requestPermission();
          if (r !== 'granted') throw new Error('permission denied');
        }
        window.addEventListener(CONFIG.sensorEventName, sensors.handleOrientation);
      } catch(e) {
        dom.sensorError.textContent = "Capteurs non disponibles.";
        state.sensorsActive = false;
        dom.activateSensorsBtn.classList.remove('active');
        dom.activateSensorsBtn.querySelector('span').textContent = t.activate_sensors;
      }
    },
    stop: () => {
      if (!state.sensorsActive) return;
      state.sensorsActive = false;
      window.removeEventListener(CONFIG.sensorEventName, sensors.handleOrientation);
      dom.activateSensorsBtn.classList.remove('active');
      dom.activateSensorsBtn.querySelector('span').textContent = t.activate_sensors;
    },
    calibrateFlat: () => {
      // When phone is placed perfectly flat on a horizontal surface
      state.zeroTiltOffset = state.lastTilt || 0;
      try { localStorage.setItem('zeroTiltOffset', String(state.zeroTiltOffset)); } catch(e){}
      alert(t.calibrate_tilt_success);
    }
  };

  // === Calculations ===
  const calculations = {
    // recommended tilt for date latitude (+ optional clipping)
    computeRecommendedTilt: (lat, date, clipping) => {
      const day = utils.getDayOfYear(date);
      const decl = utils.getDeclination(day);
      let recommended = lat - decl;
      recommended = utils.clamp(recommended, 0, 85);
      if (clipping) recommended = utils.clamp(recommended + CONFIG.clippingAdjustment, 0, 85);
      return recommended;
    },
    refreshRecommendedAndSeasonal: () => {
      const lat = utils.safeParseFloat(dom.latInput.value, NaN);
      const date = dom.dateInput.value ? new Date(dom.dateInput.value) : new Date();
      if (!Number.isFinite(lat)) { dom.recommendedTiltDisplay.textContent = "--°"; return; }
      const rec = calculations.computeRecommendedTilt(lat, date, dom.clippingCheckbox && dom.clippingCheckbox.checked);
      state.lastRecommendedTilt = rec;
      dom.recommendedTiltDisplay.textContent = utils.fmt(rec,0) + "°" + (dom.clippingCheckbox.checked ? " " + t.with_clipping : "");

      // Seasonal quick refs
      const year = date.getFullYear();
      const seasons = {
        today: date,
        spring: new Date(year, 2, 21),
        summer: new Date(year, 5, 21),
        autumn: new Date(year, 8, 23),
        winter: new Date(year, 11, 21)
      };
      const outMap = {
        today: dom.seasonal.today,
        spring: dom.seasonal.spring,
        summer: dom.seasonal.summer,
        autumn: dom.seasonal.autumn,
        winter: dom.seasonal.winter
      };
      Object.keys(outMap).forEach(k => {
        const rt = calculations.computeRecommendedTilt(lat, seasons[k], dom.clippingCheckbox.checked);
        if (outMap[k]) outMap[k].textContent = utils.fmt(rt,0) + "°";
      });
    }
  };

  // === API PVGIS ===
  const api = {
    cacheGet: (key) => {
      try { const v = sessionStorage.getItem(key); return v ? JSON.parse(v) : null; } catch(e) { return null; }
    },
    cacheSet: (key, val) => {
      try { sessionStorage.setItem(key, JSON.stringify(val)); } catch(e) {}
    },
    fetchPVGIS: async (lat, lon, peakpower, angle, aspect, loss=14) => {
      const key = `pvgis:${lat}:${lon}:${peakpower}:${angle}:${aspect}:${loss}`;
      const cached = api.cacheGet(key);
      if (cached) return cached;

      const url = `https://re.jrc.ec.europa.eu/api/PVcalc?lat=${lat}&lon=${lon}&peakpower=${peakpower}&loss=${loss}&angle=${angle}&aspect=${aspect}&outputformat=json`;

      const fetchWithTimeout = (resource, options={}) => {
        const { timeout = 12000 } = options;
        return new Promise((resolve, reject) => {
          const id = setTimeout(() => reject(new Error('timeout')), timeout);
          fetch(resource, options).then(res => { clearTimeout(id); resolve(res); }).catch(err => { clearTimeout(id); reject(err); });
        });
      };

      const strategies = [
        () => fetchWithTimeout(url, { timeout: 12000 }),
        () => fetchWithTimeout('https://thingproxy.freeboard.io/fetch/' + url, { timeout: 15000 }),
        () => fetchWithTimeout('https://api.allorigins.win/raw?url=' + encodeURIComponent(url), { timeout: 15000 })
      ];

      let lastErr = null;
      for (const strat of strategies) {
        try {
          const resp = await strat();
          if (!resp.ok) throw new Error('bad http ' + resp.status);
          const data = await resp.json();
          api.cacheSet(key, data);
          return data;
        } catch(e) { lastErr = e; }
      }
      throw lastErr || new Error('PVGIS failed');
    }
  };

  // === UI helpers ===
  const ui = {
    showPage: (page) => {
      dom.mainSection.classList.toggle('hidden', page !== 'main');
      dom.settingsPage.classList.toggle('hidden', page !== 'estimation');
      window.scrollTo(0,0);
    },
    updateMemorizeStyle: (style) => {
      const btn = dom.memorizeBtn;
      btn.classList.remove('btn-style-default','btn-style-neon','btn-style-glass','btn-style-radar');
      switch(style) {
        case 'neon': btn.classList.add('btn-style-neon'); break;
        case 'glass': btn.classList.add('btn-style-glass'); break;
        case 'radar': btn.classList.add('btn-style-radar'); break;
        default: btn.classList.add('btn-style-default');
      }
      try { localStorage.setItem('memorizeStyle', style); } catch(e){}
    },
    loadMemorizeStyle: () => {
      let style = 'default';
      try { style = localStorage.getItem('memorizeStyle') || 'default'; } catch(e){}
      ui.updateMemorizeStyle(style);
      // set radios
      dom.memorizeStyleRadios.forEach(r => { if (r.value === style) r.checked = true; });
    }
  };

  // === Estimation logic ===
  const estimation = {
    run: async () => {
      dom.pvgisError.textContent = "";
      const lat = utils.safeParseFloat(dom.latInput.value, NaN);
      const lon = utils.safeParseFloat(dom.lonInput.value, NaN);
      const peak = utils.safeParseFloat(dom.peakPowerInput.value, NaN);
      let curTilt = utils.safeParseFloat(dom.currentTiltInput.value, NaN);
      let curAz = utils.safeParseFloat(dom.currentAzimuthInput.value, NaN);

      if (!Number.isFinite(lat) || !Number.isFinite(lon) || !Number.isFinite(peak) || !Number.isFinite(curTilt) || !Number.isFinite(curAz)) {
        dom.pvgisError.textContent = t.fill_all_fields_error;
        return;
      }
      curTilt = utils.clamp(curTilt, 0, 85);
      curAz = utils.clamp(curAz, -180, 180);

      const optimalTilt = state.lastRecommendedTilt != null ? state.lastRecommendedTilt : calculations.computeRecommendedTilt(lat, new Date(), dom.clippingCheckbox.checked);
      const trulyAz = 0; // due south

      // UI: spinner
      dom.calculateText.classList.add('hidden'); dom.calculateLoader.classList.remove('hidden');

      try {
        const currentData = await api.fetchPVGIS(lat, lon, peak, curTilt, curAz);
        const optimalData = await api.fetchPVGIS(lat, lon, peak, optimalTilt, curAz);
        const trulyData   = await api.fetchPVGIS(lat, lon, peak, optimalTilt, trulyAz);

        const getMonthly = (d) => {
          try {
            if (d?.outputs?.monthly) {
              // Sum E_m from each month
              const months = d.outputs.monthly;
              if (Array.isArray(months)) {
                const sum = months.reduce((s,m)=> s + (Number(m.E_m)||0), 0);
                return { monthly: sum, yearly: Number(d.outputs.totals?.E_y) || sum };
              }
            }
          } catch(e){}
          // fallback: totals only
          return { monthly: NaN, yearly: Number(d?.outputs?.totals?.E_y)||NaN };
        };

        const cur = getMonthly(currentData);
        const opt = getMonthly(optimalData);
        const tru = getMonthly(trulyData);

        dom.currentProductionDisplay.textContent = isFinite(cur.yearly) ? utils.fmt(cur.yearly,0) + " kWh/an" : "--";
        dom.optimalProductionDisplay.textContent = isFinite(opt.yearly) ? utils.fmt(opt.yearly,0) + " kWh/an" : "--";
        dom.trulyOptimalProductionDisplay.textContent = isFinite(tru.yearly) ? utils.fmt(tru.yearly,0) + " kWh/an" : "--";

        // Gains (daily rough: yearly/365; monthly rough: yearly/12). This mirrors v3 behavior that displayed both
        const gainYear = (opt.yearly - cur.yearly);
        const gainDaily = gainYear / 365;
        const gainMonthly = gainYear / 12;

        if (isFinite(gainDaily)) dom.potentialGainDisplay.textContent = utils.fmt(gainDaily,1) + " kWh/j";
        if (isFinite(gainMonthly)) dom.potentialGainMonthlyDisplay.textContent = utils.fmt(gainMonthly,1) + " kWh/mois";

        dom.resultsBox.classList.remove('hidden');
      } catch(err) {
        dom.pvgisError.textContent = t.pvgis_error;
        console.error(err);
      } finally {
        dom.calculateText.classList.remove('hidden'); dom.calculateLoader.classList.add('hidden');
      }
    },
    exportPdf: () => {
      if (!window.html2pdf) return;
      const today = new Date();
      const report = document.createElement('div');
      report.style.background = "#fff";
      report.style.color = "#111827";
      report.style.padding = "16px";
      report.style.fontFamily = "Arial, sans-serif";
      report.innerHTML = `
        <div style="border:1px solid #e5e7eb;border-radius:8px;padding:16px">
          <h1 style="margin:0;color:#0ea5a4">Rapport Opti Solar</h1>
          <p style="margin:4px 0 0 0;color:#6b7280">Date: ${today.toLocaleDateString('fr-FR')}</p>
          <hr style="margin:12px 0;border:none;border-top:1px solid #e5e7eb" />
          <h2 style="margin-top:0;color:#111827">Paramètres</h2>
          <table style="width:100%;border-collapse:collapse;font-size:14px">
            <tr><td style="padding:6px;border:1px solid #e5e7eb">Latitude</td><td style="padding:6px;border:1px solid #e5e7eb">${dom.latInput.value}</td></tr>
            <tr><td style="padding:6px;border:1px solid #e5e7eb">Longitude</td><td style="padding:6px;border:1px solid #e5e7eb">${dom.lonInput.value}</td></tr>
            <tr><td style="padding:6px;border:1px solid #e5e7eb">Puissance crête</td><td style="padding:6px;border:1px solid #e5e7eb">${dom.peakPowerInput.value} kWc</td></tr>
            <tr><td style="padding:6px;border:1px solid #e5e7eb">Inclinaison actuelle</td><td style="padding:6px;border:1px solid #e5e7eb">${dom.currentTiltInput.value}°</td></tr>
            <tr><td style="padding:6px;border:1px solid #e5e7eb">Orientation actuelle</td><td style="padding:6px;border:1px solid #e5e7eb">${dom.currentAzimuthInput.value}° / Sud</td></tr>
          </table>
          <h2 style="color:#111827;margin-top:16px">Résultats</h2>
          <table style="width:100%;border-collapse:collapse;font-size:14px">
            <tr style="background:#f3f4f6"><td style="padding:6px;border:1px solid #e5e7eb">Production (réglages actuels)</td><td style="padding:6px;border:1px solid #e5e7eb">${dom.currentProductionDisplay.textContent}</td></tr>
            <tr><td style="padding:6px;border:1px solid #e5e7eb">Production (inclinaison optimale)</td><td style="padding:6px;border:1px solid #e5e7eb">${dom.optimalProductionDisplay.textContent}</td></tr>
            <tr><td style="padding:6px;border:1px solid #e5e7eb">Production vraiment optimale (0°/Sud)</td><td style="padding:6px;border:1px solid #e5e7eb">${dom.trulyOptimalProductionDisplay.textContent}</td></tr>
            <tr><td style="padding:6px;border:1px solid #e5e7eb">${t.daily_gain}</td><td style="padding:6px;border:1px solid #e5e7eb">${dom.potentialGainDisplay ? dom.potentialGainDisplay.textContent : "-"}</td></tr>
            <tr><td style="padding:6px;border:1px solid #e5e7eb">${t.monthly_gain}</td><td style="padding:6px;border:1px solid #e5e7eb">${dom.potentialGainMonthlyDisplay ? dom.potentialGainMonthlyDisplay.textContent : "-"}</td></tr>
          </table>
          <div style="margin-top:14px;font-size:12px;color:#374151">
            <h3 style="margin:0 0 6px 0;color:#111827">Explications</h3>
            <p>“Inclinaison optimale” utilise l’angle recommandé par latitude/date${dom.clippingCheckbox && dom.clippingCheckbox.checked ? " (avec optimisation écrêtage)" : ""}. “Vraiment optimale” suppose une orientation parfaite plein Sud (0°).</p>
          </div>
          <div style="margin-top:12px;border-top:1px solid #e5e7eb;padding-top:8px;font-size:11px;color:#6b7280">
            <strong>Décharge de responsabilité</strong><br/>
            Les résultats proviennent de PVGIS (JRC, Commission Européenne). Ils sont indicatifs et dépendent des conditions réelles d’installation.
          </div>
        </div>
      `;
      const filename = `OptiSolar_Rapport_${new Date().toISOString().split('T')[0]}.pdf`;
      html2pdf().from(report).set({
        margin: 10, filename, image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
      }).save();
    }
  };

  // === Handlers & init ===
  const handlers = {
    geolocate: () => {
      if (!navigator.geolocation) { alert(t.geoloc_not_supported); return; }
      dom.geolocateBtn.disabled = true;
      dom.geolocateBtn.querySelector('span').textContent = t.location_getting;
      navigator.geolocation.getCurrentPosition((pos) => {
        dom.latInput.value = utils.fmt(pos.coords.latitude, 5);
        if (dom.lonInput) dom.lonInput.value = utils.fmt(pos.coords.longitude, 5);
        calculations.refreshRecommendedAndSeasonal();
        dom.geolocateBtn.disabled = false;
        dom.geolocateBtn.querySelector('span').textContent = "GPS";
      }, (err) => {
        alert(t.location_unavailable);
        dom.geolocateBtn.disabled = false;
        dom.geolocateBtn.querySelector('span').textContent = "GPS";
      }, { enableHighAccuracy: true, timeout: 10000, maximumAge: 10000 });
    },
    memorize: () => {
      if (state.lastTilt == null || state.lastAzimuth == null) return;
      dom.manualTiltInput.value = utils.fmt(state.lastTilt,1);
      dom.manualAzimuthInput.value = Math.round(state.lastAzimuth);
      dom.currentTiltInput.value = utils.fmt(state.lastTilt,1);
      dom.currentAzimuthInput.value = Math.round(state.lastAzimuth);
      utils.playSuccess();
    },
    openSettings: () => { dom.settingsModal.classList.remove('hidden'); },
    closeModals: () => document.querySelectorAll('.fixed.inset-0').forEach(m => m.classList.add('hidden')),
    gotoEstimationPage: () => {
      // Prefill fields with current recommended/current
      if (state.lastTilt != null) {
        dom.currentTiltInput.value = utils.fmt(state.lastTilt,1);
      } else if (dom.manualTiltInput.value) {
        dom.currentTiltInput.value = dom.manualTiltInput.value;
      } else if (state.lastRecommendedTilt != null) {
        dom.currentTiltInput.value = Math.round(state.lastRecommendedTilt);
      }
      if (state.lastAzimuth != null) {
        dom.currentAzimuthInput.value = Math.round(state.lastAzimuth);
      } else if (dom.manualAzimuthInput.value) {
        dom.currentAzimuthInput.value = dom.manualAzimuthInput.value;
      } else {
        dom.currentAzimuthInput.value = 0; // assume South if unknown
      }
      // ensure lon present
      if (!dom.lonInput.value) dom.lonInput.value = utils.fmt(CONFIG.defaultLongitude, 5);
      ui.showPage('estimation');
    },
    backToMain: () => ui.showPage('main'),
    openBugReport: () => {
      const mail = CONFIG.reportEmail;
      const subj = encodeURIComponent("[Opti Solar] Rapport de bug");
      const body = encodeURIComponent("Décrivez votre problème ici :\n\nÉtapes pour reproduire :\n1.\n2.\n3.\n\nVersion Android / Modèle :\n");
      window.location.href = `mailto:${mail}?subject=${subj}&body=${body}`;
    }
  };

  function bindEvents() {
    // Theme / style
    if (dom.themeToggle) dom.themeToggle.addEventListener('change', theme.toggle);
    dom.memorizeStyleRadios.forEach(r => r.addEventListener('change', (e)=> ui.updateMemorizeStyle(e.target.value)));

    // Sensors
    dom.activateSensorsBtn.addEventListener('click', () => state.sensorsActive ? sensors.stop() : sensors.start());
    if (dom.calibrateTiltBtn) dom.calibrateTiltBtn.addEventListener('click', sensors.calibrateFlat);

    // Geo / manual / memorize
    dom.geolocateBtn.addEventListener('click', handlers.geolocate);
    dom.useManualBtn.addEventListener('click', () => { sensors.stop(); });
    dom.memorizeBtn.addEventListener('click', handlers.memorize);

    // Settings & help
    dom.settingsButton.addEventListener('click', handlers.openSettings);
    document.querySelectorAll('.close-modal-btn').forEach(btn => btn.addEventListener('click', handlers.closeModals));
    if (dom.clippingHelpButton) dom.clippingHelpButton.addEventListener('click', ()=> { $('clipping-help-modal')?.classList?.remove('hidden'); });
    if (dom.settingsHelpButton) dom.settingsHelpButton.addEventListener('click', ()=> dom.settingsHelpModal.classList.remove('hidden'));

    // Navigation
    dom.gotoEstimationBtn.addEventListener('click', handlers.gotoEstimationPage);
    dom.backButton.addEventListener('click', handlers.backToMain);

    // Estimation
    dom.calculateProductionBtn.addEventListener('click', estimation.run);
    if (dom.exportPdfBtn) dom.exportPdfBtn.addEventListener('click', estimation.exportPdf);

    // Footer
    if (dom.donationMessage) dom.donationMessage.addEventListener('click', ()=> window.open(CONFIG.donateLink, '_blank'));
    if (dom.bugReportButton) dom.bugReportButton.addEventListener('click', (e)=> { e.preventDefault(); handlers.openBugReport(); });

    // Recompute recommended tilt when inputs change
    dom.latInput.addEventListener('input', calculations.refreshRecommendedAndSeasonal);
    dom.dateInput.addEventListener('change', calculations.refreshRecommendedAndSeasonal);
    if (dom.clippingCheckbox) dom.clippingCheckbox.addEventListener('change', calculations.refreshRecommendedAndSeasonal);
  }

  function init() {
    theme.load();
    ui.loadMemorizeStyle();
    try {
      const savedOffset = parseFloat(localStorage.getItem('zeroTiltOffset'));
      if (Number.isFinite(savedOffset)) state.zeroTiltOffset = savedOffset;
    } catch(e){}
    // default lat/date
    if (!dom.latInput.value) dom.latInput.value = utils.fmt(CONFIG.defaultLatitude, 5);
    if (dom.lonInput && !dom.lonInput.value) dom.lonInput.value = utils.fmt(CONFIG.defaultLongitude, 5);
    if (!dom.dateInput.value) {
      const d = new Date();
      dom.dateInput.value = d.toISOString().split('T')[0];
    }
    calculations.refreshRecommendedAndSeasonal();

    bindEvents();

    // On first launch show onboarding
    let show = false;
    try { show = localStorage.getItem('onboardingComplete') !== 'true'; } catch(e){ show = false; }
    if (show && dom.onboardingModal) {
      dom.onboardingModal.classList.remove('hidden');
      // onboarding controls
      let idx = 0;
      const showIdx = (i) => {
        idx = Math.max(0, Math.min(i, dom.onboardingSlides.length-1));
        dom.onboardingSlides.forEach((s, k)=> s.classList.toggle('hidden', k!==idx));
        dom.onboardingDots.forEach((d,k)=> d.classList.toggle('active', k===idx));
        if (dom.onboardingPrevBtn) dom.onboardingPrevBtn.classList.toggle('invisible', idx===0);
        if (dom.onboardingNextBtn) dom.onboardingNextBtn.classList.toggle('hidden', idx===dom.onboardingSlides.length-1);
        if (dom.onboardingFinishBtn) dom.onboardingFinishBtn.classList.toggle('hidden', idx!==dom.onboardingSlides.length-1);
      };
      if (dom.onboardingPrevBtn) dom.onboardingPrevBtn.addEventListener('click', ()=> showIdx(idx-1));
      if (dom.onboardingNextBtn) dom.onboardingNextBtn.addEventListener('click', ()=> showIdx(idx+1));
      if (dom.onboardingFinishBtn) dom.onboardingFinishBtn.addEventListener('click', ()=> {
        dom.onboardingModal.classList.add('hidden');
        try { localStorage.setItem('onboardingComplete','true'); } catch(e){}
      });
      showIdx(0);
    }

    // Hook settings modal openers in header
    // (Main help button already wired via .close-modal-btn for close)
  }

  document.addEventListener('DOMContentLoaded', init);
})();
