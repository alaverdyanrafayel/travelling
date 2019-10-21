import './db';
import http from 'http';
import params from './app/configs/params';
import App from './app/app';
import bunyan from 'bunyan';

const log = bunyan.createLogger({ name: 'Holipay' });
const server = http.createServer(App());

server.listen(params.apiPort, () => {
    log.info(`Listening ${server.address().port} port.`);
});
