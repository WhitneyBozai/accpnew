let font, points = [], particles = [], flippedParticles = [];

function preload() {
  font = loadFont('Letter Githic.otf');
}

function setup() {
  createCanvas(600, 600);
  let textPoints = font.textToPoints("Shadow", 70, 267, 120, { sampleFactor: 0.2 });

  // Store the original points for the static particles (top "Shadow")
  points = textPoints;
  
  // Adjust the flipped points to bring them closer to the original "Shadow"
  for (let pt of points) {
    // Create particles for the static "Shadow"
    particles.push(new Particle(pt.x, pt.y, true)); // True indicates these particles are static
    
    // Create particles for the flipped "Shadow"
    flippedParticles.push(new Particle(pt.x, height - pt.y - 50, false)); // False means these particles are animated
  }
}

function draw() {
  background(10);

  // Update and display particles for the static original "Shadow"
  for (let p of particles) {
    p.update();
    p.display();
  }

  // Update and display particles for the flipped "Shadow" with lower opacity
  for (let p of flippedParticles) {
    p.update();
    p.display(100); // Set the alpha to 100 for a lower opacity
  }
}

class Particle {
  constructor(x, y, isStatic) {
    this.pos = createVector(x, y);
    this.original = createVector(x, y);
    this.isStatic = isStatic; // Add flag to track if particle should be static
  }

  update() {
    // If the particle is static, do not change its position
    if (!this.isStatic) {
      let d = dist(mouseX, mouseY, this.pos.x, this.pos.y);
      let offset = sin(d * 0.05 - frameCount * 0.1) * 5;
      this.pos.x = this.original.x + offset; // Only update the animated particles
    }
  }

  display(alpha = 255) {
    fill(255, alpha); // Adjust the opacity using the alpha parameter
    noStroke();
    ellipse(this.pos.x, this.pos.y, 3, 3);
  }
}
