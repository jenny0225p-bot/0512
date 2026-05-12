let capture;
let faceMesh;
let faces = [];
let options = { maxFaces: 1, refineLandmarks: false, flipHorizontal: false };

function preload() {
  // 載入 faceMesh 模型
  faceMesh = ml5.faceMesh(options);
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  capture = createCapture(VIDEO);
  capture.size(640, 480);
  capture.hide(); // 隱藏預設在畫布下方的影片元件

  // 開始偵測臉部
  faceMesh.detectStart(capture, gotFaces);
}

function gotFaces(results) {
  faces = results;
}

function draw() {
  background('#e7c6ff');

  let vWidth = width * 0.5;
  let vHeight = height * 0.5;

  // 繪製影像與耳環
  push();
  // 移動到畫布中心並進行水平翻轉
  translate(width / 2, height / 2);
  scale(-1, 1);
  imageMode(CENTER);
  image(capture, 0, 0, vWidth, vHeight);

  // 如果有偵測到臉部，繪製耳環
  if (faces.length > 0) {
    let face = faces[0];
    
    // MediaPipe FaceMesh 特徵點索引：176 為右耳垂附近，400 為左耳垂附近
    let earlobeIndices = [176, 400];
    
    fill('#ffff00'); // 黃色
    noStroke();

    for (let index of earlobeIndices) {
      let pt = face.keypoints[index];
      // 將影片座標映射到畫布上的顯示大小（中心化座標系）
      let x = map(pt.x, 0, capture.width, -vWidth / 2, vWidth / 2);
      let y = map(pt.y, 0, capture.height, -vHeight / 2, vHeight / 2);

      // 繪製三個圓圈組成耳環
      for (let i = 0; i < 3; i++) {
        circle(x, y + i * 15 + 10, 10);
      }
    }
  }
  pop();
}
