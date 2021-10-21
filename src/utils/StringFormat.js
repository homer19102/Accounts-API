class StringFormat{

    ReplaceCharacter(startIndex, finalIndex, text, char){

        if(!char || !text)
            return "";

        const characters = text.split("");

        for(var initial = startIndex; initial <= finalIndex;  initial ++)
            characters[initial] = char;
        

       return characters.join(""); 
    }

    FormatCpf(text){

        if(!text)
            return "";

        const cpf = text.replace(/[^\d]/g, "");

        return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
    }

    ValidUser(text){
        const format = /[!@#$%^&*()+\-=\[\]{};':"\\|,<>\/?]+/;

        if(format.test(text))
            return false;
       
        return true;
      
    }
}

export default new StringFormat();