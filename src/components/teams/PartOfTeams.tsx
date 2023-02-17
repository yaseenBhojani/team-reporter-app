import { Spin, Typography } from 'antd';
import {
  collection,
  DocumentData,
  onSnapshot,
  query,
  where,
} from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { db } from '../../firebase';
import { ITeam } from '../../types/interfaces';
import Team from './team/Team';

const { Title } = Typography;

const PartOfTeams = () => {
  const [teams, setTeams] = useState<DocumentData>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);

    const email = localStorage.getItem('email');
    const name = localStorage.getItem('name');

    const teamsRef = query(
      collection(db, 'teams'),
      where('members', 'array-contains', {
        email: email,
        fullName: name,
      }),
      where('admin', '!=', email)
    );

    const unsubscribe = onSnapshot(teamsRef, querySnapshot => {
      const teams: DocumentData = [];
      querySnapshot.forEach(doc => {
        teams.push({ ...doc.data(), id: doc.id });
      });
      setTeams(teams);
      setIsLoading(false);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <div className='part-of-teams'>
      <Title level={2}>Teams you're part of</Title>

      {isLoading && (
        <div className='spin'>
          <Spin />
        </div>
      )}

      {teams.map((team: ITeam, index: number) => (
        <Team key={index} {...team} />
      ))}
    </div>
  );
};

export default PartOfTeams;
