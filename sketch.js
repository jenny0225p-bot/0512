let capture;
let faceMesh;
let faces = [];
let options = { maxFaces: 1, refineLandmarks: true, flipHorizontal: false };

function preload() {
faceMesh = ml5.faceMesh(options);
}

function setup() {
createCanvas(windowWidth, windowHeight);
capture = createCapture(VIDEO);
capture.size(640, 480);
capture.hide();
faceMesh.detectStart(capture, gotFaces);
}

function gotFaces(results) {
faces = results;
}

function draw() {
background('#e7c6ff');

// 1. 顯示學號姓名 (維持原樣)
push();
fill(0);
noStroke();
textAlign(CENTER, CENTER);
textSize(width * 0.035);
text('414730159彭宥蓁', width / 2, height * 0.1);
pop();

let vWidth = width * 0.5;
let vHeight = height * 0.5;

push();
// 2. 移動到畫布中心
translate(width / 2, height / 2);

// 3. 處理鏡像
// 如果你在 setup 設定 flipHorizontal: false，這裡要用 scale(-1, 1) 讓自己像照鏡子
scale(-1, 1);

imageMode(CENTER);
image(capture, 0, 0, vWidth, vHeight);

if (faces.length > 0) {
let face = faces[0];

// 常用耳垂附近的點：
// 左耳垂附近: 132 或 147 或 215
// 右耳垂附近: 361 或 376 或 435
let earlobeIndices = [132, 361];

fill('#ffff00');
noStroke();

for (let index of earlobeIndices) {
let pt = face.keypoints[index];

// 重要修正：移除 X/Y 互換邏輯，直接對應
// 將 640x480 的座標 映射到畫布中央顯示的 vWidth x vHeight 範圍內
// 因為 imageMode 是 CENTER，且原點在畫布中心，所以範圍是 -vWidth/2 到 vWidth/2
let x = map(pt.x, 0, capture.width, -vWidth / 2, vWidth / 2);
let y = map(pt.y, 0, capture.height, -vHeight / 2, vHeight / 2);

// 繪製耳環
for (let i = 0; i < 3; i++) {
// y + (i + 1) * 15 讓圓圈往下排
circle(x, y + (i + 1) * 15, 10);
}
}
}
pop();
}

