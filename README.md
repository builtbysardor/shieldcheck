# ShieldCheck Pro | Password Security Analyzer 🛡️

A premium, privacy-focused cybersecurity tool that analyzes password strength and checks for data breaches using the **HaveIBeenPwned (HIBP)** API with the **k-anonymity** protocol.

## 🚀 Live Demo

![ShieldCheck Pro Demo](media/demo_recording.webp)

## ✨ Features

| Feature | Description |
|---|---|
| 🔍 **Breach Detection** | Checks passwords against 12+ billion leaked records via HIBP API |
| 🔐 **k-Anonymity Protocol** | Only SHA-1 hash prefix (5 chars) is sent — your password never leaves your device |
| 📊 **Entropy Analysis** | Real-time entropy calculation in bits |
| 💪 **Strength Meter** | Visual Weak → Fair → Good → Very Strong rating |
| 🔑 **Password Generator** | One-click secure password generation (18 chars, all character types) |
| 🎨 **Premium UI** | Apple + Cyber glassmorphism design with particle animations |

## 📸 Screenshots

### Initial State
![Initial State](media/screenshot_initial.png)

### Compromised Password Detected
![Compromised Password](media/screenshot_compromised.png)

### Secure Generated Password
![Secure Password](media/screenshot_secure.png)

## 🛠️ Tech Stack

- **HTML5** — Semantic structure with SVG icons
- **CSS3** — Custom design system, glassmorphism, CSS animations (FPS-optimized)
- **JavaScript (ES6+)** — Web Crypto API for SHA-1, HIBP Range API, requestAnimationFrame particles
- **API** — [HaveIBeenPwned Pwned Passwords](https://haveibeenpwned.com/API/v3#PwnedPasswords)

## 🔒 How It Works

```
User enters password
        ↓
SHA-1 hash generated locally (Web Crypto API)
        ↓
First 5 characters of hash sent to HIBP API
        ↓
API returns all matching hash suffixes
        ↓
Local comparison — password never transmitted
```

## 📖 Usage

1. Clone the repository
2. Open `index.html` in any modern browser
3. Enter a password or click **Generate Secure Password**

```bash
git clone https://github.com/builtbysardor/ShieldCheck-Password-Security-Analyzer-.git
cd ShieldCheck-Password-Security-Analyzer-
# Open index.html in your browser
```


