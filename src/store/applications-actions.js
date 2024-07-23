import { applicationsActions } from "./applications-slice";

export const fetchApplicationData = () => {
    return async (dispatch) => {
        const localStorageTracker = localStorage.getItem("applyTracker");

        if (localStorageTracker) {
            const parsed = JSON.parse(localStorageTracker);

            dispatch(
                applicationsActions.replaceApplications({
                    items: parsed.items || {},
                    sort: parsed.sort || {
                        by: "jobApplyDate",
                        dir: "desc"
                    }
                })
            );
        }
    };
};

export const saveApplicationdata = (appItems) => {
    return async () => {
        const { items, sort, viewAs } = appItems;
        localStorage.setItem("applyTracker", JSON.stringify({ items, sort, viewAs }));
    };
};