export class CanvasLocal {
    graphics;
    canvas;
    rWidth;
    rHeight;
    maxX;
    maxY;
    pixelSize;
    centerX;
    centerY;
    funcionActual = "Math.sin(x)";
    constructor(g, canvas) {
        this.graphics = g;
        this.canvas = canvas;
        this.rWidth = 8;
        this.rHeight = 6;
        this.maxX = canvas.width - 1;
        this.maxY = canvas.height - 1;
        this.centerX = this.maxX / 2;
        this.centerY = this.maxY / 2;
        this.recalcularEscala();
    }
    setZoom(factor) {
        this.rWidth *= factor;
        this.rHeight *= factor;
        this.recalcularEscala();
        this.paint();
    }
    setFunction(nuevaFuncion) {
        this.funcionActual = nuevaFuncion;
        this.paint();
    }
    recalcularEscala() {
        this.pixelSize = Math.max(this.rWidth / this.maxX, this.rHeight / this.maxY);
    }
    iX(x) { return Math.round(this.centerX + x / this.pixelSize); }
    iY(y) { return Math.round(this.centerY - y / this.pixelSize); }
    drawLine(x1, y1, x2, y2) {
        this.graphics.beginPath();
        this.graphics.moveTo(x1, y1);
        this.graphics.lineTo(x2, y2);
        this.graphics.stroke();
    }
    fx(x) {
        try {
            let expresionDinamica = this.funcionActual.replace(/\bx\b/g, `(${x})`);
            return eval(expresionDinamica);
        }
        catch (e) {
            return NaN;
        }
    }
    paint() {
        this.graphics.clearRect(0, 0, this.canvas.width, this.canvas.height);
        let LX = this.rWidth / 2;
        let LY = this.rHeight / 2;
        // 1. Rejilla de fondo
        this.graphics.strokeStyle = '#e2e8f0';
        this.graphics.lineWidth = 1;
        for (let x = -LX; x <= LX; x += 0.5) {
            this.drawLine(this.iX(x), this.iY(-LY), this.iX(x), this.iY(LY));
        }
        for (let y = -LY; y <= LY; y += 0.5) {
            this.drawLine(this.iX(-LX), this.iY(y), this.iX(LX), this.iY(y));
        }
        // 2. Ejes del plano cartesiano
        this.graphics.strokeStyle = '#000000';
        this.graphics.lineWidth = 2;
        this.drawLine(this.iX(-LX), this.iY(0), this.iX(LX), this.iY(0));
        this.drawLine(this.iX(0), this.iY(-LY), this.iX(0), this.iY(LY));
        // 3. Dibujar la curva analítica
        this.graphics.strokeStyle = '#0d6efd';
        this.graphics.lineWidth = 2.5;
        this.graphics.beginPath();
        let primerPunto = true;
        for (let iPixelX = 0; iPixelX <= this.maxX; iPixelX++) {
            let realX = (iPixelX - this.centerX) * this.pixelSize;
            let realY = this.fx(realX);
            if (isNaN(realY) || !isFinite(realY)) {
                primerPunto = true;
                continue;
            }
            let iPixelY = this.iY(realY);
            if (primerPunto) {
                this.graphics.moveTo(iPixelX, iPixelY);
                primerPunto = false;
            }
            else {
                this.graphics.lineTo(iPixelX, iPixelY);
            }
        }
        this.graphics.stroke();
    }
}
