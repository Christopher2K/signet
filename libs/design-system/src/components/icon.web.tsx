import type { IconName, IconProps } from "./icon.types";

export type { IconName, IconProps } from "./icon.types";

const paths: Record<IconName, string> = {
  "arrow-square-out":
    "M216,48V96a8,8,0,0,1-16,0V67.31l-50.34,50.35a8,8,0,0,1-11.32-11.32L188.69,56H160a8,8,0,0,1,0-16h48A8,8,0,0,1,216,48ZM200,144v48a16,16,0,0,1-16,16H64a16,16,0,0,1-16-16V72A16,16,0,0,1,64,56h48a8,8,0,0,1,0,16H64V192H184V144a8,8,0,0,1,16,0Z",
  bookmark:
    "M184,32H72A16,16,0,0,0,56,48V224a8,8,0,0,0,12.24,6.78L128,193.39l59.76,37.39A8,8,0,0,0,200,224V48A16,16,0,0,0,184,32Zm0,177.61-51.76-32.39a8,8,0,0,0-8.48,0L72,209.61V48H184Z",
  pencil:
    "M227.31,73.37,182.63,28.68a16,16,0,0,0-22.63,0L36.69,152A15.86,15.86,0,0,0,32,163.31V208a16,16,0,0,0,16,16H92.69A15.86,15.86,0,0,0,104,219.31L227.31,96a16,16,0,0,0,0-22.63ZM92.69,208H48V163.31l88-88L180.69,120ZM192,108.69,147.31,64l24-24L216,84.69Z",
};

export const Icon = ({ color, name, size = 20 }: IconProps) => (
  <svg
    aria-hidden="true"
    fill={color ?? "currentColor"}
    height={size}
    viewBox="0 0 256 256"
    width={size}
  >
    <path d={paths[name]} />
  </svg>
);
