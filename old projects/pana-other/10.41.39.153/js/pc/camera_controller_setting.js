/**
 * @fileOverview Camera Controllerの機能を定義
 *
 * @author Panasonic Corporation
 */

/**
 *　PTZ設定クラスのインスタンス
 * @type cameraControllerSetting
 */
var cameraControllerSetting = CameraControllerSetting();
var ImageControlButton = ImageControlButton();

let ptzAdjustCtrlFlag = true;
let ptzPresetCtrlFlag = true;
let ptzAreaCtrlFlag = true;
// value-- 1:live ,2;setUp UHD crop, 3:Preset position
let changeControlPtzStyleFlag = 1;
// Judging if we close the ptz_circle or not.
let ptzCircleCloseFlag = false;
let silderMouseDownFlag = false;
let zoomSilderClickFlag = false;
let silderMouseUpOverSleepTime = 0; // to be 1
let gCheckPresetImageTimerID = null;
let pcOperationFlag = false;
let controlScroll = null;
let settingScroll = null;


/**
 * カメラ詳細領域(PTZ Ctrlタブ)制御クラス
 * @class カメラ詳細領域(PTZ Ctrlタブ)制御クラス
 * @return {number} ZOOM_NONE ズーム停止
 * @return {number} ZOOM_W 縮小表示
 * @return {number} ZOOM_T 拡大表示
 * @return {function} build 生成処理
 * @return {function} show  表示処理
 * @return {function} hide　非表示処理
 * @return {function} updateStatus カメラ状態更新処理
 * @return {number} getSliderZoom Zoomスライダ現在位置取得処理
 * @return {function} setSliderZoomPosition Zoomスライダ制御位置設定処理
 * @return {function} setSliderZoomValue Zoomスライダ現在値設定処理
 * @return {number} getSliderSpeed Speedスライダ現在位置取得処理
 * @return {function} setSliderSpeedPosition Speedスライダ制御位置設定処理
 * @return {function} getFocus Focusスライダ取得処理
 * @return {number} getSliderFocus Focusスライダ現在位置取得処理
 * @return {function} setSliderFocusPosition Focusスライダ制御位置設定処理
 * @return {function} getIris Irisスライダ取得処理
 * @return {number} getSliderIris Irisスライダ現在位置取得処理
 * @return {function} setSliderIrisPosition Irisスライダ制御位置設定処理
 * @return {function} getCameraId カメラ選択id取得処理
 * @constructor
 */
