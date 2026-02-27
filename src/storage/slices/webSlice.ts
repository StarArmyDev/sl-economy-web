import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User } from '@app/models';

interface WebState {
    user: User | null;
}

const initialState: WebState = {
    user: null,
};

export const webSlice = createSlice({
    name: 'web',
    initialState,
    reducers: {
        setUser: (state, action: PayloadAction<User | null>) => {
            state.user = action.payload;
        },
    },
});

export const { setUser } = webSlice.actions;

export default webSlice.reducer;
