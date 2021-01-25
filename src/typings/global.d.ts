declare module '*.svg';
declare module '*.png';
declare module '*.jpg';
declare module '*.jpeg';
declare module '*.gif';
declare module '*.bmp';
declare module '*.tiff';

declare module '*.scss' {
  interface IClassNames {
    [className: string]: string
  }
  const scssClassNames: IClassNames

  export = scssClassNames;
}


// Built-time variables

declare var __SERVER__: 1 | 0
declare var __CLIENT__: 1 | 0
declare var __DEV__: 1 | 0


// Client

interface Screen {
  deviceXDPI: any
  logicalXDPI: any
}

interface Window {
  Sentry: any
}
