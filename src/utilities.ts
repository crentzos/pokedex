export function capitalize(input: string): string {
    const cInput = sanitize(input);
    if (cInput.length === 0) return "";
    const capitalized = cInput.charAt(0).toUpperCase() + cInput.slice(1).toLowerCase();

    return capitalized;
};

export function sanitize(input: string): string {
    return input.trim();
};

export function getTodayDateString(): string {
    return new Intl.DateTimeFormat('en-GB').format(new Date()).replace(/\//g, '-');
}
