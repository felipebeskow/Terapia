class AppTerapia{

    constructor(){

        this._appEl = document.querySelector('#app');

        this._inputSearch;
        this._datalistSearch;
        
        this.home();

    }

    home(){

        this._appEl.innerHTML = `
            <h1>Terapia</h1>
            <br>
            <form>
            <input id="input-search" placeholder="Digite o cliente" list="clients"></input>
            <datalist id="clients"></datalist>
            </form>
            <br>
            <td>
            <tr> nome do cliente</tr><tr> idade</tr>
            </td>
        `;

        this._inputSearch = this._appEl.querySelector('#input-search');
        this._datalistSearch = this._appEl.querySelector('#clients');

        this.getClients();
        this.addEventHome()

    }

    getClients(){
        let ajax = new XMLHttpRequest();

        ajax.open('GET', '/c');

        ajax.onload = event => {

            try{
                
                clients = JSON.parse(ajax.responseText);

                this.scrollClients((client)=>{
                    let opt = document.createElement('option');

                    opt.value = client['name'];
                    
                    this._datalistSearch.appendChild(opt);
                });
                
                
            }catch(e){
                console.error(e);
            }
            

        };

        ajax.send();
    }

    
    addEventHome(){
        
        this._inputSearch.addEventListener('keypress', e=>{

            if (e.key == 'Enter'){
                
                let unique = 0;

                this.scrollClients((clients)=>{
                    if (clients['name' == this._inputSearch.value]) unique++;
                });

                if (unique) true;

            }

        });

    }

    scrollClients(f){
        clients['clients'].forEach((e)=>{       
            f(e);
        });
    }

}