document.documentElement.classList.remove('nojs');
const CONFIG = window.CIRCUS_INVITE_CONFIG;
const $ = (s, r=document) => r.querySelector(s);
const sleep = (ms)=> new Promise(r=>setTimeout(r, ms));

const storage = (()=>{
  try{
    const t='__circus_storage_test__';
    window.storage.setItem(t,'1');
    window.storage.removeItem(t);
    return window.localStorage;
  } catch(_){
    return { getItem: ()=> null, setItem: ()=> {}, removeItem: ()=> {} };
  }
})();


const cfg = (k, fallback) => {
  const v = CONFIG && Object.prototype.hasOwnProperty.call(CONFIG, k) ? CONFIG[k] : undefined;
  if (v === undefined || v === null) return fallback;
  const s = String(v).trim();
  return s ? s : fallback;
};

const applyEventText = () => {
  const dateEl = document.getElementById('fDate');
  const timeEl = document.getElementById('fTime');
  const placeEl = document.getElementById('fPlace');
  const rsvpEl = document.getElementById('fRSVP');
  const titleEl = document.querySelector('#bigTicket .bigTitle');

  if (dateEl) dateEl.textContent = cfg('EVENT_DATE', dateEl.textContent || 'TBA');
  if (timeEl) timeEl.textContent = cfg('EVENT_TIME', timeEl.textContent || 'TBA');
  if (placeEl) placeEl.textContent = cfg('EVENT_VENUE', placeEl.textContent || 'Event venue');
  if (rsvpEl) rsvpEl.textContent = cfg('EVENT_RSVP', rsvpEl.textContent || 'Event Host');
  if (titleEl) titleEl.textContent = cfg('EVENT_TITLE', titleEl.textContent || 'THE EVENT');
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', applyEventText, { once: true });
} else {
  applyEventText();
}

const TICKET_USED_KEY = 'circus_ticket_used_v1';
let ticketUsed = storage.getItem(TICKET_USED_KEY) === '1';

function applyUsedState(){
  const bigTicket = $('#bigTicket');
  const stubTicket = $('#stubTicket');
  if (ticketUsed){
    bigTicket.classList.add('used');
    stubTicket.classList.add('used');
  } else {
    bigTicket.classList.remove('used');
    stubTicket.classList.remove('used');
  }
}
applyUsedState();

function markTicketUsed(){
  ticketUsed = true;
  storage.setItem(TICKET_USED_KEY, '1');
  applyUsedState();
}

const book = $('#book');
const pageLeft = $('#pageLeft');
const pageRight = $('#pageRight');
let switching = false;

function showRightInstant(){
  pageLeft.classList.remove('active');
  pageRight.classList.add('active');
  if (window.matchMedia('(max-width: 920px)').matches) {
    pageLeft.style.display = 'none';
    pageRight.style.display = 'block';
  }
}
function showLeftInstant(){
  pageRight.classList.remove('active');
  pageLeft.classList.add('active');
  if (window.matchMedia('(max-width: 920px)').matches) {
    pageRight.style.display = 'none';
    pageLeft.style.display = 'block';
  }
}
function normalizeMobileDisplay(){
  if (!window.matchMedia('(max-width: 920px)').matches){
    pageLeft.style.display = 'block';
    pageRight.style.display = 'block';
  } else {
    if (pageRight.classList.contains('active')) {
      pageLeft.style.display = 'none';
      pageRight.style.display = 'block';
    } else {
      pageRight.style.display = 'none';
      pageLeft.style.display = 'block';
    }
  }
}
window.addEventListener('resize', normalizeMobileDisplay);
normalizeMobileDisplay();

async function switchPage(to){
  if (switching) return;
  switching = true;

  book.classList.remove('curtain-open');
  book.classList.add('curtain-close');
  await sleep(480);

  if (to === 'right') showRightInstant();
  else showLeftInstant();

  book.classList.remove('curtain-close');
  book.classList.add('curtain-open');

  if (to === 'right'){
    clownEntrance();
  }

  await sleep(620);
  book.classList.remove('curtain-open');
  switching = false;
}

const fxCanvas = $('#fxCanvas');
const fx = fxCanvas.getContext('2d');
let fxRaf = null;
let fxParts = [];

