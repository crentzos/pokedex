export type CacheEntry<T> = {
    createdAt: number,
    val: T,
}

export class Cache {
    #cache: Map<string, CacheEntry<any>> = new Map();
    #reapIntervalId: NodeJS.Timeout | undefined = undefined;
    #interval: number;

    constructor(interval: number) {
        this.#interval = interval;
        this.#startReapLoop();
    }

    add<T>(key: string, val: T) {
        const entry = {
            createdAt: Date.now(),
            val: val,
        }
        this.#cache.set(key, entry);
    }

    get<T>(key: string): T | undefined {
        const entry = this.#cache.get(key);

        if (entry === undefined) {
            return undefined;
        }
        return entry.val;
    }

    #reap() {
        this.#cache.forEach((value, key) => {
            if (value.createdAt <= (Date.now() - this.#interval)) {
                this.#cache.delete(key);
            }
        })
    }

    #startReapLoop() {
        this.#reapIntervalId = setInterval(() => {
            this.#reap();
        },
            this.#interval);
    }

    stopReapLoop() {
        clearInterval(this.#reapIntervalId);
        this.#reapIntervalId = undefined;
    }
}