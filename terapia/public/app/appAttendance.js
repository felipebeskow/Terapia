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
                    <div id='iridofoto' style='display: none'>
                        <figure>
                            <img id='olhoEsquerdo' src='../img/1.png' id='imgOE'>
                            <figcaption> Olho esquerdo </figcaption><br>
                            <input type='file' accept='image/*' id='fileOE'></input>
                        </figure>
                        <figure>
                            <img id='olhoDireito' src='../img/2.png' id='imgOD'>
                            <figcaption> Olho direito </figcaption>
                            <input type='file' accept='image/*' id='fileOD'></input>
                        </figure>
                    </div><br> 
                    <button id="btn-back" onclick="window.location.reload()"> Voltar </button>
                    <button id="btn-clean"> Limpar </button>
                    <button id="btn-save" type="submit"> Salvar </button>
                </form>
            </div>
            <br><br>
            <h3>Histórico</h3>
            <div id="history"></div>
        `;

        window.tela = 'Atendimento';

        this._dateEl = document.querySelector('#input-date');
        this._terapiaEl = document.querySelector('#input-terapia');
        this._inputAttendanceEl = document.querySelector('#input-attendance');
        this._inputProdutsEl = document.querySelector('#input-produts');
        this._historyEl = document.querySelector('#history');
        this._iridofotoEl = document.querySelector('#iridofoto');
        this._fileOEEl = document.querySelector('#fileOE');
        this._fileODEl = document.querySelector('#fileOD');
        this._olhoEsquerdo = document.querySelector("#olhoEsquerdo");
        this._olhoDireito = document.querySelector("#olhoDireito");

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
            if(this.validateAttendance())
                this.save();
            else 
                alert('Favor preencher os campos de Terapia, Data e Atendimento corretamente');
        });

        document.querySelector("#btn-clean").addEventListener('click', e=>{
            e.preventDefault();
            new AppAttendance(this._idClient);
        });

        this._dateEl.addEventListener('keydown', e=>{
            if (e.key == 'Enter') {
                e.preventDefault();
                this._inputAttendanceEl.focus();
            }
        });

        this._terapiaEl.addEventListener('change', e=>{
            if(this._terapiaEl.value == 'iridofoto'){
                this._iridofotoEl.style.display = "inline-block";
            } else {
                this._iridofotoEl.style.display = "none";
            }
        });

        this._fileOEEl.addEventListener('change',e=>{
            
            // código para converter para base64
            let reader = new FileReader();
            reader.onloadend = e => {
                this._olhoEsquerdo.src = reader.result;
            };
            reader.readAsDataURL(this._fileOEEl.files[0]);
            
        });

        this._fileODEl.addEventListener('change',e=>{
            
            // código para converter para base64
            /*let reader = new FileReader();
            reader.onloadend = e => {
                this._olhoDireito.src = reader.result;
            };
            reader.readAsDataURL(this._fileODEl.files[0]);*/

            let ajax = new XMLHttpRequest();

            ajax.open('PUT', '/iridofoto');

            ajax.onload = event => {
                console.log(ajax.responseText);
            };

            let formdata = new FormData();

            formdata.append('input-file', this._fileODEl.files[0]);

            ajax.send(formdata);
            
        });

        new AppHelp();
    }

    getClient(){
        
        let ajax = new XMLHttpRequest();

        let message = `_idLogin=${localStorage.getItem('id')}`;

        ajax.open('PUT', `/c/${this._idClient}`);

        ajax.onloadend = event => {
            try{
                this._client = JSON.parse(ajax.responseText)['user'];
                document.querySelector('#show-client').innerHTML = `
                    Cliente:  ${this._client['_name']}<br>
                    Profissão: ${this._client['_profession']}<br>
                    Idade: ${new Date().getFullYear() - this._client['_birth'].substr(0,4)} anos
                `;                
            }catch(e){
                console.error(e);
            }
        };

        ajax.setRequestHeader('Content-Type','application/x-www-form-urlencoded');
        ajax.send(message);
        
    }

    save(){
        
        let ajax = new XMLHttpRequest();

        let data = this.prepareData(this.attendanceToJSON());
        
        if (this._id == -1){ 
            ajax.open('POST', '/a');
        }else{ 
            ajax.open('POST', `/a/${this._id}`);
        }

        ajax.onloadend = event =>{
            alert("Atendimento salvo!");
            window.location.reload();
        };

        ajax.setRequestHeader('Content-Type','application/x-www-form-urlencoded');
        ajax.send(data);

        
    }

    validateAttendance(){
        if ( this._terapiaEl.value != '' )
        if ( (new Date(this._dateEl.value).getTime()) <= new Date().getTime() )
        if ( this._inputAttendanceEl.value != '' )
            return true;
        return false;
    }

    attendanceToJSON(){
        let json = {};

        json['_idLogin'] = localStorage.getItem('id');
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
        
        let message = `_idLogin=${localStorage.getItem('id')}`;

        ajax.open('PUT', `/a/${this._id}`, true);

        ajax.onloadend = event => {

            try{
                
                let attendance = JSON.parse(ajax.responseText);

                attendance = attendance['attendance'];

                this._id = attendance['_id'];
                this._dateEl.value = attendance['_date'];
                this._terapiaEl.value = attendance['_terapia'];
                this._inputAttendanceEl.value = attendance['_attendance'];
				this._inputProdutsEl.value = attendance['_produts'];
                if (this._terapiaEl.value == 'iridofoto') {
                    this._iridofotoEl.style.display = "inline-block";
                    this._olhoEsquerdo.src = attendance['_OE'];
                    this._olhoDireito.src = attendance['_OD'];
                }
                                
            }catch(e){
                console.error(e);
            }

        }

        ajax.setRequestHeader('Content-Type','application/x-www-form-urlencoded');
        ajax.send(message);
    }

    getAttendances(){
        let ajax = new XMLHttpRequest();
        let message = `_idLogin=${localStorage.getItem('id')}`;

        ajax.open('PUT', '/a', true);

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

                        let terapia = '';

                        if (attendance['_terapia']=='') {
                            terapia = 'Terapia';
                        } else {
                            terapia = attendance['_terapia'].substr(0,1).toUpperCase() + attendance['_terapia'].substr(1);
                        }
                        
                        btn.innerHTML = terapia  + ' - ' + attendance['_date'].substr(8,2) + '/' + attendance['_date'].substr(5,2) + '/' + attendance['_date'].substr(0,4);
                        
                        btn.onclick = (e) => {
                            e.preventDefault();
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

        ajax.setRequestHeader('Content-Type','application/x-www-form-urlencoded');
        ajax.send(message);
    }
}