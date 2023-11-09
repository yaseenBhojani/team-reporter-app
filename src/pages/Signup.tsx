import { Link, useNavigate } from "react-router-dom";
import { Button, Card, Form, Input, message, Typography } from "antd";

// *** Icons ***
import { AiOutlineLock, AiOutlineMail, AiOutlineUser } from "react-icons/ai";
import { BiRegistered } from "react-icons/bi";
import { ISignupForm } from "../types/interfaces";
import { auth, db } from "../firebase";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { useState } from "react";

const { Text } = Typography;

const Signup = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const navigate = useNavigate();

  const signupHandler = async (values: ISignupForm) => {
    setIsLoading(true);

    const { email, fullName, password } = values;

    try {
      const { user } = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      await setDoc(doc(db, "users", user.uid), { email, fullName });

      if (!auth.currentUser) throw new Error("Something went wrong");

      await updateProfile(auth.currentUser, {
        displayName: fullName,
      });
      localStorage.setItem("email", email);
      localStorage.setItem("name", fullName);
      navigate("/");
    } catch (error: any) {
      messageApi.open({
        type: "error",
        content: error.message || "Something went wrong",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth">
      {contextHolder}
      <Card title="SIGNUP">
        <Form
          layout="vertical"
          requiredMark="optional"
          onFinish={signupHandler}
        >
          <Form.Item
            name="fullName"
            label="Full Name"
            rules={[
              {
                required: true,
                message: "Full name is required!",
              },
              {
                whitespace: true,
                message: "Full name cannot be empty!",
              },
            ]}
          >
            <Input placeholder="John Doe" prefix={<AiOutlineUser />} />
          </Form.Item>

          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: "Email is required!" },
              {
                type: "email",
                message: "Email is not valid!",
              },
            ]}
          >
            <Input placeholder="email@domain.com" prefix={<AiOutlineMail />} />
          </Form.Item>

          <Form.Item
            name="password"
            label="Password"
            rules={[
              { required: true, message: "Password is required!" },
              {
                min: 6,
                message: "Password must be at least 6 characters!",
              },
            ]}
          >
            <Input.Password placeholder="******" prefix={<AiOutlineLock />} />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={isLoading}>
              <BiRegistered size={17} /> Signup
            </Button>
          </Form.Item>
        </Form>

        <Text type="secondary">
          Already have an account? <Link to="/login">Login Now</Link>
        </Text>
      </Card>
    </div>
  );
};

export default Signup;
