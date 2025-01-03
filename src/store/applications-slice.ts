import { AppListSort, Interview, JobType, ReplaceAppData } from "../lib/types";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";

export const appListInitialState = {
    isChanged: false,
    items: {},
    sort: {
        by: "",
        dir: ""
    },
    viewAs: "tiles",
    editingJob: "",
    gistId: "",
    accessToken: ""
};

const applicationsSlice = createSlice({
    name: "applications",
    initialState: appListInitialState,
    reducers: {
        replaceApplications(state, { payload }: PayloadAction<ReplaceAppData>) {
            return {
                ...state,
                items: payload.items,
                sort: payload.sort,
                viewAs: payload.viewAs
            };
        },
        addBootStrapData(state, { payload }) {
            return {
                ...state,
                gistId: payload.gistId,
                accessToken: payload.accessToken
            };
        },
        addItem(state, { payload }: PayloadAction<JobType>) {
            state.isChanged = true;
            state.items[payload.jobId] = payload;
        },
        sortItemList(state, { payload }: PayloadAction<AppListSort>) {
            state.isChanged = true;
            state.sort = payload;
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
        setItemToEdit(state, { payload }: PayloadAction<string>) {
            state.editingJob = payload;
        },
        updateItemStatus(state, action) {
            state.isChanged = true;
            state.items[action.payload.jobId] = {
                ...state.items[action.payload.jobId],
                jobStatus: action.payload.status
            };
        },
        updateInterviewList(state, action: PayloadAction<{ jobId: string; interviewList: Interview[] }>) {
            state.isChanged = true;
            const hasInterviewed: boolean = action.payload.interviewList.length > 0;
            state.items[action.payload.jobId] = {
                ...state.items[action.payload.jobId],
                interviewList: action.payload.interviewList,
                jobHasInterviewed: hasInterviewed
            };
        },
        clearEditingJob(state) {
            state.editingJob = "";
        }
    }
});

export const selectApplicationList = (state) => state.appList;
export const selectApplicationListIsChanged = (state) => state.appList.isChanged;
export const selectApplicationSort = (state) => state.appList.sort;
export const selectApplicationItems = (state) => state.appList.items;
export const selectApplicationEditing = (state) => state.appList.editingJob;
export const selectApplicationListViewAs = (state) => state.appList.viewAs;
export const selectGistId = (state) => state.appList.gistId;
export const applicationsActions = applicationsSlice.actions;

export default applicationsSlice;
