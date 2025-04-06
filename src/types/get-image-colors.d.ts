declare module 'get-image-colors' {
  function getColors(input: string | Buffer): Promise<{
    hex: () => string;
    rgb: () => number[];
  }[]>;
  export default getColors;
} 