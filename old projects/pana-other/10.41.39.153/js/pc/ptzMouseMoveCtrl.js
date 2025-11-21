var ptzDownFlag = false;
var whichCircleFlag = 0;
var ptzMMCji = new Image(); // inner picture
var ptzMMCjo = new Image(); // outer picture
//target position
var ptzMMCjx = 0,
    ptzMMCjy = 0;
var thisMouseActiveId = null;

var ptzMMCjoystick = null; //canvas
var ptzMMCjosize = null; //outer picture size : d = 2r
var ptzMMCjisize = null; //inner picture size : d = 2r
var ptzMMCcenterX = null; //center position : x
var ptzMMCcenterY = null; //center position : y
var ptzMMCjc = null;//canvas

var ptzMMCjoystick2 = null;//canvas
var ptzMMCjosize2 = null;//outer picture size
var ptzMMCjisize2 = null;//inner picture size
var ptzMMCcenterX2 = null;//center position : x
var ptzMMCcenterY2 = null;//center position : y
var ptzMMCjc2 = null;//canvas

var ptzMMCjoystick3 = null;//canvas
var ptzMMCjosize3 = null;//outer picture size
var ptzMMCjisize3 = null;//inner picture size
var ptzMMCcenterX3 = null;//center position : x
var ptzMMCcenterY3 = null;//center position : y
var ptzMMCjc3 = null;//canvas

function ptzMouseMoveCtrl() {
    //control_ptz
    if (document.getElementById('control_ptz')) {
        ptzMMCjoystick = document.getElementById('control_ptz'); //canvas
        ptzMMCjosize = ptzMMCjoystick.height; //outer picture size : d = 2r
        ptzMMCjisize = ptzMMCjosize * 0.31; //inner picture size : d = 2r
        ptzMMCcenterX = ptzMMCjosize / 2; //center position : x
        ptzMMCcenterY = ptzMMCjosize / 2; //center position : y
        ptzMMCjc = ptzMMCjoystick.getContext('2d'); //canvas
    }
    //window_ptz
    if (document.getElementById('window_ptz')) {
        ptzMMCjoystick2 = document.getElementById('window_ptz'); //canvas
        ptzMMCjosize2 = ptzMMCjoystick2.height; //outer picture size
        ptzMMCjisize2 = ptzMMCjosize2 * 0.31; //inner picture size
        ptzMMCcenterX2 = ptzMMCjosize2 / 2; //center position : x
        ptzMMCcenterY2 = ptzMMCjosize2 / 2; //center position : y
        ptzMMCjc2 = ptzMMCjoystick2.getContext('2d'); //canvas
    }
    // crop_control
    if (document.getElementById('control_crop')) {
        ptzMMCjoystick3 = document.getElementById('control_crop'); //canvas
        ptzMMCjosize3 = ptzMMCjoystick3.height; //outer picture size
        ptzMMCjisize3 = ptzMMCjosize3 * 0.31; //inner picture size
        ptzMMCcenterX3 = ptzMMCjosize3 / 2; //center position : x
        ptzMMCcenterY3 = ptzMMCjosize3 / 2; //center position : y
        ptzMMCjc3 = ptzMMCjoystick3.getContext('2d'); //canvas
    }
// インスタントアニメーション、IEとの互換性
    if (!window.requestAnimationFrame) {
        var lastTime = 0;
        window.requestAnimationFrame = function (callback) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16.7 - (currTime - lastTime));
            var id = window.setTimeout(function () {
                callback(currTime + timeToCall);
            }, timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        }
    }
    if (!window.cancelAnimationFrame) {
        window.cancelAnimationFrame = function (id) {
            clearTimeout(id);
        };
    }

