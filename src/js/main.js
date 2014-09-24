var Main = (function() {

    var _bpm = 60;
    var _angle = 0;

    var _beat = 4;
    var _note = 4;

    //二分计数
    var _trigger = true;
    //audio是否已初始化
    var _isAudioInit = false;
    var _audio;

    //是否处于暂停状态
    var _isPause = true;
    //是否处于设置bpm状态;
    var _isSettingBpm = false;

    var _timeout;

    //不会变动的dom
    var $point = $(".point");
    var $btnStatus = $(".btn-status");
    var $circleOut = $(".circle-out");
    var $bpmPart = $(".bpm-part");
    var $beatPart = $(".beat-part");
    var $settingBpmPart = $(".setting-bpm-part");
    var $bpmWording = $(".bpm-wording");
    var $ring = $(".ring");
    var $tape = $(".tape");
    var $pendulum = $(".pendulum");
    var $beatAndNote = $(".beat-and-note");
    var $beatVal = $(".beat-val");
    var $noteVal = $(".note-val");

    //播放声音
    var playAudio = function(src) {
        if (typeof Audio != "undefined") {
            if (!_isAudioInit) {
                _audio = new Audio(src);
                _audio.play();
                _isAudioInit = true;
            } else {
            	_audio.src = src;
                _audio.play();
            }

        } else if (typeof device != "undefined") {
            // Android
            if (device.platform == 'Android') {
                console.log(src);
            }
            var mediaRes = new Media(src, function onSuccess() {
                mediaRes.release();
            }, function onError(e) {
                console.log("error playing sound: " + JSON.stringify(e));
            });
            mediaRes.play();
        } else {
            alert("no sound API to play: " + src);
        }
    }

    var reset = function(){
    	_angle = 0;
    	$point.css({
            "-webkit-transform": "rotate(0deg)"
        });
    	clearTimeout(_timeout);
    	$btnStatus.removeClass("btn-pause").addClass("btn-play");
    	_isPause = true;
    }
    //旋转指针
    var toRotate = function() {

/*    	var speed = 30 / _bpm;

    	$pendulum.css({
        	"-webkit-transition": "all "+speed+"s ease-in"
        });*/

    	if(_trigger){
    		_angle = (_angle + 360 / _beat) % 360;
	        $point.css({
	            "-webkit-transform": "rotate(" + _angle + "deg)"
	        });
	        
	        if (_angle == 0) {
	            $circleOut.addClass("bg-orange");
	            setTimeout(function() {
	                $circleOut.removeClass("bg-orange");
	            }, 200);
	            playAudio("audio/1.mp3");
	        }else{
	        	playAudio("audio/2.mp3");
	        }
	        //单摆运动
	        $pendulum.css({
	        	"-webkit-transform": "translate(0,60px)"
	        });
    	}else{
    		$pendulum.css({
	        	"-webkit-transform": "translate(0,-60px)"
	        });
    	}
        _trigger = !_trigger;
    }

    //事件
    var bind = function() {

        //开始or暂停按钮点击
        $point.bind("touchend", function(e) {
            var $target = $(this);
            if (_isPause) {
                _timeout = setInterval(toRotate, 30000 / _bpm * 4 / _note);
                $btnStatus.removeClass("btn-play").addClass("btn-pause");
            } else {
                clearTimeout(_timeout);
                $btnStatus.removeClass("btn-pause").addClass("btn-play");
            }
            _isPause = !_isPause;
        });

        //设置bpm
        $bpmPart.bind("touchend", function(e) {
            if (_isSettingBpm) {
                $settingBpmPart.addClass("hide");
                $beatAndNote.removeClass("hide");
                $beatPart.removeClass("hide");
            } else {
                $beatPart.addClass("hide");
                $beatAndNote.addClass("hide");
                $settingBpmPart.removeClass("hide");
                //暂停
                clearTimeout(_timeout);
                $btnStatus.removeClass("btn-pause").addClass("btn-play");
                _isPause = true;
            }
            _isSettingBpm = !_isSettingBpm;
        });

        //ring拖动
        $ring.bind("touchmove", function(e) {
            var offY = e.targetTouches[0].pageY;
            if (offY < 200) {
                offY = 200;
            } else if (offY > 600) {
                offY = 600;
            }
            console.log(offY);

            //offY 200-600转换到30-240， 次方计算
            _bpm = parseInt(Math.pow(offY - 200, 2)/761.90 + 30);

            if (_bpm < 30) {
                _bpm = 30;
            } else if (_bpm > 240) {
                _bpm = 240;
            }

            $bpmWording.html(_bpm);
            $tape.css({
                "height": offY - 180
            });
        });

        $ring.bind("touchstart", function(e) {
            console.log(e.targetTouches[0].pageY);
        });

        //点击更改节拍
        $beatVal.bind("touchend", function(e){
        	var curVal = parseInt($(this).html());
        	var newVal = curVal+1;
        	if(newVal > _note){
        		newVal = 2;
        	}
        	_beat = newVal;
        	$(this).html(newVal);
        	reset();
        });

        $noteVal.bind("touchend", function(e){
        	var curVal = parseInt($(this).html());
        	var newVal = curVal * 2;
        	if(newVal > 16){
        		newVal = 4;
        	}
        	_note = newVal;
        	$(this).html(newVal);
        	reset();
        });
    }

    return {
        init: function() {
            bind();
        }
    }
})();

$(Main.init());