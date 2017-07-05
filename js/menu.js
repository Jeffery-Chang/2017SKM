var menuCtrl = {
    init: function(){
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