import { RouterProvider } from "react-router-dom";
import { Provider } from "react-redux";
import { persistor, store } from "./redux/store";
import { PersistGate } from "redux-persist/integration/react";
import { StateProvider } from "./context/stateProvider";
import "./index.css";
import { router } from "./routes";

function App() {

  return (
    <>
        <Provider store={store}>
          <PersistGate loading={null} persistor={persistor}>
            <StateProvider>
              <RouterProvider router={router} />
            </StateProvider>
          </PersistGate>
        </Provider>
    </>
  );
}

export default App;
