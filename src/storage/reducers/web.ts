import { ActionParam, ActionTypes } from '@app/storage';
import { User } from '@app/models';

interface WebState extends ActionParam {
    user?: User | null;
}

const initialState: WebState = {
    user: undefined,
};

export const WebReducer = (state = initialState, action?: WebState) => {
    switch (action?.type) {
        case ActionTypes.SET_USER:
            return {
                ...state,
                user: action.user,
            };
        default:
            return state;
    }
};
