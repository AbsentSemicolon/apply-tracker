import { JobStatusType, JobType } from "../lib/types";

import { ChangeEvent } from "react";
import { a } from "vitest/dist/chunks/suite.BMWOKiTe.js";
import { applicationsActions } from "../store/applications-slice";
import { useAppDispatch } from "../hooks/hooks";

interface JobStatusInput {
    job: JobType;
}

interface JobStatusList {
    [key: string]: {
        title: string;
        status: JobStatusType | null;
        color?: string;
    };
}

const JobStatus = ({ job }: JobStatusInput) => {
    const dispatch = useAppDispatch();
    const jobStatusList: JobStatusList = {
        recruiterContacted: {
            title: "Recruiter Contacted",
            status: JobStatusType.RECRUITER_CONTACTED
        },
        applied: {
            title: "Applied",
            status: JobStatusType.APPLIED
        },
        interviewScheduled: {
            title: "Interviewed Scheduled",
            status: JobStatusType.INTERVIEWED_SCHEDULED
        },
        interviewing: {
            title: "Interviewing",
            status: JobStatusType.INTERVIEWING,
            color: "text-blue-400"
        },
        interviewed: {
            title: "Interviewed",
            status: JobStatusType.INTERVIEWED
        },
        offered: {
            title: "Offered",
            status: JobStatusType.OFFERED
        },
        accepted: {
            title: "Accepted",
            status: JobStatusType.ACCEPTED
        },
        break: {
            title: "break",
            status: null
        },
        onHold: {
            title: "On Hold",
            status: JobStatusType.ON_HOLD
        },
        denied: {
            title: "Rejected",
            status: JobStatusType.DENIED
        }
    };

    const updateJobStatus = (event: ChangeEvent<HTMLSelectElement>) => {
        dispatch(
            applicationsActions.updateItemStatus({
                jobId: job.jobId,
                status: event.target.value
            })
        );
    };

    return (
        <>
            <select
                id="jobStatus"
                name="jobStatus"
                value={job.jobStatus}
                onChange={updateJobStatus}
                className="rounded-md border-2 border-gray-500 p-1"
            >
                {Object.values(jobStatusList).map((status) => {
                    return status.status !== null ? (
                        <option className="text-black" key={status.status} value={status.status}>
                            {status.title}
                        </option>
                    ) : (
                        <option disabled key={status.status} className="text-center">
                            &#9473;&#9473;&#9473;&#9473;&#9473;&#9473;&#9473;&#9473;
                        </option>
                    );
                })}
            </select>
        </>
    );
};

export default JobStatus;
