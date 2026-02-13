import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./app/App";
import { AppProviders } from "./app/providers/AppProviders";
import "./tailwind.css";

createRoot(document.getElementById("root")!).render(
    <AppProviders>
        <BrowserRouter
            future={{
                v7_startTransition: true,
                v7_relativeSplatPath: true,
            }}
        >
            <App />
        </BrowserRouter>
    </AppProviders>,
);
