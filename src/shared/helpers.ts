import * as moment from "moment";

// expects duration in seconds
// returns formatted datetime
export function formatDuration(seconds: number): string {
    const ms = seconds * 1000;
    const duration = moment.duration(seconds * 1000);
    const formattedTime = Math.floor(duration.asHours()) + moment.utc(ms).format("[h] mm[m] ss[s]");
    return formattedTime;
}
