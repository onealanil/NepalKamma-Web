declare module "nextjs-toploader5" {
  import { ComponentType } from "react";

  export interface NextTopLoaderProps {
    color?: string;
    initialPosition?: number;
    crawlSpeed?: number;
    height?: number;
    crawl?: boolean;
    showSpinner?: boolean;
    easing?: string;
    speed?: number;
    shadow?: boolean;
    template?: string;
    zIndex?: number;
  }

  const NextTopLoader: ComponentType<NextTopLoaderProps>;
  export default NextTopLoader;
}
