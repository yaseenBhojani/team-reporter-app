import { message, Tabs } from "antd";
import type { TabsProps } from "antd";

import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

// *** Icons =====>>
import { IoReturnUpBack } from "react-icons/io5";
import { TbMessageReport, TbSettings } from "react-icons/tb";

// *** Components =====>>
import Reports from "../components/teams/team/ownTeam/Reports";
import Settings from "../components/teams/team/ownTeam/Settings";
import { useEffect } from "react";
import { getOwnTeam } from "../store/reducers/ownTeamsReducer";
import { AppDispatch, RootState } from "../store/store";
import LoadingSpinner from "../components/UI/LoadingSpinner";

const AdminTeamPage = () => {
  const params = useParams();
  const navigate = useNavigate();

  const dispatch = useDispatch<AppDispatch>();
  const { isLoading } = useSelector((state: RootState) => state.ownTeam);

  useEffect(() => {
    dispatch(getOwnTeam(params.id!))
      .unwrap()
      .catch((err: any) => {
        message.open(err.message || "Something went wrong");
        navigate("/");
      });
  }, []);

  const onChange = (key: string) => {
    if (key === "back") navigate("/");
  };

  const items: TabsProps["items"] = [
    {
      key: "back",
      label: <IoReturnUpBack size={18} />,
    },
    {
      key: "reports",
      label: (
        <>
          <TbMessageReport /> Reports
        </>
      ),
      children: <Reports />,
    },
    {
      key: "settings",
      label: (
        <>
          <TbSettings /> Settings
        </>
      ),
      children: <Settings />,
    },
  ];

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="admin-team-page">
      <Tabs defaultActiveKey="reports" items={items} onChange={onChange} />
    </div>
  );
};

export default AdminTeamPage;
