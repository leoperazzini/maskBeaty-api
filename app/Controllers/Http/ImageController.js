"use strict";
const ImageService = require("../../Services/ImageService");
const FileService = require("../../Services/FileService");

class ImageController {
  async receiveImageToMergeWithMask({ request, response }) {
    try {
      const photo = request.file("photo", {
        types: ["image"],
        size: "10mb"
      });

      let { cellphone_id } = request.body;
      !cellphone_id ? (cellphone_id = "") : cellphone_id;

      const id = new Date().getTime();

      if (photo) {
        await FileService.moveFileToPath({
          file: photo,
          pathToUpload: "uploads/",
          name: "" + id + ".jpg"
        });
      }

      response.status(200).json({ id });
    } catch (error) {
      response
        .status(500)
        .json(error ? { error } : { error: "Falha ao gerar imagem" });
    }
  }

  async returnImageMergedWithMask({ request, view, response }) {
    try {
      const { id, cellphone_id } = request.qs;

      const identifierImage = id + cellphone_id;

      const b64 = await ImageService.getImageMergedWithMask({
        id: identifierImage,
        cellphone_id,
        width: 1000,
        height: 1000
      });

      FileService.deleteFile({
        pathToDelete: [
          "uploads/" + identifierImage + "_clipped.jpg",
          "uploads/" + identifierImage + "_merged.jpg"
        ]
      });

      return view.render("image.index", { b64 });
    } catch (error) {
      response
        .status(500)
        .json(
          error
            ? { error }
            : { error: "Falha ao recuperar imagem com a máscara de beleza" }
        );
    }
  }
}

module.exports = ImageController;
