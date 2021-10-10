import { format } from 'date-fns';

class DateTime{
    Now(){
       return format(new Date(), "yyyy-MM-dd HH:mm:ss");
    }
}

export default new DateTime();