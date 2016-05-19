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
    $.fn.heavenClick= function (callback) {
        $(document).on('click', $(this).selector, function(event) { // this (jQuery) method is working
            callback($(this));
            event.preventDefault();
        });
        return $;
    };
    var heavenPG = function(data){
        var option={id:'',total:1,visible:5,pgLength:3,onclick:'',next:'next',prev:'back',current:1};
        typeof data == 'object' && $.extend(option,data);
        this.getOption= function () {
            return option;
        };
        this.setOption = function (data) {
            typeof data == 'object' && $.extend(option,data);
        };
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
                    i= (parseInt(first)-option.pgLength+1)>=1 ? (parseInt(first)-option.pgLength+1) : 1;
                    $($this).parent().find('li.pg').removeClass('active');
                    $(option.id).find('li').show();
                    change(i);
                }
            },
            current: function () {
                option.current = parseInt(option.current);
                option.current = option.current <= option.total && option.current >=1 ? option.current : 1;
                var  start, visible;
                if(option.current<option.visible){
                    start=1;
                    visible=option.visible<=option.total ? option.visible : option.total;
                }else{
                    start = option.current-option.pgLength;
                    visible=start+option.visible-1;
                    visible=visible<=option.total?visible:option.total;
                    if((visible-start)<option.visible){
                        start= start - (option.visible-(visible-start))+1;
                    }
                }
                return {
                    start : start,
                    visible: visible
                };

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
        this.getGenerate= function () {
            return generate;
        };
        this.getNextPrev = function () {
            return nextPrev;
        };
    };
    heavenPG.prototype.execute=function(data){
        typeof data == 'object' && this.setOption(data);
        typeof this.getOption().onclick == 'function' && (function(option,$,Generate,NextPrev){
            option.total==0 && (option.total=1);
            if(option.id!=='' && option.total!==0){
                var i=Generate.current().start;
                //looping action
                $(option.id).append($('<li>').append( $('<a>').text(option.prev).attr('href','#') ));
                for(i; i <= Generate.current().visible; i++){
                    if(option.current==i){
                        $(option.id).append($('<li>').addClass('active pg').append( $('<a>').text(i).attr('href','#') ));
                    }else{
                        $(option.id).append($('<li>').addClass('pg').append( $('<a>').text(i).attr('href','#') ));
                    }
                }
                $(option.id).append($('<li>').append( $('<a>').text(option.next).attr('href','#') ));
                //looping stop
                Generate.current();
                NextPrev.set($(option.id).find('li'));
                // click an action
                $(option.id).find('li').heavenClick(function ($this) {
                    var active =$this.hasClass('active'), disabled= $this.hasClass('disabled');
                    // find class active or disable
                    if(!active && !disabled){
                        // work over here
                        // Initialize next or prev action
                        var get=NextPrev.execute($this);
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
                        Generate.text($this);
                        // make it disable
                        NextPrev.disableIs($this);
                        option.onclick(option.current,$this.find('a').text());
                    }
                    return false;
                });
            }

        })(this.getOption(),$,this.getGenerate(),this.getNextPrev());
    };
    heavenPG.prototype.makeChange= function (data) {
        var Option = this.getOption();
        var Generate = this.getGenerate();
        var NextPrev=this.getNextPrev();
        var last = Option.total;
        if(typeof data == 'number'){
            Option.total=data;
        }
        if(typeof data == 'object'){
            this.setOption(data);
        }
        if((last <= Option.visible  && last != Option.total) || (last >= Option.visible && Option.total < Option.visible)){
            Option.total==0 && (Option.total=1);
            if(Option.id!=='' && Option.total!==0){
                $(Option.id).html('');
                console.log(Generate.current());
                var i=Generate.current().start;
                //looping action
                $(Option.id).append($('<li>').append( $('<a>').text(Option.prev).attr('href','#') ));
                for(i; i <= Generate.current().visible; i++){
                    if(Option.current==i){
                        $(Option.id).append($('<li>').addClass('active pg').append( $('<a>').text(i).attr('href','#') ));
                    }else{
                        $(Option.id).append($('<li>').addClass('pg').append( $('<a>').text(i).attr('href','#') ));
                    }
                }
                $(Option.id).append($('<li>').append( $('<a>').text(Option.next).attr('href','#') ));
                //looping stop
                NextPrev.set($(Option.id).find('li'));
            }
        }else{
            var list = $(Option.id).find('li.pg');
            function change(i){
                var current = parseInt(Option.current);
                i=i-1;
                list.each(function () {
                    i++;
                    if(i<=Option.total){
                        if(i==current){
                            $(this).addClass('active').find('a').text(i);
                        }else{
                            $(this).find('a').text(i);
                        }
                    }else{
                        $(this).hide();
                    }
                });
            }
            list.removeClass('active');
            change(Generate.current().start);
            NextPrev.set($(Option.id).find('li'));
        }
    };
    return heavenPG;
});