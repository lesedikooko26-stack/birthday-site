/* ============================================
   BIRTHDAY SITE — main.js
   ============================================ */

// ── State ──
let currentSlide = 0;
const totalSlides = 4;
let candlesBlown = false;
let openedCount  = 0;

// ── Gift messages revealed when each present is opened ──
const giftMessages = [
  { emoji: "💌", text: "A promise to always be by your side" },
  { emoji: "⭐", text: "Every star in the sky, just for you"  },
  { emoji: "🌹", text: "Hope we reach a new level of care for one another"      },
];

// ── Init ──
document.addEventListener("DOMContentLoaded", () => {
  spawnBgHearts();
  updateSlider();
  fireConfetti();
});

/* ================================================
   Background floating hearts
   ================================================ */
function spawnBgHearts() {
  const container = document.getElementById("bgHearts");
  const symbols = ["💕","🩷","❤️","💗","💞","🌸","✨"];
  for (let i = 0; i < 20; i++) {
    const el = document.createElement("span");
    el.className = "bg-heart";
    el.textContent = symbols[Math.floor(Math.random() * symbols.length)];
    el.style.left             = Math.random() * 100 + "vw";
    el.style.animationDuration = (7 + Math.random() * 10) + "s";
    el.style.animationDelay   = (Math.random() * 8) + "s";
    el.style.fontSize         = (0.8 + Math.random() * 1.2) + "rem";
    container.appendChild(el);
  }
}

/* ================================================
   Confetti burst
   ================================================ */
function fireConfetti() {
  const container = document.getElementById("confetti-container");
  const colors = ["#ff6b9d","#ffb3c6","#ffd6e0","#ff0055","#fff","#ffe4ed","#c0396e","#ffa0c0"];
  for (let i = 0; i < 65; i++) {
    const p = document.createElement("div");
    p.className = "confetti-piece";
    p.style.left             = Math.random() * 100 + "vw";
    p.style.top              = "-10px";
    p.style.background       = colors[Math.floor(Math.random() * colors.length)];
    p.style.width            = (6 + Math.random() * 10) + "px";
    p.style.height           = (6 + Math.random() * 10) + "px";
    p.style.borderRadius     = Math.random() > 0.5 ? "50%" : "2px";
    p.style.animationDelay   = (Math.random() * 1.6) + "s";
    p.style.animationDuration = (2 + Math.random() * 2) + "s";
    container.appendChild(p);
    setTimeout(() => p.remove(), 5000);
  }
}

/* ================================================
   Slider — ONLY "Click me!" buttons advance slides.
   No arrows, no dot clicks, no swipe, no keyboard.
   ================================================ */
function updateSlider() {
  const slider = document.getElementById("slider");
  slider.style.transform = `translateX(-${currentSlide * 100}%)`;

  // Update indicator dots (display only)
  document.querySelectorAll(".dot").forEach((d, i) => {
    d.classList.toggle("active", i === currentSlide);
  });

  // Confetti when arriving at cake slide
  if (currentSlide === 1) setTimeout(fireConfetti, 350);
}

function nextSlide() {
  // Start music on first interaction
  const music = document.getElementById("bgMusic");
  if (music && music.paused) {
    music.volume = 0.5;
    music.play().catch(() => {});
  }

  if (currentSlide < totalSlides - 1) {
    currentSlide++;
    updateSlider();
  }
}

function restartSlides() {
   const music = document.getElementById("bgMusic");
   if (music) { music.pause(); music.currentTime = 0; }
   
  currentSlide = 0;
  updateSlider();

  // Reset candles
  candlesBlown = false;
  document.querySelectorAll(".candle").forEach(c => c.classList.remove("blown"));
  const blowBtn = document.getElementById("blowBtn");
  if (blowBtn) { blowBtn.textContent = "🎉 Blow candles!"; blowBtn.classList.remove("done"); }

  // Reset presents
  openedCount = 0;
  document.querySelectorAll(".present-wrapper").forEach((wrapper, i) => {
    const box    = wrapper.querySelector(".present-box");
    const closed = box.querySelector(".present-closed");
    const open   = box.querySelector(".present-open");
    closed.style.display    = "";
    closed.style.transform  = "";
    closed.style.opacity    = "";
    open.classList.add("hidden");
  });
  document.getElementById("giftMessages").textContent = "";
  const nextBtn = document.getElementById("slide3Next");
  if (nextBtn) nextBtn.style.display = "none";

  fireConfetti();
}

/* ================================================
   Blow candles
   ================================================ */
function blowCandles() {
  if (candlesBlown) return;
  candlesBlown = true;
  const candles = document.querySelectorAll(".candle");
  candles.forEach((c, i) => setTimeout(() => c.classList.add("blown"), i * 260));
  const btn = document.getElementById("blowBtn");
  setTimeout(() => {
    btn.textContent = "🎊 Happy Birthday!! 🎊";
    btn.classList.add("done");
    fireConfetti();
  }, 950);
}

/* ================================================
   Open presents
   ================================================ */
function openPresent(box, index) {
  const closed = box.querySelector(".present-closed");
  const open   = box.querySelector(".present-open");
  if (!open.classList.contains("hidden")) return; // already opened

  // Pop animation
  closed.style.transform = "scale(1.35) rotate(10deg)";
  closed.style.opacity   = "0.6";
  setTimeout(() => {
    closed.style.display = "none";
    open.classList.remove("hidden");

    const reveal = box.querySelector(".gift-reveal");
    const g = giftMessages[index];
    reveal.innerHTML = `<div style="font-size:2rem;line-height:1.1">${g.emoji}</div><div>${g.text}</div>`;

    openedCount++;
    fireConfetti();

    const msgArea = document.getElementById("giftMessages");
    if (openedCount === 3) {
      msgArea.textContent = "🎉 You opened all your presents! 💕";
      // Show the Click me button to advance
      const nextBtn = document.getElementById("slide3Next");
      if (nextBtn) {
        nextBtn.style.display = "inline-block";
        nextBtn.style.animation = "fadeIn 0.5s ease";
      }
    } else {
      msgArea.textContent = `(${openedCount}/3 opened — keep going! 🎁)`;
    }
  }, 320);
}

/* ================================================
   Photo lightbox
   ================================================ */
function openPhoto(slot) {
  const img = slot.querySelector(".memory-photo");
  if (!img || !img.src || img.naturalWidth === 0) return;
  document.getElementById("lightboxImg").src = img.src;
  document.getElementById("lightbox").classList.add("open");
}
function closeLightbox() {
  document.getElementById("lightbox").classList.remove("open");
}
