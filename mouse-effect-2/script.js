document.addEventListener("DOMContentLoaded", function () {
  var canvas = document.getElementsByTagName("canvas")[0];
  var c = canvas.getContext("2d");
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  canvas.style.background = "black";

  document.addEventListener("resize", function () {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    init();
  });

  const mouse = {
    x: undefined,
    y: undefined,
  };

  const colors = ["#2221C2", "#06CC9F", "#8CB33C", "#C9943A", "#C20617"];

  const maxRadius = 40;
  const minRadius = 8;

  // tao su kien di chuot
  document.addEventListener("mousemove", function () {
    mouse.x = event.clientX;
    mouse.y = event.clientY;
  });

  // ham tao vong tron
  class Circle {
    constructor(x, y, radius, color) {
      this.x = x;
      this.y = y;
      this.radius = radius;
      this.color = color;
      this.velocity = {
        // tao van toc random tu -2 toi 2
        x: Math.random() * 4 - 2,
        y: Math.random() * 4 - 2,
      };
    }
    // ve vong tron
    draw() {
      c.save();
      c.beginPath();
      c.arc(this.x, this.y, this.radius, 0, 2 * Math.PI); // ve vong tron
      c.fillStyle = this.color;
      // c.shadowColor = this.color;
      // c.shadowBlur = 5;
      c.fill(); // thuc hien to mau
      c.closePath();
      c.restore();

      // them chu
      // c.beginPath();
      // c.font = "20px segoe ui";
      // c.fillText("Vy vy", mouse.x, mouse.y);
      // c.fillStyle = 'red';
      // c.textAlign = 'center'
      // c.shadowColor = 'white';
      // c.fill();
      // c.closePath();
      // c.restore();
    }
    // tao chuyen dong
    update() {
      this.x += this.velocity.x;
      this.y += this.velocity.y;
      if (
        mouse.x - this.x < 75 &&
        mouse.x - this.x > -75 &&
        mouse.y - this.y < 75 &&
        mouse.y - this.y > -75
      ) {
        if (this.radius <= maxRadius) {
          this.radius += 1;
        }
      } else {
        if (this.radius >= minRadius) {
          this.radius -= 1;
        }
      }
      this.draw();
      this.colission();
    }
    // tao va cham
    colission() {
      if (this.x >= canvas.width || this.x <= 0) {
        this.velocity.x = -this.velocity.x;
      }
      if (this.y >= canvas.height || this.y <= 0) {
        this.velocity.y = -this.velocity.y;
      }
    }
  }

  // tao toa do cho cac vong tron
  function createX() {
    return Math.floor(Math.random() * canvas.width);
  }
  function createY() {
    return Math.floor(Math.random() * canvas.height);
  }

  // tao mau
  function createColor() {
    return colors[Math.floor(Math.random() * colors.length)];
  }

  // khoi tao
  let arrayCirle;
  function init() {
    arrayCirle = [];
    for (let i = 0; i < 500; i++) {
      arrayCirle.push(new Circle(createX(), createY(), 6, createColor()));
    }
  }

  // tao chuyen dong
  function animate() {
    window.requestAnimationFrame(animate);
    c.clearRect(0, 0, canvas.width, canvas.height);
    arrayCirle.forEach((circle) => {
      circle.update();
    });
  }

  init();
  animate();
});
