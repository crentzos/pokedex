import { User } from "../user";

describe("User Data", () => {
    test("User should initialize with the correct profile data", () => {
        const profile = { passId: "123", name: "Ash", dob: "1997-05-22", gender: "male" };
        const user = new User(profile);

        expect(user.data.profile.name).toBe("Ash");
        expect(user.data.profile.passId).toBe("123");
        expect(user.data.pokedex).toEqual({});
        expect(user.data.lastLocationURL).toBeNull();
    });

    test("User should accept inital pokedex and location data", () => {
        const profile = { passId: "123", name: "Ash", dob: "1997-05-22", gender: "male" };
        const initialPokedex = { "pikachu": { name: "pikachu" } as any };
        const initialLocation = "https://pokeapi.co/api/v2/location-area/1";

        const user = new User(profile, initialPokedex, initialLocation)

        expect(user.data.pokedex).toHaveProperty("pikachu");
        expect(user.data.lastLocationURL).toBe(initialLocation);
    });

    test("toJSON should produce a valid, readable JSON string", () => {
        const profile = { passId: "123", name: "Ash", dob: "1997-05-22", gender: "male" };
        const user = new User(profile);

        const jsonString = user.toJSON();

        expect(typeof jsonString).toBe("string");

        const parsedData = JSON.parse(jsonString);
        expect(parsedData.profile.name).toBe("Ash");
    });
});