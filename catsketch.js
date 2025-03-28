let faceMesh;
let video;
let faces = [];
let options = { maxFaces: 1, refineLandmarks: true, flipHorizontal: false };

function preload() {
  faceMesh = ml5.faceMesh(options);
  img = loadImage('catbackground.jpg');
}

function setup() {
  createCanvas(640, 480);
  video = createCapture(VIDEO);
  video.size(640, 480);
  video.hide();
  
  faceMesh.detectStart(video, gotFaces);
}

function draw() {
  image(video, 0, 0, width, height);
  image(img, 0, 0, width, height); 
  background(135, 206, 250); 
  image(img, 0, 0, width, height); 
  
  for (let i = 0; i < faces.length; i++) {
    let face = faces[i];

    // Get keypoints
    let leftEyeTop = face.keypoints[159];  // Upper part of the left eye
    let leftEyeBottom = face.keypoints[145]; // Lower part of the left eye
    let rightEyeTop = face.keypoints[386]; // Upper part of the right eye
    let rightEyeBottom = face.keypoints[374]; // Lower part of the right eye
    let leftEyeCenter = face.keypoints[33]; // Center of the left eye
    let rightEyeCenter = face.keypoints[263]; // Center of the right eye

    let noseTip = face.keypoints[4]; // Nose tip
    let leftMouthCorner = face.keypoints[61]; // Left mouth corner
    let rightMouthCorner = face.keypoints[291]; // Right mouth corner
 
    drawCatEars(face.keypoints[127], face.keypoints[234], face.keypoints[356], face.keypoints[454]);
    drawCatFace(face.keypoints);
    drawCatNose(noseTip);
    drawCatWhiskers(leftMouthCorner, rightMouthCorner);
    drawCatEyes(leftEyeCenter, rightEyeCenter, leftEyeTop, leftEyeBottom, rightEyeTop, rightEyeBottom);
    drawCatMouth(noseTip, leftMouthCorner, rightMouthCorner);
  }
}

// Draw cat mouth
function drawCatMouth(noseTip, leftMouthCorner, rightMouthCorner) {
  noFill();
  stroke(165, 42, 42);
  strokeWeight(3);
  let curveDepth = 15;   // Curvature of the mouth

  // Left curve of the mouth
  beginShape();
  vertex(noseTip.x, noseTip.y + 10);
  bezierVertex(noseTip.x - curveDepth, noseTip.y + 20, leftMouthCorner.x + 10, leftMouthCorner.y + 10, leftMouthCorner.x, leftMouthCorner.y);
  endShape();

  // Right curve of the mouth
  beginShape();
  vertex(noseTip.x, noseTip.y + 10);
  bezierVertex(noseTip.x + curveDepth, noseTip.y + 20, rightMouthCorner.x - 10, rightMouthCorner.y + 10, rightMouthCorner.x, rightMouthCorner.y);
  endShape();
}

// Draw cat ears
function drawCatEars() {
  let forehead = faces[0].keypoints[10]; // Forehead center
  let leftEarLeft = faces[0].keypoints[117];
  
  noStroke();

  // Left ear (triangle)
  fill(0, 255, 255);
  triangle(
    leftEarLeft.x, forehead.y / 2, 
    forehead.x / 1.7, leftEarLeft.y * 1.1, 
    forehead.x - 30, forehead.y  
  );

  // Right ear (triangle)
  fill(255, 200, 130);
  triangle(
    forehead.x * 1.5, forehead.y / 2, 
    forehead.x, forehead.y, 
    forehead.x * 1.3, forehead.y * 1.8  
  );
}

// Draw cat nose
function drawCatNose(noseTip) {
  fill(255, 105, 180); // Deep pink
  noStroke();
  ellipse(noseTip.x, noseTip.y, 25, 18);
}

// Draw cat whiskers
function drawCatWhiskers(leftMouthCorner, rightMouthCorner) {
  stroke(255);
  strokeWeight(3);
  let whiskerLength = 50;

  // Left whiskers
  line(leftMouthCorner.x, leftMouthCorner.y - 60, leftMouthCorner.x - whiskerLength, leftMouthCorner.y - 65);
  line(leftMouthCorner.x, leftMouthCorner.y - 60, leftMouthCorner.x - whiskerLength, leftMouthCorner.y - 40);
  line(leftMouthCorner.x, leftMouthCorner.y - 60, leftMouthCorner.x - whiskerLength, leftMouthCorner.y - 20);

  // Right whiskers
  line(rightMouthCorner.x, rightMouthCorner.y - 60, rightMouthCorner.x + whiskerLength, rightMouthCorner.y - 65);
  line(rightMouthCorner.x, rightMouthCorner.y - 60, rightMouthCorner.x + whiskerLength, rightMouthCorner.y - 40);
  line(rightMouthCorner.x, rightMouthCorner.y - 60, rightMouthCorner.x + whiskerLength, rightMouthCorner.y - 20);
}

// Draw cat eyes
function drawCatEyes(leftEyeCenter, rightEyeCenter, leftEyeTop, leftEyeBottom, rightEyeTop, rightEyeBottom) {
  fill(0, 0, 139);
  noStroke();

  let leftEyeHeight = dist(leftEyeTop.x, leftEyeTop.y, leftEyeBottom.x, leftEyeBottom.y);
  let rightEyeHeight = dist(rightEyeTop.x, rightEyeTop.y, rightEyeBottom.x, rightEyeBottom.y);

  let leftEyeSize = map(pow(leftEyeHeight, 1.2), 2, 12, 10, 40, true);
  let rightEyeSize = map(pow(rightEyeHeight, 1.2), 2, 12, 10, 40, true);

  // Draw left eye
  fill(0, 0, 139);
  ellipse(leftEyeCenter.x, leftEyeCenter.y, 50, leftEyeSize);

  // Draw right eye
  fill(165, 42, 42);
  ellipse(rightEyeCenter.x, rightEyeCenter.y, 50, rightEyeSize);
}

// Draw cat face
function drawCatFace(keypoints) {
  let faceCenterX = keypoints[5].x;
  let faceCenterY = keypoints[6].y + 20;
  let faceRadius = dist(keypoints[5].x, keypoints[10].y, keypoints[5].x, keypoints[5].y);

  fill(255, 255, 153);
  noStroke();
  ellipse(faceCenterX, faceCenterY, faceRadius * 2.5, faceRadius * 2);
}

function gotFaces(results) {
  faces = results;
}
