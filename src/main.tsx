import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import router from './Routes';

import Theme from './theme/Theme';

import { store } from './store/store'; // ~ Redux Store
import { Provider } from 'react-redux';

import './style.scss'; // ~ Style Sheet

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <Provider store={store}>
      <Theme>
        <RouterProvider router={router} />
      </Theme>
    </Provider>
  </React.StrictMode>
);
