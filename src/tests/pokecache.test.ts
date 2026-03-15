import { Cache } from "../pokecache.js";
import { test, expect, vi } from "vitest";

test.concurrent.each([
    {
        key: "https://pokeapi.co/api/v2",
        val: "testdata",
        interval: 500,
    },
    {
        key: "https://pokeapi.co/api/v2/location-area",
        val: "moretestdata",
        interval: 1000,
    },
])("Test Caching $interval ms", async ({ key, val, interval }) => {
    const cache = new Cache(interval);

    cache.add(key, val);
    const cached = cache.get(key);
    expect(cached).toBe(val);

    await new Promise((resolve) => setTimeout(resolve, (interval * 2) + 100));
    const reaped = cache.get(key);
    expect(reaped).toBe(undefined);

    cache.stopReapLoop();
});

test("Test handles multiple items simultaneously", async () => {
    const interval = 500;
    const cache = new Cache(interval);

    cache.add("key1", "val1");
    cache.add("key2", "val2");

    expect(cache.get("key1")).toBe("val1");
    expect(cache.get("key2")).toBe("val2");

    await new Promise((resolve) => setTimeout(resolve, (interval * 2) + 100));

    expect(cache.get("key1")).toBeUndefined();
    expect(cache.get("key2")).toBeUndefined();

    cache.stopReapLoop();
})

test("get() returns undefined for keys that don't exist", async () => {
    const cache = new Cache(500);
    const result = cache.get("non-existent-key");

    expect(result).toBeUndefined();

    cache.stopReapLoop();
})

test("Adding the same key updates the value", async () => {
    const cache = new Cache(500);

    cache.add("key1", "first-value");
    cache.add("key1", "second-value");

    const result = cache.get("key1");
    expect(result).toBe("second-value");

    cache.stopReapLoop();

})

test("Reaper only deletes expired values, leaving fresh ones alone", async () => {

    vi.useFakeTimers();

    const interval = 1000;
    const cache = new Cache(interval);

    cache.add("stale-key", "gone");

    vi.advanceTimersByTime(600);

    cache.add("fresh-key", "survivor");

    vi.advanceTimersByTime(600);

    expect(cache.get("stale-key")).toBeUndefined();
    expect(cache.get("fresh-key")).toBe("survivor");

    cache.stopReapLoop();

    vi.useRealTimers();
});