//picture onload
    ptzMMCji.onload = function () {
        if (document.getElementById('control_ptz')) {
            ptzMMCjc.drawImage(ptzMMCji, ptzMMCcenterX - ptzMMCjisize / 2, ptzMMCcenterY - ptzMMCjisize / 2, ptzMMCjisize, ptzMMCjisize); //first draw inner picture
        }
        if (document.getElementById('window_ptz')) {
            ptzMMCjc2.drawImage(ptzMMCji, ptzMMCcenterX2 - ptzMMCjisize2 / 2, ptzMMCcenterY2 - ptzMMCjisize2 / 2, ptzMMCjisize2, ptzMMCjisize2); //first draw inner picture
        }
        if (document.getElementById('control_crop')) {
            ptzMMCjc3.drawImage(ptzMMCji, ptzMMCcenterX3 - ptzMMCjisize3 / 2, ptzMMCcenterY3 - ptzMMCjisize3/ 2, ptzMMCjisize3, ptzMMCjisize3); //first draw inner picture
        }
    }
    ptzMMCjo.onload = function () {
        if (document.getElementById('control_ptz')) {
            ptzMMCjc.drawImage(ptzMMCjo, ptzMMCcenterX - ptzMMCjosize / 2, ptzMMCcenterY - ptzMMCjosize / 2, ptzMMCjosize, ptzMMCjosize); //first draw outer picture
        }
        if (document.getElementById('window_ptz')) {
            ptzMMCjc2.drawImage(ptzMMCjo, ptzMMCcenterX2 - ptzMMCjosize2 / 2, ptzMMCcenterY2 - ptzMMCjosize2 / 2, ptzMMCjosize2, ptzMMCjosize2);//first draw outer picture
        }
        if(document.getElementById('control_crop')){
            ptzMMCjc3.drawImage(ptzMMCjo, ptzMMCcenterX3 - ptzMMCjosize3 / 2, ptzMMCcenterY3 - ptzMMCjosize3 / 2, ptzMMCjosize3, ptzMMCjosize3);
        }
    }
}

//draw function
function ptzMMCmove() {
    if (document.getElementById('control_ptz')) {
        ptzMMCjc.clearRect(ptzMMCcenterX - ptzMMCjosize / 2, ptzMMCcenterY - ptzMMCjosize / 2, ptzMMCjosize, ptzMMCjosize); //clear canvas
        ptzMMCjc.drawImage(ptzMMCjo, ptzMMCcenterX - ptzMMCjosize / 2, ptzMMCcenterY - ptzMMCjosize / 2, ptzMMCjosize, ptzMMCjosize); //draw outer picture
        ptzMMCjc.drawImage(ptzMMCji, ptzMMCcenterX - ptzMMCjisize / 2 + ptzMMCjx, ptzMMCcenterY - ptzMMCjisize / 2 + ptzMMCjy, ptzMMCjisize, ptzMMCjisize); //draw inner picture
    }
    if (document.getElementById('window_ptz')) {
        ptzMMCjc2.clearRect(ptzMMCcenterX2 - ptzMMCjosize2 / 2, ptzMMCcenterY2 - ptzMMCjosize2 / 2, ptzMMCjosize2, ptzMMCjosize2); //clear canvas
        ptzMMCjc2.drawImage(ptzMMCjo, ptzMMCcenterX2 - ptzMMCjosize2 / 2, ptzMMCcenterY2 - ptzMMCjosize2 / 2, ptzMMCjosize2, ptzMMCjosize2); //draw outer picture
        ptzMMCjc2.drawImage(ptzMMCji, (ptzMMCcenterX2 - ptzMMCjisize2 / 2 + ptzMMCjx), (ptzMMCcenterY2 - ptzMMCjisize2 / 2 + ptzMMCjy), ptzMMCjisize2, ptzMMCjisize2); //draw inner picture
    }
    if (document.getElementById('control_crop')) {
        ptzMMCjc3.clearRect(ptzMMCcenterX3 - ptzMMCjosize3 / 2, ptzMMCcenterY3 - ptzMMCjosize3 / 2, ptzMMCjosize3, ptzMMCjosize3); //clear canvas
        ptzMMCjc3.drawImage(ptzMMCjo, ptzMMCcenterX3 - ptzMMCjosize3 / 2, ptzMMCcenterY3 - ptzMMCjosize3 / 2, ptzMMCjosize3, ptzMMCjosize3); //draw outer picture
        ptzMMCjc3.drawImage(ptzMMCji, ptzMMCcenterX3 - ptzMMCjisize3 / 2 + ptzMMCjx, ptzMMCcenterY3 - ptzMMCjisize3 / 2 + ptzMMCjy, ptzMMCjisize3, ptzMMCjisize3); //draw inner picture
    }
}