function resizeFx(){
  const dpr = Math.max(1, window.devicePixelRatio || 1);
  fxCanvas.width = Math.floor(window.innerWidth * dpr);
  fxCanvas.height = Math.floor(window.innerHeight * dpr);
  fxCanvas.style.width = window.innerWidth + 'px';
  fxCanvas.style.height = window.innerHeight + 'px';
  fx.setTransform(dpr, 0, 0, dpr, 0, 0);
}
window.addEventListener('resize', resizeFx);
resizeFx();

function boomConfetti(power=1){
  resizeFx();
  fxParts = [];
  const count = Math.floor(220 * power);
  for (let i=0;i<count;i++){
    fxParts.push({
      x: window.innerWidth * (0.35 + Math.random()*0.30),
      y: window.innerHeight * (0.25 + Math.random()*0.10),
      vx: (Math.random()*10 - 5) * power,
      vy: (-(Math.random()*10 + 6)) * power,
      g: 0.20 + Math.random()*0.16,
      s: 4 + Math.random()*6,
      r: Math.random()*Math.PI,
      vr: (Math.random()*0.22 - 0.11),
      life: 70 + Math.random()*55,
      hue: Math.floor(Math.random()*360)
    });
  }
  if (fxRaf) cancelAnimationFrame(fxRaf);
  tickFx();
}

function tickFx(){
  fx.clearRect(0,0,window.innerWidth, window.innerHeight);

  for (const p of fxParts){
    p.vy += p.g;
    p.x += p.vx;
    p.y += p.vy;
    p.r += p.vr;
    p.life -= 1;

    fx.save();
    fx.translate(p.x, p.y);
    fx.rotate(p.r);
    fx.fillStyle = `hsl(${p.hue} 92% 62% / 0.95)`;
    fx.fillRect(-p.s/2, -p.s/2, p.s, p.s*0.7);
    fx.restore();
  }

  fxParts = fxParts.filter(p => p.life > 0 && p.y < window.innerHeight + 60);
  if (fxParts.length){
    fxRaf = requestAnimationFrame(tickFx);
  } else {
    fx.clearRect(0,0,window.innerWidth, window.innerHeight);
    fxRaf = null;
  }
}

function laughAt(el){
  const rect = el.getBoundingClientRect();
  const words = ["HA-HA!", "AHA!", "HEHE!", "HA!", "OHO!"];
  const n = 7;

  for (let i=0;i<n;i++){
    const b = document.createElement('div');
    b.className = 'laughBubble';
    b.textContent = words[Math.floor(Math.random()*words.length)];

    const x = rect.left + rect.width*(0.15 + Math.random()*0.70) + (Math.random()*24 - 12);
    const y = rect.top  + rect.height*(0.10 + Math.random()*0.55) + (Math.random()*18 - 9);

    b.style.left = x + 'px';
    b.style.top  = y + 'px';
    b.style.transform = `rotate(${(-14 + Math.random()*28).toFixed(1)}deg) translateY(10px) scale(.98)`;

    document.body.appendChild(b);
    setTimeout(()=> b.remove(), 950);
  }
}
	function spawnBubbleAt(x, y, text){
  const b = document.createElement('div');
  b.className = 'laughBubble';
  b.textContent = text;

  b.style.left = x + 'px';
  b.style.top  = y + 'px';
  b.style.transform = `rotate(${(-14 + Math.random()*28).toFixed(1)}deg) translateY(10px) scale(.98)`;

  document.body.appendChild(b);
  setTimeout(()=> b.remove(), 950);
}

function randomLaughBurst(){
  const words = ["HA-HA!", "AHA!", "HEHE!", "HA!", "OHO!", "TAP THE CLOWN!"];
  const n = 7;
  for (let i=0;i<n;i++){
const x = 20 + Math.random() * (window.innerWidth  - 40);
const y = 20 + Math.random() * (window.innerHeight - 40);
spawnBubbleAt(x, y, words[Math.floor(Math.random()*words.length)]);
  }
}

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function canAutoLaugh(){
  const _pr = document.getElementById('pageRight');
  const rightActive = !!(_pr && _pr.classList.contains('active'));
  const _sm = document.getElementById('scanModal');
  const _tm = document.getElementById('tgModal');
  const modalOpen = !!((_sm && _sm.classList.contains('on')) || (_tm && _tm.classList.contains('on')));
  return !!rightActive && !modalOpen && !document.hidden;
}

