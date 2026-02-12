import { Spin, SpinProps } from 'antd';
import React from 'react';

export const commonLoadingStyles: SpinProps['styles'] = {
  indicator: {
    color: 'var(--theme-main)',
  },
};

const CommonLoading = () => {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <Spin size="large" styles={commonLoadingStyles} />
    </div>
  );
};

export default CommonLoading;
