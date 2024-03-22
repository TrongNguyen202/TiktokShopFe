import { Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';

function LoadingButton({ loading }) {
  return loading && <Spin indicator={<LoadingOutlined className="text-white ml-3" />} />;
}

export default LoadingButton;
