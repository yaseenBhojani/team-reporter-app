import { ReactNode } from 'react';

export interface IChildren {
  children: ReactNode;
}

export interface ILoginForm {
  email: string;
  password: string;
}

export interface ISignupForm extends ILoginForm {
  fullName: string;
}

export interface ICreateTeamForm {
  teamName: string;
  category: string;
  membersEmail: string[];
}

export interface IMember {
  fullName: string;
  email: string;
}

export interface IAnswer {
  [question: string]: string;
}

export interface IAnswerDetails {
  name: string;
  time: number;
  answer: IAnswer[];
}

export interface ITeam {
  admin: string;
  teamName: string;
  category: string;
  id?: string;
  members: IMember[];
  questions?: string[];
  answers?: IAnswerDetails[];
}

export interface IOwnTeamsState {
  teamName: string;
  isLoading: boolean;
  question1?: string;
  question2?: string;
  question3?: string;
  category: string;
  answers?: IAnswerDetails[];
  members: IMember[];
}

export interface IMemberForm {
  answer1: string;
  answer2: string;
  answer3: string;
}

export interface IMemberFormAnswer {
  [key: string]: string;
}
