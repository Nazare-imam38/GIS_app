# 🚀 GeoServer Deployment Guide

## Option 1: Deploy to Railway (Recommended)

### Step 1: Create Railway Account
1. Go to [railway.app](https://railway.app)
2. Sign up with GitHub
3. Create new project

### Step 2: Deploy GeoServer
1. **Connect GitHub repository** to Railway
2. **Select the repository** with GeoServer files
3. **Railway will automatically detect** the Dockerfile
4. **Deploy** - Railway will build and deploy GeoServer

### Step 3: Get the URL
1. After deployment, Railway will give you a URL like:
   ```
   https://your-geoserver.railway.app
   ```
2. **Update your config.js**:
   ```javascript
   PUBLIC_URL: "https://your-geoserver.railway.app/geoserver"
   ```

## Option 2: Deploy to Heroku

### Step 1: Create Heroku Account
1. Go to [heroku.com](https://heroku.com)
2. Sign up for free account
3. Install Heroku CLI

### Step 2: Deploy
```bash
# Login to Heroku
heroku login

# Create app
heroku create your-geoserver-app

# Deploy
git push heroku main

# Get URL
heroku info
```

## Option 3: Deploy to DigitalOcean

### Step 1: Create Droplet
1. Create DigitalOcean account
2. Create new droplet (Ubuntu 20.04)
3. Connect via SSH

### Step 2: Install GeoServer
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Java
sudo apt install openjdk-11-jdk -y

# Download GeoServer
wget https://sourceforge.net/projects/geoserver/files/GeoServer/2.22.2/geoserver-2.22.2-bin.zip

# Extract and setup
unzip geoserver-2.22.2-bin.zip
sudo mv geoserver-2.22.2 /opt/geoserver

# Start GeoServer
cd /opt/geoserver
./bin/startup.sh
```

## Option 4: Use Existing Cloud GeoServer

### A. GeoServer Cloud (Paid)
- Professional hosting
- Managed service
- Always available

### B. MapBox/MapTiler (Alternative)
- Use their WMS services
- No GeoServer needed
- Pay-per-use

## 🎯 Quick Demo Solution

For immediate demo, you can:

1. **Screen share** your local application
2. **Show features** on your screen
3. **Explain deployment strategy**
4. **Share the code** and architecture

## 📋 Post-Deployment Checklist

After deploying GeoServer:

1. ✅ **Test the URL**: `https://your-geoserver-url/geoserver`
2. ✅ **Update config.js** with new URL
3. ✅ **Test WMS layers** in your app
4. ✅ **Deploy updated app** to Vercel
5. ✅ **Test on mobile** and different devices

## 🔧 Troubleshooting

### Common Issues:
- **Port issues**: Make sure port 8080 is exposed
- **Memory issues**: GeoServer needs at least 1GB RAM
- **Data loading**: Ensure your data files are included
- **CORS issues**: Configure GeoServer CORS settings

### Health Check:
```bash
# Test GeoServer
curl https://your-geoserver-url/geoserver/web/

# Test WMS
curl "https://your-geoserver-url/geoserver/south_asia/wms?service=WMS&version=1.1.0&request=GetCapabilities"
```
