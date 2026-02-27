import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AlertMessage } from '@app/models';

interface UIState {
    isLoading: boolean;
    alertMessage: AlertMessage;
}

const initialState: UIState = {
    isLoading: true,
    alertMessage: {
        show: false,
        message: '',
    },
};

export const uiSlice = createSlice({
    name: 'ui',
    initialState,
    reducers: {
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.isLoading = action.payload;
        },
        setAlert: (state, action: PayloadAction<AlertMessage>) => {
            state.alertMessage = action.payload;
        },
    },
});

export const { setLoading, setAlert } = uiSlice.actions;

export default uiSlice.reducer;
