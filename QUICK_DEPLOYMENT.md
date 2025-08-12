# ⚡ **Quick Deployment Reference**

## 🚀 **Railway Deployment (5 Steps)**

### **Step 1: Railway Setup**
1. Go to [railway.app](https://railway.app)
2. Sign in with GitHub
3. Click "Start a New Project"

### **Step 2: Deploy**
1. Select your repo: `Nazare-imam38/GIS_app`
2. Click "Deploy Now"
3. Wait for build (5-10 minutes)

### **Step 3: Get URL**
1. Copy the Railway URL: `https://your-app.railway.app`
2. Test: `https://your-app.railway.app/geoserver`

### **Step 4: Update Config**
```javascript
// In config.js
PUBLIC_URL: "https://your-app.railway.app/geoserver"
```

### **Step 5: Deploy App**
1. Commit changes: `git add . && git commit -m "Update URL" && git push`
2. Vercel auto-deploys
3. Test your app

## 🔧 **Troubleshooting**

### **Build Fails**
- Check Railway logs
- Verify Dockerfile exists
- Check Java version

### **GeoServer Won't Start**
- Check Railway logs
- Verify port 8080
- Check memory allocation

### **WMS Not Working**
- Test URL directly
- Check layer names
- Verify workspace exists

## 📞 **Quick Commands**

```bash
# Test GeoServer
curl https://your-app.railway.app/geoserver/web/

# Test WMS
curl "https://your-app.railway.app/geoserver/south_asia/wms?service=WMS&version=1.1.0&request=GetCapabilities"

# Update and deploy
git add . && git commit -m "Update" && git push
```

## 🎯 **Expected Result**
- ✅ GeoServer: `https://your-app.railway.app/geoserver`
- ✅ WMS: `https://your-app.railway.app/geoserver/south_asia/wms`
- ✅ App: Your Vercel URL
- ✅ Mobile: Works everywhere
