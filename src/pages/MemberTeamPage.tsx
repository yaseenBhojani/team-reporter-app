import { Button, Card, Form, Input, message } from 'antd';
import { doc, DocumentData, getDoc, setDoc } from 'firebase/firestore';
import { useEffect, useState } from 'react';

import { useNavigate, useParams } from 'react-router-dom';
import LoadingSpinner from '../components/UI/LoadingSpinner';
import { db } from '../firebase';
import {
  IAnswer,
  IMemberForm,
  IMemberFormAnswer,
  ITeam,
} from '../types/interfaces';

import { HiOutlinePencilSquare } from 'react-icons/hi2';
import { BsBack } from 'react-icons/bs';

const MemberTeamPage = () => {
  const params = useParams();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);
  const [team, setTeam] = useState<null | DocumentData | ITeam>(null);

  const getTeam = async () => {
    setIsLoading(true);
    try {
      const teamRef = doc(db, 'teams', params.id!);
      const docSnap = await getDoc(teamRef);

      if (docSnap.exists()) {
        setTeam(docSnap.data());
      } else {
        message.info('Document does not exist!');
      }
    } catch (error: any) {
      message.error(error.message);
      navigate('/');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getTeam();
  }, []);

  const answersSubmitHandler = async (values: IMemberForm) => {
    if (!values.answer1 && !values.answer2 && !values.answer3)
      return message.error('Please enter a answer field!');

    const adminQuestions = team!.questions;

    const answers: IMemberFormAnswer[] = [];

    if (adminQuestions[0]) {
      answers.push({ [adminQuestions[0]]: values.answer1 || '' });
    }

    if (adminQuestions[1]) {
      answers.push({ [adminQuestions[1]]: values.answer2 || '' });
    }

    if (adminQuestions[2]) {
      answers.push({ [adminQuestions[2]]: values.answer3 || '' });
    }

    try {
      setIsLoading(true);

      let isAnswerSend = false;
      const updatedAnswers = team?.answers.map((answer: IAnswer) => {
        if (answer.name === localStorage.getItem('name') && !isAnswerSend) {
          for (const answerItem of answer.answer) {
            const answer = Object.values(answerItem);
            if (answer.join('')) {
              throw new Error('you have already answered this question');
            }
          }

          isAnswerSend = true;

          return {
            name: answer.name,
            time: answer.time,
            answer: answers,
          };
        }
        return answer;
      });

      const updatedTeam = { ...team, answers: updatedAnswers };

      await setDoc(doc(db, 'teams', params.id!), updatedTeam);
      message.success('Answer submitted!');
      getTeam();
    } catch (error: any) {
      message.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className='member-team-page'>
      <BsBack
        className='member-back-icon'
        size={26}
        onClick={() => navigate('/')}
      />

      {team?.questions && (
        <Card title='Admin Questions'>
          <Form layout='vertical' onFinish={answersSubmitHandler}>
            {team.questions[0] && (
              <Form.Item label={team.questions[0]} name='answer1'>
                <Input placeholder='Answer' autoFocus allowClear />
              </Form.Item>
            )}

            {team.questions[1] && (
              <Form.Item label={team.questions[1]} name='answer2'>
                <Input placeholder='Answer' allowClear />
              </Form.Item>
            )}

            {team.questions[2] && (
              <Form.Item label={team.questions[2]} name='answer3'>
                <Input placeholder='Answer' allowClear />
              </Form.Item>
            )}

            <Form.Item>
              <Button type='primary' htmlType='submit'>
                <HiOutlinePencilSquare /> Submit
              </Button>
            </Form.Item>
          </Form>
        </Card>
      )}

      {!team?.questions && <h2>There are no question</h2>}
    </div>
  );
};

export default MemberTeamPage;
