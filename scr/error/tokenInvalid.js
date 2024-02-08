export default class TokenInvalid extends Error {
    constructor() {
        super("Token invalido!");
        this.name = "TokenInvalid";
    }
}