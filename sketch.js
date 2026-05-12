let capture;
let faceMesh;
let faces = []; // 確保全域變數已宣告，避免 ReferenceError
let options = { maxFaces: 1, refineLandmarks: true, flipHorizontal: false };

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

  // 在擷取影像的外面置中上方加上文字
  push();
  fill(0); // 設定文字顏色為黑色
  noStroke();
  textAlign(CENTER, CENTER);
  textSize(width * 0.035); // 根據畫布寬度動態調整文字大小
  text('414730159彭宥蓁', width / 2, height * 0.1);
  pop();

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
    
    // MediaPipe FaceMesh 特徵點索引：176 為右耳垂區域，400 為左耳垂區域
    let earlobeIndices = [176, 400];
    
    fill('#ffff00'); // 黃色
    noStroke();

    for (let index of earlobeIndices) {
      let pt = face.keypoints[index];
      
      // 針對手機掃描建議的 90 度座標轉換：
      // 新的 X 座標採用原始 Y，新的 Y 座標採用 (原始寬度 - 原始 X)
      let rotatedX = pt.y;
      let rotatedY = capture.width - pt.x;

      // 將旋轉後的座標映射到畫布中心座標系
      let x = map(rotatedX, 0, capture.height, vWidth / 2, -vWidth / 2);
      let y = map(rotatedY, 0, capture.width, -vHeight / 2, vHeight / 2);

      // 繪製三個圓圈組成耳環
      for (let i = 0; i < 3; i++) {
        circle(x, y + (i + 1) * 15, 10);
      }
    }
  }
  pop();
}
