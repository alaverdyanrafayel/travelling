import { BankStatementsController } from './bankstatements.controller';
import middlewares from '../../middlewares';
import schemas from './schemas';

export default (router) => {

    const {
        addBankStatements,
        getStatus
    } = BankStatementsController;

    router.post('/', ...middlewares(schemas, 'addBankStatements'), addBankStatements);
    
    router.get('/status/:id', ...middlewares(schemas, 'getStatus'), getStatus);

};
