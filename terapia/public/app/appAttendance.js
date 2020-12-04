class AppAttendance{
    constructor(idClient, id = -1){

        this._id = id;

        this._idClient = idClient;
        this._client = {};

        this._appEl = document.querySelector('#app');

        this._appEl.innerHTML = `
            <h1>Atendimento</h1>
            <div>
                <h4 id="show-client"></h4>
                <form id="attendance">
                    <label for="input-terapia"> Terapia: </label>
                    <select id="input-terapia" value="" required>
                        <option value="" selected disabled hidden>Escolha uma opção</option>
                        <option value="acupuntura">Acupuntura</option>
                        <option value="iridofoto">Iridofoto</option>
                        <option value="reflexoterapia">Reflexoterapia</option>
                    </select>&nbsp&nbsp&nbsp
                    <label for="input-date">Data:</label><input type="date" id="input-date" required></input>&nbsp&nbsp&nbsp
                    <button id="btn-client" type="submit"> Editar Cadastro de Cliente </button><br>
                    <label for="input-attendance">Atendimento: </label><br><textarea id="input-attendance"></textarea><br>
                    <label for="input-produts">Produtos: </label><br><textarea id="input-produts"></textarea><br>
                    <button id="btn-back" onclick="window.location.reload()"> Voltar </button>
                    <button id="btn-clean"> Limpar </button>
                    <button id="btn-save" type="submit"> Salvar </button>
                </form>
            </div>
            <br><br>
            <h3>Histórico</h3>
            <div id="history"></div>
        `;

        this._dateEl = document.querySelector('#input-date');
        this._terapiaEl = document.querySelector('#input-terapia');
        this._inputAttendanceEl = document.querySelector('#input-attendance');
        this._inputProdutsEl = document.querySelector('#input-produts');
        this._historyEl = document.querySelector('#history');

        this.load();

    }

    load(){

        if (this._id != -1) this.getAttendance();
        else this._dateEl.valueAsDate = new Date();

        this.getClient();
        this.getAttendances();

        document.querySelector('#btn-client').addEventListener('click', e=>{
            e.preventDefault();
            this.appClient = new AppClient(true, this._idClient, true);
        });

        document.querySelector('#btn-save').addEventListener('click', e=>{
            e.preventDefault();
            this.save();
        });

        document.querySelector("#btn-clean").addEventListener('click', e=>{
            e.preventDefault();
            new AppAttendance(this._idClient);
        });

        new AppHelp();
    }

    getClient(){
        
        let ajax = new XMLHttpRequest();

        ajax.open('GET', `/c/${this._idClient}`);

        ajax.onload = event => {
            try{
                
                this._client = JSON.parse(ajax.responseText)['user'];
                document.querySelector('#show-client').innerHTML = `
                    Cliente:  ${this._client['_name']}<br>
                    Profissão: ${this._client['_profession']}
                `;
                
            }catch(e){
                console.error(e);
            }
        };

        ajax.send();
        
    }

    save(){
        
        let ajax = new XMLHttpRequest();

        let data = this.prepareData(this.attendanceToJSON());
        
        if (this._id == -1){ 
            ajax.open('POST', '/a');
        }else{ 
            ajax.open('PUT', `/a/${this._id}`);
        }

        ajax.onloadend = event =>{
            alert("Atendimento salvo!");
            window.location.reload();
        };

        ajax.setRequestHeader('Content-Type','application/x-www-form-urlencoded');
        ajax.send(data);

        
    }

    attendanceToJSON(){
        let json = {};

        json['_date'] = this._dateEl.value;
        json['_terapia'] = this._terapiaEl.value;
        json['_attendance'] = this._inputAttendanceEl.value;
        json['_produts'] = this._inputProdutsEl.value;
        json['_idClient'] = this._idClient;

        return json;
    }

    prepareData(data){

        if(typeof data == 'string') return data;

        let pairs = Object.keys(data).map(key=>{
            return [key, data[key]].map(encodeURIComponent).join('=');
        }).join('&');

        return pairs;

    }

    getAttendance(){

        let ajax = new XMLHttpRequest();

        ajax.open('GET', `/a/${this._id}`, true);

        ajax.onload = event => {

            try{
                
                let attendance = JSON.parse(ajax.responseText);

                attendance = attendance['attendance'];

                console.log(attendance);

                this._id = attendance['_id'];
                this._dateEl.value = attendance['_date'];
                this._terapiaEl.value = attendance['_terapia'];
                this._inputAttendanceEl.value = attendance['_attendance'];
				this._inputProdutsEl.value = attendance['_produts'];
                                
            }catch(e){
                console.error(e);
            }

        }

        ajax.send();
    }

    getAttendances(){
        let ajax = new XMLHttpRequest();

        ajax.open('GET', '/a', true);

        ajax.onload = event => {

            try{
                
                let attendances = JSON.parse(ajax.responseText);

                let first = true;

                [...attendances['attendances']].forEach((attendance)=>{
                
                    if(attendance['_idClient'] == this._idClient){

                        let btn = document.createElement('button');

                        if(first){
                            first = false;
                            if(this._id == -1){
                                this._inputProdutsEl.value = attendance['_produts'];
                            }
                        }
                        
                        btn.innerHTML = attendance['_terapia'].substr(0,1).toUpperCase() + attendance['_terapia'].substr(1) + ' - ' + attendance['_date'].substr(8,2) + '/' + attendance['_date'].substr(5,2) + '/' + attendance['_date'].substr(0,4);
                        
                        btn.onclick = () => {
                            new AppAttendance(this._idClient, attendance['_id']);
                        };

                        this._historyEl.appendChild(btn);
                        
                        this._historyEl.appendChild(document.createElement('br'));
                        this._historyEl.appendChild(document.createElement('br'));

                    }
                
                });
                                
            }catch(e){
                console.error(e);
            }

        }

        ajax.send();
    }
}