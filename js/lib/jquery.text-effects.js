(function($) {
    
    function shuffle(a) {
        var i = a.length, j;
        while (i) {
            var j = Math.floor((i--) * Math.random());
            var t = a[i];
            a[i] = a[j];
            a[j] = t;
        }
    }
    
    function randomAlphaNum() {
        var rnd = Math.floor(Math.random() * 62);
        if (rnd >= 52) return String.fromCharCode(rnd - 4);
        else if (rnd >= 26) return String.fromCharCode(rnd + 71);
        else return String.fromCharCode(rnd + 65);
    }

    function randomChar() {
        var chararray = ["/", "@", "$", "%", "#", "_","^","*","!","?",")","(","-","+","{","}"];
        var char = chararray[Math.floor(Math.random()*chararray.length)];
        return char;
    }
    
    $.fn.rot13 = function() {
        this.each(function() {
            $(this).text($(this).text().replace(/[a-z0-9]/ig, function(chr) {
                var cc = chr.charCodeAt(0);
                if (cc >= 65 && cc <= 90) cc = 65 + ((cc - 52) % 26);
                else if (cc >= 97 && cc <= 122) cc = 97 + ((cc - 84) % 26);
                else if (cc >= 48 && cc <= 57) cc = 48 + ((cc - 43) % 10);
                return String.fromCharCode(cc);
            }));
        });
        return this;
    };
    
    $.fn.scrambledWriter = function() {
        this.each(function() {
            var $ele = $(this), str = $ele.text(), progress = 0, replace = /[^\s]/g,
                random = randomChar, inc = 1;
            $ele.text('');
            var timer = setInterval(function() {
                $ele.text(str.substring(0, progress) + str.substring(progress, progress+inc+1).replace(replace, random) );
                //$ele.text(str.substring(0, progress) + str.substring(progress, progress+inc).replace(replace, random) + str.substring(progress+inc, str.length));
                progress += inc
                if (progress >= str.length + inc) clearInterval(timer);
                if($ele.hasClass("stop")){
                  clearInterval(timer);
                  $ele.text('');
                };
            }, 15);
            timerarray.push(timer);
            
        });
        return this;
    };
    
    $.fn.typewriter = function() {
        this.each(function() {
            var $ele = $(this), str = $ele.text(), progress = 0;
            $ele.text('');
            var timer = setInterval(function() {
                $ele.text(str.substring(0, ++progress) + (progress & 1 ? '_' : ''));
                if (progress >= str.length) clearInterval(timer);
            }, 100);
        });
        return this;
    };
    
    $.fn.unscramble = function() {
        this.each(function() {
            var $ele = $(this), str = $ele.text(), replace = /[^\s]/,
                state = [], choose = [], reveal = 25, random = randomAlphaNum;
            
            for (var i = 0; i < str.length; i++) {
                if (str[i].match(replace)) {
                    state.push(random());
                    choose.push(i);
                } else {
                    state.push(str[i]);
                }
            }
            
            shuffle(choose);
            $ele.text(state.join(''));
            
            var timer = setInterval(function() {
                var i, r = reveal;
                while (r-- && choose.length) {
                    i = choose.pop();
                    state[i] = str[i];
                }
                for (i = 0; i < choose.length; i++) state[choose[i]] = random();
                $ele.text(state.join(''));
                if (choose.length == 0) clearInterval(timer);
            }, 100);
        });
        return this;
    };
    
})(jQuery);