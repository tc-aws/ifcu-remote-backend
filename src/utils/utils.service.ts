import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import * as sharp from 'sharp';
import { MESSAGE } from 'src/config/message.config';
const { createHash } = require('crypto');

@Injectable()
export class UtilsService {
  constructor(private readonly jwtService: JwtService) {}

  async hashPassword(password: string): Promise<string> {
    try {
      const saltRounds = 10; // Number of salt rounds
      const hashedPassword = await bcrypt
        .hash(password, saltRounds)
        .then((res) => {
          return res;
        });
      return hashedPassword;
    } catch (error) {
      throw new InternalServerErrorException(
        MESSAGE.ERRORS.UTIL.HASH_PASSWORD_FAIL,
      );
    }
  }

  async comparePasswords(
    plainPassword: string,
    hashedPassword: string,
  ): Promise<boolean> {
    try {
      return await bcrypt.compare(plainPassword, hashedPassword);
    } catch (error) {
      throw new InternalServerErrorException(
        MESSAGE.ERRORS.UTIL.CHECK_PASSWORD_FAIL,
      );
    }
  }

  async md5Hash(data) {
    return await createHash('md5').update(data.toString()).digest('hex');
  }

  async getDefaultIcon(needPic?: boolean): Promise<string> {
    if (needPic) {
      return `default-icon-${parseInt(Math.random() * 100 + '') % 8}.jpg`;
    }
    return 'default-icon.jpg';
  }

  async extractTokenFromHeader(headers: any): Promise<string | undefined> {
    const [type, token] = headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }

  async getUsernameFromHeaders(headers: any): Promise<string> {
    try {
      const headerPayload = await this.jwtService.decode(
        await this.extractTokenFromHeader(headers),
      );
      return headerPayload.username;
    } catch {
      throw new InternalServerErrorException(
        MESSAGE.ERRORS.UTIL.USER_VALIDATION_FAIL,
      );
    }
  }

  async shuffleArray(arr: any[]): Promise<void> {
    for (let i = arr.length - 1; i >= 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const temp = arr[i];
      arr[i] = arr[j];
      arr[j] = temp;
    }
  }

  async randomString(length: number = 16): Promise<string> {
    let result = '';
    const characters =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;

    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }

    return result;
  }

  parseMappingKey(a: string, b: string): string {
    const comparison = a.localeCompare(b);
    // str a smaller than b
    if (comparison < 0) {
      return `${a}-${b}`;
    } else {
      return `${b}-${a}`;
    }
  }

  parseMappingKey2(arr: string[]): string {
    return arr.sort().join('-');
  }

  sortObjByValue(obj: any, acc: boolean): any {
    return Object.fromEntries(
      Object.entries(obj).sort((a: any, b: any) =>
        acc ? a[1] - b[1] : b[1] - a[1],
      ),
    );
  }

  generateToken(payload: any): string {
    return `Bearer ${this.jwtService.sign(payload)}`;
  }
}

@Injectable()
export class ImageService {
  constructor(private readonly utilsService: UtilsService) {}
  multer: any;
  async uploadImage(file: Express.Multer.File): Promise<any> {
    try {
      const ext = file.mimetype.split('/')[1];
      const filename = `${await this.utilsService.md5Hash(Date.now())}.${ext}`;
      const filePath = `./public/static/icon/${filename}`;
      await sharp(file.buffer)
        .resize(500, 500)
        .jpeg({ quality: 10 })
        .toFile(filePath);

      return { icon: filename };
    } catch {
      throw new BadRequestException(MESSAGE.ERRORS.UTIL.UPLOAD_ICON_FAIL);
    }
  }
}
