
(function(){
  'use strict';

  var CONFIG = {
    donateLink: 'https://paypal.me/iFredZ',
    reportEmail: 'finjalrac@gmail.com',
    defaultLatitude: 44.21446,
    defaultLongitude: 4.028,
    clippingAdjustment: 10,
    sensorEventName: ('ondeviceorientationabsolute' in window) ? 'deviceorientationabsolute' : 'deviceorientation',
    stability: { samples: 10, tiltTol: 0.6, azTol: 4 }
  };

  var t = {
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
    orientation_south: "Sud",
    memorize_action: "Mémoriser",
    calibrate_tilt_success: "Calibration effectuée !",
    recommended_tilt: "Inclinaison recommandée",
    with_clipping: "(optimisée écrêtage)",
    estimation_title: "Estimation de Production",
    prod_current_settings: "Production (votre inclinaison)",
    prod_optimal_settings: "Production (inclinaison optimale)",
    daily_gain: "Gain potentiel quotidien",
    monthly_gain: "Gain potentiel mensuel",
    export_pdf: "Exporter en PDF",
    donation_message: "Si cette application vous aide, vous pouvez m'offrir un café ☕",
    pvgis_error: "Erreur communication PVGIS.",
    fill_all_fields_error: "Veuillez remplir tous les champs valides."
  };

  function $(id){ return document.getElementById(id); }

  var dom = {
    mainSection: $('main-page'),
    settingsPage: $('settings-page'),

    settingsButton: $('settings-button'),

    latInput: $('latitude-input'),
    dateInput: $('date-input'),
    resultDisplay: $('result'),
    dateDisplay: $('date-display'),
    sensorsReadout: $('sensors-readout'),
    sensorError: $('sensor-error'),
    currentCompass: $('current-compass'),
    currentAngle: $('current-angle'),
    compassRose: $('compass-rose-container'),

    activateSensorsBtn: $('activate-sensors-button'),
    manualEntryBtn: $('manual-entry-button'),
    geolocateBtn: $('get-location'),
    memorizeWrapper: $('memorize-btn-wrapper'),
    memorizeBtn: $('memorize-ring-btn'),
    manualTiltInput: $('manual-tilt-input'),
    manualAzimuthInput: $('manual-azimuth-input'),
    gotoEstimationBtn: $('goto-estimation-button'),
    clippingCheckbox: $('clipping-checkbox'),
    calibrateTiltBtn: $('calibrate-tilt-btn'),

    settingsModal: $('settings-modal'),
    settingsHelpModal: $('settings-help-modal'),
    settingsHelpButton: $('settings-help-button'),
    clippingHelpButton: $('clipping-help-button'),

    backButton: $('back-button'),
    peakPower: $('peak-power'),
    lonInput: $('longitude-input'),
    currentTiltInput: $('current-tilt-input'),
    currentAzimuthInput: $('current-azimuth-input'),
    calcBtn: $('calculate-production'),
    calcText: $('calculate-text'),
    calcLoader: $('calculate-loader'),
    resultsBox: $('production-results'),
    currentProduction: $('current-production'),
    optimalProduction: $('optimal-production'),
    potentialGainMonthly: $('potential-gain-monthly'),
    pvgisError: $('pvgis-error'),
    trulyOptimal: $('truly-optimal-production'),
    exportPdfBtn: $('export-pdf-btn'),
    donationMessage: $('donation-message'),

    themeToggle: $('theme-toggle'),
    memorizeStyleRadios: (function(){ return Array.prototype.slice.call(document.querySelectorAll('.memorize-style-radio')); })(),

    bugReportButton: $('bug-report-button'),
    donateButtonFab: $('donate-button-fab'),

    onboardingModal: $('onboarding-modal'),
    onboardingSlides: (function(){ return Array.prototype.slice.call(document.querySelectorAll('.onboarding-slide')); })(),
    onboardingDots: (function(){ return Array.prototype.slice.call(document.querySelectorAll('.onboarding-dot')); })(),
    onboardingPrev: $('onboarding-prev-btn'),
    onboardingNext: $('onboarding-next-btn'),
    onboardingFinish: $('onboarding-finish-btn')
  };

  var state = {
    sensorsActive: false,
    zeroTiltOffset: 0,
    lastTilt: null,
    lastAzimuth: null,
    tiltBuffer: [],
    azBuffer: [],
    lastRecommended: null
  };

  var utils = {
    toRad: function(d){ return d*Math.PI/180; },
    toDeg: function(r){ return r*180/Math.PI; },
    fmt: function(n,dec){ if(dec===void 0) dec=1; return Number(n).toLocaleString('fr-FR',{minimumFractionDigits:dec, maximumFractionDigits:dec}); },
    clamp: function(x,a,b){ return Math.min(Math.max(x,a),b); },
    normalizeAngle: function(a){ return (a%360+360)%360; },
    dayOfYear: function(date){ return Math.floor((date - new Date(date.getFullYear(),0,0))/86400000); },
    declination: function(n){ return -23.44 * Math.cos((360/365)*(n+10)*Math.PI/180); },
    safeF: function(v){
      if (v === null || v === void 0 || v === '') return NaN;
      var n = parseFloat(String(v).replace(',','.'));
      return isFinite(n)?n:NaN;
    },
    playSuccess: function(){
      try{ if (navigator.vibrate) navigator.vibrate(30); }catch(e){}
      try{
        var ctx = new (window.AudioContext||window.webkitAudioContext)();
        var o = ctx.createOscillator(); var g = ctx.createGain();
        o.type='sine'; o.frequency.value=880; g.gain.value=0.2;
        o.connect(g); g.connect(ctx.destination); o.start(); o.stop(ctx.currentTime+0.12);
      }catch(e){}
    }
  };

  var theme = {
    apply: function(mode){
      if (document.body) document.body.classList.toggle('light-mode', mode==='light');
      try{ localStorage.setItem('userTheme', mode);}catch(e){}
      if (dom.themeToggle) dom.themeToggle.checked = (mode==='light');
    },
    init: function(){
      var mode='dark'; try{ mode = localStorage.getItem('userTheme')||'dark'; }catch(e){}
      theme.apply(mode);
      if (dom.themeToggle) dom.themeToggle.addEventListener('change', function(){ theme.apply(dom.themeToggle.checked?'light':'dark'); });
      // memorize style
      var style='default'; try{ style = localStorage.getItem('memorizeStyle')||'default'; }catch(e){}
      ui.setMemorizeStyle(style);
      dom.memorizeStyleRadios.forEach(function(r){
        if (r.value===style) r.checked = true;
        r.addEventListener('change', function(e){ ui.setMemorizeStyle(e.target.value); });
      });
    }
  };

  var ui = {
    setMemorizeStyle: function(style){
      var el = dom.memorizeBtn; if (!el) return;
      el.classList.remove('btn-style-default','btn-style-neon','btn-style-glass','btn-style-radar');
      if (style==='neon') el.classList.add('btn-style-neon');
      else if (style==='glass') el.classList.add('btn-style-glass');
      else if (style==='radar') el.classList.add('btn-style-radar');
      else el.classList.add('btn-style-default');
      try{ localStorage.setItem('memorizeStyle', style);}catch(e){}
    },
    showPage: function(p){
      if (dom.mainSection) dom.mainSection.classList.toggle('hidden', p!=='main');
      if (dom.settingsPage) dom.settingsPage.classList.toggle('hidden', p!=='estimation');
      window.scrollTo(0,0);
    },
    updateResult: function(){
      var lat = utils.safeF(dom.latInput && dom.latInput.value);
      if (!isFinite(lat)) { if (dom.resultDisplay) dom.resultDisplay.textContent='--°'; return; }
      var date = (dom.dateInput && dom.dateInput.value) ? new Date(dom.dateInput.value) : new Date();
      var n = utils.dayOfYear(date);
      var decl = utils.declination(n);
      var recommended = utils.clamp(lat - decl, 0, 85);
      if (dom.clippingCheckbox && dom.clippingCheckbox.checked) recommended = utils.clamp(recommended + CONFIG.clippingAdjustment, 0, 85);
      state.lastRecommended = recommended;
      if (dom.resultDisplay) dom.resultDisplay.textContent = utils.fmt(recommended,0) + '°';
      if (dom.dateDisplay) dom.dateDisplay.textContent = date.toLocaleDateString('fr-FR', { weekday:'long', day:'2-digit', month:'long' });
    }
  };

  var sensors = {
    start: function(){
      if (state.sensorsActive) return;
      state.sensorsActive = true;
      if (dom.sensorError) dom.sensorError.textContent='';
      if (dom.activateSensorsBtn){
        dom.activateSensorsBtn.classList.add('active');
        dom.activateSensorsBtn.textContent = t.stop_sensors;
      }
      state.tiltBuffer=[]; state.azBuffer=[];

      try {
        if (window.DeviceOrientationEvent && typeof DeviceOrientationEvent.requestPermission === 'function') {
          DeviceOrientationEvent.requestPermission().then(function(res){
            if (res!=='granted') throw new Error('denied');
            window.addEventListener(CONFIG.sensorEventName, sensors.onOrientation);
          }).catch(function(){
            if (dom.sensorError) dom.sensorError.textContent = "Capteurs non disponibles.";
            sensors.stop();
          });
        } else {
          window.addEventListener(CONFIG.sensorEventName, sensors.onOrientation);
        }
      } catch(e){
        if (dom.sensorError) dom.sensorError.textContent = "Capteurs non disponibles.";
        sensors.stop();
      }

      if (dom.sensorsReadout) dom.sensorsReadout.classList.remove('hidden');
      var mem = $('memorize-container'); if (mem) mem.classList.remove('hidden');
    },
    stop: function(){
      state.sensorsActive=false;
      window.removeEventListener(CONFIG.sensorEventName, sensors.onOrientation);
      if (dom.activateSensorsBtn){
        dom.activateSensorsBtn.classList.remove('active');
        dom.activateSensorsBtn.textContent = t.activate_sensors;
      }
    },
    onOrientation: function(ev){
      var a = (typeof ev.alpha==='number')? ev.alpha : null;
      var b = (typeof ev.beta==='number')? ev.beta : null;
      var g = (typeof ev.gamma==='number')? ev.gamma : null;
      if (a==null||b==null||g==null) return;

      var x=b, y=g;
      var rawTilt = Math.min(90, Math.abs(Math.atan(Math.sqrt(x*x + y*y) / 57.2958) * 57.2958));
      var tilt = utils.clamp(rawTilt - state.zeroTiltOffset, 0, 90);

      var north = utils.normalizeAngle(a);
      var azFromSouth = utils.normalizeAngle(180 - north);
      if (azFromSouth > 180) azFromSouth -= 360;

      state.lastTilt = tilt; state.lastAzimuth = azFromSouth;

      if (dom.currentAngle) dom.currentAngle.textContent = utils.fmt(tilt,1);
      if (dom.currentCompass){
        var abs = Math.abs(azFromSouth);
        var dir = azFromSouth < 0 ? "Est" : "Ouest";
        dom.currentCompass.textContent = (abs<1?'0':utils.fmt(abs,0)) + "° / " + (abs<1?t.orientation_south:dir);
      }
      var needle = dom.compassRose ? dom.compassRose.querySelector('.needle') : null;
      if (needle) needle.style.transform = 'rotate('+azFromSouth+'deg)';

      state.tiltBuffer.push(tilt); if (state.tiltBuffer.length>CONFIG.stability.samples) state.tiltBuffer.shift();
      state.azBuffer.push(azFromSouth); if (state.azBuffer.length>CONFIG.stability.samples) state.azBuffer.shift();
      var stable=false;
      if (state.tiltBuffer.length===CONFIG.stability.samples){
        var tmin = Math.min.apply(Math, state.tiltBuffer), tmax = Math.max.apply(Math, state.tiltBuffer);
        var amin = Math.min.apply(Math, state.azBuffer), amax = Math.max.apply(Math, state.azBuffer);
        stable = (tmax-tmin)<=CONFIG.stability.tiltTol && (amax-amin)<=CONFIG.stability.azTol;
      }
      if (dom.memorizeWrapper) dom.memorizeWrapper.classList.toggle('stable', stable);
      if (dom.memorizeBtn) dom.memorizeBtn.disabled = !stable;
    },
    calibrate: function(){
      if (state.lastTilt==null) return;
      state.zeroTiltOffset = state.lastTilt;
      try{ localStorage.setItem('zeroTiltOffset', String(state.zeroTiltOffset)); }catch(e){}
      alert(t.calibrate_tilt_success);
    }
  };

  var api = {
    cacheGet: function(k){ try{var v=sessionStorage.getItem(k); return v?JSON.parse(v):null;}catch(e){return null;} },
    cacheSet: function(k,v){ try{sessionStorage.setItem(k, JSON.stringify(v));}catch(e){} },
    fetchPVGIS: function(lat, lon, peakpower, angle, aspect, loss){
      if (loss===void 0) loss=14;
      var key = 'pvgis:'+lat+':'+lon+':'+peakpower+':'+angle+':'+aspect+':'+loss;
      var cached = api.cacheGet(key); if (cached) return Promise.resolve(cached);
      var url = 'https://re.jrc.ec.europa.eu/api/PVcalc?lat='+lat+'&lon='+lon+'&peakpower='+peakpower+'&loss='+loss+'&angle='+angle+'&aspect='+aspect+'&outputformat=json';

      function fetchWithTimeout(resource, options){
        options = options || {}; var timeout = options.timeout || 12000;
        return new Promise(function(resolve, reject){
          var id = setTimeout(function(){ reject(new Error('timeout')); }, timeout);
          fetch(resource, options).then(function(r){ clearTimeout(id); resolve(r); }).catch(function(e){ clearTimeout(id); reject(e); });
        });
      }
      var strategies = [
        function(){ return fetchWithTimeout(url,{timeout:12000}); },
        function(){ return fetchWithTimeout('https://thingproxy.freeboard.io/fetch/'+url,{timeout:15000}); },
        function(){ return fetchWithTimeout('https://api.allorigins.win/raw?url='+encodeURIComponent(url),{timeout:15000}); }
      ];

      var i=0;
      function tryNext(lastErr){
        if (i>=strategies.length) return Promise.reject(lastErr || new Error('PVGIS failed'));
        return strategies[i++]().then(function(resp){
          if (!resp.ok) throw new Error('http '+resp.status);
          return resp.json();
        }).then(function(data){
          api.cacheSet(key, data);
          return data;
        }).catch(function(err){
          return tryNext(err);
        });
      }
      return tryNext(null);
    }
  };

  var estimation = {
    run: function(){
      if (dom.pvgisError) dom.pvgisError.textContent='';
      var lat = utils.safeF(dom.latInput && dom.latInput.value);
      var lon = utils.safeF(dom.lonInput && dom.lonInput.value);
      var peak = utils.safeF(dom.peakPower && dom.peakPower.value);
      var curTilt = utils.clamp(utils.safeF(dom.currentTiltInput && dom.currentTiltInput.value),0,85);
      var curAz = utils.clamp(utils.safeF(dom.currentAzimuthInput && dom.currentAzimuthInput.value),-180,180);

      if (![lat,lon,peak,curTilt,curAz].every(function(x){return isFinite(x);})){
        if (dom.pvgisError) dom.pvgisError.textContent = t.fill_all_fields_error;
        return;
      }

      var optTilt = (state.lastRecommended!=null) ? state.lastRecommended : (function(){
        var n = utils.dayOfYear(new Date());
        var base = utils.clamp(lat - utils.declination(n),0,85);
        if (dom.clippingCheckbox && dom.clippingCheckbox.checked) base = utils.clamp(base + CONFIG.clippingAdjustment,0,85);
        return base;
      })();

      if (dom.calcText) dom.calcText.classList.add('hidden');
      if (dom.calcLoader) dom.calcLoader.classList.remove('hidden');

      Promise.all([
        api.fetchPVGIS(lat,lon,peak,curTilt,curAz),
        api.fetchPVGIS(lat,lon,peak,optTilt,curAz),
        api.fetchPVGIS(lat,lon,peak,optTilt,0)
      ]).then(function(arr){
        function parse(d){
          try{
            if (d && d.outputs && Array.isArray(d.outputs.monthly)){
              var sum = d.outputs.monthly.reduce(function(s,m){ return s + (Number(m.E_m)||0); }, 0);
              var year = (d.outputs.totals && Number(d.outputs.totals.E_y)) || sum;
              return {year: year, month: year/12};
            }
            var year2 = d && d.outputs && d.outputs.totals && Number(d.outputs.totals.E_y);
            return {year: year2, month: year2/12};
          }catch(e){ return {year: NaN, month: NaN}; }
        }
        var rc = parse(arr[0]), ro = parse(arr[1]), rt = parse(arr[2]);

        if (dom.currentProduction) dom.currentProduction.textContent = isFinite(rc.year)? utils.fmt(rc.year,0)+' kWh/an' : '--';
        if (dom.optimalProduction) dom.optimalProduction.textContent = isFinite(ro.year)? utils.fmt(ro.year,0)+' kWh/an' : '--';
        if (dom.trulyOptimal) dom.trulyOptimal.textContent = isFinite(rt.year)? utils.fmt(rt.year,0)+' kWh/an' : '--';

        var gainY = ro.year - rc.year;
        if (dom.potentialGainMonthly) dom.potentialGainMonthly.textContent = isFinite(gainY)? utils.fmt(gainY/12,1)+' kWh/mois' : '--';

        if (dom.resultsBox) dom.resultsBox.classList.remove('hidden');
      }).catch(function(e){
        if (dom.pvgisError) dom.pvgisError.textContent = t.pvgis_error;
        console.error(e);
      }).finally(function(){
        if (dom.calcText) dom.calcText.classList.remove('hidden');
        if (dom.calcLoader) dom.calcLoader.classList.add('hidden');
      });
    },
    exportPdf: function(){
      if (!window.html2pdf) return;
      var date = new Date();
      var html = document.createElement('div');
      html.style.background='#fff'; html.style.color='#111827'; html.style.padding='16px'; html.style.fontFamily='Arial,sans-serif';
      html.innerHTML = ''
        + '<h1 style="margin:0;color:#0ea5a4">Rapport Opti Solar</h1>'
        + '<p style="margin:6px 0 12px 0;color:#6b7280">Généré le '+date.toLocaleDateString('fr-FR')+'</p>'
        + '<table style="width:100%;border-collapse:collapse;font-size:14px">'
        + '<tr><td style="border:1px solid #e5e7eb;padding:6px">Latitude</td><td style="border:1px solid #e5e7eb;padding:6px">'+(dom.latInput?dom.latInput.value:'')+'</td></tr>'
        + '<tr><td style="border:1px solid #e5e7eb;padding:6px">Longitude</td><td style="border:1px solid #e5e7eb;padding:6px">'+(dom.lonInput?dom.lonInput.value:'')+'</td></tr>'
        + '<tr><td style="border:1px solid #e5e7eb;padding:6px">Puissance crête</td><td style="border:1px solid #e5e7eb;padding:6px">'+(dom.peakPower?dom.peakPower.value:'')+' kWc</td></tr>'
        + '<tr><td style="border:1px solid #e5e7eb;padding:6px">Inclinaison actuelle</td><td style="border:1px solid #e5e7eb;padding:6px">'+(dom.currentTiltInput?dom.currentTiltInput.value:'')+'°</td></tr>'
        + '<tr><td style="border:1px solid #e5e7eb;padding:6px">Orientation actuelle</td><td style="border:1px solid #e5e7eb;padding:6px">'+(dom.currentAzimuthInput?dom.currentAzimuthInput.value:'')+'° / Sud</td></tr>'
        + '</table>'
        + '<h3 style="margin:14px 0 6px 0">Résultats</h3>'
        + '<table style="width:100%;border-collapse:collapse;font-size:14px">'
        + '<tr><td style="border:1px solid #e5e7eb;padding:6px">Production (réglages actuels)</td><td style="border:1px solid #e5e7eb;padding:6px">'+(dom.currentProduction?dom.currentProduction.textContent:'')+'</td></tr>'
        + '<tr><td style="border:1px solid #e5e7eb;padding:6px">Production (inclinaison optimale)</td><td style="border:1px solid #e5e7eb;padding:6px">'+(dom.optimalProduction?dom.optimalProduction.textContent:'')+'</td></tr>'
        + (dom.trulyOptimal?('<tr><td style="border:1px solid #e5e7eb;padding:6px">Production vraiment optimale (0°/Sud)</td><td style="border:1px solid #e5e7eb;padding:6px">'+dom.trulyOptimal.textContent+'</td></tr>'):'')
        + '<tr><td style="border:1px solid #e5e7eb;padding:6px">'+t.monthly_gain+'</td><td style="border:1px solid #e5e7eb;padding:6px">'+(dom.potentialGainMonthly?dom.potentialGainMonthly.textContent:'')+'</td></tr>'
        + '</table>'
        + '<p style="font-size:12px;color:#374151;margin-top:10px">“Inclinaison optimale” = angle recommandé par latitude/date'+((dom.clippingCheckbox&&dom.clippingCheckbox.checked)?' (avec optimisation écrêtage)':'')+'. “Vraiment optimale” suppose orientation plein Sud.</p>'
        + '<p style="font-size:11px;color:#6b7280;margin-top:10px">Sources: PVGIS (JRC, Commission Européenne). Résultats indicatifs.</p>';
      var filename = 'OptiSolar_Rapport_'+(new Date().toISOString().slice(0,10))+'.pdf';
      html2pdf().from(html).set({ margin:10, filename:filename, image:{type:'jpeg',quality:0.98}, html2canvas:{scale:2}, jsPDF:{unit:'mm', format:'a4', orientation:'portrait'} }).save();
    }
  };

  var handlers = {
    geolocate: function(){
      if (!navigator.geolocation) { alert(t.geoloc_not_supported); return; }
      if (!dom.geolocateBtn) return;
      dom.geolocateBtn.disabled = true;
      navigator.geolocation.getCurrentPosition(function(pos){
        if (dom.latInput) dom.latInput.value = (pos.coords.latitude).toFixed(5);
        if (dom.lonInput) dom.lonInput.value = (pos.coords.longitude).toFixed(5);
        ui.updateResult();
        dom.geolocateBtn.disabled=false;
      }, function(){
        alert(t.location_unavailable);
        dom.geolocateBtn.disabled=false;
      }, { enableHighAccuracy:true, timeout:10000, maximumAge:10000 });
    },
    memorize: function(){
      if (state.lastTilt==null || state.lastAzimuth==null) return;
      var tlt = utils.fmt(state.lastTilt,1);
      var az = Math.round(state.lastAzimuth);
      if (dom.manualTiltInput) dom.manualTiltInput.value = tlt;
      if (dom.manualAzimuthInput) dom.manualAzimuthInput.value = az;
      if (dom.currentTiltInput) dom.currentTiltInput.value = tlt;
      if (dom.currentAzimuthInput) dom.currentAzimuthInput.value = az;
      utils.playSuccess();
    },
    openSettings: function(){ if (dom.settingsModal) dom.settingsModal.classList.remove('hidden'); },
    closeModals: function(){
      var list = document.querySelectorAll('.fixed.inset-0');
      for (var i=0;i<list.length;i++){ list[i].classList.add('hidden'); }
    },
    gotoEstimation: function(){
      if (dom.lonInput && !dom.lonInput.value) dom.lonInput.value = (CONFIG.defaultLongitude).toFixed(5);
      if (dom.peakPower && !dom.peakPower.value) dom.peakPower.value = "3.72";
      if (state.lastTilt!=null && dom.currentTiltInput) dom.currentTiltInput.value = utils.fmt(state.lastTilt,1);
      if (state.lastAzimuth!=null && dom.currentAzimuthInput) dom.currentAzimuthInput.value = Math.round(state.lastAzimuth);
      ui.showPage('estimation');
    },
    back: function(){ ui.showPage('main'); },
    bugReport: function(e){
      if (e && e.preventDefault) e.preventDefault();
      var mail = CONFIG.reportEmail;
      var subj = encodeURIComponent("[Opti Solar] Rapport de bug");
      var body = encodeURIComponent("Expliquez le problème, captures d'écran appréciées.\n\nÉtapes pour reproduire :\n1.\n2.\n3.\n");
      window.location.href = 'mailto:'+mail+'?subject='+subj+'&body='+body;
    }
  };

  function ensureDefaults(){
    var today = new Date();
    if (dom.dateInput && !dom.dateInput.value) dom.dateInput.value = today.toISOString().slice(0,10);
    if (dom.latInput && !dom.latInput.value) dom.latInput.value = (CONFIG.defaultLatitude).toFixed(5);
    ui.updateResult();
    try {
      var savedOffset = parseFloat(localStorage.getItem('zeroTiltOffset'));
      if (isFinite(savedOffset)) state.zeroTiltOffset = savedOffset;
    } catch(e){}
  }

  function bind(){
    ensureDefaults();

    if (dom.dateInput) dom.dateInput.addEventListener('change', ui.updateResult);
    if (dom.latInput) dom.latInput.addEventListener('input', ui.updateResult);
    if (dom.clippingCheckbox) dom.clippingCheckbox.addEventListener('change', ui.updateResult);

    if (dom.geolocateBtn) dom.geolocateBtn.addEventListener('click', handlers.geolocate);
    if (dom.activateSensorsBtn) dom.activateSensorsBtn.addEventListener('click', function(){ state.sensorsActive? sensors.stop(): sensors.start(); });
    if (dom.manualEntryBtn) dom.manualEntryBtn.addEventListener('click', function(){ sensors.stop(); });
    if (dom.memorizeBtn) dom.memorizeBtn.addEventListener('click', handlers.memorize);
    if (dom.calibrateTiltBtn) dom.calibrateTiltBtn.addEventListener('click', sensors.calibrate);

    if (dom.settingsButton) dom.settingsButton.addEventListener('click', handlers.openSettings);
    var closes = document.querySelectorAll('.close-modal-btn');
    for (var i=0;i<closes.length;i++){ closes[i].addEventListener('click', handlers.closeModals); }
    if (dom.clippingHelpButton){
      dom.clippingHelpButton.addEventListener('click', function(){
        var m = $('clipping-help-modal'); if (m) m.classList.remove('hidden');
      });
    }
    if (dom.settingsHelpButton && dom.settingsHelpModal) dom.settingsHelpButton.addEventListener('click', function(){ dom.settingsHelpModal.classList.remove('hidden'); });

    if (dom.gotoEstimationBtn) dom.gotoEstimationBtn.addEventListener('click', handlers.gotoEstimation);
    if (dom.backButton) dom.backButton.addEventListener('click', handlers.back);

    if (dom.calcBtn) dom.calcBtn.addEventListener('click', estimation.run);
    if (dom.exportPdfBtn) dom.exportPdfBtn.addEventListener('click', estimation.exportPdf);
    if (dom.donationMessage) dom.donationMessage.addEventListener('click', function(){ window.open(CONFIG.donateLink, '_blank'); });

    if (dom.bugReportButton) dom.bugReportButton.addEventListener('click', handlers.bugReport);

    theme.init();

    // Onboarding (non bloquant)
    if (dom.onboardingModal){
      var seen=false; try{ seen = localStorage.getItem('onboardingComplete')==='true'; }catch(e){}
      if (!seen){
        dom.onboardingModal.classList.remove('hidden');
        var idx=0;
        function show(i){
          idx = Math.max(0, Math.min(i, dom.onboardingSlides.length-1));
          for (var k=0;k<dom.onboardingSlides.length;k++){ dom.onboardingSlides[k].classList.toggle('hidden', k!==idx); }
          for (var d=0; d<dom.onboardingDots.length; d++){ dom.onboardingDots[d].classList.toggle('active', d===idx); }
          if (dom.onboardingPrev) dom.onboardingPrev.classList.toggle('invisible', idx===0);
          if (dom.onboardingNext) dom.onboardingNext.classList.toggle('hidden', idx===dom.onboardingSlides.length-1);
          if (dom.onboardingFinish) dom.onboardingFinish.classList.toggle('hidden', idx!==dom.onboardingSlides.length-1);
        }
        if (dom.onboardingPrev) dom.onboardingPrev.addEventListener('click', function(){ show(idx-1); });
        if (dom.onboardingNext) dom.onboardingNext.addEventListener('click', function(){ show(idx+1); });
        if (dom.onboardingFinish) dom.onboardingFinish.addEventListener('click', function(){
          dom.onboardingModal.classList.add('hidden');
          try{ localStorage.setItem('onboardingComplete','true'); }catch(e){}
        });
        show(0);
      }
    }
  }

  document.addEventListener('DOMContentLoaded', bind);
})();
