class AppAttendance{
    constructor(id){

        this._appEl = document.querySelector('#app');
        this._appClient = new AppClient(false, id);

        this._appEl.innerHTML = `
            <h1>Atendimento</h1>
            <div>
                <h4>Cliente: <snap id="show-client"></span></h4>
                <form id="attendance">
                    <label for="input-terapia"> Terapia: </label>
                    <select id="input-terapia" value="" required>
                        <option value="" selected disabled hidden>Escolha uma opção</option>
                        <option value="reflexoterapia">Reflexoterapia</option>
                        <option value="acupuntura">Acupuntura</option>
                    </select>&nbsp&nbsp&nbsp
                    <label for="input-date">Data:</label><input type="date" id="input-date" required></input><br>
                    <textarea id="input-attendance"></textarea><br>
                    <button id="btn-save" type="submit"> Salvar </button>
                </form>
            </div>
            <br><br>
            <h3>Histórico</h3>
            <div id="history"></div>
        `;

        document.querySelector('#input-date').valueAsDate = new Date();
        document.querySelector('#show-client').value = this._appClient._name;
        console.log(this._appClient);

    }
}