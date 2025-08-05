import { RouterProvider } from "react-router-dom";
import { Provider } from "react-redux";
import { persistor, store } from "./redux/store";
import { PersistGate } from "redux-persist/integration/react";
import { StateProvider } from "./context/stateProvider";
import "./index.css";
import { router } from "./routes";
import { Toaster } from "sonner";
import { ThemeProvider } from "./components/themes/theme-provider";
import { InitUserFromToken } from "./services/InitUserFromToken";
import { NotificationProvider } from "./components/atoms/notification/notification-context";
import { SpeedInsights } from "@vercel/speed-insights/react";

function App() {
  return (
    <>
      <SpeedInsights />
      <NotificationProvider>
        <ThemeProvider defaultTheme="light" storageKey="theme">
          <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
              <StateProvider>
                <RouterProvider router={router} />
                <Toaster />
                <InitUserFromToken />
              </StateProvider>
            </PersistGate>
          </Provider>
        </ThemeProvider>
      </NotificationProvider>
    </>
  );
}

export default App;
