class AppAttendance{
    constructor(idClient, id = -1){

        this._id = id;

        this._idClient = idClient;
        this._client = {};

        this._appEl = document.querySelector('#app');

        this._appEl.innerHTML = `
            <div id="preview" >
                <img id="previewImg">
            </div>
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
                    <label for="input-date">Data:</label><input type="date" id="input-date" required></input><br>
                    <label for="input-attendance">Atendimento: </label><br><textarea id="input-attendance"></textarea><br>
                    <label for="input-produts">Produtos: </label><br><textarea id="input-produts"></textarea><br>
                    <div id='iridofoto' style='display: none'>
                        <figure>
                            <img id='olhoEsquerdo' src='../img/1.png' id='imgOE'>
                            <figcaption> Olho esquerdo </figcaption><br>
                            <input type='file' accept='image/*' id='fileOE'></input>
                        </figure><figure>
                            <img id='olhoDireito' src='../img/2.png' id='imgOD'>
                            <figcaption> Olho direito </figcaption>
                            <input type='file' accept='image/*' id='fileOD'></input>
                        </figure>
                    </div><br> 
                    <button id="btn-back" onclick="window.location.reload()"> Voltar  </button>
                    <button id="btn-clean"> Novo atendimento </button>
                    <button id="btn-save" type="submit"> Salvar </button>
                    <button id="btn-disable"> Excluir Atendimento </button>
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
        this._uploadOE = '';
        this._uploadOD = '';
        this._preview = document.querySelector('#preview');

        this.load();

    }

    load(){

        this.showPreview();

        if (this._id != -1) this.getAttendance();
        else this._dateEl.valueAsDate = new Date();

        this.getClient();
        this.getAttendances();

        document.querySelector('#btn-save').addEventListener('click', e=>{
            e.preventDefault();
            this.showPreview('loading');
            if(this.validateAttendance())
                this.save();
            else 
                alert('Favor preencher os campos de Terapia, Data e Atendimento corretamente');
        });
        
        document.querySelector("#btn-clean").addEventListener('click', e=>{
            e.preventDefault();
            console.log('limpar');
            
            new AppAttendance(this.idClient);
            

        });

        document.querySelector('#btn-disable').addEventListener('click', e=>{
            e.preventDefault();
            this.disableAttendance();
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
            let reader = new FileReader();
            reader.onloadend = e => {
                this._olhoDireito.src = reader.result;
            };
            reader.readAsDataURL(this._fileODEl.files[0]);
            
        });

        this._preview.addEventListener('click', e=> {
            this.showPreview();
        });

        this._olhoEsquerdo.addEventListener('click', e=>{
            this.showPreview('show');
            document.querySelector('#previewImg').src = this._olhoEsquerdo.src;
        });

        this._olhoDireito.addEventListener('click', e=>{
            this.showPreview('show');
            document.querySelector('#previewImg').src = this._olhoDireito.src;
        });

        new MenuSuperior();
    }

    showPreview(show=''){
        if (show == 'show'){
            this._preview.style.display = "flex";
            this._terapiaEl.style.visibility = "hidden";
        } else if (show=='loading') {
            this._preview.style.display = "flex";
            this._terapiaEl.style.visibility = "hidden";
            document.querySelector('#previewImg').src = '../img/loading.svg';
        } else {
            this._preview.style.display = "none";
            this._terapiaEl.style.visibility = "visible";

        }
    }

    getClient(){
        
        let ajax = new XMLHttpRequest();

        let message = `_idLogin=${localStorage.getItem('id')}`;

        ajax.open('PUT', `/c/${this._idClient}`);

        ajax.onloadend = event => {
            try{

                this._client = JSON.parse(ajax.responseText)['user'];

                document.querySelector('#show-client').innerHTML = `
                    <div>    
                        <div>
                            Cliente:  ${this._client['_name']}<br>
                            Profissão: ${this._client['_profession']}<br>
                            Idade: ${this.calculaIdade(this._client['_birth'])} 
                        </div> 
                        <div> <br> <button id="btn-client" type="submit"> Editar Cadastro de Cliente </button> </div>
                    </div> 
                `;  

                document.querySelector('#btn-client').addEventListener('click', e=>{
                    e.preventDefault();
                    this.appClient = new AppClient(true, this._idClient, true);
                });

            }catch(e){
                console.error(e);
            }
        };

        ajax.setRequestHeader('Content-Type','application/x-www-form-urlencoded');
        ajax.send(message);
        
    }

    calculaIdade(clientBirth){

        return Math.floor(Math.ceil(Math.abs(new Date(clientBirth).getTime() - new Date().getTime()) / (1000 * 3600 * 24)) / 365.25) + ' anos';

    }

    save(){
        if((this._terapiaEl.value == 'iridofoto') && ((this._fileODEl != '')||(this._fileOEEl != ''))){
            this.saveIridofoto();
        }else{
            this.saveAttendance();
        }
    }

    saveIridofoto(){

        let ajaxIridofoto = new XMLHttpRequest();

        ajaxIridofoto.open('PUT', '/iridofoto');

        ajaxIridofoto.onload = event => {

            if (this._fileOEEl.value != '') this._uploadOE = JSON.parse(ajaxIridofoto.responseText).oe;
            if (this._fileODEl.value != '') this._uploadOD = JSON.parse(ajaxIridofoto.responseText).od;

            this.saveAttendance();
          
        };

        ajaxIridofoto.onerror = err => {console.error(err)};

        let formdata = new FormData();

        formdata.append('id', window.localStorage.getItem('id'));
        if (this._fileOEEl.value != '') formdata.append('oe', this._fileOEEl.files[0]);
        if (this._fileODEl.value != '') formdata.append('od', this._fileODEl.files[0]);

        ajaxIridofoto.send(formdata);



    }

    saveAttendance(){
        let ajaxSave = new XMLHttpRequest();

        let data = this.prepareData(this.attendanceToJSON());
        
        if (this._id == -1){ 
            ajaxSave.open('POST', '/a');
        }else{ 
            ajaxSave.open('POST', `/a/${this._id}`);
        }

        ajaxSave.onloadend = event =>{
            this.showPreview();
            alert("Atendimento salvo!");
            window.location.reload();
        };

        ajaxSave.setRequestHeader('Content-Type','application/x-www-form-urlencoded');
        ajaxSave.send(data);
    }

    validateAttendance(){
        if ( this._terapiaEl.value != '' )
        if ( (new Date(this._dateEl.value).getTime()) <= new Date().getTime() )
        if ( this._inputAttendanceEl.value != '' )
            return true;
        return false;
    }

    attendanceToJSON(disable = false){
        let json = {};

        json['_idLogin'] = localStorage.getItem('id');
        json['_date'] = this._dateEl.value;
        json['_terapia'] = this._terapiaEl.value;
        json['_attendance'] = this._inputAttendanceEl.value;
        json['_produts'] = this._inputProdutsEl.value;
        json['_idClient'] = this._idClient;
        json['_oe'] = this._uploadOE;
        json['_od'] = this._uploadOD;

        if(disable) {
            json['_disable'] = 'true';
        } else {
            json['_disable'] = 'false';
        }

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
                this._dateEl.disabled = true;
                
                this._terapiaEl.value = attendance['_terapia'];
                this._terapiaEl.disabled = true;
                
                this._inputAttendanceEl.value = attendance['_attendance'];
                this._inputAttendanceEl.disabled = true;
                
                this._inputProdutsEl.value = attendance['_produts'];
                this._inputProdutsEl.disabled = true;
                
                if (this._terapiaEl.value == 'iridofoto') {
                    this._iridofotoEl.style.display = "inline-block";

                    this._olhoEsquerdo.src = '/download/idLogin/' + window.localStorage.getItem('id') + '/file/' + attendance['_oe'];
                    this._fileOEEl.disabled = true;

                    this._olhoDireito.src = '/download/idLogin/' + window.localStorage.getItem('id') + '/file/' + attendance['_od'];
                    this._fileODEl.disabled = true;
                }

                document.querySelector('#btn-save').disabled = true;

                                
            }catch(e){
                console.error(e);
            }

        }

        ajax.setRequestHeader('Content-Type','application/x-www-form-urlencoded');
        ajax.send(message);
    }

    getAttendances(){

        this._historyEl.innerHTML = '';

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

    disableAttendance(){
        
        let ajaxDisable = new XMLHttpRequest();

        let data = this.prepareData(this.attendanceToJSON(true));
        
        ajaxDisable.open('POST', `/a/${this._id}`);

        ajaxDisable.onloadend = event =>{
            this.showPreview();
            alert("Atendimento excluído!");
            window.location.reload();
        };

        ajaxDisable.setRequestHeader('Content-Type','application/x-www-form-urlencoded');
        ajaxDisable.send(data);
    }
}