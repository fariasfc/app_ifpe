//#npm install -g ripple-emulator
//#ripple emulate --path ~/Google\ Drive/Projetos/python/app_ifpe/app_ifpe_mobile/www

document.addEventListener("deviceready", onDeviceReady, false);

function onDeviceReady(){
    var vm = new Vue({
        el: "#app_ifpe",
        data:{
            token: '',
            posts: []
        },
        
        methods:{
            sync:function(){
                var self = this;
                $.ajax({
                   dataType: 'json',
                    url: 'http://localhost:8888/post?tags=redes-de-computadores&tags=informatica-basica',
                    beforeSend: function(xhr, settings) { 
                        xhr.setRequestHeader('Authorization','Token ' + self.token); 
                    },

                    success:function(json_data){
                        localStorage.setItem('posts', JSON.stringify(json_data.results));
                        vm.getPosts();
                    },
                    error:function(data){
                        alert(JSON.stringify(data));
                    }
                });
            },
            
            getPosts:function(){
                this.posts = JSON.parse(localStorage.getItem('posts'));
            },
            
            login:function(){
                var self = this;
                var login_credentials = {
                    "username": "felipe.farias",
                    "email": "",
                    "password": "qwer1234"
                };
                
                $.ajax({
//                    dataType: 'json',
                    url: 'http://localhost:8888/rest-auth/login/',
                    async: false,
                    contentType: "application/json",
                    type: 'POST',
                    data: JSON.stringify(login_credentials),
                    success: function(data){
                        self.token = data['key'];
                        self.setToken(data['key']);
                        console.log(self.token);
                    },
                    error: function(data){
                        alert(JSON.stringify(data));
                    }
                });
            },
            
            
        },     
        
        ready:function(){
            this.login();
            this.sync();
        }
    })
}