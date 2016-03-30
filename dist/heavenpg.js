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
    var option={id:'',total:1,visible:5,pgLength:10,onclick:'',next:'next',prev:'back',current:1};
    var generate={
        visible : function(){
            var visible;
            if(option.visible<=option.total){
                visible = option.visible;
            }else{
                visible=option.total;
            }
            return visible;
        },
        text:function($this){
            var i, list=$($this).parent().find('li.pg').find('a'), first = list.first().text(),last =list.last().text();
            option.visible <= option.pgLength && (option.pgLength=option.visible-1);
            function change(i){
                var current = parseInt(option.current);
                i=i-1;
                list.each(function () {
                    i++;
                    if(i<=option.total){
                        if(i==current){
                            $(this).parent().addClass('active').find('a').text(i);
                        }else{
                            $(this).text(i);
                        }
                    }else{
                        $(this).parent().hide();
                    }
                });
            }
            if(last==option.current && parseInt(last) != option.total){
                i=parseInt(last)+option.pgLength-option.visible;
                $($this).parent().find('li.pg').removeClass('active');
                change(i);
            }

            if(first==option.current && parseInt(first) != 1){
                i= (parseInt(first)-option.pgLength+1)>=0 ? (parseInt(first)-option.pgLength+1) : 1;
                $($this).parent().find('li.pg').removeClass('active');
                $(option.id).find('li').show();
                change(i);
            }
        }
    };
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
        },
        disableIs:function(self){
            option.current==1 && self.parent().find('li').first().addClass('disabled');
            option.current==option.total && self.parent().find('li').last().addClass('disabled');
        }
    };
    $.fn.heavenClick= function (callback) {
        $(document).on('click', $(this).selector, function(event) { // this (jQuery) method is working
            callback($(this));
            event.preventDefault();
        });
        return $;
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
    heavenPG.prototype.data=function(data){
        typeof data == 'object' && $.extend(option,data);
    };
    heavenPG.prototype.total= function (data) {
        if(typeof data == 'number'){
            option.total=data;
        }
    };
    heavenPG.prototype.execute=function(data){
        typeof data == 'object' && $.extend(option,data);
        typeof option.onclick == 'function' && (function(option,$){
            if(option.id!=='' && option.total!==0){
                var i=1;
                //looping action
                $(option.id).append($('<li>').append( $('<a>').text(option.prev).attr('href','#') ));
                for(i; i <= generate.visible(); i++){
                    if(option.current==i){
                        $(option.id).append($('<li>').addClass('active pg').append( $('<a>').text(i).attr('href','#') ));
                    }else{
                        $(option.id).append($('<li>').addClass('pg').append( $('<a>').text(i).attr('href','#') ));
                    }
                }
                $(option.id).append($('<li>').append( $('<a>').text(option.next).attr('href','#') ));
                //looping stop
                nextPrev.set($(option.id).find('li'));
                // click an action
                $(option.id).find('li').heavenClick(function ($this) {
                    var active =$this.hasClass('active'), disabled= $this.hasClass('disabled');
                    // find class active or disable
                    if(!active && !disabled){
                        // work over here
                        // Initialize next or prev action
                        var get=nextPrev.execute($this);
                        // remove active and disable class
                        $this.parent().find('li').removeClass('active');
                        $(option.id).find('li').removeClass('disabled');
                        //check if next or prev is in action
                        if(typeof get ==='boolean'){
                            option.current=$this.find('a').text();
                            $this.addClass('active');
                        }else{
                            option.current=get.text();
                            get.addClass('active');
                        }
                        generate.text($this);
                        // make it disable
                        nextPrev.disableIs($this);
                        option.onclick(option.current,$this.find('a').text());
                    }
                    return false;
                });
            }

        })(option,$);
    };
    return heavenPG;
});
