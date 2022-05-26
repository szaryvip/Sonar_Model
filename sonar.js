const H = 128;
const L = 2 * H + 1;
let number_of_fish = 5;
let u = new Array(L); // u(t)
let u_next = new Array(L); // u(t)
let u_prev = new Array(L); // u(t)
let land_height = new Array(L);
let fish_positions = new Array(number_of_fish);

let img;
// let pixel_fish = [[1,1,0,0,0,0,0,1,1,1,0],
// 				  [0,0,0,0,0,0,0,0,1,0,0],
// 				  [0,0,0,0,0,0,0,0,0,0,0],
// 				  [0,0,0,0,0,0,0,0,1,1,0],
// 				  [1,0,0,0,0,0,0,1,1,1,1]]
let sliderA;
let sliderAl;
let sliderOm;
let sliderV;
let fish_wait = 0;
const SCALE = 2;
let A = 127;
let actual_pos = H;
let omega = 5;
let t = 0;
const dt = 1 / 60;
let v = 0.1; // prędkość fazowa
const dx = 1 / L;
let c2 = v * v * dt * dt / dx / dx;
let alpha = 0.5;

function prepareSliders() {
  sliderA = createSlider(1, 130, 25);
  sliderA.position(windowWidth/2-60, windowHeight/2+L+20);
  sliderA.style('width', '120px');

  sliderOm = createSlider(1, 13, 5);
  sliderOm.position(windowWidth/2-60, windowHeight/2+L+40);
  sliderOm.style('width', '120px');
  
  sliderAl = createSlider(0, 100, 5, 5);
  sliderAl.position(windowWidth/2-60, windowHeight/2+L+60);
  sliderAl.style('width', '120px');
  
  sliderV = createSlider(0, 15, 5);
  sliderV.position(windowWidth/2-60, windowHeight/2+L+80);
  sliderV.style('width', '120px');
}

function updateTexts() {
	background(117, 230, 218);
	textSize(15);
	textStyle(NORMAL);
	textAlign(LEFT);
	text('Amplitude: ' + A, sliderA.x + sliderA.width + 10, sliderA.y+5);
	text('Omega: ' + omega, sliderOm.x + sliderOm.width + 10, sliderOm.y+5);
	text('Alpha: ' + alpha, sliderAl.x + sliderAl.width + 10, sliderAl.y+5);
	text('Phase speed (v): ' + v, sliderV.x + sliderV.width + 10, sliderV.y+5);
	drawTitle();
}

function drawTitle() {
	textAlign(CENTER);
	textSize(50);
	textStyle(BOLD);
	fill(0);
	text('Sonar Model', windowWidth/2, 80);
}

function generateLand() {
	let height = 40;
  	for (let x = 0; x < L; x++) {
	  	let y = random([-4, -2, -1, 0, 1, 2, 4]);
		height += y;
		land_height[x] = height;
	}
}

function drawLand() {
	for (let x = 0; x < L; x++) {
		for (let y = 0; y < land_height[x]; y++)
			u[x][L-y] = 0;
	}
}

function generateFish() {
	for (let fish = 0; fish < number_of_fish; fish++){
		fish_positions[fish] = [int(random(10, L-15)), int(random(10, L-10))]
	}
}

function drawFish() {
	for (let fish = 0; fish < number_of_fish; fish++){
		for (let flen = 0; flen < 11; flen++) {
			for (let fhig = 0; fhig < 5; fhig++){
				u[fish_positions[fish][0]+flen][fish_positions[fish][1]+fhig] = 0;
			}
		}
	}
}

function moveFish() {
	for (let fish = 0; fish < number_of_fish; fish++) {
		if(fish_positions[fish][0] == L-11) {
			fish_positions[fish][0] = 0;
		} 
		fish_positions[fish][0] += 1;
	}
}

function setup() {
	createCanvas(windowWidth-16, windowHeight-16);
	img = createImage(L, L);
	background(117, 230, 218)
	// 24 154 180 -blue grotto 189ab4
	// 5 68 94 -navy blue 05445e
	// 212 241 244 -baby blue d4f1f4
	
	prepareSliders();
	drawTitle();
	generateLand();
	generateFish();

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
	alpha = sliderAl.value()/100;
	v = sliderV.value()/100;
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
		u[x][0] = u[x][1];
		u[0][x] = u[1][x];
		u[x][L - 1] = u[x][L - 2];
		u[L - 1][x] = u[L - 2][x];
	}

	for (let x = 0; x < L; ++x) {
		u_prev[x] = u[x].slice();
		u[x] = u_next[x].slice();
	}
	
	// brzegi
	for (let x = 0; x < L; ++x) {
		u_next[x][0] = u_next[x][1];
		u_next[0][x] = u_next[1][x];
		u_next[x][L - 1] = u_next[x][L - 2];
		u_next[L - 1][x] = u_next[L - 2][x];
	}
}

function draw() {
    
    if (keyIsDown(LEFT_ARROW) && actual_pos > 1) {
        actual_pos -= 1;
    }
    
    if (keyIsDown(RIGHT_ARROW) && actual_pos < L-2) {
        actual_pos += 1;
    }

	A = sliderA.value() * 5;
	omega = sliderOm.value();
	u[actual_pos][0] = A * sin(omega * t);

	drawLand();
	drawFish();
	if (fish_wait == 0) {
		moveFish();
		fish_wait = 5;
	} else {
		fish_wait--;
	}
	update();
	updateTexts();
	t += dt;
    
    img.loadPixels();
    for (let x = 0; x < L; ++x)
        for (let y = 0; y < L; ++y)
        img.set(x, y, 127 + u[x][y]);

    img.updatePixels();
    image(img, windowWidth/2-L, windowHeight/2-L, L * SCALE, L * SCALE);
}
