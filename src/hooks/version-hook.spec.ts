import { Mock } from "vitest";
import { act } from "react";
import { renderHook } from "@testing-library/react";
import useVersion from "./version-hook";

// Need to define as mock so we don't need to define all the
// response properties.
const fetchSpy = vi.spyOn(global, "fetch") as Mock;

describe("useVersion", () => {
    beforeEach(() => {
        vi.useFakeTimers();
    });
    describe("calls", () => {
        describe("with valid data", () => {
            beforeEach(() => {
                fetchSpy.mockImplementationOnce(() =>
                    Promise.resolve({
                        json: vi
                            .fn()
                            .mockResolvedValue(
                                Promise.resolve({ version: "1234" })
                            )
                    })
                );
            });
            it("does things", async () => {
                const render = await act(() => {
                    return renderHook(() => useVersion());
                });
                expect(render.result.current).toEqual(["1234", false]);
            });
        });
        describe("with invalid data", () => {
            beforeEach(() => {
                fetchSpy.mockImplementationOnce(() =>
                    Promise.resolve({
                        json: vi.fn().mockResolvedValue(Promise.reject())
                    })
                );
            });
            it("renders the page", async () => {
                const render = await act(() => {
                    return renderHook(() => useVersion());
                });
                expect(render.result.current).toEqual(["Error", false]);
            });
        });
    });
});
