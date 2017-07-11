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
var fb_login = false;
var gplus_login = false;

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
        
        setTimeout(function(){
            startBtnPC.find('a').click();
        }, 2500);
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
            $this.setProfile(focus);
            
            three.fadeIn('fast');
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
        
        $('aside li').on('click', function(e){
            menuCtrl.preventAll(e);
            var index = $(this).index();
            var focus = planetObj.roundabout("getChildInFocus"); 
            
            TweenMax.to($('.roundabout-moveable-item'), .5, {scale: .5, filter: "brightness(30%)"});
            TweenMax.to($('.roundabout-moveable-item').eq(index), .5, {scale: 1, filter: "brightness(100%)"});
            
            planetObj.roundabout('animateToChild', index, function(){
                $this.setProfile(index);
            });
        });
        
        $('.photo, .btnVote').on('click', function(e){
            menuCtrl.preventAll(e);
            
            if(!fb_login && !gplus_login){
                // $('').fadeIn('fast');
                $this.openLogin();
                return;
            }
            
            console.log('index:', $(this).data('index'),'type:', $(this).data('type'));
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
        });
        
        /*left.find('h2').text(profile[newKey].name);
        left.find('img').attr('src', profile[newKey].img1);
        left.find('.vote_cnt').text(profile[newKey].vote_cnt);
        left.find('.photo').data('index', profile[newKey].index);
        left.find('.btnVote').data('index', profile[newKey].index);
        
        mid.find('h2').text(profile[newKey+1].name);
        mid.find('img').attr('src', profile[newKey+1].img1);
        mid.find('.vote_cnt').text(profile[newKey+1].vote_cnt);
        mid.find('.photo').data('index', profile[newKey+1].index);
        mid.find('.btnVote').data('index', profile[newKey+1].index);
        
        right.find('h2').text(profile[newKey+2].name);
        right.find('img').attr('src', profile[newKey+2].img1);
        right.find('.vote_cnt').text(profile[newKey+2].vote_cnt);
        right.find('.photo').data('index', profile[newKey+2].index);
        right.find('.btnVote').data('index', profile[newKey+2].index);*/
    },
    setPersonal: function(key){
        
    },
    openLogin: function(){
        // fb.click -> menuCtrl.fbLogin
        // gplus.click -> menuCtrl.googleLogin
        
        // 更新 fb_login / gplus_login
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