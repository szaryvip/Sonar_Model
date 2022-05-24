const H = 128;
const L = 2 * H + 1;
let u = new Array(L); // u(t)
let u_next = new Array(L); // u(t)
let u_prev = new Array(L); // u(t)

let img;
let slider;
const SCALE = 2;
let A = 127;
let actual_pos = H;
const omega = 5;
let t = 0;
const steps_per_frame = 5;
const dt = 1 / 60 / steps_per_frame;
const v = 0.1; // prędkość fazowa
const dx = 1 / L;
const c2 = v * v * dt * dt / dx / dx;
const alpha = 0.5;


function setup() {
  createCanvas(windowWidth-30, windowHeight-30);
  img = createImage(L, L);
  background(117, 230, 218)
  // 24 154 180 -blue grotto 189ab4
  // 5 68 94 -navy blue 05445e
  // 212 241 244 -baby blue d4f1f4
  slider = createSlider(1, 30, 5);
  slider.position(windowWidth/2-60, windowHeight/2+L+60);
  slider.style('width', '120px');
//   slider.style('color', '189ab4')
  textSize(20);
  textAlign(CENTER);
  text('Amplituda sygnalu', slider.x + slider.width/2, slider.y - 20);

  textAlign(CENTER);
  textSize(50);
  textStyle(BOLD);
  fill(0);
  text('Sonar Model', windowWidth/2, 80);

  for (let i = 0; i < L; ++i) {
    u[i] = new Array(L);
    u_next[i] = new Array(L);
    u_prev[i] = new Array(L);
  }

  for (let x = 0; x < L; ++x)
    for (let y = 0; y < L; ++y) {
      u[x][y] = 0;
      u_next[x][y] = 0;
      u_prev[x][y] = 0;
    }
}

function update() {

  for (let x = 1; x < L - 1; ++x)
    for (let y = 1; y < L - 1; ++y) {
      u_next[x][y] = 2 * u[x][y] - u_prev[x][y];
      u_next[x][y] += c2 * (u[x + 1][y] - 2 * u[x][y] + u[x - 1][y]);
      u_next[x][y] += c2 * (u[x][y + 1] - 2 * u[x][y] + u[x][y - 1]);
      u_next[x][y] -= alpha * dt * (u[x][y] - u_prev[x][y]);
    }

  // brzegi
  for (let x = 0; x < L; ++x) {
    u_next[x][0] = u_next[x][1];
    u_next[0][x] = u_next[1][x];
    u_next[x][L - 1] = u_next[x][L - 2];
    u_next[L - 1][x] = u_next[L - 2][x];
  }

  for (let x = 0; x < L; ++x) {
    u_prev[x] = u[x].slice();
    u[x] = u_next[x].slice();
  }
}

function draw() {
    
    if (keyIsDown(LEFT_ARROW) && actual_pos > 1) {
        actual_pos -= 1;
    }
    
    if (keyIsDown(RIGHT_ARROW) && actual_pos < L-2) {
        actual_pos += 1;
    }

    for (let step = 0; step < steps_per_frame; ++step) {
        A = slider.value() * 100;
        u[actual_pos][0] = A * sin(omega * t);

        //przeszkoda
        for (let x = H / 2; x < 3 * H / 2; x++)
        u[x][L-20] = 0;

        update()
        t += dt;
    }
    img.loadPixels();
    for (let x = 0; x < L; ++x)
        for (let y = 0; y < L; ++y)
        img.set(x, y, 127 + u[x][y]);

    img.updatePixels();
    image(img, windowWidth/2-L, windowHeight/2-L, L * SCALE, L * SCALE);
}
