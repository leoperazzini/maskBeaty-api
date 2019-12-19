"use strict";
const mergeImages = use("merge-images-v2");
const Canvas = use("canvas");
const Helpers = use("Helpers");
const fs = use("fs");
var Clipper = use("image-clipper");
Clipper.configure("canvas", Canvas);

class ImageService {
  async mergeTwoImages({ id, x = 0, y = 0, width, height }) {
    /*     Jimp.read(
      Helpers.publicPath("uploads/photo-from-cellphone.jpg"),
      (err, img) => {
        if (err) throw err;
        img
          .resize(360, 686.6666666666666) // resize
          .quality(100) // set JPEG qualityb W
          .write(Helpers.publicPath("uploads/" + id + ".jpg")); // save
      }
    ); */

    Clipper(Helpers.publicPath("uploads/photo-from-cellphone.jpg"), function() {
      this.crop(x, y, width, height)
        .quality(100)
        .toFile(Helpers.publicPath("uploads/" + id + ".jpg"), function() {});
    });

    const base64 = await mergeImages(
      [
        Helpers.publicPath("uploads/photo-from-cellphone.jpg"),
        Helpers.publicPath("images/mask.png")
      ],
      { Canvas }
    );

    let base64Image = base64.split(";base64,").pop();

    fs.writeFile(
      Helpers.publicPath("uploads/" + id + "teste.png"),
      base64Image,
      { encoding: "base64" },
      function(err) {
        console.log("File created");
      }
    );

    return base64;
  }
}

module.exports = new ImageService();
