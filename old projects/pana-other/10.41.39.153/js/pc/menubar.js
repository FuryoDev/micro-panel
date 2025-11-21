/**
 * @fileOverview ログイン後のMENUBAR画面：menubarCtrl Areaを定義
 *
 * @author Panasonic Corporation
 */

/**
 * カメラリスト領域制御クラスインスタンス
 * @type {menubarCtrl}
 */
var menubarCtrl = Menubar();

var MenubarStreamCtrl = MenubarStream();
/**
 * カメラリスト領域制御クラス
 * @class カメラリスト領域制御クラス
 * @return {function} build 構築処理
 * @return {function} rebuild 再構築処理
 * @return {function} show 表示処理
 * @constructor
 */

function Menubar() {
     /**
     * stream/image処理制御クラスのインスタンス
     * @type StreamControler
     */
    var streamControler = MenubarStream();

    /**
     * OSD処理制御クラスのインスタンス
     * @type OsdControler
     */
    var osdControler = MenubarOsd();

    /**
     * 構築済みフラグ
     * @type boolean
     */
    var buildFlag = false;

    /**
     * btn_stream_menu(インデックス値)
     * @type number
     */
    var BTN_STREAM_MENU = 0;
    /**
     * btn_other_menu(インデックス値)
     * @type number
     */
    var BTN_OTHER_MENU = 1;

    /**
     * btn_other_menu(インデックス値)
     * @type number
     */
    var BTN_SHOW_MENU = 3;

    /**
     * btn_other_menu(インデックス値)
     * @type number
     */
    var BTN_SHOW_MENU_RIGHT = 5;

    /**
     * ボタンオブジェクト
     * @type ButtonCtrl[]
     */
    var btnObject = [];
    var gGammaMode = cparam_get_gammaMode();
    var sysFormat = cparam_get_format();

    var gTimerInterval_30s;
    var gTimerInterval_30s_gamamode;
    var gTimerInterval_5s;
    var gTimerInterval_1s;
    var txtObject = [];
    var TXT_MEUN_TITLE;
    var voip = objVOIP;
    var crop = cparam_get_UHDCrop();
    var arr = [];
    for (var i in voip) {
        arr.push(voip[i]); //属性
    }

    /**
     * menubar領域の構築処理
     */
    function build() {
        // 共通エリアの構築
        if (buildFlag == false) {
            buildFlag = true;
            txtObject[TXT_MEUN_TITLE] = TextCtrl("base_main_live_view", "base_main_live_view", NPTZ_WORDING.wID_0042);
            txtObject[TXT_MEUN_TITLE].show();
            $('#camera_stream_menu').append($('<div class="wrapper_btn" id="wrapper_btn_compression"></div>'));
            btnObject[BTN_STREAM_MENU] = ButtonCtrl('camera_live_area', 'stream_menu', NPTZ_WORDING.wID_0044, callBtnStreamMenu);
            btnObject[BTN_OTHER_MENU] = ButtonCtrl('camera_live_area', 'other_menu', NPTZ_WORDING.wID_0045, callBtnOsdMenu);
            $(".live_menu").attr('id',"btn_live_menu");
            $(".stream_menu").attr('id', "stream_menu");
            $(".other_menu").attr('id', "other_menu");

            streamControler.build();
            osdControler.build();
            if(gPower == 1){
                if(window.location.href.indexOf("live") !="-1"){
                    if(adminPage){
                        setInterval(function(){
                            if(window.parent.document.getElementById("camera_controller_gui_left").style.display != "none"){
                                checkStreamMode();
                            }
                        },30000);
                        gTimerInterval_5s = setInterval(startTimerInterval_5s, 5000);
                        return;
                    }
                }
                startInterval();
            }
        }
    }

    function startTimerInterval_30s(){
        if(document.getElementById("main_gui").style.display == "none"){
            clearInterval(gTimerInterval_30s);
            return;
        }
        checkStreamMode();
        getFormat();
        getInstallPosition();
        checkVideoOverIp();
        checkUHDCrop();

    }

    function startTimerInterval_30s_gamma(){
        //3805 	不具合管理 修正しました
        var getMode = cparam_get_gammaMode();
        if(gGammaMode == 7 && getMode != 7){
            location.reload();
        }
        if(gGammaMode!= 7 && getMode == 7){
            location.reload();
        }
    }

    function checkVideoOverIp(){
        objVOIP = cparam_getVideoOverIpInfo();
        var newArr = [];
        for (var i in objVOIP) {
            newArr.push(objVOIP[i]);
        }
        if(newArr.toString() != arr.toString()){
            location.reload(true);
        }
    }

    function checkUHDCrop(){
        uHDCropMode = cparam_get_UHDCrop();
        if(crop != uHDCropMode){
            location.reload(true);
        }
    }

    function getInstallPosition(){
        gInstall_Position = cparam_get_installPosition();
    }
    function startTimerInterval_5s(){
        if(document.getElementById("main_gui").style.display == "none"){
            clearInterval(gTimerInterval_5s);
            return;
        }

        const lock = $('#power').prop("disabled");
        if(!lock && gPower != 0) {


            if( sysStreamMode == 'srt_h264' || sysStreamMode == 'srt_h264_uhd' || sysStreamMode == 'srt_h265' || sysStreamMode == 'srt_h265_uhd'){
                if (reqCgiObj.srtStatus == '0') {
                    cameraControllerSetting.imageControlButton.setStopButtonStart();
                } else {
                    cameraControllerSetting.imageControlButton.setStopButtonStop();
                }
            }else if(sysStreamMode == 'rtmp' || sysStreamMode == 'rtmp_uhd'){
                if (reqCgiObj.rtmpStatus == '0') {
                    cameraControllerSetting.imageControlButton.setStopButtonStart();
                } else {
                    cameraControllerSetting.imageControlButton.setStopButtonStop();
                }
            }else if(sysStreamMode == 'ts_udp'){
                if (reqCgiObj.udpStatus == '0') {
                    cameraControllerSetting.imageControlButton.setStopButtonStart();
                } else {
                    cameraControllerSetting.imageControlButton.setStopButtonStop();
                }
            }else if (IsIE() && (gCurrentStreamMode == 'ndi_hx' || gCurrentStreamMode == 'h264_uhd')) {  //check #3502
                if (menubarCtrl.menubar_GetCodecMode() == "h264") {
                    streamControler.menubarStreamBtnDisabled();
                }
            } else {
                cameraControllerSetting.imageControlButton.setStopButtonDisable();
            }
            if (uHDCropMode != 0 || reqCgiObj.bar == 1 || reqCgiObj.getFocus == 1) {
                cameraControllerSetting.zoomSpeedFocusCtrlButton.disableTouch_AF_Button();
                if(cameraControllerSetting.getPtzAreaCtrlFlag() == true) {
                    if (window.parent.gBTN_TOUCH_F_status == 1) {
                        $("#camera_ptz_touch_label").hide();
                    }
                }
            } else {
                if (window.parent.gBTN_TOUCH_F_status == 1) {
                    if(cameraControllerSetting.getPtzAreaCtrlFlag() == true) {
                        if(Platform.isTouchMode()){
                            $("#camera_ptz_touch_label").hide();
                        }else {
                            $("#camera_ptz_touch_label").show();
                        }
                    }
                    cameraControllerSetting.zoomSpeedFocusCtrlButton.btnTonchDisplayOn()
                } else {
                    cameraControllerSetting.zoomSpeedFocusCtrlButton.undisableTouch_AF_Button();
                }
            }
        }

        if (reqCgiObj.streamStatus == '1') {
            $("#stream_status").removeClass('off').addClass('on');
        } else {
            $("#stream_status").removeClass('on').addClass('off');
        }
        if (reqCgiObj.syncStatus == '1') {
            $("#sync_status").removeClass('off').addClass('on');
        } else {
            $("#sync_status").removeClass('on').addClass('off');
        }
        if(!IsIE()){
            //青画対応
            streamControler.changeViewStatus();
            //黒画対応
            streamControler.checkBlackView();
        }
    }

    function startInterval(){
        gAudio = setInterval(getAudio, 30000);
        uHDCropMode = crop;
        gTimerInterval_30s= setInterval(startTimerInterval_30s, 30000);
        gTimerInterval_30s_gamamode= setInterval(startTimerInterval_30s_gamma, 30000);
        gTimerInterval_5s = setInterval(startTimerInterval_5s, 5000);
        gTimerInterval_1s = setInterval(startTimerInterval_1s,1000);
    }

    function startTimerInterval_1s(){
        if(document.getElementById("main_gui").style.display == "none"){
            clearInterval(gTimerInterval_1s);
            return;
        }
        if(!pcOperationFlag && liveModeFlg){
            getDZoomMagnification();
        }

    }

    function getDZoomMagnification(){
        gD_Zoom_Magnification = reqCgiObj.dZoomM;
    }

    function getFormat(){
        var format = cparam_get_format();
        if(sysFormat != format){
            location.reload();
        }
    }

    function checkStreamMode() {
        sStreamMode = getStreamMode();
        if(sysStreamMode != sStreamMode) {
            if(window.parent.location.href.indexOf("admin") !="-1"){
                sysStreamMode = sStreamMode
            }else{
                location.reload();
            }

        }
    }
    function getStreamMode() {
        var retValue ;
        $.ajax({
            type: "get",
            url: "/cgi-bin/get_stream_mode",
            async: false,
            timeout: 100,
            success: function (data) {
                if (data.indexOf("stream_mode") == 0) {
                    retValue = data.substring("stream_mode".length + 1, data.length - 2);
                    gCurrentStreamMode = retValue;
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
            }
        });
        return retValue;
    }
    cparam_updateAudio();
    function getAudio(){
        if(liveModeFlg){
            cparam_updateAudio();
        }
    }
    /**
     * menubar領域の表示処理
     */
    function show() {
        if(gPower == 1){
            for (var btn in btnObject) {
                btnObject[btn].show();
                btnObject[btn].displayOff();
            }
            btnObject[BTN_STREAM_MENU].displayOn();
            streamControler.show();
            osdControler.show();
        }else{

            streamControler.show();
            osdControler.show();
            streamControler.menubarBtnDisabled();
            for (var btn in btnObject) {
                btnObject[btn].show();
                btnObject[btn].displayDisabled();
            }
        }
    }

    function btnDisabled() {
        for (var btn in btnObject) {
            btnObject[btn].displayDisabled();
        }
    }

    function btnDisplayOff() {
        for (var btn in btnObject) {
            btnObject[btn].displayOff();
        }

        if( $("#camera_osd_menu").css("display") == 'none' ){
            btnObject[BTN_STREAM_MENU].displayOn();
            btnObject[BTN_OTHER_MENU].displayOff();
        }
        else {
            btnObject[BTN_STREAM_MENU].displayOff();
            btnObject[BTN_OTHER_MENU].displayOn();
        }
    }

    /**
     * StreamMenu 押下時の画面制御
     * @param {number} mouse マウス・ボタン操作状況
     */
    function callBtnStreamMenu(mouse) {
        if (mouse == Button.MOUSE_UP) {

        } else if (mouse == Button.MOUSE_DOWN) {
            if ($("#camera_stream_menu").css("display") != "none") {
            } else if ($("#camera_stream_menu").css("display") == "none") {
                $("#camera_stream_menu")[0].style.display = "";
                $("#camera_osd_menu")[0].style.display = "none";
                btnObject[BTN_STREAM_MENU].displayOn();
                btnObject[BTN_OTHER_MENU].displayOff();
                //追加・変更 対応不具合 3496
                if(_cparam_cgi_info_ndihxkey()){
                    $('#divndihx').show();
                }else{
                    $('#divndihx').hide();
                }
            }
        } else {
            // 処理なし
        }
    }

    /**
     * Osd_Menu 押下時の画面制御
     * @param {number} mouse マウス・ボタン操作状況
     */
    function callBtnOsdMenu(mouse) {
        if (mouse == Button.MOUSE_UP) {

        } else if (mouse == Button.MOUSE_DOWN) {
            if ($("#camera_stream_menu").css("display") != "none") {
                $("#camera_stream_menu")[0].style.display = "none";
                $("#camera_osd_menu")[0].style.display = "";
                btnObject[BTN_STREAM_MENU].displayOff();
                btnObject[BTN_OTHER_MENU].displayOn();
                $("#divndihx").hide();

                osdControler.show();
                osdControler.callbackSelectObject().val(cparam_get_colorBarType()/*cparams['colorbar_type']*/);
            } else if ($("#camera_stream_menu").css("display") == "none") {
            }
        } else {
            // 処理なし
        }
    }

    /**
     * checkFull
     * @returns {*}
     */
    function checkFull() {
        var isFull = document.webkitIsFullScreen || window.fullScreen;

        if(capi_IsIE()){
            if(document.msFullscreenElement == null){
                isFull = false;
            }else {
                isFull= true;
            }
        }
        if (isFull === undefined) isFull = false;
        return isFull;
    }

    /**
     * BtnStream 押下時の画面制御
     * @param {number} mouse マウス・ボタン操作状況
     */
    function callbackSettingBasic(mouse) {
        if (mouse == Button.MOUSE_UP) {

        } else if (mouse == Button.MOUSE_DOWN) {
            $("#setup_basic_div").hide();
            $("#setting_image").hide();
            $("#setting_mulit").hide();
            $("#setting_user_mng").hide();
            $("#setting_network").hide();
            $("#setting_maintenance").hide();
            settingBasic.init();
        } else {
            // 処理なし
        }
    }

    function changeWidows(dis){
        currentWindowWidth = 480;
        windowsZoomControlOnResize(dis);
    }
    function getUhdCropStatus(){
        return uHDCropMode;
    }

    return {
        build: build,
        show: show,
        callbackSettingBasic: function () {
            callbackSettingBasic(Button.MOUSE_DOWN);
        },
        btnLockSetting: osdControler.btnLockSetting,
        jpegButtonChangeOn: streamControler.jpegButtonChangeOn,
        menubarBtnDisabled: streamControler.menubarBtnDisabled,
        text: osdControler.text,
        checkFull: checkFull,
        menubar_GetStreamInfo: streamControler.menubar_GetStreamInfo,  // mainView.html
        menubar_getH264SettingData: streamControler.menubar_getH264SettingData, // mainView.html
        menubar_GetStreamMode: streamControler.menubar_GetStreamMode, // mainView.html
        menubar_GetQuality: streamControler.menubar_GetQuality, // mainView.html
        menubar_GetBitrateMax: streamControler.menubar_GetBitrateMax, // mainView.html
        menubar_GetStreamNo: streamControler.menubar_GetStreamNo,// mainView.html
        menubar_GetResolution: streamControler.menubar_GetResolution,// mainView.html
        menubar_GetFramerate: streamControler.menubar_GetFramerate,// mainView.html
        GetPowerState: streamControler.GetPowerState,// mainView.html  cparam.js
        menubar_GetOpLockState: streamControler.menubar_GetOpLockState,//  cparam.js
        menubar_GetMultiMode: streamControler.menubar_GetMultiMode,// many html
        powerFlg: streamControler.powerFlg, //index.html
        menubar_GetResolution: streamControler.menubar_GetResolution, // mainView.html
        gChangeMenuFlg: streamControler.gChangeMenuFlg,
        gPower: streamControler._power,
        osdControler: osdControler,
        menubar_GetCodecMode: streamControler.menubar_GetCodecMode,
        streamControler: streamControler,
        btnDisabled: btnDisabled,
        btnDisplayOff: btnDisplayOff,
        changeWidows:changeWidows,
        clearInterval:function(){
            clearInterval(gTimerInterval_30s);
            clearInterval(gTimerInterval_5s);
            clearInterval(gTimerInterval_1s);
        },
        getStreamMode: getStreamMode,
        RequestStartLive:streamControler.RequestStartLive,
        getUhdCropStatus:getUhdCropStatus
    };
}

/**
 * カメラリスト領域制御クラス
 * @class カメラリスト領域制御クラス
 * @return {function} build 構築処理
 * @return {function} rebuild 再構築処理
 * @return {function} show 表示処理
 * @constructor
 */
function MenubarStream() {
    /**
     * 構築済みフラグ
     * @type boolean
     */
    var buildFlag = false;

    /**
     * ボタンオブジェクト
     * @type ButtonCtrl[]
     */
    var btnObject = [];

    /**
     * cls_h264(インデックス値)
     * @type number
     */
    var BTN_CLS_H264 = 0;

    /**
     * cls_jpeg(インデックス値)
     * @type number
     */
    var BTN_CLS_JPEG = 1;
    /**
     * LOCK(インデックス値)
     * @type number
     */
    var LOCK = 2;

    /**
     * ボタンオブジェクト
     * @type ButtonCtrl[]
     */
    var btnQtObject = [];

    /**
     * QT1(インデックス値)
     * @type number
     */
    var BTN_QT1 = 0;

    /**
     * QT2(インデックス値)
     * @type number
     */
    var BTN_QT2 = 1;

    /**
     * ボタンオブジェクト
     * @type ButtonCtrl[]
     */
    var btnStreamObject = [];

    /**
     * btn_stream1(インデックス値)
     * @type number
     */
    var BTN_STREAM1 = 0;

    /**
     * btn_stream2(インデックス値)
     * @type number
     */
    var BTN_STREAM2 = 1;

    /**
     * btn_stream3(インデックス値)
     * @type number
     */
    var BTN_STREAM3 = 2;

    /**
     * btn_iris(インデックス値)
     * @type number
     */
    var BTN_IRISE_SETTING = 3;

    /**
     * btn_stream4(インデックス値)
     * @type number
     */
    // var BTN_STREAM4 = 3;

    /**
     * テキストオブジェクト
     * @type {Array}
     */
    var txtObject = [];

    /**
     * compression(インデックス値)
     * @type number
     */
    var TXT_COMPRESSION = 0;

    /**
     * image_capture_size(インデックス値)
     * @type number
     */
    var TXT_IMAGE_CAPTURE_SIZE = 1;

    /**
     * image_quality(インデックス値)
     * @type number
     */
    var TXT_IMAGE_QUALITY = 2;

    /**
     * txt_ndihx(インデックス値)
     * @type {number}
     */
    var TXT_NDIHX_FIRST = 3;

    /**
     * txt_ndihx(インデックス値)
     * @type {number}
     */
    var TXT_NDIHX_SECOND = 4;

    /**
     * txt_ndihx(インデックス値)
     * @type {number}
     */
    var TXT_NDIHX_THIRD = 5;

    var gDbgMode = 0;  // ★ Debug中は 1 にする
    var gFlgLock = 0;

    var gFlgBlink = 0;
    var gFlgStopViewLoading = 0;

    var myDOM = {};
    myDOM.ajax = {};
    var _basic_info = cparam_getBasicInfo();
    var gDebug;
    var _power = gPower;
    var _live_stream = objVOIP.sStream;
    var _jt = objVOIP.jpeg_transmit1 === "1" ? 1 : 0;
    var _jt2 = objVOIP.jpeg_transmit2 === "1" ? 1 : 0;
    var _jt3 = objVOIP.jpeg_transmit3 === "1" ? 1 : 0;
    var _jr = parseInt(objVOIP.resol_stream1);
    var _jr2 = parseInt(objVOIP.resol_stream2);
    var _jr3 = parseInt(objVOIP.resol_stream3);
    var _ji = parseInt(objVOIP.jpeg_interval1);
    var _ji2 = parseInt(objVOIP.jpeg_interval2);
    var _ji3 = parseInt(objVOIP.jpeg_interval3);
    var _jpeg_base = "1";		// JPEG画質 "1"/"2"
    var _plugin_dl = _basic_info.plugin_download;
    var _ht = objVOIP.h264_transmit_ch1 === "1" ? 1 : 0;					// H264(ch1)配信 0:無効, 1:有効
    var _ht2 = objVOIP.h264_transmit_ch2 === "1" ? 1 : 0;
    var _ht3 = objVOIP.h264_transmit_ch3 === "1" ? 1 : 0;
    var _ht4 = objVOIP.h264_transmit_ch4 === "1" ? 1 : 0;
    var _mr = 0;
    var _hr = parseInt(objVOIP.h264_resolution_ch1);				// h264(ch1)解像度 [1920, 1280, 640, 320, 160]
    var _hr2 = parseInt(objVOIP.h264_resolution_ch2);				// h264(ch2)解像度 [1920, 1280, 640, 320, 160]
    var _hr3 = parseInt(objVOIP.h264_resolution_ch3);				// h264(ch3)解像度 [1920, 1280, 640, 320, 160]
    var _hr4 = parseInt(objVOIP.h264_resolution_ch4);				// h264(ch4)解像度 [1920, 1280, 640, 320, 160]
    var _h_r_mode = objVOIP.h264_rtsp_mode_ch1 === "1" ? 1 : 0;
    var _h_r_mode2 = objVOIP.h264_rtsp_mode_ch2 === "1" ? 1 : 0;
    var _h_r_mode3 = objVOIP.h264_rtsp_mode_ch3 === "1" ? 1 : 0;
    var _h_r_mode4 = objVOIP.h264_rtsp_mode_ch4 === "1" ? 1 : 0;
    var _hum = objVOIP.h264_unimulti_ch1;
    var _hum2 = objVOIP.h264_unimulti_ch2;
    var _hum3 = objVOIP.h264_unimulti_ch3;
    var _hum4 = objVOIP.h264_unimulti_ch4;
    var _mon_aspect = 0;
    var _hb = parseInt(objVOIP.h264_bandwidth_ch1);
    var _hb2 = parseInt(objVOIP.h264_bandwidth_ch2);
    var _hb3 = parseInt(objVOIP.h264_bandwidth_ch3);
    var _hb4 = parseInt(objVOIP.h264_bandwidth_ch4);
    var _event_port = "";
    var _lvl = 0;
    var gsStNo = "&stream=1";

    /* ------ 631移行分 ------------------------------------------- */
    var gsDefaultStream = _live_stream;
    var giJpegResol = 0;
    var giJpegStream1Resol = _jr;
    var giJpegStream2Resol = _jr2;
    var giJpegStream3Resol = _jr3;
    if (gsDefaultStream == "jpeg") {
        giJpegResol = giJpegStream1Resol;
    } else if (gsDefaultStream == "jpeg_2") {
        giJpegResol = giJpegStream2Resol;
    } else if (gsDefaultStream == "jpeg_3") {
        giJpegResol = giJpegStream3Resol;
    } else {
        giJpegResol = giJpegStream1Resol;
    }
    var gsJpegBaseQual = _jpeg_base;
    var gsImgRatio = "16_9";
    var gsImgcap_id = [];	//imgの取得利用
    var gStreamMode = 1;
    var gsJpegresolution;
    var gsVcodec = "";

// ----- For IP-Video ---------------------------------------

    var gbAct = true;
    var gPlugDl = _plugin_dl;
    var gsCodec;
    var giMpegEnv = [0, _ht];
    var giMpegEnv2 = [0, _ht2];
    var giMpegEnv3 = [0, _ht3];
    var giMpegEnv4 = [0, _ht4];
    var giJpegEnv = [0, _jt];
    var giJpegEnv2 = [0, _jt2];
    var giJpegEnv3 = [0, _jt3];
    var giStMode = 1;	/// giMpegEnvの内容(mpeg-4,h264)を決める。he130ではh264のみなので1固定。
    var gvCodec = [["mpeg", "mpeg-4"], ["h264", "h264"]];
    var giMpegResol = [_mr, _hr];
    var giTrans = 0;
    var giTrans2 = 0;
    var giTrans3 = 0;
    var giTrans4 = 0;
    var giRtsp = [0, _h_r_mode];
    var giRtsp2 = [0, _h_r_mode2];
    var giRtsp3 = [0, _h_r_mode3];
    var giRtsp4 = [0, _h_r_mode4];
    var gsDelivery = ["0", _hum];
    var gsDelivery2 = ["0", _hum2];
    var gsDelivery3 = ["0", _hum3];
    var gsDelivery4 = ["0", _hum4];

    var giMulti = 1;
    var giHr = _hr;	/// h264での画面の解像度を指定
    var giHr2 = _hr2;
    var giHr3 = _hr3;
    var giHr4 = _hr4;
    var gChangeMenuFlg = 0;	// OSD MenuからのBack(1)かを判断
// OSD MenuからのBackの場合、stoplive,startliveを行わない
    var giChHbMax1 = _hb;
    var giChHbMax2 = _hb2;
    var giChHbMax3 = _hb3;
    var giChHbMax4 = _hb4;
    var gsSelectHbMax = giChHbMax1;


// the visibility of Jpeg stream1 / stream2 /stream3
    var jpegStreamListVisibility = [_jt, _jt2, _jt3];
// the visibility of H.264 stream1 / stream2 /stream3 / stream4
    var h264StreamListVisibility = [_ht, _ht2, _ht3, _ht4];
    var h264Settingdata = {};
    var lockFlg = false;
    var gLock;

    myDOM.ajax.GetHttpRequest = function (url, callback, headers) {

        var xhr = null;

        if (window.XMLHttpRequest) {
            xhr = new window.XMLHttpRequest();
        } else if (window.ActiveXObject) {
            try {
                xhr = new window.ActiveXObject("MSXML2.XMLHTTP.6.0");
            } catch (e) {
                try {
                    xhr = new window.ActiveXObject("MSXML2.XMLHTTP.3.0");
                } catch (e) {
                    try {
                        xhr = new window.ActiveXObject("MSXML2.XMLHTTP");
                    } catch (e) {
                        window.alert("XMLHttpRequest / MSXML2.XMLHTTP is NOT exist !");
                        return null;
                    }
                }
            }
        } else {
            return null;
        }

        if (xhr != null) {
            xhr.open('GET', url, true);
            xhr.setRequestHeader('Pragma', 'no-cache');
            xhr.setRequestHeader('Cache-Control', 'no-cache');
            xhr.setRequestHeader('If-Modified-Since', 'Thu, 01 Jun 1970 00:00:00 GMT');
            if (typeof( headers ) == 'object') {
                for (var name in headers) {
                    xhr.setRequestHeader(name, headers[name]);
                }
            } else {
                // DO NOTHING
            }
            if (typeof( callback ) == 'function') {
                xhr.onreadystatechange = function () {
                    if (xhr.readyState == 4) {
                        callback(xhr);
                    } else {
                        // DO NOTHING
                    }
                };
            } else {
                // DO NOTHING
            }
            xhr.send(null);
        } else {
            return null;
        }

        return xhr;
    };

    /**
     * menubarStream領域の構築処理
     */
    function build() {
        // 共通エリアの構築
        if (buildFlag == false) {
            buildFlag = true;
        }
        txtObject[TXT_COMPRESSION] = TextCtrl('camera_stream_menu', 'wrapper_label_compression',"");
        btnObject[BTN_CLS_H264] = ButtonCtrl('wrapper_btn_compression', 'cls_h264', NPTZ_WORDING.wID_0088, callBtnCompressionHOJ, BTN_CLS_H264);
        btnObject[BTN_CLS_JPEG] = ButtonCtrl('wrapper_btn_compression', 'cls_jpeg', NPTZ_WORDING.wID_0084, callBtnCompressionHOJ, BTN_CLS_JPEG);
        btnObject[LOCK] = ButtonCtrl('camera_live_area', 'btn_lock', NPTZ_WORDING.wID_0428, callbackSettingLock);

        //↓stream のボタン作成、初期は表示しない
        $('#camera_stream_menu').append($('<div id="btnStream"></div>'));
        txtObject[TXT_IMAGE_CAPTURE_SIZE] = TextCtrl('camera_stream_menu', 'wrapper_label_Stream', NPTZ_WORDING.wID_0173);
        btnStreamObject[BTN_STREAM1] = ButtonCtrl('btnStream', 'btn_stream1', NPTZ_WORDING.wID_0021, callBtnStream, BTN_STREAM1);
        btnStreamObject[BTN_STREAM2] = ButtonCtrl('btnStream', 'btn_stream2', NPTZ_WORDING.wID_0022, callBtnStream, BTN_STREAM2);
        btnStreamObject[BTN_STREAM3] = ButtonCtrl('btnStream', 'btn_stream3', NPTZ_WORDING.wID_0023, callBtnStream, BTN_STREAM3);


        // btnStreamObject[BTN_STREAM4] = ButtonCtrl('btnStream', 'btn_stream4', NPTZ_WORDING.wID_0024, callBtnStream, BTN_STREAM4);

        $(".wrapper_label_Stream").attr('id', "lbl_stream");
        $(".btn_stream1").attr('id', "btn_stream1");
        $(".btn_stream2").attr('id', "btn_stream2");
        $(".btn_stream3").attr('id', "btn_stream3");
        // $(".btn_stream4").attr('id', "btn_stream4");

        if(_power == 1){
            gLock = setInterval(getLock,5000);
        }
        //追加・変更 対応不具合 3496
        $('#camera_live_area').append($('<div id="divndihx" class="div_ndihx"></div>'));
        txtObject[TXT_NDIHX_FIRST] = TextCtrl('divndihx', 'label_ndihx_frist', NPTZ_WORDING.wID_0174);
        txtObject[TXT_NDIHX_SECOND] = TextCtrl('divndihx', 'label_ndihx_second', NPTZ_WORDING.wID_0175);
        txtObject[TXT_NDIHX_THIRD] = TextCtrl('divndihx', 'label_ndihx_third', NPTZ_WORDING.wID_0176);
    }

    /**
     * menubarStream領域の表示処理
     */
    function show() {
        for (var txt in txtObject) {
            txtObject[txt].show()
        }
        for (var btn in btnObject) {
            btnObject[btn].show();
            btnObject[btn].displayOff();
        }
        for (var btnQt in btnQtObject) {
            btnQtObject[btnQt].show();
            btnQtObject[btnQt].displayOff();
        }
        for (var btnStream in btnStreamObject) {
            btnStreamObject[btnStream].show();
            btnStreamObject[btnStream].displayOff();
        }

        if ($("#camera_stream_menu").css("display") != "none") {
            //追加・変更 対応不具合 3496
            if (_cparam_cgi_info_ndihxkey()) {
                $('#divndihx').show();
            } else {
                $('#divndihx').hide();
            }
        }
    }

    function LockHide() {
        //btn control ptz area and adjust area
        $("#camera_controller_gui_ptz_main").removeClass("camera_controller_gui_ptz_main_down");
        $("#camera_ptz_line_2").removeClass("camera_controller_gui_ptz_line");
        $("#camera_ptz_line_3").removeClass("camera_controller_gui_ptz_line");
        $(".btn_zoom_x1").hide();
        $(".btn_focus_otaf").hide();
        if(Platform.isTouchMode()){
            $(".btn_ptz_zoom_d_ext").show();
        }else{
            $(".btn_ptz_zoom_d_ext").hide();
        }
        $(".btn_zoom_d_ext").hide();
        $(".btn_zoom_d_ext_20").hide();
        if(Platform.isTouchMode()){
            $(".btn_touch_af").show();
            $(".btn_focus_guide").show();
            $(".btn_a_iris_win").show();
        }else{
            $(".btn_touch_af").hide();
            $(".btn_focus_guide").hide();
            $(".btn_a_iris_win").hide();
        }
        $(".btn_zoom_D_Zoom").hide();
        // $(".btn_focus_guide").hide();
        // $(".btn_a_iris_win").hide();
        $("#camera_ptz_d_ext_label").hide();
        $("#camera_ptz_d_zoom_label").hide();
        if( menubarCtrl.getUhdCropStatus() == 1 || cparam_get_bar() == 1 || cparam_get_focusMode() == 1 ){
            if(window.parent.gBTN_TOUCH_F_status == 1) {
                $("#camera_ptz_touch_label").hide();
            }
        } else if(Platform.isTouchMode()){
			$("#camera_ptz_touch_label").hide();
            $("#scene").show();
            $(".btn_preset_set").show();
            $(".btn_preset_delete").show();
            $("#preset_set_label").hide();
		} else{
            $("#camera_ptz_touch_label").show();
            $("#scene").hide();
            $(".btn_preset_set").hide();
            $(".btn_preset_delete").hide();
        }
        $(".camera_controller_gui_ptz_main_bottom_line").hide();
        ptzAreaCtrlFlag=true;
        $("#camera_controller_gui_preset_main").removeClass("camera_controller_gui_preset_main_down");
        $(".camera_controller_gui_preset_main_bottom_line").hide();
        ptzPresetCtrlFlag=true;
        $(".camera_control_adjust_down_area").removeClass("camera_control_adjust_down");
        $(".camera_adjust_line_6").show();
        $(".camera_controller_gui_adjust_bottom_top_line").show();
        $(".stream_rtmp").show();
        $(".btn_stream_stop").show();
        $(".ptz_btn_stream_stop").show();
        ptzAdjustCtrlFlag=true;

    }
    var lockFlg = false;

    /**
     * Lock button controller
     * @param mouse
     */
    function callbackSettingLock(mouse) {
        if (mouse == Button.STATUS_DISABLED) {

        } else if (mouse == Button.MOUSE_DOWN) {
        
        	var LockCurrent = parseInt(cparam_get_remoteUnLockSetting().substring(0, 1), 10);

            if( btnObject[LOCK].getStatus() == Button.STATUS_ON && LockCurrent == 1){
                lockFlg = false;
                btnObject[LOCK].displayOff();
                btnObject[LOCK].set(NPTZ_WORDING.wID_0428);
                cparam_set_remoteUnLockSetting();
                getLockSetupButton(true);

            }else if( btnObject[LOCK].getStatus() == Button.STATUS_ON && LockCurrent == 0){
            	lockFlg = false;
                btnObject[LOCK].displayOff();
                btnObject[LOCK].set(NPTZ_WORDING.wID_0428);
                getLockSetupButton(true);
            }else{
                lockFlg = true;
                getLockSetupButton(false);
                btnObject[LOCK].displayOn();
                btnObject[LOCK].set(NPTZ_WORDING.wID_0428);
            }
        } else {

        }
    }
    var count = 0;
    function getLock(){
        if(!activexInitialization)return;
        try {
            if(!liveModeFlg){
                count++;
                if(count<6){
                    return;
                }
            }
            count = 0;
            var currentLock = parseInt(reqCgiObj.currentLock.substring(0, 1), 10);
                if(currentLock == 1){
                    lockFlg = false;
                }
                if(lockFlg){
                    if(currentLock == 0){
                        btnObject[LOCK].set(NPTZ_WORDING.wID_0428);
                        btnObject[LOCK].displayOn();
                        $("#preset_list_area").hide();
                    }
                }else{
                    if(currentLock == 0 && btnObject[LOCK].getStatus() != Button.STATUS_ON){
                        btnObject[LOCK].set(NPTZ_WORDING.wID_0428);
                        btnObject[LOCK].displayOff();
                    }else if(currentLock == 1){
                        if( Platform.isSetupMode() ) {
                            Platform.setIsSetupMode(false);
                            window.location.href="/live/index.html";

                        }
                        getLockSetupButton(false);
                        btnObject[LOCK].set(NPTZ_WORDING.wID_0448);
                        btnObject[LOCK].displayOn();
                        $("#preset_list_area").hide();
                    }else if(btnObject[LOCK].getStatus() == Button.STATUS_ON){
                        getLockSetupButton(true);
                        btnObject[LOCK].displayOff();
                        btnObject[LOCK].set(NPTZ_WORDING.wID_0428);
                    }
                }
        } catch (e){

        }
    }

    function getLockSetupButton(lockFlg){
        if(lockFlg){
            $('#power').prop("disabled", false);
            $("#power").css("color",'rgb(74, 241, 8)');
            show();
            btnObject[LOCK].displayOff();
            menubarCtrl.osdControler.menubarOsdBtnDisplayOff();
            menubarBtnDisplayOff();
            menubarCtrl.osdControler.show();
            cameraControllerSetting.updateStatus(1);
            cameraControllerSetting.initTouchBtnStatus();
            ThisPageReload();
            if(giJpegEnv3[giStMode] != 0 || giJpegEnv2[giStMode] != 0 || giJpegEnv[giStMode] != 0 ){
                btnStreamObject[gStreamMode - 1].displayOn();
            }
            $('#iris_setting_mask_cover').hide();
            displayBaseHeaderTab.settingButtonDisplayOff();
            $(".btn_ptz_zoom_d_ext").show();
            // $(".btn_focus_guide").show();
            if(Platform.isTouchMode()){//#8518
                $(".btn_a_iris_win").show(); //#8518
            } else {
                $(".btn_a_iris_win").hide();
            }
        }else{
            LockHide();
            $('#power').prop("disabled", true);
            $("#power").css("color","gray");
            menubarCtrl.osdControler.menubarOsdBtnDisabled();
            menubarBtnDisabled();
            cameraControllerSetting.updateStatus(0);
            $('#iris_setting_mask_cover').show();
        }
    }

    /**
     * menubar Button Disabled
     */
    function menubarBtnDisplayOff() {
        $(".wrapper_label_compression").css("color", "");
        $(".wrapper_label_Stream").css("color", "");
        $("#power")[0].disabled = false;
        if (menubar_GetCodecMode() == "jpeg") {
            btnObject[BTN_CLS_JPEG].displayOn();
            btnObject[BTN_CLS_H264].displayOff();
            // btnStreamObject[BTN_STREAM4].hide();
        } else {
            btnObject[BTN_CLS_JPEG].displayOff();
            btnObject[BTN_CLS_H264].displayOn();
        }
        menubarCtrl.btnDisplayOff();
        GetImageStatus();
    }

    /**
     * H.264/JPEG 押下時の画面制御
     * @param {number} mouse マウス・ボタン操作状況
     */
    function callBtnCompressionHOJ(mouse, type) {
        if (mouse == Button.MOUSE_UP) {

        } else if (mouse == Button.MOUSE_DOWN) {
            for (var btnStream in btnStreamObject) {
                btnStreamObject[btnStream].displayOff();
            }
            if (type == BTN_CLS_H264) {
                // btnStreamObject[BTN_STREAM4].show();
                // btnStreamObject[BTN_STREAM4].displayOff();
                ChangeCodecMode('h264', 1);
                gsStNo = null;
                ChangeStream(Number(1), "1");
            } else if (type == BTN_CLS_JPEG) {
                // btnStreamObject[BTN_STREAM4].hide();
                ChangeCodecMode('jpeg', 1);
                gsStNo = null;
                ChangeStream(Number(1), "1");
            }
        } else {
            // 処理なし
        }
    }

    /**
     * Qt1 押下時の画面制御
     * @param {number} mouse マウス・ボタン操作状況
     */
    function callBtnQt(mouse, type) {
        if (mouse == Button.MOUSE_UP) {

        } else if (mouse == Button.MOUSE_DOWN) {
            if (type == BTN_QT1) {
                ChangeQuality(1);
            } else if (type == BTN_QT2) {
                ChangeQuality(2);
            }
        } else {
            // 処理なし
        }
    }

    var isStreamBtnChange = false;
    /**
     * BtnStream 押下時の画面制御
     * @param {number} mouse マウス・ボタン操作状況
     */
    function callBtnStream(mouse, i, presetListFlg) {
        if (mouse == Button.MOUSE_UP) {

        } else if (mouse == Button.MOUSE_DOWN) {
            isStreamBtnChange = true;
            ChangeStream(Number(i + 1), "1",presetListFlg);
            changeMaskMode(i);
            changeFocusGuideMode(i);
        } else {
            // 処理なし
        }
    }

    function changeMaskMode(mode,hide){
        var callMode = "";
        switch (mode) {
            case 1:
            case 2:
                if (currentWindowWidth == 640 || giJpegResol == 640) {
                    $("#iris_setting_mask").removeClass("stream3 stream4").addClass("stream2");
                    callMode = "stream2";
                }
                else {
                    $("#iris_setting_mask").removeClass("stream2 stream4").addClass("stream3");
                      callMode = "stream3";
                }
                break;
            default:
                if (currentWindowWidth == 1920 || giJpegResol == 1920) {
                    $("#iris_setting_mask").removeClass("stream2 stream3").addClass("stream4");
                    callMode = "stream4";
                }
                else if (currentWindowWidth == 640 || giJpegResol == 640) {
                    $("#iris_setting_mask").removeClass("stream3 stream4").addClass("stream2");
                    callMode = "stream2";
                }
                else if (currentWindowWidth == 320 || giJpegResol == 320) {
                    $("#iris_setting_mask").removeClass("stream2 stream4").addClass("stream3");
                    callMode = "stream3";
                } else {
                    $("#iris_setting_mask").removeClass("stream2 stream3 stream4");
                }
        }
        // if(hide){
        //     setTimeout(function(){trackingController.hideChangeSliderMode(callMode)},1000);
        // }else{
        //     setTimeout(function(){trackingController.changeSliderMode(callMode)},1000);
        // }
    }
    function changeFocusGuideMode(mode){
        switch (mode) {
            case 1:
                focusSize = 's2'       
                break;
            case 2:
                focusSize = 's2'
                break;
            default:
                if(currentWindowWidth == 1920 || giJpegResol == 1920){
                    focusSize = 's3'
                }else{
                    focusSize = 's3'
                }
        }
    }

    function isStreamBtnChangeFun(){
        return isStreamBtnChange;
    }

    /**
     * Change jpeg Button On
     */
    function jpegButtonChangeOn() {
        btnObject[BTN_CLS_JPEG].displayOn();
    }

    /**
     * menubar Button Disabled
     */
    function menubarBtnDisabled() {
        $(".wrapper_label_compression").css("color", "rgb(102,102,102)");
        $(".wrapper_label_Stream").css("color", "rgb(102,102,102)");
        btnObject[BTN_CLS_H264].displayDisabled();
        btnObject[BTN_CLS_JPEG].displayDisabled();
        btnStreamObject[BTN_STREAM1].displayDisabled();
        btnStreamObject[BTN_STREAM2].displayDisabled();
        btnStreamObject[BTN_STREAM3].displayDisabled();
        // btnStreamObject[BTN_STREAM4].displayDisabled();
        btnObject[LOCK].displayDisabled();
        displayBaseHeaderTab.settingButtonDisabled();
        menubarCtrl.btnDisabled();
    }

    /**
     * menubar Steam Button Disabled
     * #3503
     */
    function menubarStreamBtnDisabled() {
        btnStreamObject[BTN_STREAM2].displayDisabled();
        btnStreamObject[BTN_STREAM3].displayDisabled();
        // btnStreamObject[BTN_STREAM4].displayDisabled();
    }

    /**
     * menubar Steam Button On
     * #3503
     */
    function menubarStreamBtnOn() {
        if(!lockFlg && _power != 0) {
            btnStreamObject[BTN_STREAM2].displayOff();
            btnStreamObject[BTN_STREAM3].displayOff();
            // btnStreamObject[BTN_STREAM4].displayOff();
        }
    }

    /**
     * every stream button controller
     * @param iParam
     * @param iinitflg
     * @returns {boolean}
     */
    function ChangeStream(iParam, iinitflg, presetListFlg) {
        if(presetListFlg != true && (( gsStNo == ("&stream=" + iParam) ) || ( CheckButtonIsActive("stream" + iParam) != true ))) {
            return false;
        }
        else {
            if (iParam != 0) {
            } else {
                iParam = 2;
            }
        }
        var sVcodec1 = "";
        var sVcodec2 = "";
        try {
            if (gChangeMenuFlg == 0) {
                //.getElementById("mainViewHtml").contentWindow.mainview_StopLive();
            }
        }
        catch (e) {
        }
        if (giStMode == 0) {
            sVcodec1 = "mpeg-4";
        }
        else {
            sVcodec1 = "h264";
        }

        if (gsCodec == "jpeg") {
            sVcodec1 = "jpeg";
        }
        else {
            sVcodec1 = "h264";
        }

        if (gsCodec == "jpeg") {
            switch (iParam) {
                case 2:
                    if (giJpegEnv2[giStMode] == 0) {
                        iParam = gStreamMode.toString(10);
                    }
                    break;
                case 3:
                    if (giJpegEnv3[giStMode] == 0) {
                        iParam = gStreamMode.toString(10);
                    }
                    break;
                case 1:
                default:
                    if (giJpegEnv[giStMode] == 0) {
                        iParam = gStreamMode.toString(10);
                    }
                    break;
            }
        }
        else {
            switch (iParam) {
                case 2:
                    if (giMpegEnv2[giStMode] == 0) {
                        iParam = gStreamMode.toString(10);
                    }
                    break;
                case 3:
                    if (giMpegEnv3[giStMode] == 0) {
                        iParam = gStreamMode.toString(10);
                    }
                    break;
                case 4:
                    if (giMpegEnv4[giStMode] == 0) {
                        iParam = gStreamMode.toString(10);
                    }
                    break;
                case 1:
                default:
                    if (giMpegEnv[giStMode] == 0) {
                        iParam = gStreamMode.toString(10);
                    }
                    break;
            }
        }

        if (iParam == 1) {
            if(btnStreamObject[BTN_STREAM2].getStatus() == Button.STATUS_DISABLED){
                btnStreamObject[BTN_STREAM2].displayDisabled();
            } else {
                btnStreamObject[BTN_STREAM2].displayOff();
            }
            if(btnStreamObject[BTN_STREAM3].getStatus() == Button.STATUS_DISABLED){
                btnStreamObject[BTN_STREAM3].displayDisabled();
            } else {
                btnStreamObject[BTN_STREAM3].displayOff();
            }
            // if(btnStreamObject[BTN_STREAM4].getStatus() == Button.STATUS_DISABLED){
            //     btnStreamObject[BTN_STREAM4].displayDisabled();
            // } else {
            //     btnStreamObject[BTN_STREAM4].displayOff();
            // }
            btnStreamObject[BTN_STREAM1].displayOn();
            if (gsCodec == "jpeg") {
                giJpegResol = giJpegStream1Resol;
            }
            else {
                giMpegResol[giStMode] = giHr;
                gsSelectHbMax = giChHbMax1;
            }
        }
        else if (iParam == 2) {
            sVcodec2 = "_2";
            if(btnStreamObject[BTN_STREAM1].getStatus() == Button.STATUS_DISABLED){
                btnStreamObject[BTN_STREAM1].displayDisabled();
            } else {
                btnStreamObject[BTN_STREAM1].displayOff();
            }
            if(btnStreamObject[BTN_STREAM3].getStatus() == Button.STATUS_DISABLED){
                btnStreamObject[BTN_STREAM3].displayDisabled();
            } else {
                btnStreamObject[BTN_STREAM3].displayOff();
            }
            // if(btnStreamObject[BTN_STREAM4].getStatus() == Button.STATUS_DISABLED){
            //     btnStreamObject[BTN_STREAM4].displayDisabled();
            // } else {
            //     btnStreamObject[BTN_STREAM4].displayOff();
            // }
            btnStreamObject[BTN_STREAM2].displayOn();
            if (gsCodec == "jpeg") {
                giJpegResol = giJpegStream2Resol;
            }
            else {
                giMpegResol[giStMode] = giHr2;
                gsSelectHbMax = giChHbMax2;
            }
        }
        else if (iParam == 3) {
            sVcodec2 = "_3";
            if(btnStreamObject[BTN_STREAM1].getStatus() == Button.STATUS_DISABLED){
                btnStreamObject[BTN_STREAM1].displayDisabled();
            } else {
                btnStreamObject[BTN_STREAM1].displayOff();
            }
            if(btnStreamObject[BTN_STREAM2].getStatus() == Button.STATUS_DISABLED){
                btnStreamObject[BTN_STREAM2].displayDisabled();
            } else {
                btnStreamObject[BTN_STREAM2].displayOff();
            }
            // if(btnStreamObject[BTN_STREAM4].getStatus() == Button.STATUS_DISABLED){
            //     btnStreamObject[BTN_STREAM4].displayDisabled();
            // } else {
            //     btnStreamObject[BTN_STREAM4].displayOff();
            // }
            btnStreamObject[BTN_STREAM3].displayOn();
            if (gsCodec == "jpeg") {
                giJpegResol = giJpegStream3Resol;
            }
            else {
                giMpegResol[giStMode] = giHr3;
                gsSelectHbMax = giChHbMax3;
            }
        }
        else {
            sVcodec2 = "_4";
            if(btnStreamObject[BTN_STREAM1].getStatus() == Button.STATUS_DISABLED){
                btnStreamObject[BTN_STREAM1].displayDisabled();
            } else {
                btnStreamObject[BTN_STREAM1].displayOff();
            }
            if(btnStreamObject[BTN_STREAM2].getStatus() == Button.STATUS_DISABLED){
                btnStreamObject[BTN_STREAM2].displayDisabled();
            } else {
                btnStreamObject[BTN_STREAM2].displayOff();
            }
            if(btnStreamObject[BTN_STREAM3].getStatus() == Button.STATUS_DISABLED){
                btnStreamObject[BTN_STREAM3].displayDisabled();
            } else {
                btnStreamObject[BTN_STREAM3].displayOff();
            }
            // btnStreamObject[BTN_STREAM4].displayOn();
            giMpegResol[giStMode] = giHr4;
            gsSelectHbMax = giChHbMax4;
        }
        if (IsIE()) {
            //NDI|HXの場合、Video Over IPの取得したデータに置いてH.264(1)のTransmitがOnであったとしても、IEで表示できるのはJPEG(1)のみです。
            //2020710 add
            if(sysStreamMode == "ndi_hx"){
                gsCodec = "jpeg";
            }
            //end
            if (gsCodec == "jpeg") {
                currentWindowWidth = giJpegResol;
            }
            else {
                currentWindowWidth = parseInt(giMpegResol[giStMode]);
            }
        }else{
            currentWindowWidth = giJpegResol;
        }
        gVcodec1 = sVcodec1;
        gVcodec2 = sVcodec2;
        // 0 : initThispage
        // 1 : その他(SetStream)
        if (iinitflg == 0) {
            // DO NOTHING
        }
        else {
            cparam_frmRightRequest();
        }
        gStreamMode = parseInt(iParam, 10);
        gsStNo = "&stream=" + iParam;
        titlebar_main_SetNoPush(false);
        changeFocusGuideMode(gStreamMode -1);
    }
    function getBtnLockObjcet(){
        return btnObject[LOCK];
    }

    /**
     * set message to element
     * @param xhr
     * @constructor
     */
    function DbgCallback(xhr) {
        if (gDbgMode == 1) {
            gDebug.innerHTML = xhr.responseText;
        } else {
            // DO NOTHING
        }
    }

    /**
     * send power commend
     * @param power
     * @returns {boolean}
     * @constructor
     */
    function DoSubmitPower(power) {
        cparam_set_powerOnStandby(power);
        if (power == 0) {
            iInterval = 100;
            const mode = {};
            mode['mode'] = 0;
            cparam_setCspControlMode(mode);
        } else {
            iInterval = 3000;
        }
        setTimeout("refreshDiv()", iInterval);
    }

    /**
     * lock button controller
     * @constructor
     */
    function SetOperateLock() {
        if (gFlgLock == 1) {
            ChangeLabelState("osd_menu", "Disable");
            ChangeLabelState("power", "Disable");
        } else {
            ChangeLabelState("power", "Enable");
            if (_power == 0) {
                //追加の釦のlock設定
                ChangeLabelState("resolution", "Disable");
                ChangeLabelState("Image_quality", "Disable");
                ChangeLabelState("stream", "Disable");
                ChangeLabelState("osd_menu", "Disable");
                span_osd_menu.style.cursor = "default";
            } else {
                //追加の釦のlock設定
                ChangeLabelState("resolution", "Enable");
                ChangeLabelState("Image_quality", "Enable");
                ChangeLabelState("stream", "Enable");
            }
        }
    }

    /**
     * return menubar_GetOpLockState
     * @returns {number}
     */
    function menubar_GetOpLockState() {
        return gFlgLock;
    }

// ----- For IP-Video ---------------------------------------

    function menubar_GetCodecMode() {
        return gsCodec;
    }

    /**
     * return menubar_GetResolution
     * @returns {*}
     */
    function menubar_GetResolution() {
        if (( gsCodec == "mpeg" ) || ( gsCodec == "h264" )) {
            return giMpegResol[giStMode];
        } else {
            return parseInt(giJpegResol);
        }
    }

    /**
     * return menubar_GetQuality
     * @returns {string}
     */
    function menubar_GetQuality() {
        return gsJpegBaseQual;
    }

    /**
     * return menubar_GetFramerate
     * @returns {*}
     */
    function menubar_GetFramerate() {
        if (( gsCodec == "mpeg" ) || ( gsCodec == "h264" )) {
            return 30;
        } else {
            switch (gStreamMode) {
                case 1:
                    return _ji;
                case 2:
                    return _ji2;
                case 3:
                    return _ji3;
                default:
                    return 30;
            }
        }
    }

    /**
     * giTransに割り当てる
     * @constructor
     */
    function SetTrans() {
        if (gsCodec == "jpeg") {
            giTrans = 0;
        }
        else {
            switch (giRtsp[giStMode]) {
                case 0:
                    giTrans = 0;
                    break;
                case 1:
                    if (gsDelivery[giStMode] == "multi") {
                        giTrans = 2;
                    } else {
                        giTrans = 4;
                    }
                    break;
                default:
                /// giRtsp[]には(0,1)しか値がないのでdefaultにはならない
            }
        }
    }

    /**
     * giTrans2に割り当てる
     * @constructor
     */
    function SetTrans2() {
        if (gsCodec == "jpeg") {
            giTrans2 = 0;
        }
        else {
            switch (giRtsp2[giStMode]) {
                case 0:
                    giTrans2 = 0;
                    break;
                case 1:
                    if (gsDelivery2[giStMode] == "multi") {
                        giTrans2 = 2;
                    }
                    else {
                        giTrans2 = 4;
                    }
                    break;
                default:
                /// giRtsp2[]には(0,1)しか値がないのでdefaultにはならない
            }
        }
    }

    /**
     * giTrans3に割り当てる
     * @constructor
     */
    function SetTrans3() {
        if (gsCodec == "jpeg") {
            giTrans3 = 0;
        }
        else {
            switch (giRtsp3[giStMode]) {
                case 0:
                    giTrans3 = 0;
                    break;
                case 1:
                    if (gsDelivery3[giStMode] == "multi") {
                        giTrans3 = 2;
                    }
                    else {
                        giTrans3 = 4;
                    }
                    break;
                default:
                /// giRtsp3[]には(0,1)しか値がないのでdefaultにはならない
            }
        }
    }

    /**
     * giTrans4に割り当てる
     * @constructor
     */
    function SetTrans4() {
        if (gsCodec == "jpeg") {
            giTrans4 = 0;
        }
        else {
            switch (giRtsp4[giStMode]) {
                case 0:
                    giTrans4 = 0;
                    break;
                case 1:
                    if (gsDelivery4[giStMode] == "multi") {
                        giTrans4 = 2;
                    }
                    else {
                        giTrans4 = 4;
                    }
                    break;
                default:
                /// giRtsp4[]には(0,1)しか値がないのでdefaultにはならない
            }
        }
    }

    /**
     * h264/jpeg button controller
     * @param sCodec
     * @param iinitflg
     * @param btnObjectH264
     * @param btnObjectJpeg
     * @constructor
     */
    function ChangeCodecMode(sCodec, iinitflg) {
        if (sCodec == "jpeg") {
            gsCodec = sCodec;
        } else {
            gsCodec = gvCodec[giStMode][0];
        }

        SetTrans();
        SetTrans2();
        SetTrans3();
        SetTrans4();
        // get transmit
        setStreamListVisibility();

        if (gsCodec == "h264") {
            btnObject[BTN_CLS_H264].displayOn();
            btnObject[BTN_CLS_JPEG].displayOff();

            DispStream();
        } else {
            btnObject[BTN_CLS_H264].displayOff();
            btnObject[BTN_CLS_JPEG].displayOn();
            DispStream();
        }
        // set the stream button hidden or visible
        GetImageStatus();

        // iinitflg(initThispage からの処理か否かでgetuidの発行如何を変更する)
        // 0 : initThispage
        // 1 : その他
        if (iinitflg == 0) {
            // DO NOTHING
        }
        else {
            RequestStartLive();
        }

    }

    var StreamInfo = null;

    /**
     * Set Stream Info
     * @param url
     * @returns {boolean}
     * @private
     */
    function _menubar_SetStreamInfo(url) {
        try {
            var ret = cparam_sendRequest(url);
            var result = '0';
            if (ret.length) {
                if (ret.indexOf("Internet Mode") == 0) {
                    StreamInfo = null;
                    result = '99';
                    return result;
                }else if (ret.indexOf("Access Limit") == 0) {
                	StreamInfo = null;
                    result = '90';
                    return result;
                }
                StreamInfo = eval("(" + ret.replace('\n', '', 'g') + ")");

                if (StreamInfo.UID == -1) {
                    return false;
                }
            }
            else {
                StreamInfo = null;
                return true;
            }
            return true;
        }
        catch (e) {
            return false;
        }
    }

    /**
     * Get Stream Info
     * @returns {*}
     */
    function menubar_GetStreamInfo() {
        if (!StreamInfo) {
            StreamInfo = {};
            StreamInfo.aenc = 0;
            StreamInfo.aInterval = 0;
            StreamInfo.aEnable = "off";
            StreamInfo.aBitrate = 0;
            StreamInfo.aBitrate2 = 0;
            StreamInfo.ePort = 0;
            StreamInfo.sRtspMode_h264 = 0;
            StreamInfo.sRtspMode_h264_2 = 0;
            StreamInfo.sRtspMode_h264_3 = 0;
            StreamInfo.sRtspMode_h264_4 = 0;
            StreamInfo.UID = 0;
            StreamInfo.ImageFormat = "jpeg";
        }
        return StreamInfo;
    }

    /**
     * go URL html
     * @constructor
     */
    function RequestStartLive(flg) {
        var bIsIE = IsIE();
        var liveStream = '0';

        if (gsCodec != "jpeg") {
            liveStream = _menubar_SetStreamInfo("/cgi-bin/getuid?FILE=1&vcodec=" + gvCodec[giStMode][1] + gsVcodec)
            if(flg){
                return;
            }
            if (liveStream == '90' || liveStream == false) {
                document.getElementById("mainViewHtml").src = "/live/mainview_disabled.html";
                windowsZoomControlOnResize("disabled");
                return;
            }
            else if(liveStream == '99') {
                document.getElementById("mainViewHtml").src = "/live/mainview_ipv6_disabled.html";
            }
            else {
                document.getElementById("mainViewHtml").src = "/live/mainview.html";
                return;
            }
        }
        else {
            liveStream = _menubar_SetStreamInfo("/cgi-bin/getuid?FILE=1&vcodec=" + gsCodec + gsVcodec + "&quality=" + gsJpegBaseQual);
            if(flg){
                return;
            }
            if (liveStream == '90' || liveStream == false) {
                document.getElementById("mainViewHtml").src = "/live/mainview_disabled.html";
                windowsZoomControlOnResize("disabled");
                return;
            }
            else if(liveStream == '99') {
                document.getElementById("mainViewHtml").src = "/live/mainview_ipv6_disabled.html";
            }
            else {
                document.getElementById("mainViewHtml").src = "/live/mainview.html";
                return;
            }
        }


        if (bIsIE == true) {
            try {
                CheckInstallActiveX();
            } catch (e) {

            }
        }
        else {
            if(flg){
                return;
            }
            document.getElementById("mainViewHtml").src = "/live/mainview.html";
        }
        if(flg){
            return;
        }
        window.parent.document.getElementById("tracking_controller").style.display = "";
    }

    function changeViewStatus() {
        let url = ["http://", "https://"][cparams.https] + location.host;
        let localUrl = document.getElementById("mainViewHtml");
        {
            
            if (StreamInfo !== null && StreamInfo.UID && StreamInfo.UID !== -1 && canPlayImage) return;
            
                        
            liveStream = _menubar_SetStreamInfo("/cgi-bin/getuid?FILE=1&vcodec=" + gsCodec + gsVcodec + "&quality=" + gsJpegBaseQual);
            if (liveStream == '90' || liveStream == false) {
                showBlueView('90');
                return;
            }
            else if (liveStream == '99') {
                showBlueView('99');
                return;
            }
            else {
                if (StreamInfo.UID == -1) {
                    return;
                }
                else {
                    localUrl.src = "/live/mainview.html";
                    return;
                }
            }
        }
        function showBlueView(type) {
            if (localUrl.src == url + "/live/mainview.html") {
                if (type == '90') {
                    localUrl.src = "/live/mainview_disabled.html";
                }
                else if (type == '99') {
                    localUrl.src = "/live/mainview_ipv6_disabled.html"
                }
            }
        }
    }
    
    //get_streaming_status
    //0：配信していない、1：配信している
    function getStreamingStatus() {
        let result = 0;
		let url = "/cgi-bin/get_streaming_status?UID=" + (StreamInfo.UID);
        //console.log("getStreamingStatus url=" + url);
        try {
            let ret = cparam_sendRequest(url);
            if (ret.length) {
                if (ret.indexOf("status") != 0) {
                    result = 0;
                    return result;
                }
                let streaming_status = ret.substring("status=".length);
                result = parseInt(streaming_status);
            }
            else {
                //コマンドに対してエラー
                result = 0;
            }
            return result;
        }
        catch (e) {
            return result;
        }
    }

    //黒画確認
    function checkBlackView() {
        let _now_streaming = true;
        if(canPlayImage == true){
            //黒画判定
            if (StreamInfo !== null && StreamInfo.UID && StreamInfo.UID !== -1){
                let streaming_status = getStreamingStatus();
                //console.log("checkBlackView StreamInfo.UID ="+ StreamInfo.UID);
                //console.log("checkBlackView streaming_status ="+ streaming_status);
                if (streaming_status == 0){
                    _now_streaming = false;
                }
            }
        }
        if (_now_streaming == true) return;
        
        //黒画から復帰させる
        RequestStartLive();
    }

    /**
     * return menubar_GetMultiMode
     * @returns {number}
     */
    function menubar_GetMultiMode() {
        return giMulti;
    }

    /**
     * update image style
     * @constructor
     */
    function GetImageStatus() {
        var bIsIE = IsIE();
        var mode = sysStreamMode;

        if (bIsIE == true) {
            // if (cparam_get_frequency() == "4" || mode == 'h264_uhd' ||mode == 'ndi_hx' ||mode == 'rtmp' || mode == 'h265_uhd' ||mode == 'rtmp_uhd' ||mode == 'srt_h264' ||mode == 'srt_h264_uhd' ||mode == 'srt_h265' ||mode == 'srt_h265_uhd' ||mode == 'srt_h265_uhd' ||mode == 'ndi' || mode == 'ts_udp') {  //#3502 //#4143
            if (mode == 'h264_uhd' ||mode == 'h265' ||mode == 'h265_uhd' ||mode == 'rtmp' ||mode == 'rtmp_uhd' ||mode == 'srt_h264' ||mode == 'srt_h264_uhd' ||mode == 'srt_h265' ||mode == 'srt_h265_uhd' ||mode == 'ndi_hx_2' || mode == 'ndi_hx_2_uhd'|| mode == 'ndi'|| mode == 'ts_udp') {  //#3502 //#4143
                btnObject[BTN_CLS_H264].show();
                btnObject[BTN_CLS_H264].displayDisabled();

                btnObject[BTN_CLS_JPEG].show();
                btnObject[BTN_CLS_JPEG].displayOn();
                gsCodec = "jpeg"
            }

            // if (mode == 'ndi_hx' || mode == 'h264_uhd') {
            //     if(gsCodec != "jpeg"){
            //         btnStreamObject[BTN_STREAM2].displayDisabled();
            //         btnStreamObject[BTN_STREAM3].displayDisabled();
            //         btnStreamObject[BTN_STREAM4].displayDisabled();
            //     }
            //     if(mode == 'h264_uhd') {
            //         btnObject[BTN_CLS_H264].show();
            //         btnObject[BTN_CLS_H264].displayDisabled();
            //     }
            // }
            if ((giMpegEnv[giStMode] == 0) && (giMpegEnv2[giStMode] == 0) && (giMpegEnv3[giStMode] == 0) && (giMpegEnv4[giStMode] == 0)) {
                btnObject[BTN_CLS_H264].displayDisabled();
            }
            else {
            }

            if ((giJpegEnv[giStMode] == 0) && (giJpegEnv2[giStMode] == 0) && (giJpegEnv3[giStMode] == 0)) {
                btnObject[BTN_CLS_JPEG].displayDisabled();
            }
            //#7068
            // if (cparam_get_frequency() == "4") {
            //     btnObject[BTN_CLS_H264].displayDisabled();
            // }
        }       

        else {
            btnObject[BTN_CLS_H264].hide();
            if ((giJpegEnv[giStMode] == 0) && (giJpegEnv2[giStMode] == 0) && (giJpegEnv3[giStMode] == 0)) {
                btnObject[BTN_CLS_JPEG].displayDisabled();
            }
        }

        if (gsCodec == "jpeg") {
            giJpegEnv3[giStMode] == 0 ? btnStreamObject[BTN_STREAM3].displayDisabled() : true;
            giJpegEnv2[giStMode] == 0 ? btnStreamObject[BTN_STREAM2].displayDisabled() : true;
            giJpegEnv[giStMode] == 0 ? btnStreamObject[BTN_STREAM1].displayDisabled() : true;
            // btnStreamObject[BTN_STREAM4].hide();
        }
        else {
            if(!bIsIE){
                // btnStreamObject[BTN_STREAM4].hide();
                btnStreamObject[BTN_STREAM3].displayDisabled();
                btnStreamObject[BTN_STREAM2].displayDisabled();
                btnStreamObject[BTN_STREAM1].displayDisabled();

            }
            // giMpegEnv4[giStMode] == 0 ? btnStreamObject[BTN_STREAM4].displayDisabled() : true;
            giMpegEnv3[giStMode] == 0 ? btnStreamObject[BTN_STREAM3].displayDisabled() : true;
            giMpegEnv2[giStMode] == 0 ? btnStreamObject[BTN_STREAM2].displayDisabled() : true;
            giMpegEnv[giStMode] == 0 ? btnStreamObject[BTN_STREAM1].displayDisabled() : true;
        }
    }

    function isAllChannelOFF() {
        if (IsIE()) {
            if ((giMpegEnv[giStMode] == 0) && (giMpegEnv2[giStMode] == 0) && (giMpegEnv3[giStMode] == 0) && (giMpegEnv4[giStMode] == 0)) {
                if ((giJpegEnv[giStMode] == 0) && (giJpegEnv2[giStMode] == 0) && (giJpegEnv3[giStMode] == 0)) {
                    return true;
                }
            }
        } else {
            if ((giJpegEnv[giStMode] == 0) && (giJpegEnv2[giStMode] == 0) && (giJpegEnv3[giStMode] == 0)) {
                return true;
            }
        }
        return false;
    }

    /**
     * update LabelState
     * @param id
     * @param state
     * @constructor
     */
    function ChangeLabelState(id, state) {
        var obj = document.getElementById("lbl_" + id);

        if (state == "Enable") {
            obj.style.color = "#FFFFFF";
        } else if (state == "Disable") {
            obj.style.color = "#808080";
        } else if (state == "Multi") {
            obj.style.visibility = "hidden";
        } else {
            // DO NOTHING
        }
    }

    /**
     * Check Button's Active
     * @param id
     * @returns {*}
     * @constructor
     */
    function CheckButtonIsActive(id) {
        var obj = document.getElementById("btn_" + id);
        var sMsg;
        var bRet;
        if (obj.style.cursor == "default") {
            sMsg = id + " : Disable";
            bRet = false;
        } else {
            sMsg = "";
            bRet = true;
        }
        if (gDbgMode == 1) {
            gDebug.innerHTML = sMsg;
        } else {
            // DO NOTHING
        }
        return bRet;
    }

    /**
     * ChangeQuality button
     * @param iParam
     * @returns {boolean}
     * @constructor
     */
    function ChangeQuality(iParam) {
        if (CheckButtonIsActive("qt" + iParam) != true) {
            return false;
        } else {
            // DO NOTHING
        }

        if (gbAct) {
            return false;
        } else {
            titlebar_main_SetNoPush(true);
        }
        if (giJpegResol == giJpegStream2Resol) {
            gsVcodec = "jpeg_2";
        } else if (giJpegResol == giJpegStream3Resol) {
            gsVcodec = "jpeg_3";
        } else {
            gsVcodec = "jpeg";
        }
        gsJpegBaseQual = iParam;
        RequestStartLive();
        titlebar_main_SetNoPush(false);
    }

    /**
     * return menubar_GetStreamMode
     * @returns {number}
     */
    function menubar_GetStreamMode() {
        return gStreamMode;
    }

    /**
     * mainview から呼ばれる
     * @returns {string}
     */
    function menubar_GetStreamNo() {
        return gsStNo;
    }

    /**
     * Streamボタンの表示、非表示を切り替える
     * ChangeCodec,Initthispageで参照される
     * @constructor
     */
    function DispStream() {
        // display jpeg's stream
        if (gsCodec == "jpeg") {
            DispJpegStream();
            return;
        }

        if ((gsDefaultStream == "jpeg") || (gsDefaultStream == "jpeg_2") || (gsDefaultStream == "jpeg_3")) {
            if (giMpegEnv[giStMode] == 1) {
                gsVcodec = "";
                gStreamMode = 1;
                giMpegResol[giStMode] = giHr;
                gsSelectHbMax = giChHbMax1;
                gsStNo = "&stream=1";
                btnStreamObject[BTN_STREAM1].displayOn();
                btnStreamObject[BTN_STREAM2].displayOff();
                btnStreamObject[BTN_STREAM3].displayOff();
                // btnStreamObject[BTN_STREAM4].displayOff();
            }
            else if (giMpegEnv2[giStMode] == 1) {
                gsVcodec = "_2";
                gStreamMode = 2;
                giMpegResol[giStMode] = giHr2;
                gsSelectHbMax = giChHbMax2;
                gsStNo = "&stream=2";
                btnStreamObject[BTN_STREAM1].displayOff();
                btnStreamObject[BTN_STREAM2].displayOn();
                btnStreamObject[BTN_STREAM3].displayOff();
                // btnStreamObject[BTN_STREAM4].displayOff();
            }
            else if (giMpegEnv3[giStMode] == 1) {
                gsVcodec = "_3";
                gStreamMode = 3;
                giMpegResol[giStMode] = giHr3;
                gsSelectHbMax = giChHbMax3;
                gsStNo = "&stream=3";
                btnStreamObject[BTN_STREAM1].displayOff();
                btnStreamObject[BTN_STREAM2].displayOff();
                btnStreamObject[BTN_STREAM3].displayOn();
                // btnStreamObject[BTN_STREAM4].displayOff();
            }
            else if (giMpegEnv4[giStMode] == 1) {
                gsVcodec = "_4";
                gStreamMode = 4;
                giMpegResol[giStMode] = giHr4;
                gsSelectHbMax = giChHbMax4;
                gsStNo = "&stream=4";
                btnStreamObject[BTN_STREAM1].displayOff();
                btnStreamObject[BTN_STREAM2].displayOff();
                btnStreamObject[BTN_STREAM3].displayOff();
                // btnStreamObject[BTN_STREAM4].displayOn();
            }
        }
        else {
            switch (gsDefaultStream) {
                case "h264_2":
                    if (giMpegEnv2[giStMode] != 1) {
                        if (giMpegEnv[giStMode] == 1) {
                            gsVcodec = "";
                            gStreamMode = 1;
                            giMpegResol[giStMode] = giHr;
                            gsSelectHbMax = giChHbMax1;
                            gsStNo = "&stream=1";
                            btnStreamObject[BTN_STREAM1].displayOn();
                            btnStreamObject[BTN_STREAM2].displayOff();
                            btnStreamObject[BTN_STREAM3].displayOff();
                            // btnStreamObject[BTN_STREAM4].displayOff();
                        }
                        else if (giMpegEnv2[giStMode] == 1) {
                            gsVcodec = "_2";
                            gStreamMode = 2;
                            giMpegResol[giStMode] = giHr2;
                            gsSelectHbMax = giChHbMax2;
                            gsStNo = "&stream=2";
                            btnStreamObject[BTN_STREAM1].displayOff();
                            btnStreamObject[BTN_STREAM2].displayOn();
                            btnStreamObject[BTN_STREAM3].displayOff();
                            // btnStreamObject[BTN_STREAM4].displayOff();
                        }
                        else if (giMpegEnv3[giStMode] == 1) {
                            gsVcodec = "_3";
                            gStreamMode = 3;
                            giMpegResol[giStMode] = giHr3;
                            gsSelectHbMax = giChHbMax3;
                            gsStNo = "&stream=3";
                            btnStreamObject[BTN_STREAM1].displayOff();
                            btnStreamObject[BTN_STREAM2].displayOff();
                            btnStreamObject[BTN_STREAM3].displayOn();
                            // btnStreamObject[BTN_STREAM4].displayOff();
                        }
                        else if (giMpegEnv4[giStMode] == 1) {
                            gsVcodec = "_4";
                            gStreamMode = 4;
                            giMpegResol[giStMode] = giHr4;
                            gsSelectHbMax = giChHbMax4;
                            gsStNo = "&stream=4";
                            btnStreamObject[BTN_STREAM1].displayOff();
                            btnStreamObject[BTN_STREAM2].displayOff();
                            btnStreamObject[BTN_STREAM3].displayOff();
                            // btnStreamObject[BTN_STREAM4].displayOn();
                        }
                    }
                    else {
                        gsVcodec = "_2";
                        gStreamMode = 2;
                        giMpegResol[giStMode] = giHr2;
                        gsSelectHbMax = giChHbMax2;
                        gsStNo = "&stream=2";
                        btnStreamObject[BTN_STREAM1].displayOff();
                        btnStreamObject[BTN_STREAM2].displayOn();
                        btnStreamObject[BTN_STREAM3].displayOff();
                        // btnStreamObject[BTN_STREAM4].displayOff();
                    }
                    break;
                case "h264_3":
                    if (giMpegEnv3[giStMode] != 1) {
                        if (giMpegEnv[giStMode] == 1) {
                            gsVcodec = "";
                            gStreamMode = 1;
                            giMpegResol[giStMode] = giHr;
                            gsSelectHbMax = giChHbMax1;
                            gsStNo = "&stream=1";
                            btnStreamObject[BTN_STREAM1].displayOn();
                            btnStreamObject[BTN_STREAM2].displayOff();
                            btnStreamObject[BTN_STREAM3].displayOff();
                            // btnStreamObject[BTN_STREAM4].displayOff();
                        }
                        else if (giMpegEnv2[giStMode] == 1) {
                            gsVcodec = "_2";
                            gStreamMode = 2;
                            giMpegResol[giStMode] = giHr2;
                            gsSelectHbMax = giChHbMax2;
                            gsStNo = "&stream=2";
                            btnStreamObject[BTN_STREAM1].displayOff();
                            btnStreamObject[BTN_STREAM2].displayOn();
                            btnStreamObject[BTN_STREAM3].displayOff();
                            // btnStreamObject[BTN_STREAM4].displayOff();
                        }
                        else if (giMpegEnv3[giStMode] == 1) {
                            gsVcodec = "_3";
                            gStreamMode = 3;
                            giMpegResol[giStMode] = giHr3;
                            gsSelectHbMax = giChHbMax3;
                            gsStNo = "&stream=3";
                            btnStreamObject[BTN_STREAM1].displayOff();
                            btnStreamObject[BTN_STREAM2].displayOff();
                            btnStreamObject[BTN_STREAM3].displayOn();
                            // btnStreamObject[BTN_STREAM4].displayOff();
                        }
                        else if (giMpegEnv4[giStMode] == 1) {
                            gsVcodec = "_4";
                            gStreamMode = 4;
                            giMpegResol[giStMode] = giHr4;
                            gsSelectHbMax = giChHbMax4;
                            gsStNo = "&stream=4";
                            btnStreamObject[BTN_STREAM1].displayOff();
                            btnStreamObject[BTN_STREAM2].displayOff();
                            btnStreamObject[BTN_STREAM3].displayOff();
                            // btnStreamObject[BTN_STREAM4].displayOn();
                        }
                    }
                    else {
                        gsVcodec = "_3";
                        gStreamMode = 3;
                        giMpegResol[giStMode] = giHr3;
                        gsSelectHbMax = giChHbMax3;
                        gsStNo = "&stream=3";
                        btnStreamObject[BTN_STREAM1].displayOff();
                        btnStreamObject[BTN_STREAM2].displayOff();
                        btnStreamObject[BTN_STREAM3].displayOn();
                        // btnStreamObject[BTN_STREAM4].displayOff();
                    }
                    break;
                case "h264_4":
                    if (giMpegEnv4[giStMode] != 1) {
                        if (giMpegEnv[giStMode] == 1) {
                            gsVcodec = "";
                            gStreamMode = 1;
                            giMpegResol[giStMode] = giHr;
                            gsSelectHbMax = giChHbMax1;
                            gsStNo = "&stream=1";
                            btnStreamObject[BTN_STREAM1].displayOn();
                            btnStreamObject[BTN_STREAM2].displayOff();
                            btnStreamObject[BTN_STREAM3].displayOff();
                            // btnStreamObject[BTN_STREAM4].displayOff();
                        }
                        else if (giMpegEnv2[giStMode] == 1) {
                            gsVcodec = "_2";
                            gStreamMode = 2;
                            giMpegResol[giStMode] = giHr2;
                            gsSelectHbMax = giChHbMax2;
                            gsStNo = "&stream=2";
                            btnStreamObject[BTN_STREAM1].displayOff();
                            btnStreamObject[BTN_STREAM2].displayOn();
                            btnStreamObject[BTN_STREAM3].displayOff();
                            // btnStreamObject[BTN_STREAM4].displayOff();
                        }
                        else if (giMpegEnv3[giStMode] == 1) {
                            gsVcodec = "_3";
                            gStreamMode = 3;
                            giMpegResol[giStMode] = giHr3;
                            gsSelectHbMax = giChHbMax3;
                            gsStNo = "&stream=3";
                            btnStreamObject[BTN_STREAM1].displayOff();
                            btnStreamObject[BTN_STREAM2].displayOff();
                            btnStreamObject[BTN_STREAM3].displayOn();
                            // btnStreamObject[BTN_STREAM4].displayOff();
                        }
                        else if (giMpegEnv4[giStMode] == 1) {
                            gsVcodec = "_4";
                            gStreamMode = 4;
                            giMpegResol[giStMode] = giHr4;
                            gsSelectHbMax = giChHbMax4;
                            gsStNo = "&stream=4";
                            btnStreamObject[BTN_STREAM1].displayOff();
                            btnStreamObject[BTN_STREAM2].displayOff();
                            btnStreamObject[BTN_STREAM3].displayOff();
                            // btnStreamObject[BTN_STREAM4].displayOn();
                        }
                    }
                    else {
                        gsVcodec = "_4";
                        gStreamMode = 4;
                        giMpegResol[giStMode] = giHr4;
                        gsSelectHbMax = giChHbMax4;
                        gsStNo = "&stream=4";
                        btnStreamObject[BTN_STREAM1].displayOff();
                        btnStreamObject[BTN_STREAM2].displayOff();
                        btnStreamObject[BTN_STREAM3].displayOff();
                        // btnStreamObject[BTN_STREAM4].displayOn();
                    }
                    break;
                case "h264":
                default:
                    if (giMpegEnv[giStMode] != 1) {
                        if (giMpegEnv[giStMode] == 1) {
                            gsVcodec = "";
                            gStreamMode = 1;
                            giMpegResol[giStMode] = giHr;
                            gsSelectHbMax = giChHbMax1;
                            gsStNo = "&stream=1";
                            btnStreamObject[BTN_STREAM1].displayOn();
                            btnStreamObject[BTN_STREAM2].displayOff();
                            btnStreamObject[BTN_STREAM3].displayOff();
                            // btnStreamObject[BTN_STREAM4].displayOff();
                        }
                        else if (giMpegEnv2[giStMode] == 1) {
                            gsVcodec = "_2";
                            gStreamMode = 2;
                            giMpegResol[giStMode] = giHr2;
                            gsSelectHbMax = giChHbMax2;
                            gsStNo = "&stream=2";
                            btnStreamObject[BTN_STREAM1].displayOff();
                            btnStreamObject[BTN_STREAM2].displayOn();
                            btnStreamObject[BTN_STREAM3].displayOff();
                            // btnStreamObject[BTN_STREAM4].displayOff();
                        }
                        else if (giMpegEnv3[giStMode] == 1) {
                            gsVcodec = "_3";
                            gStreamMode = 3;
                            giMpegResol[giStMode] = giHr3;
                            gsSelectHbMax = giChHbMax3;
                            gsStNo = "&stream=3";
                            btnStreamObject[BTN_STREAM1].displayOff();
                            btnStreamObject[BTN_STREAM2].displayOff();
                            btnStreamObject[BTN_STREAM3].displayOn();
                            // btnStreamObject[BTN_STREAM4].displayOff();
                        }
                        else if (giMpegEnv4[giStMode] == 1) {
                            gsVcodec = "_4";
                            gStreamMode = 4;
                            giMpegResol[giStMode] = giHr4;
                            gsSelectHbMax = giChHbMax4;
                            gsStNo = "&stream=4";
                            btnStreamObject[BTN_STREAM1].displayOff();
                            btnStreamObject[BTN_STREAM2].displayOff();
                            btnStreamObject[BTN_STREAM3].displayOff();
                            // btnStreamObject[BTN_STREAM4].displayOn();
                        }
                    }
                    else {
                        gsVcodec = "";
                        gStreamMode = 1;
                        giMpegResol[giStMode] = giHr;
                        gsSelectHbMax = giChHbMax1;
                        gsStNo = "&stream=1";
                        btnStreamObject[BTN_STREAM1].displayOn();
                        btnStreamObject[BTN_STREAM2].displayOff();
                        btnStreamObject[BTN_STREAM3].displayOff();
                        // btnStreamObject[BTN_STREAM4].displayOff();
                    }
                    break;
            }
        }
    }

    /**
     * JPEG Streamボタンの表示、非表示を切り替える
     * @constructor
     */
    function DispJpegStream() {
        if ((gsDefaultStream == "h264") || (gsDefaultStream == "h264_2") || (gsDefaultStream == "h264_3") || (gsDefaultStream == "h264_4")) {
            if (giJpegEnv[giStMode] == 1) {
                gsVcodec = "";
                gStreamMode = 1;
                giJpegResol = giJpegStream1Resol;
                gsStNo = "&stream=1";
                btnStreamObject[BTN_STREAM1].displayOn();
                btnStreamObject[BTN_STREAM2].displayOff();
                btnStreamObject[BTN_STREAM3].displayOff();
                // btnStreamObject[BTN_STREAM4].displayOff();
            }
            else if (giJpegEnv2[giStMode] == 1) {
                gsVcodec = "_2";
                gStreamMode = 2;
                giJpegResol = giJpegStream2Resol;
                gsStNo = "&stream=2";
                btnStreamObject[BTN_STREAM1].displayOff();
                btnStreamObject[BTN_STREAM2].displayOn();
                btnStreamObject[BTN_STREAM3].displayOff();
                // btnStreamObject[BTN_STREAM4].displayOff();
            }
            else if (giJpegEnv3[giStMode] == 1) {
                gsVcodec = "_3";
                gStreamMode = 3;
                giJpegResol = giJpegStream3Resol;
                gsStNo = "&stream=3";
                btnStreamObject[BTN_STREAM1].displayOff();
                btnStreamObject[BTN_STREAM2].displayOff();
                btnStreamObject[BTN_STREAM3].displayOn();
                // btnStreamObject[BTN_STREAM4].displayOff();
            }
        }
        else {
            switch (gsDefaultStream) {
                case "jpeg_2":
                    if (giJpegEnv2[giStMode] != 1) {
                        if (giJpegEnv[giStMode] == 1) {
                            gsVcodec = "";
                            gStreamMode = 1;
                            giJpegResol = giJpegStream1Resol;
                            gsStNo = "&stream=1";
                            btnStreamObject[BTN_STREAM1].displayOn();
                            btnStreamObject[BTN_STREAM2].displayOff();
                            btnStreamObject[BTN_STREAM3].displayOff();
                            // btnStreamObject[BTN_STREAM4].displayOff();
                        }
                        else if (giJpegEnv2[giStMode] == 1) {
                            gsVcodec = "_2";
                            gStreamMode = 2;
                            giJpegResol = giJpegStream2Resol;
                            gsStNo = "&stream=2";
                            btnStreamObject[BTN_STREAM1].displayOff();
                            btnStreamObject[BTN_STREAM2].displayOn();
                            btnStreamObject[BTN_STREAM3].displayOff();
                            // btnStreamObject[BTN_STREAM4].displayOff();
                        }
                        else if (giJpegEnv3[giStMode] == 1) {
                            gsVcodec = "_3";
                            gStreamMode = 3;
                            giJpegResol = giJpegStream3Resol;
                            gsStNo = "&stream=3";
                            btnStreamObject[BTN_STREAM1].displayOff();
                            btnStreamObject[BTN_STREAM2].displayOff();
                            btnStreamObject[BTN_STREAM3].displayOn();
                            // btnStreamObject[BTN_STREAM4].displayOff();
                        }
                    }
                    else {
                        gsVcodec = "_2";
                        gStreamMode = 2;
                        giJpegResol = giJpegStream2Resol;
                        gsStNo = "&stream=2";
                        btnStreamObject[BTN_STREAM1].displayOff();
                        btnStreamObject[BTN_STREAM2].displayOn();
                        btnStreamObject[BTN_STREAM3].displayOff();
                        // btnStreamObject[BTN_STREAM4].displayOff();
                    }
                    break;
                case "jpeg_3":
                    if (giJpegEnv3[giStMode] != 1) {
                        if (giJpegEnv[giStMode] == 1) {
                            gsVcodec = "";
                            gStreamMode = 1;
                            giJpegResol = giJpegStream1Resol;
                            gsStNo = "&stream=1";
                            btnStreamObject[BTN_STREAM1].displayOn();
                            btnStreamObject[BTN_STREAM2].displayOff();
                            btnStreamObject[BTN_STREAM3].displayOff();
                            // btnStreamObject[BTN_STREAM4].displayOff();
                        }
                        else if (giJpegEnv2[giStMode] == 1) {
                            gsVcodec = "_2";
                            gStreamMode = 2;
                            giJpegResol = giJpegStream2Resol;
                            gsStNo = "&stream=2";
                            btnStreamObject[BTN_STREAM1].displayOff();
                            btnStreamObject[BTN_STREAM2].displayOn();
                            btnStreamObject[BTN_STREAM3].displayOff();
                            // btnStreamObject[BTN_STREAM4].displayOff();
                        }
                        else if (giJpegEnv3[giStMode] == 1) {
                            gsVcodec = "_3";
                            gStreamMode = 3;
                            giJpegResol = giJpegStream3Resol;
                            gsStNo = "&stream=3";
                            btnStreamObject[BTN_STREAM1].displayOff();
                            btnStreamObject[BTN_STREAM2].displayOff();
                            btnStreamObject[BTN_STREAM3].displayOn();
                            // btnStreamObject[BTN_STREAM4].displayOff();
                        }
                    }
                    else {
                        gsVcodec = "_3";
                        gStreamMode = 3;
                        giJpegResol = giJpegStream3Resol;
                        gsStNo = "&stream=3";
                        btnStreamObject[BTN_STREAM1].displayOff();
                        btnStreamObject[BTN_STREAM2].displayOff();
                        btnStreamObject[BTN_STREAM3].displayOn();
                        // btnStreamObject[BTN_STREAM4].displayOff();
                    }
                    break;
                case "jpeg":
                default:
                    if (giJpegEnv[giStMode] != 1) {
                        if (giJpegEnv[giStMode] == 1) {
                            gsVcodec = "";
                            gStreamMode = 1;
                            giJpegResol = giJpegStream1Resol;
                            gsStNo = "&stream=1";
                            btnStreamObject[BTN_STREAM1].displayOn();
                            btnStreamObject[BTN_STREAM2].displayOff();
                            btnStreamObject[BTN_STREAM3].displayOff();
                            // btnStreamObject[BTN_STREAM4].displayOff();
                        }
                        else if (giJpegEnv2[giStMode] == 1) {
                            gsVcodec = "_2";
                            gStreamMode = 2;
                            giJpegResol = giJpegStream2Resol;
                            gsStNo = "&stream=2";
                            btnStreamObject[BTN_STREAM1].displayOff();
                            btnStreamObject[BTN_STREAM2].displayOn();
                            btnStreamObject[BTN_STREAM3].displayOff();
                            // btnStreamObject[BTN_STREAM4].displayOff();
                        }
                        else if (giJpegEnv3[giStMode] == 1) {
                            gsVcodec = "_3";
                            gStreamMode = 3;
                            giJpegResol = giJpegStream3Resol;
                            gsStNo = "&stream=3";
                            btnStreamObject[BTN_STREAM1].displayOff();
                            btnStreamObject[BTN_STREAM2].displayOff();
                            btnStreamObject[BTN_STREAM3].displayOn();
                            // btnStreamObject[BTN_STREAM4].displayOff();
                        }
                    }
                    else {
                        gsVcodec = "";
                        gStreamMode = 1;
                        giJpegResol = giJpegStream1Resol;
                        gsStNo = "&stream=1";
                        btnStreamObject[BTN_STREAM1].displayOn();
                    }
                    break;
            }
        }
    }

    /**
     * return menubar_GetBitrateMax
     * @returns {*}
     */
    function menubar_GetBitrateMax() {
        if (gsCodec == "h264") {
            return gsSelectHbMax;
        }
        else {
            return 0;
        }
    }



    /**
     * Check Install ActiveX
     * @constructor
     */
    function CheckInstallActiveX() {
        var WebAlarmReceiver = ( document.WebAlarmReceiver );
        var EvPort = _event_port;
        if (EvPort != "") {
            ( WebAlarmReceiver.AlarmRcvPort ) = EvPort;
        } else {
            ( WebAlarmReceiver.AlarmRcvPort ) = "31004";
        }
    }

    /**
     * return PowerState
     * @returns {*|number|string}
     * @constructor
     */
    function GetPowerState() {
        return _power;
    }

    /**
     * set the visibility of stream
     */
    function setStreamListVisibility() {
        giMpegEnv[giStMode] = h264StreamListVisibility[0];
        giMpegEnv2[giStMode] = h264StreamListVisibility[1];
        giMpegEnv3[giStMode] = h264StreamListVisibility[2];
        giMpegEnv4[giStMode] = h264StreamListVisibility[3];

        giJpegEnv[giStMode] = jpegStreamListVisibility[0];
        giJpegEnv2[giStMode] = jpegStreamListVisibility[1];
        giJpegEnv3[giStMode] = jpegStreamListVisibility[2];
    }

    /**
     * get transmit of jpet and h264
     */
    function getJpeg_H264SettingData() {
        var ret = getVideoOverIp;

        if (ret.length > 0) {
            var resultAarry = cparam_getRetArray(ret);

            for (var i = 0; i < resultAarry.length; i++) {
                // get jpeg1's transmit
                if (resultAarry[i].indexOf("jpeg_transmit1=") == 0) {
                    jpegStreamListVisibility[0] = resultAarry[i].substring("jpeg_transmit1=".length);
                    continue;
                }

                // get jpeg2's transmit
                if (resultAarry[i].indexOf("jpeg_transmit2=") == 0) {
                    jpegStreamListVisibility[1] = resultAarry[i].substring("jpeg_transmit2=".length);
                    continue;
                }

                // get jpeg3's transmit
                if (resultAarry[i].indexOf("jpeg_transmit3=") == 0) {
                    jpegStreamListVisibility[2] = resultAarry[i].substring("jpeg_transmit3=".length);
                    continue;
                }

                // get H264_1's transmit
                if (resultAarry[i].indexOf("h264_transmit_ch1=") == 0) {
                    h264StreamListVisibility[0] = resultAarry[i].substring("h264_transmit_ch1=".length);
                    continue;
                }

                // get H264_2's transmit
                if (resultAarry[i].indexOf("h264_transmit_ch2=") == 0) {
                    h264StreamListVisibility[1] = resultAarry[i].substring("h264_transmit_ch2=".length);
                    if(sysStreamMode=="ndi_hx"){
                        h264StreamListVisibility[1] = "0";
                    }
                    continue;
                }

                // get H264_3's transmit
                if (resultAarry[i].indexOf("h264_transmit_ch3=") == 0) {
                    h264StreamListVisibility[2] = resultAarry[i].substring("h264_transmit_ch3=".length);
                    continue;
                }

                // get H264_4's transmit
                if (resultAarry[i].indexOf("h264_transmit_ch4=") == 0) {
                    h264StreamListVisibility[3] = resultAarry[i].substring("h264_transmit_ch4=".length);
                    continue;
                }

                // get Jpeg1's resolution
                if (resultAarry[i].indexOf("resol_stream1=") == 0) {
                    giJpegStream1Resol = resultAarry[i].substring("resol_stream1=".length);
                    continue;
                }
                // get Jpeg2's resolution
                if (resultAarry[i].indexOf("resol_stream2=") == 0) {
                    giJpegStream2Resol = resultAarry[i].substring("resol_stream2=".length);
                    continue;
                }
                // get Jpeg3's resolution
                if (resultAarry[i].indexOf("resol_stream3=") == 0) {
                    giJpegStream3Resol = resultAarry[i].substring("resol_stream3=".length);
                    continue;
                }

                // get h264's resolution
                if (resultAarry[i].indexOf("h264_resolution_ch1=") == 0) {
                    giHr = resultAarry[i].substring("h264_resolution_ch1=".length);
                    continue;
                }

                // get h264_2's resolution
                if (resultAarry[i].indexOf("h264_resolution_ch2=") == 0) {
                    giHr2 = resultAarry[i].substring("h264_resolution_ch2=".length);
                    continue;
                }

                // get h264_3's resolution
                if (resultAarry[i].indexOf("h264_resolution_ch3=") == 0) {
                    giHr3 = resultAarry[i].substring("h264_resolution_ch3=".length);
                    continue;
                }

                // get h264_4's resolution
                if (resultAarry[i].indexOf("h264_resolution_ch4=") == 0) {
                    giHr4 = resultAarry[i].substring("h264_resolution_ch4=".length);
                    continue;
                }

                // get h264's  setting
                // f priority :0/1/2
                if (resultAarry[i].indexOf("h264_f_priority_ch1=") == 0) {
                    h264Settingdata.hfp = resultAarry[i].substring("h264_f_priority_ch1=".length);
                    continue;
                }
                if (resultAarry[i].indexOf("h264_f_priority_ch2=") == 0) {
                    h264Settingdata.hfp2 = resultAarry[i].substring("h264_f_priority_ch2=".length);
                    continue;
                }
                if (resultAarry[i].indexOf("h264_f_priority_ch3=") == 0) {
                    h264Settingdata.hfp3 = resultAarry[i].substring("h264_f_priority_ch3=".length);
                    continue;
                }
                if (resultAarry[i].indexOf("h264_f_priority_ch4=") == 0) {
                    h264Settingdata.hfp4 = resultAarry[i].substring("h264_f_priority_ch4=".length);
                    continue;
                }

                // Transmission type：uni / uni_manual / multi
                if (resultAarry[i].indexOf("h264_unimulti_ch1=") == 0) {
                    h264Settingdata.hum = resultAarry[i].substring("h264_unimulti_ch1=".length);
                    continue;
                }
                if (resultAarry[i].indexOf("h264_unimulti_ch2=") == 0) {
                    h264Settingdata.hum2 = resultAarry[i].substring("h264_unimulti_ch2=".length);
                    continue;
                }
                if (resultAarry[i].indexOf("h264_unimulti_ch3=") == 0) {
                    h264Settingdata.hum3 = resultAarry[i].substring("h264_unimulti_ch3=".length);
                    continue;
                }
                if (resultAarry[i].indexOf("h264_unimulti_ch4=") == 0) {
                    h264Settingdata.hum4 = resultAarry[i].substring("h264_unimulti_ch4=".length);
                    continue;
                }

                // Unicast port(Image):(1024~50000)
                if (resultAarry[i].indexOf("h264_unicast_port_ch1=") == 0) {
                    h264Settingdata.ucthvp = resultAarry[i].substring("h264_unicast_port_ch1=".length);
                    continue;
                }
                if (resultAarry[i].indexOf("h264_unicast_port_ch2=") == 0) {
                    h264Settingdata.ucthvp2 = resultAarry[i].substring("h264_unicast_port_ch2=".length);
                    continue;
                }
                if (resultAarry[i].indexOf("h264_unicast_port_ch3=") == 0) {
                    h264Settingdata.ucthvp3 = resultAarry[i].substring("h264_unicast_port_ch3=".length);
                    continue;
                }
                if (resultAarry[i].indexOf("h264_unicast_port_ch4=") == 0) {
                    h264Settingdata.ucthvp4 = resultAarry[i].substring("h264_unicast_port_ch4=".length);
                    continue;
                }

                // Unicast port(Audio):(1024~50000)
                if (resultAarry[i].indexOf("h264_unicast_audio_port_ch1=") == 0) {
                    h264Settingdata.ucthap = resultAarry[i].substring("h264_unicast_audio_port_ch1=".length);
                    continue;
                }
                if (resultAarry[i].indexOf("h264_unicast_audio_port_ch2=") == 0) {
                    h264Settingdata.ucthap2 = resultAarry[i].substring("h264_unicast_audio_port_ch2=".length);
                    continue;
                }
                if (resultAarry[i].indexOf("h264_unicast_audio_port_ch3=") == 0) {
                    h264Settingdata.ucthap3 = resultAarry[i].substring("h264_unicast_audio_port_ch3=".length);
                    continue;
                }
                if (resultAarry[i].indexOf("h264_unicast_audio_port_ch4=") == 0) {
                    h264Settingdata.ucthap4 = resultAarry[i].substring("h264_unicast_audio_port_ch4=".length);
                    continue;
                }

                //  Multicast address: xxx.xxx.xxx.xxx
                if (resultAarry[i].indexOf("h264_multicast_addr_ch1=") == 0) {
                    h264Settingdata.hmuc = resultAarry[i].substring("h264_multicast_addr_ch1=".length);
                    continue;
                }
                if (resultAarry[i].indexOf("h264_multicast_addr_ch2=") == 0) {
                    h264Settingdata.hmuc2 = resultAarry[i].substring("h264_multicast_addr_ch2=".length);
                    continue;
                }
                if (resultAarry[i].indexOf("h264_multicast_addr_ch3=") == 0) {
                    h264Settingdata.hmuc3 = resultAarry[i].substring("h264_multicast_addr_ch3=".length);
                    continue;
                }
                if (resultAarry[i].indexOf("h264_multicast_addr_ch4=") == 0) {
                    h264Settingdata.hmuc4 = resultAarry[i].substring("h264_multicast_addr_ch4=".length);
                    continue;
                }

                //   Multicast port: (1024~50000)
                if (resultAarry[i].indexOf("h264_multicast_port_ch1=") == 0) {
                    h264Settingdata.hcpm = resultAarry[i].substring("h264_multicast_port_ch1=".length);
                    continue;
                }
                if (resultAarry[i].indexOf("h264_multicast_port_ch2=") == 0) {
                    h264Settingdata.hcpm2 = resultAarry[i].substring("h264_multicast_port_ch2=".length);
                    continue;
                }
                if (resultAarry[i].indexOf("h264_multicast_port_ch3=") == 0) {
                    h264Settingdata.hcpm3 = resultAarry[i].substring("h264_multicast_port_ch3=".length);
                    continue;
                }
                if (resultAarry[i].indexOf("h264_multicast_port_ch4=") == 0) {
                    h264Settingdata.hcpm4 = resultAarry[i].substring("h264_multicast_port_ch4=".length);
                    continue;
                }

                //   Multicast TTL/HOPLimit: (1~254)
                if (resultAarry[i].indexOf("h264_multicast_ttl_ch1=") == 0) {
                    h264Settingdata.hctm = resultAarry[i].substring("h264_multicast_ttl_ch1=".length);
                    continue;
                }
                if (resultAarry[i].indexOf("h264_multicast_ttl_ch2=") == 0) {
                    h264Settingdata.hctm2 = resultAarry[i].substring("h264_multicast_ttl_ch2=".length);
                    continue;
                }
                if (resultAarry[i].indexOf("h264_multicast_ttl_ch3=") == 0) {
                    h264Settingdata.hctm3 = resultAarry[i].substring("h264_multicast_ttl_ch3=".length);
                    continue;
                }
                if (resultAarry[i].indexOf("h264_multicast_ttl_ch4=") == 0) {
                    h264Settingdata.hctm4 = resultAarry[i].substring("h264_multicast_ttl_ch4=".length);
                }
            }
        }
    }

    /**
     * return menubar_getH264SettingData
     * @returns {{}}
     */
    function menubar_getH264SettingData() {
        return h264Settingdata;
    }

    /**
     * jump to new html by powerFlg
     */
    function powerFlg() {
        onloadNptz();
        var power = _power;
        if (power == 1) {
            displayBaseHeaderTab.settingButtonOff();

        }
    }

    /**
     * init the left page
     */
    function InitLeftPage() {
        if (cparams.ndihx_activate_model) {
            $("#activation").html("&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; " + NPTZ_WORDING.wID_0096);
        }
        var bIsIE = IsIE();

        if (bIsIE == true && sysStreamMode != 'rtmp') {
            // DO NOTHING
        }
        else {
            if ((gsDefaultStream == "jpeg") || (gsDefaultStream == "jpeg_2") || (gsDefaultStream == "jpeg_3")) {
                // DO NOTHING
            }
            else {
                // IE以外の場合H.264しか配信させないので、強制的に変更
                gsDefaultStream = "jpeg";
                giMpegEnv[giStMode] = 0;
                giMpegEnv2[giStMode] = 0;
                giMpegEnv3[giStMode] = 0;
                giMpegEnv4[giStMode] = 0;
            }
        }

        gDebug = document.getElementById("view_debug");

        if ((giMpegEnv[giStMode] == 0) && (giMpegEnv2[giStMode] == 0) && (giMpegEnv3[giStMode] == 0) && (giMpegEnv4[giStMode] == 0)) {
            gsCodec = "jpeg";
            gsJpegStream = "jpeg";

            if (gsDefaultStream.indexOf("h264") == 0) {
                gsDefaultStream = "jpeg";
            }
        }
        if (gsDefaultStream.indexOf("jpeg") == 0) {
            gsCodec = "jpeg";
            gsJpegStream = gsDefaultStream;

            if ((_jt != 1) && (_jt2 != 1) && (_jt3 != 1)) {
                gsCodec = "h264";
                gsDefaultStream = "h264";
            }
        }
        else {
            gsCodec = gvCodec[giStMode][0];
        }

        if ((giMpegEnv[giStMode] == 0) && (giMpegEnv2[giStMode] == 0) && (giMpegEnv3[giStMode] == 0) && (giMpegEnv4[giStMode] == 0)
            && _jt != 1 && _jt != 1 && _jt3 != 1) {
            gsCodec = "jpeg";
            gsJpegStream = "jpeg";
            gsDefaultStream = "jpeg";
        }

        // get transmit
        getJpeg_H264SettingData();
        // save trasmit data to giMpegEnv
        setStreamListVisibility();

        if (gChangeMenuFlg == 0) {
            titlebar_main_SetNoPush(false);
            SetTrans();
            SetTrans2();
            SetTrans3();
            SetTrans4();
        }

        // if (gsCodec == "jpeg") {
        //     btnStreamObject[BTN_STREAM4].hide();
        // }else{
        //     btnStreamObject[BTN_STREAM4].show();
        // }
        DispStream();
        switch (gsDefaultStream) {
            case "h264_2":
            case "jpeg_2":
                ChangeStream(2, 0,true);
                changeMaskMode(1,true);
                break;
            case "h264_3":
            case "jpeg_3":
                ChangeStream(3, 0,true);
                changeMaskMode(2,true);
                break;
            case "h264_4":
                ChangeStream(4, 0,true);
                changeMaskMode(3,true);
                break;
            case "h264":
            case "jpeg":
            default:
                ChangeStream(1, 0,true);
                changeMaskMode(0,true);
                break;
        }
        try {
            ChangeCodecMode(gsCodec, 0)
        }
        catch (e) {

        }
        try {
            document.execCommand("BackgroundImageCache", false, true);
        } catch (e) {
            window.alert("Image Cache Error");
        }

        if (_power == 0) {
            menubarBtnDisabled();
            gFlgStopViewLoading = 1;
            document.getElementById("mainViewHtml").src = "/live/mainview_standby.html";
        } else {
            if (_lvl == 1) {
                gFlgLock = 1;
                SetOperateLock();
            }
            RequestStartLive();
        }

        GetImageStatus();
        if (gChangeMenuFlg == 1) {
            gChangeMenuFlg = 0;	// Menu切替フラグクリア
        }
    }

    var gsNoPushFlg = true;

    function titlebar_main_SetNoPush(gsSetFlg) {
        gsNoPushFlg = gsSetFlg;
    }


    return {
        build: build,
        show: show,
        jpegButtonChangeOn: jpegButtonChangeOn,
        menubarBtnDisabled: menubarBtnDisabled,
        displayOnStream1Butten: function () {
            btnStreamObject[BTN_STREAM1].displayOn();
        },
        ChangeStream: ChangeStream,
        InitLeftPage: InitLeftPage,
        menubar_GetStreamInfo: menubar_GetStreamInfo,  // mainView.html
        menubar_getH264SettingData: menubar_getH264SettingData, // mainView.html
        menubar_GetStreamMode: menubar_GetStreamMode, // mainView.html
        menubar_GetQuality: menubar_GetQuality, // mainView.html
        menubar_GetBitrateMax: menubar_GetBitrateMax, // mainView.html
        menubar_GetStreamNo: menubar_GetStreamNo,// mainView.html
        menubar_GetResolution: menubar_GetResolution,// mainView.html
        menubar_GetFramerate: menubar_GetFramerate,// mainView.html
        GetPowerState: GetPowerState,// mainView.html  cparam.js
        menubar_GetOpLockState: menubar_GetOpLockState,//  cparam.js
        menubar_GetMultiMode: menubar_GetMultiMode,// many html
        powerFlg: powerFlg, //index.html
        menubar_GetResolution: menubar_GetResolution, // mainView.html
        gChangeMenuFlg: gChangeMenuFlg,
        gPower: _power,
        DoSubmitPower: DoSubmitPower,
        menubar_GetCodecMode: menubar_GetCodecMode,
        _menubar_SetStreamInfo: _menubar_SetStreamInfo,
        menubarStreamBtnDisabled:menubarStreamBtnDisabled,
        menubarStreamBtnOn:menubarStreamBtnOn,
        getBtnLockObjcet:getBtnLockObjcet,
        isAllChannelOFF:isAllChannelOFF,
        isStreamBtnChangeFun:isStreamBtnChangeFun,
        RequestStartLive:RequestStartLive,
        callBtnStream:callBtnStream,
        changeViewStatus:changeViewStatus,
        checkBlackView:checkBlackView        
    };
}

/**
 * カメラリスト領域制御クラス
 * @class カメラリスト領域制御クラス
 * @return {function} build 構築処理
 * @return {function} rebuild 再構築処理
 * @return {function} show 表示処理
 * @constructor
 */
function MenubarOsd() {

    /**
     * 構築済みフラグ
     * @type boolean
     */
    var buildFlag = false;

    /**
     * ボタンオブジェクト
     * @type ButtonCtrl[]
     */
    var btnObject = [];

    /**
     * OSD_BTN_UP(インデックス値)
     * @type number
     */
    var OSD_BTN_UP = 0;

    /**
     * OSD_BTN_DOWN(インデックス値)
     * @type number
     */
    var OSD_BTN_DOWN = 1;

    /**
     * OSD_BTN_LEFT(インデックス値)
     * @type number
     */
    var OSD_BTN_LEFT = 2;

    /**
     * OSD_BTN_RIGHT(インデックス値)
     * @type number
     */
    var OSD_BTN_RIGHT = 3;

    /**
     * OSD_BTN_ENTER(インデックス値)
     * @type number
     */
    var OSD_BTN_ENTER = 4;

    /**
     * OSD_BTN_CANCEL(インデックス値)
     * @type number
     */
    var OSD_BTN_CANCEL = 5;

    /**
     * OSD_ONSETTING(インデックス値) : on/off
     * @type number
     */
    var OSD_ONSETTING_ON = 6;
    /**
     * OSD_ONSETTING(インデックス値) : on/off
     * @type number
     */
    var OSD_ONSETTING_OFF = 7;
    /**
     * OSD_ONSETTING(インデックス値) : on/off
     * @type number
     */
    var OSD_COLORBAR_ON = 8;
    /**
     * OSD_ONSETTING(インデックス値) : on/off
     * @type number
     */
    var OSD_COLORBAR_OFF = 9;

    /**
     * テキストオブジェクト
     * @type {Array}
     */
    var txtObject = [];

    /**
     * multi_screen(インデックス値)
     * @type number
     */
    var TXT_COLOR_BAR = 0;
    /**
     * multi_screen(インデックス値)
     * @type number
     */
    var TXT_BARS_TYPE = 1;
    /**
     * multi_screen(インデックス値)
     * @type number
     */
    var TXT_OSD_MENU = 2;
    /**
     * multi_screen(インデックス値)
     * @type number
     */
    var selectObject;

    /**
     * menubarOsd領域の構築処理
     */
    function build() {
        // 共通エリアの構築
        if (buildFlag == false) {
            buildFlag = true;
            btnObject[OSD_ONSETTING_ON] = ButtonCtrl('camera_osd_menu', 'osd_onSetting', NPTZ_WORDING.wID_0037, callbackSettingCtrl, OSD_ONSETTING_ON);
            btnObject[OSD_ONSETTING_OFF] = ButtonCtrl('camera_osd_menu', 'osd_onSetting_off', NPTZ_WORDING.wID_0038, callbackSettingCtrl, OSD_ONSETTING_OFF);
            btnObject[OSD_COLORBAR_ON] = ButtonCtrl('camera_osd_menu', 'osd_corlorbar_on', NPTZ_WORDING.wID_0037, callbackCamBar, 1);
            btnObject[OSD_COLORBAR_OFF] = ButtonCtrl('camera_osd_menu', 'osd_corlorbar_off', NPTZ_WORDING.wID_0038, callbackCamBar, 0);
            btnObject[OSD_BTN_UP] = ButtonCtrl('camera_osd_menu', 'osd_btn_up', "", callbackSettingCtrl, OSD_BTN_UP);
            btnObject[OSD_BTN_DOWN] = ButtonCtrl('camera_osd_menu', 'osd_btn_down', "", callbackSettingCtrl, OSD_BTN_DOWN);
            btnObject[OSD_BTN_LEFT] = ButtonCtrl('camera_osd_menu', 'osd_btn_left', "", callbackSettingCtrl, OSD_BTN_LEFT);
            btnObject[OSD_BTN_RIGHT] = ButtonCtrl('camera_osd_menu', 'osd_btn_right', "", callbackSettingCtrl, OSD_BTN_RIGHT);
            btnObject[OSD_BTN_ENTER] = ButtonCtrl('camera_osd_menu', 'osd_btn_enter', NPTZ_WORDING.wID_0039, callbackSettingCtrl, OSD_BTN_ENTER);
            btnObject[OSD_BTN_CANCEL] = ButtonCtrl('camera_osd_menu', 'osd_btn_cancel', NPTZ_WORDING.wID_0040, callbackSettingCtrl, OSD_BTN_CANCEL);

            txtObject[TXT_COLOR_BAR] = TextCtrl('camera_sd_record', 'wrapper_label_color_bar', NPTZ_WORDING.wID_0177);
            txtObject[TXT_BARS_TYPE] = TextCtrl('camera_osd_menu', 'txt_bars_type', NPTZ_WORDING.wID_0178);
            txtObject[TXT_OSD_MENU] = TextCtrl('camera_osd_menu', 'txt_osd_Menu', NPTZ_WORDING.wID_0046);

            // id を追加
            $(".wrapper_label_color_bar").attr('id', "wrapper_label_color_bar");
            $(".txt_bars_type").attr('id', "txt_bars_type");
            $(".txt_osd_Menu").attr('id', "txt_osd_Menu");
            $(".osd_onSetting").attr('id', "osd_onSetting");
            $(".osd_onSetting_off").attr('id', "osd_onSetting_off");
            $(".osd_corlorbar_on").attr('id', "osd_corlorbar_on");
            $(".osd_corlorbar_off").attr('id', "osd_corlorbar_off");
            $(".osd_btn_up").attr('id', "osd_btn_up");
            $(".osd_btn_down").attr('id', "osd_btn_down");
            $(".osd_btn_left").attr('id', "osd_btn_left");
            $(".osd_btn_right").attr('id', "osd_btn_right");
            $(".osd_btn_enter").attr('id', "osd_btn_enter");
            $(".osd_btn_cancel").attr('id', "osd_btn_cancel");


            // 定期状態確認(power)
            setTimeout(function(){
                refresh_power_id = setInterval(function () {
                    refresh_powerStatus();
                }, 5000);
            },900);
            selectObject = SelectCtrl("camera_osd_menu", "select_live_osd_color_type", "select_live_osd_color_type", "select_live_osd_color_type", callbackLiveColorType);
            var select_osd_type_value = [];
            var select_osd_type_text = [];
            select_osd_type_value.push(
                1,
                0,
                2,
                3,
                4
            );
            select_osd_type_text.push(
                "Type1",
                "Type2",
                "Type3",
                "Type4",
                "Type5"
            );
            selectObject.appendOptions(select_osd_type_value, select_osd_type_text);
            selectObject.show();
            selectObject.displayOff();
            selectObject.val(cparam_get_colorBarType());
        }
    }

    function callbackLiveColorType() {
        var value = $("#select_live_osd_color_type option:selected").val();
        if (value == 0) {
            cparam_set_colorBarType(0);
        } else  if (value == 1){
            cparam_set_colorBarType(1);
        }else if (value == 2){
            cparam_set_colorBarType(2);
        }else if (value == 3){
            cparam_set_colorBarType(3);
        }else if (value == 4){
            cparam_set_colorBarType(4);
        }
    }

    /**
     * menubarOsd領域の表示処理
     */
    function show() {
        for (var txt in txtObject) {
            txtObject[txt].show()
        }

        if (gPower == 0) {
            for (var btn in btnObject) {
                btnObject[btn].displayDisabled();
            }
        } else {
            for (var btn in btnObject) {
                btnObject[btn].show();
                btnObject[btn].displayOff();
            }
            if (cparam_get_bar() != 1) {
                btnObject[OSD_COLORBAR_OFF].displayOn();
                selectObject.displayDisabled();
            } else {
                btnObject[OSD_COLORBAR_ON].displayOn();
                selectObject.displayOff();
            }
            if(cparam_get_menuOnOFF() != 0) {
                btnObject[OSD_ONSETTING_ON].displayOn();
            } else {
                btnObject[OSD_ONSETTING_OFF].displayOn();
            }
        }
    }


    /**
     * menubar Button Disabled
     */
    function menubarOsdBtnDisplayOff() {
        $(".wrapper_label_color_bar").css("color", "");
        $(".txt_bars_type").css("color", "");
        $(".txt_osd_Menu").css("color", "");
        selectObject.displayOff();
        selectObject.val(cparam_get_colorBarType());

        for (var btn in btnObject) {
            btnObject[btn].displayOff();
        }

    }

    /**
     * menubarOsd Button Disabled
     */
    function menubarOsdBtnDisabled() {
        $(".wrapper_label_color_bar").css("color", "rgb(102,102,102)");
        $(".txt_bars_type").css("color", "rgb(102,102,102)");
        $(".txt_osd_Menu").css("color", "rgb(102,102,102)");
        selectObject.displayDisabled();
        btnObject[OSD_ONSETTING_ON].displayDisabled();
        btnObject[OSD_ONSETTING_OFF].displayDisabled();
        btnObject[OSD_COLORBAR_ON].displayDisabled();
        btnObject[OSD_COLORBAR_OFF].displayDisabled();
        btnObject[OSD_BTN_UP].displayDisabled();
        btnObject[OSD_BTN_DOWN].displayDisabled();
        btnObject[OSD_BTN_LEFT].displayDisabled();
        btnObject[OSD_BTN_RIGHT].displayDisabled();
        btnObject[OSD_BTN_ENTER].displayDisabled();
        btnObject[OSD_BTN_CANCEL].displayDisabled();
    }


    /**
     * update powerStatus
     */
    function refresh_powerStatus() {
        menubar_ChkPower(gPower);
    }

    /**
     * check powerStatus
     * @param iPow
     */
    function menubar_ChkPower(iPow) {
        sPower = cparam_get_powerOnStandby();
        if (sPower != iPow) { // 画面Open時とPower状態が変わっていたらリロード
            clearTimeout(refresh_power_id);
            setTimeout(function(){
                window.location.href = '/live/index.html';
            }, 1000);
        }
    }

    /**
     * submit the status of menu depend on key
     * @param key
     * @returns {boolean}
     */
    function menubar_doSubmitMenuKey( key )
    {
        switch (key) {
            case 0:
                cparam_set_upBotton(1);
                break;
            case 1:
                cparam_set_downBotton(1);
                break;
            case 2:
                cparam_set_leftBotton(1);
                break;
            case 3:
                cparam_set_rightBotton(1);
                break;
            case 4:
                cparam_set_enterBotton(1);
                break;
            case 5:
                cparam_set_menuCancel(1);
                break;
            default:
                return false;
        }
    }

    /**
     * submit the status of menu : on/off
     * @returns {boolean}
     */
    function menubar_doSubmitMenuOnOff(type) {
        if(type == 6){
            cparam_set_menuOnOFF(1);
        }else if(type == 7 ){
            cparam_set_menuOnOFF(0);
        }
    }


    /**
     * HeaderTab:MAIN 押下時の画面制御
     * @param {number} mouse マウス・ボタン操作状況
     */
    function callbackSettingCtrl(mouse, type) {

        if (mouse == Button.MOUSE_UP){
            // 無効表示の際には何もしない。
            if (btnObject[OSD_BTN_UP].getStatus() == Button.STATUS_DISABLED || btnObject[OSD_BTN_UP].getStatus() == Button.STATUS_ON_DISABLED) {
                return;
            }
            switch (type) {
                case 0:
                    btnObject[OSD_BTN_UP].displayOff();
                    break;
                case 1:
                    btnObject[OSD_BTN_DOWN].displayOff();
                    break;
                case 2:
                    btnObject[OSD_BTN_LEFT].displayOff();
                    break;
                case 3:
                    btnObject[OSD_BTN_RIGHT].displayOff();
                    break;
                case 4:
                    btnObject[OSD_BTN_ENTER].displayOff();
                    break;
                case 5:
                    btnObject[OSD_BTN_CANCEL].displayOff();
                    break;
                default:
                    return false;
            }

        } else if (mouse == Button.MOUSE_DOWN) {

            if (type == OSD_ONSETTING_ON || type == OSD_ONSETTING_OFF) {
                menubar_doSubmitMenuOnOff(type);
            } else {
                menubar_doSubmitMenuKey(Number(type));
            }
            switch (type) {
                case 0:
                    btnObject[OSD_BTN_UP].displayOn();
                    break;
                case 1:
                    btnObject[OSD_BTN_DOWN].displayOn();
                    break;
                case 2:
                    btnObject[OSD_BTN_LEFT].displayOn();
                    break;
                case 3:
                    btnObject[OSD_BTN_RIGHT].displayOn();
                    break;
                case 4:
                    btnObject[OSD_BTN_ENTER].displayOn();
                    break;
                case 5:
                    btnObject[OSD_BTN_CANCEL].displayOn();
                    break;
                case 6:
                    btnObject[OSD_ONSETTING_ON].displayOn();
                    btnObject[OSD_ONSETTING_OFF].displayOff();
                    break;
                case 7:
                    btnObject[OSD_ONSETTING_ON].displayOff();
                    btnObject[OSD_ONSETTING_OFF].displayOn();
                    break;
                default:
                    return false;
            }
        } else {
            // 処理なし
        }
    }

    function callbackCamBar(mouse, cam_bar) {
        if (mouse == Button.MOUSE_UP) {

        } else if (mouse == Button.MOUSE_DOWN) {
            if (cam_bar == 0) {
                btnObject[OSD_COLORBAR_ON].displayOff();
                btnObject[OSD_COLORBAR_OFF].displayOn();
                selectObject.displayDisabled();

            } else {

                btnObject[OSD_COLORBAR_ON].displayOn();
                btnObject[OSD_COLORBAR_OFF].displayOff();
                selectObject.displayOff();
            }
            var url;
            var xhr = null;

            if (false) {
                return false;
            } else {
                if (cam_bar == 0) {
                    url = '/cgi-bin/aw_cam?cmd=DCB:0&res=1';
                } else {
                    url = '/cgi-bin/aw_cam?cmd=DCB:1&res=1';
                }

                $.get(url, function (data, status) {
                    xhr = status;
                    if (!xhr) {
                    } else {
                        // DO NOTHING
                    }
                });
            }
        }
    }

    /**
     * control lock button
     */
    function btnLockSetting() {
        callbackSettingLock(Button.MOUSE_DOWN);
    }

    /**
     * selectObject return
     * @param mouse
     */
    function callbackSelectObject(mouse) {
        return selectObject;
    }


    return {
        build: build,
        show: show,
        menubarOsdBtnDisabled:menubarOsdBtnDisabled,
        menubarOsdBtnDisplayOff:menubarOsdBtnDisplayOff,
        btnLockSetting: btnLockSetting,
        callbackSelectObject : callbackSelectObject
    };

}

var myDOM = {};
myDOM.ajax = {};

myDOM.ajax.GetHttpRequest = function (url, callback, headers) {
    var xhr = null;
    if (window.XMLHttpRequest) {
        xhr = new window.XMLHttpRequest();
    } else if (window.ActiveXObject) {
        try {
            xhr = new window.ActiveXObject("MSXML2.XMLHTTP.6.0");
        } catch (e) {
            try {
                xhr = new window.ActiveXObject("MSXML2.XMLHTTP.3.0");
            } catch (e) {
                try {
                    xhr = new window.ActiveXObject("MSXML2.XMLHTTP");
                } catch (e) {
                    window.alert("XMLHttpRequest / MSXML2.XMLHTTP is NOT exist !");
                    return null;
                }
            }
        }
    } else {
        return null;
    }

    if (xhr != null) {
        xhr.open('GET', url, true);
        xhr.setRequestHeader('Pragma', 'no-cache');
        xhr.setRequestHeader('Cache-Control', 'no-cache');
        xhr.setRequestHeader('If-Modified-Since', 'Thu, 01 Jun 1970 00:00:00 GMT');
        if (typeof( headers ) == 'object') {
            for (var name in headers) {
                xhr.setRequestHeader(name, headers[name]);
            }
        } else {
            // DO NOTHING
        }
        if (typeof( callback ) == 'function') {
            xhr.onreadystatechange = function () {
                if (xhr.readyState == 4) {
                    callback(xhr);
                } else {
                    // DO NOTHING
                }
            };
        } else {
            // DO NOTHING
        }
        xhr.send(null);
    } else {
        return null;
    }
    return xhr;
};

/**
 * refresh this page
 */
function refreshDiv() {
    window.location.href = '/live/index.html';
}

/**
 * change mainView.html
 */
function cparam_frmRightRequest(flg) {
    if (menubarCtrl.gChangeMenuFlg == 1) {
        return;
    }
    var bIsIE = IsIE();
	var liveStream = '0';
    liveStream = menubarCtrl.streamControler._menubar_SetStreamInfo("/cgi-bin/getuid?FILE=1&vcodec=" + gVcodec1 + gVcodec2);
    if(flg){
        return;
    }
    if (bIsIE) {

        if (liveStream == '90' || liveStream == false) {
        	document.getElementById("mainViewHtml").src = "/live/mainview_disabled.html";

        	return;
         }
          else if(liveStream == '99') {
            document.getElementById("mainViewHtml").src = "/live/mainview_ipv6_disabled.html";
            return;
         }
    }

    if(bIsIE){
        mainViewHtml.location.replace("/live/black_mainview.html");
        $("#tracking_controller").css("left", ( 280) + "px");
    }else{
    }
    mainViewHtml.location.replace("/live/mainview.html");
    if (bIsIE == true) {
        try {
            CheckInstallActiveX();
        } catch (e) {

        }
    }
    else {
        if(flg){
            return;
        }
        document.getElementById("mainViewHtml").src = "/live/mainview.html";
    }
    // if(flg){
    //     return;
    // }
    // window.parent.document.getElementById("tracking_controller").style.display = "";
}