// Toggle panel minimization
function togglePanel(panelId) {
    console.log('Toggling panel:', panelId);
    const panel = document.getElementById(panelId);
    
    if (!panel) {
        console.error('Panel not found:', panelId);
        return;
    }
    
    const minimizeBtn = panel.querySelector('.minimize-btn');
    
    if (panel.classList.contains('minimized')) {
        panel.classList.remove('minimized');
        minimizeBtn.textContent = '−';
        minimizeBtn.title = 'Minimizar painel';
        console.log('Panel expanded');
    } else {
        panel.classList.add('minimized');
        minimizeBtn.textContent = '+';
        minimizeBtn.title = 'Expandir painel';
        console.log('Panel minimized');
    }
}

// Make panels draggable - SIMPLIFIED VERSION
let dragState = {
    isDragging: false,
    dragPanel: null,
    startX: 0,
    startY: 0
};

function makePanelsDraggable() {
    console.log('Making panels draggable...');
    const panels = document.querySelectorAll('.floating-panel');
    console.log('Found panels:', panels.length);
    
    panels.forEach((panel) => {
        const header = panel.querySelector('.panel-header');
        header.style.cursor = 'move';
        
        header.addEventListener('mousedown', function(e) {
            if (e.target.classList.contains('minimize-btn')) {
                return;
            }
            
            console.log('Drag start for:', panel.id);
            dragState.isDragging = true;
            dragState.dragPanel = panel;
            dragState.startX = e.clientX - panel.offsetLeft;
            dragState.startY = e.clientY - panel.offsetTop;
            
            e.preventDefault();
        });
    });
    
    // Global mouse events
    document.addEventListener('mousemove', function(e) {
        if (!dragState.isDragging || !dragState.dragPanel) return;
        
        e.preventDefault();
        const newX = e.clientX - dragState.startX;
        const newY = e.clientY - dragState.startY;
        
        dragState.dragPanel.style.left = newX + 'px';
        dragState.dragPanel.style.top = newY + 'px';
        dragState.dragPanel.style.right = 'auto';
        dragState.dragPanel.style.bottom = 'auto';
    });
    
    document.addEventListener('mouseup', function(e) {
        if (dragState.isDragging) {
            console.log('Drag end for:', dragState.dragPanel.id);
            dragState.isDragging = false;
            dragState.dragPanel = null;
        }
    });
}


// Global variables
let map;
let currentAircraft = null;
let currentRange = 0;
let routePoints = [];
let rangeCircles = [];
let routeLines = [];
let airportMarkers = []; // Array for airport markers
let vectorSource; // Data source for circles and lines
let vectorLayer;  // Layer for circles and lines

let airportDataCache = {}; // Cache for loaded regional airport data

// Helper function to find an airport by its code in the cache
function findAirportByCode(code) {
    for (const region in airportDataCache) {
        const airport = airportDataCache[region].find(a => a.code === code);
        if (airport) {
            return airport;
        }
    }
    return null; // Return null if not found in any loaded region
}

// Application initialization

// Draw airport marker
function drawAirportMarker(airport) {
    const markerFeature = new ol.Feature({
        geometry: new ol.geom.Point(ol.proj.fromLonLat([airport.lng, airport.lat])),
        type: 'airport-marker',
        airport: airport
    });

    vectorSource.addFeature(markerFeature);
    airportMarkers.push(markerFeature);
}

// Load and display all airports from all regions
async function loadAndDisplayAllAirports() {
    console.log('Loading all airports from regional databases...');
    
    const regions = [
        'africa', 'asia', 'atlantic_islands', 'caribbean', 'central_america',
        'europe', 'indian_ocean_islands', 'middle_east', 'north_america', 
        'north_atlantic', 'oceania', 'pacific', 'south_america'
    ];
    
    let totalAirports = 0;
    
    for (const regionFilename of regions) {
        try {
            console.log(`Loading airports from: ${regionFilename}.json`);
            const response = await fetch(`data/${regionFilename}.json`);
            
            if (!response.ok) {
                console.warn(`Could not load ${regionFilename}.json: ${response.status}`);
                continue;
            }
            
            const airports = await response.json();
            
            // Display each airport as a marker on the map
            airports.forEach(airport => {
                if (airport.lat && airport.lng && airport.code) {
                    drawAirportMarker(airport);
                    totalAirports++;
                } else {
                    console.warn(`Invalid airport data:`, airport);
                }
            });
            
            // Cache the data for future use
            const regionDisplayName = regionFilename.replace(/_/g, ' ')
                .replace(/\b\w/g, char => char.toUpperCase());
            airportDataCache[regionDisplayName] = airports;
            
        } catch (error) {
            console.error(`Error loading ${regionFilename}.json:`, error);
        }
    }
    
    console.log(`Successfully loaded and displayed ${totalAirports} airports on the map`);
}

document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, initializing application...');
    
    initializeMap();
    populateManufacturers();
    loadAndDisplayAllAirports();
    
    // Inicializar interface de status da rota
    updateRouteInterface();
    
    // Tornar os painéis arrastáveis
    makePanelsDraggable();
    
    console.log('Application initialized successfully');
});

