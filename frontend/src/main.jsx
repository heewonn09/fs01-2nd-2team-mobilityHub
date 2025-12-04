import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";

// HTML에서 id가 'root'인 요소를 찾아 React 앱을 렌더링
const container = document.getElementById("root");
const root = createRoot(container);
root.render(<App />);
