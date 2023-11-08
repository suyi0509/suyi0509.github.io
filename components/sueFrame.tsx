import React from 'react';
import { Card } from 'antd';

const SueFrame = (props: any) => {
  const { src, ...arg } = props;
  return (
    <div style={{ width: '100%', height: '500px' }}>
      <iframe width='100%' height='100%' src={src} {...arg}></iframe>
    </div>
  );
};

export default SueFrame;
