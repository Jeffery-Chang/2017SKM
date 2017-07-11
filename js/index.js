(function(a){a.preload=function(){var c=[],b=arguments.length;for(;b--;){c.push(a("<img />").attr("src",arguments[b]));}};})(jQuery);

var home1 = $('.earth .house_layer_1');
var home2 = $('.earth .house_layer_2');
var home3 = $('.earth .house_layer_3');
var earth = $('.earth .land');
var title = $('.part1 h1');
var redword = $('.part1 h2');
var content = $('.part1 .pc_only, .part1 .m_only');
var startBtnPC = $('.part1 .scroll-btn');
var startBtnM = $('.part1 .btn');
var planet1 = $('.planet.p_1');
var planet2 = $('.planet.p_2');
var planet3 = $('.planet.p_3');
var flyman = $('.flyman');
var rocket = $('.rocket');
var satellite = $('.satellite');

var delayTime = 1.5;
var outStage_fg = false;
var wheelPos = "top";
var fb_login = ($.cookie('fb_login')) ? true : false;
var gplus_login = ($.cookie('gplus_login')) ? true : false;
var personPop = false;

var planetObj = $('.planetBox ul');
var three = $('.part2 .slick');
var vote_box = $('.vote .vote_box');

var indexCtrl = {
    init: function(){
        var $this = this;

        $this.refreshData();
        $this.inStage();
        $this.initRA();

        (!menuCtrl.chkDevice()) ? $this.activeObj() : $this.initSlick()

        startBtnPC.find('a').on('click', function(e){
            menuCtrl.preventAll(e);
            $this.outStage();
        });
        startBtnM.click(function(e) {
            menuCtrl.preventAll(e);
            $this.outStage();
            $('.part1 .btn .shape').toggleClass('shape_border');
        });

        /*setTimeout(function(){
            startBtnPC.find('a').click();
        }, 2500);*/
    },
    activeObj: function(){
        var $this = this;
        // TweenMax.to(flyman, 2, {y: "+=30", ease: Power1.easeIn, yoyo: true, repeat: -1, repeatDelay : .1, delay: delayTime});
        TweenMax.from(rocket, 2, {top: "30%", left: "50%", opacity: 0, transform: "scale(.5) rotate(-90deg)", delay: delayTime, ease: Power2.easeOut,
                                  onComplete: function(){
                                      TweenMax.set(rocket, { clearProps:"all" });
                                      $this.winWheel();
                                  }
                                 });
    },
    outStage: function(){
        var $this = this;
        TweenMax.staggerTo([home1, home2, home3], .5, {scaleY: 0, y: 200, ease:Back.easeIn}, .1);
        TweenMax.to(earth, .5, {y: 200, ease: Back.easeIn, delay: .3});
        TweenMax.staggerTo([title, redword, content], .5,{opacity: 0, y: -100}, .2);
        TweenMax.to(planet1, .5, {x: -500, ease:Back.easeIn});
        TweenMax.staggerTo([planet2, planet3], .5, {x: 500, ease:Back.easeIn}, .1);
        (!menuCtrl.chkDevice()) ? TweenMax.to(startBtnPC, .5, {opacity: 0}) : TweenMax.to(startBtnM, .5, {opacity: 0})
        TweenMax.to(rocket, 1, {top: "-20%", left: "5%", transform: "scale(.1)", ease: Back.easeIn});
        TweenMax.to(satellite, 1, {top: "-10%", left: "50%", transform: "scale(.1)", ease: Back.easeIn});

        TweenMax.to($('.part1'), .25, {display: "none", opacity: "0", delay: 1, onComplete: function(){
            outStage_fg = true;
            $this.initPart2();
        }});
    },
    inStage: function(){
        TweenMax.staggerFrom([home1, home2, home3], .5, {scaleY: 0, y: 200, ease:Back.easeOut, delay: delayTime}, .1);
        TweenMax.from(earth, .5, {y: 200, ease: Back.easeOut, delay: delayTime});
        TweenMax.staggerFrom([title, redword, content], .5, {opacity: 0, y: -100, delay: delayTime}, .2);
        TweenMax.from(planet1, .5, {x: -500, ease:Back.easeOut, delay: delayTime,
                                    onComplete: function(){
                                        TweenMax.set(planet1, { clearProps:"all" }); 
                                    }});
        TweenMax.staggerFrom([planet2, planet3], .5, {x: 500, ease:Back.easeOut, delay: delayTime,
                                                      onComplete: function(){
                                                          TweenMax.set([planet2, planet3], { clearProps:"all" }); 
                                                      }}, .1);
        (!menuCtrl.chkDevice()) ? TweenMax.from(startBtnPC, .5, {opacity: 0, delay: delayTime + .5}) : TweenMax.from(startBtnM, .5, {opacity: 0, delay: delayTime + .5})
    },
    refreshData: function(){
        $.get('api/angel_list', function(result){
            $.each(result, function(key, obj){
                profile[key].vote_cnt = obj.vote_cnt;
            });
        });
    },
    initSlick: function(){
        /*three.slick({
            centerMode: true,
            centerPadding: '40px',
            slidesToShow: 3,
            responsive: [
                {
                    breakpoint: 768,
                    settings: {
                        arrows: false,
                        centerMode: true,
                        centerPadding: '30%',
                        slidesToShow: 1
                    }
                },
                {
                    breakpoint: 450,
                    settings: {
                        arrows: false,
                        centerMode: true,
                        centerPadding: '90px',
                        slidesToShow: 1
                    }
                }
            ]
        });*/
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
            debug: false
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
            three.fadeOut('fast');
        }).bind('animationEnd', function() {
            var focus = planetObj.roundabout("getChildInFocus");

            $('aside li').find('a').removeClass('focus');
            $('aside li').find('a').eq(focus).addClass('focus');

            $this.setProfile(focus);
        }).bind('childrenUpdated', function(){

        });

        TweenMax.to($('.roundabout-moveable-item'), .5, {scale: .5, filter: "brightness(30%)"});
        TweenMax.to($('.roundabout-in-focus'), .3, {scale: 1, filter: "brightness(100%)", onComplete: function(){
            $('.part2').hide();
        }});
    },
    initPart2: function(){
        var $this = this;
        $this.setProfile(0);
        $this.checkChoose();

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

        $('.progress a').on('click', function(e){
            menuCtrl.preventAll(e);
        });

        // popup關閉 .store_list .close
        $('.pop .close').on('click', function(e){
            menuCtrl.preventAll(e);
            personPop = false;
            $(this).parent('div').fadeOut('fast');
            $('.black').fadeOut('fast');
        });

        // 看更多
        $('.photo').on('click', function(e){
            menuCtrl.preventAll(e);
            personPop = true;

            $this.setPersonal($(this).data('index'), $(this).data('type'));
        });

        // 投票
        $('.btnVote').on('click', function(e){
            menuCtrl.preventAll(e);
            var index = $(this).data('index');
            var type = $(this).data('type');

            if(!fb_login && !gplus_login){
                $('.pop.login, .black').fadeIn('fast');
                $this.openLogin();
                return;
            }

            $this.checkChoose(index, type);
        });
        
        // 完成popup
        $('.progress .finish').on('click', function(e){
            menuCtrl.preventAll(e);
            var finalObj = $('.finalCheck li');
            var finalArr = [$.cookie('choose1'), $.cookie('choose2'), $.cookie('choose3')];

            $.each(finalArr, function(key, obj){
                finalObj.eq(key).find('img').attr('src', profile[finalArr[key]].img1);
                finalObj.eq(key).find('h1').text(profile[finalArr[key]].name).append('<span>'+profile[finalArr[key]].store_nm+'</span>');

                if(key === (finalArr.length - 1)) $('.pop.final_check, .black').fadeIn('fast');
            });
        });
        
        // 送出投票
        $('.finalCheck .votebtn').on('click', function(e){
            menuCtrl.preventAll(e);
            $this.sendData();
        });

        $('.part2').fadeIn('slow');
    },
    setProfile: function(key){
        var newKey = key * 3;
        var left = $('.vote .vote_box:eq(0)');
        var mid = $('.vote .vote_box:eq(1)');
        var right = $('.vote .vote_box:eq(2)');
        var threeArr = [left, mid, right];

        $.each(threeArr, function(key, obj){
            obj.find('h2').text(profile[newKey+key].name);
            obj.find('img').attr('src', profile[newKey+key].img1);
            obj.find('.vote_cnt').text(profile[newKey+key].vote_cnt);
            obj.find('.photo').data('index', profile[newKey+key].index).data('type', profile[newKey+key].store_tp);
            obj.find('.btnVote').data('index', profile[newKey+key].index).data('type', profile[newKey+key].store_tp);

            if(key === (threeArr.length - 1)) three.fadeIn('fast');
        });
    },
    setPersonal: function(key, tp){
        var $this = this;
        var setObj = $('.personal');
        var group = '';
        var name = profile[key].name;
        var url = 'http://' + location.hostname + location.pathname.split("?")[0] + '?name=' + name;

        $.preload( 
            profile[key].img1,
            profile[key].img2,
            profile[key].img3,
            profile[key].img4
        );

        if(tp === 'A'){
            group = '自營組';
        }else if(tp === 'B'){
            group = '專櫃組';
        }else if(tp === 'C'){
            group = '警衛清潔組';
        };

        (profile[key].img4 === '') ? $('.personal .photo_block li').eq(3).hide() : $('.personal .photo_block li').eq(3).show();

        $('.personal .photo_block img').attr('src', 'img/store/'+profile[key].store_no+'_'+profile[key].store_tp+'_02.jpg');
        setObj.find('h1').text(profile[key].name).append('<span>'+profile[key].store_nm+' / '+profile[key].career_nm+'</span>');
        setObj.find('h2').text(profile[key].service_words);
        setObj.find('.tag').text(group);
        setObj.find('.vote_cnt').text(profile[key].vote_cnt);
        setObj.find('.votebtn').data('index', profile[key].index).data('type', profile[key].store_tp);
        setObj.find('.fb_comment').html('<fb:comments href="'+url+'" num_posts="5" width="100%"></fb:comments>')
        FB.XFBML.parse(setObj.find('.fb_comment')[0]);

        $('.personal .photo_block li').on('click', function(e){
            menuCtrl.preventAll(e);
            var index = $(this).index() + 1;
            $('.personal .photo_block li').find('a').removeClass('focus');
            $(this).find('a').addClass('focus');

            $('.personal .photo_block img').fadeOut('fast', function(){
                $(this).attr('src', 'img/store/'+profile[key].store_no+'_'+profile[key].store_tp+'_0'+index+'.jpg');
                $(this).fadeIn('fast');
            });
        }).eq(1).click();

        $('.personal .votebtn').on('click', function(e){
            menuCtrl.preventAll(e);
            var index = $(this).data('index');
            var type = $(this).data('type');

            $this.checkChoose(index, type);
            $('.pop.personal, .black').delay(100).fadeOut('fast');
        });

        $('.pop.personal, .black').delay(200).fadeIn('fast');
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

        if(choose1) $('.progress .icon-checkmark:eq(0)').removeClass('unfinish');
        if(choose2) $('.progress .icon-checkmark:eq(1)').removeClass('unfinish');
        if(choose3) $('.progress .icon-checkmark:eq(2)').removeClass('unfinish');

        if(!choose1 || !choose2 || !choose3) return;

        $('.progress .finish').removeClass('no');
    },
    sendData: function(){
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
        sendGoogle = '6Lce3iYUAAAAADBw4GuNaJaKPGnkVAoOGpEWcSPw';

        data = {
            type: sendType,
            name: sendName,
            email: sendEmail,
            uid: sendId,
            type: sendType,
            choose: sendChoose,
            google: sendGoogle
        }

        console.log('data:', data);

        $.ajax({
            method: "POST",
            url: 'api/vote',
            data: data,
            success: function(result){
                console.log(result);
                if(result.status == '200'){

                }else if(result.status == '110'){
                    alert('您今日已完成投票!\n\n每個FB/G+帳號，一天可投一票，天天投票，中獎機率越高\n微笑新星們期待您的再訪支持！');
                }
                $('.final_check .finalCheck').fadeOut('fast', function(){
                    $('.final_check .beenVote').fadeIn('fast');
                });
            },
            error: function(result){
                alert(result);
            }
        });
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
            if(personPop) return;
            timer = window.setTimeout(function() {
                e = e || window.event;
                if(e.wheelDelta <= 0 || e.detail > 0){
                    wheelPos = "down";
                    (!outStage_fg) ? $this.outStage() : planetObj.roundabout('animateToNextChild')
                }else{
                    wheelPos = "top";
                    //$this.inStage();
                    if(outStage_fg) planetObj.roundabout('animateToPreviousChild');
                }
            }, 250);
        }
    }
}

$(function() {
    indexCtrl.init();
});