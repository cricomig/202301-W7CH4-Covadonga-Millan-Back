import createDebug from 'debug';
import http from 'http';
import { app } from './app.js';
import { dbConnect } from './db/mongo.connect.js';

const PORT = process.env.PORT || 2332;

const debug = createDebug('CP');

const server = http.createServer(app);

dbConnect()
  .then((mongoose) => {
    server.listen(PORT);
    debug('DB:', mongoose.connection.db.databaseName);
  })
  .catch((error) => server.emit('error', error));

server.on('error', (error) => {
  debug(error.message);
});

server.on('listening', () => {
  debug('Listening on ' + PORT);
});
