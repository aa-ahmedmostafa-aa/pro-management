import { UploadedFile } from "express-fileupload";
import config from "../../../config";
import path from "path";
import fs from "fs";
import fsp from "fs/promises";

export class FileHandlingService {
  private readonly filePath: string;

  constructor(filePath?: string) {
    this.filePath = filePath || config.USERS_IMAGES_DIRECTORY_PATH;
  }

  isImageFile(file: UploadedFile): boolean {
    try {
      return file.mimetype.startsWith("image/");
    } catch (error) {
      console.error("Error checking file type:", error);
      return false;
    }
  }

  saveFile(file: UploadedFile): string {
    const currentFilePath = path.join(
      this.filePath,
      new Date().getMilliseconds() + file.name
    );
    file.mv(currentFilePath, (err: any) => {
      if (err) {
        throw new Error("Cannot process the file provided");
      }
    });

    return currentFilePath;
  }

  async updateFile(
    file: UploadedFile,
    previousFilePath: string
  ): Promise<string> {
    const currentFilePath = path.join(
      this.filePath,
      new Date().getMilliseconds() + file.name
    );

    if (fs.existsSync(previousFilePath)) {
      await fsp.rm(previousFilePath);
    }

    file.mv(currentFilePath, (err: any) => {
      if (err) {
        throw new Error("Cannot process the file provided");
      }
    });

    return currentFilePath;
  }
}
