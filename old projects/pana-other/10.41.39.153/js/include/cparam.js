/**
 * @fileOverview function管琁E��ラス
 *
 * @author Panasonic Corporation
 */
var objErrCode = "";
var cparam_refCount = 0;
var cparams = {};
var _param = "/cgi-bin/param.cgi?";
var _aw_cam = "/cgi-bin/aw_cam?cmd=";
var _aw_ptz = "/cgi-bin/aw_ptz?cmd=";

var _user = "/cgi-bin/user.cgi";
var _auth = "/cgi-bin/auth.cgi";
var _auth_live = "/cgi-bin/auth_live.cgi";
var _title = "/cgi-bin/title.cgi";
var _mode = "/cgi-bin/get_priority_mode";
var _camid_mode = "/cgi-bin/get_sdrec_mode";
var _enable = "/cgi-bin/get_rectally";
var _audio = "/cgi-bin/get_audio";
var _system = "/cgi-bin/system.cgi";
var _easyipset = "/cgi-bin/easyipset";
var _modelno = "/cgi-bin/model_serial";
var _ndihxkey = "/cgi-bin/ndi_hx_key";
var _modelname = "/cgi-bin/modelname";
var reqCgiObj = {};
var reqPtdObj = {};
var worker;

var _basic = "/cgi-bin/get_basic";
var liveModeFlg = false;
var firstPTG = true;
var firstPTD = true;
var activexInitialization = true;
var focusSize = "s2"

/**
 * PTC button
 * @type object
 */
var ptcObject = [];
// 定義値
var PTC_STOP = 0;
var PTC_UP = 1;
var PTC_DOWN = 2;
var PTC_LEFT = 3;
var PTC_RIGHT = 4;
var PTC_UP_LEFT = 5;
var PTC_DOWN_LEFT = 6;
var PTC_UP_RIGHT = 7;
var PTC_DOWN_RIGHT =8;
// 定義array
ptcObject[PTC_STOP] = 'stop';
ptcObject[PTC_UP] = 'up';
ptcObject[PTC_DOWN] = 'dw';
ptcObject[PTC_LEFT] = 'lt';
ptcObject[PTC_RIGHT] = 'rt';
ptcObject[PTC_UP_LEFT] = 'ul';
ptcObject[PTC_DOWN_LEFT] = 'dl';
ptcObject[PTC_UP_RIGHT] = 'ur';
ptcObject[PTC_DOWN_RIGHT] ="dr";

if (cparam_refCount == 0) {
    cparam_refCount++;
    cparams['counter'] = "0";
// Common
    cparams['title'] = "";
    cparams['name'] = "";
    cparams['defauth'] = "0";// Default user name & Default user password = 1
    cparams['userauth'] = "0"; //UserAuth On/Off
    cparams['auth_type'] = 0; // 0:basic, 1:digest
    cparams['auth_wait_time']=0; //0:mode1,1:mode2
    cparams['power'] = "1";
    cparams['dest'] = "0";
    cparams['tally_state'] = "0";
    cparams['view_mode'] = "0"; //0:nomal view,1:multi view
    cparams['enable4k'] = false;
    cparams['isUE70'] = false;
    cparams['ndihx_activate_model'] = false;
// user
    cparams['ulst'] = Array("admin", 1);
// ImageAdjust
    cparams['contrast_mode'] = 0;//0:manual,1:auto
    cparams['contrast_lv'] = "0"; // picture
    cparams['night_mode'] = 0; // 0:manual, 1:auto
    cparams['wb'] = "0";
    cparams['detail_lv_l'] = 0;
    cparams['sdrs'] = 0;
// Network
    cparams['dhcp_env'] = "1";
    cparams['ip1'] = "";
    cparams['ip2'] = "";
    cparams['ip3'] = "";
    cparams['ip4'] = "";
    cparams['nm1'] = "";
    cparams['nm2'] = "";
    cparams['nm3'] = "";
    cparams['nm4'] = "";
    cparams['gw1'] = "";
    cparams['gw2'] = "";
    cparams['gw3'] = "";
    cparams['gw4'] = "";
    cparams['httpport'] = "80";
    cparams['dns_env'] = "0";
    cparams['dns_ps'] = "";
    cparams['dns_ss'] = "";
    cparams['easyipset'] = 0;
    cparams['https'] = 0;			// 0:http 1:https
    cparams['http_port'] = 80;
    cparams['https_port'] = 443;
    cparams['rtsp_port'] = 554;
// System
    cparams['dcmode'] = "0";//unused
    cparams['speed_with_zoom_pos'] = 0;
    cparams['focus_adj_with_ptz'] = 0;
    cparams['glc'] = 0;	// genlock counter
    cparams['moni_hdr'] = 0;
// Information
    cparams['macadr'] = "00-00-00-00-00-00";
    cparams['lan1_macadr'] = "00-00-00-00-00-00";
    cparams['serial'] = "00000000";
    cparams['opetime'] = 0;
// CamControl
    cparams['jpeg_resolution'] = "0";  //0:qvga, 1:vga
// Audio
    cparams['audio'] = 0; //0:off, 1:on
    cparams['inputvolume'] = 0;
    cparams['pluginpower'] = 0; // 0:off
    cparams['new_bit'] = "128";
    cparams['new_equal'] = "off";
    cparams['new_alc'] = "0";
    cparams["http_unauthorized"] = false;
    cparams["webtitle"] = "";
}


var sPower;
var sStreamMode;
var fullWindowFlg = false;
var isLoad = true;
var firstZoomValue = 1;
var currentZoomValue = 1;
var currentIeZoomValue = 1;
var lastheightValue = 0;
var currentWindowWidth = 1280;
var gsPanTiltSpeed = new Array('5050', '5075', '5025', '2550', '7550', '2575', '7575', '2525', '7525');
var gsPanTiltSpeedSlow = new Array('5050', '5065', '5035', '3550', '6550', '3565', '6565', '3535', '6535');

