/**
 * snapshot
 * @constructor
 */
function CLiveview() {
    var adjustIntervalSec = 2;
    var power = 1;
    var _self = null;
    var _liveview = null;
    var _tally = null;
    var _images = new Array(2);
    var max_fps = 30;
    var now_fps = 0;
    var last_fps = 0;
    var adjust = 12;
    var resolution = 0;
    var imageNo = 0;
    var imageNoOld = -1;
    var targetFps = false;

    var timerStop = true;
    var bDebug = false;
    var bShowFps = false;

    var styleVgaTally;
    var styleVgaLive;
    var styleVgaImg;
    var styleQvgaTally;
    var styleQvgaLive;
    var styleQvgaImg;

    var renewCheckIntervalID;
    var fpsCheckIntervalID;

    var request_snapshot = "/cgi-bin/view.cgi?action=snapshot";
    var request_start = "/cgi-bin/view.cgi?action=start";
    var request_stop = "/cgi-bin/view.cgi?action=stop";
    var giResol = 0;
    var vch1;
    var vch2;
    var vipflg;
    var number;
    var isUhdPage;

    this.init = function (_tallyElement, _liveElement, _maxFps, _power, _resolution) {
        _liveview = _liveElement;
        _tally = _tallyElement;
        max_fps = _maxFps;
        power = _power;
        resolution = _resolution;

        _tallyElement.style.visibility = "hidden";

        for (var i = 0; i < _images.length; i++) {
            _images[i] = new Image();
            _liveview.appendChild(_images[i]);
        }
        _self = this;
    };

    this.setVgaStyle = function (_tallyVga, _liveVga, _imgVga) {
        styleVgaTally = _tallyVga;
        styleVgaLive = _liveVga;
        styleVgaImg = _imgVga;
    };

    this.setQvgaStyle = function (_tallyQvga, _liveQvga, _imgQvga) {
        styleQvgaTally = _tallyQvga;
        styleQvgaLive = _liveQvga;
        styleQvgaImg = _imgQvga;
    };

    this.start = function (iResol,ch1,ch2,ipflg) {
        if (gPower == 1 && timerStop) {
            number  =  arguments.length;
            if(number > 1){
                isUhdPage = true;
            }else{
                isUhdPage = false;
            }
            window.console.log();
            giResol = iResol;
            vch1 = ch1;
            vch2 = ch2;
            vipflg = ipflg;
            $.get(request_start) ;
            this.create_img();

            // Liveview renew check.
            renewCheckIntervalID = setInterval(this.checkLiveViewRenew, 3000);
            fpsCheckIntervalID = setInterval(this.checkFps, adjustIntervalSec * 1000);
        }
        if (gPower == 0) {
            _images[0].className = styleVgaImg;
            _images[0].style.zIndex = 1;
            _images[0].src = "/css/pc/parts/standby.gif";
            _tally.style.visibility = "visible";
            $("#liveviewO").addClass("CssLiveViewBox_VGA_640");
        }
    };

    this.stop = function () {
        if (power == 1) {
            E.location = request_stop;
        }
    };

    this.setTallyState = function (_tallyState) {
    };

    this.setResolution = function (_resolution) {
        _liveview.className = (_resolution == 0) ? styleVgaLive : styleQvgaLive;
        _tally.className = (_resolution == 0) ? styleVgaTally : styleQvgaTally;
        resolution = _resolution;
    };

    this.checkFps = function () {
        if (bShowFps) {
            $("fps").innerHTML = "Tgt: " + max_fps + "<br>Now: " + Math.floor(now_fps / adjustIntervalSec) + "<br>Adj: " + Math.floor(adjust);
        }

        var abs = Math.abs(max_fps - last_fps);
        var diff = 0;

        if (abs > 3) diff = 1.5;
        else if (abs > 1) diff = 1;
        else diff = 0.2;

        if (last_fps > max_fps) diff *= -1;

        last_fps = now_fps / adjustIntervalSec;

        if (abs <= 2) {
            targetFps = true;
        }

        if (targetFps) {
            diff *= 0.2;
        }

        adjust += diff;

        if (adjust > 34) adjust = 34;  // max value.
        else if (adjust < 2) adjust = 2;   // min value.

        now_fps = 0;
    };

    this.checkLiveViewRenew = function () {
        if (imageNoOld == imageNo) {
        }
        else {
            imageNoOld = imageNo;
        }
    };

    this.create_img = function () {
        try{
            const img = _images[imageNo % 2];
            img.className = (resolution == 0) ? styleVgaImg : styleQvgaImg;
            img.style.zIndex = -1;
            if(!isUhdPage){
                img.src = (timerStop == true ) ? request_snapshot + "&resolution="+giResol + "&n=" + (++imageNo) : "";
            }else{
                let vcodec = ""
                if(vipflg == "ip1"){
                    vcodec = "&vcodec=jpeg"
                }else{
                    if(vch1 == 1){
                        vcodec = "&vcodec=jpeg_2"
                    }else{
                        vcodec = "&vcodec=jpeg_3"
                    }
                }
                img.src = (timerStop == true ) ? request_snapshot + vcodec + "&resolution="+giResol + "&n=" + (++imageNo) : "";
            }

            img.className = "liveImg_1";
            img.onload = _self.img_onload;
            img.onerror = function(){
                img.onload = _self.img_onload;
            }
        }catch (e){
            img.onload = _self.img_onload;
        }
    };

    this.img_onload = function (img) {
        try{
            _tally.style.visibility = "visible";
            this.style.zIndex = imageNo;
            now_fps++;

            var interval = (1000 / max_fps) - adjust;

            if (max_fps < 15) interval -= 15;
            else if (max_fps < 30) interval -= 5;

            if (interval < 0) interval = 0;

            if (!bDebug) {
                setTimeout(_self.create_img, interval);
            }
            else {
                _self.create_img();

            }
        }catch (e) {

        }
    };
    this.timerStop = function(){
        timerStop = false;
        imageNo = 0;
    };
    this.timerstart = function(){
        timerStop = true;
    };
}
