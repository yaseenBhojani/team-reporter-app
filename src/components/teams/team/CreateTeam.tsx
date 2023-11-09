import {
  addDoc,
  collection,
  DocumentData,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { auth, db } from "../../../firebase";

import { Button, Form, Input, message, Modal, Select, Space } from "antd";

import { useDispatch, useSelector } from "react-redux";
import { setModalIsOpen } from "../../../store/reducers/createTeamReducer"; // ~ redux reducer function
import { AppDispatch, RootState } from "../../../store/store"; // ~ redux store

import { ICreateTeamForm, IMember } from "../../../types/interfaces"; // ~ Typescript interface
import { useEffect, useState } from "react";

const { Option } = Select;

const CreateTeam = () => {
  const { modalIsOpen } = useSelector((state: RootState) => state.createTeam);
  const [messageApi, contextHolder] = message.useMessage();
  const dispatch = useDispatch<AppDispatch>();
  const [form] = Form.useForm();
  const [members, setMembers] = useState<{ value: string }[] | DocumentData>(
    []
  );

  const fetchMembers = async () => {
    if (!auth.currentUser?.email) return;
    const usersRef = collection(db, "users");
    const q = query(usersRef);
    const querySnapshot = await getDocs(q);
    const members: DocumentData = [];

    querySnapshot.forEach((doc) => {
      const member = doc.data();
      if (member.email !== auth.currentUser?.email) {
        members.push(member);
      }
    });

    setMembers(members);
  };

  useEffect(() => {
    fetchMembers();
  }, [auth.currentUser?.email]);

  const createTeamHandler = async (values: ICreateTeamForm) => {
    try {
      const teamMembers = members.filter((member: IMember) =>
        values.membersEmail.includes(member.email)
      );

      console.log(auth.currentUser?.email);

      teamMembers.push({
        email: auth.currentUser?.email || localStorage.getItem("email"),
        fullName: auth.currentUser?.displayName || localStorage.getItem("name"),
      });

      await addDoc(collection(db, "teams"), {
        admin: auth.currentUser?.email || localStorage.getItem("email"),
        teamName: values.teamName,
        category: values.category,
        members: teamMembers,
      });
      dispatch(setModalIsOpen(false));
      messageApi.open({
        type: "success",
        content: "Team created successfully",
      });
    } catch (error: any) {
      messageApi.open({
        type: "error",
        content: error.message || "Something went wrong",
      });
    }
  };

  const membersEmail = members.map((member: IMember) => ({
    value: member.email,
  }));

  return (
    <Modal
      title="Create New Team"
      centered
      open={modalIsOpen}
      footer={null}
      onCancel={() => {
        dispatch(setModalIsOpen(false));
        form.resetFields();
      }}
    >
      {contextHolder}
      <Form
        onFinish={createTeamHandler}
        form={form}
        initialValues={{
          category: "development",
        }}
      >
        <Form.Item
          name="teamName"
          rules={[{ required: true, message: "Team Name is required!" }]}
        >
          <Input placeholder="Team Name" />
        </Form.Item>

        <Form.Item name="category">
          <Select>
            <Option value="development">Development</Option>
            <Option value="sqa">SQA</Option>
            <Option value="devops">Devops</Option>
            <Option value="human resources">Human Resources</Option>
            <Option value="finance">Finance</Option>
            <Option value="admin">Admin</Option>
          </Select>
        </Form.Item>

        <Form.Item
          name="membersEmail"
          rules={[{ required: true, message: "Members Email is required!" }]}
        >
          <Select
            mode="multiple"
            placeholder="Members"
            style={{ width: "100%" }}
            options={Array.isArray(membersEmail) ? membersEmail : []}
          />
        </Form.Item>

        <Form.Item>
          <Space>
            <Button onClick={() => dispatch(setModalIsOpen(false))}>
              Cancel
            </Button>
            <Button type="primary" htmlType="submit">
              Create
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CreateTeam;
