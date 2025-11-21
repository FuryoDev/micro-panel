/**
 * @fileOverview ログイン後のMAIN画面：settingMaintenaceInfo
 *
 * @author Panasonic Corporation
 */

/**
 * カメラリスト領域制御クラスインスタンス
 * @type {CameraList}
 */
var settingMaintenanceMaintenance = SettingMaintenanceMaintenance();

function SettingMaintenanceMaintenance() {
    var gbAct = false;
    var gPower = 1;
    var txtObjectStatus = [];
    /**
     * labelオブジェクト
     * @type txtMaintenanceMaintenanceObject[]
     */
    var txtMaintenanceMaintenanceObject = [];
    var TXT_FAN1_Value = 20;
    var TXT_FAN2_Value = 21;
    /**
     * label定義(maintenance_reset) : Reset to the default (Except the network settings)
     * @type number
     */
    var SETUP_MAINTENANCE_MAINTENANCE_WIRELESS_CONTROL_LABEL = 0;
    /**
     * label定義(maintenance_reset) : Reboot
     * @type number
     */
    var SETUP_MAINTENANCE_MAINTENANCE_WIRELESS_ID_LABEL = 1;
    /**
     * label定義(maintenance_reset) : Reboot
     * @type number
     */
    var SETUP_MAINTENANCE_MAINTENANCE_STATUS_LAMP_LABEL = 2;
    /**
     * label定義(maintenance_reset) : Reset to the default (Except the network settings)
     * @type number
     */
    var SETUP_MAINTENANCE_MAINTENANCE_RESET_LABEL = 3;
    /**
     * label定義(maintenance_reset) : Reboot
     * @type number
     */
    var SETUP_MAINTENANCE_MAINTENANCE_REBOOT_LABEL = 4;
    /**
     * button[]
     * @type btnMaintenanceMaintenanceObject[]
     */
    var btnMaintenanceMaintenanceObject = [];
    /**
     * Maintenance reset button : Reset to the default (Except the network settings)
     */
    var SETUP_MAINTENANCE_MAINTENANCE_EXECUTE1_BUTTON = 0;
    /**
     * Maintenance reset button : Reboot
     */
    var SETUP_MAINTENANCE_MAINTENANCE_EXECUTE2_BUTTON = 1;
    /**
     * 構築フラグ
     * @type boolean
     */

    var buildFlag = false;
    var radioModeButtonGroup = [];
    var RADIO_SYSTEM_FAN = 0;
    var RADIO_SYSTEM_FAN_TWO = 1;
    var RADIO_SYSTEM_WIRELESS = 2;
    var RADIO_SYSTEM_WIRELESS_ID = 3;
    var RADIO_SYSTEM_STATUS_LAMP = 4;
    var line1 = null;
    var line2 = null;
    var line3 = null;
    var myDOM  = new Object();
    myDOM.ajax = new Object();

    /**
     * reset設定画面構築処理
     */
    function build() {
        if (!buildFlag) {
            buildFlag = true;
            var setup_maintenance_maintenance_labels = "setup_maintenance_maintenance_labels";
            var setup_maintenance_maintenance_form = "setup_maintenance_maintenance_form";
            //Fan
            var fan = TextCtrl(setup_maintenance_maintenance_labels, "setup_maintenance_maintenance_fan1_label", NPTZ_WORDING.wID_0741 + "1");
            fan.show();
            var fan_two = TextCtrl(setup_maintenance_maintenance_labels, "setup_maintenance_maintenance_fan2_label", NPTZ_WORDING.wID_0741 + "2");
            fan_two.show();
            line1 = LineCtrl('setting_maintenance_maintenance', "horizontal", 83, 20, 1547,"setup_maintenance_maintenance_fan1_label");
            line2 = LineCtrl('setting_maintenance_maintenance', "horizontal", 152, 20, 1547,"setup_maintenance_maintenance_fan2_label");
 
            radioModeButtonGroup[RADIO_SYSTEM_FAN] = RadioButtonGroupCtrl(setup_maintenance_maintenance_form, "setting_basic_system_fan", RADIO_GROUP.rID_0040, cparam_get_fan1(), callbackFan1RadioButton);
            radioModeButtonGroup[RADIO_SYSTEM_FAN_TWO] = RadioButtonGroupCtrl(setup_maintenance_maintenance_form, "setting_basic_system_fan_two", RADIO_GROUP.rID_0040, cparam_get_fan2(), callbackFan2RadioButton);
            radioModeButtonGroup[RADIO_SYSTEM_WIRELESS] = RadioButtonGroupCtrl(setup_maintenance_maintenance_form, "setting_basic_system_wireless", RADIO_GROUP.rID_0041, cparam_get_wirelessControl(), callbackWireLessRadioButton);
            radioModeButtonGroup[RADIO_SYSTEM_WIRELESS_ID] = RadioButtonGroupCtrl(setup_maintenance_maintenance_form, "setting_basic_system_wireless_id", RADIO_GROUP.rID_0100, cparam_get_wirelessID(), callbackWireLessIdRadioButton);
            radioModeButtonGroup[RADIO_SYSTEM_STATUS_LAMP] = RadioButtonGroupCtrl(setup_maintenance_maintenance_form, "setting_basic_system_status_lamp", RADIO_GROUP.rID_0041, cparam_get_status_lamp(), callbackStatusLampRadioButton);
            txtMaintenanceMaintenanceObject[SETUP_MAINTENANCE_MAINTENANCE_WIRELESS_CONTROL_LABEL] = TextCtrl(setup_maintenance_maintenance_labels, 'setup_maintenance_maintenance_wireless_control_label', NPTZ_WORDING.wID_0851);
            txtMaintenanceMaintenanceObject[SETUP_MAINTENANCE_MAINTENANCE_WIRELESS_ID_LABEL] = TextCtrl(setup_maintenance_maintenance_labels, 'setup_maintenance_maintenance_wireless_id_label', NPTZ_WORDING.wID_0852);
            txtMaintenanceMaintenanceObject[SETUP_MAINTENANCE_MAINTENANCE_STATUS_LAMP_LABEL] = TextCtrl(setup_maintenance_maintenance_labels, 'setup_maintenance_maintenance_status_lamp_label', NPTZ_WORDING.wID_0221);
            line1 = LineCtrl('setting_maintenance_maintenance', "horizontal", 83, 20, 1547,"setup_maintenance_maintenance_wireless_control_label");
            line2 = LineCtrl('setting_maintenance_maintenance', "horizontal", 152, 20, 1547,"setup_maintenance_maintenance_wireless_id_label")
            line2 = LineCtrl('setting_maintenance_maintenance', "horizontal", 152, 20, 1547,"setup_maintenance_maintenance_status_lamp_label")
            txtMaintenanceMaintenanceObject[SETUP_MAINTENANCE_MAINTENANCE_RESET_LABEL] = TextCtrl(setup_maintenance_maintenance_labels, 'setup_maintenance_maintenance_reset_label', NPTZ_WORDING.wID_0400);
            txtMaintenanceMaintenanceObject[SETUP_MAINTENANCE_MAINTENANCE_REBOOT_LABEL] = TextCtrl(setup_maintenance_maintenance_labels, 'setup_maintenance_maintenance_reboot_label', NPTZ_WORDING.wID_0401);
            btnMaintenanceMaintenanceObject[SETUP_MAINTENANCE_MAINTENANCE_EXECUTE1_BUTTON] = ButtonCtrl(setup_maintenance_maintenance_form, "setup_maintenance_maintenance_execute1_button", NPTZ_WORDING.wID_0154, callbackSettingResetExecute, SETUP_MAINTENANCE_MAINTENANCE_EXECUTE1_BUTTON);
            btnMaintenanceMaintenanceObject[SETUP_MAINTENANCE_MAINTENANCE_EXECUTE2_BUTTON] = ButtonCtrl(setup_maintenance_maintenance_form, "setup_maintenance_maintenance_execute2_button", NPTZ_WORDING.wID_0154, callbackSettingResetExecute, SETUP_MAINTENANCE_MAINTENANCE_EXECUTE2_BUTTON);
            line1 = LineCtrl('setting_maintenance_maintenance', "horizontal", 83, 20, 1547,"setup_maintenance_maintenance_reset_label");
            line2 = LineCtrl('setting_maintenance_maintenance', "horizontal", 152, 20, 1547,"setup_maintenance_maintenance_reboot_label");
            for (var txt in txtMaintenanceMaintenanceObject) {
                txtMaintenanceMaintenanceObject[txt].show();
            }
            for (var btn in btnMaintenanceMaintenanceObject) {
                btnMaintenanceMaintenanceObject[btn].show();
                btnMaintenanceMaintenanceObject[btn].displayOff();
            }
        } else {
            rebuild();
        }
    }

    /**
     * Maintenance設定画面再構築処理
     */
    function rebuild() {
        radioModeButtonGroup[RADIO_SYSTEM_FAN].setSelectedValue(cparam_get_fan1());
        radioModeButtonGroup[RADIO_SYSTEM_FAN_TWO].setSelectedValue(cparam_get_fan2());
        radioModeButtonGroup[RADIO_SYSTEM_WIRELESS].setSelectedValue(cparam_get_wirelessControl());
        radioModeButtonGroup[RADIO_SYSTEM_WIRELESS_ID].setSelectedValue(cparam_get_wirelessID());
        radioModeButtonGroup[RADIO_SYSTEM_STATUS_LAMP].setSelectedValue(cparam_get_status_lamp());
    }
    function callbackFan1RadioButton(){
        cparam_set_fan1(radioModeButtonGroup[RADIO_SYSTEM_FAN].getSelectedValue());
    }
    function callbackFan2RadioButton(){
        cparam_set_fan2(radioModeButtonGroup[RADIO_SYSTEM_FAN_TWO].getSelectedValue());
    }
    function callbackWireLessRadioButton(){
        cparam_set_wirelessControl(radioModeButtonGroup[RADIO_SYSTEM_WIRELESS].getSelectedValue());
    }
    function callbackWireLessIdRadioButton(){
        cparam_set_wirelessID(radioModeButtonGroup[RADIO_SYSTEM_WIRELESS_ID].getSelectedValue());
    }
    function callbackStatusLampRadioButton(){
        cparam_set_status_lamp(radioModeButtonGroup[RADIO_SYSTEM_STATUS_LAMP].getSelectedValue());
    }
    function callbackSettingResetExecute(mouse, num) {
        if (mouse == Button.MOUSE_UP) {

        } else if (mouse == Button.MOUSE_DOWN) {
            if (num === SETUP_MAINTENANCE_MAINTENANCE_EXECUTE1_BUTTON) {
                DoSubmit('data')
            } else if (num === SETUP_MAINTENANCE_MAINTENANCE_EXECUTE2_BUTTON) {
                DoSubmit('reset')
            }
        } else {
            // 処理なし
        }
    }

    function DoSubmit(sType) {
        var strAlert = "";
        if (sType == "data") {
            strAlert = MSG_STATUS.mID_0054;
        } else if (sType == "reset") {
            strAlert = MSG_STATUS.mID_0055;
        } else {
            return false;
        }
        window.jConfirm(strAlert,NPTZ_WORDING.wID_0039,NPTZ_WORDING.wID_0040,function(confirm){
            if(confirm){
                clearInterval(refresh_power_id);
                $("#dialog_setup").show();
                if (sType == "data") {
                    cparam_set_initializeForMenu();
                    gbAct = false;
                } else {
                    Reset(sType);
                }
                setTimeout(checkIfSuccess, 2000);
            }else{
                return;
            }
        });
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
                        xhr.onreadystatechange = new Function;
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
    function checkIfSuccess() {
        intervResetId = setInterval(function () {
                sendHeartBeat();
            },
            5000);
    }

    function sendHeartBeat() {
        var url = '/cgi-bin/aw_cam?cmd=QID&res=1';
        var xhr = null;
        xhr = myDOM.ajax.GetHttpRequest(url, DbgCallback2);
    }



    function DbgCallback2(xhr) {
        if (xhr.responseText == "OID:AW-UE160" || xhr.responseText == "OID:AW-UE100") {
            clearInterval(intervResetId);
            $("#dialog_setup").hide();
            jStrAlert(MSG_STATUS.mID_0077, NPTZ_WORDING.wID_0039, function () {
                window.location.href = '/admin/index.html';
            },false);
        }
    }


    function Reset(sType) {
        M.location = "/cgi-bin/initial";
    }

    return {
        build: build
    }
}