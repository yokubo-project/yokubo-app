import * as moment from "moment";

// expects duration in seconds
// returns formatted datetime
export function formatDuration(seconds: number): string {
    const ms = seconds * 1000;
    const duration = moment.duration(seconds * 1000);
    // tslint:disable-next-line:no-unnecessary-local-variable
    const formattedTime = Math.floor(duration.asHours()) + moment.utc(ms).format("[h] mm[m] ss[s]");

    return formattedTime;
}

export function validateEmail(email: string): boolean {
    // tslint:disable-next-line:max-line-length
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    return re.test(String(email).toLowerCase());
}
