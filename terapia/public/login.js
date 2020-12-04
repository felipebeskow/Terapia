class Login{
    constructor(){
        if(localStorage.getItem('login')){
            console.log("localstore");
        } else {
            document.querySelector('#noJS').style.visibility='hidden';

            this.loginEL = document.querySelector('#loginApp');
            
            this.loginEL.style.visibility = 'visible';

            document.querySelector('#submit').addEventListener('click',this.efetuarlogin);
        }
    }

    efetuarlogin(loginById=false,id='',login='',password=''){

        let ajax = new XMLHttpRequest();
        let json = {};

        if(loginById){

            json['_id'] = id;
            json = new Utils().prepareData(json);
            ajax.open('PUT', '/l/id');

        }else{

            json['_login'] = login;
            json['_password'] = password;
            json = new Utils().prepareData(json);
            ajax.open('PUT', '/l');

        }

        ajax.onloadend = e =>{
            window.login['_id'] = id;
            window.login['_login'] = true;

            window.location.replace(window.location.protocol+window.location.hostname+'/app');
        }

        ajax.setRequestHeader('Content-Type','application/x-www-form-urlencoded');
        ajax.send(json);
    }
}