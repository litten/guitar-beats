var Main = (function(){

	var _bpm = 60;
	var _angle = 0;
	var _note = 8;

	//audio是否已初始化
	var _isAudioInit = false;
	var _audio;

	//是否处于暂停状态
	var _isPause = true;

	var _timeout;

	//不会变动的dom
	var $point = $(".point");
	var $btnStatus = $(".btn-status");

	//播放声音
	function playAudio(src) {
	    if (typeof Audio != "undefined") { 
	    	if(!_isAudioInit){
	    		_audio = new Audio(src);
	    		_audio.play() ;
	    		_isAudioInit = true;
	    	}else{
	    		_audio.play() ;
	    	}
	        
	    } else if (typeof device != "undefined") {
	        // Android 
	        if (device.platform == 'Android') {
	            console.log(src);
	        }
	        var mediaRes = new Media(src,function onSuccess() {
	            mediaRes.release();
	        },function onError(e){
	            console.log("error playing sound: " + JSON.stringify(e));
	        });
	        mediaRes.play();
	    } else {
	        alert("no sound API to play: " + src);
	    }
	}

	//旋转指针
	var toRotate = function(){
		_angle = (_angle + 360/_note)%360;
		$point.css({"-webkit-transform": "rotate("+_angle+"deg)"});
		playAudio("audio/1.mp3");
	}

	//事件
	var bind = function(){
		$point.bind("touchend", function(e){
			var $target = $(this);
			if(_isPause){
				_timeout = setInterval(toRotate, 60000/_bpm);
				$btnStatus.removeClass("btn-play").addClass("btn-pause");
			}else{
				clearTimeout(_timeout);
				$btnStatus.removeClass("btn-pause").addClass("btn-play");
			}
			_isPause = !_isPause;
		});
	}

	return {
		init: function(){
			bind();
		}
	}
})();

$(Main.init());