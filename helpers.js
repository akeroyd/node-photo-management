const fs = require('fs');

var photoExtensions = [
  ".jpg",
  ".JPG",
  ".gif",
  ".GIF",
  ".png",
  ".PNG"
]

var videoExtensions = [
  ".mov",
  ".MOV",
  ".mp4",
  ".MP4",
  ".3gp"
]

const scanForFiles = async (sourceDirectory) => {

  const files = await fs.readdirSync(sourceDirectory);
  console.log('Found', files.length, 'files', files)
  var fileType = null;

  // Filter for only our image files
  var images = [];
  var videos = [];

  // Loop over all files in sourceDirectory and determine if they are an image or video
  for (var i = 0, len = files.length; i < len; i++) {
    var file = files[i];
    var fileExtension = file.substring(file.length - 4);

    // Add any image file with an extension in photoExtensions to our images object
    if (photoExtensions.indexOf(fileExtension) > -1) {
      images.push(file);
    }

    // Add any video file with an extension in videoExtensions to our videos object
    if (videoExtensions.indexOf(fileExtension) > -1) {
      videos.push(file);
    }
  }

  return { images, videos };
}

module.exports = {
  scanForFiles,
};
