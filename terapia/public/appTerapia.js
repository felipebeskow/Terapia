class AppTerapia{

    constructor(){

        this._appEl = document.querySelector('#app');

        this._inputSearchEl;
        this._datalistSearchEl;
        this._tableClientEl;
        this._clients = {};
        
        this.home();
        
    }

    home(){

        this._appEl.innerHTML = `
            <h1>Terapia</h1>
            <br>
            <form>
                <input id="input-search" placeholder="Digite o cliente" list="clients"></input>
                <datalist id="clients"></datalist>
                <br>
                <table id="table-client" style="display: none;">
                </table>
                <br>
                <button id="add-client">Adicionar Clientes</button>
                <button id="teste-cliente">Teste Cliente</button>
            </form>
        `;

        this._inputSearchEl = this._appEl.querySelector('#input-search');
        this._datalistSearchEl = this._appEl.querySelector('#clients');
        this._tableClientEl = this._appEl.querySelector('#table-client');

        this.appClient;

        this.addEventHome();
        this.getClients();

    }

    getClients(){

        let ajax = new XMLHttpRequest();

        ajax.open('GET', '/c', true);

        ajax.onload = event => {

            try{
                
                this._clients = JSON.parse(ajax.responseText);
                this.addClientDataList();

                                
            }catch(e){
                console.error(e);
            }

        }

        ajax.send();
    
    }

    scrollClients(f){
        this._clients['clients'].forEach((e)=>{       
            f(e);
        });
    }


    addClientDataList(){
        this.scrollClients((client)=>{
            let opt = document.createElement('option');

            opt.value = client['_name'];
            opt.dataset.client = JSON.stringify(client);
            
            this._datalistSearchEl.appendChild(opt);
        });
    }
    
    addEventHome(){

        document.querySelector('#teste-cliente').addEventListener('click', e=>{
            this.appClient = new AppClient(true, 'mjz8hKxgUvV0wpbQ');
        });

        document.querySelector('#add-client').addEventListener('click', e=>{
            this.appClient = new AppClient();
        });
        
        this._inputSearchEl.addEventListener('keypress', e=>{

            if (e.key == 'Enter'){

                e.preventDefault();

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
                            this.appClient = new AppClient(false, client['_id']);
                            this.appAttendance = new AppAttendance();
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
                    alert('Nenhum cliente encontrado com esse nome.');
                }

            }

        });

    }
}