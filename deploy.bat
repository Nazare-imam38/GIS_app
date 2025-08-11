@echo off
echo 🚀 Deploying South Asia GIS to Vercel...

echo 📦 Adding files to Git...
git add .

echo 💾 Committing changes...
git commit -m "Update configuration for Vercel deployment"

echo 🔗 Adding Vercel remote...
git remote add origin https://vercel.com/YOUR_USERNAME/sa-gis-app.git

echo 📤 Pushing to Vercel...
git push -u origin main

echo ✅ Deployment complete!
echo 🌐 Your app is available at: https://sa-gis-app.vercel.app/
pause
