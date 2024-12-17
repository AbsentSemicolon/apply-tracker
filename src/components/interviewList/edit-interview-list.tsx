import * as Checkbox from "@radix-ui/react-checkbox";

import { FormEvent, useRef, useState } from "react";
import { Interview, JobType } from "../../lib/types";
import TagInput, { TagInputComponent } from "../ui/TagInput";

import { CheckIcon } from "@radix-ui/react-icons";
import InterviewListDisplay from "./interview-list";
import { applicationsActions } from "../../store/applications-slice";
import { useAppDispatch } from "../../hooks/hooks";
import uuid from "react-uuid";

interface FormData {
    isFinal: boolean;
    date: string;
    isRecruiter: boolean;
}

const defaultFormdata: FormData = {
    isFinal: false,
    date: new Date().toISOString().split("T")[0],
    isRecruiter: false
};

const InterviewList = ({ job, afterSave }: { job: JobType; afterSave: (arg0: boolean) => void }) => {
    // use form status hook to get status (pending, success, error)
    const currentDateParsed: string = new Date().toISOString().split("T")[0];
    const [formData, setFormData] = useState<FormData>(defaultFormdata);
    const dispatch = useAppDispatch();
    const interviewListRef = useRef<TagInputComponent>(null);
    const typeListRef = useRef<TagInputComponent>(null);
    const [saving, setIsSaving] = useState(false);
    const [selectedInterview, setSelectedInterview] = useState<Interview | null>(null);
    const [interviewDate, setInterviewDate] = useState(currentDateParsed);
    const saveInterview = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setIsSaving(true);
        const formEntries = Object.fromEntries(new FormData(event.currentTarget));
        const interviewerList = interviewListRef && interviewListRef.current ? interviewListRef.current.getTags() : [];
        const typeList = typeListRef && typeListRef.current ? typeListRef.current.getTags() : [];
        const interview: Interview = {
            final: formEntries.final ? true : false,
            date: formEntries.date as string,
            recruiter: formEntries.recruiter ? true : false,
            interviewerList,
            typeList,
            interviewId: selectedInterview?.interviewId || uuid()
        };
        const newJob = { ...job } as JobType;

        if (selectedInterview) {
            const index = newJob.interviewList?.findIndex(
                (interview) => interview.interviewId === selectedInterview.interviewId
            );

            if (index !== undefined && index !== null && index !== -1) {
                const newInterviewList = [...newJob.interviewList];
                newInterviewList[index] = interview;

                newJob.interviewList = newInterviewList;
            }
        } else {
            newJob.interviewList = [...(newJob.interviewList || []), interview] as Interview[];
        }
        dispatch(applicationsActions.updateInterviewList(newJob));
        event.currentTarget.reset();
        afterSave(false);
        clear();
        setIsSaving(false);
    };
    const editInterview = (interview: Interview) => () => {
        setFormData({
            isRecruiter: interview.recruiter,
            isFinal: interview.final,
            date: interview.date
        });
        setInterviewDate(interview.date);
        setSelectedInterview(interview);
    };
    const deleteInterview = (interview: Interview) => () => {
        setIsSaving(true);
        const newJob = { ...job } as JobType;
        newJob.interviewList = newJob.interviewList?.filter((i) => i.interviewId !== interview.interviewId);
        dispatch(applicationsActions.updateInterviewList(newJob));
        setIsSaving(false);
    };

    const clear = () => {
        interviewListRef?.current?.resetTags();
        typeListRef?.current?.resetTags();
        setSelectedInterview(null);
        setInterviewDate(currentDateParsed);
        setFormData(defaultFormdata);
    };

    const setCheckbox = (id: string, value: boolean) => {
        setFormData({ ...formData, [id]: value });
    };

    return (
        <div className="flex gap-4">
            <form onSubmit={saveInterview} className="flex w-80 flex-col">
                <fieldset disabled={saving} className="disabled:pointer-events-none disabled:opacity-50">
                    <label htmlFor="interviewDate" className="mb-2 block">
                        <p>Date*</p>
                        <input
                            className="w-full border-2 px-2"
                            type="date"
                            name="date"
                            id="date"
                            data-testid="date"
                            value={interviewDate}
                            onChange={(e) => setInterviewDate(e.target.value)}
                            required
                        />
                    </label>
                    <label htmlFor="isRecruiter" className="block cursor-pointer">
                        <>Is Recruiter</>
                        <Checkbox.Root
                            className="CheckboxRoot"
                            id="isRecruiter"
                            name="recruiter"
                            checked={formData?.isRecruiter}
                            onCheckedChange={(value) => {
                                setCheckbox("isRecruiter", !!value);
                            }}
                        >
                            <Checkbox.Indicator className="CheckboxIndicator">
                                <CheckIcon />
                            </Checkbox.Indicator>
                        </Checkbox.Root>
                    </label>
                    <label htmlFor="isFinal" className="block cursor-pointer">
                        <>Is Final</>
                        <Checkbox.Root
                            className="CheckboxRoot"
                            id="isFinal"
                            name="final"
                            checked={formData?.isFinal}
                            onCheckedChange={(value) => {
                                setCheckbox("isFinal", !!value);
                            }}
                        >
                            <Checkbox.Indicator className="CheckboxIndicator">
                                {!formData && ""}
                                {formData && <CheckIcon />}
                            </Checkbox.Indicator>
                        </Checkbox.Root>
                    </label>
                    <label>
                        <>Interviewer(s)</>
                        <TagInput ref={interviewListRef} defaultList={selectedInterview?.interviewerList || []} />
                    </label>
                    <label>
                        <>Type(s)</>
                        <TagInput
                            ref={typeListRef}
                            defaultList={selectedInterview?.typeList || []}
                            suggestions={[
                                {
                                    id: "phone",
                                    text: "Phone",
                                    className: ""
                                }
                            ]}
                        />
                    </label>
                </fieldset>
                <div className="flex justify-end gap-4">
                    <button className="mt-3" type="reset" onClick={clear}>
                        Clear
                    </button>
                    <button className="mt-3" type="submit">
                        {selectedInterview ? "Save" : "Add"}
                    </button>
                </div>
            </form>
            <InterviewListDisplay
                interviews={job.interviewList}
                editInterview={editInterview}
                deleteInterview={deleteInterview}
            />
        </div>
    );
};

export default InterviewList;
