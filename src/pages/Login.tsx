import { Link, useNavigate } from 'react-router-dom';
import { Button, Card, Form, Input, message, Typography } from 'antd';
import { AiOutlineLogin, AiOutlineLock, AiOutlineMail } from 'react-icons/ai'; // ~ Icons
import { ILoginForm } from '../types/interfaces';
import { auth } from '../firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useState } from 'react';

const { Text } = Typography;

const Login = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const navigate = useNavigate();

  const loginHandler = async (values: ILoginForm) => {
    setIsLoading(true);
    const { email, password } = values;

    try {
      await signInWithEmailAndPassword(auth, email, password);
      localStorage.setItem('email', email);
      localStorage.setItem('name', auth.currentUser!.displayName!);

      navigate('/');
    } catch (error: any) {
      messageApi.open({
        type: 'error',
        content: error.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='auth'>
      {contextHolder}
      <Card title='LOGIN'>
        <Form layout='vertical' requiredMark='optional' onFinish={loginHandler}>
          <Form.Item
            name='email'
            label='Email'
            rules={[
              { required: true, message: 'Email is required!' },
              {
                type: 'email',
                message: 'Email is not valid!',
              },
            ]}
          >
            <Input placeholder='email@domain.com' prefix={<AiOutlineMail />} />
          </Form.Item>

          <Form.Item
            name='password'
            label='Password'
            rules={[
              { required: true, message: 'Password is required!' },
              {
                min: 6,
                message: 'Password must be at least 6 characters!',
                whitespace: true,
              },
            ]}
          >
            <Input.Password placeholder='******' prefix={<AiOutlineLock />} />
          </Form.Item>

          <Form.Item>
            <Button type='primary' htmlType='submit' loading={isLoading}>
              <AiOutlineLogin size={16} /> Login
            </Button>
          </Form.Item>
        </Form>

        <Text type='secondary'>
          Don't have an account? <Link to='/signup'>Register Now</Link>
        </Text>
      </Card>
    </div>
  );
};

export default Login;
