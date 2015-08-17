var sharp = require('sharp');
var maskPath = '../public/images/mask.png';
exports.merge = function() {
  // sharp('../public/images/avatar.jpg')
  // .overlayWith('../public/images/alsogay.png')
  // .png()
  sharp('../public/images/mask.png')
  .resize(750, 750)
  .background({r:255, g:0, b:0, a:1})
  .max()
  .toFile('../public/images/output.png', function(err, info){
    if (err) {
      console.log(err);
    }
    else {
      console.log(info);
    }
  });
}

exports.merge();