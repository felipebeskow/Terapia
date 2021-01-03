class AppHelp {

    constructor(){
        
        this._appEl = document.querySelector('#app');

        let buttonHelp = document.createElement("div");

        this.data = {};

        buttonHelp.innerHTML = `
            <button id='help'>Me Ajuda!</button>
            <button id='logout'>Sair</button>
        `;
        
        buttonHelp.style.position = "absolute";
        buttonHelp.style.top = "0";
        buttonHelp.style.right = "0";
        buttonHelp.style.margin = "20px";

        this._appEl.appendChild(buttonHelp);

        document.querySelector('#help').addEventListener('click', e=> {
            
            this._appEl.innerHTML =`
                <input id="mensagem"></input>
                <button id="btnmensagem">Enviar</button>
            `;

            this.data['tela'] = window.tela;

            document.querySelector("#btnmensagem").addEventListener('click', e=> {
                this.data['mensagem'] = document.querySelector('#mensagem').value;
                this.sendEmail();
                window.location.reload();
            }); 

        });

        document.querySelector('#logout').addEventListener('click', e=>{

            window.localStorage.setItem('id',-1);
            window.sessionStorage.setItem('login','false');
            window.location.replace(window.location.protocol + '//' + window.location.hostname + ':' + window.location.port);

        });

    }

    sendEmail(){
        let ajax = new XMLHttpRequest();

        ajax.open('PUT', '/h');

        this.data['_idLogin'] = window.localStorage.getItem('id');

        ajax.setRequestHeader('Content-Type','application/x-www-form-urlencoded');

        ajax.send(this.prepareData(this.data));

    }

    prepareData(data){

        if(typeof data == 'string') return data;

        let pairs = Object.keys(data).map(key=>{
            return [key, data[key]].map(encodeURIComponent).join('=');
        }).join('&');

        return pairs;

    }

}