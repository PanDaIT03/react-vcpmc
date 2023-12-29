export interface Time {
    hour: string;
    minute: string;
    second: string;
};

export interface ChoosenDay {
    day: string;
    start: Time;
    end: Time;
};

export type TimeActive = {
    id: string;
    time: string;
    index: number;
};