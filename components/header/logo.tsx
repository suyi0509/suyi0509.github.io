import React from 'react';
import { Space, Image } from 'antd';

const Logo = () => {
  const a: string = '1';
  return (
    <Space>
      <Image
        className="rounded-full !w-10 !h-10"
        src="https://suyi0509.github.io/pic.jpeg"
      />
      <span className='font-sans font-bold hover:text-slate-500'>Sue</span>
    </Space>
  );
};

export default Logo;