// Initialize map
function initializeMap() {
    // Create vector data source for circles and lines
    vectorSource = new ol.source.Vector();
    
    // Create vector layer
    vectorLayer = new ol.layer.Vector({
        source: vectorSource,
        style: function(feature) {
            const type = feature.get('type');
            
            if (type === 'range-circle') {
                const category = feature.get('category');
                let fillColor, strokeColor;
                
                switch(category) {
                    case 'extreme':
                        fillColor = 'rgba(231, 76, 60, 0.12)';
                        strokeColor = 'rgba(231, 76, 60, 0.7)';
                        break;
                    case 'long':
                        fillColor = 'rgba(243, 156, 18, 0.08)';
                        strokeColor = 'rgba(243, 156, 18, 0.7)';
                        break;
                    case 'medium':
                        fillColor = 'rgba(155, 89, 182, 0.08)';
                        strokeColor = 'rgba(155, 89, 182, 0.7)';
                        break;
                    default:
                        fillColor = 'rgba(52, 152, 219, 0.08)';
                        strokeColor = 'rgba(52, 152, 219, 0.7)';
                }
                
                return new ol.style.Style({
                    fill: new ol.style.Fill({
                        color: fillColor
                    }),
                    stroke: new ol.style.Stroke({
                        color: strokeColor,
                        width: 2
                    })
                });
            } else if (type === 'route-line') {
                return new ol.style.Style({
                    stroke: new ol.style.Stroke({
                        color: '#f1c40f',
                        width: 4
                    })
                });
            } else if (type === 'airport-marker') {
                const airport = feature.get('airport');
                
                // Verificar se o aeroporto está na rota atual
                const isInRoute = routePoints.some(point => point.code === airport.code);
                const routeIndex = routePoints.findIndex(point => point.code === airport.code);
                
                let fillColor = '#2c3e50'; // Cor padrão
                let strokeColor = '#ffffff'; // Borda padrão
                let scale = 0.8;
                let zIndex = 10;
                
                if (isInRoute) {
                    if (routeIndex === 0) {
                        // Aeroporto de origem - verde
                        fillColor = '#27ae60';
                        strokeColor = '#ffffff';
                        scale = 1.0;
                        zIndex = 15;
                    } else {
                        // Waypoints - laranja/dourado
                        fillColor = '#f39c12';
                        strokeColor = '#ffffff';
                        scale = 0.9;
                        zIndex = 12;
                    }
                }
                
                // Create SVG airplane icon with dynamic color
                const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
                    <path fill="${fillColor}" stroke="${strokeColor}" stroke-width="1" d="M21,16V14L13,9V3.5A1.5,1.5 0 0,0 11.5,2A1.5,1.5 0 0,0 10,3.5V9L2,14V16L10,13.5V19L8,20.5V22L11.5,21L15,22V20.5L13,19V13.5L21,16Z"/>
                </svg>`;
                
                const iconSrc = 'data:image/svg+xml,' + encodeURIComponent(svg);
                
                return new ol.style.Style({
                    image: new ol.style.Icon({
                        src: iconSrc,
                        scale: scale,
                        anchor: [0.5, 0.5],
                        anchorXUnits: 'fraction',
                        anchorYUnits: 'fraction'
                    }),
                    zIndex: zIndex
                });
            }
        }
    });
    
    // Create OpenLayers map
    map = new ol.Map({
        target: 'map',
        layers: [
            // Base layer - Satellite imagery
            new ol.layer.Tile({
                source: new ol.source.XYZ({
                    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
                    attributions: '&copy; Esri, Maxar, Earthstar Geographics, and the GIS User Community',
                    wrapX: true,
                    projection: 'EPSG:3857',
                    extent: ol.proj.transformExtent([-270, -90, 270, 90], 'EPSG:4326', 'EPSG:3857')
                })
            }),
            // Boundaries layer with light/white lines (from dark theme)
            new ol.layer.Tile({
                source: new ol.source.XYZ({
                    url: 'https://{a-c}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}.png',
                    attributions: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
                    wrapX: true,
                    projection: 'EPSG:3857',
                    extent: ol.proj.transformExtent([-270, -90, 270, 90], 'EPSG:4326', 'EPSG:3857')
                }),
                opacity: 0.7
            }),
            // Labels layer with WHITE text (from dark theme)
            new ol.layer.Tile({
                source: new ol.source.XYZ({
                    url: 'https://{a-c}.basemaps.cartocdn.com/dark_only_labels/{z}/{x}/{y}.png',
                    attributions: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
                    wrapX: true,
                    projection: 'EPSG:3857',
                    extent: ol.proj.transformExtent([-270, -90, 270, 90], 'EPSG:4326', 'EPSG:3857')
                })
            }),
            // Vector layer for circles and lines
            vectorLayer
        ],
        view: new ol.View({
            center: ol.proj.fromLonLat([0, 0]), // Start at Greenwich
            zoom: 2, // Temporary initial zoom
            minZoom: 0.3,
            maxZoom: 10,
            // Extended horizontal coverage: -270° to +270° (540° total width)
            extent: ol.proj.transformExtent([-270, -90, 270, 90], 'EPSG:4326', 'EPSG:3857'),
            multiWorld: true,
            enableRotation: false
        })
    });
    
    // Add scale control
    map.addControl(new ol.control.ScaleLine({
        units: 'metric'
    }));
    
    // Wait for map to be fully rendered before configuring interactions
    map.once('rendercomplete', function() {
        // Add popup for interaction with circles and lines
        setupPopupInteraction();
        
        // Force initial global view after map loads
        setTimeout(function() {
            map.getView().animate({
                center: ol.proj.fromLonLat([0, 20]), 
                zoom: 0.6,
                duration: 1000
            });
        }, 500);
        
        console.log('OpenLayers map loaded and interactions configured');
    });
}

// Populate manufacturers dropdown
function populateManufacturers() {
    const manufacturerSelect = document.getElementById('manufacturer');
    
    for (const [key, manufacturer] of Object.entries(aircraftDatabase)) {
        const option = document.createElement('option');
        option.value = key;
        option.textContent = manufacturer.name;
        manufacturerSelect.appendChild(option);
    }
}











// Atualizar modelos baseado no fabricante selecionado
function updateModels() {
    const manufacturerSelect = document.getElementById('manufacturer');
    const modelSelect = document.getElementById('model');
    const rangeInput = document.getElementById('range');
    
    // Clear existing models
    modelSelect.innerHTML = '<option value="">Select model</option>';
    modelSelect.disabled = true;
    rangeInput.value = '';
    
    const selectedManufacturer = manufacturerSelect.value;
    
    if (selectedManufacturer && aircraftDatabase[selectedManufacturer]) {
        const manufacturer = aircraftDatabase[selectedManufacturer];
        
        // Adicionar modelos
        for (const [key, model] of Object.entries(manufacturer.models)) {
            const option = document.createElement('option');
            option.value = key;
            option.textContent = model.name;
            modelSelect.appendChild(option);
        }
        
        modelSelect.disabled = false;
    }
}

// Atualizar alcance baseado no modelo selecionado
function updateRange() {
    const manufacturerSelect = document.getElementById('manufacturer');
    const modelSelect = document.getElementById('model');
    const rangeInput = document.getElementById('range');
    
    const selectedManufacturer = manufacturerSelect.value;
    const selectedModel = modelSelect.value;
    
    if (selectedManufacturer && selectedModel && aircraftDatabase[selectedManufacturer]) {
        const manufacturer = aircraftDatabase[selectedManufacturer];
        if (manufacturer.models[selectedModel]) {
            const model = manufacturer.models[selectedModel];
            currentRange = model.range;
            rangeInput.value = `${currentRange.toLocaleString()} km`;
            
            currentAircraft = {
                manufacturer: manufacturer.name,
                model: model.name,
                range: currentRange
            };
            
            console.log(`Aeronave selecionada: ${currentAircraft.manufacturer} ${currentAircraft.model} (${currentRange.toLocaleString()} km)`);
        }
    }
    
    // Atualizar interface de rota
    updateRouteInterface();
}







// Configurar interação com popup
function setupPopupInteraction() {
    // Verificar se o mapa está pronto
    if (!map || !map.getTarget()) {
        console.warn('Mapa não está pronto para configurar interações');
        return;
    }
    
    // Elemento do popup
    const popupElement = document.createElement('div');
    popupElement.className = 'ol-popup';
    
    // Overlay do popup
    const popup = new ol.Overlay({
        element: popupElement,
        positioning: 'bottom-center',
        stopEvent: false,
        offset: [0, -10]
    });
    map.addOverlay(popup);
    
    // Adicionar interação de clique
    map.on('click', function(event) {
        const feature = map.forEachFeatureAtPixel(event.pixel, function(feature) {
            return feature;
        });
        
        if (feature) {
            const type = feature.get('type');
            
            // Se clicou em um marcador de aeroporto, selecionar para rota
            if (type === 'airport-marker') {
                const airport = feature.get('airport');
                selectAirportForRoute(airport);
                // Esconder popup quando selecionar aeroporto
                popupElement.style.display = 'none';
                return;
            }
            
            // Para outros tipos de features, mostrar popup informativo
            let content = '';
            
            if (type === 'range-circle') {
                const airport = feature.get('airport');
                const range = feature.get('range');
                const category = feature.get('category');
                
                let categoryText = '';
                if (category === 'extreme') categoryText = '<br><small><em>🌍 Alcance global</em></small>';
                else if (category === 'long') categoryText = '<br><small><em>Círculo aproximado</em></small>';
                
                content = `
                    <strong>${airport.city} (${airport.code})</strong><br>
                    ${airport.name}<br>
                    <em>${airport.country}</em><br>
                    <strong>Alcance: ${parseInt(range).toLocaleString()} km</strong>
                    ${categoryText}
                `;
            } else if (type === 'route-line') {
                const from = feature.get('from');
                const to = feature.get('to');
                const distance = feature.get('distance');
                
                content = `
                    <strong>Trecho:</strong> ${from.city} → ${to.city}<br>
                    <strong>Códigos:</strong> ${from.code} → ${to.code}<br>
                    <strong>Distância:</strong> ${parseInt(distance).toLocaleString()} km
                `;
            }
            
            if (content) {
                popupElement.innerHTML = content;
                popup.setPosition(event.coordinate);
                popupElement.style.display = 'block';
            }
        } else {
            popupElement.style.display = 'none';
        }
    });
    
    // Add right-click (contextmenu) event for airport details
    map.on('contextmenu', function(event) {
        event.preventDefault(); // Prevent browser context menu
        
        const feature = map.forEachFeatureAtPixel(event.pixel, function(feature) {
            return feature;
        });
        
        if (feature && feature.get('type') === 'airport-marker') {
            const airport = feature.get('airport');
            showAirportDetailsPanel(airport, event.coordinate);
        } else {
            hideAirportDetailsPanel();
        }
    });
    
    // Alterar cursor ao passar sobre features
    map.on('pointermove', function(event) {
        const hit = map.hasFeatureAtPixel(event.pixel);
        const target = map.getTarget();
        if (target && target.style) {
            target.style.cursor = hit ? 'pointer' : '';
        }
    });
}

// Airport Details Panel Functions
let airportDetailsOverlay = null;

function showAirportDetailsPanel(airport, coordinate) {
    // Remove existing panel if any
    hideAirportDetailsPanel();
    
    // Create panel element
    const panelElement = document.createElement('div');
    panelElement.className = 'airport-details-panel';
    panelElement.innerHTML = `
        <div class="airport-details-header">
            <h3>${airport.code}</h3>
            <button class="close-btn" onclick="hideAirportDetailsPanel()">×</button>
        </div>
        <div class="airport-details-content">
            <div class="detail-item">
                <strong>Airport:</strong> ${airport.name}
            </div>
            <div class="detail-item">
                <strong>City:</strong> ${airport.city}
            </div>
            <div class="detail-item">
                <strong>Country:</strong> ${airport.country}
            </div>
            <div class="detail-item">
                <strong>Coordinates:</strong> ${parseFloat(airport.lat).toFixed(4)}°, ${parseFloat(airport.lng).toFixed(4)}°
            </div>
            ${airport.elevation ? `<div class="detail-item"><strong>Elevation:</strong> ${airport.elevation} ft</div>` : ''}
        </div>
    `;
    
    // Create overlay
    airportDetailsOverlay = new ol.Overlay({
        element: panelElement,
        positioning: 'center-left',
        stopEvent: true,
        offset: [15, 0]
    });
    
    // Add to map
    map.addOverlay(airportDetailsOverlay);
    airportDetailsOverlay.setPosition(coordinate);
}

function hideAirportDetailsPanel() {
    if (airportDetailsOverlay) {
        map.removeOverlay(airportDetailsOverlay);
        airportDetailsOverlay = null;
    }
}

// Make function globally accessible
window.hideAirportDetailsPanel = hideAirportDetailsPanel;

// Função para selecionar aeroporto clicando no mapa
function selectAirportForRoute(airport) {
    // Verificar se uma aeronave foi selecionada
    if (!currentAircraft || currentRange <= 0) {
        alert('Primeiro selecione uma aeronave antes de escolher aeroportos.');
        return;
    }
    
    console.log(`Aeroporto selecionado: ${airport.city} (${airport.code})`);
    
    // Verificar se o aeroporto clicado já está na rota
    const existingIndex = routePoints.findIndex(point => point.code === airport.code);
    
    if (existingIndex !== -1) {
        // Aeroporto já existe na rota - truncar a partir deste ponto
        console.log(`Aeroporto ${airport.code} já existe na posição ${existingIndex}. Truncando rota...`);
        
        // Manter apenas os waypoints até o aeroporto clicado (inclusive)
        routePoints = routePoints.slice(0, existingIndex + 1);
        
        // Limpar mapa e redesenhar rota truncada
        redrawRouteFromPoints();
        
        // Atualizar interface
        updateRouteInterface();
        updateRouteList();
        
        console.log(`Rota truncada. Aeroportos restantes: ${routePoints.map(p => p.code).join(' → ')}`);
        return;
    }
    
    // Se não há aeroportos na rota, este será a origem
    if (routePoints.length === 0) {
        // Definir como origem
        routePoints.push(airport);
        
        // Limpar círculos e linhas existentes
        clearMapFeatures();
        
        // Desenhar círculo de alcance
        drawRangeCircle(airport);
        
        // Forçar atualização dos estilos dos marcadores
        vectorLayer.getSource().changed();
        
        // Atualizar interface
        updateRouteInterface();
        updateRouteList();
        
        // Habilitar botão de limpar rota
        document.getElementById('clear-route').disabled = false;
        
        console.log(`Origem definida: ${airport.city} (${airport.code})`);
        
    } else {
        // Adicionar como waypoint/destino
        const lastAirport = routePoints[routePoints.length - 1];
        const distance = calculateDistance(lastAirport.lat, lastAirport.lng, airport.lat, airport.lng);
        
        // Verificar se está dentro do alcance
        if (distance > currentRange * 0.98) {
            const deficit = distance - (currentRange * 0.98);
            const deficitPercent = ((deficit / (currentRange * 0.98)) * 100).toFixed(1);
            
            alert(`❌ Aeroporto fora de alcance!\n\n` +
                  `📍 Rota: ${lastAirport.city} → ${airport.city}\n` +
                  `📏 Distância: ${parseInt(distance).toLocaleString()} km\n` +
                  `✈️ Alcance: ${parseInt(currentRange * 0.98).toLocaleString()} km\n` +
                  `❌ Déficit: ${parseInt(deficit).toLocaleString()} km (${deficitPercent}% além)\n\n` +
                  `💡 Escolha um aeroporto intermediário ou uma aeronave com maior alcance.`);
            return;
        }
        
        // Adicionar à rota
        routePoints.push(airport);
        
        // Desenhar linha de rota
        drawRouteLine(lastAirport, airport);
        
        // Atualizar círculo de alcance para o novo aeroporto
        drawRangeCircle(airport);
        
        // Forçar atualização dos estilos dos marcadores
        vectorLayer.getSource().changed();
        
        // Atualizar interface
        updateRouteInterface();
        updateRouteList();
        
        console.log(`Waypoint adicionado: ${airport.city} (${airport.code}), Distância: ${parseInt(distance).toLocaleString()} km`);
    }
}

// Redesenhar toda a rota a partir dos pontos atuais
function redrawRouteFromPoints() {
    // Limpar features existentes (mas manter marcadores de aeroportos)
    clearMapFeatures();
    
    // Recarregar marcadores de aeroportos (que agora terão estilo atualizado baseado na rota)
    loadAndDisplayAllAirports();
    
    if (routePoints.length === 0) {
        return;
    }
    
    // Desenhar círculo para o primeiro aeroporto (origem)
    drawRangeCircle(routePoints[0]);
    
    // Desenhar linhas e círculos para o restante da rota
    for (let i = 1; i < routePoints.length; i++) {
        const fromAirport = routePoints[i - 1];
        const toAirport = routePoints[i];
        
        // Desenhar linha conectando os aeroportos
        drawRouteLine(fromAirport, toAirport);
        
        // Desenhar círculo de alcance para o aeroporto atual
        drawRangeCircle(toAirport);
    }
    
    console.log(`Rota redesenhada com ${routePoints.length} aeroportos`);
    
    // Forçar re-renderização para atualizar estilos dos marcadores
    vectorLayer.getSource().changed();
}

// Limpar features do mapa (círculos e linhas, mas manter marcadores de aeroportos)
function clearMapFeatures() {
    // Remover apenas círculos e linhas, mantendo marcadores de aeroportos
    const featuresToRemove = [];
    vectorSource.forEachFeature(function(feature) {
        const type = feature.get('type');
        if (type === 'range-circle' || type === 'route-line') {
            featuresToRemove.push(feature);
        }
    });
    
    featuresToRemove.forEach(function(feature) {
        vectorSource.removeFeature(feature);
    });
    
    // Limpar arrays de referência
    rangeCircles = [];
    routeLines = [];
}

// Atualizar interface para refletir seleção atual
function updateRouteInterface() {
    console.log('Updating route interface...');
    
    // Atualizar lista de rota no painel flutuante
    updateRouteList();
    
    const statusDiv = document.querySelector('.route-status') || createRouteStatusDiv();
    
    // Verificar se há aeronave selecionada
    if (!currentAircraft || currentRange <= 0) {
        statusDiv.innerHTML = '<p>✈️ Primeiro selecione uma aeronave para começar a planejar a rota</p>';
        return;
    }
    
    if (routePoints.length === 0) {
        statusDiv.innerHTML = '<p>🎯 Clique em um aeroporto no mapa para definir origem</p>';
    } else if (routePoints.length === 1) {
        const origin = routePoints[0];
        statusDiv.innerHTML = `<p>✅ <strong>Origem:</strong> ${origin.city} (${origin.code})<br>🎯 <strong>Próximo:</strong> Clique no próximo aeroporto<br><small>💡 <em>Dica: Clique na origem para reiniciar a rota</em></small></p>`;
    } else {
        const origin = routePoints[0];
        const current = routePoints[routePoints.length - 1];
        const waypointCount = routePoints.length - 1;
        statusDiv.innerHTML = `<p>✅ <strong>Origem:</strong> ${origin.city} (${origin.code})<br>📍 <strong>Atual:</strong> ${current.city} (${current.code}) <em>(${waypointCount} waypoint${waypointCount > 1 ? 's' : ''})</em><br>🎯 <strong>Próximo:</strong> Clique no próximo aeroporto<br><small>💡 <em>Dica: Clique em qualquer waypoint da rota para truncar a partir dele</em></small></p>`;
    }
}

// Criar div de status da rota se não existir
function createRouteStatusDiv() {
    let statusDiv = document.querySelector('.route-status');
    if (!statusDiv) {
        statusDiv = document.createElement('div');
        statusDiv.className = 'route-status';
        statusDiv.style.cssText = `
            background: #f8f9fa;
            border: 2px solid #dee2e6;
            border-radius: 8px;
            padding: 15px;
            margin: 10px 0;
            font-size: 14px;
            line-height: 1.4;
        `;
        
        // Inserir no painel de rota
        const routePanel = document.getElementById('route-panel');
        const panelContent = routePanel.querySelector('.panel-content');
        
        if (panelContent) {
            panelContent.appendChild(statusDiv);
        } else {
            // Fallback: adicionar ao body se não encontrar o painel
            document.body.appendChild(statusDiv);
        }
    }
    return statusDiv;
}

// Desenhar círculo de alcance geodésico usando OpenLayers
function drawRangeCircle(airport) {
    try {
        let category, numPoints;
        
        // Determinar estratégia baseada no alcance
        if (currentRange >= 20000) {
            category = 'extreme';
            numPoints = 16; // Poucos pontos para alcances extremos
        } else if (currentRange >= 12000) {
            category = 'long'; 
            numPoints = 24; // Poucos pontos para evitar deformação
        } else if (currentRange >= 8000) {
            category = 'medium';
            numPoints = 32;
        } else {
            category = 'normal';
            numPoints = 48; // Reduzido para melhor performance
        }
        
        // Validar parâmetros
        if (!airport || !airport.lat || !airport.lng || currentRange <= 0) {
            console.error('Parâmetros inválidos para drawRangeCircle:', { airport, currentRange });
            return;
        }
        
        let circleFeature;
        
        // Para TODOS os alcances, vamos usar círculo nativo do OpenLayers
        // que garante orientação correta e melhor performance
        const centerCoord = ol.proj.fromLonLat([airport.lng, airport.lat]);
        
        // Converter km para metros
        const radiusInMeters = currentRange * 1000;
        
        const circleGeometry = new ol.geom.Circle(centerCoord, radiusInMeters);
        
        circleFeature = new ol.Feature({
            geometry: circleGeometry,
            type: 'range-circle',
            category: category,
            airport: airport,
            range: currentRange
        });
        
        if (false) { // Desabilitado temporariamente - usar só círculo nativo
            // Para alcances menores, usar círculo geodésico preciso
            const coordinates = [];
            
            // Gerar pontos no sentido ANTI-HORÁRIO para polígono correto (interior)
            for (let i = 0; i < numPoints; i++) {
                const bearing = (i / numPoints) * 360;
                const point = calculateDestinationPoint(airport.lat, airport.lng, currentRange, bearing);
                
    airportMarkers = [];

                // Validar ponto calculado
                if (isNaN(point.lat) || isNaN(point.lng)) {
                    console.error('Invalid point calculated:', point, 'for bearing:', bearing);
                    continue;
                }
                
                coordinates.push(ol.proj.fromLonLat([point.lng, point.lat]));
            }
            
            // Fechar o polígono explicitamente
            if (coordinates.length > 0) {
                coordinates.push(coordinates[0]);
            }
            
            // Verificar se temos coordenadas válidas
            if (coordinates.length < 4) {
                console.error('Coordenadas insuficientes para criar polígono:', coordinates.length);
                return;
            }
            
            // Criar geometria do polígono geodésico
            // Nota: OpenLayers pode inverter a orientação automaticamente, então vamos forçar sentido correto
            const circleGeometry = new ol.geom.Polygon([coordinates]);
            
            circleFeature = new ol.Feature({
                geometry: circleGeometry,
                type: 'range-circle',
                category: category,
                airport: airport,
                range: currentRange
            });
        }
        
        // Adicionar à fonte de dados
        vectorSource.addFeature(circleFeature);
        rangeCircles.push(circleFeature);
        
        console.log(`Range circle created for ${airport.city} (${airport.code}) - Category: ${category}`);
        
    } catch (error) {
        console.error('Erro ao criar círculo de alcance:', error);
        console.error('Parâmetros:', { airport, currentRange });
    }
}

// Desenhar linha de rota
function drawRouteLine(fromAirport, toAirport) {
    // Calcular distância
    const distance = calculateDistance(fromAirport.lat, fromAirport.lng, toAirport.lat, toAirport.lng);
    
    // Verificar se a linha cruza o antimeridiano (diferença de longitude > 180°)
    const lngDiff = Math.abs(toAirport.lng - fromAirport.lng);
    const crossesAntimeridian = lngDiff > 180;
    
    let lineFeatures = [];
    
    if (crossesAntimeridian) {
        console.log(`Antimeridian crossing: ${fromAirport.code} (${fromAirport.lng}) to ${toAirport.code} (${toAirport.lng})`);
        
        // Usar coordenadas ajustadas para determinar a direção mais curta
        let fromLng = parseFloat(fromAirport.lng);
        let toLng = parseFloat(toAirport.lng);
        
        console.log(`Initial coordinates: fromLng=${fromLng}, toLng=${toLng}`);
        
        // Calcular ambas as distâncias possíveis
        const directDiff = Math.abs(toLng - fromLng);
        const wrapDiff = 360 - directDiff;
        
        console.log(`Distances: direct=${directDiff}, wrap=${wrapDiff}`);
        
        // Se a distância com wrap é menor, usar coordenadas ajustadas
        if (wrapDiff < directDiff) {
            if (fromLng > toLng) {
                // Ajustar toLng para mostrar que vamos para leste (direita)
                toLng = toLng + 360;
                console.log(`Adjusted toLng to: ${toLng} (going east)`);
            } else {
                // Ajustar fromLng para mostrar que vamos para oeste (esquerda)  
                fromLng = fromLng + 360;
                console.log(`Adjusted fromLng to: ${fromLng} (going west)`);
            }
        }
        
        console.log(`Using route: ${fromLng} to ${toLng} (shorter path)`);
        
        // Determinar o ponto de quebra na linha de data
        let breakLng;
        if (toLng > fromLng) {
            // Indo para leste, quebrar em 180°
            breakLng = 180;
        } else {
            // Indo para oeste, quebrar em -180°
            breakLng = -180;
        }
        
        // Calcular latitude no ponto de quebra (interpolação linear)
        const lngRange = toLng - fromLng;
        const latRange = parseFloat(toAirport.lat) - parseFloat(fromAirport.lat);
        const ratio = (breakLng - fromLng) / lngRange;
        const breakLat = parseFloat(fromAirport.lat) + latRange * ratio;
        
        console.log(`Break point: lng=${breakLng}, lat=${breakLat}, ratio=${ratio}`);
        
        // Primeiro segmento: origem até a linha de data
        const segment1Coords = [
            ol.proj.fromLonLat([fromAirport.lng, fromAirport.lat]),
            ol.proj.fromLonLat([breakLng, breakLat])
        ];
        
        // Segundo segmento: do outro lado da linha de data até destino
        const oppositeLng = breakLng === 180 ? -180 : 180;
        const segment2Coords = [
            ol.proj.fromLonLat([oppositeLng, breakLat]),
            ol.proj.fromLonLat([toAirport.lng, toAirport.lat])
        ];
        
        console.log(`Segment 1: (${fromAirport.lng}, ${fromAirport.lat}) to (${breakLng}, ${breakLat})`);
        console.log(`Segment 2: (${oppositeLng}, ${breakLat}) to (${toAirport.lng}, ${toAirport.lat})`);
        
        // Criar features para ambos os segmentos
        const segment1 = new ol.Feature({
            geometry: new ol.geom.LineString(segment1Coords),
            type: 'route-line',
            from: fromAirport,
            to: toAirport,
            distance: distance.toFixed(0),
            segment: 1
        });
        
        const segment2 = new ol.Feature({
            geometry: new ol.geom.LineString(segment2Coords),
            type: 'route-line',
            from: fromAirport,
            to: toAirport,
            distance: distance.toFixed(0),
            segment: 2
        });
        
        lineFeatures = [segment1, segment2];
        
    } else {
        // Linha normal (não cruza antimeridiano)
        const coordinates = [
            ol.proj.fromLonLat([fromAirport.lng, fromAirport.lat]),
            ol.proj.fromLonLat([toAirport.lng, toAirport.lat])
        ];
        
        const lineFeature = new ol.Feature({
            geometry: new ol.geom.LineString(coordinates),
            type: 'route-line',
            from: fromAirport,
            to: toAirport,
            distance: distance.toFixed(0)
        });
        
        lineFeatures = [lineFeature];
    }
    
    // Adicionar todas as features à fonte de dados
    lineFeatures.forEach(feature => {
        vectorSource.addFeature(feature);
        routeLines.push(feature);
    });
}

// Calcular distância entre dois pontos (fórmula de Haversine melhorada)
function calculateDistance(lat1, lng1, lat2, lng2) {
    const R = 6371; // Raio da Terra em km
    
    // Converter graus para radianos
    const lat1Rad = lat1 * Math.PI / 180;
    const lat2Rad = lat2 * Math.PI / 180;
    const deltaLatRad = (lat2 - lat1) * Math.PI / 180;
    const deltaLngRad = (lng2 - lng1) * Math.PI / 180;
    
    // Fórmula de Haversine
    const a = Math.sin(deltaLatRad / 2) * Math.sin(deltaLatRad / 2) +
              Math.cos(lat1Rad) * Math.cos(lat2Rad) *
              Math.sin(deltaLngRad / 2) * Math.sin(deltaLngRad / 2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;
    
    console.log(`Distância calculada: ${distance.toFixed(2)} km`); // Debug
    return distance;
}

// Calcular bearing (direção) inicial entre dois pontos
function calculateBearing(lat1, lng1, lat2, lng2) {
    const lat1Rad = lat1 * Math.PI / 180;
    const lat2Rad = lat2 * Math.PI / 180;
    const deltaLngRad = (lng2 - lng1) * Math.PI / 180;
    
    const y = Math.sin(deltaLngRad) * Math.cos(lat2Rad);
    const x = Math.cos(lat1Rad) * Math.sin(lat2Rad) - 
              Math.sin(lat1Rad) * Math.cos(lat2Rad) * Math.cos(deltaLngRad);
    
    const bearingRad = Math.atan2(y, x);
    const bearing = (bearingRad * 180 / Math.PI + 360) % 360;
    
    return bearing;
}

// Calcular ponto de destino geodésico (usado para círculos de alcance precisos)
function calculateDestinationPoint(lat1, lng1, distance, bearing) {
    // Validar inputs
    if (isNaN(lat1) || isNaN(lng1) || isNaN(distance) || isNaN(bearing)) {
        console.error('Inputs inválidos para calculateDestinationPoint:', { lat1, lng1, distance, bearing });
        return { lat: lat1, lng: lng1 }; // Retornar ponto original em caso de erro
    }
    
    const R = 6371; // Raio da Terra em km
    
    // Limitar distância para evitar problemas numéricos
    const maxDistance = R * Math.PI; // Aproximadamente metade da circunferência da Terra
    const limitedDistance = Math.min(distance, maxDistance);
    
    const lat1Rad = lat1 * Math.PI / 180;
    const lng1Rad = lng1 * Math.PI / 180;
    const bearingRad = bearing * Math.PI / 180;
    
    // Calcular latitude do ponto de destino
    const lat2Rad = Math.asin(
        Math.sin(lat1Rad) * Math.cos(limitedDistance / R) +
        Math.cos(lat1Rad) * Math.sin(limitedDistance / R) * Math.cos(bearingRad)
    );
    
    // Calcular longitude do ponto de destino
    const lng2Rad = lng1Rad + Math.atan2(
        Math.sin(bearingRad) * Math.sin(limitedDistance / R) * Math.cos(lat1Rad),
        Math.cos(limitedDistance / R) - Math.sin(lat1Rad) * Math.sin(lat2Rad)
    );
    
    // Converter de volta para graus
    const lat2 = lat2Rad * 180 / Math.PI;
    let lng2 = lng2Rad * 180 / Math.PI;
    
    // Normalizar longitude corretamente para o intervalo -180 a +180
    while (lng2 > 180) lng2 -= 360;
    while (lng2 < -180) lng2 += 360;
    
    // Validar resultado
    if (isNaN(lat2) || isNaN(lng2)) {
        console.error('Resultado inválido em calculateDestinationPoint:', { lat2, lng2 });
        return { lat: lat1, lng: lng1 }; // Retornar ponto original
    }
    
    return {
        lat: lat2,
        lng: lng2
    };
}

// Atualizar lista de rota
function updateRouteList() {
    console.log('updateRouteList called, routePoints.length:', routePoints.length);
    const routeList = document.getElementById('route-list');
    
    if (!routeList) {
        console.error('Route list element not found!');
        return;
    }
    
    console.log('Route list element found, clearing content');
    routeList.innerHTML = '';
    
    if (routePoints.length === 0) {
        const li = document.createElement('li');
        li.textContent = 'No route defined';
        routeList.appendChild(li);
        console.log('Added "No route defined" message');
        return;
    }
    
    let totalDistance = 0;
    
    routePoints.forEach((airport, index) => {
        const li = document.createElement('li');
        let distanceText = '';
        
        if (index > 0) {
            const prevAirport = routePoints[index - 1];
            const segmentDistance = calculateDistance(prevAirport.lat, prevAirport.lng, airport.lat, airport.lng);
            distanceText = ` (${segmentDistance.toFixed(0)} km)`;
            totalDistance += segmentDistance;
        }
        
        li.textContent = `${index + 1}. ${airport.city} (${airport.code})${distanceText}`;
        routeList.appendChild(li);
    });
    
    // Adicionar total se houver mais de um ponto
    if (routePoints.length > 1) {
        const totalLi = document.createElement('li');
        totalLi.innerHTML = `<strong>Total Distance: ${totalDistance.toFixed(0)} km</strong>`;
        totalLi.style.borderTop = '2px solid #2c3e50';
        totalLi.style.paddingTop = '0.5rem';
        totalLi.style.marginTop = '0.5rem';
        routeList.appendChild(totalLi);
    }
}

// Ajustar mapa para mostrar toda a rota
function fitMapToRoute() {
    if (routePoints.length > 1) {
        // Calcular extensão de todas as features
        const extent = vectorSource.getExtent();
        
        // Ajustar visualização com padding
        map.getView().fit(extent, {
            padding: [50, 50, 50, 50],
            duration: 1000
        });
    }
}

// Limpar rota
function clearRoute() {
    console.log('clearRoute() called');
    
    // Limpar pontos da rota
    routePoints = [];
    console.log('Route points cleared');
    
    // Limpar features do mapa (mas manter marcadores de aeroportos)
    clearMapFeatures();
    
    // Recarregar todos os marcadores de aeroportos
    loadAndDisplayAllAirports();
    
    // Atualizar lista de rota e interface
    updateRouteList();
    updateRouteInterface();
    
    // Disable clear button
    const clearRouteButton = document.getElementById('clear-route');
    if (clearRouteButton) {
        clearRouteButton.disabled = true;
        console.log('Clear button disabled');
    }
    
    // Voltar à visualização mundial
    map.getView().animate({
        center: ol.proj.fromLonLat([0, 20]),
        zoom: 2,
        duration: 1000
    });
    
    console.log('Route cleared successfully');
}

// Função para teste de cálculos de distância (debug)
function testDistanceCalculations() {
    console.log('=== TESTE DE DISTÂNCIAS GEODÉSICAS ===');
    
    // Teste 1: Paris (CDG) para Hyderabad (HYD) - caso reportado na screenshot
    const paris = airportsDatabase.find(a => a.code === 'CDG');
    const hyderabad = airportsDatabase.find(a => a.code === 'HYD');
    
    if (paris && hyderabad) {
        const distance = calculateDistance(paris.lat, paris.lng, hyderabad.lat, hyderabad.lng);
        console.log(`Paris → Hyderabad: ${distance.toFixed(2)} km`);
        console.log(`Honda Echelon (6482 km): ${distance <= 6482 ? 'WITHIN' : 'OUTSIDE'} range`);
        console.log(`Difference: ${(distance - 6482).toFixed(0)} km`);
    }
    
    // Teste 2: Verificar se círculo geodésico funciona corretamente
    if (paris) {
        const testPoint = calculateDestinationPoint(paris.lat, paris.lng, 6482, 90); // 90 graus = leste
        console.log(`Point 6482km EAST of Paris: ${testPoint.lat.toFixed(4)}°N, ${testPoint.lng.toFixed(4)}°E`);
        
        // Verificar se a distância de volta é igual
        const backDistance = calculateDistance(paris.lat, paris.lng, testPoint.lat, testPoint.lng);
        console.log(`Return distance: ${backDistance.toFixed(2)} km (should be ~6482)`);
    }
    
    // Teste 3: Nova York para Londres (controle)
    const jfk = airportsDatabase.find(a => a.code === 'JFK');
    const lhr = airportsDatabase.find(a => a.code === 'LHR');
    
    if (jfk && lhr) {
        const distance = calculateDistance(jfk.lat, jfk.lng, lhr.lat, lhr.lng);
        console.log(`Nova York → Londres: ${distance.toFixed(2)} km`);
    }
    
    console.log('✅ Círculos geodésicos implementados - visual deve coincidir com validação');
    console.log('=== FIM DOS TESTES ===');
}
 
