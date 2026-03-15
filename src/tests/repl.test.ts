import { cleanInput, handleCommand } from "../repl";
import { describe, expect, test, vi } from "vitest";

describe("Repl input utilities", () => {
  describe("Clean Input", () => {
    test.each([
      {
        input: "  hello  world  ",
        expected: ["hello", "world"],
      },
      {
        input: "  Good    morning, Jenny!  ",
        expected: ["good", "morning,", "jenny!"],
      },
      {
        input: "PIKACHU",
        expected: ["pikachu"],
      },
      {
        input: "   ",
        expected: [],
      },
      {
        input: "",
        expected: [],
      },
      {
        input: " explore pastoria-city ",
        expected: ["explore", "pastoria-city"],
      },
      {
        input: "catch\tpikachu\n",
        expected: ["catch", "pikachu"],
      },
    ])("should correctly process: '$input'", ({ input, expected }) => {
      const actual = cleanInput(input);
      expect(actual).toEqual(expected);
    });
  });

  describe("Repl command dispatch", () => {
    describe("handleCommand", () => {
      test("handleCommand calls the correct callback with arguments", async () => {
        const mockCallback = vi.fn();
        const state = {
          commands: {
            inspect: { callback: mockCallback },
          },
        } as any;
        const mockReprompt = vi.fn();
        await handleCommand("inspect pikachu", state, mockReprompt);

        expect(mockCallback).toHaveBeenCalled();
        expect(mockCallback).toHaveBeenCalledWith(state, "pikachu");
        expect(mockReprompt).toHaveBeenCalledWith(null);
      });
    });
  });
});
