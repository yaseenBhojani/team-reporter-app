import {
  addDoc,
  collection,
  DocumentData,
  getDocs,
  query,
  where,
} from 'firebase/firestore';
import { auth, db } from '../../../firebase';

import { Button, Form, Input, message, Modal, Select, Space } from 'antd';

import { useDispatch, useSelector } from 'react-redux';
import { setModalIsOpen } from '../../../store/reducers/createTeamReducer'; // ~ redux reducer function
import { AppDispatch, RootState } from '../../../store/store'; // ~ redux store

import { ICreateTeamForm } from '../../../types/interfaces'; // ~ Typescript interface

const { Option } = Select;

const CreateTeam = () => {
  const { modalIsOpen } = useSelector((state: RootState) => state.createTeam);
  const [messageApi, contextHolder] = message.useMessage();
  const dispatch = useDispatch<AppDispatch>();
  const [form] = Form.useForm();

  const createTeamHandler = async (values: ICreateTeamForm) => {
    const usersRef = collection(db, 'users');
    const q = query(usersRef, where('email', 'in', values.membersEmail));

    try {
      if (values.membersEmail.includes(auth.currentUser!.email!)) {
        throw new Error('You are already a member of this team');
      }

      const querySnapshot = await getDocs(q);
      const members: DocumentData = [];
      querySnapshot.forEach(doc => {
        members.push(doc.data());
      });

      if (members.length !== values.membersEmail.length) {
        throw new Error('Invalid members');
      }

      members.push({
        email: auth.currentUser!.email,
        fullName: auth.currentUser!.displayName,
      });

      await addDoc(collection(db, 'teams'), {
        admin: auth.currentUser!.email,
        teamName: values.teamName,
        category: values.category,
        members,
      });

      dispatch(setModalIsOpen(false));
      messageApi.open({
        type: 'success',
        content: 'Team created successfully',
      });
    } catch (error: any) {
      messageApi.open({
        type: 'error',
        content: error.message,
      });
    }
  };

  return (
    <Modal
      title='Create New Team'
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
          category: 'development',
        }}
      >
        <Form.Item
          name='teamName'
          rules={[{ required: true, message: 'Team Name is required!' }]}
        >
          <Input placeholder='Team Name' />
        </Form.Item>

        <Form.Item name='category'>
          <Select>
            <Option value='development'>Development</Option>
            <Option value='sqa'>SQA</Option>
            <Option value='devops'>Devops</Option>
            <Option value='human resources'>Human Resources</Option>
            <Option value='finance'>Finance</Option>
            <Option value='admin'>Admin</Option>
          </Select>
        </Form.Item>

        <Form.Item
          name='membersEmail'
          rules={[{ required: true, message: 'Members Email is required!' }]}
        >
          <Select
            mode='tags'
            placeholder='Members (type email)'
            style={{ width: '100%' }}
          />
        </Form.Item>

        <Form.Item>
          <Space>
            <Button onClick={() => dispatch(setModalIsOpen(false))}>
              Cancel
            </Button>
            <Button type='primary' htmlType='submit'>
              Create
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CreateTeam;
