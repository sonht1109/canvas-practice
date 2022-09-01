const sketch = Sketch.create();
const skylines = [];
const LAYER_COUNT = 5;
let dt = 1; // peroid betwwen previous frame and current frame / 16;

sketch.mouse.x = sketch.width / 10;
sketch.mouse.y = sketch.height;

const random = function (min, max) {
  return min + Math.random() * (max - min);
};

class Building {
  x;
  y;
  layer;
  width;
  height;
  color;
  slantedTop = Math.random() <= 0.2;
  slantedTopHeight;
  slantedTopDirection = Math.random() <= 0.5;
  sprireTop = Math.random() <= 0.2;
  sprireTopWidth;
  spireTopHeight = random(10, 20);
  antennaTop = !this.sprireTop && Math.random() <= 0.1;
  antennaTopWidth;
  antennaTopHeight = random(5, 20);
  constructor(x, y, layer, width, height, color) {
    this.x = x;
    this.y = y;
    this.layer = layer;
    this.width = width;
    this.height = height;
    this.color = color;
    this.slantedTopHeight = this.width / random(2, 4);
    this.sprireTopWidth = this.sprireTop
      ? random(this.width * 0.1, this.width * 0.7)
      : 0;
    this.antennaTopWidth = this.antennaTop ? this.layer / 2 : 0;
  }
}

Building.prototype.render = function () {
  sketch.fillStyle = this.color;
  sketch.strokeStyle = this.color;
  sketch.lineWidth = 2;
  sketch.beginPath();
  sketch.rect(this.x, this.y, this.width, this.height);
  sketch.fill();
  sketch.stroke();

  if (this.slantedTop) {
    sketch.beginPath();
    sketch.moveTo(this.x, this.y);
    sketch.lineTo(this.x + this.width, this.y);
    sketch.lineTo(
      this.slantedTopDirection ? this.x + this.width : this.x,
      this.y - this.slantedTopHeight
    );
    sketch.closePath();
    sketch.fill();
    sketch.stroke();
  }

  if (this.sprireTop) {
    sketch.beginPath();
    sketch.moveTo(this.x + this.width / 2, this.y - this.spireTopHeight);
    sketch.lineTo(this.x + this.width / 2 + this.sprireTopWidth, this.y);
    sketch.lineTo(this.x + this.width / 2 - this.sprireTopWidth, this.y);
    sketch.closePath();
    sketch.fill();
    sketch.stroke();
  }

  if (this.antennaTop) {
    sketch.beginPath();
    sketch.moveTo(
      this.x + this.antennaTopWidth,
      this.y - this.antennaTopHeight
    );
    sketch.lineTo(this.x + this.antennaTopWidth, this.y);
    sketch.lineWidth = this.antennaTopWidth;
    sketch.stroke();
  }
};

class Skyline {
  x = 0;
  buildings = [];
  layer;
  width = {
    min,
    max,
  };
  height = {
    min,
    max,
  };
  speed;
  color;
  constructor(layer, width, height, color, speed) {
    this.layer = layer;
    this.width.min = width.min;
    this.width.max = width.max;
    this.height.min = height.min;
    this.height.max = height.max;
    this.color = color;
    this.speed = speed;
    this.populate();
  }
  get buildingWidth() {
    return Math.round(random(this.width.min, this.width.max));
  }
  get buildingHeight() {
    return Math.round(random(this.height.min, this.height.max));
  }
  get lastBuilding() {
    return this.buildings.length > 0
      ? this.buildings[this.buildings.length - 1]
      : null;
  }
}

Skyline.prototype.populate = function () {
  let totalWidth = 0;
  const res = [];
  while (totalWidth <= sketch.width + this.width.max * 2) {
    const buildingX = this.lastBuilding
      ? this.lastBuilding.x + this.lastBuilding.width
      : 0;

    const buildingHeight = this.buildingHeight;
    const buildingY = sketch.height - buildingHeight;
    const buildingWidth = this.buildingWidth;

    const building = new Building(
      buildingX,
      buildingY,
      this.layer,
      buildingWidth,
      buildingHeight,
      this.color
    );

    this.buildings.push(building);
    res.push((totalWidth += buildingWidth));
  }
  return res;
};

Skyline.prototype.update = function () {
  this.x -= sketch.mouse.x * this.speed * dt; // TODO
  const firstBuilding = this.buildings[0];
  if (firstBuilding.width + firstBuilding.x + this.x < 0) {
    if (this.lastBuilding) {

      const buildingHeight = this.buildingHeight

      firstBuilding.x = this.lastBuilding.x + this.lastBuilding.width;
      firstBuilding.y = sketch.height - buildingHeight;
      firstBuilding.height = buildingHeight;
      this.buildings.push(this.buildings.shift());
    }
  }
};

Skyline.prototype.render = function () {
  let i = this.buildings.length;
  sketch.save();
  sketch.translate(
    this.x,
    ((sketch.height - sketch.mouse.y) / 20) * this.layer
  ); // TODO;
  while (i--) {
    this.buildings[i].render();
  }
  sketch.restore();
};

sketch.setup = function () {
  let i = LAYER_COUNT;
  while (i--) {
    skylines.push(
      new Skyline(
        i + 1,
        { min: (i + 1) * 30, max: (i + 1) * 40 },
        { min: 150 - i * 35, max: 300 - i * 35 },
        "hsl( 200, " + ((i + 1) * 1 + 10) + "%, " + (75 - i * 13) + "% )",
        (i + 1) * 0.003
      )
    );
  }
};

sketch.clear = function () {
  return sketch.clearRect(0, 0, sketch.width, sketch.height);
};

sketch.update = function () {
  let i = LAYER_COUNT;
  dt = sketch.dt < 0.1 ? 0.1 : sketch.dt / 16;
  dt = dt > 5 ? 5 : dt;
  while (i--) {
    skylines[i].update();
  }
};

sketch.draw = function () {
  let i = LAYER_COUNT;
  while (i--) {
    skylines[i].render();
  }
};

window.addEventListener("mousemove", function (e) {
  sketch.mouse.x = e.pageX;
  sketch.mouse.y = e.pageY;
});
