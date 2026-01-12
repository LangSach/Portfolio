 // Initialize AOS
        AOS.init({ 
            offset: 120, 
            duration: 800, 
            once: false,
            mirror: true 
        });

        // Initialize Typed.js
        const typed = new Typed(".typing-text", {
            strings: ["Kỹ sư Phần mềm", "Nhà thiết kế UI/UX", "Lập trình viên Full Stack"],
            typeSpeed: 80,
            backSpeed: 50,
            loop: true
        });

        // Skill Bar Animation Logic
        const observerOptions = { threshold: 0.2 };
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const bars = entry.target.querySelectorAll('.skill-bar-progress');
                    bars.forEach(bar => {
                        const target = bar.getAttribute('data-percent');
                        bar.style.width = target + '%';
                    });
                    if (radarChart) {
                        radarChart.update();
                    }
                } else {
                    const bars = entry.target.querySelectorAll('.skill-bar-progress');
                    bars.forEach(bar => { bar.style.width = '0%'; });
                }
            });
        }, observerOptions);

        observer.observe(document.querySelector('.skills-container'));

        // RADAR CHART CONFIGURATION (Updated for Purple theme)
        const ctx = document.getElementById('radarChart').getContext('2d');
        const radarChart = new Chart(ctx, {
            type: 'radar',
            data: {
                labels: ['Frontend', 'Backend', 'Design', 'Database', 'DEV', 'Soft Skills'],
                datasets: [{
                    label: 'Mức độ thông thạo',
                    data: [92, 88, 85, 80, 75, 90],
                    backgroundColor: 'rgba(157, 78, 221, 0.2)',
                    borderColor: '#b04cff',
                    borderWidth: 3,
                    pointBackgroundColor: '#c77dff',
                    pointBorderColor: '#fff',
                    pointHoverBackgroundColor: '#fff',
                    pointHoverBorderColor: '#b04cff',
                    pointRadius: 4
                }]
            },
            options: {
                scales: {
                    r: {
                        angleLines: { color: 'rgba(157, 78, 221, 0.2)' },
                        grid: { color: 'rgba(157, 78, 221, 0.2)' },
                        pointLabels: {
                            color: '#ffffff',
                            font: { size: 14, family: 'Poppins' }
                        },
                        ticks: {
                            display: false,
                            stepSize: 20
                        },
                        suggestedMin: 0,
                        suggestedMax: 100
                    }
                },
                plugins: {
                    legend: { display: false }
                },
                responsive: true,
                maintainAspectRatio: true
            }
        });

        // Mobile Menu Toggle
        const menuIcon = document.getElementById('menu-icon');
        const navbar = document.querySelector('.navbar');

        menuIcon.onclick = () => {
            menuIcon.classList.toggle('fa-x');
            navbar.classList.toggle('active');
        };

        // Scroll Logic
        window.onscroll = () => {
            const header = document.getElementById('header');
            header.classList.toggle('scrolled', window.scrollY > 50);

            const sections = document.querySelectorAll('section');
            const navLinks = document.querySelectorAll('nav a');

            sections.forEach(sec => {
                let top = window.scrollY;
                let offset = sec.offsetTop - 150;
                let height = sec.offsetHeight;
                let id = sec.getAttribute('id');

                if(top >= offset && top < offset + height) {
                    navLinks.forEach(links => {
                        links.classList.remove('active');
                        document.querySelector('nav a[href*=' + id + ']').classList.add('active');
                    });
                }
            });
        };

        // Form Submission Simulation
        document.getElementById('contact-form').addEventListener('submit', function(e) {
            e.preventDefault();
            const btn = this.querySelector('button');
            const originalContent = btn.innerHTML;
            btn.innerHTML = 'Đang gửi...';
            btn.disabled = true;
            
            setTimeout(() => {
                btn.innerHTML = '<i class="fa-solid fa-check"></i> Đã gửi thành công!';
                btn.style.background = '#6a1b9a';
                btn.style.borderColor = '#6a1b9a';
                this.reset();
                setTimeout(() => {
                    btn.innerHTML = originalContent;
                    btn.disabled = false;
                    btn.style.background = 'linear-gradient(90deg, var(--accent), var(--accent-light))';
                    btn.style.borderColor = 'rgba(176,76,255,0.95)';
                }, 3000);
            }, 1500);
        });

        // SETTINGS PANEL + THEME + SOUND
        (function(){
            const toggle = document.getElementById('settings-toggle');
            const panel = document.getElementById('settings-panel');
            const muteToggle = document.getElementById('mute-toggle');
            const themeButtons = document.querySelectorAll('.theme-select-btn');
            let muted = localStorage.getItem('siteMuted') === 'true';
            const music = document.getElementById('bg-music');
            music.volume = 0.4;

            function setMute(val){
    muted = !!val;
    muteToggle.classList.toggle('on', muted);
    muteToggle.setAttribute('aria-checked', muted);
    localStorage.setItem('siteMuted', muted);

    // THÊM LOGIC ĐIỀU KHIỂN NHẠC TẠI ĐÂY
    const music = document.getElementById('bg-music');
    if (music) {
        if (muted) {
            music.pause(); // Nếu bật Mute thì dừng nhạc
        } else {
            // Nếu tắt Mute thì phát nhạc (chỉ khi người dùng đã tương tác)
            music.play().catch(err => console.log("Chờ tương tác để phát lại nhạc..."));
        }
    }
}
            
            function playClick() {
    if (muted) return; // Nếu đang mute thì thoát luôn
    try {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        const ctx = new AudioContext();
        if (ctx.state === 'suspended') ctx.resume();

        const o = ctx.createOscillator();
        const g = ctx.createGain();
        o.type = 'sine';
        o.frequency.setValueAtTime(600, ctx.currentTime);
        g.gain.setValueAtTime(0.0001, ctx.currentTime);
        g.gain.exponentialRampToValueAtTime(0.08, ctx.currentTime + 0.01);
        g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.16);
        o.connect(g); g.connect(ctx.destination);
        o.start(); o.stop(ctx.currentTime + 0.18);
        setTimeout(() => { if (ctx.state !== 'closed') ctx.close(); }, 200);
    } catch(e) { console.error("Audio Error:", e); }
}

// Logic điều khiển nhạc nền
function playMusic() {
    const music = document.getElementById('bg-music');
    // Chỉ phát nếu KHÔNG bị mute
    if (!muted) {
        music.play().then(() => {
            document.removeEventListener('click', playMusic);
            document.removeEventListener('mousemove', playMusic);
        }).catch(error => {
            console.log("Trình duyệt chặn, chờ tương tác...");
        });
    }
}

document.addEventListener('click', playMusic);
document.addEventListener('mousemove', playMusic);

document.addEventListener('click', playMusic);
document.addEventListener('mousemove', playMusic);

// SETTINGS PANEL + THEME
(function(){
    const toggle = document.getElementById('settings-toggle');
    const panel = document.getElementById('settings-panel');
    const muteToggle = document.getElementById('mute-toggle');
    const themeButtons = document.querySelectorAll('.theme-select-btn');

    function setMute(val){
        muted = !!val;
        muteToggle.classList.toggle('on', muted);
        muteToggle.setAttribute('aria-checked', muted);
        localStorage.setItem('siteMuted', muted);
        
        // CẬP NHẬT NHẠC NỀN KHI BẤM NÚT
        if (muted) {
            music.pause();
        } else {
            music.play().catch(() => {}); // Chơi nhạc lại nếu bỏ mute
        }
    }

    // Initialize mute state
    setMute(muted);

    // Mute click event
    muteToggle.addEventListener('click', () => {
        setMute(!muted);
        playClick(); // Vẫn phát tiếng click cuối cùng trước khi im lặng hoặc sau khi bật
    });

    // Các logic khác (Theme, Open/Close Panel...) giữ nguyên nhưng gọi playClick() đã đưa ra ngoài
    toggle.addEventListener('click', ()=> {
        panel.classList.toggle('active');
        playClick();
    });
    
    document.getElementById('settings-close').addEventListener('click', () => {
        panel.classList.remove('active');
        playClick();
    });
    
})
    

            function applyTheme(name){
                if(name === 'wine'){
                    document.documentElement.style.setProperty('--accent','#8c1b1b');
                    document.documentElement.style.setProperty('--accent-light','#c86565');
                    document.documentElement.style.setProperty('--accent-glow','rgba(140,27,27,0.35)');
                    document.documentElement.style.setProperty('--glass','rgba(140,27,27,0.04)');
                } else {
                    document.documentElement.style.setProperty('--accent','#b04cff');
                    document.documentElement.style.setProperty('--accent-light','#d89bff');
                    document.documentElement.style.setProperty('--accent-glow','rgba(176,76,255,0.45)');
                    document.documentElement.style.setProperty('--glass','rgba(176,76,255,0.05)');
                }
                if(window.radarChart && radarChart.data && radarChart.data.datasets){
                    const accent = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim();
                    radarChart.data.datasets[0].borderColor = accent;
                    radarChart.data.datasets[0].pointHoverBorderColor = accent;
                    radarChart.update();
                }
                localStorage.setItem('siteTheme', name);
            }

            // open/close panel
            toggle.addEventListener('click', ()=> {
                const isOpen = panel.classList.toggle('active');
                toggle.setAttribute('aria-expanded', isOpen);
                panel.setAttribute('aria-hidden', !isOpen);
                if(isOpen){ document.getElementById('settings-close').focus(); }
                playClick();
            });

            // close button
            const closeBtn = document.getElementById('settings-close');
            closeBtn.addEventListener('click', (e) => { panel.classList.remove('active'); toggle.setAttribute('aria-expanded','false'); panel.setAttribute('aria-hidden','true'); toggle.focus(); playClick(); });

            // click outside to close
            document.addEventListener('click', (e)=>{
                if(!panel.contains(e.target) && !toggle.contains(e.target)){
                    panel.classList.remove('active');
                    toggle.setAttribute('aria-expanded','false');
                    panel.setAttribute('aria-hidden','true');
                }
            });

            // keyboard: Esc to close panel when open
            document.addEventListener('keydown', (e)=>{ if(e.key === 'Escape'){ panel.classList.remove('active'); toggle.setAttribute('aria-expanded','false'); panel.setAttribute('aria-hidden','true'); toggle.focus(); } });

            // theme buttons & clickable rows
            const themeRows = document.querySelectorAll('.theme-option');
            function setActiveThemeButton(theme){
                themeButtons.forEach(b=>{ 
                    const isActive = b.dataset.theme === theme;
                    b.classList.toggle('active', isActive);
                    b.setAttribute('aria-pressed', isActive);
                });
                themeRows.forEach(r => r.classList.toggle('active', r.dataset.theme === theme));
            }

            themeButtons.forEach(btn=>{
                btn.addEventListener('click', ()=>{
                    const t = btn.dataset.theme;
                    applyTheme(t);
                    setActiveThemeButton(t);
                    playClick();
                });
            });

            themeRows.forEach(row => {
                row.addEventListener('click', (e)=>{ 
                    const t = row.dataset.theme;
                    applyTheme(t); setActiveThemeButton(t); playClick();
                });
                row.addEventListener('keydown', (e)=>{ if(e.key === 'Enter' || e.key === ' ') { e.preventDefault(); row.click(); } });
            });

            // initialize active theme button on load
            setTimeout(()=>{ setActiveThemeButton(localStorage.getItem('siteTheme') || 'purple'); }, 20);

            function toggleMute(){ setMute(!muted); playClick(); }
            muteToggle.addEventListener('click', toggleMute);
            muteToggle.addEventListener('keydown', (e)=>{ if(e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggleMute(); } });

            // restore settings
            const savedTheme = localStorage.getItem('siteTheme') || 'purple';
            setTimeout(()=>{ applyTheme(savedTheme); }, 10);
            setMute(muted);
        })();
        const music = document.getElementById('bg-music');

