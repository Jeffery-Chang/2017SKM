(function(a){a.preload=function(){var c=[],b=arguments.length;for(;b--;){c.push(a("<img />").attr("src",arguments[b]));}};})(jQuery);

var home1 = $('.part1.earth .house_layer_1');
var home2 = $('.part1.earth .house_layer_2');
var home3 = $('.part1.earth .house_layer_3');
var earth = $('.part1.earth .land');
var title = $('.part1 h1');
var redword = $('.part1 h2');
var content = $('.part1 .pc_only, .part1 .m_only');
var startBtn = $('.part1 .btn');
var indexBtn = $('.part1 .btn, .part1 .dropdown');
var planet1 = $('.part1 .planet.p_1');
var planet2 = $('.part1 .planet.p_2');
var planet3 = $('.part1 .planet.p_3');

var flyman = $('.flyman');

var rocket = $('.part1 .rocket');
var satellite = $('.part1 .satellite');

var planetObj = $('.part2 .planetBox ul');
var three = $('.part2 .slick');
var threeLocation = $('.vote .location_name');
var vote_box = $('.part2.vote .vote_box');

var delayTime = .75;
var wheelPos = "top";
var fb_login = ($.cookie('fb_login')) ? true : false;
var gplus_login = ($.cookie('gplus_login')) ? true : false;
var popupOpen = false;
var resizeFG = false;
var innerFG = false;

var store_fg = false;
var store_number = 0;

