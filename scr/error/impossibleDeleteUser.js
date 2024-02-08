export default class ImpossibleDeleteUser extends Error {
    constructor() {
        super("Erro ao deletar usuário!");
        this.name = "ImpossibleDeleteUser";
    }
}