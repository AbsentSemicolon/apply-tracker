import { applicationsActions } from "./applications-slice";

export const fetchApplicationData = () => {
    return async (dispatch) => {
        const localStorageTracker = localStorage.getItem("applyTracker");

        dispatch(
            applicationsActions.replaceApplications({
                items: JSON.parse(localStorageTracker).items || {}
            })
        );
    };
};

export const saveApplicationdata = (items) => {
    return async (dispatch) => {
        console.log('saving...');
        console.log(items);
        localStorage.setItem("applyTracker", JSON.stringify(items));
    };
};