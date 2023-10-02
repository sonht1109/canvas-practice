document.addEventListener("DOMContentLoaded", function(){
  var canvas = document.createElement('canvas');
  document.body.appendChild(canvas);

  var c = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  document.addEventListener('resize', function(){
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
  })

  canvas.style.background = 'black';

  var mouse = {
      x: undefined,
      y: undefined
  }

  const colors = [
      'red', 'white', 'blue', 'purple', 'green', 'yellow', 'orange', 'pink',
      '#46FC35', '#35C9FC'
  ];

  let countClick = 0;

  function Circle(){
      this.x = mouse.x;
      this.y = mouse.y;
      this.radius = Math.random() * 3 + 1;
      this.color = colors[Math.floor(Math.random() * colors.length)];
      this.v = {
          x: Math.random() * 4 - 2,
          y: Math.random() * 4 - 2
      }
      this.last = 80;
  }

  Circle.prototype.draw = function(){
      c.beginPath();
      c.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      c.fillStyle = this.color;
      c.fill();
      c.closePath();
  }

  Circle.prototype.update = function(){
      this.x += this.v.x;
      this.y += this.v.y;
      this.last --;
      this.draw();
  }

  document.addEventListener('mousemove', function(){
      mouse.x = event.clientX;
      mouse.y = event.clientY;
  })

  document.addEventListener('click', function(){
      countClick ++;
  })

  var circles = [];

  function init(){
      for(let i = 0; i<10; i++){
          circles.push(new Circle());
      }
  }

  function animate(){
      window.requestAnimationFrame(animate);
      if(countClick % 2){
          c.fillStyle = 'rgba(0, 0, 0, 0.15)';
          c.fillRect(0, 0, canvas.width, canvas.height);
      }
      else{
          c.clearRect(0, 0, canvas.width, canvas.height);
      }
      init();
      circles.forEach(function(i,idx){
          i.update();
          if(i.last < 0){
              circles.splice(idx, 1);
          }
      });
  }

  animate();
})