ptzMMCji.src = '/css/pc/parts/cc_ptz_joystick_knob_pressed.png';
ptzMMCjo.src = '/css/pc/parts/cc_ptz_joystick_base.png';

//window.onload
function ptzMMCload() {
    if (document.getElementById('control_ptz')) {
        // document.getElementById("control_ptz").addEventListener('mousedown', touchEle, false);
        // document.getElementById("control_ptz").addEventListener('mouseup', touchEle, false);
        // document.getElementById("control_ptz").addEventListener('mousemove', touchEle, false);
        // document.getElementById("control_ptz").addEventListener('mouseout', touchEle, false);
        document.getElementById("control_ptz").addEventListener('touchstart', touch, false);
        document.getElementById("control_ptz").addEventListener('touchmove', touch, false);
        document.getElementById("control_ptz").addEventListener('touchend', touch, false);
    }
    if (document.getElementById('window_ptz')) {
        // document.getElementById("window_ptz").addEventListener('mousedown', touchEle, false);
        // document.getElementById("window_ptz").addEventListener('mouseup', touchEle, false);
        // document.getElementById("window_ptz").addEventListener('mousemove', touchEle, false);
        // document.getElementById("window_ptz").addEventListener('mouseout', touchEle, false);
        document.getElementById("window_ptz").addEventListener('touchstart', touch, false);
        document.getElementById("window_ptz").addEventListener('touchmove', touch, false);
        document.getElementById("window_ptz").addEventListener('touchend', touch, false);
    }
    if (document.getElementById('control_crop')) {
        // document.getElementById("control_crop").addEventListener('mousedown', touchEle, false);
        // document.getElementById("control_crop").addEventListener('mouseup', touchEle, false);
        // document.getElementById("control_crop").addEventListener('mousemove', touchEle, false);
        // document.getElementById("control_crop").addEventListener('mouseout', touchEle, false);
        document.getElementById("control_crop").addEventListener('touchstart', touch, false);
        document.getElementById("control_crop").addEventListener('touchmove', touch, false);
        document.getElementById("control_crop").addEventListener('touchend', touch, false);
    }

    //When mouse out,judge if we close the ptz_circle or not.
    document.addEventListener('mouseup', docTouchEle, false);
    document.addEventListener('mousemove', docTouchEle, false);
    document.addEventListener('touchend', doTouch,  { passive: false });
    document.addEventListener('touchmove', doTouch,  { passive: false });
    try{
        document.getElementById('mainViewHtml').contentWindow.document.addEventListener('mouseup', docTouchEle, false);
        document.getElementById('mainViewHtml').contentWindow.document.addEventListener('mousemove', docTouchEle, false);
        document.getElementById('mainViewHtml').contentWindow.document.addEventListener('touchend', doTouch, false);
        document.getElementById('mainViewHtml').contentWindow.document.addEventListener('touchmove', doTouch, false);
    }catch (e){}

    /*-------------------------Touch feature Append(End)---------------------------------*/
    function doTouch(e) {
        if( Platform.isTouchMode()){
            ptzMMCjoystick3 = document.getElementById('control_crop'); //canvas
            if (ptzMMCjoystick3.width != 232 ) {
                ptzMMCjoystick3.width = 232;
                ptzMMCjoystick3.height = 232;
                ptzMMCjosize3 = ptzMMCjoystick3.height; //outer picture size
                ptzMMCjisize3 = ptzMMCjosize3 * 0.31; //inner picture size
                ptzMMCcenterX3 = ptzMMCjosize3 / 2; //center position : x
                ptzMMCcenterY3 = ptzMMCjosize3 / 2; //center position : y
                ptzMMCjc3 = ptzMMCjoystick3.getContext('2d'); //canvas
            }
        }else{
            ptzMMCjoystick3 = document.getElementById('control_crop'); //canvas
            if (ptzMMCjoystick3.width != 160) {
                ptzMMCjoystick3.width = 160;
                ptzMMCjoystick3.height = 160;
                ptzMMCjosize3 = ptzMMCjoystick3.height; //outer picture size
                ptzMMCjisize3 = ptzMMCjosize3 * 0.31; //inner picture size
                ptzMMCcenterX3 = ptzMMCjosize3 / 2; //center position : x
                ptzMMCcenterY3 = ptzMMCjosize3 / 2; //center position : y
                ptzMMCjc3 = ptzMMCjoystick3.getContext('2d'); //canvas
            }
        }

        switch (e.type) {
            case "touchstart":
                var touch = e.targetTouches[0];
                var sx = touch.pageX;
                var sy = touch.pageY;

                if (thisMouseActiveId == "control_ptz") {
                    controlEleMove("control_ptz", ptzMMCjosize, ptzMMCjisize, ptzMMCcenterX, ptzMMCcenterY,sx,sy);
                } else if (thisMouseActiveId == "window_ptz") {
                    controlEleMove("window_ptz", ptzMMCjosize2, ptzMMCjisize2, ptzMMCcenterX2, ptzMMCcenterY2,sx,sy);
                }else if (thisMouseActiveId == "control_crop") {
                    controlEleMove("control_crop", ptzMMCjosize3, ptzMMCjisize3, ptzMMCcenterX3, ptzMMCcenterY3,sx,sy);
                }
                break;
            case "touchend":
                pcOperationFlag = false;
                window.frames["mainViewHtml"].mainViewOperationFlag=false;
                if(!ptzDownFlag)return;
                ptzDownFlag = false;
                whichCircleFlag == 0;
                ptzMMCjx = 0;
                ptzMMCjy = 0;

                if (ptzCircleCloseFlag) { // now close
                    // doNothing
                } else {
                    ptzCircleCloseFlag = true;
                    ptzMMCji.src = '/css/pc/parts/L_cc_ptz_joystick_knob_pressed.png';
                    if (thisMouseActiveId == "control_ptz") {
                        $("#camera_controller_gui_ptz").show();
                        $("#camera_ptz_ctrl2").hide();
                        sentCircleCgi(50,50,false);
                    } else if (thisMouseActiveId == "window_ptz") {
                        $("#camera_controller_gui_ptz").show();
                        $("#window_ptz_ctrl2").hide();
                        sentCircleCgi(50,50,false);
                    } else if(thisMouseActiveId == "control_crop") {
                        $("#setup_crop_ptz_ctrl").show();
                        $("#crop_control").hide();
                        sentCircleCgi(50,50,true);
                    }
                }
                break;
            case "touchmove":
                if (ptzDownFlag) {
                    e.preventDefault();
                    var touch = e.targetTouches[0];
                    var dx = touch.pageX;
                    var dy = touch.pageY;
                    ptzMMCmove();
                    if (whichCircleFlag == 1) {
                        controlEleMove("control_ptz", ptzMMCjosize, ptzMMCjisize, ptzMMCcenterX, ptzMMCcenterY,dx,dy);
                        controlPtzCgi("control_ptz", ptzMMCjosize, ptzMMCjisize, ptzMMCcenterX, ptzMMCcenterY,false,dx,dy);
                    } else if (whichCircleFlag == 2) {
                        controlEleMove("window_ptz", ptzMMCjosize2, ptzMMCjisize2, ptzMMCcenterX2, ptzMMCcenterY2,dx,dy);
                        controlPtzCgi("window_ptz", ptzMMCjosize2, ptzMMCjisize2, ptzMMCcenterX2, ptzMMCcenterY2,false,dx,dy);
                    } else if(whichCircleFlag == 3) {
                        controlEleMove("control_crop", ptzMMCjosize3, ptzMMCjisize3, ptzMMCcenterX3, ptzMMCcenterY3,dx,dy);
                        controlPtzCgi("control_crop", ptzMMCjosize3, ptzMMCjisize3, ptzMMCcenterX3, ptzMMCcenterY3,true,dx,dy);
                    }else{
                        // doNothing
                    }
                    window.requestAnimationFrame(ptzMMCmove); //next drawing
                }
                break;
        }
    }

    var tx, ty, mx, my;
    function touch(e) {
        switch (e.type) {
            case "touchstart":
                e.preventDefault();
                var touch = e.targetTouches[0];
                tx = touch.pageX;
                ty = touch.pageY;

                ptzDownFlag = true;
                controlPtzMoveTouch(tx,ty);
                break;
            case "touchmove":
                e.preventDefault();
                var touch = e.targetTouches[0];
                mx = touch.pageX;
                my = touch.pageY;

                controlPtzMoveTouch(mx,my);
                break;
            case "touchend":
                ptzMMCjx = 0;
                ptzMMCjy = 0;
                ptzDownFlag = false;
                ptzCircleCloseFlag = true;
                whichCircleFlag == 0;

                ptzMMCji.src = '/css/pc/parts/cc_ptz_joystick_knob_pressed.png';
                if (thisMouseActiveId == "control_ptz") {
                    $("#camera_controller_gui_ptz").show();
                    $("#camera_ptz_ctrl2").hide();
                    sentCircleCgi(50,50,false);
                } else if (thisMouseActiveId == "window_ptz") {
                    $("#camera_controller_gui_ptz").show();
                    $("#window_ptz_ctrl2").hide();
                    sentCircleCgi(50,50,false);
                } else if (thisMouseActiveId == "control_crop") {
                    $("#setup_crop_ptz_ctrl").show();
                    $("#crop_control").hide();
                    sentCircleCgi(50,50,true);
                } else {
                    // doNothing
                }
                break;
        }
    }

    /*-------------------------Touch feature Append(End)---------------------------------*/
    function docTouchEle(event) {
        if( Platform.isTouchMode()){
            ptzMMCjoystick3 = document.getElementById('control_crop'); //canvas
            if (ptzMMCjoystick3.width != 232 ) {
                ptzMMCjoystick3.width = 232;
                ptzMMCjoystick3.height = 232;
                ptzMMCjosize3 = ptzMMCjoystick3.height; //outer picture size
                ptzMMCjisize3 = ptzMMCjosize3 * 0.31; //inner picture size
                ptzMMCcenterX3 = ptzMMCjosize3 / 2; //center position : x
                ptzMMCcenterY3 = ptzMMCjosize3 / 2; //center position : y
                ptzMMCjc3 = ptzMMCjoystick3.getContext('2d'); //canvas
            }

        }else{
            ptzMMCjoystick3 = document.getElementById('control_crop'); //canvas
            if (ptzMMCjoystick3.width != 160 ) {
                ptzMMCjoystick3.width = 160;
                ptzMMCjoystick3.height = 160;
                ptzMMCjosize3 = ptzMMCjoystick3.height; //outer picture size
                ptzMMCjisize3 = ptzMMCjosize3 * 0.31; //inner picture size
                ptzMMCcenterX3 = ptzMMCjosize3 / 2; //center position : x
                ptzMMCcenterY3 = ptzMMCjosize3 / 2; //center position : y
                ptzMMCjc3 = ptzMMCjoystick3.getContext('2d'); //canvas
            }
        }
        switch (event.type) {
            case "mouseup":
                pcOperationFlag = false;
                window.frames["mainViewHtml"].mainViewOperationFlag=false;
                if(!ptzDownFlag)return;
                ptzDownFlag = false;
                whichCircleFlag == 0;
                ptzMMCjx = 0;
                ptzMMCjy = 0;

                if (ptzCircleCloseFlag) { // now close
                    // doNothing
                } else {
                    ptzCircleCloseFlag = true;
                    ptzMMCji.src = '/css/pc/parts/cc_ptz_joystick_knob_pressed.png';
                    if (thisMouseActiveId == "control_ptz") {
                        $("#camera_controller_gui_ptz").show();
                        $("#camera_ptz_ctrl2").hide();
                        sentCircleCgi(50,50,false);
                    } else if (thisMouseActiveId == "window_ptz") {
                        $("#camera_controller_gui_ptz").show();
                        $("#window_ptz_ctrl2").hide();
                        sentCircleCgi(50,50,false);
                    } else if(thisMouseActiveId == "control_crop") {
                        $("#setup_crop_ptz_ctrl").show();
                        $("#crop_control").hide();
                        sentCircleCgi(50,50,true);
                    }
                }
                break;
            case "mousemove":
                if (ptzDownFlag) {
                    ptzMMCmove();
                    if (whichCircleFlag == 1) {
                        controlEleMove("control_ptz", ptzMMCjosize, ptzMMCjisize, ptzMMCcenterX, ptzMMCcenterY);
                        controlPtzCgi("control_ptz", ptzMMCjosize, ptzMMCjisize, ptzMMCcenterX, ptzMMCcenterY,false);
                    } else if (whichCircleFlag == 2) {
                        controlEleMove("window_ptz", ptzMMCjosize2, ptzMMCjisize2, ptzMMCcenterX2, ptzMMCcenterY2);
                        controlPtzCgi("window_ptz", ptzMMCjosize2, ptzMMCjisize2, ptzMMCcenterX2, ptzMMCcenterY2, false);
                    } else if(whichCircleFlag == 3) {
                        controlEleMove("control_crop", ptzMMCjosize3, ptzMMCjisize3, ptzMMCcenterX3, ptzMMCcenterY3);
                        controlPtzCgi("control_crop", ptzMMCjosize3, ptzMMCjisize3, ptzMMCcenterX3, ptzMMCcenterY3, true);
                    }else{
                        // doNothing
                    }
                    window.requestAnimationFrame(ptzMMCmove); //next drawing
                }
                break;
        }
    }

    //draw inner picture when onload
    //touch event
    function touchEle(event) {
        var event = event || window.event;

        switch (event.type) {
            case "mousedown":
                ptzDownFlag = true;
                controlPtzMoveMouse();
                break;
            case "mouseup":
                ptzMMCjx = 0;
                ptzMMCjy = 0;
                ptzDownFlag = false;
                ptzCircleCloseFlag = true;
                whichCircleFlag == 0;
                ptzMMCji.src = '/css/pc/parts/cc_ptz_joystick_knob_pressed.png';
                if (thisMouseActiveId == "control_ptz") {
                    $("#camera_controller_gui_ptz").show();
                    $("#camera_ptz_ctrl2").hide();
                    sentCircleCgi(50,50,false);
                } else if (thisMouseActiveId == "window_ptz") {
                    $("#camera_controller_gui_ptz").show();
                    $("#window_ptz_ctrl2").hide();
                    sentCircleCgi(50,50,false);
                } else if (thisMouseActiveId == "control_crop") {
                    $("#setup_crop_ptz_ctrl").show();
                    $("#crop_control").hide();
                    sentCircleCgi(50,50,true);
                }else {
                    // doNothing
                }
                break;
            case "mouseout":
                ptzMMCjx = 0;
                ptzMMCjy = 0;
                if (!ptzDownFlag) {
                    ptzCircleCloseFlag = true;
                    whichCircleFlag == 0;
                    ptzMMCji.src = '/css/pc/parts/cc_ptz_joystick_knob_pressed.png';
                    if (thisMouseActiveId == "control_ptz") {
                        $("#camera_controller_gui_ptz").show();
                        $("#camera_ptz_ctrl2").hide();
                    } else if (thisMouseActiveId == "window_ptz") {
                        $("#camera_controller_gui_ptz").show();
                        $("#window_ptz_ctrl2").hide();
                    } else if (thisMouseActiveId == "control_crop") {
                        $("#setup_crop_ptz_ctrl").show();
                        $("#crop_control").hide();
                    } else {
                        // doNothing
                    }
                }
                break;
            case "mousemove":
                controlPtzMoveMouse();
                break;
        }
    }
}

