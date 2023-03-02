import { Joke } from './jokes';

export type User = {
  id: string;
  email: string;
  passwd: string;
  jokes: Joke[];
};
