import { Spin } from 'antd';

const LoadingSpinner = () => {
  return (
    <div className='spin-container'>
      <Spin tip='Loading...' />
    </div>
  );
};

export default LoadingSpinner;