function controlPtzMoveTouch(cXValue,cYValue){
    if (ptzDownFlag) {
        ptzMMCmove();
        if (thisMouseActiveId == "control_ptz") {
            controlEleMove("control_ptz", ptzMMCjosize, ptzMMCjisize, ptzMMCcenterX, ptzMMCcenterY,cXValue,cYValue);
            whichCircleFlag = 1;
            controlPtzCgi("control_ptz", ptzMMCjosize, ptzMMCjisize, ptzMMCcenterX, ptzMMCcenterY,false,cXValue,cYValue);
        } else if (thisMouseActiveId == "window_ptz") {
            controlEleMove("window_ptz", ptzMMCjosize2, ptzMMCjisize2, ptzMMCcenterX2, ptzMMCcenterY2,cXValue,cYValue);
            whichCircleFlag = 2;
            controlPtzCgi("window_ptz", ptzMMCjosize2, ptzMMCjisize2, ptzMMCcenterX2, ptzMMCcenterY2,false,cXValue,cYValue);
        }else if (thisMouseActiveId == "control_crop") {
            controlEleMove("control_crop", ptzMMCjosize3, ptzMMCjisize3, ptzMMCcenterX3, ptzMMCcenterY3,cXValue,cYValue);
            whichCircleFlag = 3;
            controlPtzCgi("control_crop", ptzMMCjosize3, ptzMMCjisize3, ptzMMCcenterX3, ptzMMCcenterY3,true,cXValue,cYValue);
        }
        window.requestAnimationFrame(ptzMMCmove); //next drawing
    }
}

