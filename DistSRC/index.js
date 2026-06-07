"use strict";
const canvas = document.getElementById("canvasBarras3D");
const ctx = canvas.getContext("2d");
const labelsInput = document.getElementById("labelsInput");
const valuesInput = document.getElementById("valuesInput");
const btnGraficar = document.getElementById("btnGraficar");
// Función dedicada a proyectar las caras poligonales del 3D
function dibujarCara3D(puntos, colorRelleno, colorBorde) {
    ctx.beginPath();
    ctx.moveTo(puntos[0].x, puntos[0].y);
    for (let i = 1; i < puntos.length; i++) {
        ctx.lineTo(puntos[i].x, puntos[i].y);
    }
    ctx.closePath();
    ctx.fillStyle = colorRelleno;
    ctx.fill();
    ctx.strokeStyle = colorBorde;
    ctx.lineWidth = 0.5;
    ctx.stroke();
}
function renderizarDashboard3D() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const categorias = labelsInput.value.split(",").map(c => c.trim());
    const valores = valuesInput.value.split(",").map(v => Number(v.trim()) || 0);
    if (categorias.length === 0 || valores.length === 0 || categorias.length !== valores.length) {
        alert("Error: Verifica que coincida el número de categorías y valores.");
        return;
    }
    const marginIzq = 140;
    const marginDer = 60;
    const marginSup = 40;
    const marginInf = 70;
    const chartWidth = canvas.width - marginIzq - marginDer;
    const chartHeight = canvas.height - marginSup - marginInf;
    const valorMaximo = Math.max(...valores, 1);
    // Escala adaptativa en múltiplos de 50
    const limiteEscalaEje = Math.ceil(valorMaximo / 50) * 50;
    // Dibujar rejilla de fondo estructural y numeraciones
    const numeroDivisiones = 8;
    ctx.font = "500 13px 'Segoe UI', sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "top";
    for (let d = 0; d <= numeroDivisiones; d++) {
        const ratio = d / numeroDivisiones;
        const xActual = marginIzq + (ratio * chartWidth);
        const valorMarcador = Math.round(ratio * limiteEscalaEje);
        ctx.strokeStyle = "#e2e8f0";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(xActual, marginSup);
        ctx.lineTo(xActual, canvas.height - marginInf + 10);
        ctx.stroke();
        ctx.fillStyle = "#64748b";
        ctx.fillText(valorMarcador.toString(), xActual, canvas.height - marginInf + 18);
    }
    const numBarras = valores.length;
    const subdivisionY = chartHeight / numBarras;
    const grosorBarraFront = subdivisionY * 0.55;
    const factorPerspectiva = 16;
    for (let i = 0; i < numBarras; i++) {
        const categoria = categorias[i];
        const valor = valores[i];
        const anchoBarraFront = (valor / limiteEscalaEje) * chartWidth;
        const posY_Front = marginSup + (i * subdivisionY) + (subdivisionY * 0.2);
        const clrFrontalBase = "#0072ff";
        const clrSombraInterna = "rgba(0, 0, 0, 0.12)";
        // Cara A: Vista Frontal de la barra (Gradiente Cyan-Azul)
        const gradientFront = ctx.createLinearGradient(marginIzq, 0, marginIzq + anchoBarraFront, 0);
        gradientFront.addColorStop(0, "#00c6ff");
        gradientFront.addColorStop(1, clrFrontalBase);
        ctx.fillStyle = gradientFront;
        ctx.fillRect(marginIzq, posY_Front, anchoBarraFront, grosorBarraFront);
        ctx.strokeStyle = clrSombraInterna;
        ctx.lineWidth = 0.5;
        ctx.strokeRect(marginIzq, posY_Front, anchoBarraFront, grosorBarraFront);
        // Cara B: Techo Isométrico Superior
        const puntosTecho = [
            { x: marginIzq, y: posY_Front },
            { x: marginIzq + factorPerspectiva, y: posY_Front - factorPerspectiva },
            { x: marginIzq + anchoBarraFront + factorPerspectiva, y: posY_Front - factorPerspectiva },
            { x: marginIzq + anchoBarraFront, y: posY_Front }
        ];
        const gradientTecho = ctx.createLinearGradient(0, posY_Front - factorPerspectiva, 0, posY_Front);
        gradientTecho.addColorStop(0, "#93c5fd");
        gradientTecho.addColorStop(1, "#1e40af");
        dibujarCara3D(puntosTecho, gradientTecho, clrSombraInterna);
        // Cara C: Lateral de Cierre (Bloque de Sombra)
        const puntosLateral = [
            { x: marginIzq + anchoBarraFront, y: posY_Front },
            { x: marginIzq + anchoBarraFront + factorPerspectiva, y: posY_Front - factorPerspectiva },
            { x: marginIzq + anchoBarraFront + factorPerspectiva, y: posY_Front + grosorBarraFront - factorPerspectiva },
            { x: marginIzq + anchoBarraFront, y: posY_Front + grosorBarraFront }
        ];
        const gradientLateral = ctx.createLinearGradient(marginIzq + anchoBarraFront, 0, marginIzq + anchoBarraFront + factorPerspectiva, 0);
        gradientLateral.addColorStop(0, "#1d4ed8");
        gradientLateral.addColorStop(1, "#111827");
        dibujarCara3D(puntosLateral, gradientLateral, clrSombraInterna);
        // Textos descriptivos (Categoría a la izquierda, Valor numérico a la derecha)
        ctx.fillStyle = "#1e293b";
        ctx.font = "bold 14px 'Segoe UI', sans-serif";
        ctx.textAlign = "right";
        ctx.textBaseline = "middle";
        ctx.fillText(categoria, marginIzq - 18, posY_Front + (grosorBarraFront / 2));
        ctx.fillStyle = "#475569";
        ctx.font = "600 14px 'Segoe UI', sans-serif";
        ctx.textAlign = "left";
        ctx.textBaseline = "middle";
        const txtX = marginIzq + anchoBarraFront + factorPerspectiva + 12;
        const txtY = posY_Front + (grosorBarraFront / 2) - (factorPerspectiva / 2);
        ctx.fillText(valor.toString(), txtX, txtY);
    }
    // Dibujo del Eje Y Central
    ctx.strokeStyle = "#94a3b8";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(marginIzq, marginSup - factorPerspectiva);
    ctx.lineTo(marginIzq, canvas.height - marginInf + 10);
    ctx.stroke();
}
btnGraficar.addEventListener("click", renderizarDashboard3D);
renderizarDashboard3D();
