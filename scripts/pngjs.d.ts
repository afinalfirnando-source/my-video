declare module "pngjs" {
  export interface PNG {
    width: number;
    height: number;
    data: Uint8Array;
  }
  export class PNG {
    static sync: {
      read(buffer: Buffer | Uint8Array): PNG;
      write(png: PNG): Buffer;
    };
  }
}