function controlPtzMoveMouse(){
    if (ptzDownFlag) {
        ptzMMCmove();
        if (thisMouseActiveId == "control_ptz") {
            controlEleMove("control_ptz", ptzMMCjosize, ptzMMCjisize, ptzMMCcenterX, ptzMMCcenterY);
            whichCircleFlag = 1;
            controlPtzCgi("control_ptz", ptzMMCjosize, ptzMMCjisize, ptzMMCcenterX, ptzMMCcenterY,false);
        } else if (thisMouseActiveId == "window_ptz") {
            controlEleMove("window_ptz", ptzMMCjosize2, ptzMMCjisize2, ptzMMCcenterX2, ptzMMCcenterY2);
            whichCircleFlag = 2;
            controlPtzCgi("window_ptz", ptzMMCjosize2, ptzMMCjisize2, ptzMMCcenterX2, ptzMMCcenterY2,false);
        }else if (thisMouseActiveId == "control_crop") {
            controlEleMove("control_crop", ptzMMCjosize3, ptzMMCjisize3, ptzMMCcenterX3, ptzMMCcenterY3);
            whichCircleFlag = 3;
            controlPtzCgi("control_crop", ptzMMCjosize3, ptzMMCjisize3, ptzMMCcenterX3, ptzMMCcenterY3, true);
        }
        window.requestAnimationFrame(ptzMMCmove); //next drawing

    }
}

