declare module 'ethereum-blockies' {
    interface BlockiesOptions {
      seed: string; // Required. The seed to generate the blockie
      size?: number; // Optional. The number of pixels (default: 8)
      scale?: number; // Optional. Pixel scaling factor (default: 4)
      color?: string; // Optional. Background color (default: random)
      bgcolor?: string; // Optional. Background color (default: random)
      spotcolor?: string; // Optional. Color of the spots (default: random)
    }
  
    interface Blockie {
      toDataURL(): string;
    }
  
    export function create(options: BlockiesOptions): Blockie;
  }
  