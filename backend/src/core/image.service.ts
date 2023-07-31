import { Injectable } from '@nestjs/common';
import { existsSync, unlinkSync, writeFileSync,  } from 'fs';

@Injectable()
export class ImageService {

    save(name: string, data: string, folder: string): boolean {
        let bitmap = data.split(';base64,').pop();
 
        try {
            writeFileSync(`${folder}/${name}.jpg`, bitmap, {
                encoding: "base64",
                flag: "w+"
            });
            return true;
        } catch (err) {
            return false;
        }
    }

    delete(name: string, folder: string): boolean {
        try {
            unlinkSync(`${folder}/${name}.jpg`);
            return true;
        } catch (err) {
            return false;
        }
    }

    exists(name: string, folder: string): boolean {
        try {
            return existsSync(`${folder}/${name}.jpg`);
        } catch(err) {
            return false;
        }
    }
}