function controlEleMove(id, ptzMMCjosize, ptzMMCjisize, ptzMMCcenterX, ptzMMCcenterY,cXValue,cYValue) {
    if(id == "control_ptz"){
        var eid = "camera_ptz_ctrl2";
    }else if(id == "window_ptz"){
        var eid = id + "_ctrl2";
    }else if(id == "control_crop"){
        var eid = "crop_control";
    }
    var boxClientX = document.getElementById(eid).getBoundingClientRect().left / currentZoomValue;
    var boxClientY = document.getElementById(eid).getBoundingClientRect().top / currentZoomValue;
    if(arguments.length == 5) {
        if (window.event) {
            var clientXValue = window.event.clientX / currentZoomValue;
            var clientYValue = window.event.clientY / currentZoomValue;
        } else {
            var clientXValue = (document.getElementById('mainViewHtml').contentWindow.event.clientX) + (document.getElementById('tracking_controller').offsetLeft);
            var clientYValue = (document.getElementById('mainViewHtml').contentWindow.event.clientY) + (document.getElementById('tracking_controller').offsetTop + document.body.scrollTop);
        }
    } else if(arguments.length == 7) {
        var clientXValue = cXValue / currentZoomValue;
        var clientYValue = cYValue / currentZoomValue;
    }
    if (Math.sqrt(Math.pow(clientXValue - boxClientX - ptzMMCjosize / 2, 2) + Math.pow(clientYValue - boxClientY - ptzMMCjosize / 2, 2)) <= (ptzMMCjosize-ptzMMCjisize / 1.5) / 2) {
        ptzMMCjx = clientXValue - boxClientX - ptzMMCjosize / 2;
        ptzMMCjy = clientYValue - boxClientY - ptzMMCjosize / 2;
    } else {
        var x = clientXValue - boxClientX - ptzMMCjosize / 2,
            y = clientYValue - boxClientY - ptzMMCjosize / 2,
            r = (ptzMMCjosize-ptzMMCjisize / 1.5) / 2;
        var ans = GetPoint(0, 0, r, 0, 0, x, y);
        if (Math.sqrt((ans[0] - x) * (ans[0] - x) + (ans[1] - y) * (ans[1] - y)) < Math.sqrt((ans[2] - x) * (ans[2] - x) + (ans[3] - y) * (ans[3] - y))) {
            ptzMMCjx = ans[0] ;
            ptzMMCjy = ans[1] ;
        } else {
            ptzMMCjx = ans[2] ;
            ptzMMCjy = ans[3] ;
        }
    }
}

