(function() {
    'use strict';

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
            export_pdf: "Exporter en PDF",
            prod_truly_optimal_settings: "Production (inclinaison optimale réelle)",
            donation_message: "Si cet outil vous est utile, un petit don aide à couvrir les coûts de serveurs et de tests. Merci 🙏",
            fill_all_fields_error: "Veuillez remplir latitude, longitude, puissance, inclinaison et orientation.",
            settings_already_optimal: "Votre configuration est déjà optimale.",
            pdf_disclaimer_title: "Avertissement Important Concernant la Précision",
            pdf_disclaimer_text: "Les résultats ci‑dessus proviennent de PVGIS (Commission Européenne) et sont fournis à titre indicatif. Ils dépendent de l’exactitude de votre localisation, des données météorologiques et de vos saisies (inclinaison/orientation). Aucune garantie n’est donnée. Utiliser pour l’aide à la décision, pas comme un devis contractuel.",
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
            guide_step1_desc: "<strong class='text-fg'>Étape 1 : Localisation & Date</strong><br>Assurez-vous que votre latitude est correcte (utilisez le GPS si besoin) et que la date cible est bien celle souhaitée.",
            guide_step2_desc: "<strong class='text-fg'>Étape 2 : Choix du Mode</strong><br><strong>Capteurs :</strong> Pour une mesure réelle, posez le téléphone sur votre panneau.<br><strong>Manuel :</strong> Pour une simulation, entrez l'inclinaison et l'orientation manuellement.",
            compass_south: "Plein Sud",
            pvgis_error: "Erreur communication PVGIS.",
            sensors_activating: "Activation des capteurs...",
        },
en: {
                    geoloc_error: "Geolocation error.",
                    geoloc_not_supported: "Geolocation not supported.",
                    location_unavailable: "Unable to get location.",
                    location_getting: "Getting location...",
                    activate_sensors: "Use Sensors",
                    stop_sensors: "Stop Sensors",
                    manual_entry: "Manual Input",
                    location: "Location",
                    latitude_placeholder: "Latitude required",
                    target_date: "Target Date",
                    current_angle: "Current Angle",
                    orientation: "Orientation",
                    memorize_action: "Memorize",
                    memorized: "Saved!",
                    calibrate_tilt: "Calibrate Flat",
                    calibrate_tilt_success: "Calibrated!",
                    light_theme_label: "Light Mode",
                    tilt: "Tilt (°)",
                    tilt_placeholder: "e.g. 35",
                    orientation_short: "Orientation (°)",
                    orientation_helper: "EAST (-) | SOUTH (0) | WEST (+)",
                    orientation_placeholder: "0",
                    recommended_angle: "Recommended Angle",
                    waiting_for_sensor: "Point your device...",
                    calculate_gain: "Estimate your production",
                    seasonal_settings: "Seasonal Settings",
                    winter: "Winter",
                    winter_date: "~Dec 21",
                    mid_season: "Mid-Season",
                    mid_season_date: "~Mar 20 & ~Sep 22",
                    summer: "Summer",
                    summer_date: "~Jun 21",
                    donation_message: "If this estimate was helpful, consider supporting this project by buying me a small coffee! ☕",
                    estimation_title: "Production Estimate",
                    peak_power: "Your installation's peak power (kWp)",
                    longitude: "Longitude",
                    current_tilt: "Current Tilt (°)",
                    current_azimuth: "Current Azimuth (Deviation / South)",
                    azimuth_placeholder: "e.g. -10 (10° East)",
                    calculate_gain_long: "Calculate potential gain",
                    prod_current_settings: "Production (your current tilt)",
                    prod_optimal_settings: "Production (optimal tilt for YOUR orientation)",
                    prod_truly_optimal_settings: "IDEAL Production (if South-facing)",
                    daily_gain: "Potential Daily Gain (by adjusting tilt only)",
                    monthly_gain: "Potential Monthly Gain",
                    settings_title: "Settings",
                    clipping_label: "Optimize for clipping",
                    clipping_title: "Clipping Optimization",
                    clipping_problem_title: "The Problem",
                    clipping_problem_desc: "In summer, your solar production might exceed your inverter's maximum power. This excess energy is lost: this is clipping.",
                    clipping_solution_title: "The Solution",
                    clipping_solution_desc: "Checking this box intentionally increases the panel angle. This slightly reduces the production peak at noon (avoiding saturation) and increases morning and evening production, for an overall daily gain.",
                    got_it: "Got it",
                    replay_tutorial: "Replay Guide",
                    main_guide_title: "User Guide",
                    guide_step1_title: "Step 1: Location & Date",
                    guide_step1_desc: "Ensure your latitude is correct (use GPS if needed) and the target date is set as desired.",
                    guide_step2_title: "Step 2: Choose Mode",
                    guide_step2_desc: "<strong class='text-gray-200'>Sensors:</strong> For a real measurement, place your phone on the panel.<br><strong class='text-yellow-400'>Warning: remove any magnetic case to avoid incorrect orientation readings.</strong><br><br><strong class='text-gray-200'>Manual:</strong> For a simulation, enter the tilt and orientation manually.",
                    guide_step3_title: "Step 3: Read the Result",
                    guide_step3_desc: "The recommended angle appears and adjusts in real-time. Seasonal settings are also shown for reference.",
                    guide_step4_title: "Step 4: Estimate Gain",
                    guide_step4_desc: "Click \"Estimate your production\". Your data will be automatically carried over to the next page for an accurate simulation.",
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
                    onboarding_step3_desc: "Now, lay your phone (without a magnetic case) flat on your solar panel.",
                    onboarding_step4_title: "Step 4: Memorize",
                    onboarding_step4_desc: "Once the angle and orientation values are stable, press the large round button!",
                    onboarding_prev: "Previous",
                    onboarding_next: "Next",
                    onboarding_finish: "Finish",
                    compass_south: "Due South",
                    compass_east: "East",
                    compass_west: "West",
                    fill_all_fields_error: "Please fill in all valid fields.",
                    settings_already_optimal: "Your current settings are already optimal.",
                    pvgis_error: "PVGIS communication error.",
                    bug_report_title: "Report a bug or suggestion",
                    donate_title: "Support the project",
                    bug_report_subject: "Suggestion / Bug for Opti Solar",
                    export_pdf: "Export to PDF",
                    exporting_pdf: "Generating...",
                    export_error_no_data: "Please\ run\ a\ production\ estimate\ first\.",
                    pdf_explanation_title: "About the Estimates",
                    pdf_explanation_text: "The 'Optimal Production' compares your current tilt to the best possible tilt for YOUR orientation. The 'Ideal Production' is a reference value showing the potential if your installation were perfectly South-facing with an optimal tilt.",
                    pdf_disclaimer_title: "Important Disclaimer Regarding Accuracy",
                    pdf_disclaimer_text: "The production data and tilt/orientation measurements in this report are estimates. Sensor accuracy (compass, accelerometer) can vary significantly between phone models. Furthermore, the presence of nearby metallic objects, and especially the use of <strong>magnetic cases or mounts</strong>, can cause significant orientation errors. It is strongly recommended to remove any magnetic case before measuring and to corroborate this data with professional measurement tools for any critical installation. The creators of this application cannot be held responsible for discrepancies between the estimates and actual production.",
                    sensors_activating: "Activating sensors...",
                    invalid_measurements: "Invalid measurements.",
                    button_style_label: "\"Memorize\" button style",
                    button_style_default: "Classic HD",
                    button_style_neon: "Neon Reactor",
                    button_style_glass: "Glass Core",
                    button_style_radar: "Radar Lock-On",
                }
}

