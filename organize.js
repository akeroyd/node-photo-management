/**
 * Synology/Node Photo Organization Script
 */

const DRYRUN = false;

/**
 * Source Directory Configuration
 * This is the source directory where our photo and video files live
 * IMPORTANT: Make sure your path ends with a /
 */
var sourceDirectory = "./input";



/**
 * Destination Directory Configuration
 * These are the destination directories where photos and videos should ultimately be stored
 * Note that within these directories will live year/month (e.g., 2014/10 - October) directories,
 * so this should be the master directories for photos and videos.
 * IMPORTANT: Make sure your path ends with a /
 */
var photosDestination = "./output";
var videosDestination = "./output";



/**
 * File Extension Configuration
 * photoExtensions and videoExtensions are file extensions that will land in
 * photosDestination and videosDestination as defined above
 */
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


/**
 * ------------ DON'T EDIT BELOW THIS UNLESS YOU KNOW WHAT YOU'RE DOING ------------
 */

const fs = require("fs")
    mv = require("mv")
    ExifImage = require('exif').ExifImage
    moment = require('moment');
 

// Define our months to generate folder names
var months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
]

// Read the directory defined above and save list of files to an array, files
fs.readdir(sourceDirectory, async function(err, files) {
    if (err) {
        throw err;
    }

    var fileType = null;

    // Filter for only our image files
    var images = [];
    var videos = [];

    // Loop over all files in sourceDirectory and determine if they are an image or video
    for (var i=0, len = files.length; i < len; i++) {
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

    // Loop over each image file
    // Get date metadata from the file name
    // Move the file
    for (let i=0, len = images.length; i < len; i++) {
        const file = images[i];

        // Get the year and month from the file name
        const fileDate = await getExifDate(file);

        // Define paths
        const existingFilePath = sourceDirectory + "/" + file;
        const newFilePath = `${photosDestination}/${fileDate.format('YYYY/MM')}/${file}`;

        // Move the file
        // mkdirp: Make the required directories if they don't exist
        // clobber: Don't overwrite any files
        if (!DRYRUN) {
            mv(existingFilePath, newFilePath, {mkdirp: true, clobber: false}, function(err) {
                if(err) {
                    throw err;
                } else {
                    console.log("Moving " + file + " to " + newFilePath);   
                }
            });
        } else {
            console.log("[DRYRUN] Would move " + file + " to " + newFilePath);   
        }
    }

    // Loop over each video file
    // Get date metadata from the file name
    // Move the file
    for (let i=0, len = videos.length; i < len; i++) {
        const file = videos[i];

        // Get the year and month from the file name
        const fileDate = await getExifDate(file);

        // Define paths
        const existingFilePath = sourceDirectory + "/" + file;
        const newFilePath = `${photosDestination}/${fileDate.format('YYYY/MM')}/${file}`;

        // Move the file
        // mkdirp: Make the required directories if they don't exist
        // clobber: Don't overwrite any files
        if (!DRYRUN) {
            mv(existingFilePath, newFilePath, {mkdirp: true, clobber: false}, function(err) {
                if(err) {
                    throw err;
                } else {
                    console.log("Moving " + file + " to " + newFilePath);   
                }
            })
        } else {
            console.log("[DRYRUN] Would move " + file + " to " + newFilePath);   
        }
    }
})

// Function to get the date information
function getExifDate(file) {
    const exifDateFormat = 'YYYY:MM:DD hh:mm:ss'; //2011:01:01 10:00:00

    return new Promise((resolve, reject) => {
        ExifImage({ image : `${sourceDirectory}/${file}` }, (err, exifData) => {
            if (err) {
                reject(err);
            } else {
                resolve(moment(exifData.exif.CreateDate, exifDateFormat));
            }
        });
    });
}
