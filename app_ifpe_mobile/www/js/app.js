//#npm install -g ripple-emulator
//#ripple emulate --path ~/Google\ Drive/Projetos/python/app_ifpe/app_ifpe_mobile/www

document.addEventListener("deviceready", onDeviceReady, false);

function onDeviceReady(){
    var vm = new Vue({
        el: "#app_ifpe",
        data:{
            url: 'http://localhost:8888/',
            post_index: 0,
            token: '',
            posts: [],
            login_credentials: {"username": "", "password":"", "email":""}
        },
        
        methods:{
            sync:function(){
                var self = this;
                $.ajax({
                   dataType: 'json',
                    url: self.url + 'post?tags=redes-de-computadores&tags=informatica-basica',
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
            
            read_post:function(index){
                self.post_index = index;
                activate_subpage("#feed_detail");
            },
            
            login:function(){
                var self = this;
                self.token = localStorage.getItem('token');
                if(self.token){
                    this.sync();
                    activate_page("#feed");
                } else {
                    $.ajax({
//                    dataType: 'json',
                    url: self.url + 'rest-auth/login/',
                    async: false,
                    contentType: "application/json",
                    type: 'POST',
                    data: JSON.stringify(self.login_credentials),
                    success: function(data){
                        localStorage.setItem('token', data['key']);
                        console.log(self.token);
                        self.login();
                    },
                    error: function(data){
                        alert(JSON.stringify(data));
                    }
                });    
                }
            },
            
            
        },     
        
        ready:function(){
            this.login();
            this.sync();
        }
    })
}