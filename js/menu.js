(function(d, s, id) {
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) return;
    js		= d.createElement(s); 
    js.id	= id;
    js.src	= "//connect.facebook.net/zh_TW/all.js#xfbml=1";
    fjs.parentNode.insertBefore(js, fjs);
    window.fbAsyncInit = function() {
        FB.init({
            appId      : '142220039665931',
            xfbml      : true,
            version    : 'v2.9'
        });
    };
}(document, 'script', 'facebook-jssdk'));

var menuCtrl = {
    init: function(){
        var $this = this;

        $this.menuSet();
    },
    menuSet: function(){
        var $this = this;
        $('.menu').on('click',function(e){
            $this.preventAll(e);
            $(this).toggleClass('open');
            $('header nav').fadeToggle('fast');
        });

        $('header nav li').on('click', function(e){
            $this.preventAll(e);
            var menuIndex = $(this).index();
            switch (menuIndex){
                case 0:
                    trackWaitJump('', 'index.html');
                    break;
                case 1:
                    trackWaitJump('', '');
                    break;
                case 2:
                    trackWaitJump('', '');
                    break;
                case 3:
                    trackWaitJump('', '');
                    break;
                case 4:
                    gaclick('fb_share');
                    $this.shareFB();
                    break;
                case 5:
                    gaclick('gplus_share');
                    $this.shareGplus();
                    break;
                             }
        });
    },
    preventAll: function(event){
        event.stopPropagation();
        event.preventDefault();
    },
    fbLogin: function(){
        var $this = this;

        // 串接FB登入按鈕
        FB.login(
            function(response) {
                if(response.status === 'connected'){
                    FB.api(
                        '/me',
                        'GET', {
                            "fields": "id,name,email"
                        },
                        function (response) {
                            $.cookie('type', 'Facebook');
                            $.cookie('name', response.name);
                            $.cookie('email', response.email);
                            $.cookie('id', response.id);
                            $.cookie('fb_login', true);
                            fb_login = true;
                            $('.pop .close').click();
                        }
                    );
                }else{
                    alert('請登入Facebook或Google來進行投票，謝謝！');
                }
            },{ scope: 'email' }
        );
    },
    googleLogin: function(obj){
        var $this = this;
        gapi.load("auth2", function(){
            var auth2 = gapi.auth2.init({
                clientId: "704654834388-ta2hrensur0tun55pajn8md8ht02rs2s.apps.googleusercontent.com"
            });

            auth2.isSignedIn.listen(function(status){
                //console.log('google login ' + status);
            });

            auth2.currentUser.listen(function(user){
                var gProfile = user.getBasicProfile();
                if(gProfile){
                    console.log('gName:', gProfile.getName());
                    console.log('gEmail:', gProfile.getEmail());
                    console.log('gID:', gProfile.getId());

                    $.cookie('type', 'Google');
                    $.cookie('name', gProfile.getName());
                    $.cookie('email', gProfile.getEmail());
                    $.cookie('id', gProfile.getId());
                    $.cookie('gplus_login', true);
                    gplus_login = true;
                    $('.pop .close').click();
                }else{
                    //alert('請登入Facebook或Google+來進行投票，謝謝！ G+');
                }
            });

            // 串接G+登入按鈕
            obj.on('click', function(e){
                $this.preventAll(e);
                auth2.signIn();
            });
        });
    },
    shareFB: function(){
        var $this = this;
        var fb_url = ($this.chkDevice()) ? 'http://m.facebook.com/sharer.php?u=' : 'http://www.facebook.com/sharer/sharer.php?s=100&p[url]=';
        var fbBack_url = '?fb_back=1';
        var share_u;
        share_u = location.href + fbBack_url;
        window.open(fb_url + encodeURIComponent(share_u), 'sharer', 'toolbar=0,status=0,width=656,height=436');
    },
    shareGplus: function(){
        var gplus_url = 'https://plus.google.com/share?url=';
        var gplusBack_url = '?gplus_back=1';
        var share_u;
        share_u = location.href + gplusBack_url;
        window.open(gplus_url + encodeURIComponent(share_u), 'sharer', 'toolbar=0,status=0,width=656,height=436');
    },
    chkDevice: function(){
        var chk_fg = false;
        if(isMobile.phone || isMobile.tablet){
            chk_fg = true;
        }
        return chk_fg;
    }
}

$(function(){
    menuCtrl.init();
});