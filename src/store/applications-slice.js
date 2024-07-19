import { createSlice } from "@reduxjs/toolkit";

const applicationsSlice = createSlice({
    name: "applications",
    initialState: {
        items: {},
        changed: false,
        sort: {
            by: "jobApplyDate",
            dir: "desc"
        }
    },
    reducers: {
        replaceApplications(state, action) {
            state.items = action.payload.items;
        },
        addItem(state, action) {
            const newItem = action.payload;
            let existingItem = state.items[newItem.jobId];
            state.changed = true;
            console.log(existingItem);

            if (!existingItem) {
                state.items[newItem.jobId] = newItem;
            } else {
                existingItem = newItem;
            }
        },
        sortItemList(state, action) {
            state.sort = action.payload;
        }
    }


});


export const applicationsActions = applicationsSlice.actions;

export default applicationsSlice;