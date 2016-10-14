//#npm install -g ripple-emulator
//#ripple emulate --path ~/Google\ Drive/Projetos/python/app_ifpe/app_ifpe_mobile/www

document.addEventListener("deviceready", onDeviceReady, false);

function startOneSignal(){
    // Add to index.js or the first page that loads with your app.
    // For Intel XDK and please add this to your app.js.


      // Enable to debug issues.
      // window.plugins.OneSignal.setLogLevel({logLevel: 4, visualLevel: 4});

        alert("chamando1");
      var notificationOpenedCallback = function(jsonData) {
        console.log('notificationOpenedCallback: ' + JSON.stringify(jsonData));
      };

        alert("chamando2");
      window.plugins.OneSignal
        .startInit("037babc4-5063-4910-bb00-9d61ea5914c0", "34709960635")
        .handleNotificationOpened(notificationOpenedCallback)
        .endInit();

      // Sync hashed email if you have a login system or collect it.
      //   Will be used to reach the user at the most optimal time of day.
      // window.plugins.OneSignal.syncHashedEmail(userEmail);
    
    alert("cabou");
}

           
function onDeviceReady(){
    
//    startOneSignal();
//    
//    <template id="boxes-template">
//      <div>
//        <input type="checkbox"
//               value="" 
//               id="" 
//        />
//      </div>
//    </template>
//               
//    var BoxesChecks = Vue.extend({
//      props: ['boxIndex', 'boxName', 'boxStatus'],
//      template: '#boxes-template'
//    });
//
//    Vue.component('boxes-checks', BoxesChecks);
    
    var vm = new Vue({
        el: "#app_ifpe",
        data:{
            url: 'http://localhost:8888/',
            post_index: 0,
            token: '',
            posts: [],
            all_tags: [],
            login_credentials: {"username": "", "password":"", "email":""},
            profile: null
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
            
            read_post:function(i){
                this.post_index = i;
                activate_subpage("#feed_detail");
            },
            
            login:function(){
                console.log('entrou login')
                var self = this;
                self.token = localStorage.getItem('token');
                if(self.token){
                    this.sync();
                    activate_page("#main");
                } else {
                    $.ajax({
                    dataType: 'json',
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
        
            load_profile:function(){
                var self = this; 
                $.ajax({
                    dataType: 'json',
//                    url: self.url + 'profile/' + self.login_credentials.username,
                    url: self.url + 'profile/',// + self.login_credentials.username,
                    beforeSend: function(xhr, settings) { 
                        xhr.setRequestHeader('Authorization','Token ' + self.token); 
                    },
                    async: false,
                    contentType: "application/json",
                    type: 'GET',
                    data: JSON.stringify(self.login_credentials),
                    success: function(data){
                        self.profile = JSON.stringify(data.results);
                        console.log(self.profile);
                        console.log(self.token);
                    
                    },
                    error: function(data){
                        alert(JSON.stringify(data));
                    }
                });  
            },
            
            prepare_adjustments:function(){
                var self = this;
        
                // Loading Profile
                $.ajax({
                    dataType: 'json',
//                    url: self.url + 'profile/' + self.login_credentials.username,
                    url: self.url + 'profile/',// + self.login_credentials.username,
                    beforeSend: function(xhr, settings) { 
                        xhr.setRequestHeader('Authorization','Token ' + self.token); 
                    },
                    async: false,
                    contentType: "application/json",
                    type: 'GET',
                    data: JSON.stringify(self.login_credentials),
                    success: function(data){
                        self.profile = data.results[0];
                        console.log("profile=" + self.profile);
                        console.log(self.token);
                    
                    },
                    error: function(data){
                        alert(JSON.stringify(data));
                    }
                });  
    
                // Loading Tags
                $.ajax({
                    dataType: 'json',
                    url: self.url + 'tag/' + self.login_credentials.username,
                    beforeSend: function(xhr, settings) { 
                        xhr.setRequestHeader('Authorization','Token ' + self.token); 
                    },
                    async: false,
                    contentType: "application/json",
                    type: 'GET',
                    data: JSON.stringify(self.login_credentials),
                    success: function(data){
                        self.all_tags = data.results;
                        console.log(self.all_tags);
                    },
                    error: function(data){
                        alert(JSON.stringify(data));
                    }
                });
                var profile_tags_ids = this.profile.tags;
                console.log(self.all_tags);
                console.log(profile_tags_ids);
                for (i = 0; i < this.all_tags.length; i++){
                    if ($.inArray(parseInt(this.all_tags[i].id), profile_tags_ids) != -1){
                        // Using with SET due to call Event Change... If I put it manually, it will not be 
                        // realized when to change nor will trigger any event.
                        Vue.set(this.all_tags[i], 'checked', true);
//                        this.all_tags[i].checked= "true";
                    } 
                    else
                    {
                        Vue.set(this.all_tags[i], 'checked', false);
//                        this.all_tags[i].checked= "false";
                    }
                }
                console.log(self.all_tags);
                
                 /*global activate_page */
                 activate_page("#user_detail"); 
                 return false;
                
            },
            
        },     
        
        ready:function(){
            console.log("ready function")
            this.login();
            this.sync();
        }
    })
}