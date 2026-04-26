/**
 * ShieldCheck Pro — Password Security Analyzer
 * HIBP Integration with k-Anonymity + Strength Analysis + Particle Background
 */

// ========================
// DOM Elements
// ========================
const $ = (sel) => document.querySelector(sel);
const passwordInput = $('#passwordInput');
const toggleBtn = $('#toggleVisibility');
const eyeOpen = $('#eyeOpen');
const eyeClosed = $('#eyeClosed');
const strengthBar = $('#strengthBar');
const strengthLabel = $('#strengthLabel');
const entropyValue = $('#entropyValue');
const breachCard = $('#breachCard');
const breachDot = $('#breachDot');
const breachTitle = $('#breachTitle');
const breachDesc = $('#breachDesc');
const generateBtn = $('#generateBtn');

const reqLength = $('#reqLength');
const reqUpper = $('#reqUpper');
const reqLower = $('#reqLower');
const reqNumber = $('#reqNumber');
const reqSpecial = $('#reqSpecial');

let debounceTimer;

// ========================
// Event Listeners
// ========================
passwordInput.addEventListener('input', () => {
    const pw = passwordInput.value;
    analyzeStrength(pw);

    clearTimeout(debounceTimer);
    if (pw.length > 0) {
        debounceTimer = setTimeout(() => checkBreach(pw), 600);
    } else {
        breachCard.classList.add('hidden');
    }
});

toggleBtn.addEventListener('click', () => {
    const isHidden = passwordInput.type === 'password';
    passwordInput.type = isHidden ? 'text' : 'password';
    eyeOpen.style.display = isHidden ? 'none' : 'block';
    eyeClosed.style.display = isHidden ? 'block' : 'none';
});

generateBtn.addEventListener('click', () => {
    const pw = generatePassword();
    passwordInput.value = pw;
    passwordInput.type = 'text';
    eyeOpen.style.display = 'none';
    eyeClosed.style.display = 'block';
    passwordInput.dispatchEvent(new Event('input'));
});

// ========================
// SHA-1 Hash
// ========================
async function sha1(str) {
    const buf = new TextEncoder().encode(str);
    const hash = await crypto.subtle.digest('SHA-1', buf);
    return Array.from(new Uint8Array(hash))
        .map(b => b.toString(16).padStart(2, '0'))
        .join('')
        .toUpperCase();
}

// ========================
// HIBP Breach Check
// ========================
async function checkBreach(password) {
    breachCard.classList.remove('hidden', 'safe');
    breachCard.classList.add('scanning');
    breachTitle.textContent = 'Scanning breach database...';
    breachDesc.textContent = 'Sending hash prefix via k-anonymity protocol';

    try {
        const fullHash = await sha1(password);
        const prefix = fullHash.substring(0, 5);
        const suffix = fullHash.substring(5);

        const res = await fetch(`https://api.pwnedpasswords.com/range/${prefix}`);
        if (!res.ok) throw new Error('API request failed');

        const data = await res.text();
        const match = data.split('\n').find(line => line.startsWith(suffix));

        breachCard.classList.remove('scanning');

        if (match) {
            const count = parseInt(match.split(':')[1]).toLocaleString();
            breachCard.classList.remove('safe');
            breachTitle.textContent = '⚠ Compromised Password';
            breachDesc.textContent = `Found in ${count} known data breaches`;
        } else {
            breachCard.classList.add('safe');
            breachTitle.textContent = '✓ No Breaches Found';
            breachDesc.textContent = 'This password was not found in any known leaks';
        }
    } catch (err) {
        breachCard.classList.remove('scanning');
        breachTitle.textContent = 'Connection Error';
        breachDesc.textContent = 'Unable to reach HaveIBeenPwned API';
        console.error(err);
    }
}

