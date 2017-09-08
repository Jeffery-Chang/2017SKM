(function(a){a.getUrlParam=function(b){var c=new RegExp("(^|&)"+b+"=([^&]*)(&|$)"),d=window.location.search.substr(1).match(c);return null==d?null:unescape(d[2])}})(jQuery);
$(function(){
    var generalCtrl = new Vue({
        el: '.wrap',
        data: {
            items: profile,
            sortTP: true,
            scaleFG: false,
            fb_login: ($.cookie('fb_login')) ? true : false,
            gplus_login: ($.cookie('gplus_login')) ? true : false,
            closeFG: false,
            innerFG: false,
            sortFG: false,
            loginFG: false,
            moreFG: false,
            voteFG: false
        },
        beforeMount: function(){
            var $this = this;
            $.get('../api/angel_list', function(result){
                $.each(result, function(key, obj){
                    $this.items[key].vote_cnt = obj.vote_cnt;
                });
            });
        },
        mounted: function(){
            var $this = this;
            var tag = $.getUrlParam('tag');

            $('.progress li').on('click', function(e){
                menuCtrl.preventAll(e);
                var index = $(this).index() - 1;
                $('html,body').stop().animate({
                    scrollTop: $('.group:eq('+index+')').offset().top - 75
                }, 500);
            });

            $('.final_check .beenVote .votebtn').on('click', function(e){
                menuCtrl.preventAll(e);
                trackWaitJump('ok_goback', 'index.html');
            });

            $('.warn .close').on('click', function(e){
                menuCtrl.preventAll(e);
                $(this).parent('div').fadeOut('fast');
            });

            $(window).on('load', function(){
                $('header, .wrap').attr('style', '');
                $('.loading').delay(1000).fadeOut('fast', function(){
                    if(tag !== null){
                        $('html,body').delay(500).stop().animate({
                            scrollTop: $('.group:eq('+tag+')').offset().top - 75
                        }, 500);
                    }
                });
                gapi.load("auth2", function(){
                    var auth2 = gapi.auth2.init({
                        clientId: "704654834388-ta2hrensur0tun55pajn8md8ht02rs2s.apps.googleusercontent.com"
                    });

                    $('.pop.login .login_google').on('click', function(e){
                        menuCtrl.preventAll(e);

                        gaclick('login_google');

                        auth2.signIn().then(function(user){
                            var gProfile = user.getBasicProfile();
                            if(gProfile){
                                $.cookie('type', 'Google');
                                $.cookie('name', gProfile.getName());
                                $.cookie('email', gProfile.getEmail());
                                $.cookie('id', gProfile.getId());
                                $.cookie('gplus_login', true);
                                $this.gplus_login = true;
                                $this.closeAll();
                            }else{
                                //alert('請登入Facebook或Google+來進行投票，謝謝！ G+');
                            }
                        });
                    });
                });
            });

            this.chkChoose();

            gapage('votelist');
        },
        updated: function(){
            var $this = this;
            if($this.scaleFG){
                $this.scaleFG = false;
                TweenMax.to($('.general .voteRepeat'), .3, {
                    scale: 0,
                    onComplete: function(){
                        TweenMax.to($('.general .voteRepeat'), .3, { scale: 1 });
                    }
                });
            }
        },
        methods:{
            fbLogin: function(evt){
                var $this = this;
                menuCtrl.preventAll(evt);

                gaclick('login_fb');

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
                                    $this.fb_login = true;
                                    $this.closeAll(evt);
                                }
                            );
                        }else{
                            // alert('請登入FB/G+來進行投票，謝謝！');
                        }
                    },{ scope: 'email' }
                );
            },
            openSort: function(evt){
                menuCtrl.preventAll(evt);
                this.sortFG = !this.sortFG;
            },
            sortData: function(evt){
                menuCtrl.preventAll(evt);
                var $this = this;
                var tp = evt.target.htmlFor;
                var sortData = $this.items;
                var newData = [];
                var oldFG = $this.sortTP;

                sortData.forEach(function(ele, key){
                    newData.push(ele);
                });

                if(tp === 'checkbox-2'){
                    this.sortTP = true;
                    if(oldFG === $this.sortTP) return;

                    newData.sort(function (a, b) {
                        return a.store_no > b.store_no ? 1 : -1;
                    });
                }else{
                    this.sortTP = false;
                    if(oldFG === $this.sortTP) return;

                    newData.sort(function (a, b) {
                        return a.vote_cnt < b.vote_cnt ? 1 : -1;
                    });
                }

                $this.scaleFG = true;
                $this.items = newData;
            },
            seeMore: function(evt){
                menuCtrl.preventAll(evt);
                var $this = this;
                var setObj = $('.personal');
                var group = '';
                var key = $(evt.target.offsetParent).attr('index');
                var name = profile[key].name;
                var tp = profile[key].store_tp;
                var url = 'https://' + location.hostname + location.pathname.split("?")[0].replace('general', 'index') + '?name=' + name;

                if(tp === 'A'){
                    group = '自營組';
                }else if(tp === 'B'){
                    group = '專櫃組';
                }else if(tp === 'C'){
                    group = '警衛清潔組';
                };

                (profile[key].img4 === '') ? $('.personal .photo_block li:eq(3)').hide() : $('.personal .photo_block li:eq(3)').show();

                $('.personal .photo_block img').attr('src', 'img/store/'+profile[key].store_no+'_'+profile[key].store_tp+'_02.jpg');
                $('.personal .photo_block li').find('a').removeClass('focus').eq(0).addClass('focus');

                $('.personal .photo_block li').off('click');
                $('.personal .votebtn').off('click');

                setObj.find('h1').text(profile[key].name).append('<span>'+profile[key].store_nm+' / '+profile[key].career_nm+'</span>');
                setObj.find('h2').text(profile[key].service_words);
                setObj.find('.tag').text(group);
                setObj.find('.vote_cnt').text(profile[key].vote_cnt);
                setObj.find('.votebtn').data('index', profile[key].index).data('type', profile[key].store_tp);
                setObj.find('.fb_comment').html('<fb:comments href="'+url+'" num_posts="5" width="100%"></fb:comments>')
                FB.XFBML.parse(setObj.find('.fb_comment')[0]);

                // 看更多個人資料照片click+初始click
                $('.personal .photo_block li').on('click', function(e){
                    menuCtrl.preventAll(e);
                    if($(this).find('a').hasClass('focus')) return;

                    var index = $(this).index() + 2; // 從第2張開始

                    $('.personal .photo_block li').find('a').removeClass('focus');
                    $(this).find('a').addClass('focus');

                    if(index > $('.personal .photo_block li:visible').size()) index = 1;
                    TweenMax.to($('.personal .photo_block img'), .3, {
                        opacity: 0,
                        onComplete: function(){
                            $('.personal .photo_block img').attr('src', 'img/store/'+profile[key].store_no+'_'+profile[key].store_tp+'_0'+index+'.jpg');
                            TweenMax.to($('.personal .photo_block img'), .3, {opacity: 1});
                        }
                    });
                });

                // 看更多投他一票click
                $('.personal .votebtn').on('click', function(e){
                    menuCtrl.preventAll(e);
                    $this.getVote(evt, true);
                });

                $this.moreFG = true;
                $this.closeFG = true;
            },
            getVote: function(evt, inn){
                menuCtrl.preventAll(evt);

                if(!menuCtrl.timesUp()){
                    alert('此投票活動已結束，感謝您的熱情參與！');
                    return;
                }

                if(!this.fb_login && !this.gplus_login){
                    if(inn) this.innerFG = true;
                    this.loginFG = this.closeFG = true;
                    return;
                }

                $.each(this.items, function(index, obj){
                    obj.chooseFG = false;
                });

                var key = $(evt.target).parents('.btnVote').attr('index');
                this.chkChoose(key);
            },
            chkChoose: function(key){
                var $this = this;

                if(!menuCtrl.timesUp()){
                    alert('此投票活動已結束，感謝您的熱情參與！');
                    return;
                }

                var tp = (key !== undefined) ? profile[key].store_tp : '';
                if(tp === 'A'){
                    $.cookie('choose1', key);
                }else if(tp === 'B'){
                    $.cookie('choose2', key);
                }else if(tp === 'C'){
                    $.cookie('choose3', key);
                }

                var choose1 = $.cookie('choose1');
                var choose2 = $.cookie('choose2');
                var choose3 = $.cookie('choose3');
                var chooseList = [choose1, choose2, choose3];

                $.each(chooseList, function(num, obj){
                    $.each($this.items, function(sort, item){
                        if(item.index == obj) item.chooseFG = true;
                    });
                });

                (choose1) ? $('.progress .icon-checkmark:eq(0)').removeClass('unfinish') : $('.progress .icon-checkmark:eq(0)').addClass('unfinish');
                (choose2) ? $('.progress .icon-checkmark:eq(1)').removeClass('unfinish') : $('.progress .icon-checkmark:eq(1)').addClass('unfinish');
                (choose3) ? $('.progress .icon-checkmark:eq(2)').removeClass('unfinish') : $('.progress .icon-checkmark:eq(2)').addClass('unfinish');

                this.closeFG = this.sortFG = this.loginFG = this.moreFG = this.voteFG = false;
                if(!choose1 || !choose2 || !choose3) return;
                $('.progress .finish').removeClass('no');
            },
            confirmChoose: function(evt){
                menuCtrl.preventAll(evt);
                var $this = this;
                if(!$.cookie('choose1') || !$.cookie('choose2') || !$.cookie('choose3')) return;
                
                if(!menuCtrl.timesUp()){
                    alert('此投票活動已結束，感謝您的熱情參與！');
                    return;
                }
                
                var finalObj = $('.finalCheck li');
                var finalArr = [$.cookie('choose1'), $.cookie('choose2'), $.cookie('choose3')];

                $.each(finalArr, function(key, obj){
                    finalObj.eq(key).find('img').attr('src', profile[finalArr[key]].img1);
                    finalObj.eq(key).find('h1').text(profile[finalArr[key]].name).append('<span>'+profile[finalArr[key]].store_nm+'</span>');

                    if(key === (finalArr.length - 1)) $this.voteFG = $this.closeFG = true;
                });

                gaclick('vote_go');
            },
            finalCheck: function(evt){
                menuCtrl.preventAll(evt);
                menuCtrl.sendData(function(){
                    $('.final_check .finalCheck, .final_check .close').fadeOut('fast', function(){
                        $('.final_check .beenVote').fadeIn('fast');
                    });
                });
            },
            closeAll: function(evt, gaEvt){
                if(evt) menuCtrl.preventAll(evt);
                if(this.innerFG){
                    this.innerFG = this.loginFG = false;
                }else{
                    if(gaEvt) gaclick(gaEvt);
                    this.closeFG = this.sortFG = this.loginFG = this.moreFG = this.voteFG = false;
                }
            }
        }
    });
});