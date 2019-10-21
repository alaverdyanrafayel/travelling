import { getUserFailed, getUserSucceed } from '../modules/auth-user/AuthUserActions';
import { FORBIDDEN } from 'configs/constants';
import { attemptGetUser } from 'api/AuthApi';
import { ACTIVE } from '../../configs/constants';
import { getMerchantSucceed } from '../modules/auth-merchant/AuthMerchantActions';

export default async function getUser(store) {
    const { dispatch } = store;
    const state = store.getState();
    
    try {
        if (state.getIn(['userData', 'loggedInUser', 'status']) !== ACTIVE && 
            state.getIn(['merchantData', 'loggedInUser', 'status']) !== ACTIVE) {
            const { data: user } = await attemptGetUser();
            const { role } = user;
            if(role === 'M') {
                await dispatch(getMerchantSucceed(user));
            }else{
                await dispatch(getUserSucceed(user)); 
            }
        }
    } catch ({ response }) {
        if (response && response.status === FORBIDDEN) {
            await getUser(store);
        } else {
            await dispatch(getUserFailed());
        }
    }
}
