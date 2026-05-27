# ShieldCheck

> Password strength analyzer with Have I Been Pwned breach check — 100% private via k-anonymity.

[![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-yellow?style=flat-square)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![Web Crypto API](https://img.shields.io/badge/Web%20Crypto%20API-native-green?style=flat-square)](https://developer.mozilla.org/en-US/docs/Web/API/Web_Crypto_API)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow?style=flat-square)](LICENSE)

## Demo

![ShieldCheck Demo](media/demo_recording.webp)

| Secure Password | Compromised Password | Initial State |
|:-:|:-:|:-:|
| ![Secure](media/screenshot_secure.png) | ![Compromised](media/screenshot_compromised.png) | ![Initial](media/screenshot_initial.png) |

## Features

- Real-time password strength and entropy analysis
- HIBP breach check — detects if password appeared in known data breaches
- **K-anonymity**: only first 5 chars of SHA-1 hash sent to HIBP — password never leaves your browser
- No backend, no tracking, fully client-side

## Privacy Guarantee

1. Password hashed with SHA-1 via Web Crypto API in the browser
2. Only first **5 hex characters** of the hash are sent to HIBP
3. HIBP returns matching suffixes; browser checks locally
4. Your password is **never transmitted**

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Language | Vanilla JavaScript (ES6+) |
| Hashing | Web Crypto API (native SHA-1) |
| Breach data | HIBP Pwned Passwords API v3 |

## Usage

No install needed:

```bash
git clone https://github.com/builtbysardor/shieldcheck.git
cd shieldcheck
open index.html
```

## License

MIT © 2024 Sardor Buriyev
