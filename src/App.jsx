import "./App.css";

import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";
import {
    fetchApplicationData,
    saveApplicationdata
} from "./store/applications-actions";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";

import AddJob from "./components/AddJob";
import DialogModal from "./components/DialogModal";
import Job from "./components/job";
import JobsTable from "./components/JobTable";
import Version from "./version.json";
import { applicationsActions } from "./store/applications-slice";

const App = () => {
    const dispatch = useDispatch();
    const [localData, setLocalData] = useState(null);
    const [currentJob, setCurrentJob] = useState(null);
    const [isOpened, setIsOpened] = useState(false);
    const [viewAs, setViewAs] = useState("tiles");
    const applicationItems = useSelector((state) => state.appList);

    useEffect(() => {
        dispatch(fetchApplicationData());
    }, [dispatch]);

    useEffect(() => {
        if (applicationItems.isChanged) {
            setIsOpened(false);
            dispatch(saveApplicationdata(applicationItems));
        }
    }, [applicationItems, dispatch]);

    const sortItems = (items) => {
        if (!items) {
            return [];
        }
        return Object.values(items).sort((a, b) => {
            const sortBy = applicationItems.sort.by;
            const sortDir = applicationItems.sort.dir;
            if (sortBy !== "jobApplyDate") {
                if (a[sortBy].toUpperCase() > b[sortBy].toUpperCase()) {
                    return sortDir === "asc" ? 1 : -1;
                }

                return sortDir === "asc" ? -1 : 1;
            }

            const date = new Date(b.jobApplyDate) - new Date(a.jobApplyDate);

            if (date < 0) {
                return sortDir === "asc" ? 1 : -1;
            }

            return sortDir === "asc" ? -1 : 1;
        });
    };

    const updateJobStatus = (jobId, jobStatus) => {
        setLocalData((prevLocalData) => {
            return {
                ...prevLocalData,
                [jobId]: {
                    ...prevLocalData[jobId],
                    jobStatus
                }
            };
        });
    };

    const removeJob = (jobId) => {
        const confirm = window.confirm("are you sure?");

        if (confirm) {
            setLocalData((prevLocalData) => {
                const { [jobId]: _, ...result } = prevLocalData;

                return result;
            });
        }
    };

    const clearAllJobs = () => {
        setLocalData({});
    };

    const editJob = (jobId) => {
        setCurrentJob(localData[jobId]);
        setIsOpened(true);
    };

    const clearCurrentJob = () => {
        setCurrentJob(null);
    };

    const closeModal = () => {
        setCurrentJob(null);
        setIsOpened(false);
    };

    const changeSortData = (event) => {
        const {
            target: { id, value }
        } = event;

        dispatch(
            applicationsActions.sortItemList({
                by: id === "sortBy" ? value : applicationItems.sort.by,
                dir: id === "sortDir" ? value : applicationItems.sort.dir
            })
        );
    };

    return (
        <>
            <header className="flex gap-3 px-4 py-2 justify-between">
                <div className="flex">
                    <button onClick={() => setIsOpened(true)}>Add Job</button>
                    <div className="ml-2 border-l-2 pl-2">
                        <form>
                            <label>
                                <span>Sort By: </span>
                                <select
                                    name="sortBy"
                                    id="sortBy"
                                    onChange={changeSortData}
                                    value={applicationItems.sort.by}
                                >
                                    <option value="jobTitle">Title</option>
                                    <option value="jobApplyDate">Date</option>
                                </select>
                                <select
                                    name="sortDir"
                                    id="sortDir"
                                    onChange={changeSortData}
                                    value={applicationItems.sort.dir}
                                >
                                    <option value="asc">Ascending</option>
                                    <option value="desc">Descending</option>
                                </select>
                            </label>
                        </form>
                    </div>
                    <div className="ml-2 border-l-2 pl-2">
                        View As:
                        <select
                            value={viewAs}
                            onChange={(event) => setViewAs(event.target.value)}
                        >
                            <option value="tiles">Tiles</option>
                            <option value="table">Table</option>
                        </select>
                    </div>
                </div>

                <button onClick={clearAllJobs}>Clear All Jobs</button>
            </header>
            <main>
                {Object.values(applicationItems.items).length && (
                    <>
                        {viewAs === "table" ? (
                            <div>
                                <JobsTable
                                    jobs={sortItems(applicationItems.items)}
                                    removeJob={removeJob}
                                    editJob={editJob}
                                    updateJobStatus={updateJobStatus}
                                />
                            </div>
                        ) : (
                            <ResponsiveMasonry
                                columnsCountBreakPoints={{
                                    350: 1,
                                    750: 2,
                                    1150: 3,
                                    1640: 4
                                }}
                            >
                                <Masonry>
                                    {sortItems(applicationItems.items).map(
                                        (job) => (
                                            <div
                                                className="p-3"
                                                key={job.jobId}
                                            >
                                                <Job
                                                    job={job}
                                                    removeJob={removeJob}
                                                    editJob={editJob}
                                                    updateJobStatus={
                                                        updateJobStatus
                                                    }
                                                />
                                            </div>
                                        )
                                    )}
                                </Masonry>
                            </ResponsiveMasonry>
                        )}
                    </>
                )}
            </main>
            <footer className="h-6 px-4">
                <p className="text-xs">Version: {Version.version}</p>
            </footer>
            <DialogModal
                isOpened={isOpened}
                closeModal={closeModal}
                title={currentJob ? "Edit Job" : "Add Job"}
            >
                <AddJob
                    currentJob={currentJob}
                    clearCurrentJob={clearCurrentJob}
                />
            </DialogModal>
        </>
    );
};

export default App;
