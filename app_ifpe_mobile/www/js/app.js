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
    alert("Initializing PushNotification...");
    var push = PushNotification.init({ "android": {"senderID": "154417747729"}} );
    alert("PushNotification initialized!");
    push.on('registration', function(data) {
        console.log("entrou no Registration...");
        console.log(data.registrationId);
        // tokenID = data.registrationId;
        localStorage.setItem('registration_id', data.registrationId);
        alert(data.registrationId);
        console.log(JSON.stringify(data));
        console.log("Ja alertou no Registration");
    });

    push.on('notification', function(data) {
        alert(data.message);
        navigator.notification.alert(
             data.message,         // message
             null,                 // callback
             data.title,           // title
             'Ok'                  // buttonName
         );
    });

    push.on('error', function(e) {
       alert(e.message);
    });
}


//*********** END NOTIFICATIONS ***********//

function onDeviceReady() {
    startNotifications();
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
            url: 'http://192.168.25.14:8888/',
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
                r = this.ajax_get('post/');
                if(r.success){
                    this.save_local('posts', JSON.stringify(r.result.results));
                }



            },


            create_device_notification_id: function() {
                var r = {
                    "success":false,
                    "result": null
                };
                var reg_id = localStorage.getItem('registration_id');

                if(reg_id){
                    var data_gcm = {
                        "name": String(device.uuid),
                        "registration_id": reg_id,
                        // "device_id": "",
                        "active": true
                    }
                    // alert(JSON.stringify(data_gcm));
                    r = this.ajax_send('POST', 'device/gcm/', data_gcm);
                    if(r.success){
                        console.log("Criou Device para Notificacao");
                        this.load_profile();
                    }
                }
            },
            read_post: function(i) {
                this.post_index = i;
                activate_subpage("#feed_detail");
            },
            login: function() {
                console.log('entrou login')
                this.load_local_storage();
                if (this.token) {
                    this.load_profile();
                    this.sync();
                    activate_page("#main");
                    return true;
                } else {
                    if (this.login_credentials.username != "") {
                        r = this.ajax_send_noauth('POST', 'rest-auth/login/', this.login_credentials);
                        if(r.success){
                            token = r.result['key'];
                            if(token){
                                this.save_local('token', r.result['key']);
                                this.save_local('username', this.login_credentials.username);
                                console.log("Login Success!");
                                this.load_profile();
                                this.login();
                            }
                        }
                    }
                }
                return false;
            },

            logout: function(){
                localStorage.clear();
                activate_page("#login");
//                return false;
            },


            load_profile: function() {
                alert("loadprofile!");
                r = this.ajax_get('profile/' + this.username + '/');
                if(r.success){
                    profile = r.result;
                    alert(JSON.stringify(profile));
                    if(profile.device == null){
                        this.create_device_notification_id();
                    } else if(profile.device.registration_id != localStorage.getItem('registration_id')){
                        this.ajax_send('DELETE', 'device/gcm/' + profile.device.device_id);
                        r = this.create_device_notification_id();
                    } else {
                        this.save_local('profile', JSON.stringify(profile));
                    }
                }
            },


            prepare_adjustments: function() {
                r = this.ajax_get('tag/');

                if(r.success){
                    this.all_tags = r.result.results;
                    var profile_tags_ids = this.profile.tags;

                    console.log(this.all_tags);
                    console.log(this.all_tags);
                    console.log(profile_tags_ids);
                    for (i = 0; i < this.all_tags.length; i++) {
                        if ($.inArray(parseInt(this.all_tags[i].id), profile_tags_ids) != -1) {
                            // Using with SET due to call Event Change... If I put it manually, it will not be
                            // realized when to change nor will trigger any event.
                            Vue.set(this.all_tags[i], 'checked', true);
                        } else {
                            Vue.set(this.all_tags[i], 'checked', false);
                        }
                    }
                    console.log(this.all_tags);
                }

                activate_page("#user_detail");
                return false;
            },


            patch_profile_tags: function() {
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

                r = this.ajax_send('PATCH', 'profile/' + this.username + '/', data_tags);
                if(r.success){
                    this.load_profile();
                }
            },


            load_local_storage: function() {
                this.token = localStorage.getItem('token');
                this.username = localStorage.getItem('username');
                this.posts = JSON.parse(localStorage.getItem('posts'));
                this.profile = JSON.parse(localStorage.getItem('profile'));
            },

            ajax_get: function(url_suffix){
                self = this;
                ret = {
                    "success": false,
                    "result": null
                };
                $.ajax({
                    dataType: 'json',
                    url: self.url + url_suffix,
                    beforeSend: function(xhr, settings) {
                        xhr.setRequestHeader('Authorization', 'Token ' + self.token);
                    },
                    async: false,
                    contentType: "application/json",
                    type: 'GET',
                    success: function(data) {
                        ret.success = true;
                        ret.result = data;
                    },
                    error: function(data) {
                        ret.success = false;
                        ret.result = data;
                        alert(JSON.stringify(data));
                    }
                });

                return ret;
            },

            ajax_send: function(method, url_suffix, json_data){
                self = this;
                ret = {
                    "success": false,
                    "result": null
                };
                $.ajax({
                    dataType: 'json',
                    url: self.url + url_suffix,
                    beforeSend: function(xhr, settings) {
                        xhr.setRequestHeader('Authorization', 'Token ' + self.token);
                    },
                    async: false,
                    contentType: "application/json",
                    type: method,
                    data: JSON.stringify(json_data),
                    success: function(dt) {
                        ret.success = true;
                        ret.result = dt;
                    },
                    error: function(dt) {
                        ret.success = false;
                        ret.result = dt;
                        alert(JSON.stringify(dt));
                    }
                });
                return ret;
            },

            ajax_send_noauth: function(method, url_suffix, json_data){
                self = this;
                ret = {
                    "success": false,
                    "result": null
                };
                $.ajax({
                    dataType: 'json',
                    url: self.url + url_suffix,
                    async: false,
                    contentType: "application/json",
                    type: method,
                    data: JSON.stringify(json_data),
                    success: function(dt) {
                        ret.success = true;
                        ret.result = dt;
                    },
                    error: function(dt) {
                        ret.success = false;
                        ret.result = dt;
                        alert(JSON.stringify(dt));
                    }
                });
                return ret;
            },

            save_local: function(item, data){
                localStorage.setItem(item, data);
                this.load_local_storage();
            }

        },
        ready: function() {
            // console.log("ready function")
            // alert("vai startar notificacao");
            // startNotifications();
            // alert("startou notificacao");
            var login_success = this.login();
        }
    })
}
