// imgAvatar, imgLogo: url of the image
// rgba: an rgba string. e.g. 'rgba(255, 153, 153, .7)'
(function() {
  function mergeImageWithCanvas(imgAvatar, rgba, imgLogo, logoOpacity, size) {
    var canvas = document.getElementById('canvasProcessor');
    if (canvas.getContext) {
        var ctx = canvas.getContext('2d');
    }
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    var img = new Image();
    img.src = imgAvatar;
    img.onload = function() {
      ctx.drawImage(img, 0, 0, size, size);
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

  function onConfirmButtonClick() {
    mergeImageWithCanvas('../images/avatar.jpg', rgbaObjToString(rgba), '../images/alsogay.png', logoOpacity, 500);
  }

  document.getElementById('confirmButton').onclick = onConfirmButtonClick;

  var $mask = document.getElementById('mask');
  var maskR = 0, maskG = 0, maskB = 0;
  var rgba = {'r': 0, 'g': 0, 'b': 0, 'a': .5};
  var logoOpacity = 1;

  function rgbaObjToString(rgba) {
    return 'rgba(' + rgba.r + ', ' + rgba.g + ', ' + rgba.b + ', ' + rgba.a + ')';
  }

  function updateMaskChannel(channel, value) {
    if (channel === 'a') {
      rgba.a = value;
    }
    else if (['r', 'g', 'b'].indexOf(channel) !== -1) {
      rgba[channel] = Math.floor(value * 255);
    }
    else {
      return;
    }

    $mask.style.backgroundColor = rgbaObjToString(rgba);
  }


  function updateMaskChannelText(channel, value) {
    if (channel === 'a') {
      $maskValues['a'].innerHTML = 'a: ' + Number(value).toFixed(2);
    }
    else {
      $maskValues[channel].innerHTML = channel + ': ' + Math.floor(value * 255);
    }
  }

  // channel: 'r'|'g'|'b'|'a'
  function onChannelChange(channel) {
    return function(x, y) {
      if (channel === 'a') {
        if (x < 0 || x > 1) return;
      }
      else if (['r', 'g', 'b'].indexOf(channel) !== -1) {
        if (x < 0 || x > 255) return;
      }
      else {
        return;
      }

      updateMaskChannel(channel, x);
      updateMaskChannelText(channel, x);
    }
  }

  var $maskValues = {
    'r': document.getElementById('maskRValue'),
    'g': document.getElementById('maskGValue'),
    'b': document.getElementById('maskBValue'),
    'a': document.getElementById('maskAValue')
  }

  var $logo = document.getElementById('logo');
  var $logoOpacityValue = document.getElementById('logoOpacity');
  function onLogoOpacityChange() {
    return function(x, y) {
      if (x < 0 || x > 1) return;
      logoOpacity = x;
      $logo.style.opacity = x;
    }
  }

  new Dragdealer('maskR', {x: rgba.r / 255, animationCallback: onChannelChange('r')});
  new Dragdealer('maskG', {x: rgba.g / 255, animationCallback: onChannelChange('g')});
  new Dragdealer('maskB', {x: rgba.b / 255, animationCallback: onChannelChange('b')});
  new Dragdealer('maskA', {x: rgba.a, animationCallback: onChannelChange('a')});
  new Dragdealer('logoOpacity', {x: logoOpacity, animationCallback: onLogoOpacityChange('logoOpacity')});
})()