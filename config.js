// config.js - GeoServer Configuration
// Auto-detect environment and provide fallback mechanisms

// Configuration object
const config = {
    // Local development URL
    LOCAL_URL: "http://localhost:8080/geoserver",
    
    // Public ngrok URL (update this when you start a new ngrok session)
    PUBLIC_URL: "https://bd733bfe3544.ngrok-free.app/geoserver",
    
    // Workspace name
    WORKSPACE: "south_asia",
    
    // Layer configurations
    LAYERS: {
        INDIA_ROADS: "south_asia:IND_roads",
        INDIA_RAILWAYS: "south_asia:IND_rails", 
        BD_ROADS: "south_asia:bgd_trs_roads_lged",
        BD_RAILWAYS: "south_asia:bgd_trs_railways_lged",
        PK_ROADS: "south_asia:gis_osm_roads_free_1",
        PK_RAILWAYS: "south_asia:gis_osm_railways_free_1"
    },
    
    // WMS parameters
    WMS_PARAMS: {
        VERSION: "1.1.0",
        FORMAT: "image/png",
        CRS: "EPSG:3857",
        TRANSPARENT: true
    }
};

// Detect environment
function detectEnvironment() {
    const hostname = window.location.hostname;
    const protocol = window.location.protocol;
    
    // Check if running locally
    if (hostname === "localhost" || hostname === "127.0.0.1" || hostname === "") {
        return "local";
    }
    
    // Check if running on ngrok
    if (hostname.includes("ngrok")) {
        return "ngrok";
    }
    
    // Default to public
    return "public";
}

// Get the appropriate base URL
function getBaseURL() {
    const environment = detectEnvironment();
    
    switch (environment) {
        case "local":
            return config.LOCAL_URL;
        case "ngrok":
        case "public":
            return config.PUBLIC_URL;
        default:
            return config.PUBLIC_URL;
    }
}

// Test URL connectivity
async function testURL(url) {
    try {
        const testUrl = `${url}/${config.WORKSPACE}/wms?service=WMS&version=${config.WMS_PARAMS.VERSION}&request=GetCapabilities`;
        const response = await fetch(testUrl, {
            method: 'GET',
            mode: 'cors',
            timeout: 5000
        });
        return response.ok;
    } catch (error) {
        console.warn(`❌ URL test failed for ${url}:`, error.message);
        return false;
    }
}

// Get the best available URL with fallback
async function getBestURL() {
    const primaryURL = getBaseURL();
    
    // Test primary URL
    const primaryWorks = await testURL(primaryURL);
    if (primaryWorks) {
        console.log(`✅ Using primary URL: ${primaryURL}`);
        return primaryURL;
    }
    
    // Fallback to localhost if primary fails
    if (primaryURL !== config.LOCAL_URL) {
        const localWorks = await testURL(config.LOCAL_URL);
        if (localWorks) {
            console.log(`⚠️ Primary URL failed, using localhost: ${config.LOCAL_URL}`);
            return config.LOCAL_URL;
        }
    }
    
    // If both fail, return primary URL anyway (will show error messages)
    console.error(`❌ All URLs failed, using primary: ${primaryURL}`);
    return primaryURL;
}

// Get WMS URL for a specific layer
async function getWMSURL() {
    const baseURL = await getBestURL();
    return `${baseURL}/${config.WORKSPACE}/wms`;
}

// Get WMTS URL for a specific layer
async function getWMTSURL() {
    const baseURL = await getBestURL();
    return `${baseURL}/${config.WORKSPACE}/wmts`;
}

// Export configuration
export default {
    config,
    detectEnvironment,
    getBaseURL,
    getBestURL,
    getWMSURL,
    getWMTSURL,
    testURL
};
