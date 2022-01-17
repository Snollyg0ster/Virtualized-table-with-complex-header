import { render } from "react-dom";

import App from "./App";

const rootElement = document.getElementById("root");
rootElement?.setAttribute("style", "height: 100%; padding: 16px; box-sizing: border-box;");
render(<App />, rootElement);
