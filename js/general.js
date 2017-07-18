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
            $.get('api/angel_list', function(result){
                $.each(result, function(key, obj){
                    $this.items[key].vote_cnt = obj.vote_cnt;
                });
            });
        },
        mounted: function(){
            $('.progress a').on('click', function(e){
                menuCtrl.preventAll(e);
            });
            this.chkChoose();
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
                            alert('請登入FB/G+來進行投票，謝謝！');
                        }
                    },{ scope: 'email' }
                );
            },
            googleLogin: function(evt){
                var $this = this;
                menuCtrl.preventAll(evt);
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
                            $this.gplus_login = true;
                            $this.closeAll(evt);
                        }else{
                            //alert('請登入Facebook或Google+來進行投票，謝謝！ G+');
                        }
                    });
                    auth2.signIn();
                });
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

                Object.assign(sortData).forEach(function(ele, key){
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
            seeMore: function(evt, key){
                menuCtrl.preventAll(evt);
                var $this = this;
                var setObj = $('.personal');
                var group = '';
                var data = $this.items;
                var name = data[key].name;
                var tp = data[key].store_tp;
                var url = 'http://' + location.hostname + location.pathname.split("?")[0] + '?name=' + name;

                if(tp === 'A'){
                    group = '自營組';
                }else if(tp === 'B'){
                    group = '專櫃組';
                }else if(tp === 'C'){
                    group = '警衛清潔組';
                };

                (data[key].img4 === '') ? $('.personal .photo_block li:eq(3)').hide() : $('.personal .photo_block li:eq(3)').show();

                $('.personal .photo_block img').attr('src', 'img/store/'+data[key].store_no+'_'+data[key].store_tp+'_02.jpg');
                $('.personal .photo_block li').find('a').removeClass('focus').eq(0).addClass('focus');

                $('.personal .photo_block li').off('click');
                $('.personal .votebtn').off('click');

                setObj.find('h1').text(data[key].name).append('<span>'+data[key].store_nm+' / '+data[key].career_nm+'</span>');
                setObj.find('h2').text(data[key].service_words);
                setObj.find('.tag').text(group);
                setObj.find('.vote_cnt').text(data[key].vote_cnt);
                setObj.find('.votebtn').data('index', data[key].index).data('type', data[key].store_tp);
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
                            $('.personal .photo_block img').attr('src', 'img/store/'+data[key].store_no+'_'+data[key].store_tp+'_0'+index+'.jpg');
                            TweenMax.to($('.personal .photo_block img'), .3, {opacity: 1});
                        }
                    });
                });

                // 看更多投他一票click
                $('.personal .votebtn').on('click', function(e){
                    var index = $(this).data('index');
                    $this.getVote(e, index, true);
                });

                $this.moreFG = true;
                $this.closeFG = true;
            },
            getVote: function(evt, key, inn){
                menuCtrl.preventAll(evt);
                if(!this.fb_login && !this.gplus_login){
                    if(inn) this.innerFG = true;
                    this.loginFG = this.closeFG = true;
                    return;
                }
                this.chkChoose(key);
            },
            chkChoose: function(key){
                var tp = (key) ? this.items[key].store_tp : '';
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

                (choose1) ? $('.progress .icon-checkmark:eq(0)').removeClass('unfinish') : $('.progress .icon-checkmark:eq(0)').addClass('unfinish');
                (choose2) ? $('.progress .icon-checkmark:eq(1)').removeClass('unfinish') : $('.progress .icon-checkmark:eq(1)').addClass('unfinish');
                (choose3) ? $('.progress .icon-checkmark:eq(2)').removeClass('unfinish') : $('.progress .icon-checkmark:eq(2)').addClass('unfinish');

                if(!choose1 || !choose2 || !choose3) return;
                $('.progress .finish').removeClass('no');
            },
            confirmChoose: function(evt){
                menuCtrl.preventAll(evt);
                var $this = this;
                if(!$.cookie('choose1') || !$.cookie('choose2') || !$.cookie('choose3')) return;
                var finalObj = $('.finalCheck li');
                var finalArr = [$.cookie('choose1'), $.cookie('choose2'), $.cookie('choose3')];

                $.each(finalArr, function(key, obj){
                    finalObj.eq(key).find('img').attr('src', profile[finalArr[key]].img1);
                    finalObj.eq(key).find('h1').text(profile[finalArr[key]].name).append('<span>'+profile[finalArr[key]].store_nm+'</span>');

                    if(key === (finalArr.length - 1)) $this.voteFG = $this.closeFG = true;
                });
            },
            finalCheck: function(evt){
                menuCtrl.preventAll(evt);
                menuCtrl.sendData(function(){
                    $('.final_check .finalCheck').fadeOut('fast', function(){
                        $('.final_check .beenVote').fadeIn('fast');
                    });
                });
            },
            closeAll: function(evt){
                menuCtrl.preventAll(evt);
                if(this.innerFG){
                    this.innerFG = this.loginFG = false;
                }else{
                    this.closeFG = this.sortFG = this.loginFG = this.moreFG = this.voteFG = false;
                }
            }
        }
    });
});