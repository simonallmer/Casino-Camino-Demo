const DEMO_DURATION = 10 * 60; // 10 minutes in seconds

// Inject CSS
const demoStyle = document.createElement('style');
demoStyle.innerHTML = `
    .demo-timer-btn {
        position: fixed;
        bottom: 25px;
        left: 25px;
        background: rgba(10, 10, 5, 0.95);
        border: 2px solid var(--gold-dim, #aa8c2c);
        color: var(--gold-dim, #aa8c2c);
        padding: 10px 18px;
        border-radius: 10px;
        font-family: 'Cinzel', serif;
        font-size: 1rem;
        cursor: pointer;
        z-index: 99999;
        display: flex;
        gap: 12px;
        align-items: center;
        transition: all 0.2s ease;
        box-shadow: 0 5px 15px rgba(0,0,0,0.5);
    }
    .demo-timer-btn:hover {
        border-color: var(--gold-bright, #FFD700);
        color: var(--gold-bright, #FFD700);
        background: rgba(212, 175, 55, 0.15);
        transform: translateY(-2px);
    }
    .demo-timer-btn .demo-label {
        color: #fff;
        letter-spacing: 1px;
        font-weight: 700;
        opacity: 0.8;
    }
    .demo-timer-btn #demo-timer-text {
        color: var(--gold, #D4AF37);
        font-weight: 700;
        min-width: 50px;
    }

    .demo-modal-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.9);
        display: none;
        justify-content: center;
        align-items: center;
        z-index: 100000;
        backdrop-filter: blur(8px);
    }
    .demo-modal-open {
        display: flex !important;
    }
    .demo-modal-content {
        background: rgba(15, 10, 5, 0.98);
        border: 2px solid var(--gold-dim, #aa8c2c);
        border-radius: 15px;
        padding: 50px 40px;
        max-width: 500px;
        width: 90%;
        text-align: center;
        box-shadow: 0 0 50px rgba(0, 0, 0, 0.9);
        font-family: 'Playfair Display', serif;
    }
    .demo-modal-title {
        font-family: 'Cinzel', serif;
        color: var(--gold, #D4AF37);
        font-size: 1.5rem;
        letter-spacing: 4px;
        margin-bottom: 25px;
        text-transform: uppercase;
        font-weight: 800;
    }
    .demo-modal-text {
        color: #eee;
        font-size: 1.1rem;
        margin-bottom: 35px;
        line-height: 1.8;
    }
    .demo-btn-group {
        display: flex;
        flex-direction: column;
        gap: 15px;
        align-items: center;
    }
    .demo-primary-btn {
        background: linear-gradient(to bottom, #d4af37, #8a6e15);
        color: #000;
        border: none;
        padding: 15px 40px;
        font-family: 'Cinzel', serif;
        font-weight: 800;
        font-size: 1rem;
        letter-spacing: 2px;
        border-radius: 6px;
        cursor: pointer;
        width: 250px;
        transition: all 0.3s;
        text-transform: uppercase;
    }
    .demo-primary-btn:hover {
        background: linear-gradient(to bottom, #FFD700, #aa8c2c);
        transform: translateY(-3px);
        box-shadow: 0 5px 15px rgba(212, 175, 55, 0.4);
    }
    .demo-link-btn {
        background: none;
        border: none;
        color: #aaa;
        font-family: 'Cinzel', serif;
        font-size: 0.8rem;
        letter-spacing: 2px;
        cursor: pointer;
        text-transform: uppercase;
        transition: all 0.2s;
        margin-top: 5px;
    }
    .demo-link-btn:hover {
        color: #fff;
        text-decoration: underline;
    }
`;
document.head.appendChild(demoStyle);

// Inject HTML
const demoHtml = `
    <button id="demo-timer-btn" class="demo-timer-btn" onclick="showSubscriptionModal('general')">
        <span class="demo-label">DEMO</span>
        <span id="demo-timer-text">10:00</span>
    </button>

    <div id="demo-modal" class="demo-modal-overlay">
        <div class="demo-modal-content">
            <div id="demo-modal-title" class="demo-modal-title">ARCADE SUBSCRIPTION</div>
            <div id="demo-modal-text" class="demo-modal-text">Access Unlimited Play with an Arcade Subscription.</div>
            <div id="demo-modal-buttons" class="demo-btn-group">
                <button class="demo-primary-btn" onclick="window.location.href='https://simonallmer.com/aboutarcade'">LEARN MORE</button>
                <button class="demo-link-btn" onclick="closeSubscriptionModal()">CLOSE</button>
            </div>
        </div>
    </div>
`;
document.body.insertAdjacentHTML('beforeend', demoHtml);

