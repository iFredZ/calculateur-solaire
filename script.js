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
            light_theme_label: "Thème",
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
            current_azimuth: "Orientation actuelle (Déviation / Sud)",
            azimuth_placeholder: "ex: -10 (10° Est)",
            calculate_gain_long: "Calculer le gain",
            prod_current_settings: "Production (votre inclinaison)",
            prod_optimal_settings: "Production (inclinaison optimale pour VOTRE orientation)",
            prod_truly_optimal_settings: "Production IDÉALE (si orienté plein Sud)",
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
            estimation_guide_step1_desc: "Les champs sont pré-remplis à partir de la page précédente. Vous pouvez les modifier pour simuler d'autres configurations.",
            estimation_guide_step2_title: "Lancez le Calcul",
            estimation_guide_step2_desc: "Cliquez sur \"Calculer\" pour comparer la production annuelle estimée de votre réglage actuel avec celle du réglage optimal recommandé.",
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
            compass_north: "NORD",
            compass_south: "SUD",
            compass_east: "EST",
            compass_west: "OUEST",
            fill_all_fields_error: "Veuillez remplir tous les champs.",
            settings_already_optimal: "Vos réglages actuels sont déjà optimaux.",
            pvgis_error: "Erreur communication PVGIS.",
            offline_error: "Pas de connexion internet.",
            export_pdf: "Exporter en PDF",
            exporting_pdf: "Génération...",
            export_error_no_data: "Faites d’abord un calcul de production.",
            pdf_disclaimer_title: "Avertissement Important Concernant la Précision",
            pdf_disclaimer_text: "Les données de production et les mesures d'inclinaison/orientation fournies dans ce rapport sont des estimations. La précision des capteurs (boussole, accéléromètre) peut varier d'un téléphone à l'autre. De plus, la présence d'objets métalliques, et plus particulièrement l'utilisation de <strong>coques ou supports magnétiques</strong> pour téléphone, peut entraîner des erreurs d'orientation significatives. Il est fortement recommandé de retirer toute coque magnétique avant la mesure. Les créateurs de cette application ne sauraient être tenus responsables des écarts entre les estimations et la production réelle.",
            pdf_explanation_title: "Explication des estimations",
            pdf_explanation_text: "La 'Production Optimale' compare votre inclinaison actuelle à la meilleure inclinaison possible pour VOTRE orientation. La 'Production Idéale' est une valeur de référence qui montre le potentiel si votre installation était parfaitement orientée plein Sud avec une inclinaison optimale.",
            sensors_activating: "Activation des capteurs...",
            invalid_measurements: "Mesures invalides.",
            button_style_label: "Style Bouton",
            button_style_default: "Défaut",
            button_style_neon: "Néon",
            button_style_glass: "Verre",
            button_style_radar: "Radar",
        },
        en: {
            geoloc_error: "Geolocation error.",
            geoloc_not_supported: "Geolocation not supported.",
            location_unavailable: "Unable to get location.",
            location_getting: "Getting location...",
            activate_sensors: "Use Sensors",
            stop_sensors: "Stop Sensors",
            manual_entry: "Manual Input",
            location: "Location (Latitude)",
            latitude_placeholder: "Latitude required",
            target_date: "Target Date",
            current_angle: "Tilt",
            orientation: "Azimuth",
            memorize_action: "Memorize",
            memorized: "Saved!",
            calibrate_tilt: "Calibrate Flat",
            calibrate_tilt_success: "Calibrated!",
            light_theme_label: "Theme",
            tilt: "Tilt",
            tilt_placeholder: "e.g. 35",
            orientation_short: "Azimuth",
            orientation_placeholder: "0 (South)",
            recommended_angle: "Recommended Angle",
            waiting_for_sensor: "Point your device...",
            calculate_gain: "Estimate Production",
            donation_message: "If this estimate was helpful, consider supporting this project by buying me a small coffee! ☕",
            estimation_title: "Production Estimate",
            peak_power: "Peak power (kWp)",
            longitude: "Longitude",
            current_tilt: "Current Tilt (°)",
            current_azimuth: "Current Azimuth (Deviation / South)",
            azimuth_placeholder: "e.g. -10 (10° East)",
            calculate_gain_long: "Calculate Gain",
            prod_current_settings: "Production (your tilt)",
            prod_optimal_settings: "Production (optimal tilt for YOUR azimuth)",
            prod_truly_optimal_settings: "IDEAL Production (if South-facing)",
            daily_gain: "Potential Daily Gain",
            monthly_gain: "Potential Monthly Gain",
            settings_title: "Settings",
            clipping_label: "Optimize for clipping",
            clipping_title: "Clipping Optimization",
            clipping_problem_title: "The Problem",
            clipping_problem_desc: "In summer, your solar production might exceed your inverter's maximum power. This excess energy is lost: this is clipping.",
            clipping_solution_title: "The Solution",
            clipping_solution_desc: "Checking this box intentionally increases the panel angle. This slightly reduces the production peak at noon and increases morning/evening production.",
            got_it: "Got it",
            replay_tutorial: "Replay Guide",
            main_guide_title: "User Guide",
            guide_step1_title: "Step 1: Location & Date",
            guide_step1_desc: "Ensure your latitude is correct (use GPS if needed) and the target date is set as desired.",
            guide_step2_title: "Step 2: Choose Mode",
            guide_step2_desc: "<strong class='text-fg'>Sensors:</strong> For a real measurement, place your phone on the panel.<br><strong class='text-yellow-400'>Warning: remove any magnetic case.</strong><br><br><strong class='text-fg'>Manual:</strong> For a simulation, enter tilt and azimuth manually.",
            guide_step3_title: "Step 3: Read the Result",
            guide_step3_desc: "The recommended angle appears and adjusts in real-time.",
            guide_step4_title: "Step 4: Estimate Gain",
            guide_step4_desc: "Click \"Estimate Production\" for an accurate simulation.",
            estimation_guide_title: "Estimation Guide",
            estimation_guide_step1_title: "Check Your Data",
            estimation_guide_step1_desc: "The fields are pre-filled from the previous page. You can edit them to simulate other configurations.",
            estimation_guide_step2_title: "Run the Calculation",
            estimation_guide_step2_desc: "Click \"Calculate\" to compare the estimated annual production of your current setup with the recommended optimal setup.",
            onboarding_step1_title: "Step 1: Calibrate",
            onboarding_step1_desc: "For an accurate measurement, calibrate your compass by making a 'figure 8' motion with your phone.",
            onboarding_step2_title: "Step 2: Activate",
            onboarding_step2_desc: "Press \"Use Sensors\" to start receiving data.",
            onboarding_step3_title: "Step 3: Place",
            onboarding_step3_desc: "Lay your phone (without a magnetic case) flat on your solar panel.",
            onboarding_step4_title: "Step 4: Memorize",
            onboarding_step4_desc: "Once the values are stable, press the large round button!",
            onboarding_prev: "Previous",
            onboarding_next: "Next",
            onboarding_finish: "Finish",
            compass_north: "NORTH",
            compass_south: "SOUTH",
            compass_east: "EAST",
            compass_west: "WEST",
            fill_all_fields_error: "Please fill all fields.",
            settings_already_optimal: "Your current settings are already optimal.",
            pvgis_error: "PVGIS communication error.",
            offline_error: "No internet connection.",
            export_pdf: "Export to PDF",
            exporting_pdf: "Generating...",
            export_error_no_data: "Please run a production estimate first.",
            pdf_disclaimer_title: "Important Disclaimer Regarding Accuracy",
            pdf_disclaimer_text: "The production data and tilt/orientation measurements in this report are estimates. Sensor accuracy (compass, accelerometer) can vary significantly between phone models. Furthermore, the presence of nearby metallic objects, and especially the use of <strong>magnetic cases or mounts</strong>, can cause significant orientation errors. It is strongly recommended to remove any magnetic case before measuring. The creators of this application cannot be held responsible for discrepancies between the estimates and actual production.",
            pdf_explanation_title: "About the Estimates",
            pdf_explanation_text: "The 'Optimal Production' compares your current tilt to the best possible tilt for YOUR orientation. The 'Ideal Production' is a reference value showing the potential if your installation were perfectly South-facing with an optimal tilt.",
            sensors_activating: "Activating sensors...",
            invalid_measurements: "Invalid measurements.",
            button_style_label: "\"Memorize\" button style",
            button_style_default: "Default",
            button_style_neon: "Neon",
            button_style_glass: "Glass",
            button_style_radar: "Radar",
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
        stabilityThreshold: 4.0, /* MODIFICATION : Seuil de stabilité augmenté de 2.0 à 4.0 */
        stabilityBuffer: 5,
        continuousHeading: null, /* AJOUT : Pour une rotation fluide de la boussole */
        lastCurrentProd: null,
        lastOptimalProd: null,
        lastTrulyOptimalProd: null,
        lastRecommendedTilt: null,
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
        closeSettingsBtn: document.getElementById('close-settings-btn'),
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
        calibrateTiltBtn: document.getElementById('calibrate-tilt-btn')
    };

    const utils = {
        log: (...args) => { if (DEBUG) console.log('[OptiSolar]', ...args); },
        toRadians: (deg) => deg * Math.PI / 180,
        getDayOfYear: (date) => Math.floor((date - new Date(date.getFullYear(), 0, 0)) / 86400000),
        getDeclination: (dayOfYear) => -23.44 * Math.cos(utils.toRadians((360 / 365) * (dayOfYear + 10))),
        formatNumber: (n, dec = 2) => {
            if (n === null || n === undefined || isNaN(n)) return '--';
            return Number(n).toLocaleString(i18n.currentLang === 'fr' ? 'fr-FR' : 'en-US', { minimumFractionDigits: dec, maximumFractionDigits: dec })
        },
        safeParseFloat: (v, fallback = NaN) => {
            if (v === null || v === undefined || v === '') return fallback;
            const s = String(v).replace(',', '.').trim();
            const n = parseFloat(s);
            return Number.isFinite(n) ? n : fallback;
        },
        clamp: (x, min, max) => Math.min(Math.max(x, min), max),
        normalizeAngle: (a) => (a % 360 + 360) % 360,
        playSuccessNotification: async () => {
            try {
                const { Haptics, ImpactStyle } = Capacitor.Plugins;
                await Haptics.impact({ style: ImpactStyle.Light });
            } catch(e) {
                 utils.log("Haptics not available, fallback to vibrate", e);
                 if (navigator.vibrate) navigator.vibrate(50);
            }
            try {
                const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
                const oscillator = audioCtx.createOscillator();
                const gainNode = audioCtx.createGain();
                oscillator.type = 'sine';
                oscillator.frequency.setValueAtTime(880, audioCtx.currentTime); 
                gainNode.gain.setValueAtTime(0.2, audioCtx.currentTime);
                gainNode.gain.linearRampToValueAtTime(0.0001, audioCtx.currentTime + 0.15);
                oscillator.connect(gainNode);
                gainNode.connect(audioCtx.destination);
                oscillator.start(audioCtx.currentTime);
                oscillator.stop(audioCtx.currentTime + 0.15);
            } catch (e) {
                utils.log("Web Audio API failed", e);
            }
        },
        openExternalUrl: async (url) => {
            if (window.Capacitor && window.Capacitor.Plugins && window.Capacitor.Plugins.Browser) {
                await window.Capacitor.Plugins.Browser.open({ url: url });
            } else {
                window.open(url, '_blank');
            }
        }
    };

    const i18n = {
        currentLang: 'fr',
        setLanguage: function(lang) {
            if (!translations[lang] || !translations[lang].compass_west) return;
            this.currentLang = lang;
            document.documentElement.lang = lang;
            localStorage.setItem('userLang', lang);
            document.querySelectorAll('[data-i18n]').forEach(el => {
                const key = el.dataset.i18n;
                if (translations[lang][key]) el.innerHTML = translations[lang][key];
            });
            document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
                const key = el.dataset.i18nPlaceholder;
                if (translations[lang][key]) el.placeholder = translations[lang][key];
            });
            document.querySelectorAll('.lang-btn').forEach(btn => btn.classList.toggle('active', btn.dataset.lang === lang));
            
            const buttonKey = state.sensorsActive ? 'stop_sensors' : 'activate_sensors';
            dom.activateSensorsButton.textContent = translations[lang][buttonKey];

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
                Math.abs(utils.normalizeAngle(r.heading - first.heading)) <= state.stabilityThreshold
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
            const lang = i18n.currentLang;
            const tolerance = 5;

            if (azimuth >= (360 - tolerance) || azimuth <= tolerance) return translations[lang].compass_north;
            if (Math.abs(azimuth - 90) <= tolerance) return translations[lang].compass_east;
            if (Math.abs(azimuth - 180) <= tolerance) return translations[lang].compass_south;
            if (Math.abs(azimuth - 270) <= tolerance) return translations[lang].compass_west;
            
            let deviation = azimuth - 180;
            if (deviation > 180) deviation -= 360;
            if (deviation < -180) deviation += 360;
            
            const direction = deviation < 0 ? translations[lang].compass_east : translations[lang].compass_west;
            const dirSymbol = direction === translations[lang].compass_east ? translations[lang].compass_east[0] : translations[lang].compass_west[0];
            return `${Math.abs(Math.round(deviation))}° ${dirSymbol}`;
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

                // --- MODIFICATION : Logique pour la rotation fluide de la boussole ---
                if (state.continuousHeading === null) {
                    state.continuousHeading = state.panelAzimuthLive;
                } else {
                    let diff = state.panelAzimuthLive - (state.continuousHeading % 360);
                    if (diff > 180) diff -= 360;
                    if (diff < -180) diff += 360;
                    state.continuousHeading += diff;
                }
                dom.compassRoseContainer.style.transition = 'transform 0.2s linear'; // Assurer une transition fluide
                dom.compassRoseContainer.style.transform = `rotate(${state.continuousHeading}deg)`;
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
                dom.activateSensorsButton.setAttribute('data-i18n', 'stop_sensors');
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
            state.continuousHeading = null; // Réinitialiser la boussole
            sensors.setStable(false);
            state.lastReadings = [];
            dom.activateSensorsButton.textContent = translations[i18n.currentLang].activate_sensors;
            dom.activateSensorsButton.setAttribute('data-i18n', 'activate_sensors');
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

            state.memorizedTilt = tilt;
            state.memorizedAzimuthValue = az;
            
            // --- AJOUT : Retour haptique ---
            utils.playSuccessNotification();

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
        exportToPDF: () => {
            if (!state.lastCurrentProd || !state.lastOptimalProd || !state.lastTrulyOptimalProd) {
                alert(translations[i18n.currentLang].export_error_no_data);
                return;
            }
            const btn = dom.exportPdfBtn;
            const originalText = btn.querySelector('span').textContent;
            btn.disabled = true;
            btn.querySelector('span').textContent = translations[i18n.currentLang].exporting_pdf;

            const gainDailyNum = state.lastOptimalProd.outputs.totals.fixed.E_d - state.lastCurrentProd.outputs.totals.fixed.E_d;
            const gainMonthlyNum = gainDailyNum * 30.4;
            const gainDailyText = gainDailyNum < 1 ? `~ ${Math.round(gainDailyNum * 1000)} Wh` : `~ ${utils.formatNumber(gainDailyNum)} kWh`;
            const gainMonthlyText = `~ ${utils.formatNumber(gainMonthlyNum)} kWh`;

            const formattedDate = new Date(dom.dateInput.value).toLocaleDateString(i18n.currentLang === 'fr' ? 'fr-FR' : 'en-US');
            const curDailyProd = utils.formatNumber(state.lastCurrentProd.outputs.totals.fixed.E_d);
            const optDailyProd = utils.formatNumber(state.lastOptimalProd.outputs.totals.fixed.E_d);
            const trulyOptDailyProd = utils.formatNumber(state.lastTrulyOptimalProd.outputs.totals.fixed.E_d);
            const currentTilt = dom.currentTiltInput.value || '--';
            const currentAzimuth = dom.currentAzimuthInput.value || '--';
            const recommendedTilt = state.lastRecommendedTilt ? Math.round(state.lastRecommendedTilt) : '--';
            const idealOptimalTilt = state.lastIdealOptimalTilt ? Math.round(state.lastIdealOptimalTilt) : recommendedTilt;
            
            const reportElement = document.createElement('div');
            reportElement.innerHTML = `
                <div style="font-family: Arial, sans-serif; padding: 40px; color: #333;">
                    <h1 style="color: #1d4ed8; border-bottom: 2px solid #1d4ed8; padding-bottom: 10px;">Rapport d'Optimisation Solaire</h1>
                    <p style="text-align: right; font-size: 12px;">Généré par Opti Solar le ${new Date().toLocaleDateString(i18n.currentLang === 'fr' ? 'fr-FR' : 'en-US')}</p>
                    <h2 style="color: #1d4ed8; margin-top: 30px;">Paramètres de la Simulation</h2>
                    <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
                        <tr style="background-color: #f1f5f9;"><td style="padding: 8px; border: 1px solid #ddd; width: 40%;">Localisation</td><td style="padding: 8px; border: 1px solid #ddd;">Lat ${dom.latitudeInput.value}, Lon ${dom.longitudeInput.value}</td></tr>
                        <tr><td style="padding: 8px; border: 1px solid #ddd;">Date de référence</td><td style="padding: 8px; border: 1px solid #ddd;">${formattedDate}</td></tr>
                        <tr style="background-color: #f1f5f9;"><td style="padding: 8px; border: 1px solid #ddd;">Puissance crête</td><td style="padding: 8px; border: 1px solid #ddd;">${dom.peakPowerInput.value} kWc</td></tr>
                    </table>
                    <h2 style="color: #1d4ed8; margin-top: 30px;">Comparatif de Production Journalière Estimée</h2>
                    <table style="width: 100%; border-collapse: collapse; margin-top: 10px; font-size: 14px;">
                        <thead>
                            <tr style="background-color: #1d4ed8; color: white; text-align: left;"><th style="padding: 8px;">Configuration</th><th style="padding: 8px;">Inclinaison</th><th style="padding: 8px;">Orientation</th><th style="padding: 8px;">Production Journalière</th></tr>
                        </thead>
                        <tbody>
                            <tr style="background-color: #f1f5f9;"><td style="padding: 8px; border: 1px solid #ddd;">Actuelle</td><td style="padding: 8px; border: 1px solid #ddd;">${currentTilt}°</td><td style="padding: 8px; border: 1px solid #ddd;">${currentAzimuth}° / Sud</td><td style="padding: 8px; border: 1px solid #ddd;">${curDailyProd} kWh</td></tr>
                            <tr><td style="padding: 8px; border: 1px solid #ddd;">Optimale (votre orientation)</td><td style="padding: 8px; border: 1px solid #ddd;">${recommendedTilt}°</td><td style="padding: 8px; border: 1px solid #ddd;">${currentAzimuth}° / Sud</td><td style="padding: 8px; border: 1px solid #ddd; font-weight: bold; color: #065f46;">${optDailyProd} kWh</td></tr>
                            <tr style="background-color: #f1f5f9;"><td style="padding: 8px; border: 1px solid #ddd; font-style: italic;">Idéale (plein Sud)</td><td style="padding: 8px; border: 1px solid #ddd; font-style: italic;">${idealOptimalTilt}°</td><td style="padding: 8px; border: 1px solid #ddd; font-style: italic;">0° / Sud</td><td style="padding: 8px; border: 1px solid #ddd; font-style: italic;">${trulyOptDailyProd} kWh</td></tr>
                        </tbody>
                    </table>
                     <h2 style="color: #1d4ed8; margin-top: 30px;">Gain Potentiel Estimé</h2>
                     <table style="width: 100%; border-collapse: collapse; margin-top: 10px; font-size: 14px;">
                        <tr style="background-color: #f1f5f9;"><td style="padding: 8px; border: 1px solid #ddd; width: 40%;">${translations[i18n.currentLang].daily_gain}</td><td style="padding: 8px; border: 1px solid #ddd; font-weight: bold; font-size: 1.2em; color: #1e40af;">${gainDailyText}</td></tr>
                        <tr><td style="padding: 8px; border: 1px solid #ddd;">${translations[i18n.currentLang].monthly_gain}</td><td style="padding: 8px; border: 1px solid #ddd; font-weight: bold; font-size: 1.2em; color: #1e40af;">${gainMonthlyText}</td></tr>
                    </table>
                    <div style="margin-top: 30px; padding: 15px; background-color: #f1f5f9; border-radius: 8px; font-size: 12px;">
                        <h3 style="color: #1d4ed8; margin-top: 0;">${translations[i18n.currentLang].pdf_explanation_title}</h3>
                        <p>${translations[i18n.currentLang].pdf_explanation_text}</p>
                    </div>
                    <div style="margin-top: 20px; padding-top: 15px; border-top: 1px solid #ccc; font-size: 10px; color: #555;">
                        <h4 style="color: #333; margin-top: 0; font-size: 12px;">${translations[i18n.currentLang].pdf_disclaimer_title}</h4>
                        <p>${translations[i18n.currentLang].pdf_disclaimer_text}</p>
                    </div>
                </div>
            `;

            const filename = `OptiSolar_Rapport_${new Date().toISOString().split('T')[0]}.pdf`;
            html2pdf().from(reportElement).set({
                margin: 10,
                filename: filename,
                image: { type: 'jpeg', quality: 0.98 },
                html2canvas: { scale: 2 },
                jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
            }).save().then(() => {
                btn.disabled = false;
                btn.querySelector('span').textContent = originalText;
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

    const api = {
        fetchPVGIS: async (lat, lon, peakpower, angle, aspect) => {
            const cacheKey = `pvgis:${lat}:${lon}:${peakpower}:${angle}:${aspect}`;
            try {
                const cachedData = sessionStorage.getItem(cacheKey);
                if (cachedData) {
                    utils.log('Returning cached PVGIS data.');
                    return JSON.parse(cachedData);
                }
            } catch (e) {
                utils.log('Could not access sessionStorage', e);
            }

            const fetchWithTimeout = (resource, options = {}, timeout = 8000) => {
              return new Promise((resolve, reject) => {
                const controller = new AbortController();
                const id = setTimeout(() => {
                    controller.abort();
                    reject(new Error('Fetch timeout'));
                }, timeout);
                fetch(resource, { ...options, signal: controller.signal })
                  .then(response => {
                    clearTimeout(id);
                    resolve(response);
                  })
                  .catch(error => {
                    clearTimeout(id);
                    reject(error);
                  });
              });
            };

            const pvgisUrl = `https://re.jrc.ec.europa.eu/api/PVcalc?lat=${lat}&lon=${lon}&peakpower=${peakpower}&loss=14&angle=${angle}&aspect=${aspect}&outputformat=json`;
            
            const strategies = [
                // AJOUT : Tentative directe en premier
                async () => {
                    const res = await fetchWithTimeout(pvgisUrl, {}, 5000); // Timeout plus court
                    if (!res.ok) throw new Error('Direct PVGIS fetch failed');
                    return await res.json();
                },
                async () => {
                     const proxyUrl = `https://api.allorigins.win/json?url=${encodeURIComponent(pvgisUrl)}`;
                     const res = await fetchWithTimeout(proxyUrl, {}, 8000);
                     if (!res.ok) throw new Error('Proxy allorigins.win failed');
                     const data = await res.json();
                     if (!data.contents) throw new Error('Proxy returned empty content');
                     return JSON.parse(data.contents);
                },
                async () => {
                    const proxyUrl = `https://corsproxy.io/?${encodeURIComponent(pvgisUrl)}`;
                    const res = await fetchWithTimeout(proxyUrl, {}, 8000);
                    if (!res.ok) throw new Error('Proxy corsproxy.io failed');
                    return await res.json();
                }
            ];

            for (let i = 0; i < strategies.length; i++) {
                try {
                    utils.log(`Attempting PVGIS fetch with strategy #${i + 1}`);
                    const json = await strategies[i]();
                    if (json?.outputs?.totals?.fixed) {
                        utils.log(`Strategy #${i + 1} succeeded.`);
                        try {
                            sessionStorage.setItem(cacheKey, JSON.stringify(json));
                        } catch (e) {
                            utils.log('Could not save to sessionStorage', e);
                        }
                        return json;
                    }
                } catch (error) {
                    utils.log(`Strategy #${i + 1} failed:`, error.message);
                }
            }

            throw new Error('All PVGIS fetch strategies failed.');
        },
        getProductionEstimate: async () => { 
            dom.exportContainer.classList.add('hidden');
            dom.pvgisError.textContent = ''; 
            dom.productionResults.classList.add('hidden');
            dom.donationMessage.classList.add('hidden');
            dom.calculateLoader.classList.remove('hidden');
            dom.calculateText.classList.add('hidden');

            // AJOUT : Vérification de la connexion internet
            if (navigator.onLine === false) {
                dom.pvgisError.textContent = translations[i18n.currentLang].offline_error;
                dom.calculateText.classList.remove('hidden'); 
                dom.calculateLoader.classList.add('hidden'); 
                return;
            }

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
                let idealOptimalTilt = Math.round(utils.clamp(90 - (90 - Math.abs(lat - declination)) + clipping, 0, 90));

                state.lastRecommendedTilt = finalOptimalTilt;

                const [current, optimal, trulyOptimal] = await Promise.all([ 
                    api.fetchPVGIS(lat, lon, peakPower, currentTilt, currentAzimuth), 
                    api.fetchPVGIS(lat, lon, peakPower, finalOptimalTilt, currentAzimuth),
                    api.fetchPVGIS(lat, lon, peakPower, idealOptimalTilt, 0)
                ]);
                
                state.lastCurrentProd = current;
                state.lastOptimalProd = optimal;
                state.lastTrulyOptimalProd = trulyOptimal;

                let curDaily = Number(current.outputs.totals.fixed.E_d) || 0; 
                let optDaily = Number(optimal.outputs.totals.fixed.E_d) || 0;
                let trulyOptDaily = Number(trulyOptimal.outputs.totals.fixed.E_d) || 0;

                if (optDaily < curDaily) { 
                    optDaily = curDaily;
                    dom.pvgisError.textContent = translations[i18n.currentLang].settings_already_optimal; 
                } else {
                    dom.pvgisError.textContent = '';
                }

                dom.currentProductionDisplay.textContent = `${utils.formatNumber(curDaily)} kWh`; 
                dom.optimalProductionDisplay.textContent = `${utils.formatNumber(optDaily)} kWh`; 
                dom.trulyOptimalProductionDisplay.textContent = `${utils.formatNumber(trulyOptDaily)} kWh`;

                const gainDaily = optDaily - curDaily;
                dom.potentialGainDailyDisplay.textContent = gainDaily < 1 ? `~ ${Math.round(gainDaily * 1000)} Wh` : `~ ${utils.formatNumber(gainDaily)} kWh`; 
                const gainMonthly = gainDaily * 30.4; // Average days in month
                dom.potentialGainMonthlyDisplay.textContent = `~ ${utils.formatNumber(gainMonthly)} kWh`; 
                
                dom.productionResults.classList.remove('hidden');
                dom.donationMessage.classList.remove('hidden');
                dom.exportContainer.classList.remove('hidden');
                utils.playSuccessNotification();
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

        // =================================================================
        // CODE POUR LES BOUTONS ROTATIFS
        // =================================================================

        // --- 1. Gestion du style du bouton "Mémoriser" ---
        const styleKnob = document.getElementById('style-knob');
        const styleKnobLabel = document.getElementById('style-knob-label');
        const memorizeRingBtn = dom.memorizeRingBtn;

        const styleOptions = [
            { id: 'default', label: translations[i18n.currentLang].button_style_default },
            { id: 'neon',    label: translations[i18n.currentLang].button_style_neon },
            { id: 'glass',   label: translations[i18n.currentLang].button_style_glass },
            { id: 'radar',   label: translations[i18n.currentLang].button_style_radar }
        ];
        let currentStyleIndex = 0;

        const applyMemorizeBtnStyle = (styleId) => {
            if (!memorizeRingBtn) return;
            memorizeRingBtn.className = 'font-bold'; 
            memorizeRingBtn.classList.add(`btn-style-${styleId}`);
        };

        const updateStyleKnob = () => {
            const selectedStyle = styleOptions[currentStyleIndex];
            const angle = currentStyleIndex * (360 / styleOptions.length);
            styleKnob.querySelector('.knob-indicator').style.transform = `translateX(-50%) rotate(${angle}deg)`;
            styleKnobLabel.textContent = selectedStyle.label;
            applyMemorizeBtnStyle(selectedStyle.id);
            localStorage.setItem('memorizeBtnStyle', selectedStyle.id);
        };

        styleKnob.addEventListener('click', () => {
            currentStyleIndex = (currentStyleIndex + 1) % styleOptions.length;
            updateStyleKnob();
        });

        const savedStyleId = localStorage.getItem('memorizeBtnStyle') || 'default';
        currentStyleIndex = styleOptions.findIndex(opt => opt.id === savedStyleId);
        if (currentStyleIndex === -1) currentStyleIndex = 0;
        updateStyleKnob();

        // --- 2. Gestion du Thème de l'application ---
        const themeKnob = document.getElementById('theme-knob');
        const themeKnobLabel = document.getElementById('theme-knob-label');

        const themeOptions = [
            { id: 'dark',   label: 'Sombre', className: '' },
            { id: 'light',  label: 'Clair',  className: 'light-mode' },
            { id: 'style2', label: 'HUD',   className: 'style2-mode' },
            { id: 'solar',  label: 'Solaire', className: 'solar-mode' }
        ];
        let currentThemeIndex = 0;

        const applyTheme = (theme) => {
            // Préserve les classes existantes du <body>
            document.body.classList.remove('light-mode','style2-mode','solar-mode');
            if (theme.className) {
                document.body.classList.add(theme.className);
            }
            localStorage.setItem('userTheme', theme.id);
        };

        const updateThemeKnob = () => {
            const selectedTheme = themeOptions[currentThemeIndex];
            const angle = currentThemeIndex * (360 / themeOptions.length);
            themeKnob.querySelector('.knob-indicator').style.transform = `translateX(-50%) rotate(${angle}deg)`;
            themeKnobLabel.textContent = selectedTheme.label;
            applyTheme(selectedTheme);
        };

        themeKnob.addEventListener('click', () => {
            currentThemeIndex = (currentThemeIndex + 1) % themeOptions.length;
            updateThemeKnob();
        });

        const savedThemeId = localStorage.getItem('userTheme') || 'solar';
        currentThemeIndex = themeOptions.findIndex(opt => opt.id === savedThemeId);
        if (currentThemeIndex === -1) currentThemeIndex = 0;
        updateThemeKnob();

        // =================================================================
        // FIN DU CODE POUR LES BOUTONS ROTATIFS
        // =================================================================

        if (!localStorage.getItem('onboardingComplete')) {
            onboarding.start();
        }

        ['change', 'input'].forEach(evt => {
            [dom.latitudeInput, dom.dateInput, dom.clippingCheckbox, dom.manualTiltInput, dom.manualAzimuthInput].forEach(el => {
                if(el) el.addEventListener(evt, calculations.calculateAndDisplayAll);
            });
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
        
        // MODIFICATION : Utilisation du Browser Plugin
        dom.bugReportButton.addEventListener('click', handlers.openBugReport);
		dom.donationMessage.addEventListener('click', (e) => { e.preventDefault(); utils.openExternalUrl(CONFIG.donateLink); });
        dom.donateButtonFab.addEventListener('click', (e) => { e.preventDefault(); utils.openExternalUrl(CONFIG.donateLink); });

        dom.gotoEstimationButton.addEventListener('click', handlers.prepareEstimationPage);
        dom.backButton.addEventListener('click', () => ui.showPage('main'));
        dom.closeSettingsBtn.addEventListener('click', () => ui.showPage('main'));
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
        
        document.getElementById('lang-switcher').addEventListener('click', (e) => {
            if (e.target.matches('.lang-btn')) {
                i18n.setLanguage(e.target.dataset.lang);
            }
        });

        const today = new Date();
        dom.dateInput.value = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
        
        calculations.calculateAndDisplayAll();

        // =================================================================
        // GESTION DU BOUTON "RETOUR" ANDROID
        // =================================================================
        if (window.Capacitor && Capacitor.isPluginAvailable('App')) {
            Capacitor.Plugins.App.addListener('backButton', (event) => {
                event.preventDefault();

                // MODIFICATION : Détection élargie pour inclure les splash screens
                const openElement = document.querySelector('.fixed.inset-0:not(.hidden), #splashOverlay:not(.exit), #pg-splash:not(.pg-hide)');
                if (openElement) {
                    if (openElement.id === 'splashOverlay') openElement.classList.add('exit');
                    else if (openElement.id === 'pg-splash') openElement.classList.add('pg-hide');
                    else openElement.classList.add('hidden');
                    return;
                }

                if (!dom.settingsPage.classList.contains('hidden')) {
                    ui.showPage('main');
                    return;
                }
                
                Capacitor.Plugins.App.exitApp();
            });
        }
    }
    
    window.addEventListener('load', init);
})();

// === Photon Grid Splash (non intrusif) ===
(function(){
  if (typeof window === 'undefined') return;
  const splash = document.getElementById('pg-splash');
  if (!splash) return;
  
  // Option pour désactiver: ?nosplash=1
  const bypass = /[?&]nosplash=1 /.test(location.search);
  if (bypass){
    splash.classList.add('pg-hide');
    return;
  }

  // On va l'afficher : retirer pg-hide
  splash.classList.remove('pg-hide');

  const needle = document.getElementById('pg-needle');
  function setAngle(a){
    const clamped = Math.max(0, Math.min(90, a || 0));
    needle.style.transform = `translate(-50%,-100%) rotate(${clamped-90}deg)`;
  }

  const lastLat = parseFloat(localStorage.getItem('lastLat') || localStorage.getItem('latitude') || '44.13');
  const approx = Math.max(0, Math.min(90, Math.round(Math.abs(lastLat)*0.8)));
  setTimeout(()=> setAngle(approx), 1200);

  const pulseMemorize = () => {
    const candidates = Array.from(document.querySelectorAll('button, [role="button"]'));
    const target = candidates.find(el => /m[ée]moriser/i.test(el.textContent||''));
    if (target){ target.classList.add('pg-pulse'); setTimeout(()=>target.classList.remove('pg-pulse'), 3000); }
  };

  function closeSplash(){
    if (!splash || splash.classList.contains('pg-hide')) return;
    splash.classList.add('pg-hide');
    setTimeout(()=>{ try{splash.remove();}catch(e){} pulseMemorize(); }, 620);
  }

  // Fermer si on tape hors bouton également (fail‑safe UX)
  splash.addEventListener('click', (e)=>{
    if (!(e.target && (e.target.id === 'pg-calibrate'))) { closeSplash(); }
  });

  document.getElementById('pg-calibrate')?.addEventListener('click', async (ev)=>{
    ev.stopPropagation();
    try{
      if (window.Capacitor?.Plugins?.Haptics) { await window.Capacitor.Plugins.Haptics.vibrate(); }
      else if (navigator.vibrate) { navigator.vibrate(10); }
    }catch(_){}
    let ended = false;
    if (navigator.geolocation){
      navigator.geolocation.getCurrentPosition((pos)=>{
        const lat = pos.coords.latitude, lon = pos.coords.longitude;
        localStorage.setItem('lastLat', String(lat));
        localStorage.setItem('lastLon', String(lon));
        window.dispatchEvent(new CustomEvent('photon:geo', {detail:{lat,lon}}));
        ['onGeoUpdate','updateLocation','applyGeo','handleGPS','calibrateWithPosition'].forEach(fn=>{
          if (typeof window[fn] === 'function'){ try{ window[fn](lat,lon); ended=true; }catch(e){} }
        });
        setAngle(Math.max(0, Math.min(90, Math.round(Math.abs(lat)*0.9))));
        setTimeout(closeSplash, 800);
      }, ()=>{ closeSplash(); }, {timeout:2500, maximumAge:60000});
    }
    if (!ended){ setTimeout(closeSplash, 1200); }
  });

  // Fail‑safe ultime : ferme quoi qu’il arrive après 6,5s
  setTimeout(closeSplash, 6500);
})();

// Enhance splash visuals: set app name, place location, play zoom
(function(){
  const splash = document.getElementById('pg-splash');
  if (!splash) return;
  const appnameEl = document.getElementById('pg-appname');
  const metaApp = document.querySelector('meta[name="application-name"]')?.content;
  const titleApp = document.title;
  const appName = (metaApp && metaApp.trim()) || (titleApp && titleApp.trim()) || 'Solar Setup';
  if (appnameEl) appnameEl.textContent = appName;

  const loc = document.getElementById('pg-loc');
  // lat/lon last known (fallback Alès approx)
  const lat = parseFloat(localStorage.getItem('lastLat') || localStorage.getItem('latitude') || '44.12');
  const lon = parseFloat(localStorage.getItem('lastLon') || localStorage.getItem('longitude') || '4.08');
  if (!isNaN(lat) && !isNaN(lon) && loc){
    // simple equirectangular projection onto the globe box: 0..100%
    const x = ((lon + 180) / 360) * 100;
    const y = ((90 - lat) / 180) * 100;
    loc.style.setProperty('--x', x+'%');
    loc.style.setProperty('--y', y+'%');
  }
  // small zoom effect class
  splash.classList.add('pg-zoom');
})();


// === Splash Overlay controller v3 ===
(function(){
  const overlay = document.getElementById('splashOverlay');
  if(!overlay) return;
  // Ensure any legacy splash never shows
  document.getElementById('pg-splash')?.remove();
  document.querySelector('.pg-splash')?.remove();
  document.getElementById('pg-zoom')?.remove();
  document.querySelector('.pg-zoom')?.remove();

  let particleTimer = null;
  function makeSpark(){
    const box=overlay.querySelector('#particles'); const W=window.innerWidth, H=window.innerHeight;
    const s=document.createElement('div'); s.className='spark'; box.appendChild(s);
    const x=Math.random()*W; const size = 1 + Math.random()*1.5;
    s.style.width=size+'px'; s.style.height=size+'px';
    const startY=H + 10 + Math.random()*30;
    const dx=(Math.random()-.5)*80; const dy= - (H + 120 + Math.random()*160);
    const dur= 5200 + Math.random()*2400;
    s.style.left=x+'px'; s.style.top=startY+'px';
    const anim = s.animate([{opacity:0, transform:'translate(0,0) scale(1)'},{opacity:.8, offset:.15},{opacity:0, transform:`translate(${dx}px, ${dy}px) scale(${1+Math.random()*0.5})`}], {duration:dur, easing:'ease-out', fill:'both'});
    anim.onfinish=()=> s.remove();
  }
  function spawnParticles(){
    if(particleTimer) clearInterval(particleTimer);
    for(let i=0;i<24;i++) makeSpark();
    particleTimer = setInterval(()=>{ for(let i=0;i<6;i++) makeSpark(); }, 260);
  }
  function animateCurves(){
    const iv=overlay.querySelector('#iv'); const pv=overlay.querySelector('#pv');
    [iv,pv].forEach(p=>{ if(!p) return; const len=p.getTotalLength(); p.style.strokeDasharray=len; p.style.strokeDashoffset=len; p.getBoundingClientRect(); p.style.transition='stroke-dashoffset 1200ms ease-out'; p.style.strokeDashoffset='0'; });
  }
  const SPLASH_MS = 3400;
  let exitTimer = null, exiting = false;
  function exitSplash(){
    if(exiting) return; exiting = true;
    if(particleTimer) clearInterval(particleTimer);
    if(exitTimer) clearTimeout(exitTimer);
    overlay.classList.add('exit');
    setTimeout(()=> overlay.remove(), 420);
  }
  function startSequence(){
    animateCurves();
    spawnParticles();
    setTimeout(()=>{ overlay.querySelectorAll('.splash-btn').forEach(b=>b.classList.add('show')); }, 600);
    exitTimer = setTimeout(exitSplash, SPLASH_MS);
  }
  overlay.querySelector('#continueBtn')?.addEventListener('click', exitSplash);
  window.addEventListener('load', startSequence);
})();