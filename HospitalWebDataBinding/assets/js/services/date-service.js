export class DateService{
    static pad(num, size) {
        var s = num+"";
        while (s.length < size) s = "0" + s;
        return s;
    }

    static toInputDateString(date){
        if(date == null){
            return '';
        }

        return `${date.getFullYear()}-${DateService.pad((date.getMonth() + 1), 2)}-${DateService.pad(date.getDate(), 2)}T${DateService.pad(date.getHours(), 2)}:${DateService.pad(date.getMinutes(), 2)}:${DateService.pad(date.getSeconds(), 2)}.${date.getMilliseconds()}`;
    }
}