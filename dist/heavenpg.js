/**
 * Created by Quesha-Lania on 30/03/2016.
 */
(function(global,jQuery, action){
    var heavenPG=typeof global == 'undefined' || jQuery == 'undefined' ? 'undefined' : action(global,jQuery);
    if(heavenPG ==='undefined'){
        global==='undefined' && console.log('window undefined');
        jQuery==='undefined' && console.log('jQuery undefined');
        return false;
    }
    global.heavenPG = heavenPG;
})(typeof window !== "undefined" ? window : "undefined",typeof jQuery !== "undefined" ? jQuery : "undefined", function (Global,$) {
    var option={id:'',total:0,visible:5,pgLength:3,onclick:'',next:'next',prev:'back',current:10};
    var nextPrev={
        set:function(self) {
            if (option.current == '1') {
                self.first().addClass('disabled');
            }
            if (option.current == option.total) {
                self.last().addClass('disabled');
            }
        },
        execute:function(self){
            var action=false;
            if(self.text()==option.next){
                action=option.current!=option.total && self.parent().find('li.active').next();
            }
            if(self.text()==option.prev){
                action=option.current!=1 && self.parent().find('li.active').prev();
            }
            return action;
        }
    };
    var on= function (id) {
        return {
            click :function(callback){ // jQuery identifier not working event attribute & tag add dynamically
                $(document).on('click', id, function(event) { // this (jQuery) method is working
                    callback($(this));
                    event.preventDefault();
                });
            },
            dblclick :function(callback){ // jQuery identifier not working event attribute & tag add dynamically
                $(document).on('dblclick', id, function() { // this (jQuery) method is working
                    callback($(this));
                });
            }
        };
    };
    var heavenPG = function(data){
        typeof data == 'object' && $.extend(option,data);
    };
    heavenPG.prototype.id=function(data){
        option.id=data;
        return this;
    };
    heavenPG.prototype.execute=function(data){
        typeof data == 'object' && $.extend(option,data);
        typeof option.onclick == 'function' && (function(option,$){
            if(option.id!=='' && option.total!==0){
                var i=1;
                $(option.id).append($('<li>').append( $('<a>').text(option.prev).attr('href','#') ));
                for(i; i <= option.total; i++){
                    if(option.current==i){
                        $(option.id).append($('<li>').addClass('active').append( $('<a>').text(i).attr('href','#') ));
                    }else{
                        $(option.id).append($('<li>').append( $('<a>').text(i).attr('href','#') ));
                    }
                }
                $(option.id).append($('<li>').append( $('<a>').text(option.next).attr('href','#') ));
                nextPrev.set($(option.id).find('li'));
                on(option.id + ' li').click(function ($this) {
                    var active =$this.hasClass('active'), disabled= $this.hasClass('disabled');
                    var get=nextPrev.execute($this);
                    $this.parent().find('li').removeClass('active');
                    typeof get !== "boolean" && get.addClass('active');
                    $(option.id).find('li').removeClass('disabled');
                    if(!active && !disabled){
                        if($this.find('a').text()!=option.next && $this.find('a').text() != option.prev){
                            $this.addClass('active');
                        }
                        option.current=$this.find('a').text();
                        option.current==1 && $(option.id).find('li').first().addClass('disabled');
                        option.current==option.total && $(option.id).find('li').last().addClass('disabled');
                        option.onclick(option.current);
                    }
                    return false;
                });
            }

        })(option,$);
    };
    heavenPG.prototype.rebuild= function (data) {
        if(typeof data == 'number'){
            option.total=data;
        }
        if(typeof data == 'object'){
            $.extend(option,data);
        }
        if(option.id!=='' && option.total!==0){
            $(option.id).html('');
            var i=1;
            $(option.id).append($('<li>').append( $('<a>').text(option.prev).attr('href','#') ));
            for(i; i <= option.total; i++){
                if(option.current==i){
                    $(option.id).append($('<li>').addClass('active').append( $('<a>').text(i).attr('href','#') ));
                }else{
                    $(option.id).append($('<li>').append( $('<a>').text(i).attr('href','#') ));
                }
            }
            $(option.id).append($('<li>').append( $('<a>').text(option.next).attr('href','#') ));
            nextPrev.set($(option.id).find('li'));
        }
    };
    return heavenPG;
});
