(function() {
    'use strict';

    const DEBUG = false;
    const CONFIG = {
        donateLink: 'https://paypal.me/iFredZ',
        reportEmail: 'finjalrac@gmail.com',
        defaultLatitude: 44.21446,
        defaultLongitude: 4.028,
        clippingAdjustment: 10,
        sensorEventName: ('ondeviceorientationabsolute' in window) ? 'deviceorientationabsolute' : 'deviceorientation'
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
            tilt: "Inclinaison",
            tilt_placeholder: "ex: 35",
            orientation_short: "Orientation",
            orientation_placeholder: "0 (Sud)",
            recommended_angle: "Angle Recommandé",
            waiting_for_sensor: "Orientez votre appareil...",
            calculate_gain: "Estimer la Production",
            donation_message: "Si cette estimation vous a été utile, pensez à soutenir ce projet en m'offrant un petit café ! ☕",
            estimation_title: "Estimation de Production",
            peak_power: "Puissance crête (kWc)",
            longitude: "Longitude",
            current_tilt: "Inclinaison actuelle (°)",
            current_azimuth: "Orientation actuelle (°/Sud)",
            calculate_gain_long: "Calculer le gain",
            prod_current_settings: "Production (votre inclinaison)",
            prod_optimal_settings: "Production (inclinaison optimale)",
            prod_truly_optimal_settings: "Production IDÉALE (plein Sud)",
            daily_gain: "Gain potentiel journalier",
            monthly_gain: "Gain potentiel mensuel",
            settings_title: "Réglages",
            clipping_label: "Optimiser pour l'écrêtage",
            clipping_title: "Optimisation pour l'Écrêtage",
            clipping_problem_title: "Le Problème",
            clipping_problem_desc: "En été, votre production solaire peut dépasser la puissance maximale de votre onduleur. Cette énergie excédentaire est perdue : c'est l'écrêtage (ou \"clipping\").",
            clipping_solution_title: "La Solution",
            clipping_solution_desc: "Cocher cette case augmente volontairement l'angle de vos panneaux. Cela réduit le pic de production à midi (évitant la saturation) et augmente la production le matin et le soir, pour un gain global sur la journée.",
            got_it: "Compris",
            replay_tutorial: "Revoir le tutoriel",
            main_guide_title: "Guide d'Utilisation",
            guide_step1_title: "Étape 1 : Localisation & Date",
            guide_step1_desc: "Assurez-vous que votre latitude est correcte (utilisez le GPS si besoin) et que la date cible est bien celle souhaitée.",
            guide_step2_title: "Étape 2 : Choix du Mode",
            guide_step2_desc: "<strong class='text-fg'>Capteurs :</strong> Pour une mesure réelle, posez le téléphone sur votre panneau.<br><strong class='text-yellow-400'>Attention : retirez toute coque magnétique.</strong><br><br><strong class='text-fg'>Manuel :</strong> Pour une simulation, entrez l'inclinaison et l'orientation.",
            guide_step3_title: "Étape 3 : Lecture du Résultat",
            guide_step3_desc: "L'angle recommandé s'affiche et s'ajuste en temps réel.",
            guide_step4_title: "Étape 4 : Estimation du Gain",
            guide_step4_desc: "Cliquez sur \"Estimer la Production\" pour une simulation précise.",
            estimation_guide_title: "Guide de l'Estimation",
            estimation_guide_step1_title: "Vérifiez vos Données",
            estimation_guide_step1_desc: "Les champs sont pré-remplis. Vous pouvez les modifier pour simuler d'autres configurations.",
            onboarding_step1_title: "Étape 1 : Calibrer",
            onboarding_step1_desc: "Pour une mesure précise, calibrez votre boussole en décrivant un '8' avec votre téléphone.",
            onboarding_step2_title: "Étape 2 : Activer",
            onboarding_step2_desc: "Appuyez sur \"Utiliser Capteurs\" pour démarrer la réception des données.",
            onboarding_step3_title: "Étape 3 : Placer",
            onboarding_step3_desc: "Posez votre téléphone (sans coque magnétique) bien à plat sur votre panneau solaire.",
            onboarding_step4_title: "Étape 4 : Mémoriser",
            onboarding_step4_desc: "Une fois les valeurs stables, appuyez sur le grand bouton rond !",
            onboarding_prev: "Précédent",
            onboarding_next: "Suivant",
            onboarding_finish: "Terminer",
            compass_south: "Plein Sud",
            fill_all_fields_error: "Veuillez remplir tous les champs.",
            settings_already_optimal: "Vos réglages actuels sont déjà optimaux.",
            pvgis_error: "Erreur communication PVGIS.",
            export_pdf: "Exporter en PDF",
            sensors_activating: "Activation des capteurs...",
            invalid_measurements: "Mesures invalides.",
            button_style_label: "Style du bouton \"Mémoriser\"",
            button_style_default: "Défaut",
            button_style_neon: "Néon",
            button_style_glass: "Verre",
            button_style_radar: "Radar",
        },
        en: {
            // English translations can be added here if needed
        }
    };

    const state = {
        entryMode: null, 
        sensorsActive: false,
        memorizedTilt: null,
        memorizedAzimuthValue: null,
        panelAzimuthLive: null,
        tiltOffset: 0,
        isStable: false,
        lastReadings: [],
        stabilityThreshold: 0.5, 
        stabilityBuffer: 5 
    };

    const dom = {
        mainPage: document.getElementById('main-page'),
        settingsPage: document.getElementById('settings-page'),
        latitudeInput: document.getElementById('latitude-input'),
        dateInput: document.getElementById('date-input'),
        getLocationButton: document.getElementById('get-location'),
        locationError: document.getElementById('location-error'),
        activateSensorsButton: document.getElementById('activate-sensors-button'),
        manualEntryButton: document.getElementById('manual-entry-button'),
        sensorsReadout: document.getElementById('sensors-readout'),
        currentAngleDisplay: document.getElementById('current-angle'),
        currentCompassDisplay: document.getElementById('current-compass'),
        compassRoseContainer: document.getElementById('compass-rose-container'),
        inclinometerLineContainer: document.getElementById('inclinometer-line-container'),
        memorizeContainer: document.getElementById('memorize-container'),
        memorizeBtnWrapper: document.getElementById('memorize-btn-wrapper'),
        memorizeRingBtn: document.getElementById('memorize-ring-btn'),
        memorizeBtnText: document.getElementById('memorize-btn-text'),
        memorizeCheckmarkIcon: document.getElementById('memorize-checkmark-icon'),
        sensorError: document.getElementById('sensor-error'),
        manualEntryDisplay: document.getElementById('manual-entry-display'),
        manualTiltInput: document.getElementById('manual-tilt-input'),
        manualAzimuthInput: document.getElementById('manual-azimuth-input'),
        resultDisplay: document.getElementById('result'),
        gotoEstimationButton: document.getElementById('goto-estimation-button'),
        backButton: document.getElementById('back-button'),
        peakPowerInput: document.getElementById('peak-power'),
        longitudeInput: document.getElementById('longitude-input'),
        currentTiltInput: document.getElementById('current-tilt-input'),
        currentAzimuthInput: document.getElementById('current-azimuth-input'),
        calculateProductionButton: document.getElementById('calculate-production'),
        productionResults: document.getElementById('production-results'),
        exportContainer: document.getElementById('export-container'),
        exportPdfBtn: document.getElementById('export-pdf-btn'),
        currentProductionDisplay: document.getElementById('current-production'),
        optimalProductionDisplay: document.getElementById('optimal-production'),
        trulyOptimalProductionDisplay: document.getElementById('truly-optimal-production'),
        potentialGainDailyDisplay: document.getElementById('potential-gain-daily'),
        potentialGainMonthlyDisplay: document.getElementById('potential-gain-monthly'),
        pvgisError: document.getElementById('pvgis-error'),
        calculateText: document.getElementById('calculate-text'),
        calculateLoader: document.getElementById('calculate-loader'),
        donationMessage: document.getElementById('donation-message'),
        settingsButton: document.getElementById('settings-button'),
        bugReportButton: document.getElementById('bug-report-button'),
        donateButtonFab: document.getElementById('donate-button-fab'),
        mainHelpButton: document.getElementById('main-help-button'),
        settingsHelpButton: document.getElementById('settings-help-button'),
        clippingHelpButton: document.getElementById('clipping-help-button'),
        settingsModal: document.getElementById('settings-modal'),
        clippingHelpModal: document.getElementById('clipping-help-modal'),
        mainHelpModal: document.getElementById('main-help-modal'),
        settingsHelpModal: document.getElementById('settings-help-modal'),
        onboardingModal: document.getElementById('onboarding-modal'),
        onboardingSlides: document.querySelectorAll('.onboarding-slide'),
        onboardingDots: document.querySelectorAll('.onboarding-dot'),
        onboardingPrevBtn: document.getElementById('onboarding-prev-btn'),
        onboardingNextBtn: document.getElementById('onboarding-next-btn'),
        onboardingFinishBtn: document.getElementById('onboarding-finish-btn'),
        replayTutorialBtn: document.getElementById('replay-tutorial-btn'),
        clippingCheckbox: document.getElementById('clipping-checkbox'),
        themeToggle: document.getElementById('theme-toggle'),
        calibrateTiltBtn: document.getElementById('calibrate-tilt-btn')
    };

    const utils = {
        log: (...args) => { if (DEBUG) console.log('[OptiSolar]', ...args); },
        toRadians: (deg) => deg * Math.PI / 180,
        getDayOfYear: (date) => Math.floor((date - new Date(date.getFullYear(), 0, 0)) / 86400000),
        getDeclination: (dayOfYear) => -23.44 * Math.cos(utils.toRadians((360 / 365) * (dayOfYear + 10))),
        formatNumber: (n, dec = 2) => Number(n).toLocaleString(i18n.currentLang === 'fr' ? 'fr-FR' : 'en-US', { minimumFractionDigits: dec, maximumFractionDigits: dec }),
        safeParseFloat: (v, fallback = NaN) => {
            if (v === null || v === undefined || v === '') return fallback;
            const s = String(v).replace(',', '.').trim();
            const n = parseFloat(s);
            return Number.isFinite(n) ? n : fallback;
        },
        clamp: (x, min, max) => Math.min(Math.max(x, min), max),
        normalizeAngle: (a) => (a % 360 + 360) % 360
    };

    const i18n = {
        currentLang: 'fr',
        setLanguage: function(lang) {
            if (!translations[lang]) return;
            this.currentLang = lang;
            document.documentElement.lang = lang;
            localStorage.setItem('userLang', lang);
            document.querySelectorAll('[data-i18n]').forEach(el => {
                const key = el.dataset.i18n;
                if (translations[lang] && translations[lang][key]) {
                    el.innerHTML = translations[lang][key];
                }
            });
            document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
                const key = el.dataset.i18nPlaceholder;
                if (translations[lang] && translations[lang][key]) el.placeholder = translations[lang][key];
            });
            document.querySelectorAll('.lang-btn').forEach(btn => btn.classList.toggle('active', btn.dataset.lang === lang));
            dom.activateSensorsButton.textContent = translations[lang][state.sensorsActive ? 'stop_sensors' : 'activate_sensors'];
            calculations.calculateAndDisplayAll();
        }
    };

    const ui = {
        showPage: (page) => {
            dom.mainPage.classList.toggle('hidden', page !== 'main');
            dom.settingsPage.classList.toggle('hidden', page !== 'settings');
            dom.mainHelpButton.classList.toggle('hidden', page !== 'main');
            dom.settingsHelpButton.classList.toggle('hidden', page !== 'settings');
        },
        updateLocationFields: (lat, lon) => {
            dom.latitudeInput.value = parseFloat(lat).toFixed(5);
            dom.longitudeInput.value = parseFloat(lon).toFixed(5);
            dom.locationError.textContent = '';
            try { localStorage.setItem('userLocation', JSON.stringify({lat, lon})); } catch(e) {}
            calculations.calculateAndDisplayAll();
        },
        setEntryMode: (mode) => {
            state.entryMode = mode;
            dom.sensorsReadout.classList.toggle('hidden', mode !== 'sensors');
            dom.memorizeContainer.classList.toggle('hidden', mode !== 'sensors');
            dom.memorizeContainer.classList.toggle('flex', mode === 'sensors');
            dom.manualEntryDisplay.classList.toggle('hidden', mode !== 'manual');
            
            dom.activateSensorsButton.classList.toggle('btn-primary', mode !== 'sensors');
            dom.activateSensorsButton.classList.toggle('btn-danger', mode === 'sensors');
            
            dom.manualEntryButton.classList.toggle('btn-secondary', mode !== 'manual');
            dom.manualEntryButton.classList.toggle('btn-danger', mode === 'manual');

            if (mode === 'sensors') {
                if(!state.sensorsActive) sensors.start();
            } else {
                if (state.sensorsActive) sensors.stop();
            }
            calculations.calculateAndDisplayAll();
        }
    };

    const calculations = {
        calculateAndDisplayAll: () => {
            const lat = utils.safeParseFloat(dom.latitudeInput.value);
            const dateValue = dom.dateInput.value;
            if (isNaN(lat) || !dateValue) return;

            let panelAzimuthDeviation = 0;
            if (state.entryMode === 'manual') {
                panelAzimuthDeviation = utils.safeParseFloat(dom.manualAzimuthInput.value, 0);
            } else if (state.entryMode === 'sensors' && state.panelAzimuthLive !== null) {
                let deviation = state.panelAzimuthLive - 180;
                if (deviation > 180) deviation -= 360;
                if (deviation < -180) deviation += 360;
                panelAzimuthDeviation = deviation;
            }

            const selectedDate = new Date(dateValue);
            if (isNaN(selectedDate.getTime())) return;

            const dayOfYear = utils.getDayOfYear(selectedDate);
            const declination = utils.getDeclination(dayOfYear);
            
            const isLocalSummer = (Math.sign(lat) === Math.sign(declination)) && (Math.abs(declination) > 10);
            const clipping = (dom.clippingCheckbox.checked && isLocalSummer) ? CONFIG.clippingAdjustment : 0;
            
            const dev = Math.abs(panelAzimuthDeviation);
            const penalty = Math.min(6, dev / 12);
            
            const solarNoonAltitude = 90 - Math.abs(lat - declination);
            let optimalTilt = 90 - solarNoonAltitude;
            optimalTilt = utils.clamp(optimalTilt + clipping - penalty, 0, 90);

            dom.resultDisplay.textContent = `${Math.round(optimalTilt)}°`;
        }
    };

    const sensors = {
        lastUpdate: 0,
        checkStability: (newReading) => {
            state.lastReadings.push(newReading);
            if (state.lastReadings.length > state.stabilityBuffer) state.lastReadings.shift();
            if (state.lastReadings.length < state.stabilityBuffer) return false;
            const first = state.lastReadings[0];
            return state.lastReadings.every(r =>
                Math.abs(r.tilt - first.tilt) <= state.stabilityThreshold &&
                Math.abs(r.heading - first.heading) <= state.stabilityThreshold
            );
        },
        setStable: (isStable) => {
            if (state.isStable === isStable) return;
            state.isStable = isStable;
            dom.memorizeBtnWrapper.classList.toggle('stable', isStable);
            dom.memorizeRingBtn.disabled = !isStable;
        },
        getTiltFromEvent: (e) => e.beta == null ? null : utils.clamp(Math.round(Math.abs(e.beta - state.tiltOffset)), 0, 90),
        getHeadingFromEvent: (e) => {
            if (typeof e.webkitCompassHeading === 'number') return e.webkitCompassHeading;
            if (typeof e.alpha !== 'number') return null;
            const screenAngle = (screen.orientation?.angle) || window.orientation || 0;
            return (360 - e.alpha + screenAngle + 360) % 360;
        },
        formatAzimuthForDisplay: (azimuth) => {
            let deviation = azimuth - 180;
            if (deviation > 180) deviation -= 360;
            if (deviation < -180) deviation += 360;
            const lang = i18n.currentLang;
            if (Math.abs(deviation) < 5) return translations[lang].compass_south;
            const direction = deviation < 0 ? "Est" : "Ouest";
            return `${Math.round(Math.abs(deviation))}° ${direction}`;
        },
        handleOrientation: (event) => {
            const now = performance.now();
            if (now - sensors.lastUpdate < 100) return;
            sensors.lastUpdate = now;

            const tilt = sensors.getTiltFromEvent(event);
            const heading = sensors.getHeadingFromEvent(event);

            if (tilt !== null) {
                dom.currentAngleDisplay.textContent = tilt;
                const tiltForVisual = utils.clamp(event.beta - state.tiltOffset, -90, 90);
                dom.inclinometerLineContainer.style.transform = `rotate(${tiltForVisual}deg)`;
            }
            if (heading !== null) {
                state.panelAzimuthLive = utils.normalizeAngle(heading);
                dom.currentCompassDisplay.textContent = sensors.formatAzimuthForDisplay(state.panelAzimuthLive);
                dom.compassRoseContainer.style.transform = `rotate(${state.panelAzimuthLive}deg)`;
            }

            if (tilt !== null && heading !== null) {
                dom.sensorError.textContent = '';
                sensors.setStable(sensors.checkStability({ tilt, heading }));
            }
            calculations.calculateAndDisplayAll();
        },
        start: () => {
            if (state.sensorsActive) return;
            dom.sensorError.textContent = translations[i18n.currentLang].sensors_activating;
            try {
                window.addEventListener(CONFIG.sensorEventName, sensors.handleOrientation, true);
                state.sensorsActive = true;
                dom.activateSensorsButton.textContent = translations[i18n.currentLang].stop_sensors;
                dom.sensorError.textContent = '';
            } catch (err) {
                dom.sensorError.textContent = 'Erreur capteurs.';
            }
        },
        stop: () => {
            if (!state.sensorsActive) return;
            window.removeEventListener(CONFIG.sensorEventName, sensors.handleOrientation, true);
            state.sensorsActive = false;
            state.panelAzimuthLive = null;
            sensors.setStable(false);
            state.lastReadings = [];
            dom.activateSensorsButton.textContent = translations[i18n.currentLang].activate_sensors;
            dom.currentAngleDisplay.textContent = '--';
            dom.currentCompassDisplay.textContent = '--';
        }
    };
    
    const handlers = {
        openBugReport: (event) => {
            event.preventDefault();
            const subject = "Suggestion / Bug pour Opti Solar";
            window.location.href = `mailto:${CONFIG.reportEmail}?subject=${encodeURIComponent(subject)}`;
        },
        prepareEstimationPage: () => {
            if (state.entryMode === 'manual') {
                dom.currentTiltInput.value = dom.manualTiltInput.value;
                dom.currentAzimuthInput.value = dom.manualAzimuthInput.value;
            } else { 
                dom.currentTiltInput.value = (state.memorizedTilt !== null) ? state.memorizedTilt : '';
                if (state.memorizedAzimuthValue !== null) {
                    let deviation = state.memorizedAzimuthValue - 180;
                    if (deviation > 180) deviation -= 360;
                    if (deviation < -180) deviation += 360;
                    dom.currentAzimuthInput.value = Math.round(deviation);
                } else {
                    dom.currentAzimuthInput.value = '';
                }
            }
            ui.showPage('settings');
        },
        memorizeSensorValues: () => {
            const tilt = parseInt(dom.currentAngleDisplay.textContent, 10);
            const az = state.panelAzimuthLive;
            if (!Number.isFinite(tilt) || !Number.isFinite(az)) {
                dom.sensorError.textContent = translations[i18n.currentLang].invalid_measurements;
                return;
            }
            dom.memorizeBtnText.classList.add('hidden');
            dom.memorizeCheckmarkIcon.classList.remove('hidden');
            
            setTimeout(() => {
                dom.memorizeBtnText.textContent = translations[i18n.currentLang].memorized;
                dom.memorizeBtnText.classList.remove('hidden');
                dom.memorizeCheckmarkIcon.classList.add('hidden');
                setTimeout(() => {
                    dom.memorizeBtnText.textContent = translations[i18n.currentLang].memorize_action;
                }, 1500);
            }, 700);

            state.memorizedTilt = tilt;
            state.memorizedAzimuthValue = az;
        },
        replayTutorial: () => {
            dom.mainHelpModal.classList.add('hidden');
            onboarding.start();
        },
        calibrateTilt: () => {
            const once = (e) => {
                if (e.beta !== null) {
                    state.tiltOffset = e.beta;
                    localStorage.setItem('tiltOffset', state.tiltOffset.toString());
                    const originalText = dom.calibrateTiltBtn.textContent;
                    dom.calibrateTiltBtn.textContent = translations[i18n.currentLang].calibrate_tilt_success;
                    setTimeout(() => { dom.calibrateTiltBtn.textContent = originalText; }, 2000);
                }
                window.removeEventListener(CONFIG.sensorEventName, once, true);
            };
            window.addEventListener(CONFIG.sensorEventName, once, true);
        },
        savePeakPower: () => {
            localStorage.setItem('userPeakPower', dom.peakPowerInput.value);
        },
        exportToPDF: () => { /* PDF export logic here */ }
    };

    const onboarding = {
        currentIndex: 0,
        start: function() {
            dom.onboardingModal.classList.remove('hidden');
            this.showSlide(0);
        },
        showSlide: function(index) {
            this.currentIndex = index;
            dom.onboardingSlides.forEach((s, i) => s.classList.toggle('hidden', i !== index));
            dom.onboardingDots.forEach((d, i) => d.classList.toggle('active', i === index));
            dom.onboardingPrevBtn.classList.toggle('invisible', index === 0);
            dom.onboardingNextBtn.classList.toggle('hidden', index === dom.onboardingSlides.length - 1);
            dom.onboardingFinishBtn.classList.toggle('hidden', index !== dom.onboardingSlides.length - 1);
        },
        next: function() {
            if (this.currentIndex < dom.onboardingSlides.length - 1) this.showSlide(this.currentIndex + 1);
        },
        prev: function() {
            if (this.currentIndex > 0) this.showSlide(this.currentIndex - 1);
        },
        finish: function() {
            dom.onboardingModal.classList.add('hidden');
            localStorage.setItem('onboardingComplete', 'true');
        }
    };

    const theme = {
        apply: (themeName) => {
            document.body.classList.toggle('light-mode', themeName === 'light');
            dom.themeToggle.checked = (themeName === 'light');
        },
        toggle: () => {
            const newTheme = dom.themeToggle.checked ? 'light' : 'dark';
            theme.apply(newTheme);
            localStorage.setItem('userTheme', newTheme);
        },
        load: () => {
            const savedTheme = localStorage.getItem('userTheme') || 'dark';
            theme.apply(savedTheme);
        }
    };

    const api = {
        fetchPVGIS: async (lat, lon, peakpower, angle, aspect) => {
            const url = `https://re.jrc.ec.europa.eu/api/PVcalc?lat=${lat}&lon=${lon}&peakpower=${peakpower}&loss=14&angle=${angle}&aspect=${aspect}&outputformat=json`;
            const proxyUrl = `https://api.allorigins.win/json?url=${encodeURIComponent(url)}`;
            try {
                const res = await fetch(proxyUrl);
                if (!res.ok) throw new Error('Proxy failed');
                const data = await res.json();
                return JSON.parse(data.contents);
            } catch (e) {
                const fallbackProxy = `https://corsproxy.io/?${encodeURIComponent(url)}`;
                const res = await fetch(fallbackProxy);
                if (!res.ok) throw new Error('All proxies failed');
                return await res.json();
            }
        },
        getProductionEstimate: async () => { 
            dom.exportContainer.classList.add('hidden');
            dom.pvgisError.textContent = ''; 
            dom.productionResults.classList.add('hidden');
            dom.donationMessage.classList.add('hidden');
            dom.calculateLoader.classList.remove('hidden');
            dom.calculateText.classList.add('hidden');

            const lat = utils.safeParseFloat(dom.latitudeInput.value); 
            const lon = utils.safeParseFloat(dom.longitudeInput.value); 
            const peakPower = utils.safeParseFloat(dom.peakPowerInput.value); 
            const currentTilt = utils.safeParseFloat(dom.currentTiltInput.value); 
            const currentAzimuth = utils.safeParseFloat(dom.currentAzimuthInput.value); 
            
            if ([lat, lon, peakPower, currentTilt, currentAzimuth].some(isNaN)) { 
                dom.pvgisError.textContent = translations[i18n.currentLang].fill_all_fields_error;
                dom.calculateText.classList.remove('hidden'); 
                dom.calculateLoader.classList.add('hidden'); 
                return; 
            } 
            
            try {
                const dayOfYear = utils.getDayOfYear(new Date(dom.dateInput.value));
                const declination = utils.getDeclination(dayOfYear);
                const isLocalSummer = (Math.sign(lat) === Math.sign(declination)) && (Math.abs(declination) > 10);
                const clipping = (dom.clippingCheckbox.checked && isLocalSummer) ? CONFIG.clippingAdjustment : 0;
                const penalty = Math.min(6, Math.abs(currentAzimuth) / 12);
                let finalOptimalTilt = Math.round(utils.clamp(90 - (90 - Math.abs(lat - declination)) + clipping - penalty, 0, 90));
                let idealOptimalTilt = Math.round(utils.clamp(90 - (90 - Math.abs(lat - declination)) + clipping, 0, 90)); // No penalty for ideal

                const [currentProd, optimalProd, trulyOptimalProd] = await Promise.all([ 
                    api.fetchPVGIS(lat, lon, peakPower, currentTilt, currentAzimuth), 
                    api.fetchPVGIS(lat, lon, peakPower, finalOptimalTilt, currentAzimuth),
                    api.fetchPVGIS(lat, lon, peakPower, idealOptimalTilt, 0) // Ideal is South-facing (0°)
                ]);

                let curDaily = Number(currentProd.outputs.totals.fixed.E_d) || 0; 
                let optDaily = Number(optimalProd.outputs.totals.fixed.E_d) || 0;
                let trulyOptDaily = Number(trulyOptimalProd.outputs.totals.fixed.E_d) || 0;
                
                let curMonthly = Number(currentProd.outputs.totals.fixed.E_m) || 0; 
                let optMonthly = Number(optimalProd.outputs.totals.fixed.E_m) || 0; 
                let trulyOptMonthly = Number(trulyOptimalProd.outputs.totals.fixed.E_m) || 0;

                if (optDaily < curDaily) { 
                    optDaily = curDaily; 
                    optMonthly = curMonthly; 
                    dom.pvgisError.textContent = translations[i18n.currentLang].settings_already_optimal; 
                } else {
                    dom.pvgisError.textContent = '';
                }

                dom.currentProductionDisplay.textContent = `${utils.formatNumber(curMonthly)} kWh`; 
                dom.optimalProductionDisplay.textContent = `${utils.formatNumber(optMonthly)} kWh`; 
                dom.trulyOptimalProductionDisplay.textContent = `${utils.formatNumber(trulyOptMonthly)} kWh`;

                const gainDaily = optDaily - curDaily;
                dom.potentialGainDailyDisplay.textContent = gainDaily < 1 ? `~ ${Math.round(gainDaily * 1000)} Wh` : `~ ${utils.formatNumber(gainDaily)} kWh`; 
                const gainMonthly = optMonthly - curMonthly; 
                dom.potentialGainMonthlyDisplay.textContent = `~ ${utils.formatNumber(gainMonthly)} kWh`; 
                
                dom.productionResults.classList.remove('hidden');
                dom.donationMessage.classList.remove('hidden');
                dom.exportContainer.classList.remove('hidden');
            } catch (err) { 
                dom.pvgisError.textContent = translations[i18n.currentLang].pvgis_error; 
                utils.log(err);
            } finally { 
                dom.calculateText.classList.remove('hidden'); 
                dom.calculateLoader.classList.add('hidden');
            } 
        }
    };

    function init() {
        const savedLang = localStorage.getItem('userLang') || 'fr';
        i18n.setLanguage(savedLang);

        try {
            const savedLocation = JSON.parse(localStorage.getItem('userLocation'));
            if(savedLocation && savedLocation.lat && savedLocation.lon) {
                ui.updateLocationFields(savedLocation.lat, savedLocation.lon);
            } else {
                ui.updateLocationFields(CONFIG.defaultLatitude, CONFIG.defaultLongitude);
            }
        } catch(e) {
             ui.updateLocationFields(CONFIG.defaultLatitude, CONFIG.defaultLongitude);
        }
        
        state.tiltOffset = Number(localStorage.getItem('tiltOffset')) || 0;
        dom.peakPowerInput.value = localStorage.getItem('userPeakPower') || '3.72';
        theme.load();

        if (!localStorage.getItem('onboardingComplete')) {
            onboarding.start();
        }

        const applyMemorizeBtnStyle = (style) => {
            const el = dom.memorizeRingBtn;
            if(!el) return;
            el.classList.remove('btn-style-default', 'btn-style-neon', 'btn-style-glass', 'btn-style-radar');
            el.classList.add(`btn-style-${style || 'default'}`);
        };
        const styleRadios = document.querySelectorAll('input.memorize-style-radio');
        const savedStyle = localStorage.getItem('memorizeBtnStyle') || 'default';
        applyMemorizeBtnStyle(savedStyle);
        styleRadios.forEach(r => {
            r.checked = (r.value === savedStyle);
            r.addEventListener('change', (e) => {
                if(e.target.checked) {
                    localStorage.setItem('memorizeBtnStyle', e.target.value);
                    applyMemorizeBtnStyle(e.target.value);
                }
            });
        });

        ['change', 'input'].forEach(evt => {
            [dom.latitudeInput, dom.dateInput, dom.clippingCheckbox, dom.manualTiltInput, dom.manualAzimuthInput].forEach(el => 
                el.addEventListener(evt, calculations.calculateAndDisplayAll)
            );
        });
        
        dom.peakPowerInput.addEventListener('input', handlers.savePeakPower);
        dom.activateSensorsButton.addEventListener('click', () => {
             state.sensorsActive ? sensors.stop() : ui.setEntryMode('sensors');
        });
        dom.manualEntryButton.addEventListener('click', () => ui.setEntryMode('manual'));
        dom.getLocationButton.addEventListener('click', () => {
             dom.locationError.textContent = translations[i18n.currentLang].location_getting;
             navigator.geolocation.getCurrentPosition(
                 p => ui.updateLocationFields(p.coords.latitude, p.coords.longitude),
                 () => dom.locationError.textContent = translations[i18n.currentLang].location_unavailable
             );
        });
        dom.memorizeRingBtn.addEventListener('click', handlers.memorizeSensorValues);
        dom.calibrateTiltBtn.addEventListener('click', handlers.calibrateTilt);
        dom.bugReportButton.addEventListener('click', handlers.openBugReport);
		dom.donationMessage.addEventListener('click', (e) => { e.preventDefault(); window.open(CONFIG.donateLink, '_blank'); });
        dom.gotoEstimationButton.addEventListener('click', handlers.prepareEstimationPage);
        dom.backButton.addEventListener('click', () => ui.showPage('main'));
        dom.calculateProductionButton.addEventListener('click', api.getProductionEstimate);
        dom.exportPdfBtn.addEventListener('click', handlers.exportToPDF);

        document.querySelectorAll('.close-modal-btn').forEach(btn => 
            btn.addEventListener('click', (e) => e.target.closest('.fixed.inset-0').classList.add('hidden'))
        );
        [dom.settingsButton, dom.mainHelpButton, dom.settingsHelpButton, dom.clippingHelpButton].forEach(btn => {
            btn.addEventListener('click', () => {
                const modalId = btn.id.replace('-button', '-modal');
                const modal = document.getElementById(modalId);
                if (modal) modal.classList.remove('hidden');
            });
        });
        
        dom.onboardingNextBtn.addEventListener('click', () => onboarding.next());
        dom.onboardingPrevBtn.addEventListener('click', () => onboarding.prev());
        dom.onboardingFinishBtn.addEventListener('click', () => onboarding.finish());
        dom.replayTutorialBtn.addEventListener('click', handlers.replayTutorial);
        
        dom.themeToggle.addEventListener('change', theme.toggle);
        document.getElementById('lang-switcher').addEventListener('click', (e) => {
            if (e.target.matches('.lang-btn')) {
                i18n.setLanguage(e.target.dataset.lang);
            }
        });

        const today = new Date();
        dom.dateInput.value = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
        
        calculations.calculateAndDisplayAll();
    }
    
    window.addEventListener('load', init);
})();
