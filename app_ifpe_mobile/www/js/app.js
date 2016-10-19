//#npm install -g ripple-emulator
//#ripple emulate --path ~/Google\ Drive/Projetos/python/app_ifpe/app_ifpe_mobile/www
document.addEventListener("deviceready", onDeviceReady, false);

// function startOneSignal() {
//     // Add to index.js or the first page that loads with your app.
//     // For Intel XDK and please add this to your app.js.
//     // Enable to debug issues.
//     // window.plugins.OneSignal.setLogLevel({logLevel: 4, visualLevel: 4});
//     var notificationOpenedCallback = function(jsonData) {
//         console.log('notificationOpenedCallback: ' + JSON.stringify(jsonData));
//     };
//     window.plugins.OneSignal.startInit("037babc4-5063-4910-bb00-9d61ea5914c0", "34709960635").handleNotificationOpened(notificationOpenedCallback).endInit();
//     // Sync hashed email if you have a login system or collect it.
//     //   Will be used to reach the user at the most optimal time of day.
//     // window.plugins.OneSignal.syncHashedEmail(userEmail);
//     alert("cabou");
// }

//*********** NOTIFICATIONS ***********//

var tokenID = "";

function startNotifications(){
    console.log("Initializing PushNotification...");
    var push = PushNotification.init({ "android": {"senderID": "154417747729"}} );
    console.log("PushNotification initialized!");
    push.on('registration', function(data) {
        console.log("entrou no Registration...");
        console.log(data.registrationId);
        tokenID = data.registrationId;
        alert(data.registrationId);
        console.log(JSON.stringify(data));
        console.log("Ja alertou no Registration");
    });

    push.on('notification', function(data) {
       alert(data.message);
    });

    push.on('error', function(e) {
       alert(e.message);
    });
}
   

//*********** END NOTIFICATIONS ***********//

