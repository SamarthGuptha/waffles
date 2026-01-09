document.addEventListener('DOMContentLoaded', () => {
    const isIndexPage = document.getElementById('shot-clock') !== null;
    const isStatsPage = document.getElementById('stat-body') !== null;
    if (isIndexPage) {
        const clockDisplay = document.getElementById('shot-clock');
        const statusDisplay = document.getElementById('game-status');
        const startBtn = document.getElementById('start-btn');
        const shootBtn = document.getElementById('shoot-btn');
        const ringsDisplay = document.getElementById('rings-count');

        let timeLeft = 3.00;
        let timerId = null;
        let streak = 0;

        startBtn.addEventListener('click', () => {
            timeLeft = 3.00;
            statusDisplay.innerText = "Find your rhythm...";
            statusDisplay.style.color = "white";
            startBtn.style.display = 'none';
            shootBtn.style.display = 'inline-block';
            clockDisplay.classList.add('active-clock');
            clockDisplay.style.color = "#ff4d4d";

            timerId = setInterval(() => {
                timeLeft -= 0.01;
                clockDisplay.innerText = timeLeft.toFixed(2);
                if (timeLeft < 1.0) {
                    clockDisplay.style.transform = `scale(${1 + (1 - timeLeft) * 0.2})`;
                }
                if (timeLeft <= 0) {
                    clearInterval(timerId);
                    clockDisplay.innerText = "0.00";
                    clockDisplay.style.transform = "scale(1)";
                    streak = 0;
                    showFeedback("💔 BUZZER BEATER!", "#ff4d4d");
                    statusDisplay.innerText = "Too slow! The defense caught up.";
                    resetGame();
                }
            }, 10);
        });

        shootBtn.addEventListener('click', () => {
            clearInterval(timerId);
            clockDisplay.classList.remove('active-clock');
            clockDisplay.style.transform = "scale(1)";
            if (timeLeft > 0.15 && timeLeft < 0.45) {
                streak++;
                const isHeat = streak >= 3;
                const msg = isHeat ? `🔥 ON FIRE! x${streak}` : "💦 SPLASHH!!!!";
                const color = isHeat ? "#ff8c00" : "#FFC72C";

                showFeedback(msg, color);
                statusDisplay.innerText = `Pure gold! Streak: ${streak}`;
                ringsDisplay.innerText = parseInt(ringsDisplay.innerText) + 1;

                // Visual reward for high streaks
                if (isHeat) ringsDisplay.style.textShadow = "0 0 20px #ff8c00";
            } else {
                streak = 0;
                showFeedback("🧱 CLANKK!!", "#666");
                statusDisplay.innerText = "Off the back iron. Try again!";
                ringsDisplay.style.textShadow = "none";
            }
            resetGame();
        });

        function resetGame() {
            shootBtn.style.display = 'none';
            startBtn.style.display = 'inline-block';
            startBtn.innerText = streak > 0 ? "Keep Shooting" : "Try Again";
        }
        function showFeedback(text, color) {
            const toast = document.createElement('div');
            Object.assign(toast.style, {
                position: 'fixed',
                top: '40%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                fontSize: '3rem',
                fontWeight: '900',
                color: color,
                textShadow: '0 0 20px rgba(0,0,0,0.5)',
                zIndex: '2000',
                pointerEvents: 'none',
                transition: 'all 0.5s ease-out'
            });
            toast.innerText = text;
            document.body.appendChild(toast);

            setTimeout(() => {
                toast.style.transform = 'translate(-50%, -150%) scale(1.5)';
                toast.style.opacity = '0';
                setTimeout(() => document.body.removeChild(toast), 500);
            }, 50);
        }
    }
    if (isStatsPage) {
        const themeBtn = document.getElementById('theme-toggle');
        const tableBody = document.getElementById('stat-body');

        themeBtn.addEventListener('click', () => {
            document.body.classList.toggle('splash-mode');
            themeBtn.innerText = document.body.classList.contains('splash-mode')
                ? "Back to Oracle Arena"
                : "Toggle 'Splash Mode'";
        });
        const extraData = [
            { cat: "Assists", val: "6.4", yr: "Career" },
            { cat: "Steals", val: "2.1", yr: "2015-16" }
        ];

        extraData.forEach(item => {
            const row = document.createElement('tr');
            row.innerHTML = `<td>${item.cat}</td><td>${item.val}</td><td>${item.yr}</td>`;
            tableBody.appendChild(row);
        });
    }
});