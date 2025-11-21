/**
 * @fileOverview Setup画面:mediaOverIp制御に関わる画面クラス
 *
 * @author Panasonic Corporation
 */

/**
 * Media Over IP 機能
 */
var mediaOverIPInstance = mediaOverIP();

/**
 * get_media_over_ip
 */
var objMOIP;
var objMOIPFORMAT;
var objMOIPAUDIOFORMATTX;
var objMOIPRXSTATE;
var objPtp;
var objNmosInfo;
var objNmosMasterEnable;

var objSt2110Info

/**
 * mediaOverIP画面:mediaOverIP制御に関わる画面クラス
 * @class mediaOverIP画面:mediaOverIP制御に関わる画面クラス
 * @return {{build: buildMediaOverIP, rebuild: rebuild}} build 構築処理
 * @return {function} rebuild 再構築処理
 * @return {function} show 表示処理
 * @return {function} hide 非表示処理
 * @constructor
 */
function mediaOverIP() {
    /**
     * settingSt2110 機能
     * @type settingSt2110
     * */
    var settingStatus = settingStatus();

    /**
     * settingSt2110 機能
     * @type settingSt2110
     * */
    var settingSt2110 = settingSt2110();
    /**
     * settingSt2110Tx 機能
     * @type settingSt2110Tx
     * */
    var settingSt2110Tx = settingSt2110Tx();

    /**
     * JPEG 機能
     * @type settingSt2110Rx
     * */
    var settingSt2110Rx = settingSt2110Rx();

    /**
     * JPEG 機能
     * @type settingJpegxsTx
     * */
        var settingJpegxsTx = settingJpegxsTx();

    /**
     * JPEG 機能
     * @type settingJpegxsRx
     * */
    var settingJpegxsRx = settingJpegxsRx();
    /**
     * H264 機能
     * @type settingNmos
     * */
    var settingNmos = settingNmos();
    /**
     * H264 機能
     * @type settingNmos
     * */
    var settingPtp = settingPtp();
    /**
    * 構築フラグ
    * @type boolean
    */
    let buildFlag_mediaOverIP = false;
    /**
     * ボタンオブジェクト
     * @type btnObject[]
     */
    let btnObject = [];
    /**
     * テキストオブジェクト
     * @type btnObject[]
     */
    let txtObject = [];

    /**
     * label定義
     * @type number
     */
    const TXT_MEDIA_OVER_IP = 0;
    /**
     * SETTING_STATUSボタンオブジェクト(インデックス値)
     *  @type object
     */
    const BTN_SETTING_STATUS_INDEX = 0;
    /**
     * ST2110ボタンオブジェクト(インデックス値)
     *  @type object
     */
    const BTN_ST2110_INDEX = 1;
    /**
     * ST2110_TXボタンオブジェクト(インデックス値)
     *  @type object
     */
    const BTN_ST2110_TX_INDEX = 2;
    /**
     * ST2110_RXボタンオブジェクト(インデックス値)
     *  @type object
     */
    const BTN_ST2110_RX_INDEX = 3;
    /**
     * PTPボタンオブジェクト(インデックス値)
     *  @type object
     */
    const BTN_PTP_INDEX = 4;
    /**
     * NMOSボタンオブジェクト(インデックス値)
     *  @type object
     */
    const BTN_NMOS_INDEX = 5;
    /**
     * NMOSボタンオブジェクト(インデックス値)
     *  @type object
     */
    const BTN_JPEG_XS_TX_INDEX = 6;
        /**
     * NMOSボタンオブジェクト(インデックス値)
     *  @type object
     */
    const BTN_JPEG_XS_RX_INDEX = 7;
    /**
     * Media over IP main title
     */
    let txtMediaOverIPMainTitle;

    let st2110Status;

    var st2110EnableState = false;
    var SFPMode = cparam_get_SFPMode();
    /**
     * MediaOverIP画面構築処理
     */
    function buildMediaOverIP() {
        objSt2110Info = getSt2110Info();
        st2110Status = getSt2110InfoResult(objSt2110Info);
        st2110EnableState = st2110Status["enable"] == "1" ? true : false;
        // st2110EnableState = true;
        if (!buildFlag_mediaOverIP) {
            buildFlag_mediaOverIP = true;
            txtObject[TXT_MEDIA_OVER_IP] = TextCtrl('setup_mediaOverIp_menu_title', 'setup_mediaOverIP_menu_label', NPTZ_WORDING.wID_0682);
            for (var text in txtObject) {
                txtObject[text].show();
            }
            // main
            // main title
            txtMediaOverIPMainTitle = TextCtrl('setup_mediaOverIp_main_title', 'setup_mediaOverIp_main_title_label', NPTZ_WORDING.wID_0077);
            txtMediaOverIPMainTitle.show();
            //build menu
            buildSubmenu();
            // 画面変換
            changeToStatusView();
        } else {
            rebuild();
        }
    }

    /**
     * 画面再構築処理
     */
    function rebuild() {
        buildSubmenu();
        changeToStatusView();
    }

    function changeToStatusView() {
        $("#setup_mediaOverIp_main").show();
        $("#setup_mediaOverIp_menu").show();
        $("#setup_mediaOverIp_main_title").show();
        $("#setup_mediaOverIp_settingStatus_main").show();
        $("#setup_mediaOverIp_St2110_main").hide();
        $("#setup_mediaOverIp_InitialDisplaySetting_main").hide();
        btnObject[BTN_SETTING_STATUS_INDEX].displayOn();
        callbackChangeMediaOverIPMenu(Button.MOUSE_DOWN, 1);
    }

    function buildSubmenu() {
        var SFPMode = cparam_get_SFPMode();
        $('#setup_mediaOverIp_menu').empty();
        var divObject = $('<div id="setup_mediaOverIp_menu_title" class="menu_title_class" style=""></div>');
        $('#setup_mediaOverIp_menu').append(divObject);
        txtObject[TXT_MEDIA_OVER_IP] = TextCtrl('setup_mediaOverIp_menu_title', 'setup_mediaOverIP_menu_label', NPTZ_WORDING.wID_0682);
        txtObject[TXT_MEDIA_OVER_IP].show();
        // Menu
        btnObject[BTN_SETTING_STATUS_INDEX] = MenuButtonCtrl('setup_mediaOverIp_menu', "setup_mediaOverIP_settingStatus_btn", NPTZ_WORDING.wID_0077, callbackChangeMediaOverIPMenu, 1, MenuButtonType.SINGLE);
        btnObject[BTN_ST2110_INDEX] = MenuButtonCtrl('setup_mediaOverIp_menu', "setup_mediaOverIP_st2110_btn", NPTZ_WORDING.wID_0683, callbackChangeMediaOverIPMenu, 2, MenuButtonType.TOP);
        if (st2110EnableState && SFPMode == 2) {
            btnObject[BTN_ST2110_TX_INDEX] = MenuButtonCtrl('setup_mediaOverIp_menu', "setup_mediaOverIP_st2110_tx_btn", NPTZ_WORDING.wID_0684, callbackChangeMediaOverIPMenu, 3, MenuButtonType.MIDDLE);
            btnObject[BTN_ST2110_RX_INDEX] = MenuButtonCtrl('setup_mediaOverIp_menu', "setup_mediaOverIP_st2110_rx_btn", NPTZ_WORDING.wID_0685, callbackChangeMediaOverIPMenu, 4, MenuButtonType.MIDDLE);
            btnObject[BTN_JPEG_XS_TX_INDEX] = MenuButtonCtrl('setup_mediaOverIp_menu', "setup_mediaOverIP_jpeg_xs_tx_btn", NPTZ_WORDING.wID_0916, callbackChangeMediaOverIPMenu, 7, MenuButtonType.MIDDLE);
            btnObject[BTN_JPEG_XS_RX_INDEX] = MenuButtonCtrl('setup_mediaOverIp_menu', "setup_mediaOverIP_jpeg_xs_rx_btn", NPTZ_WORDING.wID_0917, callbackChangeMediaOverIPMenu, 8, MenuButtonType.MIDDLE);
            btnObject[BTN_PTP_INDEX] = MenuButtonCtrl('setup_mediaOverIp_menu', "setup_mediaOverIP_ptp_SDPMode_btn", NPTZ_WORDING.wID_0686, callbackChangeMediaOverIPMenu, 5, MenuButtonType.MIDDLE);
            btnObject[BTN_NMOS_INDEX] = MenuButtonCtrl('setup_mediaOverIp_menu', "setup_mediaOverIP_nmos_SFPMode_btn", NPTZ_WORDING.wID_0687, callbackChangeMediaOverIPMenu, 6, MenuButtonType.BOTTOM);
        } else if(st2110EnableState && SFPMode != 2){
            btnObject[BTN_ST2110_TX_INDEX] = MenuButtonCtrl('setup_mediaOverIp_menu', "setup_mediaOverIP_st2110_tx_btn", NPTZ_WORDING.wID_0684, callbackChangeMediaOverIPMenu, 3, MenuButtonType.MIDDLE);
            btnObject[BTN_ST2110_RX_INDEX] = MenuButtonCtrl('setup_mediaOverIp_menu', "setup_mediaOverIP_st2110_rx_btn", NPTZ_WORDING.wID_0685, callbackChangeMediaOverIPMenu, 4, MenuButtonType.MIDDLE);
            btnObject[BTN_PTP_INDEX] = MenuButtonCtrl('setup_mediaOverIp_menu', "setup_mediaOverIP_ptp_btn", NPTZ_WORDING.wID_0686, callbackChangeMediaOverIPMenu, 5, MenuButtonType.MIDDLE);
            btnObject[BTN_NMOS_INDEX] = MenuButtonCtrl('setup_mediaOverIp_menu', "setup_mediaOverIP_nmos_btn", NPTZ_WORDING.wID_0687, callbackChangeMediaOverIPMenu, 6, MenuButtonType.BOTTOM);
        } else {
            btnObject[BTN_PTP_INDEX] = MenuButtonCtrl('setup_mediaOverIp_menu', "setup_mediaOverIP_ptp_off_btn", NPTZ_WORDING.wID_0686, callbackChangeMediaOverIPMenu, 5, MenuButtonType.BOTTOM);
        }
    

        for (var i = 0; i < btnObject.length; i++) {
            if (btnObject[i]) {
                btnObject[i].show();
                btnObject[i].displayOff();
            }
        }
        if(SFPMode == 2){
            $(".setup_mediaOverIP_jpeg_xs_tx_btn").show();
            $(".setup_mediaOverIP_jpeg_xs_tx_btn_Line").show();
            $(".setup_mediaOverIP_jpeg_xs_rx_btn").show();
            $(".setup_mediaOverIP_jpeg_xs_rx_btn_Line").show();
            
        } else {
            $(".setup_mediaOverIP_jpeg_xs_tx_btn").hide();
            $(".setup_mediaOverIP_jpeg_xs_tx_btn_Line").hide();
            $(".setup_mediaOverIP_jpeg_xs_rx_btn").hide();
            $(".setup_mediaOverIP_jpeg_xs_rx_btn_Line").hide();
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
        var result = { enable: "", port: ""};
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
    function getMoip() {
        var url = "/cgi-bin/get_moip";
        var ret = cparam_sendRequest(url);
        var result = {};
        if (ret) {
            ret = cparam_getRetArray(ret);
        }
        return ret;
    }
    function getMoipFormat() {
        var url = "/cgi-bin/get_moip_format";
        var ret = cparam_sendRequest(url);
        var result = {};
        if (ret) {
            ret = cparam_getRetArray(ret);
        }
        return ret;
    }
    function getMoipAudioFormatTx() {
        var url = "/cgi-bin/get_moip_audio_fmt_tx";
        var ret = cparam_sendRequest(url);
        var result = {};
        if (ret) {
            ret = cparam_getRetArray(ret);
        }
        return ret;
    }
    function getMoipRxState() {
        var url = "/cgi-bin/get_moip_rx_state";
        var ret = cparam_sendRequest(url);
        var result = {};
        if (ret) {
            ret = cparam_getRetArray(ret);
        }
        return ret;
    }
    function getPtpInfo() {
        var url = "/cgi-bin/get_ptp_info";
        var ret = cparam_sendRequest(url);
        var result = {};
        if (ret) {
            ret = cparam_getRetArray(ret);
        }
        return ret;
    }
    function getNmosInfo() {
        var url = "/cgi-bin/get_nmos_info";
        var ret = cparam_sendRequest(url);
        var result = {};
        if (ret) {
            ret = cparam_getRetArray(ret);
        }
        return ret;
    }
    function getNmosMasterEnable() {
        var url = "/cgi-bin/get_nmos_master_enable";
        var ret = cparam_sendRequest(url);
        var result = {};
        if (ret) {
            ret = cparam_getRetArray(ret);
        }
        return ret;
    }
    function getMoipVideoTx() {
        var url = "/cgi-bin/get_moip_video_tx";
        var ret = cparam_sendRequest(url);
        var result = {};
        if (ret) {
            ret = cparam_getRetArray(ret);
        }
        return ret;
    }
    function getMoipVideoTxResult(ret, index) {
        var result = { enable: "", name: "", ip_addr: "", port: "" };
        if (ret) {
            for (var i = 0; i < ret.length; i++) {
                if (ret[i].indexOf(index + '_enable=') == 0) {
                    result.enable = ret[i].substring((index + '_enable=').length) == "1" ? "enable" : "disable";
                    continue;
                }
                if (ret[i].indexOf(index + '_name=') == 0) {
                    result.name = ret[i].substring((index + '_name=').length);
                    continue;
                }
                if (ret[i].indexOf(index + '_ip_addr=') == 0) {
                    result.ip_addr = ret[i].substring((index + '_ip_addr=').length);
                    continue;
                }
                if (ret[i].indexOf(index + '_port=') == 0) {
                    result.port = ret[i].substring((index + '_port=').length);
                    continue;
                }
            }
            return result;
        }
    }
    function getMoipAudioTx() {
        var url = "/cgi-bin/get_moip_audio_tx";
        var ret = cparam_sendRequest(url);
        var result = {};
        if (ret) {
            ret = cparam_getRetArray(ret);
        }
        return ret;
    }
    function getMoipAudioTxResult(ret, index) {
        var result = { enable: "", name: "", ip_addr: "", port: "" };
        if (ret) {
            for (var i = 0; i < ret.length; i++) {
                if (ret[i].indexOf(index + '_enable=') == 0) {
                    result.enable = ret[i].substring((index + '_enable=').length) == "1" ? "enable" : "disable";
                    continue;
                }
                if (ret[i].indexOf(index + '_name=') == 0) {
                    result.name = ret[i].substring((index + '_name=').length);
                    continue;
                }
                if (ret[i].indexOf(index + '_ip_addr=') == 0) {
                    result.ip_addr = ret[i].substring((index + '_ip_addr=').length);
                    continue;
                }
                if (ret[i].indexOf(index + '_port=') == 0) {
                    result.port = ret[i].substring((index + '_port=').length);
                    continue;
                }
            }
            return result;
        }
    }
    function getMoipVideoRx() {
        var url = "/cgi-bin/get_moip_video_rx";
        var ret = cparam_sendRequest(url);
        var result = {};
        if (ret) {
            ret = cparam_getRetArray(ret);
        }
        return ret;
    }
    function getMoipVideoRxResult(ret, index) {
        var result = { enable: "", name: "", ip_addr: "", source_addr: "", port: "" };
        if (ret) {
            for (var i = 0; i < ret.length; i++) {
                if (ret[i].indexOf(index+'_enable=') == 0) {
                    result.enable = ret[i].substring((index+'_enable=').length) == "1" ? "enable" : "disable";
                    continue;
                }
                if (ret[i].indexOf(index + '_name=') == 0) {
                    result.name = ret[i].substring((index + '_name=').length);
                    continue;
                }
                if (ret[i].indexOf(index + '_multicast_addr=') == 0) {
                    result.ip_addr = ret[i].substring((index + '_multicast_addr=').length);
                    continue;
                }
                if (ret[i].indexOf(index + '_source_addr=') == 0) {
                    result.source_addr = ret[i].substring((index + '_source_addr=').length);
                    continue;
                }
                if (ret[i].indexOf(index + '_port=') == 0) {
                    result.port = ret[i].substring((index + '_port=').length);
                    continue;
                }
            }
            return result;
        }
    }
    function getMoipResult(ret, index) {
        var result = { enable: "", name: "", ip_addr: "", source_addr: "", port: "", multicast_addr: "" };
        if (ret) {
            for (var i = 0; i < ret.length; i++) {
                if (ret[i].indexOf(index + '_enable=') == 0) {
                    result.enable = ret[i].substring((index + '_enable=').length) == "1" ? "enable" : "disable";
                    continue;
                }
                if (ret[i].indexOf(index + '_name=') == 0) {
                    result.name = ret[i].substring((index + '_name=').length);
                    continue;
                }
                if (ret[i].indexOf(index + '_ip_addr=') == 0) {
                    result.ip_addr = ret[i].substring((index + '_ip_addr=').length);
                    continue;
                }
                if (ret[i].indexOf(index + '_port=') == 0) {
                    result.port = ret[i].substring((index + '_port=').length);
                    continue;
                }
                if (ret[i].indexOf(index + '_multicast_addr=') == 0) {
                    result.multicast_addr = ret[i].substring((index + '_multicast_addr=').length);
                    continue;
                }
                if (ret[i].indexOf(index + '_source_addr=') == 0) {
                    result.source_addr = ret[i].substring((index + '_source_addr=').length);
                    continue;
                }
            }
        }
        return result;
    }
    function getMoipFormatResult(ret, index) {
        var result = {format: ""};
        if (ret) {
            for (var i = 0; i < ret.length; i++) {
                if (ret[i].indexOf(index + '_format=') == 0) {
                    result.format = ret[i].substring((index + '_format=').length);
                    continue;
                }
            }
        }
        return result;
    }
    function getMoipAudioFormatResult(ret, index) {
        var result = {format: ""};
        if (ret) {
            for (var i = 0; i < ret.length; i++) {
                if (ret[i].indexOf(index + '_format=') == 0) {
                    result.format = ret[i].substring((index + '_format=').length);
                    continue;
                }
            }
        }
        return result;
    }
    function getMoipRxStateResult(ret, index) {
        var result = { detect: "", sampling_rate: "", format: "", frame_rate: "" ,state: ""};
        if (ret) {
            for (var i = 0; i < ret.length; i++) {
                if (ret[i].indexOf(index + '_detect=') == 0) {
                    result.detect = ret[i].substring((index + '_detect=').length);
                    continue;
                }
                if (ret[i].indexOf(index + '_sampling_rate=') == 0) {
                    result.sampling_rate = ret[i].substring((index + '_sampling_rate=').length);
                    continue;
                }
                if (ret[i].indexOf(index + '_format=') == 0) {
                    result.format = ret[i].substring((index + '_format=').length);
                    continue;
                }
                if (ret[i].indexOf(index + '_frame_rate=') == 0) {
                    result.frame_rate = ret[i].substring((index + '_frame_rate=').length);
                    if(result.frame_rate.indexOf('------')==-1){
                        result.frame_rate = result.frame_rate + "frames/s";
                    }
                    
                    continue;
                }
                if (ret[i].indexOf(index + '_state') == 0) {
                    result.state = ret[i].substring((index + '_state=').length);
                    continue;
                }
            }
        }
        return result;
    }

    function getjpegXsTxResult(ret, index){

    }

    function getJpegXsRxState() {
        var url = "/cgi-bin/get_jpeg-xs_rx_state";
        var ret = cparam_sendRequest(url);
        var result = {};
        if (ret) {
            ret = cparam_getRetArray(ret);
        }
        return ret;
    }

    function getJpegXsRxStateResult() {
        var ret = getJpegXsRxState();
        var result = { name: "", detect: "", sampling_rate: "", width: "", height: "", format: "", frame_rate: "", state: "" };
        if (ret) {
            for (var i = 0; i < ret.length; i++) {
                if (ret[i].indexOf('video_rx_ch0_name=') == 0) {
                    result.name = ret[i].substring('video_rx_ch0_name='.length);
                    continue;
                }
                if (ret[i].indexOf('video_rx_ch0_detect=') == 0) {
                    result.detect = ret[i].substring('video_rx_ch0_detect='.length);
                    continue;
                }
                if (ret[i].indexOf('video_rx_ch0_sampling_rate=') == 0) {
                    result.sampling_rate = ret[i].substring('video_rx_ch0_sampling_rate='.length);
                    continue;
                }
                if (ret[i].indexOf('video_rx_ch0_width=') == 0) {
                    result.width = ret[i].substring('video_rx_ch0_width='.length);
                    continue;
                }
                if (ret[i].indexOf('video_rx_ch0_height=') == 0) {
                    result.height = ret[i].substring('video_rx_ch0_height='.length);
                    continue;
                }
                if (ret[i].indexOf('video_rx_ch0_format=') == 0) {
                    result.format = ret[i].substring('video_rx_ch0_format='.length);
                    continue;
                }
                if (ret[i].indexOf('video_rx_ch0_frame_rate=') == 0) {
                    result.frame_rate = ret[i].substring('video_rx_ch0_frame_rate='.length);
                    if(result.frame_rate.indexOf('------')==-1){
                        result.frame_rate = result.frame_rate + "frames/s";
                    }
                    continue;
                }
                if (ret[i].indexOf('video_rx_ch0_state=') == 0) {
                    result.state = ret[i].substring('video_rx_ch0_state='.length);
                    continue;
                }
            }
        }
        return result;
    }

    function getPtpResult(ret) {
        var result = { status: "", domain: "", ip_addr: "", grandmaster_id: "" };
        if (ret) {
            for (var i = 0; i < ret.length; i++) {
                if (ret[i].indexOf('status=') == 0) {
                    result.status = ret[i].substring('status='.length);
                    continue;
                }
                if (ret[i].indexOf('domain=') == 0) {
                    result.domain = ret[i].substring('domain='.length);
                    continue;
                }
                if (ret[i].indexOf('ip_addr=') == 0) {
                    result.ip_addr = ret[i].substring('ip_addr='.length);
                    continue;
                }
                if (ret[i].indexOf('grandmaster_id=') == 0) {
                    result.grandmaster_id = ret[i].substring('grandmaster_id='.length);
                    continue;
                }
            }
        }
        return result;
    }
    function getNmosMasterEnableResult(ret) {
        var result = { main_enable: "", crop_enable: "", monitor_enable: "", mic1_enable: "", mic2_enable: "", return_enable: ""};
        if (ret) {
            for (var i = 0; i < ret.length; i++) {
                if (ret[i].indexOf('video_tx_ch0_master_enable=') == 0) {
                    result.main_enable = ret[i].substring('video_tx_ch0_master_enable='.length) == "2" ? "Disable" : (ret[i].substring('video_tx_ch0_master_enable='.length) == "1" ? "On" : "Off");
                    continue;
                }
                if (ret[i].indexOf('video_tx_ch1_master_enable=') == 0) {
                    result.crop_enable = ret[i].substring('video_tx_ch1_master_enable='.length) == "2" ? "Disable" : (ret[i].substring('video_tx_ch1_master_enable='.length) == "1" ? "On" : "Off");
                    continue;
                }
                if (ret[i].indexOf('video_tx_ch2_master_enable=') == 0) {
                    result.monitor_enable = ret[i].substring('video_tx_ch2_master_enable='.length) == "2" ? "Disable" : (ret[i].substring('video_tx_ch2_master_enable='.length) == "1" ? "On" : "Off");
                    continue;
                }
                if (ret[i].indexOf('audio_tx_ch0_master_enable=') == 0) {
                    result.mic1_enable = ret[i].substring('audio_tx_ch0_master_enable='.length) == "2" ? "Disable" : (ret[i].substring('audio_tx_ch0_master_enable='.length) == "1" ? "On" : "Off");
                    continue;
                }
                if (ret[i].indexOf('audio_tx_ch1_master_enable=') == 0) {
                    result.mic2_enable = ret[i].substring('audio_tx_ch1_master_enable='.length) == "2" ? "Disable" : (ret[i].substring('audio_tx_ch1_master_enable='.length) == "1" ? "On" : "Off");
                    continue;
                }
                if (ret[i].indexOf('video_rx_ch0_master_enable=') == 0) {
                    result.return_enable = ret[i].substring('video_rx_ch0_master_enable='.length) == "2" ? "Disable" : (ret[i].substring('video_rx_ch0_master_enable='.length) == "1" ? "On" : "Off");
                    continue;
                }
            }
        }
        return result;
    }

    function getJpegXsTxInfoResult(ret){
        var result ={ enable: "",　video_select:"",  destination_address: "", destination_port: "", format: "", compression_rate: ""}
        if (ret) {
            result.enable = ret.enable;
            result.video_select = ret.video_select;
            result.destination_address = ret.dest_addr;
            result.destination_port = ret.dest_port;
            result.format = ret.format;
            result.compression_rate = ret.comp_rate;
        }
        return result;
    }

    function getJpegXsRxInfoResult(ret){
        var result ={ enable: "",　destination_address: "", destination_port: "", format: "", compression_rate: "", source_address: ""}
        if (ret) {
            result.enable = ret.enable;
            result.destination_address = ret.dest_addr;
            result.destination_port = ret.dest_port;
            result.format = ret.format;
            result.compression_rate = ret.comp_rate;
            result.source_address = ret.sor_addr;
        }
        return result;
    }

    function getNmosInfoResult(ret) {
        var result = { control: "", status: "", port_is_04: "", port_is_05: "", rds_ip_addr: "", rds_port: "", label_setting: "", label_prefix_manual: "",label_prefix_auto: "", discovery: "" };
        if (ret) {
            for (var i = 0; i < ret.length; i++) {
                if (ret[i].indexOf('control=') == 0) {
                    result.control = ret[i].substring('control='.length);
                    continue;
                }
                if (ret[i].indexOf('status=') == 0) {
                    result.status = ret[i].substring('status='.length);
                    continue;
                }
                if (ret[i].indexOf('port_is_04=') == 0) {
                    result.port_is_04 = ret[i].substring('port_is_04='.length);
                    continue;
                }
                if (ret[i].indexOf('port_is_05=') == 0) {
                    result.port_is_05 = ret[i].substring('port_is_05='.length);
                    continue;
                }
                if (ret[i].indexOf('rds_ip_addr=') == 0) {
                    result.rds_ip_addr = ret[i].substring('rds_ip_addr='.length);
                    continue;
                }
                if (ret[i].indexOf('rds_port=') == 0) {
                    result.rds_port = ret[i].substring('rds_port='.length);
                    continue;
                }
                if (ret[i].indexOf('label_setting=') == 0) {
                    result.label_setting = ret[i].substring('label_setting='.length);
                    continue;
                }
                if (ret[i].indexOf('label_prefix_auto=') == 0) {
                    result.label_prefix_auto = ret[i].substring('label_prefix_auto='.length);
                    continue;
                }
                if (ret[i].indexOf('label_prefix_manual=') == 0) {
                    result.label_prefix_manual = ret[i].substring('label_prefix_manual='.length);
                    continue;
                }
                if (ret[i].indexOf('discovery=') == 0) {
                    result.discovery = ret[i].substring('discovery='.length);
                    continue;
                }
            }
        }
        return result;
    }

    /**
     * SettingStatusボタン押下時の画面表示切替処理
     * @param mouse
     * @param type
     */
    function callbackChangeMediaOverIPMenu(mouse, type) {
        if (mouse == Button.MOUSE_DOWN) {
            $("#setup_mediaOverIp_settingStatus_main").hide();
            $("#setup_mediaOverIp_st2110_main").hide();
            $("#setup_mediaOverIp_st2110_tx_main").hide();
            $("#setup_mediaOverIp_st2110_rx_main").hide();
            $("#setup_mediaOverIp_jpeg_xs_tx_main").hide();
            $("#setup_mediaOverIp_jpeg_xs_rx_main").hide();
            $("#setup_mediaOverIp_ptp_main").hide();
            $("#setup_mediaOverIp_nmos_main").hide();
            switch (type) {
                case 1:
                    $("#setup_mediaOverIp_settingStatus_main").show();
                    txtMediaOverIPMainTitle.set(NPTZ_WORDING.wID_0077);
                    settingStatus.build();
                    break;
                case 2:
                    $("#setup_mediaOverIp_st2110_main").show();
                    txtMediaOverIPMainTitle.set(NPTZ_WORDING.wID_0683);
                    //#6989 【Setup】【Media over IP】各ページに遷移時に取得コマンドが送信されていない
                    objSt2110Info = getSt2110Info();
                    st2110Status = getSt2110InfoResult(objSt2110Info);
                    st2110EnableState = st2110Status["enable"] == "1" ? true : false;
                    buildSubmenu();
                    btnObject[BTN_ST2110_INDEX].displayOn();
                    settingSt2110.build();                   
                    break;
                case 3:
                    $("#setup_mediaOverIp_st2110_tx_main").show();
                    txtMediaOverIPMainTitle.set(NPTZ_WORDING.wID_0684);
                    settingSt2110Tx.build();
                    break;
                case 4:
                    txtMediaOverIPMainTitle.set(NPTZ_WORDING.wID_0685);
                    settingSt2110Rx.build();
                    $("#setup_mediaOverIp_st2110_rx_main").show();
                    break;
                case 5:
                    txtMediaOverIPMainTitle.set(NPTZ_WORDING.wID_0686);
                    settingPtp.build();
                    $("#setup_mediaOverIp_ptp_main").show();
                    break;
                case 6:
                    txtMediaOverIPMainTitle.set(NPTZ_WORDING.wID_0687);
                    settingNmos.build();
                    $("#setup_mediaOverIp_nmos_main").show();
                    break;
                case 7:
                    txtMediaOverIPMainTitle.set(NPTZ_WORDING.wID_0916);
                    settingJpegxsTx.build();
                    $("#setup_mediaOverIp_jpeg_xs_tx_main").show();
                    break;
                case 8:
                    txtMediaOverIPMainTitle.set(NPTZ_WORDING.wID_0917);
                    settingJpegxsRx.build();
                    $("#setup_mediaOverIp_jpeg_xs_rx_main").show();
                    break;
            }
            if (type == 1) {
                mediaOverIPInstance.clearIntervalSettingNmos();
                mediaOverIPInstance.setIntervalSettingStatus();
            } else {
                mediaOverIPInstance.clearIntervalSettingStatus();
                if (type == 6) {
                    mediaOverIPInstance.setIntervalSettingNmos();
                } else {
                    mediaOverIPInstance.clearIntervalSettingNmos();
                }
            }
        }
    }

    /**
     * settingStatus画面:settingStatus制御に関わる画面クラス
     * @class settingStatus画面:settingStatus制御に関わる画面クラス
     * @return {{build: buildStatus, rebuild: rebuild}} build 構築処理
     * @return {function} rebuild 再構築処理
     * @constructor
     */
    function settingStatus() {
        /**
         * 構築フラグ
         * @type boolean
         */
        let buildFlag_Status = false;
        let txtStatusObject = [];
        let mainVideoTx;
        let cropVideoTx;
        let monitorVideoTx;
        let mic1AudioTx;
        let mic2AudioTx;
        let returnVideoRx;
        let ptpStatus;
        let nmosStatus;
        let nmosMasterEnable;
        let txValueRXSetInterval = false;
        let txValuePTPSetInterval = false;
        let txValueNMOSSetInterval = false;
        var intervalMOIPRXSTATEPtpInfo;
        var intervalNmosInfo;
        var intervalDetectionSamplingRateWidthHeightValue;
        var intervalStatusDomainPtpGrandmasterIdValue;
        var intervalStatusIS04PortIS05PortRDSIPAddressRDSPortValue;

        let ST2110_TITLE = 0;
        let ST2110_VALUE = 1;
        let ST2110_PORT_TITLE = 2;
        let ST2110_PORT_VALUE = 3;
        let JPEG_XS_TITLE = 4;
        let JPEG_XS_VALUE = 5;
        var st2110Status;

        function buildStatus() {
            if (!buildFlag_Status) {
                buildFlag_Status = true;
                objMOIP = getMoip();
                objMOIPFORMAT = getMoipFormat();
                objMOIPAUDIOFORMATTX = getMoipAudioFormatTx();
                objNmosMasterEnable = getNmosMasterEnable();
                st2110Status = getSt2110InfoResult(objSt2110Info);
                //title
                txtStatusObject[ST2110_TITLE] = TextCtrl("setup_mediaOverIp_settingStatus_form", 'setup_mediaOverIp_settingStatus_st2110_title', NPTZ_WORDING.wID_0683);
                txtStatusObject[ST2110_VALUE] = TextCtrl("setup_mediaOverIp_settingStatus_form", 'setup_mediaOverIp_settingStatus_st2110_value', st2110Status["enable"] == "1" ? "Enable" : "Disable");
                txtStatusObject[ST2110_PORT_TITLE] = TextCtrl("setup_mediaOverIp_settingStatus_form", 'setup_mediaOverIp_settingStatus_st2110_port_title', NPTZ_WORDING.wID_0468);
                txtStatusObject[ST2110_PORT_VALUE] = TextCtrl("setup_mediaOverIp_settingStatus_form", 'setup_mediaOverIp_settingStatus_st2110_port_value', st2110Status["port"]);
                txtStatusObject[JPEG_XS_TITLE] = TextCtrl("setup_mediaOverIp_settingStatus_form", 'setup_mediaOverIp_settingStatus_jpeg_xs_title', NPTZ_WORDING.wID_0920);
                txtStatusObject[JPEG_XS_VALUE] = TextCtrl("setup_mediaOverIp_settingStatus_form", 'setup_mediaOverIp_settingStatus_jpeg_xs_value', SFPMode == 2 ? "On" : "Off");
                for (let text in txtStatusObject) {
                    txtStatusObject[text].show();
                }
                if(st2110EnableState == false || SFPMode != 2){
                    txtStatusObject[JPEG_XS_TITLE].hide()
                    txtStatusObject[JPEG_XS_VALUE].hide()
                }else if(st2110EnableState && SFPMode == 2){
                    txtStatusObject[JPEG_XS_TITLE].show()
                    txtStatusObject[JPEG_XS_VALUE].show()
                }
                buildOptionStatus();
                // updateStatus();
            } else {
                rebuild();
                // updateStatus();
            }

        }

        function rebuild() {
            objMOIP = getMoip();
            objMOIPFORMAT = getMoipFormat();
            objMOIPAUDIOFORMATTX = getMoipAudioFormatTx();
            objMOIPRXSTATE = getMoipRxState();
            objPtp = getPtpInfo();
            objNmosInfo = getNmosInfo();
            objNmosMasterEnable = getNmosMasterEnable();
            objSt2110Info = getSt2110Info();
            st2110Status = getSt2110InfoResult(objSt2110Info);

            txtStatusObject[ST2110_VALUE].set(st2110Status["enable"] == "1" ? "Enable" : "Disable");
            txtStatusObject[ST2110_PORT_VALUE].set(st2110Status["port"]);

            if(st2110EnableState == false){
                txtStatusObject[JPEG_XS_TITLE].hide()
                txtStatusObject[JPEG_XS_VALUE].hide()
            }else if(st2110EnableState && SFPMode == 2){
                txtStatusObject[JPEG_XS_TITLE].show()
                txtStatusObject[JPEG_XS_VALUE].show()
            }
            buildOptionStatus();
        }

        function buildOptionStatus() {
            $("#setup_mediaOverIp_settingStatus_main_video_tx").hide();
            $("#setup_mediaOverIp_settingStatus_crop_video_tx").hide();
            $("#setup_mediaOverIp_settingStatus_monitor_video_tx").hide();
            $("#setup_mediaOverIp_settingStatus_mic1_audio_tx").hide();
            $("#setup_mediaOverIp_settingStatus_mic2_audio_tx").hide();
            $("#setup_mediaOverIp_settingStatus_return_video_rx").hide();
            $("#setup_mediaOverIp_settingStatus_ptp").hide();
            $("#setup_mediaOverIp_settingStatus_jpeg_on_nmos").hide();
            $("#setup_mediaOverIp_settingStatus_jpeg_on_ptp").hide();
            $("#setup_mediaOverIp_settingStatus_nmos").hide();
            $("#setup_mediaOverIp_settingStatus_off_ptp").hide();
            $("#setup_mediaOverIp_settingStatus_off_nmos").hide();
            $("#setup_mediaOverIp_settingStatus_nmos_master_enable").hide();
            $("#setup_mediaOverIp_settingStatus_jpeg_on_nmos_master_enable").hide();
            $("#setup_mediaOverIp_settingStatus_jpeg_xs_tx").hide();
            $("#setup_mediaOverIp_settingStatus_jpeg_xs_rx").hide();
            $("#setup_mediaOverIp_settingStatus_jepg_mic1_audio_tx").hide();
            $("#setup_mediaOverIp_settingStatus_jepg_mic2_audio_tx").hide();
            if (st2110EnableState) {
                if(SFPMode == 2){
                    $("#setup_mediaOverIp_settingStatus_jpeg_xs_tx").show();
                    // $("#setup_mediaOverIp_settingStatus_jepg_mic1_audio_tx").show();
                    // $("#setup_mediaOverIp_settingStatus_jepg_mic2_audio_tx").show();
                    $("#setup_mediaOverIp_settingStatus_jpeg_xs_rx").show();
                    $("#setup_mediaOverIp_settingStatus_jpeg_on_ptp").show();
                    $("#setup_mediaOverIp_settingStatus_jpeg_on_nmos").show();
                    $("#setup_mediaOverIp_settingStatus_jpeg_on_nmos_master_enable").show();

                    jpegXsVideoTx = JpegXsTxStatusDisplayCtrl("setup_mediaOverIp_settingStatus_jpeg_xs_tx", NPTZ_WORDING.wID_0921);
                    // mic1AudioTx = CommonTxStatusDisplayCtrl("setup_mediaOverIp_settingStatus_jepg_mic1_audio_tx", NPTZ_WORDING.wID_0694);
                    // mic2AudioTx = CommonTxStatusDisplayCtrl("setup_mediaOverIp_settingStatus_jepg_mic2_audio_tx", NPTZ_WORDING.wID_0695);
                    jpegXsVideoRx = JpegXsRxStatusDisplayCtrl("setup_mediaOverIp_settingStatus_jpeg_xs_rx", NPTZ_WORDING.wID_0922);
                    ptpStatus = PtpStatusDisplayCtrl("setup_mediaOverIp_settingStatus_jpeg_on_ptp", NPTZ_WORDING.wID_0686);
                    nmosStatus = NmosStatusDisplayCtrl("setup_mediaOverIp_settingStatus_jpeg_on_nmos", NPTZ_WORDING.wID_0687);
                    nmosMasterEnable = NmosMasterEnableStatusDisplayCtrl("setup_mediaOverIp_settingStatus_jpeg_on_nmos_master_enable", NPTZ_WORDING.wID_0697);
                } else {
                    $("#setup_mediaOverIp_settingStatus_main_video_tx").show();
                    $("#setup_mediaOverIp_settingStatus_crop_video_tx").show();
                    $("#setup_mediaOverIp_settingStatus_monitor_video_tx").show();
                    $("#setup_mediaOverIp_settingStatus_mic1_audio_tx").show();
                    $("#setup_mediaOverIp_settingStatus_mic2_audio_tx").show();
                    $("#setup_mediaOverIp_settingStatus_return_video_rx").show();
                    $("#setup_mediaOverIp_settingStatus_ptp").show();
                    $("#setup_mediaOverIp_settingStatus_nmos").show();
                    $("#setup_mediaOverIp_settingStatus_nmos_master_enable").show();
                    mainVideoTx = CommonTxStatusDisplayCtrl("setup_mediaOverIp_settingStatus_main_video_tx", NPTZ_WORDING.wID_0689);
                    cropVideoTx = CommonTxStatusDisplayCtrl("setup_mediaOverIp_settingStatus_crop_video_tx", NPTZ_WORDING.wID_0692);
                    monitorVideoTx = CommonTxStatusDisplayCtrl("setup_mediaOverIp_settingStatus_monitor_video_tx", NPTZ_WORDING.wID_0693);
                    mic1AudioTx = CommonTxStatusDisplayCtrl("setup_mediaOverIp_settingStatus_mic1_audio_tx", NPTZ_WORDING.wID_0694);
                    mic2AudioTx = CommonTxStatusDisplayCtrl("setup_mediaOverIp_settingStatus_mic2_audio_tx", NPTZ_WORDING.wID_0695);
                    nmosMasterEnable = NmosMasterEnableStatusDisplayCtrl("setup_mediaOverIp_settingStatus_nmos_master_enable", NPTZ_WORDING.wID_0697);
                    returnVideoRx = ReturnVideoRxStatusDisplayCtrl("setup_mediaOverIp_settingStatus_return_video_rx", NPTZ_WORDING.wID_0696);
                    ptpStatus = PtpStatusDisplayCtrl("setup_mediaOverIp_settingStatus_ptp", NPTZ_WORDING.wID_0686);
                    nmosStatus = NmosStatusDisplayCtrl("setup_mediaOverIp_settingStatus_nmos", NPTZ_WORDING.wID_0687);
                }
            } else {
                $("#setup_mediaOverIp_settingStatus_off_ptp").show();
                $("#setup_mediaOverIp_settingStatus_off_nmos").show();
                ptpStatus = PtpStatusDisplayCtrl("setup_mediaOverIp_settingStatus_off_ptp", NPTZ_WORDING.wID_0686);
                nmosStatus = NmosStatusDisplayCtrl("setup_mediaOverIp_settingStatus_off_nmos", NPTZ_WORDING.wID_0687);
            }
        }

        function CommonTxStatusDisplayCtrl(div, name) {
            let txName;
            let txNameValue;
            let txDestinationAddress;
            let txDestinationPort;
            let txFormat;
            let txDestinationAddressValue;
            let txDestinationPortValue;
            let txFormatValue;
            var values;

            function initDisplay() {
                values = getSettingValues(name);
                formatValues = getSettingFormatValues(name)
                $('#' + div).empty();
                txName = TextCtrl(div, "setup_mediaOverIp_settingStatus_tx_name", name);
                txDestinationAddress = TextCtrl(div, "setup_mediaOverIp_settingStatus_tx_destination_address", NPTZ_WORDING.wID_0690);
                txDestinationPort = TextCtrl(div, "setup_mediaOverIp_settingStatus_tx_destination_port", NPTZ_WORDING.wID_0691);
                txFormat = TextCtrl(div, "setup_mediaOverIp_settingStatus_tx_format", NPTZ_WORDING.wID_0196);
                //value
                txNameValue = TextCtrl(div, "setup_mediaOverIp_settingStatus_tx_name_value", values["enable"] == "enable" ? "Enable" : "Disable");
                txDestinationAddressValue = TextCtrl(div, "setup_mediaOverIp_settingStatus_tx_destination_address_value", values["ip_addr"]);
                txDestinationPortValue = TextCtrl(div, "setup_mediaOverIp_settingStatus_tx_destination_port_value", values["port"]);
                txFormatValue = TextCtrl(div, "setup_mediaOverIp_settingStatus_tx_format_value", formatValues["format"]);

                txName.show();
                txDestinationAddress.show();
                txDestinationPort.show();
                txFormat.show();
                txNameValue.show();
                txDestinationAddressValue.show();
                txDestinationPortValue.show();
                txFormatValue.show();
            }

            initDisplay();

            function getSettingValues(name) {
                switch (name) {
                    case NPTZ_WORDING.wID_0689:
                        return getMoipResult(objMOIP, 'video_tx_ch0');
                        break;
                    case NPTZ_WORDING.wID_0692:
                        return getMoipResult(objMOIP, 'video_tx_ch1');
                        break;
                    case NPTZ_WORDING.wID_0693:
                        return getMoipResult(objMOIP, 'video_tx_ch2');
                        break;
                    case NPTZ_WORDING.wID_0694:
                        return getMoipResult(objMOIP, 'audio_tx_ch0');
                        break;
                    case NPTZ_WORDING.wID_0695:
                        return getMoipResult(objMOIP, 'audio_tx_ch1');
                        break;
                    default:
                        return {};
                        break;
                }
            }
            function getSettingFormatValues(name) {
                switch (name) {
                    case NPTZ_WORDING.wID_0689:
                        return getMoipFormatResult(objMOIPFORMAT, 'video_tx_ch0');
                        break;
                    case NPTZ_WORDING.wID_0692:
                        return getMoipFormatResult(objMOIPFORMAT, 'video_tx_ch1');
                        break;
                    case NPTZ_WORDING.wID_0693:
                        return getMoipFormatResult(objMOIPFORMAT, 'video_tx_ch2');
                        break;
                    case NPTZ_WORDING.wID_0694:
                        return getMoipAudioFormatResult(objMOIPAUDIOFORMATTX, 'ch0');
                        break;
                    case NPTZ_WORDING.wID_0695:
                        return getMoipAudioFormatResult(objMOIPAUDIOFORMATTX, 'ch1');
                        break;
                    default:
                        return {};
                        break;
                }
            }
            return {
                show: function () {
                    $('#' + div).show()
                },
                hide: function () {
                    $('#' + div).hide();
                },
                updateValues: function () {
                    values = getSettingValues(name);
                    formatValues = getSettingFormatValues(name)
                    txNameValue.set(values["enable"]);
                    txDestinationAddressValue.set(values["ip_addr"]);
                    txDestinationPortValue.set(values["port"]);
                    txFormatValue.set(formatValues["format"]);
                }
            };
        }
        function ReturnVideoRxStatusDisplayCtrl(div, name) {
            let txName;
            let txNameValue;
            let txDestinationAddress;
            let txDestinationPort;
            let txDetection;
            let txSamplingRate;
            let txWidth;
            let txHeight;
            let txDestinationAddressValue;
            let txSourceAddressValue;
            let txDestinationPortValue;
            let txSamplingRateValue;
            let txDetectionValue;
            let txWidthValue;
            let txHeightValue;
            let txSourceAddress;
            let values;
            let txStateValues;

            function initDisplay() {
                values = getSettingValues(name);
                txStateValues = getSettingRxStateValues();
                $('#' + div).empty();
                txName = TextCtrl(div, "setup_mediaOverIp_settingStatus_tx_name", name);
                // txNameValue = TextCtrl(div, "setup_mediaOverIp_settingStatus_tx_name", values["enable"]);
                txDestinationAddress = TextCtrl(div, "setup_mediaOverIp_settingStatus_tx_destination_address", NPTZ_WORDING.wID_0690);
                txDestinationPort = TextCtrl(div, "setup_mediaOverIp_settingStatus_tx_return_destination_port", NPTZ_WORDING.wID_0691);
                txSourceAddress = TextCtrl(div, "setup_mediaOverIp_settingStatus_tx_source_address", NPTZ_WORDING.wID_0700);
                txDetection = TextCtrl(div, "setup_mediaOverIp_settingStatus_return_tx_detection", NPTZ_WORDING.wID_0705);
                txSamplingRate = TextCtrl(div, "setup_mediaOverIp_settingStatus_return_tx_sampling_rate", NPTZ_WORDING.wID_0491);
                txWidth = TextCtrl(div, "setup_mediaOverIp_settingStatus_return_tx_width", NPTZ_WORDING.wID_0196);
                txHeight = TextCtrl(div, "setup_mediaOverIp_settingStatus_return_tx_height", NPTZ_WORDING.wID_0912);
                //value
                txNameValue = TextCtrl(div, "setup_mediaOverIp_settingStatus_tx_name_value", values["enable"] == "enable" ? "Enable" : "Disable");
                txDestinationAddressValue = TextCtrl(div, "setup_mediaOverIp_settingStatus_tx_destination_address_value", values["multicast_addr"]);
                txSourceAddressValue = TextCtrl(div, "setup_mediaOverIp_settingStatus_tx_source_address_value", values["source_addr"]);
                txDestinationPortValue = TextCtrl(div, "setup_mediaOverIp_settingStatus_tx_return_destination_port_value", values["port"]);
                txDetectionValue = TextCtrl(div, "setup_mediaOverIp_settingStatus_tx_return_detection_value", txStateValues["state"]);
                txSamplingRateValue = TextCtrl(div, "setup_mediaOverIp_settingStatus_tx_sampling_rate_value", txStateValues["sampling_rate"]);
                txWidthValue = TextCtrl(div, "setup_mediaOverIp_settingStatus_tx_width_value", txStateValues["format"]);
                txHeightValue = TextCtrl(div, "setup_mediaOverIp_settingStatus_tx_height_value", txStateValues["frame_rate"]);

                txName.show();
                txDestinationAddress.show();
                txDestinationPort.show();
                txDetection.show();
                txSamplingRate.show();
                txWidth.show();
                txHeight.show();
                txSourceAddress.show();
                txNameValue.show();
                txDestinationAddressValue.show();
                txSourceAddressValue.show();
                txDestinationPortValue.show();
                txDetectionValue.show();
                txSamplingRateValue.show();
                txWidthValue.show();
                txHeightValue.show();
            }

            initDisplay();
            function getSettingValues(name) {
                return getMoipResult(objMOIP, 'video_rx_ch0');
            }
            function getSettingRxStateValues(name) {
                return getMoipRxStateResult(objMOIPRXSTATE, 'video_rx_ch0');
            }
            return {
                show: function () {
                    $('#' + div).show()
                },
                hide: function () {
                    $('#' + div).hide();
                },
                updateValues: function () {
                    values = getSettingValues(name);
                    txStateValues = getSettingRxStateValues();
                    txNameValue.set(values["enable"]);
                    txDestinationAddressValue.set(values["multicast_addr"]);
                    txSourceAddressValue.set(values["source_addr"]);
                    txDestinationPortValue.set(values["port"]);
                    txDetectionValue.set(values["detect"]);
                    txSamplingRateValue.set(values["sampling_rate"]);
                    txWidthValue.set(values["format"]);
                    txHeightValue.set(values["frame_rate"]);
                },
                setIntervalReturnVideoRxStatusDisplayCtrl: function () {
                    intervalDetectionSamplingRateWidthHeightValue = setInterval(function () {
                        txStateValues = getSettingRxStateValues();
                        txDetectionValue.set(txStateValues["state"]);
                        txSamplingRateValue.set(txStateValues["sampling_rate"]);
                        txWidthValue.set(txStateValues["format"]);
                        txHeightValue.set(txStateValues["frame_rate"]);
                    }, 1000);
                },
                clearIntervalReturnVideoRxStatusDisplayCtrl: function () {
                    clearInterval(intervalDetectionSamplingRateWidthHeightValue);
                }
            };
        }

        function JpegXsTxStatusDisplayCtrl(div, name) {
            let txName;
            let txNameValue;
            let txDestinationAddress
            let txDestinationPort;
            let txFormat;
            let txCompressionRate;
            let txDestinationAddressValue;
            let txDestinationPortValue;
            let txFormatValue;
            let txCompressionRateValue
            let txVideoSelect;
            let txVidoeSelectValue;
            let objJpegXsRxInfo;

            let values;
            function initDisplay() {
                values = getSettingValues();
                $('#' + div).empty();
                txName = TextCtrl(div, "setup_mediaOverIp_settingJpeg_xs_tx_name", name);
                txVideoSelect = TextCtrl(div, "setup_mediaOverIp_settingJpeg_xs_tx_video_select", NPTZ_WORDING.wID_0918);
                txDestinationAddress = TextCtrl(div, "setup_mediaOverIp_settingJpeg_xs_tx_destination_address", NPTZ_WORDING.wID_0690);
                txDestinationPort = TextCtrl(div, "setup_mediaOverIp_settingJpeg_xs_tx_destination_port", NPTZ_WORDING.wID_0691);
                txFormat = TextCtrl(div, "setup_mediaOverIp_settingJpeg_xs_tx_format", NPTZ_WORDING.wID_0196);
                txCompressionRate = TextCtrl(div, "setup_mediaOverIp_settingJpeg_xs_tx_compression_rate", NPTZ_WORDING.wID_0919);
                //value
                txNameValue = TextCtrl(div, "setup_mediaOverIp_settingJpeg_xs_tx_name_value", values["enable"] == "1" ? "Enable" : "Disable");
                txVidoeSelectValue = TextCtrl(div, "setup_mediaOverIp_settingJpeg_xs_tx_video_select_value", values["video_select"]);
                txDestinationAddressValue = TextCtrl(div, "setup_mediaOverIp_settingJpeg_xs_tx_destination_address_value", values["destination_address"]);
                txDestinationPortValue = TextCtrl(div, "setup_mediaOverIp_settingJpeg_xs_tx_destination_port_value", values["destination_port"]);
                txFormatValue = TextCtrl(div, "setup_mediaOverIp_settingJpeg_xs_tx_format_value", values["format"]);
                txCompressionRateValue = TextCtrl(div, "setup_mediaOverIp_settingJpeg_xs_tx_compression_rate_value", values["compression_rate"]);

                txName.show();
                txVideoSelect.show();
                txDestinationAddress.show();
                txDestinationPort.show();
                txFormat.show();
                txCompressionRate.show();
                txNameValue.show();
                txVidoeSelectValue.show();
                if (st2110EnableState) {
                    txDestinationAddressValue.show();
                    txDestinationPortValue.show();
                    txFormatValue.show();
                    txCompressionRateValue.show();
                } else {
                    if (values["enable"] == "1") {
                        txDestinationAddressValue.show();
                        txDestinationPortValue.show();
                        txFormatValue.show();
                        txCompressionRateValue.show();
                    } else {
                        txDestinationAddressValue.hide();
                        txDestinationPortValue.hide();
                        txFormatValue.hide();
                        txCompressionRateValue.hide();
                    }
                }
            }

            initDisplay();
            function getSettingValues() {
                objJpegXsTxInfo = settingJpegxsTx.getJPEGXSTXInfo();
                return getJpegXsTxInfoResult(objJpegXsTxInfo);
            }
            return {
                show: function () {
                    $('#' + div).show()
                },
                hide: function () {
                    $('#' + div).hide();
                },
                updateStatus: function () {
                    if (st2110EnableState) {
                        txDestinationAddressValue.show();
                        txDestinationPortValue.show();
                        txFormatValue.show();
                        txCompressionRateValue.show();
                    } else {
                        txDestinationAddressValue.hide();
                        txDestinationPortValue.hide();
                        txFormatValue.hide();
                        txCompressionRateValue.hide();
                    }
                },
                updateValues: function () {
                    values = getSettingValues();
                    txDestinationAddressValue.set(values["destination_address"]);
                    txDestinationPortValue.set(values["destination_port"]);
                    txFormatValue.set(values["format"]);
                    txCompressionRateValue.set(values["compression_rate"]);
                },
                setIntervalNmosStatusDisplayCtrl: function () {
                    intervalStatusIS04PortIS05PortRDSIPAddressRDSPortValue = setInterval(function () {
                        values = getSettingValues();
                        txDestinationAddressValue.set(values["destination_address"]);
                        txDestinationPortValue.set(values["destination_port"]);
                        txFormatValue.set(values["format"]);
                        txCompressionRateValue.set(values["compression_rate"]);
                    }, 1000);
                },
                clearIntervalNmosStatusDisplayCtrl: function () {
                    clearInterval(intervalStatusIS04PortIS05PortRDSIPAddressRDSPortValue);
                }
            };
        }
        function JpegXsRxStatusDisplayCtrl(div, name) {
            let txName;
            let txNameValue;
            let txDestinationAddress;
            let txDestinationPort;
            let txDetection;
            let txSamplingRate;
            let txWidth;
            let txHeight;
            let txDestinationAddressValue;
            let txSourceAddressValue;
            let txDestinationPortValue;
            let txSamplingRateValue;
            let txDetectionValue;
            let txWidthValue;
            let txHeightValue;
            let txSourceAddress;
            let values;
            let txStateValues;

            function initDisplay() {
                values = getSettingValues(name);
                txStateValues = getSettingRxStateValues();
                $('#' + div).empty();
                txName = TextCtrl(div, "setup_mediaOverIp_settingJpeg_xs_rx_name", name);
                txDestinationAddress = TextCtrl(div, "setup_mediaOverIp_settingJpeg_xs_rx_destination_address", NPTZ_WORDING.wID_0690);
                txSourceAddress = TextCtrl(div, "setup_mediaOverIp_settingJpeg_xs_rx_source_address", NPTZ_WORDING.wID_0700);
                txDestinationPort = TextCtrl(div, "setup_mediaOverIp_settingJpeg_xs_rx_destination_port", NPTZ_WORDING.wID_0691);
                txDetection = TextCtrl(div, "setup_mediaOverIp_settingJpeg_xs_rx_Status", NPTZ_WORDING.wID_0705);
                txSamplingRate = TextCtrl(div, "setup_mediaOverIp_settingJpeg_xs_rx_bit_rate", NPTZ_WORDING.wID_0491);
                txWidth = TextCtrl(div, "setup_mediaOverIp_settingJpeg_xs_rx_format", NPTZ_WORDING.wID_0196);
                txHeight = TextCtrl(div, "setup_mediaOverIp_settingJpeg_xs_rx_frame_rate", NPTZ_WORDING.wID_0912);
                //value
                txNameValue = TextCtrl(div, "setup_mediaOverIp_settingJpeg_xs_rx_name_value", values["enable"] == "1" ? "Enable" : "Disable");
                txDestinationAddressValue = TextCtrl(div, "setup_mediaOverIp_settingJpeg_xs_rx_destination_address_value", values["destination_address"]);
                txSourceAddressValue = TextCtrl(div, "setup_mediaOverIp_settingJpeg_xs_rx_source_address_value", values["source_address"]);
                txDestinationPortValue = TextCtrl(div, "setup_mediaOverIp_settingJpeg_xs_rx_destination_port_value", values["destination_port"]);
                txDetectionValue = TextCtrl(div, "setup_mediaOverIp_settingStatus_tx_return_detection_value", txStateValues["state"]);
                txSamplingRateValue = TextCtrl(div, "setup_mediaOverIp_settingJpeg_xs_rx_bit_rate_value", txStateValues["sampling_rate"]);
                txWidthValue = TextCtrl(div, "setup_mediaOverIp_settingJpeg_xs_rx_format_value", values["format"]);
                txHeightValue = TextCtrl(div, "setup_mediaOverIp_settingJpeg_xs_rx_frame_rate_value", txStateValues["frame_rate"]);

                txName.show();
                txDestinationAddress.show();
                txDestinationPort.show();
                txDetection.show();
                txSamplingRate.show();
                txWidth.show();
                txHeight.show();
                txSourceAddress.show();
                txNameValue.show();
                txDestinationAddressValue.show();
                txSourceAddressValue.show();
                txDestinationPortValue.show();
                txDetectionValue.show();
                txSamplingRateValue.show();
                txWidthValue.show();
                txHeightValue.show();
            }

            initDisplay();
            function getSettingValues(name) {
                objJpegXsRxInfo = settingJpegxsRx.getJPEGXSRXInfo();
                return getJpegXsRxInfoResult(objJpegXsRxInfo);
            }
            function getSettingTxStateValues(name) {
                return getjpegXsTxResult(objMOIPRXSTATE, 'video_rx_ch0');
            }
            function getSettingRxStateValues() {
                return getJpegXsRxStateResult();
            }
            return {
                show: function () {
                    $('#' + div).show()
                },
                hide: function () {
                    $('#' + div).hide();
                },
                updateValues: function () {
                    values = getSettingValues(name);
                    txStateValues = getSettingRxStateValues();
                    txNameValue.set(values["enable"] == "1" ? "Enable" : "Disable");
                    txDestinationAddressValue.set(values["destination_address"]);
                    txSourceAddressValue.set(values["source_address"]);
                    txDestinationPortValue.set(values["destination_port"]);
                    txDetectionValue.set(txStateValues["state"]);
                    txSamplingRateValue.set(txStateValues["sampling_rate"]);
                    txWidthValue.set(values["format"]);
                    txHeightValue.set(txStateValues["frame_rate"]);
                },
                setIntervalReturnVideoRxStatusDisplayCtrl: function () {
                    intervalDetectionSamplingRateWidthHeightValue = setInterval(function () {
                        txDetectionValue.set(txStateValues["state"]);
                        txSamplingRateValue.set(txStateValues["sampling_rate"]);
                        txHeightValue.set(txStateValues["frame_rate"]);
                    }, 1000);
                },
                clearIntervalReturnVideoRxStatusDisplayCtrl: function () {
                    clearInterval(intervalDetectionSamplingRateWidthHeightValue);
                }
            };
        }

        function PtpStatusDisplayCtrl(div, name) {
            let txName;
            let txNameValue;
            let txStatus;
            let txDomain;
            let txPtpGrandmasterId;
            let txStatusValue;
            let txDomainValue;
            let txPtpGrandmasterIdValue;
            let values;

            function initDisplay() {
                values = getSettingValues();
                $('#' + div).empty();
                txName = TextCtrl(div, "setup_mediaOverIp_settingStatus_tx_name", name);
                // txNameValue = TextCtrl(div, "setup_mediaOverIp_settingStatus_tx_name", "");
                txStatus = TextCtrl(div, "setup_mediaOverIp_settingStatus_tx_ptp_status", NPTZ_WORDING.wID_0705);
                txDomain = TextCtrl(div, "setup_mediaOverIp_settingStatus_tx_ptp_domain", NPTZ_WORDING.wID_0674);
                txPtpGrandmasterId = TextCtrl(div, "setup_mediaOverIp_settingStatus_tx_ptp_grandmaster_id", NPTZ_WORDING.wID_0706);
                //value
                // txNameValue = TextCtrl(div, "setup_mediaOverIp_settingStatus_tx_name_value", values["status"]);
                txStatusValue = TextCtrl(div, "setup_mediaOverIp_settingStatus_tx_ptp_status_value", values["status"]);
                txDomainValue = TextCtrl(div, "setup_mediaOverIp_settingStatus_tx_ptp_domain_value", values["domain"]);
                txPtpGrandmasterIdValue = TextCtrl(div, "setup_mediaOverIp_settingStatus_tx_ptp_grandmaster_id_value", values["grandmaster_id"]);

                txName.show();
                txStatus.show();
                txDomain.show();
                txPtpGrandmasterId.show();
                txStatusValue.show();
                txDomainValue.show();
                txPtpGrandmasterIdValue.show();
            }

            initDisplay();
            function getSettingValues(name) {
                return getPtpResult(objPtp);
            }
            return {
                show: function () {
                    $('#' + div).show()
                },
                hide: function () {
                    $('#' + div).hide();
                },
                updateValues: function () {
                    values = getSettingValues();
                    txStatusValue.set(values["status"]);
                    txDomainValue.set(values["domain"]);
                    txPtpGrandmasterIdValue.set(values["grandmaster_id"]);
                },
                setIntervalPtpStatusDisplayCtrl: function () {
                    intervalStatusDomainPtpGrandmasterIdValue = setInterval(function () {
                        values = getSettingValues();
                        txStatusValue.set(values["status"]);
                        txDomainValue.set(values["domain"]);
                        txPtpGrandmasterIdValue.set(values["grandmaster_id"]);
                    }, 1000);
                },
                clearIntervalPtpStatusDisplayCtrl: function () {
                    clearInterval(intervalStatusDomainPtpGrandmasterIdValue);
                }
            };
        }
        function NmosStatusDisplayCtrl(div, name) {
            let txName;
            let txNameValue;
            let txStatus;
            let txIS04Port;
            let txIS05Port;
            let txRDSIPAddress;
            let txRDSPort;
            let txFormat;
            let txStatusValue;
            let txIS04PortValue;
            let txIS05PortValue;
            let txRDSIPAddressValue
            let txRDSPortValue

            let values;
            function initDisplay() {
                values = getSettingValues();
                $('#' + div).empty();
                txName = TextCtrl(div, "setup_mediaOverIp_settingStatus_tx_name", name);
                // txNameValue = TextCtrl(div, "setup_mediaOverIp_settingStatus_tx_name", getMoip()["mainVideoTx"]);
                txStatus = TextCtrl(div, "setup_mediaOverIp_settingStatus_nmos_status", NPTZ_WORDING.wID_0705);
                txIS04Port = TextCtrl(div, "setup_mediaOverIp_settingStatus_nmos_IS04_port", NPTZ_WORDING.wID_0707);
                txIS05Port = TextCtrl(div, "setup_mediaOverIp_settingStatus_nmos_IS05_port", NPTZ_WORDING.wID_0708);
                txRDSIPAddress = TextCtrl(div, "setup_mediaOverIp_settingStatus_nmos_RDS_IP_Address", NPTZ_WORDING.wID_0709);
                txRDSPort = TextCtrl(div, "setup_mediaOverIp_settingStatus_nmos_RDS_Port", NPTZ_WORDING.wID_0710);
                //value
                txNameValue = TextCtrl(div, "setup_mediaOverIp_settingStatus_tx_name_value", values["control"] == "1" ? "On" : "Off");
                txStatusValue = TextCtrl(div, "setup_mediaOverIp_settingStatus_nmos_status_value", values["status"]);
                txIS04PortValue = TextCtrl(div, "setup_mediaOverIp_settingStatus_nmos_IS04_port_value", values["port_is_04"]);
                txIS05PortValue = TextCtrl(div, "setup_mediaOverIp_settingStatus_nmos_IS05_port_value", values["port_is_05"]);
                txRDSIPAddressValue = TextCtrl(div, "setup_mediaOverIp_settingStatus_nmos_RDS_IP_Address_value", values["rds_ip_addr"]);
                txRDSPortValue = TextCtrl(div, "setup_mediaOverIp_settingStatus_nmos_RDS_Port_value", values["rds_port"]);

                txName.show();
                txStatus.show();
                txIS04Port.show();
                txIS05Port.show();
                txRDSIPAddress.show();
                txRDSPort.show();
                txNameValue.show();
                if (st2110EnableState) {
                    txStatusValue.show();
                    txIS04PortValue.show();
                    txIS05PortValue.show();
                    txRDSIPAddressValue.show();
                    txRDSPortValue.show();
                } else {
                    if (values["control"] == "1") {
                        txStatusValue.show();
                        txIS04PortValue.show();
                        txIS05PortValue.show();
                        txRDSIPAddressValue.show();
                        txRDSPortValue.show();
                    } else {
                        txStatusValue.hide();
                        txIS04PortValue.hide();
                        txIS05PortValue.hide();
                        txRDSIPAddressValue.hide();
                        txRDSPortValue.hide();
                    }
                }
            }

            initDisplay();
            function getSettingValues(name) {
                objNmosInfo = getNmosInfo();
                return getNmosInfoResult(objNmosInfo);
            }
            return {
                show: function () {
                    $('#' + div).show()
                },
                hide: function () {
                    $('#' + div).hide();
                },
                updateStatus: function () {
                    if (st2110EnableState) {
                        txStatusValue.show();
                        txIS04PortValue.show();
                        txIS05PortValue.show();
                        txRDSIPAddressValue.show();
                        txRDSPortValue.show();
                    } else {
                        txStatusValue.hide();
                        txIS04PortValue.hide();
                        txIS05PortValue.hide();
                        txRDSIPAddressValue.hide();
                        txRDSPortValue.hide();
                    }
                },
                updateValues: function () {
                    values = getSettingValues();
                    txStatusValue.set(values["status"]);
                    txIS04PortValue.set(values["port_is_04"]);
                    txIS05PortValue.set(values["port_is_05"]);
                    txRDSIPAddressValue.set(values["rds_ip_addr"]);
                    txRDSPortValue.set(values["rds_port"]);
                },
                setIntervalNmosStatusDisplayCtrl: function () {
                    intervalStatusIS04PortIS05PortRDSIPAddressRDSPortValue = setInterval(function () {
                        values = getSettingValues();
                        txStatusValue.set(values["status"]);
                        txIS04PortValue.set(values["port_is_04"]);
                        txIS05PortValue.set(values["port_is_05"]);
                        txRDSIPAddressValue.set(values["rds_ip_addr"]);
                        txRDSPortValue.set(values["rds_port"]);
                    }, 1000);
                },
                clearIntervalNmosStatusDisplayCtrl: function () {
                    clearInterval(intervalStatusIS04PortIS05PortRDSIPAddressRDSPortValue);
                }
            };
        }
        function NmosMasterEnableStatusDisplayCtrl(div, name) {
            let txName;
            let txNameValue;
            let txMainVideoTx;
            let txCropVideoTx;
            let txMonitorVidelTx;
            let txMic1AudioTx;
            let txMic2AudioTx;
            let txReturnVideoRx;
            let jpegXSVideoTx;
            let jpegXSVideoRx;
            let txMainVideoTxValue;
            let txCropVideoTxValue;
            let txMonitorVidelTxValue;
            let txMic1AudioTxValue;
            let txMic2AudioTxValue;
            let txReturnVideoRxValue;
            let jpegXSVideoTxValue;
            let jpegXSVideoRxValue;
            let values;

            function initDisplay() {
                values = getSettingValues(name);
                $('#' + div).empty();
                txName = TextCtrl(div, "setup_mediaOverIp_settingStatus_tx_name", name);
                
                if (st2110EnableState) {
                    if (SFPMode == 2) {
                        jpegXSVideoTx = TextCtrl(div, "setup_mediaOverIp_settingStatus_nmos_master_main_video", NPTZ_WORDING.wID_0921);
                        jpegXSVideoRx = TextCtrl(div, "setup_mediaOverIp_settingStatus_nmos_master_crop_video", NPTZ_WORDING.wID_0922);
                        txMic1AudioTx = TextCtrl(div, "setup_mediaOverIp_settingStatus_nmos_master_monitor_video", NPTZ_WORDING.wID_0694);
                        txMic2AudioTx = TextCtrl(div, "setup_mediaOverIp_settingStatus_nmos_master_mic1_audio", NPTZ_WORDING.wID_0695);

                        var objJpegXsTxInfo = cparams_get_jpeg_xs_video_tx();;
                        var txInfoStates;
                        if (objJpegXsTxInfo["video_select"] == "MAIN") {
                            txInfoStates = objJpegXsTxInfo["ch0_enable"] == 0 ? "Off" : (objJpegXsTxInfo["ch0_enable"] == 1 ? "On" : "Dsiable")
                        } else {
                            txInfoStates = objJpegXsTxInfo["ch1_enable"] == 0 ? "Off" : (objJpegXsTxInfo["ch1_enable"] == 1 ? "On" : "Dsiable")
                        }
                        jpegXSVideoTxValue = TextCtrl(div, "setup_mediaOverIp_settingStatus_nmos_master_main_video_value", txInfoStates);
                        var objJpegXsRxInfo = settingJpegxsRx.getJPEGXSRXInfo();
                        jpegXSVideoRxValue = TextCtrl(div, "setup_mediaOverIp_settingStatus_nmos_master_crop_video_value", objJpegXsRxInfo["enable"] == 0 ? "Off" : (objJpegXsRxInfo["enable"] == 1 ? "On" : "Dsiable"));
                        txMic1AudioTxValue = TextCtrl(div, "setup_mediaOverIp_settingStatus_nmos_master_monitor_video_value", values["mic1_enable"]);
                        txMic2AudioTxValue = TextCtrl(div, "setup_mediaOverIp_settingStatus_nmos_master_mic1_audio_value", values["mic2_enable"]);
                    }
                    else {
                        // txNameValue = TextCtrl(div, "setup_mediaOverIp_settingStatus_tx_name", getMoip()["mainVideoTx"]);
                        txMainVideoTx = TextCtrl(div, "setup_mediaOverIp_settingStatus_nmos_master_main_video", NPTZ_WORDING.wID_0689);
                        txCropVideoTx = TextCtrl(div, "setup_mediaOverIp_settingStatus_nmos_master_crop_video", NPTZ_WORDING.wID_0692);
                        txMonitorVidelTx = TextCtrl(div, "setup_mediaOverIp_settingStatus_nmos_master_monitor_video", NPTZ_WORDING.wID_0693);
                        txMic1AudioTx = TextCtrl(div, "setup_mediaOverIp_settingStatus_nmos_master_mic1_audio", NPTZ_WORDING.wID_0694);
                        txMic2AudioTx = TextCtrl(div, "setup_mediaOverIp_settingStatus_nmos_master_mic2_audio", NPTZ_WORDING.wID_0695);
                        txReturnVideoRx = TextCtrl(div, "setup_mediaOverIp_settingStatus_nmos_master_return_video_rx", NPTZ_WORDING.wID_0696);
                        //value
                        // txNameValue = TextCtrl(div, "setup_mediaOverIp_settingStatus_tx_name_value", "");
                        txMainVideoTxValue = TextCtrl(div, "setup_mediaOverIp_settingStatus_nmos_master_main_video_value", values["main_enable"]);
                        txCropVideoTxValue = TextCtrl(div, "setup_mediaOverIp_settingStatus_nmos_master_crop_video_value", values["crop_enable"]);
                        txMonitorVidelTxValue = TextCtrl(div, "setup_mediaOverIp_settingStatus_nmos_master_monitor_video_value", values["monitor_enable"]);
                        txMic1AudioTxValue = TextCtrl(div, "setup_mediaOverIp_settingStatus_nmos_master_mic1_audio_value", values["mic1_enable"]);
                        txMic2AudioTxValue = TextCtrl(div, "setup_mediaOverIp_settingStatus_nmos_master_mic2_audio_value", values["mic2_enable"]);
                        txReturnVideoRxValue = TextCtrl(div, "setup_mediaOverIp_settingStatus_nmos_master_return_video_rx_value", values["return_enable"]);
                    }
                }

                txName.show();
                if (st2110EnableState) {
                    if (SFPMode == 2) {
                        jpegXSVideoTx.show();
                        jpegXSVideoRx.show();
                        jpegXSVideoTxValue.show();
                        jpegXSVideoRxValue.show();
                        txMic1AudioTx.show();
                        txMic2AudioTx.show();
                        txMic1AudioTxValue.show();
                        txMic2AudioTxValue.show();
                    }
                    else {
                        txMainVideoTx.show();
                        txCropVideoTx.show();
                        txMonitorVidelTx.show();
                        txMic1AudioTx.show();
                        txMic2AudioTx.show();
                        txReturnVideoRx.show();
                        txMainVideoTxValue.show();
                        txCropVideoTxValue.show();
                        txMonitorVidelTxValue.show();
                        txMic1AudioTxValue.show();
                        txMic2AudioTxValue.show();
                        txReturnVideoRxValue.show();
                    }
                }
            }

            initDisplay();
            function getSettingValues(name) {
                return getNmosMasterEnableResult(objNmosMasterEnable);
            }
            return {
                show: function () {
                    $('#' + div).show()
                },
                hide: function () {
                    $('#' + div).hide();
                },
                updateValues: function () {
                    values = getSettingValues(name);
                    if (st2110EnableState) {
                        if (SFPMode == 2) {
                        }
                    } else {
                        txMainVideoTxValue.set(values["main_enable"]);
                        txCropVideoTxValue.set(values["crop_enable"]);
                        txMonitorVidelTxValue.set(values["monitor_enable"]);
                        txMic1AudioTxValue.set(values["mic1_enable"]);
                        txMic2AudioTxValue.set(values["mic2_enable"]);
                        txReturnVideoRxValue.set(values["return_enable"]);
                    }

                }
            };
        }
        return {
            build: function () {
                return buildStatus();
            },
            setIntervalMOIPRXSTATEPtpInfo: function () {
                if(intervalMOIPRXSTATEPtpInfo){
                    clearInterval(intervalMOIPRXSTATEPtpInfo);
                    intervalMOIPRXSTATEPtpInfo = null;
                }
                intervalMOIPRXSTATEPtpInfo = setInterval(function () {
                    objMOIPRXSTATE = getMoipRxState();
                    objPtp = getPtpInfo();
                }, 1000);
            },
            setIntervalNmosInfo: function () {
                if(intervalNmosInfo){
                    clearInterval(intervalNmosInfo);
                    intervalNmosInfo = null;
                }
                intervalNmosInfo = setInterval(function () {
                    objNmosInfo = getNmosInfo();
                }, 1000);
            },
            clearIntervalMOIPRXSTATEPtpInfo: function () {
                clearInterval(intervalMOIPRXSTATEPtpInfo);
            },
            clearIntervalNmosInfo: function () {
                clearInterval(intervalNmosInfo);
            },
            setIntervalValues: function () {
                if (returnVideoRx) {
                    returnVideoRx.setIntervalReturnVideoRxStatusDisplayCtrl();
                }
                if (ptpStatus) {
                    ptpStatus.setIntervalPtpStatusDisplayCtrl();
                }
                if (nmosStatus) {
                    nmosStatus.setIntervalNmosStatusDisplayCtrl();
                }
            },
            clearIntervalValues: function () {
                if (returnVideoRx) {
                    returnVideoRx.clearIntervalReturnVideoRxStatusDisplayCtrl();
                }
                if (ptpStatus) {
                    ptpStatus.clearIntervalPtpStatusDisplayCtrl();
                }
                if (nmosStatus) {
                    nmosStatus.clearIntervalNmosStatusDisplayCtrl();
                }
            }
        }
    }

    /**
     * settingSt2110画面:settingSt2110制御に関わる画面クラス
     * @class settingSt2110画面:settingSt2110制御に関わる画面クラス
     * @return {{build: buildSt2110, rebuild: rebuild}} build 構築処理
     * @return {function} rebuild 再構築処理
     * @constructor
     */
    function settingSt2110() {
        /**
         * 構築フラグ
         * @type boolean
         */
        let buildFlag_St2110 = false;
        let txtSt2110Title;
        let txtSt2110PortTitle;
        let St2110_set_button;
        let st2110RadioButtonGroup;
        let selectModeObject;
        let txtSt2110Msg;
        let st2110Status;
        let inputSt2110Port
        function buildSt2110() {
            st2110Status = getSt2110InfoResult(objSt2110Info);
            if (!buildFlag_St2110) {
                buildFlag_St2110 = true;
                txtSt2110Title = TextCtrl("setup_mediaOverIp_st2110_label", "setup_mediaOverIP_St2110_title_label", NPTZ_WORDING.wID_0683);
                txtSt2110Title.show();
                txtSt2110PortTitle = TextCtrl("setup_mediaOverIp_st2110_label", "setup_mediaOverIP_St2110_port_title_label", NPTZ_WORDING.wID_0711);
                txtSt2110PortTitle.show();
                // st2110 radio
                st2110RadioButtonGroup = RadioButtonGroupCtrl("setup_mediaOverIp_st2110_form", "setup_mediaOverIp_St2110_", RADIO_GROUP.rID_0001, st2110Status["enable"], callbackSt2110SelectChange);
                inputSt2110Port = InputCtrl("setup_mediaOverIp_st2110_form", 'st2110_port', 'st2110_port', 'setup_mediaOverIp_St2110_st2110_port', st2110Status["port"], null, null, null, null)
                inputSt2110Port.show();
                inputSt2110Port.displayOff();
                txtSt2110Msg = TextCtrl("setup_mediaOverIp_st2110_form", "setup_mediaOverIP_St2110_port_msg_label", NPTZ_WORDING.wID_0712);
                txtSt2110Msg.show();
                //Line
                LineCtrl('setup_mediaOverIp_st2110_main', 'horizontal', 150, 0, "", 'setup_mediaOverIp_St2110', "97.5");
                LineCtrl('setup_mediaOverIp_st2110_main', 'horizontal', 150, 0, "", 'setup_mediaOverIp_St2110_port', "97.5");

                St2110_set_button = ButtonCtrl("setup_mediaOverIp_st2110_form", "setup_mediaOverIp_St2110_set_button", NPTZ_WORDING.wID_0141, callbackSt2110SetButton);
                St2110_set_button.getButtonObject().addClass('button_class');
                St2110_set_button.show();
                St2110_set_button.displayOff();
                callbackSt2110SelectChange();
            } else {
                rebuild();
            }
        }

        function rebuild() {
            st2110RadioButtonGroup.setSelectedValue(st2110Status["enable"]);
            inputSt2110Port.set(st2110Status["port"]);
            callbackSt2110SelectChange();
        }

        function callbackSt2110SelectChange() {
            if (st2110RadioButtonGroup.getSelectedValue() == 1) {
                inputSt2110Port.displayOff();
                st2110EnableState = true;
                // mediaOverIP.rebuild(); 
            } else {
                inputSt2110Port.displayDisabled();
                st2110EnableState = false;

            }
        }
        /**
         *
         * @param mouse
         */
        function callbackSt2110SetButton(mouse) {
            if (mouse == Button.MOUSE_DOWN) {
                const objSt2110Port = document.getElementById("st2110_port");
                // input check
                if (!capi_isDigit(inputSt2110Port.get())) {
                    return capi_DispError(objSt2110Port, MSG_STATUS.mID_0010);
                } else if (!(objSt2110Port.value > 1023 && objSt2110Port.value < 65536)) {
                    return capi_DispError(objSt2110Port, MSG_STATUS.mID_0107);
                }
                if (inputSt2110Port.get() == '10670' || inputSt2110Port.get() == '10669') {
                    return capi_DispError(objSt2110Port, MSG_STATUS.mID_0026);
                }
                $("#dialog_setup").show();
                $.ajax({
                    type: "post",
                    url: "/cgi-bin/set_st2110_info",
                    data: getSt2110InfoSettingData(),
                    success: function (data) {
                        mediaOverIPInstance.rebuild();
                        setTimeout(function () {
                            $("#dialog_setup").hide();
                        }, 500);
                    },
                    error: function (jqXHR, textStatus, errorThrown) {
                        // mediaOverIP.rebuild(); 
                        setTimeout(function () {
                            $("#dialog_setup").hide();
                            jAlert(errorThrown, NPTZ_WORDING.wID_0039);
                        }, 500);
                    }
                });
            }
        }
        function getSt2110InfoSettingData() {
            var data = {};
            data['enable'] = st2110RadioButtonGroup.getSelectedValue();
            data['port'] = inputSt2110Port.get();
            return data;
        }
        return {
            build: function () {
                return buildSt2110();
            }
        }
    }

    /**
     * settingSt2110Tx画面:settingSt2110Tx制御に関わる画面クラス
     * @class settingSt2110Tx画面:settingSt2110Tx制御に関わる画面クラス
     * @return {{build: buildSt2110Tx, rebuild: rebuild}} build 構築処理
     * @return {function} rebuild 再構築処理
     * @constructor
     */
    function settingSt2110Tx() {
        /**
         * 構築フラグ
         * @type boolean
         */
        var buildFlagSt2110TxSetting = false;
        var objMoipVideoTx;
        var objMoipAudioTx;
        var objMainVideoValues;
        var objCropVideoValues;
        var objMonitorVideoValues;
        var objMic1AudioValues;
        var objMic2AudioValues;
        var txtMainVideo;
        var txtMainVideoFormat;
        var txtMainVideoDestinationAddress;
        var txtMainVideoDestinationPort;
        var txtMainVideoDestinationPortMsg;
        var txtCropVideo;
        var txtCropVideoFormat;
        var txtCropVideoDestinationAddress;
        var txtCropVideoDestinationPort;
        var txtCropVideoDestinationPortMsg;
        var txtMonitorVideo;
        var txtMonitorVideoFormat;
        var txtMonitorVideoDestinationAddress;
        var txtMonitorVideoDestinationPort;
        var txtMonitorVideoDestinationPortMsg;
        var txtMic1Audio;
        var txtMic1AudioDestinationAddress;
        var txtMic1AudioDestinationPort;
        var txtMic1AudioDestinationPortMsg;
        var txtMic2Audio;
        var txtMic2AudioDestinationAddress;
        var txtMic2AudioDestinationPort;
        var txtMic2AudioDestinationPortMsg;
        // input
        var inputMainVideoDestinationAddress;
        var inputMainVideoDestinationPort;
        var inputCropVideoDestinationAddress;
        var inputCropVideoDestinationPort;
        var inputMonitorVideoDestinationAddress;
        var inputMonitorVideoDestinationPort;
        var inputMic1AudioDestinationAddress;
        var inputMic1AudioDestinationPort;
        var inputMic2AudioDestinationAddress;
        var inputMic2AudioDestinationPort;

        // select
        var selectMainVideoFormat;
        var selectCropVideoFormat;
        var selectMonitorVideoFormat;

        let nowfreq = null;
        let sFormat = "";
        let uhdCropRadioDate;
        var SPFMode = cparam_get_SFPMode();

        function buildSt2110Tx() {
            objMoipVideoTx = getMoipVideoTx();
            objMoipAudioTx = getMoipAudioTx();
            objMainVideoValues = getMoipVideoTxResult(objMoipVideoTx, "video_tx_ch0");
            objCropVideoValues = getMoipVideoTxResult(objMoipVideoTx, "video_tx_ch1");
            objMonitorVideoValues = getMoipVideoTxResult(objMoipVideoTx, "video_tx_ch2");
            objMic1AudioValues = getMoipAudioTxResult(objMoipAudioTx, "audio_tx_ch0");
            objMic2AudioValues = getMoipAudioTxResult(objMoipAudioTx, "audio_tx_ch1");
            if (!buildFlagSt2110TxSetting) {
                nowfreq = cparam_get_frequency();
                sFormat = cparam_get_format();
                uhdCropRadioDate = cparam_get_UHDCrop();
                buildFlagSt2110TxSetting = true;
                // main video
                txtMainVideo = TextCtrl("setup_mediaOverIp_st2110_tx_label", "setup_mediaOverIP_St2110_tx_main_video_label", NPTZ_WORDING.wID_0713);
                txtMainVideo.show();
                txtMainVideoFormat = TextCtrl('setup_mediaOverIp_st2110_tx_label', 'setup_mediaOverIP_St2110_tx_main_video_format_label', NPTZ_WORDING.wID_0196);
                txtMainVideoFormat.show();
                selectMainVideoFormat = SelectCtrl("setup_mediaOverIp_st2110_tx_form", "main_video_format_select", "main_video_format_select", "setup_mediaOverIP_St2110_tx_main_video_format_select");
                refreshMainVideoFormat(selectMainVideoFormat);
                selectMainVideoFormat.show();
                selectMainVideoFormat.displayOff();
                txtMainVideoDestinationAddress = TextCtrl("setup_mediaOverIp_st2110_tx_label", "setup_mediaOverIP_St2110_tx_main_video_destination_address_label", NPTZ_WORDING.wID_0690);
                txtMainVideoDestinationAddress.show();
                inputMainVideoDestinationAddress = InputCtrl("setup_mediaOverIp_st2110_tx_form", 'main_video_destination_address', 'main_video_destination_address', 'setup_mediaOverIP_St2110_tx_main_video_destination_address', objMainVideoValues && objMainVideoValues["ip_addr"])
                inputMainVideoDestinationAddress.show();
                inputMainVideoDestinationAddress.displayOff();
                txtMainVideoDestinationPort = TextCtrl("setup_mediaOverIp_st2110_tx_label", "setup_mediaOverIP_St2110_tx_main_video_destination_port_label", NPTZ_WORDING.wID_0691);
                txtMainVideoDestinationPort.show();
                inputMainVideoDestinationPort = InputCtrl("setup_mediaOverIp_st2110_tx_form", 'main_video_destination_port', 'main_video_destination_port', 'setup_mediaOverIP_St2110_tx_main_video_destination_port', objMainVideoValues && objMainVideoValues["port"])
                inputMainVideoDestinationPort.show();
                inputMainVideoDestinationPort.displayOff();
                txtMainVideoDestinationPortMsg = TextCtrl("setup_mediaOverIp_st2110_tx_form", "setup_mediaOverIP_St2110_tx_main_video_destination_port_msg_label", NPTZ_WORDING.wID_0712);
                txtMainVideoDestinationPortMsg.show();
                // crop video
                txtCropVideo = TextCtrl("setup_mediaOverIp_st2110_tx_label", "setup_mediaOverIP_St2110_tx_crop_video_label", NPTZ_WORDING.wID_0714);
                txtCropVideo.show();
                txtCropVideoFormat = TextCtrl('setup_mediaOverIp_st2110_tx_label', 'setup_mediaOverIP_St2110_tx_crop_video_format_label', NPTZ_WORDING.wID_0196);
                txtCropVideoFormat.show();
                selectCropVideoFormat = SelectCtrl("setup_mediaOverIp_st2110_tx_form", "crop_video_format_select", "crop_video_format_select", "setup_mediaOverIP_St2110_tx_crop_video_format_select");
                refreshMainVideoFormat(selectCropVideoFormat);
                selectCropVideoFormat.show();
                selectCropVideoFormat.displayDisabled();
                txtCropVideoDestinationAddress = TextCtrl("setup_mediaOverIp_st2110_tx_label", "setup_mediaOverIP_St2110_tx_crop_video_destination_address_label", NPTZ_WORDING.wID_0690);
                txtCropVideoDestinationAddress.show();
                inputCropVideoDestinationAddress = InputCtrl("setup_mediaOverIp_st2110_tx_form", 'crop_video_destination_address', 'crop_video_destination_address', 'setup_mediaOverIP_St2110_tx_crop_video_destination_address', objCropVideoValues && objCropVideoValues["ip_addr"])
                inputCropVideoDestinationAddress.show();
                inputCropVideoDestinationAddress.displayOff();
                txtCropVideoDestinationPort = TextCtrl("setup_mediaOverIp_st2110_tx_label", "setup_mediaOverIP_St2110_tx_crop_video_destination_port_label", NPTZ_WORDING.wID_0691);
                txtCropVideoDestinationPort.show();
                inputCropVideoDestinationPort = InputCtrl("setup_mediaOverIp_st2110_tx_form", 'crop_video_destination_port', 'crop_video_destination_port', 'setup_mediaOverIP_St2110_tx_crop_video_destination_port', objCropVideoValues && objCropVideoValues["port"])
                inputCropVideoDestinationPort.show();
                inputCropVideoDestinationPort.displayOff();
                txtCropVideoDestinationPortMsg = TextCtrl("setup_mediaOverIp_st2110_tx_form", "setup_mediaOverIP_St2110_tx_crop_video_destination_port_msg_label", NPTZ_WORDING.wID_0712);
                txtCropVideoDestinationPortMsg.show();

                // monitor
                txtMonitorVideo = TextCtrl("setup_mediaOverIp_st2110_tx_label", "setup_mediaOverIP_St2110_tx_monitor_video_label", NPTZ_WORDING.wID_0715);
                txtMonitorVideo.show();
                txtMonitorVideoFormat = TextCtrl('setup_mediaOverIp_st2110_tx_label', 'setup_mediaOverIP_St2110_tx_monitor_video_format_label', NPTZ_WORDING.wID_0196);
                txtMonitorVideoFormat.show();
                selectMonitorVideoFormat = SelectCtrl("setup_mediaOverIp_st2110_tx_form", "monitor_video_format_select", "monitor_video_format_select", "setup_mediaOverIP_St2110_tx_monitor_video_format_select");
                refreshMainVideoFormat(selectMonitorVideoFormat);
                selectMonitorVideoFormat.show();
                selectMonitorVideoFormat.displayDisabled();
                txtMonitorVideoDestinationAddress = TextCtrl("setup_mediaOverIp_st2110_tx_label", "setup_mediaOverIP_St2110_tx_monitor_video_destination_address_label", NPTZ_WORDING.wID_0690);
                txtMonitorVideoDestinationAddress.show();
                inputMonitorVideoDestinationAddress = InputCtrl("setup_mediaOverIp_st2110_tx_form", 'monitor_video_destination_address', 'monitor_video_destination_address', 'setup_mediaOverIP_St2110_tx_monitor_video_destination_address', objMonitorVideoValues && objMonitorVideoValues["ip_addr"])
                inputMonitorVideoDestinationAddress.show();
                inputMonitorVideoDestinationAddress.displayOff();
                txtMonitorVideoDestinationPort = TextCtrl("setup_mediaOverIp_st2110_tx_label", "setup_mediaOverIP_St2110_tx_monitor_video_destination_port_label", NPTZ_WORDING.wID_0691);
                txtMonitorVideoDestinationPort.show();
                inputMonitorVideoDestinationPort = InputCtrl("setup_mediaOverIp_st2110_tx_form", 'monitor_video_destination_port', 'monitor_video_destination_port', 'setup_mediaOverIP_St2110_tx_monitor_video_destination_port', objMonitorVideoValues && objMonitorVideoValues["port"])
                inputMonitorVideoDestinationPort.show();
                inputMonitorVideoDestinationPort.displayOff();
                txtMonitorVideoDestinationPortMsg = TextCtrl("setup_mediaOverIp_st2110_tx_form", "setup_mediaOverIP_St2110_tx_monitor_video_destination_port_msg_label", NPTZ_WORDING.wID_0712);
                txtMonitorVideoDestinationPortMsg.show();
                // audio
                txtMic1Audio = TextCtrl("setup_mediaOverIp_st2110_tx_label", "setup_mediaOverIP_St2110_tx_mic1_audio_label", NPTZ_WORDING.wID_0716);
                txtMic1Audio.show();
                txtMic1AudioDestinationAddress = TextCtrl("setup_mediaOverIp_st2110_tx_label", "setup_mediaOverIP_St2110_tx_mic1_audio_destination_address_label", NPTZ_WORDING.wID_0690);
                txtMic1AudioDestinationAddress.show();
                inputMic1AudioDestinationAddress = InputCtrl("setup_mediaOverIp_st2110_tx_form", 'mic1_audio_destination_address', 'mic1_audio_destination_address', 'setup_mediaOverIP_St2110_tx_mic1_audio_destination_address', objMic1AudioValues && objMic1AudioValues["ip_addr"])
                inputMic1AudioDestinationAddress.show();
                inputMic1AudioDestinationAddress.displayOff();
                txtMic1AudioDestinationPort = TextCtrl("setup_mediaOverIp_st2110_tx_label", "setup_mediaOverIP_St2110_tx_mic1_audio_destination_port_label", NPTZ_WORDING.wID_0691);
                txtMic1AudioDestinationPort.show();
                inputMic1AudioDestinationPort = InputCtrl("setup_mediaOverIp_st2110_tx_form", 'mic1_audio_destination_port', 'mic1_audio_destination_port', 'setup_mediaOverIP_St2110_tx_mic1_audio_destination_port', objMic1AudioValues && objMic1AudioValues["port"])
                inputMic1AudioDestinationPort.show();
                inputMic1AudioDestinationPort.displayOff();
                txtMic1AudioDestinationPortMsg = TextCtrl("setup_mediaOverIp_st2110_tx_form", "setup_mediaOverIP_St2110_tx_mic1_audio_destination_port_msg_label", NPTZ_WORDING.wID_0712);
                txtMic1AudioDestinationPortMsg.show();
                // mic2 audio
                txtMic2Audio = TextCtrl("setup_mediaOverIp_st2110_tx_label", "setup_mediaOverIP_St2110_tx_mic2_audio_label", NPTZ_WORDING.wID_0717);
                txtMic2Audio.show();
                txtMic2AudioDestinationAddress = TextCtrl("setup_mediaOverIp_st2110_tx_label", "setup_mediaOverIP_St2110_tx_mic2_audio_destination_address_label", NPTZ_WORDING.wID_0690);
                txtMic2AudioDestinationAddress.show();
                inputMic2AudioDestinationAddress = InputCtrl("setup_mediaOverIp_st2110_tx_form", 'mic2_audio_destination_address', 'mic2_audio_destination_address', 'setup_mediaOverIP_St2110_tx_mic2_audio_destination_address', objMic2AudioValues && objMic2AudioValues["ip_addr"])
                inputMic2AudioDestinationAddress.show();
                inputMic2AudioDestinationAddress.displayOff();
                txtMic2AudioDestinationPort = TextCtrl("setup_mediaOverIp_st2110_tx_label", "setup_mediaOverIP_St2110_tx_mic2_audio_destination_port_label", NPTZ_WORDING.wID_0691);
                txtMic2AudioDestinationPort.show();
                inputMic2AudioDestinationPort = InputCtrl("setup_mediaOverIp_st2110_tx_form", 'mic2_audio_destination_port', 'mic2_audio_destination_port', 'setup_mediaOverIP_St2110_tx_mic2_audio_destination_port', objMic2AudioValues && objMic2AudioValues["port"])
                inputMic2AudioDestinationPort.show();
                inputMic2AudioDestinationPort.displayOff();
                txtMic2AudioDestinationPortMsg = TextCtrl("setup_mediaOverIp_st2110_tx_form", "setup_mediaOverIP_St2110_tx_mic2_audio_destination_port_msg_label", NPTZ_WORDING.wID_0712);
                txtMic2AudioDestinationPortMsg.show();
                //Line
                LineCtrl('setup_mediaOverIp_st2110_tx_main', 'horizontal', 150, 0, "", 'setup_mediaOverIP_St2110_tx_main_video_format', "97.5");
                LineCtrl('setup_mediaOverIp_st2110_tx_main', 'horizontal', 150, 0, "", 'setup_mediaOverIP_St2110_tx_main_video_destination_address', "97.5");
                LineCtrl('setup_mediaOverIp_st2110_tx_main', 'horizontal', 150, 0, "", 'setup_mediaOverIP_St2110_tx_main_video_destination_port', "97.5");
                LineCtrl('setup_mediaOverIp_st2110_tx_main', 'horizontal', 150, 0, "", 'setup_mediaOverIP_St2110_tx_crop_video_format', "97.5");
                LineCtrl('setup_mediaOverIp_st2110_tx_main', 'horizontal', 150, 0, "", 'setup_mediaOverIP_St2110_tx_crop_video_destination_address', "97.5");
                LineCtrl('setup_mediaOverIp_st2110_tx_main', 'horizontal', 150, 0, "", 'setup_mediaOverIP_St2110_tx_crop_video_destination_port', "97.5");
                LineCtrl('setup_mediaOverIp_st2110_tx_main', 'horizontal', 150, 0, "", 'setup_mediaOverIP_St2110_tx_monitor_video_format', "97.5");
                LineCtrl('setup_mediaOverIp_st2110_tx_main', 'horizontal', 150, 0, "", 'setup_mediaOverIP_St2110_tx_monitor_video_destination_address', "97.5");
                LineCtrl('setup_mediaOverIp_st2110_tx_main', 'horizontal', 150, 0, "", 'setup_mediaOverIP_St2110_tx_monitor_video_destination_port', "97.5");
                LineCtrl('setup_mediaOverIp_st2110_tx_main', 'horizontal', 150, 0, "", 'setup_mediaOverIP_St2110_tx_mic1_audio_destination_address', "97.5");
                LineCtrl('setup_mediaOverIp_st2110_tx_main', 'horizontal', 150, 0, "", 'setup_mediaOverIP_St2110_tx_mic1_audio_destination_port', "97.5");
                LineCtrl('setup_mediaOverIp_st2110_tx_main', 'horizontal', 150, 0, "", 'setup_mediaOverIP_St2110_tx_mic2_audio_destination_address', "97.5");
                LineCtrl('setup_mediaOverIp_st2110_tx_main', 'horizontal', 150, 0, "", 'setup_mediaOverIP_St2110_tx_mic2_audio_destination_port', "97.5");
                LineCtrl("setup_mediaOverIp_st2110_tx_main", "vertical", 0, 0, 0, "setup_mediaOverIP_St2110_tx_main_video");
                LineCtrl("setup_mediaOverIp_st2110_tx_main", "vertical", 0, 0, 0, "setup_mediaOverIP_St2110_tx_crop_video");
                LineCtrl("setup_mediaOverIp_st2110_tx_main", "vertical", 0, 0, 0, "setup_mediaOverIP_St2110_tx_monitor_video");
                LineCtrl("setup_mediaOverIp_st2110_tx_main", "vertical", 0, 0, 0, "setup_mediaOverIP_St2110_tx_mic1_audio");
                LineCtrl("setup_mediaOverIp_st2110_tx_main", "vertical", 0, 0, 0, "setup_mediaOverIP_St2110_tx_mic2_audio");
                St2110_set_button = ButtonCtrl("setup_mediaOverIp_st2110_tx_form", "setup_mediaOverIp_St2110_tx_set_button", NPTZ_WORDING.wID_0141, callbackSt2110TxSetButton);
                St2110_set_button.getButtonObject().addClass('button_class');
                St2110_set_button.show();
                St2110_set_button.displayOff();
                initData();
            } else {
                rebuild();
            }
        }

        function initData(){           
            selectMainVideoFormat.val(cparam_getMainVideoFormatSelect());
            selectCropVideoFormat.val(cparam_getCropVideoFormatSelect());
            selectMonitorVideoFormat.val(cparam_getMonitorVideoFormatSelect());

            if (objMainVideoValues["enable"] == "disable") {
                selectMainVideoFormat.displayDisabled();
                inputMainVideoDestinationAddress.displayDisabled();
                inputMainVideoDestinationPort.displayDisabled();
            } else {
                selectMainVideoFormat.displayOff();
                inputMainVideoDestinationAddress.displayOff();
                inputMainVideoDestinationPort.displayOff();
            }
            if (objCropVideoValues["enable"] == "disable") {
                selectCropVideoFormat.displayDisabled();
                inputCropVideoDestinationAddress.displayDisabled();
                inputCropVideoDestinationPort.displayDisabled();
            } else {
                selectCropVideoFormat.displayOff();
                inputCropVideoDestinationAddress.displayOff();
                inputCropVideoDestinationPort.displayOff();
            }
            if (objMonitorVideoValues["enable"] == "disable") {
                selectMonitorVideoFormat.displayDisabled();
                inputMonitorVideoDestinationAddress.displayDisabled();
                inputMonitorVideoDestinationPort.displayDisabled();
            } else {
                selectMonitorVideoFormat.displayOff();
                inputMonitorVideoDestinationAddress.displayOff();
                inputMonitorVideoDestinationPort.displayOff();
            }
            if (objMic1AudioValues["enable"] == "disable") {
                inputMic1AudioDestinationAddress.displayDisabled();
                inputMic1AudioDestinationPort.displayDisabled();
            } else {
                inputMic1AudioDestinationAddress.displayOff();
                inputMic1AudioDestinationPort.displayOff();
            }
            if (objMic2AudioValues["enable"] == "disable") {
                inputMic2AudioDestinationAddress.displayDisabled();
                inputMic2AudioDestinationPort.displayDisabled();
            } else {
                inputMic2AudioDestinationAddress.displayOff();
                inputMic2AudioDestinationPort.displayOff();
            }
            if(SPFMode == 2){
                selectMainVideoFormat.displayDisabled();
                inputMainVideoDestinationAddress.displayDisabled();
                inputMainVideoDestinationPort.displayDisabled();
                selectCropVideoFormat.displayDisabled();
                inputCropVideoDestinationAddress.displayDisabled();
                inputCropVideoDestinationPort.displayDisabled();
                selectMonitorVideoFormat.displayDisabled();
                inputMonitorVideoDestinationAddress.displayDisabled();
                inputMonitorVideoDestinationPort.displayDisabled();
                //Add #8528 SFP+ ModeがST2110 JPEG XSの時、ST2110 TX画面のVideo関係はグレーアウト
                // inputMic1AudioDestinationAddress.displayDisabled();
                // inputMic1AudioDestinationPort.displayDisabled();
                // inputMic2AudioDestinationAddress.displayDisabled();
                // inputMic2AudioDestinationPort.displayDisabled();
                // St2110_set_button.displayDisabled();
            }
        }
        function rebuild() {
            inputMainVideoDestinationAddress.set(objMainVideoValues["ip_addr"]);
            inputMainVideoDestinationPort.set(objMainVideoValues["port"]);
            inputCropVideoDestinationAddress.set(objCropVideoValues["ip_addr"]);
            inputCropVideoDestinationPort.set(objCropVideoValues["port"]);
            inputMonitorVideoDestinationAddress.set(objMonitorVideoValues["ip_addr"]);
            inputMonitorVideoDestinationPort.set(objMonitorVideoValues["port"]);
            inputMic1AudioDestinationAddress.set(objMic1AudioValues["ip_addr"]);
            inputMic1AudioDestinationPort.set(objMic1AudioValues["port"]);
            inputMic2AudioDestinationAddress.set(objMic2AudioValues["ip_addr"]);
            inputMic2AudioDestinationPort.set(objMic2AudioValues["port"]);
            nowfreq = cparam_get_frequency();
            sFormat = cparam_get_format();
            uhdCropRadioDate = cparam_get_UHDCrop();
            refreshMainVideoFormat(selectMainVideoFormat);
            refreshMainVideoFormat(selectCropVideoFormat);
            refreshMainVideoFormat(selectMonitorVideoFormat);
            initData();
        }

        function callbackSt2110TxSetButton(mouse) {
            if (mouse == Button.MOUSE_DOWN) {
                // input check
                if (SPFMode != 2) {
                    if (!checkVideoData()) {
                        return false;
                    }
                }
                if (!checkAudioData()) {
                    return false;
                }

                if (SPFMode != 2) {
                    setVideoData();
                }
                setAudioData();
            }
        }

        function refreshMainVideoFormat(targetObject){
            let select_system_mainvideo_format_value = [];
            let select_system_mainvideo_format_text = [];
            if (nowfreq == 0) { //59.94
                switch (sFormat) {
                    case "19":
                        if(uhdCropRadioDate == 2){
                            select_system_mainvideo_format_value = ["01"];
                            select_system_mainvideo_format_text = ["720/59.94p"];
                        }else{
                            select_system_mainvideo_format_value = ["10"];
                            select_system_mainvideo_format_text = ["1080/59.94p"];
                        }
                        break;
                    case "17":
                        select_system_mainvideo_format_value = ["14"];
                        select_system_mainvideo_format_text = ["1080/29.97p"];
                        break;
                    case "26":
                        select_system_mainvideo_format_value = ["10"];
                        select_system_mainvideo_format_text = ["1080/59.94p"];
                        break;
                    case "10":
                        select_system_mainvideo_format_value = ["10"];
                        select_system_mainvideo_format_text = ["1080/59.94p"];
                        break;
                    // case "04":
                    //     select_system_mainvideo_format_value = ["04"];
                    //     select_system_mainvideo_format_text = ["1080/59.94i"];
                    //     break;
                    case "14":
                        select_system_mainvideo_format_value = ["14"];
                        select_system_mainvideo_format_text = ["1080/29.97p"];
                        break;
                    // case "07":
                    //     select_system_mainvideo_format_value = ["07"];
                    //     select_system_mainvideo_format_text = ["1080/29.97PsF"];
                    //     break;
                    // case "16":
                    //     select_system_mainvideo_format_value = ["16"];
                    //     select_system_mainvideo_format_text = ["1080/23.98p(59.94i)"];
                    //     break;
                    case "01":
                        select_system_mainvideo_format_value = ["01"];
                        select_system_mainvideo_format_text = ["720/59.94p"];
                        break;
                }
            } else if (nowfreq == 1) {
                switch (sFormat) {
                    case "1A":
                        if(uhdCropRadioDate == 2){
                            select_system_mainvideo_format_value = ["02"];
                            select_system_mainvideo_format_text = ["720/50p"];
                        }else{
                            select_system_mainvideo_format_value = ["11"];
                            select_system_mainvideo_format_text = ["1080/50p"];
                        }
                        break;
                    case "18":
                        select_system_mainvideo_format_value = ["15"];
                        select_system_mainvideo_format_text = ["1080/25p"];
                        break;
                    case "27":
                        select_system_mainvideo_format_value = ["11"];
                        select_system_mainvideo_format_text = ["1080/50p"];
                        break;
                    case "11":
                        select_system_mainvideo_format_value = ["11","05"];
                        select_system_mainvideo_format_text = ["1080/50p","1080/50i"];
                        break;
                    // case "05":
                    //     select_system_mainvideo_format_value = ["05"];
                    //     select_system_mainvideo_format_text = ["1080/50i"];
                    //     break;
                    case "15":
                        select_system_mainvideo_format_value = ["15"];
                        select_system_mainvideo_format_text = ["1080/25p"];
                        break;
                    // case "08":
                    //     select_system_mainvideo_format_value = ["08"];
                    //     select_system_mainvideo_format_text = ["1080/25PsF"];
                    //     break;
                    case "02":
                        select_system_mainvideo_format_value = ["02"];
                        select_system_mainvideo_format_text = ["720/50p"];
                        break;
                }
            } else if (nowfreq == 2) {
                switch (sFormat) {
                    case "21":
                        select_system_mainvideo_format_value = ["22"];
                        select_system_mainvideo_format_text = ["1080/24p"];
                        break;
                    case "22":
                        select_system_mainvideo_format_value = ["22"];
                        select_system_mainvideo_format_text = ["1080/24p"];
                        break;
                }
            } else if (nowfreq == 3) {
                switch (sFormat) {
                    case "1B":
                        select_system_mainvideo_format_value = ["23"];
                        select_system_mainvideo_format_text = ['1080/23.98p'];
                        break;
                    case "23":
                        select_system_mainvideo_format_value = ["23"];
                        select_system_mainvideo_format_text = ["1080/23.98p"];
                        break;
                    // case "0A":
                    //     select_system_mainvideo_format_value = ["0A"];
                    //     select_system_mainvideo_format_text = ["1080/23.98PsF"];
                    //     break;
                }
            } else if (nowfreq == 4) {
                switch(sFormat){
                    case "20":
                        select_system_mainvideo_format_value = ["20"];
                        select_system_mainvideo_format_text = ['1080/60p'];
                        break;
                    case "1F":
                        select_system_mainvideo_format_value = ["20"];
                        select_system_mainvideo_format_text = ['1080/60p'];
                        break;
                };
            }
            targetObject.appendOptions(select_system_mainvideo_format_value, select_system_mainvideo_format_text);
        }

        function initFormatSelect(targetObject){
            let select_system_format_value = [];
            let select_system_format_text = [];
            select_system_format_value = ["01","02","04","05","10","11","14","15","20","22","23","FF"];
            select_system_format_text = ["720/59.94p","720/50p","1080/59.94i","1080/50i","1080/59.94p","1080/50p","1080/29.97p","1080/25p","1080/60p","1080/24p","1080/23.98p","-------"];
            targetObject.appendOptions(select_system_format_value, select_system_format_text);
        }

        function checkVideoData() {
            const objMainVideoDestinationAddress = document.getElementById("main_video_destination_address");
            const objMainVideoDestinationPort = document.getElementById("main_video_destination_port");
            const objCropVideoDestinationAddress = document.getElementById("crop_video_destination_address");
            const objCropVideoDestinationPort = document.getElementById("crop_video_destination_port");
            const objMonitorVideoDestinationAddress = document.getElementById("monitor_video_destination_address");
            const objMonitorVideoDestinationPort = document.getElementById("monitor_video_destination_port");
            var IpAddress1 = inputMainVideoDestinationAddress.get().split(".");
            var IpAddress2 = inputCropVideoDestinationAddress.get().split(".");
            var IpAddress3 = inputMonitorVideoDestinationAddress.get().split(".")
            if (!isRightIpAddress(inputMainVideoDestinationAddress.get())) {
                return capi_DispError(objMainVideoDestinationAddress, MSG_STATUS.mID_0010);
            } else if ((IpAddress1[0] < 0 || IpAddress1[0] > 239) || (IpAddress1[1] < 0 || IpAddress1[1] > 255) || (IpAddress1[2] < 0 || IpAddress1[2] > 255) || (IpAddress1[3] < 0 || IpAddress1[3] > 255)){
                return capi_DispError(objMainVideoDestinationAddress, MSG_STATUS.mID_0027 );
            } else if (IpAddress1[0] == 127){
                return capi_DispError(objMainVideoDestinationAddress, MSG_STATUS.mID_0027 );
            }else if (IpAddress1[0] == 224 && IpAddress1[1] == 0 && (IpAddress1[2] == 0 || IpAddress1[2] == 1) && (IpAddress1[3] >= 0 || IpAddress1[3] <= 255)){
                return capi_DispError(objMainVideoDestinationAddress, MSG_STATUS.mID_0027);
            } else if (IpAddress1[0] == 0 && IpAddress1[1] == 0 && IpAddress1[2] == 0 && IpAddress1[3] == 0 ){
                return capi_DispError(objMainVideoDestinationAddress, MSG_STATUS.mID_0027);
            }
            if (!isRightIpAddress(inputCropVideoDestinationAddress.get())) {
                return capi_DispError(objCropVideoDestinationAddress, MSG_STATUS.mID_0010);
            } else if ((IpAddress2[0] < 0 || IpAddress2[0] > 239) || (IpAddress2[1] < 0 || IpAddress2[1] > 255) || (IpAddress2[2] < 0 || IpAddress2[2] > 255) || (IpAddress2[3] < 0 || IpAddress2[3] > 255)){
                return capi_DispError(objCropVideoDestinationAddress, MSG_STATUS.mID_0027 );
            } else if (IpAddress2[0] == 127){
                return capi_DispError(objCropVideoDestinationAddress, MSG_STATUS.mID_0027 );
            }else if (IpAddress2[0] == 224 && IpAddress2[1] == 0 && (IpAddress2[2] == 0 || IpAddress2[2] == 1) && (IpAddress2[3] >= 0 || IpAddress2[3] <= 255)){
                return capi_DispError(objCropVideoDestinationAddress, MSG_STATUS.mID_0027);
            } else if (IpAddress2[0] == 0 && IpAddress2[1] == 0 && IpAddress2[2] == 0 && IpAddress2[3] == 0 ){
                return capi_DispError(objCropVideoDestinationAddress, MSG_STATUS.mID_0027);
            }
            if (!isRightIpAddress(inputMonitorVideoDestinationAddress.get())) {
                return capi_DispError(objMonitorVideoDestinationAddress, MSG_STATUS.mID_0010);
            } else if ((IpAddress3[0] < 0 || IpAddress3[0] > 239) || (IpAddress3[1] < 0 || IpAddress3[1] > 255) || (IpAddress3[2] < 0 || IpAddress3[2] > 255) || (IpAddress3[3] < 0 || IpAddress3[3] > 255)){
                return capi_DispError(objMonitorVideoDestinationAddress, MSG_STATUS.mID_0027 );
            } else if (IpAddress3[0] == 127){
                return capi_DispError(objMonitorVideoDestinationAddress, MSG_STATUS.mID_0027 );
            }else if (IpAddress3[0] == 224 && IpAddress3[1] == 0 && (IpAddress3[2] == 0 || IpAddress3[2] == 1) && (IpAddress3[3] >= 0 || IpAddress3[3] <= 255)){
                return capi_DispError(objMonitorVideoDestinationAddress, MSG_STATUS.mID_0027);
            } else if (IpAddress3[0] == 0 && IpAddress3[1] == 0 && IpAddress3[2] == 0 && IpAddress3[3] == 0 ){
                return capi_DispError(objMonitorVideoDestinationAddress, MSG_STATUS.mID_0027);
            }
            if (!capi_isDigit(inputMainVideoDestinationPort.get())) {
                return capi_DispError(objMainVideoDestinationPort, MSG_STATUS.mID_0010);
            } else if (!(inputMainVideoDestinationPort.get() > 1023 && inputMainVideoDestinationPort.get() < 65536)) {
                return capi_DispError(objMainVideoDestinationPort, MSG_STATUS.mID_0107);
            } else if (inputMainVideoDestinationPort.get() == 10669 || inputMainVideoDestinationPort.get() == 10670){
                return capi_DispError(objMainVideoDestinationPort, MSG_STATUS.mID_0026);
            }
            if (!capi_isDigit(inputCropVideoDestinationPort.get())) {
                return capi_DispError(objCropVideoDestinationPort, MSG_STATUS.mID_0010);
            } else if (!(inputCropVideoDestinationPort.get() > 1023 && inputCropVideoDestinationPort.get() < 65536)) {
                return capi_DispError(objCropVideoDestinationPort, MSG_STATUS.mID_0107);
            } else if (inputCropVideoDestinationPort.get() == 10669 || inputCropVideoDestinationPort.get() == 10670){
                return capi_DispError(objCropVideoDestinationPort, MSG_STATUS.mID_0026);
            }
            if (!capi_isDigit(inputMonitorVideoDestinationPort.get())) {
                return capi_DispError(objMonitorVideoDestinationPort, MSG_STATUS.mID_0010);
            } else if (!(inputMonitorVideoDestinationPort.get() > 1023 && inputMonitorVideoDestinationPort.get() < 65536)) {
                return capi_DispError(objMonitorVideoDestinationPort, MSG_STATUS.mID_0107);
            } else if (inputMonitorVideoDestinationPort.get() == 10669 || inputMonitorVideoDestinationPort.get() == 10670){
                return capi_DispError(objMonitorVideoDestinationPort, MSG_STATUS.mID_0026);
            }
            return true;
        }
        function setVideoData() {
            $("#dialog_setup").show();
            cparam_setMainVideoFormatSelect(selectMainVideoFormat.get());
            $.ajax({
                type: "post",
                url: "/cgi-bin/set_moip_video_tx",
                data: getMoipVideoTxSettingData(),
                success: function (data) {
                    setTimeout(function () {
                        $("#dialog_setup").hide();
                    }, 500);
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    setTimeout(function () {
                        $("#dialog_setup").hide();
                        // jAlert(errorThrown, NPTZ_WORDING.wID_0039);
                        if (errorThrown  == "Bad Request") {
                            jAlert(MSG_STATUS.mID_0079, NPTZ_WORDING.wID_0039);
                        } else {
                            jAlert(errorThrown, NPTZ_WORDING.wID_0039);
                        }
                    }, 500);
                }
            });
        }
        function checkAudioData() {
            const objMic1AudioDestinationAddress = document.getElementById("mic1_audio_destination_address");
            const objMic1AudioDestinationPort = document.getElementById("mic1_audio_destination_port");
            const objMic2AudioDestinationAddress = document.getElementById("mic2_audio_destination_address");
            const objMic2AudioDestinationPort = document.getElementById("mic2_audio_destination_port");
            var IpAddress4 = inputMic1AudioDestinationAddress.get().split(".")
            var IpAddress5 = inputMic2AudioDestinationAddress.get().split(".")
            if (!isRightIpAddress(inputMic1AudioDestinationAddress.get())) {
                return capi_DispError(objMic1AudioDestinationAddress, MSG_STATUS.mID_0010);
            } else if ((IpAddress4[0] < 0 || IpAddress4[0] > 239) || (IpAddress4[1] < 0 || IpAddress4[1] > 255) || (IpAddress4[2] < 0 || IpAddress4[2] > 255) || (IpAddress4[3] < 0 || IpAddress4[3] > 255)){
                return capi_DispError(objMic1AudioDestinationAddress, MSG_STATUS.mID_0027 );
            } else if (IpAddress4[0] == 127){
                return capi_DispError(objMic1AudioDestinationAddress, MSG_STATUS.mID_0027 );
            }else if (IpAddress4[0] == 224 && IpAddress4[1] == 0 && (IpAddress4[2] == 0 || IpAddress4[2] == 1) && (IpAddress4[3] >= 0 || IpAddress4[3] <= 255)){
                return capi_DispError(objMic1AudioDestinationAddress, MSG_STATUS.mID_0027);
            } else if (IpAddress4[0] == 0 && IpAddress4[1] == 0 && IpAddress4[2] == 0 && IpAddress4[3] == 0 ){
                return capi_DispError(objMic1AudioDestinationAddress, MSG_STATUS.mID_0027);
            }
            if (!isRightIpAddress(inputMic2AudioDestinationAddress.get())) {
                return capi_DispError(objMic2AudioDestinationAddress, MSG_STATUS.mID_0010);
            } else if ((IpAddress5[0] < 0 || IpAddress5[0] > 239) || (IpAddress5[1] < 0 || IpAddress5[1] > 255) || (IpAddress5[2] < 0 || IpAddress5[2] > 255) || (IpAddress5[3] < 0 || IpAddress5[3] > 255)){
                return capi_DispError(objMic2AudioDestinationAddress, MSG_STATUS.mID_0027 );
            } else if (IpAddress5[0] == 127){
                return capi_DispError(objMic2AudioDestinationAddress, MSG_STATUS.mID_0027 );
            }else if (IpAddress5[0] == 224 && IpAddress5[1] == 0 && (IpAddress5[2] == 0 || IpAddress5[2] == 1) && (IpAddress5[3] >= 0 || IpAddress5[3] <= 255)){
                return capi_DispError(objMic2AudioDestinationAddress, MSG_STATUS.mID_0027);
            } else if (IpAddress5[0] == 0 && IpAddress5[1] == 0 && IpAddress5[2] == 0 && IpAddress5[3] == 0 ){
                return capi_DispError(objMic2AudioDestinationAddress, MSG_STATUS.mID_0027);
            }
            if (!capi_isDigit(inputMic1AudioDestinationPort.get())) {
                return capi_DispError(objMic1AudioDestinationPort, MSG_STATUS.mID_0010);
            } else if (!(inputMic1AudioDestinationPort.get() > 1023 && inputMic1AudioDestinationPort.get() < 65536)) {
                return capi_DispError(objMic1AudioDestinationPort, MSG_STATUS.mID_0107);
            } else if (inputMic1AudioDestinationPort.get() == 10669 || inputMic1AudioDestinationPort.get() == 10670){
                return capi_DispError(objMic1AudioDestinationPort, MSG_STATUS.mID_0026);
            }
            if (!capi_isDigit(inputMic2AudioDestinationPort.get())) {
                return capi_DispError(objMic2AudioDestinationPort, MSG_STATUS.mID_0010);
            } else if (!(inputMic2AudioDestinationPort.get() > 1023 && inputMic2AudioDestinationPort.get() < 65536)) {
                return capi_DispError(objMic2AudioDestinationPort, MSG_STATUS.mID_0107);
            } else if (inputMic2AudioDestinationPort.get() == 10669 || inputMic2AudioDestinationPort.get() == 10670){
                return capi_DispError(objMic2AudioDestinationPort, MSG_STATUS.mID_0026);
            }
            return true;
        }
        function setAudioData() {
             $("#dialog_setup").show();
            $.ajax({
                type: "post",
                url: "/cgi-bin/set_moip_audio_tx",
                data: getMoipAudioTxSettingData(),
                success: function (data) {
                    setTimeout(function () {
                        $("#dialog_setup").hide();
                    }, 500);
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    setTimeout(function () {
                        $("#dialog_setup").hide();
                        if (errorThrown  == "Bad Request") {
                            jAlert(MSG_STATUS.mID_0079, NPTZ_WORDING.wID_0039);
                        } else {
                            jAlert(errorThrown, NPTZ_WORDING.wID_0039);
                        }
                    }, 500);
                }
            });
        }
        function getMoipVideoTxSettingData() {
            var data = {};
            data['video_tx_ch0_ip_addr'] = inputMainVideoDestinationAddress.get();
            data['video_tx_ch0_port'] = inputMainVideoDestinationPort.get();
            data['video_tx_ch1_ip_addr'] = inputCropVideoDestinationAddress.get();
            data['video_tx_ch1_port'] = inputCropVideoDestinationPort.get();
            data['video_tx_ch2_ip_addr'] = inputMonitorVideoDestinationAddress.get();
            data['video_tx_ch2_port'] = inputMonitorVideoDestinationPort.get();
            return data;
        }
        function getMoipAudioTxSettingData() {
            var data = {};
            data['audio_tx_ch0_ip_addr'] = inputMic1AudioDestinationAddress.get();
            data['audio_tx_ch0_port'] = inputMic1AudioDestinationPort.get();
            data['audio_tx_ch1_ip_addr'] = inputMic2AudioDestinationAddress.get();
            data['audio_tx_ch1_port'] = inputMic2AudioDestinationPort.get();
            return data;
        }
        return {
            build: function () {
                return buildSt2110Tx();
            }
        }
    }

    /**
     * settingJPEG画面:settingJPEG制御に関わる画面クラス
     * @class settingJPEG画面:settingJPEG制御に関わる画面クラス
     * @return {{build: buildSt2110Rx, rebuild: rebuild}} build 構築処理
     * @return {function} rebuild 再構築処理
     * @constructor
     */
    function settingSt2110Rx() {
        /**
         * 構築フラグ
         * @type boolean
         */
        var buildFlagSt2110Rx = false;
        var objMoipVideoRx;
        var objMainVideoValues
        var txtMainVideo;
        var txtReturnVideoFormat;
        var txtMainVideoDestinationAddress;
        var txtMainVideoSourceAddress;
        var txtMainVideoDestinationPort;
        var txtMainVideoDestinationPortMsg;
        // input
        var inputMainVideoDestinationAddress;
        var inputMainVideoSourceAddress;
        var inputMainVideoDestinationPort;

        var selectReturnVideoFormat;

        var St2110_rx_set_button
        let nowfreq = null;
        let sFormat = "";
        let uhdCropRadioDate;
        var SPFMode = cparam_get_SFPMode();
        /**
         *
         * @param type
         * @returns {{}}
         */
        function buildSt2110Rx() {
            objMoipVideoRx = getMoipVideoRx();
            objMainVideoValues = getMoipVideoRxResult(objMoipVideoRx, "video_rx_ch0");
            if (!buildFlagSt2110Rx) {
                nowfreq = cparam_get_frequency();
                sFormat = cparam_get_format();
                uhdCropRadioDate = cparam_get_UHDCrop();
                buildFlagSt2110Rx = true;
                // main video
                txtMainVideo = TextCtrl("setup_mediaOverIp_st2110_rx_label", "setup_mediaOverIP_St2110_rx_main_video_label", NPTZ_WORDING.wiD_0905);
                txtMainVideo.show();
                txtReturnVideoFormat = TextCtrl('setup_mediaOverIp_st2110_rx_label', 'setup_mediaOverIP_St2110_rx_main_video_format_label', NPTZ_WORDING.wID_0196);
                txtReturnVideoFormat.show();
                selectReturnVideoFormat = SelectCtrl("setup_mediaOverIp_st2110_rx_form", "main_video_format", "main_video_format", "setup_mediaOverIP_St2110_rx_main_video_format_select");
                initFormatSelect(selectReturnVideoFormat);
                selectReturnVideoFormat.show();
                selectReturnVideoFormat.displayDisabled();
                txtMainVideoDestinationAddress = TextCtrl("setup_mediaOverIp_st2110_rx_label", "setup_mediaOverIP_St2110_rx_main_video_destination_address_label", NPTZ_WORDING.wID_0690);
                txtMainVideoDestinationAddress.show();
                inputMainVideoDestinationAddress = InputCtrl("setup_mediaOverIp_st2110_rx_form", 'main_video_destination_address_rx', 'main_video_destination_address_rx', 'setup_mediaOverIP_St2110_rx_main_video_destination_address', objMainVideoValues && objMainVideoValues["ip_addr"])
                inputMainVideoDestinationAddress.show();
                inputMainVideoDestinationAddress.displayOff();
                txtMainVideoSourceAddress = TextCtrl("setup_mediaOverIp_st2110_rx_label", "setup_mediaOverIP_St2110_rx_main_video_source_address_label", NPTZ_WORDING.wID_0700);
                txtMainVideoSourceAddress.show();
                inputMainVideoSourceAddress = InputCtrl("setup_mediaOverIp_st2110_rx_form", 'main_video_source_address', 'main_video_source_address', 'setup_mediaOverIP_St2110_rx_main_video_source_address', objMainVideoValues && objMainVideoValues["source_addr"])
                inputMainVideoSourceAddress.show();
                inputMainVideoSourceAddress.displayOff();
                txtMainVideoDestinationPort = TextCtrl("setup_mediaOverIp_st2110_rx_label", "setup_mediaOverIP_St2110_rx_main_video_destination_port_label", NPTZ_WORDING.wID_0691);
                txtMainVideoDestinationPort.show();
                inputMainVideoDestinationPort = InputCtrl("setup_mediaOverIp_st2110_rx_form", 'main_video_destination_port_rx', 'main_video_destination_port_rx', 'setup_mediaOverIP_St2110_rx_main_video_destination_port', objMainVideoValues && objMainVideoValues["port"])
                inputMainVideoDestinationPort.show();
                inputMainVideoDestinationPort.displayOff();
                txtMainVideoDestinationPortMsg = TextCtrl("setup_mediaOverIp_st2110_rx_form", "setup_mediaOverIP_St2110_rx_main_video_destination_port_msg_label", NPTZ_WORDING.wID_0712);
                txtMainVideoDestinationPortMsg.show();
                LineCtrl('setup_mediaOverIp_st2110_rx_main', 'horizontal', 150, 0, "", 'setup_mediaOverIP_St2110_rx_main_video_format', "97.5");
                LineCtrl('setup_mediaOverIp_st2110_rx_main', 'horizontal', 150, 0, "", 'setup_mediaOverIP_St2110_rx_main_video_destination_address', "97.5");
                LineCtrl('setup_mediaOverIp_st2110_rx_main', 'horizontal', 150, 0, "", 'setup_mediaOverIP_St2110_rx_main_video_source_address', "97.5");
                LineCtrl('setup_mediaOverIp_st2110_rx_main', 'horizontal', 150, 0, "", 'setup_mediaOverIP_St2110_rx_main_video_destination_port', "97.5");
                LineCtrl("setup_mediaOverIp_st2110_rx_main", "vertical", 0, 0, 0, "setup_mediaOverIP_St2110_rx_main_video");
                St2110_rx_set_button = ButtonCtrl("setup_mediaOverIp_st2110_rx_form", "setup_mediaOverIp_St2110_rx_set_button", NPTZ_WORDING.wID_0141, callbackSt2110RxSetButton);
                St2110_rx_set_button.getButtonObject().addClass('button_class');
                St2110_rx_set_button.show();
                St2110_rx_set_button.displayOff();

                selectReturnVideoFormat.val(cparam_getReturnVideoFormatSelect());

                if (objMainVideoValues["enable"] == "disable") {
                    selectReturnVideoFormat.displayDisabled();  //#7074 この部分を削除 //#8499この部分を再追加
                    inputMainVideoDestinationAddress.displayDisabled();
                    inputMainVideoSourceAddress.displayDisabled();
                    inputMainVideoDestinationPort.displayDisabled();
                } else {
                    selectReturnVideoFormat.displayOff(); //#7074 この部分を削除 //#8499この部分を再追加
                    inputMainVideoDestinationAddress.displayOff();
                    inputMainVideoSourceAddress.displayOff();
                    inputMainVideoDestinationPort.displayOff();
                }

                if(SPFMode == 2){
                    selectReturnVideoFormat.displayDisabled();
                    inputMainVideoDestinationAddress.displayDisabled();
                    inputMainVideoSourceAddress.displayDisabled();
                    inputMainVideoDestinationPort.displayDisabled();
                    St2110_rx_set_button.displayDisabled();
                }
            } else {
                rebuild();
            }
        }

        function rebuild() {
            inputMainVideoDestinationAddress.set(objMainVideoValues["ip_addr"]);
            inputMainVideoSourceAddress.set(objMainVideoValues["source_addr"]);
            inputMainVideoDestinationPort.set(objMainVideoValues["port"]);
            selectReturnVideoFormat.val(cparam_getReturnVideoFormatSelect());
            nowfreq = cparam_get_frequency();
            sFormat = cparam_get_format();
            uhdCropRadioDate = cparam_get_UHDCrop();
            initFormatSelect(selectReturnVideoFormat);

            if (objMainVideoValues["enable"] == "disable") {
                selectReturnVideoFormat.displayDisabled();  //#7074 この部分を削除 //#8499この部分を再追加
                inputMainVideoDestinationAddress.displayDisabled();
                inputMainVideoSourceAddress.displayDisabled();
                inputMainVideoDestinationPort.displayDisabled();
            } else {
                selectReturnVideoFormat.displayOff(); //#7074 この部分を削除 //#8499この部分を再追加
                inputMainVideoDestinationAddress.displayOff();
                inputMainVideoSourceAddress.displayOff();
                inputMainVideoDestinationPort.displayOff();
            }
            if(SPFMode == 2){
                selectReturnVideoFormat.displayDisabled();
                inputMainVideoDestinationAddress.displayDisabled();
                inputMainVideoSourceAddress.displayDisabled();
                inputMainVideoDestinationPort.displayDisabled();
            }
        }

        function callbackSt2110RxSetButton(mouse) {
            if (mouse == Button.MOUSE_DOWN) {
                if(!checkData()){
                    return false;
                }
                $("#dialog_setup").show();
                cparam_setReturnVideoFormatSelect(selectReturnVideoFormat.get());
                $.ajax({
                    type: "post",
                    url: "/cgi-bin/set_moip_video_rx",
                    data: getSt2110RxData(),
                    success: function (data) {
                        setTimeout(function () {
                            $("#dialog_setup").hide();
                        }, 500);
                    },
                    error: function (jqXHR, textStatus, errorThrown) {
                        setTimeout(function () {
                            $("#dialog_setup").hide();
                            if (errorThrown  == "Bad Request") {
                                jAlert(MSG_STATUS.mID_0079, NPTZ_WORDING.wID_0039);
                            } else {
                                jAlert(errorThrown, NPTZ_WORDING.wID_0039);
                            }
                        }, 500);
                    }
                });
            }
        }

        function initFormatSelect(targetObject){
            let select_system_format_value = [];
            let select_system_format_text = [];
            if (nowfreq == '4') { //60HZ
                if (sFormat == '1F') { //2160/60P
                    if (uhdCropRadioDate == '0') { //Crop Off
                        select_system_format_value = ["20"];
                        select_system_format_text = ["1080/60p"];
                    } else if (uhdCropRadioDate == '1') { //Crop 1080
                        select_system_format_value = ["20"];
                        select_system_format_text = ["1080/60p"];
                    }
                } else if (sFormat == '20') { //1080/60P
                    select_system_format_value = ["20"];
                    select_system_format_text = ["1080/60p"];
                }
            } else if (nowfreq == '0') { //59.94HZ
                if (sFormat == '19') { // 2160/59.94P
                    if (uhdCropRadioDate == '0') {  //Crop Off
                        select_system_format_value = ["10"];
                        select_system_format_text = ["1080/59.94p"];
                    } else if (uhdCropRadioDate == '1') { //Crop 1080
                        select_system_format_value = ["10"];
                        select_system_format_text = ["1080/59.94p"];
                    } else if (uhdCropRadioDate == '2') {
                        select_system_format_value = ["FF"];
                        select_system_format_text = ["-------"];
                    }
                } else if (sFormat == '17') {
                    if (uhdCropRadioDate == '0') {
                        select_system_format_value = ["14"];
                        select_system_format_text = ["1080/29.97p"];
                    } else if (uhdCropRadioDate == '1') {
                        select_system_format_value = ["14"];
                        select_system_format_text = ["1080/29.97p"];
                    }
                } else if (sFormat == '26') {
                    select_system_format_value = ["10"];
                    select_system_format_text = ["1080/59.94p"];
                } else if (sFormat == '10') {
                    select_system_format_value = ["10", "04"];
                    select_system_format_text = ["1080/59.94p", "1080/59.94i"];
                } else if(sFormat == '14'){
                    select_system_format_value = ["14"];
                        select_system_format_text = ["1080/29.97p"];
                } else if (sFormat == '01') {
                    select_system_format_value = ["FF"];
                    select_system_format_text = ["-------"];
                }
            } else if (nowfreq == '1') { //50HZ
                if (sFormat == '1A') {
                    if (uhdCropRadioDate == '0') {
                        select_system_format_value = ["11"];
                        select_system_format_text = ["1080/50p"];
                    } else if (uhdCropRadioDate == '1') {
                        select_system_format_value = ["11"];
                        select_system_format_text = ["1080/50p"];
                    } else if (uhdCropRadioDate == '2') {
                        select_system_format_value = ["FF"];
                        select_system_format_text = ["-------"];
                    }
                } else if (sFormat == '18') {
                    if (uhdCropRadioDate == '0') {
                        select_system_format_value = ["15"];
                        select_system_format_text = ["1080/25p"];
                    } else if (uhdCropRadioDate == '1') {
                        select_system_format_value = ["15"];
                        select_system_format_text = ["1080/25p"];
                    }
                } else if (sFormat == '27') {
                    select_system_format_value = ["11"];
                    select_system_format_text = ["1080/50p"];
                } else if (sFormat == '11') {
                    select_system_format_value = ["11", "05"];
                    select_system_format_text = ["1080/50p", '1080/50i'];
                } else if (sFormat == '15') {
                    select_system_format_value = ["15"];
                    select_system_format_text = ["1080/25p"];
                } else if (sFormat == '02') {
                    select_system_format_value = ["FF"];
                    select_system_format_text = ["-------"];
                }
            } else if (nowfreq == '2') { //24HZ
                if (sFormat == '21') {
                    if (uhdCropRadioDate == '0') {
                        select_system_format_value = ["22"];
                        select_system_format_text = ["1080/24p"];
                    } else if (uhdCropRadioDate == '1') {
                        select_system_format_value = ["22"];
                        select_system_format_text = ["1080/24p"];
                    }
                } else if (sFormat == '22') {
                    select_system_format_value = ["22"];
                    select_system_format_text = ["1080/24p"];
                }
            } else if (nowfreq == '3') { //23.98HZ
                if (sFormat == '1B') {
                    if (uhdCropRadioDate == '0') {
                        select_system_format_value = ["23"];
                        select_system_format_text = ["1080/23.98p"];
                    } else if (uhdCropRadioDate == '1') {
                        select_system_format_value = ["23"];
                        select_system_format_text = ["1080/23.98p"];
                    }
                } else if (sFormat == '23') {
                    select_system_format_value = ["23"];
                    select_system_format_text = ["1080/23.98p"];
                }
            }
            targetObject.appendOptions(select_system_format_value, select_system_format_text);
        }

        function checkData() {
            const objMainVideoDestinationAddress = document.getElementById("main_video_destination_address_rx");
            const objMainVideoSourceAddress = document.getElementById("main_video_source_address");
            const objMainVideoDestinationPort = document.getElementById("main_video_destination_port_rx");
            var IpAddress6 = inputMainVideoDestinationAddress.get().split(".");
            var IpAddress7 = inputMainVideoSourceAddress.get().split(".");
            if (!isRightIpAddress(inputMainVideoDestinationAddress.get())) {
                return capi_DispError(objMainVideoDestinationAddress, MSG_STATUS.mID_0010);
            } else if ((IpAddress6[0] < 224 || IpAddress6[0] > 239) || (IpAddress6[1] < 0 || IpAddress6[1] > 255) || (IpAddress6[2] < 0 || IpAddress6[2] > 255) || (IpAddress6[3] < 0 || IpAddress6[3] > 255)){
                return capi_DispError(objMainVideoDestinationAddress, MSG_STATUS.mID_0027);
            }else if (IpAddress6[0] == 224 && IpAddress6[1] == 0 && (IpAddress6[2] == 0 || IpAddress6[2] == 1) && (IpAddress6[3] >= 0 || IpAddress6[3] <= 255)){
                return capi_DispError(objMainVideoDestinationAddress, MSG_STATUS.mID_0027);
            } else if (IpAddress6[0] == 0 && IpAddress6[1] == 0 && IpAddress6[2] == 0 && IpAddress6[3] == 0 ){
                return capi_DispError(objMainVideoDestinationAddress, MSG_STATUS.mID_0027);
            }
            if (!isRightIpAddress(inputMainVideoSourceAddress.get())) {
                return capi_DispError(objMainVideoSourceAddress, MSG_STATUS.mID_0010);
            } else if ((IpAddress7[0] < 0 || IpAddress7[0] > 223) || (IpAddress7[1] < 0 || IpAddress7[1] > 255) || (IpAddress7[2] < 0 || IpAddress7[2] > 255) || (IpAddress7[3] < 0 || IpAddress6[3] > 255)){
                return capi_DispError(objMainVideoSourceAddress, MSG_STATUS.mID_0027);
            } else if (IpAddress7[0] == 127){
                return capi_DispError(objMainVideoSourceAddress, MSG_STATUS.mID_0027);
            }
            if (!capi_isDigit(inputMainVideoDestinationPort.get())) {
                return capi_DispError(objMainVideoDestinationPort, MSG_STATUS.mID_0010);
            } else if (!(inputMainVideoDestinationPort.get() > 1023 && inputMainVideoDestinationPort.get() < 65536)) {
                return capi_DispError(objMainVideoDestinationPort, MSG_STATUS.mID_0107);
            } else if (inputMainVideoDestinationPort.get() == 10669 || inputMainVideoDestinationPort.get() == 10670){
                return capi_DispError(objMainVideoDestinationPort, MSG_STATUS.mID_0026);
            }
            return true;
        }
        function getSt2110RxData(){
            var data = {};
            data['video_rx_ch0_multicast_addr'] = inputMainVideoDestinationAddress.get();
            data['video_rx_ch0_source_addr'] = inputMainVideoSourceAddress.get();
            data['video_rx_ch0_port'] = inputMainVideoDestinationPort.get();
            return data;
        }
        return {
            build: function () {
                return buildSt2110Rx();
            }
        }
    }

    /**
     * settingJPEG画面:settingJPEG制御に関わる画面クラス
     * @class settingJPEG画面:settingJPEG制御に関わる画面クラス
     * @return {{build}} build 構築処理
     * @return {function} rebuild 再構築処理
     * @constructor
     */
    function settingJpegxsTx() {
         /**
         * 構築フラグ
         * @type boolean
         */
         var buildFlagJpegXsTx = false;
         var jpegXsTxData;
         var txtMainVideo;
         var txtCropVideo;
         var txtReturnVideoSelect;
         var txtReturnVideoFormat;
         var txtMainVideoCompressionRate;
         var txtMainVideoDestinationAddress;
         var txtCropVideoDestinationAddress;
         var txtMainVideoDestinationPort;
         var txtCropVideoDestinationPort;
         var txtMainVideoDestinationPortMsg;
         // input
         var inputMainVideoDestinationAddress;
         var inputCropVideoDestinationAddress
         var inputMainVideoDestinationPort;
         var inputCropVideoDestinationPort
         
         var selectMainVideoFormat;
         var selectCropVideoFormat;
         var selectReturnVideoSelect;
         var selectReturnCropVideoSelect;
         var selectReturnCompressionRate;
 
         var Jpeg_xs_tx_set_button;
         var nowfreq;
         var sFormat;
         var uhdCropRadioDate;
         let select_system_mainvideo_select_value = [];
         let select_system_mainvideo_select_text = [];
         let select_system_format_value = [];
         let select_system_format_text = [];
         let select_system_mainvideo_compression_rate_value = [];
         let select_system_mainvideo_compression_rate_text = [];

         /**
          *
          * @param type
          * @returns {{}}
          */
         function buildJpegXsTx() {
            console.log("Build Jpeg XsTx Start");
             jpegXsTxData = cparams_get_jpeg_xs_video_tx();
             if (!buildFlagJpegXsTx) {
                buildFlagJpegXsTx = true;
                nowfreq = cparam_get_frequency();
                sFormat = cparam_get_format();
                uhdCropRadioDate = cparam_get_UHDCrop();
                 // main video
                 txtMainVideo = TextCtrl("setup_mediaOverIp_jpeg_xs_tx_label", "setup_mediaOverIp_jpeg_xs_tx_main_video_label", NPTZ_WORDING.wID_0916);
                 txtMainVideo.show();
                 txtReturnVideoSelect = TextCtrl('setup_mediaOverIp_jpeg_xs_tx_label', 'setup_mediaOverIP_Jpeg_xs_tx_main_video_select_label', NPTZ_WORDING.wID_0918);
                 txtReturnVideoSelect.show();
                 selectReturnVideoSelect = SelectCtrl("setup_mediaOverIp_jpeg_xs_tx_form", "main_video_format", "main_video_format", "setup_mediaOverIP_Jpeg_xs_tx_main_video_select", videoSelectChangeCallback);
                 initVideoSelect(selectReturnVideoSelect);
                 selectReturnVideoSelect.show();
                 selectReturnVideoSelect.displayOff();
                 txtReturnVideoFormat = TextCtrl('setup_mediaOverIp_jpeg_xs_tx_label', 'setup_mediaOverIP_Jpeg_xs_tx_main_video_format_label', NPTZ_WORDING.wID_0196);
                 txtReturnVideoFormat.show();
                 selectMainVideoFormat = SelectCtrl("setup_mediaOverIp_jpeg_xs_tx_form", "main_video_format", "main_video_format", "setup_mediaOverIP_Jpeg_xs_tx_main_video_format_select", mainVideoFormatSelectChangeCallback);
                 initMainFormatSelect(selectMainVideoFormat, selectReturnVideoSelect.get() == 0);
                 selectMainVideoFormat.show();
                 selectMainVideoFormat.displayOff();
                 txtMainVideoCompressionRate = TextCtrl('setup_mediaOverIp_jpeg_xs_tx_label', 'setup_mediaOverIP_jpeg_xs_tx_Compression_rate_main_video_format_label', NPTZ_WORDING.wID_0919);
                 txtMainVideoCompressionRate.show();
                 selectReturnCompressionRate = SelectCtrl("setup_mediaOverIp_jpeg_xs_tx_form", "main_video_format", "main_video_format", "setup_mediaOverIP_jpeg_xs_tx_Compression_rate_main_video_format_select");
                 //initCompressionrate(selectReturnCompressionRate);
                 selectReturnCompressionRate.show();
                 selectReturnCompressionRate.displayOff();
                 txtMainVideoDestinationAddress = TextCtrl("setup_mediaOverIp_jpeg_xs_tx_label", "setup_mediaOverIP_jpeg_xs_tx_main_video_destination_address_label", NPTZ_WORDING.wID_0690);
                 txtMainVideoDestinationAddress.show();
                 inputMainVideoDestinationAddress = InputCtrl("setup_mediaOverIp_jpeg_xs_tx_form", 'main_video_destination_address_tx', 'main_video_destination_address_tx', 'setup_mediaOverIP_jpeg_xs_tx_main_video_destination_address', "")
                 inputMainVideoDestinationAddress.show();
                 inputMainVideoDestinationAddress.displayOff();
                 txtMainVideoDestinationPort = TextCtrl("setup_mediaOverIp_jpeg_xs_tx_label", "setup_mediaOverIP_Jpeg_xs_tx_main_video_destination_port_label", NPTZ_WORDING.wID_0691);
                 txtMainVideoDestinationPort.show();
                 inputMainVideoDestinationPort = InputCtrl("setup_mediaOverIp_jpeg_xs_tx_form", 'main_video_destination_port_tx', 'main_video_destination_port_tx', 'setup_mediaOverIP_Jpeg_xs_tx_main_video_destination_port', "")
                 inputMainVideoDestinationPort.show();
                 inputMainVideoDestinationPort.displayOff();
                 txtMainVideoDestinationPortMsg = TextCtrl("setup_mediaOverIp_jpeg_xs_tx_form", "setup_mediaOverIP_Jpeg_xs_tx_main_video_destination_port_msg_label", NPTZ_WORDING.wID_0712);
                 txtMainVideoDestinationPortMsg.show();
                 LineCtrl('setup_mediaOverIp_jpeg_xs_tx_main', 'horizontal', 150, 0, "", 'setup_mediaOverIP_Jpeg_xs_tx_main_video_select', "97.5");
                 LineCtrl('setup_mediaOverIp_jpeg_xs_tx_main', 'horizontal', 150, 0, "", 'setup_mediaOverIP_Jpeg_xs_tx_main_video_format', "97.5");
                 LineCtrl('setup_mediaOverIp_jpeg_xs_tx_main', 'horizontal', 150, 0, "", 'setup_mediaOverIP_Jpeg_xs_tx_main_video_compression_rate', "97.5");
                 LineCtrl('setup_mediaOverIp_jpeg_xs_tx_main', 'horizontal', 150, 0, "", 'setup_mediaOverIP_Jpeg_xs_tx_main_video_destination_address', "97.5");
                 LineCtrl('setup_mediaOverIp_jpeg_xs_tx_main', 'horizontal', 150, 0, "", 'setup_mediaOverIP_Jpeg_xs_tx_main_video_destination_port', "97.5");
                 LineCtrl("setup_mediaOverIp_jpeg_xs_tx_main", "vertical", 0, 0, 0, "setup_mediaOverIP_Jpeg_xs_tx_main_video");

                 //selectReturnVideoSelect.val(jpegXsTxData.video_select);
                 initJepgXsTxData();
                //  txtCropVideo = TextCtrl("setup_mediaOverIp_jpeg_xs_tx_label", "setup_mediaOverIp_jpeg_xs_tx_crop_video_label", NPTZ_WORDING.wID_0714);
                //  txtCropVideo.show();
                //  txtReturnVideoSelect = TextCtrl('setup_mediaOverIp_jpeg_xs_tx_label', 'setup_mediaOverIP_Jpeg_xs_tx_crop_video_select_label', NPTZ_WORDING.wID_0918);
                //  txtReturnVideoSelect.show();
                //  selectReturnCropVideoSelect = SelectCtrl("setup_mediaOverIp_jpeg_xs_tx_form", "main_video_format", "main_video_format", "setup_mediaOverIP_Jpeg_xs_tx_crop_video_select");
                //  initCropVideoSelect(selectReturnCropVideoSelect);
                // selectReturnCropVideoSelect.show();
                // selectReturnCropVideoSelect.displayOff();
                //  txtReturnVideoFormat = TextCtrl('setup_mediaOverIp_jpeg_xs_tx_label', 'setup_mediaOverIP_Jpeg_xs_tx_crop_video_format_label', NPTZ_WORDING.wID_0196);
                //  txtReturnVideoFormat.show();
                //  selectCropVideoFormat = SelectCtrl("setup_mediaOverIp_jpeg_xs_tx_form", "main_video_format", "main_video_format", "setup_mediaOverIP_Jpeg_xs_tx_crop_video_format_select");
                //  initCropFormatSelect(selectCropVideoFormat);
                //  selectCropVideoFormat.show();
                //  selectCropVideoFormat.displayOff();
                //  txtMainVideoCompressionRate = TextCtrl('setup_mediaOverIp_jpeg_xs_tx_label', 'setup_mediaOverIP_jpeg_xs_tx_Compression_rate_crop_video_format_label', NPTZ_WORDING.wID_0919);
                //  txtMainVideoCompressionRate.show();
                //  selectReturnCompressionRate = SelectCtrl("setup_mediaOverIp_jpeg_xs_tx_form", "main_video_format", "main_video_format", "setup_mediaOverIP_jpeg_xs_tx_Compression_rate_crop_video_format_select");
                //  initCropCompressionrate(selectReturnCompressionRate);
                //  selectReturnCompressionRate.show();
                //  selectReturnCompressionRate.displayOff();
                //  txtCropVideoDestinationAddress = TextCtrl("setup_mediaOverIp_jpeg_xs_tx_label", "setup_mediaOverIP_jpeg_xs_tx_crop_video_destination_address_label", NPTZ_WORDING.wID_0690);
                //  txtCropVideoDestinationAddress.show();
                //  inputCropVideoDestinationAddress = InputCtrl("setup_mediaOverIp_jpeg_xs_tx_form", 'main_video_destination_address_tx', 'main_video_destination_address_rx', 'setup_mediaOverIP_jpeg_xs_tx_crop_video_destination_address', objMainVideoValues && objMainVideoValues["ip_addr"])
                //  inputCropVideoDestinationAddress.show();
                //  inputCropVideoDestinationAddress.displayOff();
                //  txtCropVideoDestinationPort = TextCtrl("setup_mediaOverIp_jpeg_xs_tx_label", "setup_mediaOverIP_Jpeg_xs_tx_crop_video_destination_port_label", NPTZ_WORDING.wID_0691);
                //  txtCropVideoDestinationPort.show();
                //  inputCropVideoDestinationPort = InputCtrl("setup_mediaOverIp_jpeg_xs_tx_form", 'main_video_destination_port_tx', 'main_video_destination_port_tx', 'setup_mediaOverIP_Jpeg_xs_tx_crop_video_destination_port', objMainVideoValues && objMainVideoValues["port"])
                //  inputCropVideoDestinationPort.show();
                //  inputCropVideoDestinationPort.displayOff();
                //  txtMainVideoDestinationPortMsg = TextCtrl("setup_mediaOverIp_jpeg_xs_tx_form", "setup_mediaOverIP_Jpeg_xs_tx_crop_video_destination_port_msg_label", NPTZ_WORDING.wID_0712);
                //  txtMainVideoDestinationPortMsg.show();
                //  LineCtrl('setup_mediaOverIp_jpeg_xs_tx_main', 'horizontal', 150, 0, "", 'setup_mediaOverIP_Jpeg_xs_tx_crop_video_select', "97.5");
                //  LineCtrl('setup_mediaOverIp_jpeg_xs_tx_main', 'horizontal', 150, 0, "", 'setup_mediaOverIP_Jpeg_xs_tx_crop_video_format', "97.5");
                //  LineCtrl('setup_mediaOverIp_jpeg_xs_tx_main', 'horizontal', 150, 0, "", 'setup_mediaOverIP_Jpeg_xs_tx_crop_video_compression_rate', "97.5");
                //  LineCtrl('setup_mediaOverIp_jpeg_xs_tx_main', 'horizontal', 150, 0, "", 'setup_mediaOverIP_Jpeg_xs_tx_crop_video_destination_address', "97.5");
                //  LineCtrl('setup_mediaOverIp_jpeg_xs_tx_main', 'horizontal', 150, 0, "", 'setup_mediaOverIP_Jpeg_xs_tx_crop_video_destination_port', "97.5");
                //  LineCtrl("setup_mediaOverIp_jpeg_xs_tx_main", "vertical", 0, 0, 0, "setup_mediaOverIP_Jpeg_xs_tx_crop_video");
                 Jpeg_xs_tx_set_button = ButtonCtrl("setup_mediaOverIp_jpeg_xs_tx_form", "setup_mediaOverIp_Jpeg_xs_tx_set_button", NPTZ_WORDING.wID_0141, callbackJpegXsTxSetButton);
                 Jpeg_xs_tx_set_button.getButtonObject().addClass('button_class');
                 Jpeg_xs_tx_set_button.show();
                 Jpeg_xs_tx_set_button.displayOff();
             } else {
                 rebuild();
             }
         }
 
         function rebuild() {
            jpegXsTxData = cparams_get_jpeg_xs_video_tx();
            nowfreq = cparam_get_frequency();
            sFormat = cparam_get_format();
            uhdCropRadioDate = cparam_get_UHDCrop();

            initVideoSelect(selectReturnVideoSelect);
            initMainFormatSelect(selectMainVideoFormat, selectReturnVideoSelect.get() == 0);
            //
            //selectReturnVideoSelect.val(jpegXsTxData.video_select);
            initJepgXsTxData();
            // inputCropVideoDestinationAddress.set(objMainVideoValues["ip_addr"]);
            // inputCropVideoDestinationPort.set(objMainVideoValues["port"]);
           
            //selectCropVideoFormat.val(cparam_getCropVideoFormatSelect());
            // initCropVideoSelect(selectReturnCropVideoSelect);
            // initCropFormatSelect(selectCropVideoFormat);
            // initCropCompressionrate(selectReturnCompressionRate);
         }

        function initJepgXsTxData() {
            var index = select_system_mainvideo_select_text.indexOf(jpegXsTxData.video_select);
            if(index > -1){
                selectReturnVideoSelect.val(select_system_mainvideo_select_value[index]);
            }

            setJpegXsTxInfo(jpegXsTxData.video_select);
        }

        function setJpegXsTxInfo(select_data){
            jpegXsTxData = cparams_get_jpeg_xs_video_tx();
            if (select_data == "MAIN") {
                var formatIndex = select_system_format_text.indexOf(jpegXsTxData.ch0_format);
                if(formatIndex > -1){
                    selectMainVideoFormat.val(select_system_format_value[formatIndex]);
                    //sFormat = select_system_format_value[formatIndex];
                } else {
                    selectMainVideoFormat.val(select_system_format_value[0]);
                }

                initCompressionrate(selectReturnCompressionRate);

                var compressionRateIndex = select_system_mainvideo_compression_rate_text.indexOf(jpegXsTxData.ch0_compression_rate);
                if (compressionRateIndex > -1) {
                    selectReturnCompressionRate.val(select_system_mainvideo_compression_rate_value[compressionRateIndex]);
                } else {
                    selectReturnCompressionRate.val(select_system_mainvideo_compression_rate_value[0]);
                }

                inputMainVideoDestinationAddress.set(jpegXsTxData.ch0_ip_addr);
                inputMainVideoDestinationPort.set(jpegXsTxData.ch0_port);
            } else {
                var formatIndex = select_system_format_text.indexOf(jpegXsTxData.ch1_format);
                if(formatIndex > -1){
                    selectMainVideoFormat.val(select_system_format_value[formatIndex]);
                    //sFormat = select_system_format_value[formatIndex];
                } else {
                    selectMainVideoFormat.val(select_system_format_value[0]);
                }
                initCompressionrate(selectReturnCompressionRate);

                var compressionRateIndex = select_system_mainvideo_compression_rate_text.indexOf(jpegXsTxData.ch1_compression_rate);
                if (compressionRateIndex > -1) {
                    selectReturnCompressionRate.val(select_system_mainvideo_compression_rate_value[compressionRateIndex]);
                } else {
                    selectReturnCompressionRate.val(select_system_mainvideo_compression_rate_value[0]);
                }

                inputMainVideoDestinationAddress.set(jpegXsTxData.ch1_ip_addr);
                inputMainVideoDestinationPort.set(jpegXsTxData.ch1_port);
            }
        }

        function callbackJpegXsTxSetButton(mouse) {
            if (mouse == Button.MOUSE_DOWN) {
                if (!checkData()) {
                    return false;
                }
                $("#dialog_setup").show();
                $.ajax({
                    type: "post",
                    url: "/cgi-bin/set_jpeg-xs_video_tx",
                    data: getJPEGXSTXData(),
                    success: function (data) {
                        setTimeout(function () {
                            $("#dialog_setup").hide();
                        }, 500);
                    },
                    error: function (jqXHR, textStatus, errorThrown) {
                        setTimeout(function () {
                            $("#dialog_setup").hide();
                            if (errorThrown == "Bad Request") {
                                jAlert(MSG_STATUS.mID_0079, NPTZ_WORDING.wID_0039);
                            } else {
                                jAlert(errorThrown, NPTZ_WORDING.wID_0039);
                            }
                        }, 500);
                    }
                });
            }
        }

        function mainVideoFormatSelectChangeCallback(){
            initCompressionrate(selectReturnCompressionRate);
        }

        function videoSelectChangeCallback() {
            initMainFormatSelect(selectMainVideoFormat, selectReturnVideoSelect.get() == 0);
            var index = select_system_mainvideo_select_value.indexOf(selectReturnVideoSelect.get());
            setJpegXsTxInfo(select_system_mainvideo_select_text[index]);
        }

         function initVideoSelect(targetObject){
            select_system_mainvideo_select_value = ["0","1"];
            select_system_mainvideo_select_text = ["MAIN","CROP"];
            targetObject.appendOptions(select_system_mainvideo_select_value, select_system_mainvideo_select_text);

            if(uhdCropRadioDate != 2){
                targetObject.displayOff();
            } else {
                targetObject.displayDisabled();
            }
         }

        function initCompressionrate(targetObject){
            var val = selectMainVideoFormat.get();

            if( val == '20'||val == '10'||val == '14'||val == '04'||val == '11'||val == '15'||val == '05'||val == '22'||val == '23'){
                select_system_mainvideo_compression_rate_value = ['0','1','2','3'];
                select_system_mainvideo_compression_rate_text = ["4:1","6:1","10:1","15:1"];
            } else if( val== '1F' || val == '19' || val == '17' || val == '1A' || val == '18' || val == '21' || val == '1B'){
                select_system_mainvideo_compression_rate_value = ['0','1','2','3'];
                select_system_mainvideo_compression_rate_text = ["5:1","8:1","12:1","20:1"];
            }
            targetObject.appendOptions(select_system_mainvideo_compression_rate_value, select_system_mainvideo_compression_rate_text);
        }
        // var CropCompressionrate = '1F';
        // function initCropCompressionrate(targetObject){
        //     let select_system_cropvideo_compression_rate_value = [];
        //     let select_system_cropvideo_compression_rate_text = [];
        //     if( CropCompressionrate == '20'||CropCompressionrate == '10'||CropCompressionrate == '14'||CropCompressionrate == '04'||CropCompressionrate == '11'||CropCompressionrate == '15'||CropCompressionrate == '05'||CropCompressionrate == '22'||CropCompressionrate == '23'){
        //         select_system_cropvideo_compression_rate_value = ['0','1','2','3'];
        //         select_system_cropvideo_compression_rate_text = ["4:1","6:1","10:1","15:1"];
        //     } else if( CropCompressionrate== '1F' || CropCompressionrate == '19' || CropCompressionrate == '17' || CropCompressionrate == '1A' || CropCompressionrate == '18' || CropCompressionrate == '21' || CropCompressionrate == '1B'){
        //         select_system_cropvideo_compression_rate_value = ['0','1','2','3'];
        //         select_system_cropvideo_compression_rate_text = ["5:1","8:1","12:1","20:1"];
        //     }
        //     targetObject.appendOptions(select_system_cropvideo_compression_rate_value, select_system_cropvideo_compression_rate_text);
        // }

        function initMainFormatSelect(targetObject, isMainCrop) {
            if (nowfreq == '4') { //60Hz
                if (sFormat == '1F') { //2160/60p
                    if (uhdCropRadioDate == '0') {
                        select_system_format_value = ["1F", "20"];
                        select_system_format_text = ["2160/60p", "1080/60p"];
                    } else if (uhdCropRadioDate == '1') { //Crop(1080)
                        if(isMainCrop){
                            select_system_format_value = ["1F", "20"];
                            select_system_format_text = ["2160/60p", "1080/60p"];
                        } else {
                            select_system_format_value = ["20"];
                            select_system_format_text = ["1080/60p"];
                        }
                    }
                }
            } else if (nowfreq == '0') {
                if (sFormat == '19') {
                    if (uhdCropRadioDate == '0') {
                        select_system_format_value = ["19", "10"];
                        select_system_format_text = ["2160/59.94p", "1080/59.94p"];
                    } else if (uhdCropRadioDate == '1') {
                        if (isMainCrop) {
                            select_system_format_value = ["19", "10"];
                            select_system_format_text = ["2160/59.94p", "1080/59.94p"];
                        } else {
                            select_system_format_value = ["10"];
                            select_system_format_text = ["1080/59.94p"];
                        }
                    } else if (uhdCropRadioDate == '2') {
                        select_system_format_value = ["FF"];
                        select_system_format_text = ["-------"];
                    }
                } else if (sFormat == '17') {
                    if (uhdCropRadioDate == '0') {
                        select_system_format_value = ["17", "14"];
                        select_system_format_text = ["2160/29.97p", "1080/29.97p"];
                    } else if (uhdCropRadioDate == '1') {
                        if (isMainCrop) {
                            select_system_format_value = ["17", "14"];
                            select_system_format_text = ["2160/29.97p", "1080/29.97p"];
                        } else {
                            select_system_format_value = ["14"];
                            select_system_format_text = ["1080/29.97p"];
                        }
                    }
                } else if (sFormat == '26') {
                    select_system_format_value = ["10"];
                    select_system_format_text = ["1080/59.94p"];
                } else if (sFormat == '10') {
                    select_system_format_value = ["10"];
                    select_system_format_text = ["1080/59.94p"];
                }else if(sFormat == '14'){
                    select_system_format_value = ["14"];
                        select_system_format_text = ["1080/29.97p"];
                } else if (sFormat == '01') {
                    select_system_format_value = ["FF"];
                    select_system_format_text = ["-------"];
                }
            } else if (nowfreq == '1') {
                if (sFormat == '1A') {
                    if (uhdCropRadioDate == '0') {
                        select_system_format_value = ["1A", "11"];
                        select_system_format_text = ["2160/50p", "1080/50p"];
                    } else if (uhdCropRadioDate == '1') {
                        if (isMainCrop) {
                            select_system_format_value = ["1A", "11"];
                            select_system_format_text = ["2160/50p", "1080/50p"];
                        } else {
                            select_system_format_value = ["11"];
                            select_system_format_text = ["1080/50p"];
                        }
                    } else if (uhdCropRadioDate == '2') {
                        select_system_format_value = ["FF"];
                        select_system_format_text = ["-------"];
                    }
                } else if (sFormat == '18') {
                    if (uhdCropRadioDate == '0') {
                        select_system_format_value = ["18", "15"];
                        select_system_format_text = ["2160/25p", "1080/25p"];
                    } else if (uhdCropRadioDate == '1') {
                        if (isMainCrop) {
                            select_system_format_value = ["18", "15"];
                            select_system_format_text = ["2160/25p", "1080/25p"];
                        } else {
                            select_system_format_value = ["15"];
                            select_system_format_text = ["1080/25p"];
                        }
                    }
                } else if (sFormat == '27') {
                    select_system_format_value = ["11"];
                    select_system_format_text = ["1080/50p"];
                } else if (sFormat == '11') {
                    select_system_format_value = ["11"];
                    select_system_format_text = ["1080/50p"];
                } else if (sFormat == '15') {
                    select_system_format_value = ["15"];
                    select_system_format_text = ["1080/25p"];
                } else if (sFormat == '02') {
                    select_system_format_value = ["FF"];
                    select_system_format_text = ["-------"];
                }
            } else if (nowfreq == '2') {
                if (sFormat == '21') {
                    if (uhdCropRadioDate == '0') {
                        select_system_format_value = ["21","22"];
                        select_system_format_text = ["2160/24p","1080/24p"];
                    } else if (uhdCropRadioDate == '1') {
                        if (isMainCrop) {
                            select_system_format_value = ["21", "22"];
                            select_system_format_text = ["2160/24p", "1080/24p"];
                        } else {
                            select_system_format_value = ["22"];
                            select_system_format_text = ["1080/24p"];
                        }
                    }
                } else if (sFormat == '22') {
                    select_system_format_value = ["22"];
                    select_system_format_text = ["1080/24p"];
                }
            } else if (nowfreq == '3') {
                if (sFormat == '1B') {
                    if (uhdCropRadioDate == '0') {
                        select_system_format_value = ["1B","23"];
                        select_system_format_text = ["2160/23.98p","1080/23.98p"];
                    } else if (uhdCropRadioDate == '1') {
                        if (isMainCrop) {
                            select_system_format_value = ["1B", "23"];
                            select_system_format_text = ["2160/23.98p", "1080/23.98p"];
                        } else {
                            select_system_format_value = ["23"];
                            select_system_format_text = ["1080/23.98p"];
                        }
                    }
                } else if (sFormat == '23') {
                    select_system_format_value = ["23"];
                    select_system_format_text = ["1080/23.98p"];
                }
            }
            targetObject.appendOptions(select_system_format_value, select_system_format_text);
        }
 
        function checkData() {
            const objMainVideoDestinationAddress = document.getElementById("main_video_destination_address_tx");
            const objMainVideoDestinationPort = document.getElementById("main_video_destination_port_tx");
            var IpAddress1 = inputMainVideoDestinationAddress.get().split(".");
            // if (!chknet_IsValidIpAddress(inputMainVideoDestinationAddress.get())) {
            //     return capi_DispError(objMainVideoDestinationAddress, MSG_STATUS.mID_0027);
            // }
            if (!isRightIpAddress(inputMainVideoDestinationAddress.get())) {
                return capi_DispError(objMainVideoDestinationAddress, MSG_STATUS.mID_0010);
            } else if ((IpAddress1[0] < 0 || IpAddress1[0] > 239) || (IpAddress1[1] < 0 || IpAddress1[1] > 255) || (IpAddress1[2] < 0 || IpAddress1[2] > 255) || (IpAddress1[3] < 0 || IpAddress1[3] > 255)){
                return capi_DispError(objMainVideoDestinationAddress, MSG_STATUS.mID_0027 );
            } else if (IpAddress1[0] == 127){
                return capi_DispError(objMainVideoDestinationAddress, MSG_STATUS.mID_0027 );
            }else if (IpAddress1[0] == 224 && IpAddress1[1] == 0 && (IpAddress1[2] == 0 || IpAddress1[2] == 1) && (IpAddress1[3] >= 0 || IpAddress1[3] <= 255)){
                return capi_DispError(objMainVideoDestinationAddress, MSG_STATUS.mID_0027);
            } else if (IpAddress1[0] == 0 && IpAddress1[1] == 0 && IpAddress1[2] == 0 && IpAddress1[3] == 0 ){
                return capi_DispError(objMainVideoDestinationAddress, MSG_STATUS.mID_0027);
            }

            if (!capi_isDigit(inputMainVideoDestinationPort.get())) {
                return capi_DispError(objMainVideoDestinationPort, MSG_STATUS.mID_0010);
            } else if (!(inputMainVideoDestinationPort.get() > 1023 && inputMainVideoDestinationPort.get() < 65536)) {
                return capi_DispError(objMainVideoDestinationPort, MSG_STATUS.mID_0107);
            } else if (inputMainVideoDestinationPort.get() == 10669 || inputMainVideoDestinationPort.get() == 10670) {
                return capi_DispError(objMainVideoDestinationPort, MSG_STATUS.mID_0026);
            }
            return true;
        }

        function getJPEGXSTXData() {
            var data = {};
            var videoIndex = select_system_mainvideo_select_value .indexOf(selectReturnVideoSelect.get());
            data['video_select'] = select_system_mainvideo_select_text[videoIndex];

            if (uhdCropRadioDate === 0) { //CROP = OFFの場合は、MAIN映像のみ出力なので、Ch0の情報を参照となります。
                
                data['video_select'] = "MAIN";
                var formatIndex = select_system_format_value.indexOf(selectMainVideoFormat.get());
                data['ch0_format'] = select_system_format_text[formatIndex];
                var rateIndex = select_system_mainvideo_compression_rate_value.indexOf(selectReturnCompressionRate.get());
                data['ch0_compression_rate'] = select_system_mainvideo_compression_rate_text[rateIndex];
                data['ch0_ip_addr'] = inputMainVideoDestinationAddress.get();
                data['ch0_port'] = inputMainVideoDestinationPort.get();
            } else {
                if (data['video_select'] === "MAIN") {
                    var formatIndex = select_system_format_value.indexOf(selectMainVideoFormat.get());
                    data['ch0_format'] = select_system_format_text[formatIndex];
                    var rateIndex = select_system_mainvideo_compression_rate_value.indexOf(selectReturnCompressionRate.get());
                    data['ch0_compression_rate'] = select_system_mainvideo_compression_rate_text[rateIndex];
                    data['ch0_ip_addr'] = inputMainVideoDestinationAddress.get();
                    data['ch0_port'] = inputMainVideoDestinationPort.get();
                } else {
                    data['ch0_format'] = jpegXsTxData.ch0_format;
                    data['ch0_compression_rate'] = jpegXsTxData.ch0_compression_rate;
                    data['ch0_ip_addr'] = jpegXsTxData.ch0_ip_addr;
                    data['ch0_port'] = jpegXsTxData.ch0_port;
                    var formatIndex = select_system_format_value.indexOf(selectMainVideoFormat.get());
                    data['ch1_format'] = select_system_format_text[formatIndex];
                    var rateIndex = select_system_mainvideo_compression_rate_value.indexOf(selectReturnCompressionRate.get());
                    data['ch1_compression_rate'] = select_system_mainvideo_compression_rate_text[rateIndex];
                    data['ch1_ip_addr'] = inputMainVideoDestinationAddress.get();
                    data['ch1_port'] = inputMainVideoDestinationPort.get();
                }
            }

            return data;
        }

        function getJPEGXSTXInfo() {
            jpegXsTxData = cparams_get_jpeg_xs_video_tx();
            var data = {};
            data.video_select = jpegXsTxData.video_select;

            if (uhdCropRadioDate === 0) {
                data.video_select = "MAIN";
                data.enable = jpegXsTxData.ch0_enable;
                data.format = jpegXsTxData.ch0_format;
                data.comp_rate = jpegXsTxData.ch0_compression_rate;
                data.dest_addr = jpegXsTxData.ch0_ip_addr;
                data.dest_port = jpegXsTxData.ch0_port;
            } else {
                if (jpegXsTxData.video_select == "MAIN") {
                    data.enable = jpegXsTxData.ch0_enable;
                    data.format = jpegXsTxData.ch0_format;
                    data.comp_rate = jpegXsTxData.ch0_compression_rate;
                    data.dest_addr = jpegXsTxData.ch0_ip_addr;
                    data.dest_port = jpegXsTxData.ch0_port;
                } else {
                    data.enable = jpegXsTxData.ch1_enable;
                    data.format = jpegXsTxData.ch1_format;
                    data.comp_rate = jpegXsTxData.ch1_compression_rate;
                    data.dest_addr = jpegXsTxData.ch1_ip_addr;
                    data.dest_port = jpegXsTxData.ch1_port;
                }
            }

            return data;
        }

         return {
             build: function () {
                 return buildJpegXsTx();
             },
             getJPEGXSTXInfo
         }
    }
    /**
     * settingJPEG画面:settingJPEG制御に関わる画面クラス
     * @class settingJPEG画面:settingJPEG制御に関わる画面クラス
     * @return {{build}} build 構築処理
     * @return {function} rebuild 再構築処理
     * @constructor
     */
    function settingJpegxsRx() {
        /**
         * 構築フラグ
         * @type boolean
         */
        var buildFlagJpegXsRx = false;
        var objJpegXsRxData;
        var txtMainVideo;
        var txtReturnVideoFormat;
        var txtMainVideoDestinationAddress;
        var txtMainVideoSourceAddress;
        var txtMainVideoDestinationPort;
        var txtMainVideoDestinationPortMsg;
        // input
        var inputMainVideoDestinationAddress;
        var inputMainVideoSourceAddress;
        var inputMainVideoDestinationPort;

        var selectReturnVideoFormat;

        var Jpeg_xs_rx_set_button

        let nowfreq = null;
        let sFormat = "";
        let uhdCropRadioDate;
        let select_system_format_value = [];
        let select_system_format_text = [];
        /**
         *
         * @param type
         * @returns {{}}
         */
        function buildJpegxsRx() {
            objJpegXsRxData = cparam_get_jpeg_xs_video_rx();
            if (!buildFlagJpegXsRx) {
                nowfreq = cparam_get_frequency();
                sFormat = cparam_get_format();
                uhdCropRadioDate = cparam_get_UHDCrop();
                buildFlagJpegXsRx = true;
                // main video
                txtMainVideo = TextCtrl("setup_mediaOverIp_jpeg_xs_rx_label", "setup_mediaOverIP_Jpeg_xs_rx_main_video_label", NPTZ_WORDING.wiD_0905);
                txtMainVideo.show();
                txtReturnVideoFormat = TextCtrl('setup_mediaOverIp_jpeg_xs_rx_label', 'setup_mediaOverIP_Jpeg_xs_rx_main_video_format_label', NPTZ_WORDING.wID_0196);
                txtReturnVideoFormat.show();
                selectReturnVideoFormat = SelectCtrl("setup_mediaOverIp_jpeg_xs_rx_form", "main_video_format", "main_video_format", "setup_mediaOverIP_Jpeg_xs_rx_main_video_format_select");
                initFormatSelect(selectReturnVideoFormat);
                selectReturnVideoFormat.show();
                selectReturnVideoFormat.displayOff();
                txtMainVideoDestinationAddress = TextCtrl("setup_mediaOverIp_jpeg_xs_rx_label", "setup_mediaOverIP_Jpeg_xs_rx_main_video_destination_address_label", NPTZ_WORDING.wID_0690);
                txtMainVideoDestinationAddress.show();
                inputMainVideoDestinationAddress = InputCtrl("setup_mediaOverIp_jpeg_xs_rx_form", 'main_video_destination_address_rx', 'main_video_destination_address_rx', 'setup_mediaOverIP_Jpeg_xs_rx_main_video_destination_address', "")
                inputMainVideoDestinationAddress.show();
                inputMainVideoDestinationAddress.displayOff();
                txtMainVideoSourceAddress = TextCtrl("setup_mediaOverIp_jpeg_xs_rx_label", "setup_mediaOverIP_Jpeg_xs_rx_main_video_source_address_label", NPTZ_WORDING.wID_0700);
                txtMainVideoSourceAddress.show();
                inputMainVideoSourceAddress = InputCtrl("setup_mediaOverIp_jpeg_xs_rx_form", 'main_video_source_address', 'main_video_source_address', 'setup_mediaOverIP_Jpeg_xs_rx_main_video_source_address', "")
                inputMainVideoSourceAddress.show();
                inputMainVideoSourceAddress.displayOff();
                txtMainVideoDestinationPort = TextCtrl("setup_mediaOverIp_jpeg_xs_rx_label", "setup_mediaOverIP_Jpeg_xs_rx_main_video_destination_port_label", NPTZ_WORDING.wID_0691);
                txtMainVideoDestinationPort.show();
                inputMainVideoDestinationPort = InputCtrl("setup_mediaOverIp_jpeg_xs_rx_form", 'main_video_destination_port_rx', 'main_video_destination_port_rx', 'setup_mediaOverIP_Jpeg_xs_rx_main_video_destination_port', "")
                inputMainVideoDestinationPort.show();
                inputMainVideoDestinationPort.displayOff();
                txtMainVideoDestinationPortMsg = TextCtrl("setup_mediaOverIp_jpeg_xs_rx_form", "setup_mediaOverIP_Jpeg_xs_rx_main_video_destination_port_msg_label", NPTZ_WORDING.wID_0712);
                txtMainVideoDestinationPortMsg.show();
                LineCtrl('setup_mediaOverIp_jpeg_xs_rx_main', 'horizontal', 150, 0, "", 'setup_mediaOverIP_Jpeg_xs_rx_main_video_format', "97.5");
                LineCtrl('setup_mediaOverIp_jpeg_xs_rx_main', 'horizontal', 150, 0, "", 'setup_mediaOverIP_Jpeg_xs_rx_main_video_destination_address', "97.5");
                LineCtrl('setup_mediaOverIp_jpeg_xs_rx_main', 'horizontal', 150, 0, "", 'setup_mediaOverIP_Jpeg_xs_rx_main_video_source_address', "97.5");
                LineCtrl('setup_mediaOverIp_jpeg_xs_rx_main', 'horizontal', 150, 0, "", 'setup_mediaOverIP_Jpeg_xs_rx_main_video_destination_port', "97.5");
                LineCtrl("setup_mediaOverIp_jpeg_xs_rx_main", "vertical", 0, 0, 0, "setup_mediaOverIP_Jpeg_xs_rx_main_video");
                Jpeg_xs_rx_set_button = ButtonCtrl("setup_mediaOverIp_jpeg_xs_rx_form", "setup_mediaOverIp_Jpeg_xs_rx_set_button", NPTZ_WORDING.wID_0141, callbackJpegXsRxSetButton);
                Jpeg_xs_rx_set_button.getButtonObject().addClass('button_class');
                Jpeg_xs_rx_set_button.show();
                Jpeg_xs_rx_set_button.displayOff();
                //selectReturnVideoFormat.val(cparam_getReturnVideoFormatSelect);
                initJepgXsRxData();
            } else {
                rebuild();
            }
        }

        function rebuild() {
            objJpegXsRxData = cparam_get_jpeg_xs_video_rx();
            nowfreq = cparam_get_frequency();
            sFormat = cparam_get_format();
            uhdCropRadioDate = cparam_get_UHDCrop();

            initFormatSelect(selectReturnVideoFormat);
            initJepgXsRxData();
        }

        function callbackJpegXsRxSetButton(mouse) {
            if (mouse == Button.MOUSE_DOWN) {
                if(!checkData()){
                    return false;
                }
                $("#dialog_setup").show();
                $.ajax({
                    type: "post",
                    url: "/cgi-bin/set_jpeg-xs_video_rx",
                    data: getJPEGXSRXData(),
                    success: function (data) {
                        setTimeout(function () {
                            $("#dialog_setup").hide();
                        }, 500);
                    },
                    error: function (jqXHR, textStatus, errorThrown) {
                        setTimeout(function () {
                            $("#dialog_setup").hide();
                            if (errorThrown  == "Bad Request") {
                                jAlert(MSG_STATUS.mID_0079, NPTZ_WORDING.wID_0039);
                            } else {
                                jAlert(errorThrown, NPTZ_WORDING.wID_0039);
                            }
                        }, 500);
                    }
                });
            }
        }

        function initJepgXsRxData() {
            var index = select_system_format_text.indexOf(objJpegXsRxData.ch0_format);
            if(index > -1){
                selectReturnVideoFormat.val(select_system_format_value[index]);
            }
         
            inputMainVideoDestinationAddress.val(objJpegXsRxData.ch0_multicast_addr);
            inputMainVideoSourceAddress.set(objJpegXsRxData.ch0_source_addr);
            inputMainVideoDestinationPort.set(objJpegXsRxData.ch0_port);
        }

        function initFormatSelect(targetObject) {
            if (nowfreq == '4') {
                if (sFormat == '1F') {
                    if (uhdCropRadioDate == '0') {
                        select_system_format_value = ["20"];
                        select_system_format_text = ["1080/60p"];
                    } else if (uhdCropRadioDate == '1') {
                        select_system_format_value = ["20"];
                        select_system_format_text = ["1080/60p"];
                    }
                } else if (sFormat == '20') {
                    select_system_format_value = ["20"];
                    select_system_format_text = ["1080/60p"];
                }
            } else if (nowfreq == '0') {
                if (sFormat == '19') {
                    if (uhdCropRadioDate == '0') {
                        select_system_format_value = ["10"];
                        select_system_format_text = ["1080/59.94p"];
                    } else if (uhdCropRadioDate == '1') {
                        select_system_format_value = ["10"];
                        select_system_format_text = ["1080/59.94p"];
                    } else if (uhdCropRadioDate == '2') {
                        select_system_format_value = ["FF"];
                        select_system_format_text = ["-------"];
                    }
                } else if (sFormat == '17') {
                    if (uhdCropRadioDate == '0') {
                        select_system_format_value = ["14"];
                        select_system_format_text = ["1080/29.97p"];
                    } else if (uhdCropRadioDate == '1') {
                        select_system_format_value = ["14"];
                        select_system_format_text = ["1080/29.97p"];
                    }
                } else if (sFormat == '26') {
                    select_system_format_value = ["10"];
                    select_system_format_text = ["1080/59.94p"];
                } else if (sFormat == '10') {
                    select_system_format_value = ["10", "04"];
                    select_system_format_text = ["1080/59.94p", "1080/59.94i"];
                } else if(sFormat == '14'){
                    select_system_format_value = ["14"];
                        select_system_format_text = ["1080/29.97p"];
                } else if (sFormat == '01') {
                    select_system_format_value = ["FF"];
                    select_system_format_text = ["-------"];
                }
            } else if (nowfreq == '1') {
                if (sFormat == '1A') {
                    if (uhdCropRadioDate == '0') {
                        select_system_format_value = ["11"];
                        select_system_format_text = ["1080/50p"];
                    } else if (uhdCropRadioDate == '1') {
                        select_system_format_value = ["11"];
                        select_system_format_text = ["1080/50p"];
                    } else if (uhdCropRadioDate == '2') {
                        select_system_format_value = ["FF"];
                        select_system_format_text = ["-------"];
                    }
                } else if (sFormat == '18') {
                    if (uhdCropRadioDate == '0') {
                        select_system_format_value = ["15"];
                        select_system_format_text = ["1080/25p"];
                    } else if (uhdCropRadioDate == '1') {
                        select_system_format_value = ["15"];
                        select_system_format_text = ["1080/25p"];
                    }
                } else if (sFormat == '27') {
                    select_system_format_value = ["11"];
                    select_system_format_text = ["1080/50p"];
                } else if (sFormat == '11') {
                    select_system_format_value = ["11", "05"];
                    select_system_format_text = ["1080/50p", '1080/50i'];
                } else if (sFormat == '15') {
                    select_system_format_value = ["15"];
                    select_system_format_text = ["1080/25p"];
                } else if (sFormat == '02') {
                    select_system_format_value = ["FF"];
                    select_system_format_text = ["-------"];
                }
            } else if (nowfreq == '2') {
                if (sFormat == '21') {
                    if (uhdCropRadioDate == '0') {
                        select_system_format_value = ["22"];
                        select_system_format_text = ["1080/24p"];
                    } else if (uhdCropRadioDate == '1') {
                        select_system_format_value = ["22"];
                        select_system_format_text = ["1080/24p"];
                    }
                } else if (sFormat == '22') {
                    select_system_format_value = ["22"];
                    select_system_format_text = ["1080/24p"];
                }
            } else if (nowfreq == '3') {
                if (sFormat == '1B') {
                    if (uhdCropRadioDate == '0') {
                        select_system_format_value = ["23"];
                        select_system_format_text = ["1080/23.98p"];
                    } else if (uhdCropRadioDate == '1') {
                        select_system_format_value = ["23"];
                        select_system_format_text = ["1080/23.98p"];
                    }
                } else if (sFormat == '23') {
                    select_system_format_value = ["23"];
                    select_system_format_text = ["1080/23.98p"];
                }
            }
            targetObject.appendOptions(select_system_format_value, select_system_format_text);
        }

        function checkData() {
            const objMainVideoDestinationAddress = document.getElementById("main_video_destination_address_rx");
            const objMainVideoSourceAddress = document.getElementById("main_video_source_address");
            const objMainVideoDestinationPort = document.getElementById("main_video_destination_port_rx");
            var IpAddress6 = inputMainVideoDestinationAddress.get().split(".");
            var IpAddress7 = inputMainVideoSourceAddress.get().split(".");
            if (!isRightIpAddress(inputMainVideoDestinationAddress.get())) {
                return capi_DispError(objMainVideoDestinationAddress, MSG_STATUS.mID_0010);
            } else if ((IpAddress6[0] < 0 || IpAddress6[0] > 239) || (IpAddress6[1] < 0 || IpAddress6[1] > 255) || (IpAddress6[2] < 0 || IpAddress6[2] > 255) || (IpAddress6[3] < 0 || IpAddress6[3] > 255)){
                return capi_DispError(objMainVideoDestinationAddress, MSG_STATUS.mID_0027 );
            } else if (IpAddress6[0] == 127){
                return capi_DispError(objMainVideoDestinationAddress, MSG_STATUS.mID_0027 );
            }else if (IpAddress6[0] == 224 && IpAddress6[1] == 0 && (IpAddress6[2] == 0 || IpAddress6[2] == 1) && (IpAddress6[3] >= 0 || IpAddress6[3] <= 255)){
                return capi_DispError(objMainVideoDestinationAddress, MSG_STATUS.mID_0027);
            } else if (IpAddress6[0] == 0 && IpAddress6[1] == 0 && IpAddress6[2] == 0 && IpAddress6[3] == 0 ){
                return capi_DispError(objMainVideoDestinationAddress, MSG_STATUS.mID_0027);
            }

            if (!isRightIpAddress(inputMainVideoSourceAddress.get())) {
                return capi_DispError(objMainVideoSourceAddress, MSG_STATUS.mID_0010);
            } else if ((IpAddress7[0] < 0 || IpAddress7[0] > 239) || (IpAddress7[1] < 0 || IpAddress7[1] > 255) || (IpAddress7[2] < 0 || IpAddress7[2] > 255) || (IpAddress7[3] < 0 || IpAddress7[3] > 255)){
                return capi_DispError(objMainVideoSourceAddress, MSG_STATUS.mID_0027 );
            } else if (IpAddress7[0] == 127){
                return capi_DispError(objMainVideoSourceAddress, MSG_STATUS.mID_0027 );
            }else if (IpAddress7[0] == 224 && IpAddress7[1] == 0 && (IpAddress7[2] == 0 || IpAddress7[2] == 1) && (IpAddress7[3] >= 0 || IpAddress7[3] <= 255)){
                return capi_DispError(objMainVideoSourceAddress, MSG_STATUS.mID_0027);
            } //else if (IpAddress7[0] == 0 && IpAddress7[1] == 0 && IpAddress7[2] == 0 && IpAddress7[3] == 0 ){
                //return capi_DispError(objMainVideoSourceAddress, MSG_STATUS.mID_0027);
            //}

            if (!capi_isDigit(inputMainVideoDestinationPort.get())) {
                return capi_DispError(objMainVideoDestinationPort, MSG_STATUS.mID_0010);
            } else if (!(inputMainVideoDestinationPort.get() > 1023 && inputMainVideoDestinationPort.get() < 65536)) {
                return capi_DispError(objMainVideoDestinationPort, MSG_STATUS.mID_0107);
            } else if (inputMainVideoDestinationPort.get() == 10669 || inputMainVideoDestinationPort.get() == 10670){
                return capi_DispError(objMainVideoDestinationPort, MSG_STATUS.mID_0026);
            }

          
            return true;
        }

        function getJPEGXSRXData(){
            var data = {};
            var idnex = select_system_format_value.indexOf(selectReturnVideoFormat.get());
            data['ch0_format'] = select_system_format_text[idnex];
            data['ch0_multicast_addr'] = inputMainVideoDestinationAddress.get();
            data['ch0_source_addr'] = inputMainVideoSourceAddress.get();
            data['ch0_port'] = inputMainVideoDestinationPort.get();
            return data;
        }

        function getJPEGXSRXInfo() {
            objJpegXsRxData = cparam_get_jpeg_xs_video_rx();
            var data = {};
            data['enable'] = objJpegXsRxData.ch0_enable;
            data['format'] = objJpegXsRxData.ch0_format;
            data['dest_addr'] = objJpegXsRxData.ch0_multicast_addr;
            data['sor_addr'] = objJpegXsRxData.ch0_source_addr;
            data['dest_port'] = objJpegXsRxData.ch0_port;

            return data;
        }

        return {
            build: function () {
                return buildJpegxsRx();
            },
            getJPEGXSRXInfo
        }
    }

    /**
     * settingH264画面:settingJPEG制御に関わる画面クラス
     * @class settingH264画面:settingJPEG制御に関わる画面クラス
     * @return {{build: buildNmos, rebuild: rebuild}} build 構築処理
     * @return {function} rebuild 再構築処理
     * @constructor
     */
    function settingNmos() {
        /**
         * 構築フラグ
         * @type boolean
         */
        var buildFlagNmos = false;
        var txtNmosControl;
        var txtStatus;
        var txtIs04Port;
        var txtIs05Port;
        var txtIs04PortMsg;
        var txtIs05PortMsg;
        var txtStatusValue;
        var txtLabelSetting;
        var txtLabelPrefix;
        var txtDiscovery;
        var nmosControlRadioButtonGroup;
        var nmosLabelSettingRadioButtonGroup;
        var nmosDiscoveryRadioButtonGroup;
        var inputIs04Port;
        var inputIs05Port;
        var inputLabelPrefix;
        var objNmosInfoValues;
        var nmos_set_button;
        var intervaltxtStatusValue;

        function buildNmos(type) {
            objNmosInfoValues = getNmosInfoResult(objNmosInfo);
            if (!buildFlagNmos) {
                buildFlagNmos = true;
                txtNmosControl = TextCtrl("setup_mediaOverIp_nmos_label", "setup_mediaOverIP_nmos_control_title_label", NPTZ_WORDING.wID_0718);
                txtNmosControl.show();
                // NMOS Control radio
                nmosControlRadioButtonGroup = RadioButtonGroupCtrl("setup_mediaOverIp_nmos_form", "setup_mediaOverIp_nmos_control_", RADIO_GROUP.rID_0001, objNmosInfoValues["control"], callbackNmosControlChange);
                // status
                txtStatus = TextCtrl("setup_mediaOverIp_nmos_label", "setup_mediaOverIP_nmos_status_title_label", NPTZ_WORDING.wID_0705);
                txtStatus.show();
                // status value
                txtStatusValue = TextCtrl("setup_mediaOverIp_nmos_form", "setup_mediaOverIP_nmos_status_value_label", objNmosInfoValues["status"]);
                txtStatusValue.show();

                rediscoveryButton = ButtonCtrl("setup_mediaOverIp_nmos_form", "setup_mediaOverIp_nmos_rediscovery_button", NPTZ_WORDING.wiD_0906, callbackRediscoveryButton);
                rediscoveryButton.getButtonObject().addClass('button_class');
                rediscoveryButton.show();
                rediscoveryButton.displayOff();

                // IS-04 port
                txtIs04Port = TextCtrl("setup_mediaOverIp_nmos_label", "setup_mediaOverIP_nmos_is04_port_title_label", NPTZ_WORDING.wID_0707);
                txtIs04Port.show();
                inputIs04Port = InputCtrl("setup_mediaOverIp_nmos_form", 'is04_port', 'is04_port', 'setup_mediaOverIp_nmos_is04_port_port', objNmosInfoValues["port_is_04"], null, null, null, null)
                inputIs04Port.show();
                inputIs04Port.displayOff();
                txtIs04PortMsg = TextCtrl("setup_mediaOverIp_nmos_form", "setup_mediaOverIP_nmos_is04_port_msg_label", NPTZ_WORDING.wID_0712);
                txtIs04PortMsg.show();
                // IS-05 port
                txtIs05Port = TextCtrl("setup_mediaOverIp_nmos_label", "setup_mediaOverIP_nmos_is05_port_title_label", NPTZ_WORDING.wID_0708);
                txtIs05Port.show();
                inputIs05Port = InputCtrl("setup_mediaOverIp_nmos_form", 'is05_port', 'is05_port', 'setup_mediaOverIp_nmos_is05_port_port', objNmosInfoValues["port_is_05"], null, null, null, null)
                inputIs05Port.show();
                inputIs05Port.displayOff();
                txtIs05PortMsg = TextCtrl("setup_mediaOverIp_nmos_form", "setup_mediaOverIP_nmos_is05_port_msg_label", NPTZ_WORDING.wID_0712);
                txtIs05PortMsg.show();
                // Label setting
                txtLabelSetting = TextCtrl("setup_mediaOverIp_nmos_label", "setup_mediaOverIP_nmos_label_setting_title_label", NPTZ_WORDING.wID_0719);
                txtLabelSetting.show();
                nmosLabelSettingRadioButtonGroup = RadioButtonGroupCtrl("setup_mediaOverIp_nmos_form", "setup_mediaOverIp_nmos_label_setting_", RADIO_GROUP.rID_0048, objNmosInfoValues["label_setting"], callbackLabelSettingChange);
                // Label prefix
                txtLabelPrefix = TextCtrl("setup_mediaOverIp_nmos_label", "setup_mediaOverIP_nmos_label_prefix_title_label", NPTZ_WORDING.wID_0720);
                txtLabelPrefix.show();
                var prefixValue = objNmosInfoValues["label_setting"] == "auto" ? objNmosInfoValues["label_prefix_auto"] : objNmosInfoValues["label_prefix_manual"];
                inputLabelPrefix = InputCtrl("setup_mediaOverIp_nmos_form", 'label_prefix', 'label_prefix', 'setup_mediaOverIp_nmos_label_prefix', prefixValue, null, null, null, null)
                inputLabelPrefix.show();
                inputLabelPrefix.displayOff();
                // discovery
                txtDiscovery = TextCtrl("setup_mediaOverIp_nmos_label", "setup_mediaOverIP_nmos_discovery_title_label", NPTZ_WORDING.wID_0721);
                txtDiscovery.show();
                nmosDiscoveryRadioButtonGroup = RadioButtonGroupCtrl("setup_mediaOverIp_nmos_form", "setup_mediaOverIp_nmos_discovery_", RADIO_GROUP.rID_0084, objNmosInfoValues["discovery"], callbackDiscoveryChange);

                //Line
                LineCtrl('setup_mediaOverIp_nmos_main', 'horizontal', 150, 0, "", 'setup_mediaOverIP_nmos_control', "97.5");
                LineCtrl('setup_mediaOverIp_nmos_main', 'horizontal', 150, 0, "", 'setup_mediaOverIP_nmos_status', "97.5");
                LineCtrl('setup_mediaOverIp_nmos_main', 'horizontal', 150, 0, "", 'setup_mediaOverIP_nmos_is04_port', "97.5");
                LineCtrl('setup_mediaOverIp_nmos_main', 'horizontal', 150, 0, "", 'setup_mediaOverIP_nmos_is05_port', "97.5");
                LineCtrl('setup_mediaOverIp_nmos_main', 'horizontal', 150, 0, "", 'setup_mediaOverIP_nmos_label_setting', "97.5");
                LineCtrl('setup_mediaOverIp_nmos_main', 'horizontal', 150, 0, "", 'setup_mediaOverIP_nmos_label_prefix', "97.5");
                LineCtrl('setup_mediaOverIp_nmos_main', 'horizontal', 150, 0, "", 'setup_mediaOverIP_nmos_discovery', "97.5");
                nmos_set_button = ButtonCtrl("setup_mediaOverIp_nmos_form", "setup_mediaOverIp_nmos_set_button", NPTZ_WORDING.wID_0141, callbackNmosSetButton);
                nmos_set_button.getButtonObject().addClass('button_class');
                nmos_set_button.show();
                nmos_set_button.displayOff();
                callbackNmosControlChange();
            } else {
                rebuild();
            }
        }

        function rebuild() {
            nmosControlRadioButtonGroup.setSelectedValue(objNmosInfoValues["control"]);
            txtStatusValue.set(objNmosInfoValues["status"]);
            inputIs04Port.set(objNmosInfoValues["port_is_04"]);
            inputIs05Port.set(objNmosInfoValues["port_is_05"]);
            nmosLabelSettingRadioButtonGroup.setSelectedValue(objNmosInfoValues["label_setting"]);
            if(objNmosInfoValues["label_setting"] == "auto"){
                inputLabelPrefix.set(objNmosInfoValues["label_prefix_auto"]);
            }else{
                inputLabelPrefix.set(objNmosInfoValues["label_prefix_manual"]);
            }
            nmosDiscoveryRadioButtonGroup.setSelectedValue(objNmosInfoValues["discovery"]);
            callbackNmosControlChange();
        }

        function callbackNmosControlChange(mouse) {
            if (nmosControlRadioButtonGroup.getSelectedValue() == "1") {
                inputIs04Port.displayOff();
                inputIs05Port.displayOff();
                inputLabelPrefix.displayOff();
                nmosLabelSettingRadioButtonGroup.displayOff();
                nmosDiscoveryRadioButtonGroup.displayOff();
            } else {
                inputIs04Port.displayDisabled();
                inputIs05Port.displayDisabled();
                inputLabelPrefix.displayDisabled();
                nmosLabelSettingRadioButtonGroup.displayDisabled();
                nmosDiscoveryRadioButtonGroup.displayDisabled();
            }
            if (nmosLabelSettingRadioButtonGroup.getSelectedValue() == "auto") {
                inputLabelPrefix.displayDisabled();
            } else {
                inputLabelPrefix.displayOff();
            }
        }
        function callbackLabelSettingChange(mouse) {
            if (nmosLabelSettingRadioButtonGroup.getSelectedValue() == "manual") {
                inputLabelPrefix.displayOff();
            } else {
                inputLabelPrefix.displayDisabled();
            }
        }
        function callbackDiscoveryChange(mouse){
        }
        function callbackNmosSetButton(mouse) {           
            if (mouse == Button.MOUSE_DOWN) {
                var checkResult =  checkNmosData();
                if(!checkResult){
                    return;
                }

                $("#dialog_setup").show();
                $.ajax({
                    type: "post",
                    url: "/cgi-bin/set_nmos_info",
                    data: getNmosData(),
                    success: function (data) {
                        setTimeout(function () {
                            $("#dialog_setup").hide();
                        }, 500);
                    },
                    error: function (jqXHR, textStatus, errorThrown) {
                        setTimeout(function () {
                            $("#dialog_setup").hide();
                            jAlert(errorThrown, NPTZ_WORDING.wID_0039);
                        }, 500);
                    }
                });
            }
        }
        function checkNmosData(){
            const objNmosIs04VideoDestinationPort = document.getElementById("is04_port")
            const objNmosIs05VideoDestinationPort = document.getElementById("is05_port")
            if (isRightIpAddress(inputIs04Port.get())) {
                capi_DispError(objNmosIs04VideoDestinationPort, MSG_STATUS.mID_0010);
                return false;
            } else if (inputIs04Port.get() < 1024 || inputIs04Port.get() > 65535) {
                capi_DispError(objNmosIs04VideoDestinationPort, MSG_STATUS.mID_0113);
                return false;
            } else if (inputIs04Port.get() == 10669 || inputIs04Port.get() == 10670) {
                capi_DispError(objNmosIs04VideoDestinationPort, MSG_STATUS.mID_0026);
                return false;
            }

            if (isRightIpAddress(inputIs05Port.get())) {
                capi_DispError(objNmosIs05VideoDestinationPort, MSG_STATUS.mID_0010);
                return false;
            } else if (inputIs05Port.get() < 1024 || inputIs05Port.get() > 65535) {
                capi_DispError(objNmosIs05VideoDestinationPort, MSG_STATUS.mID_0113);
                return false;
            } else if (inputIs05Port.get() == 10669 || inputIs05Port.get() == 10670) {
                capi_DispError(objNmosIs05VideoDestinationPort, MSG_STATUS.mID_0026);
                return false;
            }

            var labelPrefixData = inputLabelPrefix.get();
            var labelSetting = labelPrefixData.replace(/[^a-zA-Z0-9 \!\#\%\(\)\+\-\.\/\=\[\]\ \_]/g, '');
            if (nmosLabelSettingRadioButtonGroup.getSelectedValue() == "manual") {
                if (inputLabelPrefix.get().length > 16) {
                    capi_DispError(nmosLabelSettingRadioButtonGroup, MSG_STATUS.mID_0079);
                    return false;
                } else if (inputLabelPrefix.get() != labelSetting) {
                    capi_DispError(nmosLabelSettingRadioButtonGroup, MSG_STATUS.mID_0079);
                    return false;
                }
            }

            return true;
        }

        function callbackRediscoveryButton(mouse) {
            if (mouse == Button.MOUSE_DOWN) {
                $("#dialog_setup").show();
                $.ajax({
                    type: "post",
                    url: "/cgi-bin/nmos_rediscovery",
                    data: null,
                    success: function (data) {
                        setTimeout(function () {
                            $("#dialog_setup").hide();
                        }, 500);
                    },
                    error: function (jqXHR, textStatus, errorThrown) {
                        setTimeout(function () {
                            $("#dialog_setup").hide();
                            jAlert(errorThrown, NPTZ_WORDING.wID_0039);
                        }, 500);
                    }
                });
            }
        }

        function getNmosData(){
            var data = {};
            data['control'] = nmosControlRadioButtonGroup.getSelectedValue();
            data['port_is_04'] = inputIs04Port.get();
            data['port_is_05'] = inputIs05Port.get();
            data['label_setting'] = nmosLabelSettingRadioButtonGroup.getSelectedValue();
            if (nmosLabelSettingRadioButtonGroup.getSelectedValue() == "manual") {
                data['label_prefix'] = inputLabelPrefix.get();
            }
            // var a = inputLabelPrefix.get();
            // var labelSetting = a.replace(/[^a-zA-Z0-9 \!\#\%\(\)\+\-\.\/\=\[\]\ \_]/g,'');
            // if (nmosLabelSettingRadioButtonGroup.getSelectedValue() == "manual") {
            //     data['label_prefix'] = inputLabelPrefix.get();
            //     if (inputLabelPrefix.get().length > 16){
            //         return capi_DispError(nmosLabelSettingRadioButtonGroup, MSG_STATUS.mID_0079 );
            //     } else if (inputLabelPrefix.get() != labelSetting){
            //         return capi_DispError(nmosLabelSettingRadioButtonGroup, MSG_STATUS.mID_0079 );
            //     }
            // }
            // if(nmosLabelSettingRadioButtonGroup.getSelectedValue() == "auto"){
            //     data['label_prefix_auto'] = inputLabelPrefix.get();
            // }else{
            //     data['label_prefix_manual'] = inputLabelPrefix.get();          
            // }
            data['discovery'] = nmosDiscoveryRadioButtonGroup.getSelectedValue();
            return data;
        }

        return {
            build: function (type) {
                return buildNmos(type);
            },
            setIntervalTxtStatusValue: function () {
                if(intervaltxtStatusValue){
                    clearInterval(intervaltxtStatusValue);
                    intervaltxtStatusValue = null;
                }
                intervaltxtStatusValue = setInterval(function () {
                    objNmosInfoValues = getNmosInfoResult(objNmosInfo);
                    txtStatusValue.set(objNmosInfoValues["status"]);
                }, 1000);
            },
            clearIntervalTxtStatusValue: function () {
                clearInterval(intervaltxtStatusValue);
            }
        }
    }

    /**
     * settingH264画面:settingJPEG制御に関わる画面クラス
     * @class settingH264画面:settingJPEG制御に関わる画面クラス
     * @return {{build: buildNmos, rebuild: rebuild}} build 構築処理
     * @return {function} rebuild 再構築処理
     * @constructor
     */
    function settingPtp() {
        /**
         * 構築フラグ
         * @type boolean
         */
        var buildFlagPtp = false;
        // var objPtp;
        var objPtpValues;
        var txtDomain;
        var txtSyncSignal;
        var txtSyncSignalValue;
        var inputDomain;
        var ptp_set_button;
        var linksyncSignalButton;

        function buildPtp(type) {
            objPtp = getPtpInfo();
            objPtpValues = getPtpResult(objPtp);
            if (!buildFlagPtp) {
                buildFlagPtp = true;
                txtDomain = TextCtrl("setup_mediaOverIp_ptp_label", "setup_mediaOverIP_ptp_domain_title_label", NPTZ_WORDING.wID_0674);
                txtDomain.show();
                inputDomain = InputCtrl("setup_mediaOverIp_ptp_form", 'ptp_domain', 'ptp_domain', 'setup_mediaOverIP_ptp_domain', objPtpValues && objPtpValues["domain"])
                inputDomain.show();
                inputDomain.displayOff();
                txtSyncSignal = TextCtrl("setup_mediaOverIp_ptp_label", "setup_mediaOverIP_ptp_sync_signal_title_label", NPTZ_WORDING.wID_0722);
                txtSyncSignal.show();
                // txtSyncSignalValue = TextCtrl("setup_mediaOverIp_ptp_form", "setup_mediaOverIP_ptp_sync_signal_value_title_label", NPTZ_WORDING.wID_0723);
                // txtSyncSignalValue.show();
                linksyncSignalButton = ButtonCtrl("setup_mediaOverIp_ptp_form", 'setup_mediaOverIP_ptp_sync_signal_value_title_label', NPTZ_WORDING.wID_0723, callbackBasicDateSyncSignal);
                linksyncSignalButton.show();
                linksyncSignalButton.displayOff();

                LineCtrl('setup_mediaOverIp_ptp_main', 'horizontal', 150, 0, "", 'setup_mediaOverIp_ptp_domain', "97.5");
                LineCtrl('setup_mediaOverIp_ptp_main', 'horizontal', 150, 0, "", 'setup_mediaOverIp_ptp_sync_signal', "97.5");

                ptp_set_button = ButtonCtrl("setup_mediaOverIp_ptp_form", "setup_mediaOverIp_ptp_set_button", NPTZ_WORDING.wID_0141, callbackPtpSetButton);
                ptp_set_button.getButtonObject().addClass('button_class');
                ptp_set_button.show();
                ptp_set_button.displayOff();
                if(cparam_get_ref_signal() == 0){
                    inputDomain.displayDisabled();
                }else{
                    inputDomain.displayOff();
                }
            } else {
                rebuild();
            }
        }

        function rebuild() {
            inputDomain.set(objPtpValues["domain"]);
            if(cparam_get_ref_signal() == 0){
                inputDomain.displayDisabled();
            }else{
                inputDomain.displayOff();
            }
        }

        function callbackBasicDateSyncSignal(mouse) {
            if (mouse == Button.MOUSE_DOWN) {
                setupMainMenu.callbackButtonControl(1,1);
                settingBasicSystem.callbackSystemStatus(1,12);

                $(".setup_menu_mediaOverIP_btn").removeClass('on');
                $(".setup_menu_mediaOverIP_btn").removeClass('disable');
                $(".setup_menu_mediaOverIP_btn").removeClass('on_hover');
                $(".setup_menu_mediaOverIP_btn").removeClass('off_hover');
                $(".setup_menu_mediaOverIP_btn").addClass('off');
                $(".div_system_menu_sync_signal").removeClass('off');
                $(".div_system_menu_sync_signal").removeClass('disable');
                $(".div_system_menu_sync_signal").removeClass('on_hover');
                $(".div_system_menu_sync_signal").removeClass('off_hover');
                $(".div_system_menu_sync_signal").addClass('on');

                $(".setup_menu_basic_system_btn").removeClass('off');
                $(".setup_menu_basic_system_btn").removeClass('disable');
                $(".setup_menu_basic_system_btn").removeClass('on_hover');
                $(".setup_menu_basic_system_btn").removeClass('off_hover');
                $(".setup_menu_basic_system_btn").addClass('on');

            }
        }

        function callbackPtpSetButton(mouse) {
            if (mouse == Button.MOUSE_DOWN) {
                const objDomain = document.getElementById("ptp_domain");
                // input check
                if (!capi_isDigit(inputDomain.get())) {
                    return capi_DispError(objDomain, MSG_STATUS.mID_0010);
                } else if (!(objDomain.value > -1 && objDomain.value < 128)) {
                    return capi_DispError(objDomain, MSG_STATUS.mID_0108);
                }
                $("#dialog_setup").show();
                $.ajax({
                    type: "post",
                    url: "/cgi-bin/set_ptp_info",
                    data: getPtpData(),
                    success: function (data) {
                        setTimeout(function () {
                            $("#dialog_setup").hide();
                        }, 500);
                    },
                    error: function (jqXHR, textStatus, errorThrown) {
                        setTimeout(function () {
                            $("#dialog_setup").hide();
                            jAlert(errorThrown, NPTZ_WORDING.wID_0039);
                        }, 500);
                    }
                });
            }
        }
        function getPtpData(){
            var data = {};
            data['domain'] = inputDomain.get();
            return data;
        }
        return {
            build: function (type) {
                return buildPtp(type);
            }
        }
    }
    /**
     *
     * @param ipAddr
     * @returns {boolean}
     */
    function isRightIpAddress(ipAddr) {
        var regIps = /^(((25[0-5]|2[0-4]\d|1\d{2}|[1-9]\d|[0-9])\.){3}(25[0-5]|2[0-4]\d|1\d{2}|[1-9]\d|[0-9]))$/;
        return regIps.test(ipAddr);
    }
    return {
        build: buildMediaOverIP,
        rebuild: rebuild,
        setIntervalSettingStatus: function () {
            settingStatus.setIntervalMOIPRXSTATEPtpInfo();
            settingStatus.setIntervalNmosInfo();
            settingStatus.setIntervalValues();
        },
        clearIntervalSettingStatus: function () {
            settingStatus.clearIntervalMOIPRXSTATEPtpInfo();
            settingStatus.clearIntervalNmosInfo();
            settingStatus.clearIntervalValues();
        },
        setIntervalSettingNmos: function () {
            settingStatus.setIntervalNmosInfo();
            settingNmos.setIntervalTxtStatusValue();
        },
        clearIntervalSettingNmos: function () {
            settingStatus.clearIntervalNmosInfo();
            settingNmos.clearIntervalTxtStatusValue();
        }
    };
}
