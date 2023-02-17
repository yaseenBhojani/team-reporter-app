import { useRef, useState } from 'react';

import { Button, Input, Popconfirm, Space, Typography, message } from 'antd';

import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../../store/store';

import {
  IAnswer,
  IAnswerDetails,
  IMember,
  ITeam,
} from '../../../../types/interfaces';

import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  setDoc,
  where,
} from 'firebase/firestore';
import { db } from '../../../../firebase';
import validateEmail from '../../../../utils/emailValidator';

import { useNavigate, useParams } from 'react-router-dom';

// *** Icons =====>>
import { RxCrossCircled } from 'react-icons/rx';
import { VscSave } from 'react-icons/vsc';
import {
  AiOutlineDelete,
  AiOutlineReload,
  AiOutlineUserAdd,
} from 'react-icons/ai';
import { getOwnTeam } from '../../../../store/reducers/ownTeamsReducer';

const { Title } = Typography;

const adminEmail = localStorage.getItem('email');
const adminName = localStorage.getItem('name');

const Settings = () => {
  const dispatch = useDispatch<AppDispatch>();
  const params = useParams();
  const navigate = useNavigate();

  const {
    members: initialMembers,
    question1: q1,
    question2: q2,
    question3: q3,
    answers: oldAnswers,
    category,
    teamName,
  } = useSelector((state: RootState) => state.ownTeam);

  const [addMemberBtnLoading, setAddMemberBtnLoading] = useState(false);
  const [members, setMembers] = useState(initialMembers); // ~ team members

  // * Questions Input States
  const [question1, setQuestion1] = useState(q1 || '');
  const [question2, setQuestion2] = useState(q2 || '');
  const [question3, setQuestion3] = useState(q3 || '');

  // * Add Member Input Ref
  const addMemberInputRef = useRef<HTMLInputElement | null>(null);

  // * Function for adding a member
  const addMemberHandler = async () => {
    setAddMemberBtnLoading(true);

    try {
      const memberEmail = addMemberInputRef.current!.value;
      if (!memberEmail) return; // ~ if input is empty string then nothing to do

      // ~ if email is equal to admin then do nothing
      if (memberEmail === adminEmail) {
        throw new Error('You cannot add yourself as a member');
      }
      // ~ if email is not valid then do nothing
      if (!validateEmail(memberEmail)) {
        throw new Error('Please enter a valid email address');
      }

      // ~ if email already in a member then do nothing
      const isEmailAlreadyExist = members.find(
        (member: IMember) => member.email === memberEmail
      );
      if (isEmailAlreadyExist) {
        throw new Error('This email is already a member');
      }

      // ~ get member to firestore
      const q = query(
        collection(db, 'users'),
        where('email', '==', memberEmail)
      );
      const querySnapshot = await getDocs(q);
      const member = querySnapshot.docs[0].data();

      // ~ if member does not exist then do nothing
      if (!member) throw new Error('Member does not exist');

      // ~ add member to members array
      setMembers(prevMembers => [
        ...prevMembers,
        { email: member.email, fullName: member.fullName },
      ]);

      addMemberInputRef.current!.value = '';
    } catch (error: any) {
      message.error(error.message);
    } finally {
      setAddMemberBtnLoading(false);
    }
  };

  // * Function for remove team member
  const removeMemberHandler = (index: number) => {
    const newMembers = [...members];
    newMembers.splice(index, 1);
    setMembers(newMembers);
  };

  // * Function for cancel team changes
  const cancelTeamChangesHandler = () => {
    setQuestion1(q1 || '');
    setQuestion2(q2 || '');
    setQuestion3(q3 || '');
    setMembers(initialMembers);
    addMemberInputRef.current!.value = '';
  };

  // * Function for delete team
  const deleteTeamHandler = async () => {
    try {
      await deleteDoc(doc(db, 'teams', params.id!));
      message.success('Team deleted successfully');
      navigate('/');
    } catch (error: any) {
      message.error(error.message);
    }
  };

  // * Function for save changes to team
  const saveTeamChangesHandler = async () => {
    const updatedTeam: ITeam = {
      members: [...members, { fullName: adminName!, email: adminEmail! }],
      admin: adminEmail!,
      category,
      teamName,
    };

    if (question1 || question2 || question3) {
      const time = new Date().getTime();

      const questions: string[] = [];
      const newAnswers: IAnswerDetails[] = [];

      if (question1) {
        questions.push(question1);
      }
      if (question2) {
        questions.push(question2);
      }
      if (question3) {
        questions.push(question3);
      }

      members.forEach(member => {
        const answerDetails: IAnswerDetails = {
          time,
          name: member.fullName,
          answer: [],
        };

        const answer: IAnswer[] = [];

        questions.forEach(question => {
          answer.push({ [question]: '' });
        });

        answerDetails.answer = answer;
        newAnswers.push(answerDetails);
      });

      updatedTeam.questions = questions;
      if (oldAnswers) newAnswers.push(...oldAnswers);

      updatedTeam.answers = newAnswers;
    }

    try {
      await setDoc(doc(db, 'teams', params.id!), updatedTeam);
      dispatch(getOwnTeam(params.id!))
        .unwrap()
        .then(() => message.success('Team updated successfully'))
        .catch((error: any) => error.message(error.message));
    } catch (error: any) {
      console.log(error);
      message.error(error.message);
    }
  };

  return (
    <div className='settings'>
      <div className='questions'>
        <Title level={3}>Questions:</Title>
        <Space direction='vertical'>
          <Input
            placeholder='Question...'
            bordered={false}
            value={question1}
            onChange={e => setQuestion1(e.target.value)}
          />

          <Input
            placeholder='Question...'
            bordered={false}
            value={question2}
            onChange={e => setQuestion2(e.target.value)}
          />

          <Input
            placeholder='Question...'
            bordered={false}
            value={question3}
            onChange={e => setQuestion3(e.target.value)}
          />
        </Space>
      </div>

      <div className='members'>
        <Title level={3}>Members:</Title>
        <ul>
          {members.map((member: IMember, index: number) => (
            <li key={index}>
              {member.email}{' '}
              <RxCrossCircled
                size={18}
                onClick={() => removeMemberHandler(index)}
              />
            </li>
          ))}
        </ul>
      </div>

      <div className='add-member'>
        <input placeholder='Add Member' ref={addMemberInputRef} />

        <Button
          type='primary'
          onClick={addMemberHandler}
          loading={addMemberBtnLoading}
        >
          <AiOutlineUserAdd />
          Add
        </Button>
      </div>

      <div className='btn-container'>
        <Popconfirm
          title='Save changes the team'
          description='Are you sure to save changes this Team?'
          onConfirm={saveTeamChangesHandler}
          okText='Yes'
          cancelText='No'
        >
          <Button type='primary'>
            <VscSave />
            Save Changes
          </Button>
        </Popconfirm>

        <Button onClick={cancelTeamChangesHandler}>
          <AiOutlineReload />
          Cancel
        </Button>

        <Popconfirm
          title='Delete the team'
          description='Are you sure to delete this Team?'
          onConfirm={deleteTeamHandler}
          okText='Yes'
          cancelText='No'
        >
          <Button type='primary' danger>
            <AiOutlineDelete /> Delete Team
          </Button>
        </Popconfirm>
      </div>
    </div>
  );
};

export default Settings;
