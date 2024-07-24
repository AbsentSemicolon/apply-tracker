import { PayloadAction, createSlice } from "@reduxjs/toolkit";

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
            state.isChanged = true;
            state.items[newItem.jobId] = newItem;
        },
        sortItemList(state, action) {
            state.isChanged = true;
            state.sort = action.payload;
        },
        setViewAs(state, { payload }: PayloadAction<string>) {
            state.isChanged = true;
            state.viewAs = payload;
        },
        removeItem(state, { payload }: PayloadAction<string>) {
            state.isChanged = true;

            /* Cannot figure out how to sort out the TypeScript issue with
             * removing a property from an Object. The code works just fine.
             */
            // @ts-expect-error: Unreachable code error
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { [payload]: _, ...result } = state.items;

            state.items = result;
        },
        removeAllItems(state) {
            state.items = {};
            state.isChanged = true;
        },
        setItemToEdit(state, action) {
            state.editingJob = action.payload;
        },
        updateItemStatus(state, action) {
            state.items[action.payload.jobId] = {
                ...state.items[action.payload.jobId],
                jobStatus: action.payload.status
            };
            state.isChanged = true;
        },
        clearEditingJob(state) {
            state.editingJob = null;
        }
    }
});

export const applicationsActions = applicationsSlice.actions;

export default applicationsSlice;
