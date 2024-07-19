import applicationsSlice from "./applications-slice";
import { configureStore } from "@reduxjs/toolkit";

const store = configureStore({
    reducer: { appList: applicationsSlice.reducer },
});

  export default store;