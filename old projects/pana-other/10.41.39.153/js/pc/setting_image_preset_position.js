/**
 * @fileOverview Setup画面:UHD crop制御に関わる画面クラス
 *
 * @author Panasonic Corporation
 */

var setupIoaPresetPosition = setupIoaPresetPosition();

/**
 * setup画面:Preset position制御に関わる画面クラス
 * @class Settings画面:UHD crop制御に関わる画面クラス
 * @return {function} build 構築処理
 * @return {function} rebuild 再構築処理
 * @constructor
 */
function setupIoaPresetPosition() {
    /**
     * 構築フラグ
     * @type boolean
     */
    let buildFlag = false;

    // init
    let requestTimer;
    let lastrequest;
    /**
     * labelオブジェクト
     * @type txtPresetObject[]
     */
    let txtPresetObject = [];
    /**
     * label定義 : Speed With Zoom POS.
     * @type number
     */
    // const SETUP_PRESET_ZOOM_POS_LABEL = 0;
    /**
     * label定義 : Focus ADJ With PTZ.
     * @type number
     */
    // const SETUP_PRESET_FOCUS_ADJ_LABEL = 1;
    /**
     * label定義 : Preset speed unit
     * @type number
     */
    const SETUP_PRESET_SPEED_UNIT_LABEL = 2;
    /**
     * label定義 : Tilt Up
     * @type number
     */
    const SETUP_PRESET_LIMIT_TOP_LABEL = 3;
    /**
     * label定義 : Tilt Down
     * @type number
     */
    const SETUP_PRESET_LIMIT_DOWN_LABEL = 4;
    /**
     * label定義 : Pan Left
     * @type number
     */
    const SETUP_PRESET_LIMIT_LEFT_LABEL = 5;
    /**
     * label定義 : Pan Right
     * @type number
     */
    const SETUP_PRESET_LIMIT_RIGHT_LABEL = 6;
    /**
     * label定義 : Tilt Up : Release/Set
     * @type number
     */
    const SETUP_PRESET_LIMIT_LABEL_1 = 7;
    /**
     * label定義 : Tilt Down : Release/Set
     * @type number
     */
    const SETUP_PRESET_LIMIT_LABEL_2 = 8;
    /**
     * label定義 : Pan Left : Release/Set
     * @type number
     */
    const SETUP_PRESET_LIMIT_LABEL_3 = 9;
    /**
     * label定義 : Pan Right : Release/Set
     * @type number
     */
    const SETUP_PRESET_LIMIT_LABEL_4 = 10;
    /**
     * label定義 : Preset speed table
     * @type number
     */
    const SETUP_PRESET_SPEED_TABLE_LABEL = 11;
    /**
     * label定義 : Preset speed
     * @type number
     */
    const SETUP_PRESET_SPEED_LABEL = 12;
    /**
     * label定義 : Preset scope
     * @type number
     */
    const SETUP_PRESET_SCOPE_LABEL = 13;
    /**
     * label定義 : Preset digital extender
     * @type number
     */
    const SETUP_PRESET_DIGITAL_EXTENDER_LABEL = 14;
    /**
     * label定義 : Preset crop
     * @type number
     */
    const SETUP_PRESET_CROP_LABEL = 15;
    /**
     * label定義 : Preset thumbnail update
     * @type number
     */
    const SETUP_PRESET_THUMBNAIL_UPDATE_LABEL = 16;
    /**
     * label定義 : Preset name
     * @type number
     */
    const SETUP_PRESET_NAME_LABEL = 17;
    /**
     * label定義 : Preset zoom mode
     * @type number
     */
    const SETUP_PRESET_ZOOM_MODE_LABEL = 18;
    /**
     * label定義 : Freeze during preset
     * @type number
     */
    const SETUP_PRESET_FREEZE_DURING_LABEL = 19;
    /**
     * label定義 : Freeze during preset
     * @type number
     */
    const SETUP_PRESET_IMAGE_SAVE = 20;
    /**
     * label定義 : Freeze during preset
     * @type number
     */
    const SETUP_TOUCH_PRESET_IMAGE_SAVE = 21;
    /**
     * label定義 : Preset zoom mode
     * @type number
     */
    const SETUP_PRESET_IRIS_LABEL = 22;
    /**
     * label定義 : Preset zoom mode
     * @type number
     */
    const SETUP_PRESET_ACCELERATION = 23;
    /**
     * label定義 : Preset zoom mode
     * @type number
     */
    const SETUP_PRESET_RISE_S_CURVE = 24;
    /**
     * label定義 : Preset zoom mode
     * @type number
     */
    const SETUP_PRESET_FALL_S_CURVE = 25;
    /**
     * label定義 : Preset zoom mode
     * @type number
     */
    const SETUP_PRESET_RISE_ACCELERATION = 26;
    /**
     * label定義 : Preset zoom mode
     * @type number
     */
    const SETUP_PRESET_FALL_ACCELERATION = 27;
    /**
     * label定義 : Preset zoom mode
     * @type number
     */
    const SETUP_PRESET_RISE_RAMP_TIME_RATE = 28;
    /**
     * label定義 : Preset zoom mode
     * @type number
     */
    const SETUP_PRESET_FALL_RAMP_TIME_RATE = 29;
    /**
     * label定義 : shutter
     * @type number
     */
    const SETUP_PRESET_SHUTTER_LABEL = 30;
    /**
     * label定義 : Preset PTZ Sync Mode
     * @type number
     */
    const SETUP_PRESET_PTZ_SYNC_MODE_LABEL = 31;
    /**
     * radio group
     * @type radioPresetButtonGroup[]
     */
    let radioPresetButtonGroup = [];
    /**
     * radio定義 : Speed With Zoom POS.
     */
    // const SETUP_PRESET_ZOOM_POS = 0;
    /**
     * radio定義 : Focus ADJ With PTZ.
     */
    // const SETUP_PRESET_FOCUS_ADJ = 1;
    /**
     * radio定義 : Preset speed unit
     */
    const SETUP_PRESET_SPEED_UNIT = 2;
    /**
     * radio定義 : Preset speed table
     */
    const SETUP_PRESET_SPEED_TABLE = 3;
    /**
     * radio定義 : Preset speed
     */
    const SETUP_PRESET_SCOPE = 4;
    /**
     * radio定義 : Preset digital extender
     */
    const SETUP_PRESET_DIGITAL_EXTENDER = 5;
    /**
     * radio定義 : Preset crop
     */
    const SETUP_PRESET_CROP = 6;
    /**
     * radio定義 : Preset thumbnail update
     */
    const SETUP_PRESET_THUMBNAIL_UPDATE = 7;
    /**
     * radio定義 : Preset name
     */
    const SETUP_PRESET_NAME = 8;
    /**
     * radio定義 : Preset zoom mode
     */
    const SETUP_PRESET_ZOOM_MODE = 9;
    /**
     * radio定義 : Freeze during preset
     */
    const SETUP_PRESET_FREEZE_DURING = 10;
    /**
     * radio定義 : Speed With Zoom POS.
     */
    // const SETUP_PRESET_ZOOM_POS_TOUCH = 11;
    /**
     * radio定義 : Focus ADJ With PTZ.
     */
    // const SETUP_PRESET_FOCUS_ADJ_TOUCH = 12;
    /**
     * radio定義 : Preset zoom mode
     */
    const SETUP_PRESET_IRIS = 13;
    /**
     * radio定義 : Preset zoom mode
     */
    const SETUP_PRESET_PRESET_ACCELERATION = 14;
    /**
     * radio定義 : Preset shutter
     */
    const SETUP_PRESET_PRESET_SHUTTER= 15;

     /**
     * radio定義 : PTZ Sync Mode
     */
    const SETUP_PRESET_PTZ_SYNC_MODE = 16;
    /**
     * button[]
     * @type btnPresetObject[]
     */
    let btnPresetObject = [];
    /**
     * button : limit top
     */
    const SETUP_PRESET_LIMIT_TOP_BUTTON = 0;
    /**
     * button : limit bottom
     */
    const SETUP_PRESET_LIMIT_BOTTOM_BUTTON = 1;
    /**
     * button : limit left
     */
    const SETUP_PRESET_LIMIT_LEFT_BUTTON = 2;
    /**
     * button : limit right
     */
    const SETUP_PRESET_LIMIT_RIGHT_BUTTON = 3;

    let presetSpeedSlider;

    let riseCurveSlider;

    let fallCurveSlider;

    let riseAccelerationSlider;

    let fallAccelerationSlider;

    let riseRampSlider;

    let fallRampSlider;

    let unit;

    let txtOutterPresetTitle ;

    let txtInnerIPMainTitle;

    let txtInnerIimitTitle;
    //#6174 【Web画面】[仕様確認]JPEG Image Save STILL001～005にSaveしても、静止画が表示されない
    let selectImageSaveObject;
    // let imageLoadBtn;
    // let imageDelBtn;
    let imageSaveBtn;
    let txtPresetTitle;
    /**
     * UHD crop設定画面構築処理
     */
    function build() {
        if (!buildFlag) {
            buildFlag = true;
            $('#setup_uhd_form_inner').hide();
            $("#camera_ptz_d_zoom_label").hide();
            $("#camera_ptz_d_ext_label").hide();
            $("#camera_ptz_touch_label").hide();
            $("#camera_controller_gui_th_btns").hide();
            txtOutterPresetTitle = TextCtrl('base', 'setup_preset_form_outter_preset_title', NPTZ_WORDING.wID_0364);
            txtInnerIPMainTitle = TextCtrl('setup_preset_form_inner', 'setup_preset_form_inner_preset_title', NPTZ_WORDING.wID_0327);
            txtOutterPresetTitle.show();
            txtInnerIPMainTitle.show();
            // limit area
            txtInnerIimitTitle = TextCtrl('setup_preset_form_inner_limit', 'setup_preset_form_inner_limit_title', NPTZ_WORDING.wID_0365);
            txtInnerIimitTitle.show();
            txtPresetTitle= TextCtrl("camera_controller_gui_preset_main", 'setup_preset_title_label', NPTZ_WORDING.wID_0004);
            txtPresetTitle.show();
            const setup_preset_form_inner_limit = "setup_preset_form_inner_limit";
            btnPresetObject[SETUP_PRESET_LIMIT_TOP_BUTTON] = ButtonCtrl(setup_preset_form_inner_limit, "setup_preset_limit_top_button", "", callbackLimitCtrl, SETUP_PRESET_LIMIT_TOP_BUTTON);
            btnPresetObject[SETUP_PRESET_LIMIT_BOTTOM_BUTTON] = ButtonCtrl(setup_preset_form_inner_limit, "setup_preset_limit_bottom_button", "", callbackLimitCtrl, SETUP_PRESET_LIMIT_BOTTOM_BUTTON);
            btnPresetObject[SETUP_PRESET_LIMIT_LEFT_BUTTON] = ButtonCtrl(setup_preset_form_inner_limit, "setup_preset_limit_left_button", "", callbackLimitCtrl, SETUP_PRESET_LIMIT_LEFT_BUTTON);
            btnPresetObject[SETUP_PRESET_LIMIT_RIGHT_BUTTON] = ButtonCtrl(setup_preset_form_inner_limit, "setup_preset_limit_right_button", "", callbackLimitCtrl, SETUP_PRESET_LIMIT_RIGHT_BUTTON);
            txtPresetObject[SETUP_PRESET_LIMIT_TOP_LABEL] = TextCtrl(setup_preset_form_inner_limit, 'setup_preset_limit_top_label', NPTZ_WORDING.wID_0366);
            txtPresetObject[SETUP_PRESET_LIMIT_DOWN_LABEL] = TextCtrl(setup_preset_form_inner_limit, 'setup_preset_limit_down_label', NPTZ_WORDING.wID_0367);
            txtPresetObject[SETUP_PRESET_LIMIT_LEFT_LABEL] = TextCtrl(setup_preset_form_inner_limit, 'setup_preset_limit_left_label', NPTZ_WORDING.wID_0368);
            txtPresetObject[SETUP_PRESET_LIMIT_RIGHT_LABEL] = TextCtrl(setup_preset_form_inner_limit, 'setup_preset_limit_right_label', NPTZ_WORDING.wID_0369);
            txtPresetObject[SETUP_PRESET_LIMIT_LABEL_1] = TextCtrl(setup_preset_form_inner_limit, 'setup_preset_limit_label_1', NPTZ_WORDING.wID_0370);
            txtPresetObject[SETUP_PRESET_LIMIT_LABEL_2] = TextCtrl(setup_preset_form_inner_limit, 'setup_preset_limit_label_2', NPTZ_WORDING.wID_0370);
            txtPresetObject[SETUP_PRESET_LIMIT_LABEL_3] = TextCtrl(setup_preset_form_inner_limit, 'setup_preset_limit_label_3', NPTZ_WORDING.wID_0370);
            txtPresetObject[SETUP_PRESET_LIMIT_LABEL_4] = TextCtrl(setup_preset_form_inner_limit, 'setup_preset_limit_label_4', NPTZ_WORDING.wID_0370);
            LineCtrl("setup_preset_form_inner_limit_title", "vertical", 2, 15, 22);
            LineCtrl("setup_preset_form_inner_limit", "vertical", 40, 32, 420);

            // bottom area
            setupPositionAddLine();
          

            const setup_preset_setting = "setup_preset_setting_part1";
            // txtPresetObject[SETUP_PRESET_ZOOM_POS_LABEL] = TextCtrl(setup_preset_setting, 'setup_preset_zoom_pos_label', NPTZ_WORDING.wID_0230);
            // txtPresetObject[SETUP_PRESET_FOCUS_ADJ_LABEL] = TextCtrl(setup_preset_setting, 'setup_preset_focus_adj_label', NPTZ_WORDING.wID_0231);
            txtPresetObject[SETUP_PRESET_PTZ_SYNC_MODE_LABEL] = TextCtrl(setup_preset_setting, 'setup_preset_ptz_sync_mode_label', NPTZ_WORDING.wID_0928);
            txtPresetObject[SETUP_PRESET_SPEED_UNIT_LABEL] = TextCtrl(setup_preset_setting, 'setup_preset_speed_unit_label', NPTZ_WORDING.wID_0371);
            txtPresetObject[SETUP_PRESET_SPEED_TABLE_LABEL] = TextCtrl(setup_preset_setting, 'setup_preset_speed_table_label', NPTZ_WORDING.wID_0372);
            txtPresetObject[SETUP_PRESET_SPEED_LABEL] = TextCtrl(setup_preset_setting, 'setup_preset_speed_label', NPTZ_WORDING.wID_0373);


            const part_div = "setup_preset_setting_part";
            txtPresetObject[SETUP_PRESET_SCOPE_LABEL] = TextCtrl(part_div, 'setup_preset_scope_label', NPTZ_WORDING.wID_0374);
            txtPresetObject[SETUP_PRESET_DIGITAL_EXTENDER_LABEL] = TextCtrl(part_div, 'setup_preset_digital_extender_label', NPTZ_WORDING.wID_0375);
            txtPresetObject[SETUP_PRESET_CROP_LABEL] = TextCtrl(part_div, 'setup_preset_crop_label', NPTZ_WORDING.wID_0376);
            txtPresetObject[SETUP_PRESET_THUMBNAIL_UPDATE_LABEL] = TextCtrl(part_div, 'setup_preset_thumbnail_update_label', NPTZ_WORDING.wID_0377);
            txtPresetObject[SETUP_PRESET_NAME_LABEL] = TextCtrl(part_div, 'setup_preset_name_label', NPTZ_WORDING.wID_0378);
            txtPresetObject[SETUP_PRESET_ZOOM_MODE_LABEL] = TextCtrl(part_div, 'setup_preset_zoom_mode_label', NPTZ_WORDING.wID_0379);
            txtPresetObject[SETUP_PRESET_FREEZE_DURING_LABEL] = TextCtrl(part_div, 'setup_preset_freeze_during_label', NPTZ_WORDING.wID_0380);
            //#6174 【C107】【202204VUP】【ST】【Web画面】[仕様確認]JPEG Image Save STILL001～005にSaveしても、静止画が表示されない
            txtPresetObject[SETUP_PRESET_IMAGE_SAVE] = TextCtrl("preset_list", 'setup_preset_image_save', NPTZ_WORDING.wID_0452);
            //2019/12/04 add
            txtPresetObject[SETUP_PRESET_ACCELERATION] = TextCtrl(setup_preset_setting, 'setup_preset_acceleration', NPTZ_WORDING.wID_0494);
            txtPresetObject[SETUP_PRESET_RISE_S_CURVE] = TextCtrl(setup_preset_setting, 'setup_preset_rise_s_curve', NPTZ_WORDING.wID_0495);
            txtPresetObject[SETUP_PRESET_FALL_S_CURVE] = TextCtrl(setup_preset_setting, 'setup_preset_fall_s_curve', NPTZ_WORDING.wID_0496);
            txtPresetObject[SETUP_PRESET_RISE_ACCELERATION] = TextCtrl(setup_preset_setting, 'setup_preset_rise_acceleration', NPTZ_WORDING.wID_0497);
            txtPresetObject[SETUP_PRESET_FALL_ACCELERATION] = TextCtrl(setup_preset_setting, 'setup_preset_fall_acceleration', NPTZ_WORDING.wID_0498);
            txtPresetObject[SETUP_PRESET_RISE_RAMP_TIME_RATE] = TextCtrl(setup_preset_setting, 'setup_preset_rise_ramp_time_rate', NPTZ_WORDING.wID_0499);
            txtPresetObject[SETUP_PRESET_FALL_RAMP_TIME_RATE] = TextCtrl(setup_preset_setting, 'setup_preset_fall_ramp_time_rate', NPTZ_WORDING.wID_0500);

            //preset lris
            txtPresetObject[SETUP_PRESET_IRIS_LABEL] = TextCtrl(part_div, 'setup_preset_iris_label', NPTZ_WORDING.wID_0480);
            txtPresetObject[SETUP_PRESET_SHUTTER_LABEL] = TextCtrl(part_div, 'setup_preset_shutter_label', NPTZ_WORDING.wID_0586);
            //#6174 【Web画面】[仕様確認]JPEG Image Save STILL001～005にSaveしても、静止画が表示されない
            selectImageSaveObject = SelectCtrl("preset_list", "select_image_save", "select_image_save", "setup_image_save_select",callbackSelectImage);
            imageSaveBtn = ButtonCtrl("preset_list", 'btn_preset_image_save', NPTZ_WORDING.wID_0453, callbackImageSaveBtn);

            //HE145静止画像記録対応  UE150 SVN ver 1808
            //#6174 【Web画面】[仕様確認]JPEG Image Save STILL001～005にSaveしても、静止画が表示されない
            imageLoadBtn = ButtonCtrl("preset_list", 'btn_preset_image_load', NPTZ_WORDING.wID_0575, callbackImageLoadBtn);
            imageDelBtn = ButtonCtrl("preset_list", 'btn_preset_image_del', NPTZ_WORDING.wID_0576, callbackImageDelBtn);
            imageLoadBtn.show();
            imageLoadBtn.displayDisabled();
            imageDelBtn.show();
            imageDelBtn.displayDisabled();

            let select_image_save_value = [];
            let select_image_save_text = [];
            for (let iIndex = 0; iIndex <= 99; iIndex++) {
                select_image_save_value[iIndex] = iIndex;
                if(iIndex<9){
                    select_image_save_text[iIndex] = "PICT00"+(iIndex+1);
                }else if(iIndex == 99){
                    select_image_save_text[iIndex] = "PICT"+(iIndex+1);
                }else{
                    select_image_save_text[iIndex] = "PICT0"+(iIndex+1);
                }
            
            }
            for (var iIndex = 1; iIndex <= 5; iIndex++) {
                select_image_save_value[99+iIndex] = 99+iIndex;
                select_image_save_text[99+iIndex] = "STIL00"+iIndex;
            }
            //#6174 【Web画面】[仕様確認]JPEG Image Save STILL001～005にSaveしても、静止画が表示されない
            selectImageSaveObject.appendOptions(select_image_save_value, select_image_save_text);
            selectImageSaveObject.show();
            imageSaveBtn.show();
            selectImageSaveObject.displayOff();
            imageSaveBtn.displayOff();


            // radioPresetButtonGroup[SETUP_PRESET_ZOOM_POS] = RadioButtonGroupCtrl(setup_preset_setting, "setup_preset_zoom_pos", RADIO_GROUP.rID_0001, '0', callbackChangeRadioCommon, SETUP_PRESET_ZOOM_POS);
            // radioPresetButtonGroup[SETUP_PRESET_FOCUS_ADJ] = RadioButtonGroupCtrl(setup_preset_setting, "setup_preset_focus_adj", RADIO_GROUP.rID_0001, '0', callbackChangeRadioCommon, SETUP_PRESET_FOCUS_ADJ);
            radioPresetButtonGroup[SETUP_PRESET_PTZ_SYNC_MODE] = RadioButtonGroupCtrl(setup_preset_setting, "setup_preset_ptz_sync_mode", RADIO_GROUP.rID_0001, '0', callbackChangeRadioCommon, SETUP_PRESET_PTZ_SYNC_MODE);
            LineCtrl(setup_preset_setting, "horizontal", 70, 35, 140,"setup_preset_ptz_sync_mode",96);
            radioPresetButtonGroup[SETUP_PRESET_SPEED_UNIT] = RadioButtonGroupCtrl(setup_preset_setting, "setup_preset_speed_unit", RADIO_GROUP.rID_0004, '0', callbackChangeRadioCommon, SETUP_PRESET_SPEED_UNIT);
            radioPresetButtonGroup[SETUP_PRESET_SPEED_TABLE] = RadioButtonGroupCtrl(setup_preset_setting, "setup_preset_speed_table", RADIO_GROUP.rID_0005, '0', callbackChangeRadioCommon, SETUP_PRESET_SPEED_TABLE);
            radioPresetButtonGroup[SETUP_PRESET_SCOPE] = RadioButtonGroupCtrl(part_div, "setup_preset_scope", RADIO_GROUP.rID_0006, '0', callbackChangeRadioCommon, SETUP_PRESET_SCOPE);
            radioPresetButtonGroup[SETUP_PRESET_DIGITAL_EXTENDER] = RadioButtonGroupCtrl(part_div, "setup_preset_digital_extender", RADIO_GROUP.rID_0001, '0', callbackChangeRadioCommon, SETUP_PRESET_DIGITAL_EXTENDER);
            radioPresetButtonGroup[SETUP_PRESET_CROP] = RadioButtonGroupCtrl(part_div, "setup_preset_crop", RADIO_GROUP.rID_0001, '0', callbackChangeRadioCommon, SETUP_PRESET_CROP);
            radioPresetButtonGroup[SETUP_PRESET_THUMBNAIL_UPDATE] = RadioButtonGroupCtrl(part_div, "setup_preset_thumbnail_update", RADIO_GROUP.rID_0001, '0', callbackChangeRadioCommon, SETUP_PRESET_THUMBNAIL_UPDATE);
            radioPresetButtonGroup[SETUP_PRESET_NAME] = RadioButtonGroupCtrl(part_div, "setup_preset_name", RADIO_GROUP.rID_0007, '0', callbackChangeRadioCommon, SETUP_PRESET_NAME);
            radioPresetButtonGroup[SETUP_PRESET_ZOOM_MODE] = RadioButtonGroupCtrl(part_div, "setup_preset_zoom_mode", RADIO_GROUP.rID_0008, '0', callbackChangeRadioCommon, SETUP_PRESET_ZOOM_MODE);
            radioPresetButtonGroup[SETUP_PRESET_FREEZE_DURING] = RadioButtonGroupCtrl(part_div, "setup_preset_freeze_during", RADIO_GROUP.rID_0001, '0', callbackChangeRadioCommon, SETUP_PRESET_FREEZE_DURING);

            //20191204 add
            radioPresetButtonGroup[SETUP_PRESET_PRESET_ACCELERATION] = RadioButtonGroupCtrl(setup_preset_setting, "setup_preset_preset_acceleration", RADIO_GROUP.rID_0029, '0', callbackChangeRadioCommon, SETUP_PRESET_PRESET_ACCELERATION);


            //preset iris
            radioPresetButtonGroup[SETUP_PRESET_IRIS] = RadioButtonGroupCtrl(part_div, "setup_preset_iris", RADIO_GROUP.rID_0016, '0', callbackChangeRadioCommon, SETUP_PRESET_IRIS);
            radioPresetButtonGroup[SETUP_PRESET_PRESET_SHUTTER] = RadioButtonGroupCtrl(part_div, "setup_preset_shutter", RADIO_GROUP.rID_0016, '0', callbackChangeRadioCommon, SETUP_PRESET_PRESET_SHUTTER);

            //position touch copy
            // radioPresetButtonGroup[SETUP_PRESET_ZOOM_POS_TOUCH] = RadioButtonGroupCtrl("camera_controller_gui_ptz_zoom", "setup_preset_zoom_pos_touch", RADIO_GROUP.rID_0001, '0', callbackChangeRadioCommon, SETUP_PRESET_ZOOM_POS);
            // radioPresetButtonGroup[SETUP_PRESET_FOCUS_ADJ_TOUCH] = RadioButtonGroupCtrl("camera_controller_gui_ptz_zoom", "setup_preset_focus_adj_touch", RADIO_GROUP.rID_0001, '0', callbackChangeRadioCommon, SETUP_PRESET_FOCUS_ADJ);
            // const txtPosPresetObject = TextCtrl("camera_controller_gui_ptz_zoom", 'setup_preset_zoom_pos_touch_label', NPTZ_WORDING.wID_0230);
            // const txtAdjPresetObject = TextCtrl("camera_controller_gui_ptz_zoom", 'setup_preset_focus_adj_touch_label', NPTZ_WORDING.wID_0231);
            // txtPosPresetObject.show();
            // txtAdjPresetObject.show();
            LineCtrl("camera_controller_gui_ptz_zoom", "horizontal", 1070, 35, 140,"position",96);
            $(".position_Line").hide();

            unit = cparam_get_presetSpeedUnit();
            if(unit == 0){
                presetSpeedSlider = SliderCtrl(setup_preset_setting, 'setup_preset_speed_slider', 30, 1, 10, callbackPresetSpeedSlider, null, '', '');
            }else{
                presetSpeedSlider = SliderCtrl(setup_preset_setting, 'setup_preset_speed_slider', 99, 1, 10, callbackPresetSpeedSlider, null, '', '');
            }

            riseCurveSlider = SliderCtrl(setup_preset_setting, 'riseCurveSlider', 30, 0, 10, callbackRiseSCurveSlider, null, '', '');

            fallCurveSlider = SliderCtrl(setup_preset_setting, 'fallCurveSlider', 30, 0, 10, callbackFallSCurveSlider, null, '', '');

            riseAccelerationSlider = SliderCtrl(setup_preset_setting, 'riseAccelerationSlider', 255, 1, 10, callbackRiseAccelerationSlider, null, '', '');

            fallAccelerationSlider = SliderCtrl(setup_preset_setting, 'fallAccelerationSlider', 255, 1, 10, callbackFallAccelerationSlider, null, '', '');

            riseRampSlider = SliderCtrl(setup_preset_setting, 'riseRampSlider', 10.0, 0.1, cparam_get_Position_RiseRamp(), callbackRiseRampSlider, "S", null, null, 0.1, null, 100);

            fallRampSlider = SliderCtrl(setup_preset_setting, 'fallRampSlider', 10.0, 0.1, cparam_get_Position_FallRamp(), callbackFallRampSlider, "S", null, null, 0.1, null, 100);

            for (let txt in txtPresetObject) {
                txtPresetObject[txt].show();
            }
            for (let btn in btnPresetObject) {
                btnPresetObject[btn].show();
                btnPresetObject[btn].displayOff();
            }

            initThisPage();
            //scallbar が普通に行動できるように add by yangyang 20180921
            //new SetupBodyScallBar("setup_preset_form_inner",80);
            //new SetupBodyScallBar("camera_controller_gui",80);
            changeCameraControllerToPreset();
            settingIoaLive.build();
        } else {
            rebuild();
        }
    }

    /**
     * UHD crop設定画面再構築処理
     */
    function rebuild() {
        $('#setup_uhd_form_inner').hide();
        $('#setup_preset_form_inner').show();
        $("#camera_ptz_d_zoom_label").hide();
        $("#camera_ptz_d_ext_label").hide();
        $("#camera_ptz_touch_label").hide();
        $("#camera_controller_gui_th_btns").hide();
        changeCameraControllerToPreset();
        initThisPage();
        settingIoaLive.rebuild();
    }

    function callbackSelectImage(){
        var id = parseInt(selectImageSaveObject.get());
        if(id>99){
            imageLoadBtn.displayOff();
            imageDelBtn.displayOff();
        }else{
            imageLoadBtn.displayDisabled();
            imageDelBtn.displayDisabled();
        }
    }

    function callbackImageSaveBtn(mouse) {
        if (mouse == Button.MOUSE_DOWN) {
            let id = parseInt(selectImageSaveObject.get());
            let name = "";
            if(id < 9){
                name = "00"+(id+1);
            }else if(id==99){
                name = (id+1);
            }else{
                name = "0"+(id+1);
            }
            if(id>99){
                name = "00"+(id-99);
                jConfirm(MSG_STATUS.mid_00101+name+MSG_STATUS.mid_0085_2,NPTZ_WORDING.wID_0001,NPTZ_WORDING.wID_0002,function(confirm){
                    if(confirm){
                        var id = selectImageSaveObject.get()-99;
                        //cparam_set_thumbnailDataUpdateIndividual(id);
                        _cparam_NoData_sendRequset("/cgi-bin/reg_jpeg_img?pic="+id)
                    }
                })
            }else{
                jConfirm(MSG_STATUS.mid_0085+name+MSG_STATUS.mid_0085_2,NPTZ_WORDING.wID_0001,NPTZ_WORDING.wID_0002,function(confirm){
                    if(confirm){
                        var id = selectImageSaveObject.get();
                        cparam_set_thumbnailDataUpdateIndividual(id);
                    }
                })
            }
        }
    }

    function callbackImageDelBtn(mouse){
        if (mouse == Button.MOUSE_DOWN) {
            var id = selectImageSaveObject.get()-100;
            cparam_set_STILDataDeleteIndividual(id);
        }
    }

    function callbackImageLoadBtn(mouse) {
        if (mouse == Button.MOUSE_DOWN) {
            var id = selectImageSaveObject.get()-99;
            var url = "/admin/presetload.html?"+id;
            window.open(url,"_blank", "location=no,toolbar=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width=566px, height=390px , left=500, top =200")
        }
    }

    // function setRadioPresetButtonGroupState(autoFocus) {
    //     if(radioPresetButtonGroup[SETUP_PRESET_FOCUS_ADJ]) {
    //         if (autoFocus == 1) {
    //             radioPresetButtonGroup[SETUP_PRESET_FOCUS_ADJ].displayDisabled();
    //             radioPresetButtonGroup[SETUP_PRESET_FOCUS_ADJ_TOUCH].displayDisabled();
    //         } else {
    //             radioPresetButtonGroup[SETUP_PRESET_FOCUS_ADJ].displayOff();
    //             radioPresetButtonGroup[SETUP_PRESET_FOCUS_ADJ_TOUCH].displayOff();

    //         }
    //         let value = checkRadioValue(cparam_get_focusADJWithPTZ())
	// 		radioPresetButtonGroup[SETUP_PRESET_FOCUS_ADJ].setSelectedValue(value);
    //         radioPresetButtonGroup[SETUP_PRESET_FOCUS_ADJ_TOUCH].setSelectedValue(value);
	// 	}
    // }

    function changeCameraControllerToPreset() {
        $("#camera_control_line_2").hide();
        $("#camera_controller_gui").removeClass("camera_controller_gui_to_setup_uhd").addClass("camera_controller_gui_to_setup_preset");
        $("#camera_controller_gui_ptz_main").addClass("camera_controller_gui_ptz_main_preset");
        $("#camera_controller_gui_preset_main").addClass("camera_controller_gui_preset_main_preset");
        $("#camera_ptz_title").text(NPTZ_WORDING.wID_0003); //add 対応3629


        $("#camera_control_line_2").addClass("camera_control_line_2_preset");
        $("#camera_preset_title").addClass("camera_preset_title_preset");
        $("#camera_adjust_line").addClass("camera_preset_adjust_line");
        $("#camera_adjust_line_2").addClass("camera_preset_adjust_line_2");
        $("#camera_adjust_line_3").hide();
        $("#camera_adjust_line_4").hide();
        $("#camera_control_line_3").hide();

        $("#camera_controller_gui_adjust_iris").addClass("camera_controller_gui_preset_adjust_iris");
        $("#camera_controller_gui_adjust_gain").addClass("camera_controller_gui_preset_adjust_gain");
        $("#camera_controller_gui_adjust_wb").hide();
        $("#camera_controller_gui_adjust_shutter").hide();
        $("#camera_controller_gui_adjust_nd").hide();
        $("#camera_controller_gui_adjust_bottom").hide();

        $("#camera_ptz_d_zoom_label").hide();
        $("#camera_ptz_touch_label").hide();
        $(".btn_cup").hide();
        $(".btn_stream_stop").hide();
        $(".ptz_btn_stream_stop").hide();
        $(".stream_rtmp").hide();
        $("#camera_controller_gui_open_preset").hide();
        $("#camera_controller_gui_open_btn").hide();
        $("#camera_controller_gui_open_btn2").hide();
        $('#base_main_controller').hide();

        var camera_controller_setting_Css;
        if (Platform.isTouchMode()) {
            camera_controller_setting_Css = document.getElementById("camera_controller_setting_cssId");
            camera_controller_setting_Css.href = "/css/pc/camera_controller_setting_touch.css";
            $("#setup_preset_setting").children(".horizontal_line_common").remove();
            $("#setup_preset_setting").children(".vertical_line_common").remove();
            const setup_preset_setting = "setup_preset_setting";
            LineCtrl(setup_preset_setting, "vertical", 490, 40, 235,null,96);
            LineCtrl(setup_preset_setting, "horizontal", 522, 50, 890,null,92);
            LineCtrl(setup_preset_setting, "horizontal", 641, 50, 890,null,92);
            LineCtrl(setup_preset_setting, "horizontal", 760, 20, 890,null,96);
            LineCtrl(setup_preset_setting, "horizontal", 879, 50, 890,null,92);
            LineCtrl(setup_preset_setting, "horizontal", 998, 50, 890,null,92);
            LineCtrl(setup_preset_setting, "horizontal", 1117, 50, 890,null,92);
            LineCtrl(setup_preset_setting, "horizontal", 1236, 50, 890,null,92);
            LineCtrl(setup_preset_setting, "horizontal", 1355, 50, 890,null,92);
            LineCtrl(setup_preset_setting, "horizontal", 1474, 50, 890,null,92);
            LineCtrl(setup_preset_setting, "horizontal", 1583, 50, 890,null,92);

            LineCtrl(setup_preset_setting, "horizontal", 1702, 20, 890,null,96);
            LineCtrl(setup_preset_setting, "horizontal", 1821, 20, 890,null,96);
            LineCtrl(setup_preset_setting, "horizontal", 1940, 20, 890,null,96);
            LineCtrl(setup_preset_setting, "horizontal", 2059, 20, 890,null,96);
            LineCtrl(setup_preset_setting, "horizontal", 2178, 20, 890,null,96);
            LineCtrl(setup_preset_setting, "horizontal", 2297, 20, 890,null,96);
            LineCtrl(setup_preset_setting, "horizontal", 2416, 20, 890,null,96);
            LineCtrl(setup_preset_setting, "horizontal", 2535, 20, 890,null,96);
            LineCtrl(setup_preset_setting, "horizontal", 2654, 20, 890,null,96);
            $("#setup_preset_form_inner_limit").children(".vertical_line_common").hide();

            cameraControllerSetting.callbackOpenPreset_ppls(1);
            $("#setup_preset_form_inner").hide();
        } else {
            $("#setup_preset_setting").children(".horizontal_line_common").remove();
            $("#setup_preset_setting").children(".vertical_line_common").remove();
            $("#setup_preset_form_inner_limit").children(".vertical_line_common").show();
            setupPositionAddLine();
            $('#setup_crop_uhd_crop_tab_bg').hide();
            $("#setup_uhd_form_inner").hide();
            $("#setup_preset_form_inner").show();
            camera_controller_setting_Css = document.getElementById("camera_controller_setting_cssId");
            camera_controller_setting_Css.href = "/css/pc/camera_controller_setting.css";
            if(buildScrollSuccessFlg  && positionScroll == null) {
                buildScrollSuccessFlg = false;
                setTimeout(function () {
                    positionScroll = new IScroll('#camera_controller_gui', {
                        preventDefault: false,
                        click: false,
                        tap: true,
                        scrollbars: true,
                        mouseWheel: true,
                        interactiveScrollbars: true,
                        shrinkScrollbars: 'scale',
                        fadeScrollbars: false,
                        useTransform: false,
                    });
                    buildScrollSuccessFlg = true;
                }, 500);
            }
        }
        // ptz title
        $("#camera_controller_gui_preset_main").show();
        $("#camera_controller_gui_adjust_main").show();

        cameraControllerSetting.showButtonByCtrl();
        cameraControllerSetting.showPresetButton();
        $(".btn_enlarge_preset").hide();
        $(".btn_ptz_preset_ctrl").hide();
        $(".btn_enlarge_image_adjust").hide();
        $(".btn_adjust_area_ctrl").hide();
        $(".btn_enlarge_ptz").hide();
        $(".btn_ptz_area_ctrl").hide();

        $("#camera_controller_gui_ptz_zoom").removeClass("camera_controller_gui_ptz_zoom_uhd_crop").addClass("camera_controller_gui_ptz_zoom_preset_position");
        $("#camera_controller_gui_ptz_speed").removeClass("camera_controller_gui_ptz_speed_uhd_crop").addClass("camera_controller_gui_ptz_speed_preset_position");
        $("#camera_controller_gui_ptz_focus").removeClass("camera_controller_gui_ptz_focus_uhd_crop").addClass("camera_controller_gui_ptz_focus_preset_position");

        $(".btn_ptz_zoom_x1").removeClass("btn_zoom_x1_uhd_crop");
        $(".btn_ptz_zoom_D_Zoom").removeClass("btn_zoom_D_Zoom_uhd_crop");
        $(".btn_ptz_zoom_d_ext ").removeClass("btn_zoom_d_ext_uhd_crop ");
        $(".btn_ptz_zoom_d_ext_20 ").removeClass("btn_zoom_d_ext_20_uhd_crop");

        $('.btn_ptz_focus_auto').removeClass("btn_ptz_focus_auto_uhd");



        $("#camera_controller_gui_ptz").removeClass("camera_controller_gui_ptz_uhd_crop").addClass("camera_controller_gui_ptz_preset_position");
        $("#camera_ptz_ctrl2").removeClass("camera_ptz_ctrl2_uhd_crop").addClass("camera_ptz_ctrl2_preset_position");
        $("#camera_ptz_line").removeClass("camera_ptz_line_uhd_crop").addClass("camera_ptz_line_preset_position");
        $("#camera_ptz_line_2").removeClass("camera_ptz_line2_uhd_crop").addClass("camera_ptz_line2_preset_position");
        $("#camera_ptz_line_3").removeClass("camera_ptz_line3_uhd_crop").addClass("camera_ptz_line3_preset_position");
        $("#camera_control_line").removeClass("camera_control_line_uhd_crop").addClass("camera_control_line_preset_position");
        $("#camera_ptz_title").removeClass("camera_ptz_title_uhd_crop").addClass("camera_ptz_title_preset_position");
        $(".btn_zoom_d_ext").addClass("btn_zoom_d_ext_preset").removeClass("btn_zoom_d_ext_uhd_crop");
        $(".btn_zoom_d_ext_20").addClass("btn_zoom_d_ext_preset_20").removeClass("btn_zoom_d_ext_20_uhd_crop").removeClass("btn_zoom_d_ext_uhd_crop_20");

        $(".btn_a_iris_win").hide();
        $(".btn_focus_guide").hide();
        //$(".btn_zoom_d_ext_20").removeClass("btn_zoom_d_ext_preset_20").addClass("btn_zoom_d_ext_uhd_crop_20");

        $(".btn_zoom_x1").addClass("btn_zoom_x1_preset").removeClass("btn_zoom_x1_uhd_crop");
        $(".btn_zoom_D_Zoom").addClass("btn_zoom_D_Zoom_preset").removeClass("btn_zoom_D_Zoom_uhd_crop");
        $(".btn_touch_af").addClass("btn_touch_af_preset").hide();
        $(".btn_focus_otaf").addClass("btn_focus_otaf_preset").removeClass("btn_focus_otaf_uhd_crop");
        $(".btn_iris_sub").addClass("btn_position_iris_sub");
        $(".btn_iris_auto").addClass("btn_position_iris_auto");

        $(".btn_gain_sub").addClass("btn_preset_iris_auto");
        changeControlPtzStyleFlag = 2;

        changeCameraControllerToPresetTouch();
    }

    function setupPositionAddLine(){
        const setup_preset_setting = "setup_preset_setting_part1";
        // LineCtrl(setup_preset_setting, "horizontal", 785, 20, 800,null,96);
        // LineCtrl(setup_preset_setting, "horizontal", 852, 20, 800,null,96);
        LineCtrl(setup_preset_setting, "horizontal", 1055, 20, 890,null,96);
        LineCtrl(setup_preset_setting, "horizontal", 1123, 50, 890,null,92);
        LineCtrl(setup_preset_setting, "horizontal", 1191, 50, 890,null,92);
        LineCtrl(setup_preset_setting, "horizontal", 1269, 20, 890,null,96);
        LineCtrl(setup_preset_setting, "horizontal", 1337, 50, 890,null,92);
        LineCtrl(setup_preset_setting, "horizontal", 1405, 50, 890,null,92);
        LineCtrl(setup_preset_setting, "horizontal", 1473, 50, 890,null,92);
        LineCtrl(setup_preset_setting, "horizontal", 1541, 50, 890,null,92);
        LineCtrl(setup_preset_setting, "horizontal", 1609, 50, 890,null,92);
        LineCtrl(setup_preset_setting, "horizontal", 1677, 50, 890,null,92);
        LineCtrl(setup_preset_setting, "horizontal", 1755, 20, 890,null,96);
        LineCtrl(setup_preset_setting, "horizontal", 1833, 20, 890,null,96);
        LineCtrl(setup_preset_setting, "horizontal", 1911, 20, 890,null,96);
        LineCtrl(setup_preset_setting, "horizontal", 1989, 20, 890,null,96);
        LineCtrl(setup_preset_setting, "horizontal", 2067, 20, 890,null,96);
        LineCtrl(setup_preset_setting, "horizontal", 2145, 20, 890,null,96);
        LineCtrl(setup_preset_setting, "horizontal", 2223, 20, 890,null,96);
        LineCtrl(setup_preset_setting, "horizontal", 2301, 20, 890,null,96);
        LineCtrl(setup_preset_setting, "horizontal", 2379, 20, 890,null,96);
        LineCtrl(setup_preset_setting, "vertical", 1070, 35, 140,null,96);
    }

    function changeCameraControllerToPresetTouch() {
        if($("#main_gui").css("display")  == 'none' && Platform.isTouchMode() && ($(".setup_menu_presetPosition_btn").hasClass('on') || $(".setup_menu_presetPosition_btn").hasClass('on_hover'))){
            $("#camera_controller_gui").removeClass("camera_controller_gui_to_setup_preset").addClass("camera_controller_gui_to_setup_preset_ppls");
            $("#camera_controller_gui_preset_main").removeClass("camera_controller_gui_preset_main_preset").addClass("camera_controller_gui_preset_main_preset_ppls");
            $("#preset_list").removeClass("preset_list").addClass("preset_list_ppls");
            for(let i=0; i< 9; i++){
                $('#preset_list_' + (('0' + i).slice(-2))).removeClass('preset_list_'+ (('0' + i).slice(-2))).addClass('preset_list_ppls_'+ (('0' + i).slice(-2)));
                $('#input_list_' + (('0' + i).slice(-2))).removeClass('input_list_'+ (('0' + i).slice(-2))).addClass('input_list_ppls_'+ (('0' + i).slice(-2)));
                $('#camera_presnt_' + (i+1)).removeClass('camera_presnt_'+ (i+1)).addClass('camera_presnt_ppls_'+ (i+1));
            }
            $('#camera_controller_gui_adjust_main').removeClass('camera_controller_gui_adjust_main').addClass('camera_controller_gui_adjust_main_ppls');

            $('#camera_controller_gui_ptz_main').removeClass('camera_controller_gui_ptz_main_preset').addClass('camera_controller_gui_ptz_main_preset_ppls');
            $('#setup_presetPosition_form').removeClass('setup_presetPosition_form').addClass('setup_presetPosition_form_ppls');
            $('.btn_preset_home').removeClass('btn_preset_home').addClass('btn_preset_home_ppls');
            $('#setup_preset_setting').removeClass('setup_preset_setting').addClass('setup_preset_setting_ppls');
            $("#camera_controller_gui_th_btns").show();
            $("#camera_controller_gui_adjust_main").hide();
            $("#setup_crop_uhd_crop_tab_bg").hide();
            $("#setup_uhd_form_inner").hide();

            // $("#slider_Main").hide();
            $(".btn_nm_preset").addClass('on');
            $(".btn_nm_ptls").removeClass('on');
            $(".btn_nm_ptls").removeClass('disable');
            $(".btn_nm_ptls").removeClass('on_hover');
            $(".btn_nm_ptls").removeClass('off_hover');
            $(".btn_nm_ptls").addClass('off');
            $(".btn_nm_setting").removeClass('on');
            $(".btn_nm_setting").removeClass('disable');
            $(".btn_nm_setting").removeClass('on_hover');
            $(".btn_nm_setting").removeClass('off_hover');
            $(".btn_nm_setting").addClass('off');
            $("#camera_preset_title").text(NPTZ_WORDING.wID_0327);
            $("#camera_preset_title").show();

        }else {
            $("#camera_controller_gui_th_btns").hide();
            $("#setup_preset_form_inner_limit").show();
            $("#setup_preset_setting").show();
            $("#camera_controller_gui_adjust_iris").show();
            $("#camera_controller_gui_adjust_gain").show();
            $("#camera_controller_gui_ptz_focus").show();
            $("#camera_controller_gui_ptz_zoom").show();
            $("#camera_controller_gui_ptz_main").show();
            $(".setup_preset_zoom_pos_label").show();
            $(".setup_preset_zoom_posOn_radio").show();
            $(".setup_preset_zoom_posOff_radio").show();
            $(".setup_preset_zoom_posOn_label").show();
            $(".setup_preset_zoom_posOff_label").show();

            $(".setup_preset_focus_adj_label").show();
            $(".setup_preset_focus_adjOn_radio").show();
            $(".setup_preset_focus_adjOff_radio").show();
            $(".setup_preset_focus_adjOn_label").show();
            $(".setup_preset_focus_adjOff_label").show();
            $("#camera_preset_title").show();

            $(".setup_preset_zoom_pos_touch_label").hide();
            $(".setup_preset_zoom_pos_touchOn_radio").hide();
            $(".setup_preset_zoom_pos_touchOff_radio").hide();
            $(".setup_preset_zoom_pos_touchOn_label").hide();
            $(".setup_preset_zoom_pos_touchOff_label").hide();
            $(".camera_ptz_line_6").hide();
            $("#div_pan_lens_control").show();

            $(".setup_preset_focus_adj_touch_label").hide();
            $(".setup_preset_focus_adj_touchOn_radio").hide();
            $(".setup_preset_focus_adj_touchOff_radio").hide();
            $(".setup_preset_focus_adj_touchOn_label").hide();
            $(".setup_preset_focus_adj_touchOff_label").hide();
        }
    }
    
    function initThisPage() {
        initLimitButton();
        initRadioButton();
        initPresetSpeedSlider();
        initRiseSCurve();
        changePresetPositionStatus();
    }

    function initRiseSCurve(){
        riseCurveSlider.setValue(cparam_get_RiseSCurve());
        fallCurveSlider.setValue(cparam_get_FallSCurve());
        riseAccelerationSlider.setValue(cparam_get_Position_RiseAcceleration());
        fallAccelerationSlider.setValue(cparam_get_Position_FallAcceleration());
        riseRampSlider.setValue(cparam_get_Position_RiseRamp());
        fallRampSlider.setValue(cparam_get_Position_FallRamp());
    }

    function callbackChangeRadioCommon(val, mouse, index) {
        ChangeRadioButtonCommon(val,index);
    }
    
    function callbackPresetSpeedSlider() {
        let step;
        if(unit == 0){
            step = 30;
        }else{
            step = 99;
        }
        let speedUnit = unit;
        let sliderValue = Number(presetSpeedSlider.getValue());
        sliderValue = sliderValue > step ? step : sliderValue;
        sliderValue = sliderValue < 1 ? 1 : sliderValue;
        doPresetSpeedSlider(speedUnit, sliderValue);
    }

    function callbackRiseSCurveSlider() {
        let sliderValue = Number(riseCurveSlider.getValue());
        cparam_set_RiseSCurve(sliderValue);
    }

    function callbackFallSCurveSlider() {
        let sliderValue = Number(fallCurveSlider.getValue());
        cparam_set_FallSCurve(sliderValue);
    }

    function callbackRiseAccelerationSlider() {
        let sliderValue = Number(riseAccelerationSlider.getValue());
        cparam_set_Position_RiseAcceleration(sliderValue);
    }

    function callbackFallAccelerationSlider() {
        let sliderValue = Number(fallAccelerationSlider.getValue());
        cparam_set_Position_FallAcceleration(sliderValue);
    }

    function callbackRiseRampSlider() {
        let sliderValue = Number(riseRampSlider.getValue());
        cparam_set_Position_RiseRamp(sliderValue*10);
    }

    function callbackFallRampSlider() {
        let sliderValue = Number(fallRampSlider.getValue());
        cparam_set_Position_FallRamp(sliderValue*10);
    }



    function doPresetSpeedSlider(unit, value) {
        let resultTimer = null;
        let resultSpeedTable = null;

        if (unit == 1){
            resultTimer = parseInt(value).toString(16);
            cparam_set_presetSpeed(resultTimer);
        }
        else {
            if (value == 30) {
                resultSpeedTable = 999
            } else {
                resultSpeedTable = 275 + (value-1) * 25;
            }
            cparam_set_presetSpeed(resultSpeedTable);
        }
    }

    function ChangeRadioButtonCommon(data,index) {
        switch (index) {
            // case SETUP_PRESET_ZOOM_POS:
                // cparam_set_speedWithZoomPOS(data);
                // break;
            // case SETUP_PRESET_FOCUS_ADJ:
                // cparam_set_focusADJWithPTZ(data);
                // break;
            case SETUP_PRESET_PTZ_SYNC_MODE:
                cparam_setPresetPtzSyncMode(data);

                if(data == 1){ //Preset PTZ Sync ModeがOnの時は、Preset Zoom Modeはグレーアウト
                    radioPresetButtonGroup[SETUP_PRESET_ZOOM_MODE].displayDisabled();
                    radioPresetButtonGroup[SETUP_PRESET_DIGITAL_EXTENDER].displayDisabled();//#8517
                } else {
                    radioPresetButtonGroup[SETUP_PRESET_ZOOM_MODE].displayOff();
                    radioPresetButtonGroup[SETUP_PRESET_DIGITAL_EXTENDER].displayOff();//#8517
                }
                changePresetPositionStatus();//#8519
                break;
            case SETUP_PRESET_SPEED_UNIT:
                cparam_set_presetSpeedUnit(data);
                $(".setup_preset_speed_slider").remove();
                unit = cparam_get_presetSpeedUnit();
                if(unit == 0){
                    radioPresetButtonGroup[SETUP_PRESET_SPEED_TABLE].displayOff();
                    presetSpeedSlider = SliderCtrl('setup_preset_setting_part1', 'setup_preset_speed_slider', 30, 1, 10, callbackPresetSpeedSlider, null, '', '');
                    initPresetSpeedSlider();
                }else{
                    radioPresetButtonGroup[SETUP_PRESET_SPEED_TABLE].displayDisabled();
                    presetSpeedSlider = SliderCtrl('setup_preset_setting_part1', 'setup_preset_speed_slider', 99, 1, 10, callbackPresetSpeedSlider, null, '', '');
                    initPresetSpeedSlider();
                }
                changePresetPositionStatus();
                break;
            case SETUP_PRESET_SPEED_TABLE:
                cparam_set_presetSpeedTable(data);
                break;
            case SETUP_PRESET_SCOPE:
                cparam_set_presetScope(data);
                if(cparam_get_presetScope() == 2){
                    radioPresetButtonGroup[SETUP_PRESET_IRIS].displayDisabled();
                }else{
                    radioPresetButtonGroup[SETUP_PRESET_IRIS].displayOff();
                }
                if(cparam_get_presetScope() == 1 || cparam_get_presetScope() == 2){
                    radioPresetButtonGroup[SETUP_PRESET_PRESET_SHUTTER].displayDisabled();
                }else{
                    radioPresetButtonGroup[SETUP_PRESET_PRESET_SHUTTER].displayOff();
                }

                break;
            case SETUP_PRESET_DIGITAL_EXTENDER:
                cparam_set_presetDExtender(data);
                break;
            case SETUP_PRESET_CROP:
                cparam_set_presetCrop(data);
                break;
            case SETUP_PRESET_THUMBNAIL_UPDATE:
                cparam_set_presetThumbnailUpdate(data);
                break;
            case SETUP_PRESET_NAME:
                cparam_set_presetName(data);
                break;
            case SETUP_PRESET_ZOOM_MODE:
                cparam_set_presetZoomMode(data);
                break;
            case SETUP_PRESET_FREEZE_DURING:
                cparam_set_freezeDuringPreset(data);
                break;
            case SETUP_PRESET_IRIS:
                cparam_set_preset_iris(data);
                break;
            case SETUP_PRESET_PRESET_SHUTTER:
                cparam_set_preset_shutter(data);
                break;
            case SETUP_PRESET_PRESET_ACCELERATION:
                cparam_set_preset_acceleration(data);
                changePresetPositionStatus();
                break;
            default:
                break;
        }
        checkTimer();
    }
    function changePresetPositionStatus(){
        const value = cparam_get_preset_acceleration();
        if(value == 1){
            riseCurveSlider.setDisable();
            fallCurveSlider.setDisable();
            riseAccelerationSlider.setDisable();
            fallAccelerationSlider.setDisable();
            riseRampSlider.setDisable();
            fallRampSlider.setDisable();
        }else{
            riseCurveSlider.setEnable();
            fallCurveSlider.setEnable();
            const unit = cparam_get_presetSpeedUnit();
            if(unit == 0){
                riseAccelerationSlider.setEnable();
                fallAccelerationSlider.setEnable();
                riseRampSlider.setDisable();
                fallRampSlider.setDisable();
            }else{
                riseAccelerationSlider.setDisable();
                fallAccelerationSlider.setDisable();
                riseRampSlider.setEnable();
                fallRampSlider.setEnable();
            }
        }
        ptzSyncModeAndSpeedUnitAndAcceleration();//#8519
    }

    function ptzSyncModeAndSpeedUnitAndAcceleration(){
         //#8519
         const value = cparam_get_preset_acceleration();
         var ptzSyncMode = cparam_getPresetPtzSyncMode();
         const unit = cparam_get_presetSpeedUnit();
         if(value == 0 && ptzSyncMode == 1){        
             if(unit == 0){
                 riseCurveSlider.setDisable();
                 fallCurveSlider.setDisable();
                 fallAccelerationSlider.setDisable();
             }else{
                 riseCurveSlider.setDisable();
                 fallCurveSlider.setDisable();
                 fallRampSlider.setDisable();
             }
         }
    }

    function initPresetSpeedSlider() {
        let data = cparam_get_presetSpeed();
        operatePresetSpeedSliderValue(data);
    }

    function operatePresetSpeedSliderValue(data) {
        let result = 1;
        if(unit == 0){
            if (data == "000" || data == "999") {
                result = 30;
            } else {
                result = (data - 275)/25 + 1;
            }
        }else{
            result = data;
        }

        if(presetSpeedSlider != undefined) {
            presetSpeedSlider.setValue(result);
        }
    }

    function initLimitButton() {
        for (let i = 0; i < 4; i++) {
            const retValue = cparam_get_limitationControl(i + 1);
            changeLimitTableStyle(i, retValue);
        }
    }

    function initRadioButton() {
        // radioPresetButtonGroup[SETUP_PRESET_ZOOM_POS].setSelectedValue(checkRadioValue(cparam_get_speedWithZoomPOS()));
        radioPresetButtonGroup[SETUP_PRESET_PTZ_SYNC_MODE].setSelectedValue(checkRadioValue(cparam_getPresetPtzSyncMode()));
        var ptzSyncMode = cparam_getPresetPtzSyncMode();
        if(ptzSyncMode == 1){ //Preset PTZ Sync ModeがOnの時は、Preset Zoom Modeはグレーアウト
            radioPresetButtonGroup[SETUP_PRESET_ZOOM_MODE].displayDisabled();
            radioPresetButtonGroup[SETUP_PRESET_DIGITAL_EXTENDER].displayDisabled();//#8517
        } else {
            radioPresetButtonGroup[SETUP_PRESET_ZOOM_MODE].displayOff();
            radioPresetButtonGroup[SETUP_PRESET_DIGITAL_EXTENDER].displayOff();//#8517
        }
        radioPresetButtonGroup[SETUP_PRESET_SPEED_UNIT].setSelectedValue(checkRadioValue(cparam_get_presetSpeedUnit()));
        radioPresetButtonGroup[SETUP_PRESET_SPEED_TABLE].setSelectedValue(checkRadioValue(cparam_get_presetSpeedTable()));
        unit = cparam_get_presetSpeedUnit();
        if(unit == 0){
            radioPresetButtonGroup[SETUP_PRESET_SPEED_TABLE].displayOff();
        }else{
            radioPresetButtonGroup[SETUP_PRESET_SPEED_TABLE].displayDisabled();
        }
        let getScope = cparam_get_presetScope();
        radioPresetButtonGroup[SETUP_PRESET_SCOPE].setSelectedValue(checkRadioValue(getScope));
        radioPresetButtonGroup[SETUP_PRESET_DIGITAL_EXTENDER].setSelectedValue(cparam_get_presetDExtender());
        radioPresetButtonGroup[SETUP_PRESET_CROP].setSelectedValue(checkRadioValue(cparam_get_presetCrop()));
        let uhdCropRadioDate = cparam_get_UHDCrop();
        let sFormat = cparam_get_format();
        if((sFormat == 19 || sFormat == 17 || sFormat == "1A" ||sFormat == "1B" || sFormat == "1F" || sFormat == 18 || sFormat == 21)&&uhdCropRadioDate != 0){
            radioPresetButtonGroup[SETUP_PRESET_CROP].displayOff();
        }else{
            radioPresetButtonGroup[SETUP_PRESET_CROP].displayDisabled();
        }
        radioPresetButtonGroup[SETUP_PRESET_THUMBNAIL_UPDATE].setSelectedValue(checkRadioValue(cparam_get_presetThumbnailUpdate()));
        radioPresetButtonGroup[SETUP_PRESET_NAME].setSelectedValue(checkRadioValue(cparam_get_presetName()));
        radioPresetButtonGroup[SETUP_PRESET_ZOOM_MODE].setSelectedValue(checkRadioValue(cparam_get_presetZoomMode()));
        radioPresetButtonGroup[SETUP_PRESET_FREEZE_DURING].setSelectedValue(checkRadioValue(cparam_get_freezeDuringPreset()));
        radioPresetButtonGroup[SETUP_PRESET_IRIS].setSelectedValue(checkRadioValue(cparam_get_preset_iris()));
        radioPresetButtonGroup[SETUP_PRESET_PRESET_SHUTTER].setSelectedValue(checkRadioValue(cparam_get_preset_shutter()));
        radioPresetButtonGroup[SETUP_PRESET_PRESET_ACCELERATION].setSelectedValue(checkRadioValue(cparam_get_preset_acceleration()));
        if(getScope == 2){
            radioPresetButtonGroup[SETUP_PRESET_IRIS].displayDisabled();
        }else{
            radioPresetButtonGroup[SETUP_PRESET_IRIS].displayOff();
        }

    }

    function checkRadioValue(strValue) {
        if (strValue) {
            return strValue;
        } else {
            return false;
        }
    }

      /**
     * 制限ボタン押下時の画面制御共通処理
     * @param {number} mouse マウス・ボタン操作状況
     * @param {number} type 押下ボタンの画面要素インデックス値
     */
    function callbackLimitCtrl(mouse, type) {
        if (mouse == Button.MOUSE_DOWN) {
            // 押下不可
            if (btnPresetObject[type].getStatus() == Button.STATUS_DISABLED) {
                return;
            }
            changeLimitButtonControl(type);
        }
    }

    function changeLimitButtonControl(type) {
        let data1 = 1;
        let data2 = 1;
        switch (type) {
            case SETUP_PRESET_LIMIT_TOP_BUTTON:
                data1 = 1;
                break;
            case SETUP_PRESET_LIMIT_BOTTOM_BUTTON:
                data1 = 2;
                break;
            case SETUP_PRESET_LIMIT_LEFT_BUTTON:
                data1 = 3;
                break;
            case SETUP_PRESET_LIMIT_RIGHT_BUTTON:
                data1 = 4;
                break;
            default:
                // 本来通過しないパス
                return;
        }
        //style control
        if (btnPresetObject[type].getStatus() == Button.STATUS_ON) { //Release
            data2 = 0;
        }
        var retValue = cparam_set_limitationControl(data1, data2);
        changeLimitTableStyle(type, retValue);
    }

    function changeLimitTableStyle(type, dir) {
        var m = parseInt(dir / 10);
        var n = dir % 10;
        var className = ".setup_preset_limit_label_" + m;
        if (n == 1) {
            $(className).addClass("setup_preset_limit_label_red");
            $(className+" p")[0].innerText = NPTZ_WORDING.wID_0141;
            btnPresetObject[type].displayOn();
        } else {
            $(className).removeClass("setup_preset_limit_label_red");
            $(className+" p")[0].innerText = NPTZ_WORDING.wID_0370;
            btnPresetObject[type].displayOff();
        }
    }

    function checkTimer() {
        var name = "";

        if (typeof event != "undefined") {
            name = event.srcElement.name;
        }
        if (lastrequest == name) {
            clearInterval(requestTimer);
        }
        lastrequest = name;
    }

    return {
        build: build,
        changeCameraControllerToPreset:changeCameraControllerToPreset,
        // setRadioPresetButtonGroupState:setRadioPresetButtonGroupState,
        initPresetSpeedSlider : initPresetSpeedSlider
    };
}
