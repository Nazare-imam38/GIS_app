import configManager from './config.js';

require([
    "esri/Map",
    "esri/views/MapView",
    "esri/layers/WMSLayer",
    "esri/layers/WMTSLayer",
    "esri/layers/GraphicsLayer",
    "esri/Graphic",
    "esri/geometry/Point",
    "esri/geometry/Polyline",
    "esri/geometry/Polygon",
    "esri/symbols/SimpleMarkerSymbol",
    "esri/symbols/SimpleLineSymbol",
    "esri/symbols/SimpleFillSymbol",
    "esri/PopupTemplate",
    "esri/request",
    "esri/widgets/Sketch",
    "esri/widgets/Sketch/SketchViewModel"
], function(Map, MapView, WMSLayer, WMTSLayer, GraphicsLayer, Graphic, Point, Polyline, Polygon, SimpleMarkerSymbol, SimpleLineSymbol, SimpleFillSymbol, PopupTemplate, request, Sketch, SketchViewModel) {

            // Global variables
            let map, view, searchGraphicsLayer, sketchWidget, drawingLayer;
            
            // Search history management
            let searchHistory = [];
            const maxHistoryItems = 10;
            
            // Predefined South Asian landmarks
            const landmarks = [
                {
                    name: "Lahore Fort",
                    country: "Pakistan",
                    coordinates: [74.3106, 31.5897],
                    description: "Historic Mughal fort in Lahore, Pakistan",
                    icon: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3 21H21V3H3V21ZM5 5H19V19H5V5ZM7 7H17V9H7V7ZM7 11H17V13H7V11ZM7 15H17V17H7V15Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
                    category: "fort"
                },
                {
                    name: "Taj Mahal",
                    country: "India",
                    coordinates: [78.0421, 27.1751],
                    description: "Iconic white marble mausoleum in Agra, India",
                    icon: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M2 17L12 22L22 17" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M2 12L12 17L22 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
                    category: "monument"
                },
                {
                    name: "Badshahi Mosque",
                    country: "Pakistan",
                    coordinates: [74.3103, 31.5881],
                    description: "One of the world's largest mosques in Lahore",
                    icon: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M2 17L12 22L22 17" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M2 12L12 17L22 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
                    category: "mosque"
                },
                {
                    name: "Red Fort",
                    country: "India",
                    coordinates: [77.2410, 28.6562],
                    description: "Historic fort complex in Delhi, India",
                    icon: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3 21H21V3H3V21ZM5 5H19V19H5V5ZM7 7H17V9H7V7ZM7 11H17V13H7V11ZM7 15H17V17H7V15Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
                    category: "fort"
                },
                {
                    name: "Ahsan Manzil",
                    country: "Bangladesh",
                    coordinates: [90.4074, 23.7104],
                    description: "Pink Palace in Dhaka, Bangladesh",
                    icon: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M2 17L12 22L22 17" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M2 12L12 17L22 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
                    category: "palace"
                }
            ];
            
            // Create the map
            map = new Map({
                basemap: "streets-vector"
            });
            
            // Create graphics layer for search results
            searchGraphicsLayer = new GraphicsLayer({
                id: "searchResults"
            });
            map.add(searchGraphicsLayer);
            
            // Add a test graphics layer to verify map is working
            const testGraphicsLayer = new GraphicsLayer({
                id: "testGraphics"
            });
            map.add(testGraphicsLayer);
            
            // Create drawing layer for Sketch widget
            drawingLayer = new GraphicsLayer({
                id: "drawingLayer",
                title: "Drawing Layer"
            });
            map.add(drawingLayer);
            
            // Create landmarks graphics layer
            const landmarksLayer = new GraphicsLayer({
                id: "landmarksLayer",
                title: "South Asian Landmarks"
            });
            map.add(landmarksLayer);
            
            // Add a test point to verify graphics are working
            const testPoint = new Point({
                longitude: 78.9629,
                latitude: 20.5937
            });
            
            const testSymbol = new SimpleMarkerSymbol({
                color: [0, 255, 0, 0.8],
                size: 8,
                outline: {
                    color: [255, 255, 255],
                    width: 1
                }
            });
            
            const testGraphic = new Graphic({
                geometry: testPoint,
                symbol: testSymbol,
                attributes: { name: "Test Point" }
            });
            
            testGraphicsLayer.add(testGraphic);
            
            // Create the map view with South Asia initial extent
            view = new MapView({
                container: "mapView",
                map: map,
                center: [78.9629, 20.5937], // Center of India
                zoom: 5, // Zoom level to show Pakistan, India, and Bangladesh
                constraints: {
                    rotationEnabled: false
                }
            });
            
            // Function to test available WMS layers
            async function testAvailableLayers(wmsUrl) {
                try {
                    const capabilitiesUrl = `${wmsUrl}?service=WMS&version=${configManager.config.WMS_PARAMS.VERSION}&request=GetCapabilities`;
                    console.log("Testing WMS capabilities at:", capabilitiesUrl);
                    
                    const response = await request(capabilitiesUrl, {
                        responseType: "text"
                    });
                    
                        console.log("✅ WMS capabilities response received");
                    console.log("📋 Available layers in response:", response.data);
                        
                        // Look for layer names in the response
                        const layerMatches = response.data.match(/<Name>([^<]+)<\/Name>/g);
                        if (layerMatches) {
                            console.log("🎯 Found layer names:", layerMatches);
                    }
                    
                } catch (error) {
                    console.error("❌ Failed to get WMS capabilities:", error);
                }
            }
            
            // Add GeoServer WMS layers
            async function addGeoServerLayers() {
                console.log("🔄 Attempting to add GeoServer WMS layers...");
                
                // Update status
                if (window.statusDiv) {
                    window.statusDiv.innerHTML = "🔄 Loading WMS layers...";
                }
                
                try {
                    // Get the best available WMS URL
                    const wmsUrl = await configManager.getWMSURL();
                    console.log(`🌐 Using WMS URL: ${wmsUrl}`);
                    
                    // Test available layers first
                    await testAvailableLayers(wmsUrl);
                
                // Create individual WMS layers (matching Leaflet structure)
                const indiaRoads = new WMSLayer({
                    url: wmsUrl,
                    sublayers: [{
                        name: configManager.config.LAYERS.INDIA_ROADS,
                        title: "India Roads",
                        visible: true
                    }],
                    customLayerParameters: {
                        CRS: configManager.config.WMS_PARAMS.CRS,
                        format: configManager.config.WMS_PARAMS.FORMAT,
                        transparent: configManager.config.WMS_PARAMS.TRANSPARENT,
                        version: configManager.config.WMS_PARAMS.VERSION
                    }
                });
                
                const indiaRailways = new WMSLayer({
                    url: wmsUrl,
                    sublayers: [{
                        name: configManager.config.LAYERS.INDIA_RAILWAYS,
                        title: "India Railways",
                        visible: true
                    }],
                    customLayerParameters: {
                        CRS: configManager.config.WMS_PARAMS.CRS,
                        format: configManager.config.WMS_PARAMS.FORMAT,
                        transparent: configManager.config.WMS_PARAMS.TRANSPARENT,
                        version: configManager.config.WMS_PARAMS.VERSION
                    }
                });
                
                const bdRoads = new WMSLayer({
                    url: wmsUrl,
                    sublayers: [{
                        name: configManager.config.LAYERS.BD_ROADS,
                        title: "Bangladesh Roads",
                        visible: true
                    }],
                    customLayerParameters: {
                        CRS: configManager.config.WMS_PARAMS.CRS,
                        format: configManager.config.WMS_PARAMS.FORMAT,
                        transparent: configManager.config.WMS_PARAMS.TRANSPARENT,
                        version: configManager.config.WMS_PARAMS.VERSION
                    }
                });
                
                const bdRailways = new WMSLayer({
                    url: wmsUrl,
                    sublayers: [{
                        name: configManager.config.LAYERS.BD_RAILWAYS,
                        title: "Bangladesh Railways",
                        visible: true
                    }],
                    customLayerParameters: {
                        CRS: configManager.config.WMS_PARAMS.CRS,
                        format: configManager.config.WMS_PARAMS.FORMAT,
                        transparent: configManager.config.WMS_PARAMS.TRANSPARENT,
                        version: configManager.config.WMS_PARAMS.VERSION
                    }
                });
                
                const pkRoads = new WMSLayer({
                    url: wmsUrl,
                    sublayers: [{
                        name: configManager.config.LAYERS.PK_ROADS,
                        title: "Pakistan Roads",
                        visible: true
                    }],
                    customLayerParameters: {
                        CRS: configManager.config.WMS_PARAMS.CRS,
                        format: configManager.config.WMS_PARAMS.FORMAT,
                        transparent: configManager.config.WMS_PARAMS.TRANSPARENT,
                        version: configManager.config.WMS_PARAMS.VERSION
                    }
                });
                
                const pkRailways = new WMSLayer({
                    url: wmsUrl,
                    sublayers: [{
                        name: configManager.config.LAYERS.PK_RAILWAYS,
                        title: "Pakistan Railways",
                        visible: true
                    }],
                    customLayerParameters: {
                        CRS: configManager.config.WMS_PARAMS.CRS,
                        format: configManager.config.WMS_PARAMS.FORMAT,
                        transparent: configManager.config.WMS_PARAMS.TRANSPARENT,
                        version: configManager.config.WMS_PARAMS.VERSION
                    }
                });
                
                // Add layers to map with error handling
                function addLayerWithErrorHandling(layer, layerName) {
                    layer.load().then(() => {
                        map.add(layer);
                        console.log(`✅ ${layerName} layer added successfully`);
                        updateLoadingStatus(`${layerName} loaded successfully`, "success");
                    }).catch(error => {
                        console.error(`❌ Failed to load ${layerName} layer:`, error);
                        console.error(`❌ Layer details:`, layer);
                        updateLoadingStatus(`${layerName} failed to load`, "error");
                    });
                }
                
                // Add layers with timeout to prevent blocking
                setTimeout(() => {
                    addLayerWithErrorHandling(indiaRoads, "India Roads");
                }, 100);
                
                setTimeout(() => {
                    addLayerWithErrorHandling(indiaRailways, "India Railways");
                }, 200);
                
                setTimeout(() => {
                    addLayerWithErrorHandling(bdRoads, "Bangladesh Roads");
                }, 300);
                
                setTimeout(() => {
                    addLayerWithErrorHandling(bdRailways, "Bangladesh Railways");
                }, 400);
                
                setTimeout(() => {
                    addLayerWithErrorHandling(pkRoads, "Pakistan Roads");
                }, 500);
                
                setTimeout(() => {
                    addLayerWithErrorHandling(pkRailways, "Pakistan Railways");
                }, 600);
                
                // Store layer references for controls
                window.indiaRoads = indiaRoads;
                window.indiaRailways = indiaRailways;
                window.bdRoads = bdRoads;
                window.bdRailways = bdRailways;
                window.pkRoads = pkRoads;
                window.pkRailways = pkRailways;
                
                console.log("🔄 GeoServer WMS layers configuration initiated");
                
                // Hide splash screen after all layers are processed
                setTimeout(() => {
                    updateLoadingStatus("All layers processed", "success");
                    setTimeout(() => {
                        hideSplashScreen();
                    }, 1000);
                }, 2000);
                
            } catch (error) {
                console.error("❌ Failed to initialize GeoServer layers:", error);
                updateLoadingStatus("Failed to load WMS layers", "error");
                
                // Show user-friendly error message
                if (window.statusDiv) {
                    window.statusDiv.innerHTML = `
                        <div style="color: #ef4444; text-align: center; padding: 10px;">
                            <strong>⚠️ WMS Layers Unavailable</strong><br>
                            <small>GeoServer connection failed. Please check your configuration.</small>
                    </div>
                `;
                }
            }
            }
            
            // Reverse geocoding function
            async function reverseGeocode(coordinates) {
                try {
                    const [longitude, latitude] = coordinates;
                    
                    // Try GeoServer geocoder first (if available)
                    const geoserverGeocoderUrl = `http://localhost:8080/geoserver/geocoder/address?lat=${latitude}&lon=${longitude}&format=json`;
                    
                    try {
                        const geoserverResponse = await fetch(geoserverGeocoderUrl);
                        if (geoserverResponse.ok) {
                            const geoserverData = await geoserverResponse.json();
                            if (geoserverData && geoserverData.address) {
                                return {
                                    address: geoserverData.address,
                                    coordinates: coordinates,
                                    type: "geoserver",
                                    details: geoserverData
                                };
                            }
                        }
                    } catch (geoserverError) {
                        console.log("GeoServer geocoder not available, falling back to Nominatim");
                    }
                    
                    // Fallback to Nominatim reverse geocoding
                    const nominatimUrl = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`;
                    const response = await fetch(nominatimUrl);
                    
                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }
                    
                    const data = await response.json();
                    
                    if (data && data.display_name) {
                        return {
                            address: data.display_name,
                            coordinates: coordinates,
                            type: "nominatim",
                            details: data.address || {}
                        };
                    }
                } catch (error) {
                    console.error("Reverse geocoding failed:", error);
                }
                
                return null;
            }
            
            // Function to add search to history
            window.addToSearchHistory = function(query, coordinates, displayName, type = "search") {
                const searchItem = {
                    id: Date.now(),
                    query: query,
                    coordinates: coordinates,
                    displayName: displayName,
                    type: type,
                    timestamp: new Date().toISOString()
                };
                
                // Add to beginning of array
                searchHistory.unshift(searchItem);
                
                // Keep only maxHistoryItems
                if (searchHistory.length > maxHistoryItems) {
                    searchHistory = searchHistory.slice(0, maxHistoryItems);
                }
                
                // Save to localStorage
                localStorage.setItem('searchHistory', JSON.stringify(searchHistory));
                
                // Update UI
                updateSearchHistoryList();
            }
            
            // Function to update search history list
            function updateSearchHistoryList() {
                const historyList = document.getElementById('searchHistoryList');
                
                if (searchHistory.length === 0) {
                    historyList.innerHTML = '<div style="text-align: center; color: #7f8c8d; font-style: italic; margin: 0;">No search history yet</div>';
                    return;
                }
                
                let html = '';
                searchHistory.forEach((item, index) => {
                    const date = new Date(item.timestamp).toLocaleString();
                    const typeIcon = item.type === 'reverse' ? 'icon-point' : 'icon-search';
                    
                    html += `
                        <div class="history-item" onclick="navigateToHistoryItem(${index})">
                            <div class="history-query"><span class="icon ${typeIcon}"></span> ${item.displayName || item.query}</div>
                            <div class="history-address">${item.type === 'reverse' ? 'Clicked location' : `Searched: ${item.query}`}</div>
                            <div class="history-timestamp">${date}</div>
                        </div>
                    `;
                });
                
                historyList.innerHTML = html;
            }
            
            // Function to navigate to history item
            window.navigateToHistoryItem = function(index) {
                if (searchHistory[index]) {
                    const item = searchHistory[index];
                    const point = new Point({
                        longitude: item.coordinates[0],
                        latitude: item.coordinates[1]
                    });
                    
                    // Add temporary marker
                    const tempMarker = new Graphic({
                        geometry: point,
                        symbol: new SimpleMarkerSymbol({
                            color: [52, 152, 219, 0.8],
                            size: 12,
                            outline: {
                                color: [255, 255, 255],
                                width: 2
                            }
                        }),
                        attributes: {
                            name: item.displayName || item.query
                        },
                        popupTemplate: new PopupTemplate({
                            title: "History Item",
                            content: `
                                <div style="max-width: 250px;">
                                    <p><strong>${item.type === 'reverse' ? 'Clicked Location' : 'Search Result'}</strong></p>
                                    <p>${item.displayName || item.query}</p>
                                    <p><strong>Coordinates:</strong> ${item.coordinates[0].toFixed(4)}, ${item.coordinates[1].toFixed(4)}</p>
                                    <p><strong>From History:</strong> ${new Date(item.timestamp).toLocaleString()}</p>
                                </div>
                            `
                        })
                    });
                    
                    searchGraphicsLayer.add(tempMarker);
                    
                    // Navigate to location
                    view.goTo({
                        target: point,
                        zoom: 15
                    }).then(() => {
                        showMessage(`Navigated to: ${item.displayName || item.query}`, "success");
                        
                        // Remove marker after 5 seconds
                        setTimeout(() => {
                            searchGraphicsLayer.remove(tempMarker);
                        }, 5000);
                    });
                }
            };
            
            // Function to clear search history
            function clearSearchHistory() {
                searchHistory = [];
                localStorage.removeItem('searchHistory');
                updateSearchHistoryList();
                showMessage("Search history cleared", "success");
            }
            
            // Load search history from localStorage
            function loadSearchHistory() {
                const savedHistory = localStorage.getItem('searchHistory');
                if (savedHistory) {
                    try {
                        searchHistory = JSON.parse(savedHistory);
                        updateSearchHistoryList();
                    } catch (error) {
                        console.error('Error loading search history:', error);
                        searchHistory = [];
                    }
                }
            }
            
            // Geocoding function using GeoServer or Nominatim API
            async function geocodeAddress(address) {
                try {
                    // Try GeoServer geocoder first (if available)
                    const geoserverGeocoderUrl = `http://localhost:8080/geoserver/geocoder/address?q=${encodeURIComponent(address)}&format=json&limit=5`;
                    
                    try {
                        const geoserverResponse = await fetch(geoserverGeocoderUrl);
                        if (geoserverResponse.ok) {
                            const geoserverData = await geoserverResponse.json();
                            if (geoserverData && geoserverData.length > 0) {
                                return geoserverData.map(item => ({
                                    name: item.display_name || item.address,
                                    coordinates: [parseFloat(item.lon), parseFloat(item.lat)],
                                    type: "geoserver"
                                }));
                            }
                        }
                    } catch (geoserverError) {
                        console.log("GeoServer geocoder not available, falling back to Nominatim");
                    }
                    
                    // Fallback to Nominatim API
                    const nominatimUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&countrycodes=pk,in,bd&limit=5`;
                    const response = await fetch(nominatimUrl);
                    
                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }
                    
                    const data = await response.json();
                    
                    if (data && data.length > 0) {
                        return data.map(item => ({
                            name: item.display_name,
                            coordinates: [parseFloat(item.lon), parseFloat(item.lat)],
                            type: "nominatim"
                        }));
                    }
                } catch (error) {
                    console.error("Geocoding failed:", error);
                }
                
                return [];
            }
            
            // Add search result marker
            function addSearchMarker(coordinates, name) {
                // Clear previous search results
                searchGraphicsLayer.removeAll();
                
                const point = new Point({
                    longitude: coordinates[0],
                    latitude: coordinates[1]
                });
                
                const markerSymbol = new SimpleMarkerSymbol({
                    color: [255, 0, 0, 0.8],
                    size: 12,
                    outline: {
                        color: [255, 255, 255],
                        width: 2
                    }
                });
                
                const popupTemplate = new PopupTemplate({
                    title: "{name}",
                    content: "Location found via geocoding"
                });
                
                const graphic = new Graphic({
                    geometry: point,
                    symbol: markerSymbol,
                    attributes: { name: name },
                    popupTemplate: popupTemplate
                });
                
                searchGraphicsLayer.add(graphic);
                
                // Zoom to the location
                view.goTo({
                    target: point,
                    zoom: 12
                });
            }
            
                        // Handle search using Nominatim API
            window.performSearch = async function() {
                const searchInput = document.getElementById('searchInput');
                const query = searchInput.value.trim();
                
                if (!query) {
                    showMessage('❌ Please enter a search term', 'error');
                    return;
                }
                
                try {
                    console.log('Searching for:', query);
                    
                    // Use Nominatim API for search
                    const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=1&countrycodes=pk,in,bd&addressdetails=1`);
                    
                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }
                    
                    const data = await response.json();
                    console.log('📡 Nominatim response:', data);
                    
                    if (data.length > 0) {
                        const item = data[0];
                        const displayName = item.display_name.split(',').slice(0, 3).join(',');
                        
                        console.log('Found location:', displayName, 'at', item.lon, item.lat);
                        
                        // Navigate to the found location
                        navigateToCoordinates(item.lon, item.lat, displayName);
                    } else {
                        showMessage('❌ No results found for: ' + query, 'error');
                    }
                } catch (error) {
                    console.error('Search error:', error);
                    
                }
            }
             
             // Make selectSearchResult globally available
             window.selectSearchResult = function(name, coordinates, query) {
                 addSearchMarker(coordinates, name);
                 document.getElementById('searchResults').innerHTML = '';
                 
                 // Add to search history
                 addToSearchHistory(query || name, coordinates, name, "search");
             };
             
             // === GEOJSON UPLOAD & STYLING FUNCTIONALITY ===
             
             // Store uploaded layers
             let uploadedLayers = [];
             let layerCounter = 0;
             
             // Enhanced GeoJSON styling with custom icons and patterns
             function getPointStyle(feature) {
                 const properties = feature.properties || {};
                 const type = properties.type || properties.amenity || properties.category || 'default';
                 
                 // Enhanced custom icons based on feature type
                 const iconMap = {
                     hospital: { color: [255, 0, 0, 0.8], size: 12, symbol: '🏥' },
                     school: { color: [0, 0, 255, 0.8], size: 12, symbol: '🏫' },
                     police: { color: [255, 165, 0, 0.8], size: 12, symbol: '🚔' },
                     fire: { color: [255, 0, 0, 0.8], size: 12, symbol: '🚒' },
                     restaurant: { color: [255, 165, 0, 0.8], size: 10, symbol: '🍽️' },
                     shop: { color: [128, 0, 128, 0.8], size: 10, symbol: '🛍️' },
                     park: { color: [0, 255, 0, 0.8], size: 10, symbol: '🌳' },
                     fort: { color: [139, 69, 19, 0.8], size: 14, symbol: '🏰' },
                     mosque: { color: [0, 100, 200, 0.8], size: 12, symbol: '🕌' },
                     monument: { color: [255, 215, 0, 0.8], size: 14, symbol: '🗽' },
                     palace: { color: [255, 20, 147, 0.8], size: 12, symbol: '🏛️' },
                     temple: { color: [255, 165, 0, 0.8], size: 12, symbol: '🕍' },
                     bank: { color: [0, 128, 0, 0.8], size: 10, symbol: '🏦' },
                     airport: { color: [0, 0, 255, 0.8], size: 12, symbol: '✈️' },
                     station: { color: [128, 128, 128, 0.8], size: 10, symbol: '🚆' },
                     industrial: { color: [128, 128, 128, 0.8], size: 10, symbol: '🏭' },
                     residential: { color: [200, 200, 200, 0.8], size: 8, symbol: '🏘️' },
                     commercial: { color: [255, 255, 0, 0.8], size: 10, symbol: '🏢' },
                     default: { color: [128, 128, 128, 0.8], size: 8, symbol: '📍' }
                 };
                 
                 const style = iconMap[type.toLowerCase()] || iconMap.default;
                 
                 return new SimpleMarkerSymbol({
                     color: style.color,
                     size: style.size,
                     outline: {
                         color: [255, 255, 255],
                         width: 2
                     }
                 });
             }
             
             function getLineStyle(feature) {
                 const properties = feature.properties || {};
                 const type = properties.type || properties.highway || properties.road_type || 'default';
                 
                 // Enhanced line styling with color coding
                 const colorMap = {
                     highway: [255, 0, 0, 0.8],        // Red for highways
                     primary: [255, 165, 0, 0.8],      // Orange for primary roads
                     secondary: [255, 255, 0, 0.8],    // Yellow for secondary roads
                     tertiary: [255, 255, 255, 0.8],   // White for tertiary roads
                     residential: [128, 128, 128, 0.6], // Gray for residential roads
                     railway: [0, 0, 0, 0.8],          // Black for railways
                     default: [128, 128, 128, 0.6]
                 };
                 
                 const color = colorMap[type.toLowerCase()] || colorMap.default;
                 const width = type === 'highway' ? 4 : type === 'primary' ? 3 : 2;
                 
                 return new SimpleLineSymbol({
                     color: color,
                     width: width,
                     style: type === 'highway' ? 'dash' : 'solid'
                 });
             }
             
             function getPolygonStyle(feature) {
                 const properties = feature.properties || {};
                 const type = properties.type || properties.landuse || properties.zone || 'default';
                 
                 // Enhanced polygon styling with patterns and colors
                 const colorMap = {
                     industrial: [128, 128, 128, 0.6],      // Gray for industrial
                     residential: [200, 200, 200, 0.6],     // Light gray for residential
                     commercial: [255, 255, 0, 0.6],        // Yellow for commercial
                     water: [0, 150, 255, 0.6],             // Blue for water
                     forest: [0, 128, 0, 0.6],              // Green for forest
                     agricultural: [255, 255, 0, 0.4],      // Light yellow for agricultural
                     park: [0, 255, 0, 0.4],                // Green for parks
                     default: [200, 200, 200, 0.4]
                 };
                 
                 const color = colorMap[type.toLowerCase()] || colorMap.default;
                 
                 return new SimpleFillSymbol({
                     color: color,
                     outline: {
                         color: [0, 0, 0, 0.8],
                         width: 1
                     }
                 });
             }
             
             // Function to create GeoJSON layer with dynamic styling
             function createGeoJSONLayer(geojson, layerName) {
                 const graphicsLayer = new GraphicsLayer({
                     id: layerName,
                     title: layerName
                 });
                 
                 if (geojson.type === 'FeatureCollection') {
                     geojson.features.forEach(feature => {
                         const graphics = createGraphic(feature);
                         if (graphics) {
                             if (Array.isArray(graphics)) {
                                 // Multiple graphics (for MultiPoint, MultiLineString, etc.)
                                 graphics.forEach(graphic => {
                                     if (graphic) {
                                         graphicsLayer.add(graphic);
                                     }
                                 });
                             } else {
                                 // Single graphic
                                 graphicsLayer.add(graphics);
                             }
                         }
                     });
                 } else if (geojson.type === 'Feature') {
                     const graphics = createGraphic(geojson);
                     if (graphics) {
                         if (Array.isArray(graphics)) {
                             // Multiple graphics
                             graphics.forEach(graphic => {
                                 if (graphic) {
                                     graphicsLayer.add(graphic);
                                 }
                             });
                         } else {
                             // Single graphic
                             graphicsLayer.add(graphics);
                         }
                     }
                 } else if (geojson.type === 'Geometry') {
                     // Handle standalone geometry
                     const tempFeature = {
                         type: 'Feature',
                         geometry: geojson,
                         properties: {}
                     };
                     const graphics = createGraphic(tempFeature);
                     if (graphics) {
                         if (Array.isArray(graphics)) {
                             graphics.forEach(graphic => {
                                 if (graphic) {
                                     graphicsLayer.add(graphic);
                                 }
                             });
                         } else {
                             graphicsLayer.add(graphics);
                         }
                     }
                 } else if (geojson.type === 'GeometryCollection') {
                     // Handle geometry collection by creating multiple graphics
                     return createGeometryCollectionGraphics(geojson);
                 }
                 
                 return graphicsLayer;
             }
             
             // Function to create individual graphic
             function createGraphic(feature) {
                 try {
                     const geometry = feature.geometry;
                     let symbol;
                     
                     switch (geometry.type) {
                         case 'Point':
                             symbol = getPointStyle(feature);
                             break;
                         case 'LineString':
                             symbol = getLineStyle(feature);
                             break;
                         case 'Polygon':
                             symbol = getPolygonStyle(feature);
                             break;
                         case 'MultiPoint':
                             symbol = getPointStyle(feature);
                             break;
                         case 'MultiLineString':
                             symbol = getLineStyle(feature);
                             break;
                         case 'MultiPolygon':
                             symbol = getPolygonStyle(feature);
                             break;
                         case 'GeometryCollection':
                             // Handle geometry collection by creating multiple graphics
                             return createGeometryCollectionGraphics(feature);
                         default:
                             console.warn('Unsupported geometry type:', geometry.type);
                             return null;
                     }
                     
                     // Create geometry object with proper spatial reference
                     let esriGeometry;
                     if (geometry.type === 'Point') {
                         esriGeometry = new Point({
                             longitude: geometry.coordinates[0],
                             latitude: geometry.coordinates[1],
                             spatialReference: { wkid: 4326 } // WGS84
                         });
                     } else if (geometry.type === 'MultiPoint') {
                         // For MultiPoint, create individual point graphics
                         return createMultiPointGraphics(feature);
                     } else if (geometry.type === 'LineString') {
                         // Convert coordinates to proper format for Polyline
                         const paths = [geometry.coordinates.map(coord => [coord[0], coord[1]])];
                         esriGeometry = new Polyline({
                             paths: paths,
                             spatialReference: { wkid: 4326 } // WGS84
                         });
                     } else if (geometry.type === 'MultiLineString') {
                         // For MultiLineString, create individual line graphics
                         return createMultiLineStringGraphics(feature);
                     } else if (geometry.type === 'Polygon') {
                         // Convert coordinates to proper format for Polygon
                         const rings = geometry.coordinates.map(ring => 
                             ring.map(coord => [coord[0], coord[1]])
                         );
                         esriGeometry = new Polygon({
                             rings: rings,
                             spatialReference: { wkid: 4326 } // WGS84
                         });
                     } else if (geometry.type === 'MultiPolygon') {
                         // For MultiPolygon, create individual polygon graphics
                         return createMultiPolygonGraphics(feature);
                     }
                     
                     // Create popup template
                     const popupTemplate = new PopupTemplate({
                         title: feature.properties?.name || 'Feature',
                         content: createPopupContent(feature.properties)
                     });
                     
                     return new Graphic({
                         geometry: esriGeometry,
                         symbol: symbol,
                         attributes: feature.properties,
                         popupTemplate: popupTemplate
                     });
                     
                 } catch (error) {
                     console.error('Error creating graphic:', error);
                     return null;
                 }
             }
             
             // Function to create multiple graphics for MultiPoint
             function createMultiPointGraphics(feature) {
                 const graphics = [];
                 const coordinates = feature.geometry.coordinates;
                 
                 coordinates.forEach((coord, index) => {
                     const pointGeometry = new Point({
                         longitude: coord[0],
                         latitude: coord[1],
                         spatialReference: { wkid: 4326 }
                     });
                     
                     const symbol = getPointStyle(feature);
                     const popupTemplate = new PopupTemplate({
                         title: `${feature.properties?.name || 'Point'} ${index + 1}`,
                         content: createPopupContent(feature.properties)
                     });
                     
                     graphics.push(new Graphic({
                         geometry: pointGeometry,
                         symbol: symbol,
                         attributes: { ...feature.properties, pointIndex: index + 1 },
                         popupTemplate: popupTemplate
                     }));
                 });
                 
                 return graphics;
             }
             
             // Function to create multiple graphics for MultiLineString
             function createMultiLineStringGraphics(feature) {
                 const graphics = [];
                 const coordinates = feature.geometry.coordinates;
                 
                 coordinates.forEach((lineCoords, index) => {
                     const paths = [lineCoords.map(coord => [coord[0], coord[1]])];
                     const lineGeometry = new Polyline({
                         paths: paths,
                         spatialReference: { wkid: 4326 }
                     });
                     
                     const symbol = getLineStyle(feature);
                     const popupTemplate = new PopupTemplate({
                         title: `${feature.properties?.name || 'Line'} ${index + 1}`,
                         content: createPopupContent(feature.properties)
                     });
                     
                     graphics.push(new Graphic({
                         geometry: lineGeometry,
                         symbol: symbol,
                         attributes: { ...feature.properties, lineIndex: index + 1 },
                         popupTemplate: popupTemplate
                     }));
                 });
                 
                 return graphics;
             }
             
             // Function to create multiple graphics for MultiPolygon
             function createMultiPolygonGraphics(feature) {
                 const graphics = [];
                 const coordinates = feature.geometry.coordinates;
                 
                 coordinates.forEach((polygonCoords, index) => {
                     const rings = polygonCoords.map(ring => 
                         ring.map(coord => [coord[0], coord[1]])
                     );
                     const polygonGeometry = new Polygon({
                         rings: rings,
                         spatialReference: { wkid: 4326 }
                     });
                     
                     const symbol = getPolygonStyle(feature);
                     const popupTemplate = new PopupTemplate({
                         title: `${feature.properties?.name || 'Polygon'} ${index + 1}`,
                         content: createPopupContent(feature.properties)
                     });
                     
                     graphics.push(new Graphic({
                         geometry: polygonGeometry,
                         symbol: symbol,
                         attributes: { ...feature.properties, polygonIndex: index + 1 },
                         popupTemplate: popupTemplate
                     }));
                 });
                 
                 return graphics;
             }
             
             // Function to create graphics for GeometryCollection
             function createGeometryCollectionGraphics(feature) {
                 const graphics = [];
                 const geometries = feature.geometry.geometries;
                 
                 geometries.forEach((geom, index) => {
                     // Create a temporary feature for each geometry
                     const tempFeature = {
                         type: 'Feature',
                         geometry: geom,
                         properties: { ...feature.properties, geometryIndex: index + 1 }
                     };
                     
                     const graphic = createGraphic(tempFeature);
                     if (graphic) {
                         if (Array.isArray(graphic)) {
                             graphics.push(...graphic);
                         } else {
                             graphics.push(graphic);
                         }
                     }
                 });
                 
                 return graphics;
             }
             
             // Function to create popup content
             function createPopupContent(properties) {
                 if (!properties) return 'No properties available';
                 
                 let content = '<div style="max-width: 300px;">';
                 for (const [key, value] of Object.entries(properties)) {
                     if (value !== null && value !== undefined) {
                         content += `<div style="margin: 5px 0;"><strong>${key}:</strong> ${value}</div>`;
                     }
                 }
                 content += '</div>';
                 return content;
             }
             
             // File upload handling
             function handleFileUpload(file) {
                 const reader = new FileReader();
                 
                 reader.onload = function(e) {
                     try {
                         const geojson = JSON.parse(e.target.result);
                         console.log('Processing GeoJSON file:', file.name);
                         console.log('📋 GeoJSON structure:', geojson);
                         
                         // Validate GeoJSON
                         if (!geojson.type) {
                             throw new Error('Invalid GeoJSON format - missing type property');
                         }
                         
                         // Check for valid GeoJSON types
                         const validTypes = ['Feature', 'FeatureCollection', 'Point', 'LineString', 'Polygon', 'MultiPoint', 'MultiLineString', 'MultiPolygon', 'GeometryCollection'];
                         if (!validTypes.includes(geojson.type)) {
                             throw new Error(`Invalid GeoJSON type: ${geojson.type}. Expected one of: ${validTypes.join(', ')}`);
                         }
                         
                         // Validate based on type
                         if (geojson.type === 'FeatureCollection') {
                             if (!geojson.features || !Array.isArray(geojson.features)) {
                                 throw new Error('Invalid FeatureCollection: missing or invalid features array');
                             }
                             if (geojson.features.length === 0) {
                                 throw new Error('FeatureCollection contains no features');
                             }
                         } else if (geojson.type === 'Feature') {
                             if (!geojson.geometry) {
                                 throw new Error('Invalid Feature: missing geometry property');
                             }
                         } else if (geojson.type === 'GeometryCollection') {
                             if (!geojson.geometries || !Array.isArray(geojson.geometries)) {
                                 throw new Error('Invalid GeometryCollection: missing or invalid geometries array');
                             }
                             if (geojson.geometries.length === 0) {
                                 throw new Error('GeometryCollection contains no geometries');
                             }
                         } else {
                             // Standalone geometry (Point, LineString, Polygon, etc.)
                             if (!geojson.coordinates) {
                                 throw new Error(`Invalid ${geojson.type}: missing coordinates property`);
                             }
                         }
                         
                         console.log(`✅ Valid GeoJSON (${geojson.type}) with proper structure`);
                         
                         // Create layer
                         layerCounter++;
                         const layerName = `Uploaded Layer ${layerCounter}`;
                         const graphicsLayer = createGeoJSONLayer(geojson, layerName);
                         
                         console.log('Created graphics layer:', graphicsLayer);
                         console.log('📊 Graphics count:', graphicsLayer.graphics.length);
                         
                         // Calculate feature count based on GeoJSON type
                         let featureCount = 0;
                         if (geojson.type === 'FeatureCollection') {
                             featureCount = geojson.features.length;
                         } else if (geojson.type === 'Feature') {
                             featureCount = 1;
                         } else if (geojson.type === 'GeometryCollection') {
                             featureCount = geojson.geometries.length;
                         } else {
                             // Standalone geometry
                             featureCount = 1;
                         }
                         
                         // Add to map
                         map.add(graphicsLayer);
                         console.log('Added layer to map');
                         
                         // Store layer info
                         uploadedLayers.push({
                             name: layerName,
                             layer: graphicsLayer,
                             fileName: file.name,
                             featureCount: featureCount,
                             graphicsCount: graphicsLayer.graphics.length
                         });
                         
                         // Update UI
                         updateUploadedLayersList();
                         
                         // Show success message with detailed info
                         const message = `✅ Successfully loaded ${featureCount} feature(s) with ${graphicsLayer.graphics.length} graphic(s) from ${file.name}`;
                         showMessage(message, 'success');
                         
                         // Fit map to layer extent if needed
                         if (graphicsLayer.graphics.length > 0) {
                             setTimeout(() => {
                                 fitMapToLayer(graphicsLayer);
                             }, 500); // Small delay to ensure layer is fully loaded
                         }
                         
                     } catch (error) {
                         console.error('❌ Error processing GeoJSON:', error);
                         showMessage(`❌ Error processing file: ${error.message}`, 'error');
                     }
                 };
                 
                 reader.onerror = function() {
                     console.error('❌ File reading error');
                     showMessage('❌ Error reading file', 'error');
                 };
                 
                 reader.readAsText(file);
             }
             
             // Function to fit map to layer
             function fitMapToLayer(graphicsLayer) {
                 try {
                     if (graphicsLayer.graphics.length === 0) {
                         console.warn('No graphics in layer to fit to');
                         return;
                     }
                     
                     // Calculate extent from all graphics
                     let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
                     
                     graphicsLayer.graphics.forEach(graphic => {
                         if (graphic.geometry) {
                             const extent = graphic.geometry.extent;
                             if (extent) {
                                 minX = Math.min(minX, extent.xmin);
                                 minY = Math.min(minY, extent.ymin);
                                 maxX = Math.max(maxX, extent.xmax);
                                 maxY = Math.max(maxY, extent.ymax);
                             }
                         }
                     });
                     
                     // If we have valid extent, zoom to it
                     if (minX !== Infinity && minY !== Infinity && maxX !== -Infinity && maxY !== -Infinity) {
                         const extent = {
                             xmin: minX,
                             ymin: minY,
                             xmax: maxX,
                             ymax: maxY,
                             spatialReference: { wkid: 4326 }
                         };
                         
                         view.goTo(extent, { 
                             padding: 50,
                             duration: 1000
                         }).then(() => {
                             console.log('✅ Zoomed to uploaded GeoJSON layer');
                         }).catch(error => {
                             console.warn('Could not zoom to layer extent:', error);
                         });
                     } else {
                         console.warn('Could not calculate valid extent for layer');
                     }
                 } catch (error) {
                     console.warn('Could not fit map to layer:', error);
                 }
             }
             
             // Function to update uploaded layers list
             function updateUploadedLayersList() {
                 const container = document.getElementById('uploadedLayers');
                 
                 if (uploadedLayers.length === 0) {
                     container.innerHTML = '<div style="text-align: center; color: #666; font-size: 12px;">No layers uploaded yet</div>';
                     return;
                 }
                 
                 let html = '';
                 uploadedLayers.forEach((layer, index) => {
                     html += `
                         <div class="uploaded-layer-item">
                             <div class="uploaded-layer-info">
                                 <div class="uploaded-layer-name">${layer.name}</div>
                                 <div class="uploaded-layer-details">${layer.featureCount} feature(s) • ${layer.graphicsCount} graphic(s)</div>
                             </div>
                             <button onclick="removeLayer(${index})" class="remove-layer-btn">×</button>
                         </div>
                     `;
                 });
                 
                 container.innerHTML = html;
             }
             
             // Function to remove individual layer
             window.removeLayer = function(index) {
                 if (uploadedLayers[index]) {
                     const layer = uploadedLayers[index];
                     map.remove(layer.layer);
                     uploadedLayers.splice(index, 1);
                     updateUploadedLayersList();
                     showMessage(`Removed ${layer.name}`, 'success');
                 }
             };
             
             // Function to clear all uploaded layers
             window.clearUploadedLayers = function() {
                 uploadedLayers.forEach(layer => {
                     map.remove(layer.layer);
                 });
                 uploadedLayers = [];
                 layerCounter = 0;
                 updateUploadedLayersList();
                 showMessage('Cleared all uploaded layers', 'success');
             };
             
                         // Function to set active button
            function setActiveButton(activeButton) {
                // Remove active class from all buttons
                document.querySelectorAll('.draw-btn').forEach(btn => {
                    btn.classList.remove('active');
                });
                
                // Add active class to clicked button
                activeButton.classList.add('active');
            }
            
            // Function to save drawings as GeoJSON
            function saveDrawingsAsGeoJSON() {
                const features = [];
                
                drawingLayer.graphics.forEach(graphic => {
                    if (graphic.geometry) {
                        const feature = {
                            type: "Feature",
                            geometry: {
                                type: graphic.geometry.type,
                                coordinates: []
                            },
                            properties: {
                                name: "Drawn Feature",
                                created: new Date().toISOString(),
                                type: graphic.geometry.type
                            }
                        };
                        
                        // Convert geometry to GeoJSON coordinates
                        if (graphic.geometry.type === "point") {
                            feature.geometry.coordinates = [graphic.geometry.longitude, graphic.geometry.latitude];
                        } else if (graphic.geometry.type === "polyline") {
                            feature.geometry.coordinates = graphic.geometry.paths[0].map(point => [point[0], point[1]]);
                        } else if (graphic.geometry.type === "polygon") {
                            feature.geometry.coordinates = graphic.geometry.rings.map(ring => 
                                ring.map(point => [point[0], point[1]])
                            );
                        }
                        
                        features.push(feature);
                    }
                });
                
                if (features.length > 0) {
                    const geojson = {
                        type: "FeatureCollection",
                        features: features
                    };
                    
                    // Create download link
                    const dataStr = JSON.stringify(geojson, null, 2);
                    const dataBlob = new Blob([dataStr], { type: 'application/json' });
                    const url = URL.createObjectURL(dataBlob);
                    const link = document.createElement('a');
                    link.href = url;
                    link.download = `drawings_${new Date().toISOString().slice(0, 19).replace(/:/g, '-')}.geojson`;
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                    URL.revokeObjectURL(url);
                    
                    showMessage(`✅ Saved ${features.length} drawing(s) as GeoJSON`, "success");
                }
            }
            
            // Function to show messages
            window.showMessage = function(message, type) {
                 const messageDiv = document.createElement('div');
                 messageDiv.innerHTML = message;
                 messageDiv.style.cssText = `
                     position: fixed;
                     top: 20px;
                     right: 20px;
                     background: ${type === 'success' ? '#28a745' : '#dc3545'};
                     color: white;
                     padding: 10px 15px;
                     border-radius: 5px;
                     z-index: 10000;
                     font-size: 14px;
                 `;
                 
                 document.body.appendChild(messageDiv);
                 
                 setTimeout(() => {
                     if (document.body.contains(messageDiv)) {
                         document.body.removeChild(messageDiv);
                     }
                 }, 3000);
             }
             
             // Drag and drop functionality
             function setupDragAndDrop() {
                 const uploadArea = document.getElementById('uploadArea');
                 const fileInput = document.getElementById('fileInput');
                 
                 // Drag and drop events
                 uploadArea.addEventListener('dragover', function(e) {
                     e.preventDefault();
                     uploadArea.classList.add('dragover');
                 });
                 
                 uploadArea.addEventListener('dragleave', function(e) {
                     e.preventDefault();
                     uploadArea.classList.remove('dragover');
                 });
                 
                 uploadArea.addEventListener('drop', function(e) {
                     e.preventDefault();
                     uploadArea.classList.remove('dragover');
                     
                     const files = e.dataTransfer.files;
                     if (files.length > 0) {
                         const file = files[0];
                         if (file.name.endsWith('.geojson') || file.name.endsWith('.json')) {
                             handleFileUpload(file);
                         } else {
                             showMessage('❌ Please upload a GeoJSON file (.geojson or .json)', 'error');
                         }
                     }
                 });
                 
                 // File input change event
                 fileInput.addEventListener('change', function(e) {
                     const file = e.target.files[0];
                     if (file) {
                         handleFileUpload(file);
                         fileInput.value = ''; // Reset input
                     }
                 });
             }
             
             // Layer control event listeners
             document.getElementById('indiaRoads').addEventListener('change', function(e) {
                 if (window.indiaRoads) {
                     window.indiaRoads.visible = e.target.checked;
                 }
             });
             
             document.getElementById('indiaRailways').addEventListener('change', function(e) {
                 if (window.indiaRailways) {
                     window.indiaRailways.visible = e.target.checked;
                 }
             });
             
             document.getElementById('bdRoads').addEventListener('change', function(e) {
                 if (window.bdRoads) {
                     window.bdRoads.visible = e.target.checked;
                 }
             });
             
             document.getElementById('bdRailways').addEventListener('change', function(e) {
                 if (window.bdRailways) {
                     window.bdRailways.visible = e.target.checked;
                 }
             });
             
             document.getElementById('pkRoads').addEventListener('change', function(e) {
                 if (window.pkRoads) {
                     window.pkRoads.visible = e.target.checked;
                 }
             });
             
             document.getElementById('pkRailways').addEventListener('change', function(e) {
                 if (window.pkRailways) {
                     window.pkRailways.visible = e.target.checked;
                 }
             });
             
             // Search event listeners
             document.getElementById('searchInput').addEventListener('keypress', function(e) {
                 if (e.key === 'Enter') {
                     performSearch();
                 }
             });
             
             // Function to create landmark graphics
             function createLandmarkGraphics() {
                 landmarks.forEach(landmark => {
                     const point = new Point({
                         longitude: landmark.coordinates[0],
                         latitude: landmark.coordinates[1],
                         spatialReference: { wkid: 4326 }
                     });
                     
                     // Create custom marker symbol based on category
                     let symbol;
                     switch (landmark.category) {
                         case 'fort':
                             symbol = new SimpleMarkerSymbol({
                                 color: [139, 69, 19, 0.8], // Brown
                                 size: 12,
                                 outline: {
                                     color: [255, 255, 255],
                                     width: 2
                                 }
                             });
                             break;
                         case 'monument':
                             symbol = new SimpleMarkerSymbol({
                                 color: [255, 215, 0, 0.8], // Gold
                                 size: 14,
                                 outline: {
                                     color: [255, 255, 255],
                                     width: 2
                                 }
                             });
                             break;
                         case 'mosque':
                             symbol = new SimpleMarkerSymbol({
                                 color: [0, 100, 200, 0.8], // Blue
                                 size: 12,
                                 outline: {
                                     color: [255, 255, 255],
                                     width: 2
                                 }
                             });
                             break;
                         case 'palace':
                             symbol = new SimpleMarkerSymbol({
                                 color: [255, 20, 147, 0.8], // Pink
                                 size: 12,
                                 outline: {
                                     color: [255, 255, 255],
                                     width: 2
                                 }
                             });
                             break;
                         default:
                             symbol = new SimpleMarkerSymbol({
                                 color: [128, 128, 128, 0.8], // Gray
                                 size: 10,
                                 outline: {
                                     color: [255, 255, 255],
                                     width: 2
                                 }
                             });
                     }
                     
                     // Create popup template
                     const popupTemplate = new PopupTemplate({
                         title: `${landmark.icon} ${landmark.name}`,
                         content: `
                             <div style="max-width: 250px;">
                                 <p><strong>Country:</strong> ${landmark.country}</p>
                                 <p><strong>Description:</strong> ${landmark.description}</p>
                                 <p><strong>Coordinates:</strong> ${landmark.coordinates[0].toFixed(4)}, ${landmark.coordinates[1].toFixed(4)}</p>
                             </div>
                         `
                     });
                     
                     const graphic = new Graphic({
                         geometry: point,
                         symbol: symbol,
                         attributes: {
                             name: landmark.name,
                             country: landmark.country,
                             description: landmark.description,
                             category: landmark.category,
                             icon: landmark.icon
                         },
                         popupTemplate: popupTemplate
                     });
                     
                     landmarksLayer.add(graphic);
                 });
                 
                 console.log(`✅ Added ${landmarks.length} landmark graphics`);
             }
             
             
             
             // Function to initialize Sketch widget
            function initializeSketchWidget() {
                sketchWidget = new Sketch({
                    view: view,
                    layer: drawingLayer,
                    creationMode: "hybrid"
                });
                
                view.ui.add(sketchWidget, "top-left");
                
                // Handle sketch events
                sketchWidget.on("create", function(event) {
                    if (event.state === "complete") {
                        console.log("✅ Drawing completed:", event.graphic);
                        showMessage("✅ Drawing saved to map", "success");
                    }
                });
                
                console.log("✅ Sketch widget initialized");
            }
            
            // Function to update landmarks list in UI
             function updateLandmarksList() {
                 const landmarksList = document.getElementById('landmarksList');
                 
                 let html = '';
                                 landmarks.forEach((landmark, index) => {
                    html += `
                        <div class="landmark-item" onclick="navigateToLandmark(${index})">
                            <div class="landmark-name"><span class="icon icon-landmark"></span> ${landmark.name}</div>
                            <div class="landmark-country">${landmark.country}</div>
                        </div>
                    `;
                });
                 
                 landmarksList.innerHTML = html;
             }
             
             // Function to navigate to landmark
             window.navigateToLandmark = function(index) {
                 if (landmarks[index]) {
                     const landmark = landmarks[index];
                     const point = new Point({
                         longitude: landmark.coordinates[0],
                         latitude: landmark.coordinates[1]
                     });
                     
                     view.goTo({
                         target: point,
                         zoom: 15
                     }).then(() => {
                         showMessage(`Navigated to ${landmark.name}`, "success");
                     });
                 }
             };
             
             
             
             
             
             
             
             // Map click event for reverse geocoding
             view.on("click", async function(event) {
                 // Get the clicked location
                 const point = view.toMap(event);
                 const coordinates = [point.longitude, point.latitude];
                 
                 // Show loading popup
                 const loadingPopup = view.popup.open({
                     title: "🔄 Loading...",
                     content: "Getting address for this location...",
                     location: point
                 });
                 
                 try {
                     // Perform reverse geocoding
                     const result = await reverseGeocode(coordinates);
                     
                     if (result) {
                         // Create detailed popup content
                         const popupContent = `
                             <div class="reverse-geocoding-popup">
                                 <h4>Address Lookup</h4>
                                 <p><strong>Address:</strong> ${result.address}</p>
                                 <p class="coordinates"><strong>Coordinates:</strong> ${coordinates[0].toFixed(4)}, ${coordinates[1].toFixed(4)}</p>
                                 <p class="timestamp"><strong>Lookup Time:</strong> ${new Date().toLocaleString()}</p>
                                 <button onclick="saveReverseGeocodeToHistory('${result.address.replace(/'/g, "\\'")}', [${coordinates[0]}, ${coordinates[1]}])" class="save-to-history-btn">
                                     Save to History
                                 </button>
                             </div>
                         `;
                         
                         // Update popup with result
                         view.popup.open({
                             title: "Address Found",
                             content: popupContent,
                             location: point
                         });
                         
                         // Add temporary marker
                         const tempMarker = new Graphic({
                             geometry: point,
                             symbol: new SimpleMarkerSymbol({
                                 color: [231, 76, 60, 0.8], // Red
                                 size: 12,
                                 outline: {
                                     color: [255, 255, 255],
                                     width: 2
                                 }
                             }),
                             attributes: {
                                 name: result.address
                             }
                         });
                         
                         searchGraphicsLayer.add(tempMarker);
                         
                         // Remove marker after 10 seconds
                         setTimeout(() => {
                             searchGraphicsLayer.remove(tempMarker);
                         }, 10000);
                         
                     } else {
                         // Show error popup
                         view.popup.open({
                             title: "❌ Address Not Found",
                             content: `
                                 <div class="reverse-geocoding-popup">
                                     <h4>❌ No Address Found</h4>
                                     <p>Unable to get address for this location.</p>
                                     <p class="coordinates"><strong>Coordinates:</strong> ${coordinates[0].toFixed(4)}, ${coordinates[1].toFixed(4)}</p>
                                     <p class="timestamp"><strong>Time:</strong> ${new Date().toLocaleString()}</p>
                                 </div>
                             `,
                             location: point
                         });
                     }
                     
                 } catch (error) {
                     console.error("Reverse geocoding error:", error);
                     view.popup.open({
                         title: "❌ Error",
                         content: `
                             <div class="reverse-geocoding-popup">
                                 <h4>❌ Error</h4>
                                 <p>Failed to get address for this location.</p>
                                 <p class="coordinates"><strong>Coordinates:</strong> ${coordinates[0].toFixed(4)}, ${coordinates[1].toFixed(4)}</p>
                                 <p class="timestamp"><strong>Time:</strong> ${new Date().toLocaleString()}</p>
                             </div>
                         `,
                         location: point
                     });
                 }
             });
             
             // Function to save reverse geocoding result to history
             window.saveReverseGeocodeToHistory = function(address, coordinates) {
                 addToSearchHistory(address, coordinates, address, "reverse");
                 showMessage("✅ Saved to search history", "success");
             };
             
             // Initialize the application
             view.when(() => {
                 console.log("✅ Map view is ready");
                                 console.log("Current center:", view.center);
                console.log("Current zoom:", view.zoom);
                 
                                 // Update status to show map is loaded
                updateLoadingStatus("ArcGIS map loaded successfully", "success");
                 
                 // Test if map is working
                 view.goTo({
                     center: [78.9629, 20.5937],
                     zoom: 5
                 }).then(() => {
                     console.log("✅ Map navigation test successful");
                     
                     // Try to add WMS layers as an enhancement (non-blocking)
                     setTimeout(() => {
                         addGeoServerLayers();
                     }, 1000);
                     
                 }).catch(error => {
                     console.error("❌ Map navigation test failed:", error);
                 });
                 
                 // Setup GeoJSON upload functionality
                 setupDragAndDrop();
                 
                 // Initialize landmarks and drawing tools
                 createLandmarkGraphics();
                 updateLandmarksList();
 
                 
                 // Load search history
                                 loadSearchHistory();
                initializeSketchWidget();
                
                            // Show default recommendations on page load
            setTimeout(() => {
                showDefaultRecommendations();
                // Test Nominatim API
                testNominatimAPI();
            }, 1000);
            
            // Test Nominatim API functionality
            async function testNominatimAPI() {
                try {
                    console.log("🧪 Testing Nominatim API...");
                    const response = await fetch('https://nominatim.openstreetmap.org/search?format=json&q=Lahore&limit=1');
                    
                    if (response.ok) {
                        const data = await response.json();
                        console.log("✅ Nominatim API working:", data.length > 0 ? "Found results" : "No results");
                    } else {
                        console.error("❌ Nominatim API error:", response.status);
                    }
                } catch (error) {
                    console.error("❌ Nominatim API test failed:", error);
                }
            }
                
                // Add event listener for clear history button
             document.getElementById('clearHistoryBtn').addEventListener('click', clearSearchHistory);
             
                         // Sidebar toggle functionality with responsive support
            document.getElementById('sidebarToggle').addEventListener('click', function() {
                const sidebar = document.getElementById('sidebar');
                const mainContent = document.querySelector('.main-content');
                const isMobile = window.innerWidth <= 768;
                
                if (isMobile) {
                    // On mobile, toggle the sidebar visibility
                    sidebar.classList.toggle('show');
                sidebar.classList.toggle('collapsed');
                } else {
                    // On desktop, just toggle collapsed state
                    sidebar.classList.toggle('collapsed');
                    mainContent.classList.toggle('collapsed');
                }
            });
            
            // Close sidebar when clicking outside on mobile
            document.addEventListener('click', function(event) {
                const sidebar = document.getElementById('sidebar');
                const sidebarToggle = document.getElementById('sidebarToggle');
                const isMobile = window.innerWidth <= 768;
                
                if (isMobile && sidebar.classList.contains('show')) {
                    if (!sidebar.contains(event.target) && !sidebarToggle.contains(event.target)) {
                        sidebar.classList.remove('show');
                        sidebar.classList.add('collapsed');
                    }
                }
            });
            
            // Handle window resize
            window.addEventListener('resize', function() {
                const sidebar = document.getElementById('sidebar');
                const mainContent = document.querySelector('.main-content');
                const isMobile = window.innerWidth <= 768;
                
                if (isMobile) {
                    // On mobile, ensure sidebar is hidden by default
                    sidebar.classList.remove('show');
                    sidebar.classList.add('collapsed');
                    mainContent.classList.remove('collapsed');
                } else {
                    // On desktop, remove mobile-specific classes
                    sidebar.classList.remove('show');
                    mainContent.classList.remove('collapsed');
                }
            });
            
            // Prevent zoom on double tap for mobile
            let lastTouchEnd = 0;
            document.addEventListener('touchend', function (event) {
                const now = (new Date()).getTime();
                if (now - lastTouchEnd <= 300) {
                    event.preventDefault();
                }
                lastTouchEnd = now;
            }, false);
            
            // Improve touch handling for mobile
            document.addEventListener('touchstart', function() {}, {passive: true});
            
            // Handle orientation change
            window.addEventListener('orientationchange', function() {
                setTimeout(function() {
                    // Trigger resize event to handle layout changes
                    window.dispatchEvent(new Event('resize'));
                }, 100);
            });
             
                         // Theme toggle functionality
            document.getElementById('themeToggle').addEventListener('click', function() {
                const themeToggle = document.getElementById('themeToggle');
                const currentTheme = document.body.getAttribute('data-theme');
                
                if (currentTheme === 'dark') {
                    document.body.removeAttribute('data-theme');
                    themeToggle.innerHTML = '<span class="icon icon-sun"></span>';
                } else {
                    document.body.setAttribute('data-theme', 'dark');
                    themeToggle.innerHTML = '<span class="icon icon-theme"></span>';
                }
            });
             
                         // Drawing tool event listeners
            document.getElementById('drawPoint').addEventListener('click', function() {
                if (sketchWidget) {
                    sketchWidget.create("point");
                    setActiveButton(this);
                }
            });
            
            document.getElementById('drawLine').addEventListener('click', function() {
                if (sketchWidget) {
                    sketchWidget.create("polyline");
                    setActiveButton(this);
                }
            });
            
            document.getElementById('drawPolygon').addEventListener('click', function() {
                if (sketchWidget) {
                    sketchWidget.create("polygon");
                    setActiveButton(this);
                }
            });
            
            document.getElementById('clearDrawings').addEventListener('click', function() {
                if (drawingLayer) {
                    drawingLayer.removeAll();
                    showMessage("All drawings cleared", "success");
                }
            });
            
            document.getElementById('saveDrawings').addEventListener('click', function() {
                if (drawingLayer && drawingLayer.graphics.length > 0) {
                    saveDrawingsAsGeoJSON();
                } else {
                    showMessage("❌ No drawings to save", "error");
                }
            });
            
                        // Enhanced search functionality with recommendations
            document.getElementById('searchInput').addEventListener('input', function() {
                const searchResults = document.getElementById('searchResults');
                const query = this.value.trim();
                
                if (query.length > 2) {
                    // Show recommendations for major cities
                    showSearchRecommendations(query);
                    searchResults.style.display = 'block';
                } else if (query.length === 0) {
                    // Show default recommendations
                    showDefaultRecommendations();
                    searchResults.style.display = 'block';
                } else {
                    searchResults.style.display = 'none';
                }
            });
            
            // Show default recommendations for major South Asian cities
            function showDefaultRecommendations() {
                const searchResults = document.getElementById('searchResults');
                const recommendations = [
                    { name: 'Lahore, Punjab, Pakistan', coords: [74.3587, 31.5204] },
                    { name: 'Karachi, Sindh, Pakistan', coords: [67.0011, 24.8607] },
                    { name: 'Dhaka, Bangladesh', coords: [90.3563, 23.8103] },
                    { name: 'Mumbai, Maharashtra, India', coords: [72.8777, 19.0760] },
                    { name: 'Delhi, India', coords: [77.2090, 28.6139] },
                    { name: 'Bangalore, Karnataka, India', coords: [77.5946, 12.9716] },
                    { name: 'Chennai, Tamil Nadu, India', coords: [80.2707, 13.0827] },
                    { name: 'Kolkata, West Bengal, India', coords: [88.3639, 22.5726] }
                ];
                
                let html = '<div class="search-recommendations">';
                html += '<div class="recommendation-header">Popular Cities</div>';
                recommendations.forEach(rec => {
                    html += `
                        <div class="search-result-item" onclick="navigateToCoordinates(${rec.coords[0]}, ${rec.coords[1]}, '${rec.name}')">
                            <span class="icon icon-search"></span>
                            <span>${rec.name}</span>
                        </div>
                    `;
                });
                html += '</div>';
                searchResults.innerHTML = html;
            }
            
            // Show search recommendations based on Nominatim API
            async function showSearchRecommendations(query) {
                const searchResults = document.getElementById('searchResults');
                
                try {
                    // Use Nominatim API for search suggestions
                    const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5&countrycodes=pk,in,bd&addressdetails=1`);
                    
                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }
                    
                    const data = await response.json();
                    
                    if (data.length > 0) {
                        let html = '<div class="search-recommendations">';
                        html += '<div class="recommendation-header">Search Results</div>';
                        
                        data.forEach(item => {
                            const displayName = item.display_name.split(',').slice(0, 3).join(',');
                            const escapedName = displayName.replace(/'/g, "\\'");
                            html += `
                                <div class="search-result-item" onclick="navigateToCoordinates(${item.lon}, ${item.lat}, '${escapedName}')">
                                    <span class="icon icon-search"></span>
                                    <span>${displayName}</span>
                                </div>
                            `;
                        });
                        html += '</div>';
                        searchResults.innerHTML = html;
                    } else {
                        // Fallback to local search for common cities
                        const localResults = searchLocalCities(query);
                        if (localResults.length > 0) {
                            let html = '<div class="search-recommendations">';
                            html += '<div class="recommendation-header">Local Results</div>';
                            
                            localResults.forEach(rec => {
                                html += `
                                    <div class="search-result-item" onclick="navigateToCoordinates(${rec.coords[0]}, ${rec.coords[1]}, '${rec.name}')">
                                        <span class="icon icon-search"></span>
                                        <span>${rec.name}</span>
                                    </div>
                                `;
                            });
                            html += '</div>';
                            searchResults.innerHTML = html;
                        } else {
                            searchResults.innerHTML = '<div class="no-results">No results found</div>';
                        }
                    }
                } catch (error) {
                    console.error('Error fetching search recommendations:', error);
                    // Fallback to local search
                    const localResults = searchLocalCities(query);
                    if (localResults.length > 0) {
                        let html = '<div class="search-recommendations">';
                        html += '<div class="recommendation-header">Local Results</div>';
                        
                        localResults.forEach(rec => {
                            html += `
                                <div class="search-result-item" onclick="navigateToCoordinates(${rec.coords[0]}, ${rec.coords[1]}, '${rec.name}')">
                                    <span class="icon icon-search"></span>
                                    <span>${rec.name}</span>
                                </div>
                            `;
                        });
                        html += '</div>';
                        searchResults.innerHTML = html;
                    } else {
                        searchResults.innerHTML = '<div class="no-results">Search temporarily unavailable</div>';
                    }
                }
            }
            
            // Local search fallback for common cities
            function searchLocalCities(query) {
                const cities = [
                    { name: 'Lahore, Punjab, Pakistan', coords: [74.3587, 31.5204] },
                    { name: 'Karachi, Sindh, Pakistan', coords: [67.0011, 24.8607] },
                    { name: 'Dhaka, Bangladesh', coords: [90.3563, 23.8103] },
                    { name: 'Mumbai, Maharashtra, India', coords: [72.8777, 19.0760] },
                    { name: 'Delhi, India', coords: [77.2090, 28.6139] },
                    { name: 'Bangalore, Karnataka, India', coords: [77.5946, 12.9716] },
                    { name: 'Chennai, Tamil Nadu, India', coords: [80.2707, 13.0827] },
                    { name: 'Kolkata, West Bengal, India', coords: [88.3639, 22.5726] },
                    { name: 'Islamabad, Pakistan', coords: [73.0479, 33.6844] },
                    { name: 'Peshawar, Pakistan', coords: [71.5249, 34.0080] },
                    { name: 'Quetta, Pakistan', coords: [67.0011, 30.1798] },
                    { name: 'Chittagong, Bangladesh', coords: [91.7832, 22.3419] },
                    { name: 'Sylhet, Bangladesh', coords: [91.8687, 24.8949] },
                    { name: 'Hyderabad, India', coords: [78.4867, 17.3850] },
                    { name: 'Ahmedabad, India', coords: [72.5714, 23.0225] }
                ];
                
                const queryLower = query.toLowerCase();
                return cities.filter(city => 
                    city.name.toLowerCase().includes(queryLower)
                );
            }
            
            // Navigate to coordinates and add to search history
            window.navigateToCoordinates = function(lon, lat, displayName) {
                console.log('🧭 Navigating to:', lon, lat, displayName);
                
                const point = new Point({
                    longitude: parseFloat(lon),
                    latitude: parseFloat(lat)
                });
                
                view.goTo({
                    target: point,
                    zoom: 12
                });
                
                // Add marker
                const marker = new Graphic({
                    geometry: point,
                    symbol: new SimpleMarkerSymbol({
                        color: "#2eb4ff",
                        size: 12,
                        outline: {
                            color: "#ffffff",
                            width: 2
                        }
                    }),
                    popupTemplate: new PopupTemplate({
                        title: "Location Found",
                        content: `
                            <div>
                                <p><strong>Address:</strong> ${displayName}</p>
                                <p><strong>Coordinates:</strong> ${lon.toFixed(4)}, ${lat.toFixed(4)}</p>
                            </div>
                        `
                    })
                });
                
                searchGraphicsLayer.removeAll();
                searchGraphicsLayer.add(marker);
                
                // Add to search history
                addToSearchHistory(displayName, [lon, lat], displayName, 'search');
                
                // Hide search results
                document.getElementById('searchResults').style.display = 'none';
                document.getElementById('searchInput').value = displayName;
                
                showMessage(`Navigated to: ${displayName}`, "success");
            }
             
             // Close search results when clicking outside
             document.addEventListener('click', function(e) {
                 const searchResults = document.getElementById('searchResults');
                 const searchInput = document.getElementById('searchInput');
                 
                 if (!searchInput.contains(e.target) && !searchResults.contains(e.target)) {
                     searchResults.style.display = 'none';
                 }
             });
             
        }).catch(error => {
            console.error("❌ Map view failed to load:", error);
            if (window.statusDiv) {
                window.statusDiv.innerHTML = "❌ Map failed to load";
            }
        });
        
        // Splash screen management
        function updateLoadingStatus(message, iconType = "loading") {
            const loadingStatus = document.getElementById('loadingStatus');
            const statusItem = document.createElement('div');
            statusItem.className = 'status-item';
            
            let iconSvg = '';
            if (iconType === "loading") {
                iconSvg = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="status-icon"><path d="M12 2V6M12 18V22M4.93 4.93L7.76 7.76M16.24 16.24L19.07 19.07M2 12H6M18 12H22M4.93 19.07L7.76 16.24M16.24 7.76L19.07 4.93" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
            } else if (iconType === "success") {
                iconSvg = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="status-icon"><path d="M20 6L9 17L4 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
            } else if (iconType === "error") {
                iconSvg = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="status-icon"><path d="M18 6L6 18M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
            } else if (iconType === "map") {
                iconSvg = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="status-icon"><path d="M9 20L3 17V4L9 7M9 20L15 17M9 20V7M15 17L21 20V7L15 4M15 17V4M9 7L15 4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
            }
            
            statusItem.innerHTML = `
                ${iconSvg}
                <span class="status-text">${message}</span>
            `;
            loadingStatus.appendChild(statusItem);
        }
        
        function hideSplashScreen() {
            const splashScreen = document.getElementById('splashScreen');
            splashScreen.classList.add('hidden');
            setTimeout(() => {
                splashScreen.style.display = 'none';
            }, 500);
        }
        
        // Initialize loading status
        updateLoadingStatus("Initializing ArcGIS map...", "map");
         
    });