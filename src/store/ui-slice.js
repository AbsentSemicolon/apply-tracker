import { createSlice } from "@reduxjs/toolkit";

const uiSlice = createSlice({
    name: "ui",
    initialState: { modalIsVisible: false },
    reducers: {
        toggleModal(state, action) {
            console.log('action', action);
            state.modalIsVisible = action.payload;
        }
    }
});

export const uiActions = uiSlice.actions;

export default uiSlice;