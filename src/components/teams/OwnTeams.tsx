import { useEffect, useState } from "react";
import { Spin, Typography } from "antd";

import {
  collection,
  DocumentData,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import { auth, db } from "../../firebase";
import { ITeam } from "../../types/interfaces";

import Team from "./team/Team"; // ~ Component

const { Title } = Typography;

const OwnTeams = () => {
  const [teams, setTeams] = useState<DocumentData>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);

    const teamsRef = query(
      collection(db, "teams"),
      where("admin", "==", auth.currentUser?.email || "")
    );

    const unsubscribe = onSnapshot(teamsRef, (querySnapshot) => {
      const teams: DocumentData = [];
      querySnapshot.forEach((doc) => {
        console.log(doc);
        teams.push({ ...doc.data(), id: doc.id });
      });
      setTeams(teams);
      setIsLoading(false);
    });

    return () => {
      unsubscribe();
    };
  }, [auth.currentUser?.email]);

  return (
    <div className="own-teams">
      <Title level={2}>Teams you own</Title>

      {isLoading && (
        <div className="spin">
          <Spin />
        </div>
      )}

      {teams.map((team: ITeam, index: number) => (
        <Team key={index} {...team} />
      ))}
    </div>
  );
};

export default OwnTeams;
