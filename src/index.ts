import { CanvasLocal } from './canvasLocal.js';

const canvas = document.getElementById('circlechart') as HTMLCanvasElement;
const graphics = canvas.getContext('2d');

if (graphics) {
    const miCanvas = new CanvasLocal(graphics, canvas);
    miCanvas.paint();

    document.getElementById('btnDibujar').addEventListener('click', () => {
        const input = document.getElementById('funcInput') as HTMLInputElement;
        if (input && input.value) {
            miCanvas.setFunction(input.value);
        }
    });

    document.getElementById('btnZoomIn').addEventListener('click', () => {
        miCanvas.setZoom(0.7); // Acercar
    });

    document.getElementById('btnZoomOut').addEventListener('click', () => {
        miCanvas.setZoom(1.4); // Alejar
    });
}