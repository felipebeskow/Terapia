class AppTerapia{

    constructor(){

        if(localStorage.getItem('id')=='undefined'){
            this.idLogin = "-1";
        } else {
            this.idLogin = localStorage.getItem('id');
        }

        if ( window.sessionStorage.getItem('login') == 'true' ){
            
            this._appEl = document.querySelector('#app');

            this._inputSearchEl;
            this._datalistSearchEl;
            this._tableClientEl;
            this._clients = {};
            
            this.home();
        } else {

            window.localStorage.setItem('id',-1);
            window.sessionStorage.setItem('login','false');
            window.alert("faça login");
            window.location.replace(window.location.protocol + '//' + window.location.hostname + ':' + window.location.port );
            
        }

    }

    home(){

        this._appEl.innerHTML = `
            <h1>Terapia</h1>
            <br>
            <button id="add-client">Adicionar Clientes</button>
            <br><br><br>
            <form>
                <input id="input-search" placeholder="Digite o cliente" list="clients" autocomplete="off"></input>
                <br>
                <table id="table-client" style="display: none;">
                </table>
            </form>
        `;

        window.tela = 'Incial';
        new AppHelp();

        this._inputSearchEl = this._appEl.querySelector('#input-search');
        this._datalistSearchEl = this._appEl.querySelector('#clients');
        this._tableClientEl = this._appEl.querySelector('#table-client');

        this.appClient;

        this.addEventHome();
        this.getClients();

    }

    getClients(){

        try{
            let ajax = new XMLHttpRequest();
            let json = {};

            json['_idLogin'] = localStorage.getItem('id');
            json = new Utils().prepareData(json);

            ajax.open('PUT', '/c');

            ajax.onloadend = event => {
                console.log(ajax.responseText);

                try{
                    
                    this._clients = JSON.parse(ajax.responseText);

                                    
                }catch(e){
                    console.error(e);
                }

            }

            ajax.onerror = error => console.error(error);

            ajax.setRequestHeader('Content-Type','application/x-www-form-urlencoded');
            ajax.send(json);
        } catch(e){
            console.error(e);
        }
    
    }

    scrollClients(f){
        console.log(this._clients);
        this._clients['clients'].forEach((e)=>{       
            f(e);
        });
    }
    
    addEventHome(){

        document.querySelector('#add-client').addEventListener('click', e=>{
            this.appClient = new AppClient();
        });
        
        this._inputSearchEl.addEventListener('keydown', e=> {
            if (e.key == 'Enter') e.preventDefault();
        });

        this._inputSearchEl.addEventListener('input', e=>{

            if (this._inputSearchEl.value != ''){

               //limpar tabela
                [...this._tableClientEl.childNodes].forEach(tr => {
                    tr.remove();
                });
                
                let unique = 0;

                this.scrollClients((client)=>{


                    //procura clientes pelos nomes
                    if (client['_name'].toUpperCase().indexOf(this._inputSearchEl.value.toUpperCase())>-1) {


                        unique++;
                        let tr = document.createElement('tr');

                        tr.innerHTML=`
                            <td><p> ${client['_name']}</p></td>
                            <td> - </td>
                            <td><p> ${new Date().getFullYear() - client['_birth'].substr(0,4)} anos</p></td>
                        `;

                        tr.addEventListener('click',()=>{
                            this.appAttendance = new AppAttendance(client['_id']);
                        });

                        tr.dataset.client = JSON.stringify(client);
                        this._tableClientEl.appendChild(tr);

                    }
                    
                });

                if(this._inputSearchEl.value == '') unique = 0;

                //mostra a tabela caso ache clientes
                if(unique>0){
                    this._tableClientEl.style.display = "inline-block";
                }else{
                    this._tableClientEl.innerHTML = `
                        <tr>
                            <td> <p> Nenhum cliente encontrado com esse nome. </p> </td>
                        </tr>
                        `;
                }

            } else {
                this._tableClientEl.style.display = "none";
            }

        });

    }
}