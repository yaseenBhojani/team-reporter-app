import { Fragment, useEffect } from "react";
import { Button, FloatButton, message, Tooltip } from "antd";

import { useDispatch } from "react-redux";
import { setModalIsOpen } from "../store/reducers/createTeamReducer";

// *** Components ***
import OwnTeams from "../components/teams/OwnTeams";
import PartOfTeams from "../components/teams/PartOfTeams";
import CreateTeam from "../components/teams/team/CreateTeam";

// *** Icons ***
import { VscAdd } from "react-icons/vsc";
import { AiOutlineLogout } from "react-icons/ai";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";

const Teams = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [messageApi, contextHolder] = message.useMessage();

  const logoutHandler = async () => {
    try {
      await signOut(auth);
      localStorage.removeItem("name");
      localStorage.removeItem("email");
      navigate("/login");
    } catch (error: any) {
      messageApi.open({
        type: "error",
        content: error.message || "Something went wrong",
      });
    }
  };

  useEffect(() => {
    if (!localStorage.getItem("email") || !localStorage.getItem("name")) {
      navigate("/login");
      return;
    }

    onAuthStateChanged(auth, (user) => {
      if (!user) {
        navigate("/login");
      }
    });
  }, []);

  return (
    <Fragment>
      {contextHolder}

      <Button
        className="logout-btn"
        type="primary"
        danger
        onClick={logoutHandler}
      >
        <AiOutlineLogout size={16} /> Logout
      </Button>

      <OwnTeams />

      <PartOfTeams />

      <CreateTeam />

      <Tooltip placement="left" title={"Create Team"} color={"#4ed8ae"}>
        <FloatButton
          shape="square"
          type="primary"
          style={{ right: 24 }}
          icon={<VscAdd size={20} />}
          onClick={() => dispatch(setModalIsOpen(true))}
        />
      </Tooltip>
    </Fragment>
  );
};

export default Teams;
