/**
 * @fileOverview ログイン後のMAIN画面：settingMaintenaceLogを定義
 *
 * @author Panasonic Corporation
 */

/**
 * カメラリスト領域制御クラスインスタンス
 * @type {CameraList}
 */

var settingMaintenaceLog = SettingMaintenaceLog();

/**
 * @constructor
 */
function SettingMaintenaceLog() {
    var _log_page = 0;
    var type = "";
    var maxlognum = 0;
    giCode = [];
    giNo = [];
    giDateTime = [];
    giOperationTime = [];
    giYear = [];
    giMonth = [];
    giDay = [];
    giHour = [];
    giMin = [];
    giSec = [];
    gsMsg = [];
    gsMsg2 = [];
    giPage = _log_page;

    /**
     * 構築フラグ
     * @type boolean
     */
    var buildSetupMaintenanceLogFlag = false;

    /**
     * labelオブジェクト
     * @type txtMaintenanceLogObject[]
     */
    var txtMaintenanceLogObject = [];
    /**
     * label定義(maintenance_log) : System log
     * @type number
     */
    var SETUP_MAINTENANCE_LOG_SYSTEM_LABEL = 0;

    /**
     * select[]
     * @type selectMaintenanceLogObject[]
     */
    var selectMaintenanceLogObject = [];
    /**
     * select定義(maintenance_log) : System log
     */
    var SETUP_MAINTENANCE_LOG_SYSTEM_SELECT = 0;

    /**
     * button[]
     * @type btnMaintenanceLogObject[]
     */
    var btnMaintenanceLogObject = [];
    /**
     * Maintenance log button : Execute
     */
    var SETUP_MAINTENANCE_LOG_EXECUTE_BUTTON = 0;
    var myScroll;

    /**
     * Maintenance_log画面構築処理
     */
    function buildSetupMaintenanceLog() {
        if (!buildSetupMaintenanceLogFlag) {
            buildSetupMaintenanceLogFlag = true;
            var setup_maintenance_log_labels = "setup_maintenance_log_labels";
            var setup_maintenance_log_form = "setup_maintenance_log_form";
            txtMaintenanceLogObject[SETUP_MAINTENANCE_LOG_SYSTEM_LABEL] = TextCtrl(setup_maintenance_log_labels, 'setup_maintenance_log_system_label', NPTZ_WORDING.wID_0399);
            selectMaintenanceLogObject[SETUP_MAINTENANCE_LOG_SYSTEM_SELECT] = SelectCtrl(setup_maintenance_log_form, "type_select", "", "setup_maintenance_log_system_select");
            btnMaintenanceLogObject[SETUP_MAINTENANCE_LOG_EXECUTE_BUTTON] = ButtonCtrl(setup_maintenance_log_form, "setup_maintenance_log_execute_button", NPTZ_WORDING.wID_0154, callbackMaintenanceLogExecute);

            for (var btn in btnMaintenanceLogObject) {
                btnMaintenanceLogObject[btn].show();
                btnMaintenanceLogObject[btn].displayOff();
            }
            for (var txt in txtMaintenanceLogObject) {
                txtMaintenanceLogObject[txt].show();
            }
            for (var select in selectMaintenanceLogObject) {
                selectMaintenanceLogObject[select].show();
                selectMaintenanceLogObject[select].displayOff();
            }
            setSetupMaintenanceLogValueToEle();
        } else {
            rebuildSetupMaintenanceLog();
        }
    }

    /**
     * Maintenance_log画面再構築処理
     */
    function rebuildSetupMaintenanceLog() {
        setSetupMaintenanceLogValueToEle();
    }

    function setSetupMaintenanceLogValueToEle() {
        $("#maintenanceLogtable").remove();
        $("#dialog_setup").show();
        setSetupMaintenanceLogValueToSelect();
        reloadSystemLog();
    }

    function setSetupMaintenanceLogValueToSelect() {
        let select_maintenance_log_value = [];
        let select_maintenance_log_text = [];
        select_maintenance_log_value.push(
            "eventlog",
            "errorlog",
            "errorlog2"
        );
        select_maintenance_log_text.push(
            "Event log",
            "Error log(1)",
            "Error log(2)"
        );
        selectMaintenanceLogObject[SETUP_MAINTENANCE_LOG_SYSTEM_SELECT].appendOptions(select_maintenance_log_value, select_maintenance_log_text);
    }

    function updateMaintenanceLogTableTitle() {
        if ($('#setup_maintenance_log_form_table').children('#maintenanceLogtableTitle').length != 0) {
            $('#setup_maintenance_log_form_table').children('#maintenanceLogtableTitle').remove();
        }
        // テーブル制御用変数
        var tabNode = document.createElement("table");
        tabNode.id = "maintenanceLogtableTitle";

        $('#setup_maintenance_log_form_table').append(tabNode);

        var row = tabNode.insertRow(0);
        var cell;
        if (type == "eventlog") {
            // No.
            cell = row.insertCell(-1);
            cell.innerHTML = 'No.';
            $(cell).css({
                width: '60px',
                align: 'center',
                background: 'rgb(70,70,71)',
            });
            // Date & Time
            cell = row.insertCell(-1);
            cell.innerHTML = 'Date & Time';
            $(cell).css({
                width: '290px',
                align: 'center',
                background: 'rgb(70,70,71)',
            });
            // Operation time
            cell = row.insertCell(-1);
            cell.innerHTML = 'Operation time';
            $(cell).css({
                width: '290px',
                align: 'center',
                background: 'rgb(70,70,71)',
            });
            // Event code
            cell = row.insertCell(-1);
            cell.innerHTML = 'Event code';
            $(cell).css({
                width: '198px',
                align: 'center',
                background: 'rgb(70,70,71)',
            });
            // Description
            cell = row.insertCell(-1);
            cell.innerHTML = 'Description';
            $(cell).css({
                width: '650px',
                background: 'rgb(70,70,71)',
            });
        } else {
            // No.
            cell = row.insertCell(-1);
            cell.innerHTML = 'No.';
            $(cell).css({
                width: '60px',
                align: 'center',
                background: 'rgb(70,70,71)',
            });
            // Date & Time
            cell = row.insertCell(-1);
            cell.innerHTML = 'Date & Time';
            $(cell).css({
                width: '290px',
                align: 'center',
                background: 'rgb(70,70,71)',
            });
            // Operation time
            cell = row.insertCell(-1);
            cell.innerHTML = 'Operation time';
            $(cell).css({
                width: '290px',
                align: 'center',
                background: 'rgb(70,70,71)',
            });
            // Error code
            cell = row.insertCell(-1);
            cell.innerHTML = 'Error code';
            $(cell).css({
                width: '198px',
                align: 'center',
                background: 'rgb(70,70,71)',
            });
            // Error description
            cell = row.insertCell(-1);
            cell.innerHTML = 'Error description';
            $(cell).css({
                width: '650px',
                background: 'rgb(70,70,71)',
            });
        }
    }

    function updateMaintenanceLogTable() {
        if(myScroll!=null){
            myScroll.destroy();
            myScroll = null;
        }
        var intNo = 0;
        // テーブル制御用変数
        var tabNode = document.createElement("table");
        tabNode.id = "maintenanceLogtable";

        $('#setup_maintenance_log_form_table_inner').append(tabNode);
        if(buildScrollSuccessFlg) {
            buildScrollSuccessFlg = false;
            setTimeout(function () {
                myScroll = new IScroll('#setup_maintenance_log_form_table_inner', {
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
            }, 100)
        }
        var row = tabNode.insertRow(0);
        var cell;

        for (var i = 0; (i < giNo.length) && (i < maxlognum); ++i) {
            intNo = intNo + 1;
            row = tabNode.insertRow(-1);
            // cell1
            cell = row.insertCell(-1);
            cell.innerHTML = giNo[i];
            $(cell).css({
                width:'60px',
                textAlign: 'center'
            });
            // cell2
            cell = row.insertCell(-1);
            cell.innerHTML = giDateTime[i];
            $(cell).css({
                width:'290px',
                textAlign: 'center'
            });
            // cell3
            cell = row.insertCell(-1);
            cell.innerHTML = giOperationTime[i];
            $(cell).css({
                width:'290px',
                textAlign: 'center'
            });
            // cell4
            cell = row.insertCell(-1);
            cell.innerHTML = giCode[i];
            $(cell).css({
                width:'198px',
                textAlign: 'center'
            });
            // cell5
            cell = row.insertCell(-1);
            cell.innerHTML = gsMsg[i];
            $(cell).css({
                width: '650px',
                marginLeft: '5px',
                textAlign: 'left'
            });
        }
    }


    function callbackMaintenanceLogExecute(mouse) {
        if (mouse == Button.MOUSE_UP) {
        } else if (mouse == Button.MOUSE_DOWN) {
            $("#maintenanceLogtable").remove();
            $("#dialog_setup").show();
            reloadSystemLog();
        } else {
            // 処理なし
        }
    }

    function reloadSystemLog() {
        // get type (errorlog or eventlog)
        type = document.getElementById("type_select").value;
        if (type == "eventlog" || type == "errorlog" || type == "errorlog2") {
            getSystemLog(type);
            loadSystemLog();
        } else {
            //Do Nothing
        }
    }

// get sysstem log
    function getSystemLog(type) {
        const url = "/cgi-bin/get_systemlog";
        let param = "";
        if (type == "eventlog") {
            param = "?" + "type=" + type + "&" + "num=1000" + "&" + "index=1";
        } else if (type == "errorlog") {
            param = "?" + "type=" + type + "&" + "num=100" + "&" + "index=1";
        }else{
            param = "?" + "type=" + type + "&" + "num=100" + "&" + "index=1";
        }
        // get sysstem log
        let ret = "";
        $.ajax({
            type: "get",
            timeout: 20*1000,
            url: url + param,
            async: true,
            success: function (data) {
                $("#dialog_setup").hide();
                ret = data;

                // init array
                initsyslogdata();
                try {
                    // save data
                    if (ret.length > 0) {
                        let resultArray = cparam_getRetArray(ret, "$");
                        // save data
                        for (let i = 0; i < resultArray.length; ++i) {
                            let tempdata = resultArray[i].split("\\");
                            if (tempdata.length >= 4) {
                                giNo[i] = encodeHTML(tempdata[0]);
                                giDateTime[i] = encodeHTML(tempdata[1]);
                                giOperationTime[i] = encodeHTML(tempdata[2]);
                                giCode[i] = encodeHTML(tempdata[3]);
                                gsMsg[i] = encodeHTML(tempdata[4]);
                            } else {
                                //Do Nothing
                            }
                        }
                    }
                } catch(e) {

                }
                updateMaintenanceLogTableTitle();
                updateMaintenanceLogTable();
            },
            error: function () {
                ret = "";
                $("#dialog_setup").hide();
            }
        });
    }

// initilize syslog data
    function initsyslogdata() {
        giNo = [];
        giDateTime = [];
        giOperationTime = [];
        giCode = [];
        gsMsg = [];
    }

// write syslog to page
    function loadSystemLog() {
        // set max log number
        if (type == "errorlog" || type == "errorlog2") {
            maxlognum = 100;
        } else {
            maxlognum = 1000;
        }
    }

//'>'を'&gt;', '<'を'&lt;'
    function encodeHTML(str) {
        var temp = str;
        temp = temp.replace('>', '&gt;');
        temp = temp.replace('<', '&lt;');
        return temp;
    }

    return {
        buildSetupMaintenanceLog: buildSetupMaintenanceLog
    }
}