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
        
        if($this.chkIE8() === 'IE8'){
            location.href = 'ie8/';
            return;
        }

        $this.menuSet();
        $this.resize();
        $this.starSet();
        if(menuCtrl.chkWebview()) $('.warn').show();

        $(window).on('resize', function(){
            $this.resize();
            $this.starSet();
        });
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
                    trackWaitJump('', 'activity.html');
                    break;
                case 2:
                    trackWaitJump('', 'general.html');
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
    starSet: function(){
        var starList = ['one', 'two', 'three', 'four'];
        var obj = $('.main .meteor span');

        if($(window).width() > 600){
            $.each(obj, function(index, obj){
                $(obj).addClass(starList[index]);
            });
        }else{
            $.each(obj, function(index, obj){
                $(obj).removeClass(starList[index]);
            });
        }
    },
    resize: function(){
        if($(window).width() > 600){
            $('header nav').show();
            $('.menu').removeClass('open');
            resizeFG = false;
        }else{
            if(!$('.menu').hasClass('open')) $('header nav').hide();
            resizeFG = true;
        }
    },
    preventAll: function(event){
        event.stopPropagation();
        event.preventDefault();
    },
    fbLogin: function(obj){
        var $this = this;
        if (obj !== void 0) obj.click(function(e){ $this.preventAll(e); });

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
                            (innerFG) ? $('.pop.login .close').click() : $('.pop .close').click();
                        }
                    );
                }else{
                    alert('請登入FB/G+來進行投票，謝謝！');
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

            // 串接G+登入按鈕
            obj.on('click', function(e){
                $this.preventAll(e);
                auth2.signIn().then(function(user){
                    var gProfile = user.getBasicProfile();
                    if(gProfile){
                        $.cookie('type', 'Google');
                        $.cookie('name', gProfile.getName());
                        $.cookie('email', gProfile.getEmail());
                        $.cookie('id', gProfile.getId());
                        $.cookie('gplus_login', true);
                        gplus_login = true;
                        (innerFG) ? $('.pop.login .close').click() : $('.pop .close').click();
                    }else{
                        //alert('請登入Facebook或Google+來進行投票，謝謝！ G+');
                    }
                });
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
    sendData: function(cb){
        if (cb === void 0) { cb = null; }
        var pass = grecaptcha.getResponse();
        var sendType, sendName, sendEmail, sendId, sendChoose, sendGoogle, data;
        if(pass.length === 0){
            alert('請使用google驗證!');
            return;
        }

        sendType = $.cookie('type');
        sendName = $.cookie('name');
        sendEmail = $.cookie('email');
        sendId = $.cookie('id');
        sendChoose = $.cookie('choose1') + ',' + $.cookie('choose2') + ',' + $.cookie('choose3');

        data = {
            type: sendType,
            name: sendName,
            email: sendEmail,
            uid: sendId,
            type: sendType,
            choose: sendChoose,
            google: pass
        }

        console.log('data:', data);

        $.ajax({
            method: "POST",
            url: 'api/vote',
            data: data,
            success: function(result){
                console.log('status:', result.status);
                if(result.status == '200'){
                    console.log('投票成功！');
                }else if(result.status == '100'){
                    console.log('google驗證失敗！');
                }else if(result.status == '110'){
                    //alert('您今日已完成投票!\n\n每個FB/G+帳號，一天可投一票，天天投票，中獎機率越高\n微笑新星們期待您的再訪支持！');
                    console.log('該id已投過票！');
                }else if(result.status == '120'){
                    console.log('登入帳號非FB/G+！');
                }

                $.removeCookie('choose1');
                $.removeCookie('choose2');
                $.removeCookie('choose3');

                if (cb) cb();
            },
            error: function(result){
                alert('系統繁忙，請稍候再試，謝謝！');
            }
        });
    },
    chkDevice: function(tp){
        var chk_fg = false;
        if(isMobile.phone || isMobile.tablet || ($(window).width() <= 600 && tp === 1)){
            chk_fg = true;
        }
        return chk_fg;
    },
    chkWebview: function(){
        var userAgent = window.navigator.userAgent.toLowerCase();
        var fbWebView = /fbid|fbios|fblc|fb_iab|fb4a|fbav/.test(userAgent);
        var lineWebView = /line/i.test(userAgent);
        return fbWebView || lineWebView;
    },
    chkIE8: function(){
        var userAgent = navigator.userAgent;
        var fIEVersion = parseFloat(RegExp["$1"]); 
        
        if(userAgent.indexOf('MSIE 6.0')!=-1){
            return "IE6";
        }else if(fIEVersion == 7){
            return "IE7";
        }else if(fIEVersion == 8){
            return "IE8";
        }else if(fIEVersion == 9){
            return "IE9";
        }else if(fIEVersion == 10){
            return "IE10";
        }else if(userAgent.toLowerCase().match(/rv:([\d.]+)\) like gecko/)){ 
            return "IE11";
        }else{
            return "0"
        }
    }
}

$(function(){
    menuCtrl.init();
});