import { email, ValidationRule } from 'vuelidate/lib/validators'


let multiemail = (testemail: string) => {
    let emails = testemail.split(/[;,]+/); // split element by , and ;
    let emailrule = email as unknown as ValidationRule; // The typings in vuelidate are wrong (rolleyes emoji)
    return emails.reduce((accum, currentval) => accum && emailrule(currentval) , true);
}

export { multiemail };

