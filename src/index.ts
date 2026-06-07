// Vinculación de elementos del DOM
const canvas = document.getElementById("canvasPoligonos") as HTMLCanvasElement;
const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;

const inputLados = document.getElementById("inputLados") as HTMLInputElement;
const inputRadio = document.getElementById("inputRadio") as HTMLInputElement;
const inputRotacion = document.getElementById("inputRotacion") as HTMLInputElement;

const lblLados = document.getElementById("lblLados") as HTMLSpanElement;
const lblRadio = document.getElementById("lblRadio") as HTMLSpanElement;
const lblRotacion = document.getElementById("lblRotacion") as HTMLSpanElement;
const btnGraficar = document.getElementById("btnGraficar") as HTMLButtonElement;

function dibujarPoligonoPro() {
    // 1. Limpieza total del Lienzo
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 2. Obtener valores de los controles numéricos
    const lados = Number(inputLados.value);
    const radio = Number(inputRadio.value);
    const gradosRotacion = Number(inputRotacion.value);

    // Actualizar etiquetas dinámicas de la interfaz
    lblLados.innerText = lados.toString();
    lblRadio.innerText = `${radio}px`;
    lblRotacion.innerText = `${gradosRotacion}°`;

    // 3. Definir centro geométrico del lienzo
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    // Convertir la rotación de grados a radianes para Math.cos/sin
    const rotacionRadianes = (gradosRotacion * Math.PI) / 180;

    // 4. DIBUJAR LÍNEAS GUÍA DE FONDO (Aspecto de plano técnico)
    ctx.strokeStyle = "#f1f5f9";
    ctx.lineWidth = 1.5;
    // Círculo base de referencia
    ctx.beginPath();
    ctx.arc(centerX, centerY, radio, 0, 2 * Math.PI);
    ctx.stroke();

    // 5. CALCULAR VÉRTICES Y DIBUJAR LA FIGURA
    const vertices: { x: number; y: number }[] = [];

    for (let i = 0; i < lados; i++) {
        // Fracción del ángulo total de la circunferencia (2*PI)
        const angulo = (2 * Math.PI * i) / lados + rotacionRadianes;
        
        const x = centerX + radio * Math.cos(angulo);
        const y = centerY + radio * Math.sin(angulo);
        vertices.push({ x, y });
    }

    // --- EFECTO DE CAPAS ANIDADAS PARA EL LOOK PRO ---
    // Dibujamos un degradado lineal estilizado para el relleno de la figura
    const gradientRelleno = ctx.createLinearGradient(centerX - radio, centerY - radio, centerX + radio, centerY + radio);
    gradientRelleno.addColorStop(0, "#34d399"); // Verde esmeralda brillante
    gradientRelleno.addColorStop(1, "#059669"); // Verde oscuro corporativo

    // Trazar la ruta del polígono principal
    ctx.beginPath();
    ctx.moveTo(vertices[0].x, vertices[0].y);
    for (let i = 1; i < lados; i++) {
        ctx.lineTo(vertices[i].x, vertices[i].y);
    }
    ctx.closePath();

    // Aplicar sombra difuminada premium
    ctx.shadowColor = "rgba(4, 120, 87, 0.35)";
    ctx.shadowBlur = 25;
    ctx.shadowOffsetY = 10;

    // Rellenar la figura
    ctx.fillStyle = gradientRelleno;
    ctx.fill();

    // Desactivar sombras para los siguientes trazos
    ctx.shadowBlur = 0;
    ctx.shadowOffsetY = 0;

    // Dibujar el contorno externo brillante
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 4;
    ctx.stroke();

    ctx.strokeStyle = "#047857";
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // 6. DIBUJAR CAPAS INTERNAS GEOMÉTRICAS (Efecto Vectorial Profesional)
    ctx.strokeStyle = "rgba(255, 255, 255, 0.25)";
    ctx.lineWidth = 1;
    for (let i = 0; i < lados; i++) {
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.lineTo(vertices[i].x, vertices[i].y);
        ctx.stroke();
    }

    // Dibujar los pequeños nodos en cada vértice
    for (let i = 0; i < lados; i++) {
        ctx.beginPath();
        ctx.arc(vertices[i].x, vertices[i].y, 5, 0, 2 * Math.PI);
        ctx.fillStyle = "#ffffff";
        ctx.fill();
        ctx.strokeStyle = "#059669";
        ctx.lineWidth = 2;
        ctx.stroke();
    }

    // Nodo central
    ctx.beginPath();
    ctx.arc(centerX, centerY, 4, 0, 2 * Math.PI);
    ctx.fillStyle = "#10b981";
    ctx.fill();
}

// Escuchadores de eventos para actualización en tiempo real al mover los sliders
inputLados.addEventListener("input", dibujarPoligonoPro);
inputRadio.addEventListener("input", dibujarPoligonoPro);
inputRotacion.addEventListener("input", dibujarPoligonoPro);
btnGraficar.addEventListener("click", dibujarPoligonoPro);

// Ejecución inicial automática al cargar
dibujarPoligonoPro();