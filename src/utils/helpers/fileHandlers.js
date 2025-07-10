import fs from "fs";

const deleteFile = async (path) => {
  await fs.unlink(path, (err) => {
    if (err) console.error(err);
  });
};

export { deleteFile };
