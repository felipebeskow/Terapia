class MenuSuperior {

    constructor(){
        
        this._appEl = document.querySelector('#app');

        let buttonHelp = document.createElement("div");

        var formData = new FormData();

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

            html2canvas(document.querySelector("#app")).then(canvas => {
                window.print = canvas;
            });
            
            this._appEl.innerHTML =`
                <input id="mensagem"></input>
                <button id="btnmensagem">Enviar</button>
            `;

            formData.append('tela', window.tela);
            formData.append('idLogin', window.localStorage.getItem('id'));

            document.querySelector("#btnmensagem").addEventListener('click', e=> {

                formData.append('mensagem', document.querySelector('#mensagem').value);
                
                window.print.toBlob( blob => {
                    formData.append('print', blob, 'print.png');
                    
                    let ajax = new XMLHttpRequest();

                    ajax.open('PUT', '/help');

                    ajax.onerror = error=>{
                        console.error(error);
                    };

                    ajax.onloadend = ()=>{
                        window.location.reload();
                    };

                    ajax.send(formData);
                    

                });
            }); 

        });

        document.querySelector('#logout').addEventListener('click', e=>{

            window.localStorage.setItem('id',-1);
            window.sessionStorage.setItem('login','false');
            window.location.replace(window.location.protocol + '//' + window.location.hostname + ':' + window.location.port);

        });

    }

    sendEmail(){

    }

}