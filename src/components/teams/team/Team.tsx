import { Badge, Card, Space, Typography } from 'antd';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { ITeam } from '../../../types/interfaces';

const { Title, Text } = Typography;

const Team = ({ id, members, teamName, admin }: ITeam) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  let membersName: string | string[] = members.map(member => member.fullName);

  const email = localStorage.getItem('email');

  if (!email) return <></>;
  membersName.splice(membersName.indexOf(email), 1);

  if (admin !== email) {
    membersName.unshift('You');
  }

  if (membersName.length < 3) {
    membersName = membersName.join(', ');
  } else {
    membersName = `${membersName[0]}, ${membersName[1]} & ${
      membersName.length - 2
    } ${membersName.length === 3 ? 'other' : 'others'}`;
  }

  const navigateHandler = () => {
    if (admin === email) navigate(`/adminTeamPage/${id}`);
    else navigate(`/memberTeamPage/${id}`);
  };

  return (
    <Card className='team' onClick={navigateHandler}>
      <Title level={4}>{teamName}</Title>

      <Space className='team-info'>
        <span className='title'>Members:</span>
        <Text>{membersName}</Text>
      </Space>
    </Card>
  );
};

export default Team;
