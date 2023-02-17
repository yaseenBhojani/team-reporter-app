import { configureStore } from '@reduxjs/toolkit';
import createTeamReducer from './reducers/createTeamReducer';
import ownTeamsReducer from './reducers/ownTeamsReducer';

export const store = configureStore({
  reducer: {
    createTeam: createTeamReducer,
    ownTeam: ownTeamsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
