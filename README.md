# South Asia GIS Dashboard

A responsive web-based GIS dashboard for visualizing South Asian geographic data using GeoServer WMS layers.

## 🚀 Features

- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **WMS Layer Management**: Toggle visibility of roads and railways for India, Bangladesh, and Pakistan
- **GeoJSON Upload**: Upload and visualize custom GeoJSON files
- **Interactive Drawing Tools**: Draw points, lines, and polygons on the map
- **Search Functionality**: Search for cities and landmarks with reverse geocoding
- **Landmarks Database**: Pre-loaded landmarks for South Asian countries
- **Search History**: Track and manage search history
- **Dark/Light Theme**: Toggle between themes

## 🛠️ Setup Instructions

### Prerequisites

1. **GeoServer Installation**: Make sure GeoServer is running on your local machine
2. **ngrok** (for sharing with others): Install ngrok for tunneling

### Local Development

1. **Start GeoServer**:
   ```bash
   # Navigate to your GeoServer installation
   cd /path/to/geoserver
   ./bin/startup.sh  # or startup.bat on Windows
   ```

2. **Configure GeoServer**:
   - Create a workspace named `south_asia`
   - Add your WMS layers to this workspace
   - Ensure layers are published and accessible

3. **Update Configuration**:
   - Open `config.js`
   - Update the `PUBLIC_URL` with your current ngrok URL
   - Verify layer names match your GeoServer setup

4. **Start ngrok** (for sharing):
   ```bash
   ngrok http 8080
   ```

5. **Update ngrok URL**:
   - Copy the ngrok URL (e.g., `https://abc123.ngrok-free.app`)
   - Update `PUBLIC_URL` in `config.js`:
   ```javascript
   PUBLIC_URL: "https://abc123.ngrok-free.app/geoserver"
   ```

6. **Run the Application**:
   - Open `index.html` in a web browser
   - Or serve using a local server:
   ```bash
   python -m http.server 8000
   # or
   npx serve .
   ```

## 🔧 Configuration

### Environment Detection

The application automatically detects the environment:

- **Localhost**: Uses `http://localhost:8080/geoserver`
- **ngrok/Public**: Uses the configured `PUBLIC_URL`

### Layer Configuration

Update layer names in `config.js` to match your GeoServer setup:

```javascript
LAYERS: {
    INDIA_ROADS: "south_asia:IND_roads",
    INDIA_RAILWAYS: "south_asia:IND_rails", 
    BD_ROADS: "south_asia:bgd_trs_roads_lged",
    BD_RAILWAYS: "south_asia:bgd_trs_railways_lged",
    PK_ROADS: "south_asia:gis_osm_roads_free_1",
    PK_RAILWAYS: "south_asia:gis_osm_railways_free_1"
}
```

### WMS Parameters

Configure WMS parameters as needed:

```javascript
WMS_PARAMS: {
    VERSION: "1.1.0",
    FORMAT: "image/png",
    CRS: "EPSG:3857",
    TRANSPARENT: true
}
```

## 📱 Responsive Design

The application is fully responsive with breakpoints:

- **Desktop (>1200px)**: Full sidebar with all features
- **Tablet (768px-1200px)**: Compact sidebar
- **Mobile (≤768px)**: Overlay sidebar with touch-optimized interface
- **Small Mobile (≤480px)**: Optimized for very small screens

## 🔍 Troubleshooting

### WMS Layers Not Loading

1. **Check GeoServer Status**:
   - Ensure GeoServer is running on port 8080
   - Verify workspace `south_asia` exists
   - Check layer names match configuration

2. **Check ngrok Configuration**:
   - Verify ngrok is running and accessible
   - Update `PUBLIC_URL` in `config.js`
   - Test ngrok URL in browser

3. **Check Browser Console**:
   - Look for CORS errors
   - Check network requests to GeoServer
   - Verify layer capabilities response

### Common Issues

- **404 Errors**: Layer names don't match GeoServer
- **CORS Errors**: GeoServer CORS not configured
- **Connection Timeout**: ngrok tunnel expired or incorrect URL

## 🎯 Usage

### For Local Development
1. Use `localhost` in browser
2. Application automatically uses local GeoServer
3. All features work locally

### For Sharing with Others
1. Start ngrok: `ngrok http 8080`
2. Update `PUBLIC_URL` in `config.js`
3. Share the ngrok URL
4. Others can access your local GeoServer via ngrok

## 📁 File Structure

```
├── index.html          # Main HTML file
├── app.js             # Main JavaScript application
├── config.js          # Configuration management
├── styles.css         # Responsive CSS styles
└── README.md          # This file
```

## 🔄 Updates

When you restart ngrok:
1. Get the new ngrok URL
2. Update `PUBLIC_URL` in `config.js`
3. Refresh the application

## 📞 Support

For issues related to:
- **GeoServer**: Check GeoServer logs and documentation
- **ngrok**: Visit ngrok documentation
- **Application**: Check browser console for errors