function onDeviceReady() {
    // startOneSignal();
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
        data: {
            url: 'http://localhost:8888/',
            post_index: 0,
            token: '',
            posts: [],
            all_tags: [],
            login_credentials: {
                "username": "",
                "password": "",
                "email": ""
            },
            username: '',
            profile: null
        },
        methods: {
            sync: function() {
                var self = this;
                $.ajax({
                    dataType: 'json',
                    url: self.url + 'post/',
                    beforeSend: function(xhr, settings) {
                        xhr.setRequestHeader('Authorization', 'Token ' + self.token);
                    },
                    success: function(json_data) {
                        localStorage.setItem('posts', JSON.stringify(json_data.results));
                        // update profile.notification_id if it is different
                        if (this.profile.notification_id != tokenID){
                                        data_id = {
                                "notification_id": tokenID
                            }
                            $.ajax({
                                dataType: 'json',
                                url: self.url + 'profile/' + self.username + '/',
                                beforeSend: function(xhr, settings) {
                                    xhr.setRequestHeader('Authorization', 'Token ' + self.token);
                                },
                                async: false,
                                contentType: "application/json",
                                type: 'PATCH',
                                data: JSON.stringify(data_id),
                                success: function(data) {
                                    console.log("gravou");
                                    console.log(data_id);
                                    console.log(data);
                                    self.load_profile();
                                    alert("ID enviada com sucesso")
                                },
                                error: function(data) {
                                    alert(JSON.stringify(data));
                                }
                            });
                        }
                        self.load_local_storage();
                    },
                    error: function(data) {
                        alert(JSON.stringify(data));
                    }
                });
            },
            create_device_notification_id: function() {
                var data = {
                    "name": "",
                    "registration_id": "",
                    "device_id": null,
                    "active": false
                }
                // MANDAR POST com JSON para http://127.0.0.1:8888/device/gcm/ com o usuario logado
                // tentar ver comopega o device_id hexadecimal, acho que eh um numero do celular...
                // o POST ja amarra automaticamente o usuario...
            },
            read_post: function(i) {
                this.post_index = i;
                activate_subpage("#feed_detail");
            },
            login: function() {
                console.log('entrou login')
                var self = this;
                this.load_local_storage();
                if (self.token) {
                    this.sync();
                    activate_page("#main");
                    return true;
                } else {
                    if (this.login_credentials.username != "") {
                        $.ajax({
                            dataType: 'json',
                            url: self.url + 'rest-auth/login/',
                            async: false,
                            contentType: "application/json",
                            type: 'POST',
                            data: JSON.stringify(self.login_credentials),
                            success: function(data) {
                                localStorage.setItem('token', data['key']);
                                localStorage.setItem('username', self.login_credentials.username);
                                console.log("Login Success!");
                                self.load_local_storage();
                                self.load_profile();
                                self.login();
                            },
                            error: function(data) {
                                alert(JSON.stringify(data));
                            }
                        });
                    }
                }
                return false;
            },
            load_profile: function() {
                var self = this;
                $.ajax({
                    dataType: 'json',
                    //                    url: self.url + 'profile/' + self.login_credentials.username,
                    url: self.url + 'profile/' + self.username + '/',
                    beforeSend: function(xhr, settings) {
                        xhr.setRequestHeader('Authorization', 'Token ' + self.token);
                    },
                    async: false,
                    contentType: "application/json",
                    type: 'GET',
                    success: function(data) {
                        console.log("Loaded profile: " + JSON.stringify(data));
                        localStorage.setItem('profile', JSON.stringify(data));
                    },
                    error: function(data) {
                        alert(JSON.stringify(data));
                    }
                });
            },
            prepare_adjustments: function() {
                var self = this;
                //                 $.ajax({
                //                     dataType: 'json',
                // //                    url: self.url + 'profile/' + self.login_credentials.username,
                //                     url: self.url + 'profile/',// + self.login_credentials.username,
                //                     beforeSend: function(xhr, settings) {
                //                         xhr.setRequestHeader('Authorization','Token ' + self.token);
                //                     },
                //                     async: false,
                //                     contentType: "application/json",
                //                     type: 'GET',
                //                     data: JSON.stringify(self.login_credentials),
                //                     success: function(data){
                //                         self.profile = data.results[0];
                //                         console.log("profile=" + self.profile);
                //                         console.log(JSON.stringify(self.profile));
                //                         console.log(self.token);
                //                     },
                //                     error: function(data){
                //                         alert(JSON.stringify(data));
                //                     }
                //                 });
                //                 Loading Tags
                $.ajax({
                    dataType: 'json',
                    url: self.url + 'tag/',
                    beforeSend: function(xhr, settings) {
                        xhr.setRequestHeader('Authorization', 'Token ' + self.token);
                    },
                    async: false,
                    contentType: "application/json",
                    type: 'GET',
                    //                     data: JSON.stringify(self.login_credentials),
                    success: function(data) {
                        self.all_tags = data.results;
                        console.log(self.all_tags);
                    },
                    error: function(data) {
                        alert(JSON.stringify(data));
                    }
                });
                var profile_tags_ids = this.profile.tags;
                console.log(self.all_tags);
                console.log(profile_tags_ids);
                for (i = 0; i < this.all_tags.length; i++) {
                    if ($.inArray(parseInt(this.all_tags[i].id), profile_tags_ids) != -1) {
                        // Using with SET due to call Event Change... If I put it manually, it will not be
                        // realized when to change nor will trigger any event.
                        Vue.set(this.all_tags[i], 'checked', true);
                        //                        this.all_tags[i].checked= "true";
                    } else {
                        Vue.set(this.all_tags[i], 'checked', false);
                        //                        this.all_tags[i].checked= "false";
                    }
                }
                console.log(self.all_tags);
                /*global activate_page */
                activate_page("#user_detail");
                return false;
            },
            patch_tags: function() {
                var self = this;
                profile_tags = this.profile.tags;
                tags = []
                tags_i = 0
                for (i = 0; i < this.all_tags.length; i++) {
                    if (this.all_tags[i].checked) {
                        tags[tags_i++] = this.all_tags[i].id;
                    }
                }
                data_tags = {
                    "tags": tags
                }
                $.ajax({
                    dataType: 'json',
                    url: self.url + 'profile/' + self.username + '/',
                    beforeSend: function(xhr, settings) {
                        xhr.setRequestHeader('Authorization', 'Token ' + self.token);
                    },
                    async: false,
                    contentType: "application/json",
                    type: 'PATCH',
                    data: JSON.stringify(data_tags),
                    success: function(data) {
                        console.log("gravou");
                        console.log(tags);
                        self.load_profile();
                        alert("Tags alteradas com sucesso")
                    },
                    error: function(data) {
                        alert(JSON.stringify(data));
                    }
                });
            },
            load_local_storage: function() {
                this.token = localStorage.getItem('token');
                this.username = localStorage.getItem('username');
                this.posts = JSON.parse(localStorage.getItem('posts'));
                this.profile = JSON.parse(localStorage.getItem('profile'));
            },
        },
        ready: function() {
            console.log("ready function")
            var login_success = this.login();
        }
    })
}
