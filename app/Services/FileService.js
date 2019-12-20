"use strict";
const Helpers = use("Helpers");
const fs = use("fs");

class FileService {
  async moveFileToPath({ file, pathToUpload, name }) {
    await file.move(Helpers.publicPath(pathToUpload), {
      name,
      overwrite: true
    });

    if (!file.moved()) {
      throw "Falha ao mover o arquivo";
    }
  }

  async deleteFile({ pathToDelete }) {
    const removeFile = Helpers.promisify(fs.unlink);

    if (Array.isArray(pathToDelete)) {
      return await Promise.all(
        pathToDelete.forEach(async path => {
          await removeFile(Helpers.publicPath(path));
        })
      );
    } else {
      return await removeFile(Helpers.publicPath(pathToDelete));
    }
  }

  async moveFileBase64ToPath({ base64Image, pathToUpload }) {
    fs.writeFile(
      Helpers.publicPath(pathToUpload),
      base64Image,
      { encoding: "base64" },
      function(err) {}
    );
  }
}

module.exports = new FileService();
