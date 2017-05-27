var assetDir = "../img/";

function loadImage(fileName) {
  var img = document.createElement("img");
  img.src = assetDir + fileName;
  return img;
}

function drawSprite(ctx, sprite) {
  ctx.drawImage(sprite.img, sprite.x, sprite.y, sprite.width, sprite.height);
}

function Sprite(img, x, y, width, height) {
  this.img = img;
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
}