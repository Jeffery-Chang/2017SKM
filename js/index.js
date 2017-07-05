var home1 = $('.earth .house_layer_1');
var home2 = $('.earth .house_layer_2');
var home3 = $('.earth .house_layer_3');
var earth = $('.earth .land');
var title = $('section h1');
var redword = $('section h2');
var content = $('section .pc_only, section .m_only');
var startBtnPC = $('section .scroll-btn');
var startBtnM = $('section .btn');
var planet1 = $('.planet.p_1');
var planet2 = $('.planet.p_2');
var planet3 = $('.planet.p_3');
var indexCtrl = {
    init: function(){
        var $this = this;

        if(!menuCtrl.chkDevice()){
            $this.winWheel();
            $this.activeObj();
        }

        startBtnPC.find('a').on('click', function(e){
            menuCtrl.preventAll(e);
            $this.outSide();
        });
        startBtnM.click(function(e) {
            menuCtrl.preventAll(e);
            $this.outSide();
            $('.shape').toggleClass('shape_border');
        });
    },
    resize: function(){
        $(window).on('resize', function(){
            if($(window).width() > 600){
                startBtnPC.show();
                startBtnM.hide();
            }else{
                startBtnPC.hide();
                startBtnM.show();
            }
        });
    },
    activeObj: function(){
        TweenMax.to($('.flyman'), 2, {
            y           : "+=30",
            ease        : Power1.easeIn,
            yoyo        : true,
            repeat      : -1,
            repeatDelay : 0.05
        });
        var rocket = TweenMax.to($('.rocket'), 3, {
            top: "5%", 
            left: "20%", 
            opacity: 1,
            transform: "scale(.8) rotate(0)",
            delay: 2,
            ease: Power2.easeOut,
            onComplete: function(){
                $('.rocket').removeClass('start');
                TweenMax.set($('.rocket'), {clearProps:"all"}); 
            }
        });
    },
    outSide: function(){
        // 房子
        TweenMax.staggerTo([home1, home2, home3], 0.5,{scaleY: 0, y: 200, ease:Back.easeIn}, 0.1);

        // 地球
        TweenMax.to(earth, .5, {y: 200, ease: Back.easeIn, delay: .3});

        // 標題
        TweenMax.staggerTo([title, redword, content], 0.5,{opacity: 0, y: -100}, 0.2);

        // 星球
        TweenMax.to(planet1, 0.5,{x: -500, ease:Back.easeIn});
        TweenMax.staggerTo([planet2, planet3], 0.5,{x: 500, ease:Back.easeIn}, 0.1);

        // 滾輪按鈕
        if($(window).width() > 600){
            startBtnPC.fadeOut('fast');
        }else{
            startBtnM.fadeOut('fast');
        }
    },
    inSide: function(){
        // 地球
        TweenMax.to(earth, .5, {
            y: 0, 
            ease: Back.easeIn,
            onComplete: function () {
                // 房子
                TweenMax.staggerTo([home1, home2, home3], 0.5,{scaleY: 1, y: 0, ease:Back.easeOut}, 0.1);
            }
        });
        // 標題
        TweenMax.staggerTo([title, redword, content], 0.5,{opacity: 1, y: 0}, 0.2, function(){
            // 滾輪按鈕
            if($(window).width() > 600){
                startBtnPC.fadeIn('fast');
            }else{
                $('.shape').addClass('shape_border');
                startBtnM.fadeIn('fast');
            }
        });

        // 星球
        TweenMax.staggerTo([planet1, planet2, planet3], 0.5,{x: 0, ease:Back.easeIn}, 0.1, function(){
            TweenMax.set([planet1, planet2, planet3], {clearProps:"all"}); 
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
            timer = window.setTimeout(function() {
                e = e || window.event;
                if(e.wheelDelta <= 0 || e.detail > 0){
                    $this.outSide();
                }else{
                    $this.inSide();
                }
            }, 250);
        }
    },
}

$(function() {
    indexCtrl.init();
});
