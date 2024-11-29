import { JobAppliedFrom, JobSalaryType, JobStatusType, JobType } from "../lib/types";
import { appListInitialState, applicationsActions } from "../store/applications-slice";

import { ActionCreatorWithPayload } from "@reduxjs/toolkit";
import AddJob from "./AddJob";
import { MockInstance } from "vitest";
import { fireEvent } from "@testing-library/react";
import { renderWithProviders } from "../utils/test-utils";
import uuid from "react-uuid";

vi.mock("react-uuid");
const mockedUuid = uuid as jest.Mock;

describe("AddJob Component", () => {
    let mockAddItem: MockInstance<ActionCreatorWithPayload<JobType, "applications/addItem">>;
    beforeEach(() => {
        vi.useFakeTimers();
        mockAddItem = vi.spyOn(applicationsActions, "addItem");

        // Set system date to 09Aug2024, time does not matter
        // as it's stripped off.
        const date = new Date(2024, 7, 9);
        vi.setSystemTime(date);
    });
    afterEach(() => {
        vi.useRealTimers();
    });
    describe("with a new job", () => {
        beforeEach(() => {
            mockedUuid.mockImplementation(() => "testid");
        });
        it("renders component", () => {
            const { getByTestId } = renderWithProviders(<AddJob afterSave={() => {}} />);

            // Check the defaults are working properly
            expect(getByTestId("jobSalaryType")).toHaveValue(JobSalaryType.YR);
            expect(getByTestId("jobApplyDate")).toHaveValue("2024-08-09");
            fireEvent.change(getByTestId("jobTitle"), {
                target: {
                    value: "new job"
                }
            });
            fireEvent.change(getByTestId("jobCompany"), {
                target: {
                    value: "company"
                }
            });
            fireEvent.change(getByTestId("jobSalaryType"), {
                target: {
                    value: JobSalaryType.HR
                }
            });
            fireEvent.change(getByTestId("jobAppliedFrom"), {
                target: {
                    value: JobAppliedFrom.LINKEDIN
                }
            });
            fireEvent.click(getByTestId("buttonSubmit"));
            expect(mockAddItem).toHaveBeenCalledWith({
                jobTitle: "new job",
                jobCompany: "company",
                jobApplyDate: "2024-08-09",
                jobCompanyLink: "",
                jobLink: "",
                jobSalaryMax: "0",
                jobSalaryMin: "0",
                jobSalaryType: JobSalaryType.HR,
                jobStatus: JobStatusType.APPLIED,
                jobId: "testid",
                jobAppliedFrom: JobAppliedFrom.LINKEDIN
            });
        });
    });
    describe("with job to edit", () => {
        const originalJob: JobType = {
            jobTitle: "first job",
            jobCompany: "company",
            jobApplyDate: "2024-07-17",
            jobCompanyLink: "https://company.com",
            jobLink: "https://company.com/jobs/123",
            jobSalaryMax: "0",
            jobSalaryMin: "0",
            jobSalaryType: JobSalaryType.YR,
            jobStatus: JobStatusType.APPLIED,
            jobId: "123",
            jobAppliedFrom: JobAppliedFrom.LINKEDIN
        };
        const originalState = {
            preloadedState: {
                ui: {
                    modalIsVisible: true,
                    chartsModalIsVisible: false,
                    showMenu: false
                },
                appList: {
                    ...appListInitialState,
                    editingJob: "123",
                    items: {
                        "123": originalJob
                    }
                }
            }
        };
        it("renders component", () => {
            const { getByTestId } = renderWithProviders(
                <AddJob currentJob={originalJob} afterSave={() => {}} />,
                originalState
            );

            expect(getByTestId("jobTitle")).toHaveValue("first job");
            expect(getByTestId("jobCompany")).toHaveValue("company");
            expect(getByTestId("jobApplyDate")).toHaveValue("2024-07-17");
        });
        describe("changes values", () => {
            it("does something", () => {
                const newJob: JobType = {
                    ...originalJob,
                    jobTitle: "second job",
                    jobSalaryType: JobSalaryType.HR
                };

                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                const { getByTestId } = renderWithProviders(
                    <AddJob currentJob={newJob} afterSave={() => {}} />,
                    originalState
                );
                fireEvent.change(getByTestId("jobTitle"), {
                    target: {
                        value: "second job"
                    }
                });
                fireEvent.change(getByTestId("jobSalaryType"), {
                    target: {
                        value: JobSalaryType.HR
                    }
                });
                fireEvent.click(getByTestId("buttonSubmit"));
                expect(mockAddItem).toHaveBeenCalledWith(newJob);
            });
        });
        describe("pressing clear", () => {
            it("clears the form", () => {
                const { getByTestId } = renderWithProviders(<AddJob afterSave={() => {}} />, originalState);

                fireEvent.click(getByTestId("buttonClear"));
                expect(getByTestId("jobTitle")).not.toHaveValue();
            });
        });
    });
});
