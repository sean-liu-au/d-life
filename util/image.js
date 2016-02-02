function decodeBase64Image(dataString) {
  var matches = dataString.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/),
    response = {};

  if (matches.length !== 3) {
    return new Error('Invalid input string');
  }

  response.type = matches[1];
  response.data = new Buffer(matches[2], 'base64');

  return response.data;
}

var imagePath='./public/images/';
var crypto = require('crypto');
var fs = require('fs');


module.exports = 
{
  saveImage : function(images) {
    var res=[];

    for(var i=images.length-1;i>=0;i--){
      var filename=crypto.randomBytes(16).toString('hex');
      var data=decodeBase64Image(images[i]);

      fs.writeFileSync(imagePath+filename+".jpg", data);
      res.push("images/"+filename+".jpg");
    }
    return res;             
  }  
}