// Logic
let demoInterval;
let isTimeEnded = false;

function formatTime(seconds) {
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
}

function updateDemoTimer() {
    let startTimeStr = localStorage.getItem('casino_demo_start');
    if (!startTimeStr) {
        startTimeStr = Date.now().toString();
        localStorage.setItem('casino_demo_start', startTimeStr);
    }

    const startTime = parseInt(startTimeStr);
    const elapsed = Math.floor((Date.now() - startTime) / 1000);
    let remaining = DEMO_DURATION - elapsed;

    if (remaining <= 0) {
        remaining = 0;
        if (!isTimeEnded) {
            isTimeEnded = true;
            localStorage.setItem('casino_demo_ended', 'true');
            showSubscriptionModal('time_ended');
        }
    } else {
        isTimeEnded = false;
        localStorage.setItem('casino_demo_ended', 'false');
    }

    const timeStr = formatTime(remaining);
    const timerTextEl = document.getElementById('demo-timer-text');
    if (timerTextEl) timerTextEl.innerText = timeStr;

    // Update index.html subtitle if it exists
    const subtitleEl = document.getElementById('demo-subtitle-text');
    if (subtitleEl) {
        subtitleEl.innerText = `Time remaining: ${timeStr}`;
    }
}

function resetDemoTime() {
    if (localStorage.getItem('casino_demo_ended') === 'true' || isTimeEnded) {
        showSubscriptionModal('time_ended');
        return;
    }
    localStorage.setItem('casino_demo_start', Date.now().toString());
    updateDemoTimer();
}

function showSubscriptionModal(type) {
    const titleEl = document.getElementById('demo-modal-title');
    const textEl = document.getElementById('demo-modal-text');
    const btnsEl = document.getElementById('demo-modal-buttons');

    if (type === 'time_ended') {
        titleEl.style.display = 'none';
        textEl.innerHTML = 'Your daily demo time has ended.<br><br>Continue playing and unlock all features with an Arcade Subscription.';
        btnsEl.innerHTML = `
            <button class="demo-primary-btn" onclick="window.location.href='https://simonallmer.com/arcade'">SUBSCRIBE</button>
            <button class="demo-link-btn" onclick="window.location.href='https://simonallmer.com/aboutarcade'">LEARN MORE</button>
        `;
    } else if (type === 'player_limit') {
        titleEl.style.display = 'block';
        titleEl.innerText = 'ARCADE SUBSCRIPTION';
        textEl.innerHTML = 'Subscribe to Arcade to unlock 8 Players and more features.';
        btnsEl.innerHTML = `
            <button class="demo-primary-btn" onclick="window.location.href='https://simonallmer.com/arcade'">SUBSCRIBE</button>
            <button class="demo-link-btn" onclick="window.location.href='https://simonallmer.com/aboutarcade'">LEARN MORE</button>
            <button class="demo-link-btn" onclick="closeSubscriptionModal()">CLOSE</button>
        `;
    } else {
        // general
        titleEl.style.display = 'block';
        titleEl.innerText = 'ARCADE SUBSCRIPTION';
        textEl.innerHTML = 'Access Unlimited Play with an Arcade Subscription.';
        btnsEl.innerHTML = `
            <button class="demo-primary-btn" onclick="window.location.href='https://simonallmer.com/aboutarcade'">LEARN MORE</button>
            <button class="demo-link-btn" onclick="closeSubscriptionModal()">CLOSE</button>
        `;
    }

    document.getElementById('demo-modal').classList.add('demo-modal-open');
}

function closeSubscriptionModal() {
    // If time ended, don't allow closing
    if (isTimeEnded) return;
    document.getElementById('demo-modal').classList.remove('demo-modal-open');
}

// Intercept keys
window.addEventListener('keydown', (e) => {
    const key = e.key.toLowerCase();
    
    if (key === 'r') {
        // Stop propagation so index.html doesn't reset money
        e.stopPropagation();
        
        // Cannot reset if time is up
        if (localStorage.getItem('casino_demo_ended') === 'true' || isTimeEnded) {
            showSubscriptionModal('time_ended');
        } else {
            resetDemoTime();
        }
    }

    if (e.key === 'Escape') {
        closeSubscriptionModal();
    }
}, true); // Use capture phase

// Check on load
if (localStorage.getItem('casino_demo_ended') === 'true') {
    isTimeEnded = true;
}

updateDemoTimer();
demoInterval = setInterval(updateDemoTimer, 1000);

