/**
 * @fileOverview Setup画面:Image/Audio制御に関わる画面クラス
 *
 * @author Panasonic Corporation
 */

/**
 * Video Over IP 機能
 */
var videooverip = videoOverIP();

/**
 *  audio機能
 */
var audioInstance = audio();

/**
 *  imageAdjust機能
 */
var imageAdjustInstance = imageAdjust();

/**
 *  lens機能
 */
var lensInstance = lens();
/**
 *  MonitorDisplay機能
 */
var monitorDisplay = MonitorDisplay();
/**
 *  virtualStudio機能
 */
var virtualStudioInstance = virtualStudio();
/**
 *  lens機能
 */
var p2CastInstance = p2Cast();
/**
 *  cspControl機能
 */
var cspControlInstance = cspControl();
/**
 * get_video_over_ip
 */
var objVOIP;

/**
 * �E�E�E�RTMP�E�E�E�ServerSetup
 */
function setRtmpParam(type, url, key) {
    var data = {};
    if (type == 0) {
        data['type'] = type;
        data['url'] = url;
    } else {
        data['type'] = type;
        data['url'] = url;
        data['key'] = key;
    }
    $("#dialog_setup").show();
    $.ajax({
        type: "get",
        url: "/cgi-bin/set_rtmp_param",
        data: data,
        async: false,
        timeout: 100,
        success: function (data) {
            setTimeout(function () {
                $("#dialog_setup").hide();
            }, 500);
        },
        error: function (jqXHR, textStatus, errorThrown) {
            setTimeout(function () {
                $("#dialog_setup").hide();
            }, 500);
        }
    });
}

function getRtmpParam() {
    var retValue = {};
    $.ajax({
        type: "get",
        url: "/cgi-bin/get_rtmp_param",
        async: false,
        timeout: 100,
        success: function (data) {
            var dataArray = cparam_getRetArray(data);
            var type;
            var url;
            var key;
            if (dataArray[0].indexOf('type') != -1) {
                type = dataArray[0].substring('type'.length + 1);
            }
            if (dataArray[1].indexOf("url") != -1) {
                url = dataArray[1].substring("url".length + 1);
            }
            if (dataArray[2].indexOf("key") != -1) {
                key = dataArray[2].substring("key".length + 1);
            }
            retValue.type = type;
            retValue.url = url;
            retValue.key = key;
        },
        error: function (jqXHR, textStatus, errorThrown) {
        }
    });
    return retValue;
}

/**
 * Set Stream Mode
 * @param mode
 */
function setStreamMode(mode) {
    $("#dialog_setup").show();
    $.ajax({
        type: "post",
        timeout: 20 * 1000,
        url: "/cgi-bin/set_stream_mode",
        data: { mode: mode },
        success: function (data) {
        },
        error: function (jqXHR, textStatus, errorThrown) {
        }
    });
}

function getCurrentSettings() {
    getCurrentSystemFrequency();
    getCurrentFormat();
    getCurrentStreamMode();
}

function getCurrentStreamMode() {
    sysCommon.streamingMode = getStreamMode();
}

function CheckPort(iValue) {

    if ((iValue < 1024) || (iValue > 50000)) {
        return false;
    }
    if ((iValue % 2) == 1) {
        return false;
    }
    return true;
}

function CheckNum(str) {
    const sValid = "0123456789";
    const sWork = str.toLowerCase();
    for (var i = 0; i < sWork.length; i++) {
        var ch = sWork.charAt(i);
        if (sValid.indexOf(ch) < 0) {
            return false;
        }
    }
    return true;
}

function filterNumber(event) {
    const e = event.which ? event.which : window.event.keyCode;
    if (e < 48 || e > 57) {
        return false;
    }
}
function getSt2110Info() {
    var url = "/cgi-bin/get_st2110_info";
    var ret = cparam_sendRequest(url);
    var result = {};
    if (ret) {
        ret = cparam_getRetArray(ret);
    }
    return ret;
}
function getSt2110InfoResult(ret) {
    var result = { enable: "", port: "" };
    if (ret) {
        for (var i = 0; i < ret.length; i++) {
            if (ret[i].indexOf('enable=') == 0) {
                result.enable = ret[i].substring('enable='.length);
                continue;
            }
            if (ret[i].indexOf('port=') == 0) {
                result.port = ret[i].substring('port='.length);
                continue;
            }
        }
    }
    return result;
}
/**
 * videoOverIP画面:videoOverIP制御に関わる画面クラス
 * @class videoOverIP画面:videoOverIP制御に関わる画面クラス
 * @return {{build: buildVideoOverIP, rebuild: rebuild}} build 構築�E琁E
 * @return {function} rebuild 再構築�E琁E
 * @return {function} show 表示処琁E
 * @return {function} hide 非表示処琁E
 * @constructor
 */
function videoOverIP() {
    /**
     * settingStreamingMode 機能
     * @type settingStreamingMode
     * */
    var settingStatus = settingStatus();

    /**
     * settingStreamingMode 機能
     * @type settingStreamingMode
     * */
    var settingStreamingMode = settingStreamingMode();
    /**
     * settingInitialDisplaySetting 機能
     * @type settingInitialDisplaySetting
     * */
    var settingInitialDisplaySetting = settingInitialDisplaySetting();
    /**
     * settingTimecodeOverlay 機能
     * @type settingTimecodeOverlay
     * */
    var settingTimecodeOverlay = settingTimecodOverlay();

    /**
     * JPEG 機能
     * @type settingJPEG
     * */
    var settingJPEG = settingJPEG();
    /**
     * H264 機能
     * @type settingH264
     * */
    var settingH264 = settingH264();
    /**
     * H264 機能
     * @type settingH264
     * */
    var settingH264_u = settingH264_u();
    /**
     * H265 機能
     * @type settingH265
     * */
    var settingH265 = settingH265();
    /**
     * H265 機能
     * @type settingNDIHX
     * */
    var settingNDIHX = settingNDIHX();
    /**
     * RTMP StreamingFormat 機能
     * @type settingRTMPStreamingFormat
     * */
    var settingRTMPStreamingFormat = settingRTMPStreamingFormat();
    /**
     * RTMP server setup 機能
     * @type settingRTMPServerSetup
     * */
    var settingRTMPServerSetup = settingRTMPServerSetup();
    var settingSrtOrTs = settingSrtOrTs();
    var settingNDI = settingFullBandwidth();
    var settingNDIV2 = settingNDIHXV2();
    /**
     * 構築フラグ
     * @type boolean
     */
    let buildFlag_videoOverIP = false;
    /**
     * ボタンオブジェクチE
     * @type btnObject[]
     */
    let btnObject = [];
    /**
     * チE�E��E�ストオブジェクチE
     * @type btnObject[]
     */
    let txtObject = [];
    /**
     * チE�E��E�ストオブジェクチE
     * @type txtJPEGObject
     */
    let txtJPEGObject;
    /**
     * ボタンオブジェクチE
     * @type btnJPEGObject[]
     */
    let btnJPEGObject = [];
    /**
     * チE�E��E�ストオブジェクチE
     * @type txtH264Object
     */
    let txtH264Object;
    /**
     * ボタンオブジェクチE
     * @type btnH264Object[]
     */
    let btnH264Object = [];
    /**
     * チE�E��E�ストオブジェクチE
     * @type txtH265Object
     */
    let txtH265Object;
    /**
     * ボタンオブジェクチE
     * @type btnH264Object[]
     */
    let btnH265Object = [];
    /**
     * チE�E��E�ストオブジェクチE
     * @type txtRTMPObject
     */
    let txtRTMPObject;
    /**
     * ボタンオブジェクチE
     * @type btnRTMPObject[]
     */
    let btnRTMPObject = [];
    /**
     * ボタンオブジェクチE
     * @type btnSRTObject[]
     */
    let btnSRTObject = [];
    /**
     * チE�E��E�ストオブジェクチE
     * @type txtNDIHXObject
     */
    let txtNDIHXObject;
    /**
     * チE�E��E�ストオブジェクチE
     * @type txtNDIHXObject
     */
    let txtNDIObject;
    /**
     * ボタンオブジェクチE
     * @type btnNDIHXObject[]
     */
    let btnNDIHXObject = [];
    /**
     * ボタンオブジェクチE
     * @type btnNDIHXObject[]
     */
    let btnNDIObject = [];
    /**
     * NDIボタンオブジェクチEインチE�E��E�クス値)
     *  @type object
     */
    const BTN_NDI_INDEX = 0;
    /**
     * label定義
     * @type number
     */
    const TXT_VIDEO_OVER_IP = 0;
    /**
     * btn_user_authボタンオブジェクチEインチE�E��E�クス値)
     *  @type object
     */
    const BTN_SETTING_STATUS_INDEX = 0;
    /**
     * btn_host_authボタンオブジェクチEインチE�E��E�クス値)
     *  @type object
     */
    const BTN_STREAMING_MODE_INDEX = 1;
    /**
     * btn_priority_streamボタンオブジェクチEインチE�E��E�クス値)
     *  @type object
     */
    const BTN_INITIAL_DISPLAY_SETTING_INDEX = 2;
    /**
     * Timecode overlayボタンオブジェクチEインチE�E��E�クス値)
     *  @type object
     */
    const BTN_TIMECODE_OVERLAY_INDEX = 3;
    /**
     * JPEG1ボタンオブジェクチEインチE�E��E�クス値)
     *  @type object
     */
    const BTN_JPEG1_INDEX = 0;
    /**
     * JPEG2ボタンオブジェクチEインチE�E��E�クス値)
     *  @type object
     */
    const BTN_JPEG2_INDEX = 1;
    /**
     * JPEG3ボタンオブジェクチEインチE�E��E�クス値)
     *  @type object
     */
    var BTN_JPEG3_INDEX = 2;
    /**
     * H.264ボタンオブジェクチEインチE�E��E�クス値)
     *  @type object
     */
    const BTN_H_264_INDEX = 0;
    const BTN_H_264_1_INDEX = 1;
    const BTN_H_264_2_INDEX = 2;
    const BTN_H_264_3_INDEX = 3;
    // const BTN_H_264_4_INDEX = 4;

    /**
     * H.265ボタンオブジェクチEインチE�E��E�クス値)
     *  @type object
     */
    const BTN_H_265_1_INDEX = 0;
    const BTN_H_265_2_INDEX = 1;
    const BTN_H_265_INDEX = 2;
    /**
     * RTMPボタンオブジェクチEインチE�E��E�クス値)
     *  @type object
     */
    const BTN_RTMP_1_INDEX = 0;
    const BTN_RTMP_2_INDEX = 1;
    /**
     * NDIHXボタンオブジェクチEインチE�E��E�クス値)
     *  @type object
     */
    const BTN_NDI_HX_1_INDEX = 0;
    /**
     * SRTボタンオブジェクチEインチE�E��E�クス値)
     *  @type object
     */
    const BTN_SRT_1_INDEX = 0;
    const BTN_SRT_2_INDEX = 1;
    const BTN_NDI_2_INDEX = 2;
    /**
     * Video over IP main title
     */
    let txtVideoOverIPMainTitle;

    let selectInitialDisplaySettingStream;

    /**
     * VideoOverIP画面構築�E琁E
     */
    function buildVideoOverIP() {
        objVOIP = cparam_getVideoOverIpInfo();
        var ntpInfo = getNtpTime();
        getCurrentSettings();
        if (!buildFlag_videoOverIP) {
            buildFlag_videoOverIP = true;
            txtObject[TXT_VIDEO_OVER_IP] = TextCtrl('setup_videoOverIp_menu_title', 'setup_videoOverIP_menu_label', NPTZ_WORDING.wID_0083);
            for (var text in txtObject) {
                txtObject[text].show();
            }
            // Menu
            btnObject[BTN_SETTING_STATUS_INDEX] = MenuButtonCtrl('setup_videoOverIp_menu', "setup_videoOverIP_settingStatus_btn", NPTZ_WORDING.wID_0077, callbackChangeVideoOverIPMenu, 1, MenuButtonType.SINGLE);
            btnObject[BTN_STREAMING_MODE_INDEX] = MenuButtonCtrl('setup_videoOverIp_menu', "setup_videoOverIP_streamingMode_btn", NPTZ_WORDING.wID_0097, callbackChangeVideoOverIPMenu, 2, MenuButtonType.TOP);
            btnObject[BTN_INITIAL_DISPLAY_SETTING_INDEX] = MenuButtonCtrl('setup_videoOverIp_menu', "setup_videoOverIP_initialDisplaySetting_btn", NPTZ_WORDING.wID_0098, callbackChangeVideoOverIPMenu, 3, MenuButtonType.MIDDLE);

            btnObject[BTN_TIMECODE_OVERLAY_INDEX] = MenuButtonCtrl('setup_videoOverIp_menu', "setup_videoOverIP_timecode_overlay_btn", NPTZ_WORDING.wID_0724, callbackChangeVideoOverIPMenu, 21, MenuButtonType.BOTTOM);
            for (var i = 0; i < btnObject.length; i++) {
                if (btnObject[i]) {
                    btnObject[i].show();
                    btnObject[i].displayOff();
                }
            }
            if (ntpInfo.time_adjust != "0" || cparam_get_ref_signal() != "0") {
                btnObject[BTN_TIMECODE_OVERLAY_INDEX].show();
            } else {
                btnObject[BTN_TIMECODE_OVERLAY_INDEX].hide();
            }
            // JPEG
            txtJPEGObject = TextCtrl('setup_videoOverIp_menu', 'setup_videoOverIP_JPEG_menu_label', NPTZ_WORDING.wID_0084);
            txtJPEGObject.show();
            btnJPEGObject[BTN_JPEG1_INDEX] = MenuButtonCtrl('setup_videoOverIp_menu', "setup_videoOverIP_streamingMode_JPEG1_btn", NPTZ_WORDING.wID_0085, callbackChangeVideoOverIPMenu, 4, MenuButtonType.TOP);
            btnJPEGObject[BTN_JPEG2_INDEX] = MenuButtonCtrl('setup_videoOverIp_menu', "setup_videoOverIP_streamingMode_JPEG2_btn", NPTZ_WORDING.wID_0086, callbackChangeVideoOverIPMenu, 5, MenuButtonType.MIDDLE);
            btnJPEGObject[BTN_JPEG3_INDEX] = MenuButtonCtrl('setup_videoOverIp_menu', "setup_videoOverIP_streamingMode_JPEG3_btn", NPTZ_WORDING.wID_0087, callbackChangeVideoOverIPMenu, 6, MenuButtonType.BOTTOM);
            for (var i = 0; i < btnJPEGObject.length; i++) {
                btnJPEGObject[i].show();
                btnJPEGObject[i].displayOff();
            }

            // H.264
            txtH264Object = TextCtrl('setup_videoOverIp_menu', 'setup_videoOverIP_H_264_menu_label', NPTZ_WORDING.wID_0088);
            btnH264Object[BTN_H_264_INDEX] = MenuButtonCtrl('setup_videoOverIp_menu', "setup_videoOverIP_streamingMode_H_264_1_btn", NPTZ_WORDING.wID_0089, callbackChangeVideoOverIPMenu, 7, MenuButtonType.SINGLE);
            btnH264Object[BTN_H_264_1_INDEX] = MenuButtonCtrl('setup_videoOverIp_menu', "setup_videoOverIP_streamingMode_H_264_1_btn", NPTZ_WORDING.wID_0089, callbackChangeVideoOverIPMenu, 7, MenuButtonType.TOP);
            btnH264Object[BTN_H_264_2_INDEX] = MenuButtonCtrl('setup_videoOverIp_menu', "setup_videoOverIP_streamingMode_H_264_2_btn", NPTZ_WORDING.wID_0090, callbackChangeVideoOverIPMenu, 8, MenuButtonType.MIDDLE);
            btnH264Object[BTN_H_264_3_INDEX] = MenuButtonCtrl('setup_videoOverIp_menu', "setup_videoOverIP_streamingMode_H_264_3_btn", NPTZ_WORDING.wID_0091, callbackChangeVideoOverIPMenu, 9, MenuButtonType.MIDDLE);
            // btnH264Object[BTN_H_264_4_INDEX] = MenuButtonCtrl('setup_videoOverIp_menu', "setup_videoOverIP_streamingMode_H_264_4_btn", NPTZ_WORDING.wID_0092, callbackChangeVideoOverIPMenu, 10, MenuButtonType.BOTTOM);
            txtH264Object.show();
            btnH264Object[BTN_H_264_INDEX].show();
            btnH264Object[BTN_H_264_INDEX].displayOff();

            // H.265
            txtH265Object = TextCtrl('setup_videoOverIp_menu', 'setup_videoOverIP_H_265_menu_label', NPTZ_WORDING.wID_0093);
            btnH265Object[BTN_H_265_INDEX] = MenuButtonCtrl('setup_videoOverIp_menu', "setup_videoOverIP_streamingMode_H_265_1_btn", NPTZ_WORDING.wID_0094, callbackChangeVideoOverIPMenu, 11, MenuButtonType.TOP);
            btnH265Object[BTN_H_265_1_INDEX] = MenuButtonCtrl('setup_videoOverIp_menu', "setup_videoOverIP_streamingMode_H_265_1_btn", NPTZ_WORDING.wID_0094, callbackChangeVideoOverIPMenu, 19, MenuButtonType.SINGLE);
            btnH265Object[BTN_H_265_2_INDEX] = MenuButtonCtrl('setup_videoOverIp_menu', "setup_videoOverIP_streamingMode_H_265_2_btn", NPTZ_WORDING.wID_0512, callbackChangeVideoOverIPMenu, 15, MenuButtonType.BOTTOM);
            btnH265Object[BTN_H_265_INDEX].show();
            btnH265Object[BTN_H_265_INDEX].displayOff();
            // RTMP
            txtRTMPObject = TextCtrl('setup_videoOverIp_menu', 'setup_videoOverIP_RTMP_menu_label', NPTZ_WORDING.wID_0095);
            btnRTMPObject[BTN_RTMP_1_INDEX] = MenuButtonCtrl('setup_videoOverIp_menu', "setup_videoOverIP_streamingMode_RTMP_1_btn", NPTZ_WORDING.wID_0434, callbackChangeVideoOverIPMenu, 12, MenuButtonType.TOP);
            btnRTMPObject[BTN_RTMP_2_INDEX] = MenuButtonCtrl('setup_videoOverIp_menu', "setup_videoOverIP_streamingMode_RTMP_2_btn", NPTZ_WORDING.wID_0435, callbackChangeVideoOverIPMenu, 13, MenuButtonType.BOTTOM);

            // NDI|HX
            txtNDIHXObject = TextCtrl('setup_videoOverIp_menu', 'setup_videoOverIP_NDI_HX_menu_label', NPTZ_WORDING.wID_0096);
            btnNDIHXObject[BTN_NDI_HX_1_INDEX] = MenuButtonCtrl('setup_videoOverIp_menu', "setup_videoOverIP_streamingMode_NDI_HX_1_btn", NPTZ_WORDING.wID_0436, callbackChangeVideoOverIPMenu, 14, MenuButtonType.TOP);
            btnNDIHXObject[BTN_NDI_2_INDEX] = MenuButtonCtrl('setup_videoOverIp_menu', "setup_videoOverIP_streamingMode_srt_2_btn", NPTZ_WORDING.wID_0435, callbackChangeVideoOverIPMenu, 20, MenuButtonType.BOTTOM);

            //srt
            btnSRTObject[BTN_SRT_1_INDEX] = MenuButtonCtrl('setup_videoOverIp_menu', "setup_videoOverIP_streamingMode_srt_1_btn", NPTZ_WORDING.wID_0514, callbackChangeVideoOverIPMenu, 16, MenuButtonType.TOP);
            btnSRTObject[BTN_SRT_2_INDEX] = MenuButtonCtrl('setup_videoOverIp_menu', "setup_videoOverIP_streamingMode_srt_2_btn", NPTZ_WORDING.wID_0435, callbackChangeVideoOverIPMenu, 17, MenuButtonType.BOTTOM);

            //NDI
            txtNDIObject = TextCtrl('setup_videoOverIp_menu', 'setup_videoOverIP_NDI_menu_label', NPTZ_WORDING.wID_0525);
            btnNDIObject[BTN_NDI_INDEX] = MenuButtonCtrl('setup_videoOverIp_menu', "setup_videoOverIP_streamingMode_NDI_btn", NPTZ_WORDING.wID_0524, callbackChangeVideoOverIPMenu, 18, MenuButtonType.SINGLE);


            // main
            // main title
            txtVideoOverIPMainTitle = TextCtrl('setup_videoOverIp_main_title', 'setup_videoOverIp_main_title_label', NPTZ_WORDING.wID_0077);
            txtVideoOverIPMainTitle.show();

            // initial call
            initVideoOverIPMenuStatus(getStreamMode());

            // 画面変換
            $("#setup_videoOverIp_main").show();
            $("#setup_videoOverIp_menu").show();
            $("#setup_videoOverIp_main_title").show();
            $("#setup_videoOverIp_settingStatus_main").show();
            $("#setup_videoOverIp_streamingMode_main").hide();
            $("#setup_videoOverIp_InitialDisplaySetting_main").hide();
            $("#setup_videoOverIp_timecode_overlay_main").hide();
            btnObject[BTN_SETTING_STATUS_INDEX].displayOn();
            callbackChangeVideoOverIPMenu(Button.MOUSE_DOWN, 1);
        } else {
            rebuild();
            if (ntpInfo.time_adjust != "0" || cparam_get_ref_signal() != "0") {
                btnObject[BTN_TIMECODE_OVERLAY_INDEX].show();
                btnObject[BTN_TIMECODE_OVERLAY_INDEX].displayOff();
            } else {
                btnObject[BTN_TIMECODE_OVERLAY_INDEX].hide();
            }
        }
    }

    /**
     * 画面再構築�E琁E
     */
    function rebuild() {
        $("#setup_videoOverIp_main").show();
        $("#setup_videoOverIp_menu").show();
        $("#setup_videoOverIp_main_title").show();
        $("#setup_videoOverIp_settingStatus_main").show();
        $("#setup_videoOverIp_streamingMode_main").hide();
        $("#setup_videoOverIp_InitialDisplaySetting_main").hide();
        $("#setup_videoOverIp_timecode_overlay_main").hide();
        btnObject[BTN_SETTING_STATUS_INDEX].displayOn();
        callbackChangeVideoOverIPMenu(Button.MOUSE_DOWN, 1);
        getCurrentSettings();
        initVideoOverIPMenuStatus(getStreamMode());
    }
    function getNtpTime() {
        var url = "/cgi-bin/get_time";
        var ret = cparam_sendRequest(url);
        var result = {};
        if (ret) {
            ret = cparam_getRetArray(ret);
            for (var i = 0; i < ret.length; i++) {
                if (ret[i].indexOf("time_adjust=") == 0) {
                    result.time_adjust = ret[i].substring("time_adjust=".length);
                    continue;
                }
            }
        }
        return result;
    }

    function getH264FrameRate() {
        var obj = cparam_getVideoOverIpInfo();
        return obj;
    }

    /**
     *
     */
    function getMaxBitRateMaxToSet(h264BitRateOptions, h264_bandwidth) {
        var retValue;
        for (var key in h264BitRateOptions) {
            retValue = h264BitRateOptions[key];
            if (retValue == h264_bandwidth) {
                break;
            }
        }
        return retValue;
    }

    /**
     * SettingStatusボタン押下時の画面表示刁E�E��E�処琁E
     * @param mouse
     * @param type
     */
    var myScroll = null;
    var buildScrollSuccessFlg = true;
    function callbackChangeVideoOverIPMenu(mouse, type) {
        if (mouse == Button.MOUSE_DOWN) {

            if (myScroll != null && type != 7 && type != 8 && type != 9 && type != 10) {
                myScroll.destroy();
                myScroll = null;
            }

            $("#setup_videoOverIp_settingStatus_main").hide();
            $("#setup_videoOverIp_streamingMode_main").hide();
            $("#setup_videoOverIp_InitialDisplaySetting_main").hide();
            $("#setup_videoOverIp_timecode_overlay_main").hide();
            $("#setup_videoOverIp_jpeg_main").hide();
            $("#setup_videoOverIp_h264_main_outer").hide();
            $("#setup_videoOverIp_h264_u_main_outer").hide();
            $("#setup_videoOverIp_h265_main_outer").hide();
            $("#setup_videoOverIp_RTMP_serverSetup_main").hide();
            $("#setup_videoOverIp_RTMP_streamingFormat_main_outer").hide();
            $("#setup_videoOverIp_NDIHX_stream_main_outer").hide();
            $("#setup_videoOverIp_SRT_Common_setup_main,#setup_videoOverIp_TS_UDP_Common_setup_main,#setup_videoOverIp_NDI_main,#setup_videoOverIp_NDI2_streamingFormat_main_outer").hide();
            objVOIP = cparam_getVideoOverIpInfo();
            getCurrentSettings();
            switch (type) {
                case 1:
                    $("#setup_videoOverIp_settingStatus_main").show();
                    txtVideoOverIPMainTitle.set(NPTZ_WORDING.wID_0077);
                    settingStatus.build();
                    break;
                case 2:
                    $("#setup_videoOverIp_streamingMode_main").show();
                    txtVideoOverIPMainTitle.set(NPTZ_WORDING.wID_0097);
                    settingStreamingMode.build();
                    break;
                case 3:
                    $("#setup_videoOverIp_InitialDisplaySetting_main").show();
                    txtVideoOverIPMainTitle.set(NPTZ_WORDING.wID_0098);
                    settingInitialDisplaySetting.build();
                    break;
                case 4:
                    txtVideoOverIPMainTitle.set(NPTZ_WORDING.wID_0085);
                    settingJPEG.build(1);
                    $("#setup_videoOverIp_jpeg_main").show();
                    break;
                case 5:
                    txtVideoOverIPMainTitle.set(NPTZ_WORDING.wID_0086);
                    settingJPEG.build(2);
                    $("#setup_videoOverIp_jpeg_main").show();
                    break;
                case 6:
                    txtVideoOverIPMainTitle.set(NPTZ_WORDING.wID_0087);
                    settingJPEG.build(3);
                    $("#setup_videoOverIp_jpeg_main").show();
                    break;
                case 7:
                    txtVideoOverIPMainTitle.set(NPTZ_WORDING.wID_0089);
                    if (sysCommon.streamingMode == CONST_STREAM_MODE_H264_UHD) {
                        settingH264_u.build(1);
                        $("#setup_videoOverIp_h264_u_main_outer").show();
                    } else {
                        settingH264.build(1);
                        $("#setup_videoOverIp_h264_main_outer").show();
                    }
                    break;
                case 8:
                    txtVideoOverIPMainTitle.set(NPTZ_WORDING.wID_0090);
                    settingH264.build(2);
                    $("#setup_videoOverIp_h264_main_outer").show();
                    break;
                case 9:
                    txtVideoOverIPMainTitle.set(NPTZ_WORDING.wID_0091);
                    settingH264.build(3);
                    $("#setup_videoOverIp_h264_main_outer").show();
                    break;
                case 10:
                    txtVideoOverIPMainTitle.set(NPTZ_WORDING.wID_0092);
                    settingH264.build(4);
                    $("#setup_videoOverIp_h264_main_outer").show();
                    break;
                case 11:
                    txtVideoOverIPMainTitle.set(NPTZ_WORDING.wID_0094);
                    settingH265.build(1);
                    $("#setup_videoOverIp_h265_main_outer").show();
                    break;
                case 15:
                    txtVideoOverIPMainTitle.set(NPTZ_WORDING.wID_0512);
                    settingH265.build(2);
                    $("#setup_videoOverIp_h265_main_outer").show();
                    break;
                case 12:
                    txtVideoOverIPMainTitle.set('Server setup');
                    settingRTMPServerSetup.build(CONST_H264_CH1);
                    $("#setup_videoOverIp_RTMP_serverSetup_main").show();
                    break;
                case 13:
                    txtVideoOverIPMainTitle.set('Streaming format');
                    settingRTMPStreamingFormat.build(type);
                    $("#setup_videoOverIp_RTMP_streamingFormat_main_outer").show();
                    break;
                case 14:
                    txtVideoOverIPMainTitle.set('Common setup');
                    //settingNDIHX.build(CONST_H264_CH1);
                    settingNDIV2.build("NDI_2");
                    $("#setup_videoOverIp_NDIHX_stream_main_outer").show();
                    break;
                case 16:
                    txtVideoOverIPMainTitle.set('Common setup');
                    settingSrtOrTs.build();
                    if (sysCommon.streamingMode == CONST_STREAM_MODE_TS_UDP) {

                        $("#setup_videoOverIp_TS_UDP_Common_setup_main").show();
                    } else {

                        $("#setup_videoOverIp_SRT_Common_setup_main").show();
                    }
                    break;
                case 17:
                    txtVideoOverIPMainTitle.set('Streaming format');
                    settingRTMPStreamingFormat.build(type);
                    $("#setup_videoOverIp_RTMP_streamingFormat_main_outer").show();
                    break;
                case 18:
                    txtVideoOverIPMainTitle.set('High bandwidth NDI');
                    settingNDI.build();
                    $("#setup_videoOverIp_NDI_main").show();
                    break;
                case 19:
                    txtVideoOverIPMainTitle.set(NPTZ_WORDING.wID_0094);
                    settingH265.build(3);
                    $("#setup_videoOverIp_h265_main_outer").show();
                    break;
                case 20:
                    txtVideoOverIPMainTitle.set('Streaming format');
                    settingRTMPStreamingFormat.build("NDI_2");
                    $("#setup_videoOverIp_NDI2_streamingFormat_main_outer").show();
                    break;
                case 21:
                    $("#setup_videoOverIp_timecode_overlay_main").show();
                    txtVideoOverIPMainTitle.set(NPTZ_WORDING.wID_0724);
                    settingTimecodeOverlay.build();
                    break;
            }
            buildMyScroll();
        }
    }

    function destroyMyScroll() {
        if (myScroll != null) {
            myScroll.destroy();
            myScroll = null;
        }
    }
    function buildMyScroll() {
        if (buildScrollSuccessFlg) {
            buildScrollSuccessFlg = false;
            setTimeout(function () {
                myScroll = new IScroll('#setup_videoOverIp_h264_main_scroll', {
                    preventDefault: false,
                    click: false,
                    tap: true,
                    scrollbars: true,
                    mouseWheel: true,
                    interactiveScrollbars: true,
                    shrinkScrollbars: 'scale',
                    fadeScrollbars: false,
                    useTransform: false
                });
                buildScrollSuccessFlg = true;
            }, 500)
        }
    }

    /**
     * Video over IP Menu 状態制御
     */
    function initVideoOverIPMenuStatus(mode) {
        switch (mode) {
            case CONST_STREAM_MODE_H264_UHD:  //H.264(UHD)
                // JPEG
                for (let i = 1; i < btnJPEGObject.length; i++) {
                    btnJPEGObject[i].show();
                    if (!btnJPEGObject[i].getButtonObject().hasClass('on')) {
                        btnJPEGObject[i].displayOff();
                    }
                }
                // H.264
                txtH264Object.show();
                btnH264Object[BTN_H_264_INDEX].show();
                if (!btnH264Object[BTN_H_264_INDEX].getButtonObject().hasClass('on')) {
                    btnH264Object[BTN_H_264_INDEX].displayOff();
                }
                for (let i = 1; i < btnH264Object.length; i++) {
                    btnH264Object[i].hide();
                }
                // H.265
                txtH265Object.hide();
                btnH265Object[BTN_H_265_1_INDEX].hide();
                btnH265Object[BTN_H_265_2_INDEX].hide();
                btnH265Object[BTN_H_265_INDEX].hide();
                // RTMP
                txtRTMPObject.hide();
                btnRTMPObject[BTN_RTMP_1_INDEX].hide();
                btnRTMPObject[BTN_RTMP_2_INDEX].hide();
                // NDI|HX
                txtNDIHXObject.hide();
                btnNDIHXObject[BTN_NDI_HX_1_INDEX].hide();
                btnNDIHXObject[BTN_NDI_2_INDEX].hide();
                // SRT
                btnSRTObject[BTN_RTMP_1_INDEX].hide();
                btnSRTObject[BTN_RTMP_2_INDEX].hide();
                // NDI
                txtNDIObject.hide();
                btnNDIObject[BTN_NDI_INDEX].hide();
                break;
            case CONST_STREAM_MODE_H264: //H.264
                // JPEG
                for (var i = 1; i < btnJPEGObject.length; i++) {
                    btnJPEGObject[i].show();
                    if (!btnJPEGObject[i].getButtonObject().hasClass('on')) {
                        btnJPEGObject[i].displayOff();
                    }
                }
                // H.264
                txtH264Object.show();
                btnH264Object[BTN_H_264_INDEX].hide();
                for (var i = 1; i < btnH264Object.length; i++) {
                    btnH264Object[i].show();
                    if (!btnH264Object[i].getButtonObject().hasClass('on')) {
                        btnH264Object[i].displayOff();
                    }
                }
                // H.265
                txtH265Object.hide();
                btnH265Object[BTN_H_265_1_INDEX].hide();
                btnH265Object[BTN_H_265_2_INDEX].hide();
                btnH265Object[BTN_H_265_INDEX].hide();
                // RTMP
                txtRTMPObject.hide();
                btnRTMPObject[BTN_RTMP_1_INDEX].hide();
                btnRTMPObject[BTN_RTMP_2_INDEX].hide();
                // NDI|HX
                txtNDIHXObject.hide();
                btnNDIHXObject[BTN_NDI_HX_1_INDEX].hide();
                btnNDIHXObject[BTN_NDI_2_INDEX].hide();
                // SRT
                btnSRTObject[BTN_RTMP_1_INDEX].hide();
                btnSRTObject[BTN_RTMP_2_INDEX].hide();
                // NDI
                txtNDIObject.hide();
                btnNDIObject[BTN_NDI_INDEX].hide();
                changeH264MenuStatus();
                break;
            case CONST_STREAM_MODE_H265_UHD: //H.265(UHD)
                // JPEG
                for (var i = 1; i < btnJPEGObject.length; i++) {
                    btnJPEGObject[i].show();
                    if (!btnJPEGObject[i].getButtonObject().hasClass('on')) {
                        btnJPEGObject[i].displayOff();
                    }
                }
                // H.264
                txtH264Object.hide();
                for (var i = 0; i < btnH264Object.length; i++) {
                    btnH264Object[i].hide();
                }
                // H.265
                txtH265Object.show();
                btnH265Object[BTN_H_265_1_INDEX].show();
                btnH265Object[BTN_H_265_2_INDEX].hide();
                btnH265Object[BTN_H_265_INDEX].hide();
                if (!btnH265Object[BTN_H_265_1_INDEX].getButtonObject().hasClass('on')) {
                    btnH265Object[BTN_H_265_1_INDEX].displayOff();
                }
                // RTMP
                txtRTMPObject.hide();
                btnRTMPObject[BTN_RTMP_1_INDEX].hide();
                btnRTMPObject[BTN_RTMP_2_INDEX].hide();
                // NDI|HX
                txtNDIHXObject.hide();
                btnNDIHXObject[BTN_NDI_HX_1_INDEX].hide();
                btnNDIHXObject[BTN_NDI_2_INDEX].hide();
                // SRT
                btnSRTObject[BTN_RTMP_1_INDEX].hide();
                btnSRTObject[BTN_RTMP_2_INDEX].hide();
                // NDI
                txtNDIObject.hide();
                btnNDIObject[BTN_NDI_INDEX].hide();
                break;
            case CONST_STREAM_MODE_H265: //H.265
                // JPEG
                for (var i = 1; i < btnJPEGObject.length; i++) {
                    btnJPEGObject[i].show();
                    if (!btnJPEGObject[i].getButtonObject().hasClass('on')) {
                        btnJPEGObject[i].displayOff();
                    }
                }
                // H.264
                txtH264Object.hide();
                for (var i = 0; i < btnH264Object.length; i++) {
                    btnH264Object[i].hide();
                }
                // H.265
                txtH265Object.show();
                btnH265Object[BTN_H_265_1_INDEX].hide();
                btnH265Object[BTN_H_265_2_INDEX].show();
                btnH265Object[BTN_H_265_INDEX].show();
                if (!btnH265Object[BTN_H_265_INDEX].getButtonObject().hasClass('on')) {
                    btnH265Object[BTN_H_265_INDEX].displayOff();
                }
                if (!btnH265Object[BTN_H_265_2_INDEX].getButtonObject().hasClass('on')) {
                    btnH265Object[BTN_H_265_2_INDEX].displayOff();
                }
                // RTMP
                txtRTMPObject.hide();
                btnRTMPObject[BTN_RTMP_1_INDEX].hide();
                btnRTMPObject[BTN_RTMP_2_INDEX].hide();
                // NDI|HX
                txtNDIHXObject.hide();
                btnNDIHXObject[BTN_NDI_HX_1_INDEX].hide();
                btnNDIHXObject[BTN_NDI_2_INDEX].hide();
                // SRT
                btnSRTObject[BTN_RTMP_1_INDEX].hide();
                btnSRTObject[BTN_RTMP_2_INDEX].hide();
                // NDI
                txtNDIObject.hide();
                btnNDIObject[BTN_NDI_INDEX].hide();
                break;
            case CONST_STREAM_MODE_JPEG_UHD: //JPEG(UHD)
                // JPEG
                btnJPEGObject[BTN_JPEG1_INDEX].show();
                if (!btnJPEGObject[BTN_JPEG1_INDEX].getButtonObject().hasClass('on')) {
                    btnJPEGObject[BTN_JPEG1_INDEX].displayOff();
                }
                btnJPEGObject[BTN_JPEG2_INDEX].hide();
                btnJPEGObject[BTN_JPEG3_INDEX].hide();

                // H.264
                txtH264Object.show();
                btnH264Object[BTN_H_264_INDEX].hide();
                for (var i = 1; i < btnH264Object.length; i++) {
                    btnH264Object[i].show();
                    if (!btnH264Object[i].getButtonObject().hasClass('on')) {
                        btnH264Object[i].displayOff();
                    }
                }
                // H.265
                txtH265Object.hide();
                btnH265Object[BTN_H_265_1_INDEX].hide();
                btnH265Object[BTN_H_265_2_INDEX].hide();
                btnH265Object[BTN_H_265_INDEX].hide();
                // RTMP
                txtRTMPObject.hide();
                btnRTMPObject[BTN_RTMP_1_INDEX].hide();
                btnRTMPObject[BTN_RTMP_2_INDEX].hide();
                // NDI|HX
                txtNDIHXObject.hide();
                btnNDIHXObject[BTN_NDI_HX_1_INDEX].hide();
                btnNDIHXObject[BTN_NDI_2_INDEX].hide();
                // SRT
                btnSRTObject[BTN_RTMP_1_INDEX].hide();
                btnSRTObject[BTN_RTMP_2_INDEX].hide();
                // NDI
                txtNDIObject.hide();
                btnNDIObject[BTN_NDI_INDEX].hide();
                changeH264MenuStatus();
                break;
            case CONST_STREAM_MODE_RTMP_UHD: //RTMP_UHD
                // JPEG
                for (var i = 1; i < btnJPEGObject.length; i++) {
                    btnJPEGObject[i].show();
                    if (!btnJPEGObject[i].getButtonObject().hasClass('on')) {
                        btnJPEGObject[i].displayOff();
                    }
                }
                // H.264
                txtH264Object.hide();
                for (var i = 0; i < btnH264Object.length; i++) {
                    btnH264Object[i].hide();
                }
                btnH264Object[0].show();
                // H.265
                txtH265Object.hide();
                btnH265Object[BTN_H_265_1_INDEX].hide();
                btnH265Object[BTN_H_265_2_INDEX].hide();
                btnH265Object[BTN_H_265_INDEX].hide();
                // RTMP
                txtRTMPObject.show();
                txtRTMPObject.set(NPTZ_WORDING.wID_0513);
                btnRTMPObject[BTN_RTMP_1_INDEX].show();
                if (!btnRTMPObject[BTN_RTMP_1_INDEX].getButtonObject().hasClass('on')) {
                    btnRTMPObject[BTN_RTMP_1_INDEX].displayOff();
                }
                if (getRtmpStatus() == 1) {
                    btnRTMPObject[BTN_RTMP_1_INDEX].displayDisabled();
                } else if (getRtmpStatus() == 0) {
                    btnRTMPObject[BTN_RTMP_1_INDEX].displayOff();
                }
                btnRTMPObject[BTN_RTMP_2_INDEX].show();
                if (!btnRTMPObject[BTN_RTMP_2_INDEX].getButtonObject().hasClass('on')) {
                    btnRTMPObject[BTN_RTMP_2_INDEX].displayOff();
                }
                if (getRtmpStatus() == 1) {
                    btnRTMPObject[BTN_RTMP_2_INDEX].displayDisabled();
                } else if (getRtmpStatus() == 0) {
                    btnRTMPObject[BTN_RTMP_2_INDEX].displayOff();
                }
                // NDI|HX
                txtNDIHXObject.hide();
                btnNDIHXObject[BTN_NDI_HX_1_INDEX].hide();
                btnNDIHXObject[BTN_NDI_2_INDEX].hide();
                // SRT
                btnSRTObject[BTN_RTMP_1_INDEX].hide();
                btnSRTObject[BTN_RTMP_2_INDEX].hide();
                // NDI
                txtNDIObject.hide();
                btnNDIObject[BTN_NDI_INDEX].hide();
                if (getRtmpStatus() == 1) {
                    // for (var i = 0; i < btnJPEGObject.length; i++) {
                    //     btnJPEGObject[i].displayDisabled();
                    // }
                    btnRTMPObject[BTN_RTMP_1_INDEX].displayDisabled();
                    btnRTMPObject[BTN_RTMP_2_INDEX].displayDisabled();
                }
                break;
            case CONST_STREAM_MODE_RTMP: //RTMP
                // JPEG
                for (var i = 1; i < btnJPEGObject.length; i++) {
                    btnJPEGObject[i].show();
                    if (!btnJPEGObject[i].getButtonObject().hasClass('on')) {
                        btnJPEGObject[i].displayOff();
                    }
                }
                // H.264
                txtH264Object.hide();
                for (var i = 0; i < btnH264Object.length; i++) {
                    btnH264Object[i].hide();
                }
                btnH264Object[0].show();
                // H.265
                txtH265Object.hide();
                btnH265Object[BTN_H_265_1_INDEX].hide();
                btnH265Object[BTN_H_265_2_INDEX].hide();
                btnH265Object[BTN_H_265_INDEX].hide();
                // RTMP
                txtRTMPObject.show();
                txtRTMPObject.set(NPTZ_WORDING.wID_0095);
                btnRTMPObject[BTN_RTMP_1_INDEX].show();
                if (!btnRTMPObject[BTN_RTMP_1_INDEX].getButtonObject().hasClass('on')) {
                    btnRTMPObject[BTN_RTMP_1_INDEX].displayOff();
                }
                if (getRtmpStatus() == 1) {
                    btnRTMPObject[BTN_RTMP_1_INDEX].displayDisabled();
                } else if (getRtmpStatus() == 0) {
                    btnRTMPObject[BTN_RTMP_1_INDEX].displayOff();
                }
                btnRTMPObject[BTN_RTMP_2_INDEX].show();
                if (!btnRTMPObject[BTN_RTMP_2_INDEX].getButtonObject().hasClass('on')) {
                    btnRTMPObject[BTN_RTMP_2_INDEX].displayOff();
                }
                if (getRtmpStatus() == 1) {
                    btnRTMPObject[BTN_RTMP_2_INDEX].displayDisabled();
                } else if (getRtmpStatus() == 0) {
                    btnRTMPObject[BTN_RTMP_2_INDEX].displayOff();
                }
                // NDI|HX
                txtNDIHXObject.hide();
                btnNDIHXObject[BTN_NDI_HX_1_INDEX].hide();
                btnNDIHXObject[BTN_NDI_2_INDEX].hide();
                // SRT
                btnSRTObject[BTN_RTMP_1_INDEX].hide();
                btnSRTObject[BTN_RTMP_2_INDEX].hide();
                // NDI
                txtNDIObject.hide();
                btnNDIObject[BTN_NDI_INDEX].hide();
                if (getRtmpStatus() == 1) {
                    // for (var i = 0; i < btnJPEGObject.length; i++) {
                    //     btnJPEGObject[i].displayDisabled();
                    // }
                    btnRTMPObject[BTN_RTMP_1_INDEX].displayDisabled();
                    btnRTMPObject[BTN_RTMP_2_INDEX].displayDisabled();
                }
                break;
            case CONST_STREAM_MODE_NDI_HX: //NDI　|　HX
                // JPEG
                for (var i = 1; i < btnJPEGObject.length; i++) {
                    btnJPEGObject[i].hide();
                }
                btnJPEGObject[BTN_JPEG1_INDEX].show();
                if (!btnJPEGObject[BTN_JPEG1_INDEX].getButtonObject().hasClass('on')) {
                    btnJPEGObject[BTN_JPEG1_INDEX].displayOff();
                }
                // H.264
                txtH264Object.hide();
                for (var i = 0; i < btnH264Object.length; i++) {
                    btnH264Object[i].hide();
                }
                // H.265
                txtH265Object.hide();
                btnH265Object[BTN_H_265_1_INDEX].hide();
                btnH265Object[BTN_H_265_2_INDEX].hide();
                btnH265Object[BTN_H_265_INDEX].hide();
                // RTMP
                txtRTMPObject.hide();
                btnRTMPObject[BTN_RTMP_1_INDEX].hide();
                btnRTMPObject[BTN_RTMP_2_INDEX].hide();
                // NDI|HX
                txtNDIHXObject.show();
                btnNDIHXObject[BTN_NDI_HX_1_INDEX].show();
                btnNDIHXObject[BTN_NDI_2_INDEX].show();
                btnNDIHXObject[BTN_NDI_2_INDEX].displayOff();
                // SRT
                btnSRTObject[BTN_RTMP_1_INDEX].hide();
                btnSRTObject[BTN_RTMP_2_INDEX].hide();
                // NDI
                txtNDIObject.hide();
                btnNDIObject[BTN_NDI_INDEX].hide();
                if (!btnNDIHXObject[BTN_NDI_HX_1_INDEX].getButtonObject().hasClass('on')) {
                    btnNDIHXObject[BTN_NDI_HX_1_INDEX].displayOff();
                }
                break;
            case CONST_STREAM_MODE_NDI_UHD: //NDI　|　HX
                // JPEG
                for (var i = 1; i < btnJPEGObject.length; i++) {
                    btnJPEGObject[i].hide();
                }
                btnJPEGObject[BTN_JPEG1_INDEX].show();
                if (!btnJPEGObject[BTN_JPEG1_INDEX].getButtonObject().hasClass('on')) {
                    btnJPEGObject[BTN_JPEG1_INDEX].displayOff();
                }
                // H.264
                txtH264Object.hide();
                for (var i = 0; i < btnH264Object.length; i++) {
                    btnH264Object[i].hide();
                }
                // H.265
                txtH265Object.hide();
                btnH265Object[BTN_H_265_1_INDEX].hide();
                btnH265Object[BTN_H_265_2_INDEX].hide();
                btnH265Object[BTN_H_265_INDEX].hide();
                // RTMP
                txtRTMPObject.hide();
                btnRTMPObject[BTN_RTMP_1_INDEX].hide();
                btnRTMPObject[BTN_RTMP_2_INDEX].hide();
                // NDI|HX
                txtNDIHXObject.show();
                btnNDIHXObject[BTN_NDI_HX_1_INDEX].show();
                btnNDIHXObject[BTN_NDI_2_INDEX].show();
                btnNDIHXObject[BTN_NDI_2_INDEX].displayOff();
                // SRT
                btnSRTObject[BTN_RTMP_1_INDEX].hide();
                btnSRTObject[BTN_RTMP_2_INDEX].hide();
                // NDI
                txtNDIObject.hide();
                btnNDIObject[BTN_NDI_INDEX].hide();
                if (!btnNDIHXObject[BTN_NDI_HX_1_INDEX].getButtonObject().hasClass('on')) {
                    btnNDIHXObject[BTN_NDI_HX_1_INDEX].displayOff();
                }
                break;
            //SRT
            case CONST_STREAM_MODE_TS_UDP:
            case CONST_STREAM_MODE_SRT_H264:
            case CONST_STREAM_MODE_SRT_H264_UHD:
            case CONST_STREAM_MODE_SRT_H265:
            case CONST_STREAM_MODE_SRT_H265_UHD:
                // JPEG
                for (var i = 1; i < btnJPEGObject.length; i++) {
                    btnJPEGObject[i].show();
                    if (!btnJPEGObject[i].getButtonObject().hasClass('on')) {
                        btnJPEGObject[i].displayOff();
                    }
                }
                // H.264
                txtH264Object.hide();
                for (var i = 0; i < btnH264Object.length; i++) {
                    btnH264Object[i].hide();
                }
                btnH264Object[0].show();
                // H.265
                txtH265Object.hide();
                btnH265Object[BTN_H_265_1_INDEX].hide();
                btnH265Object[BTN_H_265_2_INDEX].hide();
                btnH265Object[BTN_H_265_INDEX].hide();
                //RTMP
                btnRTMPObject[BTN_RTMP_1_INDEX].hide();
                btnRTMPObject[BTN_RTMP_2_INDEX].hide();
                // SRT
                txtRTMPObject.show();
                if (mode == CONST_STREAM_MODE_TS_UDP) {
                    txtRTMPObject.set(NPTZ_WORDING.wID_0555);
                } else {
                    txtRTMPObject.set(NPTZ_WORDING.wID_0515);
                }

                btnSRTObject[BTN_SRT_1_INDEX].show();
                if (!btnSRTObject[BTN_SRT_1_INDEX].getButtonObject().hasClass('on')) {
                    btnSRTObject[BTN_SRT_1_INDEX].displayOff();
                }
                if (getTsUdpStatus() == 1) {
                    btnSRTObject[BTN_SRT_1_INDEX].displayDisabled();
                } else if (getTsUdpStatus() == 0) {
                    btnSRTObject[BTN_SRT_1_INDEX].displayOff();
                }
                btnSRTObject[BTN_SRT_2_INDEX].show();
                if (!btnSRTObject[BTN_SRT_2_INDEX].getButtonObject().hasClass('on')) {
                    btnSRTObject[BTN_SRT_2_INDEX].displayOff();
                }
                if (getTsUdpStatus() == 1) {
                    btnSRTObject[BTN_SRT_2_INDEX].displayDisabled();
                } else if (getTsUdpStatus() == 0) {
                    btnSRTObject[BTN_SRT_2_INDEX].displayOff();
                }
                // NDI|HX
                txtNDIHXObject.hide();
                btnNDIHXObject[BTN_NDI_HX_1_INDEX].hide();
                btnNDIHXObject[BTN_NDI_2_INDEX].hide();
                // NDI
                txtNDIObject.hide();
                btnNDIObject[BTN_NDI_INDEX].hide();
                // if (getRtmpStatus() == 1) {
                //     for (var i = 0; i < btnJPEGObject.length; i++) {
                //         btnJPEGObject[i].displayDisabled();
                //     }
                //     btnSRTObject[BTN_SRT_1_INDEX].displayDisabled();
                //     btnRTMPObject[BTN_RTMP_2_INDEX].displayDisabled();
                // }
                // if(mode == 'srt_h264' || mode == 'srt_h264_uhd' || mode == 'srt_h265' || mode == 'srt_h265_uhd'){
                //     if(sendSrtCmd('start') == 'OK'){
                //         if(getsrtStatus() == '1'){
                //             btnSRTObject[BTN_RTMP_1_INDEX].displayDisabled();
                //             btnSRTObject[BTN_RTMP_2_INDEX].displayDisabled();
                //         }else{
                //             btnSRTObject[BTN_RTMP_1_INDEX].displayOff();
                //             btnSRTObject[BTN_RTMP_2_INDEX].displayOff();
                //         }
                //     }else{
                //         btnSRTObject[BTN_RTMP_1_INDEX].displayOff();
                //         btnSRTObject[BTN_RTMP_2_INDEX].displayOff();
                //     }
                //
                // }else{
                //     btnSRTObject[BTN_RTMP_1_INDEX].displayOff();
                //     btnSRTObject[BTN_RTMP_2_INDEX].displayOff();
                // }
                break;
            case CONST_STREAM_MODE_NDI:
                // JPEG
                for (var i = 1; i < btnJPEGObject.length; i++) {
                    btnJPEGObject[i].hide();
                }
                btnJPEGObject[BTN_JPEG1_INDEX].show();
                if (!btnJPEGObject[BTN_JPEG1_INDEX].getButtonObject().hasClass('on')) {
                    btnJPEGObject[BTN_JPEG1_INDEX].displayOff();
                }
                // H.264
                txtH264Object.hide();
                for (var i = 0; i < btnH264Object.length; i++) {
                    btnH264Object[i].hide();
                }
                // H.265
                txtH265Object.hide();
                btnH265Object[BTN_H_265_1_INDEX].hide();
                btnH265Object[BTN_H_265_2_INDEX].hide();
                btnH265Object[BTN_H_265_INDEX].hide();
                // RTMP
                txtRTMPObject.hide();
                btnRTMPObject[BTN_RTMP_1_INDEX].hide();
                btnRTMPObject[BTN_RTMP_2_INDEX].hide();
                // NDI|HX
                txtNDIHXObject.hide();
                btnNDIHXObject[BTN_NDI_HX_1_INDEX].hide();
                btnNDIHXObject[BTN_NDI_2_INDEX].hide();
                // SRT
                btnSRTObject[BTN_RTMP_1_INDEX].hide();
                btnSRTObject[BTN_RTMP_2_INDEX].hide();
                // NDI
                txtNDIObject.show();
                btnNDIObject[BTN_NDI_INDEX].show();
                btnNDIObject[BTN_NDI_INDEX].displayOff();

                if (!btnNDIHXObject[BTN_NDI_HX_1_INDEX].getButtonObject().hasClass('on')) {
                    btnNDIHXObject[BTN_NDI_HX_1_INDEX].displayOff();
                }
                break;
        }
        // if(sysCommon.frequency == CONST_60Hz && mode != CONST_STREAM_MODE_NDI)
        // {
        //     // H.264
        //     txtH264Object.hide();
        //     for (var i = 0; i < btnH264Object.length; i++) {
        //         btnH264Object[i].hide();
        //     }
        //     // H.265
        //     txtH265Object.hide();
        //     btnH265Object[BTN_H_265_1_INDEX].hide();
        //     btnH265Object[BTN_H_265_2_INDEX].hide();
        //     btnH265Object[BTN_H_265_INDEX].hide();
        //     // RTMP
        //     txtRTMPObject.hide();
        //     btnRTMPObject[BTN_RTMP_1_INDEX].hide();
        //     btnRTMPObject[BTN_RTMP_2_INDEX].hide();
        //     // NDI|HX
        //     txtNDIHXObject.hide();
        //     btnNDIHXObject[BTN_NDI_HX_1_INDEX].hide();
        //     btnNDIHXObject[BTN_NDI_2_INDEX].hide();
        //     // SRT
        //     btnSRTObject[BTN_RTMP_1_INDEX].hide();
        //     btnSRTObject[BTN_RTMP_2_INDEX].hide();
        //     // NDI
        //     // txtNDIObject.hide();
        //     // btnNDIObject[BTN_NDI_INDEX].hide();
        // }
    }
    function sendSrtCmd(pCmd) {
        let retValue;
        $.ajax({
            type: "get",
            url: "/cgi-bin/srt_ctrl?cmd=" + pCmd,
            async: false,
            timeout: 100,
            success: function (data) {
                retValue = 'OK';

            },
            error: function (jqXHR, textStatus, errorThrown) {
                retValue = 'NG';
            }
        });
        return retValue;
    }
    function changeH264MenuStatus() {
        switch (whichMenuHide()) {
            case 0:
                btnH264Object[BTN_H_264_3_INDEX].show();
                // btnH264Object[BTN_H_264_4_INDEX].show();
                break;
            case 1:
                // btnH264Object[BTN_H_264_4_INDEX].hide();
                break;
            case 2:
                //btnH264Object[BTN_H_264_3_INDEX].hide();
                // btnH264Object[BTN_H_264_4_INDEX].hide();
                break;
        }
    }

    function whichMenuHide() {
        let retValue = 0;
        if (sysCommon.format == CONST_1080_23_98p_59_94i
            || sysCommon.format == CONST_2160_24p
            || sysCommon.format == CONST_1080_24p
            || sysCommon.format == CONST_2160_23_98p
            || sysCommon.format == CONST_1080_23_98p
            || sysCommon.format == CONST_1080_23_98psF) {
            retValue = 2;
        } else {
            let obj = getH264FrameRate();
            let frameRate1 = obj["h264_framerate_ch" + 1];
            let frameRate2 = obj["h264_framerate_ch" + 2];
            if ((frameRate1 == 60 && frameRate2 == 60) || (frameRate1 == 50 && frameRate2 == 50)) {
                retValue = 2;
            } else if (frameRate1 == 60 || frameRate2 == 60 || frameRate1 == 50 || frameRate2 == 50) {
                retValue = 1;
            } else {
                retValue = 0;
            }
        }
        return retValue;
    }

    function checkBitRateTotal(type, bitRate) {
        var totalBitRate = bitRate;
        if (objVOIP["jpeg_transmit1"] == 1 || type == 'JPEG1') {
            totalBitRate += sysConst.getTargetBitRate(objVOIP["resol_stream1"], objVOIP["jpeg_interval1"], objVOIP["jpeg_quality_ch1"]);
        }
        if (sysCommon.streamingMode != CONST_STREAM_MODE_NDI_HX && sysCommon.streamingMode != CONST_STREAM_MODE_JPEG_UHD) {
            if (objVOIP["jpeg_transmit2"] == 1 || type == 'JPEG2') {
                totalBitRate += sysConst.getTargetBitRate(objVOIP["resol_stream2"], objVOIP["jpeg_interval2"], objVOIP["jpeg_quality_ch2"]);
            }
            if (objVOIP["jpeg_transmit3"] == 1 || type == 'JPEG3') {
                totalBitRate += sysConst.getTargetBitRate(objVOIP["resol_stream3"], objVOIP["jpeg_interval3"], objVOIP["jpeg_quality_ch3"]);
            }
        }
        if (sysCommon.streamingMode != CONST_STREAM_MODE_H265_UHD) {
            if (objVOIP["h264_transmit_ch1"] == 1 || type == 'H264_1') {
                totalBitRate += objVOIP["h264_bandwidth_ch1"] / 1000;
            }
        }
        if (sysCommon.streamingMode != CONST_STREAM_MODE_NDI_HX
            && sysCommon.streamingMode != CONST_STREAM_MODE_H264_UHD
            && sysCommon.streamingMode != CONST_STREAM_MODE_H265_UHD) {
            if (objVOIP["h264_transmit_ch2"] == 1 || type == 'H264_2') {
                totalBitRate += objVOIP["h264_bandwidth_ch2"] / 1000;
            }
            if (objVOIP["h264_transmit_ch3"] == 1 || type == 'H264_3') {
                totalBitRate += objVOIP["h264_bandwidth_ch3"] / 1000;
            }
            if (objVOIP["h264_transmit_ch4"] == 1 || type == 'H264_4') {
                totalBitRate += objVOIP["h264_bandwidth_ch4"] / 1000;
            }
        }
        if (sysCommon.streamingMode == CONST_STREAM_MODE_NDI_HX) {
            totalBitRate += 1024 / 1000;
        }
        if (type != 'H265' && sysCommon.streamingMode == CONST_STREAM_MODE_H265_UHD) {
            if (objVOIP["h265_transmit_ch1"] == 1) {
                totalBitRate += objVOIP["h265_bandwidth_ch1"] / 1000;
            }
        }
        if (type == 'JPEG1') {
            totalBitRate -= sysConst.getTargetBitRate(objVOIP["resol_stream1"], objVOIP["jpeg_interval1"], objVOIP["jpeg_quality_ch1"]);
        }
        if (type == 'JPEG2') {
            totalBitRate -= sysConst.getTargetBitRate(objVOIP["resol_stream2"], objVOIP["jpeg_interval2"], objVOIP["jpeg_quality_ch2"]);
        }
        if (type == 'JPEG3') {
            totalBitRate -= sysConst.getTargetBitRate(objVOIP["resol_stream3"], objVOIP["jpeg_interval3"], objVOIP["jpeg_quality_ch3"]);
        }
        if (type == 'H264_1') {
            totalBitRate -= objVOIP["h264_bandwidth_ch1"] / 1000;
        }
        if (type == 'H264_2') {
            totalBitRate -= objVOIP["h264_bandwidth_ch2"] / 1000;
        }
        if (type == 'H264_3') {
            totalBitRate -= objVOIP["h264_bandwidth_ch3"] / 1000;
        }
        if (type == 'H264_4') {
            totalBitRate -= objVOIP["h264_bandwidth_ch4"] / 1000;
        }
        return totalBitRate > 250 ? false : true;
    }

    /**
     * settingStatus画面:settingStatus制御に関わる画面クラス
     * @class settingStatus画面:settingStatus制御に関わる画面クラス
     * @return {{build: buildJPEG, rebuild: rebuild}} build 構築�E琁E
     * @return {function} rebuild 再構築�E琁E
     * @constructor
     */
    function settingStatus() {
        /**
         * 構築フラグ
         * @type boolean
         */
        let buildFlag_Status = false;
        let txtStatusObject = [];
        let jpeg1;
        let jpeg2;
        let jpeg3;

        let h264_1;
        let h264_2;
        let h264_3;
        // let h264_4;
        let h264_2_1;
        let h264_2_2;
        let h264_2_3;
        // let h264_2_4;

        let h265;
        let h265_2;
        let STREAMING_MODE_TITLE = 0;
        let STREAMING_MODE_VALUE = 1;
        let INITIAL_DISPLAY_SETTING_TITLE = 2;
        let INITIAL_DISPLAY_SETTING_VALUE = 3;

        function buildStatus() {
            if (!buildFlag_Status) {
                buildFlag_Status = true;
                //title
                txtStatusObject[STREAMING_MODE_TITLE] = TextCtrl("setup_videoOverIp_settingStatus_form", 'setup_videoOverIp_settingStatus_streaming_mode_title', NPTZ_WORDING.wID_0097);
                txtStatusObject[STREAMING_MODE_VALUE] = TextCtrl("setup_videoOverIp_settingStatus_form", 'setup_videoOverIp_settingStatus_streaming_mode_value', CONST_STREAM_MODE_MAP[getStreamMode()]);

                txtStatusObject[INITIAL_DISPLAY_SETTING_TITLE] = TextCtrl("setup_videoOverIp_settingStatus_form", 'setup_videoOverIp_settingStatus_initial_display_setting_title', NPTZ_WORDING.wID_0098);
                txtStatusObject[INITIAL_DISPLAY_SETTING_VALUE] = TextCtrl("setup_videoOverIp_settingStatus_form", 'setup_videoOverIp_settingStatus_initial_display_setting_value', INITIAL_DISPLAY_NAME_MAP[objVOIP['sStream']]);

                jpeg1 = JpegStatusDisplayCtrl("setup_videoOverIp_settingStatus_jpeg1", NPTZ_WORDING.wID_0085);
                jpeg2 = JpegStatusDisplayCtrl("setup_videoOverIp_settingStatus_jpeg2", NPTZ_WORDING.wID_0086);
                jpeg3 = JpegStatusDisplayCtrl("setup_videoOverIp_settingStatus_jpeg3", NPTZ_WORDING.wID_0087);
                h264_1 = h264StatusDisplayCtrl("setup_videoOverIp_settingStatus_h264_1", NPTZ_WORDING.wID_0089);
                h264_2 = h264StatusDisplayCtrl("setup_videoOverIp_settingStatus_h264_2", NPTZ_WORDING.wID_0090);
                h264_3 = h264StatusDisplayCtrl("setup_videoOverIp_settingStatus_h264_3", NPTZ_WORDING.wID_0091);
                // h264_4 = h264StatusDisplayCtrl("setup_videoOverIp_settingStatus_h264_4", NPTZ_WORDING.wID_0092);

                h264_2_1 = h264StatusDisplayCtrl("setup_videoOverIp_settingStatus_h264_2_1", NPTZ_WORDING.wID_0089);
                h264_2_2 = h264StatusDisplayCtrl("setup_videoOverIp_settingStatus_h264_2_2", NPTZ_WORDING.wID_0090);
                h264_2_3 = h264StatusDisplayCtrl("setup_videoOverIp_settingStatus_h264_2_3", NPTZ_WORDING.wID_0091);
                // h264_2_4 = h264StatusDisplayCtrl("setup_videoOverIp_settingStatus_h264_2_4", NPTZ_WORDING.wID_0092);

                h265 = h265StatusDisplayCtrl("setup_videoOverIp_settingStatus_h265", NPTZ_WORDING.wID_0094);
                h265_2 = h265StatusDisplayCtrl("setup_videoOverIp_settingStatus_h265_2", NPTZ_WORDING.wID_0512);

                for (let text in txtStatusObject) {
                    txtStatusObject[text].show();
                }
                updateOtherStatus();
            } else {
                rebuild();
            }

        }

        function rebuild() {
            txtStatusObject[INITIAL_DISPLAY_SETTING_VALUE].set(INITIAL_DISPLAY_NAME_MAP[objVOIP['sStream']]);
            updateOtherStatus();
        }

        function updateOtherStatus() {
            let mode = getStreamMode();
            let transmit = objVOIP["h264_transmit_ch1"];

            txtStatusObject[STREAMING_MODE_VALUE].set(CONST_STREAM_MODE_MAP_STATUS[mode]);
            jpeg1.updateValues(objVOIP["jpeg_transmit1"], objVOIP["resol_stream1"], objVOIP["jpeg_interval1"], objVOIP["jpeg_quality_ch1"]);
            jpeg2.updateValues(objVOIP["jpeg_transmit2"], objVOIP["resol_stream2"], objVOIP["jpeg_interval2"], objVOIP["jpeg_quality_ch2"]);
            jpeg3.updateValues(objVOIP["jpeg_transmit3"], objVOIP["resol_stream3"], objVOIP["jpeg_interval3"], objVOIP["jpeg_quality_ch3"]);
            if (transmit < 0) {
                h264_1.updateValues(objVOIP["h265_transmit_ch1"], objVOIP["h265_resolution_ch1"], objVOIP["h265_f_priority_ch1"].toString(), objVOIP["h265_framerate_ch1"], objVOIP["h264_bandwidth_ch1"], objVOIP["h265_bandwidth_min_ch1"])
            } else {
                h264_1.updateValues(objVOIP["h264_transmit_ch1"], objVOIP["h264_resolution_ch1"], objVOIP["h264_f_priority_ch1"], objVOIP["h264_framerate_ch1"], objVOIP["h264_bandwidth_ch1"], objVOIP["h264_bandwidth_min_ch1"])
            };
            h264_2.updateValues(objVOIP["h264_transmit_ch2"], objVOIP["h264_resolution_ch2"], objVOIP["h264_f_priority_ch2"], objVOIP["h264_framerate_ch2"], objVOIP["h264_bandwidth_ch2"], objVOIP["h264_bandwidth_min_ch2"]);
            h264_3.updateValues(objVOIP["h264_transmit_ch3"], objVOIP["h264_resolution_ch3"], objVOIP["h264_f_priority_ch3"], objVOIP["h264_framerate_ch3"], objVOIP["h264_bandwidth_ch3"], objVOIP["h264_bandwidth_min_ch3"]);
            // h264_4.updateValues(objVOIP["h264_transmit_ch4"], objVOIP["h264_resolution_ch4"], objVOIP["h264_f_priority_ch4"], objVOIP["h264_framerate_ch4"], objVOIP["h264_bandwidth_ch4"], objVOIP["h264_bandwidth_min_ch4"]);
            h264_2_1.updateValues(objVOIP["h264_transmit_ch1"], objVOIP["h264_resolution_ch1"], objVOIP["h264_f_priority_ch1"], objVOIP["h264_framerate_ch1"], objVOIP["h264_bandwidth_ch1"], objVOIP["h264_bandwidth_min_ch1"]);
            h264_2_2.updateValues(objVOIP["h264_transmit_ch2"], objVOIP["h264_resolution_ch2"], objVOIP["h264_f_priority_ch2"], objVOIP["h264_framerate_ch2"], objVOIP["h264_bandwidth_ch2"], objVOIP["h264_bandwidth_min_ch2"]);
            h264_2_3.updateValues(objVOIP["h264_transmit_ch3"], objVOIP["h264_resolution_ch3"], objVOIP["h264_f_priority_ch3"], objVOIP["h264_framerate_ch3"], objVOIP["h264_bandwidth_ch3"], objVOIP["h264_bandwidth_min_ch3"]);
            // h264_2_4.updateValues(objVOIP["h264_transmit_ch4"], objVOIP["h264_resolution_ch4"], objVOIP["h264_f_priority_ch4"], objVOIP["h264_framerate_ch4"], objVOIP["h264_bandwidth_ch4"], objVOIP["h264_bandwidth_min_ch4"]);
            h265.updateValues(objVOIP["h265_transmit_ch1"], objVOIP["h265_resolution_ch1"], objVOIP["h265_framerate_ch1"], objVOIP["h265_bandwidth_ch1"], objVOIP["h265_bandwidth_min_ch1"]);
            h265_2.updateValues(objVOIP["h265_transmit_ch2"], objVOIP["h265_resolution_ch2"], objVOIP["h265_framerate_ch2"], objVOIP["h265_bandwidth_ch2"], objVOIP["h265_bandwidth_min_ch2"])
            if (sysCommon.frequency == CONST_60Hz && mode != CONST_STREAM_MODE_NDI) {
                switch (mode) {
                    case CONST_STREAM_MODE_H264:
                        jpeg1.show();
                        jpeg2.show();
                        jpeg3.show();
                        h264_1.show(); //#8448
                        h264_1.setName(NPTZ_WORDING.wID_0089);
                        h264_2.show(); //#8448
                        h264_3.show(); //#8448
                        h264_2_1.hide();
                        h264_2_2.hide();
                        h264_2_3.hide();
                        h265.hide();
                        h265_2.hide();
                        break;
                    case CONST_STREAM_MODE_RTMP:
                    case CONST_STREAM_MODE_RTMP_UHD:
                        jpeg1.show();
                        jpeg2.show();
                        jpeg3.show();
                        h264_1.hide();
                        h264_1.setName('Streaming format');
                        h264_2.hide();
                        h264_3.hide();
                        // h264_4.hide();
                        h264_2_1.hide();
                        h264_2_2.hide();
                        h264_2_3.hide();
                        // h264_2_4.hide();
                        h265.hide();
                        h265_2.hide();
                        break;
                    case CONST_STREAM_MODE_NDI_HX:
                    case CONST_STREAM_MODE_NDI_UHD:
                        jpeg1.show();
                        jpeg2.hide();
                        jpeg3.hide();
                        h264_1.hide();
                        h264_2.hide();
                        h264_3.hide();
                        // h264_4.hide();
                        h264_2_1.hide();
                        h264_2_1.setName('NDI|HX Stream');
                        h264_2_2.hide();
                        h264_2_3.hide();
                        // h264_2_4.hide();
                        h265.hide();
                        h265_2.hide();
                        break;
                    case CONST_STREAM_MODE_JPEG_UHD:
                        jpeg1.show();
                        jpeg2.hide();
                        jpeg3.hide();
                        h264_1.hide();
                        h264_2.hide();
                        h264_3.show();
                        // h264_4.hide();
                        h264_2_1.show();
                        h264_2_1.setName(NPTZ_WORDING.wID_0089);
                        switch (whichMenuHide()) {
                            case 0:
                                h264_2_3.show();
                                //h264_2_4.show();
                                break;
                            case 1:
                                h264_2_3.show();
                                // h264_2_4.hide();
                                break;
                            case 2:
                                h264_2_3.hide();
                                // h264_2_4.hide();
                                break;
                        }
                        h265.hide();
                        h265_2.hide();
                        break;
                    case CONST_STREAM_MODE_H265:
                        jpeg1.show();
                        jpeg2.show();
                        jpeg3.show();
                        h264_1.hide();
                        h264_2.hide();
                        h264_3.hide();
                        // h264_4.hide();
                        h264_2_1.hide();
                        h264_2_2.hide();
                        h264_2_3.hide();
                        // h264_2_4.hide();
                        h265.hide();
                        h265.setName(NPTZ_WORDING.wID_0094);
                        h265_2.hide();
                        break;
                    case CONST_STREAM_MODE_SRT_H265:
                    case CONST_STREAM_MODE_SRT_H265_UHD:
                        jpeg1.show();
                        jpeg2.show();
                        jpeg3.show();
                        h264_1.hide();
                        h264_2.hide();
                        h264_3.hide();
                        // h264_4.hide();
                        h264_2_1.hide();
                        h264_2_2.hide();
                        h264_2_3.hide();
                        // h264_2_4.hide();
                        h265.hide();
                        h265.setName('Streaming format');
                        h265_2.hide();
                        break;
                    case CONST_STREAM_MODE_TS_UDP:
                    case CONST_STREAM_MODE_SRT_H264:
                    case CONST_STREAM_MODE_SRT_H264_UHD:
                        jpeg1.show();
                        jpeg2.show();
                        jpeg3.show();
                        h264_1.hide();
                        h264_1.setName('Streaming format');
                        h264_2.hide();
                        h264_3.hide();
                        // h264_4.hide();
                        h264_2_1.hide();
                        h264_2_2.hide();
                        h264_2_3.hide();
                        // h264_2_4.hide();
                        h265.hide();
                        h265_2.hide();
                        break;
                    case CONST_STREAM_MODE_NDI:
                        jpeg1.show();
                        jpeg2.hide();
                        jpeg3.hide();
                        h264_1.hide();
                        h264_2.hide();
                        h264_3.hide();
                        // h264_4.hide();
                        h264_2_1.hide();
                        h264_2_2.hide();
                        h264_2_3.hide();
                        // h264_2_4.hide();
                        h265.hide();
                        h265_2.hide();
                        break;
                }
            } else {
                switch (mode) {
                    case CONST_STREAM_MODE_H264:
                        jpeg1.show();
                        jpeg2.show();
                        jpeg3.show();
                        h264_1.show();
                        h264_1.setName(NPTZ_WORDING.wID_0089);
                        h264_2.show();
                        h264_3.show();
                        switch (whichMenuHide()) {
                            case 0:
                                h264_3.show();
                                //h264_4.show();
                                break;
                            case 1:
                                h264_3.show();
                                // h264_4.hide();
                                break;
                            case 2:
                                // h264_3.hide();
                                // h264_4.hide();
                                break;
                        }
                        h264_2_1.hide();
                        h264_2_2.hide();
                        h264_2_3.hide();
                        // h264_2_4.hide();
                        h265.hide();
                        h265_2.hide();
                        break;
                    case CONST_STREAM_MODE_H264_UHD:
                        jpeg1.show();
                        jpeg2.show();
                        jpeg3.show();
                        h264_1.show();
                        h264_1.setName(NPTZ_WORDING.wID_0089);
                        h264_2.hide();
                        h264_3.hide();
                        // h264_4.hide();
                        h264_2_1.hide();
                        h264_2_2.hide();
                        h264_2_3.hide();
                        // h264_2_4.hide();
                        h265.hide();
                        h265_2.hide();
                        break;
                    case CONST_STREAM_MODE_H265_UHD:
                        jpeg1.show();
                        jpeg2.show();
                        jpeg3.show();
                        h264_1.hide();
                        h264_2.hide();
                        h264_3.hide();
                        // h264_4.hide();
                        h264_2_1.hide();
                        h264_2_2.hide();
                        h264_2_3.hide();
                        // h264_2_4.hide();
                        h265.show();
                        h265.setName(NPTZ_WORDING.wID_0094);
                        h265_2.hide();
                        break;
                    case CONST_STREAM_MODE_RTMP:
                    case CONST_STREAM_MODE_RTMP_UHD:
                        jpeg1.show();
                        jpeg2.show();
                        jpeg3.show();
                        h264_1.show();
                        h264_1.setName('Streaming format');
                        h264_2.hide();
                        h264_3.hide();
                        // h264_4.hide();
                        h264_2_1.hide();
                        h264_2_2.hide();
                        h264_2_3.hide();
                        // h264_2_4.hide();
                        h265.hide();
                        h265_2.hide();
                        break;
                    case CONST_STREAM_MODE_NDI_HX:
                    case CONST_STREAM_MODE_NDI_UHD:
                        jpeg1.show();
                        jpeg2.hide();
                        jpeg3.hide();
                        h264_1.hide();
                        h264_2.hide();
                        h264_3.hide();
                        // h264_4.hide();
                        h264_2_1.show();
                        h264_2_1.setName('NDI|HX Stream');
                        h264_2_2.hide();
                        h264_2_3.hide();
                        // h264_2_4.hide();
                        h265.hide();
                        h265_2.hide();
                        break;
                    case CONST_STREAM_MODE_JPEG_UHD:
                        jpeg1.show();
                        jpeg2.hide();
                        jpeg3.hide();
                        h264_1.hide();
                        h264_2.hide();
                        h264_3.hide();
                        // h264_4.hide();
                        h264_2_1.show();
                        h264_2_1.setName(NPTZ_WORDING.wID_0089);
                        h264_2_2.show();
                        switch (whichMenuHide()) {
                            case 0:
                                h264_2_3.show();
                                //h264_2_4.show();
                                break;
                            case 1:
                                h264_2_3.show();
                                // h264_2_4.hide();
                                break;
                            case 2:
                                h264_2_3.show();
                                // h264_2_4.hide();
                                break;
                        }
                        h265.hide();
                        h265_2.hide();
                        break;
                    case CONST_STREAM_MODE_H265:
                        jpeg1.show();
                        jpeg2.show();
                        jpeg3.show();
                        h264_1.hide();
                        h264_2.hide();
                        h264_3.hide();
                        // h264_4.hide();
                        h264_2_1.hide();
                        h264_2_2.hide();
                        h264_2_3.hide();
                        // h264_2_4.hide();
                        h265.show();
                        h265.setName(NPTZ_WORDING.wID_0094);
                        h265_2.show();
                        break;
                    case CONST_STREAM_MODE_SRT_H265:
                    case CONST_STREAM_MODE_SRT_H265_UHD:
                        jpeg1.show();
                        jpeg2.show();
                        jpeg3.show();
                        h264_1.hide();
                        h264_2.hide();
                        h264_3.hide();
                        // h264_4.hide();
                        h264_2_1.hide();
                        h264_2_2.hide();
                        h264_2_3.hide();
                        // h264_2_4.hide();
                        h265.show();
                        h265.setName('Streaming format');
                        h265_2.hide();
                        break;
                    case CONST_STREAM_MODE_TS_UDP:
                    case CONST_STREAM_MODE_SRT_H264:
                    case CONST_STREAM_MODE_SRT_H264_UHD:
                        jpeg1.show();
                        jpeg2.show();
                        jpeg3.show();
                        h264_1.show();
                        h264_1.setName('Streaming format');
                        h264_2.hide();
                        h264_3.hide();
                        // h264_4.hide();
                        h264_2_1.hide();
                        h264_2_2.hide();
                        h264_2_3.hide();
                        // h264_2_4.hide();
                        h265.hide();
                        h265_2.hide();
                        break;
                    case CONST_STREAM_MODE_NDI:
                        jpeg1.show();
                        jpeg2.hide();
                        jpeg3.hide();
                        h264_1.hide();
                        h264_2.hide();
                        h264_3.hide();
                        // h264_4.hide();
                        h264_2_1.hide();
                        h264_2_2.hide();
                        h264_2_3.hide();
                        // h264_2_4.hide();
                        h265.hide();
                        h265_2.hide();
                        break;
                }
            }
            // switch (mode) {
            //     case CONST_STREAM_MODE_H264:
            //         jpeg1.show();
            //         jpeg2.show();
            //         jpeg3.show();
            //         h264_1.show();
            //         h264_1.setName(NPTZ_WORDING.wID_0089);
            //         h264_2.show();
            //         switch (whichMenuHide()) {
            //             case 0:
            //                 h264_3.show();
            //                 //h264_4.show();
            //                 break;
            //             case 1:
            //                 h264_3.show();
            //                 // h264_4.hide();
            //                 break;
            //             case 2:
            //                 h264_3.hide();
            //                 // h264_4.hide();
            //                 break;
            //         }
            //         h264_2_1.hide();
            //         h264_2_2.hide();
            //         h264_2_3.hide();
            //         // h264_2_4.hide();
            //         h265.hide();
            //         h265_2.hide();
            //         break;
            //     case CONST_STREAM_MODE_H264_UHD :
            //         jpeg1.show();
            //         jpeg2.show();
            //         jpeg3.show();
            //         h264_1.show();
            //         h264_1.setName(NPTZ_WORDING.wID_0089);
            //         h264_2.hide();
            //         h264_3.hide();
            //         // h264_4.hide();
            //         h264_2_1.hide();
            //         h264_2_2.hide();
            //         h264_2_3.hide();
            //         // h264_2_4.hide();
            //         h265.hide();
            //         h265_2.hide();
            //         break;
            //     case CONST_STREAM_MODE_H265_UHD :
            //         jpeg1.show();
            //         jpeg2.show();
            //         jpeg3.show();
            //         h264_1.hide();
            //         h264_2.hide();
            //         h264_3.hide();
            //         // h264_4.hide();
            //         h264_2_1.hide();
            //         h264_2_2.hide();
            //         h264_2_3.hide();
            //         // h264_2_4.hide();
            //         h265.show();
            //         h265.setName(NPTZ_WORDING.wID_0094);
            //         h265_2.hide();
            //         break;
            //     case CONST_STREAM_MODE_RTMP :
            //     case CONST_STREAM_MODE_RTMP_UHD :
            //         jpeg1.show();
            //         jpeg2.show();
            //         jpeg3.show();
            //         h264_1.show();
            //         h264_1.setName('Streaming format');
            //         h264_2.hide();
            //         h264_3.hide();
            //         // h264_4.hide();
            //         h264_2_1.hide();
            //         h264_2_2.hide();
            //         h264_2_3.hide();
            //         // h264_2_4.hide();
            //         h265.hide();
            //         h265_2.hide();
            //         break;
            //     case CONST_STREAM_MODE_NDI_HX:
            //     case CONST_STREAM_MODE_NDI_UHD:
            //         jpeg1.show();
            //         jpeg2.hide();
            //         jpeg3.hide();
            //         h264_1.hide();
            //         h264_2.hide();
            //         h264_3.hide();
            //         // h264_4.hide();
            //         h264_2_1.show();
            //         h264_2_1.setName('NDI|HX Stream');
            //         h264_2_2.hide();
            //         h264_2_3.hide();
            //         // h264_2_4.hide();
            //         h265.hide();
            //         h265_2.hide();
            //         break;
            //     case CONST_STREAM_MODE_JPEG_UHD :
            //         jpeg1.show();
            //         jpeg2.hide();
            //         jpeg3.hide();
            //         h264_1.hide();
            //         h264_2.hide();
            //         h264_3.hide();
            //         // h264_4.hide();
            //         h264_2_1.show();
            //         h264_2_1.setName(NPTZ_WORDING.wID_0089);
            //         h264_2_2.show();
            //         switch (whichMenuHide()) {
            //             case 0:
            //                 h264_2_3.show();
            //                 //h264_2_4.show();
            //                 break;
            //             case 1:
            //                 h264_2_3.show();
            //                 // h264_2_4.hide();
            //                 break;
            //             case 2:
            //                 h264_2_3.hide();
            //                 // h264_2_4.hide();
            //                 break;
            //         }
            //         h265.hide();
            //         h265_2.hide();
            //         break;
            //     case CONST_STREAM_MODE_H265 :
            //         jpeg1.show();
            //         jpeg2.show();
            //         jpeg3.show();
            //         h264_1.hide();
            //         h264_2.hide();
            //         h264_3.hide();
            //         // h264_4.hide();
            //         h264_2_1.hide();
            //         h264_2_2.hide();
            //         h264_2_3.hide();
            //         // h264_2_4.hide();
            //         h265.show();
            //         h265.setName(NPTZ_WORDING.wID_0094);
            //         h265_2.show();
            //         break;
            //     case CONST_STREAM_MODE_SRT_H265 :
            //     case CONST_STREAM_MODE_SRT_H265_UHD :
            //         jpeg1.show();
            //         jpeg2.show();
            //         jpeg3.show();
            //         h264_1.hide();
            //         h264_2.hide();
            //         h264_3.hide();
            //         // h264_4.hide();
            //         h264_2_1.hide();
            //         h264_2_2.hide();
            //         h264_2_3.hide();
            //         // h264_2_4.hide();
            //         h265.show();
            //         h265.setName('Streaming format');
            //         h265_2.hide();
            //         break;
            //     case CONST_STREAM_MODE_TS_UDP :
            //     case CONST_STREAM_MODE_SRT_H264 :
            //     case CONST_STREAM_MODE_SRT_H264_UHD :
            //         jpeg1.show();
            //         jpeg2.show();
            //         jpeg3.show();
            //         h264_1.show();
            //         h264_1.setName('Streaming format');
            //         h264_2.hide();
            //         h264_3.hide();
            //         // h264_4.hide();
            //         h264_2_1.hide();
            //         h264_2_2.hide();
            //         h264_2_3.hide();
            //         // h264_2_4.hide();
            //         h265.hide();
            //         h265_2.hide();
            //         break;
            //     case CONST_STREAM_MODE_NDI :
            //         jpeg1.show();
            //         jpeg2.hide();
            //         jpeg3.hide();
            //         h264_1.hide();
            //         h264_2.hide();
            //         h264_3.hide();
            //         // h264_4.hide();
            //         h264_2_1.hide();
            //         h264_2_2.hide();
            //         h264_2_3.hide();
            //         // h264_2_4.hide();
            //         h265.hide();
            //         h265_2.hide();
            //         break;
            // }
        }

        function JpegStatusDisplayCtrl(div, name, pTransmissionValue, pImageCaptureSizeValue, pRefreshIntervalValue, pImageQuality) {
            let jpegName;
            let transmission;
            let imageCaptureSize;
            let refreshInterval;
            let imageQuality;
            let transmissionValue;
            let imageCaptureSizeValue;
            let refreshIntervalValue;
            let imageQualityValue;

            function initDisplay() {
                jpegName = TextCtrl(div, "setup_videoOverIp_settingStatus_jpeg_name", name);
                transmission = TextCtrl(div, "setup_videoOverIp_settingStatus_jpeg_transmission", NPTZ_WORDING.wID_0099);
                imageCaptureSize = TextCtrl(div, "setup_videoOverIp_settingStatus_jpeg_imageCaptureSize", NPTZ_WORDING.wID_0102);
                refreshInterval = TextCtrl(div, "setup_videoOverIp_settingStatus_jpeg_refreshInterval", NPTZ_WORDING.wID_0103);
                imageQuality = TextCtrl(div, "setup_videoOverIp_settingStatus_jpeg_imageQuality", NPTZ_WORDING.wID_0104);
                transmissionValue = TextCtrl(div, "setup_videoOverIp_settingStatus_jpeg_transmission" + "_value", getTransmissionName(pTransmissionValue));
                imageCaptureSizeValue = TextCtrl(div, "setup_videoOverIp_settingStatus_jpeg_imageCaptureSize" + "_value", getImageSizeName(pImageCaptureSizeValue));
                refreshIntervalValue = TextCtrl(div, "setup_videoOverIp_settingStatus_jpeg_refreshInterval" + "_value", pRefreshIntervalValue + "fps");
                imageQualityValue = TextCtrl(div, "setup_videoOverIp_settingStatus_jpeg_imageQuality" + "_value", getImageQualityName(pImageQuality));

                jpegName.show();
                transmission.show();
                imageCaptureSize.show();
                refreshInterval.show();
                imageQuality.show();
                transmissionValue.show();
                imageCaptureSizeValue.show();
                refreshIntervalValue.show();
                imageQualityValue.show();
            }

            initDisplay();

            return {
                show: function () {
                    $('#' + div).show()
                },
                hide: function () {
                    $('#' + div).hide();
                },
                updateValues: function (pTransmissionValue, pImageCaptureSizeValue, pRefreshIntervalValue, pImageQuality) {
                    transmissionValue.set(getTransmissionName(pTransmissionValue));
                    imageCaptureSizeValue.set(getImageSizeName(pImageCaptureSizeValue));
                    refreshIntervalValue.set(pRefreshIntervalValue + "fps");
                    imageQualityValue.set(getImageQualityName(pImageQuality));
                }
            };
        }

        function h264StatusDisplayCtrl(div, name, pTransmissionValue, pImageCaptureSizeValue, pTransmissionPriority, pFrameRate, pMaxBitRate, pMinBitRate) {
            var jpegName;
            var transmission;
            var imageCaptureSize;
            // var transmissionPriority;
            var frameRate;
            var maxBitRate;
            var transmissionValue;
            var imageCaptureSizeValue;
            // var transmissionPriorityValue;
            var frameRateValue;
            var maxBitRateValue;

            function initDisplay() {
                jpegName = TextCtrl(div, "setup_videoOverIp_settingStatus_h264_name", name);
                transmission = TextCtrl(div, "setup_videoOverIp_settingStatus_h264_transmission", NPTZ_WORDING.wID_0099);
                imageCaptureSize = TextCtrl(div, "setup_videoOverIp_settingStatus_h264_imageCaptureSize", NPTZ_WORDING.wID_0102);
                // transmissionPriority = TextCtrl(div, "setup_videoOverIp_settingStatus_h264_transmissionPriority", NPTZ_WORDING.wID_0100);
                frameRate = TextCtrl(div, "setup_videoOverIp_settingStatus_h264_frameRate", NPTZ_WORDING.wID_0105);
                maxBitRate = TextCtrl(div, "setup_videoOverIp_settingStatus_h264_maxBitRate", NPTZ_WORDING.wID_0106);
                transmissionValue = TextCtrl(div, "setup_videoOverIp_settingStatus_h264_transmission" + "_value", getTransmissionName(pTransmissionValue));
                imageCaptureSizeValue = TextCtrl(div, "setup_videoOverIp_settingStatus_h264_imageCaptureSize" + "_value", getImageSizeName(pImageCaptureSizeValue));
                transmissionPriorityValue = TextCtrl(div, "setup_videoOverIp_settingStatus_h264_transmissionPriority" + "_value", getPriorityName(pTransmissionPriority));
                frameRateValue = TextCtrl(div, "setup_videoOverIp_settingStatus_h264_frameRate" + "_value", pFrameRate + 'fps');
                // maxBitRateValue = TextCtrl(div, "setup_videoOverIp_settingStatus_h264_maxBitRate" + "_value", pMaxBitRate + '-' + pMinBitRate + 'kbps');
                maxBitRateValue = TextCtrl(div, "setup_videoOverIp_settingStatus_h264_maxBitRate" + "_value", pMaxBitRate + 'kbps');
                jpegName.show();
                transmission.show();
                imageCaptureSize.show();
                // transmissionPriority.show();
                frameRate.show();
                maxBitRate.show();
                transmissionValue.show();
                imageCaptureSizeValue.show();
                //transmissionPriorityValue.show();
                frameRateValue.show();
                maxBitRateValue.show();
            }

            initDisplay();

            return {
                show: function () {
                    $('#' + div).show()
                },
                hide: function () {
                    $('#' + div).hide();
                },
                updateValues: function (pTransmissionValue, pImageCaptureSizeValue, pTransmissionPriority, pFrameRate, pMaxBitRate, pMinBitRate) {
                    transmissionValue.set(getTransmissionName(pTransmissionValue));
                    imageCaptureSizeValue.set(getImageSizeName(pImageCaptureSizeValue));
                    transmissionPriorityValue.set(getPriorityName(pTransmissionPriority));
                    frameRateValue.set(pFrameRate + 'fps');
                    // maxBitRateValue.set(pMaxBitRate + '-' + pMinBitRate + 'kbps');
                    maxBitRateValue.set(pMaxBitRate + 'kbps');
                },
                setName: function (value) {
                    jpegName.set(value);
                }
            };
        }

        function h265StatusDisplayCtrl(div, name, pTransmissionValue, pImageCaptureSizeValue, pFrameRate, pMaxBitRate, pMinBitRate) {
            let jpegName;
            let transmission;
            let imageCaptureSize;
            let frameRate;
            let maxBitRate;
            let transmissionValue;
            let imageCaptureSizeValue;
            let frameRateValue;
            let maxBitRateValue;

            function initDisplay() {
                jpegName = TextCtrl(div, "setup_videoOverIp_settingStatus_h265_name", name);
                transmission = TextCtrl(div, "setup_videoOverIp_settingStatus_h265_transmission", NPTZ_WORDING.wID_0099);
                imageCaptureSize = TextCtrl(div, "setup_videoOverIp_settingStatus_h265_imageCaptureSize", NPTZ_WORDING.wID_0102);
                frameRate = TextCtrl(div, "setup_videoOverIp_settingStatus_h265_frameRate", NPTZ_WORDING.wID_0105);
                maxBitRate = TextCtrl(div, "setup_videoOverIp_settingStatus_h265_maxBitRate", NPTZ_WORDING.wID_0106);
                transmissionValue = TextCtrl(div, "setup_videoOverIp_settingStatus_h265_transmission" + "_value", getTransmissionName(pTransmissionValue));
                imageCaptureSizeValue = TextCtrl(div, "setup_videoOverIp_settingStatus_h265_imageCaptureSize" + "_value", getImageSizeName(pImageCaptureSizeValue));
                frameRateValue = TextCtrl(div, "setup_videoOverIp_settingStatus_h265_frameRate" + "_value", pFrameRate + 'fps');
                // maxBitRateValue = TextCtrl(div, "setup_videoOverIp_settingStatus_h265_maxBitRate" + "_value", pMaxBitRate + '-' + pMinBitRate + 'kbps');
                maxBitRateValue = TextCtrl(div, "setup_videoOverIp_settingStatus_h265_maxBitRate" + "_value", pMaxBitRate + 'kbps');

                jpegName.show();
                transmission.show();
                imageCaptureSize.show();
                frameRate.show();
                maxBitRate.show();
                transmissionValue.show();
                imageCaptureSizeValue.show();
                frameRateValue.show();
                maxBitRateValue.show();
            }

            initDisplay();

            return {
                show: function () {
                    $('#' + div).show()
                },
                hide: function () {
                    $('#' + div).hide();
                },
                setName: function (value) {
                    jpegName.set(value);
                },
                updateValues: function (pTransmissionValue, pImageCaptureSizeValue, pFrameRate, pMaxBitRate, pMinBitRate) {
                    transmissionValue.set(getTransmissionName(pTransmissionValue));
                    imageCaptureSizeValue.set(getImageSizeName(pImageCaptureSizeValue));
                    frameRateValue.set(pFrameRate + 'fps');
                    // maxBitRateValue.set(pMaxBitRate + '-' + pMinBitRate + 'kbps');
                    maxBitRateValue.set(pMaxBitRate + 'kbps');
                }
            };
        }

        function getTransmissionName(pValue) {
            var retName = "";
            switch (pValue) {
                case "0":
                    retName = "Off";
                    break;
                case "1":
                    retName = "On";
                    break;
            }
            return retName;
        }

        function getImageQualityName(pValue) {
            var retName = "";
            switch (pValue) {
                case CONST_JPEG_IMAGE_QUALITY_FINE:
                    retName = "Fine";
                    break;
                case CONST_JPEG_IMAGE_QUALITY_NORMAL:
                    retName = "Normal";
                    break;
            }
            return retName;
        }

        function getImageSizeName(pValue) {
            var retName = "";
            switch (pValue) {
                case CONST_IMAGE_SIZE_3840_2160:
                    retName = "3840x2160";
                    break;
                case CONST_IMAGE_SIZE_1920_1080:
                    retName = "1920x1080";
                    break;
                case CONST_IMAGE_SIZE_1280_720:
                    retName = "1280x720";
                    break;
                case CONST_IMAGE_SIZE_640_360:
                    retName = "640x360";
                    break;
                case CONST_IMAGE_SIZE_320_180:
                    retName = "320x180";
                    break;
            }
            return retName;
        }

        function getPriorityName(pValue) {
            var retName = "";
            switch (pValue) {
                case "0":
                    retName = "Constant bit rate";
                    break;
                case "1":
                    retName = NPTZ_WORDING.wID_0105;
                    break;
                case "2":
                    retName = "Best effort";
                    break;
            }
            return retName;
        }

        return {
            build: function () {
                return buildStatus();
            }
        }
    }

    /**
     * settingStreamingMode画面:settingStreamingMode制御に関わる画面クラス
     * @class settingStreamingMode画面:settingStreamingMode制御に関わる画面クラス
     * @return {{build: buildJPEG, rebuild: rebuild}} build 構築�E琁E
     * @return {function} rebuild 再構築�E琁E
     * @constructor
     */
    function settingStreamingMode() {
        /**
         * 構築フラグ
         * @type boolean
         */
        let buildFlag_StreamingMode = false;
        let txtStreamingModeTitle;
        let streamingMode_set_button;
        let modeRadioButtonGroup;
        let selectModeObject;
        let txtStreamingModeMsg;
        function buildStreamingMode() {
            if (!buildFlag_StreamingMode) {
                buildFlag_StreamingMode = true;
                // Streaming mode
                txtStreamingModeTitle = TextCtrl('setup_videoOverIp_streamingMode_label', 'setup_videoOverIP_streamingMode_mode_label', NPTZ_WORDING.wID_0227);
                txtStreamingModeTitle.show();
                txtStreamingModeMsg = TextCtrl('setup_videoOverIp_streamingMode_form', 'setup_videoOverIP_streamingMode_mode_msg', MSG_STATUS.mID_00103);
                txtStreamingModeMsg.show();
                // Streaming mode タイチE
                //modeRadioButtonGroup = RadioButtonGroupCtrl("setup_videoOverIp_streamingMode_form", "setup_videoOverIp_streamingMode_", RADIO_GROUP.rID_0026, getStreamMode(), callbackStreamingModeSelected);
                selectModeObject = SelectCtrl("setup_videoOverIp_streamingMode_form", "select_videoOverIp_streamingMode", "select_videoOverIp_streamingMode", "select_videoOverIp_streamingMode", "", "", CONST_STREAM_MODE_MAP, getStreamMode());
                selectModeObject.show();
                selectModeObject.displayOff();
                //---------------------------#8520----------------------------
                var SFPMode = cparam_get_SFPMode();
                var objSt2110Info = getSt2110Info();
                var st2110Status = getSt2110InfoResult(objSt2110Info);
                var st2110EnableState = st2110Status["enable"] == "1" ? true : false;

                if (st2110EnableState && SFPMode == 2) {
                    if (!isUHDFormat(sysCommon.format) || (getUhdCropStatus() != 0)) {
                        if (sysCommon.format == CONST_1080_24p || sysCommon.format == CONST_1080_23_98p || sysCommon.format == CONST_1080_23_98psF) {
                            selectModeObject.hideOptions([CONST_STREAM_MODE_NDI,CONST_STREAM_MODE_H264_UHD, CONST_STREAM_MODE_H265_UHD, CONST_STREAM_MODE_JPEG_UHD, CONST_STREAM_MODE_RTMP_UHD, CONST_STREAM_MODE_SRT_H264_UHD, CONST_STREAM_MODE_SRT_H265_UHD, CONST_STREAM_MODE_NDI_HX, CONST_STREAM_MODE_NDI_UHD], CONST_STREAM_MODE_MAP, getStreamMode());
                        } else {
                            if (sysCommon.format == CONST_1080_23_98p_59_94i) {
                                selectModeObject.hideOptions([CONST_STREAM_MODE_NDI,CONST_STREAM_MODE_H264_UHD, CONST_STREAM_MODE_H265_UHD, CONST_STREAM_MODE_JPEG_UHD, CONST_STREAM_MODE_RTMP_UHD, CONST_STREAM_MODE_SRT_H264_UHD, CONST_STREAM_MODE_SRT_H265_UHD, CONST_STREAM_MODE_NDI_UHD, CONST_STREAM_MODE_NDI_HX], CONST_STREAM_MODE_MAP, getStreamMode())
                            } else {
                                selectModeObject.hideOptions([CONST_STREAM_MODE_NDI,CONST_STREAM_MODE_H264_UHD, CONST_STREAM_MODE_H265_UHD, CONST_STREAM_MODE_JPEG_UHD, CONST_STREAM_MODE_RTMP_UHD, CONST_STREAM_MODE_SRT_H264_UHD, CONST_STREAM_MODE_SRT_H265_UHD, CONST_STREAM_MODE_NDI_UHD], CONST_STREAM_MODE_MAP, getStreamMode())
                            }
                        }
                    } else {
                        if (sysCommon.format == CONST_2160_24p || sysCommon.format == CONST_2160_23_98p) {
                            selectModeObject.hideOptions([CONST_STREAM_MODE_NDI,CONST_STREAM_MODE_NDI_HX, CONST_STREAM_MODE_NDI_UHD], CONST_STREAM_MODE_MAP, getStreamMode());
                        } else {
                            selectModeObject.refreshOptions(CONST_STREAM_MODE_MAP);
                        }

                    }
                } else {
                    if (!isUHDFormat(sysCommon.format) || (getUhdCropStatus() != 0)) {
                        if (sysCommon.format == CONST_1080_24p || sysCommon.format == CONST_1080_23_98p || sysCommon.format == CONST_1080_23_98psF) {
                            selectModeObject.hideOptions([CONST_STREAM_MODE_H264_UHD, CONST_STREAM_MODE_H265_UHD, CONST_STREAM_MODE_JPEG_UHD, CONST_STREAM_MODE_RTMP_UHD, CONST_STREAM_MODE_SRT_H264_UHD, CONST_STREAM_MODE_SRT_H265_UHD, CONST_STREAM_MODE_NDI_HX, CONST_STREAM_MODE_NDI_UHD], CONST_STREAM_MODE_MAP, getStreamMode());
                        } else {
                            if (sysCommon.format == CONST_1080_23_98p_59_94i) {
                                selectModeObject.hideOptions([CONST_STREAM_MODE_H264_UHD, CONST_STREAM_MODE_H265_UHD, CONST_STREAM_MODE_JPEG_UHD, CONST_STREAM_MODE_RTMP_UHD, CONST_STREAM_MODE_SRT_H264_UHD, CONST_STREAM_MODE_SRT_H265_UHD, CONST_STREAM_MODE_NDI_UHD, CONST_STREAM_MODE_NDI_HX], CONST_STREAM_MODE_MAP, getStreamMode())
                            } else {
                                selectModeObject.hideOptions([CONST_STREAM_MODE_H264_UHD, CONST_STREAM_MODE_H265_UHD, CONST_STREAM_MODE_JPEG_UHD, CONST_STREAM_MODE_RTMP_UHD, CONST_STREAM_MODE_SRT_H264_UHD, CONST_STREAM_MODE_SRT_H265_UHD, CONST_STREAM_MODE_NDI_UHD], CONST_STREAM_MODE_MAP, getStreamMode())
                            }

                        }

                    } else {
                        if (sysCommon.format == CONST_2160_24p || sysCommon.format == CONST_2160_23_98p) {
                            selectModeObject.hideOptions([CONST_STREAM_MODE_NDI_HX, CONST_STREAM_MODE_NDI_UHD], CONST_STREAM_MODE_MAP, getStreamMode());
                        } else {
                            selectModeObject.refreshOptions(CONST_STREAM_MODE_MAP);
                        }

                    }
                }
                //---------------------------#8520----------------------------------
                selectModeObject.val(sysCommon.streamingMode);
                //Line
                LineCtrl('setup_videoOverIp_streamingMode_main', 'horizontal', 150, 0, "", 'setup_videoOverIp_streamingMode', "97.5");
                streamingMode_set_button = ButtonCtrl("setup_videoOverIp_streamingMode_form", "setup_videoOverIp_streamingMode_set_button", NPTZ_WORDING.wID_0141, callbackStreamingModeSetButton);
                streamingMode_set_button.getButtonObject().addClass('button_class');
                streamingMode_set_button.show();
                streamingMode_set_button.displayOff();
                //selectModeObject.val(getStreamMode());
            } else {
                rebuild();
            }
        }

        function rebuild() {
            selectModeObject.val(sysCommon.streamingMode);
            //---------------------------#8520----------------------------
            var SFPMode = cparam_get_SFPMode();
            var objSt2110Info = getSt2110Info();
            var st2110Status = getSt2110InfoResult(objSt2110Info);
            var st2110EnableState = st2110Status["enable"] == "1" ? true : false;

            if (st2110EnableState && SFPMode == 2) {
                if (!isUHDFormat(sysCommon.format) || (getUhdCropStatus() != 0)) {
                    if (sysCommon.format == CONST_1080_24p || sysCommon.format == CONST_1080_23_98p || sysCommon.format == CONST_1080_23_98psF) {
                        selectModeObject.hideOptions([CONST_STREAM_MODE_NDI, CONST_STREAM_MODE_H264_UHD, CONST_STREAM_MODE_H265_UHD, CONST_STREAM_MODE_JPEG_UHD, CONST_STREAM_MODE_RTMP_UHD, CONST_STREAM_MODE_SRT_H264_UHD, CONST_STREAM_MODE_SRT_H265_UHD, CONST_STREAM_MODE_NDI_HX, CONST_STREAM_MODE_NDI_UHD], CONST_STREAM_MODE_MAP, getStreamMode());
                    } else {
                        if (sysCommon.format == CONST_1080_23_98p_59_94i) {
                            selectModeObject.hideOptions([CONST_STREAM_MODE_NDI, CONST_STREAM_MODE_H264_UHD, CONST_STREAM_MODE_H265_UHD, CONST_STREAM_MODE_JPEG_UHD, CONST_STREAM_MODE_RTMP_UHD, CONST_STREAM_MODE_SRT_H264_UHD, CONST_STREAM_MODE_SRT_H265_UHD, CONST_STREAM_MODE_NDI_UHD, CONST_STREAM_MODE_NDI_HX], CONST_STREAM_MODE_MAP, getStreamMode())
                        } else {
                            selectModeObject.hideOptions([CONST_STREAM_MODE_NDI, CONST_STREAM_MODE_H264_UHD, CONST_STREAM_MODE_H265_UHD, CONST_STREAM_MODE_JPEG_UHD, CONST_STREAM_MODE_RTMP_UHD, CONST_STREAM_MODE_SRT_H264_UHD, CONST_STREAM_MODE_SRT_H265_UHD, CONST_STREAM_MODE_NDI_UHD], CONST_STREAM_MODE_MAP, getStreamMode())
                        }
                    }
                } else {
                    if (sysCommon.format == CONST_2160_24p || sysCommon.format == CONST_2160_23_98p) {
                        selectModeObject.hideOptions([CONST_STREAM_MODE_NDI, CONST_STREAM_MODE_NDI_HX, CONST_STREAM_MODE_NDI_UHD], CONST_STREAM_MODE_MAP, getStreamMode());
                    } else {
                        selectModeObject.refreshOptions(CONST_STREAM_MODE_MAP);
                    }

                }
            } else {
                if (!isUHDFormat(sysCommon.format) || (getUhdCropStatus() != 0)) {
                    if (sysCommon.format == CONST_1080_24p || sysCommon.format == CONST_1080_23_98p || sysCommon.format == CONST_1080_23_98psF) {
                        selectModeObject.hideOptions([CONST_STREAM_MODE_H264_UHD, CONST_STREAM_MODE_H265_UHD, CONST_STREAM_MODE_JPEG_UHD, CONST_STREAM_MODE_RTMP_UHD, CONST_STREAM_MODE_SRT_H264_UHD, CONST_STREAM_MODE_SRT_H265_UHD, CONST_STREAM_MODE_NDI_HX, CONST_STREAM_MODE_NDI_UHD], CONST_STREAM_MODE_MAP, getStreamMode());
                    } else {
                        if (sysCommon.format == CONST_1080_23_98p_59_94i) {
                            selectModeObject.hideOptions([CONST_STREAM_MODE_H264_UHD, CONST_STREAM_MODE_H265_UHD, CONST_STREAM_MODE_JPEG_UHD, CONST_STREAM_MODE_RTMP_UHD, CONST_STREAM_MODE_SRT_H264_UHD, CONST_STREAM_MODE_SRT_H265_UHD, CONST_STREAM_MODE_NDI_UHD, CONST_STREAM_MODE_NDI_HX], CONST_STREAM_MODE_MAP, getStreamMode())
                        } else {
                            selectModeObject.hideOptions([CONST_STREAM_MODE_H264_UHD, CONST_STREAM_MODE_H265_UHD, CONST_STREAM_MODE_JPEG_UHD, CONST_STREAM_MODE_RTMP_UHD, CONST_STREAM_MODE_SRT_H264_UHD, CONST_STREAM_MODE_SRT_H265_UHD, CONST_STREAM_MODE_NDI_UHD], CONST_STREAM_MODE_MAP, getStreamMode())
                        }

                    }

                } else {
                    if (sysCommon.format == CONST_2160_24p || sysCommon.format == CONST_2160_23_98p) {
                        selectModeObject.hideOptions([CONST_STREAM_MODE_NDI_HX, CONST_STREAM_MODE_NDI_UHD], CONST_STREAM_MODE_MAP, getStreamMode());
                    } else {
                        selectModeObject.refreshOptions(CONST_STREAM_MODE_MAP);
                    }

                }
            }
            //---------------------------#8520----------------------------------
            selectModeObject.val(sysCommon.streamingMode);
        }

        function getUhdCropStatus() {
            return cparam_get_UHDCrop();
        }

        /**
         *
         * @param radioButtonValue
         */
        function callbackStreamingModeSelected(radioButtonValue) {
        }

        /**
         *
         * @param mouse
         */
        function callbackStreamingModeSetButton(mouse) {
            if (mouse == Button.MOUSE_DOWN) {
                if (selectModeObject.get() == CONST_STREAM_MODE_NDI_HX && is24fpsFormat(sysCommon.format)) {
                    jAlert(MSG_STATUS.mID_0051, NPTZ_WORDING.wID_0039);
                    return;
                }
                let rebootFlg = false;
                if ((sysCommon.streamingMode == CONST_STREAM_MODE_NDI_HX || selectModeObject.get() == CONST_STREAM_MODE_NDI_HX) && (sysCommon.streamingMode != selectModeObject.get())) {
                    rebootFlg = true;
                }
                setStreamMode(selectModeObject.get());
                sysCommon.streamingMode = selectModeObject.get();
                initVideoOverIPMenuStatus(selectModeObject.get());
                if (rebootFlg) {
                    setTimeout(checkIfSuccess, 3000)
                } else {
                    setTimeout(function () {
                        $("#dialog_setup").hide();
                    }, 500);
                }
            }
        }
        var intervResetId;
        function checkIfSuccess() {
            intervResetId = setInterval(function () {
                sendHeartBeat();
            },
                5000);
        }

        function sendHeartBeat() {
            var url = '/cgi-bin/aw_cam?cmd=QID&res=1';
            //var xhr = null;
            //xhr = myDOM.ajax.GetHttpRequest(url, DbgCallback2);
            $.get(url, function (data, status) {
                if (status == "success") {
                    clearInterval(intervResetId);
                    $("#dialog_setup").hide();
                    window.location.href = '/admin/index.html';
                }
            });
        }
        return {
            build: function () {
                return buildStreamingMode();
            }
        }
    }

    /**
     * settingInitialDisplaySetting画面:settingInitialDisplaySetting制御に関わる画面クラス
     * @class settingInitialDisplaySetting画面:settingInitialDisplaySetting制御に関わる画面クラス
     * @return {{build: buildJPEG, rebuild: rebuild}} build 構築�E琁E
     * @return {function} rebuild 再構築�E琁E
     * @constructor
     */
    function settingInitialDisplaySetting() {
        /**
         * 構築フラグ
         * @type boolean
         */
        var buildFlag_InitialDisplaySetting = false;
        var txtInitialDisplaySettingTitle;
        var initialDisplaySetting_set_button;

        function buildInitialDisplaySetting() {
            if (!buildFlag_InitialDisplaySetting) {
                buildFlag_InitialDisplaySetting = true;
                // Initial display setting
                txtInitialDisplaySettingTitle = TextCtrl('setup_videoOverIp_initialDisplaySetting_label', 'setup_videoOverIP_initialDisplaySetting_stream_label', NPTZ_WORDING.wID_0173);
                txtInitialDisplaySettingTitle.show();
                selectInitialDisplaySettingStream = SelectCtrl('setup_videoOverIp_initialDisplaySetting_form', "", "", "setup_videoOverIp_InitialDisplaySetting_stream_select", '', '', STREAM_MODE_OPTIONS, 3);
                selectInitialDisplaySettingStream.show();
                selectInitialDisplaySettingStream.displayOn();
                LineCtrl('setup_videoOverIp_InitialDisplaySetting_main', 'horizontal', 73, 0, "", 'setup_videoOverIp_InitialDisplaySetting_stream', "97.5");

                initialDisplaySetting_set_button = ButtonCtrl("setup_videoOverIp_initialDisplaySetting_form", "setup_videoOverIp_initialDisplaySetting_set_button", NPTZ_WORDING.wID_0141, callbackInitialDisplaySettingSetButton);
                initialDisplaySetting_set_button.getButtonObject().addClass('button_class');
                initialDisplaySetting_set_button.show();
                initialDisplaySetting_set_button.displayOff();
                refreshInitialDisplaySettingStreamItemsByMode();
                // refreshInitialDisplaySettingStreamItemsByFormat();  //#7015
                setInitialDisplaySetting();
            } else {
                rebuild();
            }
        }

        function rebuild() {
            refreshInitialDisplaySettingStreamItemsByMode();
            // refreshInitialDisplaySettingStreamItemsByFormat();     //#7015
            setInitialDisplaySetting();
        }

        function refreshInitialDisplaySettingStreamItemsByMode() {
            switch (sysCommon.streamingMode) {
                case CONST_STREAM_MODE_H264:
                    switch (whichMenuHide()) {
                        case 0:
                            selectInitialDisplaySettingStream.refreshOptions(STREAM_MODE_OPTIONS);
                            break;
                        case 1:
                            selectInitialDisplaySettingStream.refreshOptions(STREAM_MODE_OPTIONS_FORMAT_H264_4_hide);
                            break;
                        case 2:
                            selectInitialDisplaySettingStream.refreshOptions(STREAM_MODE_OPTIONS_FORMAT);
                            break;
                    }
                    if (sysCommon.frequency == CONST_60Hz) {
                        selectInitialDisplaySettingStream.refreshOptions(STREAM_MODE_OPTIONS_H264_60Hz);
                    }
                    break;
                case CONST_STREAM_MODE_H264_UHD:
                    selectInitialDisplaySettingStream.refreshOptions(STREAM_MODE_OPTIONS_H264_5_UHD_RTMP);
                    break;
                case CONST_STREAM_MODE_H265_UHD:
                    selectInitialDisplaySettingStream.refreshOptions(STREAM_MODE_OPTIONS_H264_5_UHD_RTMP);
                    break;
                case CONST_STREAM_MODE_RTMP:
                    selectInitialDisplaySettingStream.refreshOptions(STREAM_MODE_OPTIONS_H264_RTMP);
                    break;
                case CONST_STREAM_MODE_NDI_HX:
                case CONST_STREAM_MODE_NDI_UHD:
                    selectInitialDisplaySettingStream.refreshOptions(STREAM_MODE_OPTIONS_NDI_HX);
                    break;
                case CONST_STREAM_MODE_JPEG_UHD:
                    selectInitialDisplaySettingStream.refreshOptions(STREAM_MODE_OPTIONS_JPEG_UHD);
                    break;
                case CONST_STREAM_MODE_NDI:
                    selectInitialDisplaySettingStream.refreshOptions(STREAM_MODE_OPTIONS_NDI);
                    break;
                case CONST_STREAM_MODE_H265:
                    selectInitialDisplaySettingStream.refreshOptions(STREAM_MODE_OPTIONS_H264_5_RTMP);
                    break;
                case CONST_STREAM_MODE_RTMP_UHD:
                    selectInitialDisplaySettingStream.refreshOptions(STREAM_MODE_OPTIONS_H264_RTMP);
                    break;
                case CONST_STREAM_MODE_SRT_H264:
                    selectInitialDisplaySettingStream.refreshOptions(STREAM_MODE_OPTIONS_H264_RTMP);
                    break;
                case CONST_STREAM_MODE_SRT_H265:
                    selectInitialDisplaySettingStream.refreshOptions(STREAM_MODE_OPTIONS_H264_RTMP);
                    break;
                case CONST_STREAM_MODE_SRT_H264_UHD:
                    selectInitialDisplaySettingStream.refreshOptions(STREAM_MODE_OPTIONS_H264_RTMP);
                    break;
                case CONST_STREAM_MODE_SRT_H265_UHD:
                    selectInitialDisplaySettingStream.refreshOptions(STREAM_MODE_OPTIONS_H264_RTMP);
                    break;
                case CONST_STREAM_MODE_TS_UDP:
                default:
                    selectInitialDisplaySettingStream.refreshOptions(STREAM_MODE_OPTIONS_H264_RTMP);
            }
        }
        //#7015
        // function refreshInitialDisplaySettingStreamItemsByFormat() {
        //     if (sysCommon.frequency == CONST_24Hz
        //         || sysCommon.frequency == CONST_23_98Hz
        //         || sysCommon.format == CONST_1080_23_98p_59_94i) {
        //         selectInitialDisplaySettingStream.refreshOptions(STREAM_MODE_OPTIONS_FORMAT);
        //     }
        // }

        /**
         *
         * @param mouse
         */
        function callbackInitialDisplaySettingSetButton(mouse) {
            if (mouse == Button.MOUSE_DOWN) {
                $("#dialog_setup").show();
                $.ajax({
                    type: "post",
                    timeout: 20 * 1000,
                    url: "/cgi-bin/set_livestart",
                    data: getStreamModeSettingData(),
                    success: function (data) {
                        setTimeout(function () {
                            $("#dialog_setup").hide();
                        }, 500);
                    },
                    error: function (jqXHR, textStatus, errorThrown) {
                        setTimeout(function () {
                            $("#dialog_setup").hide();
                        }, 500);
                    }
                });
            }
        }

        function getStreamModeSettingData() {
            var data = {};
            data['stream'] = selectInitialDisplaySettingStream.get();
            return data;
        }

        function setInitialDisplaySetting() {
            selectInitialDisplaySettingStream.val(objVOIP['sStream']);
        }

        return {
            build: function () {
                return buildInitialDisplaySetting();
            }
        }
    }

    /**
     * settingTimecodeOverlay画面:settingTimecodeOverlay制御に関わる画面クラス
     * @class settingTimecodeOverlay画面:settingTimecodeOverlay制御に関わる画面クラス
     * @return {{build: buildTimecodeOverlay, rebuild: rebuild}} build 構築�E琁E
     * @return {function} rebuild 再構築�E琁E
     * @constructor
     */
    function settingTimecodOverlay() {
        /**
         * 構築フラグ
         * @type boolean
         */
        var buildFlag_TimecodeOverlay = false;
        var txtTimecodeOverlayTitle;
        var timecodeOverlayRadioButtonGroup;
        var initialDisplaySetting_set_button;
        var linkNtpButton;

        function buildTimecodeOverlay() {
            if (!buildFlag_TimecodeOverlay) {
                buildFlag_TimecodeOverlay = true;
                // Initial display setting
                txtTimecodeOverlayTitle = TextCtrl('setup_videoOverIP_timecode_overlay_label', 'setup_videoOverIP_timecode_overlay_label_title', NPTZ_WORDING.wID_0724);
                txtTimecodeOverlayTitle.show();
                // Timecode overlay radioButtonItems
                timecodeOverlayRadioButtonGroup = RadioButtonGroupCtrl("setup_videoOverIp_timecode_overlay_form", "setup_videoOverIp_timecode_overlay_", RADIO_GROUP.rID_0041, '', callbackTimecodeOverlay);
                LineCtrl('setup_videoOverIp_timecode_overlay_main', 'horizontal', 73, 0, "", 'setup_videoOverIp_timecode_overlay', "97.5");

                txtTimecodeNtp = TextCtrl('setup_videoOverIP_timecode_overlay_label', 'setup_timecode_ntp_label', NPTZ_WORDING.wID_0133);
                txtTimecodeNtp.show();
                linkNtpButton = ButtonCtrl("setup_videoOverIp_timecode_overlay_form", 'btn_timecode_link_ntp', NPTZ_WORDING.wID_0133 + " >>", callbackBasicDateNtp);
                linkNtpButton.show();
                linkNtpButton.displayOff();
                initialDisplaySetting_set_button = ButtonCtrl("setup_videoOverIp_timecode_overlay_form", "setup_videoOverIp_initialDisplaySetting_set_button", NPTZ_WORDING.wID_0141, callbackSetButton);
                initialDisplaySetting_set_button.getButtonObject().addClass('button_class');
                initialDisplaySetting_set_button.show();
                initialDisplaySetting_set_button.displayOff();
                LineCtrl('setup_videoOverIp_timecode_overlay_main', 'horizontal', 73, 0, "", 'setup_videoOverIp_timecode_set', "97.5");
                LineCtrl('setup_videoOverIp_timecode_overlay_main', 'horizontal', 73, 0, "", 'setup_videoOverIp_timecode_ntp', "97.5");
                setInitialDisplaySetting();
            } else {
                rebuild();
            }
        }
        function callbackBasicDateNtp(mouse) {
            if (mouse == Button.MOUSE_DOWN) {
                //show network
                $(".btn_basic").removeClass('on');
                $(".btn_basic").removeClass('disable');
                $(".btn_basic").removeClass('on_hover');
                $(".btn_basic").removeClass('off_hover');
                $(".btn_basic").addClass('off');
                $(".btn_network").removeClass('off');
                $(".btn_network").removeClass('disable');
                $(".btn_network").removeClass('on_hover');
                $(".btn_network").removeClass('off_hover');
                $(".btn_network").addClass('on');
                $(".btn_ntp").addClass('on');
                $("#setting_network").show();
                $("#setup_basic_div").hide();
                $("#setting_image").hide();
                $("#setting_mulit").hide();
                $("#setting_user_mng").hide();
                $("#setting_maintenance").hide();
                //show advanced
                $("#setup_network_main").hide();
                $("#setup_advanced_main").show();
                //show ftp
                $("#setting_network_advanced_rtsp").hide();
                $("#setting_network_advanced_ntp").show();
                $("#setting_network_advanced_upnp").hide();
                $("#setting_network_advanced_https").hide();
                $(".btn_rtsp").removeClass('on').addClass('off');
                $(".btn_upnp").removeClass('on').addClass('off');
                $(".btn_https").removeClass('on').addClass('off');
                $(".setting_network_middle_bg").removeClass('setting_network_middle_bg_https');

                setupMainMenu.callbackButtonControl(1, 20);
                settingNetworkAdvanced.callbackAdvancedMenuNtp(1);
            }
        }
        function rebuild() {
            setInitialDisplaySetting();
        }

        function callbackTimecodeOverlay() {

        }


        /**
         *
         * @param mouse
         */
        function callbackSetButton(mouse) {
            if (mouse == Button.MOUSE_DOWN) {
                $("#dialog_setup").show();
                $.ajax({
                    type: "get",
                    timeout: 20 * 1000,
                    url: "/cgi-bin/set_timecode_overlay",
                    data: getTimeCodeModeSettingData(),
                    success: function (data) {
                        setTimeout(function () {
                            $("#dialog_setup").hide();
                        }, 500);
                    },
                    error: function (jqXHR, textStatus, errorThrown) {
                        setTimeout(function () {
                            $("#dialog_setup").hide();
                        }, 500);
                    }
                });
            }
        }

        function getTimeCodeModeSettingData() {
            var data = {};
            data['mode'] = timecodeOverlayRadioButtonGroup.getSelectedValue();
            return data;
        }

        function setInitialDisplaySetting() {
            $.ajax({
                type: "get",
                timeout: 20 * 1000,
                url: "/cgi-bin/get_timecode_overlay",
                success: function (data) {
                    var ret = cparam_getRetArray(data)
                    if (ret[0].indexOf('mode=') == 0) {
                        var ret = cparam_getRetArray(data)
                        timecodeOverlayRadioButtonGroup.setSelectedValue(ret[0].substring(('mode=').length))
                    }
                },
                error: function (jqXHR, textStatus, errorThrown) {

                }
            });
        }

        return {
            build: function () {
                return buildTimecodeOverlay();
            }
        }
    }
    /**
     * settingJPEG画面:settingJPEG制御に関わる画面クラス
     * @class settingJPEG画面:settingJPEG制御に関わる画面クラス
     * @return {{build: buildJPEG, rebuild: rebuild}} build 構築�E琁E
     * @return {function} rebuild 再構築�E琁E
     * @constructor
     */
    function settingJPEG() {
        /**
         * 構築フラグ
         * @type boolean
         */
        var buildFlag_JPEG = false;
        /**
         * JPEG1,JPEG2,JPEG3を記録する
         */
        var currentType = 1;
        /**
         * label定義
         * @type number
         */
        var TXT_VIDEO_OVER_IP_JPEG_TRANSMISSION = 0;
        /**
         * label定義
         * @type number
         */
        var TXT_VIDEO_OVER_IP_JPEG_IMAGE_CAPTURE_SIZE = 1;
        /**
         * label定義
         * @type number
         */
        var TXT_VIDEO_OVER_IP_JPEG_REFRESH_INTERVAL = 2;
        /**
         * label定義
         * @type number
         */
        var TXT_VIDEO_OVER_IP_JPEG_IMAGE_QUALITY = 3;

        var selectJpegImageCaptureSize;
        var selectJpegRefreshInterval;
        var txtJPEGObject = [];
        var transmissionRadioButtonGroup;
        var imageQualityRadioButtonGroup;
        var jpeg_set_button;
        var jpeg_transmit;
        var resol_stream;
        var jpeg_interval;
        var jpeg_quality_ch;

        function getCurrentValueOfJPEG(type) {
            if (type) {
                jpeg_transmit = objVOIP["jpeg_transmit" + type];
                resol_stream = objVOIP["resol_stream" + type];
                jpeg_interval = objVOIP["jpeg_interval" + type];
                jpeg_quality_ch = objVOIP["jpeg_quality_ch" + type];
            }
        }

        /**
         *
         * @param type
         * @returns {{}}
         */
        function buildJPEG(type) {
            currentType = type;
            getCurrentValueOfJPEG(type);
            if (!buildFlag_JPEG) {
                buildFlag_JPEG = true;
                // JPEG transmission
                txtJPEGObject[TXT_VIDEO_OVER_IP_JPEG_TRANSMISSION] = TextCtrl('setup_videoOverIp_jpeg_label', 'setup_videoOverIp_jpeg_transmission_label', NPTZ_WORDING.wID_0234);
                // JPEG transmission radioButtonItems
                transmissionRadioButtonGroup = RadioButtonGroupCtrl("setup_videoOverIp_jpeg_form", "setup_videoOverIp_jpeg_transmission_", RADIO_GROUP.rID_0001, jpeg_transmit, callbackJpegTransmission);
                LineCtrl('setup_videoOverIp_jpeg_main', 'horizontal', 73, 0, "", 'setup_videoOverIp_jpeg_transmission', "97.5");

                // image capture size
                txtJPEGObject[TXT_VIDEO_OVER_IP_JPEG_IMAGE_CAPTURE_SIZE] = TextCtrl('setup_videoOverIp_jpeg_label', 'setup_videoOverIp_jpeg_imageCaptureSize_label', NPTZ_WORDING.wID_0102);
                selectJpegImageCaptureSize = SelectCtrl('setup_videoOverIp_jpeg_form', "", "setup_videoOverIp_jpeg_imageCaptureSize_select", "setup_videoOverIp_jpeg_imageCaptureSize_select", '', '', sysConst.getJpegImageCaptureSizeItems(type), resol_stream);
                selectJpegImageCaptureSize.show();
                selectJpegImageCaptureSize.displayOn();
                LineCtrl('setup_videoOverIp_jpeg_main', 'horizontal', 141, 0, "", 'setup_videoOverIp_jpeg_imageCaptureSize_select', "97.5");

                // refresh interval
                txtJPEGObject[TXT_VIDEO_OVER_IP_JPEG_REFRESH_INTERVAL] = TextCtrl('setup_videoOverIp_jpeg_label', 'setup_videoOverIp_jpeg_refreshInterval_label', NPTZ_WORDING.wID_0103);
                selectJpegRefreshInterval = SelectCtrl('setup_videoOverIp_jpeg_form', "", "setup_videoOverIp_jpeg_refreshInterval_select", "setup_videoOverIp_jpeg_refreshInterval_select", '', '', sysConst.getJpegFrameRateItems(), jpeg_interval);
                selectJpegRefreshInterval.show();
                selectJpegRefreshInterval.displayOn();
                LineCtrl('setup_videoOverIp_jpeg_main', 'horizontal', 209, 0, "", 'setup_videoOverIp_jpeg_refreshInterval_select', "97.5");

                // Image quality
                txtJPEGObject[TXT_VIDEO_OVER_IP_JPEG_IMAGE_QUALITY] = TextCtrl('setup_videoOverIp_jpeg_label', 'setup_videoOverIp_jpeg_imageQuality_label', NPTZ_WORDING.wID_0104);
                // JPEG transmission radioButtonItems
                imageQualityRadioButtonGroup = RadioButtonGroupCtrl("setup_videoOverIp_jpeg_form", "setup_videoOverIp_jpeg_imageQuality_", RADIO_GROUP.rID_0009, jpeg_quality_ch, callbackJpegImageQuality);
                LineCtrl('setup_videoOverIp_jpeg_main', 'horizontal', 277, 0, "", 'setup_videoOverIp_jpeg_imageQuality', "97.5");

                jpeg_set_button = ButtonCtrl("setup_videoOverIp_jpeg_form", "setup_videoOverIp_jpeg_set_button", NPTZ_WORDING.wID_0141, callbackJpegSetButton);
                jpeg_set_button.getButtonObject().addClass('button_class');
                jpeg_set_button.show();
                jpeg_set_button.displayOff();
                for (var text in txtJPEGObject) {
                    txtJPEGObject[text].show();
                }
                changeItemStatus();
                callbackJpegTransmission();
            } else {
                rebuild(type);
            }
        }

        function rebuild(type) {
            transmissionRadioButtonGroup.setSelectedValue(jpeg_transmit);
            // refresh items
            selectJpegImageCaptureSize.refreshOptions(sysConst.getJpegImageCaptureSizeItems(type));
            selectJpegImageCaptureSize.val(resol_stream);
            // refresh items
            selectJpegRefreshInterval.refreshOptions(sysConst.getJpegFrameRateItems());
            selectJpegRefreshInterval.val(jpeg_interval);
            imageQualityRadioButtonGroup.setSelectedValue(jpeg_quality_ch);
            changeItemStatus();
            callbackJpegTransmission();
        }

        function changeItemStatus() {
            switch (sysCommon.streamingMode) {
                case CONST_STREAM_MODE_H264:
                    break;
                case CONST_STREAM_MODE_H264_UHD:
                    break;
                case CONST_STREAM_MODE_H265_UHD:
                    break;
                case CONST_STREAM_MODE_RTMP:
                    break;
                case CONST_STREAM_MODE_NDI_HX:
                    break;
                case CONST_STREAM_MODE_JPEG_UHD:
                    break;
            }
        }

        /**
         *
         */
        function callbackJpegTransmission() {
            if (transmissionRadioButtonGroup.getSelectedValue() == 1) {
                selectJpegImageCaptureSize.displayOff();
                selectJpegRefreshInterval.displayOff();
                imageQualityRadioButtonGroup.displayOff();
            } else {
                selectJpegImageCaptureSize.displayDisabled();
                selectJpegRefreshInterval.displayDisabled();
                imageQualityRadioButtonGroup.displayDisabled();
            }
        }

        /**
         *
         */
        function callbackJpegImageQuality() {

        }

        /**
         * set button click
         */
        function callbackJpegSetButton(mouse) {
            if (mouse == Button.MOUSE_DOWN) {
                if (!checkBitRateTotal('JPEG' + currentType, sysConst.getTargetBitRate(selectJpegImageCaptureSize.get()
                    , selectJpegRefreshInterval.get(), imageQualityRadioButtonGroup.getSelectedValue()))) {
                    jAlert(MSG_STATUS.mID_0075, NPTZ_WORDING.wID_0039);
                    rebuild(currentType);
                    return;
                }
                $("#dialog_setup").show();
                $.ajax({
                    type: "post",
                    url: "/cgi-bin/set_jpeg",
                    data: getJPEGSettingData(currentType),
                    success: function (data) {
                        setTimeout(function () {
                            $("#dialog_setup").hide();
                        }, 500);
                    },
                    error: function (jqXHR, textStatus, errorThrown) {
                        setTimeout(function () {
                            $("#dialog_setup").hide();
                        }, 500);
                    }
                });
            }
        }

        function getJPEGSettingData(type) {
            var data = {};
            if (!transmissionRadioButtonGroup.isDisabled()) {
                data['jpeg_transmit' + type] = transmissionRadioButtonGroup.getSelectedValue();
            }
            if (selectJpegImageCaptureSize.getStatus() != Select.STATUS_DISABLED) {
                data['resol_stream' + type] = selectJpegImageCaptureSize.get();
            }
            if (selectJpegRefreshInterval.getStatus() != Select.STATUS_DISABLED) {
                data['jpeg_interval' + type] = selectJpegRefreshInterval.get();
            }
            if (!imageQualityRadioButtonGroup.isDisabled()) {
                if (type == 1) {
                    data['jpeg_quality'] = imageQualityRadioButtonGroup.getSelectedValue();
                } else {
                    data['jpeg_quality_ch' + type] = imageQualityRadioButtonGroup.getSelectedValue();
                }
            }
            return data;
        }

        return {
            build: function (type) {
                return buildJPEG(type);
            }
        }
    }

    /**
     * settingH264画面:settingJPEG制御に関わる画面クラス
     * @class settingH264画面:settingJPEG制御に関わる画面クラス
     * @return {{build: buildH264, rebuild: rebuild}} build 構築�E琁E
     * @return {function} rebuild 再構築�E琁E
     * @constructor
     */
    function settingH264() {
        /**
         * 構築フラグ
         * @type boolean
         */
        var buildFlag_H264 = false;
        /**
         * H264_1,H264_2,H264_3,H264_4を記録する
         */
        var currentType = 1;
        /**
         * label定義
         * @type number
         */
        var TXT_VIDEO_OVER_IP_H264_TRANSMISSION = 0;
        var TXT_VIDEO_OVER_IP_H264_INTERNET_MODE = 1;
        var TXT_VIDEO_OVER_IP_H264_IMAGE_CAPTURE_SIZE = 2;
        var TXT_VIDEO_OVER_IP_H264_TRANSMISSION_PRIORITY = 3;
        var TXT_VIDEO_OVER_IP_H264_FRAME_RATE = 4;
        var TXT_VIDEO_OVER_IP_H264_MAX_BIT_RATE = 5;
        var TXT_VIDEO_OVER_IP_H264_MAX_BIT_RATE_MAX = 6;
        var TXT_VIDEO_OVER_IP_H264_MAX_BIT_RATE_DASH = 7;
        var TXT_VIDEO_OVER_IP_H264_MAX_BIT_RATE_MIN = 8;
        var TXT_VIDEO_OVER_IP_H264_IMAGE_QUALITY = 9;
        var TXT_VIDEO_OVER_IP_H264_TRANSMISSION_TYPE = 10;
        var TXT_VIDEO_OVER_IP_H264_UNI_CAST_PORT_IMAGE = 11;
        var TXT_VIDEO_OVER_IP_H264_UNI_CAST_PORT_IMAGE_MESSAGE = 12;
        var TXT_VIDEO_OVER_IP_H264_UNI_CAST_PORT_AUDIO = 13;//    Unicast port(Audio)
        var TXT_VIDEO_OVER_IP_H264_UNI_CAST_PORT_AUDIO_MESSAGE = 14;
        var TXT_VIDEO_OVER_IP_H264_MULTI_CAST_ADDRESS = 15;
        var TXT_VIDEO_OVER_IP_H264_MULTI_CAST_PORT = 16;
        var TXT_VIDEO_OVER_IP_H264_MULTI_CAST_PORT_MESSAGE = 17;
        var TXT_VIDEO_OVER_IP_H264_MULTI_CAST_HTL_HOP_LIMIT = 18;
        var TXT_VIDEO_OVER_IP_H264_MULTI_CAST_HTL_HOP_LIMIT_MESSAGE = 19;
        var TXT_VIDEO_OVER_IP_H264_PROFILE_TYPE = 20;
        var selectH264ImageCaptureSize;
        var selectH264TransmissionPriority;
        var selectH264FrameRate;
        var selectH264MaxBitRateMax;
        //var selectH264MaxBitRateMin;
        //var selectH264ImageQuality;
        var selectH264TransmissionType;
        var txtH264Object = [];
        var h264_transmit;
        var h264_rtsp_mode;
        var h264_resolution;
        var h264_f_priority;
        var h264_framerate;
        var h264_bandwidth;
        var h264_bandwidth_min;
        var h264_quality;
        var h264_unimulti;
        var h264_unicast_port;
        var h264_unicast_audio_port;
        var h264_multicast_addr;
        var h264_multicast_port;
        var h264_multicast_ttl;
        var h264_profile;

        /**
         * input[] : text
         * @type txtH264InputObject[]
         */
        var txtH264InputObject = [];
        var INPUT_VIDEO_OVER_IP_H264_TRANSMISSION_TYPE_UNI_CAST_PORT_IMAGE = 0;
        var INPUT_VIDEO_OVER_IP_H264_TRANSMISSION_TYPE_UNI_CAST_PORT_AUDIO = 1;
        var INPUT_VIDEO_OVER_IP_H264_MULTI_CAST_ADDRESS = 2;
        var INPUT_VIDEO_OVER_IP_H264_MULTI_CAST_PORT = 3;
        var INPUT_VIDEO_OVER_IP_H264_MULTI_CAST_HTL_HOP_LIMIT = 4;
        var transmissionRadioButtonGroup;
        var internetModeRadioButtonGroup;
        var profileTypeRadioButtonGroup;
        var h264_set_button;

        function getCurrentValueOfH264(type) {
            if (type) {
                h264_transmit = objVOIP["h264_transmit_ch" + type];
                h264_rtsp_mode = objVOIP["h264_rtsp_mode_ch" + type];
                h264_resolution = objVOIP["h264_resolution_ch" + type];
                h264_f_priority = objVOIP["h264_f_priority_ch" + type];
                h264_framerate = objVOIP["h264_framerate_ch" + type];
                h264_bandwidth = objVOIP["h264_bandwidth_ch" + type];
                h264_bandwidth_min = objVOIP["h264_bandwidth_min_ch" + type];
                h264_quality = objVOIP["h264_quality_ch" + type];
                h264_unimulti = objVOIP["h264_unimulti_ch" + type];
                h264_unicast_port = objVOIP["h264_unicast_port_ch" + type];
                h264_unicast_audio_port = objVOIP["h264_unicast_audio_port_ch" + type];
                h264_multicast_addr = objVOIP["h264_multicast_addr_ch" + type];
                h264_multicast_port = objVOIP["h264_multicast_port_ch" + type];
                h264_multicast_ttl = objVOIP["h264_multicast_ttl_ch" + type];
                h264_profile = objVOIP["h264_profile_ch" + type];
            }
        }

        function buildH264(type) {
            currentType = type;
            getCurrentValueOfH264(type);
            if (!buildFlag_H264) {
                buildFlag_H264 = true;
                // H.264 transmission
                txtH264Object[TXT_VIDEO_OVER_IP_H264_TRANSMISSION] = TextCtrl('setup_videoOverIp_h264_label', 'setup_videoOverIp_h264_transmission_label', NPTZ_WORDING.wID_0235);
                // H.264 transmission radioButtonItems
                transmissionRadioButtonGroup = RadioButtonGroupCtrl("setup_videoOverIp_h264_form", "setup_videoOverIp_h264_transmission_", RADIO_GROUP.rID_0001, h264_transmit, callbackH264Transmission);
                LineCtrl('setup_videoOverIp_h264_main', 'horizontal', 73, 0, "", "setup_videoOverIp_h264_transmission_label", "97.5");

                // Internet mode(Over HTTP)
                txtH264Object[TXT_VIDEO_OVER_IP_H264_INTERNET_MODE] = TextCtrl('setup_videoOverIp_h264_label', 'setup_videoOverIp_h264_internetMode_label', NPTZ_WORDING.wID_0236);
                // JPEG transmission radioButtonItems
                internetModeRadioButtonGroup = RadioButtonGroupCtrl("setup_videoOverIp_h264_form", "setup_videoOverIp_h264_internetMode_", RADIO_GROUP.rID_0001, h264_rtsp_mode, callbackH264InternetMode);
                LineCtrl('setup_videoOverIp_h264_main', 'horizontal', 141, 0, "", "setup_videoOverIp_h264_internetMode_label", "97.5");

                //Profile type
                txtH264Object[TXT_VIDEO_OVER_IP_H264_PROFILE_TYPE] = TextCtrl('setup_videoOverIp_h264_label', 'setup_videoOverIp_h264_profile_type_label', NPTZ_WORDING.wID_0592);
                profileTypeRadioButtonGroup = RadioButtonGroupCtrl("setup_videoOverIp_h264_form", "setup_videoOverIp_h264_profile_type_", RADIO_GROUP.rID_0069, h264_profile, callbackH264ProfileType);

                // image capture size
                txtH264Object[TXT_VIDEO_OVER_IP_H264_IMAGE_CAPTURE_SIZE] = TextCtrl('setup_videoOverIp_h264_label', 'setup_videoOverIp_h264_imageCaptureSize_label', NPTZ_WORDING.wID_0102);
                selectH264ImageCaptureSize = SelectCtrl('setup_videoOverIp_h264_form', "", "setup_videoOverIp_h264_imageCaptureSize_select", "setup_videoOverIp_h264_imageCaptureSize_select", callbackH264ImageCaptureSize, '', sysConst.getH264ImageCaptureSizeItems(type), h264_resolution);
                selectH264ImageCaptureSize.show();
                selectH264ImageCaptureSize.displayOn();
                LineCtrl('setup_videoOverIp_h264_main', 'horizontal', 209, 0, "", "setup_videoOverIp_h264_imageCaptureSize_label", "97.5");

                // Transmission priority
                txtH264Object[TXT_VIDEO_OVER_IP_H264_TRANSMISSION_PRIORITY] = TextCtrl('setup_videoOverIp_h264_label', 'setup_videoOverIp_h264_transmission_priority_label', NPTZ_WORDING.wID_0726);
                selectH264TransmissionPriority = SelectCtrl('setup_videoOverIp_h264_form', "", "setup_videoOverIp_h264_transmission_priority_select", "setup_videoOverIp_h264_transmission_priority_select", callbackTransmissionPriority, '', TRANSMISSION_PRIORITY_OPTIONS, h264_f_priority);
                selectH264TransmissionPriority.show();
                selectH264TransmissionPriority.displayOn();
                LineCtrl('setup_videoOverIp_h264_main', 'horizontal', 277, 0, "", "setup_videoOverIp_h264_transmission_priority_label", "97.5");

                // Frame rate
                txtH264Object[TXT_VIDEO_OVER_IP_H264_FRAME_RATE] = TextCtrl('setup_videoOverIp_h264_label', 'setup_videoOverIp_h264_frame_rate_label', NPTZ_WORDING.wID_0105);
                selectH264FrameRate = SelectCtrl('setup_videoOverIp_h264_form', "", "setup_videoOverIp_h264_frame_rate_select", "setup_videoOverIp_h264_frame_rate_select", callbackH264FrameRate, '', sysConst.getH264FrameRateItems(type, h264_resolution), h264_framerate);
                selectH264FrameRate.show();
                selectH264FrameRate.displayOn();
                LineCtrl('setup_videoOverIp_h264_main', 'horizontal', 345, 0, "", "setup_videoOverIp_h264_frame_rate_label", "97.5");

                // Max bit rate(per client)
                const h264BitRateOptions = sysConst.getH264BitRate(h264_resolution, h264_framerate);
                txtH264Object[TXT_VIDEO_OVER_IP_H264_MAX_BIT_RATE] = TextCtrl('setup_videoOverIp_h264_label', 'setup_videoOverIp_h264_maxBitRate_label', NPTZ_WORDING.wID_0107);
                txtH264Object[TXT_VIDEO_OVER_IP_H264_MAX_BIT_RATE_MAX] = TextCtrl('setup_videoOverIp_h264_form', 'setup_videoOverIp_h264_maxBitRate_max_label', NPTZ_WORDING.wID_0237);
                selectH264MaxBitRateMax = SelectCtrl('setup_videoOverIp_h264_form', "", "setup_videoOverIp_h264_max_bit_rate_max_select", "setup_videoOverIp_h264_max_bit_rate_max_select", '', '', h264BitRateOptions, h264_bandwidth);
                selectH264MaxBitRateMax.show();
                selectH264MaxBitRateMax.displayOn();
                //txtH264Object[TXT_VIDEO_OVER_IP_H264_MAX_BIT_RATE_DASH] = TextCtrl('setup_videoOverIp_h264_form', 'setup_videoOverIp_h264_maxBitRate_dash_label', NPTZ_WORDING.wID_0015);
                //txtH264Object[TXT_VIDEO_OVER_IP_H264_MAX_BIT_RATE_MIN] = TextCtrl('setup_videoOverIp_h264_form', 'setup_videoOverIp_h264_maxBitRate_min_label', NPTZ_WORDING.wID_0238);
                //selectH264MaxBitRateMin = SelectCtrl('setup_videoOverIp_h264_form', "", "setup_videoOverIp_h264_max_bit_rate_min_select", "setup_videoOverIp_h264_max_bit_rate_min_select", '', '', h264BitRateOptions, h264_bandwidth_min);
                // selectH264MaxBitRateMin.show();
                // selectH264MaxBitRateMin.displayOn();
                LineCtrl('setup_videoOverIp_h264_main', 'horizontal', 413, 0, "", "setup_videoOverIp_h264_max_bit_rate_min_select", "97.5");

                // Image quality
                // txtH264Object[TXT_VIDEO_OVER_IP_H264_IMAGE_QUALITY] = TextCtrl('setup_videoOverIp_h264_label', 'setup_videoOverIp_h264_imageQuality_label', NPTZ_WORDING.wID_0104);
                // selectH264ImageQuality = SelectCtrl('setup_videoOverIp_h264_form', "", "setup_videoOverIp_h264_image_quality_select", "setup_videoOverIp_h264_image_quality_select", '', '', H264_IMAGE_QUALITY, h264_quality);
                // selectH264ImageQuality.show();
                // selectH264ImageQuality.displayOn();
                LineCtrl('setup_videoOverIp_h264_main', 'horizontal', 481, 0, "", "setup_videoOverIp_h264_imageQuality_label", "97.5");

                // Transmission type
                txtH264Object[TXT_VIDEO_OVER_IP_H264_TRANSMISSION_TYPE] = TextCtrl('setup_videoOverIp_h264_label', 'setup_videoOverIp_h264_transmissionType_label', NPTZ_WORDING.wID_0101);
                selectH264TransmissionType = SelectCtrl('setup_videoOverIp_h264_form', "", "setup_videoOverIp_h264_transmission_type_quality_select", "setup_videoOverIp_h264_transmission_type_quality_select", callbackH264TransmissionType, '', H264_TRANSMISSION_TYPE, h264_unimulti);
                selectH264TransmissionType.show();
                selectH264TransmissionType.displayOn();
                LineCtrl('setup_videoOverIp_h264_main', 'vertical', 541, 37, 100, "setup_videoOverIp_h264_transmissionType_label");
                LineCtrl('setup_videoOverIp_h264_main', 'horizontal', 541, 50, "", "etup_videoOverIp_h264_transmissionType_label", "95.5");
                txtH264Object[TXT_VIDEO_OVER_IP_H264_UNI_CAST_PORT_IMAGE] = TextCtrl('setup_videoOverIp_h264_label', 'setup_videoOverIp_h264_transmissionType_unicastPortImage_label', NPTZ_WORDING.wID_0239);
                txtH264InputObject[INPUT_VIDEO_OVER_IP_H264_TRANSMISSION_TYPE_UNI_CAST_PORT_IMAGE] = InputCtrl("setup_videoOverIp_h264_form", 'unicast_image_port', 'unicast_image_port', 'setup_videoOverIp_h264_transmissionType_unicastPortImage_input', h264_unicast_port, null, null, null, null, 5);
                // port 数字以外�E力できなぁE
                txtH264InputObject[INPUT_VIDEO_OVER_IP_H264_TRANSMISSION_TYPE_UNI_CAST_PORT_IMAGE].getInputObject().keypress(filterNumber);
                txtH264Object[TXT_VIDEO_OVER_IP_H264_UNI_CAST_PORT_IMAGE_MESSAGE] = TextCtrl('setup_videoOverIp_h264_form', 'setup_videoOverIp_h264_transmissionType_unicastPortImage_message_label', NPTZ_WORDING.wID_0240);
                LineCtrl('setup_videoOverIp_h264_main', 'horizontal', 593, 50, "", "setup_videoOverIp_h264_transmissionType_unicastPortImage_label", "95.5");
                txtH264Object[TXT_VIDEO_OVER_IP_H264_UNI_CAST_PORT_AUDIO] = TextCtrl('setup_videoOverIp_h264_label', 'setup_videoOverIp_h264_transmissionType_uniCastPortAudio_label', NPTZ_WORDING.wID_0241);
                txtH264InputObject[INPUT_VIDEO_OVER_IP_H264_TRANSMISSION_TYPE_UNI_CAST_PORT_AUDIO] = InputCtrl("setup_videoOverIp_h264_form", 'unicast_audio_port', 'unicast_audio_port', 'setup_videoOverIp_h264_transmissionType_unicastPortAudio_input', h264_unicast_audio_port, null, null, null, null, 5);
                // port 数字以外�E力できなぁE
                txtH264InputObject[INPUT_VIDEO_OVER_IP_H264_TRANSMISSION_TYPE_UNI_CAST_PORT_AUDIO].getInputObject().keypress(filterNumber);
                txtH264Object[TXT_VIDEO_OVER_IP_H264_UNI_CAST_PORT_AUDIO_MESSAGE] = TextCtrl('setup_videoOverIp_h264_form', 'setup_videoOverIp_h264_transmissionType_unicastPortAudio_message_label', NPTZ_WORDING.wID_0240);
                LineCtrl('setup_videoOverIp_h264_main', 'horizontal', 653, 0, "", "setup_videoOverIp_h264_transmissionType_uniCastPortAudio_label", "97.5");

                // Multicast address
                txtH264Object[TXT_VIDEO_OVER_IP_H264_MULTI_CAST_ADDRESS] = TextCtrl('setup_videoOverIp_h264_label', 'setup_videoOverIp_h264_multiCastAddress_label', NPTZ_WORDING.wID_0242);
                txtH264InputObject[INPUT_VIDEO_OVER_IP_H264_MULTI_CAST_ADDRESS] = InputCtrl("setup_videoOverIp_h264_form", 'multicast_address', 'multicast_address', 'setup_videoOverIp_h264_multicastAddress_input', h264_multicast_addr);
                LineCtrl('setup_videoOverIp_h264_main', 'horizontal', 721, 0, "", "setup_videoOverIp_h264_multiCastAddress_label", "97.5");

                // Multicast port
                txtH264Object[TXT_VIDEO_OVER_IP_H264_MULTI_CAST_PORT] = TextCtrl('setup_videoOverIp_h264_label', 'setup_videoOverIp_h264_multiCastPort_label', NPTZ_WORDING.wID_0243);
                txtH264InputObject[INPUT_VIDEO_OVER_IP_H264_MULTI_CAST_PORT] = InputCtrl("setup_videoOverIp_h264_form", 'multicast_port', 'multicast_port', 'setup_videoOverIp_h264_multicastPort_input', h264_multicast_port, null, null, null, null, 5);
                // port 数字以外�E力できなぁE
                txtH264InputObject[INPUT_VIDEO_OVER_IP_H264_MULTI_CAST_PORT].getInputObject().keypress(filterNumber);
                txtH264Object[TXT_VIDEO_OVER_IP_H264_MULTI_CAST_PORT_MESSAGE] = TextCtrl('setup_videoOverIp_h264_form', 'setup_videoOverIp_h264_multiCastPort_message_label', NPTZ_WORDING.wID_0240);
                LineCtrl('setup_videoOverIp_h264_main', 'horizontal', 789, 0, "", "setup_videoOverIp_h264_multiCastPort_label", "97.5");

                // Multicast TTL/HOPLimit
                txtH264Object[TXT_VIDEO_OVER_IP_H264_MULTI_CAST_HTL_HOP_LIMIT] = TextCtrl('setup_videoOverIp_h264_label', 'setup_videoOverIp_h264_multiCastHTLHOPLimit_label', NPTZ_WORDING.wID_0244);
                txtH264InputObject[INPUT_VIDEO_OVER_IP_H264_MULTI_CAST_HTL_HOP_LIMIT] = InputCtrl("setup_videoOverIp_h264_form", 'multicast_HTLHOPLimit', 'multicast_HTLHOPLimit', 'setup_videoOverIp_h264_multicastHTLHOPLimit_input', h264_multicast_ttl, null, null, null, null, 3);
                txtH264InputObject[INPUT_VIDEO_OVER_IP_H264_MULTI_CAST_HTL_HOP_LIMIT].getInputObject().keypress(filterNumber);
                txtH264Object[TXT_VIDEO_OVER_IP_H264_MULTI_CAST_HTL_HOP_LIMIT_MESSAGE] = TextCtrl('setup_videoOverIp_h264_form', 'setup_videoOverIp_h264_multiHtlHopLimit_message_label', NPTZ_WORDING.wID_0245);
                LineCtrl('setup_videoOverIp_h264_main', 'horizontal', 857, 0, "", "setup_videoOverIp_h264_multiCastHTLHOPLimit_label", "97.5");

                h264_set_button = ButtonCtrl("setup_videoOverIp_h264_set_btn_area", "setup_videoOverIp_h264_set_button", NPTZ_WORDING.wID_0141, callbackH264SetButton);
                h264_set_button.getButtonObject().addClass('button_class');
                h264_set_button.show();
                h264_set_button.displayOff();
                for (var text in txtH264Object) {
                    txtH264Object[text].show();
                }
                for (var text in txtH264InputObject) {
                    txtH264InputObject[text].show();
                    txtH264InputObject[text].displayOff();
                }
                changeItemStatus();
            } else {
                rebuild(type);
            }
        }

        function rebuild(type) {
            transmissionRadioButtonGroup.setSelectedValue(h264_transmit);
            internetModeRadioButtonGroup.setSelectedValue(h264_rtsp_mode);
            profileTypeRadioButtonGroup.setSelectedValue(h264_profile);
            selectH264ImageCaptureSize.refreshOptions(sysConst.getH264ImageCaptureSizeItems(currentType));
            selectH264ImageCaptureSize.val(h264_resolution);
            selectH264TransmissionPriority.val(h264_f_priority);
            selectH264FrameRate.refreshOptions(sysConst.getH264FrameRateItems(currentType, h264_resolution));
            selectH264FrameRate.val(h264_framerate);
            let h264BitRateOptions = sysConst.getH264BitRate(h264_resolution, h264_framerate);
            selectH264MaxBitRateMax.refreshOptions(h264BitRateOptions);
            selectH264MaxBitRateMax.val(h264_bandwidth);
            // selectH264MaxBitRateMin.refreshOptions(h264BitRateOptions);
            // selectH264MaxBitRateMin.val(h264_bandwidth_min);
            // selectH264ImageQuality.val(h264_quality);
            selectH264TransmissionType.val(h264_unimulti);
            for (let i = 0; i < txtH264InputObject.length; i++) {
                switch (i) {
                    case INPUT_VIDEO_OVER_IP_H264_TRANSMISSION_TYPE_UNI_CAST_PORT_IMAGE:
                        txtH264InputObject[i].val(h264_unicast_port);
                        break;
                    case INPUT_VIDEO_OVER_IP_H264_TRANSMISSION_TYPE_UNI_CAST_PORT_AUDIO:
                        txtH264InputObject[i].val(h264_unicast_audio_port);
                        break;
                    case INPUT_VIDEO_OVER_IP_H264_MULTI_CAST_ADDRESS:
                        txtH264InputObject[i].val(h264_multicast_addr);
                        break;
                    case INPUT_VIDEO_OVER_IP_H264_MULTI_CAST_PORT:
                        txtH264InputObject[i].val(h264_multicast_port);
                        break;
                    case INPUT_VIDEO_OVER_IP_H264_MULTI_CAST_HTL_HOP_LIMIT:
                        txtH264InputObject[i].val(h264_multicast_ttl);
                        break;
                }
            }
            changeItemStatus();
        }

        /**
         *
         */
        function changeItemStatus() {
            switch (sysCommon.streamingMode) {
                case CONST_STREAM_MODE_H264_UHD:
                    // selectH264TransmissionPriority.displayDisabled();
                    // selectH264TransmissionPriority.val('1');
                    // selectH264FrameRate.displayOff();
                    // selectH264MaxBitRateMin.displayDisabled();
                    // selectH264ImageQuality.displayDisabled();
                    break;
                default:
                    // if (sysCommon.format == CONST_1080_23_98p_59_94i || sysCommon.frequency == CONST_23_98Hz || sysCommon.frequency == CONST_24Hz) {
                    //     selectH264TransmissionPriority.displayDisabled();
                    // } else {
                    //     selectH264TransmissionPriority.displayOff();
                    // }
                    if (selectH264TransmissionPriority.get() == '1') {
                        selectH264FrameRate.displayOff();
                        // selectH264MaxBitRateMin.displayDisabled();
                        // selectH264ImageQuality.displayDisabled();
                    } else if (selectH264TransmissionPriority.get() == '0') {
                        // if (selectH264FrameRate.get() == 60) {
                        //     selectH264FrameRate.val(30);
                        //     callbackH264FrameRate();
                        // }
                        // if (selectH264FrameRate.get() == 50) {
                        //     selectH264FrameRate.val(25);
                        //     callbackH264FrameRate();
                        // }
                        //selectH264FrameRate.displayDisabled();
                        // selectH264MaxBitRateMin.displayDisabled();
                        // selectH264ImageQuality.displayOff();
                    } else if (selectH264TransmissionPriority.get() == '2') {
                        if (selectH264FrameRate.get() == 60) {
                            selectH264FrameRate.val(30);
                            callbackH264FrameRate();
                        }
                        if (selectH264FrameRate.get() == 50) {
                            selectH264FrameRate.val(25);
                            callbackH264FrameRate();
                        }
                        selectH264FrameRate.displayDisabled();
                        // selectH264MaxBitRateMin.displayOff();
                        // selectH264ImageQuality.displayOff();
                    }
            }
            if (transmissionRadioButtonGroup.getSelectedValue() == 1) {
                internetModeRadioButtonGroup.displayOff();
                selectH264ImageCaptureSize.displayOff();
                selectH264MaxBitRateMax.displayOff();
                profileTypeRadioButtonGroup.displayOff();
                if (internetModeRadioButtonGroup.getSelectedValue() == 1) {
                    selectH264TransmissionType.val("uni");
                    selectH264TransmissionType.displayDisabled();
                } else {
                    selectH264TransmissionType.displayOff();
                }
                switch (selectH264TransmissionType.get()) {
                    case "uni":
                        for (var text in txtH264InputObject) {
                            txtH264InputObject[text].displayDisabled();
                        }
                        break;
                    case "uni_manual":
                        txtH264InputObject[INPUT_VIDEO_OVER_IP_H264_TRANSMISSION_TYPE_UNI_CAST_PORT_IMAGE].displayOff();
                        txtH264InputObject[INPUT_VIDEO_OVER_IP_H264_TRANSMISSION_TYPE_UNI_CAST_PORT_AUDIO].displayOff();
                        txtH264InputObject[INPUT_VIDEO_OVER_IP_H264_MULTI_CAST_ADDRESS].displayDisabled();
                        txtH264InputObject[INPUT_VIDEO_OVER_IP_H264_MULTI_CAST_PORT].displayDisabled();
                        txtH264InputObject[INPUT_VIDEO_OVER_IP_H264_MULTI_CAST_HTL_HOP_LIMIT].displayDisabled();
                        break;
                    case "multi":
                        txtH264InputObject[INPUT_VIDEO_OVER_IP_H264_TRANSMISSION_TYPE_UNI_CAST_PORT_IMAGE].displayDisabled();
                        txtH264InputObject[INPUT_VIDEO_OVER_IP_H264_TRANSMISSION_TYPE_UNI_CAST_PORT_AUDIO].displayDisabled();
                        txtH264InputObject[INPUT_VIDEO_OVER_IP_H264_MULTI_CAST_ADDRESS].displayOff();
                        txtH264InputObject[INPUT_VIDEO_OVER_IP_H264_MULTI_CAST_PORT].displayOff();
                        txtH264InputObject[INPUT_VIDEO_OVER_IP_H264_MULTI_CAST_HTL_HOP_LIMIT].displayOff();
                        break;
                }
            } else {
                internetModeRadioButtonGroup.displayDisabled();
                profileTypeRadioButtonGroup.displayDisabled();
                selectH264ImageCaptureSize.displayDisabled();
                selectH264TransmissionPriority.displayDisabled();
                selectH264FrameRate.displayDisabled();
                selectH264MaxBitRateMax.displayDisabled();
                // selectH264MaxBitRateMin.displayDisabled();
                // selectH264ImageQuality.displayDisabled();
                selectH264TransmissionType.displayDisabled();
                for (var text in txtH264InputObject) {
                    txtH264InputObject[text].displayDisabled();
                }
            }
        }

        /**
         *
         */
        function callbackH264ImageCaptureSize() {
            selectH264FrameRate.refreshOptions(sysConst.getH264FrameRateItems(currentType, selectH264ImageCaptureSize.get()));
            selectH264FrameRate.setMaxValue(h264_framerate);
            callbackH264FrameRate();
        }

        /**
         *
         */
        function callbackH264FrameRate() {
            h264_framerate = selectH264FrameRate.get();
            const h264BitRateOptions = sysConst.getH264BitRate(selectH264ImageCaptureSize.get(), selectH264FrameRate.get());
            selectH264MaxBitRateMax.refreshOptions(h264BitRateOptions);
            selectH264MaxBitRateMax.val(getMaxBitRateMaxToSet(h264BitRateOptions, h264_bandwidth));
            // selectH264MaxBitRateMin.refreshOptions(h264BitRateOptions);
            // selectH264MaxBitRateMin.val(h264_bandwidth_min);
        }

        /**
         *
         */
        function callbackTransmissionPriority() {
            changeItemStatus();
        }

        /**
         *
         */
        function callbackH264Transmission() {
            changeItemStatus();
        }

        /**
         *
         */
        function callbackH264InternetMode() {
            changeItemStatus();
        }

        function callbackH264ProfileType() {
            const imageSize = selectH264ImageCaptureSize.get();
            const frameRate = selectH264FrameRate.get();
            h264_profile = profileTypeRadioButtonGroup.getSelectedValue();
            const sizeArr = sysConst.getH264ImageCaptureSizeItems(currentType, h264_profile);
            selectH264ImageCaptureSize.refreshOptions(sizeArr);
            selectH264FrameRate.refreshOptions(sysConst.getH264FrameRateItems(currentType, selectH264ImageCaptureSize.get()));
            selectH264FrameRate.val(frameRate);
            for (let key in sizeArr) {
                if (sizeArr[key] == imageSize) {
                    selectH264ImageCaptureSize.val(imageSize);
                    break;
                }
            }


            // if($.inArray(sizeArr,h264_resolution)){
            //     selectH264ImageCaptureSize.val(h264_resolution);
            // }else{
            //     selectH264ImageCaptureSize.val(sizeArr[0]);
            // }
            //h264_resolution = "1280";
            //changeItemStatus();

            //if(currentType >= 3 && h264_profile!="high") h264_resolution = 1280;


            //callbackH264ImageCaptureSize();
        }

        /**
         *
         */
        function callbackH264TransmissionType() {
            changeItemStatus();
        }

        /**
         *
         */
        function callbackH264SetButton(mouse) {
            if (mouse == Button.MOUSE_DOWN) {
                if (!checkAllInput()) {
                    return;
                }
                if (!checkBitRateTotal('H264_' + currentType, selectH264MaxBitRateMax.get() / 1000)) {
                    jAlert(MSG_STATUS.mID_0075, NPTZ_WORDING.wID_0039);
                    rebuild(currentType);
                    return;
                }
                $("#dialog_setup").show();
                $.ajax({
                    type: "post",
                    url: getH264CgiUrl(currentType),
                    data: getH264SettingData(currentType),
                    success: function (data) {
                        initVideoOverIPMenuStatus(getStreamMode());
                        setTimeout(function () {
                            $("#dialog_setup").hide();
                        }, 500);
                    },
                    error: function (jqXHR, textStatus, errorThrown) {
                        setTimeout(function () {
                            $("#dialog_setup").hide();
                        }, 500);
                    }
                });

            }
        }

        function checkAllInput() {
            if (selectH264TransmissionPriority.get() == '2') {
                // if(parseInt(selectH264MaxBitRateMax.get()) < parseInt(selectH264MaxBitRateMin.get())){
                //     objErrCode = MSG_STATUS.mID_0009;
                //     return capi_DispError(selectH264MaxBitRateMax.getSelectObject(), objErrCode);
                // }
            }
            if (selectH264TransmissionType.get() == 'uni_manual') {
                if (!CheckPort(txtH264InputObject[INPUT_VIDEO_OVER_IP_H264_TRANSMISSION_TYPE_UNI_CAST_PORT_IMAGE].get())) {
                    objErrCode = MSG_STATUS.mID_0009;
                    return capi_DispError(txtH264InputObject[INPUT_VIDEO_OVER_IP_H264_TRANSMISSION_TYPE_UNI_CAST_PORT_IMAGE].getInputObject(), objErrCode);
                }
                if (!CheckPort(txtH264InputObject[INPUT_VIDEO_OVER_IP_H264_TRANSMISSION_TYPE_UNI_CAST_PORT_AUDIO].get())) {
                    objErrCode = MSG_STATUS.mID_0009;
                    return capi_DispError(txtH264InputObject[INPUT_VIDEO_OVER_IP_H264_TRANSMISSION_TYPE_UNI_CAST_PORT_AUDIO].getInputObject(), objErrCode);
                }
                if (!CheckNum(txtH264InputObject[INPUT_VIDEO_OVER_IP_H264_TRANSMISSION_TYPE_UNI_CAST_PORT_IMAGE].get())) {
                    objErrCode = MSG_STATUS.mID_0009;
                    return capi_DispError(txtH264InputObject[INPUT_VIDEO_OVER_IP_H264_TRANSMISSION_TYPE_UNI_CAST_PORT_IMAGE].getInputObject(), objErrCode);
                }
                if (!CheckNum(txtH264InputObject[INPUT_VIDEO_OVER_IP_H264_TRANSMISSION_TYPE_UNI_CAST_PORT_AUDIO].get())) {
                    objErrCode = MSG_STATUS.mID_0009;
                    return capi_DispError(txtH264InputObject[INPUT_VIDEO_OVER_IP_H264_TRANSMISSION_TYPE_UNI_CAST_PORT_AUDIO].getInputObject(), objErrCode);
                }
                if (txtH264InputObject[INPUT_VIDEO_OVER_IP_H264_TRANSMISSION_TYPE_UNI_CAST_PORT_IMAGE].get() == 10670) {
                    objErrCode = MSG_STATUS.mID_0026;
                    return capi_DispError(txtH264InputObject[INPUT_VIDEO_OVER_IP_H264_TRANSMISSION_TYPE_UNI_CAST_PORT_IMAGE].getInputObject(), objErrCode);
                }
                if (txtH264InputObject[INPUT_VIDEO_OVER_IP_H264_TRANSMISSION_TYPE_UNI_CAST_PORT_AUDIO].get() == 10670) {
                    objErrCode = MSG_STATUS.mID_0026;
                    return capi_DispError(txtH264InputObject[INPUT_VIDEO_OVER_IP_H264_TRANSMISSION_TYPE_UNI_CAST_PORT_AUDIO].getInputObject(), objErrCode);
                }
            }
            else if (selectH264TransmissionType.get() == 'multi') {
                //HTTPポ�Eトを使用してH.264画像、E�E��E�声を�E信する,IPv4アクセスのみに制限される、E
                if (internetModeRadioButtonGroup.getSelectedValue() == 1) {
                    if (chknet_ipaddr_familly(txtH264InputObject[INPUT_VIDEO_OVER_IP_H264_MULTI_CAST_ADDRESS].get()) == "IPv6") {
                        objErrCode = MSG_STATUS.mID_0043;
                        return capi_DispError(txtH264InputObject[INPUT_VIDEO_OVER_IP_H264_MULTI_CAST_ADDRESS].getInputObject(), objErrCode);
                    }
                }
                if (!chknet_CheckMultiAddr(txtH264InputObject[INPUT_VIDEO_OVER_IP_H264_MULTI_CAST_ADDRESS].get())) {
                    // chknet_CheckMultiAddr冁E�E��E�objErrCodeが設定される
                    return capi_DispError(txtH264InputObject[INPUT_VIDEO_OVER_IP_H264_MULTI_CAST_ADDRESS].getInputObject(), objErrCode);
                }
                if (!CheckPort(txtH264InputObject[INPUT_VIDEO_OVER_IP_H264_MULTI_CAST_PORT].get())) {
                    objErrCode = MSG_STATUS.mID_0009;
                    return capi_DispError(txtH264InputObject[INPUT_VIDEO_OVER_IP_H264_MULTI_CAST_PORT].getInputObject(), objErrCode);
                }
                if (!CheckNum(txtH264InputObject[INPUT_VIDEO_OVER_IP_H264_MULTI_CAST_PORT].get())) {
                    objErrCode = MSG_STATUS.mID_0009;
                    return capi_DispError(txtH264InputObject[INPUT_VIDEO_OVER_IP_H264_MULTI_CAST_PORT].getInputObject(), objErrCode);
                }
                if (txtH264InputObject[INPUT_VIDEO_OVER_IP_H264_MULTI_CAST_PORT].get() == 10670) {
                    objErrCode = MSG_STATUS.mID_0026;
                    return capi_DispError(txtH264InputObject[INPUT_VIDEO_OVER_IP_H264_MULTI_CAST_PORT].getInputObject(), objErrCode);
                }
                if (!CheckNum(txtH264InputObject[INPUT_VIDEO_OVER_IP_H264_MULTI_CAST_HTL_HOP_LIMIT].get())) {
                    objErrCode = MSG_STATUS.mID_0009;
                    return capi_DispError(txtH264InputObject[INPUT_VIDEO_OVER_IP_H264_MULTI_CAST_HTL_HOP_LIMIT].getInputObject(), objErrCode);
                }
                if ((txtH264InputObject[INPUT_VIDEO_OVER_IP_H264_MULTI_CAST_HTL_HOP_LIMIT].get() < 1) || (txtH264InputObject[INPUT_VIDEO_OVER_IP_H264_MULTI_CAST_HTL_HOP_LIMIT].get() > 254)) {
                    objErrCode = MSG_STATUS.mID_0009;
                    return capi_DispError(txtH264InputObject[INPUT_VIDEO_OVER_IP_H264_MULTI_CAST_HTL_HOP_LIMIT].getInputObject(), objErrCode);
                }
            }
            return true;
        }

        function getH264CgiUrl(type) {
            var ret = null;
            if (type == 1) {
                ret = "/cgi-bin/set_h264";
            } else {
                ret = "/cgi-bin/set_h264_" + type;
            }
            return ret;
        }

        function getH264SettingData(type) {
            var data = {};
            if (!transmissionRadioButtonGroup.isDisabled()) {
                data['h264_transmit'] = transmissionRadioButtonGroup.getSelectedValue();
            }
            if (!internetModeRadioButtonGroup.isDisabled()) {
                data['h264_rtsp_mode'] = internetModeRadioButtonGroup.getSelectedValue();
            }
            if (selectH264ImageCaptureSize.getStatus() != Select.STATUS_DISABLED) {
                data['h264_resolution'] = selectH264ImageCaptureSize.get();
            }
            if (selectH264TransmissionPriority.getStatus() != Select.STATUS_DISABLED) {
                data['f_priority'] = selectH264TransmissionPriority.get();
            }
            data['framerate'] = selectH264FrameRate.get();
            data['profile'] = profileTypeRadioButtonGroup.getSelectedValue();
            if (selectH264MaxBitRateMax.getStatus() != Select.STATUS_DISABLED) {
                data['h264_bandwidth'] = selectH264MaxBitRateMax.get();
            }
            // if (selectH264MaxBitRateMin.getStatus() != Select.STATUS_DISABLED) {
            //     data['h264_bandwidth_min'] = selectH264MaxBitRateMin.get();
            // }
            // if (selectH264ImageQuality.getStatus() != Select.STATUS_DISABLED) {
            //     data['h264_quality'] = selectH264ImageQuality.get();
            // }
            if (selectH264TransmissionType.getStatus() != Select.STATUS_DISABLED) {
                data['h264_unimulti'] = selectH264TransmissionType.get();
            }
            if (txtH264InputObject[INPUT_VIDEO_OVER_IP_H264_TRANSMISSION_TYPE_UNI_CAST_PORT_IMAGE].getStatus() != Input.STATUS_DISABLED) {
                data['unicast_port'] = txtH264InputObject[INPUT_VIDEO_OVER_IP_H264_TRANSMISSION_TYPE_UNI_CAST_PORT_IMAGE].get();
            }
            if (txtH264InputObject[INPUT_VIDEO_OVER_IP_H264_TRANSMISSION_TYPE_UNI_CAST_PORT_AUDIO].getStatus() != Input.STATUS_DISABLED) {
                data['unicast_audio_port'] = txtH264InputObject[INPUT_VIDEO_OVER_IP_H264_TRANSMISSION_TYPE_UNI_CAST_PORT_AUDIO].get();
            }
            if (txtH264InputObject[INPUT_VIDEO_OVER_IP_H264_MULTI_CAST_ADDRESS].getStatus() != Input.STATUS_DISABLED) {
                data['multicast_addr'] = txtH264InputObject[INPUT_VIDEO_OVER_IP_H264_MULTI_CAST_ADDRESS].get();
            }
            if (txtH264InputObject[INPUT_VIDEO_OVER_IP_H264_MULTI_CAST_PORT].getStatus() != Input.STATUS_DISABLED) {
                data['multicast_port'] = txtH264InputObject[INPUT_VIDEO_OVER_IP_H264_MULTI_CAST_PORT].get();
            }
            if (txtH264InputObject[INPUT_VIDEO_OVER_IP_H264_MULTI_CAST_HTL_HOP_LIMIT].getStatus() != Input.STATUS_DISABLED) {
                data['multicast_ttl'] = txtH264InputObject[INPUT_VIDEO_OVER_IP_H264_MULTI_CAST_HTL_HOP_LIMIT].get();
            }
            return data;
        }

        return {
            build: function (type) {
                return buildH264(type);
            }
        }
    }

    /**
     * settingH264画面:settingJPEG制御に関わる画面クラス
     * @class settingH264画面:settingJPEG制御に関わる画面クラス
     * @return {{build: buildH264, rebuild: rebuild}} build 構築�E琁E
     * @return {function} rebuild 再構築�E琁E
     * @constructor
     */
    function settingH264_u() {
        /**
         * 構築フラグ
         * @type boolean
         */
        var buildFlag_H264 = false;
        /**
         * H264_1,H264_2,H264_3,H264_4を記録する
         */
        var currentType = 1;
        /**
         * label定義
         * @type number
         */
        var TXT_VIDEO_OVER_IP_H264_TRANSMISSION = 0;
        var TXT_VIDEO_OVER_IP_H264_IMAGE_CAPTURE_SIZE = 1;
        var TXT_VIDEO_OVER_IP_H264_TRANSMISSION_PRIORITY = 2;
        var TXT_VIDEO_OVER_IP_H264_FRAME_RATE = 3;
        var TXT_VIDEO_OVER_IP_H264_MAX_BIT_RATE = 4;
        var TXT_VIDEO_OVER_IP_H264_MAX_BIT_RATE_MAX = 5;
        var TXT_VIDEO_OVER_IP_H264_MAX_BIT_RATE_DASH = 6;
        var TXT_VIDEO_OVER_IP_H264_MAX_BIT_RATE_MIN = 7;
        var TXT_VIDEO_OVER_IP_H264_IMAGE_QUALITY = 8;
        var TXT_VIDEO_OVER_IP_H264_TRANSMISSION_TYPE = 9;
        var TXT_VIDEO_OVER_IP_H264_UNI_CAST_PORT_IMAGE = 10;
        var TXT_VIDEO_OVER_IP_H264_UNI_CAST_PORT_IMAGE_MESSAGE = 11;
        var TXT_VIDEO_OVER_IP_H264_UNI_CAST_PORT_AUDIO = 12;//    Unicast port(Audio)
        var TXT_VIDEO_OVER_IP_H264_UNI_CAST_PORT_AUDIO_MESSAGE = 13;
        var TXT_VIDEO_OVER_IP_H264_MULTI_CAST_ADDRESS = 14;
        var TXT_VIDEO_OVER_IP_H264_MULTI_CAST_PORT = 15;
        var TXT_VIDEO_OVER_IP_H264_MULTI_CAST_PORT_MESSAGE = 16;
        var TXT_VIDEO_OVER_IP_H264_MULTI_CAST_HTL_HOP_LIMIT = 17;
        var TXT_VIDEO_OVER_IP_H264_MULTI_CAST_HTL_HOP_LIMIT_MESSAGE = 18;
        var TXT_VIDEO_OVER_IP_H264_PROFILE_TYPE = 19;
        var selectH264ImageCaptureSize;
        var selectH264TransmissionPriority;
        var selectH264FrameRate;
        var selectH264MaxBitRateMax;
        //var selectH264MaxBitRateMin;
        //var selectH264ImageQuality;
        var selectH264TransmissionType;
        var txtH264Object = [];
        var h264_transmit;
        var h264_profile;
        var h264_resolution;
        var h264_f_priority;
        var h264_framerate;
        var h264_bandwidth;
        var h264_bandwidth_min;
        var h264_quality;
        var h264_unimulti;
        var h264_unicast_port;
        var h264_unicast_audio_port;
        var h264_multicast_addr;
        var h264_multicast_port;
        var h264_multicast_ttl;

        /**
         * input[] : text
         * @type txtH264InputObject[]
         */
        var txtH264InputObject = [];
        var INPUT_VIDEO_OVER_IP_H264_TRANSMISSION_TYPE_UNI_CAST_PORT_IMAGE = 0;
        var INPUT_VIDEO_OVER_IP_H264_TRANSMISSION_TYPE_UNI_CAST_PORT_AUDIO = 1;
        var INPUT_VIDEO_OVER_IP_H264_MULTI_CAST_ADDRESS = 2;
        var INPUT_VIDEO_OVER_IP_H264_MULTI_CAST_PORT = 3;
        var INPUT_VIDEO_OVER_IP_H264_MULTI_CAST_HTL_HOP_LIMIT = 4;
        var transmissionRadioButtonGroup;
        var profileTypeRadioButtonGroup;
        var h264_set_button;

        function getCurrentValueOfH264(type) {
            if (type) {
                h264_transmit = objVOIP["h264_transmit_ch" + type];
                h264_resolution = objVOIP["h264_resolution_ch" + type];
                h264_f_priority = objVOIP["h264_f_priority_ch" + type];
                h264_framerate = objVOIP["h264_framerate_ch" + type];
                h264_bandwidth = objVOIP["h264_bandwidth_ch" + type];
                h264_bandwidth_min = objVOIP["h264_bandwidth_min_ch" + type];
                h264_quality = objVOIP["h264_quality_ch" + type];
                h264_unimulti = objVOIP["h264_unimulti_ch" + type];
                h264_unicast_port = objVOIP["h264_unicast_port_ch" + type];
                h264_unicast_audio_port = objVOIP["h264_unicast_audio_port_ch" + type];
                h264_multicast_addr = objVOIP["h264_multicast_addr_ch" + type];
                h264_multicast_port = objVOIP["h264_multicast_port_ch" + type];
                h264_multicast_ttl = objVOIP["h264_multicast_ttl_ch" + type];
                h264_profile = objVOIP["h264_profile_ch" + type];
            }
        }

        function buildH264(type) {
            currentType = type;
            getCurrentValueOfH264(type);
            if (!buildFlag_H264) {
                buildFlag_H264 = true;
                // H.264 transmission
                txtH264Object[TXT_VIDEO_OVER_IP_H264_TRANSMISSION] = TextCtrl('setup_videoOverIp_h264_u_label', 'setup_videoOverIp_h264_u_transmission_label', NPTZ_WORDING.wID_0235);
                // H.264 transmission radioButtonItems
                transmissionRadioButtonGroup = RadioButtonGroupCtrl("setup_videoOverIp_h264_u_form", "setup_videoOverIp_h264_u_transmission_", RADIO_GROUP.rID_0001, h264_transmit, callbackH264Transmission);
                LineCtrl('setup_videoOverIp_h264_u_main', 'horizontal', 73, 0, "", "setup_videoOverIp_h264_u_transmission_label", "97");

                // // Internet mode(Over HTTP)
                // // JPEG transmission radioButtonItems
                LineCtrl('setup_videoOverIp_h264_u_main', 'horizontal', 141, 0, "", "setup_videoOverIp_h264_u_internetMode_label", "97");

                //Profile type
                txtH264Object[TXT_VIDEO_OVER_IP_H264_PROFILE_TYPE] = TextCtrl('setup_videoOverIp_h264_u_label', 'setup_videoOverIp_h264_u_profile_type_label', NPTZ_WORDING.wID_0592);
                profileTypeRadioButtonGroup = RadioButtonGroupCtrl("setup_videoOverIp_h264_u_form", "setup_videoOverIp_h264_u_profile_type_", RADIO_GROUP.rID_0069, h264_profile, callbackH264ProfileType);
                profileTypeRadioButtonGroup.displayDisabled();
                LineCtrl('setup_videoOverIp_h264_u_main', 'horizontal', 141, 0, "", "setup_videoOverIp_h264_u_profile_type_label", "97");

                // image capture size
                txtH264Object[TXT_VIDEO_OVER_IP_H264_IMAGE_CAPTURE_SIZE] = TextCtrl('setup_videoOverIp_h264_u_label', 'setup_videoOverIp_h264_u_imageCaptureSize_label', NPTZ_WORDING.wID_0102);
                selectH264ImageCaptureSize = SelectCtrl('setup_videoOverIp_h264_u_form', "", "setup_videoOverIp_h264_u_imageCaptureSize_select", "setup_videoOverIp_h264_u_imageCaptureSize_select", callbackH264ImageCaptureSize, '', sysConst.getH264ImageCaptureSizeItems(type), h264_resolution);
                selectH264ImageCaptureSize.show();
                selectH264ImageCaptureSize.displayOn();
                LineCtrl('setup_videoOverIp_h264_u_main', 'horizontal', 209, 0, "", "setup_videoOverIp_h264_u_imageCaptureSize_label", "97");

                // Transmission priority
                txtH264Object[TXT_VIDEO_OVER_IP_H264_TRANSMISSION_PRIORITY] = TextCtrl('setup_videoOverIp_h264_u_label', 'setup_videoOverIp_h264_u_transmission_priority_label', NPTZ_WORDING.wID_0726);
                selectH264TransmissionPriority = SelectCtrl('setup_videoOverIp_h264_u_form', "", "setup_videoOverIp_h264_u_transmission_priority_select", "setup_videoOverIp_h264_u_transmission_priority_select", callbackTransmissionPriority, '', TRANSMISSION_PRIORITY_OPTIONS, h264_f_priority);
                selectH264TransmissionPriority.show();
                selectH264TransmissionPriority.displayOn();
                LineCtrl('setup_videoOverIp_h264_u_main', 'horizontal', 277, 0, "", "setup_videoOverIp_h264_u_transmission_priority_label", "97");

                // Frame rate
                txtH264Object[TXT_VIDEO_OVER_IP_H264_FRAME_RATE] = TextCtrl('setup_videoOverIp_h264_u_label', 'setup_videoOverIp_h264_u_frame_rate_label', NPTZ_WORDING.wID_0105);
                selectH264FrameRate = SelectCtrl('setup_videoOverIp_h264_u_form', "", "setup_videoOverIp_h264_u_frame_rate_select", "setup_videoOverIp_h264_u_frame_rate_select", callbackH264FrameRate, '', sysConst.getH264FrameRateItems(type, h264_resolution), h264_framerate);
                selectH264FrameRate.show();
                selectH264FrameRate.displayOn();
                LineCtrl('setup_videoOverIp_h264_u_main', 'horizontal', 345, 0, "", "setup_videoOverIp_h264_u_frame_rate_label", "97");

                // Max bit rate(per client)
                var h264BitRateOptions = sysConst.getH264BitRate(h264_resolution, h264_framerate);
                txtH264Object[TXT_VIDEO_OVER_IP_H264_MAX_BIT_RATE] = TextCtrl('setup_videoOverIp_h264_u_label', 'setup_videoOverIp_h264_u_maxBitRate_label', NPTZ_WORDING.wID_0107);
                txtH264Object[TXT_VIDEO_OVER_IP_H264_MAX_BIT_RATE_MAX] = TextCtrl('setup_videoOverIp_h264_u_form', 'setup_videoOverIp_h264_u_maxBitRate_max_label', NPTZ_WORDING.wID_0237);
                selectH264MaxBitRateMax = SelectCtrl('setup_videoOverIp_h264_u_form', "", "setup_videoOverIp_h264_u_max_bit_rate_max_select", "setup_videoOverIp_h264_u_max_bit_rate_max_select", '', '', h264BitRateOptions, h264_bandwidth);
                selectH264MaxBitRateMax.show();
                selectH264MaxBitRateMax.displayOn();
                // txtH264Object[TXT_VIDEO_OVER_IP_H264_MAX_BIT_RATE_DASH] = TextCtrl('setup_videoOverIp_h264_u_form', 'setup_videoOverIp_h264_u_maxBitRate_dash_label', NPTZ_WORDING.wID_0015);
                // txtH264Object[TXT_VIDEO_OVER_IP_H264_MAX_BIT_RATE_MIN] = TextCtrl('setup_videoOverIp_h264_u_form', 'setup_videoOverIp_h264_u_maxBitRate_min_label', NPTZ_WORDING.wID_0238);
                // selectH264MaxBitRateMin = SelectCtrl('setup_videoOverIp_h264_u_form', "", "setup_videoOverIp_h264_u_max_bit_rate_min_select", "setup_videoOverIp_h264_u_max_bit_rate_min_select", '', '', h264BitRateOptions, h264_bandwidth_min);
                // selectH264MaxBitRateMin.show();
                // selectH264MaxBitRateMin.displayOn();
                // LineCtrl('setup_videoOverIp_h264_u_main', 'horizontal', 413, 0, "", "setup_videoOverIp_h264_u_max_bit_rate_min_select", "97");

                // Image quality
                // txtH264Object[TXT_VIDEO_OVER_IP_H264_IMAGE_QUALITY] = TextCtrl('setup_videoOverIp_h264_u_label', 'setup_videoOverIp_h264_u_imageQuality_label', NPTZ_WORDING.wID_0104);
                // selectH264ImageQuality = SelectCtrl('setup_videoOverIp_h264_u_form', "", "setup_videoOverIp_h264_u_image_quality_select", "setup_videoOverIp_h264_u_image_quality_select", '', '', H264_IMAGE_QUALITY, h264_quality);
                // selectH264ImageQuality.show();
                // selectH264ImageQuality.displayOn();
                LineCtrl('setup_videoOverIp_h264_u_main', 'horizontal', 481, 0, "", "setup_videoOverIp_h264_u_imageQuality_label", "97");
                LineCtrl('setup_videoOverIp_h264_u_main', 'horizontal', 481, 0, "", 'setup_videoOverIp_h264_image_quality_select', "95");

                // Transmission type
                txtH264Object[TXT_VIDEO_OVER_IP_H264_TRANSMISSION_TYPE] = TextCtrl('setup_videoOverIp_h264_u_label', 'setup_videoOverIp_h264_u_transmissionType_label', NPTZ_WORDING.wID_0101);
                selectH264TransmissionType = SelectCtrl('setup_videoOverIp_h264_u_form', "", "setup_videoOverIp_h264_u_transmission_type_quality_select", "setup_videoOverIp_h264_u_transmission_type_quality_select", callbackH264TransmissionType, '', H264_TRANSMISSION_TYPE, h264_unimulti);
                selectH264TransmissionType.show();
                selectH264TransmissionType.displayOn();
                LineCtrl('setup_videoOverIp_h264_u_main', 'vertical', 541, 37, 100, "setup_videoOverIp_h264_u_transmissionType_label");
                txtH264Object[TXT_VIDEO_OVER_IP_H264_UNI_CAST_PORT_IMAGE] = TextCtrl('setup_videoOverIp_h264_u_label', 'setup_videoOverIp_h264_u_transmissionType_unicastPortImage_label', NPTZ_WORDING.wID_0239);
                txtH264InputObject[INPUT_VIDEO_OVER_IP_H264_TRANSMISSION_TYPE_UNI_CAST_PORT_IMAGE] = InputCtrl("setup_videoOverIp_h264_u_form", 'unicast_image_port', 'unicast_image_port', 'setup_videoOverIp_h264_u_transmissionType_unicastPortImage_input', h264_unicast_port, null, null, null, null, 5);
                // port 数字以外�E力できなぁE
                txtH264InputObject[INPUT_VIDEO_OVER_IP_H264_TRANSMISSION_TYPE_UNI_CAST_PORT_IMAGE].getInputObject().keypress(filterNumber);
                txtH264Object[TXT_VIDEO_OVER_IP_H264_UNI_CAST_PORT_IMAGE_MESSAGE] = TextCtrl('setup_videoOverIp_h264_u_form', 'setup_videoOverIp_h264_u_transmissionType_unicastPortImage_message_label', NPTZ_WORDING.wID_0240);
                LineCtrl('setup_videoOverIp_h264_u_main', 'horizontal', 593, 50, "", "setup_videoOverIp_h264_u_transmissionType_unicastPortImage_label", "95");
                txtH264Object[TXT_VIDEO_OVER_IP_H264_UNI_CAST_PORT_AUDIO] = TextCtrl('setup_videoOverIp_h264_u_label', 'setup_videoOverIp_h264_u_transmissionType_uniCastPortAudio_label', NPTZ_WORDING.wID_0241);
                txtH264InputObject[INPUT_VIDEO_OVER_IP_H264_TRANSMISSION_TYPE_UNI_CAST_PORT_AUDIO] = InputCtrl("setup_videoOverIp_h264_u_form", 'unicast_audio_port', 'unicast_audio_port', 'setup_videoOverIp_h264_u_transmissionType_unicastPortAudio_input', h264_unicast_audio_port, null, null, null, null, 5);
                // port 数字以外�E力できなぁE
                txtH264InputObject[INPUT_VIDEO_OVER_IP_H264_TRANSMISSION_TYPE_UNI_CAST_PORT_AUDIO].getInputObject().keypress(filterNumber);
                txtH264Object[TXT_VIDEO_OVER_IP_H264_UNI_CAST_PORT_AUDIO_MESSAGE] = TextCtrl('setup_videoOverIp_h264_u_form', 'setup_videoOverIp_h264_u_transmissionType_unicastPortAudio_message_label', NPTZ_WORDING.wID_0240);
                LineCtrl('setup_videoOverIp_h264_u_main', 'horizontal', 653, 0, "", "setup_videoOverIp_h264_u_transmissionType_uniCastPortAudio_label", "97");

                // Multicast address
                txtH264Object[TXT_VIDEO_OVER_IP_H264_MULTI_CAST_ADDRESS] = TextCtrl('setup_videoOverIp_h264_u_label', 'setup_videoOverIp_h264_u_multiCastAddress_label', NPTZ_WORDING.wID_0242);
                txtH264InputObject[INPUT_VIDEO_OVER_IP_H264_MULTI_CAST_ADDRESS] = InputCtrl("setup_videoOverIp_h264_u_form", 'multicast_address', 'multicast_address', 'setup_videoOverIp_h264_u_multicastAddress_input', h264_multicast_addr);
                LineCtrl('setup_videoOverIp_h264_u_main', 'horizontal', 721, 0, "", "setup_videoOverIp_h264_u_multiCastAddress_label", "97");

                // Multicast port
                txtH264Object[TXT_VIDEO_OVER_IP_H264_MULTI_CAST_PORT] = TextCtrl('setup_videoOverIp_h264_u_label', 'setup_videoOverIp_h264_u_multiCastPort_label', NPTZ_WORDING.wID_0243);
                txtH264InputObject[INPUT_VIDEO_OVER_IP_H264_MULTI_CAST_PORT] = InputCtrl("setup_videoOverIp_h264_u_form", 'multicast_port', 'multicast_port', 'setup_videoOverIp_h264_u_multicastPort_input', h264_multicast_port, null, null, null, null, 5);
                // port 数字以外�E力できなぁE
                txtH264InputObject[INPUT_VIDEO_OVER_IP_H264_MULTI_CAST_PORT].getInputObject().keypress(filterNumber);
                txtH264Object[TXT_VIDEO_OVER_IP_H264_MULTI_CAST_PORT_MESSAGE] = TextCtrl('setup_videoOverIp_h264_u_form', 'setup_videoOverIp_h264_u_multiCastPort_message_label', NPTZ_WORDING.wID_0240);
                LineCtrl('setup_videoOverIp_h264_u_main', 'horizontal', 789, 0, "", "setup_videoOverIp_h264_u_multiCastPort_label", "97");

                // Multicast TTL/HOPLimit
                txtH264Object[TXT_VIDEO_OVER_IP_H264_MULTI_CAST_HTL_HOP_LIMIT] = TextCtrl('setup_videoOverIp_h264_u_label', 'setup_videoOverIp_h264_u_multiCastHTLHOPLimit_label', NPTZ_WORDING.wID_0244);
                txtH264InputObject[INPUT_VIDEO_OVER_IP_H264_MULTI_CAST_HTL_HOP_LIMIT] = InputCtrl("setup_videoOverIp_h264_u_form", 'multicast_HTLHOPLimit', 'multicast_HTLHOPLimit', 'setup_videoOverIp_h264_u_multicastHTLHOPLimit_input', h264_multicast_ttl, null, null, null, null, 3);
                txtH264InputObject[INPUT_VIDEO_OVER_IP_H264_MULTI_CAST_HTL_HOP_LIMIT].getInputObject().keypress(filterNumber);
                txtH264Object[TXT_VIDEO_OVER_IP_H264_MULTI_CAST_HTL_HOP_LIMIT_MESSAGE] = TextCtrl('setup_videoOverIp_h264_u_form', 'setup_videoOverIp_h264_u_multiHtlHopLimit_message_label', NPTZ_WORDING.wID_0245);

                h264_set_button = ButtonCtrl("setup_videoOverIp_h264_u_set_btn_area", "setup_videoOverIp_h264_u_set_button", NPTZ_WORDING.wID_0141, callbackH264SetButton);
                h264_set_button.getButtonObject().addClass('button_class');
                h264_set_button.show();
                h264_set_button.displayOff();
                for (var text in txtH264Object) {
                    txtH264Object[text].show();
                }
                for (var text in txtH264InputObject) {
                    txtH264InputObject[text].show();
                    txtH264InputObject[text].displayOff();
                }
                changeItemStatus();
            } else {
                rebuild(type);
            }
        }

        function rebuild(type) {
            transmissionRadioButtonGroup.setSelectedValue(h264_transmit);
            profileTypeRadioButtonGroup.setSelectedValue(h264_profile);
            selectH264ImageCaptureSize.refreshOptions(sysConst.getH264ImageCaptureSizeItems(currentType));
            selectH264ImageCaptureSize.val(h264_resolution);
            selectH264TransmissionPriority.val(h264_f_priority);
            selectH264FrameRate.refreshOptions(sysConst.getH264FrameRateItems(currentType, h264_resolution));
            selectH264FrameRate.val(h264_framerate);
            var h264BitRateOptions = sysConst.getH264BitRate(h264_resolution, h264_framerate);
            selectH264MaxBitRateMax.refreshOptions(h264BitRateOptions);
            selectH264MaxBitRateMax.val(h264_bandwidth);
            // selectH264MaxBitRateMin.refreshOptions(h264BitRateOptions);
            // selectH264MaxBitRateMin.val(h264_bandwidth_min);
            // selectH264ImageQuality.val(h264_quality);
            selectH264TransmissionType.val(h264_unimulti);
            for (var i = 0; i < txtH264InputObject.length; i++) {
                switch (i) {
                    case INPUT_VIDEO_OVER_IP_H264_TRANSMISSION_TYPE_UNI_CAST_PORT_IMAGE:
                        txtH264InputObject[i].val(h264_unicast_port);
                        break;
                    case INPUT_VIDEO_OVER_IP_H264_TRANSMISSION_TYPE_UNI_CAST_PORT_AUDIO:
                        txtH264InputObject[i].val(h264_unicast_audio_port);
                        break;
                    case INPUT_VIDEO_OVER_IP_H264_MULTI_CAST_ADDRESS:
                        txtH264InputObject[i].val(h264_multicast_addr);
                        break;
                    case INPUT_VIDEO_OVER_IP_H264_MULTI_CAST_PORT:
                        txtH264InputObject[i].val(h264_multicast_port);
                        break;
                    case INPUT_VIDEO_OVER_IP_H264_MULTI_CAST_HTL_HOP_LIMIT:
                        txtH264InputObject[i].val(h264_multicast_ttl);
                        break;
                }
            }
            changeItemStatus();
        }

        /**
         *
         */
        function changeItemStatus() {
            switch (sysCommon.streamingMode) {
                case CONST_STREAM_MODE_H264_UHD:
                    // selectH264TransmissionPriority.displayDisabled();
                    // selectH264TransmissionPriority.val('1');
                    selectH264FrameRate.displayOff();
                    // selectH264MaxBitRateMin.displayDisabled();
                    // selectH264ImageQuality.displayDisabled();
                    break;
                default:
                    // if (sysCommon.format == CONST_1080_23_98p_59_94i || sysCommon.frequency == CONST_23_98Hz || sysCommon.frequency == CONST_24Hz) {
                    //     selectH264TransmissionPriority.displayDisabled();
                    // } else {
                    //     selectH264TransmissionPriority.displayOff();
                    // }
                    if (selectH264TransmissionPriority.get() == '1') {
                        selectH264FrameRate.displayOff();
                        // selectH264MaxBitRateMin.displayDisabled();
                        // selectH264ImageQuality.displayDisabled();
                    } else if (selectH264TransmissionPriority.get() == '0') {
                        // if (selectH264FrameRate.get() == 60) {
                        //     selectH264FrameRate.val(30);
                        // }
                        // if (selectH264FrameRate.get() == 50) {
                        //     selectH264FrameRate.val(25);
                        // }
                        //selectH264FrameRate.displayDisabled();
                        // selectH264MaxBitRateMin.displayDisabled();
                        // selectH264ImageQuality.displayOff();
                    } else if (selectH264TransmissionPriority.get() == '2') {
                        if (selectH264FrameRate.get() == 60) {
                            selectH264FrameRate.val(30);
                        }
                        if (selectH264FrameRate.get() == 50) {
                            selectH264FrameRate.val(25);
                        }
                        selectH264FrameRate.displayDisabled();
                        // selectH264MaxBitRateMin.displayOff();
                        // selectH264ImageQuality.displayOff();
                    }
            }
            if (transmissionRadioButtonGroup.getSelectedValue() == 1) {
                selectH264ImageCaptureSize.displayOff();
                selectH264MaxBitRateMax.displayOff();
                // profileTypeRadioButtonGroup.displayOff();
                switch (selectH264TransmissionType.get()) {
                    case "uni":
                        for (var text in txtH264InputObject) {
                            txtH264InputObject[text].displayDisabled();
                        }
                        break;
                    case "uni_manual":
                        txtH264InputObject[INPUT_VIDEO_OVER_IP_H264_TRANSMISSION_TYPE_UNI_CAST_PORT_IMAGE].displayOff();
                        txtH264InputObject[INPUT_VIDEO_OVER_IP_H264_TRANSMISSION_TYPE_UNI_CAST_PORT_AUDIO].displayOff();
                        txtH264InputObject[INPUT_VIDEO_OVER_IP_H264_MULTI_CAST_ADDRESS].displayDisabled();
                        txtH264InputObject[INPUT_VIDEO_OVER_IP_H264_MULTI_CAST_PORT].displayDisabled();
                        txtH264InputObject[INPUT_VIDEO_OVER_IP_H264_MULTI_CAST_HTL_HOP_LIMIT].displayDisabled();
                        break;
                    case "multi":
                        txtH264InputObject[INPUT_VIDEO_OVER_IP_H264_TRANSMISSION_TYPE_UNI_CAST_PORT_IMAGE].displayDisabled();
                        txtH264InputObject[INPUT_VIDEO_OVER_IP_H264_TRANSMISSION_TYPE_UNI_CAST_PORT_AUDIO].displayDisabled();
                        txtH264InputObject[INPUT_VIDEO_OVER_IP_H264_MULTI_CAST_ADDRESS].displayOff();
                        txtH264InputObject[INPUT_VIDEO_OVER_IP_H264_MULTI_CAST_PORT].displayOff();
                        txtH264InputObject[INPUT_VIDEO_OVER_IP_H264_MULTI_CAST_HTL_HOP_LIMIT].displayOff();
                        break;
                }
            } else {
                selectH264ImageCaptureSize.displayDisabled();
                selectH264TransmissionPriority.displayDisabled();
                profileTypeRadioButtonGroup.displayDisabled();
                selectH264FrameRate.displayDisabled();
                selectH264MaxBitRateMax.displayDisabled();
                // selectH264MaxBitRateMin.displayDisabled();
                // selectH264ImageQuality.displayDisabled();
                selectH264TransmissionType.displayDisabled();
                for (var text in txtH264InputObject) {
                    txtH264InputObject[text].displayDisabled();
                }
            }
        }

        /**
         *
         */
        function callbackH264ImageCaptureSize() {
            selectH264FrameRate.refreshOptions(sysConst.getH264FrameRateItems(currentType, selectH264ImageCaptureSize.get()));
            selectH264FrameRate.val(h264_framerate);
            var h264BitRateOptions = sysConst.getH264BitRate(selectH264ImageCaptureSize.get(), selectH264FrameRate.get());
            selectH264MaxBitRateMax.refreshOptions(h264BitRateOptions);
            selectH264MaxBitRateMax.val(getMaxBitRateMaxToSet(h264BitRateOptions, h264_bandwidth));
            // selectH264MaxBitRateMin.refreshOptions(h264BitRateOptions);
            // selectH264MaxBitRateMin.val(h264_bandwidth_min);
        }

        /**
         *
         */
        function callbackH264FrameRate() {
            var h264BitRateOptions = sysConst.getH264BitRate(selectH264ImageCaptureSize.get(), selectH264FrameRate.get());
            selectH264MaxBitRateMax.refreshOptions(h264BitRateOptions);
            selectH264MaxBitRateMax.val(getMaxBitRateMaxToSet(h264BitRateOptions, h264_bandwidth));
            // selectH264MaxBitRateMin.refreshOptions(h264BitRateOptions);
            // selectH264MaxBitRateMin.val(h264_bandwidth_min);
        }

        /**
         *
         */
        function callbackTransmissionPriority() {
            changeItemStatus();
        }

        /**
         *
         */
        function callbackH264Transmission() {
            changeItemStatus();
        }

        function callbackH264ProfileType() {
            const imageSize = selectH264ImageCaptureSize.get();
            const frameRate = selectH264FrameRate.get();
            h264_profile = profileTypeRadioButtonGroup.getSelectedValue();
            const sizeArr = sysConst.getH264ImageCaptureSizeItems(currentType, h264_profile);
            selectH264ImageCaptureSize.refreshOptions(sizeArr);
            selectH264FrameRate.refreshOptions(sysConst.getH264FrameRateItems(currentType, selectH264ImageCaptureSize.get()));
            selectH264FrameRate.val(frameRate);
            for (let key in sizeArr) {
                if (sizeArr[key] == imageSize) {
                    selectH264ImageCaptureSize.val(imageSize);
                    break;
                }
            }


            // if($.inArray(sizeArr,h264_resolution)){
            //     selectH264ImageCaptureSize.val(h264_resolution);
            // }else{
            //     selectH264ImageCaptureSize.val(sizeArr[0]);
            // }
            //h264_resolution = "1280";
            //changeItemStatus();

            //if(currentType >= 3 && h264_profile!="high") h264_resolution = 1280;


            //callbackH264ImageCaptureSize();
        }


        /**
         *
         */
        function callbackH264TransmissionType() {
            changeItemStatus();
        }

        /**
         *
         */
        function callbackH264SetButton(mouse) {
            if (mouse == Button.MOUSE_DOWN) {
                if (!checkAllInput()) {
                    return;
                }
                if (!checkBitRateTotal('H264_' + currentType, selectH264MaxBitRateMax.get() / 1000)) {
                    jAlert(MSG_STATUS.mID_0075, NPTZ_WORDING.wID_0039);
                    rebuild(currentType);
                    return;
                }
                $("#dialog_setup").show();
                $.ajax({
                    type: "post",
                    url: getH264CgiUrl(currentType),
                    data: getH264SettingData(currentType),
                    success: function (data) {
                        initVideoOverIPMenuStatus(getStreamMode());
                        setTimeout(function () {
                            $("#dialog_setup").hide();
                        }, 500);
                    },
                    error: function (jqXHR, textStatus, errorThrown) {
                        setTimeout(function () {
                            $("#dialog_setup").hide();
                        }, 500);
                    }
                });

            }
        }

        function checkAllInput() {
            if (selectH264TransmissionType.get() == 'uni_manual') {
                if (!CheckPort(txtH264InputObject[INPUT_VIDEO_OVER_IP_H264_TRANSMISSION_TYPE_UNI_CAST_PORT_IMAGE].get())) {
                    objErrCode = MSG_STATUS.mID_0009;
                    return capi_DispError(txtH264InputObject[INPUT_VIDEO_OVER_IP_H264_TRANSMISSION_TYPE_UNI_CAST_PORT_IMAGE].getInputObject(), objErrCode);
                }
                if (!CheckPort(txtH264InputObject[INPUT_VIDEO_OVER_IP_H264_TRANSMISSION_TYPE_UNI_CAST_PORT_AUDIO].get())) {
                    objErrCode = MSG_STATUS.mID_0009;
                    return capi_DispError(txtH264InputObject[INPUT_VIDEO_OVER_IP_H264_TRANSMISSION_TYPE_UNI_CAST_PORT_AUDIO].getInputObject(), objErrCode);
                }
                if (!CheckNum(txtH264InputObject[INPUT_VIDEO_OVER_IP_H264_TRANSMISSION_TYPE_UNI_CAST_PORT_IMAGE].get())) {
                    objErrCode = MSG_STATUS.mID_0009;
                    return capi_DispError(txtH264InputObject[INPUT_VIDEO_OVER_IP_H264_TRANSMISSION_TYPE_UNI_CAST_PORT_IMAGE].getInputObject(), objErrCode);
                }
                if (!CheckNum(txtH264InputObject[INPUT_VIDEO_OVER_IP_H264_TRANSMISSION_TYPE_UNI_CAST_PORT_AUDIO].get())) {
                    objErrCode = MSG_STATUS.mID_0009;
                    return capi_DispError(txtH264InputObject[INPUT_VIDEO_OVER_IP_H264_TRANSMISSION_TYPE_UNI_CAST_PORT_AUDIO].getInputObject(), objErrCode);
                }
                if (txtH264InputObject[INPUT_VIDEO_OVER_IP_H264_TRANSMISSION_TYPE_UNI_CAST_PORT_IMAGE].get() == 10670) {
                    objErrCode = MSG_STATUS.mID_0026;
                    return capi_DispError(txtH264InputObject[INPUT_VIDEO_OVER_IP_H264_TRANSMISSION_TYPE_UNI_CAST_PORT_IMAGE].getInputObject(), objErrCode);
                }
                if (txtH264InputObject[INPUT_VIDEO_OVER_IP_H264_TRANSMISSION_TYPE_UNI_CAST_PORT_AUDIO].get() == 10670) {
                    objErrCode = MSG_STATUS.mID_0026;
                    return capi_DispError(txtH264InputObject[INPUT_VIDEO_OVER_IP_H264_TRANSMISSION_TYPE_UNI_CAST_PORT_AUDIO].getInputObject(), objErrCode);
                }
            }
            else if (selectH264TransmissionType.get() == 'multi') {
                if (!chknet_CheckMultiAddr(txtH264InputObject[INPUT_VIDEO_OVER_IP_H264_MULTI_CAST_ADDRESS].get())) {
                    return capi_DispError(txtH264InputObject[INPUT_VIDEO_OVER_IP_H264_MULTI_CAST_ADDRESS].getInputObject(), objErrCode);
                }
                if (!CheckPort(txtH264InputObject[INPUT_VIDEO_OVER_IP_H264_MULTI_CAST_PORT].get())) {
                    objErrCode = MSG_STATUS.mID_0009;
                    return capi_DispError(txtH264InputObject[INPUT_VIDEO_OVER_IP_H264_MULTI_CAST_PORT].getInputObject(), objErrCode);
                }
                if (!CheckNum(txtH264InputObject[INPUT_VIDEO_OVER_IP_H264_MULTI_CAST_PORT].get())) {
                    objErrCode = MSG_STATUS.mID_0009;
                    return capi_DispError(txtH264InputObject[INPUT_VIDEO_OVER_IP_H264_MULTI_CAST_PORT].getInputObject(), objErrCode);
                }
                if (txtH264InputObject[INPUT_VIDEO_OVER_IP_H264_MULTI_CAST_PORT].get() == 10670) {
                    objErrCode = MSG_STATUS.mID_0026;
                    return capi_DispError(txtH264InputObject[INPUT_VIDEO_OVER_IP_H264_MULTI_CAST_PORT].getInputObject(), objErrCode);
                }
                if (!CheckNum(txtH264InputObject[INPUT_VIDEO_OVER_IP_H264_MULTI_CAST_HTL_HOP_LIMIT].get())) {
                    objErrCode = MSG_STATUS.mID_0009;
                    return capi_DispError(txtH264InputObject[INPUT_VIDEO_OVER_IP_H264_MULTI_CAST_HTL_HOP_LIMIT].getInputObject(), objErrCode);
                }
                if ((txtH264InputObject[INPUT_VIDEO_OVER_IP_H264_MULTI_CAST_HTL_HOP_LIMIT].get() < 1) || (txtH264InputObject[INPUT_VIDEO_OVER_IP_H264_MULTI_CAST_HTL_HOP_LIMIT].get() > 254)) {
                    objErrCode = MSG_STATUS.mID_0009;
                    return capi_DispError(txtH264InputObject[INPUT_VIDEO_OVER_IP_H264_MULTI_CAST_HTL_HOP_LIMIT].getInputObject(), objErrCode);
                }
            }
            return true;
        }

        function getH264CgiUrl(type) {
            var ret = null;
            if (type == 1) {
                ret = "/cgi-bin/set_h264";
            } else {
                ret = "/cgi-bin/set_h264_" + type;
            }
            return ret;
        }

        function getH264SettingData(type) {
            var data = {};
            if (!transmissionRadioButtonGroup.isDisabled()) {
                data['h264_transmit'] = transmissionRadioButtonGroup.getSelectedValue();
            }
            if (selectH264ImageCaptureSize.getStatus() != Select.STATUS_DISABLED) {
                data['h264_resolution'] = selectH264ImageCaptureSize.get();
            }
            if (selectH264TransmissionPriority.getStatus() != Select.STATUS_DISABLED) {
                data['f_priority'] = selectH264TransmissionPriority.get();
            }
            if (selectH264FrameRate.getStatus() != Select.STATUS_DISABLED) {
                data['framerate'] = selectH264FrameRate.get();
            }
            if (selectH264MaxBitRateMax.getStatus() != Select.STATUS_DISABLED) {
                data['h264_bandwidth'] = selectH264MaxBitRateMax.get();
            }
            data['profile'] = profileTypeRadioButtonGroup.getSelectedValue();
            // if (selectH264MaxBitRateMin.getStatus() != Select.STATUS_DISABLED) {
            //     data['h264_bandwidth_min'] = selectH264MaxBitRateMin.get();
            // }
            // if (selectH264ImageQuality.getStatus() != Select.STATUS_DISABLED) {
            //     data['h264_quality'] = selectH264ImageQuality.get();
            // }
            if (selectH264TransmissionType.getStatus() != Select.STATUS_DISABLED) {
                data['h264_unimulti'] = selectH264TransmissionType.get();
            }
            if (txtH264InputObject[INPUT_VIDEO_OVER_IP_H264_TRANSMISSION_TYPE_UNI_CAST_PORT_IMAGE].getStatus() != Input.STATUS_DISABLED) {
                data['unicast_port'] = txtH264InputObject[INPUT_VIDEO_OVER_IP_H264_TRANSMISSION_TYPE_UNI_CAST_PORT_IMAGE].get();
            }
            if (txtH264InputObject[INPUT_VIDEO_OVER_IP_H264_TRANSMISSION_TYPE_UNI_CAST_PORT_AUDIO].getStatus() != Input.STATUS_DISABLED) {
                data['unicast_audio_port'] = txtH264InputObject[INPUT_VIDEO_OVER_IP_H264_TRANSMISSION_TYPE_UNI_CAST_PORT_AUDIO].get();
            }
            if (txtH264InputObject[INPUT_VIDEO_OVER_IP_H264_MULTI_CAST_ADDRESS].getStatus() != Input.STATUS_DISABLED) {
                data['multicast_addr'] = txtH264InputObject[INPUT_VIDEO_OVER_IP_H264_MULTI_CAST_ADDRESS].get();
            }
            if (txtH264InputObject[INPUT_VIDEO_OVER_IP_H264_MULTI_CAST_PORT].getStatus() != Input.STATUS_DISABLED) {
                data['multicast_port'] = txtH264InputObject[INPUT_VIDEO_OVER_IP_H264_MULTI_CAST_PORT].get();
            }
            if (txtH264InputObject[INPUT_VIDEO_OVER_IP_H264_MULTI_CAST_HTL_HOP_LIMIT].getStatus() != Input.STATUS_DISABLED) {
                data['multicast_ttl'] = txtH264InputObject[INPUT_VIDEO_OVER_IP_H264_MULTI_CAST_HTL_HOP_LIMIT].get();
            }
            return data;
        }

        return {
            build: function (type) {
                return buildH264(type);
            }
        }
    }


    /**
     * settingH265画面:settingJPEG制御に関わる画面クラス
     * @class settingH265画面:settingJPEG制御に関わる画面クラス
     * @return {{build: buildH265, rebuild: rebuild}} build 構築�E琁E
     * @return {function} rebuild 再構築�E琁E
     * @constructor
     */
    function settingH265() {
        /**
         * 構築フラグ
         * @type boolean
         */
        let buildFlag_H265 = false;
        /**
         * H265を記録する
         */
        let currentType = 1;
        /**
         * label定義
         * @type number
         */
        const TXT_VIDEO_OVER_IP_JPEG_H265_TRANSMISSION = 0;
        const TXT_VIDEO_OVER_IP_H265_IMAGE_CAPTURE_SIZE = 1;
        const TXT_VIDEO_OVER_IP_H265_TRANSMISSION_PRIORITY = 2;
        const TXT_VIDEO_OVER_IP_H265_FRAME_RATE = 3;
        const TXT_VIDEO_OVER_IP_H265_MAX_BIT_RATE = 4;
        const TXT_VIDEO_OVER_IP_H265_MAX_BIT_RATE_MAX = 6;
        const TXT_VIDEO_OVER_IP_H265_TRANSMISSION_TYPE = 10;
        const TXT_VIDEO_OVER_IP_H265_UNI_CAST_PORT_IMAGE = 11;
        const TXT_VIDEO_OVER_IP_H265_UNI_CAST_PORT_IMAGE_MESSAGE = 12;
        const TXT_VIDEO_OVER_IP_H265_UNI_CAST_PORT_AUDIO = 13;//    Unicast port(Audio)
        const TXT_VIDEO_OVER_IP_H265_UNI_CAST_PORT_AUDIO_MESSAGE = 14;
        const TXT_VIDEO_OVER_IP_H265_MULTI_CAST_ADDRESS = 15;
        const TXT_VIDEO_OVER_IP_H265_MULTI_CAST_PORT = 16;
        const TXT_VIDEO_OVER_IP_H265_MULTI_CAST_PORT_MESSAGE = 17;
        const TXT_VIDEO_OVER_IP_H265_MULTI_CAST_HTL_HOP_LIMIT = 18;
        const TXT_VIDEO_OVER_IP_H265_MULTI_CAST_HTL_HOP_LIMIT_MESSAGE = 19;
        let selectH265ImageCaptureSize;
        let selectH265TransmissionPriority;
        let selectH265FrameRate;
        let selectH265MaxBitRateMax;
        let selectH265TransmissionType;
        let txtH265Object = [];
        let H265_transmit;
        let H265_rtsp_mode;
        let H265_resolution;
        let H265_f_priority;
        let H265_framerate;
        let H265_bandwidth;
        let H265_quality;
        let H265_unimulti;
        let H265_unicast_port;
        let H265_unicast_audio_port;
        let H265_multicast_addr;
        let H265_multicast_port;
        let H265_multicast_ttl;


        /**
         * input[] : text
         * @type txtH265InputObject[]
         */
        let txtH265InputObject = [];
        const INPUT_VIDEO_OVER_IP_H265_TRANSMISSION_TYPE_UNI_CAST_PORT_IMAGE = 0;
        const INPUT_VIDEO_OVER_IP_H265_TRANSMISSION_TYPE_UNI_CAST_PORT_AUDIO = 1;
        const INPUT_VIDEO_OVER_IP_H265_MULTI_CAST_ADDRESS = 2;
        const INPUT_VIDEO_OVER_IP_H265_MULTI_CAST_PORT = 3;
        const INPUT_VIDEO_OVER_IP_H265_MULTI_CAST_HTL_HOP_LIMIT = 4;
        let transmissionRadioButtonGroup;
        let H265_set_button;
        let h265BitRateOptions;

        function getCurrentValueOfH265(type) {
            objVOIP = cparam_getVideoOverIpInfo();
            if (type == 3) {
                type = 1;
            }
            H265_transmit = objVOIP["h265_transmit_ch" + type];
            H265_rtsp_mode = objVOIP["h265_rtsp_mode_ch" + type];
            H265_resolution = objVOIP["h265_resolution_ch" + type];
            H265_f_priority = objVOIP["h265_f_priority_ch" + type];
            H265_framerate = objVOIP["h265_framerate_ch" + type];
            H265_bandwidth = objVOIP["h265_bandwidth_ch" + type];
            H265_quality = objVOIP["h265_quality_ch" + type];
            H265_unimulti = objVOIP["h265_unimulti_ch" + type];
            H265_unicast_port = objVOIP["h265_unicast_port_ch" + type];
            H265_unicast_audio_port = objVOIP["h265_unicast_audio_port_ch" + type];
            H265_multicast_addr = objVOIP["h265_multicast_addr_ch" + type];
            H265_multicast_port = objVOIP["h265_multicast_port_ch" + type];
            H265_multicast_ttl = objVOIP["h265_multicast_ttl_ch" + type];
        }

        function buildH265(type) {
            currentType = type;
            getCurrentValueOfH265(type);
            if (!buildFlag_H265) {
                buildFlag_H265 = true;
                // H.265 transmission
                txtH265Object[TXT_VIDEO_OVER_IP_JPEG_H265_TRANSMISSION] = TextCtrl('setup_videoOverIp_h265_label', 'setup_videoOverIp_h265_transmission_label', NPTZ_WORDING.wID_0246);
                // H.265 transmission radioButtonItems
                transmissionRadioButtonGroup = RadioButtonGroupCtrl("setup_videoOverIp_h265_form", "setup_videoOverIp_h265_transmission_", RADIO_GROUP.rID_0001, H265_transmit, callbackH265Transmission);
                LineCtrl('setup_videoOverIp_h265_main', 'horizontal', 73, 0, 1320, "setup_videoOverIp_h265_transmission_label", "83");

                // image capture size
                txtH265Object[TXT_VIDEO_OVER_IP_H265_IMAGE_CAPTURE_SIZE] = TextCtrl('setup_videoOverIp_h265_label', 'setup_videoOverIp_h265_imageCaptureSize_label', NPTZ_WORDING.wID_0102);
                selectH265ImageCaptureSize = SelectCtrl('setup_videoOverIp_h265_form', "", "setup_videoOverIp_h265_imageCaptureSize_select", "setup_videoOverIp_h265_imageCaptureSize_select", callbackH265MaxBitRateMax, type, sysConst.getH265UHDImageCaptureSizeItems(), H265_resolution);
                if (type == 3) {
                    selectH265ImageCaptureSize.refreshOptions(sysConst.getH265UHDImageCaptureSizeItems());
                } else if (type == 1) {
                    selectH265ImageCaptureSize.refreshOptions(sysConst.getH265ImageCaptureSizeItemsCh1());
                } else {
                    selectH265ImageCaptureSize.refreshOptions(sysConst.getH265ImageCaptureSizeItemsCh2());
                }
                selectH265ImageCaptureSize.show();
                LineCtrl('setup_videoOverIp_h265_main', 'horizontal', 141, 0, 1320, "setup_videoOverIp_h265_imageCaptureSize_label", "83");
                // Transmission priority
                txtH265Object[TXT_VIDEO_OVER_IP_H265_TRANSMISSION_PRIORITY] = TextCtrl('setup_videoOverIp_h265_label', 'setup_videoOverIp_h265_transmission_priority_label', NPTZ_WORDING.wID_0726);
                selectH265TransmissionPriority = SelectCtrl('setup_videoOverIp_h265_form', "", "setup_videoOverIp_h265_transmission_priority_select", "setup_videoOverIp_h265_transmission_priority_select", callbackTransmissionPriority, '', TRANSMISSION_PRIORITY_OPTIONS, H265_f_priority);
                selectH265TransmissionPriority.show();
                selectH265TransmissionPriority.displayOn();
                LineCtrl('setup_videoOverIp_h265_main', 'horizontal', 209, 0, 1320, "setup_videoOverIp_h265_transmission_priority_label", "83");
                // Frame rate

                txtH265Object[TXT_VIDEO_OVER_IP_H265_FRAME_RATE] = TextCtrl('setup_videoOverIp_h265_label', 'setup_videoOverIp_h265_frame_rate_label', NPTZ_WORDING.wID_0105);
                selectH265FrameRate = SelectCtrl('setup_videoOverIp_h265_form', "", "setup_videoOverIp_h265_frame_rate_select", "setup_videoOverIp_h265_frame_rate_select", callbackH265FrameRate, type, sysConst.getH264FrameRateItems(type == 3 ? 1 : type, H265_resolution), H265_framerate);
                if (type == 3) {
                    selectH265FrameRate.refreshOptions(sysConst.getH264FrameRateItems("1", H265_resolution));
                } else if (type == 1) {
                    selectH265FrameRate.refreshOptions(sysConst.getH264FrameRateItems(type, H265_resolution));
                    selectH265FrameRate.val(H265_framerate);
                } else {
                    selectH265FrameRate.refreshOptions(sysConst.getH264FrameRateItems(type, H265_resolution));
                    selectH265FrameRate.val(H265_framerate);
                }
                selectH265FrameRate.show();
                selectH265FrameRate.displayOn();
                LineCtrl('setup_videoOverIp_h265_main', 'horizontal', 209, 0, 1320, "setup_videoOverIp_h265_frame_rate_label", "83");

                // Max bit rate(per client)
                //0220
                h265BitRateOptions = sysConst.getH264BitRate(H265_resolution, H265_framerate);
                txtH265Object[TXT_VIDEO_OVER_IP_H265_MAX_BIT_RATE] = TextCtrl('setup_videoOverIp_h265_label', 'setup_videoOverIp_h265_maxBitRate_label', NPTZ_WORDING.wID_0107);
                txtH265Object[TXT_VIDEO_OVER_IP_H265_MAX_BIT_RATE_MAX] = TextCtrl('setup_videoOverIp_h265_form', 'setup_videoOverIp_h265_maxBitRate_max_label', NPTZ_WORDING.wID_0237);
                selectH265MaxBitRateMax = SelectCtrl('setup_videoOverIp_h265_form', "", "setup_videoOverIp_h265_max_bit_rate_max_select", "setup_videoOverIp_h265_max_bit_rate_max_select", "", '', h265BitRateOptions, H265_bandwidth);
                selectH265MaxBitRateMax.show();
                selectH265MaxBitRateMax.displayOn();
                LineCtrl('setup_videoOverIp_h265_main', 'horizontal', 277, 0, 1320, "setup_videoOverIp_h265_maxBitRate_dash_label", "83");

                // Transmission type
                txtH265Object[TXT_VIDEO_OVER_IP_H265_TRANSMISSION_TYPE] = TextCtrl('setup_videoOverIp_h265_label', 'setup_videoOverIp_h265_transmissionType_label', NPTZ_WORDING.wID_0101);
                selectH265TransmissionType = SelectCtrl('setup_videoOverIp_h265_form', "", "setup_videoOverIp_h265_transmission_type_quality_select", "setup_videoOverIp_h265_transmission_type_quality_select", callbackH265TransmissionType, '', H265_TRANSMISSION_TYPE, H265_unimulti);
                selectH265TransmissionType.show();
                selectH265TransmissionType.displayOn();
                LineCtrl('setup_videoOverIp_h265_main', 'vertical', 345, 37, 100, "setup_videoOverIp_h265_transmissionType_label", "81.5");
                LineCtrl('setup_videoOverIp_h265_main', 'horizontal', 345, 50, 1320, "setup_videoOverIp_h265_transmission_type_quality_select", "81.5");
                txtH265Object[TXT_VIDEO_OVER_IP_H265_UNI_CAST_PORT_IMAGE] = TextCtrl('setup_videoOverIp_h265_label', 'setup_videoOverIp_h265_transmissionType_unicastPortImage_label', NPTZ_WORDING.wID_0239);
                txtH265InputObject[INPUT_VIDEO_OVER_IP_H265_TRANSMISSION_TYPE_UNI_CAST_PORT_IMAGE] = InputCtrl("setup_videoOverIp_h265_form", 'unicast_image_port', 'unicast_image_port', 'setup_videoOverIp_h265_transmissionType_unicastPortImage_input', H265_unicast_port, null, null, null, null, 5);
                // port 数字以外�E力できなぁE
                txtH265InputObject[INPUT_VIDEO_OVER_IP_H265_TRANSMISSION_TYPE_UNI_CAST_PORT_IMAGE].getInputObject().keypress(filterNumber);
                txtH265Object[TXT_VIDEO_OVER_IP_H265_UNI_CAST_PORT_IMAGE_MESSAGE] = TextCtrl('setup_videoOverIp_h265_form', 'setup_videoOverIp_h265_transmissionType_unicastPortImage_message_label', NPTZ_WORDING.wID_0240);
                LineCtrl('setup_videoOverIp_h265_main', 'horizontal', 405, 50, 1320, "setup_videoOverIp_h265_transmissionType_unicastPortImage_message_label", "81.5");
                txtH265Object[TXT_VIDEO_OVER_IP_H265_UNI_CAST_PORT_AUDIO] = TextCtrl('setup_videoOverIp_h265_label', 'setup_videoOverIp_h265_transmissionType_unicastPortAudio_label', NPTZ_WORDING.wID_0241);
                txtH265InputObject[INPUT_VIDEO_OVER_IP_H265_TRANSMISSION_TYPE_UNI_CAST_PORT_AUDIO] = InputCtrl("setup_videoOverIp_h265_form", 'unicast_audio_port', 'unicast_audio_port', 'setup_videoOverIp_h265_transmissionType_unicastPortAudio_input', H265_unicast_audio_port, null, null, null, null, 5);
                // port 数字以外�E力できなぁE
                txtH265InputObject[INPUT_VIDEO_OVER_IP_H265_TRANSMISSION_TYPE_UNI_CAST_PORT_AUDIO].getInputObject().keypress(filterNumber);
                txtH265Object[TXT_VIDEO_OVER_IP_H265_UNI_CAST_PORT_AUDIO_MESSAGE] = TextCtrl('setup_videoOverIp_h265_form', 'setup_videoOverIp_h265_transmissionType_unicastPortAudio_message_label', NPTZ_WORDING.wID_0240);
                LineCtrl('setup_videoOverIp_h265_main', 'horizontal', 457, 0, 1320, "setup_videoOverIp_h265_transmissionType_unicastPortAudio_message_label", "83");

                // Multicast address
                txtH265Object[TXT_VIDEO_OVER_IP_H265_MULTI_CAST_ADDRESS] = TextCtrl('setup_videoOverIp_h265_label', 'setup_videoOverIp_h265_multicastAddress_label', NPTZ_WORDING.wID_0242);
                txtH265InputObject[INPUT_VIDEO_OVER_IP_H265_MULTI_CAST_ADDRESS] = InputCtrl("setup_videoOverIp_h265_form", 'multicast_address', 'multicast_address', 'setup_videoOverIp_h265_multicastAddress_input', H265_multicast_addr);
                LineCtrl('setup_videoOverIp_h265_main', 'horizontal', 525, 0, 1320, "setup_videoOverIp_h265_multicastAddress_label", "83");

                // Multicast port
                txtH265Object[TXT_VIDEO_OVER_IP_H265_MULTI_CAST_PORT] = TextCtrl('setup_videoOverIp_h265_label', 'setup_videoOverIp_h265_multicastPort_label', NPTZ_WORDING.wID_0243);
                txtH265InputObject[INPUT_VIDEO_OVER_IP_H265_MULTI_CAST_PORT] = InputCtrl("setup_videoOverIp_h265_form", 'multicast_port', 'multicast_port', 'setup_videoOverIp_h265_multicastPort_input', H265_multicast_port, null, null, null, null, 5);
                // port 数字以外�E力できなぁE
                txtH265InputObject[INPUT_VIDEO_OVER_IP_H265_MULTI_CAST_PORT].getInputObject().keypress(filterNumber);
                txtH265Object[TXT_VIDEO_OVER_IP_H265_MULTI_CAST_PORT_MESSAGE] = TextCtrl('setup_videoOverIp_h265_form', 'setup_videoOverIp_h265_multiCastPort_message_label', NPTZ_WORDING.wID_0240);
                LineCtrl('setup_videoOverIp_h265_main', 'horizontal', 593, 0, 1320, "setup_videoOverIp_h265_multiCastPort_message_label", "83");

                // Multicast TTL/HOPLimit
                txtH265Object[TXT_VIDEO_OVER_IP_H265_MULTI_CAST_HTL_HOP_LIMIT] = TextCtrl('setup_videoOverIp_h265_label', 'setup_videoOverIp_h265_multicastHTLHOPLimit_label', NPTZ_WORDING.wID_0244);
                txtH265InputObject[INPUT_VIDEO_OVER_IP_H265_MULTI_CAST_HTL_HOP_LIMIT] = InputCtrl("setup_videoOverIp_h265_form", 'multicast_HTLHOPLimit', 'multicast_HTLHOPLimit', 'setup_videoOverIp_h265_multicastHTLHOPLimit_input', H265_multicast_ttl, null, null, null, null, 3);
                txtH265InputObject[INPUT_VIDEO_OVER_IP_H265_MULTI_CAST_HTL_HOP_LIMIT].getInputObject().keypress(filterNumber);
                txtH265Object[TXT_VIDEO_OVER_IP_H265_MULTI_CAST_HTL_HOP_LIMIT_MESSAGE] = TextCtrl('setup_videoOverIp_h265_form', 'setup_videoOverIp_h265_multiHtlHopLimit_message_label', NPTZ_WORDING.wID_0245);
                LineCtrl('setup_videoOverIp_h265_main', 'horizontal', 661, 0, 1320, "setup_videoOverIp_h265_multiHtlHopLimit_message_label", "83");

                H265_set_button = ButtonCtrl("setup_videoOverIp_h265_set_btn_area", "setup_videoOverIp_h265_set_button", NPTZ_WORDING.wID_0141, callbackH265SetButton);
                H265_set_button.getButtonObject().addClass('button_class');
                H265_set_button.show();
                H265_set_button.displayOff();
                for (var text in txtH265Object) {
                    txtH265Object[text].show();
                }
                for (var text in txtH265InputObject) {
                    txtH265InputObject[text].show();
                    txtH265InputObject[text].displayOff();
                }
                changeItemStatus();
            } else {
                rebuild(type);
            }
        }

        function rebuild(type) {
            getCurrentValueOfH265(type);
            if (type == 3) {
                selectH265ImageCaptureSize.refreshOptions(sysConst.getH265UHDImageCaptureSizeItems());
                selectH265FrameRate.refreshOptions(sysConst.getH264FrameRateItems("1", H265_resolution));
            } else if (type == 1) {
                selectH265ImageCaptureSize.refreshOptions(sysConst.getH265ImageCaptureSizeItemsCh1());
                selectH265FrameRate.refreshOptions(sysConst.getH264FrameRateItems(type, H265_resolution));
            } else {
                selectH265ImageCaptureSize.refreshOptions(sysConst.getH265ImageCaptureSizeItemsCh2());
                selectH265FrameRate.refreshOptions(sysConst.getH264FrameRateItems(type, H265_resolution));
            }

            transmissionRadioButtonGroup.setSelectedValue(H265_transmit);
            selectH265ImageCaptureSize.val(H265_resolution);
            selectH265FrameRate.val(H265_framerate);
            selectH265TransmissionPriority.val(H265_f_priority);
            //0220
            h265BitRateOptions = sysConst.getH264BitRate(H265_resolution, H265_framerate);
            selectH265MaxBitRateMax.refreshOptions(h265BitRateOptions);
            selectH265MaxBitRateMax.val(H265_bandwidth);
            selectH265TransmissionType.val(H265_unimulti);
            for (let i = 0; i < txtH265InputObject.length; i++) {
                switch (i) {
                    case INPUT_VIDEO_OVER_IP_H265_TRANSMISSION_TYPE_UNI_CAST_PORT_IMAGE:
                        txtH265InputObject[i].val(H265_unicast_port);
                        break;
                    case INPUT_VIDEO_OVER_IP_H265_TRANSMISSION_TYPE_UNI_CAST_PORT_AUDIO:
                        txtH265InputObject[i].val(H265_unicast_audio_port);
                        break;
                    case INPUT_VIDEO_OVER_IP_H265_MULTI_CAST_ADDRESS:
                        txtH265InputObject[i].val(H265_multicast_addr);
                        break;
                    case INPUT_VIDEO_OVER_IP_H265_MULTI_CAST_PORT:
                        txtH265InputObject[i].val(H265_multicast_port);
                        break;
                    case INPUT_VIDEO_OVER_IP_H265_MULTI_CAST_HTL_HOP_LIMIT:
                        txtH265InputObject[i].val(H265_multicast_ttl);
                        break;
                }
            }
            changeItemStatus();
        }

        function callbckH265() {

        }
        /**
         *
         */
        function callbackTransmissionPriority() {
            changeItemStatus();
        }

        function callbackH265FrameRate(mouse, type) {
            const imageSize = selectH265ImageCaptureSize.get();
            const imageFrame = selectH265FrameRate.get();
            //0220
            h265BitRateOptions = sysConst.getH264BitRate(imageSize, imageFrame);
            selectH265MaxBitRateMax.refreshOptions(h265BitRateOptions);
        }

        function callbackH265MaxBitRateMax(mouse) {
            const imageSize = selectH265ImageCaptureSize.get();
            if (currentType == 3) {
                selectH265FrameRate.refreshOptions(sysConst.getH264FrameRateItems("1", imageSize));
            } else if (currentType == 1) {
                selectH265FrameRate.refreshOptions(sysConst.getH264FrameRateItems(currentType, imageSize));
            } else {
                selectH265FrameRate.refreshOptions(sysConst.getH264FrameRateItems(currentType, imageSize));
            }
            const imageFrame = selectH265FrameRate.get();
            //0220
            h265BitRateOptions = sysConst.getH264BitRate(imageSize, imageFrame);
            selectH265MaxBitRateMax.refreshOptions(h265BitRateOptions);
            //selectH265MaxBitRateMax.val(H265_bandwidth);

            // var h264BitRateOptions = sysConst.getH264BitRate(selectH264ImageCaptureSize.get(), selectH264FrameRate.get());
            // selectH264MaxBitRateMax.refreshOptions(h264BitRateOptions);
            // selectH264MaxBitRateMax.val(getMaxBitRateMaxToSet(h264BitRateOptions, h264_bandwidth));
            // selectH264MaxBitRateMin.refreshOptions(h264BitRateOptions);
            // selectH264MaxBitRateMin.val(h264_bandwidth_min);
        }

        /**
         *
         */
        function changeItemStatus() {
            if (transmissionRadioButtonGroup.getSelectedValue() == 1) {
                selectH265ImageCaptureSize.displayOff();
                selectH265TransmissionPriority.displayOff();
                selectH265MaxBitRateMax.displayOff();
                selectH265TransmissionType.displayOff();
                selectH265FrameRate.displayOff();
                switch (selectH265TransmissionType.get()) {
                    case "uni":
                        for (var text in txtH265InputObject) {
                            txtH265InputObject[text].displayDisabled();
                        }
                        break;
                    case "uni_manual":
                        txtH265InputObject[INPUT_VIDEO_OVER_IP_H265_TRANSMISSION_TYPE_UNI_CAST_PORT_IMAGE].displayOff();
                        txtH265InputObject[INPUT_VIDEO_OVER_IP_H265_TRANSMISSION_TYPE_UNI_CAST_PORT_AUDIO].displayOff();
                        txtH265InputObject[INPUT_VIDEO_OVER_IP_H265_MULTI_CAST_ADDRESS].displayDisabled();
                        txtH265InputObject[INPUT_VIDEO_OVER_IP_H265_MULTI_CAST_PORT].displayDisabled();
                        txtH265InputObject[INPUT_VIDEO_OVER_IP_H265_MULTI_CAST_HTL_HOP_LIMIT].displayDisabled();
                        break;
                    case "multi":
                        txtH265InputObject[INPUT_VIDEO_OVER_IP_H265_TRANSMISSION_TYPE_UNI_CAST_PORT_IMAGE].displayDisabled();
                        txtH265InputObject[INPUT_VIDEO_OVER_IP_H265_TRANSMISSION_TYPE_UNI_CAST_PORT_AUDIO].displayDisabled();
                        txtH265InputObject[INPUT_VIDEO_OVER_IP_H265_MULTI_CAST_ADDRESS].displayOff();
                        txtH265InputObject[INPUT_VIDEO_OVER_IP_H265_MULTI_CAST_PORT].displayOff();
                        txtH265InputObject[INPUT_VIDEO_OVER_IP_H265_MULTI_CAST_HTL_HOP_LIMIT].displayOff();
                        break;
                }
            } else {
                selectH265ImageCaptureSize.displayDisabled();
                selectH265TransmissionPriority.displayDisabled();
                selectH265FrameRate.displayDisabled();
                selectH265MaxBitRateMax.displayDisabled();
                selectH265TransmissionType.displayDisabled();
                for (let text in txtH265InputObject) {
                    txtH265InputObject[text].displayDisabled();
                }
            }
        }

        /**
         *
         */
        function callbackH265Transmission() {
            changeItemStatus();
        }

        function callbackH265TransmissionType() {
            changeItemStatus();
        }

        /**
         *
         */
        function callbackH265SetButton(mouse) {
            if (mouse == Button.MOUSE_DOWN) {
                if (!checkAllInput()) {
                    return;
                }
                if (!checkBitRateTotal('H265', selectH265MaxBitRateMax.get() / 1000)) {
                    jAlert(MSG_STATUS.mID_0075, NPTZ_WORDING.wID_0039);
                    rebuild(currentType);
                    return;
                }
                let url = ""

                if (currentType == 2) {
                    url = "/cgi-bin/set_h265_2"
                } else {
                    url = "/cgi-bin/set_h265"
                }

                $("#dialog_setup").show();
                $.ajax({
                    type: "post",
                    url: url,
                    data: getH265SettingData(currentType, currentType),
                    success: function (data) {
                        setTimeout(function () {
                            $("#dialog_setup").hide();
                        }, 500);
                    },
                    error: function (jqXHR, textStatus, errorThrown) {
                        setTimeout(function () {
                            $("#dialog_setup").hide();
                        }, 500);
                    }
                });
            }
        }
        function checkAllInput() {
            if (selectH265TransmissionType.get() == 'uni_manual') {
                if (!CheckPort(txtH265InputObject[INPUT_VIDEO_OVER_IP_H265_TRANSMISSION_TYPE_UNI_CAST_PORT_IMAGE].get())) {
                    objErrCode = MSG_STATUS.mID_0009;
                    return capi_DispError(txtH265InputObject[INPUT_VIDEO_OVER_IP_H265_TRANSMISSION_TYPE_UNI_CAST_PORT_IMAGE].getInputObject(), objErrCode);
                }
                if (!CheckPort(txtH265InputObject[INPUT_VIDEO_OVER_IP_H265_TRANSMISSION_TYPE_UNI_CAST_PORT_AUDIO].get())) {
                    objErrCode = MSG_STATUS.mID_0009;
                    return capi_DispError(txtH265InputObject[INPUT_VIDEO_OVER_IP_H265_TRANSMISSION_TYPE_UNI_CAST_PORT_AUDIO].getInputObject(), objErrCode);
                }
                if (!CheckNum(txtH265InputObject[INPUT_VIDEO_OVER_IP_H265_TRANSMISSION_TYPE_UNI_CAST_PORT_IMAGE].get())) {
                    objErrCode = MSG_STATUS.mID_0009;
                    return capi_DispError(txtH265InputObject[INPUT_VIDEO_OVER_IP_H265_TRANSMISSION_TYPE_UNI_CAST_PORT_IMAGE].getInputObject(), objErrCode);
                }
                if (!CheckNum(txtH265InputObject[INPUT_VIDEO_OVER_IP_H265_TRANSMISSION_TYPE_UNI_CAST_PORT_AUDIO].get())) {
                    objErrCode = MSG_STATUS.mID_0009;
                    return capi_DispError(txtH265InputObject[INPUT_VIDEO_OVER_IP_H265_TRANSMISSION_TYPE_UNI_CAST_PORT_AUDIO].getInputObject(), objErrCode);
                }
                if (txtH265InputObject[INPUT_VIDEO_OVER_IP_H265_TRANSMISSION_TYPE_UNI_CAST_PORT_IMAGE].get() == 10670) {
                    objErrCode = MSG_STATUS.mID_0026;
                    return capi_DispError(txtH265InputObject[INPUT_VIDEO_OVER_IP_H265_TRANSMISSION_TYPE_UNI_CAST_PORT_IMAGE].getInputObject(), objErrCode);
                }
                if (txtH265InputObject[INPUT_VIDEO_OVER_IP_H265_TRANSMISSION_TYPE_UNI_CAST_PORT_AUDIO].get() == 10670) {
                    objErrCode = MSG_STATUS.mID_0026;
                    return capi_DispError(txtH265InputObject[INPUT_VIDEO_OVER_IP_H265_TRANSMISSION_TYPE_UNI_CAST_PORT_AUDIO].getInputObject(), objErrCode);
                }
            }
            else if (selectH265TransmissionType.get() == 'multi') {
                if (!chknet_CheckMultiAddr(txtH265InputObject[INPUT_VIDEO_OVER_IP_H265_MULTI_CAST_ADDRESS].get())) {
                    return capi_DispError(txtH265InputObject[INPUT_VIDEO_OVER_IP_H265_MULTI_CAST_ADDRESS].getInputObject(), objErrCode);
                }
                if (!CheckPort(txtH265InputObject[INPUT_VIDEO_OVER_IP_H265_MULTI_CAST_PORT].get())) {
                    objErrCode = MSG_STATUS.mID_0009;
                    return capi_DispError(txtH265InputObject[INPUT_VIDEO_OVER_IP_H265_MULTI_CAST_PORT].getInputObject(), objErrCode);
                }
                if (!CheckNum(txtH265InputObject[INPUT_VIDEO_OVER_IP_H265_MULTI_CAST_PORT].get())) {
                    objErrCode = MSG_STATUS.mID_0009;
                    return capi_DispError(txtH265InputObject[INPUT_VIDEO_OVER_IP_H265_MULTI_CAST_PORT].getInputObject(), objErrCode);
                }
                if (txtH265InputObject[INPUT_VIDEO_OVER_IP_H265_MULTI_CAST_PORT].get() == 10670) {
                    objErrCode = MSG_STATUS.mID_0026;
                    return capi_DispError(txtH265InputObject[INPUT_VIDEO_OVER_IP_H265_MULTI_CAST_PORT].getInputObject(), objErrCode);
                }
                if (!CheckNum(txtH265InputObject[INPUT_VIDEO_OVER_IP_H265_MULTI_CAST_HTL_HOP_LIMIT].get())) {
                    objErrCode = MSG_STATUS.mID_0009;
                    return capi_DispError(txtH265InputObject[INPUT_VIDEO_OVER_IP_H265_MULTI_CAST_HTL_HOP_LIMIT].getInputObject(), objErrCode);
                }
                if ((txtH265InputObject[INPUT_VIDEO_OVER_IP_H265_MULTI_CAST_HTL_HOP_LIMIT].get() < 1) || (txtH265InputObject[INPUT_VIDEO_OVER_IP_H265_MULTI_CAST_HTL_HOP_LIMIT].get() > 254)) {
                    objErrCode = MSG_STATUS.mID_0009;
                    return capi_DispError(txtH265InputObject[INPUT_VIDEO_OVER_IP_H265_MULTI_CAST_HTL_HOP_LIMIT].getInputObject(), objErrCode);
                }
            }
            return true;
        }

        function getH265SettingData(type, type2) {
            let data = {};
            if (!transmissionRadioButtonGroup.isDisabled()) {
                data['h265_transmit'] = transmissionRadioButtonGroup.getSelectedValue();
            }
            if (selectH265ImageCaptureSize.getStatus() != Select.STATUS_DISABLED) {
                data['h265_resolution'] = selectH265ImageCaptureSize.get();
            }
            if (selectH265TransmissionPriority.getStatus() != Select.STATUS_DISABLED) {
                data['f_priority'] = selectH265TransmissionPriority.get();
            }
            if (selectH265FrameRate.getStatus() != Select.STATUS_DISABLED) {
                data['framerate'] = selectH265FrameRate.get();
            }
            if (selectH265MaxBitRateMax.getStatus() != Select.STATUS_DISABLED) {
                data['h265_bandwidth'] = selectH265MaxBitRateMax.get();
            }
            if (selectH265TransmissionType.getStatus() != Select.STATUS_DISABLED) {
                data['h265_unimulti'] = selectH265TransmissionType.get();
            }
            if (txtH265InputObject[INPUT_VIDEO_OVER_IP_H265_TRANSMISSION_TYPE_UNI_CAST_PORT_IMAGE].getStatus() != Input.STATUS_DISABLED) {
                data['unicast_port'] = txtH265InputObject[INPUT_VIDEO_OVER_IP_H265_TRANSMISSION_TYPE_UNI_CAST_PORT_IMAGE].get();
            }
            if (txtH265InputObject[INPUT_VIDEO_OVER_IP_H265_TRANSMISSION_TYPE_UNI_CAST_PORT_AUDIO].getStatus() != Input.STATUS_DISABLED) {
                data['unicast_audio_port'] = txtH265InputObject[INPUT_VIDEO_OVER_IP_H265_TRANSMISSION_TYPE_UNI_CAST_PORT_AUDIO].get();
            }
            if (txtH265InputObject[INPUT_VIDEO_OVER_IP_H265_MULTI_CAST_ADDRESS].getStatus() != Input.STATUS_DISABLED) {
                data['multicast_addr'] = txtH265InputObject[INPUT_VIDEO_OVER_IP_H265_MULTI_CAST_ADDRESS].get();
            }
            if (txtH265InputObject[INPUT_VIDEO_OVER_IP_H265_MULTI_CAST_PORT].getStatus() != Input.STATUS_DISABLED) {
                data['multicast_port'] = txtH265InputObject[INPUT_VIDEO_OVER_IP_H265_MULTI_CAST_PORT].get();
            }
            if (txtH265InputObject[INPUT_VIDEO_OVER_IP_H265_MULTI_CAST_HTL_HOP_LIMIT].getStatus() != Input.STATUS_DISABLED) {
                data['multicast_ttl'] = txtH265InputObject[INPUT_VIDEO_OVER_IP_H265_MULTI_CAST_HTL_HOP_LIMIT].get();
            }
            return data;
        }

        return {
            build: function (type) {
                return buildH265(type);
            }
        }
    }

    /**
     * settingNDIHX画面:settingJPEG制御に関わる画面クラス
     * @class settingNDIHX画面:settingJPEG制御に関わる画面クラス
     * @return {{build: buildNDIHX, rebuild: rebuild}} build 構築�E琁E
     * @return {function} rebuild 再構築�E琁E
     * @constructor
     */
    function settingNDIHX() {
        /**
         * 構築フラグ
         * @type boolean
         */
        var buildFlag_NDIHX = false;
        /**
         * label定義
         * @type number
         */
        var TXT_VIDEO_OVER_IP_NDIHX_STREAM_TRANSMISSION = 0;
        var TXT_VIDEO_OVER_IP_NDIHX_STREAM_INTERNET_MODE = 1;
        var TXT_VIDEO_OVER_IP_NDIHX_STREAM_IMAGE_CAPTURE_SIZE = 2;
        var TXT_VIDEO_OVER_IP_NDIHX_STREAM_TRANSMISSION_PRIORITY = 3;
        var TXT_VIDEO_OVER_IP_NDIHX_STREAM_FRAME_RATE = 4;
        var TXT_VIDEO_OVER_IP_NDIHX_STREAM_MAX_BIT_RATE = 5;
        var TXT_VIDEO_OVER_IP_NDIHX_STREAM_MAX_BIT_RATE_MAX = 6;
        var TXT_VIDEO_OVER_IP_NDIHX_STREAM_MAX_BIT_RATE_DASH = 7;
        var TXT_VIDEO_OVER_IP_NDIHX_STREAM_MAX_BIT_RATE_MIN = 8;
        var TXT_VIDEO_OVER_IP_NDIHX_STREAM_IMAGE_QUALITY = 9;
        var TXT_VIDEO_OVER_IP_NDIHX_STREAM_TRANSMISSION_TYPE = 10;
        var TXT_VIDEO_OVER_IP_NDIHX_STREAM_UNI_CAST_PORT_IMAGE = 11;
        var TXT_VIDEO_OVER_IP_NDIHX_STREAM_UNI_CAST_PORT_IMAGE_MESSAGE = 12;
        var TXT_VIDEO_OVER_IP_NDIHX_STREAM_UNI_CAST_PORT_AUDIO = 13;//    Unicast port(Audio)
        var TXT_VIDEO_OVER_IP_NDIHX_STREAM_UNI_CAST_PORT_AUDIO_MESSAGE = 14;
        var TXT_VIDEO_OVER_IP_NDIHX_STREAM_MULTI_CAST_ADDRESS = 15;
        var TXT_VIDEO_OVER_IP_NDIHX_STREAM_MULTI_CAST_PORT = 16;
        var TXT_VIDEO_OVER_IP_NDIHX_STREAM_MULTI_CAST_PORT_MESSAGE = 17;
        var TXT_VIDEO_OVER_IP_NDIHX_STREAM_MULTI_CAST_HTL_HOP_LIMIT = 18;
        var TXT_VIDEO_OVER_IP_NDIHX_STREAM_MULTI_CAST_HTL_HOP_LIMIT_MESSAGE = 19;
        var selectNDIHXImageCaptureSize;
        var selectNDIHXTransmissionPriority;
        var selectNDIHXFrameRate;
        var selectNDIHXMaxBitRateMax;
        var selectNDIHXMaxBitRateMin;
        var selectNDIHXImageQuality;
        var selectNDIHXTransmissionType;
        var txtNDIHXObject = [];
        var NDIHX_transmit;
        var NDIHX_rtsp_mode;
        var NDIHX_resolution;
        var NDIHX_f_priority;
        var NDIHX_framerate;
        var NDIHX_bandwidth;
        var NDIHX_bandwidth_min;
        var NDIHX_quality;
        var NDIHX_unimulti;
        var NDIHX_unicast_port;
        var NDIHX_unicast_audio_port;
        var NDIHX_multicast_addr;
        var NDIHX_multicast_port;
        var NDIHX_multicast_ttl;


        /**
         * input[] : text
         * @type txtNDIHXInputObject[]
         */
        var txtNDIHXInputObject = [];
        var INPUT_VIDEO_OVER_IP_NDIHX_STREAM_TRANSMISSION_TYPE_UNI_CAST_PORT_IMAGE = 0;
        var INPUT_VIDEO_OVER_IP_NDIHX_STREAM_TRANSMISSION_TYPE_UNI_CAST_PORT_AUDIO = 1;
        var INPUT_VIDEO_OVER_IP_NDIHX_STREAM_MULTI_CAST_ADDRESS = 2;
        var INPUT_VIDEO_OVER_IP_NDIHX_STREAM_MULTI_CAST_PORT = 3;
        var INPUT_VIDEO_OVER_IP_NDIHX_STREAM_MULTI_CAST_HTL_HOP_LIMIT = 4;
        var transmissionRadioButtonGroup;
        var internetModeRadioButtonGroup;
        var NDIHX_set_button;

        function getCurrentValueOfNDIHX(type) {
            if (type) {
                NDIHX_transmit = objVOIP["h264_transmit_ch" + type];
                NDIHX_rtsp_mode = objVOIP["h264_rtsp_mode_ch" + type];
                NDIHX_resolution = objVOIP["h264_resolution_ch" + type];
                NDIHX_f_priority = objVOIP["h264_f_priority_ch" + type];
                NDIHX_framerate = objVOIP["h264_framerate_ch" + type];
                NDIHX_bandwidth = objVOIP["h264_bandwidth_ch" + type];
                NDIHX_bandwidth_min = objVOIP["h264_bandwidth_min_ch" + type];
                NDIHX_quality = objVOIP["h264_quality_ch" + type];
                NDIHX_unimulti = objVOIP["h264_unimulti_ch" + type];
                NDIHX_unicast_port = objVOIP["h264_unicast_port_ch" + type];
                NDIHX_unicast_audio_port = objVOIP["h264_unicast_audio_port_ch" + type];
                NDIHX_multicast_addr = objVOIP["h264_multicast_addr_ch" + type];
                NDIHX_multicast_port = objVOIP["h264_multicast_port_ch" + type];
                NDIHX_multicast_ttl = objVOIP["h264_multicast_ttl_ch" + type];
            }
        }

        function buildNDIHX(type) {
            getCurrentValueOfNDIHX(type);
            if (!buildFlag_NDIHX) {
                buildFlag_NDIHX = true;
                // H.264 transmission
                txtNDIHXObject[TXT_VIDEO_OVER_IP_NDIHX_STREAM_TRANSMISSION] = TextCtrl('setup_videoOverIp_NDIHX_stream_label', 'setup_videoOverIp_NDIHX_stream_transmission_label', NPTZ_WORDING.wID_0247);
                // H.264 transmission radioButtonItems
                transmissionRadioButtonGroup = RadioButtonGroupCtrl("setup_videoOverIp_NDIHX_stream_form", "setup_videoOverIp_NDIHX_stream_transmission_", RADIO_GROUP.rID_0001, NDIHX_transmit, callbackNDIHXTransmission);
                LineCtrl('setup_videoOverIp_NDIHX_stream_main', 'horizontal', 73, 0, "", "setup_videoOverIp_NDIHX_stream_transmission_label", "98");

                // Internet mode(Over HTTP)
                txtNDIHXObject[TXT_VIDEO_OVER_IP_NDIHX_STREAM_INTERNET_MODE] = TextCtrl('setup_videoOverIp_NDIHX_stream_label', 'setup_videoOverIp_NDIHX_stream_internetMode_label', NPTZ_WORDING.wID_0236);
                // JPEG transmission radioButtonItems
                internetModeRadioButtonGroup = RadioButtonGroupCtrl("setup_videoOverIp_NDIHX_stream_form", "setup_videoOverIp_NDIHX_stream_internetMode_", RADIO_GROUP.rID_0001, NDIHX_rtsp_mode, callbackNDIHXInternetMode);
                LineCtrl('setup_videoOverIp_NDIHX_stream_main', 'horizontal', 141, 0, "", "setup_videoOverIp_NDIHX_stream_internetMode_label", "98");

                // image capture size
                txtNDIHXObject[TXT_VIDEO_OVER_IP_NDIHX_STREAM_IMAGE_CAPTURE_SIZE] = TextCtrl('setup_videoOverIp_NDIHX_stream_label', 'setup_videoOverIp_NDIHX_stream_imageCaptureSize_label', NPTZ_WORDING.wID_0102);
                selectNDIHXImageCaptureSize = SelectCtrl('setup_videoOverIp_NDIHX_stream_form', "", "setup_videoOverIp_NDIHX_stream_imageCaptureSize_select", "setup_videoOverIp_NDIHX_stream_imageCaptureSize_select", callbackNDIHXImageCaptureSize, '', sysConst.getH264ImageCaptureSizeItems(CONST_H264_CH1), NDIHX_resolution);
                selectNDIHXImageCaptureSize.show();
                selectNDIHXImageCaptureSize.displayOn();
                LineCtrl('setup_videoOverIp_NDIHX_stream_main', 'horizontal', 209, 0, "", "setup_videoOverIp_NDIHX_stream_imageCaptureSize_label", "98");

                // Transmission priority
                txtNDIHXObject[TXT_VIDEO_OVER_IP_NDIHX_STREAM_TRANSMISSION_PRIORITY] = TextCtrl('setup_videoOverIp_NDIHX_stream_label', 'setup_videoOverIp_NDIHX_stream_transmission_priority_label', NPTZ_WORDING.wID_0100);
                selectNDIHXTransmissionPriority = SelectCtrl('setup_videoOverIp_NDIHX_stream_form', "", "setup_videoOverIp_NDIHX_stream_transmission_priority_select", "setup_videoOverIp_NDIHX_stream_transmission_priority_select", '', '', TRANSMISSION_PRIORITY_OPTIONS, NDIHX_f_priority);
                selectNDIHXTransmissionPriority.show();
                selectNDIHXTransmissionPriority.displayOn();
                LineCtrl('setup_videoOverIp_NDIHX_stream_main', 'horizontal', 277, 0, "", "setup_videoOverIp_NDIHX_stream_transmission_priority_label", "98");

                // Frame rate
                txtNDIHXObject[TXT_VIDEO_OVER_IP_NDIHX_STREAM_FRAME_RATE] = TextCtrl('setup_videoOverIp_NDIHX_stream_label', 'setup_videoOverIp_NDIHX_stream_frame_rate_label', NPTZ_WORDING.wID_0105);
                selectNDIHXFrameRate = SelectCtrl('setup_videoOverIp_NDIHX_stream_form', "", "setup_videoOverIp_NDIHX_stream_frame_rate_select", "setup_videoOverIp_NDIHX_stream_frame_rate_select", callbackNDIHXFrameRate, '', sysConst.getH264FrameRateItems(CONST_H264_CH1, NDIHX_resolution), NDIHX_framerate);
                selectNDIHXFrameRate.show();
                selectNDIHXFrameRate.displayOn();
                LineCtrl('setup_videoOverIp_NDIHX_stream_main', 'horizontal', 345, 0, "", "setup_videoOverIp_NDIHX_stream_frame_rate_label", "98");

                // Max bit rate(per client)
                var h264BitRateOptions = sysConst.getH264BitRate(NDIHX_resolution, NDIHX_framerate);
                txtNDIHXObject[TXT_VIDEO_OVER_IP_NDIHX_STREAM_MAX_BIT_RATE] = TextCtrl('setup_videoOverIp_NDIHX_stream_label', 'setup_videoOverIp_NDIHX_stream_maxBitRate_label', NPTZ_WORDING.wID_0107);
                txtNDIHXObject[TXT_VIDEO_OVER_IP_NDIHX_STREAM_MAX_BIT_RATE_MAX] = TextCtrl('setup_videoOverIp_NDIHX_stream_form', 'setup_videoOverIp_NDIHX_stream_maxBitRate_max_label', NPTZ_WORDING.wID_0237);
                selectNDIHXMaxBitRateMax = SelectCtrl('setup_videoOverIp_NDIHX_stream_form', "", "setup_videoOverIp_NDIHX_stream_max_bit_rate_max_select", "setup_videoOverIp_NDIHX_stream_max_bit_rate_max_select", '', '', h264BitRateOptions, NDIHX_bandwidth);
                selectNDIHXMaxBitRateMax.show();
                selectNDIHXMaxBitRateMax.displayOn();
                txtNDIHXObject[TXT_VIDEO_OVER_IP_NDIHX_STREAM_MAX_BIT_RATE_DASH] = TextCtrl('setup_videoOverIp_NDIHX_stream_form', 'setup_videoOverIp_NDIHX_stream_maxBitRate_dash_label', NPTZ_WORDING.wID_0015);
                txtNDIHXObject[TXT_VIDEO_OVER_IP_NDIHX_STREAM_MAX_BIT_RATE_MIN] = TextCtrl('setup_videoOverIp_NDIHX_stream_form', 'setup_videoOverIp_NDIHX_stream_maxBitRate_min_label', NPTZ_WORDING.wID_0238);
                selectNDIHXMaxBitRateMin = SelectCtrl('setup_videoOverIp_NDIHX_stream_form', "", "setup_videoOverIp_NDIHX_stream_max_bit_rate_min_select", "setup_videoOverIp_NDIHX_stream_max_bit_rate_min_select", '', '', h264BitRateOptions, NDIHX_bandwidth_min);
                selectNDIHXMaxBitRateMin.show();
                selectNDIHXMaxBitRateMin.displayOn();
                LineCtrl('setup_videoOverIp_NDIHX_stream_main', 'horizontal', 413, 0, "", "setup_videoOverIp_NDIHX_stream_maxBitRate_dash_label", "98");

                // Image quality
                txtNDIHXObject[TXT_VIDEO_OVER_IP_NDIHX_STREAM_IMAGE_QUALITY] = TextCtrl('setup_videoOverIp_NDIHX_stream_label', 'setup_videoOverIp_NDIHX_stream_imageQuality_label', NPTZ_WORDING.wID_0104);
                selectNDIHXImageQuality = SelectCtrl('setup_videoOverIp_NDIHX_stream_form', "", "setup_videoOverIp_NDIHX_stream_image_quality_select", "setup_videoOverIp_NDIHX_stream_image_quality_select", '', '', NDIHX_IMAGE_QUALITY, NDIHX_quality);
                selectNDIHXImageQuality.show();
                selectNDIHXImageQuality.displayOn();
                LineCtrl('setup_videoOverIp_NDIHX_stream_main', 'horizontal', 481, 0, "", "setup_videoOverIp_NDIHX_stream_image_Quality_label", "98");

                // Transmission type
                txtNDIHXObject[TXT_VIDEO_OVER_IP_NDIHX_STREAM_TRANSMISSION_TYPE] = TextCtrl('setup_videoOverIp_NDIHX_stream_label', 'setup_videoOverIp_NDIHX_stream_transmissionType_label', NPTZ_WORDING.wID_0101);
                selectNDIHXTransmissionType = SelectCtrl('setup_videoOverIp_NDIHX_stream_form', "", "setup_videoOverIp_NDIHX_stream_transmission_type_quality_select", "setup_videoOverIp_NDIHX_stream_transmission_type_quality_select", callbackNDIHXTransmissionType, '', NDIHX_TRANSMISSION_TYPE, NDIHX_unimulti);
                selectNDIHXTransmissionType.show();
                selectNDIHXTransmissionType.displayOn();
                LineCtrl('setup_videoOverIp_NDIHX_stream_main', 'vertical', 541, 37, 100, "setup_videoOverIp_NDIHX_stream_transmissionType_port_label");
                LineCtrl('setup_videoOverIp_NDIHX_stream_main', 'horizontal', 541, 50, "", "setup_videoOverIp_NDIHX_stream_transmission_typequality_select", "98");
                txtNDIHXObject[TXT_VIDEO_OVER_IP_NDIHX_STREAM_UNI_CAST_PORT_IMAGE] = TextCtrl('setup_videoOverIp_NDIHX_stream_label', 'setup_videoOverIp_NDIHX_stream_transmissionType_unicastPortImage_label', NPTZ_WORDING.wID_0239);
                txtNDIHXInputObject[INPUT_VIDEO_OVER_IP_NDIHX_STREAM_TRANSMISSION_TYPE_UNI_CAST_PORT_IMAGE] = InputCtrl("setup_videoOverIp_NDIHX_stream_form", 'unicast_image_port', 'unicast_image_port', 'setup_videoOverIp_NDIHX_stream_transmissionType_unicastPortImage_input', NDIHX_unicast_port, null, null, null, null, 5);
                // port 数字以外�E力できなぁE
                txtNDIHXInputObject[INPUT_VIDEO_OVER_IP_NDIHX_STREAM_TRANSMISSION_TYPE_UNI_CAST_PORT_IMAGE].getInputObject().keypress(filterNumber);
                txtNDIHXObject[TXT_VIDEO_OVER_IP_NDIHX_STREAM_UNI_CAST_PORT_IMAGE_MESSAGE] = TextCtrl('setup_videoOverIp_NDIHX_stream_form', 'setup_videoOverIp_NDIHX_stream_transmissionType_unicastPortImage_message_label', NPTZ_WORDING.wID_0240);
                LineCtrl('setup_videoOverIp_NDIHX_stream_main', 'horizontal', 593, 50, "", "setup_videoOverIp_NDIHX_stream_transmissionType_unicastPortImage_label", "96");
                txtNDIHXObject[TXT_VIDEO_OVER_IP_NDIHX_STREAM_UNI_CAST_PORT_AUDIO] = TextCtrl('setup_videoOverIp_NDIHX_stream_label', 'setup_videoOverIp_NDIHX_stream_transmissionType_unicastPortAudio_label', NPTZ_WORDING.wID_0241);
                txtNDIHXInputObject[INPUT_VIDEO_OVER_IP_NDIHX_STREAM_TRANSMISSION_TYPE_UNI_CAST_PORT_AUDIO] = InputCtrl("setup_videoOverIp_NDIHX_stream_form", 'unicast_audio_port', 'unicast_audio_port', 'setup_videoOverIp_NDIHX_stream_transmissionType_unicastPortAudio_input', NDIHX_unicast_audio_port, null, null, null, null, 5);
                // port 数字以外�E力できなぁE
                txtNDIHXInputObject[INPUT_VIDEO_OVER_IP_NDIHX_STREAM_TRANSMISSION_TYPE_UNI_CAST_PORT_AUDIO].getInputObject().keypress(filterNumber);
                txtNDIHXObject[TXT_VIDEO_OVER_IP_NDIHX_STREAM_UNI_CAST_PORT_AUDIO_MESSAGE] = TextCtrl('setup_videoOverIp_NDIHX_stream_form', 'setup_videoOverIp_NDIHX_stream_transmissionType_unicastPortAudio_message_label', NPTZ_WORDING.wID_0240);
                LineCtrl('setup_videoOverIp_NDIHX_stream_main', 'horizontal', 653, 0, "", "setup_videoOverIp_NDIHX_stream_transmissionType_unicastPortAudio_label", "98");

                // Multicast address
                txtNDIHXObject[TXT_VIDEO_OVER_IP_NDIHX_STREAM_MULTI_CAST_ADDRESS] = TextCtrl('setup_videoOverIp_NDIHX_stream_label', 'setup_videoOverIp_NDIHX_stream_multicastAddress_label', NPTZ_WORDING.wID_0242);
                txtNDIHXInputObject[INPUT_VIDEO_OVER_IP_NDIHX_STREAM_MULTI_CAST_ADDRESS] = InputCtrl("setup_videoOverIp_NDIHX_stream_form", 'multicast_address', 'multicast_address', 'setup_videoOverIp_NDIHX_stream_multicastAddress_input', NDIHX_multicast_addr);
                LineCtrl('setup_videoOverIp_NDIHX_stream_main', 'horizontal', 721, 0, "", "setup_videoOverIp_NDIHX_stream_multicastAddress_label", "98");

                // Multicast port
                txtNDIHXObject[TXT_VIDEO_OVER_IP_NDIHX_STREAM_MULTI_CAST_PORT] = TextCtrl('setup_videoOverIp_NDIHX_stream_label', 'setup_videoOverIp_NDIHX_stream_multicastPort_label', NPTZ_WORDING.wID_0243);
                txtNDIHXInputObject[INPUT_VIDEO_OVER_IP_NDIHX_STREAM_MULTI_CAST_PORT] = InputCtrl("setup_videoOverIp_NDIHX_stream_form", 'multicast_port', 'multicast_port', 'setup_videoOverIp_NDIHX_stream_multicastPort_input', NDIHX_multicast_port, null, null, null, null, 5);
                // port 数字以外�E力できなぁE
                txtNDIHXInputObject[INPUT_VIDEO_OVER_IP_NDIHX_STREAM_MULTI_CAST_PORT].getInputObject().keypress(filterNumber);
                txtNDIHXObject[TXT_VIDEO_OVER_IP_NDIHX_STREAM_MULTI_CAST_PORT_MESSAGE] = TextCtrl('setup_videoOverIp_NDIHX_stream_form', 'setup_videoOverIp_NDIHX_stream_multiCastPort_message_label', NPTZ_WORDING.wID_0240);
                LineCtrl('setup_videoOverIp_NDIHX_stream_main', 'horizontal', 789, 0, "", "setup_videoOverIp_NDIHX_stream_multicastPort_label", "98");

                // Multicast TTL/HOPLimit
                txtNDIHXObject[TXT_VIDEO_OVER_IP_NDIHX_STREAM_MULTI_CAST_HTL_HOP_LIMIT] = TextCtrl('setup_videoOverIp_NDIHX_stream_label', 'setup_videoOverIp_NDIHX_stream_multicastHTLHOPLimit_label', NPTZ_WORDING.wID_0244);
                txtNDIHXInputObject[INPUT_VIDEO_OVER_IP_NDIHX_STREAM_MULTI_CAST_HTL_HOP_LIMIT] = InputCtrl("setup_videoOverIp_NDIHX_stream_form", 'multicast_HTLHOPLimit', 'multicast_HTLHOPLimit', 'setup_videoOverIp_NDIHX_stream_multicastHTLHOPLimit_input', NDIHX_multicast_ttl, null, null, null, null, 3);
                txtNDIHXInputObject[INPUT_VIDEO_OVER_IP_NDIHX_STREAM_MULTI_CAST_HTL_HOP_LIMIT].getInputObject().keypress(filterNumber);
                txtNDIHXObject[TXT_VIDEO_OVER_IP_NDIHX_STREAM_MULTI_CAST_HTL_HOP_LIMIT_MESSAGE] = TextCtrl('setup_videoOverIp_NDIHX_stream_form', 'setup_videoOverIp_NDIHX_stream_multiHtlHopLimit_message_label', NPTZ_WORDING.wID_0245);
                LineCtrl('setup_videoOverIp_NDIHX_stream_main', 'horizontal', 857, 0, "", "setup_videoOverIp_NDIHX_stream_multicastHTLHOPLimit_label", "98");

                NDIHX_set_button = ButtonCtrl("setup_videoOverIp_NDIHX_stream_set_btn_area", "setup_videoOverIp_NDIHX_stream_set_button", NPTZ_WORDING.wID_0141, callbackNDIHXSetButton);
                NDIHX_set_button.getButtonObject().addClass('button_class');
                NDIHX_set_button.show();
                NDIHX_set_button.displayOff();
                for (var text in txtNDIHXObject) {
                    txtNDIHXObject[text].show();
                }
                for (var text in txtNDIHXInputObject) {
                    txtNDIHXInputObject[text].show();
                    txtNDIHXInputObject[text].displayOff();
                }
                changeItemStatus();
            } else {
                rebuild();
            }
        }

        function rebuild() {
            transmissionRadioButtonGroup.setSelectedValue(NDIHX_transmit);
            internetModeRadioButtonGroup.setSelectedValue(NDIHX_rtsp_mode);
            selectNDIHXImageCaptureSize.refreshOptions(sysConst.getH264ImageCaptureSizeItems(CONST_H264_CH1));
            selectNDIHXImageCaptureSize.val(NDIHX_resolution);
            selectNDIHXTransmissionPriority.val(NDIHX_f_priority);
            selectNDIHXFrameRate.refreshOptions(sysConst.getH264FrameRateItems(CONST_H264_CH1, NDIHX_resolution));
            selectNDIHXFrameRate.val(NDIHX_framerate);
            var h264BitRateOptions = sysConst.getH264BitRate(NDIHX_resolution, NDIHX_framerate);
            selectNDIHXMaxBitRateMax.refreshOptions(h264BitRateOptions);
            selectNDIHXMaxBitRateMax.val(NDIHX_bandwidth);
            selectNDIHXMaxBitRateMin.refreshOptions(h264BitRateOptions);
            selectNDIHXMaxBitRateMin.val(NDIHX_bandwidth_min);
            selectNDIHXImageQuality.val(NDIHX_quality);
            selectNDIHXTransmissionType.val(NDIHX_unimulti);
            for (var i = 0; i < txtNDIHXInputObject.length; i++) {
                switch (i) {
                    case INPUT_VIDEO_OVER_IP_NDIHX_STREAM_TRANSMISSION_TYPE_UNI_CAST_PORT_IMAGE:
                        txtNDIHXInputObject[i].val(NDIHX_unicast_port);
                        break;
                    case INPUT_VIDEO_OVER_IP_NDIHX_STREAM_TRANSMISSION_TYPE_UNI_CAST_PORT_AUDIO:
                        txtNDIHXInputObject[i].val(NDIHX_unicast_audio_port);
                        break;
                    case INPUT_VIDEO_OVER_IP_NDIHX_STREAM_MULTI_CAST_ADDRESS:
                        txtNDIHXInputObject[i].val(NDIHX_multicast_addr);
                        break;
                    case INPUT_VIDEO_OVER_IP_NDIHX_STREAM_MULTI_CAST_PORT:
                        txtNDIHXInputObject[i].val(NDIHX_multicast_port);
                        break;
                    case INPUT_VIDEO_OVER_IP_NDIHX_STREAM_MULTI_CAST_HTL_HOP_LIMIT:
                        txtNDIHXInputObject[i].val(NDIHX_multicast_ttl);
                        break;
                }
            }
            changeItemStatus();
        }

        /**
         *
         */
        function changeItemStatus() {
            selectNDIHXTransmissionPriority.displayDisabled();
            selectNDIHXMaxBitRateMin.displayDisabled();
            selectNDIHXImageQuality.displayDisabled();
            if (transmissionRadioButtonGroup.getSelectedValue() == 1) {
                internetModeRadioButtonGroup.displayOff();
                selectNDIHXFrameRate.displayOff();
                selectNDIHXImageCaptureSize.displayOff();
                selectNDIHXMaxBitRateMax.displayOff();
                if (internetModeRadioButtonGroup.getSelectedValue() == 1) {
                    selectNDIHXTransmissionType.val("uni");
                    selectNDIHXTransmissionType.displayDisabled();
                } else {
                    selectNDIHXTransmissionType.displayOff();
                }
                switch (selectNDIHXTransmissionType.get()) {
                    case "uni":
                        for (var text in txtNDIHXInputObject) {
                            txtNDIHXInputObject[text].displayDisabled();
                        }
                        break;
                    case "uni_manual":
                        txtNDIHXInputObject[INPUT_VIDEO_OVER_IP_NDIHX_STREAM_TRANSMISSION_TYPE_UNI_CAST_PORT_IMAGE].displayOff();
                        txtNDIHXInputObject[INPUT_VIDEO_OVER_IP_NDIHX_STREAM_TRANSMISSION_TYPE_UNI_CAST_PORT_AUDIO].displayOff();
                        txtNDIHXInputObject[INPUT_VIDEO_OVER_IP_NDIHX_STREAM_MULTI_CAST_ADDRESS].displayDisabled();
                        txtNDIHXInputObject[INPUT_VIDEO_OVER_IP_NDIHX_STREAM_MULTI_CAST_PORT].displayDisabled();
                        txtNDIHXInputObject[INPUT_VIDEO_OVER_IP_NDIHX_STREAM_MULTI_CAST_HTL_HOP_LIMIT].displayDisabled();
                        break;
                    case "multi":
                        txtNDIHXInputObject[INPUT_VIDEO_OVER_IP_NDIHX_STREAM_TRANSMISSION_TYPE_UNI_CAST_PORT_IMAGE].displayDisabled();
                        txtNDIHXInputObject[INPUT_VIDEO_OVER_IP_NDIHX_STREAM_TRANSMISSION_TYPE_UNI_CAST_PORT_AUDIO].displayDisabled();
                        txtNDIHXInputObject[INPUT_VIDEO_OVER_IP_NDIHX_STREAM_MULTI_CAST_ADDRESS].displayOff();
                        txtNDIHXInputObject[INPUT_VIDEO_OVER_IP_NDIHX_STREAM_MULTI_CAST_PORT].displayOff();
                        txtNDIHXInputObject[INPUT_VIDEO_OVER_IP_NDIHX_STREAM_MULTI_CAST_HTL_HOP_LIMIT].displayOff();
                        break;
                }
            } else {
                internetModeRadioButtonGroup.displayDisabled();
                selectNDIHXImageCaptureSize.displayDisabled();
                selectNDIHXTransmissionPriority.displayDisabled();
                selectNDIHXFrameRate.displayDisabled();
                selectNDIHXMaxBitRateMax.displayDisabled();
                selectNDIHXMaxBitRateMin.displayDisabled();
                selectNDIHXImageQuality.displayDisabled();
                selectNDIHXTransmissionType.displayDisabled();
                for (var text in txtNDIHXInputObject) {
                    txtNDIHXInputObject[text].displayDisabled();
                }
            }
        }

        /**
         *
         */
        function callbackNDIHXImageCaptureSize() {
            selectNDIHXFrameRate.refreshOptions(sysConst.getH264FrameRateItems(CONST_H264_CH1, selectNDIHXImageCaptureSize.get()));
            selectNDIHXFrameRate.val(NDIHX_framerate);
            var h264BitRateOptions = sysConst.getH264BitRate(selectNDIHXImageCaptureSize.get(), selectNDIHXFrameRate.get());
            selectNDIHXMaxBitRateMax.refreshOptions(h264BitRateOptions);
            selectNDIHXMaxBitRateMax.val(getMaxBitRateMaxToSet(h264BitRateOptions, NDIHX_bandwidth));
            selectNDIHXMaxBitRateMin.refreshOptions(h264BitRateOptions);
            selectNDIHXMaxBitRateMin.val(NDIHX_bandwidth_min);
        }

        /**
         *
         */
        function callbackNDIHXFrameRate() {
            var h264BitRateOptions = sysConst.getH264BitRate(selectNDIHXImageCaptureSize.get(), selectNDIHXFrameRate.get());
            selectNDIHXMaxBitRateMax.refreshOptions(h264BitRateOptions);
            selectNDIHXMaxBitRateMax.val(getMaxBitRateMaxToSet(h264BitRateOptions, NDIHX_bandwidth));
            selectNDIHXMaxBitRateMin.refreshOptions(h264BitRateOptions);
            selectNDIHXMaxBitRateMin.val(NDIHX_bandwidth_min);
        }

        function callbackNDIHXTransmissionType() {
            changeItemStatus();
        }

        /**
         *
         */
        function callbackNDIHXTransmission() {
            changeItemStatus();
        }

        /**
         *
         */
        function callbackNDIHXInternetMode() {
            changeItemStatus();
        }

        /**
         *
         */
        function callbackNDIHXSetButton(mouse) {
            if (mouse == Button.MOUSE_DOWN) {
                if (!checkAllInput()) {
                    return;
                }
                if (!checkBitRateTotal('H264_1', selectNDIHXMaxBitRateMax.get() / 1000)) {
                    jAlert(MSG_STATUS.mID_0075, NPTZ_WORDING.wID_0039);
                    rebuild();
                    return;
                }
                $("#dialog_setup").show();
                $.ajax({
                    type: "post",
                    url: '/cgi-bin/set_h264',
                    data: getNDIHXSettingData(),
                    success: function (data) {
                        $.ajax({
                            type: "post",
                            url: '/cgi-bin/set_h264_2',
                            data: getNDIHXSettingData2(),
                            success: function (data) {
                                setTimeout(function () {
                                    $("#dialog_setup").hide();
                                }, 500);
                            },
                            error: function (jqXHR, textStatus, errorThrown) {
                                setTimeout(function () {
                                    $("#dialog_setup").hide();
                                }, 500);
                            }
                        });
                        setTimeout(function () {
                            $("#dialog_setup").hide();
                        }, 500);
                    },
                    error: function (jqXHR, textStatus, errorThrown) {
                        setTimeout(function () {
                            $("#dialog_setup").hide();
                        }, 500);
                    }
                });
            }
        }

        function checkAllInput() {
            if (selectNDIHXTransmissionType.get() == 'uni_manual') {
                if (!CheckPort(txtNDIHXInputObject[INPUT_VIDEO_OVER_IP_NDIHX_STREAM_TRANSMISSION_TYPE_UNI_CAST_PORT_IMAGE].get())) {
                    objErrCode = MSG_STATUS.mID_0009;
                    return capi_DispError(txtNDIHXInputObject[INPUT_VIDEO_OVER_IP_NDIHX_STREAM_TRANSMISSION_TYPE_UNI_CAST_PORT_IMAGE].getInputObject(), objErrCode);
                }
                if (!CheckPort(txtNDIHXInputObject[INPUT_VIDEO_OVER_IP_NDIHX_STREAM_TRANSMISSION_TYPE_UNI_CAST_PORT_AUDIO].get())) {
                    objErrCode = MSG_STATUS.mID_0009;
                    return capi_DispError(txtNDIHXInputObject[INPUT_VIDEO_OVER_IP_NDIHX_STREAM_TRANSMISSION_TYPE_UNI_CAST_PORT_AUDIO].getInputObject(), objErrCode);
                }
                if (!CheckNum(txtNDIHXInputObject[INPUT_VIDEO_OVER_IP_NDIHX_STREAM_TRANSMISSION_TYPE_UNI_CAST_PORT_IMAGE].get())) {
                    objErrCode = MSG_STATUS.mID_0009;
                    return capi_DispError(txtNDIHXInputObject[INPUT_VIDEO_OVER_IP_NDIHX_STREAM_TRANSMISSION_TYPE_UNI_CAST_PORT_IMAGE].getInputObject(), objErrCode);
                }
                if (!CheckNum(txtNDIHXInputObject[INPUT_VIDEO_OVER_IP_NDIHX_STREAM_TRANSMISSION_TYPE_UNI_CAST_PORT_AUDIO].get())) {
                    objErrCode = MSG_STATUS.mID_0009;
                    return capi_DispError(txtNDIHXInputObject[INPUT_VIDEO_OVER_IP_NDIHX_STREAM_TRANSMISSION_TYPE_UNI_CAST_PORT_AUDIO].getInputObject(), objErrCode);
                }
                if (txtNDIHXInputObject[INPUT_VIDEO_OVER_IP_NDIHX_STREAM_TRANSMISSION_TYPE_UNI_CAST_PORT_IMAGE].get() == 10670) {
                    objErrCode = MSG_STATUS.mID_0026;
                    return capi_DispError(txtNDIHXInputObject[INPUT_VIDEO_OVER_IP_NDIHX_STREAM_TRANSMISSION_TYPE_UNI_CAST_PORT_IMAGE].getInputObject(), objErrCode);
                }
                if (txtNDIHXInputObject[INPUT_VIDEO_OVER_IP_NDIHX_STREAM_TRANSMISSION_TYPE_UNI_CAST_PORT_AUDIO].get() == 10670) {
                    objErrCode = MSG_STATUS.mID_0026;
                    return capi_DispError(txtNDIHXInputObject[INPUT_VIDEO_OVER_IP_NDIHX_STREAM_TRANSMISSION_TYPE_UNI_CAST_PORT_AUDIO].getInputObject(), objErrCode);
                }
            }
            else if (selectNDIHXTransmissionType.get() == 'multi') {
                //HTTPポ�Eトを使用してH.264画像、E�E��E�声を�E信する,IPv4アクセスのみに制限される、E
                if (internetModeRadioButtonGroup.getSelectedValue() == 1) {
                    if (chknet_ipaddr_familly(txtNDIHXInputObject[INPUT_VIDEO_OVER_IP_NDIHX_STREAM_MULTI_CAST_ADDRESS].get()) == "IPv6") {
                        objErrCode = MSG_STATUS.mID_0043;
                        return capi_DispError(txtNDIHXInputObject[INPUT_VIDEO_OVER_IP_NDIHX_STREAM_MULTI_CAST_ADDRESS].getInputObject(), objErrCode);
                    }
                }
                if (!chknet_CheckMultiAddr(txtNDIHXInputObject[INPUT_VIDEO_OVER_IP_NDIHX_STREAM_MULTI_CAST_ADDRESS].get())) {
                    // chknet_CheckMultiAddr冁E�E��E�objErrCodeが設定される
                    return capi_DispError(txtNDIHXInputObject[INPUT_VIDEO_OVER_IP_NDIHX_STREAM_MULTI_CAST_ADDRESS].getInputObject(), objErrCode);
                }
                if (!CheckPort(txtNDIHXInputObject[INPUT_VIDEO_OVER_IP_NDIHX_STREAM_MULTI_CAST_PORT].get())) {
                    objErrCode = MSG_STATUS.mID_0009;
                    return capi_DispError(txtNDIHXInputObject[INPUT_VIDEO_OVER_IP_NDIHX_STREAM_MULTI_CAST_PORT].getInputObject(), objErrCode);
                }
                if (!CheckNum(txtNDIHXInputObject[INPUT_VIDEO_OVER_IP_NDIHX_STREAM_MULTI_CAST_PORT].get())) {
                    objErrCode = MSG_STATUS.mID_0009;
                    return capi_DispError(txtNDIHXInputObject[INPUT_VIDEO_OVER_IP_NDIHX_STREAM_MULTI_CAST_PORT].getInputObject(), objErrCode);
                }
                if (txtNDIHXInputObject[INPUT_VIDEO_OVER_IP_NDIHX_STREAM_MULTI_CAST_PORT].get() == 10670) {
                    objErrCode = MSG_STATUS.mID_0026;
                    return capi_DispError(txtNDIHXInputObject[INPUT_VIDEO_OVER_IP_NDIHX_STREAM_MULTI_CAST_PORT].getInputObject(), objErrCode);
                }
                if (!CheckNum(txtNDIHXInputObject[INPUT_VIDEO_OVER_IP_NDIHX_STREAM_MULTI_CAST_HTL_HOP_LIMIT].get())) {
                    objErrCode = MSG_STATUS.mID_0009;
                    return capi_DispError(txtNDIHXInputObject[INPUT_VIDEO_OVER_IP_NDIHX_STREAM_MULTI_CAST_HTL_HOP_LIMIT].getInputObject(), objErrCode);
                }
                if ((txtNDIHXInputObject[INPUT_VIDEO_OVER_IP_NDIHX_STREAM_MULTI_CAST_HTL_HOP_LIMIT].get() < 1) || (txtNDIHXInputObject[INPUT_VIDEO_OVER_IP_NDIHX_STREAM_MULTI_CAST_HTL_HOP_LIMIT].get() > 254)) {
                    objErrCode = MSG_STATUS.mID_0009;
                    return capi_DispError(txtNDIHXInputObject[INPUT_VIDEO_OVER_IP_NDIHX_STREAM_MULTI_CAST_HTL_HOP_LIMIT].getInputObject(), objErrCode);
                }
            }
            return true;
        }

        function getNDIHXSettingData() {
            var data = {};
            if (!transmissionRadioButtonGroup.isDisabled()) {
                data['h264_transmit'] = transmissionRadioButtonGroup.getSelectedValue();
            }
            if (!internetModeRadioButtonGroup.isDisabled()) {
                data['h264_rtsp_mode'] = internetModeRadioButtonGroup.getSelectedValue();
            }
            if (selectNDIHXImageCaptureSize.getStatus() != Select.STATUS_DISABLED) {
                data['h264_resolution'] = selectNDIHXImageCaptureSize.get();
            }
            if (selectNDIHXTransmissionPriority.getStatus() != Select.STATUS_DISABLED) {
                data['f_priority'] = selectNDIHXTransmissionPriority.get();
            }
            if (selectNDIHXFrameRate.getStatus() != Select.STATUS_DISABLED) {
                data['framerate'] = selectNDIHXFrameRate.get();
            }
            if (selectNDIHXMaxBitRateMax.getStatus() != Select.STATUS_DISABLED) {
                data['h264_bandwidth'] = selectNDIHXMaxBitRateMax.get();
            }
            if (selectNDIHXMaxBitRateMin.getStatus() != Select.STATUS_DISABLED) {
                data['h264_bandwidth_min'] = selectNDIHXMaxBitRateMin.get();
            }
            if (selectNDIHXImageQuality.getStatus() != Select.STATUS_DISABLED) {
                data['h264_quality'] = selectNDIHXImageQuality.get();
            }
            if (selectNDIHXTransmissionType.getStatus() != Select.STATUS_DISABLED) {
                data['h264_unimulti'] = selectNDIHXTransmissionType.get();
            }
            if (txtNDIHXInputObject[INPUT_VIDEO_OVER_IP_NDIHX_STREAM_TRANSMISSION_TYPE_UNI_CAST_PORT_IMAGE].getStatus() != Input.STATUS_DISABLED) {
                data['unicast_port'] = txtNDIHXInputObject[INPUT_VIDEO_OVER_IP_NDIHX_STREAM_TRANSMISSION_TYPE_UNI_CAST_PORT_IMAGE].get();
            }
            if (txtNDIHXInputObject[INPUT_VIDEO_OVER_IP_NDIHX_STREAM_TRANSMISSION_TYPE_UNI_CAST_PORT_AUDIO].getStatus() != Input.STATUS_DISABLED) {
                data['unicast_audio_port'] = txtNDIHXInputObject[INPUT_VIDEO_OVER_IP_NDIHX_STREAM_TRANSMISSION_TYPE_UNI_CAST_PORT_AUDIO].get();
            }
            if (txtNDIHXInputObject[INPUT_VIDEO_OVER_IP_NDIHX_STREAM_MULTI_CAST_ADDRESS].getStatus() != Input.STATUS_DISABLED) {
                data['multicast_addr'] = txtNDIHXInputObject[INPUT_VIDEO_OVER_IP_NDIHX_STREAM_MULTI_CAST_ADDRESS].get();
            }
            if (txtNDIHXInputObject[INPUT_VIDEO_OVER_IP_NDIHX_STREAM_MULTI_CAST_PORT].getStatus() != Input.STATUS_DISABLED) {
                data['multicast_port'] = txtNDIHXInputObject[INPUT_VIDEO_OVER_IP_NDIHX_STREAM_MULTI_CAST_PORT].get();
            }
            if (txtNDIHXInputObject[INPUT_VIDEO_OVER_IP_NDIHX_STREAM_MULTI_CAST_HTL_HOP_LIMIT].getStatus() != Input.STATUS_DISABLED) {
                data['multicast_ttl'] = txtNDIHXInputObject[INPUT_VIDEO_OVER_IP_NDIHX_STREAM_MULTI_CAST_HTL_HOP_LIMIT].get();
            }
            return data;
        }

        function getNDIHXSettingData2() {
            var data = {};
            data['h264_unimulti'] = selectNDIHXTransmissionType.get();
            var ipaddr = txtNDIHXInputObject[INPUT_VIDEO_OVER_IP_NDIHX_STREAM_MULTI_CAST_ADDRESS].get();
            if (ipaddr != NDIHX_multicast_addr) {
                var ip = ipaddr.split(".");
                if (ip[3] == 255) {
                    ip[3] = 254;
                    data['multicast_addr'] = ip.join(".");
                } else {
                    ip[3] = parseInt(ip[3]) + 1;
                    data['multicast_addr'] = ip.join(".");
                }
                NDIHX_multicast_addr = txtNDIHXInputObject[INPUT_VIDEO_OVER_IP_NDIHX_STREAM_MULTI_CAST_ADDRESS].get();
            }
            var ndiPort = txtNDIHXInputObject[INPUT_VIDEO_OVER_IP_NDIHX_STREAM_MULTI_CAST_PORT].get();
            if (ndiPort != NDIHX_multicast_port) {
                data['multicast_port'] = txtNDIHXInputObject[INPUT_VIDEO_OVER_IP_NDIHX_STREAM_MULTI_CAST_PORT].get();
                NDIHX_multicast_port = txtNDIHXInputObject[INPUT_VIDEO_OVER_IP_NDIHX_STREAM_MULTI_CAST_PORT].get();
            }

            return data;
        }

        return {
            build: function (type) {
                return buildNDIHX(type);
            }
        }
    }

    /**
     * settingRTMPServerSetup画面:settingRTMPServerSetup制御に関わる画面クラス
     * @class settingRTMPServerSetup画面:settingRTMPServerSetup制御に関わる画面クラス
     * @return {{build: buildJPEG, rebuild: rebuild}} build 構築�E琁E
     * @return {function} rebuild 再構築�E琁E
     * @constructor
     */
    function settingRTMPServerSetup() {
        /**
         * 構築フラグ
         * @type boolean
         */
        let buildFlag_RTMPServerSetup = false;
        /**
         * label定義
         * @type number
         */
        const TXT_VIDEO_OVER_IP_RTMP_SERVERSETUP_URL_TYPE = 0;
        /**
         * label定義
         * @type number
         */
        const TXT_VIDEO_OVER_IP_RTMP_SERVERSETUP_URL = 1;
        /**
         * label定義
         * @type number
         */
        const TXT_VIDEO_OVER_IP_RTMP_SERVERSETUP_SERVER_URL = 2;
        /**
         * label定義
         * @type number
         */
        const TXT_VIDEO_OVER_IP_RTMP_SERVERSETUP_STREAM_KEY = 3;
        /**
         * label定義
         * @type number
         */
        const INPUT_VIDEO_OVER_IP_RTMP_SERVERSETUP_SERVER_URL = 0;
        /**
         * label定義
         * @type number
         */
        const INPUT_VIDEO_OVER_IP_RTMP_SERVERSETUP_STREAM_KEY = 1;

        let txtRTMPServerSetupObject = [];
        let txtHRTMPServerSetupInputObject = [];
        let typeRadioButtonGroup;
        let RTMPServerSetup_set_button;
        let RTMPServerSetup_set_button1;
        let rtmpParam = {};
        let lineObject1;
        let lineObject2;
        let lineObject3;
        let lineObject4;
        let lineObject5;


        /**
         *
         * @param type
         * @returns {{}}
         */
        function buildRTMPServerSetup(type) {
            rtmpParam = getRtmpParam();
            if (!buildFlag_RTMPServerSetup) {
                buildFlag_RTMPServerSetup = true;
                // URL type
                txtRTMPServerSetupObject[TXT_VIDEO_OVER_IP_RTMP_SERVERSETUP_URL_TYPE] = TextCtrl('setup_videoOverIp_RTMP_serverSetup_label', 'setup_videoOverIp_RTMP_serverSetup_url_type_label', NPTZ_WORDING.wID_0248);
                // URL type radioButtonItems
                typeRadioButtonGroup = RadioButtonGroupCtrl("setup_videoOverIp_RTMP_serverSetup_form", "setup_videoOverIp_RTMP_serverSetup_url_", RADIO_GROUP.rID_0027, rtmpParam['type'], callbackRTMPServerSetupUrlType);
                LineCtrl('setup_videoOverIp_RTMP_serverSetup_main', 'horizontal', 73, 0, 1320, "setup_videoOverIp_RTMP_serverSetup_url_type_label", "83");

                // URL
                txtRTMPServerSetupObject[TXT_VIDEO_OVER_IP_RTMP_SERVERSETUP_URL] = TextCtrl('setup_videoOverIp_RTMP_serverSetup_label', 'setup_videoOverIp_RTMP_serverSetup_url_label', NPTZ_WORDING.wID_0249);
                lineObject1 = LineCtrl('setup_videoOverIp_RTMP_serverSetup_main', 'vertical', 110, 40, 78, "setup_videoOverIp_RTMP_serverSetup_url_label");
                lineObject2 = LineCtrl('setup_videoOverIp_RTMP_serverSetup_main', 'vertical', 110, 40, 48, 'setup_videoOverIp_RTMP_serverSetup_url_label_2');
                lineObject2.hide();
                txtRTMPServerSetupObject[TXT_VIDEO_OVER_IP_RTMP_SERVERSETUP_SERVER_URL] = TextCtrl('setup_videoOverIp_RTMP_serverSetup_label', 'setup_videoOverIp_RTMP_serverSetup_serverURL_label', NPTZ_WORDING.wID_0171);
                txtHRTMPServerSetupInputObject[INPUT_VIDEO_OVER_IP_RTMP_SERVERSETUP_SERVER_URL] = InputCtrl("setup_videoOverIp_RTMP_serverSetup_form", 'server_url', 'server_url', 'setup_videoOverIp_RTMP_serverSetup_serverURL_input', rtmpParam['url']);
                txtRTMPServerSetupObject[TXT_VIDEO_OVER_IP_RTMP_SERVERSETUP_STREAM_KEY] = TextCtrl('setup_videoOverIp_RTMP_serverSetup_label', 'setup_videoOverIp_RTMP_serverSetup_streamKey_label', NPTZ_WORDING.wID_0250);
                txtHRTMPServerSetupInputObject[INPUT_VIDEO_OVER_IP_RTMP_SERVERSETUP_STREAM_KEY] = InputCtrl("setup_videoOverIp_RTMP_serverSetup_form", 'stream_key', 'stream_key', 'setup_videoOverIp_RTMP_serverSetup_streamKey_input', rtmpParam['key']);
                lineObject5 = LineCtrl('setup_videoOverIp_RTMP_serverSetup_main', 'horizontal', 210, 0, 1320, "setup_videoOverIp_RTMP_serverSetup_serverUrl_label", "82");
                lineObject3 = LineCtrl('setup_videoOverIp_RTMP_serverSetup_main', 'horizontal', 210, 0, 1320, "setup_videoOverIp_RTMP_serverSetup_streamKey_label", "83");
                lineObject4 = LineCtrl('setup_videoOverIp_RTMP_serverSetup_main', 'horizontal', 170, 0, 1320, 'setup_videoOverIp_RTMP_serverSetup_streamKey_label_2', "83");
                lineObject4.hide();

                RTMPServerSetup_set_button = ButtonCtrl("setup_videoOverIp_RTMP_serverSetup_form", "setup_videoOverIp_RTMP_serverSetup_set_button", NPTZ_WORDING.wID_0141, callbackRTMPServerSetupSetButton);
                RTMPServerSetup_set_button.getButtonObject().addClass('button_class');
                RTMPServerSetup_set_button.show();
                RTMPServerSetup_set_button.displayOff();
                RTMPServerSetup_set_button1 = ButtonCtrl("setup_videoOverIp_RTMP_serverSetup_form", "setup_videoOverIp_RTMP_serverSetup_set_button1", NPTZ_WORDING.wID_0141, callbackRTMPServerSetupSetButton);
                RTMPServerSetup_set_button1.getButtonObject().addClass('button_class');
                RTMPServerSetup_set_button1.show();
                RTMPServerSetup_set_button1.displayOff();

                for (let text in txtRTMPServerSetupObject) {
                    txtRTMPServerSetupObject[text].show();
                }
                for (let text in txtHRTMPServerSetupInputObject) {
                    txtHRTMPServerSetupInputObject[text].show();
                    txtHRTMPServerSetupInputObject[text].displayOff();
                }
                changeServerSetupPage(rtmpParam.type);
            } else {
                rebuild();
            }
        }

        function rebuild() {
            typeRadioButtonGroup.setSelectedValue(rtmpParam.type);
            txtHRTMPServerSetupInputObject[INPUT_VIDEO_OVER_IP_RTMP_SERVERSETUP_SERVER_URL].val(rtmpParam.url);
            txtHRTMPServerSetupInputObject[INPUT_VIDEO_OVER_IP_RTMP_SERVERSETUP_STREAM_KEY].val(rtmpParam.key);
            changeServerSetupPage(rtmpParam.type);
        }

        /**
         *
         */
        function callbackRTMPServerSetupUrlType(type) {
            changeServerSetupPage(type);
        }

        function changeServerSetupPage(type) {
            if (type == 1) {
                lineObject1.show();
                lineObject2.hide();
                lineObject3.show();
                lineObject4.hide();
                RTMPServerSetup_set_button.show();
                RTMPServerSetup_set_button.displayOff();
                RTMPServerSetup_set_button1.hide();
                $(".setup_videoOverIp_RTMP_serverSetup_streamKey_label").show();
                $(".setup_videoOverIp_RTMP_serverSetup_streamKey_input").show();
            } else {
                lineObject1.hide();
                lineObject2.show();
                lineObject3.hide();
                lineObject4.show();
                RTMPServerSetup_set_button.hide();
                RTMPServerSetup_set_button1.show();
                RTMPServerSetup_set_button1.displayOff();
                $(".setup_videoOverIp_RTMP_serverSetup_streamKey_label").hide();
                $(".setup_videoOverIp_RTMP_serverSetup_streamKey_input").hide();
            }
        }

        /**
         *
         */
        function callbackRTMPServerSetupSetButton(mouse) {
            if (mouse == Button.MOUSE_DOWN) {
                setRtmpParam(typeRadioButtonGroup.getSelectedValue(),
                    txtHRTMPServerSetupInputObject[INPUT_VIDEO_OVER_IP_RTMP_SERVERSETUP_SERVER_URL].get(),
                    txtHRTMPServerSetupInputObject[INPUT_VIDEO_OVER_IP_RTMP_SERVERSETUP_STREAM_KEY].get());
            }
        }

        return {
            build: function (type) {
                return buildRTMPServerSetup(type);
            }
        }
    }

    /**
     * settingRTMPStreamingFormat画面:settingJPEG制御に関わる画面クラス
     * @class settingRTMPStreamingFormat画面:settingJPEG制御に関わる画面クラス
     * @return {{build: buildRTMPStreamingFormat, rebuild: rebuild}} build 構築�E琁E
     * @return {function} rebuild 再構築�E琁E
     * @constructor
     */
    function settingRTMPStreamingFormat() {
        /**
         * 構築フラグ
         * @type boolean
         */
        let buildFlag_RTMP_streamingFormat = false;
        /**
         * 構築フラグ
         * @type boolean
         */
        let buildFlag_NDI2_streamingFormat = false;
        /**
         * label定義
         * @type number
         */
        const TXT_VIDEO_OVER_IP_RTMP_STREAMINGFORMAT_TRANSMISSION = 0;
        const TXT_VIDEO_OVER_IP_RTMP_STREAMINGFORMAT_IMAGE_CAPTURE_SIZE = 1;
        const TXT_VIDEO_OVER_IP_RTMP_STREAM_TRANSMISSION_PRIORITY = 2
        const TXT_VIDEO_OVER_IP_RTMP_STREAMINGFORMAT_FRAME_RATE = 3;
        const TXT_VIDEO_OVER_IP_RTMP_STREAMINGFORMAT_MAX_BIT_RATE = 4;
        const TXT_VIDEO_OVER_IP_RTMP_STREAMINGFORMAT_MAX_BIT_RATE_MAX = 5;
        const TXT_VIDEO_OVER_IP_H264_PROFILE_TYPE = 6;
        let selectRTMPStreamingFormatImageCaptureSize;
        let selectRTMPTransmissionPriority;
        let selectRTMPStreamingFormatFrameRate;
        let selectRTMPStreamingFormatMaxBitRateMax;
        let txtRTMPStreamingFormatObject = [];
        let RTMP_streamingFormat_transmit;
        let RMTP_f_priority;
        let RTMP_streamingFormat_resolution;
        let RTMP_streamingFormat_framerate;
        let RTMP_streamingFormat_bandwidth;
        let profileTypeRadioButtonGroup;

        let h264_profile;
        //NDI_HX_V2
        let selectNDIStreamingFormatImageCaptureSize;
        let selectNDIStreamingFormatFrameRate;
        let selectNDIStreamingFormatMaxBitRateMax;
        let txtNDIStreamingFormatObject = [];



        /**
         * input[] : text
         * @type txtRTMPStreamingFormatInputObject[]
         */
        let transmissionRadioButtonGroup;
        let RTMP_streamingFormat_set_button;
        let NDI_streamingFormat_set_button;
        function getCurrentValueOfRTMPStreamingFormat() {
            objVOIP = cparam_getVideoOverIpInfo();
            RTMP_streamingFormat_transmit = objVOIP["h264_transmit_ch1"];
            if (RTMP_streamingFormat_transmit < 0) {
                RTMP_streamingFormat_transmit = objVOIP["h265_transmit_ch1"];
                RTMP_streamingFormat_resolution = objVOIP["h265_resolution_ch1"];
                RTMP_streamingFormat_framerate = objVOIP["h265_framerate_ch1"];
                RTMP_streamingFormat_bandwidth = objVOIP["h265_bandwidth_ch1"];
                RMTP_f_priority = objVOIP["h265_f_priority_ch1"]
                setTimeout(function () {
                    $('.setup_videoOverIp_RTMP_streamingFormat_imageCaptureSize_label').addClass("srt_h265_image_size");
                    $('.setup_videoOverIp_RTMP_streamingFormat_imageCaptureSize_select').addClass("srt_h265_image_size_option");
                    $('.setup_videoOverIp_RTMP_streamingFormat_frame_rate_label').addClass("srt_h265_frame_rate");
                    $('.setup_videoOverIp_RTMP_streamingFormat_frame_rate_select').addClass("srt_h265_frame_rate_option");
                    $('.setup_videoOverIp_RTMP_streamingFormat_maxBitRate_label').addClass("srt_h265_max_bit_rate");
                    $('.setup_videoOverIp_RTMP_streamingFormat_max_bit_rate_max_select').addClass("srt_h265_max_bit_rate_option");
                    $('.setup_videoOverIp_RTMP_streamingFormat_maxBitRate_max_label').addClass("srt_h265_max_bit_rate_message");
                    $('.setup_videoOverIp_RTMP_streamingFormat_maxBitRate_label_Line,.setup_videoOverIp_rtmp_profile_type_label').addClass("srt_h265_display_none");
                    $('.setup_videoOverIp_rtmp_profile_type_High_radio,.setup_videoOverIp_rtmp_profile_type_High_label,.setup_videoOverIp_rtmp_profile_type_Main_radio,.setup_videoOverIp_rtmp_profile_type_Main_label,.setup_videoOverIp_rtmp_profile_type_Baseline_radio,.setup_videoOverIp_rtmp_profile_type_Baseline_label').addClass("srt_h265_display_none");
                    $('.setup_videoOverIp_RTMP_streamingFormat_set_button').addClass("srt_h265_set_button");
                }, 100)
            } else {
                RTMP_streamingFormat_resolution = objVOIP["h264_resolution_ch1"];
                RTMP_streamingFormat_framerate = objVOIP["h264_framerate_ch1"];
                RTMP_streamingFormat_bandwidth = objVOIP["h264_bandwidth_ch1"];
                h264_profile = objVOIP["h264_profile_ch1"]
                RMTP_f_priority = objVOIP["h264_f_priority_ch1"]
                setTimeout(function () {
                    $('.setup_videoOverIp_RTMP_streamingFormat_imageCaptureSize_label').removeClass("srt_h265_image_size");
                    $('.setup_videoOverIp_RTMP_streamingFormat_imageCaptureSize_select').removeClass("srt_h265_image_size_option");
                    $('.setup_videoOverIp_RTMP_streamingFormat_frame_rate_label').removeClass("srt_h265_frame_rate");
                    $('.setup_videoOverIp_RTMP_streamingFormat_frame_rate_select').removeClass("srt_h265_frame_rate_option");
                    $('.setup_videoOverIp_RTMP_streamingFormat_maxBitRate_label').removeClass("srt_h265_max_bit_rate");
                    $('.setup_videoOverIp_RTMP_streamingFormat_max_bit_rate_max_select').removeClass("srt_h265_max_bit_rate_option");
                    $('.setup_videoOverIp_RTMP_streamingFormat_maxBitRate_max_label').removeClass("srt_h265_max_bit_rate_message");
                    $('.setup_videoOverIp_RTMP_streamingFormat_maxBitRate_label_Line,.setup_videoOverIp_rtmp_profile_type_label').removeClass("srt_h265_display_none");
                    $('.setup_videoOverIp_rtmp_profile_type_High_radio,.setup_videoOverIp_rtmp_profile_type_High_label,.setup_videoOverIp_rtmp_profile_type_Main_radio,.setup_videoOverIp_rtmp_profile_type_Main_label,.setup_videoOverIp_rtmp_profile_type_Baseline_radio,.setup_videoOverIp_rtmp_profile_type_Baseline_label').removeClass("srt_h265_display_none");
                    $('.setup_videoOverIp_RTMP_streamingFormat_set_button').removeClass("srt_h265_set_button");
                }, 100)
            }

        }

        function buildRTMPStreamingFormat(type) {
            if (type == "NDI_2") {
                getCurrentValueOfRTMPStreamingFormat(type);
                if (!buildFlag_NDI2_streamingFormat) {
                    buildFlag_NDI2_streamingFormat = true;
                    // // H.264 transmission
                    // txtRTMPStreamingFormatObject[TXT_VIDEO_OVER_IP_RTMP_STREAMINGFORMAT_TRANSMISSION] = TextCtrl('setup_videoOverIp_NDI2_streamingFormat_label', 'setup_videoOverIp_RTMP_streamingFormat_transmission_label', NPTZ_WORDING.wID_0251);
                    // // H.264 transmission radioButtonItems
                    // transmissionRadioButtonGroup = RadioButtonGroupCtrl("setup_videoOverIp_NDI2_streamingFormat_form", "setup_videoOverIp_RTMP_streamingFormat_transmission_", RADIO_GROUP.rID_0001, RTMP_streamingFormat_transmit, callbackRTMPStreamingFormatTransmission);
                    // LineCtrl('setup_videoOverIp_RTMP_streamingFormat_main', 'horizontal', 73, 0, "", "setup_videoOverIp_RTMP_streamingFormat_transmission_label", "83");
                    // if(sysCommon.streamingMode == CONST_STREAM_MODE_TS_UDP){
                    //     txtRTMPStreamingFormatObject[TXT_VIDEO_OVER_IP_RTMP_STREAMINGFORMAT_TRANSMISSION].set(NPTZ_WORDING.wID_0561)
                    // }else{
                    //     if(type == 17){
                    //         txtRTMPStreamingFormatObject[TXT_VIDEO_OVER_IP_RTMP_STREAMINGFORMAT_TRANSMISSION].set(NPTZ_WORDING.wID_0523)
                    //     }else{
                    //         txtRTMPStreamingFormatObject[TXT_VIDEO_OVER_IP_RTMP_STREAMINGFORMAT_TRANSMISSION].set(NPTZ_WORDING.wID_0251)
                    //     }
                    // }


                    // image capture size
                    txtNDIStreamingFormatObject[TXT_VIDEO_OVER_IP_RTMP_STREAMINGFORMAT_IMAGE_CAPTURE_SIZE] = TextCtrl('setup_videoOverIp_NDI2_streamingFormat_label', 'setup_videoOverIp_RTMP_streamingFormat_imageCaptureSize_label', NPTZ_WORDING.wID_0102);
                    selectNDIStreamingFormatImageCaptureSize = SelectCtrl('setup_videoOverIp_NDI2_streamingFormat_form', "", "setup_videoOverIp_RTMP_streamingFormat_imageCaptureSize_select", "setup_videoOverIp_RTMP_streamingFormat_imageCaptureSize_select", callbackNDIImageCaptureSize, '', sysConst.getH264ImageCaptureSizeItems(CONST_H264_CH1), RTMP_streamingFormat_resolution);
                    selectNDIStreamingFormatImageCaptureSize.show();
                    selectNDIStreamingFormatImageCaptureSize.displayOn();
                    LineCtrl('setup_videoOverIp_NDI2_streamingFormat_main', 'horizontal', 141, 0, "", "setup_videoOverIp_RTMP_streamingFormat_imageCaptureSize_label", "97");

                    // Frame rate
                    txtNDIStreamingFormatObject[TXT_VIDEO_OVER_IP_RTMP_STREAMINGFORMAT_FRAME_RATE] = TextCtrl('setup_videoOverIp_NDI2_streamingFormat_label', 'setup_videoOverIp_RTMP_streamingFormat_frame_rate_label', NPTZ_WORDING.wID_0105);
                    selectNDIStreamingFormatFrameRate = SelectCtrl('setup_videoOverIp_NDI2_streamingFormat_form', "", "setup_videoOverIp_RTMP_streamingFormat_frame_rate_select", "setup_videoOverIp_RTMP_streamingFormat_frame_rate_select", callbackNDIFrameRate, '', sysConst.getH264FrameRateItems(CONST_H264_CH1, RTMP_streamingFormat_resolution), RTMP_streamingFormat_framerate);
                    selectNDIStreamingFormatFrameRate.show();
                    selectNDIStreamingFormatFrameRate.displayOn();
                    LineCtrl('setup_videoOverIp_NDI2_streamingFormat_main', 'horizontal', 209, 0, "", "setup_videoOverIp_RTMP_streamingFormat_frame_rate_label", "97");
                    // Transmission priority
                    txtNDIStreamingFormatObject[TXT_VIDEO_OVER_IP_RTMP_STREAM_TRANSMISSION_PRIORITY] = TextCtrl('setup_videoOverIp_NDI2_streamingFormat_label', 'setup_videoOverIp_RTMP_stream_transmission_priority_label', NPTZ_WORDING.wID_0726);
                    selectRTMPTransmissionPriority = SelectCtrl('setup_videoOverIp_NDI2_streamingFormat_form', "", "setup_videoOverIp_RTMP_stream_transmission_priority_select", "setup_videoOverIp_RTMP_stream_transmission_priority_select", '', '', TRANSMISSION_PRIORITY_OPTIONS, RMTP_f_priority);
                    selectRTMPTransmissionPriority.show();
                    selectRTMPTransmissionPriority.displayOn();
                    LineCtrl('setup_videoOverIp_NDI2_streamingFormat_main', 'horizontal', 277, 0, "", "setup_videoOverIp_RTMP_stream_transmission_priority_label", "98");

                    // Max bit rate(per client)
                    let h264BitRateOptions = sysConst.getH264BitRate(RTMP_streamingFormat_resolution, RTMP_streamingFormat_framerate, h264_profile);
                    txtNDIStreamingFormatObject[TXT_VIDEO_OVER_IP_RTMP_STREAMINGFORMAT_MAX_BIT_RATE] = TextCtrl('setup_videoOverIp_NDI2_streamingFormat_label', 'setup_videoOverIp_RTMP_streamingFormat_maxBitRate_label', NPTZ_WORDING.wID_0107);
                    txtNDIStreamingFormatObject[TXT_VIDEO_OVER_IP_RTMP_STREAMINGFORMAT_MAX_BIT_RATE_MAX] = TextCtrl('setup_videoOverIp_NDI2_streamingFormat_form', 'setup_videoOverIp_RTMP_streamingFormat_maxBitRate_max_label', NPTZ_WORDING.wID_0237);
                    selectNDIStreamingFormatMaxBitRateMax = SelectCtrl('setup_videoOverIp_NDI2_streamingFormat_form', "", "setup_videoOverIp_RTMP_streamingFormat_max_bit_rate_max_select", "setup_videoOverIp_RTMP_streamingFormat_max_bit_rate_max_select", '', '', h264BitRateOptions, RTMP_streamingFormat_bandwidth);
                    selectNDIStreamingFormatMaxBitRateMax.show();
                    selectNDIStreamingFormatMaxBitRateMax.displayOn();
                    LineCtrl('setup_videoOverIp_NDI2_streamingFormat_main', 'horizontal', 277, 0, "", "setup_videoOverIp_RTMP_streamingFormat_maxBitRate_label", "97");
                    LineCtrl('setup_videoOverIp_NDI2_streamingFormat_main', 'horizontal', 277, 0, "", "setup_videoOverIp_RTMP_streamingFormat_maxBitRate_bottom_label", "97");
                    NDI_streamingFormat_set_button = ButtonCtrl("setup_videoOverIp_NDI2_streamingFormat_set_btn_area", "setup_videoOverIp_RTMP_streamingFormat_set_button", NPTZ_WORDING.wID_0141, callbackNDIStreamingFormatSetButton);
                    NDI_streamingFormat_set_button.getButtonObject().addClass('button_class');
                    NDI_streamingFormat_set_button.show();
                    NDI_streamingFormat_set_button.displayOff();
                    for (var text in txtNDIStreamingFormatObject) {
                        txtNDIStreamingFormatObject[text].show();
                    }
                    //changeItemStatus();
                } else {
                    rebuild(type);
                }
            } else {
                getCurrentValueOfRTMPStreamingFormat(type);
                if (!buildFlag_RTMP_streamingFormat) {

                    buildFlag_RTMP_streamingFormat = true;
                    // H.264 transmission
                    txtRTMPStreamingFormatObject[TXT_VIDEO_OVER_IP_RTMP_STREAMINGFORMAT_TRANSMISSION] = TextCtrl('setup_videoOverIp_RTMP_streamingFormat_label', 'setup_videoOverIp_RTMP_streamingFormat_transmission_label', NPTZ_WORDING.wID_0251);
                    // H.264 transmission radioButtonItems
                    transmissionRadioButtonGroup = RadioButtonGroupCtrl("setup_videoOverIp_RTMP_streamingFormat_form", "setup_videoOverIp_RTMP_streamingFormat_transmission_", RADIO_GROUP.rID_0001, RTMP_streamingFormat_transmit, callbackRTMPStreamingFormatTransmission);
                    LineCtrl('setup_videoOverIp_RTMP_streamingFormat_main', 'horizontal', 73, 0, "", "setup_videoOverIp_RTMP_streamingFormat_transmission_label", "83");
                    if (sysCommon.streamingMode == CONST_STREAM_MODE_TS_UDP) {
                        txtRTMPStreamingFormatObject[TXT_VIDEO_OVER_IP_RTMP_STREAMINGFORMAT_TRANSMISSION].set(NPTZ_WORDING.wID_0561)
                    } else {
                        if (type == 17) {
                            txtRTMPStreamingFormatObject[TXT_VIDEO_OVER_IP_RTMP_STREAMINGFORMAT_TRANSMISSION].set(NPTZ_WORDING.wID_0523)
                        } else {
                            txtRTMPStreamingFormatObject[TXT_VIDEO_OVER_IP_RTMP_STREAMINGFORMAT_TRANSMISSION].set(NPTZ_WORDING.wID_0251)
                        }
                    }

                    //Profile type
                    txtRTMPStreamingFormatObject[TXT_VIDEO_OVER_IP_H264_PROFILE_TYPE] = TextCtrl('setup_videoOverIp_RTMP_streamingFormat_label', 'setup_videoOverIp_rtmp_profile_type_label', NPTZ_WORDING.wID_0592);
                    profileTypeRadioButtonGroup = RadioButtonGroupCtrl("setup_videoOverIp_RTMP_streamingFormat_form", "setup_videoOverIp_rtmp_profile_type_", RADIO_GROUP.rID_0069, h264_profile, callbackH264ProfileType);
                    if (sysCommon.streamingMode == CONST_STREAM_MODE_RTMP_UHD || sysCommon.streamingMode == CONST_STREAM_MODE_SRT_H264_UHD) {
                        profileTypeRadioButtonGroup.displayDisabled();
                    }
                    LineCtrl('setup_videoOverIp_RTMP_streamingFormat_main', 'horizontal', 141, 0, "", "setup_videoOverIp_RTMP_streamingFormat_profileType_label", "83");

                    // image capture size
                    txtRTMPStreamingFormatObject[TXT_VIDEO_OVER_IP_RTMP_STREAMINGFORMAT_IMAGE_CAPTURE_SIZE] = TextCtrl('setup_videoOverIp_RTMP_streamingFormat_label', 'setup_videoOverIp_RTMP_streamingFormat_imageCaptureSize_label', NPTZ_WORDING.wID_0102);
                    selectRTMPStreamingFormatImageCaptureSize = SelectCtrl('setup_videoOverIp_RTMP_streamingFormat_form', "", "setup_videoOverIp_RTMP_streamingFormat_imageCaptureSize_select", "setup_videoOverIp_RTMP_streamingFormat_imageCaptureSize_select", callbackRTMPImageCaptureSize, '', sysConst.getH264ImageCaptureSizeItems(CONST_H264_CH1), RTMP_streamingFormat_resolution);
                    selectRTMPStreamingFormatImageCaptureSize.show();
                    selectRTMPStreamingFormatImageCaptureSize.displayOn();
                    LineCtrl('setup_videoOverIp_RTMP_streamingFormat_main', 'horizontal', 141, 0, "", "setup_videoOverIp_RTMP_streamingFormat_imageCaptureSize_label", "83");
                    // Transmission priority
                    txtRTMPStreamingFormatObject[TXT_VIDEO_OVER_IP_RTMP_STREAM_TRANSMISSION_PRIORITY] = TextCtrl('setup_videoOverIp_RTMP_streamingFormat_label', 'setup_videoOverIp_RTMP_stream_transmission_priority_label', NPTZ_WORDING.wID_0726);
                    selectRTMPTransmissionPriority = SelectCtrl('setup_videoOverIp_RTMP_streamingFormat_form', "", "setup_videoOverIp_RTMP_stream_transmission_priority_select", "setup_videoOverIp_RTMP_stream_transmission_priority_select", '', '', TRANSMISSION_PRIORITY_OPTIONS, RMTP_f_priority);
                    selectRTMPTransmissionPriority.show();
                    selectRTMPTransmissionPriority.displayOn();
                    LineCtrl('setup_videoOverIp_RTMP_streamingFormat_main', 'horizontal', 277, 0, "", "setup_videoOverIp_RTMP_stream_transmission_priority_label", "98");

                    // Frame rate
                    txtRTMPStreamingFormatObject[TXT_VIDEO_OVER_IP_RTMP_STREAMINGFORMAT_FRAME_RATE] = TextCtrl('setup_videoOverIp_RTMP_streamingFormat_label', 'setup_videoOverIp_RTMP_streamingFormat_frame_rate_label', NPTZ_WORDING.wID_0105);
                    selectRTMPStreamingFormatFrameRate = SelectCtrl('setup_videoOverIp_RTMP_streamingFormat_form', "", "setup_videoOverIp_RTMP_streamingFormat_frame_rate_select", "setup_videoOverIp_RTMP_streamingFormat_frame_rate_select", callbackRTMPFrameRate, '', sysConst.getH264FrameRateItems(CONST_H264_CH1, RTMP_streamingFormat_resolution), RTMP_streamingFormat_framerate);
                    selectRTMPStreamingFormatFrameRate.show();
                    selectRTMPStreamingFormatFrameRate.displayOn();
                    LineCtrl('setup_videoOverIp_RTMP_streamingFormat_main', 'horizontal', 209, 0, "", "setup_videoOverIp_RTMP_streamingFormat_frame_rate_label", "83");

                    // Max bit rate(per client)
                    let h264BitRateOptions = sysConst.getH264BitRate(RTMP_streamingFormat_resolution, RTMP_streamingFormat_framerate);
                    txtRTMPStreamingFormatObject[TXT_VIDEO_OVER_IP_RTMP_STREAMINGFORMAT_MAX_BIT_RATE] = TextCtrl('setup_videoOverIp_RTMP_streamingFormat_label', 'setup_videoOverIp_RTMP_streamingFormat_maxBitRate_label', NPTZ_WORDING.wID_0107);
                    txtRTMPStreamingFormatObject[TXT_VIDEO_OVER_IP_RTMP_STREAMINGFORMAT_MAX_BIT_RATE_MAX] = TextCtrl('setup_videoOverIp_RTMP_streamingFormat_form', 'setup_videoOverIp_RTMP_streamingFormat_maxBitRate_max_label', NPTZ_WORDING.wID_0237);
                    selectRTMPStreamingFormatMaxBitRateMax = SelectCtrl('setup_videoOverIp_RTMP_streamingFormat_form', "", "setup_videoOverIp_RTMP_streamingFormat_max_bit_rate_max_select", "setup_videoOverIp_RTMP_streamingFormat_max_bit_rate_max_select", '', '', h264BitRateOptions, RTMP_streamingFormat_bandwidth);
                    selectRTMPStreamingFormatMaxBitRateMax.show();
                    selectRTMPStreamingFormatMaxBitRateMax.displayOn();
                    LineCtrl('setup_videoOverIp_RTMP_streamingFormat_main', 'horizontal', 277, 0, "", "setup_videoOverIp_RTMP_streamingFormat_maxBitRate_label", "83");

                    RTMP_streamingFormat_set_button = ButtonCtrl("setup_videoOverIp_RTMP_streamingFormat_set_btn_area", "setup_videoOverIp_RTMP_streamingFormat_set_button", NPTZ_WORDING.wID_0141, callbackRTMPStreamingFormatSetButton);
                    RTMP_streamingFormat_set_button.getButtonObject().addClass('button_class');
                    RTMP_streamingFormat_set_button.show();
                    RTMP_streamingFormat_set_button.displayOff();
                    for (var text in txtRTMPStreamingFormatObject) {
                        txtRTMPStreamingFormatObject[text].show();
                    }
                    changeItemStatus();
                } else {
                    rebuild(type);
                }
            }
        }

        function rebuild(type) {
            if (type == "NDI_2") {
                selectNDIStreamingFormatImageCaptureSize.refreshOptions(sysConst.getH264ImageCaptureSizeItems(CONST_H264_CH1));
                selectNDIStreamingFormatImageCaptureSize.val(RTMP_streamingFormat_resolution);
                selectNDIStreamingFormatFrameRate.refreshOptions(sysConst.getH264FrameRateItems(CONST_H264_CH1, RTMP_streamingFormat_resolution));
                selectNDIStreamingFormatFrameRate.val(RTMP_streamingFormat_framerate);
                const h264BitRateOptions = sysConst.getH264BitRate(RTMP_streamingFormat_resolution, RTMP_streamingFormat_framerate);
                selectNDIStreamingFormatMaxBitRateMax.refreshOptions(h264BitRateOptions);
                selectNDIStreamingFormatMaxBitRateMax.val(RTMP_streamingFormat_bandwidth);
                //changeItemStatus();
            } else {
                if (sysCommon.streamingMode == CONST_STREAM_MODE_TS_UDP) {
                    txtRTMPStreamingFormatObject[TXT_VIDEO_OVER_IP_RTMP_STREAMINGFORMAT_TRANSMISSION].set(NPTZ_WORDING.wID_0561)
                } else {
                    if (type == 17) {
                        txtRTMPStreamingFormatObject[TXT_VIDEO_OVER_IP_RTMP_STREAMINGFORMAT_TRANSMISSION].set(NPTZ_WORDING.wID_0523)
                    } else {
                        txtRTMPStreamingFormatObject[TXT_VIDEO_OVER_IP_RTMP_STREAMINGFORMAT_TRANSMISSION].set(NPTZ_WORDING.wID_0251)
                    }
                }
                if (sysCommon.streamingMode == CONST_STREAM_MODE_RTMP_UHD || sysCommon.streamingMode == CONST_STREAM_MODE_SRT_H264_UHD) {
                    profileTypeRadioButtonGroup.displayDisabled();
                } else {
                    profileTypeRadioButtonGroup.displayOff();
                }
                profileTypeRadioButtonGroup.setSelectedValue(h264_profile);
                transmissionRadioButtonGroup.setSelectedValue(RTMP_streamingFormat_transmit);
                selectRTMPStreamingFormatImageCaptureSize.refreshOptions(sysConst.getH264ImageCaptureSizeItems(CONST_H264_CH1));
                selectRTMPStreamingFormatImageCaptureSize.val(RTMP_streamingFormat_resolution);
                selectRTMPStreamingFormatFrameRate.refreshOptions(sysConst.getH264FrameRateItems(CONST_H264_CH1, RTMP_streamingFormat_resolution));
                selectRTMPStreamingFormatFrameRate.val(RTMP_streamingFormat_framerate);
                const h264BitRateOptions = sysConst.getH264BitRate(RTMP_streamingFormat_resolution, RTMP_streamingFormat_framerate);
                selectRTMPStreamingFormatMaxBitRateMax.refreshOptions(h264BitRateOptions);
                selectRTMPStreamingFormatMaxBitRateMax.val(RTMP_streamingFormat_bandwidth);
                changeItemStatus();
            }

        }

        /**
         *
         */
        function callbackH264ProfileType() {
            h264_profile = profileTypeRadioButtonGroup.getSelectedValue();
            //changeItemStatus();
            var h264BitRateOptions = sysConst.getH264BitRate(selectRTMPStreamingFormatImageCaptureSize.get(), selectRTMPStreamingFormatFrameRate.get(), h264_profile);
            selectRTMPStreamingFormatMaxBitRateMax.refreshOptions(h264BitRateOptions);
            selectRTMPStreamingFormatMaxBitRateMax.val(getMaxBitRateMaxToSet(h264BitRateOptions, RTMP_streamingFormat_bandwidth));
        }

        /**
         *
         */
        function changeItemStatus() {
            if ((sysCommon.streamingMode == 'srt_h264' || sysCommon.streamingMode == 'srt_h264_uhd' || sysCommon.streamingMode == 'srt_h265' || sysCommon.streamingMode == 'srt_h265_uhd') && getsrtStatus() == '1') {
                transmissionRadioButtonGroup.displayDisabled();
                profileTypeRadioButtonGroup.displayDisabled();
                RTMP_streamingFormat_set_button.displayDisabled();
                selectRTMPStreamingFormatImageCaptureSize.displayDisabled();
                selectRTMPTransmissionPriority.displayDisabled();
                selectRTMPStreamingFormatFrameRate.displayDisabled();
                selectRTMPStreamingFormatMaxBitRateMax.displayDisabled();
            } else {
                transmissionRadioButtonGroup.displayOff();
                RTMP_streamingFormat_set_button.displayOff();
                if (transmissionRadioButtonGroup.getSelectedValue() == 1) {
                    selectRTMPStreamingFormatImageCaptureSize.displayOff();
                    selectRTMPTransmissionPriority.displayOff();
                    selectRTMPStreamingFormatFrameRate.displayOff();
                    selectRTMPStreamingFormatMaxBitRateMax.displayOff();
                    if (sysCommon.streamingMode != CONST_STREAM_MODE_RTMP_UHD && sysCommon.streamingMode != CONST_STREAM_MODE_SRT_H264_UHD) {
                        profileTypeRadioButtonGroup.displayOff();
                    }
                } else {
                    selectRTMPStreamingFormatImageCaptureSize.displayDisabled();
                    selectRTMPTransmissionPriority.displayDisabled();
                    selectRTMPStreamingFormatFrameRate.displayDisabled();
                    selectRTMPStreamingFormatMaxBitRateMax.displayDisabled();
                    profileTypeRadioButtonGroup.displayDisabled();
                }
            }


        }

        function callbackTransmissionPriority() {
            changeItemStatus();
        }

        /**
         *
         */
        function callbackRTMPImageCaptureSize() {
            selectRTMPStreamingFormatFrameRate.refreshOptions(sysConst.getH264FrameRateItems(CONST_H264_CH1, selectRTMPStreamingFormatImageCaptureSize.get()));
            selectRTMPStreamingFormatFrameRate.val(RTMP_streamingFormat_framerate);
            var h264BitRateOptions = sysConst.getH264BitRate(selectRTMPStreamingFormatImageCaptureSize.get(), selectRTMPStreamingFormatFrameRate.get());
            selectRTMPStreamingFormatMaxBitRateMax.refreshOptions(h264BitRateOptions);
            selectRTMPStreamingFormatMaxBitRateMax.val(getMaxBitRateMaxToSet(h264BitRateOptions, RTMP_streamingFormat_bandwidth));
        }
        /**
         *
         */
        function callbackNDIImageCaptureSize() {
            selectNDIStreamingFormatFrameRate.refreshOptions(sysConst.getH264FrameRateItems(CONST_H264_CH1, selectNDIStreamingFormatImageCaptureSize.get()));
            selectNDIStreamingFormatFrameRate.val(RTMP_streamingFormat_framerate);
            var h264BitRateOptions = sysConst.getH264BitRate(selectNDIStreamingFormatImageCaptureSize.get(), selectNDIStreamingFormatFrameRate.get());
            selectNDIStreamingFormatMaxBitRateMax.refreshOptions(h264BitRateOptions);
            selectNDIStreamingFormatMaxBitRateMax.val(getMaxBitRateMaxToSet(h264BitRateOptions, RTMP_streamingFormat_bandwidth));
        }
        /**
         *
         */
        function callbackRTMPFrameRate() {
            const h264BitRateOptions = sysConst.getH264BitRate(selectRTMPStreamingFormatImageCaptureSize.get(), selectRTMPStreamingFormatFrameRate.get());
            selectRTMPStreamingFormatMaxBitRateMax.refreshOptions(h264BitRateOptions);
            selectRTMPStreamingFormatMaxBitRateMax.val(getMaxBitRateMaxToSet(h264BitRateOptions, RTMP_streamingFormat_bandwidth));
        }
        /**
         *
         */
        function callbackNDIFrameRate() {
            const h264BitRateOptions = sysConst.getH264BitRate(selectNDIStreamingFormatImageCaptureSize.get(), selectNDIStreamingFormatFrameRate.get());
            selectNDIStreamingFormatMaxBitRateMax.refreshOptions(h264BitRateOptions);
            selectNDIStreamingFormatMaxBitRateMax.val(getMaxBitRateMaxToSet(h264BitRateOptions, RTMP_streamingFormat_bandwidth));
        }

        /**
         *
         */
        function callbackRTMPStreamingFormatTransmission() {
            changeItemStatus();
        }

        /**
         *
         */
        function callbackRTMPStreamingFormatInternetMode() {
            changeItemStatus();
        }

        /**
         *
         */
        function callbackTransmissionType() {
            changeItemStatus();
        }

        /**
         *
         */
        function callbackRTMPStreamingFormatSetButton(mouse) {
            if (mouse == Button.MOUSE_DOWN) {
                const srtStatus = getsrtStatus();
                if (srtStatus == 1) return;
                const obj = cparam_getSrtInfo();
                const SRT_encryption = obj["encryption"];
                if (SRT_encryption != 0) {
                    const objIP = cparam_getVideoOverIpInfo();
                    let size, frameRate, bitRate;
                    size = selectRTMPStreamingFormatImageCaptureSize.get();
                    frameRate = selectRTMPStreamingFormatFrameRate.get();
                    bitRate = selectRTMPStreamingFormatMaxBitRateMax.get();

                    if ((sysCommon.streamingMode == 'srt_h264_uhd' || sysCommon.streamingMode == 'srt_h265_uhd')
                        && size == '3840' && (frameRate == '60' || frameRate == '30')
                        && (bitRate == '51200' || bitRate == '76800')) {
                        jAlert(MSG_STATUS.mID_0096, NPTZ_WORDING.wID_0039);
                        return;
                    }
                }
                if (!checkBitRateTotal('H264_1', selectRTMPStreamingFormatMaxBitRateMax.get() / 1000)) {
                    jAlert(MSG_STATUS.mID_0075, NPTZ_WORDING.wID_0039);
                    rebuild();
                    return;
                }
                let url = "";
                if (sysCommon.streamingMode == "srt_h265" || sysCommon.streamingMode == "srt_h265_uhd") {
                    url = '/cgi-bin/set_h265';
                } else {
                    url = '/cgi-bin/set_h264';
                }
                $("#dialog_setup").show();
                $.ajax({
                    type: "post",
                    url: url,
                    data: RTMPStreamingFormatSettingData(),
                    success: function (data) {
                        setTimeout(function () {
                            $("#dialog_setup").hide();
                        }, 500);
                    },
                    error: function (jqXHR, textStatus, errorThrown) {
                        setTimeout(function () {
                            $("#dialog_setup").hide();
                        }, 500);
                    }
                });
            }
        }

        function RTMPStreamingFormatSettingData() {
            let data = {};
            if (sysCommon.streamingMode == "srt_h265" || sysCommon.streamingMode == "srt_h265_uhd") {
                if (!transmissionRadioButtonGroup.isDisabled()) {
                    data['h265_transmit'] = transmissionRadioButtonGroup.getSelectedValue();
                }
                if (selectRTMPStreamingFormatImageCaptureSize.getStatus() != Select.STATUS_DISABLED) {
                    data['h265_resolution'] = selectRTMPStreamingFormatImageCaptureSize.get();
                }
                if (selectRTMPTransmissionPriority.getStatus() != Select.STATUS_DISABLED) {
                    data['f_priority'] = selectRTMPTransmissionPriority.get();
                }
                if (selectRTMPStreamingFormatFrameRate.getStatus() != Select.STATUS_DISABLED) {
                    data['framerate'] = selectRTMPStreamingFormatFrameRate.get();
                }
                if (selectRTMPStreamingFormatMaxBitRateMax.getStatus() != Select.STATUS_DISABLED) {
                    data['h265_bandwidth'] = selectRTMPStreamingFormatMaxBitRateMax.get();
                }
            } else {
                if (!transmissionRadioButtonGroup.isDisabled()) {
                    data['h264_transmit'] = transmissionRadioButtonGroup.getSelectedValue();
                }
                if (selectRTMPStreamingFormatImageCaptureSize.getStatus() != Select.STATUS_DISABLED) {
                    data['h264_resolution'] = selectRTMPStreamingFormatImageCaptureSize.get();
                }
                if (selectRTMPTransmissionPriority.getStatus() != Select.STATUS_DISABLED) {
                    data['f_priority'] = selectRTMPTransmissionPriority.get();
                }
                if (selectRTMPStreamingFormatFrameRate.getStatus() != Select.STATUS_DISABLED) {
                    data['framerate'] = selectRTMPStreamingFormatFrameRate.get();
                }
                if (selectRTMPStreamingFormatMaxBitRateMax.getStatus() != Select.STATUS_DISABLED) {
                    data['h264_bandwidth'] = selectRTMPStreamingFormatMaxBitRateMax.get();
                }
                data['profile'] = profileTypeRadioButtonGroup.getSelectedValue();
            }

            return data;
        }
        /**
         *
         */
        function callbackNDIStreamingFormatSetButton(mouse) {
            if (mouse == Button.MOUSE_DOWN) {
                // const srtStatus  = getsrtStatus();
                // if(srtStatus == 1)return;
                // const obj = cparam_getSrtInfo();
                // const SRT_encryption = obj["encryption"];
                // if(SRT_encryption != 0){
                //     const objIP = cparam_getVideoOverIpInfo();
                //     let size,frameRate,bitRate;
                //     size = selectRTMPStreamingFormatImageCaptureSize.get();
                //     frameRate = selectRTMPStreamingFormatFrameRate.get();
                //     bitRate = selectRTMPStreamingFormatMaxBitRateMax.get();
                //
                //     if((sysCommon.streamingMode == 'srt_h264_uhd' || sysCommon.streamingMode == 'srt_h265_uhd')
                //         && size == '3840' && (frameRate == '60'||frameRate == '30')
                //         && (bitRate == '51200'||bitRate == '76800')){
                //         jAlert(MSG_STATUS.mID_0096, NPTZ_WORDING.wID_0039);
                //         return;
                //     }
                // }
                if (!checkBitRateTotal('H264_1', selectNDIStreamingFormatMaxBitRateMax.get() / 1000)) {
                    jAlert(MSG_STATUS.mID_0075, NPTZ_WORDING.wID_0039);
                    rebuild();
                    return;
                }
                let url = "";
                url = '/cgi-bin/set_h264';
                $("#dialog_setup").show();
                $.ajax({
                    type: "post",
                    url: url,
                    data: NDIStreamingFormatSettingData(),
                    success: function (data) {
                        setTimeout(function () {
                            $("#dialog_setup").hide();
                        }, 500);
                    },
                    error: function (jqXHR, textStatus, errorThrown) {
                        setTimeout(function () {
                            $("#dialog_setup").hide();
                        }, 500);
                    }
                });
            }
        }

        function NDIStreamingFormatSettingData() {
            let data = {};
            if (selectNDIStreamingFormatImageCaptureSize.getStatus() != Select.STATUS_DISABLED) {
                data['h264_resolution'] = selectNDIStreamingFormatImageCaptureSize.get();
            }
            if (selectNDIStreamingFormatFrameRate.getStatus() != Select.STATUS_DISABLED) {
                data['framerate'] = selectNDIStreamingFormatFrameRate.get();
            }
            if (selectRTMPTransmissionPriority.getStatus() != Select.STATUS_DISABLED) {
                data['f_priority'] = selectRTMPTransmissionPriority.get();
            }
            if (selectNDIStreamingFormatMaxBitRateMax.getStatus() != Select.STATUS_DISABLED) {
                data['h264_bandwidth'] = selectNDIStreamingFormatMaxBitRateMax.get();
            }

            return data;
        }
        return {
            build: function (type) {
                return buildRTMPStreamingFormat(type);
            }
        }
    }
    /**
     * settingSRT Common setup画面:settingJPEG制御に関わる画面クラス
     * @class settingSRT Common setup:settingJPEG制御に関わる画面クラス
     * @return {{build: settingSRT Common setup, rebuild: rebuild}} build 構築�E琁E
     * @return {function} rebuild 再構築�E琁E
     * @constructor
     */

    function settingSrtOrTs() {
        /**
         * 構築フラグ
         * @type boolean
         */
        let buildFlag_SRT = false;
        /**
         * 構築フラグ
         * @type boolean
         */
        let buildFlag_Ts = false;
        /**
         * label定義
         * @type number
         */
        let txtSRTObject = [];
        const TXT_VIDEO_OVER_IP_SRT_MODE = 0;
        const TXT_VIDEO_OVER_SRT_DESTINATION_PORT = 1;
        const TXT_VIDEO_OVER_SRT_DESTINATION_PORT_MESSAGE = 2;
        const TXT_VIDEO_OVER_SRT_LATENCY = 3;
        const TXT_VIDEO_OVER_SRT_IP_ADDRESS = 4;
        const TXT_VIDEO_OVER_SRT_CLIENT_PORT = 5;
        const TXT_VIDEO_OVER_SRT_CLIENT_PORT_MESSAGE = 6;
        const TXT_VIDEO_OVER_IP_SRT_TTL_HOP_LIMIT = 7;
        const TXT_VIDEO_OVER_IP_SRT_TTL_HOP_LIMIT_MESSAGE = 8;
        const TXT_VIDEO_OVER_IP_SRT_ENCRYPTION = 9;
        const TXT_VIDEO_OVER_IP_SRT_PASSPHRASE = 10;
        const TXT_VIDEO_OVER_IP_SRT_STREAM_ID = 11;
        const TXT_VIDEO_OVER_IP_SRT_DESTINATION_PORT_MESSAGE = 12;

        let txtTSObject = [];
        let ts_transmissionTypeSelect;
        const TXT_VIDEO_OVER_IP_TS_TRANSMISSION_TYPE = 0;
        const TXT_VIDEO_OVER_IP_TS_UNICAST_ADDRESS = 1;
        const TXT_VIDEO_OVER_IP_TS_UNICAST_PORT = 2;
        const TXT_VIDEO_OVER_IP_TS_MULTICAST_ADDRESS = 3;
        const TXT_VIDEO_OVER_IP_TS_MULTICAST_PORT = 4;
        const TXT_VIDEO_OVER_IP_TS_PUSH_UDP = 5;
        const TXT_VIDEO_OVER_TS_UN_PORT_MESSAGE = 6;
        const TXT_VIDEO_OVER_TS_MN_PORT_MESSAGE = 7;
        const TXT_VIDEO_OVER_TS_MU_TTL = 8;
        const TXT_VIDEO_OVER_TS_MU_TTL_MESSAGE = 9;



        /**
         * input[] : text
         * @type txtSRTInputObject[]
         */
        let txtSRTInputObject = [];
        let INPUT_VIDEO_OVER_SRT_DESTINATION_PORT = 0;
        let INPUT_VIDEO_OVER_SRT_LATENCY = 1;
        let INPUT_VIDEO_OVER_SRT_IP_ADDRESS = 2;
        let INPUT_VIDEO_OVER_IP_SRT_CLIENT_PORT = 3;
        let INPUT_VIDEO_OVER_IP_SRT_TTL_HOP_LIMIT = 4;
        let INPUT_VIDEO_OVER_IP_SRT_PASSPHRASE = 5;
        let INPUT_VIDEO_OVER_IP_SRT_STREAM_ID = 6;
        let modeRadioButtonGroup;
        let pushRadioButtonGroup;
        let internetModeRadioButtonGroup;
        let SRT_set_button;
        let SRT_insert_button;
        let Ts_set_button
        let encryptionRadioButtonGroup;
        let SRT_mode = "";
        let SRT_ip = "";
        let SRT_desination_port = "";
        let SRT_client_port = "";
        let SRT_ttl_hop_limit = "";
        let SRT_latency = "";
        let SRT_encryption = "";
        let SRT_passphrase = "";
        let SRT_streamid = "";

        let TS_transmission = "";
        let TS_uni_addr = "";
        let TS_uni_port = "";
        let TS_multi_addr = "";
        let TS_multi_port = "";
        let TS_push = "";
        let TS_multi_ttl = "";

        let txtTSInputObject = [];
        let INPUT_VIDEO_OVER_TS_UN_IP4 = 0;
        let INPUT_VIDEO_OVER_TS_UN_PORT = 1;
        let INPUT_VIDEO_OVER_TS_MU_IP4 = 2;
        let INPUT_VIDEO_OVER_TS_MN_PORT = 3;
        let INPUT_VIDEO_OVER_TS_MU_TTL = 4;
        function getCurrentValueOfSRTStreamingFormat() {
            let obj = cparam_getSrtInfo();
            SRT_mode = obj["mode"];
            SRT_ip = obj["dip_addr"];
            SRT_desination_port = obj["dport"];
            SRT_client_port = obj["lport"];
            SRT_ttl_hop_limit = obj["ttl"];
            SRT_latency = obj["latency"];
            SRT_encryption = obj["encryption"];
            SRT_passphrase = obj["passphrase"];
            SRT_streamid = obj["streamid"];
        }
        function getCurrentValueOfTSStreamingFormat() {
            let obj = cparam_getTsInfo();
            TS_transmission = obj["tramsmission"];
            TS_uni_addr = obj["uni_addr"];
            TS_uni_port = obj["uni_port"] == 0 ? "" : obj["uni_port"];
            TS_multi_addr = obj["multi_addr"];
            TS_multi_port = obj["multi_port"] == 0 ? "" : obj["multi_port"];
            TS_push = obj["push"];
            TS_multi_ttl = obj["multi_ttl"]
        }

        function buildSrtOrTs() {
            if (sysCommon.streamingMode != 'ts_udp') {
                if (!buildFlag_SRT) {
                    buildFlag_SRT = true;
                    getCurrentValueOfSRTStreamingFormat();
                    // H.264 transmission
                    txtSRTObject[TXT_VIDEO_OVER_IP_SRT_MODE] = TextCtrl('setup_videoOverIp_SRT_Common_setup_main_label', 'txt_video_over_ip_srt_mode', NPTZ_WORDING.wID_0227);
                    // H.264 transmission radioButtonItems
                    modeRadioButtonGroup = RadioButtonGroupCtrl("setup_videoOverIp_SRT_Common_setup_main_form", "setup_videoOverIp_srt_mode_", RADIO_GROUP.rID_0059, SRT_mode, callbackSrtMode);
                    $(".setup_videoOverIp_srt_mode_Client_label P").html(NPTZ_WORDING.wID_0545);

                    txtSRTObject[TXT_VIDEO_OVER_SRT_DESTINATION_PORT] = TextCtrl('setup_videoOverIp_SRT_Common_setup_main_label', 'txt_video_over_srt_destination_port', NPTZ_WORDING.wID_0517);
                    txtSRTInputObject[INPUT_VIDEO_OVER_SRT_DESTINATION_PORT] = InputCtrl("setup_videoOverIp_SRT_Common_setup_main_form", 'srt_destination_port', 'srt_destination_port', 'input_video_over_srt_destination_port', SRT_desination_port, null, null, null, null, 5);
                    // port 数字以外�E力できなぁE
                    txtSRTInputObject[INPUT_VIDEO_OVER_SRT_DESTINATION_PORT].getInputObject().keypress(filterNumber);
                    //txtSRTObject[TXT_VIDEO_OVER_SRT_DESTINATION_PORT_MESSAGE] = TextCtrl('setup_videoOverIp_SRT_Common_setup_main_form', 'txt_video_over_srt_destination_port_message', NPTZ_WORDING.wID_0240);
                    txtSRTObject[TXT_VIDEO_OVER_SRT_LATENCY] = TextCtrl('setup_videoOverIp_SRT_Common_setup_main_part_label', 'txt_video_over_srt_latency', NPTZ_WORDING.wID_0520);
                    txtSRTInputObject[INPUT_VIDEO_OVER_SRT_LATENCY] = InputCtrl("setup_videoOverIp_SRT_Common_setup_main_part_form", 'srt_latency', 'srt_latency', 'input_video_over_srt_latency', SRT_latency, null, null, null, null, 5);
                    txtSRTInputObject[INPUT_VIDEO_OVER_SRT_LATENCY].getInputObject().keypress(filterNumber);
                    // Multicast address
                    txtSRTObject[TXT_VIDEO_OVER_SRT_IP_ADDRESS] = TextCtrl('setup_videoOverIp_SRT_Common_setup_main_label', 'txt_video_over_srt_ip_address', NPTZ_WORDING.wID_0516);
                    txtSRTInputObject[INPUT_VIDEO_OVER_SRT_IP_ADDRESS] = InputCtrl("setup_videoOverIp_SRT_Common_setup_main_form", 'srt_ip_address', 'srt_ip_address', 'input_video_over_srt_ip_address', SRT_ip, null, null, null, null, 255);

                    // client port
                    txtSRTObject[TXT_VIDEO_OVER_SRT_CLIENT_PORT] = TextCtrl('setup_videoOverIp_SRT_Common_setup_main_part_label', 'txt_video_over_srt_client_port', NPTZ_WORDING.wID_0518);
                    txtSRTInputObject[INPUT_VIDEO_OVER_IP_SRT_CLIENT_PORT] = InputCtrl("setup_videoOverIp_SRT_Common_setup_main_part_form", 'srt_client_port', 'srt_client_port', 'input_video_over_ip_srt_client_port', SRT_client_port, null, null, null, null, 5);
                    // port 数字以外�E力できなぁE
                    txtSRTInputObject[INPUT_VIDEO_OVER_IP_SRT_CLIENT_PORT].getInputObject().keypress(filterNumber);
                    txtSRTObject[TXT_VIDEO_OVER_SRT_CLIENT_PORT_MESSAGE] = TextCtrl('setup_videoOverIp_SRT_Common_setup_main_form', 'txt_video_over_srt_client_port_message', NPTZ_WORDING.wID_0127);
                    txtSRTObject[TXT_VIDEO_OVER_IP_SRT_DESTINATION_PORT_MESSAGE] = TextCtrl('setup_videoOverIp_SRT_Common_setup_main_form', 'txt_video_over_ip_srt_destination_port_message', NPTZ_WORDING.wID_0127)

                    // Multicast TTL/HOPLimit
                    txtSRTObject[TXT_VIDEO_OVER_IP_SRT_TTL_HOP_LIMIT] = TextCtrl('setup_videoOverIp_SRT_Common_setup_main_part_label', 'txt_video_over_ip_srt_ttl_hop_limit', NPTZ_WORDING.wID_0519);
                    txtSRTInputObject[INPUT_VIDEO_OVER_IP_SRT_TTL_HOP_LIMIT] = InputCtrl("setup_videoOverIp_SRT_Common_setup_main_part_form", 'srt_ttl_hop_limit', 'srt_ttl_hop_limit', 'input_video_over_ip_srt_ttl_hop_limit', SRT_ttl_hop_limit, null, null, null, null, 3);
                    txtSRTInputObject[INPUT_VIDEO_OVER_IP_SRT_TTL_HOP_LIMIT].getInputObject().keypress(filterNumber);
                    txtSRTObject[TXT_VIDEO_OVER_IP_SRT_TTL_HOP_LIMIT_MESSAGE] = TextCtrl('setup_videoOverIp_SRT_Common_setup_main_part_form', 'txt_video_over_ip_srt_ttl_hop_limit_message', NPTZ_WORDING.wID_0245);

                    //Encryption
                    txtSRTObject[TXT_VIDEO_OVER_IP_SRT_ENCRYPTION] = TextCtrl('setup_videoOverIp_SRT_Common_setup_main_part_label', 'txt_video_over_ip_srt_encryption', NPTZ_WORDING.wID_0521);
                    encryptionRadioButtonGroup = RadioButtonGroupCtrl("setup_videoOverIp_SRT_Common_setup_main_part_form", "setup_videoOverIp_srt_encryption_", RADIO_GROUP.rID_0060, SRT_encryption, callbackSrtEncryption);

                    //Passphrase
                    txtSRTObject[TXT_VIDEO_OVER_IP_SRT_PASSPHRASE] = TextCtrl('setup_videoOverIp_SRT_Common_setup_main_part_label', 'txt_video_over_ip_srt_passphrase', NPTZ_WORDING.wID_0522);
                    txtSRTInputObject[INPUT_VIDEO_OVER_IP_SRT_PASSPHRASE] = InputCtrl("setup_videoOverIp_SRT_Common_setup_main_part_form", 'srt_ttl_hop_limit', 'srt_ttl_hop_limit', 'input_video_over_ip_srt_passphrase', SRT_passphrase, null, null, null, null, 79);

                    //Stream ID
                    txtSRTObject[TXT_VIDEO_OVER_IP_SRT_STREAM_ID] = TextCtrl('setup_videoOverIp_SRT_Common_setup_main_label', 'txt_video_over_ip_srt_stream_id', NPTZ_WORDING.wID_0570);
                    txtSRTInputObject[INPUT_VIDEO_OVER_IP_SRT_STREAM_ID] = InputCtrl("setup_videoOverIp_SRT_Common_setup_main_form", '', '', 'input_video_over_ip_srt_stream_id', SRT_streamid, null, null, null, null, 255);



                    SRT_set_button = ButtonCtrl("setup_videoOverIp_SRT_Common_setup_main", "setup_videoOverIp_srt_set_button", NPTZ_WORDING.wID_0141, callbackSrtSetButton);
                    SRT_set_button.getButtonObject().addClass('button_class');
                    SRT_set_button.show();
                    SRT_set_button.displayOff();

                    SRT_insert_button = ButtonCtrl("setup_videoOverIp_SRT_Common_setup_main", "setup_videooverip_srt_insert_button", NPTZ_WORDING.wID_0571, callbackInsertTemplateButton);
                    SRT_insert_button.getButtonObject().addClass('button_class');
                    SRT_insert_button.show();
                    SRT_insert_button.displayOff();


                    LineCtrl('setup_videoOverIp_SRT_Common_setup_main', 'horizontal', 73, 0, "", "setup_videoOverIp_NDIHX_stream_transmission_label", "98")
                    LineCtrl('setup_videoOverIp_SRT_Common_setup_main', 'horizontal', 141, 0, "", "setup_videoOverIp_NDIHX_stream_internetMode_label", "98")
                    LineCtrl('setup_videoOverIp_SRT_Common_setup_main', 'horizontal', 209, 0, "", "setup_videoOverIp_NDIHX_stream_imageCaptureSize_label", "98")
                    LineCtrl('setup_videoOverIp_SRT_Common_setup_main', 'horizontal', 277, 0, "", "setup_videoOverIp_NDIHX_stream_transmission_priority_label", "98")
                    LineCtrl('setup_videoOverIp_SRT_Common_setup_main', 'horizontal', 345, 0, "", "setup_videoOverIp_NDIHX_stream_frame_rate_label", "98")
                    LineCtrl('setup_videoOverIp_SRT_Common_setup_main', 'horizontal', 413, 0, "", "setup_videoOverIp_NDIHX_stream_maxBitRate_dash_label", "98")
                    LineCtrl('setup_videoOverIp_SRT_Common_setup_main', 'horizontal', 481, 0, "", "setup_videoOverIp_NDIHX_stream_imageQuality_label", "98")
                    LineCtrl('setup_videoOverIp_SRT_Common_setup_main', 'horizontal', 481, 0, "", "setup_videoOverIp_NDIHX_stream_streamid_label", "98");
                    LineCtrl('setup_videoOverIp_SRT_Common_setup_main', 'vertical', 541, 37, 100, "setup_videoOverIp_NDIHX_stream_transmissionType_srt_label");
                    LineCtrl('setup_videoOverIp_SRT_Common_setup_main', 'horizontal', 541, 50, "", "setup_videoOverIp_NDIHX_stream_transmission_type_quality_select_passphrase", "96");
                    for (var text in txtSRTObject) {
                        txtSRTObject[text].show();
                    }
                    for (var text in txtSRTInputObject) {
                        txtSRTInputObject[text].show();
                        txtSRTInputObject[text].displayOff();
                    }
                    changeItemStatus();
                } else {
                    rebuild();
                }
            } else {
                if (!buildFlag_Ts) {
                    getCurrentValueOfTSStreamingFormat();
                    buildFlag_Ts = true;
                    txtTSObject[TXT_VIDEO_OVER_IP_TS_TRANSMISSION_TYPE] = TextCtrl('setup_videoOverIp_TS_UDP_Common_setup_main_label', 'txt_video_over_ip_ts_transmission_type', NPTZ_WORDING.wID_0101);
                    ts_transmissionTypeSelect = SelectCtrl('setup_videoOverIp_TS_UDP_Common_setup_main_form', "", "ts_transmissionTypeSelect", "ts_transmissionTypeSelect", callbackChangeValue, '', TS_UDP_STREAMINGFORMAT_TRANSMISSION_TYPE, TS_transmission);
                    ts_transmissionTypeSelect.show();
                    ts_transmissionTypeSelect.displayOn();

                    //un ip4
                    txtTSObject[TXT_VIDEO_OVER_IP_TS_UNICAST_ADDRESS] = TextCtrl('setup_videoOverIp_TS_UDP_Common_setup_main_label', 'txt_video_over_ip_ts_unicast_address', NPTZ_WORDING.wID_0556);
                    txtTSInputObject[INPUT_VIDEO_OVER_TS_UN_IP4] = InputCtrl("setup_videoOverIp_TS_UDP_Common_setup_main_form", 'ts_un_ip4', 'ts_un_ip4', 'input_video_over_ts_un_ip4', TS_uni_addr);

                    //un port
                    txtTSObject[TXT_VIDEO_OVER_IP_TS_UNICAST_PORT] = TextCtrl('setup_videoOverIp_TS_UDP_Common_setup_main_label', 'txt_video_over_ip_ts_unicast_port', NPTZ_WORDING.wID_0557);
                    txtTSInputObject[INPUT_VIDEO_OVER_TS_UN_PORT] = InputCtrl("setup_videoOverIp_TS_UDP_Common_setup_main_form", 'ts_un_port', 'ts_un_port', 'input_video_over_ts_un_port', TS_uni_port, null, null, null, null, 5);
                    // port 数字以外�E力できなぁE
                    txtTSInputObject[INPUT_VIDEO_OVER_TS_UN_PORT].getInputObject().keypress(filterNumber);
                    //port message
                    txtTSObject[TXT_VIDEO_OVER_TS_UN_PORT_MESSAGE] = TextCtrl('setup_videoOverIp_TS_UDP_Common_setup_main_form', 'txt_video_over_ts_un_port_message', NPTZ_WORDING.wID_0240);

                    // Multicast address
                    txtTSObject[TXT_VIDEO_OVER_IP_TS_MULTICAST_ADDRESS] = TextCtrl('setup_videoOverIp_TS_UDP_Common_setup_main_label', 'txt_video_over_ip_ts_multicast_address', NPTZ_WORDING.wID_0558);
                    txtTSInputObject[INPUT_VIDEO_OVER_TS_MU_IP4] = InputCtrl("setup_videoOverIp_TS_UDP_Common_setup_main_form", 'ts_mu_ip4', 'ts_mu_ip4', 'input_video_over_ts_mu_ip4', TS_multi_addr);

                    // Multicast port
                    txtTSObject[TXT_VIDEO_OVER_IP_TS_MULTICAST_PORT] = TextCtrl('setup_videoOverIp_TS_UDP_Common_setup_main_label', 'txt_video_over_ip_ts_multicast_port', NPTZ_WORDING.wID_0559)
                    txtTSInputObject[INPUT_VIDEO_OVER_TS_MN_PORT] = InputCtrl("setup_videoOverIp_TS_UDP_Common_setup_main_form", 'ts_mn_port', 'ts_mn_port', 'input_video_over_ts_mn_port', TS_multi_port, null, null, null, null, 5);
                    // port 数字以外�E力できなぁE
                    txtTSInputObject[INPUT_VIDEO_OVER_TS_MN_PORT].getInputObject().keypress(filterNumber);
                    txtTSObject[TXT_VIDEO_OVER_TS_MN_PORT_MESSAGE] = TextCtrl('setup_videoOverIp_TS_UDP_Common_setup_main_form', 'txt_video_over_ts_mn_port_message', NPTZ_WORDING.wID_0240)
                    //push
                    txtTSObject[TXT_VIDEO_OVER_IP_TS_PUSH_UDP] = TextCtrl('setup_videoOverIp_TS_UDP_Common_setup_main_label', 'txt_video_over_ip_ts_push_udp', NPTZ_WORDING.wID_0560);
                    pushRadioButtonGroup = RadioButtonGroupCtrl("setup_videoOverIp_TS_UDP_Common_setup_main_form", "setup_videoOverIp_ts_push_", RADIO_GROUP.rID_0064, TS_push, callbackPushSelect);
                    //Multicast TTL
                    txtTSObject[TXT_VIDEO_OVER_TS_MU_TTL] = TextCtrl('setup_videoOverIp_TS_UDP_Common_setup_main_label', 'txt_video_over_ts_mu_ttl', NPTZ_WORDING.wID_0572);
                    txtTSInputObject[INPUT_VIDEO_OVER_TS_MU_TTL] = InputCtrl("setup_videoOverIp_TS_UDP_Common_setup_main_form", '', '', 'input_video_over_ts_mu_ttl', TS_multi_ttl, null, null, null, null, 3)
                    txtTSObject[TXT_VIDEO_OVER_TS_MU_TTL_MESSAGE] = TextCtrl('setup_videoOverIp_TS_UDP_Common_setup_main_form', 'txt_video_over_ts_mu_ttl_message', NPTZ_WORDING.wID_0535)
                    txtTSInputObject[INPUT_VIDEO_OVER_TS_MU_TTL].getInputObject().keypress(filterNumber);

                    /*line*/
                    LineCtrl('setup_videoOverIp_TS_UDP_Common_setup_main', 'horizontal', 73, 0, "", "setup_videoOverIp_ts_stream_transmission_label", "93")
                    LineCtrl('setup_videoOverIp_TS_UDP_Common_setup_main', 'horizontal', 141, 0, "", "setup_videoOverIp_ts_stream_un_addr_label", "93")
                    LineCtrl('setup_videoOverIp_TS_UDP_Common_setup_main', 'horizontal', 209, 0, "", "setup_videoOverIp_ts_stream_un_port_label", "93")
                    LineCtrl('setup_videoOverIp_TS_UDP_Common_setup_main', 'horizontal', 277, 0, "", "setup_videoOverIp_ts_stream_mu_addr_label", "93")
                    LineCtrl('setup_videoOverIp_TS_UDP_Common_setup_main', 'horizontal', 345, 0, "", "setup_videoOverIp_ts_stream_mu_port_label", "93")
                    LineCtrl('setup_videoOverIp_TS_UDP_Common_setup_main', 'horizontal', 413, 0, "", "setup_videoOverIp_ts_stream_push_udp_label", "93")
                    LineCtrl('setup_videoOverIp_TS_UDP_Common_setup_main', 'vertical', 541, 37, 100, "setup_videoOverIp_ts_label");

                    Ts_set_button = ButtonCtrl("setup_videoOverIp_TS_UDP_Common_setup_main", "setup_videoOverIp_ts_set_button", NPTZ_WORDING.wID_0141, callbackTsSetButton);
                    Ts_set_button.getButtonObject().addClass('button_class');
                    Ts_set_button.show();
                    Ts_set_button.displayOff();

                    for (var text in txtTSObject) {
                        txtTSObject[text].show();
                    }
                    for (var text in txtTSInputObject) {
                        txtTSInputObject[text].show();
                        txtTSInputObject[text].displayOff();
                    }
                    changeTsUdpItemStatus(TS_transmission);
                } else {
                    rebuild();
                }
            }

        }

        function rebuild() {
            if (sysCommon.streamingMode != 'ts_udp') {
                getCurrentValueOfSRTStreamingFormat();
                modeRadioButtonGroup.setSelectedValue(SRT_mode);
                txtSRTInputObject[INPUT_VIDEO_OVER_SRT_IP_ADDRESS].val(SRT_ip);
                txtSRTInputObject[INPUT_VIDEO_OVER_SRT_DESTINATION_PORT].val(SRT_desination_port);
                txtSRTInputObject[INPUT_VIDEO_OVER_IP_SRT_CLIENT_PORT].val(SRT_client_port);
                txtSRTInputObject[INPUT_VIDEO_OVER_IP_SRT_TTL_HOP_LIMIT].val(SRT_ttl_hop_limit);
                txtSRTInputObject[INPUT_VIDEO_OVER_SRT_LATENCY].val(SRT_latency);
                encryptionRadioButtonGroup.setSelectedValue(SRT_encryption);
                txtSRTInputObject[INPUT_VIDEO_OVER_IP_SRT_PASSPHRASE].val(SRT_passphrase);
                changeItemStatus();
            } else {
                getCurrentValueOfTSStreamingFormat();
                pushRadioButtonGroup.setSelectedValue(TS_push);
                ts_transmissionTypeSelect.val(TS_transmission);
                txtTSInputObject[INPUT_VIDEO_OVER_TS_UN_IP4].val(TS_uni_addr);
                txtTSInputObject[INPUT_VIDEO_OVER_TS_UN_PORT].val(TS_uni_port);
                txtTSInputObject[INPUT_VIDEO_OVER_TS_MU_IP4].val(TS_multi_addr);
                txtTSInputObject[INPUT_VIDEO_OVER_TS_MN_PORT].val(TS_multi_port);
                changeTsUdpItemStatus(TS_transmission);
            }


            //changeItemStatus();
        }
        function callbackChangeValue() {
            changeTsUdpItemStatus(ts_transmissionTypeSelect.get());
        }
        function changeTsUdpItemStatus(type) {
            if (type == 0) {
                txtTSInputObject[INPUT_VIDEO_OVER_TS_UN_IP4].displayOff();
                txtTSInputObject[INPUT_VIDEO_OVER_TS_UN_PORT].displayOff();
                txtTSInputObject[INPUT_VIDEO_OVER_TS_MU_IP4].displayDisabled();
                txtTSInputObject[INPUT_VIDEO_OVER_TS_MN_PORT].displayDisabled();
                txtTSInputObject[INPUT_VIDEO_OVER_TS_MU_TTL].displayDisabled();
            } else {
                txtTSInputObject[INPUT_VIDEO_OVER_TS_UN_IP4].displayDisabled();
                txtTSInputObject[INPUT_VIDEO_OVER_TS_UN_PORT].displayDisabled();
                txtTSInputObject[INPUT_VIDEO_OVER_TS_MU_IP4].displayOff();
                txtTSInputObject[INPUT_VIDEO_OVER_TS_MN_PORT].displayOff();
                txtTSInputObject[INPUT_VIDEO_OVER_TS_MU_TTL].displayOff();
            }
        }
        /**
         *
         */
        function changeItemStatus() {
            if ((sysCommon.streamingMode == 'srt_h264' || sysCommon.streamingMode == 'srt_h264_uhd' || sysCommon.streamingMode == 'srt_h265' || sysCommon.streamingMode == 'srt_h265_uhd') && getsrtStatus() == '1') {
                modeRadioButtonGroup.displayDisabled();
                txtSRTInputObject[INPUT_VIDEO_OVER_IP_SRT_CLIENT_PORT].displayDisabled();
                txtSRTInputObject[INPUT_VIDEO_OVER_SRT_IP_ADDRESS].displayDisabled();
                txtSRTInputObject[INPUT_VIDEO_OVER_IP_SRT_STREAM_ID].displayDisabled();
                txtSRTInputObject[INPUT_VIDEO_OVER_SRT_DESTINATION_PORT].displayDisabled();
                txtSRTInputObject[INPUT_VIDEO_OVER_IP_SRT_PASSPHRASE].displayDisabled();
                txtSRTInputObject[INPUT_VIDEO_OVER_IP_SRT_TTL_HOP_LIMIT].displayDisabled();
                txtSRTInputObject[INPUT_VIDEO_OVER_SRT_LATENCY].displayDisabled();
                SRT_insert_button.displayDisabled();
                encryptionRadioButtonGroup.displayDisabled();
                SRT_set_button.displayDisabled();
            } else {
                modeRadioButtonGroup.displayOff();
                txtSRTInputObject[INPUT_VIDEO_OVER_IP_SRT_TTL_HOP_LIMIT].displayOff();
                txtSRTInputObject[INPUT_VIDEO_OVER_SRT_LATENCY].displayOff();
                encryptionRadioButtonGroup.displayOff();
                SRT_set_button.displayOff();
                if (modeRadioButtonGroup.getSelectedValue() == 0) {
                    txtSRTInputObject[INPUT_VIDEO_OVER_SRT_IP_ADDRESS].displayOff();
                    txtSRTInputObject[INPUT_VIDEO_OVER_SRT_DESTINATION_PORT].displayOff();
                    txtSRTInputObject[INPUT_VIDEO_OVER_IP_SRT_STREAM_ID].displayOff();
                    SRT_insert_button.displayOff();
                    txtSRTInputObject[INPUT_VIDEO_OVER_IP_SRT_CLIENT_PORT].displayDisabled();
                } else {
                    txtSRTInputObject[INPUT_VIDEO_OVER_IP_SRT_CLIENT_PORT].displayOff();
                    txtSRTInputObject[INPUT_VIDEO_OVER_SRT_IP_ADDRESS].displayDisabled();
                    txtSRTInputObject[INPUT_VIDEO_OVER_IP_SRT_STREAM_ID].displayDisabled();
                    txtSRTInputObject[INPUT_VIDEO_OVER_SRT_DESTINATION_PORT].displayDisabled();
                    SRT_insert_button.displayDisabled();
                }
                if (encryptionRadioButtonGroup.getSelectedValue() == 0) {
                    txtSRTInputObject[INPUT_VIDEO_OVER_IP_SRT_PASSPHRASE].displayDisabled();
                } else {
                    txtSRTInputObject[INPUT_VIDEO_OVER_IP_SRT_PASSPHRASE].displayOff();
                }

            }
        }

        function callbackSrtMode() {
            changeItemStatus();
        }
        function callbackPushSelect() {

        }
        /**
         *
         */
        function callbackSrtEncryption() {
            changeItemStatus();
        }

        /**
         *
         */
        function callbackNDIHXInternetMode() {
            changeItemStatus();
        }

        /**
         *
         */
        function callbackSrtSetButton(mouse) {
            if (mouse == Button.MOUSE_DOWN) {
                const srtStatus = getsrtStatus();
                if (srtStatus == 1) return;
                if (!checkAllInput()) {
                    return;
                }
                if (txtSRTInputObject[INPUT_VIDEO_OVER_IP_SRT_CLIENT_PORT].get() == txtSRTInputObject[INPUT_VIDEO_OVER_SRT_DESTINATION_PORT].get()) {
                    jAlert(MSG_STATUS.mID_0098, NPTZ_WORDING.wID_0039);
                    $("#dialog_setup").hide();
                    return;
                }
                // if (!checkBitRateTotal('H264_1', selectNDIHXMaxBitRateMax.get() / 1000)) {
                //     jAlert(MSG_STATUS.mID_0075, NPTZ_WORDING.wID_0039);
                //     rebuild(currentType);
                //     return;
                // }
                $("#dialog_setup").show();
                $.ajax({
                    type: "get",
                    url: '/cgi-bin/set_srt_info',
                    data: getSRTSettingData(),
                    success: function (data) {
                        if (encryptionRadioButtonGroup.getSelectedValue() != 0) {
                            const objIP = cparam_getVideoOverIpInfo();
                            let size, frameRate, bitRate;
                            if (sysCommon.streamingMode == 'srt_h265_uhd') {
                                size = objIP['h265_resolution_ch1'];
                                frameRate = objIP['h265_framerate_ch1'];
                                bitRate = objIP['h265_bandwidth_ch1'];
                            } else if (sysCommon.streamingMode == 'srt_h264_uhd') {
                                size = objIP['h264_resolution_ch1'];
                                frameRate = objIP['h264_framerate_ch1'];
                                bitRate = objIP['h264_bandwidth_ch1'];
                            }

                            if ((sysCommon.streamingMode == 'srt_h264_uhd' || sysCommon.streamingMode == 'srt_h265_uhd')
                                && size == '3840' && (frameRate == '60' || frameRate == '30')
                                && (bitRate == '51200' || bitRate == '76800')) {
                                let url = '';
                                let data = {};
                                if (sysCommon.streamingMode == "srt_h265_uhd") {
                                    url = '/cgi-bin/set_h265';
                                    data['h265_bandwidth'] = '25600';
                                } else {
                                    url = '/cgi-bin/set_h264';
                                    data['h264_bandwidth'] = '25600';
                                }

                                $.ajax({
                                    type: "post",
                                    url: url,
                                    data: data,
                                    success: function (data) {
                                        setTimeout(function () {
                                            $("#dialog_setup").hide();
                                        }, 500);
                                    },
                                    error: function (jqXHR, textStatus, errorThrown) {
                                        setTimeout(function () {
                                            $("#dialog_setup").hide();
                                        }, 500);
                                    }
                                });
                            }
                        } else {
                        }
                        setTimeout(function () {
                            $("#dialog_setup").hide();
                        }, 500);
                    },
                    error: function (jqXHR, textStatus, errorThrown) {
                        setTimeout(function () {
                            $("#dialog_setup").hide();
                        }, 500);
                    }
                });
            }
        }
        function callbackTsSetButton(mouse) {
            if (mouse == Button.MOUSE_DOWN) {
                if (!checkTsInput()) {
                    return;
                }
                $("#dialog_setup").show();
                $.ajax({
                    type: "get",
                    url: '/cgi-bin/set_ts_udp_info',
                    data: getTsSettingData(),
                    success: function (data) {
                        setTimeout(function () {
                            $("#dialog_setup").hide();
                        }, 500);
                    },
                    error: function (jqXHR, textStatus, errorThrown) {
                        setTimeout(function () {
                            $("#dialog_setup").hide();
                        }, 500);
                    }
                });
            }
        }
        function callbackInsertTemplateButton(mouse) {
            if (mouse == Button.MOUSE_DOWN) {
                if(isUCW4380){
                    $(".input_video_over_ip_srt_stream_id ").val("#!::m=publish,r=HCTEKStream");
                }else{
                    $(".input_video_over_ip_srt_stream_id ").val("#!::m=publish,r=PanasonicStream");
                }
            }
        }
        function checkAllInput() {
            const checkRegx = /[^a-zA-Z0-9!"#$%'()=\-~^|\\`@\[\]{}*:+;<>,.?/\\_]/g;
            if (modeRadioButtonGroup.getSelectedValue() == 0) {
                let objIpAddr = ($("#srt_ip_address").val() == '' || $("#srt_ip_address").val() == null) ? ["", "", "", ""] : [$("#srt_ip_address").val().split(".")[0], $("#srt_ip_address").val().split(".")[1], $("#srt_ip_address").val().split(".")[2], $("#srt_ip_address").val().split(".")[3]];
                /*SRT設定仕様変更対忁Eedit by 2021/07/01*/
                // if($("#srt_ip_address").val() != ''){
                //     if(chknet_ipaddr_familly($("#srt_ip_address").val()) !== "IPv4") return capi_DispError(eval(document.getElementById("srt_ip_address")), MSG_STATUS.mID_0005);
                //     if (chknet_isIpBlank(objIpAddr[0], objIpAddr[1], objIpAddr[2], objIpAddr[3])) return capi_DispError(eval(document.getElementById("srt_ip_address")), MSG_STATUS.mID_0005);
                //     if ((!chknet_IsIpDigit(objIpAddr[0], objIpAddr[1], objIpAddr[2], objIpAddr[3]))
                //         || (!chknet_CheckRange2(objIpAddr[0], objIpAddr[1], objIpAddr[2], objIpAddr[3]))) {
                //         return capi_DispError(eval(document.getElementById("srt_ip_address")), MSG_STATUS.mID_0005);
                //     }
                //     if (chknet_CheckMultiAddr($("#srt_ip_address").val())) {
                //         return capi_DispError($("#srt_ip_address").val(), MSG_STATUS.mID_0005);
                //     }
                // }
                const desUri = txtSRTInputObject[INPUT_VIDEO_OVER_SRT_IP_ADDRESS].get();
                if (desUri.match(checkRegx)) {
                    objErrCode = MSG_STATUS.mID_0009;
                    $("#dialog_setup").hide();
                    return capi_DispError(txtSRTInputObject[INPUT_VIDEO_OVER_SRT_IP_ADDRESS].getInputObject(), objErrCode);

                };
                if (!chknet_portNo(txtSRTInputObject[INPUT_VIDEO_OVER_SRT_DESTINATION_PORT].get(), 'SRT')) {
                    return capi_DispError(txtSRTInputObject[INPUT_VIDEO_OVER_SRT_DESTINATION_PORT].getInputObject(), objErrCode);
                };
                const streamId = txtSRTInputObject[INPUT_VIDEO_OVER_IP_SRT_STREAM_ID].get();
                if (streamId.length < 1 || streamId.match(checkRegx)) {
                    $("#dialog_setup").hide();
                    return capi_DispError(txtSRTInputObject[INPUT_VIDEO_OVER_IP_SRT_STREAM_ID].getInputObject(), objErrCode);

                };
            } else {
                if (!chknet_portNo(txtSRTInputObject[INPUT_VIDEO_OVER_IP_SRT_CLIENT_PORT].get(), 'SRT')) {
                    return capi_DispError(txtSRTInputObject[INPUT_VIDEO_OVER_IP_SRT_CLIENT_PORT].getInputObject(), objErrCode);
                };
            }
            if(!chknet_latency(txtSRTInputObject[INPUT_VIDEO_OVER_SRT_LATENCY].get())){
                objErrCode = MSG_STATUS.mID_0009;
                return capi_DispError(txtSRTInputObject[INPUT_VIDEO_OVER_SRT_LATENCY].getInputObject(), objErrCode);
            };
            if (!CheckNum(txtSRTInputObject[INPUT_VIDEO_OVER_IP_SRT_TTL_HOP_LIMIT].get())) {
                objErrCode = MSG_STATUS.mID_0009;
                return capi_DispError(txtSRTInputObject[INPUT_VIDEO_OVER_IP_SRT_TTL_HOP_LIMIT].getInputObject(), objErrCode);
            }
            if ((txtSRTInputObject[INPUT_VIDEO_OVER_IP_SRT_TTL_HOP_LIMIT].get() < 1) || (txtSRTInputObject[INPUT_VIDEO_OVER_IP_SRT_TTL_HOP_LIMIT].get() > 254)) {
                objErrCode = MSG_STATUS.mID_0009;
                return capi_DispError(txtSRTInputObject[INPUT_VIDEO_OVER_IP_SRT_TTL_HOP_LIMIT].getInputObject(), objErrCode);
            }

            if (encryptionRadioButtonGroup.getSelectedValue() != 0) {
                const srtPassphrase = txtSRTInputObject[INPUT_VIDEO_OVER_IP_SRT_PASSPHRASE].get();
                if (srtPassphrase.match(checkRegx) || srtPassphrase.length < 10) {
                    objErrCode = MSG_STATUS.mID_0009;
                    return capi_DispError(txtSRTInputObject[INPUT_VIDEO_OVER_IP_SRT_PASSPHRASE].getInputObject(), objErrCode);
                }
            } else {
            }
            return true;
        }
        function checkTsInput() {
            const val = ts_transmissionTypeSelect.get();
            if (val == 0) {
                if (!chknet_CheckUniAddr($("#ts_un_ip4").val())) {
                    return capi_DispError(txtTSInputObject[INPUT_VIDEO_OVER_TS_UN_IP4].getInputObject(), MSG_STATUS.mID_0005);
                }
                const tsUnPort = txtTSInputObject[INPUT_VIDEO_OVER_TS_UN_PORT].get();
                if ((tsUnPort < 1024) || (50000 < tsUnPort) || !chknet_portReservedNo(tsUnPort)) {
                    objErrCode = MSG_STATUS.mID_0009;
                    return capi_DispError(txtTSInputObject[INPUT_VIDEO_OVER_TS_UN_PORT].getInputObject(), objErrCode);
                }
                if (!CheckNum(txtTSInputObject[INPUT_VIDEO_OVER_TS_UN_PORT].get())) {
                    objErrCode = MSG_STATUS.mID_0009;
                    return capi_DispError(txtTSInputObject[INPUT_VIDEO_OVER_TS_UN_PORT].getInputObject(), MSG_STATUS.mID_0005);
                }
            } else {
                if (!chknet_CheckMultiAddr($("#ts_mu_ip4").val())) {
                    return capi_DispError(txtTSInputObject[INPUT_VIDEO_OVER_TS_MU_IP4].getInputObject(), MSG_STATUS.mID_0005);
                }
                const tsMnPort = txtTSInputObject[INPUT_VIDEO_OVER_TS_MN_PORT].get();
                if ((tsMnPort < 1024) || (50000 < tsMnPort) || !chknet_portReservedNo(tsMnPort)) {
                    objErrCode = MSG_STATUS.mID_0009;
                    return capi_DispError(txtTSInputObject[INPUT_VIDEO_OVER_TS_MN_PORT].getInputObject(), objErrCode);
                }
                if (!CheckNum(txtTSInputObject[INPUT_VIDEO_OVER_TS_MN_PORT].get())) {
                    objErrCode = MSG_STATUS.mID_0009;

                    return capi_DispError(txtTSInputObject[INPUT_VIDEO_OVER_TS_MN_PORT].getInputObject(), objErrCode);
                }
                if (!CheckNum(txtTSInputObject[INPUT_VIDEO_OVER_TS_MU_TTL].get())) {
                    objErrCode = MSG_STATUS.mID_0009;
                    return capi_DispError(txtTSInputObject[INPUT_VIDEO_OVER_TS_MU_TTL].getInputObject(), objErrCode);
                }
                if ((txtTSInputObject[INPUT_VIDEO_OVER_TS_MU_TTL].get() < 1) || (txtTSInputObject[INPUT_VIDEO_OVER_TS_MU_TTL].get() > 254)) {
                    objErrCode = MSG_STATUS.mID_0009;
                    return capi_DispError(txtTSInputObject[INPUT_VIDEO_OVER_TS_MU_TTL].getInputObject(), objErrCode);
                }
            }
            return true;
        }
        function getSRTSettingData() {
            let data = {};
            if (!modeRadioButtonGroup.isDisabled()) {
                data['mode'] = modeRadioButtonGroup.getSelectedValue();
            }
            if (modeRadioButtonGroup.getSelectedValue() == 0) {
                if (txtSRTInputObject[INPUT_VIDEO_OVER_SRT_IP_ADDRESS].getStatus() != Input.STATUS_DISABLED) {
                    data['dip_addr'] = txtSRTInputObject[INPUT_VIDEO_OVER_SRT_IP_ADDRESS].get();
                }
                if (txtSRTInputObject[INPUT_VIDEO_OVER_SRT_DESTINATION_PORT].getStatus() != Input.STATUS_DISABLED) {
                    data['dport'] = txtSRTInputObject[INPUT_VIDEO_OVER_SRT_DESTINATION_PORT].get();
                }
                if (txtSRTInputObject[INPUT_VIDEO_OVER_IP_SRT_STREAM_ID].getStatus() != Input.STATUS_DISABLED) {
                    data['streamid'] = txtSRTInputObject[INPUT_VIDEO_OVER_IP_SRT_STREAM_ID].get();
                }
            } else {
                if (txtSRTInputObject[INPUT_VIDEO_OVER_IP_SRT_CLIENT_PORT].getStatus() != Input.STATUS_DISABLED) {
                    data['lport'] = txtSRTInputObject[INPUT_VIDEO_OVER_IP_SRT_CLIENT_PORT].get();
                }
            }


            data['ttl'] = txtSRTInputObject[INPUT_VIDEO_OVER_IP_SRT_TTL_HOP_LIMIT].get();
            if (txtSRTInputObject[INPUT_VIDEO_OVER_SRT_LATENCY].getStatus() != Input.STATUS_DISABLED) {
                data['latency'] = txtSRTInputObject[INPUT_VIDEO_OVER_SRT_LATENCY].get();
            }
            if (!encryptionRadioButtonGroup.isDisabled()) {
                data['encryption'] = encryptionRadioButtonGroup.getSelectedValue();
            }
            if (txtSRTInputObject[INPUT_VIDEO_OVER_IP_SRT_PASSPHRASE].getStatus() != Input.STATUS_DISABLED) {
                data['passphrase'] = txtSRTInputObject[INPUT_VIDEO_OVER_IP_SRT_PASSPHRASE].get();
            }
            return data;
        }
        function getTsSettingData() {
            let data = {};
            if (ts_transmissionTypeSelect.getStatus() != Select.STATUS_DISABLED) {
                data['transmission'] = ts_transmissionTypeSelect.get();
            }
            if (txtTSInputObject[INPUT_VIDEO_OVER_TS_UN_IP4].getStatus() != Input.STATUS_DISABLED) {
                data['uni_addr'] = txtTSInputObject[INPUT_VIDEO_OVER_TS_UN_IP4].get();
            }
            if (txtTSInputObject[INPUT_VIDEO_OVER_TS_UN_PORT].getStatus() != Input.STATUS_DISABLED) {
                data['uni_port'] = txtTSInputObject[INPUT_VIDEO_OVER_TS_UN_PORT].get();
            }
            if (txtTSInputObject[INPUT_VIDEO_OVER_TS_MU_IP4].getStatus() != Input.STATUS_DISABLED) {
                data['multi_addr'] = txtTSInputObject[INPUT_VIDEO_OVER_TS_MU_IP4].get();
            }
            if (txtTSInputObject[INPUT_VIDEO_OVER_TS_MN_PORT].getStatus() != Input.STATUS_DISABLED) {
                data['multi_port'] = txtTSInputObject[INPUT_VIDEO_OVER_TS_MN_PORT].get();
            }
            if (!pushRadioButtonGroup.isDisabled()) {
                data['push'] = pushRadioButtonGroup.getSelectedValue();
            }
            if (txtTSInputObject[INPUT_VIDEO_OVER_TS_MU_TTL].getStatus() != Input.STATUS_DISABLED) {
                data['multi_ttl'] = txtTSInputObject[INPUT_VIDEO_OVER_TS_MU_TTL].get();
            }
            return data;
        }
        function getNDIHXSettingData2() {
            var data = {};
            data['h264_unimulti'] = selectNDIHXTransmissionType.get();
            var ipaddr = txtSRTInputObject[INPUT_VIDEO_OVER_SRT_IP_ADDRESS].get();
            if (ipaddr != NDIHX_multicast_addr) {
                var ip = ipaddr.split(".");
                if (ip[3] == 255) {
                    ip[3] = 254;
                    data['multicast_addr'] = ip.join(".");
                } else {
                    ip[3] = parseInt(ip[3]) + 1;
                    data['multicast_addr'] = ip.join(".");
                }
                NDIHX_multicast_addr = txtSRTInputObject[INPUT_VIDEO_OVER_SRT_IP_ADDRESS].get();
            }
            var ndiPort = txtSRTInputObject[INPUT_VIDEO_OVER_IP_SRT_CLIENT_PORT].get();
            if (ndiPort != NDIHX_multicast_port) {
                data['multicast_port'] = txtSRTInputObject[INPUT_VIDEO_OVER_IP_SRT_CLIENT_PORT].get();
                NDIHX_multicast_port = txtSRTInputObject[INPUT_VIDEO_OVER_IP_SRT_CLIENT_PORT].get();
            }

            return data;
        }

        return {
            build: function (type) {
                return buildSrtOrTs(type);
            }
        }
    }

    /**
     * High Bandwidth NDI Common setup画面:settingJPEG制御に関わる画面クラス
     * @class High Bandwidth NDI Common setup:settingJPEG制御に関わる画面クラス
     * @return {{build: High Bandwidth NDI Common setup, rebuild: rebuild}} build 構築�E琁E
     * @return {function} rebuild 再構築�E琁E
     * @constructor
     */

    function settingFullBandwidth() {
        /**
         * 構築フラグ
         * @type boolean
         */
        let buildFlag_NDI = false;
        /**
         * label定義
         * @type number
         */

        let txtNDIObject = [];
        const TXT_VIDEO_OVER_NDI_FORMAT = 1;
        const TXT_VIDEO_OVER_NDI_SOURCE_NAME = 2;
        const TXT_VIDEO_OVER_NDI_PROTOCOL = 3;
        const TXT_VIDEO_OVER_NDI_MULTICAST_TRANSMIT = 4;
        const TXT_VIDEO_OVER_NDI_ADDRESS = 5;
        const TXT_VIDEO_OVER_NDI_SUBNET = 6;
        const TXT_VIDEO_OVER_NDI_TTL_HOP = 7;
        const TXT_VIDEO_OVER_NDI_GROUP = 8;
        const TXT_VIDEO_OVER_NDI_NAME = 9;
        const TXT_VIDEO_OVER_NDI_USE_DISCOVERY_SERVER = 10;
        const TXT_VIDEO_OVER_NDI_SERVER_ADDRESS = 11;
        const TXT_VIDEO_OVER_NDI_TTL_MESSAGE = 12;


        let selectObject = [];
        const SELECT_NDI_FORMAT = 0;


        /**
         * input[] : text
         * @type txtSRTInputObject[]
         */
        let txtNDIInputObject = [];
        const SETUP_VIDEO_NDI_ADDRESS = 0;
        const SETUP_VIDEO_NDI_SUBNET = 1;
        const SETUP_VIDEO_NDI_TTL = 2;
        const SETUP_VIDEO_NDI_NAME = 3;
        const SETUP_VIDEO_NDI_SERVERADDRESS = 4;
        const SETUP_VIDEO_NDI_SOURCE_NAME = 5;

        let INPUT_VIDEO_OVER_SRT_DESTINATION_PORT = 0;
        let INPUT_VIDEO_OVER_SRT_LATENCY = 1;
        let INPUT_VIDEO_OVER_SRT_IP_ADDRESS = 2;
        let INPUT_VIDEO_OVER_IP_SRT_CLIENT_PORT = 3;
        let INPUT_VIDEO_OVER_IP_SRT_TTL_HOP_LIMIT = 4;
        let INPUT_VIDEO_OVER_IP_SRT_PASSPHRASE = 5;
        //let unicastTransmitRadio;
        let ProtocolRadio;
        let multicastTransmitRatio;
        let groupRadio;
        let useDiscoveryServerRadio;
        let ndi_set_button;

        let image_size = "";
        let un_transmit = "";
        let un_protocol = "";
        let mu_transmit = "";
        let mu_addr = "";
        let mu_subnet = "";
        let mu_ttl = "";
        let group_uses = "";
        let group_name = "";
        let server_uses = "";
        let server_addr = "";
        let source_name = "";
        function getCurrentValueOfNDI() {
            let objNdi = cparam_getNdiInfo();
            image_size = objNdi["image_size"];
            un_transmit = objNdi["unicast_transmit"];
            un_protocol = objNdi["unicast_protocol"];
            mu_transmit = objNdi["multicast_transmit"];
            mu_addr = objNdi["multicast_addr"];
            mu_subnet = objNdi["multicast_subnet"];
            mu_ttl = objNdi["multicast_ttl"];
            group_uses = objNdi["group_uses"];
            group_name = objNdi["group_name"];
            server_uses = objNdi["server_uses"];
            server_addr = objNdi["server_addr"];
            source_name = objNdi["source_name"];
        }

        function buildNDI() {
            getCurrentValueOfNDI();
            if (!buildFlag_NDI) {
                buildFlag_NDI = true;
                // format
                txtNDIObject[TXT_VIDEO_OVER_NDI_FORMAT] = TextCtrl('setup_videoOverIp_NDI_main_label', 'txt_video_over_ndi_format', NPTZ_WORDING.wID_0196);
                selectObject[SELECT_NDI_FORMAT] = SelectCtrl("setup_videoOverIp_NDI_main_label", "select_ndi_format", "select_ndi_format", "select_ndi_format");
                let size = image_size.split("_");
                if (size[1].length > 2) {
                    size[1] = size[1].substring(0, 2) + "." + size[1].substring(2, 4);
                }
                size = size[0] + "/" + size[1] + "P";
                const obj = {};
                obj[size] = cparam_get_ip_signal_ndi_format();
                // obj[size] =size[0]; 
                const objs = optionAdd(obj);
                selectObject[SELECT_NDI_FORMAT].refreshOptions(objs);
                //selectObject[SELECT_NDI_FORMAT].appendOptions(select_ndi_format_value, select_ndi_format_text);
                selectObject[SELECT_NDI_FORMAT].show();
                selectObject[SELECT_NDI_FORMAT].displayOff();

                //source name
                txtNDIObject[TXT_VIDEO_OVER_NDI_SOURCE_NAME] = TextCtrl('setup_videoOverIp_NDI_main_label', 'txt_video_over_ndi_unicast_transmit', NPTZ_WORDING.wID_0526);
                txtNDIInputObject[SETUP_VIDEO_NDI_SOURCE_NAME] = InputCtrl("setup_videoOverIp_NDI_main_form_part", 'ndi_source_name', 'ndi_source_name', 'input_video_over_ip_ndi_source_name', source_name, null, null, null, null, 32)

                //protocol
                txtNDIObject[TXT_VIDEO_OVER_NDI_PROTOCOL] = TextCtrl('setup_videoOverIp_NDI_main_label_part', 'txt_video_over_ndi_protocol', NPTZ_WORDING.wID_0527);
                ProtocolRadio = RadioButtonGroupCtrl("setup_videoOverIp_NDI_main_form_part", "setup_videoOverIp_nid_protocol_", RADIO_GROUP.rID_0061, un_protocol, callbackProtocol);


                //mul transmit
                txtNDIObject[TXT_VIDEO_OVER_NDI_MULTICAST_TRANSMIT] = TextCtrl('setup_videoOverIp_NDI_main_label_part', 'txt_video_over_ndi_multicast_transmit', NPTZ_WORDING.wID_0528);
                multicastTransmitRatio = RadioButtonGroupCtrl("setup_videoOverIp_NDI_main_form_part", "setup_videoOverIp_nid_multicast_transmit_", RADIO_GROUP.rID_0001, mu_transmit, callbackMn_transmit);


                //address
                txtNDIObject[TXT_VIDEO_OVER_NDI_ADDRESS] = TextCtrl('setup_videoOverIp_NDI_main_label_part', 'txt_video_over_ndi_address', NPTZ_WORDING.wID_0529);
                txtNDIInputObject[SETUP_VIDEO_NDI_ADDRESS] = InputCtrl("setup_videoOverIp_NDI_main_form_part", 'ndi_address', 'ndi_address', 'input_video_over_ip_ndi_address', mu_addr, null, null, null, null);


                //subnet
                txtNDIObject[TXT_VIDEO_OVER_NDI_SUBNET] = TextCtrl('setup_videoOverIp_NDI_main_label_part', 'txt_video_over_ndi_subnet', NPTZ_WORDING.wID_0530);
                txtNDIInputObject[SETUP_VIDEO_NDI_SUBNET] = InputCtrl("setup_videoOverIp_NDI_main_form_part", 'ndi_subnet', 'ndi_subnet', 'input_video_over_ip_ndi_subnet', mu_subnet, null, null, null, null);


                //ttl hop limt
                txtNDIObject[TXT_VIDEO_OVER_NDI_TTL_HOP] = TextCtrl('setup_videoOverIp_NDI_main_label_part', 'txt_video_over_ndi_ttl_hop', NPTZ_WORDING.wID_0519);
                txtNDIObject[TXT_VIDEO_OVER_NDI_TTL_MESSAGE] = TextCtrl('setup_videoOverIp_NDI_main_form_part', 'txt_video_over_ndi_ttl_message', NPTZ_WORDING.wID_0535);
                txtNDIInputObject[SETUP_VIDEO_NDI_TTL] = InputCtrl("setup_videoOverIp_NDI_main_form_part", 'ndi_ttl', 'ndi_ttl', 'input_video_over_ip_ndi_ttl', mu_ttl, null, null, null, null);

                let bind_name = 'input';
                if (navigator.userAgent.indexOf('MSIE') != -1) {
                    bind_name = 'propertychange';
                }
                $('#ndi_ttl').bind(bind_name, function (event) {
                    const num = event.target.value;
                    if (!CheckNum(num)) {
                        jAlert(MSG_STATUS.mID_0010, NPTZ_WORDING.wID_0039);
                    }
                });

                //group
                txtNDIObject[TXT_VIDEO_OVER_NDI_GROUP] = TextCtrl('setup_videoOverIp_NDI_main_label_part', 'txt_video_over_ndi_group', NPTZ_WORDING.wID_0531);
                groupRadio = RadioButtonGroupCtrl("setup_videoOverIp_NDI_main_form_part", "setup_videoOverIp_nid_group_", RADIO_GROUP.rID_0041, group_uses, callbackGroupUses);

                //name
                txtNDIObject[TXT_VIDEO_OVER_NDI_NAME] = TextCtrl('setup_videoOverIp_NDI_main_label_part', 'txt_video_over_ndi_name', NPTZ_WORDING.wID_0532);
                txtNDIInputObject[SETUP_VIDEO_NDI_NAME] = InputCtrl("setup_videoOverIp_NDI_main_form_part", 'ndi_name', 'ndi_name', 'input_video_over_ip_ndi_name', group_name, null, null, null, null, 63);


                //use discovery server
                txtNDIObject[TXT_VIDEO_OVER_NDI_USE_DISCOVERY_SERVER] = TextCtrl('setup_videoOverIp_NDI_main_label_part', 'txt_video_over_ndi_use_discovery_server', NPTZ_WORDING.wID_0533);
                useDiscoveryServerRadio = RadioButtonGroupCtrl("setup_videoOverIp_NDI_main_form_part", "setup_videoOverIp_nid_uds_", RADIO_GROUP.rID_0041, server_uses, callbackServerUses);


                //server address
                txtNDIObject[TXT_VIDEO_OVER_NDI_SERVER_ADDRESS] = TextCtrl('setup_videoOverIp_NDI_main_label_part', 'txt_video_over_ndi_server_address', NPTZ_WORDING.wID_0534);
                txtNDIInputObject[SETUP_VIDEO_NDI_SERVERADDRESS] = InputCtrl("setup_videoOverIp_NDI_main_form_part", 'ndi_serveraddress', 'ndi_serveraddress', 'inputvideo_ndi_serveraddress', server_addr, null, null, null, null);

                ndi_set_button = ButtonCtrl("setup_videoOverIp_NDI_main_form_part", "setup_videoOverIp_ndi_set_button", NPTZ_WORDING.wID_0141, callbackNDISetButton);
                ndi_set_button.getButtonObject().addClass('button_class');
                ndi_set_button.show();
                ndi_set_button.displayOff();

                LineCtrl('setup_videoOverIp_NDI_main', 'horizontal', 541, 50, "", "txt_video_over_ndi_format", "97.5");
                LineCtrl('setup_videoOverIp_NDI_main', 'horizontal', 73, 0, "", "txt_video_over_ndi_unicast_transmit", "97.5")
                LineCtrl('setup_videoOverIp_NDI_main', 'horizontal', 73, 0, "", "txt_video_over_ndi_protocol", "97.5")
                LineCtrl('setup_videoOverIp_NDI_main', 'horizontal', 141, 0, "", "txt_video_over_ndi_multicast_transmit", "96")
                LineCtrl('setup_videoOverIp_NDI_main', 'horizontal', 209, 0, "", "txt_video_over_ndi_address", "96")
                LineCtrl('setup_videoOverIp_NDI_main', 'horizontal', 277, 0, "", "txt_video_over_ndi_subnet", "96")
                LineCtrl('setup_videoOverIp_NDI_main', 'horizontal', 345, 0, "", "txt_video_over_ndi_ttl_hop", "96")
                LineCtrl('setup_videoOverIp_NDI_main', 'horizontal', 413, 0, "", "txt_video_over_ndi_group", "96")
                LineCtrl('setup_videoOverIp_NDI_main', 'horizontal', 481, 0, "", "txt_video_over_ndi_name", "96")
                LineCtrl('setup_videoOverIp_NDI_main', 'horizontal', 541, 37, "", "txt_video_over_ndi_use_discovery_server", "96");
                LineCtrl('setup_videoOverIp_NDI_main', 'horizontal', 541, 37, "", "txt_video_over_ndi_use_server_address", "96");
                //LineCtrl('setup_videoOverIp_NDI_main', 'vertical', 541, 37, 100, "setup_videoOverIp_NDI_label1");
                LineCtrl('setup_videoOverIp_NDI_main', 'vertical', 541, 37, 100, "setup_videoOverIp_NDI_label2");
                LineCtrl('setup_videoOverIp_NDI_main', 'vertical', 541, 37, 100, "setup_videoOverIp_NDI_label3");
                LineCtrl('setup_videoOverIp_NDI_main', 'vertical', 541, 37, 100, "setup_videoOverIp_NDI_label4");

                for (let text in txtNDIObject) {
                    txtNDIObject[text].show();
                }
                for (let text in txtNDIInputObject) {
                    txtNDIInputObject[text].show();
                    txtNDIInputObject[text].displayOff();
                }

                changeItemStatus();
            } else {
                rebuild();
            }

        }

        function optionAdd(obj) {
            CropStatu = cparam_get_UHDCrop();
            if (cparam_get_format() == "1F" && CropStatu == "0") {
                if (cparam_get_ip_signal_ndi_format() == "20") {
                    sizeAdd = "2160/60p";
                    obj[sizeAdd] = "1F";
                }
                if (cparam_get_ip_signal_ndi_format() == "1F") {
                    sizeAdd2 = "1080/60p";
                    obj[sizeAdd2] = "20";
                }

            }
            // if(cparam_get_format()=="1F"&&CropStatu=="1"){
            //     if(cparam_get_ip_signal_ndi_format()=="20"){
            //         sizeAdd="2160/60p";
            //         obj[sizeAdd] = "1F";
            //     }
            //     if(cparam_get_ip_signal_ndi_format()=="1F"){
            //             sizeAdd2="1080/60p";
            //             obj[sizeAdd2] = "20";
            //     }
            // }

            if (cparam_get_format() == "19" && CropStatu == "0") {
                if (cparam_get_ip_signal_ndi_format() != "10") {
                    sizeAdd = "1080/59.94p";
                    //10
                    obj[sizeAdd] = "10";
                } else {
                    sizeAdd = "2160/59.94p";
                    obj[sizeAdd] = "19";
                }
            }
            if (cparam_get_format() == "17" && CropStatu == "0") {
                if (cparam_get_ip_signal_ndi_format() != "14") {
                    sizeAdd = "1080/29.97p";
                    //14
                    obj[sizeAdd] = "14";
                } else {
                    sizeAdd = "2160/29.97p";
                    obj[sizeAdd] = "17";
                }

            }
            if (cparam_get_format() == "1A" && CropStatu == "0") {
                if (cparam_get_ip_signal_ndi_format() != "11") {
                    sizeAdd = "1080/50p";
                    //11
                    obj[sizeAdd] = "11";

                } else {
                    sizeAdd = "2160/50p";
                    //11
                    obj[sizeAdd] = "1A";

                }

            }
            if (cparam_get_format() == "18" && CropStatu == "0") {
                if (cparam_get_ip_signal_ndi_format() != "15") {
                    sizeAdd = "1080/25p";
                    obj[sizeAdd] = "15";
                } else {
                    sizeAdd = "2160/25p";
                    obj[sizeAdd] = "18";
                }

            }
            if (cparam_get_format() == "21" && CropStatu == "0") {
                if (cparam_get_ip_signal_ndi_format() != "22") {
                    sizeAdd = "1080/24p";
                    obj[sizeAdd] = "22";
                } else {
                    sizeAdd = "2160/24p";
                    obj[sizeAdd] = "21";
                }
            }
            if (cparam_get_format() == "1B" && CropStatu == "0") {
                if (cparam_get_ip_signal_ndi_format() != "23") {
                    sizeAdd = "1080/23.98p";
                    obj[sizeAdd] = "23";

                } else {
                    sizeAdd = "2160/23.98p";
                    obj[sizeAdd] = "1B";
                }

            }

            return obj;
        }

        function rebuild() {
            getCurrentValueOfNDI();
            //unicastTransmitRadio.setSelectedValue(un_transmit);

            ProtocolRadio.setSelectedValue(un_protocol);
            multicastTransmitRatio.setSelectedValue(mu_transmit);
            groupRadio.setSelectedValue(group_uses);
            useDiscoveryServerRadio.setSelectedValue(server_uses);
            txtNDIInputObject[SETUP_VIDEO_NDI_ADDRESS].val(mu_addr);
            txtNDIInputObject[SETUP_VIDEO_NDI_SUBNET].val(mu_subnet);
            txtNDIInputObject[SETUP_VIDEO_NDI_TTL].val(mu_ttl);
            txtNDIInputObject[SETUP_VIDEO_NDI_NAME].val(group_name);
            txtNDIInputObject[SETUP_VIDEO_NDI_SERVERADDRESS].val(server_addr);
            txtNDIInputObject[SETUP_VIDEO_NDI_SOURCE_NAME].val(source_name);
            let size = image_size.split("_");
            if (size[1].length > 2) {
                size[1] = size[1].substring(0, 2) + "." + size[1].substring(2, 4);
            }
            size = size[0] + "/" + size[1] + "P";
            const obj = {};
            obj[size] = cparam_get_ip_signal_ndi_format();
            const objs = optionAdd(obj);
            selectObject[SELECT_NDI_FORMAT].refreshOptions(objs);
            changeItemStatus();
        }
        function callbackProtocol() {
        }
        function callbackGroupUses() {
            if (groupRadio.getSelectedValue() == "0") {
                txtNDIInputObject[SETUP_VIDEO_NDI_NAME].displayDisabled();
            } else {
                txtNDIInputObject[SETUP_VIDEO_NDI_NAME].displayOff();
                // txtNDIInputObject[SETUP_VIDEO_NDI_NAME].val(group_name);
            }
        }

        function callbackServerUses() {
            if (useDiscoveryServerRadio.getSelectedValue() == "0") {
                txtNDIInputObject[SETUP_VIDEO_NDI_SERVERADDRESS].displayDisabled();
            } else {
                txtNDIInputObject[SETUP_VIDEO_NDI_SERVERADDRESS].displayOff();
                // txtNDIInputObject[SETUP_VIDEO_NDI_SERVERADDRESS].val(server_addr);
            }
        }

        /**
         *
         */
        function changeItemStatus() {
            // if(unicastTransmitRadio.getSelectedValue() == "0"){
            //     ProtocolRadio.displayDisabled();
            // }else{
            //     ProtocolRadio.displayOff();
            //     ProtocolRadio.setSelectedValue(un_protocol);
            // }
            if (multicastTransmitRatio.getSelectedValue() == "0" || ProtocolRadio.getSelectedValue() == "tcp") {
                txtNDIInputObject[SETUP_VIDEO_NDI_ADDRESS].displayDisabled();
                txtNDIInputObject[SETUP_VIDEO_NDI_SUBNET].displayDisabled();
                txtNDIInputObject[SETUP_VIDEO_NDI_TTL].displayDisabled();
                //ProtocolRadio.setSelectedValue(un_protocol);
                ProtocolRadio.displayOff();
            } else {
                txtNDIInputObject[SETUP_VIDEO_NDI_ADDRESS].displayOff();
                txtNDIInputObject[SETUP_VIDEO_NDI_SUBNET].displayOff();
                txtNDIInputObject[SETUP_VIDEO_NDI_TTL].displayOff();
                //ProtocolRadio.setSelectedValue(un_protocol);
                ProtocolRadio.displayDisabled();
            }
            if (groupRadio.getSelectedValue() == "0") {
                txtNDIInputObject[SETUP_VIDEO_NDI_NAME].displayDisabled();
            } else {
                txtNDIInputObject[SETUP_VIDEO_NDI_NAME].displayOff();
            }
            if (useDiscoveryServerRadio.getSelectedValue() == "0") {
                txtNDIInputObject[SETUP_VIDEO_NDI_SERVERADDRESS].displayDisabled();
            } else {
                txtNDIInputObject[SETUP_VIDEO_NDI_SERVERADDRESS].displayOff();
            }
        }


        /**
         *
         */
        function callbackUn_transmit() {
            if (unicastTransmitRadio.getSelectedValue() == "0") {
                ProtocolRadio.setSelectedValue(un_protocol);
                ProtocolRadio.displayDisabled();
            } else {
                ProtocolRadio.displayOff();
                ProtocolRadio.setSelectedValue(un_protocol);
            }
        }
        /**
         *
         */
        function callbackMn_transmit() {
            if (multicastTransmitRatio.getSelectedValue() == "0") {
                txtNDIInputObject[SETUP_VIDEO_NDI_ADDRESS].displayDisabled();
                txtNDIInputObject[SETUP_VIDEO_NDI_SUBNET].displayDisabled();
                txtNDIInputObject[SETUP_VIDEO_NDI_TTL].displayDisabled();
                ProtocolRadio.displayOff();
                //ProtocolRadio.setSelectedValue(un_protocol);
            } else {
                txtNDIInputObject[SETUP_VIDEO_NDI_ADDRESS].displayOff();
                txtNDIInputObject[SETUP_VIDEO_NDI_SUBNET].displayOff();
                txtNDIInputObject[SETUP_VIDEO_NDI_TTL].displayOff();
                //ProtocolRadio.setSelectedValue(un_protocol);
                ProtocolRadio.displayDisabled();
            }
        }
        /**
         *
         */
        function callbackNDISetButton(mouse) {
            if (mouse == Button.MOUSE_DOWN) {
                if (!checkAllInput()) {
                    return;
                }
                // if (!checkBitRateTotal('H264_1', selectNDIHXMaxBitRateMax.get() / 1000)) {
                //     jAlert(MSG_STATUS.mID_0075, NPTZ_WORDING.wID_0039);
                //     rebuild(currentType);
                //     return;
                // }
                $("#dialog_setup").show();
                cparam_set_ip_signal_ndi_format(selectObject[SELECT_NDI_FORMAT].get());
                $.ajax({
                    type: "get",
                    url: '/cgi-bin/set_ndi_info',
                    data: getNDISettingData(),
                    success: function (data) {
                        setTimeout(function () {
                            $("#dialog_setup").hide();
                            // $("#dialog_setup").setCgiValue(data);
                        }, 500);
                    },
                    error: function (jqXHR, textStatus, errorThrown) {
                        setTimeout(function () {
                            $("#dialog_setup").hide();
                        }, 500);
                    }
                });
            }
        }

        function checkAllInput() {
            let giIPv4Chg = [0, 16777216, 65536, 256, 1];
            let gulIpAddr = 0;
            let gulSubnet = 0;
            let objIpAddr;
            let objNetMask;
            let serIpAddr;
            with (document) {
                objNetMask = ($("#ndi_subnet").val() == '' || $("#ndi_subnet").val() == null) ? ["", "", "", ""] : [$("#ndi_subnet").val().split(".")[0], $("#ndi_subnet").val().split(".")[1], $("#ndi_subnet").val().split(".")[2], $("#ndi_subnet").val().split(".")[3]];
                serIpAddr = ($("#ndi_serveraddress").val() == '' || $("#ndi_serveraddress").val() == null) ? ["", "", "", ""] : [$("#ndi_serveraddress").val().split(".")[0], $("#ndi_serveraddress").val().split(".")[1], $("#ndi_serveraddress").val().split(".")[2], $("#ndi_serveraddress").val().split(".")[3]]
            }

            for (let i = 1; i <= 4; i++) {
                gulSubnet += parseInt(objNetMask[i - 1] * giIPv4Chg[i]);
            }
            // ip
            if (chknet_ipaddr_familly(txtNDIInputObject[SETUP_VIDEO_NDI_ADDRESS].get()) == "IPv6") {
                objErrCode = MSG_STATUS.mID_0043;
                return capi_DispError(txtNDIInputObject[SETUP_VIDEO_NDI_ADDRESS].getInputObject(), objErrCode);
            }
            if (!chknet_CheckMultiAddr(txtNDIInputObject[SETUP_VIDEO_NDI_ADDRESS].get())) {
                // chknet_CheckMultiAddr冁E�E��E�objErrCodeが設定される
                return capi_DispError(txtNDIInputObject[SETUP_VIDEO_NDI_ADDRESS].getInputObject(), objErrCode);
            }

            // subnetmask
            if (chknet_isIpBlank(objNetMask[0], objNetMask[1], objNetMask[2], objNetMask[3])) {
                return capi_DispError(eval(document.getElementById("ndi_subnet")), MSG_STATUS.mID_0094);
            }
            if ((!chknet_IsIpDigit(objNetMask[0], objNetMask[1], objNetMask[2], objNetMask[3]))
                || (!chknet_CheckSubnetRange(objNetMask[0], objNetMask[1], objNetMask[2], objNetMask[3]))) {
                return capi_DispError(eval(document.getElementById("ndi_subnet")), MSG_STATUS.mID_0094);
            }
            if (!chknet_CheckIPv4Sub(gulSubnet)) return capi_DispError(eval(document.getElementById("ndi_subnet")), MSG_STATUS.mID_0094);

            // ttl/hup limit
            if ((txtNDIInputObject[SETUP_VIDEO_NDI_TTL].get() < 1) || (txtNDIInputObject[SETUP_VIDEO_NDI_TTL].get() > 254) || !chknet_portNo(txtNDIInputObject[SETUP_VIDEO_NDI_TTL].get())) {
                objErrCode = MSG_STATUS.mID_0009;
                return capi_DispError(txtNDIInputObject[SETUP_VIDEO_NDI_TTL].getInputObject(), objErrCode);
            }

            if (txtNDIInputObject[SETUP_VIDEO_NDI_SERVERADDRESS].getStatus() != Input.STATUS_DISABLED) {
                // ser ipp
                if (chknet_isIpBlank(serIpAddr[0], serIpAddr[1], serIpAddr[2], serIpAddr[3])) return capi_DispError(eval(document.getElementById("ndi_serveraddress")), MSG_STATUS.mID_0005);
                if ((!chknet_IsIpDigit(serIpAddr[0], serIpAddr[1], serIpAddr[2], serIpAddr[3]))
                    || (!chknet_CheckRange2(serIpAddr[0], serIpAddr[1], serIpAddr[2], serIpAddr[3]))) {
                    return capi_DispError(eval(document.getElementById("ndi_serveraddress")), MSG_STATUS.mID_0005);
                }
            }
            const sSymbol = "-_";
            if (!capi_isAlphaNumSymbol(txtNDIInputObject[SETUP_VIDEO_NDI_SOURCE_NAME].get(), sSymbol)) {
                objErrCode = MSG_STATUS.mID_0009;
                return capi_DispError(txtNDIInputObject[SETUP_VIDEO_NDI_SOURCE_NAME].getInputObject(), objErrCode);
            }

            return true;
        }

        function chknet_CheckSubnetRange(arIP1, arIP2, arIP3, arIP4) {
            var arIP = [];
            var iIndex;
            for (iIndex = 1; iIndex <= 4; iIndex++) {
                arIP[iIndex] = parseInt(eval("arIP" + iIndex));
            }
            for (iIndex = 1; iIndex <= 4; iIndex++) {
                if ((arIP[iIndex] < 0) || (arIP[iIndex] > 255)) {
                    objErrCode = MSG_STATUS.mID_0009;
                    giErrNum = iIndex;
                    return false;
                }
            }
            if (((arIP[1] == 127) && (arIP[2] == 0) && (arIP[3] == 0) && (arIP[4] == 1))
                || ((arIP[1] == 0) && (arIP[2] == 0) && (arIP[3] == 0) && (arIP[4] == 0))) {
                objErrCode = MSG_STATUS.mID_0027;
                giErrNum = 1;
                return false;
            }
            return true;
        }

        function getNDISettingData() {
            let data = {};
            // if (selectObject[SELECT_NDI_FORMAT].getStatus() != Select.STATUS_DISABLED) {
            //     data['image_size'] = selectObject[SELECT_NDI_FORMAT].get();
            // }
            // data['image_size'] = selectObject[SELECT_NDI_FORMAT].get();
            data['source_name'] = txtNDIInputObject[SETUP_VIDEO_NDI_SOURCE_NAME].get();

            // if (!unicastTransmitRadio.isDisabled()) {
            data['unicast_protocol'] = ProtocolRadio.getSelectedValue();
            // }
            data['multicast_transmit'] = multicastTransmitRatio.getSelectedValue();
            if (!multicastTransmitRatio.isDisabled()) {
                if (txtNDIInputObject[SETUP_VIDEO_NDI_ADDRESS].getStatus() != Input.STATUS_DISABLED) {
                    data['multicast_addr'] = txtNDIInputObject[SETUP_VIDEO_NDI_ADDRESS].get();
                }
                if (txtNDIInputObject[SETUP_VIDEO_NDI_SUBNET].getStatus() != Input.STATUS_DISABLED) {
                    data['multicast_subnet'] = txtNDIInputObject[SETUP_VIDEO_NDI_SUBNET].get();
                }
                if (txtNDIInputObject[SETUP_VIDEO_NDI_TTL].getStatus() != Input.STATUS_DISABLED) {
                    data['multicast_ttl'] = txtNDIInputObject[SETUP_VIDEO_NDI_TTL].get();
                }
            }

            data['group_uses'] = groupRadio.getSelectedValue();

            if (!groupRadio.isDisabled()) {
                if (txtNDIInputObject[SETUP_VIDEO_NDI_NAME].getStatus() != Input.STATUS_DISABLED) {
                    data['group_name'] = txtNDIInputObject[SETUP_VIDEO_NDI_NAME].get();
                }
            }
            data['server_uses'] = useDiscoveryServerRadio.getSelectedValue();
            if (!useDiscoveryServerRadio.isDisabled()) {
                if (txtNDIInputObject[SETUP_VIDEO_NDI_SERVERADDRESS].getStatus() != Input.STATUS_DISABLED) {
                    data['server_addr'] = txtNDIInputObject[SETUP_VIDEO_NDI_SERVERADDRESS].get();
                }
            }
            return data;
        }

        function getNDIHXSettingData2() {
            var data = {};
            data['h264_unimulti'] = selectNDIHXTransmissionType.get();
            var ipaddr = txtSRTInputObject[INPUT_VIDEO_OVER_SRT_IP_ADDRESS].get();
            if (ipaddr != NDIHX_multicast_addr) {
                var ip = ipaddr.split(".");
                if (ip[3] == 255) {
                    ip[3] = 254;
                    data['multicast_addr'] = ip.join(".");
                } else {
                    ip[3] = parseInt(ip[3]) + 1;
                    data['multicast_addr'] = ip.join(".");
                }
                NDIHX_multicast_addr = txtSRTInputObject[INPUT_VIDEO_OVER_SRT_IP_ADDRESS].get();
            }
            var ndiPort = txtSRTInputObject[INPUT_VIDEO_OVER_IP_SRT_CLIENT_PORT].get();
            if (ndiPort != NDIHX_multicast_port) {
                data['multicast_port'] = txtSRTInputObject[INPUT_VIDEO_OVER_IP_SRT_CLIENT_PORT].get();
                NDIHX_multicast_port = txtSRTInputObject[INPUT_VIDEO_OVER_IP_SRT_CLIENT_PORT].get();
            }

            return data;
        }

        return {
            build: function () {
                return buildNDI();
            }
        }
    }

    function settingNDIHXV2() {
        /**
         * 構築フラグ
         * @type boolean
         */
        let buildFlag_NDI = false;
        /**
         * label定義
         * @type number
         */

        let txtNDIObject = [];
        const TXT_VIDEO_OVER_NDI_FORMAT = 1;
        const TXT_VIDEO_OVER_NDI_SOURCE_NAME = 2;
        const TXT_VIDEO_OVER_NDI_PROTOCOL = 3;
        const TXT_VIDEO_OVER_NDI_MULTICAST_TRANSMIT = 4;
        const TXT_VIDEO_OVER_NDI_ADDRESS = 5;
        const TXT_VIDEO_OVER_NDI_SUBNET = 6;
        const TXT_VIDEO_OVER_NDI_TTL_HOP = 7;
        const TXT_VIDEO_OVER_NDI_GROUP = 8;
        const TXT_VIDEO_OVER_NDI_NAME = 9;
        const TXT_VIDEO_OVER_NDI_USE_DISCOVERY_SERVER = 10;
        const TXT_VIDEO_OVER_NDI_SERVER_ADDRESS = 11;
        const TXT_VIDEO_OVER_NDI_TTL_MESSAGE = 12;


        let selectObject = [];
        const SELECT_NDI_FORMAT = 0;


        /**
         * input[] : text
         * @type txtSRTInputObject[]
         */
        let txtNDIInputObject = [];
        const SETUP_VIDEO_NDI_ADDRESS = 0;
        const SETUP_VIDEO_NDI_SUBNET = 1;
        const SETUP_VIDEO_NDI_TTL = 2;
        const SETUP_VIDEO_NDI_NAME = 3;
        const SETUP_VIDEO_NDI_SERVERADDRESS = 4;
        const SETUP_VIDEO_NDI_SOURCE_NAME = 5;

        let INPUT_VIDEO_OVER_SRT_DESTINATION_PORT = 0;
        let INPUT_VIDEO_OVER_SRT_LATENCY = 1;
        let INPUT_VIDEO_OVER_SRT_IP_ADDRESS = 2;
        let INPUT_VIDEO_OVER_IP_SRT_CLIENT_PORT = 3;
        let INPUT_VIDEO_OVER_IP_SRT_TTL_HOP_LIMIT = 4;
        let INPUT_VIDEO_OVER_IP_SRT_PASSPHRASE = 5;
        //let unicastTransmitRadio;
        let ProtocolRadio;
        let multicastTransmitRatio;
        let groupRadio;
        let useDiscoveryServerRadio;
        let ndi_set_button;

        let image_size = "";
        let un_transmit = "";
        let un_protocol = "";
        let mu_transmit = "";
        let mu_addr = "";
        let mu_subnet = "";
        let mu_ttl = "";
        let group_uses = "";
        let group_name = "";
        let server_uses = "";
        let server_addr = "";
        let source_name = "";
        function getCurrentValueOfNDI() {
            let objNdi = cparam_getNdi2Info();
            un_transmit = objNdi["unicast_transmit"];
            un_protocol = objNdi["unicast_protocol"];
            mu_transmit = objNdi["multicast_transmit"];
            mu_addr = objNdi["multicast_addr"];
            mu_subnet = objNdi["multicast_subnet"];
            mu_ttl = objNdi["multicast_ttl"];
            group_uses = objNdi["group_uses"];
            group_name = objNdi["group_name"];
            server_uses = objNdi["server_uses"];
            server_addr = objNdi["server_addr"];
            source_name = objNdi["source_name"];
        }

        function buildNDI() {
            getCurrentValueOfNDI();
            if (!buildFlag_NDI) {
                buildFlag_NDI = true;

                //source name
                txtNDIObject[TXT_VIDEO_OVER_NDI_SOURCE_NAME] = TextCtrl('setup_videoOverIp_NDIHX_stream_label', 'txt_video_over_ndi_unicast_transmit', NPTZ_WORDING.wID_0526);
                txtNDIInputObject[SETUP_VIDEO_NDI_SOURCE_NAME] = InputCtrl("setup_videoOverIp_NDIHX_stream_form", 'ndi_source_name', 'ndi_source_name', 'input_video_over_ip_ndi_source_name', source_name, null, null, null, null, 32);

                //protocol
                txtNDIObject[TXT_VIDEO_OVER_NDI_PROTOCOL] = TextCtrl('setup_videoOverIp_NDIHX_stream_label', 'txt_video_over_ndi_protocol', NPTZ_WORDING.wID_0527);
                ProtocolRadio = RadioButtonGroupCtrl("setup_videoOverIp_NDIHX_stream_form", "setup_videoOverIp_nid_protocol_", RADIO_GROUP.rID_0061, un_protocol, callbackProtocol);


                //mul transmit
                txtNDIObject[TXT_VIDEO_OVER_NDI_MULTICAST_TRANSMIT] = TextCtrl('setup_videoOverIp_NDIHX_stream_label', 'txt_video_over_ndi_multicast_transmit', NPTZ_WORDING.wID_0528);
                multicastTransmitRatio = RadioButtonGroupCtrl("setup_videoOverIp_NDIHX_stream_form", "setup_videoOverIp_nid_multicast_transmit_", RADIO_GROUP.rID_0001, mu_transmit, callbackMn_transmit);


                //address
                txtNDIObject[TXT_VIDEO_OVER_NDI_ADDRESS] = TextCtrl('setup_videoOverIp_NDIHX_stream_label', 'txt_video_over_ndi_address', NPTZ_WORDING.wID_0529);
                txtNDIInputObject[SETUP_VIDEO_NDI_ADDRESS] = InputCtrl("setup_videoOverIp_NDIHX_stream_form", 'ndi_address', 'ndi_address', 'input_video_over_ip_ndi_address', mu_addr, null, null, null, null);


                //subnet
                txtNDIObject[TXT_VIDEO_OVER_NDI_SUBNET] = TextCtrl('setup_videoOverIp_NDIHX_stream_label', 'txt_video_over_ndi_subnet', NPTZ_WORDING.wID_0530);
                txtNDIInputObject[SETUP_VIDEO_NDI_SUBNET] = InputCtrl("setup_videoOverIp_NDIHX_stream_form", 'ndi_subnet', 'ndi_subnet', 'input_video_over_ip_ndi_subnet', mu_subnet, null, null, null, null);


                //ttl hop limt
                txtNDIObject[TXT_VIDEO_OVER_NDI_TTL_HOP] = TextCtrl('setup_videoOverIp_NDIHX_stream_label', 'txt_video_over_ndi_ttl_hop', NPTZ_WORDING.wID_0519);
                txtNDIObject[TXT_VIDEO_OVER_NDI_TTL_MESSAGE] = TextCtrl('setup_videoOverIp_NDIHX_stream_form', 'txt_video_over_ndi_ttl_message', NPTZ_WORDING.wID_0535);
                txtNDIInputObject[SETUP_VIDEO_NDI_TTL] = InputCtrl("setup_videoOverIp_NDIHX_stream_form", 'ndi_ttl', 'ndi_ttl', 'input_video_over_ip_ndi_ttl', mu_ttl, null, null, null, null);

                let bind_name = 'input';
                if (navigator.userAgent.indexOf('MSIE') != -1) {
                    bind_name = 'propertychange';
                }
                $('#ndi_ttl').bind(bind_name, function (event) {
                    const num = event.target.value;
                    if (!CheckNum(num)) {
                        jAlert(MSG_STATUS.mID_0010, NPTZ_WORDING.wID_0039);
                    }
                });

                //group
                txtNDIObject[TXT_VIDEO_OVER_NDI_GROUP] = TextCtrl('setup_videoOverIp_NDIHX_stream_label', 'txt_video_over_ndi_group', NPTZ_WORDING.wID_0531);
                groupRadio = RadioButtonGroupCtrl("setup_videoOverIp_NDIHX_stream_form", "setup_videoOverIp_nid_group_", RADIO_GROUP.rID_0041, group_uses, callbackGroupUses);

                //name
                txtNDIObject[TXT_VIDEO_OVER_NDI_NAME] = TextCtrl('setup_videoOverIp_NDIHX_stream_label', 'txt_video_over_ndi_name', NPTZ_WORDING.wID_0532);
                txtNDIInputObject[SETUP_VIDEO_NDI_NAME] = InputCtrl("setup_videoOverIp_NDIHX_stream_form", 'ndi_name', 'ndi_name', 'input_video_over_ip_ndi_name', group_name, null, null, null, null, 63);


                //use discovery server
                txtNDIObject[TXT_VIDEO_OVER_NDI_USE_DISCOVERY_SERVER] = TextCtrl('setup_videoOverIp_NDIHX_stream_label', 'txt_video_over_ndi_use_discovery_server', NPTZ_WORDING.wID_0533);
                useDiscoveryServerRadio = RadioButtonGroupCtrl("setup_videoOverIp_NDIHX_stream_form", "setup_videoOverIp_nid_uds_", RADIO_GROUP.rID_0041, server_uses, callbackServerUses);


                //server address
                txtNDIObject[TXT_VIDEO_OVER_NDI_SERVER_ADDRESS] = TextCtrl('setup_videoOverIp_NDIHX_stream_label', 'txt_video_over_ndi_server_address', NPTZ_WORDING.wID_0534);
                txtNDIInputObject[SETUP_VIDEO_NDI_SERVERADDRESS] = InputCtrl("setup_videoOverIp_NDIHX_stream_form", 'ndi_serveraddress', 'ndi_serveraddress', 'inputvideo_ndi_serveraddress', server_addr, null, null, null, null);

                ndi_set_button = ButtonCtrl("setup_videoOverIp_NDIHX_stream_main", "setup_videoOverIp_ndi2_set_button", NPTZ_WORDING.wID_0141, callbackNDISetButton);
                ndi_set_button.getButtonObject().addClass('button_class');
                ndi_set_button.show();
                ndi_set_button.displayOff();

                LineCtrl('setup_videoOverIp_NDIHX_stream_main', 'horizontal', 541, 50, "", "txt_video_over_ndi_format", "97.5");
                LineCtrl('setup_videoOverIp_NDIHX_stream_main', 'horizontal', 73, 0, "", "txt_video_over_ndi_unicast_transmit", "97.5")
                LineCtrl('setup_videoOverIp_NDIHX_stream_main', 'horizontal', 73, 0, "", "txt_video_over_ndi_protocol", "97.5")
                LineCtrl('setup_videoOverIp_NDIHX_stream_main', 'horizontal', 141, 0, "", "txt_video_over_ndi_multicast_transmit", "96")
                LineCtrl('setup_videoOverIp_NDIHX_stream_main', 'horizontal', 209, 0, "", "txt_video_over_ndi_address", "96")
                LineCtrl('setup_videoOverIp_NDIHX_stream_main', 'horizontal', 277, 0, "", "txt_video_over_ndi_subnet", "96")
                LineCtrl('setup_videoOverIp_NDIHX_stream_main', 'horizontal', 345, 0, "", "txt_video_over_ndi_ttl_hop", "96")
                LineCtrl('setup_videoOverIp_NDIHX_stream_main', 'horizontal', 413, 0, "", "txt_video_over_ndi_group", "96")
                LineCtrl('setup_videoOverIp_NDIHX_stream_main', 'horizontal', 481, 0, "", "txt_video_over_ndi_name", "96")
                LineCtrl('setup_videoOverIp_NDIHX_stream_main', 'horizontal', 541, 37, "", "txt_video_over_ndi_use_discovery_server", "96");
                LineCtrl('setup_videoOverIp_NDIHX_stream_main', 'horizontal', 541, 37, "", "txt_video_over_ndi_use_server_address", "96");
                //LineCtrl('setup_videoOverIp_NDI_main', 'vertical', 541, 37, 100, "setup_videoOverIp_NDI_label1");
                LineCtrl('setup_videoOverIp_NDIHX_stream_main', 'vertical', 541, 37, 100, "setup_videoOverIp_NDI_label2");
                LineCtrl('setup_videoOverIp_NDIHX_stream_main', 'vertical', 541, 37, 100, "setup_videoOverIp_NDI_label3");
                LineCtrl('setup_videoOverIp_NDIHX_stream_main', 'vertical', 541, 37, 100, "setup_videoOverIp_NDI_label4");

                for (let text in txtNDIObject) {
                    txtNDIObject[text].show();
                }
                for (let text in txtNDIInputObject) {
                    txtNDIInputObject[text].show();
                    txtNDIInputObject[text].displayOff();
                }

                changeItemStatus();
            } else {
                rebuild();
            }
        }

        function rebuild() {
            getCurrentValueOfNDI();
            //unicastTransmitRadio.setSelectedValue(un_transmit);

            ProtocolRadio.setSelectedValue(un_protocol);
            multicastTransmitRatio.setSelectedValue(mu_transmit);
            groupRadio.setSelectedValue(group_uses);
            useDiscoveryServerRadio.setSelectedValue(server_uses);
            txtNDIInputObject[SETUP_VIDEO_NDI_ADDRESS].val(mu_addr);
            txtNDIInputObject[SETUP_VIDEO_NDI_SUBNET].val(mu_subnet);
            txtNDIInputObject[SETUP_VIDEO_NDI_TTL].val(mu_ttl);
            txtNDIInputObject[SETUP_VIDEO_NDI_NAME].val(group_name);
            txtNDIInputObject[SETUP_VIDEO_NDI_SERVERADDRESS].val(server_addr);
            txtNDIInputObject[SETUP_VIDEO_NDI_SOURCE_NAME].val(source_name);
            changeItemStatus();
        }
        function callbackProtocol() {
            protocolStatusChange();
        }

        function protocolStatusChange() {
            if (ProtocolRadio.getSelectedValue() == "tcp") {
                multicastTransmitRatio.displayDisabled();
            } else {
                multicastTransmitRatio.displayOff();
            }
        }
        function callbackGroupUses() {
            if (groupRadio.getSelectedValue() == "0") {
                txtNDIInputObject[SETUP_VIDEO_NDI_NAME].displayDisabled();
            } else {
                txtNDIInputObject[SETUP_VIDEO_NDI_NAME].displayOff();
                // txtNDIInputObject[SETUP_VIDEO_NDI_NAME].val(group_name);
            }
        }

        function callbackServerUses() {
            if (useDiscoveryServerRadio.getSelectedValue() == "0") {
                txtNDIInputObject[SETUP_VIDEO_NDI_SERVERADDRESS].displayDisabled();
            } else {
                txtNDIInputObject[SETUP_VIDEO_NDI_SERVERADDRESS].displayOff();
                // txtNDIInputObject[SETUP_VIDEO_NDI_SERVERADDRESS].val(server_addr);
            }
        }

        /**
         *
         */
        function changeItemStatus() {
            // if(unicastTransmitRadio.getSelectedValue() == "0"){
            //     ProtocolRadio.displayDisabled();
            // }else{
            //     ProtocolRadio.displayOff();
            //     ProtocolRadio.setSelectedValue(un_protocol);
            // }
            protocolStatusChange();
            if (multicastTransmitRatio.getSelectedValue() == "0" || ProtocolRadio.getSelectedValue() == "tcp") {
                txtNDIInputObject[SETUP_VIDEO_NDI_ADDRESS].displayDisabled();
                txtNDIInputObject[SETUP_VIDEO_NDI_SUBNET].displayDisabled();
                txtNDIInputObject[SETUP_VIDEO_NDI_TTL].displayDisabled();
                //ProtocolRadio.setSelectedValue(un_protocol);
                ProtocolRadio.displayOff();
            } else {
                txtNDIInputObject[SETUP_VIDEO_NDI_ADDRESS].displayOff();
                txtNDIInputObject[SETUP_VIDEO_NDI_SUBNET].displayOff();
                txtNDIInputObject[SETUP_VIDEO_NDI_TTL].displayOff();
                //ProtocolRadio.setSelectedValue(un_protocol);
                ProtocolRadio.displayDisabled();
            }
            if (groupRadio.getSelectedValue() == "0") {
                txtNDIInputObject[SETUP_VIDEO_NDI_NAME].displayDisabled();
            } else {
                txtNDIInputObject[SETUP_VIDEO_NDI_NAME].displayOff();
            }
            if (useDiscoveryServerRadio.getSelectedValue() == "0") {
                txtNDIInputObject[SETUP_VIDEO_NDI_SERVERADDRESS].displayDisabled();
            } else {
                txtNDIInputObject[SETUP_VIDEO_NDI_SERVERADDRESS].displayOff();
            }
        }


        /**
         *
         */
        function callbackUn_transmit() {
            if (unicastTransmitRadio.getSelectedValue() == "0") {
                ProtocolRadio.setSelectedValue(un_protocol);
                ProtocolRadio.displayDisabled();
            } else {
                ProtocolRadio.displayOff();
                ProtocolRadio.setSelectedValue(un_protocol);
            }
        }
        /**
         *
         */
        function callbackMn_transmit() {
            if (multicastTransmitRatio.getSelectedValue() == "0") {
                txtNDIInputObject[SETUP_VIDEO_NDI_ADDRESS].displayDisabled();
                txtNDIInputObject[SETUP_VIDEO_NDI_SUBNET].displayDisabled();
                txtNDIInputObject[SETUP_VIDEO_NDI_TTL].displayDisabled();
                ProtocolRadio.displayOff();
                //ProtocolRadio.setSelectedValue(un_protocol);
            } else {
                txtNDIInputObject[SETUP_VIDEO_NDI_ADDRESS].displayOff();
                txtNDIInputObject[SETUP_VIDEO_NDI_SUBNET].displayOff();
                txtNDIInputObject[SETUP_VIDEO_NDI_TTL].displayOff();
                //ProtocolRadio.setSelectedValue(un_protocol);
                ProtocolRadio.displayDisabled();
            }
        }
        /**
         *
         */
        function callbackNDISetButton(mouse) {
            if (mouse == Button.MOUSE_DOWN) {
                if (!checkAllInput()) {
                    return;
                }
                // if (!checkBitRateTotal('H264_1', selectNDIHXMaxBitRateMax.get() / 1000)) {
                //     jAlert(MSG_STATUS.mID_0075, NPTZ_WORDING.wID_0039);
                //     rebuild(currentType);
                //     return;
                // }
                $("#dialog_setup").show();
                $.ajax({
                    type: "get",
                    url: '/cgi-bin/set_ndi_hx_info',
                    data: getNDISettingData(),
                    success: function (data) {
                        setTimeout(function () {
                            $("#dialog_setup").hide();
                        }, 500);
                    },
                    error: function (jqXHR, textStatus, errorThrown) {
                        setTimeout(function () {
                            $("#dialog_setup").hide();
                        }, 500);
                    }
                });
            }
        }

        function checkAllInput() {
            let giIPv4Chg = [0, 16777216, 65536, 256, 1];
            let gulIpAddr = 0;
            let gulSubnet = 0;
            let objIpAddr;
            let objNetMask;
            let serIpAddr;
            with (document) {
                objNetMask = ($("#ndi_subnet").val() == '' || $("#ndi_subnet").val() == null) ? ["", "", "", ""] : [$("#ndi_subnet").val().split(".")[0], $("#ndi_subnet").val().split(".")[1], $("#ndi_subnet").val().split(".")[2], $("#ndi_subnet").val().split(".")[3]];
                serIpAddr = ($("#ndi_serveraddress").val() == '' || $("#ndi_serveraddress").val() == null) ? ["", "", "", ""] : [$("#ndi_serveraddress").val().split(".")[0], $("#ndi_serveraddress").val().split(".")[1], $("#ndi_serveraddress").val().split(".")[2], $("#ndi_serveraddress").val().split(".")[3]]
            }

            for (let i = 1; i <= 4; i++) {
                gulSubnet += parseInt(objNetMask[i - 1] * giIPv4Chg[i]);
            }
            // ip
            if (chknet_ipaddr_familly(txtNDIInputObject[SETUP_VIDEO_NDI_ADDRESS].get()) == "IPv6") {
                objErrCode = MSG_STATUS.mID_0043;
                return capi_DispError(txtNDIInputObject[SETUP_VIDEO_NDI_ADDRESS].getInputObject(), objErrCode);
            }
            if (!chknet_CheckMultiAddr(txtNDIInputObject[SETUP_VIDEO_NDI_ADDRESS].get())) {
                // chknet_CheckMultiAddr冁E�E��E�objErrCodeが設定される
                return capi_DispError(txtNDIInputObject[SETUP_VIDEO_NDI_ADDRESS].getInputObject(), objErrCode);
            }

            // subnetmask
            if (chknet_isIpBlank(objNetMask[0], objNetMask[1], objNetMask[2], objNetMask[3])) {
                return capi_DispError(eval(document.getElementById("ndi_subnet")), MSG_STATUS.mID_0094);
            }
            if ((!chknet_IsIpDigit(objNetMask[0], objNetMask[1], objNetMask[2], objNetMask[3]))
                || (!chknet_CheckSubnetRange(objNetMask[0], objNetMask[1], objNetMask[2], objNetMask[3]))) {
                return capi_DispError(eval(document.getElementById("ndi_subnet")), MSG_STATUS.mID_0094);
            }
            if (!chknet_CheckIPv4Sub(gulSubnet)) return capi_DispError(eval(document.getElementById("ndi_subnet")), MSG_STATUS.mID_0094);

            // ttl/hup limit
            if ((txtNDIInputObject[SETUP_VIDEO_NDI_TTL].get() < 1) || (txtNDIInputObject[SETUP_VIDEO_NDI_TTL].get() > 254) || !chknet_portNo(txtNDIInputObject[SETUP_VIDEO_NDI_TTL].get())) {
                objErrCode = MSG_STATUS.mID_0009;
                return capi_DispError(txtNDIInputObject[SETUP_VIDEO_NDI_TTL].getInputObject(), objErrCode);
            }

            if (txtNDIInputObject[SETUP_VIDEO_NDI_SERVERADDRESS].getStatus() != Input.STATUS_DISABLED) {
                // ser ipp
                if (chknet_isIpBlank(serIpAddr[0], serIpAddr[1], serIpAddr[2], serIpAddr[3])) return capi_DispError(eval(document.getElementById("ndi_serveraddress")), MSG_STATUS.mID_0005);
                if ((!chknet_IsIpDigit(serIpAddr[0], serIpAddr[1], serIpAddr[2], serIpAddr[3]))
                    || (!chknet_CheckRange2(serIpAddr[0], serIpAddr[1], serIpAddr[2], serIpAddr[3]))) {
                    return capi_DispError(eval(document.getElementById("ndi_serveraddress")), MSG_STATUS.mID_0005);
                }
            }
            const sSymbol = "-_";
            if (!capi_isAlphaNumSymbol(txtNDIInputObject[SETUP_VIDEO_NDI_SOURCE_NAME].get(), sSymbol)) {
                objErrCode = MSG_STATUS.mID_0009;
                return capi_DispError(txtNDIInputObject[SETUP_VIDEO_NDI_SOURCE_NAME].getInputObject(), objErrCode);
            }

            return true;
        }

        function chknet_CheckSubnetRange(arIP1, arIP2, arIP3, arIP4) {
            var arIP = [];
            var iIndex;
            for (iIndex = 1; iIndex <= 4; iIndex++) {
                arIP[iIndex] = parseInt(eval("arIP" + iIndex));
            }
            for (iIndex = 1; iIndex <= 4; iIndex++) {
                if ((arIP[iIndex] < 0) || (arIP[iIndex] > 255)) {
                    objErrCode = MSG_STATUS.mID_0009;
                    giErrNum = iIndex;
                    return false;
                }
            }
            if (((arIP[1] == 127) && (arIP[2] == 0) && (arIP[3] == 0) && (arIP[4] == 1))
                || ((arIP[1] == 0) && (arIP[2] == 0) && (arIP[3] == 0) && (arIP[4] == 0))) {
                objErrCode = MSG_STATUS.mID_0027;
                giErrNum = 1;
                return false;
            }
            return true;
        }

        function getNDISettingData() {
            let data = {};
            // if (selectObject[SELECT_NDI_FORMAT].getStatus() != Select.STATUS_DISABLED) {
            //     data['image_size'] = selectObject[SELECT_NDI_FORMAT].get();
            // }
            data['source_name'] = txtNDIInputObject[SETUP_VIDEO_NDI_SOURCE_NAME].get();

            // if (!unicastTransmitRadio.isDisabled()) {
            data['unicast_protocol'] = ProtocolRadio.getSelectedValue();
            // }
            data['multicast_transmit'] = multicastTransmitRatio.getSelectedValue();
            if (!multicastTransmitRatio.isDisabled()) {
                if (txtNDIInputObject[SETUP_VIDEO_NDI_ADDRESS].getStatus() != Input.STATUS_DISABLED) {
                    data['multicast_addr'] = txtNDIInputObject[SETUP_VIDEO_NDI_ADDRESS].get();
                }
                if (txtNDIInputObject[SETUP_VIDEO_NDI_SUBNET].getStatus() != Input.STATUS_DISABLED) {
                    data['multicast_subnet'] = txtNDIInputObject[SETUP_VIDEO_NDI_SUBNET].get();
                }
                if (txtNDIInputObject[SETUP_VIDEO_NDI_TTL].getStatus() != Input.STATUS_DISABLED) {
                    data['multicast_ttl'] = txtNDIInputObject[SETUP_VIDEO_NDI_TTL].get();
                }
            }

            data['group_uses'] = groupRadio.getSelectedValue();

            if (!groupRadio.isDisabled()) {
                if (txtNDIInputObject[SETUP_VIDEO_NDI_NAME].getStatus() != Input.STATUS_DISABLED) {
                    data['group_name'] = txtNDIInputObject[SETUP_VIDEO_NDI_NAME].get();
                }
            }
            data['server_uses'] = useDiscoveryServerRadio.getSelectedValue();
            if (!useDiscoveryServerRadio.isDisabled()) {
                if (txtNDIInputObject[SETUP_VIDEO_NDI_SERVERADDRESS].getStatus() != Input.STATUS_DISABLED) {
                    data['server_addr'] = txtNDIInputObject[SETUP_VIDEO_NDI_SERVERADDRESS].get();
                }
            }
            return data;
        }

        function getNDIHXSettingData2() {
            var data = {};
            data['h264_unimulti'] = selectNDIHXTransmissionType.get();
            var ipaddr = txtSRTInputObject[INPUT_VIDEO_OVER_SRT_IP_ADDRESS].get();
            if (ipaddr != NDIHX_multicast_addr) {
                var ip = ipaddr.split(".");
                if (ip[3] == 255) {
                    ip[3] = 254;
                    data['multicast_addr'] = ip.join(".");
                } else {
                    ip[3] = parseInt(ip[3]) + 1;
                    data['multicast_addr'] = ip.join(".");
                }
                NDIHX_multicast_addr = txtSRTInputObject[INPUT_VIDEO_OVER_SRT_IP_ADDRESS].get();
            }
            var ndiPort = txtSRTInputObject[INPUT_VIDEO_OVER_IP_SRT_CLIENT_PORT].get();
            if (ndiPort != NDIHX_multicast_port) {
                data['multicast_port'] = txtSRTInputObject[INPUT_VIDEO_OVER_IP_SRT_CLIENT_PORT].get();
                NDIHX_multicast_port = txtSRTInputObject[INPUT_VIDEO_OVER_IP_SRT_CLIENT_PORT].get();
            }

            return data;
        }

        return {
            build: function () {
                return buildNDI();
            }
        }
    }

    return {
        build: buildVideoOverIP,
        rebuild: rebuild,
        buildMyScroll: buildMyScroll,
        destroyMyScroll: destroyMyScroll

    };
}



/**
 * virtualStudio画面:virtualStudio制御に関わる画面クラス
 * @class audio画面:audio制御に関わる画面クラス
 * @return {{build: buildAudio, rebuild: rebuild}} build 構築�E琁E
 * @return {function} rebuild 再構築�E琁E
 * @constructor
 */
function virtualStudio() {
    /**
     * settingMode機能
     * @type settingAudio
     * */
    var settingMode = settingMode();
    /**
     * settingSetClient 機能
     * @type settingAudio
     * */
    var settingSetClient = settingSetClient();
    /**
     * Virtual main title
     */
    var txtVirtualMainTitle;
    /**
     * 構築フラグ
     * @type boolean
     */
    var buildFlag_virtual = false;
    /**
     * ボタンオブジェクチE
     * @type btnObject[]
     */
    var btnObject = [];
    var txtObject = [];
    /**
     * label定義
     * @type number
     */
    var TXT_VIRTUAL_STUDIO_LABEL = 0;
    /**
     * label定義
     * @type number
     */
    var TXT_AUDIO = 1;
    /**
     * btn_user_authボタンオブジェクチEインチE�E��E�クス値)
     *  @type object
     */
    var BTN_SETTING_STATUS_INDEX = 0;
    /**
     * btn_host_authボタンオブジェクチEインチE�E��E�クス値)
     *  @type object
     */
    var BTN_STREAMING_MODE_INDEX = 1;
    /**
     * btn_priority_streamボタンオブジェクチEインチE�E��E�クス値)
     *  @type object
     */
    var BTN_INITIAL_DISPLAY_SETTING_INDEX = 2;


    /**
     * Audio画面構築�E琁E
     */
    function build() {
        if (!buildFlag_virtual) {
            buildFlag_virtual = true;
            txtObject[TXT_VIRTUAL_STUDIO_LABEL] = TextCtrl('setup_virtual_menu_title', 'setup_virtual_menu_label', NPTZ_WORDING.wID_0463);

            btnObject[BTN_SETTING_STATUS_INDEX] = MenuButtonCtrl('setup_virtual_main', "setup_audio_settingStatus_btn", NPTZ_WORDING.wID_0077, callbackSettingVirtual, 1, MenuButtonType.SINGLE);
            txtObject[TXT_AUDIO] = TextCtrl('setup_virtual_main', 'setup_audio_audio_menu_label', NPTZ_WORDING.wID_0463);
            btnObject[BTN_STREAMING_MODE_INDEX] = MenuButtonCtrl('setup_virtual_main', "setup_audio_audio_btn", NPTZ_WORDING.wID_0464, callbackSettingVirtual, 2, MenuButtonType.TOP);
            btnObject[BTN_INITIAL_DISPLAY_SETTING_INDEX] = MenuButtonCtrl('setup_virtual_main', "setup_audio_audioOverIP_btn", NPTZ_WORDING.wID_0465, callbackSettingVirtual, 3, MenuButtonType.BOTTOM);

            for (var i = 0; i < btnObject.length; i++) {
                btnObject[i].show();
                btnObject[i].displayOff();
            }
            // main title
            txtAudioMainTitle = TextCtrl('setup_virtual_main_title', 'setup_virtual_main_title_label', NPTZ_WORDING.wID_0077);
            txtAudioMainTitle.show();

            for (var i = 0; i < txtObject.length; i++) {
                txtObject[i].show();
            }
            btnObject[BTN_SETTING_STATUS_INDEX].displayOn();
            callbackSettingAudio(Button.MOUSE_DOWN, 1);
        } else {
            rebuild();
        }
    }

    /**
     * 画面再構築�E琁E
     */
    function rebuild() {
        $("#setup_audio_menu").show();
        btnObject[BTN_SETTING_STATUS_INDEX].displayOn();
        callbackSettingAudio(Button.MOUSE_DOWN, 1);
    }

    function getClient() {
        var url = "/cgi-bin/get_vstudio_client_info";
        var ret = cparam_sendRequest(url);
        var result = {};
        if (ret) {
            ret = cparam_getRetArray(ret);
            for (var i = 0; i < ret.length; i++) {
                if (ret[i].indexOf("client_1_transport=") == 0) {
                    result.client_1_transport = ret[i].substring("client_1_transport=".length);
                    continue;
                }
                if (ret[i].indexOf("client_1_ipaddr=") == 0) {
                    result.client_1_ipaddr = ret[i].substring("client_1_ipaddr=".length);
                    continue;
                }
                if (ret[i].indexOf("client_1_port=") == 0) {
                    result.client_1_port = ret[i].substring("client_1_port=".length);
                    continue;
                }
                if (ret[i].indexOf("client_2_transport=") == 0) {
                    result.client_2_transport = ret[i].substring("client_2_transport=".length);
                    continue;
                }
                if (ret[i].indexOf("client_2_ipaddr=") == 0) {
                    result.client_2_ipaddr = ret[i].substring("client_2_ipaddr=".length);
                    continue;
                }
                if (ret[i].indexOf("client_2_port=") == 0) {
                    result.client_2_port = ret[i].substring("client_2_port=".length);
                    continue;
                }
                if (ret[i].indexOf("client_3_transport=") == 0) {
                    result.client_3_transport = ret[i].substring("client_3_transport=".length);
                    continue;
                }
                if (ret[i].indexOf("client_3_ipaddr=") == 0) {
                    result.client_3_ipaddr = ret[i].substring("client_3_ipaddr=".length);
                    continue;
                }
                if (ret[i].indexOf("client_3_port=") == 0) {
                    result.client_3_port = ret[i].substring("client_3_port=".length);
                    continue;
                }
                if (ret[i].indexOf("client_4_transport=") == 0) {
                    result.client_4_transport = ret[i].substring("client_4_transport=".length);
                    continue;
                }
                if (ret[i].indexOf("client_4_ipaddr=") == 0) {
                    result.client_4_ipaddr = ret[i].substring("client_4_ipaddr=".length);
                    continue;
                }
                if (ret[i].indexOf("client_4_port=") == 0) {
                    result.client_4_port = ret[i].substring("client_4_port=".length);
                    continue;
                }
            }
        }
        return result;
    }

    /**
     * SettingAudio吁E�E�Eタン押下時の画面表示刁E�E��E�処琁E
     */
    function callbackSettingAudio(mouse, type) {
        if (mouse == Button.MOUSE_DOWN) {
            $("#setup_audio_settingStatus_main").hide();
            $("#setup_audio_audio_main").hide();
            $("#setup_audio_audioOverIP_main").hide();
            $("#setup_audio_st2110_main").hide();
            switch (type) {
                case 1:
                    txtAudioMainTitle.set(NPTZ_WORDING.wID_0077);
                    settingMode.build(1);
                    $("#setup_audio_settingStatus_main").show();
                    break;
                case 2:
                    txtAudioMainTitle.set('Audio');
                    settingAudio.build(1);
                    Platform.setCurrentPage('audio.settingAudio');
                    $("#setup_audio_audio_main").show();
                    break;
                case 3:
                    txtAudioMainTitle.set('Audio over IP');
                    settingAudioOverIP.build(1);
                    $("#setup_audio_audioOverIP_main").show();
                    break;
            }
        }
    }

    /**
     * SettingAudio吁E�E�Eタン押下時の画面表示刁E�E��E�処琁E
     */
    function callbackSettingVirtual(mouse, type) {
        if (mouse == Button.MOUSE_DOWN) {
            $("#setup_virtual_settingStatus_main").hide();
            $("#setup_virtual_mode_main").hide();
            $("#setup_virtual_studio_main").hide();

            switch (type) {
                case 1:
                    txtAudioMainTitle.set(NPTZ_WORDING.wID_0077);
                    settingMode.build(1);
                    $("#setup_virtual_settingStatus_main").show();
                    $("#setup_audio_menu").hide();
                    break;
                case 2:
                    $("#setup_virtual_mode_main").show();
                    txtAudioMainTitle.set(NPTZ_WORDING.wID_0464);
                    settingMode.build(1);
                    break;
                case 3:
                    txtAudioMainTitle.set(NPTZ_WORDING.wID_0465);
                    settingSetClient.build(1);
                    $("#setup_virtual_studio_main").show();
                    break;
            }
        }
    }

    /**
     * settingAudio:settingAudio制御に関わる画面クラス
     * @class settingAudio画面:settingAudio制御に関わる画面クラス
     * @return {{build: buildAudio, rebuild: rebuild}} build 構築�E琁E
     * @return {function} rebuild 再構築�E琁E
     * @constructor
     */
    function settingMode() {
        /**
         * 構築フラグ
         * @type boolean
         */
        var buildFlag_settingAudio = false;
        /**
         * label定義
         * @type number
         */
        var TXT_AUDIO_AUDIO_AUDIO = 0;
        var TXT_AUDIO_AUDIO_INPUT_SETTING1 = 1;
        var TXT_INVERT_PAN_TILT_AXIS = 2;
        var TXT_CAMERA_ID = 3;
        var TXT_CAMERA_ID_MSG = 4;
        var TXT_AUDIO_AUDIO_PLUGIN_POWER = 5;
        var sliderAudioInputVolumeLevel;
        var txtAudioObject = [];

        var virtualModeSerialRadio;
        var virtualModeIpRadio;
        var invertPanRadio;
        var audio_set_button;

        var txtStatusObject = [];


        var AUDIO = 0;
        var INPUT_VOLUME_LEVEL = 1;
        var PLUGIN_POWER = 2;
        var AUDIO_TRANSMISSION = 3;
        var AUDIO_OVER_IP = 4;

        var AUDIO_VALUE = 5;

        var PLUGIN_POWER_VALUE = 6;
        var AUDIO_TRANSMISSION_VALUE = 7;
        var AUDIO_OVER_IP_VALUE = 8;
        var AUDIO_TITLE = 9;
        var AUDIO_OVER_IP_TITLE = 10;
        var INPUT_TYPE = 11;
        var INPUT_TYPE_VALUE = 12;

        let inputObject;
        let btnObject;

        function buildSettingVirtual() {
            if (!buildFlag_settingAudio) {
                buildFlag_settingAudio = true;

                //setting status

                //title
                // txtStatusObject[AUDIO_TITLE] = TextCtrl("setup_virtual_settingStatus_main", 'setup_audio_settingStatus_audio_title', NPTZ_WORDING.wID_0464);
                // txtStatusObject[AUDIO_OVER_IP_TITLE] = TextCtrl("setup_virtual_settingStatus_main", 'setup_audio_settingStatus_ip_out_title', NPTZ_WORDING.wID_0465);

                // txtStatusObject[AUDIO] = TextCtrl("setup_virtual_settingStatus_main", 'setup_audio_settingStatus_audio', NPTZ_WORDING.wID_0466);
                // txtStatusObject[INPUT_TYPE] = TextCtrl("setup_virtual_settingStatus_main", 'setup_audio_settingStatus_input_type', NPTZ_WORDING.wID_0477);
                // txtStatusObject[AUDIO_TRANSMISSION] = TextCtrl("setup_virtual_settingStatus_main", 'setup_audio_settingStatus_ip_address', NPTZ_WORDING.wID_0080);
                // txtStatusObject[AUDIO_OVER_IP] = TextCtrl("setup_virtual_settingStatus_main", 'setup_audio_settingStatus_port', NPTZ_WORDING.wID_0468);

                // txtStatusObject[AUDIO_VALUE] = TextCtrl("setup_virtual_settingStatus_main", 'setup_audio_settingStatus_audio_value', cparam_get_Serial());
                // txtStatusObject[INPUT_TYPE_VALUE] = TextCtrl("setup_virtual_settingStatus_main", 'setup_audio_settingStatus_input_type_value',getUdpStr());

                txtStatusObject[AUDIO_TRANSMISSION_VALUE] = TextCtrl("setup_virtual_settingStatus_main", 'setup_audio_settingStatus_audio_transmission_value', "");
                txtStatusObject[AUDIO_OVER_IP_VALUE] = TextCtrl("setup_virtual_settingStatus_main", 'setup_audio_settingStatus_audio_over_op_value', "");

                txtStatusObject[AUDIO_TRANSMISSION_VALUE].set("");
                txtStatusObject[AUDIO_OVER_IP_VALUE].set("");

                //camera id

                txtAudioObject[TXT_CAMERA_ID] = TextCtrl('setup_virtual_mode_label', 'setup_camera_id', NPTZ_WORDING.wID_0582);
                txtAudioObject[TXT_CAMERA_ID_MSG] = TextCtrl('setup_virtual_mode_form', 'setup_camera_id_msg', "(0-255)");
                inputObject = InputCtrl("setup_virtual_mode_form", 'cam_id', 'cam_id', 'setup_cam_id_text', '', null, null, null, null);
                inputObject.show();
                inputObject.displayOff();
                btnObject = ButtonCtrl("setup_virtual_mode_form", "connection_type_set_button", NPTZ_WORDING.wID_0141, callbackSetButtion);
                btnObject.show();
                btnObject.displayOff();
                LineCtrl('setup_virtual_mode_main', 'horizontal', 141, 0, 1320, "setup_camera_id_label", "98");
                // Serial
                txtAudioObject[TXT_AUDIO_AUDIO_AUDIO] = TextCtrl('setup_virtual_mode_label_part', 'setup_audio_audio_audio_label', NPTZ_WORDING.wID_0466);
                // Serial radioButtonItems
                virtualModeSerialRadio = RadioButtonGroupCtrl("setup_virtual_mode_form_part", "setup_audio_audio_audio_", RADIO_GROUP.rID_0001, "", callbackVirtualMode);
                LineCtrl('setup_virtual_mode_main', 'horizontal', 73, 0, 1320, "setup_serial_label", "98");

                //IP
                txtAudioObject[TXT_AUDIO_AUDIO_INPUT_SETTING1] = TextCtrl('setup_virtual_mode_label_part', 'setup_audio_audio_input_setting1_label', NPTZ_WORDING.wID_0477)
                // IP radioButtonItems
                virtualModeIpRadio = RadioButtonGroupCtrl("setup_virtual_mode_form_part", "setup_audio_audio_inputType_", RADIO_GROUP.rID_0001, "", callbackVirtualIP);

                // Invert Pan/Tilt Axis
                txtAudioObject[TXT_INVERT_PAN_TILT_AXIS] = TextCtrl('setup_virtual_mode_label_part', 'setup_invert_pan_tilt_label', NPTZ_WORDING.wID_0568);
                // Invert Pan/Tilt Axis radioButtonItems
                invertPanRadio = RadioButtonGroupCtrl("setup_virtual_mode_form_part", "setup_invert_pan_tilt_axis_", RADIO_GROUP.rID_0001, "", callbackInvertPanTilt);
                LineCtrl('setup_virtual_mode_main', 'horizontal', 141, 0, 1320, "setup_ip_udp_label", "98");
                LineCtrl('setup_virtual_mode_main', 'horizontal', 141, 0, 1320, "setup_invert_pan_tilt_axis_label", "98");

                for (var text in txtAudioObject) {
                    txtAudioObject[text].show();
                }
                for (var text in txtStatusObject) {
                    txtStatusObject[text].show();
                }
                initVirtualStudioModeStatus();
                updateClientListTable();
                systemFormatControl();
                // intiIp_UdpData();
            } else {
                rebuild();
            }
        }

        function systemFormatControl() {
            var format = getCurrentFormat();
            if (format == CONST_1080_119_88p || format == CONST_1080_100p) {
                virtualModeSerialRadio.setDisable("0,1");
                virtualModeIpRadio.setDisable("0,1");
            } else {
                virtualModeSerialRadio.setEnable("0,1");
                virtualModeIpRadio.setEnable("0,1");
            }
        }

        /**
         *
         */
        function callbackSetButtion(mouse) {

            if (mouse == Button.MOUSE_DOWN) {
                const val = inputObject.get();
                if (val >= 0 && val < 256) {
                    $("#dialog_setup").show();
                    cparam_set_camera_id(inputObject.get())
                    setTimeout(function () {
                        $("#dialog_setup").hide();
                    }, 500)
                } else {
                    jAlert(MSG_STATUS.mID_0009, NPTZ_WORDING.wID_0039);

                }
            }
        }

        function getUdpStr() {
            var ip_udp = cparam_get_mode_ip();

            for (var key in RADIO_GROUP.rID_0016) {
                if (RADIO_GROUP.rID_0016[key] == ip_udp) {
                    return key;
                }
            }
        }

        function intiIp_UdpData() {
            txtStatusObject[INPUT_TYPE_VALUE].set(getUdpStr());
        }

        function updateClientListTable() {
            $("#clienttable1").remove();
            $("#clienttable").remove();
            var req = getClient();
            var intNo = 0;
            // チE�E�Eブル制御用変数
            var tabNode = document.createElement("table");
            var tabNode1 = document.createElement("table");
            var row = tabNode.insertRow(0);
            var row1 = tabNode1.insertRow(0);
            var cell;


            tabNode1.id = "clienttable1";

            // Connection type
            cell = row1.insertCell(-1);
            cell.innerHTML = 'Connection type';
            $(cell).css({
                width: '300px',
                align: 'center',
                background: 'rgb(70,70,71)',
                height: '30px'
            });
            $(cell).css("padding-left", "30px");
            $(cell).css("font-size", "large");
            // Serial
            cell = row1.insertCell(-1);
            cell.innerHTML = 'Serial';
            $(cell).css({
                width: '218px',
                align: 'center',
                background: 'rgb(70,70,71)',
            });
            $(cell).css("padding-left", "20px");
            $(cell).css("font-size", "large");
            // IP(UDP)
            cell = row1.insertCell(-1);
            cell.innerHTML = 'IP(UDP)';
            $(cell).css({
                width: '82%',
                align: 'center',
                background: 'rgb(70,70,71)',
            });
            $(cell).css("padding-left", "8px");
            $(cell).css("font-size", "large");



            //value
            row1 = tabNode1.insertRow(-1);
            cell = row1.insertCell(-1);
            cell.innerHTML = '';
            $(cell).css("padding-left", "30px");
            $(cell).css("font-size", "large");
            // Serial
            cell = row1.insertCell(-1);
            cell.innerHTML = cparam_get_Serial() == 0 ? "Off" : "On";
            $(cell).css("padding-left", "30px");
            $(cell).css("font-size", "large");
            // IP(UDP)
            cell = row1.insertCell(-1);
            cell.innerHTML = getUdpStr();
            $(cell).css("padding-left", "20px");
            $(cell).css("font-size", "large");
            $(tabNode1).css('position', "absolute");
            $(tabNode1).css('border-collapse', "collapse");
            $('#setup_virtual_settingStatus_main').append(tabNode1);

            $(tabNode1).css('position', "absolute");
            $(tabNode1).css('border-collapse', "collapse");
            $('#setup_virtual_settingStatus_main').append(tabNode1);






            tabNode.id = "clienttable";

            // IP out
            cell = row.insertCell(-1);
            cell.innerHTML = 'IP out';
            $(cell).css({
                width: '300px',
                align: 'center',
                background: 'rgb(70,70,71)',
                height: '30px'
            });
            $(cell).css("padding-left", "30px");
            $(cell).css("font-size", "large");
            // IP address
            cell = row.insertCell(-1);
            cell.innerHTML = 'IP address';
            $(cell).css({
                width: '218px',
                align: 'center',
                background: 'rgb(70,70,71)',
            });
            $(cell).css("padding-left", "20px");
            $(cell).css("font-size", "large");
            // Port
            cell = row.insertCell(-1);
            cell.innerHTML = 'Port';
            $(cell).css({
                width: '82%',
                align: 'center',
                background: 'rgb(70,70,71)',
            });
            $(cell).css("padding-left", "8px");
            $(cell).css("font-size", "large");
            $(tabNode).css('position', "absolute");
            $(tabNode).css('border-collapse', "collapse");
            $('#setup_virtual_settingStatus_main').append(tabNode);

            for (var key = 1; key < 5; key++) {
                intNo = intNo + 1;
                row = tabNode.insertRow(-1);
                // User auth value
                cell = row.insertCell(-1);
                cell.innerHTML = intNo.toString() + ".";
                $(cell).css("width", "170px");
                $(cell).css("font-size", "large");
                $(cell).css("padding-left", "40px");
                // Authentication Value
                cell = row.insertCell(-1);
                cell.innerHTML = eval("req.client_" + key + "_ipaddr");
                $(cell).css("width", "170px");
                $(cell).css("font-size", "large");
                // Authentication Value
                cell = row.insertCell(-1);
                cell.innerHTML = eval("req.client_" + key + "_port");
                $(cell).css("width", "1160px");
                $(cell).css("font-size", "large");
                $(cell).css("padding-left", "5px");
            }
            $('#clienttable1').hide();
            setTimeout(function () {
                if (Platform.isTouchMode()) {
                    // $('#clienttable1').css("position","absolute");
                    $('#clienttable1').css("top", "25px");
                    $('#clienttable1').css("left", "30px");
                    $('#clienttable1').css("height", "30px");
                } else {
                    // $('#clienttable1').css("position","absolute");
                    $('#clienttable1').css("top", "25px");
                    $('#clienttable1').css("left", "20px");
                    $('#clienttable1').css("height", "30px");
                }
                $('#clienttable1').show();
            }, 100)
            $('#clienttable').hide();
            setTimeout(function () {
                if (Platform.isTouchMode()) {
                    // $('#clienttable').css("position","absolute");
                    $('#clienttable').css("top", "190px");
                    $('#clienttable').css("left", "30px");
                    $('#clienttable').css("height", "30px");
                } else {
                    // $('#clienttable').css("position","absolute");
                    $('#clienttable').css("top", "110px");
                    $('#clienttable').css("left", "20px");
                    $('#clienttable').css("height", "30px");
                }
                $('#clienttable').show();
            }, 100)
        }

        function initVirtualStudioModeStatus() {
            // txtStatusObject[AUDIO_VALUE].set(cparam_get_Serial() == 0?"Off":"On");
            // var input1Select = cparam_get_input1_select();
            // txtStatusObject[INPUT1_INPUT_SELECT_VALUE].set(input1Select == 0?"LINE":(input1Select == 1?"MAC":"MAC+48V"));
            virtualModeSerialRadio.setSelectedValue(cparam_get_Serial());
            virtualModeIpRadio.setSelectedValue(cparam_get_mode_ip());
            invertPanRadio.setSelectedValue(cparam_get_invert_pan_tilt_axis());
            inputObject.set(cparam_get_camera_id());
        }

        function rebuild() {
            initVirtualStudioModeStatus();
            updateClientListTable();
            systemFormatControl();
            // intiIp_UdpData();
        }
        function callbackInvertPanTilt(whichButton, mouse) {
            if (mouse == Button.MOUSE_DOWN) {
                cparam_set_invert_pan_tilt_axis(invertPanRadio.getSelectedValue());
            }

        }
        function callbackVirtualMode(whichButton, mouse) {
            if (mouse == Button.MOUSE_DOWN) {

                if (virtualModeSerialRadio.getSelectedValue() == 0) {
                    $("#dialog_setup").show();
                    cparam_set_Serial(virtualModeSerialRadio.getSelectedValue());
                    setTimeout(function () {
                        $("#dialog_setup").hide();
                    }, 500);
                } else {
                    jConfirm(MSG_STATUS.mid_0086, NPTZ_WORDING.wID_0039, NPTZ_WORDING.wID_0040, function (confirm) {
                        if (confirm) {
                            $("#dialog_setup").show();
                            cparam_set_Serial(virtualModeSerialRadio.getSelectedValue());
                            setTimeout(function () {
                                $("#dialog_setup").hide();
                            }, 500);
                        } else {
                            if (cparam_get_Serial() == 0) {
                                virtualModeSerialRadio.setSelectedValue(0);
                            }

                        }
                    });
                }
            }
        }

        function callbackVirtualIP(whichButton, mouse) {
            if (mouse == Button.MOUSE_DOWN) {
                if (virtualModeIpRadio.getSelectedValue() == 0) {
                    $("#dialog_setup").show();
                    cparam_set_mode_ip(virtualModeIpRadio.getSelectedValue());
                    setTimeout(function () {
                        $("#dialog_setup").hide();
                    }, 500);
                } else {
                    jConfirm(MSG_STATUS.mid_0087, NPTZ_WORDING.wID_0039, NPTZ_WORDING.wID_0040, function (confirm) {
                        if (confirm) {
                            $("#dialog_setup").show();
                            cparam_set_mode_ip(virtualModeIpRadio.getSelectedValue());
                            setTimeout(function () {
                                $("#dialog_setup").hide();
                            }, 500);
                        } else {
                            if (cparam_get_mode_ip() == 0) {
                                virtualModeIpRadio.setSelectedValue(0);
                            }
                        }
                    });
                }
            }

        }
        return {
            build: function () {
                return buildSettingVirtual();
            }
        }
    }

    /**
     * settingAudioOverIP:settingAudioOverIP制御に関わる画面クラス
     * @class settingAudioOverIP画面:settingAudioOverIP制御に関わる画面クラス
     * @return {{build: buildAudio, rebuild: rebuild}} build 構築�E琁E
     * @return {function} rebuild 再構築�E琁E
     * @constructor
     */
    function settingSetClient() {
        /**
         * 構築フラグ
         * @type boolean
         */
        var buildFlag_settingSetClient = false;
        /**
         * label定義
         * @type number
         */
        var TXT_OUTPUT_CLIENT_SELECT = 0;
        var TXT_CLIENT_1 = 1;
        var TXT_IP_ADDRESS_1 = 2;
        var TXT_PORT_1 = 3;

        var TXT_CLIENT_2 = 4;
        var TXT_IP_ADDRESS_2 = 5;
        var TXT_PORT_2 = 6

        var TXT_CLIENT_3 = 7;
        var TXT_IP_ADDRESS_3 = 8;
        var TXT_PORT_3 = 9;

        var TXT_CLIENT_4 = 10;
        var TXT_IP_ADDRESS_4 = 11;
        var TXT_PORT_4 = 12;
        var TXT_SELECT_CLIENT_1 = 13;
        var TXT_SELECT_CLIENT_2 = 14;
        var TXT_SELECT_CLIENT_3 = 15;
        var TXT_SELECT_CLIENT_4 = 16;
        var TXT_PORT_NUMBER = 17;
        var TXT_PORT_NUMBER2 = 18;
        var TXT_PORT_NUMBER3 = 19;
        var TXT_PORT_NUMBER4 = 20;

        var INPUT_IP = 0
        var INPUT_PORT = 1;
        var INPUT_IP2 = 2;
        var INPUT_PORT2 = 3;
        var INPUT_IP3 = 4;
        var INPUT_PORT3 = 5;
        var INPUT_IP4 = 6;
        var INPUT_PORT4 = 7;

        var BTN_CLENT_1 = 0;
        var BTN_CLENT_2 = 1;
        var BTN_CLENT_3 = 2;
        var BTN_CLENT_4 = 3;
        var BTN_SET = 4;

        var txtObject = [];
        var btnObject = [];
        var inputObject = [];

        var audioTransmissionRadioButtonGroup;
        var myScroll;
        var buildScrollSuccessFlg = true;

        function buildSettingSetClient() {
            if (!buildFlag_settingSetClient) {
                buildFlag_settingSetClient = true;
                // Set Client
                txtObject[TXT_OUTPUT_CLIENT_SELECT] = TextCtrl('setup_virtual_client_label', 'setup_audio_audio_st2110_audio_format_label', NPTZ_WORDING.wID_0473);

                btnObject[BTN_CLENT_1] = ButtonCtrl("setup_virtual_client_form", "client_button_1", "", callbackClientSet, BTN_CLENT_1);
                btnObject[BTN_CLENT_2] = ButtonCtrl("setup_virtual_client_form", "client_button_2", "", callbackClientSet, BTN_CLENT_2);
                btnObject[BTN_CLENT_3] = ButtonCtrl("setup_virtual_client_form", "client_button_3", "", callbackClientSet, BTN_CLENT_3);
                btnObject[BTN_CLENT_4] = ButtonCtrl("setup_virtual_client_form", "client_button_4", "", callbackClientSet, BTN_CLENT_4);
                btnObject[BTN_SET] = ButtonCtrl("setup_virtual_client_form", "client_set_button", NPTZ_WORDING.wID_0141, callbackSetButtion);

                txtObject[TXT_SELECT_CLIENT_1] = TextCtrl('setup_virtual_client_form', 'setup_set_client_select_client1', NPTZ_WORDING.wID_0469);
                txtObject[TXT_SELECT_CLIENT_2] = TextCtrl('setup_virtual_client_form', 'setup_set_client_select_client2', NPTZ_WORDING.wID_0470);
                txtObject[TXT_SELECT_CLIENT_3] = TextCtrl('setup_virtual_client_form', 'setup_set_client_select_client3', NPTZ_WORDING.wID_0471);
                txtObject[TXT_SELECT_CLIENT_4] = TextCtrl('setup_virtual_client_form', 'setup_set_client_select_client4', NPTZ_WORDING.wID_0472);

                //Client1
                txtObject[TXT_CLIENT_1] = TextCtrl('setup_virtual_client_label', 'setup_set_client_client1', NPTZ_WORDING.wID_0469);
                txtObject[TXT_IP_ADDRESS_1] = TextCtrl('setup_virtual_client_label', 'setup_set_client_ip1', NPTZ_WORDING.wID_0111);
                txtObject[TXT_PORT_1] = TextCtrl('setup_virtual_client_label', 'setup_set_client_port', NPTZ_WORDING.wID_0468);
                txtObject[TXT_PORT_NUMBER] = TextCtrl('setup_virtual_client_form', 'setup_set_client_port_number', NPTZ_WORDING.wID_0475);

                inputObject[INPUT_IP] = InputCtrl("setup_virtual_client_form", 'IP_addr1', 'IP_addr1', 'input_setup_set_client_ip1', '');
                inputObject[INPUT_PORT] = InputCtrl("setup_virtual_client_form", 'client_port1', 'client_port1', 'input_setup_set_client_port1', '');

                //Client2
                txtObject[TXT_CLIENT_2] = TextCtrl('setup_virtual_client_label', 'setup_set_client_client2', NPTZ_WORDING.wID_0470);
                txtObject[TXT_IP_ADDRESS_2] = TextCtrl('setup_virtual_client_label', 'setup_set_client_ip2', NPTZ_WORDING.wID_0111);
                txtObject[TXT_PORT_2] = TextCtrl('setup_virtual_client_label', 'setup_set_client_port2', NPTZ_WORDING.wID_0468);
                txtObject[TXT_PORT_NUMBER2] = TextCtrl('setup_virtual_client_form', 'setup_set_client_port_number2', NPTZ_WORDING.wID_0475);

                inputObject[INPUT_IP2] = InputCtrl("setup_virtual_client_form", 'IP_addr2', 'IP_addr2', 'input_setup_set_client_ip2', '');
                inputObject[INPUT_PORT2] = InputCtrl("setup_virtual_client_form", 'client_port2', 'client_port2', 'input_setup_set_client_port2', '');

                //Client3
                txtObject[TXT_CLIENT_3] = TextCtrl('setup_virtual_client_label', 'setup_set_client_client3', NPTZ_WORDING.wID_0471);
                txtObject[TXT_IP_ADDRESS_3] = TextCtrl('setup_virtual_client_label', 'setup_set_client_ip3', NPTZ_WORDING.wID_0111);
                txtObject[TXT_PORT_3] = TextCtrl('setup_virtual_client_label', 'setup_set_client_port3', NPTZ_WORDING.wID_0468);
                txtObject[TXT_PORT_NUMBER3] = TextCtrl('setup_virtual_client_form', 'setup_set_client_port_number3', NPTZ_WORDING.wID_0475);

                inputObject[INPUT_IP3] = InputCtrl("setup_virtual_client_form", 'IP_addr3', 'IP_addr3', 'input_setup_set_client_ip3', '');
                inputObject[INPUT_PORT3] = InputCtrl("setup_virtual_client_form", 'client_port3', 'client_port3', 'input_setup_set_client_port3', '');

                //Client4
                txtObject[TXT_CLIENT_4] = TextCtrl('setup_virtual_client_label', 'setup_set_client_client4', NPTZ_WORDING.wID_0472);
                txtObject[TXT_IP_ADDRESS_4] = TextCtrl('setup_virtual_client_label', 'setup_set_client_ip4', NPTZ_WORDING.wID_0111);
                txtObject[TXT_PORT_4] = TextCtrl('setup_virtual_client_label', 'setup_set_client_port4', NPTZ_WORDING.wID_0468);
                txtObject[TXT_PORT_NUMBER4] = TextCtrl('setup_virtual_client_form', 'setup_set_client_port_number4', NPTZ_WORDING.wID_0475);

                inputObject[INPUT_IP4] = InputCtrl("setup_virtual_client_form", 'IP_addr4', 'IP_addr4', 'input_setup_set_client_ip4', '');
                inputObject[INPUT_PORT4] = InputCtrl("setup_virtual_client_form", 'client_port4', 'client_port4', 'input_setup_set_client_port4', '');

                LineCtrl('setup_virtual_main_div', 'horizontal', 91, 0, 1320, "setup_set_client_select_label", "98");

                LineCtrl('setup_virtual_main_div', 'horizontal', 91, 0, 1320, "setup_set_client_client1_label", "95.5");
                LineCtrl('setup_virtual_main_div', 'horizontal', 91, 0, 1320, "setup_set_client_ipaddress1_label", "95.5");
                LineCtrl('setup_virtual_main_div', 'horizontal', 91, 0, 1320, "setup_set_client_port_label", "98");

                LineCtrl('setup_virtual_main_div', 'horizontal', 91, 0, 1320, "setup_set_client_client2_label", "95.5");
                LineCtrl('setup_virtual_main_div', 'horizontal', 91, 0, 1320, "setup_set_client_ipaddress2_label", "95.5");
                LineCtrl('setup_virtual_main_div', 'horizontal', 91, 0, 1320, "setup_set_client_port2_label", "98");

                LineCtrl('setup_virtual_main_div', 'horizontal', 91, 0, 1320, "setup_set_client_client3_label", "95.5");
                LineCtrl('setup_virtual_main_div', 'horizontal', 91, 0, 1320, "setup_set_client_ipaddress3_label", "95.5");
                LineCtrl('setup_virtual_main_div', 'horizontal', 91, 0, 1320, "setup_set_client_port3_label", "98");

                LineCtrl('setup_virtual_main_div', 'horizontal', 91, 0, 1320, "setup_set_client_client4_label", "95.5");
                LineCtrl('setup_virtual_main_div', 'horizontal', 91, 0, 1320, "setup_set_client_ipaddress4_label", "95.5");
                LineCtrl('setup_virtual_main_div', 'horizontal', 91, 0, 1320, "setup_set_client_port4_label", "98");
                for (var text in txtObject) {
                    txtObject[text].show();
                }
                for (var text in btnObject) {
                    btnObject[text].show();
                    btnObject[text].displayOff();
                }
                for (var text in inputObject) {
                    inputObject[text].show();
                    inputObject[text].displayOff();
                }
                // port 数字以外�E力できなぁE
                inputObject[INPUT_PORT].getInputObject().keypress(checkPortValue);
                inputObject[INPUT_PORT2].getInputObject().keypress(checkPortValue);
                inputObject[INPUT_PORT3].getInputObject().keypress(checkPortValue);
                inputObject[INPUT_PORT4].getInputObject().keypress(checkPortValue);
                //Scroll Bar構篁E
                buildMyScroll();
                initClientStatus();
            } else {
                rebuild();
            }
        }

        //Scroll Bar構築すめE
        function buildMyScroll() {
            if (buildScrollSuccessFlg) {
                buildScrollSuccessFlg = false;
                setTimeout(function () {
                    myScroll = new IScroll('#setup_virtual_main_scroll_div', {
                        preventDefault: false,
                        click: false,
                        tap: true,
                        scrollbars: true,
                        mouseWheel: true,
                        interactiveScrollbars: true,
                        shrinkScrollbars: 'scale',
                        fadeScrollbars: false,
                        useTransform: false
                    });
                    buildScrollSuccessFlg = true;
                }, 300)
            }
        }
        function destroyMyScroll() {
            if (myScroll != null) {
                myScroll.destroy();
                myScroll = null;
            }
        }

        function initClientStatus() {
            var req = getClient();
            inputObject[INPUT_IP].val(req.client_1_ipaddr);
            inputObject[INPUT_PORT].val(req.client_1_port);
            inputObject[INPUT_IP2].val(req.client_2_ipaddr);
            inputObject[INPUT_PORT2].val(req.client_2_port);
            inputObject[INPUT_IP3].val(req.client_3_ipaddr);
            inputObject[INPUT_PORT3].val(req.client_3_port);
            inputObject[INPUT_IP4].val(req.client_4_ipaddr);
            inputObject[INPUT_PORT4].val(req.client_4_port);
            if (req.client_1_transport == 1) {
                btnObject[BTN_CLENT_1].displayOn();
            } else {
                btnObject[BTN_CLENT_1].displayOff();
            }
            if (req.client_2_transport == 1) {
                btnObject[BTN_CLENT_2].displayOn();
            } else {
                btnObject[BTN_CLENT_2].displayOff();
            }
            if (req.client_3_transport == 1) {
                btnObject[BTN_CLENT_3].displayOn();
            } else {
                btnObject[BTN_CLENT_3].displayOff();
            }
            if (req.client_4_transport == 1) {
                btnObject[BTN_CLENT_4].displayOn();
            } else {
                btnObject[BTN_CLENT_4].displayOff();
            }

        }



        function checkPortValue(event) {
            var e = event.which ? event.which : window.event.keyCode;
            if (e < 48 || e > 57) {
                return false;
            }
        }

        function rebuild() {
            initClientStatus();
            destroyMyScroll();
            buildMyScroll();
        }

        function callbackClientSet(mouse, index) {
            if (mouse == Button.MOUSE_DOWN) {
                if (index == BTN_CLENT_1) {
                    if (btnObject[BTN_CLENT_1].getStatus() == Button.STATUS_ON) {
                        btnObject[BTN_CLENT_1].displayOff();
                    } else {
                        btnObject[BTN_CLENT_1].displayOn();
                    }

                } else if (index == BTN_CLENT_2) {
                    if (btnObject[BTN_CLENT_2].getStatus() == Button.STATUS_ON) {
                        btnObject[BTN_CLENT_2].displayOff();
                    } else {
                        btnObject[BTN_CLENT_2].displayOn();
                    }

                } else if (index == BTN_CLENT_3) {
                    if (btnObject[BTN_CLENT_3].getStatus() == Button.STATUS_ON) {
                        btnObject[BTN_CLENT_3].displayOff();
                    } else {
                        btnObject[BTN_CLENT_3].displayOn();
                    }

                } else {
                    if (btnObject[BTN_CLENT_4].getStatus() == Button.STATUS_ON) {
                        btnObject[BTN_CLENT_4].displayOff();
                    } else {
                        btnObject[BTN_CLENT_4].displayOn();
                    }
                }
            }
        }

        function checkClientValue() {
            if (!chknet_CheckUniAddr(inputObject[INPUT_IP].get(), "IPOUT")) {
                return capi_DispError(inputObject[INPUT_IP].getInputObject(), objErrCode);
            }
            if (!chknet_CheckUniAddr(inputObject[INPUT_IP2].get(), "IPOUT")) {
                return capi_DispError(inputObject[INPUT_IP2].getInputObject(), objErrCode);
            }
            if (!chknet_CheckUniAddr(inputObject[INPUT_IP3].get(), "IPOUT")) {
                return capi_DispError(inputObject[INPUT_IP3].getInputObject(), objErrCode);
            }
            if (!chknet_CheckUniAddr(inputObject[INPUT_IP4].get(), "IPOUT")) {
                return capi_DispError(inputObject[INPUT_IP4].getInputObject(), objErrCode);
            }

            if (!checkPort(inputObject[INPUT_PORT].get())) return capi_DispError(inputObject[INPUT_PORT].getInputObject(), objErrCode);
            if (!checkPort(inputObject[INPUT_PORT2].get())) return capi_DispError(inputObject[INPUT_PORT2].getInputObject(), objErrCode);
            if (!checkPort(inputObject[INPUT_PORT3].get())) return capi_DispError(inputObject[INPUT_PORT3].getInputObject(), objErrCode);
            if (!checkPort(inputObject[INPUT_PORT4].get())) return capi_DispError(inputObject[INPUT_PORT4].getInputObject(), objErrCode);

            var client1 = inputObject[INPUT_IP].get() + "." + inputObject[INPUT_PORT].get();
            var client2 = inputObject[INPUT_IP2].get() + "." + inputObject[INPUT_PORT2].get();
            var client3 = inputObject[INPUT_IP3].get() + "." + inputObject[INPUT_PORT3].get();
            var client4 = inputObject[INPUT_IP4].get() + "." + inputObject[INPUT_PORT4].get();
            var ary = [client1, client2, client3, client4];
            var s = ary.join(",") + ",";
            for (var i = 0; i < ary.length; i++) {

                if (s.replace(ary[i] + ",", "").indexOf(ary[i] + ",") > -1) {
                    jAlert(MSG_STATUS.mid_0088, NPTZ_WORDING.wID_0039);
                    return;
                }
            }
            return true;
        }

        /**
         *
         */
        function callbackSetButtion(mouse) {

            if (mouse == Button.MOUSE_DOWN) {
                if (checkClientValue()) {
                    ClientDoSubmit();
                }
            }
        }
        function getClientFormData() {
            var data = {};
            data['client_1_transport'] = btnObject[BTN_CLENT_1].getStatus() == Button.STATUS_ON ? 1 : 0;
            data['client_1_ipaddr'] = inputObject[INPUT_IP].get();
            data['client_1_port'] = inputObject[INPUT_PORT].get();
            data['client_2_transport'] = btnObject[BTN_CLENT_2].getStatus() == Button.STATUS_ON ? 1 : 0;
            data['client_2_ipaddr'] = inputObject[INPUT_IP2].get();
            data['client_2_port'] = inputObject[INPUT_PORT2].get();
            data['client_3_transport'] = btnObject[BTN_CLENT_3].getStatus() == Button.STATUS_ON ? 1 : 0;
            data['client_3_ipaddr'] = inputObject[INPUT_IP3].get();
            data['client_3_port'] = inputObject[INPUT_PORT3].get();
            data['client_4_transport'] = btnObject[BTN_CLENT_4].getStatus() == Button.STATUS_ON ? 1 : 0;
            data['client_4_ipaddr'] = inputObject[INPUT_IP4].get();
            data['client_4_port'] = inputObject[INPUT_PORT4].get();
            return data;
        }

        function ClientDoSubmit() {
            $("#dialog_setup").show();
            $.ajax({
                type: "post",
                url: "/cgi-bin/set_vstudio_client_info",
                data: getClientFormData(),
                success: function (data) {
                    setTimeout(function () {
                        $("#dialog_setup").hide();
                    }, 500);
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    setTimeout(function () {
                        $("#dialog_setup").hide();
                    }, 500);
                }
            });
        }

        function checkPort(sPort) {
            if (sPort.length == 0) {
                objErrCode = MSG_STATUS.mID_0002;
                return false;
            }
            if (!capi_isDigit(sPort)) {
                objErrCode = MSG_STATUS.mID_0010;

                return false;
            }
            var iWork = parseInt(sPort);
            if ((iWork < 1) || (65535 < iWork)) {
                objErrCode = MSG_STATUS.mID_0009;
                return false;
            }
            if (!chknet_portReservedNo(sPort, "IPOUT", 1)) {
                return false;
            }
            return true
        }

        /**
         *
         */
        function callbackAudioOverIPSetButton(mouse) {
            if (mouse == Button.MOUSE_DOWN) {
                if (mouse == Button.MOUSE_DOWN) {
                    $("#dialog_setup").show();
                    $.ajax({
                        type: "post",
                        url: "/cgi-bin/set_audio",
                        data: getAudioOverIPSettingData(),
                        success: function (data) {
                            setTimeout(function () {
                                $("#dialog_setup").hide();
                            }, 500);
                        },
                        error: function (jqXHR, textStatus, errorThrown) {
                            setTimeout(function () {
                                $("#dialog_setup").hide();
                            }, 500);
                        }
                    });
                }
            }
        }

        /**
         *
         */
        function getAudioOverIPSettingData() {
            var data = {};
            data['audio_transmit'] = audioTransmissionRadioButtonGroup.getSelectedValue();
            data['audio_bitrate'] = selectAudioBitRate.get();
            return data;
        }

        return {
            build: function (type) {
                return buildSettingSetClient();
            },
            destroyMyScroll: destroyMyScroll,
            buildMyScroll: buildMyScroll
        }
    }


    return {
        build: build,
        rebuild: rebuild,
        settingSetClient: settingSetClient
    };
}

/**
 * audio画面:audio制御に関わる画面クラス
 * @class audio画面:audio制御に関わる画面クラス
 * @return {{build: buildAudio, rebuild: rebuild}} build 構築�E琁E
 * @return {function} rebuild 再構築�E琁E
 * @constructor
 */
function audio() {
    /**
     * Audio 機能
     * @type settingAudio
     * */
    var settingAudio = settingAudio();
    /**
     * Audio Over IP 機能
     * @type settingAudio
     * */
    var settingAudioOverIP = settingAudioOverIP();
    /**
    * Audio St2110 機能
    * @type settingAudio
    * */
    var settingAudioSt2110 = settingAudioSt2110();
    /**
     * Audio main title
     */
    var txtAudioMainTitle;
    /**
     * 構築フラグ
     * @type boolean
     */
    var buildFlag_audio = false;
    /**
     * ボタンオブジェクチE
     * @type btnObject[]
     */
    var btnObject = [];
    var txtObject = [];
    /**
     * label定義
     * @type number
     */
    var TXT_VIDEOOVERIP = 0;
    /**
     * label定義
     * @type number
     */
    var TXT_AUDIO = 1;
    /**
     * btn_user_authボタンオブジェクチEインチE�E��E�クス値)
     *  @type object
     */
    var BTN_SETTING_STATUS_INDEX = 0;
    /**
     * btn_host_authボタンオブジェクチEインチE�E��E�クス値)
     *  @type object
     */
    var BTN_STREAMING_MODE_INDEX = 1;
    /**
     * btn_priority_streamボタンオブジェクチEインチE�E��E�クス値)
     *  @type object
     */
    var BTN_INITIAL_DISPLAY_SETTING_INDEX = 2;
    var BTN_INITIAL_DISPLAY_AUDIO_OVER_ST2110 = 3;

    var AUDIO_AUDIO_BIT_RATE = {
        "256kbps": "256",
        "128kbps": "128",
        "96kbps": "96",
        "64kbps": "64"
    };
    var currentAudioData;

    /**
     * Audio画面構築�E琁E
     */
    function buildAudio() {
        if (!buildFlag_audio) {
            buildFlag_audio = true;
            txtObject[TXT_VIDEOOVERIP] = TextCtrl('setup_audio_menu_title', 'setup_audio_menu_label', NPTZ_WORDING.wID_0252);

            btnObject[BTN_SETTING_STATUS_INDEX] = MenuButtonCtrl('setup_audio_menu', "setup_audio_settingStatus_btn", NPTZ_WORDING.wID_0077, callbackSettingAudio, 1, MenuButtonType.SINGLE);
            txtObject[TXT_AUDIO] = TextCtrl('setup_audio_menu', 'setup_audio_audio_menu_label', NPTZ_WORDING.wID_0252);
            btnObject[BTN_STREAMING_MODE_INDEX] = MenuButtonCtrl('setup_audio_menu', "setup_audio_audio_btn", NPTZ_WORDING.wID_0252, callbackSettingAudio, 2, MenuButtonType.TOP);
            btnObject[BTN_INITIAL_DISPLAY_SETTING_INDEX] = MenuButtonCtrl('setup_audio_menu', "setup_audio_audioOverIP_btn", NPTZ_WORDING.wID_0253, callbackSettingAudio, 3, MenuButtonType.MIDDLE);
            if (!isUE163) {
                btnObject[BTN_INITIAL_DISPLAY_AUDIO_OVER_ST2110] = MenuButtonCtrl('setup_audio_menu', "setup_audio_audioOverSt2110_btn", NPTZ_WORDING.wID_0652, callbackSettingAudio, 4, MenuButtonType.BOTTOM);
            }
            for (var i = 0; i < btnObject.length; i++) {
                if (i == BTN_INITIAL_DISPLAY_AUDIO_OVER_ST2110 && isUE163) {
                    continue;
                }
                btnObject[i].show();
                btnObject[i].displayOff();
            }
            // main title
            txtAudioMainTitle = TextCtrl('setup_audio_main_title', 'setup_audio_main_title_label', NPTZ_WORDING.wID_0077);
            txtAudioMainTitle.show();

            for (var i = 0; i < txtObject.length; i++) {
                txtObject[i].show();
            }
            $("#setup_audio_menu").show();
            btnObject[BTN_SETTING_STATUS_INDEX].displayOn();
            callbackSettingAudio(Button.MOUSE_DOWN, 1);

            SFPModeControlMenu();
        } else {
            rebuild();
        }
    }

    /**
     * 画面再構築�E琁E
     */
    function rebuild() {
        $("#setup_audio_menu").show();
        btnObject[BTN_SETTING_STATUS_INDEX].displayOn();
        callbackSettingAudio(Button.MOUSE_DOWN, 1);
        SFPModeControlMenu();
    }

    function SFPModeControlMenu() {
        if (isUE163) return;
        var is12GOutput = cparam_get_SFPMode();

        var objSt2110Info = getSt2110Info();
        var st2110Status = getSt2110InfoResult(objSt2110Info);
        var st2110EnableState = st2110Status["enable"] == "1" ? true : false;

        if (!st2110EnableState || is12GOutput == 0 || cparam_get_moip_active_status() == "NG") {
            btnObject[BTN_INITIAL_DISPLAY_AUDIO_OVER_ST2110].displayDisabled();
        } else {
            btnObject[BTN_INITIAL_DISPLAY_AUDIO_OVER_ST2110].displayOff();
        }
    }

    /**
     * SettingAudio吁E�E�Eタン押下時の画面表示刁E�E��E�処琁E
     */
    function callbackSettingAudio(mouse, type) {
        if (mouse == Button.MOUSE_DOWN) {
            $("#setup_audio_settingStatus_main").hide();
            $("#setup_audio_audio_main").hide();
            $("#setup_audio_audioOverIP_main").hide();
            $("#setup_audio_st2110_main").hide();
            switch (type) {
                case 1:
                    txtAudioMainTitle.set(NPTZ_WORDING.wID_0077);
                    settingAudio.build(1);
                    $("#setup_audio_settingStatus_main").show();
                    settingAudio.getAudioST2110SettingChValue();
                    break;
                case 2:
                    txtAudioMainTitle.set('Audio');
                    settingAudio.build(1);
                    Platform.setCurrentPage('audio.settingAudio');
                    $("#setup_audio_audio_main").show();
                    break;
                case 3:
                    txtAudioMainTitle.set('Audio over IP');
                    settingAudioOverIP.build(1);
                    $("#setup_audio_audioOverIP_main").show();
                    break;
                case 4:
                    txtAudioMainTitle.set('Audio over ST2110');
                    settingAudioSt2110.build(1);
                    $("#setup_audio_st2110_main").show();
                    break;
            }
        }
    }

    /**
     * settingAudio:settingAudio制御に関わる画面クラス
     * @class settingAudio画面:settingAudio制御に関わる画面クラス
     * @return {{build: buildAudio, rebuild: rebuild}} build 構築�E琁E
     * @return {function} rebuild 再構築�E琁E
     * @constructor
     */
    function settingAudio() {
        /**
         * 構築フラグ
         * @type boolean
         */
        var buildFlag_settingAudio = false;
        /**
         * label定義
         * @type number
         */
        var TXT_AUDIO_AUDIO_AUDIO = 0;
        var TXT_AUDIO_AUDIO_INPUT_SETTING1 = 1;
        var TXT_AUDIO_AUDIO_INPUT_SETTING1_INPUT_SELECT = 2;
        var TXT_AUDIO_AUDIO_INPUT_SETTING1_MIC_GAIN = 3;
        var TXT_AUDIO_AUDIO_INPUT_SETTING1_LINE_LEVEL = 4;
        var TXT_AUDIO_AUDIO_INPUT_SETTING2 = 5;
        var TXT_AUDIO_AUDIO_INPUT_SETTING2_INPUT_SELECT = 6;
        var TXT_AUDIO_AUDIO_INPUT_SETTING2_MIC_GAIN = 7;
        var TXT_AUDIO_AUDIO_INPUT_SETTING2_LINE_LEVEL = 8;
        var TXT_AUDIO_AUDIO_OUTPUT_SETTING = 9;
        var TXT_AUDIO_AUDIO_OUTPUT_SETTING_CH_SELECT = 10;
        var TXT_AUDIO_AUDIO_OUTPUT_SETTING_CH1_VOLUME_LEVEL = 11;
        var TXT_AUDIO_AUDIO_OUTPUT_SETTING_CH2_VOLUME_LEVEL = 12;
        var TXT_AUDIO_AUDIO_OUTPUT_SETTING_HEAD_ROOM = 13;
        var sliderAudioOutputCh1VolumeLevel;
        var txtAudioObject = [];

        var audioRadioButtonGroup;
        var inputSelectRadioButtonGroup1;
        var inputSelectRadioButtonGroup2;
        var micGainRadioButtonGroup1;
        var micGainRadioButtonGroup2;
        var lineLevelRadioButtonGroup1;
        var lineLevelRadioButtonGroup2;
        var outputSettingCHSelectRadioButtonGroup;
        var outputSettingHeadRoomRadioButtonGroup;

        var txtStatusObject = [];
        var myScroll;

        var AUDIO = 0;
        var INPUT1_INPUT_SELECT = 1;
        var AUDIO_TRANSMISSION = 2;
        var AUDIO_OVER_IP = 3;

        var AUDIO_VALUE = 4;
        var INPUT1_INPUT_SELECT_VALUE = 5;
        // var INPUT_VOLUME_LEVEL_VALUE = 6;
        // var PLUGIN_POWER_VALUE = 7;
        var AUDIO_TRANSMISSION_VALUE = 6;
        var AUDIO_OVER_IP_VALUE = 7;
        var AUDIO_TITLE = 8;
        var AUDIO_OVER_IP_TITLE = 9;
        var AUDIO_INPUT1_SETTING = 10;
        var AUDIO_INPUT2_SETTING = 11;
        var AUDIO_OUTPUT_SETTING = 12;
        var AUDIO_ST2110_SETTING = 13;
        var INPUT2_INPUT_SELECT_VALUE = 14;
        var INPUT2_INPUT_SELECT = 15;
        var INPUT1_MAC_GAIN = 16;
        var INPUT2_MAC_GAIN = 17;
        var INPUT1_LINE_LEVEL = 18;
        var INPUT2_LINE_LEVEL = 19;
        var INPUT1_MAC_GAIN_VALUE = 20;
        var INPUT2_MAC_GAIN_VALUE = 21;
        var INPUT1_LINE_LEVEL_VALUE = 22;
        var INPUT2_LINE_LEVEL_VALUE = 23;
        var AUDIO_ST2110_SETTING_TITLE_CH1 = 24;
        var AUDIO_ST2110_SETTING_TITLE_CH2 = 25;
        var AUDIO_ST2110_SETTING_CH1_VALUE = 26;
        var AUDIO_ST2110_SETTING_CH2_VALUE = 27;
        var AUDIO_OUTPUT_CH_SELECT = 28;
        var AUDIO_OUTPUT_CH1_VOLUME_LEVEL = 29;
        var AUDIO_OUTPUT_CH2_VOLUME_LEVEL = 30;
        var AUDIO_OUTPUT_HEAD_ROOM = 31;
        var AUDIO_OUTPUT_CH_SELECT_VALUE = 32;
        var AUDIO_OUTPUT_CH1_VOLUME_LEVEL_VALUE = 33;
        var AUDIO_OUTPUT_CH2_VOLUME_LEVEL_VALUE = 34;
        var AUDIO_OUTPUT_HEAD_ROOM_VALUE = 35;
        var currentData = null;
        var buildScrollSuccessFlg = true;

        function buildSettingAudio() {
            if (!buildFlag_settingAudio) {
                buildFlag_settingAudio = true;
                destroyMyScroll();
                //setting status
                var input1Select = getInput1Select();
                var input2Select = getInput2Select();
                var input1MacGain = cparam_get_input1_mac_gain();
                var input2MacGain = cparam_get_input2_mac_gain();
                var input1LineLevel = cparam_get_input1_line_level();
                var input2LineLevel = cparam_get_input2_line_level();
                var outputSelect = cparam_get_output_ch_select();
                var outputCh1VolumeLevel = cparam_get_output_ch1_volume_level();
                var outputCh2VolumeLevel = cparam_get_output_ch2_volume_level();
                var outputHeadRoom = cparam_get_output_head_room();
                var st2110Ch1 = cparams_get_moip_audio_fmt_tx();
                var st2110Ch2 = cparams_get_moip_audio_fmt_tx();
                var getAudio = getAudioAudioValue();
                var getInputType = getInputTypeValue();
                var getInputVolumeLevelValue = getAudioInputVolumeLevelValue();
                var gAudioPluginPowerValue = getAudioPluginPowerValue();
                currentData = getCurrentData();
                var audioValue = "";
                var input1SelectValue = "";
                var input2SelectValue = "";
                var input1MacGainValue = "";
                var input2MacGainValue = "";
                var input1LineLevelValue = "";
                var st2110_ch1_value = "";
                var st2110_ch2_value = "";
                var input2LineLevelValue = "";
                var outputSelectValue = "";
                var outputCh1VolumeLevelValue = "";
                var outputCh2VolumeLevelValue = "";
                var outputHeadRoomValue = "";
                var audioPluginPowerValue = "";
                var audioTransmissionValue = "";
                if (input1Select == 0) {
                    input1SelectValue = 'LINE'
                } else if (input1Select == 1) {
                    input1SelectValue = 'MIC'
                } else {
                    input1SelectValue = 'MIC+48V'
                }
                if (input2Select == 0) {
                    input2SelectValue = 'LINE'
                } else if (input2Select == 1) {
                    input2SelectValue = 'MIC'
                } else {
                    input2SelectValue = 'MIC+48V'
                }
                if (input1MacGain == 0) {
                    input1MacGainValue = "60dB"
                } else {
                    input1MacGainValue = "40dB"
                }
                if (input2MacGain == 0) {
                    input2MacGainValue = "60dB"
                } else {
                    input2MacGainValue = "40dB"
                }
                if (input1LineLevel == 0) {
                    input1LineLevelValue = "+4dB";
                } else if (input1LineLevel == 1) {
                    input1LineLevelValue = "0dB";
                } else {
                    input1LineLevelValue = "-20dB";
                }
                if (input2LineLevel == 0) {
                    input2LineLevelValue = "+4dB";
                } else if (input2LineLevel == 1) {
                    input2LineLevelValue = "0dB";
                } else {
                    input2LineLevelValue = "-20dB";
                }
                st2110_ch1_value = st2110Ch1.ch1;
                st2110_ch2_value = st2110Ch2.ch2;
                if (getAudio == 1) {
                    audioValue = 'On';
                } else {
                    audioValue = 'Off';
                }
                if (getInputType == 0) {
                    inputTypevalue = 'Mic';
                } else {
                    inputTypevalue = 'Line';
                }
                if (gAudioPluginPowerValue == 1) {
                    audioPluginPowerValue = "On";
                } else {
                    audioPluginPowerValue = "Off";
                }
                if (cparams["audio_transmit"] == 1) {
                    audioTransmissionValue = "On";
                } else {
                    audioTransmissionValue = "Off";
                }
                if (outputSelect == 0) {
                    outputSelectValue = "INPUT1/INPUT2";
                } else if (outputSelect == 1) {
                    outputSelectValue = "INPUT1";
                } else {
                    outputSelectValue = "INPUT2";
                }
                outputCh1VolumeLevelValue = outputCh1VolumeLevel + "dB";
                outputCh2VolumeLevelValue = outputCh2VolumeLevel + "dB";
                if (outputHeadRoom == 0) {
                    outputHeadRoomValue = "FS-12dB";
                } else if (outputHeadRoom == 1) {
                    outputHeadRoomValue = "FS-18dB";
                } else {
                    outputHeadRoomValue = "FS-20dB";
                }
                var objSt2110Info = getSt2110Info();
                var st2110Status = getSt2110InfoResult(objSt2110Info);
                var st2110EnableState = st2110Status["enable"] == "1" ? true : false;
                //title
                txtStatusObject[AUDIO_TITLE] = TextCtrl("setup_audio_settingStatus_label", 'setup_audio_settingStatus_audio_title', NPTZ_WORDING.wID_0252);
                txtStatusObject[AUDIO_INPUT1_SETTING] = TextCtrl("setup_audio_settingStatus_label", 'setup_audio_settingStatus_input1_setting_title', NPTZ_WORDING.wID_0653);
                txtStatusObject[AUDIO_INPUT2_SETTING] = TextCtrl("setup_audio_settingStatus_label", 'setup_audio_settingStatus_input2_setting_title', NPTZ_WORDING.wID_0654);
                txtStatusObject[AUDIO_OUTPUT_SETTING] = TextCtrl("setup_audio_settingStatus_label", 'setup_audio_settingStatus_output_setting_title', NPTZ_WORDING.wID_0655);
                txtStatusObject[AUDIO_OUTPUT_CH_SELECT] = TextCtrl("setup_audio_settingStatus_label", 'setup_audio_settingStatus_output_ch_select', NPTZ_WORDING.wID_0660);
                txtStatusObject[AUDIO_OUTPUT_CH1_VOLUME_LEVEL] = TextCtrl("setup_audio_settingStatus_label", 'setup_audio_settingstatus_output_ch1_volume_level', NPTZ_WORDING.wID_0661);
                txtStatusObject[AUDIO_OUTPUT_CH2_VOLUME_LEVEL] = TextCtrl("setup_audio_settingStatus_label", 'setup_audio_settingstatus_output_ch2_volume_level', NPTZ_WORDING.wID_0662);
                txtStatusObject[AUDIO_OUTPUT_HEAD_ROOM] = TextCtrl("setup_audio_settingStatus_label", 'setup_audio_settingStatus_output_head_room', NPTZ_WORDING.wID_0663);
                txtStatusObject[AUDIO_OVER_IP_TITLE] = TextCtrl("setup_audio_settingStatus_label", 'setup_audio_settingStatus_audio_over_ip_title', NPTZ_WORDING.wID_0253);
                if (!isUE163 && st2110EnableState) {
                    txtStatusObject[AUDIO_ST2110_SETTING] = TextCtrl("setup_audio_settingStatus_label", 'setup_audio_settingStatus_audio_st2110_title', NPTZ_WORDING.wID_0652);
                    txtStatusObject[AUDIO_ST2110_SETTING_TITLE_CH1] = TextCtrl("setup_audio_settingStatus_label", 'setup_audio_settingStatus_audio_st2110_ch1_title', NPTZ_WORDING.wID_0694);
                    txtStatusObject[AUDIO_ST2110_SETTING_TITLE_CH2] = TextCtrl("setup_audio_settingStatus_label", 'setup_audio_settingStatus_audio_st2110_ch2_title', NPTZ_WORDING.wID_0695);
                }
                txtStatusObject[AUDIO] = TextCtrl("setup_audio_settingStatus_label", 'setup_audio_settingStatus_audio', NPTZ_WORDING.wID_0252);
                txtStatusObject[INPUT1_INPUT_SELECT] = TextCtrl("setup_audio_settingStatus_label", 'setup_audio_settingStatus_input1_input_select', NPTZ_WORDING.wID_0254);
                txtStatusObject[INPUT2_INPUT_SELECT] = TextCtrl("setup_audio_settingStatus_label", 'setup_audio_settingStatus_input2_input_select', NPTZ_WORDING.wID_0254);
                txtStatusObject[INPUT2_MAC_GAIN] = TextCtrl("setup_audio_settingStatus_label", 'setup_audio_settingStatus_input2_mac_gain', NPTZ_WORDING.wID_0656);
                txtStatusObject[INPUT1_MAC_GAIN] = TextCtrl("setup_audio_settingStatus_label", 'setup_audio_settingStatus_input1_mac_gain', NPTZ_WORDING.wID_0656);
                txtStatusObject[INPUT2_LINE_LEVEL] = TextCtrl("setup_audio_settingStatus_label", 'setup_audio_settingStatus_input2_line_level', NPTZ_WORDING.wID_0657);
                txtStatusObject[INPUT1_LINE_LEVEL] = TextCtrl("setup_audio_settingStatus_label", 'setup_audio_settingStatus_input1_line_level', NPTZ_WORDING.wID_0657);

                txtStatusObject[AUDIO_TRANSMISSION] = TextCtrl("setup_audio_settingStatus_label", 'setup_audio_settingStatus_audio_transmission', NPTZ_WORDING.wID_0257);
                txtStatusObject[AUDIO_OVER_IP] = TextCtrl("setup_audio_settingStatus_label", 'setup_audio_settingStatus_audio_over_op', NPTZ_WORDING.wID_0258);

                txtStatusObject[AUDIO_VALUE] = TextCtrl("setup_audio_settingStatus_label", 'setup_audio_settingStatus_audio_value', audioValue);
                txtStatusObject[INPUT1_INPUT_SELECT_VALUE] = TextCtrl("setup_audio_settingStatus_label", 'setup_audio_settingStatus_input1_input_select_value', input1SelectValue);
                txtStatusObject[INPUT2_INPUT_SELECT_VALUE] = TextCtrl("setup_audio_settingStatus_label", 'setup_audio_settingStatus_input2_input_select_value', input2SelectValue);
                txtStatusObject[INPUT1_MAC_GAIN_VALUE] = TextCtrl("setup_audio_settingStatus_label", 'setup_audio_settingStatus_input1_mac_gain_value', input1MacGainValue);
                txtStatusObject[INPUT2_MAC_GAIN_VALUE] = TextCtrl("setup_audio_settingStatus_label", 'setup_audio_settingStatus_input2_mac_gain_value', input2MacGainValue);
                txtStatusObject[INPUT1_LINE_LEVEL_VALUE] = TextCtrl("setup_audio_settingStatus_label", 'setup_audio_settingStatus_input1_line_level_value', input1LineLevelValue);
                txtStatusObject[INPUT2_LINE_LEVEL_VALUE] = TextCtrl("setup_audio_settingStatus_label", 'setup_audio_settingStatus_input2_line_level_value', input2LineLevelValue);
                txtStatusObject[AUDIO_OUTPUT_CH_SELECT_VALUE] = TextCtrl("setup_audio_settingStatus_label", 'setup_audio_settingStatus_output_ch_select_value', outputSelectValue);
                txtStatusObject[AUDIO_OUTPUT_CH1_VOLUME_LEVEL_VALUE] = TextCtrl("setup_audio_settingStatus_label", 'setup_audio_settingStatus_output_ch1_volume_level_value', outputCh1VolumeLevelValue);
                txtStatusObject[AUDIO_OUTPUT_CH2_VOLUME_LEVEL_VALUE] = TextCtrl("setup_audio_settingStatus_label", 'setup_audio_settingStatus_output_ch2_volume_level_value', outputCh2VolumeLevelValue);
                txtStatusObject[AUDIO_OUTPUT_HEAD_ROOM_VALUE] = TextCtrl("setup_audio_settingStatus_label", 'setup_audio_settingStatus_output_head_room_value', outputHeadRoomValue);
                txtStatusObject[INPUT2_LINE_LEVEL_VALUE] = TextCtrl("setup_audio_settingStatus_label", 'setup_audio_settingStatus_input2_line_level_value', input2LineLevelValue);
                txtStatusObject[INPUT2_LINE_LEVEL_VALUE] = TextCtrl("setup_audio_settingStatus_label", 'setup_audio_settingStatus_input2_line_level_value', input2LineLevelValue);
                txtStatusObject[INPUT2_LINE_LEVEL_VALUE] = TextCtrl("setup_audio_settingStatus_label", 'setup_audio_settingStatus_input2_line_level_value', input2LineLevelValue);
                if (!isUE163 && st2110EnableState) {
                    txtStatusObject[AUDIO_ST2110_SETTING_CH1_VALUE] = TextCtrl("setup_audio_settingStatus_label", 'setup_audio_settingStatus_st2110_ch1_value', st2110_ch1_value);
                    txtStatusObject[AUDIO_ST2110_SETTING_CH2_VALUE] = TextCtrl("setup_audio_settingStatus_label", 'setup_audio_settingStatus_st2110_ch2_value', st2110_ch2_value);
                }
                txtStatusObject[AUDIO_TRANSMISSION_VALUE] = TextCtrl("setup_audio_settingStatus_label", 'setup_audio_settingStatus_audio_transmission_value');
                txtStatusObject[AUDIO_OVER_IP_VALUE] = TextCtrl("setup_audio_settingStatus_label", 'setup_audio_settingStatus_audio_over_op_value');
                txtStatusObject[AUDIO_TRANSMISSION_VALUE].set(audioTransmissionValue);
                txtStatusObject[AUDIO_OVER_IP_VALUE].set(cparams["new_bit"] + "kbps");
                txtStatusObject[INPUT1_INPUT_SELECT_VALUE].set(input1SelectValue);
                txtStatusObject[INPUT2_INPUT_SELECT_VALUE].set(input2SelectValue);
                // Audio
                txtAudioObject[TXT_AUDIO_AUDIO_AUDIO] = TextCtrl('setup_audio_audio_label', 'setup_audio_audio_audio_label', NPTZ_WORDING.wID_0252);
                // Audio radioButtonItems
                audioRadioButtonGroup = RadioButtonGroupCtrl("setup_audio_audio_form", "setup_audio_audio_audio_", RADIO_GROUP.rID_0001, getAudio, callbackAudioAudio);
                LineCtrl('setup_audio_audio_main', 'horizontal', 73, 0, 1320, "setup_audio_audio_audio_label", "98");

                // input setting1
                txtAudioObject[TXT_AUDIO_AUDIO_INPUT_SETTING1] = TextCtrl('setup_audio_audio_label', 'setup_audio_audio_input_setting1_label', NPTZ_WORDING.wID_0665);
                inputSelectRadioButtonGroup1 = RadioButtonGroupCtrl("setup_audio_audio_form", "setup_audio_audio_input_setting1_input_select_", RADIO_GROUP.rID_0028, '0', callbackAudioInput1Select);
                LineCtrl('setup_audio_audio_main', 'horizontal', 141, 0, 1320, "setup_audio_audio_input_setting1_label", "98");

                // Input select               
                txtAudioObject[TXT_AUDIO_AUDIO_INPUT_SETTING1_INPUT_SELECT] = TextCtrl('setup_audio_audio_label', 'setup_audio_audio_input_setting1_input_select', NPTZ_WORDING.wID_0254);
                LineCtrl('setup_audio_audio_main', 'horizontal', 209, 0, 1320, "setup_audio_audio_input_setting1_input_select", "98");

                // mic gain
                txtAudioObject[TXT_AUDIO_AUDIO_INPUT_SETTING1_MIC_GAIN] = TextCtrl('setup_audio_audio_label', 'setup_audio_audio_input_setting1_mic_gain_label', NPTZ_WORDING.wID_0666);
                // mic gain radioButtonItems
                micGainRadioButtonGroup1 = RadioButtonGroupCtrl("setup_audio_audio_form", "setup_audio_audio_input_setting1_mic_gain_", RADIO_GROUP.rID_0080, parseInt(gAudioPluginPowerValue), callbackInput1MacGain);
                LineCtrl('setup_audio_audio_main', 'horizontal', 277, 0, 1320, "setup_audio_audio_input_setting1_mic_gain_label", "98");

                txtAudioObject[TXT_AUDIO_AUDIO_INPUT_SETTING1_LINE_LEVEL] = TextCtrl('setup_audio_audio_label', 'setup_audio_audio_input_setting1_line_level_label', NPTZ_WORDING.wID_0667);
                lineLevelRadioButtonGroup1 = RadioButtonGroupCtrl("setup_audio_audio_form", "setup_audio_audio_input_setting1_line_level_", RADIO_GROUP.rID_0081, parseInt(gAudioPluginPowerValue), callbackInput1LineLevel);
                LineCtrl('setup_audio_audio_main', 'horizontal', 277, 0, 1320, "setup_audio_audio_input_setting1_line_level_label", "98");

                // input setting2
                txtAudioObject[TXT_AUDIO_AUDIO_INPUT_SETTING2] = TextCtrl('setup_audio_audio_label', 'setup_audio_audio_input_setting2_label', NPTZ_WORDING.wID_0669);
                inputSelectRadioButtonGroup2 = RadioButtonGroupCtrl("setup_audio_audio_form", "setup_audio_audio_input_setting2_input_select_", RADIO_GROUP.rID_0028, getInputType, callbackAudioInput2Select);
                LineCtrl('setup_audio_audio_main', 'horizontal', 141, 0, 1320, "setup_audio_audio_input_setting2_label", "98");

                // Input select               
                txtAudioObject[TXT_AUDIO_AUDIO_INPUT_SETTING2_INPUT_SELECT] = TextCtrl('setup_audio_audio_label', 'setup_audio_audio_input_setting2_input_select', NPTZ_WORDING.wID_0254);
                LineCtrl('setup_audio_audio_main', 'horizontal', 209, 0, 1320, "setup_audio_audio_input_setting2_input_select", "98");

                // mic gain
                txtAudioObject[TXT_AUDIO_AUDIO_INPUT_SETTING2_MIC_GAIN] = TextCtrl('setup_audio_audio_label', 'setup_audio_audio_input_setting2_mic_gain_label', NPTZ_WORDING.wID_0666);
                // mic gain radioButtonItems
                micGainRadioButtonGroup2 = RadioButtonGroupCtrl("setup_audio_audio_form", "setup_audio_audio_input_setting2_mic_gain_", RADIO_GROUP.rID_0080, parseInt(gAudioPluginPowerValue), callbackInput2MacGain);
                LineCtrl('setup_audio_audio_main', 'horizontal', 277, 0, 1320, "setup_audio_audio_input_setting2_mic_gain_label", "98");

                txtAudioObject[TXT_AUDIO_AUDIO_INPUT_SETTING2_LINE_LEVEL] = TextCtrl('setup_audio_audio_label', 'setup_audio_audio_input_setting2_line_level_label', NPTZ_WORDING.wID_0667);
                lineLevelRadioButtonGroup2 = RadioButtonGroupCtrl("setup_audio_audio_form", "setup_audio_audio_input_setting2_line_level_", RADIO_GROUP.rID_0081, parseInt(gAudioPluginPowerValue), callbackInput2LineLevel);
                LineCtrl('setup_audio_audio_main', 'horizontal', 345, 0, 1320, "setup_audio_audio_input_setting2_line_level_label", "98");

                // output setting
                txtAudioObject[TXT_AUDIO_AUDIO_OUTPUT_SETTING] = TextCtrl('setup_audio_audio_label', 'setup_audio_audio_output_setting_label', NPTZ_WORDING.wID_0655);
                txtAudioObject[TXT_AUDIO_AUDIO_OUTPUT_SETTING_CH_SELECT] = TextCtrl('setup_audio_audio_label', 'setup_audio_audio_output_setting_ch_select_label', NPTZ_WORDING.wID_0660);
                outputSettingCHSelectRadioButtonGroup = RadioButtonGroupCtrl("setup_audio_audio_form", "setup_audio_audio_output_setting_ch_select_", RADIO_GROUP.rID_0082, getInputType, callbackCHSelect);
                LineCtrl('setup_audio_audio_main', 'horizontal', 413, 0, 1320, "setup_audio_audio_output_setting_label", "98");
                txtAudioObject[TXT_AUDIO_AUDIO_OUTPUT_SETTING_CH1_VOLUME_LEVEL] = TextCtrl('setup_audio_audio_label', 'setup_audio_audio_output_setting_ch1_volume_level_label', NPTZ_WORDING.wID_0661);
                sliderAudioOutputCh1VolumeLevel = SliderCtrl('setup_audio_audio_form', 'setup_audio_audio_output_setting_ch1_volume_level_slider', 20, -40, getCh1VolumeLevel(), callbackCh1VolumeLevel, 'dB');
                LineCtrl('setup_audio_audio_main', 'horizontal', 481, 0, 1320, "setup_audio_audio_output_setting_ch1_volume_level_label", "98");
                txtAudioObject[TXT_AUDIO_AUDIO_OUTPUT_SETTING_CH2_VOLUME_LEVEL] = TextCtrl('setup_audio_audio_label', 'setup_audio_audio_output_setting_ch2_volume_level_label', NPTZ_WORDING.wID_0662);
                sliderAudioOutputCh2VolumeLevel = SliderCtrl('setup_audio_audio_form', 'setup_audio_audio_output_setting_ch2_volume_level_slider', 20, -40, getCh2VolumeLevel(), callbackCh2VolumeLevel, 'dB');
                LineCtrl('setup_audio_audio_main', 'horizontal', 549, 0, 1320, "setup_audio_audio_output_setting_ch2_volume_level_label", "98");
                txtAudioObject[TXT_AUDIO_AUDIO_OUTPUT_SETTING_HEAD_ROOM] = TextCtrl('setup_audio_audio_label', 'setup_audio_audio_output_setting_head_room_label', NPTZ_WORDING.wID_0663);
                outputSettingHeadRoomRadioButtonGroup = RadioButtonGroupCtrl("setup_audio_audio_form", "setup_audio_audio_output_setting_head_room_", RADIO_GROUP.rID_0083, getInputType, callbackHeadRoom);
                LineCtrl('setup_audio_audio_main', 'horizontal', 617, 0, 1320, "setup_audio_audio_output_setting_head_room_label", "98");

                LineCtrl('setup_audio_audio_main', 'horizontal', 617, 0, 1320, "setup_audio_audio_output_setting_end", "98");
                $('#setup_audio_audio_main').append($('<div class="systemDivInnerLine2_ver_audio_input_setting vertical_line_common"></div>'));
                $('#setup_audio_audio_main').append($('<div class="systemDivInnerLine2_ver_audio_input_setting2 vertical_line_common"></div>'));
                $('#setup_audio_audio_main').append($('<div class="systemDivInnerLine2_ver_audio_putput_setting vertical_line_common"></div>'));

                for (var text in txtAudioObject) {
                    txtAudioObject[text].show();
                }
                for (var text in txtStatusObject) {
                    txtStatusObject[text].show();
                }

                initAudioData();
                buildMyScroll();
            } else {
                rebuild();
            }
        }
        function buildMyScroll() {
            if (buildScrollSuccessFlg) {
                buildScrollSuccessFlg = false;
                setTimeout(function () {
                    myScroll = new IScroll('#setup_audio_audio_main_scroll', {
                        preventDefault: false,
                        click: false,
                        tap: true,
                        scrollbars: true,
                        mouseWheel: true,
                        interactiveScrollbars: true,
                        shrinkScrollbars: 'scale',
                        fadeScrollbars: false,
                        useTransform: false
                    });
                    buildScrollSuccessFlg = true;
                }, 300)
            }
        }

        function destroyMyScroll() {
            if (myScroll != null) {
                myScroll.destroy();
                myScroll = null;
            }
        }

        function getCh1VolumeLevel() {
            return cparam_get_output_ch1_volume_level();
        }

        function callbackCh1VolumeLevel() {
            let sliderValue = Number(sliderAudioOutputCh1VolumeLevel.getValue());
            cparam_set_output_ch1_volume_level(sliderValue);
        }

        function getCh2VolumeLevel() {
            return cparam_get_output_ch2_volume_level();
        }

        function callbackCh2VolumeLevel() {
            let sliderValue = Number(sliderAudioOutputCh2VolumeLevel.getValue());
            cparam_set_output_ch2_volume_level(sliderValue);
        }
        /**
         * get Camera Audio Data
         * @returns {{}}
         */
        function getCurrentData() {
            let currentData = {};
            cparam_updateAudio();
            currentData.Audio = cparams["audio"];
            currentData.InVol = cparams["audio_volume"];
            currentData.Audio_sens = cparams["audio_sens"];
            currentData.PluginPower = cparams["pluginpower"];
            currentData.Transmit = cparams["audio_transmit"];
            currentData.AudioBit = cparams["new_bit"];
            currentData.Equal = cparams["new_equal"];
            currentData.ALC = cparams["new_alc"];
            return currentData;
        }

        function rebuild() {
            var input1Select = getInput1Select();
            var input2Select = getInput2Select();
            var input1MacGain = cparam_get_input1_mac_gain();
            var input2MacGain = cparam_get_input2_mac_gain();
            var input1LineLevel = cparam_get_input1_line_level();
            var input2LineLevel = cparam_get_input2_line_level();
            var outputCh1VolumeLevel = cparam_get_output_ch1_volume_level();
            var outputCh2VolumeLevel = cparam_get_output_ch2_volume_level();
            let getAudio = getAudioAudioValue();
            let getInputType = getInputTypeValue();
            let getInputVolumeLevelValue = getAudioInputVolumeLevelValue();
            let gAudioPluginPowerValue = getAudioPluginPowerValue();
            currentData = getCurrentData();
            var input1SelectValue = "";
            var input2SelectValue = "";
            var input1MacGainValue = "";
            var input2MacGainValue = "";
            var outputCh1VolumeLevelValue = "";
            var outputCh2VolumeLevelValue = "";
            var input1LineLevelValue = "";
            var input2LineLevelValue = "";
            let audioValue = "";
            let inputTypevalue = "";
            let audioPluginPowerValue = "";
            let audioTransmissionValue = "";
            if (input1Select == 0) {
                input1SelectValue = 'LINE'
            } else if (input1Select == 1) {
                input1SelectValue = 'MIC'
            } else {
                input1SelectValue = 'MIC+48V'
            }
            if (input2Select == 0) {
                input2SelectValue = 'LINE'
            } else if (input2Select == 1) {
                input2SelectValue = 'MIC'
            } else {
                input2SelectValue = 'MIC+48V'
            }
            if (input1MacGain == 0) {
                input1MacGainValue = "60dB"
            } else {
                input1MacGainValue = "40dB"
            }
            if (input2MacGain == 0) {
                input2MacGainValue = "60dB"
            } else {
                input2MacGainValue = "40dB"
            }
            if (input1LineLevel == 0) {
                input1LineLevelValue = "+4dB";
            } else if (input1LineLevel == 1) {
                input1LineLevelValue = "0dB";
            } else {
                input1LineLevelValue = "-20dB";
            }
            if (input2LineLevel == 0) {
                input2LineLevelValue = "+4dB";
            } else if (input2LineLevel == 1) {
                input2LineLevelValue = "0dB";
            } else {
                input2LineLevelValue = "-20dB";
            }
            if (getAudio == 1) {
                audioValue = 'On';
            } else {
                audioValue = 'Off';
            }
            if (getInputType == 0) {
                inputTypevalue = 'Mic';
            } else {
                inputTypevalue = 'Line';
            }
            if (gAudioPluginPowerValue == 1) {
                audioPluginPowerValue = "On";
            } else {
                audioPluginPowerValue = "Off";
            }
            if (cparams["audio_transmit"] == 1) {
                audioTransmissionValue = "On";
            } else {
                audioTransmissionValue = "Off";
            }
            outputCh1VolumeLevelValue = outputCh1VolumeLevel + "dB";
            outputCh2VolumeLevelValue = outputCh2VolumeLevel + "dB";

            txtStatusObject[AUDIO_VALUE].set(audioValue);
            txtStatusObject[INPUT1_INPUT_SELECT_VALUE].set(input1SelectValue);
            txtStatusObject[INPUT2_INPUT_SELECT_VALUE].set(input2SelectValue);
            txtStatusObject[INPUT1_MAC_GAIN_VALUE].set(input1MacGainValue);
            txtStatusObject[INPUT2_MAC_GAIN_VALUE].set(input2MacGainValue);
            txtStatusObject[INPUT1_LINE_LEVEL_VALUE].set(input1LineLevelValue);
            txtStatusObject[INPUT2_LINE_LEVEL_VALUE].set(input2LineLevelValue);
            txtStatusObject[AUDIO_OUTPUT_CH1_VOLUME_LEVEL_VALUE].set(outputCh1VolumeLevelValue);
            txtStatusObject[AUDIO_OUTPUT_CH2_VOLUME_LEVEL_VALUE].set(outputCh2VolumeLevelValue);
            // txtStatusObject[INPUT_VOLUME_LEVEL_VALUE].set(sliderAudioInputVolumeLevel.getSliderValueValue());
            // txtStatusObject[PLUGIN_POWER_VALUE].set(audioPluginPowerValue);
            txtStatusObject[AUDIO_TRANSMISSION_VALUE].set(audioTransmissionValue);
            txtStatusObject[AUDIO_OVER_IP_VALUE].set(cparams["new_bit"] + "kbps");

            inputSelectRadioButtonGroup1.setSelectedValue(getInputTypeValue());
            // sliderAudioInputVolumeLevel.setValue(getAudioInputVolumeLevelValue());
            // pluginPowerRadioButtonGroup.setSelectedValue(getAudioPluginPowerValue());
            // changeInputVolumePluginPowerStatus();
            var objSt2110Info = getSt2110Info();
            var st2110Status = getSt2110InfoResult(objSt2110Info);
            var st2110EnableState = st2110Status["enable"] == "1" ? true : false;
            var st2110Ch1 = cparams_get_moip_audio_fmt_tx();
            var st2110Ch2 = cparams_get_moip_audio_fmt_tx();
            var st2110_ch1_value = "";
            var st2110_ch2_value = "";
            st2110_ch1_value = st2110Ch1.ch1;
            st2110_ch2_value = st2110Ch2.ch2;
            if (st2110EnableState) {
                if (!txtStatusObject[AUDIO_ST2110_SETTING]) {
                    txtStatusObject[AUDIO_ST2110_SETTING] = TextCtrl("setup_audio_settingStatus_label", 'setup_audio_settingStatus_audio_st2110_title', NPTZ_WORDING.wID_0652);
                }
                if (!txtStatusObject[AUDIO_ST2110_SETTING_TITLE_CH1]) {
                    txtStatusObject[AUDIO_ST2110_SETTING_TITLE_CH1] = TextCtrl("setup_audio_settingStatus_label", 'setup_audio_settingStatus_audio_st2110_ch1_title', NPTZ_WORDING.wID_0694);
                }
                if (!txtStatusObject[AUDIO_ST2110_SETTING_TITLE_CH2]) {
                    txtStatusObject[AUDIO_ST2110_SETTING_TITLE_CH2] = TextCtrl("setup_audio_settingStatus_label", 'setup_audio_settingStatus_audio_st2110_ch2_title', NPTZ_WORDING.wID_0695);
                }
                if (!txtStatusObject[AUDIO_ST2110_SETTING_CH1_VALUE]) {
                    txtStatusObject[AUDIO_ST2110_SETTING_CH1_VALUE] = TextCtrl("setup_audio_settingStatus_label", 'setup_audio_settingStatus_st2110_ch1_value', st2110_ch1_value);
                }
                if (!txtStatusObject[AUDIO_ST2110_SETTING_CH2_VALUE]) {
                    txtStatusObject[AUDIO_ST2110_SETTING_CH2_VALUE] = TextCtrl("setup_audio_settingStatus_label", 'setup_audio_settingStatus_st2110_ch2_value', st2110_ch2_value);
                }
                txtStatusObject[AUDIO_ST2110_SETTING] && txtStatusObject[AUDIO_ST2110_SETTING].show();
                txtStatusObject[AUDIO_ST2110_SETTING_TITLE_CH1] && txtStatusObject[AUDIO_ST2110_SETTING_TITLE_CH1].show();
                txtStatusObject[AUDIO_ST2110_SETTING_TITLE_CH2] && txtStatusObject[AUDIO_ST2110_SETTING_TITLE_CH2].show();
                txtStatusObject[AUDIO_ST2110_SETTING_CH1_VALUE] && txtStatusObject[AUDIO_ST2110_SETTING_CH1_VALUE].show();
                txtStatusObject[AUDIO_ST2110_SETTING_CH2_VALUE] && txtStatusObject[AUDIO_ST2110_SETTING_CH2_VALUE].show();
            } else {
                txtStatusObject[AUDIO_ST2110_SETTING] && txtStatusObject[AUDIO_ST2110_SETTING].hide();
                txtStatusObject[AUDIO_ST2110_SETTING_TITLE_CH1] && txtStatusObject[AUDIO_ST2110_SETTING_TITLE_CH1].hide();
                txtStatusObject[AUDIO_ST2110_SETTING_TITLE_CH2] && txtStatusObject[AUDIO_ST2110_SETTING_TITLE_CH2].hide();
                txtStatusObject[AUDIO_ST2110_SETTING_CH1_VALUE] && txtStatusObject[AUDIO_ST2110_SETTING_CH1_VALUE].hide();
                txtStatusObject[AUDIO_ST2110_SETTING_CH2_VALUE] && txtStatusObject[AUDIO_ST2110_SETTING_CH2_VALUE].hide();

            }
            initAudioData();
            destroyMyScroll();
            buildMyScroll();
        }

        function initAudioData() {
            audioRadioButtonGroup.setSelectedValue(getAudioAudioValue());
            //Input1
            inputSelectRadioButtonGroup1.setSelectedValue(getInput1Select());
            micGainRadioButtonGroup1.setSelectedValue(cparam_get_input1_mac_gain());
            lineLevelRadioButtonGroup1.setSelectedValue(cparam_get_input1_line_level());
            //Input2
            inputSelectRadioButtonGroup2.setSelectedValue(getInput2Select());
            micGainRadioButtonGroup2.setSelectedValue(cparam_get_input2_mac_gain());
            lineLevelRadioButtonGroup2.setSelectedValue(cparam_get_input2_line_level());
            //Output
            outputSettingCHSelectRadioButtonGroup.setSelectedValue(cparam_get_output_ch_select());
            sliderAudioOutputCh1VolumeLevel.setValue(cparam_get_output_ch1_volume_level());
            sliderAudioOutputCh2VolumeLevel.setValue(cparam_get_output_ch2_volume_level());
            outputSettingHeadRoomRadioButtonGroup.setSelectedValue(cparam_get_output_head_room());

            if (getInput1Select() == 0) {
                micGainRadioButtonGroup1.setDisable("0,1");
                lineLevelRadioButtonGroup1.setEnable("0,1");
            } else {
                micGainRadioButtonGroup1.setEnable("0,1");
                lineLevelRadioButtonGroup1.setDisable("0,1");
            }

            if (getInput2Select() == 0) {
                micGainRadioButtonGroup2.setDisable("0,1");
                lineLevelRadioButtonGroup2.setEnable("0,1");
            } else {
                micGainRadioButtonGroup2.setEnable("0,1");
                lineLevelRadioButtonGroup2.setDisable("0,1");
            }
        }

        /**
         *
         */
        function getAudioAudioValue() {
            return cparam_get_audio();
        }

        function getInput1Select() {
            return cparam_get_input1_select()
        }

        function getInput2Select() {
            return cparam_get_input2_select()
        }
        /**
         *
         */
        function callbackAudioAudio() {
            //changeInputVolumePluginPowerStatus();
            cparam_set_audio(audioRadioButtonGroup.getSelectedValue());
        }

        /**
         *
         */
        function getInputTypeValue() {
            return cparam_get_inputType();
        }

        /**
         * Input Setting1
         */
        function callbackAudioInput1Select() {
            //changeInputVolumePluginPowerStatus();
            cparam_set_input1_select(inputSelectRadioButtonGroup1.getSelectedValue());

            if (inputSelectRadioButtonGroup1.getSelectedValue() == 0) {
                micGainRadioButtonGroup1.setDisable("0,1");
                lineLevelRadioButtonGroup1.setEnable("0,1");
            } else {
                micGainRadioButtonGroup1.setEnable("0,1");
                lineLevelRadioButtonGroup1.setDisable("0,1");
            }
        }

        function callbackInput1MacGain() {
            cparam_set_input1_mac_gain(micGainRadioButtonGroup1.getSelectedValue());
        }

        function callbackInput1LineLevel() {
            cparam_set_input1_line_level(lineLevelRadioButtonGroup1.getSelectedValue());
        }

        //Input Setting2
        function callbackAudioInput2Select() {
            //changeInputVolumePluginPowerStatus();
            cparam_set_input2_select(inputSelectRadioButtonGroup2.getSelectedValue());

            if (inputSelectRadioButtonGroup2.getSelectedValue() == 0) {
                micGainRadioButtonGroup2.setDisable("0,1");
                lineLevelRadioButtonGroup2.setEnable("0,1");
            } else {
                micGainRadioButtonGroup2.setEnable("0,1");
                lineLevelRadioButtonGroup2.setDisable("0,1");
            }
        }

        function callbackInput2MacGain() {
            cparam_set_input2_mac_gain(micGainRadioButtonGroup2.getSelectedValue());
        }

        function callbackInput2LineLevel() {
            cparam_set_input2_line_level(lineLevelRadioButtonGroup2.getSelectedValue());
        }

        function callbackCHSelect() {
            cparam_set_output_ch_select(outputSettingCHSelectRadioButtonGroup.getSelectedValue());
        }

        function callbackHeadRoom() {
            cparam_set_output_head_room(outputSettingHeadRoomRadioButtonGroup.getSelectedValue());
        }

        function changeInputVolumePluginPowerStatus() {
            if (audioRadioButtonGroup.getSelectedValue() == 0) {
                sliderAudioOutputCh1VolumeLevel.setDisable();
                if (!pluginPowerRadioButtonGroup.isDisabled()) {
                    pluginPowerRadioButtonGroup.displayDisabled();
                }
                inputSelectRadioButtonGroup1.displayDisabled();
            } else {
                sliderAudioOutputCh1VolumeLevel.setEnable();
                inputSelectRadioButtonGroup1.displayOff();
                if (inputSelectRadioButtonGroup1.getSelectedValue() == 0) {
                    pluginPowerRadioButtonGroup.displayOff();
                } else {
                    if (!pluginPowerRadioButtonGroup.isDisabled()) {
                        pluginPowerRadioButtonGroup.displayDisabled();
                    }
                }
            }
        }

        /**
         *
         */
        function getAudioInputVolumeLevelValue() {
            return cparam_get_volumeLevel(0);
        }

        /**
         *
         */
        function callbackInputVolumeLevel() {

        }

        /**
         *
         */
        function getAudioPluginPowerValue() {
            return cparam_get_pluginPower();
        }

        /**
         *
         */
        // function callbackAudioSetButton(mouse) {
        //     if (mouse == Button.MOUSE_DOWN) {
        //         $("#dialog_setup").show();
        //         cparam_set_audio(audioRadioButtonGroup.getSelectedValue());
        //         cparam_set_inputType(inputSelectRadioButtonGroup1.getSelectedValue());
        //         cparam_set_volumeLevel(0, sliderAudioOutputCh1VolumeLevel.getValue());
        //         // cparam_set_pluginPower(pluginPowerRadioButtonGroup.getSelectedValue());
        //         setTimeout(function () {
        //             $("#dialog_setup").hide();
        //         }, 500);
        //     }
        // }
        return {
            build: function () {
                return buildSettingAudio();
            },
            destroyMyScroll: destroyMyScroll,
            currentData: currentData,
            getAudioST2110SettingChValue: function () {
                txtStatusObject[AUDIO_ST2110_SETTING_CH1_VALUE] && txtStatusObject[AUDIO_ST2110_SETTING_CH1_VALUE].set(cparams_get_moip_audio_fmt_tx().ch1);
                txtStatusObject[AUDIO_ST2110_SETTING_CH2_VALUE] && txtStatusObject[AUDIO_ST2110_SETTING_CH2_VALUE].set(cparams_get_moip_audio_fmt_tx().ch2);
            },
            refreshAudiolSlider: function () {
                sliderAudioOutputCh1VolumeLevel.refresh();
                sliderAudioOutputCh2VolumeLevel.refresh();
            },
        }
    }

    /**
     * settingAudioOverIP:settingAudioOverIP制御に関わる画面クラス
     * @class settingAudioOverIP画面:settingAudioOverIP制御に関わる画面クラス
     * @return {{build: buildAudio, rebuild: rebuild}} build 構築�E琁E
     * @return {function} rebuild 再構築�E琁E
     * @constructor
     */
    function settingAudioOverIP() {
        /**
         * 構築フラグ
         * @type boolean
         */
        let buildFlag_settingAudioOverIP = false;
        /**
         * label定義
         * @type number
         */
        const TXT_AUDIO_AUDIO_AUDIO_OVER_IP_AUDIO_TRANSMISSION = 0;
        const TXT_AUDIO_AUDIO_AUDIO_OVER_IP_AUDIO_BIT_RATE = 1;
        let selectAudioBitRate;
        let txtAudioOverIPObject = [];

        let audioTransmissionRadioButtonGroup;
        let audioOverIP_set_button;

        function buildSettingAudioOverIP() {
            if (!buildFlag_settingAudioOverIP) {
                getCurrentData();
                buildFlag_settingAudioOverIP = true;
                // Audio transmission
                txtAudioOverIPObject[TXT_AUDIO_AUDIO_AUDIO_OVER_IP_AUDIO_TRANSMISSION] = TextCtrl('setup_audio_audioOverIP_label', 'setup_audio_audio_st2110_audio_format_label', NPTZ_WORDING.wID_0257);
                // Audio transmission radioButtonItems
                audioTransmissionRadioButtonGroup = RadioButtonGroupCtrl("setup_audio_audioOverIP_form", "setup_audio_audio_audioOverIP_audioTransmission_", RADIO_GROUP.rID_0001, cparams["audio_transmit"], callbackAudioAudioOverIP);
                LineCtrl('setup_audio_audioOverIP_main', 'horizontal', 73, 0, 1320, "setup_audio_audio_st2110_audio_format_label", "98");

                // Audio bit rate
                txtAudioOverIPObject[TXT_AUDIO_AUDIO_AUDIO_OVER_IP_AUDIO_BIT_RATE] = TextCtrl('setup_audio_audioOverIP_label', 'setup_audio_st2110_ch1_label', NPTZ_WORDING.wID_0258);
                selectAudioBitRate = SelectCtrl('setup_audio_audioOverIP_form', "", "setup_audio_audio_audioBitRate_select", "setup_audio_audio_audioBitRate_select", '', '', AUDIO_AUDIO_BIT_RATE, cparams["new_bit"]);
                selectAudioBitRate.show();
                selectAudioBitRate.displayOn();
                LineCtrl('setup_audio_audioOverIP_main', 'horizontal', 141, 0, 1320, "setup_audio_st2110_ch1_label", "98");

                audioOverIP_set_button = ButtonCtrl("setup_audio_audioOverIP_form", "setup_audio_audio_audioOverIP_set_button", NPTZ_WORDING.wID_0141, callbackAudioOverIPSetButton);
                audioOverIP_set_button.getButtonObject().addClass('button_class');
                audioOverIP_set_button.show();
                audioOverIP_set_button.displayOff();
                for (var text in txtAudioOverIPObject) {
                    txtAudioOverIPObject[text].show();
                }
                settingAudio.destroyMyScroll();
            } else {
                rebuild();
            }
        }

        function rebuild() {
            getCurrentData();
            audioTransmissionRadioButtonGroup.setSelectedValue(cparams["audio_transmit"]);
            selectAudioBitRate.val(cparams["new_bit"]);
            settingAudio.destroyMyScroll();
        }

        function getCurrentData() {
            let currentData = {};
            cparam_updateAudio();
            currentData.Audio = cparams["audio"];
            currentData.InVol = cparams["audio_volume"];
            currentData.Audio_sens = cparams["audio_sens"];
            currentData.PluginPower = cparams["pluginpower"];
            currentData.Transmit = cparams["audio_transmit"];
            currentData.AudioBit = cparams["new_bit"];
            currentData.Equal = cparams["new_equal"];
            currentData.ALC = cparams["new_alc"];
            return currentData;
        }

        /**
         *
         */
        function callbackAudioAudioOverIP() {

        }

        /**
         *
         */
        function callbackAudioOverIPSetButton(mouse) {
            if (mouse == Button.MOUSE_DOWN) {
                if (mouse == Button.MOUSE_DOWN) {
                    $("#dialog_setup").show();
                    $.ajax({
                        type: "post",
                        url: "/cgi-bin/set_audio",
                        data: getAudioOverIPSettingData(),
                        success: function (data) {
                            setTimeout(function () {
                                $("#dialog_setup").hide();
                                getCurrentData();
                            }, 500);
                        },
                        error: function (jqXHR, textStatus, errorThrown) {
                            setTimeout(function () {
                                $("#dialog_setup").hide();
                            }, 500);
                        }
                    });
                }
            }
        }

        /**
         *
         */
        function getAudioOverIPSettingData() {
            var data = {};
            data['audio_transmit'] = audioTransmissionRadioButtonGroup.getSelectedValue();
            data['audio_bitrate'] = selectAudioBitRate.get();
            return data;
        }

        return {
            build: function (type) {
                return buildSettingAudioOverIP();
            }
        }
    }

    /**
     * settingAudioSt2110:settingAudioSt2110IP制御に関わる画面クラス
     * @class settingAudioSt2110画面:settingAudioSt2110制御に関わる画面クラス
     * @return {{build: buildAudio, rebuild: rebuild}} build 構築�E琁E
     * @return {function} rebuild 再構築�E琁E
     * @constructor
     */
    function settingAudioSt2110() {
        /**
         * 構築フラグ
         * @type boolean
         */
        let buildFlag_settingAudioSt2110 = false;
        /**
         * label定義
         * @type number
         */
        const TXT_AUDIO_ST2110_AUDIO_FORMAT = 0;
        const TXT_AUDIO_ST2110_CH1 = 1;
        const TXT_AUDIO_ST2110_CH2 = 2;
        let selectAudioBitRate;
        let txtAudioSt2110Object = [];
        let radioModeButtonGroup = [];

        let audioTransmissionRadioButtonGroup;
        let audioOverIP_set_button;

        function buildSettingAudioSt2110() {
            if (!buildFlag_settingAudioSt2110) {
                getCurrentData();
                buildFlag_settingAudioSt2110 = true;
                // Audio transmission
                txtAudioSt2110Object[TXT_AUDIO_ST2110_AUDIO_FORMAT] = TextCtrl('setup_audio_st2110_label', 'setup_audio_audio_st2110_audio_format_label', NPTZ_WORDING.wID_0664);
                // Audio transmission radioButtonItems
                // audioTransmissionRadioButtonGroup = RadioButtonGroupCtrl("setup_audio_st2110_form", "setup_audio_audio_audioOverIP_audioTransmission_", RADIO_GROUP.rID_0001, cparams["audio_transmit"], callbackAudioAudioOverIP);
                LineCtrl('setup_audio_st2110_main', 'horizontal', 73, 0, 1320, "setup_audio_audio_st2110_audio_format_label", "98");

                // ch1
                txtAudioSt2110Object[TXT_AUDIO_ST2110_CH1] = TextCtrl('setup_audio_st2110_label', 'setup_audio_st2110_ch1_label', NPTZ_WORDING.wID_0694);
                radioModeButtonGroup[TXT_AUDIO_ST2110_CH1] = RadioButtonGroupCtrl("setup_audio_st2110_form", "setup_audio_st2110_ch1_select_", RADIO_GROUP.rID_0079, '0', setSt2110Ch1);

                LineCtrl('setup_audio_st2110_main', 'horizontal', 141, 0, 1320, "setup_audio_st2110_ch1_label", "98");
                // ch2
                txtAudioSt2110Object[TXT_AUDIO_ST2110_CH2] = TextCtrl('setup_audio_st2110_label', 'setup_audio_st2110_ch2_label', NPTZ_WORDING.wID_0695);
                radioModeButtonGroup[TXT_AUDIO_ST2110_CH2] = RadioButtonGroupCtrl("setup_audio_st2110_form", "setup_audio_st2110_ch2_select_", RADIO_GROUP.rID_0079, '0', setSt2110Ch2);

                LineCtrl('setup_audio_st2110_main', 'horizontal', 141, 0, 1320, "setup_audio_st2110_ch2_label", "98");

                for (var text in txtAudioSt2110Object) {
                    txtAudioSt2110Object[text].show();
                }
                settingAudio.destroyMyScroll();
                initAudioOverIpData();
            } else {
                rebuild();
            }
        }

        function rebuild() {
            getCurrentData();
            // audioTransmissionRadioButtonGroup.setSelectedValue(cparams["audio_transmit"]);
            // selectAudioBitRate.val(cparams["new_bit"]);
            initAudioOverIpData();
            settingAudio.destroyMyScroll();
        }

        function getCurrentData() {
            let currentData = {};
            cparam_updateAudio();
            currentData.Audio = cparams["audio"];
            currentData.InVol = cparams["audio_volume"];
            currentData.Audio_sens = cparams["audio_sens"];
            currentData.PluginPower = cparams["pluginpower"];
            currentData.Transmit = cparams["audio_transmit"];
            currentData.AudioBit = cparams["new_bit"];
            currentData.Equal = cparams["new_equal"];
            currentData.ALC = cparams["new_alc"];
            return currentData;
        }

        /**
         *
         */
        function initAudioOverIpData() {
            var data = cparams_get_moip_audio_fmt_tx();
            var ch1Value = RADIO_GROUP.rID_0079[data.ch1];
            var ch2Value = RADIO_GROUP.rID_0079[data.ch2];

            radioModeButtonGroup[TXT_AUDIO_ST2110_CH1].setSelectedValue(ch1Value);
            radioModeButtonGroup[TXT_AUDIO_ST2110_CH2].setSelectedValue(ch2Value);
        }
        function setSt2110Ch1() {
            var value = radioModeButtonGroup[TXT_AUDIO_ST2110_CH1].getSelectedValue();
            var value2 = radioModeButtonGroup[TXT_AUDIO_ST2110_CH2].getSelectedValue();
            var setValue;
            var SetValue2;

            for (var key in RADIO_GROUP.rID_0079) {
                if (RADIO_GROUP.rID_0079[key] == value) {
                    setValue = key;
                }

                if (RADIO_GROUP.rID_0079[key] == value2) {
                    SetValue2 = key;
                }
            }

            // cparam_set_st2110_ch1();
            cparams_set_moip_audio_fmt_tx(setValue, SetValue2);
        }

        function setSt2110Ch2() {
            var value = radioModeButtonGroup[TXT_AUDIO_ST2110_CH1].getSelectedValue();
            var value2 = radioModeButtonGroup[TXT_AUDIO_ST2110_CH2].getSelectedValue();
            var setValue;
            var SetValue2;

            for (var key in RADIO_GROUP.rID_0079) {
                if (RADIO_GROUP.rID_0079[key] == value) {
                    setValue = key;
                }

                if (RADIO_GROUP.rID_0079[key] == value2) {
                    SetValue2 = key;
                }
            }

            // cparam_set_st2110_ch1();
            cparams_set_moip_audio_fmt_tx(setValue, SetValue2);
            //cparam_set_st2110_ch2(radioModeButtonGroup[TXT_AUDIO_ST2110_CH2].getSelectedValue());
        }
        /**
         *
         */
        function callbackAudioOverIPSetButton(mouse) {
            if (mouse == Button.MOUSE_DOWN) {
                if (mouse == Button.MOUSE_DOWN) {
                    $("#dialog_setup").show();
                    $.ajax({
                        type: "post",
                        url: "/cgi-bin/set_audio",
                        data: getAudioOverIPSettingData(),
                        success: function (data) {
                            setTimeout(function () {
                                $("#dialog_setup").hide();
                                getCurrentData();
                            }, 500);
                        },
                        error: function (jqXHR, textStatus, errorThrown) {
                            setTimeout(function () {
                                $("#dialog_setup").hide();
                            }, 500);
                        }
                    });
                }
            }
        }

        /**
         *
         */
        function getAudioOverIPSettingData() {
            var data = {};
            data['audio_transmit'] = audioTransmissionRadioButtonGroup.getSelectedValue();
            data['audio_bitrate'] = selectAudioBitRate.get();
            return data;
        }

        return {
            build: function (type) {
                return buildSettingAudioSt2110();
            }
        }
    }

    return {
        build: buildAudio,
        rebuild: rebuild,
        settingAudio: settingAudio
    };
}

/**
 * imageAdjust画面:imageAdjust制御に関わる画面クラス
 * @class imageAdjust画面:imageAdjust制御に関わる画面クラス
 * @return {{build: buildImageAdjust, rebuild: rebuild}} build 構築�E琁E
 * @return {function} rebuild 再構築�E琁E
 * @constructor
 */

function imageAdjust() {
    var settingBrightness = settingBrightness();
    var settingPicture = settingPicture();
    var settingMatrix = settingMatrix();
    var settingGammaKnee = settingGammaKnee();
    var settingDetail = settingDetail();
    /**
     * Image Adjust main title
     */
    let txtImageAdjustMainTitle;
    /**
     * 構築フラグ
     * @type boolean
     */
    let buildFlag_imageAdjust = false;

    /**
     * label定義
     * @type number
     */
    let TXT_IMAGE_ADJUST_SCENE = 0;
    let TXT_IMAGE_ADJUST_USER = 1;
    let TXT_IMAGE_ADJUST_FROM = 2;
    let TXT_IMAGE_ADJUST_TO = 3;
    let TXT_IMAGE_ADJUST_STORE_LOAD = 4;

    let txtImageAdjustObject = [];
    let selectImageAdjustSceneType;

    var selectSenceUserObject = []

    var SELECT_SCENE_STORE_LOAD = 0;

    var SELECT_SCENE_FROM = 1;

    var SELECT_SCENE_TO = 2;

    var SELECT_USER_FROM = 3;

    var SELECT_USER_TO = 4;

    var SELECT_USER_STORE_LOAD = 5;

    let TAB_IMAGE_ADJUST_BRIGHTNESS = 0;
    let TAB_IMAGE_ADJUST_PICTURE = 1;
    let TAB_IMAGE_ADJUST_MATRIX = 2;
    let TAB_IMAGE_ADJUST_GAMMA_KNEE = 3;
    let TAB_IMAGE_ADJUST_DETAIL = 4;
    let BTN_SCENE_SET = 5;
    let BTN_USER_SET = 6;

    let btnObject = [];
    let myScroll = null;
    let buildScrollSuccessFlg = true;
    let mode = cparam_get_sceneMode();
    const IMAGE_ADJUST_SCENE_TYPE = {
        "Scene1": "1",
        "Scene2": "2",
        "Scene3": "3",
        "Scene4": "4"
    };
    const IMAGE_ADJUST_MATRIX_TYPE = {
        "Normal": "0",
        "EBU": "1",
        "NTSC": "2",
        "User": "3"
    };
    const IMAGE_ADJUST_BRIGHTNESS_FRAME_MIX = {
        "Auto": "80",
        "Off": "00",
        "6dB": "06",
        "12dB": "0C",
        "18dB": "12",
        "24dB": "18"
    };
    const IMAGE_ADJUST_BRIGHTNESS_FRAME_MIX_CHANGE = {
        "Auto": "80",
        "Off": "00",
    };
    const IMAGE_ADJUST_PICTURE_GAMMA_MODE = {
        "HD": 0,
        "FILMLIKE1": 2,
        "FILMLIKE2": 3,
        "FILMLIKE3": 4
    };

    /**
     * Audio画面構築�E琁E
     */
    function buildImageAdjust() {
        if (!buildFlag_imageAdjust) {
            buildFlag_imageAdjust = true;
            if (myScroll != null) {
                myScroll.destroy();
                myScroll = null;
            }
            // main title
            txtImageAdjustMainTitle = TextCtrl('setup_imageAdjust_title', 'setup_imageAdjust_main_title_label', NPTZ_WORDING.wID_0005);
            txtImageAdjustMainTitle.show();

            txtImageAdjustObject[TXT_IMAGE_ADJUST_STORE_LOAD] = TextCtrl('setup_imageAdjust_control_scene_user', 'setup_imageAdjust_store_load_label', NPTZ_WORDING.wID_0728);
            txtImageAdjustObject[TXT_IMAGE_ADJUST_FROM] = TextCtrl('setup_imageAdjust_control_scene_user', 'setup_imageAdjust_from_label', NPTZ_WORDING.wID_0729);
            txtImageAdjustObject[TXT_IMAGE_ADJUST_TO] = TextCtrl('setup_imageAdjust_control_scene_user', 'setup_imageAdjust_to_label', NPTZ_WORDING.wID_0730);

            txtImageAdjustObject[TXT_IMAGE_ADJUST_SCENE] = TextCtrl('setup_imageAdjust_control_scene_user', 'setup_imageAdjust_scene_label', NPTZ_WORDING.wID_0739);
            txtImageAdjustObject[TXT_IMAGE_ADJUST_USER] = TextCtrl('setup_imageAdjust_control_scene_user', 'setup_imageAdjust_user_label', NPTZ_WORDING.wID_0740);

            selectSenceUserObject[SELECT_SCENE_STORE_LOAD] = SelectCtrl('setup_imageAdjust_control_scene_user', "select_scene_store_load", "select_scene_store_load", "select_scene_store_load_box", callbackSceneStoreLoadChange, null, initStoreLoadItems());
            selectSenceUserObject[SELECT_SCENE_FROM] = SelectCtrl('setup_imageAdjust_control_scene_user', "select_scene_from", "select_scene_from", "select_scene_from_box", null, null, initSceneFromItemsAll());
            selectSenceUserObject[SELECT_SCENE_TO] = SelectCtrl('setup_imageAdjust_control_scene_user', "select_scene_to", "select_scene_to", "select_scene_to_box", null, null, initCurrentSettingItems());

            selectSenceUserObject[SELECT_USER_STORE_LOAD] = SelectCtrl('setup_imageAdjust_control_scene_user', "select_user_store_load", "select_user_store_load", "select_user_store_load_box", callbackUserStoreLoadChange, null, initStoreLoadItems());
            selectSenceUserObject[SELECT_USER_FROM] = SelectCtrl('setup_imageAdjust_control_scene_user', "select_user_from", "select_user_from", "select_user_from_box", null, null, initUserFromItemsAll());
            selectSenceUserObject[SELECT_USER_TO] = SelectCtrl('setup_imageAdjust_control_scene_user', "select_user_to", "select_user_to", "select_user_to_box", null, null, initCurrentSettingItems());

            btnObject[BTN_SCENE_SET] = ButtonCtrl('setup_imageAdjust_control_scene_user', 'btn_image_scene_set', NPTZ_WORDING.wID_0019, callbackSceneSet);
            btnObject[BTN_USER_SET] = ButtonCtrl('setup_imageAdjust_control_scene_user', 'btn_image_user_set', NPTZ_WORDING.wID_0019, callbackUserSet);

            // Image adjust button
            btnObject[TAB_IMAGE_ADJUST_BRIGHTNESS] = MenuButtonCtrl('setup_imageAdjust_control_form_header', 'setup_imageAdjust_control_brightness_btn', NPTZ_WORDING.wID_0437, callbackTABControl, TAB_IMAGE_ADJUST_BRIGHTNESS, MenuButtonType.TABLEFT);
            btnObject[TAB_IMAGE_ADJUST_PICTURE] = MenuButtonCtrl('setup_imageAdjust_control_form_header', 'setup_imageAdjust_control_picture_btn', NPTZ_WORDING.wID_0438, callbackTABControl, TAB_IMAGE_ADJUST_PICTURE, MenuButtonType.TABMIDDLE);
            btnObject[TAB_IMAGE_ADJUST_MATRIX] = MenuButtonCtrl('setup_imageAdjust_control_form_header', 'setup_imageAdjust_control_matrix_btn', NPTZ_WORDING.wID_0439, callbackTABControl, TAB_IMAGE_ADJUST_MATRIX, MenuButtonType.TABMIDDLE);
            btnObject[TAB_IMAGE_ADJUST_GAMMA_KNEE] = MenuButtonCtrl('setup_imageAdjust_control_form_header', 'setup_imageAdjust_control_gamma_knee_btn', NPTZ_WORDING.wID_0737, callbackTABControl, TAB_IMAGE_ADJUST_GAMMA_KNEE, MenuButtonType.TABMIDDLE);
            btnObject[TAB_IMAGE_ADJUST_DETAIL] = MenuButtonCtrl('setup_imageAdjust_control_form_header', 'setup_imageAdjust_control_detail_btn', NPTZ_WORDING.wID_0738, callbackTABControl, TAB_IMAGE_ADJUST_DETAIL, MenuButtonType.TABRIGHT);

            for (var text in selectSenceUserObject) {
                selectSenceUserObject[text].show();
                selectSenceUserObject[text].displayOff();
            }

            for (var text in txtImageAdjustObject) {
                txtImageAdjustObject[text].show();
            }
            for (var text in btnObject) {
                btnObject[text].show();
                btnObject[text].displayOff();
            }
            btnObject[TAB_IMAGE_ADJUST_BRIGHTNESS].displayOn();
            callbackTABControl(Button.MOUSE_DOWN, TAB_IMAGE_ADJUST_BRIGHTNESS);
            settingIoaLive.build();
            if (cparam_get_v_log() == 1 && cparam_get_v_log_paint_sw() == 0) {
                btnObject[TAB_IMAGE_ADJUST_MATRIX].displayDisabled();
            } else {
                btnObject[TAB_IMAGE_ADJUST_MATRIX].displayOff();//Test Code
            }

            setInterval(function () {
                if (!$("#setup_imageAdjust_main").is(":hidden")) {
                    const sceneMode = cparam_get_sceneMode();
                    if (sceneMode != mode) {
                        mode = sceneMode;
                        imageAdjustInstance.build();
                    }
                    //selectImageAdjustSceneType.val(cparam_get_sceneMode());


                }
            }, 3000);
        } else {
            rebuild();
        }
    }

    function initStoreLoadItems() {
        return { 'LOAD': 'LOAD', 'STORE': 'STORE' }
    }

    function initSceneFromItemsAll() {
        return {
            'SceneOff': 'SceneOff',
            'Scene1': 'Scene1',
            'Scene2': 'Scene2',
            'Scene3': 'Scene3',
            'Scene4': 'Scene4',
            'Scene5': 'Scene5',
            'Scene6': 'Scene6',
            'Scene7': 'Scene7',
            'Scene8': 'Scene8',
        }
    }

    function initSceneToItemsAll() {
        return {
            'Scene1': 'Scene1',
            'Scene2': 'Scene2',
            'Scene3': 'Scene3',
            'Scene4': 'Scene4',
            'Scene5': 'Scene5',
            'Scene6': 'Scene6',
            'Scene7': 'Scene7',
            'Scene8': 'Scene8',
        }
    }

    function initUserFromItemsAll() {
        return {
            'User1': 'User1',
            'User2': 'User2',
            'User3': 'User3',
        }
    }

    function initUserToItemsAll() {
        return {
            'User1': 'User1',
            'User2': 'User2',
            'User3': 'User3',
        }
    }

    function initCurrentSettingItems() {
        return { "Current Seting": "Current Seting" }
    }

    function callbackSceneStoreLoadChange() {
        switch (selectSenceUserObject[SELECT_SCENE_STORE_LOAD].get()) {
            case "STORE":
                selectSenceUserObject[SELECT_SCENE_FROM].refreshOptions(initCurrentSettingItems());
                selectSenceUserObject[SELECT_SCENE_TO].refreshOptions(initSceneToItemsAll());
                break;
            case "LOAD":
                selectSenceUserObject[SELECT_SCENE_FROM].refreshOptions(initSceneFromItemsAll());
                selectSenceUserObject[SELECT_SCENE_TO].refreshOptions(initCurrentSettingItems());

                break;
        }
    }

    function callbackUserStoreLoadChange() {
        switch (selectSenceUserObject[SELECT_USER_STORE_LOAD].get()) {
            case "STORE":
                selectSenceUserObject[SELECT_USER_FROM].refreshOptions(initCurrentSettingItems());
                selectSenceUserObject[SELECT_USER_TO].refreshOptions(initUserToItemsAll());
                break;
            case "LOAD":
                selectSenceUserObject[SELECT_USER_FROM].refreshOptions(initUserFromItemsAll());
                selectSenceUserObject[SELECT_USER_TO].refreshOptions(initCurrentSettingItems());

                break;
        }
    }

    function callbackSceneSet(mouse) {
        if (mouse == Button.MOUSE_DOWN) {
            switch (selectSenceUserObject[SELECT_SCENE_STORE_LOAD].get()) {
                case "LOAD":
                    switch (selectSenceUserObject[SELECT_SCENE_FROM].get()) {
                        //XSF:[Data]
                        case 'Scene1':
                            cparam_set_sceneMode(1);
                            break;
                        case 'Scene2':
                            cparam_set_sceneMode(2);
                            break;
                        case 'Scene3':
                            cparam_set_sceneMode(3);
                            break;
                        case 'Scene4':
                            cparam_set_sceneMode(4);
                            break;
                        case 'Scene5':
                            cparam_set_sceneMode(5);
                            break;
                        case 'Scene6':
                            cparam_set_sceneMode(6);
                            break;
                        case 'Scene7':
                            cparam_set_sceneMode(7);
                            break;
                        case 'Scene8':
                            cparam_set_sceneMode(8);
                            break;
                        case 'SceneOff':
                            cparam_set_sceneMode(9);
                            break;
                    }
                    break;
                case "STORE":
                    switch (selectSenceUserObject[SELECT_SCENE_TO].get()) {
                        case 'Scene1':
                            cparam_set_storeSceneFile(1)
                            break;
                        case 'Scene2':
                            cparam_set_storeSceneFile(2)
                            break;
                        case 'Scene3':
                            cparam_set_storeSceneFile(3)
                            break;
                        case 'Scene4':
                            cparam_set_storeSceneFile(4)
                            break;
                        case 'Scene5':
                            cparam_set_storeSceneFile(5)
                            break;
                        case 'Scene6':
                            cparam_set_storeSceneFile(6)
                            break;
                        case 'Scene7':
                            cparam_set_storeSceneFile(7)
                            break;
                        case 'Scene8':
                            cparam_set_storeSceneFile(8)
                            break;
                    }
                    break;
            }
        }
    }

    function callbackUserSet(mouse) {
        if (mouse == Button.MOUSE_DOWN) {
            switch (selectSenceUserObject[SELECT_USER_STORE_LOAD].get()) {
                case "LOAD":
                    switch (selectSenceUserObject[SELECT_USER_FROM].get()) {
                        //OSL:92:[Data]
                        case 'User1':
                            cparam_set_loadSceneUser(1)
                            break;
                        case 'User2':
                            cparam_set_loadSceneUser(2)
                            break;
                        case 'User3':
                            cparam_set_loadSceneUser(3)
                            break;
                    }
                    break;
                case "STORE":
                    switch (selectSenceUserObject[SELECT_USER_TO].get()) {
                        case 'User1':
                            cparam_set_storeSceneUser(1)
                            break;
                        case 'User2':
                            cparam_set_storeSceneUser(2)
                            break;
                        case 'User3':
                            cparam_set_storeSceneUser(3)
                            break;
                    }
                    break;
            }
        }
    }
    /**
     * 画面再構築�E琁E
     */
    function rebuild() {
        settingIoaLive.rebuild();
        for (var text in btnObject) {
            btnObject[text].show();
            btnObject[text].displayOff();
        }
        // selectImageAdjustSceneType.val(cparam_get_sceneMode());
        btnObject[TAB_IMAGE_ADJUST_BRIGHTNESS].displayOn();
        callbackTABControl(Button.MOUSE_DOWN, TAB_IMAGE_ADJUST_BRIGHTNESS);
        if (cparam_get_v_log() == 1 && cparam_get_v_log_paint_sw() == 0) {
            btnObject[TAB_IMAGE_ADJUST_MATRIX].displayDisabled();
        } else {
            btnObject[TAB_IMAGE_ADJUST_MATRIX].displayOff();
        }
    }

    function getSceneValue() {
        var retValue = String(cparam_get_sceneMode());
        return retValue;
    }

    /**
     * Image adjustボタン押下時の画面表示刁E�E��E�処琁E
     */
    function callbackTABControl(mouse, type) {
        if (mouse == Button.MOUSE_DOWN) {
            $('#setup_imageAdjust_detail_brightness_main').hide();
            $('#setup_imageAdjust_detail_picture_main').hide();
            $('#setup_imageAdjust_detail_matrix_out_main').hide();
            $('#setup_imageAdjust_detail_gamma_knee_main').hide();
            $('#setup_imageAdjust_detail_detail_main').hide();
            switch (type) {
                case TAB_IMAGE_ADJUST_BRIGHTNESS:
                    $('#setup_imageAdjust_detail_brightness_main').show();
                    settingBrightness.build();
                    Platform.setCurrentPage('imageAdjust.settingBrightness');
                    break;
                case TAB_IMAGE_ADJUST_PICTURE:
                    $('#setup_imageAdjust_detail_picture_main').show();
                    settingPicture.build();
                    Platform.setCurrentPage('imageAdjust.settingPicture');
                    settingPicture.getKneeSwValue();
                    break;
                case TAB_IMAGE_ADJUST_MATRIX:
                    $('#setup_imageAdjust_detail_matrix_out_main').show();
                    settingMatrix.build();
                    Platform.setCurrentPage('imageAdjust.settingMatrix');
                    break;
                case TAB_IMAGE_ADJUST_GAMMA_KNEE:
                    $('#setup_imageAdjust_detail_gamma_knee_main').show();
                    settingGammaKnee.build();
                    Platform.setCurrentPage('imageAdjust.settingGammaKnee');
                    break;
                case TAB_IMAGE_ADJUST_DETAIL:
                    $('#setup_imageAdjust_detail_detail_main').show();
                    settingDetail.build();
                    Platform.setCurrentPage('imageAdjust.settingDetail');
                    break;
            }
            var slider_Css = document.getElementById("slider_cssId");
            if (Platform.isTouchMode()) {
                if (type == 2) {
                    slider_Css.href = "/css/pc/slider.css";
                } else {
                    slider_Css.href = "/css/pc/slider_touch.css";
                }
            }
        }
    }

    function callbackImageAdjustSetButton(mouse, type) {
        if (mouse == Button.MOUSE_DOWN) {
            $("#dialog_setup").show();
            cparam_set_sceneMode(selectImageAdjustSceneType.get());
            setTimeout(function () {
                imageAdjustInstance.build();
                $("#dialog_setup").hide();
            }, 500);
        }
    }

    /**
     * settingBrightness:settingBrightness制御に関わる画面クラス
     * @class settingBrightness画面:settingBrightness制御に関わる画面クラス
     * @return {{build: buildSettingBrightness, rebuild: rebuild}} build 構築�E琁E
     * @return {function} rebuild 再構築�E琁E
     * @constructor
     */
    function settingBrightness() {
        /**
         * 構築フラグ
         * @type boolean
         */
        var buildFlag_settingBrightness = false;
        /**
         * label定義
         * @type number
         */
        const TXT_IMAGE_ADJUST_BRIGHTNESS_AGIN_SETTING = 0;
        const TXT_IMAGE_ADJUST_BRIGHTNESS_GAIN = 1;
        const TXT_IMAGE_ADJUST_BRIGHTNESS_ACG = 2;
        const TXT_IMAGE_ADJUST_BRIGHTNESS_ACG_MAX_GAIN = 3;
        const TXT_IMAGE_ADJUST_BRIGHTNESS_FRAME_MIX_SW = 4;
        const TXT_IMAGE_ADJUST_BRIGHTNESS_FRAME_MIX = 5;
        const TXT_IMAGE_ADJUST_BRIGHTNESS_DAY_NIGHT = 6;
        const TXT_IMAGE_ADJUST_BRIGHTNESS_IRIS = 7;
        const TXT_IMAGE_ADJUST_BRIGHTNESS_AUTO_IRIS = 8;
        const TXT_IMAGE_ADJUST_BRIGHTNESS_WINDOW_SELECT = 9;
        const TXT_IMAGE_ADJUST_BRIGHTNESS_PICTURE_LEVE = 10;
        const TXT_IMAGE_ADJUST_BRIGHTNESS_PEAK_RATIO = 11;
        const TXT_IMAGE_ADJUST_BRIGHTNESS_AUTO_IRIS_CLOSE_LIMIT = 12;
        const TXT_IMAGE_ADJUST_BRIGHTNESS_IRIS_SPEED = 13;
        const TXT_IMAGE_ADJUST_BRIGHTNESS_SHUTTER = 14;
        const TXT_IMAGE_ADJUST_BRIGHTNESS_SHUTTER_SW = 15;
        const TXT_IMAGE_ADJUST_BRIGHTNESS_SHUTTER_MODE = 16;
        const TXT_IMAGE_ADJUST_BRIGHTNESS_SHUTTER_SPEED = 17;
        const TXT_IMAGE_ADJUST_BRIGHTNESS_SHUTTER_MODE_SYNCHRO = 18;
        const TXT_IMAGE_ADJUST_BRIGHTNESS_AUTO_SHUTTER = 19;
        const TXT_IMAGE_ADJUST_BRIGHTNESS_AUTO_SHUTTER_LIMIT = 20;


        let sliderBrightnessPictureLevel;
        let sliderBrightnessPeakRatio;
        let sliderBrightnessIrisSpeed;
        let sliderBrightnessShutterModeStep;
        let sliderBrightnessShutterModeSynchro;
        let sliderBrightnessGain;
        let txtBrightnessObject = [];

        let agcRadioButtonGroup;
        let agcMaxGainRadioButtonGroup;
        let frameMixSwRadioButtonGroup;
        let frameMixRadioButtonGroup;
        let dayNightRadioButtonGroup;
        let autoIrisRadioButtonGroup;
        let sliderBrightnessWindowSelect;
        let autoIrisCloseLimitRadioButtonGroup;
        let shutterSwRadioButtonGroup;
        let shutterModeRadioButtonGroup;
        let autoShutterRadioButtonGroup;
        let shutterModeELCLimitRadioButtonGroup;

        let myScroll = null;
        let buildScrollSuccessFlg = true;
        function buildSettingBrightness() {
            if (myScroll != null) {
                myScroll.destroy();
                myScroll = null;
            }
            getCurrentSettings();
            if (!buildFlag_settingBrightness) {
                buildFlag_settingBrightness = true;

                const BRIGHTNESS_LINE_PART = "image_adjust_brightness_line_part";

                // gain setting
                $("#gain_setting_title").html(NPTZ_WORDING.wID_0830);

                // Gain
                txtBrightnessObject[TXT_IMAGE_ADJUST_BRIGHTNESS_GAIN] = TextCtrl('gain_setting_area', 'setup_imageAdjust_brightness_gain_label', NPTZ_WORDING.wID_0831);
                sliderBrightnessGain = SliderCtrl('gain_setting_area', 'setup_imageAdjust_brightness_gain_slider', 12, -6, getGainValue(), callbackGain);
                LineCtrl(BRIGHTNESS_LINE_PART, 'horizontal', 73, 0, "", "setup_imageAdjust_brightness_gain_label", "3");
                LineCtrl(BRIGHTNESS_LINE_PART, 'vertical', 320, 37, 220, "setup_imageAdjust_brightness_gain_label1");

                // Agc
                txtBrightnessObject[TXT_IMAGE_ADJUST_BRIGHTNESS_ACG] = TextCtrl('gain_setting_area', 'setup_imageAdjust_brightness_gain_agc_label', NPTZ_WORDING.wID_0832);
                agcRadioButtonGroup = RadioButtonGroupCtrl('gain_setting_area', "setup_imageAdjust_brightness_gain_agc_", RADIO_GROUP.rID_0016, getAgcValue(), callbackAgc);
                LineCtrl(BRIGHTNESS_LINE_PART, 'horizontal', 209, 0, "", "setup_imageAdjust_brightness_gain_agc_label", "3");

                // ACG MAX GAIN
                txtBrightnessObject[TXT_IMAGE_ADJUST_BRIGHTNESS_ACG_MAX_GAIN] = TextCtrl('gain_setting_area', 'setup_imageAdjust_brightness_gain_agc_max_gain_label', NPTZ_WORDING.wID_0833);
                agcMaxGainRadioButtonGroup = RadioButtonGroupCtrl('gain_setting_area', "setup_imageAdjust_brightness_gain_agc_max_gain_", RADIO_GROUP.rID_0035, getAcgMaxGainValue(), callbackAcgMaxGain);
                LineCtrl(BRIGHTNESS_LINE_PART, 'horizontal', 277, 0, "", "setup_imageAdjust_brightness_gain_agc_max_gain_label", "3");

                //FRAME MIX SW
                txtBrightnessObject[TXT_IMAGE_ADJUST_BRIGHTNESS_FRAME_MIX_SW] = TextCtrl('gain_setting_area', 'setup_imageAdjust_brightness_gain_frame_mix_sw_label', NPTZ_WORDING.wID_0834);
                frameMixSwRadioButtonGroup = RadioButtonGroupCtrl('gain_setting_area', "setup_imageAdjust_brightness_gain_frame_mix_sw_", RADIO_GROUP.rID_0016, getframeMixSwValue(), callbackframeMixSwValue);
                LineCtrl(BRIGHTNESS_LINE_PART, 'horizontal', 277, 0, "", "setup_imageAdjust_brightness_gain_frame_mix_sw_label", "3");

                // FRAME MIX
                txtBrightnessObject[TXT_IMAGE_ADJUST_BRIGHTNESS_FRAME_MIX] = TextCtrl('gain_setting_area', 'setup_imageAdjust_brightness_gain_frame_mix_label', NPTZ_WORDING.wID_0835);
                frameMixRadioButtonGroup = RadioButtonGroupCtrl('gain_setting_area', "setup_imageAdjust_brightness_gain_frame_mix_", RADIO_GROUP.rID_0089, getFrameMixValue(), callbackFrameMix);
                LineCtrl(BRIGHTNESS_LINE_PART, 'horizontal', 373, 54, "", "setup_imageAdjust_brightness_gain_frame_mix_label", "3");
                LineCtrl(BRIGHTNESS_LINE_PART, 'vertical', 320, 37, 220, "setup_imageAdjust_brightness_gain_frame_mix_label1");

                // Day Night
                txtBrightnessObject[TXT_IMAGE_ADJUST_BRIGHTNESS_DAY_NIGHT] = TextCtrl('gain_setting_area', 'setup_imageAdjust_brightness_gain_day_night_label', NPTZ_WORDING.wID_0836);
                dayNightRadioButtonGroup = RadioButtonGroupCtrl('gain_setting_area', "setup_imageAdjust_brightness_gain_day_night_", RADIO_GROUP.rID_0037, getDayNightValue(), callbackDayNight);
                LineCtrl(BRIGHTNESS_LINE_PART, 'horizontal', 1025, 0, "", "setup_imageAdjust_brightness_gain_day_night_label", "3");

                //IRIS
                $("#iris_title").html(NPTZ_WORDING.wID_0837);

                // auto iris
                txtBrightnessObject[TXT_IMAGE_ADJUST_BRIGHTNESS_AUTO_IRIS] = TextCtrl('iris_area', 'setup_imageAdjust_brightness_iris_auto_iris_label', NPTZ_WORDING.wID_0838);
                autoIrisRadioButtonGroup = RadioButtonGroupCtrl('iris_area', "setup_imageAdjust_brightness_iris_auto_iris_", RADIO_GROUP.rID_0016, getautoIrisValue(), callbackautoIrisValue);
                LineCtrl(BRIGHTNESS_LINE_PART, 'horizontal', 443, 54, "", "setup_imageAdjust_brightness_iris_auto_iris_label", "3");
                LineCtrl(BRIGHTNESS_LINE_PART, 'vertical', 320, 37, 220, "setup_imageAdjust_brightness_iris_auto_iris_label1");

                // window select
                txtBrightnessObject[TXT_IMAGE_ADJUST_BRIGHTNESS_WINDOW_SELECT] = TextCtrl('iris_area', 'setup_imageAdjust_brightness_iris_window_select_label', NPTZ_WORDING.wID_0839);
                sliderBrightnessWindowSelect = SliderCtrl('iris_area', "setup_imageAdjust_brightness_iris_window_select_slider", 5, 1, getwindowSelectValue(), callbackwindowSelectValue);
                LineCtrl(BRIGHTNESS_LINE_PART, 'horizontal', 443, 54, "", "setup_imageAdjust_brightness_iris_window_select_label", "3");

                // picture leve
                txtBrightnessObject[TXT_IMAGE_ADJUST_BRIGHTNESS_PICTURE_LEVE] = TextCtrl('iris_area', 'setup_imageAdjust_brightness_iris_picture_leve_label', NPTZ_WORDING.wID_0840);
                sliderBrightnessPictureLevel = SliderCtrl('iris_area', 'setup_imageAdjust_brightness_iris_picture_leve_slider', 50, -50, getPictureLevel(), callbackPictureLevel);
                LineCtrl(BRIGHTNESS_LINE_PART, 'horizontal', 503, 54, "", "setup_imageAdjust_brightness_iris_picture_leve_label", "3");

                // peak ratio
                txtBrightnessObject[TXT_IMAGE_ADJUST_BRIGHTNESS_PEAK_RATIO] = TextCtrl('iris_area', 'setup_imageAdjust_brightness_iris_peak_ratio_label', NPTZ_WORDING.wID_0841);
                sliderBrightnessPeakRatio = SliderCtrl('iris_area', 'setup_imageAdjust_brightness_iris_peak_ratio_slider', 100, 0, getPeakRatio(), callbackPeakRatio);
                LineCtrl(BRIGHTNESS_LINE_PART, 'horizontal', 503, 54, "", "setup_imageAdjust_brightness_iris_peak_ratio_label", "3");

                // auto iris close limit
                txtBrightnessObject[TXT_IMAGE_ADJUST_BRIGHTNESS_AUTO_IRIS_CLOSE_LIMIT] = TextCtrl('iris_area', 'setup_imageAdjust_brightness_iris_auto_iris_close_limit_label', NPTZ_WORDING.wID_0842);
                autoIrisCloseLimitRadioButtonGroup = RadioButtonGroupCtrl('iris_area', "setup_imageAdjust_brightness_iris_auto_iris_close_limit_", RADIO_GROUP.rID_0090, getautoIrisCloseLimitValue(), callbackautoIrisCloseLimitValue);
                LineCtrl(BRIGHTNESS_LINE_PART, 'horizontal', 443, 54, "", "setup_imageAdjust_brightness_iris_auto_iris_close_limit_label", "3");

                // iris speed
                txtBrightnessObject[TXT_IMAGE_ADJUST_BRIGHTNESS_IRIS_SPEED] = TextCtrl('iris_area', 'setup_imageAdjust_brightness_iris_speed_label', NPTZ_WORDING.wID_0843);
                sliderBrightnessIrisSpeed = SliderCtrl('iris_area', 'setup_imageAdjust_brightness_iris_speed_slider', 3, 1, getIrisSpeed(), callbackIrisSpeed);
                LineCtrl(BRIGHTNESS_LINE_PART, 'horizontal', 503, 54, "", "setup_imageAdjust_brightness_iris_speed_label", "3");

                //shutter speed
                $("#shutter_title").html(NPTZ_WORDING.wID_0844);

                // SHUTTER SW
                txtBrightnessObject[TXT_IMAGE_ADJUST_BRIGHTNESS_SHUTTER_SW] = TextCtrl('shutter_setting_area', 'setup_imageAdjust_brightness_shutter_sw_label', NPTZ_WORDING.wID_0847);
                shutterSwRadioButtonGroup = RadioButtonGroupCtrl('shutter_setting_area', "setup_imageAdjust_brightness_shutter_sw_", RADIO_GROUP.rID_0016, getshutterSwValue(), callbackshutterSwValue);
                LineCtrl(BRIGHTNESS_LINE_PART, 'horizontal', 443, 54, "", "setup_imageAdjust_brightness_shutter_sw_label", "3");
                LineCtrl(BRIGHTNESS_LINE_PART, 'vertical', 320, 37, 220, "setup_imageAdjust_brightness_shutter_sw_label1");

                // SHUTTER mode
                txtBrightnessObject[TXT_IMAGE_ADJUST_BRIGHTNESS_SHUTTER_MODE] = TextCtrl('shutter_setting_area', 'setup_imageAdjust_brightness_shutter_mode_label', NPTZ_WORDING.wID_0848);
                shutterModeRadioButtonGroup = RadioButtonGroupCtrl('shutter_setting_area', "setup_imageAdjust_brightness_shutter_mode_", RADIO_GROUP.rID_0094, getShutterModeValue(), callbackShutterMode);
                LineCtrl(BRIGHTNESS_LINE_PART, 'horizontal', 443, 54, "", "setup_imageAdjust_brightness_shutter_mode_label", "3");
                LineCtrl(BRIGHTNESS_LINE_PART, 'vertical', 320, 37, 220, "setup_imageAdjust_brightness_shutter_mode_label1");

                // Shutter speed
                txtBrightnessObject[TXT_IMAGE_ADJUST_BRIGHTNESS_SHUTTER_SPEED] = TextCtrl('shutter_setting_area', 'setup_imageAdjust_brightness_shutter_speed_label', NPTZ_WORDING.wID_0844);
                sliderBrightnessShutterModeStep = SliderCtrl('shutter_setting_area', 'setup_imageAdjust_brightness_shutter_speed_slider', null, null, getShutterStepValue(), callbackShutterStep, '', '', '', '', sysConst.getShutterStepValues());
                LineCtrl(BRIGHTNESS_LINE_PART, 'horizontal', 503, 54, "", "setup_imageAdjust_brightness_shutter_speed_label", "3");
                LineCtrl(BRIGHTNESS_LINE_PART, 'vertical', 320, 37, 220, "setup_imageAdjust_brightness_shutter_speed_label1");

                //  Synchro scan
                txtBrightnessObject[TXT_IMAGE_ADJUST_BRIGHTNESS_SHUTTER_MODE_SYNCHRO] = TextCtrl('shutter_setting_area', 'setup_imageAdjust_brightness_synchro_scan_label', NPTZ_WORDING.wID_0849);
                sliderBrightnessShutterModeSynchro = SliderCtrl('shutter_setting_area', 'setup_imageAdjust_brightness_synchro_scan_slider', null, null, getShutterSynchroValue(), callbackShutterSynchro, '', '', '', '', sysConst.getShutterModeSynchroItems());
                LineCtrl(BRIGHTNESS_LINE_PART, 'horizontal', 503, 54, "", "setup_imageAdjust_brightness_synchro_scan_label", "3");

                //auto  SHUTTER 
                txtBrightnessObject[TXT_IMAGE_ADJUST_BRIGHTNESS_AUTO_SHUTTER] = TextCtrl('shutter_setting_area', 'setup_imageAdjust_brightness_auto_shutter_label', NPTZ_WORDING.wID_0845);
                autoShutterRadioButtonGroup = RadioButtonGroupCtrl('shutter_setting_area', "setup_imageAdjust_brightness_auto_shutter_", RADIO_GROUP.rID_0016, getautoShutterValue(), callbackautoShutterValue);
                LineCtrl(BRIGHTNESS_LINE_PART, 'horizontal', 443, 54, "", "setup_imageAdjust_brightness_auto_shutter_label", "3");

                // auto Shutter limit
                txtBrightnessObject[TXT_IMAGE_ADJUST_BRIGHTNESS_AUTO_SHUTTER_LIMIT] = TextCtrl('shutter_setting_area', 'setup_imageAdjust_brightness_auto_shutter_limit_label', NPTZ_WORDING.wID_0846);
                shutterModeELCLimitRadioButtonGroup = RadioButtonGroupCtrl('shutter_setting_area', "setup_imageAdjust_brightness_auto_shutter_limit_", RADIO_GROUP.rID_0034, getautoShutterLimitValue(), callbackautoShutterLimit);
                LineCtrl(BRIGHTNESS_LINE_PART, 'horizontal', 577, 0, "", "setup_imageAdjust_brightness_auto_shutter_limit_label", "3");
                LineCtrl(BRIGHTNESS_LINE_PART, 'vertical', 800, 37, 100, "setup_imageAdjust_brightness_auto_shutter_limit_label1");



                for (var text in txtBrightnessObject) {
                    txtBrightnessObject[text].show();
                }
                // 制御状慁E
                initStatus();
                setInterval(function () {
                    if (!$("#setup_imageAdjust_main").is(":hidden")) {
                        shutterModeRadioButtonGroup.setSelectedValue(getShutterModeValue());
                        sliderBrightnessGain.setValue(getGainValue());
                    }
                }, 3000);
            } else {
                rebuild();
            }
            if (buildScrollSuccessFlg) {
                buildScrollSuccessFlg = false;
                setTimeout(function () {
                    myScroll = new IScroll('#setup_imageAdjust_detail_brightness_main', {
                        preventDefault: false,
                        click: false,
                        tap: true,
                        scrollbars: true,
                        mouseWheel: true,
                        interactiveScrollbars: true,
                        shrinkScrollbars: 'scale',
                        fadeScrollbars: false,
                        useTransform: false
                    });
                    buildScrollSuccessFlg = true;
                }, 1000)
            }


        }

        function getPresetToImageAdjustValue() {
            sliderBrightnessPictureLevel.setValue(getPictureLevel());
            sliderBrightnessPeakRatio.setValue(getPeakRatio());
            sliderBrightnessIrisSpeed.setValue(getIrisSpeed());
            agcRadioButtonGroup.setSelectedValue(getAgcValue());
            agcMaxGainRadioButtonGroup.setSelectedValue(getAcgMaxGainValue());
            frameMixSwRadioButtonGroup.setSelectedValue(getframeMixSwValue());
        }

        function rebuild() {
            sliderBrightnessPictureLevel.setValue(getPictureLevel());
            sliderBrightnessPeakRatio.setValue(getPeakRatio());
            sliderBrightnessIrisSpeed.setValue(getIrisSpeed());
            agcRadioButtonGroup.setSelectedValue(getAgcValue());
            agcMaxGainRadioButtonGroup.setSelectedValue(getAcgMaxGainValue());
            frameMixSwRadioButtonGroup.setSelectedValue(getframeMixSwValue());
            frameMixRadioButtonGroup.setSelectedValue(getFrameMixValue());
            autoIrisRadioButtonGroup.setSelectedValue(getautoIrisValue());
            sliderBrightnessWindowSelect.setValue(getwindowSelectValue());
            autoIrisCloseLimitRadioButtonGroup.setSelectedValue(getautoIrisCloseLimitValue());
            shutterSwRadioButtonGroup.setSelectedValue(getshutterSwValue());
            shutterModeRadioButtonGroup.setSelectedValue(getShutterModeValue());
            autoShutterRadioButtonGroup.setSelectedValue(getautoShutterValue());
            sliderBrightnessShutterModeStep.changeRange(null, null, sysConst.getShutterStepValues());
            sliderBrightnessShutterModeStep.setCgiValue(getShutterStepValue());
            sliderBrightnessShutterModeSynchro.changeRange(null, null, sysConst.getShutterModeSynchroItems());
            sliderBrightnessShutterModeSynchro.setCgiValue(getShutterSynchroValue());
            shutterModeELCLimitRadioButtonGroup.setSelectedValue(getautoShutterLimitValue());
            sliderBrightnessGain.setValue(getGainValue());
            dayNightRadioButtonGroup.setSelectedValue(getDayNightValue());
            // 制御状慁E
            initStatus();
        }

        function initStatus() {

            if (frameMixSwRadioButtonGroup.getSelectedValue() == 0) {
                frameMixRadioButtonGroup.setDisable("0,1,2,3");
            } else {
                frameMixRadioButtonGroup.setEnable("0,1,2,3");
            }

            if (shutterSwRadioButtonGroup.getSelectedValue() == 1 ||
                sysCommon.format == CONST_2160_29_97p ||
                sysCommon.format == CONST_2160_23_98p ||
                sysCommon.format == CONST_2160_24p ||
                sysCommon.format == CONST_2160_25p ||
                sysCommon.format == CONST_1080_119_88p ||
                sysCommon.format == CONST_1080_29_97p ||
                sysCommon.format == CONST_1080_23_98p ||
                sysCommon.format == CONST_1080_24p ||
                sysCommon.format == CONST_1080_25p ||
                sysCommon.format == CONST_1080_100p) {
                frameMixSwRadioButtonGroup.setDisable("0,1");
                frameMixRadioButtonGroup.setDisable("0,1,2,3");
            } else {
                frameMixSwRadioButtonGroup.setEnable("0,1");
            }

            if (agcRadioButtonGroup.getSelectedValue() == 0 &&
                autoIrisRadioButtonGroup.getSelectedValue() == 0 &&
                autoShutterRadioButtonGroup.getSelectedValue() == 0) {
                sliderBrightnessPictureLevel.setDisable();
            } else {
                sliderBrightnessPictureLevel.setEnable();
            }

            if (shutterSwRadioButtonGroup.getSelectedValue() == 0) {
                autoShutterRadioButtonGroup.setDisable("0,1");
            } else {
                autoShutterRadioButtonGroup.setEnable("0,1");
            }

            if (shutterSwRadioButtonGroup.getSelectedValue() == 0 ||
                autoShutterRadioButtonGroup.getSelectedValue() == 0) {
                shutterModeELCLimitRadioButtonGroup.setDisable("2,3,4");
            } else {
                shutterModeELCLimitRadioButtonGroup.setEnable("2,3,4");
            }

            if (shutterSwRadioButtonGroup.getSelectedValue() == 0 ||
                autoShutterRadioButtonGroup.getSelectedValue() == 1) {
                shutterModeRadioButtonGroup.setDisable("0,1");
            } else {
                shutterModeRadioButtonGroup.setEnable("0,1");
            }

            if (shutterModeRadioButtonGroup.getSelectedValue() == 1 ||
                shutterSwRadioButtonGroup.getSelectedValue() == 0 ||
                autoShutterRadioButtonGroup.getSelectedValue() == 1) {
                sliderBrightnessShutterModeStep.setDisable();
            } else {
                sliderBrightnessShutterModeStep.setEnable();
            }

            if (shutterModeRadioButtonGroup.getSelectedValue() == 0 ||
                shutterSwRadioButtonGroup.getSelectedValue() == 0 ||
                autoShutterRadioButtonGroup.getSelectedValue() == 1) {
                sliderBrightnessShutterModeSynchro.setDisable();
            } else {
                sliderBrightnessShutterModeSynchro.setEnable();
            }
            if (agcRadioButtonGroup.getSelectedValue() == 1) {
                sliderBrightnessGain.setDisable();
            } else {
                sliderBrightnessGain.setEnable();
            }
        }


        function getPictureLevel() {
            return cparam_get_pictureLevel();
        }

        /**
         *
         */
        function callbackPictureLevel() {
            cparam_set_pictureLevel(parseInt(sliderBrightnessPictureLevel.getValue()));
        }

        function getPeakRatio() {
            return cparam_get_PeakRatio();
        }

        /**
         *
         */
        function callbackPeakRatio() {
            cparam_set_PeakRatio(parseInt(sliderBrightnessPeakRatio.getValue()));
        }

        function getIrisSpeed() {
            return cparam_get_irisAutoSpeed();
        }

        /**
         *
         */
        function callbackIrisSpeed() {
            cparam_set_irisAutoSpeed(parseInt(sliderBrightnessIrisSpeed.getValue()));
        }

        /**
         *
         */
        function getAgcValue() {
            return cparam_get_agc();
        }

        /**
         *
         */
        function callbackAgc() {
            cparam_set_agc(agcRadioButtonGroup.getSelectedValue());

            if (agcRadioButtonGroup.getSelectedValue() == 0 &&
                autoIrisRadioButtonGroup.getSelectedValue() == 0 &&
                autoShutterRadioButtonGroup.getSelectedValue() == 0) {
                sliderBrightnessPictureLevel.setDisable();
            } else {
                sliderBrightnessPictureLevel.setEnable();
            }
            if (agcRadioButtonGroup.getSelectedValue() == 1) {
                sliderBrightnessGain.setDisable();
            } else {
                sliderBrightnessGain.setEnable();
            }
        }

        /**
         *
         */
        function getAcgMaxGainValue() {
            return cparam_get_AGCMaxGain();
        }

        /**
         *
         */
        function callbackAcgMaxGain() {
            cparam_set_AGCMaxGain(agcMaxGainRadioButtonGroup.getSelectedValue());
        }

        /**
         *
         */
        function getframeMixSwValue() {
            return cparam_get_frameMixSw();
        }

        /**
         *
         */
        function callbackframeMixSwValue() {
            cparam_set_brightness_frameMixSw(frameMixSwRadioButtonGroup.getSelectedValue());
            if (frameMixSwRadioButtonGroup.getSelectedValue() == 0) {
                frameMixRadioButtonGroup.setDisable("0,1,2,3");
            } else {
                frameMixRadioButtonGroup.setEnable("0,1,2,3");
            }
        }

        /**
         *
         */
        function getautoIrisValue() {
            return cparam_get_irismode();
        }

        /**
         *
         */
        function callbackautoIrisValue() {
            cparam_set_irismode(autoIrisRadioButtonGroup.getSelectedValue());
            if (agcRadioButtonGroup.getSelectedValue() == 0 &&
                autoIrisRadioButtonGroup.getSelectedValue() == 0 &&
                autoShutterRadioButtonGroup.getSelectedValue() == 0) {
                sliderBrightnessPictureLevel.setDisable();
            } else {
                sliderBrightnessPictureLevel.setEnable();
            }
        }

        /**
         *
         */
        function getwindowSelectValue() {
            return cparam_get_irisAutoWindow();
        }

        /**
         *
         */
        function callbackwindowSelectValue() {
            cparam_set_irisAutoWindow(sliderBrightnessWindowSelect.getValue());
        }

        /**
         *
         */
        function getautoIrisCloseLimitValue() {
            return cparam_get_irisClose();
        }

        /**
         *
         */
        function callbackautoIrisCloseLimitValue() {
            cparam_set_brightness_irisClose(autoIrisCloseLimitRadioButtonGroup.getSelectedValue());
        }

        /**
         *
         */
        function getshutterSwValue() {
            return cparam_get_shutterSw();
        }

        /**
         *
         */
        function callbackshutterSwValue() {
            cparam_set_brightness_shutterSw(shutterSwRadioButtonGroup.getSelectedValue());
            if (shutterSwRadioButtonGroup.getSelectedValue() == 1) {
                frameMixSwRadioButtonGroup.setDisable("0,1");
                // frameMixRadioButtonGroup.setDisable("0,1,2,3");
            } else {
                frameMixSwRadioButtonGroup.setEnable("0,1");
                // frameMixRadioButtonGroup.setEnable("0,1,2,3");
            }
            autoShutterRadioButtonGroup.setSelectedValue(getautoShutterValue());
            if (shutterSwRadioButtonGroup.getSelectedValue() == 0) {
                autoShutterRadioButtonGroup.setDisable("0,1");
            } else {
                autoShutterRadioButtonGroup.setEnable("0,1");
            }

            if (shutterSwRadioButtonGroup.getSelectedValue() == 0 ||
                autoShutterRadioButtonGroup.getSelectedValue() == 0) {
                shutterModeELCLimitRadioButtonGroup.setDisable("2,3,4");
            } else {
                shutterModeELCLimitRadioButtonGroup.setEnable("2,3,4");
            }

            if (shutterSwRadioButtonGroup.getSelectedValue() == 0 ||
                autoShutterRadioButtonGroup.getSelectedValue() == 1) {
                shutterModeRadioButtonGroup.setDisable("0,1");
            } else {
                shutterModeRadioButtonGroup.setEnable("0,1");
            }

            if (shutterModeRadioButtonGroup.getSelectedValue() == 1 ||
                shutterSwRadioButtonGroup.getSelectedValue() == 0 ||
                autoShutterRadioButtonGroup.getSelectedValue() == 1) {
                sliderBrightnessShutterModeStep.setDisable();
            } else {
                sliderBrightnessShutterModeStep.setEnable();
            }

            if (shutterModeRadioButtonGroup.getSelectedValue() == 0 ||
                shutterSwRadioButtonGroup.getSelectedValue() == 0 ||
                autoShutterRadioButtonGroup.getSelectedValue() == 1) {
                sliderBrightnessShutterModeSynchro.setDisable();
            } else {
                sliderBrightnessShutterModeSynchro.setEnable();
            }

            // if (shutterSwRadioButtonGroup.getSelectedValue() == 1) {
            //     cparam_set_brightness_frameMixSw(0);
            //     frameMixRadioButtonGroup.setDisable("0,1,2,3");
            // } 

            frameMixSwRadioButtonGroup.setSelectedValue(getframeMixSwValue());

            if (frameMixSwRadioButtonGroup.getSelectedValue() == 0) {
                frameMixRadioButtonGroup.setDisable("0,1,2,3");
            } else {
                frameMixRadioButtonGroup.setEnable("0,1,2,3");
            }
        }

        /**
         *
         */
        function getautoShutterValue() {
            return cparam_get_autoShutter();
        }

        /**
         *
         */
        function callbackautoShutterValue() {
            cparam_set_brightness_autoShutter(autoShutterRadioButtonGroup.getSelectedValue());
            if (agcRadioButtonGroup.getSelectedValue() == 0 &&
                autoIrisRadioButtonGroup.getSelectedValue() == 0 &&
                autoShutterRadioButtonGroup.getSelectedValue() == 0) {
                sliderBrightnessPictureLevel.setDisable();
            } else {
                sliderBrightnessPictureLevel.setEnable();
            }

            if (shutterSwRadioButtonGroup.getSelectedValue() == 0 ||
                autoShutterRadioButtonGroup.getSelectedValue() == 0) {
                shutterModeELCLimitRadioButtonGroup.setDisable("2,3,4");
            } else {
                shutterModeELCLimitRadioButtonGroup.setEnable("2,3,4");
            }

            if (shutterSwRadioButtonGroup.getSelectedValue() == 0 ||
                autoShutterRadioButtonGroup.getSelectedValue() == 1) {
                shutterModeRadioButtonGroup.setDisable("0,1");
            } else {
                shutterModeRadioButtonGroup.setEnable("0,1");
            }

            if (shutterModeRadioButtonGroup.getSelectedValue() == 1 ||
                shutterSwRadioButtonGroup.getSelectedValue() == 0 ||
                autoShutterRadioButtonGroup.getSelectedValue() == 1) {
                sliderBrightnessShutterModeStep.setDisable();
            } else {
                sliderBrightnessShutterModeStep.setEnable();
            }

            if (shutterModeRadioButtonGroup.getSelectedValue() == 0 ||
                shutterSwRadioButtonGroup.getSelectedValue() == 0 ||
                autoShutterRadioButtonGroup.getSelectedValue() == 1) {
                sliderBrightnessShutterModeSynchro.setDisable();
            } else {
                sliderBrightnessShutterModeSynchro.setEnable();
            }
        }

        /**
         *
         */
        function getShutterModeValue() {
            return cparam_get_shutterMode();
        }

        /**
         *
         */
        function callbackShutterMode() {
            cparam_set_shutterMode(shutterModeRadioButtonGroup.getSelectedValue());
            if (shutterModeRadioButtonGroup.getSelectedValue() == 1 ||
                shutterSwRadioButtonGroup.getSelectedValue() == 0 ||
                autoShutterRadioButtonGroup.getSelectedValue() == 1) {
                sliderBrightnessShutterModeStep.setDisable();
            } else {
                sliderBrightnessShutterModeStep.setEnable();
            }

            if (shutterModeRadioButtonGroup.getSelectedValue() == 0 ||
                shutterSwRadioButtonGroup.getSelectedValue() == 0 ||
                autoShutterRadioButtonGroup.getSelectedValue() == 1) {
                sliderBrightnessShutterModeSynchro.setDisable();
            } else {
                sliderBrightnessShutterModeSynchro.setEnable();
            }
        }

        /**
         * Step VAL?
         */
        function getShutterStepValue() {
            return cparam_get_stepVAL();
        }

        /**
         *
         */
        function callbackShutterStep() {
            cparam_set_stepVAL(sliderBrightnessShutterModeStep.getCgiValue());
        }

        /**
         * ??
         */
        function getShutterSynchroValue() {
            return parseFloat(cparam_get_synchroVAL());
        }

        /**
         * ??
         */
        function callbackShutterSynchro() {
            cparam_set_synchroVAL(sliderBrightnessShutterModeSynchro.getCgiValue());
            sliderBrightnessShutterModeSynchro.setCgiValue(getShutterSynchroValue());
        }

        /**
         *
         */
        function getautoShutterLimitValue() {
            return cparam_get_ELCLimit();
        }

        /**
         * ??
         */
        function callbackautoShutterLimit() {
            cparam_set_ELCLimit(shutterModeELCLimitRadioButtonGroup.getSelectedValue());
        }

        function getGainValue() {
            return cparam_get_gain();
        }

        /**
         * ??
         */
        function callbackGain() {
            cparam_set_gain(sliderBrightnessGain.getValue());
            if (agcRadioButtonGroup.getSelectedValue() == 1) {
                sliderBrightnessGain.setDisable();
                agcMaxGainRadioButtonGroup.setDisable("01,02,03");
            } else {
                sliderBrightnessGain.setEnable();
                agcMaxGainRadioButtonGroup.setEnable("01,02,03");
            }
        }

        function getFrameMixValue() {
            return cparam_get_framMix();
        }

        /**
         * ??
         */
        function callbackFrameMix() {
            cparam_set_framMix(frameMixRadioButtonGroup.getSelectedValue());
        }

        /**
         *
         * @returns {*}
         */
        function getDayNightValue() {
            return cparam_get_dayNight();
        }

        /**
         * ????? %23D
         * http://10.194.147.201"/cgi-bin/aw_ptz?cmd=%23D61&res=1
         * http://10.194.147.201"/cgi-bin/aw_ptz?cmd=%23D60&res=1
         *
         */
        function callbackDayNight() {
            //#3927
            //changeNDFilterStatus();
            cparam_set_dayNight(dayNightRadioButtonGroup.getSelectedValue());
        }

        /**
         *
         */
        return {
            build: function () {
                return buildSettingBrightness();
            },
            getPresetToImageAdjustValue: getPresetToImageAdjustValue
        }
    }

    /**
     * settingPicture:settingPicture制御に関わる画面クラス
     * @class settingPicture画面:settingPicture制御に関わる画面クラス
     * @return {{build: buildSettingPicture, rebuild: rebuild}} build 構築�E琁E
     * @return {function} rebuild 再構築�E琁E
     * @constructor
     */
    function settingPicture() {
        /**
         * 構築フラグ
         * @type boolean
         */
        let buildFlag_settingPicture = false;
        /**
         * label定義
         * @type number
         */
        const TXT_IMAGE_ADJUST_PICTURE_ATW = 0;
        const TXT_IMAGE_ADJUST_PICTURE_WHITE_BALANCE_MODE = 1;
        const TXT_IMAGE_ADJUST_PICTURE_W_BAL_VAR = 2;
        const TXT_IMAGE_ADJUST_PICTURE_ATW_SPEED = 3;
        const TXT_IMAGE_ADJUST_PICTURE_ATW_TARGET_R = 4;
        const TXT_IMAGE_ADJUST_PICTURE_ATW_TARGET_B = 5;
        const TXT_IMAGE_ADJUST_PICTURE_SHOCKLESS_WB_SW = 6;
        //const TXT_IMAGE_ADJUST_PICTURE_ATW_TARGET_A = 7;
        const txt_image_adjust_picture_SHOCKLESS_WB_SW_SPEED = 8;
        const TXT_IMAGE_ADJUST_PICTURE_CHROMA_LEVEL_SWITCH = 9;
        const TXT_IMAGE_ADJUST_PICTURE_CHROMA_LEVEL = 10;
        const TXT_IMAGE_ADJUST_PICTURE_COLOR_TEMP_ACH_BCH = 11;
        const TXT_IMAGE_ADJUST_PICTURE_COLOR_TEMP_ACH = 12;
        const TXT_IMAGE_ADJUST_PICTURE_R_GAIN = 13;
        const TXT_IMAGE_ADJUST_PICTURE_G_GAIN = 14;
        const TXT_IMAGE_ADJUST_PICTURE_B_GAIN = 15;
        const TXT_IMAGE_ADJUST_PICTURE_R_GAIN_BCH = 16;
        const TXT_IMAGE_ADJUST_PICTURE_G_GAIN_BCH = 17;
        const TXT_IMAGE_ADJUST_PICTURE_B_GAIN_BCH = 18;
        const TXT_IMAGE_ADJUST_PICTURE_COLOR_TEMP_BCH = 19;
        const TXT_IMAGE_ADJUST_PICTURE_G_GAIN_REL_CONTROL_SWITCH = 20;
        const TXT_IMAGE_ADJUST_PICTURE_RGB_GAIN_PRESET = 21;
        const TXT_IMAGE_ADJUST_PICTURE_PRESET_R_GAIN = 22;
        const TXT_IMAGE_ADJUST_PICTURE_PRESET_G_GAIN = 23;
        const TXT_IMAGE_ADJUST_PICTURE_PRESET_B_GAIN = 24;
        const TXT_IMAGE_ADJUST_PICTURE_PRESET_RGB_GAIN_ACH_BACH = 25;
        const TXT_IMAGE_ADJUST_PICTURE_PRESET_RGB_GAIN_ACH = 26;
        const TXT_IMAGE_ADJUST_PICTURE_PRESET_RGB_GAIN_ACH_R = 27;
        const TXT_IMAGE_ADJUST_PICTURE_PRESET_RGB_GAIN_ACH_G = 28;
        const TXT_IMAGE_ADJUST_PICTURE_PRESET_RGB_GAIN_ACH_B = 29;
        const TXT_IMAGE_ADJUST_PICTURE_PRESET_RGB_GAIN_ACH_OFFSET = 30;
        const TXT_IMAGE_ADJUST_PICTURE_PRESET_RGB_GAIN_BCH = 31;
        const TXT_IMAGE_ADJUST_PICTURE_PRESET_RGB_GAIN_BCH_R = 32;
        const TXT_IMAGE_ADJUST_PICTURE_PRESET_RGB_GAIN_BCH_G = 33;
        const TXT_IMAGE_ADJUST_PICTURE_PRESET_RGB_GAIN_BCH_B = 34;
        const TXT_IMAGE_ADJUST_PICTURE_PRESET_RGB_GAIN_BCH_OFFSET = 35;
        const TXT_IMAGE_ADJUST_PICTURE_FLARE = 36;
        const TXT_IMAGE_ADJUST_PICTURE_MASTER_FLARE = 37;
        const TXT_IMAGE_ADJUST_PICTURE_R_FLARE = 38;
        const TXT_IMAGE_ADJUST_PICTURE_G_FLARE = 39;
        const TXT_IMAGE_ADJUST_PICTURE_B_FLARE = 40;
        const TXT_IMAGE_ADJUST_PICTURE_DNR_SW = 41;
        const TXT_IMAGE_ADJUST_PICTURE_DNR_LEVEL = 42;
        const TXT_IMAGE_ADJUST_PICTURE_V_VLOG_PAINT_COLOR_TEMP_ACH_BCH = 43;
        const TXT_IMAGE_ADJUST_PICTURE_V_VLOG_PAINT_COLOR_TEMP_ACH = 44;
        const TXT_IMAGE_ADJUST_PICTURE_V_VLOG_PAINT_R_GAIN = 45;
        const TXT_IMAGE_ADJUST_PICTURE_V_VLOG_PAINT_G_GAIN = 46;
        const TXT_IMAGE_ADJUST_PICTURE_V_VLOG_PAINT_B_GAIN = 47;
        const TXT_IMAGE_ADJUST_PICTURE_V_VLOG_PAINT_COLOR_TEMP_BCH = 48;
        const TXT_IMAGE_ADJUST_PICTURE_V_VLOG_PAINT_R_GAIN_BCH = 49;
        const TXT_IMAGE_ADJUST_PICTURE_V_VLOG_PAINT_G_GAIN_BCH = 50;
        const TXT_IMAGE_ADJUST_PICTURE_V_VLOG_PAINT_B_GAIN_BCH = 51;
        const TXT_IMAGE_ADJUST_PICTURE_V_VLOG_PAINT_DNR_SW = 52;
        const TXT_IMAGE_ADJUST_PICTURE_V_VLOG_PAINT_DNR_LEVEL = 53;
        const TXT_IMAGE_ADJUST_PICTURE_V_VLOG_PAINT_DNR = 55;
        const TXT_IMAGE_ADJUST_PICTURE_PENDESTAL_OFFSET = 56;
        const TXT_IMAGE_ADJUST_PICTURE_MASTER_PENDESTAL = 57;
        const TXT_IMAGE_ADJUST_PICTURE_R_PENDESTAL = 58;
        const TXT_IMAGE_ADJUST_PICTURE_G_PENDESTAL = 59;
        const TXT_IMAGE_ADJUST_PICTURE_B_PENDESTAL = 60;
        const TXT_IMAGE_ADJUST_PICTURE_HLG_MODE = 61;
        const TXT_IMAGE_ADJUST_PICTURE_SDR_CONVERT_MODE = 62;
        const TXT_IMAGE_ADJUST_PICTURE_GAMMA_BLACK_GANMMA = 63;
        const TXT_IMAGE_ADJUST_PICTURE_GAMMA_BLACK_GANMMA_SW = 64;
        const TXT_IMAGE_ADJUST_PICTURE_MASTER_BLACK_GANMMA = 65;
        const TXT_IMAGE_ADJUST_PICTURE_R_BLACK_GANMMA = 66;
        const TXT_IMAGE_ADJUST_PICTURE_B_BLACK_GANMMA = 67;
        const TXT_IMAGE_ADJUST_PICTURE_KNEE = 68;
        const TXT_IMAGE_ADJUST_PICTURE_KNEE_SW = 69;
        const TXT_IMAGE_ADJUST_PICTURE_KNEE_POINT = 70;
        const TXT_IMAGE_ADJUST_PICTURE_KNEE_SLOPE = 71;
        const TXT_IMAGE_ADJUST_PICTURE_SDR_CONVERT = 72;
        const TXT_IMAGE_ADJUST_PICTURE_GAIN = 73;
        const TXT_IMAGE_ADJUST_PICTURE_POINT = 74;
        const TXT_IMAGE_ADJUST_PICTURE_SLOPE = 75;
        const TXT_IMAGE_ADJUST_PICTURE_BLACK_OFFSET = 76;

        let sliderPictureWBalVar;
        let sliderPictureAtwTargetR;
        let sliderPictureATWTargetB;
        let sliderPictureShocklessWbSwSpeed;
        let sliderPictureMasterPendestal;
        let sliderPictureRPendestal;
        let sliderPictureGPendestal;
        let sliderPictureBPendestal;
        let sliderPictureChromaLevel;
        let sliderPictureColorTempAch;
        let sliderPictureRGainAch;
        let sliderPictureGGainAch;
        let sliderPictureBGainAch;
        let sliderPictureColorTempBch;
        let sliderPictureRGainBch;
        let sliderPictureGGainBch;
        let sliderPictureBGainBch;
        let sliderPicturePresetRGain;
        let sliderPicturePresetGGain
        let sliderPicturePresetBGain
        let sliderPicturePresetRGainAch;
        let sliderPicturePresetGGainAch;
        let sliderPicturePresetBGainAch;
        let sliderPicturePresetRGainBch;
        let sliderPicturePresetGGainBch;
        let sliderPicturePresetBGainbch;
        let sliderPictureMasterFlare;
        let sliderPictureRFlare;
        let sliderPictureGFlare;
        let sliderPictureBFlare;
        let sliderPictureDnrLevel;
        let sliderPictureVLogPaintColorTempAch;
        let sliderPictureVLogPaintRGainAch;
        let sliderPictureVLogPaintGGainAch;
        let sliderPictureVLogPaintBGainAch;
        let sliderPictureVLogPaintColorTempBch;
        let sliderPictureVLogPaintRGainBch;
        let sliderPictureVLogPaintGGainBch;
        let sliderPictureVLogPaintBGainBch;
        let sliderPictureVLogPaintDnrLevel;
        let sliderPictureMasterBlackGamma;
        let sliderPictureRBlackGamma;
        let sliderPictureBBlackGamma;
        let sliderPictureKneePoint;
        let sliderPictureKneeSlope;
        let sliderPictureGain;
        let sliderPicturePoint;
        let sliderPictureSlope;
        let sliderPictureBlackOffset;

        //2019/1/16 add
        let sliderPictureGAxis;
        let sliderPiletctureSettingBGain;
        let sliderPictureSettingRGain;
        let sliderPictureColorTemperatureSetting;
        //

        let txtPictureObject = [];

        let atwRadioButtonGroup;
        let whiteBalanceModeRadioButtonGroup;
        let atwSpeedRadioButtonGroup;
        let ShocklessWbSwRadioButtonGroup;
        let gGainRelControlSwitchRadioButtonGroup;
        let gainOffsetAchRadioButtonGroup;
        let gainOffsetBchRadioButtonGroup;
        let flareRadioButtonGroup;
        let dnrSwRadioButtonGroup;
        let vLogPaintDnrSwRadioButtonGroup;
        let hlgModeRadioButtonGroup;
        let sdrConvertModeRadioButtonGroup;
        let blackGammaSwRadioButtonGroup
        let kneeSwRadioButtonGroup;
        let shocklessWbSwRadioButtonGroup;
        let pictureChromaLevelSwitchRadioButtonGroup;


        let selectImageAdjustPictureGammaMode;

        let imageAdjust_picture_ABB_execute_button;
        let myScroll = null;
        let buildScrollSuccessFlg = true;
        function buildSettingPicture() {
            if (myScroll != null) {
                myScroll.destroy();
                myScroll = null;
            }
            if (!buildFlag_settingPicture) {
                buildFlag_settingPicture = true; //TODO Picture

                $("#wb_bal_title").html(NPTZ_WORDING.wID_0763);
                //ATW whiteBalanceModeRadioButtonGroup
                txtPictureObject[TXT_IMAGE_ADJUST_PICTURE_ATW] = TextCtrl('wb_bal_setting_area', 'setup_imageAdjust_picture_atw_label', NPTZ_WORDING.wID_0764);
                atwRadioButtonGroup = RadioButtonGroupCtrl("wb_bal_setting_area", "setup_imageAdjust_picture_atw_", RADIO_GROUP.rID_0016, getATW(), callbackATW);

                LineCtrl('setup_imageAdjust_detail_picture_main_scroll_div', 'vertical', 60, 37, 580, "setup_imageAdjust_picture_whiteBalanceMode_label");
                LineCtrl('setup_imageAdjust_detail_picture_main_scroll_div', 'horizontal', 113, 54, 700, "setup_imageAdjust_picture_whiteBalanceMode_");

                //white balance Mode AWB Execute label
                txtPictureObject[TXT_IMAGE_ADJUST_PICTURE_WHITE_BALANCE_MODE] = TextCtrl('wb_bal_setting_area', 'setup_imageAdjust_picture_white_balance_mode_label', NPTZ_WORDING.wID_0765);
                whiteBalanceModeRadioButtonGroup = RadioButtonGroupCtrl("wb_bal_setting_area", "setup_imageAdjust_picture_white_balance_Mode_", RADIO_GROUP.rID_0098, getWhiteBalanceMode(), callbackWhiteBalanceMode);

                LineCtrl('setup_imageAdjust_detail_picture_main_scroll_div', 'horizontal', 181, 74, 700, "setup_imageAdjust_picture_AWB_execute_label", "88");

                //W.Bal Var
                txtPictureObject[TXT_IMAGE_ADJUST_PICTURE_W_BAL_VAR] = TextCtrl('wb_bal_setting_area', 'setup_imageAdjust_picture_w_bal_var_label', NPTZ_WORDING.wID_0766);
                // W.Bal Var slider
                sliderPictureWBalVar = SliderCtrl('wb_bal_setting_area', 'setup_imageAdjust_picture_w_bal_var_slider', null, null, getWBalVar(), callbackWBalVar, "K", '', '', '', sysConst.getColorTemperatureItems());
                LineCtrl('setup_imageAdjust_detail_picture_main_scroll_div', 'horizontal', 249, 74, 700, "setup_imageAdjust_picture_colorTemperature_label", "88");

                // ATW Speed
                txtPictureObject[TXT_IMAGE_ADJUST_PICTURE_ATW_SPEED] = TextCtrl('wb_bal_setting_area', 'setup_imageAdjust_picture_ATW_speed_label', NPTZ_WORDING.wID_0279);
                // ATW Speed radioButtonItems
                atwSpeedRadioButtonGroup = RadioButtonGroupCtrl("wb_bal_setting_area", "setup_imageAdjust_picture_ATW_speed_", RADIO_GROUP.rID_0039, getATWSpeedValue(), callbackATWSpeed);
                LineCtrl('setup_imageAdjust_detail_picture_main_scroll_div', 'horizontal', 315, 74, 700, "setup_imageAdjust_picture_R_Gain_label", "88");

                // ATW Target R label
                txtPictureObject[TXT_IMAGE_ADJUST_PICTURE_ATW_TARGET_R] = TextCtrl('wb_bal_setting_area', 'setup_imageAdjust_picture_atw_target_R_label', NPTZ_WORDING.wID_0768);
                // B Gain slider
                sliderPictureAtwTargetR = SliderCtrl('wb_bal_setting_area', 'setup_imageAdjust_picture_atw_target_R_slider', 10, -10, getATWTargetR(), callbackATWTargetR);
                LineCtrl('setup_imageAdjust_detail_picture_main_scroll_div', 'horizontal', 383, 74, 700, "setup_imageAdjust_picture_B_Gain_label", "88");

                // ATW Target B label
                txtPictureObject[TXT_IMAGE_ADJUST_PICTURE_ATW_TARGET_B] = TextCtrl('wb_bal_setting_area', 'setup_imageAdjust_picture_ATW_targetB_label', NPTZ_WORDING.wID_0769);
                // ATW Target B slider
                sliderPictureATWTargetB = SliderCtrl('wb_bal_setting_area', 'setup_imageAdjust_picture_ATW_targetB_slider', 10, -10, getATWTargetBValue(), callbackATWTargetB);
                // LineCtrl('setup_imageAdjust_detail_picture_main_scroll_div', 'horizontal', 383, 74, 700, "setup_imageAdjust_picture_B_Gain_label", "88");
                LineCtrl('setup_imageAdjust_detail_picture_main_scroll_div', 'horizontal', 383, 54, 700, "setup_imageAdjust_picture_ATW_targetB_label", "90.5");

                //SHOCKLESS WB SW Label
                txtPictureObject[TXT_IMAGE_ADJUST_PICTURE_SHOCKLESS_WB_SW] = TextCtrl('wb_bal_setting_area', 'setup_imageAdjust_picture_shockless_wb_sw_label', NPTZ_WORDING.wID_0770);
                //SHOCKLESS WB SW RadioButton
                shocklessWbSwRadioButtonGroup = RadioButtonGroupCtrl("wb_bal_setting_area", "setup_imageAdjust_picture_shockless_wb_sw_", RADIO_GROUP.rID_0016, getShocklessWbSw(), callbackShocklessWbSw);
                LineCtrl('setup_imageAdjust_detail_picture_main_scroll_div', 'horizontal', 249, 54, 700, "setup_imageAdjust_picture_colorTemperatureSetting_label", "90.5");

                // SHOCKLESS WB SW SPEED Label 
                txtPictureObject[txt_image_adjust_picture_SHOCKLESS_WB_SW_SPEED] = TextCtrl('wb_bal_setting_area', 'setup_imageAdjust_picture_shockless_wb_sw_speed_label', NPTZ_WORDING.wID_0771);
                // SHOCKLESS WB SW SPEED slider
                sliderPictureShocklessWbSwSpeed = SliderCtrl('wb_bal_setting_area', 'setup_imageAdjust_picture_shockless_wb_sw_speed_slider', 5, 1, getShocklessWbSwSpeed(), callbackShocklessWbSwSpeed);
                LineCtrl('setup_imageAdjust_detail_picture_main_scroll_div', 'horizontal', 315, 54, 700, "setup_imageAdjust_picture_Setting_R_Gain_label", "90.5");

                $("#pedestal_title").html(NPTZ_WORDING.wID_0772);
                LineCtrl('setup_imageAdjust_detail_picture_main_scroll_div', 'vertical', 60, 37, 580, "setup_imageAdjust_picture_whiteBalanceMode_label1");

                // MASTER PENDESTAL label
                txtPictureObject[TXT_IMAGE_ADJUST_PICTURE_MASTER_PENDESTAL] = TextCtrl('pedestal_setting_area', 'setup_imageAdjust_master_pendestal_label', NPTZ_WORDING.wID_0773);
                // MASTER PENDESTAL slider
                sliderPictureMasterPendestal = SliderCtrl('pedestal_setting_area', 'setup_imageAdjust_picture_master_pendestal_slider', 200, -200, getMasterPedestalValue(), callbackMasterPedestal);
                LineCtrl('setup_imageAdjust_detail_picture_main_scroll_div', 'horizontal', 315, 54, 700, "setup_imageAdjust_picture_Setting_B_Gain_label", "90.5");

                // R PENDESTAL Label
                txtPictureObject[TXT_IMAGE_ADJUST_PICTURE_R_PENDESTAL] = TextCtrl('pedestal_setting_area', 'setup_imageAdjust_picture_r_pendestal_label', NPTZ_WORDING.wID_0774);
                // R PENDESTAL slider
                sliderPictureRPendestal = SliderCtrl('pedestal_setting_area', 'setup_imageAdjust_picture_r_pendestal_slider', 800, -800, getRPedestalValue(), callbackRPedestal);
                //LineCtrl('setup_imageAdjust_detail_picture_main_scroll_div', 'horizontal', 383, 54, 700, "setup_imageAdjust_picture_r_pendestal_label", "90.5");

                // G PENDESTAL Label
                txtPictureObject[TXT_IMAGE_ADJUST_PICTURE_G_PENDESTAL] = TextCtrl('pedestal_setting_area', 'setup_imageAdjust_picture_g_pendestal_label', NPTZ_WORDING.wID_0853);
                // G PENDESTAL slider
                sliderPictureGPendestal = SliderCtrl('pedestal_setting_area', 'setup_imageAdjust_picture_g_pendestal_slider', 800, -800, getGPedestalValue(), callbackGPedestal);
                LineCtrl('setup_imageAdjust_detail_picture_main_scroll_div', 'horizontal', 383, 54, 700, "setup_imageAdjust_picture_g_pendestal_label", "90.5");

                // B PENDESTAL Label
                txtPictureObject[TXT_IMAGE_ADJUST_PICTURE_B_PENDESTAL] = TextCtrl('pedestal_setting_area', 'setup_imageAdjust_picture_b_pendestal_label', NPTZ_WORDING.wID_0854);
                // B PENDESTAL slider
                sliderPictureBPendestal = SliderCtrl('pedestal_setting_area', 'setup_imageAdjust_picture_b_pendestal_slider', 800, -800, getBPedestalValue(), callbackBPedestal);
                LineCtrl('setup_imageAdjust_detail_picture_main_scroll_div', 'horizontal', 383, 54, 700, "setup_imageAdjust_picture_b_pendestal_label", "90.5");

                // PENDESTAL OFFSET label
                txtPictureObject[TXT_IMAGE_ADJUST_PICTURE_PENDESTAL_OFFSET] = TextCtrl('pedestal_setting_area', 'setup_imageAdjust_picture_pendestal_offest_label', NPTZ_WORDING.wID_0775);
                // PENDESTAL OFFSET radioButtonItems
                pendestalOffsetRadioButtonGroup = RadioButtonGroupCtrl("pedestal_setting_area", "setup_imageAdjust_picture_pendestal_offest_", RADIO_GROUP.rID_0016, getPedestalOffsetValue(), callbackPedestalOffset);
                LineCtrl('setup_imageAdjust_detail_picture_main_scroll_div', 'horizontal', 451, 54, 700, "setup_imageAdjust_picture_pendestal_offest_label", "90.5");
                LineCtrl('setup_imageAdjust_detail_picture_main_scroll_div', 'horizontal', 451, 54, 700, "setup_imageAdjust_picture_ATW_targetA_label", "90.5");

                //Chrome Title
                $("#chroma_title").html(NPTZ_WORDING.wID_0776);
                LineCtrl('setup_imageAdjust_detail_picture_main_scroll_div', 'vertical', 60, 37, 580, "setup_imageAdjust_picture_chroma_vertical_label");

                // Chroma Level Switch label
                txtPictureObject[TXT_IMAGE_ADJUST_PICTURE_CHROMA_LEVEL_SWITCH] = TextCtrl('chroma_setting_area', 'setup_imageAdjust_picture_chroma_level_switch_label', NPTZ_WORDING.wID_0777);
                // Chroma Level Switch slider
                pictureChromaLevelSwitchRadioButtonGroup = RadioButtonGroupCtrl("chroma_setting_area", "setup_imageAdjust_picture_chroma_level_switch_", RADIO_GROUP.rID_0016, getChromeLevelSwitch(), callbackChromeLevelSwitch);
                LineCtrl('setup_imageAdjust_detail_picture_main_scroll_div', 'horizontal', 723, 0, 1320, "setup_imageAdjust_picture_chroma_level_switch_label", "95");

                // Chroma Level label
                txtPictureObject[TXT_IMAGE_ADJUST_PICTURE_CHROMA_LEVEL] = TextCtrl('chroma_setting_area', 'setup_imageAdjust_picture_chroma_level_label', NPTZ_WORDING.wID_0778);
                // Chroma Level slider
                sliderPictureChromaLevel = SliderCtrl('chroma_setting_area', 'setup_imageAdjust_picture_chroma_level_slider', 40, -100, getChromaLevelValue(), callbackChromaLevel, "%");
                LineCtrl('setup_imageAdjust_detail_picture_main_scroll_div', 'horizontal', 791, 0, 1320, "setup_imageAdjust_picture_chroma_level_label", "95");

                //Color Temp Title
                $("#color_temp_title").html(NPTZ_WORDING.wID_0779);
                LineCtrl('setup_imageAdjust_detail_picture_main_scroll_div', 'vertical', 907, 37, 260, "setup_imageAdjust_picture_color_temp_1_label");
                LineCtrl('setup_imageAdjust_detail_picture_main_scroll_div', 'vertical', 907, 37, 260, "setup_imageAdjust_picture_color_temp_2_label");
                LineCtrl('setup_imageAdjust_detail_picture_main_scroll_div', 'vertical', 907, 37, 260, "setup_imageAdjust_picture_color_temp_3_label");
                LineCtrl('setup_imageAdjust_detail_picture_main_scroll_div', 'vertical', 907, 37, 260, "setup_imageAdjust_picture_color_temp_4_label");

                txtPictureObject[TXT_IMAGE_ADJUST_PICTURE_COLOR_TEMP_ACH_BCH] = TextCtrl('color_temp_setting_area', 'setup_imageAdjust_picture_color_temp_ach_bch_label', NPTZ_WORDING.wID_0780);

                // Color Temp CH label
                txtPictureObject[TXT_IMAGE_ADJUST_PICTURE_COLOR_TEMP_ACH] = TextCtrl('color_temp_setting_area', 'setup_imageAdjust_picture_color_temp_ach_label', NPTZ_WORDING.wID_0781);
                //Color Temp CH slider
                sliderPictureColorTempAch = SliderCtrl('color_temp_setting_area', 'setup_imageAdjust_picture_color_temp_ach_slider', null, null, getColorTemperatureSetting(), callbackColorTemperatureSetting, "K", '', '', '', sysConst.getColorTemperatureItems());
                LineCtrl('setup_imageAdjust_detail_picture_main_scroll_div', 'horizontal', 927, 54, 1320, "setup_imageAdjust_picture_color_temp_ach_label", "90.5");
                LineCtrl('setup_imageAdjust_detail_picture_main_scroll_div', 'horizontal', 927, 54, 1320, "setup_imageAdjust_picture_color_temp_ach_label_1", "90.5");

                // R Gain label
                txtPictureObject[TXT_IMAGE_ADJUST_PICTURE_R_GAIN] = TextCtrl('color_temp_setting_area', 'setup_imageAdjust_picture_R_gain_ach_label', NPTZ_WORDING.wID_0782);
                // R Gain slider
                sliderPictureRGainAch = SliderCtrl('color_temp_setting_area', 'setup_imageAdjust_picture_R_gain_ach_slider', 400, -400, getColorRGain(), callbackColorRGain);
                // LineCtrl('setup_imageAdjust_detail_picture_main_scroll_div', 'horizontal', 995, 54, 700, "setup_imageAdjust_picture_R_gain_ach_label", "90.5");

                // G Gain label
                txtPictureObject[TXT_IMAGE_ADJUST_PICTURE_G_GAIN] = TextCtrl('color_temp_setting_area', 'setup_imageAdjust_picture_G_gain_ach_label', NPTZ_WORDING.wID_0910);
                // G Gain slider
                sliderPictureGGainAch = SliderCtrl('color_temp_setting_area', 'setup_imageAdjust_picture_G_gain_ach_slider', 400, -400, getGAxisValue(), callbackColorGAxis);
                LineCtrl('setup_imageAdjust_detail_picture_main_scroll_div', 'horizontal', 1053, 54, 700, "setup_imageAdjust_picture_G_gain_ach_label", "90.5");

                // B Gain label
                txtPictureObject[TXT_IMAGE_ADJUST_PICTURE_B_GAIN] = TextCtrl('color_temp_setting_area', 'setup_imageAdjust_picture_B_gain_ach_label', NPTZ_WORDING.wID_0783);
                // B Gain slider
                sliderPictureBGainAch = SliderCtrl('color_temp_setting_area', 'setup_imageAdjust_picture_B_gain_ach_slider', 400, -400, getColorBGainValue(), callbackColorBGain);
                LineCtrl('setup_imageAdjust_detail_picture_main_scroll_div', 'horizontal', 1121, 54, 700, "setup_imageAdjust_picture_B_gain_ach_label", "90.5");

                // Color Temp bch label
                txtPictureObject[TXT_IMAGE_ADJUST_PICTURE_COLOR_TEMP_BCH] = TextCtrl('color_temp_setting_area', 'setup_imageAdjust_picture_color_temp_bch_label', NPTZ_WORDING.wID_0785);
                // LineCtrl('setup_imageAdjust_detail_picture_main_scroll_div', 'horizontal', 1325, 54, 700, "setup_imageAdjust_picture_color_temp_bch_label_2", "90.5");
                // Color Temp bch slider
                sliderPictureColorTempBch = SliderCtrl('color_temp_setting_area', 'setup_imageAdjust_picture_color_temp_bch_slider', null, null, getColorTempBch(), callbackColorTempBch, "K", '', '', '', sysConst.getColorTemperatureItems());
                LineCtrl('setup_imageAdjust_detail_picture_main_scroll_div', 'horizontal', 927, 54, 1320, "setup_imageAdjust_picture_color_temp_ach_label_2", "90.5");

                // R Gain label
                txtPictureObject[TXT_IMAGE_ADJUST_PICTURE_R_GAIN_BCH] = TextCtrl('color_temp_setting_area', 'setup_imageAdjust_picture_R_gain_bch_label', NPTZ_WORDING.wID_0786);
                // R Gain slider
                sliderPictureRGainBch = SliderCtrl('color_temp_setting_area', 'setup_imageAdjust_picture_R_gain_bch_slider', 400, -400, getColorRGainBch(), callbackColorRGainBch);
                LineCtrl('setup_imageAdjust_detail_picture_main_scroll_div', 'horizontal', 995, 54, 700, "setup_imageAdjust_picture_R_gain_bch_label", "90.5");

                // G Gain label
                txtPictureObject[TXT_IMAGE_ADJUST_PICTURE_G_GAIN_BCH] = TextCtrl('color_temp_setting_area', 'setup_imageAdjust_picture_G_gain_bch_label', NPTZ_WORDING.wID_0911);
                // G Gain slider
                sliderPictureGGainBch = SliderCtrl('color_temp_setting_area', 'setup_imageAdjust_picture_G_gain_bch_slider', 400, -400, getColorGGainBch(), callbackColorGGainBch);
                LineCtrl('setup_imageAdjust_detail_picture_main_scroll_div', 'horizontal', 1053, 54, 700, "setup_imageAdjust_picture_G_gain_bch_label", "90.5");

                // B Gain label
                txtPictureObject[TXT_IMAGE_ADJUST_PICTURE_B_GAIN_BCH] = TextCtrl('color_temp_setting_area', 'setup_imageAdjust_picture_B_gain_bch_label', NPTZ_WORDING.wID_0787);
                // B Gain slider
                sliderPictureBGainBch = SliderCtrl('color_temp_setting_area', 'setup_imageAdjust_picture_B_gain_bch_slider', 400, -400, getColorBGainBch(), callbackColorBGainBch);
                LineCtrl('setup_imageAdjust_detail_picture_main_scroll_div', 'horizontal', 1121, 54, 700, "setup_imageAdjust_picture_B_gain_bch_label", "90.5");

                //Rgb Gain Control Setting Title 
                $("#rgb_gain_control_title").html(NPTZ_WORDING.wID_0789);
                LineCtrl('rgb_gain_control_setting_area', 'vertical', 907, 37, 260, "setup_imageAdjust_picture_rgb_gain_control_setting_1_label");
                LineCtrl('rgb_gain_control_setting_area', 'vertical', 907, 37, 260, "setup_imageAdjust_picture_rgb_gain_control_setting_2_label");
                LineCtrl('rgb_gain_control_setting_area', 'vertical', 907, 37, 260, "setup_imageAdjust_picture_rgb_gain_control_setting_3_label");
                LineCtrl('rgb_gain_control_setting_area', 'vertical', 907, 37, 260, "setup_imageAdjust_picture_rgb_gain_control_setting_4_label");
                LineCtrl('rgb_gain_control_setting_area', 'vertical', 907, 37, 260, "setup_imageAdjust_picture_rgb_gain_control_setting_5_label");

                // G GAIN REL CONTROL SWITCH label
                txtPictureObject[TXT_IMAGE_ADJUST_PICTURE_G_GAIN_REL_CONTROL_SWITCH] = TextCtrl('rgb_gain_control_setting_area', 'setup_imageAdjust_g_gain_rel_control_switch_label', NPTZ_WORDING.wID_0790);
                // G GAIN REL CONTROL SWITCH radioButtonItems
                gGainRelControlSwitchRadioButtonGroup = RadioButtonGroupCtrl("rgb_gain_control_setting_area", "setup_imageAdjust_picture_g_gain_rel_control_switch_", RADIO_GROUP.rID_0016, getgGainRelControlSwitch(), callbackgGainRelControlSwitch);
                LineCtrl('rgb_gain_control_setting_area', 'horizontal', 1869, 54, 700, "setup_imageAdjust_g_gain_rel_control_switch_label", "90.5");

                // RGB GainPreset label
                txtPictureObject[TXT_IMAGE_ADJUST_PICTURE_RGB_GAIN_PRESET] = TextCtrl('rgb_gain_control_setting_area', 'setup_imageAdjust_picture_rgb_gain_preset_label', NPTZ_WORDING.wID_0791);

                // R Gain label
                txtPictureObject[TXT_IMAGE_ADJUST_PICTURE_PRESET_R_GAIN] = TextCtrl('rgb_gain_control_setting_area', 'setup_imageAdjust_picture_preset_r_gain_label', NPTZ_WORDING.wID_0792);
                // R Gain slider
                sliderPicturePresetRGain = SliderCtrl('rgb_gain_control_setting_area', 'setup_imageAdjust_picture_preset_r_gain_slider', 1000, -1000, getColorPresetRGain(), callbackColorPresetRGain);
                LineCtrl('rgb_gain_control_setting_area', 'horizontal', 1597, 54, 700, "setup_imageAdjust_picture_preset_r_gain_label", "90.5");

                // G Gain label
                txtPictureObject[TXT_IMAGE_ADJUST_PICTURE_PRESET_G_GAIN] = TextCtrl('rgb_gain_control_setting_area', 'setup_imageAdjust_picture_preset_g_gain_label', NPTZ_WORDING.wID_0793);
                // G Gain slider
                sliderPicturePresetGGain = SliderCtrl('rgb_gain_control_setting_area', 'setup_imageAdjust_picture_preset_g_gain_slider', 1000, -1000, getColorPresetGGain(), callbackColorPresetGGain);
                LineCtrl('rgb_gain_control_setting_area', 'horizontal', 1665, 54, 700, "setup_imageAdjust_picture_preset_g_gain_label", "90.5");

                // B Gain label
                txtPictureObject[TXT_IMAGE_ADJUST_PICTURE_PRESET_B_GAIN] = TextCtrl('rgb_gain_control_setting_area', 'setup_imageAdjust_picture_preset_b_gain_label', NPTZ_WORDING.wID_0794);
                // B Gain slider
                sliderPicturePresetBGain = SliderCtrl('rgb_gain_control_setting_area', 'setup_imageAdjust_picture_preset_b_gain_slider', 1000, -1000, getColorPresetBGain(), callbackColorPresetBGain);
                LineCtrl('rgb_gain_control_setting_area', 'horizontal', 1733, 54, 700, "setup_imageAdjust_picture_preset_b_gain_label", "90.5");

                // RGB Gain Ach/Bch label
                txtPictureObject[TXT_IMAGE_ADJUST_PICTURE_PRESET_RGB_GAIN_ACH_BACH] = TextCtrl('rgb_gain_control_setting_area', 'setup_imageAdjust_picture_preset_rgb_gain_ach_bch_label', NPTZ_WORDING.wID_0795);
                LineCtrl('rgb_gain_control_setting_area', 'horizontal', 1733, 54, 700, "setup_imageAdjust_picture_preset_rgb_gain_ach_bch_label", "90.5");

                // RGB Gain Ach label
                txtPictureObject[TXT_IMAGE_ADJUST_PICTURE_PRESET_RGB_GAIN_ACH] = TextCtrl('rgb_gain_control_setting_area', 'setup_imageAdjust_picture_preset_rgb_gain_ach_label', NPTZ_WORDING.wID_0796);

                // R Gain Ach label
                txtPictureObject[TXT_IMAGE_ADJUST_PICTURE_PRESET_RGB_GAIN_ACH_R] = TextCtrl('rgb_gain_control_setting_area', 'setup_imageAdjust_picture_preset_r_gain_ach_label', NPTZ_WORDING.wID_0782);
                // R Gain Ach slider
                sliderPicturePresetRGainAch = SliderCtrl('rgb_gain_control_setting_area', 'setup_imageAdjust_picture_preset_r_gain_ach_slider', 1000, -1000, getColorPresetRGainAch(), callbackColorPresetRGainAch);
                LineCtrl('rgb_gain_control_setting_area', 'horizontal', 1597, 54, 700, "setup_imageAdjust_picture_preset_r_gain_ach_label", "90.5");

                // G Gain Ach label
                txtPictureObject[TXT_IMAGE_ADJUST_PICTURE_PRESET_RGB_GAIN_ACH_G] = TextCtrl('rgb_gain_control_setting_area', 'setup_imageAdjust_picture_preset_g_gain_ach_label', NPTZ_WORDING.wID_0784);
                // G Gain Ach slider
                sliderPicturePresetGGainAch = SliderCtrl('rgb_gain_control_setting_area', 'setup_imageAdjust_picture_preset_g_gain_ach_slider', 1000, -1000, getColorPresetGGainAch(), callbackColorPresetGGainAch);
                LineCtrl('rgb_gain_control_setting_area', 'horizontal', 1665, 54, 700, "setup_imageAdjust_picture_preset_g_gain_ach_label", "90.5");

                // B Gain Ach label
                txtPictureObject[TXT_IMAGE_ADJUST_PICTURE_PRESET_RGB_GAIN_ACH_B] = TextCtrl('rgb_gain_control_setting_area', 'setup_imageAdjust_picture_preset_b_gain_ach_label', NPTZ_WORDING.wID_0783);
                // B Gain Ach slider
                sliderPicturePresetBGainAch = SliderCtrl('rgb_gain_control_setting_area', 'setup_imageAdjust_picture_preset_b_gain_ach_slider', 1000, -1000, getColorPresetBGainAch(), callbackColorPresetBGainAch);
                LineCtrl('rgb_gain_control_setting_area', 'horizontal', 1733, 54, 700, "setup_imageAdjust_picture_preset_b_gain_ach_label", "90.5");

                // Gain Offset ach label
                txtPictureObject[TXT_IMAGE_ADJUST_PICTURE_PRESET_RGB_GAIN_ACH_OFFSET] = TextCtrl('rgb_gain_control_setting_area', 'setup_imageAdjust_picture_gain_offset_ach_label', NPTZ_WORDING.wID_0797);
                // Gain Offset ach radioButtonItems
                gainOffsetAchRadioButtonGroup = RadioButtonGroupCtrl("rgb_gain_control_setting_area", "setup_imageAdjust_picture_gain_offset_ach_", RADIO_GROUP.rID_0016, getAWBGainOffsetValue(), callbackAWBGainOffset);
                LineCtrl('rgb_gain_control_setting_area', 'horizontal', 1869, 54, 700, "setup_imageAdjust_picture_gain_offset_ach_label", "90.5");

                // RGB Gain Bch label
                txtPictureObject[TXT_IMAGE_ADJUST_PICTURE_PRESET_RGB_GAIN_BCH] = TextCtrl('rgb_gain_control_setting_area', 'setup_imageAdjust_picture_preset_rgb_gain_bch_label', NPTZ_WORDING.wID_0855);

                // R Gain Bch label
                txtPictureObject[TXT_IMAGE_ADJUST_PICTURE_PRESET_RGB_GAIN_BCH_R] = TextCtrl('rgb_gain_control_setting_area', 'setup_imageAdjust_picture_preset_r_gain_bch_label', NPTZ_WORDING.wID_0786);
                // R Gain Bch slider
                sliderPicturePresetRGainBch = SliderCtrl('rgb_gain_control_setting_area', 'setup_imageAdjust_picture_preset_r_gain_bch_slider', 1000, -1000, getColorPresetRGainBch(), callbackColorPresetRGainBch);
                LineCtrl('rgb_gain_control_setting_area', 'horizontal', 1597, 54, 700, "setup_imageAdjust_picture_preset_r_gain_bch_label", "90.5");

                // G Gain Bch label
                txtPictureObject[TXT_IMAGE_ADJUST_PICTURE_PRESET_RGB_GAIN_BCH_G] = TextCtrl('rgb_gain_control_setting_area', 'setup_imageAdjust_picture_preset_g_gain_bch_label', NPTZ_WORDING.wID_0788);
                // G Gain Bch slider
                sliderPicturePresetGGainBch = SliderCtrl('rgb_gain_control_setting_area', 'setup_imageAdjust_picture_preset_g_gain_bch_slider', 1000, -1000, getColorPresetGGainBch(), callbackColorPresetGGainBch);
                LineCtrl('rgb_gain_control_setting_area', 'horizontal', 1665, 54, 700, "setup_imageAdjust_picture_preset_g_gain_bch_label", "90.5");

                // B Gain Bch label
                txtPictureObject[TXT_IMAGE_ADJUST_PICTURE_PRESET_RGB_GAIN_BCH_B] = TextCtrl('rgb_gain_control_setting_area', 'setup_imageAdjust_picture_preset_b_gain_bch_label', NPTZ_WORDING.wID_0787);
                // B Gain Bch slider
                sliderPicturePresetBGainBch = SliderCtrl('rgb_gain_control_setting_area', 'setup_imageAdjust_picture_preset_b_gain_bch_slider', 1000, -1000, getColorPresetBGainBch(), callbackColorPresetBGainBch);
                LineCtrl('rgb_gain_control_setting_area', 'horizontal', 1733, 54, 700, "setup_imageAdjust_picture_preset_b_gain_bch_label", "90.5");

                // Gain Offset bch label
                txtPictureObject[TXT_IMAGE_ADJUST_PICTURE_PRESET_RGB_GAIN_BCH_OFFSET] = TextCtrl('rgb_gain_control_setting_area', 'setup_imageAdjust_picture_gain_offset_bch_label', NPTZ_WORDING.wID_0798);
                // Gain Offset bch radioButtonItems
                gainOffsetBchRadioButtonGroup = RadioButtonGroupCtrl("rgb_gain_control_setting_area", "setup_imageAdjust_picture_gain_offset_bch_", RADIO_GROUP.rID_0016, getGainOffsetBch(), callbackGainOffsetBch);
                LineCtrl('rgb_gain_control_setting_area', 'horizontal', 1869, 54, 700, "setup_imageAdjust_picture_gain_offset_bch_label", "90.5");

                LineCtrl('rgb_gain_control_setting_area', 'horizontal', 1869, 54, 700, "setup_imageAdjust_picture_gain_offset_bch_label_1", "90.5");
                LineCtrl('rgb_gain_control_setting_area', 'horizontal', 1869, 54, 700, "setup_imageAdjust_picture_gain_offset_bch_label_2", "90.5");
                LineCtrl('rgb_gain_control_setting_area', 'horizontal', 1869, 54, 700, "setup_imageAdjust_picture_gain_offset_bch_label_3", "90.5");


                //Flare Setting Title 
                $("#flare_title").html(NPTZ_WORDING.wID_0799);
                LineCtrl('flare_setting_area', 'vertical', 907, 37, 260, "setup_imageAdjust_picture_flare_1_label");
                LineCtrl('flare_setting_area', 'vertical', 907, 37, 260, "setup_imageAdjust_picture_flare_2_label");

                // Flare label
                txtPictureObject[TXT_IMAGE_ADJUST_PICTURE_FLARE] = TextCtrl('flare_setting_area', 'setup_imageAdjust_picture_flare_label', NPTZ_WORDING.wID_0799);
                // Flare radioButtonItems
                flareRadioButtonGroup = RadioButtonGroupCtrl("flare_setting_area", "setup_imageAdjust_picture_flare_", RADIO_GROUP.rID_0016, getFlare(), callbackFlare);
                LineCtrl('flare_setting_area', 'horizontal', 1869, 54, 700, "setup_imageAdjust_picture_flare_label", "90.5");

                // Master Flare label
                txtPictureObject[TXT_IMAGE_ADJUST_PICTURE_MASTER_FLARE] = TextCtrl('flare_setting_area', 'setup_imageAdjust_picture_master_flare_label', NPTZ_WORDING.wID_0800);
                // Master Flare slider
                sliderPictureMasterFlare = SliderCtrl('flare_setting_area', 'setup_imageAdjust_picture_master_flare_slider', 200, -200, getColorMasterFlare(), callbackColorMasterFlare);
                LineCtrl('flare_setting_area', 'horizontal', 1597, 54, 700, "setup_imageAdjust_picture_master_flare_label", "90.5");

                // R Flare label
                txtPictureObject[TXT_IMAGE_ADJUST_PICTURE_R_FLARE] = TextCtrl('flare_setting_area', 'setup_imageAdjust_picture_preset_r_flare_label', NPTZ_WORDING.wID_0801);
                // R Flare slider
                sliderPictureRFlare = SliderCtrl('flare_setting_area', 'setup_imageAdjust_picture_preset_r_flare_slider', 200, -200, getColorRFlare(), callbackColorRFlare);
                LineCtrl('flare_setting_area', 'horizontal', 1665, 54, 700, "setup_imageAdjust_picture_preset_r_flare_label", "90.5");

                // G Flare label
                txtPictureObject[TXT_IMAGE_ADJUST_PICTURE_G_FLARE] = TextCtrl('flare_setting_area', 'setup_imageAdjust_picture_preset_g_flare_label', NPTZ_WORDING.wID_0802);
                // G Flare slider
                sliderPictureGFlare = SliderCtrl('flare_setting_area', 'setup_imageAdjust_picture_preset_g_flare_slider', 200, -200, getColorGFlare(), callbackColorGFlare);
                LineCtrl('flare_setting_area', 'horizontal', 1733, 54, 700, "setup_imageAdjust_picture_preset_g_flare_label", "90.5");

                // B Flare label
                txtPictureObject[TXT_IMAGE_ADJUST_PICTURE_B_FLARE] = TextCtrl('flare_setting_area', 'setup_imageAdjust_picture_b_flare_label', NPTZ_WORDING.wID_0803);
                // B Flare slider
                sliderPictureBFlare = SliderCtrl('flare_setting_area', 'setup_imageAdjust_picture_preset_b_flare_slider', 200, -200, getColorBFlare(), callbackColorBFlare);
                LineCtrl('flare_setting_area', 'horizontal', 1733, 54, 700, "setup_imageAdjust_picture_b_flare_label", "90.5");

                //DNR Setting Title 
                $("#dnr_title").html(NPTZ_WORDING.wID_0804);
                LineCtrl('dnr_setting_area', 'vertical', 907, 37, 260, "setup_imageAdjust_picture_dnr_1_label");
                LineCtrl('dnr_setting_area', 'vertical', 907, 37, 260, "setup_imageAdjust_picture_dnr_2_label");

                // DNR Sw label
                txtPictureObject[TXT_IMAGE_ADJUST_PICTURE_DNR_SW] = TextCtrl('dnr_setting_area', 'setup_imageAdjust_dnr_sw_label', NPTZ_WORDING.wID_0805);
                // DNR Sw radioButtonItems
                dnrSwRadioButtonGroup = RadioButtonGroupCtrl("dnr_setting_area", "setup_imageAdjust_dnr_sw_", RADIO_GROUP.rID_0016, getDNRValue(), callbackDNR);
                LineCtrl('dnr_setting_area', 'horizontal', 1869, 54, 700, "setup_imageAdjust_dnr_sw_label", "90.5");

                // DNR Level label
                txtPictureObject[TXT_IMAGE_ADJUST_PICTURE_DNR_LEVEL] = TextCtrl('dnr_setting_area', 'setup_imageAdjust_dnr_level_label', NPTZ_WORDING.wID_0806);
                // DNR Level slider
                sliderPictureDnrLevel = SliderCtrl('dnr_setting_area', 'setup_imageAdjust_dnr_level_slider', 5, 1, getDnrLevel(), callbackDnrLevel);
                LineCtrl('dnr_setting_area', 'horizontal', 1597, 54, 700, "setup_imageAdjust_dnr_level_label", "90.5");

                //V-log Paint
                $("#v_log_paint_title").html(NPTZ_WORDING.wID_0863);
                LineCtrl('v_log_paint_setting_area', 'vertical', 907, 37, 260, "setup_imageAdjust_picture_v_log_paint_1_label");
                LineCtrl('v_log_paint_setting_area', 'vertical', 907, 37, 260, "setup_imageAdjust_picture_v_log_paint_2_label");
                LineCtrl('v_log_paint_setting_area', 'vertical', 907, 37, 260, "setup_imageAdjust_picture_v_log_paint_3_label");
                LineCtrl('v_log_paint_setting_area', 'vertical', 907, 37, 260, "setup_imageAdjust_picture_v_log_paint_4_label");
                LineCtrl('v_log_paint_setting_area', 'vertical', 907, 37, 260, "setup_imageAdjust_picture_v_log_paint_5_label");
                LineCtrl('v_log_paint_setting_area', 'vertical', 907, 37, 260, "setup_imageAdjust_picture_v_log_paint_6_label");
                LineCtrl('v_log_paint_setting_area', 'vertical', 907, 37, 260, "setup_imageAdjust_picture_v_log_paint_7_label");

                txtPictureObject[TXT_IMAGE_ADJUST_PICTURE_V_VLOG_PAINT_COLOR_TEMP_ACH_BCH] = TextCtrl('v_log_paint_setting_area', 'setup_imageAdjust_picture_color_temp_ach_bch_label', NPTZ_WORDING.wID_0780);

                // Color Temp CH label
                txtPictureObject[TXT_IMAGE_ADJUST_PICTURE_V_VLOG_PAINT_COLOR_TEMP_ACH] = TextCtrl('v_log_paint_setting_area', 'setup_imageAdjust_picture_color_temp_ach_label', NPTZ_WORDING.wID_0781);
                //Color Temp CH slider
                sliderPictureVLogPaintColorTempAch = SliderCtrl('v_log_paint_setting_area', 'setup_imageAdjust_picture_color_temp_ach_slider', 200, -200, getMasterPedestalValue(), callbackMasterPedestal);
                LineCtrl('v_log_paint_setting_area', 'horizontal', 927, 54, 1320, "setup_imageAdjust_picture_v_log_paint_color_temp_ach_label", "90.5");
                LineCtrl('v_log_paint_setting_area', 'horizontal', 927, 54, 1320, "setup_imageAdjust_picture_v_log_paint_color_temp_ach_label_1", "90.5");

                // R Gain label
                txtPictureObject[TXT_IMAGE_ADJUST_PICTURE_V_VLOG_PAINT_R_GAIN] = TextCtrl('v_log_paint_setting_area', 'setup_imageAdjust_picture_R_gain_ach_label', NPTZ_WORDING.wID_0782);
                // R Gain slider
                sliderPictureVLogPaintRGainAch = SliderCtrl('v_log_paint_setting_area', 'setup_imageAdjust_picture_R_gain_ach_slider', 100, -100, getRPedestalValue(), callbackRPedestal);
                LineCtrl('v_log_paint_setting_area', 'horizontal', 995, 54, 700, "setup_imageAdjust_picture_v_log_paint_R_gain_ach_label", "90.5");

                // G Gain label
                txtPictureObject[TXT_IMAGE_ADJUST_PICTURE_V_VLOG_PAINT_G_GAIN] = TextCtrl('v_log_paint_setting_area', 'setup_imageAdjust_picture_G_gain_ach_label', NPTZ_WORDING.wID_0783);
                // G Gain slider
                sliderPictureVLogPaintGGainAch = SliderCtrl('v_log_paint_setting_area', 'setup_imageAdjust_picture_G_gain_ach_slider', 100, -100, getGPedestalValue(), callbackGPedestal);
                LineCtrl('v_log_paint_setting_area', 'horizontal', 1053, 54, 700, "setup_imageAdjust_picture_v_log_paint_G_gain_ach_label", "90.5");

                // B Gain label
                txtPictureObject[TXT_IMAGE_ADJUST_PICTURE_V_VLOG_PAINT_B_GAIN] = TextCtrl('v_log_paint_setting_area', 'setup_imageAdjust_picture_B_gain_ach_label', NPTZ_WORDING.wID_0784);
                // B Gain slider
                sliderPictureVLogPaintBGainAch = SliderCtrl('v_log_paint_setting_area', 'setup_imageAdjust_picture_B_gain_ach_slider', 100, -100, getBPedestalValue(), callbackBPedestal);
                LineCtrl('v_log_paint_setting_area', 'horizontal', 1121, 54, 700, "setup_imageAdjust_picture_v_log_paint_B_gain_ach_label", "90.5");

                // Color Temp bch label
                txtPictureObject[TXT_IMAGE_ADJUST_PICTURE_V_VLOG_PAINT_COLOR_TEMP_BCH] = TextCtrl('v_log_paint_setting_area', 'setup_imageAdjust_picture_color_temp_bch_label', NPTZ_WORDING.wID_0785);
                // Color Temp bch slider
                sliderPictureVLogPaintColorTempBch = SliderCtrl('v_log_paint_setting_area', 'setup_imageAdjust_picture_color_temp_bch_slider', 31, -31, getMasterDetailValue(), callbackMasterDetail);
                LineCtrl('v_log_paint_setting_area', 'horizontal', 1325, 54, 700, "setup_imageAdjust_picture_v_log_paint_color_temp_bch_label", "90.5");

                // R Gain label
                txtPictureObject[TXT_IMAGE_ADJUST_PICTURE_V_VLOG_PAINT_R_GAIN_BCH] = TextCtrl('v_log_paint_setting_area', 'setup_imageAdjust_picture_R_gain_bch_label', NPTZ_WORDING.wID_0786);
                // R Gain slider
                sliderPictureVLogPaintRGainBch = SliderCtrl('v_log_paint_setting_area', 'setup_imageAdjust_picture_R_gain_bch_slider', 100, -100, getRPedestalValue(), callbackRPedestal);
                LineCtrl('v_log_paint_setting_area', 'horizontal', 995, 54, 700, "setup_imageAdjust_picture_v_log_paint_R_gain_bch_label", "90.5");

                // G Gain label
                txtPictureObject[TXT_IMAGE_ADJUST_PICTURE_V_VLOG_PAINT_G_GAIN_BCH] = TextCtrl('v_log_paint_setting_area', 'setup_imageAdjust_picture_G_gain_bch_label', NPTZ_WORDING.wID_0787);
                // G Gain slider
                sliderPictureVLogPaintGGainBch = SliderCtrl('v_log_paint_setting_area', 'setup_imageAdjust_picture_G_gain_bch_slider', 100, -100, getGPedestalValue(), callbackGPedestal);
                LineCtrl('v_log_paint_setting_area', 'horizontal', 1053, 54, 700, "setup_imageAdjust_picture_v_log_paint_G_gain_bch_label", "90.5");

                // B Gain label
                txtPictureObject[TXT_IMAGE_ADJUST_PICTURE_V_VLOG_PAINT_B_GAIN_BCH] = TextCtrl('v_log_paint_setting_area', 'setup_imageAdjust_picture_B_gain_bch_label', NPTZ_WORDING.wID_0788);
                // B Gain slider
                sliderPictureVLogPaintBGainBch = SliderCtrl('v_log_paint_setting_area', 'setup_imageAdjust_picture_B_gain_bch_slider', 100, -100, getBPedestalValue(), callbackBPedestal);
                LineCtrl('v_log_paint_setting_area', 'horizontal', 1121, 54, 700, "setup_imageAdjust_picture_v_log_paint_B_gain_bch_label", "90.5");

                txtPictureObject[TXT_IMAGE_ADJUST_PICTURE_V_VLOG_PAINT_DNR] = TextCtrl('v_log_paint_setting_area', 'setup_imageAdjust_v_log_paint_dnr_label', NPTZ_WORDING.wID_0804);
                LineCtrl('v_log_paint_setting_area', 'horizontal', 1869, 54, 700, "setup_imageAdjust_v_log_paint_dnr_label", "90.5");

                // DNR Sw label
                txtPictureObject[TXT_IMAGE_ADJUST_PICTURE_V_VLOG_PAINT_DNR_SW] = TextCtrl('v_log_paint_setting_area', 'setup_imageAdjust_v_log_paint_dnr_sw_label', NPTZ_WORDING.wID_0805);
                // DNR Sw radioButtonItems
                vLogPaintDnrSwRadioButtonGroup = RadioButtonGroupCtrl("v_log_paint_setting_area", "setup_imageAdjust_v_log_paint_dnr_sw_", RADIO_GROUP.rID_0016, getSkinDetailValue(), callbackSkinDetail);
                LineCtrl('v_log_paint_setting_area', 'horizontal', 1869, 54, 700, "setup_imageAdjust_v_log_paint_dnr_sw_label", "90.5");

                // DNR Level label
                txtPictureObject[TXT_IMAGE_ADJUST_PICTURE_V_VLOG_PAINT_DNR_LEVEL] = TextCtrl('v_log_paint_setting_area', 'setup_imageAdjust_v_log_paint_dnr_level_label', NPTZ_WORDING.wID_0806);
                // DNR Level slider
                sliderPictureVLogPaintDnrLevel = SliderCtrl('v_log_paint_setting_area', 'setup_imageAdjust_v_log_paint_dnr_level_slider', 7, -7, getLevelDependValue(), callbackLevelDepend);
                LineCtrl('v_log_paint_setting_area', 'horizontal', 1597, 54, 700, "setup_imageAdjust_v_log_paint_dnr_level_label", "90.5");

                //HDR Paint
                $("#hdr_paint_title").html(NPTZ_WORDING.wID_0807);
                LineCtrl('hdr_paint_setting_area', 'vertical', 907, 37, 260, "setup_imageAdjust_picture_hdr_paint_1_label");
                LineCtrl('hdr_paint_setting_area', 'vertical', 907, 37, 260, "setup_imageAdjust_picture_hdr_paint_2_label");
                LineCtrl('hdr_paint_setting_area', 'vertical', 907, 37, 260, "setup_imageAdjust_picture_hdr_paint_3_label");
                LineCtrl('hdr_paint_setting_area', 'vertical', 907, 37, 260, "setup_imageAdjust_picture_hdr_paint_4_label");
                LineCtrl('hdr_paint_setting_area', 'vertical', 907, 37, 260, "setup_imageAdjust_picture_hdr_paint_5_label");
                LineCtrl('hdr_paint_setting_area', 'vertical', 907, 37, 260, "setup_imageAdjust_picture_hdr_paint_6_label");

                // HLG mode label
                txtPictureObject[TXT_IMAGE_ADJUST_PICTURE_HLG_MODE] = TextCtrl('hdr_paint_setting_area', 'setup_imageAdjust_picture_hlg_mode_label', NPTZ_WORDING.wID_0808);
                // HLG mode radioButtonItems
                hlgModeRadioButtonGroup = RadioButtonGroupCtrl("hdr_paint_setting_area", "setup_imageAdjust_picture_hlg_mode_", RADIO_GROUP.rID_0103, getHlgMode(), callbackHlgMode);
                LineCtrl('hdr_paint_setting_area', 'horizontal', 1869, 54, 700, "setup_imageAdjust_picture_hlg_mode_label", "90.5");

                // SDR Covnert Mode label
                txtPictureObject[TXT_IMAGE_ADJUST_PICTURE_SDR_CONVERT_MODE] = TextCtrl('hdr_paint_setting_area', 'setup_imageAdjust_picture_sdr_convert_mode_label', NPTZ_WORDING.wID_0809);
                // SDR Covnert Mode radioButtonItems
                sdrConvertModeRadioButtonGroup = RadioButtonGroupCtrl("hdr_paint_setting_area", "setup_imageAdjust_picture_sdr_convert_mode_", RADIO_GROUP.rID_0103, getSdrConvertMode(), callbackSdrConvertMode);
                LineCtrl('hdr_paint_setting_area', 'horizontal', 1869, 54, 700, "setup_imageAdjust_picture_sdr_convert_mode_label", "90.5");

                //Gamma/Black Ganmma
                txtPictureObject[TXT_IMAGE_ADJUST_PICTURE_GAMMA_BLACK_GANMMA] = TextCtrl('hdr_paint_setting_area', 'setup_imageAdjust_picture_gamma_black_ganmma_label', NPTZ_WORDING.wID_0810);
                LineCtrl('hdr_paint_setting_area', 'horizontal', 927, 54, 1320, "setup_imageAdjust_picture_gamma_black_ganmma_label", "90.5");

                // Black Gamma sw label
                txtPictureObject[TXT_IMAGE_ADJUST_PICTURE_GAMMA_BLACK_GANMMA_SW] = TextCtrl('hdr_paint_setting_area', 'setup_imageAdjust_picture_gamma_black_sw_label', NPTZ_WORDING.wID_0811);
                //Black Gamma sw Raddiobutton
                blackGammaSwRadioButtonGroup = RadioButtonGroupCtrl("hdr_paint_setting_area", "setup_imageAdjust_picture_gamma_black_sw_", RADIO_GROUP.rID_0016, getBlackGammaSw(), callbackBlackGammaSw);
                LineCtrl('hdr_paint_setting_area', 'horizontal', 927, 54, 1320, "setup_imageAdjust_picture_gamma_black_sw_label", "90.5");

                // Master black gamma label
                txtPictureObject[TXT_IMAGE_ADJUST_PICTURE_MASTER_BLACK_GANMMA] = TextCtrl('hdr_paint_setting_area', 'setup_imageAdjust_picture_master_black_gamme_label', NPTZ_WORDING.wID_0812);
                // Master black gamma slider
                sliderPictureMasterBlackGamma = SliderCtrl('hdr_paint_setting_area', 'setup_imageAdjust_picture_master_black_gamme_slider', 32, -32, getMasterBlackGamma(), callbackMasterBlackGamma);
                LineCtrl('hdr_paint_setting_area', 'horizontal', 995, 54, 700, "setup_imageAdjust_picture_master_black_gamme_label", "90.5");

                // R black gamma label
                txtPictureObject[TXT_IMAGE_ADJUST_PICTURE_R_BLACK_GANMMA] = TextCtrl('hdr_paint_setting_area', 'setup_imageAdjust_picture_R_black_gamme_label', NPTZ_WORDING.wID_0813);
                // R black gamma slider
                sliderPictureRBlackGamma = SliderCtrl('hdr_paint_setting_area', 'setup_imageAdjust_picture_R_black_gamme_slider', 32, -32, getRBlackGamma(), callbackRBlackGamma);
                LineCtrl('hdr_paint_setting_area', 'horizontal', 1053, 54, 700, "setup_imageAdjust_picture_R_black_gamme_label", "90.5");

                // B blakc gamma label
                txtPictureObject[TXT_IMAGE_ADJUST_PICTURE_B_BLACK_GANMMA] = TextCtrl('hdr_paint_setting_area', 'setup_imageAdjust_picture_B_black_gamme_label', NPTZ_WORDING.wID_0814);
                // B black gamma slider
                sliderPictureBBlackGamma = SliderCtrl('hdr_paint_setting_area', 'setup_imageAdjust_picture_B_black_gamme_slider', 32, -32, getBBlackGamma(), callbackBBlackGamma);
                LineCtrl('hdr_paint_setting_area', 'horizontal', 1121, 54, 700, "setup_imageAdjust_picture_B_black_gamme_label", "90.5");

                //KNEE
                txtPictureObject[TXT_IMAGE_ADJUST_PICTURE_KNEE] = TextCtrl('hdr_paint_setting_area', 'setup_imageAdjust_picture_knee_label', NPTZ_WORDING.wID_0815);
                LineCtrl('hdr_paint_setting_area', 'horizontal', 927, 54, 1320, "setup_imageAdjust_picture_knee_label", "90.5");

                // Knee sw label
                txtPictureObject[TXT_IMAGE_ADJUST_PICTURE_KNEE_SW] = TextCtrl('hdr_paint_setting_area', 'setup_imageAdjust_picture_knee_sw_label', NPTZ_WORDING.wID_0816);
                // Knee sw Raddiobutton
                kneeSwRadioButtonGroup = RadioButtonGroupCtrl("hdr_paint_setting_area", "setup_imageAdjust_picture_knee_sw_", RADIO_GROUP.rID_0016, getHLGKneeModeValue(), callbackHLGKneeMode);
                LineCtrl('hdr_paint_setting_area', 'horizontal', 927, 54, 1320, "setup_imageAdjust_picture_knee_sw_label", "90.5");

                // Knee Point label
                txtPictureObject[TXT_IMAGE_ADJUST_PICTURE_KNEE_POINT] = TextCtrl('hdr_paint_setting_area', 'setup_imageAdjust_picture_knee_point_label', NPTZ_WORDING.wID_0817);
                // Knee Point slider
                sliderPictureKneePoint = SliderCtrl('hdr_paint_setting_area', 'setup_imageAdjust_picture_knee_point_slider', 100, 60, getHLGKneePointValue(), callbackHLGKneePoint, '', null, null, 0.25, null, 100);
                LineCtrl('hdr_paint_setting_area', 'horizontal', 995, 54, 700, "setup_imageAdjust_picture_knee_point_label", "90.5");

                // KNEE Slope label
                txtPictureObject[TXT_IMAGE_ADJUST_PICTURE_KNEE_SLOPE] = TextCtrl('hdr_paint_setting_area', 'setup_imageAdjust_picture_knee_slope_label', NPTZ_WORDING.wID_0818);
                // KNEE Slope slider
                sliderPictureKneeSlope = SliderCtrl('hdr_paint_setting_area', 'setup_imageAdjust_picture_knee_slope_slider', 199, 0, getHLGKneeSlopeValue(), callbackHLGKneeSlope);
                LineCtrl('hdr_paint_setting_area', 'horizontal', 995, 54, 700, "setup_imageAdjust_picture_knee_slope_label", "90.5");

                //SDR Convert
                txtPictureObject[TXT_IMAGE_ADJUST_PICTURE_SDR_CONVERT] = TextCtrl('hdr_paint_setting_area', 'setup_imageAdjust_picture_sdr_convert_label', NPTZ_WORDING.wID_0819);
                LineCtrl('hdr_paint_setting_area', 'horizontal', 927, 54, 1320, "setup_imageAdjust_picture_sdr_convert_label", "90.5");

                // Gain label
                txtPictureObject[TXT_IMAGE_ADJUST_PICTURE_GAIN] = TextCtrl('hdr_paint_setting_area', 'setup_imageAdjust_picture_gain_label', NPTZ_WORDING.wID_0820);
                // Gain slider
                sliderPictureGain = SliderCtrl('hdr_paint_setting_area', 'setup_imageAdjust_picture_gain_slider', null, null, getPictureGain(), callbackPictureGain, "db", '', '', '', sysConst.getSdrGainTemperature());
                LineCtrl('hdr_paint_setting_area', 'horizontal', 995, 54, 700, "setup_imageAdjust_picture_gain_label", "90.5");

                // Point label
                txtPictureObject[TXT_IMAGE_ADJUST_PICTURE_POINT] = TextCtrl('hdr_paint_setting_area', 'setup_imageAdjust_picture_point_label', NPTZ_WORDING.wID_0821);
                // Point slider
                sliderPicturePoint = SliderCtrl('hdr_paint_setting_area', 'setup_imageAdjust_picture_point_slider', 100, 0, getPicturePoint(), callbackPicturePoint);
                LineCtrl('hdr_paint_setting_area', 'horizontal', 995, 54, 700, "setup_imageAdjust_picture_point_label", "90.5");

                // Slope label
                txtPictureObject[TXT_IMAGE_ADJUST_PICTURE_SLOPE] = TextCtrl('hdr_paint_setting_area', 'setup_imageAdjust_picture_slope_label', NPTZ_WORDING.wID_0822);
                // Slope slider
                sliderPictureSlope = SliderCtrl('hdr_paint_setting_area', 'setup_imageAdjust_picture_slope_slider', 127, 0, getPictureSlope(), callbackPictureSlope);
                LineCtrl('hdr_paint_setting_area', 'horizontal', 995, 54, 700, "setup_imageAdjust_picture_slope_label", "90.5");

                // Black Offset label
                txtPictureObject[TXT_IMAGE_ADJUST_PICTURE_BLACK_OFFSET] = TextCtrl('hdr_paint_setting_area', 'setup_imageAdjust_picture_black_offset_label', NPTZ_WORDING.wID_0823);
                // Black Offset slider
                sliderPictureBlackOffset = SliderCtrl('hdr_paint_setting_area', 'setup_imageAdjust_picture_black_offset_slider', 100, -100, getPictureBlackOffset(), callbackPictureBlackOffset);
                LineCtrl('hdr_paint_setting_area', 'horizontal', 995, 54, 700, "setup_imageAdjust_picture_black_offset_label", "90.5");


                for (var text in txtPictureObject) {
                    txtPictureObject[text].show();
                }

                // 状態制御
                pictureBtnStatusChange();
                setInterval(function () {
                    if (!$("#setup_imageAdjust_main").is(":hidden")) {
                        whiteBalanceModeRadioButtonGroup.setSelectedValue(getWhiteBalanceMode());
                        //initWhiteBalanceMode();
                    }
                }, 3000);
            } else {
                rebuild();
            }
            if (buildScrollSuccessFlg) {
                buildScrollSuccessFlg = false;
                setTimeout(function () {
                    myScroll = new IScroll('#setup_imageAdjust_detail_picture_main', {
                        preventDefault: false,
                        click: false,
                        tap: true,
                        scrollbars: true,
                        mouseWheel: true,
                        interactiveScrollbars: true,
                        shrinkScrollbars: 'scale',
                        fadeScrollbars: false,
                        useTransform: false
                    });
                    buildScrollSuccessFlg = true;
                }, 300)
            }
        }

        function getColorRGBValue() {
            setTimeout(function () {
                sliderPictureColorTempAch.setCgiValue(getColorTemperatureSetting());
            }, 1000)
            setTimeout(function () {
                sliderPictureBGainAch.setValue(getColorBGainValue());
            }, 1000)
            setTimeout(function () {
                sliderPictureRGainAch.setValue(getColorRGain());
            }, 1000)
            setTimeout(function () {
                sliderPictureGGainAch.setValue(getGAxisValue());
            }, 1000)
            setTimeout(function () {
                sliderPictureColorTempBch.setCgiValue(getColorTempBch());
            }, 1000)
            setTimeout(function () {
                sliderPictureRGainBch.setValue(getColorRGainBch());
            }, 1000)
            setTimeout(function () {
                sliderPictureGGainBch.setValue(getColorGGainBch());
            }, 1000)
            setTimeout(function () {
                sliderPictureBGainBch.setValue(getColorBGainBch());
            }, 1000)
        }

        function rebuild() {
            // 状態制御

            pictureBtnStatusChange();

            //changeDetailStatus();
        }

        function pictureBtnStatusChange() {
            atwRadioButtonGroup.setSelectedValue(getATW());
            whiteBalanceModeRadioButtonGroup.setSelectedValue(getWhiteBalanceMode());
            atwSpeedRadioButtonGroup.setSelectedValue(getATWSpeedValue());
            shocklessWbSwRadioButtonGroup.setSelectedValue(getShocklessWbSw());
            pendestalOffsetRadioButtonGroup.setSelectedValue(getPedestalOffsetValue());
            pictureChromaLevelSwitchRadioButtonGroup.setSelectedValue(getChromeLevelSwitch());
            gainOffsetAchRadioButtonGroup.setSelectedValue(getAWBGainOffsetValue());
            gainOffsetBchRadioButtonGroup.setSelectedValue(getGainOffsetBch());
            sliderPictureColorTempBch.changeRange(null, null, sysConst.getColorTemperatureItems());
            sliderPictureRGainBch.setValue(getColorRGainBch());
            sliderPictureGGainBch.setValue(getColorGGainBch());
            sliderPictureBGainBch.setValue(getColorBGainBch());
            sliderPictureWBalVar.changeRange(null, null, sysConst.getColorTemperatureItems());
            sliderPictureWBalVar.setCgiValue(getWBalVar());
            sliderPictureAtwTargetR.setValue(cparam_get_ATWTargetR());
            sliderPictureATWTargetB.setValue(getATWTargetBValue());
            sliderPictureShocklessWbSwSpeed.setValue(getShocklessWbSwSpeed());
            sliderPictureMasterPendestal.setValue(getMasterPedestalValue());
            sliderPictureRPendestal.setValue(getRPedestalValue());
            sliderPictureGPendestal.setValue(getGPedestalValue());
            sliderPictureBPendestal.setValue(getBPedestalValue());
            sliderPictureChromaLevel.setValue(getChromaLevelValue());
            sliderPictureColorTempAch.changeRange(null, null, sysConst.getColorTemperatureItems());
            // sliderPictureColorTempAch.setCgiValue(getColorTemperatureSetting());
            sliderPictureRGainAch.setValue(getColorRGain());
            sliderPictureBGainAch.setValue(getColorBGainValue());
            sliderPictureGGainAch.setValue(getGAxisValue());
            sliderPictureVLogPaintColorTempBch.setValue(getMasterDetailValue());
            sliderPictureVLogPaintRGainBch.setValue(getRPedestalValue());
            sliderPictureVLogPaintBGainBch.setValue(getBPedestalValue());
            sliderPictureVLogPaintGGainBch.setValue(getGPedestalValue());
            sliderPicturePresetRGain.setValue(getColorPresetRGain());
            sliderPicturePresetGGain.setValue(getColorPresetGGain());
            sliderPicturePresetBGain.setValue(getColorPresetBGain());
            sliderPicturePresetRGainAch.setValue(getColorPresetRGainAch());
            sliderPicturePresetGGainAch.setValue(getColorPresetGGainAch());
            sliderPicturePresetBGainAch.setValue(getColorPresetBGainAch());
            sliderPicturePresetRGainBch.setValue(getColorPresetRGainBch());
            sliderPicturePresetGGainBch.setValue(getColorPresetGGainBch());
            sliderPicturePresetBGainBch.setValue(getColorPresetBGainBch());
            sliderPictureMasterFlare.setValue(getColorMasterFlare());
            sliderPictureRFlare.setValue(getColorRFlare());
            sliderPictureGFlare.setValue(getColorGFlare());
            sliderPictureBFlare.setValue(getColorBFlare());
            sliderPictureDnrLevel.setValue(getDnrLevel());
            sliderPictureMasterBlackGamma.setValue(getMasterBlackGamma());
            sliderPictureRBlackGamma.setValue(getRBlackGamma());
            sliderPictureBBlackGamma.setValue(getBBlackGamma());
            sliderPictureKneePoint.setValue(getHLGKneePointValue());
            sliderPictureKneeSlope.setValue(getHLGKneeSlopeValue());
            sliderPictureGain.changeRange(null, null, sysConst.getSdrGainTemperature());
            sliderPictureGain.setCgiValue(getPictureGain());
            sliderPicturePoint.setValue(getPicturePoint());
            sliderPictureSlope.setValue(getPictureSlope());
            sliderPictureBlackOffset.setValue(getPictureBlackOffset());
            gGainRelControlSwitchRadioButtonGroup.setSelectedValue(getgGainRelControlSwitch());
            flareRadioButtonGroup.setSelectedValue(getFlare());
            dnrSwRadioButtonGroup.setSelectedValue(getDNRValue());
            hlgModeRadioButtonGroup.setSelectedValue(getHlgMode());
            sdrConvertModeRadioButtonGroup.setSelectedValue(getSdrConvertMode());
            blackGammaSwRadioButtonGroup.setSelectedValue(getBlackGammaSw());
            kneeSwRadioButtonGroup.setSelectedValue(getHLGKneeModeValue());
            if (getATW() == 1) {
                whiteBalanceModeRadioButtonGroup.setDisable("0,1,2,3,4");
            } else {
                whiteBalanceModeRadioButtonGroup.setEnable("0,1,2,3,4");
            }

            if (getWhiteBalanceMode() == 4 && getATW() != 1) {
                sliderPictureWBalVar.setEnable();
            } else {
                sliderPictureWBalVar.setDisable();
            }

            if (getATWSpeedValue() == 0) {
                atwSpeedRadioButtonGroup.setDisable("0,1,2");
                sliderPictureAtwTargetR.setDisable();
                sliderPictureATWTargetB.setDisable();
            } else {
                atwSpeedRadioButtonGroup.setEnable("0,1,2");
                sliderPictureAtwTargetR.setEnable();
                sliderPictureATWTargetB.setEnable();
            }

            if (cparam_get_v_log() == 1 && cparam_get_v_log_paint_sw() == 0) {
                sliderPictureMasterPendestal.setDisable();
                sliderPictureRPendestal.setDisable();
                sliderPictureGPendestal.setDisable();
                sliderPictureBPendestal.setDisable();
                pendestalOffsetRadioButtonGroup.setDisable("0, 1");
                pictureChromaLevelSwitchRadioButtonGroup.setDisable("0, 1");
                sliderPictureChromaLevel.setDisable();
                gGainRelControlSwitchRadioButtonGroup.setDisable("0, 1");
                sliderPicturePresetRGain.setDisable();
                sliderPicturePresetGGain.setDisable();
                sliderPicturePresetBGain.setDisable();
                sliderPicturePresetRGainAch.setDisable();
                sliderPicturePresetGGainAch.setDisable();
                sliderPicturePresetBGainAch.setDisable();
                gainOffsetAchRadioButtonGroup.setDisable("0, 1");
                sliderPicturePresetRGainBch.setDisable();
                sliderPicturePresetGGainBch.setDisable();
                sliderPicturePresetBGainBch.setDisable();
                gainOffsetBchRadioButtonGroup.setDisable("0, 1");
                flareRadioButtonGroup.setDisable("0, 1");
                sliderPictureMasterFlare.setDisable();
                sliderPictureRFlare.setDisable();
                sliderPictureGFlare.setDisable();
                sliderPictureBFlare.setDisable();
            } else {
                sliderPictureMasterPendestal.setEnable();
                sliderPictureRPendestal.setEnable();
                sliderPictureGPendestal.setEnable();
                sliderPictureBPendestal.setEnable();
                pendestalOffsetRadioButtonGroup.setEnable("0, 1");
                pictureChromaLevelSwitchRadioButtonGroup.setEnable("0, 1");
                if (pictureChromaLevelSwitchRadioButtonGroup.getSelectedValue() == 0) {
                    sliderPictureChromaLevel.setDisable();
                } else {
                    sliderPictureChromaLevel.setEnable();
                }

                gGainRelControlSwitchRadioButtonGroup.setEnable("0, 1");
                flareRadioButtonGroup.setEnable("0, 1");
                sliderPictureMasterFlare.setEnable();
                sliderPictureRFlare.setEnable();
                sliderPictureGFlare.setEnable();
                sliderPictureBFlare.setEnable();
                sliderPicturePresetRGainAch.setEnable();
                sliderPicturePresetGGainAch.setEnable();
                sliderPicturePresetBGainAch.setEnable();
                gainOffsetAchRadioButtonGroup.setEnable("0, 1");
                sliderPicturePresetRGainBch.setEnable();
                sliderPicturePresetGGainBch.setEnable();
                sliderPicturePresetBGainBch.setEnable();
                gainOffsetBchRadioButtonGroup.setEnable("0, 1");

                if (getWhiteBalanceMode() == 0 || getWhiteBalanceMode() == 1) {
                    sliderPicturePresetRGain.setDisable();
                    sliderPicturePresetGGain.setDisable();
                    sliderPicturePresetBGain.setDisable();
                    // sliderPicturePresetRGainAch.setDisable();
                    // sliderPicturePresetGGainAch.setDisable();
                    // sliderPicturePresetBGainAch.setDisable();
                    // gainOffsetAchRadioButtonGroup.setDisable("0, 1");
                    // sliderPicturePresetRGainBch.setDisable();
                    // sliderPicturePresetGGainBch.setDisable();
                    // sliderPicturePresetBGainBch.setDisable();
                    // gainOffsetBchRadioButtonGroup.setDisable("0, 1");
                } else {
                    sliderPicturePresetRGain.setEnable();
                    sliderPicturePresetGGain.setEnable();
                    sliderPicturePresetBGain.setEnable();
                    // sliderPicturePresetRGainAch.setEnable();
                    // sliderPicturePresetGGainAch.setEnable();
                    // sliderPicturePresetBGainAch.setEnable();
                    // gainOffsetAchRadioButtonGroup.setEnable("0, 1");
                    // sliderPicturePresetRGainBch.setEnable();
                    // sliderPicturePresetGGainBch.setEnable();
                    // sliderPicturePresetBGainBch.setEnable();
                    // gainOffsetBchRadioButtonGroup.setEnable("0, 1");
                }
                if (getFlare() == 0) {
                    sliderPictureMasterFlare.setDisable();
                    sliderPictureRFlare.setDisable();
                    sliderPictureGFlare.setDisable();
                    sliderPictureBFlare.setDisable();
                } else {
                    sliderPictureMasterFlare.setEnable();
                    sliderPictureRFlare.setEnable();
                    sliderPictureGFlare.setEnable();
                    sliderPictureBFlare.setEnable();
                }
            }

            if (cparam_get_v_log() == 1 || cparam_get_hdr() == 0) {
                hlgModeRadioButtonGroup.setDisable("0, 1");
                sdrConvertModeRadioButtonGroup.setDisable("0, 1");
                blackGammaSwRadioButtonGroup.setDisable("0, 1");
                sliderPictureMasterBlackGamma.setDisable();
                sliderPictureRBlackGamma.setDisable();
                sliderPictureBBlackGamma.setDisable();
                kneeSwRadioButtonGroup.setDisable("0, 1");
                sliderPictureKneePoint.setDisable();
                sliderPictureKneeSlope.setDisable();
                sliderPictureGain.setDisable();
                sliderPicturePoint.setDisable();
                sliderPictureSlope.setDisable();
                sliderPictureBlackOffset.setDisable();
            } else {
                hlgModeRadioButtonGroup.setEnable("0, 1");
                sdrConvertModeRadioButtonGroup.setEnable("0, 1");

                if (getHlgMode() == 0) {
                    blackGammaSwRadioButtonGroup.setDisable("0, 1");
                    sliderPictureMasterBlackGamma.setDisable();
                    sliderPictureRBlackGamma.setDisable();
                    sliderPictureBBlackGamma.setDisable();
                    kneeSwRadioButtonGroup.setDisable("0, 1");
                    sliderPictureKneePoint.setDisable();
                    sliderPictureKneeSlope.setDisable();
                } else {
                    blackGammaSwRadioButtonGroup.setEnable("0 , 1");
                    sliderPictureMasterBlackGamma.setEnable();
                    sliderPictureRBlackGamma.setEnable();
                    sliderPictureBBlackGamma.setEnable();
                    kneeSwRadioButtonGroup.setEnable("0, 1");
                    sliderPictureKneePoint.setEnable();
                    sliderPictureKneeSlope.setEnable();
                }
                if (getSdrConvertMode() == 0) {
                    sliderPictureGain.setDisable();
                    sliderPicturePoint.setDisable();
                    sliderPictureSlope.setDisable();
                    sliderPictureBlackOffset.setDisable();
                } else {
                    sliderPictureGain.setEnable();
                    sliderPicturePoint.setEnable();
                    sliderPictureSlope.setEnable();
                    sliderPictureBlackOffset.setEnable();
                }
            }

            if (dnrSwRadioButtonGroup.getSelectedValue() == 0) {
                sliderPictureDnrLevel.setDisable();
            } else {
                sliderPictureDnrLevel.setEnable();
            }
        }

        function changeAWB_ABBStatus() {
            var dayOrNight = cparam_get_dayNight();
            if (dayOrNight == 0) {
                imageAdjust_picture_AWB_execute_button.displayOff();
                imageAdjust_picture_ABB_execute_button.displayOff();

            } else {
                imageAdjust_picture_AWB_execute_button.displayDisabled();
                imageAdjust_picture_ABB_execute_button.displayDisabled();
            }
        }

        /* TODO Get Set Data */
        /**
         *
         * @returns {*}
         */
        function getATW() {
            var retValue = cparam_get_atw();
            return retValue;
        }

        /**
         * ???
         */
        function callbackATW(mouse) {
            cparam_set_atw(atwRadioButtonGroup.getSelectedValue());

            if (atwRadioButtonGroup.getSelectedValue() == 1) {
                whiteBalanceModeRadioButtonGroup.setDisable("0, 1, 2, 3, 4");
            } else {
                whiteBalanceModeRadioButtonGroup.setEnable("0, 1, 2, 3, 4");
            }

            if (atwRadioButtonGroup.getSelectedValue() == 0) {
                atwSpeedRadioButtonGroup.setDisable("0, 1, 2");
                sliderPictureAtwTargetR.setDisable();
                sliderPictureATWTargetB.setDisable();
            } else {
                atwSpeedRadioButtonGroup.setEnable("0, 1, 2");
                sliderPictureAtwTargetR.setEnable();
                sliderPictureATWTargetB.setEnable();
            }
            if (atwRadioButtonGroup.getSelectedValue() == 1) {
                sliderPictureWBalVar.setDisable();
            } else {
                if (whiteBalanceModeRadioButtonGroup.getSelectedValue() == 4) {
                    sliderPictureWBalVar.setEnable();
                } else {
                    sliderPictureWBalVar.setDisable();
                }
            }
        }

        /**
         *
         */
        function getWhiteBalanceMode() {
            return cparam_get_whiteBalanceMode();
        }

        /**
         *
         */
        function callbackWhiteBalanceMode() {
            cparam_set_whiteBalanceMode(whiteBalanceModeRadioButtonGroup.getSelectedValue());

            if (whiteBalanceModeRadioButtonGroup.getSelectedValue() == 4) {
                sliderPictureWBalVar.setEnable();
            } else {
                sliderPictureWBalVar.setDisable();
            }

            if (cparam_get_v_log() != 1 || cparam_get_v_log_paint_sw() != 0) {
                if (whiteBalanceModeRadioButtonGroup.getSelectedValue() == 0 || whiteBalanceModeRadioButtonGroup.getSelectedValue() == 1) {
                    sliderPicturePresetRGain.setDisable();
                    sliderPicturePresetGGain.setDisable();
                    sliderPicturePresetBGain.setDisable();
                    // sliderPicturePresetRGainAch.setDisable();
                    // sliderPicturePresetGGainAch.setDisable();
                    // sliderPicturePresetBGainAch.setDisable();
                    // gainOffsetAchRadioButtonGroup.setDisable("0, 1");
                    // sliderPicturePresetRGainBch.setDisable();
                    // sliderPicturePresetGGainBch.setDisable();
                    // sliderPicturePresetBGainBch.setDisable();
                    // gainOffsetBchRadioButtonGroup.setDisable("0, 1");
                } else {
                    sliderPicturePresetRGain.setEnable();
                    sliderPicturePresetGGain.setEnable();
                    sliderPicturePresetBGain.setEnable();
                    // sliderPicturePresetRGainAch.setEnable();
                    // sliderPicturePresetGGainAch.setEnable();
                    // sliderPicturePresetBGainAch.setEnable();
                    // gainOffsetAchRadioButtonGroup.setEnable("0, 1");
                    // sliderPicturePresetRGainBch.setEnable();
                    // sliderPicturePresetGGainBch.setEnable();
                    // sliderPicturePresetBGainBch.setEnable();
                    // gainOffsetBchRadioButtonGroup.setEnable("0, 1");
                }
            }
        }

        /**
         * ??
         */
        function getWBalVar() {
            return cparam_get_ColorTemperature();
        }

        /**
         * ??
         */
        function callbackWBalVar() {
            return cparam_set_ColorTemperature(sliderPictureWBalVar.getCgiValue());
        }

        /**
         *
         */
        function getATWSpeedValue() {
            return cparam_get_ATWSpeed();
        }

        /**
         *
         */
        function callbackATWSpeed() {
            cparam_set_ATWSpeed(atwSpeedRadioButtonGroup.getSelectedValue());
        }


        /**
         *
         * @returns {*}
         */
        function getATWTargetR() {
            return cparam_get_ATWTargetR();
        }

        /**
         *
         * @returns {*}
         */
        function callbackATWTargetR() {
            return cparam_set_ATWTargetR(sliderPictureAtwTargetR.getValue());
        }

        /**
         *
         */
        function getATWTargetBValue() {
            return cparam_get_ATWTargetB();
        }

        /**
         *
         */
        function callbackATWTargetB() {
            cparam_set_ATWTargetB(sliderPictureATWTargetB.getValue());
        }


        function getShocklessWbSw() {
            return cparam_get_shocklessWbSw();
        }

        function callbackShocklessWbSw() {
            cparam_set_shocklessWbSw(shocklessWbSwRadioButtonGroup.getSelectedValue());
        }

        function getShocklessWbSwSpeed() {
            return cparam_get_ShocklessWbSwSpeed();
        }

        function callbackShocklessWbSwSpeed() {
            cparam_set_ShocklessWbSwSpeed(sliderPictureShocklessWbSwSpeed.getValue());
        }

        function getChromeLevelSwitch() {
            return cparam_get_ChromaLevelSwitch();
        }

        function callbackChromeLevelSwitch() {
            cparam_set_ChromaLevelSwitch(pictureChromaLevelSwitchRadioButtonGroup.getSelectedValue());
            if (pictureChromaLevelSwitchRadioButtonGroup.getSelectedValue() == 0) {
                sliderPictureChromaLevel.setDisable();
            } else {
                sliderPictureChromaLevel.setEnable();
            }
        }

        function getColorTemperatureSetting() {
            return cparam_get_ColorTemperatureSetting();
        }

        function callbackColorTemperatureSetting() {
            cparam_set_ColorTemperatureSetting(sliderPictureColorTempAch.getCgiValue());
            getColorRGBValue();
        }

        function getColorRGain() {
            return cparam_get_Color_RGain();
        }

        function callbackColorRGain() {
            cparam_set_Color_RGain(sliderPictureRGainAch.getValue());
            getColorRGBValue();
        }

        function getColorTempBch() {
            return cparam_get_ColorTempBch();
        }

        function callbackColorTempBch() {
            cparam_set_ColorTempBch(sliderPictureColorTempBch.getCgiValue());
            getColorRGBValue();
        }

        function getColorRGainBch() {
            return cparam_get_Color_RGainBch();
        }

        function callbackColorRGainBch() {
            cparam_set_Color_RGainBch(sliderPictureRGainBch.getValue());
            getColorRGBValue();
        }

        function getColorGGainBch() {
            return cparam_get_Color_GGainBch();
        }

        function callbackColorGGainBch() {
            cparam_set_Color_GGainBch(sliderPictureGGainBch.getValue());
            getColorRGBValue();
        }

        function getColorBGainBch() {
            return cparam_get_Color_BGainBch();
        }

        function callbackColorBGainBch() {
            cparam_set_Color_BGainBch(sliderPictureBGainBch.getValue());
            getColorRGBValue();
        }

        function getgGainRelControlSwitch() {
            return cparam_get_gGainRelControlSwitch();
        }

        function callbackgGainRelControlSwitch() {
            cparam_set_gGainRelControlSwitch(gGainRelControlSwitchRadioButtonGroup.getSelectedValue());
        }

        function getColorPresetRGain() {
            return cparam_get_Color_PresetRGain();
        }

        function callbackColorPresetRGain() {
            cparam_set_Color_PresetRGain(sliderPicturePresetRGain.getValue());
        }

        function getColorPresetGGain() {
            return cparam_get_Color_PresetGGain();
        }

        function callbackColorPresetGGain() {
            cparam_set_Color_PresetGGain(sliderPicturePresetGGain.getValue());
        }

        function getColorPresetBGain() {
            return cparam_get_Color_PresetBGain();
        }

        function callbackColorPresetBGain() {
            cparam_set_Color_PresetBGain(sliderPicturePresetBGain.getValue());
        }

        function getColorPresetRGainAch() {
            return cparam_get_Color_PresetRGainAch();
        }

        function callbackColorPresetRGainAch() {
            cparam_set_Color_PresetRGainAch(sliderPicturePresetRGainAch.getValue());
        }

        function getColorPresetGGainAch() {
            return cparam_get_Color_PresetGGainAch();
        }

        function callbackColorPresetGGainAch() {
            cparam_set_Color_PresetGGainAch(sliderPicturePresetGGainAch.getValue());
        }

        function getColorPresetBGainAch() {
            return cparam_get_Color_PresetBGainAch();
        }

        function callbackColorPresetBGainAch() {
            cparam_set_Color_PresetBGainAch(sliderPicturePresetBGainAch.getValue());
        }

        function getColorPresetRGainBch() {
            return cparam_get_Color_PresetRGainBch();
        }

        function callbackColorPresetRGainBch() {
            cparam_set_Color_PresetRGainBch(sliderPicturePresetRGainBch.getValue());
        }

        function getColorPresetGGainBch() {
            return cparam_get_Color_PresetGGainBch();
        }

        function callbackColorPresetGGainBch() {
            cparam_set_Color_PresetGGainBch(sliderPicturePresetGGainBch.getValue());
        }

        function getColorPresetBGainBch() {
            return cparam_get_Color_PresetBGainBch();
        }

        function callbackColorPresetBGainBch() {
            cparam_set_Color_PresetBGainBch(sliderPicturePresetBGainBch.getValue());
        }

        function getGainOffsetBch() {
            return cparam_get_gainOffsetBch();
        }

        function callbackGainOffsetBch() {
            cparam_set_gainOffsetBch(gainOffsetBchRadioButtonGroup.getSelectedValue());
        }

        function getFlare() {
            return cparam_get_flare();
        }

        function callbackFlare() {
            cparam_set_flare(flareRadioButtonGroup.getSelectedValue());
            if (flareRadioButtonGroup.getSelectedValue() == 0) {
                sliderPictureMasterFlare.setDisable();
                sliderPictureRFlare.setDisable();
                sliderPictureGFlare.setDisable();
                sliderPictureBFlare.setDisable();
            } else {
                sliderPictureMasterFlare.setEnable();
                sliderPictureRFlare.setEnable();
                sliderPictureGFlare.setEnable();
                sliderPictureBFlare.setEnable();
            }
        }

        function getColorMasterFlare() {
            return cparam_get_Color_MasterFlare();
        }

        function callbackColorMasterFlare() {
            cparam_set_Color_MasterFlare(sliderPictureMasterFlare.getValue());
        }

        function getColorRFlare() {
            return cparam_get_Color_RFlare();
        }

        function callbackColorRFlare() {
            cparam_set_Color_RFlare(sliderPictureRFlare.getValue());
        }

        function getColorGFlare() {
            return cparam_get_Color_GFlare();
        }

        function callbackColorGFlare() {
            cparam_set_Color_GFlare(sliderPictureGFlare.getValue());
        }

        function getColorBFlare() {
            return cparam_get_Color_BFlare();
        }

        function callbackColorBFlare() {
            cparam_set_Color_BFlare(sliderPictureBFlare.getValue());
        }

        function getDnrLevel() {
            return cparam_get_DnrLevel();
        }

        function callbackDnrLevel() {
            cparam_set_DnrLevel(sliderPictureDnrLevel.getValue());
        }

        function getHlgMode() {
            return cparam_get_hlgMode();
        }

        function callbackHlgMode() {
            cparam_set_hlgMode(hlgModeRadioButtonGroup.getSelectedValue());
            if (hlgModeRadioButtonGroup.getSelectedValue() == 0) {
                blackGammaSwRadioButtonGroup.setDisable("0, 1");
                sliderPictureMasterBlackGamma.setDisable();
                sliderPictureRBlackGamma.setDisable();
                sliderPictureBBlackGamma.setDisable();
                kneeSwRadioButtonGroup.setDisable("0, 1");
                sliderPictureKneePoint.setDisable();
                sliderPictureKneeSlope.setDisable();
            } else {
                if (cparam_get_v_log() != 1 && cparam_get_hdr() != 0) {
                    blackGammaSwRadioButtonGroup.setEnable("0, 1");
                    sliderPictureMasterBlackGamma.setEnable();
                    sliderPictureRBlackGamma.setEnable();
                    sliderPictureBBlackGamma.setEnable();
                    kneeSwRadioButtonGroup.setEnable("0, 1");
                    sliderPictureKneePoint.setEnable();
                    sliderPictureKneeSlope.setEnable();
                }
            }
            kneeSwRadioButtonGroup.setSelectedValue(getHLGKneeModeValue());
        }

        function getSdrConvertMode() {
            return cparam_get_sdrConvertMode();
        }

        function callbackSdrConvertMode() {
            cparam_set_sdrConvertMode(sdrConvertModeRadioButtonGroup.getSelectedValue());

            if (sdrConvertModeRadioButtonGroup.getSelectedValue() == 0) {
                sliderPictureGain.setDisable();
                sliderPicturePoint.setDisable();
                sliderPictureSlope.setDisable();
                sliderPictureBlackOffset.setDisable();
            } else {
                if (cparam_get_v_log() != 1 && cparam_get_hdr() != 0) {
                    sliderPictureGain.setEnable();
                    sliderPicturePoint.setEnable();
                    sliderPictureSlope.setEnable();
                    sliderPictureBlackOffset.setEnable();
                }
            }
        }

        function getBlackGammaSw() {
            return cparam_get_blackGammaSw();
        }

        function callbackBlackGammaSw() {
            cparam_set_blackGammaSw(blackGammaSwRadioButtonGroup.getSelectedValue());
        }

        function getMasterBlackGamma() {
            return cparam_get_MasterBlackGamma();
        }

        function callbackMasterBlackGamma() {
            cparam_set_MasterBlackGamma(sliderPictureMasterBlackGamma.getValue());
        }

        function getRBlackGamma() {
            return cparam_get_RBlackGamma();
        }

        function callbackRBlackGamma() {
            cparam_set_RBlackGamma(sliderPictureRBlackGamma.getValue());
        }

        function getBBlackGamma() {
            return cparam_get_BBlackGamma();
        }

        function callbackBBlackGamma() {
            cparam_set_BBlackGamma(sliderPictureBBlackGamma.getValue());
        }

        function getPictureGain() {
            return cparam_get_PictureGain();
        }

        function callbackPictureGain() {
            cparam_set_PictureGain(sliderPictureGain.getCgiValue());
        }

        function getPicturePoint() {
            return cparam_get_PicturePoint();
        }

        function callbackPicturePoint() {
            cparam_set_PicturePoint(sliderPicturePoint.getValue());
        }

        function getPictureSlope() {
            return cparam_get_PictureSlope();
        }

        function callbackPictureSlope() {
            cparam_set_PictureSlope(sliderPictureSlope.getValue());
        }

        function getPictureBlackOffset() {
            return cparam_get_PictureBlackOffset();
        }

        function callbackPictureBlackOffset() {
            cparam_set_PictureBlackOffset(sliderPictureBlackOffset.getValue());
        }
        /*TODO End */


        /**
         *
         * @returns {*}
         */
        function getColorBGainValue() {
            return cparam_get_Color_BGain();
        }

        /**
         *
         */
        function callbackRGain() {
            cparam_set_RGain(sliderPictureRGain.getValue());
        }

        /**
         *
         */
        function callbackColorBGain() {
            cparam_set_Color_BGain(sliderPictureBGainAch.getValue());
            getColorRGBValue();
        }
        /**
         *
         */
        function callbackColorGAxis() {
            cparam_set_Color_GAxis(sliderPictureGGainAch.getValue());
            getColorRGBValue();
        }
        /**
         *
         * @returns {*}
         */
        function getBGainValue() {
            return cparam_get_BGain();
        }

        /**
         *
         * @returns {*}
         */
        function getGAxisValue() {
            return cparam_get_Color_GAxis();
        }

        /**
         *
         */
        function callbackBGain() {
            cparam_set_BGain(sliderPictureBGain.getValue());
        }

        /**
         *
         * @returns {*}
         */
        function getAWBGainOffsetValue() {
            return cparam_get_AWBGainOffset();
        }

        /**
         *
         */
        function callbackAWBGainOffset() {
            cparam_set_AWBGainOffset(gainOffsetAchRadioButtonGroup.getSelectedValue());
        }



        /**
         *
         */
        function getATWTargetAValue() {
            return cparam_get_ATWTargetR();
        }

        /**
         *
         */
        function callbackATWTargetA() {
            cparam_set_ATWTargetR(sliderPictureATWTargetA.getValue());
        }

        /**
         *
         */
        function getChromaLevelValue() {
            return cparam_get_chromaLevel();
        }

        /**
         *
         */
        function callbackChromaLevel() {
            cparam_set_chromaLevel(sliderPictureChromaLevel.getValue());
        }

        /**
         *
         */
        function getChromaPhaseValue() {
            return cparam_get_chromaPhase();
        }

        /**
         *
         */
        function callbackChromaPhase() {
            cparam_set_chromaPhase(sliderPictureChromaPhase.getValue());
        }

        /**
         *
         */
        function callbackABBExecuteButton(mouse) {
            if (mouse == Button.MOUSE_DOWN) {
                cparam_set_ABBSet();
            }
        }

        /**
         *
         */
        function getMasterPedestalValue() {
            return cparam_get_masterPedestal();
        }

        /**
         *
         */
        function callbackMasterPedestal() {
            cparam_set_masterPedestal(sliderPictureMasterPendestal.getValue());
        }

        /**
         *
         */
        function getRPedestalValue() {
            return cparam_get_RPedestal();
        }

        /**
         *
         */
        function callbackRPedestal() {
            return cparam_set_RPedestal(sliderPictureRPendestal.getValue());
        }

        /**
         *
         */
        function getGPedestalValue() {
            return cparam_get_GPedestal();
        }

        /**
         *
         */
        function callbackGPedestal() {
            cparam_set_GPedestal(sliderPictureGPendestal.getValue());
        }

        /**
         *
         */
        function getBPedestalValue() {
            return cparam_get_BPedestal();
        }

        /**
         *
         */
        function callbackBPedestal() {
            cparam_set_BPedestal(sliderPictureBPendestal.getValue());
        }

        /**
         *
         */
        function getPedestalOffsetValue() {
            return cparam_get_pedestalOffset();
        }

        /**
         *
         */
        function callbackPedestalOffset() {
            cparam_set_pedestalOffset(pendestalOffsetRadioButtonGroup.getSelectedValue());
        }

        /**
         *
         */
        function getDetailValue() {
            return cparam_get_detail();
        }

        /**
         * Detail Changed
         */
        function callbackDetail() {
            changeDetailStatus();
            cparam_set_detail(detailRadioButtonGroup.getSelectedValue());
        }

        /**
         *
         */
        function changeDetailStatus() {
            if (detailRadioButtonGroup.getSelectedValue() == 0 || cparam_get_color_setting() == 1) {
                sliderPictureMasterDetail.setDisable();
                sliderPictureDetailCoring.setDisable();
                sliderPictureVDetailLevel.setDisable();
                sliderPictureDetailFrequency.setDisable();
                sliderPictureLevelDepend.setDisable();
                sliderPictureKneeApertureLevel.setDisable();
                sliderPictureDetailGainPlus.setDisable();
                sliderPictureDetailGainMinus.setDisable();
                skinDetailRadioButtonGroup.displayDisabled();
                sliderPictureSkinDetailEffect.setDisable();
            } else {
                sliderPictureMasterDetail.setEnable();
                sliderPictureDetailCoring.setEnable();
                sliderPictureVDetailLevel.setEnable();
                sliderPictureDetailFrequency.setEnable();
                sliderPictureLevelDepend.setEnable();
                sliderPictureKneeApertureLevel.setEnable();
                sliderPictureDetailGainPlus.setEnable();
                sliderPictureDetailGainMinus.setEnable();
                skinDetailRadioButtonGroup.displayOff();
                if (skinDetailRadioButtonGroup.getSelectedValue() == 1) {
                    sliderPictureSkinDetailEffect.setEnable();
                } else {
                    sliderPictureSkinDetailEffect.setDisable();
                }
            }
        }

        /**
         *
         */
        function initWhiteBalanceMode() {
            if (whiteBalanceModeRadioButtonGroup.getSelectedValue() != 9) {
                sliderPictureColorTemperature.setDisable();
            } else {
                sliderPictureColorTemperature.setEnable();
            }
            if (whiteBalanceModeRadioButtonGroup.getSelectedValue() != 1
                && whiteBalanceModeRadioButtonGroup.getSelectedValue() != 2
                && whiteBalanceModeRadioButtonGroup.getSelectedValue() != 9) {
                sliderPictureRGain.setValue(0);
                sliderPictureBGain.setValue(0);

                sliderPictureRGain.setDisable();
                sliderPictureBGain.setDisable();
            } else {
                sliderPictureRGain.setValue(getRGainValue());
                sliderPictureBGain.setValue(getBGainValue());

                sliderPictureRGain.setEnable();
                sliderPictureBGain.setEnable();
            }
            if (whiteBalanceModeRadioButtonGroup.getSelectedValue() != 0) {
                atwSpeedRadioButtonGroup.displayDisabled();
                sliderPictureATWTargetA.setDisable();
                sliderPictureATWTargetB.setDisable();
            } else {
                atwSpeedRadioButtonGroup.displayOff();
                sliderPictureATWTargetA.setEnable();
                sliderPictureATWTargetB.setEnable();
            }

            if (whiteBalanceModeRadioButtonGroup.getSelectedValue() == 1 || whiteBalanceModeRadioButtonGroup.getSelectedValue() == 2) {
                sliderPictureGAxis.setEnable();
                sliderPictureSettingBGain.setEnable();
                sliderPictureSettingRGain.setEnable();
                sliderPictureColorTemperatureSetting.setEnable();
                getColorRGBValue();
            } else {
                sliderPictureGAxis.setDisable();
                sliderPictureSettingBGain.setDisable();
                sliderPictureSettingRGain.setDisable();
                sliderPictureColorTemperatureSetting.setDisable();
            }
        }

        /**
         *
         */
        function getMasterDetailValue() {
            return cparam_get_masterDetail();
        }

        /**
         *
         */
        function callbackMasterDetail() {
            cparam_set_masterDetail(sliderPictureMasterDetail.getValue());
        }

        /**
         *
         */
        function getDetailCoringValue() {
            return cparam_get_detailCoring();
        }

        /**
         *
         */
        function callbackDetailCoring() {
            cparam_set_detailCoring(sliderPictureDetailCoring.getValue());
        }

        /**
         *
         */
        function getVDetailLevelValue() {
            return cparam_get_VDetailLevel();
        }

        /**
         *
         */
        function callbackVDetailLevel() {
            cparam_set_VDetailLevel(sliderPictureVDetailLevel.getValue());
        }

        /**
         *
         */
        function getDetailFrequencyValue() {
            return cparam_get_detailFrequency();
        }

        /**
         *
         */
        function callbackDetailFrequency() {
            cparam_set_detailFrequency(sliderPictureDetailFrequency.getValue());
        }

        /**
         *
         */
        function getLevelDependValue() {
            return cparam_get_levelDepend();
        }

        /**
         *
         */
        function callbackLevelDepend() {
            cparam_set_levelDepend(sliderPictureLevelDepend.getValue());
        }

        /**
         *
         */
        function getKneeApertureLevelValue() {
            return cparam_get_kneeApeLevel();
        }

        /**
         *
         */
        function callbackKneeApertureLevel() {
            cparam_set_kneeApeLevel(sliderPictureKneeApertureLevel.getValue());
        }

        /**
         *
         */
        function getDetailGainPlusValue() {
            return cparam_get_detailGainINC();
        }

        /**
         *
         */
        function callbackDetailGainPlus() {
            cparam_set_detailGainINC(sliderPictureDetailGainPlus.getValue());
        }

        /**
         *
         */
        function getDetailGainMinusValue() {
            return cparam_get_detailGainDEC();
        }

        /**
         *
         */
        function callbackDetailGainMinus() {
            cparam_set_detailGainDEC(sliderPictureDetailGainMinus.getValue());
        }

        /**
         *
         */
        function getSkinDetailValue() {
            return cparam_get_skinDetail();
        }

        /**
         *
         */
        function callbackSkinDetail() {
            changeDetailStatus();
            cparam_set_skinDetail(skinDetailRadioButtonGroup.getSelectedValue());
        }

        /**
         *
         */
        function getSkinDetailEffectValue() {
            return cparam_get_skinDetailEffect();
        }

        /**
         *
         */
        function callbackSkinDetailEffect() {
            cparam_set_skinDetailEffect(sliderPictureSkinDetailEffect.getValue());
        }

        /**
         *
         */
        function getDownConDetailValue() {
            return cparam_get_downConDetail();
        }

        /**
         *
         */
        function callbackDownConDetail() {
            //changeDownConDetailStatus();
            //cparam_set_downConDetail(downConDetailRadioButtonGroup.getSelectedValue());
        }

        function changeDownConDetailStatus() {
            if (downConDetailRadioButtonGroup.getSelectedValue() == 1 && IsValidFormat()) {
                sliderPictureDCMasterDetail.setEnable();
                sliderPictureDCDetailCoring.setEnable();
                sliderPictureDCVDetailLevel.setEnable();
                sliderPictureDCDetailFrequency.setEnable();
                sliderPictureDCLevelDepend.setEnable();
                sliderPictureDCKneeApertureLevel.setEnable();
            } else {
                sliderPictureDCMasterDetail.setDisable();
                sliderPictureDCDetailCoring.setDisable();
                sliderPictureDCVDetailLevel.setDisable();
                sliderPictureDCDetailFrequency.setDisable();
                sliderPictureDCLevelDepend.setDisable();
                sliderPictureDCKneeApertureLevel.setDisable();
            }
        }

        function IsValidFormat() {
            getCurrentFormat();
            if (sysCommon.format == CONST_2160_59_94p
                || sysCommon.format == CONST_2160_29_97p
                || sysCommon.format == CONST_2160_23_98p
                || sysCommon.format == CONST_2160_24p
                || sysCommon.format == CONST_2160_50p
                || sysCommon.format == CONST_2160_25p) {
                return true;
            } else {
                return false;
            }
        }

        /**
         *
         */
        function getDCMasterDetailValue() {
            return cparam_get_DCMasterDetail();
        }

        /**
         *
         */
        function callbackDCMasterDetail() {
            cparam_set_DCMasterDetail(sliderPictureDCMasterDetail.getValue());
        }

        /**
         *
         */
        function getDCDetailCoringValue() {
            return cparam_get_DCDetailCoring();
        }

        /**
         *
         */
        function callbackDCDetailCoring() {
            cparam_set_DCDetailCoring(sliderPictureDCDetailCoring.getValue());
        }

        /**
         *
         */
        function getDCVDetailLevelValue() {
            return cparam_get_DCVDetailLevel();
        }

        /**
         *
         */
        function callbackDCVDetailLevel() {
            cparam_set_DCVDetailLevel(sliderPictureDCVDetailLevel.getValue());
        }

        /**
         *
         */
        function getDCDetailFrequencyValue() {
            return cparam_get_DCDetailFrequency();
        }

        /**
         *
         */
        function callbackDCDetailFrequency() {
            cparam_set_DCDetailFrequency(sliderPictureDCDetailFrequency.getValue());
        }

        /**
         *
         */
        function getDCLevelDependValue() {
            return cparam_get_DCLevelDepend();
        }

        /**
         *
         */
        function callbackDCLevelDepend() {
            cparam_set_DCLevelDepend(sliderPictureDCLevelDepend.getValue());
        }

        /**
         *
         */
        function getDCKneeApertureLevelValue() {
            return cparam_get_DCKneeApeLevel();
        }

        /**
         *
         */
        function callbackDCKneeApertureLevel() {
            cparam_set_DCKneeApeLevel(sliderPictureDCKneeApertureLevel.getValue());
        }

        /**
         *
         */
        function getGammaModeValue() {
            return cparam_get_gammaMode();
        }

        /**
         *
         */
        function callbackGammaMode() {
            // changeGammaModeStatus();
            cparam_set_gammaMode(selectImageAdjustPictureGammaMode.get());
        }

        function changeGammaModeStatus() {
            if (selectImageAdjustPictureGammaMode.get() == 7) {
                sliderPictureGamma.setDisable();
                DRSRadioButtonGroup.displayDisabled();
                kneeModeRadioButtonGroup.displayDisabled();
                sliderPictureKneePoint.setDisable();
                sliderPictureKneeSlope.setDisable();
                sliderPictureAutoKneeResponse.setDisable();
                HLGKneeModeRadioButtonGroup.displayOff();
                // if (HLGKneeModeRadioButtonGroup.getSelectedValue() == 1) {
                //     sliderPictureHLGKneePoint.setEnable();
                //     sliderPictureHLGKneeSlope.setEnable();
                // } else {
                //     sliderPictureHLGKneeSlope.setDisable();
                //     sliderPictureHLGKneePoint.setDisable();
                // }
                whiteClipRadioButtonGroup.displayDisabled();
                sliderPictureWhiteClipLevel.setDisable();
            } else {
                sliderPictureGamma.setEnable();
                DRSRadioButtonGroup.displayOff();
                kneeModeRadioButtonGroup.displayOff();
                if (kneeModeRadioButtonGroup.getSelectedValue() == 1) {
                    sliderPictureKneePoint.setEnable();
                    sliderPictureKneeSlope.setEnable();
                } else {
                    sliderPictureKneePoint.setDisable();
                    sliderPictureKneeSlope.setDisable();
                }
                sliderPictureAutoKneeResponse.setEnable();
                //HLGKneeModeRadioButtonGroup.displayDisabled();
                //sliderPictureHLGKneeSlope.setDisable();
                //sliderPictureHLGKneePoint.setDisable();
                whiteClipRadioButtonGroup.displayOff();
                if (whiteClipRadioButtonGroup.getSelectedValue() == 1) {
                    sliderPictureWhiteClipLevel.setEnable();
                } else {
                    sliderPictureWhiteClipLevel.setDisable();
                }
            }
            // if (selectImageAdjustPictureGammaMode.get() != 5) {
            //     sliderPictureFRECDynamicLevel.setDisable();
            //     sliderPictureFRECBlackSTRLevel.setDisable();
            // } else {
            //     sliderPictureFRECDynamicLevel.setEnable();
            //     sliderPictureFRECBlackSTRLevel.setEnable();
            // }
            // if (selectImageAdjustPictureGammaMode.get() != 6) {
            //     sliderPictureVRECKneeSlope.setDisable();
            //     sliderPictureVRECKneePoint.setDisable();
            // } else {
            //     sliderPictureVRECKneeSlope.setEnable();
            //     sliderPictureVRECKneePoint.setEnable();
            // }
        }

        /**
         *
         */
        function getGammaValue() {
            return cparam_get_gamma();
        }

        /**
         *
         */
        function callbackGamma() {
            cparam_set_gamma(sliderPictureGamma.getValue());
        }

        /**
         *
         */
        function callbackVRECKneeSlope() {
            cparam_set_vRECKneeSlope(sliderPictureVRECKneeSlope.getValue());
        }

        /**
         *
         */
        function getVRECKneePointValue() {
            return cparam_get_vRECKneePoint();
        }

        /**
         *
         */
        function callbackVRECKneePoint() {
            cparam_set_vRECKneePoint(sliderPictureVRECKneePoint.getValue());
        }

        /**
         *
         */
        function getBlackGammaValue() {
            return cparam_get_blackGamma();
        }

        /**
         *
         */
        function callbackBlackGamma() {
            cparam_set_blackGamma(sliderPictureBlackGamma.getValue());
        }

        /**
         *
         */
        function getBlackGammaRangeValue() {
            return cparam_get_bGammaRange();
        }

        /**
         *
         */
        function callbackBlackGammaRange() {
            cparam_set_bGammaRange(sliderPictureBlackGammaRange.getValue());
        }

        /**
         *
         */
        function getDSRValue() {
            return cparam_get_DRS();
        }

        /**
         *
         */
        function callbackDSR() {
            cparam_set_DRS(DRSRadioButtonGroup.getSelectedValue());
        }

        /**
         *
         */
        function getKneeModeValue() {
            return cparam_get_kneeMode();
        }

        /**
         *
         */
        function callbackKneeMode() {
            cparam_set_kneeMode(kneeModeRadioButtonGroup.getSelectedValue());
            // changeGammaModeStatus();
        }

        /**
         *
         */
        function getAutoKneeResponseValue() {
            return cparam_get_aKneeResponse();
        }

        /**
         *
         */
        function callbackAutoKneeResponse() {
            cparam_set_aKneeResponse(sliderPictureAutoKneeResponse.getValue());
        }

        /**
         *
         */
        function getKneePointValue() {
            return cparam_get_kneePoint();
        }

        /**
         *
         */
        function callbackKneePoint() {
            cparam_set_kneePoint(sliderPictureKneePoint.getValue());
        }

        /**
         *
         */
        function getKneeSlopeValue() {
            return cparam_get_kneeSlope();
        }

        /**
         *
         */
        function callbackKneeSlope() {
            cparam_set_kneeSlope(sliderPictureKneeSlope.getValue());
        }

        /**
        *
        */
        function getHLGKneeModeValue() {
            return cparam_get_HLGKneeSW();
        }

        /**
        *
        */
        function callbackHLGKneeMode() {
            // changeGammaModeStatus();
            cparam_set_HLGKneeSW(kneeSwRadioButtonGroup.getSelectedValue());
        }

        /**
         *1Ch
         -
         80h
         -
         D0h
         -
         F4h
         '55.00%
         -
         80.00%
         -
         100.00%
         -
         109.00�E�E�E�E
         (1step=0.25%)
         (UE150では4step単位�Eみ有効�E�E�E�E%刻みとなめE
         *
         */
        function getHLGKneePointValue() {
            return cparam_get_HLGKneePoint();
        }

        /**
         *
         */
        function callbackHLGKneePoint() {
            cparam_set_HLGKneePoint(sliderPictureKneePoint.getValue());
        }

        /**
         *
         */
        function getHLGKneeSlopeValue() {
            return cparam_get_HLGKneeSlope();
        }

        /**
         *
         */
        function callbackHLGKneeSlope() {
            cparam_set_HLGKneeSlope(sliderPictureKneeSlope.getValue());
        }


        /**
         *
         */
        function getWhiteClipValue() {
            return cparam_get_whiteClip();
        }

        /**
         *
         */
        function callbackWhiteClip() {
            // changeGammaModeStatus();
            cparam_set_whiteClip(whiteClipRadioButtonGroup.getSelectedValue());
        }

        /**
         *
         */
        function getWhiteClipLevelValue() {
            return cparam_get_whiteClipLevel();
        }

        /**
         *
         */
        function callbackWhiteClipLevel() {
            cparam_set_whiteClipLevel(sliderPictureWhiteClipLevel.getValue());
        }

        /**
         *
         */
        function getDNRValue() {
            return cparam_get_DNR();
        }

        /**
         *
         */
        function callbackDNR() {
            cparam_set_DNR(dnrSwRadioButtonGroup.getSelectedValue());
            if (dnrSwRadioButtonGroup.getSelectedValue() == 0) {
                sliderPictureDnrLevel.setDisable();
            } else {
                sliderPictureDnrLevel.setEnable();
            }
        }

        return {
            build: function () {
                return buildSettingPicture();
            },
            getKneeSwValue: function () {
                kneeSwRadioButtonGroup.setSelectedValue(cparam_get_HLGKneeSW());
            }
        }
    }

    /**
     * settingMatrix:settingMatrix制御に関わる画面クラス
     * @class settingMatrix画面:settingMatrix制御に関わる画面クラス
     * @return {{build: buildSettingMatrix, rebuild: rebuild}} build 構築�E琁E
     * @return {function} rebuild 再構築�E琁E
     * @constructor
     */
    function settingMatrix() {
        /**
         * 構築フラグ
         * @type boolean
         */
        var buildFlag_settingMatrix = false;
        /**
         * label定義
         * @type number
         */
        var TXT_IMAGE_ADJUST_MATRIX_LINEAR_MATRIX = 0;
        var MATRIX_COLOR_CORRECTION = 1;
        var TXT_IMAGE_ADJUST_MATRIX_R_G = 2;
        var TXT_IMAGE_ADJUST_MATRIX_R_B = 3;
        var TXT_IMAGE_ADJUST_MATRIX_G_R = 4;
        var TXT_IMAGE_ADJUST_MATRIX_G_B = 5;
        var TXT_IMAGE_ADJUST_MATRIX_B_R = 6;
        var TXT_IMAGE_ADJUST_MATRIX_B_G = 7;
        var TXT_IMAGE_ADJUST_PRESET_MATRIX = 8;
        var TXT_IMAGE_ADJUST_MATRIX = 9;
        var TXT_IMAGE_ADJUST_LINEAR_MATRIX = 10;
        var TXT_IMAGE_ADJUST_LINEAR_TABLE = 11;
        var TXT_IMAGE_ADJUST_COLOR_CORRECT = 12;
        var TXT_IMAGE_ADJUST_COLOR_CORRECT_AB = 13;
        var TXT_IMAGE_ADJUST_MATRIX_B_MG = 14;
        var TXT_IMAGE_ADJUST_MATRIX_MG = 15;
        var TXT_IMAGE_ADJUST_MATRIX_MG_R = 16;
        var TXT_IMAGE_ADJUST_MATRIX_MG_R_R = 16;
        var TXT_IMAGE_ADJUST_MATRIX_R = 17;
        var TXT_IMAGE_ADJUST_MATRIX_R_R_Yl = 18;
        var TXT_IMAGE_ADJUST_MATRIX_R_Yl = 19;
        var TXT_IMAGE_ADJUST_MATRIX_R_Yl_Yl = 20;
        var TXT_IMAGE_ADJUST_MATRIX_Yl = 21;
        var TXT_IMAGE_ADJUST_MATRIX_Yl_Yl_G = 22;
        var TXT_IMAGE_ADJUST_MATRIX_Yl_G = 23;
        var TXT_IMAGE_ADJUST_MATRIX_G = 24;
        var TXT_IMAGE_ADJUST_MATRIX_G_Cy = 25;
        var TXT_IMAGE_ADJUST_MATRIX_Cy = 26;
        var TXT_IMAGE_ADJUST_MATRIX_Cy_B = 27;
        var TXT_IMAGE_ADJUST_MATRIX_B = 28;
        var TXT_IMAGE_ADJUST_MATRIX_Saturation = 29;
        var TXT_IMAGE_ADJUST_MATRIX_Phase = 30;
        var TXT_IMAGE_ADJUST_MATRIX_Saturation_s = 31;
        var TXT_IMAGE_ADJUST_MATRIX_Phase_p = 32;
        var TXT_IMAGE_ADJUST_MATRIX_Saturation_a = 33;
        var TXT_IMAGE_ADJUST_MATRIX_Phase_h = 34;
        var TXT_IMAGE_ADJUST_MATRIX_Saturation_t = 35;
        var TXT_IMAGE_ADJUST_MATRIX_Phase_a = 36;
        var TXT_IMAGE_ADJUST_MATRIX_Saturation_u = 37;
        var TXT_IMAGE_ADJUST_MATRIX_Phase_s = 38;
        var TXT_IMAGE_ADJUST_MATRIX_Saturation_r = 39;
        var TXT_IMAGE_ADJUST_MATRIX_Phase_e = 40;
        var TXT_IMAGE_ADJUST_MATRIX_Saturation_i = 41;
        var TXT_IMAGE_ADJUST_MATRIX_Phase_ph = 42;
        var TXT_IMAGE_ADJUST_MATRIX_Saturation_o = 43;
        var TXT_IMAGE_ADJUST_MATRIX_Phase_se = 44;
        var TXT_IMAGE_ADJUST_MATRIX_Saturation_Sat = 45;
        var TXT_IMAGE_ADJUST_MATRIX_Phase_Pha = 46;
        var TXT_IMAGE_MATRIX_Saturation_o = 47;
        var TXT_IMAGE_MATRIX_Phase = 48;
        var TXT_IMAGE_MATRIX_S = 49;
        var TXT_IMAGE_MATRIX_P = 50;
        var TXT_IMAGE_MATRIX_Sa = 51;
        var TXT_IMAGE_MATRIX_h = 52;
        var TXT_IMAGE_MATRIX_Sat = 53;
        var TXT_IMAGE_MATRIX_a = 54;
        var TXT_IMAGE_MATRIX_u = 55;
        var TXT_IMAGE_MATRIX_s = 56;
        // var TXT_IMAGE_MATRIX_i = 57;
        // var TXT_IMAGE_MATRIX_Phas = 58;
        // var TXT_IMAGE_MATRIX_ion = 59;
        // var TXT_IMAGE_MATRIX_se = 60;
        var TXT_IMAGE_ADJUST_MATRIX_CORRECTION_COLOR = 61;
        var TXT_IMAGE_ADJUST_MATRIX_CORRECTION_SATURATION = 62;
        var TXT_IMAGE_ADJUST_MATRIX_CORRECTION_PHASE = 63;
        var TXT_IMAGE_ADJUST_MATRIX_COLORCORRECTION_COLOR = 64;
        var TXT_IMAGE_ADJUST_MATRIX_COLORCORRECTION_SATURATION = 65;
        var TXT_IMAGE_ADJUST_MATRIX_COLORCORRECTION_PHASE = 66;


        var dataslider;
        var sliderMatrix_R_G;
        var sliderMatrix_R_G_phase;
        var sliderMatrix_R_B;
        var sliderMatrix_R_B_phase;
        var sliderMatrix_G_R;
        var sliderMatrix_G_R_phase;
        var sliderMatrix_G_B;
        var sliderMatrix_G_B_phase;
        var sliderMatrix_B_R;
        var sliderMatrix_B_R_phase;
        var sliderMatrix_B_G;
        var sliderMatrix_B_G_phase;
        var sliderMatrix_B_MG_saturation;
        var sliderMatrix_B_MG_phase;
        var sliderMatrix_Mg_saturation;
        var sliderMatrix_Mg_phase;
        var sliderMatrix_Mg_R_saturation;
        var sliderMatrix_Mg_R_phase;
        // var sliderMatrix_Mg_R_R_saturation;
        // var sliderMatrix_Mg_R_R_phase;
        var sliderMatrix_R_saturation;
        var sliderMatrix_R_phase;
        // var sliderMatrix_R_R_Yl_saturation;
        var sliderMatrix_R_R_Yl_phase;
        var sliderMatrix_R_Yl_saturation;
        var sliderMatrix_R_Yl_phase;
        // var sliderMatrix_R_Yl_Yl_saturation;
        var sliderMatrix_R_Yl_Yl_phase;
        var sliderMatrix_Yl_saturation;
        var sliderMatrix_Yl_phase;
        // var sliderMatrix_Yl_Yl_G_saturation;
        var sliderMatrix_Yl_Yl_G_phase;
        var sliderMatrix_Yl_G_saturation;
        var sliderMatrix_Yl_G_phase;
        var sliderMatrix_G_saturation;
        var sliderMatrix_G_phase;
        var sliderMatrix_G_Cy_saturation;
        var sliderMatrix_G_Cy_phase;
        var sliderMatrix_Cy_saturation;
        var sliderMatrix_Cy_phase;
        var sliderMatrix_Cy_B_saturation;
        var sliderMatrix_Cy_B_phase;
        var sliderMatrix_B_saturation;
        var sliderMatrix_B_phase;

        var txtMatrixObject = [];

        var presetMatrixRadioButtonGroup;
        var matrixRadioButtonGroup;
        var linearMatrixRadioButtonGroup;
        var linearTableRadioButtonGroup;
        var colorCorrectRadioButtonGroup;
        var colorCorrectABRadioButtonGroup;

        var txtImageAdjustMatrixTitle;
        var txtImageAdjustMatrixSettingTitle;

        var selectImageAdjustMatrixType;

        var imageAdjust_matrixSetup_button;
        var myScroll = null;
        var buildScrollSuccessFlg = true;
        var adaptiveMatrix_radio;
        var matrix_linear_matrix;
        var TAB_LINEAR_MATRIX = 0;
        var TAB_COLOR_CORRECTION = 1;
        var btnObject = [];

        var canvasItems = {};

        function getPolygon() {
            var retOjects = {}
            retOjects = {
                pointR: { x: 0x7EB - 0x800, y: 0x860 - 0x800 }
                , pointG: { x: 0x7B6 - 0x800, y: 0x7A9 - 0x800 }
                , pointB: { x: 0x860 - 0x800, y: 0x7F7 - 0x800 }
                , pointCY: { x: 0x815 - 0x800, y: 0x7A0 - 0x800 }
                , pointMG: { x: 0x84A - 0x800, y: 0x857 - 0x800 }
                , pointYL: { x: 0x7A0 - 0x800, y: 0x809 - 0x800 }
            };
            return retOjects;
        }
        var canRefresh = true;

        function getCoordinatesDate() {
            // function RandomNumBoth(Min, Max) {
            //     var Range = Max - Min;
            //     var Rand = Math.random();
            //     var num = Min + Math.round(Rand * Range); //四�E五�E
            //     return num;
            // }
            var ret;
            ret = request_matrix();
            //测证E
            // ret = RandomNumBoth(0x701,0x8ff).toString(16) + ":" + RandomNumBoth(0x701,0x8ff).toString(16)+ ":" + RandomNumBoth(0x701,0x8ff).toString(16)
            // + ":" + RandomNumBoth(0x701,0x8ff).toString(16)+ ":" + RandomNumBoth(0x701,0x8ff).toString(16)+ ":" + RandomNumBoth(0x701,0x8ff).toString(16)
            // + ":" + RandomNumBoth(0x701,0x8ff).toString(16)+ ":" + RandomNumBoth(0x701,0x8ff).toString(16)+ ":" + RandomNumBoth(0x701,0x8ff).toString(16)
            // + ":" + RandomNumBoth(0x701,0x8ff).toString(16)+ ":" + RandomNumBoth(0x701,0x8ff).toString(16)+ ":" + RandomNumBoth(0x701,0x8ff).toString(16);
            var retOject = {};
            var division = ret.split(':')
            retOject = {
                pointR: { x: parseInt(division[0], 16) - 0x800, y: parseInt(division[1], 16) - 0x800 }
                , pointG: { x: parseInt(division[2], 16) - 0x800, y: parseInt(division[3], 16) - 0x800 }
                , pointB: { x: parseInt(division[4], 16) - 0x800, y: parseInt(division[5], 16) - 0x800 }
                , pointCY: { x: parseInt(division[6], 16) - 0x800, y: parseInt(division[7], 16) - 0x800 }
                , pointMG: { x: parseInt(division[8], 16) - 0x800, y: parseInt(division[9], 16) - 0x800 }
                , pointYL: { x: parseInt(division[10], 16) - 0x800, y: parseInt(division[11], 16) - 0x800 }
            };
            // retOject = {
            //     pointR: { x: -43, y: 185 }
            //     , pointG: {x: -143, y: -169 }
            //     , pointB: { x: 185, y: -17 }
            //     , pointCY: { x:42, y: -186 }
            //     , pointMG: { x: 142, y: 168  }
            //     , pointYL: { x: -186, y: 16 }
            // };
            return retOject;
        }


        function settingRadar() {
            var radar = getCoordinatesDate()
            var polygon = getPolygon()
            var ratio = 510 / 265;
            var canvas = document.getElementById("radarCanvas");
            var ctx = canvas.getContext('2d');
            // canvas.width=canvas.height;
            // Store the current transformation matrix
            // ctx.save();
            // Use the identity matrix while clearing the canvas
            ctx.setTransform(1, 0, 0, 1, 0, 0);
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            // Restore the transform
            ctx.save();
            // ctx.restore();
            // ctx.strokeStyle = 'rgba(244, 244, 244, 1)';
            ctx.translate(398, 146);
            ctx.rotate = getRad(180);
            ctx.scale(1, -1);
            ctx.beginPath();
            ctx.arc(0, 0, 50 / ratio, 0, 2 * Math.PI, true)
            ctx.strokeStyle = 'rgba(134, 134, 134, 1)'
            ctx.stroke();
            ctx.closePath();

            ctx.beginPath();
            ctx.arc(0, 0, 100 / ratio, 0, 2 * Math.PI, true)
            ctx.stroke();
            ctx.closePath();

            ctx.beginPath();
            ctx.arc(0, 0, 150 / ratio, 0, 2 * Math.PI, true)
            ctx.stroke();
            ctx.closePath();

            ctx.beginPath();
            ctx.arc(0, 0, 200 / ratio, 0, 2 * Math.PI, true)
            ctx.stroke();
            ctx.closePath();

            ctx.beginPath();
            ctx.arc(0, 0, 250 / ratio, 0, 2 * Math.PI, true)
            ctx.stroke();
            ctx.closePath();
            // 圁E��边桁E��度
            ctx.lineWidth = '1'
            // 边桁E��色
            ctx.stroke();

            ctx.beginPath();
            ctx.strokeStyle = 'rgba(134, 134, 134, 1)';
            ctx.lineWidth = '2';
            ctx.moveTo(polygon.pointR.x / ratio, polygon.pointR.y / ratio);
            ctx.lineTo(polygon.pointMG.x / ratio, polygon.pointMG.y / ratio);
            ctx.lineTo(polygon.pointB.x / ratio, polygon.pointB.y / ratio);
            ctx.lineTo(polygon.pointCY.x / ratio, polygon.pointCY.y / ratio);
            ctx.lineTo(polygon.pointG.x / ratio, polygon.pointG.y / ratio);
            ctx.lineTo(polygon.pointYL.x / ratio, polygon.pointYL.y / ratio);
            ctx.lineTo(polygon.pointR.x / ratio, polygon.pointR.y / ratio);
            ctx.stroke();
            ctx.closePath();

            ctx.beginPath();
            ctx.strokeStyle = 'rgba(244, 244, 244, 1)';
            ctx.lineWidth = '2';
            ctx.moveTo(radar.pointR.x / ratio, radar.pointR.y / ratio);
            ctx.lineTo(radar.pointMG.x / ratio, radar.pointMG.y / ratio);
            ctx.lineTo(radar.pointB.x / ratio, radar.pointB.y / ratio);
            ctx.lineTo(radar.pointCY.x / ratio, radar.pointCY.y / ratio);
            ctx.lineTo(radar.pointG.x / ratio, radar.pointG.y / ratio);
            ctx.lineTo(radar.pointYL.x / ratio, radar.pointYL.y / ratio);
            ctx.lineTo(radar.pointR.x / ratio, radar.pointR.y / ratio);


            function getRad(degree) {
                return degree / 180 * Math.PI;
            }
            rotateText(ctx, "R", '#FF0000', radar.pointR.x / ratio, radar.pointR.y / ratio);
            rotateText(ctx, "YL", '#FFFF00', radar.pointYL.x / ratio, radar.pointYL.y / ratio);
            rotateText(ctx, "G", '#00FF00', radar.pointG.x / ratio, radar.pointG.y / ratio);
            rotateText(ctx, "Cy", '#00FFFF', radar.pointCY.x / ratio, radar.pointCY.y / ratio);
            rotateText(ctx, "B", '#5252FF', radar.pointB.x / ratio, radar.pointB.y / ratio);
            rotateText(ctx, "Mg", '#FF00FF', radar.pointMG.x / ratio, radar.pointMG.y / ratio);
            ctx.closePath();
            ctx.stroke();


            ctx.restore();
            function rotateText(ctx, text, color, x, y) {
                ctx.save();
                ctx.translate(x, y)
                ctx.font = "bold 15px Arial";
                ctx.rotate = (getRad(180))
                ctx.scale(1, -1)
                ctx.fillStyle = color;
                ctx.fillText(text, 0, 0);
                ctx.restore();
            }
        }

        function linearMatrix() {
            setInterval(settingRadar, 1000)
        }

        function buildSettingMatrix() {
            if (myScroll != null) {
                myScroll.destroy();
                myScroll = null;
            }
            if (!buildFlag_settingMatrix) {
                buildFlag_settingMatrix = true;
                // Image adjust button
                btnObject[TAB_LINEAR_MATRIX] = MenuButtonCtrl('setup_imageAdjust_matrix_form_header', 'setup_imageAdjust_control_matrix_linear_btn', NPTZ_WORDING.wID_0895, callbackTABMatrixControl, TAB_LINEAR_MATRIX, MenuButtonType.TABLEFT);
                btnObject[TAB_COLOR_CORRECTION] = MenuButtonCtrl('setup_imageAdjust_matrix_form_header', 'setup_imageAdjust_control_color_correction_btn', NPTZ_WORDING.wID_0896, callbackTABMatrixControl, TAB_COLOR_CORRECTION, MenuButtonType.TABRIGHT);
                for (var text in btnObject) {
                    btnObject[text].show();
                    btnObject[text].displayOff();
                }

                $('#setup_imageAdjust_detail_matrix_linearMatrix_main').show();
                $('#setup_imageAdjust_detail_matrix_colorCorrection_main').hide();
                btnObject[TAB_LINEAR_MATRIX].displayOn();

                // PRESET MATRIX
                txtMatrixObject[TXT_IMAGE_ADJUST_PRESET_MATRIX] = TextCtrl('setup_imageAdjust_matrix_control_form', 'setup_imageadjust_preset_matrix_label', NPTZ_WORDING.wiD_0899);
                presetMatrixRadioButtonGroup = RadioButtonGroupCtrl('setup_imageAdjust_matrix_control_form', "setup_imageAdjust_preset_matrix_", RADIO_GROUP.rID_0106, getPresetMatrixValue(), callbackpresetMatrix);
                LineCtrl('setup_imageAdjust_matrix_control_form', 'horizontal', 73, 0, "", "setup_imageadjust_preset_matrix_label", "97");
                LineCtrl('setup_imageAdjust_matrix_control_form', 'vertical', 320, 37, 220, "setup_imageadjust_preset_matrix_label1");

                // ADJUST_MATRIX
                txtMatrixObject[TXT_IMAGE_ADJUST_MATRIX] = TextCtrl('setup_imageAdjust_matrix_control_form', 'setup_imageadjust_matrix_label', NPTZ_WORDING.wiD_0900);
                matrixRadioButtonGroup = RadioButtonGroupCtrl('setup_imageAdjust_matrix_control_form', "setup_imageadjust_matrix_", RADIO_GROUP.rID_0095, getmatrixValue(), callbackmatrix);
                LineCtrl('setup_imageAdjust_matrix_control_form', 'horizontal', 209, 0, "", "setup_imageadjust_matrix_label", "97");

                // LINEAR_MATRIX
                txtMatrixObject[TXT_IMAGE_ADJUST_LINEAR_MATRIX] = TextCtrl('setup_imageAdjust_matrix_control_form', 'setup_imageadjust_linear_matrix_label', NPTZ_WORDING.wiD_0901);
                linearMatrixRadioButtonGroup = RadioButtonGroupCtrl('setup_imageAdjust_matrix_control_form', "setup_imageadjust_linear_matrix_", RADIO_GROUP.rID_0095, getlinearMatrixValue(), callbacklinearMatrix);
                LineCtrl('setup_imageAdjust_matrix_control_form', 'horizontal', 277, 0, "", "setup_imageadjust_linear_matrix_label", "97");

                //LINEAR_TABLE
                txtMatrixObject[TXT_IMAGE_ADJUST_LINEAR_TABLE] = TextCtrl('setup_imageAdjust_matrix_control_form', 'setup_imageadjust_linear_table_label', NPTZ_WORDING.wID_0902);
                linearTableRadioButtonGroup = RadioButtonGroupCtrl('setup_imageAdjust_matrix_control_form', "setup_imageadjust_linear_table_", RADIO_GROUP.rID_0093, getlinearTableValue(), callbacklinearTable);
                LineCtrl('setup_imageAdjust_matrix_control_form', 'horizontal', 277, 0, "", "setup_imageadjust_linear_table_label", "4");

                // COLOR_CORRECT
                txtMatrixObject[TXT_IMAGE_ADJUST_COLOR_CORRECT] = TextCtrl('setup_imageAdjust_matrix_control_form', 'setup_imageadjust_color_correct_label', NPTZ_WORDING.wiD_0903);
                colorCorrectRadioButtonGroup = RadioButtonGroupCtrl('setup_imageAdjust_matrix_control_form', "setup_imageadjust_color_correct_", RADIO_GROUP.rID_0095, getcolorCorrectValue(), callbackcolorCorrect);
                LineCtrl('setup_imageAdjust_matrix_control_form', 'horizontal', 373, 54, "", "setup_imageadjust_color_correct_label", "97");
                LineCtrl('setup_imageAdjust_matrix_control_form', 'vertical', 320, 37, 220, "setup_imageadjust_color_correct_label1");

                // COLOR_CORRECT_AB
                txtMatrixObject[TXT_IMAGE_ADJUST_COLOR_CORRECT_AB] = TextCtrl('setup_imageAdjust_matrix_control_form', 'setup_imageadjust_color_correct_ab_label', NPTZ_WORDING.wiD_0904);
                colorCorrectABRadioButtonGroup = RadioButtonGroupCtrl('setup_imageAdjust_matrix_control_form', "setup_imageadjust_color_correct_ab_", RADIO_GROUP.rID_0093, getcolorCorrectABValue(), callbackcolorCorrectAB);
                LineCtrl('setup_imageAdjust_matrix_control_form', 'horizontal', 1025, 0, "", "setup_imageadjust_color_correct_ab_label", "4");

                // // Image adjust matrix control area
                // var maintitle = TextCtrl('setup_imageAdjust_matrix_control_form', 'setup_imageAdjust_matrixType_label', NPTZ_WORDING.wID_0326);
                // maintitle.show();
                // // matrix type select
                // selectImageAdjustMatrixType = SelectCtrl('setup_imageAdjust_matrix_control_form', "", "setup_imageAdjust_matrixType_select", "setup_imageAdjust_matrixType_select", '', '', IMAGE_ADJUST_MATRIX_TYPE, getMatrixTypeValue());
                // selectImageAdjustMatrixType.show();
                // selectImageAdjustMatrixType.displayOn();

                // imageAdjust_matrixSetup_button = ButtonCtrl("setup_imageAdjust_matrix_control_form", "setup_imageAdjust_matrix_control_setup_button", NPTZ_WORDING.wID_0141, callbackMatrixSetupButton);
                // imageAdjust_matrixSetup_button.getButtonObject().addClass('button_class');
                // imageAdjust_matrixSetup_button.show();
                // imageAdjust_matrixSetup_button.displayOff();

                // //Matrix Adaptive Matrix
                // adaptiveMatrix_text = TextCtrl('setup_imageAdjust_matrix_control_form', 'adaptiveMatrix_text', NPTZ_WORDING.wID_0462);
                // adaptiveMatrix_text.show();
                // adaptiveMatrix_radio = RadioButtonGroupCtrl("setup_imageAdjust_matrix_control_form", "adaptiveMatrix_radio", RADIO_GROUP.rID_0016, '0', callbackAdaptiveMatrix);

                // // matrix title
                // txtImageAdjustMatrixTitle = TextCtrl('setup_imageAdjust_matrix_title', 'setup_imageAdjust_matrix_title_label', NPTZ_WORDING.wID_0327);
                // txtImageAdjustMatrixTitle.show();

                // liqiang change
                ImgCtrl('dragCanvas', "../img/COLOR CORRECTION_grid.png", 199, 28, "", 361, 361);
                ImgCtrl('dragCanvas', "../img/R.png", 353, 28, 53, 82, "R", 374, 22);
                ImgCtrl('dragCanvas', "../img/MG_R.png", 406, 39, 86, 97, "MG_R", 472, 44);
                ImgCtrl('dragCanvas', "../img/MG.png", 452, 96, 96, 86, "MG", 540, 117);
                ImgCtrl('dragCanvas', "../img/B_MG.png", 479, 182, 81, 52, "B_MG", 565, 212);
                ImgCtrl('dragCanvas', "../img/B.png", 452, 235, 96, 86, "B", 545, 306);
                ImgCtrl('dragCanvas', "../img/CY_B.png", 406, 281, 86, 96, "CY_B", 476, 377);
                ImgCtrl('dragCanvas', "../img/CY.png", 353, 308, 52, 81, "CY", 369, 408);
                ImgCtrl('dragCanvas', "../img/G_CY.png", 267, 281, 86, 96, "G_CY", 236, 383);
                ImgCtrl('dragCanvas', "../img/G.png", 210, 235, 96, 86, "G", 199, 306);
                ImgCtrl('dragCanvas', "../img/YE_G.png", 199, 182, 81, 52, "YE_G", 135, 212);
                ImgCtrl('dragCanvas', "../img/YE.png", 210, 96, 96, 86, "YE", 190, 117);
                ImgCtrl('dragCanvas', "../img/R_YE.png", 267, 39, 86, 96, "R_YE", 233, 43);

                // // matrix setting title
                // txtImageAdjustMatrixSettingTitle = TextCtrl('setup_imageAdjust_matrix_control_form', 'setup_imageAdjust_matrixSettings_title_label', NPTZ_WORDING.wID_0328);
                // txtImageAdjustMatrixSettingTitle.show();

                // // Linear Matrix label
                txtMatrixObject[TXT_IMAGE_ADJUST_MATRIX_LINEAR_MATRIX] = TextCtrl('setup_imageAdjust_detail_matrix_linearMatrix_title', 'setup_imageAdjust_detail_matrix_linearMatrix_label', NPTZ_WORDING.wID_0894);
                // LineCtrl('setup_imageAdjust_matrix_control_form', 'horizontal', 68, 19, 798, "setup_imageAdjust_detail_matrix_linearMatrix_label", 100);
                btnObject[MATRIX_COLOR_CORRECTION] = ButtonCtrl("setup_imageAdjust_detail_matrix_linearMatrix_title", "matrix_color_correction_btn", "", callbackTracking);
                btnObject[MATRIX_COLOR_CORRECTION].show();
                btnObject[MATRIX_COLOR_CORRECTION].displayOff();


                // Linear radar
                // txtMatrixObject[] = 
                //Color Correction label
                txtMatrixObject[TXT_IMAGE_ADJUST_MATRIX_CORRECTION_COLOR] = TextCtrl('setup_imageAdjust_detail_matrix_Correction_title', 'setup_imageAdjust_detail_matrix_Correction_color_label', NPTZ_WORDING.wID_0337);
                txtMatrixObject[TXT_IMAGE_ADJUST_MATRIX_CORRECTION_SATURATION] = TextCtrl('setup_imageAdjust_detail_matrix_Correction_title', 'setup_imageAdjust_detail_matrix_Correction_saturation_label', NPTZ_WORDING.wID_0897);
                txtMatrixObject[TXT_IMAGE_ADJUST_MATRIX_CORRECTION_PHASE] = TextCtrl('setup_imageAdjust_detail_matrix_Correction_title', 'setup_imageAdjust_detail_matrix_Correction_phase_label', NPTZ_WORDING.wID_0898);


                // R-G label
                txtMatrixObject[TXT_IMAGE_ADJUST_MATRIX_R_G] = TextCtrl('setup_imageAdjust_detail_matrix_linearMatrix_label', 'setup_imageAdjust_matrix_R_G_label', NPTZ_WORDING.wID_0330);
                // R-G slider
                sliderMatrix_R_G = SliderCtrl('setup_imageAdjust_detail_matrix_linearMatrix_form', 'setup_imageAdjust_matrix_R_G_slider', 31, -31, getMatrixRGValue(), callbackMatrixRG, null, null, null, null, null, null, null, null, null, true);
                // R-G slider phase
                sliderMatrix_R_G_phase = SliderCtrl('setup_imageAdjust_detail_matrix_linearMatrix_form', 'setup_imageAdjust_matrix_R_G_right_slider', 31, -31, getMatrixRGPhaseValue(), callbackMatrixRGRight, null, null, null, null, null, null, null, null, null, true);
                LineCtrl('setup_imageAdjust_detail_matrix_linearMatrix_form', 'horizontal', 68, 19, 760, "setup_imageAdjust_matrix_R_G_label", "92");

                // R-B label
                txtMatrixObject[
                    TXT_IMAGE_ADJUST_MATRIX_R_B] = TextCtrl('setup_imageAdjust_detail_matrix_linearMatrix_label', 'setup_imageAdjust_matrix_R_B_label', NPTZ_WORDING.wID_0331);
                // R-B slider
                sliderMatrix_R_B = SliderCtrl('setup_imageAdjust_detail_matrix_linearMatrix_form', 'setup_imageAdjust_matrix_R_B_slider', 31, -31, getMatrixRBPhaseValue(), callbackMatrixRB, null, null, null, null, null, null, null, null, null, true);
                // R-B slider phase
                sliderMatrix_R_B_phase = SliderCtrl('setup_imageAdjust_detail_matrix_linearMatrix_form', 'setup_imageAdjust_matrix_R_B_right_slider', 31, -31, getMatrixRBRightValue(), callbackMatrixRBRight, null, null, null, null, null, null, null, null, null, true);
                LineCtrl('setup_imageAdjust_detail_matrix_linearMatrix_form', 'horizontal', 136, 19, 760, "setup_imageAdjust_matrix_R_B_label", "92");

                // G-R label
                txtMatrixObject[TXT_IMAGE_ADJUST_MATRIX_G_R] = TextCtrl('setup_imageAdjust_detail_matrix_linearMatrix_label', 'setup_imageAdjust_matrix_G_R_label', NPTZ_WORDING.wID_0332);
                // G-R slider
                sliderMatrix_G_R = SliderCtrl('setup_imageAdjust_detail_matrix_linearMatrix_form', 'setup_imageAdjust_matrix_G_R_slider', 31, -31, getMatrixGRValue(), callbackMatrixGR, null, null, null, null, null, null, null, null, null, true);
                // G-R slider phase
                sliderMatrix_G_R_phase = SliderCtrl('setup_imageAdjust_detail_matrix_linearMatrix_form', 'setup_imageAdjust_matrix_G_R_right_slider', 31, -31, getMatrixGRRightValue(), callbackMatrixGRRight, null, null, null, null, null, null, null, null, null, true);
                LineCtrl('setup_imageAdjust_detail_matrix_linearMatrix_form', 'horizontal', 204, 19, 760, "setup_imageAdjust_matrix_G_R_label", "92");

                // G-B label
                txtMatrixObject[TXT_IMAGE_ADJUST_MATRIX_G_B] = TextCtrl('setup_imageAdjust_detail_matrix_linearMatrix_label', 'setup_imageAdjust_matrix_G_B_label', NPTZ_WORDING.wID_0333);
                // G-B slider
                sliderMatrix_G_B = SliderCtrl('setup_imageAdjust_detail_matrix_linearMatrix_form', 'setup_imageAdjust_matrix_G_B_slider', 31, -31, getMatrixGBValue(), callbackMatrixGB, null, null, null, null, null, null, null, null, null, true);
                // G-B slider phase
                sliderMatrix_G_B_phase = SliderCtrl('setup_imageAdjust_detail_matrix_linearMatrix_form', 'setup_imageAdjust_matrix_G_B_right_slider', 31, -31, getMatrixGBRightValue(), callbackMatrixGBRight, null, null, null, null, null, null, null, null, null, true);
                LineCtrl('setup_imageAdjust_detail_matrix_linearMatrix_form', 'horizontal', 272, 19, 760, "setup_imageAdjust_matrix_G_B_label", "92");

                // B-R label
                txtMatrixObject[TXT_IMAGE_ADJUST_MATRIX_B_R] = TextCtrl('setup_imageAdjust_detail_matrix_linearMatrix_label', 'setup_imageAdjust_matrix_B_R_label', NPTZ_WORDING.wID_0334);
                // B-R slider
                sliderMatrix_B_R = SliderCtrl('setup_imageAdjust_detail_matrix_linearMatrix_form', 'setup_imageAdjust_matrix_B_R_slider', 31, -31, getMatrixBRValue(), callbackMatrixBR, null, null, null, null, null, null, null, null, null, true);
                // B-R slider phase
                sliderMatrix_B_R_phase = SliderCtrl('setup_imageAdjust_detail_matrix_linearMatrix_form', 'setup_imageAdjust_matrix_B_R_right_slider', 31, -31, getMatrixBRRightValue(), callbackMatrixBRRight, null, null, null, null, null, null, null, null, null, true);
                LineCtrl('setup_imageAdjust_detail_matrix_linearMatrix_form', 'horizontal', 340, 19, 760, "setup_imageAdjust_matrix_B_R_label", "92");

                // B-G label
                txtMatrixObject[TXT_IMAGE_ADJUST_MATRIX_B_G] = TextCtrl('setup_imageAdjust_detail_matrix_linearMatrix_label', 'setup_imageAdjust_matrix_B_G_label', NPTZ_WORDING.wID_0335);
                // B-G slider
                sliderMatrix_B_G = SliderCtrl('setup_imageAdjust_detail_matrix_linearMatrix_form', 'setup_imageAdjust_matrix_B_G_slider', 31, -31, getMatrixBGValue(), callbackMatrixBG, null, null, null, null, null, null, null, null, null, true);
                // B-G slider phase
                sliderMatrix_B_G_phase = SliderCtrl('setup_imageAdjust_detail_matrix_linearMatrix_form', 'setup_imageAdjust_matrix_B_G_right_slider', 31, -31, getMatrixBGRightValue(), callbackMatrixBGRight, null, null, null, null, null, null, null, null, null, true);

                // radar
                linearMatrix();

                txtMatrixObject[TXT_IMAGE_ADJUST_MATRIX_COLORCORRECTION_COLOR] = TextCtrl('setup_imageAdjust_detail_matrix_colorCorrection_title', 'setup_imageAdjust_detail_matrix_colorCorrection_color_label', NPTZ_WORDING.wID_0337);
                txtMatrixObject[TXT_IMAGE_ADJUST_MATRIX_COLORCORRECTION_SATURATION] = TextCtrl('setup_imageAdjust_detail_matrix_colorCorrection_title', 'setup_imageAdjust_detail_matrix_colorCorrection_saturation_label', NPTZ_WORDING.wID_0340);
                txtMatrixObject[TXT_IMAGE_ADJUST_MATRIX_COLORCORRECTION_PHASE] = TextCtrl('setup_imageAdjust_detail_matrix_colorCorrection_title', 'setup_imageAdjust_detail_matrix_colorCorrection_phase_label', NPTZ_WORDING.wID_0339);


                // R label
                txtMatrixObject[TXT_IMAGE_ADJUST_MATRIX_R] = TextCtrl('setup_imageAdjust_detail_matrix_colorCorrection_label', 'setup_imageAdjust_matrix_R_label', NPTZ_WORDING.wID_0345);
                // R Saturation slider
                sliderMatrix_R_saturation = SliderCtrl('setup_imageAdjust_detail_matrix_colorCorrection_form', 'setup_imageAdjust_matrix_R_saturation_slider', 126, -127, getMatrixRSaturationValue(), callbackMatrixRSaturation, null, null, null, null, null, null, null, null, 'SATURATION_slider', true);
                // R phase slider
                sliderMatrix_R_phase = SliderCtrl('setup_imageAdjust_detail_matrix_colorCorrection_form', 'setup_imageAdjust_matrix_R_phase_slider', 126, -127, getMatrixRPhaseValue(), callbackMatrixRPhase, null, null, null, null, null, null, null, null, 'R_slider', true);
                LineCtrl('setup_imageAdjust_detail_matrix_colorCorrection_form', 'horizontal', 340, 19, 760, "setup_imageAdjust_matrix_R_label", "92");

                // R_YE
                txtMatrixObject[TXT_IMAGE_ADJUST_MATRIX_R_Yl] = TextCtrl('setup_imageAdjust_detail_matrix_colorCorrection_label', 'setup_imageAdjust_matrix_R_Yl_label', NPTZ_WORDING.wID_0347);
                // R_YE Saturation slider
                sliderMatrix_R_Yl_saturation = SliderCtrl('setup_imageAdjust_detail_matrix_colorCorrection_form', 'setup_imageAdjust_matrix_R_Yl_saturation_slider', 126, -127, getMatrixRYlSaturationValue(), callbackMatrixRYlSaturation, null, null, null, null, null, null, null, null, 'SATURATION_slider', true);
                // R_YE phase slider
                sliderMatrix_R_Yl_phase = SliderCtrl('setup_imageAdjust_detail_matrix_colorCorrection_form', 'setup_imageAdjust_matrix_R_Yl_phase_slider', 126, -127, getMatrixRYlPhaseValue(), callbackMatrixRYlPhase, null, null, null, null, null, null, null, null, 'R_YE_slider', true);
                LineCtrl('setup_imageAdjust_detail_matrix_colorCorrection_form', 'horizontal', 476, 19, 760, "setup_imageAdjust_matrix_R_Yl_label", "92");

                // Yl
                txtMatrixObject[TXT_IMAGE_ADJUST_MATRIX_Yl] = TextCtrl('setup_imageAdjust_detail_matrix_colorCorrection_label', 'setup_imageAdjust_matrix_Yl_label', NPTZ_WORDING.wID_0349);
                // Yl Saturation slider
                sliderMatrix_Yl_saturation = SliderCtrl('setup_imageAdjust_detail_matrix_colorCorrection_form', 'setup_imageAdjust_matrix_Yl_saturation_slider', 126, -127, getMatrixYlSaturationValue(), callbackMatrixYlSaturation, null, null, null, null, null, null, null, null, 'SATURATION_slider', true);
                // Yl phase slider
                sliderMatrix_Yl_phase = SliderCtrl('setup_imageAdjust_detail_matrix_colorCorrection_form', 'setup_imageAdjust_matrix_Yl_phase_slider', 126, -127, getMatrixYlPhaseValue(), callbackMatrixYlPhase, null, null, null, null, null, null, null, null, 'YE_slider', true);
                LineCtrl('setup_imageAdjust_detail_matrix_colorCorrection_form', 'horizontal', 612, 19, 760, "setup_imageAdjust_matrix_Yl_label", "92");

                // Yl_G
                txtMatrixObject[TXT_IMAGE_ADJUST_MATRIX_Yl_G] = TextCtrl('setup_imageAdjust_detail_matrix_colorCorrection_label', 'setup_imageAdjust_matrix_Yl_G_label', NPTZ_WORDING.wID_0351);
                // Yl_G Saturation slider
                sliderMatrix_Yl_G_saturation = SliderCtrl('setup_imageAdjust_detail_matrix_colorCorrection_form', 'setup_imageAdjust_matrix_Yl_G_saturation_slider', 126, -127, getMatrixYlGSaturationValue(), callbackMatrixYlGSaturation, null, null, null, null, null, null, null, null, 'SATURATION_slider', true);
                // Yl_G phase slider
                sliderMatrix_Yl_G_phase = SliderCtrl('setup_imageAdjust_detail_matrix_colorCorrection_form', 'setup_imageAdjust_matrix_Yl_G_phase_slider', 126, -127, getMatrixYlGPhaseValue(), callbackMatrixYlGPhase, null, null, null, null, null, null, null, null, 'YE_G_slider', true);
                LineCtrl('setup_imageAdjust_detail_matrix_colorCorrection_form', 'horizontal', 748, 19, 760, "setup_imageAdjust_matrix_Yl_G_label", "92");

                // G
                txtMatrixObject[TXT_IMAGE_ADJUST_MATRIX_G] = TextCtrl('setup_imageAdjust_detail_matrix_colorCorrection_label', 'setup_imageAdjust_matrix_G_label', NPTZ_WORDING.wID_0544);
                // G Saturation slider
                sliderMatrix_G_saturation = SliderCtrl('setup_imageAdjust_detail_matrix_colorCorrection_form', 'setup_imageAdjust_matrix_G_saturation_slider', 126, -127, getMatrixGSaturationValue(), callbackMatrixGSaturation, null, null, null, null, null, null, null, null, 'SATURATION_slider', true);
                // G phase slider
                sliderMatrix_G_phase = SliderCtrl('setup_imageAdjust_detail_matrix_colorCorrection_form', 'setup_imageAdjust_matrix_G_phase_slider', 126, -127, getMatrixGPhaseValue(), callbackMatrixGPhase, null, null, null, null, null, null, null, null, 'G_slider', true);
                LineCtrl('setup_imageAdjust_detail_matrix_colorCorrection_form', 'horizontal', 816, 19, 760, "setup_imageAdjust_matrix_G_label", "92");

                // G_Cy
                txtMatrixObject[TXT_IMAGE_ADJUST_MATRIX_G_Cy] = TextCtrl('setup_imageAdjust_detail_matrix_colorCorrection_label', 'setup_imageAdjust_matrix_G_Cy_label', NPTZ_WORDING.wID_0352);
                // G_Cy Saturation slider
                sliderMatrix_G_Cy_saturation = SliderCtrl('setup_imageAdjust_detail_matrix_colorCorrection_form', 'setup_imageAdjust_matrix_G_Cy_saturation_slider', 126, -127, getMatrixGCySaturationValue(), callbackMatrixGCySaturation, null, null, null, null, null, null, null, null, 'SATURATION_slider', true);
                // G_Cy phase slider
                sliderMatrix_G_Cy_phase = SliderCtrl('setup_imageAdjust_detail_matrix_colorCorrection_form', 'setup_imageAdjust_matrix_G_Cy_phase_slider', 126, -127, getMatrixGCyPhaseValue(), callbackMatrixGCyPhase, null, null, null, null, null, null, null, null, 'G_CY_slider', true);
                LineCtrl('setup_imageAdjust_detail_matrix_colorCorrection_form', 'horizontal', 884, 19, 760, "setup_imageAdjust_matrix_G_Cy_label", "92");

                // CY
                txtMatrixObject[TXT_IMAGE_ADJUST_MATRIX_Cy] = TextCtrl('setup_imageAdjust_detail_matrix_colorCorrection_label', 'setup_imageAdjust_matrix_Cy_label', NPTZ_WORDING.wID_0353);
                // Cy Saturation slider
                sliderMatrix_Cy_saturation = SliderCtrl('setup_imageAdjust_detail_matrix_colorCorrection_form', 'setup_imageAdjust_matrix_Cy_saturation_slider', 126, -127, getMatrixCySaturationValue(), callbackMatrixCySaturation, null, null, null, null, null, null, null, null, 'SATURATION_slider', true);
                // Cy phase slider
                sliderMatrix_Cy_phase = SliderCtrl('setup_imageAdjust_detail_matrix_colorCorrection_form', 'setup_imageAdjust_matrix_Cy_phase_slider', 126, -127, getMatrixCyPhaseValue(), callbackMatrixCyPhase, null, null, null, null, null, null, null, null, 'CY_slider', true);
                LineCtrl('setup_imageAdjust_detail_matrix_colorCorrection_form', 'horizontal', 952, 19, 760, "setup_imageAdjust_matrix_Cy_label", "92");

                // Cy_B
                txtMatrixObject[TXT_IMAGE_ADJUST_MATRIX_Cy_B] = TextCtrl('setup_imageAdjust_detail_matrix_colorCorrection_label', 'setup_imageAdjust_matrix_Cy_B_label', NPTZ_WORDING.wID_0354);
                // Cy_B Saturation slider
                sliderMatrix_Cy_B_saturation = SliderCtrl('setup_imageAdjust_detail_matrix_colorCorrection_form', 'setup_imageAdjust_matrix_Cy_B_saturation_slider', 126, -127, getMatrixCyBSaturationValue(), callbackMatrixCyBSaturation, null, null, null, null, null, null, null, null, 'SATURATION_slider', true);
                // Cy_B phase slider
                sliderMatrix_Cy_B_phase = SliderCtrl('setup_imageAdjust_detail_matrix_colorCorrection_form', 'setup_imageAdjust_matrix_Cy_B_phase_slider', 126, -127, getMatrixCyBPhaseValue(), callbackMatrixCyBPhase, null, null, null, null, null, null, null, null, 'CY_B_slider', true);
                LineCtrl('setup_imageAdjust_detail_matrix_colorCorrection_form', 'horizontal', 1020, 19, 760, "setup_imageAdjust_matrix_Cy_B_label", "92");

                // B
                txtMatrixObject[TXT_IMAGE_ADJUST_MATRIX_B] = TextCtrl('setup_imageAdjust_detail_matrix_colorCorrection_label', 'setup_imageAdjust_matrix_B_label', NPTZ_WORDING.wID_0355);
                // B Saturation slider
                sliderMatrix_B_saturation = SliderCtrl('setup_imageAdjust_detail_matrix_colorCorrection_form', 'setup_imageAdjust_matrix_B_saturation_slider', 126, -127, getMatrixBSaturationValue(), callbackMatrixBSaturation, null, null, null, null, null, null, null, null, 'SATURATION_slider', true);
                // B phase slider
                sliderMatrix_B_phase = SliderCtrl('setup_imageAdjust_detail_matrix_colorCorrection_form', 'setup_imageAdjust_matrix_B_phase_slider', 126, -127, getMatrixBPhaseValue(), callbackMatrixBPhase, null, null, null, null, null, null, null, null, 'B_slider', true);
                LineCtrl('setup_imageAdjust_detail_matrix_colorCorrection_form', 'horizontal', 1088, 19, 760, "setup_imageAdjust_matrix_B_label", "92");

                // B_MG label
                txtMatrixObject[TXT_IMAGE_ADJUST_MATRIX_B_MG] = TextCtrl('setup_imageAdjust_detail_matrix_colorCorrection_label', 'setup_imageAdjust_matrix_B_MG_label', NPTZ_WORDING.wID_0341);
                // B_MG Saturation slider
                sliderMatrix_B_MG_saturation = SliderCtrl('setup_imageAdjust_detail_matrix_colorCorrection_form', 'setup_imageAdjust_matrix_B_MG_saturation_slider', 126, -127, getMatrixBMGSaturationValue(), callbackMatrixBMGSaturation, null, null, null, null, null, null, null, null, 'SATURATION_slider', true);
                // B_MG phase slider
                sliderMatrix_B_MG_phase = SliderCtrl('setup_imageAdjust_detail_matrix_colorCorrection_form', 'setup_imageAdjust_matrix_B_MG_phase_slider', 126, -127, getMatrixBMGPhaseValue(), callbackMatrixBMGPhase, null, null, null, null, null, null, null, null, 'B_MG_slider', true);
                LineCtrl('setup_imageAdjust_detail_matrix_colorCorrection_form', 'horizontal', 69, 19, 760, "setup_imageAdjust_matrix_B_MG_label", "92");

                // Mg label
                txtMatrixObject[TXT_IMAGE_ADJUST_MATRIX_MG] = TextCtrl('setup_imageAdjust_detail_matrix_colorCorrection_label', 'setup_imageAdjust_matrix_Mg_label', NPTZ_WORDING.wID_0342);
                // Mg Saturation slider
                sliderMatrix_Mg_saturation = SliderCtrl('setup_imageAdjust_detail_matrix_colorCorrection_form', 'setup_imageAdjust_matrix_Mg_saturation_slider', 126, -127, getMatrixMGSaturationValue(), callbackMatrixMGSaturation, null, null, null, null, null, null, null, null, 'SATURATION_slider', true);
                // Mg phase slider
                sliderMatrix_Mg_phase = SliderCtrl('setup_imageAdjust_detail_matrix_colorCorrection_form', 'setup_imageAdjust_matrix_Mg_phase_slider', 126, -127, getMatrixMGPhaseValue(), callbackMatrixMGPhase, null, null, null, null, null, null, null, null, 'MG_slider', true);
                LineCtrl('setup_imageAdjust_detail_matrix_colorCorrection_form', 'horizontal', 138, 19, 760, "setup_imageAdjust_matrix_Mg_label", "92");

                // Mg_R label
                txtMatrixObject[TXT_IMAGE_ADJUST_MATRIX_MG_R] = TextCtrl('setup_imageAdjust_detail_matrix_colorCorrection_label', 'setup_imageAdjust_matrix_Mg_R_label', NPTZ_WORDING.wID_0343);
                // Mg_R Saturation slider
                sliderMatrix_Mg_R_saturation = SliderCtrl('setup_imageAdjust_detail_matrix_colorCorrection_form', 'setup_imageAdjust_matrix_Mg_R_saturation_slider', 126, -127, getMatrixMGRSaturationValue(), callbackMatrixMGRSaturation, null, null, null, null, null, null, null, null, 'SATURATION_slider', true);
                // Mg_R phase slider
                sliderMatrix_Mg_R_phase = SliderCtrl('setup_imageAdjust_detail_matrix_colorCorrection_form', 'setup_imageAdjust_matrix_Mg_R_phase_slider', 126, -127, getMatrixMGRPhaseValue(), callbackMatrixMGRPhase, null, null, null, null, null, null, null, null, 'MG_R_slider', true);
                LineCtrl('setup_imageAdjust_detail_matrix_colorCorrection_form', 'horizontal', 206, 19, 760, "setup_imageAdjust_matrix_Mg_R_label", "92");


                // Saturation label
                txtMatrixObject[TXT_IMAGE_ADJUST_MATRIX_Saturation] = TextCtrl('setup_imageAdjust_detail_matrix_colorCorrection_label', 'setup_imageAdjust_detail_matrix_colorCorrection_Saturation_n_label', NPTZ_WORDING.wID_0339);
                LineCtrl('setup_imageAdjust_detail_matrix_colorCorrection_form', 'horizontal', 0, 19, 760, "setup_imageAdjust_detail_matrix_colorCorrection_Saturation_n_label", "76");
                //Phase
                txtMatrixObject[TXT_IMAGE_ADJUST_MATRIX_Phase] = TextCtrl('setup_imageAdjust_detail_matrix_colorCorrection_label', 'setup_imageAdjust_detail_matrix_colorCorrection_Phase_n_label', NPTZ_WORDING.wID_0340);
                LineCtrl('setup_imageAdjust_detail_matrix_colorCorrection_form', 'horizontal', 0, 19, 760, "setup_imageAdjust_detail_matrix_colorCorrection_Phase_n_label", "76");

                txtMatrixObject[TXT_IMAGE_ADJUST_MATRIX_Saturation_s] = TextCtrl('setup_imageAdjust_detail_matrix_colorCorrection_label', 'setup_imageAdjust_detail_matrix_colorCorrection_Saturation_s_label', NPTZ_WORDING.wID_0339);
                LineCtrl('setup_imageAdjust_detail_matrix_colorCorrection_form', 'horizontal', 0, 19, 760, "setup_imageAdjust_detail_matrix_colorCorrection_Saturation_s_label", "76");

                txtMatrixObject[TXT_IMAGE_ADJUST_MATRIX_Phase_p] = TextCtrl('setup_imageAdjust_detail_matrix_colorCorrection_label', 'setup_imageAdjust_detail_matrix_colorCorrection_Phase_p_label', NPTZ_WORDING.wID_0340);
                LineCtrl('setup_imageAdjust_detail_matrix_colorCorrection_form', 'horizontal', 0, 19, 760, "setup_imageAdjust_detail_matrix_colorCorrection_Phase_p_label", "76");

                txtMatrixObject[TXT_IMAGE_ADJUST_MATRIX_Saturation_a] = TextCtrl('setup_imageAdjust_detail_matrix_colorCorrection_label', 'setup_imageAdjust_detail_matrix_colorCorrection_Saturation_a_label', NPTZ_WORDING.wID_0339);
                LineCtrl('setup_imageAdjust_detail_matrix_colorCorrection_form', 'horizontal', 0, 19, 760, "setup_imageAdjust_detail_matrix_colorCorrection_Saturation_a_label", "76");

                txtMatrixObject[TXT_IMAGE_ADJUST_MATRIX_Phase_h] = TextCtrl('setup_imageAdjust_detail_matrix_colorCorrection_label', 'setup_imageAdjust_detail_matrix_colorCorrection_Phase_h_label', NPTZ_WORDING.wID_0340);
                LineCtrl('setup_imageAdjust_detail_matrix_colorCorrection_form', 'horizontal', 0, 19, 760, "setup_imageAdjust_detail_matrix_colorCorrection_Phase_h_label", "76");

                txtMatrixObject[TXT_IMAGE_ADJUST_MATRIX_Saturation_t] = TextCtrl('setup_imageAdjust_detail_matrix_colorCorrection_label', 'setup_imageAdjust_detail_matrix_colorCorrection_Saturation_t_label', NPTZ_WORDING.wID_0339);
                LineCtrl('setup_imageAdjust_detail_matrix_colorCorrection_form', 'horizontal', 0, 19, 760, "setup_imageAdjust_detail_matrix_colorCorrection_Saturation_t_label", "76");

                txtMatrixObject[TXT_IMAGE_ADJUST_MATRIX_Phase_a] = TextCtrl('setup_imageAdjust_detail_matrix_colorCorrection_label', 'setup_imageAdjust_detail_matrix_colorCorrection_Phase_a_label', NPTZ_WORDING.wID_0340);
                LineCtrl('setup_imageAdjust_detail_matrix_colorCorrection_form', 'horizontal', 0, 19, 760, "setup_imageAdjust_detail_matrix_colorCorrection_Phase_a_label", "76");

                txtMatrixObject[TXT_IMAGE_ADJUST_MATRIX_Saturation_u] = TextCtrl('setup_imageAdjust_detail_matrix_colorCorrection_label', 'setup_imageAdjust_detail_matrix_colorCorrection_Saturation_u_label', NPTZ_WORDING.wID_0339);
                LineCtrl('setup_imageAdjust_detail_matrix_colorCorrection_form', 'horizontal', 0, 19, 760, "setup_imageAdjust_detail_matrix_colorCorrection_Saturation_u_label", "76");

                txtMatrixObject[TXT_IMAGE_ADJUST_MATRIX_Phase_s] = TextCtrl('setup_imageAdjust_detail_matrix_colorCorrection_label', 'setup_imageAdjust_detail_matrix_colorCorrection_Phase_s_label', NPTZ_WORDING.wID_0340);
                LineCtrl('setup_imageAdjust_detail_matrix_colorCorrection_form', 'horizontal', 0, 19, 760, "setup_imageAdjust_detail_matrix_colorCorrection_Phase_s_label", "76");

                txtMatrixObject[TXT_IMAGE_ADJUST_MATRIX_Saturation_r] = TextCtrl('setup_imageAdjust_detail_matrix_colorCorrection_label', 'setup_imageAdjust_detail_matrix_colorCorrection_Saturation_r_label', NPTZ_WORDING.wID_0339);
                LineCtrl('setup_imageAdjust_detail_matrix_colorCorrection_form', 'horizontal', 0, 19, 760, "setup_imageAdjust_detail_matrix_colorCorrection_Saturation_r_label", "76");

                txtMatrixObject[TXT_IMAGE_ADJUST_MATRIX_Phase_e] = TextCtrl('setup_imageAdjust_detail_matrix_colorCorrection_label', 'setup_imageAdjust_detail_matrix_colorCorrection_Phase_e_label', NPTZ_WORDING.wID_0340);
                LineCtrl('setup_imageAdjust_detail_matrix_colorCorrection_form', 'horizontal', 0, 19, 760, "setup_imageAdjust_detail_matrix_colorCorrection_Phase_e_label", "76");

                txtMatrixObject[TXT_IMAGE_ADJUST_MATRIX_Saturation_i] = TextCtrl('setup_imageAdjust_detail_matrix_colorCorrection_label', 'setup_imageAdjust_detail_matrix_colorCorrection_Saturation_i_label', NPTZ_WORDING.wID_0339);
                LineCtrl('setup_imageAdjust_detail_matrix_colorCorrection_form', 'horizontal', 0, 19, 760, "setup_imageAdjust_detail_matrix_colorCorrection_Saturation_i_label", "76");

                txtMatrixObject[TXT_IMAGE_ADJUST_MATRIX_Phase_ph] = TextCtrl('setup_imageAdjust_detail_matrix_colorCorrection_label', 'setup_imageAdjust_detail_matrix_colorCorrection_Phase_ph_label', NPTZ_WORDING.wID_0340);
                LineCtrl('setup_imageAdjust_detail_matrix_colorCorrection_form', 'horizontal', 0, 19, 760, "setup_imageAdjust_detail_matrix_colorCorrection_Phase_ph_label", "76");

                txtMatrixObject[TXT_IMAGE_ADJUST_MATRIX_Saturation_o] = TextCtrl('setup_imageAdjust_detail_matrix_colorCorrection_label', 'setup_imageAdjust_detail_matrix_colorCorrection_Saturation_o_label', NPTZ_WORDING.wID_0339);
                LineCtrl('setup_imageAdjust_detail_matrix_colorCorrection_form', 'horizontal', 0, 19, 760, "setup_imageAdjust_detail_matrix_colorCorrection_Saturation_o_label", "76");

                txtMatrixObject[TXT_IMAGE_ADJUST_MATRIX_Phase_se] = TextCtrl('setup_imageAdjust_detail_matrix_colorCorrection_label', 'setup_imageAdjust_detail_matrix_colorCorrection_Phase_se_label', NPTZ_WORDING.wID_0340);
                LineCtrl('setup_imageAdjust_detail_matrix_colorCorrection_form', 'horizontal', 0, 19, 760, "setup_imageAdjust_detail_matrix_colorCorrection_Phase_se_label", "76");

                txtMatrixObject[TXT_IMAGE_ADJUST_MATRIX_Saturation_Sat] = TextCtrl('setup_imageAdjust_detail_matrix_colorCorrection_label', 'setup_imageAdjust_detail_matrix_colorCorrection_Saturation_Sat_label', NPTZ_WORDING.wID_0339);
                LineCtrl('setup_imageAdjust_detail_matrix_colorCorrection_form', 'horizontal', 0, 19, 760, "setup_imageAdjust_detail_matrix_colorCorrection_Saturation_Sat_label");

                txtMatrixObject[TXT_IMAGE_ADJUST_MATRIX_Phase_Pha] = TextCtrl('setup_imageAdjust_detail_matrix_colorCorrection_label', 'setup_imageAdjust_detail_matrix_colorCorrection_Phase_Pha_label', NPTZ_WORDING.wID_0340);
                LineCtrl('setup_imageAdjust_detail_matrix_colorCorrection_form', 'horizontal', 0, 19, 760, "setup_imageAdjust_detail_matrix_colorCorrection_Phase_Pha_label");

                txtMatrixObject[TXT_IMAGE_MATRIX_Saturation_o] = TextCtrl('setup_imageAdjust_detail_matrix_colorCorrection_label', 'setup_label', NPTZ_WORDING.wID_0339);
                LineCtrl('setup_imageAdjust_detail_matrix_colorCorrection_form', 'horizontal', 0, 19, 760, "setup_label");

                txtMatrixObject[TXT_IMAGE_MATRIX_Phase] = TextCtrl('setup_imageAdjust_detail_matrix_colorCorrection_label', 'setup_imageAdjust', NPTZ_WORDING.wID_0340);
                LineCtrl('setup_imageAdjust_detail_matrix_colorCorrection_form', 'horizontal', 0, 19, 760, "setup_imageAdjust");

                txtMatrixObject[TXT_IMAGE_MATRIX_S] = TextCtrl('setup_imageAdjust_detail_matrix_colorCorrection_label', 'setup_imageAdjust_detail', NPTZ_WORDING.wID_0339);
                LineCtrl('setup_imageAdjust_detail_matrix_colorCorrection_form', 'horizontal', 0, 19, 760, "setup_imageAdjust_detail");

                txtMatrixObject[TXT_IMAGE_MATRIX_P] = TextCtrl('setup_imageAdjust_detail_matrix_colorCorrection_label', 'setup_imageAdjust_detail_matrix', NPTZ_WORDING.wID_0340);
                LineCtrl('setup_imageAdjust_detail_matrix_colorCorrection_form', 'horizontal', 0, 19, 760, "setup_imageAdjust_detail_matrix");

                txtMatrixObject[TXT_IMAGE_MATRIX_Sa] = TextCtrl('setup_imageAdjust_detail_matrix_colorCorrection_label', 'setup_colorCorrection_Saturation_o_label', NPTZ_WORDING.wID_0339);
                LineCtrl('setup_imageAdjust_detail_matrix_colorCorrection_form', 'horizontal', 0, 19, 760, "setup_colorCorrection_Saturation_o_label");

                txtMatrixObject[TXT_IMAGE_MATRIX_h] = TextCtrl('setup_imageAdjust_detail_matrix_colorCorrection_label', 'setup_imageAdjust_detail_Phase_se_label', NPTZ_WORDING.wID_0340);
                LineCtrl('setup_imageAdjust_detail_matrix_colorCorrection_form', 'horizontal', 0, 19, 760, "setup_imageAdjust_detail_Phase_se_label");

                txtMatrixObject[TXT_IMAGE_MATRIX_Sat] = TextCtrl('setup_imageAdjust_detail_matrix_colorCorrection_label', 'setup_imageAdjust_detail_colorCorrection_Saturation_o_label', NPTZ_WORDING.wID_0339);
                LineCtrl('setup_imageAdjust_detail_matrix_colorCorrection_form', 'horizontal', 0, 19, 760, "setup_imageAdjust_detail_colorCorrection_Saturation_o_label");

                txtMatrixObject[TXT_IMAGE_MATRIX_a] = TextCtrl('setup_imageAdjust_detail_matrix_colorCorrection_label', 'setup_detail_matrix_colorCorrection_Phase_se_label', NPTZ_WORDING.wID_0340);
                LineCtrl('setup_imageAdjust_detail_matrix_colorCorrection_form', 'horizontal', 0, 19, 760, "setup_detail_matrix_colorCorrection_Phase_se_label");

                txtMatrixObject[TXT_IMAGE_MATRIX_u] = TextCtrl('setup_imageAdjust_detail_matrix_colorCorrection_label', 'setup_imageAdjust_matrix_colorCorrection_Saturation_o_label', NPTZ_WORDING.wID_0339);
                LineCtrl('setup_imageAdjust_detail_matrix_colorCorrection_form', 'horizontal', 0, 19, 760, "setup_imageAdjust_matrix_colorCorrection_Saturation_o_label");

                txtMatrixObject[TXT_IMAGE_MATRIX_s] = TextCtrl('setup_imageAdjust_detail_matrix_colorCorrection_label', 'setup_imageAdjust_detail_matrix_colorCorrection_P_label', NPTZ_WORDING.wID_0340);
                LineCtrl('setup_imageAdjust_detail_matrix_colorCorrection_form', 'horizontal', 0, 19, 760, "setup_imageAdjust_detail_matrix_colorCorrection_P_label");

                // txtMatrixObject[TXT_IMAGE_MATRIX_i] = TextCtrl('setup_imageAdjust_detail_matrix_colorCorrection_label', 'setup_imageAdjust_detail_matrix_colorCorrection_S_o_label', NPTZ_WORDING.wID_0339);
                // LineCtrl('setup_imageAdjust_detail_matrix_colorCorrection_form', 'horizontal', 0, 19, 760, "setup_imageAdjust_detail_matrix_colorCorrection_S_o_label");

                // txtMatrixObject[TXT_IMAGE_MATRIX_Phas] = TextCtrl('setup_imageAdjust_detail_matrix_colorCorrection_label', 'setup_imageAdjust_detail_matrix_colorCorrection_Phase_se', NPTZ_WORDING.wID_0340);
                // LineCtrl('setup_imageAdjust_detail_matrix_colorCorrection_form', 'horizontal', 0, 19, 760, "setup_imageAdjust_detail_matrix_colorCorrection_Phase_se");

                // txtMatrixObject[TXT_IMAGE_MATRIX_ion] = TextCtrl('setup_imageAdjust_detail_matrix_colorCorrection_label', 'setup_imageAdjust_detail_matrix_colorCorrection_o_label', NPTZ_WORDING.wID_0339);
                // LineCtrl('setup_imageAdjust_detail_matrix_colorCorrection_form', 'horizontal', 0, 19, 760, "setup_imageAdjust_detail_matrix_colorCorrection_o_label");

                // txtMatrixObject[TXT_IMAGE_MATRIX_se] = TextCtrl('setup_imageAdjust_detail_matrix_colorCorrection_label', 'setup__Phase_se_label', NPTZ_WORDING.wID_0340);
                // LineCtrl('setup_imageAdjust_detail_matrix_colorCorrection_form', 'horizontal', 0, 19, 760, "setup__Phase_se_label");


                for (var text in txtMatrixObject) {
                    txtMatrixObject[text].show();
                }
                initStatus();
                // changeMatixStatus();
                // adaptiveMatrix_radio.setSelectedValue(cparam_get_daptiveMatrix());
                initCanvas();
            } else {
                rebuild();
            }
            // var getValue = selectImageAdjustMatrixType.get();
            // if(buildScrollSuccessFlg&&getValue == 3) {
            if (buildScrollSuccessFlg) {
                buildScrollSuccessFlg = false;
                setTimeout(function () {
                    myScroll = new IScroll('#setup_imageAdjust_detail_matrix_main', {
                        preventDefault: false,
                        click: false,
                        tap: true,
                        scrollbars: true,
                        mouseWheel: true,
                        interactiveScrollbars: true,
                        shrinkScrollbars: 'scale',
                        fadeScrollbars: false,
                        useTransform: false
                    });
                    buildScrollSuccessFlg = true;
                }, 700)
                getMatrixWebWorker();
                getMatrixColorWebWorker();
            }
            localStorage.activeTab = TAB_LINEAR_MATRIX;
        }

        function initStatus() {
            if (cparam_get_v_log() == 1 && cparam_get_v_log_paint_sw() == 0) {
                presetMatrixRadioButtonGroup.setDisable("0,1,2,3,4");
                matrixRadioButtonGroup.setDisable("0,1");
                linearMatrixRadioButtonGroup.setDisable("0,1");
                linearTableRadioButtonGroup.setDisable("0,1");
                colorCorrectRadioButtonGroup.setDisable("0,1");
                colorCorrectABRadioButtonGroup.setDisable("0,1");
                disableLinearMatrix();
                disableColorCorrection();
            } else {
                presetMatrixRadioButtonGroup.setEnable("0,1,2,3,4");
                matrixRadioButtonGroup.setEnable("0,1");
                linearMatrixRadioButtonGroup.setEnable("0,1");
                linearTableRadioButtonGroup.setEnable("0,1");
                colorCorrectRadioButtonGroup.setEnable("0,1");
                colorCorrectABRadioButtonGroup.setEnable("0,1");
                if (linearMatrixRadioButtonGroup.getSelectedValue() == "1") {
                    enableLinearMatrix();
                } else {
                    disableLinearMatrix();
                }
                if (colorCorrectRadioButtonGroup.getSelectedValue() == "1") {
                    enableColorCorrection();
                } else {
                    disableColorCorrection();
                }
            }
        }
        function rebuild() {
            // adaptiveMatrix_radio.setSelectedValue(cparam_get_daptiveMatrix());
            // selectImageAdjustMatrixType.val(getMatrixTypeValue());
            sliderMatrix_R_G.setValue(getMatrixRGValue());
            sliderMatrix_R_G_phase.setValue(getMatrixRGPhaseValue());
            sliderMatrix_R_B.setValue(getMatrixRBPhaseValue());
            sliderMatrix_R_B_phase.setValue(getMatrixRBRightValue());
            sliderMatrix_G_R.setValue(getMatrixGRValue());
            sliderMatrix_G_R_phase.setValue(getMatrixGRRightValue());
            sliderMatrix_G_B.setValue(getMatrixGBValue());
            sliderMatrix_G_B_phase.setValue(getMatrixGBRightValue());
            sliderMatrix_B_R.setValue(getMatrixBRValue());
            sliderMatrix_B_R_phase.setValue(getMatrixBRRightValue());
            sliderMatrix_B_G.setValue(getMatrixBGValue());
            sliderMatrix_B_G_phase.setValue(getMatrixBGRightValue());
            sliderMatrix_B_MG_saturation.setValue(getMatrixBMGSaturationValue());
            sliderMatrix_B_MG_phase.setValue(getMatrixBMGPhaseValue());
            sliderMatrix_Mg_saturation.setValue(getMatrixMGSaturationValue());
            sliderMatrix_Mg_phase.setValue(getMatrixMGPhaseValue());
            sliderMatrix_Mg_R_saturation.setValue(getMatrixMGRSaturationValue());
            sliderMatrix_Mg_R_phase.setValue(getMatrixMGRPhaseValue());
            // sliderMatrix_Mg_R_R_saturation.setValue(getMatrixMGRRSaturationValue());
            // sliderMatrix_Mg_R_R_phase.setValue(getMatrixMGRRPhaseValue());
            sliderMatrix_R_saturation.setValue(getMatrixRSaturationValue());
            sliderMatrix_R_phase.setValue(getMatrixRPhaseValue());
            // sliderMatrix_R_R_Yl_saturation.setValue(getMatrixRRYlSaturationValue());
            // sliderMatrix_R_R_Yl_phase.setValue(getMatrixRRYlPhaseValue());
            sliderMatrix_R_Yl_saturation.setValue(getMatrixRYlSaturationValue());
            sliderMatrix_R_Yl_phase.setValue(getMatrixRYlPhaseValue());
            // sliderMatrix_R_Yl_Yl_saturation.setValue(getMatrixRYlYlSaturationValue());
            // sliderMatrix_R_Yl_Yl_phase.setValue(getMatrixRYlYlPhaseValue());
            sliderMatrix_Yl_saturation.setValue(getMatrixYlSaturationValue());
            sliderMatrix_Yl_phase.setValue(getMatrixYlPhaseValue());
            // sliderMatrix_Yl_Yl_G_saturation.setValue(getMatrixYlYlGSaturationValue());
            // sliderMatrix_Yl_Yl_G_phase.setValue(getMatrixYlYlGPhaseValue());
            sliderMatrix_Yl_G_saturation.setValue(getMatrixYlGSaturationValue());
            sliderMatrix_Yl_G_phase.setValue(getMatrixYlGPhaseValue());
            sliderMatrix_G_saturation.setValue(getMatrixGSaturationValue());
            sliderMatrix_G_phase.setValue(getMatrixGPhaseValue());
            sliderMatrix_G_Cy_saturation.setValue(getMatrixGCySaturationValue());
            sliderMatrix_G_Cy_phase.setValue(getMatrixGCyPhaseValue());
            sliderMatrix_Cy_saturation.setValue(getMatrixCySaturationValue());
            sliderMatrix_Cy_phase.setValue(getMatrixCyPhaseValue());
            sliderMatrix_Cy_B_saturation.setValue(getMatrixCyBSaturationValue());
            sliderMatrix_Cy_B_phase.setValue(getMatrixCyBPhaseValue());
            sliderMatrix_B_saturation.setValue(getMatrixBSaturationValue());
            sliderMatrix_B_phase.setValue(getMatrixBPhaseValue());
            // changeMatixStatus();
            presetMatrixRadioButtonGroup.setSelectedValue(getPresetMatrixValue());
            matrixRadioButtonGroup.setSelectedValue(getmatrixValue());
            linearMatrixRadioButtonGroup.setSelectedValue(getlinearMatrixValue());
            linearTableRadioButtonGroup.setSelectedValue(getlinearTableValue());
            colorCorrectRadioButtonGroup.setSelectedValue(getcolorCorrectValue());
            colorCorrectABRadioButtonGroup.setSelectedValue(getcolorCorrectABValue());
            initStatus();
        }
        function disableLinearMatrix() {
            // R-G slider 
            sliderMatrix_R_G.setDisable();
            // R-G slider phase
            sliderMatrix_R_G_phase.setDisable();
            // R-B slider
            sliderMatrix_R_B.setDisable();
            // R-B slider phase
            sliderMatrix_R_B_phase.setDisable();
            // G-R slider
            sliderMatrix_G_R.setDisable();
            // G-R slider phase
            sliderMatrix_G_R_phase.setDisable();
            // G-B slider
            sliderMatrix_G_B.setDisable();
            // G-B slider phase
            sliderMatrix_G_B_phase.setDisable();
            // B-R slider
            sliderMatrix_B_R.setDisable();
            // B-R slider phase
            sliderMatrix_B_R_phase.setDisable();
            // B-G slider
            sliderMatrix_B_G.setDisable();
            // B-G slider phase
            sliderMatrix_B_G_phase.setDisable();
        }
        function enableLinearMatrix() {
            // R-G slider 
            sliderMatrix_R_G.setEnable();
            // R-G slider phase
            sliderMatrix_R_G_phase.setEnable();
            // R-B slider
            sliderMatrix_R_B.setEnable();
            // R-B slider phase
            sliderMatrix_R_B_phase.setEnable();
            // G-R slider
            sliderMatrix_G_R.setEnable();
            // G-R slider phase
            sliderMatrix_G_R_phase.setEnable();
            // G-B slider
            sliderMatrix_G_B.setEnable();
            // G-B slider phase
            sliderMatrix_G_B_phase.setEnable();
            // B-R slider
            sliderMatrix_B_R.setEnable();
            // B-R slider phase
            sliderMatrix_B_R_phase.setEnable();
            // B-G slider
            sliderMatrix_B_G.setEnable();
            // B-G slider phase
            sliderMatrix_B_G_phase.setEnable();
        }
        function disableColorCorrection() {
            removeAllBorder();
            // R Saturation slider
            sliderMatrix_R_saturation.setDisable();
            // R phase slider
            sliderMatrix_R_phase.setDisable();
            // R_YE Saturation slider
            sliderMatrix_R_Yl_saturation.setDisable();
            // R_YE phase slider
            sliderMatrix_R_Yl_phase.setDisable();
            // Yl Saturation slider
            sliderMatrix_Yl_saturation.setDisable();
            // Yl phase slider
            sliderMatrix_Yl_phase.setDisable();
            // Yl_G Saturation slider
            sliderMatrix_Yl_G_saturation.setDisable();
            // Yl_G phase slider
            sliderMatrix_Yl_G_phase.setDisable();
            // G Saturation slider
            sliderMatrix_G_saturation.setDisable();
            // G phase slider
            sliderMatrix_G_phase.setDisable();
            // G_Cy Saturation slider
            sliderMatrix_G_Cy_saturation.setDisable();
            // G_Cy phase slider
            sliderMatrix_G_Cy_phase.setDisable();
            // Cy Saturation slider
            sliderMatrix_Cy_saturation.setDisable();
            // Cy phase slider
            sliderMatrix_Cy_phase.setDisable();
            // Cy_B Saturation slider
            sliderMatrix_Cy_B_saturation.setDisable();
            // Cy_B phase slider
            sliderMatrix_Cy_B_phase.setDisable();
            // B Saturation slider
            sliderMatrix_B_saturation.setDisable();
            // B phase slider
            sliderMatrix_B_phase.setDisable();
            // B_MG Saturation slider
            sliderMatrix_B_MG_saturation.setDisable();
            // B_MG phase slider
            sliderMatrix_B_MG_phase.setDisable();
            // Mg Saturation slider
            sliderMatrix_Mg_saturation.setDisable();
            // Mg phase slider
            sliderMatrix_Mg_phase.setDisable();
            // Mg_R Saturation slider
            sliderMatrix_Mg_R_saturation.setDisable();
            // Mg_R phase slider
            sliderMatrix_Mg_R_phase.setDisable();
            $("#setup_imageAdjust_matrix_img_div_cover").show();
        }
        function enableColorCorrection() {
            // R Saturation slider
            sliderMatrix_R_saturation.setEnable();
            // R phase slider
            sliderMatrix_R_phase.setEnable();
            // R_YE Saturation slider
            sliderMatrix_R_Yl_saturation.setEnable();
            // R_YE phase slider
            sliderMatrix_R_Yl_phase.setEnable();
            // Yl Saturation slider
            sliderMatrix_Yl_saturation.setEnable();
            // Yl phase slider
            sliderMatrix_Yl_phase.setEnable();
            // Yl_G Saturation slider
            sliderMatrix_Yl_G_saturation.setEnable();
            // Yl_G phase slider
            sliderMatrix_Yl_G_phase.setEnable();
            // G Saturation slider
            sliderMatrix_G_saturation.setEnable();
            // G phase slider
            sliderMatrix_G_phase.setEnable();
            // G_Cy Saturation slider
            sliderMatrix_G_Cy_saturation.setEnable();
            // G_Cy phase slider
            sliderMatrix_G_Cy_phase.setEnable();
            // Cy Saturation slider
            sliderMatrix_Cy_saturation.setEnable();
            // Cy phase slider
            sliderMatrix_Cy_phase.setEnable();
            // Cy_B Saturation slider
            sliderMatrix_Cy_B_saturation.setEnable();
            // Cy_B phase slider
            sliderMatrix_Cy_B_phase.setEnable();
            // B Saturation slider
            sliderMatrix_B_saturation.setEnable();
            // B phase slider
            sliderMatrix_B_phase.setEnable();
            // B_MG Saturation slider
            sliderMatrix_B_MG_saturation.setEnable();
            // B_MG phase slider
            sliderMatrix_B_MG_phase.setEnable();
            // Mg Saturation slider
            sliderMatrix_Mg_saturation.setEnable();
            // Mg phase slider
            sliderMatrix_Mg_phase.setEnable();
            // Mg_R Saturation slider
            sliderMatrix_Mg_R_saturation.setEnable();
            // Mg_R phase slider
            sliderMatrix_Mg_R_phase.setEnable();
            $("#setup_imageAdjust_matrix_img_div_cover").hide();
        }
        function callbackTABMatrixControl(mouse, type) {
            if (mouse == Button.MOUSE_DOWN) {
                $('#setup_imageAdjust_detail_matrix_linearMatrix_main').hide();
                $('#setup_imageAdjust_detail_matrix_colorCorrection_main').hide();
                switch (type) {
                    case TAB_LINEAR_MATRIX:
                        $('#setup_imageAdjust_detail_matrix_linearMatrix_main').show();
                        // settingBrightness.build();
                        // Platform.setCurrentPage('imageAdjust.settingBrightness');
                        break;
                    case TAB_COLOR_CORRECTION:
                        $('#setup_imageAdjust_detail_matrix_colorCorrection_main').show(100, function () {
                            $(".div_drag_R").find("img").css("display", "block");
                            $(".div_drag_R").find("p").css("display", "block");
                            getlinearMatrixValue();
                        });
                        // settingPicture.build();
                        // Platform.setCurrentPage('imageAdjust.settingPicture');
                        break;
                }

                localStorage.activeTab = type
            }
        }

        /**
         *
         */
        function callbackMatrixSetupButton(mouse) {
            if (mouse == Button.MOUSE_DOWN) {
                $("#dialog_setup").show();
                var getValue = selectImageAdjustMatrixType.get();
                cparam_set_matrixType(getValue);
                setTimeout(function () {
                    $("#dialog_setup").hide();
                }, 500);

                if (getValue != 3) {
                    if (myScroll != null) {
                        myScroll.destroy();
                        myScroll = null;
                    }
                    changeMatixStatus();
                } else {
                    if (buildScrollSuccessFlg) {
                        buildScrollSuccessFlg = false;
                        setTimeout(function () {
                            myScroll = new IScroll('#setup_imageAdjust_detail_matrix_main', {
                                preventDefault: false,
                                click: false,
                                tap: true,
                                scrollbars: true,
                                mouseWheel: true,
                                interactiveScrollbars: true,
                                shrinkScrollbars: 'scale',
                                fadeScrollbars: false,
                                useTransform: false
                            });
                            buildScrollSuccessFlg = true;
                        }, 1000)
                    }
                    setTimeout(function () {
                        rebuild();
                    }, 500)
                }
            }
        }

        /**
         *
         */
        function callbackAdaptiveMatrix(whichButton, mouse) {
            if (mouse == Button.MOUSE_DOWN) {
                $("#dialog_setup").show();
                cparam_set_daptiveMatrix(adaptiveMatrix_radio.getSelectedValue());
                setTimeout(function () {
                    $("#dialog_setup").hide();
                }, 500);
            }
        }

        function changeMatixStatus() {
            if (true || selectImageAdjustMatrixType.get() == '3') {
                $('#setup_imageAdjust_detail_matrix_main').show();
                $('.setup_imageAdjust_matrixSettings_title_label').show();
                sliderMatrix_R_G.setEnable();
                sliderMatrix_R_B.setEnable();
                sliderMatrix_G_R.setEnable();
                sliderMatrix_G_B.setEnable();
                sliderMatrix_B_R.setEnable();
                sliderMatrix_B_G.setEnable();
                sliderMatrix_B_MG_saturation.setEnable();
                sliderMatrix_B_MG_phase.setEnable();
                sliderMatrix_Mg_saturation.setEnable();
                sliderMatrix_Mg_phase.setEnable();
                sliderMatrix_Mg_R_saturation.setEnable();
                sliderMatrix_Mg_R_phase.setEnable();
                // sliderMatrix_Mg_R_R_saturation.setEnable();
                // sliderMatrix_Mg_R_R_phase.setEnable();
                sliderMatrix_R_saturation.setEnable();
                sliderMatrix_R_phase.setEnable();
                // sliderMatrix_R_R_Yl_saturation.setEnable();
                // sliderMatrix_R_R_Yl_phase.setEnable();
                sliderMatrix_R_Yl_saturation.setEnable();
                sliderMatrix_R_Yl_phase.setEnable();
                // sliderMatrix_R_Yl_Yl_saturation.setEnable();
                // sliderMatrix_R_Yl_Yl_phase.setEnable();
                sliderMatrix_Yl_saturation.setEnable();
                sliderMatrix_Yl_phase.setEnable();
                // sliderMatrix_Yl_Yl_G_saturation.setEnable();
                // sliderMatrix_Yl_Yl_G_phase.setEnable();
                sliderMatrix_Yl_G_saturation.setEnable();
                sliderMatrix_Yl_G_phase.setEnable();
                sliderMatrix_G_saturation.setEnable();
                sliderMatrix_G_phase.setEnable();
                sliderMatrix_G_Cy_saturation.setEnable();
                sliderMatrix_G_Cy_phase.setEnable();
                sliderMatrix_Cy_saturation.setEnable();
                sliderMatrix_Cy_phase.setEnable();
                sliderMatrix_Cy_B_saturation.setEnable();
                sliderMatrix_Cy_B_phase.setEnable();
                sliderMatrix_B_saturation.setEnable();
                sliderMatrix_B_phase.setEnable();
            } else {
                // $('#setup_imageAdjust_detail_matrix_main').hide();
                // $('.setup_imageAdjust_matrixSettings_title_label').hide();
            }
        }

        function getPresetMatrixValue() {
            return cparam_get_matrixType();
        }

        /**
         * ??
         */
        function callbackpresetMatrix() {
            cparam_set_matrixType(presetMatrixRadioButtonGroup.getSelectedValue());
        }

        function getmatrixValue() {
            return cparam_get_matrix();
        }

        /**
         * ??
         */
        function callbackmatrix() {
            cparam_set_matrix(matrixRadioButtonGroup.getSelectedValue());
        }

        function getlinearMatrixValue() {
            return cparam_get_linearMatrix();
        }

        /**
         * ??
         */
        function callbacklinearMatrix() {
            cparam_set_linearMatrix(linearMatrixRadioButtonGroup.getSelectedValue());
            if (linearMatrixRadioButtonGroup.getSelectedValue() == "0") {
                disableLinearMatrix();
            } else {
                enableLinearMatrix();
            }
            setCanRefresh()
        }

        function getlinearTableValue() {
            return cparam_get_linearTable();
        }

        /**
         * ??
         */
        function callbacklinearTable() {
            localStorage.canMainRefresh = "true";
            localStorage.canPopRefresh = "true";
            cparam_set_linearTable(linearTableRadioButtonGroup.getSelectedValue());

        }

        function getcolorCorrectValue() {
            return cparam_get_colorCorrect();
        }

        /**
         * ??
         */
        function callbackcolorCorrect() {
            localStorage.canMainRefresh = "true";
            localStorage.canPopRefresh = "true";
            cparam_set_colorCorrect(colorCorrectRadioButtonGroup.getSelectedValue());
            if (colorCorrectRadioButtonGroup.getSelectedValue() == "0") {
                disableColorCorrection();
            } else {
                enableColorCorrection();
            }
        }

        function getcolorCorrectABValue() {
            return cparam_get_colorCorrectAB();
        }

        /**
         * ??
         */
        function callbackcolorCorrectAB() {
            localStorage.canMainRefresh = "true";
            localStorage.canPopRefresh = "true";
            cparam_set_colorCorrectAB(colorCorrectABRadioButtonGroup.getSelectedValue());
        }

        /**
        *
        */
        function getMatrixRGValue() {
            return cparam_get_matrixRG();
        }
        /**
         *
         */
        function callbackMatrixRG() {
            // canRefresh = false;
            setCanRefresh();
            cparam_set_matrixRG(sliderMatrix_R_G.getValue());
            // canRefresh = true;
            //   dataslider[0].value[0] = sliderMatrix_R_G.getValue();
            //   settingRadar();
        }
        function callbackTracking(mouse) {
            if (mouse == Button.MOUSE_DOWN) {
                var data = {};
                if (btnObject[MATRIX_COLOR_CORRECTION].getStatus() == Button.STATUS_OFF) { //Release
                    btnObject[MATRIX_COLOR_CORRECTION].displayOn();
                    data['mode'] = "0";
                    liveModeFlg = true;
                    document.getElementById("mainViewHtml").contentWindow.liveModeFlg = true;
                    DoUpdate();
                } else if (btnObject[MATRIX_COLOR_CORRECTION].getStatus() == Button.STATUS_ON) {
                    btnObject[MATRIX_COLOR_CORRECTION].displayOff();
                    data['mode'] = "1";
                    liveModeFlg = false;
                    document.getElementById("mainViewHtml").contentWindow.liveModeFlg = false;
                    DoUpdate();
                }
            }
        }
        function DoUpdate() {
            if ("undefined" != typeof (objWindow)) {
                try {
                    objWindow.close();
                } catch (e) {

                }

            }
            var isTouch = sessionStorage.isTouchMode == 'true' ? true : false;
            if (isTouch) {
                objWindow = window.open('/admin/matrix_color_correction.html', '_blank', 'menubar=no,toolbar=no,status=no,resizable=no,width=801,height=879,top=0,left=162');
            } else {
                objWindow = window.open('/admin/matrix_color_correction.html', '_blank', 'menubar=no,toolbar=no,status=no,resizable=no,width=801,height=879,top=0,left=162');
            }
        }
        /**
         *
         */
        function getMatrixRGPhaseValue() {
            return cparam_get_matrixRGRight();

        }

        /**
         *
         */
        function callbackMatrixRGRight() {
            setCanRefresh();
            cparam_set_matrixRGRight(sliderMatrix_R_G_phase.getValue());
            //   dataslider[1].value[0] = sliderMatrix_R_G_phase.getValue();
            //   settingRadar();
        }

        /**
         *
         */
        function getMatrixRBPhaseValue() {
            return cparam_get_matrixRB();
        }

        /**
         *
         */
        function callbackMatrixRB() {
            setCanRefresh();
            cparam_set_matrixRB(sliderMatrix_R_B.getValue());
            //   dataslider[0].value[1] = sliderMatrix_R_B.getValue();
            //   settingRadar();
        }


        /**
         *
         */
        function getMatrixRBRightValue() {
            return cparam_get_matrixRBRight();
        }

        /**
         *
         */
        function callbackMatrixRBRight() {
            setCanRefresh();
            cparam_set_matrixRBRight(sliderMatrix_R_B_phase.getValue());
            //   dataslider[1].value[1] = sliderMatrix_R_B_phase.getValue();
            //   settingRadar();
        }

        /**
         *
         */
        function getMatrixGRValue() {
            return cparam_get_matrixGR();
        }

        /**
         *
         */
        function callbackMatrixGR() {
            setCanRefresh();
            cparam_set_matrixGR(sliderMatrix_G_R.getValue());
            //   dataslider[0].value[2] = sliderMatrix_G_R.getValue();
            //   settingRadar();
        }

        /**
         *
         */
        function getMatrixGRRightValue() {
            return cparam_get_matrixGRRight();
        }

        /**
         *
         */
        function callbackMatrixGRRight() {
            setCanRefresh();
            cparam_set_matrixGRRight(sliderMatrix_G_R_phase.getValue());
            //   dataslider[1].value[2] = sliderMatrix_G_R_phase.getValue();
            //   settingRadar();
        }

        /**
         *
         */
        function getMatrixGBValue() {
            return cparam_get_matrixGB();
        }

        /**
         *
         */
        function callbackMatrixGB() {
            setCanRefresh();
            cparam_set_matrixGB(sliderMatrix_G_B.getValue());
            //   dataslider[0].value[3] = sliderMatrix_G_B.getValue();
            //   settingRadar();
        }


        /**
         *
         */
        function getMatrixGBRightValue() {
            return cparam_get_matrixGBRight();
        }

        /**
         *
         */
        function callbackMatrixGBRight() {
            setCanRefresh();
            cparam_set_matrixGBRight(sliderMatrix_G_B_phase.getValue());
            //   dataslider[1].value[3] = sliderMatrix_G_B_phase.getValue();
            //   settingRadar();
        }

        /**
         *
         */
        function getMatrixBRValue() {
            return cparam_get_matrixBR();
        }

        /**
         *
         */
        function callbackMatrixBR() {
            setCanRefresh();
            cparam_set_matrixBR(sliderMatrix_B_R.getValue());
            //   dataslider[0].value[4] = sliderMatrix_B_R.getValue();
            //   settingRadar();
        }


        /**
         *
         */
        function getMatrixBRRightValue() {
            return cparam_get_matrixBRRight();
        }

        /**
         *
         */
        function callbackMatrixBRRight() {
            setCanRefresh();
            cparam_set_matrixBRRight(sliderMatrix_B_R_phase.getValue());
            //   dataslider[1].value[4] = sliderMatrix_B_R_phase.getValue();
            //   settingRadar();
        }

        /**
         *
         */
        function getMatrixBGValue() {
            return cparam_get_matrixBG();
        }

        /**
         *
         */
        function callbackMatrixBG() {
            setCanRefresh();
            cparam_set_matrixBG(sliderMatrix_B_G.getValue());
            //   dataslider[0].value[5] = sliderMatrix_B_G.getValue();
            //   settingRadar();
        }

        /**
         *
         */
        function getMatrixBGRightValue() {
            return cparam_get_matrixBGRight();
        }

        /**
         *
         */
        function callbackMatrixBGRight() {
            setCanRefresh();
            cparam_set_matrixBGRight(sliderMatrix_B_G_phase.getValue());
            //   dataslider[1].value[5] = sliderMatrix_B_G_phase.getValue();
            //   settingRadar();
        }

        /**
         *
         */
        function getMatrixBMGSaturationValue() {
            return cparam_get_bMgSaturation();
        }

        /**
         *
         */
        function callbackMatrixBMGSaturation() {
            setCanRefresh();
            canvasItems['B_MG'].setCurrentY(sliderMatrix_B_MG_saturation.getValue())
            cparam_set_bMgSaturation(sliderMatrix_B_MG_saturation.getValue());
        }


        /**
         *
         */
        function getMatrixBMGPhaseValue() {
            return cparam_get_bMgPhase();
        }

        /**
         *
         */
        function callbackMatrixBMGPhase() {
            setCanRefresh();
            canvasItems['B_MG'].setCurrentX(sliderMatrix_B_MG_phase.getValue())
            cparam_set_bMgPhase(sliderMatrix_B_MG_phase.getValue());
        }

        /**
         *
         */
        function getMatrixMGSaturationValue() {
            return cparam_get_mgSauration();
        }

        /**
         *
         */
        function callbackMatrixMGSaturation() {
            setCanRefresh();
            canvasItems['MG'].setCurrentY(sliderMatrix_Mg_saturation.getValue())
            cparam_set_mgSauration(sliderMatrix_Mg_saturation.getValue());
        }

        /**
         *
         */
        function getMatrixMGPhaseValue() {
            return cparam_get_mgPhase();
        }

        /**
         *
         */
        function callbackMatrixMGPhase() {
            setCanRefresh();
            canvasItems['MG'].setCurrentX(sliderMatrix_Mg_phase.getValue())
            cparam_set_mgPhase(sliderMatrix_Mg_phase.getValue());
        }

        /**
         *
         */
        function getMatrixMGRSaturationValue() {
            return cparam_get_mgRSaturation();
        }

        /**
         *
         */
        function callbackMatrixMGRSaturation() {
            setCanRefresh();
            canvasItems['MG_R'].setCurrentY(sliderMatrix_Mg_R_saturation.getValue())
            cparam_set_mgRSaturation(sliderMatrix_Mg_R_saturation.getValue());
        }

        /**
         *
         */
        function getMatrixMGRPhaseValue() {
            return cparam_get_mgRPhase();
        }

        /**
         *
         */
        function callbackMatrixMGRPhase() {
            setCanRefresh();
            canvasItems['MG_R'].setCurrentX(sliderMatrix_Mg_R_phase.getValue())
            cparam_set_mgRPhase(sliderMatrix_Mg_R_phase.getValue());
        }

        /**
         *
         */
        function getMatrixMGRRSaturationValue() {
            return cparam_get_mgRRSaturation();
        }

        /**
         *
         */
        // function callbackMatrixMGRRSaturation() {
        //     cparam_set_mgRRSaturation(sliderMatrix_Mg_R_R_saturation.getValue());
        // }

        /**
         *
         */
        // function getMatrixMGRRPhaseValue() {
        //     return cparam_get_mgRRPhase();
        // }

        /**
         *
         */
        function callbackMatrixMGRRPhase() {
            cparam_set_mgRRPhase(sliderMatrix_Mg_R_R_phase.getValue());
        }

        /**
         *
         */
        function getMatrixRSaturationValue() {
            return cparam_get_rSaturation();
        }

        /**
         *
         */
        function callbackMatrixRSaturation() {
            setCanRefresh();
            canvasItems['R'].setCurrentY(sliderMatrix_R_saturation.getValue())
            cparam_set_rSaturation(sliderMatrix_R_saturation.getValue());
        }

        /**
         *
         */
        function getMatrixRPhaseValue() {
            return cparam_get_rPhase();
        }

        /**
         *
         */
        function callbackMatrixRPhase() {
            setCanRefresh();
            canvasItems['R'].setCurrentX(sliderMatrix_R_phase.getValue())
            cparam_set_rPhase(sliderMatrix_R_phase.getValue());
        }

        /**
         *
         */
        function getMatrixRRYlSaturationValue() {
            return cparam_get_rRYiSaturraation();
        }

        /**
         *
         */
        // function callbackMatrixRRYlSaturation() {
        //     cparam_set_rRYiSaturraation(sliderMatrix_R_R_Yl_saturation.getValue());
        // }

        /**
         *
         */
        // function getMatrixRRYlPhaseValue() {
        //     return cparam_get_rRYiPhase();
        // }

        /**
         *
         */
        // function callbackMatrixRRYlPhase() {
        //     cparam_set_rRYiPhase(sliderMatrix_R_R_Yl_phase.getValue());
        // }

        /**
         *
         */
        function getMatrixRYlSaturationValue() {
            return cparam_get_rYiSaturation();
        }

        /**
         *
         */
        function callbackMatrixRYlSaturation() {
            setCanRefresh();
            canvasItems['R_YE'].setCurrentY(sliderMatrix_R_Yl_saturation.getValue())
            cparam_set_rYiSaturation(sliderMatrix_R_Yl_saturation.getValue());
        }

        /**
         *
         */
        function getMatrixRYlPhaseValue() {
            return cparam_get_rYiPhase();
        }

        /**
         *
         */
        function callbackMatrixRYlPhase() {
            setCanRefresh();
            canvasItems['R_YE'].setCurrentX(sliderMatrix_R_Yl_phase.getValue())
            cparam_set_rYiPhase(sliderMatrix_R_Yl_phase.getValue());
        }

        /**
         *
         */
        // function getMatrixRYlYlSaturationValue() {
        //     return cparam_get_rYiYiSaturation();
        // }

        /**
         *
         */
        // function callbackMatrixRYlYlSaturation() {
        //     cparam_set_rYiYiSaturation(sliderMatrix_R_Yl_Yl_saturation.getValue());
        // }

        /**
         *
         */
        // function getMatrixRYlYlPhaseValue() {
        //     return cparam_get_rYiYiPhase();
        // }

        /**
         *
         */
        // function callbackMatrixRYlYlPhase() {
        //     cparam_set_rYiYiPhase(sliderMatrix_R_Yl_Yl_phase.getValue());
        // }

        /**
         *
         */
        function getMatrixYlSaturationValue() {
            return cparam_get_yiSaturation();
        }

        /**
         *
         */
        function callbackMatrixYlSaturation() {
            setCanRefresh();
            canvasItems['YE'].setCurrentY(sliderMatrix_Yl_saturation.getValue())
            cparam_set_yiSaturation(sliderMatrix_Yl_saturation.getValue());
        }

        /**
         *
         */
        function getMatrixYlPhaseValue() {
            return cparam_get_yiPhase();
        }

        /**
         *
         */
        function callbackMatrixYlPhase() {
            setCanRefresh();
            canvasItems['YE'].setCurrentX(sliderMatrix_Yl_phase.getValue())
            cparam_set_yiPhase(sliderMatrix_Yl_phase.getValue());
        }

        /**
         *
         */
        // function getMatrixYlYlGSaturationValue() {
        //     return cparam_get_yiYigSaturation();
        // }

        /**
         *
         */
        // function callbackMatrixYlYlGSaturation() {
        //     cparam_set_yiYigSaturation(sliderMatrix_Yl_Yl_G_saturation.getValue());
        // }

        /**
         *
         */
        // function getMatrixYlYlGPhaseValue() {
        //     return cparam_get_yiYigPhase();
        // }

        /**
         *
         */
        // function callbackMatrixYlYlGPhase() {
        //     cparam_set_yiYigPhase(sliderMatrix_Yl_Yl_G_phase.getValue());
        // }

        /**
         *
         */
        function getMatrixYlGSaturationValue() {
            return cparam_get_yigSaturation();
        }

        /**
         *
         */
        function callbackMatrixYlGSaturation() {
            setCanRefresh();
            canvasItems['YE_G'].setCurrentY(sliderMatrix_Yl_G_saturation.getValue())
            cparam_set_yigSaturation(sliderMatrix_Yl_G_saturation.getValue());
        }

        /**
         *
         */
        function getMatrixYlGPhaseValue() {
            return cparam_get_yigPhase();
        }

        /**
         *
         */
        function callbackMatrixYlGPhase() {
            setCanRefresh();
            canvasItems['YE_G'].setCurrentX(sliderMatrix_Yl_G_phase.getValue())
            cparam_set_yigPhase(sliderMatrix_Yl_G_phase.getValue());
        }


        /**
         *
         */
        function getMatrixGSaturationValue() {
            return cparam_get_gSaturation();
        }

        /**
         *
         */
        function callbackMatrixGSaturation() {
            setCanRefresh();
            canvasItems['G'].setCurrentY(sliderMatrix_G_saturation.getValue())
            cparam_set_gSaturation(sliderMatrix_G_saturation.getValue());
        }

        /**
         *
         */
        function getMatrixGPhaseValue() {
            return cparam_get_gPhase();
        }

        /**
         *
         */
        function callbackMatrixGPhase() {
            setCanRefresh();
            canvasItems['G'].setCurrentX(sliderMatrix_G_phase.getValue())
            cparam_set_gPhase(sliderMatrix_G_phase.getValue());
        }


        /**
         *
         */
        function getMatrixGCySaturationValue() {
            return cparam_get_gCySaturation();
        }

        /**
         *
         */
        function callbackMatrixGCySaturation() {
            setCanRefresh();
            canvasItems['G_CY'].setCurrentY(sliderMatrix_G_Cy_saturation.getValue())
            cparam_set_gCySaturation(sliderMatrix_G_Cy_saturation.getValue());
        }

        /**
         *
         */
        function getMatrixGCyPhaseValue() {
            return cparam_get_gCyPhase();
        }

        /**
         *
         */
        function callbackMatrixGCyPhase() {
            setCanRefresh();
            canvasItems['G_CY'].setCurrentX(sliderMatrix_G_Cy_phase.getValue())
            cparam_set_gCyPhase(sliderMatrix_G_Cy_phase.getValue());
        }


        /**
         *
         */
        function getMatrixCySaturationValue() {
            return cparam_get_cySaturation();
        }

        /**
         *
         */
        function callbackMatrixCySaturation() {
            setCanRefresh();
            canvasItems['CY'].setCurrentY(sliderMatrix_Cy_saturation.getValue())
            cparam_set_cySaturation(sliderMatrix_Cy_saturation.getValue());
        }

        /**
         *
         */
        function getMatrixCyPhaseValue() {
            return cparam_get_cyPhase();
        }

        /**
         *
         */
        function callbackMatrixCyPhase() {
            setCanRefresh();
            canvasItems['CY'].setCurrentX(sliderMatrix_Cy_phase.getValue())
            cparam_set_cyPhase(sliderMatrix_Cy_phase.getValue());
        }


        /**
         *
         */
        function getMatrixCyBSaturationValue() {
            return cparam_get_cyBSaturation();
        }

        /**
         *
         */
        function callbackMatrixCyBSaturation() {
            setCanRefresh();
            canvasItems['CY_B'].setCurrentY(sliderMatrix_Cy_B_saturation.getValue())
            cparam_set_cyBSaturation(sliderMatrix_Cy_B_saturation.getValue());
        }

        /**
         *
         */
        function getMatrixCyBPhaseValue() {
            return cparam_get_cyBPhase();
        }

        /**
         *
         */
        function callbackMatrixCyBPhase() {
            setCanRefresh();
            canvasItems['CY_B'].setCurrentX(sliderMatrix_Cy_B_phase.getValue())
            cparam_set_cyBPhase(sliderMatrix_Cy_B_phase.getValue());
        }

        /**
         *
         */
        function getMatrixBSaturationValue() {
            return cparam_get_bSaturation();
        }

        /**
         *
         */
        function callbackMatrixBSaturation() {
            setCanRefresh();
            canvasItems['B'].setCurrentY(sliderMatrix_B_saturation.getValue())
            cparam_set_bSaturation(sliderMatrix_B_saturation.getValue());
        }

        /**
         *
         */
        function getMatrixBPhaseValue() {
            return cparam_get_bPhase();
        }

        /**
         *
         */
        function callbackMatrixBPhase() {
            setCanRefresh();
            canvasItems['B'].setCurrentX(sliderMatrix_B_phase.getValue())
            cparam_set_bPhase(sliderMatrix_B_phase.getValue());
        }

        // liqiang add
        // スライダーの惁E��
        function getDragInfo(dragNm) {
            var res = {};
            if (dragNm == "R") {
                // 角度
                // 座標X
                res.objX = sliderMatrix_R_phase;
                // 座標Y
                res.objY = sliderMatrix_R_saturation;
                // スライダー(div)のスライド幁E
                // スライダー(div)のスライド髁E
            } else if (dragNm == "R_YE") {
                res.objX = sliderMatrix_R_Yl_phase;
                res.objY = sliderMatrix_R_Yl_saturation;
            } else if (dragNm == "YE") {
                res.objX = sliderMatrix_Yl_phase;
                res.objY = sliderMatrix_Yl_saturation;
            } else if (dragNm == "YE_G") {
                res.objX = sliderMatrix_Yl_G_phase;
                res.objY = sliderMatrix_Yl_G_saturation;
            } else if (dragNm == "G") {
                res.objX = sliderMatrix_G_phase;
                res.objY = sliderMatrix_G_saturation;
            } else if (dragNm == "G_CY") {
                res.objX = sliderMatrix_G_Cy_phase;
                res.objY = sliderMatrix_G_Cy_saturation;
            } else if (dragNm == "CY") {
                res.objX = sliderMatrix_Cy_phase;
                res.objY = sliderMatrix_Cy_saturation;
            } else if (dragNm == "CY_B") {
                res.objX = sliderMatrix_Cy_B_phase;
                res.objY = sliderMatrix_Cy_B_saturation;
            } else if (dragNm == "B") {
                res.objX = sliderMatrix_B_phase;
                res.objY = sliderMatrix_B_saturation;
            } else if (dragNm == "B_MG") {
                res.objX = sliderMatrix_B_MG_phase;
                res.objY = sliderMatrix_B_MG_saturation;
            } else if (dragNm == "MG") {
                res.objX = sliderMatrix_Mg_phase;
                res.objY = sliderMatrix_Mg_saturation;
            } else if (dragNm == "MG_R") {
                res.objX = sliderMatrix_Mg_R_phase;
                res.objY = sliderMatrix_Mg_R_saturation;
            }
            return res;
        }

        function removeAllBorder() {
            $('.dragDiv').removeClass('on');
        }

        function addOneBorder(element) {
            $(element).addClass('on');
        }

        function callCGI(dragNm) {
            if (dragNm == "R") {
                callbackMatrixRPhase();
                callbackMatrixRSaturation();
            } else if (dragNm == "R_YE") {
                callbackMatrixRYlPhase();
                callbackMatrixRYlSaturation();
            } else if (dragNm == "YE") {
                callbackMatrixYlPhase();
                callbackMatrixYlSaturation();
            } else if (dragNm == "YE_G") {
                callbackMatrixYlGPhase();
                callbackMatrixYlGSaturation();
            } else if (dragNm == "G") {
                callbackMatrixGPhase();
                callbackMatrixGSaturation();
            } else if (dragNm == "G_CY") {
                callbackMatrixGCyPhase();
                callbackMatrixGCySaturation();
            } else if (dragNm == "CY") {
                callbackMatrixCyPhase();
                callbackMatrixCySaturation();
            } else if (dragNm == "CY_B") {
                callbackMatrixCyBPhase();
                callbackMatrixCyBSaturation();
            } else if (dragNm == "B") {
                callbackMatrixBPhase();
                callbackMatrixBSaturation();
            } else if (dragNm == "B_MG") {
                callbackMatrixBMGPhase();
                callbackMatrixBMGSaturation();
            } else if (dragNm == "MG") {
                callbackMatrixMGPhase();
                callbackMatrixMGSaturation();
            } else if (dragNm == "MG_R") {
                callbackMatrixMGRPhase();
                callbackMatrixMGRSaturation();
            }
        }

        function initCanvas() {

            canvasItems = {};
            $('.dragDiv').find('canvas').each(function (index, element) {
                canvasItems[$(element).attr('name')] = canvasItem(element);
            })
        }

        function canvasItem(element) {

            var canvas = document.getElementById($(element).attr('id'));
            var ctx = canvas.getContext('2d');
            var dragNm = $(element).attr('name')
            var dragInfo = getDragInfo(dragNm);
            var isDrawing = false;
            var isSelected = false;
            var harfW = (canvas.width - 2) / 2.0;
            var harfH = (canvas.height - 2) / 2.0;
            var canvasWNoBorder = canvas.width - 2;
            var canvasHNoBorder = canvas.height - 2;
            var dataX = 0;
            var dataY = 0;

            var currentX = Math.round(dragInfo.objX.getValue() / (254 / canvasWNoBorder)) + harfW;
            var currentY = Math.round((dragInfo.objY.getValue() * -1) / (254 / canvasHNoBorder)) + harfH;

            drawCycle(currentX, currentY);

            $(element).on('mousedown', function (e) {
                var vLogAndPaint = cparam_get_v_log() == 1 && cparam_get_v_log_paint_sw() == 0;
                var colorCorrect = colorCorrectRadioButtonGroup.getSelectedValue() == "1";
                if (vLogAndPaint || colorCorrect) {
                    if (isSelected) {
                        if (!isDrawing && pointInsideCircle([e.offsetX, e.offsetY], [currentX, currentY], 7)) {
                            isDrawing = true
                        }

                        removeAllBorder();
                        addOneBorder($(this).parent());
                        // clearCanvas();
                        if (isDrawing) {
                            clearCanvas();
                            drawCycle(e.offsetX, e.offsetY);
                        }
                    } else {
                        setIsSelected(true)
                        removeAllBorder();
                        addOneBorder($(this).parent());
                    }

                }
            })
            $('body').on('mouseup', function (e) {
                if (isDrawing) {
                    isDrawing = false
                }
            })

            $($(element).parent()).blur(function (e) {
                canvasItems[dragNm].setIsSelected(false)
                $(this).removeClass('on')
                e.stopPropagation();
            })

            $(element).on('mousemove', function (e) {
                if (isDrawing) {
                    if ((e.offsetX > 0 && e.offsetX < canvas.width) && (e.offsetY > 0 && e.offsetY < canvas.height)) {
                        clearCanvas();

                        dataX = Math.round(((e.offsetX - 1) - harfW) * (254 / canvasWNoBorder));
                        dataY = Math.round(((e.offsetY - 1) - harfH) * (254 / canvasHNoBorder)) * -1;

                        currentX = e.offsetX;
                        currentY = e.offsetY;

                        if (dataX == 127) {
                            dataX -= 1
                        }
                        if (dataY == 127) {
                            dataY -= 1
                        }
                        drawCycle(e.offsetX, e.offsetY);
                        dragInfo.objX.setValue(dataX);
                        dragInfo.objY.setValue(dataY);
                        callCGI(dragNm)
                    }
                }
            })

            function drawCycle(x, y) {
                ctx.beginPath();
                ctx.fillStyle = "#f9f9f9";
                ctx.arc(x, y, 7, 0, 2 * Math.PI);
                ctx.strokeStyle = "#000000";
                ctx.fill();
                ctx.stroke();

                ctx.beginPath();
                ctx.fillStyle = "#FF0000";
                ctx.arc(x, y, 3, 0, 2 * Math.PI);
                ctx.strokeStyle = "#FF0000";
                ctx.fill();
                ctx.stroke();
            }

            function clearCanvas() {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
            }

            /** 
             *  判断一个点是否在圁E��冁E�� 
             *  @param point  测试点坐栁E
             *  @param circle 圁E��E��栁E
             *  @param r 圁E��征E
             *  返回true为真，false为偁E
             *  */
            function pointInsideCircle(point, circle, r) {
                if (r === 0) return false
                var dx = circle[0] - point[0]
                var dy = circle[1] - point[1]
                return dx * dx + dy * dy <= r * r
            }

            function setIsSelected(flag) {
                isSelected = flag
            }
            return {
                setCurrentX: function (x) {
                    currentX = Math.round(x / (254 / canvasWNoBorder)) + harfW;
                    clearCanvas();
                    drawCycle(currentX, currentY)
                },
                setCurrentY: function (y) {
                    currentY = Math.round(-1 * y / (254 / canvasHNoBorder)) + harfH;
                    clearCanvas();
                    drawCycle(currentX, currentY)
                },
                setIsSelected: setIsSelected
            }
        }

        function sign(p1, p2, p3) {
            return (p1.x - p3.x) * (p2.y - p3.y) - (p2.x - p3.x) * (p1.y - p3.y);
        }

        function PointInTriangle(pt, v1, v2, v3) {
            let d1, d2, d3;
            let has_neg, has_pos;

            d1 = sign(pt, v1, v2);
            d2 = sign(pt, v2, v3);
            d3 = sign(pt, v3, v1);

            has_neg = (d1 < 0) || (d2 < 0) || (d3 < 0);
            has_pos = (d1 > 0) || (d2 > 0) || (d3 > 0);

            return !(has_neg && has_pos);
        }
        function setCanRefresh(){
            localStorage.canMainRefresh = "false"
            localStorage.canPopRefresh = "true"
        }
        function getMatrixWebWorker() {
            if (worker) {
                worker.addEventListener("message", function (event) {
                    canRefresh = localStorage.canMainRefresh == 'true' ? true : false;
                    if (event.data.MatrixFlg && canRefresh) {
                        var MatrixRGValue = event.data.getMatrixRGValue;
                        var MatrixRGphaseValue = event.data.getMatrixRGPhaseValue;
                        var MatrixRBValue = event.data.getMatrixRBPhaseValue;
                        var MatrixRBphaseValue = event.data.getMatrixRBRightValue;
                        var MatrixGRValue = event.data.getMatrixGRValue;
                        var MatrixGRphaseValue = event.data.getMatrixGRRightValue;
                        var MatrixGBValue = event.data.getMatrixGBValue;
                        var MatrixGBphaseValue = event.data.getMatrixGBRightValue;
                        var MatrixBRValue = event.data.getMatrixBRValue;
                        var MatrixBRphaseValue = event.data.getMatrixBRRightValue;
                        var MatrixBGValue = event.data.getMatrixBGValue;
                        var MatrixBGphaseValue = event.data.getMatrixBGRightValue;
                        sliderMatrix_R_G.setValue(MatrixRGValue);
                        sliderMatrix_R_G_phase.setValue(MatrixRGphaseValue);
                        sliderMatrix_R_B.setValue(MatrixRBValue);
                        sliderMatrix_R_B_phase.setValue(MatrixRBphaseValue);
                        sliderMatrix_G_R.setValue(MatrixGRValue);
                        sliderMatrix_G_R_phase.setValue(MatrixGRphaseValue);
                        sliderMatrix_G_B.setValue(MatrixGBValue);
                        sliderMatrix_G_B_phase.setValue(MatrixGBphaseValue);
                        sliderMatrix_B_R.setValue(MatrixBRValue);
                        sliderMatrix_B_R_phase.setValue(MatrixBRphaseValue);
                        sliderMatrix_B_G.setValue(MatrixBGValue);
                        sliderMatrix_B_G_phase.setValue(MatrixBGphaseValue);
                    }
                })
            }
        }

        function getMatrixColorWebWorker() {
            if (worker) {
                worker.addEventListener("message", function (event) {
                    canRefresh = localStorage.canMainRefresh == 'true' ? true : false;
                    if (event.data.MatrixColorFlg && canRefresh) {
                        var ColorRSaturationValue = event.data.getColorRSaturationValue;
                        var ColorRPhaseValue = event.data.getColorRPhaseValue;
                        var ColorRYlSaturationValue = event.data.getColorRYlSaturationValue;
                        var ColorRYlPhaseValue = event.data.getColorRYlPhaseValue;
                        var ColorYlSaturationValue = event.data.getColorYlSaturationValue;
                        var ColorYlPhaseValue = event.data.getColorYlPhaseValue;
                        var ColorYlGSaturationValue = event.data.getColorYlGSaturationValue;
                        var ColorYlGPhaseValue = event.data.getColorYlGPhaseValue;
                        var ColorGSaturationValue = event.data.getColorGSaturationValue;
                        var ColorGPhaseValue = event.data.getColorGPhaseValue;
                        var ColorGCySaturationValue = event.data.getColorGCySaturationValue;
                        var ColorGCyPhaseValue = event.data.getColorGCyPhaseValue;
                        var ColorCySaturationValue = event.data.getColorCySaturationValue;
                        var ColorCyPhaseValue = event.data.getColorCyPhaseValue;
                        var ColorCyBSaturationValue = event.data.getColorCyBSaturationValue;
                        var ColorCyBPhaseValue = event.data.getColorCyBPhaseValue;
                        var ColorBSaturationValue = event.data.getColorBSaturationValue;
                        var ColorBPhaseValue = event.data.getColorBPhaseValue;
                        var ColorBMGSaturationValue = event.data.getColorBMGSaturationValue;
                        var ColorBMGPhaseValue = event.data.getColorBMGPhaseValue;
                        var ColorMGSaturationValue = event.data.getColorMGSaturationValue;
                        var ColorMGPhaseValue = event.data.getColorMGPhaseValue;
                        var ColorMGRSaturationValue = event.data.getColorMGRSaturationValue;
                        var ColorMGRPhaseValue = event.data.getColorMGRPhaseValue;
                        sliderMatrix_R_saturation.setValue(ColorRSaturationValue);
                        canvasItems['R'].setCurrentY(ColorRSaturationValue);
                        sliderMatrix_R_phase.setValue(ColorRPhaseValue);
                        canvasItems['R'].setCurrentX(ColorRPhaseValue);
                        sliderMatrix_R_Yl_saturation.setValue(ColorRYlSaturationValue);
                        canvasItems['R_YE'].setCurrentY(ColorRYlSaturationValue)
                        sliderMatrix_R_Yl_phase.setValue(ColorRYlPhaseValue);
                        canvasItems['R_YE'].setCurrentX(ColorRYlPhaseValue);
                        sliderMatrix_Yl_saturation.setValue(ColorYlSaturationValue);
                        canvasItems['YE'].setCurrentY(ColorYlSaturationValue);
                        sliderMatrix_Yl_phase.setValue(ColorYlPhaseValue);
                        canvasItems['YE'].setCurrentX(ColorYlPhaseValue);
                        sliderMatrix_Yl_G_saturation.setValue(ColorYlGSaturationValue);
                        canvasItems['YE_G'].setCurrentY(ColorYlGSaturationValue);
                        sliderMatrix_Yl_G_phase.setValue(ColorYlGPhaseValue);
                        canvasItems['YE_G'].setCurrentX(ColorYlGPhaseValue);
                        sliderMatrix_G_saturation.setValue(ColorGSaturationValue);
                        canvasItems['G'].setCurrentY(ColorGSaturationValue);
                        sliderMatrix_G_phase.setValue(ColorGPhaseValue);
                        canvasItems['G'].setCurrentX(ColorGPhaseValue);
                        sliderMatrix_G_Cy_saturation.setValue(ColorGCySaturationValue);
                        canvasItems['G_CY'].setCurrentY(ColorGCySaturationValue);
                        sliderMatrix_G_Cy_phase.setValue(ColorGCyPhaseValue);
                        canvasItems['G_CY'].setCurrentX(ColorGCyPhaseValue);
                        sliderMatrix_Cy_saturation.setValue(ColorCySaturationValue);
                        canvasItems['CY'].setCurrentY(ColorCySaturationValue);
                        sliderMatrix_Cy_phase.setValue(ColorCyPhaseValue);
                        canvasItems['CY'].setCurrentX(ColorCyPhaseValue);
                        sliderMatrix_Cy_B_saturation.setValue(ColorCyBSaturationValue);
                        canvasItems['CY_B'].setCurrentY(ColorCyBSaturationValue);
                        sliderMatrix_Cy_B_phase.setValue(ColorCyBPhaseValue);
                        canvasItems['CY_B'].setCurrentX(ColorCyBPhaseValue);
                        sliderMatrix_B_saturation.setValue(ColorBSaturationValue);
                        canvasItems['B'].setCurrentY(ColorBSaturationValue);
                        sliderMatrix_B_phase.setValue(ColorBPhaseValue);
                        canvasItems['B'].setCurrentX(ColorBPhaseValue);
                        sliderMatrix_B_MG_saturation.setValue(ColorBMGSaturationValue);
                        canvasItems['B_MG'].setCurrentY(ColorBMGSaturationValue);
                        sliderMatrix_B_MG_phase.setValue(ColorBMGPhaseValue);
                        canvasItems['B_MG'].setCurrentX(ColorBMGPhaseValue);
                        sliderMatrix_Mg_saturation.setValue(ColorMGSaturationValue);
                        canvasItems['MG'].setCurrentY(ColorMGSaturationValue);
                        sliderMatrix_Mg_phase.setValue(ColorMGPhaseValue);
                        canvasItems['MG'].setCurrentX(ColorMGPhaseValue);
                        sliderMatrix_Mg_R_saturation.setValue(ColorMGRSaturationValue);
                        canvasItems['MG_R'].setCurrentY(ColorMGRSaturationValue);
                        sliderMatrix_Mg_R_phase.setValue(ColorMGRPhaseValue);
                        canvasItems['MG_R'].setCurrentX(ColorMGRPhaseValue);
                    }
                })
            }
        }

        return {
            build: buildSettingMatrix,
        }

        // return {
        //     build: buildImageAdjust,
        //     rebuild: rebuild,
        //     settingBrightness: settingBrightness,
        //     settingPicture: settingPicture,
        //     settingMatrix: settingMatrix
        // };
    }

    /**
     * settingGammaKnee
    * @return {{build: buildSettingGammaKnee, rebuild: rebuild}} build 構築�E琁E
    * @return {function} rebuild 再構築�E琁E
    * @constructor
    */
    function settingGammaKnee() {

        /**
        * 構築フラグ
        * @type boolean
        */
        let buildFlag_settingGammaKnee = false;



        let myScroll = null;
        let buildScrollSuccessFlg = true;
        let txtGammaObject = [];
        let TXT_GAMMA = 0;
        let TXT_GAMMA_MODE_SELECT = 1;
        let TXT_MASTER_GAMMA_MODE = 2;
        let TXT_R_GAMMA = 3;
        let TXT_B_GAMMA = 4;
        let TXT_BLACK_GAMMA = 5;
        let TXT_MASTER_BLACK_GAMMA = 6;
        let TXT_R_BLACK_GAMMA = 7;
        let TXT_B_BLACK_GAMMA = 8;
        let TXT_BLACK_GAMMA_RANGE = 9;
        let TXT_INITAIL_GAMMA = 10;

        let TXT_KNEE = 11;
        let TXT_KNEE_MODE = 12;
        let TXT_KNEE_MASTER_POINT = 13;
        let TXT_KNEE_R_POINT = 14;
        let TXT_KNEE_B_POINT = 15;
        let TXT_KNEE_MASTER_SLOPE_POINT = 16;
        let TXT_KNEE_R_SLOPE_POINT = 17;
        let TXT_KNEE_B_SLOPE_POINT = 18;
        let TXT_KNEE_AUTO_KNEE_RESPONSE = 19;

        let TXT_WHITE_CLIP = 20;
        let TXT_MASTER_WHITE_CLIP_LEVEL = 21;
        let TXT_R_WHITE_CLIP_LEVEL = 22;
        let TXT_B_WHITE_CLIP_LEVEL = 23;
        let TXT_HI_COLOR = 24;
        let TXT_HI_COLOR_LEVEL = 25;

        let TXT_DRS = 26;
        let TXT_EFFECT_DEPTH = 27;

        let gammaRadioButtonGroup;
        let gammaModeSelectRadioButtonGroup;
        let gammaBlackGammaRadioButtonGroup;
        let gammaInitialGammaRadioButtonGroup;

        let sliderMasterGamma;
        let sliderRGamma;
        let sliderBGamma;
        let sliderMasterBlackGamma;
        let sliderRBlackGamma;
        let sliderBBlackGamma;
        let sliderBlackGammaRange;

        let kneeRadioButtonGroup;
        let kneeModeRadioButtonGroup;

        let sliderKneeMasterPoint;
        let sliderKneeRPoint;
        let sliderKneeBPoint;
        let sliderKneeMasterSlope;
        let sliderKneeRSlope;
        let sliderKneeBSlope;
        let sliderAutoKneeResponse;

        let whiteClipRadioButtonGroup;
        let whiteClipHiColorRadioButtonGroup;

        let sliderMasterWhiteClipLevel;
        let sliderRWhiteClipLevel;
        let sliderBWhiteClipLevel;
        let sliderHiColorLevel;


        let drsRadioButtonGroup;
        let sliderDrsEffectDepth;

        function buildSettingGammaKnee() {

            if (myScroll != null) {
                myScroll.destroy();
                myScroll = null;
            }

            if (!buildFlag_settingGammaKnee) {

                buildFlag_settingGammaKnee = true;

                $('#gamma_setting_area h4').html(NPTZ_WORDING.wID_0742)
                txtGammaObject[TXT_GAMMA] = TextCtrl('gamma_thunk_box', 'gamma_thunk_label', NPTZ_WORDING.wID_0743);
                txtGammaObject[TXT_GAMMA_MODE_SELECT] = TextCtrl('gamma_branch_box_left', 'gamma_mode_select_label', NPTZ_WORDING.wID_0752);
                txtGammaObject[TXT_MASTER_GAMMA_MODE] = TextCtrl('gamma_branch_box_left', 'master_gamma_mode_label', NPTZ_WORDING.wID_0753);
                txtGammaObject[TXT_R_GAMMA] = TextCtrl('gamma_branch_box_left', 'r_gamma_label', NPTZ_WORDING.wID_0744);
                txtGammaObject[TXT_B_GAMMA] = TextCtrl('gamma_branch_box_left', 'b_gamma_label', NPTZ_WORDING.wID_0745);
                txtGammaObject[TXT_BLACK_GAMMA] = TextCtrl('gamma_branch_box_left', 'black_gamma_label', NPTZ_WORDING.wID_0746);
                txtGammaObject[TXT_MASTER_BLACK_GAMMA] = TextCtrl('gamma_branch_box_left', 'master_black_gamma_label', NPTZ_WORDING.wID_0747);
                txtGammaObject[TXT_R_BLACK_GAMMA] = TextCtrl('gamma_branch_box_left', 'r_black_gamma_label', NPTZ_WORDING.wID_0748);
                txtGammaObject[TXT_B_BLACK_GAMMA] = TextCtrl('gamma_branch_box_left', 'b_black_gamma_label', NPTZ_WORDING.wID_0749);
                txtGammaObject[TXT_BLACK_GAMMA_RANGE] = TextCtrl('gamma_branch_box_left', 'black_gamma_range_label', NPTZ_WORDING.wID_0750);
                txtGammaObject[TXT_INITAIL_GAMMA] = TextCtrl('gamma_branch_box_left', 'initail_gamma_label', NPTZ_WORDING.wID_0751);


                $('#knee_setting_area h4').html(NPTZ_WORDING.wID_0754)
                txtGammaObject[TXT_KNEE] = TextCtrl('knee_thunk_box', 'knee_thunk_label', NPTZ_WORDING.wID_0754);
                txtGammaObject[TXT_KNEE_MODE] = TextCtrl('knee_branch_box_left', 'knee_mode_label', NPTZ_WORDING.wID_0755);
                txtGammaObject[TXT_KNEE_MASTER_POINT] = TextCtrl('knee_branch_box_left', 'knee_master_point_label', NPTZ_WORDING.wID_0756);
                txtGammaObject[TXT_KNEE_R_POINT] = TextCtrl('knee_branch_box_left', 'knee_r_point_label', NPTZ_WORDING.wID_0757);
                txtGammaObject[TXT_KNEE_B_POINT] = TextCtrl('knee_branch_box_left', 'knee_b_point_label', NPTZ_WORDING.wID_0758);
                txtGammaObject[TXT_KNEE_MASTER_SLOPE_POINT] = TextCtrl('knee_branch_box_left', 'knee_master_slope_label', NPTZ_WORDING.wID_0759);
                txtGammaObject[TXT_KNEE_R_SLOPE_POINT] = TextCtrl('knee_branch_box_left', 'knee_r_slope_label', NPTZ_WORDING.wID_0760);
                txtGammaObject[TXT_KNEE_B_SLOPE_POINT] = TextCtrl('knee_branch_box_left', 'knee_b_slope_label', NPTZ_WORDING.wID_0761);
                txtGammaObject[TXT_KNEE_AUTO_KNEE_RESPONSE] = TextCtrl('knee_branch_box_left', 'auto_knee_response_label', NPTZ_WORDING.wID_0762);

                $('#white_clip_setting_area h4').html(NPTZ_WORDING.wID_0824)
                txtGammaObject[TXT_WHITE_CLIP] = TextCtrl('white_clip_thunk_box', 'white_clip_thunk_label', NPTZ_WORDING.wID_0824);
                txtGammaObject[TXT_MASTER_WHITE_CLIP_LEVEL] = TextCtrl('white_clip_branch_box_left', 'master_white_clip_level_label', NPTZ_WORDING.wID_0825);
                txtGammaObject[TXT_R_WHITE_CLIP_LEVEL] = TextCtrl('white_clip_branch_box_left', 'r_white_clip_level_label', NPTZ_WORDING.wID_0826);
                txtGammaObject[TXT_B_WHITE_CLIP_LEVEL] = TextCtrl('white_clip_branch_box_left', 'b_white_clip_level_label', NPTZ_WORDING.wID_0827);
                txtGammaObject[TXT_HI_COLOR] = TextCtrl('white_clip_branch_box_left', 'hi_color_label', NPTZ_WORDING.wID_0828);
                txtGammaObject[TXT_HI_COLOR_LEVEL] = TextCtrl('white_clip_branch_box_left', 'hi_color_level_label', NPTZ_WORDING.wID_0829);


                $('#drs_setting_area h4').html(NPTZ_WORDING.wID_0315)
                txtGammaObject[TXT_DRS] = TextCtrl('drs_thunk_box', 'drs_thunk_label', NPTZ_WORDING.wID_0315);
                txtGammaObject[TXT_EFFECT_DEPTH] = TextCtrl('drs_branch_box_left', 'effect_depth_label', NPTZ_WORDING.wID_0850);

                for (var text in txtGammaObject) {
                    txtGammaObject[text].show();
                    txtGammaObject[text].getTextObject().prepend('<div class="prefix_line"></div>')
                }

                // gamma start
                gammaRadioButtonGroup = RadioButtonGroupCtrl("gamma_thunk_box", "gamma_radio_value_", RADIO_GROUP.rID_0095, getGammaDefaultValue(), callbackGammaRadioButton);
                gammaModeSelectRadioButtonGroup = RadioButtonGroupCtrl("gamma_branch_box_right_gamma_mode", "gamma_mode_select_radio_value_", RADIO_GROUP.rID_0096, getGammaModeDefaultValue(), callbackGammaModeSekectRadioButton);
                gammaBlackGammaRadioButtonGroup = RadioButtonGroupCtrl("gamma_branch_box_right_gamma_black_gamma", "gamma_black_gamma_radio_value_", RADIO_GROUP.rID_0095, getBlackGammaDefaultValue(), callbackBlackGammaRadioButton);
                gammaInitialGammaRadioButtonGroup = RadioButtonGroupCtrl("gamma_branch_box_right_gamma_initial_gamma", "gamma_initial_gamma_radio_value_", RADIO_GROUP.rID_0097, getInitialGammaDefaultValue(), callbackInitialGammaRadioButton);
                sliderMasterGamma = SliderCtrl('gamma_branch_box_right_master_gamma', 'setup_gamma_slider', 0.75, 0.15, getMasterGammaDefaultValue(), callbackMasterGammaSilder, '', null, null, 0.01, null, 100);
                sliderRGamma = SliderCtrl('gamma_branch_box_right_r_gamma', 'setup_gamma_slider', 75, -75, getRGammaDefaultValue(), callbackRGammaSilder);
                sliderBGamma = SliderCtrl('gamma_branch_box_right_b_gamma', 'setup_gamma_slider', 75, -75, getBFammaDefaultValue(), callbackBGammaSilder);
                sliderMasterBlackGamma = SliderCtrl('gamma_branch_box_right_master_black_gamma', 'setup_gamma_slider', 48, -48, getMasterBlackDefaultValue(), callbackMasterBlackGammaSilder);
                sliderRBlackGamma = SliderCtrl('gamma_branch_box_right_r_black_gamma', 'setup_gamma_slider', 20, -20, getRBlackGammaDefalutValue(), callbackRBlackGammaSilder);
                sliderBBlackGamma = SliderCtrl('gamma_branch_box_right_b_black_gamma', 'setup_gamma_slider', 20, -20, getBBlackGammaDefaultValue(), callbackBBlackGammaSilder);
                sliderBlackGammaRange = SliderCtrl('gamma_branch_box_right_black_gamma_range', 'setup_gamma_slider', 3, 1, getBlackGammaRangeDefaultValue(), callbackBlackGammaRangeSlider);
                // gamma end

                //knee start 
                kneeRadioButtonGroup = RadioButtonGroupCtrl("knee_thunk_box", " knee_radio_value_", RADIO_GROUP.rID_0095, getKneeDefaultValue(), callbackKneeRadioButton);
                kneeModeRadioButtonGroup = RadioButtonGroupCtrl("knee_branch_box_right_knee_mode", "knee_mode_radio_value_", RADIO_GROUP.rID_0101, getKneeModeDefaultValue(), callbackKneeModeRadioButton);
                sliderKneeMasterPoint = SliderCtrl('knee_branch_box_right_knee_master_point', 'setup_knee_slider', 110, 80, getKneeMasterPointDefaultValue(), callbackKneeMasterPointSlider, '%', null, null, 0.25, null, 100);
                sliderKneeRPoint = SliderCtrl('knee_branch_box_right_knee_r_point', 'setup_knee_slider', 25, -25, getKneeRPointDefaultValue(), callbackKneeRPointSlider, '%', null, null, 0.25, null, 100);
                sliderKneeBPoint = SliderCtrl('knee_branch_box_right_knee_b_point', 'setup_knee_slider', 25, -25, getKneeBPointDefaultValue(), callbackBPointKneeSlider, '%', null, null, 0.25, null, 100);
                sliderKneeMasterSlope = SliderCtrl('knee_branch_box_right_knee_master_slope', 'setup_knee_slider', 199, 0, getKneeMasterSlopeDefaultValue(), callbackKneeMasterSlopeSlider);
                sliderKneeRSlope = SliderCtrl('knee_branch_box_right_knee_r_slope', 'setup_knee_slider', 99, -99, getKneeRSlopeDefaultValue(), callbackKneeRSlopeSlider);
                sliderKneeBSlope = SliderCtrl('knee_branch_box_right_knee_b_slope', 'setup_knee_slider', 99, -99, getKneeBSlopeDefaultValue(), callbackKneeBSlopeSlider);
                sliderAutoKneeResponse = SliderCtrl('knee_branch_box_right_knee_auto_knee_response', 'setup_knee_slider', 8, 1, getKneeAutoResponeDefaultValue(), callbackKneeAutoKneeResponseSlider);
                //knee end マ�Eジ

                // white clip start
                whiteClipRadioButtonGroup = RadioButtonGroupCtrl("white_clip_thunk_box", " white_clip_radio_value_", RADIO_GROUP.rID_0095, getWhiteClipDefaultValue(), callbackWhiteClipRadioButton);
                whiteClipHiColorRadioButtonGroup = RadioButtonGroupCtrl("white_clip_branch_box_right_hi_color", " white_clip_branch_box_right_hi_color_value_", RADIO_GROUP.rID_0095, getHiColorDefaultValue(), callbackHiColorRadioButton);

                sliderMasterWhiteClipLevel = SliderCtrl('white_clip_branch_box_right_master_white_clip_level', 'setup_knee_slider', 109, 80, getMasterWhiteClipDefaultValue(), callbackMasterWhiteClipLevelSlider, '%');
                sliderRWhiteClipLevel = SliderCtrl('white_clip_branch_box_right_r_white_clip_level', 'setup_knee_slider', 15, -15, getRWhiteClipDefaultValue(), callbackRWhiteClipLevelSlider, '%');
                sliderBWhiteClipLevel = SliderCtrl('white_clip_branch_box_right_b_white_clip_level', 'setup_knee_slider', 15, -15, getBWhiteClipDefaultValue(), callbackMBWhiteClipLevelSlider, '%');
                sliderHiColorLevel = SliderCtrl('white_clip_branch_box_right_hi_color_level', 'setup_knee_slider', 32, 1, getHiColorLevelDefaultValue(), callbackHiColorLevelSlider);
                //white clip end


                //  drs start
                drsRadioButtonGroup = RadioButtonGroupCtrl("drs_thunk_box", " drs_radio_value_", RADIO_GROUP.rID_0095, getDrsDefaultValue(), callbackDrsRadioButton);
                sliderDrsEffectDepth = SliderCtrl('drs_branch_box_right_effect_depth', 'setup_knee_slider', 5, 1, getDrsEffectDefaultValue(), callbackDrsEffectDepthSlider);
                //  drs end

            } else {
                rebuild();
            }

            InitGammaKneeButtonStatus();

            if (buildScrollSuccessFlg) {
                buildScrollSuccessFlg = false;
                setTimeout(function () {
                    myScroll = new IScroll('#setup_imageAdjust_detail_gamma_knee_main', {
                        preventDefault: false,
                        click: false,
                        tap: true,
                        scrollbars: true,
                        mouseWheel: true,
                        interactiveScrollbars: true,
                        shrinkScrollbars: 'scale',
                        fadeScrollbars: false,
                        useTransform: false
                    });
                    buildScrollSuccessFlg = true;
                }, 1000)
            }
        }

        /**
         * cparam_get_v_log()  0:OFF 1:ON
         * cparam_get_v_log_paint_sw() 0:OFF 1:ON
         * cparam_get_hdr() 0:OFF 1:ON
         */
        function InitGammaKneeButtonStatus() {

            gammaRadioButtonGroup.setSelectedValue(getGammaDefaultValue());
            kneeRadioButtonGroup.setSelectedValue(getKneeDefaultValue());
            kneeModeRadioButtonGroup.setSelectedValue(getKneeModeDefaultValue());
            whiteClipRadioButtonGroup.setSelectedValue(getWhiteClipDefaultValue());
            whiteClipHiColorRadioButtonGroup.setSelectedValue(getHiColorDefaultValue());
            drsRadioButtonGroup.setSelectedValue(getDrsDefaultValue());
            gammaBlackGammaRadioButtonGroup.setSelectedValue(getBlackGammaDefaultValue());
            gammaModeSelectRadioButtonGroup.setSelectedValue(getGammaModeDefaultValue());
            gammaInitialGammaRadioButtonGroup.setSelectedValue(getInitialGammaDefaultValue());
            //V-LOG ON かつV-LOG PAINT SW OFFの場吁E
            let isVLogOn = (cparam_get_v_log() == 1)
            //GAMMA MODE SELECTでNORMAL,CINEMA1,CINEMA2が選択されてぁE��場吁E
            // let gammaModeSelectIsNotHd = (getGammaModeDefaultValue() != 0)           
            //KNEE MODEがMANUAL以外で設定されてぁE��場吁E== AUTO
            let kneeModeIsAuto = (kneeModeRadioButtonGroup.getSelectedValue() == 1)

            if (isVLogOn) {
                gammaRadioButtonGroup.displayDisabled();
                gammaModeSelectRadioButtonGroup.displayDisabled();
                sliderMasterGamma.setDisable();
                sliderRGamma.setDisable();
                sliderBGamma.setDisable();
                gammaBlackGammaRadioButtonGroup.displayDisabled();
                sliderMasterBlackGamma.setDisable();
                sliderRBlackGamma.setDisable();
                sliderBBlackGamma.setDisable();
                sliderBlackGammaRange.setDisable();
                gammaInitialGammaRadioButtonGroup.displayDisabled();
                kneeRadioButtonGroup.displayDisabled();
                kneeModeRadioButtonGroup.displayDisabled();
                sliderKneeMasterPoint.setDisable();
                sliderKneeRPoint.setDisable();
                sliderKneeBPoint.setDisable();
                sliderKneeMasterSlope.setDisable();
                sliderKneeRSlope.setDisable();
                sliderKneeBSlope.setDisable();
                sliderAutoKneeResponse.setDisable();
                whiteClipRadioButtonGroup.displayDisabled();
                sliderMasterWhiteClipLevel.setDisable();
                sliderRWhiteClipLevel.setDisable();
                sliderBWhiteClipLevel.setDisable();
                whiteClipHiColorRadioButtonGroup.displayDisabled();
                sliderHiColorLevel.setDisable();
                drsRadioButtonGroup.displayDisabled();
                sliderDrsEffectDepth.setDisable();
            } else {
                if (cparam_get_hdr() == 1) {
                    gammaRadioButtonGroup.displayDisabled();
                    gammaModeSelectRadioButtonGroup.displayDisabled();
                    sliderMasterGamma.setDisable();
                    sliderRGamma.setDisable();
                    sliderBGamma.setDisable();
                    gammaBlackGammaRadioButtonGroup.displayDisabled();
                    sliderMasterBlackGamma.setDisable();
                    sliderRBlackGamma.setDisable();
                    sliderBBlackGamma.setDisable();
                    sliderBlackGammaRange.setDisable();
                    gammaInitialGammaRadioButtonGroup.displayDisabled();
                    kneeRadioButtonGroup.displayDisabled();
                    if (kneeRadioButtonGroup.getSelectedValue() == 0) {
                        kneeModeRadioButtonGroup.displayDisabled();
                        sliderAutoKneeResponse.setDisable();
                        sliderKneeMasterPoint.setDisable();
                        sliderKneeRPoint.setDisable();
                        sliderKneeBPoint.setDisable();
                        sliderKneeMasterSlope.setDisable();
                        sliderKneeRSlope.setDisable();
                        sliderKneeBSlope.setDisable();
                    } else {
                        kneeModeRadioButtonGroup.displayOff();
                        sliderAutoKneeResponse.setEnable();
                        if (kneeModeIsAuto) {
                            sliderKneeMasterPoint.setDisable();
                            sliderKneeRPoint.setDisable();
                            sliderKneeBPoint.setDisable();
                            sliderKneeMasterSlope.setDisable();
                            sliderKneeRSlope.setDisable();
                            sliderKneeBSlope.setDisable();
                        } else {
                            sliderKneeMasterPoint.setEnable();
                            sliderKneeRPoint.setEnable();
                            sliderKneeBPoint.setEnable();
                            sliderKneeMasterSlope.setEnable();
                            sliderKneeRSlope.setEnable();
                            sliderKneeBSlope.setEnable();
                        }
                    }
                    whiteClipRadioButtonGroup.displayDisabled();
                    sliderMasterWhiteClipLevel.setDisable();
                    sliderRWhiteClipLevel.setDisable();
                    sliderBWhiteClipLevel.setDisable();
                    whiteClipHiColorRadioButtonGroup.displayDisabled();
                    sliderHiColorLevel.setDisable();
                    drsRadioButtonGroup.displayOff();
                    sliderDrsEffectDepth.setEnable();
                } else {
                    gammaRadioButtonGroup.displayOff();
                    if (gammaRadioButtonGroup.getSelectedValue() == 0) {
                        gammaModeSelectRadioButtonGroup.displayDisabled();
                        sliderMasterGamma.setDisable();
                        sliderRGamma.setDisable();
                        sliderBGamma.setDisable();
                        gammaBlackGammaRadioButtonGroup.displayDisabled();
                        sliderMasterBlackGamma.setDisable();
                        sliderRBlackGamma.setDisable();
                        sliderBBlackGamma.setDisable();
                        sliderBlackGammaRange.setDisable();
                        gammaInitialGammaRadioButtonGroup.displayDisabled();
                    } else {
                        gammaModeSelectRadioButtonGroup.displayOff();
                        sliderMasterGamma.setEnable();
                        sliderRGamma.setEnable();
                        sliderBGamma.setEnable();
                        gammaBlackGammaRadioButtonGroup.displayOff();
                        if (getBlackGammaDefaultValue() == 0) {
                            sliderMasterBlackGamma.setDisable();
                            sliderRBlackGamma.setDisable();
                            sliderBBlackGamma.setDisable();
                            sliderBlackGammaRange.setDisable();
                        } else {
                            sliderMasterBlackGamma.setEnable();
                            sliderRBlackGamma.setEnable();
                            sliderBBlackGamma.setEnable();
                            sliderBlackGammaRange.setEnable();
                        }
                        if (cparam_get_gamma_select_mode_qsj_d7() != 0) {
                            gammaInitialGammaRadioButtonGroup.displayDisabled();
                        } else {
                            gammaInitialGammaRadioButtonGroup.displayOff();
                        }
                    }
                    kneeRadioButtonGroup.displayOff();
                    if (kneeRadioButtonGroup.getSelectedValue() == 0) {
                        kneeModeRadioButtonGroup.displayDisabled();
                        sliderAutoKneeResponse.setDisable();
                        sliderKneeMasterPoint.setDisable();
                        sliderKneeRPoint.setDisable();
                        sliderKneeBPoint.setDisable();
                        sliderKneeMasterSlope.setDisable();
                        sliderKneeRSlope.setDisable();
                        sliderKneeBSlope.setDisable();
                    } else {
                        kneeModeRadioButtonGroup.displayOff();
                        sliderAutoKneeResponse.setEnable();
                        if (kneeModeIsAuto) {
                            sliderKneeMasterPoint.setDisable();
                            sliderKneeRPoint.setDisable();
                            sliderKneeBPoint.setDisable();
                            sliderKneeMasterSlope.setDisable();
                            sliderKneeRSlope.setDisable();
                            sliderKneeBSlope.setDisable();
                        } else {
                            sliderKneeMasterPoint.setEnable();
                            sliderKneeRPoint.setEnable();
                            sliderKneeBPoint.setEnable();
                            sliderKneeMasterSlope.setEnable();
                            sliderKneeRSlope.setEnable();
                            sliderKneeBSlope.setEnable();
                        }
                    }
                    whiteClipRadioButtonGroup.displayOff();
                    whiteClipHiColorRadioButtonGroup.displayOff();
                    sliderHiColorLevel.setEnable();
                    if (whiteClipRadioButtonGroup.getSelectedValue() == 0) {
                        sliderMasterWhiteClipLevel.setDisable();
                        sliderRWhiteClipLevel.setDisable();
                        sliderBWhiteClipLevel.setDisable();
                    } else {
                        sliderMasterWhiteClipLevel.setEnable();
                        sliderRWhiteClipLevel.setEnable();
                        sliderBWhiteClipLevel.setEnable();
                    }
                    drsRadioButtonGroup.displayOff();
                    sliderDrsEffectDepth.setEnable();
                }
            }
        }

        //#region 
        function callbackGammaRadioButton() {
            cparam_set_gamma_osa_0a(gammaRadioButtonGroup.getSelectedValue());
            if (gammaRadioButtonGroup.getSelectedValue() == 0) {
                gammaModeSelectRadioButtonGroup.displayDisabled();
                sliderMasterGamma.setDisable();
                sliderRGamma.setDisable();
                sliderBGamma.setDisable();
                gammaBlackGammaRadioButtonGroup.displayDisabled();
                sliderMasterBlackGamma.setDisable();
                sliderRBlackGamma.setDisable();
                sliderBBlackGamma.setDisable();
                sliderBlackGammaRange.setDisable();
                gammaInitialGammaRadioButtonGroup.displayDisabled();
            } else {
                gammaModeSelectRadioButtonGroup.displayOff();
                sliderMasterGamma.setEnable();
                sliderRGamma.setEnable();
                sliderBGamma.setEnable();
                gammaBlackGammaRadioButtonGroup.displayOff();
                if (gammaBlackGammaRadioButtonGroup.getSelectedValue() == 0) {
                    sliderMasterBlackGamma.setDisable();
                    sliderRBlackGamma.setDisable();
                    sliderBBlackGamma.setDisable();
                    sliderBlackGammaRange.setDisable();
                } else {
                    sliderMasterBlackGamma.setEnable();
                    sliderRBlackGamma.setEnable();
                    sliderBBlackGamma.setEnable();
                    sliderBlackGammaRange.setEnable();
                }
                if (gammaModeSelectRadioButtonGroup.getSelectedValue() != 0) {
                    gammaInitialGammaRadioButtonGroup.displayDisabled();
                } else {
                    gammaInitialGammaRadioButtonGroup.displayOff();
                }
            }
        }

        function callbackGammaModeSekectRadioButton() {
            cparam_set_gamma_select_mode_osj_d7(gammaModeSelectRadioButtonGroup.getSelectedValue());
            if (gammaModeSelectRadioButtonGroup.getSelectedValue() != 0) {
                gammaInitialGammaRadioButtonGroup.displayDisabled();
            } else {
                gammaInitialGammaRadioButtonGroup.displayOff();
            }
        }

        function callbackBlackGammaRadioButton() {
            cparam_set_black_gamma_osa_0b(gammaBlackGammaRadioButtonGroup.getSelectedValue());
            if (gammaBlackGammaRadioButtonGroup.getSelectedValue() == 0) {
                sliderMasterBlackGamma.setDisable();
                sliderRBlackGamma.setDisable();
                sliderBBlackGamma.setDisable();
                sliderBlackGammaRange.setDisable();
            } else {
                sliderMasterBlackGamma.setEnable();
                sliderRBlackGamma.setEnable();
                sliderBBlackGamma.setEnable();
                sliderBlackGammaRange.setEnable();
            }
        }

        function callbackInitialGammaRadioButton() {
            cparam_set_initial_gamma_osl_44(gammaInitialGammaRadioButtonGroup.getSelectedValue());
        }

        function callbackKneeRadioButton() {
            cparam_set_knee_osl_45(kneeRadioButtonGroup.getSelectedValue());
            if (kneeRadioButtonGroup.getSelectedValue() == 0) {
                kneeModeRadioButtonGroup.displayDisabled();
                sliderAutoKneeResponse.setDisable();
                sliderKneeMasterPoint.setDisable();
                sliderKneeRPoint.setDisable();
                sliderKneeBPoint.setDisable();
                sliderKneeMasterSlope.setDisable();
                sliderKneeRSlope.setDisable();
                sliderKneeBSlope.setDisable();
            } else {
                kneeModeRadioButtonGroup.displayOff();
                sliderAutoKneeResponse.setEnable();
                if (kneeModeRadioButtonGroup.getSelectedValue() == 1) {
                    sliderKneeMasterPoint.setDisable();
                    sliderKneeRPoint.setDisable();
                    sliderKneeBPoint.setDisable();
                    sliderKneeMasterSlope.setDisable();
                    sliderKneeRSlope.setDisable();
                    sliderKneeBSlope.setDisable();
                } else {
                    sliderKneeMasterPoint.setEnable();
                    sliderKneeRPoint.setEnable();
                    sliderKneeBPoint.setEnable();
                    sliderKneeMasterSlope.setEnable();
                    sliderKneeRSlope.setEnable();
                    sliderKneeBSlope.setEnable();
                }
            }
        }

        function callbackKneeModeRadioButton() {
            cparam_set_knee_mode_osl_46(kneeModeRadioButtonGroup.getSelectedValue());

            if (kneeModeRadioButtonGroup.getSelectedValue() == 1) {
                sliderKneeMasterPoint.setDisable();
                sliderKneeRPoint.setDisable();
                sliderKneeBPoint.setDisable();
                sliderKneeMasterSlope.setDisable();
                sliderKneeRSlope.setDisable();
                sliderKneeBSlope.setDisable();
            } else {
                sliderKneeMasterPoint.setEnable();
                sliderKneeRPoint.setEnable();
                sliderKneeBPoint.setEnable();
                sliderKneeMasterSlope.setEnable();
                sliderKneeRSlope.setEnable();
                sliderKneeBSlope.setEnable();
            }
        }

        function callbackWhiteClipRadioButton() {
            cparam_set_whiteClip_osa_2e(whiteClipRadioButtonGroup.getSelectedValue());
            if (whiteClipRadioButtonGroup.getSelectedValue() == 0) {
                sliderMasterWhiteClipLevel.setDisable();
                sliderRWhiteClipLevel.setDisable();
                sliderBWhiteClipLevel.setDisable();
            } else {
                sliderMasterWhiteClipLevel.setEnable();
                sliderRWhiteClipLevel.setEnable();
                sliderBWhiteClipLevel.setEnable();
            }
        }

        function callbackHiColorRadioButton() {
            cparam_set_hi_color_osl_49(whiteClipHiColorRadioButtonGroup.getSelectedValue());
        }

        function callbackDrsRadioButton() {
            cparam_set_drs_osa_0d(drsRadioButtonGroup.getSelectedValue());
        }


        function callbackMasterGammaSilder() {
            cparam_set_gamma(sliderMasterGamma.getValue());
        }

        function callbackRGammaSilder() {
            cparam_set_r_gamma_osi_35(sliderRGamma.getValue());
        }

        function callbackBGammaSilder() {
            cparam_set_b_gamma_osi_36(sliderBGamma.getValue());
        }

        function callbackMasterBlackGammaSilder() {
            cparam_set_blackGamma(parseInt(sliderMasterBlackGamma.getValue()));
        }

        function callbackRBlackGammaSilder() {
            cparam_set_rBlackGamma_osa_08(parseInt(sliderRBlackGamma.getValue()));
        }

        function callbackBBlackGammaSilder() {
            cparam_set_bBlackGamma_osa_09(parseInt(sliderBBlackGamma.getValue()));
        }

        function callbackBlackGammaRangeSlider() {
            cparam_set_blackGammaRange_osj_1b(parseInt(sliderBlackGammaRange.getValue()));
        }


        function callbackKneeMasterPointSlider() {
            cparam_set_kneePoint(sliderKneeMasterPoint.getValue());
        }
        function callbackKneeRPointSlider() {
            cparam_set_kneeRPoint_osa_22(sliderKneeRPoint.getValue());
        }
        function callbackBPointKneeSlider() {
            cparam_set_kneeBPoint_osa_23(sliderKneeBPoint.getValue());
        }

        function callbackKneeMasterSlopeSlider() {
            cparam_set_kneeSlope(parseInt(sliderKneeMasterSlope.getValue()));
        }

        function callbackKneeRSlopeSlider() {
            cparam_set_knee_RSlope_osa_26(parseInt(sliderKneeRSlope.getValue()));
        }
        function callbackKneeBSlopeSlider() {
            cparam_set_knee_BSlope_osa_27(parseInt(sliderKneeBSlope.getValue()));
        }

        function callbackKneeAutoKneeResponseSlider() {
            cparam_set_aKneeResponse(sliderAutoKneeResponse.getValue());
        }


        function callbackMasterWhiteClipLevelSlider() {
            cparam_set_masterWhiteClipLevel_osa_2a(sliderMasterWhiteClipLevel.getValue());
        }
        function callbackRWhiteClipLevelSlider() {
            cparam_set_RWhiteClipLevel_osl_47(parseInt(sliderRWhiteClipLevel.getValue()));
        }
        function callbackMBWhiteClipLevelSlider() {
            cparam_set_BWhiteClipLevel_osl_48(parseInt(sliderBWhiteClipLevel.getValue()));
        }

        function callbackHiColorLevelSlider() {
            cparam_set_HiColorLevel_osl_4a(sliderHiColorLevel.getValue());
        }

        function callbackDrsEffectDepthSlider() {
            cparam_set_drsEffectDepth_osl_4b(sliderDrsEffectDepth.getValue());
        }
        //#endregion

        function getGammaDefaultValue() {
            return cparam_get_gamma_qsa_0a();
        }
        function getGammaModeDefaultValue() {
            return cparam_get_gamma_select_mode_qsj_d7();
        }

        function getBlackGammaDefaultValue() {
            return cparam_get_black_gamma_qsa_0b();
        }

        function getInitialGammaDefaultValue() {
            return cparam_get_initial_gamma_qsl_44();
        }


        function getMasterGammaDefaultValue() {
            return cparam_get_gamma();
        }
        function getRGammaDefaultValue() {
            return cparam_get_r_gamma_qsi_35();
        }
        function getBFammaDefaultValue() {
            return cparam_get_b_gamma_qsi_36();
        }
        function getMasterBlackDefaultValue() {
            return cparam_get_blackGamma();
        }
        function getRBlackGammaDefalutValue() {
            return cparam_get_rBlackGamma_qsa_08();
        }
        function getBBlackGammaDefaultValue() {
            return cparam_get_bBlackGamma_qsa_09();
        }
        function getBlackGammaRangeDefaultValue() {
            return cparam_get_blackGammaRange_qsj_1b();
        }

        function getKneeDefaultValue() {
            return cparam_get_knee_qsl_45();
        }
        function getKneeModeDefaultValue() {
            return cparam_get_knee_mode_qsl_46();
        }
        function getKneeMasterPointDefaultValue() {
            return cparam_get_kneePoint();
        }
        function getKneeRPointDefaultValue() {
            return cparam_get_kneeRPoint_qsa_22();
        }
        function getKneeBPointDefaultValue() {
            return cparam_get_kneeBPoint_qsa_23();
        }
        function getKneeMasterSlopeDefaultValue() {
            return cparam_get_kneeSlope();
        }
        function getKneeRSlopeDefaultValue() {
            return cparam_get_knee_RSlope_qsa_26();
        }
        function getKneeBSlopeDefaultValue() {
            return cparam_get_knee_BSlope_osa_27();
        }
        function getKneeAutoResponeDefaultValue() {
            return cparam_get_aKneeResponse();
        }
        function getWhiteClipDefaultValue() {
            return cparam_get_whiteClip_qsa_2e();
        }
        function getHiColorDefaultValue() {
            return cparam_get_hi_color_qsl_49();
        }


        function getMasterWhiteClipDefaultValue() {
            return cparam_get_masterWhiteClipLevel_qsa_2a();
        }
        function getRWhiteClipDefaultValue() {
            return cparam_get_RWhiteClipLevel_qsl_47();
        }
        function getBWhiteClipDefaultValue() {
            return cparam_get_BWhiteClipLevel_qsl_48();
        }
        function getHiColorLevelDefaultValue() {
            return cparam_get_HiColorLevel_qsl_4a();
        }
        function getDrsDefaultValue() {
            return cparam_get_drs_qsa_0d();
        }
        function getDrsEffectDefaultValue() {
            return cparam_get_drsEffectDepth_qsl_4b();
        }

        function rebuild() {
            sliderMasterGamma.setValue(getMasterGammaDefaultValue());
            sliderRGamma.setValue(getRGammaDefaultValue());
            sliderBGamma.setValue(getBFammaDefaultValue());
            sliderMasterBlackGamma.setValue(getMasterBlackDefaultValue());
            sliderRBlackGamma.setValue(getRBlackGammaDefalutValue());
            sliderBBlackGamma.setValue(getBBlackGammaDefaultValue());
            sliderBlackGammaRange.setValue(getBlackGammaRangeDefaultValue());
            sliderKneeMasterPoint.setValue(getKneeMasterPointDefaultValue());
            sliderKneeRPoint.setValue(getKneeRPointDefaultValue());
            sliderKneeBPoint.setValue(getKneeBPointDefaultValue());
            sliderKneeMasterSlope.setValue(getKneeMasterSlopeDefaultValue());
            sliderKneeRSlope.setValue(getKneeRSlopeDefaultValue());
            sliderKneeBSlope.setValue(getKneeBSlopeDefaultValue());
            sliderAutoKneeResponse.setValue(getKneeAutoResponeDefaultValue());
            sliderMasterWhiteClipLevel.setValue(getMasterWhiteClipDefaultValue());
            sliderRWhiteClipLevel.setValue(getRWhiteClipDefaultValue());
            sliderBWhiteClipLevel.setValue(getBWhiteClipDefaultValue());
            sliderHiColorLevel.setValue(getHiColorLevelDefaultValue());
            sliderDrsEffectDepth.setValue(getDrsEffectDefaultValue());
        }

        return {
            build: function () {
                return buildSettingGammaKnee();
            }
        }
    }

    /**
      * settingDetail
     * @return {{build: buildSettingGammaKnee, rebuild: rebuild}} build 構築�E琁E
     * @return {function} rebuild 再構築�E琁E
     * @constructor
     */
    function settingDetail() {
        /**
         * 構築フラグ
         * @type boolean
         */

        let buildFlag_settingDetail = false;
        let buildScrollSuccessFlg = true;
        let txtDetailObject = [];
        const TXT_IMAGE_ADJUST_DETAIL_DETAIL = 0;
        const TXT_IMAGE_ADJUST_DETAIL_MASTER_DETAIL = 1;
        const TXT_IMAGE_ADJUST_DETAIL_PEAK_FREQUENCY = 2;
        const TXT_IMAGE_ADJUST_DETAIL_CRISP = 3;
        const TXT_IMAGE_ADJUST_DETAIL_GAIN_PLUS = 4;
        const TXT_IMAGE_ADJUST_DETAIL_GAIN_MINUS = 5;
        const TXT_IMAGE_ADJUST_DETAIL_CLIP_PLUS = 6;
        const TXT_IMAGE_ADJUST_DETAIL_CLIP_MINUS = 7;
        const TXT_IMAGE_ADJUST_DETAIL_KNEE_APERTURE_LEVEL = 8;
        const TXT_IMAGE_ADJUST_DETAIL_KNEE = 9;
        const TXT_IMAGE_ADJUST_DETAIL_LEVEL_DEPENDENT_SWITCH = 10;
        const TXT_IMAGE_ADJUST_DETAIL_LEVEL_DEPENDENT = 11;
        const TXT_IMAGE_ADJUST_DETAIL_DARK_DETAIL_SWITCH = 12;
        const TXT_IMAGE_ADJUST_DETAIL_DARK_DETAIL = 13;
        const TXT_IMAGE_ADJUST_DETAIL_CHROMA = 14;
        const TXT_IMAGE_ADJUST_DETAIL_CHROMA_LEVEL_SWITCH = 15;
        const TXT_IMAGE_ADJUST_DETAIL_CHROMA_LEVEL = 16;
        const TXT_IMAGE_ADJUST_DETAIL_DETAIL_SETTING = 17;
        const TXT_IMAGE_ADJUST_DETAIL_DOWNCON_DETAIL = 18;
        const TXT_IMAGE_ADJUST_DETAIL_DOWNCON_MASTER_DETAIL = 19;
        const TXT_IMAGE_ADJUST_DETAIL_DOWNCON_H_DETAIL_LEVELL = 20;
        const TXT_IMAGE_ADJUST_DETAIL_DOWNCON_V_DETAIL_LEVELL = 21;
        const TXT_IMAGE_ADJUST_DETAIL_DOWNCON_PEAK_FREQUENCY = 22;
        const TXT_IMAGE_ADJUST_DETAIL_DOWNCON_V_DETAIL_FREQUENCY = 23;
        const TXT_IMAGE_ADJUST_DETAIL_DOWNCON_CRISP = 24;
        const TXT_IMAGE_ADJUST_DETAIL_DOWNCON_CLIP_PLUS = 25;
        const TXT_IMAGE_ADJUST_DETAIL_DOWNCON_CLIP_MINUS = 26;
        const TXT_IMAGE_ADJUST_DETAIL_DOWNCON_KNEE_APERTURE_LEVEL = 27;
        const TXT_IMAGE_ADJUST_DETAIL_DOWNCON_KNEE = 28;
        const TXT_IMAGE_ADJUST_DETAIL_DOWNCON_LEVEL_DEPENDENT_SWITCH = 29;
        const TXT_IMAGE_ADJUST_DETAIL_DOWNCON_LEVEL_DEPENDENT = 30;
        const TXT_IMAGE_ADJUST_DETAIL_DOWNCON_DARK_DETAIL_SWITCH = 31;
        const TXT_IMAGE_ADJUST_DETAIL_DOWNCON_DARK_DETAIL = 32;
        const TXT_IMAGE_ADJUST_DETAIL_DOWNCON_SKIN_TONE_DETAIL = 33;
        const TXT_IMAGE_ADJUST_DETAIL_DOWNCON_SKIN_TONE_MEMORY_SELECT = 34;
        const TXT_IMAGE_ADJUST_DETAIL_DOWNCON_ZEBRA = 35;
        const TXT_IMAGE_ADJUST_DETAIL_DONWCON_ZEBRA_EFFECT_MEMORY = 36;
        const TXT_IMAGE_ADJUST_DETAIL_DONWCON_SKIN_TONE_EFFECT_MEMORY = 37;
        const TXT_IMAGE_ADJUST_DETAIL_DONWCON_SKIN_TONE_CRISP = 38;
        const TXT_IMAGE_ADJUST_DETAIL_DONWCON_I_CENTER = 39;
        const TXT_IMAGE_ADJUST_DETAIL_DONWCON_I_WIDTH = 40;
        const TXT_IMAGE_ADJUST_DETAIL_DONWCON_Q_WIDTH = 41;
        const TXT_IMAGE_ADJUST_DETAIL_DONWCON_Q_PHASE = 42;
        const TXT_IMAGE_ADJUST_DETAIL_SKIN_TONE_DETAIL = 43;
        const TXT_IMAGE_ADJUST_DETAIL_SKIN_TONE_DETAIL_MEMORY_SELECT = 44;
        const TXT_IMAGE_ADJUST_DETAIL_SKIN_TONE_ZEBRA = 45;
        const TXT_IMAGE_ADJUST_DETAIL_SKIN_TONE_ZEBRA_EFFECT_MEMORY = 46;
        const TXT_IMAGE_ADJUST_DETAIL_SKIN_TONE_EFFECT_MEMORY = 47;
        const TXT_IMAGE_ADJUST_DETAIL_SKIN_TONE_CRISP = 48;
        const TXT_IMAGE_ADJUST_DETAIL_SKIN_TONE_I_CENTER = 49;
        const TXT_IMAGE_ADJUST_DETAIL_SKIN_TONE_I_WIDTH = 50;
        const TXT_IMAGE_ADJUST_DETAIL_SKIN_TONE_Q_WIDTH = 51;
        const TXT_IMAGE_ADJUST_DETAIL_SKIN_TONE_Q_PHASE = 52;


        let detailRadioButtonGroup;
        let levelDependentRadioButtonGroup;
        let darkDetailRadioButtonGroup;
        let chromaLevelRadioButtonGroup;
        let downconDetailRadioButtonGroup;
        let downconLevelDependentRadioButtonGroup;
        let downconDarkDetailRadioButtonGroup;
        let downconSkinToneDetailRadioButtonGroup;
        let downconSkinToneMemorySelectRadioButtonGroup;
        let downconZebraRadioButtonGroup;
        let downconZebraEffectMemoryRadioButtonGroup;
        let downconSkinToneEffectMemoryRadioButtonGroup;
        let skinToneDetailMemorySelectRadioButtonGroup;
        let skinToneDetailRadioButtonGroup;
        let skinToneZebraRadioButtonGroup;
        let skinToneZebraEffectMemoryRadioButtonGroup;
        let skinToneEffectMemoryRadioButtonGroup;
        let sliderMasterDetail;
        let sliderDetailPeakFrequency;
        let sliderDetailCrisp;
        let sliderDetailGainPlus;
        let sliderDetailGainMinus;
        let sliderDetailClipPlus;
        let sliderDetailClipMinus;
        let sliderDetailKneeApertureLevel;
        let sliderDetailKnee;
        let sliderDetailLevelDependent;
        let sliderDarkDetail;
        let sliderChromaLevel;
        let sliderDownconMasterDetail;
        let sliderDownconHDetailLevel;
        let sliderDownconVDetailLevel;
        let sliderDownconPeakFrequency;
        let sliderDownconVDetailFrequency;
        let sliderDownconCrisp;
        let sliderDetailDownconClipPlus;
        let sliderDetailDownconClipMinus;
        let sliderDetailDownconKneeApertureLevel;
        let sliderDetailDownconKnee;
        let sliderDetailDownconLevelDependent;
        let sliderDownconDarkDetail;
        let sliderDownconSkinToneCrisp;
        let sliderDownconICenter;
        let sliderDownconIWidth;
        let sliderDownconQWidth;
        let sliderDownconQPhase;
        let sliderSkinToneDetailMemorySelect;
        let sliderSkinToneCrisp;
        let sliderSkinToneICenter;
        let sliderSkinToneIWidth;
        let sliderSkinToneQWidth;
        let sliderSkinToneQPhase;
        const GRAY_FORMAT = ["17", "18", "19", "1A", "1B", "21"];
        function buildSettingDetail() {
            if (myScroll != null) {
                myScroll.destroy();
                myScroll = null;
            }
            if (!buildFlag_settingDetail) {
                buildFlag_settingDetail = true;
                // $("#wb_bal_title").html(NPTZ_WORDING.wID_0763);//todo
                $("#detail_title").html(NPTZ_WORDING.wID_0876);
                txtDetailObject[TXT_IMAGE_ADJUST_DETAIL_MASTER_DETAIL] = TextCtrl('detail_setting_area', 'setup_imageAdjust_detail_setting_detail_label', NPTZ_WORDING.wID_0738);
                detailRadioButtonGroup = RadioButtonGroupCtrl("detail_setting_area", "setup_imageAdjust_detail_setting_detail_", RADIO_GROUP.rID_0016, cparam_get_detail(), callbackDetailSetting);

                txtDetailObject[TXT_IMAGE_ADJUST_DETAIL_DETAIL] = TextCtrl('detail_setting_area', 'setup_imageAdjust_detail_setting_master_detail_label', NPTZ_WORDING.wID_0857);
                sliderMasterDetail = SliderCtrl("detail_setting_area", "setup_imageAdjust_detail_setting_master_detail_slider", 31, -31, cparam_get_DetailmasterDetail(), callbackMasterDetailSetting);
                txtDetailObject[TXT_IMAGE_ADJUST_DETAIL_PEAK_FREQUENCY] = TextCtrl('detail_setting_area', 'setup_imageAdjust_detail_setting_peak_frequence_label', NPTZ_WORDING.wID_0879);
                // peak frequency slider
                sliderDetailPeakFrequency = SliderCtrl('detail_setting_area', 'setup_imageAdjust_detail_peak_frequence_slider', 8, 1, cparam_get_peakFrequency(), callbackPeakFrequency);
                // crisp slider
                txtDetailObject[TXT_IMAGE_ADJUST_DETAIL_CRISP] = TextCtrl('detail_setting_area', 'setup_imageAdjust_detail_crisp_label', NPTZ_WORDING.wID_0860);
                sliderDetailCrisp = SliderCtrl('detail_setting_area', 'setup_imageAdjust_detail_crisp_slider', 63, 0, cparam_get_crisp(), callbackDetailCrisp);
                // gain +
                txtDetailObject[TXT_IMAGE_ADJUST_DETAIL_GAIN_PLUS] = TextCtrl('detail_setting_area', 'setup_imageAdjust_detail_gain_plus_label', NPTZ_WORDING.wID_0861);
                sliderDetailGainPlus = SliderCtrl('detail_setting_area', 'setup_imageAdjust_detail_gain_plus_slider', 31, -31, cparam_get_gainPlus(), callbackDetailGainPlus);
                // gain +
                txtDetailObject[TXT_IMAGE_ADJUST_DETAIL_GAIN_MINUS] = TextCtrl('detail_setting_area', 'setup_imageAdjust_detail_gain_minus_label', NPTZ_WORDING.wID_0862);
                sliderDetailGainMinus = SliderCtrl('detail_setting_area', 'setup_imageAdjust_detail_gain_minus_slider', 31, -31, cparam_get_gainMinus(), callbackDetailGainMinus);
                // detail clip +
                txtDetailObject[TXT_IMAGE_ADJUST_DETAIL_CLIP_PLUS] = TextCtrl('detail_setting_area', 'setup_imageAdjust_detail_clip_plus_label', NPTZ_WORDING.wID_0864);
                sliderDetailClipPlus = SliderCtrl('detail_setting_area', 'setup_imageAdjust_detail_clip_plus_slider', 63, 0, cparam_get_detailClipPlus(), callbackDetailClipPlus);
                // detail clip -
                txtDetailObject[TXT_IMAGE_ADJUST_DETAIL_CLIP_MINUS] = TextCtrl('detail_setting_area', 'setup_imageAdjust_detail_clip_minus_label', NPTZ_WORDING.wID_0865);
                sliderDetailClipMinus = SliderCtrl('detail_setting_area', 'setup_imageAdjust_detail_clip_minus_slider', 63, 0, cparam_get_detailClipMinus(), callbackDetailClipMinus);
                // KNEE APERTURE LEVEL
                txtDetailObject[TXT_IMAGE_ADJUST_DETAIL_KNEE_APERTURE_LEVEL] = TextCtrl('detail_setting_area', 'setup_imageAdjust_detail_knee_aperture_level_label', NPTZ_WORDING.wID_0866);
                sliderDetailKneeApertureLevel = SliderCtrl('detail_setting_area', 'setup_imageAdjust_detail_knee_aperture_level_slider', 39, 0, cparam_get_detailKneeApertureLevel(), callbackDetailKneeApertureLevel);
                // DETAIL KNEE
                txtDetailObject[TXT_IMAGE_ADJUST_DETAIL_KNEE] = TextCtrl('detail_setting_area', 'setup_imageAdjust_detail_knee_label', NPTZ_WORDING.wID_0867);
                sliderDetailKnee = SliderCtrl('detail_setting_area', 'setup_imageAdjust_detail_knee_slider', 15, 0, cparam_get_detailKnee(), callbackDetailKnee);
                // LEVEL DEPENDENT SWITCH
                txtDetailObject[TXT_IMAGE_ADJUST_DETAIL_LEVEL_DEPENDENT_SWITCH] = TextCtrl('detail_setting_area', 'setup_imageAdjust_detail_level_dependent_switch_label', NPTZ_WORDING.wID_0868);
                levelDependentRadioButtonGroup = RadioButtonGroupCtrl("detail_setting_area", "setup_imageAdjust_detail_level_dependent_switch_", RADIO_GROUP.rID_0016, cparam_get_levelDependentSwitch(), callbackLevelDependentSwitch);
                // LEVEL DEPENDENT
                txtDetailObject[TXT_IMAGE_ADJUST_DETAIL_LEVEL_DEPENDENT] = TextCtrl('detail_setting_area', 'setup_imageAdjust_level_dependent_label', NPTZ_WORDING.wID_0869);
                sliderDetailLevelDependent = SliderCtrl('detail_setting_area', 'setup_imageAdjust_detail_level_dependent_slider', 15, 0, cparam_get_detailLevelDependent(), callbackDetailLevelDependent);
                // DARK DETAIL SWITCH
                txtDetailObject[TXT_IMAGE_ADJUST_DETAIL_DARK_DETAIL_SWITCH] = TextCtrl('detail_setting_area', 'setup_imageAdjust_detail_dark_detail_switch_label', NPTZ_WORDING.wID_0870);
                darkDetailRadioButtonGroup = RadioButtonGroupCtrl("detail_setting_area", "setup_imageAdjust_detail_dark_detail_switch_", RADIO_GROUP.rID_0016, cparam_get_darkDetailSwitch(), callbackDarkDetailSwitch);
                // DARK DETAIL
                txtDetailObject[TXT_IMAGE_ADJUST_DETAIL_DARK_DETAIL] = TextCtrl('detail_setting_area', 'setup_imageAdjust_detail_dark_detail_label', NPTZ_WORDING.wID_0871);
                sliderDarkDetail = SliderCtrl('detail_setting_area', 'setup_imageAdjust_detail_dark_detail_slider', 7, 0, cparam_get_DarkDetail(), callbackDarkDetail);
                // dowmcon setting
                $("#downcon_title").html(NPTZ_WORDING.wID_0872);
                //CHROMA
                txtDetailObject[TXT_IMAGE_ADJUST_DETAIL_CHROMA] = TextCtrl('downcon_setting_area', 'setup_imageAdjust_detail_chroma_label', NPTZ_WORDING.wID_0873);
                // CHROMA LEVEL SWITCH
                txtDetailObject[TXT_IMAGE_ADJUST_DETAIL_CHROMA_LEVEL_SWITCH] = TextCtrl('downcon_setting_area', 'setup_imageAdjust_detail_chroma_level_switch_label', NPTZ_WORDING.wID_0874);
                chromaLevelRadioButtonGroup = RadioButtonGroupCtrl("downcon_setting_area", "setup_imageAdjust_detail_chroma_level_switch_", RADIO_GROUP.rID_0016, cparam_get_downconchromaLevelSwitch(), callbackChromaLevelSwitch);
                // CHROMA LEVEL 
                txtDetailObject[TXT_IMAGE_ADJUST_DETAIL_CHROMA_LEVEL] = TextCtrl('downcon_setting_area', 'setup_imageAdjust_detail_chroma_level_label', NPTZ_WORDING.wID_0875);
                sliderChromaLevel = SliderCtrl('downcon_setting_area', 'setup_imageAdjust_detail_chroma_level_slider', 40, -100, cparam_get_downconchromaLevel(), callbackChromaLevel, '%');
                //DETAIL SETTING
                txtDetailObject[TXT_IMAGE_ADJUST_DETAIL_DETAIL_SETTING] = TextCtrl('downcon_setting_area', 'setup_imageAdjust_detail_detail_setting_label', NPTZ_WORDING.wID_0876);
                // DOWNCON DETAIL
                txtDetailObject[TXT_IMAGE_ADJUST_DETAIL_DOWNCON_DETAIL] = TextCtrl('downcon_setting_area', 'setup_imageAdjust_detail_downcon_detail_label', NPTZ_WORDING.wID_0738);
                downconDetailRadioButtonGroup = RadioButtonGroupCtrl("downcon_setting_area", "setup_imageAdjust_detail_downcon_detail_", RADIO_GROUP.rID_0016, cparam_get_downconDetail(), callbackDownconDetail);
                // MASTER DETAIL 
                txtDetailObject[TXT_IMAGE_ADJUST_DETAIL_DOWNCON_MASTER_DETAIL] = TextCtrl('downcon_setting_area', 'setup_imageAdjust_detail_master_detail_label', NPTZ_WORDING.wID_0857);
                sliderDownconMasterDetail = SliderCtrl('downcon_setting_area', 'setup_imageAdjust_detail_master_detail_slider', 31, -31, cparam_get_masterDetail(), callbackMasterDetail);
                // H DETAIL LEVEL 
                txtDetailObject[TXT_IMAGE_ADJUST_DETAIL_DOWNCON_H_DETAIL_LEVELL] = TextCtrl('downcon_setting_area', 'setup_imageAdjust_detail_downcon_h_detail_level_label', NPTZ_WORDING.wID_0877);
                sliderDownconHDetailLevel = SliderCtrl('downcon_setting_area', 'setup_imageAdjust_detail_downcon_h_detail_level_slider', 63, 0, cparam_get_downconHDetailLevel(), callbackDownconHDetailLevel);
                // V DETAIL LEVEL 
                txtDetailObject[TXT_IMAGE_ADJUST_DETAIL_DOWNCON_V_DETAIL_LEVELL] = TextCtrl('downcon_setting_area', 'setup_imageAdjust_detail_downcon_v_detail_level_label', NPTZ_WORDING.wID_0878);
                sliderDownconVDetailLevel = SliderCtrl('downcon_setting_area', 'setup_imageAdjust_detail_downcon_v_detail_level_slider', 63, 0, cparam_get_downconVDetailLevel(), callbackDownconVDetailLevel);
                // PEAK FREQUENCY
                txtDetailObject[TXT_IMAGE_ADJUST_DETAIL_DOWNCON_PEAK_FREQUENCY] = TextCtrl('downcon_setting_area', 'setup_imageAdjust_detail_downcon_peak_frequency_label', NPTZ_WORDING.wID_0879);
                sliderDownconPeakFrequency = SliderCtrl('downcon_setting_area', 'setup_imageAdjust_detail_downcon_peak_frequency_slider', null, null, cparam_get_downconPeakFrequency(), callbackDownconPeakFrequency, '', '', '', '', sysConst.getPeakFrequency());
                // V DETAIL FREQUENCY
                txtDetailObject[TXT_IMAGE_ADJUST_DETAIL_DOWNCON_V_DETAIL_FREQUENCY] = TextCtrl('downcon_setting_area', 'setup_imageAdjust_detail_downcon_v_detail_frequency_label', NPTZ_WORDING.wID_0880);
                sliderDownconVDetailFrequency = SliderCtrl('downcon_setting_area', 'setup_imageAdjust_detail_downcon_v_detail_frequency_slider', 31, 0, cparam_get_downconVDetailFrequency(), callbackDownconVDetailFrequency);
                // downcon crisp
                txtDetailObject[TXT_IMAGE_ADJUST_DETAIL_DOWNCON_CRISP] = TextCtrl('downcon_setting_area', 'setup_imageAdjust_detail_downcon_crisp_label', NPTZ_WORDING.wID_0860);
                sliderDownconCrisp = SliderCtrl('downcon_setting_area', 'setup_imageAdjust_detail_downcon_crisp_slider', 63, 0, cparam_get_downconCrisp(), callbackDownconCrisp);
                // detail clip +
                txtDetailObject[TXT_IMAGE_ADJUST_DETAIL_DOWNCON_CLIP_PLUS] = TextCtrl('downcon_setting_area', 'setup_imageAdjust_detail_downcon_clip_plus_label', NPTZ_WORDING.wID_0864);
                sliderDetailDownconClipPlus = SliderCtrl('downcon_setting_area', 'setup_imageAdjust_detail_downcon_clip_plus_slider', 63, 0, cparam_get_detailDownconClipPlus(), callbackDetailDownconClipPlus);
                // detail clip -
                txtDetailObject[TXT_IMAGE_ADJUST_DETAIL_DOWNCON_CLIP_MINUS] = TextCtrl('downcon_setting_area', 'setup_imageAdjust_detail_downcon_clip_minus_label', NPTZ_WORDING.wID_0865);
                sliderDetailDownconClipMinus = SliderCtrl('downcon_setting_area', 'setup_imageAdjust_detail_downcon_clip_minus_slider', 63, 0, cparam_get_detailDownconClipMinus(), callbackDetailDownconClipMinus);
                // KNEE APERTURE LEVEL
                txtDetailObject[TXT_IMAGE_ADJUST_DETAIL_DOWNCON_KNEE_APERTURE_LEVEL] = TextCtrl('downcon_setting_area', 'setup_imageAdjust_detail_downcon_knee_aperture_level_label', NPTZ_WORDING.wID_0866);
                sliderDetailDownconKneeApertureLevel = SliderCtrl('downcon_setting_area', 'setup_imageAdjust_detail_downcon_knee_aperture_level_slider', 39, 0, cparam_get_detailDownconKneeApertureLevel(), callbackDetailDownconKneeApertureLevel);
                // DETAIL KNEE
                txtDetailObject[TXT_IMAGE_ADJUST_DETAIL_DOWNCON_KNEE] = TextCtrl('downcon_setting_area', 'setup_imageAdjust_detail_downcon_knee_label', NPTZ_WORDING.wID_0867);
                sliderDetailDownconKnee = SliderCtrl('downcon_setting_area', 'setup_imageAdjust_detail_downcon_knee_slider', 15, 0, cparam_get_detailDownconKnee(), callbackDetailDownconKnee);
                // LEVEL DEPENDENT SWITCH
                txtDetailObject[TXT_IMAGE_ADJUST_DETAIL_DOWNCON_LEVEL_DEPENDENT_SWITCH] = TextCtrl('downcon_setting_area', 'setup_imageAdjust_detail_downcon_level_dependent_switch_label', NPTZ_WORDING.wID_0868);
                downconLevelDependentRadioButtonGroup = RadioButtonGroupCtrl("downcon_setting_area", "setup_imageAdjust_detail_downcon_level_dependent_switch_", RADIO_GROUP.rID_0016, cparam_get_downconLevelDependentSwitch(), callbackDownconLevelDependentSwitch);
                // LEVEL DEPENDENT
                txtDetailObject[TXT_IMAGE_ADJUST_DETAIL_DOWNCON_LEVEL_DEPENDENT] = TextCtrl('downcon_setting_area', 'setup_imageAdjust_downcon_level_dependent_label', NPTZ_WORDING.wID_0869);
                sliderDetailDownconLevelDependent = SliderCtrl('downcon_setting_area', 'setup_imageAdjust_detail_downcon_level_dependent_slider', 15, 0, cparam_get_downconLevelDependent(), callbackDetailDownconLevelDependent);
                // DARK DETAIL SWITCH
                txtDetailObject[TXT_IMAGE_ADJUST_DETAIL_DOWNCON_DARK_DETAIL_SWITCH] = TextCtrl('downcon_setting_area', 'setup_imageAdjust_detail_downcon_dark_detail_switch_label', NPTZ_WORDING.wID_0870);
                downconDarkDetailRadioButtonGroup = RadioButtonGroupCtrl("downcon_setting_area", "setup_imageAdjust_detail_downcon_dark_detail_switch_", RADIO_GROUP.rID_0016, cparam_get_downconDarkDetailSwitch(), callbackDownconDarkDetailSwitch);
                // DARK DETAIL
                txtDetailObject[TXT_IMAGE_ADJUST_DETAIL_DOWNCON_DARK_DETAIL] = TextCtrl('downcon_setting_area', 'setup_imageAdjust_detail_downcon_dark_detail_label', NPTZ_WORDING.wID_0871);
                sliderDownconDarkDetail = SliderCtrl('downcon_setting_area', 'setup_imageAdjust_detail_downcon_dark_detail_slider', 7, 0, cparam_get_downconDarkDetail(), callbackDownconDarkDetail);
                // SKIN TONE DETAIL
                txtDetailObject[TXT_IMAGE_ADJUST_DETAIL_DOWNCON_SKIN_TONE_DETAIL] = TextCtrl('downcon_setting_area', 'setup_imageAdjust_detail_downcon_skin_tone_detail_label', NPTZ_WORDING.wiD_0882);
                downconSkinToneDetailRadioButtonGroup = RadioButtonGroupCtrl("downcon_setting_area", "setup_imageAdjust_detail_downcon_skin_tone_detail_", RADIO_GROUP.rID_0016, cparam_get_skinToneSwitch(), callbackSkinToneSwitch);
                // memory select
                txtDetailObject[TXT_IMAGE_ADJUST_DETAIL_DOWNCON_SKIN_TONE_MEMORY_SELECT] = TextCtrl('downcon_setting_area', 'setup_imageAdjust_detail_downcon_skin_tone_memory_label', NPTZ_WORDING.wiD_0883);
                downconSkinToneMemorySelectRadioButtonGroup = RadioButtonGroupCtrl("downcon_setting_area", "setup_imageAdjust_detail_downcon_skin_tone_memory_", RADIO_GROUP.rID_0104, cparam_get_memorySelectSwitch(), callbackMemorySelectSwitch);
                // memory select
                txtDetailObject[TXT_IMAGE_ADJUST_DETAIL_DOWNCON_ZEBRA] = TextCtrl('downcon_setting_area', 'setup_imageAdjust_detail_downcon_zebra_label', NPTZ_WORDING.wiD_0884);
                downconZebraRadioButtonGroup = RadioButtonGroupCtrl("downcon_setting_area", "setup_imageAdjust_detail_downcon_zebra_", RADIO_GROUP.rID_0016, cparam_get_downconZebra(), callbackDownconZebra);
                // ZEBRA EFFECT MEMORY
                txtDetailObject[TXT_IMAGE_ADJUST_DETAIL_DONWCON_ZEBRA_EFFECT_MEMORY] = TextCtrl('downcon_setting_area', 'setup_imageAdjust_detail_downcon_zebra_effect_memory_label', NPTZ_WORDING.wiD_0885);
                downconZebraEffectMemoryRadioButtonGroup = RadioButtonGroupCtrl("downcon_setting_area", "setup_imageAdjust_detail_downcon_zebra_effect_memory_", RADIO_GROUP.rID_0105, cparam_get_zebraEffectMemory(), callbackZebraEffectMemory);
                // SKIN TONE EFFECT MEMORY
                txtDetailObject[TXT_IMAGE_ADJUST_DETAIL_DONWCON_SKIN_TONE_EFFECT_MEMORY] = TextCtrl('downcon_setting_area', 'setup_imageAdjust_detail_downcon_skin_tone_effect_memory_label', NPTZ_WORDING.wiD_0886);
                downconSkinToneEffectMemoryRadioButtonGroup = RadioButtonGroupCtrl("downcon_setting_area", "setup_imageAdjust_detail_downcon_skin_tone_effect_memory_", RADIO_GROUP.rID_0105, cparam_get_skinToneEffectMemory(), callbackSkinToneEffectMemory);
                // SKIN TONE CRISP
                txtDetailObject[TXT_IMAGE_ADJUST_DETAIL_DONWCON_SKIN_TONE_CRISP] = TextCtrl('downcon_setting_area', 'setup_imageAdjust_detail_downcon_skin_tone_crisp_label', NPTZ_WORDING.wiD_0887);
                sliderDownconSkinToneCrisp = SliderCtrl('downcon_setting_area', 'setup_imageAdjust_detail_downcon_skin_tone_crisp_slider', 8, 0, cparam_get_downconSkinToneCrisp(), callbackDownconSkinToneCrisp);
                // I CENTER
                txtDetailObject[TXT_IMAGE_ADJUST_DETAIL_DONWCON_I_CENTER] = TextCtrl('downcon_setting_area', 'setup_imageAdjust_detail_downcon_i_center_label', NPTZ_WORDING.wiD_0888);
                sliderDownconICenter = SliderCtrl('downcon_setting_area', 'setup_imageAdjust_detail_downcon_i_center_slider', 255, 0, cparam_get_downconICenter(), callbackDownconICenter);
                // I WIDTH
                txtDetailObject[TXT_IMAGE_ADJUST_DETAIL_DONWCON_I_WIDTH] = TextCtrl('downcon_setting_area', 'setup_imageAdjust_detail_downcon_i_width_label', NPTZ_WORDING.wiD_0889);
                sliderDownconIWidth = SliderCtrl('downcon_setting_area', 'setup_imageAdjust_detail_downcon_i_width_slider', 255, 0, cparam_get_downconIWidth(), callbackDownconIWidth);
                //Q WIDTH
                txtDetailObject[TXT_IMAGE_ADJUST_DETAIL_DONWCON_Q_WIDTH] = TextCtrl('downcon_setting_area', 'setup_imageAdjust_detail_downcon_q_width_label', NPTZ_WORDING.wiD_0890);
                sliderDownconQWidth = SliderCtrl('downcon_setting_area', 'setup_imageAdjust_detail_downcon_q_width_slider', 127, 0, cparam_get_downconQWidth(), callbackDownconQWidth);
                //Q PHASE
                txtDetailObject[TXT_IMAGE_ADJUST_DETAIL_DONWCON_Q_PHASE] = TextCtrl('downcon_setting_area', 'setup_imageAdjust_detail_downcon_q_phase_label', NPTZ_WORDING.wiD_0891);
                sliderDownconQPhase = SliderCtrl('downcon_setting_area', 'setup_imageAdjust_detail_downcon_q_phase_slider', 359, 0, cparam_get_downconQPhase(), callbackDownconQPhase);
                // dowmcon setting
                $("#skin_tone_detail_title").html(NPTZ_WORDING.wID_0892);
                // SKIN TONE DETAIL
                txtDetailObject[TXT_IMAGE_ADJUST_DETAIL_SKIN_TONE_DETAIL] = TextCtrl('skin_tone_detail_setting_area', 'setup_imageAdjust_detail_skin_tone_detail_label', NPTZ_WORDING.wID_0893);
                skinToneDetailRadioButtonGroup = RadioButtonGroupCtrl("skin_tone_detail_setting_area", "setup_imageAdjust_detail_skin_tone_detail_", RADIO_GROUP.rID_0016, cparam_get_skinToneDetail(), callbackSkinToneDetail);
                // memory select
                txtDetailObject[TXT_IMAGE_ADJUST_DETAIL_SKIN_TONE_DETAIL_MEMORY_SELECT] = TextCtrl('skin_tone_detail_setting_area', 'setup_imageAdjust_detail_skin_tone_detail_memory_select_label', NPTZ_WORDING.wiD_0883);
                skinToneDetailMemorySelectRadioButtonGroup = RadioButtonGroupCtrl("skin_tone_detail_setting_area", "setup_imageAdjust_detail_skin_tone_detail_memory_select_", RADIO_GROUP.rID_0104, cparam_get_skinToneDetailMemorySelectSwitch(), callbackSkinToneDetailMemorySelectSwitch);
                // memory select
                txtDetailObject[TXT_IMAGE_ADJUST_DETAIL_SKIN_TONE_ZEBRA] = TextCtrl('skin_tone_detail_setting_area', 'setup_imageAdjust_detail_skin_tone_zebra_label', NPTZ_WORDING.wiD_0884);
                skinToneZebraRadioButtonGroup = RadioButtonGroupCtrl("skin_tone_detail_setting_area", "setup_imageAdjust_detail_skin_tone_zebra_", RADIO_GROUP.rID_0016, cparam_get_zebra(), callbackZebra);
                // ZEBRA EFFECT MEMORY
                txtDetailObject[TXT_IMAGE_ADJUST_DETAIL_SKIN_TONE_ZEBRA_EFFECT_MEMORY] = TextCtrl('skin_tone_detail_setting_area', 'setup_imageAdjust_detail_skin_tone_zebra_effect_memory_label', NPTZ_WORDING.wiD_0885);
                skinToneZebraEffectMemoryRadioButtonGroup = RadioButtonGroupCtrl("skin_tone_detail_setting_area", "setup_imageAdjust_detail_skin_tone_zebra_effect_memory_", RADIO_GROUP.rID_0105, cparam_get_toneZebraEffectMemory(), callbackToneZebraEffectMemory);
                // ZEBRA EFFECT MEMORY
                txtDetailObject[TXT_IMAGE_ADJUST_DETAIL_SKIN_TONE_EFFECT_MEMORY] = TextCtrl('skin_tone_detail_setting_area', 'setup_imageAdjust_detail_skin_tone_effect_memory_label', NPTZ_WORDING.wiD_0886);
                skinToneEffectMemoryRadioButtonGroup = RadioButtonGroupCtrl("skin_tone_detail_setting_area", "setup_imageAdjust_detail_skin_tone_effect_memory_", RADIO_GROUP.rID_0105, cparam_get_toneEffectMemory(), callbackToneEffectMemory);
                // SKIN TONE CRISP
                txtDetailObject[TXT_IMAGE_ADJUST_DETAIL_SKIN_TONE_CRISP] = TextCtrl('skin_tone_detail_setting_area', 'setup_imageAdjust_detail_skin_tone_crisp_label', NPTZ_WORDING.wiD_0887);
                sliderSkinToneCrisp = SliderCtrl('skin_tone_detail_setting_area', 'setup_imageAdjust_detail_skin_tone_crisp_slider', 63, -63, cparam_get_skinToneCrisp(), callbackSkinToneCrisp);
                // I CENTER
                txtDetailObject[TXT_IMAGE_ADJUST_DETAIL_SKIN_TONE_I_CENTER] = TextCtrl('skin_tone_detail_setting_area', 'setup_imageAdjust_detail_skin_tone_i_center_label', NPTZ_WORDING.wiD_0888);
                sliderSkinToneICenter = SliderCtrl('skin_tone_detail_setting_area', 'setup_imageAdjust_detail_skin_tone_i_center_slider', 255, 0, cparam_get_skinToneICenter(), callbackSkinToneICenter);
                // I WIDTH
                txtDetailObject[TXT_IMAGE_ADJUST_DETAIL_SKIN_TONE_I_WIDTH] = TextCtrl('skin_tone_detail_setting_area', 'setup_imageAdjust_detail_skin_tone_i_width_label', NPTZ_WORDING.wiD_0889);
                sliderSkinToneIWidth = SliderCtrl('skin_tone_detail_setting_area', 'setup_imageAdjust_detail_skin_tone_i_width_slider', 255, 0, cparam_get_skinToneIWidth(), callbackSkinToneIWidth);
                //Q WIDTH
                txtDetailObject[TXT_IMAGE_ADJUST_DETAIL_SKIN_TONE_Q_WIDTH] = TextCtrl('skin_tone_detail_setting_area', 'setup_imageAdjust_detail_skin_tone_q_width_label', NPTZ_WORDING.wiD_0890);
                sliderSkinToneQWidth = SliderCtrl('skin_tone_detail_setting_area', 'setup_imageAdjust_detail_skin_tone_q_width_slider', 255, 0, cparam_get_skinToneQWidth(), callbackSkinToneQWidth);
                //Q PHASE
                txtDetailObject[TXT_IMAGE_ADJUST_DETAIL_SKIN_TONE_Q_PHASE] = TextCtrl('skin_tone_detail_setting_area', 'setup_imageAdjust_detail_skin_tone_q_phase_label', NPTZ_WORDING.wiD_0891);
                sliderSkinToneQPhase = SliderCtrl('skin_tone_detail_setting_area', 'setup_imageAdjust_detail_skin_tone_q_phase_slider', 359, 0, cparam_get_skinToneQPhase(), callbackSkinToneQPhase);

                LineCtrl('detail_setting_area', 'vertical', 60, 37, 580, "setup_imageAdjust_detail_setting_v_top_label");
                LineCtrl('detail_setting_area', 'horizontal', 113, 54, 700, "setup_imageAdjust_detail_setting_h_top_label");
                LineCtrl('detail_setting_area', 'vertical', 60, 37, 580, "setup_imageAdjust_detail_setting_detail_v_label");
                LineCtrl('detail_setting_area', 'horizontal', 113, 54, 700, "setup_imageAdjust_detail_setting_h_label");
                LineCtrl('detail_setting_area', 'horizontal', 113, 54, 700, "setup_imageAdjust_detail_setting_h_label2");
                LineCtrl('detail_setting_area', 'horizontal', 113, 54, 700, "setup_imageAdjust_detail_setting_h_label3");
                LineCtrl('detail_setting_area', 'horizontal', 113, 54, 700, "setup_imageAdjust_detail_setting_h_label4");
                LineCtrl('detail_setting_area', 'horizontal', 113, 54, 700, "setup_imageAdjust_detail_setting_h_label5");
                LineCtrl('detail_setting_area', 'horizontal', 113, 54, 700, "setup_imageAdjust_detail_setting_h_label6");
                LineCtrl('detail_setting_area', 'horizontal', 113, 54, 700, "setup_imageAdjust_detail_setting_h_label7");
                LineCtrl('detail_setting_area', 'horizontal', 113, 54, 700, "setup_imageAdjust_detail_setting_h_label8");
                LineCtrl('detail_setting_area', 'horizontal', 113, 54, 700, "setup_imageAdjust_detail_setting_h_label9");
                LineCtrl('detail_setting_area', 'horizontal', 113, 54, 700, "setup_imageAdjust_detail_setting_h_label10");
                LineCtrl('detail_setting_area', 'horizontal', 113, 54, 700, "setup_imageAdjust_detail_setting_h_label11");
                LineCtrl('detail_setting_area', 'horizontal', 113, 54, 700, "setup_imageAdjust_detail_setting_h_label12");
                //    LineCtrl('detail_setting_area', 'horizontal', 113, 54, 700, "setup_imageAdjust_detail_setting_h_label13");
                LineCtrl('detail_setting_area', 'horizontal', 113, 54, 700, "setup_imageAdjust_detail_setting_dark_h_label");
                LineCtrl('detail_setting_area', 'vertical', 60, 37, 580, "setup_imageAdjust_detail_setting_dark_v_label");

                LineCtrl('downcon_setting_area', 'vertical', 60, 37, 580, "setup_imageAdjust_detail_setting_downcon_v_top_label");
                LineCtrl('downcon_setting_area', 'horizontal', 113, 54, 700, "setup_imageAdjust_detail_setting_h_top_label");
                LineCtrl('downcon_setting_area', 'vertical', 113, 54, 700, "setup_imageAdjust_detail_downcon_chroma_setting_v_label");
                LineCtrl('downcon_setting_area', 'vertical', 113, 54, 700, "setup_imageAdjust_detail_downcon_detail_setting_v_label");
                LineCtrl('downcon_setting_area', 'vertical', 60, 37, 580, "setup_imageAdjust_detail_setting_downcon_detail_v_label");
                LineCtrl('downcon_setting_area', 'vertical', 60, 37, 580, "setup_imageAdjust_detail_setting_downcon_skin_tone_detail_v_label");
                LineCtrl('downcon_setting_area', 'horizontal', 113, 54, 700, "setup_imageAdjust_detail_setting_h_label");
                LineCtrl('downcon_setting_area', 'horizontal', 113, 54, 700, "setup_imageAdjust_detail_setting_h_label2");
                LineCtrl('downcon_setting_area', 'horizontal', 113, 54, 700, "setup_imageAdjust_detail_setting_downcon_detail_h_label");
                LineCtrl('downcon_setting_area', 'horizontal', 113, 54, 700, "setup_imageAdjust_detail_setting_h_label4");
                LineCtrl('downcon_setting_area', 'horizontal', 113, 54, 700, "setup_imageAdjust_detail_setting_detail_h_label5");
                LineCtrl('downcon_setting_area', 'horizontal', 113, 54, 700, "setup_imageAdjust_detail_setting_detail_h_label6");
                LineCtrl('downcon_setting_area', 'horizontal', 113, 54, 700, "setup_imageAdjust_detail_setting_detail_h_label7");
                LineCtrl('downcon_setting_area', 'horizontal', 113, 54, 700, "setup_imageAdjust_detail_setting_detail_h_label8");
                LineCtrl('downcon_setting_area', 'horizontal', 113, 54, 700, "setup_imageAdjust_detail_setting_detail_h_label9");
                LineCtrl('downcon_setting_area', 'horizontal', 113, 54, 700, "setup_imageAdjust_detail_setting_detail_h_label10");
                LineCtrl('downcon_setting_area', 'horizontal', 113, 54, 700, "setup_imageAdjust_detail_setting_detail_h_label11");
                LineCtrl('downcon_setting_area', 'horizontal', 113, 54, 700, "setup_imageAdjust_detail_setting_detail_h_label12");
                LineCtrl('downcon_setting_area', 'horizontal', 113, 54, 700, "setup_imageAdjust_detail_setting_detail_h_label13");
                LineCtrl('downcon_setting_area', 'horizontal', 113, 54, 700, "setup_imageAdjust_detail_setting_detail_h_label14");
                LineCtrl('downcon_setting_area', 'horizontal', 113, 54, 700, "setup_imageAdjust_detail_setting_detail_h_label15");
                LineCtrl('downcon_setting_area', 'horizontal', 113, 54, 700, "setup_imageAdjust_detail_setting_detail_h_label16");
                LineCtrl('downcon_setting_area', 'horizontal', 113, 54, 700, "setup_imageAdjust_detail_setting_detail_h_label17");
                LineCtrl('downcon_setting_area', 'horizontal', 113, 54, 700, "setup_imageAdjust_detail_setting_detail_h_label18");
                LineCtrl('downcon_setting_area', 'horizontal', 113, 54, 700, "setup_imageAdjust_detail_setting_detail_h_label19");
                LineCtrl('downcon_setting_area', 'horizontal', 113, 54, 700, "setup_imageAdjust_detail_setting_detail_h_label20");
                LineCtrl('downcon_setting_area', 'horizontal', 113, 54, 700, "setup_imageAdjust_detail_setting_detail_h_label21");
                LineCtrl('downcon_setting_area', 'horizontal', 113, 54, 700, "setup_imageAdjust_detail_setting_detail_h_label22");
                LineCtrl('downcon_setting_area', 'horizontal', 113, 54, 700, "setup_imageAdjust_detail_setting_detail_h_label23");
                LineCtrl('downcon_setting_area', 'horizontal', 113, 54, 700, "setup_imageAdjust_detail_setting_detail_h_label24");
                LineCtrl('downcon_setting_area', 'horizontal', 113, 54, 700, "setup_imageAdjust_detail_setting_detail_h_label25");
                LineCtrl('downcon_setting_area', 'horizontal', 113, 54, 700, "setup_imageAdjust_detail_setting_detail_h_label26");
                LineCtrl('downcon_setting_area', 'horizontal', 113, 54, 700, "setup_imageAdjust_detail_setting_detail_h_label27");
                LineCtrl('downcon_setting_area', 'horizontal', 113, 54, 700, "setup_imageAdjust_detail_setting_detail_h_label28");

                LineCtrl('skin_tone_detail_setting_area', 'vertical', 60, 37, 580, "setup_imageAdjust_detail_setting_skin_tone_v_top_label");
                LineCtrl('skin_tone_detail_setting_area', 'horizontal', 60, 37, 580, "setup_imageAdjust_detail_setting_skin_tone_h_top_label");
                LineCtrl('skin_tone_detail_setting_area', 'vertical', 60, 37, 580, "setup_imageAdjust_detail_setting_skin_tone_v_label");
                LineCtrl('skin_tone_detail_setting_area', 'horizontal', 60, 37, 580, "setup_imageAdjust_detail_setting_skin_tone_h_label1");
                LineCtrl('skin_tone_detail_setting_area', 'horizontal', 60, 37, 580, "setup_imageAdjust_detail_setting_skin_tone_h_label2");
                //    LineCtrl('skin_tone_detail_setting_area', 'horizontal', 60, 37, 580, "setup_imageAdjust_detail_setting_skin_tone_h_label3");
                LineCtrl('skin_tone_detail_setting_area', 'horizontal', 60, 37, 580, "setup_imageAdjust_detail_setting_skin_tone_h_label4");
                LineCtrl('skin_tone_detail_setting_area', 'horizontal', 60, 37, 580, "setup_imageAdjust_detail_setting_skin_tone_h_label5");
                LineCtrl('skin_tone_detail_setting_area', 'horizontal', 60, 37, 580, "setup_imageAdjust_detail_setting_skin_tone_h_label6");
                LineCtrl('skin_tone_detail_setting_area', 'horizontal', 60, 37, 580, "setup_imageAdjust_detail_setting_skin_tone_h_label7");
                LineCtrl('skin_tone_detail_setting_area', 'horizontal', 60, 37, 580, "setup_imageAdjust_detail_setting_skin_tone_h_label8");
                LineCtrl('skin_tone_detail_setting_area', 'horizontal', 60, 37, 580, "setup_imageAdjust_detail_setting_skin_tone_h_label9");
                // LineCtrl('skin_tone_detail_setting_area', 'horizontal', 60, 37, 580, "setup_imageAdjust_detail_setting_skin_tone_h_label10");
                // LineCtrl('skin_tone_detail_setting_area', 'horizontal', 60, 37, 580, "setup_imageAdjust_detail_setting_skin_tone_h_label11");
                LineCtrl('skin_tone_detail_setting_area', 'horizontal', 60, 37, 580, "setup_imageAdjust_detail_setting_skin_tone_h_label12");
                LineCtrl('skin_tone_detail_setting_area', 'vertical', 60, 37, 580, "setup_imageAdjust_detail_setting_skin_tone_zebra_v_label");
                LineCtrl('skin_tone_detail_setting_area', 'horizontal', 60, 37, 580, "setup_imageAdjust_detail_setting_skin_tone_zebra_h_label");
                for (var text in txtDetailObject) {
                    txtDetailObject[text].show();
                }
                refreshAllStatus();
            } else {
                rebuild();
            }
            if (buildScrollSuccessFlg) {
                buildScrollSuccessFlg = false;
                setTimeout(function () {
                    myScroll = new IScroll('#setup_imageAdjust_detail_detail_main', {
                        preventDefault: false,
                        click: false,
                        tap: true,
                        scrollbars: true,
                        mouseWheel: true,
                        interactiveScrollbars: true,
                        shrinkScrollbars: 'scale',
                        fadeScrollbars: false,
                        useTransform: false
                    });
                    buildScrollSuccessFlg = true;
                }, 300)
            }
        }
        function rebuild() {
            // 状態制御

            // pictureBtnStatusChange();

            //changeDetailStatus();
            refreshAllStatus();
        }
        function refreshAllStatus() {
            sliderMasterDetail.setValue(cparam_get_DetailmasterDetail());
            sliderDetailPeakFrequency.setValue(cparam_get_peakFrequency());
            sliderDetailCrisp.setValue(cparam_get_crisp());
            sliderDetailGainPlus.setValue(cparam_get_gainPlus());
            sliderDetailGainMinus.setValue(cparam_get_gainMinus());
            sliderDetailClipPlus.setValue(cparam_get_detailClipPlus());
            sliderDetailClipMinus.setValue(cparam_get_detailClipMinus());
            sliderDetailKneeApertureLevel.setValue(cparam_get_detailKneeApertureLevel());
            sliderDetailKnee.setValue(cparam_get_detailKnee());
            sliderDetailLevelDependent.setValue(cparam_get_detailLevelDependent());
            sliderDarkDetail.setValue(cparam_get_DarkDetail());
            sliderChromaLevel.setValue(cparam_get_downconchromaLevel());
            sliderDownconMasterDetail.setValue(cparam_get_masterDetail());
            sliderDownconHDetailLevel.setValue(cparam_get_downconHDetailLevel());
            sliderDownconVDetailLevel.setValue(cparam_get_downconVDetailLevel());
            sliderDownconPeakFrequency.changeRange(null, null, sysConst.getPeakFrequency());
            sliderDownconVDetailFrequency.setValue(cparam_get_downconVDetailFrequency());
            sliderDownconCrisp.setValue(cparam_get_downconCrisp());
            sliderDetailDownconClipPlus.setValue(cparam_get_detailDownconClipPlus());
            sliderDetailDownconClipMinus.setValue(cparam_get_detailDownconClipMinus());
            sliderDetailDownconKneeApertureLevel.setValue(cparam_get_detailDownconKneeApertureLevel());
            sliderDetailDownconKnee.setValue(cparam_get_detailDownconKnee());
            sliderDetailDownconLevelDependent.setValue(cparam_get_downconLevelDependent());
            sliderDownconDarkDetail.setValue(cparam_get_downconDarkDetail());
            sliderDownconSkinToneCrisp.setValue(cparam_get_downconSkinToneCrisp());
            sliderDownconICenter.setValue(cparam_get_downconICenter());
            sliderDownconIWidth.setValue(cparam_get_downconIWidth());
            sliderDownconQWidth.setValue(cparam_get_downconQWidth());
            sliderDownconQPhase.setValue(cparam_get_downconQPhase());
            sliderSkinToneCrisp.setValue(cparam_get_skinToneCrisp());
            sliderSkinToneICenter.setValue(cparam_get_skinToneICenter());
            sliderSkinToneIWidth.setValue(cparam_get_skinToneIWidth());
            sliderSkinToneQWidth.setValue(cparam_get_skinToneQWidth());
            sliderSkinToneQPhase.setValue(cparam_get_skinToneQPhase());
            detailRadioButtonGroup.setSelectedValue(cparam_get_detail());
            levelDependentRadioButtonGroup.setSelectedValue(cparam_get_levelDependentSwitch());
            darkDetailRadioButtonGroup.setSelectedValue(cparam_get_darkDetailSwitch());
            downconDetailRadioButtonGroup.setSelectedValue(cparam_get_downconDetail());
            chromaLevelRadioButtonGroup.setSelectedValue(cparam_get_downconchromaLevelSwitch());
            downconLevelDependentRadioButtonGroup.setSelectedValue(cparam_get_downconLevelDependentSwitch());
            downconDarkDetailRadioButtonGroup.setSelectedValue(cparam_get_downconDarkDetailSwitch());
            downconSkinToneDetailRadioButtonGroup.setSelectedValue(cparam_get_skinToneSwitch());
            downconSkinToneMemorySelectRadioButtonGroup.setSelectedValue(cparam_get_memorySelectSwitch());
            downconZebraRadioButtonGroup.setSelectedValue(cparam_get_downconZebra());
            downconZebraEffectMemoryRadioButtonGroup.setSelectedValue(cparam_get_zebraEffectMemory());
            downconSkinToneEffectMemoryRadioButtonGroup.setSelectedValue(cparam_get_skinToneEffectMemory());
            skinToneDetailRadioButtonGroup.setSelectedValue(cparam_get_skinToneDetail());
            skinToneDetailMemorySelectRadioButtonGroup.setSelectedValue(cparam_get_skinToneDetailMemorySelectSwitch());
            skinToneZebraRadioButtonGroup.setSelectedValue(cparam_get_zebra());
            skinToneZebraEffectMemoryRadioButtonGroup.setSelectedValue(cparam_get_toneZebraEffectMemory());
            skinToneEffectMemoryRadioButtonGroup.setSelectedValue(cparam_get_toneEffectMemory());
            if (getVlogStatus()) {
                detailRadioButtonGroup.displayDisabled();
                skinToneGrayOut();
            } else {
                detailRadioButtonGroup.displayOff();
                skinToneLightUP();
            }
            if (cparam_get_detail() == "0" || getVlogStatus()) {
                detailGrayout();
            } else {
                detailLightUp();
            }
            if (getGrayFormatStatus() && getFormatStatus() || getVlogStatus()) {
                downconGrayOut();
            } else {
                downconLightUp();
            }
            if (downconDetailRadioButtonGroup.getSelectedValue() == 0) {
                sliderDownconMasterDetail.setDisable();
                sliderDownconHDetailLevel.setDisable();
                sliderDownconVDetailLevel.setDisable();
                sliderDownconPeakFrequency.setDisable();
                sliderDownconVDetailFrequency.setDisable();
                sliderDownconCrisp.setDisable();
                sliderDetailDownconClipPlus.setDisable();
                sliderDetailDownconClipMinus.setDisable();
                sliderDetailDownconKneeApertureLevel.setDisable();
                sliderDetailDownconKnee.setDisable();
                downconLevelDependentRadioButtonGroup.displayDisabled();
                sliderDetailDownconLevelDependent.setDisable();
                downconDarkDetailRadioButtonGroup.displayDisabled();
                sliderDownconDarkDetail.setDisable();
            } else {
                sliderDownconMasterDetail.setEnable();
                sliderDownconHDetailLevel.setEnable();
                sliderDownconVDetailLevel.setEnable();
                sliderDownconPeakFrequency.setEnable();
                sliderDownconVDetailFrequency.setEnable();
                sliderDownconCrisp.setEnable();
                sliderDetailDownconClipPlus.setEnable();
                sliderDetailDownconClipMinus.setEnable();
                sliderDetailDownconKneeApertureLevel.setEnable();
                sliderDetailDownconKnee.setEnable();
                downconLevelDependentRadioButtonGroup.displayOff();
                sliderDetailDownconLevelDependent.setEnable();
                downconDarkDetailRadioButtonGroup.displayOff();
                sliderDownconDarkDetail.setEnable();
            }
            if (chromaLevelRadioButtonGroup.getSelectedValue() == 0) {
                sliderChromaLevel.setDisable();
            } else {
                sliderChromaLevel.setEnable();
            }
        }
        function getVlogStatus() {
            if (cparam_get_v_log() == "1" && cparam_get_v_log_paint_sw() == "0") {
                return true;
            } else {
                return false;
            }
        }
        function getGrayFormatStatus() {
            return GRAY_FORMAT.indexOf(cparam_get_format()) == -1;
        }
        function getFormatStatus() {
            if (cparam_get_format() == '1F') {
                return false;
            } else {
                return true;
            }
        }
        function detailLightUp() {
            sliderMasterDetail.setEnable();
            sliderDetailPeakFrequency.setEnable();
            sliderDetailCrisp.setEnable();
            sliderDetailGainPlus.setEnable();
            sliderDetailGainMinus.setEnable();
            sliderDetailClipPlus.setEnable();
            sliderDetailClipMinus.setEnable();
            sliderDetailKneeApertureLevel.setEnable();
            sliderDetailKnee.setEnable()
            levelDependentRadioButtonGroup.displayOff();
            sliderDetailLevelDependent.setEnable();
            darkDetailRadioButtonGroup.displayOff();
            sliderDarkDetail.setEnable();
        }
        function detailGrayout() {
            sliderMasterDetail.setDisable();
            sliderDetailPeakFrequency.setDisable();
            sliderDetailCrisp.setDisable();
            sliderDetailGainPlus.setDisable();
            sliderDetailGainMinus.setDisable();
            sliderDetailClipPlus.setDisable();
            sliderDetailClipMinus.setDisable();
            sliderDetailKneeApertureLevel.setDisable();
            sliderDetailKnee.setDisable();
            levelDependentRadioButtonGroup.displayDisabled();
            sliderDetailLevelDependent.setDisable();
            darkDetailRadioButtonGroup.displayDisabled();
            sliderDarkDetail.setDisable();
        }

        function downconLightUp() {
            chromaLevelRadioButtonGroup.displayOff();
            sliderChromaLevel.setEnable();
            downconDetailRadioButtonGroup.displayOff();
            sliderDownconMasterDetail.setEnable();
            sliderDownconHDetailLevel.setEnable();
            sliderDownconVDetailLevel.setEnable();
            sliderDownconPeakFrequency.setEnable();
            sliderDownconVDetailFrequency.setEnable();
            sliderDownconCrisp.setEnable();
            sliderDetailDownconClipPlus.setEnable();
            sliderDetailDownconClipMinus.setEnable();
            sliderDetailDownconKneeApertureLevel.setEnable();
            sliderDetailDownconKnee.setEnable();
            downconLevelDependentRadioButtonGroup.displayOff();
            sliderDetailDownconLevelDependent.setEnable();
            downconDarkDetailRadioButtonGroup.displayOff();
            sliderDownconDarkDetail.setEnable();
            downconSkinToneDetailRadioButtonGroup.displayOff();
            downconSkinToneMemorySelectRadioButtonGroup.displayOff();
            if (skinToneZebraRadioButtonGroup.getSelectedValue() == 1) {
                downconZebraRadioButtonGroup.displayDisabled();
            } else {
                downconZebraRadioButtonGroup.displayOff();
            }
            downconZebraEffectMemoryRadioButtonGroup.displayOff();
            downconSkinToneEffectMemoryRadioButtonGroup.displayOff();
            sliderDownconSkinToneCrisp.setEnable();
            sliderDownconICenter.setEnable();
            sliderDownconIWidth.setEnable();
            sliderDownconQWidth.setEnable();
            sliderDownconQPhase.setEnable();
        }
        function downconGrayOut() {
            chromaLevelRadioButtonGroup.displayDisabled();
            sliderChromaLevel.setDisable();
            downconDetailRadioButtonGroup.displayDisabled();
            sliderDownconMasterDetail.setDisable();
            sliderDownconHDetailLevel.setDisable();
            sliderDownconVDetailLevel.setDisable();
            sliderDownconPeakFrequency.setDisable();
            sliderDownconVDetailFrequency.setDisable();
            sliderDownconCrisp.setDisable();
            sliderDetailDownconClipPlus.setDisable();
            sliderDetailDownconClipMinus.setDisable();
            sliderDetailDownconKneeApertureLevel.setDisable();
            sliderDetailDownconKnee.setDisable();
            downconLevelDependentRadioButtonGroup.displayDisabled();
            sliderDetailDownconLevelDependent.setDisable();
            downconDarkDetailRadioButtonGroup.displayDisabled();
            sliderDownconDarkDetail.setDisable();
            downconSkinToneDetailRadioButtonGroup.displayDisabled();
            downconSkinToneMemorySelectRadioButtonGroup.displayDisabled();
            downconZebraRadioButtonGroup.displayDisabled();
            downconZebraEffectMemoryRadioButtonGroup.displayDisabled();
            downconSkinToneEffectMemoryRadioButtonGroup.displayDisabled();
            sliderDownconSkinToneCrisp.setDisable();
            sliderDownconICenter.setDisable();
            sliderDownconIWidth.setDisable();
            sliderDownconQWidth.setDisable();
            sliderDownconQPhase.setDisable();
        }
        function skinToneLightUP() {
            skinToneDetailRadioButtonGroup.displayOff();
            skinToneDetailMemorySelectRadioButtonGroup.displayOff();
            if (downconZebraRadioButtonGroup.getSelectedValue() == 1) {
                skinToneZebraRadioButtonGroup.displayDisabled();
            } else {
                skinToneZebraRadioButtonGroup.displayOff();
            }
            skinToneZebraEffectMemoryRadioButtonGroup.displayOff();
            skinToneEffectMemoryRadioButtonGroup.displayOff();
            sliderSkinToneCrisp.setEnable();
            sliderSkinToneICenter.setEnable();
            sliderSkinToneIWidth.setEnable();
            sliderSkinToneQWidth.setEnable();
            sliderSkinToneQPhase.setEnable();
        }
        function skinToneGrayOut() {
            skinToneDetailRadioButtonGroup.displayDisabled();
            skinToneDetailMemorySelectRadioButtonGroup.displayDisabled();
            skinToneZebraRadioButtonGroup.displayDisabled();
            skinToneZebraEffectMemoryRadioButtonGroup.displayDisabled();
            skinToneEffectMemoryRadioButtonGroup.displayDisabled();
            sliderSkinToneCrisp.setDisable();
            sliderSkinToneICenter.setDisable();
            sliderSkinToneIWidth.setDisable();
            sliderSkinToneQWidth.setDisable();
            sliderSkinToneQPhase.setDisable();
        }
        function callbackDetailSetting() {
            var selectedValue = detailRadioButtonGroup.getSelectedValue();
            cparam_set_detail(selectedValue);
            if (selectedValue == "1") {
                detailLightUp();
                // skinToneLightUP();
            } else {
                detailGrayout();
                // skinToneGrayOut();
            }

        }
        function callbackMasterDetailSetting() {
            cparam_set_DetailmasterDetail(sliderMasterDetail.getValue());
        }
        function callbackLevelDependentSwitch() {
            cparam_set_levelDependentSwitch(levelDependentRadioButtonGroup.getSelectedValue());
        }
        function callbackDarkDetailSwitch() {
            cparam_set_darkDetailSwitch(darkDetailRadioButtonGroup.getSelectedValue());
        }
        function callbackChromaLevelSwitch() {
            cparam_set_downconchromaLevelSwitch(chromaLevelRadioButtonGroup.getSelectedValue());
            if (chromaLevelRadioButtonGroup.getSelectedValue() == 0) {
                sliderChromaLevel.setDisable();
            } else {
                sliderChromaLevel.setEnable();
            }
        }
        function callbackDownconDetail() {
            cparam_set_downconDetail(downconDetailRadioButtonGroup.getSelectedValue());
            if (downconDetailRadioButtonGroup.getSelectedValue() == 0) {
                sliderDownconMasterDetail.setDisable();
                sliderDownconHDetailLevel.setDisable();
                sliderDownconVDetailLevel.setDisable();
                sliderDownconPeakFrequency.setDisable();
                sliderDownconVDetailFrequency.setDisable();
                sliderDownconCrisp.setDisable();
                sliderDetailDownconClipPlus.setDisable();
                sliderDetailDownconClipMinus.setDisable();
                sliderDetailDownconKneeApertureLevel.setDisable();
                sliderDetailDownconKnee.setDisable();
                downconLevelDependentRadioButtonGroup.displayDisabled();
                sliderDetailDownconLevelDependent.setDisable();
                downconDarkDetailRadioButtonGroup.displayDisabled();
                sliderDownconDarkDetail.setDisable();
            } else {
                sliderDownconMasterDetail.setEnable();
                sliderDownconHDetailLevel.setEnable();
                sliderDownconVDetailLevel.setEnable();
                sliderDownconPeakFrequency.setEnable();
                sliderDownconVDetailFrequency.setEnable();
                sliderDownconCrisp.setEnable();
                sliderDetailDownconClipPlus.setEnable();
                sliderDetailDownconClipMinus.setEnable();
                sliderDetailDownconKneeApertureLevel.setEnable();
                sliderDetailDownconKnee.setEnable();
                downconLevelDependentRadioButtonGroup.displayOff();
                sliderDetailDownconLevelDependent.setEnable();
                downconDarkDetailRadioButtonGroup.displayOff();
                sliderDownconDarkDetail.setEnable();
            }
        }
        function callbackPeakFrequency() {
            cparam_set_peakFrequency(sliderDetailPeakFrequency.getValue());
        }
        function callbackDetailCrisp() {
            cparam_set_crisp(sliderDetailCrisp.getValue());
        }
        function callbackDetailGainPlus() {
            cparam_set_gainPlus(sliderDetailGainPlus.getValue());
        }
        function callbackDetailGainMinus() {
            cparam_set_gainMinus(sliderDetailGainMinus.getValue());
        }
        function callbackDetailClipPlus() {
            cparam_set_detailClipPlus(sliderDetailClipPlus.getValue());
        }
        function callbackDetailClipMinus() {
            cparam_set_detailClipMinus(sliderDetailClipMinus.getValue());
        }
        function callbackDetailKneeApertureLevel() {
            cparam_set_detailKneeApertureLevel(sliderDetailKneeApertureLevel.getValue());
        }
        function callbackDetailKnee() {
            cparam_set_detailKnee(sliderDetailKnee.getValue());
        }
        function callbackDetailLevelDependent() {
            cparam_set_detailLevelDependent(sliderDetailLevelDependent.getValue());
        }
        function callbackDarkDetail() {
            cparam_set_DarkDetail(sliderDarkDetail.getValue());
        }
        function callbackChromaLevel() {
            cparam_set_downconchromaLevel(sliderChromaLevel.getValue());
        }
        function callbackMasterDetail() {
            cparam_set_masterDetail(sliderDownconMasterDetail.getValue());
        }
        function callbackDownconHDetailLevel() {
            cparam_set_downconHDetailLevel(sliderDownconHDetailLevel.getValue());
        }
        function callbackDownconVDetailLevel() {
            cparam_set_downconVDetailLevel(sliderDownconVDetailLevel.getValue());
        }
        function callbackDownconPeakFrequency() {
            cparam_set_downconPeakFrequency(sliderDownconPeakFrequency.getCgiValue());
        }
        function callbackDownconVDetailFrequency() {
            cparam_set_downconVDetailFrequency(sliderDownconVDetailFrequency.getValue());
        }
        function callbackDownconCrisp() {
            cparam_set_downconCrisp(sliderDownconCrisp.getValue());
        }
        function callbackDetailDownconClipPlus() {
            cparam_set_detailDownconClipPlus(sliderDetailDownconClipPlus.getValue());
        }
        function callbackDetailDownconClipMinus() {
            cparam_set_detailDownconClipMinus(sliderDetailDownconClipMinus.getValue());
        }
        function callbackDetailDownconKneeApertureLevel() {
            cparam_set_detailDownconKneeApertureLevel(sliderDetailDownconKneeApertureLevel.getValue());
        }
        function callbackDetailDownconKnee() {
            cparam_set_detailDownconKnee(sliderDetailDownconKnee.getValue());
        }
        function callbackDownconLevelDependentSwitch() {
            cparam_set_downconLevelDependentSwitch(downconLevelDependentRadioButtonGroup.getSelectedValue());
        }
        function callbackDetailDownconLevelDependent() {
            cparam_set_downconLevelDependent(sliderDetailDownconLevelDependent.getValue());
        }
        function callbackDownconDarkDetailSwitch() {
            cparam_set_downconDarkDetailSwitch(downconDarkDetailRadioButtonGroup.getSelectedValue());
        }
        function callbackSkinToneSwitch() {
            cparam_set_skinToneSwitch(downconSkinToneDetailRadioButtonGroup.getSelectedValue());
        }
        function callbackDownconDarkDetail() {
            cparam_set_downconDarkDetail(sliderDownconDarkDetail.getValue());
        }
        function callbackMemorySelectSwitch() {
            cparam_set_memorySelectSwitch(downconSkinToneMemorySelectRadioButtonGroup.getSelectedValue());
        }
        function callbackDownconZebra() {
            cparam_set_downconZebra(downconZebraRadioButtonGroup.getSelectedValue());
            if (downconZebraRadioButtonGroup.getSelectedValue() == 1) {
                skinToneZebraRadioButtonGroup.displayDisabled();
            } else {
                skinToneZebraRadioButtonGroup.displayOff();
            }
        }
        function callbackZebra() {
            cparam_set_zebra(skinToneZebraRadioButtonGroup.getSelectedValue());
            if (skinToneZebraRadioButtonGroup.getSelectedValue() == 1) {
                downconZebraRadioButtonGroup.displayDisabled();
            } else {
                downconZebraRadioButtonGroup.displayOff();
            }
        }
        function callbackZebraEffectMemory() {
            cparam_set_zebraEffectMemory(downconZebraEffectMemoryRadioButtonGroup.getSelectedValue());
        }
        function callbackToneZebraEffectMemory() {
            cparam_set_toneZebraEffectMemory(skinToneZebraEffectMemoryRadioButtonGroup.getSelectedValue());
        }
        function callbackToneEffectMemory() {
            cparam_set_toneEffectMemory(skinToneEffectMemoryRadioButtonGroup.getSelectedValue());
        }
        function callbackSkinToneEffectMemory() {
            cparam_set_skinToneffectMemory(downconSkinToneEffectMemoryRadioButtonGroup.getSelectedValue());
        }
        function callbackDownconSkinToneCrisp() {
            cparam_set_downconSkinToneCrisp(sliderDownconSkinToneCrisp.getValue());
        }
        function callbackDownconICenter() {
            cparam_set_downconICenter(sliderDownconICenter.getValue());
        }
        function callbackDownconIWidth() {
            cparam_set_downconIWidth(sliderDownconIWidth.getValue());
        }
        function callbackDownconQWidth() {
            cparam_set_downconQWidth(sliderDownconQWidth.getValue());
        }
        function callbackDownconQPhase() {
            cparam_set_downconQPhase(sliderDownconQPhase.getValue());
        }
        function callbackSkinToneDetail() {
            cparam_set_skinToneDetail(skinToneDetailRadioButtonGroup.getSelectedValue());
        }
        function callbackSkinToneDetailMemorySelectSwitch() {
            cparam_set_skinToneDetailMemorySelectSwitch(skinToneDetailMemorySelectRadioButtonGroup.getSelectedValue());
        }
        function callbackSkinToneCrisp() {
            cparam_set_skinToneCrisp(sliderSkinToneCrisp.getValue());
        }
        function callbackSkinToneICenter() {
            cparam_set_skinToneICenter(sliderSkinToneICenter.getValue());
        }
        function callbackSkinToneIWidth() {
            cparam_set_skinToneIWidth(sliderSkinToneIWidth.getValue());
        }
        function callbackSkinToneQWidth() {
            cparam_set_skinToneQWidth(sliderSkinToneQWidth.getValue());
        }
        function callbackSkinToneQPhase() {
            cparam_set_skinToneQPhase(sliderSkinToneQPhase.getValue());
        }
        return {
            build: function () {
                return buildSettingDetail();
            }
        }
    }

    return {
        build: buildImageAdjust,
        rebuild: rebuild,
        settingBrightness: settingBrightness,
        settingPicture: settingPicture,
        settingMatrix: settingMatrix,
        settingGammaKnee: settingGammaKnee,
        settingDetail: settingDetail
    };
}
/**
 * MonitorDisplay画面:MonitorDisplay制御に関わる画面クラス
 * @class lens画面:lens制御に関わる画面クラス
 * @return {{build: buildMonitorDisplay, rebuild: rebuild}} build 構築�E琁E
 * @return {function} rebuild 再構築�E琁E
 * @constructor
 */
function MonitorDisplay() {
    /**
     * MonitorDisplay main title
     */
    var txtMonitorDisplayMainTitle;
    /**
     * 構築フラグ
     * @type boolean
     */
    let buildFlag_MonitorDisplay = false;

    /**
     * label定義
     * @type number
     */
    const TXT_WFM = 0;
    const TXT_MODE = 1;
    const TXT_POSITION = 2;
    const TXT_STATUS_INDICATOR = 3;
    const TXT_STATUS_INDICATOR_RETURN_SELECT = 4;
    const TXT_STATUS_INDICATOR_AUDIO = 5;
    const TXT_LEVEL_GAUGE = 6;
    let sliderLensMaxDigitalZoom;
    let txtMonitorDisplayObject = [];

    let wfmModeRadioButtonGroup;
    let wfmPositionRadioButtonGroup;
    let returnModeRadioButtonGroup;
    let audioModeRadioButtonGroup;
    let levelGaugeRadioButtonGroup;

    /**
     * Audio画面構築�E琁E
     */
    function buildMonitorDisplay() {
        if (!buildFlag_MonitorDisplay) {
            buildFlag_MonitorDisplay = true;
            // main title
            txtMonitorDisplayMainTitle = TextCtrl('setup_monitor_display_main_title', 'setup_monitor_display_main_title_label', NPTZ_WORDING.wID_0732);
            txtMonitorDisplayMainTitle.show();

            // wfm mode
            txtMonitorDisplayObject[TXT_WFM] = TextCtrl('setup_monitor_display_label_top', 'setup_wfm_label', NPTZ_WORDING.wID_0733);
            LineCtrl('setup_monitor_display_main_main', 'horizontal', 73, 0, 1320, 'setup_wfm', "97.5");
            // Wfm mode radioButtonItems
            txtMonitorDisplayObject[TXT_MODE] = TextCtrl('setup_monitor_display_label_top', 'setup_monitor_display_mode_label', NPTZ_WORDING.wID_0227);
            wfmModeRadioButtonGroup = RadioButtonGroupCtrl("setup_monitor_display_form_top", "setup_wfm_mode_", RADIO_GROUP.rID_0088, getWfmModeValue(), callbackWfmMode);
            LineCtrl('setup_monitor_display_main_main', 'horizontal', 73, 0, 1320, 'setup_wfm_mode_h', "97.5");

            // Position
            txtMonitorDisplayObject[TXT_POSITION] = TextCtrl('setup_monitor_display_label_top', 'setup_monitor_display_position_label', NPTZ_WORDING.wID_0041);
            wfmPositionRadioButtonGroup = RadioButtonGroupCtrl("setup_monitor_display_form_top", "setup_monitor_display_position_", RADIO_GROUP.rID_0086, getWfmPosition(), callbackWfmPosition);
            LineCtrl('setup_monitor_display_main_main', 'horizontal', 73, 0, 1320, 'setup_wfm_position', "97.5");
            LineCtrl('setup_monitor_display_main_main', 'vertical', 130, 50, 50, 'setup_wfm_mode', "97.5");

            // status indicator
            txtMonitorDisplayObject[TXT_STATUS_INDICATOR] = TextCtrl('setup_monitor_display_label_top', 'setup_status_indicator_label', NPTZ_WORDING.wID_0734);
            LineCtrl('setup_monitor_display_main_main', 'horizontal', 73, 0, 1320, 'setup_status_indicator', "97.5");
            LineCtrl('setup_monitor_display_main_main', 'vertical', 130, 50, 50, 'setup_status_indicator_v', "97.5");

            txtMonitorDisplayObject[TXT_STATUS_INDICATOR_RETURN_SELECT] = TextCtrl('setup_monitor_display_label_top', 'setup_monitor_display_status_indicator_return_label', NPTZ_WORDING.wID_0735);
            returnModeRadioButtonGroup = RadioButtonGroupCtrl("setup_monitor_display_form_top", "setup_return_select_", RADIO_GROUP.rID_0016, getStatusReturn(), callbackStatusReturrn);
            LineCtrl('setup_monitor_display_main_main', 'horizontal', 73, 0, 1320, 'setup_return_select', "97.5");


            txtMonitorDisplayObject[TXT_STATUS_INDICATOR_AUDIO] = TextCtrl('setup_monitor_display_label_top', 'setup_monitor_display_status_indicator_audio_label', NPTZ_WORDING.wID_0736);
            audioModeRadioButtonGroup = RadioButtonGroupCtrl("setup_monitor_display_form_top", "setup_audio_select_", RADIO_GROUP.rID_0016, getStatusAudio(), callbackStatusAudio);
            LineCtrl('setup_monitor_display_main_main', 'horizontal', 73, 0, 1320, 'setup_audio_select', "97.5");

            txtMonitorDisplayObject[TXT_LEVEL_GAUGE] = TextCtrl('setup_monitor_display_label_top', 'setup_monitor_display_level_gauge_label', NPTZ_WORDING.wID_0204);
            levelGaugeRadioButtonGroup = RadioButtonGroupCtrl("setup_monitor_display_form_top", "setup_level_gauge_", RADIO_GROUP.rID_0016, getLevelGauge(), callbackLevelGauge);
            LineCtrl('setup_monitor_display_main_main', 'horizontal', 73, 0, 1320, 'setup_level_gauge', "97.5");


            for (var text in txtMonitorDisplayObject) {
                txtMonitorDisplayObject[text].show();
            }
            var SFPMode = cparam_get_SFPMode();
            if(SFPMode == 2){
                wfmModeRadioButtonGroup.displayDisabled();
                wfmPositionRadioButtonGroup.displayDisabled();
            } else {
                wfmModeRadioButtonGroup.displayOff();
                wfmPositionRadioButtonGroup.displayOff();
            }
        } else {
            rebuild();
        }
    }

    /**
     * 画面再構築�E琁E
     */
    function rebuild() {
        wfmModeRadioButtonGroup.setSelectedValue(getWfmModeValue());
        wfmPositionRadioButtonGroup.setSelectedValue(getWfmPosition());
        returnModeRadioButtonGroup.setSelectedValue(getStatusReturn());
        audioModeRadioButtonGroup.setSelectedValue(getStatusAudio());

        var SFPMode = cparam_get_SFPMode();
        if(SFPMode == 2){
            wfmModeRadioButtonGroup.displayDisabled();
            wfmPositionRadioButtonGroup.displayDisabled();
        } else {
            wfmModeRadioButtonGroup.displayOff();
            wfmPositionRadioButtonGroup.displayOff();
        }
    }

    /**
     *
     */
    function getWfmModeValue() {
        return cparam_get_wfmMode();
    }
    function getWfmPosition() {
        return cparam_get_wfmPosition();
    }
    function getStatusReturn() {
        return cparam_get_StatusReturn();
    }
    function getStatusAudio() {
        return cparam_get_StatusAuto();
    }
    function getLevelGauge() {
        return cparam_get_levelGauge();
    }
    /**
     *
     */
    function callbackWfmMode() {
        cparam_set_wfmMode(wfmModeRadioButtonGroup.getSelectedValue());
    }
    function callbackWfmPosition() {
        cparam_set_wfmPosition(wfmPositionRadioButtonGroup.getSelectedValue());
    }
    function callbackStatusReturrn() {
        cparam_set_StatusReturn(returnModeRadioButtonGroup.getSelectedValue());
    }
    function callbackStatusAudio() {
        cparam_set_StatusAuto(audioModeRadioButtonGroup.getSelectedValue());
    }
    function callbackLevelGauge() {
        cparam_set_levelGauge(levelGaugeRadioButtonGroup.getSelectedValue());
    }

    return {
        build: buildMonitorDisplay,
        rebuild: rebuild
    };
}
/**
 * lens画面:lens制御に関わる画面クラス
 * @class lens画面:lens制御に関わる画面クラス
 * @return {{build: buildLens, rebuild: rebuild}} build 構築�E琁E
 * @return {function} rebuild 再構築�E琁E
 * @constructor
 */
function lens() {
    /**
     * Lens main title
     */
    var txtLensMainTitle;
    /**
     * 構築フラグ
     * @type boolean
     */
    let buildFlag_lens = false;

    /**
     * label定義
     * @type number
     */
    const TXT_LENS_FOCUS_MODE = 0;
    const TXT_LENS_ZOOM_MODE = 1;
    const TXT_LENS_MAX_DIGITAL_ZOOM = 2;
    const TXT_LENS_MAX_DIGITAL_ZOOM_MIN = 3;
    const TXT_LENS_MAX_DIGITAL_ZOOM_MAX = 4;
    const TXT_LENS_DIGITAL_EXTENDER = 5;
    const TXT_LENS_OIS = 6;
    // const TXT_CROP_AF = 7;
    const TXT_AF_SENSITIVITY = 7;
    const TXT_ND_FILTER = 8;
    let sliderLensMaxDigitalZoom;
    let txtLensObject = [];

    let focusModeRadioButtonGroup;
    let zoomModeRadioButtonGroup;
    let digitalExtenderRadioButtonGroup;
    let OISRadioButtonGroup;
    let NDFilterRadioButtonGroup;
    let lens_set_button;
    let afSensitivityRadioButtonGroup;

    /**
     * Audio画面構築�E琁E
     */
    function buildLens() {
        if (!buildFlag_lens) {
            buildFlag_lens = true;
            // main title
            txtLensMainTitle = TextCtrl('setup_lens_main_title', 'setup_lens_main_title_label', NPTZ_WORDING.wID_0356);
            txtLensMainTitle.show();

            // Focus mode
            txtLensObject[TXT_LENS_FOCUS_MODE] = TextCtrl('setup_lens_label_top', 'setup_lens_focusMode_label', NPTZ_WORDING.wID_0357);
            // Focus mode radioButtonItems
            focusModeRadioButtonGroup = RadioButtonGroupCtrl("setup_lens_form_top", "setup_lens_focusMode_", RADIO_GROUP.rID_0029, getFocusModeValue(), callbackFocusMode);
            // LineCtrl('setup_lens_main_main', 'horizontal', 73, 0, 1320, 'setup_lens_focusMode', "97.5");

            //UE100 add 20191014
            /*Crop AF*/
            // txtLensObject[TXT_CROP_AF] = TextCtrl('setup_lens_label_top', 'setup_lens_crop_af_label', NPTZ_WORDING.wID_0486)
            // cropAfRadioButtonGroup = RadioButtonGroupCtrl("setup_lens_form_top", "setup_lens_CropAf_", RADIO_GROUP.rID_0016, getCropAfValue(), callbackCropAf)
            /*AF Sensitivity */
            txtLensObject[TXT_AF_SENSITIVITY] = TextCtrl('setup_lens_label_top', 'setup_lens_af_sensitivity_label', NPTZ_WORDING.wID_0589)
            afSensitivityRadioButtonGroup = RadioButtonGroupCtrl("setup_lens_form_top", "setup_lens_Af_Sensitivity_", RADIO_GROUP.rID_0087, getAfSensitivity(), callbackAfSensitivity);
            LineCtrl('setup_lens_main_main', 'horizontal', 73, 0, 1320, 'setup_lens_af_sensitivity', "97.5");
            // Zoom mode
            txtLensObject[TXT_LENS_ZOOM_MODE] = TextCtrl('setup_lens_label', 'setup_lens_zoomMode_label', NPTZ_WORDING.wID_0358);
            // Zoom mode radioButtonItems
            const zoomModeValue = getZoomModeValue();
            zoomModeRadioButtonGroup = RadioButtonGroupCtrl("setup_lens_form", "setup_lens_zoomMode_", RADIO_GROUP.rID_0030, zoomModeValue, callbackZoomMode);

            LineCtrl('setup_lens_main_main', 'vertical', 130, 50, 50, 'setup_lens_zoomMode', "97.5");
            // LineCtrl('setup_lens_main_main', 'vertical', 130, 50, 50, 'setup_lens_cropaf', "97.5");
            LineCtrl('setup_lens_main_main', 'horizontal', 130, 0, 1320, 'setup_lens_zoomMode_', "96");
            LineCtrl('setup_lens_main_main', 'horizontal', 130, 0, 1320, 'setup_lens_crop_af', "96");
            // Max digital zoom
            txtLensObject[TXT_LENS_MAX_DIGITAL_ZOOM] = TextCtrl('setup_lens_label', 'setup_lens_maxDigitalZoom_label', NPTZ_WORDING.wID_0359);
            sliderLensMaxDigitalZoom = SliderCtrl('setup_lens_form', 'setup_lens_maxDigitalZoom_slider', 10, 2, getMaxDigitalZoomValue(), callbackMaxDigitalZoom, 'x', 'before');
            txtLensObject[TXT_LENS_MAX_DIGITAL_ZOOM_MIN] = TextCtrl('setup_lens_form', 'setup_lens_maxDigitalZoom_min_label', NPTZ_WORDING.wID_0360);
            txtLensObject[TXT_LENS_MAX_DIGITAL_ZOOM_MAX] = TextCtrl('setup_lens_form', 'setup_lens_maxDigitalZoom_max_label', NPTZ_WORDING.wID_0361);
            LineCtrl('setup_lens_main_main', 'horizontal', 209, 0, 1320, 'setup_lens_maxDigitalZoom', "97.5");

            // Digital extender
            txtLensObject[TXT_LENS_DIGITAL_EXTENDER] = TextCtrl('setup_lens_label', 'setup_lens_digitalExtender_label', NPTZ_WORDING.wID_0362);
            // Digital extender radioButtonItems
            digitalExtenderRadioButtonGroup = RadioButtonGroupCtrl("setup_lens_form", "setup_lens_digitalExtender_", RADIO_GROUP.rID_0050, getDigitalExtenderValue(), callbackDigitalExtender);
            LineCtrl('setup_lens_main_main', 'horizontal', 277, 0, 1320, 'setup_lens_digitalExtender', "97.5");

            // OIS
            txtLensObject[TXT_LENS_OIS] = TextCtrl('setup_lens_label', 'setup_lens_OIS_label', NPTZ_WORDING.wID_0363);
            // OIS radioButtonItems
            OISRadioButtonGroup = RadioButtonGroupCtrl("setup_lens_form", "setup_lens_OIS_", RADIO_GROUP.rID_0055, getOISValue(), callbackOIS);
            LineCtrl('setup_lens_main_main', 'horizontal', 345, 0, 1320, 'setup_lens_OIS', "97.5");

            // ND Filter
            txtLensObject[TXT_ND_FILTER] = TextCtrl('setup_lens_label', 'setup_lens_NDFilter_label', NPTZ_WORDING.wID_0272);
            // ND Filter radioButtonItems
            NDFilterRadioButtonGroup = RadioButtonGroupCtrl("setup_lens_form", "setup_lens_NDFilter_", RADIO_GROUP.rID_0036, getNDFilterValue(), callbackNDFilter);
            LineCtrl('setup_lens_main_main', 'horizontal', 957, 0, "", "setup_lens_NDFilter", "95");

            if (zoomModeValue == 1 || zoomModeValue == 2) {
                digitalExtenderRadioButtonGroup.setSelectedValue(0);
                digitalExtenderRadioButtonGroup.displayDisabled();
            } else {
                digitalExtenderRadioButtonGroup.displayOff();
            }
            if (zoomModeValue == 2) {
                sliderLensMaxDigitalZoom.setEnable();
            } else {
                sliderLensMaxDigitalZoom.setDisable();
            }

            //#8497
            var ptz_sync_mode = cparam_getPresetPtzSyncMode();
            if(ptz_sync_mode == 1){
                zoomModeRadioButtonGroup.displayDisabled();
            } else {
                zoomModeRadioButtonGroup.displayOff();
            }

            lens_set_button = ButtonCtrl("setup_lens_form", "setup_lens_set_button", NPTZ_WORDING.wID_0141, callbackLensSetButton);
            lens_set_button.getButtonObject().addClass('button_class');
            lens_set_button.show();
            lens_set_button.displayOff();

            for (var text in txtLensObject) {
                txtLensObject[text].show();
            }
            cropAFStatusChange();
            callbackZoomMode();
        } else {
            rebuild();
            callbackZoomMode();
        }
    }
    function getNDFilterValue() {
        return cparam_get_NDFilter();
    }
    function callbackNDFilter() {
        // cparam_set_NDFilter(NDFilterRadioButtonGroup.getSelectedValue());
    }
    function cropAFStatusChange() {
        const uhdCropRadioDate = cparam_get_UHDCrop();
        const dayNightRadioDate = cparam_get_dayNight();
        if (dayNightRadioDate == 1) {
            NDFilterRadioButtonGroup.displayDisabled();
        } else {
            NDFilterRadioButtonGroup.displayOff();
        }
        // if(uhdCropRadioDate == 0){
        //     cropAfRadioButtonGroup.displayDisabled();
        // }else{
        //     cropAfRadioButtonGroup.displayOff();
        //     cropAfRadioButtonGroup.setSelectedValue(getCropAfValue());
        // }
        if (focusModeRadioButtonGroup.getSelectedValue() == "0") {
            afSensitivityRadioButtonGroup.displayDisabled();
        } else {
            afSensitivityRadioButtonGroup.displayOff();
        }
        if (uhdCropRadioDate == 0) {
            zoomModeRadioButtonGroup.displayOff();
            zoomModeRadioButtonGroup.setSelectedValue(getZoomModeValue());
            digitalExtenderRadioButtonGroup.displayOff();
            digitalExtenderRadioButtonGroup.setSelectedValue(getDigitalExtenderValue());
            const zoomModeValue = getZoomModeValue();
            if (zoomModeValue == 2) {
                sliderLensMaxDigitalZoom.setEnable();
            } else {
                sliderLensMaxDigitalZoom.setDisable();
            }
            if (zoomModeValue == 1 || zoomModeValue == 2) {
                digitalExtenderRadioButtonGroup.displayDisabled();
            } else {
                digitalExtenderRadioButtonGroup.displayOff();
            }
        } else {
            // zoomModeRadioButtonGroup.displayDisabled();
            // digitalExtenderRadioButtonGroup.displayDisabled();
            sliderLensMaxDigitalZoom.setDisable();
        }

    }

    /**
     * 画面再構築�E琁E
     */
    function rebuild() {
        const zoomModeValue = getZoomModeValue();
        focusModeRadioButtonGroup.setSelectedValue(getFocusModeValue());
        afSensitivityRadioButtonGroup.setSelectedValue(getAfSensitivity());
        NDFilterRadioButtonGroup.setSelectedValue(getNDFilterValue());
        zoomModeRadioButtonGroup.setSelectedValue(zoomModeValue);
        sliderLensMaxDigitalZoom.setValue(getMaxDigitalZoomValue());
        digitalExtenderRadioButtonGroup.setSelectedValue(getDigitalExtenderValue());
        OISRadioButtonGroup.setSelectedValue(getOISValue());
        if (zoomModeValue == 2) {
            sliderLensMaxDigitalZoom.setEnable();
        } else {
            sliderLensMaxDigitalZoom.setDisable();
        }
        if (zoomModeValue == 1 || zoomModeValue == 2) {
            digitalExtenderRadioButtonGroup.displayDisabled();
        } else {
            digitalExtenderRadioButtonGroup.displayOff();
        }
         //#8497
         var ptz_sync_mode = cparam_getPresetPtzSyncMode();
         if(ptz_sync_mode == 1){
             zoomModeRadioButtonGroup.displayDisabled();
         } else {
             zoomModeRadioButtonGroup.displayOff();
         }
        cropAFStatusChange();
    }

    /**
     *
     */
    function getFocusModeValue() {
        return cparam_get_focusMode();
    }

    function getCropAfValue() {
        return cparam_get_crop_af();
    }

    function getAfSensitivity() {
        return cparam_get_af_sensitivity();
    }

    /**
     *
     */
    function callbackFocusMode() {
        if (focusModeRadioButtonGroup.getSelectedValue() == "0") {
            afSensitivityRadioButtonGroup.displayDisabled();
        } else {
            afSensitivityRadioButtonGroup.displayOff();
        }
        // cropAFStatusChange();
    }
    function callbackCropAf() {
    }
    function callbackAfSensitivity() {
    }
    /**
     *
     */
    function getZoomModeValue() {
        var retValue;
        var dig = cparam_get_digitalZoomDisableEnable();
        var iZoom = cparam_get_iZoom();
        if (dig == 0 && iZoom == 0) {
            retValue = 0;
        }
        if (dig == 0 && iZoom == 1) {
            retValue = 1;
        }
        if (dig == 1 && iZoom == 0) {
            retValue = 2;
        }
        return retValue;
    }

    /**
     *
     */
    function callbackZoomMode() {
        if (zoomModeRadioButtonGroup.getSelectedValue() == 1
            || zoomModeRadioButtonGroup.getSelectedValue() == 2) {
            digitalExtenderRadioButtonGroup.setSelectedValue(0);
            digitalExtenderRadioButtonGroup.displayDisabled();
        } else {
            digitalExtenderRadioButtonGroup.displayOff();
        }

        if (zoomModeRadioButtonGroup.getSelectedValue() == 2) {
            sliderLensMaxDigitalZoom.setEnable();
        } else {
            sliderLensMaxDigitalZoom.setDisable();
        }
    }

    /**
     *
     */
    function getMaxDigitalZoomValue() {
        return cparam_get_maximumDiaitalZoom();
    }

    /**
     *
     */
    function callbackMaxDigitalZoom() {
    }

    /**
     *
     */
    function getDigitalExtenderValue() {
        return cparam_get_digital14_20ExtenderOffOn();
    }

    /**
     *
     */
    function callbackDigitalExtender() {
    }

    /**
     *
     */
    function getOISValue() {
        return cparam_get_OIS();
    }

    /**
     *
     */
    function callbackOIS() {
        // cparam_set_OIS(OISRadioButtonGroup.getSelectedValue());
    }

    function callbackLensSetButton(mouse) {
        if (mouse == Button.MOUSE_DOWN) {
            cparam_set_focusMode(focusModeRadioButtonGroup.getSelectedValue());
            // cparam_set_crop_af(cropAfRadioButtonGroup.getSelectedValue());
            cparam_set_af_sensitivity(afSensitivityRadioButtonGroup.getSelectedValue());
            cparam_set_NDFilter(NDFilterRadioButtonGroup.getSelectedValue());
            switch (zoomModeRadioButtonGroup.getSelectedValue()) {
                case "0":
                    cparam_set_digitalZoomDisableEnable(0);
                    cparam_set_iZoom(0);
                    break;
                case "1":
                    cparam_set_iZoom(1);
                    break;
                case "2":
                    cparam_set_digitalZoomDisableEnable(1);
                    break;
            }
            $("#dialog_setup").show();
            cparam_set_maximumDiaitalZoom(sliderLensMaxDigitalZoom.getValue());
            setTimeout(function () {
                $("#dialog_setup").hide();
            }, 500);
            if (!digitalExtenderRadioButtonGroup.isDisabled()) {
                cparam_set_digital14_20ExtenderOffOn(digitalExtenderRadioButtonGroup.getSelectedValue());
            }
            cparam_set_OIS(OISRadioButtonGroup.getSelectedValue());
        }
    }

    return {
        build: buildLens,
        rebuild: rebuild
    };
}
/**
 * p2Cast画面:p2Cast制御に関わる画面クラス
 * @class p2Cast画面:p2Cast制御に関わる画面クラス
 * @return {{build: buildP2Cast, rebuild: rebuild}} build 構築�E琁E
 * @return {function} rebuild 再構築�E琁E
 * @constructor
 */
function p2Cast() {
    /**
     * 構築フラグ
     * @type boolean
     */
    let buildFlag_P2Cast = false;
    /**
     * checkFlg
     *  @type object
     */
    var checkFlg = true;
    /**
     * label定義
     * @type number
     */
    const TXT_P2Cast_MODE = 0;
    const TXT_P2Cast_CLOUD_URL = 1;
    const TXT_P2Cast_USER_ID = 2;
    const TXT_P2Cast_PASSWORD = 3;

    const INPUT_P2Cast_CLOUD_URL = 0;
    const INPUT_P2Cast_USER_ID = 1
    const INPUT_P2Cast_PASSWORD = 2;
    let txtP2CastObject = [];
    let txtP2CastInputObject = [];

    let modeRadioButtonGroup;
    let p2cast_set_button;

    let settingCheckBoxText;
    let settingCheckBox;
    /**
     * Audio画面構築�E琁E
     */
    function buildP2Cast() {
        if (!buildFlag_P2Cast) {
            buildFlag_P2Cast = true;
            const p2Cast = getP2CastStaus();
            //  mode
            txtP2CastObject[TXT_P2Cast_MODE] = TextCtrl('setup_p2_cast_labels', 'txt_p2cast_mode', NPTZ_WORDING.wID_0227);
            modeRadioButtonGroup = RadioButtonGroupCtrl("setup_p2_cast_form", "setup_p2Cst_Mode_", RADIO_GROUP.rID_0016, p2Cast.mode, callbackMode);

            //  cloud url
            txtP2CastObject[TXT_P2Cast_CLOUD_URL] = TextCtrl('setup_p2_cast_labels', 'txt_p2cast_cloud_url', NPTZ_WORDING.wID_0537);
            txtP2CastInputObject[INPUT_P2Cast_CLOUD_URL] = InputCtrl("setup_p2_cast_form", 'input_p2cast_cloud_url', 'input_p2cast_cloud_url', 'input_p2cast_cloud_url', p2Cast.url, null, null, null, null, 512);

            //  user id
            txtP2CastObject[TXT_P2Cast_USER_ID] = TextCtrl('setup_p2_cast_labels', 'txt_p2cast_user_id', NPTZ_WORDING.wID_0538);
            txtP2CastInputObject[INPUT_P2Cast_USER_ID] = InputCtrl("setup_p2_cast_form", 'input_p2cast_user_id', 'input_p2cast_user_id', 'input_p2cast_user_id', p2Cast.id, null, null, null, null, 24);



            //  password
            txtP2CastObject[TXT_P2Cast_PASSWORD] = TextCtrl('setup_p2_cast_labels', 'txt_p2cast_password', NPTZ_WORDING.wID_0539);
            txtP2CastInputObject[INPUT_P2Cast_PASSWORD] = InputCtrl("setup_p2_cast_form", 'input_p2cast_password', 'input_p2cast_password', 'input_p2cast_password', p2Cast.pass, null, null, null, null, 24);

            settingCheckBoxText = TextCtrl("setup_p2_cast_labels", "setting_btn_checkbox_text", NPTZ_WORDING.wID_0681);
            settingCheckBox = ButtonCtrl("setup_p2_cast_form", "setting_btn_checkbox", "", callbackSettingCheck);

            settingCheckBoxText.show();
            settingCheckBox.show();
            // if(p2Cast.recommended){
            checkFlg = true;
            settingCheckBox.displayOn();
            // }else{
            //     settingCheckBox.displayOff();
            //     checkFlg = false;
            // }

            LineCtrl('setting_p2_cast', 'horizontal', 73, 0, 1320, 'setup_p2cast_mode', "97.5");
            LineCtrl('setting_p2_cast', 'horizontal', 130, 50, 50, 'setup_p2cast_url', "97.5");
            LineCtrl('setting_p2_cast', 'horizontal', 130, 50, 50, 'setup_p2cast_id', "97.5");
            LineCtrl('setting_p2_cast', 'horizontal', 130, 0, 1320, 'setup_p2cast_pas', "97.5");
            LineCtrl('setting_p2_cast', 'horizontal', 130, 0, 1320, 'setup_p2cast_recommend', "97.5");

            p2cast_set_button = ButtonCtrl("setup_p2_cast_form", "setup_p2cast_set_button", NPTZ_WORDING.wID_0141, callbackP2CastSetButton);
            p2cast_set_button.getButtonObject().addClass('button_class');

            p2cast_set_button.show();
            p2cast_set_button.displayOff();

            for (let text in txtP2CastObject) {
                txtP2CastObject[text].show();
            }
            for (let text in txtP2CastInputObject) {
                txtP2CastInputObject[text].show();
                txtP2CastInputObject[text].displayOff();
            }
        } else {
            rebuild();
        }
    }

    function getP2CastStaus() {
        const url = "/cgi-bin/get_p2cast_info";
        const obj = {};
        let ret = cparam_sendRequest(url);
        obj.mode = "";
        obj.url = "";
        obj.id = "";
        obj.pass = "";

        if (ret) {
            ret = cparam_getRetArray(ret);
            for (var i = 0; i < ret.length; i++) {
                if (ret[i].indexOf("mode=") == 0) obj.mode = ret[i].substring("mode=".length);
                else if (ret[i].indexOf("url=") == 0) obj.url = ret[i].substring("url=".length);
                else if (ret[i].indexOf("id=") == 0) obj.id = ret[i].substring("id=".length);
                else if (ret[i].indexOf("pass=") == 0) obj.pass = ret[i].substring("pass=".length);
                else if (ret[i].indexOf("recommended=") == 0) obj.recommended = ret[i].substring("recommended=".length);
            }

            delete ret;
        }
        return obj;
    }

    /**
     * SettingCheck
     */
    function callbackSettingCheck(mouse) {
        if (mouse == Button.MOUSE_DOWN) {

            if (checkFlg) {
                settingCheckBox.displayOff();
                checkFlg = false;
            } else {
                settingCheckBox.displayOn();
                checkFlg = true;
            }
        }
    }
    /**
     * 画面再構築�E琁E
     */
    function rebuild() {
        const p2Cast = getP2CastStaus();
        modeRadioButtonGroup.setSelectedValue(p2Cast.mode);
        txtP2CastInputObject[INPUT_P2Cast_CLOUD_URL].set(p2Cast.url);
        txtP2CastInputObject[INPUT_P2Cast_USER_ID].set(p2Cast.id);
        txtP2CastInputObject[INPUT_P2Cast_PASSWORD].set(p2Cast.pass);
        // if(p2Cast.recommended){
        checkFlg = true;
        settingCheckBox.displayOn();
        // }else{
        //     settingCheckBox.displayOff();
        //     checkFlg = false;
        // }
    }

    function callbackMode() {

    }
    function getNDIHXSettingData() {
        const data = {};
        data['mode'] = modeRadioButtonGroup.getSelectedValue();
        data['url'] = txtP2CastInputObject[INPUT_P2Cast_CLOUD_URL].get();
        data['id'] = txtP2CastInputObject[INPUT_P2Cast_USER_ID].get();
        data['pass'] = txtP2CastInputObject[INPUT_P2Cast_PASSWORD].get();
        data['recommended'] = checkFlg ? 1 : 0;
        return data;
    }
    function callbackP2CastSetButton(mouse) {
        if (mouse == Button.MOUSE_DOWN) {
            if (getNDIHXSettingData().recommended == 1) {
                window.jConfirm(MSG_STATUS.mID_0112, NPTZ_WORDING.wID_0039, NPTZ_WORDING.wID_0040, function (confirm) {
                    if (confirm) {
                        if (txtP2CastInputObject[INPUT_P2Cast_PASSWORD].get().length < 8) {
                            jAlert(MSG_STATUS.mID_0095, NPTZ_WORDING.wID_0039);
                            return;
                        }
                        $("#dialog_setup").show();
                        $.ajax({
                            type: "get",
                            url: '/cgi-bin/set_p2cast_info',
                            data: getNDIHXSettingData(),
                            success: function (data) {
                                setTimeout(function () {
                                    $("#dialog_setup").hide();
                                }, 500);
                            },
                            error: function (jqXHR, textStatus, errorThrown) {
                                setTimeout(function () {
                                    $("#dialog_setup").hide();
                                }, 500);
                            }
                        });
                    } else {
                        return;
                    }
                });
            } else {
                if (txtP2CastInputObject[INPUT_P2Cast_PASSWORD].get().length < 8) {
                    jAlert(MSG_STATUS.mID_0095, NPTZ_WORDING.wID_0039);
                    return;
                }
                $("#dialog_setup").show();
                $.ajax({
                    type: "get",
                    url: '/cgi-bin/set_p2cast_info',
                    data: getNDIHXSettingData(),
                    success: function (data) {
                        setTimeout(function () {
                            $("#dialog_setup").hide();
                        }, 500);
                    },
                    error: function (jqXHR, textStatus, errorThrown) {
                        setTimeout(function () {
                            $("#dialog_setup").hide();
                        }, 500);
                    }
                });
            }
        }
    }


    return {
        build: buildP2Cast,
        rebuild: rebuild,
    };
}
/**
 * cspControl画面:cspControl制御に関わる画面クラス
 * @class cspControl画面:cspControl制御に関わる画面クラス
 * @return {{build: buildcspControl, rebuild: rebuild}} build 構築�E琁E
 * @return {function} rebuild 再構築�E琁E
 * @constructor
 */
function cspControl() {
    /**
    * 構築フラグ
    * @type boolean
    */
    let buildFlag_P2Cast = false;
    /**
     * checkFlg
     *  @type object
     */
    var checkFlg = true;
    /**
     * label定義
     * @type number
     */
    const TXT_CspControl_MODE = 0;
    const TXT_CspControl_DESTINATION_IP_ADDRESS = 1;
    const TXT_CspControl_DESTINATION_PORT = 2;
    const TXT_CspControl_SOURCE_PORT = 3;
    const TXT_CSPCONTROL_CYCLETIME = 4;
    const TXT_CSPCONTROL_CYCKETIME_UNIT = 5;
    const INPUT_CspControl_IP_ADDRESS = 0;
    const INPUT_CspControl_DST_PORT = 1
    const INPUT_CspControl_SRC_PORT = 2;
    const INPUT_CspControl_CycleTime = 3;
    let txtCspControlObject = [];
    let txtCspControlInputObject = [];

    let modeRadioButtonGroup;
    let p2cast_set_button;

    /**
     * csp control build
     */
    function buildCspControl() {
        if (!buildFlag_P2Cast) {
            buildFlag_P2Cast = true;
            const cspControlModel = cparam_getCspControlMode();
            const cspControl = cparam_getCspControlParam();
            //  mode
            txtCspControlObject[TXT_CspControl_MODE] = TextCtrl('setup_csp_control_labels', 'txt_cspControl_mode', NPTZ_WORDING.wID_0227);
            modeRadioButtonGroup = RadioButtonGroupCtrl("setup_csp_control_form", "setup_cspControl_Mode_", RADIO_GROUP.rID_0016, cspControlModel.mode, callbackMode);

            //  ip_adrs
            txtCspControlObject[TXT_CspControl_DESTINATION_IP_ADDRESS] = TextCtrl('setup_csp_control_labels', 'txt_cspControl_address_url', NPTZ_WORDING.wID_0924);
            txtCspControlInputObject[INPUT_CspControl_IP_ADDRESS] = InputCtrl("setup_csp_control_form", 'input_cspControl_address_url', 'input_cspControl_address_url', 'input_cspControl_address_url', cspControl.ip_adrs, null, null, null, null, 512);

            // dst_port
            txtCspControlObject[TXT_CspControl_DESTINATION_PORT] = TextCtrl('setup_csp_control_labels', 'txt_cspControl_destination_port', NPTZ_WORDING.wID_0517);
            txtCspControlInputObject[INPUT_CspControl_DST_PORT] = InputCtrl("setup_csp_control_form", 'input_cspControl_destination_port', 'input_cspControl_destination_port', 'input_cspControl_destination_port', cspControl.dst_port, null, null, null, null, 24);

            //  src_port
            txtCspControlObject[TXT_CspControl_SOURCE_PORT] = TextCtrl('setup_csp_control_labels', 'txt_cspControl_source_port', NPTZ_WORDING.wID_0925);
            txtCspControlInputObject[INPUT_CspControl_SRC_PORT] = InputCtrl("setup_csp_control_form", 'input_cspControl_source_port', 'input_cspControl_source_port', 'input_cspControl_source_port', cspControl.src_port, null, null, null, null, 24);

            //Cycle time
            txtCspControlObject[TXT_CSPCONTROL_CYCLETIME] = TextCtrl("setup_csp_control_labels", "setting_btn_checkbox_text", NPTZ_WORDING.wID_0926);
            txtCspControlInputObject[INPUT_CspControl_CycleTime] = InputCtrl("setup_csp_control_form", 'input_cspControl_cycle_time', 'input_cspControl_cycle_time', 'input_cspControl_cycle_time', cspControl.cycletime, null, null, null, null, 3);
            txtCspControlObject[TXT_CSPCONTROL_CYCKETIME_UNIT] = TextCtrl("setup_csp_control_labels", "setting_btn_checkbox_text_unit", NPTZ_WORDING.wID_0927);

            checkFlg = true;

            LineCtrl('setting_csp_control', 'horizontal', 73, 0, 1320, 'setup_p2cast_mode', "97.5");
            LineCtrl('setting_csp_control', 'horizontal', 130, 50, 50, 'setup_p2cast_url', "97.5");
            LineCtrl('setting_csp_control', 'horizontal', 130, 50, 50, 'setup_p2cast_id', "97.5");
            LineCtrl('setting_csp_control', 'horizontal', 130, 0, 1320, 'setup_p2cast_pas', "97.5");
            LineCtrl('setting_csp_control', 'horizontal', 130, 0, 1320, 'setup_p2cast_recommend', "97.5");

            p2cast_set_button = ButtonCtrl("setup_csp_control_form", "setup_csp_control_set_button", NPTZ_WORDING.wID_0141, callbackCspControlSetButton);
            p2cast_set_button.getButtonObject().addClass('button_class');

            p2cast_set_button.show();
            p2cast_set_button.displayOff();

            for (let text in txtCspControlObject) {
                txtCspControlObject[text].show();
            }
            for (let text in txtCspControlInputObject) {
                txtCspControlInputObject[text].show();
                txtCspControlInputObject[text].displayOff();
            }
        } else {
            rebuild();
        }
    }

    /**
     * 画面再構築
     */
    function rebuild() {
        const cspControlModel = cparam_getCspControlMode();
        const cspControl = cparam_getCspControlParam();
        modeRadioButtonGroup.setSelectedValue(cspControlModel.mode);
        txtCspControlInputObject[INPUT_CspControl_IP_ADDRESS].set(cspControl.ip_adrs);
        txtCspControlInputObject[INPUT_CspControl_DST_PORT].set(cspControl.dst_port);
        txtCspControlInputObject[INPUT_CspControl_SRC_PORT].set(cspControl.src_port);
        txtCspControlInputObject[INPUT_CspControl_CycleTime].set(cspControl.cycletime);
        //checkFlg = true;
        //settingCheckBox.displayOn();
    }

    function callbackMode() {
        //Power ON状態でのみ、シンクロナスプリセットON要求を受け付ける
        if(cparam_get_powerOnStandby() != 1)return;
        $("#dialog_setup").show();
        cparam_setCspControlMode(getCspControlModeSettingData());
    }

    function getCspControlModeSettingData() {
        const mode = {};
        mode['mode'] = modeRadioButtonGroup.getSelectedValue();
        return mode;
    }
    function getNDIHXSettingData() {
        const data = {};
        data['ip_adrs'] = txtCspControlInputObject[INPUT_CspControl_IP_ADDRESS].get();
        data['dst_port'] = txtCspControlInputObject[INPUT_CspControl_DST_PORT].get();
        data['src_port'] = txtCspControlInputObject[INPUT_CspControl_SRC_PORT].get();
        data['cycletime'] = txtCspControlInputObject[INPUT_CspControl_CycleTime].get();
        return data;
    }

    function callbackCspControlSetButton(mouse) {
        if (mouse == Button.MOUSE_DOWN) {
            objErrCode = MSG_STATUS.mID_0009;
            if (!chknet_IsValidIpAddress(txtCspControlInputObject[INPUT_CspControl_IP_ADDRESS].get())) return capi_DispError(txtCspControlInputObject[INPUT_CspControl_IP_ADDRESS].getInputObject(), objErrCode);
            if (!chknet_portNo(txtCspControlInputObject[INPUT_CspControl_DST_PORT].get(), "HTTP", 1)) return capi_DispError(txtCspControlInputObject[INPUT_CspControl_DST_PORT].getInputObject(), objErrCode);
            if (!chknet_portNo(txtCspControlInputObject[INPUT_CspControl_SRC_PORT].get(), "HTTP", 1)) return capi_DispError(txtCspControlInputObject[INPUT_CspControl_SRC_PORT].getInputObject(), objErrCode);
            if (!chknet_CycleTime(txtCspControlInputObject[INPUT_CspControl_CycleTime].get())) {
                return capi_DispError(txtCspControlInputObject[INPUT_CspControl_CycleTime].getInputObject(), objErrCode);
            };

            $("#dialog_setup").show();
            $.ajax({
                type: "get",
                url: '/cgi-bin/set_csp_control_param',
                data: getNDIHXSettingData(),
                success: function (data) {
                    setTimeout(function () {
                        $("#dialog_setup").hide();
                    }, 500);
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    setTimeout(function () {
                        $("#dialog_setup").hide();
                    }, 500);
                }
            });
        }
    }

    return {
        build: buildCspControl,
        rebuild: rebuild,
    };
}
// liqiang add
// check: スライダーが有効な領域にあるかどぁE��
function dragWidHgtMaxChk(ui, dragInfo, dragNm) {
    // divの角度
    var angle = dragInfo.angle;
    // マウスの位置
    var new_position_left = ui.position.left + 3;
    var new_position_top = ui.position.top + 3;
    var point = { x: new_position_left, y: new_position_top };

    // 座標�E頁E��，左上，右上，右下，左下，最初�Eポイントに戻りまぁE
    var polygon;
    if (angle == 90 || angle == 270) {
        polygon = [{ x: 0, y: 0 }, { x: 82, y: 0 }, { x: 82, y: 53 }, { x: 0, y: 53 }, { x: 0, y: 0 }];
    } else if (angle == 0 || angle == 180) {
        polygon = [{ x: 0, y: 0 }, { x: 53, y: 0 }, { x: 53, y: 82 }, { x: 0, y: 83 }, { x: 0, y: 0 }];
    } else if (angle >= 0 && angle < 90) {
        // 既知の角度と斜辺�E�直角辺を求めめE
        var bevelSide01 = 0;
        var bevelSide02 = 0;
        if (dragNm == 'R' || dragNm == 'MG_R' || dragNm == 'MG' || dragNm == 'G_CY' || dragNm == 'G') {
            bevelSide01 = 82;
            bevelSide02 = 53;
        } else if (dragNm == 'B' || dragNm == 'CY_B' || dragNm == 'YE' || dragNm == 'R_YE') {
            bevelSide01 = 53;
            bevelSide02 = 83;
        }

        var hypotenuse01 = hypotenuse(bevelSide01, angle);
        var hypotenuse02 = hypotenuse(bevelSide02, angle);

        // 座標�E頁E��，左上，右上，右下，左下，最初�Eポイントに戻りまぁE
        polygon = [{ x: hypotenuse01[0], y: 0 }, { x: 82, y: hypotenuse02[0] }, { x: hypotenuse01[0], y: 93 }, { x: 0, y: hypotenuse01[1] }, { x: hypotenuse01[0], y: 0 }];
    } else if (angle > 90) {
        //     //已知角度和斜边�E�求直角边
        //     var bevelSide01 = 53;
        //     var bevelSide02 = 83;
        //     var hypotenuse01 = hypotenuse(bevelSide01,angle);
        //     var hypotenuse02 = hypotenuse(bevelSide02,angle);
        //     // 坐栁E��序，左上，右上，右下，左下，回到第一个点
        //     polygon = [{ x: hypotenuse01[0], y: 0 }, { x: 82, y: hypotenuse02[0] }, { x: hypotenuse01[0], y: 93 }, { x: 0, y: hypotenuse01[1] }, { x: hypotenuse01[0], y: 0 }];
    }

    pts = queryPtInPolygon(point, polygon); //pts は、�Eリゴンと交差するポイント�Eコレクションです，奁E��の説明がポリゴンの篁E��冁E��あると判断しまぁE
    return pts;
}

// 既知の角度と斜辺�E�直角辺を求めめE
function hypotenuse(long, angle) {
    //ラジアンを取得しまぁE
    var radian = 2 * Math.PI / 360 * angle;
    return {
        0: Math.sin(radian) * long,// 隣
        1: Math.cos(radian) * long// エチE��に対して
    };
}

// ポイントがポリゴンの篁E��冁E��あるかどぁE��を判断しまぁE
function queryPtInPolygon(point, polygon) {
    var p1, p2, p3, p4;
    p1 = point;
    p2 = { x: 1000000000000, y: point.y };
    var count = 0;
    // 吁E��チE��とレイを比輁E��まぁE
    for (var i = 0; i < polygon.length - 1; i++) {
        p3 = polygon[i];
        p4 = polygon[i + 1];
        if (checkCross(p1, p2, p3, p4) == true) {
            count++;
        }
    }
    p3 = polygon[polygon.length - 1];
    p4 = polygon[0];
    if (checkCross(p1, p2, p3, p4) == true) {
        count++;
    }
    return (count % 2 == 0) ? false : true;
}
// 2 つのセグメントが交差してぁE��かどぁE��を確認しまぁE
function checkCross(p1, p2, p3, p4) {
    var v1 = { x: p1.x - p3.x, y: p1.y - p3.y },
        v2 = { x: p2.x - p3.x, y: p2.y - p3.y },
        v3 = { x: p4.x - p3.x, y: p4.y - p3.y },
        v = crossMul(v1, v3) * crossMul(v2, v3);
    v1 = { x: p3.x - p1.x, y: p3.y - p1.y };
    v2 = { x: p4.x - p1.x, y: p4.y - p1.y };
    v3 = { x: p2.x - p1.x, y: p2.y - p1.y };
    return (v <= 0 && crossMul(v1, v3) * crossMul(v2, v3) <= 0) ? true : false;
}
// ベクトルフォーク乗算を計算しまぁE
function crossMul(v1, v2) {
    return v1.x * v2.y - v1.y * v2.x;
}