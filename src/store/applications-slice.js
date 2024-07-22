import { createSlice } from "@reduxjs/toolkit";

const applicationsSlice = createSlice({
    name: "applications",
    initialState: {
        isChanged: false,
        items: {},
        sort: {
            by: "",
            dir: ""
        },
        viewAs: "tiles",
        editingJob: null
    },
    reducers: {
        replaceApplications(state, action) {
            state.items = action.payload.items;
            state.sort = action.payload.sort;
        },
        addItem(state, action) {
            const newItem = action.payload;
            let existingItem = state.items[newItem.jobId];
            state.isChanged = true;

            if (!existingItem) {
                state.items[newItem.jobId] = newItem;
            } else {
                state.items[newItem.jobId] = newItem;
            }
        },
        sortItemList(state, action) {
            state.isChanged = true;
            state.sort = action.payload;
        },
        setViewAs(state, action) {
            state.isChanged = true;
            state.viewAs = action.payload;
        },
        removeItem(state, action) {
            state.isChanged = true;
            const { [action.payload]: _, ...result } = state.items;

            state.items = result;
        },
        removeAllItems(state) {
            state.items = {};
            state.isChanged = true;
        },
        setItemToEdit(state, action) {
            state.editingJob = action.payload;
        }
    }
});


export const applicationsActions = applicationsSlice.actions;

export default applicationsSlice;