var indexWb;
var gainColorShutterND;
var gGain;
var gShutter;
var gD_Zoom_Magnification = 0;
var AWCAM_DELAY_START_LIVE = 5000;
//live or admin
var isPageFlg = "live";
var isOnloadFlg = false;
var uHDCropMode = null;
var gPTV = null;
var rtmpParam = {};
var _live;
var _live_ipout;
var canPlayImage = false;
var isUE160 = false;
var isUE163 = false;
var isUCW4380 = false;
if(sessionStorage.isAdminPage != "true" && window.location.href.indexOf("/live/index.html") !="-1" && cparam_get_mode_ip() == 1 && !adminPage){
    sessionStorage.isPageUrl = window.location.href;
    window.location.href = '/live/warning.html';
}else{
    sessionStorage.isPageUrl = window.location.href;
    sessionStorage.isAdminPage = false;
    // CGIを送信
    _cparam_cgi_name();

    if(cparams['name'].indexOf("UE160") >= 0 || cparams['name'].indexOf("UE163") >= 0 || cparams['name'].indexOf("4380") >= 0){
        isUE160 = true;
    }
    if (cparams['name'].indexOf("UE163") >= 0) {
        isUE163 = true;
    }
    if (cparams['name'].indexOf("4380") >= 0) {
        isUCW4380 = true;
    }

    if(window.location.href.indexOf("mainview") !="-1"){
        var gPower = window.parent.gPower;
    }else if(window.location.href.indexOf("live") !="-1"){
        var gPower = cparam_get_powerOnStandby();
    }else if(window.location.href.indexOf("admin") !="-1"){
        var gPower = cparam_get_powerOnStandby();
    }


    var sysStreamMode;
    if(window.location.href.indexOf("mainview") !="-1"){
        sysStreamMode = window.parent.sysStreamMode;
    }else{
        sysStreamMode = getStreamMode();
    }

    if(window.location.href.indexOf("mainview") !="-1"){
        var objVOIP = window.parent.objVOIP;
    }else if(window.location.href.indexOf("live") !="-1"){
        var objVOIP = cparam_getVideoOverIpInfo();
    }else if(window.location.href.indexOf("admin") !="-1"){
        var objVOIP = cparam_getVideoOverIpInfo();
    }

    if(window.location.href.indexOf("mainview") !="-1"){
        var _basic_info = window.parent._basic_info;
    }else {
        var _basic_info = cparam_getBasicInfo();

    }

    if(window.location.href.indexOf("mainview") !="-1"){
        var gScene = window.parent.gScene;
    }else if(window.location.href.indexOf("index.html") !="-1"){
        var gScene = cparam_get_sceneMode();
    }else if(window.location.href.indexOf("admin") !="-1"){
        var gScene = cparam_get_sceneMode();
    }

    if(window.location.href.indexOf("live") !="-1"){
        var gPTD = cparam_get_panTiltZoomFocusIrisTogetherDisplay();
    }else if(window.location.href.indexOf("admin") !="-1"){
        var gPTD = cparam_get_panTiltZoomFocusIrisTogetherDisplay();
    }

    if(window.location.href.indexOf("live") !="-1"){
        isPageFlg = "live";
        if(window.location.href.indexOf("mainview") !="-1"){
            var gInstall_Position = window.parent.gInstall_Position;
        }else{
            var gInstall_Position = cparam_get_installPosition();
        }


        var stream = objVOIP.sStream;
        if(objVOIP.h264_transmit_ch1 != "1" && objVOIP.h264_transmit_ch2 != "1" && objVOIP.h264_transmit_ch3 != "1" && objVOIP.h264_transmit_ch4 != "1"){
            stream = "jpeg";
        }
        if(objVOIP.jpeg_transmit1 != "1" && objVOIP.jpeg_transmit2 != "1" && objVOIP.jpeg_transmit3 != "1"){
            stream = "h264";
        }

        if(IsIE()){
            //NDI|HXの場合、Video Over IPの取得したデータに置ぁE��H.264(1)のTransmitがOnであったとしても、IEで表示できるのはJPEG(1)のみです、E
            //2020710 add
            if(sysStreamMode == "ndi_hx"){
                stream = "jpeg";
            }
            //end
            if(stream == "h264"){
                currentWindowWidth = parseInt(objVOIP.h264_resolution_ch1)
            }else if(stream == "h264_2"){
                currentWindowWidth = parseInt(objVOIP.h264_resolution_ch2)
            }else if(stream == "h264_3"){
                currentWindowWidth = parseInt(objVOIP.h264_resolution_ch3)
            }else if(stream == "h264_4"){
                currentWindowWidth = parseInt(objVOIP.h264_resolution_ch4)
            }else if(stream == "jpeg"){
                currentWindowWidth = parseInt(objVOIP.resol_stream1)
            }else if(stream == "jpeg_2"){
                currentWindowWidth = parseInt(objVOIP.resol_stream2)
            }else if(stream == "jpeg_3"){
                currentWindowWidth = parseInt(objVOIP.resol_stream3)
            }
            //currentWindowWidth =
        }else{
            if(stream.indexOf("h264")!= -1){
                currentWindowWidth = parseInt(objVOIP.resol_stream1)
            }else if(stream == "jpeg"){
                currentWindowWidth = parseInt(objVOIP.resol_stream1)
            }else if(stream == "jpeg_2"){
                currentWindowWidth = parseInt(objVOIP.resol_stream2)
            }else if(stream == "jpeg_3"){
                currentWindowWidth = parseInt(objVOIP.resol_stream3)
            }
        }
    }else{
        isPageFlg = "admin";
        var httpsPort    = getHttps().https_port;
    }

}
sessionStorage.isAdminPage = false;
var isMobile = false;
if ((navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|Fennec|WebOS|Windows Phone)/i))) {
    isMobile = true;
}
else {

    let ua = navigator.userAgent;
    let isSafari = ua.indexOf("Safari") != -1 && ua.indexOf("Version") != -1;
    let isIPad = isSafari && 'ontouchend' in document;
    if(isIPad){
        isMobile = true;
    }else{
        isMobile = false;
    }

}
if (IsIE()) {
    if(gPower == 1){
        if(currentWindowWidth >= 1920){
            currentWindowWidth = 1450;
        }
    }else{
        currentWindowWidth = 640;
    }

}else{
    if(gPower == 0){
        currentWindowWidth = 640;
    }else{
    }
}
var touchWindowFlg = 0;
// 0:off 1:on
var gBTN_TOUCH_F_status = 0;
var gBTN_FOCUS_GUIDE_status = 0;
// gBTN_FOCUS_GUIDE_status = sessionStorage.gBTN_FOCUS_GUIDE_status
var gCurrentStreamMode;
function getStreamMode() {
    let retValue ;
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

function getHttps() {
    var url = "/cgi-bin/get_https";
    var ret = cparam_sendRequest(url);
    var result = {};
    if (ret) {
        ret = cparam_getRetArray(ret);
        for (var i = 0; i < ret.length; i++) {
            if (ret[i].indexOf("live=") == 0) {
                result.live = ret[i].substring("live=".length);
                continue;
            }
            if (ret[i].indexOf("https_port=") == 0) {
                result.https_port = ret[i].substring("https_port=".length);
                continue;
            }
            if (ret[i].indexOf("self_signed_info=") == 0) {
                result.self_signed_info = ret[i].substring("self_signed_info=".length);
                continue;
            }
            if (ret[i].indexOf("ca_cert_info=") == 0) {
                result.ca_cert_info = ret[i].substring("ca_cert_info=".length);
            }
            if (ret[i].indexOf("mode=") == 0) {
                result.mode = ret[i].substring("mode=".length);
            }
        }
    }
    return result;
}

function cparam_updateTitle() {
    _cparam_cgi_title();
}

function cparam_updatePriorityMode() {
    _cparam_cgi_name();
}

function cparam_updateUser() {
    _cparam_cgi_defauth(_auth);
}

function cparam_cgi_user_ulist() {
     _cparam_cgi_user_ulist();
}

function cparam_updateSystem() {
    _cparam_cgi_name();
}

function cparam_updateInformation() {
    _cparam_cgi_name();
    _cparam_cgi_system_info_all();
    _cparam_cgi_info_ndihxkey();
}

function cparam_updateCamControl() {
    _cparam_cgi_name();
}



function cparam_updateAudio() {
    _cparam_cgi_get_audio();
}


/**
 * send cgi commend to get cparams['title']
 * @private
 */
function _cparam_cgi_title() {
    try {
        var ret = cparam_sendRequest(_title);
        if (ret.length > 0 && (ret.indexOf("cam_title=") == 0)) {
            cparams['title'] = ret.substring("cam_title=".length);
        }
    }
    catch (e) {
    }
}


/**
 * get modelname by send cgi commend , modelname eg : AW_UE70
 * @private
 */
function _cparam_cgi_name() {
    try {
        var ret = cparam_sendRequest(_modelno);

        if (ret.length > 0)  {
            cparams['name'] = ret.substring(0, ret.indexOf(":"));
            return;
        }
    }
    catch (e) {
    }
    cparams['name'] = "";
}

/**
 * get modelname by send cgi commend , modelname eg : AW_UE70
 * @private
 */
function _cparam_cgi_modelname() {
    try {
        var ret = cparam_sendRequest(_modelname);

        if (ret.length > 0 && ret.indexOf("AW-")==0){
            if((ret.indexOf("AW-UN") == 0)){
               cparams.ndihx_activate_model = true;
            }
            if((ret.indexOf("AW-UE100") == 0)){
               cparams.ndihx_activate_model = true;
            }
        }
    }
    catch (e) {
    }
}

/**
 * get camera name by send cgi commend
 * @returns {string}
 */
function cparam_cgi_updateWebPageTitle() {
    try {
        var ret = cparam_sendRequest(_basic);
        var webtitle = "";
        if (ret.length > 0) {
            var resultArray = cparam_getRetArray(ret);
            for (var i = 0; i < resultArray.length; ++i) {
                if (resultArray[i].indexOf("cam_title=") == 0) {
                    webtitle = resultArray[i].substring("cam_title=".length);
                }
            }
        }
    }
    catch (e) { }
    return webtitle;
}

/**
 * get cmn value : defauth/userauth/auth_type
 * @param cgi_type
 * @private
 */
function _cparam_cgi_defauth(cgi_type) {
    try {
        cparams.userparams = cparam_sendRequest(cgi_type);
        if (cparams.userparams.length > 0) {
            var params = eval("(" + cparams.userparams + ")");
            cparams['defauth'] = params['defauth'];
            cparams['userauth'] = params['userauth'];
            cparams.auth_type = params['auth_type'];
            cparams['auth_wait_time'] = params['auth_wait_time'];
        }
    }
    catch (e) {
    }
}

/**
 * send cgi commend : ulst --- depend on url
 * @private
 */
var count = 0;
function _cparam_cgi_user_ulist() {
    cparams['ulst'] = Array("", "");
    cparams.userlist = "";
    cparams.adminUserNum = 0;
    try {
        var ret =_cparam_Cgi_NoData_sendRequset("GET", _user);
        if(!ret && count < 6) {
            count++;
            _cparam_cgi_user_ulist();
            return;
        } else if (ret.length > 0) {
            if (ret.indexOf("userlist") != -1) {
                count = 0;
            } else {
                count++;
                _cparam_cgi_user_ulist();
                return;
            }
        }
        if (ret.length > 0) {
            var params = eval("(" + ret.replace(/&quot;/g, '"') + ")");
            cparams.userlist = params['userlist'];
            var usernum = params['usernum'];
            var adminUserNum = 0;
            if (usernum > 0) {
                cparams['ulst'] = new Array(usernum * 2);
                var i = 0;
                for (var key in params['userlist']) {
                    cparams['ulst'][i] = key;
                    cparams['ulst'][i + 1] = params['userlist'][key];
                    if(params['userlist'][key] == 1) {
                        adminUserNum++;
                    }
                    i += 2;
                }
                cparams.adminUserNum = adminUserNum;
            }
        }
    }
    catch (e) {
    }
}


/**
 * send cgi commend to set easyIp
 * @private
 */
function cparam_cgi_network_easyipset() {
    try {
        var ret = cparam_sendRequest(_easyipset);
        if (ret.length > 0) {
            var params = eval("(" + ret.replace('\n', '', 'g') + ")");
            if (typeof (params['easyipset']) !== 'undefined') cparams.easyipset = params['easyipset'];
        }else {
        }
    }
    catch (e) {
    	
    }
    return(ret.length);
}

/**
 * Information
 * @private
 */
function _cparam_cgi_system_info_all() {
    try {
        var ret = cparam_sendRequest(_system);
        if (ret.length > 0) {
            var params = eval("(" + ret.replace('\n', '', 'g') + ")");
            if (typeof (params['macadr']) !== 'undefined') cparams['macadr'] = params['macadr'];
            if (typeof (params['lan1_macadr']) !== 'undefined') cparams['lan1_macadr'] = params['lan1_macadr'];
            if (typeof (params['serial']) !== 'undefined') cparams.serial = params['serial'];
            if (typeof (params['opetime']) !== 'undefined') {
                cparams.opetime = parseInt(params['opetime']);
                if (cparams.opetime > 99999) {
                    cparams.opetime = 99999;
                }
            }
            if (typeof (params['act_counter']) !== 'undefined') {
                cparams.counter = parseInt(params['act_counter']);
            }
        }
    }
    catch (e) {
    }
}

function cparam_updateProductInfo(){
    // Model no.
    _cparam_cgi_name();
    // Mac Addr、Serial no. Activation
    _cparam_cgi_system_info_all();
    _cparam_cgi_info_ndihxkey();
}
/**
 * でキーが有れ�E、アクチE��ベ�Eト確認済みとする
 * @private
 */
function _cparam_cgi_info_ndihxkey() {
    try {
        _cparam_cgi_modelname();
        // アクチE��ベ�Eト確認済みなら何もしなぁE
        if (cparams.ndihx_activate_model) return true;

        // /cgi-bin/ndi_hx_keyでキーが有れ�E、アクチE��ベ�Eト確認済みとする
        var ret = cparam_sendRequest(_ndihxkey);
        if (ret.length > 0) {
            cparams.ndihx_activate_model = true;
        }else{
            cparams.ndihx_activate_model = false;
        }

        return cparams.ndihx_activate_model;
    }
    catch (e) {
        return false;
    }
}

/**
 * Audio
 * @private
 */
function _cparam_cgi_get_audio() {
    let ret = cparam_sendRequest(_audio);
    if (ret.length > 0) {
        let retArray = cparam_getRetArray(ret);
        for (var i = 0; i < retArray.length; ++i) {
            if (retArray[i].indexOf("audio_bitrate=") == 0) {
                cparams['new_bit'] = retArray[i].substring("audio_bitrate=".length);
                continue;
            }
            if (retArray[i].indexOf("audio_transmit=") == 0) {
                cparams.audio_transmit = retArray[i].substring("audio_transmit=".length);
                continue;
            }
        }
        delete retArray;
    }
}

function cparam_cgi_iaxcIso() {
    var type = "GET";
    var url = "/cgi-bin/iaxc_iso";
    _cparam_Cgi_NoData_sendRequset(type, url);
}

function cparam_cgi_gaxcIso() {
    var type = "GET";
    var url = "/cgi-bin/gaxc_iso";
    var ret = _cparam_Cgi_NoData_sendRequset(type, url);
    var result = {};
    if (ret) {
        ret = cparam_getRetArray(ret);
        for (var i = 0; i < ret.length; i++) {
            if (ret[i].indexOf("acx=") == 0) {
                result = ret[i].substring("acx=".length);
            }
        }
    }
    return result;
}
/**
 * send cgi commend : get_video_over_ip --- depend on url
 * @returns {{}}
 */
var getVideoOverIp;
function cparam_getVideoOverIpInfo() {
    const url = "/cgi-bin/get_video_over_ip";
    let ret = cparam_sendRequest(url);
    getVideoOverIp = ret;
    let objVOIP = {};
    ret = cparam_getRetArray(ret);

    objVOIP.sStream = "jpeg";
    objVOIP.jpeg_quality_ch1 = 0;
    objVOIP.jpeg_quality_ch2 = 0;
    objVOIP.jpeg_quality_ch3 = 0;
    objVOIP.resol_stream1 = 640;
    objVOIP.resol_stream2 = 640;
    objVOIP.resol_stream3 = 640;
    objVOIP.jpeg_transmit1 = -1;    // 0:Transmission Off, 1:Transmission On, -1:配信不可能
    objVOIP.jpeg_transmit2 = -1;    // 0:Transmission Off, 1:Transmission On, -1:配信不可能
    objVOIP.jpeg_transmit3 = -1;    // 0:Transmission Off, 1:Transmission On, -1:配信不可能
    objVOIP.jpeg_interval1 = 30;
    objVOIP.jpeg_interval2 = 30;
    objVOIP.jpeg_interval3 = 30;

    for (let i = 0; i < 4; i++) {
        eval("objVOIP.h264_transmit_ch" + (i + 1) + "= -1");
        eval("objVOIP.h264_rtsp_mode_ch" + (i + 1) + "= 0");
        eval("objVOIP.h264_resolution_ch" + (i + 1) + "= 0");
        eval("objVOIP.h264_f_priority_ch" + (i + 1) + "= 0");
        eval("objVOIP.h264_framerate_ch" + (i + 1) + "= 30");
        eval("objVOIP.h264_bandwidth_ch" + (i + 1) + "= 0");
        eval("objVOIP.h264_bandwidth_min_ch" + (i + 1) + "= 0");
        eval("objVOIP.h264_quality_ch" + (i + 1) + "= 0");
        eval("objVOIP.h264_unimulti_ch" + (i + 1) + "= \"uni\"");
        eval("objVOIP.h264_unicast_port_ch" + (i + 1) + "= 0");
        eval("objVOIP.h264_unicast_audio_port_ch" + (i + 1) + "= 0");
        eval("objVOIP.h264_multicast_addr_ch" + (i + 1) + "= \"0.0.0.0\"");
        eval("objVOIP.h264_multicast_port_ch" + (i + 1) + "= 0");
        eval("objVOIP.h264_multicast_ttl_ch" + (i + 1) + "= 0");
        eval("objVOIP.h264_profile_ch" + (i + 1) + "= 0");
    }
    eval("objVOIP.h265_transmit_ch1 = -1");
    eval("objVOIP.h265_rtsp_mode_ch1 = 0");
    eval("objVOIP.h265_resolution_ch1 = 0");
    eval("objVOIP.h265_f_priority_ch1 = 0");
    eval("objVOIP.h265_framerate_ch1 = 30");
    eval("objVOIP.h265_bandwidth_ch1 = 0");
    eval("objVOIP.h265_bandwidth_min_ch1 = 0");
    eval("objVOIP.h265_quality_ch1 = 0");
    eval("objVOIP.h265_unimulti_ch1 = \"uni\"");
    eval("objVOIP.h265_unicast_port_ch1 = 0");
    eval("objVOIP.h265_unicast_audio_port_ch1 = 0");
    eval("objVOIP.h265_multicast_addr_ch1 = \"0.0.0.0\"");
    eval("objVOIP.h265_multicast_port_ch1 = 0");
    eval("objVOIP.h265_multicast_ttl_ch1 = 0");

    eval("objVOIP.h265_transmit_ch2 = -1");
    eval("objVOIP.h265_rtsp_mode_ch2 = 0");
    eval("objVOIP.h265_resolution_ch2 = 0");
    eval("objVOIP.h265_f_priority_ch2 = 0");
    eval("objVOIP.h265_framerate_ch2 = 30");
    eval("objVOIP.h265_bandwidth_ch2 = 0");
    eval("objVOIP.h265_bandwidth_min_ch2 = 0");
    eval("objVOIP.h265_quality_ch2 = 0");
    eval("objVOIP.h265_unimulti_ch2 = \"uni\"");
    eval("objVOIP.h265_unicast_port_ch2 = 0");
    eval("objVOIP.h265_unicast_audio_port_ch2 = 0");
    eval("objVOIP.h265_multicast_addr_ch2 = \"0.0.0.0\"");
    eval("objVOIP.h265_multicast_port_ch2 = 0");
    eval("objVOIP.h265_multicast_ttl_ch2 = 0");

    for (var i = 0; i < ret.length; i++) {
        if (ret[i].indexOf("livestart_stream") == 0) objVOIP.sStream = ret[i].substring("livestart_stream".length + 1);
        else if (ret[i].indexOf("jpeg_quality=") == 0) objVOIP.jpeg_quality_ch1 = ret[i].substring("jpeg_quality".length + 1);
        else if (ret[i].indexOf("jpeg_quality_ch2") == 0) objVOIP.jpeg_quality_ch2 = ret[i].substring("jpeg_quality_ch2".length + 1);
        else if (ret[i].indexOf("jpeg_quality_ch3") == 0) objVOIP.jpeg_quality_ch3 = ret[i].substring("jpeg_quality_ch3".length + 1);
        else if (ret[i].indexOf("resol_stream1") == 0) objVOIP.resol_stream1 = ret[i].substring("resol_stream1".length + 1);
        else if (ret[i].indexOf("resol_stream2") == 0) objVOIP.resol_stream2 = ret[i].substring("resol_stream2".length + 1);
        else if (ret[i].indexOf("resol_stream3") == 0) objVOIP.resol_stream3 = ret[i].substring("resol_stream3".length + 1);
        else if (ret[i].indexOf("jpeg_transmit1") == 0) objVOIP.jpeg_transmit1 = ret[i].substring("jpeg_transmit1".length + 1);
        else if (ret[i].indexOf("jpeg_transmit2") == 0) objVOIP.jpeg_transmit2 = ret[i].substring("jpeg_transmit2".length + 1);
        else if (ret[i].indexOf("jpeg_transmit3") == 0) objVOIP.jpeg_transmit3 = ret[i].substring("jpeg_transmit3".length + 1);
        else if (ret[i].indexOf("jpeg_interval1") == 0) objVOIP.jpeg_interval1 = ret[i].substring("jpeg_interval1".length + 1);
        else if (ret[i].indexOf("jpeg_interval2") == 0) objVOIP.jpeg_interval2 = ret[i].substring("jpeg_interval2".length + 1);
        else if (ret[i].indexOf("jpeg_interval3") == 0) objVOIP.jpeg_interval3 = ret[i].substring("jpeg_interval3".length + 1);
        else if (ret[i].indexOf("h264_transmit_ch1") == 0) objVOIP.h264_transmit_ch1 = ret[i].substring("h264_transmit_ch1".length + 1);
        else if (ret[i].indexOf("h264_transmit_ch2") == 0) objVOIP.h264_transmit_ch2 = ret[i].substring("h264_transmit_ch2".length + 1);
        else if (ret[i].indexOf("h264_transmit_ch3") == 0) objVOIP.h264_transmit_ch3 = ret[i].substring("h264_transmit_ch3".length + 1);
        else if (ret[i].indexOf("h264_transmit_ch4") == 0) objVOIP.h264_transmit_ch4 = ret[i].substring("h264_transmit_ch4".length + 1);
        else if (ret[i].indexOf("h264_rtsp_mode_ch1") == 0) objVOIP.h264_rtsp_mode_ch1 = ret[i].substring("h264_rtsp_mode_ch1".length + 1);
        else if (ret[i].indexOf("h264_rtsp_mode_ch2") == 0) objVOIP.h264_rtsp_mode_ch2 = ret[i].substring("h264_rtsp_mode_ch2".length + 1);
        else if (ret[i].indexOf("h264_rtsp_mode_ch3") == 0) objVOIP.h264_rtsp_mode_ch3 = ret[i].substring("h264_rtsp_mode_ch3".length + 1);
        else if (ret[i].indexOf("h264_rtsp_mode_ch4") == 0) objVOIP.h264_rtsp_mode_ch4 = ret[i].substring("h264_rtsp_mode_ch4".length + 1);
        else if (ret[i].indexOf("h264_resolution_ch1") == 0) objVOIP.h264_resolution_ch1 = ret[i].substring("h264_resolution_ch1".length + 1);
        else if (ret[i].indexOf("h264_resolution_ch2") == 0) objVOIP.h264_resolution_ch2 = ret[i].substring("h264_resolution_ch2".length + 1);
        else if (ret[i].indexOf("h264_resolution_ch3") == 0) objVOIP.h264_resolution_ch3 = ret[i].substring("h264_resolution_ch3".length + 1);
        else if (ret[i].indexOf("h264_resolution_ch4") == 0) objVOIP.h264_resolution_ch4 = ret[i].substring("h264_resolution_ch4".length + 1);
        else if (ret[i].indexOf("h264_f_priority_ch1") == 0) objVOIP.h264_f_priority_ch1 = ret[i].substring("h264_f_priority_ch1".length + 1);
        else if (ret[i].indexOf("h264_f_priority_ch2") == 0) objVOIP.h264_f_priority_ch2 = ret[i].substring("h264_f_priority_ch2".length + 1);
        else if (ret[i].indexOf("h264_f_priority_ch3") == 0) objVOIP.h264_f_priority_ch3 = ret[i].substring("h264_f_priority_ch3".length + 1);
        else if (ret[i].indexOf("h264_f_priority_ch4") == 0) objVOIP.h264_f_priority_ch4 = ret[i].substring("h264_f_priority_ch4".length + 1);
        else if (ret[i].indexOf("h264_framerate_ch1") == 0) objVOIP.h264_framerate_ch1 = ret[i].substring("h264_framerate_ch1".length + 1);
        else if (ret[i].indexOf("h264_framerate_ch2") == 0) objVOIP.h264_framerate_ch2 = ret[i].substring("h264_framerate_ch2".length + 1);
        else if (ret[i].indexOf("h264_framerate_ch3") == 0) objVOIP.h264_framerate_ch3 = ret[i].substring("h264_framerate_ch3".length + 1);
        else if (ret[i].indexOf("h264_framerate_ch4") == 0) objVOIP.h264_framerate_ch4 = ret[i].substring("h264_framerate_ch4".length + 1);
        else if (ret[i].indexOf("h264_bandwidth_ch1") == 0) objVOIP.h264_bandwidth_ch1 = ret[i].substring("h264_bandwidth_ch1".length + 1);
        else if (ret[i].indexOf("h264_bandwidth_ch2") == 0) objVOIP.h264_bandwidth_ch2 = ret[i].substring("h264_bandwidth_ch2".length + 1);
        else if (ret[i].indexOf("h264_bandwidth_ch3") == 0) objVOIP.h264_bandwidth_ch3 = ret[i].substring("h264_bandwidth_ch3".length + 1);
        else if (ret[i].indexOf("h264_bandwidth_ch4") == 0) objVOIP.h264_bandwidth_ch4 = ret[i].substring("h264_bandwidth_ch4".length + 1);
        else if (ret[i].indexOf("h264_bandwidth_min_ch1") == 0) objVOIP.h264_bandwidth_min_ch1 = ret[i].substring("h264_bandwidth_min_ch1".length + 1);
        else if (ret[i].indexOf("h264_bandwidth_min_ch2") == 0) objVOIP.h264_bandwidth_min_ch2 = ret[i].substring("h264_bandwidth_min_ch2".length + 1);
        else if (ret[i].indexOf("h264_bandwidth_min_ch3") == 0) objVOIP.h264_bandwidth_min_ch3 = ret[i].substring("h264_bandwidth_min_ch3".length + 1);
        else if (ret[i].indexOf("h264_bandwidth_min_ch4") == 0) objVOIP.h264_bandwidth_min_ch4 = ret[i].substring("h264_bandwidth_min_ch4".length + 1);
        else if (ret[i].indexOf("h264_quality_ch1") == 0) objVOIP.h264_quality_ch1 = ret[i].substring("h264_quality_ch1".length + 1);
        else if (ret[i].indexOf("h264_quality_ch2") == 0) objVOIP.h264_quality_ch2 = ret[i].substring("h264_quality_ch2".length + 1);
        else if (ret[i].indexOf("h264_quality_ch3") == 0) objVOIP.h264_quality_ch3 = ret[i].substring("h264_quality_ch3".length + 1);
        else if (ret[i].indexOf("h264_quality_ch4") == 0) objVOIP.h264_quality_ch4 = ret[i].substring("h264_quality_ch4".length + 1);
        else if (ret[i].indexOf("h264_unimulti_ch1") == 0) objVOIP.h264_unimulti_ch1 = ret[i].substring("h264_unimulti_ch1".length + 1);
        else if (ret[i].indexOf("h264_unimulti_ch2") == 0) objVOIP.h264_unimulti_ch2 = ret[i].substring("h264_unimulti_ch2".length + 1);
        else if (ret[i].indexOf("h264_unimulti_ch3") == 0) objVOIP.h264_unimulti_ch3 = ret[i].substring("h264_unimulti_ch3".length + 1);
        else if (ret[i].indexOf("h264_unimulti_ch4") == 0) objVOIP.h264_unimulti_ch4 = ret[i].substring("h264_unimulti_ch4".length + 1);
        else if (ret[i].indexOf("h264_unicast_port_ch1") == 0) objVOIP.h264_unicast_port_ch1 = ret[i].substring("h264_unicast_port_ch1".length + 1);
        else if (ret[i].indexOf("h264_unicast_port_ch2") == 0) objVOIP.h264_unicast_port_ch2 = ret[i].substring("h264_unicast_port_ch2".length + 1);
        else if (ret[i].indexOf("h264_unicast_port_ch3") == 0) objVOIP.h264_unicast_port_ch3 = ret[i].substring("h264_unicast_port_ch3".length + 1);
        else if (ret[i].indexOf("h264_unicast_port_ch4") == 0) objVOIP.h264_unicast_port_ch4 = ret[i].substring("h264_unicast_port_ch4".length + 1);
        else if (ret[i].indexOf("h264_unicast_audio_port_ch1") == 0) objVOIP.h264_unicast_audio_port_ch1 = ret[i].substring("h264_unicast_audio_port_ch1".length + 1);
        else if (ret[i].indexOf("h264_unicast_audio_port_ch2") == 0) objVOIP.h264_unicast_audio_port_ch2 = ret[i].substring("h264_unicast_audio_port_ch2".length + 1);
        else if (ret[i].indexOf("h264_unicast_audio_port_ch3") == 0) objVOIP.h264_unicast_audio_port_ch3 = ret[i].substring("h264_unicast_audio_port_ch3".length + 1);
        else if (ret[i].indexOf("h264_unicast_audio_port_ch4") == 0) objVOIP.h264_unicast_audio_port_ch4 = ret[i].substring("h264_unicast_audio_port_ch4".length + 1);
        else if (ret[i].indexOf("h264_multicast_addr_ch1") == 0) objVOIP.h264_multicast_addr_ch1 = ret[i].substring("h264_multicast_addr_ch1".length + 1);
        else if (ret[i].indexOf("h264_multicast_addr_ch2") == 0) objVOIP.h264_multicast_addr_ch2 = ret[i].substring("h264_multicast_addr_ch2".length + 1);
        else if (ret[i].indexOf("h264_multicast_addr_ch3") == 0) objVOIP.h264_multicast_addr_ch3 = ret[i].substring("h264_multicast_addr_ch3".length + 1);
        else if (ret[i].indexOf("h264_multicast_addr_ch4") == 0) objVOIP.h264_multicast_addr_ch4 = ret[i].substring("h264_multicast_addr_ch4".length + 1);
        else if (ret[i].indexOf("h264_multicast_port_ch1") == 0) objVOIP.h264_multicast_port_ch1 = ret[i].substring("h264_multicast_port_ch1".length + 1);
        else if (ret[i].indexOf("h264_multicast_port_ch2") == 0) objVOIP.h264_multicast_port_ch2 = ret[i].substring("h264_multicast_port_ch2".length + 1);
        else if (ret[i].indexOf("h264_multicast_port_ch3") == 0) objVOIP.h264_multicast_port_ch3 = ret[i].substring("h264_multicast_port_ch3".length + 1);
        else if (ret[i].indexOf("h264_multicast_port_ch4") == 0) objVOIP.h264_multicast_port_ch4 = ret[i].substring("h264_multicast_port_ch4".length + 1);
        else if (ret[i].indexOf("h264_multicast_ttl_ch1") == 0) objVOIP.h264_multicast_ttl_ch1 = ret[i].substring("h264_multicast_ttl_ch1".length + 1);
        else if (ret[i].indexOf("h264_multicast_ttl_ch2") == 0) objVOIP.h264_multicast_ttl_ch2 = ret[i].substring("h264_multicast_ttl_ch2".length + 1);
        else if (ret[i].indexOf("h264_multicast_ttl_ch3") == 0) objVOIP.h264_multicast_ttl_ch3 = ret[i].substring("h264_multicast_ttl_ch3".length + 1);
        else if (ret[i].indexOf("h264_multicast_ttl_ch4") == 0) objVOIP.h264_multicast_ttl_ch4 = ret[i].substring("h264_multicast_ttl_ch4".length + 1);
        else if (ret[i].indexOf("h265_transmit_ch1") == 0) objVOIP.h265_transmit_ch1 = ret[i].substring("h265_transmit_ch1".length + 1);
        else if (ret[i].indexOf("h265_rtsp_mode_ch1") == 0) objVOIP.h265_rtsp_mode_ch1 = ret[i].substring("h265_rtsp_mode_ch1".length + 1);
        else if (ret[i].indexOf("h265_resolution_ch1") == 0) objVOIP.h265_resolution_ch1 = ret[i].substring("h265_resolution_ch1".length + 1);
        else if (ret[i].indexOf("h265_f_priority_ch1") == 0) objVOIP.h265_f_priority_ch1 = ret[i].substring("h265_f_priority_ch1".length + 1);
        else if (ret[i].indexOf("h265_framerate_ch1") == 0) objVOIP.h265_framerate_ch1 = ret[i].substring("h265_framerate_ch1".length + 1);
        else if (ret[i].indexOf("h265_bandwidth_ch1") == 0) objVOIP.h265_bandwidth_ch1 = ret[i].substring("h265_bandwidth_ch1".length + 1);
        else if (ret[i].indexOf("h265_bandwidth_min_ch1") == 0) objVOIP.h265_bandwidth_min_ch1 = ret[i].substring("h265_bandwidth_min_ch1".length + 1);
        else if (ret[i].indexOf("h265_quality_ch1") == 0) objVOIP.h265_quality_ch1 = ret[i].substring("h265_quality_ch1".length + 1);
        else if (ret[i].indexOf("h265_unimulti_ch1") == 0) objVOIP.h265_unimulti_ch1 = ret[i].substring("h265_unimulti_ch1".length + 1);
        else if (ret[i].indexOf("h265_unicast_port_ch1") == 0) objVOIP.h265_unicast_port_ch1 = ret[i].substring("h265_unicast_port_ch1".length + 1);
        else if (ret[i].indexOf("h265_unicast_audio_port_ch1") == 0) objVOIP.h265_unicast_audio_port_ch1 = ret[i].substring("h265_unicast_audio_port_ch1".length + 1);
        else if (ret[i].indexOf("h265_multicast_addr_ch1") == 0) objVOIP.h265_multicast_addr_ch1 = ret[i].substring("h265_multicast_addr_ch1".length + 1);
        else if (ret[i].indexOf("h265_multicast_port_ch1") == 0) objVOIP.h265_multicast_port_ch1 = ret[i].substring("h265_multicast_port_ch1".length + 1);
        else if (ret[i].indexOf("h265_multicast_ttl_ch1") == 0) objVOIP.h265_multicast_ttl_ch1 = ret[i].substring("h265_multicast_ttl_ch1".length + 1);

        else if (ret[i].indexOf("h265_transmit_ch2") == 0) objVOIP.h265_transmit_ch2 = ret[i].substring("h265_transmit_ch2".length + 1);
        else if (ret[i].indexOf("h265_rtsp_mode_ch2") == 0) objVOIP.h265_rtsp_mode_ch2 = ret[i].substring("h265_rtsp_mode_ch2".length + 1);
        else if (ret[i].indexOf("h265_resolution_ch2") == 0) objVOIP.h265_resolution_ch2 = ret[i].substring("h265_resolution_ch2".length + 1);
        else if (ret[i].indexOf("h265_f_priority_ch2") == 0) objVOIP.h265_f_priority_ch2 = ret[i].substring("h265_f_priority_ch2".length + 1);
        else if (ret[i].indexOf("h265_framerate_ch2") == 0) objVOIP.h265_framerate_ch2 = ret[i].substring("h265_framerate_ch2".length + 1);
        else if (ret[i].indexOf("h265_bandwidth_ch2") == 0) objVOIP.h265_bandwidth_ch2 = ret[i].substring("h265_bandwidth_ch2".length + 1);
        else if (ret[i].indexOf("h265_bandwidth_min_ch2") == 0) objVOIP.h265_bandwidth_min_ch2 = ret[i].substring("h265_bandwidth_min_ch2".length + 1);
        else if (ret[i].indexOf("h265_quality_ch2") == 0) objVOIP.h265_quality_ch2 = ret[i].substring("h265_quality_ch2".length + 1);
        else if (ret[i].indexOf("h265_unimulti_ch2") == 0) objVOIP.h265_unimulti_ch2 = ret[i].substring("h265_unimulti_ch2".length + 1);
        else if (ret[i].indexOf("h265_unicast_port_ch2") == 0) objVOIP.h265_unicast_port_ch2 = ret[i].substring("h265_unicast_port_ch2".length + 1);
        else if (ret[i].indexOf("h265_unicast_audio_port_ch2") == 0) objVOIP.h265_unicast_audio_port_ch2 = ret[i].substring("h265_unicast_audio_port_ch2".length + 1);
        else if (ret[i].indexOf("h265_multicast_addr_ch2") == 0) objVOIP.h265_multicast_addr_ch2 = ret[i].substring("h265_multicast_addr_ch2".length + 1);
        else if (ret[i].indexOf("h265_multicast_port_ch2") == 0) objVOIP.h265_multicast_port_ch2 = ret[i].substring("h265_multicast_port_ch2".length + 1);
        else if (ret[i].indexOf("h265_multicast_ttl_ch2") == 0) objVOIP.h265_multicast_ttl_ch2 = ret[i].substring("h265_multicast_ttl_ch2".length + 1);

        else if (ret[i].indexOf("h264_profile_ch1") == 0) objVOIP.h264_profile_ch1 = ret[i].substring("h264_profile_ch1".length + 1);
        else if (ret[i].indexOf("h264_profile_ch2") == 0) objVOIP.h264_profile_ch2 = ret[i].substring("h264_profile_ch2".length + 1);
        else if (ret[i].indexOf("h264_profile_ch3") == 0) objVOIP.h264_profile_ch3 = ret[i].substring("h264_profile_ch3".length + 1);
        else if (ret[i].indexOf("h264_profile_ch4") == 0) objVOIP.h264_profile_ch4 = ret[i].substring("h264_profile_ch4".length + 1);
    }

    delete ret;
    if(sysStreamMode=="ndi_hx"){
        objVOIP.h264_transmit_ch2 = "0";
    }

    return objVOIP;
}
/**
 * update http live port
 */
function cparam_updateHttpInfo() {
    var url = "/cgi-bin/get_http_live_port";
    var ret = cparam_sendRequest(url);
    ret = cparam_getRetArray(ret);

    for (var i = 0; i < ret.length; i++) {
        var obj = ret[i].split('=');
        if (obj.length != 2) continue;

        var k = obj[0];
        var v = parseInt(obj[1]);

        if (k == "live") cparams.https = (obj[1] == "http" ? 0 : 1);
        else if (k == "http_port") cparams.http_port = v;
        else if (k == "https_port") cparams.https_port = v;
        else if (k == "rtsp_port") cparams.rtsp_port = v;
    }

    delete ret;
}

/**
 * send cgi commend : get_basic --- depend on url
 * @returns {{}}
 */
function cparam_getBasicInfo() {
    var url = "/cgi-bin/get_basic";
    var obj = {};
    var ret = cparam_sendRequest(url);

    obj.cam_title = "";
    obj.plugin_download = "disable";
    obj.plugin_disp = "0";

    if (ret) {
        ret = cparam_getRetArray(ret);
        for (var i = 0; i < ret.length; i++) {
            if (ret[i].indexOf("cam_title=") == 0) obj.cam_title = ret[i].substring("cam_title=".length);
            else if (ret[i].indexOf("plugin_download=") == 0) obj.plugin_download = ret[i].substring("plugin_download=".length);
            else if (ret[i].indexOf("plugin_disp=") == 0) obj.plugin_disp = ret[i].substring("plugin_disp=".length);
        }

        delete ret;
    }
    return obj;
}

/**
 * send cgi commend : get_basic --- depend on url
 * @returns {{}}
 */
function cparam_getSrtInfo() {
    var url = "/cgi-bin/get_srt_info";
    var obj = {};
    var ret = cparam_sendRequest(url);

    obj.mode = "";
    obj.dip_addr = "";
    obj.dport = "";
    obj.lport = "";
    obj.ttl = "";
    obj.latency = "";
    obj.encryption = "";
    obj.passphrase = "";
    obj.streamid = "";


    if (ret) {
        ret = cparam_getRetArray(ret);
        for (var i = 0; i < ret.length; i++) {
            if (ret[i].indexOf("mode=") == 0) obj.mode = ret[i].substring("mode=".length);
            else if (ret[i].indexOf("dip_addr=") == 0) obj.dip_addr = ret[i].substring("dip_addr=".length);
            else if (ret[i].indexOf("dport=") == 0) obj.dport = ret[i].substring("dport=".length);
            else if (ret[i].indexOf("lport=") == 0) obj.lport = ret[i].substring("lport=".length);
            else if (ret[i].indexOf("ttl=") == 0) obj.ttl = ret[i].substring("ttl=".length);
            else if (ret[i].indexOf("latency=") == 0) obj.latency = ret[i].substring("latency=".length);
            else if (ret[i].indexOf("encryption=") == 0) obj.encryption = ret[i].substring("encryption=".length);
            else if (ret[i].indexOf("passphrase=") == 0) obj.passphrase = ret[i].substring("passphrase=".length);
            else if (ret[i].indexOf("streamid=") == 0) obj.streamid = ret[i].substring("streamid=".length);
        }

        delete ret;
    }
    return obj;
}
/**
 * send cgi commend : get_basic --- depend on url
 * @returns {{}}
 */
function cparam_getTsInfo() {
    var url = "/cgi-bin/get_ts_udp_info";
    var obj = {};
    var ret = cparam_sendRequest(url);

    obj.tramsmission = "";
    obj.uni_addr = "";
    obj.uni_port = "";
    obj.multi_addr = "";
    obj.multi_port = "";
    obj.push = "";
    obj.multi_ttl = "";

    if (ret) {
        ret = cparam_getRetArray(ret);
        for (var i = 0; i < ret.length; i++) {
            if (ret[i].indexOf("tramsmission=") == 0) obj.tramsmission = ret[i].substring("tramsmission=".length);
            else if (ret[i].indexOf("uni_addr=") == 0) obj.uni_addr = ret[i].substring("uni_addr=".length);
            else if (ret[i].indexOf("uni_port=") == 0) obj.uni_port = ret[i].substring("uni_port=".length);
            else if (ret[i].indexOf("multi_addr=") == 0) obj.multi_addr = ret[i].substring("multi_addr=".length);
            else if (ret[i].indexOf("multi_port=") == 0) obj.multi_port = ret[i].substring("multi_port=".length);
            else if (ret[i].indexOf("push=") == 0) obj.push = ret[i].substring("push=".length);
            else if (ret[i].indexOf("multi_ttl=") == 0) obj.multi_ttl = ret[i].substring("multi_ttl=".length);
        }
        delete ret;
    }
    return obj;
}
/**
 * send cgi commend : getNdi --- depend on url
 * @returns {{}}
 */
function cparam_getNdiInfo() {
    const url = "/cgi-bin/get_ndi_info";
    let obj = {};
    let ret = cparam_sendRequest(url);

    obj.image_size = "";
    obj.un_transmit = "";
    obj.un_protocol = "";
    obj.mu_transmit = "";
    obj.mu_addr = "";
    obj.mu_subnet = "";
    obj.mu_ttl = "";
    obj.group_uses = "";
    obj.group_name = "";
    obj.server_uses = "";
    obj.server_addr = "";
    obj.source_name = "";

    if (ret) {
        ret = cparam_getRetArray(ret);
        for (let i = 0; i < ret.length; i++) {
            if (ret[i].indexOf("image_size=") == 0) obj.image_size = ret[i].substring("image_size=".length);
            else if (ret[i].indexOf("unicast_transmit=") == 0) obj.unicast_transmit = ret[i].substring("unicast_transmit=".length);
            else if (ret[i].indexOf("unicast_protocol=") == 0) obj.unicast_protocol = ret[i].substring("unicast_protocol=".length);
            else if (ret[i].indexOf("multicast_transmit=") == 0) obj.multicast_transmit = ret[i].substring("multicast_transmit=".length);
            else if (ret[i].indexOf("multicast_addr=") == 0) obj.multicast_addr = ret[i].substring("multicast_addr=".length);
            else if (ret[i].indexOf("multicast_subnet=") == 0) obj.multicast_subnet = ret[i].substring("multicast_subnet=".length);
            else if (ret[i].indexOf("multicast_ttl=") == 0) obj.multicast_ttl = ret[i].substring("multicast_ttl=".length);
            else if (ret[i].indexOf("group_uses=") == 0) obj.group_uses = ret[i].substring("group_uses=".length);
            else if (ret[i].indexOf("group_name=") == 0) obj.group_name = ret[i].substring("group_name=".length);
            else if (ret[i].indexOf("server_uses=") == 0) obj.server_uses = ret[i].substring("server_uses=".length);
            else if (ret[i].indexOf("server_addr=") == 0) obj.server_addr = ret[i].substring("server_addr=".length);
            else if (ret[i].indexOf("source_name=") == 0) obj.source_name = ret[i].substring("source_name=".length);
        }

        delete ret;
    }
    return obj;
}
/**
 * send cgi commend : getNdi --- depend on url
 * @returns {{}}
 */
function cparam_getNdi2Info() {
    const url = "/cgi-bin/get_ndi_hx_info";
    let obj = {};
    let ret = cparam_sendRequest(url);

    obj.un_transmit = "";
    obj.un_protocol = "";
    obj.mu_transmit = "";
    obj.mu_addr = "";
    obj.mu_subnet = "";
    obj.mu_ttl = "";
    obj.group_uses = "";
    obj.group_name = "";
    obj.server_uses = "";
    obj.server_addr = "";
    obj.source_name = "";

    if (ret) {
        ret = cparam_getRetArray(ret);
        for (let i = 0; i < ret.length; i++) {
            if (ret[i].indexOf("unicast_protocol=") == 0) obj.unicast_protocol = ret[i].substring("unicast_protocol=".length);
            else if (ret[i].indexOf("multicast_transmit=") == 0) obj.multicast_transmit = ret[i].substring("multicast_transmit=".length);
            else if (ret[i].indexOf("multicast_addr=") == 0) obj.multicast_addr = ret[i].substring("multicast_addr=".length);
            else if (ret[i].indexOf("multicast_subnet=") == 0) obj.multicast_subnet = ret[i].substring("multicast_subnet=".length);
            else if (ret[i].indexOf("multicast_ttl=") == 0) obj.multicast_ttl = ret[i].substring("multicast_ttl=".length);
            else if (ret[i].indexOf("group_uses=") == 0) obj.group_uses = ret[i].substring("group_uses=".length);
            else if (ret[i].indexOf("group_name=") == 0) obj.group_name = ret[i].substring("group_name=".length);
            else if (ret[i].indexOf("server_uses=") == 0) obj.server_uses = ret[i].substring("server_uses=".length);
            else if (ret[i].indexOf("server_addr=") == 0) obj.server_addr = ret[i].substring("server_addr=".length);
            else if (ret[i].indexOf("source_name=") == 0) obj.source_name = ret[i].substring("source_name=".length);
        }

        delete ret;
    }
    return obj;
}
/**
 * common : send cgi and get response
 * @param uri
 * @returns {*}
 */
function cparam_sendRequest(uri) {
    var reqobj = _cparam_createXMLHttpRequest(null);
    if (!reqobj) return;

    cparams.http_unauthorized = false;

    if("/cgi-bin/auth_live.cgi" == uri) return;

    try {
        reqobj.open("GET", uri, false);
        // try {
        //     if (typeof reqobj.timeout !== 'undefined') {
        //         reqobj.timeout = 5 * 1000;
        //     }
        // } catch (e) {
        // }

        reqobj.send(null);

        if (reqobj.readyState == 4 && reqobj.status == 200) {
            cparams.http_unauthorized = false;
            var resText = reqobj.responseText;
            delete reqobj;
            return resText;
        }
        else if (reqobj.status == 401) {

            cparams.http_unauthorized = true;
            delete reqobj;
            return "";
        } else {
            delete reqobj;
            return "";
        }
    }
    catch (e) {
        delete reqobj;
        return "";
    }
}

/**
 * send async request
 * @param uri
 * @param callback
 * @returns {string}
 */
function cparam_sendAsyncRequest(uri, callback) {
    var reqobj = _cparam_createXMLHttpRequest(null);
    if (!reqobj) return;

    cparams.http_unauthorized = false;

    try {
        reqobj.open("GET", uri, true);
        try {
            if (typeof reqobj.timeout !== 'undefined') {
                reqobj.timeout = 5 * 1000;
            }
        } catch (e) {
        }

        reqobj.onreadystatechange = function () {
            if (reqobj.readyState == 4 && reqobj.status == 200) {
                if (callback) callback(reqobj.responseText);
            }
        };

        reqobj.send(null);
    }
    catch (e) {
        delete reqobj;
        return "";
    }
}

/**
 * create XML Http Request
 * @param cbFunc
 * @returns {*}
 * @private
 */
function _cparam_createXMLHttpRequest(cbFunc) {
    var XMLhttpObject = null;
    try {
        XMLhttpObject = new XMLHttpRequest();
    } catch (e) {
        try {
            XMLhttpObject = new ActiveXObject("Msxml2.XMLHTTP");
        } catch (e) {
            try {
                XMLhttpObject = new ActiveXObject("Microsoft.XMLHTTP");
            } catch (e) {
                return null;
            }
        }
    }
    XMLhttpObject.onreadystatechange = cbFunc;
    return XMLhttpObject;
}

/**
 * Converted Array to string
 * @param ret
 * @param splStr
 * @returns {Array}
 */
function cparam_getRetArray(ret, splStr) {
    var spl = new Array("\r\r\n", "\r\n", "\r", "\n");
    var result = new Array(ret.toString());
    if (arguments.length == 1) {
        for (var i = 0; i < spl.length; i++) {
            if (ret.indexOf(spl[i]) != -1) {
                result = ret.split(spl[i]);
                break;
            }

        }
    }
    else if (arguments.length == 2) {
        result = ret.split(splStr);
    }
    else {
    }
    return result;
}



/**************************************live/live_frame_ctrl.html  start**************************************/
var gTagScnSelect;
var gTagPadTd;
var gTagPadImg;
var gTagPadMap;
var gTagPadCenter;
var gFlgSlow = false;

var DigitalExt = 0;
var AutoFocus = 0;
var AutoIris = 0;
var sPower = 1;
var gFlgDisableCamCtrl = false;
var gsPanTiltType = new Array('stop', 'up', 'dw', 'lt', 'rt', 'ul', 'ur', 'dl', 'dr');
var gTimerWaitStopZoomWheel;
var gbZoomWheelSpeedUp = false;
var gTimerDisableZoomWheel;
var ZOOM_WHEEL_STOP = 0;
var ZOOM_WHEEL_TELE = 1;
var ZOOM_WHEEL_WIDE = 2;
var ZOOM_WHEEL_INTERVAL_DSBL_LONG = 500;
var ZOOM_WHEEL_INTERVAL_WAIT_STOP = 300;
var ZOOM_WHEEL_INTERVAL_DSBL = 100;
var giZoomWheelState = ZOOM_WHEEL_STOP;
var isUE70;

/* { HE40V2-[15/03/25] */
var gFlagSceneDisable = false;

/**
 * send scene cgi commend depend on url
 * @param cmd_url
 */
function cparam_sceneChange(cmd_url) {

    if (gFlagSceneDisable == true) {
        return;
    }
    if (gFlgDisableCamCtrl == true) {
        return;
    } else {
        if (cmd_url != false) {
            $.get(cmd_url, function (data, status) {
            });
        }
    }
}

/**
 * change value of the select element of "scn_select"
 */
function cparam_changeScnSelect() {
    var scnSelectValue = $("#scn_select").val();
    switch (scnSelectValue){
        case 1:
            break;
    }
}


/**
 * init every pages at once
 * @constructor
 */
function InitAllPage() {
    cparam_updateCamControl();
    AutoIris = cparam_get_irismode();
    AutoFocus = cparam_get_focusMode();
    DigitalExt = cparam_get_digital14_20ExtenderOffOn();
    isUE70 = cparams.isUE70;
    try {
        sPower = menubarCtrl.GetPowerState();
    }
    catch (e) {
        sPower = gPower;
    }
    gScene = gScene;

    gTagPadTd = document.getElementById("pad");
    gTagPadImg = document.getElementById("control");
    gTagPadMap = document.getElementById("pnl_control");
    gTagPadCenter = document.getElementById("pad_center");

    // if ((gScene < 0) || (gScene > 4)) {
    //     gScene = 4;  // FullAuto
    // } else {
    //     // DO NOTHING
    // }

    gTagScnSelect = document.getElementById("scn_select");
    gTagScnSelect.value = gScene;
    $('.scene' + gScene +'_btn').removeClass('off');
    $('.scene' + gScene +'_btn').addClass('on');
    $('.txt_selectedScene > P').html(getTextBySceneMode(gScene));
    if (( sPower != 1 ) || ( menubarCtrl.menubar_GetOpLockState() == 1 )) {
        OpLockFunc();
    } else {
        ThisPageReload();
    }
    giInFLG = ChkTipInMode( cameraControllerSetting.gsVol[0] );
}

/**
 *
 * @param sData
 * @returns {number}
 * @constructor
 */
function ChkTipInMode( sData )
{
    var cCh = "line";
    if( sData.indexOf(cCh) != -1 )
    {
        return 1;
    }
    else
    {
        return 0;
    }
}

/**
 * release the lock of live
 * @constructor
 */
function OpLockFunc() {
    cameraControllerSetting.initControllerButtonsDisabled(isUE70);
    $("#power ").get(0).selectedIndex=1;
    gFlgDisableCamCtrl = true;
}

/**
 * the feasibility of set iris
 * @returns {boolean}
 */
function canSetIris() {
    // scene: not Fullauto, hdr: off, day/night:day
    // if (gScene != 4 && cparam_get_gammaMode() == 0 && cparams.sdrs == 0) {
    if (gScene != 4 && cparams.sdrs == 0) {
        return true;
    }
    return false;
}

/**
 * reload page and update buttons status
 */
function ThisPageReload() {
    if (sPower == 0) {
        return;
    } else { /* DO NOTHING */

    }
    cameraControllerSetting.initControllerButtons(AutoIris,DigitalExt,AutoFocus,gFlgSlow,isUE70);
    gFlgDisableCamCtrl = false;
}


/**************************************live/live_frame_ctrl.html    over**************************************/


/**************************************live/menubar.html start**************************************/
var giTrans     = 0;
var giTrans2    = 0;
var giTrans3    = 0;
var giTrans4    = 0;
var giAudioState = 0;
var gAudio = "in";

/**
 * judge if it is IE now
 * @returns {boolean}
 * @constructor
 */
function IsIE()
{
    var userAgent = window.navigator.userAgent.toLowerCase();
    var bwInfo;
    bwInfo = ( (userAgent.indexOf("MSIE") >= 0) || (userAgent.indexOf("trident") >= 0) );
    if ( bwInfo != false )
    {
        return true;
    }
    else
    {
        return false;
    }
}

// 1-1
// Scene
function cparam_get_sceneMode() {
    var scene_mode = null;
    scene_mode =  parseInt(_cparam_awCmd_sendRequset('QSF', 'OSF:'), 16) //+ 1;  // XSF:1 -> OSF:0, XSF:4 -> OSF:3
    // if (scene_mode < 1 || scene_mode > 4) {
    //     scene_mode = 4;
    // }
    return scene_mode;
}

function getTextBySceneMode(mode) {
    var str = '';
    switch (mode) {
        case 0:
            str = '1';
            break;
        case 1:
            str = '2';
        break;
        case 2:
            str = '3';
            break;
        case 3:
            str = '4';
            break;
        case 4:
            str = '5';
            break;
        case 5:
            str = '6';
            break;
        case 6:
            str = '7';
            break;
        case 7:
            str = '8';
            break;
        case 8:
            str = 'Off';
            break; 
        case 9:
            return str = '-';
    }

    return NPTZ_WORDING.wID_0168 + str;
}

function cparam_set_sceneMode(data) {
    return _cparam_awCmd_sendRequset('XSF:' + data, 'XSF:');
}

function cparam_set_storeSceneFile(data){
    return _cparam_awCmd_sendRequset('OSL:90:' + data, 'OSL:90:');
}

function cparam_set_loadSceneUser(data){
    return _cparam_awCmd_sendRequset('OSL:92:' + data, 'OSL:92:');
}

function cparam_set_storeSceneUser(data){
    return _cparam_awCmd_sendRequset('OSL:93:' + data, 'OSL:93:');
}

// 1-2
// Picture Level
function cparam_get_pictureLevel() {
    return parseInt(_cparam_awCmd_sendRequset('QSD:48', 'OSD:48:'), 16) - 50;
}

function cparam_set_pictureLevel(data) {

    // to hex data
    data = parseInt(data + 50).toString(16);
    // to cmd format
    data = ('00' + data).slice(-2).toUpperCase();
    return _cparam_awCmd_sendRequset('OSD:48:' + data, 'OSD:48:');
}

// 1-2
// PeakRatio
function cparam_get_PeakRatio() {
    return parseInt(_cparam_awCmd_sendRequset('QSL:29', 'OSL:29:'), 16);
}

function cparam_set_PeakRatio(data) {

    // to hex data
    data = parseInt(data).toString(16);
    // to cmd format
    data = ('00' + data).slice(-2).toUpperCase();
    return _cparam_awCmd_sendRequset('OSL:29:' + data, 'OSL:29:');
}

// 1-3
// Iris Mode
function cparam_get_irismode() {
    return parseInt(_cparam_awCmd_sendRequset('QRS', 'ORS:'), 16);
}

function cparam_set_irismode(data) {

    return _cparam_awCmd_sendRequset('ORS:' + data, 'ORS:');
}

// Iris Auto/Manual
function cparam_get_irisAutoManul() {
    return parseInt(_cparam_awCmd_sendRequset('#D3', 'd3'), 10);
}

function cparam_set_irisAutoManul(data) {

    return _cparam_awCmd_sendRequset('#D3' + data, 'd3');
}

// 1-4
// Auto Iris Speed
function cparam_get_irisAutoSpeed() {
    return parseInt(_cparam_awCmd_sendRequset('QSJ:01', 'OSJ:01:'), 16) + 1;
}

function cparam_set_irisAutoSpeed(data) {
    data -= 1;
    return _cparam_awCmd_sendRequset('OSJ:01:' + data, 'OSJ:01:');
}

// 1-5
// Auto Iris Window
function cparam_get_irisAutoWindow() {
    return parseInt(_cparam_awCmd_sendRequset('QSJ:02', 'OSJ:02:'), 16);
}

function cparam_set_irisAutoWindow(data) {

    return _cparam_awCmd_sendRequset('OSJ:02:' + data, 'OSJ:02:');
}

function cparam_get_irisClose() {
    return parseInt(_cparam_awCmd_sendRequset('QSJ:C0', 'OSJ:C0:'), 16);
}

function cparam_set_brightness_irisClose(data) {

    return _cparam_awCmd_sendRequset('OSJ:C0:' + data, 'OSJ:C0:');
}

function cparam_get_shutterSw() {
    return parseInt(_cparam_awCmd_sendRequset('QSG:59', 'OSG:59:'), 16);
}

function cparam_set_brightness_shutterSw(data) {

    return _cparam_awCmd_sendRequset('OSG:59:' + data, 'OSG:59:');
}

// 1-6
// Shutter Mode
function cparam_get_shutterMode() {
    return parseInt(_cparam_awCmd_sendRequset('QSG:5A', 'OSG:5A:'), 16);
}

function cparam_set_shutterMode(data) {

    return _cparam_awCmd_sendRequset('OSG:5A:' + data, 'OSG:5A:');
}
function cparam_get_shutterModeCameraControl() {
    return parseInt(_cparam_awCmd_sendRequset('QSJ:03', 'OSJ:03:'), 16);
}

function cparam_set_shutterModeCameraControl(data) {

    return _cparam_awCmd_sendRequset('OSJ:03:' + data, 'OSJ:03:');
}

// Step INC
function cparam_set_stepINC(data) {

    // to hex data
    data = parseInt(data).toString(16);
    // to cmd format
    data = ('00' + data).slice(-2).toUpperCase();
    return _cparam_awCmd_sendRequset('OSJ:04:' + data, 'OSJ:04:');
}
// Step DEC
function cparam_set_stepDEC(data) {

    // to hex data
    data = parseInt(data).toString(16);
    // to cmd format
    data = ('00' + data).slice(-2).toUpperCase();
    return _cparam_awCmd_sendRequset('OSJ:05:' + data, 'OSJ:05:');
}

// Step VAL
function cparam_get_stepVAL() {
    return parseInt(_cparam_awCmd_sendRequset('QSJ:06', 'OSJ:06:'), 16);
}

function cparam_set_stepVAL(data) {

    // to hex data
    data = parseInt(data).toString(16);
    // to cmd format
    data = ('0000' + data).slice(-4).toUpperCase();
    return _cparam_awCmd_sendRequset('OSJ:06:' + data, 'OSJ:06:');
}

// Synchro INC
function cparam_set_synchroINC(data) {

    // to hex data
    data = parseInt(data).toString(16);
    // to cmd format
    data = ('00' + data).slice(-2).toUpperCase();
    return _cparam_awCmd_sendRequset('OSJ:07:' + data, 'OSJ:07:');
}

// Synchro DEC
function cparam_set_synchroDEC(data) {

    // to hex data
    data = parseInt(data).toString(16);
    // to cmd format
    data = ('00' + data).slice(-2).toUpperCase();
    return _cparam_awCmd_sendRequset('OSJ:08:' + data, 'OSJ:08:');
}
// Synchro VAL
function cparam_get_synchroVAL() {
    var retValue = parseInt(_cparam_awCmd_sendRequset('QSJ:09', 'OSJ:09:'), 16) / 10;
    // to string
    retValue = retValue.toString();
    // to format
    if(retValue.indexOf(".") < 0) {
        retValue = retValue + ".0";
    } else {
        retValue = retValue + "0";
    }
    return  retValue.substring(0, retValue.indexOf(".") + 2);
}
function cparam_set_synchroVAL(data) {

    // to hex data
    data = parseInt(data * 10).toString(16);
    // to cmd format
    data = ('00000' + data).slice(-5).toUpperCase();
    return _cparam_awCmd_sendRequset('OSJ:09:' + data, 'OSJ:09:');
}


// 1-7
// ELC Limit
function cparam_get_ELCLimit() {
    return parseInt(_cparam_awCmd_sendRequset('QSD:BF', 'OSD:BF:'), 10);
}

function cparam_set_ELCLimit(data) {

    return _cparam_awCmd_sendRequset('OSD:BF:' + data, 'OSD:BF:');
}
// 1-8
// Gain
function cparam_get_gain() {
    var retValue = parseInt( _cparam_awCmd_sendRequset('QSL:25', 'OSL:25:'), 16);
    // Not AGC ON
    retValue = retValue -8;
    return retValue;
}

function cparam_set_gain(data) {   
    reqCgiObj.Gain = data;
    data = data + 8;
    data = parseInt(data).toString(16);
    data = ('00' + data).slice(-2).toUpperCase();
    return _cparam_awCmd_sendRequset('OSL:25:' + data, 'OSL:25:');
}
function cparam_get_gainCameraControl() {
    var retValue = parseInt( _cparam_awCmd_sendRequset('QGU', 'OGU:'), 16);
    // Not AGC ON
    if (retValue != 128) {
            retValue = retValue - 8;
    }else{
        retValue = -1;
    }
    return retValue;
}

function cparam_set_gainCameraControl(data) {   
    // if(data == -1){
    //     data = 128;
    //     data = parseInt(data).toString(16);
    // }
    // if (data != 128) {
    //     data = data + 8;
    // }
    // to hex data
    
    // to cmd format
    data = ('00' + data).slice(-2).toUpperCase();
    reqCgiObj.Gain = data;
    return _cparam_awCmd_sendRequset('OGU:' + data, 'OGU:');
}

function cparam_get_agc() {
    var retValue =  _cparam_awCmd_sendRequset('QSL:26', 'OSL:26:');
    return retValue;
}

function cparam_set_agc(data) {   
    return _cparam_awCmd_sendRequset('OSL:26:' + data, 'OSL:26:');
}

function cparam_get_autoShutter() {
    var retValue =  _cparam_awCmd_sendRequset('QSL:2E', 'OSL:2E:');
    return retValue;
}

function cparam_set_brightness_autoShutter(data) {   
    return _cparam_awCmd_sendRequset('OSL:2E:' + data, 'OSL:2E:');
}

// 1-9
// Super Gain
function cparam_get_superGain() {
    return parseInt(_cparam_awCmd_sendRequset('QSI:28', 'OSI:28:'), 10);
}

function cparam_set_superGain(data) {

    return _cparam_awCmd_sendRequset('OSI:28:' + data, 'OSI:28:');
}

// 1-10
// AGC Max Gain
function cparam_get_AGCMaxGain() {
    return parseInt(_cparam_awCmd_sendRequset('QSD:69', 'OSD:69:'), 10);
}

function cparam_set_AGCMaxGain(data) {

    // to cmd format
    data = ('00' + data).slice(-2).toUpperCase();
    return _cparam_awCmd_sendRequset('OSD:69:' + data, 'OSD:69:');
}

function cparam_get_frameMixSw() {
    return parseInt(_cparam_awCmd_sendRequset('QSL:27', 'OSL:27:'), 10);
}

function cparam_set_brightness_frameMixSw(data) {   
    return _cparam_awCmd_sendRequset('OSL:27:' + data, 'OSL:27:');
}
// 1-11
// Fram Mix
function cparam_get_framMix() {
    // return parseInt(_cparam_awCmd_sendRequset('QSA:65', 'OSA:65:'), 16);
    var retValue = parseInt(_cparam_awCmd_sendRequset('QSL:28', 'OSL:28:'), 16);
    retValue = retValue / 6 - 1;
    return retValue;
}

function cparam_set_framMix(hexData) {
    // // to hex data
    hexData = (parseInt(hexData) + 1)*6;
    hexData = parseInt(hexData).toString(16);
    // to cmd format
    hexData = ('00' + hexData).slice(-2).toUpperCase();
    return _cparam_awCmd_sendRequset('OSL:28:' + hexData, 'OSL:28:');
}

// 1-12
// ND Filter
function cparam_get_NDFilter() {
    return parseInt(_cparam_awCmd_sendRequset('QFT', 'OFT:'), 10);
}

function cparam_set_NDFilter(data) {

    return _cparam_awCmd_sendRequset('OFT:' + data, 'OFT:');
}

// F.Mix MAX
function cparam_get_FMIX() {
    return parseInt(_cparam_awCmd_sendRequset('QSE:74', 'OSE:74:'), 10);
}

function cparam_set_FMIX(data) {

    return _cparam_awCmd_sendRequset('OSE:74:' + data, 'OSE:74:');
}

// 1-13
// Day/Night
function cparam_get_dayNight() {
    return parseInt(_cparam_awCmd_sendRequset('#D6', 'd6'), 10);
}

function cparam_set_dayNight(data) {

    return _cparam_awCmd_sendRequset('#D6' + data, 'd6');
}

// 2-1
// White Balance Mode
function cparam_get_whiteBalanceModeCameraControl() {
    var retValue = parseInt(_cparam_awCmd_sendRequset('QAW', 'OAW:'), 10);
    if (retValue == 2 || retValue == 3) {
        retValue--;
    }
    return retValue;
}

function cparam_set_whiteBalanceModeCameraControl(data) {

    return _cparam_awCmd_sendRequset('OAW:' + data, 'OAW:');
}

// AWC/AWB SET
function cparam_set_AWCAWBSet() {
    var respCmd = _cparam_awCmd_NoData_sendRequset('OWS');
    return respCmd;
}
// ABB SET
function cparam_set_ABBSet() {
    var respCmd = _cparam_awCmd_NoData_sendRequset('OAS');
    return respCmd;
}

// COLOR TEMPERATURE　INC
function cparam_set_ColorTemperatureINC(data) {

    // to hex data
    data = parseInt(data).toString(16);
    // to cmd format
    data = ('0' + data).slice(-1).toUpperCase();
    return _cparam_awCmd_sendRequset('OSI:1E:' + data, 'OSI:1E:');
}

// COLOR TEMPERATURE　DEC
function cparam_set_ColorTemperatureDEC(data) {

    // to hex data
    data = parseInt(data).toString(16);
    // to cmd format
    data = ('0' + data).slice(-1).toUpperCase();
    return _cparam_awCmd_sendRequset('OSI:1F:' + data, 'OSI:1F:');
}
// 2-2
// COLOR TEMPERATURE
function cparam_get_ColorTemperature() {
    var retValue = _cparam_awCmd_sendRequset('QSI:20', 'OSI:20:');
    if (retValue) {
        // Data1
        return parseInt(retValue.substr(0, 5), 16);
    }
    return retValue;
}
// 3-1
// COLOR TEMPERATURE SETTING
function cparam_get_ColorTemperatureSetting() {
    var retValue = _cparam_awCmd_sendRequset('QSJ:4A', 'OSJ:4A:');
    if (retValue) {
        // Data1
        return parseInt(retValue.substr(0, 5), 16);
    }
    return retValue;
}
function cparam_set_ColorTemperature(data) {

    // to hex data
    data = parseInt(data).toString(16);
    // to cmd format
    data = ('00000' + data).slice(-5).toUpperCase();
    // plug data2
    data = data + ':0'; // UE150では、Data2は常に0(Valid)とする
    return _cparam_awCmd_sendRequset('OSI:20:' + data, 'OSI:20:');
}
function cparam_set_ColorTemperatureSetting(data) {
    // to hex data
    data = parseInt(data).toString(16);
    // to cmd format
    data = ('00000' + data).slice(-5).toUpperCase();
    // plug data2
    data = data + ':0'; // UE150では、Data2は常に0(Valid)とする
    return _cparam_awCmd_sendRequset('OSJ:4A:' + data, 'OSJ:4A:');
}
// 2-4
// R Gain
function cparam_get_RGain() {
    return parseInt(_cparam_awCmd_sendRequset('QSG:39', 'OSG:39:'), 16) - 0x800;
}

// 2-4
// R Gain
function cparam_get_Color_RGain() {
    return parseInt(_cparam_awCmd_sendRequset('QSJ:4B', 'OSJ:4B:'), 16) - 0x800;
}

// 2-4
// B Gain
function cparam_get_Color_BGain() {
    return parseInt(_cparam_awCmd_sendRequset('QSJ:4C', 'OSJ:4C:'), 16) - 0x800;
}
// 2-4
// G Gain
function cparam_get_Color_GAxis() {
    return parseInt(_cparam_awCmd_sendRequset('QSJ:4D', 'OSJ:4D:'), 16) - 0x800;
}
function cparam_set_RGain(data) {

    // to hex data
    data = parseInt(data + 0x800).toString(16);
    // to cmd format
    data = ('000' + data).slice(-3).toUpperCase();
    return _cparam_awCmd_sendRequset('OSG:39:' + data, 'OSG:39:');
}

function cparam_set_Color_RGain(data) {

    // to hex data
    data = parseInt(data + 0x800).toString(16);
    // to cmd format
    data = ('000' + data).slice(-3).toUpperCase();
    return _cparam_awCmd_sendRequset('OSJ:4B:' + data, 'OSJ:4B:');
}
function cparam_set_Color_BGain(data) {

    // to hex data
    data = parseInt(data + 0x800).toString(16);
    // to cmd format
    data = ('000' + data).slice(-3).toUpperCase();
    return _cparam_awCmd_sendRequset('OSJ:4C:' + data, 'OSJ:4C:');
}
function cparam_set_Color_GAxis(data) {

    // to hex data
    data = parseInt(data + 0x800).toString(16);
    // to cmd format
    data = ('000' + data).slice(-3).toUpperCase();
    return _cparam_awCmd_sendRequset('OSJ:4D:' + data, 'OSJ:4D:');
}
// 2-5
// B Gain
function cparam_get_BGain() {
    return parseInt(_cparam_awCmd_sendRequset('QSG:3A', 'OSG:3A:'), 16) - 0x800;
}

function cparam_set_BGain(data) {

    // to hex data
    data = parseInt(data + 0x800).toString(16);
    // to cmd format
    data = ('000' + data).slice(-3).toUpperCase();
    return _cparam_awCmd_sendRequset('OSG:3A:' + data, 'OSG:3A:');
}

// 2-6
// AWB Gain Offset
function cparam_get_AWBGainOffset() {
    return parseInt(_cparam_awCmd_sendRequset('QSJ:0C', 'OSJ:0C:'), 16);
}

function cparam_set_AWBGainOffset(data) {

    return _cparam_awCmd_sendRequset('OSJ:0C:' + data, 'OSJ:0C:');
}
// 2-7
// ATW Speed
function cparam_get_ATWSpeed() {
    return parseInt(_cparam_awCmd_sendRequset('QSI:25', 'OSI:25:'), 10);
}

function cparam_set_ATWSpeed(data) {

    return _cparam_awCmd_sendRequset('OSI:25:' + data, 'OSI:25:');
}

// 2-8
// ATW Target R
function cparam_get_ATWTargetR() {
    return parseInt(_cparam_awCmd_sendRequset('QSJ:0D', 'OSJ:0D:'), 16) - 0x80;
}

function cparam_set_ATWTargetR(data) {

    // to hex data
    data = parseInt(data + 0x80).toString(16);
    // to cmd format
    data = ('00' + data).slice(-2).toUpperCase();
    return _cparam_awCmd_sendRequset('OSJ:0D:' + data, 'OSJ:0D:');
}

// 2-9
// ATW Target B
function cparam_get_ATWTargetB() {
    return parseInt(_cparam_awCmd_sendRequset('QSJ:0E', 'OSJ:0E:'), 16) - 0x80;
}

function cparam_set_ATWTargetB(data) {

    // to hex data
    data = parseInt(data + 0x80).toString(16);
    // to cmd format
    data = ('00' + data).slice(-2).toUpperCase();
    return _cparam_awCmd_sendRequset('OSJ:0E:' + data, 'OSJ:0E:');
}

// 2-10
// Chroma Level
function cparam_get_chromaLevel() {
    return parseInt(_cparam_awCmd_sendRequset('QSL:B0', 'OSL:B0:'), 16) - 0x80;
}

function cparam_set_chromaLevel(data) {

    // to hex data
    data = parseInt(parseInt(data) + 0x80).toString(16);
    // to cmd format
    data = ('00' + data).slice(-2).toUpperCase();
    return _cparam_awCmd_sendRequset('OSL:B0:' + data, 'OSL:B0:');
}

// 2-11
// Chroma Phase
function cparam_get_chromaPhase() {
    return parseInt(_cparam_awCmd_sendRequset('QSJ:0B', 'OSJ:0B:'), 16) - 0x80;
}

function cparam_set_chromaPhase(data) {

    // to hex data
    data = parseInt(data + 0x80).toString(16);
    // to cmd format
    data = ('00' + data).slice(-2).toUpperCase();
    return _cparam_awCmd_sendRequset('OSJ:0B:' + data, 'OSJ:0B:');
}
// 2-12
// Master Pedestal
function cparam_get_masterPedestal() {
    return parseInt(_cparam_awCmd_sendRequset('QSJ:0F', 'OSJ:0F:'), 16) - 0x800;
}

function cparam_set_masterPedestal(data) {

    // to hex data
    data = parseInt(data + 0x800).toString(16);
    // to cmd format
    data = ('000' + data).slice(-3).toUpperCase();
    return _cparam_awCmd_sendRequset('OSJ:0F:' + data, 'OSJ:0F:');
}
// 2-13
// R Pedestal
function cparam_get_RPedestal() {
    return parseInt(_cparam_awCmd_sendRequset('QSG:4C', 'OSG:4C:'), 16) - 0x800;
}

function cparam_set_RPedestal(data) {

    // to hex data
    data = parseInt(data + 0x800).toString(16);
    // to cmd format
    data = ('000' + data).slice(-3).toUpperCase();
    return _cparam_awCmd_sendRequset('OSG:4C:' + data, 'OSG:4C:');
}
// 2-14
// G Pedestal
function cparam_get_GPedestal() {
    return parseInt(_cparam_awCmd_sendRequset('QSG:4D', 'OSG:4D:'), 16) - 0x800;
}

function cparam_set_GPedestal(data) {

    // to hex data
    data = parseInt(data + 0x800).toString(16);
    // to cmd format
    data = ('000' + data).slice(-3).toUpperCase();
    return _cparam_awCmd_sendRequset('OSG:4D:' + data, 'OSG:4D:');
}

// 2-15
// B Pedestal
function cparam_get_BPedestal() {
    return parseInt(_cparam_awCmd_sendRequset('QSG:4E', 'OSG:4E:'), 16) - 0x800;
}

function cparam_set_BPedestal(data) {

    // to hex data
    data = parseInt(data + 0x800).toString(16);
    // to cmd format
    data = ('000' + data).slice(-3).toUpperCase();
    return _cparam_awCmd_sendRequset('OSG:4E:' + data, 'OSG:4E:');
}
// 2-16
// Pedestal Offset
function cparam_get_pedestalOffset() {
    return parseInt(_cparam_awCmd_sendRequset('QSJ:11', 'OSJ:11:'), 10);
}

function cparam_set_pedestalOffset(data) {

    return _cparam_awCmd_sendRequset('OSJ:11:' + data, 'OSJ:11:');
}

// 2-17
// Detail
function cparam_get_detail() {
    var retValue = parseInt(_cparam_awCmd_sendRequset('QDT', 'ODT:'), 10);
    return (retValue == 0) ? 0 : 1;
}

function cparam_set_detail(data) {

    return _cparam_awCmd_sendRequset('ODT:' + data, 'ODT:');
}
function cparam_get_levelDependentSwitch() {
    var retValue = parseInt(_cparam_awCmd_sendRequset('QSG:3E', 'OSG:3E:'), 10);
    return (retValue == 0) ? 0 : 1;
}

function cparam_set_levelDependentSwitch(data) {

    return _cparam_awCmd_sendRequset('OSG:3E:' + data, 'OSG:3E:');
}
function cparam_get_downconLevelDependentSwitch() {
    var retValue = parseInt(_cparam_awCmd_sendRequset('QSL:5C', 'OSL:5C:'), 10);
    return (retValue == 0) ? 0 : 1;
}

function cparam_set_downconLevelDependentSwitch(data) {

    return _cparam_awCmd_sendRequset('OSL:5C:' + data, 'OSL:5C:');
}
//DARK DETAIL SWITCH
function cparam_get_darkDetailSwitch() {
    var retValue = parseInt(_cparam_awCmd_sendRequset('QSL:4D', 'OSL:4D:'), 10);
    return (retValue == 0) ? 0 : 1;
}

function cparam_set_darkDetailSwitch(data) {
    return _cparam_awCmd_sendRequset('OSL:4D:' + data, 'OSL:4D:');
}
//DARK DETAIL SWITCH
function cparam_get_downconDarkDetailSwitch() {
    var retValue = parseInt(_cparam_awCmd_sendRequset('QSL:5E', 'OSL:5E:'), 10);
    return (retValue == 0) ? 0 : 1;
}

function cparam_set_downconDarkDetailSwitch(data) {
    return _cparam_awCmd_sendRequset('OSL:5E:' + data, 'OSL:5E:');
}
//SKIN TONE SWITCH
function cparam_get_skinToneSwitch() {
    var retValue = parseInt(_cparam_awCmd_sendRequset('QSL:60', 'OSL:60:'), 10);
    return (retValue == 0) ? 0 : 1;
}

function cparam_set_skinToneSwitch(data) {
    return _cparam_awCmd_sendRequset('OSL:60:' + data, 'OSL:60:');
}
//MEMORY SELECT SWITCH
function cparam_get_memorySelectSwitch() {
    var retValue = parseInt(_cparam_awCmd_sendRequset('QSL:B1', 'OSL:B1:'), 10);
    return retValue;
}

function cparam_set_memorySelectSwitch(data) {
    return _cparam_awCmd_sendRequset('OSL:B1:' + data, 'OSL:B1:');
}
//Skin Tone detail MEMORY SELECT SWITCH
function cparam_get_skinToneDetailMemorySelectSwitch() {
    var retValue = parseInt(_cparam_awCmd_sendRequset('QSL:69', 'OSL:69:'), 10);
    return retValue;
}

function cparam_set_skinToneDetailMemorySelectSwitch(data) {
    return _cparam_awCmd_sendRequset('OSL:69:' + data, 'OSL:69:');
}
//zebra SWITCH
function cparam_get_downconZebra() {
    var retValue = parseInt(_cparam_awCmd_sendRequset('QSL:61', 'OSL:61:'), 10);
    return (retValue == 0) ? 0 : 1;
}

function cparam_set_downconZebra(data) {
    return _cparam_awCmd_sendRequset('OSL:61:' + data, 'OSL:61:');
}
//zebra SWITCH
function cparam_get_zebra() {
    var retValue = parseInt(_cparam_awCmd_sendRequset('QSA:49', 'OSA:49:'), 10);
    return (retValue == 0) ? 0 : 1;
}

function cparam_set_zebra(data) {
    return _cparam_awCmd_sendRequset('OSA:49:' + data, 'OSA:49:');
}
//zebra effect memory SWITCH
function cparam_get_zebraEffectMemory() {
    var retValue = parseInt(_cparam_awCmd_sendRequset('QSL:62', 'OSL:62:'), 10);
    return retValue;
}

function cparam_set_zebraEffectMemory(data) {
    return _cparam_awCmd_sendRequset('OSL:62:' + data, 'OSL:62:');
}
//zebra effect memory SWITCH
function cparam_get_toneZebraEffectMemory() {
    var retValue = parseInt(_cparam_awCmd_sendRequset('QSL:6A', 'OSL:6A:'), 10);
    return retValue;
}

function cparam_set_toneZebraEffectMemory(data) {
    return _cparam_awCmd_sendRequset('OSL:6A:' + data, 'OSL:6A:');
}
//zebra effect memory SWITCH
function cparam_get_toneEffectMemory() {
    var retValue = parseInt(_cparam_awCmd_sendRequset('QSG:48', 'OSG:48:'), 10);
    return retValue;
}

function cparam_set_toneEffectMemory(data) {
    return _cparam_awCmd_sendRequset('OSG:48:' + data, 'OSG:48:');
}
//skin tone effect memory SWITCH
function cparam_get_skinToneEffectMemory() {
    var retValue = parseInt(_cparam_awCmd_sendRequset('QSL:63', 'OSL:63:'), 10);
    return retValue;
}

function cparam_set_skinToneffectMemory(data) {
    return _cparam_awCmd_sendRequset('OSL:63:' + data, 'OSL:63:');
}
//skin tone detail
function cparam_get_skinToneDetail() {
    var retValue = parseInt(_cparam_awCmd_sendRequset('QSA:40', 'OSA:40:'), 10);
    return retValue;
}

function cparam_set_skinToneDetail(data) {
    return _cparam_awCmd_sendRequset('OSA:40:' + data, 'OSA:40:');
}
//DARK DETAIL SWITCH
function cparam_get_downconDetail() {
    var retValue = parseInt(_cparam_awCmd_sendRequset('QSJ:14', 'OSJ:14:'), 10);
    return (retValue == 0) ? 0 : 1;
}

function cparam_set_downconDetail(data) {
    return _cparam_awCmd_sendRequset('OSJ:14:' + data, 'OSJ:14:');
}
//CHROMA LEVEL SWITCH
function cparam_get_downconchromaLevelSwitch() {
    var retValue = parseInt(_cparam_awCmd_sendRequset('QSL:4F', 'OSL:4F:'), 10);
    return (retValue == 0) ? 0 : 1;
}

function cparam_set_downconchromaLevelSwitch(data) {
    return _cparam_awCmd_sendRequset('OSL:4F:' + data, 'OSL:4F:');
}
// 2-18
// Master Detail
function cparam_get_DetailmasterDetail() {
    return parseInt(_cparam_awCmd_sendRequset('QSA:30', 'OSA:30:'), 16) - 0x80;
}

function cparam_set_DetailmasterDetail(data) {

    // to hex data
    data = parseInt(data + 0x80).toString(16);
    // to cmd format
    data = ('00' + data).slice(-2).toUpperCase();
    return _cparam_awCmd_sendRequset('OSA:30:' + data, 'OSA:30:');
}
// downcon peak frequency
function cparam_get_downconPeakFrequency() {
    return parseInt(_cparam_awCmd_sendRequset('QSL:52', 'OSL:52:'), 16) / 10;
}

function cparam_set_downconPeakFrequency(data) {
    // to hex data
    data = parseInt(data * 10).toString(16);
    // to cmd format
    data = ('000' + data).slice(-3).toUpperCase();
    return _cparam_awCmd_sendRequset('OSL:52:' + data, 'OSL:52:');
}
// downcon v detail frequency
function cparam_get_downconVDetailFrequency() {
    return parseInt(_cparam_awCmd_sendRequset('QSL:53', 'OSL:53:'), 16) ;
}

function cparam_set_downconVDetailFrequency(data) {
    // to hex data
    data = parseInt(data).toString(16);
    // to cmd format
    data = ('00' + data).slice(-2).toUpperCase();
    return _cparam_awCmd_sendRequset('OSL:53:' + data, 'OSL:53:');
}
// downcon crisp
function cparam_get_downconCrisp() {
    return parseInt(_cparam_awCmd_sendRequset('QSL:54', 'OSL:54:'), 16 ) - 0x80;
}

function cparam_set_downconCrisp(data) {
    // to hex data
    data = parseInt(data + 0x80).toString(16);
    // to cmd format
    data = ('00' + data).slice(-2).toUpperCase();
    return _cparam_awCmd_sendRequset('OSL:54:' + data, 'OSL:54:');
}
// detail level
function cparam_get_downconHDetailLevel() {
    return parseInt(_cparam_awCmd_sendRequset('QSL:51', 'OSL:51:'), 16) - 0x80;
}
function cparam_set_downconHDetailLevel(data) {

    // to hex data
    data = parseInt(data + 0x80).toString(16);
    // to cmd format
    data = ('00' + data).slice(-2).toUpperCase();
    return _cparam_awCmd_sendRequset('OSL:51:' + data, 'OSL:51:');
}
function cparam_get_downconVDetailLevel() {
    return parseInt(_cparam_awCmd_sendRequset('QSJ:17', 'OSJ:17:'), 16) - 0x80; 
}

function cparam_set_downconVDetailLevel(data) {

    // to hex data
    data = parseInt(data + 0x80).toString(16);
    // to cmd format
    data = ('00' + data).slice(-2).toUpperCase();
    return _cparam_awCmd_sendRequset('OSJ:17:' + data, 'OSJ:17:');
}
// peak frequency
function cparam_get_peakFrequency() {
    return parseInt(_cparam_awCmd_sendRequset('QSG:30', 'OSG:30:'), 16);
}

function cparam_set_peakFrequency(data) {

    // to hex data
    data = parseInt(data).toString(16);
    // to cmd format
    data = ('00' + data).slice(-2).toUpperCase();
    return _cparam_awCmd_sendRequset('OSG:30:' + data, 'OSG:30:');
}

// crisp
function cparam_get_crisp() {
    return parseInt(_cparam_awCmd_sendRequset('QSD:22', 'OSD:22:'), 16);
}

function cparam_set_crisp(data) {

    // to hex data
    data = parseInt(data).toString(16);
    // to cmd format
    data = ('00' + data).slice(-2).toUpperCase();
    return _cparam_awCmd_sendRequset('OSD:22:' + data, 'OSD:22:');
}
// gain +
function cparam_get_gainPlus() {
    return parseInt(_cparam_awCmd_sendRequset('QSA:38', 'OSA:38:'), 16) - 128;
}

function cparam_set_gainPlus(data) {

    // to hex data
    data = parseInt(data + 0x80).toString(16);
    // to cmd format
    data = ('00' + data).slice(-2).toUpperCase();
    return _cparam_awCmd_sendRequset('OSA:38:' + data, 'OSA:38:');
}
// gain -
function cparam_get_gainMinus() {
    return parseInt(_cparam_awCmd_sendRequset('QSA:39', 'OSA:39:'), 16) - 128;
}

function cparam_set_gainMinus(data) {

    // to hex data
    data = parseInt(data + 0x80).toString(16);
    // to cmd format
    data = ('00' + data).slice(-2).toUpperCase();
    return _cparam_awCmd_sendRequset('OSA:39:' + data, 'OSA:39:');
}
// master detail -
function cparam_get_masterDetail() {
    return parseInt(_cparam_awCmd_sendRequset('QSJ:15', 'OSJ:15:'), 16) - 128;
}

function cparam_set_masterDetail(data) {

    // to hex data
    data = parseInt(data + 0x80).toString(16);
    // to cmd format
    data = ('00' + data).slice(-2).toUpperCase();
    return _cparam_awCmd_sendRequset('OSJ:15:' + data, 'OSJ:15:');
}
// chroma level -
function cparam_get_downconchromaLevel() {
    return parseInt(_cparam_awCmd_sendRequset('QSL:50', 'OSL:50:'), 16) - 128;
}

function cparam_set_downconchromaLevel(data) {

    // to hex data
    data = parseInt(data + 0x80).toString(16);
    // to cmd format
    data = ('00' + data).slice(-2).toUpperCase();
    return _cparam_awCmd_sendRequset('OSL:50:' + data, 'OSL:50:');
}
// detail clip +
function cparam_get_detailClipPlus() {
    return parseInt(_cparam_awCmd_sendRequset('QSG:40', 'OSG:40:'), 16);
}

function cparam_set_detailClipPlus(data) {

    // to hex data
    data = parseInt(data).toString(16);
    // to cmd format
    data = ('00' + data).slice(-2).toUpperCase();
    return _cparam_awCmd_sendRequset('OSG:40:' + data, 'OSG:40:');
}
// detail clip +
function cparam_get_detailDownconClipPlus() {
    return parseInt(_cparam_awCmd_sendRequset('QSL:57', 'OSL:57:'), 16) - 0x80;
}

function cparam_set_detailDownconClipPlus(data) {

    // to hex data
    data = parseInt(data + 0x80).toString(16);
    // to cmd format
    data = ('00' + data).slice(-2).toUpperCase();
    return _cparam_awCmd_sendRequset('OSL:57:' + data, 'OSL:57:');
}
// detail clip -
function cparam_get_detailClipMinus() {
    return parseInt(_cparam_awCmd_sendRequset('QSG:41', 'OSG:41:'), 16);
}

function cparam_set_detailClipMinus(data) {

    // to hex data
    data = parseInt(data).toString(16);
    // to cmd format
    data = ('00' + data).slice(-2).toUpperCase();
    return _cparam_awCmd_sendRequset('OSG:41:' + data, 'OSG:41:');
}
// detail clip -
function cparam_get_detailDownconClipMinus() {
    return parseInt(_cparam_awCmd_sendRequset('QSL:58', 'OSL:58:'), 16) - 0x80;
}

function cparam_set_detailDownconClipMinus(data) {

    // to hex data
    data = parseInt(data + 0x80).toString(16);
    // to cmd format
    data = ('00' + data).slice(-2).toUpperCase();
    return _cparam_awCmd_sendRequset('OSL:58:' + data, 'OSL:58:');
}
// detail knee aperture level
function cparam_get_detailKneeApertureLevel() {
    return parseInt(_cparam_awCmd_sendRequset('QSG:3F', 'OSG:3F:'), 16);
}

function cparam_set_detailKneeApertureLevel(data) {

    // to hex data
    data = parseInt(data).toString(16);
    // to cmd format
    data = ('00' + data).slice(-2).toUpperCase();
    return _cparam_awCmd_sendRequset('OSG:3F:' + data, 'OSG:3F:');
}
// detail knee aperture level
function cparam_get_detailDownconKneeApertureLevel() {
    return parseInt(_cparam_awCmd_sendRequset('QSL:5A', 'OSL:5A:'), 16);
}

function cparam_set_detailDownconKneeApertureLevel(data) {

    // to hex data
    data = parseInt(data).toString(16);
    // to cmd format
    data = ('00' + data).slice(-2).toUpperCase();
    return _cparam_awCmd_sendRequset('OSL:5A:' + data, 'OSL:5A:');
}
// detail knee
function cparam_get_detailKnee() {
    return parseInt(_cparam_awCmd_sendRequset('QSL:4C', 'OSL:4C:'), 16);
}

function cparam_set_detailKnee(data) {

    // to hex data
    data = parseInt(data).toString(16);
    // to cmd format
    data = ('00' + data).slice(-2).toUpperCase();
    return _cparam_awCmd_sendRequset('OSL:4C:' + data, 'OSL:4C:');
}
// detail knee
function cparam_get_detailDownconKnee() {
    return parseInt(_cparam_awCmd_sendRequset('QSL:5B', 'OSL:5B:'), 16);
}

function cparam_set_detailDownconKnee(data) {

    // to hex data
    data = parseInt(data).toString(16);
    // to cmd format
    data = ('00' + data).slice(-2).toUpperCase();
    return _cparam_awCmd_sendRequset('OSL:5B:' + data, 'OSL:5B:');
}
// detail knee
function cparam_get_detailLevelDependent() {
    return parseInt(_cparam_awCmd_sendRequset('QSD:26', 'OSD:26:'), 16);
}

function cparam_set_detailLevelDependent(data) {

    // to hex data
    data = parseInt(data).toString(16);
    // to cmd format
    data = ('00' + data).slice(-2).toUpperCase();
    return _cparam_awCmd_sendRequset('OSD:26:' + data, 'OSD:26:');
}
function cparam_get_downconLevelDependent() {
    return parseInt(_cparam_awCmd_sendRequset('QSL:5D', 'OSL:5D:'), 16);
}

function cparam_set_downconLevelDependent(data) {

    // to hex data
    data = parseInt(data).toString(16);
    // to cmd format
    data = ('00' + data).slice(-2).toUpperCase();
    return _cparam_awCmd_sendRequset('OSL:5D:' + data, 'OSL:5D:');
}
// dark detail 
function cparam_get_DarkDetail() {
    return parseInt(_cparam_awCmd_sendRequset('QSL:4E', 'OSL:4E:'), 16);
}

function cparam_set_DarkDetail(data) {

    // to hex data
    data = parseInt(data).toString(16);
    // to cmd format
    // data = ('00' + data).slice(-2).toUpperCase();
    return _cparam_awCmd_sendRequset('OSL:4E:' + data, 'OSL:4E:');
}
// dark detail 
function cparam_get_downconDarkDetail() {
    return parseInt(_cparam_awCmd_sendRequset('QSL:5F', 'OSL:5F:'), 16);
}

function cparam_set_downconDarkDetail(data) {

    // to hex data
    data = parseInt(data).toString(16);
    // to cmd format
    // data = ('00' + data).slice(-2).toUpperCase();
    return _cparam_awCmd_sendRequset('OSL:5F:' + data, 'OSL:5F:');
}
// downcon i center 
function cparam_get_downconICenter() {
    return parseInt(_cparam_awCmd_sendRequset('QSL:65', 'OSL:65:'), 16);
}

function cparam_set_downconICenter(data) {

    // to hex data
    data = parseInt(data).toString(16);
    // to cmd format
    data = ('00' + data).slice(-2).toUpperCase();
    return _cparam_awCmd_sendRequset('OSL:65:' + data, 'OSL:65:');
}
// downcon i width 
function cparam_get_downconIWidth() {
    return parseInt(_cparam_awCmd_sendRequset('QSL:66', 'OSL:66:'), 16);
}

function cparam_set_downconIWidth(data) {

    // to hex data
    data = parseInt(data).toString(16);
    // to cmd format
    data = ('00' + data).slice(-2).toUpperCase();
    return _cparam_awCmd_sendRequset('OSL:66:' + data, 'OSL:66:');
}
// downcon q width 
function cparam_get_downconQWidth() {
    return parseInt(_cparam_awCmd_sendRequset('QSL:67', 'OSL:67:'), 16);
}

function cparam_set_downconQWidth(data) {

    // to hex data
    data = parseInt(data).toString(16);
    // to cmd format
    data = ('00' + data).slice(-2).toUpperCase();
    return _cparam_awCmd_sendRequset('OSL:67:' + data, 'OSL:67:');
}
// downcon q phase 
function cparam_get_downconQPhase() {
    return parseInt(_cparam_awCmd_sendRequset('QSL:68', 'OSL:68:'), 16);
}

function cparam_set_downconQPhase(data) {

    // to hex data
    data = parseInt(data).toString(16);
    // to cmd format
    data = ('000' + data).slice(-3).toUpperCase();
    return _cparam_awCmd_sendRequset('OSL:68:' + data, 'OSL:68:');
}
// skinTone i center 
function cparam_get_skinToneICenter() {
    return parseInt(_cparam_awCmd_sendRequset('QSA:45', 'OSA:45:'), 16);
}

function cparam_set_skinToneICenter(data) {

    // to hex data
    data = parseInt(data).toString(16);
    // to cmd format
    data = ('00' + data).slice(-2).toUpperCase();
    return _cparam_awCmd_sendRequset('OSA:45:' + data, 'OSA:45:');
}
// skinTone i width 
function cparam_get_skinToneIWidth() {
    return parseInt(_cparam_awCmd_sendRequset('QSA:46', 'OSA:46:'), 16);
}

function cparam_set_skinToneIWidth(data) {

    // to hex data
    data = parseInt(data).toString(16);
    // to cmd format
    data = ('00' + data).slice(-2).toUpperCase();
    return _cparam_awCmd_sendRequset('OSA:46:' + data, 'OSA:46:');
}
// skinTone q width 
function cparam_get_skinToneQWidth() {
    return parseInt(_cparam_awCmd_sendRequset('QSA:47', 'OSA:47:'), 16);
}

function cparam_set_skinToneQWidth(data) {

    // to hex data
    data = parseInt(data).toString(16);
    // to cmd format
    data = ('00' + data).slice(-2).toUpperCase();
    return _cparam_awCmd_sendRequset('OSA:47:' + data, 'OSA:47:');
}
// skinTone q phase 
function cparam_get_skinToneQPhase() {
    return parseInt(_cparam_awCmd_sendRequset('QSG:4F', 'OSG:4F:'), 16);
}

function cparam_set_skinToneQPhase(data) {

    // to hex data
    data = parseInt(data).toString(16);
    // to cmd format
    data = ('000' + data).slice(-3).toUpperCase();
    return _cparam_awCmd_sendRequset('OSG:4F:' + data, 'OSG:4F:');
}
// downcon skin tone crisp
function cparam_get_downconSkinToneCrisp() {
    return parseInt(_cparam_awCmd_sendRequset('QSL:64', 'OSL:64:'), 16) - 128;
}

function cparam_set_downconSkinToneCrisp(data) {

    // to hex data
    data = parseInt(data + 0x80).toString(16);
    // to cmd format
    data = ('00' + data).slice(-2).toUpperCase();
    return _cparam_awCmd_sendRequset('OSL:64:' + data, 'OSL:64:');
}
// skin tone crisp
function cparam_get_skinToneCrisp() {
    return parseInt(_cparam_awCmd_sendRequset('QSG:49', 'OSG:49:'), 16) - 128;
}

function cparam_set_skinToneCrisp(data) {

    // to hex data
    data = parseInt(data + 0x80).toString(16);
    // to cmd format
    data = ('00' + data).slice(-2).toUpperCase();
    return _cparam_awCmd_sendRequset('OSG:49:' + data, 'OSG:49:');
}
// 2-19
// Detail Coring
function cparam_get_detailCoring() {
    return parseInt(_cparam_awCmd_sendRequset('QSJ:12', 'OSJ:12:'), 16);
}

function cparam_set_detailCoring(data) {

    // to hex data
    data = parseInt(data).toString(16);
    // to cmd format
    data = ('00' + data).slice(-2).toUpperCase();
    return _cparam_awCmd_sendRequset('OSJ:12:' + data, 'OSJ:12:');
}

// 2-20
// V Detail Level
function cparam_get_VDetailLevel() {
    return parseInt(_cparam_awCmd_sendRequset('QSD:A1', 'OSD:A1:'), 16) - 0x80;
}

function cparam_set_VDetailLevel(data) {

    // to hex data
    data = parseInt(data + 0x80).toString(16);
    // to cmd format
    data = ('00' + data).slice(-2).toUpperCase();
    return _cparam_awCmd_sendRequset('OSD:A1:' + data, 'OSD:A1:');
}
// 2-21
// Detail Frequency
function cparam_get_detailFrequency() {
    return parseInt(_cparam_awCmd_sendRequset('QSD:A2', 'OSD:A2:'), 16) - 0x80;
}

function cparam_set_detailFrequency(data) {

    // to hex data
    data = parseInt(data + 0x80).toString(16);
    // to cmd format
    data = ('00' + data).slice(-2).toUpperCase();
    return _cparam_awCmd_sendRequset('OSD:A2:' + data, 'OSD:A2:');
}
// 2-22
// Level Depend
function cparam_get_levelDepend() {
    return parseInt(_cparam_awCmd_sendRequset('QSJ:13', 'OSJ:13:'), 16) - 0x80;
}

function cparam_set_levelDepend(data) {

    // to hex data
    data = parseInt(data + 0x80).toString(16);
    // to cmd format
    data = ('00' + data).slice(-2).toUpperCase();
    return _cparam_awCmd_sendRequset('OSJ:13:' + data, 'OSJ:13:');
}

// 2-23
// Knee Ape. Level
function cparam_get_kneeApeLevel() {
    return parseInt(_cparam_awCmd_sendRequset('QSG:3F', 'OSG:3F:'), 16);
}

function cparam_set_kneeApeLevel(data) {

    // to hex data
    data = parseInt(data).toString(16);
    // to cmd format
    data = ('00' + data).slice(-2).toUpperCase();
    return _cparam_awCmd_sendRequset('OSG:3F:' + data, 'OSG:3F:');
}

// 2-24
// Detail Gain(+)
function cparam_get_detailGainINC() {
    return parseInt(_cparam_awCmd_sendRequset('QSA:38', 'OSA:38:'), 16) - 0x80;
}

function cparam_set_detailGainINC(data) {

    // to hex data
    data = parseInt(data + 0x80).toString(16);
    // to cmd format
    data = ('00' + data).slice(-2).toUpperCase();
    return _cparam_awCmd_sendRequset('OSA:38:' + data, 'OSA:38:');
}

// 2-25
// Detail Gain(-)
function cparam_get_detailGainDEC() {
    return parseInt(_cparam_awCmd_sendRequset('QSA:39', 'OSA:39:'), 16) - 0x80;
}

function cparam_set_detailGainDEC(data) {

    // to hex data
    data = parseInt(data + 0x80).toString(16);
    // to cmd format
    data = ('00' + data).slice(-2).toUpperCase();
    return _cparam_awCmd_sendRequset('OSA:39:' + data, 'OSA:39:');
}

// 2-26
// Skin Detail
function cparam_get_skinDetail() {
    return parseInt(_cparam_awCmd_sendRequset('QSA:40', 'OSA:40:'), 10);
}

function cparam_set_skinDetail(data) {

    return _cparam_awCmd_sendRequset('OSA:40:' + data, 'OSA:40:');
}

// 2-27
// Skin Detail Effect
function cparam_get_skinDetailEffect() {
    return parseInt(_cparam_awCmd_sendRequset('QSD:A3', 'OSD:A3:'), 16) - 0x80;
}

function cparam_set_skinDetailEffect(data) {

    // to hex data
    data = parseInt(data + 0x80).toString(16);
    // to cmd format
    data = ('00' + data).slice(-2).toUpperCase();
    return _cparam_awCmd_sendRequset('OSD:A3:' + data, 'OSD:A3:');
}

// 2-28
// DownCon Detail
function cparam_get_downConDetail() {
    return parseInt(_cparam_awCmd_sendRequset('QSJ:14', 'OSJ:14:'), 16);
}

function cparam_set_downConDetail(data) {

    return _cparam_awCmd_sendRequset('OSJ:14:' + data, 'OSJ:14:');
}

// 2-29
// DC. Master Detail
function cparam_get_DCMasterDetail() {
    return parseInt(_cparam_awCmd_sendRequset('QSJ:15', 'OSJ:15:'), 16) - 0x80;
}

function cparam_set_DCMasterDetail(data) {

    // to hex data
    data = parseInt(data + 0x80).toString(16);
    // to cmd format
    data = ('00' + data).slice(-2).toUpperCase();
    return _cparam_awCmd_sendRequset('OSJ:15:' + data, 'OSJ:15:');
}
// 2-30
// DC. Detail Coring
function cparam_get_DCDetailCoring() {
    return parseInt(_cparam_awCmd_sendRequset('QSJ:16', 'OSJ:16:'), 16);
}

function cparam_set_DCDetailCoring(data) {

    // to hex data
    data = parseInt(data).toString(16);
    // to cmd format
    data = ('00' + data).slice(-2).toUpperCase();
    return _cparam_awCmd_sendRequset('OSJ:16:' + data, 'OSJ:16:');
}
// 2-31
// DC. V Detail Level
function cparam_get_DCVDetailLevel() {
    return parseInt(_cparam_awCmd_sendRequset('QSJ:17', 'OSJ:17:'), 16) - 0x80;
}

function cparam_set_DCVDetailLevel(data) {

    // to hex data
    data = parseInt(data + 0x80).toString(16);
    // to cmd format
    data = ('00' + data).slice(-2).toUpperCase();
    return _cparam_awCmd_sendRequset('OSJ:17:' + data, 'OSJ:17:');
}
// 2-32
// DC. Detail Frequency
function cparam_get_DCDetailFrequency() {
    return parseInt(_cparam_awCmd_sendRequset('QSJ:18', 'OSJ:18:'), 16) - 0x80;
}

function cparam_set_DCDetailFrequency(data) {

    // to hex data
    data = parseInt(data + 0x80).toString(16);
    // to cmd format
    data = ('00' + data).slice(-2).toUpperCase();
    return _cparam_awCmd_sendRequset('OSJ:18:' + data, 'OSJ:18:');
}
// 2-33
// DC. Level Depend.
function cparam_get_DCLevelDepend() {
    return parseInt(_cparam_awCmd_sendRequset('QSJ:19', 'OSJ:19:'), 16) - 0x80;
}

function cparam_set_DCLevelDepend(data) {

    // to hex data
    data = parseInt(data + 0x80).toString(16);
    // to cmd format
    data = ('00' + data).slice(-2).toUpperCase();
    return _cparam_awCmd_sendRequset('OSJ:19:' + data, 'OSJ:19:');
}
// 2-34
// DC. Knee Ape Level
function cparam_get_DCKneeApeLevel() {
    return parseInt(_cparam_awCmd_sendRequset('QSJ:1A', 'OSJ:1A:'), 16);
}

function cparam_set_DCKneeApeLevel(data) {

    // to hex data
    data = parseInt(data).toString(16);
    // to cmd format
    data = ('00' + data).slice(-2).toUpperCase();
    return _cparam_awCmd_sendRequset('OSJ:1A:' + data, 'OSJ:1A:');
}
// 2-35
// Gamma Mode
function cparam_get_gammaMode() {
    return parseInt(_cparam_awCmd_sendRequset('QSE:72', 'OSE:72:'), 10);
}

function cparam_set_gammaMode(data) {

    return _cparam_awCmd_sendRequset('OSE:72:' + data, 'OSE:72:');
}
// 2-36
// Gamma
function cparam_get_gamma() {
    return (parseInt(_cparam_awCmd_sendRequset('QSA:6A', 'OSA:6A:'), 16) - 73) / 100;
}

function cparam_set_gamma(data) {

    // to hex data 
    data = parseInt(data * 100 + 73).toString(16);
    // to cmd format
    data = ('00' + data).slice(-2).toUpperCase();
    return _cparam_awCmd_sendRequset('OSA:6A:' + data, 'OSA:6A:');
}

function cparam_set_gamma_osa_0a(data){
    return _cparam_awCmd_sendRequset('OSA:0A:' + data, 'OSA:0A:');
}

function cparam_get_gamma_qsa_0a(){
    return _cparam_awCmd_sendRequset('QSA:0A' , 'OSA:0A:');
}


function cparam_set_r_gamma_osi_35(data) {
    // to hex data 
    data = (128 + parseInt(data)).toString(16);
    // to cmd format
    data = ('00' + data).slice(-2).toUpperCase();
    return _cparam_awCmd_sendRequset('OSI:35:' + data, 'OSI:35:');
}

function cparam_get_r_gamma_qsi_35() {
    return  parseInt(_cparam_awCmd_sendRequset('QSI:35', 'OSI:35:'),16) - 128;
}


function cparam_set_b_gamma_osi_36(data){
      // to hex data 
      data = (128 + parseInt(data)).toString(16);
      // to cmd format
      data = ('00' + data).slice(-2).toUpperCase();
      return _cparam_awCmd_sendRequset('OSI:36:' + data, 'OSI:36:');
}

function cparam_get_b_gamma_qsi_36(){
    return parseInt( _cparam_awCmd_sendRequset('QSI:36', 'OSI:36:'),16) - 128;
}

function cparam_set_gamma_select_mode_osj_d7(data){
    return _cparam_awCmd_sendRequset('OSJ:D7:' + data, 'OSJ:D7:');
}

function cparam_get_gamma_select_mode_qsj_d7(){
    return parseInt(_cparam_awCmd_sendRequset('QSJ:D7', 'OSJ:D7:'),16);
}

function cparam_set_black_gamma_osa_0b(data){
    return _cparam_awCmd_sendRequset('OSA:0B:' + data, 'OSA:0B:');
}

function cparam_get_black_gamma_qsa_0b(){
    return _cparam_awCmd_sendRequset('QSA:0B', 'OSA:0B:');
}


function cparam_set_initial_gamma_osl_44(data){
    data = parseInt(data*2).toString('16')
    // data = ('00' + data).slice(-2).toUpperCase();
    return _cparam_awCmd_sendRequset('OSL:44:' + data, 'OSL:44:');
}

function cparam_get_initial_gamma_qsl_44(){
    return parseInt(_cparam_awCmd_sendRequset('QSL:44', 'OSL:44:'),16) / 2;
}


function cparam_set_knee_osl_45(data){
    return _cparam_awCmd_sendRequset('OSL:45:' + data, 'OSL:45:');
}

function cparam_get_knee_qsl_45(){
    return _cparam_awCmd_sendRequset('QSL:45', 'OSL:45:');
}

function cparam_set_knee_mode_osl_46(data){
    return _cparam_awCmd_sendRequset('OSL:46:' + data, 'OSL:46:');
}

function cparam_get_knee_mode_qsl_46(){
    return _cparam_awCmd_sendRequset('QSL:46' , 'OSL:46:');
}

function cparam_set_hi_color_osl_49(data){
    return _cparam_awCmd_sendRequset('OSL:49:' + data, 'OSL:49:');
}

function cparam_get_hi_color_qsl_49(data){
    return _cparam_awCmd_sendRequset('QSL:49', 'OSL:49:');
}

function cparam_set_drs_osa_0d(data){
    return _cparam_awCmd_sendRequset('OSA:0D:' + data, 'OSA:0D:');
}

function cparam_get_drs_qsa_0d(){
    return _cparam_awCmd_sendRequset('QSA:0D', 'OSA:0D:');
}

// 2-37
// F-REC Dynamic LVL
function cparam_get_fFRECDynamicLVL() {
    return parseInt(_cparam_awCmd_sendRequset('QSA:10', 'OSA:10:'), 10) * 100 + 200;
}

function cparam_set_fRECDynamicLVL(data) {

    // to hex data
    data = parseInt((data - 200) / 100).toString(16);

    return _cparam_awCmd_sendRequset('OSA:10:' + data, 'OSA:10:');
}
// 2-38
// F-REC Black STR LVL
function cparam_get_fRECBlackSTRLVL() {
    return parseInt(_cparam_awCmd_sendRequset('QSA:0F', 'OSA:0F:'), 16);
}

function cparam_set_fRECBlackSTRLVL(data) {

    // to hex data
    data = parseInt(data).toString(16);
    // to cmd format
    data = ('00' + data).slice(-2).toUpperCase();
    return _cparam_awCmd_sendRequset('OSA:0F:' + data, 'OSA:0F:');
}
// 2-39
// V-REC Knee Slope
function cparam_get_vRECKneeSlope() {
    return (parseInt(_cparam_awCmd_sendRequset('QSA:25', 'OSA:25:'), 16) - 128) * 50 + 350;
}

function cparam_set_vRECKneeSlope(data) {

    // to hex data
    data = parseInt((data - 350) / 50 + 128).toString(16);
    // to cmd format
    data = ('00' + data).slice(-2).toUpperCase();
    return _cparam_awCmd_sendRequset('OSA:25:' + data, 'OSA:25:');
}
// 2-40
// V-REC Knee Point
function cparam_get_vRECKneePoint() {
    return parseInt(_cparam_awCmd_sendRequset('QSA:21', 'OSA:21:'), 16) - 68;
}

function cparam_set_vRECKneePoint(data) {

    // to hex data
    data = parseInt(data + 68).toString(16);
    // to cmd format
    data = ('00' + data).slice(-2).toUpperCase();
    return _cparam_awCmd_sendRequset('OSA:21:' + data, 'OSA:21:');
}
// 2-41
// Black Gamma
function cparam_get_blackGamma() {
    return parseInt(_cparam_awCmd_sendRequset('QSA:07', 'OSA:07:'), 16) - 0x80;
}

function cparam_set_blackGamma(data) {

    // to hex data
    data = parseInt(data + 0x80).toString(16);
    // to cmd format
    data = ('00' + data).slice(-2).toUpperCase();
    return _cparam_awCmd_sendRequset('OSA:07:' + data, 'OSA:07:');
}
//
function cparam_set_rBlackGamma_osa_08(data) {

    // to hex data
    data = parseInt(data + 0x80).toString(16);
    // to cmd format
    data = ('00' + data).slice(-2).toUpperCase();
    return _cparam_awCmd_sendRequset('OSA:08:' + data, 'OSA:08:');
}


function cparam_get_rBlackGamma_qsa_08() {
    return parseInt(_cparam_awCmd_sendRequset('QSA:08', 'OSA:08:'),16) -128 ;
}

function cparam_set_bBlackGamma_osa_09(data) {

    // to hex data
    data = parseInt(data + 0x80).toString(16);
    // to cmd format
    data = ('00' + data).slice(-2).toUpperCase();
    return _cparam_awCmd_sendRequset('OSA:09:' + data, 'OSA:09:');
}

function cparam_get_bBlackGamma_qsa_09() {
    return parseInt(_cparam_awCmd_sendRequset('QSA:09', 'OSA:09:'),16)-128 ;
}


// 2-42
// B.Gamma Range
function cparam_get_bGammaRange() {
    return parseInt(_cparam_awCmd_sendRequset('QSJ:1B', 'OSJ:1B:'), 16);
}

function cparam_set_bGammaRange(data) {

    // to hex data
    data = parseInt(data).toString(16);
    // to cmd format
    data = ('0' + data).slice(-1).toUpperCase();
    return _cparam_awCmd_sendRequset('OSJ:1B:' + data, 'OSJ:1B:');
}

function cparam_set_blackGammaRange_osj_1b(data) {
    return _cparam_awCmd_sendRequset('OSJ:1B:' + data, 'OSJ:1B:');
}

function cparam_get_blackGammaRange_qsj_1b() {
    return _cparam_awCmd_sendRequset('QSJ:1B', 'OSJ:1B:');
}

function cparam_set_kneeRPoint_osa_22(data){
    data = data*4;
    data = (0x80 + parseInt(data)).toString('16');
    data = ('00' + data).slice(-2).toUpperCase();
    return _cparam_awCmd_sendRequset('OSA:22:' + data, 'OSA:22:');
}

function cparam_get_kneeRPoint_qsa_22(){
    return (parseInt(_cparam_awCmd_sendRequset('QSA:22', 'OSA:22:'), 16) -128) / 4.0;
}

function cparam_set_kneeBPoint_osa_23(data){
    data = data*4;
    data = (0x80 + parseInt(data)).toString('16');
    data = ('00' + data).slice(-2).toUpperCase();
    return _cparam_awCmd_sendRequset('OSA:23:' + data, 'OSA:23:');
}

function cparam_get_kneeBPoint_qsa_23(){
    return (parseInt(_cparam_awCmd_sendRequset('QSA:23', 'OSA:23:'), 16) -128) / 4.0;
}

function cparam_set_knee_RSlope_osa_26(data) {
    // to cmd format
    data = parseInt(data+128).toString('16');
    data = ('00' + data).slice(-2).toUpperCase();
    return _cparam_awCmd_sendRequset('OSA:26:' + data, 'OSA:26:');
}

function cparam_get_knee_RSlope_qsa_26() {
    return parseInt(_cparam_awCmd_sendRequset('QSA:26', 'OSA:26:'),16) -128 ;
}

function cparam_set_knee_BSlope_osa_27(data) {
    // to cmd format
    data = parseInt(data+128).toString('16');
    data = ('00' + data).slice(-2).toUpperCase();
    return _cparam_awCmd_sendRequset('OSA:27:' + data, 'OSA:27:');
}

function cparam_get_knee_BSlope_osa_27() {
    return parseInt(_cparam_awCmd_sendRequset('QSA:27' , 'OSA:27:'),16) -128 ;
}





// 2-43　
// DRS
function cparam_get_DRS() {
    return parseInt(_cparam_awCmd_sendRequset('QSE:33', 'OSE:33:'), 10);
}

function cparam_set_DRS(data) {


    return _cparam_awCmd_sendRequset('OSE:33:' + data, 'OSE:33:');
}
// 2-44
// Knee Mode
function cparam_get_kneeMode() {
    return parseInt(_cparam_awCmd_sendRequset('QSA:2D', 'OSA:2D:'), 10);
}

function cparam_set_kneeMode(data) {


    return _cparam_awCmd_sendRequset('OSA:2D:' + data, 'OSA:2D:');
}
// 2-45
// A.Knee Response
function cparam_get_aKneeResponse() {
    return parseInt(_cparam_awCmd_sendRequset('QSG:97', 'OSG:97:'), 10);
}

function cparam_set_aKneeResponse(data) {


    return _cparam_awCmd_sendRequset('OSG:97:' + data, 'OSG:97:');
}

// 2-46
// Knee Point
function cparam_get_kneePoint() {
    return (parseInt(_cparam_awCmd_sendRequset('QSA:20', 'OSA:20:'), 16) + 246) / 4.0;
}

function cparam_set_kneePoint(data) {

    // to hex data
    data = parseInt(data * 4.0 - 246).toString(16);
    // to cmd format
    data = ('00' + data).slice(-2).toUpperCase();
    return _cparam_awCmd_sendRequset('OSA:20:' + data, 'OSA:20:');
}
// 2-47
// Knee Slope
function cparam_get_kneeSlope() {
    return parseInt(_cparam_awCmd_sendRequset('QSA:24', 'OSA:24:'), 16);
}

function cparam_set_kneeSlope(data) {

    // to cmd format
    data = ('00' + data.toString(16)).slice(-2).toUpperCase();
    return _cparam_awCmd_sendRequset('OSA:24:' + data, 'OSA:24:');
}
// 2-48
// HLG Knee SW
function cparam_get_HLGKneeSW() {
    return parseInt(_cparam_awCmd_sendRequset('QSI:40', 'OSI:40:'), 10);
}

function cparam_set_HLGKneeSW(data) {

    return _cparam_awCmd_sendRequset('OSI:40:' + data, 'OSI:40:');
}
// 2-49
// HLG Knee Point
function cparam_get_HLGKneePoint() {
    return (parseInt(_cparam_awCmd_sendRequset('QSI:41', 'OSI:41:'), 16) + 192) / 4;
}

function cparam_set_HLGKneePoint(data) {

    // to hex data
    data = parseInt(data * 4 - 192).toString(16);
    // to cmd format
    data = ('00' + data).slice(-2).toUpperCase();
    return _cparam_awCmd_sendRequset('OSI:41:' + data, 'OSI:41:');
}
// 2-50
// HLG Knee Slope
function cparam_get_HLGKneeSlope() {
    return parseInt(_cparam_awCmd_sendRequset('QSI:42', 'OSI:42:'), 16);
}

function cparam_set_HLGKneeSlope(data) {

    // to hex data
    data = parseInt(data).toString(16);
    // to cmd format
    data = ('00' + data).slice(-2).toUpperCase();
    return _cparam_awCmd_sendRequset('OSI:42:' + data, 'OSI:42:');
}
// 2-51
// White Clip
function cparam_get_whiteClip() {
    return parseInt(_cparam_awCmd_sendRequset('QSA:2E', 'OSA:2E:'), 10);
}

function cparam_set_whiteClip(data) {


    return _cparam_awCmd_sendRequset('OSA:2E:' + data, 'OSA:2E:');
}

function cparam_set_whiteClip_osa_2e(data) {


    return _cparam_awCmd_sendRequset('OSA:2E:' + data, 'OSA:2E:');
}
function cparam_get_whiteClip_qsa_2e() {
    return parseInt(_cparam_awCmd_sendRequset('QSA:2E', 'OSA:2E:'));
}

// 2-52
// White Clip Level
function cparam_get_whiteClipLevel() {
    return parseInt(_cparam_awCmd_sendRequset('QSA:2A', 'OSA:2A:'), 16) + 90;
}

function cparam_set_whiteClipLevel(data) {

    // to hex data
    data = parseInt(data - 90).toString(16);
    // to cmd format
    data = ('00' + data).slice(-2).toUpperCase();
    return _cparam_awCmd_sendRequset('OSA:2A:' + data, 'OSA:2A:');
}

function cparam_set_masterWhiteClipLevel_osa_2a(data) {
    data = parseInt(data).toString('16')
    data = ('00' + data).slice(-2).toUpperCase();
    return _cparam_awCmd_sendRequset('OSA:2A:' + data, 'OSA:2A:');
}

function cparam_get_masterWhiteClipLevel_qsa_2a() {
    return parseInt(_cparam_awCmd_sendRequset('QSA:2A', 'OSA:2A:'),16) ;
}


function cparam_set_RWhiteClipLevel_osl_47(data) {
    data = parseInt(data + 128).toString('16')
    data = ('00' + data).slice(-2).toUpperCase();
    return _cparam_awCmd_sendRequset('OSL:47:' + data, 'OSL:47:');
}

function cparam_get_RWhiteClipLevel_qsl_47() {
    return parseInt(_cparam_awCmd_sendRequset('QSL:47', 'OSL:47:'),16)-128;
}

function cparam_set_BWhiteClipLevel_osl_48(data) {
    data = parseInt(data + 128).toString('16')
    data = ('00' + data).slice(-2).toUpperCase();
    return _cparam_awCmd_sendRequset('OSL:48:' + data, 'OSL:48:');
}

function cparam_get_BWhiteClipLevel_qsl_48() {
    return parseInt(_cparam_awCmd_sendRequset('QSL:48', 'OSL:48:'),16) -128 ;
}

function  cparam_set_HiColorLevel_osl_4a(data){
    data = parseInt(data).toString('16')
    data = ('00' + data).slice(-2).toUpperCase();
    return _cparam_awCmd_sendRequset('OSL:4A:' + data, 'OSL:4A:');
}

function  cparam_get_HiColorLevel_qsl_4a(){
    return parseInt(_cparam_awCmd_sendRequset('QSL:4A', 'OSL:4A:'),16);
}


function  cparam_set_drsEffectDepth_osl_4b(data){
    return _cparam_awCmd_sendRequset('OSL:4B:' + data, 'OSL:4B:');
}

function  cparam_get_drsEffectDepth_qsl_4b(){
    return _cparam_awCmd_sendRequset('QSL:4B', 'OSL:4B:');
}



// 2-53
// DNR
function cparam_get_DNR() {
    return parseInt(_cparam_awCmd_sendRequset('QSD:3A', 'OSD:3A:'), 10);
}

function cparam_set_DNR(data) {

    // to cmd format
    data = ('00' + data).slice(-2).toUpperCase();
    return _cparam_awCmd_sendRequset('OSD:3A:' + data, 'OSD:3A:');
}
// 2-54
// MATRIX TYPE
function cparam_get_matrixType() {
    return parseInt(_cparam_awCmd_sendRequset('QSE:31', 'OSE:31:'), 10);
}

function cparam_set_matrixType(data) {


    return _cparam_awCmd_sendRequset('OSE:31:' + data, 'OSE:31:');
}

function cparam_get_matrix() {
    return parseInt(_cparam_awCmd_sendRequset('QSA:84', 'OSA:84:'), 10);
}

function cparam_set_matrix(data) {


    return _cparam_awCmd_sendRequset('OSA:84:' + data, 'OSA:84:');
}

function cparam_get_linearMatrix() {
    return parseInt(_cparam_awCmd_sendRequset('QSL:6C', 'OSL:6C:'), 10);
}

function cparam_set_linearMatrix(data) {


    return _cparam_awCmd_sendRequset('OSL:6C:' + data, 'OSL:6C:');
}

function cparam_get_linearTable() {
    return parseInt(_cparam_awCmd_sendRequset('QSA:00', 'OSA:00:'), 10);
}

function cparam_set_linearTable(data) {


    return _cparam_awCmd_sendRequset('OSA:00:' + data, 'OSA:00:');
}

function cparam_get_colorCorrect() {
    return parseInt(_cparam_awCmd_sendRequset('QSA:85', 'OSA:85:'), 10);
}

function cparam_set_colorCorrect(data) {


    return _cparam_awCmd_sendRequset('OSA:85:' + data, 'OSA:85:');
}

function cparam_get_colorCorrectAB() {
    return parseInt(_cparam_awCmd_sendRequset('QSL:6E', 'OSL:6E:'), 10);
}

function cparam_set_colorCorrectAB(data) {


    return _cparam_awCmd_sendRequset('OSL:6E:' + data, 'OSL:6E:');
}
// 2-55
// MATRIX(R-G)
function cparam_get_matrixRG() {
    return parseInt(_cparam_awCmd_sendRequset('QSD:2F', 'OSD:2F:'), 16) - 0x1F;
}

function cparam_set_matrixRG(data) {

    // to hex data
    data = parseInt(data + 0x1F).toString(16);
    // to cmd format
    data = ('00' + data).slice(-2).toUpperCase();
    return _cparam_awCmd_sendRequset('OSD:2F:' + data, 'OSD:2F:');
}
// 2-55-2
// MATRIX(R-G)right
function cparam_get_matrixRGRight() {
    return parseInt(_cparam_awCmd_sendRequset('QSL:6F', 'OSL:6F:'), 16) - 0x1F;
}

function cparam_set_matrixRGRight(data) {

    // to hex data
    data = parseInt(data + 0x1F).toString(16);
    // to cmd format
    data = ('00' + data).slice(-2).toUpperCase();
    return _cparam_awCmd_sendRequset('OSL:6F:' + data, 'OSL:6F:');
}
// 2-56
// MATRIX(R-B)
function cparam_get_matrixRB() {
    return parseInt(_cparam_awCmd_sendRequset('QSD:30', 'OSD:30:'), 16) - 0x1F;
}

function cparam_set_matrixRB(data) {

    // to hex data
    data = parseInt(data + 0x1F).toString(16);
    // to cmd format
    data = ('00' + data).slice(-2).toUpperCase();
    return _cparam_awCmd_sendRequset('OSD:30:' + data, 'OSD:30:');
}
// 2-56-2
// MATRIX(R-B)right
function cparam_get_matrixRBRight() {
    return parseInt(_cparam_awCmd_sendRequset('QSL:70', 'OSL:70:'), 16) - 0x1F;
}

function cparam_set_matrixRBRight(data) {

    // to hex data
    data = parseInt(data + 0x1F).toString(16);
    // to cmd format
    data = ('00' + data).slice(-2).toUpperCase();
    return _cparam_awCmd_sendRequset('OSL:70:' + data, 'OSL:70:');
}
// 2-57
// MATRIX(G-R)
function cparam_get_matrixGR() {
    return parseInt(_cparam_awCmd_sendRequset('QSD:31', 'OSD:31:'), 16) - 0x1F;
}

function cparam_set_matrixGR(data) {

    // to hex data
    data = parseInt(data + 0x1F).toString(16);
    // to cmd format
    data = ('00' + data).slice(-2).toUpperCase();
    return _cparam_awCmd_sendRequset('OSD:31:' + data, 'OSD:31:');
}
// 2-57-2
// MATRIX(G-R)right
function cparam_get_matrixGRRight() {
    return parseInt(_cparam_awCmd_sendRequset('QSL:71', 'OSL:71:'), 16) - 0x1F;
}

function cparam_set_matrixGRRight(data) {

    // to hex data
    data = parseInt(data + 0x1F).toString(16);
    // to cmd format
    data = ('00' + data).slice(-2).toUpperCase();
    return _cparam_awCmd_sendRequset('OSL:71:' + data, 'OSL:71:');
}
// 2-58
// MATRIX(G-B)
function cparam_get_matrixGB() {
    return parseInt(_cparam_awCmd_sendRequset('QSD:32', 'OSD:32:'), 16) - 0x1F;
}

function cparam_set_matrixGB(data) {

    // to hex data
    data = parseInt(data + 0x1F).toString(16);
    // to cmd format
    data = ('00' + data).slice(-2).toUpperCase();
    return _cparam_awCmd_sendRequset('OSD:32:' + data, 'OSD:32:');
}
// 2-58-2
// MATRIX(G-B)right
function cparam_get_matrixGBRight() {
    return parseInt(_cparam_awCmd_sendRequset('QSL:72', 'OSL:72:'), 16) - 0x1F;
}

function cparam_set_matrixGBRight(data) {

    // to hex data
    data = parseInt(data + 0x1F).toString(16);
    // to cmd format
    data = ('00' + data).slice(-2).toUpperCase();
    return _cparam_awCmd_sendRequset('OSL:72:' + data, 'OSL:72:');
}
// 2-59
// MATRIX(B-R)
function cparam_get_matrixBR() {
    return parseInt(_cparam_awCmd_sendRequset('QSD:33', 'OSD:33:'), 16) - 0x1F;
}

function cparam_set_matrixBR(data) {

    // to hex data
    data = parseInt(data + 0x1F).toString(16);
    // to cmd format
    data = ('00' + data).slice(-2).toUpperCase();
    return _cparam_awCmd_sendRequset('OSD:33:' + data, 'OSD:33:');
}
// 2-59-2
// MATRIX(B-R)right
function cparam_get_matrixBRRight() {
    return parseInt(_cparam_awCmd_sendRequset('QSL:73', 'OSL:73:'), 16) - 0x1F;
}

function cparam_set_matrixBRRight(data) {

    // to hex data
    data = parseInt(data + 0x1F).toString(16);
    // to cmd format
    data = ('00' + data).slice(-2).toUpperCase();
    return _cparam_awCmd_sendRequset('OSL:73:' + data, 'OSL:73:');
}
// 2-60
// MATRIX(B-G)
function cparam_get_matrixBG() {
    return parseInt(_cparam_awCmd_sendRequset('QSD:34', 'OSD:34:'), 16) - 0x1F;
}

function cparam_set_matrixBG(data) {

    // to hex data
    data = parseInt(data + 0x1F).toString(16);
    // to cmd format
    data = ('00' + data).slice(-2).toUpperCase();
    return _cparam_awCmd_sendRequset('OSD:34:' + data, 'OSD:34:');
}
// 2-60-2
// MATRIX(B-G)right
function cparam_get_matrixBGRight() {
    return parseInt(_cparam_awCmd_sendRequset('QSL:74', 'OSL:74:'), 16) - 0x1F;
}

function cparam_set_matrixBGRight(data) {

    // to hex data
    data = parseInt(data + 0x1F).toString(16);
    // to cmd format
    data = ('00' + data).slice(-2).toUpperCase();
    return _cparam_awCmd_sendRequset('OSL:74:' + data, 'OSL:74:');
}
// 2-61
// B_Mg (SATURATION)
function cparam_get_bMgSaturation() {
    return parseInt(_cparam_awCmd_sendRequset('QSD:80', 'OSD:80:'), 16) - 0x80;
}

function cparam_set_bMgSaturation(data) {

    // to hex data
    data = parseInt(data + 0x80).toString(16);
    // to cmd format
    data = ('00' + data).slice(-2).toUpperCase();
    return _cparam_awCmd_sendRequset('OSD:80:' + data, 'OSD:80:');
}
// 2-62
// B_Mg (PHASE)
function cparam_get_bMgPhase() {
    return parseInt(_cparam_awCmd_sendRequset('QSD:81', 'OSD:81:'), 16) - 0x80;
}

function cparam_set_bMgPhase(data) {

    // to hex data
    data = parseInt(data + 0x80).toString(16);
    // to cmd format
    data = ('00' + data).slice(-2).toUpperCase();
    return _cparam_awCmd_sendRequset('OSD:81:' + data, 'OSD:81:');
}
// 2-63
// Mg (SATURATION)
function cparam_get_mgSauration() {
    return parseInt(_cparam_awCmd_sendRequset('QSD:82', 'OSD:82:'), 16) - 0x80;
}

function cparam_set_mgSauration(data) {

    // to hex data
    data = parseInt(data + 0x80).toString(16);
    // to cmd format
    data = ('00' + data).slice(-2).toUpperCase();
    return _cparam_awCmd_sendRequset('OSD:82:' + data, 'OSD:82:');
}
// 2-64
// Mg (PHASE)
function cparam_get_mgPhase() {
    return parseInt(_cparam_awCmd_sendRequset('QSD:83', 'OSD:83:'), 16) - 0x80;
}

function cparam_set_mgPhase(data) {

    // to hex data
    data = parseInt(data + 0x80).toString(16);
    // to cmd format
    data = ('00' + data).slice(-2).toUpperCase();
    return _cparam_awCmd_sendRequset('OSD:83:' + data, 'OSD:83:');
}
// 2-65
// Mg_R (SATURATION)
function cparam_get_mgRSaturation() {
    return parseInt(_cparam_awCmd_sendRequset('QSD:84', 'OSD:84:'), 16) - 0x80;
}

function cparam_set_mgRSaturation(data) {

    // to hex data
    data = parseInt(data + 0x80).toString(16);
    // to cmd format
    data = ('00' + data).slice(-2).toUpperCase();
    return _cparam_awCmd_sendRequset('OSD:84:' + data, 'OSD:84:');
}
// 2-66
// Mg_R (PHASE)
function cparam_get_mgRPhase() {
    return parseInt(_cparam_awCmd_sendRequset('QSD:85', 'OSD:85:'), 16) - 0x80;
}

function cparam_set_mgRPhase(data) {

    // to hex data
    data = parseInt(data + 0x80).toString(16);
    // to cmd format
    data = ('00' + data).slice(-2).toUpperCase();
    return _cparam_awCmd_sendRequset('OSD:85:' + data, 'OSD:85:');
}
// 2-67
// Mg_R_R (SATURATION)
function cparam_get_mgRRSaturation() {
    return parseInt(_cparam_awCmd_sendRequset('QSD:9A', 'OSD:9A:'), 16) - 0x80;
}

function cparam_set_mgRRSaturation(data) {

    // to hex data
    data = parseInt(data + 0x80).toString(16);
    // to cmd format
    data = ('00' + data).slice(-2).toUpperCase();
    return _cparam_awCmd_sendRequset('OSD:9A:' + data, 'OSD:9A:');
}
// 2-68
// Mg_R_R (PHASE)
function cparam_get_mgRRPhase() {
    return parseInt(_cparam_awCmd_sendRequset('QSD:9B', 'OSD:9B:'), 16) - 0x80;
}

function cparam_set_mgRRPhase(data) {

    // to hex data
    data = parseInt(data + 0x80).toString(16);
    // to cmd format
    data = ('00' + data).slice(-2).toUpperCase();
    return _cparam_awCmd_sendRequset('OSD:9B:' + data, 'OSD:9B:');
}

// 2-69
// R (SATURATION)
function cparam_get_rSaturation() {
    return parseInt(_cparam_awCmd_sendRequset('QSD:86', 'OSD:86:'), 16) - 0x80;
}

function cparam_set_rSaturation(data) {

    // to hex data
    data = parseInt(data + 0x80).toString(16);
    // to cmd format
    data = ('00' + data).slice(-2).toUpperCase();
    return _cparam_awCmd_sendRequset('OSD:86:' + data, 'OSD:86:');
}
// 2-70
// R (SATURATION)
function cparam_get_rPhase() {
    return parseInt(_cparam_awCmd_sendRequset('QSD:87', 'OSD:87:'), 16) - 0x80;
}

function cparam_set_rPhase(data) {

    // to hex data
    data = parseInt(data + 0x80).toString(16);
    // to cmd format
    data = ('00' + data).slice(-2).toUpperCase();
    return _cparam_awCmd_sendRequset('OSD:87:' + data, 'OSD:87:');
}
// 2-71
// R_R_YI (SATURATION)
function cparam_get_rRYiSaturraation() {
    return parseInt(_cparam_awCmd_sendRequset('QSD:9C', 'OSD:9C:'), 16) - 0x80;
}

function cparam_set_rRYiSaturraation(data) {

    // to hex data
    data = parseInt(data + 0x80).toString(16);
    // to cmd format
    data = ('00' + data).slice(-2).toUpperCase();
    return _cparam_awCmd_sendRequset('OSD:9C:' + data, 'OSD:9C:');
}
// 2-72
// R_R_YI (PHASE)
function cparam_get_rRYiPhase() {
    return parseInt(_cparam_awCmd_sendRequset('QSD:9D', 'OSD:9D:'), 16) - 0x80;
}

function cparam_set_rRYiPhase(data) {

    // to hex data
    data = parseInt(data + 0x80).toString(16);
    // to cmd format
    data = ('00' + data).slice(-2).toUpperCase();
    return _cparam_awCmd_sendRequset('OSD:9D:' + data, 'OSD:9D:');
}
// 2-73
// R_YI (SATURATION)
function cparam_get_rYiSaturation() {
    return parseInt(_cparam_awCmd_sendRequset('QSD:88', 'OSD:88:'), 16) - 0x80;
}

function cparam_set_rYiSaturation(data) {

    // to hex data
    data = parseInt(data + 0x80).toString(16);
    // to cmd format
    data = ('00' + data).slice(-2).toUpperCase();
    return _cparam_awCmd_sendRequset('OSD:88:' + data, 'OSD:88:');
}
// 2-74
// R_YI (PHASE)
function cparam_get_rYiPhase() {
    return parseInt(_cparam_awCmd_sendRequset('QSD:89', 'OSD:89:'), 16) - 0x80;
}

function cparam_set_rYiPhase(data) {

    // to hex data
    data = parseInt(data + 0x80).toString(16);
    // to cmd format
    data = ('00' + data).slice(-2).toUpperCase();
    return _cparam_awCmd_sendRequset('OSD:89:' + data, 'OSD:89:');
}
// 2-75
// R_YI_YI (SATURATION)
function cparam_get_rYiYiSaturation() {
    return parseInt(_cparam_awCmd_sendRequset('QSD:9E', 'OSD:9E:'), 16) - 0x80;
}

function cparam_set_rYiYiSaturation(data) {

    // to hex data
    data = parseInt(data + 0x80).toString(16);
    // to cmd format
    data = ('00' + data).slice(-2).toUpperCase();
    return _cparam_awCmd_sendRequset('OSD:9E:' + data, 'OSD:9E:');
}
// 2-75
// R_YI_YI (PHASE)
function cparam_get_rYiYiPhase() {
    return parseInt(_cparam_awCmd_sendRequset('QSD:9F', 'OSD:9F:'), 16) - 0x80;
}

function cparam_set_rYiYiPhase(data) {

    // to hex data
    data = parseInt(data + 0x80).toString(16);
    // to cmd format
    data = ('00' + data).slice(-2).toUpperCase();
    return _cparam_awCmd_sendRequset('OSD:9F:' + data, 'OSD:9F:');
}
// 2-77
// YI (SATURATION)
function cparam_get_yiSaturation() {
    return parseInt(_cparam_awCmd_sendRequset('QSD:8A', 'OSD:8A:'), 16) - 0x80;
}

function cparam_set_yiSaturation(data) {

    // to hex data
    data = parseInt(data + 0x80).toString(16);
    // to cmd format
    data = ('00' + data).slice(-2).toUpperCase();
    return _cparam_awCmd_sendRequset('OSD:8A:' + data, 'OSD:8A:');
}
// 2-78
// YI (PHASE)
function cparam_get_yiPhase() {
    return parseInt(_cparam_awCmd_sendRequset('QSD:8B', 'OSD:8B:'), 16) - 0x80;
}

function cparam_set_yiPhase(data) {

    // to hex data
    data = parseInt(data + 0x80).toString(16);
    // to cmd format
    data = ('00' + data).slice(-2).toUpperCase();
    return _cparam_awCmd_sendRequset('OSD:8B:' + data, 'OSD:8B:');
}
// 2-79
// Yl_Yl_G  Saturation
function cparam_get_yiYigSaturation() {
    return parseInt(_cparam_awCmd_sendRequset('QSJ:1C', 'OSJ:1C:'), 16) - 0x80;
}

function cparam_set_yiYigSaturation(data) {

    // to hex data
    data = parseInt(data + 0x80).toString(16);
    // to cmd format
    data = ('00' + data).slice(-2).toUpperCase();
    return _cparam_awCmd_sendRequset('OSJ:1C:' + data, 'OSJ:1C:');
}
// 2-80
// Yl_Yl_G  Phase
function cparam_get_yiYigPhase() {
    return parseInt(_cparam_awCmd_sendRequset('QSJ:1D', 'OSJ:1D:'), 16) - 0x80;
}

function cparam_set_yiYigPhase(data) {

    // to hex data
    data = parseInt(data + 0x80).toString(16);
    // to cmd format
    data = ('00' + data).slice(-2).toUpperCase();
    return _cparam_awCmd_sendRequset('OSJ:1D:' + data, 'OSJ:1D:');
}
// 2-81
// YI_G　(SATURATION)
function cparam_get_yigSaturation() {
    return parseInt(_cparam_awCmd_sendRequset('QSD:8C', 'OSD:8C:'), 16) - 0x80;
}

function cparam_set_yigSaturation(data) {

    // to hex data
    data = parseInt(data + 0x80).toString(16);
    // to cmd format
    data = ('00' + data).slice(-2).toUpperCase();
    return _cparam_awCmd_sendRequset('OSD:8C:' + data, 'OSD:8C:');
}
// 2-82
// YI_G　(PHASE)
function cparam_get_yigPhase() {
    return parseInt(_cparam_awCmd_sendRequset('QSD:8D', 'OSD:8D:'), 16) - 0x80;
}

function cparam_set_yigPhase(data) {

    // to hex data
    data = parseInt(data + 0x80).toString(16);
    // to cmd format
    data = ('00' + data).slice(-2).toUpperCase();
    return _cparam_awCmd_sendRequset('OSD:8D:' + data, 'OSD:8D:');
}
// 2-83
// G　(SATURATION)
function cparam_get_gSaturation() {
    return parseInt(_cparam_awCmd_sendRequset('QSD:8E', 'OSD:8E:'), 16) - 0x80;
}

function cparam_set_gSaturation(data) {

    // to hex data
    data = parseInt(data + 0x80).toString(16);
    // to cmd format
    data = ('00' + data).slice(-2).toUpperCase();
    return _cparam_awCmd_sendRequset('OSD:8E:' + data, 'OSD:8E:');
}
// 2-84
// G　(PHASE)
function cparam_get_gPhase() {
    return parseInt(_cparam_awCmd_sendRequset('QSD:8F', 'OSD:8F:'), 16) - 0x80;
}

function cparam_set_gPhase(data) {

    // to hex data
    data = parseInt(data + 0x80).toString(16);
    // to cmd format
    data = ('00' + data).slice(-2).toUpperCase();
    return _cparam_awCmd_sendRequset('OSD:8F:' + data, 'OSD:8F:');
}
// 2-85
// G_Cy (SATURATION)
function cparam_get_gCySaturation() {
    return parseInt(_cparam_awCmd_sendRequset('QSD:90', 'OSD:90:'), 16) - 0x80;
}

function cparam_set_gCySaturation(data) {

    // to hex data
    data = parseInt(data + 0x80).toString(16);
    // to cmd format
    data = ('00' + data).slice(-2).toUpperCase();
    return _cparam_awCmd_sendRequset('OSD:90:' + data, 'OSD:90:');
}
// 2-86
// G_Cy (PHASE)
function cparam_get_gCyPhase() {
    return parseInt(_cparam_awCmd_sendRequset('QSD:91', 'OSD:91:'), 16) - 0x80;
}

function cparam_set_gCyPhase(data) {

    // to hex data
    data = parseInt(data + 0x80).toString(16);
    // to cmd format
    data = ('00' + data).slice(-2).toUpperCase();
    return _cparam_awCmd_sendRequset('OSD:91:' + data, 'OSD:91:');
}
// 2-87
// Cy (SATURATION)
function cparam_get_cySaturation() {
    return parseInt(_cparam_awCmd_sendRequset('QSD:92', 'OSD:92:'), 16) - 0x80;
}

function cparam_set_cySaturation(data) {

    // to hex data
    data = parseInt(data + 0x80).toString(16);
    // to cmd format
    data = ('00' + data).slice(-2).toUpperCase();
    return _cparam_awCmd_sendRequset('OSD:92:' + data, 'OSD:92:');
}
// 2-88
// Cy (PHASE)
function cparam_get_cyPhase() {
    return parseInt(_cparam_awCmd_sendRequset('QSD:93', 'OSD:93:'), 16) - 0x80;
}

function cparam_set_cyPhase(data) {

    // to hex data
    data = parseInt(data + 0x80).toString(16);
    // to cmd format
    data = ('00' + data).slice(-2).toUpperCase();
    return _cparam_awCmd_sendRequset('OSD:93:' + data, 'OSD:93:');
}
// 2-89
// Cy_B  (Saturation)
function cparam_get_cyBSaturation() {
    return parseInt(_cparam_awCmd_sendRequset('QSD:94', 'OSD:94:'), 16) - 0x80;
}

function cparam_set_cyBSaturation(data) {

    // to hex data
    data = parseInt(data + 0x80).toString(16);
    // to cmd format
    data = ('00' + data).slice(-2).toUpperCase();
    return _cparam_awCmd_sendRequset('OSD:94:' + data, 'OSD:94:');
}
// 2-90
// Cy_B  (PHASE)
function cparam_get_cyBPhase() {
    return parseInt(_cparam_awCmd_sendRequset('QSD:95', 'OSD:95:'), 16) - 0x80;
}

function cparam_set_cyBPhase(data) {

    // to hex data
    data = parseInt(data + 0x80).toString(16);
    // to cmd format
    data = ('00' + data).slice(-2).toUpperCase();
    return _cparam_awCmd_sendRequset('OSD:95:' + data, 'OSD:95:');
}
// 2-91
// B (SATURATION)
function cparam_get_bSaturation() {
    return parseInt(_cparam_awCmd_sendRequset('QSD:96', 'OSD:96:'), 16) - 0x80;
}

function cparam_set_bSaturation(data) {

    // to hex data
    data = parseInt(data + 0x80).toString(16);
    // to cmd format
    data = ('00' + data).slice(-2).toUpperCase();
    return _cparam_awCmd_sendRequset('OSD:96:' + data, 'OSD:96:');
}
// 2-92
// B (PHASE)
function cparam_get_bPhase() {
    return parseInt(_cparam_awCmd_sendRequset('QSD:97', 'OSD:97:'), 16) - 0x80;
}

function cparam_set_bPhase(data) {

    // to hex data
    data = parseInt(data + 0x80).toString(16);
    // to cmd format
    data = ('00' + data).slice(-2).toUpperCase();
    return _cparam_awCmd_sendRequset('OSD:97:' + data, 'OSD:97:');
}
function cparam_get_wfmMode() {
    return parseInt(_cparam_awCmd_sendRequset('QSL:8D', 'OSL:8D:'), 10);
}
function cparam_set_wfmMode(data) {
    return _cparam_awCmd_sendRequset('OSL:8D:' + data, 'OSL:8D:');
}
function cparam_get_wfmPosition() {
    return parseInt(_cparam_awCmd_sendRequset('QSL:8E', 'OSL:8E:'), 10);
}
function cparam_set_wfmPosition(data) {
    return _cparam_awCmd_sendRequset('OSL:8E:' + data, 'OSL:8E:');
}
function cparam_get_StatusReturn() {
    return parseInt(_cparam_awCmd_sendRequset('QSL:B3', 'OSL:B3:'), 10);
}
function cparam_set_StatusReturn(data) {
    return _cparam_awCmd_sendRequset('OSL:B3:' + data, 'OSL:B3:');
}
function cparam_get_StatusAuto() {
    return parseInt(_cparam_awCmd_sendRequset('QSA:88', 'OSA:88:'), 10);
}
function cparam_set_StatusAuto(data) {
    return _cparam_awCmd_sendRequset('OSA:88:' + data, 'OSA:88:');
}
// 3-1
// FOCUS　MODE
function cparam_get_focusMode() {
    return parseInt(_cparam_awCmd_sendRequset('QAF', 'OAF:'), 10);
}

function cparam_set_focusMode(data) {

    return _cparam_awCmd_sendRequset('OAF:' + data, 'OAF:');
}
// 3-2
// Crop AF
function cparam_get_crop_af() {
    return parseInt(_cparam_awCmd_sendRequset('QSJ:91', 'OSJ:91:'), 10);
}
function cparam_set_crop_af(data) {
    return _cparam_awCmd_sendRequset('OSJ:91:' + data, 'OSJ:91:');
}
// AF SENSITIVITY
function cparam_get_af_sensitivity() {
    return parseInt(_cparam_awCmd_sendRequset('QSJ:D8', 'OSJ:D8:'), 10);
}
function cparam_set_af_sensitivity(data) {
    return _cparam_awCmd_sendRequset('OSJ:D8:' + data, 'OSJ:D8:');
}
// Extender/AF Control
function cparam_get_extenderAFControl() {
    return parseInt(_cparam_awCmd_sendRequset('#D1', 'd1'), 10);
}

function cparam_set_extenderAFControl(data) {

    return _cparam_awCmd_sendRequset('#D1' + data, 'd1');
}
// 3-2-1
// Digital Zoom Disable/Enable
function cparam_get_digitalZoomDisableEnable() {
    return parseInt(_cparam_awCmd_sendRequset('QSE:70', 'OSE:70:'), 10);
}
// 3-2-1
// Digital Zoom Disable/Enable
function cparam_pad_get_digitalZoomDisableEnable() {
    return _cparam_awCmd_deferreds_sendRequset('QSE:70', 'OSE:70:')
    // const defer = $.Deferred();
    // defer.resolve(value);
    // return defer.promise();
}
function cparam_set_digitalZoomDisableEnable(data) {

    return _cparam_awCmd_sendRequset('OSE:70:' + data, 'OSE:70:');
}
// 3-2-2
// i.zoom
function cparam_get_iZoom() {
    return parseInt(_cparam_awCmd_sendRequset('QSD:B3', 'OSD:B3:'), 10);
}

function cparam_set_iZoom(data) {

    return _cparam_awCmd_sendRequset('OSD:B3:' + data, 'OSD:B3:');
}
// 3-3
// MAXIMUM DIGITAL ZOOM
function cparam_get_maximumDiaitalZoom() {
    // return parseInt(_cparam_awCmd_sendRequset('QSE:7A', 'OSE:7A:').replace(/\b(0+)/gi, ""), 10);
    return parseInt(_cparam_awCmd_sendRequset('QSE:7A', 'OSE:7A:'), 10);
}

function cparam_set_maximumDiaitalZoom(data) {

    // to cmd format
    data = ('00' + data).slice(-2).toUpperCase();
    return _cparam_awCmd_sendRequset('OSE:7A:' + data, 'OSE:7A:');
}
// 3-4
// Digital Extender Off/On
function cparam_get_digitalExtenderOffOn() {
    return parseInt(_cparam_awCmd_sendRequset('QDE', 'ODE:'), 10);
}

function cparam_set_digitalExtenderOffOn(data) {

    return _cparam_awCmd_sendRequset('ODE:' + data, 'ODE:');
}

//Digita 1.4  Extender Off/On
//Digita 2.0  Extender Off/On
function cparam_get_digital14_20ExtenderOffOn() {
    return parseInt(_cparam_awCmd_sendRequset('QSJ:4E', 'OSJ:4E:'), 10);
}
function cparam_pad_get_digital14_20ExtenderOffOn() {
    const value = parseInt(_cparam_awCmd_async_sendRequset('QSJ:4E', 'OSJ:4E:'), 10);
    const defer = $.Deferred();
    defer.resolve(value);
    return defer.promise();
}
function cparam_set_digital14_20ExtenderOffOn(data) {

    return _cparam_awCmd_sendRequset('OSJ:4E:' + data, 'OSJ:4E:');
}

// Zoom Scale
function cparam_get_zoomScale() {
    return parseInt(_cparam_awCmd_sendRequset('QSJ:3D', 'OSJ:3D:'), 16);
}
// D-Zoom Magnification
function cparam_get_dZoomMagnification() {
    return parseInt(_cparam_awCmd_sendRequset('QSE:76', 'OSE:76:'), 10);
}

function cparam_set_dZoomMagnification(data) {

    // to cmd format
    data = ('0000' + data).slice(-4).toUpperCase();
    return _cparam_awCmd_sendRequset('OSE:76:' + data, 'OSE:76:');
}
// 3-5
// OIS
function cparam_get_OIS() {
    return parseInt(_cparam_awCmd_sendRequset('QIS', 'OIS:'), 10);
}

function cparam_set_OIS(data) {

    return _cparam_awCmd_sendRequset('OIS:' + data, 'OIS:');
}
// Zoom Speed
function cparam_set_zoomSpeed(data) {

    return _cparam_awCmd_sendRequset('#Z' + data, 'zS');
}
// Zoom Position Control
function cparam_get_zoomPositionControl() {
    return parseInt(_cparam_awCmd_sendRequset('#AXZ', 'axz'), 16);
}

function cparam_set_zoomPositionControl(data) {

    // to hex data
    data = parseInt(data).toString(16);
    // to cmd format
    data = ('000' + data).slice(-3).toUpperCase();

    return _cparam_awCmd_sendRequset('#AXZ' + data, 'axz');
}
// Focus Speed
function cparam_set_focusSpeed(data) {

    return _cparam_awCmd_sendRequset('#F' + data, 'fS');
}
// Focus Position Control
function cparam_get_focusPositionControl() {
    return parseInt(_cparam_awCmd_sendRequset('#AXF', 'axf'), 16);
}

function cparam_set_focusPositionControl(data) {

    // to hex data
    data = parseInt(data).toString(16);
    // to cmd format
    data = ('000' + data).slice(-3).toUpperCase();
    return _cparam_awCmd_sendRequset('#AXF' + data, 'axf');
}



function cparam_set_cropZoomPositionControl(data) {

    // to hex data
    data = parseInt(data).toString(16);
    // to cmd format
    data = ('000' + data).slice(-3).toUpperCase();
    return _cparam_awCmd_sendRequset('OSE:9C:' + data, 'OSE:9C:');
}
// Focus Position Control
function cparam_get_cropZoomPositionControl() {
    return parseInt(_cparam_awCmd_sendRequset('QSJ:9C', 'OSD:9C:'), 16);
}
function cparam_set_crop_Zoom_Control(data) {

    // to hex data
    data = parseInt(data).toString(16);
    // to cmd format
    data = ('00000' + data).slice(-5).toUpperCase();
    return _cparam_awCmd_sendRequset('OSJ:B1:' + data, 'OSJ:B1:');
}

// one-shot AF
function cparam_set_oneShotAF(data) {

    return _cparam_awCmd_sendRequset('OSE:69:' + data, 'OSE:69:');
}
// TOUTCH AF
function cparam_set_toutchAF(data1,data2) {

    // to hex data
    var data1 = parseInt(data1).toString(16);
    // to cmd format
    data1 = ('00' + data1).slice(-2).toUpperCase();
    // to hex data
    var data2 = parseInt(data2).toString(16);
    // to cmd format
    data2 = ('00' + data2).slice(-2).toUpperCase();

    var data = data1 + ':' + data2;
    return _cparam_awCmd_sendRequset('OSJ:28:' + data, 'OSJ:28:');
}
// Iris Control Speed
function cparam_get_irisControlSpeed() {
    return parseInt(_cparam_awCmd_sendRequset('#I', 'iC'), 10);
}

function cparam_set_irisControlSpeed(data) {

    // to cmd format 01-99
    data = ('00' + data).slice(-2).toUpperCase();
    return _cparam_awCmd_sendRequset('#I' + data, 'iC');
}
// Iris Control Position
function cparam_get_irisControlPosition() {
    return parseInt(_cparam_awCmd_sendRequset('#AXI', 'axi'), 16);
}

function cparam_set_irisControlPosition(data) {

    // to hex data  555h-FFFh
    data = parseInt(data).toString(16);
    // to cmd format
    data = ('000' + data).slice(-3).toUpperCase();

    return _cparam_awCmd_sendRequset('#AXI' + data, 'axi');
}
// MANUAL IRIS VOLUME
function cparam_get_manualIrisVolume() {
    return parseInt(_cparam_awCmd_sendRequset('QRV', 'ORV:'), 16);
}

function cparam_set_manualIrisVolume(data) {

    // to hex data  000h-3FFh
    data = parseInt(data).toString(16);
    // to cmd format
    data = ('000' + data).slice(-3).toUpperCase();

    return _cparam_awCmd_sendRequset('ORV:' + data, 'ORV:');
}
// IRIS Follow
function cparam_get_irisFollow() {
    return parseInt(_cparam_awCmd_sendRequset('QSD:4F', 'OSD:4F:'), 16);
}
// IRIS(OPEN)
function cparam_set_irisOpen() {
    return _cparam_awCmd_NoData_sendRequset('LIO');
}
// IRIS(CLOSE)
function cparam_set_irisClose() {
    return _cparam_awCmd_NoData_sendRequset('LIC');
}
// IRIS(STOP)
function cparam_set_irisStop() {
    return _cparam_awCmd_NoData_sendRequset('LIT');
}
// IRIS(SPEED)
function cparam_set_irisSpeed(data) {


    return _cparam_awCmd_sendRequset('LIS:' + data, 'LIS:');
}
// Lens Position Information
function cparam_get_lensPositionInformation() {
    return _cparam_awCmd_sendRequset('#LPI', 'lPI');
}
// Lens Position Information Control
function cparam_get_lensPositionInformationControl() {
    return _cparam_awCmd_sendRequset('#LPC', 'lPC');
}
function cparam_set_lensPositionInformationControl(data) {


    return _cparam_awCmd_sendRequset('#LPC' + data, 'lPC');
}
// Request IRIS F No.
function cparam_get_requestIrisFNo() {
    var retValue = parseInt(_cparam_awCmd_sendRequset('QIF', 'OIF:'), 16);
    if ( retValue == 0xFF) {
        retValue = 'CLOSE';
    } else {
        retValue = 'F' + (retValue /  10);
    }
    return retValue;
}
// Gain/色温度/Shutter/NDの一括取得コマンチE
function cparam_get_gainColorShutterNDTogether() {
    return  _cparam_awCmd_sendRequset('#PTG', 'pTG');
}

// Request Zoom Position(Output D/A Data)
function cparam_get_requestZoomPosition() {
    return  _cparam_awCmd_sendRequset('#GZ', 'gz');
}
// Request Focus Position(Output D/A Data)
function cparam_get_requestFocusPosition() {
    return  _cparam_awCmd_sendRequset('#GF', 'gf');
}
// Request Iris Position (Output D/A Data)
function cparam_get_requestIrisPosition() {
    return  _cparam_awCmd_sendRequset('#GI', 'gi');
}

// 4-1
// Frequency
function cparam_get_frequency() {
    return _cparam_awCmd_sendRequset('QSE:77', 'OSE:77:');
}
function cparam_set_frequency(data) {
    return _cparam_awCmd_sendRequset('OSE:77:' + data, 'OSE:77:');
}
// 4-2
// Format
function cparam_get_format() {
    return _cparam_awCmd_sendRequset('QSA:87', 'OSA:87:');
}
function cparam_set_format(hexData) {
    // to cmd format
    hexData = ('00' + hexData).slice(-2).toUpperCase();
    return _cparam_awCmd_sendRequset('OSA:87:' + hexData, 'OSA:87:');
}
// SFP Mode
function cparam_get_SFPMode() {
    return parseInt(_cparam_awCmd_sendRequset('QSL:00', 'OSL:00:'), 10);
}
function cparam_set_SFPMode(data) {
    return _cparam_awCmd_sendRequset('OSL:00:' + data, 'OSL:00:');
}
// v-log
function cparam_get_v_log() {
    return _cparam_awCmd_sendRequset('QSJ:56', 'OSJ:56:');
}
function cparam_set_v_log(data) {
    return _cparam_awCmd_sendRequset('OSJ:56:' + data, 'OSJ:56:');
}
function cparam_get_v_log_paint_sw() {
    return parseInt(_cparam_awCmd_sendRequset('QSL:01', 'OSL:01:'),10);
}
function cparam_set_v_log_paint_sw(data) {
    return _cparam_awCmd_sendRequset('OSL:01:' + data, 'OSL:01:');
}
// HDR
function cparam_get_hdr() {
    return _cparam_awCmd_sendRequset('QSI:2C', 'OSI:2C:');
}
function cparam_set_hdr(data) {
    return _cparam_awCmd_sendRequset('OSI:2C:' + data, 'OSI:2C:');
}
// GAMUT
function cparam_get_gamut() {
    return _cparam_awCmd_sendRequset('QSL:02', 'OSL:02:');
}
function cparam_set_gamut(data) {
    return _cparam_awCmd_sendRequset('OSL:02:' + data, 'OSL:02:');
}
// shooting mode
function cparam_get_shooting_mode() {
    return parseInt(_cparam_awCmd_sendRequset('QSI:30', 'OSI:30:'), 10);
}
function cparam_set_shooting_mode(data) {
    return _cparam_awCmd_sendRequset('OSI:30:' + data, 'OSI:30:');
}
// serial connection
function cparam_get_serial_connection() {
    return parseInt(_cparam_awCmd_sendRequset('QVP:04', 'OVP:04:'), 10);
}
function cparam_set_serial_connection(data) {
    return _cparam_awCmd_sendRequset('OVP:04:' + data, 'OVP:04:');
}
//Tally LED Limit
//R
function cparam_get_tally_led_limit_r() {
    return parseInt(_cparam_awCmd_sendRequset('QSJ:D9', 'OSJ:D9:'), 10);
}
function cparam_set_tally_led_limit_r(data) {
    return _cparam_awCmd_sendRequset('OSJ:D9:' + data, 'OSJ:D9:');
}
//G
function cparam_get_tally_led_limit_g() {
    return parseInt(_cparam_awCmd_sendRequset('QSJ:DA', 'OSJ:DA:'), 10);
}

function cparam_set_tally_led_limit_g(data) {
    return _cparam_awCmd_sendRequset('OSJ:DA:' + data, 'OSJ:DA:');
}
//Y
function cparam_get_tally_led_limit_y() {
    return parseInt(_cparam_awCmd_sendRequset('QSL:05', 'OSL:05:'), 10);
}

function cparam_set_tally_led_limit_y(data) {
    return _cparam_awCmd_sendRequset('OSL:05:' + data, 'OSL:05:');
}
//Tally Guard
function cparam_get_tally_guard() {
    return parseInt(_cparam_awCmd_sendRequset('QSL:04', 'OSL:04:'), 10);
}

function cparam_set_tally_guard(data) {
    return _cparam_awCmd_sendRequset('OSL:04:' + data, 'OSL:04:');
}

// Output1
function cparam_get_output1() {
    return parseInt(_cparam_awCmd_sendRequset('QSJ:41', 'OSJ:41:'), 10);
}

function cparam_set_output1(data) {
    return _cparam_awCmd_sendRequset('OSJ:41:' + data, 'OSJ:41:');
}
// Output2
function cparam_get_output2() {
    return parseInt(_cparam_awCmd_sendRequset('QSJ:42', 'OSJ:42:'), 10);
}

function cparam_set_output2(data) {
    return _cparam_awCmd_sendRequset('OSJ:42:' + data, 'OSJ:42:');
}

//Ref Signal
function cparam_get_ref_signal() {
    return _cparam_awCmd_sendRequset('QSL:08', 'OSL:08:');
}
function cparam_set_ref_signal(data) {
    return _cparam_awCmd_sendRequset('OSL:08:' + data, 'OSL:08:');
}

// Audio
function cparam_get_audio() {
    return parseInt(_cparam_awCmd_sendRequset('QSA:D0', 'OSA:D0:'), 10);
}
function cparam_set_audio(hexData) {
    return _cparam_awCmd_sendRequset('OSA:D0:' + hexData, 'OSA:D0:');
}

function cparam_get_input1_select(){
    return _cparam_awCmd_sendRequset('QSL:1C:0', 'OSL:1C:0:');
}
function cparam_set_input1_select(data){
    return _cparam_awCmd_sendRequset('OSL:1C:0:' + data, 'OSL:1C:0:');
}

function cparam_get_input2_select(){
    return _cparam_awCmd_sendRequset('QSL:1C:1', 'OSL:1C:1:');
}
function cparam_set_input2_select(data){
    return _cparam_awCmd_sendRequset('OSL:1C:1:' + data, 'OSL:1C:1:');
}

function cparam_get_input1_mac_gain(){
    return _cparam_awCmd_sendRequset('QSL:1D:0', 'OSL:1D:0:');
}
function cparam_set_input1_mac_gain(data){
    return _cparam_awCmd_sendRequset('OSL:1D:0:' + data, 'OSL:1D:0:');
}

function cparam_get_input2_mac_gain(){
    return _cparam_awCmd_sendRequset('QSL:1D:1', 'OSL:1D:1:');
}
function cparam_set_input2_mac_gain(data){
    return _cparam_awCmd_sendRequset('OSL:1D:1:' + data, 'OSL:1D:1:');
}

function cparam_get_input1_line_level(){
    return _cparam_awCmd_sendRequset('QSA:D4:0', 'OSA:D4:0:');
}
function cparam_set_input1_line_level(data){
    return _cparam_awCmd_sendRequset('OSA:D4:0:' + data, 'OSA:D4:0:');
}

function cparam_get_input2_line_level(){
    return _cparam_awCmd_sendRequset('QSA:D4:1', 'OSA:D4:1:');
}
function cparam_set_input2_line_level(data){
    return _cparam_awCmd_sendRequset('OSA:D4:1:' + data, 'OSA:D4:1:');
}

function cparam_get_st2110_ch1(){
    return _cparam_awCmd_sendRequset('QSL:1F', 'OSL:1F:');
}
function cparam_set_st2110_ch1(data){
    return _cparam_awCmd_sendRequset('OSL:1F:' + data, 'OSL:1F:');
}

function cparam_get_st2110_ch2(){
    return _cparam_awCmd_sendRequset('QSL:20', 'OSL:20:');
}
function cparam_set_st2110_ch2(data){
    return _cparam_awCmd_sendRequset('OSL:20:' + data, 'OSL:20:');
}

function cparam_get_output_ch_select(){
    return _cparam_awCmd_sendRequset('QSL:1E', 'OSL:1E:');
}
function cparam_set_output_ch_select(data){
    return _cparam_awCmd_sendRequset('OSL:1E:' + data, 'OSL:1E:');
}

function cparam_get_output_ch1_volume_level(){
    let Value = _cparam_awCmd_sendRequset('QSA:D5:0', 'OSA:D5:0:');
    Value = parseInt(Value, 16) - 128;

    return Value;
}
function cparam_set_output_ch1_volume_level(data){
    data += 128;
    data = parseInt(data).toString(16);
    data = ('00' + data).slice(-2).toUpperCase();

    return _cparam_awCmd_sendRequset('OSA:D5:0:' + data, 'OSA:D5:0:');
}

function cparam_get_output_ch2_volume_level(){
    let Value = _cparam_awCmd_sendRequset('QSA:D5:1', 'OSA:D5:1:');
    Value = parseInt(Value, 16) - 128;

    return Value;
}
function cparam_set_output_ch2_volume_level(data){
    data += 128;
    data = parseInt(data).toString(16);
    data = ('00' + data).slice(-2).toUpperCase();

    return _cparam_awCmd_sendRequset('OSA:D5:1:' + data, 'OSA:D5:1:');
}

function cparam_get_output_head_room(){
    return _cparam_awCmd_sendRequset('QSA:D6', 'OSA:D6:');
}
function cparam_set_output_head_room(data){
    return _cparam_awCmd_sendRequset('OSA:D6:' + data, 'OSA:D6:');
}
// 5-13
// Input Type
function cparam_get_inputType() {
    return parseInt(_cparam_awCmd_sendRequset('QSA:D1', 'OSA:D1:'), 10);
}
function cparam_set_inputType(data) {

    return _cparam_awCmd_sendRequset('OSA:D1:' + data, 'OSA:D1:');
}
// 5-14
// Volume Level
function cparam_get_volumeLevel(data) {
    const retValue = _cparam_awCmd_sendRequset('QSA:D5:' + data, 'OSA:D5:');
    const data2 = retValue.substring(2);
    return parseInt(data2, 16) - 128;
}
function cparam_set_volumeLevel(data1, data2) {
    // to hex data
    data2 = parseInt(data2 + 128).toString(16);
    // to cmd format
    data2 = ('00' + data2).slice(-2).toUpperCase();
    const data = data1 + ":" + data2;
    return _cparam_awCmd_sendRequset('OSA:D5:' + data, 'OSA:D5:');
}
// 5-15
// Plugin Power
function cparam_get_pluginPower() {
    return _cparam_awCmd_sendRequset('QSA:D2', 'OSA:D2:');
}
function cparam_set_pluginPower(data) {

    return _cparam_awCmd_sendRequset('OSA:D2:' + data, 'OSA:D2:');
}
// R-TALLY Controll
function cparam_get_RTallyControll() {
    return parseInt(_cparam_awCmd_sendRequset('QLR', 'OLR:'), 10);
}
function cparam_set_RTallyControll(data) {

    return _cparam_awCmd_sendRequset('TLR:' + data, 'TLR:');
}
// TALLY Controll
function cparam_get_tallyControll() {
    return parseInt(_cparam_awCmd_sendRequset('#DA', 'dA'), 10);
}
function cparam_set_tallyControll(data) {

    return _cparam_awCmd_sendRequset('#DA' + data, 'dA');
}
// G-TALLY　Controll
function cparam_get_GTallyControll() {
    return parseInt(_cparam_awCmd_sendRequset('QLG', 'OLG:'), 10);
}
function cparam_set_GTallyControll(data) {

    return _cparam_awCmd_sendRequset('TLG:' + data, 'TLG:');
}
// Tally Information-R
function cparam_get_tallyInformationR() {
    return _cparam_awCmd_sendRequset('#TAI', 'tAI');
}
// Tally Information-R/G/Y
function cparam_get_tallyInformationRGY() {
    return _cparam_awCmd_sendRequset('#TAA', 'tAA');
}
// 5-25
// UHD Crop
function cparam_get_UHDCrop() {
    return parseInt(_cparam_awCmd_sendRequset('QSJ:2E', 'OSJ:2E:'), 16);
}

function cparam_set_UHDCrop(data) {

    return _cparam_awCmd_sendRequset('OSJ:2E:' + data, 'OSJ:2E:');
}
// 5-26
// 3G-SDI/IP Out
function cparam_get_3GSDIIPOut() {
    return _cparam_awCmd_sendRequset('QSI:32', 'OSI:32:');
}

function cparam_set_3GSDIIPOut(data) {
    return _cparam_awCmd_sendRequset('OSI:32:' + data, 'OSI:32:');
}

// 5-26-1
// IP Out
function cparam_get_IPOut() {
    return _cparam_awCmd_sendRequset('QSI:33', 'OSI:33:');
}

function cparam_set_IPOut(data) {
    return _cparam_awCmd_sendRequset('OSI:33:' + data, 'OSI:33:');
}
// IP Out
function cparam_get_CropZoom() {
    return _cparam_awCmd_sendRequset('QSJ:92', 'OSJ:92:');
}

function cparam_set_CropZoom(data) {
    return _cparam_awCmd_sendRequset('OSJ:92:' + data, 'OSJ:92:');
}
// 5-27
// Crop Out
function cparam_get_cropOut() {
    return _cparam_awCmd_sendRequset('QSI:16', 'OSI:16:');
}

function cparam_set_cropOut(data) {

    return _cparam_awCmd_sendRequset('OSI:16:' + data, 'OSI:16:');
}
// NDI Out
function cparam_get_NDIOut() {
    return _cparam_awCmd_sendRequset('QSJ:93', 'OSJ:93:');
}

function cparam_set_NDIOut(data) {

    return _cparam_awCmd_sendRequset('OSJ:93:' + data, 'OSJ:93:');
}
// IP OUT2
function cparam_get_IP_OUT2() {
    return _cparam_awCmd_sendRequset('QSJ:94', 'OSJ:94:');
}

function cparam_set_IP_OUT2(data) {

    return _cparam_awCmd_sendRequset('OSJ:94:' + data, 'OSJ:94:');
}
function cparam_get_Crop_Zoom_Control() {

    return _cparam_awCmd_sendRequset('QSJ:B1', 'OSJ:B1:');
}
function cparam_get_Audio_Level_meter() {

    return _cparam_awCmd_sendRequset('QSJ:B3', 'OSJ:B3:');
}
function cparam_set_Crop_Zoom_Control(data) {
    const data1 = ('00' + data).slice(-2).toUpperCase();
    return _cparam_awCmd_sendRequset('OSJ:9C:' + data1, 'OSJ:9C:');
}
// marker
function cparam_get_Marker() {
    return _cparam_awCmd_sendRequset('QSI:95', 'OSI:95:');
}

function cparam_set_Marker(data) {

    return _cparam_awCmd_sendRequset('OSI:95:' + data, 'OSI:95:');
}
// marker
function cparam_get_IP_Marker() {
    return _cparam_awCmd_sendRequset('QSI:97', 'OSI:97:');
}

function cparam_set_IP_Marker(data) {

    return _cparam_awCmd_sendRequset('OSI:97:' + data, 'OSI:97:');
}
// CROP H/V POSITION Speed Control
function cparam_set_CropHVPositionSpeedContro(data1, data2) {
    // to cmd format
    data1 = ('00' + data1).slice(-2).toUpperCase();
    // to cmd format
    data2 = ('00' + data2).slice(-2).toUpperCase();
    var data = data1 + ":" + data2;
    return _cparam_awCmd_sendRequset('OSI:15:' + data, 'OSI:15:');
}
// 5-28
// Crop Marker
function cparam_get_cropMarker() {
    return _cparam_awCmd_sendRequset('QSI:1A', 'OSI:1A:');
}

function cparam_set_cropMarker(data) {

    return _cparam_awCmd_sendRequset('OSI:1A:' + data, 'OSI:1A:');
}
// 5-29
// Crop Adjust.
function cparam_get_cropAdjust() {
    return parseInt(_cparam_awCmd_sendRequset('QSI:17', 'OSI:17:'), 10);
}

function cparam_set_cropAdjust(data) {

    return _cparam_awCmd_sendRequset('OSI:17:' + data, 'OSI:17:');
}
// 5-30
// 5-30
// Crop H POS
function cparam_get_cropHPos() {
    return parseInt(_cparam_awCmd_sendRequset('QSJ:AF', 'OSJ:AF:'), 16);
}

function cparam_set_cropHPos(data) {

    // to hex data
    data = parseInt(data).toString(16);
    // to cmd format
    data = ('000' + data).slice(-3).toUpperCase();
    return _cparam_awCmd_sendRequset('OSJ:AF:' + data, 'OSJ:AF:');
}
// Crop v POS
function cparam_get_cropVPos() {
    return parseInt(_cparam_awCmd_sendRequset('QSJ:B0', 'OSJ:B0:'), 16);
}

function cparam_set_cropVPos(data) {

    // to hex data
    data = parseInt(data).toString(16);
    // to cmd format
    data = ('000' + data).slice(-3).toUpperCase();
    return _cparam_awCmd_sendRequset('OSJ:B0:' + data, 'OSJ:B0:');
}
// Crop H POS. (YL)
function cparam_get_cropHPosYL() {
    return parseInt(_cparam_awCmd_sendRequset('QSJ:2F', 'OSJ:2F:'), 16);
}

function cparam_set_cropHPosYL(data) {

    // to hex data
    data = parseInt(data).toString(16);
    // to cmd format
    data = ('000' + data).slice(-3).toUpperCase();
    return _cparam_awCmd_sendRequset('OSJ:2F:' + data, 'OSJ:2F:');
}
// 5-31
// Crop V POS. (YL)
function cparam_get_cropVPosYL() {
    return parseInt(_cparam_awCmd_sendRequset('QSJ:30', 'OSJ:30:'), 16);
}

function cparam_set_cropVPosYL(data) {

    // to hex data
    data = parseInt(data).toString(16);
    // to cmd format
    data = ('000' + data).slice(-3).toUpperCase();
    return _cparam_awCmd_sendRequset('OSJ:30:' + data, 'OSJ:30:');
}
// 5-32
// Crop H POS. (G)
function cparam_get_cropHPosG() {
    return parseInt(_cparam_awCmd_sendRequset('QSJ:31', 'OSJ:31:'), 16);
}

function cparam_set_cropHPosG(data) {

    // to hex data
    data = parseInt(data).toString(16);
    // to cmd format
    data = ('000' + data).slice(-3).toUpperCase();
    return _cparam_awCmd_sendRequset('OSJ:31:' + data, 'OSJ:31:');
}
// 5-33
// Crop V POS. (G)
function cparam_get_cropVPosG() {
    return parseInt(_cparam_awCmd_sendRequset('QSJ:32', 'OSJ:32:'), 16);
}

function cparam_set_cropVPosG(data) {

    // to hex data
    data = parseInt(data).toString(16);
    // to cmd format
    data = ('000' + data).slice(-3).toUpperCase();
    return _cparam_awCmd_sendRequset('OSJ:32:' + data, 'OSJ:32:');
}
// 5-34
// Crop H POS. (MG)
function cparam_get_cropHPosMG() {
    return parseInt(_cparam_awCmd_sendRequset('QSJ:33', 'OSJ:33:'), 16);
}

function cparam_set_cropHPosMG(data) {

    // to hex data
    data = parseInt(data).toString(16);
    // to cmd format
    data = ('000' + data).slice(-3).toUpperCase();
    return _cparam_awCmd_sendRequset('OSJ:33:' + data, 'OSJ:33:');
}
// 5-35
// Crop V POS. (MG)
function cparam_get_cropVPosMG() {
    return parseInt(_cparam_awCmd_sendRequset('QSJ:34', 'OSJ:34:'), 16);
}

function cparam_set_cropVPosMG(data) {

    // to hex data
    data = parseInt(data).toString(16);
    // to cmd format
    data = ('000' + data).slice(-3).toUpperCase();
    return _cparam_awCmd_sendRequset('OSJ:34:' + data, 'OSJ:34:');
}
// Flip Status
function cparam_get_flipStatus() {
    return parseInt(_cparam_awCmd_sendRequset('QFS', 'OFS:'), 10);
}
// Speed With Zoom POS.
function cparam_get_speedWithZoomPOS() {
    return parseInt(_cparam_awCmd_sendRequset('#SWZ', 'sWZ'), 10);
}

function cparam_set_speedWithZoomPOS(data) {

    return _cparam_awCmd_sendRequset('#SWZ' + data, 'sWZ');
}

// Focus ADJ With PTZ
function cparam_get_focusADJWithPTZ() {
    return parseInt(_cparam_awCmd_sendRequset('QAZ', 'OAZ:'), 10);
}

function cparam_set_focusADJWithPTZ(data) {

    return _cparam_awCmd_sendRequset('OAZ:' + data, 'OAZ:');
}
// PAN SPEED
function cparam_set_panSpeed(data) {

    // to cmd format
    data = ('00' + data).slice(-2);
    return _cparam_awCmd_sendRequset('#P' + data, 'pS');
}
// TILT SPEED
function cparam_set_tiltSpeed(data) {

    // to cmd format
    data = ('00' + data).slice(-2);
    return _cparam_awCmd_sendRequset('#T' + data, 'tS');
}
// Pan Tilt Speed Control
function cparam_set_panTiltSpeedControl(data1, data2) {
    // to cmd format
    data1 = ('00' + data1).slice(-2);
    // to cmd format
    data2 = ('00' + data2).slice(-2);
    var data = data1+ "" + data2;
    return _cparam_awCmd_sendRequset('#PTS' + data, 'pTS');
}
// 相対位置制御
function cparam_set_relativePositionControl(data1, data2) {
    // to hex data
    data1 = parseInt(data1).toString(16);
    // to cmd format
    data1 = ('0000' + data1).slice(-4).toUpperCase();

    // to hex data
    data2 = parseInt(data2).toString(16);
    // to cmd format
    data2 = ('0000' + data2).slice(-4).toUpperCase();
    var data = data1+ "" + data2;

    return _cparam_awCmd_sendRequset('#RPC' + data, 'rPC');
}
// 絶対位置制御
function cparam_set_absolutePositionControl(data1, data2, data3) {
    // to hex data
    data1 = parseInt(data1).toString(16);
    // to cmd format
    data1 = ('0000' + data1).slice(-4).toUpperCase();

    // to hex data
    data2 = parseInt(data2).toString(16);
    // to cmd format
    data2 = ('0000' + data2).slice(-4).toUpperCase();

    // to hex data
    data3 = parseInt(data3).toString(16);
    // to cmd format
    data3 = ('00' + data3).slice(-2).toUpperCase();
    var data = data1+ "" + data2 + data3;

    return _cparam_awCmd_sendRequset('#U' + data, 'u');
}
// 絶対位置制御
function cparam_get_absolutePositionControl2() {
    return _cparam_awCmd_sendRequset('#APC', 'aPC');
}
function cparam_set_absolutePositionControl2(hexData1, hexData2) {
    // to cmd format
    hexData1 = ('0000' + hexData1).slice(-4).toUpperCase();
    hexData2 = ('0000' + hexData2).slice(-4).toUpperCase();

    var data = hexData1+ "" + hexData2;

    return _cparam_awCmd_sendRequset('#APC' + data, 'aPC');
}
// 速度持E��付�E絶対位置制御
function cparam_set_speedIndicationAbsolutePositionControl(hexData1, hexData2, hexData3, hexData4) {
    // to cmd format
    hexData1 = ('0000' + hexData1).slice(-4).toUpperCase();
    hexData2 = ('0000' + hexData2).slice(-4).toUpperCase();
    hexData3 = ('00' + hexData2).slice(-2).toUpperCase();
    hexData4 = ('0' + hexData2).slice(-1).toUpperCase();

    var data = hexData1+ "" + hexData2 + hexData3 + hexData4;

    return _cparam_awCmd_sendRequset('#APS' + data, 'aPS');
}
// 速度持E��付�E相対位置制御
function cparam_set_speedIndicationRelativePositionControl(hexData1, hexData2, hexData3, hexData4) {
    // to cmd format
    hexData1 = ('0000' + hexData1).slice(-4).toUpperCase();
    hexData2 = ('0000' + hexData2).slice(-4).toUpperCase();
    hexData3 = ('00' + hexData2).slice(-2).toUpperCase();
    hexData4 = ('0' + hexData2).slice(-1).toUpperCase();

    var data = hexData1+ "" + hexData2 + hexData3 + hexData4;

    return _cparam_awCmd_sendRequset('#RPS' + data, 'rPS');
}

// Limitation Control
function cparam_get_limitationControl(data) {
    return _cparam_awCmd_sendRequset('#LC' + data, 'lC');
}

function cparam_set_limitationControl(data1, data2) {
    var data = data1+ "" + data2;

    return _cparam_awCmd_sendRequset('#LC' + data, 'lC');
}
// ソフトリミッチE
function cparam_set_softLimit(data) {
    return _cparam_awCmd_sendRequset('#L' + data, 'l');
}
// Pan/Tilt/Zoom/Focus/Irisの一括取得コマンチE制御値取征E
function cparam_get_panTiltZoomFocusIrisTogetherControl() {
    var retValue = _cparam_awCmd_sendRequset('#PTV', 'pTV');
    var map = {};
    map.pan = retValue.substr(0, 4);
    map.tilt = retValue.substr(4, 4);
    map.zoom = parseInt(retValue.substr(8, 3), 16);
    map.focus = parseInt(retValue.substr(11, 3), 16);
    map.iris = parseInt(retValue.substr(14, 3), 16);
    return map;
}

// Pan/Tilt/Zoom/Focus/Irisの一括取得コマンチE制御値取征E
function cparam_pad_get_panTiltZoomFocusIrisTogetherControl(retValue) {
    var map = {};
    map.pan = retValue.substr(0, 4);
    map.tilt = retValue.substr(4, 4);
    map.zoom = parseInt(retValue.substr(8, 3), 16);
    map.focus = parseInt(retValue.substr(11, 3), 16);
    map.iris = parseInt(retValue.substr(14, 3), 16);
    return map;
}

// Pan/Tilt/Zoom/Focus/Irisの一括取得コマンチE表示値取征E
function cparam_pad_get_panTiltZoomFocusIrisTogetherDisplay(retValue) {
    var map = {};
    map.pan = retValue.substring(0, 4);
    map.tilt = retValue.substring(4, 8);
    map.zoom = parseInt(retValue.substring(8, 11), 16);
    map.focus = parseInt(retValue.substring(11, 13), 16);

    map.decIris = parseInt(retValue.substring(13, 15), 16);
    map.strIris = parseInt(retValue.substring(13, 15), 16) / 10;
    map.strIris = map.strIris.toString();
    // to format
    if(map.strIris.indexOf(".") < 0) {
        map.strIris = map.strIris + ".0";
    } else {
        map.strIris = map.strIris + "0";
    }
    map.strIris.substring(0, map.strIris.indexOf(".") + 2);
    map.strIris = "F" + map.strIris;
    return map;
}
// Pan/Tilt/Zoom/Focus/Irisの一括取得コマンチE表示値取征E
function cparam_get_panTiltZoomFocusIrisTogetherDisplay() {
    var retValue = _cparam_awCmd_sendRequset('#PTD', 'pTD');
    var map = {};
    map.pan = retValue.substring(0, 4);
    map.tilt = retValue.substring(4, 8);
    map.zoom = parseInt(retValue.substring(8, 11), 16);
    map.focus = parseInt(retValue.substring(11, 13), 16);

    map.decIris = parseInt(retValue.substring(13, 15), 16);
    map.strIris = parseInt(retValue.substring(13, 15), 16) / 10;
    map.strIris = map.strIris.toString();
    // to format
    if(map.strIris.indexOf(".") < 0) {
        map.strIris = map.strIris + ".0";
    } else {
        map.strIris = map.strIris + "0";
    }
    map.strIris.substring(0, map.strIris.indexOf(".") + 2);
    map.strIris = "F" + map.strIris;

    return map;
}
function cparam_get_color_setting() {
    return _cparam_awCmd_sendRequset('QSJ:56', 'OSJ:56:');
}
function cparam_set_color_setting(data) {
    return _cparam_awCmd_sendRequset('OSJ:56:' + data, 'OSJ:56:');
}
function cparam_get_colorBarType() {
    return parseInt(_cparam_awCmd_sendRequset('QSD:BA', 'OSD:BA:'), 10);
}
function cparam_set_colorBarType(data) {
    return _cparam_awCmd_sendRequset('OSD:BA:' + data, 'OSD:BA:');
}
// Bar
function cparam_get_bar() {
    // return hex string
    return parseInt(_cparam_awCmd_sendRequset('QBR', 'OBR:'), 10);
}
function cparam_set_bar(data) {
    return _cparam_awCmd_sendRequset('DCB:' + data, 'DCB:');
}
// Tone
function cparam_get_tone() {
    return parseInt(_cparam_awCmd_sendRequset('QSJ:27', 'OSJ:27:'), 16);
}
function cparam_set_tone(hexData) {
    return _cparam_awCmd_sendRequset('OSJ:27:' + hexData, 'OSJ:27:');
}

//Level Gauge
function cparam_get_levelGauge() {
    return parseInt(_cparam_awCmd_sendRequset('QSL:03', 'OSL:03:'), 10);
}
function cparam_set_levelGauge(hexData) {
    return _cparam_awCmd_sendRequset('OSL:03:' + hexData, 'OSL:03:');
}

//Tally
function cparam_get_tally() {
    return parseInt(_cparam_awCmd_sendRequset('#TAE', 'tAE'), 10);
}
function cparam_set_tally(hexData) {
    return _cparam_awCmd_sendRequset('#TAE' + hexData, 'tAE');
}

//Tally Brightness
function cparam_get_tally_brightness() {
    return parseInt(_cparam_awCmd_sendRequset('QSA:D3', 'OSA:D3:'), 10);
}
function cparam_set_tally_brightness(hexData) {
    return _cparam_awCmd_sendRequset('OSA:D3:' + hexData, 'OSA:D3:');
}

// Install Position
function cparam_get_installPosition() {
    return parseInt(_cparam_awCmd_sendRequset('#INS', 'iNS'), 10);
}

function cparam_set_installPosition(data) {
    return _cparam_awCmd_sendRequset('#INS' + data, 'iNS');
}
// 7-1
// Preset Speed Unit
function cparam_get_presetSpeedUnit() {
    return _cparam_awCmd_sendRequset('QSJ:29', 'OSJ:29:');
}
function cparam_set_presetSpeedUnit(data) {
    return _cparam_awCmd_sendRequset('OSJ:29:' + data, 'OSJ:29:');
}
// 7-2
// Preset Speed Table
function cparam_get_presetSpeedTable() {
    return parseInt(_cparam_awCmd_sendRequset('#PST', 'pST'), 10);
}
function cparam_set_presetSpeedTable(data) {
    return _cparam_awCmd_sendRequset('#PST' + data, 'pST');
}
// 7-3
// Preset Speed
function cparam_get_presetSpeed() {
    var speedUnit = cparam_get_presetSpeedUnit();
    var speedValue = _cparam_awCmd_sendRequset('#UPVS', 'uPVS');

    if(speedUnit == 1){
        speedValue = parseInt(speedValue, 16);
    }else {
        speedValue = parseInt(speedValue, 10);
        if(speedValue == 0){
            speedValue = 999;
        }
    }

    return speedValue;
}
function cparam_set_presetSpeed(data) {
    data = ('000' + data).slice(-3).toUpperCase();
    return _cparam_awCmd_sendRequset('#UPVS' + data, 'uPVS');
}

function cparam_get_RiseSCurve() {
    let Value = _cparam_awCmd_sendRequset('QSJ:A9', 'OSJ:A9:');
    Value = parseInt(Value, 16);

    return Value;
}
function cparam_set_RiseSCurve(data) {
    data = parseInt(data).toString(16);
    data = ('00' + data).slice(-2).toUpperCase();
    return _cparam_awCmd_sendRequset('OSJ:A9:' + data, 'OSJ:A9:');
}

function cparam_get_FallSCurve() {
    let Value = _cparam_awCmd_sendRequset('QSJ:AA', 'OSJ:AA:');
    Value = parseInt(Value, 16);

    return Value;
}
function cparam_set_FallSCurve(data) {
    data = parseInt(data).toString(16);
    data = ('00' + data).slice(-2).toUpperCase();
    return _cparam_awCmd_sendRequset('OSJ:AA:' + data, 'OSJ:AA:');
}


function cparam_get_Position_RiseAcceleration() {
    let Value = _cparam_awCmd_sendRequset('QSJ:AB', 'OSJ:AB:');
    Value = parseInt(Value, 16);

    return Value;
}
function cparam_set_Position_RiseAcceleration(data) {
    data = parseInt(data).toString(16);
    data = ('00' + data).slice(-2).toUpperCase();
    return _cparam_awCmd_sendRequset('OSJ:AB:' + data, 'OSJ:AB:');
}


function cparam_get_Position_FallAcceleration() {
    let Value = _cparam_awCmd_sendRequset('QSJ:AC', 'OSJ:AC:');
    Value = parseInt(Value, 16);

    return Value;
}
function cparam_set_Position_FallAcceleration(data) {
    data = parseInt(data).toString(16);
    data = ('00' + data).slice(-2).toUpperCase();
    return _cparam_awCmd_sendRequset('OSJ:AC:' + data, 'OSJ:AC:');
}

function cparam_get_Position_RiseRamp() {
    let Value = _cparam_awCmd_sendRequset('QSJ:AD', 'OSJ:AD:');
    Value = (parseInt(Value, 16)/10).toFixed(1);

    return Value;
}

function cparam_get_focus_guide(){
    let Value = _cparam_awCmd_sendRequset('QSL:C3', 'OSL:C3:');
    return Value;
}

function cparam_set_focus_guide(data){
    let Value = _cparam_awCmd_sendRequset('OSL:C3:' + data, 'OSL:C3:');
    return Value;
}

function cparam_get_iris_window(){
    let Value = _cparam_awCmd_sendRequset('QSL:CC', 'OSL:CC:');
    return Value;
}

function cparam_set_iris_window(data){
    let Value = _cparam_awCmd_sendRequset('OSL:CC:' + data, 'OSL:CC:');
    return Value;
}

function cparam_get_iris_window_position(){
    let Value = _cparam_awCmd_sendRequset('QSL:CD', 'OSL:CD:');
    return Value;
}

function cparam_set_iris_window_position(data1,data2,data3,data4){
    let Value = _cparam_awCmd_sendRequset('OSL:CD:' + ('00' + data1).slice(-2).toUpperCase() + ':' + ('00' + data2).slice(-2).toUpperCase() + ':' + ('00' + data3).slice(-2).toUpperCase() + ':' + ('00' + data4).slice(-2).toUpperCase(), 'OSL:CD:');
    return Value;
}

function cparam_get_bar_id(){
    let Value = _cparam_awCmd_sendRequset('QSD:BE', 'OSD:BE:');
    return Value;
}

function cparam_set_bar_id(data){
    let Value = _cparam_awCmd_sendRequset('OSD:BE:' + data, 'OSD:BE:');
    return Value;
}

function cparam_get_brightness(){
    let Value = _cparam_awCmd_sendRequset('QSL:0B', 'OSL:0B:');
    Value = parseInt(Value, 16);

    return Value;
}

function cparam_set_h_phase_coarse(data){
    data += 128;
    data = parseInt(data).toString(16);
    data = ('00' + data).slice(-2).toUpperCase();

    let Value = _cparam_awCmd_sendRequset('OSL:09:' + data, 'OSL:09:');
    return Value;
}
function cparam_set_h_phase_fine(data){
    data += 128;
    data = parseInt(data).toString(16);
    data = ('00' + data).slice(-2).toUpperCase();

    let Value = _cparam_awCmd_sendRequset('OSL:0A:' + data, 'OSL:0A:');
    return Value;
}
function cparam_set_brightness(data){
    data = parseInt(data).toString(16);
    data = ('00' + data).slice(-2).toUpperCase();

    let Value = _cparam_awCmd_sendRequset('OSL:0B:' + data, 'OSL:0B:');
    return Value;
}

function cparam_get_id1_v_position(){
    let Value = _cparam_awCmd_sendRequset('QSL:0C', 'OSL:0C:');
    Value = parseInt(Value, 10);
    return Value;
}

function cparam_set_id1_v_position(data){
    let Value = _cparam_awCmd_sendRequset('OSL:0C:' + data, 'OSL:0C:');
    return Value;
}

function cparam_get_id1_h_position(){
    let Value = _cparam_awCmd_sendRequset('QSL:0D', 'OSL:0D:');
    Value = parseInt(Value, 16);

    return Value;
}

function cparam_set_id1_h_position(data){
    data = parseInt(data).toString(16).toUpperCase();
    let Value = _cparam_awCmd_sendRequset('OSL:0D:' + data, 'OSL:0D:');
    return Value;
}
function cparam_get_id1(){
    let Value = _cparam_awCmd_sendRequset('QSL:0E', 'OSL:0E:');  
    var str = Platform.hex2a(Value);
    return str;
}
function cparam_set_id1(data){
    if (data == "") {
        data = "00000000000000000000000000000000";
    } else {
        data = Platform.a2hex(data);
    }
    let Value = _cparam_awCmd_sendRequset('OSL:0E:' + data, 'OSL:0E:');
    return Value;
}
function cparam_get_id2(){
    let Value = _cparam_awCmd_sendRequset('QSL:11', 'OSL:11:');
    var str = Platform.hex2a(Value);
    return str;
}
function cparam_set_id2(data){
    if (data == "") {
        data = "00000000000000000000000000000000";
    } else {
        data = Platform.a2hex(data);
    }
    let Value = _cparam_awCmd_sendRequset('OSL:11:' + data, 'OSL:11:');
    return Value;
}
function cparam_get_id2_v_position(){
    let Value = _cparam_awCmd_sendRequset('QSL:0F', 'OSL:0F:');
    Value = parseInt(Value, 10);
    return Value;
}

function cparam_set_id2_v_position(data){
    let Value = _cparam_awCmd_sendRequset('OSL:0F:' + data, 'OSL:0F:');
    return Value;
}

function cparam_get_id2_h_position(){
    let Value = _cparam_awCmd_sendRequset('QSL:10', 'OSL:10:');
    Value = parseInt(Value, 16);

    return Value;
}

function cparam_set_id2_h_position(data){
    data = parseInt(data).toString(16).toUpperCase();
    let Value = _cparam_awCmd_sendRequset('OSL:10:' + data, 'OSL:10:');
    return Value;
}
function cparam_get_offset_v_position(){
    let Value = _cparam_awCmd_sendRequset('QSL:12', 'OSL:12:');
    Value = parseInt(Value, 16);
    return Value;
}
function cparam_set_offset_v_position(data){
    data = parseInt(data).toString(16);
    data = ('00' + data).slice(-2).toUpperCase();

    let Value = _cparam_awCmd_sendRequset('OSL:12:' + data, 'OSL:12:');
    return Value;
}
function cparam_get_offset_h_position(){
    let Value = _cparam_awCmd_sendRequset('QSL:13', 'OSL:13:');
    Value = parseInt(Value, 16);
    return Value;
}
function cparam_set_offset_h_position(data){
    data = parseInt(data).toString(16);
    data = ('00' + data).slice(-2).toUpperCase();

    let Value = _cparam_awCmd_sendRequset('OSL:13:' + data, 'OSL:13:');
    return Value;
}
function cparam_set_Position_RiseRamp(data) {
    data = parseInt(data).toString(16);
    data = ('00' + data).slice(-2).toUpperCase();
    return _cparam_awCmd_sendRequset('OSJ:AD:' + data, 'OSJ:AD:');
}

function cparam_get_Position_FallRamp() {
    let Value = _cparam_awCmd_sendRequset('QSJ:AE', 'OSJ:AE:');
    Value = (parseInt(Value, 16)/10).toFixed(1);

    return Value;
}
function cparam_set_Position_FallRamp(data) {
    data = parseInt(data).toString(16);
    data = ('00' + data).slice(-2).toUpperCase();
    return _cparam_awCmd_sendRequset('OSJ:AE:' + data, 'OSJ:AE:');
}


// Preset Speed
function cparam_get_presetSpeedUTVS() {
    return _cparam_awCmd_sendRequset('#UTVS', 'uTVS');
}
function cparam_set_presetSpeedUTVS(data) {
    return _cparam_awCmd_sendRequset('#UTVS' + data, 'uTVS');
}
// 7-4
// Preset Scope
function cparam_get_presetScope() {
    return parseInt(_cparam_awCmd_sendRequset('QSE:71', 'OSE:71:'), 10);
}
function cparam_set_presetScope(data) {
    return _cparam_awCmd_sendRequset('OSE:71:' + data, 'OSE:71:');
}
// 7-5
// Preset D-Extender
function cparam_get_presetDExtender() {
    return parseInt(_cparam_awCmd_sendRequset('QSE:7C', 'OSE:7C:'), 10);
}
function cparam_set_presetDExtender(data) {
    return _cparam_awCmd_sendRequset('OSE:7C:' + data, 'OSE:7C:');
}
// 7-6
// Preset Crop
function cparam_get_presetCrop() {
    return parseInt(_cparam_awCmd_sendRequset('QSJ:2A', 'OSJ:2A:'), 16);
}
function cparam_set_presetCrop(data) {
    return _cparam_awCmd_sendRequset('OSJ:2A:' + data, 'OSJ:2A:');
}
// 7-7
// Preset Thumbnail Update
function cparam_get_presetThumbnailUpdate() {
    return parseInt(_cparam_awCmd_sendRequset('QSJ:2B', 'OSJ:2B:'), 16);
}
function cparam_set_presetThumbnailUpdate(data) {
    return _cparam_awCmd_sendRequset('OSJ:2B:' + data, 'OSJ:2B:');
}
// 7-8
// Preset Name
function cparam_get_presetName() {
    return parseInt(_cparam_awCmd_sendRequset('QSJ:2C', 'OSJ:2C:'), 16);
}
function cparam_set_presetName(data) {
    return _cparam_awCmd_sendRequset('OSJ:2C:' + data, 'OSJ:2C:');
}
// 7-9
// Preset Zoom Mode
function cparam_get_presetZoomMode() {
    return parseInt(_cparam_awCmd_sendRequset('QSE:7D', 'OSE:7D:'), 10);
}
function cparam_set_presetZoomMode(data) {
    return _cparam_awCmd_sendRequset('OSE:7D:' + data, 'OSE:7D:');
}
// 7-10
// Freeze During Preset
function cparam_get_freezeDuringPreset() {
    return parseInt(_cparam_awCmd_sendRequset('#PRF', 'pRF'), 10);
}
function cparam_set_freezeDuringPreset(data) {
    return _cparam_awCmd_sendRequset('#PRF' + data, 'pRF');
}
function cparam_get_preset_iris() {
    return parseInt(_cparam_awCmd_sendRequset('QSJ:5B', 'OSJ:5B:'), 10);
}
function cparam_set_preset_iris(data) {
    return _cparam_awCmd_sendRequset('OSJ:5B:' + data, 'OSJ:5B:');
}
function cparam_get_preset_shutter() {
    return parseInt(_cparam_awCmd_sendRequset('QSJ:D5', 'OSJ:D5:'), 10);
}
function cparam_set_preset_shutter(data) {
    return _cparam_awCmd_sendRequset('OSJ:D5:' + data, 'OSJ:D5:');
}
function cparam_get_preset_acceleration() {
    return parseInt(_cparam_awCmd_sendRequset('QSJ:A8', 'OSJ:A8:'), 10);
}
function cparam_set_preset_acceleration(data) {
    return _cparam_awCmd_sendRequset('OSJ:A8:' + data, 'OSJ:A8:');
}
// Recall Preset Memory
function cparam_set_recallPresetMemory(data) {
    data = ('00' + data).slice(-2);
    return _cparam_awCmd_sendRequset('#R' + data, 's');
}
// Save Preset Memory
function cparam_set_savePresetMemory(data) {
    data = ('00' + data).slice(-2);
    return _cparam_awCmd_sendRequset('#M' + data, 's');
}
// Delete Preset Memory
function cparam_set_deletePresetMemory(data) {
    data = ('00' + data).slice(-2);
    return _cparam_awCmd_sendRequset('#C' + data, 's');
}
// Delete All Preset Memory
function cparam_set_deleteAllPresetMemory() {
    return _cparam_awCmd_NoData_sendRequset('#CLEAR');
}
// Preset Max Number Confirmation
function cparam_get_presetMaxNumberConfirmation(data) {
    data = ('00' + data).slice(-2).toUpperCase();
    return parseInt(_cparam_awCmd_sendRequset('#PE' + data, 'pE'),16).toString((2));
}
// Preset Max Number Confirmation
function cparam_get_presetMaxNumber() {
    return _cparam_awCmd_sendRequset('#PMN', 'pMN');
}
// Request Latest Recall Preset No.
function cparam_get_requestLatestRecallPresetNo() {
    return _cparam_awCmd_sendRequset('#S', 's');
}
// プリセチE��名�E設宁E個別)
function cparam_get_presetNameSettingIndividual(data) {
    data = ('00' + data).slice(-2).toUpperCase();

    var name = _cparam_awCmd_sendRequset('QSJ:35:' + data, 'OSJ:35:' + data + ":");
    var reg = /\s/;
    if(reg.exec(name)==null){
        return name;
    }
    else{
        //return name.replace(/(^\s*)|(\s*$)/g,"");
        return name;
    }
}
function cparam_set_presetNameSettingIndividual(data1, data2) {
    data1 = ('00' + data1).slice(-2).toUpperCase();
    var data = data1 + ":" + data2;
    if(data.length <19)
    {
        data = padRight(data.toString(), 18, ' ');
    }
    return _cparam_awCmd_sendRequset('OSJ:35:' + data, 'OSJ:35:');
}

function padRight(str, len, charStr) {
    var s = str + '';
    return s + new Array(len - s.length + 1).join(charStr, '');
}

// プリセチE��名�E削除(個別)
function cparam_set_presetNameDelete(data) {
    data = ('00' + data).slice(-2);
    return _cparam_awCmd_sendRequset('OSJ:36:' + data, 'OSJ:36:');
}
// プリセチE��名�E削除(全削除)
function cparam_set_presetNameDeleteAll() {
    return _cparam_awCmd_NoData_sendRequset('OSJ:37');
}
// サムネイルチEタ更新(個別)
function cparam_set_thumbnailDataUpdateIndividual(data) {
    data = ('00' + data).slice(-2);
    return _cparam_awCmd_sendRequset('OSJ:39:' + data, 'OSJ:39:');
}
// サムネイルチEタ削除(個別)
function cparam_set_thumbnailDataDeleteIndividual(data) {
    data = ('00' + data).slice(-2);
    return _cparam_awCmd_sendRequset('OSJ:3A:' + data, 'OSJ:3A:');
}
// サムネイルチEタ削除(全削除)
function cparam_set_thumbnailDataDeleteAll() {
    return _cparam_awCmd_NoData_sendRequset('OSJ:3B');
}
// STILチEタ削除(個別)
function cparam_set_STILDataDeleteIndividual(data) {
    data = ('00' + data).slice(-2);
    return _cparam_awCmd_sendRequset('OSJ:C5:' + data, 'OSJ:C5:');
}
// プリセチE��Name/サムネイル カウンタ-
function cparam_get_presetNameThumbnailCounter(data) {
    data = parseInt(data).toString(16);
    data = ('00' + data).slice(-2).toUpperCase();
    return _cparam_awCmd_sendRequset('QSJ:3C:' + data, 'OSJ:3C:');
}
// プリセチE��Name/サムネイル カウンタ-
function cparam_get_pad_presetNameThumbnailCounter(data) {
    data = parseInt(data).toString(16);
    data = ('00' + data).slice(-2).toUpperCase();
    return data;
}
// SOFTWARE VERSION (System version)
function cparam_get_systemVersion() {
    return _cparam_awCmd_sendRequset('QSL:99', 'OSL:99:');
}
// SOFTWARE VERSION
function cparam_get_softwareVersion(data) {
    var retValue = _cparam_awCmd_sendRequset('QSL:99' + data, 'OSL:99:' + data);
    var major = retValue.substr(1, 2);
    var minor = retValue.substr(4, 2);
    return "Ver." + major + "." + minor;
 }
// INITIALIZE for menu
function cparam_set_initializeForMenu() {
    return _cparam_awCmd_NoData_sendRequset('INM');
}
// INITIALIZE for maintenance.
function cparam_set_initializeForMaintenance() {
    return _cparam_awCmd_NoData_sendRequset('INI');
}
// MENU (MENU ON/OFF)
function cparam_get_menuOnOFF() {
    return parseInt(_cparam_awCmd_sendRequset('QUS', 'OUS:'), 10);
}
function cparam_set_menuOnOFF(data) {
    return _cparam_awCmd_sendRequset('DUS:' + data, 'DUS:');
}
// MENU SW (MENU Cancel)
function cparam_set_menuCancel(data) {
    return _cparam_awCmd_sendRequset('DPG:' + data, 'DPG:');
}
// ITEM SW (ENTER Botton)
function cparam_set_enterBotton(data) {
    return _cparam_awCmd_sendRequset('DIT:' + data, 'DIT:');
}
// YES SW (UP Botton)
function cparam_set_upBotton(data) {
    return _cparam_awCmd_sendRequset('CUP:' + data, 'CUP:');
}
// NO SW (Down Botton)
function cparam_set_downBotton(data) {
    return _cparam_awCmd_sendRequset('CDW:' + data, 'CDW:');
}
// RIGHT SW (Right Botton)
function cparam_set_rightBotton(data) {
    return _cparam_awCmd_sendRequset('CRT:' + data, 'CRT:');
}
// LEFT SW (Left Botton)
function cparam_set_leftBotton(data) {
    return _cparam_awCmd_sendRequset('CLT:' + data, 'CLT:');
}
// 他リモコンロチE��設宁E
function cparam_set_remoteLockSetting(data) {
    return _cparam_awCmd_sendRequset('OSJ:3E:' + data, 'OSJ:3E:');
}
// 他リモコンロチE��解除
function cparam_set_remoteUnLockSetting() {
    return _cparam_awCmd_NoData_sendRequset('OSJ:3F');
}
// 他リモコンロチE��状態問ぁE��わせ
function cparam_get_remoteUnLockSetting() {
    return _cparam_awCmd_sendRequset('QSJ:40', 'OSJ:40:');
}
// ERROR NOTICE
function cparam_get_errorNotice() {
    return _cparam_awCmd_sendRequset('QER', 'OER:');
}
// ERROR INFORMATION
function cparam_get_errorInformation() {
    return _cparam_awCmd_sendRequset('QSI:46', 'OSI:46:');
}
// Error Status Info.
function cparam_get_errorStatusInfo() {
    return _cparam_awCmd_sendRequset('#RER', 'rER');
}
// �E�ｸ�E�ﾁE��E�E�排�E要汁E
function cparam_get_logDataDischargeRequest() {
    return _cparam_awCmd_sendRequset('#LOG', 'lOG');
}
// �E��E�E�E�ｸ�E�ﾁE��E�E�排�E要汁E
function cparam_get_errorLogDataDischargeRequest() {
    return _cparam_awCmd_sendRequset('#ELG', 'eLG');
}
// Resolution Control
function cparam_get_resolutionControl() {
    return parseInt(_cparam_awCmd_sendRequset('#RZL', 'rZL'), 10);
}
function cparam_set_resolutionControl(data) {
    return _cparam_awCmd_sendRequset('#RZL' + data, 'rZL');
}
// MODEL NUMBER
function cparam_get_modelNumber() {
    return _cparam_awCmd_sendRequset('QID', 'OID:');
}
// Adaptive Matrix
function cparam_get_daptiveMatrix() {
    return _cparam_awCmd_sendRequset('QSJ:4F', 'OSJ:4F:');
}
// Adaptive Matrix
function cparam_set_daptiveMatrix(data) {
    return _cparam_awCmd_sendRequset('OSJ:4F:' + data, 'OSJ:4F:');
}
// PowerON, Standby
function cparam_get_powerOnStandby() {
    var retValue = _cparam_awCmd_sendRequset('#O', 'p');
    var powerState = 0;
    if(retValue == '0' || retValue == 'f') {
        powerState = 0;
    } else {
        powerState = 1;
    }
    return powerState;
}
function cparam_set_powerOnStandby(data) {
    return _cparam_awCmd_sendRequset('#O' + data, 'p');
}

function cparams_get_glc() {
    try{
        var ret = cparam_sendRequest("/cgi-bin/get_glc");
        cparams.glc = parseInt(ret);
    }
    catch (e) {}
}

function cparam_get_Serial() {
    return _cparam_awCmd_sendRequset('QSJ:54','OSJ:54:');
}

function cparam_set_Serial(data) {
    return _cparam_awCmd_sendRequset('OSJ:54:' + data, 'OSJ:54:');
}
function cparam_get_mode_ip() {
    return _cparam_awCmd_sendRequset('QSJ:55','OSJ:55:');
}

function cparam_set_mode_ip(data) {
    return _cparam_awCmd_sendRequset('OSJ:55:' + data, 'OSJ:55:');
}
/* WB
 */
function cparam_get_atw() {
    return _cparam_awCmd_sendRequset('QSL:2A','OSL:2A:');
}

function cparam_set_atw(data) {
    return _cparam_awCmd_sendRequset('OSL:2A:' + data, 'OSL:2A:');
}

function cparam_get_whiteBalanceMode() {
    return _cparam_awCmd_sendRequset('QSL:2B','OSL:2B:');
}

function cparam_set_whiteBalanceMode(data) {
    return _cparam_awCmd_sendRequset('OSL:2B:' + data, 'OSL:2B:');
}

function cparam_get_shocklessWbSw() {
    return _cparam_awCmd_sendRequset('QSL:2C','OSL:2C:');
}

function cparam_set_shocklessWbSw(data) {
    return _cparam_awCmd_sendRequset('OSL:2C:' + data, 'OSL:2C:');
}

function cparam_get_ShocklessWbSwSpeed() {
    return _cparam_awCmd_sendRequset('QSL:2D','OSL:2D:');
}

function cparam_set_ShocklessWbSwSpeed(data) {
    return _cparam_awCmd_sendRequset('OSL:2D:' + data, 'OSL:2D:');
}

function cparam_get_ChromaLevelSwitch() {
    return _cparam_awCmd_sendRequset('QSG:93','OSG:93:');
}

function cparam_set_ChromaLevelSwitch(data) {
    return _cparam_awCmd_sendRequset('OSG:93:' + data, 'OSG:93:');
}

function cparam_get_ColorTempBch() {
    var retValue = _cparam_awCmd_sendRequset('QSL:2F', 'OSL:2F:');
    if (retValue) {
        // Data1
        return parseInt(retValue.substr(0, 5), 16);
    }
    return retValue;
}

function cparam_set_ColorTempBch(data) {

    // to hex data
    data = parseInt(data).toString(16);
    // to cmd format
    data = ('00000' + data).slice(-5).toUpperCase();
    // plug data2
    data = data + ':0'; // UE150では、Data2は常に0(Valid)とする
    return _cparam_awCmd_sendRequset('OSL:2F:' + data, 'OSL:2F:');
}

function cparam_get_Color_RGainBch() {
    return parseInt(_cparam_awCmd_sendRequset('QSL:32', 'OSL:32:'), 16) - 0x800;
}

function cparam_set_Color_RGainBch(data) {

    // to hex data
    data = parseInt(data + 0x800).toString(16);
    // to cmd format
    data = ('000' + data).slice(-3).toUpperCase();
    return _cparam_awCmd_sendRequset('OSL:32:' + data, 'OSL:32:');
}

function cparam_get_Color_BGainBch() {
    return parseInt(_cparam_awCmd_sendRequset('QSL:33', 'OSL:33:'), 16) - 0x800;
}

function cparam_set_Color_BGainBch(data) {

    // to hex data
    data = parseInt(data + 0x800).toString(16);
    // to cmd format
    data = ('000' + data).slice(-3).toUpperCase();
    return _cparam_awCmd_sendRequset('OSL:33:' + data, 'OSL:33:');
}

function cparam_get_Color_GGainBch() {
    return parseInt(_cparam_awCmd_sendRequset('QSL:34', 'OSL:34:'), 16) - 0x800;
}

function cparam_set_Color_GGainBch(data) {

    // to hex data
    data = parseInt(data + 0x800).toString(16);
    // to cmd format
    data = ('000' + data).slice(-3).toUpperCase();
    return _cparam_awCmd_sendRequset('OSL:34:' + data, 'OSL:34:');
}

function cparam_get_gGainRelControlSwitch() {
    return _cparam_awCmd_sendRequset('QSL:35','OSL:35:');
}

function cparam_set_gGainRelControlSwitch(data) {
    return _cparam_awCmd_sendRequset('OSL:35:' + data, 'OSL:35:');
}

function cparam_get_Color_PresetRGain() {
    return parseInt(_cparam_awCmd_sendRequset('QSL:36', 'OSL:36:'), 16) - 0x800;
}

function cparam_set_Color_PresetRGain(data) {

    // to hex data
    data = parseInt(data + 0x800).toString(16);
    // to cmd format
    data = ('000' + data).slice(-3).toUpperCase();
    return _cparam_awCmd_sendRequset('OSL:36:' + data, 'OSL:36:');
}

function cparam_get_Color_PresetGGain() {
    return parseInt(_cparam_awCmd_sendRequset('QSL:37', 'OSL:37:'), 16) - 0x800;
}

function cparam_set_Color_PresetGGain(data) {

    // to hex data
    data = parseInt(data + 0x800).toString(16);
    // to cmd format
    data = ('000' + data).slice(-3).toUpperCase();
    return _cparam_awCmd_sendRequset('OSL:37:' + data, 'OSL:37:');
}

function cparam_get_Color_PresetBGain() {
    return parseInt(_cparam_awCmd_sendRequset('QSL:38', 'OSL:38:'), 16) - 0x800;
}

function cparam_set_Color_PresetBGain(data) {

    // to hex data
    data = parseInt(data + 0x800).toString(16);
    // to cmd format
    data = ('000' + data).slice(-3).toUpperCase();
    return _cparam_awCmd_sendRequset('OSL:38:' + data, 'OSL:38:');
}

function cparam_get_Color_PresetRGainAch() {
    return parseInt(_cparam_awCmd_sendRequset('QSL:39', 'OSL:39:'), 16) - 0x800;
}

function cparam_set_Color_PresetRGainAch(data) {

    // to hex data
    data = parseInt(data + 0x800).toString(16);
    // to cmd format
    data = ('000' + data).slice(-3).toUpperCase();
    return _cparam_awCmd_sendRequset('OSL:39:' + data, 'OSL:39:');
}

function cparam_get_Color_PresetGGainAch() {
    return parseInt(_cparam_awCmd_sendRequset('QSL:3A', 'OSL:3A:'), 16) - 0x800;
}

function cparam_set_Color_PresetGGainAch(data) {

    // to hex data
    data = parseInt(data + 0x800).toString(16);
    // to cmd format
    data = ('000' + data).slice(-3).toUpperCase();
    return _cparam_awCmd_sendRequset('OSL:3A:' + data, 'OSL:3A:');
}

function cparam_get_Color_PresetBGainAch () {
    return parseInt(_cparam_awCmd_sendRequset('QSL:3B', 'OSL:3B:'), 16) - 0x800;
}

function cparam_set_Color_PresetBGainAch (data) {

    // to hex data
    data = parseInt(data + 0x800).toString(16);
    // to cmd format
    data = ('000' + data).slice(-3).toUpperCase();
    return _cparam_awCmd_sendRequset('OSL:3B:' + data, 'OSL:3B:');
}

function cparam_get_Color_PresetRGainBch () {
    return parseInt(_cparam_awCmd_sendRequset('QSL:3C', 'OSL:3C:'), 16) - 0x800;
}

function cparam_set_Color_PresetRGainBch (data) {

    // to hex data
    data = parseInt(data + 0x800).toString(16);
    // to cmd format
    data = ('000' + data).slice(-3).toUpperCase();
    return _cparam_awCmd_sendRequset('OSL:3C:' + data, 'OSL:3C:');
}

function cparam_get_Color_PresetGGainBch () {
    return parseInt(_cparam_awCmd_sendRequset('QSL:3D', 'OSL:3D:'), 16) - 0x800;
}

function cparam_set_Color_PresetGGainBch (data) {

    // to hex data
    data = parseInt(data + 0x800).toString(16);
    // to cmd format
    data = ('000' + data).slice(-3).toUpperCase();
    return _cparam_awCmd_sendRequset('OSL:3D:' + data, 'OSL:3D:');
}

function cparam_get_Color_PresetBGainBch () {
    return parseInt(_cparam_awCmd_sendRequset('QSL:3E', 'OSL:3E:'), 16) - 0x800;
}

function cparam_set_Color_PresetBGainBch (data) {

    // to hex data
    data = parseInt(data + 0x800).toString(16);
    // to cmd format
    data = ('000' + data).slice(-3).toUpperCase();
    return _cparam_awCmd_sendRequset('OSL:3E:' + data, 'OSL:3E:');
}

function cparam_get_gainOffsetBch() {
    return _cparam_awCmd_sendRequset('QSL:3F','OSL:3F:');
}

function cparam_set_gainOffsetBch(data) {
    return _cparam_awCmd_sendRequset('OSL:3F:' + data, 'OSL:3F:');
}

function cparam_get_flare() {
    return _cparam_awCmd_sendRequset('QSA:11','OSA:11:');
}

function cparam_set_flare(data) {
    return _cparam_awCmd_sendRequset('OSA:11:' + data, 'OSA:11:');
}

function cparam_get_Color_MasterFlare () {
    return parseInt(_cparam_awCmd_sendRequset('QSL:40', 'OSL:40:'), 16) - 0x800;
}

function cparam_set_Color_MasterFlare (data) {

    // to hex data
    data = parseInt(data + 0x800).toString(16);
    // to cmd format
    data = ('000' + data).slice(-3).toUpperCase();
    return _cparam_awCmd_sendRequset('OSL:40:' + data, 'OSL:40:');
}

function cparam_get_Color_RFlare () {
    return parseInt(_cparam_awCmd_sendRequset('QSL:41', 'OSL:41:'), 16) - 0x800;
}

function cparam_set_Color_RFlare (data) {

    // to hex data
    data = parseInt(data + 0x800).toString(16);
    // to cmd format
    data = ('000' + data).slice(-3).toUpperCase();
    return _cparam_awCmd_sendRequset('OSL:41:' + data, 'OSL:41:');
}

function cparam_get_Color_GFlare () {
    return parseInt(_cparam_awCmd_sendRequset('QSL:42', 'OSL:42:'), 16) - 0x800;
}

function cparam_set_Color_GFlare (data) {

    // to hex data
    data = parseInt(data + 0x800).toString(16);
    // to cmd format
    data = ('000' + data).slice(-3).toUpperCase();
    return _cparam_awCmd_sendRequset('OSL:42:' + data, 'OSL:42:');
}

function cparam_get_Color_BFlare () {
    return parseInt(_cparam_awCmd_sendRequset('QSL:43', 'OSL:43:'), 16) - 0x800;
}

function cparam_set_Color_BFlare (data) {

    // to hex data
    data = parseInt(data + 0x800).toString(16);
    // to cmd format
    data = ('000' + data).slice(-3).toUpperCase();
    return _cparam_awCmd_sendRequset('OSL:43:' + data, 'OSL:43:');
}

function cparam_get_DnrLevel() {
    return _cparam_awCmd_sendRequset('QSG:B5','OSG:B5:');
}

function cparam_set_DnrLevel(data) {
    return _cparam_awCmd_sendRequset('OSG:B5:' + data, 'OSG:B5:');
}

function cparam_get_hlgMode() {
    return _cparam_awCmd_sendRequset('QSI:39','OSI:39:');
}

function cparam_set_hlgMode(data) {
    return _cparam_awCmd_sendRequset('OSI:39:' + data, 'OSI:39:');
}

function cparam_get_sdrConvertMode() {
    return _cparam_awCmd_sendRequset('QSI:3A','OSI:3A:');
}

function cparam_set_sdrConvertMode(data) {
    return _cparam_awCmd_sendRequset('OSI:3A:' + data, 'OSI:3A:');
}

function cparam_get_blackGammaSw() {
    return _cparam_awCmd_sendRequset('QSI:3C','OSI:3C:');
}

function cparam_set_blackGammaSw(data) {
    return _cparam_awCmd_sendRequset('OSI:3C:' + data, 'OSI:3C:');
}

function cparam_get_MasterBlackGamma() {
    return parseInt(_cparam_awCmd_sendRequset('QSI:3D', 'OSI:3D:'), 16) - 0x80;
}

function cparam_set_MasterBlackGamma(data) {

    // to hex data
    data = parseInt(data + 0x80).toString(16);
    // to cmd format
    data = ('00' + data).slice(-2).toUpperCase();
    return _cparam_awCmd_sendRequset('OSI:3D:' + data, 'OSI:3D:');
}

function cparam_get_RBlackGamma() {
    return parseInt(_cparam_awCmd_sendRequset('QSI:3E', 'OSI:3E:'), 16) - 0x80;
}

function cparam_set_RBlackGamma(data) {

    // to hex data
    data = parseInt(data + 0x80).toString(16);
    // to cmd format
    data = ('00' + data).slice(-2).toUpperCase();
    return _cparam_awCmd_sendRequset('OSI:3E:' + data, 'OSI:3E:');
}

function cparam_get_BBlackGamma() {
    return parseInt(_cparam_awCmd_sendRequset('QSI:3F', 'OSI:3F:'), 16) - 0x80;
}

function cparam_set_BBlackGamma(data) {

    // to hex data
    data = parseInt(data + 0x80).toString(16);
    // to cmd format
    data = ('00' + data).slice(-2).toUpperCase();
    return _cparam_awCmd_sendRequset('OSI:3F:' + data, 'OSI:3F:');
}

function cparam_get_PictureGain() {
    return parseInt(_cparam_awCmd_sendRequset('QSI:43', 'OSI:43:'), 16) - 0x80;
}

function cparam_set_PictureGain(data) {

    // to hex data
    data = parseInt(data + 0x80).toString(16);
    // to cmd format
    data = ('00' + data).slice(-2).toUpperCase();
    return _cparam_awCmd_sendRequset('OSI:43:' + data, 'OSI:43:');
}

function cparam_get_PicturePoint() {
    return parseInt(_cparam_awCmd_sendRequset('QSL:88', 'OSL:88:'), 16);
}

function cparam_set_PicturePoint(data) {

    // to hex data
    data = parseInt(data).toString(16);
    // to cmd format
    data = ('00' + data).slice(-2).toUpperCase();
    return _cparam_awCmd_sendRequset('OSL:88:' + data, 'OSL:88:');
}

function cparam_get_PictureSlope() {
    return parseInt(_cparam_awCmd_sendRequset('QSL:89', 'OSL:89:'), 16);
}

function cparam_set_PictureSlope(data) {

    // to hex data
    data = parseInt(data).toString(16);
    // to cmd format
    data = ('00' + data).slice(-2).toUpperCase();
    return _cparam_awCmd_sendRequset('OSL:89:' + data, 'OSL:89:');
}

function cparam_get_PictureBlackOffset() {
    return parseInt(_cparam_awCmd_sendRequset('QSL:8A', 'OSL:8A:'), 16) - 0x80;
}

function cparam_set_PictureBlackOffset(data) {

    // to hex data
    data = parseInt(data + 0x80).toString(16);
    // to cmd format
    data = ('00' + data).slice(-2).toUpperCase();
    return _cparam_awCmd_sendRequset('OSL:8A:' + data, 'OSL:8A:');
}

/**
 * common : send cgi and get response
 * @param reqCmd
 * @param respCmd
 * @param ret_radix
 * @returns {*}
 */
function _cparam_awCmd_sendRequset(reqCmd, respCmd) {
    //return "";
    var retValue = "";

    var uri = _aw_cam  + reqCmd + "&res=1";
    if(reqCmd.indexOf("#") == 0) {
        reqCmd = reqCmd.replace("#",'%23');
        uri = _aw_ptz  + reqCmd + "&res=1";
    }
    $.ajax({
        type: "get",
        url: uri,
        async: false,
        timeout: 5 * 1000,
        success: function (data) {
            try { //add by yangyang 20180911
                if (data.indexOf(respCmd) == 0) {
                    retValue = data.substring(respCmd.length);
                } else {
                    retValue = data;
                }
            }
            catch(e){
                retValue = "";
            }

        },
        error: function () {
            retValue = "";
        }
    });
    return retValue;
}
function _cparam_awCmd_async_sendRequset(reqCmd, respCmd) {
    //return "";
    var retValue = "";

    var uri = _aw_cam  + reqCmd + "&res=1";
    if(reqCmd.indexOf("#") == 0) {
        reqCmd = reqCmd.replace("#",'%23');
        uri = _aw_ptz  + reqCmd + "&res=1";
    }

    $.ajax({
        type: "get",
        url: uri,
        async: true,
        timeout: 5 * 1000,
        success: function (data) {
            try { //add by yangyang 20180911
                if (data.indexOf(respCmd) == 0) {
                    retValue = data.substring(respCmd.length);
                } else {
                    retValue = data;
                }
            }
            catch(e){
                retValue = "";
            }

        },
        error: function () {
            retValue = "";
        }
    });
    return retValue;
}
function _cparam_awCmd_deferreds_sendRequset(reqCmd, respCmd) {
    //return "";
    var retValue = "";

    var uri = _aw_cam  + reqCmd + "&res=1";
    if(reqCmd.indexOf("#") == 0) {
        reqCmd = reqCmd.replace("#",'%23');
        uri = _aw_ptz  + reqCmd + "&res=1";
    }

    var defer = $.Deferred();
    $.ajax({
        url : uri,
        success: function(data){
            try { //add by yangyang 20180911
                if (data.indexOf(respCmd) == 0) {
                    retValue = data.substring(respCmd.length);
                    defer.resolve(retValue);
                } else {
                    defer.resolve(retValue);
                }
            }
            catch(e){
                defer.resolve("");
            }
        },
        error: function () {
            defer.resolve("");
        }
    });

    return defer.promise();
}

function _cparam_awCmd_NoData_sendRequset(reqCmd) {
    var uri = _aw_cam  + reqCmd + "&res=1";
    if(reqCmd.indexOf("#") == 0) {
        reqCmd = reqCmd.replace("#",'%23');
        uri = _aw_ptz  + reqCmd + "&res=1";
    }

    $.ajax({
        type: "get",
        url: uri,
        async: false,
        timeout: 5 * 1000,
        success: function (data) {
            return data;
        },
        error: function () {

        }
    });
    return null;
}

function _cparam_NoData_sendRequset(uri) {

    $.ajax({
        type: "get",
        url: uri,
        async: false,
        timeout: 5 * 1000,
        success: function (data) {
        },
        error: function () {
        }
    });
    return null;
}

function _cparam_Cgi_NoData_sendRequset(type, uri) {
    var retValue = null;
    $.ajax({
        type: type,
        url: uri,
        async: false,
        timeout: 5 * 1000,
        success: function (data) {
            if(data) {
                retValue = data;
            }
        },
        error: function () {
        }
    });
    return retValue;
}


function getRtmpStatus() {
    let retValue = _cparam_Cgi_NoData_sendRequset("get", "/cgi-bin/get_rtmp_status");
    if (retValue.indexOf("status") == 0) {
        retValue = retValue.substring("status".length + 1, retValue.length - 2);
    }
    return retValue;
}
function getsrtStatus() {
    let retValue = _cparam_Cgi_NoData_sendRequset("get", "/cgi-bin/get_srt_status");
    if (retValue.indexOf("status") == 0) {
        retValue = retValue.substring("status".length+1, retValue.length - 1);
    }
    return retValue;
}
function getTsUdpStatus() {
    var retValue = _cparam_Cgi_NoData_sendRequset("get", "/cgi-bin/get_ts_status");
    if (retValue.indexOf("status") == 0) {
        retValue = retValue.substring("status".length + 1, retValue.length - 1);
    }
    return retValue;
}
function _cparam_Cgi_sendRequset(type, uri, data) {
    var retValue = null;
    $.ajax({
        type: type,
        url: uri,
        data:data,
        async: false,
        timeout: 5 * 1000,
        success: function (data) {
            if(data) {
                retValue = data;
            }
        },
        error: function () {

        }
    });
    return retValue;
}

var gidTimer;

function send_Cgi_center_click(x, y, resolution) {
    var mapPtd = cparam_get_panTiltZoomFocusIrisTogetherDisplay();
    var data = {};
    if ( resolution == 3840){
        x = parseInt( x * (3840/1450));
        y = parseInt( y * (3840/1450)); //parseInt( x/16*9 );
    } else if(resolution > 1280) {
        x = parseInt(x * (1920 / 1450));
        y = parseInt(y * (1920 / 1450)); //parseInt( x/16*9 ) *
    }
    data['x'] = parseInt(x);
    data['y'] = parseInt(y);
    data['oz'] = parseInt(mapPtd.zoom).toString(16);
    data['dz'] = window.parent.gD_Zoom_Magnification;
    data['position'] = window.parent.gInstall_Position;
    data['resolution'] = resolution;
    $.ajax({
        type: 'GET',
        url: '/cgi-bin/center_click',
        data:data,
        async: false,
        timeout: 100,
        success: function (data) {
        },
        error: function (jqXHR, textStatus, errorThrown) {
        }
    });
}

function send_Mobile_Cgi_center_click(x, y, resolution) {
    var mapPtd = cparam_get_panTiltZoomFocusIrisTogetherDisplay();
    var data = {};
    data['x'] = parseInt(x);
    data['y'] = parseInt(y);
    data['oz'] = parseInt(mapPtd.zoom).toString(16);
    data['dz'] = window.parent.gD_Zoom_Magnification;
    data['position'] = window.parent.gInstall_Position;
    data['resolution'] = resolution;
    $.ajax({
        type: 'GET',
        url: '/cgi-bin/center_click',
        data:data,
        async: false,
        timeout: 100,
        success: function (data) {
        },
        error: function (jqXHR, textStatus, errorThrown) {
        }
    });
}

function getLiveModeStatus() {
    var retValue = _cparam_Cgi_NoData_sendRequset("get", "/cgi-bin/get_live_mode");
    if (retValue.indexOf("mode") == 0) {
        retValue = retValue.substring("mode".length + 1);
    }
    return retValue;
}

/**
 * send cgi commend : get_basic --- depend on url
 * @returns {{}}
 */
function cparam_getSnmpInfo() {
    var url = "/cgi-bin/get_snmp_info";
    var obj = {};
    var ret = cparam_sendRequest(url);

    obj.mode = "";
    obj.name = "";
    obj.auth = "";
    obj.enc = "";
    obj.pass = "";
    obj.system = "";
    obj.location = "";
    obj.contact = "";
    if (ret) {
        ret = cparam_getRetArray(ret);
        for (var i = 0; i < ret.length; i++) {
            if (ret[i].indexOf("mode=") == 0) obj.mode = ret[i].substring("mode=".length);
            else if (ret[i].indexOf("name=") == 0) obj.name = ret[i].substring("name=".length);
            else if (ret[i].indexOf("auth=") == 0) obj.auth = ret[i].substring("auth=".length);
            else if (ret[i].indexOf("enc=") == 0) obj.enc = ret[i].substring("enc=".length);
            else if (ret[i].indexOf("pass=") == 0) obj.pass = ret[i].substring("pass=".length);
            else if (ret[i].indexOf("system=") == 0) obj.system = ret[i].substring("system=".length);
            else if (ret[i].indexOf("location=") == 0) obj.location = ret[i].substring("location=".length);
            else if (ret[i].indexOf("contact=") == 0) obj.contact = ret[i].substring("contact=".length);
        }

        delete ret;
    }
    return obj;
}

/**
 * send cgi commend : get_basic --- depend on url
 * @returns {{}}
 */
function cparam_get_referer_mode() {
    var url = "/cgi-bin/get_referer_mode";
    var obj = {};
    var ret = cparam_sendRequest(url);

    obj.mode = "";
    //ret = cparam_getRetArray(ret);
    obj.mode = ret.substring("mode=".length,"mode=".length+1);
    return obj;
}
/**
 * send cgi commend : get_basic --- depend on url
 * @returns {{}}
 */
function cparam_get_easyip_mode() {
    var url = "/cgi-bin/get_iesc_plaintext_mode";
    var obj = {};
    var ret = cparam_sendRequest(url);

    obj.mode = "";
    //ret = cparam_getRetArray(ret);
    obj.mode = ret.substring("mode=".length,"mode=".length+1);
    return obj;
}
function cparam_get_invert_pan_tilt_axis() {
    return parseInt(_cparam_awCmd_sendRequset('QSJ:C1', 'OSJ:C1:'), 16);
}

function cparam_set_invert_pan_tilt_axis(data) {

    return _cparam_awCmd_sendRequset('OSJ:C1:' + data, 'OSJ:C1:');
}
function cparam_getTslInfo() {
    var url = "/cgi-bin/get_tsl_info";
    var obj = {};
    var ret = cparam_sendRequest(url);

    obj.index = "";
    obj.port = "";
    if (ret) {
        ret = cparam_getRetArray(ret);
        for (var i = 0; i < ret.length; i++) {
            if (ret[i].indexOf("index=") == 0) obj.index = ret[i].substring("index=".length);
            else if (ret[i].indexOf("port=") == 0) obj.port = ret[i].substring("port=".length);
        }

        delete ret;
    }
    return obj;
}
function cparam_get_camera_id() {
    return parseInt(_cparam_awCmd_sendRequset('QSJ:F4', 'OSJ:F4:'),16);
}

function cparam_set_camera_id(data) {
    data = parseInt(data).toString(16);
    data = ('00' + data).slice(-2).toUpperCase();
    return _cparam_awCmd_sendRequset('OSJ:F4:' + data, 'OSJ:F4:');
}

function cparam_get_moip_active_status() {
    let retValue;
    $.ajax({
        type: "get",
        url: "/cgi-bin/get_activate_status?type=moip",
        async: false,
        timeout: 100,
        success: function (data) {
            resultAarry = cparam_getRetArray(data);
            var retStatus = null;
            for (var i = 0; i < resultAarry.length; i++) {
                if (resultAarry[i].indexOf("status=") == 0) {
                    retStatus = resultAarry[i].substring("status=".length);
                    continue;
                }
            }
            if (retStatus == "done") {
                retValue = 'OK';
            }
            
            if (retStatus == "yet") {
                retValue = 'NG';
            }

        },
        error: function (jqXHR, textStatus, errorThrown) {
            retValue = 'NG';
        }
    });
    return retValue;
}
function cparam_get_riseCurve() {
    let Value = _cparam_awCmd_sendRequset('QSJ:A3', 'OSJ:A3:');
    Value = parseInt(Value, 16);

    return Value;
}
function cparam_set_riseCurve(data) {
    data = parseInt(data).toString(16);
    data = ('00' + data).slice(-2).toUpperCase();
    return _cparam_awCmd_sendRequset('OSJ:A3:' + data, 'OSJ:A3:');
}
function cparam_get_fallCurve() {
    let Value = _cparam_awCmd_sendRequset('QSJ:A4', 'OSJ:A4:');
    Value = parseInt(Value, 16);

    return Value;
}
function cparam_set_fallCurve(data) {
    data = parseInt(data).toString(16);
    data = ('00' + data).slice(-2).toUpperCase();
    return _cparam_awCmd_sendRequset('OSJ:A4:' + data, 'OSJ:A4:');
}
function cparam_get_riseAcceleration() {
    let Value = _cparam_awCmd_sendRequset('QSJ:A5', 'OSJ:A5:');
    Value = parseInt(Value, 16);

    return Value;
}
function cparam_set_riseAcceleration(data) {
    data = parseInt(data).toString(16);
    data = ('00' + data).slice(-2).toUpperCase();
    return _cparam_awCmd_sendRequset('OSJ:A5:' + data, 'OSJ:A5:');
}

function cparam_get_fallAcceleration() {
    let Value = _cparam_awCmd_sendRequset('QSJ:A6', 'OSJ:A6:');
    Value = parseInt(Value, 16);

    return Value;
}
function cparam_set_fallAcceleration(data) {
    data = parseInt(data).toString(16);
    data = ('00' + data).slice(-2).toUpperCase();
    return _cparam_awCmd_sendRequset('OSJ:A6:' + data, 'OSJ:A6:');
}
function cparam_get_pt_acceleration() {
    return parseInt(_cparam_awCmd_sendRequset('QSJ:A2', 'OSJ:A2:'), 10);
}
function cparam_set_pt_acceleration(data) {
    return _cparam_awCmd_sendRequset('OSJ:A2:' + data, 'OSJ:A2:');
}
function cparam_get_usb_auto_standby() {
    return _cparam_awCmd_sendRequset('QSJ:DC', 'OSJ:DC:');
}
// 6-2
// Smart Picture Flip
function cparam_get_smartPictureFlip() {
    return parseInt(_cparam_awCmd_sendRequset('#SPF', 'sPF'), 10);
}

function cparam_set_smartPictureFlip(data) {

    return _cparam_awCmd_sendRequset('#SPF' + data, 'sPF');
}
// 6-3
// Flip Detect Angle
function cparam_get_flipDetectAngle() {
    return parseInt(_cparam_awCmd_sendRequset('#FDA', 'fDA'), 16);
}

function cparam_set_flipDetectAngle(data) {

    // to hex data
    data = parseInt(data).toString(16);
    // to cmd format
    data = ('00' + data).slice(-2).toUpperCase();
    return _cparam_awCmd_sendRequset('#FDA' + data, 'fDA');
}
// Flip Status
function cparam_get_flipStatus() {
    return parseInt(_cparam_awCmd_sendRequset('QFS', 'OFS:'), 10);
}
// 6-4
// PT. Speed Mode
function cparam_get_PTSpeedMode() {
    return parseInt(_cparam_awCmd_sendRequset('QSJ:2D', 'OSJ:2D:'), 16);
}

function cparam_set_PTSpeedMode(data) {

    return _cparam_awCmd_sendRequset('OSJ:2D:' + data, 'OSJ:2D:');
}
function cparam_get_powerOnPosition() {
    return parseInt(_cparam_awCmd_sendRequset('QSJ:45', 'OSJ:45:'), 10);
}
function cparam_set_powerOnPosition(data) {
    return _cparam_awCmd_sendRequset('OSJ:45:' + data, 'OSJ:45:');
}
function cparam_get_privacyMode() {
    return parseInt(_cparam_awCmd_sendRequset('QSJ:A7', 'OSJ:A7:'), 10);
}
function cparam_set_privacyMode(data) {
    return _cparam_awCmd_sendRequset('OSJ:A7:' + data, 'OSJ:A7:');
}
// 7-12
// Power On Preset Number
function cparam_get_powerOnPresetNumber() {
    return parseInt(_cparam_awCmd_sendRequset('QSJ:46', 'OSJ:46:'), 10);
}
function cparam_set_powerOnPresetNumber(data) {
    data = ('00' + data).slice(-2);
    return _cparam_awCmd_sendRequset('OSJ:46:' + data, 'OSJ:46:');
}

function cparam_get_12GOutPutItem() {
    return parseInt(_cparam_awCmd_sendRequset('QSL:14', 'OSL:14:'), 10);
}
function cparam_set_12GOutPutItem(data) {
    return _cparam_awCmd_sendRequset('OSL:14:' + data, 'OSL:14:');
}
function cparam_get_12GHDROutput() {
    return parseInt(_cparam_awCmd_sendRequset('QSJ:1F', 'OSJ:1F:'), 10);
}
function cparam_set_12GHDROutput(data) {
    return _cparam_awCmd_sendRequset('OSJ:1F:' + data, 'OSJ:1F:');
}
function cparam_get_12GVLogOutput() {
    return parseInt(_cparam_awCmd_sendRequset('QSJ:57', 'OSJ:57:'), 10);
}
function cparam_set_12GVLogOutput(data) {
    return _cparam_awCmd_sendRequset('OSJ:57:' + data, 'OSJ:57:');
}
function cparam_get_12GCharOutput() {
    var ipCharValue = parseInt(_cparam_awCmd_sendRequset('QSE:7B', 'OSE:7B:'),16);
    var ipChar = ("00000000" + ipCharValue.toString(2)).slice(-8);
    var result = ipChar.charAt(2);

   return result;
}
function cparam_set_12GCharOutput(data) {
    var ipCharValue = parseInt(_cparam_awCmd_sendRequset('QSE:7B', 'OSE:7B:'),16);
    var ipChar = ('00000000' + ipCharValue.toString(2)).slice(-8);

    var ipStr = "";
    for(var i = 0; i < ipChar.length; i++) {
        if(i == 2) {
            ipStr += data;
        } else {
            ipStr += ipChar.charAt(i);
        }
    }

    var result = parseInt(ipStr,2).toString(16);
    result = ('00' + result).slice(-2).toUpperCase();
    return _cparam_awCmd_sendRequset('OSE:7B:' + result, 'OSE:7B:');
}

function cparam_get_12G3GSDIOutput() {
    return parseInt(_cparam_awCmd_sendRequset('QSJ:20', 'OSJ:20:'), 10);
}
function cparam_set_12G3GSDIOutput(data) {
    return _cparam_awCmd_sendRequset('OSJ:20:' + data, 'OSJ:20:');
}

function cparam_get_3GOut1HDROutput() {
    return parseInt(_cparam_awCmd_sendRequset('QSJ:22', 'OSJ:22:'), 10);
}
function cparam_set_3GOut1HDROutput(data) {
    return _cparam_awCmd_sendRequset('OSJ:22:' + data, 'OSJ:22:');
}
function cparam_get_3GOut1VlogOutput() {
    return parseInt(_cparam_awCmd_sendRequset('QSJ:58', 'OSJ:58:'), 10);
}
function cparam_set_3GOut1VlogOutput(data) {
    return _cparam_awCmd_sendRequset('OSJ:58:' + data, 'OSJ:58:');
}
function cparam_get_3GOut1OutputItem() {
    return parseInt(_cparam_awCmd_sendRequset('QSL:15', 'OSL:15:'), 10);
}
function cparam_set_3GOut1OutputItem(data) {
    return _cparam_awCmd_sendRequset('OSL:15:' + data, 'OSL:15:');
}
function cparam_get_3GOut1Char() {
    var ipCharValue = parseInt(_cparam_awCmd_sendRequset('QSE:7B', 'OSE:7B:'),16);
    var ipChar = ('00000000' + ipCharValue.toString(2)).slice(-8);
   var result = ipChar.charAt(7);

   return result;
}
function cparam_set_3GOut1Char(data) {
    var ipCharValue = parseInt(_cparam_awCmd_sendRequset('QSE:7B', 'OSE:7B:'),16);
    var ipChar = ('00000000' + ipCharValue.toString(2)).slice(-8);

    var ipStr = "";
    for(var i = 0; i < ipChar.length; i++) {
        if(i == 7) {
            ipStr += data;
        } else {
            ipStr += ipChar.charAt(i);
        }
    }

    var result = parseInt(ipStr,2).toString(16);
    result = ('00' + result).slice(-2).toUpperCase();
    return _cparam_awCmd_sendRequset('OSE:7B:' + result, 'OSE:7B:');
}
function cparam_get_3GOut1SDI() {
    return parseInt(_cparam_awCmd_sendRequset('QSI:29', 'OSI:29:'), 10);
}
function cparam_set_3GOut1SDI(data) {
    return _cparam_awCmd_sendRequset('OSI:29:' + data, 'OSI:29:');
}
function cparam_get_3GOut2HDROutput() {
    return parseInt(_cparam_awCmd_sendRequset('QSJ:24', 'OSJ:24:'), 10);
}
function cparam_set_3GOut2HDROutput(data) {
    return _cparam_awCmd_sendRequset('OSJ:24:' + data, 'OSJ:24:');
}
function cparam_get_3GOut2VlogOutput() {
    return parseInt(_cparam_awCmd_sendRequset('QSJ:59', 'OSJ:59:'), 10);
}
function cparam_set_3GOut2VlogOutput(data) {
    return _cparam_awCmd_sendRequset('OSJ:59:' + data, 'OSJ:59:');
}
function cparam_get_3GOut2Char() {
    var ipCharValue = parseInt(_cparam_awCmd_sendRequset('QSE:7B', 'OSE:7B:'),16);
   var ipChar = ('00000000' + ipCharValue.toString(2)).slice(-8);
   var result = ipChar.charAt(1);

   return result;
}
function cparam_get_3GOut2OutputItem() {
    return parseInt(_cparam_awCmd_sendRequset('QSL:18', 'OSL:18:'), 10);
}
function cparam_set_3GOut2OutputItem(data) {
    return _cparam_awCmd_sendRequset('OSL:18:' + data, 'OSL:18:');
}
function cparam_get_3GOut2OutputSelect() {
    return parseInt(_cparam_awCmd_sendRequset('QSL:17', 'OSL:17:'), 10);
}
function cparam_set_3GOut2OutputSelect(data) {
    return _cparam_awCmd_sendRequset('OSL:17:' + data, 'OSL:17:');
}
function cparam_set_3GOut2Char(data) {
    var ipCharValue = parseInt(_cparam_awCmd_sendRequset('QSE:7B', 'OSE:7B:'),16);
    var ipChar = ('00000000' + ipCharValue.toString(2)).slice(-8);

    var ipStr = "";
    for(var i = 0; i < ipChar.length; i++) {
        if(i == 1) {
            ipStr += data;
        } else {
            ipStr += ipChar.charAt(i);
        }
    }

    var result = parseInt(ipStr,2).toString(16);
    result = ('00' + result).slice(-2).toUpperCase();
    return _cparam_awCmd_sendRequset('OSE:7B:' + result, 'OSE:7B:');
}
function cparam_get_3GOut2SDI() {
    return parseInt(_cparam_awCmd_sendRequset('QSL:1A', 'OSL:1A:'), 10);
}
function cparam_set_3GOut2SDI(data) {
    return _cparam_awCmd_sendRequset('OSL:1A:' + data, 'OSL:1A:');
}
function cparam_get_HDMIHDROutput() {
    return parseInt(_cparam_awCmd_sendRequset('QSJ:26', 'OSJ:26:'), 10);
}
function cparam_set_HDMIHDROutput(data) {
    return _cparam_awCmd_sendRequset('OSJ:26:' + data, 'OSJ:26:');
}
function cparam_get_HDMIVlogOutput() {
    return parseInt(_cparam_awCmd_sendRequset('QSJ:5A', 'OSJ:5A:'), 10);
}
function cparam_set_HDMIVlogOutput(data) {
    return _cparam_awCmd_sendRequset('OSJ:5A:' + data, 'OSJ:5A:');
}
function cparam_get_HDMIVideoSampling() {
    return parseInt(_cparam_awCmd_sendRequset('QSE:68', 'OSE:68:'), 10);
}
function cparam_set_HDMIVideoSampling(data) {
    return _cparam_awCmd_sendRequset('OSE:68:' + data, 'OSE:68:');
}
function cparam_get_HDMIChar() {
    var ipCharValue = parseInt(_cparam_awCmd_sendRequset('QSE:7B', 'OSE:7B:'),16);
    var ipChar = ('00000000' + ipCharValue.toString(2)).slice(-8);
   var result = ipChar.charAt(6);

   return result;
}
function cparam_set_HDMIChar(data) {
    var ipCharValue = parseInt(_cparam_awCmd_sendRequset('QSE:7B', 'OSE:7B:'),16);
    var ipChar = ('00000000' + ipCharValue.toString(2)).slice(-8);

    var ipStr = "";
    for(var i = 0; i < ipChar.length; i++) {
        if(i == 6) {
            ipStr += data;
        } else {
            ipStr += ipChar.charAt(i);
        }
    }

    var result = parseInt(ipStr,2).toString(16);
    result = ('00' + result).slice(-2).toUpperCase();
    return _cparam_awCmd_sendRequset('OSE:7B:' + result, 'OSE:7B:');
}
function cparam_get12GFormatSelect(){
    return _cparam_awCmd_sendRequset('QSJ:1E', 'OSJ:1E:');
}
function cparam_set12GFormatSelect(data){
    return _cparam_awCmd_sendRequset('OSJ:1E:' + data, 'OSJ:1E:');
}
function cparam_get3GOutput1FormatSelect(){
    return _cparam_awCmd_sendRequset('QSJ:21', 'OSJ:21:');
}
function cparam_set3GOutput1FormatSelect(data){
    return _cparam_awCmd_sendRequset('OSJ:21:' + data, 'OSJ:21:');
}
function cparam_get3GOutput2FormatSelect(){
    return _cparam_awCmd_sendRequset('QSJ:23', 'OSJ:23:');
}
function cparam_set3GOutput2FormatSelect(data){
    return _cparam_awCmd_sendRequset('OSJ:23:' + data, 'OSJ:23:');
}
function cparam_getHDMIFormatSelect(){
    return _cparam_awCmd_sendRequset('QSJ:25', 'OSJ:25:');
}
function cparam_setHDMIFormatSelect(data){
    return _cparam_awCmd_sendRequset('OSJ:25:' + data, 'OSJ:25:');
}
//Signals -Return
function cparam_get_return1Id() {
    var value =  _cparam_awCmd_sendRequset('QSL:1B', 'QSL:1B:');

    return value;
}
function cparam_set_return1Id(data) {
    if (data == "") {
        data = "0000000000";
    }
    return _cparam_awCmd_sendRequset('OSL:1B:' + data, 'OSL:1B:');
}

//Signals - IP Signal
function cparam_get_ip_signal_ndi_format() {
    var value =  _cparam_awCmd_sendRequset('QSL:21', 'OSL:21:');
    return value;
}

function cparam_set_ip_signal_ndi_format(hexData) {
    hexData = ('00' + hexData).slice(-2).toUpperCase();
    return  _cparam_awCmd_sendRequset('OSL:21:'+ hexData, 'OSL:21:');  
}

function cparam_get_ip_signal_output_item() {
    return parseInt(_cparam_awCmd_sendRequset('QSL:22', 'OSL:22:'), 10);
}
function cparam_set_ip_signal_output_item(data) {
    return _cparam_awCmd_sendRequset('OSL:22:' + data, 'OSL:22:');
}
// 4-7
// Fan1
function cparam_get_fan1() {
    return parseInt(_cparam_awCmd_sendRequset('#FAN', 'fAN'), 10);
}
function cparam_set_fan1(data) {

    return _cparam_awCmd_sendRequset('#FAN' + data, 'fAN');
}
// 4-8
// Fan2
function cparam_get_fan2() {
    return parseInt(_cparam_awCmd_sendRequset('#FA2', 'fA2'), 10);
}
function cparam_set_fan2(data) {

    return _cparam_awCmd_sendRequset('#FA2' + data, 'fA2');
}
// Wireless Control
function cparam_get_wirelessControl() {
    return parseInt(_cparam_awCmd_sendRequset('#WLC', 'wLC'), 10);
}
function cparam_set_wirelessControl(data) {

    return _cparam_awCmd_sendRequset('#WLC' + data, 'wLC');
}
// Wireless ID
function cparam_get_wirelessID() {
    return parseInt(_cparam_awCmd_sendRequset('#RID', 'rID'), 10);
}
function cparam_set_wirelessID(data) {

    return _cparam_awCmd_sendRequset('#RID' + data, 'rID');
}
// Status Lamp
function cparam_get_status_lamp() {
    return parseInt(_cparam_awCmd_sendRequset('#LMP', 'lMP'), 10);
}
function cparam_set_status_lamp(data) {

    return _cparam_awCmd_sendRequset('#LMP' + data, 'lMP');
}
// function cparam_get_ip_signal_ndi_char_item() {
//     if (_cparam_awCmd_sendRequset('QSE:7B', 'OSE:7B:') == "10") {
//         return 1;
//     } else {
//         return 0;
//     }
// }

// function cparam_set_isignal_ndi_char_item(data) {
//     return _cparam_awCmd_sendRequset('OSE:7B:' + data, 'OSE:7B:');
// }

function cparam_get_ip_signal_ip_char_item() {
   var ipCharValue = parseInt(_cparam_awCmd_sendRequset('QSE:7B', 'OSE:7B:'),16);
   var ipChar = ('00000000' + ipCharValue.toString(2)).slice(-8);
   var result = ipChar.charAt(3);

   return result;
}
function cparam_set_isignal_ip_char_item(data) {
    var ipCharValue = parseInt(_cparam_awCmd_sendRequset('QSE:7B', 'OSE:7B:'),16);
    var ipChar = ('00000000' + ipCharValue.toString(2)).slice(-8);

    var ipStr = "";
    for(var i = 0; i < ipChar.length; i++) {
        if(i == 3) {
            ipStr += data;
        } else {
            ipStr += ipChar.charAt(i);
        }
    }

    var result = parseInt(ipStr,2).toString(16);
    result = ('00' + result).slice(-2).toUpperCase();
    return _cparam_awCmd_sendRequset('OSE:7B:' + result, 'OSE:7B:');
}

function cparam_get_ip_signal_h264_output_item() {
    return parseInt(_cparam_awCmd_sendRequset('QSL:23', 'OSL:23:'), 10);
}
function cparam_set_ip_signal_h264_output_item(data) {
    return _cparam_awCmd_sendRequset('OSL:23:' + data, 'OSL:23:');
}

function cparam_getMainVideoFormatSelect() {
    return _cparam_awCmd_sendRequset('QSL:AA', 'OSL:AA:');
}
function cparam_setMainVideoFormatSelect(data) {
    return _cparam_awCmd_sendRequset('OSL:AA:' + data, 'OSL:AA:');
}
function cparam_getCropVideoFormatSelect() {
    return _cparam_awCmd_sendRequset('QSL:AC', 'OSL:AC:');
}
function cparam_getMonitorVideoFormatSelect() {
    return _cparam_awCmd_sendRequset('QSL:AD', 'OSL:AD:');
}
function cparam_getReturnVideoFormatSelect() {
    return _cparam_awCmd_sendRequset('QSL:B4', 'OSL:B4:');
}
function cparam_setReturnVideoFormatSelect(data){
    return _cparam_awCmd_sendRequset('OSL:B4:' + data, 'OSL:B4:');
}

function cparams_get_moip_audio_fmt_tx() {
    var obj = {};
    obj.ch1 = "";
    obj.ch2 = "";

    var ret = cparam_sendRequest("/cgi-bin/get_moip_audio_fmt_tx");
    if (ret) {
        ret = cparam_getRetArray(ret);
        for (var i = 0; i < ret.length; i++) {
            if (ret[i].indexOf("ch0_format=") == 0) obj.ch1 = ret[i].substring("ch0_format=".length);
            else if (ret[i].indexOf("ch1_format=") == 0) obj.ch2 = ret[i].substring("ch1_format=".length);
        }

        delete ret;
    }

    return obj;
}

function cparams_set_moip_audio_fmt_tx(ch0Value, ch1Value) {
    let data = {};
    data['ch0_format'] = ch0Value;
    data['ch1_format'] = ch1Value;

    $("#dialog_setup").show();
    $.ajax({
        type: "get",
        url: "/cgi-bin/set_moip_audio_fmt_tx",
        data: data,
        success: function (data) {
            setTimeout(function(){
                $("#dialog_setup").hide();
            },500);
            return true;
        },
        error: function (jqXHR, textStatus, errorThrown) {
            setTimeout(function(){
                $("#dialog_setup").hide();
            },500);
        }
    });
}
//LEVEL GAUGE REQUEST INCLINATION
function cparams_get_level_gauge_request_clination(){
    return _cparam_awCmd_sendRequset('QSL:AF', 'OSL:AF:');
}

function request_matrix(){
    return _cparam_awCmd_sendRequset('QSL:B2', 'OSL:B2:');
}

function cparam_set_focus_guid_position(h_data, v_data) {
    var h_data_hex = ('00' + parseInt(h_data).toString(16)).slice(-2).toUpperCase();
    var v_data_hex = ('00' + parseInt(v_data).toString(16)).slice(-2).toUpperCase();
    var data = h_data_hex + ":" + v_data_hex;
    return _cparam_awCmd_sendRequset('OSL:C4:' + data, 'OSL:C4:');
}

/**
 * send cgi commend : get_jpeg-xs_video_tx
 * @returns {{}}
 */
function cparams_get_jpeg_xs_video_tx() {
    var obj = {};
    obj.video_select = "";
    obj.ch0_enable = "";
    obj.ch0_name = "";
    obj.ch0_format = "";
    obj.ch0_compression_rate = "";
    obj.ch0_ip_addr = "";
    obj.ch0_port = "";
    obj.ch1_enable = "";
    obj.ch1_name = "";
    obj.ch1_format = "";
    obj.ch1_compression_rate = "";
    obj.ch1_ip_addr = "";
    obj.ch1_port = "";

    var ret = cparam_sendRequest("/cgi-bin/get_jpeg-xs_video_tx");
    if (ret) {
        ret = cparam_getRetArray(ret);
        for (var i = 0; i < ret.length; i++) {
            if (ret[i].indexOf("video_select=") == 0) obj.video_select = ret[i].substring("video_select=".length);
            else if (ret[i].indexOf("ch0_enable=") == 0) obj.ch0_enable = ret[i].substring("ch0_enable=".length);
            else if (ret[i].indexOf("ch0_name=") == 0) obj.ch0_name = ret[i].substring("ch0_name=".length);
            else if (ret[i].indexOf("ch0_format=") == 0) obj.ch0_format = ret[i].substring("ch0_format=".length);
            else if (ret[i].indexOf("ch0_compression_rate=") == 0) obj.ch0_compression_rate = ret[i].substring("ch0_compression_rate=".length);
            else if (ret[i].indexOf("ch0_ip_addr=") == 0) obj.ch0_ip_addr = ret[i].substring("ch0_ip_addr=".length);
            else if (ret[i].indexOf("ch0_port=") == 0) obj.ch0_port = ret[i].substring("ch0_port=".length);
            else if (ret[i].indexOf("ch1_enable=") == 0) obj.ch1_enable = ret[i].substring("ch1_enable=".length);
            else if (ret[i].indexOf("ch1_name=") == 0) obj.ch1_name = ret[i].substring("ch1_name=".length);
            else if (ret[i].indexOf("ch1_format=") == 0) obj.ch1_format = ret[i].substring("ch1_format=".length);
            else if (ret[i].indexOf("ch1_compression_rate=") == 0) obj.ch1_compression_rate = ret[i].substring("ch1_compression_rate=".length);
            else if (ret[i].indexOf("ch1_ip_addr=") == 0) obj.ch1_ip_addr = ret[i].substring("ch1_ip_addr=".length);
            else if (ret[i].indexOf("ch1_port=") == 0) obj.ch1_port = ret[i].substring("ch1_port=".length);
        }

        delete ret;
    }

    return obj;
}

/**
 * send cgi commend : get_jpeg-xs_video_rx
 * @returns {{}}
 */
function cparam_get_jpeg_xs_video_rx() {
    var url = "/cgi-bin/get_jpeg-xs_video_rx";
    var obj = {};
    var ret = cparam_sendRequest(url);

    obj.ch0_enable = "";
    obj.ch0_name = "";
    obj.ch0_format = "";
    obj.ch0_multicast_addr = "";
    obj.ch0_source_addr = "";
    obj.ch0_port = "";

    if (ret) {
        ret = cparam_getRetArray(ret);
        for (var i = 0; i < ret.length; i++) {
            if (ret[i].indexOf("ch0_enable=") == 0) obj.ch0_enable = ret[i].substring("ch0_enable=".length);
            else if (ret[i].indexOf("ch0_name=") == 0) obj.ch0_name = ret[i].substring("ch0_name=".length);
            else if (ret[i].indexOf("ch0_format=") == 0) obj.ch0_format = ret[i].substring("ch0_format=".length);
            else if (ret[i].indexOf("ch0_multicast_addr=") == 0) obj.ch0_multicast_addr = ret[i].substring("ch0_multicast_addr=".length);
            else if (ret[i].indexOf("ch0_source_addr=") == 0) obj.ch0_source_addr = ret[i].substring("ch0_source_addr=".length);
            else if (ret[i].indexOf("ch0_port=") == 0) obj.ch0_port = ret[i].substring("ch0_port=".length);
        }

        delete ret;
    }
    return obj;
}

function cparam_getPresetPtzSyncMode() {
    return _cparam_awCmd_sendRequset('QSL:CE', 'OSL:CE:');
}
function cparam_setPresetPtzSyncMode(data) {
    return _cparam_awCmd_sendRequset('OSL:CE:' + data, 'OSL:CE:');
}

function cparam_getCspControlParam() {
    var url = "/cgi-bin/get_csp_control_param";
    var obj = {};
    var ret = cparam_sendRequest(url);

    obj.ip_adrs = "";
    obj.dst_port = "";
    obj.src_port = "";
    obj.cycletime = "";

    if (ret) {
        ret = cparam_getRetArray(ret);
        for (var i = 0; i < ret.length; i++) {
            if (ret[i].indexOf("ip_adrs=") == 0) obj.ip_adrs = ret[i].substring("ip_adrs=".length);
            else if (ret[i].indexOf("dst_port=") == 0) obj.dst_port = ret[i].substring("dst_port=".length);
            else if (ret[i].indexOf("src_port=") == 0) obj.src_port = ret[i].substring("src_port=".length);
            else if (ret[i].indexOf("cycletime=") == 0) obj.cycletime = ret[i].substring("cycletime=".length);
        }

        delete ret;
    }
    return obj;
}

function cparam_getCspControlMode() {
    var url = "/cgi-bin/get_csp_control_mode";
    var obj = {};
    var ret = cparam_sendRequest(url);

    obj.mode = "";

    if (ret) {
        ret = cparam_getRetArray(ret);
        for (var i = 0; i < ret.length; i++) {
            if (ret[i].indexOf("mode=") == 0) obj.mode = ret[i].substring("mode=".length);
        }

        delete ret;
    }
    return obj;
}

function cparam_setCspControlMode(datas) {
    $.ajax({
        type: "get",
        url: '/cgi-bin/csp_control_mode',
        data: datas,
        success: function (data) {
            setTimeout(function () {
                $("#dialog_setup").hide();
            }, 500);
        },
        error: function (jqXHR, textStatus, errorThrown) {
            setTimeout(function () {
                $("#dialog_setup").hide();
                return capi_DispError(modeRadioButtonGroup.getInputObject(), MSG_STATUS.mID_0115);
            }, 500);
        }
    });
}