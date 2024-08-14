import { JobSalaryType, JobStatusType, JobType } from "../lib/types";
import { appListInitialState, applicationsActions } from "../store/applications-slice";

import AddJob from "./AddJob";
import { fireEvent } from "@testing-library/react";
import { renderWithProviders } from "../utils/test-utils";
import { uiActions } from "../store/ui-slice";
import uuid from "react-uuid";

vi.mock("react-uuid");
const mockedUuid = uuid as jest.Mock;

describe("AddJob Component", () => {
    let mockAddItem: any;
    let mockClearEditingJob: any;
    let mockToggleModal: any;
    beforeEach(() => {
        vi.useFakeTimers();
        mockAddItem = vi.spyOn(applicationsActions, 'addItem');
        mockClearEditingJob = vi.spyOn(applicationsActions, 'clearEditingJob');
        mockToggleModal = vi.spyOn(uiActions, 'toggleModal');

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
            const { getByTestId } = renderWithProviders(<AddJob />);

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
            fireEvent.click(getByTestId("buttonSubmit"));
            expect(mockAddItem).toHaveBeenCalledWith({
                jobTitle: "new job",
                jobCompany: "company",
                jobApplyDate: "2024-08-09",
                jobCompanyLink: "",
                jobLink: "",
                jobSalary: "",
                jobSalaryType: JobSalaryType.HR,
                jobStatus: JobStatusType.APPLIED,
                jobId: "testid"
            });
            expect(mockClearEditingJob).toHaveBeenCalled();
            expect(mockToggleModal).toHaveBeenCalledWith(false);
        });
    });
    describe("with job to edit", () => {
        const originalJob: JobType = {
            jobTitle: "first job",
            jobCompany: "company",
            jobApplyDate: "2024-07-17",
            jobCompanyLink: "https://company.com",
            jobLink: "https://company.com/jobs/123",
            jobSalary: "123,000",
            jobSalaryType: JobSalaryType.YR,
            jobStatus: JobStatusType.APPLIED,
            jobId: "123"
        };
        const originalState = {
            preloadedState: {
                ui: {
                    modalIsVisible: true
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
            const { getByTestId } = renderWithProviders(<AddJob />, originalState);

            expect(getByTestId("jobTitle")).toHaveValue("first job");
            expect(getByTestId("jobCompany")).toHaveValue("company");
            expect(getByTestId("jobApplyDate")).toHaveValue("2024-07-17");
        });
        describe("changes values", () => {
            it('does something', () => {
                const newJob: JobType = {
                    ...originalJob,
                    jobTitle: "second job",
                    jobSalaryType: JobSalaryType.HR
                };
                const { getByTestId } = renderWithProviders(<AddJob />, originalState);
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
                expect(mockClearEditingJob).toHaveBeenCalled();
                expect(mockToggleModal).toHaveBeenCalledWith(false);
            });
        });
        describe("pressing clear", () => {
            it("clears the form", () => {
                const { getByTestId } = renderWithProviders(<AddJob />, originalState);

                fireEvent.click(getByTestId("buttonClear"));
                expect(getByTestId("jobTitle")).not.toHaveValue();
            });
        });
    });
});