const c = document.getElementById("canvas");
const ctx = c.getContext("2d");

function resize() {
  c.width = window.innerWidth;
  c.height = window.innerHeight;
}

const light = {
  x: 160,
  y: 200,
};

const colors = ["#f5c156", "#e6616b", "#5cd3ad"];

const boxes = [];

const LIGHT_R = 1000;
const SHADOW_LENGTH = 2000;

function drawLight() {
  let grd = ctx.createRadialGradient(
    light.x,
    light.y,
    0,
    light.x,
    light.y,
    LIGHT_R
  );
  ctx.beginPath();
  ctx.arc(light.x, light.y, LIGHT_R, 0, Math.PI * 2, false);
  grd.addColorStop(0, "#3b4654");
  grd.addColorStop(1, "#2c343f");
  ctx.fillStyle = grd;
  ctx.fill();

  ctx.beginPath();
  ctx.arc(light.x, light.y, 20, 0, Math.PI * 2, false);

  grd = ctx.createRadialGradient(light.x, light.y, 0, light.x, light.y, 5);
  grd.addColorStop(0, "#fff");
  grd.addColorStop(1, "#3b4654");
  ctx.fillStyle = grd;
  ctx.fill();
}

class Box {
  constructor() {
    this.half_size = Math.floor(Math.random() * 50 + 1);
    this.x = Math.floor(Math.random() * c.width + 1);
    this.y = Math.floor(Math.random() * c.height + 1);
    this.r = Math.random() * Math.PI;
    this.shadow_length = SHADOW_LENGTH;
    this.color = colors[Math.floor(Math.random() * colors.length)];

    this.getDots = function () {
      const quarter = (Math.PI * 2) / 4;

      const p1 = {
        x: this.x + this.half_size * Math.sin(this.r),
        y: this.y + this.half_size * Math.cos(this.r),
      };
      const p2 = {
        x: this.x + this.half_size * Math.sin(this.r + quarter),
        y: this.y + this.half_size * Math.cos(this.r + quarter),
      };
      const p3 = {
        x: this.x + this.half_size * Math.sin(this.r + quarter * 2),
        y: this.y + this.half_size * Math.cos(this.r + quarter * 2),
      };
      const p4 = {
        x: this.x + this.half_size * Math.sin(this.r + quarter * 3),
        y: this.y + this.half_size * Math.cos(this.r + quarter * 3),
      };

      return {
        p1: p1,
        p2: p2,
        p3: p3,
        p4: p4,
      };
    };
    this.rotate = function () {
      const speed = (60 - this.half_size) / 20;
      // this.r += speed * 0.002;
      // this.x += speed;
      // this.y += speed;
    };
    this.draw = function () {
      const dots = this.getDots();
      ctx.beginPath();
      ctx.moveTo(dots.p1.x, dots.p1.y);
      ctx.lineTo(dots.p2.x, dots.p2.y);
      ctx.lineTo(dots.p3.x, dots.p3.y);
      ctx.lineTo(dots.p4.x, dots.p4.y);
      ctx.fillStyle = this.color;
      ctx.fill();

      if (this.y - this.half_size > c.height) {
        this.y -= c.height + 100;
      }
      if (this.x - this.half_size > c.width) {
        this.x -= c.width + 100;
      }
    };
    this.drawShadow = function () {
      const dots = this.getDots();
      const angles = [];
      const points = [];

      for (let dot in dots) {
        const angle = Math.atan2(light.y - dots[dot].y, light.x - dots[dot].x);
        const endX =
          dots[dot].x + this.shadow_length * Math.sin(-angle - Math.PI / 2);
        const endY =
          dots[dot].y + this.shadow_length * Math.cos(-angle - Math.PI / 2);
        angles.push(angle);
        points.push({
          endX: endX,
          endY: endY,
          startX: dots[dot].x,
          startY: dots[dot].y,
        });
      }

      for (let i = points.length - 1; i >= 0; i--) {
        let n = i == 3 ? 0 : i + 1;
        ctx.beginPath();
        ctx.moveTo(points[i].startX, points[i].startY);
        ctx.lineTo(points[n].startX, points[n].startY);
        ctx.lineTo(points[n].endX, points[n].endY);
        ctx.lineTo(points[i].endX, points[i].endY);
        ctx.fillStyle = "#2c343f";
        ctx.fill();
      }
    };
  }
}

while (boxes.length < 1) {
  boxes.push(new Box());
}

function draw() {
  ctx.clearRect(0, 0, c.width, c.height);
  drawLight();

  for (var i = 0; i < boxes.length; i++) {
    boxes[i].rotate();
    boxes[i].drawShadow();
  }
  for (var i = 0; i < boxes.length; i++) {
    boxes[i].draw();
  }
  requestAnimationFrame(draw);
}

resize();
draw();

window.onresize = resize;
c.onmousemove = function (e) {
  light.x = e.offsetX == undefined ? e.layerX : e.offsetX;
  light.y = e.offsetY == undefined ? e.layerY : e.offsetY;
};
