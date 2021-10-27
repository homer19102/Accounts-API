import { addDays, format } from 'date-fns';

class DateTime{
    Now(){
       return format(new Date(), "yyyy-MM-dd HH:mm:ss");
    }

    AddDays(number){
        return addDays(new Date(), number);
    }

    FormatDate(date){

        if(date)
            return format(date, "dd-MM-yyyy");

        return null;
    }
}

export default new DateTime();