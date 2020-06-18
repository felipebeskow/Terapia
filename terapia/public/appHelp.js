class AppHelp {

    constructor(){
        
        this._appEl = document.querySelector('#app');

        let buttonHelp = document.createElement("div");

        this.data = {};

        buttonHelp.innerHTML = `
            <button id="help">Me Ajuda!</button>
        `;
        
        buttonHelp.style.position = "absolute";
        buttonHelp.style.top = "0";
        buttonHelp.style.right = "0";
        buttonHelp.style.margin = "20px";

        buttonHelp.addEventListener('click', e=> {

            this.data['class'] = JSON.stringify(appTerapia);
            this.data['context'] = JSON.stringify(appTerapia._appEl.innerHTML);

            this._appEl.innerHTML =`
                <input id="mensagem"></input>
                <button id="btnmensagem">Enviar</button>
            `;

            this.data['mensagem'] = document.querySelector("#mensagem").innerHTML;
            document.querySelector("#btnmensagem").addEventListener('click', e=> {
                this.sendEmail();
                window.location.reload();
            }); 

        });

        this._appEl.appendChild(buttonHelp);


    }

    sendEmail(){
        let ajax = new XMLHttpRequest();

        ajax.open('POST', '/h');

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