(function autoLaughLoop(){
  if (reduceMotion) return;
  const delay = 3000 + Math.random()*2000;
  setTimeout(() => {
if (canAutoLaugh()) randomLaughBurst();
autoLaughLoop();
  }, delay);
})();

const clownOverlay = $('#clownOverlay');
async function clownEntrance(){
  clownOverlay.classList.add('on');
  boomConfetti(1.2);
  await sleep(2800);
  clownOverlay.classList.remove('on');

  const clownHero = $('#clownHero');
  clownHero.classList.remove('shake');
  void clownHero.offsetWidth;
  clownHero.classList.add('shake');
}

function openMaps(address){
  const fallback = CONFIG.DEFAULT_MAPS_QUERY;
  const query = (address && address.trim()) ? address.trim() : fallback;
  const url = 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(query);
  const w = window.open(url, '_blank', 'noopener,noreferrer');
  if (!w) window.location.href = url;
}

const tgModal = $('#tgModal');
const tgClose = $('#tgClose');
const tgOpen = $('#tgOpen');
const tgCopy = $('#tgCopy');
const tgCurrentMode = $('#tgCurrentMode');

function openChatLink(){
  const url = String(CONFIG.DRESSCODE_CHAT_URL || '').trim();
  if (!url) return;
  const w = window.open(url, '_blank', 'noopener,noreferrer');
  if (!w) window.location.href = url;
}

async function copyTelegramLink(){
  const url = CONFIG.DRESSCODE_CHAT_URL;
  try{
    if (!url) throw new Error('no-url');
    await navigator.clipboard.writeText(url);
    tgCopy.textContent = 'Copied';
    setTimeout(()=> tgCopy.textContent = 'Copy link', 1100);
  } catch {
    prompt('Copy link:', url);
  }
}

function showTgModal(currentModeText){
const url = String(CONFIG.DRESSCODE_CHAT_URL || '').trim();
tgOpen.disabled = !url;
tgCopy.disabled = !url;
tgOpen.style.opacity = url ? '1' : '0.5';
tgCopy.style.opacity = url ? '1' : '0.5';
tgOpen.textContent = url ? 'Open link' : 'Link not configured';
tgCopy.textContent = 'Copy link';
  tgCurrentMode.textContent = currentModeText || '';
  tgModal.classList.add('on');
  tgModal.setAttribute('aria-hidden', 'false');
}

function closeTgModal(){
  tgModal.classList.remove('on');
  tgModal.setAttribute('aria-hidden', 'true');
}

tgClose.addEventListener('click', closeTgModal);
tgModal.addEventListener('click', (e)=>{ if (e.target === tgModal) closeTgModal(); });
tgOpen.addEventListener('click', openChatLink);
tgCopy.addEventListener('click', copyTelegramLink);

const scanModal = $('#scanModal');
const scanClose = $('#scanClose');
const scanTicketHost = $('#scanTicket');
const scanStatus = $('#scanStatus');
const scanStage = $('#scanStage');

let scanTimer = null;

function fitScanTicket(){
  const ticketEl = scanTicketHost.querySelector('.bigTicket');
  if (!ticketEl) return;

  document.documentElement.style.setProperty('--scanScale', '1');

  requestAnimationFrame(()=>{
    const stageRect = scanStage.getBoundingClientRect();
    const ticketRect = ticketEl.getBoundingClientRect();

    const availW = stageRect.width - 28;
    const availH = stageRect.height - 86;

    const scaleW = availW / ticketRect.width;
    const scaleH = availH / ticketRect.height;

    let scale = Math.min(scaleW, scaleH);

    scale = Math.min(scale, 1.08);

    scale = Math.max(0.72, scale);

    document.documentElement.style.setProperty('--scanScale', String(scale.toFixed(3)));
  });
}

function decorateCloneUsed(clone){
  clone.classList.add('used');
  clone.classList.remove('tearNow');
}

async function tearClone(clone){
  clone.classList.add('tearNow');
  await sleep(900);
  clone.classList.add('used');
  clone.classList.remove('tearNow');
}