// Thiết lập âm lượng (0.0 đến 1.0)
music.volume = 0.4; 

function playMusic() {
    music.play().then(() => {
        // Nhạc đã bắt đầu chạy, gỡ bỏ sự kiện để không chạy lại mỗi lần click
        document.removeEventListener('click', playMusic);
        document.removeEventListener('mousemove', playMusic);
    }).catch(error => {
        console.log("Trình duyệt đang chặn nhạc, chờ tương tác người dùng...");
    });
}

// Kích hoạt nhạc khi người dùng click hoặc di chuyển chuột lần đầu
document.addEventListener('click', playMusic);
document.addEventListener('mousemove', playMusic);
   
        (function() {
        const canvas = document.getElementById('raven-canvas');
        const ctx = canvas.getContext('2d');
        const cursorCore = document.getElementById('cursor-core');

        let particles = [];
        let mouse = { x: -100, y: -100 };
        let lastMouse = { x: -100, y: -100 };

        function resize() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }

        window.addEventListener('resize', resize);
        resize();

        window.addEventListener('mousemove', (e) => {
            mouse.x = e.clientX;
            mouse.y = e.clientY;
            
            cursorCore.style.left = `${mouse.x}px`;
            cursorCore.style.top = `${mouse.y}px`;

            const distance = Math.hypot(mouse.x - lastMouse.x, mouse.y - lastMouse.y);
            if (distance > 2) {
                createFeather(mouse.x, mouse.y);
                lastMouse.x = mouse.x;
                lastMouse.y = mouse.y;
            }
        });

        class Feather {
            constructor(x, y) {
                this.x = x;
                this.y = y;
                this.width = Math.random() * 4 + 2;
                this.length = Math.random() * 20 + 10;
                this.speedX = (Math.random() - 0.5) * 2;
                this.speedY = Math.random() * 1.5 + 0.5;
                this.rotation = Math.random() * Math.PI * 2;
                this.rotationSpeed = (Math.random() - 0.5) * 0.05;
                this.life = 1;
                this.decay = Math.random() * 0.01 + 0.005;
                const colors = ['#0a0a0a', '#020617', '#1e1b4b', '#0f172a'];
                this.color = colors[Math.floor(Math.random() * colors.length)];
            }

            update() {
                this.x += this.speedX;
                this.y += this.speedY;
                this.rotation += this.rotationSpeed;
                this.life -= this.decay;
            }

            draw() {
                ctx.save();
                ctx.translate(this.x, this.y);
                ctx.rotate(this.rotation);
                ctx.globalAlpha = Math.max(0, this.life);
                ctx.beginPath();
                ctx.fillStyle = this.color;
                ctx.shadowBlur = 5;
                ctx.shadowColor = 'rgba(0,0,0,0.5)';
                ctx.ellipse(0, 0, this.width, this.length, 0, 0, Math.PI * 2);
                ctx.fill();
                ctx.restore();
            }
        }

        function createFeather(x, y) {
            if (particles.length < 100) {
                particles.push(new Feather(x, y));
            }
        }

        function animate() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            for (let i = 0; i < particles.length; i++) {
                particles[i].update();
                particles[i].draw();
                if (particles[i].life <= 0) {
                    particles.splice(i, 1);
                    i--;
                }
            }
            requestAnimationFrame(animate);
        }

        // Hiệu ứng phóng to khi rê vào link/nút
        const targets = document.querySelectorAll('a, button');
        targets.forEach(t => {
            t.addEventListener('mouseenter', () => {
                cursorCore.style.transform = 'translate(-50%, -50%) scale(4)';
            });
            t.addEventListener('mouseleave', () => {
                cursorCore.style.transform = 'translate(-50%, -50%) scale(1)';
            });
        });

        animate();
    })();