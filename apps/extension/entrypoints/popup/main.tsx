import { createRoot } from "react-dom/client";
import { Popup } from "./popup";
import "./strict.css";
import "./style.css";

const rootElement = document.querySelector<HTMLDivElement>("#root");
if (!rootElement) {
  throw new Error("Missing popup root element");
}

createRoot(rootElement).render(<Popup />);
