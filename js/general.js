$(function(){
    var generalCtrl = new Vue({
        el: '.wrap',
        data: {
            items: profile,
            fb_login: false,
            gplus_login: false,
            closeFG: false,
            sortFG: false,
            loginFG: false,
            moreFG: false,
            voteFG: false
        },
        beforeMount: function(){

        },
        mounted: function(){
            //$('a').click(function(e){ e.preventDefault(); });
            this.chkChoose();
        },
        methods:{
            openSort: function(){
                this.sortFG = !this.sortFG;
            },
            prevent: function(obj){
                obj.click(function(e){ 
                    e.preventDefault();
                    e.stopPropagation();
                });
            },
            seeMore: function(obj, key){
                this.prevent(obj);
                var setObj = $('.personal');
                var group = '';
                var data = this.items;
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

                (data[key].img4 === '') ? $('.personal .photo_block li:eq(3)').addClass('none').hide() : $('.personal .photo_block li:eq(3)').removeClass('none').show();

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

                    if(index > $('.personal .photo_block li:not(.none)').size()) index = 1;
                    TweenMax.to($('.personal .photo_block img'), .3, {
                        opacity: 0,
                        onComplete: function(){
                            $('.personal .photo_block img').attr('src', 'img/store/'+profile[key].store_no+'_'+profile[key].store_tp+'_0'+index+'.jpg');
                            TweenMax.to($('.personal .photo_block img'), .3, {opacity: 1});
                        }
                    });
                });

                this.moreFG = true;
                this.closeFG = true;
            },
            getVote: function(obj, key){
                this.prevent(obj);
                if(!this.fb_login && !this.gplus_login){
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
            confirmChoose: function(){
                var $this = this;
                if($(this).hasClass('no')) return;
                var finalObj = $('.finalCheck li');
                var finalArr = [$.cookie('choose1'), $.cookie('choose2'), $.cookie('choose3')];

                $.each(finalArr, function(key, obj){
                    finalObj.eq(key).find('img').attr('src', profile[finalArr[key]].img1);
                    finalObj.eq(key).find('h1').text(profile[finalArr[key]].name).append('<span>'+profile[finalArr[key]].store_nm+'</span>');

                    if(key === (finalArr.length - 1)) $this.voteFG = $this.closeFG = true;
                });
            },
            finalCheck: function(obj){
                this.prevent(obj);
                menuCtrl.sendData(function(){
                    $('.final_check .finalCheck').fadeOut('fast', function(){
                        $('.final_check .beenVote').fadeIn('fast');
                    });
                });
            },
            closeAll: function(obj){
                this.prevent(obj);
                this.closeFG = this.sortFG = this.loginFG = this.moreFG = this.voteFG = false;
            }
        }
    });
});