var indexCtrl = {
    init: function(){
        var $this = this;

        $.each(profile, function(key, obj){ $.preload(obj.img1); });

        $this.updateData();
        $this.initSlick();
        $this.initRA();

        // 選分店
        $(".dropdown dt a").on('click', function(e) {
            menuCtrl.preventAll(e);
            $(".dropdown dd ul").slideToggle('fast');
        });

        $(".dropdown dd ul li").on('click', function(e) {
            menuCtrl.preventAll(e);
            var storeNM = $(this).find('a').text();
            var storeIndex = $(this).index();
            store_number = storeIndex;
            store_fg = true;
            $(".dropdown dt a").text(storeNM);
            $(".dropdown dd ul").hide();
        });

        /*startBtnPC.find('a').on('click', function(e){
            menuCtrl.preventAll(e);
            $this.outStage();
        });*/

        startBtn.click(function(e) {
            menuCtrl.preventAll(e);

            if(!menuCtrl.timeLimit()){
                alert('現在投票還沒有開始喔！\n\n請於\n106年 8月  7日（一）11:00～\n106年 8月20日（日）23:59\n\n蒞臨本站一天一票，支持您心目中的候選人！');
                return;
            }

            if(!menuCtrl.timesUp()){
                alert('此投票活動已結束，感謝您的熱情參與！');
                return;
            }

            if(!store_fg){
                alert('請先選擇分店！');
                return;
            }
            $this.outStage();
            $('.part1 .btn .shape').toggleClass('shape_border');
        });


        // all popup關閉
        $('.pop .close, .store_list .close, .warn .close').on('click', function(e){
            menuCtrl.preventAll(e);
            popupOpen = false;
            var closeClass = $(this).parent('div').attr('class');

            if(closeClass.indexOf('login') > -1) gaclick('login_x');
            if(closeClass.indexOf('final_check') > -1) gaclick('vote_go_x');

            $(this).parent('div').fadeOut('fast', function(){
                $('.store_list').css('z-index', 501);
            });

            (innerFG) ? $('.pop_black').fadeOut('fast') : $('.black').fadeOut('fast');
            innerFG = false;
        });

        $(window).on('resize', function(){
            $this.indexResize();
        }).on('load', function(){
            $('header, .wrap').css('opacity', 1);
            $this.inStage();
            $this.indexResize();

            if(!menuCtrl.chkDevice()) {
                TweenMax.from(rocket, 2, {
                    top: "30%",
                    left: "50%",
                    opacity: 0,
                    delay: .35,
                    transform: "scale(.5) rotate(-90deg)",
                    delay: delayTime,
                    ease: Power2.easeOut,
                    onComplete: function(){
                        TweenMax.set(rocket, { clearProps:"all" });
                    }
                });
            }

            $('.loading').delay(300).fadeOut('fast');
        });

        gapage('index');
    },
    indexResize: function(){
        if($(window).width() > 600){
            flyman.addClass('move');
        }else{
            wheelPos = 'mobile';
            flyman.removeClass('move');
        }
    },
    updateData: function(){
        $.get('../api/angel_list', function(result){
            $.each(result, function(key, obj){
                profile[key].vote_cnt = obj.vote_cnt;
            });
        });
    },
    outStage: function(){
        gaclick('index_vote');
        var $this = this;
        TweenMax.staggerTo([home1, home2, home3], .5, {scaleY: 0, y: 200, ease:Back.easeIn}, .1);
        TweenMax.to(earth, .5, {y: 200, ease: Back.easeIn, delay: .3});
        TweenMax.staggerTo([title, redword, content], .5,{opacity: 0, y: -100}, .2);
        TweenMax.to(planet1, .5, {x: -500, ease:Back.easeIn});
        TweenMax.staggerTo([planet2, planet3], .5, {x: 500, ease:Back.easeIn}, .1);
        TweenMax.to(indexBtn, .5, {opacity: 0});
        TweenMax.to(rocket, 1, {top: "-20%", left: "5%", transform: "scale(.1)", ease: Back.easeIn});
        TweenMax.to(satellite, 1, {top: "-10%", left: "50%", transform: "scale(.1)", ease: Back.easeIn});
        TweenMax.to($('.part1'), .25, {display: "none", opacity: "0", delay: 1, onComplete: function(){
            $this.initPart2();
        }});
    },
    inStage: function(){
        TweenMax.staggerFrom([home1, home2, home3], .5, {scaleY: 0, y: 200, ease:Back.easeOut, delay: delayTime}, .1);
        TweenMax.from(earth, .5, {y: 200, ease: Back.easeOut, delay: delayTime});
        TweenMax.staggerFrom([title, redword, content], .5, {opacity: 0, y: -100, delay: delayTime}, .2);
        TweenMax.from(indexBtn, .5, {opacity: 0, delay: delayTime + .5});
        TweenMax.from(planet1, .5, {
            x: -500,
            ease:Back.easeOut,
            delay: delayTime,
            onComplete: function(){
                TweenMax.set(planet1, { clearProps:"all" }); 
            }
        });
        TweenMax.staggerFrom([planet2, planet3], .5, {
            x: 500, 
            ease:Back.easeOut, 
            delay: delayTime,
            onComplete: function(){
                TweenMax.set([planet2, planet3], { clearProps:"all" }); 
            }
        }, .1);
    },
    initSlick: function(){
        three.slick({
            centerMode: false,
            centerPadding: '5px',
            slidesToShow: 3,
            responsive: [
                {
                    breakpoint: 600,
                    settings: {
                        initialSlide: 1,
                        arrows: false,
                        infinite: false,
                        centerMode: true,
                        centerPadding: '33%',
                        slidesToShow: 1
                    }
                }
            ]
        });
    },
    initRA: function(){
        var $this = this;
        planetObj.roundabout({
            duration: 400,
            startingChild: 0,
            responsive: true,
            minOpacity: 1,
            maxOpacity: 1,
            shape: 'rollerCoaster',
            clickToFocus: false
        }).bind('animationStart', function() {
            var focus = planetObj.roundabout("getChildInFocus");
            if(wheelPos == "down") {
                var downFocus = focus + 1;
                if(downFocus >= 16) downFocus = 0;
                TweenMax.to($('.roundabout-moveable-item').eq(downFocus), .5, {scale: 1, filter: "brightness(100%)"});
                TweenMax.to($('.roundabout-in-focus'), .5, {scale: .5, filter: "brightness(30%)"});
            }else if(wheelPos == "top"){
                var topFocus = focus - 1;
                if(topFocus <= -1) topFocus = 15;
                TweenMax.to($('.roundabout-moveable-item').eq(topFocus), .5, {scale: 1, filter: "brightness(100%)"});
                TweenMax.to($('.roundabout-in-focus'), .5, {scale: .5, filter: "brightness(30%)"});
            }
            TweenMax.to([three, threeLocation], .3, {
                opacity: 0,
                onComplete: function(){
                    three.slick('slickGoTo', 1, true);
                }
            });
        }).bind('animationEnd', function() {
            var focus = planetObj.roundabout("getChildInFocus");

            $('aside li').find('a').removeClass('focus');
            $('aside li').find('a').eq(focus).addClass('focus');

            var gaIndex = focus + 1;
            $this.setProfile(focus);
            gaclick('shop_' + gaIndex);
        });

        TweenMax.to($('.roundabout-moveable-item'), .5, {scale: .5, filter: "brightness(30%)"});
        TweenMax.to($('.roundabout-in-focus'), .3, {scale: 1, filter: "brightness(100%)", onComplete: function(){
            //TweenMax.to($('.part2'), .2, { opacity: 0 });
        }});
    },
    initPart2: function(){
        var $this = this;
        $this.winWheel();
        $this.checkChoose();
        $this.setProfile(store_number);

        $.each(profile, function(key, obj){
            $.preload(obj.img2);
            $.preload(obj.img3);
            $.preload(obj.img4);
        });

        $('aside.part2').removeClass('none');
        $('aside li').on('click', function(e){
            menuCtrl.preventAll(e);
            var index = $(this).index();
            var focus = planetObj.roundabout("getChildInFocus"); 

            $('aside li').find('a').removeClass('focus');
            $(this).find('a').addClass('focus');

            TweenMax.to($('.roundabout-moveable-item'), .5, {scale: .5, filter: "brightness(30%)", delay: .1});
            TweenMax.to($('.roundabout-moveable-item').eq(index), .5, {scale: 1, filter: "brightness(100%)", delay: .1});

            planetObj.roundabout('animateToChild', index, function(){
                $this.setProfile(index);
            });
        });

        $('.progress ul li').on('click', function(e){
            menuCtrl.preventAll(e);
            var index = $(this).index();
            trackWaitJump('', 'general.html?tag=' + index);
        });

        // 上下顆星球
        $('.store_list p a:eq(0)').on('click', function(e){
            menuCtrl.preventAll(e);
            wheelPos = "top";
            planetObj.roundabout('animateToPreviousChild');
        });
        $('.store_list p a:eq(1)').on('click', function(e){
            menuCtrl.preventAll(e);
            wheelPos = "down";
            planetObj.roundabout('animateToNextChild');
        });

        // 開店別 for mobile
        $('.store_list .location').on('click', function(e){
            menuCtrl.preventAll(e);
            $('.store_list').css('z-index', 710);
            $('.store_list .name').fadeIn('fast');
        });

        // 店別 for mobile
        $('.store_list .name li').on('click', function(e){
            menuCtrl.preventAll(e);
            var index = $(this).index();
            /*var thisClass = $(this).parent('ul').attr('class');

            if(thisClass === 'center'){
                index = $(this).index() + $('.north li').size();
            }else if(thisClass === 'south'){
                index = $(this).index() + $('.north li, .center li').size();
            }*/

            $('.store_list').css('z-index', 501);
            $('.store_list .name').fadeOut('fast', function(){
                TweenMax.to($('.roundabout-moveable-item'), .5, {scale: .5, filter: "brightness(30%)", delay: .1});
                TweenMax.to($('.roundabout-moveable-item').eq(index), .5, {scale: 1, filter: "brightness(100%)", delay: .1});
                planetObj.roundabout("animateToChild", index);
            });
        });

        // 看更多
        three.find('.photo').on('click', function(e){
            menuCtrl.preventAll(e);
            popupOpen = true;

            $this.setPersonal($(this).data('index'), $(this).data('type'));
        });

        // 投票
        three.find('.btnVote').on('click', function(e){
            menuCtrl.preventAll(e);
            var index = $(this).data('index');
            var type = $(this).data('type');

            if(!menuCtrl.timesUp()){
                alert('此投票活動已結束，感謝您的熱情參與！');
                return;
            }

            if(!fb_login && !gplus_login){
                popupOpen = true;
                $('.pop.login, .black').fadeIn('fast');
                $this.openLogin();
                return;
            }

            $.each(profile, function(index, obj){
                obj.chooseFG = false;
            });

            $this.checkChoose(index, type);
        });

        // 完成popup
        $('.progress .finish').on('click', function(e){
            menuCtrl.preventAll(e);
            if($(this).hasClass('no')) return;
            popupOpen = true;

            if(!menuCtrl.timesUp()){
                alert('此投票活動已結束，感謝您的熱情參與！');
                return;
            }

            var finalObj = $('.finalCheck li');
            var finalArr = [$.cookie('choose1'), $.cookie('choose2'), $.cookie('choose3')];

            $.each(finalArr, function(key, obj){
                finalObj.eq(key).find('img').attr('src', profile[finalArr[key]].img1);
                finalObj.eq(key).find('h1').text(profile[finalArr[key]].name).append('<span>'+profile[finalArr[key]].store_nm+'</span>');

                if(key === (finalArr.length - 1)) $('.pop.final_check, .black').fadeIn('fast');
            });

            gaclick('vote_go');
        });

        // 送出投票
        $('.finalCheck .votebtn').on('click', function(e){
            menuCtrl.preventAll(e);
            menuCtrl.sendData(function(){
                $('.final_check .finalCheck, .final_check .close').fadeOut('fast', function(){
                    $('.final_check .beenVote').fadeIn('fast');
                });
            });
        });

        // 送出投票>回首頁
        $('.final_check .beenVote .votebtn').on('click', function(e){
            menuCtrl.preventAll(e);
            trackWaitJump('ok_goback', 'index.html');
        });

        TweenMax.to($('.roundabout-moveable-item'), .5, {scale: .5, filter: "brightness(30%)", delay: .1});
        TweenMax.to($('.roundabout-moveable-item').eq(store_number), .5, {scale: 1, filter: "brightness(100%)", delay: .1});
        planetObj.roundabout("animateToChild", store_number);
        TweenMax.to($('.part2'), .5, {
            opacity: 1,
            delay: .5,
            onComplete: function(){
                //TweenMax.set($('.part2'), { clearProps:"all" });
            }
        });
    },
    setProfile: function(key){
        var newKey = key * 3;
        var left = $('.vote .vote_box.first');
        var mid = $('.vote .vote_box.second');
        var right = $('.vote .vote_box.third');
        var threeArr = [left, mid, right];

        threeLocation.find('.words').text(profile[newKey].store_nm);

        $.each(threeArr, function(key, obj){
            obj.find('h2').text(profile[newKey+key].name);
            obj.find('img').attr('src', profile[newKey+key].img1);
            obj.find('.vote_cnt').text(profile[newKey+key].vote_cnt);
            obj.find('.photo').data('index', profile[newKey+key].index).data('type', profile[newKey+key].store_tp);
            obj.find('.btnVote').data('index', profile[newKey+key].index).data('type', profile[newKey+key].store_tp);

            if(profile[newKey+key].chooseFG == true){
                obj.find('.btnVote').addClass('choose');
                obj.find('.btnVote').find('span').text('已選取');
                obj.find('.btnVote').find('path').removeClass('shape').removeClass('shape_border');
            }else{
                obj.find('.btnVote').removeClass('choose');
                obj.find('.btnVote').find('span').html('<b class="icon-love"></b>投票');
                obj.find('.btnVote').find('path').addClass('shape').addClass('shape_border');
            }

            if(key === (threeArr.length - 1)) TweenMax.to([three, threeLocation], .3, {opacity: 1, delay: .35});
        });
    },
    setPersonal: function(key, tp){
        var $this = this;
        var setObj = $('.personal');
        var group = '';
        var name = profile[key].name;
        var pathName = (location.pathname.split("?")[0].indexOf('html') !== -1) ? location.pathname.split("?")[0] : '/index.html';
        var url = 'https://' + location.hostname + pathName + '?name=' + name;

        if(tp === 'A'){
            group = '自營組';
        }else if(tp === 'B'){
            group = '專櫃組';
        }else if(tp === 'C'){
            group = '警衛清潔組';
        };

        (profile[key].img4 === '') ? $('.personal .photo_block li:eq(3)').addClass('none').hide() : $('.personal .photo_block li:eq(3)').removeClass('none').show();

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

            if(index > $('.personal .photo_block li:not(.none)').size()) index = 1;
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
            var index = $(this).data('index');
            var type = $(this).data('type');

            if(!menuCtrl.timesUp()){
                alert('此投票活動已結束，感謝您的熱情參與！');
                return;
            }

            if(!fb_login && !gplus_login){
                popupOpen = true;
                innerFG = true;
                $('.pop.login, .pop_black').fadeIn('fast');
                $this.openLogin();
                return;
            }

            $this.checkChoose(index, type);
            $('.pop.personal, .black').delay(100).fadeOut('fast');
        });

        $('.pop.personal, .black').fadeIn('fast');
    },
    openLogin: function(){
        $('.login_fb').on('click', function(e){
            menuCtrl.preventAll(e);
            menuCtrl.fbLogin();
        });

        menuCtrl.googleLogin($('.login_google'));
    },
    checkChoose: function(num, tp){
        var $this = this;

        if(!menuCtrl.timesUp()){
            alert('此投票活動已結束，感謝您的熱情參與！');
            return;
        }      

        if(tp === 'A'){
            $.cookie('choose1', num);
        }else if(tp === 'B'){
            $.cookie('choose2', num);
        }else if(tp === 'C'){
            $.cookie('choose3', num);
        }

        var choose1 = $.cookie('choose1');
        var choose2 = $.cookie('choose2');
        var choose3 = $.cookie('choose3');
        var chooseList = [choose1, choose2, choose3];
        var setNum = (num) ? parseInt(num) : 0;
        var setKey = parseInt(Math.floor(setNum / 3));

        $.each(chooseList, function(num, obj){
            if(obj) profile[obj].chooseFG = true;

            if(num == (chooseList.length -1)) $this.setProfile(setKey);
        });

        (choose1) ? $('.progress .icon-checkmark:eq(0)').removeClass('unfinish') : $('.progress .icon-checkmark:eq(0)').addClass('unfinish');
        (choose2) ? $('.progress .icon-checkmark:eq(1)').removeClass('unfinish') : $('.progress .icon-checkmark:eq(1)').addClass('unfinish');
        (choose3) ? $('.progress .icon-checkmark:eq(2)').removeClass('unfinish') : $('.progress .icon-checkmark:eq(2)').addClass('unfinish');

        if(!choose1 || !choose2 || !choose3) return;
        $('.progress .finish').removeClass('no');
    },
    winWheel: function(){
        var $this = this;
        var timer;
        if('onmousewheel' in window){
            window.onmousewheel = wheel;
        }else if('onmousewheel' in document){
            document.onmousewheel = wheel;
        }else if('addEventListener' in window){
            window.addEventListener("mousewheel", wheel, false);
            window.addEventListener("DOMMouseScroll", wheel, false);
        }
        function wheel (e) {
            if(timer) window.clearTimeout(timer);
            if(popupOpen || resizeFG) return;
            timer = window.setTimeout(function() {
                e = e || window.event;
                if(e.wheelDelta <= 0 || e.detail > 0){
                    wheelPos = "down";
                    planetObj.roundabout('animateToNextChild');
                }else{
                    wheelPos = "top";
                    planetObj.roundabout('animateToPreviousChild');
                }
            }, 250);
        }
    }
}

$(function() {
    indexCtrl.init();
});