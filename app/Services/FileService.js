"use strict";
const Helpers = use("Helpers");

class FileService {
  async moveFileToPath({ image, pathToUpload, name }) {
    await image.move(Helpers.publicPath(pathToUpload), {
      name,
      overwrite: true
    });

    if (!image.moved()) {
      throw "Falha ao mover o arquivo";
    }
  }
}

module.exports = new FileService();
