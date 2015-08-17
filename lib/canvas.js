var Canvas = require('canvas');
var fs = require('fs');

// rgba: An object of a rgba color
// e.g.
//   {r: 255, g: 153, b: 153, a.7}
exports.merge = function(rgba, size) {
  size = typeof size !== 'undefined' ? size : 750;

  if (typeof rgba.r !== 'number'
   || typeof rgba.g !== 'number'
   || typeof rgba.b !== 'number'
   || typeof rgba.a !== 'number'
   || rgba.r > 255
   || rgba.g > 255
   || rgba.b > 255
   || rgba.a > 1
   || rgba.r < 0
   || rgba.g < 0
   || rgba.b < 0
   || rgba.a < 0) {

    rgba = {'r': 0, 'g': 0, 'b': 0, 'a': 0};

  }

  var canvas = new Canvas(size, size)
    , Image = Canvas.Image
    , ctx = canvas.getContext('2d');

  ctx.fillRect(0, 0, 50, 50);

  console.log(canvas.toDataURL().length / 1024);

  var out = fs.createWriteStream('../public/images/out.png')
    , stream = canvas.pngStream();
  stream.on('data', function(chunk) {
    out.write(chunk);
  });
  stream.on('end', function() {
    console.log('saved png');
  })

  fs.readFile('../public/images/avatar.jpg', function(err, squid){
    if (err) throw err;
    var imgAvatar = new Image;
    imgAvatar.src = squid;
    ctx.drawImage(imgAvatar, 0, 0, size, size);

    // Add mask
    //               rgba(255, 153, 153, .7)
    // ctx.fillStyle = 'rgba(' + rgba.r + ', ' + rgba.g + ', ' + rgba.b + ', ' + rgba.a + ')';
    ctx.fillStyle = 'red';
    ctx.fillRect = (0, 0, 100, 100);


    // Add logo
    fs.readFile('../public/images/alsogay.png', function(err, squid) {
      if (err) throw err;
      var imgLogo = new Image;
      imgLogo.src = squid;
      ctx.drawImage(imgLogo, 0, 0, size, size);

      console.log(canvas.toDataURL().length / 1024);

      var out = fs.createWriteStream('../public/images/out.png')
        , stream = canvas.pngStream();

      stream.on('data', function(chunk) {
        out.write(chunk);
      });

      stream.on('end', function() {
        console.log('saved png');
      })
    })

  });
}

exports.merge({r:0, g:0, b:0, a:1});