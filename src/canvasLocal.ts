export class CanvasLocal {
  protected graphics: CanvasRenderingContext2D;
  protected canvas: HTMLCanvasElement;
  protected rWidth: number;
  protected rHeight: number;
  protected maxX: number;
  protected maxY: number;
  protected pixelSize: number;
  protected centerX: number;
  protected centerY: number;

  private funcionActual: string = "Math.sin(x)";

  public constructor(g: CanvasRenderingContext2D, canvas: HTMLCanvasElement) {
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

  public setZoom(factor: number) {
    this.rWidth *= factor;
    this.rHeight *= factor;
    this.recalcularEscala();
    this.paint();
  }

  public setFunction(nuevaFuncion: string) {
    this.funcionActual = nuevaFuncion;
    this.paint();
  }

  private recalcularEscala() {
    this.pixelSize = Math.max(this.rWidth / this.maxX, this.rHeight / this.maxY);
  }

  private iX(x: number): number { return Math.round(this.centerX + x / this.pixelSize); }
  private iY(y: number): number { return Math.round(this.centerY - y / this.pixelSize); }

  private drawLine(x1: number, y1: number, x2: number, y2: number) {
    this.graphics.beginPath();
    this.graphics.moveTo(x1, y1);
    this.graphics.lineTo(x2, y2);
    this.graphics.stroke();
  }

  private fx(x: number): number {
    try {
      let expresionDinamica = this.funcionActual.replace(/\bx\b/g, `(${x})`);
      return eval(expresionDinamica);
    } catch (e) {
      return NaN;
    }
  }

  public paint() {
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
      } else {
        this.graphics.lineTo(iPixelX, iPixelY);
      }
    }
    this.graphics.stroke();
  }
}