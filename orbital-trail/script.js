const sketch = Sketch.create();
const center = {
  x: sketch.width / 2,
  y: sketch.height / 2,
};
const orbs = [];
const options = {
  total: 100,
  spacing: 2,
  speed: 65,
  scale: 1,
  jitterRadius: 0,
  jitterHue: 0,
  clearAlpha: 10,
  toggleOrbitals: true,
  orbitalAlpha: 100,
  lightAlpha: 5,
  toggleLight: true,
  clear: function () {
    sketch.clearRect(0, 0, sketch.width, sketch.height);
    orbs = [];
  },
};

class Orb {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.dx = x / options.scale - center.x / options.scale;
    this.dy = y / options.scale - center.y / options.scale;
    this.angle = Math.atan2(this.dy, this.dx);
    this.lastAngle = this.angle;
    this.radius = Math.sqrt(this.dx * this.dx + this.dy * this.dy);
    this.size = this.radius / 300 + 1;
    this.speed = (Math.random(1, 10) / 300000) * this.radius + 0.015;
  }
  x;
  y;
  dx;
  dy;
  angle;
  lastAngle;
  radius;
  size;
  speed;
}

Orb.prototype.update = function () {
  this.lastAngle = this.angle;
  this.angle += this.speed * (options.speed / 50);
  this.x = this.radius * cos(this.angle);
  this.y = this.radius * sin(this.angle);
};

Orb.prototype.render = function () {
  if (options.toggleOrbitals) {
    let radius =
      options.jitterRadius === 0
        ? this.radius
        : this.radius +
          Math.random(-options.jitterRadius, options.jitterRadius);

    radius = options.jitterRadius !== 0 && radius < 0 ? 0.001 : radius;

    sketch.strokeStyle =
      "hsla( " +
      ((this.angle + 90) / (PI / 180) +
        random(-options.jitterHue, options.jitterHue)) +
      ", 100%, 50%, " +
      options.orbitalAlpha / 100 +
      " )";

    sketch.lineWidth = this.size;
    sketch.beginPath();
    if (options.speed >= 0) {
      sketch.arc(0, 0, radius, this.lastAngle, this.angle + 0.001, false);
    } else {
      sketch.arc(0, 0, radius, this.angle, this.lastAngle + 0.001, false);
    }
    sketch.stroke();
    sketch.closePath();
  }

  if (options.toggleLight) {
    sketch.lineWidth = 0.5;
    sketch.strokeStyle =
      "hsla( " +
      ((this.angle + 90) / (Math.PI / 180) +
        Math.random(-options.jitterHue, options.jitterHue)) +
      ", 100%, 70%, " +
      options.lightAlpha / 100 +
      " )";
    sketch.beginPath();
    sketch.moveTo(0, 0);
    sketch.lineTo(this.x, this.y);
    sketch.stroke();
  }
};

function createOrb(config) {
  const x = config && config.x ? config.x : sketch.mouse.x;
  const y = config && config.y ? config.y : sketch.mouse.y;
  orbs.push(new Orb(x, y));
}

function turnOnMove() {
  sketch.mousemove = createOrb;
}

function turnOffMove() {
  sketch.mousemove = null;
}

sketch.mousedown = function () {
  createOrb();
  turnOnMove();
};

sketch.mouseup = turnOffMove;

sketch.resize = function () {
  center.x = sketch.width / 2;
  center.y = sketch.height / 2;
  sketch.lineCap = "round";
};

sketch.setup = function () {
  while (options.total--) {
    createOrb({
      x: random(sketch.width / 2 - 300, sketch.width / 2 + 300),
      y: random(sketch.height / 2 - 300, sketch.height / 2 + 300),
    });
  }
};

sketch.clear = function () {
  sketch.globalCompositeOperation = "destination-out";
  sketch.fillStyle = "rgba( 0, 0, 0 , " + options.clearAlpha / 100 + " )";
  sketch.fillRect(0, 0, sketch.width, sketch.height);
  sketch.globalCompositeOperation = "lighter";
};

sketch.update = function () {
  let i = orbs.length;
  options.total = i;
  while (i--) {
    orbs[i].update();
  }
};

sketch.draw = function () {
  sketch.save();
  sketch.translate(center.x, center.y);
  sketch.scale(options.scale, options.scale);
  let i = orbs.length;
  while (i--) {
    orbs[i].render();
  }
  sketch.restore();
};

gui = new dat.GUI({ autoPlace: false });
gui.add(options, "total").name("Total Orbitals").listen();
gui.add(options, "speed").min(-300).max(300).step(1).name("Speed");
gui.add(options, "scale").min(0.5).max(5).step(0.001).name("Scale");
gui
  .add(options, "jitterRadius")
  .min(0)
  .max(10)
  .step(0.001)
  .name("Radius Jitter");
gui.add(options, "jitterHue").min(0).max(90).step(1).name("Hue Jitter");
gui.add(options, "clearAlpha").min(0).max(100).step(1).name("Clear Alpha");
gui.add(options, "toggleOrbitals").name("Toggle Orbitals");
gui.add(options, "orbitalAlpha").min(0).max(100).step(1).name("Orbital Alpha");
gui.add(options, "toggleLight").name("Toggle Light");
gui.add(options, "lightAlpha").min(0).max(100).step(1).name("Light Alpha");

gui.add(options, "clear").name("Clear");

const customContainer = document.getElementById("gui");
customContainer.appendChild(gui.domElement);

document.onselectstart = function () {
  return false;
};
