import { ConfigProvider } from 'antd';
import React from 'react';
import { IChildren } from '../types/interfaces';

const Theme: React.FC<IChildren> = ({ children }) => (
  <ConfigProvider
    theme={{
      token: {
        colorPrimary: '#0d2e89',
        colorLink: '#4ed8ae',
        colorLinkHover: '#0d2e89',
        colorLinkActive: '#9c9c9c',
        borderRadius: 2,
        fontFamily: 'Roboto',
      },
    }}
  >
    {children}
  </ConfigProvider>
);

export default Theme;
