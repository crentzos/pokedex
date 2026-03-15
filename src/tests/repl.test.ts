import { cleanInput } from "../repl";
import { describe, expect, test } from "vitest";

describe.each([
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
        expected: ["explore", "pastoria-city"]
    },
    {
        input: "catch\tpikachu\n",
        expected: ["catch", "pikachu"]
    },
])("cleanInput($input)", ({ input, expected }) => {
    test(`Expected: ${expected}`, () => {

        const actual = cleanInput(input);

        expect(actual).toEqual(expected);
    });
});