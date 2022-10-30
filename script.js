//----------ALIASES/VARIABLES----------
const Application = PIXI.Application,
  Pointer = new PIXI.FederatedPointerEvent(), GraphicsGeometry = PIXI.GraphicsGeometry,
  World = new PIXI.Container;
Container = PIXI.Container,
  Navigator = window.navigator,
  Assets = PIXI.Assets,
  utils = PIXI.utils,
  ticker = PIXI.Ticker.shared,
  id = utils.TextureCache
Sprite = PIXI.Sprite,
  Rectangle = PIXI.Rectangle,
  Text = PIXI.Text;
let spriteRef = [], cube, info, joy, stick, mx, my, mx2, my2, stickh, stickl, stickang, stickh2, stickl2, stickang2, joy2, stick2, touchR = 0, touchL = 0, time = 0;
//console.log(utils.isMobile)
//----------GLOBAL FUNCTIONS----------
function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
function isTouching(spr1, spr2) {
  let c1 = [spr1.x, spr1.y]
  let c2 = [spr2.x, spr2.y]
  let dx = Math.abs(c1[0] - c2[0])
  let dy = Math.abs(c1[1] - c2[1])
  if (spr1.width + spr2.width / 2 > dx && spr1.height + spr2.height / 2 > dy) {
    return [spr1.width + spr2.width / 2 > dx, spr1.height + spr2.height / 2 > dy]
  } else {
    return false
  }
}
function calcAngle(horiL, vertL) {
  return Math.atan2(vertL, horiL)
}
function calcDistance(x1, y1, x2, y2) {
  return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2)
}
function setCookie(cname, cvalue, exdays) {
  const d = new Date();
  d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
  let expires = "expires=" + d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
  let name = cname + "=";
  let ca = document.cookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}
//----------SETUP----------
let app = new Application({
  width: 512,
  height: 512,
  antialias: true,
  resolution: 1,
});
app.resizeTo = window;
document.body.appendChild(app.view);
Assets.add("stick", "textures/stick.png")
Assets.add("spritesheet", "textures/spritesheet.json")
const texturePromise = Assets.load(['spritesheet', "stick"]);

texturePromise.then((resolvedTexture) => {
  window.onresize = () => { location.reload(); }
  console.log(resolvedTexture)
  cube = new Sprite(id["cube1.png"]);
  cube.anchor.set(.5)
  cube.x = app.screen.width / 2
  cube.y = app.screen.height / 2
  //"const scrHitArea = new Rectangle(-(app.screen.width/2), -(app.screen.height/2), app.screen.width, app.screen.height)"
  app.stage.addChild(cube);
  initJoySticks();
  app.stage.addChild(stick);
  app.stage.addChild(stick2);
  initText();
  window.requestAnimationFrame(gameLoop);
});
function initJoySticks() {
  stick = new Sprite(id["stick"])
  stick.anchor.set(.5)
  stick.x = app.screen.width / 8
  stick.y = app.screen.height * .8
  stick.scale.set(.2)
  joy = new PIXI.Graphics();
  joy.lineStyle(0);
  joy.beginFill(0xDE3249, 1);
  joy.drawCircle(app.screen.width / 8, app.screen.height * .8, 70);
  joy.endFill();
  //joystick 2 electric boogaloo
  stick2 = new Sprite(id["stick"])
  stick2.anchor.set(.5)
  stick2.x = app.screen.width * .875
  stick2.y = app.screen.height * .9
  stick2.scale.set(.2)
  joy.beginFill(0xDE3249, 1);
  joy.drawCircle(app.screen.width * .875, app.screen.height * .8, 70);
  joy.endFill();
  app.stage.addChild(joy);
}
function initText() {
  info = new Text('hello', {
    fontFamily: 'Courier New',
    fontSize: 24,
    fill: 0xff1010,
    align: 'left',
  });
  info.x = 0
  info.y = 0
  app.stage.addChild(info)
}
//condition ? exprIfTrue : exprIfFalse
document.addEventListener('pointermove', (event) => {
  app.screen.width / 2 >= event.clientX ? mx = event.clientX : mx2 = event.clientX
  app.screen.width / 2 >= event.clientX ? my = event.clientY : my2 = event.clientY
  moveStick();
})
document.addEventListener('pointerdown', (event) => {
  app.screen.width / 2 >= event.clientX ? (mx = event.clientX, touchL++) : (mx2 = event.clientX - app.screen.width / 2, touchR++)
  app.screen.width / 2 >= event.clientX ? my = event.clientY : my2 = event.clientY
  moveStick();

});
document.addEventListener('pointerout', (event) => {
  console.log(`${event.clientX} aaa ${""}`);
  if (mx2 === event.clientX && my2 === event.clientY) {
    touchR--;
    stick2.x = app.screen.width * .875
    stick2.y = app.screen.height * .8
    mx2 = 0
    my2 = 0
  }
  if (mx === event.clientX && my === event.clientY) {
    touchL--;
    stick.x = app.screen.width / 8
    stick.y = app.screen.height * .8
    mx = 0
    my = 0
  }
});
function moveStick() {
  stickang = calcAngle(mx - app.screen.width / 8, my - app.screen.height * .8)
  stickh = Math.sin(stickang) / .02
  stickl = Math.sin((Math.PI / 2) - stickang) / .02
  stickang2 = calcAngle(mx2 - app.screen.width * .875, my2 - app.screen.height * .8)
  stickh2 = Math.sin(stickang2) / .02
  stickl2 = Math.sin((Math.PI / 2) - stickang2) / .02
  if (touchL > 0) {
    if (calcDistance(mx - app.screen.width / 8, my - app.screen.height * .8, 0, 0) <= 50) {
      stick.x = mx
      stick.y = my
    } else {
      stick.position.set((app.screen.width / 8) + stickl, (app.screen.height * .8) + stickh)
    }
  }
  if (touchR > 0) {
    if (calcDistance(mx2 - app.screen.width * .875, my2 - app.screen.height * .8, 0, 0) <= 50) {
      stick2.x = mx2
      stick2.y = my2
    } else {
      stick2.position.set((app.screen.width * .875) + stickl2, (app.screen.height * .8) + stickh2)
    }
  }
}
function gameLoop(time) {
  info.text = ` x:${cube.x}, y:${cube.y.toFixed(1)}
 mouseX:${mx} mouseY:${my}
 mouseX2:${mx2} mouseY2:${my2}
 DDD${calcDistance(mx2 - app.screen.width * .875, my2 - app.screen.height * .8, 0, 0)}
angle: ${stickang}
touchCount ${touchL}, ${touchR}
d: ${[stickh, stickl]}
time:${time}
 `
  cube.rotation = stickang
  window.requestAnimationFrame(gameLoop)
  setCookie("zz", true, 180)
}