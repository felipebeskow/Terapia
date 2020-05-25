class AppAttendance{
    constructor(idClient, id = -1){

        this._id = id;

        this._idClient = idClient;
        this._client = {};

        this._appEl = document.querySelector('#app');

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
                    <label for="input-date">Data:</label><input type="date" id="input-date" required></input>&nbsp&nbsp&nbsp
                    <button id="btn-client" type="submit"> Editar Cadastro de Cliente </button><br>
                    <textarea id="input-attendance"></textarea><br>
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
            this.appClient = new AppClient(true, this._idClient);
        });

        document.querySelector('#btn-save').addEventListener('click', e=>{
            e.preventDefault();
            this.save();
        });

        document.querySelector("#btn-clean").addEventListener('click', e=>{
            e.preventDefault();
            new AppAttendance(this._idClient);
        });
    }

    getClient(){
        
        let ajax = new XMLHttpRequest();

        ajax.open('GET', `/c/${this._idClient}`);

        ajax.onload = event => {
            try{
                
                this._client = JSON.parse(ajax.responseText)['user'];
                document.querySelector('#show-client').innerHTML = this._client['_name'];
                
            }catch(e){
                console.error(e);
            }
        };

        ajax.send();
        
    }

    save(){

        if(this._inputAttendanceEl.value == '') return false;
        
        let ajax = new XMLHttpRequest();

        let data = this.prepareData(this.attendanceToJSON());
        
        if (this._id == -1){ 
            ajax.open('POST', '/a');
        }else{ 
            ajax.open('PUT', `/a/${this._id}`);
        }

        ajax.setRequestHeader('Content-Type','application/x-www-form-urlencoded');
        ajax.send(data);

        
    }

    attendanceToJSON(){
        let json = {};

        json['_date'] = this._dateEl.value;
        json['_terapia'] = this._terapiaEl.value;
        json['_attendance'] = this._inputAttendanceEl.value;
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

                [...attendances['attendances']].forEach((attendance)=>{
                
                    if(attendance['_idClient'] == this._idClient){

                        let btn = document.createElement('button');
                        
                        btn.innerHTML = attendance['_date'].substr(8,2) + '/' + attendance['_date'].substr(5,2) + '/' + attendance['_date'].substr(0,4);
                        
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