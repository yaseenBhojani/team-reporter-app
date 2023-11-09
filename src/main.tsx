import React from "react";
import ReactDOM from "react-dom/client";

import Theme from "./theme/Theme";

import { store } from "./store/store"; // ~ Redux Store
import { Provider } from "react-redux";

import "./style.scss"; // ~ Style Sheet
import App from "./App";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <Provider store={store}>
      <Theme>
        <App />
      </Theme>
    </Provider>
  </React.StrictMode>
);
