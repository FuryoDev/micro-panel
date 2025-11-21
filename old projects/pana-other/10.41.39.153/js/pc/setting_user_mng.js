/**
 * @fileOverview Setup画面:usermng制御に関わる画面クラス
 *
 * @author Panasonic Corporation
 */

var settingusermng = settingUserMng();

/**
 * setup画面:usermng制御に関わる画面クラス
 * @class Settings画面:usermng制御に関わる画面クラス
 * @return {function} build 構築処理
 * @return {function} rebuild 再構築処理
 * @return {function} show 表示処理
 * @return {function} hide 非表示処理
 * @constructor
 */

function settingUserMng() {
    /**
     * div定義
     * @type string
     */
    var div = "camera_setup";
    /**
     * ボタンオブジェクト
     * @type btnObject[]
     */
    var txtObject = [];
    var TXT_SETTIND_USER_MENU_TITLE = 0;

    /**
     * ボタンオブジェクト
     * @type btnMenuObject[]
     */
    var btnMenuObject = [];
    /**
     *
     * @type {number}
     */
    var BTN_USER_STATUS = 0;
    var BTN_USER_MODE = 1;
    var BTN_USER_ADD = 2;
    var BTN_USER_DELETE = 3;

    /**
     * ボタンオブジェクト
     * @type userModeObject[]
     */
    var userModeObject = [];
    /**
     * ボタンオブジェクト
     * @type addUserObject[]
     */
    var addUserObject = [];
    /**
     *
     * @type {number}
     */
    var USER_MODE_USER_AUTH_TITLE = 0;
    var USER_MODE_AUTHENTICATION_TITLE = 1;
    var USER_MODE_HOST_AUTH_TITLE = 2;
    var HOST_USER_ADD_USER_IP = 3;
    var HOST_USER_ADD_ACCESS_LEV = 4;
    var USER_MODE_PRIORITY_STREAM = 5;
    var HOST_AUTH_SETTING = 6;
    var HOST_AUTH_SETTING_STATUS = 7;
    var HOST_AUTH_SETTING_IP = 8;
    var HOST_AUTH_SETTING_LEVEL = 9;
    var USER_MODE_WARNING_MESSAGE = 10;
    var USER_MODE_WAIT_TIME_TITLE=11;

    /**
     *
     * @type {number}
     */
    var TXT_ADD_USER_NAME = 0;
    var TXT_ADD_USER_PASSWORD = 1;
    var TXT_ADD_USER_PASSWORD_RETRY = 2;
    var TXT_ADD_USER_ACCESS_LEVEL = 3;
    /**
     * ボタンオブジェクト
     * @type btnObject[]
     */
    var btnObject = [];
    /**
     * btn_user_setボタンオブジェクト(インデックス値)
     *  @type object
     */
    var BTN_USER_SET = 0;
    /**
     * btn_reg_setボタンオブジェクト(インデックス値)
     *  @type object
     */
    var BTN_REG_SET = 1;
    /**
     * btn_user_delボタンオブジェクト(インデックス値)
     *  @type object
     */
    var BTN_HOST_USER = 2;
    /**
     * btn_user_delボタンオブジェクト(インデックス値)
     *  @type object
     */
    var BTN_HOST_ADD_HOST = 3;
    var userMenuChangeIndex = null;
    var gsAddrList = [];
    var gsLevelList = [];
    var radioModeButtonGroup = [];
    var selectObject = [];
    var USER_MODE_RADIO_USERAUTH = 0;
    var USER_MODE_RADIO_AUTHENTICATION = 1;
    var USER_MODE_RADIO_ACCESSLEVEL = 2;
    var USER_MODE_RADIO_HOSTAUTH = 3;
    var USER_MODE_ACCESS_LEVEL = 4;
    var USER_MODE_RADIO_WAITTIME = 5;

    var SELECT_STREAM_TYPE = 0;
    var gsHostList = "";
    var objRes;

    var txtUserUserMainTitle;
    /**
     * 構築済みフラグ
     * @type boolean
     */
    var buildFlag = false;

    /**
     * User設定画面構築処理
     */
    function build(type) {
        if (buildFlag == false) {
            buildFlag = true;
            var menu_div = "setting_user_mng_menu";
            txtObject[TXT_SETTIND_USER_MENU_TITLE] = TextCtrl(menu_div, 'text_setting_user_menu_title', NPTZ_WORDING.wID_0076);
            // main
            // main title
            txtUserUserMainTitle = TextCtrl('setting_user_mng_main_title', 'setting_user_mng_main_title_label', NPTZ_WORDING.wID_0077);
            txtUserUserMainTitle.show();
            btnMenuObject[BTN_USER_STATUS] = MenuButtonCtrl(menu_div, "btn_setting_user_status", NPTZ_WORDING.wID_0077, showStatusView, 0, MenuButtonType.SINGLE);
            btnMenuObject[BTN_USER_MODE] = MenuButtonCtrl(menu_div, "btn_setting_user_mode", NPTZ_WORDING.wID_0441, showModeView, 1, MenuButtonType.TOP);
            btnMenuObject[BTN_USER_ADD] = MenuButtonCtrl(menu_div, "btn_setting_user_add", NPTZ_WORDING.wID_0060, showAddView, 2, MenuButtonType.MIDDLE);
            btnMenuObject[BTN_USER_DELETE] = MenuButtonCtrl(menu_div, "btn_setting_user_delete", NPTZ_WORDING.wID_0442, showDeleteView, 4, MenuButtonType.BOTTOM);
            //Unser認証画面ボタン
            btnObject[BTN_USER_SET] = ButtonCtrl("setting_user_mode_form", "btn_user_set", NPTZ_WORDING.wID_0141, setUserMode);
            btnObject[BTN_REG_SET] = ButtonCtrl("setting_user_add_form", "btn_reg_set", NPTZ_WORDING.wID_0141, addUser);

            //userMode area
            userModeObject[USER_MODE_USER_AUTH_TITLE] = TextCtrl("setting_user_mode_label", "user_mode_user_auth_title", NPTZ_WORDING.wID_0076);
            userModeObject[USER_MODE_AUTHENTICATION_TITLE] = TextCtrl("setting_user_mode_label", "user_mode_user_authentication_title", NPTZ_WORDING.wID_0078);
            userModeObject[USER_MODE_WAIT_TIME_TITLE] = TextCtrl("setting_user_mode_label", "user_mode_user_wait_time_title", NPTZ_WORDING.wID_0913);
            userModeObject[USER_MODE_PRIORITY_STREAM] = TextCtrl("setting_user_mng_priority", "user_priority_stream", NPTZ_WORDING.wID_0071);

            //host user mode
            userModeObject[USER_MODE_HOST_AUTH_TITLE] = TextCtrl("setting_host_mode_label", "user_mode_user_auth_title", NPTZ_WORDING.wID_0079);
            userModeObject[HOST_USER_ADD_USER_IP] = TextCtrl("setting_host_add_label", "user_mode_user_auth_title", NPTZ_WORDING.wID_0080);
            userModeObject[HOST_USER_ADD_ACCESS_LEV] = TextCtrl("setting_host_add_label", "user_mode_user_authentication_title", NPTZ_WORDING.wID_0081);
            btnObject[BTN_HOST_USER] = ButtonCtrl("setting_host_mode_form", "btn_host_set", NPTZ_WORDING.wID_0141, setHostMode);
            btnObject[BTN_HOST_ADD_HOST] = ButtonCtrl("setting_host_add_form", "btn_host_reg", NPTZ_WORDING.wID_0141, addHost);

            //delete host;
            userModeObject[HOST_AUTH_SETTING] = TextCtrl("setting_host_status_form", "host_auth_setting", NPTZ_WORDING.wID_0079);

            userModeObject[HOST_AUTH_SETTING_STATUS] = TextCtrl("setting_host_status_form", "host_auth_setting_status", "");
            userModeObject[HOST_AUTH_SETTING_IP] = TextCtrl("setting_host_status_form", "host_auth_setting_status_ip", NPTZ_WORDING.wID_0082);
            userModeObject[HOST_AUTH_SETTING_LEVEL] = TextCtrl("setting_host_status_form", "host_auth_setting_status_level", NPTZ_WORDING.wID_0081);

            radioModeButtonGroup[USER_MODE_RADIO_USERAUTH] = RadioButtonGroupCtrl("setting_user_mode_form", "setup_user_mode_user_auth", RADIO_GROUP.rID_0001, 0, selectUserAuthRadioButton);
            radioModeButtonGroup[USER_MODE_RADIO_AUTHENTICATION] = RadioButtonGroupCtrl("setting_user_mode_form", "setup_user_mode_authentication", RADIO_GROUP.rID_0002, 0, selectAuthenticationRadioButton);
            radioModeButtonGroup[USER_MODE_RADIO_WAITTIME] = RadioButtonGroupCtrl("setting_user_mode_form", "setup_user_mode_wait_time", RADIO_GROUP.rID_0107, 0, selectWaitTimeRadioButton);
            radioModeButtonGroup[USER_MODE_RADIO_ACCESSLEVEL] = RadioButtonGroupCtrl("setting_user_add_form", "setup_user_mode_access_level", RADIO_GROUP.rID_0003, '1', selectAuthenticationRadioButton);
            radioModeButtonGroup[USER_MODE_RADIO_HOSTAUTH] = RadioButtonGroupCtrl("setting_host_mode_form", "setup_user_mode_host_auth", RADIO_GROUP.rID_0001, 0, selectUserAuthRadioButton);
            radioModeButtonGroup[USER_MODE_ACCESS_LEVEL] = RadioButtonGroupCtrl("setting_host_add_form", "setup_user_mode_host_auth_access_level", RADIO_GROUP.rID_0003, '2', selectUserAuthRadioButton);

            userModeObject[USER_MODE_WARNING_MESSAGE] = TextCtrl("setting_user_mode_form", "setup_user_mode_warning_message", MSG_STATUS.mID_0109);

            selectObject[SELECT_STREAM_TYPE] = SelectCtrl("setting_user_mng_priority", "setting_priority_stream_type", "", "setting_priority_stream_type");
            var select_priority_stream_type_value = [];
            var select_priority_stream_type_text = [];
            select_priority_stream_type_value.push(
                "0",
                "1",
                "2",
                "3",
                "4",
                "5",
                "6",
                "7",
                "8"
            );
            select_priority_stream_type_text.push(
                'JPEG(1)',
                'JPEG(2)',
                'JPEG(3)',
                'H.264(1)',
                'H.264(2)',
                'H.264(3)',
                'H.264(4)',
                'H.265'
            );
            selectObject[SELECT_STREAM_TYPE].appendOptions(select_priority_stream_type_value, select_priority_stream_type_text);

            for (var select in selectObject) {
                selectObject[select].show();
                selectObject[select].displayOff();
            }

            //add user area
            addUserObject[TXT_ADD_USER_NAME] = TextCtrl("setting_user_add_label", "txt_add_user_name", NPTZ_WORDING.wID_0061);
            addUserObject[TXT_ADD_USER_PASSWORD] = TextCtrl("setting_user_add_label", "txt_add_user_password", NPTZ_WORDING.wID_0062);
            addUserObject[TXT_ADD_USER_PASSWORD_RETRY] = TextCtrl("setting_user_add_label", "txt_add_user_repassword", NPTZ_WORDING.wID_0063);
            addUserObject[TXT_ADD_USER_ACCESS_LEVEL] = TextCtrl("setting_user_add_label", "txt_add_user_access_level", NPTZ_WORDING.wID_0081);
            
            $('#setting_user_mode_main').append($('<div class="modeDivInnerLine1"></div>'));
            $('#setting_user_mode_main').append($('<div class="modeDivInnerLine2"></div>'));
            $('#setting_user_add_main').append($('<div class="modeDivInnerLine3"></div>'));
            $('#setting_user_add_main').append($('<div class="modeDivInnerLine4"></div>'));
            $('#setting_user_add_main').append($('<div class="modeDivInnerLine5"></div>'));
            $('#setting_user_add_main').append($('<div class="modeDivInnerLine6"></div>'));
            $('#setting_host_mode_main').append($('<div class="modeDivInnerLine7"></div>'));
            $('#setting_host_add_main').append($('<div class="modeDivInnerLine8"></div>'));
            $('#setting_host_add_main').append($('<div class="modeDivInnerLine9"></div>'));

            for (var i = 0; i < addUserObject.length; i++) {
                addUserObject[i].show();
            }
            for (var i = 0; i < txtObject.length; i++) {
                txtObject[i].show();
            }
            for (var i = 0; i < userModeObject.length; i++) {
                userModeObject[i].show();
            }
            for (var i = 0; i < btnMenuObject.length; i++) {
                btnMenuObject[i].show();
                btnMenuObject[i].displayOff();
            }
            for (var i = 0; i < btnObject.length; i++) {
                btnObject[i].show();
                btnObject[i].displayOff();
            }
            $("setting_user_mng").show();
            InitThisPage(type);
        }else{
            rebuild(type);
        }
    }

    function rebuild(type){
        InitThisPage(type);
    }
    /**
     * settingUserMng画面の初期化
     * @type {settingUserMng}
     */
    function InitThisPage(type) {
        if(type == 10){
            userMenuChangeIndex = 0;
        }else if (type == 11){
            userMenuChangeIndex = 1;
        }else{

        }
        btnMenuObject[BTN_USER_STATUS].displayOn();
        showStatusView(Button.MOUSE_DOWN);
    }


    /**
     * select UserAuth Radio Button処理
     */
    function selectUserAuthRadioButton(mouse, whichButton) {
        if(mouse == 1 && radioModeButtonGroup[USER_MODE_RADIO_AUTHENTICATION].getSelectedValue() == 1){
            userModeObject[USER_MODE_WARNING_MESSAGE].hide();
        }else{
            userModeObject[USER_MODE_WARNING_MESSAGE].show();
        }
        // if (mouse == Button.MOUSE_DOWN) {
        //     if (whichButton == 1) {
        //     } else {
        //     }
        // }
    }

    /**
     * select Authentication Radio Button処理
     */
    function selectAuthenticationRadioButton(mouse, whichButton) {
        if(mouse == 1 && radioModeButtonGroup[USER_MODE_RADIO_USERAUTH].getSelectedValue() == 1){
            userModeObject[USER_MODE_WARNING_MESSAGE].hide();
        }else{
            userModeObject[USER_MODE_WARNING_MESSAGE].show();
        }
        // if (mouse == Button.MOUSE_DOWN) {
        // }
    }

    function selectWaitTimeRadioButton(mouse, whichButton){
        // if(mouse == 1 && radioModeButtonGroup[USER_MODE_RADIO_WAITTIME].getSelectedValue() == 1){
        //     userModeObject[USER_MODE_WARNING_MESSAGE].hide();
        // }else{
        //     userModeObject[USER_MODE_WARNING_MESSAGE].show();
        // }

    }

    function getRegHost()
    {
        var url="/cgi-bin/get_reg_host";
        var ret = cparam_sendRequest(url);
        var result = {};
        result.host="";
        result.host_addr=[];

        if(ret.length > 0){
            ret = cparam_getRetArray(ret);

            for(var i =0;i<ret.length;i++){
                // get host auth
                if(ret[i].indexOf('host=') == 0){
                    result.host=ret[i].substring('host='.length);
                }else{  //get host addr and level
                    var hostAddress = ret[i].split(/,|=/);
                    if(hostAddress.length >= 4){
                        result.host_addr.push(hostAddress[1]);
                        result.host_addr.push(hostAddress[3]);
                    }
                }
            }
        }
        return result;
    }

    function userAuthStatusCtrl(div, pUserAuthValue, pAuthenticationValue) {
        var userAuthTitleMain;
        var userAuthTitle;
        var authenticationTitle;
        var userAuthValueMain;
        var userAuthValue;
        var authenticationValue;
        var warningMessage;
        var warningMessageValue;
        function initDisplay() {
            if ((pUserAuthValue == "Off" && pAuthenticationValue == "Digest") ||
                (pUserAuthValue == "Off" && pAuthenticationValue == "Basic") ||
                (pUserAuthValue == "On" && pAuthenticationValue == "Basic")) {
                warningMessageValue = MSG_STATUS.mID_0109;
            } else {
                warningMessageValue = '';
            }
            $("#" + div).empty();
            $('#'+div).append('<div id = "setup_userMng_userAuth_status_userAuth_title_main"></div>');
            userAuthTitleMain = 'setup_userMng_userAuth_status_userAuth_title_main';
            userAuthTitle = TextCtrl(userAuthTitleMain, 'setup_userMng_userAuth_status_userAuth_title', NPTZ_WORDING.wID_0076);
            authenticationTitle = TextCtrl(userAuthTitleMain, 'setup_userMng_userAuth_status_authentication_title', NPTZ_WORDING.wID_0078);
            $('#'+div).append('<div id = "setup_userMng_userAuth_status_userAuth_value_main"></div>');
            userAuthValueMain = 'setup_userMng_userAuth_status_userAuth_value_main';
            userAuthValue = TextCtrl(userAuthValueMain, 'setup_userMng_userAuth_status_userAuth_value', pUserAuthValue);
            authenticationValue = TextCtrl(userAuthValueMain, 'setup_userMng_userAuth_status_authentication_value', pAuthenticationValue);
            warningMessage = TextCtrl(userAuthValueMain, 'setup_userMng_userAuth_status_warningMessage', warningMessageValue);
            warningMessage.show();
            userAuthTitle.show();
            authenticationTitle.show();
            userAuthValue.show();
            authenticationValue.show();
        }

        initDisplay();

        return {
            show: function () {
                $('#' + div).show()
            },
            hide: function () {
                $('#' + div).hide();
            },
            updateValues: function (pUserAuthValue, pAuthenticationValue) {
                userAuthValue.set(pUserAuthValue);
                authenticationValue.set(pAuthenticationValue);
            }
        };
    }


    function updateUserListTable(userListObj) {
        var intNo = 0;
        // テーブル制御用変数
        var tabNode = document.createElement("table");
        tabNode.id = "usertable";

        $(tabNode).css('position', "absolute");
        $(tabNode).css('border-collapse', "collapse");
        $('#setting_user_status_form').append(tabNode);

        for (var key in userListObj) {
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
            cell.innerHTML = key;
            $(cell).css("width", "170px");
            $(cell).css("font-size", "large");
            // Authentication Value
            cell = row.insertCell(-1);
            cell.innerHTML = userListObj[key] == 1 ? NPTZ_WORDING.wID_0450 : NPTZ_WORDING.wID_0451;
            $(cell).css("width", "1160px");
            $(cell).css("font-size", "large");
            $(cell).css("padding-left", "130px");
        }
        $('#usertable').css("margin-top","60");
        setTimeout(function(){
            var width = document.getElementById("usertable").rows[0].cells[1].offsetWidth;
            $(".setup_userMng_userAuth_status_userList_accessLevel_title").css("left",width+300+"px");
        },10)
    }

    function createUserListTableTitle(div) {
        var userListTitleMain;
        var userNoTitle;
        var userNameTitle;
        var userAccessLevelTitle;
        function initDisplay() {
            $('#'+div).append('<div id = "setup_userMng_userAuth_status_userList_title_main"></div>');
            userListTitleMain = 'setup_userMng_userAuth_status_userList_title_main';
            userNoTitle = TextCtrl(userListTitleMain, 'setup_userMng_userAuth_status_userList_no_title', '');
            userNameTitle = TextCtrl(userListTitleMain, 'setup_userMng_userAuth_status_userList_name_title', NPTZ_WORDING.wID_0061);
            userAccessLevelTitle = TextCtrl(userListTitleMain, 'setup_userMng_userAuth_status_userList_accessLevel_title', NPTZ_WORDING.wID_0081);
            userNoTitle.show();
            userNameTitle.show();
            userAccessLevelTitle.show();
        }

        initDisplay();

        return {
            show: function () {
                $('#' + div).show()
            },
            hide: function () {
                $('#' + div).hide();
            }
        };
    }

    function createHostListTableTitle(div) {
        var userListTitleMain;
        var userNoTitle;
        var userNameTitle;
        var userAccessLevelTitle;
        function initDisplay() {
            $('#'+div).append('<div id = "setup_userMng_hostAuth_status_hostList_title_main"></div>');
            userListTitleMain = 'setup_userMng_hostAuth_status_hostList_title_main';
            userNoTitle = TextCtrl(userListTitleMain, 'setup_userMng_hostAuth_status_hostList_no_title', '');
            userNameTitle = TextCtrl(userListTitleMain, 'setup_userMng_hostAuth_status_hostList_name_title', NPTZ_WORDING.wID_0082);
            userAccessLevelTitle = TextCtrl(userListTitleMain, 'setup_userMng_hostAuth_status_hostList_accessLevel_title', NPTZ_WORDING.wID_0081);
            userNoTitle.show();
            userNameTitle.show();
            userAccessLevelTitle.show();
        }
        initDisplay();
        return {
            show: function () {
                $('#' + div).show()
            },
            hide: function () {
                $('#' + div).hide();
            }
        };
    }

    function hostAuthStatusCtrl(div, pHostAuthValue) {
        var hostAuthTitleMain;
        var hostAuthTitle;
        var hostAuthValueMain;
        var hostAuthValue;
        function initDisplay() {
            $("#" + div).empty();
            $('#'+div).append('<div id = "setup_userMng_hostAuth_status_hostAuth_title_main"></div>');
            hostAuthTitleMain = 'setup_userMng_hostAuth_status_hostAuth_title_main';
            hostAuthTitle = TextCtrl(hostAuthTitleMain, 'setup_userMng_hostAuth_status_hostAuth_title', NPTZ_WORDING.wID_0079);
            $('#'+div).append('<div id = "setup_userMng_hostAuth_status_hostAuth_value_main"></div>');
            hostAuthValueMain = 'setup_userMng_hostAuth_status_hostAuth_value_main';
            hostAuthValue = TextCtrl(hostAuthValueMain, 'setup_userMng_hostAuth_status_hostAuth_value', pHostAuthValue);
            hostAuthTitle.show();
            hostAuthValue.show();
        }
        initDisplay();
        return {
            show: function () {
                $('#' + div).show()
            },
            hide: function () {
                $('#' + div).hide();
            },
            updateValues: function (pHostAuthValue) {
                hostAuthValue.set(pHostAuthValue);

            }
        };
    }

    function updateHostAuthStatusListTable(gsHostList) {
        var intNo = 0;
        // テーブル制御用変数
        var tabNode = document.createElement("table");
        tabNode.id = "hosttable";

        $('#setting_host_status_form').append(tabNode);

        $(tabNode).css('position', "absolute");
        $(tabNode).css('border-collapse', "collapse");

        var iIndex1, iIndex2;
        gsAddrList = [];
        gsLevelList = [];
        for ( iIndex1 = 0, iIndex2 = 0; iIndex2 < gsHostList.length; iIndex1++ , iIndex2 += 2 )
        {
            gsAddrList[ iIndex1 ] = gsHostList[ iIndex2 ];
            gsLevelList[ iIndex1 ] = gsHostList[ iIndex2 + 1 ];
        }
        var row;
        var cell;
        for (var i = 0; i<gsAddrList.length;i++) {
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
            cell.innerHTML = gsAddrList[i];
            $(cell).css("width", "260px");
            $(cell).css("padding-left", "40px");
            $(cell).css("font-size", "large");
            // Authentication Value
            cell = row.insertCell(-1);
            cell.innerHTML = gsLevelList[i] == 1 ? NPTZ_WORDING.wID_0450 : NPTZ_WORDING.wID_0451;
            $(cell).css("width", "1160px");
        }
        $('#hosttable').css("margin-top","60");
    }

    function showStatusView(mouse) {
        if (mouse == Button.MOUSE_DOWN) {
            if (userMenuChangeIndex == 0) {
                Platform.setFromWitchSetupUserMenu('status');
                txtUserUserMainTitle.set(NPTZ_WORDING.wID_0077);
                cparam_updateUser();
                var ret = getSettingStatus(cparams.userparams);
                userAuthStatusCtrl('setting_user_status_form', ret[0], ret[1]);
                cparam_cgi_user_ulist();
                createUserListTableTitle('setting_user_status_form');
                updateUserListTable(cparams.userlist);

                $("#setting_user_status_form").show();
                $("#setting_user_mode_main").hide();
                $("#setting_user_add_main").hide();
                $("#setting_user_delete_form").hide();
                $("#div_user_mng").hide();
            } else if (userMenuChangeIndex == 1) {
                Platform.setFromWitchSetupHostMenu('status');
                txtUserUserMainTitle.set(NPTZ_WORDING.wID_0077);
                objRes = getRegHost();
                if(objRes.hasOwnProperty("host")){
                    iHost = objRes.host;
                    gsHostList = objRes.host_addr;
                }
                if(iHost == 0 ){
                    hostAuthStatusCtrl('setting_host_status_form', "Off");
                }else{
                    hostAuthStatusCtrl('setting_host_status_form', "On");
                }
                createHostListTableTitle('setting_host_status_form');
                updateHostAuthStatusListTable(gsHostList);
                $("#setting_host_status_form").show();
                $("#setting_host_mode_main").hide();
                $("#setting_host_add_main").hide();
                $("#setting_host_delete_form").hide();
                $("#div_user_mng").hide();
            }
        }
    }

    function showModeView(mouse) {
        if (mouse == Button.MOUSE_DOWN) {
            if (userMenuChangeIndex == 0) {
                Platform.setFromWitchSetupUserMenu('mode');
                cparam_updateUser();
                var iUser = cparams.userauth;
                var AuthType = cparams.auth_type;
                var WaitType = cparams.auth_wait_time;
                radioModeButtonGroup[USER_MODE_RADIO_USERAUTH].setSelectedValue(iUser);
                radioModeButtonGroup[USER_MODE_RADIO_AUTHENTICATION].setSelectedValue(AuthType);
                radioModeButtonGroup[USER_MODE_RADIO_WAITTIME].setSelectedValue(WaitType);
                $("#setting_user_status_form").hide();
                $("#setting_user_mode_main").show();
                $("#setting_user_add_main").hide();
                $("#setting_user_delete_form").hide();
                $("#div_user_mng").show();
                txtUserUserMainTitle.set(NPTZ_WORDING.wID_0441)
                if (iUser == 1 && AuthType == 1) {
                    userModeObject[USER_MODE_WARNING_MESSAGE].hide();
                } else {
                    userModeObject[USER_MODE_WARNING_MESSAGE].show();
                }
            } else if (userMenuChangeIndex == 1) {
                Platform.setFromWitchSetupHostMenu('mode');
                objRes = getRegHost();
                if(objRes.hasOwnProperty("host")){
                    iHost = objRes.host;
                    gsHostList = objRes.host_addr;
                }
                radioModeButtonGroup[USER_MODE_RADIO_HOSTAUTH].setSelectedValue(iHost);
                $("#setting_host_status_form").hide();
                $("#setting_host_mode_main").show();
                $("#setting_host_add_main").hide();
                $("#setting_host_delete_form").hide();
                $("#div_user_mng").show();
                $("#setting_host_delete_form").hide();
                txtUserUserMainTitle.set(NPTZ_WORDING.wID_0441)
            }
        }
    }

    function showAddView(mouse) {
        if (mouse == Button.MOUSE_DOWN) {
            if (userMenuChangeIndex == 0) {
                Platform.setFromWitchSetupUserMenu('add');
                $("#setting_user_status_form").hide();
                $("#setting_user_mode_main").hide();
                $("#setting_user_add_main").show();
                $("#setting_user_delete_form").hide();
                $("#div_user_mng").show();
                txtUserUserMainTitle.set(NPTZ_WORDING.wID_0060)
            } else if (userMenuChangeIndex == 1) {
                Platform.setFromWitchSetupHostMenu('add');
                $("#setting_host_status_form").hide();
                $("#setting_host_mode_main").hide();
                $("#setting_host_add_main").show();
                $("#setting_host_delete_form").hide();
                $("#div_user_mng").show();
                $("#setting_host_delete_form").hide();
                txtUserUserMainTitle.set(NPTZ_WORDING.wID_0449);
            }
        }
    }

    function showDeleteView(mouse) {
        if (mouse == Button.MOUSE_DOWN) {
            if(userMenuChangeIndex == 0){
                Platform.setFromWitchSetupUserMenu('delete');
                $("#setting_user_status_form").hide();
                $("#setting_user_mode_main").hide();
                $("#setting_user_add_main").hide();
                $("#setting_user_delete_form").show();
                $("#div_user_mng").show();

                createUserDeleteTableTitle('setting_user_delete_form');
                cparam_cgi_user_ulist();
                deleteUserTable(cparams.userlist);
                txtUserUserMainTitle.set(NPTZ_WORDING.wID_0442)
            }else if (userMenuChangeIndex == 1) {
                Platform.setFromWitchSetupHostMenu('delete');
                $("#setting_host_status_form").hide();
                $("#setting_host_mode_main").hide();
                $("#setting_host_add_main").hide();
                $("#setting_host_delete_form").hide();
                $("#div_user_mng").show();
                $("#setting_host_delete_form").show();

                createHostDeleteTableTitle('setting_host_delete_form');

                var objRes = getRegHost();
                if(objRes.hasOwnProperty("host")){
                    iHost = objRes.host;
                    gsHostList = objRes.host_addr;
                }
                deleteHostTable(gsHostList);
                txtUserUserMainTitle.set("Delete host.")
            }

        }
    }
    function deleteHostTable(gsHostList) {
        var intNo = 0;
        // テーブル制御用変数
        var tabNode = document.createElement("table");
        tabNode.id = "deleteHosttable";
        $('#setting_host_delete_form').append(tabNode);
        $(tabNode).css('position', "absolute");
        $(tabNode).css('border-collapse', "collapse");
        var iIndex1, iIndex2;
        gsAddrList = [];
        gsLevelList = [];
        for ( iIndex1 = 0, iIndex2 = 0; iIndex2 < gsHostList.length; iIndex1++ , iIndex2 += 2 )
        {
            gsAddrList[ iIndex1 ] = gsHostList[ iIndex2 ];
            gsLevelList[ iIndex1 ] = gsHostList[ iIndex2 + 1 ];
        }
        var row;
        var cell;
        for (var i = 0; i<gsAddrList.length;i++) {
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
            cell.innerHTML = gsAddrList[i];
            $(cell).css("width", "260px");
            $(cell).css("padding-left", "40px");
            $(cell).css("font-size", "large");
            // Authentication Value
            cell = row.insertCell(-1);
            cell.innerHTML = gsLevelList[i] == 1 ? NPTZ_WORDING.wID_0450 : NPTZ_WORDING.wID_0451;
            $(cell).css("width", "400px");
            // Delete
            cell = row.insertCell(-1);
            cell.innerHTML = "<div id='delete_"+i+"' style='background-color:rgb(70, 70, 71);text-align: center;width:65px; 'onclick='settingusermng.deleteHostUser(this)'>Delete</div>";
            $(cell).css("width", "705px");
        }
        $('#deleteHosttable').css("margin-top","35px");
    }

    function createHostDeleteTableTitle(div) {
        var userListTitleMain;
        var userNoTitle;
        var userNameTitle;
        var userAccessLevelTitle;
        var userDeletelTitle;
        function initDisplay() {
            $("#" + div).empty();
            $('#'+div).append('<div id = "setup_userMng_userAuth_status_hostDelete_title_main"></div>');
            userListTitleMain = 'setup_userMng_userAuth_status_hostDelete_title_main';
            userNoTitle = TextCtrl(userListTitleMain, 'setup_userMng_userAuth_status_hostDelete_no_title', '');
            userNameTitle = TextCtrl(userListTitleMain, 'setup_userMng_userAuth_status_hostDelete_name_title', NPTZ_WORDING.wID_0080);
            userAccessLevelTitle = TextCtrl(userListTitleMain, 'setup_userMng_userAuth_status_hostDelete_accessLevel_title', NPTZ_WORDING.wID_0081);
            userDeletelTitle = TextCtrl(userListTitleMain, 'setup_userMng_userAuth_status_hostDelete_delete_title', '');
            userNoTitle.show();
            userNameTitle.show();
            userAccessLevelTitle.show();
        }

        initDisplay();

        return {
            show: function () {
                $('#' + div).show()
            },
            hide: function () {
                $('#' + div).hide();
            }
        };
    }

    function deleteHostUser(object){
        jConfirm(MSG_STATUS.mID_0063, NPTZ_WORDING.wID_0001,NPTZ_WORDING.wID_0002, function(confirm) {
            if(confirm) {
                var index = object.id.indexOf("_");
                var result = object.id.substr(index + 1,object.id.length);
                var ip = gsAddrList[result];
                $.ajax({
                    type: "post",
                    url: "/cgi-bin/del_host",
                    data: deleteHostIp(ip),
                    success: function (data) {
                        var objRes = getRegHost();
                        if(objRes.hasOwnProperty("host")){
                            iHost = objRes.host;
                            gsHostList = objRes.host_addr;
                        }
                        createHostDeleteTableTitle('setting_host_delete_form');
                        deleteHostTable(gsHostList);
                    },
                    error: function (jqXHR, textStatus, errorThrown) {
                    }
                });
            }
        });

    }
    function deleteHostIp(ip){
        var data = {};
        data['host_addr'] = ip;
        return data;
    }


    function deleteUserTable(userListObj) {
        var intNo = 0;
        // テーブル制御用変数
        var tabNode = document.createElement("table");
        tabNode.id = "deleteUsertable";

        $(tabNode).css('position', "absolute");
        $(tabNode).css('border-collapse', "collapse");

        $('#setting_user_delete_form').append(tabNode);
        var row;
        var cell;
        for (var key in userListObj) {
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
            cell.innerHTML = key;
            $(cell).css("width", "170px");
            $(cell).css("font-size", "large");
            // Authentication Value
            cell = row.insertCell(-1);
            cell.innerHTML = userListObj[key] == 1 ? NPTZ_WORDING.wID_0450 : NPTZ_WORDING.wID_0451;
            $(cell).css("width", "420px");
            $(cell).css("font-size", "large");
            $(cell).css("padding-left", "130px");
            cell = row.insertCell(-1);
            cell.innerHTML = "<div id='"+key+"' class = '"+userListObj[key]+"' style='background-color:rgb(70, 70, 71);text-align: center;width:65px; 'onclick='settingusermng.deleteUser(this)'>Delete</div>";
            $(cell).css("width", "605px");
        }
        $('#deleteUsertable').css("margin-top","40px");
        setTimeout(function(){
            var width = document.getElementById("deleteUsertable").rows[0].cells[1].offsetWidth;
            $(".setup_userMng_userAuth_status_userDelete_accessLevel_title").css("left",width+285+"px");
        },10)
    }

    function createUserDeleteTableTitle(div) {
        var userListTitleMain;
        var userNoTitle;
        var userNameTitle;
        var userAccessLevelTitle;
        var userDeletelTitle;
        function initDisplay() {
            $("#" + div).empty();
            $('#'+div).append('<div id = "setup_userMng_userAuth_status_userDelete_title_main"></div>');
            userListTitleMain = 'setup_userMng_userAuth_status_userDelete_title_main';
            userNoTitle = TextCtrl(userListTitleMain, 'setup_userMng_userAuth_status_userDelete_no_title', '');
            userNameTitle = TextCtrl(userListTitleMain, 'setup_userMng_userAuth_status_userDelete_name_title', NPTZ_WORDING.wID_0061);
            userAccessLevelTitle = TextCtrl(userListTitleMain, 'setup_userMng_userAuth_status_userDelete_accessLevel_title', NPTZ_WORDING.wID_0081);
            userDeletelTitle = TextCtrl(userListTitleMain, 'setup_userMng_userAuth_status_userDelete_delete_title', '');
            userNoTitle.show();
            userNameTitle.show();
            userAccessLevelTitle.show();
        }

        initDisplay();

        return {
            show: function () {
                $('#' + div).show()
            },
            hide: function () {
                $('#' + div).hide();
            }
        };
    }

    function getSettingStatus(retData) {
        if (retData.length > 0) {
            var params = eval("(" + retData + ")");
            cparams['defauth'] = params['defauth'];
            cparams['userauth'] = params['userauth'];
            cparams.auth_type = params['auth_type'];
            cparams.auth_wait_time = params['auth_wait_time'];
        }

        var retArr = [];
        if (cparams['userauth'] == 0) {
            retArr[0] = 'Off';
        } else {
            retArr[0] = 'On';
        }
        if ( cparams.auth_type == 0) {
            retArr[1] = 'Basic';
        } else {
            retArr[1] = 'Digest';
        }
        if ( cparams.auth_wait_time == 0) {
            retArr[2] = 'mode1';
        } else {
            retArr[2] = 'mode2';
        }

        return retArr;
    }
    function setUserMode(mouse) {
        if (mouse == Button.MOUSE_DOWN) {
            $("#dialog_setup").show();
            $.ajax({
                type: "post",
                url: "/cgi-bin/user.cgi",
                data: getModeUserData(),
                success: function (data) {
                    setTimeout(function(){
                        $("#dialog_setup").hide();
                    },500);
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    setTimeout(function(){
                        $("#dialog_setup").hide();
                    },500);
                }
            });
        }
    }

    function setHostMode(mouse){
        if (mouse == Button.MOUSE_DOWN) {
            objRes = getRegHost();
            if(Object.keys(objRes.host_addr).length == 0 && radioModeButtonGroup[USER_MODE_RADIO_HOSTAUTH].getSelectedValue() == 1 ){
                radioModeButtonGroup[USER_MODE_RADIO_HOSTAUTH].setSelectedValue(0);
                jAlert(MSG_STATUS.mid_0091, NPTZ_WORDING.wID_0039);
                return;
            }
            $("#dialog_setup").show();
            $.ajax({
                type: "post",
                url: "/cgi-bin/reg_host",
                data: getHostModeData(),
                success: function (data) {
                    setTimeout(function(){
                        $("#dialog_setup").hide();
                    },500);
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    setTimeout(function(){
                        $("#dialog_setup").hide();
                    },500);
                }
            });
        }
    }

    function getHostModeData(){
        var data = {};
        data['host'] = radioModeButtonGroup[USER_MODE_RADIO_HOSTAUTH].getSelectedValue();
        return data;
    }

    function addUser(mouse) {
        if (mouse == Button.MOUSE_DOWN) {
            // 入力チェック
            if (!checkWarning($("#user_password").val())) {    
                window.jConfirm(NPTZ_WORDING.wID_0064 + "\n" + NPTZ_WORDING.wID_0065 + "\n" + NPTZ_WORDING.wID_0066, NPTZ_WORDING.wID_0429, NPTZ_WORDING.wID_0040, function (confirm) {
                    if (confirm){
                        callbackRegContinue();
                    }else{
                        return;
                    }
                });
            } else {
                callbackRegContinue();
            }
        }
    }
    function checkWarning(password) {
        var regex = new RegExp("^(?![a-zA-Z]+$)(?![A-Z0-9]+$)(?![A-Z\\W_]+$)(?![a-z0-9]+$)(?![a-z\\W_]+$)(?![0-9\\W_]+$)[a-zA-Z0-9\\W_]{8,32}$");
        return regex.test(password);
    }
    function callbackRegContinue() {
        _cparam_cgi_user_ulist();
        setTimeout(function () {
            if (Object.keys(cparams.userlist).length > 8) {
                $("#dialog_setup").hide();
                jAlert(MSG_STATUS.mid_0090, NPTZ_WORDING.wID_0039);
                return;
            }
            $("#dialog_setup").show();
            var userName = $("#user_name").val();
            //対応#3509
            var password = $("#user_password").val();
            var repassword = $("#user_repassword").val();

            var err = 0; //add　対応＃3634
            var code;
            for (var i = 0; i < userName.length; i++) {
                code = userName.charCodeAt(i);
                if ((0x21 <= code && code <= 0x7e)) {
                    if (code == 0x22 || code == 0x26 || code == 0x3a ||
                        code == 0x3b || code == 0X3c || code == 0X3e ||
                        code == 0X5c || code == 0X7c) {
                        err++;
                    }
                }
                else err++;
            }
            // 文字以外を使用
            var checkRegx = /[^a-zA-Z0-9!$%'()*+,-.\/?@\[\]^_`~]/g;

            if (userName.length < 1 || password < 1 || repassword < 1) {
                $("#dialog_setup").hide();

                jAlert(MSG_STATUS.mID_0048, NPTZ_WORDING.wID_0039, function () {
                    return;
                });
            } else if (userName.match(checkRegx)) {
                //不具合管理 #6193 ユーザー登録アカウント画面のUser Nameに#が含まれていたら警告画面を表示するように対応をお願いいたします。
                $("#dialog_setup").hide();
                jAlert(MSG_STATUS.mID_0079, NPTZ_WORDING.wID_0039, function () {
                    return;
                });
            } else if (password != repassword) {
                $("#dialog_setup").hide();

                jAlert(MSG_STATUS.mID_0046, NPTZ_WORDING.wID_0039, function () {
                    return;
                });
            } else if (password.match(checkRegx)) {
                $("#dialog_setup").hide();
                jAlert(MSG_STATUS.mID_0009, NPTZ_WORDING.wID_0039, function () {
                    return;
                });
            } else if (err != 0) { //add　対応＃3634
                $("#dialog_setup").hide();

                jAlert(MSG_STATUS.mID_0050, NPTZ_WORDING.wID_0039, function () {
                    return;
                });
            } else if (password.length < 4 || repassword.length < 4) {
                $("#dialog_setup").hide();

                jAlert(MSG_STATUS.mID_0049, NPTZ_WORDING.wID_0039, function () {
                    return;
                });
            }
            else {
                $.ajax({
                    type: "post",
                    url: "/cgi-bin/user.cgi",
                    data: getAddUserData(),
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
        }, 500);

    }

    function addHost(mouse) {
        if (mouse == Button.MOUSE_DOWN) {
            $("#dialog_setup").show();
            var objIpAddr = ($("#host_add_ip").val() == '' || $("#host_add_ip").val() == null) ? ["", "", "", ""] :
                [$("#host_add_ip").val().split(".")[0],
                    $("#host_add_ip").val().split(".")[1],
                    $("#host_add_ip").val().split(".")[2],
                    $("#host_add_ip").val().split(".")[3]];

            if (!chknet_ServerHostAddress($("#host_add_ip").val())
                || (!chknet_CheckRangeHost(objIpAddr[0], objIpAddr[1], objIpAddr[2], objIpAddr[3]))) {
                $("#dialog_setup").hide();
                jAlert(MSG_STATUS.mID_0047, NPTZ_WORDING.wID_0039);
            }else{
                objRes = getRegHost();
                setTimeout(function(){
                    $("#dialog_setup").hide();
                    if(Object.keys(objRes.host_addr).length > 16){
                        jAlert(MSG_STATUS.mid_0090, NPTZ_WORDING.wID_0039);
                        return;
                    }


                    $.ajax({
                        type: "post",
                        url: "/cgi-bin/reg_host",
                        data: getAddHostData(),
                        success: function (data) {
                            setTimeout(function(){
                                $("#dialog_setup").hide();
                            },500);
                        },
                        error: function (jqXHR, textStatus, errorThrown) {
                        }
                    });
                },1000);
            }


        }
    }

    function deleteUser(object) {
        if(object.className == '1' && cparams.adminUserNum == 1){
            jAlert(MSG_STATUS.mID_0072, NPTZ_WORDING.wID_0039,function(){
                return;
            });
        }else{
            jConfirm(MSG_STATUS.mID_0064, NPTZ_WORDING.wID_0001,NPTZ_WORDING.wID_0002, function(confirm) {
                if(confirm){
                    var userName = object.parentNode.parentNode.children[1].innerHTML;
                    $.ajax({
                        type: "post",
                        url: "/cgi-bin/user.cgi",
                        data: deleteUserData(userName),
                        success: function (data) {
                            setTimeout(function () {
                                createUserDeleteTableTitle('setting_user_delete_form');
                                cparam_cgi_user_ulist();
                                deleteUserTable(cparams.userlist);
                            },1500);
                        },
                        error: function (jqXHR, textStatus, errorThrown) {
                            setTimeout(function () {
                                createUserDeleteTableTitle('setting_user_delete_form');
                                cparam_cgi_user_ulist();
                                deleteUserTable(cparams.userlist);
                            },1500);
                        }
                    });
                }
            });
        }

    }

    function deleteUserData(name){
        var data = {};
        data['delname'] = name;
        return data;
    }
    function getAddUserData() {
        var data = {};
        data['name'] = $("#user_name").val();
        data['password'] = $("#user_password").val();
        data['repassword'] = $("#user_repassword").val();
        data['access_level'] = radioModeButtonGroup[USER_MODE_RADIO_ACCESSLEVEL].getSelectedValue();
        return data;
    }
    function getAddHostData() {
        var data = {};
        data['host_addr'] = $("#host_add_ip").val();

        data['access_level'] = radioModeButtonGroup[USER_MODE_ACCESS_LEVEL].getSelectedValue();
        return data;
    }

    function getModeUserData() {
        var data = {};
        data['user'] = radioModeButtonGroup[USER_MODE_RADIO_USERAUTH].getSelectedValue();
        data['auth_type'] = radioModeButtonGroup[USER_MODE_RADIO_AUTHENTICATION].getSelectedValue();
        data['auth_wait_time']=radioModeButtonGroup[USER_MODE_RADIO_WAITTIME].getSelectedValue();
        return data;
    }

    /**
     * ExportSelectボタン押下時の画面表示切替処理
     */
    function callbackPriorityStream(mouse) {
        if (mouse == Button.MOUSE_DOWN) {
            $("#setting_basic").hide();
            $("#setting_image").hide();
            $("#setting_mulit").hide();
            $("#setting_network").hide();
            $("#setting_maintenance").hide();
            $("#setting_Situation").hide();

            $("#setting_user_mng_menu").hide();
            $("#div_user_mng").hide();

            $("#setting_user_mng_user").hide();
            $("#setting_user_mng_host").hide();
        }
    }

    /**
     * ImportSelectボタン押下時の画面表示切替処理
     */
    function callbackUserAuth(mouse) {
        if (mouse == Button.MOUSE_DOWN) {
            userMenuChangeIndex = 0;
            $("#setting_user_mng").show();
            $("#setting_basic").hide();
            $("#setting_image").hide();
            $("#setting_mulit").hide();
            $("#setting_network").hide();
            $("#setting_maintenance").hide();
            $("#setting_Situation").hide();
            $("#setting_user_mng_user").show();
            $("#setting_user_mng_host").hide();
            $("#div_user_mng").hide();
            $("#setting_user_mng_menu").show();
            txtObject[TXT_SETTIND_USER_MENU_TITLE].set(NPTZ_WORDING.wID_0076);
            btnMenuObject[BTN_USER_ADD].set("\&nbsp;\&nbsp;Add user.");
            btnMenuObject[BTN_USER_DELETE].set("\&nbsp;\&nbsp;Delete user.");
            switch (Platform.fromWitchSetupUserMenu()){
                case 'status':
                    btnMenuObject[BTN_USER_STATUS].displayOn();
                    showStatusView(Button.MOUSE_DOWN);
                    break;
                case 'mode':
                    btnMenuObject[BTN_USER_MODE].displayOn();
                    showModeView(Button.MOUSE_DOWN);
                    break;
                case 'add':
                    btnMenuObject[BTN_USER_ADD].displayOn();
                    showAddView(Button.MOUSE_DOWN);
                    break;
                case 'delete':
                    btnMenuObject[BTN_USER_DELETE].displayOn();
                    showDeleteView(Button.MOUSE_DOWN);
                default:
                    btnMenuObject[BTN_USER_STATUS].displayOn();
                    showStatusView(Button.MOUSE_DOWN);
            }
        }
    }

    /**
     * Executeボタン押下時の画面表示切替処理
     */
    function callbackHostAuth(mouse) {

        if (mouse == Button.MOUSE_DOWN) {
            userMenuChangeIndex = 1;
            $("#setting_user_mng").show();
            $("#setting_basic").hide();
            $("#setting_image").hide();
            $("#setting_mulit").hide();
            $("#setting_network").hide();
            $("#setting_maintenance").hide();
            $("#setting_Situation").hide();
            $("#div_user_mng").hide();

            $("#setting_user_mng_user").hide();
            $("#setting_user_mng_host").show();
            $("#setting_host_mode_main").hide();
            $("#setting_user_mng_menu").show();
            $("#setting_host_status_form").show();
            txtObject[TXT_SETTIND_USER_MENU_TITLE].set(NPTZ_WORDING.wID_0079);
            btnMenuObject[BTN_USER_ADD].set("\&nbsp;\&nbsp;Add host.");
            btnMenuObject[BTN_USER_DELETE].set("\&nbsp;\&nbsp;Delete host.");
            switch (Platform.fromWitchSetupHostMenu()){
                case 'status':
                    btnMenuObject[BTN_USER_STATUS].displayOn();
                    showStatusView(Button.MOUSE_DOWN);
                    break;
                case 'mode':
                    btnMenuObject[BTN_USER_MODE].displayOn();
                    showModeView(Button.MOUSE_DOWN);
                    break;
                case 'add':
                    btnMenuObject[BTN_USER_ADD].displayOn();
                    showAddView(Button.MOUSE_DOWN);
                    break;
                case 'delete':
                    btnMenuObject[BTN_USER_DELETE].displayOn();
                    showDeleteView(Button.MOUSE_DOWN);
                default:
                    btnMenuObject[BTN_USER_STATUS].displayOn();
                    showStatusView(Button.MOUSE_DOWN);
            }
        }
    }

    return {
        build: build,
        InitThisPage: InitThisPage,
        callbackUserAuth: function () {
            return callbackUserAuth(Button.MOUSE_DOWN);
        },
        callbackHostAuth: function () {
            return callbackHostAuth(Button.MOUSE_DOWN);
        },
        callbackPriorityStream: function () {
            return callbackPriorityStream(Button.MOUSE_DOWN);
        },
        deleteUser:deleteUser,
        deleteHostUser:deleteHostUser
    };
}