function openScanner(source='ticket'){
  scanModal.classList.toggle('from-cover', source === 'cover');

  scanTicketHost.innerHTML = '';
  const clone = $('#bigTicket').cloneNode(true);
  clone.id = 'bigTicketClone';
  clone.style.cursor = 'default';
  clone.style.margin = '0 auto';

  const hint = clone.querySelector('.ticketHint');
  if (hint) hint.remove();

  clone.querySelectorAll('[id]').forEach(el => el.removeAttribute('id'));
scanTicketHost.appendChild(clone);

  fitScanTicket();

  if (scanTimer) clearTimeout(scanTimer);
  scanTimer = null;

  scanModal.classList.add('on');
  scanModal.setAttribute('aria-hidden', 'false');

  if (ticketUsed){
    decorateCloneUsed(clone);
    scanStatus.innerHTML = 'Ticket already used<small>re-entry disabled</small>';
    return;
  }

  scanStatus.innerHTML = 'Scanning…<small>bring the ticket closer (just kidding)</small>';

  scanTimer = setTimeout(async ()=>{
    scanStatus.innerHTML = 'Ticket accepted<small>enjoy the show</small>';
    boomConfetti(0.9);

    await tearClone(clone);
    markTicketUsed();
  }, 2700);
}

function closeScanner(){
  scanModal.classList.remove('on');
  scanModal.setAttribute('aria-hidden', 'true');
  if (scanTimer) clearTimeout(scanTimer);
  scanTimer = null;
}

scanClose.addEventListener('click', closeScanner);
scanModal.addEventListener('click', (e)=>{
  if (e.target === scanModal) closeScanner();
});
window.addEventListener('resize', ()=>{ if (scanModal.classList.contains('on')) fitScanTicket(); });

const enterPlaque = $('#enterPlaque');
const stubTicket = $('#stubTicket');
const bigTicket = $('#bigTicket');
const clownHero = $('#clownHero');
const giftBox = $('#giftBox');
const dressMode = $('#dressMode');

const badgeClown = $('#badgeClown');
const badgeLights = $('#badgeLights');
const badgeConfetti = $('#badgeConfetti');

$('#btnBoom').addEventListener('click', ()=> boomConfetti(1.0));

$('#btnShare').addEventListener('click', async ()=>{
  const url = location.href;
  try{
    if (!url) throw new Error('no-url');
    await navigator.clipboard.writeText(url);
    $('#btnShare').textContent = 'Link copied';
    setTimeout(()=> $('#btnShare').textContent = 'Copy link', 1200);
  } catch {
    prompt('Copy link:', url);
  }
});

async function enter(){
  await switchPage('right');
  boomConfetti(1.05);
}
enterPlaque.addEventListener('click', enter);
enterPlaque.addEventListener('keydown', (e)=>{ if(e.key === 'Enter' || e.key === ' ') enter(); });

stubTicket.addEventListener('click', ()=> {
  openScanner('cover');
});
bigTicket.addEventListener('click', ()=> {
  openScanner('ticket');
});
const _btnScan = $('#btnScan');
if (_btnScan) _btnScan.addEventListener('click', ()=> openScanner('ticket'));

function clownShow(){
  clownHero.classList.remove('shake');
  void clownHero.offsetWidth;
  clownHero.classList.add('shake');
  laughAt(clownHero);
  boomConfetti(0.85);
}
clownHero.addEventListener('click', clownShow);

function openWishPicks(){
  if (giftBox) giftBox.classList.remove('giftShake');
  if (giftBox) void giftBox.offsetWidth;
  if (giftBox) giftBox.classList.add('giftShake');

  const url = CONFIG.GIFT_URL;
  const w = window.open(url, '_blank', 'noopener,noreferrer');
  if (!w) window.location.href = url;
}
if (giftBox) giftBox.addEventListener('click', openWishPicks);
if (giftBox) giftBox.addEventListener('keydown', (e)=>{
  if (e.key === 'Enter' || e.key === ' '){
    e.preventDefault();
    openWishPicks();
  }
});

