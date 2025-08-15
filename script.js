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
    };

    const i18n = {
        currentLang: 'fr',
        setLanguage: function(lang) {
            if (!translations[lang]) return;
            this.currentLang = lang;
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
            if(state.sensorsActive) {
               dom.activateSensorsButton.textContent = translations[lang].stop_sensors;
            } else {
               dom.activateSensorsButton.textContent = translations[lang].activate_sensors;
            }
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
    };

    const utils = {
        toRadians: (deg) => deg * Math.PI / 180,
        getDayOfYear: (date) => Math.floor((date - new Date(date.getFullYear(), 0, 0)) / 86400000),
        getDeclination: (dayOfYear) => -23.44 * Math.cos(utils.toRadians((360 / 365) * (dayOfYear + 10))),
        safeParseFloat: (v, fallback = NaN) => {
            if (v === null || v === undefined || v === '') return fallback;
            const s = String(v).replace(',', '.').trim();
            const n = parseFloat(s);
            return Number.isFinite(n) ? n : fallback;
        },
        clamp: (x, min, max) => Math.min(Math.max(x, min), max),
        normalizeAngle: (a) => (a % 360 + 360) % 360,
        formatNumber: (n) => Number(n).toLocaleString('fr-FR', { maximumFractionDigits: 2 }),
    };

    const ui = {
        updateDateDisplay: () => {
            const date = new Date(dom.dateInput.value);
            if (!isNaN(date.getTime())) {
                dom.dateDisplay.textContent = date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' });
            }
        },
        updateLocationFields: (lat) => {
            dom.latitudeInput.value = lat.toFixed(5);
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
            dom.mainPage.classList.toggle('hidden', page !== 'main');
            dom.settingsPage.classList.toggle('hidden', page !== 'settings');
            dom.mainHelpButton.classList.toggle('hidden', page !== 'main');
            dom.settingsHelpButton.classList.toggle('hidden', page !== 'settings');
        }
    };

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

    const geolocation = {
        get: () => {
            dom.locationError.textContent = 'Obtention de la position...';
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    p => ui.updateLocationFields(p.coords.latitude),
                    () => { dom.locationError.textContent = 'Impossible d’obtenir la position.'; }
                );
            } else {
                dom.locationError.textContent = 'Géolocalisation non supportée.';
            }
        }
    };

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
        i18n.setLanguage('fr');
        dom.latitudeInput.value = CONFIG.defaultLatitude.toFixed(5);
        state.tiltOffset = Number(localStorage.getItem('tiltOffset')) || 0;
        
        const today = new Date();
        dom.dateInput.value = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
        
        ui.updateDateDisplay();
        calculations.calculateAndDisplayAll();

        // Bind all events
        const recalculate = () => { calculations.calculateAndDisplayAll(); };
        dom.dateInput.addEventListener('change', () => { ui.updateDateDisplay(); recalculate(); });
        dom.latitudeInput.addEventListener('input', recalculate);
        if(dom.clippingCheckbox) dom.clippingCheckbox.addEventListener('change', recalculate);
        dom.manualTiltInput.addEventListener('input', recalculate);
        dom.manualAzimuthInput.addEventListener('input', recalculate);

        dom.getLocationButton.addEventListener('click', geolocation.get);
        dom.activateSensorsButton.addEventListener('click', () => ui.setEntryMode('sensors'));
        dom.manualEntryButton.addEventListener('click', () => ui.setEntryMode('manual'));
        dom.memorizeRingBtn.addEventListener('click', handlers.memorizeSensorValues);
        dom.gotoEstimationButton.addEventListener('click', handlers.prepareEstimationPage);
        if (dom.calculateProductionButton) dom.calculateProductionButton.addEventListener('click', api.getProductionEstimate);
        if (dom.exportPdfBtn) dom.exportPdfBtn.addEventListener('click', api.exportPdf);
        dom.backButton.addEventListener('click', () => ui.showPage('main'));
        dom.bugReportButton.addEventListener('click', handlers.openBugReport);

        if(dom.settingsButton) dom.settingsButton.addEventListener('click', () => dom.settingsModal.classList.remove('hidden'));
        if(dom.mainHelpButton) dom.mainHelpButton.addEventListener('click', () => dom.mainHelpModal.classList.remove('hidden'));
        document.querySelectorAll('.close-modal-btn').forEach(btn => 
            btn.addEventListener('click', (e) => e.target.closest('.fixed').classList.add('hidden'))
        );
        if(dom.calibrateTiltBtn) dom.calibrateTiltBtn.addEventListener('click', handlers.calibrateTilt);
    }
    
    window.addEventListener('load', init);
})();
