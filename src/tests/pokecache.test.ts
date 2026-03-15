import { Cache } from "../pokecache.js";
import { test, expect, vi } from "vitest";

describe("Cache", () => {
    let cache: Cache;
    const interval = 1000;

    beforeEach(() => {
        vi.useFakeTimers();
        cache = new Cache(interval);
    });

    afterEach(() => {
        cache.stopReapLoop();
        vi.useRealTimers();
    });

    describe("core CRUD operations", () => {
        test("Test handles multiple items simultaneously", async () => {
            cache.add("key1", "val1");
            cache.add("key2", "val2");

            expect(cache.get("key1")).toBe("val1");
            expect(cache.get("key2")).toBe("val2");

            vi.advanceTimersByTime(interval + 100);

            expect(cache.get("key1")).toBeUndefined();
            expect(cache.get("key2")).toBeUndefined();
        });

        test("Test handles multiple items simultaneously", async () => {
            cache.add("key1", "val1");
            cache.add("key2", "val2");

            expect(cache.get("key1")).toBe("val1");
            expect(cache.get("key2")).toBe("val2");

            vi.advanceTimersByTime(interval + 100);

            expect(cache.get("key1")).toBeUndefined();
            expect(cache.get("key2")).toBeUndefined();
        });

        test("get method returns undefined for keys that don't exist", async () => {
            const result = cache.get("non-existent-key");

            expect(result).toBeUndefined();
        });

        test("Adding the same key updates the value", async () => {
            cache.add("key1", "first-value");
            cache.add("key1", "second-value");

            const result = cache.get("key1");
            expect(result).toBe("second-value");
        });
    });

    describe("Expiration & Reaper logic", () => {
        test.each([
            {
                key: "a",
                val: "1",
                time: 500,
            },
            {
                key: "b",
                val: "2",
                time: 1000,
            },
        ])("Test Caching $time ms", async ({ key, val, time }) => {
            const localCache = new Cache(time);
            localCache.add(key, val);
            const cached = localCache.get(key);
            expect(cached).toBe(val);

            vi.advanceTimersByTime(time + 100);
            const reaped = localCache.get(key);
            expect(reaped).toBe(undefined);

            localCache.stopReapLoop();
        });

        test("Reaper only deletes expired values, leaving fresh ones alone", async () => {

            cache.add("stale-key", "gone");
            vi.advanceTimersByTime(600);
            cache.add("fresh-key", "survivor");
            vi.advanceTimersByTime(600);

            expect(cache.get("stale-key")).toBeUndefined();
            expect(cache.get("fresh-key")).toBe("survivor");

        });

        test("adding an existing key refreshes its expiration timer", () => {
            cache.add("refresh-key", "original");

            vi.advanceTimersByTime(800);

            cache.add("refresh-key", "updated");

            vi.advanceTimersByTime(400);

            expect(cache.get("refresh-key")).toBe("updated");
        });
    });
});
