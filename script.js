(function() {
    'use strict';

    const CONFIG = {
        donateLink: 'https://paypal.me/iFredZ',
        reportEmail: 'finjalrac@gmail.com',
        defaultLatitude: 44.21446,
        defaultLongitude: 4.028,
        clippingAdjustment: 10,
        sensorEventName: ('ondeviceorientationabsolute' in window) ? 'deviceorientationabsolute' : 'deviceorientation',
        stability: { samples: 10, tiltTol: 0.6, azTol: 4 }
    };

    const translations = {
        fr: {
            geoloc_error: "Erreur géoloc.",
            geoloc_not_supported: "Géolocalisation non supportée.",
            location_unavailable: "Impossible d’obtenir la position.",
            location_getting: "Obtention de la position...",
            activate_sensors: "Utiliser Capteurs",
            stop_sensors: "Arrêter Capteurs",
            manual_entry: "Saisie Manuelle",
            location: "Localisation (Latitude)",
            latitude_placeholder: "Latitude requise",
            target_date: "Date de Simulation",
            current_angle: "Inclinaison",
            orientation: "Orientation",
            memorize_action: "Mémoriser",
            memorized: "Mémorisé !",
            calibrate_tilt: "Calibrer à plat",
            calibrate_tilt_success: "Calibration effectuée !",
            light_theme_label: "Mode Clair",
            tilt: "Inclinaison (°)",
            tilt_placeholder: "ex: 35",
            orientation_short: "Orientation (°)",
            orientation_placeholder: "0 (Sud)",
            recommended_angle: "Angle Recommandé",
            waiting_for_sensor: "Orientez votre appareil...",
            calculate_gain: "Estimer la Production",
            estimation_title: "Estimation de Production",
            peak_power: "Puissance crête (kWc)",
            longitude: "Longitude",
            current_tilt: "Inclinaison actuelle (°)",
            current_azimuth: "Orientation actuelle (°/Sud)",
            calculate_gain_long: "Calculer le gain",
            prod_current_settings: "Production (votre inclinaison)",
            prod_optimal_settings: "Production (inclinaison optimale)",
            monthly_gain: "Gain potentiel mensuel",
            settings_title: "Réglages",
            clipping_label: "Optimiser pour l'écrêtage",
            got_it: "Compris",
            main_guide_title: "Guide d'Utilisation",
            guide_step1_title: "Étape 1 : Localisation & Date",
            guide_step1_desc: "Assurez-vous que votre latitude est correcte (utilisez le GPS si besoin) et que la date cible est bien celle souhaitée.",
            guide_step2_title: "Étape 2 : Choix du Mode",
            guide_step2_desc: "<strong>Capteurs :</strong> Pour une mesure réelle, posez le téléphone sur votre panneau.<br><strong>Manuel :</strong> Pour une simulation, entrez l'inclinaison et l'orientation manuellement.",
            guide_step3_title: "Étape 3 : Lecture du Résultat",
            guide_step3_desc: "L'angle recommandé s'affiche et s'ajuste en temps réel en fonction de l'orientation.",
            guide_step4_title: "Étape 4 : Estimation du Gain",
            guide_step4_desc: "Cliquez sur \"Estimer\" pour accéder à la simulation de production précise.",
            compass_south: "Plein Sud",
            compass_east: "Est",
            compass_west: "Ouest",
            pvgis_error: "Erreur communication PVGIS.",
            fill_all_fields_error: "Veuillez remplir tous les champs valides.",
            button_style_label: "Style du bouton \"Mémoriser\"",
            button_style_default: "Classique HD",
            button_style_neon: "Neon Reactor",
            button_style_glass: "Glass Core",
            button_style_radar: "Radar Lock-On",
            onboarding_prev: "Précédent",
            onboarding_next: "Suivant",
            onboarding_finish: "Terminer",
            replay_tutorial: "Revoir le tutoriel",
            onboarding_step1_title: "Étape 1 : Calibrer",
            onboarding_step1_desc: "Pour une mesure précise, calibrez votre boussole en décrivant un '8' avec votre téléphone.",
            onboarding_step2_title: "Étape 2 : Activer",
            onboarding_step2_desc: "Appuyez sur \"Utiliser Capteurs\" pour démarrer la réception des données.",
            onboarding_step3_title: "Étape 3 : Placer",
            onboarding_step3_desc: "Posez votre téléphone (sans coque magnétique) bien à plat sur votre panneau solaire.",
            onboarding_step4_title: "Étape 4 : Mémoriser",
            onboarding_step4_desc: "Une fois les valeurs stables, appuyez sur le grand bouton rond !",
        },
        en: {
            // ... English translations ...
        }
    };

    const i18n = {
        currentLang: 'fr',
        setLanguage: function(lang) {
            if (!translations[lang]) return;
            this.currentLang = lang;
            document.documentElement.lang = lang;
            try { localStorage.setItem('userLang', lang); } catch (e) {}

            document.querySelectorAll('[data-i18n]').forEach(el => {
                const key = el.dataset.i18n;
                if (translations[lang][key]) el.innerHTML = translations[lang][key];
            });
            document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
                const key = el.dataset.i18nPlaceholder;
                if (translations[lang][key]) el.placeholder = translations[lang][key];
            });
            document.querySelectorAll('.lang-btn').forEach(btn => btn.classList.toggle('active', btn.dataset.lang === lang));

            if (state.sensorsActive) {
                dom.activateSensorsBtn.textContent = translations[lang].stop_sensors;
            } else {
                dom.activateSensorsBtn.textContent = translations[lang].activate_sensors;
            }
            ui.updateResult();
        }
    };

    function $(id) { return document.getElementById(id); }

    const dom = {
        mainSection: $('main-page'),
        settingsPage: $('settings-page'),
        settingsButton: $('settings-button'),
        latInput: $('latitude-input'),
        dateInput: $('date-input'),
        resultDisplay: $('result'),
        sensorsReadout: $('sensors-readout'),
        sensorError: $('sensor-error'),
        currentCompass: $('current-compass'),
        currentAngle: $('current-angle'),
        compassRose: $('compass-rose-container'),
        inclinometerLine: $('inclinometer-line-container'),
        activateSensorsBtn: $('activate-sensors-button'),
        manualEntryBtn: $('manual-entry-button'),
        geolocateBtn: $('get-location'),
        locationError: $('location-error'),
        memorizeContainer: $('memorize-container'),
        memorizeWrapper: $('memorize-btn-wrapper'),
        memorizeBtn: $('memorize-ring-btn'),
        memorizeBtnText: $('memorize-btn-text'),
        memorizeCheckmark: $('memorize-checkmark-icon'),
        manualEntryDisplay: $('manual-entry-display'),
        manualTiltInput: $('manual-tilt-input'),
        manualAzimuthInput: $('manual-azimuth-input'),
        gotoEstimationBtn: $('goto-estimation-button'),
        clippingCheckbox: $('clipping-checkbox'),
        calibrateTiltBtn: $('calibrate-tilt-btn'),
        settingsModal: $('settings-modal'),
        settingsHelpButton: $('settings-help-button'),
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
        themeToggle: $('theme-toggle'),
        memorizeStyleRadios: Array.from(document.querySelectorAll('.memorize-style-radio')),
        bugReportButton: $('bug-report-button'),
        donateButtonFab: $('donate-button-fab'),
        mainHelpButton: $('main-help-button'),
        mainHelpModal: $('main-help-modal'),
        langSwitcher: $('lang-switcher'),
        onboardingModal: $('onboarding-modal'),
        onboardingSlides: Array.from(document.querySelectorAll('.onboarding-slide')),
        onboardingDots: Array.from(document.querySelectorAll('.onboarding-dot')),
        onboardingPrev: $('onboarding-prev-btn'),
        onboardingNext: $('onboarding-next-btn'),
        onboardingFinish: $('onboarding-finish-btn'),
        replayTutorialBtn: $('replay-tutorial-btn'),
    };

    const state = {
        entryMode: null,
        sensorsActive: false,
        zeroTiltOffset: 0,
        lastTilt: null,
        lastAzimuth: null,
        tiltBuffer: [],
        azBuffer: [],
        lastRecommended: null,
        memorizedTilt: null,
        memorizedAzimuthValue: null
    };

    const utils = {
        toRad: (d) => d * Math.PI / 180,
        fmt: (n, dec = 1) => Number(n).toLocaleString('fr-FR', { minimumFractionDigits: dec, maximumFractionDigits: dec }),
        clamp: (x, a, b) => Math.min(Math.max(x, a), b),
        normalizeAngle: (a) => (a % 360 + 360) % 360,
        dayOfYear: (date) => Math.floor((date - new Date(date.getFullYear(), 0, 0)) / 86400000),
        declination: (n) => -23.44 * Math.cos(utils.toRad((360 / 365) * (n + 10))),
        safeF: (v) => {
            if (v === null || v === undefined || v === '') return NaN;
            const n = parseFloat(String(v).replace(',', '.'));
            return isFinite(n) ? n : NaN;
        },
        playSuccess: () => { try { if (navigator.vibrate) navigator.vibrate(30); } catch (e) {} }
    };

    const theme = {
        apply: function(mode) {
            document.body.classList.toggle('light-mode', mode === 'light');
            try { localStorage.setItem('userTheme', mode); } catch (e) {}
            if (dom.themeToggle) dom.themeToggle.checked = (mode === 'light');
        },
        init: function() {
            let mode = 'dark';
            try { mode = localStorage.getItem('userTheme') || 'dark'; } catch (e) {}
            theme.apply(mode);
            if (dom.themeToggle) dom.themeToggle.addEventListener('change', () => theme.apply(dom.themeToggle.checked ? 'light' : 'dark'));
            
            let style = 'default';
            try { style = localStorage.getItem('memorizeStyle') || 'default'; } catch (e) {}
            ui.setMemorizeStyle(style);
            dom.memorizeStyleRadios.forEach(r => {
                if (r.value === style) r.checked = true;
                r.addEventListener('change', (e) => ui.setMemorizeStyle(e.target.value));
            });
        }
    };
    
    const onboarding = {
        currentIndex: 0,
        start: function() {
            dom.onboardingModal.classList.remove('hidden');
            this.showSlide(0);
        },
        showSlide: function(index) {
            this.currentIndex = index;
            dom.onboardingSlides.forEach((slide, i) => slide.classList.toggle('hidden', i !== index));
            dom.onboardingDots.forEach((dot, i) => dot.classList.toggle('active', i !== index));
            dom.onboardingPrev.classList.toggle('invisible', index === 0);
            dom.onboardingNext.classList.toggle('hidden', index === dom.onboardingSlides.length - 1);
            dom.onboardingFinish.classList.toggle('hidden', index !== dom.onboardingSlides.length - 1);
        },
        finish: function() {
            dom.onboardingModal.classList.add('hidden');
            try { localStorage.setItem('onboardingComplete', 'true'); } catch (e) {}
        }
    };

    const ui = {
        setMemorizeStyle: function(style) {
            if (!dom.memorizeBtn) return;
            dom.memorizeBtn.className = '';
            dom.memorizeBtn.classList.add('w-[150px]', 'h-[150px]', 'rounded-full', 'text-[var(--fg)]', 'flex', 'items-center', 'justify-center', 'transition-all', 'duration-300', 'ease-in-out', 'relative', 'z-10', 'text-xl', 'overflow-hidden', 'font-exo');
            
            if (style === 'neon') dom.memorizeBtn.classList.add('btn-style-neon');
            else if (style === 'glass') dom.memorizeBtn.classList.add('btn-style-glass');
            else if (style === 'radar') dom.memorizeBtn.classList.add('btn-style-radar');
            else dom.memorizeBtn.classList.add('btn-style-default');
            
            try { localStorage.setItem('memorizeStyle', style); } catch (e) {}
        },
        showPage: function(p) {
            dom.mainSection.classList.toggle('hidden', p !== 'main');
            dom.settingsPage.classList.toggle('hidden', p !== 'estimation');
            dom.mainHelpButton.classList.toggle('hidden', p !== 'main');
            dom.settingsHelpButton.classList.toggle('hidden', p !== 'estimation');
            window.scrollTo(0, 0);
        },
        updateResult: function() {
            const lat = utils.safeF(dom.latInput.value);
            if (!isFinite(lat)) {
                dom.resultDisplay.textContent = '--°';
                return;
            }

            const date = dom.dateInput.value ? new Date(dom.dateInput.value) : new Date();
            const n = utils.dayOfYear(date);
            const decl = utils.declination(n);

            let panelDev = 0;
            if (state.entryMode === 'sensors' && state.lastAzimuth !== null) {
                panelDev = state.lastAzimuth;
            } else if (state.entryMode === 'manual' && dom.manualAzimuthInput.value !== '') {
                const man = utils.safeF(dom.manualAzimuthInput.value);
                if (isFinite(man)) panelDev = man;
            }

            const devAbs = Math.abs(panelDev);
            const penalty = Math.min(6, devAbs / 12);
            const isLocalSummer = (Math.sign(lat) === Math.sign(decl)) && (Math.abs(decl) > 10);
            const clipping = (dom.clippingCheckbox.checked && isLocalSummer) ? CONFIG.clippingAdjustment : 0;
            const solarNoonAltitude = 90 - Math.abs(lat - decl);
            let optimalTilt = 90 - solarNoonAltitude;
            
            optimalTilt += clipping;
            optimalTilt -= penalty;
            optimalTilt = utils.clamp(optimalTilt, 0, 90);
            
            state.lastRecommended = optimalTilt;
            dom.resultDisplay.textContent = Math.round(optimalTilt) + '°';
        },
        toggleModeUI: function(isSensors) {
            state.entryMode = isSensors ? 'sensors' : 'manual';
            
            dom.sensorsReadout.classList.toggle('hidden', !isSensors);
            dom.memorizeContainer.classList.toggle('hidden', !isSensors);
            dom.memorizeContainer.classList.toggle('flex', isSensors);
            dom.manualEntryDisplay.classList.toggle('hidden', isSensors);

            dom.activateSensorsBtn.classList.toggle('btn-danger', isSensors);
            dom.manualEntryBtn.classList.toggle('btn-danger', !isSensors);
            dom.manualEntryBtn.classList.toggle('btn-secondary', isSensors);
        }
    };

    const sensors = {
        start: function() {
            if (state.sensorsActive) {
                sensors.stop();
                return;
            }
            state.sensorsActive = true;
            dom.sensorError.textContent = '';
            dom.activateSensorsBtn.textContent = translations[i18n.currentLang].stop_sensors;
            state.tiltBuffer = [];
            state.azBuffer = [];
            
            try {
                if (window.DeviceOrientationEvent && typeof DeviceOrientationEvent.requestPermission === 'function') {
                    DeviceOrientationEvent.requestPermission().then(res => {
                        if (res !== 'granted') throw new Error('denied');
                        window.addEventListener(CONFIG.sensorEventName, sensors.onOrientation);
                    }).catch(() => {
                        dom.sensorError.textContent = "Capteurs non disponibles.";
                        sensors.stop();
                    });
                } else {
                    window.addEventListener(CONFIG.sensorEventName, sensors.onOrientation);
                }
            } catch (e) {
                dom.sensorError.textContent = "Capteurs non disponibles.";
                sensors.stop();
            }
        },
        stop: function() {
            if(!state.sensorsActive) return;
            state.sensorsActive = false;
            window.removeEventListener(CONFIG.sensorEventName, sensors.onOrientation);
            dom.activateSensorsBtn.textContent = translations[i18n.currentLang].activate_sensors;
            dom.memorizeWrapper.classList.remove('stable');
            dom.memorizeBtn.disabled = true;
        },
        onOrientation: function(ev) {
            const a = (typeof ev.alpha === 'number') ? ev.alpha : null;
            const b = (typeof ev.beta === 'number') ? ev.beta : null;
            if (a === null || b === null) return;
            
            const tilt = utils.clamp(Math.abs(b) - state.zeroTiltOffset, 0, 90);
            const screenAngle = (screen.orientation?.angle) || 0;
            const north = utils.normalizeAngle(a - screenAngle);
            let azFromSouth = utils.normalizeAngle(180 - north); // CORRECTION HERE
            if (azFromSouth > 180) azFromSouth -= 360;
            
            state.lastTilt = tilt;
            state.lastAzimuth = azFromSouth;
            
            dom.currentAngle.textContent = utils.fmt(tilt, 1);
            dom.inclinometerLine.style.transform = `rotate(${utils.clamp(b - state.zeroTiltOffset, -90, 90)}deg)`;
            
            const abs = Math.abs(azFromSouth);
            const lang = i18n.currentLang;
            const dir = azFromSouth > 0 ? translations[lang].compass_west : translations[lang].compass_east;
            dom.currentCompass.textContent = (abs < 2 ? translations[lang].compass_south : `${utils.fmt(abs, 0)}° ${dir}`);
            dom.compassRose.style.transform = `rotate(${north}deg)`;
            
            state.tiltBuffer.push(tilt); if (state.tiltBuffer.length > CONFIG.stability.samples) state.tiltBuffer.shift();
            state.azBuffer.push(azFromSouth); if (state.azBuffer.length > CONFIG.stability.samples) state.azBuffer.shift();
            
            let stable = false;
            if (state.tiltBuffer.length === CONFIG.stability.samples) {
                const tmin = Math.min(...state.tiltBuffer), tmax = Math.max(...state.tiltBuffer);
                const amin = Math.min(...state.azBuffer), amax = Math.max(...state.azBuffer);
                stable = (tmax - tmin) <= CONFIG.stability.tiltTol && (amax - amin) <= CONFIG.stability.azTol;
            }
            dom.memorizeWrapper.classList.toggle('stable', stable);
            dom.memorizeBtn.disabled = !stable;

            ui.updateResult();
        },
        calibrate: function() {
            if (state.lastTilt === null) return;
            state.zeroTiltOffset = state.lastTilt;
            try { localStorage.setItem('zeroTiltOffset', String(state.zeroTiltOffset)); } catch (e) {}
            alert(translations[i18n.currentLang].calibrate_tilt_success);
        }
    };

    const handlers = {
        geolocate: function() {
            if (!navigator.geolocation) {
                alert(translations[i18n.currentLang].geoloc_not_supported);
                return;
            }
            dom.locationError.textContent = translations[i18n.currentLang].location_getting;
            dom.geolocateBtn.disabled = true;
            navigator.geolocation.getCurrentPosition(pos => {
                dom.latInput.value = pos.coords.latitude.toFixed(5);
                dom.lonInput.value = pos.coords.longitude.toFixed(5);
                ui.updateResult();
                dom.geolocateBtn.disabled = false;
                dom.locationError.textContent = '';
            }, () => {
                alert(translations[i18n.currentLang].location_unavailable);
                dom.geolocateBtn.disabled = false;
                dom.locationError.textContent = '';
            }, { enableHighAccuracy: true, timeout: 10000, maximumAge: 10000 });
        },
        memorize: function() {
            if (state.lastTilt === null || state.lastAzimuth === null) return;
            state.memorizedTilt = state.lastTilt;
            state.memorizedAzimuthValue = state.lastAzimuth;

            dom.memorizeBtnText.classList.add('hidden');
            dom.memorizeCheckmark.classList.remove('hidden');
            utils.playSuccess();
            
            setTimeout(() => {
                dom.memorizeBtnText.textContent = translations[i18n.currentLang].memorized;
                dom.memorizeBtnText.classList.remove('hidden');
                dom.memorizeCheckmark.classList.add('hidden');
                setTimeout(() => {
                    dom.memorizeBtnText.textContent = translations[i18n.currentLang].memorize_action;
                }, 1500);
            }, 700);
        },
        openSettings: () => dom.settingsModal.classList.remove('hidden'),
        closeModals: () => document.querySelectorAll('.fixed.inset-0').forEach(m => m.classList.add('hidden')),
        gotoEstimation: function() {
            if (!dom.lonInput.value) dom.lonInput.value = CONFIG.defaultLongitude.toFixed(5);
            if (!dom.peakPower.value) dom.peakPower.value = "3.72";
            
            if (state.entryMode === 'manual') {
                dom.currentTiltInput.value = dom.manualTiltInput.value;
                dom.currentAzimuthInput.value = dom.manualAzimuthInput.value;
            } else {
                if (state.memorizedTilt !== null) dom.currentTiltInput.value = (Math.round(state.memorizedTilt * 10) / 10).toFixed(1);
                if (state.memorizedAzimuthValue !== null) dom.currentAzimuthInput.value = String(Math.round(state.memorizedAzimuthValue));
            }
            ui.showPage('estimation');
        },
        bugReport: function(e) {
            e.preventDefault();
            const mail = CONFIG.reportEmail;
            const subj = encodeURIComponent("[Opti Solar] Rapport de bug");
            window.location.href = `mailto:${mail}?subject=${subj}`;
        }
    };

    function ensureDefaults() {
        const today = new Date();
        if (!dom.dateInput.value) dom.dateInput.value = today.toISOString().slice(0, 10);
        if (!dom.latInput.value) dom.latInput.value = CONFIG.defaultLatitude.toFixed(5);
        
        try {
            const savedOffset = parseFloat(localStorage.getItem('zeroTiltOffset'));
            if (isFinite(savedOffset)) state.zeroTiltOffset = savedOffset;
            const lang = localStorage.getItem('userLang') || 'fr';
            i18n.setLanguage(lang);
        } catch (e) {}

        ui.updateDateDisplay();
        ui.updateResult();
    }

    function bindEvents() {
        ensureDefaults();
        theme.init();

        dom.dateInput.addEventListener('change', () => { ui.updateDateDisplay(); ui.updateResult(); });
        dom.latInput.addEventListener('input', ui.updateResult);
        dom.clippingCheckbox.addEventListener('change', ui.updateResult);
        dom.manualTiltInput.addEventListener('input', ui.updateResult);
        dom.manualAzimuthInput.addEventListener('input', ui.updateResult);

        dom.geolocateBtn.addEventListener('click', handlers.geolocate);
        
        dom.activateSensorsBtn.addEventListener('click', () => {
            ui.toggleModeUI(true);
            sensors.start();
        });
        dom.manualEntryBtn.addEventListener('click', () => {
            if(state.sensorsActive) sensors.stop();
            ui.toggleModeUI(false);
        });

        dom.memorizeBtn.addEventListener('click', handlers.memorize);
        dom.calibrateTiltBtn.addEventListener('click', sensors.calibrate);
        dom.settingsButton.addEventListener('click', handlers.openSettings);
        dom.mainHelpButton.addEventListener('click', () => dom.mainHelpModal.classList.remove('hidden'));
        dom.gotoEstimationBtn.addEventListener('click', handlers.gotoEstimation);
        dom.backButton.addEventListener('click', () => ui.showPage('main'));
        dom.bugReportButton.addEventListener('click', handlers.bugReport);
        dom.donateButtonFab.addEventListener('click', () => window.open(CONFIG.donateLink, '_blank'));
        
        document.querySelectorAll('.close-modal-btn').forEach(btn => btn.addEventListener('click', handlers.closeModals));
        
        dom.onboardingPrev.addEventListener('click', () => onboarding.showSlide(onboarding.currentIndex - 1));
        dom.onboardingNext.addEventListener('click', () => onboarding.showSlide(onboarding.currentIndex + 1));
        dom.onboardingFinish.addEventListener('click', () => onboarding.finish());
        dom.replayTutorialBtn.addEventListener('click', () => { handlers.closeModals(); onboarding.start(); });

        dom.langSwitcher.addEventListener('click', (e) => {
            if (e.target.dataset.lang) {
                i18n.setLanguage(e.target.dataset.lang);
            }
        });

        // Onboarding check
        try {
            if (localStorage.getItem('onboardingComplete') !== 'true') {
                onboarding.start();
            }
        } catch(e) {}
    }

    document.addEventListener('DOMContentLoaded', bindEvents);
})();