const dom = {
        mainPage: document.getElementById('main-page'),
        settingsPage: document.getElementById('settings-page'),
        latitudeInput: document.getElementById('latitude-input'),
        dateInput: document.getElementById('date-input'),
        dateDisplay: document.getElementById('date-display'),
        getLocationButton: document.getElementById('get-location'),
        locationError: document.getElementById('location-error'),
        activateSensorsButton: document.getElementById('activate-sensors-button'),
        manualEntryButton: document.getElementById('manual-entry-button'),
        resultDisplay: document.getElementById('result'),
        sensorsReadout: document.getElementById('sensors-readout'),
        currentAngleDisplay: document.getElementById('current-angle'),
        currentCompassDisplay: document.getElementById('current-compass'),
        manualEntryDisplay: document.getElementById('manual-entry-display'),
        manualTiltInput: document.getElementById('manual-tilt-input'),
        manualAzimuthInput: document.getElementById('manual-azimuth-input'),
        memorizeContainer: document.getElementById('memorize-container'),
        memorizeBtnWrapper: document.getElementById('memorize-btn-wrapper'),
        memorizeRingBtn: document.getElementById('memorize-ring-btn'),
        memorizeBtnText: document.getElementById('memorize-btn-text'),
        memorizeCheckmarkIcon: document.getElementById('memorize-checkmark-icon'),
        sensorError: document.getElementById('sensor-error'),
        gotoEstimationButton: document.getElementById('goto-estimation-button'),
        backButton: document.getElementById('back-button'),
        settingsButton: document.getElementById('settings-button'),
        mainHelpButton: document.getElementById('main-help-button'),
        compassRoseContainer: document.getElementById('compass-rose-container'),
        inclinometerLineContainer: document.getElementById('inclinometer-line-container'),
        peakPowerInput: document.getElementById('peak-power'),
        longitudeInput: document.getElementById('longitude-input'),
        currentTiltInput: document.getElementById('current-tilt-input'),
        currentAzimuthInput: document.getElementById('current-azimuth-input'),
        calculateProductionButton: document.getElementById('calculate-production'),
        calculateText: document.getElementById('calculate-text'),
        calculateLoader: document.getElementById('calculate-loader'),
        productionResults: document.getElementById('production-results'),
        currentProductionDisplay: document.getElementById('current-production'),
        optimalProductionDisplay: document.getElementById('optimal-production'),
        potentialGainMonthlyDisplay: document.getElementById('potential-gain-monthly'),
        pvgisError: document.getElementById('pvgis-error'),
        exportContainer: document.getElementById('export-container'),
        exportPdfBtn: document.getElementById('export-pdf-btn'),
        trulyOptimalProductionDisplay: document.getElementById('truly-optimal-production'),
        donationMessage: document.getElementById('donation-message'),
        bugReportButton: document.getElementById('bug-report-button'),
        donateButtonFab: document.getElementById('donate-button-fab'),
        settingsModal: document.getElementById('settings-modal'),
        mainHelpModal: document.getElementById('main-help-modal'),
        clippingCheckbox: document.getElementById('clipping-checkbox'),
        calibrateTiltBtn: document.getElementById('calibrate-tilt-btn'),
        clippingHelpButton: document.getElementById('clipping-help-button'),
        settingsHelpButton: document.getElementById('settings-help-button'),
        langSwitcher: document.getElementById('lang-switcher'),
    };

