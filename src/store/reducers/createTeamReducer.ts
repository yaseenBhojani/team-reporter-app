import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

const initialState = {
  modalIsOpen: false,
};

export const createTeamSlice = createSlice({
  name: 'counter',
  initialState,
  reducers: {
    setModalIsOpen: (state, action: PayloadAction<boolean>) => {
      state.modalIsOpen = action.payload;
    },
  },
});

export const { setModalIsOpen } = createTeamSlice.actions;

export default createTeamSlice.reducer;
