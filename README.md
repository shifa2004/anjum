# 🚑 Ambulance Patrol Drone - Emergency Response Simulator

This project simulates a **real-time emergency medical response system** using drones, synchronized GPS maps, and WebRTC video calls.  
It allows doctors to monitor patients remotely while drones provide live video, audio, and location tracking.

---

## 📂 Project Structure
- `index.html` → Landing page  
- `drone.html` → Drone simulator interface (GPS, video feed, patient form)  
- `doctor.html` → Doctor interface (doctor video feed, drone video, GPS map, patient list)  
- `server.js` → Backend server (Node.js + Express + Socket.IO)  
- `package.json` / `package-lock.json` → Dependencies list  
- `dr.k.krishna naik.png` / `gulam kashifa anjum.jpeg` → Project images  

---

## 🚀 Features
- ✅ Two-way **WebRTC video communication** (Doctor ↔ Drone)  
- ✅ **Leaflet.js GPS map sync** between doctor and drone views  
- ✅ **Patient registration & record sync**  
- ✅ Works across **laptops and mobile devices**  
- ✅ Real-time updates with **Socket.IO**  

---

## ⚙️ Installation (Run Locally)
1. Clone the repository:
   ```bash
   git clone https://github.com/shifa2004/testfile6.git
   cd testfile6
   
2.Install dependencies:
    npm install



🟢 Step 1: Find Your Local IP Address

On Windows, open Command Prompt and type:

ipconfig


Look for IPv4 Address (example: 192.168.1.25).

🟢 Step 2: Run Your Server

Start the server:

node server.js

## 🌐 Access in Browser
If you are running locally on one device:
- Drone: `http://localhost:8003/drone.html`
- Doctor: `http://localhost:8003/doctor.html`
- Landing: `http://localhost:8003/`

If you want to connect from another laptop/phone on the same WiFi,  
replace `localhost` with your system IP (example: `192.168.1.25`):
- Drone: `http://192.168.1.25:8003/drone.html`
- Doctor: `http://192.168.1.25:8003/doctor.html`
- Landing: `http://192.168.1.25:8003/`