;;

    const i18n = {
        currentLang: 'fr',
        setLanguage: function(lang) {
            if (!translations[lang]) return;
            i18n.currentLang = lang;
            try { localStorage.setItem('lang', lang); } catch(e) {}
            document.documentElement.setAttribute('lang', lang);
            // Update texts
            document.querySelectorAll('[data-i18n]').forEach(el => {
                const key = el.dataset.i18n;
                if (translations[lang] && translations[lang][key]) {
                    el.innerHTML = translations[lang][key];
                }
            });
            // Update placeholders
            document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
                const key = el.dataset.i18nPlaceholder;
                if (translations[lang] && translations[lang][key]) el.placeholder = translations[lang][key];
            });
            // Toggle active state on lang buttons
            if (dom.langSwitcher) {
                dom.langSwitcher.querySelectorAll('.lang-btn').forEach(btn => {
                    btn.classList.toggle('active', btn.dataset.lang === lang);
                });
            }
            // Refresh any dynamic labels
            if(state.sensorsActive) {
                if (dom.activateSensorsButton) dom.activateSensorsButton.textContent = translations[lang].stop_sensors || 'Stop';
            } else {
                if (dom.activateSensorsButton) dom.activateSensorsButton.textContent = translations[lang].activate_sensors || 'Start';
            }
        
        },
        clamp: (x, min, max) => Math.min(Math.max(x, min), max),
        normalizeAngle: (a) => (a % 360 + 360) % 360,
        formatNumber: (n) => Number(n).toLocaleString(i18n.currentLang==='fr'?'fr-FR':'en-US', { maximumFractionDigits: 2 }),
    };

    const ui = {
        updateDateDisplay: () => {
            const date = new Date(dom.dateInput.value);
            if (!isNaN(date.getTime())) {
                dom.dateDisplay.textContent = date.toLocaleDateString(i18n.currentLang==='fr'?'fr-FR':'en-US', { day: 'numeric', month: 'long' });
            }
        },
        updateLocationFields: (pos) => {
            if(!pos) return;
            if (typeof pos === 'number') { if (dom.latitudeInput) dom.latitudeInput.value = pos.toFixed(5); return; }
            const { latitude, longitude } = pos.coords || {};
            if (typeof latitude === 'number') dom.latitudeInput.value = latitude.toFixed(5);
            if (typeof longitude === 'number' && dom.longitudeInput) dom.longitudeInput.value = longitude.toFixed(5);
            dom.locationError.textContent = '';
            calculations.calculateAndDisplayAll();
        },
        setEntryMode: (mode) => {
            state.entryMode = mode;
            dom.sensorsReadout.classList.toggle('hidden', mode !== 'sensors');
            dom.memorizeContainer.classList.toggle('hidden', mode !== 'sensors');
            dom.memorizeContainer.classList.toggle('flex', mode === 'sensors');
            dom.manualEntryDisplay.classList.toggle('hidden', mode !== 'manual');

            dom.activateSensorsButton.classList.toggle('btn-danger', mode === 'sensors');
            dom.manualEntryButton.classList.toggle('btn-danger', mode === 'manual');
            dom.manualEntryButton.classList.toggle('btn-secondary', mode !== 'manual');

            if (mode === 'sensors') {
                if (!state.sensorsActive) sensors.start();
            } else {
                if (state.sensorsActive) sensors.stop();
            }
            calculations.calculateAndDisplayAll();
        },
        showPage: (page) => {
            if(dom.mainPage) dom.mainPage.classList.toggle('hidden', page !== 'main');
            if(dom.settingsPage) dom.settingsPage.classList.toggle('hidden', page !== 'settings');
            if(dom.mainHelpButton) dom.mainHelpButton.classList.toggle('hidden', page !== 'main');
            if(dom.settingsHelpButton) dom.settingsHelpButton.classList.toggle('hidden', page !== 'settings');
        
            toggleHelpIcons();
        }
    };

    
    // Ensure only one help icon is visible (main vs settings)
    function toggleHelpIcons(){
        try{
            const modalOpen = dom.settingsModal && !dom.settingsModal.classList.contains('hidden');
            const settingsPageVisible = dom.settingsPage && !dom.settingsPage.classList.contains('hidden');
            const useSettingsHelp = !!(modalOpen || settingsPageVisible);
            if(dom.mainHelpButton) dom.mainHelpButton.classList.toggle('hidden', useSettingsHelp);
            if(dom.settingsHelpButton) dom.settingsHelpButton.classList.toggle('hidden', !useSettingsHelp);
        }catch(e){}
    }
