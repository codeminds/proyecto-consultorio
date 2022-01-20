export class BaseService{
    constructor(){}

    static handleError(response){
        let errors = '';

        for(let i = 0; i < response.messages.length; i++){
            errors += response.messages[i] + '\n';
        }

        if(errors){
            alert(errors);
        }
    }
}