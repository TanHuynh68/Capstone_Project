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

function App() {
  return (
    <>
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
    </>
  );
}

export default App;
