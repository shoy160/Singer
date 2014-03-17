(function(S){
    /*
     lineSlide
     create by shy
     */
    S.prototype.lineSlide=function(opt){
        opt= S.extend({
            lineHeight:30,
            lazySrc:"lsrc"
        },opt);
        var $this=$(this),doms=[];
        $this.each(function(){
            var imgs = S(this).find("img["+opt.lazySrc+"]");
            doms.push(imgs);
        })
        $this.parent().css("position","relative");
        $this.not($this.eq(0)).hide();
        var $arrow=S('<div class="line-arrow"><b></b><s></s></div>');
        var lines=S('<div class="line-slide"><div class="b"></div></div>');
        lines.append($arrow);
        for(var i=0;i<$this.length;i++){
            var header = $this.eq(i).data("header");
            lines.append('<div class="line-item'+(i==0?" current":"")+'"><h2>'+header+'</h2><b></b><s></s></div>');
        }
        $this.eq(0).before(lines);
        var showImg = function(index){
            var imgs = doms[index];
            if(!imgs.loaded){
                imgs.each(function(){
                    this.setAttribute("src",this.getAttribute(opt.lazySrc));
                    this.removeAttribute(opt.lazySrc);
                });
                doms[index].loaded=true;
            }
        };
        showImg(0);
        lines.find(".line-item h2").hover(function(){
            var $t=$(this).parent();
            var i = lines.find(".line-item").index($t);
            $t.siblings(".line-item").removeClass("current");
            $arrow.animate({
                left:($t.width()*i) + "px"
            },200,function(){
                $t.siblings(".line-item").removeClass("current");
                $t.addClass("current");
                var $c=$this.eq(i);
                showImg(i);
                $this.not($c).hide();
                $c.show();
            })
        },function(){

        })
    };
})(jQuery);