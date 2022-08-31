const c = document.getElementById("c");
const ctx = c.getContext("2d");

let cW, cH;
let bgColor = "#FF6138";
const animations = [];
const circles = [];
const PARTICLE_SIZE = 32;

class ColorPicker {
  static colors = ["#FF6138", "#FFBE53", "#2980B9", "#282741"];
  s;
  static index = 0;
  static next() {
    this.index = this.index++ >= this.colors.length - 1 ? 0 : this.index;
    return this.colors[this.index];
  }
  static current() {
    return this.colors[this.index];
  }
}

class Circle {
  x;
  y;
  r;
  fill;
  opacity;
  size;
}

function removeAnimation(animation) {
  var index = animations.indexOf(animation);
  if (index > -1) animations.splice(index, 1);
}

function calcPageFillRect(x, y) {
  const l = Math.max(x, cW - x);
  const h = Math.max(y, cH - y);
  return Math.sqrt(l * l + h * h);
}

function addClickListeners() {
  document.addEventListener("touchstart", handler);
  document.addEventListener("mousedown", handler);
}

function handler(e) {
  if ("touches" in e) {
    e.preventDefault();
    e = e.touches[0];
  }

  const currentColor = ColorPicker.current();
  const nextColor = ColorPicker.next();
  const targetRadius = calcPageFillRect(e.pageX, e.pageY);
  const minCoverDuration = 750;

  const pageFill = new Circle();
  pageFill.x = e.pageX;
  pageFill.y = e.pageY;
  pageFill.r = 0;
  pageFill.fill = nextColor;

  const fillAnimation = anime({
    targets: pageFill,
    r: targetRadius,
    duration: Math.max(targetRadius / 2, minCoverDuration),
    easing: "easeOutQuart",
    complete: function () {
      bgColor = pageFill.fill;
      removeAnimation(fillAnimation);
    },
  });

  const ripple = new Circle();
  ripple.x = e.pageX;
  ripple.y = e.pageY;
  ripple.r = 0;
  ripple.fill = currentColor;
  ripple.opacity = 1;
  ripple.size = Math.min(200, cW * 0.4);

  const rippleAnimation = anime({
    targets: ripple,
    r: ripple.size,
    easing: "easeOutExpo",
    opacity: 0,
    duration: 900,
    complete: removeAnimation,
  });

  const particles = [];
  for (let i = 0; i < PARTICLE_SIZE; i++) {
    const particle = new Circle();
    particle.x = e.pageX;
    particle.y = e.pageY;
    particle.fill = currentColor;
    particle.r = anime.random(24, 48);
    particle.size = Math.min(200, cW * 0.4);
    particles.push(particle);
  }

  const particleAnimations = anime({
    targets: particles,
    x: function (p) {
      return p.x + anime.random(p.size, -p.size);
    },
    y: function (p) {
      return p.y + anime.random(p.size, -p.size);
    },
    r: 0,
    easing: "easeOutExpo",
    duration: anime.random(1000, 1300),
    complete: removeAnimation,
  });

  animations.push(fillAnimation, rippleAnimation, particleAnimations);
}

Circle.prototype.draw = function () {
  ctx.globalAlpha = this.opacity || 1;
  ctx.beginPath();
  ctx.arc(this.x, this.y, this.r, 0, 2 * Math.PI, false);

  if (this.fill) {
    ctx.fillStyle = this.fill;
    ctx.fill();
  }

  ctx.closePath();
  ctx.globalAlpha = 1;
};

const animate = anime({
  duration: Infinity,
  update: function () {
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, cW, cH);
    animations.forEach(function (anim) {
      anim.animatables.forEach(function (animatable) {
        animatable.target.draw();
      });
    });
  },
});

function resizeCanvas() {
  cW = innerWidth;
  cH = innerHeight;
  c.width = cW * devicePixelRatio;
  c.height = cH * devicePixelRatio;
  ctx.scale(devicePixelRatio, devicePixelRatio);
}

(function init() {
  resizeCanvas();
  window.addEventListener("resize", resizeCanvas, false);
  addClickListeners();
  handleInactiveUser();
})();

function handleInactiveUser() {
  var inactive = setTimeout(function () {
    fauxClick(cW / 2, cH / 2);
  }, 2000);

  function clearInactiveTimeout() {
    clearTimeout(inactive);
    document.removeEventListener("mousedown", clearInactiveTimeout);
    document.removeEventListener("touchstart", clearInactiveTimeout);
  }

  document.addEventListener("mousedown", clearInactiveTimeout);
  document.addEventListener("touchstart", clearInactiveTimeout);
}

function fauxClick(x, y) {
  var fauxClick = new Event("mousedown");
  fauxClick.pageX = x;
  fauxClick.pageY = y;
  document.dispatchEvent(fauxClick);
}
