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

function startNotificationEngine(){
    //Unregister the previous token because it might have become invalid. Unregister everytime app is started.
    window.plugins.pushNotification.unregister(successHandler, errorHandler);

    if(intel.xdk.device.platform == "Android")
    {
        //register the user and get token
        window.plugins.pushNotification.register(
        successHandler,
        errorHandler,
        {
            //senderID is the project ID
            //34709960635
            "senderID":"firebase-pibex2015",
            //callback function that is executed when phone recieves a notification for this app
            "ecb":"onNotification"
        });
    }
    else if(intel.xdk.device.platform == "iOS")
    {
        //register the user and get token
        window.plugins.pushNotification.register(
        tokenHandler,
        errorHandler,
        {
            //allow application to change badge number
            "badge":"true",
            //allow application to play notification sound
            "sound":"true",
            //register callback
            "alert":"true",
            //callback function name
            "ecb":"onNotificationAPN"
        });
    }
}

//app given permission to receive and display push messages in Android.
function successHandler (result) {
    alert('result = ' + result);
}

//app denied permission to receive and display push messages in Android.
function errorHandler (error) {
    alert('error = ' + error);
}

//App given permission to receive and display push messages in iOS
function tokenHandler (result) {
    // Your iOS push server needs to know the token before it can push to this device
    // here is where you might want to send the token to your server along with user credentials.
    alert('device token = ' + result);
    tokenID = result;
}

//fired when token is generated, message is received or an error occured.
function onNotification(e)
{
    switch( e.event )
    {
        //app is registered to receive notification
        case 'registered':
            if(e.regid.length > 0)
            {
                // Your Android push server needs to know the token before it can push to this device
    // here is where you might want to send the token to your server along with user credentials.

                alert('registration id = '+e.regid);
                tokenID = e.regid;
            }
            break;

        case 'message':
          //Do something with the push message. This function is fired when push message is received or if user clicks on the tile.
          alert('message = '+e.message+' msgcnt = '+e.msgcnt);
        break;

        case 'error':
          alert('GCM error = '+e.msg);
        break;

        default:
          alert('An unknown GCM event has occurred');
          break;
    }
}

//callback fired when notification received in iOS
function onNotificationAPN (event)
{
    if ( event.alert )
    {
        //do something with the push message. This function is fired when push message is received or if user clicks on the tile.
        alert(event.alert);
    }

    if ( event.sound )
    {
        //play notification sound. Ignore when app is in foreground.
        var snd = new Media(event.sound);
        snd.play();
    }

    if ( event.badge )
    {
        //change app icon badge number. If app is in foreground ignore it.
        window.plugins.pushNotification.setApplicationIconBadgeNumber(successHandler, errorHandler, event.badge);
    }
}

//*********** END NOTIFICATIONS ***********//

function startNotifications(){
    var push = PushNotification.init({
    android: {
        // app-ifpe credencial "AIzaSyD8kni8MmwzMhSnp_QDSJBxEvi2xi-8HUo"
        senderID: "154417747729"
    },
    browser: {
        pushServiceURL: 'http://push.api.phonegap.com/v1/push'
    },
    ios: {
        alert: "true",
        badge: "true",
        sound: "true"
    },
    windows: {}
});

push.on('registration', function(data) {
    alert(data.registrationId);
});

push.on('notification', function(data) {
    alert(JSON.stringify(data));
    // data.message,
    // data.title,
    // data.count,
    // data.sound,
    // data.image,
    // data.additionalData
});

push.on('error', function(e) {
    alert(e.message);
});
}

function onDeviceReady() {
//    startNotifications();
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
            getPosts: function() {

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
