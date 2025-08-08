// src/main.tsx
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./pages/App";
import '../src/styles/globals.css'
import { store } from "./stores";
import { Provider } from "react-redux";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <Provider store={store}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Provider>
);
