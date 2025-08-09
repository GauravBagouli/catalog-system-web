// src/main.tsx
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./pages/App";
import '../src/styles/globals.css'
import { store } from "./stores";
import { Provider } from "react-redux";
import { Toaster, ToastBar } from "react-hot-toast";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <Provider store={store}>
    <BrowserRouter>
      <App />
      <Toaster
        position="top-right"
        reverseOrder={false}
        toastOptions={{
          duration: 1000,
          success: {
            style: {
              background: "#4ade80",
              color: "#fff",
            },
          },
          error: {
            style: {
              background: "#ef4444",
              color: "#fff",
            },
          },
        }}
      >
        {(t) => (
          <ToastBar
            toast={t}
            style={{
              ...t.style,
              animation: t.visible
                ? "custom-enter 0.4s ease forwards"
                : "custom-exit 0.4s ease forwards",
            }}
          />
        )}
      </Toaster>
    </BrowserRouter>
  </Provider>
);
