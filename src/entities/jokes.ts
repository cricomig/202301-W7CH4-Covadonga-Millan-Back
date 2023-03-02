import { User } from './user';

export type Joke = {
  id: string;
  joke: string;
  isFunny: boolean;
  alreadyKnewIt: boolean;
  owner: User;
};
