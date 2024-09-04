import {
    defaultPreloadedState,
    renderHookWithProviders
} from "../utils/test-utils";

import { act } from "react";
import useCharts from "./chart-hooks";

describe("chart-hook", () => {
    it("something", () => {
        let render;
        act(() => {
            render = renderHookWithProviders(
                () => useCharts(),
                defaultPreloadedState
            );
        });
        expect(render.result.current).toEqual([
            {
                meta: {
                    total: 1,
                    companyList: [
                        {
                            name: "company",
                            link: "https://company.com"
                        }
                    ]
                },
                pie: [
                    ["Phase", "Number"],
                    ["Applied (1)", 1],
                    ["Denied (0)", 0],
                    ["On Hold (0)", 0],
                    ["Interviewed Scheldued (0)", 0],
                    ["Interviewed (0)", 0]
                ],
                calendar: [
                    [
                        {
                            id: "Date",
                            type: "date"
                        },
                        {
                            id: "Applications Sent",
                            type: "number"
                        }
                    ],
                    [new Date("2024-07-17T05:00:00.000Z"), 1]
                ]
            },
            false
        ]);
    });
});