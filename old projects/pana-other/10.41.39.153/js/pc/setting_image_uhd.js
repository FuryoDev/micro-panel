/**
 * @fileOverview Setup画面:UHD crop制御に関わる画面クラス
 *
 * @author Panasonic Corporation
 */

var settingIoaUhd = settingIoaUhd();
var gcropColorArea = null;

/**
 * setup画面:UHD crop制御に関わる画面クラス
 * @class Settings画面:UHD crop制御に関わる画面クラス
 * @return {function} build 構築処理
 * @return {function} rebuild 再構築処理
 * @constructor
 */

function settingIoaUhd() {
    /**
     * 構築フラグ
     * @type boolean
     */
    let buildFlag = false;

    /**
     * labelオブジェクト
     * @type txtNetworkObject[]
     */
    const txtUhdObject = [];
    /**
     * label定義 : CROP Mode
     * @type number
     */
    const SETUP_UHD_CROP_MODE_LABEL = 0;
    /**
     * label定義 : CROP Marker Set
     * @type number
     */
    const SETUP_UHD_CROP_MARKER_SET_LABEL = 1;
    /**
     * label定義 : CROP Output Set
     * @type number
     */
    const SETUP_UHD_CROP_OUTPUT_SET_LABEL = 2;
    /**
     * label定義 : CROP Adjust Set
     * @type number
     */
    const SETUP_UHD_CROP_ADJUST_SET_LABEL = 3;
    /**
     * label定義 : YL
     * @type number
     */
    const SETUP_UHD_CROP_YL_LABEL = 4;
    /**
     * label定義 : G
     * @type number
     */
    const SETUP_UHD_CROP_G_LABEL = 5;
    /**
     * label定義 : MG
     * @type number
     */
    const SETUP_UHD_CROP_MG_LABEL = 6;
    /**
     * label定義 : X
     * @type number
     */
    const SETUP_UHD_CROP_X_LABEL = 7;
    /**
     * label定義 : Y
     * @type number
     */
    const SETUP_UHD_CROP_Y_LABEL = 8;
    /**
     * label定義 : 3G_SDI_OUT
     * @type number
     */
    const SETUP_UHD_CROP_3G_SDI_OUT = 9;
    /**
     * label定義 : IP_OUT
     * @type number
     */
    const SETUP_UHD_CROP_IP_OUT = 10;
    /**
     * label定義 : IP_OUT
     * @type number
     */
    const SETUP_UHD_CROP_Y = 11;
    /**
     * label定義 : IP_OUT
     * @type number
     */
    const SETUP_UHD_CROP_G = 12;
    /**
     * label定義 : IP_OUT
     * @type number
     */
    const SETUP_UHD_CROP_MA = 13;
    /**
     * label定義 : IP_OUT
     * @type number
     */
    const SETUP_UHD_CROP_IP1 = 14;
    /**
     * label定義 : IP_OUT
     * @type number
     */
    const SETUP_UHD_CROP_IP2 = 15;
    /**
     * label定義 : IP_OUT
     * @type number
     */
    const SETUP_UHD_CROP_MARKER = 16;
    /**
     * label定義 : IP_OUT
     * @type number
     */
    const SETUP_UHD_CROP_IP_MARKER = 17;
    /**
     * label定義 : IP_OUT
     * @type number
     */
    const SETUP_UHD_CROP_CROP_ZOOM= 18;
    /**
     * label定義 : IP_OUT
     * @type number
     */
    const SETUP_UHD_CROP_CROP_SPEED= 19;
    /**
     * label定義 : IP_OUT
     * @type number
     */
    const SETUP_UHD_CROP_ZOOM= 20;
    /**
     * label定義 : IP_OUT
     * @type number
     */
    const SETUP_UHD_CROP_ZOOM_VALUE= 21;

    /**
     * label定義 : IP_OUT
     * @type number
     */
    const SETUP_UHD_CROP_CROP_AF = 22;

    /**
     * radio group
     * @type radioUhdButtonGroup[]
     */
    const radioUhdButtonGroup = [];
    /**
     * radio定義 : CROP Mode
     */
    const SETUP_UHD_CROP_MODE = 0;
    const SETUP_CROP_ADJUST_BUTTON = 1;

    /**
     * button[]
     * @type btnUhdObject[]
     */
    let btnUhdObject = [];
    /**
     * button : Marker YL
     */
    const SETUP_CROP_MARKER_YL_BUTTON = 0;
    /**
     * button : Marker G
     */
    const SETUP_CROP_MARKER_G_BUTTON = 1;
    /**
     * button : Marker MG
     */
    const SETUP_CROP_MARKER_MG_BUTTON = 2;
    /**
     * button : Output YL
     */
    const SETUP_CROP_OUTPUT_YL_BUTTON = 3;
    /**
     * button : Output G
     */
    const SETUP_CROP_OUTPUT_G_BUTTON = 4;
    /**
     * button : Output MG
     */
    const SETUP_CROP_OUTPUT_MG_BUTTON = 5;
    /**
     * button : Output FULL
     */
    const SETUP_CROP_OUTPUT_FULL_BUTTON = 6;
    /**
     * button : Adjust YL
     */
    const SETUP_CROP_ADJUST_YL_BUTTON = 7;
    /**
     * button : Adjust G
     */
    const SETUP_CROP_ADJUST_G_BUTTON = 8;
    /**
     * button : Adjust MG
     */
    const SETUP_CROP_ADJUST_MG_BUTTON = 9;
    /**
     * button : 3g SDI
     */
    const SETUP_CROP_3G_SDI_OUT_CROP = 10;
    /**
     * button : 3g SDI
     */
    const SETUP_CROP_3G_SDI_OUT_FULL = 11;
    /**
     * button : IP OUT
     */
    const SETUP_CROP_IP_OUT_CROP = 12;
    /**
     * button : IP OUT
     */
    const SETUP_CROP_IP_OUT_FULL = 13;
    /**
     * button : CROP_ZOOM
     */
    const SETUP_CROP_ZOOM_CROP= 14;
    /**
     * button : CROP_ZOOM
     */
    const SETUP_CROP_ZOOM_FULL= 15;
    /**
     * button : NDI OUT
     */
    const SETUP_CROP_NDI_OUT_CROP= 24;
    /**
     * button : NDI OUT
     */
    const SETUP_CROP_NDI_OUT_FULL = 25;
    /**
     * button : IP OUT
     */
    const SETUP_CROP_IP_OUT_2_CROP = 26;
    /**
     * button : IP OUT
     */
    const SETUP_CROP_IP_OUT_2_FULL = 27;
    /**
     * button : CROP_MARKER
     */
    const SETUP_CROP_MARKER_OFF = 20;
    /**
     * button : CROP_MARKER
     */
    const SETUP_CROP_MARKER_ON = 21;
    /**
     * button : IP_MARKER
     */
    const SETUP_CROP_IP_MARKER_OFF = 22;
    /**
     * button : IP_MARKER
     */
    const SETUP_CROP_IP_MARKER_ON = 23;
    /**
    * button : CROP_AF 
    */
    const SETUP_CROP_AF_ON = 28;
    /**
    * button : CROP_AF 
    */
    const SETUP_CROP_AF_OFF = 29;


    /**
     * ボタンオブジェクト
     * @type ButtonCtrl[]
     */
    const btnUhdPtzObject = [];
    /**
     * Tilt・UPボタン　押下可能エリア(インデックス値)
     * @type number
     */
    const SETUP_CROP_UP_BUTTON = 4;
    /**
     * Tilt・DOWNボタン　押下可能エリア(インデックス値)
     * @type number
     */
    const SETUP_CROP_DOWN_BUTTON = 5;
    /**
     * Pan・LEFTボタンボタン 押下可能エリア(インデックス値)
     * @type number
     */
    const SETUP_CROP_LEFT_BUTTON = 6;
    /**
     * Pan・RIGHTボタン 押下可能エリア(インデックス値)
     * @type number
     */
    const SETUP_CROP_RIGHT_BUTTON = 7;
    /**
     * 左上ボタン　押下可能エリア(インデックス値)
     * @type number
     */
    const SETUP_CROP_UP_LEFT_BUTTON = 12;
    /**
     * 左下ボタン　押下可能エリア(インデックス値)
     * @type number
     */
    const SETUP_CROP_DOWN_LEFT_BUTTON = 13;
    /**
     * 右上ボタン 押下可能エリア(インデックス値)
     * @type number
     */
    const SETUP_CROP_UP_RIGHT_BUTTON = 14;
    /**
     * 右下ボタン 押下可能エリア(インデックス値)
     * @type number
     */
    const SETUP_CROP_DOWN_RIGHT_BUTTON = 15;
    const BTN_SPEED_FAST = 16;
    const BTN_SPEED_SLOW = 17;
    const BTN_ZOOM_TELE = 18;
    const BTN_ZOOM_WIDE = 19;

    /**
     * input[] : text
     * @type inputUhdObject[]
     */
    let inputUhdObject = [];
    /**
     * input : UHD Crop : X
     */
    const SETUP_UHD_CROP_X_INPUT = 0;
    /**
     * input : UHD Crop : Y
     */
    const SETUP_UHD_CROP_Y_INPUT = 1;

    /**
     * UHDエリア設定左部
     */
    let sliderDetectLeft = SliderVerticalEnable();

    /**
     * UHDエリア設定下部
     */
    let sliderDetectBottom = SliderHorizontalEnable();

    // crop adjust button
    let crop_adjust_color_flag = 1;

    // checkBox
    let crop_marker_yl_flag = 0;
    let crop_marker_g_flag = 0;
    let crop_marker_mg_flag = 0;

    let btnCROPMode;
    let btnCROPOutputPTZ;
    let line1;

    let currentVerticalValue = 0;
    let currentHorizontalValue = 0;
    let index;
    let type;
    let ipOutFlg = 0;
    let draggableFlg = true;
    let resultIp;
    let cropPosition = [];
    const crop_adjust_div = "setup_UHPDCrop_Adjust";
    let intervalIDSpeed = null;
    /**
     * sliderCropSpeedスライダ制御クラスのインスタンス
     * @type Slider
     */
    const sliderCropSpeed = Slider();
    /**
     * zoomスライダ制御クラスのインスタンス
     * @type Slider
     */
    const sliderCropZoom = Slider();
    //let zoomClick = false;
    /**
     * UHD crop設定画面構築処理
     */
    function build() {
        if (!buildFlag) {
            buildFlag = true;
            $('#setup_preset_form_inner').hide();
            $("#camera_ptz_d_zoom_label").hide();
            $("#camera_ptz_d_ext_label").hide();
            $("#camera_ptz_touch_label").hide();
            $("#camera_controller_gui_th_btns").hide();
            $("#camera_preset_title").hide();
            $("#camera_controller_gui").append($('<div id="setup_uhd_form_inner" class="setup_uhd_form_inner"></div>'));
            $("#setup_uhd_form_inner").append($('<div id="setup_uhd_form_inner_div" class="setup_uhd_form_inner_div"></div>'));
            var setup_uhd_form_inner = "setup_uhd_form_inner";
            var setup_uhd_form_inner_div = "setup_uhd_form_inner_div";
            txtUhdObject[SETUP_UHD_CROP_MODE_LABEL] = TextCtrl(setup_uhd_form_inner, 'setup_uhd_crop_mode_label', NPTZ_WORDING.wID_0050);
            txtUhdObject[SETUP_UHD_CROP_OUTPUT_SET_LABEL] = TextCtrl(crop_adjust_div, 'setup_uhd_crop_output_set_label', NPTZ_WORDING.wID_0052);
            txtUhdObject[SETUP_UHD_CROP_ADJUST_SET_LABEL] = TextCtrl(crop_adjust_div, 'setup_uhd_crop_adjust_set_label', NPTZ_WORDING.wID_0053);
            txtUhdObject[SETUP_UHD_CROP_YL_LABEL] = TextCtrl(setup_uhd_form_inner_div, 'setup_uhd_crop_yl_label', "");
            txtUhdObject[SETUP_UHD_CROP_G_LABEL] = TextCtrl(setup_uhd_form_inner_div, 'setup_uhd_crop_g_label', "");
            txtUhdObject[SETUP_UHD_CROP_MG_LABEL] = TextCtrl(setup_uhd_form_inner_div, 'setup_uhd_crop_mg_label', "");

            radioUhdButtonGroup[SETUP_UHD_CROP_MODE] = RadioButtonGroupCtrl(setup_uhd_form_inner, "setup_uhd_crop_mode", RADIO_GROUP.rID_0051, '0', callbackChangeCropMode);

            btnUhdObject[SETUP_CROP_MARKER_YL_BUTTON] = ButtonCtrl(crop_adjust_div, "setup_crop_marker_yl_button", "", callbackMarkerSet, SETUP_CROP_MARKER_YL_BUTTON);
            btnUhdObject[SETUP_CROP_MARKER_G_BUTTON] = ButtonCtrl(crop_adjust_div, "setup_crop_marker_g_button", "", callbackMarkerSet, SETUP_CROP_MARKER_G_BUTTON);
            btnUhdObject[SETUP_CROP_MARKER_MG_BUTTON] = ButtonCtrl(crop_adjust_div, "setup_crop_marker_mg_button", "", callbackMarkerSet, SETUP_CROP_MARKER_MG_BUTTON);
            btnUhdObject[SETUP_CROP_OUTPUT_YL_BUTTON] = ButtonCtrl(crop_adjust_div, "setup_crop_output_yl_button", "", callbackOutputSet, SETUP_CROP_OUTPUT_YL_BUTTON);
            btnUhdObject[SETUP_CROP_OUTPUT_G_BUTTON] = ButtonCtrl(crop_adjust_div, "setup_crop_output_g_button", "", callbackOutputSet, SETUP_CROP_OUTPUT_G_BUTTON);
            btnUhdObject[SETUP_CROP_OUTPUT_MG_BUTTON] = ButtonCtrl(crop_adjust_div, "setup_crop_output_mg_button", "", callbackOutputSet, SETUP_CROP_OUTPUT_MG_BUTTON);
            btnUhdObject[SETUP_CROP_OUTPUT_FULL_BUTTON] = ButtonCtrl(setup_uhd_form_inner_div, "setup_crop_output_full_button", NPTZ_WORDING.wID_0431, callbackOutputSet, SETUP_CROP_OUTPUT_FULL_BUTTON);
            //radioUhdButtonGroup[SETUP_CROP_ADJUST_BUTTON] = RadioButtonGroupCtrl(crop_adjust_div, "setup_crop_adjust_button", RADIO_GROUP.rID_0058,'0', callbackAdjustSet);

            btnUhdObject[SETUP_CROP_ADJUST_YL_BUTTON] = ButtonCtrl(crop_adjust_div, "setup_crop_adjust_yl_button", NPTZ_WORDING.wID_0054, callbackAdjustSet, SETUP_CROP_ADJUST_YL_BUTTON);
            btnUhdObject[SETUP_CROP_ADJUST_G_BUTTON] = ButtonCtrl(crop_adjust_div, "setup_crop_adjust_g_button", NPTZ_WORDING.wID_0055, callbackAdjustSet, SETUP_CROP_ADJUST_G_BUTTON);
            btnUhdObject[SETUP_CROP_ADJUST_MG_BUTTON] = ButtonCtrl(crop_adjust_div, "setup_crop_adjust_mg_button", NPTZ_WORDING.wID_0056, callbackAdjustSet, SETUP_CROP_ADJUST_MG_BUTTON);


            //2019/01/17 add with wpz
            btnUhdObject[SETUP_CROP_3G_SDI_OUT_CROP] = ButtonCtrl(setup_uhd_form_inner, "setup_crop_3g_sdi_out_crop", NPTZ_WORDING.wID_0059, callback3GOutSet,1);
            btnUhdObject[SETUP_CROP_3G_SDI_OUT_FULL] = ButtonCtrl(setup_uhd_form_inner, "setup_crop_3g_sdi_out_full", NPTZ_WORDING.wID_0431, callback3GOutSet,2);
            btnUhdObject[SETUP_CROP_IP_OUT_CROP] = ButtonCtrl(setup_uhd_form_inner, "setup_crop_ip_out_crop", NPTZ_WORDING.wID_0059, callbackIPOutSet,1);
            btnUhdObject[SETUP_CROP_IP_OUT_FULL] = ButtonCtrl(setup_uhd_form_inner, "setup_crop_ip_out_full", NPTZ_WORDING.wID_0431, callbackIPOutSet,2);
            //2022/09/27 add by yangyang
            btnUhdObject[SETUP_CROP_AF_ON] = ButtonCtrl(setup_uhd_form_inner, "setup_crop_af_on", NPTZ_WORDING.wID_0037, callbackCropAfSet,1);
            btnUhdObject[SETUP_CROP_AF_OFF] = ButtonCtrl(setup_uhd_form_inner, "setup_crop_af_off", NPTZ_WORDING.wID_0038, callbackCropAfSet,2);

            //crop zoom
            btnUhdObject[SETUP_CROP_ZOOM_CROP] = ButtonCtrl(setup_uhd_form_inner, "setup_crop_zoom_crop", NPTZ_WORDING.wID_0038, callbackCropZoomSet,1);
            btnUhdObject[SETUP_CROP_ZOOM_FULL] = ButtonCtrl(setup_uhd_form_inner, "setup_crop_zoom_full", NPTZ_WORDING.wID_0037, callbackCropZoomSet,2);
            //ndi out
            btnUhdObject[SETUP_CROP_NDI_OUT_CROP] = ButtonCtrl(setup_uhd_form_inner, "setup_crop_ndi_out_crop", NPTZ_WORDING.wID_0059, callbackNDIOutSet,1);
            btnUhdObject[SETUP_CROP_NDI_OUT_FULL] = ButtonCtrl(setup_uhd_form_inner, "setup_crop_ndi_out_full", NPTZ_WORDING.wID_0431, callbackNDIOutSet,2);
            //ip out2
            btnUhdObject[SETUP_CROP_IP_OUT_2_CROP] = ButtonCtrl(setup_uhd_form_inner, "setup_crop_ip_out_2_crop", NPTZ_WORDING.wID_0059, callbackIpOut2Set,1);
            btnUhdObject[SETUP_CROP_IP_OUT_2_FULL] = ButtonCtrl(setup_uhd_form_inner, "setup_crop_ip_out_2_full", NPTZ_WORDING.wID_0431, callbackIpOut2Set,2);
            // //marker
            // btnUhdObject[SETUP_CROP_MARKER_OFF] = ButtonCtrl(setup_uhd_form_inner, "setup_crop_marker_off", NPTZ_WORDING.wID_0038, callbackSdiHdmiNdiMarkerSet,2);
            // btnUhdObject[SETUP_CROP_MARKER_ON] = ButtonCtrl(setup_uhd_form_inner, "setup_crop_marker_on", NPTZ_WORDING.wID_0037, callbackSdiHdmiNdiMarkerSet,1);
            // //ip marker
            // btnUhdObject[SETUP_CROP_IP_MARKER_OFF] = ButtonCtrl(setup_uhd_form_inner, "setup_crop_ip_marker_off", NPTZ_WORDING.wID_0038, callbackIPMarkerSet,2);
            // btnUhdObject[SETUP_CROP_IP_MARKER_ON] = ButtonCtrl(setup_uhd_form_inner, "setup_crop_ip_marker_on", NPTZ_WORDING.wID_0037, callbackIPMarkerSet,1);


            //

            line1 = LineCtrl(setup_uhd_form_inner, "horizontal", 370, 20, 880, 'setup_uhd_horizontal_1',"92");
            LineCtrl(setup_uhd_form_inner, "horizontal", 430, 45, 880, 'setup_uhd_horizontal_2', "96");
            LineCtrl(setup_uhd_form_inner, "horizontal", 490, 45, 880, 'setup_uhd_horizontal_3', "92");
            LineCtrl(setup_uhd_form_inner, "horizontal", 550, 45, 880, 'setup_uhd_horizontal_4', "92");
            LineCtrl(setup_uhd_form_inner, "vertical", 415, 35, 180, 'setup_uhd_horizontal_5');
            LineCtrl(setup_uhd_form_inner, "horizontal", 550, 45, 880, 'setup_uhd_horizontal_6', "92");
            LineCtrl(setup_uhd_form_inner, "horizontal", 550, 45, 880, 'setup_uhd_horizontal_7', "92");
            LineCtrl(setup_uhd_form_inner, "horizontal", 550, 45, 880, 'setup_uhd_horizontal_8', "92");
            LineCtrl(setup_uhd_form_inner, "horizontal", 550, 45, 880, 'setup_uhd_horizontal_9', "92");
            $('#' + setup_uhd_form_inner).append($('<div id="setup_uhd_crop_area" class="setup_uhd_crop_area" ></div>'));
            $("#setup_uhd_crop_area").hide();
            txtUhdObject[SETUP_UHD_CROP_X_LABEL] = TextCtrl(crop_adjust_div, 'setup_uhd_crop_x_label', NPTZ_WORDING.wID_0908);
            txtUhdObject[SETUP_UHD_CROP_Y_LABEL] = TextCtrl(crop_adjust_div, 'setup_uhd_crop_y_label', NPTZ_WORDING.wID_0909);
            inputUhdObject[SETUP_UHD_CROP_X_INPUT] = InputCtrl(crop_adjust_div, 'setup_uhd_crop_x_input', '', 'setup_uhd_crop_x_input', '');
            inputUhdObject[SETUP_UHD_CROP_Y_INPUT] = InputCtrl(crop_adjust_div, 'setup_uhd_crop_y_input', '', 'setup_uhd_crop_y_input', '');
            //2019/2/28 add by wpz
            $("#setup_uhd_crop_x_input").attr("readonly","true");
            $("#setup_uhd_crop_y_input").attr("readonly","true");
            $("#setup_uhd_crop_x_input,#setup_uhd_crop_y_input").focus(function(){
                $("#setup_uhd_crop_x_input").removeAttr("readonly");
                $("#setup_uhd_crop_y_input").removeAttr("readonly");
            })
            //2019/1/17 add with wpz

            txtUhdObject[SETUP_UHD_CROP_3G_SDI_OUT] = TextCtrl(setup_uhd_form_inner, 'setup_uhd_crop_3g_sdi_out',NPTZ_WORDING.wID_0460);
            txtUhdObject[SETUP_UHD_CROP_IP_OUT] = TextCtrl(setup_uhd_form_inner, 'setup_uhd_crop_ip_out',NPTZ_WORDING.wID_0461);
            //

            $('#setup_UHPDCrop_Adjust').append($('<div id="setup_crop_ptz_ctrl" class="setup_crop_ptz_ctrl"></div>'));
            const setup_crop_ptz_ctrl = "setup_crop_ptz_ctrl";
            $('#' + setup_crop_ptz_ctrl).append($('<div id="setup_crop_ptz_center_ctrl"></div>'));
            // Pan/Tilt Control UP
            btnUhdPtzObject[SETUP_CROP_UP_BUTTON] = ButtonCtrl(setup_crop_ptz_ctrl, 'setup_crop_up_button', "", callbackUhdCtrlPtz, SETUP_CROP_UP_BUTTON+"1");
            // Pan/Tilt Control DOWN
            btnUhdPtzObject[SETUP_CROP_DOWN_BUTTON] = ButtonCtrl(setup_crop_ptz_ctrl, 'setup_crop_down_button', "", callbackUhdCtrlPtz, SETUP_CROP_DOWN_BUTTON+'2');
            // Pan/Tilt Control LEFT
            btnUhdPtzObject[SETUP_CROP_LEFT_BUTTON] = ButtonCtrl(setup_crop_ptz_ctrl, 'setup_crop_left_button', "", callbackUhdCtrlPtz, SETUP_CROP_LEFT_BUTTON+'3');
            // Pan/Tilt Control RIGHT
            btnUhdPtzObject[SETUP_CROP_RIGHT_BUTTON] = ButtonCtrl(setup_crop_ptz_ctrl, 'setup_crop_right_button', "", callbackUhdCtrlPtz, SETUP_CROP_RIGHT_BUTTON+'4');
            // Pan/Tilt Control 左上
            btnUhdPtzObject[SETUP_CROP_UP_LEFT_BUTTON] = ButtonCtrl(setup_crop_ptz_ctrl, 'setup_crop_up_left_button', "", callbackUhdCtrlPtz, SETUP_CROP_UP_LEFT_BUTTON+'5');
            // Pan/Tilt Control 左下
            btnUhdPtzObject[SETUP_CROP_DOWN_LEFT_BUTTON] = ButtonCtrl(setup_crop_ptz_ctrl, 'setup_crop_down_left_button', "", callbackUhdCtrlPtz, SETUP_CROP_DOWN_LEFT_BUTTON+'6');
            // Pan/Tilt Control 右上
            btnUhdPtzObject[SETUP_CROP_UP_RIGHT_BUTTON] = ButtonCtrl(setup_crop_ptz_ctrl, 'setup_crop_up_right_button', "", callbackUhdCtrlPtz, SETUP_CROP_UP_RIGHT_BUTTON+'7');
            // Pan/Tilt Control 右下
            btnUhdPtzObject[SETUP_CROP_DOWN_RIGHT_BUTTON] = ButtonCtrl(setup_crop_ptz_ctrl, 'setup_crop_down_right_button', "", callbackUhdCtrlPtz, SETUP_CROP_DOWN_RIGHT_BUTTON+'8');

            //uhd crop ui ue100
            // FAST
            btnUhdObject[BTN_SPEED_FAST] = ButtonCtrl("crop_adjust_speed", 'btn_crop_speed_fast', NPTZ_WORDING.wID_0032, callbackSpeedFast,BTN_SPEED_FAST);
            // SLOW  sliderFocus
            btnUhdObject[BTN_SPEED_SLOW] = ButtonCtrl("crop_adjust_speed", 'btn_crop_speed_slow', NPTZ_WORDING.wID_0033, callbackSpeedSlow,BTN_SPEED_SLOW);
            // SPEED
            txtUhdObject[SETUP_UHD_CROP_CROP_SPEED] = TextCtrl("crop_adjust_speed", 'setup_uhd_crop_crop_speed',NPTZ_WORDING.wID_0007);
            // T
            btnUhdObject[BTN_ZOOM_TELE] = ButtonCtrl("crop_adjust_zoom", 'btn_crop_zoom_tele', NPTZ_WORDING.wID_0030, callbackZoomT,BTN_ZOOM_TELE);
            // W
            btnUhdObject[BTN_ZOOM_WIDE] = ButtonCtrl("crop_adjust_zoom", 'btn_crop_zoom_wide', NPTZ_WORDING.wID_0031, callbackZoomW,BTN_ZOOM_WIDE);
            // ZOOM
            txtUhdObject[SETUP_UHD_CROP_ZOOM] = TextCtrl("crop_adjust_zoom", 'setup_uhd_crop_zoom',NPTZ_WORDING.wID_0006);
            // ZOOM value
            txtUhdObject[SETUP_UHD_CROP_ZOOM_VALUE] = TextCtrl("crop_adjust_zoom", 'setup_uhd_crop_zoom_value',NPTZ_WORDING.wID_0167);


            sliderCropSpeed.build('cropSpeed_slider_wrap', 'cropSpeed_slider_handle', speedCtrlCallback, "crop_adjust_speed",99);
            sliderCropSpeed.show()
            sliderCropSpeed.undisable();
            sliderCropZoom.build('cropZoom_slider_wrap', 'cropZoom_slider_handle', zoomCtrlCallback, crop_adjust_div,99);
            sliderCropZoom.show()
            sliderCropZoom.undisable();
            if(Platform.isTouchMode()){
                sliderCropSpeed.changeSliderStyle("cropSpeed_slider_wrap", "cropSpeed_slider_handle","cropSpeed_slider_win_wrap", "cropSpeed_slider_win_handle");
            }

            txtUhdObject[SETUP_UHD_CROP_Y] = TextCtrl(crop_adjust_div, 'setup_uhd_crop_y',NPTZ_WORDING.wID_0054);
            txtUhdObject[SETUP_UHD_CROP_G] = TextCtrl(crop_adjust_div, 'setup_uhd_crop_g',NPTZ_WORDING.wID_0055);
            txtUhdObject[SETUP_UHD_CROP_MA] = TextCtrl(crop_adjust_div, 'setup_uhd_crop_ma',NPTZ_WORDING.wID_0056);
            txtUhdObject[SETUP_UHD_CROP_IP1] = TextCtrl(setup_uhd_form_inner, 'setup_uhd_crop_ip1',NPTZ_WORDING.wID_0507);
            txtUhdObject[SETUP_UHD_CROP_IP2] = TextCtrl(setup_uhd_form_inner, 'setup_uhd_crop_ip2',NPTZ_WORDING.wID_0508);
            txtUhdObject[SETUP_UHD_CROP_MARKER] = TextCtrl(crop_adjust_div, 'setup_uhd_crop_marker',NPTZ_WORDING.wID_0541);
            txtUhdObject[SETUP_UHD_CROP_IP_MARKER] = TextCtrl(crop_adjust_div, 'setup_uhd_crop_ip_marker',NPTZ_WORDING.wID_0510);
            txtUhdObject[SETUP_UHD_CROP_CROP_ZOOM] = TextCtrl(setup_uhd_form_inner, 'setup_uhd_crop_crop_zoom',NPTZ_WORDING.wID_0511);
            //add by yangyang 20220927
            txtUhdObject[SETUP_UHD_CROP_CROP_AF] = TextCtrl(setup_uhd_form_inner, 'setup_uhd_crop_crop_af',NPTZ_WORDING.wID_0486);



            $('#camera_controller_gui').append($('<div id ="setup_crop_uhd_crop_tab_bg"class=" setup_crop_uhd_crop_tab_bg"></div>'));
            // Image adjust button
            btnCROPMode = MenuButtonCtrl('setup_crop_uhd_crop_tab_bg', 'setup_image_uhd_CROP_mode_btn', NPTZ_WORDING.wID_0050, callbackTABControl, 1, MenuButtonType.TABLEFT);
            btnCROPOutputPTZ = MenuButtonCtrl('setup_crop_uhd_crop_tab_bg', 'setup_image_uhd_CROP_Output_PTZ_btn', NPTZ_WORDING.wID_0440, callbackTABControl, 2, MenuButtonType.TABRIGHT);
            btnCROPMode.displayOn();
            callbackTABControl(Button.MOUSE_DOWN, 1);
            changeMode();

            // Sliderの構築
            // todo uhd ui
            // if(cparam_get_UHDCrop() == "2"){
            //     sliderDetectLeft.build('detect_720_left_slider_wrap', 'detect_720_left_slider_handle', 1, detectAreaTopCtrlCallBack);
            //     sliderDetectBottom.build('detect_720_bottom_slider_wrap', 'detect_720_bottom_slider_handle', detectAreaBottomCtrlCallBack);
            // }else{
            //     sliderDetectLeft.build('detect_left_slider_wrap', 'detect_left_slider_handle', 1, detectAreaTopCtrlCallBack);
            //     sliderDetectBottom.build('detect_bottom_slider_wrap', 'detect_bottom_slider_handle', detectAreaBottomCtrlCallBack);
            // }

            sliderDetectLeft.show();
            sliderDetectBottom.show();

            for (var txt in txtUhdObject) {
                txtUhdObject[txt].show();
            }
            for (var btn in btnUhdObject) {
                btnUhdObject[btn].show();
                btnUhdObject[btn].displayOff();
            }
            for (var btn in btnUhdPtzObject) {
                btnUhdPtzObject[btn].show();
                btnUhdPtzObject[btn].displayOff();
            }
            for (var input in inputUhdObject) {
                inputUhdObject[input].displayOff();
                inputUhdObject[input].show();
            }

            //todo uhd ui
            $('#setup_uhd_crop_area').append($('<div id="setup_crop_color_area_div" class="setup_crop_color_area_div"></div>'));
            $('#setup_crop_color_area_div').css({
                top: 0 + 'px',
                left: 0 + 'px',
                height: 108 + 'px',
                width: 192 + 'px'
            });

            initThisPage();

            initImageLive();
            //btnUhdObject[SETUP_CROP_OUTPUT_FULL_BUTTON].hide();

            creatImageDivArea();

            $("#setup_crop_ptz_center_ctrl").mousedown(function(){
                if (radioUhdButtonGroup[SETUP_UHD_CROP_MODE].getSelectedValue() != "0") {
                    controlCrop();
                };

            });

            $("#setup_uhd_crop_x_input,#setup_uhd_crop_y_input").focusin(function(){
                clearInterval(gcropColorArea);
                gcropColorArea = null;
            });

            $("#setup_uhd_crop_x_input,#setup_uhd_crop_y_input").focusout(function(){
                if(gcropColorArea == null){
                    gcropColorArea = setInterval(function(){
                        settingIoaUhd.initAdjustSetButton();
                        settingIoaUhd.initCropColorArea();
                    },500);
                }
            });

            $("#setup_uhd_crop_x_input,#setup_uhd_crop_y_input").keyup(function (e) {
                if(e.keyCode==13 || e.keyCode==9) {
                    if(gcropColorArea == null){
                        gcropColorArea = setInterval(function(){
                            settingIoaUhd.initAdjustSetButton();
                            settingIoaUhd.initCropColorArea();
                        },500);
                    }
                    operateUhdColorArea();
                    $("#setup_uhd_crop_x_input,#setup_uhd_crop_y_input").blur();
                } else {
                    var dataX = $("#setup_uhd_crop_x_input").val();
                    var dataY = $("#setup_uhd_crop_y_input").val();
                    if(dataX % 2 == 1){
                    	dataX = dataX -1;
                    }
                    var regu = "^[0-9]*$";
                    var re = new RegExp(regu);
                    if (!re.test(dataX) || !re.test(dataY) ) {
                       jAlert(MSG_STATUS.mID_0052, NPTZ_WORDING.wID_0039);
                    }
                }
            });

        } else {
            rebuild();
        }
    }

    function initImageLive(){
        objVOIP = cparam_getVideoOverIpInfo();
        let stream = objVOIP['sStream'];

        if(stream == "jpeg" || stream == "h264"){
            stream = 1;
        }else{
            stream = stream.charAt(stream.length-1);
        }
        let captureSize = [];
        captureSize[0] = objVOIP["resol_stream" + stream];
        settingIoaLive.build("crop",objVOIP);
    }

    function creatImageDivArea(){
        if($("#image_g_crop_color_area_div").length > 0){
            return;
        }
        var maxHeight;
        var maxWidth;
        if(radioUhdButtonGroup[SETUP_UHD_CROP_MODE].getSelectedValue() == "2"){
            maxWidth = 2560;
            maxHeight = 1440;
        }else{
            maxWidth = 1920;
            maxHeight = 1080;
        }
    }
    function speedCtrlCallback(percent) {
        percent = percent < 0 ? 0 : percent;
        percent = percent > 99 ? 99 : percent;
        percent = Math.floor(percent/99*2730+1365);
        doZoomSlider(parseInt(percent));
    }
    function zoomCtrlCallback() {
        let value = sliderCropZoom.getValue();
        value = value < 0 ? 0 : value;
        value = value > 99 ? 99 : value;
        value = parseInt(38000/99*value+12000);
        doZoomSlider(value);
    }

    /**
     * speed slider control
     * @param percent
     */
    function doZoomSlider(percent) {
        cparam_set_crop_Zoom_Control(percent);
    }

    function controlCrop(){
        $("#setup_crop_ptz_ctrl").hide();
        $("#crop_control").show();
        thisMouseActiveId = "control_crop";
        ptzCircleCloseFlag = false;
        ptzDownFlag = true;

        controlPtzMoveMouse();
    }

    /**
     * UHD crop設定画面再構築処理
     */
    function rebuild() {
        $("#camera_preset_title").hide();
        $('#setup_preset_form_inner').hide();
        $('#setup_uhd_form_inner').show();
        $("#camera_ptz_d_zoom_label").hide();
        $("#camera_ptz_d_ext_label").hide();
        $("#camera_ptz_touch_label").hide();
        $("#camera_controller_gui_th_btns").hide();
        initImageLive();
        creatImageDivArea();
        changeMode();
        initThisPage();
        $("#setup_uhd_crop_x_input").attr("readonly","true");
        $("#setup_uhd_crop_y_input").attr("readonly","true");
    }

    function changeMode(){
        $("#camera_controller_gui_open_preset").hide();
        $("#camera_controller_gui_open_btn").hide();
        $("#camera_controller_gui_open_btn2").hide();
        $("#camera_ptz_d_zoom_label").hide();
        $("#camera_ptz_touch_label").hide();
        if (Platform.isTouchMode()) {
            if (btnCROPMode && btnCROPOutputPTZ) {
                btnCROPMode.show();
                btnCROPMode.displayOn();
                btnCROPOutputPTZ.show();
                btnCROPOutputPTZ.displayOff();
                //line1.hide();
            }
            $('#setup_crop_uhd_crop_tab_bg').show();
            changePtzElementToWindow();
            changePtzElementToWindow1();
            callbackTABControl(Button.MOUSE_DOWN, 1);
            txtUhdObject[SETUP_UHD_CROP_G].set("Crop Adjust");
            txtUhdObject[SETUP_UHD_CROP_MA].set("Crop Marker");
        } else {
            if (btnCROPMode && btnCROPOutputPTZ) {
                btnCROPMode.hide();
                btnCROPOutputPTZ.hide();
                line1.show();
            }
            $('#setup_crop_uhd_crop_tab_bg').hide();
            $("#camera_controller_gui_ptz_focus").show();
            $("#camera_controller_gui_ptz_zoom").show();
            $("#camera_controller_gui_ptz_main").show();
            $("#setup_uhd_form_inner").show();
            changePtzElementToMain();
            changePtzElementToMain1();
            txtUhdObject[SETUP_UHD_CROP_G].set(NPTZ_WORDING.wID_0055);
            txtUhdObject[SETUP_UHD_CROP_MA].set(NPTZ_WORDING.wID_0056);
        }
        changeCameraControllerToUhd();
        changeRTMPStreamingDisplayStatus();
    }

    function changeRTMPStreamingDisplayStatus(){
        if(Platform.isSetupMode()){
            $(".camera_controller_gui_adjust_bottom_top_line").hide();
            $(".stream_rtmp").hide();
            $(".btn_stream_stop").hide();
            $(".ptz_btn_stream_stop").hide();
            $(".camera_ptz_line_4").hide();
            $(".camera_ptz_line_5").hide();
            $(".btn_cup").hide();
        }else{
            $(".camera_controller_gui_adjust_bottom_top_line").show();
            $(".stream_rtmp").show();
            $(".btn_stream_stop").show();
            $(".ptz_btn_stream_stop").show();
            $(".camera_ptz_line_4").show();
            $(".camera_ptz_line_5").show();
            $(".btn_cup").show();
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

    /**
     * open small window : PTZ
     */
    function changePtzElementToWindow1() {
        //ptz-zoom,focus
        $(".btn_zoom_tele").removeClass("btn_zoom_tele").addClass("btn_ptz_zoom_tele");
        $(".btn_zoom_wide").removeClass("btn_zoom_wide").addClass("btn_ptz_zoom_wide");
        $(".btn_speed_slow").removeClass("btn_speed_slow").addClass("btn_ptz_speed_slow");
        $(".btn_speed_fast").removeClass("btn_speed_fast").addClass("btn_ptz_speed_fast");
        $(".btn_focus_far").removeClass("btn_focus_far").addClass("btn_ptz_focus_far");
        $(".btn_focus_near").removeClass("btn_focus_near").addClass("btn_ptz_focus_near");
        $(".btn_focus_auto").removeClass("btn_focus_auto").addClass("btn_ptz_focus_auto");
        $(".btn_zoom_d_ext").removeClass("btn_zoom_d_ext").addClass("btn_ptz_zoom_d_ext");
        $(".btn_zoom_x1").removeClass("btn_zoom_x1").addClass("btn_ptz_zoom_x1");
        $(".btn_focus_otaf").removeClass("btn_focus_otaf").addClass("btn_ptz_focus_otaf");
        $(".btn_zoom_D_Zoom").removeClass("btn_zoom_D_Zoom").addClass("btn_ptz_zoom_D_Zoom");
        $(".txt_camera_zoom").removeClass("txt_camera_zoom").addClass("txt_adjust_camera_zoom");
        $(".txt_camera_focus").removeClass("txt_camera_focus").addClass("txt_adjust_camera_focus");
    }

    /**
     * close small window : PTZ
     */
    function changePtzElementToMain1() {
        //ptz-zoom,focus
        $(".btn_ptz_zoom_tele").removeClass("btn_ptz_zoom_tele").addClass("btn_zoom_tele");
        $(".btn_ptz_zoom_wide").removeClass("btn_ptz_zoom_wide").addClass("btn_zoom_wide");
        $(".btn_ptz_speed_slow").removeClass("btn_ptz_speed_slow").addClass("btn_speed_slow");
        $(".btn_ptz_speed_fast").removeClass("btn_ptz_speed_fast").addClass("btn_speed_fast");
        $(".btn_ptz_focus_far").removeClass("btn_ptz_focus_far").addClass("btn_focus_far");
        $(".btn_ptz_focus_near").removeClass("btn_ptz_focus_near").addClass("btn_focus_near");
        $(".btn_ptz_focus_auto").removeClass("btn_ptz_focus_auto").addClass("btn_focus_auto");
        $(".btn_ptz_zoom_d_ext").removeClass("btn_ptz_zoom_d_ext").addClass("btn_zoom_d_ext");
        $(".btn_ptz_zoom_x1").removeClass("btn_ptz_zoom_x1").addClass("btn_zoom_x1");
        $(".btn_ptz_focus_otaf").removeClass("btn_ptz_focus_otaf").addClass("btn_focus_otaf");
        $(".btn_ptz_zoom_D_Zoom").removeClass("btn_ptz_zoom_D_Zoom").addClass("btn_zoom_D_Zoom");
        $(".txt_adjust_camera_zoom").removeClass("txt_adjust_camera_zoom").addClass("txt_camera_zoom");
        $(".txt_adjust_camera_focus").removeClass("txt_adjust_camera_focus").addClass("txt_camera_focus");
    }
    var txtObject = [];
    var TXT_CROP_TITLE;
    function changeCameraControllerToUhd() {
        $("#camera_controller_gui").removeClass("camera_controller_gui_to_setup_preset").addClass("camera_controller_gui_to_setup_uhd");
        $("#camera_controller_gui").removeClass("camera_controller_gui_to_setup_preset_ppls");
        $("#camera_controller_gui_ptz_main").removeClass("camera_controller_gui_ptz_main_preset")
            .removeClass("camera_controller_gui_ptz_main_preset_ppls")
            .removeClass("camera_controller_gui_ptz_main_uhd_crop");
        $("#camera_ptz_title").text(NPTZ_WORDING.wID_0440);
        $("#camera_controller_gui_preset_main").hide();
        $("#camera_controller_gui_adjust_main").hide();
        cameraControllerSetting.showButtonByCtrl();
        $(".btn_enlarge_ptz").hide();
        $(".btn_ptz_area_ctrl").hide();

        $("#camera_controller_gui_ptz_zoom").removeClass("camera_controller_gui_ptz_zoom_preset_position").addClass("camera_controller_gui_ptz_zoom_uhd_crop");
        $("#camera_controller_gui_ptz_speed").removeClass("camera_controller_gui_ptz_speed_preset_position").addClass("camera_controller_gui_ptz_speed_uhd_crop");
        $("#camera_controller_gui_ptz_focus").removeClass("camera_controller_gui_ptz_focus_preset_position").addClass("camera_controller_gui_ptz_focus_uhd_crop");

        $(".btn_ptz_zoom_x1").addClass("btn_zoom_x1_uhd_crop");
        $(".btn_ptz_zoom_D_Zoom").addClass("btn_zoom_D_Zoom_uhd_crop");
        $(".btn_ptz_zoom_d_ext").addClass("btn_zoom_d_ext_uhd_crop");
        $(".btn_ptz_zoom_d_ext_20").addClass("btn_zoom_d_ext_20_uhd_crop");

        $('.btn_ptz_focus_auto').addClass("btn_ptz_focus_auto_uhd");





        $("#camera_controller_gui_ptz").removeClass("camera_controller_gui_ptz_preset_position").addClass("camera_controller_gui_ptz_uhd_crop");
        $("#camera_ptz_ctrl2").removeClass("camera_ptz_ctrl2_preset_position").addClass("camera_ptz_ctrl2_uhd_crop");
        $("#camera_ptz_line").removeClass("camera_ptz_line_preset_position").addClass("camera_ptz_line_uhd_crop");
        $("#camera_ptz_line_2").removeClass("camera_ptz_line2_preset_position").addClass("camera_ptz_line2_uhd_crop");
        $("#camera_ptz_line_3").removeClass("camera_ptz_line3_preset_position").addClass("camera_ptz_line3_uhd_crop");
        $("#camera_control_line").removeClass("camera_control_line_preset_position").addClass("camera_control_line_uhd_crop");
        $("#camera_ptz_title").removeClass("camera_ptz_title_preset_position").addClass("camera_ptz_title_uhd_crop");

        $(".btn_zoom_d_ext").removeClass("btn_zoom_d_ext_preset").addClass("btn_zoom_d_ext_uhd_crop");
        $(".btn_zoom_d_ext_20").removeClass("btn_zoom_d_ext_preset_20").addClass("btn_zoom_d_ext_uhd_crop_20");
        $(".btn_ptz_zoom_d_ext").removeClass("btn_zoom_d_ext_preset").addClass("btn_zoom_d_ext_uhd_crop");
        $(".btn_zoom_x1").removeClass("btn_zoom_x1_preset").addClass("btn_zoom_x1_uhd_crop");
        $(".btn_ptz_zoom_x1").removeClass("btn_zoom_x1_preset").addClass("btn_zoom_x1_uhd_crop");
        $(".btn_zoom_D_Zoom").removeClass("btn_zoom_D_Zoom_preset").addClass("btn_zoom_D_Zoom_uhd_crop");
        $(".btn_ptz_zoom_D_Zoom").removeClass("btn_zoom_D_Zoom_preset").addClass("btn_zoom_D_Zoom_uhd_crop");
        $(".btn_touch_af").removeClass("btn_touch_af_preset").addClass("btn_touch_af_uhd_crop").hide();
        $(".btn_a_iris_win").removeClass("btn_touch_af_preset").addClass("btn_touch_af_uhd_crop").hide();
        $(".btn_focus_guide").removeClass("btn_touch_af_preset").addClass("btn_touch_af_uhd_crop").hide();
        $(".btn_focus_otaf").removeClass("btn_focus_otaf_preset").addClass("btn_focus_otaf_uhd_crop");
        $(".btn_ptz_focus_otaf").removeClass("btn_focus_otaf_preset").addClass("btn_focus_otaf_uhd_crop");
        txtObject[TXT_CROP_TITLE] = TextCtrl("base_main_controller", "camera_controller_gui_to_setup_uhd_title", NPTZ_WORDING.wID_0059);
        txtObject[TXT_CROP_TITLE].show();
        $("#base_main_controller").show();
        $("#base_main_controller").addClass("camera_controller_gui_to_setup_uhd_title");
        $("#base_main_controller").text(NPTZ_WORDING.wID_0443);
        changeControlPtzStyleFlag = 2;
    }

    function callbackTABControl(mouse, index){
        if (mouse == Button.MOUSE_DOWN) {
            if (index == 1) {
                $("#camera_controller_gui_ptz_focus").hide();
                $("#camera_controller_gui_ptz_zoom").hide();
                $("#camera_controller_gui_ptz_main").hide();
                $("#setup_uhd_form_inner").show();
                $(".btn_touch_af").hide();
                //$("#camera_ptz_line").css({"left":"350px","top":"130px","height":"240px","width":"1px"})
                $("#div_pan_lens_control_scroll").css("z-index","-1");
            } else {
                $("#camera_controller_gui_ptz_focus").show();
                $("#camera_controller_gui_ptz_zoom").show();
                $("#camera_controller_gui_ptz_main").show();
                $("#setup_uhd_form_inner").hide();
                $(".btn_touch_af").hide();
                $("#window_ptz_ctrl2").css({"left":"210px","top":"90px"});
                $("#div_pan_lens_control_scroll").css("top","-110px");
                $("#div_pan_lens_control_scroll").css("z-index","9");

            }
        }
    }

    function getCropModeStatus(){
        //var uhdCropRadioDate = getUhdCropRadioDate();
        //radioUhdButtonGroup[SETUP_UHD_CROP_MODE].setSelectedValue(uhdCropRadioDate);
        const uhdCropRadioDate = getUhdCropRadioDate();
        const sFormat = cparam_get_format();
        if(sFormat == 19 || sFormat =="1A"){
            radioUhdButtonGroup[SETUP_UHD_CROP_MODE].displayOff();
            radioUhdButtonGroup[SETUP_UHD_CROP_MODE].setSelectedValue(uhdCropRadioDate);
        }else if(sFormat == 17 || sFormat == 18 || sFormat == 21 || sFormat == "1B"  || sFormat == "1F"){
            radioUhdButtonGroup[SETUP_UHD_CROP_MODE].displayOff();
            radioUhdButtonGroup[SETUP_UHD_CROP_MODE].setSelectedValue(uhdCropRadioDate);
            radioUhdButtonGroup[SETUP_UHD_CROP_MODE].aloneDisplayDisabled(2);
        }else{
            radioUhdButtonGroup[SETUP_UHD_CROP_MODE].setSelectedValue("0");
            radioUhdButtonGroup[SETUP_UHD_CROP_MODE].displayDisabled();
        }
        changeStatusByCropMode();

    }

    function initThisPage() {
        initCropOutputButton();
        if(gcropColorArea==null){
            gcropColorArea = setInterval(function(){
                initAdjustSetButton();
                initCropColorArea();
            },500);
        }

    }

    function initCropMarkerButton() {
        changeCropMarkerButtonStyle(cparam_get_cropMarker());
    }

    function changeCropMarkerButtonStyle(result) {
        if (result == "0") {
            btnUhdObject[SETUP_CROP_MARKER_YL_BUTTON].displayOff();
            btnUhdObject[SETUP_CROP_MARKER_G_BUTTON].displayOff();
            btnUhdObject[SETUP_CROP_MARKER_MG_BUTTON].displayOff();
            crop_marker_yl_flag = 0;
            crop_marker_g_flag = 0;
            crop_marker_mg_flag = 0;
        } else if (result == "1") {
            btnUhdObject[SETUP_CROP_MARKER_YL_BUTTON].displayOn();
            btnUhdObject[SETUP_CROP_MARKER_G_BUTTON].displayOff();
            btnUhdObject[SETUP_CROP_MARKER_MG_BUTTON].displayOff();
            crop_marker_yl_flag = 1;
            crop_marker_g_flag = 0;
            crop_marker_mg_flag = 0;
        } else if (result == "2") {
            btnUhdObject[SETUP_CROP_MARKER_YL_BUTTON].displayOff();
            btnUhdObject[SETUP_CROP_MARKER_G_BUTTON].displayOn();
            btnUhdObject[SETUP_CROP_MARKER_MG_BUTTON].displayOff();
            crop_marker_yl_flag = 0;
            crop_marker_g_flag = 1;
            crop_marker_mg_flag = 0;
        } else if (result == "3") {
            btnUhdObject[SETUP_CROP_MARKER_YL_BUTTON].displayOff();
            btnUhdObject[SETUP_CROP_MARKER_G_BUTTON].displayOff();
            btnUhdObject[SETUP_CROP_MARKER_MG_BUTTON].displayOn();
            crop_marker_yl_flag = 0;
            crop_marker_g_flag = 0;
            crop_marker_mg_flag =1;
        } else if (result == "4") {
            btnUhdObject[SETUP_CROP_MARKER_YL_BUTTON].displayOn();
            btnUhdObject[SETUP_CROP_MARKER_G_BUTTON].displayOn();
            btnUhdObject[SETUP_CROP_MARKER_MG_BUTTON].displayOff();
            crop_marker_yl_flag = 1;
            crop_marker_g_flag = 1;
            crop_marker_mg_flag = 0;
        } else if (result == "5") {
            btnUhdObject[SETUP_CROP_MARKER_YL_BUTTON].displayOn();
            btnUhdObject[SETUP_CROP_MARKER_G_BUTTON].displayOff();
            btnUhdObject[SETUP_CROP_MARKER_MG_BUTTON].displayOn();
            crop_marker_yl_flag = 1;
            crop_marker_g_flag = 0;
            crop_marker_mg_flag = 1;
        } else if (result == "6") {
            btnUhdObject[SETUP_CROP_MARKER_YL_BUTTON].displayOff();
            btnUhdObject[SETUP_CROP_MARKER_G_BUTTON].displayOn();
            btnUhdObject[SETUP_CROP_MARKER_MG_BUTTON].displayOn();
            crop_marker_yl_flag = 0;
            crop_marker_g_flag = 1;
            crop_marker_mg_flag = 1;
        } else if (result == "7") {
            btnUhdObject[SETUP_CROP_MARKER_YL_BUTTON].displayOn();
            btnUhdObject[SETUP_CROP_MARKER_G_BUTTON].displayOn();
            btnUhdObject[SETUP_CROP_MARKER_MG_BUTTON].displayOn();
            crop_marker_yl_flag = 1;
            crop_marker_g_flag = 1;
            crop_marker_mg_flag = 1;
        } else {
            btnUhdObject[SETUP_CROP_MARKER_YL_BUTTON].displayOff();
            btnUhdObject[SETUP_CROP_MARKER_G_BUTTON].displayOff();
            btnUhdObject[SETUP_CROP_MARKER_MG_BUTTON].displayOff();
            crop_marker_yl_flag = 0;
            crop_marker_g_flag = 0;
            crop_marker_mg_flag = 0;
        }
    }
    var timerId;

    function initCropOutputButton() {
        var result32 = cparam_get_3GSDIIPOut();
        resultIp = cparam_get_IPOut();
        if (result32 == "1" || resultIp == "1") {
            if(resultIp == "0"){
                btnUhdObject[SETUP_CROP_IP_OUT_CROP].displayOff();
                btnUhdObject[SETUP_CROP_IP_OUT_FULL].displayOn();
                ipOutFlg = 1;

            }else{
                ipOutFlg = 0;
                btnUhdObject[SETUP_CROP_IP_OUT_CROP].displayOn();
                btnUhdObject[SETUP_CROP_IP_OUT_FULL].displayOff();
            }
            if(result32 == "0"){
                btnUhdObject[SETUP_CROP_3G_SDI_OUT_CROP].displayOff();
                btnUhdObject[SETUP_CROP_3G_SDI_OUT_FULL].displayOn();
            }else{
                btnUhdObject[SETUP_CROP_3G_SDI_OUT_CROP].displayOn();
                btnUhdObject[SETUP_CROP_3G_SDI_OUT_FULL].displayOff();
            }
        } else {
            btnUhdObject[SETUP_CROP_IP_OUT_CROP].displayOff();
            btnUhdObject[SETUP_CROP_3G_SDI_OUT_CROP].displayOff();
            btnUhdObject[SETUP_CROP_IP_OUT_FULL].displayOn();
            btnUhdObject[SETUP_CROP_3G_SDI_OUT_FULL].displayOn();
        }
        const result16 = cparam_get_cropOut();
        if (result16 == "1") {
            changeOutputSetButtonStyle(SETUP_CROP_OUTPUT_YL_BUTTON);
        } else if (result16 == "2") {
            changeOutputSetButtonStyle(SETUP_CROP_OUTPUT_G_BUTTON);
        } else{
            changeOutputSetButtonStyle(SETUP_CROP_OUTPUT_MG_BUTTON);
        }
        const cropZoom = cparam_get_CropZoom();
        if(cropZoom == "1"){
            btnUhdObject[SETUP_CROP_ZOOM_CROP].displayOff();
            btnUhdObject[SETUP_CROP_ZOOM_FULL].displayOn();
            let getZoom = cparam_get_Crop_Zoom_Control();
            getZoom = parseInt(getZoom,16);
            txtUhdObject[SETUP_UHD_CROP_ZOOM_VALUE].set(getZoom.toString().substr(0,3)+ '.'+ (('00'+getZoom).slice(-2))+'%');
            sliderCropZoom.undisable();
            btnUhdObject[BTN_ZOOM_TELE].displayOff();
            btnUhdObject[BTN_ZOOM_WIDE].displayOff();
            sliderCropSpeed.undisable();
            btnUhdObject[BTN_SPEED_FAST].displayOff();
            btnUhdObject[BTN_SPEED_SLOW].displayOff();
            // zoom
            if (!($('.cropZoom_slider_handle').hasClass('drag'))) {
                if (!($('.cropZoom_slider_handle').hasClass('disable') && !$("#power")[0].disabled)) {
                    if (getZoom == undefined || getZoom < 12000) {
                        getZoom = 12000;
                    }
                    getZoom = Math.floor((getZoom - 12000) / 38000 * 99);
                    if (getZoom >= 0) {
                        sliderCropZoom.setPosition(getZoom, 99);
                    }
                }
            }
        }else{
            btnUhdObject[SETUP_CROP_ZOOM_CROP].displayOn();
            btnUhdObject[SETUP_CROP_ZOOM_FULL].displayOff();
            sliderCropZoom.disable();
            sliderCropSpeed.disable();
            btnUhdObject[BTN_ZOOM_TELE].displayDisabled();
            btnUhdObject[BTN_ZOOM_WIDE].displayDisabled();
            btnUhdObject[BTN_SPEED_FAST].displayDisabled();
            btnUhdObject[BTN_SPEED_SLOW].displayDisabled();
        }
        //add by yangyang 20220927
        const cropaf = cparam_get_crop_af();
        if(cropaf == "0"){
            btnUhdObject[SETUP_CROP_AF_ON].displayOff();
            btnUhdObject[SETUP_CROP_AF_OFF].displayOn();
        }else{
            btnUhdObject[SETUP_CROP_AF_ON].displayOn();
            btnUhdObject[SETUP_CROP_AF_OFF].displayOff();
        }
        /*--------------------------------------------------*/
        const ndiOut = cparam_get_NDIOut();
        if(ndiOut == "0"){
            btnUhdObject[SETUP_CROP_NDI_OUT_CROP].displayOff();
            btnUhdObject[SETUP_CROP_NDI_OUT_FULL].displayOn();
        }else{
            btnUhdObject[SETUP_CROP_NDI_OUT_CROP].displayOn();
            btnUhdObject[SETUP_CROP_NDI_OUT_FULL].displayOff();
        }
        const ip2 = cparam_get_IP_OUT2();
        if(ip2 == "0"){
            btnUhdObject[SETUP_CROP_IP_OUT_2_CROP].displayOff();
            btnUhdObject[SETUP_CROP_IP_OUT_2_FULL].displayOn();
        }else{
            btnUhdObject[SETUP_CROP_IP_OUT_2_CROP].displayOn();
            btnUhdObject[SETUP_CROP_IP_OUT_2_FULL].displayOff();
        }

    }


    function initAdjustSetButton() {
        if ($("#camera_controller_gui").is(':hidden')|| $("#setup_uhd_form_inner").is(':hidden')) {
            return;
        }
        getCropModeStatus();
        if(radioUhdButtonGroup[SETUP_UHD_CROP_MODE].getSelectedValue() == 0){
            btnUhdObject[SETUP_CROP_ADJUST_YL_BUTTON].displayDisabled();
            btnUhdObject[SETUP_CROP_ADJUST_G_BUTTON].displayDisabled();
            btnUhdObject[SETUP_CROP_ADJUST_MG_BUTTON].displayDisabled();
            return
        }
        var result = cparam_get_cropAdjust();
        if (result == 1) {
            changeAdjustSetButton(SETUP_CROP_ADJUST_YL_BUTTON);
        } else if (result == 2) {
            changeAdjustSetButton(SETUP_CROP_ADJUST_G_BUTTON);
        } else if (result == 3) {
            changeAdjustSetButton(SETUP_CROP_ADJUST_MG_BUTTON);
        }
        type = result + 6;
        //changeCropAreaColor(type);
        initCropMarkerButton();
    }

    function initCropColorArea() {
        if (radioUhdButtonGroup[SETUP_UHD_CROP_MODE].getSelectedValue() == "0" || $("#camera_controller_gui").is(':hidden')|| $("#setup_uhd_form_inner").is(':hidden')) {
            return;
        }

        const cropX = cparam_get_cropHPos();
        const cropY = cparam_get_cropVPos();
        $("#setup_uhd_crop_y_input").val(cropY);
        $("#setup_uhd_crop_x_input").val(cropX);
    }


    function getUhdCropRadioDate() {
        return cparam_get_UHDCrop();
    }

    function callbackChangeCropMode() {
        setCropMode();
        changeStatusByCropMode();
        if(radioUhdButtonGroup[SETUP_UHD_CROP_MODE].getSelectedValue() == "2"){
            $(".detect_left_slider_wrap").remove();
            $(".detect_bottom_slider_wrap").remove();
            $(".detect_720_left_slider_wrap").remove();
            $(".detect_720_bottom_slider_wrap").remove();
            // todo uhd ui
            //sliderDetectLeft.build('detect_720_left_slider_wrap', 'detect_720_left_slider_handle', 1, detectAreaTopCtrlCallBack);
            //sliderDetectBottom.build('detect_720_bottom_slider_wrap', 'detect_720_bottom_slider_handle', detectAreaBottomCtrlCallBack);
        }else if(radioUhdButtonGroup[SETUP_UHD_CROP_MODE].getSelectedValue() == "1"){
            $(".detect_720_left_slider_wrap").remove();
            $(".detect_720_bottom_slider_wrap").remove();
            $(".detect_left_slider_wrap").remove();
            $(".detect_bottom_slider_wrap").remove();
            // todo uhd ui
            // sliderDetectLeft.build('detect_left_slider_wrap', 'detect_left_slider_handle', 1, detectAreaTopCtrlCallBack);
            // sliderDetectBottom.build('detect_bottom_slider_wrap', 'detect_bottom_slider_handle', detectAreaBottomCtrlCallBack);
        }
        if(radioUhdButtonGroup[SETUP_UHD_CROP_MODE].getSelectedValue() != "0" && cparam_get_CropZoom() != 0){
            btnUhdObject[BTN_ZOOM_TELE].displayOff();
            btnUhdObject[BTN_ZOOM_WIDE].displayOff();
            btnUhdObject[BTN_SPEED_FAST].displayOff();
            btnUhdObject[BTN_SPEED_SLOW].displayOff();
            sliderCropZoom.undisable();
            sliderCropSpeed.undisable();
        }
        if(radioUhdButtonGroup[SETUP_UHD_CROP_MODE].getSelectedValue() != "0"){
            btnUhdPtzObject[SETUP_CROP_UP_BUTTON].displayOff();
            btnUhdPtzObject[SETUP_CROP_DOWN_BUTTON].displayOff();
            btnUhdPtzObject[SETUP_CROP_LEFT_BUTTON].displayOff();
            btnUhdPtzObject[SETUP_CROP_RIGHT_BUTTON].displayOff();
            btnUhdPtzObject[SETUP_CROP_UP_LEFT_BUTTON].displayOff();
            btnUhdPtzObject[SETUP_CROP_DOWN_LEFT_BUTTON].displayOff();
            btnUhdPtzObject[SETUP_CROP_UP_RIGHT_BUTTON].displayOff();
            btnUhdPtzObject[SETUP_CROP_DOWN_RIGHT_BUTTON].displayOff();
        }
        sliderDetectLeft.show();
        sliderDetectBottom.show();
    }

    function setCropMode() {
        cparam_set_UHDCrop(radioUhdButtonGroup[SETUP_UHD_CROP_MODE].getSelectedValue());
    }

    function changeStatusByCropMode() {
        if (radioUhdButtonGroup[SETUP_UHD_CROP_MODE].getSelectedValue() == "0") { //off
            clearTimeout(timerId);
            $("#image_yl_crop_color_area_div").hide();
            $("#image_g_crop_color_area_div").hide();
            $("#image_mg_crop_color_area_div").hide();
            const setup_crop_marker_yl_status = btnUhdObject[SETUP_CROP_MARKER_YL_BUTTON].getStatus();
            const setup_crop_marker_g_status = btnUhdObject[SETUP_CROP_MARKER_G_BUTTON].getStatus();
            const setup_crop_marker_mg_status = btnUhdObject[SETUP_CROP_MARKER_MG_BUTTON].getStatus();
            btnUhdObject[SETUP_CROP_MARKER_YL_BUTTON].displayDisabled();
            btnUhdObject[SETUP_CROP_MARKER_G_BUTTON].displayDisabled();
            btnUhdObject[SETUP_CROP_MARKER_MG_BUTTON].displayDisabled();
            if (setup_crop_marker_yl_status == Button.STATUS_ON) {
                btnUhdObject[SETUP_CROP_MARKER_YL_BUTTON].getButtonObject().removeClass('disable').addClass('on_disable');
            }
            if (setup_crop_marker_g_status == Button.STATUS_ON) {
                btnUhdObject[SETUP_CROP_MARKER_G_BUTTON].getButtonObject().removeClass('disable').addClass('on_disable');
            }
            if (setup_crop_marker_mg_status == Button.STATUS_ON) {
                btnUhdObject[SETUP_CROP_MARKER_MG_BUTTON].getButtonObject().removeClass('disable').addClass('on_disable');
            }
            btnUhdObject[SETUP_CROP_OUTPUT_YL_BUTTON].displayDisabled();
            btnUhdObject[SETUP_CROP_OUTPUT_G_BUTTON].displayDisabled();
            btnUhdObject[SETUP_CROP_OUTPUT_MG_BUTTON].displayDisabled();
            btnUhdObject[SETUP_CROP_OUTPUT_FULL_BUTTON].displayDisabled();
            btnUhdObject[SETUP_CROP_ADJUST_YL_BUTTON].displayDisabled();
            btnUhdObject[SETUP_CROP_ADJUST_G_BUTTON].displayDisabled();
            btnUhdObject[SETUP_CROP_ADJUST_MG_BUTTON].displayDisabled();
            inputUhdObject[SETUP_UHD_CROP_X_INPUT].displayDisabled();
            inputUhdObject[SETUP_UHD_CROP_Y_INPUT].displayDisabled();
            btnUhdPtzObject[SETUP_CROP_UP_BUTTON].displayDisabled();
            btnUhdPtzObject[SETUP_CROP_DOWN_BUTTON].displayDisabled();
            btnUhdPtzObject[SETUP_CROP_LEFT_BUTTON].displayDisabled();
            btnUhdPtzObject[SETUP_CROP_RIGHT_BUTTON].displayDisabled();
            btnUhdPtzObject[SETUP_CROP_UP_LEFT_BUTTON].displayDisabled();
            btnUhdPtzObject[SETUP_CROP_DOWN_LEFT_BUTTON].displayDisabled();
            btnUhdPtzObject[SETUP_CROP_UP_RIGHT_BUTTON].displayDisabled();
            btnUhdPtzObject[SETUP_CROP_DOWN_RIGHT_BUTTON].displayDisabled();
            btnUhdObject[SETUP_CROP_3G_SDI_OUT_CROP].displayDisabled();
            btnUhdObject[SETUP_CROP_3G_SDI_OUT_FULL].displayDisabled();
            btnUhdObject[SETUP_CROP_IP_OUT_CROP].displayDisabled();
            btnUhdObject[SETUP_CROP_IP_OUT_FULL].displayDisabled();
            btnUhdObject[SETUP_CROP_ZOOM_CROP].displayDisabled();
            btnUhdObject[SETUP_CROP_ZOOM_FULL].displayDisabled();
            //add by yangayng 20220927
            btnUhdObject[SETUP_CROP_AF_ON].displayDisabled();
            btnUhdObject[SETUP_CROP_AF_OFF].displayDisabled();

            btnUhdObject[SETUP_CROP_NDI_OUT_CROP].displayDisabled();
            btnUhdObject[SETUP_CROP_NDI_OUT_FULL].displayDisabled();
            btnUhdObject[SETUP_CROP_IP_OUT_2_CROP].displayDisabled();
            btnUhdObject[SETUP_CROP_IP_OUT_2_FULL].displayDisabled();
            txtUhdObject[SETUP_UHD_CROP_ZOOM_VALUE].set(NPTZ_WORDING.wID_0167)
            $('#setup_crop_ptz_center_ctrl').attr("disabled",true);
            sliderDetectLeft.disable();
            sliderDetectBottom.disable();
            sliderCropZoom.disable();
            sliderCropSpeed.disable();
            btnUhdObject[BTN_ZOOM_TELE].displayDisabled();
            btnUhdObject[BTN_ZOOM_WIDE].displayDisabled();

            sliderCropSpeed.disable();
            btnUhdObject[BTN_SPEED_FAST].displayDisabled();
            btnUhdObject[BTN_SPEED_SLOW].displayDisabled();
        } else{ //on
            // sliderCropZoom.undisable();
            // sliderCropSpeed.undisable();
            // btnUhdObject[BTN_ZOOM_TELE].displayOff();
            // btnUhdObject[BTN_ZOOM_WIDE].displayOff();
            // btnUhdObject[BTN_SPEED_FAST].displayOff();
            // btnUhdObject[BTN_SPEED_SLOW].displayOff();
            if (btnUhdObject[SETUP_CROP_MARKER_YL_BUTTON].getButtonObject().hasClass('on_disable')) {
                btnUhdObject[SETUP_CROP_MARKER_YL_BUTTON].getButtonObject().removeClass('on_disable');
                btnUhdObject[SETUP_CROP_MARKER_YL_BUTTON].displayOn();
            } else {
                btnUhdObject[SETUP_CROP_MARKER_YL_BUTTON].displayOff();
            }
            if (btnUhdObject[SETUP_CROP_MARKER_G_BUTTON].getButtonObject().hasClass('on_disable')) {
                btnUhdObject[SETUP_CROP_MARKER_G_BUTTON].getButtonObject().removeClass('on_disable');
                btnUhdObject[SETUP_CROP_MARKER_G_BUTTON].displayOn();
            } else {
                btnUhdObject[SETUP_CROP_MARKER_G_BUTTON].displayOff();
            }
            if (btnUhdObject[SETUP_CROP_MARKER_MG_BUTTON].getButtonObject().hasClass('on_disable')) {
                btnUhdObject[SETUP_CROP_MARKER_MG_BUTTON].getButtonObject().removeClass('on_disable');
                btnUhdObject[SETUP_CROP_MARKER_MG_BUTTON].displayOn();
            } else {
                btnUhdObject[SETUP_CROP_MARKER_MG_BUTTON].displayOff();
            }
            btnUhdObject[SETUP_CROP_OUTPUT_YL_BUTTON].displayOff();
            btnUhdObject[SETUP_CROP_OUTPUT_G_BUTTON].displayOff();
            btnUhdObject[SETUP_CROP_OUTPUT_MG_BUTTON].displayOff();
            btnUhdObject[SETUP_CROP_OUTPUT_FULL_BUTTON].displayOff();
            btnUhdObject[SETUP_CROP_ADJUST_YL_BUTTON].displayOff();
            btnUhdObject[SETUP_CROP_ADJUST_G_BUTTON].displayOff();
            btnUhdObject[SETUP_CROP_ADJUST_MG_BUTTON].displayOff();
            inputUhdObject[SETUP_UHD_CROP_X_INPUT].displayOff();
            inputUhdObject[SETUP_UHD_CROP_Y_INPUT].displayOff();
            // btnUhdPtzObject[SETUP_CROP_UP_BUTTON].displayOff();
            // btnUhdPtzObject[SETUP_CROP_DOWN_BUTTON].displayOff();
            // btnUhdPtzObject[SETUP_CROP_LEFT_BUTTON].displayOff();
            // btnUhdPtzObject[SETUP_CROP_RIGHT_BUTTON].displayOff();
            // btnUhdPtzObject[SETUP_CROP_UP_LEFT_BUTTON].displayOff();
            // btnUhdPtzObject[SETUP_CROP_DOWN_LEFT_BUTTON].displayOff();
            // btnUhdPtzObject[SETUP_CROP_UP_RIGHT_BUTTON].displayOff();
            // btnUhdPtzObject[SETUP_CROP_DOWN_RIGHT_BUTTON].displayOff();
            btnUhdObject[SETUP_CROP_3G_SDI_OUT_CROP].displayOff();
            btnUhdObject[SETUP_CROP_3G_SDI_OUT_FULL].displayOff();
            btnUhdObject[SETUP_CROP_IP_OUT_CROP].displayOff();
            btnUhdObject[SETUP_CROP_IP_OUT_FULL].displayOff();

            btnUhdObject[SETUP_CROP_ZOOM_CROP].displayOff();
            btnUhdObject[SETUP_CROP_ZOOM_FULL].displayOff();
            //add by yangyang 20220927
            btnUhdObject[SETUP_CROP_AF_ON].displayOff();
            btnUhdObject[SETUP_CROP_AF_OFF].displayOff();           

            btnUhdObject[SETUP_CROP_NDI_OUT_CROP].displayOff();
            btnUhdObject[SETUP_CROP_NDI_OUT_FULL].displayOff();
            btnUhdObject[SETUP_CROP_IP_OUT_2_CROP].displayOff();
            btnUhdObject[SETUP_CROP_IP_OUT_2_FULL].displayOff();
            $('#setup_crop_ptz_center_ctrl').attr("disabled",false);
            sliderDetectLeft.undisable();
            sliderDetectBottom.undisable();
            initCropMarkerButton();
            initCropOutputButton();
            const sFormat = cparam_get_format();
            if(sFormat == 19 || sFormat =="1A"){
                radioUhdButtonGroup[SETUP_UHD_CROP_MODE].displayOff();
            }else if(sFormat == 17 || sFormat == 18 || sFormat == 21 || sFormat == "1B" || sFormat == "1F"){
                radioUhdButtonGroup[SETUP_UHD_CROP_MODE].aloneDisplayDisabled(2);
            }
            if(gcropColorArea==null){
                gcropColorArea = setInterval(function(){
                    initAdjustSetButton();
                    initCropColorArea();
                },500);
            }
        }
    }

    function callbackUhdCtrlPtz(mouse, btnNo) {
        var control = btnNo;
        btnNo = parseInt(btnNo.toString().substring(0,btnNo.length - 1));
        control = control.charAt(control.length-1);
        if (btnUhdPtzObject[btnNo].getStatus() == Button.STATUS_DISABLED) {
            return;
        }
        if (mouse == Button.MOUSE_DOWN) {
            btnUhdPtzObject[btnNo].displayOn();
            StartUHD(ptcObject[control], event);
        } else if (mouse == Button.MOUSE_UP) {
            btnUhdPtzObject[btnNo].displayOff();
            StopUHD(event);
        } else if (mouse == Button.MOUSE_OVER) {
            btnUhdPtzObject[btnNo].displayOff();
        } else if (mouse == Button.MOUSE_OUT) {
            if (btnUhdPtzObject[btnNo].getStatus() == Button.STATUS_ON) {
                StopUHD(event);
            }
            btnUhdPtzObject[btnNo].displayOff();
        } else {
            // 処理なし
        }
    }

    /**
     * 「FAST」ボタン押下時の画面制御
     * @param {number} mouse マウス・ボタン操作状況
     */
    function callbackSpeedFast(mouse,index) {
        if (mouse == Button.MOUSE_DOWN) {
            btnUhdObject[index].displayOn();
            if (intervalIDSpeed != null) {
                clearInterval(intervalIDSpeed);
            }
            // ボタン押下中は20msecの周期でspeedFastを実行する。
            intervalIDSpeed = setInterval(function () {
                speedFast()
            }, 20);
        } else if ((mouse == Button.MOUSE_UP) || (mouse == Button.MOUSE_OUT)) {
            if (btnUhdObject[index].getStatus() != Button.STATUS_DISABLED) {
                clearInterval(intervalIDSpeed);
                intervalIDSpeed = null;
                btnUhdObject[index].displayOff();
            }
        } else {
            // 処理なし
        }
    }

    /**
     * 「SLOW」ボタン押下時の画面制御
     * @param {number} mouse マウス・ボタン操作状況
     */
    function callbackSpeedSlow(mouse,index) {
        if (mouse == Button.MOUSE_DOWN) {
            btnUhdObject[index].displayOn();
            if (intervalIDSpeed != null) {
                clearInterval(intervalIDSpeed);
            }
            // ボタン押下中は20msecの周期でspeedFastを実行する。
            intervalIDSpeed = setInterval(function () {
                speedSlow()
            }, 20);
        } else if ((mouse == Button.MOUSE_UP) || (mouse == Button.MOUSE_OUT)) {
            if (btnUhdObject[index].getStatus() != Button.STATUS_DISABLED) {
                clearInterval(intervalIDSpeed);
                intervalIDSpeed = null;
                btnUhdObject[index].displayOff();
            }
        } else {
            // 処理なし
        }
    }

    /**
     * 「FAST」ボタン押下時の画面制御
     * @param {number} mouse マウス・ボタン操作状況
     */
    function callbackZoomT(mouse,index) {
        if (mouse == Button.MOUSE_DOWN) {
            //zoomClick = true;
            btnUhdObject[index].displayOn();
            // if (intervalIDSpeed != null) {
            //     clearInterval(intervalIDSpeed);
            // }
            zoomT();
            // ボタン押下中は20msecの周期でspeedFastを実行する。
            // intervalIDSpeed = setInterval(function () {
            //     zoomT();
            // }, 20);
        } else if (mouse == Button.MOUSE_UP) {
            if (btnUhdObject[index].getStatus() != Button.STATUS_DISABLED) {
                //zoomClick = false;
                //clearInterval(intervalIDSpeed);
                intervalIDSpeed = null;
                btnUhdObject[index].displayOff();
                cparam_set_Crop_Zoom_Control(50);
            }
        } else {
            // 処理なし
        }
    }

    /**
     * 「SLOW」ボタン押下時の画面制御
     * @param {number} mouse マウス・ボタン操作状況
     */
    function callbackZoomW(mouse,index) {
        if (mouse == Button.MOUSE_DOWN) {
            btnUhdObject[index].displayOn();
            //zoomClick = true;
            zoomW();
        } else if (mouse == Button.MOUSE_UP) {
            if (btnUhdObject[index].getStatus() != Button.STATUS_DISABLED) {
                //zoomClick = false;
                btnUhdObject[index].displayOff();
                cparam_set_Crop_Zoom_Control(50);
            }
        } else {
            // 処理なし
        }
    }

    /**
     * speed アップ処理 (+1)
     */
    function speedFast() {
        const val = sliderCropSpeed.getValue();
        if (val < 99) {
            sliderCropSpeed.setPosition(val+1,100)
        }
    }
    /**
     * speed ダウン処理 (-1)
     */
    function speedSlow() {
        const val = sliderCropSpeed.getValue();
        if (val > 1) {
            sliderCropSpeed.setPosition(val - 1,100);
        }
    }

    /**
     * speed アップ処理 (+1)
     */
    function zoomT() {
        //const val = sliderCropZoom.getValue();
        const speedVal = getSpeedPosition(sliderCropSpeed.getValue());
        // if (val < 99) {
        //     sliderCropZoom.setPosition(val+1,100)
        // }
        cparam_set_Crop_Zoom_Control(speedVal+50);
    }

    function getSpeedPosition(val) {
        val = val > 98 ? 98 : val;
        val = val < 2 ? 2 : val;

        const t = Math.round(val / 2);
        return t;
    }
    /**
     * speed ダウン処理 (-1)
     */
    function zoomW() {
        // const val = sliderCropZoom.getValue();
        // if (val > 1) {
        //     sliderCropZoom.setPosition(val - 1,100);
        // }
        const speedVal = getSpeedPosition(sliderCropSpeed.getValue());
        cparam_set_Crop_Zoom_Control(50-speedVal);
    }
    /**
     * button control start : direction
     * @param sType
     * @param evt
     * @constructor
     */
    function StartUHD(sType, evt) {
        if (gFlgDisableCamCtrl == true) {
            return;
        }
        for (var i = 0; i < gsPanTiltType.length; i++) {
            if (sType == gsPanTiltType[i]) {
                break;
            }
        }
        if (i < gsPanTiltType.length) {
            if (i > 0) {
                cparam_set_CropHVPositionSpeedContro(gsPanTiltSpeed[i].substring(0,2), gsPanTiltSpeed[i].substring(2,4));
            } else {
                cparam_set_CropHVPositionSpeedContro(50, 50);
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
    function StopUHD(evt) {
        cparam_set_CropHVPositionSpeedContro(50, 50);
    }

    function callbackMarkerSet(mouse, type) {
        if (mouse == Button.MOUSE_DOWN) {
            if (type == SETUP_CROP_MARKER_YL_BUTTON) {
                if (btnUhdObject[SETUP_CROP_MARKER_YL_BUTTON].getStatus() == Button.STATUS_OFF) {
                    btnUhdObject[SETUP_CROP_MARKER_YL_BUTTON].displayOn();
                    crop_marker_yl_flag = 1;
                } else if (btnUhdObject[SETUP_CROP_MARKER_YL_BUTTON].getStatus() == Button.STATUS_ON) {
                    btnUhdObject[SETUP_CROP_MARKER_YL_BUTTON].displayOff();
                    crop_marker_yl_flag = 0;
                }
            } else if (type == SETUP_CROP_MARKER_G_BUTTON) {
                if (btnUhdObject[SETUP_CROP_MARKER_G_BUTTON].getStatus() == Button.STATUS_OFF) {
                    btnUhdObject[SETUP_CROP_MARKER_G_BUTTON].displayOn();
                    crop_marker_g_flag = 1;
                } else if (btnUhdObject[SETUP_CROP_MARKER_G_BUTTON].getStatus() == Button.STATUS_ON) {
                    btnUhdObject[SETUP_CROP_MARKER_G_BUTTON].displayOff();
                    crop_marker_g_flag = 0;
                }
            } else if (type == SETUP_CROP_MARKER_MG_BUTTON) {
                if (btnUhdObject[SETUP_CROP_MARKER_MG_BUTTON].getStatus() == Button.STATUS_OFF) {
                    btnUhdObject[SETUP_CROP_MARKER_MG_BUTTON].displayOn();
                    crop_marker_mg_flag = 1;
                } else if (btnUhdObject[SETUP_CROP_MARKER_MG_BUTTON].getStatus() == Button.STATUS_ON) {
                    btnUhdObject[SETUP_CROP_MARKER_MG_BUTTON].displayOff();
                    crop_marker_mg_flag = 0;
                }
            } else {
                //doNothing
            }
            doCropMarker();
        }
    }

    function doCropMarker() {
        var data = null;
        if (crop_marker_yl_flag == 0 && crop_marker_g_flag == 0 && crop_marker_mg_flag == 0) {
            data = 0;
        } else if (crop_marker_yl_flag == 1 && crop_marker_g_flag == 0 && crop_marker_mg_flag == 0) {
            data = 1;
        } else if (crop_marker_yl_flag == 0 && crop_marker_g_flag == 1 && crop_marker_mg_flag == 0) {
            data = 2;
        } else if (crop_marker_yl_flag == 0 && crop_marker_g_flag == 0 && crop_marker_mg_flag == 1) {
            data = 3;
        } else if (crop_marker_yl_flag == 1 && crop_marker_g_flag == 1 && crop_marker_mg_flag == 0) {
            data = 4;
        } else if (crop_marker_yl_flag == 1 && crop_marker_g_flag == 0 && crop_marker_mg_flag == 1) {
            data = 5;
        } else if (crop_marker_yl_flag == 0 && crop_marker_g_flag == 1 && crop_marker_mg_flag == 1) {
            data = 6;
        } else if (crop_marker_yl_flag == 1 && crop_marker_g_flag == 1 && crop_marker_mg_flag == 1) {
            data = 7;
        } else {
            return;
        }
        cparam_set_cropMarker(data);
    }

    function callbackOutputSet(mouse, type) {
        if (mouse == Button.MOUSE_DOWN) {
            changeOutputSetButtonStyle(type);
            doOutputSet(type);
        }
    }

    function changeOutputSetButtonStyle(type) {
        btnUhdObject[SETUP_CROP_OUTPUT_YL_BUTTON].displayOff();
        btnUhdObject[SETUP_CROP_OUTPUT_G_BUTTON].displayOff();
        btnUhdObject[SETUP_CROP_OUTPUT_MG_BUTTON].displayOff();
        btnUhdObject[SETUP_CROP_OUTPUT_FULL_BUTTON].displayOff();
        if (type == SETUP_CROP_OUTPUT_YL_BUTTON) {
            btnUhdObject[SETUP_CROP_OUTPUT_YL_BUTTON].displayOn();
            $("#setup_crop_output_color").removeClass();
            $("#setup_crop_output_color").addClass("setup_crop_bgColor_y")
        } else if (type == SETUP_CROP_OUTPUT_G_BUTTON) {
            btnUhdObject[SETUP_CROP_OUTPUT_G_BUTTON].displayOn();
            $("#setup_crop_output_color").removeClass();
            $("#setup_crop_output_color").addClass("setup_crop_bgColor_g")
        } else if (type == SETUP_CROP_OUTPUT_MG_BUTTON) {
            btnUhdObject[SETUP_CROP_OUTPUT_MG_BUTTON].displayOn();
            $("#setup_crop_output_color").removeClass();
            $("#setup_crop_output_color").addClass("setup_crop_bgColor_mg")
        } else if (type == SETUP_CROP_OUTPUT_FULL_BUTTON) {
            btnUhdObject[SETUP_CROP_OUTPUT_FULL_BUTTON].displayOn();
            $("#setup_crop_output_color").removeClass();
            $("#setup_crop_output_color").addClass("setup_crop_bgColor_full")
        } else {
            //doNothing
        }
    }

    function doOutputSet(type) {
        if (type == SETUP_CROP_OUTPUT_YL_BUTTON) {
            cparam_set_cropOut(1);
        } else if (type == SETUP_CROP_OUTPUT_G_BUTTON) {
            cparam_set_cropOut(2);
        } else if (type == SETUP_CROP_OUTPUT_MG_BUTTON) {
            cparam_set_cropOut(3);
        } else if (type == SETUP_CROP_OUTPUT_FULL_BUTTON) {
        } else {
        }
    }

    function callbackAdjustSet(mouse, type) {
        if (mouse == Button.MOUSE_DOWN) {
            changeAdjustSetButton(type);
            doAdjustSet(type);
            //changeCropAreaColor();
        }
    }

    function callback3GOutSet(mouse, type) {
        if (mouse == Button.MOUSE_DOWN) {
            if(type ==1 ){
                btnUhdObject[SETUP_CROP_3G_SDI_OUT_CROP].displayOn();
                btnUhdObject[SETUP_CROP_3G_SDI_OUT_FULL].displayOff();
                cparam_set_3GSDIIPOut(1);
            }else{
                btnUhdObject[SETUP_CROP_3G_SDI_OUT_CROP].displayOff();
                btnUhdObject[SETUP_CROP_3G_SDI_OUT_FULL].displayOn();
                cparam_set_3GSDIIPOut(0);
            }
            initCropOutputButton();
        }
    }
    function callbackIPOutSet(mouse, type) {
        if (mouse == Button.MOUSE_DOWN) {
            $("#image_yl_crop_color_area_div").hide();
            $("#image_g_crop_color_area_div").hide();
            $("#image_mg_crop_color_area_div").hide();
            if(type ==1 ){
                btnUhdObject[SETUP_CROP_IP_OUT_CROP].displayOn();
                btnUhdObject[SETUP_CROP_IP_OUT_FULL].displayOff();
                cparam_set_IPOut(1);
            }else{
                btnUhdObject[SETUP_CROP_IP_OUT_CROP].displayOff();
                btnUhdObject[SETUP_CROP_IP_OUT_FULL].displayOn();
                cparam_set_IPOut(0);
            }
            initCropOutputButton();
        }
    }

    function callbackCropAfSet(mouse, type) {
        if (mouse == Button.MOUSE_DOWN) {
            if(type ==1 ){
                btnUhdObject[SETUP_CROP_AF_ON].displayOn();
                btnUhdObject[SETUP_CROP_AF_OFF].displayOff();
                cparam_set_crop_af(1);
            }else{
                btnUhdObject[SETUP_CROP_AF_ON].displayOff();
                btnUhdObject[SETUP_CROP_AF_OFF].displayOn();
                cparam_set_crop_af(0);
            }
        }
    }

    function callbackCropZoomSet(mouse, type) {
        if (mouse == Button.MOUSE_DOWN) {
            if(type ==1 ){
                btnUhdObject[SETUP_CROP_ZOOM_CROP].displayOn();
                btnUhdObject[SETUP_CROP_ZOOM_FULL].displayOff();
                cparam_set_CropZoom(0);
                txtUhdObject[SETUP_UHD_CROP_ZOOM_VALUE].set(NPTZ_WORDING.wID_0167)
            }else{
                btnUhdObject[SETUP_CROP_ZOOM_CROP].displayOff();
                btnUhdObject[SETUP_CROP_ZOOM_FULL].displayOn();
                btnUhdObject[BTN_ZOOM_TELE].displayOff();
                btnUhdObject[BTN_ZOOM_WIDE].displayOff();
                btnUhdObject[BTN_SPEED_FAST].displayOff();
                btnUhdObject[BTN_SPEED_SLOW].displayOff();
                sliderCropZoom.undisable();
                sliderCropSpeed.undisable();
                cparam_set_CropZoom(1);
            }
        }
    }
    function callbackNDIOutSet(mouse, type) {
        if (mouse == Button.MOUSE_DOWN) {
            if(type ==1 ){
                btnUhdObject[SETUP_CROP_NDI_OUT_CROP].displayOn();
                btnUhdObject[SETUP_CROP_NDI_OUT_FULL].displayOff();
                cparam_set_NDIOut(1);
            }else{
                btnUhdObject[SETUP_CROP_NDI_OUT_CROP].displayOff();
                btnUhdObject[SETUP_CROP_NDI_OUT_FULL].displayOn();
                cparam_set_NDIOut(0);
            }
        }
    }
    function callbackIpOut2Set(mouse, type) {
        if (mouse == Button.MOUSE_DOWN) {
            if(type ==1 ){
                btnUhdObject[SETUP_CROP_IP_OUT_2_CROP].displayOn();
                btnUhdObject[SETUP_CROP_IP_OUT_2_FULL].displayOff();
                cparam_set_IP_OUT2(1);
            }else{
                btnUhdObject[SETUP_CROP_IP_OUT_2_CROP].displayOff();
                btnUhdObject[SETUP_CROP_IP_OUT_2_FULL].displayOn();
                cparam_set_IP_OUT2(0);
            }
        }
    }

    function callbackSdiHdmiNdiMarkerSet(mouse, type) {
        if (mouse == Button.MOUSE_DOWN) {
            if(type == 0 ){
                btnUhdObject[SETUP_CROP_MARKER_OFF].displayOn();
                btnUhdObject[SETUP_CROP_MARKER_ON].displayOff();
                cparam_set_Marker(1);
            }else{
                btnUhdObject[SETUP_CROP_MARKER_OFF].displayOff();
                btnUhdObject[SETUP_CROP_MARKER_ON].displayOn();
                cparam_set_Marker(0);
            }
        }
    }

    function callbackIPMarkerSet(mouse, type) {
        if (mouse == Button.MOUSE_DOWN) {
            if(type == 0 ){
                btnUhdObject[SETUP_CROP_IP_MARKER_OFF].displayOn();
                btnUhdObject[SETUP_CROP_IP_MARKER_ON].displayOff();
                cparam_set_IP_Marker(1);
            }else{
                btnUhdObject[SETUP_CROP_IP_MARKER_OFF].displayOff();
                btnUhdObject[SETUP_CROP_IP_MARKER_ON].displayOn();
                cparam_set_IP_Marker(0);
            }
        }
    }
    function changeCropAreaColor(type){
        if (type == SETUP_CROP_ADJUST_YL_BUTTON) {
            $("#setup_crop_color_area_div").css("border","1px solid yellow");

        } else if (type == SETUP_CROP_ADJUST_G_BUTTON) {

            $("#setup_crop_color_area_div").css("border","1px solid green");
        } else if (type == SETUP_CROP_ADJUST_MG_BUTTON) {
            $("#setup_crop_color_area_div").css("border","1px solid rgb(213, 12, 124)");

        } else {
            //doNothing
        }
    }

    function changeAdjustSetButton(type) {
        btnUhdObject[SETUP_CROP_ADJUST_YL_BUTTON].displayOff();
        btnUhdObject[SETUP_CROP_ADJUST_G_BUTTON].displayOff();
        btnUhdObject[SETUP_CROP_ADJUST_MG_BUTTON].displayOff();
        if (type == SETUP_CROP_ADJUST_YL_BUTTON) {
            btnUhdObject[SETUP_CROP_ADJUST_YL_BUTTON].displayOn();
            crop_adjust_color_flag = 1;
            $("#setup_crop_adjust_color").removeClass();
            $("#setup_crop_adjust_color").addClass("setup_crop_bgColor_y");
        } else if (type == SETUP_CROP_ADJUST_G_BUTTON) {
            btnUhdObject[SETUP_CROP_ADJUST_G_BUTTON].displayOn();
            $("#setup_crop_adjust_color").removeClass();
            $("#setup_crop_adjust_color").addClass("setup_crop_bgColor_g");
            crop_adjust_color_flag = 2;
        } else if (type == SETUP_CROP_ADJUST_MG_BUTTON) {
            btnUhdObject[SETUP_CROP_ADJUST_MG_BUTTON].displayOn();
            crop_adjust_color_flag = 3;
            $("#setup_crop_adjust_color").removeClass();
            $("#setup_crop_adjust_color").addClass("setup_crop_bgColor_mg")
        } else {
            //doNothing
        }
    }

    function doAdjustSet(type) {
        let data = null;
        if (type == SETUP_CROP_ADJUST_YL_BUTTON) {
            data = 1;
        } else if (type == SETUP_CROP_ADJUST_G_BUTTON) {
            data = 2;
        } else if (type == SETUP_CROP_ADJUST_MG_BUTTON) {
            data = 3;
        } else {
            return;
        }
        cparam_set_cropAdjust(data);
    }

    /**
     * 自動検出エリア上部設定コールバック処理
     * @param {number} percent　設定倍率
     */
    function detectAreaTopCtrlCallBack(percent) {

    }

    /**
     * 自動検出エリア下部設定コールバック処理
     * @param {number} percent　設定倍率
     */
    function detectAreaBottomCtrlCallBack(percent) {

    }

    function createColorDiv(_width, _height) {
        var setTop;
        var setLeft;
        var height,width,maxHeight,maxWidth,coefficient,num;
        if(radioUhdButtonGroup[SETUP_UHD_CROP_MODE].getSelectedValue() == "2"){
            height = 72;
            width = 128
            maxHeight = 1440;
            maxWidth = 2560;
            coefficient = maxWidth/maxHeight;
            num = 3
        }else{
            height = 108;
            width = 192
            maxHeight = 1080;
            maxWidth = 1920;
            coefficient = 1;
            num = 2;
        }

        if(_height !== ''){
            setTop =  parseInt(maxHeight * _height / 10000);
            currentVerticalValue = setTop;
        }else{
            setTop = currentVerticalValue;
        }
        if(_width !== ''){
            setLeft =  parseInt(maxWidth * _width / 10000);
            currentHorizontalValue = setLeft;
        }else{
            setLeft = currentHorizontalValue;
        }

        $('#setup_crop_color_area_div').css({
            top: setTop / 10 + 'px',
            left: setLeft / 10 + 'px',
            height: height + 'px',
            width: width + 'px'
        });

        $("#setup_uhd_crop_y_input").val(parseInt(setTop));
        $("#setup_uhd_crop_x_input").val(parseInt(setLeft));

        if( btnUhdObject[SETUP_CROP_IP_OUT_CROP].getStatus() == Button.STATUS_ON){
            return;
        }else{
            // add by wpz
            var isProportion = $('#setup_live_form_liveview').width()/$('#setup_crop_color_area_div').width();
            var isWidth = $('#setup_live_form_liveview').width()/num;
            var isHeight = $('#setup_live_form_liveview').height()/num;
            if(type == 7){
                $('#image_yl_crop_color_area_div').css({
                    top: setTop / 10 * isProportion/num + 'px',
                    left: setLeft / 10 * isProportion/num + 'px',
                    height: isHeight + 'px',
                    width: isWidth + 'px'
                });
            }else if(type == 8){
                $('#image_g_crop_color_area_div').css({
                    top: setTop / 10 * isProportion/num + 'px',
                    left: setLeft / 10 * isProportion/num + 'px',
                    height: isHeight + 'px',
                    width: isWidth + 'px'
                });
            }else if(type == 9){
                $('#image_mg_crop_color_area_div').css({
                    top: setTop / 10 * isProportion/num + 'px',
                    left: setLeft / 10 * isProportion/num + 'px',
                    height: isHeight + 'px',
                    width: isWidth + 'px'
                });
            }
        }
    }

    function operateUhdColorArea() {
        var dataX = $("#setup_uhd_crop_x_input").val();
        var dataY = $("#setup_uhd_crop_y_input").val();

        cparam_set_cropHPos(dataX);
        cparam_set_cropVPos(dataY);
        // if(dataX % 2 == 1){
        // 	dataX = dataX -1;
        // }
        // if (crop_adjust_color_flag == 1) {
        //     cparam_set_cropHPosYL(dataX);
        //     cparam_set_cropVPosYL(dataY);
        // } else if (crop_adjust_color_flag == 2) {
        //     cparam_set_cropHPosG(dataX);
        //     cparam_set_cropVPosG(dataY);
        // } else if (crop_adjust_color_flag == 3) {
        //     cparam_set_cropHPosMG(dataX);
        //     cparam_set_cropVPosMG(dataY);
        // } else {
        //     return;
        // }
    }

    return {
        build: build,
        createColorDiv: createColorDiv,
        operateUhdColorArea: operateUhdColorArea,
        controlCrop:controlCrop,
        changeMode:changeMode,
        initAdjustSetButton:initAdjustSetButton,
        initCropColorArea:initCropColorArea,
        getCropPostion:function(){
            cropPosition[3] = crop_adjust_color_flag;
            return cropPosition;
        },
        getSliderCropSpeed:function(){
            return sliderCropSpeed;
        },
        getSliderCropZoom:function(){
            return sliderCropZoom;
        }
    };

}

/**
 * スライダ制御クラス(自動検出領域指定用)
 * @class スライダ制御クラス(自動検出領域指定用)
 * @return {function} build 構築処理
 * @return {function} redraw 再描画処理
 * @return {function} show 表示処理
 * @return {function} hide 非表示処理
 * @return {function} disable 無効化処理
 * @return {function} undisable 有効化処理
 * @return {number} getValue スライダのレベルの取得
 * @return {number} getStatus スライダ状態の取得
 * @return {function} setPosition スライダの再描画処理
 * @return {function} setValue スライダレベルの現在再描画
 * @return {function} redrawSliderLevelColor スライダ待機中処理(現状、未使用)
 * @constructor
 */
function SliderHorizontalEnable() {
    /**
     * スライダサイズ
     * @type number
     */
    var SIZE;
    /**
     * スライダポジション
     * @type number
     */
    var position;
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
     * マスク
     * @type string
     */
    var SLIDER_MASK_KEY;
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
     * つまみ位置WIDTH
     * @type number
     */
    var HALF_HANDLE_WIDTH;
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

    /**
     * スライダ構築処理
     * @param {string} sliderBaseKey スライダ設定キー
     * @param {string} sliderHandleKey スライダつまみ設定キー
     * @param {number} rev レベル反転表示フラグ
     * @param {function} sliderCallback コールバック関数
     */
    function build(sliderBaseKey, sliderHandleKey, sliderCallback) {
        // スライダ初期位置格納
        var position;
            // CSSと紐付けられた引数をセット
            SLIDER_BASE_KEY = sliderBaseKey;
            SLIDER_HANDLE_KEY = sliderHandleKey;
            SLIDER_MASK_KEY = SLIDER_BASE_KEY + "_mask";
            SLIDER_LEVEL_KEY = SLIDER_BASE_KEY + "_level";
            SLIDER_NOW_LEVEL_KEY = SLIDER_BASE_KEY + "_now_level";

            // スライダのボタン要素作成
            var button = $('<div class="' + SLIDER_BASE_KEY + '"> </div>');
            $('#setup_uhd_form_inner').append(button);
            button.append('<div class="' + SLIDER_MASK_KEY + '"> </div>');
            button.append('<div class="' + SLIDER_LEVEL_KEY + '"> </div>');
            button.append('<div class="' + SLIDER_NOW_LEVEL_KEY + '"> </div>');
            button.append('<div class="' + SLIDER_HANDLE_KEY + '"> </div>');

            // CSSから情報取得(倍率計算処理に使用するパラメータ)
            SLIDER_BASE_HEIGHT = parseInt($('.' + SLIDER_LEVEL_KEY).css('height'));
            SLIDER_BASE_WIDTH = parseInt($('.' + SLIDER_LEVEL_KEY).css('width'));
            SLIDER_HANDLE_HEIGHT = parseInt($('.' + SLIDER_HANDLE_KEY).css('height'));
            SLIDER_HANDLE_WIDTH = parseInt($('.' + SLIDER_HANDLE_KEY).css('width'));
            SIZE = SLIDER_BASE_WIDTH - SLIDER_HANDLE_WIDTH / 2;
            HALF_HANDLE_WIDTH = SLIDER_HANDLE_WIDTH / 2;

            $('.' + SLIDER_LEVEL_KEY).hide();
            $('.' + SLIDER_BASE_KEY).hide();

        // jQueryでドラッグ可能なオブジェクトを指定
        $('.' + SLIDER_HANDLE_KEY).draggable(
            {
                // 水平方向のみドラッグ可能
                axis: "x",
                //containment: 'parent',

                // ドラッグ開始時、終了時、ドラッグ時の処理を規定
                start: function (e, ui) {
                    $('.' + SLIDER_HANDLE_KEY).removeClass('hover');
                    $('.' + SLIDER_HANDLE_KEY).addClass('drag');
                    draggingFlag = true;
                    clearInterval(gcropColorArea);
                    gcropColorArea = null;
                },
                stop: function (e, ui) {
                    if(gcropColorArea == null){
                        gcropColorArea = setInterval(function(){
                            settingIoaUhd.initAdjustSetButton();
                            settingIoaUhd.initCropColorArea();
                        },500);
                    }
                    draggingFlag = false;
                    $('.' + SLIDER_HANDLE_KEY).removeClass('drag');

                    // ドラッグ位置(％)を計算し、コールバックを呼出
                    position = parseInt((ui.position.left - HALF_HANDLE_WIDTH)  * 10000 / SIZE);

                    if(position < 0){
                        position = 0;
                    }
                    if(position > 10000) {
                        position = 10000;
                    }
                    sliderCallback(position);
                    redrawSliderLevel(position);
                    settingIoaUhd.operateUhdColorArea();
                },
                drag: function (e, ui) {
                    var changeLeft = ui.position.left - ui.originalPosition.left;
                    var newLeft = ui.originalPosition.left + changeLeft / currentZoomValue; // adjust new top by our zoomScale
                    ui.position.left = newLeft;

                    if(ui.position.left < 0){
                        ui.position.left = 0;
                    }

                    if(ui.position.left > SLIDER_BASE_WIDTH){
                        ui.position.left = SLIDER_BASE_WIDTH;
                    }

                    position = parseInt((ui.position.left - HALF_HANDLE_WIDTH) * 10000 / SIZE);

                    if(position < 0){
                        position = 0;
                    }

                    if(position <= 10000){
                        redrawSliderLevel(position);
                        settingIoaUhd.createColorDiv(position, "");
                    }else{
                        redrawSliderLevel(10000);
                        settingIoaUhd.createColorDiv(10000, "");
                        e.preventDefault();
                        $(".detect_bottom_slider_handle").trigger('mouseup');
                    }
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
        $('.' + SLIDER_MASK_KEY).click(function (event) {
            if (event.which == Button.CLICK_LEFT) {
                if (buttonStatus != Button.STATUS_DISABLED) {
                    position = parseInt((event.offsetX - HALF_HANDLE_WIDTH) * 10000 / SIZE);
                    if(position < 0){
                        position = 0;
                    }
                    if(position > 10000) {
                        position = 10000;
                    }
                    sliderCallback(position);
                    redrawSlider(position);
                    settingIoaUhd.createColorDiv(position, "");
                    settingIoaUhd.operateUhdColorArea();
                }
            }
        });

        // マウスクリック解除時の処理を規定
        $('.' + SLIDER_NOW_LEVEL_KEY).click(function (event) {
            if (event.which == Button.CLICK_LEFT) {
                if (buttonStatus != Button.STATUS_DISABLED) {
                    event.stopPropagation();
                    position = parseInt((event.offsetX - HALF_HANDLE_WIDTH) * 10000 / SIZE);
                    if(position < 0){
                        position = 0;
                    }
                    if(position > 10000) {
                        position = 10000;
                    }
                    sliderCallback(position);
                    redrawSlider(position);
                    settingIoaUhd.createColorDiv(position, "");
                    settingIoaUhd.operateUhdColorArea();
                }
            }
        });
        // 初期値を設定
        redrawSlider(0);
    }

    /**
     * スライダの再描画処理(ユーザ操作以外を契機に実行される処理)
     * @param {number} percent スライダ位置(％)
     */
    function redrawSlider(percent) {
        position = percent;
        var per = powerMath.division(percent * SIZE , 10000);
        if(per > 0 && per < 1)
        {
            per = 1;
        }

        var x = parseInt(per);
        // ボタンの可動範囲を考慮してCSSのピクセル値を決定
        if(x == 0){
            $('.' + SLIDER_HANDLE_KEY).css({
                left: x + 'px'
            });
        }else{
            $('.' + SLIDER_HANDLE_KEY).css({
                left: x + HALF_HANDLE_WIDTH + 'px'
            });
        }
        redrawSliderLevel(percent);
    }

    /**
     * スライダレベルの再描画(ユーザ操作)
     * @param {number} percent 設定倍率
     */
    function redrawSliderLevel(percent) {
        var per = powerMath.division(percent * SIZE , 10000);
        if(per > 0 && per < 1)
        {
            per = 1;
        }

        var x = parseInt(per);
        if(x == 0){
            $('.' + SLIDER_NOW_LEVEL_KEY).css({
                width: x + 'px'
            });          
        }else{
            $('.' + SLIDER_NOW_LEVEL_KEY).css({
                width: x + HALF_HANDLE_WIDTH + 'px'
            });
        }
    }

    /**
     * スライダレベルの現在再描画
     * @param {number} percent 設定倍率
     */
    function redrawSliderNowLevel(percent) {
        var x = parseInt(percent * SLIDER_BASE_WIDTH / 100);
        $('.' + SLIDER_NOW_LEVEL_KEY).css({
            left: x + 'px',
            width: SLIDER_BASE_WIDTH - x + 'px'
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

            buttonStatus = Button.STATUS_DISABLED;
            $('.' + SLIDER_HANDLE_KEY).addClass('disable');
            $('.' + SLIDER_HANDLE_KEY).draggable({cancel: '.' + SLIDER_HANDLE_KEY});
        },

        hide: function () {
            $('.' + SLIDER_BASE_KEY).hide();
            $('.' + SLIDER_LEVEL_KEY).hide();
        },
        disable: function () {
            buttonStatus = Button.STATUS_DISABLED;
            $('.' + SLIDER_HANDLE_KEY).addClass('disable');

            $('.' + SLIDER_HANDLE_KEY).draggable({cancel: '.' + SLIDER_HANDLE_KEY});
        },
        undisable: function () {
            buttonStatus = Button.STATUS_OFF;
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
        redrawSliderLevelColor: redrawSliderLevelColor
    };
}

/**
 * スライダ制御クラス(自動検出領域指定用)
 * @class スライダ制御クラス(自動検出領域指定用)
 * @return {function} build 構築処理
 * @return {function} redraw 再描画処理
 * @return {function} show 表示処理
 * @return {function} hide 非表示処理
 * @return {function} disable 無効化処理
 * @return {function} undisable 有効化処理
 * @return {number} getValue スライダのレベルの取得
 * @return {number} getStatus スライダ状態の取得
 * @return {function} setPosition スライダの再描画処理
 * @return {function} setValue スライダレベルの現在再描画
 * @return {function} redrawSliderLevelColor スライダ待機中処理(現状、未使用)
 * @constructor
 */
function SliderVerticalEnable() {
    /**
     * スライダサイズ
     * @type number
     */
    var SIZE;

    /**
     * スライダポジション
     * @type number
     */
    var position;

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
    var SLIDER_MASK_KEY;
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
     * つまみ位置WIDTH
     * @type number
     */
    var HALF_HANDLE_HEIGHT;
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

    /**
     * スライダ構築処理
     * @param {string} sliderBaseKey スライダ設定キー
     * @param {string} sliderHandleKey スライダつまみ設定キー
     * @param {number} rev レベル反転表示フラグ
     * @param {function} sliderCallback コールバック関数
     */
    function build(sliderBaseKey, sliderHandleKey, rev, sliderCallback) {
        // スライダ初期位置格納
        var position;
            // CSSと紐付けられた引数をセット
            SLIDER_BASE_KEY = sliderBaseKey;
            SLIDER_HANDLE_KEY = sliderHandleKey;
            SLIDER_MASK_KEY = SLIDER_BASE_KEY + "_mask";
            SLIDER_LEVEL_KEY = SLIDER_BASE_KEY + "_level";
            SLIDER_NOW_LEVEL_KEY = SLIDER_BASE_KEY + "_now_level";

            // スライダのボタン要素作成
            var button = $('<div class="' + SLIDER_BASE_KEY + '"> </div>');
            $('#setup_uhd_form_inner').append(button);
            button.append('<div class="' + SLIDER_MASK_KEY + '"> </div>');
            button.append('<div class="' + SLIDER_LEVEL_KEY + '"> </div>');
            button.append('<div class="' + SLIDER_NOW_LEVEL_KEY + '"> </div>');
            button.append('<div class="' + SLIDER_HANDLE_KEY + '"> </div>');

            // CSSから情報取得(倍率計算処理に使用するパラメータ)
            SLIDER_BASE_HEIGHT = parseInt($('.' + SLIDER_BASE_KEY).css('height'),10);
            SLIDER_BASE_WIDTH = parseInt($('.' + SLIDER_BASE_KEY).css('width'),10);
            SLIDER_HANDLE_HEIGHT = parseInt($('.' + SLIDER_HANDLE_KEY).css('height'),10);
            SLIDER_HANDLE_WIDTH = parseInt($('.' + SLIDER_HANDLE_KEY).css('width'),10);
            SIZE = SLIDER_BASE_HEIGHT - SLIDER_HANDLE_HEIGHT;

            HALF_HANDLE_HEIGHT = SLIDER_HANDLE_HEIGHT / 2;

            $('.' + SLIDER_LEVEL_KEY).hide();
            $('.' + SLIDER_BASE_KEY).hide();

        // jQueryでドラッグ可能なオブジェクトを指定
        $('.' + SLIDER_HANDLE_KEY).draggable(
            {
                // 垂直方向のみドラッグ可能
                axis: "y",
                // containment: 'parent',

                // ドラッグ開始時、終了時、ドラッグ時の処理を規定
                start: function (e, ui) {
                    $('.' + SLIDER_HANDLE_KEY).removeClass('hover');
                    $('.' + SLIDER_HANDLE_KEY).addClass('drag');
                    draggingFlag = true;
                    clearInterval(gcropColorArea);
                    gcropColorArea = null;
                },
                stop: function (e, ui) {
                    if(gcropColorArea == null){
                        gcropColorArea = setInterval(function(){
                            settingIoaUhd.initAdjustSetButton();
                            settingIoaUhd.initCropColorArea();
                        },500);
                    }
                    draggingFlag = false;
                    $('.' + SLIDER_HANDLE_KEY).removeClass('drag');

                    // ドラッグ位置(％)を計算し、コールバックを呼出
                    position = parseInt((ui.position.top - HALF_HANDLE_HEIGHT) * 10000 / SIZE);

                    if(position < 0){
                        position = 0;
                    }
                    if(position > 10000) {
                        position = 10000;
                    }
                    sliderCallback(position);
                    redrawSliderLevel(position);
                    settingIoaUhd.operateUhdColorArea();
                },
                drag: function (e, ui) {
                    var changeTop = ui.position.top - ui.originalPosition.top;
                    var newTop = ui.originalPosition.top + changeTop / currentZoomValue; // adjust new top by our zoomScale
                    ui.position.top = newTop;

                    if(ui.position.top < 0){
                        ui.position.top = 0;
                    }

                    if(ui.position.top > SLIDER_BASE_HEIGHT - HALF_HANDLE_HEIGHT){
                        ui.position.top = SLIDER_BASE_HEIGHT - HALF_HANDLE_HEIGHT;
                    }

                    position = parseInt((ui.position.top - HALF_HANDLE_HEIGHT) * 10000 / SIZE);

                    if(position < 0){
                        position = 0;
                    }

                    if(position <= 10000){
                        redrawSliderLevel(position);
                        settingIoaUhd.createColorDiv("", position);
                    }else {
                        redrawSliderLevel(10000);
                        settingIoaUhd.createColorDiv("", 10000);
                        e.preventDefault();
                        $(".detect_left_slider_handle").trigger('mouseup');
                    }

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
        $('.' + SLIDER_MASK_KEY).click(function (event) {
            if (event.which == Button.CLICK_LEFT) {
                if (buttonStatus != Button.STATUS_DISABLED) {
                    position = parseInt(event.offsetY * 10000 / SIZE);
                    if(position < 0){
                        position = 0;
                    }
                    if(position > 10000) {
                        position = 10000;
                    }
                    sliderCallback(position);
                    redrawSlider(position);
                    settingIoaUhd.createColorDiv("", position);
                    settingIoaUhd.operateUhdColorArea();
                }
            }
        });

        // マウスクリック解除時の処理を規定
        $('.' + SLIDER_LEVEL_KEY).click(function (event) {
            if (event.which == Button.CLICK_LEFT) {
                if (buttonStatus != Button.STATUS_DISABLED) {
                    event.stopPropagation();
                    position = parseInt(event.offsetY * 10000 / SIZE);
                    if(position < 0){
                        position = 0;
                    }
                    if(position > 10000) {
                        position = 10000;
                    }
                    sliderCallback(position);
                    redrawSlider(position);
                    settingIoaUhd.createColorDiv("", position);
                    settingIoaUhd.operateUhdColorArea();
                }
            }
        });
        // 初期値を設定
        redrawSlider(0);
    }

    /**
     * スライダの再描画処理(ユーザ操作以外を契機に実行される処理)
     * @param {number} percent スライダ位置(％)
     */
    function redrawSlider(percent) {
        position = percent;
        var per = powerMath.division(percent * SIZE , 10000);
        if(per > 0 && per < 1)
        {
            per = 1;
        }

        var y = parseInt(per);

        // ボタンの可動範囲を考慮してCSSのピクセル値を決定
        if (y == 0) {
            $('.' + SLIDER_HANDLE_KEY).css({
                left: '-16px',
                top: y +  'px'
            });
        }else{
            $('.' + SLIDER_HANDLE_KEY).css({
                left: '-16px',
                top: y + HALF_HANDLE_HEIGHT +  'px'
            });
        }
        redrawSliderLevel(percent);
    }

    /**
     * スライダレベルの再描画(ユーザ操作)
     * @param {number} percent 設定倍率
     */
    function redrawSliderLevel(percent) {
        var y;

        var per = powerMath.division(percent * SIZE , 10000);
        if(per > 0 && per < 1)
        {
            per = 1;
        }

        y = parseInt(per);

        if (y == 0) {
            $('.' + SLIDER_NOW_LEVEL_KEY).css({
                height: y + 'px'
            });
        } else {
            $('.' + SLIDER_NOW_LEVEL_KEY).css({
                height: y + HALF_HANDLE_HEIGHT + 'px'
            });
        }
    }

    /**
     * スライダレベルの現在再描画
     * @param {number} percent 設定倍率
     */
    function redrawSliderNowLevel(percent) {
        var y = parseInt(percent * SLIDER_BASE_HEIGHT / 10000);
        $('.' + SLIDER_NOW_LEVEL_KEY).css({
            // top: y + 'px',
            height: y + HALF_HANDLE_HEIGHT + 'px'
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

            buttonStatus = Button.STATUS_DISABLED;
            $('.' + SLIDER_HANDLE_KEY).addClass('disable');
            $('.' + SLIDER_HANDLE_KEY).draggable({cancel: '.' + SLIDER_HANDLE_KEY});
        },
        hide: function () {
            $('.' + SLIDER_BASE_KEY).hide();
            $('.' + SLIDER_LEVEL_KEY).hide();
        },
        disable: function () {
            buttonStatus = Button.STATUS_DISABLED;
            $('.' + SLIDER_HANDLE_KEY).addClass('disable');

            $('.' + SLIDER_HANDLE_KEY).draggable({cancel: '.' + SLIDER_HANDLE_KEY});
        },
        undisable: function () {
            buttonStatus = Button.STATUS_OFF;
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
        redrawSliderLevelColor: redrawSliderLevelColor
    };
}