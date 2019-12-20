"use strict";
const mergeImages = use("merge-images-v2");
const Canvas = use("canvas");
const Helpers = use("Helpers");
var Clipper = use("image-clipper");
Clipper.configure("canvas", Canvas);

const FileService = require("./FileService");

class ImageService {
  async getImageMergedWithMask({
    id,
    x = 0,
    y = 0,
    width = 1000,
    height = 1000
  }) {
    await this.clipperImage({
      pathImageToClipper: "uploads/" + id + ".jpg",
      pathImageClipped: "uploads/" + id + "_clipped.jpg",
      x,
      y,
      width,
      height
    });

    const base64 = await this.mergeTwoImages({
      id,
      pathImageOne: "uploads/" + id + "_clipped.jpg",
      pathImageTwo: "images/mask.png"
    });

    await this.saveImageMerged({
      base64,
      pathToSave: "uploads/" + id + "_merged.png"
    });

    return base64;
  }

  async clipperImage({
    pathImageToClipper,
    pathImageClipped,
    x = 0,
    y = 0,
    width,
    height
  }) {
    return new Promise((resolve, reject) => {
      try {
        Clipper(Helpers.publicPath(pathImageToClipper), function() {
          this.quality(100).toFile(
            Helpers.publicPath(pathImageClipped),
            function() {
              resolve();
            }
          );
        });
      } catch (err) {
        reject();
      }
    });
  }

  async mergeTwoImages({ pathImageOne, pathImageTwo }) {
    const base64 = await mergeImages(
      [Helpers.publicPath(pathImageOne), Helpers.publicPath(pathImageTwo)],
      { Canvas }
    );

    return base64;
  }

  async saveImageMerged({ base64, pathToSave }) {
    let base64Image = base64.split(";base64,").pop();

    FileService.moveFileBase64ToPath({
      base64Image,
      pathToUpload: pathToSave
    });
  }
}

module.exports = new ImageService();
