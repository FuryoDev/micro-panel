/**
 * @fileOverview 画面制御の基本処理を管理するクラス
 *
 * @author Panasonic Corporation
 */

/**
 * 画面制御の基本処理を管理するクラスのインスタンス
 */
var displayBaseHeaderTab = DisplayBaseHeaderTab();

/**
 * HeaderTab制御クラス
 * @class HeaderTab HeaderTab制御クラス
 * @return {number} 　MODE_MAIN    MAINタブ選択状態定義
 * @return {number} 　MODE_SETTING Settingsタブ選択状態定義
 * @return {function} build 生成処理
 * @return {function} rebuild 再構築処理(選択状態の初期化)
 * @return {function} show 表示処理
 * @return {function} hide 非表示処理
 * @return {function} showModeTab SettingTabを選択状況に合わせて表示
 * @constructor
 */
function DisplayBaseHeaderTab() {
    /**
     * MAINタブオブジェクト(インデックス値)
     * @type number
     */
    const BTN_MAIN = 1;

    /**
     * SETTINGタブオブジェクト(インデックス値)
     * @type number
     */
    const BTN_SETTING = 2;

    /**
     * PICENLARGEタブオブジェクト(インデックス値)
     * @type number
     */
    const PICENLARGE = 3;

    /**
     * CHANGETOTOUCHタブオブジェクト(インデックス値)
     * @type number
     */
    const CHANGETOTOUCH = 4;
    /**
     * CHANGETOTOUCHタブオブジェクト(インデックス値)
     * @type number
     */
    const CHANGETOMOBILE = 5;
    /**
     * CHANGETOTOUCHタブオブジェクト(インデックス値)
     * @type number
     */
    var TRACKING = 6;
    /**
     * CHANGETOTOUCHタブオブジェクト(インデックス値)
     * @type number
     */
    const AUDIO_LEVEL = 7;
    /**
     * CHANGETOTOUCHタブオブジェクト(インデックス値)
     * @type number
     */
    const GAUGE = 8;

    /**
     * ボタンオブジェクト
     * @type ButtonCtrl[]
     */
    let btnObject = [];

    /**
     * 共通部オブジェクトの配列インデックス値show title(インデックス値)
     * @type number
     */
    const TXT_SHOW_TITLE = 1;
    /**
     * 共通部オブジェクトの配列インデックス値show title(インデックス値)
     * @type number
     */
    const TXT_PARAMETER_TRACKING = 2;
    const TXT_LEVEL_GAUGE = 3;
    // /**
    //  * 共通部オブジェクトの配列インデックス値show title(インデックス値)
    //  * @type number
    //  */
    // const TXT_AUDIO = 3;
    // /**
    //  * 共通部オブジェクトの配列インデックス値show title(インデックス値)
    //  * @type number
    //  */
    // const TXT_INPUT_TYPE = 4;
    // /**
    //  * 共通部オブジェクトの配列インデックス値show title(インデックス値)
    //  * @type number
    //  */
    // const TXT_VOLUME_LEVEL = 5;
    // /**
    //  * 共通部オブジェクトの配列インデックス値show title(インデックス値)
    //  * @type number
    //  */
    // const TXT_PLUGIN_POWER = 6;
    // /**
    //  * 共通部オブジェクトの配列インデックス値show title(インデックス値)
    //  * @type number
    //  */
    // const TXT_AUDIO_TRANSMISSION = 7;
    // /**
    //  * 共通部オブジェクトの配列インデックス値show title(インデックス値)
    //  * @type number
    //  */
    // const TXT_AUDIO_BIT_RATE = 8;


    /**
     * 共通部オブジェクトの配列インデックス値show title(インデックス値)
     * @type number
     */
     const TXT_AUDIO = 4;

      /**
      * 共通部オブジェクトの配列インデックス値show title(インデックス値)
      * @type number
      */
     const TXT_AUDIO_INPUT_1_SELECT = 5;

     /**
      * 共通部オブジェクトの配列インデックス値show title(インデックス値)
      * @type number
      */
     const TXT_MIC_GAIN_1 = 6
     /**
      * 共通部オブジェクトの配列インデックス値show title(インデックス値)
      * @type number
      */
     const TXT_LINE_LEVEL_1 = 7;
     /**
      * 共通部オブジェクトの配列インデックス値show title(インデックス値)
      * @type number
      */
     const TXT_AUDIO_INPUT_2_SELECT = 8;
     /**
      * 共通部オブジェクトの配列インデックス値show title(インデックス値)
      * @type number
      */
     const TXT_MIC_GAIN_2 = 9;
     /**
      * 共通部オブジェクトの配列インデックス値show title(インデックス値)
      * @type number
      */
     const TXT_LINE_LEVEL_2 = 10;


    /**
     * ボタンオブジェクト
     * @type txtObject[]
     */
    let txtObject = [];

    /**
     * 構築済みフラグ
     * @type boolean
     */
    let buildFlag = false;
    let audioTimerId;
    var gaugeInterval;

    /**
     * クラスインスタンス構築処理
     */
    function build() {
        if (buildFlag == false) {
            buildFlag = true;
            Platform.setIsTouchMode(false);

            // VIEW/MAIN画面共通部の構築
            var text = _basic_info.cam_title;
            var title = text;
            if (text.length > 14) {
                text = text.substr(0, 14) + "...";
            }
            document.title = title;
            txtObject[TXT_SHOW_TITLE] = TextCtrl("base_header", "txt_show_title", htmlEncodeJQ(text),null,null,title);
            //txtObject[TXT_PARAMETER_TRACKING] = TextCtrl("base_header", 'parameter_tracking', NPTZ_WORDING.wID_0484);

            // level gauge
            txtObject[TXT_LEVEL_GAUGE] = TextCtrl("base_header", "txt_level_gauge", getLevelGaugeRequestInlination());
            txtObject[TXT_LEVEL_GAUGE].show();
            // ボタンオブジェクト生成
            btnObject[BTN_MAIN] = ButtonCtrl('header_center', 'base_mode_view', NPTZ_WORDING.wID_0048, callbackLive);
            btnObject[BTN_SETTING] = ButtonCtrl('header_center', 'base_mode_main', NPTZ_WORDING.wID_0049, callbackSetUp);
            btnObject[PICENLARGE] = NewButtonCtrl('base_header', 'btn_Enlarge', callbackSettingEnlarge);
            btnObject[CHANGETOTOUCH] = ButtonCtrl('base_header', 'btn_changetotouch', "", callbackChangeToTouch);
            btnObject[CHANGETOMOBILE] = ButtonCtrl('base_header', 'btn_changetomobile', "", callbackChangeToMobile);

            //TRACKING
            btnObject[TRACKING] = ButtonCtrl("base_header", "btn_tracking", "", callbackTracking);
            //
            btnObject[AUDIO_LEVEL] = ButtonCtrl("base_header", "btn_audio_level", "", callbackAudioLevel);
            // GAUGE
            btnObject[GAUGE] = ButtonCtrl("base_header", "btn_gauge", "", callbackGauge);
            //text
            const a = cparam_get_inputType();
            // txtObject[TXT_AUDIO] = TextCtrl("audio_setting_status", "live_txt_audio", (cparam_get_audio() == 0 ?"Off":"On"));
            // txtObject[TXT_INPUT_TYPE] = TextCtrl("audio_setting_status", "live_txt_input_type", (cparam_get_inputType() == 0?"Mic":"Line"));
            // txtObject[TXT_VOLUME_LEVEL] = TextCtrl("audio_setting_status", "live_txt_volume_level", (cparam_get_volumeLevel(0)+"dB"));
            // txtObject[TXT_PLUGIN_POWER] = TextCtrl("audio_setting_status", "live_txt_plugin_power", (cparam_get_pluginPower() == 0?"Off":"On"));

            // //const objAudio = _cparam_cgi_get_audio();
            // txtObject[TXT_AUDIO_TRANSMISSION] = TextCtrl("audio_setting_status", "live_txt_audio_transmission",(cparams.audio_transmit == 0?"Off":"On"));
            // txtObject[TXT_AUDIO_BIT_RATE] = TextCtrl("audio_setting_status", "live_txt_audio_bit_rate", (cparams['new_bit']+"kbps"));

            const cparam_get_input1_select_value = cparam_get_input1_select();
            const cparam_get_input1_mac_gain_value = cparam_get_input1_mac_gain()
            const cparam_get_input1_line_level_value = cparam_get_input1_line_level()

            const cparam_get_input2_select_value = cparam_get_input2_select()
            const cparam_get_input2_mac_gain_value = cparam_get_input2_mac_gain()
            const cparam_get_input2_line_level_value = cparam_get_input2_line_level()

            txtObject[TXT_AUDIO] = TextCtrl("audio_setting_status_container_value", "child_audio_value", (cparam_get_audio() == 0 ?"Off":"On"));
            txtObject[TXT_AUDIO_INPUT_1_SELECT] = TextCtrl("audio_setting_status_container_value", "child_audio_input_1_value", (cparam_get_input1_select_value=="0"?"Line":cparam_get_input1_select_value=="1"?"Mic":cparam_get_input1_select_value=="2"?"MIC+48V":""));
            txtObject[TXT_MIC_GAIN_1] = TextCtrl("audio_setting_status_container_value", "child_mic_gain_1_value",(cparam_get_input1_mac_gain_value =="0" ? '60dB':'40dB'));
            txtObject[TXT_LINE_LEVEL_1] = TextCtrl("audio_setting_status_container_value", "child_line_level_1_value", (cparam_get_input1_line_level_value=="0"?'+4dB':cparam_get_input2_line_level_value=="1"?'0dB':'-20dB'));
            txtObject[TXT_AUDIO_INPUT_2_SELECT] = TextCtrl("audio_setting_status_container_value", "child_audio_input_2_value",(cparam_get_input2_select_value=="0"?"Line":cparam_get_input2_select_value=="1"?"Mic":cparam_get_input2_select_value=="2"?"MIC+48V":""));
            txtObject[TXT_MIC_GAIN_2] = TextCtrl("audio_setting_status_container_value", "child_mic_gain_2_value",(cparam_get_input2_mac_gain_value =="0" ? '60dB':'40dB'));
            txtObject[TXT_LINE_LEVEL_2] = TextCtrl("audio_setting_status_container_value", "child_line_level_2_value", (cparam_get_input2_line_level_value=="0"?'+4dB':cparam_get_input2_line_level_value=="1"?'0dB':'-20dB'));

            document.getElementsByTagName("body")[0].style.transform = "scale(" + 0.0001 + ")";

            // cameraControllerSetting領域の構築
            cameraControllerSetting.build();
            menubarCtrl.build();
            cameraControllerSetting.show();
            displayBaseHeaderTab.show();

            cameraControllerSetting.updateStatus(gPower);
            var powerSelect = document.getElementById("power");
            powerSelect.onchange = function () {
                var value = document.getElementById("power").value;
                if (value == "1") {
                    menubarCtrl.streamControler.DoSubmitPower(1);
                } else {
                    menubarCtrl.streamControler.DoSubmitPower(0);
                }
            };
            onLoadProcess();
            if(gPower == 1){
                displayBaseHeaderTab.settingButtonOff();
            }else{
                settingButtonDisabled();
                $(".txt_selectedScene").hide();
                $("#camera_ptz_ctrl").hide();
            }
            menubarCtrl.powerFlg();
            if(isMobile){
                btnObject[CHANGETOMOBILE].show();
                $(".parameter_tracking").addClass("parameter_tracking_mobile")
                $(".btn_tracking").addClass("btn_tracking_mobile")
            }else{
                btnObject[CHANGETOMOBILE].hide();
            }
            if(cparam_get_mode_ip() == 1){
                $("#trackingDataText").html(MSG_STATUS.mid_0089);
            }
            if(getLiveModeStatus() == 0){
                btnObject[TRACKING].displayOn();
                liveModeFlg = true;
                document.getElementById("mainViewHtml").contentWindow.liveModeFlg = true;
            }else{
                btnObject[TRACKING].displayOff();
                liveModeFlg = false;
                document.getElementById("mainViewHtml").contentWindow.liveModeFlg = false;
            }
            if(cparam_get_levelGauge()==1){ //todo
            // if(1==1){
                btnObject[GAUGE].displayOn();
                updateLevelGauge();
            }else{
                btnObject[GAUGE].displayDisabled();
                clearInterval(gaugeInterval);
                gaugeInterval = null;
                txtObject[TXT_LEVEL_GAUGE].set('');
            }
        }
    }
    function getLevelGaugeRequestInlination() {
        var ret,retArr, data1, data2, data3, data4, dataHex1, dataHex2, dataHex3, dataHex4, data1Txt, data2Txt, data3Txt, data4Txt, retToShowTxt;
        
        ret = cparams_get_level_gauge_request_clination();
        retArr = ret.split(':');
        dataHex1 = retArr[0];
        dataHex2 = retArr[1];
        dataHex3 = retArr[2];
        dataHex4 = retArr[3];
        // [dataHex1, dataHex2, dataHex3, dataHex4] = ret.split(':');
        
        data1 = ((parseInt(dataHex1, 16) - 0x80) / 10).toFixed(1);
        data2 = ((parseInt(dataHex2, 16) - 0x80) / 10).toFixed(1);
        data3 = ((parseInt(dataHex3, 16) - 0x80) / 10).toFixed(1);
        data4 = ((parseInt(dataHex4, 16) - 0x80) / 10).toFixed(1);
        data1Txt = (data1 < 0 ? 'L↓ ' : data1 > 0 ? 'L↑ +' : 'L') + data1.toString() + '°';
        data2Txt = '/' + (data2 <= 0 ? ' ' : ' +' ) + data2.toString() + '°' + (data2 < 0 ? ' R↓' : data2 > 0 ? ' R↑' : 'R') + '<br>';
        data3Txt = (data3 < 0 ? 'F↓ ' : data3 > 0 ? 'F↑ +' : 'F') + data3.toString() + '°';
        data4Txt = '/' + (data4 <= 0 ? ' ' : ' +') + data4.toString() + '°' + (data4 < 0 ? ' B↓' : data4 > 0 ? ' B↑' : 'B');
        retToShowTxt = data1Txt + data2Txt + data3Txt + data4Txt;
        return retToShowTxt;
    }
    function updateLevelGauge() {
        if(!gaugeInterval){
            gaugeInterval = setInterval(function () {
                txtObject[TXT_LEVEL_GAUGE].set(getLevelGaugeRequestInlination());
            }
            , 1000);
        }
    }
    function getAudioLevel(){
        if(!liveModeFlg){
            return;
        }
        const level = cparam_get_Audio_Level_meter().split(":");
        for(let i = 0;i<=9;i++){
            $("#audio_level_ch1_"+i).removeClass();
            $("#audio_level_ch2_"+i).removeClass();
        }
        //ch1
        if(level[0]==9){
            $("#audio_level_ch1_9").addClass("audio_level_gauge_red");
        }
        for(let i = 1;i<=level[0];i++){
            if(i==9){
                break;
            }
            $("#audio_level_ch1_"+i).addClass("audio_level_gauge_gray");
        }
        //ch2
        if(level[1]==9){
            $("#audio_level_ch2_9").addClass("audio_level_gauge_red");
        }
        for(let i = 1;i<=level[1];i++){
            if(i==9){
                break;
            }
            $("#audio_level_ch2_"+i).addClass("audio_level_gauge_gray");
        }
    }

    function callbackTracking(mouse){
        if (mouse == Button.MOUSE_DOWN) {
            var data = {};
            if (btnObject[TRACKING].getStatus() == Button.STATUS_OFF) { //Release
                btnObject[TRACKING].displayOn();
                data['mode'] = "0";
                setLiveMode(data);
                liveModeFlg = true;
                document.getElementById("mainViewHtml").contentWindow.liveModeFlg = true;
            }else if(btnObject[TRACKING].getStatus() == Button.STATUS_ON){
                btnObject[TRACKING].displayOff();
                data['mode'] = "1";
                setLiveMode(data);
                liveModeFlg = false;
                document.getElementById("mainViewHtml").contentWindow.liveModeFlg = false;
            }
        }
    }

    function setLiveMode(data){
        $.ajax({
            type: "get",
            url: '/cgi-bin/set_live_mode',
            data: data,
            success: function (data) {
            },
            error: function (jqXHR, textStatus, errorThrown) {
            }
        });
    }

    function getTitleName(){
        var text = htmlDecodeJQ(cparam_cgi_updateWebPageTitle());
        if (text.length > 14) {
            text = text.substr(0, 14) + "...";
        }
        txtObject[TXT_SHOW_TITLE].set(text);
    }


    /**
     * Enlarge button controller
     * @param mouse
     */
    function callbackSettingEnlarge(mouse) {
        if (mouse == Button.MOUSE_UP) {
        } else if (mouse == Button.MOUSE_DOWN) {

            if(!$("#preset_list_area").is(":hidden")){
                $("#tracking_controller").show();
                cparam_frmRightRequest(true);
                var giUid = menubarCtrl.menubar_GetStreamInfo().UID;
                window.frames["mainViewHtml"].giUid = giUid;
                if (capi_IsIE() && getStreamMode() != 'rtmp') {
                    window.frames["mainViewHtml"].InitThisPage();
                    window.frames["mainViewHtml"].document.getElementsByTagName("body")[0].style.transform = "scale(" + 0.001 + ")";
                    setTimeout(function(){
                        document.getElementById("mainViewHtml").contentWindow.mainview_ViewFull();
                    },500)
                }else{
                    mainViewRequestFullScreen();
                    window.frames["mainViewHtml"].InitThisPage();
                }


            }else{
                if (capi_IsIE() && getStreamMode() != 'rtmp') {
                    document.getElementById("mainViewHtml").contentWindow.mainview_ViewFull();
                } else {
                    mainViewRequestFullScreen();
                }
            }

        } else {
            // 処理なし
        }
    }

    function mainViewRequestFullScreen(){
        $("#tracking_controller").show();
        fullWindowFlg = true;
        var elem = document.getElementById("mainViewHtml");
        requestFullScreen(elem);
        $("#tracking_controller").css("left","0px");
        window.frames["mainViewHtml"].document.getElementById("WebVideo").style.width = window.screen.width;
        window.frames["mainViewHtml"].document.getElementById("WebVideo").style.height = window.screen.height;
        $("#WebVideo", window.frames['mainViewHtml'].document).css("margin-top", "-5px");
        window.frames["mainViewHtml"].stopCheckTally();
        window.frames["mainViewHtml"].hideTallyState();
    }

    function callbackChangeToTouch(mouse) {
        if (mouse == Button.MOUSE_DOWN) {

            toggleTouchMode();

            if (Platform.isTouchMode()) {
                cameraControllerSetting.openPtz();

                var left = $("#camera_controller_gui").offset().left/currentZoomValue;
                if(left<= 800){

                    if(isMobile){
                        $(".btn_changetotouch").addClass("btn_changetotouch_mobile");
                        $(".btn_changetomobile").addClass("btn_changetomobile_touch");
                        $(".btn_preset_list").addClass("btn_preset_list_touch");
                        $(".btn_tracking").removeClass("btn_tracking_mobile").addClass("btn_tracking_mobile_touch");
                        $("#power").css("width","120px");
                    }else{
                        $(".btn_changetotouch").addClass("btn_changetotouch_mobile")
                        $(".btn_changetomobile").addClass("btn_changetomobile_touch");
                        $(".btn_preset_list").addClass("btn_preset_list_pc_touch");
                        $(".btn_tracking").removeClass("btn_tracking_mobile").addClass("btn_tracking_mobile_touch");
                        $("#power").css("width","120px");
                        $(".btn_changetotouch_mobile").css("right","90px");
                    }
                }

            } else {
                cameraControllerSetting.narrowArea();
                $(".btn_changetotouch").removeClass("btn_changetotouch_mobile");
                $(".btn_changetomobile").removeClass("btn_changetomobile_touch");
                $(".btn_preset_list").removeClass("btn_preset_list_touch").removeClass("btn_preset_list_pc_touch");;
                $(".btn_tracking").removeClass("btn_tracking_mobile_touch").addClass("btn_tracking_mobile");
                $(".btn_changetotouch").css("right","");
                //$(".btn_changetotouch").css("right","");
                //$("#power").css("width","158px");
            }

            if(Platform.isSetupMode() && $(".setup_menu_UHDCrop_btn").hasClass('on')) {
                settingIoaUhd.changeMode();
            }

            if(Platform.isSetupMode() && $(".setup_menu_presetPosition_btn").hasClass('on')){
                setupIoaPresetPosition.changeCameraControllerToPreset();
            }
        }
    }

    function callbackChangeToMobile(mouse){
        if (mouse == Button.MOUSE_DOWN) {
            sessionStorage.isAdminPage = true ;
            window.location.href="/mobile/live/index.html";
        }
    }
    function callbackAudioLevel(mouse){
        if (mouse == Button.MOUSE_DOWN) {
            if (btnObject[AUDIO_LEVEL].getStatus() == Button.STATUS_OFF) {
                btnObject[AUDIO_LEVEL].displayOn();
                $("#audio_level_gui").show();
                audioTimerId = setInterval(getAudioLevel, 500);
            }else if(btnObject[AUDIO_LEVEL].getStatus() == Button.STATUS_ON){
                $("#audio_level_gui").hide();
                btnObject[AUDIO_LEVEL].displayOff();
                clearInterval(audioTimerId);
            }
        }
    }
    function callbackGauge(mouse){
        if (mouse == Button.MOUSE_DOWN) {
            if (btnObject[GAUGE].getStatus() == Button.STATUS_OFF) {
                btnObject[GAUGE].displayOn();
                txtObject[TXT_LEVEL_GAUGE].show();
                updateLevelGauge();
            }else if(btnObject[GAUGE].getStatus() == Button.STATUS_ON){
                clearInterval(gaugeInterval);
                gaugeInterval = null;
                btnObject[GAUGE].displayOff();
                txtObject[TXT_LEVEL_GAUGE].hide();
            }
        }
    }

    /**
     * FullScreen button controller
     * @param element
     */
    function requestFullScreen(element) {
        var requestMethod = element.requestFullScreen || element.webkitRequestFullScreen || element.mozRequestFullScreen || element.msRequestFullscreen;
        if (requestMethod) {
            requestMethod.call(element);
        }
    }

    /**
     * return fullWindowFlg
     * @returns {boolean}
     */
    function returnFullWindowFlg() {
        return fullWindowFlg;
    }

    /**
     * update fullWindowFlg
     */
    function changeFullWindowFlg() {
        fullWindowFlg = false;
    }

    /**
     * update setting button style to off
     */
    function settingButtonOff() {
        btnObject[BTN_SETTING].displayOff();
    }

    /**
     * update setting button style to disable
     */
    function settingButtonDisabled() {
        btnObject[BTN_MAIN].displayDisabled();
        btnObject[BTN_SETTING].displayDisabled();
        btnObject[CHANGETOTOUCH].displayDisabled();
        btnObject[CHANGETOMOBILE].displayDisabled();
        btnObject[TRACKING].displayDisabled();
        btnObject[AUDIO_LEVEL].displayDisabled();
        if(!isMobile){
            btnObject[PICENLARGE].displayDisabled();
        }
    }

    /**
     * update setting button style to disable
     */
    function settingButtonDisplayOff() {
        btnObject[BTN_MAIN].displayOn();
        btnObject[BTN_SETTING].displayOff();
        btnObject[CHANGETOTOUCH].displayOff();
        btnObject[CHANGETOMOBILE].displayOff();
        btnObject[TRACKING].displayOff();
        btnObject[AUDIO_LEVEL].displayOff();
        if(!isMobile){
            btnObject[PICENLARGE].displayOff();
        }
        if(getLiveModeStatus() == 0){
            btnObject[TRACKING].displayOn();
            liveModeFlg = true;
            document.getElementById("mainViewHtml").contentWindow.liveModeFlg = true;
        }else{
            btnObject[TRACKING].displayOff();
            liveModeFlg = false;
            document.getElementById("mainViewHtml").contentWindow.liveModeFlg = false;
        }

    }

    /**
     * VIEW表示更新処理
     */
    function showView() {
        //ボタンの制御
        btnObject[BTN_MAIN].displayOff();
        btnObject[BTN_SETTING].displayOn();
        //divの制御
        $('#base_header').show();
        $('#base_header_common').show();
        $('#view_gui').show();
        $('#camera_count').show();
        $('#main_gui').hide();
        $('#setting_gui').hide();
        $('#base_main_controller').hide();
        $("#setting_camera_ptz_title").hide();

        $('#camera_controller_gui').hide();
        $('#camera_controller_gui_open').hide();
    }

    /**
     * MAIN表示更新処理
     */
    function showMain() {
        //ボタンの制御
        if(gPower == 0){
            btnObject[BTN_MAIN].displayDisabled();
            btnObject[BTN_SETTING].displayDisabled();
            if(!isMobile){
                btnObject[PICENLARGE].displayDisabled();
            }
            btnObject[CHANGETOTOUCH].displayDisabled();
            btnObject[CHANGETOMOBILE].displayDisabled();
            btnObject[TRACKING].displayDisabled();
            btnObject[AUDIO_LEVEL].displayDisabled();
        }else{
            btnObject[BTN_MAIN].displayOn();
            btnObject[BTN_SETTING].displayOff();
            if(!isMobile){
                btnObject[PICENLARGE].displayOff();
            }
            btnObject[CHANGETOTOUCH].displayOff();
            btnObject[CHANGETOMOBILE].displayOff();
            btnObject[TRACKING].displayOff();
            btnObject[AUDIO_LEVEL].displayOff();
        }

        //divの制御
        $('#base_header').show();
        $('#base_header_common').show();
        $('#view_gui').show();
        $('#main_gui').show();
        $('#base_main_controller').show();
        $('#base_view_controller').hide();
        $('#camera_count').hide();
        $('#setting_gui').hide();
        $("#setting_camera_ptz_title").hide();
    }

    /**
     * todo
     * @param type
     */
    function setting_changeMouseStyle(type) {
        if (type == "add") {
            $("#pad_center").addClass("changeMouseStyle");
            document.getElementById("control").src = "./css/parts/btn_cameraController_slider_none_normal.png";
        } else if (type == "remove") {
            $("#pad_center").removeClass("changeMouseStyle");
            document.getElementById("control").src = "./css/parts/cc_header_btn_fullscreen_normal.png";
        }
    }

    /**
     * HeaderTab:SetUp 押下時の画面制御
     * @param {number} mouse マウス・ボタン操作状況
     */
    function callbackSetUp(mouse) {
        if (mouse == Button.MOUSE_UP) {
        } else if (mouse == Button.MOUSE_DOWN) {
            Platform.setIsSetupMode(true);
            window.location.href = '/admin/index.html';
        } else {
            // 処理なし
        }
    }

    /**
     * HeaderTab:Live 押下時の画面制御
     * @param {number} mouse マウス・ボタン操作状況
     */
    function callbackLive(mouse) {
        if (mouse == Button.MOUSE_DOWN) {
            $("#camera_live_line").show();
            setTimeout("location.reload(true)", 1000);
            Platform.setIsTouchMode(false);
            Platform.setIsSetupMode(false);
        } else {
            // 処理なし
        }
    }
    return {
        build: build,
        rebuild: function () {
            showView();
        },
        show: function () {
            for (var btn in btnObject) {
                btnObject[btn].show();
            }
            for (var txt in txtObject) {
                txtObject[txt].show();
            }
            if(isMobile){
                btnObject[PICENLARGE].hide();
            }
            showMain();
        },
        hide: function () {
        },
        settingButtonOff: settingButtonOff,
        settingButtonDisabled: settingButtonDisabled,
        settingButtonDisplayOff: settingButtonDisplayOff,
        returnFullWindowFlg: returnFullWindowFlg,
        changeFullWindowFlg: changeFullWindowFlg,
        mainViewRequestFullScreen:mainViewRequestFullScreen,
        callbackChangeToTouch:function(){
            if (Platform.isTouchMode()) {
                Platform.setIsTouchMode(false);
            }else{
                Platform.setIsTouchMode(true);
            }
            callbackChangeToTouch(1)
        }

    };
}