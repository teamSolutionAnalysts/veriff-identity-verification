// import * as moment from 'moment';
import * as moment from "moment-timezone";

export class Dates {
    public getTodayDate(timezone) {
        const newdate = moment().tz(timezone);
        newdate.set({second: 0, millisecond: 0});
        return newdate.format();
    }
    public addDays(date: Date, days: number) {
        const newdate = moment(date).add(days, "days");
        newdate.set({second: 0, millisecond: 0});

        return newdate.format();
    }
}