if (badgeClown) badgeClown.addEventListener('click', async ()=>{
  await switchPage('right');
  setTimeout(clownShow, 120);
});
if (badgeLights) badgeLights.addEventListener('click', ()=>{
  boomConfetti(0.65);
  document.body.style.filter = 'brightness(1.08) saturate(1.12)';
  setTimeout(()=> document.body.style.filter = '', 220);
});
if (badgeConfetti) badgeConfetti.addEventListener('click', ()=> boomConfetti(1.05));

const dressModes = [
  'CIRCUS GLAMOUR • SPARKLE • DRAMA',
  'DARK CIRCUS • BLACK + RED',
  'SHINE • ANY STYLE, WITH A TWIST'
];
let dressIdx = 0;
function nextDress(){
  dressIdx = (dressIdx + 1) % dressModes.length;
  dressMode.textContent = dressModes[dressIdx];
  boomConfetti(0.55);
}
dressMode.addEventListener('click', (e)=>{
  e.stopPropagation();
  nextDress();
  showTgModal(dressMode.textContent);
});

$('#placeField').addEventListener('click', (e)=>{
  const addr = $('#fPlace').textContent || '';
  openMaps(addr);
});
$('#placeField').addEventListener('keydown', (e)=>{
  if (e.key === 'Enter' || e.key === ' '){
    e.preventDefault();
    const addr = $('#fPlace').textContent || '';
    openMaps(addr);
  }
});

const _btnBack = $('#btnBack');
if (_btnBack) _btnBack.addEventListener('click', ()=> switchPage('left'));

window.addEventListener('keydown', (e)=>{
  if (e.key === 'Escape') {
    closeScanner();
    closeTgModal();
  }
});

const productImages = [
  'assets/product-1.png',
  'assets/product-2.png',
  'assets/product-3.png',
  'assets/product-4.png',
  'assets/product-5.png',
  'assets/product-6.png'
];

const productCard = document.getElementById('productCard');
const productImg  = document.getElementById('productImg');

const nextFrame = () => new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)));

function waitImage(src, timeoutMs = 2500){
  return new Promise((resolve, reject) => {
const im = new Image();
let done = false;

const t = setTimeout(() => {
  if (done) return;
  done = true;
  reject(new Error('timeout'));
}, timeoutMs);

im.onload = () => {
  if (done) return;
  done = true;
  clearTimeout(t);
  resolve(true);
};

im.onerror = () => {
  if (done) return;
  done = true;
  clearTimeout(t);
  reject(new Error('error'));
};

im.src = src;
  });
}

function setCardTransform(xPercent, scale){
  productCard.style.transform = `translate(-50%, -50%) translateX(${xPercent}%) scale(${scale})`;
}

async function runProductCarousel(images){
  if (!productCard || !productImg || !(images && images.length)) return;

  if (window.__productCarouselRunning) return;
  window.__productCarouselRunning = true;

  let i = 0;

  while(true){
const src = images[i];

try{
  await waitImage(src);
} catch (e){
  i = (i + 1) % images.length;
  continue;
}

productImg.src = src;

productCard.style.transition = 'none';
productCard.style.opacity = '0';
setCardTransform(140, 0.96);
await nextFrame();

productCard.style.transition =
  'transform 420ms cubic-bezier(.15,.85,.25,1), opacity 220ms ease';
productCard.style.opacity = '1';
setCardTransform(18, 1.00);
await sleep(320);

productCard.style.transition = 'transform 520ms cubic-bezier(.10,.95,.20,1)';
setCardTransform(0, 1.02);
await sleep(520);

await sleep(2000);

productCard.style.transition = 'transform 260ms ease-out';
setCardTransform(-14, 1.00);
await sleep(220);

productCard.style.transition =
  'transform 420ms cubic-bezier(.40,0,.90,.25), opacity 360ms ease';
setCardTransform(-160, 0.96);
productCard.style.opacity = '0';
await sleep(440);

i = (i + 1) % images.length;
await sleep(200);
  }
}

runProductCarousel(productImages);
function rand(min, max){
  return Math.floor(min + Math.random() * (max - min + 1));
}

(function giftLoop(){
  if (!giftBox) return;

  const delay = rand(3000, 7000);
  setTimeout(() => {
giftBox.classList.remove('giftShake');
giftBox.classList.add('giftShake');

setTimeout(() => giftBox.classList.remove('giftShake'), 650);
giftLoop();
  }, delay);
})();
