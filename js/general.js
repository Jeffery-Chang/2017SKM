$(function(){
    var generalCtrl = new Vue({
        el: '.wrap .general',
        data: {
            items: profile
        },
        beforeMount: function(){
            var $thisData = this.items;
            console.log($thisData);
            /*$.each(this.items, function(key, obj){
                if(obj.store_tp === 'A') $thisData[key].store_tp = '自營組';
                if(obj.store_tp === 'B') $thisData[key].store_tp = '專櫃組';
                if(obj.store_tp === 'C') $thisData[key].store_tp = '警衛清潔組';
            });*/
        },
        mounted: function(){
            $('a').click(function(e){ e.preventDefault(); });
        },
        methods:{
            seeMore: function(index){
                console.log('seeMore.index:', index);
            },
            chkVote: function(index){
                console.log('chkVote.index:', index);
            }
        }
    });
});