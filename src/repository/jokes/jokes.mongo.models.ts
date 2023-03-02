import { model, Schema } from 'mongoose';
import { Joke } from '../../entities/jokes';

const jokeSchema = new Schema<Joke>({
  joke: {
    type: String,
    required: true,
  },
  isFunny: {
    type: Boolean,
    required: true,
  },
  alreadyKnewIt: {
    type: Boolean,
    required: true,
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
});

jokeSchema.set('toJSON', {
  transform(_document, returnedObject) {
    returnedObject.id = returnedObject._id;
    delete returnedObject.__v;
    delete returnedObject._id;
  },
});

export const JokesModel = model('Joke', jokeSchema, 'jokes');
