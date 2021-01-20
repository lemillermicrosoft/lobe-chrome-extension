declare module "*.scss" {
  const styleContent: { [className: string]: string };
  export = styleContent;
}

declare module "*.svg" {
  const imageContent: string;
  export = imageContent;
}

declare module "*.gif" {
  const gifContent: string;
  export = gifContent;
}
