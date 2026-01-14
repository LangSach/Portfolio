/* ===============================
   FETHER.JS - CLEAN & UNIFIED
   =============================== */

document.addEventListener("DOMContentLoaded", () => {

  /* ========= AOS ========= */
  if (window.AOS) {
    AOS.init({ offset: 120, duration: 800, once: false, mirror: true });
  }

  /* ========= TYPED ========= */
  if (window.Typed && document.querySelector(".typing-text")) {
    new Typed(".typing-text", {
      strings: ["Kỹ sư Phần mềm", "Nhà thiết kế UI/UX", "Lập trình viên Full Stack"],
      typeSpeed: 80,
      backSpeed: 50,
      loop: true
    });
  }

  /* ========= AUDIO ========= */
  const music = document.getElementById("bg-music");
  let muted = localStorage.getItem("siteMuted") === "true";
  let unlocked = false;

  if (music) {
    music.volume = 0.4;
    music.loop = true;
  }

  function unlockMusic() {
    if (!music || muted || unlocked) return;
    music.play()
      .then(() => unlocked = true)
      .catch(() => {});
  }

  document.addEventListener("click", unlockMusic, { once: true });

  function setMute(val) {
    muted = val;
    localStorage.setItem("siteMuted", muted);
    if (!music) return;
    muted ? music.pause() : unlockMusic();
  }

  /* ========= CLICK SOUND ========= */
  function playClick() {
    if (muted) return;
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.frequency.value = 600;
      g.gain.value = 0.08;
      o.connect(g);
      g.connect(ctx.destination);
      o.start();
      o.stop(ctx.currentTime + 0.15);
      setTimeout(() => ctx.close(), 200);
    } catch {}
  }

  /* ========= SKILL OBSERVER ========= */
  const skills = document.querySelector(".skills-container");
  if (skills) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(e => {
        e.target.querySelectorAll(".skill-bar-progress")
          .forEach(bar => bar.style.width = e.isIntersecting ? bar.dataset.percent + "%" : "0%");
      });
    }, { threshold: 0.2 });
    observer.observe(skills);
  }

  /* ========= RADAR CHART ========= */
  let radarChart;
  const radarCanvas = document.getElementById("radarChart");
  if (window.Chart && radarCanvas) {
    radarChart = new Chart(radarCanvas, {
      type: "radar",
      data: {
        labels: ["Frontend", "Backend", "Design", "Database", "DEV", "Soft Skills"],
        datasets: [{
          data: [92, 88, 85, 80, 75, 90],
          backgroundColor: "rgba(157,78,221,.2)",
          borderColor: "#b04cff",
          borderWidth: 3,
          pointBackgroundColor: "#c77dff"
        }]
      },
      options: {
        plugins: { legend: { display: false } },
        scales: { r: { suggestedMin: 0, suggestedMax: 100, ticks: { display: false } } }
      }
    });
  }

  /* ========= MENU ========= */
  const menuIcon = document.getElementById("menu-icon");
  const navbar = document.querySelector(".navbar");
  if (menuIcon && navbar) {
    menuIcon.onclick = () => {
      menuIcon.classList.toggle("fa-x");
      navbar.classList.toggle("active");
    };
  }

  /* ========= SCROLL ========= */
  window.addEventListener("scroll", () => {
    const header = document.getElementById("header");
    if (header) header.classList.toggle("scrolled", window.scrollY > 50);
  });

  /* ========= SETTINGS PANEL ========= */
  const panel = document.getElementById("settings-panel");
  const toggle = document.getElementById("settings-toggle");
  const muteToggle = document.getElementById("mute-toggle");

  if (toggle && panel) {
    toggle.onclick = () => { panel.classList.toggle("active"); playClick(); };
    document.getElementById("settings-close")?.addEventListener("click", () => panel.classList.remove("active"));
  }

  if (muteToggle) {
    muteToggle.classList.toggle("on", muted);
    muteToggle.onclick = () => {
      setMute(!muted);
      muteToggle.classList.toggle("on", muted);
      playClick();
    };
  }

  /* ========= THEME ========= */
  document.querySelectorAll(".theme-select-btn").forEach(btn => {
    btn.onclick = () => {
      document.documentElement.style.setProperty("--accent", btn.dataset.theme === "wine" ? "#8c1b1b" : "#b04cff");
      localStorage.setItem("siteTheme", btn.dataset.theme);
      radarChart?.update();
      playClick();
    };
  });

  /* ========= CURSOR FEATHER ========= */
  const canvas = document.getElementById("raven-canvas");
  if (canvas) {
    const ctx = canvas.getContext("2d");
    let particles = [];
    canvas.width = innerWidth; canvas.height = innerHeight;

    window.addEventListener("mousemove", e => {
      if (particles.length < 80) particles.push({ x: e.clientX, y: e.clientY, life: 1 });
    });

    (function animate() {
      ctx.clearRect(0,0,canvas.width,canvas.height);
      particles.forEach((p,i) => {
        p.life -= 0.02;
        ctx.globalAlpha = p.life;
        ctx.fillStyle = "#111";
        ctx.beginPath();
        ctx.ellipse(p.x, p.y, 3, 10, 0, 0, Math.PI*2);
        ctx.fill();
        if (p.life <= 0) particles.splice(i,1);
      });
      requestAnimationFrame(animate);
    })();
  }

});

