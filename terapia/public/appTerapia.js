class AppTerapia{

    constructor(){

        this._appEl = document.querySelector('#app');

        this._inputSearch;
        
        this.home();

    }

    home(){

        this._appEl.innerHTML = `
            <h1>Terapia</h1>
            <br>
            <input id="input-search" value="Digite o cliente"></input>
        `;

        this.addEventHome();

    }

    addEventHome(){
        this._inputSearch = this._appEl.querySelector('#input-search');
        
        this._inputSearch.addEventListener('focus', e =>{

            if (e.srcElement.value == 'Digite o cliente') e.srcElement.value = '';

        });

        this._inputSearch.addEventListener('input', e=>{

            console.log(e);

        });

    }

}