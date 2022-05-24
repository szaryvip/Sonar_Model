const H = 128;
const L = 2 * H + 1;
let u = new Array(L); // u(t)
let u_next = new Array(L); // u(t)
let u_prev = new Array(L); // u(t)
let land_height = new Array(L);

let img;
let slider;
const SCALE = 2;
let A = 127;
let actual_pos = H;
let omega = 5;
let t = 0;
const steps_per_frame = 1;
const dt = 1 / 60 / steps_per_frame;
let v = 0.1; // prędkość fazowa
const dx = 1 / L;
let c2 = v * v * dt * dt / dx / dx;
let alpha = 0.5;

function prepareSliders() {
  sliderA = createSlider(1, 30, 5);
  sliderA.position(windowWidth/2-60, windowHeight/2+L+20);
  sliderA.style('width', '120px');
  textSize(15);
  text('Amplituda sygnalu', sliderA.x + sliderA.width + 10, sliderA.y+5);

  sliderOm = createSlider(1, 13, 5);
  sliderOm.position(windowWidth/2-60, windowHeight/2+L+40);
  sliderOm.style('width', '120px');
  textSize(15);
  text('Omega', sliderOm.x + sliderOm.width + 10, sliderOm.y+5);

  sliderAl = createSlider(1, 10, 5);
  sliderAl.position(windowWidth/2-60, windowHeight/2+L+60);
  sliderAl.style('width', '120px');
  textSize(15);
  text('Alpha', sliderAl.x + sliderAl.width + 10, sliderAl.y+5);

  sliderV = createSlider(1, 8, 5);
  sliderV.position(windowWidth/2-60, windowHeight/2+L+80);
  sliderV.style('width', '120px');
  textSize(15);
  text('Predkosc fazowa (v)', sliderV.x + sliderV.width + 10, sliderV.y+5);
}

function drawTitle() {
	textAlign(CENTER);
	textSize(50);
	textStyle(BOLD);
	fill(0);
	text('Sonar Model', windowWidth/2, 80);
}

function generateLand() {
	let height = 30;
  	for (let x = 0; x < L; x++) {
	  	let y = random([-4, -2, -1, 0, 1, 2, 4]);
		height += y;
		land_height[x] = height;
	}
}

function drawLand() {
	for (let x = 0; x < L; x++)
		u[x][L-land_height[x]] = 0;
}

function setup() {
	createCanvas(windowWidth-30, windowHeight-30);
	img = createImage(L, L);
	background(117, 230, 218)
	// 24 154 180 -blue grotto 189ab4
	// 5 68 94 -navy blue 05445e
	// 212 241 244 -baby blue d4f1f4
	
	prepareSliders();
	drawTitle();
	generateLand();

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
	alpha = sliderAl.value()/10;
	v = sliderV.value()/50;
	c2 = v * v * dt * dt / dx / dx;
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
        A = sliderA.value() * 100;
        omega = sliderOm.value();
        u[actual_pos][0] = A * sin(omega * t);

        drawLand();

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
