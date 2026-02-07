import { ActionTypes, DispatchType } from './actionTypes';
import { User } from '@app/models';

const changeUser = (user?: User | null) => {
    return {
        type: ActionTypes.SET_USER,
        user,
    };
};

const onSetUser = (user: User | null) => (dispatch: DispatchType) => {
    dispatch(changeUser(user));
};

export const WebAction = {
    onSetUser,
};
