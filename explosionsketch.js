let pointsLife = [];
let brokenPieces = [];
let font;  // Declare global variable

function preload() {
  font = loadFont('Myriad Pro.otf');  // Load font in preload
}

function setup() {
  createCanvas(600, 600);
  pointsLife = font.textToPoints('Explosion', 50, 350, 120, { sampleFactor: 0.1 });
  noStroke();
}

function draw() {
  background(0, 20); // Soft fading background

  // Draw the broken pieces
  for (let i = brokenPieces.length - 1; i >= 0; i--) {
    let p = brokenPieces[i];
    p.update();
    p.show();
    if (p.alpha <= 0) {
      brokenPieces.splice(i, 1);
    }
  }

  // Draw points and generate fragments when hovered
  for (let i = 0; i < pointsLife.length; i++) {
    let p = pointsLife[i];
    let d = dist(mouseX, mouseY, p.x, p.y);
    
    if (d < 30) {
      brokenPieces.push(new BrokenPiece(p.x, p.y));
    }

    fill(255, 150);
    ellipse(p.x, p.y, 5, 5);
  }
}

class BrokenPiece {
  constructor(x, y) {
    this.pos = createVector(x, y);
    this.vel = createVector(random(-2, 2), random(-2, 2));
    this.alpha = 255;
    this.color = color(random(255), random(255), random(255));  // Random color for each particle
  }

  update() {
    this.pos.add(this.vel);
    this.alpha -= 3; // Fade out quickly
  }

  show() {
    fill(this.color.levels[0], this.color.levels[1], this.color.levels[2], this.alpha); // Use random color
    ellipse(this.pos.x, this.pos.y, 5, 5);
  }
}
