const g = 9.8; // Aceleração gravitacional (m/s²)

document.getElementById("simulateButton").addEventListener("click", simulate);

function simulate() {
    const canvas = document.getElementById("simulation");
    const ctx = canvas.getContext("2d");
    const d = parseFloat(document.getElementById("distance").value);
    const h = parseFloat(document.getElementById("height").value);
    const v0 = parseFloat(document.getElementById("velocity").value);
    const angleDegrees = parseFloat(document.getElementById("angle").value);
    const angle = (angleDegrees * Math.PI) / 180; // Converter para radianos

    // Tempo para atingir o macaco
    const timeToHit = d / (v0 * Math.cos(angle));
    const bulletHeightAtImpact = v0 * Math.sin(angle) * timeToHit - 0.5 * g * timeToHit ** 2;

    // Verificar se a bala atinge o macaco
    const macacoHeightAtImpact = h - 0.5 * g * timeToHit ** 2;
    const hits = Math.abs(bulletHeightAtImpact - macacoHeightAtImpact) < 1; // Tolerância de 1 pixel

    // Exibir resultado
    const result = document.getElementById("result");
    result.innerHTML = `
        <strong>Resultados:</strong><br>
        Tempo até o impacto: ${timeToHit.toFixed(2)} s<br>
        Altura da bala no impacto: ${bulletHeightAtImpact.toFixed(2)} m<br>
        Altura do macaco no impacto: ${macacoHeightAtImpact.toFixed(2)} m<br>
        ${hits ? "<span style='color: green;'>A bala atinge o macaco!</span>" : "<span style='color: red;'>A bala não atinge o macaco!</span>"}
    `;

    // Desenhar o cenário
    drawScene(ctx, d, h);

    // Simular a trajetória da bala
    animateBullet(ctx, v0, angle, timeToHit, d, h);
}

function drawScene(ctx, d, h) {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    // Desenhar o chão
    ctx.fillStyle = "green";
    ctx.fillRect(0, 350, ctx.canvas.width, 50);

    // Desenhar o tronco
    ctx.fillStyle = "brown";
    ctx.fillRect(d, 250 - h, 10, h);

    // Desenhar o macaco
    ctx.beginPath();
    ctx.arc(d + 5, 250 - h, 10, 0, Math.PI * 2);
    ctx.fillStyle = "orange";
    ctx.fill();
}

function animateBullet(ctx, v0, angle, timeToHit, d, h) {
    let t = 0;
    const dt = 0.02;
    const bulletPath = [];

    // Calcula os pontos da trajetória
    while (t <= timeToHit) {
        const x = v0 * Math.cos(angle) * t;
        const y = 250 - (v0 * Math.sin(angle) * t - 0.5 * g * t ** 2);
        bulletPath.push({ x, y });
        t += dt;
    }

    // Animação da bala
    let index = 0;
    function drawFrame() {
        if (index < bulletPath.length) {
            drawScene(ctx, d, h);

            // Desenhar bala
            ctx.beginPath();
            ctx.arc(bulletPath[index].x, bulletPath[index].y, 5, 0, Math.PI * 2);
            ctx.fillStyle = "red";
            ctx.fill();

            // Desenhar macaco em queda
            ctx.beginPath();
            ctx.arc(d + 5, 250 - h + g * index * dt ** 2 / 2, 10, 0, Math.PI * 2);
            ctx.fillStyle = "orange";
            ctx.fill();

            index++;
            requestAnimationFrame(drawFrame);
        }
    }
    drawFrame();
}