const calculations = {
        calculateAndDisplayAll: () => {
            const lat = utils.safeParseFloat(dom.latitudeInput.value);
            const dateValue = dom.dateInput.value;
            if (isNaN(lat) || !dateValue) {
                return;
            }

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
            const clipping = dom.clippingCheckbox.checked;

            const dev = Math.abs(panelAzimuthDeviation);
            const penalty = Math.min(6, dev / 12);

            const solarNoonAltitude = 90 - Math.abs(lat - declination);
            let optimalTilt = 90 - solarNoonAltitude;

            const isSummer = (Math.sign(lat) > 0 && declination > 10) || (Math.sign(lat) < 0 && declination < -10);
            if (clipping && isSummer) {
                optimalTilt += CONFIG.clippingAdjustment;
            }

            optimalTilt -= penalty;
            optimalTilt = utils.clamp(optimalTilt, 0, 90);

            dom.resultDisplay.textContent = `${Math.round(optimalTilt)}°`;
        }
    };

    const sensors = {
        lastUpdate: 0,
        checkStability: (newReading) => {
            state.lastReadings.push(newReading);
            if (state.lastReadings.length > state.stabilityBuffer) {
                state.lastReadings.shift();
            }
            if (state.lastReadings.length < state.stabilityBuffer) {
                return false;
            }
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
            
            if (Math.abs(deviation) < 5) return i18n.currentLang === 'fr' ? "Plein Sud" : "Due South";
            const direction = deviation < 0 ? (i18n.currentLang === 'fr' ? "Est" : "East") : (i18n.currentLang === 'fr' ? "Ouest" : "West");
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
            state.sensorsActive = true;
            dom.sensorError.textContent = "Activation...";
            dom.activateSensorsButton.textContent = "Arrêter";
            window.addEventListener(CONFIG.sensorEventName, sensors.handleOrientation, true);
            dom.sensorError.textContent = "";
        },
        stop: () => {
            if (!state.sensorsActive) return;
            state.sensorsActive = false;
            window.removeEventListener(CONFIG.sensorEventName, sensors.handleOrientation, true);
            dom.activateSensorsButton.textContent = "Utiliser Capteurs";
            dom.activateSensorsButton.classList.remove('btn-danger');
            sensors.setStable(false);
            state.lastReadings = [];
            state.panelAzimuthLive = null;
        }
    };

    const handlers = {
        memorizeSensorValues: () => {
            const tilt = parseInt(dom.currentAngleDisplay.textContent, 10);
            const az = state.panelAzimuthLive;
            if (!Number.isFinite(tilt) || !Number.isFinite(az)) return;

            state.memorizedTilt = tilt;
            state.memorizedAzimuthValue = az;

            dom.memorizeBtnText.classList.add('hidden');
            dom.memorizeCheckmarkIcon.classList.remove('hidden');
            setTimeout(() => {
                dom.memorizeBtnText.textContent = "Mémorisé !";
                dom.memorizeBtnText.classList.remove('hidden');
                dom.memorizeCheckmarkIcon.classList.add('hidden');
                setTimeout(() => {
                    dom.memorizeBtnText.textContent = "Mémoriser";
                }, 1500);
            }, 300);
        },
        calibrateTilt: () => {
            const once = (e) => {
                if (e.beta !== null) {
                    state.tiltOffset = e.beta;
                    localStorage.setItem('tiltOffset', state.tiltOffset.toString());
                    const originalText = dom.calibrateTiltBtn.textContent;
                    dom.calibrateTiltBtn.textContent = "Calibration effectuée !";
                    setTimeout(() => {
                        dom.calibrateTiltBtn.textContent = originalText;
                    }, 2000);
                }
                window.removeEventListener(CONFIG.sensorEventName, once, true);
            };
            window.addEventListener(CONFIG.sensorEventName, once, true);
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
            dom.longitudeInput.value = CONFIG.defaultLongitude;
            ui.showPage('settings');
        },
        openBugReport: (event) => {
            event.preventDefault();
            window.location.href = `mailto:${CONFIG.reportEmail}?subject=Suggestion%20/%20Bug%20pour%20Opti%20Solar`;
        }
    };

    const geolocation = { get: () => {
            dom.locationError.textContent = (translations[i18n.currentLang]?.location_getting || 'Obtention de la position...');
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    p => ui.updateLocationFields(p),
                    () => { dom.locationError.textContent = (translations[i18n.currentLang]?.location_unavailable || 'Position indisponible.'); }
                );
            } else {
                dom.locationError.textContent = (translations[i18n.currentLang]?.geoloc_not_supported || 'Géolocalisation non supportée.');
            }
        }};

    const api = {
        fetchPVGIS: async (lat, lon, peakpower, angle, aspect) => {
            const url = `https://re.jrc.ec.europa.eu/api/PVcalc?lat=${lat}&lon=${lon}&peakpower=${peakpower}&loss=14&angle=${angle}&aspect=${aspect}&outputformat=json`;
            const cacheKey = `pvgis:${lat}:${lon}:${peakpower}:${angle}:${aspect}`;
            try {
                const cached = sessionStorage.getItem(cacheKey);
                if (cached) return JSON.parse(cached);
            } catch (e) {}
            const fetchWithTimeout = (resource, options = {}, timeout = 8000) => {
                return new Promise((resolve, reject) => {
                    const controller = new AbortController();
                    const id = setTimeout(() => {
                        controller.abort();
                        reject(new Error('Fetch timeout'));
                    }, timeout);
                    fetch(resource, { ...options, signal: controller.signal })
                        .then((response) => { clearTimeout(id); resolve(response); })
                        .catch((error) => { clearTimeout(id); reject(error); });
                });
            };
            const strategies = [
                async () => {
                    const res = await fetchWithTimeout(url, {}, 7000);
                    if (!res.ok) throw new Error('Direct call failed');
                    return await res.json();
                },
                async () => {
                    const proxy = `https://api.allorigins.win/json?url=${encodeURIComponent(url)}`;
                    const res = await fetchWithTimeout(proxy, {}, 9000);
                    if (!res.ok) throw new Error('allorigins failed');
                    const data = await res.json();
                    return JSON.parse(data.contents);
                },
                async () => {
                    const proxy = `https://corsproxy.io/?${encodeURIComponent(url)}`;
                    const res = await fetchWithTimeout(proxy, {}, 9000);
                    if (!res.ok) throw new Error('corsproxy failed');
                    return await res.json();
                }
            ];
            let lastErr = null;
            for (const s of strategies) {
                try {
                    const data = await s();
                    try { sessionStorage.setItem(cacheKey, JSON.stringify(data)); } catch (e) {}
                    return data;
                } catch (e) { lastErr = e; }
            }
            throw lastErr || new Error('All PVGIS strategies failed');
        },
        getProductionEstimate: async () => {
            if (!dom.calculateText || !dom.calculateLoader) return;
            dom.exportContainer?.classList.add('hidden');
            dom.pvgisError.textContent = '';
            dom.productionResults.classList.add('hidden');
            dom.donationMessage?.classList.add('hidden');
            dom.calculateLoader.classList.remove('hidden');
            dom.calculateText.classList.add('hidden');

            const lat = utils.safeParseFloat(dom.latitudeInput.value);
            const lon = utils.safeParseFloat(dom.longitudeInput.value);
            const peak = utils.safeParseFloat(dom.peakPowerInput.value);
            const curTilt = utils.safeParseFloat(dom.currentTiltInput.value);
            const curAz   = utils.safeParseFloat(dom.currentAzimuthInput.value);

            if ([lat, lon, peak, curTilt, curAz].some(v => isNaN(v))) {
                dom.pvgisError.textContent = translations[i18n.currentLang].fill_all_fields_error;
                dom.calculateText.classList.remove('hidden');
                dom.calculateLoader.classList.add('hidden');
                return;
            }

            try {
                // Compute the recommended (with penalties) exactly as in main card
                const selectedDate = new Date(dom.dateInput.value);
                const n = Math.floor((selectedDate - new Date(selectedDate.getFullYear(), 0, 0)) / 86400000);
                const decl = -23.44 * Math.cos((Math.PI/180) * ((360/365)*(n+10)));
                const devAbs = Math.abs(curAz);
                const penalty = Math.min(6, devAbs / 12);
                const isLocalSummer = (Math.sign(lat) === Math.sign(decl)) && (Math.abs(decl) > 10);
                let optimalTilt = 90 - Math.abs(lat - decl);
                if (dom.clippingCheckbox.checked && isLocalSummer) optimalTilt += 10;
                optimalTilt -= penalty;
                optimalTilt = Math.max(0, Math.min(90, optimalTilt));
                const finalOptimalTilt = Math.round(optimalTilt);

                const [cur, opt, truly] = await Promise.all([
                    api.fetchPVGIS(lat, lon, peak, Math.round(curTilt), Math.round(curAz)),
                    api.fetchPVGIS(lat, lon, peak, finalOptimalTilt, Math.round(curAz)),
                    api.fetchPVGIS(lat, lon, peak, finalOptimalTilt, 0)
                ]);

                const curMonthly = Number(cur.outputs?.totals?.fixed?.E_m) || 0;
                const optMonthly = Number(opt.outputs?.totals?.fixed?.E_m) || 0;
                const trulyMonthly = Number(truly.outputs?.totals?.fixed?.E_m) || 0;

                let dispOptMonthly = optMonthly;
                if (optMonthly < curMonthly) {
                    dispOptMonthly = curMonthly;
                    dom.pvgisError.textContent = translations[i18n.currentLang].settings_already_optimal;
                } else {
                    dom.pvgisError.textContent = '';
                }

                dom.currentProductionDisplay.textContent = `${utils.formatNumber(curMonthly)} kWh`;
                dom.optimalProductionDisplay.textContent = `${utils.formatNumber(dispOptMonthly)} kWh`;
                if (dom.trulyOptimalProductionDisplay) {
                    dom.trulyOptimalProductionDisplay.textContent = `${utils.formatNumber(trulyMonthly)} kWh`;
                }
                const gainMonthly = dispOptMonthly - curMonthly;
                dom.potentialGainMonthlyDisplay.textContent = `~ ${utils.formatNumber(gainMonthly)} kWh`;

                dom.productionResults.classList.remove('hidden');
                dom.exportContainer?.classList.remove('hidden');
                dom.donationMessage?.classList.remove('hidden');
            } catch (e) {
                dom.pvgisError.textContent = "Erreur de communication PVGIS.";
            } finally {
                dom.calculateText.classList.remove('hidden');
                dom.calculateLoader.classList.add('hidden');
            }
        },
        exportPdf: () => {
            if (typeof html2pdf === 'undefined') return;
            // PDF Export Logic would go here
        }
    };
    
    function init() {
        ui.showPage('main'); toggleHelpIcons(); const _savedLang = (localStorage.getItem('lang') || document.documentElement.getAttribute('lang') || 'fr');
        i18n.setLanguage(_savedLang);
        dom.latitudeInput.value = CONFIG.defaultLatitude.toFixed(5);
        state.tiltOffset = Number(localStorage.getItem('tiltOffset')) || 0;
        
        const today = new Date();
        dom.dateInput.value = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
        
        ui.updateDateDisplay();
        calculations.calculateAndDisplayAll();

        // Bind all events
        if (dom.langSwitcher) {
            dom.langSwitcher.addEventListener('click', (e) => {
                const b = e.target.closest('.lang-btn'); if(!b) return;
                i18n.setLanguage(b.dataset.lang);
            });
        }
        const recalculate = () => { calculations.calculateAndDisplayAll(); };
if (dom.dateInput) dom.dateInput.addEventListener('change', () => { ui.updateDateDisplay(); recalculate(); });
if (dom.latitudeInput) dom.latitudeInput.addEventListener('input', recalculate);
        if(dom.clippingCheckbox) dom.clippingCheckbox.addEventListener('change', recalculate);
if (dom.manualTiltInput) dom.manualTiltInput.addEventListener('input', recalculate);
if (dom.manualAzimuthInput) dom.manualAzimuthInput.addEventListener('input', recalculate);
if (dom.getLocationButton) dom.getLocationButton.addEventListener('click', geolocation.get);
if (dom.activateSensorsButton) dom.activateSensorsButton.addEventListener('click', () => ui.setEntryMode('sensors'));
if (dom.manualEntryButton) dom.manualEntryButton.addEventListener('click', () => ui.setEntryMode('manual'));
if (dom.memorizeRingBtn) dom.memorizeRingBtn.addEventListener('click', handlers.memorizeSensorValues);
if (dom.gotoEstimationButton) dom.gotoEstimationButton.addEventListener('click', handlers.prepareEstimationPage);
        if (dom.calculateProductionButton) dom.calculateProductionButton.addEventListener('click', api.getProductionEstimate);
        if (dom.exportPdfBtn) dom.exportPdfBtn.addEventListener('click', api.exportPdf);
if (dom.backButton) dom.backButton.addEventListener('click', () => ui.showPage('main'));
if (dom.bugReportButton) dom.bugReportButton.addEventListener('click', handlers.openBugReport);

        if(dom.settingsButton) dom.settingsButton.addEventListener('click', () => { dom.settingsModal.classList.remove('hidden'); toggleHelpIcons(); });
        if(dom.mainHelpButton) dom.mainHelpButton.addEventListener('click', () => dom.mainHelpModal.classList.remove('hidden'));
        if(dom.settingsHelpButton && dom.settingsHelpModal){ dom.settingsHelpButton.addEventListener('click', ()=> dom.settingsHelpModal.classList.remove('hidden')); }
        if(dom.clippingHelpButton && dom.clippingHelpModal){ dom.clippingHelpButton.addEventListener('click', ()=> dom.clippingHelpModal.classList.remove('hidden')); }

        document.querySelectorAll('.close-modal-btn').forEach(btn => 
            btn.addEventListener('click', (e) => { e.target.closest('.fixed').classList.add('hidden'); toggleHelpIcons(); })
        );
        if(dom.calibrateTiltBtn) dom.calibrateTiltBtn.addEventListener('click', handlers.calibrateTilt);
    }
    
    window.addEventListener('load', init);
})();

/* v4.1.0 language init */
(function(){
    try {
        const saved = (localStorage.getItem('lang') || document.documentElement.getAttribute('lang') || 'fr');
        if (typeof i18n !== 'undefined' && i18n.setLanguage) i18n.setLanguage(saved);
        const sw = document.getElementById('lang-switcher');
        if (sw) {
            sw.addEventListener('click', function(e){
                const b = e.target.closest('.lang-btn'); if(!b) return;
                if (typeof i18n !== 'undefined' && i18n.setLanguage) i18n.setLanguage(b.dataset.lang);
            });
        }
    } catch(e){}
})();
