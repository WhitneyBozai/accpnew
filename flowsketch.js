let pointsFlow = [];
let font;
let particles = [];
let numParticles = 1800; 
let maxLife = 255; 
let circles = []; 

function preload() {
  font = loadFont('Myriad Pro.otf'); // Load a font
}

function setup() {
  createCanvas(600, 600);
  pointsFlow = font.textToPoints('Flow', 150, 300, 150, { sampleFactor: 0.1 });

  // 生成若干个随机圆圈
  for (let i = 0; i < 30; i++) {  // 50个圆圈
    circles.push(new Circle());
   
}
}

function draw() {
  let deepTeal = color(0, 153, 204);   // 深青色
  let deepBlue = color(0, 0, 139);     // 深蓝色
  let lightCyan = color(364, 255, 255); // 淡青色

  // 逐行绘制渐变
  for (let y = 0; y < height; y++) {
    let inter = map(y, 0, height, 0, 1); // 计算插值比例

    let c;
    if (inter < 0.5) {
      // 前半部分：深青色到深蓝色
      let subInter = map(inter, 0, 0.5, 0, 1);
      c = lerpColor(deepBlue, deepTeal, subInter);
    } else {
      // 后半部分：深蓝色到淡青色
      let subInter = map(inter, 0.5, 1, 0, 1);
      c = lerpColor(deepTeal, lightCyan, subInter);
    }

    // 绘制当前行
    stroke(c);
    line(0, y, width, y);
  }
     noStroke()
  
  for (let i = 0; i < circles.length; i++) {
    circles[i].update();
    circles[i].show();
  }
  //background(10, 30, 60);
  noStroke();
  fill(255);
  
  for (let i = particles.length - 1; i >= 0; i--) {
    let p = particles[i];
    p.update(); 
    p.show(); 

    // 如果粒子生命周期结束，则从粒子数组中移除
    if (p.alpha <= 0) {
      particles.splice(i, 1);
    }
  }

  // 每帧生成新粒子
  if (frameCount % 3 === 0) { // 每3帧生成一个新的粒子（进一步减少生成频率）
    particles.push(new Particle());
  }
  
  for (let i = 0; i < pointsFlow.length; i++) {
    let p = pointsFlow[i];
    let yOffset = sin(frameCount * 0.05 + p.x * 0.05 + mouseX * 0.01) * 10;
    ellipse(p.x, p.y + yOffset, 5, 5);
    
  }
}


class Particle {
  constructor() {
    // 随机选择从左边或右边生成粒子
    let edge = floor(random(2)); // 0: left, 1: right
    this.pos = createVector(0, 0); // 初始位置
    this.speed = random(1, 2); // 粒子的移动速度
    this.angle = random(TWO_PI); // 初始角度
    this.lifetime = 255; // 粒子的最大生命周期
    this.alpha = this.lifetime; // 当前透明度
    this.noiseOffset = random(1000); // 给每个粒子一个独立的噪声偏移量

    // 根据选择的边缘初始化粒子位置
    if (edge == 0) {
      this.pos.x = 0;
      this.pos.y = random(height); // 从左边缘随机生成
    } else if (edge == 1) {
      this.pos.x = width;
      this.pos.y = random(height); // 从右边缘随机生成
    }
  }

  update() {
    // 使用 Perlin noise 使粒子在平面上移动
    let angleNoise = noise(this.noiseOffset) * TWO_PI * 0.5; // 减少噪声的幅度，减小弯折角度
    let direction = p5.Vector.fromAngle(angleNoise);
    direction.setMag(this.speed); // 设置速度
    this.pos.add(direction); // 更新粒子位置

    // 更新噪声偏移量（让噪声变化更缓慢，减少弯曲）
    this.noiseOffset += 0.005; 

    // 控制粒子的透明度（模拟渐渐消失）
    this.alpha = map(this.lifetime, 0, maxLife, 0, 255);
    this.lifetime--; // 每帧减少生命周期
  }

  show() {
    stroke(255, this.alpha); // 白色线条，透明度逐渐减小
    strokeWeight(1); // 线条粗细
    point(this.pos.x, this.pos.y); // 绘制粒子
  }
}


class Circle {
  constructor() {
    this.x = random(width);  // 圆圈随机的x坐标
    this.y = random(height); // 圆圈随机的y坐标
    this.size = random(20, 50);  // 随机大小
    this.alpha = random(20, 100);  // 降低透明度范围，透明度较低
    this.speedX = random(-1, 1);  // 水平移动速度
    this.speedY = random(-1, 1);  // 垂直移动速度
  }

  update() {
    this.x += this.speedX;  // 更新x坐标
    this.y += this.speedY;  // 更新y坐标

    // 让圆圈在边缘碰撞时反弹
    if (this.x > width || this.x < 0) {
      this.speedX *= -1;
    }
    if (this.y > height || this.y < 0) {
      this.speedY *= -1;
    }
  }

  show() {
    fill(255, this.alpha);  // 白色圆圈，透明度较低
    ellipse(this.x, this.y, this.size, this.size);  // 绘制圆圈
  }
}

