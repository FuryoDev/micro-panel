/**
 * @fileOverview SetUp画面：settingStatus
 *
 * @author Panasonic Corporation
 */

/**
 * カメラ状態表示クラスインスタンス
 * @type {settingStatus}
 */
var settingStatus = settingStatus();

/**
 * カメラリスト領域制御クラスインスタンス
 * @type {settingStatus}
 */
function settingStatus() {
    /**
     * 構築フラグ
     * @type boolean
     */
    var buildFlag = false;
    var settingStatusTitle;
    var txtObjectStatus = [];
    var TXT_MODEL_NO_TITLE = 0;
    var TXT_FIRMWARE_VERSION_TITLE = 1;
    var TXT_SYSTEM_FORMAT_TITLE = 2;
    var TXT_SYSTEM_FREQUECY_TITLE = 3;
    var TXT_STREAMING_MODE_TITLE = 4;
    var TXT_MODEL_NO_VALUE = 5;
    var TXT_FIRMWARE_VERSION_VALUE = 6;
    var TXT_SYSTEM_FORMAT_VALUE = 7;
    var TXT_SYSTEM_FREQUECY_VALUE = 8;
    var TXT_STREAMING_MODE_VALUE = 9;
    /**
     * settingStatus画面の初期化
     * @type {settingStatus}
     */

    function build() {
        if (!buildFlag) {
            buildFlag = true;
            settingStatusTitle = TextCtrl("setting_Situation", "setting_status_title", NPTZ_WORDING.wID_0077);
            settingStatusTitle.show();
            txtObjectStatus[TXT_MODEL_NO_TITLE] = TextCtrl("setting_Situation", "setting_status_model_no_title", NPTZ_WORDING.wID_0381);
            txtObjectStatus[TXT_MODEL_NO_VALUE] = TextCtrl("setting_Situation", "setting_status_model_no_value", cparams["name"]);
            txtObjectStatus[TXT_FIRMWARE_VERSION_TITLE] = TextCtrl("setting_Situation", "setting_status_firmware_version_title",NPTZ_WORDING.wID_0402);
            txtObjectStatus[TXT_FIRMWARE_VERSION_VALUE] = TextCtrl("setting_Situation", "setting_status_firmware_version_value","");
            txtObjectStatus[TXT_SYSTEM_FREQUECY_TITLE] = TextCtrl("setting_Situation", "setting_status_system_frequency_title", NPTZ_WORDING.wID_0403);
            txtObjectStatus[TXT_SYSTEM_FREQUECY_VALUE] = TextCtrl("setting_Situation", "setting_status_system_frequency_value","");
            txtObjectStatus[TXT_SYSTEM_FORMAT_TITLE] = TextCtrl("setting_Situation", "setting_status_system_format_title", NPTZ_WORDING.wID_0404);
            txtObjectStatus[TXT_SYSTEM_FORMAT_VALUE] = TextCtrl("setting_Situation", "setting_status_system_format_value", "");
            txtObjectStatus[TXT_STREAMING_MODE_TITLE] = TextCtrl("setting_Situation", "setting_status_streaming_mode_title", NPTZ_WORDING.wID_0097);
            txtObjectStatus[TXT_STREAMING_MODE_VALUE] = TextCtrl("setting_Situation", "setting_status_streaming_mode_value","");
            upadateSettingStatus();
            for (var i = 0; i < txtObjectStatus.length; i++) {
                txtObjectStatus[i].show();
            }
        }else {
            rebuild();
        }
    }
    /**
     * 画面再構築処理
     */
    function rebuild() {
        upadateSettingStatus();
    }

    function upadateSettingStatus(){
        _cparam_cgi_name();
        txtObjectStatus[TXT_MODEL_NO_VALUE].set( cparams["name"]);
        txtObjectStatus[TXT_FIRMWARE_VERSION_VALUE].set( cparam_get_systemVersion());
        txtObjectStatus[TXT_SYSTEM_FREQUECY_VALUE].set( getCurrentSystemFrequency());
        txtObjectStatus[TXT_SYSTEM_FORMAT_VALUE].set( getCurrentFormat());
        txtObjectStatus[TXT_STREAMING_MODE_VALUE].set(CONST_STREAM_MODE_MAP_STATUS[getStreamMode()]);
    }
    return {
        build: build
    }
}