// ========================
// Strength Analysis
// ========================
function analyzeStrength(pw) {
    if (!pw) {
        resetUI();
        return;
    }

    // Requirements
    const checks = {
        length: pw.length >= 12,
        upper: /[A-Z]/.test(pw),
        lower: /[a-z]/.test(pw),
        number: /[0-9]/.test(pw),
        special: /[^a-zA-Z0-9]/.test(pw),
    };

    setReq(reqLength, checks.length);
    setReq(reqUpper, checks.upper);
    setReq(reqLower, checks.lower);
    setReq(reqNumber, checks.number);
    setReq(reqSpecial, checks.special);

    // Entropy
    let pool = 0;
    if (checks.lower) pool += 26;
    if (checks.upper) pool += 26;
    if (checks.number) pool += 10;
    if (checks.special) pool += 32;
    const entropy = Math.floor(pw.length * Math.log2(pool || 1));
    entropyValue.textContent = `${entropy} bits entropy`;

    // Score
    const metCount = Object.values(checks).filter(Boolean).length;
    let level;
    
    if (pw.length < 6 || metCount <= 1) level = 'weak';
    else if (pw.length < 10 || metCount <= 2) level = 'fair';
    else if (pw.length < 14 || metCount <= 3) level = 'good';
    else level = 'strong';

    strengthBar.className = 'strength-bar-fill ' + level;

    const labels = { weak: 'Weak', fair: 'Fair', good: 'Good', strong: 'Very Strong' };
    const colors = { weak: '#EF4444', fair: '#F59E0B', good: '#84CC16', strong: '#22C55E' };
    strengthLabel.textContent = labels[level];
    strengthLabel.style.color = colors[level];
}

function setReq(el, met) {
    el.classList.toggle('met', met);
}

function resetUI() {
    strengthBar.className = 'strength-bar-fill';
    strengthLabel.textContent = '—';
    strengthLabel.style.color = '';
    entropyValue.textContent = '0 bits entropy';
    [reqLength, reqUpper, reqLower, reqNumber, reqSpecial].forEach(el => el.classList.remove('met'));
    breachCard.classList.add('hidden');
}

// ========================
// Password Generator
// ========================
function generatePassword(len = 18) {
    const chars = 'abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ0123456789!@#$%&*_+-=';
    const arr = new Uint32Array(len);
    crypto.getRandomValues(arr);
    return Array.from(arr, v => chars[v % chars.length]).join('');
}

// ========================
// Lightweight Particles (requestAnimationFrame)
// ========================
(function initParticles() {
    const canvas = document.getElementById('particleCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let particles = [];
    let w, h;

    function resize() {
        w = canvas.width = window.innerWidth;
        h = canvas.height = window.innerHeight;
    }

    function createParticles() {
        particles = [];
        const count = Math.min(40, Math.floor((w * h) / 25000));
        for (let i = 0; i < count; i++) {
            particles.push({
                x: Math.random() * w,
                y: Math.random() * h,
                vx: (Math.random() - 0.5) * 0.3,
                vy: (Math.random() - 0.5) * 0.3,
                r: Math.random() * 1.5 + 0.5,
                alpha: Math.random() * 0.3 + 0.1,
            });
        }
    }

    function draw() {
        ctx.clearRect(0, 0, w, h);
        for (const p of particles) {
            p.x += p.vx;
            p.y += p.vy;

            if (p.x < 0) p.x = w;
            if (p.x > w) p.x = 0;
            if (p.y < 0) p.y = h;
            if (p.y > h) p.y = 0;

            ctx.beginPath();
            ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(0, 245, 255, ${p.alpha})`;
            ctx.fill();
        }

        // Draw faint connections
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = dx * dx + dy * dy;
                if (dist < 18000) {
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = `rgba(0, 245, 255, ${0.04 * (1 - dist / 18000)})`;
                    ctx.lineWidth = 0.5;
                    ctx.stroke();
                }
            }
        }

        requestAnimationFrame(draw);
    }

    window.addEventListener('resize', () => { resize(); createParticles(); });
    resize();
    createParticles();
    draw();
})();