function CameraControllerSetting() {
    /**
     * Pan・Tilt処理制御クラスのインスタンス
     * @type PtCtrlButton
     */
    const ptCtrlButton = PtCtrlButton();

    /**
     * Zoom・Speed・Focusボタン制御クラスのインスタンス
     * @type ZoomSpeedCtrlButton
     */
    const zoomSpeedFocusCtrlButton = ZoomSpeedFocusCtrlButton();

    /**
     * Image Adjust処理制御クラスのインスタンス
     * @type ImageControlButton
     */
    const imageControlButton = ImageControlButton();

    /**
     * Preset処理制御クラスのインスタンス
     * @type PresetSetting
     */
    const presetSetting = PresetSetting();

    /**
     * Zoomスライダ制御クラスのインスタンス
     * @type Slider
     */
    const sliderZoom = Slider();

    /**
     * Speedスライダ制御クラスのインスタンス
     * @type Slider
     */
    const sliderSpeed = Slider();

    /**
     * Focusスライダ制御クラスのインスタンス
     * @type Slider
     */
    const sliderFocus = Slider();

    /**
     * Irisスライダ制御クラスのインスタンス
     * @type {Slider}
     */
    const sliderIris = Slider();

    /**
     * 構築済みフラグ
     * @type boolean
     */
    let buildFlag = false;

    /**
     * 現在選択中のカメラID
     * @type number
     */
    let cameraID = null;

    /**
     * 現在選択中のカメラIP
     * @type string
     */
    let ipAddress = null;


    /**
     * 現在選択中のカメラID
     * @type number
     */
    let operateCameraID = null;

    /**
     * btnObjectCommon
     * @type object
     */
    let btnObjectCommon = [];

    /**
     * open PTZ
     * @type number
     */
    const BTN_ENLARGE_PTZ = 0;

    /**
     * open PRESET
     * @type number
     */
    const BTN_OPEN_PRESET = 1;

    /**
     * open IMAGE_ADJUST
     * @type number
     */
    const BTN_OPEN_IMAGE_ADJUST = 2;

    /**
     * close window
     * @type number
     */
    const BTN_NARROW_AREA = 3;

    /**
     * get PTZ
     * @type number
     */
    const BTN_GET_PTZ = 4;

    /**
     * get PRESET
     * @type number
     */
    const BTN_GET_PRESET = 5;

    /**
     * get IMAGE_ADJUST
     * @type number
     */
    const BTN_GET_IMAGE_ADJUST = 6;

    /**
     * control ptz area
     * @type number
     */
    const BTN_PTZ_AREA_CTRL = 7;

    /**
     * control preset area
     * @type number
     */
    const BTN_PTZ_PRESET_CTRL = 8;

    /**
     * control adjust area
     * @type number
     */
    const BTN_ADJUST_AREA_CTRL = 9;

    /**
     * button PRESET
     * @type number
     */
    const BTN_NM_PRESET = 10;

    /**
     * button PTLS
     * @type number
     */
    const BTN_NM_PTLS = 11;

    /**
     * button SETTING
     * @type number
     */
    const BTN_NM_SETTING = 12;

    /**
     * button A_IRIS_WIN
     * @type number
     */
    const BTN_A_IRIS_WIN = 13;

    /**
     * AUTO
     * @type AUTO
     */
    const AUTO = 1;

    /**
     * MANUAL
     * @type MANUAL
     */
    const MANUAL = 0;

    let statusFlag = 1;

    let gbAudioState = 1;

    let index = 0;
    /**
     * open small window : PTZ
     * @param mouse
     */
    function callbackOpenPtz(mouse) {
        if (mouse == Button.MOUSE_DOWN) {
            touchWindowFlg = 1;
            Platform.setIsTouchMode(true);
            callbackOpenPreset(1);
            setTimeout(function () {
                openPtz();
                isChangeHeight();
            }, 100);
        }
    }

    function openPtz(){
        zoomSpeedFocusCtrlButton.showButtonByCtrl();
        $("#camera_preset_title").hide();
        $("#camera_controller_gui_preset_main").hide();
        $("#camera_controller_gui_adjust_main").hide();
        $("#camera_controller_gui_ptz_main").show();

        $("#camera_control_line").hide();
        $("#camera_control_line_2").hide();
        $("#camera_control_line_3").hide();
        $("#camera_control_line_4").hide();
        $("#camera_ptz_d_zoom_label").hide();
        $("#camera_ptz_d_ext_label").hide();
        $("#camera_ptz_touch_label").hide();
        $(".txt_selectedScene").hide();
        $(".btn_ptz_area_ctrl").hide();

        $("#camera_controller_gui_open_btn").show();
        $("#camera_controller_gui_open_btn2").show();

        $("#camera_controller_gui_open_preset").hide();

        btnObjectCommon[BTN_GET_PTZ].displayOn();
        btnObjectCommon[BTN_GET_PRESET].displayOff();
        btnObjectCommon[BTN_GET_IMAGE_ADJUST].displayOff();

        doOpenPtzWindow();

        //let it down control
        $(".btn_ptz_area_ctrl").removeClass("btn_ptz_area_ctrl_down");
        $("#camera_controller_gui_preset_main").removeClass("camera_control_main_down");
        $("#camera_controller_gui_adjust_main").removeClass("camera_control_main_down");
        $("#camera_control_line_2").removeClass("camera_control_line_2_down");
        $("#camera_control_line_3").removeClass("camera_control_line_3_down");

        //let it down control
        $(".camera_control_adjust_down_area").removeClass("camera_control_adjust_down");
        $("#base").css("visibility","");
        $('#clienttable').css("top","190px");
        $('#clienttable').css("left","30px");

        if (Platform.isTouchMode()) {
            $(".camera_controller_gui_ptz_main_bottom_line").hide();
            document.getElementById("camera_controller_gui_ptz_main").style.borderBottom ="0px solid #000000";
        }
    }
    let buildControlScrollSuccessFlg = true;
    function callbackOpenPtz_ppls(mouse) {
        if (mouse == Button.MOUSE_DOWN) {
            if(controlScroll!=null ) {
                controlScroll.destroy();
                controlScroll = null;
            }
             if(settingScroll!=null){
                settingScroll.destroy();
                settingScroll = null;
            }
            $("#setup_preset_form_inner_scroll").css("z-index","-1")
            $("#div_pan_lens_control_scroll").css("z-index","9999");
            $("#camera_controller_gui_preset_main").hide();
            $("#camera_controller_gui_adjust_main").show();
            $("#camera_controller_gui_ptz_main").show();
            $("#camera_ptz_line").css({"left":"59px","top":"365px","height":"1px","width":"1px"})
            $("#camera_control_line").hide();
            $("#camera_control_line_2").hide();
            $("#camera_control_line_3").hide();
            $("#camera_control_line_4").hide();
            $("#camera_ptz_d_zoom_label").hide();
            $("#camera_ptz_d_ext_label").hide();
            $("#camera_ptz_touch_label").hide();

            $("#setup_preset_form_inner_limit").hide();
            $("#setup_preset_setting").hide();
            $(".stream_rtmp").hide();
            $(".ptz_btn_stream_stop").hide();
            $(".btn_cup").hide();
            $(".btn_stream_stop").hide();
            $("#camera_adjust_title").hide();
            $("#image_adjust").hide();
            $("#camera_controller_gui_adjust_iris").show();
            $("#camera_controller_gui_adjust_gain").show();
            $("#camera_controller_gui_ptz_focus").show();
            $("#camera_controller_gui_ptz_zoom").show();

            $(".setup_preset_zoom_pos_touch_label").show();
            $(".setup_preset_zoom_pos_touchOn_radio").show();
            $(".setup_preset_zoom_pos_touchOff_radio").show();
            $(".setup_preset_zoom_pos_touchOn_label").show();
            $(".setup_preset_zoom_pos_touchOff_label").show();
            $(".camera_ptz_line_6").show();
            $("#div_pan_lens_control").show();

            $(".setup_preset_focus_adj_touch_label").show();
            $(".setup_preset_focus_adj_touchOn_radio").show();
            $(".setup_preset_focus_adj_touchOff_radio").show();
            $(".setup_preset_focus_adj_touchOn_label").show();
            $(".setup_preset_focus_adj_touchOff_label").show();
            $(".camera_ptz_line_5").show();
            $(".camera_ptz_line_4").show();
            $(".btn_ptz_area_ctrl").hide();

            $("#camera_controller_gui_open_btn").hide();
            $("#camera_controller_gui_open_btn2").hide();

            $("#camera_controller_gui_open_preset").hide();

            btnObjectCommon[BTN_NM_PRESET].displayOff();
            btnObjectCommon[BTN_NM_PTLS].displayOn();
            btnObjectCommon[BTN_NM_SETTING].displayOff();
            $(".btn_a_iris_win ").hide();
            doOpenPtzWindow_ppls();

            //let it down control
            $(".btn_ptz_area_ctrl").removeClass("btn_ptz_area_ctrl_down");
            $("#camera_controller_gui_preset_main").removeClass("camera_control_main_down");
            $("#camera_controller_gui_adjust_main").removeClass("camera_control_main_down");
            $("#camera_control_line_2").removeClass("camera_control_line_2_down");
            $("#camera_control_line_3").removeClass("camera_control_line_3_down");

            //let it down control
            $(".camera_control_adjust_down_area").removeClass("camera_control_adjust_down");
            let camera_controller_setting_Css = document.getElementById("camera_controller_setting_cssId");
            camera_controller_setting_Css.href = "/css/pc/camera_controller_setting_touch.css";
            if(isPageFlg == "admin"){
                $("#window_ptz_ctrl2").css({"left":"513px","top":"56px"})
            }
            if(buildControlScrollSuccessFlg){
                buildControlScrollSuccessFlg = false;
                setTimeout(function(){
                    controlScroll = new IScroll('#div_pan_lens_control', {
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
                    buildControlScrollSuccessFlg = true;
                },100)
            }
        }
    }


    /**
     * open the top window : PTZ
     */
    function doOpenPtzWindow() {
        ptCtrlButton.changePtzElementToWindow();
        zoomSpeedFocusCtrlButton.changePtzElementToWindow();
        // title
        $(".camera_ptz_zoom").removeClass("camera_ptz_zoom").addClass("window_ptz_zoom");
        $(".camera_ptz_speed").removeClass("camera_ptz_speed").addClass("window_ptz_speed");
        $(".camera_ptz_focus").removeClass("camera_ptz_focus").addClass("window_ptz_focus");
        $("#camera_ptz_ctrl").hide();
        $("#window_ptz_ctrl").show();
        // slider
        sliderSpeed.changeSliderStyle("speed_slider_wrap", "speed_slider_handle", "speed_slider_win_wrap", "speed_slider_win_handle");
        sliderZoom.changeSliderStyle("zoom_slider_wrap", "zoom_slider_handle", "zoom_slider_win_wrap", "zoom_slider_win_handle");
        sliderFocus.changeSliderStyle("focus_slider_wrap", "focus_slider_handle", "focus_slider_win_wrap", "focus_slider_win_handle");

        settingIoaUhd.getSliderCropSpeed().changeSliderStyle("cropSpeed_slider_wrap", "cropSpeed_slider_handle","cropSpeed_slider_win_wrap", "cropSpeed_slider_win_handle");
        settingIoaUhd.getSliderCropZoom().changeSliderStyle("cropZoom_slider_wrap", "cropZoom_slider_handle","cropZoom_slider_win_wrap", "cropZoom_slider_win_handle");
        $(".camera_ptz_line").removeClass("camera_ptz_line").addClass("ptz_window_middle_line");
        $(".camera_ptz_line_2").removeClass("camera_ptz_line_2").addClass("ptz_window_bottom_line");
        $(".btn_stream_stop").removeClass("btn_stream_stop").addClass("ptz_btn_stream_stop");
        $("#camera_ptz_line_3").hide();
        $("#camera_ptz_title").hide();
        btnObjectCommon[BTN_ENLARGE_PTZ].hide();
    }

    function doOpenPtzWindow_ppls() {
        ptCtrlButton.changePtzElementToWindow();
        zoomSpeedFocusCtrlButton.changePtzElementToWindow();
        // title
        $(".camera_ptz_zoom").removeClass("camera_ptz_zoom").addClass("window_ptz_zoom");
        $(".camera_ptz_speed").removeClass("camera_ptz_speed").addClass("window_ptz_speed");
        $(".camera_ptz_focus").removeClass("camera_ptz_focus").addClass("window_ptz_focus");
        $("#camera_ptz_ctrl").hide();
        $("#window_ptz_ctrl").show();
        // slider
        sliderSpeed.changeSliderStyle("speed_slider_wrap", "speed_slider_handle", "speed_slider_win_wrap", "speed_slider_win_handle");
        sliderZoom.changeSliderStyle("zoom_slider_wrap", "zoom_slider_handle", "zoom_slider_win_wrap", "zoom_slider_win_handle");
        sliderFocus.changeSliderStyle("focus_slider_wrap", "focus_slider_handle", "focus_slider_win_wrap", "focus_slider_win_handle");

        settingIoaUhd.getSliderCropSpeed().changeSliderStyle("cropSpeed_slider_wrap", "cropSpeed_slider_handle","cropSpeed_slider_win_wrap", "cropSpeed_slider_win_handle");
        settingIoaUhd.getSliderCropZoom().changeSliderStyle("cropZoom_slider_wrap", "cropZoom_slider_handle","cropZoom_slider_win_wrap", "cropZoom_slider_win_handle");
        $(".camera_ptz_line").removeClass("camera_ptz_line").addClass("ptz_window_middle_line");
        $(".camera_ptz_line_2").removeClass("camera_ptz_line_2").addClass("ptz_window_bottom_line");
        $(".btn_stream_stop").removeClass("btn_stream_stop").addClass("ptz_btn_stream_stop");
        $("#camera_ptz_line_3").hide();
        btnObjectCommon[BTN_ENLARGE_PTZ].hide();

        imageControlButton.changeImageAdjustElementToWindow();
        // title
        $(".camera_adjust_iris").removeClass("camera_adjust_iris").addClass("window_adjust_iris");
        $(".camera_adjust_gain").removeClass("camera_adjust_gain").addClass("window_adjust_gain");
        $(".camera_adjust_wb").removeClass("camera_adjust_wb").addClass("window_adjust_wb");
        $(".camera_adjust_shutter").removeClass("camera_adjust_shutter").addClass("window_adjust_shutter");
        $(".camera_adjust_nd").removeClass("camera_adjust_nd").addClass("window_adjust_nd");
        $(".camera_adjust_line").removeClass("camera_adjust_line").addClass("adjust_window_line1");
        $(".camera_adjust_line_2").removeClass("camera_adjust_line_2").addClass("adjust_window_line2");
        $(".camera_adjust_line_3").removeClass("camera_adjust_line_3").addClass("adjust_window_line3");
        $(".camera_adjust_line_4").removeClass("camera_adjust_line_4").addClass("adjust_window_line4");
        $(".camera_adjust_line_6").removeClass("camera_adjust_line_6").addClass("adjust_window_line6");
        $("#camera_adjust_title").hide();
        btnObjectCommon[BTN_OPEN_IMAGE_ADJUST].hide();
        $("#id_Mute2").hide();
        $("#id_Mute3").show();
        $("#scene").show();
        sliderIris.changeSliderStyle("iris_slider_wrap", "iris_slider_handle", "iris_slider_win_wrap", "iris_slider_win_handle");
    }
    
    /**
     * open small window : preset
     * @param mouse
     */
    function callbackOpenPreset(mouse) {
        if (mouse == Button.MOUSE_DOWN) {
            openWindowsPreset();
        }
    }

    function openWindowsPreset(){
        presetSetting.showButtonByCtrl();
        $(".camera_controller_gui_preset_main_bottom_line").hide();
        $("#preset_set_label").hide();
        $(".btn_preset_1").hide();
        $(".btn_preset_2").hide();
        $(".btn_preset_3").hide();
        $(".btn_preset_4").hide();
        $(".btn_preset_5").hide();
        $(".btn_preset_6").hide();
        $(".btn_preset_7").hide();
        $(".btn_preset_8").hide();
        $(".btn_preset_9").hide();
        $(".btn_preset_10").hide();
        $(".btn_preset_11").hide();
        $(".btn_preset_12").hide();
        $("#camera_controller_gui_preset_main").hide();
        $("#camera_controller_gui_adjust_main").hide();
        $("#camera_controller_gui_ptz_main").hide();

        $("#camera_control_line").hide();
        $("#camera_control_line_2").hide();
        $("#camera_control_line_3").hide();
        $("#camera_control_line_4").hide();
        $("#camera_ptz_d_zoom_label").hide();
        $("#camera_ptz_d_ext_label").hide();
        $("#camera_ptz_touch_label").hide();

        $("#camera_controller_gui_open_btn").show();
        $("#camera_controller_gui_open_btn2").show();
        $("#camera_controller_gui_open_preset").show();
        $("#camera_controller_gui_open_title").text(NPTZ_WORDING.wID_0041);
        btnObjectCommon[BTN_GET_PTZ].displayOff();
        btnObjectCommon[BTN_GET_PRESET].displayOn();
        btnObjectCommon[BTN_GET_IMAGE_ADJUST].displayOff();

        //let it down control
        $(".camera_control_adjust_down_area").removeClass("camera_control_adjust_down");

        $(".stream_rtmp").show();
        $(".btn_stream_stop").show();
        $(".ptz_btn_stream_stop").show();
        Platform.setIsTouchMode(false);
        toggleTouchMode();

        $("#camera_controller_gui_preset_main").show();
        $(".btn_ptz_preset_ctrl").hide();
        $(".btn_enlarge_preset").hide();
        $("#camera_preset_title").hide();
    }

    /**
     * open small window : preset
     * @param mouse
     */
    function callbackOpenPreset_ppls(mouse) {
        if (mouse == Button.MOUSE_DOWN) {
            if(controlScroll!=null ) {
                controlScroll.destroy();
                controlScroll = null;
            }
            if(settingScroll!=null){
                settingScroll.destroy();
                settingScroll = null;
            }
            $("#camera_preset_title").text(NPTZ_WORDING.wID_0327);
            $("#camera_controller_gui_preset_main").show();
            $("#camera_controller_gui_adjust_main").hide();
            $("#camera_controller_gui_ptz_main").hide();

            $("#camera_control_line").hide();
            $("#camera_control_line_2").hide();
            $("#camera_control_line_3").hide();
            $("#camera_control_line_4").hide();
            $("#camera_ptz_d_zoom_label").hide();
            $("#camera_ptz_d_ext_label").hide();
            $("#camera_ptz_touch_label").hide();
            $("#setup_preset_form_inner_limit").hide();

            $("#setup_preset_setting").hide();
            $(".stream_rtmp").hide();
            $(".ptz_btn_stream_stop").hide();
            $(".btn_cup").hide();
            $(".btn_stream_stop").hide();
            $("#camera_controller_gui_adjust_iris").hide();
            $("#camera_controller_gui_adjust_gain").hide();

            $("#camera_controller_gui_open_btn").hide();
            $("#camera_controller_gui_open_btn2").hide();
            $("#camera_controller_gui_open_preset").hide();
            $("#camera_controller_gui_open_title").text(NPTZ_WORDING.wID_0041);
            btnObjectCommon[BTN_NM_PRESET].displayOn();
            btnObjectCommon[BTN_NM_PTLS].displayOff();
            btnObjectCommon[BTN_NM_SETTING].displayOff();
            $("#div_pan_lens_control_scroll").css("z-index","-1");
            $("#setup_preset_form_inner_scroll").css("z-index","-1");
            //let it down control
            $(".camera_control_adjust_down_area").removeClass("camera_control_adjust_down");

            let camera_controller_setting_Css = document.getElementById("camera_controller_setting_cssId");
            camera_controller_setting_Css.href = "/css/pc/camera_controller_setting_touch.css";
        }
    }

    /**
     * open small window : image adjust
     * @param mouse
     */
    function callbackOpenImageAdjust(mouse) {
        if (mouse == Button.MOUSE_DOWN) {
            Platform.setIsTouchMode(true);

            $("#camera_controller_gui_preset_main").hide();
            $("#camera_controller_gui_adjust_main").show();
            $("#camera_controller_gui_ptz_main").hide();
            $("#camera_control_line").hide();
            $("#camera_control_line_2").hide();
            $("#camera_control_line_3").hide();
            $("#camera_control_line_4").show();

            $(".btn_adjust_area_ctrl").hide();
            $("#camera_ptz_d_zoom_label").hide();
            $("#camera_ptz_d_ext_label").hide();
            $("#camera_ptz_touch_label").hide();

            $("#disable ptz_btn_stream_stop").hide();

            $("#setup_preset_zoom_pos_label").show();
            $("#camera_controller_gui_open_btn").show();
            $("#camera_controller_gui_open_btn2").show();
            $("#camera_controller_gui_open_preset").hide();
            btnObjectCommon[BTN_GET_PTZ].displayOff();
            btnObjectCommon[BTN_GET_PRESET].displayOff();
            btnObjectCommon[BTN_GET_IMAGE_ADJUST].displayOn();

            $(".stream_rtmp").show();
            $(".btn_stream_stop").show();
            $(".ptz_btn_stream_stop").show();

            doOpenImageAdjustWindow();
            zoomSpeedFocusCtrlButton.btnAIrisWinShow();
            cameraControllerSetting.initAIrisWinBtnStatus();

            //let it down control
            $(".camera_control_adjust_down_area").removeClass("camera_control_adjust_down");
            $("#camera_controller_gui_adjust_gain").addClass("camera_controller_gui_live_touch_adjust_gain");

            Platform.setIsTouchMode(false);
            toggleTouchMode();
        }
    }

    /**
     * open small window : image adjust
     * @param mouse
     */
    let buildSettingScrollSuccessFlg = true;
    function callbackOpenImageAdjust_ppls(mouse) {
        if (mouse == Button.MOUSE_DOWN) {
            if(controlScroll!=null){
                controlScroll.destroy();
                controlScroll = null;
            }
            if(settingScroll!=null){
                settingScroll.destroy();
                settingScroll = null;
            }
            $("#div_pan_lens_control_scroll").css("z-index","-1");
            $("#setup_preset_form_inner_scroll").css("z-index","9999")
            $("#camera_controller_gui_preset_main").hide();
            $("#camera_controller_gui_adjust_main").show();
            $("#camera_controller_gui_ptz_main").hide();
            $("#scene").show();
            $("#camera_control_line").hide();
            $("#camera_control_line_2").hide();
            $("#camera_control_line_3").hide();
            $("#camera_control_line_4").show();
            $("#setup_preset_form_inner_limit").show();
            $(".btn_adjust_area_ctrl").hide();
            $("#camera_ptz_d_zoom_label").hide();
            $("#camera_ptz_d_ext_label").hide();
            $("#camera_ptz_touch_label").hide();
            $("#slider_Main").show();
            $("#setup_preset_setting").show();
            $(".stream_rtmp").hide();
            $(".ptz_btn_stream_stop").hide();
            $(".btn_cup").hide();
            $(".btn_stream_stop").hide();
            $("#camera_controller_gui_adjust_iris").hide();
            $("#camera_controller_gui_adjust_gain").hide();
            $(".setup_preset_zoom_pos_label").hide();
            $(".setup_preset_zoom_posOn_radio").hide();
            $(".setup_preset_zoom_posOff_radio").hide();
            $(".setup_preset_zoom_posOn_label").hide();
            $(".setup_preset_zoom_posOff_label").hide();

            $(".setup_preset_focus_adj_label").hide();
            $(".setup_preset_focus_adjOn_radio").hide();
            $(".setup_preset_focus_adjOff_radio").hide();
            $(".setup_preset_focus_adjOn_label").hide();
            $(".setup_preset_focus_adjOff_label").hide();

            $("#camera_controller_gui_open_btn").hide();
            $("#camera_controller_gui_open_btn2").hide();
            $("#camera_controller_gui_open_preset").hide();
            btnObjectCommon[BTN_NM_PRESET].displayOff();
            btnObjectCommon[BTN_NM_PTLS].displayOff();
            btnObjectCommon[BTN_NM_SETTING].displayOn();
            $("#camera_adjust_line,#camera_adjust_line_2").hide();
            $("#setup_preset_form_inner").show();
            $(".btn_a_iris_win ").hide();

            doOpenImageAdjustWindow_ppls();

            //let it down control
            $(".camera_control_adjust_down_area").removeClass("camera_control_adjust_down");

            let camera_controller_setting_Css = document.getElementById("camera_controller_setting_cssId");
            camera_controller_setting_Css.href = "/css/pc/camera_controller_setting_touch.css";
            if(buildSettingScrollSuccessFlg){
                buildSettingScrollSuccessFlg = false;
                setTimeout(function(){
                    settingScroll = new IScroll('#setup_preset_form_inner', {
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
                    buildSettingScrollSuccessFlg = true;
                },300)
            }
        }
    }

    /**
     * open the bottom window : image adjust
     */
    function doOpenImageAdjustWindow() {
        imageControlButton.changeImageAdjustElementToWindow();
        // title
        $(".camera_adjust_iris").removeClass("camera_adjust_iris").addClass("window_adjust_iris");
        $(".camera_adjust_gain").removeClass("camera_adjust_gain").addClass("window_adjust_gain");
        $(".camera_adjust_wb").removeClass("camera_adjust_wb").addClass("window_adjust_wb");
        $(".camera_adjust_shutter").removeClass("camera_adjust_shutter").addClass("window_adjust_shutter");
        $(".camera_adjust_nd").removeClass("camera_adjust_nd").addClass("window_adjust_nd");
        $(".camera_adjust_line").removeClass("camera_adjust_line").addClass("adjust_window_line1");
        $(".camera_adjust_line_2").removeClass("camera_adjust_line_2").addClass("adjust_window_line2");
        $(".camera_adjust_line_3").removeClass("camera_adjust_line_3").addClass("adjust_window_line3");
        $(".camera_adjust_line_4").removeClass("camera_adjust_line_4").addClass("adjust_window_line4");
        $(".camera_adjust_line_6").removeClass("camera_adjust_line_6").addClass("adjust_window_line6");
        $("#camera_adjust_title").hide();
        btnObjectCommon[BTN_OPEN_IMAGE_ADJUST].hide();
        $("#id_Mute2").hide();
        $("#id_Mute3").show();
        $(".txt_selectedScene").hide();
        $("#scene").show();
        sliderIris.changeSliderStyle("iris_slider_wrap", "iris_slider_handle", "iris_slider_win_wrap", "iris_slider_win_handle");
    }

    function doOpenImageAdjustWindow_ppls() {
        imageControlButton.changeImageAdjustElementToWindow();
        // title
        $(".camera_adjust_iris").removeClass("camera_adjust_iris").addClass("window_adjust_iris");
        $(".camera_adjust_gain").removeClass("camera_adjust_gain").addClass("window_adjust_gain");
        $(".camera_adjust_wb").removeClass("camera_adjust_wb").addClass("window_adjust_wb");
        $(".camera_adjust_shutter").removeClass("camera_adjust_shutter").addClass("window_adjust_shutter");
        $(".camera_adjust_nd").removeClass("camera_adjust_nd").addClass("window_adjust_nd");
        $(".camera_adjust_line").removeClass("camera_adjust_line").addClass("adjust_window_line1");
        $(".camera_adjust_line_2").removeClass("camera_adjust_line_2").addClass("adjust_window_line2");
        $(".camera_adjust_line_3").removeClass("camera_adjust_line_3").addClass("adjust_window_line3");
        $(".camera_adjust_line_4").removeClass("camera_adjust_line_4").addClass("adjust_window_line4");
        $(".camera_adjust_line_6").removeClass("camera_adjust_line_6").addClass("adjust_window_line6");
        $("#camera_adjust_title").hide();
        btnObjectCommon[BTN_OPEN_IMAGE_ADJUST].hide();
        $("#id_Mute2").hide();
        $("#id_Mute3").show();
        $("#scene").show();
        sliderIris.changeSliderStyle("iris_slider_wrap", "iris_slider_handle", "iris_slider_win_wrap", "iris_slider_win_handle");
    }

    /**
     * close the every window : image adjust/preset/PTZ
     */
    function callbackNarrowArea(mouse) {
        if (mouse == Button.MOUSE_DOWN) {
            touchWindowFlg = 0;
            callbackChangeToTouch();
        }
    }

    function callbackChangeToTouch(mouse) {
        toggleTouchMode();

        if (Platform.isTouchMode()) {
            cameraControllerSetting.callbackOpenPreset(1);
        } else {
            cameraControllerSetting.narrowArea();
        }

        if (Platform.isSetupMode() && $(".setup_menu_UHDCrop_btn").hasClass('on')) {
            settingIoaUhd.changeMode();
        }

        if (Platform.isSetupMode() && $(".setup_menu_presetPosition_btn").hasClass('on')) {
            setupIoaPresetPosition.changeCameraControllerToPreset();
        }
    }

    function narrowArea(){
        if (ptzAreaCtrlFlag) {
            zoomSpeedFocusCtrlButton.hideButtonByCtrl();
        }
        if (ptzPresetCtrlFlag) {
            presetSetting.hideButtonByCtrl();
            if(!Platform.isSetupMode()){
                $("#preset_set_label").show();
            }
        }
        zoomSpeedFocusCtrlButton.btnAIrisWinShow();
        //$("#camera_preset_title").show();
        $("#camera_controller_gui_preset_main").show();
        $("#camera_controller_gui_adjust_main").show();
        $("#camera_controller_gui_ptz_main").show();
        $("#camera_controller_gui_open_preset").hide();
        $(".txt_selectedScene").show();
        $("#camera_control_line").show();
        $("#camera_control_line_2").show();
        $("#camera_control_line_3").show();
        $("#camera_control_line_4").hide();
        $("#camera_ptz_d_zoom_label").show();
        $("#camera_ptz_d_ext_label").show();
        if(gBTN_TOUCH_F_status == 1 ){
            $("#camera_ptz_touch_label").hide();
        }else {
            $("#camera_ptz_touch_label").show();
        }
        $(".btn_ptz_area_ctrl").show();
        $(".btn_adjust_area_ctrl").show();

        $("#camera_controller_gui_open_btn").hide();
        $("#camera_controller_gui_open_btn2").hide();

        doClosePtzWindow();
        doCloseImageAdjustWindow();

        if (ptzAdjustCtrlFlag) {
            $(".camera_control_adjust_down_area").removeClass("camera_control_adjust_down");
            $(".stream_rtmp").show();
            $(".btn_stream_stop").show();
            $(".ptz_btn_stream_stop").show();
        } else {
            $(".camera_control_adjust_down_area").addClass("camera_control_adjust_down");
            $(".stream_rtmp").hide();
            $(".btn_stream_stop").hide();
            $(".ptz_btn_stream_stop").hide();
        }
        let camera_controller_setting_Css = document.getElementById("camera_controller_setting_cssId");
        if(isPageFlg == "admin"){
            camera_controller_setting_Css.href = "/css/pc/camera_controller_setting.css";
        }else{
            camera_controller_setting_Css.href = "/css/pc/camera_controller_setting_live.css";
            $(".btn_ptz_preset_ctrl").show();
            $(".btn_enlarge_preset").show();
            $(".btn_preset_home").show();
            for(let i = 1;i<13;i++){
                $(".btn_preset_"+i).show();
            }
        }
        $("#camera_adjust_line,#camera_adjust_line_2,#image_adjust").show();
        $('#clienttable').css("top","160px");
        $('#clienttable').css("left","30px");
        $("#camera_preset_title").show();

        if (!Platform.isTouchMode()) {
            $(".camera_controller_gui_ptz_main_bottom_line").show();
            document.getElementById("camera_controller_gui_ptz_main").style.borderBottom="1px solid #000000";
        }
    }

    /**
     * close the top window : PTZ
     */
    function doClosePtzWindow() {
        ptCtrlButton.changePtzElementToMain();
        zoomSpeedFocusCtrlButton.changePtzElementToMain();
        // title
        $(".window_ptz_zoom").removeClass("window_ptz_zoom").addClass("camera_ptz_zoom");
        $(".window_ptz_speed").removeClass("window_ptz_speed").addClass("camera_ptz_speed");
        $(".window_ptz_focus").removeClass("window_ptz_focus").addClass("camera_ptz_focus");
        $("#camera_ptz_ctrl").show();
        $("#window_ptz_ctrl").hide();
        // slider
        sliderSpeed.changeSliderStyle("speed_slider_win_wrap", "speed_slider_win_handle", "speed_slider_wrap", "speed_slider_handle");
        sliderZoom.changeSliderStyle("zoom_slider_win_wrap", "zoom_slider_win_handle", "zoom_slider_wrap", "zoom_slider_handle");
        sliderFocus.changeSliderStyle("focus_slider_win_wrap", "focus_slider_win_handle", "focus_slider_wrap", "focus_slider_handle");


        settingIoaUhd.getSliderCropSpeed().changeSliderStyle("cropSpeed_slider_win_wrap", "cropSpeed_slider_win_handle","cropSpeed_slider_wrap", "cropSpeed_slider_handle");
        settingIoaUhd.getSliderCropZoom().changeSliderStyle("cropZoom_slider_win_wrap", "cropZoom_slider_win_handle","cropZoom_slider_wrap", "cropZoom_slider_handle");
        $(".ptz_window_middle_line").removeClass("ptz_window_middle_line").addClass("camera_ptz_line");
        $(".ptz_window_bottom_line").removeClass("ptz_window_bottom_line").addClass("camera_ptz_line_2");
        $("#camera_ptz_line_3").show();
        $("#camera_ptz_title").show();
        $("#camera_controller_gui_open_preset").hide();
        if (window.location.href.indexOf("admin") =="-1") {
            //todo
            if (adminPage) {
                btnObjectCommon[BTN_ENLARGE_PTZ].hide();
                btnObjectCommon[BTN_OPEN_PRESET].hide();
                btnObjectCommon[BTN_OPEN_IMAGE_ADJUST].hide();
            }else{
                btnObjectCommon[BTN_ENLARGE_PTZ].show();
                btnObjectCommon[BTN_ENLARGE_PTZ].displayOff();
            }
        }else{
            btnObjectCommon[BTN_ENLARGE_PTZ].show();
            btnObjectCommon[BTN_ENLARGE_PTZ].displayOff();
        }
        //btnObjectCommon[BTN_A_IRIS_WIN].hide();
        if(cameraControllerSetting.getPtzAreaCtrlFlag()){//#8446
            zoomSpeedFocusCtrlButton.hideButtonByCtrl();
        }
    }

    /**
     * close the bottom window : image adjust
     */
    function doCloseImageAdjustWindow() {
        imageControlButton.changeImageAdjustElementToMain();

        // title
        $(".window_adjust_iris").removeClass("window_adjust_iris").addClass("camera_adjust_iris");
        $(".window_adjust_gain").removeClass("window_adjust_gain").addClass("camera_adjust_gain");
        $(".window_adjust_wb").removeClass("window_adjust_wb").addClass("camera_adjust_wb");
        $(".window_adjust_shutter").removeClass("window_adjust_shutter").addClass("camera_adjust_shutter");
        $(".window_adjust_nd").removeClass("window_adjust_nd").addClass("camera_adjust_nd");
        $(".adjust_window_line1").removeClass("adjust_window_line1").addClass("camera_adjust_line");
        $(".adjust_window_line2").removeClass("adjust_window_line2").addClass("camera_adjust_line_2");
        $(".adjust_window_line3").removeClass("adjust_window_line3").addClass("camera_adjust_line_3");
        $(".adjust_window_line4").removeClass("adjust_window_line4").addClass("camera_adjust_line_4");
        $(".adjust_window_line6").removeClass("adjust_window_line6").addClass("camera_adjust_line_6");
        $("#camera_adjust_title").show();
        btnObjectCommon[BTN_OPEN_IMAGE_ADJUST].show();
        btnObjectCommon[BTN_OPEN_IMAGE_ADJUST].displayOff();
        if (window.location.href.indexOf("admin") =="-1") {
            //todo
            if (adminPage) {
                btnObjectCommon[BTN_ENLARGE_PTZ].hide();
                btnObjectCommon[BTN_OPEN_PRESET].hide();
                btnObjectCommon[BTN_OPEN_IMAGE_ADJUST].hide();
            }
        }else{
            btnObjectCommon[BTN_OPEN_IMAGE_ADJUST].show();
            btnObjectCommon[BTN_OPEN_IMAGE_ADJUST].displayOff();
        }

        $("#id_Mute2").show();
        $("#id_Mute3").hide();
        sliderIris.changeSliderStyle("iris_slider_win_wrap", "iris_slider_win_handle", "iris_slider_wrap", "iris_slider_handle");
    }

    /************************************************************2018-02-13 lzp start:sound***************************************************************/
    let fSound = document;
    let Str_cursor, End_cursor, Lst_cursor, Now_cursor;

    /**
     * control sound
     */
    function soundSlider() {
        let GetId = "";
        const id = "ImgCursor";
        GetId = event.srcElement.id;
        SetId = Math.abs(GetId.substring(6, 7));
        if (( gbAudioState == 1 ) && ( SetId == "1" )) {
            let lcStr = fSound.getElementById(id + SetId).style.left;
            Lst_cursor = Number(lcStr.substr(0, lcStr.length - 2));
            Str_cursor = event.x;
            Slide_flg = true;
        }
    }

    let Slide_flg = false;

    /**
     * volumeのスライダーに関する処理
     * @param sVolId
     * @param sPosi
     * @constructor
     */
    function VolMove(sVolId, sPosi) {
        let id = "ImgCursor";
        if ((gbAudioState == 1 ) && ( sVolId == "1" )) {
            Now_cursor = sPosi;
            fSound.getElementById(id + sVolId).style.left = sPosi + "px";
            // 'posLeft' only for IE
            VolSet(sVolId);
        }
    }

    let _ms = "" + cparams.inputvolume;
    let gsVol = new Array(_ms, "");
    let InPosi = Array(402, 419, 433);
    let Bac_x = new Array(384, 484);
    let giInFLG = 0;
    let SetId = "0";
    let Minsdr_x = 0;
    let Maxsdr_x = 48;
    let Move_max = new Array(Bac_x[0] + Maxsdr_x, Bac_x[1] + Maxsdr_x);
    let Move_min = new Array(Bac_x[0] + Minsdr_x, Bac_x[1] + Minsdr_x);

    /**
     * drag to control the sound volume;
     * @param SetId
     * @constructor
     */
    function VolSet(SetId) {
        let gsInVol = new Array(new Array("low", "mid", "high"), new Array("line_low", "line_mid", "line_high"));
        if ((gbAudioState == 1 ) && ( SetId == "1" )) {
            if (( Now_cursor >= Bac_x[0] ) && ( Now_cursor <= InPosi[0] )) {
                gsVol[0] = gsInVol[giInFLG][0];
            }
            else if (( Now_cursor > InPosi[0] ) && ( Now_cursor <= InPosi[1] )) {
                gsVol[0] = gsInVol[giInFLG][1];
            }
            else if (( Now_cursor > InPosi[1] ) && ( Now_cursor <= InPosi[2] )) {
                gsVol[0] = gsInVol[giInFLG][2];
            }
        }
        DoSubmitVol(SetId);
    }

    /**
     * set url
     * @param sVolId
     * @constructor
     */
    function DoSubmitVol(sVolId) {
        if ((gbAudioState == 1 ) && ( sVolId == "1" )) {
            if (gsVol[0] != "") {
                $.get("/cgi-bin/audio_vol?in_vol=" + gsVol[0], function (data, status) {
                });
            }
        }
    }

    /**
     * drag end
     * @constructor
     */
    function SliderEnd() {
        Slide_flg = false;
        if (( gbAudioState == 1 ) && ( SetId == "1" )) {
            VolSet(SetId);
        }
    }

    /**
     * do dragging
     * @constructor
     */
    function SliderMove() {
        let id = "ImgCursor";
        if (( gbAudioState == 1 ) && ( SetId == "1" )) {
            if (Slide_flg) {
                End_cursor = event.x;
                Now_cursor = (End_cursor - Str_cursor) + Lst_cursor;
                if (Now_cursor < Move_min[SetId - 1]) {
                    Now_cursor = Move_min[SetId - 1];
                }
                if (Now_cursor > Move_max[SetId - 1]) {
                    Now_cursor = Move_max[SetId - 1];
                }
                fSound.getElementById(id + SetId).style.left = Now_cursor + "px";
            }
        }
        event.returnValue = false;
    }

    /**
     * do dragging
     * @constructor
     */
    function InVolume(State1) {
        let Bac_y = 7;
        let Sdr_y = 0;
        let Ini_level = new Array(230, 330);
        fSound.getElementById("ImgCursor1").style.posTop = Bac_y + Sdr_y;
        if (State1 == 3) {
            switch (gsVol[0]) {
                case "low":
                case "line_low":
                    Ini_level[0] = InPosi[0];
                    break;
                case "mid":
                case "middle":
                case "line_mid":
                case "line_middle":
                    Ini_level[0] = InPosi[1];
                    break;
                case "hi":
                case "high":
                case "line_hi":
                case "line_high":
                    Ini_level[0] = InPosi[2];
                    break;
                default:
                    Ini_level[0] = InPosi[0];
                    break;

            }
            fSound.getElementById("ImgCursor1").style.left = Ini_level[0] + "px";
        }
        else {
            fSound.getElementById("ImgCursor1").style.left = Bac_x[0] + "px";
        }
    }

    /**
     * cancel the mute
     */
    function mainview_MuteCancel() {
        if (gbAudioActX) {
            if (giTrans < 2) {
                document.WebAudio.StartLive();
                giAudioState = 1;
                document.WebAudio.Mute = 0;
            }
            else {
                document.WebVideo.Mute = 0;
            }
        }
    }

    /**
     * do mute
     */
    function mainview_Mute() {
        if (gbAudioActX) {
            if (giTrans < 2) {
                document.WebAudio.Mute = 1;
                document.WebAudio.StopLive();
                giAudioState = 0;
            }
            else {
                document.WebVideo.Mute = 1;
            }
        }
    }

    /************************************************************2018-02-13 lzp stop:sound***************************************************************/

    /**
     * Zoomコントロールコールバック処理
     * @param {number} percent　設定倍率
     */
    let timerSilderId = null;
    function zoomCtrlCallback(percent) {
        if(timerSilderId != null){
            clearTimeout(timerSilderId);
            timerSilderId = null;
        }

        silderMouseDownFlag = true;
        zoomSilderClickFlag = true;
        percent = percent < 0 ? 0 : percent;
        percent = percent > 999 ? 999 : percent;
        percent = Math.floor(percent/999*2730+1365);
        doZoomSlider(parseInt(percent));
        setTimeout(function(){
            silderMouseDownFlag = false;
            timerSilderId = setTimeout(function(){
                zoomSilderClickFlag = false;
            },4000);
        },1000);
    }

    /**
     * zoom slider control
     * @param percent
     */
    function doZoomSlider(percent) {
        cparam_set_zoomPositionControl(percent);
    }

    /**
     * スピードコントロールコールバック処理
     * @param {number} percent　設定倍率
     */
    function speedCtrlCallback(percent) {
        sliderSpeed.redrawSliderLevelColor(true);
    }

    /**
     * Focusコントロールコールバック処理
     * @param {number} percent　設定倍率
     */
    function focusCtrlCallback(percent) {
        percent = percent < 0 ? 0 : percent;
        percent = percent > 99 ? 99 : percent;
        percent = Math.floor(percent/99*2730+1365);
        doFocusSlider(parseInt(percent));
    }

    /**
     * focus slider control
     * @param percent
     */
    function doFocusSlider(percent) {
        cparam_set_focusPositionControl(percent);
    }

    /**
     * Irisコントロールコールバック処理
     * @param {number} percent　設定倍率
     */
    function irisCtrlCallback(percent) {
        percent = percent < 0 ? 0 : percent;
        percent = percent > 254 ? 254 : percent;
        percent = Math.round(percent/254*99);
        percent = percent < 1 ? 1 : percent;
        doIrisSlider(percent);
    }

    /**
     * iris slider control
     * @param percent
     */
    function doIrisSlider(percent) {
        cparam_set_irisControlSpeed(percent);
    }

    /**
     * カメラ状態情報更新処理<br>
     * 更新されたカメラ状態情報に応じてスピード・ズーム各種スライダの押下可否判定を行う
     * @param {object} status カメラ状態
     */
    function updateStatus(status) {
        ptCtrlButton.updateStatus(status);
        zoomSpeedFocusCtrlButton.updateStatus(status);
        presetSetting.updateStatus(status);
        imageControlButton.updateStatus(status);
        statusFlag = status;
        if (status == 1) {
            btnObjectCommon[BTN_ENLARGE_PTZ].displayOff();
            btnObjectCommon[BTN_OPEN_PRESET].displayOff();
            btnObjectCommon[BTN_OPEN_IMAGE_ADJUST].displayOff();
            btnObjectCommon[BTN_NARROW_AREA].displayOff();
            btnObjectCommon[BTN_GET_PTZ].displayOff();
            btnObjectCommon[BTN_GET_PRESET].displayOff();
            btnObjectCommon[BTN_GET_IMAGE_ADJUST].displayOff();
            btnObjectCommon[BTN_PTZ_AREA_CTRL].displayOff();
            btnObjectCommon[BTN_ADJUST_AREA_CTRL].displayOff();
            btnObjectCommon[BTN_PTZ_PRESET_CTRL].displayOff();

            btnObjectCommon[BTN_NM_PRESET].displayOff();
            btnObjectCommon[BTN_NM_PTLS].displayOff();
            btnObjectCommon[BTN_NM_SETTING].displayOff();
            btnObjectCommon[BTN_NARROW_AREA].displayOff();
            btnObjectCommon[BTN_A_IRIS_WIN].displayOff();//#8518

            sliderZoom.undisable();
            sliderSpeed.undisable();
            sliderFocus.undisable();
            sliderIris.undisable();
        } else {
            btnObjectCommon[BTN_ENLARGE_PTZ].displayDisabled();
            btnObjectCommon[BTN_OPEN_PRESET].displayDisabled();
            btnObjectCommon[BTN_OPEN_IMAGE_ADJUST].displayDisabled();
            btnObjectCommon[BTN_NARROW_AREA].displayDisabled();
            btnObjectCommon[BTN_GET_PTZ].displayDisabled();
            btnObjectCommon[BTN_GET_PRESET].displayDisabled();
            btnObjectCommon[BTN_GET_IMAGE_ADJUST].displayDisabled();
            btnObjectCommon[BTN_PTZ_AREA_CTRL].displayDisabled();
            ptzAdjustCtrlFlag = false;
            callbackAdjustAreaCtrl(1);
            btnObjectCommon[BTN_ADJUST_AREA_CTRL].displayDisabled();
            ptzPresetCtrlFlag = false;
            callbackPtzPresetCtrl(1)
            btnObjectCommon[BTN_PTZ_PRESET_CTRL].displayDisabled();
            btnObjectCommon[BTN_NARROW_AREA].displayDisabled();

            btnObjectCommon[BTN_NM_PRESET].displayDisabled();
            btnObjectCommon[BTN_NM_PTLS].displayDisabled();
            btnObjectCommon[BTN_NM_SETTING].displayDisabled();
            btnObjectCommon[BTN_A_IRIS_WIN].displayDisabled(); //#8518

            //$('#power').prop("disabled", true);
            $("#power").css("color","gray");
            sliderZoom.disable();
            sliderSpeed.disable();
            sliderFocus.disable();
            sliderIris.disable();

        }
    }

    /*************************cparam.js out to here start**********************/

    /**
     * start to control PTZ center : zoom
     * @param evt
     * @constructor
     */
    function StartWheelZoom(evt) {
        if (gFlgDisableCamCtrl == true) {
            return;
        }
        if (window.event) {
            evt = window.event;
        }
        operateZoomWheel(evt);
    }


    /**
     * control PTZ center : zoom
     * @param evt
     */
    function operateZoomWheel(evt) {
        let sComm;
        let iDelta = evt.wheelDelta;
        let iZoomWheelState;
        let iTimeOut;

        if (typeof iDelta === "undefined") {
            iDelta = evt.detail * -1;
        }

        if (giZoomWheelState == ZOOM_WHEEL_STOP) {
            if (iDelta > 0) {
                if (gbZoomWheelSpeedUp) {
                    sComm = 85;
                    iTimeOut = ZOOM_WHEEL_INTERVAL_DSBL_LONG;
                } else {
                    sComm = 75;
                    gbZoomWheelSpeedUp = true;
                    iTimeOut = ZOOM_WHEEL_INTERVAL_DSBL;
                }
                iZoomWheelState = ZOOM_WHEEL_TELE;
            } else {
                if (gbZoomWheelSpeedUp) {
                    sComm = 15;
                    iTimeOut = ZOOM_WHEEL_INTERVAL_DSBL_LONG;
                } else {
                    sComm = 25;
                    gbZoomWheelSpeedUp = true;
                    iTimeOut = ZOOM_WHEEL_INTERVAL_DSBL;
                }
                iZoomWheelState = ZOOM_WHEEL_WIDE;
            }
            cparam_set_zoomSpeed(sComm);
            giZoomWheelState = iZoomWheelState;
            clearTimeout(gTimerDisableZoomWheel);
            gTimerDisableZoomWheel = setTimeout("preset_enableZoomWheel();", iTimeOut);
        } else {
            if (iDelta > 0) {
                if (giZoomWheelState == ZOOM_WHEEL_WIDE) {
                    if (gbZoomWheelSpeedUp) {
                        sComm = 85;
                        iTimeOut = ZOOM_WHEEL_INTERVAL_DSBL_LONG;
                    } else {
                        sComm = 75;
                        gbZoomWheelSpeedUp = true;
                        iTimeOut = ZOOM_WHEEL_INTERVAL_DSBL;
                    }
                    cparam_set_zoomSpeed(sComm);
                    giZoomWheelState = ZOOM_WHEEL_TELE;
                    clearTimeout(gTimerDisableZoomWheel);
                    gTimerDisableZoomWheel = setTimeout("preset_enableZoomWheel();", iTimeOut);
                } else {
                    // DO NOTHING
                }
            } else {
                if (giZoomWheelState == ZOOM_WHEEL_TELE) {
                    if (gbZoomWheelSpeedUp) {
                        sComm = 15;
                        iTimeOut = ZOOM_WHEEL_INTERVAL_DSBL_LONG;
                    } else {
                        sComm = 25;
                        gbZoomWheelSpeedUp = true;
                        iTimeOut = ZOOM_WHEEL_INTERVAL_DSBL;
                    }
                    cparam_set_zoomSpeed(sComm);
                    giZoomWheelState = ZOOM_WHEEL_WIDE;
                    clearTimeout(gTimerDisableZoomWheel);
                    gTimerDisableZoomWheel = setTimeout("preset_enableZoomWheel();", iTimeOut);
                } else {
                    // DO NOTHING
                }
            }
        }
        clearTimeout(gTimerWaitStopZoomWheel);
        gTimerWaitStopZoomWheel = setTimeout("preset_stopZoomWheel();", ZOOM_WHEEL_INTERVAL_WAIT_STOP);
    }

    /*************************cparam.js out to here end**********************/

    /**********************************************lzp 20180410 start**********************************************/
    function callbackPtzAreaCtrl(mouse) {
        if (mouse == Button.MOUSE_DOWN) {
            if (ptzAreaCtrlFlag) {
                $("#camera_controller_gui_ptz_main").addClass("camera_controller_gui_ptz_main_down");
                $("#camera_ptz_line_2").addClass("camera_controller_gui_ptz_line");
                $("#camera_ptz_line_3").addClass("camera_controller_gui_ptz_line");
                btnObjectCommon[BTN_PTZ_AREA_CTRL].displayOn();
                zoomSpeedFocusCtrlButton.showButtonByCtrl();

                ptzAreaCtrlFlag = false;
                let divName = $("#camera_ptz_d_zoom_label").html();
                let divTouchName = $("#camera_ptz_touch_label").html();
                if (divName == "D-Ext.(x1.4)") {
                    zoomSpeedFocusCtrlButton.btnExtDisplayOn();
                }else if(divName == "D-Ext.(x2.0)"){
                    zoomSpeedFocusCtrlButton.btnExtDisplayOn_20();
                } else if (divName == "D-Zoom") {
                    zoomSpeedFocusCtrlButton.btnZoomDisplayOn();
                }
                if (divTouchName == "Touch AF") {
                    zoomSpeedFocusCtrlButton.btnTonchDisplayOn();
                }
                if (divTouchName == "Focus Guide") {
                    zoomSpeedFocusCtrlButton.btnTonchDisplayOn();
                }
                if(cparam_get_UHDCrop() != 0 || cparam_get_bar() == 1 || cparam_get_focusMode() ==1) {
                    zoomSpeedFocusCtrlButton.disableTouch_AF_Button();
                }else{
                    if (gBTN_TOUCH_F_status == 1) {
                        zoomSpeedFocusCtrlButton.btnTonchDisplayOn();
                    } else {
                        zoomSpeedFocusCtrlButton.undisableTouch_AF_Button();
                    }
                    if (gBTN_FOCUS_GUIDE_status == 1) {
                        zoomSpeedFocusCtrlButton.btnTonchDisplayOn();
                    } else {
                        zoomSpeedFocusCtrlButton.undisableTouch_AF_Button();
                    }
                }
                if(zoomSpeedFocusCtrlButton.canUseIrisButton()){
                    if(zoomSpeedFocusCtrlButton.isIrisWinDisable()){
                        zoomSpeedFocusCtrlButton.undisableTouch_A_lris_Win_Button();
                    }
                    zoomSpeedFocusCtrlButton.btnAIrisWinShow();
                }else{
                    zoomSpeedFocusCtrlButton.disableTouch_A_lris_Win_Button();
                }
                $("#camera_ptz_d_ext_label").hide();
                $("#camera_ptz_d_zoom_label").hide();
                $("#camera_ptz_touch_label").hide();

                $(".camera_controller_gui_ptz_main_bottom_line").show();
            } else {
                $("#camera_controller_gui_ptz_main").removeClass("camera_controller_gui_ptz_main_down");
                $("#camera_ptz_line_2").removeClass("camera_controller_gui_ptz_line");
                $("#camera_ptz_line_3").removeClass("camera_controller_gui_ptz_line");
                btnObjectCommon[BTN_PTZ_AREA_CTRL].displayOff();
                zoomSpeedFocusCtrlButton.hideButtonByCtrl();
                ptzAreaCtrlFlag = true;
                $("#camera_ptz_d_ext_label").show();
                $("#camera_ptz_d_zoom_label").show();
                $("#camera_ptz_touch_label").show();
                $(".camera_controller_gui_ptz_main_bottom_line").hide();
                if(cparam_get_UHDCrop() !=0 || cparam_get_bar() == 1 || cparam_get_focusMode() ==1) {
                    zoomSpeedFocusCtrlButton.disableTouch_AF_Button();
                    $("#camera_ptz_touch_label").hide();
                }else{
                    if (gBTN_TOUCH_F_status == 1) {
                        $("#camera_ptz_touch_label").show();
                        zoomSpeedFocusCtrlButton.btnTonchDisplayOn();
                    } else {
                        zoomSpeedFocusCtrlButton.undisableTouch_AF_Button();
                    }
                    if (gBTN_FOCUS_GUIDE_status == 1) {
                        $("#camera_ptz_touch_label").show();
                        zoomSpeedFocusCtrlButton.btnTonchDisplayOn();
                    } else {
                        zoomSpeedFocusCtrlButton.undisableTouch_AF_Button();
                    }
                }
            }
        }
    }

    function callbackPtzPresetCtrl(mouse) {
        if (mouse == Button.MOUSE_DOWN) {

            if (ptzPresetCtrlFlag) {
                $("#camera_controller_gui_preset_main").addClass("camera_controller_gui_preset_main_down");
                btnObjectCommon[BTN_PTZ_PRESET_CTRL].displayOn();
                presetSetting.showButtonByCtrl();

                let divName = $("#preset_set_label").html();
                if (divName == NPTZ_WORDING.wID_0019) {
                    presetSetting.showButtonSet();
                } else if (divName == NPTZ_WORDING.wID_0020) {
                    presetSetting.showButtonDelete();
                } else {
                    //nothing
                }

                $("#preset_set_label").hide();
                $(".camera_controller_gui_preset_main_bottom_line").show();
                ptzPresetCtrlFlag = false;
            } else {
                $("#camera_controller_gui_preset_main").removeClass("camera_controller_gui_preset_main_down");
                btnObjectCommon[BTN_PTZ_PRESET_CTRL].displayOff();
                presetSetting.hideButtonByCtrl();
                $("#preset_set_label").show();
                $(".camera_controller_gui_preset_main_bottom_line").hide();
                ptzPresetCtrlFlag = true;
            }
        }
    }

    function callbackAdjustAreaCtrl(mouse) {
        if (mouse == Button.MOUSE_DOWN) {
            if (ptzAdjustCtrlFlag) {
                $(".camera_control_adjust_down_area").addClass("camera_control_adjust_down");
                $(".camera_adjust_line_6").hide();
                //imageControlButton.setSceneSelectedValue(cparam_get_sceneMode().toString());
                $("#scene").show();
                btnObjectCommon[BTN_ADJUST_AREA_CTRL].displayOn();
                ptzAdjustCtrlFlag = false;
                $(".camera_controller_gui_adjust_bottom_top_line").hide();
                $(".stream_rtmp").hide();
                $(".btn_stream_stop").hide();
                $(".ptz_btn_stream_stop").hide();
            } else {
                $(".camera_control_adjust_down_area").removeClass("camera_control_adjust_down");
                $(".camera_adjust_line_6").show();
                $("#scene").hide();
                btnObjectCommon[BTN_ADJUST_AREA_CTRL].displayOff();
                $(".camera_controller_gui_adjust_bottom_top_line").show();
                $(".stream_rtmp").show();
                $(".btn_stream_stop").show();
                $(".ptz_btn_stream_stop").show();
                ptzAdjustCtrlFlag = true;
            }
        }
    }

    let intervalSetSliderValue = null;
    let intervalUHDCropMode = null;
    function startSetSliderValue() {
        if(intervalSetSliderValue != null){
            clearInterval(intervalSetSliderValue);
        }
        if(intervalUHDCropMode != null){
            clearInterval(intervalUHDCropMode);
        }
        intervalSetSliderValue = setInterval(function () {
            if(silderMouseDownFlag == false){
                if(silderMouseUpOverSleepTime > 0){
                    silderMouseUpOverSleepTime = silderMouseUpOverSleepTime - 1;
                }else {
                    getSliderValues();
                }
            }
        }, 1500);
    }

    function stopIntervalSetSlider(){
        if((intervalSetSliderValue == null) && (intervalUHDCropMode == null)) return;
        clearInterval(intervalSetSliderValue);
        clearInterval(intervalUHDCropMode);
        intervalSetSliderValue = null;
        intervalUHDCropMode = null;

    }

    function getSliderValues() {

        if (document.getElementById("camera_controller_gui").style.display == "none" || !liveModeFlg) {
            if(!firstPTD){
                return;
            }
            firstPTD = false;
            ;
        }
        if(window.location.href.indexOf("live") !="-1"){
            if(adminPage && window.parent.document.getElementById("setup_imageAdjust_main").style.display == "none"){
                return;
            }
        }

        //不具合管理 #3804
        if(!pcOperationFlag){
            setTimeout(function () {
                var mapPtv = reqPtdObj.mapPtv; //modify ppt30 20181008
                var mapPtd = reqPtdObj.mapPtd;
                gPTV = mapPtv;

                // focus
                if (!($('.zoom_slider_handle').hasClass('drag'))) if (!($('.zoom_slider_handle').hasClass('disable')) && !($('.zoom_slider_win_handle').hasClass('disable'))) { ////modify ppt30 20181008
                    // zoom

                    let zoomVal = mapPtv.zoom;
                    if (zoomVal == undefined || zoomVal < 1365) {
                        zoomVal = 1365;
                    }
                    zoomVal = Math.floor((zoomVal - 1365) / 2730 * 999);
                    if(zoomVal<=1){
                        zoomVal = 0;
                    }
                    if (zoomVal >= 0) {

                        if (!zoomSilderClickFlag) {
                            sliderZoom.setPosition(zoomVal, 999);  //00H-3E7h 0-999 1000
                        }
                        zoomSpeedFocusCtrlButton.setZoomValue(mapPtd.zoom);
                    } else {
                        zoomSpeedFocusCtrlButton.setZoomValue(NPTZ_WORDING.wID_0167);
                    }
                } else {
                    zoomSpeedFocusCtrlButton.setZoomValue(NPTZ_WORDING.wID_0167);
                }
                // focus
                if (!($('.focus_slider_handle').hasClass('drag'))) {
                    if (!$('.focus_slider_handle').hasClass('disable') && AutoFocus != 1 && !$("#power")[0].disabled) {
                        let focusVal = mapPtv.focus; //555h-FFFh  1365-4095
                        if (focusVal == undefined || focusVal < 1365) {
                            focusVal = 4095;
                        }
                        focusVal = Math.floor((focusVal - 1365) / 2730 * 99);
                        if (focusVal >= 0) {
                            sliderFocus.setPosition(focusVal, 99);
                            zoomSpeedFocusCtrlButton.setFocusValue(mapPtd.focus);
                        } else {
                            zoomSpeedFocusCtrlButton.setFocusValue(NPTZ_WORDING.wID_0167);
                        }
                    } else {
                        zoomSpeedFocusCtrlButton.setFocusValue(NPTZ_WORDING.wID_0167);
                    }
                }
                // iris
                if (!($('.iris_slider_handle').hasClass('drag'))) {
                    if (!($('.iris_slider_handle').hasClass('disable')) && AutoIris != 1 && !$("#power")[0].disabled) {
                        let irisVal = mapPtv.iris;
                        if (irisVal == undefined || irisVal < 1365) {
                            irisVal = 1365;
                        }
                        irisVal = Math.floor((irisVal - 1365) / 2730 * 254);
                        if (irisVal >= 0) {
                            sliderIris.setPosition(irisVal, 254);
                            imageControlButton.setIrisValue(mapPtd.strIris);
                        } else {
                            imageControlButton.setIrisValue(NPTZ_WORDING.wID_0167);
                        }
                    } else {
                        imageControlButton.setIrisValue(NPTZ_WORDING.wID_0167);
                    }
                }
            }, 500);

            if (AutoIris == 1 || statusFlag != 1) {
                imageControlButton.setIrisValue(NPTZ_WORDING.wID_0167);
            }
            if (AutoFocus == 1 || statusFlag != 1) {
                zoomSpeedFocusCtrlButton.setFocusValue(NPTZ_WORDING.wID_0167);
            }
            if (statusFlag != 1) {
                zoomSpeedFocusCtrlButton.setZoomValue(NPTZ_WORDING.wID_0167);
            }
            setTimeout(function () {
                let lock = $('#power').prop("disabled");
                if (!lock) {
                    // setTimeout(function () {
                    //     setupIoaPresetPosition.setRadioPresetButtonGroupState(AutoFocus);
                    // }, 250);

                    let getFocus = reqCgiObj.getFocus;
                    if (getFocus == 1) {
                        AutoFocus = 1;
                        zoomSpeedFocusCtrlButton.FoucsStatusChageOn();
                    } else {
                        AutoFocus = 0;
                        zoomSpeedFocusCtrlButton.FoucsStatusChageOff();
                    }

                    zoomSpeedFocusCtrlButton.initControllerButtons1();

                    var DZoom = reqCgiObj.Dzoom;
                    var DExt = reqCgiObj.DExt;
                    if (DZoom == 1) {
                        zoomSpeedFocusCtrlButton.DZoomAndDextStatusChange(1);
                    } else if (DZoom == 0 && DExt == 0) {
                        zoomSpeedFocusCtrlButton.DZoomAndDextStatusChange(2);
                    } else if(DExt == 1){
                        zoomSpeedFocusCtrlButton.DZoomAndDextStatusChange(3);
                        $("#camera_ptz_d_zoom_label").html("D-Ext.(x1.4)");
                    } else if(DExt == 2){
                        zoomSpeedFocusCtrlButton.DZoomAndDextStatusChange(4);
                        $("#camera_ptz_d_zoom_label").html("D-Ext.(x2.0)");
                    } else {
                        //なし
                    }
                    var irisMode = reqCgiObj.getIris;
                    AutoIris = irisMode;

                    if (irisMode == 0 && statusFlag == 1) {
                        imageControlButton.irisAuto(0);
                    } else if (irisMode == 1) {
                        imageControlButton.irisAuto(1);
                    }

                }
            }, 50);
        }
    }

    function initTouchBtnStatus(){
        if(!$("#camera_controller_gui_ptz_main").is(":hidden")){
            btnObjectCommon[BTN_GET_PTZ].displayOn();
        }else if(!$("#camera_controller_gui_open_preset").is(":hidden")){
            btnObjectCommon[BTN_GET_PRESET].displayOn();
        }else if(!$("#camera_controller_gui_adjust_main")[0].hidden){
            btnObjectCommon[BTN_GET_IMAGE_ADJUST].displayOn();
        }
    }
    function getFocusGuideFromWebWoker() {
        if (worker) {
            worker.addEventListener("message", function (event) {
                if (event.data.focusGuideFlg) {
                    console.log(JSON.stringify(event.data));
                    var myImage;
                    var jqFrame = $(window.frames["mainViewHtml"].document).find('#WebVideo');
                    var frameHeight = jqFrame.height();
                    var frameWidth = jqFrame.width();
                    var imgWidth = 0;
                    var imgHeight = 0;
                    var status = event.data.status;
                    if (status == 'FE') {
                        jqFrame.children('.status').remove();
                        return
                    }
                    var statusPng = focusSize + '_focus'
                    if (status == 'FF') {
                        statusPng = focusSize + '_notmeasurable'
                    }
                    if (status < 0) {
                        statusPng = focusSize + '_back' + -Number(status)
                    } else if (status > 0) {
                        statusPng = focusSize + '_front' + Number(status)
                    }
                    jqFrame.children('.status').remove();
                    if (jqFrame.find('#' + statusPng).length == 0) {
                        myImage = new Image();
                        myImage.src = '/css/pc/parts/' + statusPng + '.png';
                        myImage.id = statusPng;
                        $(myImage).addClass('status');
                        jqFrame.append(myImage);
                    } else {
                        myImage = jqFrame.find('#' + statusPng)[0]
                    }
                    myImage.onload = function(){
                        imgWidth = myImage.width;
                        imgHeight = myImage.height
                        var positionArray = event.data.position;
                        var positionX = (positionArray[0] / 100) * frameWidth - imgWidth / 2;
                        var positionY = (positionArray[1] / 100) * frameHeight - imgHeight / 2;
                        $(myImage).css({ position: "absolute", top: positionY + "px", left: positionX + "px", zIndex: 1 });
                        $(myImage).mousedown(function(e){e.stopPropagation()})
                    } 
                } else if (event.data.focusGuideStartFlg) {
                    gBTN_FOCUS_GUIDE_status = event.data.focusGuideStart;
                    if (AutoFocus == 1) return
                    if ($(".btn_lock").hasClass("on") || $(".btn_lock").hasClass("on_hover")) return
                    if (gBTN_FOCUS_GUIDE_status == 1) {
                        zoomSpeedFocusCtrlButton.focusGuideToOn();
                    } else {
                        if (uHDCropMode != 0 || reqCgiObj.bar == 1 || AutoFocus == 1) {
                            zoomSpeedFocusCtrlButton.focusGuideToDisable();
                        } else {
                            zoomSpeedFocusCtrlButton.focusGuideToOff();
                        }
                    }

                }
            })
        }
    }
    /**********************************************lzp 20180410 end**********************************************/

    return {
        ZOOM_NONE: 0,
        ZOOM_W: 1,
        ZOOM_T: 2,
        gsVol: gsVol,

        build: function () {
            if (!buildFlag) {
                buildFlag = true;
                $("#camera_controller_gui_ptz_main").append($('<div id="camera_controller_gui_ptz_zoom"></div>'));
                $("#camera_controller_gui_ptz_main").append($('<div id="camera_controller_gui_ptz_speed"></div>'));
                $("#camera_controller_gui_ptz_main").append($('<div id="camera_controller_gui_ptz_focus"></div>'));
                $("#camera_controller_gui_ptz_zoom").append($("<div id='camera_ptz_zoom' class='camera_ptz_zoom'></div>"));
                $("#camera_controller_gui_ptz_speed").append($("<div id='camera_ptz_speed' class='camera_ptz_speed'></div>"));
                $("#camera_controller_gui_ptz_focus").append($("<div id='camera_ptz_focus' class='camera_ptz_focus'></div>"));

                $("#camera_controller_gui_adjust_main").append($('<div id="camera_controller_gui_adjust_iris"></div>'));
                $("#camera_controller_gui_adjust_main").append($('<div id="camera_controller_gui_adjust_gain"></div>'));
                $("#camera_controller_gui_adjust_main").append($('<div id="camera_controller_gui_adjust_wb"></div>'));
                $("#camera_controller_gui_adjust_main").append($('<div id="camera_controller_gui_adjust_shutter"></div>'));
                $("#camera_controller_gui_adjust_main").append($('<div id="camera_controller_gui_adjust_nd"></div>'));
                $("#camera_controller_gui_adjust_iris").append($("<div id='camera_adjust_iris' class='camera_adjust_iris'></div>"));
                $("#camera_controller_gui_adjust_gain").append($("<div id='camera_adjust_gain' class='camera_adjust_gain'></div>"));
                $("#camera_controller_gui_adjust_wb").append($("<div id='camera_adjust_wb' class='camera_adjust_wb'></div>"));
                $("#camera_controller_gui_adjust_shutter").append($("<div id='camera_adjust_shutter' class='camera_adjust_shutter'></div>"));
                $("#camera_controller_gui_adjust_nd").append($("<div id='camera_adjust_nd' class='camera_adjust_nd'></div>"));

                ptCtrlButton.build();
                zoomSpeedFocusCtrlButton.build();
                sliderZoom.build('zoom_slider_wrap', 'zoom_slider_handle', zoomCtrlCallback, "camera_controller_gui_ptz_zoom",999);
                sliderSpeed.build('speed_slider_wrap', 'speed_slider_handle', speedCtrlCallback, "camera_controller_gui_ptz_speed",100);
                sliderFocus.build('focus_slider_wrap', 'focus_slider_handle', focusCtrlCallback, "camera_controller_gui_ptz_focus",99);
                sliderIris.build('iris_slider_wrap', 'iris_slider_handle', irisCtrlCallback, "camera_controller_gui_adjust_iris",254);
                presetSetting.build();
                imageControlButton.build();
                presetSetting.updateStatus(true);

                // BTN_ENLARGE_PTZ
                btnObjectCommon[BTN_ENLARGE_PTZ] = ButtonCtrl('camera_controller_gui_ptz_main', 'btn_enlarge_ptz', "", callbackOpenPtz);
                // btn_open_preset
                btnObjectCommon[BTN_OPEN_PRESET] = ButtonCtrl('camera_controller_gui_preset_main', 'btn_enlarge_preset', "", callbackOpenPreset);
                // btn_open_image_adjust
                btnObjectCommon[BTN_OPEN_IMAGE_ADJUST] = ButtonCtrl('camera_controller_gui_adjust_main', 'btn_enlarge_image_adjust', "", callbackOpenImageAdjust);

                // btn_narrow_area
                btnObjectCommon[BTN_NARROW_AREA] = ButtonCtrl('camera_controller_gui_open_btn', 'btn_narrow_area', "", callbackNarrowArea);
                // btn_get_ptz
                btnObjectCommon[BTN_GET_PTZ] = ButtonCtrl('camera_controller_gui_open_btn2', 'btn_get_ptz', NPTZ_WORDING.wID_0409, callbackOpenPtz);
                // btn_get_preset
                btnObjectCommon[BTN_GET_PRESET] = ButtonCtrl('camera_controller_gui_open_btn2', 'btn_get_preset', NPTZ_WORDING.wID_0004, callbackOpenPreset);
                // btn_get_image_adjust
                btnObjectCommon[BTN_GET_IMAGE_ADJUST] = ButtonCtrl('camera_controller_gui_open_btn2', 'btn_get_image_adjust', NPTZ_WORDING.wID_0005, callbackOpenImageAdjust);

                // btn control ptz area and adjust area
                btnObjectCommon[BTN_PTZ_AREA_CTRL] = ButtonCtrl('camera_controller_gui_ptz_main', 'btn_ptz_area_ctrl', "", callbackPtzAreaCtrl);
                btnObjectCommon[BTN_PTZ_PRESET_CTRL] = ButtonCtrl('camera_controller_gui_preset_main', 'btn_ptz_preset_ctrl', "", callbackPtzPresetCtrl);
                btnObjectCommon[BTN_ADJUST_AREA_CTRL] = ButtonCtrl('camera_controller_gui_adjust_main', 'btn_adjust_area_ctrl', "", callbackAdjustAreaCtrl);


                // btn_nm
                btnObjectCommon[BTN_NM_PRESET] = MenuButtonCtrl('camera_controller_gui_th_btns', 'btn_nm_preset', NPTZ_WORDING.wID_0004, callbackOpenPreset_ppls, 1, MenuButtonType.TABLEFT);
                btnObjectCommon[BTN_NM_PTLS] = MenuButtonCtrl('camera_controller_gui_th_btns', 'btn_nm_ptls', NPTZ_WORDING.wID_0003, callbackOpenPtz_ppls,2,MenuButtonType.TABMIDDLE);
                btnObjectCommon[BTN_NM_SETTING] = MenuButtonCtrl('camera_controller_gui_th_btns', 'btn_nm_setting', NPTZ_WORDING.wID_0433, callbackOpenImageAdjust_ppls,3,MenuButtonType.TABRIGHT);

                //#8402
                btnObjectCommon[BTN_A_IRIS_WIN] = ButtonCtrl('camera_controller_gui_adjust_main', 'btn_a_iris_win', NPTZ_WORDING.wID_0915, zoomSpeedFocusCtrlButton.callbackAIrisWin);

                if(window.location.href.indexOf("live") !="-1"){
                    $('#camera_controller_gui').append($('<div id="base_main_controller">' + NPTZ_WORDING.wID_0036 + '</div>'));
                }
                if(typeof(worker)=="undefined")
                {
                    worker=new Worker("/js/pc/webWorker.js");
                    worker.onmessage=function(event){
                        if(event.data.postFlg && event.data.mapPtd){
                            reqPtdObj = event.data;
                        }else if(!event.data.postFlg && event.data.getIris != undefined){
                            reqCgiObj = event.data;
                        }
                        //document.getElementById("result").innerHTML=event.data;
                    };
                    getFocusGuideFromWebWoker();
                    // imageAdjustInstance.settingMatrix.getMatrixWebWorker();
                    // settingMatrix.getMatrixWebWorker();
                }
            } else {
                cameraID = null;
                setCamera(null);
            }
        },
        show: function (mode) {
            if (buildFlag) {
                ptCtrlButton.show();
                zoomSpeedFocusCtrlButton.show();
                sliderZoom.show();
                sliderSpeed.show();
                sliderFocus.show();
                sliderIris.show();
                settingIoaUhd.getSliderCropSpeed().show();
                settingIoaUhd.getSliderCropZoom().show();
                presetSetting.show();
                imageControlButton.show();
                $("#camera_ptz_title").text(NPTZ_WORDING.wID_0003);
                $("#camera_preset_title").text(NPTZ_WORDING.wID_0004);
                $("#camera_adjust_title").text(NPTZ_WORDING.wID_0005);
                $("#camera_ptz_zoom").text(NPTZ_WORDING.wID_0006);
                $("#camera_ptz_speed").text(NPTZ_WORDING.wID_0007);
                $("#camera_ptz_focus").text(NPTZ_WORDING.wID_0008);
                $("#camera_adjust_iris").text(NPTZ_WORDING.wID_0009);
                $("#camera_adjust_gain").text(NPTZ_WORDING.wID_0010);
                $("#camera_adjust_wb").text(NPTZ_WORDING.wID_0011);
                $("#camera_adjust_shutter").text(NPTZ_WORDING.wID_0012);
                $("#camera_adjust_nd").text(NPTZ_WORDING.wID_0013);
                $("#camera_presnt_1").text(NPTZ_WORDING.wID_0021);
                $("#camera_presnt_2").text(NPTZ_WORDING.wID_0022);
                $("#camera_presnt_3").text(NPTZ_WORDING.wID_0023);
                $("#camera_presnt_4").text(NPTZ_WORDING.wID_0024);
                $("#camera_presnt_5").text(NPTZ_WORDING.wID_0025);
                $("#camera_presnt_6").text(NPTZ_WORDING.wID_0026);
                $("#camera_presnt_7").text(NPTZ_WORDING.wID_0027);
                $("#camera_presnt_8").text(NPTZ_WORDING.wID_0028);
                $("#camera_presnt_9").text(NPTZ_WORDING.wID_0029);
                $("#camera_presnt1_1").text(NPTZ_WORDING.wID_0021);
                $("#camera_presnt1_2").text(NPTZ_WORDING.wID_0022);
                $("#camera_presnt1_3").text(NPTZ_WORDING.wID_0023);
                $("#camera_presnt1_4").text(NPTZ_WORDING.wID_0024);
                $("#camera_presnt1_5").text(NPTZ_WORDING.wID_0025);
                $("#camera_presnt1_6").text(NPTZ_WORDING.wID_0026);
                $("#camera_presnt1_7").text(NPTZ_WORDING.wID_0027);
                $("#camera_presnt1_8").text(NPTZ_WORDING.wID_0028);
                $("#camera_presnt1_9").text(NPTZ_WORDING.wID_0029);

                for (let btn in btnObjectCommon) {
                    btnObjectCommon[btn].show();
                    btnObjectCommon[btn].displayOff();
                }
                if (window.location.href.indexOf("admin") =="-1") {
                    //todo
                    if (adminPage) {
                        btnObjectCommon[BTN_ENLARGE_PTZ].hide();
                        btnObjectCommon[BTN_OPEN_PRESET].hide();
                        btnObjectCommon[BTN_OPEN_IMAGE_ADJUST].hide();
                        btnObjectCommon[BTN_NARROW_AREA].hide();
                    }
                }
                btnObjectCommon[BTN_NM_PRESET].displayOn();
                // 設定RedLine表示
                sliderSpeed.redrawSliderLevelColor(true);
                sliderZoom.redrawSliderLevelColor(true);
                sliderFocus.redrawSliderLevelColor(true);
                sliderIris.redrawSliderLevelColor(true);

                settingIoaUhd.getSliderCropSpeed().redrawSliderLevelColor(true);
                settingIoaUhd.getSliderCropZoom().redrawSliderLevelColor(true);
                if(gPower == 1){
                    startSetSliderValue();
                }
                sliderSpeed.setPosition(100);
                sliderSpeed.setValue(100);

                settingIoaUhd.getSliderCropSpeed().setPosition(100);
                settingIoaUhd.getSliderCropSpeed().setValue(100);
                settingIoaUhd.getSliderCropZoom().setPosition(100);
                settingIoaUhd.getSliderCropZoom().setValue(100);

                //#8402
                btnObjectCommon[BTN_A_IRIS_WIN].show();
            }
        },
        hide: function () {
        },
        getPtzAreaCtrlFlag:function() {
            return ptzAreaCtrlFlag;
        },
        updateStatus: updateStatus,

        getSliderZoom: function () {
            return sliderZoom.getValue();
        },

        setSliderZoomPosition: function (val) {
            sliderZoom.setPosition(val,999);
        },

        getSliderSpeed: function () {
            return sliderSpeed.getValue();
        },

        setSliderSpeedPosition: function (val) {
            sliderSpeed.setPosition(val,100)
        },

        getFocus: function () {
            return sliderFocus;
        },

        getSliderFocus: function () {
            return sliderFocus.getValue();
        },

        setSliderFocusPosition: function (val) {
            sliderFocus.setPosition(val,99)
        },

        getSliderIris: function () {
            return sliderIris.getValue();
        },

        setSliderIrisPosition: function (val) {
            sliderIris.setPosition(val,254)
        },

        getCameraId: function () {
            return cameraID;
        },
        getCameraIp: function () {
            return ipAddress;
        },
        getOperateCameraID: function () {
            return operateCameraID;
        },
        initControllerButtons: function (AutoIris, DigitalExt, AutoFocus, gFlgSlow, isUE70) {
            zoomSpeedFocusCtrlButton.initControllerButtons1(DigitalExt, AutoFocus, gFlgSlow);
            imageControlButton.initControllerButtons2(AutoIris);
            presetSetting.initControllerButtons3();
            if (!cparams.isUE70) {
                $(".btn_ptz_zoom_d_ext").hide();
            }
        },
        initControllerButtonsDisabled: function (isUE70) {
            zoomSpeedFocusCtrlButton.initControllerButtonsDisabled1();
            presetSetting.initControllerButtonsDisabled3();
            if (!cparams.isUE70) {
                $(".btn_zoom_d_ext").hide();
                $(".btn_zoom_d_ext_20").hide();
                $(".btn_ptz_zoom_d_ext").hide();
            }
        },
        controllerChangePresetNo: function (selectedIndex) {
            presetSetting.controllerChangePresetNo3(selectedIndex);
        },
        changeSlienceBtn: function (type) {
            imageControlButton.changeSlienceBtn(type);
        },
        disableFocusSlider: function () {
            sliderFocus.disable();
        },
        undisableFocusSlider: function () {
            sliderFocus.undisable();
        },
        disableIrisSlider: function () {
            sliderIris.disable();
        },
        undisableIrisSlider: function () {
            sliderIris.undisable();
        },
        disableZoomSlider: function () {
            sliderZoom.disable();
        },
        undisableZoomSlider: function () {
            sliderZoom.undisable();
        },
        zoomSpeedFocusCtrlButton: zoomSpeedFocusCtrlButton,
        imageControlButton: imageControlButton,
        StartWheelZoom: StartWheelZoom,
        soundSlider: soundSlider,
        SliderMove: SliderMove,
        SliderEnd: SliderEnd,
        VolMove: VolMove,
        InVolume: InVolume,
        showButtonByCtrl: function () {
            zoomSpeedFocusCtrlButton.showButtonByCtrl();
        },
        showPresetButton: function () {
            presetSetting.showPresetButton();
        },
        initPresetButton: function () {
            presetSetting.initPresetButton();
        },
        sliderSpeed: sliderSpeed,
        stopIntervalSetSlider:stopIntervalSetSlider,
        getSliderValues:getSliderValues,
        startSetSliderValue:startSetSliderValue,
        doClosePtzWindow:doClosePtzWindow,
        doCloseImageAdjustWindow:doCloseImageAdjustWindow,
        callbackNarrowArea:callbackNarrowArea,
        openPtz: openPtz,
        narrowArea: narrowArea,
        doOpenPtzWindow:doOpenPtzWindow,
        doClosePtzWindow:doClosePtzWindow,
        callbackOpenPreset:callbackOpenPreset,
        setTouchPTZTabOn: function () {
            btnObjectCommon[BTN_NM_PRESET].displayOn();
            btnObjectCommon[BTN_NM_PTLS].displayOff();
            btnObjectCommon[BTN_NM_SETTING].displayOff();
        },
        callbackOpenPreset_ppls:callbackOpenPreset_ppls,
        presetSetting:presetSetting,
        initTouchBtnStatus:initTouchBtnStatus,
        initAIrisWinBtnStatus: function(){
            if (zoomSpeedFocusCtrlButton.canUseIrisButton()) {
                if (document.getElementById('iris_setting_mask').style.display == "none") {
                    btnObjectCommon[BTN_A_IRIS_WIN].displayOff();
                } else {
                    btnObjectCommon[BTN_A_IRIS_WIN].displayOn();
                }
            } else {
                btnObjectCommon[BTN_A_IRIS_WIN].displayDisabled();
            }
        },
        getAIrosWinBtn: function(){
            return btnObjectCommon[BTN_A_IRIS_WIN];
        }
    };
}

/**
 * Pan・Tilt処理制御クラス
 * @class Pan,Tilt処理制御クラス
 * @return {function} build 構築処理
 * @return {function} show 表示処理
 * @return {function} hide 非表示処理
 * @return {function} updateStatus カメラ状態情報更新処理
 * @constructor
 */
function PtCtrlButton() {
    /**
     * Tilt・UPボタン　オブジェクト(インデックス値)
     * @type number
     */
    const BTN_CTRL_UP = 0;

    /**
     * Tilt・DOWNボタン　オブジェクト(インデックス値)
     * @type number
     */
    var BTN_CTRL_DOWN = 1;

    /**
     * Pan・LEFTボタン　オブジェクト(インデックス値)
     * @type number
     */
    var BTN_CTRL_LEFT = 2;

    /**
     * Pan・RIGHTボタン　オブジェクト(インデックス値)
     * @type number
     */
    var BTN_CTRL_RIGHT = 3;

    /**
     * Tilt・UPボタン　押下可能エリア(インデックス値)
     * @type number
     */
    var BTN_DISP_UP = 4;

    /**
     * Tilt・DOWNボタン　押下可能エリア(インデックス値)
     * @type number
     */
    var BTN_DISP_DOWN = 5;

    /**
     * Pan・LEFTボタンボタン 押下可能エリア(インデックス値)
     * @type number
     */
    var BTN_DISP_LEFT = 6;

    /**
     * Pan・RIGHTボタン 押下可能エリア(インデックス値)
     * @type number
     */
    var BTN_DISP_RIGHT = 7;

    /**
     * 左上ボタン　オブジェクト(インデックス値)
     * @type number
     */
    var BTN_CTRL_UP_LEFT = 8;

    /**
     * 左下ボタン　オブジェクト(インデックス値)
     * @type number
     */
    var BTN_CTRL_DOWN_LEFT = 9;

    /**
     * 右上ボタン　オブジェクト(インデックス値)
     * @type number
     */
    var BTN_CTRL_UP_RIGHT = 10;

    /**
     * 右下ボタン　オブジェクト(インデックス値)
     * @type number
     */
    var BTN_CTRL_DOWN_RIGHT = 11;

    /**
     * 左上ボタン　押下可能エリア(インデックス値)
     * @type number
     */
    var BTN_DISP_UP_LEFT = 12;

    /**
     * 左下ボタン　押下可能エリア(インデックス値)
     * @type number
     */
    var BTN_DISP_DOWN_LEFT = 13;

    /**
     * 右上ボタン 押下可能エリア(インデックス値)
     * @type number
     */
    var BTN_DISP_UP_RIGHT = 14;

    /**
     * 右下ボタン 押下可能エリア(インデックス値)
     * @type number
     */
    var BTN_DISP_DOWN_RIGHT = 15;
    /**
     * ボタンオブジェクト
     * @type ButtonCtrl[]
     */
    var btnObject = [];

    /**
     * 構築済みフラグ
     * @type boolean
     */
    var buildFlag = false;

    var pts = {
        PAN_LEFT_SPEED_MAX: 1,
        PAN_LEFT_SPEED_MIN: 49,
        PAN_SPEED_STOP: 50,
        PAN_RIGHT_SPEED_MIN: 51,
        PAN_RIGHT_SPEED_MAX: 99,
        TILT_DOWN_SPEED_MAX: 1,
        TILT_DOWN_SPEED_MIN: 49,
        TILT_SPEED_STOP: 50,
        TILT_UP_SPEED_MIN: 51,
        TILT_UP_SPEED_MAX: 99,
    };


    /**
     * Tilt・UPボタン押下時の画面制御
     * @param {number} mouse　マウス・ボタン操作状況
     */
    function callbackCtrlPtz(mouse, param) {
        callbackCtrlBase(param[0], param[1], mouse);
    }

    function getSpeedPosition(val) {
        val = val > 98 ? 98 : val;
        val = val < 2 ? 2 : val;

        const t = Math.round(val / 2);
        return t;
    }

    /**
     * Pan・Tilt共通ボタン押下時の画面制御
     * @param {number} btnNo　ボタン番号(インデックス値)
     * @param {number} control　Pan・Tilt制御パラメータ
     * @param {number} mouse　マウス・ボタン操作状況
     */
    function callbackCtrlBase(btnNo, control, mouse) {
        // 無効時は何もしない。
        if (btnObject[btnNo].getStatus() == Button.STATUS_DISABLED) {
            return;
        }

        if (mouse == Button.MOUSE_DOWN) {
            pcOperationFlag = true;
            window.frames["mainViewHtml"].mainViewOperationFlag=true;
            btnObject[btnNo].displayOn();
            StartPanTilt(ptcObject[control], event);
            var val = cameraControllerSetting.getSliderSpeed();
            val = getSpeedPosition(val);
            ptCtrl(control, val);
        } else if (mouse == Button.MOUSE_UP) {
            pcOperationFlag = false;
            window.frames["mainViewHtml"].mainViewOperationFlag=false;
            btnObject[btnNo].displayOff();
            StopPanTilt(event);
        } else if (mouse == Button.MOUSE_OVER) {
            btnObject[btnNo].displayOff();
        } else if (mouse == Button.MOUSE_OUT) {
            if (btnObject[btnNo].getStatus() == Button.STATUS_ON) {

                StopPanTilt(event);
            }
            btnObject[btnNo].displayOff();
        } else {
            // 処理なし
        }
    }

    function ptCtrl(control, position) {

        var cmd = new Object();

        switch (control) {
            case PTC_STOP: // 停止
                cmd.pan = pts.PAN_SPEED_STOP;
                cmd.tilt = pts.TILT_SPEED_STOP;
                break;
            case PTC_UP: // 上
                cmd.pan = pts.PAN_SPEED_STOP;
                cmd.tilt = pts.TILT_SPEED_STOP + position;
                if (cmd.tilt > pts.TILT_UP_SPEED_MAX) {
                    cmd.tilt = pts.TILT_UP_SPEED_MAX;
                }
                break;
            case PTC_DOWN: // 下
                cmd.pan = pts.PAN_SPEED_STOP;
                cmd.tilt = pts.TILT_SPEED_STOP - position;
                if (cmd.tilt < pts.TILT_DOWN_SPEED_MAX) {
                    cmd.tilt = pts.TILT_DOWN_SPEED_MAX;
                }
                break;
            case PTC_LEFT: // 左
                cmd.pan = pts.PAN_SPEED_STOP - position;
                if (cmd.pan < pts.PAN_LEFT_SPEED_MAX) {
                    cmd.pan = pts.PAN_LEFT_SPEED_MAX;
                }
                cmd.tilt = pts.TILT_SPEED_STOP;
                break;
            case PTC_RIGHT: // 右
                cmd.pan = pts.PAN_SPEED_STOP + position;
                if (cmd.pan > pts.PAN_RIGHT_SPEED_MAX) {
                    cmd.pan = pts.PAN_RIGHT_SPEED_MAX;
                }
                cmd.tilt = pts.TILT_SPEED_STOP;
                break;
            case PTC_UP_LEFT: // 左上
                cmd.tilt = pts.TILT_SPEED_STOP + position;
                if (cmd.tilt > pts.TILT_UP_SPEED_MAX) {
                    cmd.tilt = pts.TILT_UP_SPEED_MAX;
                }
                cmd.pan = pts.PAN_SPEED_STOP - position;
                if (cmd.pan < pts.PAN_LEFT_SPEED_MAX) {
                    cmd.pan = pts.PAN_LEFT_SPEED_MAX;
                }
                break;
            case PTC_DOWN_LEFT: // 左下
                cmd.tilt = pts.TILT_SPEED_STOP - position;
                if (cmd.tilt < pts.TILT_DOWN_SPEED_MAX) {
                    cmd.tilt = pts.TILT_DOWN_SPEED_MAX;
                }
                cmd.pan = pts.PAN_SPEED_STOP - position;
                if (cmd.pan < pts.PAN_LEFT_SPEED_MAX) {
                    cmd.pan = pts.PAN_LEFT_SPEED_MAX;
                }
                break;
            case PTC_UP_RIGHT: // 右上
                cmd.tilt = pts.TILT_SPEED_STOP + position;
                if (cmd.tilt > pts.TILT_UP_SPEED_MAX) {
                    cmd.tilt = pts.TILT_UP_SPEED_MAX;
                }
                cmd.pan = pts.PAN_SPEED_STOP + position;
                if (cmd.pan > pts.PAN_RIGHT_SPEED_MAX) {
                    cmd.pan = pts.PAN_RIGHT_SPEED_MAX;
                }
                break;
            case PTC_DOWN_RIGHT: // 右下
                cmd.tilt = pts.TILT_SPEED_STOP - position;
                if (cmd.tilt < pts.TILT_DOWN_SPEED_MAX) {
                    cmd.tilt = pts.TILT_DOWN_SPEED_MAX;
                }
                cmd.pan = pts.PAN_SPEED_STOP + position;
                if (cmd.pan > pts.PAN_RIGHT_SPEED_MAX) {
                    cmd.pan = pts.PAN_RIGHT_SPEED_MAX;
                }
                break;
            default:
                break;

        }
        cparam_set_panTiltSpeedControl(cmd.pan, cmd.tilt);
    }

    /**
     * button control start : direction
     * @param sType
     * @param evt
     * @constructor
     */
    function StartPanTilt(sType, evt) {
        if (gFlgDisableCamCtrl == true) {
            return;
        }
        if (window.event) {
            evt = window.event;
        }
        for (var i = 0; i < gsPanTiltType.length; i++) {
            if (sType == gsPanTiltType[i]) {
                break;
            }
        }
        if (i < gsPanTiltType.length) {
            if (i > 0) {
                if (gFlgSlow) {
                    cparam_set_panTiltSpeedControl(gsPanTiltSpeedSlow[i].substring(0,2), gsPanTiltSpeedSlow[i].substring(2, 4));
                } else {
                    cparam_set_panTiltSpeedControl(gsPanTiltSpeed[i].substring(0,2), gsPanTiltSpeed[i].substring(2, 4));
                }
            } else {  // stop
                cparam_set_panTiltSpeedControl(50, 50);
            }
        } else {
            // DO NOTHING
        }
    }

    /**
     * button control stop : direction
     * @param evt
     * @constructor
     */
    function StopPanTilt(evt) {
        cparam_set_panTiltSpeedControl(50, 50);
    }

    /**
     * PT制御ボタン構築処理
     */
    function build() {
        if (buildFlag == false) {
            buildFlag = true;
            // Pan/Tilt Control UP
            btnObject[BTN_CTRL_UP] = ButtonCtrl('camera_controller_gui_ptz', 'btn_pt_disp_up', "", callbackCtrlPtz, new Array(BTN_CTRL_UP, PTC_UP));
            // Pan/Tilt Control DOWN
            btnObject[BTN_CTRL_DOWN] = ButtonCtrl('camera_controller_gui_ptz', 'btn_pt_disp_down', "", callbackCtrlPtz, new Array(BTN_CTRL_DOWN, PTC_DOWN));
            // Pan/Tilt Control LEFT
            btnObject[BTN_CTRL_LEFT] = ButtonCtrl('camera_controller_gui_ptz', 'btn_pt_disp_left', "", callbackCtrlPtz, new Array(BTN_CTRL_LEFT, PTC_LEFT));
            // Pan/Tilt Control RIGHT
            btnObject[BTN_CTRL_RIGHT] = ButtonCtrl('camera_controller_gui_ptz', 'btn_pt_disp_right', "", callbackCtrlPtz, new Array(BTN_CTRL_RIGHT, PTC_RIGHT));

            // Pan/Tilt Control 左上
            btnObject[BTN_CTRL_UP_LEFT] = ButtonCtrl('camera_controller_gui_ptz', 'btn_pt_disp_up_left', "", callbackCtrlPtz, new Array(BTN_CTRL_UP_LEFT, PTC_UP_LEFT));
            // Pan/Tilt Control 左下
            btnObject[BTN_CTRL_DOWN_LEFT] = ButtonCtrl('camera_controller_gui_ptz', 'btn_pt_disp_down_left', "", callbackCtrlPtz, new Array(BTN_CTRL_DOWN_LEFT, PTC_DOWN_LEFT));
            // Pan/Tilt Control 右上
            btnObject[BTN_CTRL_UP_RIGHT] = ButtonCtrl('camera_controller_gui_ptz', 'btn_pt_disp_up_right', "", callbackCtrlPtz, new Array(BTN_CTRL_UP_RIGHT, PTC_UP_RIGHT));
            // Pan/Tilt Control 右下
            btnObject[BTN_CTRL_DOWN_RIGHT] = ButtonCtrl('camera_controller_gui_ptz', 'btn_pt_disp_down_right', "", callbackCtrlPtz, new Array(BTN_CTRL_DOWN_RIGHT, PTC_DOWN_RIGHT));
        }
    }

    /**
     * カメラ状態情報更新処理<br>
     * 更新されたカメラ状態情報に応じてPan・Tilt各種ボタンの押下可否判定を行う
     * @param {object} status カメラ状態更新処理
     */
    function updateStatus(status) {
        if (status == 0) {
            for (var btn in btnObject) {
                btnObject[btn].displayDisabled();
            }
        } else {
            for (var btn in btnObject) {
                btnObject[btn].displayOff();
            }
        }
    }

    /**
     * open the small window : PTZ
     */
    function changePtzElementToWindow() {
        $(".btn_pt_disp_up").removeClass("btn_pt_disp_up").addClass("btn_pt_win_disp_up");
        $(".btn_pt_up").removeClass("btn_pt_up").addClass("btn_pt_win_up");
        $(".btn_pt_disp_down").removeClass("btn_pt_disp_down").addClass("btn_pt_win_disp_down");
        $(".btn_pt_down").removeClass("btn_pt_down").addClass("btn_pt_win_down");
        $(".btn_pt_disp_left").removeClass("btn_pt_disp_left").addClass("btn_pt_win_disp_left");
        $(".btn_pt_left").removeClass("btn_pt_left").addClass("btn_pt_win_left");
        $(".btn_pt_disp_right").removeClass("btn_pt_disp_right").addClass("btn_pt_win_disp_right");
        $(".btn_pt_right").removeClass("btn_pt_right").addClass("btn_pt_win_right");
        $(".btn_pt_disp_up_left").removeClass("btn_pt_disp_up_left").addClass("btn_pt_win_disp_up_left");
        $(".btn_pt_up_left").removeClass("btn_pt_up_left").addClass("btn_pt_win_up_left");
        $(".btn_pt_disp_down_left").removeClass("btn_pt_disp_down_left").addClass("btn_pt_win_disp_down_left");
        $(".btn_pt_down_left").removeClass("btn_pt_down_left").addClass("btn_pt_win_down_left");
        $(".btn_pt_disp_up_right").removeClass("btn_pt_disp_up_right").addClass("btn_pt_win_disp_up_right");
        $(".btn_pt_up_right").removeClass("btn_pt_up_right").addClass("btn_pt_win_up_right");
        $(".btn_pt_disp_down_right").removeClass("btn_pt_disp_down_right").addClass("btn_pt_win_disp_down_right");
        $(".btn_pt_down_right").removeClass("btn_pt_down_right").addClass("btn_pt_win_down_right");
    }

    /**
     * close the small window : PTZ
     */
    function changePtzElementToMain() {
        $(".btn_pt_win_disp_up").removeClass("btn_pt_win_disp_up").addClass("btn_pt_disp_up");
        $(".btn_pt_win_up").removeClass("btn_pt_win_up").addClass("btn_pt_up");
        $(".btn_pt_win_disp_down").removeClass("btn_pt_win_disp_down").addClass("btn_pt_disp_down");
        $(".btn_pt_win_down").removeClass("btn_pt_win_down").addClass("btn_pt_down");
        $(".btn_pt_win_disp_left").removeClass("btn_pt_win_disp_left").addClass("btn_pt_disp_left");
        $(".btn_pt_win_left").removeClass("btn_pt_win_left").addClass("btn_pt_left");
        $(".btn_pt_win_disp_right").removeClass("btn_pt_win_disp_right").addClass("btn_pt_disp_right");
        $(".btn_pt_win_right").removeClass("btn_pt_win_right").addClass("btn_pt_right");
        $(".btn_pt_win_disp_up_left").removeClass("btn_pt_win_disp_up_left").addClass("btn_pt_disp_up_left");
        $(".btn_pt_win_up_left").removeClass("btn_pt_win_up_left").addClass("btn_pt_up_left");
        $(".btn_pt_win_disp_down_left").removeClass("btn_pt_win_disp_down_left").addClass("btn_pt_disp_down_left");
        $(".btn_pt_win_down_left").removeClass("btn_pt_win_down_left").addClass("btn_pt_down_left");
        $(".btn_pt_win_disp_up_right").removeClass("btn_pt_win_disp_up_right").addClass("btn_pt_disp_up_right");
        $(".btn_pt_win_up_right").removeClass("btn_pt_win_up_right").addClass("btn_pt_up_right");
        $(".btn_pt_win_disp_down_right").removeClass("btn_pt_win_disp_down_right").addClass("btn_pt_disp_down_right");
        $(".btn_pt_win_down_right").removeClass("btn_pt_win_down_right").addClass("btn_pt_down_right");
    }

    return {
        build: build,

        show: function () {
            for (var btn in btnObject) {
                btnObject[btn].show();
            }
        },

        hide: function () {
            for (var btn in btnObject) {
                btnObject[btn].hide();
            }
        },
        updateStatus: updateStatus,
        changePtzElementToWindow: changePtzElementToWindow,
        changePtzElementToMain: changePtzElementToMain
    };
}

/**
 * Zoom・Speed・Focusボタン制御クラス
 * @class　Zoom・Speed・Focusボタン制御クラス
 * @return {function} build 構築処理
 * @return {function} show　表示処理
 * @return {function} hide　非表示処理
 * @return {function} updateStatus　カメラ状態情報更新処理
 * @constructor
 */
function ZoomSpeedFocusCtrlButton() {
    /**
     * 「T」ボタンオブジェクト(インデックス値)
     * @type number
     */
    var BTN_ZOOM_TELE = 0;

    /**
     * 「W」ボタンオブジェクト(インデックス値)
     * @type number
     */
    var BTN_ZOOM_WIDE = 1;

    /**
     * 「Fast」ボタンオブジェクト(インデックス値)
     * @type number
     */
    var BTN_SPEED_FAST = 2;

    /**
     * 「Slow」ボタンオブジェクト(インデックス値)
     * @type number
     */
    var BTN_SPEED_SLOW = 3;

    /**
     * 「Far」ボタンオブジェクト(インデックス値)
     * @type number
     */
    var BTN_FOCUS_FAR = 4;

    /**
     * 「Near」ボタンオブジェクト(インデックス値)
     * @type number
     */
    var BTN_FOCUS_NEAR = 5;

    /**
     * 「Auto」ボタンオブジェクト(インデックス値)
     * @type {number}
     */
    var BTN_FOCUS_AUTO = 6;

    /**
     * 「Auto」ボタンオブジェクト(インデックス値)
     * @type {number}
     */
    var BTN_ZOOM_D_EXT = 7;

    /**
     * 「Auto」ボタンオブジェクト(インデックス値)
     * @type {number}
     */
    var BTN_ZOOM_X1 = 8;

    /**
     * 「Auto」ボタンオブジェクト(インデックス値)
     * @type {number}
     */
    var BTN_FOCUS_OTAF = 9;

    /**
     * 「Auto」ボタンオブジェクト(インデックス値)
     * @type {number}
     */
    var BTN_ZOOM_D_ZOOM = 10;
    /**
     * 「Auto」ボタンオブジェクト(インデックス値)
     * @type {number}
     */
    var BTN_TOUCH_F = 11;
    /**
     * 「Auto」ボタンオブジェクト(インデックス値)
     * @type {number}
     */
    var BTN_FOCUS_GUIDE = 12

    /**
     * 「Auto」ボタンオブジェクト(インデックス値)
     * @type {number}
     */
    var BTN_ZOOM_D_EXT_X_1_4 = 13;

    /**
     * 「Auto」ボタンオブジェクト(インデックス値)
     * @type {number}
     */
    var BTN_ZOOM_D_EXT_X_2_0 = 14;

    /**
     * 「Auto」ボタンオブジェクト(インデックス値)
     * @type {number}
     */
    var BTN_A_IRIS_WIN = 15;

    /**
     * ボタンオブジェクト
     * @type ButtonCtrl[]
     */
    var btnObject = [];

    /**
     * 構築済みフラグ
     * @type boolean
     */
    var buildFlag = false;

    /**
     * ボタンオブジェクト(インデックス値)
     * @type {number}
     */
    var TXT_CAMERA_ZOOM = 0;

    /**
     * ボタンオブジェクト(インデックス値)
     * @type {number}
     */
    var TXT_CAMERA_FOCUS = 1;

    /**
     * テキストオブジェクト
     * @type {Array}
     */
    var txtObject = [];

    /**
     * ZOOMタイマーインターバル
     * @type setInterval
     */
    var intervalIDZoom = null;

    /**
     * SPEEDタイマーインターバル
     * @type setInterval
     */
    var intervalIDSpeed = null;

    /**
     * FOCUSタイマーインターバル
     */
    var intervalIDFocus = null;

    /**
     * AUTO
     * @type AUTO
     */
    var AUTO = 1;

    /**
     * MANUAL
     * @type MANUAL
     */
    var MANUAL = 0;

    /**
     * ZOOM button
     * @type object
     */
    var zoomObject = [];
    zoomObject[BTN_ZOOM_WIDE] = 'down';
    zoomObject[BTN_ZOOM_TELE] = 'up';

    /**
     * FOCUS button
     * @type object
     */
    var focusObject = [];
    focusObject[BTN_FOCUS_FAR] = 'far';
    focusObject[BTN_FOCUS_NEAR] = 'near';

    /**
     * 「TELE」ボタン押下時の処理
     * @param {number} mouse マウス・ボタン操作状況
     */
    function callbackZoomTele(mouse) {
        if (mouse == Button.MOUSE_DOWN) {
            setTimeout(function(){
                silderMouseDownFlag = true;
                btnObject[BTN_ZOOM_TELE].displayOn();
                if (intervalIDZoom != null) {
                    clearInterval(intervalIDZoom);
                }
                StartZoom(zoomObject[BTN_ZOOM_TELE], event); //old
                // ボタン押下中は20msecの周期でzoomTeleを実行する。
                intervalIDZoom = setInterval(function () {
                    zoomTele();
                }, 20);
            },100);
        } else if ((mouse == Button.MOUSE_UP) || (mouse == Button.MOUSE_OUT)) {
            setTimeout(function(){
                // ON時であれば、Zoom処理の停止0
                clearInterval(intervalIDZoom);
                intervalIDZoom = null;
                if(silderMouseDownFlag){
                    StopZoom(event); //old
                }
                if (btnObject[BTN_ZOOM_TELE].getStatus() == Button.STATUS_ON) {

                    btnObject[BTN_ZOOM_TELE].displayOff();
                } else if (btnObject[BTN_ZOOM_TELE].getStatus() != Button.STATUS_DISABLED) {
                    btnObject[BTN_ZOOM_TELE].displayOff();
                }
                silderMouseDownFlag = false;
                silderMouseUpOverSleepTime = 1;
            },200)
        } else {
            // 処理なし
        }
    }

    function StartZoom(sType, evt) {
        if (gFlgDisableCamCtrl == true) {
            return;
        }
        if (window.event) {
            evt = window.event;
        }
        if (( sType == 'down' ) || ( sType == 'up' )) {
            var val = cameraControllerSetting.getSliderSpeed();
            val = val > 98 ? 98 : val;
            val = val < 2 ? 2 : val;

            var tFast = Math.round(val / 2) + 50;
            var tSlow = 50 - Math.round(val / 2);


            if (sType == 'down') {
                sComm = tSlow < 10 ? '0' + tSlow : tSlow;
            } else {  // 'up'
                sComm = tFast;
            }
        } else {  // 'stop'
            sComm = 50;
        }
        cparam_set_zoomSpeed(sComm);
    }

    function StopZoom(evt) {
        cparam_set_zoomSpeed(50);
    }

    /**
     * 「WIDE」ボタン押下時の処理
     * @param {number} mouse マウス・ボタン操作状況
     */
    function callbackZoomWide(mouse) {
        if (mouse == Button.MOUSE_DOWN) {
            setTimeout(function(){
                btnObject[BTN_ZOOM_WIDE].displayOn();
                if (intervalIDZoom != null) {
                    clearInterval(intervalIDZoom);
                }
                StartZoom(zoomObject[BTN_ZOOM_WIDE], event);
                // ボタン押下中は20msecの周期でzoomWideを実行する。
                intervalIDZoom = setInterval(function () {
                    zoomWide()
                }, 100);
            },500);

        } else if ((mouse == Button.MOUSE_UP) || (mouse == Button.MOUSE_OUT)) {
            setTimeout(function(){
                if(intervalIDZoom!=null){
                    clearInterval(intervalIDZoom);
                    intervalIDZoom = null;
                    StopZoom(event); //old
                }

                if (btnObject[BTN_ZOOM_WIDE].getStatus() == Button.STATUS_ON) {
                    btnObject[BTN_ZOOM_WIDE].displayOff();
                } else if (btnObject[BTN_ZOOM_WIDE].getStatus() != Button.STATUS_DISABLED) {
                    btnObject[BTN_ZOOM_WIDE].displayOff();
                }
            },700);

        } else {
            // 処理なし
        }
    }

    /**
     * zoom 拡大処理 (+1)
     */
    function zoomTele() {
        var zoomVal = reqPtdObj.mapPtv.zoom;
        if(zoomVal == undefined || zoomVal < 1365){
            zoomVal = 1365;
        }
        zoomVal = Math.floor((zoomVal-1365)/2730*999);
        cameraControllerSetting.setSliderZoomPosition(zoomVal);
    }

    /**
     * zoom 縮小処理 (-1)
     */
    function zoomWide() {
        var zoomVal = reqPtdObj.mapPtv.zoom;
        if(zoomVal == undefined || zoomVal < 1365){
            zoomVal = 1365;
        }
        zoomVal = Math.floor((zoomVal-1365)/2730*999);
        cameraControllerSetting.setSliderZoomPosition(zoomVal);
    }

    /**
     * 「FAST」ボタン押下時の画面制御
     * @param {number} mouse マウス・ボタン操作状況
     */
    function callbackSpeedFast(mouse) {
        if (mouse == Button.MOUSE_DOWN) {
            btnObject[BTN_SPEED_FAST].displayOn();
            if (intervalIDSpeed != null) {
                clearInterval(intervalIDSpeed);
            }
            // ボタン押下中は20msecの周期でspeedFastを実行する。
            intervalIDSpeed = setInterval(function () {
                speedFast()
            }, 20);
        } else if ((mouse == Button.MOUSE_UP) || (mouse == Button.MOUSE_OUT)) {
            if (btnObject[BTN_SPEED_FAST].getStatus() != Button.STATUS_DISABLED) {
                clearInterval(intervalIDSpeed);
                intervalIDSpeed = null;
                btnObject[BTN_SPEED_FAST].displayOff();
            }
        } else {
            // 処理なし
        }
    }

    /**
     * 「SLOW」ボタン押下時の画面制御
     * @param {number} mouse マウス・ボタン操作状況
     */
    function callbackSpeedSlow(mouse) {
        if (mouse == Button.MOUSE_DOWN) {
            btnObject[BTN_SPEED_SLOW].displayOn();
            if (intervalIDSpeed != null) {
                clearInterval(intervalIDSpeed);
            }
            // ボタン押下中は20msecの周期でspeedFastを実行する。
            intervalIDSpeed = setInterval(function () {
                speedSlow()
            }, 20);
        } else if ((mouse == Button.MOUSE_UP) || (mouse == Button.MOUSE_OUT)) {
            if (btnObject[BTN_SPEED_SLOW].getStatus() != Button.STATUS_DISABLED) {
                clearInterval(intervalIDSpeed);
                intervalIDSpeed = null;
                btnObject[BTN_SPEED_SLOW].displayOff();
            }
        } else {
            // 処理なし
        }
    }

    /**
     * speed アップ処理 (+1)
     */
    function speedFast() {
        var val = cameraControllerSetting.getSliderSpeed();
        if (val < 99) {
            cameraControllerSetting.setSliderSpeedPosition(val + 1);
        }
    }


    /**
     * speed ダウン処理 (-1)
     */
    function speedSlow() {
        var val = cameraControllerSetting.getSliderSpeed();
        if (val > 1) {
            cameraControllerSetting.setSliderSpeedPosition(val - 1);
        }
    }

    /**
     * 「Far」ボタン押下時の画面制御
     * @param {number} mouse マウス・ボタン操作状況
     */
    function callbackFocusFar(mouse) {
        if (mouse == Button.MOUSE_DOWN) {

            setTimeout(function(){
                btnObject[BTN_FOCUS_FAR].displayOn();
                if (intervalIDFocus != null) {
                    clearInterval(intervalIDFocus);
                }

                StartFocus(focusObject[BTN_FOCUS_FAR], event);

                // ボタン押下中は20msecの周期でzoomTeleを実行する。
                intervalIDFocus = setInterval(function () {
                    focusFar();
                }, 20);
            },100);
        } else if ((mouse == Button.MOUSE_UP) || (mouse == Button.MOUSE_OUT)) {
            setTimeout(function(){
                clearInterval(intervalIDFocus);
                intervalIDFocus = null;
                StopFocus(event);
                if (btnObject[BTN_FOCUS_FAR].getStatus() == Button.STATUS_ON) {
                    btnObject[BTN_FOCUS_FAR].displayOff();
                } else if (btnObject[BTN_FOCUS_FAR].getStatus() != Button.STATUS_DISABLED) {
                    btnObject[BTN_FOCUS_FAR].displayOff();
                }
            },200);
        } else {
            // 処理なし
        }
    }

    /**
     * start to control focus
     * @param sType
     * @param evt
     * @constructor
     */
    function StartFocus(sType, evt) {
        if ((gFlgDisableCamCtrl == true) || (AutoFocus == 1)) {
            return;
        }
        if (window.event) {
            evt = window.event;
        }
        if (( sType == 'near' ) || ( sType == 'far' )) {
            var val = cameraControllerSetting.getSliderSpeed();
            val = val > 98 ? 98 : val;
            val = val < 2 ? 2 : val;

            var tFast = Math.round(val / 2) + 50;
            var tSlow = 50 - Math.round(val / 2);

            if (sType == 'near') {
                sComm = tSlow < 10 ? '0' + tSlow : tSlow;

            } else {  // 'far'
                sComm = tFast;
            }
        } else {  // 'stop'
            sComm = 50;

        }
        cparam_set_focusSpeed(sComm);
    }

    /**
     * stop to control focus
     * @param evt
     * @constructor
     */
    function StopFocus(evt) {
        cparam_set_focusSpeed(50);
    }

    /**
     * 「Near」ボタン押下時の画面制御
     * @param {number} mouse マウス・ボタン操作状況
     */
    function callbackFocusNear(mouse) {
        if (mouse == Button.MOUSE_DOWN) {
            btnObject[BTN_FOCUS_NEAR].displayOn();
            if (intervalIDFocus != null) {
                clearInterval(intervalIDFocus);
            }
            StartFocus(focusObject[BTN_FOCUS_NEAR], event);
            // ボタン押下中は20msecの周期でzoomWideを実行する。
            intervalIDFocus = setInterval(function () {
                focusNear();
            }, 20);
        } else if ((mouse == Button.MOUSE_UP) || (mouse == Button.MOUSE_OUT)) {
            clearInterval(intervalIDFocus);
            intervalIDFocus = null;
            StopFocus(event);
            if (btnObject[BTN_FOCUS_NEAR].getStatus() == Button.STATUS_ON) {

                btnObject[BTN_FOCUS_NEAR].displayOff();
            } else if (btnObject[BTN_FOCUS_NEAR].getStatus() != Button.STATUS_DISABLED) {
                btnObject[BTN_FOCUS_NEAR].displayOff();
            }
        } else {
            // 処理なし
        }
    }

    /**
     *「Auto」ボタン押下時の画面制御
     * @param mouse
     */
    function callbackFocusAuto(mouse) {
        if (mouse == Button.MOUSE_DOWN) {
            if (btnObject[BTN_FOCUS_AUTO].getStatus() != Button.STATUS_ON) {
                reqCgiObj.getFocus = 1;
                console.log(reqCgiObj.getFocus+"callbackFocusAuto" )
                btnObject[BTN_FOCUS_AUTO].displayOn();
                btnObject[BTN_FOCUS_FAR].displayDisabled();
                btnObject[BTN_FOCUS_NEAR].displayDisabled();
                btnObject[BTN_FOCUS_OTAF].displayDisabled();
                btnObject[BTN_TOUCH_F].displayDisabled();
                btnObject[BTN_A_IRIS_WIN].displayDisabled();

                // btnObject[BTN_FOCUS_GUIDE].displayDisabled();
	        	if(ptzAreaCtrlFlag == true) {  //+
	                if (gBTN_TOUCH_F_status == 1) {
	                    $("#camera_ptz_touch_label").hide();
	                }
	        	}
	            if ($('.focus_slider_wrap_now_level')) {
	              $('.focus_slider_wrap_now_level').removeClass('on');
	            }
	            SetFocusAuto(parseInt(AUTO));
	            focusAuto(AUTO);
            } else {
                reqCgiObj.getFocus = 0;
                btnObject[BTN_FOCUS_OTAF].displayOff();
                btnObject[BTN_FOCUS_AUTO].displayOff();
                btnObject[BTN_FOCUS_FAR].displayOff();
                btnObject[BTN_FOCUS_NEAR].displayOff();
                // btnObject[BTN_FOCUS_GUIDE].displayOff();
				if (cparam_get_UHDCrop() == 0 && cparam_get_bar() == 0) {
	                if (gBTN_TOUCH_F_status == 1) {
		                if(ptzAreaCtrlFlag == true) {
		                    if(Platform.isTouchMode()){
		                        $("#camera_ptz_touch_label").hide();
		                    }else {
		                        $("#camera_ptz_touch_label").show();
		                    }
		                }
		                btnObject[BTN_TOUCH_F].displayOn();
		            } else {
		                btnObject[BTN_TOUCH_F].displayOff();
		            }
				}
                if ($('.focus_slider_wrap_now_level')) {
                    $('.focus_slider_wrap_now_level').addClass('on');
                }
                SetFocusAuto(parseInt(MANUAL));
                focusAuto(MANUAL);
            }
        } else {
            // 処理なし
        }
    }



    /**
     * send auto focus commend
     * @param AutoFocus
     * @constructor
     */
    function SetFocusAuto(AutoF) {
        if (AutoF == 1) {
            reqCgiObj.getFocus = 1;
            cparam_set_focusMode(1);
            AutoFocus = 1;
        } else {
            reqCgiObj.getFocus = 0;
            cparam_set_focusMode(0);
            AutoFocus = 0;
        }
    }

    /**
     *「D-Ext1.4.」ボタン押下時の画面制御
     * @param mouse
     */
    function callbackZoomDExt(mouse) {
        if (mouse == Button.MOUSE_DOWN) {
            if (btnObject[BTN_ZOOM_D_EXT_X_1_4].getStatus() != Button.STATUS_ON) {
                reqCgiObj.DExt = 1;
                cparam_set_digital14_20ExtenderOffOn(1);
                d_ExtbtnOn();
                DigitalExt = 1;
                $("#camera_ptz_d_zoom_label").empty();
                $("#camera_ptz_d_zoom_label").html("D-Ext.(x1.4)");

            } else {
                reqCgiObj.DExt = 0;
                $("#camera_ptz_d_zoom_label").empty();
                cparam_set_digital14_20ExtenderOffOn(0);
                d_ExtbtnOff();
                DigitalExt = 0;
            }
        } else {
            // 処理なし
        }
    }

    /**
     *「D-Ext2.0.」ボタン押下時の画面制御
     * @param mouse
     */
    function callbackZoomDExt_20(mouse) {
        if (mouse == Button.MOUSE_DOWN) {
            if (btnObject[BTN_ZOOM_D_EXT_X_2_0].getStatus() != Button.STATUS_ON) {
                reqCgiObj.DExt = 2;
                cparam_set_digital14_20ExtenderOffOn(2);
                d_ExtbtnOn_20();
                DigitalExt = 2;
                $("#camera_ptz_d_zoom_label").empty();
                $("#camera_ptz_d_zoom_label").html("D-Ext.(x2.0)");

            } else {
                reqCgiObj.DExt = 0;
                $("#camera_ptz_d_zoom_label").empty();
                cparam_set_digital14_20ExtenderOffOn(0);
                d_ExtbtnOff_20();
                DigitalExt = 0;
            }
        } else {
            // 処理なし
        }
    }

    /**
     *「×1.0」ボタン押下時の画面制御
     * @param mouse
     */
    function callbackBtnZoomX1(mouse) {
        if (mouse == Button.MOUSE_DOWN) {
            if (btnObject[BTN_ZOOM_X1].getStatus() != Button.STATUS_ON) {
                if (gFlgDisableCamCtrl == true) {
                    return;
                } else {
                    var perc = 1365;
                    cparam_set_zoomPositionControl(perc);
                }
            }
        } else {
            // 処理なし
        }
    }

    /**
     *「D-Zoom」ボタン押下時の画面制御
     * @param mouse
     */
    function callbackBtnDZoom(mouse) {
        if (mouse == Button.MOUSE_DOWN) {
            if (btnObject[BTN_ZOOM_D_ZOOM].getStatus() != Button.STATUS_ON) {
                reqCgiObj.Dzoom = 1;
                cparam_set_digitalZoomDisableEnable(1);
                DZoomAndDextStatusChange(1);
            } else {
                reqCgiObj.Dzoom = 0;
                DZoomAndDextStatusChange(2);
                cparam_set_digitalZoomDisableEnable(0);
            }
        } else {
            // 処理なし
        }
    }
    /**
     *「D-Zoom」ボタン押下時の画面制御
     * @param mouse
     */
    function DZoomAndDextStatusChange(flg) {
        //#8497
        var ptz_sync_mode = cparam_getPresetPtzSyncMode();
        if (ptz_sync_mode == 1) {
            btnObject[BTN_ZOOM_D_ZOOM].displayDisabled();
        } else {
            const uhdCropRadioDate = cparam_get_UHDCrop();
            // if(uhdCropRadioDate != 0){
            // btnObject[BTN_ZOOM_D_ZOOM].displayDisabled();
            // btnObject[BTN_ZOOM_D_EXT_X_1_4].displayDisabled();
            // btnObject[BTN_ZOOM_D_EXT_X_2_0].displayDisabled();
            // }else{
            if (flg == 1) {
                btnObject[BTN_ZOOM_D_ZOOM].displayOn();
                btnObject[BTN_ZOOM_D_EXT_X_1_4].displayDisabled();
                btnObject[BTN_ZOOM_D_EXT_X_2_0].displayDisabled();
                $("#camera_ptz_d_zoom_label").empty();
                $("#camera_ptz_d_zoom_label").html("D-Zoom");
            } else if (flg == 2) {
                $("#camera_ptz_d_zoom_label").empty();
                btnObject[BTN_ZOOM_D_ZOOM].displayOff();
                btnObject[BTN_ZOOM_D_EXT_X_1_4].displayOff();
                btnObject[BTN_ZOOM_D_EXT_X_2_0].displayOff();
            } else if (flg == 3) {
                btnObject[BTN_ZOOM_D_ZOOM].displayOff();
                btnObject[BTN_ZOOM_D_EXT_X_1_4].displayOn();
                btnObject[BTN_ZOOM_D_EXT_X_2_0].displayOff();
            } else if (flg == 4) {
                btnObject[BTN_ZOOM_D_ZOOM].displayOff();
                btnObject[BTN_ZOOM_D_EXT_X_1_4].displayOff();
                btnObject[BTN_ZOOM_D_EXT_X_2_0].displayOn();
            }
        }
    }

    /**
     *「O.T. AF」ボタン押下時の画面制御
     * @param
     */
    function callbackFocusOtaf(mouse) {
        if (mouse == Button.MOUSE_DOWN) {
            if (btnObject[BTN_FOCUS_OTAF].getStatus() != Button.STATUS_ON) {
                if ((gFlgDisableCamCtrl == true) || (AutoFocus == 1)) {
                    return;
                } else {
                    cparam_set_oneShotAF(1);
                }
            }
        } else {
            // 処理なし
        }
    }

    /**
     *「O.T. AF」ボタン押下時の画面制御
     * @param
     */
    function callbackTouchAF(mouse) {
        if (mouse == Button.MOUSE_DOWN) {
            if (btnObject[BTN_TOUCH_F].getStatus() != Button.STATUS_ON) {
                btnObject[BTN_TOUCH_F].displayOn();
                if(btnObject[BTN_TOUCH_F].getStatus() == Button.STATUS_ON && !cameraControllerSetting.zoomSpeedFocusCtrlButton.isIrisWinDisable()){
                    
                    btnObject[BTN_A_IRIS_WIN].displayOff();
                }
                // var irismode = cparam_get_irismode();
                // var irisAutoWindow = cparam_get_irisAutoWindow();
                if(canUseIrisButton()){
                    $("#iris_setting_mask").hide();
                    cameraControllerSetting.zoomSpeedFocusCtrlButton.undisableTouch_A_lris_Win_Button();
                }
                gBTN_TOUCH_F_status = 1;
                $("#camera_ptz_touch_label").empty();
                $("#camera_ptz_touch_label").html("Touch AF");
            } else {
                btnObject[BTN_TOUCH_F].displayOff();
                gBTN_TOUCH_F_status = 0;
                $("#camera_ptz_touch_label").empty();
            }
        } else {

        }
    }

    function callbackFocusGuide(mouse){
        if (mouse == Button.MOUSE_DOWN) {
            if (btnObject[BTN_FOCUS_GUIDE].getStatus() != Button.STATUS_ON) {
                if(cparam_set_focus_guide(1) != '1') return
                btnObject[BTN_FOCUS_GUIDE].displayOn();
                // var irismode = cparam_get_irismode();
                // var irisAutoWindow = cparam_get_irisAutoWindow();
                if(canUseIrisButton()){
                    cameraControllerSetting.zoomSpeedFocusCtrlButton.undisableTouch_A_lris_Win_Button();
                    $("#iris_setting_mask").hide();
                }
                gBTN_FOCUS_GUIDE_status = 1;
                // sessionStorage.gBTN_FOCUS_GUIDE_status = 1;

                $("#camera_ptz_focus_label").empty();
                $("#camera_ptz_focus_label").html("Focus Guide");
            } else {
                if(cparam_set_focus_guide(0) != '0') return
                btnObject[BTN_FOCUS_GUIDE].displayOff();
                gBTN_FOCUS_GUIDE_status = 0;
                // sessionStorage.gBTN_FOCUS_GUIDE_status = 0;
                var jqFrame = $(window.frames["mainViewHtml"].document).find('#WebVideo');
                jqFrame.children(".status").remove();
                $("#camera_ptz_focus_label").empty();
            }
        } else {

        }
    }
    function canUseIrisButton(){
        var UHDCrop = cparam_get_UHDCrop()
        var irismode = cparam_get_irismode()
        var irisAutoWindow = cparam_get_irisAutoWindow();
        return  irismode == 1 && irisAutoWindow == 5 && UHDCrop == 0
    }

    function callbackAIrisWin(mouse) {
        var giStMode = 1;
        var gvCodec = [["mpeg", "mpeg-4"], ["h264", "h264"]];
        var liveStream = '0';
        var gsVcodec = "";
        if (mouse == Button.MOUSE_DOWN) {
            if (btnObject[BTN_A_IRIS_WIN].getStatus() != Button.STATUS_ON) {
                if(cparam_set_iris_window(1) != '1') return
                btnObject[BTN_A_IRIS_WIN].displayOn();
                cameraControllerSetting.getAIrosWinBtn().displayOn(); //#8402
                if(btnObject[BTN_FOCUS_AUTO].getStatus() != Button.STATUS_ON){
                    btnObject[BTN_TOUCH_F].displayOff();
                    btnObject[BTN_FOCUS_GUIDE].displayOff();
                }
                gBTN_TOUCH_F_status = 0;
                cparam_set_focus_guide(0);
                gBTN_FOCUS_GUIDE_status = 0;
                irisController.build();
                AutoIrisWindowPosition();
                $("#camera_ptz_focus_label").empty();
                $("#camera_ptz_touch_label").empty();//#8447
                $("#iris_setting_mask").show();
            } else {
                if(cparam_set_iris_window(0) != '0') return
                btnObject[BTN_A_IRIS_WIN].displayOff();
                cameraControllerSetting.getAIrosWinBtn().displayOff(); //#8402
                $("#iris_setting_mask").hide();
                $('#setup_live_iris_setting_mask', window.parent.document).hide();/*#8487 add 2023-11-03*/
                $("#camera_ptz_focus_label").empty();   
                $("#camera_ptz_touch_label").empty();   //#8447      
            }
            
            liveStream = MenubarStreamCtrl._menubar_SetStreamInfo("/cgi-bin/getuid?FILE=1&vcodec=" + gvCodec[giStMode][1] + gsVcodec)
            if (liveStream == '90' || liveStream == false) {
                $("#iris_setting_mask").hide();
            }
        } else {

        }
        
    }
    function AutoIrisWindowPosition(){
        var iris = cparam_get_iris_window_position()
            var irisWin = iris.split(':')
            var upperLeftH = irisWin[0]
            var upperLeftV = irisWin[1]
            var bottomRightH = irisWin[2]
            var bottomRightV = irisWin[3]
            var start = [Number(upperLeftH), Number(upperLeftV)]
            var end = [Number(bottomRightH), Number(bottomRightV)]

            function getIndex(start, end) {
                var result = [];

                for (var i = start[1]; i <= end[1]; i++) {
                    for (var j = start[0]; j <= end[0]; j++) {
                        result.push(i * 9 + j)
                    }
                }
                return result
            }
            // console.log('result===', getIndex(start,end))
            var airisArr = getIndex(start, end);
            $("#selectable li").each(function (index,item) {
                if (airisArr.includes(index)) {
                    $(item).removeClass("ui-selected").addClass("ui-selected");
                }
            })
            $("#setup_live_selectable li", window.parent.document).each(function (index,item) {/*#8487 add 2023-11-03*/
                if (airisArr.includes(index)) {
                    $(item).removeClass("ui-selected").addClass("ui-selected");
                }
            })
    }

    /**
     * focus アップ処理 (+1)
     */
    function focusFar() {
        var focusVal = reqPtdObj.mapPtv.focus;
        if(focusVal == undefined || focusVal < 1365){
            focusVal = 4095;
        }
        focusVal = Math.floor((focusVal-1365)/2730*99);
        cameraControllerSetting.setSliderFocusPosition(focusVal);
    }

    /**
     * focus ダウン処理 (-1)
     */
    function focusNear() {
        var focusVal = reqPtdObj.mapPtv.focus;
        if(focusVal == undefined || focusVal < 1365){
            focusVal = 4095;
        }
        focusVal = Math.floor((focusVal-1365)/2730*99);
        cameraControllerSetting.setSliderFocusPosition(focusVal);
    }

    var oldFocusDate = null;

    /**
     * focus ダウン処理
     */
    function focusAuto(auto) {
        if (auto == AUTO) {
            cameraControllerSetting.disableFocusSlider();
            if ($(".txt_adjust_camera_focus")[0]) {
                oldFocusDate = parseInt($(".txt_adjust_camera_focus")[0].innerText);
            } else if ($(".txt_camera_focus")[0]) {
                oldFocusDate = parseInt($(".txt_camera_focus")[0].innerText);
            }
        } else if (auto == MANUAL) {
            var val = oldFocusDate;
            cameraControllerSetting.setSliderFocusPosition(val);
            cparam_set_focusPositionControl(val);
            cameraControllerSetting.undisableFocusSlider();
        }
    }

    /**
     * init zoom and focus slider
     * @param AutoFocus
     */
    function initZoomAndFocusSlider(AutoFocus) {
        if (AutoFocus == 1) {
            cameraControllerSetting.disableFocusSlider();
        } else {
            cameraControllerSetting.undisableFocusSlider();
        }
    }

    /**
     * set zoom value to element
     * @param value
     */
    function setZoomValue(value) {
        if ($(".txt_adjust_camera_zoom p")[0]) {
            $(".txt_adjust_camera_zoom p")[0].innerText = value;
        } else if ($(".txt_camera_zoom p")[0]) {
            $(".txt_camera_zoom p")[0].innerText = value;
        } else {
            // nothing
        }
    }

    /**
     * カメラ状態情報更新処理<br>
     * 更新されたカメラ状態情報に応じて ZOOM・SPEEDボタンの押下可否判定を行う
     * @param {object} status カメラ状態
     */
    var oldZoomDate = null;
    function updateStatus(status) {
        var map = gPTD;
        var valZoom = map.zoom;
        var valFocus = map.focus;
        if (status == 0) {
            for (var btn in btnObject) {
                btnObject[btn].displayDisabled();
            }
            oldFocusDate = valFocus;
            oldZoomDate = valZoom;
        } else {
            for (var btn in btnObject) {
                btnObject[btn].displayOff();
            }
            oldFocusDate = valFocus;
            oldZoomDate = valZoom;
        }
    }

    /**
     * init controller buttons1
     * @param DigitalExt
     * @param AutoFocus
     * @param gFlgSlow
     */
    function initControllerButtons1() {
        if (AutoFocus == 1) {
            btnObject[BTN_FOCUS_NEAR].displayDisabled();
            btnObject[BTN_FOCUS_FAR].displayDisabled();
            btnObject[BTN_FOCUS_AUTO].displayOn();
            btnObject[BTN_FOCUS_OTAF].displayDisabled();
            initZoomAndFocusSlider(AutoFocus);
        } else {
            btnObject[BTN_FOCUS_NEAR].displayOff();
            btnObject[BTN_FOCUS_FAR].displayOff();
            btnObject[BTN_FOCUS_AUTO].displayOff();
            initZoomAndFocusSlider(AutoFocus);
        }
        if (uHDCropMode != 0 || reqCgiObj.bar == 1 || AutoFocus ==1) {
			btnObject[BTN_TOUCH_F].displayDisabled();
            btnObject[BTN_FOCUS_GUIDE].displayDisabled();
            if(ptzAreaCtrlFlag == true) {  //+
                if (gBTN_TOUCH_F_status == 1) {
                    $("#camera_ptz_touch_label").hide();
                }
            }
        }else{
            if (gBTN_TOUCH_F_status == 1) {
                if(ptzAreaCtrlFlag == true) {
                    if(Platform.isTouchMode()){
                        $("#camera_ptz_touch_label").hide();
                    }else {
                        $("#camera_ptz_touch_label").show();
                    }
                }
                btnObject[BTN_TOUCH_F].displayOn();
            } else {
                btnObject[BTN_TOUCH_F].displayOff();
            }
            if (gBTN_FOCUS_GUIDE_status == 1) {
                if(ptzAreaCtrlFlag == true) {
                    if(Platform.isTouchMode()){
                        $("#camera_ptz_touch_label").hide();
                    }else {
                        $("#camera_ptz_touch_label").show();
                    }
                }
                btnObject[BTN_FOCUS_GUIDE].displayOn();
            } else {
                btnObject[BTN_FOCUS_GUIDE].displayOff();
            }
        }
        // if (uHDCropMode != 0) {
        //     btnObject[BTN_FOCUS_GUIDE].displayDisabled();
        // } else {
        //     if (gBTN_FOCUS_GUIDE_status == 1) {
        //         btnObject[BTN_FOCUS_GUIDE].displayOn();
        //     } else {
        //         btnObject[BTN_FOCUS_GUIDE].displayOff();
        //     }
        // }
    }

    /**
     * init controller buttons disabled1
     */
    function initControllerButtonsDisabled1() {
        btnObject[BTN_FOCUS_NEAR].displayDisabled();
        btnObject[BTN_FOCUS_OTAF].displayDisabled();
        btnObject[BTN_FOCUS_FAR].displayDisabled();
        btnObject[BTN_FOCUS_AUTO].displayDisabled();
        setZoomValue(NPTZ_WORDING.wID_0167);
    }

    /**
     * d_ExtbtnOn
     */
    function d_ExtbtnOn() {
        btnObject[BTN_ZOOM_D_EXT_X_1_4].displayOn();
        btnObject[BTN_ZOOM_D_EXT_X_2_0].displayOff();
        btnObject[BTN_ZOOM_D_ZOOM].displayOff();
    }

    /**
     * d_ExtbtnOn
     */
    function d_ExtbtnOn_20() {
        btnObject[BTN_ZOOM_D_EXT_X_1_4].displayOff();
        btnObject[BTN_ZOOM_D_EXT_X_2_0].displayOn();
        btnObject[BTN_ZOOM_D_ZOOM].displayOff();
    }

    /**
     * d_ExtbtnOff
     */
    function d_ExtbtnOff() {
        btnObject[BTN_ZOOM_D_EXT_X_1_4].displayOff();
    }

    /**
     * d_ExtbtnOff
     */
    function d_ExtbtnOff_20() {
        btnObject[BTN_ZOOM_D_EXT_X_2_0].displayOff();
    }

    /**
     * open small window : PTZ
     */
    function changePtzElementToWindow() {
        //ptz-zoom,focus
        $(".btn_zoom_tele").removeClass("btn_zoom_tele").addClass("btn_ptz_zoom_tele");
        $(".btn_zoom_wide").removeClass("btn_zoom_wide").addClass("btn_ptz_zoom_wide");
        $(".btn_speed_slow").removeClass("btn_speed_slow").addClass("btn_ptz_speed_slow");
        $(".btn_speed_fast").removeClass("btn_speed_fast").addClass("btn_ptz_speed_fast");
        $(".btn_focus_far").removeClass("btn_focus_far").addClass("btn_ptz_focus_far");
        $(".btn_focus_near").removeClass("btn_focus_near").addClass("btn_ptz_focus_near");
        $(".btn_focus_auto").removeClass("btn_focus_auto").addClass("btn_ptz_focus_auto");
        $(".btn_zoom_d_ext").removeClass("btn_zoom_d_ext").addClass("btn_ptz_zoom_d_ext");
        $(".btn_zoom_d_ext_20").removeClass("btn_zoom_d_ext_20").addClass("btn_ptz_zoom_d_ext_20");
        $(".btn_zoom_x1").removeClass("btn_zoom_x1").addClass("btn_ptz_zoom_x1");
        $(".btn_focus_otaf").removeClass("btn_focus_otaf").addClass("btn_ptz_focus_otaf");
        $(".btn_zoom_D_Zoom").removeClass("btn_zoom_D_Zoom").addClass("btn_ptz_zoom_D_Zoom");
        $(".txt_camera_zoom").removeClass("txt_camera_zoom").addClass("txt_adjust_camera_zoom");
        $(".txt_camera_focus").removeClass("txt_camera_focus").addClass("txt_adjust_camera_focus");
    }

    /**
     * close small window : PTZ
     */
    function changePtzElementToMain() {
        //ptz-zoom,focus
        $(".btn_ptz_zoom_tele").removeClass("btn_ptz_zoom_tele").addClass("btn_zoom_tele");
        $(".btn_ptz_zoom_wide").removeClass("btn_ptz_zoom_wide").addClass("btn_zoom_wide");
        $(".btn_ptz_speed_slow").removeClass("btn_ptz_speed_slow").addClass("btn_speed_slow");
        $(".btn_ptz_speed_fast").removeClass("btn_ptz_speed_fast").addClass("btn_speed_fast");
        $(".btn_ptz_focus_far").removeClass("btn_ptz_focus_far").addClass("btn_focus_far");
        $(".btn_ptz_focus_near").removeClass("btn_ptz_focus_near").addClass("btn_focus_near");
        $(".btn_ptz_focus_auto").removeClass("btn_ptz_focus_auto").addClass("btn_focus_auto");
        $(".btn_ptz_zoom_d_ext").removeClass("btn_ptz_zoom_d_ext").addClass("btn_zoom_d_ext");
        $(".btn_ptz_zoom_d_ext_20").removeClass("btn_ptz_zoom_d_ext_20").addClass("btn_zoom_d_ext_20");
        $(".btn_ptz_zoom_x1").removeClass("btn_ptz_zoom_x1").addClass("btn_zoom_x1");
        $(".btn_ptz_focus_otaf").removeClass("btn_ptz_focus_otaf").addClass("btn_focus_otaf");
        $(".btn_ptz_zoom_D_Zoom").removeClass("btn_ptz_zoom_D_Zoom").addClass("btn_zoom_D_Zoom");
        $(".txt_adjust_camera_zoom").removeClass("txt_adjust_camera_zoom").addClass("txt_camera_zoom");
        $(".txt_adjust_camera_focus").removeClass("txt_adjust_camera_focus").addClass("txt_camera_focus");
    }

    /**
     * set zoom value to element
     * @param value
     */
    function setZoomValue(value) {
        if ($(".txt_camera_zoom p")[0]) {
            $(".txt_camera_zoom p")[0].innerText = value;
        } else if ($(".txt_adjust_camera_zoom p")[0]) {
            $(".txt_adjust_camera_zoom p")[0].innerText = value;
        } else {
            // nothing
        }
    }

    /**
     * set focus value to element
     * @param value
     */
    function setFocusValue(value) {
        if ($(".txt_camera_focus p")[0]) {
            $(".txt_camera_focus p")[0].innerText = value;
        } else if ($(".txt_adjust_camera_focus p")[0]) {
            $(".txt_adjust_camera_focus p")[0].innerText = value;
        } else {
            // nothing
        }
    }

    return {
        build: function () {
            if (buildFlag == false) {
                buildFlag = true;
                // T
                btnObject[BTN_ZOOM_TELE] = ButtonCtrl('camera_controller_gui_ptz_zoom', 'btn_zoom_tele', NPTZ_WORDING.wID_0030, callbackZoomTele);
                // W
                btnObject[BTN_ZOOM_WIDE] = ButtonCtrl('camera_controller_gui_ptz_zoom', 'btn_zoom_wide', NPTZ_WORDING.wID_0031, callbackZoomWide);
                // FAST
                btnObject[BTN_SPEED_FAST] = ButtonCtrl('camera_controller_gui_ptz_speed', 'btn_speed_fast', NPTZ_WORDING.wID_0032, callbackSpeedFast);
                // SLOW
                btnObject[BTN_SPEED_SLOW] = ButtonCtrl('camera_controller_gui_ptz_speed', 'btn_speed_slow', NPTZ_WORDING.wID_0033, callbackSpeedSlow);
                // FAR
                btnObject[BTN_FOCUS_FAR] = ButtonCtrl('camera_controller_gui_ptz_focus', 'btn_focus_far', NPTZ_WORDING.wID_0034, callbackFocusFar);
                // NEAR
                btnObject[BTN_FOCUS_NEAR] = ButtonCtrl('camera_controller_gui_ptz_focus', 'btn_focus_near', NPTZ_WORDING.wID_0035, callbackFocusNear);
                // AUTO
                btnObject[BTN_FOCUS_AUTO] = ButtonCtrl('camera_controller_gui_ptz_focus', 'btn_focus_auto', NPTZ_WORDING.wID_0016, callbackFocusAuto);

                // D_Ext.
                // btnObject[BTN_ZOOM_D_EXT] = ButtonCtrl('camera_controller_gui_ptz_zoom', 'btn_zoom_d_ext', NPTZ_WORDING.wID_0410, callbackZoomDExt);
                // D_Ext(X1.4).
                btnObject[BTN_ZOOM_D_EXT_X_1_4] = ButtonCtrl('camera_controller_gui_ptz_zoom', 'btn_zoom_d_ext', NPTZ_WORDING.wID_0454, callbackZoomDExt);
                // D_Ext(X2.0).
                btnObject[BTN_ZOOM_D_EXT_X_2_0] = ButtonCtrl('camera_controller_gui_ptz_zoom', 'btn_zoom_d_ext_20', NPTZ_WORDING.wID_0455, callbackZoomDExt_20);
                // x1.0
                btnObject[BTN_ZOOM_X1] = ButtonCtrl('camera_controller_gui_ptz_zoom', 'btn_zoom_x1', NPTZ_WORDING.wID_0411, callbackBtnZoomX1);
                // D-Zoom
                btnObject[BTN_ZOOM_D_ZOOM] = ButtonCtrl('camera_controller_gui_ptz_zoom', 'btn_zoom_D_Zoom', NPTZ_WORDING.wID_0412, callbackBtnDZoom);
                // AUTO
                btnObject[BTN_FOCUS_OTAF] = ButtonCtrl('camera_controller_gui_ptz_focus', 'btn_focus_otaf', NPTZ_WORDING.wID_0413, callbackFocusOtaf);
                //TouchAF
                btnObject[BTN_TOUCH_F] = ButtonCtrl('camera_controller_gui_ptz_focus', 'btn_touch_af', NPTZ_WORDING.wID_0414, callbackTouchAF);
                //FocusGuide
                btnObject[BTN_FOCUS_GUIDE] = ButtonCtrl('camera_controller_gui_ptz_focus', 'btn_focus_guide', NPTZ_WORDING.wID_0914, callbackFocusGuide);
                //A.Iris Win
                btnObject[BTN_A_IRIS_WIN] = ButtonCtrl('camera_controller_gui_ptz_focus', 'btn_a_iris_win', NPTZ_WORDING.wID_0915, callbackAIrisWin);
                //TXT:ZOOM
                txtObject[TXT_CAMERA_ZOOM] = TextCtrl('camera_controller_gui_ptz_zoom', 'txt_camera_zoom', NPTZ_WORDING.wID_0167);
                //TXT:FOCUS
                txtObject[TXT_CAMERA_FOCUS] = TextCtrl('camera_controller_gui_ptz_focus', 'txt_camera_focus', NPTZ_WORDING.wID_0167);

                $("#iris_setting_mask").hide();
                $('#iris_setting_mask_cover').hide();
             }
        },

        show: function () {
            for (var btn in btnObject) {
                btnObject[btn].show();
            }
            for (var txt in txtObject) {
                txtObject[txt].show();
            }
            // btnObject[BTN_ZOOM_D_EXT].hide();
            btnObject[BTN_ZOOM_D_EXT_X_1_4].hide();
            btnObject[BTN_ZOOM_D_EXT_X_2_0].hide();
            btnObject[BTN_ZOOM_X1].hide();
            btnObject[BTN_ZOOM_D_ZOOM].hide();
            btnObject[BTN_FOCUS_OTAF].hide();
            btnObject[BTN_TOUCH_F].hide();
            btnObject[BTN_FOCUS_GUIDE].hide();
            btnObject[BTN_A_IRIS_WIN].hide();
        },

        hide: function () {
            for (var btn in btnObject) {
                btnObject[btn].hide();
            }
        },
        d_ExtbtnOn: d_ExtbtnOn,
        d_ExtbtnOn_20: d_ExtbtnOn_20,
        d_ExtbtnOff: d_ExtbtnOff,
        d_ExtbtnOff_20: d_ExtbtnOff_20,
        updateStatus: updateStatus,
        initControllerButtons1: function (DigitalExt, AutoFocus, gFlgSlow) {
            initControllerButtons1();
        },
        initControllerButtonsDisabled1: initControllerButtonsDisabled1,
        setZoomValue: setZoomValue,
        setFocusValue: setFocusValue,
        setFocusBtnAutoStatus: function (status) {
            if (status == AUTO) {
                btnObject[BTN_FOCUS_AUTO].displayOn();
                btnObject[BTN_FOCUS_FAR].displayDisabled();
                btnObject[BTN_FOCUS_NEAR].displayDisabled();
            } else if (status == MANUAL) {
                btnObject[BTN_FOCUS_AUTO].displayOff();
                btnObject[BTN_FOCUS_FAR].displayOff();
                btnObject[BTN_FOCUS_NEAR].displayOff();
            }
        },
        showButtonByCtrl: function () {
            // btnObject[BTN_ZOOM_D_EXT].show();
            btnObject[BTN_ZOOM_D_EXT_X_1_4].show();
            btnObject[BTN_ZOOM_D_EXT_X_2_0].show();
            btnObject[BTN_ZOOM_X1].show();
            btnObject[BTN_ZOOM_D_ZOOM].show();
            btnObject[BTN_FOCUS_OTAF].show();
            btnObject[BTN_TOUCH_F].show();
            btnObject[BTN_FOCUS_GUIDE].show();
            if (!Platform.isTouchMode()) {
                btnObject[BTN_A_IRIS_WIN].show();
            } else {
                btnObject[BTN_A_IRIS_WIN].hide();
            }
            // btnObject[BTN_ZOOM_D_EXT].displayOff();
            btnObject[BTN_ZOOM_D_EXT_X_1_4].displayOff();
            btnObject[BTN_ZOOM_D_EXT_X_2_0].displayOff();
            btnObject[BTN_ZOOM_X1].displayOff();
            btnObject[BTN_ZOOM_D_ZOOM].displayOff();
            btnObject[BTN_FOCUS_OTAF].displayOff();
            btnObject[BTN_TOUCH_F].displayOff();
            btnObject[BTN_FOCUS_GUIDE].displayOff();
            if (!Platform.isTouchMode()) {
                btnObject[BTN_A_IRIS_WIN].displayOff();
            }
            const uhdCropRadioDate = cparam_get_UHDCrop();
            const presetPtzSyncMode = cparam_getPresetPtzSyncMode();
            if(uhdCropRadioDate != 0){
                btnObject[BTN_ZOOM_D_ZOOM].displayDisabled();
                if (presetPtzSyncMode == 0) {                 
                    btnObject[BTN_ZOOM_D_EXT_X_1_4].displayDisabled();
                    btnObject[BTN_ZOOM_D_EXT_X_2_0].displayDisabled();
                }
            }
        },
        hideButtonByCtrl: function () {
            // btnObject[BTN_ZOOM_D_EXT].hide();
            btnObject[BTN_ZOOM_D_EXT_X_1_4].hide();
            btnObject[BTN_ZOOM_D_EXT_X_2_0].hide();
            btnObject[BTN_ZOOM_X1].hide();
            btnObject[BTN_ZOOM_D_ZOOM].hide();
            btnObject[BTN_FOCUS_OTAF].hide();
            btnObject[BTN_TOUCH_F].hide();
            btnObject[BTN_FOCUS_GUIDE].hide();
            btnObject[BTN_A_IRIS_WIN].hide();
        },

        disableTouch_AF_Button: function () {
            btnObject[BTN_TOUCH_F].displayDisabled();
            btnObject[BTN_FOCUS_GUIDE].displayDisabled();
        },
        undisableTouch_AF_Button: function () {
            btnObject[BTN_TOUCH_F].displayOff();
            // btnObject[BTN_FOCUS_GUIDE].displayOff();
        },
        disableTouch_A_lris_Win_Button: function () {
            btnObject[BTN_A_IRIS_WIN].displayDisabled();
        },
        undisableTouch_A_lris_Win_Button: function () {
            var getfocus = cparam_get_focus_guide();
            var getiris = cparam_get_iris_window();
            
            if (document.getElementById('iris_setting_mask').style.display == "none") {
                btnObject[BTN_A_IRIS_WIN].displayOff();
            }else {
                btnObject[BTN_A_IRIS_WIN].displayOn();
            }
        },
        isIrisWinDisable: function () { return btnObject[BTN_A_IRIS_WIN].getStatus() == Button.STATUS_DISABLED },
        changePtzElementToWindow: changePtzElementToWindow,
        changePtzElementToMain: changePtzElementToMain,
        btnExtDisplayOn: function () {
            // btnObject[BTN_ZOOM_D_EXT].displayOn();
            btnObject[BTN_ZOOM_D_EXT_X_1_4].displayOn();
            // btnObject[BTN_ZOOM_D_EXT_X_2_0].displayOn();
        },
        btnExtDisplayOn_20: function () {
            // btnObject[BTN_ZOOM_D_EXT].displayOn();
            // btnObject[BTN_ZOOM_D_EXT_X_1_4].displayOn();
            btnObject[BTN_ZOOM_D_EXT_X_2_0].displayOn();
        },
        btnZoomDisplayOn: function () {
            btnObject[BTN_ZOOM_D_ZOOM].displayOn();
            // btnObject[BTN_ZOOM_D_EXT].displayDisabled();
            btnObject[BTN_ZOOM_D_EXT_X_1_4].displayDisabled();
            btnObject[BTN_ZOOM_D_EXT_X_2_0].displayDisabled();
        },
        btnTonchDisplayOn: function () {
            btnObject[BTN_TOUCH_F].displayOn();
        },
        DZoomAndDextStatusChange:DZoomAndDextStatusChange,
        FoucsStatusChageOn:function(){
            btnObject[BTN_FOCUS_AUTO].displayOn();
            btnObject[BTN_FOCUS_OTAF].displayDisabled();
        },
        FoucsStatusChageOff:function(){
            btnObject[BTN_FOCUS_AUTO].displayOff();
            btnObject[BTN_FOCUS_OTAF].displayOff();
        },
        focusGuideToOn:function(){
            btnObject[BTN_FOCUS_GUIDE].displayOn();
        },
        focusGuideToOff:function(){
            btnObject[BTN_FOCUS_GUIDE].displayOff();
        },
        focusGuideToDisable:function(){
            btnObject[BTN_FOCUS_GUIDE].displayDisabled();
        },
        canUseIrisButton:canUseIrisButton,
        btnAIrisWinShow: function () {
            btnObject[BTN_A_IRIS_WIN].show();
            $(".btn_a_iris_win").show(); 
            if (canUseIrisButton()) {
                if (document.getElementById('iris_setting_mask') != null && 
                document.getElementById('iris_setting_mask').style.display == "none") {
                    btnObject[BTN_A_IRIS_WIN].displayOff();
                } else {
                    btnObject[BTN_A_IRIS_WIN].displayOn();
                }
            }
        },
        btnAIrisWinHide:function(){
            btnObject[BTN_A_IRIS_WIN].hide();
        },
        callbackAIrisWin
    };
}

/**
 * スライダ制御クラス
 * @class スライダ制御クラス
 * @return {function} build 構築処理
 * @return {function} redraw 再描画処理
 * @return {function} show　 表示処理
 * @return {function} hide　 非表示処理
 * @return {function} disable 無効化処理
 * @return {function} undisable 有効化処理
 * @return {number} getValue スライダのレベルの取得
 * @return {number} getStatus スライダ状態の取得
 * @return {function} setPosition スライダの再描画処理
 * @return {function} setValue スライダレベルの現在再描画
 * @return {function} redrawSliderLevelColor スライダ待機中処理(現状、未使用)
 * @constructor
 */
function Slider() {
    /**
     * スライダ初期ポジション
     * @type number
     */
    var DEFAULT_POSITION = null;

    /**
     * スライダサイズ
     * @type number
     */
    var SIZE;

    /**
     * スライダポジション
     * @type number
     */
    var position = DEFAULT_POSITION;

    /**
     * スライダオブジェクト
     * @type string
     */
    var SLIDER_BASE_KEY;

    /**
     * つまみ位置
     * @type string
     */
    var SLIDER_HANDLE_KEY;

    /**
     * スライダレベル
     * @type string
     */
    var SLIDER_LEVEL_KEY;

    /**
     * スライダ現在設定レベル
     * @type string
     */
    var SLIDER_NOW_LEVEL_KEY;

    /**
     * スライダHEIGHT
     * @type number
     */
    var SLIDER_BASE_HEIGHT;

    /**
     * スライダWIDTH
     * @type number
     */
    var SLIDER_BASE_WIDTH;

    /**
     * つまみ位置HEIGHT
     * @type number
     */
    var SLIDER_HANDLE_HEIGHT;

    /**
     * つまみ位置WIDTH
     * @type number
     */
    var SLIDER_HANDLE_WIDTH;

    /**
     * 構築済みフラグ
     * @type boolean
     */
    var buildFlag = false;

    /**
     * ボタン押下状態
     * @type number
     */
    var buttonStatus = Button.STATUS_DISABLED;

    /**
     * ドラッグ判定フラグ
     * @type boolean
     */
    var draggingFlag = false;

    var maxNumber = null;
    var evn;
    var outFlg = false;
    /**
     * スライダ構築処理
     * @param {string} sliderBaseKey 　スライダ設定値キー
     * @param {string} sliderHandleKey スライダつまみ設定値キー
     * @param {function} sliderCallback  コールバック関数
     */
    function build(sliderBaseKey, sliderHandleKey, sliderCallback, parentDiv,max) {
        /**
         * スライダ初期値(％)
         * @type {number}
         */
        position = max;
        maxNumber = max;

        if (buildFlag == false) {

            buildFlag = true;

            // CSSと紐付けられた引数をセット
            SLIDER_BASE_KEY = sliderBaseKey;
            SLIDER_HANDLE_KEY = sliderHandleKey;
            SLIDER_LEVEL_KEY = SLIDER_BASE_KEY + "_level";

            // スライダのボタン要素作成
            var button = $('<div class="' + SLIDER_BASE_KEY + '"> </div>');
            $('#' + parentDiv).append(button);
            button.append('<div class="' + SLIDER_LEVEL_KEY + '"> </div>');
            button.append('<div class="' + SLIDER_HANDLE_KEY + '"> </div>');

            // CSSから情報取得(倍率計算処理に使用するパラメータ)
            SLIDER_BASE_HEIGHT = parseInt($('.' + SLIDER_BASE_KEY).css('height'));
            SLIDER_BASE_WIDTH = parseInt($('.' + SLIDER_BASE_KEY).css('width'));
            SLIDER_HANDLE_HEIGHT = parseInt($('.' + SLIDER_HANDLE_KEY).css('height'));
            SLIDER_HANDLE_WIDTH = parseInt($('.' + SLIDER_HANDLE_KEY).css('width'));
            SIZE = SLIDER_BASE_HEIGHT - SLIDER_HANDLE_HEIGHT;

            $('.' + SLIDER_LEVEL_KEY).hide();
            $('.' + SLIDER_BASE_KEY).hide();

        }

        // jQueryでドラッグ可能なオブジェクトを指定
        $('.' + SLIDER_HANDLE_KEY).draggable(
            {
                // 垂直方向のみドラッグ可能
                axis: "y",
                scroll: false,

                // ドラッグ開始時、終了時、ドラッグ時の処理を規定
                start: function (e, ui) {
                    event.stopPropagation();
                    event.preventDefault();
                    silderMouseDownFlag = true;
                    $('.' + SLIDER_HANDLE_KEY).removeClass('hover');
                    $('.' + SLIDER_HANDLE_KEY).addClass('drag');
                    draggingFlag = true;
                },
                stop: function (e, ui) {
                    draggingFlag = false;
                    $('.' + SLIDER_HANDLE_KEY).removeClass('drag');

                    // ドラッグ位置(％)を計算し、コールバックを呼出
                    position = parseInt(max - (ui.position.top * max / SIZE));

                    sliderCallback(position);
                    redrawSliderLevel(position, max);
                    silderMouseDownFlag = false;
                    silderMouseUpOverSleepTime = 1;
                },
                drag: function (e, ui) {
                    var index = 0;
                    silderMouseDownFlag = true;
                    var changeTop = ui.position.top - ui.originalPosition.top;
                    var newTop = ui.originalPosition.top + changeTop / currentZoomValue; // adjust new top by our zoomScale
                    ui.position.top = newTop;

                    if (ui.position.top < 1 ) {
                        ui.position.top = -2;
                    }

                    if (ui.position.top > SIZE) {
                        ui.position.top = SIZE + 2;
                    }

                    position = parseInt(max - (ui.position.top * max / SIZE));
                    index = parseInt(max - ((SIZE + 2) * max / SIZE));

                    if (position < index) {
                        redrawSlider(0, max);
                        redrawSliderLevel(0, max);
                        e.preventDefault();
                        $('.' + SLIDER_HANDLE_KEY).trigger('mouseup');
                    } else {
                        $('.' + SLIDER_HANDLE_KEY).draggable({cancel: ''})
                    }

                    redrawSliderLevel(position, max);
                }
            }
        );
        // マウスオーバー時の処理を規定
        $('.' + SLIDER_HANDLE_KEY).hover(function () {
            if (buttonStatus != Button.STATUS_DISABLED) {
                if (!draggingFlag) {
                    $('.' + SLIDER_HANDLE_KEY).removeClass('drag');
                    $('.' + SLIDER_HANDLE_KEY).addClass('hover');
                }
            }
        }, function () {
            if (buttonStatus != Button.STATUS_DISABLED) {
                $('.' + SLIDER_HANDLE_KEY).removeClass('hover');
            }
        });

        // マウスクリック時の処理を規定
        $('.' + SLIDER_HANDLE_KEY).mousedown(function (event) {
            silderMouseDownFlag = true;
            if (event.which == Button.CLICK_LEFT) {
                if (buttonStatus != Button.STATUS_DISABLED) {
                    $('.' + SLIDER_HANDLE_KEY).removeClass('hover');
                    $('.' + SLIDER_HANDLE_KEY).addClass('drag');
                }
            }
        });

        // マウスクリック解除時の処理を規定
        $('.' + SLIDER_HANDLE_KEY).mouseup(function (event) {
            if (event.which == Button.CLICK_LEFT) {
                if (buttonStatus != Button.STATUS_DISABLED) {
                    $('.' + SLIDER_HANDLE_KEY).removeClass('drag');
                    $('.' + SLIDER_HANDLE_KEY).addClass('hover');
                }
            }

            silderMouseDownFlag = false;
            silderMouseUpOverSleepTime = 1;
        });

        // マウスクリック解除時の処理を規定
        $('.' + SLIDER_HANDLE_KEY).click(function (event) {
            if (event.which == Button.CLICK_LEFT) {
                if (buttonStatus != Button.STATUS_DISABLED) {
                    event.stopPropagation();
                }
            }
        });

        // マウスクリック解除時の処理を規定
        $('.' + SLIDER_BASE_KEY).click(function (event) {
            if (event.which == Button.CLICK_LEFT) {
                if (buttonStatus != Button.STATUS_DISABLED) {
                    position = parseInt(max - (event.offsetY * max / SIZE));
                    sliderCallback(position+max*0.13);
                    redrawSlider(position+max*0.13, max);
                }
            }
        });

        // マウスクリック解除時の処理を規定
        $('.' + SLIDER_LEVEL_KEY).click(function (event) {
            if (event.which == Button.CLICK_LEFT) {
                if (buttonStatus != Button.STATUS_DISABLED) {
                    event.stopPropagation();
                    position = position - parseInt(event.offsetY * max / SIZE);
                    sliderCallback(position-max*0.13);
                    redrawSlider(position-max*0.13, max);
                }
            }
        });

        // 初期値を設定
        redrawSlider(position,max);

        // ビルド直後はdisable状態とする。
        buttonStatus = Button.STATUS_DISABLED;
        $('.' + SLIDER_HANDLE_KEY).addClass('disable');
        $('.' + SLIDER_HANDLE_KEY).draggable({cancel: '.' + SLIDER_HANDLE_KEY});
    }

    /**
     * スライダの再描画処理(ユーザ操作以外を契機に実行される処理)
     * @param {number} percent スライダ位置(％)
     */
    function redrawSlider(percent,max) {
        position = percent;
        var y = parseInt((max - percent) * SIZE / max);
        if(Platform.isTouchMode()){
            if(y>=188){
                y = 188;
            }
        }else{
            if(y>=113){
                y = 113;
            }
        }

        if(y < 1){
            y = -2;
        }

        if(percent == 0){
            y += 2;
        }

        // ボタンの可動範囲を考慮してCSSのピクセル値を決定
        $('.' + SLIDER_HANDLE_KEY).css({
            left: SLIDER_BASE_WIDTH / 2 - 1 * SLIDER_HANDLE_WIDTH / 2 + 'px',
            top: y + 'px'
        });
        redrawSliderLevel(percent,max);
    }

    /**
     * スライダレベルの再描画(ユーザ操作)
     * @param {number} percent 設定倍率
     */
    function redrawSliderLevel(percent,max) {
        var y = parseInt((max - percent) * SIZE / max);

        if(y < 1){
            y -= 2;
        }

        if(percent == 0){
            y += 2;
        }
        $('.' + SLIDER_LEVEL_KEY).css({
            top: y + SLIDER_HANDLE_HEIGHT + 'px',
            height: SIZE - y + 'px'
        });
    }

    /**
     * スライダレベルの現在再描画
     * @param {number} percent 設定倍率
     */
    function redrawSliderNowLevel(percent,index) {
        var value;
        if(index =="zoom"){
            value = 999;
        }else if(index =="focus"){
            value = 99;
        }else{
            value = 254;
        }
        percent = percent > value ? value : percent;
        var y = Math.round((value - percent) * SLIDER_BASE_HEIGHT / value);

        if(y < 1){
            y = -2;
        }

        $('.' + SLIDER_NOW_LEVEL_KEY).css({
            top: y + 'px',
            height: SLIDER_BASE_HEIGHT - y + 'px'
        });
    }

    /**
     * スライダ待機中処理(現状、未使用)
     * @param {boolean} busy 待機判定
     */
    function redrawSliderLevelColor(busy) {
        if (busy == true) {
            $('.' + SLIDER_LEVEL_KEY).addClass('on');
        } else {
            $('.' + SLIDER_LEVEL_KEY).removeClass('on');
        }
    }

    /**
     * slider's style changed
     * @param sliderBaseKeyOld
     * @param sliderHandleKeyOld
     * @param sliderBaseKey
     * @param sliderHandleKey
     */
    function changeSliderStyle(sliderBaseKeyOld, sliderHandleKeyOld, sliderBaseKey, sliderHandleKey) {
        SLIDER_BASE_KEY = sliderBaseKey;
        SLIDER_HANDLE_KEY = sliderHandleKey;
        SLIDER_LEVEL_KEY = SLIDER_BASE_KEY + "_level";
        SLIDER_NOW_LEVEL_KEY = SLIDER_BASE_KEY + "_now_level";

        // スライダのボタン要素
        $("." + sliderBaseKeyOld).removeClass(sliderBaseKeyOld).addClass(sliderBaseKey);
        $("." + sliderHandleKeyOld).removeClass(sliderHandleKeyOld).addClass(sliderHandleKey);
        $("." + sliderBaseKeyOld + "_level").removeClass(sliderBaseKeyOld + "_level").addClass(sliderBaseKey + "_level");
        $("." + sliderBaseKeyOld + "_now_level").removeClass(sliderBaseKeyOld + "_now_level").addClass(sliderBaseKey + "_now_level");

        if(!Platform.isTouchMode()) {
            SLIDER_BASE_HEIGHT = 138;
            SLIDER_BASE_WIDTH = 5;
            SLIDER_HANDLE_HEIGHT = 27;
            SLIDER_HANDLE_WIDTH = 27;
        }else{
            SLIDER_BASE_HEIGHT = 232;
            SLIDER_BASE_WIDTH = 5;
            SLIDER_HANDLE_HEIGHT = 43;
            SLIDER_HANDLE_WIDTH = 43;
        }

        SIZE = SLIDER_BASE_HEIGHT - SLIDER_HANDLE_HEIGHT;

        if(position < 0){
            position = 0;
        }

        redrawSlider(position, maxNumber);
    }

    return {
        build: build,

        redraw: function () {
            // 未使用の可能性あり
            $('.' + SLIDER_LEVEL_KEY).hide();
            $('.' + SLIDER_BASE_KEY).hide();
        },

        show: function () {
            $('.' + SLIDER_BASE_KEY).show();
            $('.' + SLIDER_LEVEL_KEY).show();
        },

        hide: function () {
            $('.' + SLIDER_BASE_KEY).hide();
            $('.' + SLIDER_LEVEL_KEY).hide();
        },
        disable: function () {
            buttonStatus = Button.STATUS_DISABLED;
            $('.' + SLIDER_LEVEL_KEY).css("background-color","RGB(124,0,0)");
            $('.' + SLIDER_HANDLE_KEY).addClass('disable');
            $('.' + SLIDER_HANDLE_KEY).draggable({cancel: '.' + SLIDER_HANDLE_KEY});
        },
        undisable: function () {
            buttonStatus = Button.STATUS_OFF;
            $('.' + SLIDER_LEVEL_KEY).css("background-color","red");
            $('.' + SLIDER_HANDLE_KEY).removeClass('disable');
            $('.' + SLIDER_HANDLE_KEY).draggable({cancel: ''});
        },
        getValue: function () {

            return position;
        },
        getStatus: function () {
            return buttonStatus;
        },
        setPosition: redrawSlider,
        setValue: redrawSliderNowLevel,
        redrawSliderLevel: redrawSliderLevel,
        redrawSliderLevelColor: redrawSliderLevelColor,
        changeSliderStyle: changeSliderStyle
    };
}

/**
 * Preset制御クラス
 * @class Preset制御クラス
 * @return {function} build 構築処理
 * @return {function} show　表示処理
 * @return {function} hide　非表示処理
 * @return {function} updateStatus　カメラ状態情報更新処理
 * @constructor
 */
function PresetSetting() {

    /**
     * The number of preset
     * @type {number}
     */
    var MAX_OBJECT_NUM = 9;
    var MAX_OBJECT_LIST_NUM = 100;

    /**
     * プリセットオブジェクト
     * @type {Array}
     */
    var presetListObject = [];
    /**
     * プリセットオブジェクト
     * @type {Array}
     */
    var presetListObject1 = [];

    /**
     * 要素の表示間隔(Y方向)
     * @type {number}
     */
    var STEP_TOP = 106;

    /**
     * 要素の表示間隔(X方向)
     * @type {number}
     */
    var STEP_LEFT = 175;

    /**
     * 要素の表示開始位置(TOP)
     * @type {number}
     */
    var OFFSET_TOP = 10;

    /**
     * 要素の表示開始位置(LEFT)
     * @type {number}
     */
    var OFFSET_LEFT = 18;

    /**
     * サムネイル横幅
     * @type {number}
     */
    var THUMBNAIL_WIDTH = 149;

    /**
     * サムネイル縦幅
     * @type {number}
     */
    var THUMBNAIL_HEIGHT = 83;
    /**
     * サムネイル横幅
     * @type {number}
     */
    var INPUT_WIDTH = 136;

    /**
     * サムネイル縦幅
     * @type {number}
     */
    var INPUT_HEIGHT = 18;
    /**
     *「SET」ボタンオブジェクト(インデックス値)
     * @type {number}
     */
    var BTN_PRESET_LIST = 0;
    /**
     *「DELETE」ボタンオブジェクト(インデックス値)
     * @type {number}
     */
    var BTN_PRESET_DELETE = 1;
    /**
     *「HOME」ボタンオブジェクト(インデックス値)
     * @type {number}
     */
    var BTN_PRESET_HOME = 2;
    /**
     *「SET」ボタンオブジェクト(インデックス値)
     * @type {number}
     */
    var BTN_PRESET_LIST_SET = 3;
    /**
     *「DELETE」ボタンオブジェクト(インデックス値)
     * @type {number}
     */
    var BTN_PRESET_LIST_DELETE = 4;
    /**
     *「HOME」ボタンオブジェクト(インデックス値)
     * @type {number}
     */
    var BTN_PRESET_LIST_HOME = 5;
    /**
     *「SET」ボタンオブジェクト(インデックス値)
     * @type {number}
     */
    var BTN_PRESET_LIST_ALL = 6;
    /**
     *「SET」ボタンオブジェクト(インデックス値)
     * @type {number}
     */
    var BTN_PRESET_LIST_PAGE_1= 7;
    /**
     *「SET」ボタンオブジェクト(インデックス値)
     * @type {number}
     */
    var BTN_PRESET_LIST_PAGE_2 = 8;
    /**
     *「SET」ボタンオブジェクト(インデックス値)
     * @type {number}
     */
    var BTN_PRESET_LIST_BACK = 9;
    /**
     * ボタンオブジェクト
     * @type ButtonCtrl[]
     */
    var btnPresetObject = [];

    /**
     *「SET」ボタンオブジェクト(インデックス値)
     * @type {number}
     */
    var BTN_SETUP_PRESET_SET = 0;
    /**
     *「DELETE」ボタンオブジェクト(インデックス値)
     * @type {number}
     */
    var BTN_SETUP_PRESET_DELETE = 1;
    /**
     *「HOME」ボタンオブジェクト(インデックス値)
     * @type {number}
     */
    var BTN_SETUP_PRESET_HOME = 2;

    /**
     * ボタンオブジェクト
     * @type ButtonCtrl[]
     */
    var btnObject = [];

    /**
     * 構築済みフラグ
     * @type boolean
     */
    var buildFlag = false;

    /**
     *「SET」ボタンの状態
     * @type {boolean}
     */
    var setButtonState = false;
    /**
     *「DEL」ボタンの状態
     * @type {boolean}
     */
    var delButtonState = false;
    /**
     * 記録モード
     * @type {boolean}
     */
    var RECODE_MODE = true;

    /**
     * 読み取りモード
     * @type {boolean}
     */
    var PRESET_MODE = false;
    /**
     * プリセット利用可能です
     * @type {boolean}
     */
    var presetState = false;

    /**
     * デフォルトは無効になります
     * @type {boolean}
     */
    var PRESET_DISABLE = false;

    /**
     *  プリセットが使用可能です
     * @type {boolean}
     */
    var PRESET_AVAILABLE = true;

    /**
     * 現在選択中のPresetレコード
     * @type number
     */
    var presetDeleteNum = null;
    /**
     * 現在選択中のPresetレコード
     * @type number
     */
    var delButtonFlg = true;
    /**
     * プリセットオブジェクト
     * @type {Array}
     */
    var inputListObject = [];
    /**
     * プリセットオブジェクト
     * @type {Array}
     */
    var inputListObject1 = [];

    /**
     * ボタンオブジェクト
     * @type ButtonCtrl[]
     */
    var btnObject1 = [];
    var indexFlg = 1;
    var thumbnailIndex =0;
    var initThumbnailStatus = [];
    var initAllThumbnailStatus = [];
    var getImageId = null;
    var preset = false;
	var presetIdListAll;
	var presetPageController;

    /**
     * Input要素構築処理
     * @param list_index
     */
    function buildPresetInput(i) {
        // 追加ターゲットとなるHTML要素
        inputListObject[i] = {};
        inputListObject[i]['id'] = null;
        var id = "input_list_" + ('0' + i).slice(-2);

        inputListObject[i]['object'] = $('<div id="' + id + '"></div>');
        var px = (i % 3) * STEP_LEFT + OFFSET_LEFT;
        var py = Math.floor(i / 3) * STEP_TOP + OFFSET_TOP;
        inputListObject[i]['object'].css({
            top: py + 'px',
            left: px + 'px'
        });
        $('#preset_list').append(inputListObject[i]['object']);
        $('#preset_list').addClass('preset_list');
        var inputID = "preset_input_" + ('0' + i).slice(-2);
        var target = "input_list_" + ('0' + i).slice(-2);

        // CANVASの生成
        var tag = '<input id="' + inputID + '" onMouseOver="this.title=this.value"  maxlength="15" readonly="true">';
        $('#' + target).append(tag);
        $('#' + target).addClass(target);

        // canvasの描画サイズ調整
        inputListObject[i]['input'] = $('#' + inputID);
        inputListObject[i]['input'].css({
        	'font-size': '13px',
            width: INPUT_WIDTH + 'px',
            height: INPUT_HEIGHT + 'px'
        });
        inputListObject[i]['input'].attr("width", INPUT_WIDTH);
        inputListObject[i]['input'].attr("border", 0);
        inputListObject[i]['input'].addClass('setting_set_input');
        inputListObject[i]['input'].focus(presetSelectinput);
        inputListObject[i]['input'].blur(presetInput);
        inputListObject[i]['input'].keyup(function (e) {
            if(e.keyCode==13) {
                inputListObject[i]['input'].blur();
            }
        });
        if(isPageFlg == "live") {
            inputListObject[i]['input'].removeClass('setting_set_input');
            inputListObject[i]['input'].addClass('preset_input_disabled');
        }
    }

    /**
     * Input要素構築処理
     * @param list_index
     */
    function buildPresetListInput(div,i) {
        // 追加ターゲットとなるHTML要素
        inputListObject1[i] = {};
        inputListObject1[i]['id'] = null;
        var id = "input_list_area_" + ('0' + i).slice(-2);
        var num = "camera_presnt_list_"+('0' + i).slice(-2);
        inputListObject1[i]['object'] = $('<div id="' + id + '"></div>');
        var px = (i % 3) * STEP_LEFT + OFFSET_LEFT;
        var py = Math.floor(i / 3) * STEP_TOP + OFFSET_TOP;
        inputListObject1[i]['object'].css({
            top: 0 + 'px',
            left: 22 + 'px'
        });
        $("#"+num).css({
            top: 0 + 'px',
            left: 0 + 'px'
        });
        $('#'+div).append(inputListObject1[i]['object']);
        $('#'+div).append($('<div id="' + num + '">'+(i+1)+'</div>'));
        var inputID = "preset_input_area_" + ('0' + i).slice(-2);

        // CANVASの生成
        var tag = '<input id="' + inputID + '" onMouseOver="this.title=this.value"  maxlength="15" readonly="true">';
        $('#' + id).append(tag);
        $('#' + id).addClass("input_list");
        $('#' + num).addClass("camera_presnt_list_num");

        // canvasの描画サイズ調整
        inputListObject1[i]['input'] = $('#' + inputID);
        inputListObject1[i]['input'].css({
            'font-size': '13px',
            width: 144 + 'px',
            height: 16 + 'px',
            'text-align': 'center',
            'margin-top': '1px',
            "line-height":'16px'
        });
        inputListObject1[i]['input'].attr("width", INPUT_WIDTH);
        inputListObject1[i]['input'].attr("border", 0);
        inputListObject1[i]['input'].addClass('setting_set_input');
        inputListObject1[i]['input'].focus(presetSelectListinput);
        inputListObject1[i]['input'].blur(presetListInput);
        inputListObject1[i]['input'].keyup(function (e) {
            if(e.keyCode==13) {
                inputListObject1[i]['input'].blur();
            }
        });
        if(isPageFlg == "live") {
            inputListObject1[i]['input'].removeClass('setting_set_input');
            inputListObject1[i]['input'].addClass('preset_input_show');
        }
    }
    function  getPresetName(inputListIndex, presetNameIndex) {
        var value = cparam_get_presetNameSettingIndividual(presetNameIndex);
        if (value != "" && value.indexOf("ER2:QSJ") == -1) {
            inputListObject[inputListIndex]['input'].val(value);
        } else {
            inputListObject[inputListIndex]['input'].val("Preset " + (presetNameIndex + 1));
        }
    }
    function  getPresetListName(inputListIndex) {
        var value = cparam_get_presetNameSettingIndividual(inputListIndex);
        if (value != "" && value.indexOf("ER2:QSJ") == -1) {
            inputListObject1[inputListIndex]['input'].val(value);
        } else {
            inputListObject1[inputListIndex]['input'].val("Preset " + (inputListIndex + 1));
        }
    }

    /**
     * サムネイル要素構築処理
     * @param list_index
     */
    function buildThumbnail(list_index) {
        // 追加ターゲットとなるHTML要素
        var target = "preset_list_" + ('0' + list_index).slice(-2);

        // CANVASの生成
        var canvasID = "preset_thumbnail_" + ('0' + list_index).slice(-2);

        if($("#"+canvasID)[0]){
            $("#"+canvasID).remove();
        }
        var cvs = document.createElement('img');
        cvs.id = canvasID;

        $('#' + target)[0].appendChild(cvs);
        // canvasの描画サイズ調整
        presetListObject[list_index]['thumbnail'] = $('#' + canvasID);
        presetListObject[list_index]['thumbnail'].css({
            width: THUMBNAIL_WIDTH + 'px',
            height: THUMBNAIL_HEIGHT + 'px'
        });
        presetListObject[list_index]['thumbnail'].attr("width", THUMBNAIL_WIDTH);
        presetListObject[list_index]['thumbnail'].attr("height", THUMBNAIL_HEIGHT);
        presetListObject[list_index]['thumbnail'].addClass('preset_thumbnail_inactive');

        presetListObject[list_index]['canvas'] = presetListObject[list_index]['thumbnail'][0];
    }
    /**
     * サムネイル要素構築処理
     * @param list_index
     */
    function buildThumbnailList(list_index) {
        // 追加ターゲットとなるHTML要素
        var target = "preset_list_area_" + ('0' + list_index).slice(-2);

        // CANVASの生成
        var canvasID = "preset_thumbnail_list_" + ('0' + list_index).slice(-2);

        if($("#"+canvasID)[0]){
            $("#"+canvasID).remove();
        }
        var cvs = document.createElement('img');
        cvs.id = canvasID;

        $('#' + target)[0].appendChild(cvs);
        // canvasの描画サイズ調整
        presetListObject1[list_index]['thumbnail'] = $('#' + canvasID);
        presetListObject1[list_index]['thumbnail'].css({
            width: 172 + 'px',
            height: 105 + 'px'
        });
        // presetListObject1[list_index]['thumbnail'].attr("width", 174);
        // presetListObject1[list_index]['thumbnail'].attr("height", 106);
        presetListObject1[list_index]['thumbnail'].addClass('preset_thumbnail_list');

        presetListObject1[list_index]['canvas'] = presetListObject1[list_index]['thumbnail'][0];
    }

    function presetInput(e) {
        if (delButtonFlg && !setButtonState) {
            return;
        }
        var idxFlg = Number(this.id.substr(this.id.length - 2, 2));
        var idx = Number(this.id.substr(this.id.length - 2, 2)) + ((indexFlg - 1) * 9);
        var value = $('#preset_input_0' + idxFlg).val();
        if (value == "") {
            $('#preset_input_0' + idxFlg).val("Preset " + (idx + 1));
        }
        var name = "";
        name = $("#preset_input_0" + idxFlg).val();
        var regu = "^[a-zA-Z0-9_\\s]*$";
        var re = new RegExp(regu);
        if (re.test(name)) {
            cparam_set_presetNameSettingIndividual(idx, name);
            getPresetName(idxFlg,idx);
        }else {
            jAlert(MSG_STATUS.mID_0045, NPTZ_WORDING.wID_0039, function(){
                getPresetName(idxFlg,idx);
            });

        }
    }

    function presetListInput(e) {
        if (delButtonFlg && !setButtonState) {
            return;
        }
        var idxFlg = Number(this.id.substr(this.id.length - 2, 2));
        var idx = Number(this.id.substr(this.id.length - 2, 2)) + ((indexFlg - 1) * 9);
        var value =  $('#preset_input_area_' + ("0"+idx).slice(-2)).val();
        if (value == "") {
            $('#preset_input_area_' + ("0"+idx).slice(-2)).val("Preset " + (idx + 1));
        }
        var name = "";
        name = $('#preset_input_area_' + ("0"+idx).slice(-2)).val();
        var regu = "^[a-zA-Z0-9_\\s]*$";
        var re = new RegExp(regu);
        if (re.test(name)) {
            cparam_set_presetNameSettingIndividual(idx, name);
            getPresetListName(idxFlg,idx);
        }else {
            jAlert(MSG_STATUS.mID_0045, NPTZ_WORDING.wID_0039, function(){
                getPresetListName(idxFlg,idx);
            });

        }
        return false;
    }

    function SetPreset(strPreset, id,index) {

        if (strPreset == "move") {
            cparam_set_recallPresetMemory(id - 1);
        }
        else if (strPreset == "set") {
            if($("#camera_presnt_"+(index+1)).css("color") == "rgb(74, 241, 8)"){
                jConfirm(MSG_STATUS.mID_0057 + (id) + MSG_STATUS.mID_0057_2, NPTZ_WORDING.wID_0001, NPTZ_WORDING.wID_0002, function(confirm){
                    if(confirm){
                        cparam_set_savePresetMemory(id-1);
                        $("#camera_presnt_"+(index+1)).css("color","rgb(74, 241, 8)")
                        presetIdListAll[100-id] = 1;
                        // setTimeout(function(){
                        //     $("#preset_thumbnail_0"+index)[0].src = "/cgi-bin/get_preset_thumbnail?preset_number=" + (id) + "?t=" + Math.random();
                        //     getPresetName(index,id-1)
                        //
                        // },3000)

                    }
            });
           }else{
                cparam_set_savePresetMemory(id-1);
                $("#camera_presnt_"+(index+1)).css("color","rgb(74, 241, 8)")
                presetIdListAll[100-id] = 1;
            };
        }
        else if (strPreset == "delete") {
            jConfirm(MSG_STATUS.mID_0058 + (id) + MSG_STATUS.mID_0058_2, NPTZ_WORDING.wID_0001, NPTZ_WORDING.wID_0002, function(confirm){
                if(confirm){
                    $("#preset_thumbnail_0"+index)[0].src = "/css/pc/parts/btn_cameraController_preset_normal.png";
                    cparam_set_deletePresetMemory(id - 1);
                    cparam_set_presetNameDelete(id - 1);
                    //getPresetName(index,id-1);
                    $("#camera_presnt_"+(index+1)).css("color","rgb(218, 218, 218)")
                    presetIdListAll[100-id] = 0;
                }
            });
        }
    }

    function SetListPreset(strPreset, id,index) {

        if (strPreset == "move") {
            cparam_set_recallPresetMemory(Number(id));
        }
        else if (strPreset == "set") {
            var num = "#camera_presnt_list_"+('0' + id).slice(-2);
            if($(num).css("color") == "rgb(74, 241, 8)"){
                jConfirm(MSG_STATUS.mID_0057 + (Number(id)+1) + MSG_STATUS.mID_0057_2, NPTZ_WORDING.wID_0001, NPTZ_WORDING.wID_0002, function(confirm){
                    if(confirm){
                        cparam_set_savePresetMemory(Number(id));
                        $(num).css("color","rgb(74, 241, 8)");
                        presetIdListAll[100-id] = 1;
                        // setTimeout(function(){
                        //     $("#preset_thumbnail_0"+index)[0].src = "/cgi-bin/get_preset_thumbnail?preset_number=" + (id) + "?t=" + Math.random();
                        //     getPresetName(index,id-1)
                        //
                        // },3000)

                    }
                });
            }else{
                cparam_set_savePresetMemory(Number(id));
                var num = "#camera_presnt_list_"+('0' + id).slice(-2);
                $(num).css("color","rgb(74, 241, 8)");
                presetIdListAll[100-id] = 1;
            };
        }
        else if (strPreset == "delete") {
            jConfirm(MSG_STATUS.mID_0058 + (Number(id)+1) + MSG_STATUS.mID_0058_2, NPTZ_WORDING.wID_0001, NPTZ_WORDING.wID_0002, function(confirm){
                if(confirm){
                    $("#preset_thumbnail_list_"+id)[0].src = "/css/pc/parts/btn_cameraController_preset_normal.png";
                    cparam_set_deletePresetMemory(Number(id));
                    cparam_set_presetNameDelete(Number(id));
                    var num = "#camera_presnt_list_"+('0' + id).slice(-2);
                    $(num).css("color","rgb(218, 218, 218)")
                    presetIdListAll[100-(Number(id)+1)] = 0;
                    //getPresetListName(parseInt(id));
                }

            });
        }
    }

    /**
     * サムネイルのクリック イベント
     * @param e
     */
    function presetSelect(e) {
        // クリックされた要素からインデックスを取得

        var idx = Number(this.id.substr(this.id.length - 2, 2));
        var idxFlg = Number(this.id.substr(this.id.length - 2, 2)) + ((indexFlg - 1) * 9) + 1;
        presetDeleteNum = idx;
        presetListObject[idx]['object'].removeClass('preset_list_off');
        presetListObject[idx]['object'].removeClass('preset_list_off_hover');
        presetListObject[idx]['object'].addClass('preset_list_on');

        if (presetState == PRESET_AVAILABLE) {
            if (delButtonFlg == RECODE_MODE) {
                if (setButtonState == RECODE_MODE) {
                    SetPreset("set", idxFlg, idx);
                } else {
                    SetPreset("move", idxFlg, idx);
                    if(adminPage){
                        setTimeout(function(){
                            window.parent.imageAdjustInstance.settingBrightness.getPresetToImageAdjustValue();
                        },2000);
                    }
                }
            } else {
                SetPreset("delete", idxFlg, idx);
            }
        }
    }

    /**
     * サムネイルのクリック イベント
     * @param e
     */
    function presetListSelect(e) {
        // クリックされた要素からインデックスを取得
        if(event.target.id.indexOf("preset_input_area") == -1){
            var idx = this.id.substr(this.id.length - 2, 2);
            presetDeleteNum = Number(idx);
            presetListObject1[presetDeleteNum]['object'].removeClass('preset_list_off');
            presetListObject1[presetDeleteNum]['object'].removeClass('preset_list_off_hover');
            presetListObject1[presetDeleteNum]['object'].addClass('preset_list_on');

            if (presetState == PRESET_AVAILABLE) {
                if (delButtonFlg == RECODE_MODE) {
                    if (setButtonState == RECODE_MODE) {
                        SetListPreset("set", idx);
                    } else {
                        SetListPreset("move", idx);
                    }
                } else {
                    SetListPreset("delete", idx);
                }
            }
        }
    }



    function presetMouseOn(e) {
        var idx = Number(this.id.substr(this.id.length - 2, 2));
        presetListObject[idx]['object'].removeClass('preset_list_off');
        presetListObject[idx]['object'].addClass('preset_list_off_hover');
    }

    function presetSelectUp(e) {
        // クリックされた要素からインデックスを取得
        var idx = Number(this.id.substr(this.id.length - 2, 2));
        presetListObject[idx]['object'].removeClass('preset_list_off_hover');
        presetListObject[idx]['object'].addClass('preset_list_off');
    }

    function presetListMouseOn(e) {
        var idx = Number(this.id.substr(this.id.length - 2, 2));
        presetListObject1[idx]['object'].removeClass('preset_list_off');
        presetListObject1[idx]['object'].addClass('preset_list_off_hover');
    }

    function presetListSelectUp(e) {
        e.stopPropagation();
        // クリックされた要素からインデックスを取得
        var idx = Number(this.id.substr(this.id.length - 2, 2));
        presetListObject1[idx]['object'].removeClass('preset_list_off_hover');
        presetListObject1[idx]['object'].addClass('preset_list_off');
    }

    /**
     * 「SET」ボタン押下時の処理
     * @param {number} mouse マウス・ボタン操作状況
     */
    function callPresetSet(mouse) {
        if (mouse == Button.MOUSE_DOWN) {
            if (setButtonState == PRESET_MODE) {
                delButtonFlg = RECODE_MODE;
                setButtonState = RECODE_MODE;
                btnObject[BTN_PRESET_LIST].displayOn();
                btnObject[BTN_PRESET_LIST_SET].displayOn();
                $("#preset_set_label").empty();
                $("#preset_set_label").html(NPTZ_WORDING.wID_0019);

                delButtonState = PRESET_MODE;
                btnObject[BTN_PRESET_DELETE].displayOff();
                btnObject[BTN_PRESET_LIST_DELETE].displayOff();
                for (var i = 0; i < MAX_OBJECT_NUM; i++) {
                    $('#preset_input_0' + i).attr("readonly", false);
                    $('#preset_input1_0' + i).attr("readonly", false);
                }
                //Preset100入力ができない修正
                for (var i = 0; i < 100; i++) {
                    var inputID = "preset_input_area_" + ('0' + i).slice(-2);
                    $('#' + inputID).attr("readonly", false);
                    $('#' + inputID).attr("readonly", false);
                }
                $("#div_border").show();
            } else {
                setButtonState = PRESET_MODE;

                $("#preset_set_label").empty();

                btnObject[BTN_PRESET_LIST].displayOff();
                btnObject[BTN_PRESET_LIST_SET].displayOff();
                for (var i = 0; i < MAX_OBJECT_NUM; i++) {
                    $('#preset_input_0' + i).attr("readonly", true);
                    $('#preset_input1_0' + i).attr("readonly", true);
                }
                //Preset100入力ができない修正
                for (var i = 0; i < 100; i++) {
                    var inputID = "preset_input_area_" + ('0' + i).slice(-2);
                    $('#' + inputID).attr("readonly", true);
                    $('#' + inputID).attr("readonly", true);
                }
                $("#div_border").hide();
            }
        } else {
            // 処理なし
        }
    }

    /**
     * 「CLEAR」ボタン押下時の処理
     * @param {number} mouse マウス・ボタン操作状況
     */
    function callPresetDelete(mouse) {
        if (mouse == Button.MOUSE_DOWN) {
            if (delButtonState == PRESET_MODE) {
                delButtonFlg = false;
                delButtonState = RECODE_MODE;
                btnObject[BTN_PRESET_DELETE].displayOn();
                btnObject[BTN_PRESET_LIST_DELETE].displayOn();
                $("#preset_set_label").empty();
                $("#preset_set_label").html(NPTZ_WORDING.wID_0020);

                setButtonState = PRESET_MODE;
                btnObject[BTN_PRESET_LIST].displayOff();
                btnObject[BTN_PRESET_LIST_SET].displayOff();
                for (var i = 0; i < 9; i++) {
                    $('#preset_input_0' + i).attr("readonly", true);
                    $('#preset_input1_0' + i).attr("readonly", true);
                }
                $("#div_border").show();
            } else {
                delButtonFlg = true;
                delButtonState = PRESET_MODE;
                btnObject[BTN_PRESET_DELETE].displayOff();
                btnObject[BTN_PRESET_LIST_DELETE].displayOff();
                $("#preset_set_label").empty();
                $("#div_border").hide();
            }
        } else {
            // 処理なし
        }
    }

    function callPresetHome(mouse) {
        if (mouse == Button.MOUSE_DOWN) {
            cparam_set_absolutePositionControl2(8000, 8000);
        }
    }
    var buildPresetListFlg = false;
    function callPresetList(mouse) {
        if (mouse == Button.MOUSE_DOWN) {
            if(btnObject[BTN_PRESET_LIST_ALL].getStatus() == Button.STATUS_ON){
                btnObject[BTN_PRESET_LIST_ALL].displayOff();
                $("#preset_list_area").hide();
                $("#tracking_controller").show();
                var gsStNo = menubarCtrl.menubar_GetStreamNo();
                menubarCtrl.streamControler.callBtnStream(Button.MOUSE_DOWN,parseInt(gsStNo.substr(gsStNo.length-1,1)-1),true)
            }else{
                btnObject[BTN_PRESET_LIST_ALL].displayOn();

                if(!buildPresetListFlg){
                    buildPresetListFlg = true;
                    buildPresetList();
                    $("#preset_list_area").show();
                    for(var i = 50;i<100;i++){
                        $("#preset_list_area_"+i).hide();
                    }
                }else{
                    $("#preset_list_area").show();
                }
                $("#tracking_controller").hide();
                mainViewStopLive();
            }

        }
    }

    function callbackChangePage(mouse,index) {
        if (mouse == Button.MOUSE_DOWN) {
            changeDisplayMode(index);
        }
    }

    function callbackPresetListBack(mouse,index) {
        if (mouse == Button.MOUSE_DOWN) {
            btnObject[BTN_PRESET_LIST_ALL].displayOff();
            $("#preset_list_area").hide();
            $("#tracking_controller").show();
            var gsStNo = menubarCtrl.menubar_GetStreamNo();
            menubarCtrl.streamControler.callBtnStream(Button.MOUSE_DOWN,parseInt(gsStNo.substr(gsStNo.length-1,1)-1),true)
        }
    }

    function changeDisplayMode(index){
        if(index == 1){
            for(var i = 0;i<50;i++){
                $("#preset_list_area_" + ('0' + i).slice(-2)).show();
                $("#preset_list_area_" + ('0' + (i+50)).slice(-2)).hide();
            }
            btnObject[BTN_PRESET_LIST_PAGE_1].displayOn();
            btnObject[BTN_PRESET_LIST_PAGE_2].displayOff();
        }else{
            for(var i = 0;i<50;i++){
                $("#preset_list_area_" + ('0' + i).slice(-2)).hide();
                $("#preset_list_area_" + ('0' + (i+50)).slice(-2)).show();
            }
            btnObject[BTN_PRESET_LIST_PAGE_1].displayOff();
            btnObject[BTN_PRESET_LIST_PAGE_2].displayOn();
        }
    }

    function buildPresetList(){
        for (var i = 0; i < MAX_OBJECT_LIST_NUM; i++) {
            // HTML要素の構築(リストエリアベース)
            presetListObject1[i] = {};
            presetListObject1[i]['id'] = null;
            var index = "preset_list_area_" + ('0' + i).slice(-2);
            var div = document.createElement('div');
            div.id = index;
            presetListObject1[i]['object'] = $(div);
            presetListObject1[i]['object'].addClass("preset_list");
            presetListObject1[i]['object'].addClass("preset_list_off");
            var num = i;
            var px = 0;
            var py = 0;
            if(i>49){
                num  = i-50;
                px = (num % 10) * 174+((num % 10)*15);
                py = Math.floor(num / 10) * 156;
            }else{
                px = (num % 10) * 174 +((num % 10)*15);
                py = Math.floor(num / 10) * 156;
            }
            presetListObject1[i]['object'].css({
                top: py + 'px',
                left: px + 'px'
            });
            document.getElementById("preset_area").appendChild(div);

            // リストオブジェクトクリック時の制御
            presetListObject1[i]['object'].mousedown(presetListSelect);
            presetListObject1[i]['object'].mouseup(presetListSelectUp);
            presetListObject1[i]['object'].mouseover(presetListMouseOn);
            presetListObject1[i]['object'].mouseleave(presetListSelectUp);
            buildThumbnailList(i);
            buildPresetListInput(index,i);
            // 各オブジェクトの追加
            $('#camera_presnt_' + (i + 1)).removeClass('camera_presnt_show');
            $('#camera_presnt_' + (i + 1)).addClass('camera_presnt_disabled');

            if(gPower == 1){
                if(presetIdListAll[99-i] == 1){
                    var num = "#camera_presnt_list_"+('0' + i).slice(-2);
                    $(num).css("color","rgb(74, 241, 8)")
                }
                initGetPresetListImagePara();
                if (getImageId == null) {
                    bindLoadEventList(i);
                    getImageId = setInterval(function(){
                        clearInterval(getImageId);
                        getImageId = null;
                        gIndex = 0;
                        if (gCheckPresetImageTimerID != null) {
                            clearInterval(gCheckPresetImageTimerID);
                        }
                        gCheckPresetImageTimerID = setInterval(intervalCheckPresetListImage, 500);
                    }, 400);
                }
            }
        }
    }

    function intervalCheckPresetListImage() {
        var isFinishFlag = true;
        for(var i = 0; i < 100; i++) {
            if (sucessStateIndexList[i] != i) {
                isFinishFlag = false;
                if(i <= 99){
                    var id  = "#preset_thumbnail_list_"+('0' + i).slice(-2);
                    getPresetListName(i);
                    $(id)[0].src = "/cgi-bin/get_preset_thumbnail?preset_number=" + (i + 1) + "?t=" + Math.random();
                }
                errorProcessList(i);
                break;
            }
        }
        if(isFinishFlag) {
            isGetPresetImaging = false;
            if(gCheckPresetImageTimerID != null) {
                clearInterval(gCheckPresetImageTimerID);
                gCheckPresetImageTimerID = null;
            }
        }
    }

    /**
     * 「Index」ボタン押下時の処理
     * @param {number} mouse マウス・ボタン操作状況
     */
    var gIndex = 0;
    var num = 0;
    function callPresetIndex(mouse, index) {
        if (mouse == Button.MOUSE_DOWN) {
            presetIdListAll = getPresetIdStatus();
            indexFlg = index;
            if (index == 12) {
                for (var i = 0; i < 8; i++) {
                    $("#camera_presnt_" + (i + 2)).hide();
                    $("#input_list_0" + (i + 1)).hide();
                    $("#preset_list_0" + (i + 1)).hide();
                    preset = true;
                }
            } else {
                if (preset) {
                    for (var i = 0; i < 8; i++) {
                        $("#camera_presnt_" + (i + 2)).show();
                        $("#input_list_0" + (i + 1)).show();
                        $("#preset_list_0" + (i + 1)).show();
                    }
                    preset = false;
                }

            }
            thumbnailIndex = index - 1;
            for (var i = 0; i < btnObject1.length; i++) {
                btnObject1[i].displayOff();
            }
            btnObject1[index - 1].displayOn();
            btnObject1[index + 11].displayOn();
            num = (index - 1) * 9;
            for (var i = 0; i < MAX_OBJECT_NUM; i++) {
                var presetId = (index - 1) * 9 + i + 1;
                buildThumbnail(i);

                $('#camera_presnt_' + (i + 1)).html(presetId);
                if(presetIdListAll[100-presetId]==1){
                    $("#camera_presnt_"+(i+1)).css("color","rgb(74, 241, 8)")
                }else{
                    $("#camera_presnt_"+(i+1)).css("color","rgb(218, 218, 218)")
                }
            }

            initGetPresetImagePara();
            if (getImageId == null) {
                getImageId = setInterval(getPresetImage, 400);
            }
            initThumbnailStatus = cparam_get_presetNameThumbnailCounter(thumbnailIndex).split(":");
        } else {
            // 処理なし
        }
    }

    function updatePresetImage(imageList) {
        for (var i = 0; i < imageList.length; i++) {
            var image = imageList[i];
            if (image != null) {
                var bin = atob(image.replace(/^.*,/, ''));
                var buffer = new Uint8Array(bin.length);
                for (var p = 0; p < bin.length; p++) {
                    buffer[p] = bin.charCodeAt(p);
                }
                try {
                    var blob = new Blob([buffer.buffer], {
                        type: 'image/jpeg'
                    });
                    presetListObject[i]['image'].src = URL.createObjectURL(blob);
                } catch (e) {
                    // 何もしない。
                }
            }
        }
    }

    /**
     * カメラ状態情報更新処理<br>
     * @param {object} status カメラ状態
     */
    function updateStatus(status) {
        if (status == 1) {
            // connection=0である場合は押下不可とする。
            if (gPower == 0) {
                presetState = PRESET_DISABLE;
            } else if (status == 1) {
                presetState = PRESET_AVAILABLE;
                for (var i = 0; i < MAX_OBJECT_NUM; i++) {
                    presetListObject[i]['object'].removeClass('preset_list_on');
                    presetListObject[i]['object'].removeClass('preset_list_disable');
                    presetListObject[i]['object'].addClass('preset_list_off');
                    presetListObject[i]['thumbnail'].show();
                    inputListObject[i]['input'].removeClass('preset_input_disabled');
                    inputListObject[i]['input'].addClass('preset_input_show');
                    $('#camera_presnt_' + (i + 1)).removeClass('camera_presnt_disabled');
                    $('#camera_presnt_' + (i + 1)).addClass('camera_presnt_show');

                    var presetId = (indexFlg - 1) * 9 + i + 1;

                    if(presetIdListAll[100-presetId]==1){
                        $("#camera_presnt_"+(i+1)).css("color","rgb(74, 241, 8)")
                    }else{
                        $("#camera_presnt_"+(i+1)).css("color","rgb(218, 218, 218)")
                    }

                }
                btnObject[BTN_PRESET_LIST].displayOff();
                btnObject[BTN_PRESET_DELETE].displayOff();
                btnObject[BTN_PRESET_HOME].displayOff();
                btnObject[BTN_PRESET_LIST_ALL].displayOff();

                for (var obj in btnObject1) {
                    btnObject1[obj].displayOff();
                }
                btnObject1[indexFlg-1].displayOn();
                btnObject1[indexFlg+11].displayOn();
                if(setButtonState){
                    btnObject[BTN_PRESET_LIST].displayOn();
                }
                if(delButtonState){
                    btnObject[BTN_PRESET_DELETE].displayOn();
                }
            }
        } else {
            btnObject[BTN_PRESET_LIST].displayDisabled();
            btnObject[BTN_PRESET_DELETE].displayDisabled();
            btnObject[BTN_PRESET_HOME].displayDisabled();
            btnObject[BTN_PRESET_LIST_ALL].displayDisabled();
            presetState = PRESET_DISABLE;
            for (var i = 0; i < MAX_OBJECT_NUM; i++) {
                presetListObject[i]['object'].removeClass('preset_list_off');
                presetListObject[i]['object'].removeClass('preset_list_on');
                presetListObject[i]['object'].addClass('preset_list_disable');
                presetListObject[i]['thumbnail'].hide();

                inputListObject[i]['input'].removeClass('setting_set_input');
                inputListObject[i]['input'].addClass('preset_input_disabled');
                $('#camera_presnt_' + (i + 1)).removeClass('camera_presnt_show');
                $('#camera_presnt_' + (i + 1)).addClass('camera_presnt_disabled');
                $('#camera_presnt_' + (i + 1)).css("color","rgb(218, 218, 218)")
            }
            for (var obj in btnObject1) {
                btnObject1[obj].displayDisabled();
            }
        }
    }

    var retryCount = [];
    var retryCountList = [];
    function errorProcess(thumbIndex) {
        if(retryCount[thumbIndex] < 4) {
            retryCount[thumbIndex] = retryCount[thumbIndex] + 1;
        } else {
            retryCount[thumbIndex] = 0;
            sucessStateIndex[thumbIndex] = thumbIndex;
            $("#preset_thumbnail_0" + thumbIndex).attr('src', '/css/pc/parts/btn_cameraController_preset_normal.png');
        }
    }
    function errorProcessList(thumbIndex) {
        if(retryCountList[thumbIndex] < 4) {
            retryCountList[thumbIndex] = retryCountList[thumbIndex] + 1;
        } else {
            retryCountList[thumbIndex] = 0;
            sucessStateIndexList[thumbIndex] = thumbIndex;
            $("#preset_thumbnail_list_" + thumbIndex).attr('src', '/css/pc/parts/btn_cameraController_preset_normal.png');
        }
    }
    function bindLoadEvent() {
        for(var i = 0; i < 9; i++) {
            $("#preset_thumbnail_0" + i).bind("load", function () {
                var isEqualVale = false;
                var thumbIndex  = Number(this.id.substr(this.id.length - 1, 1));
                for (var i = 0; i < 9; i++) {
                    if (sucessStateIndex[thumbIndex] == thumbIndex) {
                        isEqualVale = true;
                        break;
                    }
                }
                if (!isEqualVale) {
                    sucessStateIndex[thumbIndex] = thumbIndex;
                }
            });
        }
    }
    function bindLoadEventList(i) {
        var id  = "#preset_thumbnail_list_"+('0' + i).slice(-2);
            $(id).bind("load", function () {
                var isEqualVale = false;
                var thumbIndex  = Number(this.id.substr(this.id.length - 2, 2));
                for (var i = 0; i < 100; i++) {
                    if (sucessStateIndexList[thumbIndex] == thumbIndex) {
                        isEqualVale = true;
                        break;
                    }
                }
                if (!isEqualVale) {
                    sucessStateIndexList[thumbIndex] = thumbIndex;
                }
            });
    }

    function intervalCheckPresetImage() {
        var isFinishFlag = true;
        for(var i = 0; i < 9; i++) {
            if (sucessStateIndex[i] != i) {
                isFinishFlag = false;
                var num = (indexFlg - 1) * 9 + i;
                if(num <= 99){
                    getPresetName(i, num);
                    $("#preset_thumbnail_0" + i)[0].src = "/cgi-bin/get_preset_thumbnail?preset_number=" + (num + 1) + "?t=" + Math.random();
                }
                errorProcess(i);
                break;
            }
        }
        if(isFinishFlag) {
            isGetPresetImaging = false;
            if(gCheckPresetImageTimerID != null) {
                clearInterval(gCheckPresetImageTimerID);
                gCheckPresetImageTimerID = null;
            }
        }
    }
    var isGetPresetImaging = false;
    var sucessStateIndex =[];
    var sucessStateIndexList =[];
    function getPresetImage() {
        if (gIndex >= 9) {
            clearInterval(getImageId);
            getImageId = null;
            gIndex = 0;
            if (gCheckPresetImageTimerID != null) {
                clearInterval(gCheckPresetImageTimerID);
            }
            gCheckPresetImageTimerID = setInterval(intervalCheckPresetImage, 500);
            return;
        }
        isGetPresetImaging = true;
        bindLoadEvent();
        var num = (indexFlg - 1) * 9 + gIndex;
        if(num<=99){
            getPresetName(gIndex,num);
            // get preset thumbnail
            $("#preset_thumbnail_0" + gIndex)[0].src = "/cgi-bin/get_preset_thumbnail?preset_number=" + (num + 1) + "?t=" + Math.random();
        }
        ++gIndex;
    }

    function initGetPresetImagePara() {
        gIndex = 0;
        for(var i = 0; i < 9; i++) {
            retryCount[i] = 0;
        }
        isGetPresetImaging = false;
        sucessStateIndex = [];
        if(gCheckPresetImageTimerID) {
            clearInterval(gCheckPresetImageTimerID);
            gCheckPresetImageTimerID = null;
        }
        if(getImageId) {
            clearInterval(getImageId);
            getImageId = null;
        }
    }
    function initGetPresetListImagePara() {
        gIndex = 0;
        for(var i = 0; i < 100; i++) {
            retryCountList[i] = 0;
        }
        isGetPresetImaging = false;
        sucessStateIndexList = [];
        if(gCheckPresetImageTimerID) {
            clearInterval(gCheckPresetImageTimerID);
            gCheckPresetImageTimerID = null;
        }
        if(getImageId) {
            clearInterval(getImageId);
            getImageId = null;
        }
    }

    function presetSelectinput() {
        var idx = Number(this.id.substr(this.id.length - 2, 2));
        if (!delButtonFlg) {
            $('#preset_input_0' + idx).val("");
        }
    }

    function presetSelectListinput() {
        var idx = Number(this.id.substr(this.id.length - 2, 2));
        if (!delButtonFlg) {
            $('#preset_input_area_' + ("0"+idx).slice(-2)).val("");
        }
    }


    function initControllerButtons3() {
    }

    function initControllerButtonsDisabled3() {
    }

    function controllerChangePresetNo3(selectedIndex) {
    }

    function callbackPresetCtrl(mouse, type) {
        if (mouse == Button.MOUSE_DOWN) {
            if (type == BTN_SETUP_PRESET_HOME) {
                setButtonState = PRESET_MODE;
                delButtonFlg = RECODE_MODE;
                delButtonState = PRESET_MODE;
                $("#preset_set_label").empty();
                btnPresetObject[BTN_SETUP_PRESET_SET].displayOff();
                btnPresetObject[BTN_SETUP_PRESET_DELETE].displayOff();
                btnPresetObject[BTN_SETUP_PRESET_HOME].displayOff();
                for (var i = 0; i < MAX_OBJECT_NUM; i++) {
                    $('#preset_input_0' + i).attr("readonly", true);
                    $('#preset_input1_0' + i).attr("readonly", true);
                }
                $("#div_border").hide();
                cparam_set_absolutePositionControl2(8000, 8000);
            } else if (type == BTN_SETUP_PRESET_SET) {
                if (setButtonState == PRESET_MODE) {
                    setButtonState = RECODE_MODE;
                    delButtonState = PRESET_MODE;
                    delButtonFlg = RECODE_MODE;
                    $("#preset_set_label").empty();
                    $("#preset_set_label").html(NPTZ_WORDING.wID_0019);
                    btnPresetObject[BTN_SETUP_PRESET_SET].displayOn();
                    btnPresetObject[BTN_SETUP_PRESET_HOME].displayOff();
                    btnPresetObject[BTN_SETUP_PRESET_DELETE].displayOff();
                    for (var i = 0; i < MAX_OBJECT_NUM; i++) {
                        $('#preset_input_0' + i).attr("readonly", false);
                        $('#preset_input1_0' + i).attr("readonly", false);
                    }
                    $("#div_border").show();
                } else {
                    setButtonState = PRESET_MODE;
                    delButtonFlg = RECODE_MODE;
                    delButtonState = PRESET_MODE;
                    $("#preset_set_label").empty();
                    btnPresetObject[BTN_SETUP_PRESET_SET].displayOff();
                    btnPresetObject[BTN_SETUP_PRESET_DELETE].displayOff();
                    btnPresetObject[BTN_SETUP_PRESET_HOME].displayOff();
                    for (var i = 0; i < MAX_OBJECT_NUM; i++) {
                        $('#preset_input_0' + i).attr("readonly", true);
                        $('#preset_input1_0' + i).attr("readonly", true);
                    }
                    $("#div_border").hide();
                }
            } else if (type == BTN_SETUP_PRESET_DELETE) {
                if (delButtonState == PRESET_MODE) {
                    delButtonState = RECODE_MODE;
                    delButtonFlg = PRESET_MODE;
                    setButtonState = PRESET_MODE;
                    $("#preset_set_label").empty();
                    $("#preset_set_label").html(NPTZ_WORDING.wID_0020);
                    btnPresetObject[BTN_SETUP_PRESET_SET].displayOff();
                    btnPresetObject[BTN_SETUP_PRESET_DELETE].displayOn();
                    btnPresetObject[BTN_SETUP_PRESET_HOME].displayOff();
                    for (var i = 0; i < MAX_OBJECT_NUM; i++) {
                        $('#preset_input_0' + i).attr("readonly", true);
                        $('#preset_input1_0' + i).attr("readonly", true);
                    }
                    $("#div_border").show();
                } else {
                    setButtonState = PRESET_MODE;
                    delButtonState = PRESET_MODE;
                    delButtonFlg = RECODE_MODE;
                    $("#preset_set_label").empty();
                    btnPresetObject[BTN_SETUP_PRESET_SET].displayOff();
                    btnPresetObject[BTN_SETUP_PRESET_HOME].displayOff();
                    btnPresetObject[BTN_SETUP_PRESET_DELETE].displayOff();
                    for (var i = 0; i < MAX_OBJECT_NUM; i++) {
                        $('#preset_input_0' + i).attr("readonly", true);
                        $('#preset_input1_0' + i).attr("readonly", true);
                    }
                    $("#div_border").hide();
                }
            }
        }
    }

    function getThumbnailStatus() {
        var url = isPageFlg;
        if(window.location.href.indexOf("live") !="-1"){
            if(adminPage && window.parent.document.getElementById("setup_imageAdjust_main").style.display == "none"){
                return;
            }
        }
        if ($("#camera_controller_gui").css("display") != "none" && ($("#camera_controller_gui").hasClass("camera_controller_gui_to_setup_preset")||$("#camera_controller_gui").hasClass("camera_controller_gui_to_setup_preset_ppls")) || url == "live") {
            if(isGetPresetImaging || !liveModeFlg) {
                return;
            }
           if($("#preset_list_area").is(":hidden") || url == "admin"){
                var retBuf = cparam_get_presetNameThumbnailCounter(thumbnailIndex).split(":");
                if (parseInt(retBuf[0],16) == thumbnailIndex) {
                    if(retBuf[1] != initThumbnailStatus[1]) {
                        if($("#preset_list_area").is(":hidden") || url == "admin"){
                            initGetPresetImagePara();
                        }else{
                            initGetPresetListImagePara();
                        }

                    } else {
                        return;
                    }
                    var currentValue = retBuf[1].split("");
                    var initValue = initThumbnailStatus[1].split("");

                    for (var i = 0; i < currentValue.length; i++) {
                        if (currentValue[i] == initValue[i]) {
                            var pageIndex = parseInt(-(i - 8));
                            sucessStateIndex[pageIndex] = pageIndex;
                        }
                    }
                    if(getImageId == null){
                        getImageId = setInterval(function () {
                            if(sucessStateIndex[gIndex] == gIndex) {
                                gIndex++;
                                return;
                            } else {
                                getPresetImage();
                                var num = (indexFlg - 1) * 9 + gIndex;
                                presetIdListAll =  getPresetIdStatus();
                                if(presetIdListAll[100-num]==1){
                                    $("#camera_presnt_"+gIndex).css("color","rgb(74, 241, 8)")
                                }else{
                                    $("#camera_presnt_"+gIndex).css("color","rgb(218, 218, 218)")
                                }

                            }
                        },400);
                    }
                    initThumbnailStatus = retBuf;
                }


           }else{
               var isChange = false;
               var changeCount = 0;
               var changeIndexList = [];
               var retBufList = [];
               for(var indexPage = 0; indexPage < 12; indexPage++) {
                   var retBuf = cparam_get_presetNameThumbnailCounter(indexPage).split(":");
                   if (parseInt(retBuf[0],16) == indexPage) {
                       retBufList[indexPage] = retBuf[1];
                   }
                   if(retBufList[indexPage] != initAllThumbnailStatus[indexPage]) {
                       isChange = true;
                       var currentValue = retBufList[indexPage].split("");
                       var initValue = initAllThumbnailStatus[indexPage].split("");

                       for (var i = 0; i < currentValue.length; i++) {
                           if (currentValue[i] != initValue[i]) {
                               changeIndexList[changeCount] = (indexPage * 9) + (9 - i -1);
                               sucessStateIndexList[changeIndexList[changeCount]] = null;
                               retryCountList[changeIndexList[changeCount]] = 0;
                               if(gCheckPresetImageTimerID != null) {
                                   clearInterval(gCheckPresetImageTimerID);
                                   gCheckPresetImageTimerID = null;
                               }
                               gCheckPresetImageTimerID = setInterval(intervalCheckPresetListImage, 500);
								presetIdListAll = getPresetIdStatus();
								if(presetIdListAll[100-changeIndexList[changeCount] - 1]==1){
                                    $("#camera_presnt_list_"+('0' + changeIndexList[changeCount]).slice(-2)).css("color","rgb(74, 241, 8)")
                                }else{
                                    $("#camera_presnt_list_"+('0' + changeIndexList[changeCount]).slice(-2)).css("color","rgb(218, 218, 218)")
                                }
                               changeCount++;
                           }
                       }

                   }

               }
               if(isChange){
                   initAllThumbnailStatus = retBufList;
               } else {
                   changeIndexList = [];
               }


           }
        }
    }


    return {
        build: function () {
            if (buildFlag == false) {
                buildFlag = true;
                btnObject[BTN_PRESET_LIST] = ButtonCtrl('preset_list', 'btn_preset_set', NPTZ_WORDING.wID_0019, callPresetSet);
                btnObject[BTN_PRESET_DELETE] = ButtonCtrl('preset_list', 'btn_preset_delete', NPTZ_WORDING.wID_0020, callPresetDelete);
                btnObject[BTN_PRESET_HOME] = ButtonCtrl('preset_list', 'btn_preset_home', NPTZ_WORDING.wID_0415, callPresetHome);
                btnObject[BTN_PRESET_LIST_ALL] = ButtonCtrl('base_header', 'btn_preset_list', "", callPresetList);
                btnObject[BTN_PRESET_LIST_BACK] = ButtonCtrl('preset_list_area', 'btn_preset_list_back', NPTZ_WORDING.wID_0483, callbackPresetListBack, 2);

                btnObject[BTN_PRESET_LIST_SET] = ButtonCtrl('preset_list_area', 'btn_preset_set', NPTZ_WORDING.wID_0019, callPresetSet);
                btnObject[BTN_PRESET_LIST_DELETE] = ButtonCtrl('preset_list_area', 'btn_preset_delete', NPTZ_WORDING.wID_0020, callPresetDelete);
                btnObject[BTN_PRESET_LIST_HOME] = ButtonCtrl('preset_list_area', 'btn_preset_list_home', NPTZ_WORDING.wID_0415, callPresetHome);

                btnObject[BTN_PRESET_LIST_SET].getButtonObject().addClass("btn_preset_list_set");
                btnObject[BTN_PRESET_LIST_DELETE].getButtonObject().addClass("btn_preset_list_delete");
                //btnObject[BTN_PRESET_LIST_HOME].getButtonObject().addClass("btn_preset_list_home");
                btnObject[BTN_PRESET_LIST_SET].getButtonObject().css("top","auto");
                btnObject[BTN_PRESET_LIST_DELETE].getButtonObject().css("top","auto");
                //btnObject[BTN_PRESET_LIST_HOME].getButtonObject().css("top","auto");


                btnObject[BTN_PRESET_LIST_PAGE_1] = ButtonCtrl('live_page', 'btn_preset_list_page_1', NPTZ_WORDING.wID_0021, callbackChangePage, 1);
                btnObject[BTN_PRESET_LIST_PAGE_2] = ButtonCtrl('live_page', 'btn_preset_list_page_2', NPTZ_WORDING.wID_0022, callbackChangePage, 2);

                btnObject[BTN_PRESET_LIST_SET].show();
                btnObject[BTN_PRESET_LIST_DELETE].show();
                btnObject[BTN_PRESET_LIST_HOME].show();
                btnObject[BTN_PRESET_LIST_PAGE_1].show();
                btnObject[BTN_PRESET_LIST_PAGE_2].show();
                btnObject[BTN_PRESET_LIST_BACK].show();

                btnObject[BTN_PRESET_LIST_SET].displayOff();
                btnObject[BTN_PRESET_LIST_DELETE].displayOff();
                btnObject[BTN_PRESET_LIST_HOME].displayOff();
                btnObject[BTN_PRESET_LIST_PAGE_1].displayOn();
                btnObject[BTN_PRESET_LIST_PAGE_2].displayOff();
                btnObject[BTN_PRESET_LIST_BACK].displayOff();

                if(isPageFlg == "admin"){
                    btnObject[BTN_PRESET_LIST_ALL].hide();
                }else{
                    btnObject[BTN_PRESET_LIST_ALL].show();
                }
                btnObject[BTN_PRESET_LIST_ALL].displayOff();
                btnObject1[0] = ButtonCtrl('preset_list', 'btn_preset_1', NPTZ_WORDING.wID_0021, callPresetIndex, 1);
                btnObject1[1] = ButtonCtrl('preset_list', 'btn_preset_2', NPTZ_WORDING.wID_0022, callPresetIndex, 2);
                btnObject1[2] = ButtonCtrl('preset_list', 'btn_preset_3', NPTZ_WORDING.wID_0023, callPresetIndex, 3);
                btnObject1[3] = ButtonCtrl('preset_list', 'btn_preset_4', NPTZ_WORDING.wID_0024, callPresetIndex, 4);
                btnObject1[4] = ButtonCtrl('preset_list', 'btn_preset_5', NPTZ_WORDING.wID_0025, callPresetIndex, 5);
                btnObject1[5] = ButtonCtrl('preset_list', 'btn_preset_6', NPTZ_WORDING.wID_0026, callPresetIndex, 6);
                btnObject1[6] = ButtonCtrl('preset_list', 'btn_preset_7', NPTZ_WORDING.wID_0027, callPresetIndex, 7);
                btnObject1[7] = ButtonCtrl('preset_list', 'btn_preset_8', NPTZ_WORDING.wID_0028, callPresetIndex, 8);
                btnObject1[8] = ButtonCtrl('preset_list', 'btn_preset_9', NPTZ_WORDING.wID_0029, callPresetIndex, 9);
                btnObject1[9] = ButtonCtrl('preset_list', 'btn_preset_10', NPTZ_WORDING.wID_0416, callPresetIndex, 10);
                btnObject1[10] = ButtonCtrl('preset_list', 'btn_preset_11', NPTZ_WORDING.wID_0417, callPresetIndex, 11);
                btnObject1[11] = ButtonCtrl('preset_list', 'btn_preset_12', NPTZ_WORDING.wID_0418, callPresetIndex, 12);
                btnObject1[12] = ButtonCtrl('camera_controller_gui_open_preset', 'btn_preset1_1', NPTZ_WORDING.wID_0021, callPresetIndex, 1);
                btnObject1[13] = ButtonCtrl('camera_controller_gui_open_preset', 'btn_preset1_2', NPTZ_WORDING.wID_0022, callPresetIndex, 2);
                btnObject1[14] = ButtonCtrl('camera_controller_gui_open_preset', 'btn_preset1_3', NPTZ_WORDING.wID_0023, callPresetIndex, 3);
                btnObject1[15] = ButtonCtrl('camera_controller_gui_open_preset', 'btn_preset1_4', NPTZ_WORDING.wID_0024, callPresetIndex, 4);
                btnObject1[16] = ButtonCtrl('camera_controller_gui_open_preset', 'btn_preset1_5', NPTZ_WORDING.wID_0025, callPresetIndex, 5);
                btnObject1[17] = ButtonCtrl('camera_controller_gui_open_preset', 'btn_preset1_6', NPTZ_WORDING.wID_0026, callPresetIndex, 6);
                btnObject1[18] = ButtonCtrl('camera_controller_gui_open_preset', 'btn_preset1_7', NPTZ_WORDING.wID_0027, callPresetIndex, 7);
                btnObject1[19] = ButtonCtrl('camera_controller_gui_open_preset', 'btn_preset1_8', NPTZ_WORDING.wID_0028, callPresetIndex, 8);
                btnObject1[20] = ButtonCtrl('camera_controller_gui_open_preset', 'btn_preset1_9', NPTZ_WORDING.wID_0029, callPresetIndex, 9);
                btnObject1[21] = ButtonCtrl('camera_controller_gui_open_preset', 'btn_preset1_10', NPTZ_WORDING.wID_0416, callPresetIndex, 10);
                btnObject1[22] = ButtonCtrl('camera_controller_gui_open_preset', 'btn_preset1_11', NPTZ_WORDING.wID_0417, callPresetIndex, 11);
                btnObject1[23] = ButtonCtrl('camera_controller_gui_open_preset', 'btn_preset1_12', NPTZ_WORDING.wID_0418, callPresetIndex, 12);
                for (var obj in btnObject1) {
                    btnObject1[obj].show();
                    btnObject1[obj].displayOff();
                }
                btnObject1[0].displayOn();
                btnObject1[12].displayOn();

                btnPresetObject[BTN_SETUP_PRESET_HOME] = ButtonCtrl('preset_list', 'btn_setup_preset_home', NPTZ_WORDING.wID_0415, callbackPresetCtrl, BTN_SETUP_PRESET_HOME);
                btnPresetObject[BTN_SETUP_PRESET_SET] = ButtonCtrl('preset_list', 'btn_setup_preset_set', NPTZ_WORDING.wID_0019, callbackPresetCtrl, BTN_SETUP_PRESET_SET);
                btnPresetObject[BTN_SETUP_PRESET_DELETE] = ButtonCtrl('preset_list', 'btn_setup_preset_delete', NPTZ_WORDING.wID_0020, callbackPresetCtrl, BTN_SETUP_PRESET_DELETE);

                //登録済みPresetの番号を緑色追加する
                if(gPower == 1){
                    presetIdListAll = getPresetIdStatus();
                }
                for (var i = 0; i < MAX_OBJECT_NUM; i++) {
                    // HTML要素の構築(リストエリアベース)
                    presetListObject[i] = {};
                    presetListObject[i]['id'] = null;
                    var index = "preset_list_" + ('0' + i).slice(-2);
                    var div = document.createElement('div');
                    div.id = index;
                    presetListObject[i]['object'] = $(div);
                    presetListObject[i]['object'].addClass(index);
                    presetListObject[i]['object'].addClass('preset_list_disable');
                    var px = (i % 3) * STEP_LEFT + OFFSET_LEFT;
                    var py = Math.floor(i / 3) * STEP_TOP + OFFSET_TOP;
                    presetListObject[i]['object'].css({
                        top: py + 'px',
                        left: px + 'px'
                    });
                    document.getElementById("preset_list").appendChild(div);

                    // リストオブジェクトクリック時の制御
                    presetListObject[i]['object'].mousedown(presetSelect);
                    presetListObject[i]['object'].mouseup(presetSelectUp);
                    presetListObject[i]['object'].mouseover(presetMouseOn);
                    presetListObject[i]['object'].mouseleave(presetSelectUp);
                    presetState = PRESET_DISABLE;
                    buildThumbnail(i);
                    buildPresetInput(i);
                    // 各オブジェクトの追加
                    $('#camera_presnt_' + (i + 1)).removeClass('camera_presnt_show');
                    $('#camera_presnt_' + (i + 1)).addClass('camera_presnt_disabled');

                    if(gPower == 1){
                        if(presetIdListAll[99-i] == 1){
                            $("#camera_presnt_"+(i+1)).css("color","rgb(74, 241, 8)")
                        }
                    }
                }
                initThumbnailStatus = cparam_get_presetNameThumbnailCounter(thumbnailIndex).split(":");

                for(var indexPage = 0; indexPage < 12; indexPage++) {
                    var retBuf = cparam_get_presetNameThumbnailCounter(indexPage).split(":");
                    if (parseInt(retBuf[0],16) == indexPage) {
                        initAllThumbnailStatus[indexPage] = retBuf[1];
                    }
                }

                if(gPower == 1){
                    setTimeout(function(){
                        gThumbnailId = setInterval(getThumbnailStatus,5000);
                    },5000);
                }

            }
        },

        buildPresetAndInput:function(){
            setButtonState = PRESET_MODE;
            initGetPresetImagePara();
            if(getImageId == null){
                getImageId = setInterval(getPresetImage,400);
            }
        },

        show: function () {
            btnObject[BTN_PRESET_HOME].show();
            for (var obj in presetListObject) {
                presetListObject[obj]['object'].show();
            }
            if(isPageFlg == "live"){
                if(gPower == 1) {
                    initGetPresetImagePara();
                    if (getImageId == null) {
                        setTimeout(function(){
                            getImageId = setInterval(getPresetImage, 400);
                        },5000);
                    }
                }
            }
        },
        showButtonSet: function () {
            btnObject[BTN_PRESET_LIST].displayOn();
        },
        showButtonDelete: function () {
            btnObject[BTN_PRESET_DELETE].displayOn();
        },
        showButtonByCtrl: function () {
            btnObject[BTN_PRESET_LIST].show();
            btnObject[BTN_PRESET_DELETE].show();
            if(btnObject[BTN_PRESET_LIST].getStatus() == Button.STATUS_ON) {
                btnObject[BTN_PRESET_LIST].displayOn();
            }else{
                btnObject[BTN_PRESET_LIST].displayOff();
            }
            if(btnObject[BTN_PRESET_DELETE].getStatus() == Button.STATUS_ON) {
                btnObject[BTN_PRESET_DELETE].displayOn();
            }else{
                btnObject[BTN_PRESET_DELETE].displayOff();
            }
            var divName = $("#preset_set_label").html();
            if (divName == NPTZ_WORDING.wID_0019) {
                btnObject[BTN_PRESET_LIST].displayOn();
            } else if (divName == NPTZ_WORDING.wID_0020) {
                btnObject[BTN_PRESET_DELETE].displayOn();
            } else {
                //nothing
            }
        },
        hideButtonByCtrl: function () {
            btnObject[BTN_PRESET_LIST].hide();
            btnObject[BTN_PRESET_DELETE].hide();
        },
        hide: function () {
            btnObject[BTN_PRESET_LIST].hide();
            btnObject[BTN_PRESET_DELETE].hide();
            btnObject[BTN_PRESET_HOME].hide();
            for (var obj in presetListObject) {
                presetListObject[obj]['object'].hide();
                presetListObject[obj]['num'].hide();
            }
        },
        updateStatus: updateStatus,
        updatePresetImage: updatePresetImage,
        initControllerButtons3: initControllerButtons3,
        initControllerButtonsDisabled3: initControllerButtonsDisabled3,
        controllerChangePresetNo3: controllerChangePresetNo3,
        showPresetButton: function () {
            for (var btn in btnPresetObject) {
                btnPresetObject[btn].show();
                if(btnPresetObject[btn].getStatus() == Button.STATUS_ON ){
                    btnPresetObject[btn].displayOn();
                }else{
                    btnPresetObject[btn].displayOff();
                }
            }
            btnObject[BTN_PRESET_HOME].hide();
            btnObject[BTN_PRESET_LIST].hide();
            btnObject[BTN_PRESET_DELETE].hide();
        },
        initPresetButton: function () {
            for (var btn in btnPresetObject) {
                btnPresetObject[btn].show();
                btnPresetObject[btn].displayOff();
            }
        },
    };
}

/**
 * Image Controlボタン制御クラス
 * @class　Image Controlボタン制御クラス
 * @return {function} build 構築処理
 * @return {function} show　表示処理
 * @return {function} hide　非表示処理
 * @return {function} updateStatus　カメラ状態情報更新処理
 * @constructor
 */
function ImageControlButton() {

    /**
     * 「ADD」ボタンオブジェクト(インデックス値)
     * @type number
     */
    var BTN_IRIS_ADD = 0;

    /**
     * 「SUB」ボタンオブジェクト(インデックス値)
     * @type number
     */
    var BTN_IRIS_SUB = 1;

    /**
     * 「AUTO」ボタンオブジェクト(インデックス値)
     * @type number
     */
    var BTN_IRIS_AUTO = 2;

    /**
     * 「ADD」ボタンオブジェクト(インデックス値)
     * @type number
     */
    var BTN_GAIN_ADD = 3;

    /**
     * 「SUB」ボタンオブジェクト(インデックス値)
     * @type number
     */
    var BTN_GAIN_SUB = 4;

    /**
     * 「ADD」ボタンオブジェクト(インデックス値)
     * @type number
     */
    var BTN_WB_ADD = 5;

    /**
     * 「SUB」ボタンオブジェクト(インデックス値)
     * @type number
     */
    var BTN_WB_SUB = 6;

    /**
     * 「AWB」ボタンオブジェクト(インデックス値)
     * @type number
     */
    var BTN_WB_AWB = 7;

    /**
     * 「ABB」ボタンオブジェクト(インデックス値)
     * @type number
     */
    var BTN_WB_ABB = 8;

    /**
     * 「ADD」ボタンオブジェクト(インデックス値)
     * @type number
     */
    var BTN_SHUTTER_ADD = 9;

    /**
     * 「SUB」ボタンオブジェクト(インデックス値)
     * @type number
     */
    var BTN_SHUTTER_SUB = 10;

    /**
     * 「ADD」ボタンオブジェクト(インデックス値)
     * @type number
     */
    var BTN_ND_ADD = 11;

    /**
     * 「SUB」ボタンオブジェクト(インデックス値)
     * @type number
     */
    var BTN_ND_SUB = 12;

    /**
     * 「Go」ボタンオブジェクト(インデックス値)
     * @type number
     */
    var BTN_SD_RECORD = 13;

    /**
     * 「replay」(インデックス値)
     * @type number
     */
    var BTN_PLAY_LIST = 14;

    /**
     * 「Cup」(インデックス値)
     * @type number
     */
    var BTN_CUP = 15;

    /**
     * 「Slience」(インデックス値)
     * @type number
     */
    var BTN_SLIENCE = 16;
    /**
     * CUPTURE(インデックス値)
     * @type number
     */
    var CUPTURE = 17;

    /**
     * 「SCENE SET」テキストオブジェクト(インデックス値)
     * @type number
     */
    var BTN_SCENE_SET = 18;
    /**
     * CUPTURE(インデックス値)
     * @type number
     */
    var BTN_STREAM_DISTRIBUTION = 19;
    /**
     * CUPTURE(インデックス値)
     * @type number
     */
    var BTN_STREAM_DISTRIBUTION_FIRST = 20;
    /**
     * CUPTURE(インデックス値)
     * @type number
     */
    var BTN_STREAM_STOP = 21;


    /**
     * 「Cup」(インデックス値)
     * @type number
     */
    var BTN_EXECUTE = 22;

    /**
     * 「GAIN」テキストオブジェクト(インデックス値)
     * @type number
     */
    var TXT_CAMERA_GAIN = 17;

    /**
     * 「WB」テキストオブジェクト(インデックス値)
     * @type number
     */
    var TXT_CAMERA_WB = 18;

    /**
     * 「SHUTTER」テキストオブジェクト(インデックス値)
     * @type number
     */
    var TXT_CAMERA_SHUTTER = 19;

    /**
     * 「ND」テキストオブジェクト(インデックス値)
     * @type number
     */
    var TXT_CAMERA_ND = 20;

    /**
     * ボタンオブジェクト(インデックス値)
     * @type {number}
     */
    var TXT_CAMERA_IRIS = 21;
    /**
     * ボタンオブジェクト(インデックス値)
     * @type {number}
     */
    var TXT_STREAM_RTMP = 23;

    /**
     * ボタンオブジェクト(インデックス値)
     * @type {number}
     */
    var TXT_RTMP_Streaming = 24;


    /**
     * ボタンオブジェクト(インデックス値)
     * @type {number}
     */
    var TXT_RTMP = 25;

    var TXT_SCENE_USER = 26;

    var TXT_STORE_LOAD = 27;

    var TXT_FROM = 28;

    var TXT_TO = 29;

    /**
     * ボタンオブジェクト
     * @type ButtonCtrl[]
     */
    var btnObject = [];
    /**
     * ボタンオブジェクト
     * @type ButtonCtrl[]
     */
    var btnStreamObject;

    var sceneButtonObject = [];
    var sceneSelected = '';

    /**
     * テキストオブジェクト
     * @type {Array}
     */
    var txtObject = [];

    var selectSenceUserObject = []

    var SELECT_STORE_LOAD = 0;

    var SELECT_FROM = 1;

    var SELECT_TO = 2;
    /**
     * 構築済みフラグ
     * @type boolean
     */
    var buildFlag = false;

    /**
     * IRISタイマーインターバル
     * @type setInterval
     */
    var intervalIDIris = null;

    /**
     * AUTO
     * @type AUTO
     */
    var AUTO = 1;

    /**
     * MANUAL
     * @type MANUAL
     */
    var MANUAL = 0;

    /**
     *「REC」ボタンの状態
     * @type {boolean}
     */
    var REC_MODE = false;
    /**
     *「REC」ボタンの状態
     * @type {boolean}
     */
    var RECORD_MODE = true;

    /**
     *「play list」window
     * @type object
     */
    var objwindow;
    /**
     *「REC」ボタンの状態 start:0 ; stop:1
     * @type {number}
     */
    var recState = 0;

    /**
     * IRIS button
     * @type object
     */
    var irisObject = [];
    irisObject[BTN_IRIS_SUB] = 'down';
    irisObject[BTN_IRIS_ADD] = 'up';

    var refresh_interval_ImageAdjust;
    var indexGain;
    var superGain;
    // var gainTxtArr = [];
    var gainTxtObjArr = [];
    var currentGainTxtObj;
    var isGainAuto = false;

    /**
     * 「ADD」ボタン押下時の画面制御
     * @param {number} mouse マウス・ボタン操作状況
     */
    function callbackIrisADD(mouse) {
        if (mouse == Button.MOUSE_DOWN) {
            setTimeout(function(){
                btnObject[BTN_IRIS_ADD].displayOn();
                if (intervalIDIris != null) {
                    clearInterval(intervalIDIris);
                }
                //var mapPtv = cparam_get_panTiltZoomFocusIrisTogetherControl();
                var val = reqPtdObj.mapPtv.iris;
                if(val == undefined || val < 1365)
                {
                    val = 1365
                }
                val = Math.floor((val-1365)/2730*99);

                StartIris(irisObject[BTN_IRIS_ADD], event, val);
                // ボタン押下中は20msecの周期でzoomTeleを実行する。
                intervalIDIris = setInterval(function () {
                    if (val<99) {
                        val = val + 1;
                        irisADD(val);
                    }
                }, 100);
            },100);

        } else if ((mouse == Button.MOUSE_UP) || (mouse == Button.MOUSE_OUT)) {
            // ON時であれば、Zoom処理の停止0
            setTimeout(function(){
                clearInterval(intervalIDIris);
                intervalIDIris = null;
                StopIris(event);
            },200);

        } else {
            // 処理なし
        }
    }

    /**
     * start to control iris
     * @param sType
     * @param evt
     * @constructor
     */
    function StartIris(sType, evt, nowVal) {
        if ((gFlgDisableCamCtrl == true) || !canSetIris() || (AutoIris == 1)) {
            return;
        }
        if (window.event) {
            evt = window.event;
        }
        if (( sType == 'down' ) || ( sType == 'up' )) {
            if (sType == 'down') {
                if (nowVal>0)
                {
                    cparam_set_irisControlSpeed(nowVal-1);
                }
            } else {  // 'up'
                if (nowVal<99)
                {
                    cparam_set_irisControlSpeed(nowVal+2);
                }
            }
        } else {  // 'stop'
            cparam_set_irisStop();
        }
    }

    /**
     * stop to control iris
     * @param evt
     * @constructor
     */
    function StopIris(evt) {
        cparam_set_irisStop();
    }

    /**
     * 「SUB」ボタン押下時の画面制御
     * @param {number} mouse マウス・ボタン操作状況
     */
    function callbackIrisSUB(mouse) {
        if (mouse == Button.MOUSE_DOWN) {

            setTimeout(function(){
                btnObject[BTN_IRIS_SUB].displayOn();
                if (intervalIDIris != null) {
                    clearInterval(intervalIDIris);
                }
                var val = reqPtdObj.mapPtv.iris;
                if(val == undefined || val < 1365)
                {
                    val = 1365
                }
                val = Math.floor((val-1365)/2730*99);
                StartIris(irisObject[BTN_IRIS_SUB], event, val);
                // ボタン押下中は20msecの周期でzoomWideを実行する。
                intervalIDIris = setInterval(function () {
                    if (val>1) {
                        val = val - 1;
                        irisSUB(val);
                    }
                }, 100);
            },100);
        } else if ((mouse == Button.MOUSE_UP) || (mouse == Button.MOUSE_OUT)) {

            setTimeout(function(){
                clearInterval(intervalIDIris);
                intervalIDIris = null;
                StopIris(event);
            },200);
        } else {
            // 処理なし
        }
    }

    /**
     * 「AUTO」ボタン押下時の画面制御
     * @param {number} mouse マウス・ボタン操作状況
     */
    function callbackIrisAuto(mouse) {
        if (mouse == Button.MOUSE_DOWN) {
            if (btnObject[BTN_IRIS_AUTO].getStatus() != Button.STATUS_ON) {
                irisAuto(AUTO);
                SetBrightAuto();
            } else {
                irisAuto(MANUAL);
                SetBrightAuto();
            }
        } else {
            // 処理なし
        }
    }

    /**
     * set iris auto commend
     * @constructor
     */
    function SetBrightAuto() {
        if (AutoIris == 0) {
            reqCgiObj.getIris = 1;
            cparam_set_irismode(1);
            if (gFlgSlow == true) {
                cparam_set_irisSpeed(1);
            } else {
                cparam_set_irisSpeed(7);
            }
            AutoIris = 1;
        } else {
            reqCgiObj.getIris = 0;
            cparam_set_irismode(0);
            AutoIris = 0;
        }
    }

    /**
     * set iris value to element
     * @param value
     */
    function setIrisValue(value) {
        if ($(".txt_camera_iris p")[0]) {
            $(".txt_camera_iris p")[0].innerText = (value == "F25.50"? "CLOSE":value);
        } else if ($(".txt_adjust_camera_iris p")[0]) {
            $(".txt_adjust_camera_iris p")[0].innerText = (value == "F25.50"? "CLOSE":value);
        } else {
            // nothing
        }
    }

    /**
     * iris アップ処理 (+1)
     */
    function irisADD(nowVal) {
        var msg = {}
        msg.sComm = nowVal;
        msg.type = "iris";
        worker.postMessage(msg);
        //var mapPtv = cparam_get_panTiltZoomFocusIrisTogetherControl();
        var irisVal = reqPtdObj.mapPtv.iris;
        if(irisVal == undefined || irisVal < 1365){
            irisVal = 1365;
        }
        irisVal = Math.floor((irisVal-1365)/2730*254);
        cameraControllerSetting.setSliderIrisPosition(irisVal);
    }

    /**
     * iris ダウン処理 (-1)
     */
    function irisSUB(nowVal) {
        var msg = {}
        msg.sComm = nowVal;
        msg.type = "iris";
        worker.postMessage(msg);
        //var mapPtv = cparam_get_panTiltZoomFocusIrisTogetherControl();
        var irisVal = reqPtdObj.mapPtv.iris;
        if(irisVal == undefined || irisVal < 1365){
            irisVal = 1365;
        }
        irisVal = Math.floor((irisVal-1365)/2730*254);
        cameraControllerSetting.setSliderIrisPosition(irisVal);
    }

    var oldIrisDate = null;

    /**
     * iris 自動処理
     */
    function irisAuto(auto) {
        if (auto == AUTO) {
            btnObject[BTN_IRIS_AUTO].displayOn();
            btnObject[BTN_IRIS_ADD].displayDisabled();
            btnObject[BTN_IRIS_SUB].displayDisabled();
            if ($('.iris_slider_win_wrap_level')) {
                $('.iris_slider_win_wrap_level').removeClass('on');
            }
            cameraControllerSetting.disableIrisSlider();
            if ($(".txt_adjust_camera_iris")[0]) {
                oldIrisDate = parseInt($(".txt_adjust_camera_iris")[0].innerText);
            } else if ($(".txt_camera_iris")[0]) {
                oldIrisDate = parseInt($(".txt_camera_iris")[0].innerText);
            }
        } else if (auto == MANUAL) {
            btnObject[BTN_IRIS_AUTO].displayOff();
            btnObject[BTN_IRIS_ADD].displayOff();
            btnObject[BTN_IRIS_SUB].displayOff();
            if ($('.iris_slider_win_wrap_level')) {
                $('.iris_slider_win_wrap_level').addClass('on');
            }
            cameraControllerSetting.undisableIrisSlider();
        }
    }

    /**
     * init iris slider
     * @param AutoIris
     */
    function initIrisSlider(AutoIris) {
        if(gPTV == null) return;
        if (AutoIris == 1) {
            cameraControllerSetting.disableIrisSlider();
        } else {
            cameraControllerSetting.undisableIrisSlider();
            var map = gPTV
            var val = map.iris;
            val = Math.floor((val - 1365) / 2730 * 254);
            cameraControllerSetting.setSliderIrisPosition(val);
            oldIrisDate = val;
        }
    }

    /**
     * 「ADD」ボタン押下時の画面制御
     * @param {number} mouse マウス・ボタン操作状況
     */
    function callbackGainADD(mouse) {
        if (mouse == Button.MOUSE_DOWN) {
            btnObject[BTN_GAIN_ADD].displayOn();
            doGain("add");
        } else if ((mouse == Button.MOUSE_UP) || (mouse == Button.MOUSE_OUT)) {
            if (btnObject[BTN_GAIN_ADD].getStatus() != Button.STATUS_DISABLED) {
                btnObject[BTN_GAIN_ADD].displayOff();
            }
        } else {
            // 処理なし
        }
    }

    /**
     * 「SUB」ボタン押下時の画面制御
     * @param {number} mouse マウス・ボタン操作状況
     */
    function callbackGainSUB(mouse) {
        if (mouse == Button.MOUSE_DOWN) {
            btnObject[BTN_GAIN_SUB].displayOn();
            doGain("sub");
        } else if ((mouse == Button.MOUSE_UP) || (mouse == Button.MOUSE_OUT)) {
            if (btnObject[BTN_GAIN_SUB].getStatus() != Button.STATUS_DISABLED) {
                btnObject[BTN_GAIN_SUB].displayOff();
            }
        } else {
            // 処理なし
        }
    }

    /**
     * send url to control gain
     * @param flag
     */
    function doGain(flag) {
        // if (flag == "add") {
        //     if (indexGain >= max_gain_db +1 && indexGain <128) {
        //         indexGain = 0;
        //     } else if (indexGain <= max_gain_db) {
        //         indexGain = indexGain + 1;
        //     }else if(indexGain >= 128){
        //         indexGain = 1;
        //     }
        // } else if (flag == "sub") {
        //     if(indexGain >= 128){
        //         indexGain = max_gain_db+2;
        //     }
        //     if (indexGain == max_gain_db+1) {
        //         indexGain = max_gain_db;
        //     } else if (indexGain > 0) {
        //         indexGain = indexGain -1 ;
        //     } else if (flag == "sub" && indexGain <= 0) {
        //         indexGain = max_gain_db + 1;
        //     }
        // }

        // var data = 0;
        // if (indexGain == 0) {
        //     data = 0x80;
        // }
        // else {
        //     data = ( indexGain -1 );
        // }
        // cparam_set_gain(data);
        // insertGainTxt();

        // if(!Array.prototype.find){
        //     Array.prototype.find = function(callback) {
        //         return callback && (this.filter(callback)|| [])[0];
        //     };
        // }

        var find = function (callback) {
            return callback && (this.filter(callback) || [])[0];
        };
        if (flag == "add") {
            try {
                // currentGainTxtObj = Array.call(gainTxtObjArr, find(function (obj) { return obj.data > currentGainTxtObj.data }))
                if(!Array.prototype.find){
                    currentGainTxtObj = find.call(gainTxtObjArr, function (obj) { return obj.data > currentGainTxtObj.data });
                }else{
                    currentGainTxtObj = gainTxtObjArr.find(function (obj) { return obj.data > currentGainTxtObj.data });
                }
                if(!currentGainTxtObj){
                    currentGainTxtObj = gainTxtObjArr[0];
                }
                // currentGainTxtObj = gainTxtObjArr.find(function (obj) { return obj.data > currentGainTxtObj.data })
            } catch (e) {
                if (currentGainTxtObj && currentGainTxtObj.id == 128) {
                    currentGainTxtObj = gainTxtObjArr[0]
                } else {
                    currentGainTxtObj = gainTxtObjArr[19]
                }
            }
        } else if (flag == "sub") {
            try {
                // currentGainTxtObj = [].concat(gainTxtObjArr).sort(function (objA, objB) { return objB.id - objA.id }).find(function (obj) { return obj.data < currentGainTxtObj.data })
                currentGainTxtObj = find.call([].concat(gainTxtObjArr).sort(function (objA, objB) { return objB.id - objA.id }), function (obj) { return obj.data < currentGainTxtObj.data });
                if(!currentGainTxtObj){
                    currentGainTxtObj = gainTxtObjArr[19];
                }
            } catch (e) {
                currentGainTxtObj = gainTxtObjArr[19]
            }

        }

        cparam_set_gainCameraControl(currentGainTxtObj.data);
        insertGainTxt();
    }

    /**
     * set gain value to element
     */
    // function insertGainTxt() {
    //     if (indexGain == 0) {
    //         setGainValue(NPTZ_WORDING.wID_0016);
    //     }
    //     else {
    //         setGainValue(gainTxtArr[(indexGain-1)]);
    //     }

    // }
    function insertGainTxt() {
        setGainValue(currentGainTxtObj.name);
    }

    function insertGainTxtM() {
        // superGain = reqCgiObj.getSuperGain;
        // if(superGain == 1){
        //     max_gain_db = 42;
        // }else{
        //     max_gain_db = 36;
        // }
        var max_gain_db = 19;
        // max_gain_db = 18;
        for (var iTxt = 0; iTxt < max_gain_db; iTxt++) {
            // gainTxtArr[iTxt] = iTxt + "dB";
            gainTxtObjArr[iTxt] = {
                id:iTxt,
                name:(iTxt-6) + "dB",
                data:('00'+parseInt(iTxt+2).toString(16)).slice(-2).toUpperCase()
            }
        }
        // gainTxtObjArr[43]={id:128,name:NPTZ_WORDING.wID_0016,data:"80"}
        gainTxtObjArr[19]={id:128,name:NPTZ_WORDING.wID_0016,data:"80"}
    }

    /**
     * 「ADD」ボタン押下時の画面制御
     * @param {number} mouse マウス・ボタン操作状況
     */
    function callbackWbADD(mouse) {
        if (mouse == Button.MOUSE_DOWN) {
            btnObject[BTN_WB_ADD].displayOn();
            doWb("add");
        } else if ((mouse == Button.MOUSE_UP) || (mouse == Button.MOUSE_OUT)) {
            if (btnObject[BTN_WB_ADD].getStatus() != Button.STATUS_DISABLED) {
                btnObject[BTN_WB_ADD].displayOff();
            }
        } else {
            // 処理なし
        }
    }

    /**
     * 「SUB」ボタン押下時の画面制御
     * @param {number} mouse マウス・ボタン操作状況
     */
    function callbackWbSUB(mouse) {
        if (mouse == Button.MOUSE_DOWN) {
            btnObject[BTN_WB_SUB].displayOn();
            doWb("sub");
        } else if ((mouse == Button.MOUSE_UP) || (mouse == Button.MOUSE_OUT)) {
            if (btnObject[BTN_WB_SUB].getStatus() != Button.STATUS_DISABLED) {
                btnObject[BTN_WB_SUB].displayOff();
            }
        } else {
            // 処理なし
        }
    }
    var wbTxtArr = [];
    wbTxtArr[0] = "ATW";
    wbTxtArr[1] = "AWB A";
    wbTxtArr[2] = "AWB B";
    wbTxtArr[4] = "3200K";
    wbTxtArr[5] = "5600K";
    wbTxtArr[9] = "VAR";

    /**
     * control wb
     * @param flag
     */
    function doWb(flag) {
        if (flag == "add") {
            switch (indexWb) {
                case 0:
                    indexWb = 1;
                    break;
                case 1:
                    indexWb = 2;
                    break;
                case 2:
                    indexWb = 4;
                    break;
                case 4:
                    indexWb = 5;
                    break;
                case 5:
                    indexWb = 9;
                    break;
                case 9:
                    indexWb = 0;
                    break;
                default:
            }
        } else if (flag == "sub") {
            switch (indexWb) {
                case 0:
                    indexWb = 9;
                    break;
                case 1:
                    indexWb = 0;
                    break;
                case 2:
                    indexWb = 1;
                    break;
                case 4:
                    indexWb = 2;
                    break;
                case 5:
                    indexWb = 4;
                    break;
                case 9:
                    indexWb = 5;
                    break;
                default:
            }
        }
        cparam_set_whiteBalanceModeCameraControl(indexWb);
        insertWbTxt();
    }

    /**
     * set wb value to element
     */
    function insertWbTxt() {
        if (indexWb >= 0 || indexWb <= wbTxtArr.length - 1) {
            setTimeout(function(){
                setWbValue(wbTxtArr[indexWb])
            },300);
            reqCgiObj.getWhiteBalanceMode = indexWb;
        }
        else {
            setWbValue("unknow");
        }
    }

    /**
     * 「AWB」ボタン押下時の画面制御
     * @param {number} mouse マウス・ボタン操作状況
     */
    function callbackWbAWB(mouse) {
        if (mouse == Button.MOUSE_DOWN) {
            if (btnObject[BTN_WB_AWB].getStatus() != Button.STATUS_ON) {
                cparam_set_AWCAWBSet();
            } else {
            }
        }
    }

    /**
     * 「ABB」ボタン押下時の画面制御
     * @param {number} mouse マウス・ボタン操作状況
     */
    function callbackWbABB(mouse) {
        if (mouse == Button.MOUSE_DOWN) {
            if (btnObject[BTN_WB_ABB].getStatus() != Button.STATUS_ON) {
                cparam_set_ABBSet();
            } else {
            }
        }
    }

    var shutterTxtArr = [];
    shutterTxtArr[0] = "Off";
    shutterTxtArr[1] = "Step";
    shutterTxtArr[2] = "Synchro";
    shutterTxtArr[3] = "Auto";
    var indexShutter;

    /**
     * control wb
     * @param flag
     */
    function doShutter(flag) {
        var Shutter = indexShutter;
        if (flag == "add") {
            switch (Number(Shutter)) {
                case 0:
                    Shutter = 1;
                    break;
                case 1:
                    Shutter = 2;
                    break;
                case 2:
                    Shutter = 3;
                    break;
                case 3:
                    Shutter = 0;
                    break;
                default:
            }
        } else if (flag == "sub") {
            switch (Number(Shutter)) {
                case 0:
                    Shutter = 3;
                    break;
                case 1:
                    Shutter = 0;
                    break;
                case 2:
                    Shutter = 1;
                    break;
                case 3:
                    Shutter = 2;
                    break;
                default:
            }
        }
        cparam_set_shutterModeCameraControl(Shutter);
        reqCgiObj.Shutter = Shutter;
        insertShutterTxt(Shutter);
        indexShutter = Shutter;
    }


    /**
     * 「ADD」ボタン押下時の画面制御
     * @param {number} mouse マウス・ボタン操作状況
     */
    function callbackShutterADD(mouse) {
        if (mouse == Button.MOUSE_DOWN) {
            btnObject[BTN_SHUTTER_ADD].displayOn();
            doShutter("add");
        } else if ((mouse == Button.MOUSE_UP) || (mouse == Button.MOUSE_OUT)) {
            if (btnObject[BTN_SHUTTER_ADD].getStatus() != Button.STATUS_DISABLED) {
                btnObject[BTN_SHUTTER_ADD].displayOff();
            }
        } else {
            // 処理なし
        }
    }

    /**
     * 「SUB」ボタン押下時の画面制御
     * @param {number} mouse マウス・ボタン操作状況
     */
    function callbackShutterSUB(mouse) {
        if (mouse == Button.MOUSE_DOWN) {
            btnObject[BTN_SHUTTER_SUB].displayOn();
            doShutter("sub");
        } else if ((mouse == Button.MOUSE_UP) || (mouse == Button.MOUSE_OUT)) {
            if (btnObject[BTN_SHUTTER_SUB].getStatus() != Button.STATUS_DISABLED) {
                btnObject[BTN_SHUTTER_SUB].displayOff();
            }
        } else {
            // 処理なし
        }
    }

    /**
     * set shutter value to element
     */
    function insertShutterTxt(Shutter) {
        if (indexWb >= 0 || indexWb <= shutterTxtArr.length - 1) {
            setTimeout(function(){
                setShutterValue(shutterTxtArr[Shutter])
            },300);
        } else {
            setShutterValue("unknow");
        }
    }

    /**
     * 「ADD」ボタン押下時の画面制御
     * @param {number} mouse マウス・ボタン操作状況
     */
    function callbackNdADD(mouse) {
        if (mouse == Button.MOUSE_DOWN) {
            btnObject[BTN_ND_ADD].displayOn();
            indexNd++;
            if(indexNd+1==5) {
                indexNd = 0;
            }
            doNd("add");
        } else if ((mouse == Button.MOUSE_UP) || (mouse == Button.MOUSE_OUT)) {
            if (btnObject[BTN_ND_ADD].getStatus() != Button.STATUS_DISABLED) {
                btnObject[BTN_ND_ADD].displayOff();
            }
        } else {
            // 処理なし
        }
    }

    /**
     * 「SUB」ボタン押下時の画面制御
     * @param {number} mouse マウス・ボタン操作状況
     */
    function callbackNdSUB(mouse) {
        if (mouse == Button.MOUSE_DOWN) {
            btnObject[BTN_ND_SUB].displayOn();
            indexNd--;
            if(indexNd+1 == 0) {
                indexNd = 3;
            }
            doNd("sub");
        } else if ((mouse == Button.MOUSE_UP) || (mouse == Button.MOUSE_OUT)) {
            if (btnObject[BTN_ND_SUB].getStatus() != Button.STATUS_DISABLED) {
                btnObject[BTN_ND_SUB].displayOff();
            }
        } else {
            // 処理なし
        }
    }

    var ndTxtArr = ["Through", "1/4", "1/16", "1/64"];
    var indexNd;
    /**
     * nd controller
     * @param flag
     */
    function doNd(flag) {
        if (flag == "add") {
            switch (indexNd) {
                case 0:
                    indexNd = 0;
                    break;
                case 1:
                    indexNd = 1;
                    break;
                case 2:
                    indexNd = 2;
                    break;
                case 3:
                    indexNd = 3;
                    break;
                default:
            }
        } else if (flag == "sub") {
            switch (indexNd) {
                case 0:
                    indexNd = 0;
                    break;
                case 1:
                    indexNd = 1;
                    break;
                case 2:
                    indexNd = 2;
                    break;
                case 3:
                    indexNd = 3;
                    break;
                default:
            }
        }
        cparam_set_NDFilter(indexNd);
        reqCgiObj.ND = indexNd;
        insertNdTxt();
    }

    /**
     * set nd value to element
     */
    function insertNdTxt() {
        if (indexNd >= 0 || indexNd <= ndTxtArr.length - 1) {
            setTimeout(function(){
                setNdValue(ndTxtArr[indexNd])
            },300);
        } else {
            setNdValue(NPTZ_WORDING.wID_0167);
        }
    }

    /**
     * scene button controller
     * @param mouse
     */
    // function callSceneSet(mouse, inScene) {
    //     if (mouse == Button.MOUSE_DOWN) {
    //         $("#scn_select").val(inScene);
    //         cparam_set_sceneMode( $("#scn_select").val());
    //         reqCgiObj.gScene = inScene;
    //         gScene = inScene;
    //         $('.txt_selectedScene > P').html(getTextBySceneMode(gScene));
    //         //setSceneSelectedValue($("#scn_select").val().toString());
    //     }
    // }

    // function setSceneSelectedValue(sceneValue) {
    //     switch (sceneValue) {
    //         case "1":
    //             sceneButtonObject[1].displayOn();
    //             sceneButtonObject[2].displayOff();
    //             sceneButtonObject[3].displayOff();
    //             sceneButtonObject[4].displayOff();
    //             break;
    //         case "2":
    //             sceneButtonObject[1].displayOff();
    //             sceneButtonObject[2].displayOn();
    //             sceneButtonObject[3].displayOff();
    //             sceneButtonObject[4].displayOff();
    //             break;
    //         case "3":
    //             sceneButtonObject[1].displayOff();
    //             sceneButtonObject[2].displayOff();
    //             sceneButtonObject[3].displayOn();
    //             sceneButtonObject[4].displayOff();
    //             break;
    //         case "4":
    //             sceneButtonObject[1].displayOff();
    //             sceneButtonObject[2].displayOff();
    //             sceneButtonObject[3].displayOff();
    //             sceneButtonObject[4].displayOn();
    //             break;
    //     }
    // }

    /**
     * get checked cameraList
     * @returns {Array.<T>|string|Blob|ArrayBuffer|*}
     */
    function getCheckedCameraList() {
        var list = menubarCtrl.getCheckedCameraList();
        var idList = list.slice(0);
        var CameraID = cameraControllerSetting.getOperateCameraID();
        if (idList.indexOf(CameraID) == -1) {
            idList.push(CameraID);
        } else {
            idList.splice(idList.indexOf(CameraID), 1);
            idList.push(CameraID);
        }
        return idList;
    }

     /**
     * カメラ状態情報更新処理<br>
     * @param {object} status カメラ状態
     */
    function updateStatus(status) {
        // connection=0である場合は押下不可とする。
        var map = gPTD;
        var val = map.decIris;
        if (status == 0) {
            for (var btn in btnObject) {
                btnObject[btn].displayDisabled();
            }
            // scene
            // for (var obj in sceneButtonObject) {
            //     sceneButtonObject[obj].displayDisabled();
            // }
            btnStreamObject.displayDisabled();
            oldIrisDate = val;
            $("#txt_camera_gain >P").html(NPTZ_WORDING.wID_0167);
            txtObject[TXT_CAMERA_WB].set(NPTZ_WORDING.wID_0167);
            txtObject[TXT_CAMERA_SHUTTER].set(NPTZ_WORDING.wID_0167);
            txtObject[TXT_CAMERA_ND].set(NPTZ_WORDING.wID_0167);
            cparam_set_NDFilter(8);
        } else {
            for (var btn in btnObject) {
                btnObject[btn].displayOff();
            }
            // scene
            // for (var obj in sceneButtonObject) {
            //     sceneButtonObject[obj].displayOff();
            // }
            var index = gScene
            $('.txt_selectedScene > P').html(getTextBySceneMode(index));
            // if(parseInt(index)){
            //     sceneButtonObject[index].displayOn();
            // }
            $('.iris_slider_wrap_now_level').removeClass('off');
            oldIrisDate = val;
        }
    }

    /**
     * init controller buttons 2
     * @param AutoIris
     */
    function initControllerButtons2(AutoIris) {
        // HE50A mod
        if (canSetIris()) {
            if (AutoIris == 1) {
                btnObject[BTN_IRIS_ADD].displayDisabled();
                btnObject[BTN_IRIS_SUB].displayDisabled();
                btnObject[BTN_IRIS_AUTO].displayOn();
                initIrisSlider(AutoIris);
            } else {
                btnObject[BTN_IRIS_ADD].displayOff();
                btnObject[BTN_IRIS_SUB].displayOff();
                btnObject[BTN_IRIS_AUTO].displayOff();
                initIrisSlider(AutoIris);
            }
        } else {
            btnObject[BTN_IRIS_ADD].displayDisabled();
            btnObject[BTN_IRIS_SUB].displayDisabled();
            btnObject[BTN_IRIS_AUTO].displayDisabled();
            initIrisSlider(1);
        }
    }

    /**
     * cup button controller
     * @param mouse
     */
    function callbackCup(mouse) {
        if (mouse == Button.MOUSE_UP) {
            return;
        } else if (mouse == Button.MOUSE_DOWN) {
            var iResol = menubarCtrl.menubar_GetResolution();
            var url = "/live/capture.html?"+iResol;
            window.open(url,"_blank", "location=no,toolbar=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width=566px, height=390px , left=300, top =100")
        } else {
            // 処理なし
        }
    }

    /**
     * slient button controller
     * @param mouse
     */
    function callbackSlient(mouse) {
        if (mouse == Button.MOUSE_UP) {
            return;
        } else if (mouse == Button.MOUSE_DOWN) {
            cparam_eventAudioCtrl(0);
        } else {
            // 処理なし
        }
    }

    /**
     * Cup button controller
     * @param mouse
     */
    function callbackSettingDistribution(mouse, type) {
        if (mouse == Button.MOUSE_UP) {
            return;
        } else if (mouse == Button.MOUSE_DOWN) {
            if (type == BTN_STREAM_DISTRIBUTION) {
                if (btnObject[type].getStatus() == Button.STATUS_ON) {
                    btnObject[type].displayOff();
                } else if (btnObject[type].getStatus() == Button.STATUS_OFF) {
                    btnObject[type].displayOn();
                }
            } else if (type == BTN_STREAM_DISTRIBUTION_FIRST) {
                window.open("/live/Distribution.html", "_blank", "location=no,toolbar=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width=532px, height=310px , top=550,left=800");
            }
        } else {
            // 処理なし
        }
    }

    function callbackSettingStop(mouse, type){
        if (mouse == Button.MOUSE_UP) {
        } else if (mouse == Button.MOUSE_DOWN) {
            if(btnStreamObject.getStatus() != Button.STATUS_ON){
                if(sysStreamMode == 'srt_h264' || sysStreamMode == 'srt_h264_uhd' || sysStreamMode == 'srt_h265' || sysStreamMode == 'srt_h265_uhd'){
                    if(sendSrtCmd('start') == 'OK'){
                        if(getsrtStatus() == '1'){
                            reqCgiObj.srtStatus = 1;
                            btnStreamObject.displayOn();
                            btnStreamObject.set('stop');
                        }
                    }else{
                        jAlert(MSG_STATUS.mID_0092, NPTZ_WORDING.wID_0039);
                    }

                }else if(sysStreamMode == 'rtmp' || sysStreamMode == 'rtmp_uhd'){
                    if(sendRtmpCmd('start') == 'OK'){
                        if(getRtmpStatus() == '1'){
                            reqCgiObj.rtmpStatus = 1;
                            btnStreamObject.displayOn();
                            btnStreamObject.set('stop');
                        }
                    }else{
                        jAlert(MSG_STATUS.mID_0073, NPTZ_WORDING.wID_0039);
                    }
                }else if(sysStreamMode == 'ts_udp'){
                    if(sendTsUdpCmd('start') == 'OK'){
                        if(getTsUdpStatus() == '1'){
                            reqCgiObj.udpStatus = 1;
                            btnStreamObject.displayOn();
                            btnStreamObject.set('stop');
                        }
                    }else{
                        jAlert(MSG_STATUS.mID_0099, NPTZ_WORDING.wID_0039);
                    }
                }

            }else{

                if(sysStreamMode == 'srt_h264' || sysStreamMode == 'srt_h264_uhd' || sysStreamMode == 'srt_h265' || sysStreamMode == 'srt_h265_uhd'){
                    if(sendSrtCmd('stop') == 'OK'){
                        reqCgiObj.srtStatus = 0;
                        btnStreamObject.displayOff();
                        btnStreamObject.set('start');
                    }else{
                        jAlert(MSG_STATUS.mID_0093, NPTZ_WORDING.wID_0039);
                    }
                }else if(sysStreamMode == 'rtmp' || sysStreamMode == 'rtmp_uhd'){
                    if(sendRtmpCmd('stop') == 'OK'){
                        reqCgiObj.rtmpStatus = 0;
                        btnStreamObject.displayOff();
                        btnStreamObject.set('start');
                    }else{
                        jAlert(MSG_STATUS.mID_0074, NPTZ_WORDING.wID_0039);
                    }
                }else if(sysStreamMode == 'ts_udp'){
                    if(sendTsUdpCmd('stop') == 'OK'){
                        reqCgiObj.udpStatus = 0;
                        btnStreamObject.displayOff();
                        btnStreamObject.set('start');
                    }else{
                        jAlert(MSG_STATUS.mID_00100, NPTZ_WORDING.wID_0039);
                    }
                }

            }
        } else {
            // 処理なし
        }
    }
    function sendTsUdpCmd(pCmd){
        var retValue ;
        $.ajax({
            type: "get",
            url: "/cgi-bin/ts_ctrl?cmd=" + pCmd,
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
    function sendRtmpCmd(pCmd){
        let retValue ;
        $.ajax({
            type: "get",
            url: "/cgi-bin/rtmp_ctrl?cmd=" + pCmd,
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
    function sendSrtCmd(pCmd){
        let retValue ;
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

    /*******************************************************lzp cparam.js 20180213 start************************************************************/
    function cparam_eventAudioCtrl(GetEvent) {
        switch (gAudio) {
            case "in":
                InEventAudioCtrl(GetEvent);
                break;
            default:
                break;
        }
    }

    function InEventAudioCtrl(GetEvent) {
        switch (GetEvent) {
            case 0:
                InEventAudioCtrl0();
                break;
            default:
                break;
        }
    }

    function InEventAudioCtrl0() {
        switch (gbAudioState) {
            case 0:
                InAudioImage(1);
                ChgInAudio(1);
                gbAudioState = 1;
                cameraControllerSetting.InVolume(3);
                break;
            case 1:
            default:
                InAudioImage(2);
                ChgInAudio(2);
                cameraControllerSetting.InVolume(1);
                gbAudioState = 0;
                break;
        }
    }

    function InAudioImage(ImgId) {
        var tagMute2 = document.getElementById("id_Mute2");
        cameraControllerSetting.changeSlienceBtn(ImgId);
        switch (ImgId) {
            case 2:
                tagMute2.style.visibility = 'visible';
                break;
            case 1:
            default:
                tagMute2.style.visibility = 'visible';
                break;
        }
    }

    function ChgInAudio(ChgId) {
        if (IsIE()) {
            var objAudio;
            if ($("#sidMainView", window.frames["mainViewHtml"].document)) {
                var vTrans = 0;
                var vStreamMode = 0;
                vStreamMode = menubarCtrl.menubar_GetStreamMode();
                vTrans = menubar_GetTrans(vStreamMode);

                if (vTrans < 2) {
                    objAudio = mainViewHtml.document.WebAudio;
                } else {
                    objAudio = mainViewHtml.document.WebVideo;
                }
                if (ChgId == 1) {
                    if (gAudio == "in") {
                        mainViewHtml.mainview_MuteCancel();
                    }
                    gbMute = false;
                }
                else {
                    if (gAudio == "in") {
                        mainViewHtml.mainview_Mute();
                    }
                    gbMute = true;
                }
            }
        }
        else {
            // DO NOTHING
        }
    }

    function menubar_GetTrans(vStreamMode) {
        switch (vStreamMode) {
            case 1:
                return giTrans;
                break;
            case 2:
                return giTrans2;
                break;
            case 3:
                return giTrans3;
                break;
            case 4:
                return giTrans4;
                break;
            default:
                return giTrans;
                break;
        }
    }

    /*******************************************************lzp cparam.js 20180213 end************************************************************/

    /**
     * change slience button style
     * @param type
     */
    function changeSlienceBtn(type) {
        if (type == 1) {
            btnObject[BTN_SLIENCE].displayOn();
        } else if (type == 2) {
            btnObject[BTN_SLIENCE].displayOff();
        }
    }

    /**
     * open Playlist window
     * @constructor
     */
    function RedirectToPlaylist() {
        var openurl = '/live/playlist.html';
        var name = 'playlist';
        var style = 'height=450px,width=505px,top=200,left=300,toolbar=no,menubar=no,scrollbars=no, resizable=no,location=no, status=no';

        if ("undefined" != typeof(objwindow) && objwindow) {
            if (objwindow.closed) {
                objwindow = null;
                objwindow = window.open(openurl, name, style);
            }
        }
        else {
            objwindow = window.open(openurl, name, style);
        }
        objwindow.focus();
    }

    /**
     * set gain value to element
     * @param value
     */
    function setGainValue(value) {
        if ($(".txt_camera_gain p")[0]) {
            $(".txt_camera_gain p")[0].innerText = value;
        } else if ($(".txt_adjust_camera_gain p")[0]) {
            $(".txt_adjust_camera_gain p")[0].innerText = value;
        } else {
            // nothing
        }
    }

    /**
     * set wb value to element
     * @param value
     */
    function setWbValue(value) {
        if ($(".txt_camera_wb p")[0]) {
            $(".txt_camera_wb p")[0].innerText = value;
        } else if ($(".txt_adjust_camera_wb p")[0]) {
            $(".txt_adjust_camera_wb p")[0].innerText = value;
        } else {
            // nothing
        }
    }

    /**
     * set shutter value to element
     * @param value
     */
    function setShutterValue(value) {
        if ($(".txt_camera_shutter p")[0]) {
            $(".txt_camera_shutter p")[0].innerText = value;
        } else if ($(".txt_adjust_camera_shutter p")[0]) {
            $(".txt_adjust_camera_shutter p")[0].innerText = value;
        } else {
            // nothing
        }
    }

    /**
     * set nd value to element
     * @param value
     */
    function setNdValue(value) {
        if ($(".txt_camera_nd p")[0]) {
            $(".txt_camera_nd p")[0].innerText = value;
        } else if ($(".txt_adjust_camera_nd p")[0]) {
            $(".txt_adjust_camera_nd p")[0].innerText = value;
        } else {
            // nothing
        }
    }

    /**
     * open the bottom window : image adjust
     */
    function changeImageAdjustElementToWindow() {
        $(".btn_iris_add").removeClass("btn_iris_add").addClass("btn_adjust_iris_add");
        $(".btn_iris_sub").removeClass("btn_iris_sub").addClass("btn_adjust_iris_sub");
        $(".btn_iris_auto").removeClass("btn_iris_auto").addClass("btn_adjust_iris_auto");
        $(".btn_gain_add").removeClass("btn_gain_add").addClass("btn_adjust_gain_add");
        $(".btn_gain_sub").removeClass("btn_gain_sub").addClass("btn_adjust_gain_sub");
        $("#scene").hide();
        $(".btn_wb_add").removeClass("btn_wb_add").addClass("btn_adjust_wb_add");
        $(".btn_wb_sub").removeClass("btn_wb_sub").addClass("btn_adjust_wb_sub");
        $(".btn_wb_awb").removeClass("btn_wb_awb").addClass("btn_adjust_wb_awb");
        $(".btn_wb_abb").removeClass("btn_wb_abb").addClass("btn_adjust_wb_abb");
        $(".btn_shutter_add").removeClass("btn_shutter_add").addClass("btn_adjust_shutter_add");
        $(".btn_shutter_sub").removeClass("btn_shutter_sub").addClass("btn_adjust_shutter_sub");
        $(".btn_nd_add").removeClass("btn_nd_add").addClass("btn_adjust_nd_add");
        $(".btn_nd_sub").removeClass("btn_nd_sub").addClass("btn_adjust_nd_sub");
        $(".btn_stream_distribution").removeClass("btn_stream_distribution").addClass("btn_adjust_stream_distribution");
        $(".btn_stream_distribution_first").removeClass("btn_stream_distribution_first").addClass("btn_adjust_stream_distribution_first");
        $(".btn_slient").removeClass("btn_slient").addClass("btn_adjust_slient");
        $(".txt_camera_gain").removeClass("txt_camera_gain").addClass("txt_adjust_camera_gain");
        $(".txt_camera_iris").removeClass("txt_camera_iris").addClass("txt_adjust_camera_iris");
    }

    function main_GetMuteEnv() {
        return gbMute;
    }

    /**
     * close the bottom window : image adjust
     */
    function changeImageAdjustElementToMain() {
        $(".btn_adjust_iris_add").removeClass("btn_adjust_iris_add").addClass("btn_iris_add");
        $(".btn_adjust_iris_sub").removeClass("btn_adjust_iris_sub").addClass("btn_iris_sub");
        $(".btn_adjust_iris_auto").removeClass("btn_adjust_iris_auto").addClass("btn_iris_auto");
        $(".btn_adjust_gain_add").removeClass("btn_adjust_gain_add").addClass("btn_gain_add");
        $(".btn_adjust_gain_sub").removeClass("btn_adjust_gain_sub").addClass("btn_gain_sub");
        if (ptzAdjustCtrlFlag) {
            $("#scene").hide();
        } else {
            $("#scene").show();
        }
        $(".btn_adjust_wb_add").removeClass("btn_adjust_wb_add").addClass("btn_wb_add");
        $(".btn_adjust_wb_sub").removeClass("btn_adjust_wb_sub").addClass("btn_wb_sub");
        $(".btn_adjust_wb_awb").removeClass("btn_adjust_wb_awb").addClass("btn_wb_awb");
        $(".btn_adjust_wb_abb").removeClass("btn_adjust_wb_abb").addClass("btn_wb_abb");
        $(".btn_adjust_shutter_add").removeClass("btn_adjust_shutter_add").addClass("btn_shutter_add");
        $(".btn_adjust_shutter_sub").removeClass("btn_adjust_shutter_sub").addClass("btn_shutter_sub");
        $(".btn_adjust_nd_add").removeClass("btn_adjust_nd_add").addClass("btn_nd_add");
        $(".btn_adjust_nd_sub").removeClass("btn_adjust_nd_sub").addClass("btn_nd_sub");
        $(".btn_adjust_stream_distribution").removeClass("btn_adjust_stream_distribution").addClass("btn_stream_distribution");
        $(".btn_adjust_stream_distribution_first").removeClass("btn_adjust_stream_distribution_first").addClass("btn_stream_distribution_first");
        $(".btn_adjust_cup").removeClass("btn_adjust_cup").addClass("btn_cup");
        $(".btn_adjust_slient").removeClass("btn_adjust_slient").addClass("btn_slient");
        $(".txt_adjust_camera_gain").removeClass("txt_adjust_camera_gain").addClass("txt_camera_gain");
        $(".txt_adjust_camera_wb").removeClass("txt_adjust_camera_wb").addClass("txt_camera_wb");
        $(".txt_adjust_camera_shutter").removeClass("txt_adjust_camera_shutter").addClass("txt_camera_shutter");
        $(".txt_adjust_camera_nd").removeClass("txt_adjust_camera_nd").addClass("txt_camera_nd");
        $(".txt_adjust_camera_iris").removeClass("txt_adjust_camera_iris").addClass("txt_camera_iris");
    }

    var setIndexWbFlg = true;
    function startCameraAdjustInterval() {
        if(refresh_interval_ImageAdjust != null){
            clearInterval(refresh_interval_ImageAdjust);
        }
        var url = isPageFlg;
        setTimeout(function(){
            refresh_interval_ImageAdjust = setInterval(function(){
                if(window.location.href.indexOf("live") !="-1"){
                    if(adminPage && window.parent.document.getElementById("setup_imageAdjust_main").style.display == "none"){
                        return;
                    }
                }
                if($("#camera_controller_gui").css("display") != "none" && ($("#camera_controller_gui").hasClass("camera_controller_gui_to_setup_preset") || $("#camera_controller_gui").hasClass("camera_controller_gui_to_setup_preset_ppls"))|| url == "live"){
                    if(setIndexWbFlg){
                        indexWb = Number(cparam_get_whiteBalanceMode());
                        gainColorShutterND =  cparam_get_gainColorShutterNDTogether().toString();
                        gGain  = parseInt(gainColorShutterND.substring(0,2),16)-1;
                        gShutter = gainColorShutterND.substring(7,8);
                        // indexGain = gGain-6;

                        gainTxtObjArr.forEach(function(element){
                            if(element.data === gainColorShutterND.substring(0,2)){
                                currentGainTxtObj = element;
                                return;
                            }
                        });

                        indexShutter = gShutter;
                        setIndexWbFlg = false;
                    }
                    getCameraAdjustValue();
                }
            }, 1000);
        },300);
    }

    function getCameraAdjustValue() {
        var lock = $('#power').prop("disabled");
        if (lock) {
            return false;
        }
        if(!pcOperationFlag && liveModeFlg || firstPTG){
            firstPTG = false;
            var imageAdjustValue = reqCgiObj.imageAdjustValue.toString();
            // update SuperGain
            cameraControllerSetting.imageControlButton.insertGainTxtM();
            // var gain = parseInt(reqCgiObj.Gain, 16) - 7;
            // indexGain = gain;

            gainTxtObjArr.forEach(function(element){
                if(element.data === reqCgiObj.Gain){
                    currentGainTxtObj = element;
                    return;
                }
            });


            // if (gain == 121) {
            //     indexGain = 0;
            //     setGainValue(NPTZ_WORDING.wID_0016);
            // } else {
            //     setGainValue(parseInt(reqCgiObj.Gain, 16) - 8 + "dB");
            // }

            if(currentGainTxtObj){
                if (currentGainTxtObj.id == 128) {
                    isGainAuto = true;
                    setGainValue(NPTZ_WORDING.wID_0016);
                } else {
                    setGainValue(currentGainTxtObj.name);
                }
            }

            indexWb = Number(reqCgiObj.getWhiteBalanceMode); //add 20181026 対応#3666
            txtObject[TXT_CAMERA_WB].set(wbTxtArr[indexWb]);
            var shutter = Number(reqCgiObj.Shutter);
            txtObject[TXT_CAMERA_SHUTTER].set(shutterTxtArr[shutter]);
            var nd = reqCgiObj.ND;
            indexNd = nd;
            txtObject[TXT_CAMERA_ND].set(ndTxtArr[parseInt(nd)]);
            var dayOrNight = reqCgiObj.getDayNight;
            if (dayOrNight == 0) {
                btnObject[BTN_ND_ADD].displayOff();
                btnObject[BTN_ND_SUB].displayOff();
                btnObject[BTN_WB_AWB].displayOff();
            } else {
                btnObject[BTN_ND_ADD].displayDisabled();
                btnObject[BTN_ND_SUB].displayDisabled();
                txtObject[TXT_CAMERA_ND].set(NPTZ_WORDING.wID_0167);
                btnObject[BTN_WB_AWB].displayDisabled();
            }
        }
    }

    function initSceneButton(){

        if(window.location.href.indexOf("live") !="-1"){
            if(adminPage && window.parent.document.getElementById("setup_imageAdjust_main").style.display == "none"){
                return;
            }
        }
        if(document.getElementById("main_gui").style.display == "none"){
            clearInterval(gSceneId);
            return;
        }
        if($(".btn_lock").hasClass("on")||$(".btn_lock").hasClass("on_hover") || !liveModeFlg){
            return;
        }
        // var index = reqCgiObj.gScene;
        // $('.txt_selectedScene > P').html(getTextBySceneMode(index));
        // if(parseInt(index)){
        //     sceneButtonObject[1].displayOff();
        //     sceneButtonObject[2].displayOff();
        //     sceneButtonObject[3].displayOff();
        //     sceneButtonObject[4].displayOff();
        //     sceneButtonObject[index].displayOn();
        // }
    }

    function initStoreLoadItems(){
        return {'LOAD':'LOAD','STORE':'STORE'}
    }
    
    function initFromItemsAll(){
        return {
        'SceneOff':'SceneOff',
        'Scene1':'Scene1',
        'Scene2':'Scene2',
        'Scene3':'Scene3',
        'Scene4':'Scene4',
        'Scene5':'Scene5',
        'Scene6':'Scene6',
        'Scene7':'Scene7',
        'Scene8':'Scene8',
        'User1':'User1',
        'User2':'User2',
        'User3':'User3',
        }
    }

    function initToItemsAll(){
        return {
        'Scene1':'Scene1',
        'Scene2':'Scene2',
        'Scene3':'Scene3',
        'Scene4':'Scene4',
        'Scene5':'Scene5',
        'Scene6':'Scene6',
        'Scene7':'Scene7',
        'Scene8':'Scene8',
        'User1':'User1',
        'User2':'User2',
        'User3':'User3',
        }
    }

    function initCurrentSettingItems(){
        return {"Current Seting":"Current Seting"}
    }

    function callbackStoreLoadChange(){
        switch (selectSenceUserObject[SELECT_STORE_LOAD].get()) {
            case "STORE":
                selectSenceUserObject[SELECT_FROM].refreshOptions(initCurrentSettingItems());
                selectSenceUserObject[SELECT_TO].refreshOptions(initToItemsAll());
                break;
            case "LOAD":
                selectSenceUserObject[SELECT_FROM].refreshOptions(initFromItemsAll());
                selectSenceUserObject[SELECT_TO].refreshOptions(initCurrentSettingItems());
                
                break;
        }
    }
    
    function callbackExecute( mouse){
        if (mouse == Button.MOUSE_DOWN){
            switch (selectSenceUserObject[SELECT_STORE_LOAD].get()) {
                case "LOAD":
                    switch (selectSenceUserObject[SELECT_FROM].get()) {
                        //XSF:[Data]
                        case 'Scene1':
                            cparam_set_sceneMode(1);
                            break;
                        case  'Scene2':
                            cparam_set_sceneMode(2);
                            break;
                        case 'Scene3':
                            cparam_set_sceneMode(3);
                            break;
                        case 'Scene4':
                            cparam_set_sceneMode(4);
                            break;
                        case  'Scene5':
                            cparam_set_sceneMode(5);
                            break;
                        case  'Scene6':
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
                        //OSL:92:[Data]
                        case  'User1':
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
                    switch (selectSenceUserObject[SELECT_TO].get()) {
                        case 'Scene1':
                            cparam_set_storeSceneFile(1)
                            break;
                        case  'Scene2':
                            cparam_set_storeSceneFile(2)
                            break;
                        case 'Scene3':
                            cparam_set_storeSceneFile(3)
                            break;
                        case 'Scene4':
                            cparam_set_storeSceneFile(4)
                            break;
                        case  'Scene5':
                            cparam_set_storeSceneFile(5)
                            break;
                        case  'Scene6':
                            cparam_set_storeSceneFile(6)
                            break;
                        case 'Scene7':
                            cparam_set_storeSceneFile(7)
                            break;
                        case 'Scene8':
                            cparam_set_storeSceneFile(8)
                            break;
                        case  'User1':
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

    return {
        build: function () {
            if (buildFlag == false) {
                buildFlag = true;
                // Pan/Tilt Control UP
                btnObject[BTN_IRIS_ADD] = ButtonCtrl('camera_controller_gui_adjust_iris', 'btn_iris_add', NPTZ_WORDING.wID_0014, callbackIrisADD);
                btnObject[BTN_IRIS_SUB] = ButtonCtrl('camera_controller_gui_adjust_iris', 'btn_iris_sub', NPTZ_WORDING.wID_0015, callbackIrisSUB);
                btnObject[BTN_IRIS_AUTO] = ButtonCtrl('camera_controller_gui_adjust_iris', 'btn_iris_auto', NPTZ_WORDING.wID_0016, callbackIrisAuto);
                btnObject[BTN_GAIN_ADD] = ButtonCtrl('camera_controller_gui_adjust_gain', 'btn_gain_add', "", callbackGainADD);
                btnObject[BTN_GAIN_SUB] = ButtonCtrl('camera_controller_gui_adjust_gain', 'btn_gain_sub', "", callbackGainSUB);
                btnObject[BTN_WB_ADD] = ButtonCtrl('camera_controller_gui_adjust_wb', 'btn_wb_add', "", callbackWbADD);
                btnObject[BTN_WB_SUB] = ButtonCtrl('camera_controller_gui_adjust_wb', 'btn_wb_sub', "", callbackWbSUB);
                btnObject[BTN_WB_AWB] = ButtonCtrl('camera_controller_gui_adjust_wb', 'btn_wb_awb', NPTZ_WORDING.wID_0017, callbackWbAWB);
                btnObject[BTN_WB_ABB] = ButtonCtrl('camera_controller_gui_adjust_wb', 'btn_wb_abb', NPTZ_WORDING.wID_0018, callbackWbABB);
                btnObject[BTN_SHUTTER_ADD] = ButtonCtrl('camera_controller_gui_adjust_shutter', 'btn_shutter_add', "", callbackShutterADD);
                btnObject[BTN_SHUTTER_SUB] = ButtonCtrl('camera_controller_gui_adjust_shutter', 'btn_shutter_sub', "", callbackShutterSUB);
                btnObject[BTN_ND_ADD] = ButtonCtrl('camera_controller_gui_adjust_nd', 'btn_nd_add', "", callbackNdADD);
                btnObject[BTN_ND_SUB] = ButtonCtrl('camera_controller_gui_adjust_nd', 'btn_nd_sub', "", callbackNdSUB);
                btnObject[BTN_CUP] = ButtonCtrl('camera_controller_gui', 'btn_cup', "", callbackCup);
                btnObject[BTN_SLIENCE] = ButtonCtrl('camera_control_adjust_down_area', 'btn_slient', "", callbackSlient);
                btnObject[BTN_STREAM_DISTRIBUTION] = ButtonCtrl('camera_control_adjust_down_area', 'btn_stream_distribution', NPTZ_WORDING.wID_0419, callbackSettingDistribution, BTN_STREAM_DISTRIBUTION);
                btnStreamObject = ButtonCtrl('camera_controller_gui', 'btn_stream_stop', NPTZ_WORDING.wID_0420, callbackSettingStop);

                txtObject[TXT_CAMERA_GAIN] = TextCtrl('camera_controller_gui_adjust_gain', 'txt_camera_gain', NPTZ_WORDING.wID_0167);
                txtObject[TXT_CAMERA_WB] = TextCtrl('camera_controller_gui_adjust_wb', 'txt_camera_wb', NPTZ_WORDING.wID_0167);
                txtObject[TXT_CAMERA_SHUTTER] = TextCtrl('camera_controller_gui_adjust_shutter', 'txt_camera_shutter', NPTZ_WORDING.wID_0167);
                txtObject[TXT_CAMERA_ND] = TextCtrl('camera_controller_gui_adjust_nd', 'txt_camera_nd', NPTZ_WORDING.wID_0167);
                //TXT:IRIS
                txtObject[TXT_CAMERA_IRIS] = TextCtrl('camera_controller_gui_adjust_iris', 'txt_camera_iris', NPTZ_WORDING.wID_0167);
                // txtObject[TXT_CAMERA_IRIS + 1] = TextCtrl('scene', 'scene_title', NPTZ_WORDING.wID_0168);
                txtObject[TXT_STREAM_RTMP] = TextCtrl('camera_controller_gui', 'stream_rtmp', NPTZ_WORDING.wID_0169);

                // sceneButtonObject[1] = ButtonCtrl('scene', 'scene1_btn', NPTZ_WORDING.wID_0421, callSceneSet, 1);
                // sceneButtonObject[2] = ButtonCtrl('scene', 'scene2_btn', NPTZ_WORDING.wID_0422, callSceneSet, 2);
                // sceneButtonObject[3] = ButtonCtrl('scene', 'scene3_btn', NPTZ_WORDING.wID_0423, callSceneSet, 3);
                // sceneButtonObject[4] = ButtonCtrl('scene', 'scene4_btn', NPTZ_WORDING.wID_0424, callSceneSet, 4);

                txtObject[TXT_SCENE_USER] = TextCtrl('scene', 'scene_user_title', NPTZ_WORDING.wID_0727);
                txtObject[TXT_STORE_LOAD] = TextCtrl('scene', 'scene_store_load', NPTZ_WORDING.wID_0728);
                txtObject[TXT_FROM] = TextCtrl('scene', 'scene_from', NPTZ_WORDING.wID_0729);
                txtObject[TXT_TO] = TextCtrl('scene', 'scene_to', NPTZ_WORDING.wID_0730);

                selectSenceUserObject[SELECT_STORE_LOAD] = SelectCtrl('scene', "select_store_load", "select_store_load", "select_store_load_box", callbackStoreLoadChange,null,initStoreLoadItems());
                selectSenceUserObject[SELECT_FROM] = SelectCtrl('scene', "select_from", "select_from", "select_from_box", null,null,initFromItemsAll());
                selectSenceUserObject[SELECT_TO] = SelectCtrl('scene', "select_to", "select_to", "select_to_box", null,null,initCurrentSettingItems());
                

                selectSenceUserObject[SELECT_STORE_LOAD].show();
                selectSenceUserObject[SELECT_FROM].show();
                selectSenceUserObject[SELECT_TO].show() ;

                selectSenceUserObject[SELECT_STORE_LOAD].displayOff();
                selectSenceUserObject[SELECT_FROM].displayOff();
                selectSenceUserObject[SELECT_TO].displayOff();
                btnObject[BTN_EXECUTE] = ButtonCtrl('scene', 'btn_scene_execute', NPTZ_WORDING.wID_0731, callbackExecute);

                if(isPageFlg == "live"){
                    sceneSelected = TextCtrl('camera_control_adjust_down_area', 'txt_selectedScene', getTextBySceneMode(gScene));
                    sceneSelected.show();
                    if (sysStreamMode == 'rtmp' || sysStreamMode == 'rtmp_uhd' || sysStreamMode == 'srt_h264' || sysStreamMode == 'srt_h264_uhd' || sysStreamMode == 'srt_h265' || sysStreamMode == 'srt_h265_uhd' || sysStreamMode == 'ts_udp') {
                        if (getRtmpStatus() == '0' || getsrtStatus() == '0') {
                            btnStreamObject.displayOff();
                            btnStreamObject.set('start');
                        } else {
                            btnStreamObject.displayOn();
                            btnStreamObject.set('stop');
                        }
                    }
                }
                $(".txt_camera_gain").attr("id","txt_camera_gain");
                // for (var obj in sceneButtonObject) {
                //     sceneButtonObject[obj].show();
                //     sceneButtonObject[obj].displayOff();
                // }
                btnStreamObject.show();
                if(gPower == 1){
                    gSceneId = setInterval(initSceneButton,5000);
                }

            }
        },

        show: function () {
            for (var btn in btnObject) {
                btnObject[btn].show();
            }
            btnObject[BTN_STREAM_DISTRIBUTION].hide();
            for (var txt in txtObject) {
                txtObject[txt].show();
            }
            $("#camera_ptz_ctrl").mousedown(function () {
                pcOperationFlag = true;
                window.frames["mainViewHtml"].mainViewOperationFlag=true;
                cameraPtzCtrl();
            });
            $("#window_ptz_ctrl").mousedown(function () {
                windowPtzCtrl();
            });
            $("#setup_crop_ptz_center_ctrl").mousedown(function () {
                setupPtzCtrl();
            });
            document.getElementById("camera_ptz_ctrl").addEventListener('touchstart', cameraPtzCtrl, false);
            document.getElementById("window_ptz_ctrl").addEventListener('touchstart', windowPtzCtrl, false);
            function cameraPtzCtrl() {
                pcOperationFlag = true;
                window.frames["mainViewHtml"].mainViewOperationFlag=true;
                ptzCtrlEventDown("camera_ptz_ctrl2", "control_ptz", true);
            }

            function windowPtzCtrl(e) {
                ptzCtrlEventDown("window_ptz_ctrl2", "window_ptz", true,e);
            }

            function setupPtzCtrl() {
                ptzCtrlEventDown("crop_control", "control_crop", false);
            }

            function ptzCtrlEventDown(controllerName, mouserActiveId, guiPtzIsHide,e) {
                var lock = $('#power').prop("disabled");
                if (lock) {
                    return false;
                }

                if (guiPtzIsHide) {
                    $("#camera_controller_gui_ptz").hide();
                }

                $("#" + controllerName).show();
                thisMouseActiveId = mouserActiveId;
                ptzCircleCloseFlag = false;
                ptzDownFlag = true;
                if(e != undefined && e.type == "touchstart" ){
                    var touch = e.targetTouches[0];
                    mx = touch.pageX;
                    my = touch.pageY;

                    controlPtzMoveTouch(mx,my);
                }else{
                    controlPtzMoveMouse();
                }
            }
            btnObject[BTN_SLIENCE].hide();
            if(gPower == 1){
                startCameraAdjustInterval();
            }
        },
        addEventListener:function (){
            document.getElementById("setup_crop_ptz_center_ctrl").addEventListener('touchstart', setupPtzCtrl, false);

            function setupPtzCtrl() {
                ptzCtrlEventDown("crop_control", "control_crop", false);
            }

            function ptzCtrlEventDown(controllerName, mouserActiveId, guiPtzIsHide,e) {
                var lock = $('#power').prop("disabled");
                if (lock) {
                    return false;
                }

               if($("#setup_crop_ptz_center_ctrl").attr("disabled") == "disabled"){
                    return;
               }

                if (guiPtzIsHide) {
                    $("#camera_controller_gui_ptz").hide();
                }

                $("#" + controllerName).show();
                $("#setup_crop_ptz_ctrl").hide();
                thisMouseActiveId = mouserActiveId;
                ptzCircleCloseFlag = false;
                ptzDownFlag = true;
                if(e != undefined && e.type == "touchstart" ){
                    var touch = e.targetTouches[0];
                    mx = touch.pageX;
                    my = touch.pageY;

                    controlPtzMoveTouch(mx,my);
                }else{
                    controlPtzMoveMouse();
                }
            }
        },
        hide: function () {
            for (var btn in btnObject) {
                btnObject[btn].hide();
            }
            for (var txt in txtObject) {
                txtObject[txt].hide();
            }
        },
        updateStatus: updateStatus,
        getCheckedCameraList: getCheckedCameraList,
        initControllerButtons2: initControllerButtons2,
        changeSlienceBtn: changeSlienceBtn,
        setIrisValue: setIrisValue,
        changeImageAdjustElementToWindow: changeImageAdjustElementToWindow,
        changeImageAdjustElementToMain: changeImageAdjustElementToMain,
        //setSceneSelectedValue:setSceneSelectedValue,
        main_GetMuteEnv: main_GetMuteEnv,
        irisAuto:irisAuto,
        insertGainTxtM:insertGainTxtM,
        setStopButtonStart: function (){
            btnStreamObject.displayOff();
            btnStreamObject.set('start');
        },
        setStopButtonStop: function (){
            btnStreamObject.displayOn();
            btnStreamObject.set('stop');
        },
        setStopButtonDisable: function (){
            btnStreamObject.displayDisabled();
            btnStreamObject.set('start');
        }
    };
}

function preset_enableZoomWheel() {
    clearTimeout(gTimerDisableZoomWheel);
    giZoomWheelState = ZOOM_WHEEL_STOP;
}

function preset_stopZoomWheel() {
    clearTimeout(gTimerWaitStopZoomWheel);
    cparam_set_zoomSpeed(50);
    gbZoomWheelSpeedUp = false;
    preset_enableZoomWheel();
}