var canvas = document.getElementById("pong_game");
var ctx = canvas.getContext("2d");
canvas.width = 500;
canvas.height = 500;
var p1score = 0;
var p2score = 0;
var cooldown = 5000;
var cd_SLOWDOWN_P1 = Date.now();
var cd_SPEEEEEED_P1 = Date.now();
var cd_DYNAMAX_P1 = Date.now();
var cd_SLOWDOWN_P2 = Date.now();
var cd_SPEEEEEED_P2 = Date.now();
var cd_DYNAMAX_P2 = Date.now();
var slowdown_active_p1 = false;
var faster_active_p1 = false;
var dynamax_active_p1 = false;
var slowdown_active_p2 = false;
var faster_active_p2 = false;
var dynamax_active_p2 = false;
var p1, p2, b;

window.onload = function () {
  // run the game on window

  p1 = new player1(10, canvas.height / 2);
  p2 = new player2(canvas.width - 20, canvas.height / 2);
  b = new ball(canvas.width / 2, canvas.height / 2);

  document.addEventListener("keydown", p1.move.bind(p1)); // check p1 associated keydown (pressed) (.bind to make sure it can get correct this.value)
  document.addEventListener("keydown", p2.move.bind(p2)); // p2
  document.addEventListener("keyup", p1.keyUP.bind(p1)); // check p1 associated keyup (release)
  document.addEventListener("keyup", p2.keyUP.bind(p2)); // p2
  document.addEventListener("keydown", function (exe) {
    // associated skill button down
    switch (
      exe.code //switch ... case... statement
    ) {
      case "KeyC":
        slowdown_active_p1 = true;
        break;
      case "KeyF":
        faster_active_p1 = true;
        break;
      case "KeyG":
        dynamax_active_p1 = true;
        break;
      case "KeyM":
        slowdown_active_p2 = true;
        break;
      case "KeyK":
        faster_active_p2 = true;
        break;
      case "KeyL":
        dynamax_active_p2 = true;
        break;
      default:
    }
  });

  function gameloop() {
    if (b.x < 0) {
      p2score++;
      b.xspeed *= -1;
    }
    if (b.x > 500) {
      p1score++;
      b.xspeed *= -1;
    }

    if (b.x < 0 || b.x > 500) {
      //reset the ball
      b.x = canvas.width / 2;
      b.y = canvas.height / 2;
    }

    b.move(p1, p2); // flip function

    ctx.fillStyle = "black"; // internal css with canvas ctx
    ctx.fillRect(0, 0, 500, 500);

    for (let i = 15; i < 500; i += 20) {
      ctx.fillStyle = "white";
      ctx.fillRect(250, i, 2, 2);
    }

    ctx.font = "100px 'Roboto'";
    ctx.textAlign = "center";
    ctx.shadowcolor = "gery";
    ctx.shadowBlur = 10;
    ctx.lineJoin = "bevel";
    ctx.lineWidth = 5;

    ctx.fillText(p1score, canvas.width * 0.25, canvas.height / 2 + 75);

    ctx.font = "100px 'Roboto'";
    ctx.textAlign = "center";
    ctx.shadowcolor = "gery";
    ctx.shadowBlur = 10;
    ctx.lineJoin = "bevel";
    ctx.lineWidth = 5;

    ctx.fillText(p2score, canvas.width * 0.75, canvas.height / 2 + 75);

    p1.draw(ctx); // draw p1 out
    p2.draw(ctx);
    b.draw(ctx);

    if (p1score >= 10 || p2score >= 10) {
      // reset whole game function
      var winner = p1score >= 10 ? "Player 1" : "Player 2";
      p1score = 0;
      p2score = 0;
      setTimeout(function () {
        alert("Congratulations " + winner + ", You win!");
        var restart = confirm("Do you want to play again?");
        if (restart) {
          b.x = canvas.width / 2;
          b.y = canvas.height / 2;
          p1.y = canvas.height / 2;
          p2.y = canvas.height / 2;
          b.xspeed = 3;
          p1.height = 50;
          p2.height = 50;
          cd_SLOWDOWN_P1 = Date.now();
          cd_SPEEEEEED_P1 = Date.now();
          cd_DYNAMAX_P1 = Date.now();
          cd_SLOWDOWN_P2 = Date.now();
          cd_SPEEEEEED_P2 = Date.now();
          cd_DYNAMAX_P2 = Date.now();
        } else {
          alert(
            "Goodbye (•ᴖ•｡) please click the x button in the upper corner ↖ "
          );
          window.close(); //cant work because of security features
        }
      }, 5);
    }

    updatecooldowndisplayandrun(); // call
  }

  setInterval(gameloop, 1000 / 60); // frame 60 fps
};
// function of update the skill cd
function updatecooldowndisplayandrun() {
  var current = Date.now();
  var cooldowns = [
    {
      id: "SLOWDOWN_P1",
      value: Math.max(
        0,
        Math.ceil((cooldown - (current - cd_SLOWDOWN_P1)) / 1000)
      ),
    }, // 10000-( every 0.01667( gaemloop call itself)... second update time - the game starting time) til it is 0(max will only show 0 if the time is negative) the game starting time will become the last time of skill be active since skill had been used
    {
      id: "SPEEEEEED_P1",
      value: Math.max(
        0,
        Math.ceil((cooldown - (current - cd_SPEEEEEED_P1)) / 1000)
      ),
    },
    {
      id: "SLOWDOWN_P2",
      value: Math.max(
        0,
        Math.ceil((cooldown - (current - cd_SLOWDOWN_P2)) / 1000)
      ),
    },
    {
      id: "SPEEEEEED_P2",
      value: Math.max(
        0,
        Math.ceil((cooldown - (current - cd_SPEEEEEED_P2)) / 1000)
      ),
    },
    {
      id: "DYNAMAX_P1",
      value: Math.max(
        0,
        Math.ceil((cooldown - (current - cd_DYNAMAX_P1)) / 1000)
      ),
    },
    {
      id: "DYNAMAX_P2",
      value: Math.max(
        0,
        Math.ceil((cooldown - (current - cd_DYNAMAX_P2)) / 1000)
      ),
    },
  ]; // list

  cooldowns.forEach(function (cooldown) {
    // foreach almost = forloop which can only use for list object and it will run all item in the list
    if (
      cooldown.id == "DYNAMAX_P1" &&
      dynamax_active_p1 &&
      cooldown.value <= 0
    ) {
      p1.height = 100; // only associated key is pressed and cd time <= 0 this will be execute
      cd_DYNAMAX_P1 = current + 5000; // reset the cd time

      var popup1 = document.createElement("div"); // put gif on the website
      popup1.style.position = "absolute";
      popup1.style.left = "50px";
      popup1.style.top = "50%";
      popup1.style.width = "100px";
      popup1.style.height = "120px";
      var img = document.createElement("img");
      img.src = "pikachu.gif";
      popup1.appendChild(img);
      document.body.appendChild(popup1);

      setTimeout(function () {
        p1.height = 50;
        dynamax_active_p1 = false;
        document.body.removeChild(popup1);
      }, 5000); // which will delay 5 second = the skill will work 5 second
    } else if (
      cooldown.id == "SLOWDOWN_P1" &&
      slowdown_active_p1 &&
      cooldown.value <= 0
    ) {
      b.xspeed = b.xspeed < 0 ? -2 : 2; // in order to avoid suddenly make the ball filp without needed
      cd_SLOWDOWN_P1 = current + 5000;

      var popup3 = document.createElement("div");
      popup3.style.position = "absolute";
      popup3.style.left = "480px";
      popup3.style.top = "80%";
      popup3.style.width = "100px";
      popup3.style.height = "120px";
      var img = document.createElement("img");
      img.src = "slowdown.png";
      img.style.width = "100px";
      img.style.height = "120px";
      popup3.appendChild(img);
      document.body.appendChild(popup3);

      setTimeout(function () {
        b.xspeed = b.xspeed < 0 ? -3 : 3; // reset the speed of the ball
        slowdown_active_p1 = false;
        document.body.removeChild(popup3);
      }, 2000); // which will delay 2 second = the skill will work 2 second
    } else if (
      cooldown.id == "SPEEEEEED_P1" &&
      faster_active_p1 &&
      cooldown.value <= 0
    ) {
      b.xspeed = b.xspeed < 0 ? -6 : 6;
      cd_SPEEEEEED_P1 = current + 5000;

      var popup4 = document.createElement("div");
      popup4.style.position = "absolute";
      popup4.style.left = "500px";
      popup4.style.top = "80%";
      popup4.style.width = "100px";
      popup4.style.height = "120px";
      var img = document.createElement("img");
      img.src = "speedup.png";
      img.style.width = "100px";
      img.style.height = "120px";
      popup4.appendChild(img);
      document.body.appendChild(popup4);

      setTimeout(function () {
        b.xspeed = b.xspeed < 0 ? -3 : 3;
        faster_active_p1 = false;
        document.body.removeChild(popup4);
      }, 2000);
    } else if (
      cooldown.id == "DYNAMAX_P2" &&
      dynamax_active_p2 &&
      cooldown.value <= 0
    ) {
      p2.height = 100;
      cd_DYNAMAX_P2 = current + 5000;

      var popup2 = document.createElement("div");
      popup2.style.position = "absolute";
      popup2.style.right = "300px";
      popup2.style.top = "50%";
      popup2.style.width = "100px";
      popup2.style.height = "120px";
      var img = document.createElement("img");
      img.src = "genger.gif";
      popup2.appendChild(img);
      document.body.appendChild(popup2);

      setTimeout(function () {
        p2.height = 50;
        dynamax_active_p2 = false;
        document.body.removeChild(popup2);
      }, 5000);
    } else if (
      cooldown.id == "SLOWDOWN_P2" &&
      slowdown_active_p2 &&
      cooldown.value <= 0
    ) {
      b.xspeed = b.xspeed < 0 ? -2 : 2;
      cd_SLOWDOWN_P2 = current + 5000;

      var popup5 = document.createElement("div");
      popup5.style.position = "absolute";
      popup5.style.right = "500px";
      popup5.style.top = "80%";
      popup5.style.width = "100px";
      popup5.style.height = "120px";
      var img = document.createElement("img");
      img.src = "slowdown.png";
      img.style.width = "100px";
      img.style.height = "120px";
      popup5.appendChild(img);
      document.body.appendChild(popup5);

      setTimeout(function () {
        b.xspeed = b.xspeed < 0 ? -3 : 3;
        slowdown_active_p2 = false;
        document.body.removeChild(popup5);
      }, 2000);
    } else if (
      cooldown.id == "SPEEEEEED_P2" &&
      faster_active_p2 &&
      cooldown.value <= 0
    ) {
      b.xspeed = b.xspeed < 0 ? -6 : 6;
      cd_SPEEEEEED_P2 = current + 5000;

      var popup6 = document.createElement("div");
      popup6.style.position = "absolute";
      popup6.style.right = "480px";
      popup6.style.top = "80%";
      popup6.style.width = "100px";
      popup6.style.height = "120px";
      var img = document.createElement("img");
      img.src = "speedup.png";
      img.style.width = "100px";
      img.style.height = "120px";
      popup6.appendChild(img);
      document.body.appendChild(popup6);

      setTimeout(function () {
        b.xspeed = b.xspeed < 0 ? -3 : 3;
        faster_active_p2 = false;
        document.body.removeChild(popup6);
      }, 2000);
    }
  });

  cooldowns.forEach(function (cooldown) {
    // foreach almost = forloop but only can use for list object and it will run all item in the list
    var element = document.getElementById(cooldown.id);
    element.innerHTML = cooldown.id + ": " + cooldown.value + "s";
    if (cooldown.id == "DYNAMAX_P1") {
      element.style.color = cooldown.value > 0 ? "red" : "yellow"; // if cooldown.value >0 ? true : false
    } else if (cooldown.id == "DYNAMAX_P2") {
      element.style.color = cooldown.value > 0 ? "red" : "rgb(78 4 177)";
    } else {
      element.style.color = cooldown.value > 0 ? "red" : "lightgreen";
    }
  });
}
