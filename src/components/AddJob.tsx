import { FormEvent, useEffect, useState } from "react";
import { JobAppliedFrom, JobSalaryType, JobStatusType, JobType } from "../lib/types";

import { applicationsActions } from "../store/applications-slice";
import { useAppDispatch } from "../hooks/hooks";
import { useTranslation } from "react-i18next";
import uuid from "react-uuid";

const defaultJob = {
    jobTitle: "",
    jobCompany: "",
    jobApplyDate: "",
    jobCompanyLink: "",
    jobLink: "",
    jobSalaryMin: 0,
    jobSalaryMax: 0,
    jobSalaryType: "",
    jobStatus: "",
    jobId: "",
    jobAppliedFrom: "",
    interviewList: []
};

const AddJob = ({ currentJob, afterSave }: { currentJob?: JobType; afterSave: () => void }) => {
    const { t } = useTranslation();
    const dispatch = useAppDispatch();
    const [formData, setFormData] = useState(defaultJob);
    const currentDate: Date = new Date();
    const currentDateParsed: string = currentDate.toISOString().split("T")[0];

    useEffect(() => {
        if (currentJob) {
            setFormData({
                jobTitle: currentJob.jobTitle,
                jobCompany: currentJob.jobCompany,
                jobApplyDate: currentJob.jobApplyDate,
                jobCompanyLink: currentJob.jobCompanyLink,
                jobLink: currentJob.jobLink,
                jobSalaryMin: currentJob.jobSalaryMin,
                jobSalaryMax: currentJob.jobSalaryMax,
                jobSalaryType: currentJob.jobSalaryType,
                jobId: currentJob.jobId,
                jobStatus: currentJob.jobStatus,
                jobAppliedFrom: currentJob.jobAppliedFrom,
                interviewList: currentJob.interviewList
            });
        } else {
            const newDefaultJob = {
                ...defaultJob,
                jobApplyDate: currentDateParsed,
                jobSalaryType: "yr"
            };
            setFormData(newDefaultJob);
        }
    }, [currentJob, currentDateParsed]);

    const submitJob = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const newJob = Object.fromEntries(new FormData(event.currentTarget)) as object;

        // Recasting the object to the proper type.
        const newJob2 = { ...newJob } as JobType;

        if (!currentJob?.jobId) {
            newJob2.jobStatus = JobStatusType.APPLIED;
            newJob2.jobId = uuid();
        } else {
            newJob2.jobStatus = currentJob.jobStatus;
            newJob2.jobId = currentJob.jobId;
        }

        dispatch(applicationsActions.addItem(newJob2));
        afterSave();
    };

    const handleClear = () => {
        setFormData({
            ...defaultJob,
            jobApplyDate: currentDateParsed
        });
    };

    return (
        <form onSubmit={submitJob} id="jobForm" className="w-96">
            <label htmlFor="jobTitle" className="mb-2 block">
                <p>{t("jobTitle")}*</p>
                <input
                    className="w-full border-2 px-2"
                    type="text"
                    name="jobTitle"
                    id="jobTitle"
                    defaultValue={formData.jobTitle}
                    data-testid="jobTitle"
                    required
                />
            </label>
            <label htmlFor="jobLink" className="mb-2 block">
                <p>{t("jobLink")}</p>
                <input
                    className="w-full border-2 px-2"
                    type="text"
                    name="jobLink"
                    id="jobLink"
                    defaultValue={formData.jobLink}
                />
            </label>
            <label htmlFor="jobCompany" className="mb-2 block">
                <p>{t("jobCompany")}*</p>
                <input
                    className="w-full border-2 px-2"
                    type="text"
                    name="jobCompany"
                    id="jobCompany"
                    defaultValue={formData.jobCompany}
                    data-testid="jobCompany"
                    required
                />
            </label>
            <label htmlFor="jobCompanyLink" className="mb-2 block">
                <p>{t("jobCompanyLink")}</p>
                <input
                    className="w-full border-2 px-2"
                    type="text"
                    name="jobCompanyLink"
                    id="jobCompanyLink"
                    defaultValue={formData.jobCompanyLink}
                />
            </label>
            <label htmlFor="jobApplyDate" className="mb-2 block">
                <p>{t("jobApplyDate")}*</p>
                <input
                    className="w-full border-2 px-2"
                    type="date"
                    name="jobApplyDate"
                    id="jobApplyDate"
                    defaultValue={formData.jobApplyDate}
                    max={currentDateParsed}
                    data-testid="jobApplyDate"
                    required
                />
            </label>
            <label htmlFor="jobAppliedFrom" className="w-24 flex-shrink-0">
                <p>{t("jobAppliedFromTitle")}</p>
                <select
                    className="w-full border-2 px-2"
                    name="jobAppliedFrom"
                    id="jobAppliedFrom"
                    onChange={(e) => setFormData({ ...formData, jobAppliedFrom: e.target.value })}
                    value={formData.jobAppliedFrom}
                    data-testid="jobAppliedFrom"
                >
                    <option value="" disabled>
                        Select one
                    </option>
                    <option value={JobAppliedFrom.COMPANY}>Company</option>
                    <option value={JobAppliedFrom.DICE}>Dice</option>
                    <option value={JobAppliedFrom.GITHUB}>Github</option>
                    <option value={JobAppliedFrom.INDEED}>Indeed</option>
                    <option value={JobAppliedFrom.LINKEDIN}>LinkedIn (Easy Apply)</option>
                    <option value={JobAppliedFrom.MONSTER}>Monster</option>
                    <option value={JobAppliedFrom.RECRUITER}>Recruiter</option>
                    <option value={JobAppliedFrom.ZIPRECUITER}>ZipRecruiter</option>
                    <option disabled>──────────</option>
                    <option value={JobAppliedFrom.OTHER}>Other</option>
                </select>
            </label>
            <div className="flex w-full justify-between gap-4">
                <label htmlFor="jobSalaryMin" className="w-full">
                    <p>{t("jobSalaryMin")}</p>
                    <input
                        className="w-full border-2 px-2"
                        type="number"
                        name="jobSalaryMin"
                        id="jobSalaryMin"
                        key={formData.jobSalaryMin}
                        defaultValue={formData.jobSalaryMin}
                        data-testid="jobSalaryMin"
                    />
                </label>
                <label htmlFor="jobSalaryMax" className="w-full">
                    <p>{t("jobSalaryMax")}</p>
                    <input
                        className="w-full border-2 px-2"
                        type="number"
                        name="jobSalaryMax"
                        id="jobSalaryMax"
                        key={formData.jobSalaryMax}
                        defaultValue={formData.jobSalaryMax}
                        data-testid="jobSalaryMax"
                    />
                </label>
                <label htmlFor="jobSalaryType" className="w-24 flex-shrink-0">
                    <p>{t("jobSalaryType")}</p>
                    <select
                        className="w-full border-2 px-2"
                        name="jobSalaryType"
                        id="jobSalaryType"
                        onChange={(e) => setFormData({ ...formData, jobSalaryType: e.target.value })}
                        value={formData.jobSalaryType}
                        data-testid="jobSalaryType"
                    >
                        <option value={JobSalaryType.YR}>Yearly</option>
                        <option value={JobSalaryType.HR}>Hourly</option>
                    </select>
                </label>
            </div>
            <div className="mt-4 flex justify-around border-t-2 py-2">
                <button
                    data-testid="buttonClear"
                    type="reset"
                    className="w-32 bg-blue-300 py-2 font-bold text-white"
                    onClick={handleClear}
                >
                    Clear
                </button>
                <button data-testid="buttonSubmit" type="submit" className="w-32 bg-blue-300 py-2 font-bold text-white">
                    Save
                </button>
            </div>
        </form>
    );
};

export default AddJob;
