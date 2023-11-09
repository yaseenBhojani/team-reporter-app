import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { IMember, IOwnTeamsState } from "../../types/interfaces";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase";

const adminEmail = localStorage.getItem("email");

export const getOwnTeam = createAsyncThunk("get/team", async (id: string) => {
  const docRef = doc(db, "teams", id);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) return docSnap.data();
  else throw new Error("Team does not exist");
});

const initialState: IOwnTeamsState = {
  isLoading: false,
  teamName: "",
  question1: "",
  question2: "",
  question3: "",
  category: "",
  answers: [],
  members: [],
};

export const ownTeamReducer = createSlice({
  name: "counter",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    const { addCase } = builder;

    addCase(getOwnTeam.pending, (state, action) => {
      state.isLoading = true;
    });

    addCase(getOwnTeam.fulfilled, (state, action) => {
      state.isLoading = false;

      const { questions, members, answers, category, teamName } =
        action.payload;

      if (questions) {
        if (questions[0]) state.question1 = questions[0];
        if (questions[1]) state.question2 = questions[1];
        if (questions[2]) state.question3 = questions[2];
      } else {
        state.question1 = "";
        state.question2 = "";
        state.question3 = "";
      }

      if (members)
        state.members = members.filter(
          (member: IMember) => member.email !== adminEmail
        );

      if (answers) state.answers = answers;
      else state.answers = [];

      state.teamName = teamName;
      state.category = category;
    });

    addCase(getOwnTeam.rejected, (state, action) => {
      state.isLoading = false;
    });
  },
});

export default ownTeamReducer.reducer;