function controlPtzCgi(id, ptzMMCjosize, ptzMMCjisize, ptzMMCcenterX, ptzMMCcenterY,flg,cXValue,cYValue) {
    if(id == "control_ptz"){
        var eid = "camera_ptz_ctrl2";
    }else if(id == "window_ptz"){
        var eid = id + "_ctrl2";
    }else if(id == "control_crop"){
        var eid = "crop_control";
    }

    //調整係数は、境界の範囲を小さくするために、指定された範囲に近づくようにする。(1-99)
    ptzMMCjisize = ptzMMCjosize * 0.05;

    // ptzMMCjosize/98   (1-49,51-99)
    var boxClientX = document.getElementById(eid).getBoundingClientRect().left / currentZoomValue;   // X(0,0)
    var boxClientY = document.getElementById(eid).getBoundingClientRect().top / currentZoomValue;
    if(arguments.length == 6) {
        if (window.event) {
            var clientXValue = window.event.clientX / currentZoomValue;
            var clientYValue = window.event.clientY / currentZoomValue;
        } else {
            var clientXValue = (document.getElementById('mainViewHtml').contentWindow.event.clientX + document.getElementById('tracking_controller').offsetLeft);
            var clientYValue = (document.getElementById('mainViewHtml').contentWindow.event.clientY + document.getElementById('tracking_controller').offsetTop + document.body.scrollTop);
        }
    }else if(arguments.length == 8){
        var clientXValue = cXValue / currentZoomValue;
        var clientYValue = cYValue / currentZoomValue;
    }

    var cgiX = 50; // stop cgi
    var cgiY = 50; // stop cgi
    if (Math.sqrt(Math.pow(clientXValue - boxClientX - ptzMMCjosize / 2, 2) + Math.pow(clientYValue - boxClientY - ptzMMCjosize / 2, 2)) <= ptzMMCjosize / 2 - ptzMMCjisize / 3) {
        cgiX += Number((clientXValue - ptzMMCcenterX - boxClientX)/ptzMMCjosize * 98);
        cgiY -= Number((clientYValue - ptzMMCcenterY - boxClientY)/ptzMMCjosize * 98);
    }else{
        var x = clientXValue - boxClientX,
            y = clientYValue - boxClientY,
            r = ptzMMCjosize / 2 - ptzMMCjisize / 3;

        var ans = GetPoint(ptzMMCcenterX, ptzMMCcenterY, r, ptzMMCcenterX, ptzMMCcenterY, x, y);

        if(Math.sqrt((ans[0] - x) * (ans[0] - x) + (ans[1] - y) * (ans[1] - y)) < Math.sqrt((ans[2] - x) * (ans[2] - x) + (ans[3] - y) * (ans[3] - y))) {
           cgiX += Number((ans[0] - ptzMMCcenterX)/ptzMMCjosize*98);
           cgiY += Number((ptzMMCjosize - ans[1] - ptzMMCcenterY)/ptzMMCjosize*98);
        } else {
            cgiX += Number((ans[2] - ptzMMCcenterX)/ptzMMCjosize*98);
            cgiY += Number((ptzMMCjosize - ans[3] - ptzMMCcenterY)/ptzMMCjosize*98);
        }
    }

    sentCircleCgi(cgiX,cgiY,flg);
}

/**
 * When mouse out,get the point.
 */
function GetPoint(cx, cy, r, stx, sty, edx, edy) {
    var k = (edy - sty) / (edx - stx);
    var b = edy - k * edx;
    var x1, y1, x2, y2;
    var c = cx * cx + (b - cy) * (b - cy) - r * r;
    var a = (1 + k * k);
    var b1 = (2 * cx - 2 * k * (b - cy));

    var tmp = Math.sqrt(b1 * b1 - 4 * a * c);

    x1 = (b1 + tmp) / (2 * a);
    y1 = k * x1 + b;

    x2 = (b1 - tmp) / (2 * a);
    y2 = k * x2 + b;

    return [x1, y1, x2, y2];
}

function sentCircleCgi(cgiX,cgiY,flg) {
    cgiX = Math.round(cgiX);
    cgiY = Math.round(cgiY);
    if(flg){
        cparam_set_CropHVPositionSpeedContro(cgiX, cgiY);
    }else{
        cparam_set_panTiltSpeedControl(cgiX, cgiY);
    }
}