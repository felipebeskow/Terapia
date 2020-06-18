class AppClient{

    constructor(edit = true, id=-1, attendance = false){
    
        if(edit){            

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
                    <tr> <button id="btn-back"> Voltar </button></tr>&nbsp&nbsp&nbsp<tr> <button id="btn-save" type="submit"> Salvar </button></tr>
                </td>
                </table>
            </form>
            `;
            
            this._nameEl = document.querySelector('#input-name');
            this._birthEl = document.querySelector('#input-birth');
            this._professionEl = document.querySelector('#input-profession');
            this._addressEl = document.querySelector('#input-address');
            this._telephoneEl = document.querySelector('#input-telephone');
            this._obsEl = document.querySelector('#input-obs');

        }

        this._attendance = attendance;

        this._id = id;
        this._name = '';
        this._birth = '';
        this._profession = '';
        this._address = '';
        this._telephone = '';
        this._obs = '';

        this.edit = edit


        this.load();

    }

    get name(){
        return this._name;
    }

    get id(){
        return this._id;
    }

    get idade(){
        return (parseFloat(new Date().getFullYear()) - parseFloat(this._birth.substr(0,4)));
    }

    load(){
        if (this._id != -1) {
            this.getClient();
        }

        if(this.edit){
            document.querySelector('#btn-save').addEventListener('click',e=>{

                e.preventDefault();

                this.updateClass();

                if(this._name == '') return false;

                let data = this.prepareData(this.clientToJSON());

                let ajax = new XMLHttpRequest();

                console.log(this._id);

                if (this._id == -1){ 
                    ajax.open('POST', '/c');
                }else{ 
                    ajax.open('PUT', `/c/${this._id}`);
                }

                ajax.onload = window.location.reload();

                ajax.setRequestHeader('Content-Type','application/x-www-form-urlencoded');
                ajax.send(data);

            });

            document.querySelector('#btn-back').addEventListener('click', e=>{
                
                e.preventDefault();
                
                if (this._attendance){
                    new appTerapia.appAttendance.constructor(this._id);
                }else{
                    window.location.reload();
                }

            });
        }

        new AppHelp();
    }

    clientToJSON(){

        let json = {};

        if(this._id > -1) json['_id'] = this._id ;

        json['_name'] = this._name ;
        json['_birth'] = (this._birth  == null) ? '' :this._birth ;
        json['_profession'] = this._profession ;
        json['_address'] = this._address ;
        json['_telephone'] = this._telephone ;
        json['_obs'] = this._obs ;

        return json;

    }

    prepareData(data){

        if(typeof data == 'string') return data;

        let pairs = Object.keys(data).map(key=>{
            return [key, data[key]].map(encodeURIComponent).join('=');
        }).join('&');

        return pairs;

    }

    getClient(){

        let ajax = new XMLHttpRequest();

        ajax.open('GET', `/c/${this._id}`, true);

        ajax.onload = event => {

            try{
                
                let client = JSON.parse(ajax.responseText);

                this._name  = client['user']['_name'];
                this._birth  = client['user']['_birth'];
                this._profession  = client['user']['_profession'];
                this._address  = client['user']['_address'];
                this._telephone  = client['user']['_telephone'];
                this._obs  = client['user']['_obs'];   
                
                if (this.edit) this.updateEl();

                                
            }catch(e){
                console.error(e);
            }

        }

        ajax.send();
    }

    updateClass(){

        this._name = this._nameEl.value;
        this._birth = this._birthEl.value;
        this._profession = this._professionEl.value;
        this._address = this._addressEl.value;
        this._telephone = this._telephoneEl.value;
        this._obs = this._obsEl.value;

    }

    updateEl(){

        this._nameEl.value = this._name;
        this._birthEl.value = this._birth;
        this._professionEl.value = this._profession;
        this._addressEl.value = this._address;
        this._telephoneEl.value = this._telephone;
        this._obsEl.value = this._obs;
        
    }


}