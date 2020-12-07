//let CryptoJS = require('crypto-js');

class Login{
    constructor(){
        if( (localStorage.getItem('id')=='undefined') || (localStorage.getItem('id')==null) ){
            this.idLogin = "-1";
        } else {
            this.idLogin = localStorage.getItem('id');
        }
        
        if(this.idLogin != -1){
            console.log(this.idLogin);
            this.efetuarlogin();
        } else {
            document.querySelector('#noJS').style.visibility='hidden';

            document.querySelector('#loginApp').style.visibility = 'visible';

            document.querySelector('#submit').addEventListener('click',this.efetuarlogin);
        }
    }

    efetuarlogin(){

        let ajax = new XMLHttpRequest();
        let json = {};

        if (document.querySelector('#loginApp').style.visibility == 'visible') {
            
            json['_login'] = document.querySelector('#login').value;
            json['_password'] = CryptoJS.MD5(document.querySelector('#password').value).toString();
            json = new Utils().prepareData(json);
            ajax.open('POST', '/l');

        } else if( this.idLogin != -1 ) {

            json['_id'] = this.idLogin;
            json = new Utils().prepareData(json);
            ajax.open('PUT', '/lr');

        }

        if (ajax.readyState == 1) {
            ajax.onloadend = e =>{
                try{
                    
                    if(JSON.parse(ajax.responseText)['error']==undefined){
                        
                        let id = JSON.parse(ajax.responseText)['_id'];

                        window.localStorage.setItem('id',id);
                        window.sessionStorage.setItem('login','true');

                        window.location.replace(window.location.protocol + '//' + window.location.hostname + ':' + window.location.port + '/app');
                    }

                } catch(err){
                    window.localStorage.setItem('id',-1);
                    window.sessionStorage.setItem('login','false');
                    window.alert("faça login");
                    window.location.reload();
                }
            }

            ajax.setRequestHeader('Content-Type','application/x-www-form-urlencoded');
            ajax.send(json);
        }
    }
}