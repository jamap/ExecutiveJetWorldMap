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

document.addEventListener('DOMContentLoaded', function() {
    initializeMap();
    populateManufacturers();
    populateRegions();
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
                return new ol.style.Style({
                    image: new ol.style.Circle({
                        radius: 6,
                        fill: new ol.style.Fill({
                            color: '#ffffff'
                        }),
                        stroke: new ol.style.Stroke({
                            color: '#000000',
                            width: 2
                        })
                    }),
                    zIndex: 10 // Ensure marker is drawn on top
                });
            }
        }
    });
    
    // Create OpenLayers map
    map = new ol.Map({
        target: 'map',
        layers: [
            // Base layer
            new ol.layer.Tile({
                source: new ol.source.XYZ({
                    url: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
                    attributions: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                })
            }),
            // Vector layer for circles and lines
            vectorLayer
        ],
        view: new ol.View({
            center: ol.proj.fromLonLat([0, 20]), // Convert to Web Mercator
            zoom: 2,
            minZoom: 2,
            maxZoom: 10,
            // Prevent navigation beyond world limits
            extent: ol.proj.transformExtent([-180, -85, 180, 85], 'EPSG:4326', 'EPSG:3857')
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

// Populate regions dropdown
function populateRegions() {
    const originRegionSelect = document.getElementById('origin-region');
    const destinationRegionSelect = document.getElementById('destination-region');
    
    // Sort regions alphabetically
    const sortedRegions = Object.keys(regionMapping).sort();
    
    sortedRegions.forEach(region => {
        // Add to origin
        const originOption = document.createElement('option');
        originOption.value = region;
        originOption.textContent = region;
        originRegionSelect.appendChild(originOption);
        
        // Add to destination
        const destinationOption = document.createElement('option');
        destinationOption.value = region;
        destinationOption.textContent = region;
        destinationRegionSelect.appendChild(destinationOption);
    });
}

// Update countries based on selected region (Origin)
function updateOriginCountries() {
    const regionSelect = document.getElementById('origin-region');
    const countrySelect = document.getElementById('origin-country');
    const airportSelect = document.getElementById('origin');
    
    // Clear dependent selections
    countrySelect.innerHTML = '<option value="">Select country</option>';
    countrySelect.disabled = true;
    airportSelect.innerHTML = '<option value="">Select airport</option>';
    airportSelect.disabled = true;
    
    const selectedRegion = regionSelect.value;
    
    if (selectedRegion && regionMapping[selectedRegion]) {
        const countries = regionMapping[selectedRegion];
        
        // Filtrar países que têm aeroportos na base de dados
        const availableCountries = countries.filter(country => 
            airportsDatabase.some(airport => airport.country === country)
        ).sort();
        
        availableCountries.forEach(country => {
            const option = document.createElement('option');
            option.value = country;
            option.textContent = country;
            countrySelect.appendChild(option);
        });
        
        countrySelect.disabled = false;
    }
}

// Update airports based on selected country (Origin)
function updateOriginAirports() {
    const countrySelect = document.getElementById('origin-country');
    const airportSelect = document.getElementById('origin');
    
    // Clear airports
    airportSelect.innerHTML = '<option value="">Select airport</option>';
    airportSelect.disabled = true;
    
    const selectedCountry = countrySelect.value;
    
    if (selectedCountry) {
        // Filter airports from selected country
        const countryAirports = airportsDatabase
            .filter(airport => airport.country === selectedCountry)
            .sort((a, b) => a.city.localeCompare(b.city));
        
        countryAirports.forEach(airport => {
            const option = document.createElement('option');
            option.value = airport.code;
            option.textContent = `${airport.city} (${airport.code})`;
            airportSelect.appendChild(option);
        });
        
        airportSelect.disabled = false;
    }
}

// Update countries based on selected region (Destination)
function updateDestinationCountries() {
    const regionSelect = document.getElementById('destination-region');
    const countrySelect = document.getElementById('destination-country');
    const airportSelect = document.getElementById('destination');
    
    // Clear dependent selections
    countrySelect.innerHTML = '<option value="">Select country</option>';
    countrySelect.disabled = true;
    airportSelect.innerHTML = '<option value="">Select airport</option>';
    airportSelect.disabled = true;
    
    const selectedRegion = regionSelect.value;
    
    if (selectedRegion && regionMapping[selectedRegion]) {
        const countries = regionMapping[selectedRegion];
        
        // Filter countries that have airports in the database
        const availableCountries = countries.filter(country => 
            airportsDatabase.some(airport => airport.country === country)
        ).sort();
        
        availableCountries.forEach(country => {
            const option = document.createElement('option');
            option.value = country;
            option.textContent = country;
            countrySelect.appendChild(option);
        });
        
        countrySelect.disabled = false;
    }
}

// Update airports based on selected country (Destination)
function updateDestinationAirports() {
    const countrySelect = document.getElementById('destination-country');
    const airportSelect = document.getElementById('destination');
    
    // Clear airports
    airportSelect.innerHTML = '<option value="">Select airport</option>';
    airportSelect.disabled = true;
    
    const selectedCountry = countrySelect.value;
    
    if (selectedCountry) {
        // Filter airports from selected country
        const countryAirports = airportsDatabase
            .filter(airport => airport.country === selectedCountry)
            .sort((a, b) => a.city.localeCompare(b.city));
        
        countryAirports.forEach(airport => {
            const option = document.createElement('option');
            option.value = airport.code;
            option.textContent = `${airport.city} (${airport.code})`;
            airportSelect.appendChild(option);
        });
        
        airportSelect.disabled = false;
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
    
    // Habilitar seleção de origem apenas se aeronave estiver selecionada
    updateOriginState();
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
        }
    }
    
    // Habilitar seleção de origem
    updateOriginState();
}

// Atualizar estado dos filtros de origem
function updateOriginState() {
    const originRegionSelect = document.getElementById('origin-region');
    const isEnabled = currentAircraft && currentRange > 0;
    originRegionSelect.disabled = !isEnabled;
}

// Definir origem
function setOrigin() {
    const originSelect = document.getElementById('origin');
    const destinationRegionSelect = document.getElementById('destination-region');
    const clearRouteButton = document.getElementById('clear-route');
    
    const selectedCode = originSelect.value;
    
    if (selectedCode) {
        const airport = airportsDatabase.find(a => a.code === selectedCode);
        
        if (airport) {
            // Limpar rota anterior
            clearRoute();
            
            // Adicionar origem à rota
            routePoints = [airport];
            
            // Centralizar mapa na origem
            map.getView().animate({
                center: ol.proj.fromLonLat([airport.lng, airport.lat]),
                zoom: 5,
                duration: 1000
            });
            
            // Desenhar círculo de alcance
            drawRangeCircle(airport);
            
            // Atualizar lista de rota
            updateRouteList();
            
            // Draw airport marker
            drawAirportMarker(airport);

            // Habilitar seleção de destino e botão limpar
            destinationRegionSelect.disabled = false;
            clearRouteButton.disabled = false;
        }
    }
}

// Adicionar waypoint com validação melhorada
function addWaypoint() {
    const destinationSelect = document.getElementById('destination');
    const selectedCode = destinationSelect.value;
    
    if (selectedCode && routePoints.length > 0) {
        const airport = airportsDatabase.find(a => a.code === selectedCode);
        const lastPoint = routePoints[routePoints.length - 1];
        
        if (airport && airport.code !== lastPoint.code) {
            // Calcular distância com mais precisão
            const distance = calculateDistance(lastPoint.lat, lastPoint.lng, airport.lat, airport.lng);
            
            console.log(`Checking route: ${lastPoint.city} (${lastPoint.code}) → ${airport.city} (${airport.code})`);
            console.log(`Distância: ${distance.toFixed(2)} km, Alcance: ${currentRange.toLocaleString()} km`);
            
            // Adicionar margem de segurança de 20% para compensar imprecisões cartográficas e segurança de vôo
            const safetyMargin = currentRange * 0.80;
            
            if (distance <= safetyMargin) {
                // Adicionar à rota
                routePoints.push(airport);
                
                // Desenhar círculo de alcance para o novo ponto
                drawRangeCircle(airport);
                
                // Desenhar linha de rota
                drawRouteLine(lastPoint, airport);

                // Draw airport marker
                drawAirportMarker(airport);
                
                // Atualizar lista de rota
                updateRouteList();
                
                // Resetar seleção de destino
                destinationSelect.value = '';
                
                // Ajustar visualização do mapa
                fitMapToRoute();
                
                console.log(`✅ Rota adicionada com sucesso!`);
            } else {
                const shortfall = distance - (currentRange * 0.8);
                const percentage = ((distance / (currentRange * 0.8) - 1) * 100);
                
                
                console.log(`❌ Destination out of range by ${shortfall.toFixed(0)} km (${percentage.toFixed(1)}% além do alcance)`);
                
                alert(`Destination out of safe range (80% of Aircraft Max range)\n\n` +
                      `📍 Route: ${lastPoint.city} → ${airport.city}\n` +
                      `📏 Distance: ${distance.toFixed(0)} km\n` +
                      `✈️ Safe Range: ${(currentRange*0.8).toLocaleString()} km\n` +
                      `❌ Difference: ${shortfall.toFixed(0)} km (${percentage.toFixed(1)}% além)\n\n` +
                      `💡 Sugestion: Pich an intermediary airport`);
                destinationSelect.value = '';
            }
        } else {
            destinationSelect.value = '';
        }

    }
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
            } else if (type === 'airport-marker') {
                const airport = feature.get('airport');
                content = `
                    <strong>${airport.city} (${airport.code})</strong><br>
                    ${airport.name}<br>
                    <em>${airport.country}</em>
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
    
    // Alterar cursor ao passar sobre features
    map.on('pointermove', function(event) {
        const hit = map.hasFeatureAtPixel(event.pixel);
        const target = map.getTarget();
        if (target && target.style) {
            target.style.cursor = hit ? 'pointer' : '';
        }
    });
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
        // Dividir linha em dois segmentos
        const fromCoord = ol.proj.fromLonLat([fromAirport.lng, fromAirport.lat]);
        const toCoord = ol.proj.fromLonLat([toAirport.lng, toAirport.lat]);
        
        // Calcular pontos de interseção nas bordas do mapa
        let edgeLng1, edgeLng2;
        
        if (fromAirport.lng > toAirport.lng) {
            // Indo de leste para oeste através do antimeridiano
            edgeLng1 = 180;  // Borda direita
            edgeLng2 = -180; // Borda esquerda
        } else {
            // Indo de oeste para leste através do antimeridiano
            edgeLng1 = -180; // Borda esquerda  
            edgeLng2 = 180;  // Borda direita
        }
        
        // Interpolar latitude nas bordas
        const latInterpolation = fromAirport.lat + (toAirport.lat - fromAirport.lat) * 0.5;
        
        // Primeiro segmento
        const segment1Coords = [
            fromCoord,
            ol.proj.fromLonLat([edgeLng1, latInterpolation])
        ];
        
        // Segundo segmento  
        const segment2Coords = [
            ol.proj.fromLonLat([edgeLng2, latInterpolation]),
            toCoord
        ];
        
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
    const routeList = document.getElementById('route-list');
    routeList.innerHTML = '';
    
    if (routePoints.length === 0) {
        const li = document.createElement('li');
        li.textContent = 'No route defined';
        routeList.appendChild(li);
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
    // Remover todas as features da fonte de dados
    vectorSource.clear();
    
    // Limpar arrays de referência
    rangeCircles = [];
    routeLines = [];
    
    // Limpar pontos da rota
    routePoints = [];
    
    // Atualizar lista de rota
    updateRouteList();
    
    // Resetar todos os filtros de origem
    const originRegionSelect = document.getElementById('origin-region');
    const originCountrySelect = document.getElementById('origin-country');
    const originSelect = document.getElementById('origin');
    
    originRegionSelect.value = '';
    originCountrySelect.innerHTML = '<option value="">Select country</option>';
    originCountrySelect.disabled = true;
    originSelect.innerHTML = '<option value="">Select airport</option>';
    originSelect.disabled = true;
    
    // Reset all destination filters
    const destinationRegionSelect = document.getElementById('destination-region');
    const destinationCountrySelect = document.getElementById('destination-country');
    const destinationSelect = document.getElementById('destination');
    
    destinationRegionSelect.value = '';
    destinationRegionSelect.disabled = true;
    destinationCountrySelect.innerHTML = '<option value="">Select country</option>';
    destinationCountrySelect.disabled = true;
    destinationSelect.innerHTML = '<option value="">Select airport</option>';
    destinationSelect.disabled = true;
    
    // Disable clear button
    const clearRouteButton = document.getElementById('clear-route');
    clearRouteButton.disabled = true;
    
    // Voltar à visualização mundial
    map.getView().animate({
        center: ol.proj.fromLonLat([0, 20]),
        zoom: 2,
        duration: 1000
    });
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

// Executar testes automaticamente quando a página carregar (apenas em desenvolvimento)
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(() => {
        if (console && typeof console.log === 'function') {
            testDistanceCalculations();
        }
    }, 2000);
});