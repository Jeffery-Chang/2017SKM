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
var flyman = $('.flyman');
var rocket = $('.rocket');
var satellite = $('.satellite');
var delayTime = 1.5;
var outStage_fg = false;
var indexCtrl = {
    init: function(){
        var $this = this;
        
        $this.inStage();
        
        if(!menuCtrl.chkDevice()){
            $this.winWheel();
            $this.activeObj();
        }

        startBtnPC.find('a').on('click', function(e){
            menuCtrl.preventAll(e);
            $this.outStage();
        });
        startBtnM.click(function(e) {
            menuCtrl.preventAll(e);
            $this.outStage();
            $('.shape').toggleClass('shape_border');
        });
    },
    activeObj: function(){
        TweenMax.to(flyman, 2, {y: "+=30", ease: Power1.easeIn, yoyo: true, repeat: -1, repeatDelay : .1, delay: delayTime});
        TweenMax.from(rocket, 2, {top: "30%", left: "50%", opacity: 0, transform: "scale(.5) rotate(-90deg)", delay: delayTime, ease: Power2.easeOut,
            onComplete: function(){
                TweenMax.set(rocket, { clearProps:"all" }); 
            }
        });
    },
    outStage: function(){
        TweenMax.staggerTo([home1, home2, home3], .5, {scaleY: 0, y: 200, ease:Back.easeIn}, .1);
        TweenMax.to(earth, .5, {y: 200, ease: Back.easeIn, delay: .3});
        TweenMax.staggerTo([title, redword, content], .5,{opacity: 0, y: -100}, .2);
        TweenMax.to(planet1, .5, {x: -500, ease:Back.easeIn});
        TweenMax.staggerTo([planet2, planet3], .5, {x: 500, ease:Back.easeIn}, .1);
        (!menuCtrl.chkDevice()) ? TweenMax.to(startBtnPC, .5, {opacity: 0}) : TweenMax.to(startBtnM, .5, {opacity: 0})
        TweenMax.to(rocket, 1, {top: "-20%", left: "5%", transform: "scale(.1)", ease: Back.easeIn});
        TweenMax.to(satellite, 1, {top: "-10%", left: "50%", transform: "scale(.1)", ease: Back.easeIn});
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
                    if(!outStage_fg){
                        $this.outStage();
                        outStage_fg = !outStage_fg;
                    }
                }else{
                    //$this.inStage();
                }
            }, 250);
        }
    }
}

$(function() {
    indexCtrl.init();
});