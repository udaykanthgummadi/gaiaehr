//<debug>
Ext.Loader.setPath({
    'Ext': 'touch/src',
    'App': 'app'
});
//</debug>
Ext.application({
    name: 'App',

    requires: [
        'Ext.direct.*',
        'Ext.device.*',
        'Ext.List',
        'Ext.MessageBox',
        'Ext.plugin.ListPaging',
        'Ext.plugin.PullRefresh',
        'Ext.carousel.Carousel',
        'App.view.Login',
        'App.view.MainPhone'
    ],

    controllers: ['Main','Login','Navigation'],

    views: ['Login', 'MainTablet', 'MainTablet'],

    stores: ['Patients'],

    icon: {
        '57': 'resources/icons/Icon.png',
        '72': 'resources/icons/Icon~ipad.png',
        '114': 'resources/icons/Icon@2x.png',
        '144': 'resources/icons/Icon~ipad@2x.png'
    },

    isIconPrecomposed: true,

    startupImage: {
        '320x460': 'resources/startup/320x460.jpg',
        '640x920': 'resources/startup/640x920.png',
        '768x1004': 'resources/startup/768x1004.png',
        '748x1024': 'resources/startup/748x1024.png',
        '1536x2008': 'resources/startup/1536x2008.png',
        '1496x2048': 'resources/startup/1496x2048.png'
    },

    launch: function() {
        App.isNative = (Ext.device.Device.platform == 'Android' || Ext.device.Device.platform == 'iOS');
        App.MsgOk = function(title, msg, callback){
            if(App.isNative){
                navigator.notification.alert(msg,function(){
                    if(typeof callback == 'function') callback();
                }, title, 'Ok');
            }else{
                Ext.Msg.alert(title, msg, function(btn){
                    if(typeof callback == 'function') callback(btn);
                });
            }

        };

        App.MsgOkCancel = function(title, msg, callback){
            if(App.isNative){
                navigator.notification.confirm(msg, function(buttonIndex){
                    var btn = buttonIndex == 1 ? 'yes' :'no';
                    if(typeof callback == 'function') callback(btn);
                }, title);
            }else{
                Ext.Msg.confirm(title, msg, function(btn){
                    if(typeof callback == 'function') callback(btn);
                });
            }
        };

        Ext.override(Ext.direct.RemotingProvider, {
            getCallData: function(transaction) {
                return {
                    action: transaction.getAction(),
                    method: transaction.getMethod(),
                    data: transaction.getData(),
                    type: 'rpc',
                    tid: transaction.getId(),
                    server: App.app.server
                };
            }
        });

        Ext.Direct.on('exception', function(event) {
            Ext.Viewport.unmask();
            say({Type:'Exception',Message:event.config.message,Where:event.config.where});
            App.MsgOk('Oops!', event.config.message, Ext.emptyFn);
        });

        App.app.isPhone = Ext.os.deviceType == 'Phone';
        if(window.location.href){
            App.app.server = Ext.Object.fromQueryString(window.location.search);
            App.app.server.url = window.location.href.replace('_aire/'+window.location.search, '');
            App.app.server.router = App.app.server.url+'data/restRouter.php';
            App.app.server.pvtKey = '8BAR-NYRB-8R9E-RFYW-EGOV';
        }


        // Destroy the #appLoadingIndicator element
        Ext.fly('appLoadingIndicator').destroy();

        // Initialize the main view
        Ext.Viewport.add(Ext.create('App.view.Login',{
            border: !App.app.isPhone ? 5 : 0,
            style: !App.app.isPhone ? 'border-color: black; border-style: solid; border-radius: 5px' : '',
            modal: !App.app.isPhone,
            centered: !App.app.isPhone,
            width: App.app.isPhone ? '100%' : 520,
            height: App.app.isPhone ? '100%' : 440
        }));
    },

    onUpdated: function() {
        Ext.Msg.confirm(
            "Application Update",
            "This application has just successfully been updated to the latest version. Reload now?",
            function(buttonId) {
                if (buttonId === 'yes') {
                    window.location.reload();
                }
            }
        );
    }
});
