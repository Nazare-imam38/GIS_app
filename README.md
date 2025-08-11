# 🌍 South Asia GIS Dashboard

A professional GIS (Geographic Information System) dashboard focused on South Asia, featuring interactive mapping, geocoding, GeoJSON support, and drawing tools.

## 🚀 Live Demo

**[View Live Application](https://yourusername.github.io/south-asia-gis-app)**

## ✨ Features

### 🗺️ **Interactive Mapping**
- ArcGIS JavaScript API integration
- South Asia focused map with Pakistan, India, and Bangladesh
- Responsive design with modern UI/UX

### 🔍 **Advanced Geocoding**
- **GeoServer Integration:** Local geocoding with South Asia data
- **Nominatim Fallback:** Global geocoding when GeoServer unavailable
- **Reverse Geocoding:** Click anywhere on map to get address
- **Search History:** Cached search results with navigation

### 📊 **GeoJSON Support**
- **Drag & Drop Upload:** Easy file upload interface
- **Dynamic Styling:** Automatic styling based on feature properties
- **Multiple Formats:** Points, lines, polygons, and complex geometries
- **Layer Management:** Toggle visibility and remove layers

### 🎨 **Drawing Tools**
- **Sketch Widget:** Freehand drawing on the map
- **Multiple Tools:** Points, lines, and polygons
- **Save/Export:** Download drawings as GeoJSON
- **Clear Functionality:** Remove all drawings

### 🏛️ **Predefined Landmarks**
- **5 Major Landmarks:** Lahore Fort, Taj Mahal, Badshahi Mosque, Red Fort, Ahsan Manzil
- **Interactive Navigation:** Click to navigate to landmarks
- **Detailed Information:** Country, description, and coordinates

### 🗂️ **Layer Management**
- **WMS Layers:** South Asia roads and railways
- **Country-specific Layers:** Pakistan, India, Bangladesh
- **Toggle Controls:** Show/hide individual layers

## 🛠️ Technology Stack

- **Frontend:** HTML5, CSS3, JavaScript (ES6+)
- **Mapping:** ArcGIS JavaScript API 4.27
- **Geocoding:** GeoServer Geocoder + Nominatim API
- **Styling:** Custom CSS with responsive design
- **Icons:** Custom SVG icons and emojis

## 📁 Project Structure

```
south-asia-gis-app/
├── index.html          # Main application file
├── styles.css          # Complete styling and responsive design
├── app.js             # Core application logic
├── README.md          # Project documentation
└── .gitignore         # Git ignore rules
```

## 🚀 Quick Start

### Prerequisites
- Modern web browser (Chrome, Firefox, Safari, Edge)
- Internet connection (for ArcGIS API and geocoding)

### Local Development
1. **Clone the repository:**
   ```bash
   git clone https://github.com/yourusername/south-asia-gis-app.git
   cd south-asia-gis-app
   ```

2. **Start local server:**
   ```bash
   # Using Python
   python -m http.server 8000
   
   # Using Node.js
   npx http-server -p 3000
   ```

3. **Open in browser:**
   - Python: http://localhost:8000
   - Node.js: http://localhost:3000

## 🎯 Key Features Explained

### GeoServer Integration
The application is designed to work with a local GeoServer instance:
- **URL:** `http://localhost:8080/geoserver`
- **WMS Layers:** South Asia roads and railways
- **Geocoding:** Local address lookup with fallback to Nominatim

### GeoJSON Styling
Automatic styling based on feature properties:
- **Points:** Custom icons for hospitals, schools, landmarks, etc.
- **Lines:** Color-coded highways, primary, secondary roads
- **Polygons:** Patterned fills for industrial, residential, commercial areas

### Search Functionality
- **Smart Search:** Type to get instant recommendations
- **Popular Cities:** Quick access to major South Asian cities
- **History Management:** Persistent search history with localStorage

## 🌐 Browser Support

- ✅ Chrome 80+
- ✅ Firefox 75+
- ✅ Safari 13+
- ✅ Edge 80+

## 📱 Responsive Design

The application is fully responsive and works on:
- Desktop computers
- Tablets
- Mobile phones
- Touch devices

## 🔧 Configuration

### GeoServer Setup
To enable full GeoServer functionality:

1. **Install GeoServer** on your server
2. **Load South Asia OSM data** as WMS/WMTS layers
3. **Install GeoServer Geocoder plugin**
4. **Configure address locator** with South Asia data
5. **Update URLs** in `app.js` if needed

### Customization
- **Landmarks:** Add/modify landmarks in the `landmarks` array in `app.js`
- **Styling:** Customize colors and icons in `styles.css`
- **GeoJSON Styling:** Modify styling functions in `app.js`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **ArcGIS JavaScript API** for mapping capabilities
- **Nominatim** for geocoding services
- **OpenStreetMap** for base map data
- **GeoServer** for WMS/WMTS services

## 📞 Support

For support and questions:
- Create an issue on GitHub
- Check the documentation
- Review the code comments

---

**Built with ❤️ for South Asia GIS professionals**
