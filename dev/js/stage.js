// imgAvatar, imgLogo: url of the image
// rgba: an rgba string. e.g. 'rgba(255, 153, 153, .7)'

(function() {
  var slogan1 = new Image();
  var slogan2 = new Image();
  slogan1.src = '../images/1.png';
  slogan2.src = '../images/2.png';
  var avatar = new Image();
  avatar.src = '../images/a1.jpg';

  var canvas = document.getElementById('realtimeCanvas');
  var avatarCanvas = document.getElementById('avatarCanvas');
  var ctx = canvas.getContext('2d');
  var stage = {
    'canvas': canvas,
    'ctx': ctx,
    'avatarCanvas': avatarCanvas,
    'avatar': avatar,
    'slogan': slogan1,
    'mask': 'rgba(255, 255, 255, .5)',
    'opacity': .5,
    'blendMode': 'hard-light',
  }


  var $outputImg = document.getElementById('outputImg');
  var timer;
  function drawCanvas(stage) {
    var width = stage.canvas.width,
        height = stage.canvas.height;

    stage.ctx.clearRect(0, 0, width, height);
    drawImageProp(stage.ctx, stage.avatar);

    stage.ctx.fillStyle = stage.mask;
    ctx.fillRect(0, 0, width, height);

    stage.ctx.globalCompositeOperation = stage.blendMode;
    stage.ctx.save();
    stage.ctx.globalAlpha = stage.opacity;
    drawImageProp(stage.ctx, stage.slogan);
    stage.ctx.restore();

    drawImageProp(stage.avatarCanvas.getContext('2d'), stage.canvas);

    stage.canvas.style.display = 'block';
    $outputImg.style.display = 'none';
    clearTimeout(timer);
    timer = setTimeout(function() {
      var outputURL = stage.canvas.toDataURL();
      $outputImg.src = outputURL;
      $outputImg.onload = function() {
        $outputImg.style.display = 'inline';
        stage.canvas.style.display = 'none';
      }
    }, 100);
  }

  var avatarURL = '';
  var $file = document.getElementById('file');

  $outputImg.onclick = function() {
    console.log(true);
    $file.click();
  }

  $file.onchange = function() {
    var $avatar = document.getElementById('avatar');
    var file = $file.files[0];
    var reader = new FileReader();

    if (file) {
      reader.readAsDataURL(file);
    }

    reader.onloadend = function() {
      avatar.src = reader.result;
      drawCanvas(stage);
    }

  }

  /**
   * By Ken Fyrstenberg
   * http://stackoverflow.com/questions/21961839/simulation-background-size-cover-in-canvas
   *
   * drawImageProp(context, image [, x, y, width, height [,offsetX, offsetY]])
   *
   * If image and context are only arguments rectangle will equal canvas
  */
  function drawImageProp(ctx, img, x, y, w, h, offsetX, offsetY) {

    if (arguments.length === 2) {
        x = y = 0;
        w = ctx.canvas.width;
        h = ctx.canvas.height;
    }

    // default offset is center
    offsetX = typeof offsetX === "number" ? offsetX : 0.5;
    offsetY = typeof offsetY === "number" ? offsetY : 0.5;

    // keep bounds [0.0, 1.0]
    if (offsetX < 0) offsetX = 0;
    if (offsetY < 0) offsetY = 0;
    if (offsetX > 1) offsetX = 1;
    if (offsetY > 1) offsetY = 1;

    var iw = img.width,
        ih = img.height,
        r = Math.min(w / iw, h / ih),
        nw = iw * r,   // new prop. width
        nh = ih * r,   // new prop. height
        cx, cy, cw, ch, ar = 1;

    // decide which gap to fill    
    if (nw < w) ar = w / nw;
    if (nh < h) ar = h / nh;
    nw *= ar;
    nh *= ar;

    // calc source rectangle
    cw = iw / (nw / w);
    ch = ih / (nh / h);

    cx = (iw - cw) * offsetX;
    cy = (ih - ch) * offsetY;

    // make sure source rectangle is valid
    if (cx < 0) cx = 0;
    if (cy < 0) cy = 0;
    if (cw > iw) cw = iw;
    if (ch > ih) ch = ih;

    // fill image in dest. rectangle
    ctx.drawImage(img, cx, cy, cw, ch,  x, y, w, h);
  }

  function mergeImageWithCanvas(imgAvatar, rgba, imgLogo, logoOpacity, size) {
    var canvas = document.getElementById('canvasProcessor');
    if (canvas.getContext) {
        var ctx = canvas.getContext('2d');
    }
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    var img = new Image();
    img.src = imgAvatar;
    img.onload = function() {
      drawImageProp(ctx, img);
      // ctx.drawImage(img, 0, 0, size, size);
      ctx.fillStyle = rgba;
      ctx.fillRect(0, 0, size, size);

      var logo = new Image();
      logo.src = imgLogo;
      logo.onload = function() {
        ctx.globalAlpha = logoOpacity;
        ctx.drawImage(logo, 0, 0, size, size);

        document.getElementById('output').src = canvas.toDataURL();
        // console.log(canvas.toDataURL());
      }
    }
  }

  $demo1 = document.getElementById('demo1');
  $demo2 = document.getElementById('demo2');
  var maskColorPrefix = 'rgba(255, 255, 255, ';

  $demo1.onclick = function() {
    $demo1.className = 'active';
    $demo2.className = '';
    maskColorPrefix = 'rgba(255, 255, 255, ';
    stage.slogan = slogan1;
    stage.blendMode = 'hard-light';
    drawCanvas(stage);
  }

  $demo2.onclick = function() {
    $demo2.className = 'active';
    $demo1.className = '';
    maskColorPrefix = 'rgba(0, 0, 0, ';
    stage.slogan = slogan2;
    stage.blendMode = 'soft-light';
    drawCanvas(stage);
  }

  new Dragdealer('canvasTest0', {x: .4, animationCallback: function(x, y) {stage.opacity = x; drawCanvas(stage)}});
  new Dragdealer('canvasTest', {x: .1, animationCallback: function(x, y) {stage.mask = maskColorPrefix + x + ')'; drawCanvas(stage)}});

  slogan1.onload = function() { 
    avatar.onload = function() {
      drawCanvas(stage);
    }
  }
})()

document.ontouchmove = function(e){ e.preventDefault(); }