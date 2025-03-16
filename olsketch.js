function setup() {
  createCanvas(600, 600);
  noStroke();
}

function draw() {
  background(255);

  let rows = 10;
  let cols = 10;
  let w = width / cols;
  let h = height / rows;

  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      let x = j * w;
      let y = i * h;

      // color
      fill((i * 30 + frameCount * 2) % 255, (j * 30) % 255, 150);

      
      let centerX = x + w / 2;
      let centerY = y + h / 2;

      
      let distToMouse = dist(mouseX, mouseY, centerX, centerY);
      let scaleFactor = map(distToMouse, 0, 100, 1.5, 1, true); 

      
      if ((i + j) % 2 === 0) {
        let dia = scaleFactor * w * 0.8; // circle
        ellipse(centerX, centerY, dia, dia);
      } else {
        
        beginShape();
        vertex(centerX, y+9); 
        vertex(x + w-9, centerY); 
        vertex(centerX, y + h-9); 
        vertex(x+9, centerY); 
        endShape(CLOSE);
      }

      
      let circleDia = scaleFactor * 20; 
      circle(centerX, centerY, circleDia);
    }
  }
}
