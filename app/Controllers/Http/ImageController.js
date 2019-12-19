"use strict";
const ImageService = require("../../Services/ImageService");
const FileService = require("../../Services/FileService");

class ImageController {
  async index({ request, response }) {
    try {
      const photo = request.file("photo", {
        types: ["image"],
        size: "10mb"
      });

      if (photo) {
        await FileService.moveFileToPath({
          image: photo,
          pathToUpload: "uploads/",
          name: "photo-from-cellphone.jpg"
        });
      }

      const id = new Date().getTime();

      const b64 = await ImageService.mergeTwoImages({
        id,
        width: 360,
        height: 686.67
      });

      response.status(200).json({ id });
    } catch (error) {
      console.log(error);
      response
        .status(500)
        .json(error ? { error } : { error: "Falha ao gerar imagem" });
    }
  }

  async testImage({ view }) {
    const id = new Date().getTime();

    const b64 = await ImageService.mergeTwoImages({ id });

    return view.render("image.index", { b64 });
  }
}

module.exports = ImageController;
