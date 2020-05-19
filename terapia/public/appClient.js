class AppClient{

    constructor(){
    
        this._appEl = document.querySelector('#app');

        this._appEl.innerHTML = `
        <h1>Terapia</h1>
        <br>
        <form id="form-client">
            <table>
            <td>
                <tr>Nome: </tr><tr><input type="text" id="input-name" required></input></tr><br>
            </td><td id="td-birth">
                <tr>Data de Nascimento: </tr><tr><input <input type="date" id="input-birth" required></input></tr>
            </td><td>
                <tr>Profissão: </tr><tr><input type="text" id="input-profession" ></input></tr><br>
            </td><td>
                <tr>Endereço: </tr><tr><input type="text" id="input-address" ></input></tr><br>
            </td><td>
                <tr>Telefone: </tr><tr><input type="tel" id="input-telephone" ></input></tr><br>
            </td><td>
                <tr>Informações mais detalhadas: </tr><br><tr><textarea id="input-obs"></textarea></tr><br>
            </td><td>
                <tr><button id="btn-archive"> Arquivar </button> </tr>&nbsp&nbsp&nbsp&nbsp<tr> <button id="btn-save" type="submit"> Salvar </button></tr>
            </td>
            </table>
        </form>
        `;

        this._id = -1;
        this._nome;
        this._birth;
        this._profession;
        this._address;
        this._telephone;
        this._obs;

    }

}