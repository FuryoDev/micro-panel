/**
 * @fileOverview 共通処理を定義
 *
 * @author Panasonic Corporation
 */

/**
 * プラットフォームのチェック、及びonload()時の画面制御をstartにより実行
 * @class プラットフォームのチェッククラス<br>
 * 起動元のプラットフォームを確認し、結果を返却する。
 * @constructor
 */
var Platform = (function () {
    /**
     * WebアプリInit
     */
    function startInit() {
        InitAllPage();
    }

    return {
        startInit: startInit,
        isTouchMode: function(){
            return sessionStorage.isTouchMode == 'true' ? true : false;
        },
        setIsTouchMode : function(value){
            sessionStorage.isTouchMode = value;
            sessionStorage.isHalfTouchMode = value;
        },
        isHalfTouchMode:function () {
            return sessionStorage.isHalfTouchMode == 'true' ? true : false;
        },
        setIsHalfTouchMode:function (value) {
            sessionStorage.isHalfTouchMode = value;
        },
        isSetupMode: function(){
            return sessionStorage.isSetupMode == 'true' ? true : false;
        },
        setIsSetupMode: function(value){
            sessionStorage.isSetupMode = value;
        },
        fromWitchSetupPage: function(){
            return sessionStorage.fromWitchSetupPage;
        },
        setFromWitchSetupPage: function(value){
            sessionStorage.fromWitchSetupPage = value;
        },
        fromWitchSetupUserMenu: function(){
            return sessionStorage.fromWitchSetupUserMenu;
        },
        setFromWitchSetupUserMenu: function(value){
            sessionStorage.fromWitchSetupUserMenu = value;
        },
        fromWitchSetupHostMenu: function(){
            return sessionStorage.fromWitchSetupHostMenu;
        },
        setFromWitchSetupHostMenu: function(value){
            sessionStorage.fromWitchSetupHostMenu = value;
        },
        currentPage: function(){
            return sessionStorage.currentPage;
        },
        setCurrentPage: function(value){
            sessionStorage.currentPage = value;
        },
        clearCurrentPage:function () {
            sessionStorage.currentPage = null;
        },
        hex2a: function (hexx) {
            var hex = hexx.toString();
            var str = '';
            for (var i = 0; i < hex.length; i += 2)
                if (hex.substr(i, 2) != "00") {
                    str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
                }

            return str;
        },
        a2hex: function (asciiString) {
            var retString = '';
            // for (let char of asciiString) { retString += char.charCodeAt(0).toString(16) }
            for (var i = 0; i < asciiString.length; i++) { retString += asciiString.charCodeAt(i).toString(16) }
            return retString;
        }
    };
})();
var controllerPosition = 1920;
/**
 * onload処理<br>
 * Platformクラスのstartを実行<br>
 */
function onloadNptz() {
    // jQuery.alertを動作させるために必要な処理
    jQuery.browser = {};
    (function () {
        jQuery.browser.msie = false;
        jQuery.browser.version = 0;
        if (navigator.userAgent.match(/MSIE ([0-9]+)\./)) {
            jQuery.browser.msie = true;
            jQuery.browser.version = RegExp.$1;
        }
    })();

    // 右クリック時のコンテキストメニュー禁止を追加(2015.10.22)
    $('body').on('contextmenu', function (e) {
        return false;
    });
    // メイン処理起動
    Platform.startInit();
}

/**
 * ボタン定義クラス
 * @class ボタン定義クラス
 * @return {number} STATUS_OFF 定義値:OFF状態
 * @return {number} STATUS_ON 定義値:ON状態
 * @return {number} STATUS_DISABLED 定義値:無効状態
 * @return {number} STATUS_OVER 定義値:OVER状態
 * @return {number} MOUSE_UP 定義値:マウスボタンUP
 * @return {number} MOUSE_DOWN 定義値:マウスボタンDOWN
 * @return {number} MOUSE_OVER 定義値:マウスボタンOVER
 * @return {number} MOUSE_OUT 定義値:マウスボタンOUT
 * @return {number} CLICK_LEFT 定義値:マウスクリック(左)
 * @return {number} CLICK_MIDDLE 定義値:マウスクリック(中央)
 * @return {number} CLICK_RIGHT 定義値:マウスクリック(右)
 */
var Button = (function () {
    return {
        STATUS_OFF: 0,
        STATUS_ON: 1,
        STATUS_DISABLED: 2,
        STATUS_OVER: 3,
        STATUS_ON_DISABLED: 4,
        MOUSE_UP: 0,
        MOUSE_DOWN: 1,
        MOUSE_OVER: 2,
        MOUSE_OUT: 3,
        CLICK_LEFT: 1,
        CLICK_MIDDLE: 2,
        CLICK_RIGHT: 3
    };
}());

/**
 * input定義クラス
 * @class input定義クラス
 * @type {{STATUS_OFF, STATUS_ON, STATUS_DISABLED, STATUS_OVER, STATUS_FOCUS, STATUS_BLUR}}
 */
var Input = (function () {
    return {
        STATUS_OFF: 0,
        STATUS_ON: 1,
        STATUS_DISABLED: 2,
        STATUS_OVER: 3,
        STATUS_FOCUS: 4,
        STATUS_BLUR: 5
    };
}());

/**
 * select定義クラス
 * @class select定義クラス
 * @type {{STATUS_OFF, STATUS_ON, STATUS_DISABLED, STATUS_OVER, STATUS_ONCHANGE}}
 */
var Select = (function () {
    return {
        STATUS_OFF: 0,
        STATUS_ON: 1,
        STATUS_DISABLED: 2,
        STATUS_OVER: 3,
        STATUS_ONCHANGE: 4
    };
}());
/**
 * MenuButtonType定義クラス
 * @class MenuButtonType定義クラス
 * @type {{SINGLE, TOP, MIDDLE, BOTTOM,TABLEFT,TABMIDDLE,TABRIGHT}}
 */
var MenuButtonType = (function () {
    return {
        SINGLE: 0,
        TOP: 1,
        MIDDLE: 2,
        BOTTOM: 3,
        TABLEFT: 4,
        TABMIDDLE: 5,
        TABRIGHT: 6
    };
}());
/**
 * SliderCtrl用データタイプ
 * @type {{DISPLAY_VALUE, CGI_VALUE}}
 */
var SliderData = (function () {
    return {
        DISPLAY_VALUE: 'displayValue',
        CGI_VALUE: 'cgiValue'
    };
}());
/**
 * ボタン制御クラス
 * @class ボタン制御クラス
 * @param {string} div 追加対象となる画面構成要素のID
 * @param {string} name CSSクラス名
 * @param {string} str ボタン内のテキスト文字
 * @param {function} callback コールバック関数
 * @param {object} param コールバック関数に対する引数(オプション)
 * @param {number} x 表示位置のX座標(オプション)
 * @param {number} y 表示位置のY座標(オプション)
 * @return {function} show ボタン表示
 * @return {function} hide ボタン非表示
 * @return {number} getStatus ボタン状態取得
 * @return {function} displayOn ボタン表示状態更新(ON)
 * @return {function} displayOff ボタン表示状態更新(OFF)
 * @return {function} displayDisabled ボタン表示状態更新(Disabled)
 * @return {function} displayOnHover ボタン表示状態更新(OnHover)
 * @return {function} displayOffHover ボタン表示状態更新(OffHover)
 * @return {function} val ボタン表示テキスト変更
 * @return {function} remove ボタン削除
 * @return {function} hoverDisable ボタンマウスオーバー表示禁止状態設定
 * @return {function} hoverEnable ボタンマウスオーバー表示許可状態設定
 * @return {function} set ボタン表示テキスト変更(Pタグ付)
 * @return {function} get ボタン表示テキスト取得
 * @constructor
 */
function ButtonCtrl(div, name, str, callback, param, x, y,divId) {
    /**
     * ボタンオブジェクト本体
     * @type object
     */
    let buttonObject;
    if(divId){
        buttonObject = $('<div id="' + divId + '" class="' + name + '"><p>' + str + '</p></div>');
    }else{
        buttonObject = $('<div class="' + name + '"><p>' + str + '</p></div>');
    }

    /**
     * ボタン状態
     * @type number
     */
    var buttonStatus = Button.STATUS_DISABLED;

    /**
     * 表示フラグ
     * @type boolean
     */
    var showFlag = false;

    /**
     * ボタンマウスオーバー表示禁止フラグ
     * @type boolean
     */
    var hoverDisableFlag = false;

    var touchFlag = true;

    if (x != undefined && y != undefined) {
        buttonObject.css({
            top: y + 'px',
            left: x + 'px'
        });
    }
    $('#' + div).append(buttonObject);
    buttonObject.hide();

    setEvent(callback, param);

    /**
     * 画面に表示するボタンの状態設定
     */
    function displayButton() {
        if (buttonStatus == Button.STATUS_OFF) {
            buttonObject.removeClass('on');
            buttonObject.removeClass('disable');
            buttonObject.removeClass('disable');
            buttonObject.removeClass('on_hover');
            buttonObject.addClass('off');
        } else if (buttonStatus == Button.STATUS_DISABLED) {
            buttonObject.removeClass('on');
            buttonObject.removeClass('off');
            buttonObject.removeClass('disable');
            buttonObject.removeClass('on_hover');
            buttonObject.addClass('disable');
        } else {
            buttonObject.removeClass('on');
            buttonObject.removeClass('disable');
            buttonObject.removeClass('disable');
            buttonObject.removeClass('on_hover');
            buttonObject.addClass('off');
        }
    }

    /**
     * ボタン押下時イベントハンドラ登録
     * @param {function} callback 発生イベントに対するコールバック
     * @param {object} param コールバックパラメータ
     */
    function setEvent(callback, param) {
        if (callback != null) {
            buttonObject.bind('touchstart', function () {
                // 無効表示の際には何もしない。
                if (buttonStatus == Button.STATUS_DISABLED || buttonStatus == Button.STATUS_ON_DISABLED) {
                    return;
                }
                touchFlag = false;
                // 左クリックのみ実行
                callback(Button.MOUSE_DOWN, param);
            });
            buttonObject.bind('touchend', function () {
                // 左クリックのみ実行
                callback(Button.MOUSE_UP, param);
            });
            buttonObject.mousedown(function (event) {
                if (!touchFlag) {
                    touchFlag = true;
                    return;
                }
                // 無効表示の際には何もしない。
                if (buttonStatus == Button.STATUS_DISABLED || buttonStatus == Button.STATUS_ON_DISABLED) {
                    return;
                }

                // 左クリックのみ実行
                if (event.which == Button.CLICK_LEFT) {
                    callback(Button.MOUSE_DOWN, param);
                }
            });
            buttonObject.mouseup(function (event) {
                if (buttonStatus == Button.STATUS_DISABLED || buttonStatus == Button.STATUS_ON_DISABLED) {
                    return;
                }
                // 左クリックのみ実行
                if (!touchFlag || isMobile) {
                    return;
                }

                if (event.which == Button.CLICK_LEFT) {
                    callback(Button.MOUSE_UP, param);
                    if (buttonStatus == Button.STATUS_ON) {
                        buttonObject.removeClass('off');
                        buttonObject.removeClass('disable');
                        buttonObject.removeClass('on');
                        buttonObject.removeClass('off_hover');
                        buttonObject.addClass('on_hover');
                    } else if (buttonStatus == Button.STATUS_OFF) {
                        buttonObject.removeClass('off');
                        buttonObject.removeClass('disable');
                        buttonObject.removeClass('on');
                        buttonObject.removeClass('on_hover');
                        buttonObject.addClass('off_hover');
                    }
                }
            });
        }
        buttonObject.mouseover(function () {
            if (hoverDisableFlag || isMobile) {
                return;
            }
            if (callback != null) {
                callback(Button.MOUSE_OVER, param);
            }
            if (buttonStatus == Button.STATUS_ON) {
                buttonObject.removeClass('off');
                buttonObject.removeClass('disable');
                buttonObject.removeClass('on');
                buttonObject.removeClass('off_hover');
                buttonObject.addClass('on_hover');
            } else if (buttonStatus == Button.STATUS_OFF) {
                buttonObject.removeClass('off');
                buttonObject.removeClass('disable');
                buttonObject.removeClass('on');
                buttonObject.removeClass('on_hover');
                buttonObject.addClass('off_hover');
            } else {
            }
        });
        buttonObject.mouseout(function () {
            if (hoverDisableFlag || isMobile) {
                return;
            }
            if (callback != null) {
                callback(Button.MOUSE_OUT, param);
            }
            if (buttonStatus == Button.STATUS_ON) {
                buttonObject.removeClass('off');
                buttonObject.removeClass('disable');
                buttonObject.removeClass('on_hover');
                buttonObject.removeClass('off_hover');
                buttonObject.addClass('on');
            } else if (buttonStatus == Button.STATUS_OFF) {
                buttonObject.removeClass('on');
                buttonObject.removeClass('disable');
                buttonObject.removeClass('on_hover');
                buttonObject.removeClass('off_hover');
                buttonObject.addClass('off');
            }
        });
    }

    return {
        show: function () {
            showFlag = true;
            displayButton();
            buttonObject.show();
        },
        hide: function () {
            buttonStatus = Button.STATUS_DISABLED;
            showFlag = false;
            buttonObject.removeClass('off');
            buttonObject.removeClass('disable');
            buttonObject.removeClass('on');
            buttonObject.removeClass('on_hover');
            buttonObject.removeClass('off_hover');
            buttonObject.hide();
        },
        getStatus: function () {
            return buttonStatus;
        },
        setStatus: function (Status) {
            buttonStatus = Status;
        },
        displayOn: function () {
            if (showFlag) {
                buttonStatus = Button.STATUS_ON;
                buttonObject.removeClass('off');
                buttonObject.removeClass('disable');
                buttonObject.removeClass('on_hover');
                buttonObject.removeClass('off_hover');
                buttonObject.addClass('on');
            }
        },
        displayOff: function () {
            if (showFlag) {
                buttonStatus = Button.STATUS_OFF;
                buttonObject.removeClass('on');
                buttonObject.removeClass('disable');
                buttonObject.removeClass('on_hover');
                buttonObject.removeClass('off_hover');
                buttonObject.addClass('off');
            }
        },
        displayDisabled: function () {
            if (showFlag) {
                buttonStatus = Button.STATUS_DISABLED;
                buttonObject.removeClass('on');
                buttonObject.removeClass('off');
                buttonObject.removeClass('on_hover');
                buttonObject.removeClass('off_hover');
                buttonObject.addClass('disable');
            }
        },
        displayOnHover: function () {
            if (showFlag) {
                buttonObject.removeClass('on');
                buttonObject.removeClass('off');
                buttonObject.removeClass('disable');
                buttonObject.removeClass('off_hover');
                buttonObject.addClass('on_hover');
            }
        },
        displayOffHover: function () {
            if (showFlag) {
                buttonObject.removeClass('on');
                buttonObject.removeClass('off');
                buttonObject.removeClass('disable');
                buttonObject.removeClass('on_hover');
                buttonObject.addClass('off_hover');
            }
        },
        val: function (value) {
            buttonObject.val(value);
        },
        remove: function () {
            buttonObject.remove();
        },
        hoverDisable: function () {
            hoverDisableFlag = true;
        },
        hoverEnable: function () {
            hoverDisableFlag = false;
        },
        set: function (str) {
            buttonObject[0].innerHTML = '<p>' + str + '</p>';
        },
        get: function () {
            return buttonObject[0].innerText;
        },
        getButtonObject: function () {
            return buttonObject;
        }
    };
}

function NewButtonCtrl(div, name, callback, param, x, y) {
    /**
     * ボタンオブジェクト本体
     * @type object
     */
    var buttonObject = $('<button class="' + name + '"></button>');

    /**
     * ボタン状態
     * @type number
     */
    var buttonStatus = Button.STATUS_DISABLED;

    /**
     * 表示フラグ
     * @type boolean
     */
    var showFlag = false;

    /**
     * ボタンマウスオーバー表示禁止フラグ
     * @type boolean
     */
    var hoverDisableFlag = false;

    var touchFlag = true;

    if (x != undefined && y != undefined) {
        buttonObject.css({
            top: y + 'px',
            left: x + 'px'
        });
    }
    $('#' + div).append(buttonObject);
    buttonObject.hide();

    setEvent(callback, param);

    /**
     * 画面に表示するボタンの状態設定
     */
    function displayButton() {
        if (buttonStatus == Button.STATUS_OFF) {
            buttonObject.removeClass('on');
            buttonObject.removeClass('disable');
            buttonObject.removeClass('disable');
            buttonObject.removeClass('on_hover');
            buttonObject.addClass('off');
        } else if (buttonStatus == Button.STATUS_DISABLED) {
            buttonObject.removeClass('on');
            buttonObject.removeClass('off');
            buttonObject.removeClass('disable');
            buttonObject.removeClass('on_hover');
            buttonObject.addClass('disable');
        } else {
            buttonObject.removeClass('on');
            buttonObject.removeClass('disable');
            buttonObject.removeClass('disable');
            buttonObject.removeClass('on_hover');
            buttonObject.addClass('off');
        }
    }

    /**
     * ボタン押下時イベントハンドラ登録
     * @param {function} callback 発生イベントに対するコールバック
     * @param {object} param コールバックパラメータ
     */
    function setEvent(callback, param) {
        if (callback != null) {

            buttonObject.click(function (event) {
                // 無効表示の際には何もしない。
                if (buttonStatus == Button.STATUS_DISABLED || buttonStatus == Button.STATUS_ON_DISABLED) {
                    return;
                }

                callback(Button.CLICK_LEFT, param);

                if (buttonStatus == Button.STATUS_ON) {
                    buttonObject.removeClass('off');
                    buttonObject.removeClass('disable');
                    buttonObject.removeClass('on');
                    buttonObject.removeClass('off_hover');
                    buttonObject.addClass('on_hover');
                } else if (buttonStatus == Button.STATUS_OFF) {
                    buttonObject.removeClass('off');
                    buttonObject.removeClass('disable');
                    buttonObject.removeClass('on');
                    buttonObject.removeClass('on_hover');
                    buttonObject.addClass('off_hover');
                }
            });
        }
        buttonObject.mouseover(function () {
            if (hoverDisableFlag) {
                return;
            }
            if (callback != null) {
                callback(Button.MOUSE_OVER, param);
            }
            if (buttonStatus == Button.STATUS_ON) {
                buttonObject.removeClass('off');
                buttonObject.removeClass('disable');
                buttonObject.removeClass('on');
                buttonObject.removeClass('off_hover');
                buttonObject.addClass('on_hover');
            } else if (buttonStatus == Button.STATUS_OFF) {
                buttonObject.removeClass('off');
                buttonObject.removeClass('disable');
                buttonObject.removeClass('on');
                buttonObject.removeClass('on_hover');
                buttonObject.addClass('off_hover');
            } else {
            }
        });
        buttonObject.mouseout(function () {
            if (hoverDisableFlag) {
                return;
            }
            if (callback != null) {
                callback(Button.MOUSE_OUT, param);
            }
            if (buttonStatus == Button.STATUS_ON) {
                buttonObject.removeClass('off');
                buttonObject.removeClass('disable');
                buttonObject.removeClass('on_hover');
                buttonObject.removeClass('off_hover');
                buttonObject.addClass('on');
            } else if (buttonStatus == Button.STATUS_OFF) {
                buttonObject.removeClass('on');
                buttonObject.removeClass('disable');
                buttonObject.removeClass('on_hover');
                buttonObject.removeClass('off_hover');
                buttonObject.addClass('off');
            }
        });
    }

    return {
        show: function () {
            showFlag = true;
            displayButton();
            buttonObject.show();
        },
        hide: function () {
            buttonStatus = Button.STATUS_DISABLED;
            showFlag = false;
            buttonObject.removeClass('off');
            buttonObject.removeClass('disable');
            buttonObject.removeClass('on');
            buttonObject.removeClass('on_hover');
            buttonObject.removeClass('off_hover');
            buttonObject.hide();
        },
        getStatus: function () {
            return buttonStatus;
        },
        setStatus: function (Status) {
            buttonStatus = Status;
        },
        displayOn: function () {
            if (showFlag) {
                buttonStatus = Button.STATUS_ON;
                buttonObject.removeClass('off');
                buttonObject.removeClass('disable');
                buttonObject.removeClass('on_hover');
                buttonObject.removeClass('off_hover');
                buttonObject.addClass('on');
            }
        },
        displayOff: function () {
            if (showFlag) {
                buttonStatus = Button.STATUS_OFF;
                buttonObject.removeClass('on');
                buttonObject.removeClass('disable');
                buttonObject.removeClass('on_hover');
                buttonObject.removeClass('off_hover');
                buttonObject.addClass('off');
            }
        },
        displayDisabled: function () {
            if (showFlag) {
                buttonStatus = Button.STATUS_DISABLED;
                buttonObject.removeClass('on');
                buttonObject.removeClass('off');
                buttonObject.removeClass('on_hover');
                buttonObject.removeClass('off_hover');
                buttonObject.addClass('disable');
            }
        },
        displayOnHover: function () {
            if (showFlag) {
                buttonObject.removeClass('on');
                buttonObject.removeClass('off');
                buttonObject.removeClass('disable');
                buttonObject.removeClass('off_hover');
                buttonObject.addClass('on_hover');
            }
        },
        displayOffHover: function () {
            if (showFlag) {
                buttonObject.removeClass('on');
                buttonObject.removeClass('off');
                buttonObject.removeClass('disable');
                buttonObject.removeClass('on_hover');
                buttonObject.addClass('off_hover');
            }
        },
        val: function (value) {
            buttonObject.val(value);
        },
        remove: function () {
            buttonObject.remove();
        },
        hoverDisable: function () {
            hoverDisableFlag = true;
        },
        hoverEnable: function () {
            hoverDisableFlag = false;
        },
        getButtonObject: function () {
            return buttonObject;
        }
    };
}

function RadioButtonCtrl(div, name, str, callback, param, x, y) {
    /**
     * ボタンオブジェクト本体
     * @type object
     */
    var buttonObject = $('<div class="' + name + '"><p>' + str + '</p></div>');

    /**
     * ボタン状態
     * @type number
     */
    var buttonStatus = Button.STATUS_DISABLED;

    /**
     * 表示フラグ
     * @type boolean
     */
    var showFlag = false;

    /**
     * ボタンマウスオーバー表示禁止フラグ
     * @type boolean
     */
    var hoverDisableFlag = false;

    var touchFlag = true;

    var touchMoveFlag = false;

    if (x != undefined && y != undefined) {
        buttonObject.css({
            top: y + 'px',
            left: x + 'px'
        });
    }
    $('#' + div).append(buttonObject);
    buttonObject.hide();

    setEvent(callback, param);

    /**
     * 画面に表示するボタンの状態設定
     */
    function displayButton() {
        if (buttonStatus == Button.STATUS_OFF) {
            buttonObject.removeClass('on');
            buttonObject.removeClass('disable');
            buttonObject.removeClass('disable');
            buttonObject.removeClass('on_hover');
            buttonObject.addClass('off');
        } else if (buttonStatus == Button.STATUS_DISABLED) {
            buttonObject.removeClass('on');
            buttonObject.removeClass('off');
            buttonObject.removeClass('disable');
            buttonObject.removeClass('on_hover');
            buttonObject.addClass('disable');
        } else {
            buttonObject.removeClass('on');
            buttonObject.removeClass('disable');
            buttonObject.removeClass('disable');
            buttonObject.removeClass('on_hover');
            buttonObject.addClass('off');
        }
    }

    /**
     * ボタン押下時イベントハンドラ登録
     * @param {function} callback 発生イベントに対するコールバック
     * @param {object} param コールバックパラメータ
     */
    function setEvent(callback, param) {
        if (callback != null) {
            buttonObject.bind('touchstart', function () {
                // 無効表示の際には何もしない。
                if (buttonStatus == Button.STATUS_DISABLED || buttonStatus == Button.STATUS_ON_DISABLED) {
                    return;
                }
                touchFlag = false;

            });
            buttonObject.bind('touchend', function () {
                if(!touchMoveFlag){
                    // 左クリックのみ実行
                    callback(Button.MOUSE_DOWN, param);
                }
                touchMoveFlag = false;
            });

            buttonObject.bind('touchmove', function () {

                touchMoveFlag = true;
            });
            buttonObject.mousedown(function (event) {
                if (!touchFlag) {
                    touchFlag = true;
                    return;
                }
                // 無効表示の際には何もしない。
                if (buttonStatus == Button.STATUS_DISABLED || buttonStatus == Button.STATUS_ON_DISABLED) {
                    return;
                }

                // 左クリックのみ実行
                if (event.which == Button.CLICK_LEFT) {
                    callback(Button.MOUSE_DOWN, param);
                }
            });
            buttonObject.mouseup(function (event) {
                // 左クリックのみ実行
                if (!touchFlag) {
                    return;
                }

                if (event.which == Button.CLICK_LEFT) {
                    callback(Button.MOUSE_UP, param);
                    if (buttonStatus == Button.STATUS_ON) {
                        buttonObject.removeClass('off');
                        buttonObject.removeClass('disable');
                        buttonObject.removeClass('on');
                        buttonObject.removeClass('off_hover');
                        buttonObject.addClass('on_hover');
                    } else if (buttonStatus == Button.STATUS_OFF) {
                        buttonObject.removeClass('off');
                        buttonObject.removeClass('disable');
                        buttonObject.removeClass('on');
                        buttonObject.removeClass('on_hover');
                        buttonObject.addClass('off_hover');
                    }
                }
            });
        }
        buttonObject.mouseover(function () {
            if (hoverDisableFlag) {
                return;
            }
            if (callback != null) {
                callback(Button.MOUSE_OVER, param);
            }
            if (buttonStatus == Button.STATUS_ON) {
                buttonObject.removeClass('off');
                buttonObject.removeClass('disable');
                buttonObject.removeClass('on');
                buttonObject.removeClass('off_hover');
                buttonObject.addClass('on_hover');
            } else if (buttonStatus == Button.STATUS_OFF) {
                buttonObject.removeClass('off');
                buttonObject.removeClass('disable');
                buttonObject.removeClass('on');
                buttonObject.removeClass('on_hover');
                buttonObject.addClass('off_hover');
            } else {
            }
        });
        buttonObject.mouseout(function () {
            if (hoverDisableFlag) {
                return;
            }
            if (callback != null) {
                callback(Button.MOUSE_OUT, param);
            }
            if (buttonStatus == Button.STATUS_ON) {
                buttonObject.removeClass('off');
                buttonObject.removeClass('disable');
                buttonObject.removeClass('on_hover');
                buttonObject.removeClass('off_hover');
                buttonObject.addClass('on');
            } else if (buttonStatus == Button.STATUS_OFF) {
                buttonObject.removeClass('on');
                buttonObject.removeClass('disable');
                buttonObject.removeClass('on_hover');
                buttonObject.removeClass('off_hover');
                buttonObject.addClass('off');
            }
        });
    }
    return {
        show: function () {
            showFlag = true;
            displayButton();
            buttonObject.show();
        },
        hide: function () {
            buttonStatus = Button.STATUS_DISABLED;
            showFlag = false;
            buttonObject.removeClass('off');
            buttonObject.removeClass('disable');
            buttonObject.removeClass('on');
            buttonObject.removeClass('on_hover');
            buttonObject.removeClass('off_hover');
            buttonObject.hide();
        },
        getStatus: function () {
            return buttonStatus;
        },
        setStatus: function (Status) {
            buttonStatus = Status;
        },
        displayOn: function () {
            if (showFlag) {
                buttonStatus = Button.STATUS_ON;
                buttonObject.removeClass('off');
                buttonObject.removeClass('disable');
                buttonObject.removeClass('on_hover');
                buttonObject.removeClass('off_hover');
                buttonObject.addClass('on');
            }
        },
        displayOff: function () {
            if (showFlag) {
                buttonStatus = Button.STATUS_OFF;
                buttonObject.removeClass('on');
                buttonObject.removeClass('disable');
                //buttonObject.removeClass('onDisable');
                buttonObject.removeClass('on_hover');
                buttonObject.removeClass('off_hover');
                buttonObject.addClass('off');
            }
        },
        displayDisabled: function () {
            if (showFlag) {
                buttonStatus = Button.STATUS_DISABLED;
                buttonObject.removeClass('on');
                buttonObject.removeClass('off');
                buttonObject.removeClass('on_hover');
                buttonObject.removeClass('off_hover');
                buttonObject.addClass('disable');
            }
        },
        displayOnHover: function () {
            if (showFlag) {
                buttonObject.removeClass('on');
                buttonObject.removeClass('off');
                buttonObject.removeClass('disable');
                buttonObject.removeClass('off_hover');
                buttonObject.addClass('on_hover');
            }
        },
        displayOffHover: function () {
            if (showFlag) {
                buttonObject.removeClass('on');
                buttonObject.removeClass('off');
                buttonObject.removeClass('disable');
                buttonObject.removeClass('on_hover');
                buttonObject.addClass('off_hover');
            }
        },
        val: function (value) {
            buttonObject.val(value);
        },
        remove: function () {
            buttonObject.remove();
        },
        hoverDisable: function () {
            hoverDisableFlag = true;
        },
        hoverEnable: function () {
            hoverDisableFlag = false;
        },
        set: function (str) {
            buttonObject[0].innerHTML = '<p>' + str + '</p>';
        },
        get: function () {
            return buttonObject[0].innerText;
        },
        getButtonObject: function () {
            return buttonObject;
        }
    };
}

/**
 * テキストエリア制御クラス
 * @class テキストエリア制御クラス
 * @param {string} div  追加対象となる画面構成要素のID
 * @param {string} name CSSクラス名称
 * @param {string} str  画面に表示する文字
 * @param {number} x    画面に表示する文字のx座標(オプション)
 * @param {number} y    画面に表示する文字のy座標(オプション)
 * @param {string} titleTxt マウスカーソル時のポップアップテキスト
 * @return {function} show 表示処理
 * @return {function} hide 非表示処理
 * @return {function} remove 除外処理
 * @return {function} set 表示する文字の変更処理
 * @return {function} setWithTitle 表示する文字の変更処理(タイトル付)
 * @constructor
 */
function TextCtrl(div, name, str, x, y, titleTxt) {
    /**
     * CSS設定対象ID
     * @type string
     */
    var dName = div;

    /**
     * CSSクラス名称
     * @type string
     */
    var pName = name;

    /**
     * 画面に表示する文字
     * @type string
     */
    var sStr = str;

    /**
     * 画面に表示する文字のx座標
     * @type number
     */
    var pX = x;

    /**
     * 画面に表示する文字のy座標
     * @type number
     */
    var pY = y;

    /**
     * マウスカーソル時のポップアップテキスト
     * @type string
     */
    var title = titleTxt;

    /**
     * テキストオブジェクト本体
     * @type object
     */
    var buttonObject = null;

    /**
     * 表示フラグ
     * @type boolean
     */
    var showFlag = false;

    /**
     * テキストボタンオブジェクト設定
     */
    function updateButton() {
        if (title) {
            buttonObject = $('<div class="' + pName + '" title="' + title + '"><p>' + sStr + '</p></div>');
        } else {
            buttonObject = $('<div class="' + pName + '"><p>' + sStr + '</p></div>');
        }
        if (pX != undefined && pY != undefined) {
            button.css({
                top: pY + 'px',
                left: pX + 'px'
            });
        }
        $('#' + dName).append(buttonObject);
    }

    updateButton();
    buttonObject.hide();

    return {
        show: function () {
            buttonObject.show();
            showFlag = true;
        },
        hide: function () {
            buttonObject.hide();
            showFlag = false;
        },
        remove: function () {
            buttonObject.remove();
            showFlag = false;
        },
        set: function (str) {
            if (buttonObject != null) {
                buttonObject.remove();
            }
            sStr = str;
            updateButton();
            if (!showFlag) {
                buttonObject.hide();
            }
        },
        setWithTitle: function (pStr, tStr) {
            if (buttonObject != null) {
                buttonObject.remove();
            }
            sStr = pStr;
            title = tStr;
            updateButton();
            if (!showFlag) {
                buttonObject.hide();
            }
        },
        getTextObject: function () {
            return buttonObject;
        }
    };
}
/**
 * radio button group 制御クラス
 * @class radio button group制御クラス
 * @param {string} div  追加対象となる画面構成要素のID
 * @param {string} prefix CSSクラスの前書き
 * @param {object} itemsObject  画面に表示する文字
 *    lable:value pair list
 * @param {string} defaultSelect
 * @param {function} callback
 * @return {function} getSelectedValue 選択された値
 * @constructor
 */
function RadioButtonGroupCtrl(div, prefix, itemsObject, defaultSelectValue, callback, param, addClassP) {
    /**
     * radio button objects
     * @type {{}}
     */
    var btnObjects = {};
    /**
     * テキストオブジェクト本体
     * @type object
     */
    var txtObj = {};

    /**
     * 表示フラグ
     * @type boolean
     */
    var showFlag = false;

    var addClass = '';

    if(addClassP){
        addClass = ' ' + addClassP;
    }

    function updateButton() {
        for (var key in itemsObject) {
            btnObjects[itemsObject[key]] = RadioButtonCtrl(div, prefix + key.replace(/[\/\s.\|]/gm, '_') + "_radio" + addClass, "", changeSelect, itemsObject[key]);
            btnObjects[itemsObject[key]].getButtonObject().addClass('radioButton');
            txtObj[itemsObject[key]] = TextCtrl(div, prefix + key.replace(/[\/\s.\|]/gm, '_') + "_label" + addClass, key);
            btnObjects[itemsObject[key]].show();
            if (itemsObject[key] == defaultSelectValue) {
                btnObjects[itemsObject[key]].displayOn();
            } else {
                btnObjects[itemsObject[key]].displayOff();
            }
            txtObj[itemsObject[key]].show();
        }
    }

    function changeSelect(mouse, whichButton) {
        if (mouse == Button.MOUSE_DOWN) {
            for (var key in btnObjects) {
                if (btnObjects[key].getStatus() != Button.STATUS_ON_DISABLED
                    && btnObjects[key].getStatus() != Button.STATUS_DISABLED) {
                    if (key == whichButton) {
                        btnObjects[key].displayOn();
                        callback(whichButton, mouse, param);
                    } else {
                        btnObjects[key].displayOff();
                    }
                }
                if(btnObjects[key].getStatus() == Button.STATUS_ON_DISABLED){
                    btnObjects[key].displayDisabled();
                    btnObjects[key].getButtonObject().removeClass('onDisable');
                    btnObjects[key].getButtonObject().addClass('disable');
                    btnObjects[key].setStatus(Button.STATUS_DISABLED);
                }
            }
        }
    }

    function changeSelect2(whichButton) {
        for (var key in btnObjects) {
            //btnObjects[key].displayOff();
            if (key == whichButton) {
                if (btnObjects[key].getStatus() == Button.STATUS_ON_DISABLED) {

                } else if (btnObjects[key].getStatus() == Button.STATUS_DISABLED) {
                    btnObjects[key].displayDisabled();
                    btnObjects[key].getButtonObject().removeClass('disable');
                    btnObjects[key].getButtonObject().addClass('onDisable');
                    btnObjects[key].setStatus(Button.STATUS_ON_DISABLED);
                } else {
                    btnObjects[key].displayOn();
                }
            } else {
                if (btnObjects[key].getStatus() == Button.STATUS_ON_DISABLED) {
                    btnObjects[key].displayDisabled();
                    btnObjects[key].getButtonObject().removeClass('onDisable');
                    btnObjects[key].getButtonObject().addClass('disable');
                    btnObjects[key].setStatus(Button.STATUS_DISABLED);
                } else if (btnObjects[key].getStatus() == Button.STATUS_DISABLED) {
                    btnObjects[key].displayDisabled();
                    btnObjects[key].getButtonObject().removeClass('onDisable');
                } else {
                    btnObjects[key].displayOff();
                }
            }
        }
    }

    function displayDisabled() {
        for (var key in btnObjects) {
            if (btnObjects[key].getStatus() == Button.STATUS_ON) {
                btnObjects[key].displayDisabled();
                btnObjects[key].getButtonObject().removeClass('disable');
                btnObjects[key].getButtonObject().addClass('onDisable');
                btnObjects[key].setStatus(Button.STATUS_ON_DISABLED);
            } else {
                if(btnObjects[key].getStatus() == Button.STATUS_ON_DISABLED){
                    return;
                }
                btnObjects[key].displayDisabled();
            }
        }
    }

    function displayOff() {
        for (var key in btnObjects) {
            if (btnObjects[key].getButtonObject().hasClass('onDisable')) {
                btnObjects[key].getButtonObject().removeClass('onDisable');
                btnObjects[key].displayOn();

            } else if (!btnObjects[key].getButtonObject().hasClass('on')&&!btnObjects[key].getButtonObject().hasClass('on_hover')) {//#5293
                btnObjects[key].displayOff();
            }
        }
    }

    function setDisable(items) {
        for (var key in btnObjects) {
            if (items.indexOf(key) != -1) {
                if (btnObjects[key].getStatus() == Button.STATUS_ON) {
                    btnObjects[key].displayDisabled();
                    btnObjects[key].getButtonObject().removeClass('disable');
                    btnObjects[key].getButtonObject().addClass('onDisable');
                    btnObjects[key].setStatus(Button.STATUS_ON_DISABLED);
                } else {
                    btnObjects[key].displayDisabled();
                }
            }
        }
    }

    function setEnable(items) {
        for (var key in btnObjects) {
            if (items.indexOf(key) != -1) {
                if (btnObjects[key].getButtonObject().hasClass('onDisable')) {
                    btnObjects[key].getButtonObject().removeClass('onDisable');
                    btnObjects[key].displayOn();
                } else if (!btnObjects[key].getButtonObject().hasClass('on')) {
                    btnObjects[key].displayOff();
                }
            }
        }
    }

    function aloneDisplayDisabled(index) {
        if (btnObjects[index].getStatus() == Button.STATUS_ON) {
            btnObjects[index].displayDisabled();
            btnObjects[index].getButtonObject().removeClass('disable');
            btnObjects[index].getButtonObject().addClass('onDisable');
            btnObjects[index].setStatus(Button.STATUS_ON_DISABLED);
        } else {
            btnObjects[index].displayDisabled();
        }
    }


    updateButton();

    return {
        setSelectedValue: function (value) {
            changeSelect2(value);
        },
        setSelectedValueWithCallBack: function (value) {
            changeSelect(Button.MOUSE_DOWN, value);
        },
        getSelectedValue: function () {
            for (var key in btnObjects) {
                if (btnObjects[key].getStatus() == Button.STATUS_ON || btnObjects[key].getStatus() == Button.STATUS_ON_DISABLED) {
                    return key;
                }
            }
        },
        getSelectedText: function () {
            for (var key in btnObjects) {
                if (btnObjects[key].getStatus() == Button.STATUS_ON || btnObjects[key].getStatus() == Button.STATUS_ON_DISABLED) {
                    return btnObjects[key].get();
                }
            }
        },
        displayDisabled: displayDisabled,
        displayOff: displayOff,
        isDisabled: function () {
            for (var key in btnObjects) {
                if (btnObjects[key].getStatus() == Button.STATUS_ON_DISABLED || btnObjects[key].getStatus() == Button.STATUS_DISABLED) {
                    return true;
                } else {
                    return false;
                }
            }
        },
        setDisable: function (items) {
            setDisable(items);
        },
        setEnable: function (items) {
            setEnable(items);
        },
        show: function () {
            showFlag = true;
            for (var key in btnObjects) {
                btnObjects[key].show();
            }

            for (var key in btnObjects) {
                txtObj[key].show();
            }
        },
        hide: function () {
            showFlag = false;

            for (var key in btnObjects) {
                btnObjects[key].hide();
            }
            for (var key in btnObjects) {
                txtObj[key].hide();
            }
        },
        aloneDisplayDisabled:aloneDisplayDisabled
    };
}

/**
 * メニューボタン制御クラス
 * @class メニューボタン制御クラス
 * @param {string} div 追加対象となる画面構成要素のID
 * @param {string} name CSSクラス名
 * @param {string} str ボタン内のテキスト文字
 * @param {function} callback コールバック関数
 * @param {object} param コールバック関数に対する引数(オプション)
 * @param {number} x 表示位置のX座標(オプション)
 * @param {number} y 表示位置のY座標(オプション)
 * @param {buttonType} ボタンのタイプ
 * @return {function} show ボタン表示
 * @return {function} hide ボタン非表示
 * @return {number} getStatus ボタン状態取得
 * @return {function} displayOn ボタン表示状態更新(ON)
 * @return {function} displayOff ボタン表示状態更新(OFF)
 * @return {function} displayDisabled ボタン表示状態更新(Disabled)
 * @return {function} displayOnHover ボタン表示状態更新(OnHover)
 * @return {function} displayOffHover ボタン表示状態更新(OffHover)
 * @return {function} val ボタン表示テキスト変更
 * @return {function} remove ボタン削除
 * @return {function} hoverDisable ボタンマウスオーバー表示禁止状態設定
 * @return {function} hoverEnable ボタンマウスオーバー表示許可状態設定
 * @return {function} set ボタン表示テキスト変更(Pタグ付)
 * @return {function} get ボタン表示テキスト取得
 * @constructor
 */
function MenuButtonCtrl(div, name, str, callback, param, buttonType, x, y) {
    /**
     * ボタンオブジェクト本体
     * @type object
     */
    var buttonObject = $('<div class="' + name + '"><p>' + str + '</p></div>');
    /**
     * lineオブジェクト本体
     * @type object
     */
    var LineObject = null;
    /**
     * 表示フラグ
     * @type boolean
     */
    var showFlag = false;

    var buttonStatus = Button.STATUS_DISABLED;

    /**
     * ボタンマウスオーバー表示禁止フラグ
     * @type boolean
     */
    var hoverDisableFlag = false;

    var touchFlag = true;

    var moveFlag = false;

    var touchMoveFlag = false;

    if (x != undefined && y != undefined) {
        buttonObject.css({
            top: y + 'px',
            left: x + 'px'
        });
    }
    $('#' + div).append(buttonObject);
    buttonObject.hide();

    function addLine() {
        var realNameArr, mainClass, mainClassaddClass;
        realNameArr = name.split(' ');
        mainClass = realNameArr[0];
        if (realNameArr.length > 1) {
            addClass = ' ' + realNameArr[1];
        } else {
            addClass = '';
        }
        LineObject = $('<div class = "MenuButtonDivideLine ' + mainClass + '_Line' + addClass + '"></div>');
        $('#' + div).append(LineObject);
    }

    updateButton();

    setEvent(callback, param);

    /**
     * テキストボタンオブジェクト設定
     */
    function updateButton() {
        switch (buttonType) {
            case MenuButtonType.SINGLE:
                buttonObject.addClass('setup_menu_single_btn_class');
                break;
            case MenuButtonType.TOP:
                buttonObject.addClass('setup_menu_top_btn_class');
                addLine();
                break;
            case MenuButtonType.MIDDLE:
                buttonObject.addClass('setup_menu_middle_btn_class');
                addLine();
                break;
            case MenuButtonType.BOTTOM:
                buttonObject.addClass('setup_menu_bottom_btn_class');
                break;
            case MenuButtonType.TABLEFT:
                buttonObject.addClass('setup_menu_tab_left_btn_class');
                break;
            case MenuButtonType.TABMIDDLE:
                buttonObject.addClass('setup_menu_tab_middle_btn_class');
                break;
            case MenuButtonType.TABRIGHT:
                buttonObject.addClass('setup_menu_tab_right_btn_class');
                break;
        }
        if (buttonType == MenuButtonType.TABLEFT
            || buttonType == MenuButtonType.TABMIDDLE
            || buttonType == MenuButtonType.TABRIGHT) {
            buttonObject.find('p').addClass('setup_tab_btn_P_common')
        } else {
            buttonObject.find('p').addClass('setup_menu_btn_P_common')
        }
    }

    //他のメニューボタン選択しないようにする。
    function lastOnToOff() {
        if(div == "setup_main_menu_other"){
            div = "setup_main_menu";
        }
        $("#" + div).find(".on").each(function () {
            $(this).removeClass('on');
            $(this).removeClass('disable');
            $(this).removeClass('on_hover');
            $(this).removeClass('off_hover');
            $(this).addClass('off');
        });
        $("#" + div).find(".on_hover").each(function () {
            $(this).removeClass('on');
            $(this).removeClass('disable');
            $(this).removeClass('on_hover');
            $(this).removeClass('off_hover');
            $(this).addClass('off');
        });
        buttonObject.removeClass('off');
        buttonObject.removeClass('disable');
        buttonObject.removeClass('on_hover');
        buttonObject.removeClass('off_hover');
        buttonObject.addClass('on');
        buttonStatus = Button.STATUS_ON

    }

    /**
     * ボタン押下時イベントハンドラ登録
     * @param {function} callback 発生イベントに対するコールバック
     * @param {object} param コールバックパラメータ
     */
    function setEvent(callback, param) {
        if (callback != null) {
            buttonObject.bind('touchstart', function () {
                // 無効表示の際には何もしない。
                if (buttonObject.hasClass('disable')) {
                    return;
                }
                touchMoveFlag = false;
                moveFlag = false;
            });
            buttonObject.bind('touchend', function () {
                if(touchMoveFlag)return;
                callback(Button.MOUSE_UP, param);
            });
            buttonObject.bind('touchmove', function () {
                touchMoveFlag = true;
            });
            buttonObject.mousedown(function (event) {
                if (!touchFlag) {
                    touchFlag = true;
                    return;
                }
                moveFlag = false;
            });
            buttonObject.mouseup(function (event) {
                // 左クリックのみ実行
                if (!touchFlag) {
                    return;
                }

                if(moveFlag)return;

                if (buttonObject.hasClass('disable')) {
                    return;
                }

                if (event.which == Button.CLICK_LEFT) {
                    lastOnToOff();
                    callback(Button.MOUSE_DOWN, param);

                    callback(Button.MOUSE_UP, param);
                    if (buttonObject.hasClass('on')) {
                        buttonObject.removeClass('off');
                        buttonObject.removeClass('disable');
                        buttonObject.removeClass('on');
                        buttonObject.removeClass('off_hover');
                        buttonObject.addClass('on_hover');
                    } else if (buttonObject.hasClass('off')) {
                        buttonObject.removeClass('off');
                        buttonObject.removeClass('disable');
                        buttonObject.removeClass('on');
                        buttonObject.removeClass('on_hover');
                        buttonObject.addClass('off_hover');
                    }
                }
            });
        }
        buttonObject.mouseover(function () {
            if (hoverDisableFlag) {
                return;
            }

            moveFlag = true;

            if (callback != null) {
                callback(Button.MOUSE_OVER, param);
            }
            if (buttonObject.hasClass('on')) {
                buttonObject.removeClass('off');
                buttonObject.removeClass('disable');
                buttonObject.removeClass('on');
                buttonObject.removeClass('off_hover');
                buttonObject.addClass('on_hover');
            } else if (buttonObject.hasClass('off')) {
                buttonObject.removeClass('off');
                buttonObject.removeClass('disable');
                buttonObject.removeClass('on');
                buttonObject.removeClass('on_hover');
                buttonObject.addClass('off_hover');
            } else {
            }
        });
        buttonObject.mouseout(function () {
            if (hoverDisableFlag) {
                return;
            }
            if (callback != null) {
                callback(Button.MOUSE_OUT, param);
            }
            if (buttonObject.hasClass('on_hover')) {
                buttonObject.removeClass('off');
                buttonObject.removeClass('disable');
                buttonObject.removeClass('on_hover');
                buttonObject.removeClass('off_hover');
                buttonObject.addClass('on');
            } else if (buttonObject.hasClass('off_hover')) {
                buttonObject.removeClass('on');
                buttonObject.removeClass('disable');
                buttonObject.removeClass('on_hover');
                buttonObject.removeClass('off_hover');
                buttonObject.addClass('off');
            }
        });
    }

    return {
        show: function () {
            showFlag = true;
            buttonObject.show();
            if (LineObject) {
                LineObject.show();
                LineObject.removeClass('disable');
            }
        },
        hide: function () {
            showFlag = false;
            buttonObject.removeClass('off');
            buttonObject.removeClass('disable');
            buttonObject.removeClass('on');
            buttonObject.removeClass('on_hover');
            buttonObject.removeClass('off_hover');
            buttonObject.hide();
            if (LineObject) {
                LineObject.hide();
                LineObject.removeClass('disable');
            }
        },
        setStatus: function (Status) {
            buttonStatus = Status;
        },
        getStatus: function () {
            return buttonStatus;
        },
        displayOn: function () {
            if (showFlag) {
                lastOnToOff();
                buttonObject.removeClass('off');
                buttonObject.removeClass('disable');
                buttonObject.removeClass('on_hover');
                buttonObject.removeClass('off_hover');
                buttonObject.addClass('on');
                if (LineObject) {
                    LineObject.removeClass('disable');
                }
            }
        },
        displayOff: function () {
            if (showFlag) {
                buttonObject.removeClass('on');
                buttonObject.removeClass('disable');
                buttonObject.removeClass('on_hover');
                buttonObject.removeClass('off_hover');
                buttonObject.addClass('off');
                if (LineObject) {
                    LineObject.removeClass('disable');
                }
            }
        },
        displayDisabled: function () {
            if (showFlag) {
                buttonObject.removeClass('on');
                buttonObject.removeClass('off');
                buttonObject.removeClass('on_hover');
                buttonObject.removeClass('off_hover');
                buttonObject.addClass('disable');
                if (LineObject) {
                    LineObject.addClass('disable');
                }
            }
        },
        displayOnHover: function () {
            if (showFlag) {
                buttonObject.removeClass('on');
                buttonObject.removeClass('off');
                buttonObject.removeClass('disable');
                buttonObject.removeClass('off_hover');
                buttonObject.addClass('on_hover');
                if (LineObject) {
                    LineObject.removeClass('disable');
                }
            }
        },
        displayOffHover: function () {
            if (showFlag) {
                buttonObject.removeClass('on');
                buttonObject.removeClass('off');
                buttonObject.removeClass('disable');
                buttonObject.removeClass('on_hover');
                buttonObject.addClass('off_hover');
                if (LineObject) {
                    LineObject.removeClass('disable');
                }
            }
        },
        val: function (value) {
            buttonObject.val(value);
        },
        remove: function () {
            buttonObject.remove();
        },
        hoverDisable: function () {
            hoverDisableFlag = true;
        },
        hoverEnable: function () {
            hoverDisableFlag = false;
        },
        set: function (str) {
            buttonObject[0].innerHTML = '<p>' + str + '</p>';
        },
        get: function () {
            return buttonObject[0].innerText;
        },
        getButtonObject: function () {
            return buttonObject;
        }
    };
}

/**
 * <input>制御クラス
 * @constructor
 */
function InputCtrl(div, id, name, className, str, callback, param, x, y, inMaxlength) {
    /**
     * inputオブジェクト本体
     * @type object
     */
    var InputObject = $('<input type="text" id="' + id + '" name="' + name + '" class="' + className + '" value="' + str + '" maxlength="' + inMaxlength + '" autocomplete="off"/>');

    /**
     * input状態
     * @type number
     */
    var InputStatus = Input.STATUS_DISABLED;

    /**
     * 表示フラグ
     * @type boolean
     */
    var showFlag = false;

    /**
     * inputマウスオーバー表示禁止フラグ
     * @type boolean
     */
    var hoverDisableFlag = false;

    var touchFlag = true;

    if (x != undefined && y != undefined) {
        InputObject.css({
            top: y + 'px',
            left: x + 'px'
        });
    }
    $('#' + div).append(InputObject);
    InputObject.hide();
    if(callback == ''){
        callback = null;
    }
    setEvent(callback, param);

    /**
     * 画面に表示するボタンの状態設定
     */
    function displayInput() {
        if (InputStatus == Input.STATUS_OFF) {
            InputObject.removeClass('on');
            InputObject.removeClass('disable');
            InputObject.removeClass('disable');
            InputObject.removeClass('on_hover');
            InputObject.addClass('off');
        } else if (InputStatus == Input.STATUS_DISABLED) {
            InputObject.removeClass('on');
            InputObject.removeClass('off');
            InputObject.removeClass('disable');
            InputObject.removeClass('on_hover');
            InputObject.addClass('disable');
        } else {
            InputObject.removeClass('on');
            InputObject.removeClass('disable');
            InputObject.removeClass('disable');
            InputObject.removeClass('on_hover');
            InputObject.addClass('off');
        }
    }

    /**
     * ボタン押下時イベントハンドラ登録
     * @param {function} callback 発生イベントに対するコールバック
     * @param {object} param コールバックパラメータ
     */
    function setEvent(callback, param) {
        if (callback != null) {
            InputObject.bind('touchstart', function () {
                // 無効表示の際には何もしない。
                if (InputStatus == Input.STATUS_DISABLED) {
                    return;
                }
                touchFlag = false;
                // 左クリックのみ実行
                callback(Input.STATUS_FOCUS, param);
            });
            InputObject.bind('touchend', function () {
                // 左クリックのみ実行
                callback(Input.STATUS_BLUR, param);
            });
            InputObject.mousedown(function (event) {
                if (!touchFlag) {
                    touchFlag = true;
                    return;
                }
                // 無効表示の際には何もしない。
                if (InputStatus == Button.STATUS_DISABLED) {
                    return;
                }
            });
        }
        InputObject.mouseover(function () {
            if (hoverDisableFlag) {
                return;
            }
            if (callback != null) {
                callback(Button.MOUSE_OVER, param);
            }
            if (InputStatus == Input.STATUS_ON) {
                InputObject.removeClass('off');
                InputObject.removeClass('disable');
                InputObject.removeClass('on');
                InputObject.removeClass('off_hover');
                InputObject.addClass('on_hover');
            } else if (InputStatus == Input.STATUS_OFF) {
                InputObject.removeClass('off');
                InputObject.removeClass('disable');
                InputObject.removeClass('on');
                InputObject.removeClass('on_hover');
                InputObject.addClass('off_hover');
            } else {
            }
        });
        InputObject.focus(function () {
            if (hoverDisableFlag) {
                return;
            }
            if (callback != null) {
                callback(Input.STATUS_BLUR, param);
            }
            if (InputStatus == Input.STATUS_ON) {
                InputObject.removeClass('off');
                InputObject.removeClass('disable');
                InputObject.removeClass('on_hover');
                InputObject.removeClass('off_hover');
                InputObject.addClass('on');
            } else if (InputStatus == Input.STATUS_OFF) {
                InputObject.removeClass('on');
                InputObject.removeClass('disable');
                InputObject.removeClass('on_hover');
                InputObject.removeClass('off_hover');
                InputObject.addClass('off');
            }
        });
    }

    return {
        show: function () {
            showFlag = true;
            displayInput();
            InputObject.show();
        },
        hide: function () {
            InputStatus = Input.STATUS_DISABLED;
            showFlag = false;
            InputObject.removeClass('off');
            InputObject.removeClass('disable');
            InputObject.removeClass('on');
            InputObject.removeClass('on_hover');
            InputObject.removeClass('off_hover');
            InputObject.hide();
        },
        getStatus: function () {
            return InputObject;
        },
        displayOn: function () {
            if (showFlag) {
                InputStatus = Input.STATUS_ON;
                InputObject.removeClass('off');
                InputObject.removeClass('disable');
                InputObject.removeClass('on_hover');
                InputObject.removeClass('off_hover');
                InputObject.addClass('on');
                InputObject.removeAttr("disabled");
            }
        },
        displayOff: function () {
            if (showFlag) {
                InputStatus = Input.STATUS_OFF;
                InputObject.removeClass('on');
                InputObject.removeClass('disable');
                InputObject.removeClass('on_hover');
                InputObject.removeClass('off_hover');
                InputObject.addClass('off');
                InputObject.removeAttr("disabled");
            }
        },
        displayDisabled: function () {
            if (showFlag) {
                InputStatus = Input.STATUS_DISABLED;
                InputObject.removeClass('on');
                InputObject.removeClass('off');
                InputObject.removeClass('on_hover');
                InputObject.removeClass('off_hover');
                InputObject.addClass('disable');
                InputObject.attr("disabled", "disabled");
            }
        },
        displayOnHover: function () {
            if (showFlag) {
                InputObject.removeClass('on');
                InputObject.removeClass('off');
                InputObject.removeClass('disable');
                InputObject.removeClass('off_hover');
                InputObject.addClass('on_hover');
                InputObject.removeAttr("disabled");
            }
        },
        displayOffHover: function () {
            if (showFlag) {
                InputObject.removeClass('on');
                InputObject.removeClass('off');
                InputObject.removeClass('disable');
                InputObject.removeClass('on_hover');
                InputObject.addClass('off_hover');
                InputObject.removeAttr("disabled");
            }
        },
        val: function (value) {
            InputObject.val(value);
        },
        remove: function () {
            InputObject.remove();
        },
        hoverDisable: function () {
            hoverDisableFlag = true;
        },
        hoverEnable: function () {
            hoverDisableFlag = false;
        },
        set: function (str) {
            InputObject.val(str);
        },
        get: function () {
            return InputObject.val();
        },
        getStatus: function () {
            return InputStatus;
        },
        getInputObject: function () {
            return InputObject;
        }
    };
}

/**
 * <select>制御クラス
 * @constructor
 */
function SelectCtrl(div, id, name, className, callback, param, itemsObject, defaultSelect, x, y) {
    /**
     * selectオブジェクト本体
     * @type object
     */
    let SelectObject = $('<select id="' + id + '" name="' + name + '" class="' + className + '"></select>');

    /**
     * select状態
     * @type number
     */
    let SelectStatus = Select.STATUS_DISABLED;

    /**
     * 表示フラグ
     * @type boolean
     */
    let showFlag = false;

    /**
     * selectマウスオーバー表示禁止フラグ
     * @type boolean
     */
    let hoverDisableFlag = false;

    let touchFlag = true;

    var selectObject = itemsObject;

    if (x != undefined && y != undefined) {
        SelectObject.css({
            top: y + 'px',
            left: x + 'px'
        });
    }
    $('#' + div).append(SelectObject);
    SelectObject.hide();

    setEvent(callback, param);

    setOptions(itemsObject);

    function setOptions(itemsObj) {
        if (itemsObj) {
            let index = 0;
            let selectIndex = 0;
            let optionValue = [];
            let optionText = [];
            for (let key in itemsObj) {
                index = index + 1;
                optionValue.push(itemsObj[key]);
                optionText.push(key);
                if (itemsObj[key] == defaultSelect) {
                    selectIndex = index;
                }
            }
            appendOptions(optionValue, optionText, selectIndex);
        }
    };

    function hideOptions(itemsObj,selectObject,mode) {
        if (selectObject) {
            let index = 0;
            let selectIndex = 0;
            let optionValue = [];
            let optionText = [];
            let flg = false;
            let value= ""
            for (let key in selectObject) {
                index = index + 1;
                for (let num in itemsObj) {
                    if(itemsObj[num] == selectObject[key]){
                        flg = true;
                        index = index - 1;
                    }
                }
                if(!flg){
                    optionValue.push(key);
                    optionText.push(selectObject[key]);
                }
                flg = false;
                if (key == mode) {
                    selectIndex = optionText.indexOf(mode);
                }
            }
            appendOptions(optionText, optionValue, selectIndex+1);
        }
    };

    /**
     * 画面に表示するボタンの状態設定
     */
    function displaySelect() {
        if (SelectStatus == Select.STATUS_OFF) {
            SelectObject.removeClass('on');
            SelectObject.removeClass('disable');
            SelectObject.removeClass('disable');
            SelectObject.removeClass('on_hover');
            SelectObject.addClass('off');
            SelectObject.disabled = false;
        } else if (SelectStatus == Select.STATUS_DISABLED) {
            SelectObject.removeClass('on');
            SelectObject.removeClass('off');
            SelectObject.removeClass('disable');
            SelectObject.removeClass('on_hover');
            SelectObject.addClass('disable');
            SelectObject.disabled = false;
        } else {
            SelectObject.removeClass('on');
            SelectObject.removeClass('disable');
            SelectObject.removeClass('disable');
            SelectObject.removeClass('on_hover');
            SelectObject.addClass('off');
            SelectObject.disabled = false;
        }
    }

    /**
     * ボタン押下時イベントハンドラ登録
     * @param {function} callback 発生イベントに対するコールバック
     * @param {object} param コールバックパラメータ
     */
    function setEvent(callback, param) {
        if (callback) {
            SelectObject.change(function () {
                callback(Select.STATUS_ONCHANGE, param);
            });
        }
    }

    /**
     * create options append to SelectObject
     * @param optionValue
     * @param optionText
     * @param selectIndex
     */
    function appendOptions(optionValue, optionText, selectIndex) {
        SelectObject.empty();
        if (optionValue == null || optionValue.length == 0 || optionValue == []) {
            for (var i = 0; i < optionText.length; i++) {
                if (selectIndex && selectIndex <= optionText.length && selectIndex == i + 1) {
                    SelectObject.append('<option value="' + i + 1 + '" selected="selected">' + optionText[i] + '</option>');
                } else {
                    SelectObject.append('<option value="' + i + 1 + '">' + optionText[i] + '</option>');
                }
            }
        } else {
            for (var i = 0; i < optionValue.length; i++) {
                if (selectIndex && selectIndex <= optionValue.length && selectIndex == i + 1) {
                    SelectObject.append('<option value="' + optionValue[i] + '" selected="selected">' + optionText[i] + '</option>');
                } else {
                    SelectObject.append('<option value="' + optionValue[i] + '">' + optionText[i] + '</option>');
                }
            }
        }
    }

    return {
        show: function () {
            showFlag = true;
            displaySelect();
            SelectObject.show();
        },
        hide: function () {
            SelectStatus = Select.STATUS_DISABLED;
            showFlag = false;
            SelectObject.removeClass('off');
            SelectObject.removeClass('disable');
            SelectObject.removeClass('on');
            SelectObject.removeClass('on_hover');
            SelectObject.removeClass('off_hover');
            SelectObject.disabled = false;
            SelectObject.hide();
        },
        getStatus: function () {
            return SelectStatus;
        },
        displayOn: function () {
            if (showFlag) {
                SelectStatus = Select.STATUS_ON;
                SelectObject.removeClass('off');
                SelectObject.removeClass('disable');
                SelectObject.removeClass('on_hover');
                SelectObject.removeClass('off_hover');
                SelectObject.addClass('on');
                SelectObject.removeAttr("disabled");
            }
        },
        displayOff: function () {
            if (showFlag) {
                SelectStatus = Select.STATUS_OFF;
                SelectObject.removeClass('on');
                SelectObject.removeClass('disable');
                SelectObject.removeClass('on_hover');
                SelectObject.removeClass('off_hover');
                SelectObject.addClass('off');
                SelectObject.removeAttr("disabled");
            }
        },
        displayDisabled: function () {
            if (showFlag) {
                SelectStatus = Select.STATUS_DISABLED;
                SelectObject.removeClass('on');
                SelectObject.removeClass('off');
                SelectObject.removeClass('on_hover');
                SelectObject.removeClass('off_hover');
                SelectObject.addClass('disable');
                SelectObject.attr("disabled", "disabled");
            }
        },
        displayOnHover: function () {
            if (showFlag) {
                SelectObject.removeClass('on');
                SelectObject.removeClass('off');
                SelectObject.removeClass('disable');
                SelectObject.removeClass('off_hover');
                SelectObject.addClass('on_hover');
                SelectObject.removeAttr("disabled");
            }
        },
        displayOffHover: function () {
            if (showFlag) {
                SelectObject.removeClass('on');
                SelectObject.removeClass('off');
                SelectObject.removeClass('disable');
                SelectObject.removeClass('on_hover');
                SelectObject.addClass('off_hover');
                SelectObject.removeAttr("disabled");
            }
        },
        val: function (value) {
            SelectObject.val(value);
        },
        setMaxValue:function(value){
            if(!value){
                SelectObject[0].selectedIndex = SelectObject[0].options.length - 1;
                return;
            }
            for (var i = 0; i < SelectObject[0].options.length; i++) {
                if (SelectObject[0].options[i].value == value) {
                    SelectObject[0].options[i].selected = true;
                    break;
                }
                if(i == SelectObject[0].options.length -1){
                    SelectObject[0].selectedIndex = SelectObject[0].options.length -1;
                }
            }
        },
        remove: function () {
            SelectObject.remove();
        },
        hoverDisable: function () {
            hoverDisableFlag = true;
        },
        hoverEnable: function () {
            hoverDisableFlag = false;
        },
        get: function () {
            return SelectObject.val();
        },
        getStatus: function () {
            return SelectStatus;
        },
        getSelectObject: function () {
            return SelectObject;
        },
        appendOptions: appendOptions,
        refreshOptions: function (itemsObject) {
            return setOptions(itemsObject);
        },
        hideOptions: function (itemsObject,selectObject,mode) {
            return hideOptions(itemsObject,selectObject,mode);
        }

    }
}
/**
 * Line制御クラス
 * @constructor
 */
function LineCtrl(div, type, top, left, length, pClass, percent) {
    /**
     * lineオブジェクト本体
     * @type object
     */
    var LineObject = null;
    if (type == "horizontal") {
        LineObject = $('<div class="horizontal_line_common ' + pClass + '_Line"></div>');
        if (!pClass) {
            LineObject.css({
                top: top + 'px',
                left: left + 'px'
            });
        }
        if (!percent) {
            LineObject.css({
                width: 98 + '%'
            });
        } else {
            LineObject.css({
                width: percent + '%'
            });
        }
    } else if (type == "vertical") {
        LineObject = $('<div class="vertical_line_common ' + pClass + '_Line"></div>');
        if (!pClass) {
            LineObject.css({
                top: top + 'px',
                left: left + 'px',
                height: length + 'px'
            });
        }
    } else {
        //doNothing
    }
    $('#' + div).append(LineObject);

    return {
        show: function () {
            LineObject.show();
        },
        hide: function () {
            LineObject.hide();
        }
    }
}
/**
 * MenuButtonDivideLineCtrl制御クラス
 * @constructor
 */
function MenuButtonDivideLineCtrl(div, top, left) {
    /**
     * lineオブジェクト本体
     * @type object
     */
    var LineObject = $('<div class = "MenuButtonDivideLine"></div>');
    LineObject.css({
        top: top + 'px',
        left: left + 'px'
    });

    $('#' + div).append(LineObject);

    return {
        show: function () {
            LineObject.show();
        },
        hide: function () {
            LineObject.hide();
        }
    };
}

/**
 * SliderCtrl制御クラス
 * @constructor
 */
function SliderCtrl(div, _className, _max, _min, _currentValue, _handler, _unit, _direction, _option, _step, _data, _precision, _optionSetValue, _special,_color,_notChange) {
    let self = this;
    let SLIDER_BUTTON_HOLD_TIME = 1000;
    let SLIDER_BUTTON_HOLDING_INTERVAL = 100;
    let SLIDER_INDICATOR_HOLDING_INTERVAL = 20;

    let SLIDER_BUTTON_SUBMIT_INTERVAL = SLIDER_BUTTON_HOLDING_INTERVAL * 4;
    let SLIDER_INDICATOR_SUBMIT_INTERVAL = SLIDER_INDICATOR_HOLDING_INTERVAL * 20;

    let buttonMouseDownTime = 0;
    let indicatorMouseDownTime = 0;

    let buttonHoldingTime = 0;
    let indicatorHoldingTime = 0;

    let range;

    let maxLevel = 1;
    let minLevel = 0;

    let currentValue = 0;
    let currentChangeValue = 0;
    let startValue = 0;
    let currentPosition = 0;
    let step = 1;
    let displayValueArray = [];
    let cgiValueArray = [];

    let className;
    let unit;
    let direction;
    let option;

    let cgiHandler = null;
    let displayHandler = null;

    let sliderMain = null;
    let sliderDown = null;
    let sliderUp = null;
    let sliderIndicator = null;
    let sliderPosCheck = null;
    let sliderValue = null;
    let sliderOption = null;

    let isAttach = false;
    let hasHandlerDisplayingValue = false;

    let isMouseDown = false;
    let iCurrentMousePosX = 0;

    let SLIDER_BUTTON_TYPE_DOWN = 0;
    let SLIDER_BUTTON_TYPE_UP = 1;
    let SLIDER_BUTTON_TYPE_OPTION = 2;
    let SLIDER_BUTTON_TYPE_KNOB = 3;

    let optionValue;

    let isOptionClicked = false;

    init();
    display();
    attachEvent();

    function getSLIDER_INDICATOR_WIDTH() {
        var retValue;
        if(Platform.isTouchMode() && !_notChange){
            retValue = 35;
        }else{
            retValue = 16;
        }
        return retValue;
    }

    function getSLIDER_MIN_LEFT_POSITION() {
        var retValue;
        if(Platform.isTouchMode() && !_notChange){
            retValue = 48 + 35 / 2;
        }else{
            retValue = 32 + 16 / 2;
        }
        return retValue;
    }

    function getSLIDER_LENGTH() {
        var retValue;
        if(Platform.isTouchMode() && !_notChange){
            retValue = 354 -48 - 35;
        }else{
            retValue = 264 - 32 - 16;
        }
        return retValue;
    }

    // initial
    function init() {
        if (_className) {
            className = _className;
        }
        if (_data) {
            displayValueArray = _data[SliderData.DISPLAY_VALUE];
            cgiValueArray = _data[SliderData.CGI_VALUE];
            if (displayValueArray.length > 0) {
                maxLevel = displayValueArray.length - 1;
            }
            minLevel = 0;
        } else {
            if (_max) {
                maxLevel = _max;
            }
            if (_min) {
                minLevel = _min;
            }
        }
        // if (_currentValue) {
        if (displayValueArray.length > 0) {
            if (cgiValueArray.indexOf(_currentValue) == -1) {
                currentValue = 0;
            } else {
                currentValue = cgiValueArray.indexOf(_currentValue);
            }
        } else {
            if (_currentValue) {
                if (_currentValue > maxLevel) {
                    currentValue = maxLevel;
                } else if (_currentValue < minLevel) {
                    currentValue = maxLevel;
                } else {
                    currentValue = _currentValue;
                }
            }
        }
        //}
        if (_handler) {
            cgiHandler = _handler;
        }
        if (_unit) {
            unit = _unit;
        }
        if (_direction) {
            direction = _direction;
        }
        if (_option) {
            option = _option.substr(0, _option.indexOf(':'));
            optionValue = _option.substr(_option.indexOf(':') + 1);

        }
        if (_step) {
            step = _step;
        }
        if (step < 1 && _precision) {
            range = (maxLevel - minLevel) * _precision;
        } else {
            range = maxLevel - minLevel;
        }
    }

    function display() {
        sliderMain = $("<div id = 'slider_Main' class= 'slider_main " + className + "'></div>");
        if(_color){
            sliderMain.attr("style","background: url(../css/pc/parts/"+_color+".png) no-repeat center")
        }
        sliderDown = ButtonCtrl('slider_Main', 'slider_down', NPTZ_WORDING.wID_0015, callbackSliderDownUp, SLIDER_BUTTON_TYPE_DOWN);
        sliderUp = ButtonCtrl('slider_Main', 'slider_up', NPTZ_WORDING.wID_0014, callbackSliderDownUp, SLIDER_BUTTON_TYPE_UP);
        sliderIndicator = ButtonCtrl('slider_Main', 'slider_indicator', '', callbackSliderKnob, SLIDER_BUTTON_TYPE_KNOB);
        sliderPosCheck = $("<div class='slider_poscheck'></div>");
        sliderValue = $("<div class='slider_value'></div>");
        sliderMain.append(sliderDown.getButtonObject());
        sliderMain.append(sliderUp.getButtonObject());
        sliderMain.append(sliderIndicator.getButtonObject());
        sliderMain.append(sliderPosCheck);
        sliderMain.append(sliderValue);
        if (option) {
            sliderOption = ButtonCtrl('slider_Main', 'slider_option', option, callbackSliderOption, SLIDER_BUTTON_TYPE_OPTION);
            sliderMain.append(sliderOption.getButtonObject());
            sliderOption.show();
            sliderOption.displayOff();
        }
        $('#' + div).append(sliderMain);
        sliderMain.show();
        sliderDown.show();
        sliderDown.displayOff();
        sliderUp.show();
        sliderUp.displayOff();
        sliderIndicator.show();
        sliderIndicator.displayOff();
        if (typeof(_currentValue) != 'undefined' && typeof(_option) != 'undefined') {
            if (parseInt(_currentValue) == parseInt(optionValue)) {
                setDisable();
                sliderOption.displayOn();
                if( typeof(_optionSetValue) != 'undefined' && _optionSetValue != null){
                    currentValue = _optionSetValue;
                }
            }
        }
        sliderDisplayCurrentValue();
    }

    function callbackSliderDownUp(mouse, type) {
        if (mouse == Button.MOUSE_DOWN) {
            sliderButtonMouseDown(type);
        }
        if (mouse == Button.MOUSE_UP || mouse == Button.MOUSE_OUT) {
            sliderButtonMouseUp(type);
        }
    }

    function callbackSliderOption(mouse) {
        if (mouse == Button.MOUSE_DOWN) {
            isOptionClicked = true;
            if (sliderOption.getStatus() == Button.STATUS_ON) {
                sliderDisplayCurrentValue();
                isOptionClicked = false;
                setEnable();
                sliderOption.displayOff();
            } else {
                if(_optionSetValue){
                    if(!_special) {
                        currentValue = _optionSetValue;
                    }
                }else{
                    if(!_special){
                        if (optionValue >= minLevel && optionValue <= maxLevel) {
                            currentValue = optionValue;

                        } else {
                            currentValue = maxLevel;
                        }
                    }
                }
                //sliderDisplayCurrentValue();
                setDisable();
                sliderOption.displayOn();
            }
            doSubmitSlider();
        }
    }

    function callbackSliderKnob(mouse) {
        if (mouse == Button.MOUSE_DOWN) {
        }
    }

    function attachEvent() {
        if (!isAttach) {

            addEvent(sliderPosCheck, "mousemove", sliderPosCheckMouseMove);
            addEvent(sliderPosCheck, "mousedown", sliderPosCheckMouseDown);
            addEvent(sliderPosCheck, "mouseup", sliderPosCheckMouseUp);
            addEvent(sliderPosCheck, "mouseout", sliderPosCheckMouseOut);

            addEvent(sliderPosCheck, "click", sliderPosCheckClick);


            addEvent(sliderPosCheck, "touchmove", sliderPosCheckTouchMove);
            isAttach = true;
        }
    }

    function detachEvent() {
        if (isAttach) {

            removeEvent(sliderPosCheck, "mousemove", sliderPosCheckMouseMove);
            removeEvent(sliderPosCheck, "mousedown", sliderPosCheckMouseDown);
            removeEvent(sliderPosCheck, "mouseup", sliderPosCheckMouseUp);
            removeEvent(sliderPosCheck, "mouseout", sliderPosCheckMouseOut);

            removeEvent(sliderPosCheck, "click", sliderPosCheckClick);

            removeEvent(sliderPosCheck, "touchstart", sliderPosCheckTouchStart);
            removeEvent(sliderPosCheck, "touchmove", sliderPosCheckTouchMove);
            removeEvent(sliderPosCheck, "touchend", sliderPosCheckTouchEnd);

            isAttach = false;
        }
    }

    function addEvent(node, type, handler) {
        node.on(type, '', handler);
    }

    function removeEvent(node, type, handler) {
        node.off(type, '', handler);
    }

    function getValue() {
        if (sliderOption && sliderOption.getStatus() == Button.STATUS_ON) {
            return optionValue;
        }
        return currentValue;
    }

    function setValue(_value) {
        if (_value >= minLevel && _value <= maxLevel) {
            currentValue = Number(_value);
        } else if (_value < minLevel) {
            currentValue = minLevel;
        } else {
            currentValue = maxLevel;
        }
        sliderDisplayCurrentValue();
        if (option) {
            if (_value == optionValue) {
                sliderOption.displayOn();
                setDisable();
            } else {
                sliderOption.displayOff();
                setEnable();
            }
        }
        return true;
    }

    function setCgiValue(_cgiValue) {
        var _value = cgiValueArray.indexOf(_cgiValue);
        if (_value >= minLevel && _value <= maxLevel) {
            currentValue = _value;
            sliderDisplayCurrentValue();
            return true;
        }
        return false;
    }

    function displayStringValue(_value) {
        if (sliderValue) {
            sliderValue.innerHTML = _value;
        }
    }

    function setHandlerDisplayValue(_handler) {
        if (_handler) {
            hasHandlerDisplayingValue = true;
            displayHandler = _handler;
        }
    }

    function sliderButtonMouseDown(type) {
        var dd = new Date();
        buttonMouseDownTime = dd.getTime();

        if (type == SLIDER_BUTTON_TYPE_DOWN) {
            sliderDownValue();
        }
        else if (type == SLIDER_BUTTON_TYPE_UP) {
            sliderUpValue();
        }
        isMouseDown = true;

        (function (arg1, arg2) {
            window.setTimeout(
                function () {
                    sliderButtonLongPress(arg1, arg2);
                }, SLIDER_BUTTON_HOLD_TIME);
        })(type, buttonMouseDownTime);
    }

    function sliderButtonMouseUp(_evt, _obj) {
        buttonMouseDownTime = 0;
        buttonHoldingTime = 0;

        if (isMouseDown) {
            isMouseDown = false;
            doSubmitSlider();
        }

        sliderDisplayCurrentValue();
    }

    function sliderButtonLongPress(type, _buttonMouseDownTime) {
        if (_buttonMouseDownTime == buttonMouseDownTime) {
            buttonHoldingTime += SLIDER_BUTTON_HOLDING_INTERVAL;
            if (type == SLIDER_BUTTON_TYPE_DOWN) {
                sliderDownValue();
                if (buttonHoldingTime % SLIDER_BUTTON_SUBMIT_INTERVAL == 0) {
                    doSubmitSlider();
                }
                sliderDisplayCurrentValue();
            }
            else if (type == SLIDER_BUTTON_TYPE_UP) {
                sliderUpValue();
                if (buttonHoldingTime % SLIDER_BUTTON_SUBMIT_INTERVAL == 0) {
                    doSubmitSlider();
                }
                sliderDisplayCurrentValue();
            }

            (function (arg1, arg2) {
                window.setTimeout(
                    function () {
                        sliderButtonLongPress(arg1, arg2);
                    }, SLIDER_BUTTON_HOLDING_INTERVAL);
            })(type, _buttonMouseDownTime);
        }
        else {
            buttonHoldingTime = 0;
        }
    }

    function sliderPosCheckMouseDown(_evt) {
        var mousePosX = getMousePosX(_evt);
        var indicatorPosX = currentPosition - getSLIDER_MIN_LEFT_POSITION() + (getSLIDER_INDICATOR_WIDTH() / 2);

        if ((indicatorPosX <= mousePosX) && (mousePosX < (indicatorPosX + getSLIDER_INDICATOR_WIDTH()))) {
            iCurrentMousePosX = mousePosX;
            sliderMoveStart();
        }
    }
    
    function sliderPosCheckTouchStart(_evt) {
        var touchPosX = getTouchPosX(_evt);
        var indicatorPosX = currentPosition - getSLIDER_MIN_LEFT_POSITION() + (getSLIDER_INDICATOR_WIDTH() / 2);

        if ((indicatorPosX <= touchPosX) && (touchPosX < (indicatorPosX + getSLIDER_INDICATOR_WIDTH()))) {
            iCurrentMousePosX = touchPosX;
            sliderMoveStart();
        }
    }

    function sliderPosCheckMouseUp(_evt) {
        sliderMoveStop();
    }

    function sliderPosCheckMouseOut(_evt) {
        sliderMoveStop();
    }

    function sliderPosCheckTouchEnd(_evt) {
        sliderMoveStop();
    }

    function sliderPosCheckMouseMove(_evt) {
        if (indicatorMouseDownTime > 0) {
            if(!sliderIndicator.getButtonObject().hasClass('on')){
                sliderIndicator.getButtonObject().addClass("on");
            }
            calculateCurrentValue(_evt);
            var dd = new Date();
            if ((dd.getTime() - indicatorMouseDownTime) > SLIDER_INDICATOR_SUBMIT_INTERVAL) {
                doSubmitSlider();
                indicatorMouseDownTime += SLIDER_INDICATOR_SUBMIT_INTERVAL;
            }

            sliderDisplayCurrentValue();
        }
    }

    function sliderPosCheckClick(_evt) {
            calculateCurrentValue(_evt);
            doSubmitSlider();
            sliderDisplayCurrentValue();
    }

    function calculateCurrentValue(_evt){

        var iNowMousePosX = getMousePosX(_evt);
        var posX = ( getMousePosX(_evt) - ( getSLIDER_INDICATOR_WIDTH() / 2 ) );

        var value = null;
        if (iCurrentMousePosX == iNowMousePosX) {
            value = currentValue;
        } else {
            if (( posX > 0 ) && ( posX < getSLIDER_LENGTH() )) {
                if (step > 1) {
                    value = Math.floor((( Math.floor(( posX * range ) / getSLIDER_LENGTH()) + minLevel ) / step)) * step;
                } else if (step < 1) {
                    value = powerMath.plus(powerMath.multiply(Math.floor(Math.floor(( posX * range ) / getSLIDER_LENGTH()) / (_precision * step)) , step), minLevel);
                } else {
                    const num = ( posX * range ) / getSLIDER_LENGTH() + minLevel;
                    value = Math.ceil(num);
                    // if(num > currentValue){
                    //     value = Math.ceil(num);
                    //     console.log("move start 3  "+value)
                    // }else{
                    //     value = Math.floor(num);
                    //     console.log("move start 4  "+value)
                    // }
                    //value = Math.floor(( posX * range ) / getSLIDER_LENGTH()) + minLevel
                }
            } else if (posX <= ( getSLIDER_LENGTH() / range )) {
                value = minLevel;
            } else if (posX >= ( getSLIDER_LENGTH() - ( getSLIDER_LENGTH() ) )) {
                value = maxLevel;
            }
            iCurrentMousePosX = iNowMousePosX;
        }
        currentValue = value;
    }

    function sliderPosCheckTouchMove(_evt) {
        if(!sliderIndicator.getButtonObject().hasClass('on')){
            sliderIndicator.getButtonObject().addClass("on");
        }

        var iNowMousePosX = getTouchPosX(_evt);

        var posX = ( getTouchPosX(_evt) - ( getSLIDER_INDICATOR_WIDTH() / 2 ) );

        var value = null;
        if (iCurrentMousePosX == iNowMousePosX) {
            value = currentValue;
        } else {
            if (( posX > 0 ) && ( posX < getSLIDER_LENGTH() )) {
                if (step > 1) {
                    value = Math.floor((( Math.floor(( posX * range ) / getSLIDER_LENGTH()) + minLevel ) / step)) * step;
                } else if (step < 1) {
                    value = powerMath.plus(powerMath.multiply(Math.floor(Math.floor(( posX * range ) / getSLIDER_LENGTH()) / (_precision * step)), step), minLevel);
                } else {
                    value = Math.floor(( posX * range ) / getSLIDER_LENGTH()) + minLevel
                }
            } else if (posX <= ( getSLIDER_LENGTH() / range )) {
                value = minLevel;
            } else if (posX >= ( getSLIDER_LENGTH() - ( getSLIDER_LENGTH() ) )) {
                value = maxLevel;
            }
            iCurrentMousePosX = iNowMousePosX;
        }
        currentValue = value;

        var dd = new Date();
        if ((dd.getTime() - indicatorMouseDownTime) > SLIDER_INDICATOR_SUBMIT_INTERVAL) {
            doSubmitSlider();
            indicatorMouseDownTime += SLIDER_INDICATOR_SUBMIT_INTERVAL;
        }

        sliderDisplayCurrentValue();
    }

    function sliderMoveStart() {
        sliderIndicator.getButtonObject().removeClass("off");
        sliderIndicator.getButtonObject().addClass("on");

        var dd = new Date();
        indicatorMouseDownTime = dd.getTime();
        indicatorHoldingTime = 0;
        isMouseDown = true;
        startValue = currentValue;


    }

    function sliderMoveStop() {
        sliderIndicator.getButtonObject().addClass("off");
        sliderIndicator.getButtonObject().removeClass("on");

        indicatorMouseDownTime = 0;
        indicatorHoldingTime = 0;
        if (isMouseDown) {
            isMouseDown = false;
            currentChangeValue = currentValue - startValue;
            doSubmitSlider();
        }
    }

    function getMousePosX(_evt) {
        var posX = 0;
        if ("offsetX" in _evt) {
            posX = _evt.offsetX;
        }
        else if ("layerX" in _evt) {
            posX = _evt.layerX;
        }
        return posX;
    }

    function getTouchPosX(_evt) {
        var posX;
        posX = _evt.originalEvent.targetTouches[0].clientX - sliderPosCheck.offset().left;

        return posX/currentZoomValue;
    }

    function getMousePosY(_evt) {
        var posY = 0;
        if ("offsetY" in _evt) {
            posY = _evt.offsetY;
        }
        else if ("layerY" in _evt) {
            posY = _evt.layerY;
        }
        return posY;
    }

    function getTouchPosY(_evt) {
        var posY = _evt.originalEvent.targetTouches[0].clientY - sliderPosCheck.offset().top;
        return posY;
    }

    function sliderDownValue() {
        if (currentValue > minLevel) {
            if (div != "knee_branch_box_right_knee_b_point" && div != "knee_branch_box_right_knee_r_point") { //#8449
                currentValue = powerMath.minus(currentValue, step);
            } else {
                if (currentValue < 0) { //#8449
                    currentValue = currentValue - step;
                } else {
                    currentValue = powerMath.minus(currentValue, step);
                }
            }          
            currentChangeValue = -1 * step;
        }
    }

    function sliderUpValue() {
        if (currentValue < maxLevel) {
            if (div != "knee_branch_box_right_knee_b_point" && div != "knee_branch_box_right_knee_r_point") { //#8449
            currentValue = powerMath.plus(currentValue, step);
            } else {
                if (currentValue < 0) { //#8449
                    currentValue = currentValue + step;
                } else {
                    currentValue = powerMath.plus(currentValue, step);
                }
            }
            currentChangeValue = step;
        }
    }

// function display
    function sliderDisplayCurrentValue() {
        if (sliderValue) {
            var currentDisplayValue = currentValue;
            if (_data) {
                currentDisplayValue = displayValueArray[currentValue];
            }
            if (unit) {
                if (direction == 'before') {
                    currentDisplayValue = unit + currentDisplayValue;
                } else {
                    currentDisplayValue = currentDisplayValue + unit;
                }
            }
            if (_special && sliderOption && sliderOption.getStatus() == Button.STATUS_OFF && isOptionClicked) {
                currentDisplayValue = option;
            }
            if (!hasHandlerDisplayingValue) {
                sliderValue.html(currentDisplayValue);
            }
            else {
                if (displayHandler) {
                    sliderValue.html(displayHandler(currentDisplayValue));
                }
                else {
                    sliderValue.html(currentDisplayValue);
                }
            }
        }

        if ((div == "knee_branch_box_right_knee_b_point" || div == "knee_branch_box_right_knee_r_point") && currentValue < 0) { //#8449
            currentPosition = Math.floor((getSLIDER_LENGTH() * (currentValue - minLevel) * _precision / range) * 100) / 100 + getSLIDER_MIN_LEFT_POSITION() - (getSLIDER_INDICATOR_WIDTH() / 2);
        } else { //#8449
            if (_precision) {
                currentPosition = Math.floor((getSLIDER_LENGTH() * powerMath.minus(currentValue, minLevel) * _precision / range) * 100) / 100 + getSLIDER_MIN_LEFT_POSITION() - (getSLIDER_INDICATOR_WIDTH() / 2);
            } else {
                currentPosition = Math.floor((getSLIDER_LENGTH() * (currentValue - minLevel) / range) * 100) / 100 + getSLIDER_MIN_LEFT_POSITION() - (getSLIDER_INDICATOR_WIDTH() / 2);
            }
        }

        if (sliderIndicator) {
            sliderIndicator.getButtonObject().css("marginLeft", currentPosition -1 + "px");
        }
        if (sliderValue) {
            sliderValue.css("marginLeft", currentPosition + getSLIDER_INDICATOR_WIDTH() / 2 - 26 + "px");
        }
    }

    function setEnable() {
        attachEvent();
        sliderDown.displayOff();
        sliderUp.displayOff();
        sliderIndicator.displayOff();
        sliderMain.removeClass('disable');
        if(_color){
        sliderMain.attr("style","background: url(../css/pc/parts/" + _color + ".png) no-repeat center")
        }
    }

    function setDisable() {
        detachEvent();
        sliderDown.displayDisabled();
        sliderUp.displayDisabled();
        sliderIndicator.displayDisabled();
        sliderMain.addClass('disable');
        if(_color){
            sliderMain.removeAttr("style");
        }

    }

    function doSubmitSlider() {
        if (cgiHandler) {
            cgiHandler(self);
        }
    }

    function changeRange(_min, _max, _data) {
        if (_data) {
            displayValueArray = _data[SliderData.DISPLAY_VALUE];
            cgiValueArray = _data[SliderData.CGI_VALUE];
            if (displayValueArray.length > 0) {
                maxLevel = displayValueArray.length - 1;
            }
            minLevel = 0;
            range = maxLevel - minLevel;
            if (currentValue > cgiValueArray.length) {
                setValue(maxLevel);
            }else{
                sliderDisplayCurrentValue();
            }
        } else {
            if (_min) {
                minLevel = _min;
            }
            if (_max) {
                maxLevel = _max;
            }
            range = maxLevel - minLevel;
            if (sliderOption && sliderOption.getStatus() == Button.STATUS_ON) {
            }else{
                if (currentValue < minLevel) {
                    setValue(_min);
                }else if (currentValue > maxLevel) {
                    setValue(maxLevel);
                }else{
                    sliderDisplayCurrentValue();
                }
            }
        }
    }

    return {
        getValue: function () {
            return getValue();
        },
        getSliderValueValue: function () {
            return sliderValue.html();
        },
        getCgiValue: function () {
            return cgiValueArray[currentValue];
        },
        getChangedValue: function () {
            return currentChangeValue;
        },
        setValue: function (value) {
            return setValue(value);
        },
        setCgiValue: function (value) {
            return setCgiValue(value);
        },
        displayStringValue: function (value) {
            return displayStringValue(value);
        },
        setHandlerDisplayValue: function (handler) {
            return setHandlerDisplayValue(handler);
        },
        setEnable: function () {
            setEnable();
            if (sliderOption) {
                sliderOption.displayOff();
            }
        },
        setDisable: function () {
            setDisable();
            if (sliderOption) {
                sliderOption.displayDisabled();
            }
        },
        changeRange: function (_min, _max, _data) {
            return changeRange(_min, _max, _data);
        },
        isDisabled: function () {
            return sliderMain.hasClass('disable');
        },
        refresh: function () {
            sliderDisplayCurrentValue();
        }
    };
}
/**
 * String判定
 * @param obj 判定対象
 * @return {boolean} true:String
 */
function isString(obj) {
    return typeof (obj) == "string" || obj instanceof String;
}

/**
 * Array判定
 * @param obj 判定対象
 * @return {boolean} true:Array
 */
function isArray(obj) {
    return Object.prototype.toString.call(obj) === '[object Array]';
}
/**
 * precision ため
 * @type {{minus, multiply, division, numToString, plus, handleNum}}
 */
var powerMath = function mathPlus() {
    return {
        minus: function (n, m) {
            n = typeof n == "string" ? n : this.numToString(n);
            m = typeof m == "string" ? m : this.numToString(m);
            var F = n.indexOf(".") != -1 ? this.handleNum(n) : [n, 0, 0],
                S = m.indexOf(".") != -1 ? this.handleNum(m) : [m, 0, 0],
                l1 = F[2],
                l2 = S[2],
                L = l1 > l2 ? l1 : l2,
                T = Math.pow(10, L);
            return (F[0] * T + F[1] * T / Math.pow(10, l1) - S[0] * T - S[1] * T / Math.pow(10, l2)) / T
        },
        multiply: function (n, m) {
            n = typeof n == "string" ? n : this.numToString(n);
            m = typeof m == "string" ? m : this.numToString(m);
            var F = n.indexOf(".") != -1 ? this.handleNum(n) : [n, 0, 0],
                S = m.indexOf(".") != -1 ? this.handleNum(m) : [m, 0, 0],
                l1 = F[2],
                l2 = S[2],
                L = l1 > l2 ? l1 : l2,
                T = Math.pow(10, L);
            return ((F[0] * T + F[1] * T / Math.pow(10, l1)) * (S[0] * T + S[1] * T / Math.pow(10, l2))) / T / T
        },
        division: function (n, m) {
            n = typeof n == "string" ? n : this.numToString(n);
            m = typeof m == "string" ? m : this.numToString(m);
            var F = n.indexOf(".") != -1 ? this.handleNum(n) : [n, 0, 0],
                S = m.indexOf(".") != -1 ? this.handleNum(m) : [m, 0, 0],
                l1 = F[2],
                l2 = S[2],
                L = l1 > l2 ? l1 : l2,
                T = Math.pow(10, L);
            return ((F[0] * T + F[1] * T / Math.pow(10, l1)) / (S[0] * T + S[1] * T / Math.pow(10, l2)))
        },
        numToString: function (tempArray) {
            if (Object.prototype.toString.call(tempArray) == "[object Array]") {
                var temp = tempArray.slice();
                for (var i, l = temp.length; i < l; i++) {
                    temp[i] = typeof temp[i] == "number" ? temp[i].toString() : temp[i];
                }
                return temp;
            }
            if (typeof tempArray == "number") {
                return tempArray.toString();
            }
            return []
        },
        plus: function (n, m) {
            n = typeof n == "string" ? n : this.numToString(n);
            m = typeof m == "string" ? m : this.numToString(m);
            var F = n.indexOf(".") != -1 ? this.handleNum(n) : [n, 0, 0],
                S = m.indexOf(".") != -1 ? this.handleNum(m) : [m, 0, 0],
                l1 = F[2],
                l2 = S[2],
                L = l1 > l2 ? l1 : l2,
                T = Math.pow(10, L);
            return (F[0] * T + F[1] * T / Math.pow(10, l1) + S[0] * T + S[1] * T / Math.pow(10, l2)) / T

        },
        handleNum: function (n) {
            n = typeof n !== "string" ? n + "" : n;
            var temp = n.split(".");
            temp.push(temp[1].length);
            return temp
        }
    };
}();

function is24fpsFormat(format) {
    return format == CONST_1080_23_98p_59_94i
        || format == CONST_2160_24p
        || format == CONST_1080_24p
        || format == CONST_2160_23_98p
        || format == CONST_1080_23_98p
        || format == CONST_2160_23_98psF
        || format == CONST_1080_23_98psF;
}

function isUHDFormat(format) {
    return format == CONST_2160_29_97p
        || format == CONST_2160_25p
        || format == CONST_2160_59_94p
        || format == CONST_2160_50p
        || format == CONST_2160_23_98p
        || format == CONST_2160_29_97psF
        || format == CONST_2160_25psF
        || format == CONST_2160_23_98psF
        || format == CONST_2160_60p
        || format == CONST_2160_24p;
}

function getFormatName(sysFormat) {
    var formatName;
    switch (sysFormat) {
        case "00":
            formatName = CONST_720_60p;
            break;
        case "01":
            formatName = CONST_720_59_94p;
            break;
        case "02":
            formatName = CONST_720_50p;
            break;
        case "03":
            formatName = CONST_1080_60i;
            break;
        case "04":
            formatName = CONST_1080_59_94i;
            break;
        case "05":
            formatName = CONST_1080_50i;
            break;
        case "06":
            formatName = CONST_1080_30psF;
            break;
        case "07":
            formatName = CONST_1080_29_97psF;
            break;
        case "08":
            formatName = CONST_1080_25PsF;
            break;
        case "09":
            formatName = CONST_1080_24psF;
            break;
        case "0A":
            formatName = CONST_1080_29_97psF;
            break;
        case "0B":
            formatName = CONST_480_59_94i;
            break;
        case "0C":
            formatName = CONST_480_29_97psF;
            break;
        case "0D":
            formatName = CONST_576_50i;
            break;
        case "0E":
            formatName = CONST_576_25psF;
            break;
        case "10":
            formatName = CONST_1080_59_94p;
            break;
        case "11":
            formatName = CONST_1080_50p;
            break;
        case "12":
            formatName = CONST_480_59_94p;
            break;
        case "13":
            formatName = CONST_576_50p;
            break;
        case "14":
            formatName = CONST_1080_29_97p;
            break;
        case "15":
            formatName = CONST_1080_25p;
            break;
        case "16":
            formatName = CONST_1080_23_98p_59_94i;
            break;
        case "17":
            formatName = CONST_2160_29_97p;
            break;
        case "18":
            formatName = CONST_2160_25p;
            break;
        case "19":
            formatName = CONST_2160_59_94p;
            break;
        case "1A":
            formatName = CONST_2160_50p;
            break;
        case "1B":
            formatName = CONST_2160_23_98p;
            break;
        case "1C":
            formatName = CONST_2160_29_97psF;
            break;
        case "1D":
            formatName = CONST_2160_25psF;
            break;
        case "1E":
            formatName = CONST_2160_23_98psF;
            break;
        case "1F":
            formatName = CONST_2160_60p;
            break;
        case "20":
            formatName = CONST_1080_60p;
            break;
        case "21":
            formatName = CONST_2160_24p;
            break;
        case "22":
            formatName = CONST_1080_24p;
            break;
        case "23":
            formatName = CONST_1080_23_98p;
            break;
        default:
    }
    return formatName;
}

function buildInputFileObject(parentId, inputFileId, inputFileName, inputTextId, inputFileClassName) {
    var inputTag = '<input id="' + inputFileId + '" unselectable = "on" name="' + inputFileName + '" class="' + inputFileClassName + '" type="file"  style = "display:none;" />';
    $('#' + parentId).append($(inputTag));
    var obj = document.getElementById(inputFileId);
    /**
     * 選択ダイアログにてファイル選択時の動作を規定
     */
    $("#" + inputFileId).on("change", function () {
        staticFileChange(inputFileId, inputTextId);
    });
    return obj;
}

function staticFileChange(inputFileId, inputTextId) {
    try {

        if (capi_IsIE()) {
            var path = $("#" + inputFileId).val();
            $("#" + inputTextId).val(path);
        } else {
            var file = document.getElementById(inputFileId).files[0];
            if (file == undefined) {
                return;
            } else {
                var fileName = file.name;
            }
            $("#" + inputTextId).val(fileName);
            var reader = new FileReader();
            reader.onload = function (e) {

            };
            reader.readAsDataURL(file);
        }
    }
    catch (e) {

    }
}

function windowsZoomControl(W, H) {
    var zoomVal;
    var MIN_ZOOM_VAL = 10;
    if (!W && !H) {
        return;
    }

    if ((window.outerWidth != W) || (window.outerHeight != H)) {
        var wVal = parseInt(100 * (window.innerWidth / W));
        var hVal = parseInt(100 * (window.innerHeight / H));
        zoomVal = (wVal > hVal) ? hVal : wVal;
        zoomVal = (zoomVal < MIN_ZOOM_VAL) ? MIN_ZOOM_VAL : zoomVal;
    } else {
        zoomVal = 100;
    }
    $('body').css("transform-origin", "0 0");
    $('body').css("transform", "scale(" + zoomVal / 100 + ") ");// + "translate(" + window.innerWidth * 0.5 + "px)");
    if (window.location.href.indexOf("admin") =="-1") {
        //todo
        if (adminPage) {
            $('body').css("transform", "scale(1) ")
            zoomVal = 100;
        }
    }
    currentZoomValue = zoomVal / 100;

    if(!isMobile || true){
        lastheightValue = $(window).height();

        var windowWidth = $(window).width();

        controllerPosition = windowWidth / currentZoomValue;
        $('body').css("width", controllerPosition + "px");
        $("#base_header").css("width", controllerPosition + "px");
        $("#dialog_setup").css("width", controllerPosition + "px");
        $("#preset_list_area").css("width", controllerPosition + "px");
        if(isPageFlg == "live"){
            presetListresize();
        }
    }
}

function windowsIeZoomControl(W, H) {
    if(currentWindowWidth >=1920){
        currentWindowWidth = 1450
    }
    var zoomVal;
    var MIN_ZOOM_VAL = 10;
    if (!W && !H) {
        return;
    }

    if ((window.outerWidth != W) || (window.outerHeight != H)) {
        var wVal = parseFloat(100 * (W/currentWindowWidth));
        var hVal = parseFloat(100 * (W/16*9));
        zoomVal = (wVal > hVal) ? hVal : wVal;
        zoomVal = (zoomVal < MIN_ZOOM_VAL) ? MIN_ZOOM_VAL : zoomVal;
    } else {
        zoomVal = 100;
    }
    $('body').css("transform-origin", "0 0");
    document.getElementById("mainViewHtml").contentWindow.document.getElementsByTagName("body")[0].style.width = W + "px";
    document.getElementById("mainViewHtml").contentWindow.document.getElementsByTagName("body")[0].style.transform = "scale(" + zoomVal / 100 + ")";
    currentIeZoomValue = zoomVal/100;
    return currentIeZoomValue;
}

function windowsZoomControlOnResize(dis) {
    if(gPower == 0 || dis =="disabled"){
        currentWindowWidth = 480;
    }else{
        if (currentWindowWidth >= 1920 ) {
            if(IsIE()){
                currentWindowWidth = 1450;
            }else{
                currentWindowWidth = 1450;
            }
        }else{

            if(currentWindowWidth == 480){
                //直前はdisableで青画だった
                //今選択中のstream 解像度を指定。
                currentWindowWidth = menubarCtrl.menubar_GetResolution();
                console.log("after windowsZoomControlOnResize currentWindowWidth= " + currentWindowWidth);
            }

        }
    }


    if (document.getElementById("camera_setup").style.display == "none") {
        //todo
        if(adminPage){
            return;
        }
        var currentWidth = Number(currentWindowWidth) + document.getElementById('camera_controller_gui').offsetWidth + document.getElementById('camera_live_area').offsetWidth -56;
        $('body').css("width", currentWidth + "px");
        windowsZoomControl(currentWidth, SettingConst.WEB_APL_WINDOW_HEIGHT);

        var left = document.getElementById('camera_controller_gui').offsetLeft;
        var mainView = (left - 280) / 2 - currentWindowWidth / 2;
            if (mainView > 1) {
                $("#tracking_controller").css("left", (mainView + 280) + "px");
            }else{
                $("#tracking_controller").css("left", ( 277) + "px");
            }
        try{
            if(IsIE() && dis!="disabled"){
                window.frames["mainViewHtml"].WebVideo.ViewWidth = currentWindowWidth*currentZoomValue;
                window.frames["mainViewHtml"].WebVideo.ViewHeight = (currentWindowWidth/16*9)*currentZoomValue;
            }else{
                var imageWidth = $('body').width() - document.getElementById('camera_controller_gui').offsetWidth - document.getElementById('camera_live_area').offsetWidth -56;
                if(!dis && Math.abs(document.body.offsetWidth*currentZoomValue-$(window).width())<1){
                    if(currentWindowWidth >= 1450){
                        var imageWidth = $('body').width() - document.getElementById('camera_controller_gui').offsetWidth - document.getElementById('camera_live_area').offsetWidth;
                        window.frames["mainViewHtml"].document.getElementById("WebVideo").style.width = imageWidth;
                        window.frames["mainViewHtml"].document.getElementById("WebVideo").style.height = imageWidth / 16 * 9;
                    }else{
                        window.frames["mainViewHtml"].document.getElementById("WebVideo").style.width = currentWindowWidth;
                        window.frames["mainViewHtml"].document.getElementById("WebVideo").style.height = currentWindowWidth / 16 * 9;
                    }
                    $("#tracking_controller").css("width", imageWidth + "px");
                    $('#iris_setting_mask').css("width", imageWidth + "px");
                    $('#iris_setting_mask').css("height", (imageWidth / 16 * 9) + "px");
                }else{
                    $("#tracking_controller").css("width",currentWindowWidth  +"px");
                    $('#iris_setting_mask').css("width", currentWindowWidth + "px");
                    $('#iris_setting_mask').css("height", (currentWindowWidth / 16 * 9) + "px");
                    window.frames["mainViewHtml"].document.getElementById("WebVideo").style.width = currentWindowWidth;
                    window.frames["mainViewHtml"].document.getElementById("WebVideo").style.height = currentWindowWidth / 16 * 9;
                }
            }

        }catch (e){}
    } else {
        if (currentWindowWidth > 1280) {
            currentWindowWidth = 1280;
        }
        if (document.getElementById("setup_imageAdjust_main").style.display == "none" && document.getElementById("setup_UHDCrop_main").style.display == "none" && document.getElementById("setup_presetPosition_main").style.display == "none") {
            windowsZoomControl(SettingConst.WEB_APL_WINDOW_WIDTH, SettingConst.WEB_APL_WINDOW_HEIGHT);
        } else {

        }
        var currentWidth = document.getElementById('setting_basic_system').offsetWidth + 594;
        // if(false){
        //     $('body').css("width", $(window).width()/currentZoomValue+"px");
        //     windowsZoomControlByChangeHeight();
        // }else{
        //
        // }

        $('body').css("width", 1920+"px");
        windowsZoomControl(1920,SettingConst.WEB_APL_WINDOW_HEIGHT);

        let left = document.body.offsetWidth - document.getElementById('setting_Situation').offsetLeft;
        $("#setting_Situation").css("width", left + "px");
        left = document.body.offsetWidth - 594;
        $("#setting_basic_system").css("width", left + "px");
        $("#setup_system").css("width", left + "px");
        const basicWidth = document.body.offsetWidth - document.getElementById('setup_basic_div').offsetLeft;
        $("#setup_basic_div").css("width", basicWidth + "px");
        const signalsWidth = document.body.offsetWidth - document.getElementById('setup_signals').offsetLeft;
        $("#setup_signals").css("width", signalsWidth + "px");
        var imageWidth = document.body.offsetWidth - 590;
        $("#setup_videoOverIp_settingStatus_main,#setup_videoOverIp_settingStatus_main,#setup_videoOverIp_streamingMode_main,#setup_videoOverIp_InitialDisplaySetting_main,#setup_videoOverIp_h264_main,#setup_videoOverIp_NDI_main,#setup_videoOverIp_SRT_Common_setup_main,#setup_videoOverIp_NDIHX_stream_main").css("width", imageWidth + "px");
        $("#setup_videoOverIp_main_title,#setup_videoOverIp_h264_main_scroll,#setup_audio_audio_main_scroll,#setup_videoOverIp_h264_u_main,#setup_audio_audio_main,#setup_audio_audio_main,#setup_audio_settingStatus_main,#setup_audio_audioOverIP_main,#setup_virtual_settingStatus_main,#setup_virtual_studio_main,#setup_virtual_mode_main").css("width", imageWidth + "px");
        $("#setup_lens_main_title,#setup_lens_main_main,#setup_advanced_main").css("width", (imageWidth + 300) + "px");

        $("#setup_videoOverIp_jpeg_main").css("width", imageWidth + "px");
        const userWidth = document.body.offsetWidth - document.getElementById('setting_user_mng').offsetLeft;
        $("#setting_user_mng").css("width", userWidth + "px");
        $("#setting_user_mng_user,#setting_user_mng_host").css("width", left + "px");
        const networkWidth = document.body.offsetWidth - 590;
        $("#setup_advanced_https_inner,#setup_advanced_setting_status_inner_main,#setup_advanced_ntp_inner,#setup_advanced_upnp_inner,#setup_advanced_rtsp_inner_main,#setup_advanced_snmp_inner_main").css("width", networkWidth + "px");
        const maintenanceWidth = document.body.offsetWidth - 300;
        $("#setting_maintenance,#setup_maintenance_info_inner_scroll,#setup_maintenance_info_inner,#setup_network_main,#setup_imageAudio_main").css("width", maintenanceWidth + "px");
        $("#ip_out2").hide();
        //basic  setup_basic_div
        const isTouchOffset = 0;
        windowsZoomControl(1920, SettingConst.WEB_APL_WINDOW_HEIGHT);
        if (document.getElementById("setup_imageAdjust_main").style.display != "none") {
            const currentWidth = 1920;
            if ($(window).width() > currentWidth * firstZoomValue + 5) {
                $('body').css("width", $(window).width() / currentZoomValue + "px");
                windowsZoomControlByChangeHeight();
            } else {
                $('body').css("width", currentWidth + "px");
                windowsZoomControl(currentWidth, SettingConst.WEB_APL_WINDOW_HEIGHT);
            }
            let leftArea = 310;
            if(settingIoaLive.getCameraControlBtnStatus() == Button.STATUS_ON){
                leftArea = 600;
            }
            const width = document.getElementById('setup_imageAdjust_main').offsetLeft-leftArea;
            $("#setup_live_form_tally").css({"top":"0px","left":"5px"});
            $("#setup_live_form_liveview").css({"left":"0px"});
            $("#setup_live_iris_setting_mask").css({"left":"0px"});/*#8487 add 2023-11-03*/


            // $("#setup_live_form_tally").css({
            //     "width":"770px",
            //     "height":"433px",
            //     "top":"100px"
            // });
            // $("#setup_live_form_liveview,#setup_live_form_tally").css({
            //     "width":"770px",
            //     "height":"433px",
            // });


            if(width/16*9<=1110){
                if(settingIoaLive.getCameraControlBtnStatus() == Button.STATUS_ON){
                    $("#setup_live_form").css("left","280px");
                }else if(settingIoaLive.getCameraControlBtnStatus() == Button.STATUS_OFF){
                    $("#setup_live_form").css("left", "-5px");
                }
                $("#setup_live_form_liveview,#setup_live_form_tally").css({"width":width+"px","height":width/16*9+"px"});
                $("#setup_live_iris_setting_mask").css({"width":width+"px","height":width/16*9+"px"});/*#8487 add 2023-11-03*/
                $(".image_adjust_camera_control").css("top",(width/16*9+100)+"px")
                const isTop = (1120-(width/16*9))/2;
                $("#setup_live_form").css("top", isTop+"px");
            }else{
                var imageWidth  = $("#setup_live_form_liveview").width();
                $("#setup_live_form").css("left", (width-imageWidth)/2+"px");
            }

            return;
        }
        if (document.getElementById("setup_UHDCrop_main").style.display != "none") {
            const currentWidth = 2120;
            if ($(window).width() > currentWidth * firstZoomValue) {
                $('body').css("width", $(window).width() / currentZoomValue + "px");
                windowsZoomControlByChangeHeight();
                console.log(1);
            } else {
                $('body').css("width", currentWidth + "px");
                windowsZoomControl(currentWidth+isTouchOffset, SettingConst.WEB_APL_WINDOW_HEIGHT);
                console.log(2);
            }
            const width = document.getElementById('camera_controller_gui').offsetLeft-690;
            $("#setup_live_form").css("top","0px");
            $("#ip_out2").show();
            $("#setup_live_form_liveview,#setup_live_crop_ipout1").css({
                "width":"850px",
                "height":"478px",
            });
            $("#setup_live_iris_setting_mask").css({/*#8487 add 2023-11-03*/
                "width":"850px",
                "height":"478px",
            });
            
            $("#base_main_controller").css("width", (controllerPosition-290) + "px");
            //566 camera_controller_guiの幅
            //344 setup_UHPDCrop_Adjustの幅
            //910 ip_out1の幅
            const crop_ipOut_left = controllerPosition - 280 - 566 - 344 -50 - 910;
            $("#ip_out1").css("left", (crop_ipOut_left/2) + "px");

            $("#setup_live_form_tally").css({
                "width":"850px",
                "height":"478px",
                "top":"635px",
                "left":(crop_ipOut_left/2+47)+"px"
            });
            $("#setup_live_form_tally_ipout").css({
                "width":"850px",
                "height":"478px",
                "top":"0px"
            });
            $("#setup_live_form_liveview").css({"left":"-14px"});
            $("setup_live_iris_setting_mask").css({"left":"-14px"});/*#8487 add 2023-11-03*/
            $("#setup_live_crop_ipout1").css({"left":"30px"});
            // }
            return;
        }
        if (document.getElementById("setup_presetPosition_main").style.display != "none") {
            const currentWidth = 1920;
            if ($(window).width() > currentWidth * firstZoomValue) {
                $('body').css("width", $(window).width() / currentZoomValue + "px");
                windowsZoomControlByChangeHeight();
            } else {
                $('body').css("width", currentWidth + "px");
                windowsZoomControl(currentWidth-isTouchOffset, SettingConst.WEB_APL_WINDOW_HEIGHT);
            }
            const width = document.getElementById('camera_controller_gui').offsetLeft-312;
            $("#setup_live_form_tally").css({"top":"0px","left":"5px"});
            if(width/16*9<=1110){
                $("#setup_live_form").css("left", "-5px");
                $("#setup_live_form_liveview,#setup_live_form_tally").css({"width":width+"px","height":width/16*9+"px"});
                $("#setup_live_form_liveview").css({"left":"0px"});
                $("#setup_live_iris_setting_mask").css({"width":width+"px","height":width/16*9+"px"});/*#8487 add 2023-11-03*/
                $("#setup_live_iris_setting_mask").css({"left":"0px"});/*#8487 add 2023-11-03*/
                const isTop = (1120-(width/16*9))/2;
                $("#setup_live_form").css("top", isTop+"px");
            }else{
                const imageWidth  = $("#setup_live_form_liveview").width();
                $("#setup_live_form").css("left", (width-imageWidth)/2+"px");
            }
            return;
        }

    }
    document.getElementById('setupBody').scrollTop = 0;
}

function windowsZoomControlByChangeHeight() {
    var controllerPosition = $(window).width();
    controllerPosition = windowWidth / currentZoomValue;
    $('body').css("width", controllerPosition + "px");

    var windowWidth = $(window).width();
    var windowHeight = $(window).height();
    if (windowHeight != lastheightValue) {
        windowsZoomControl(windowWidth, SettingConst.WEB_APL_WINDOW_HEIGHT);
        firstZoomValue = currentZoomValue;
    }
}

function getCurrentSystemFrequency() {
    const sysFrequency = cparam_get_frequency();
    switch (sysFrequency) {
        case "0":
            sysCommon.frequency = CONST_59_94Hz;
            break;
        case "1":
            sysCommon.frequency = CONST_50Hz;
            break;
        case "2":
            sysCommon.frequency = CONST_24Hz;
            break;
        case "3":
            sysCommon.frequency = CONST_23_98Hz;
            break;
        case "4":
            sysCommon.frequency = CONST_60Hz;
            break;
        default:
    }
    return sysCommon.frequency;
}

function getCurrentFormat() {
    var sysFormat = cparam_get_format();
    switch (sysFormat) {
        case "00":
            sysCommon.format = CONST_720_60p;
            break;
        case "01":
            sysCommon.format = CONST_720_59_94p;
            break;
        case "02":
            sysCommon.format = CONST_720_50p;
            break;
        case "03":
            sysCommon.format = CONST_1080_60i;
            break;
        case "04":
            sysCommon.format = CONST_1080_59_94i;
            break;
        case "05":
            sysCommon.format = CONST_1080_50i;
            break;
        case "06":
            sysCommon.format = CONST_1080_30psF;
            break;
        case "07":
            sysCommon.format = CONST_1080_29_97psF;
            break;
        case "08":
            sysCommon.format = CONST_1080_25PsF;
            break;
        case "09":
            sysCommon.format = CONST_1080_24psF;
            break;
        case "0A":
            sysCommon.format = CONST_1080_23_98psF;
            break;
        case "0B":
            sysCommon.format = CONST_480_59_94i;
            break;
        case "0C":
            sysCommon.format = CONST_480_29_97psF;
            break;
        case "0D":
            sysCommon.format = CONST_576_50i;
            break;
        case "0E":
            sysCommon.format = CONST_576_25psF;
            break;
        case "10":
            sysCommon.format = CONST_1080_59_94p;
            break;
        case "11":
            sysCommon.format = CONST_1080_50p;
            break;
        case "12":
            sysCommon.format = CONST_480_59_94p;
            break;
        case "13":
            sysCommon.format = CONST_576_50p;
            break;
        case "14":
            sysCommon.format = CONST_1080_29_97p;
            break;
        case "15":
            sysCommon.format = CONST_1080_25p;
            break;
        case "16":
            sysCommon.format = CONST_1080_23_98p_59_94i;
            break;
        case "17":
            sysCommon.format = CONST_2160_29_97p;
            break;
        case "18":
            sysCommon.format = CONST_2160_25p;
            break;
        case "19":
            sysCommon.format = CONST_2160_59_94p;
            break;
        case "1A":
            sysCommon.format = CONST_2160_50p;
            break;
        case "1B":
            sysCommon.format = CONST_2160_23_98p;
            break;
        case "1C":
            sysCommon.format = CONST_2160_29_97psF;
            break;
        case "1D":
            sysCommon.format = CONST_2160_25psF;
            break;
        case "1E":
            sysCommon.format = CONST_2160_23_98psF;
            break;
        case "1F":
            sysCommon.format = CONST_2160_60p;
            break;
        case "20":
            sysCommon.format = CONST_1080_60p;
            break;
        case "21":
            sysCommon.format = CONST_2160_24p;
            break;
        case "22":
            sysCommon.format = CONST_1080_24p;
            break;
        case "23":
            sysCommon.format = CONST_1080_23_98p;
            break;
        case "26":
            sysCommon.format = CONST_1080_119_88p;
            break;
        case "27":
            sysCommon.format = CONST_1080_100p;
            break;
        default:
    }
    return sysCommon.format;
}

function toggleTouchMode(){
    var control_Css = document.getElementById("control_cssId");
    var camera_live_area_Css = document.getElementById("camera_live_area_cssId");
    var display_base_Css = document.getElementById("display_base_cssId");
    var tracking_controller_Css = document.getElementById("tracking_controller_cssId");
    var common_function_Css = document.getElementById("common_function_cssId");
    var slider_Css = document.getElementById("slider_cssId");
    var setup_main_menu_Css = document.getElementById("setup_main_menu_cssId");
    var setting_imageOrAudio_Css = document.getElementById("setting_imageOrAudio_cssId");
    var setting_mediaOverIp_Css = document.getElementById("setting_mediaOverIp_cssId");
    var setting_basic_Css = document.getElementById("setting_basic_cssId");
    var setting_user_mng_Css = document.getElementById("setting_user_mng_cssId");
    var setting_network_Css = document.getElementById("setting_network_cssId");
    var setting_maintenace_Css = document.getElementById("setting_maintenace_cssId");
    var camera_controller_setting_Css = document.getElementById("camera_controller_setting_cssId");
    var setting_status_Css = document.getElementById("setting_status_cssId");
    var setting_signals_Css = document.getElementById("setting_signals_cssId");
    if (!Platform.isTouchMode()) {
        control_Css.href = "/css/pc/control_touch.css";
        camera_live_area_Css.href = "/css/pc/camera_live_area_touch.css";
        display_base_Css.href = "/css/pc/display_base_touch.css";
        tracking_controller_Css.href = "/css/pc/tracking_controller_touch.css";
        common_function_Css.href = "/css/pc/common_function_touch.css";
        slider_Css.href = "/css/pc/slider_touch.css";
        setup_main_menu_Css.href = "/css/pc/setup_main_menu_touch.css";
        setting_imageOrAudio_Css.href = "/css/pc/setting_imageOrAudio_touch.css";
        setting_mediaOverIp_Css.href = "/css/pc/setting_mediaOverIp_touch.css";
        setting_basic_Css.href = "/css/pc/setting_basic_touch.css";
        setting_user_mng_Css.href = "/css/pc/setting_user_mng_touch.css";
        setting_network_Css.href = "/css/pc/setting_network_touch.css";
        setting_maintenace_Css.href = "/css/pc/setting_maintenace_touch.css";
        camera_controller_setting_Css.href = "/css/pc/camera_controller_setting_touch.css";
        setting_status_Css.href = "/css/pc/setting_status_touch.css";
        setting_signals_Css.href = "/css/pc/setting_signals_touch.css";

        if ($(".setup_imageAdjust_control_matrix_btn").hasClass('on')) {
            slider_Css.href = "/css/pc/slider.css";
        }

        Platform.setIsTouchMode(true);

        if(isPageFlg == "admin"){
            initMainMenuScroll(true);
        }
    } else {
        control_Css.href = "/css/pc/control.css";
        camera_live_area_Css.href = "/css/pc/camera_live_area.css";
        display_base_Css.href = "/css/pc/display_base.css";
        tracking_controller_Css.href = "/css/pc/tracking_controller.css";
        common_function_Css.href = "/css/pc/common_function.css";
        slider_Css.href = "/css/pc/slider.css";
        setup_main_menu_Css.href = "/css/pc/setup_main_menu.css";
        setting_imageOrAudio_Css.href = "/css/pc/setting_imageOrAudio.css";
        setting_mediaOverIp_Css.href = "/css/pc/setting_mediaOverIp.css";
        setting_basic_Css.href = "/css/pc/setting_basic.css";
        setting_user_mng_Css.href = "/css/pc/setting_user_mng.css";
        setting_network_Css.href = "/css/pc/setting_network.css";
        setting_maintenace_Css.href = "/css/pc/setting_maintenace.css";
        camera_controller_setting_Css.href = "/css/pc/camera_controller_setting_live.css";
        setting_status_Css.href = "/css/pc/setting_status.css";
        setting_signals_Css.href = "/css/pc/setting_signals.css";
        Platform.setIsTouchMode(false);

        if(isPageFlg == "admin"){
            initMainMenuScroll(true);
        }
    }
}

var menuScroll = null;

function initMainMenuScroll(flg){
    if(flg){
        if(menuScroll!=null){
            menuScroll.destroy();
            menuScroll = null;
        }
        setTimeout(function () {
            menuScroll = new IScroll('#setup_menu_scroll', {
                preventDefault: false,
                click: false,
                tap: true,
                scrollbars: false,
                mouseWheel: true,
                interactiveScrollbars: true,
                shrinkScrollbars: 'scale',
                fadeScrollbars: false,
                useTransform: false
            });
            buildScrollSuccessFlg = true;
        }, 1000)
    }else{
        if(menuScroll!=null){
            menuScroll.destroy();
            menuScroll = null;
        }
    }
}

function onLoadProcess () {
    	isOnloadFlg = true;
        $("#camera_controller_gui").removeAttr("style");
        if(isPageFlg == "live"){
            if(gPower == 1){
                if(!IsIE()){
                    $("#base").css("visibility","hidden");
                }
                //20200923
                if(!adminPage){
                    menubarCtrl.show();
                    menubarCtrl.streamControler.InitLeftPage();
                }

                window.frames["mainViewHtml"].document.getElementsByTagName("body")[0].style.transform = "scale(" + 0.001 + ")";
            }else{
            }
        }
        setTimeout(function(){
            windowsZoomControlOnResize("onload");

            if(Math.abs(document.body.offsetWidth*currentZoomValue-$(window).width())<10 || isMobile){
                currentWidth = 1120;
                if(currentWindowWidth >= 1250){
                    $('body').css("width", currentWidth + "px");
                    windowsZoomControl(currentWidth, SettingConst.WEB_APL_WINDOW_HEIGHT);

                    setTimeout(function(){
                        var imageWidth = $('body').width() - document.getElementById('camera_controller_gui').offsetWidth - document.getElementById('camera_live_area').offsetWidth -56;
                        if(currentWindowWidth>=1450){
                            $("#tracking_controller").css("left", ( 277) + "px");
                        }


                        changeFlg = true;
                        if(IsIE()){
                            windowsIeZoomControl(imageWidth, SettingConst.WEB_APL_WINDOW_HEIGHT);
                            if(window.frames["mainViewHtml"].document.WebVideo) {
                                window.frames["mainViewHtml"].document.WebVideo.ViewWidth = imageWidth * currentZoomValue;
                                window.frames["mainViewHtml"].document.WebVideo.ViewHeight = (imageWidth / 16 * 9) * currentZoomValue;
                            }
                        }else{
                            $("#tracking_controller").css("width",imageWidth+"px");
                            $('#iris_setting_mask').css("width", imageWidth + "px");
                            $('#iris_setting_mask').css("height", (imageWidth / 16 * 9)+ "px");
                        }

                        $('body').css("width", (imageWidth) + document.getElementById('camera_controller_gui').offsetWidth + document.getElementById('camera_live_area').offsetWidth + "px");
                        windowsIsResize();
                    },300);



                }else{
                    var left = document.getElementById('camera_controller_gui').offsetLeft;
                    var mainView = (left - 280)/2-currentWindowWidth/2;
                    if(mainView>1){
                        $("#tracking_controller").css("left",(mainView+280)+"px");
                    }else{
                        $("#tracking_controller").css("left",(280)+"px");
                    }
                    $("#base").css("visibility","");
                }

            }else{
                isChangeHeight();
            }


            $("#dialog_setup").hide();
            document.getElementById('setupBody').scrollTop = 0;
            if(isMobile && isPageFlg == "admin"){
                $('#setupBody').css("width","1920px");
            }
            isCenteredPageForLive();

            if(gPower == 0){
                menubarCtrl.show();
                document.getElementById("mainViewHtml").src = "/live/mainview_standby.html";
                $("#power").css("color","rgb(74, 241, 9)")
                $(".txt_show_title").css("color","rgb(255, 255, 254)");
            }else{

            }
        },2000);

        if(isMobile){
            var lastTouchEnd = 0;
            document.addEventListener('touchstart', function(event) {
                if (event.touches.length > 1) {
                    event.preventDefault();
                }
            });
            document.addEventListener('touchend', function(event) {
                var now = (new Date()).getTime();
                if (now - lastTouchEnd <= 300) {
                    event.preventDefault();
                }
                lastTouchEnd = now;
            }, false);

            document.addEventListener('gesturestart', function(event) {
                event.preventDefault();
            });
        }
}

function htmlEncodeJQ ( str ) {
    return $('<span/>').text( str ).html();
}

function htmlDecodeJQ ( str ) {
    return $('<span/>').html( str ).text();
}

function isCenteredPageForLive(){
    if(isPageFlg == "admin" ){
        isChangeHeight();
    }
    $(window).bind( 'orientationchange', function(e){
        //$("#base").css("visibility","hidden");
            if(window.orientation==180||window.orientation==0||window.orientation==90||window.orientation==-90){
                isChangeHeight(window.orientation);
            }
    });

}

function isChangeHeight(corner){
    if(isPageFlg == "admin" && !isOnloadFlg){
        //$("#base").css("visibility","hidden");
    }
    if(document.getElementById("camera_setup").style.display == "none"){
        if(adminPage){
            return;
        }
    }

    isOnloadFlg = false;
    var _TIME;
    if(isMobile){
        _TIME = 400;
    }else{
        _TIME = 300;
    }
    setTimeout(function(){

        const isHeight = ($(window).height()- (($("#camera_live_area").height()+$("#base_header").height())*currentZoomValue))/2;
        let isTop = isHeight/currentZoomValue;
        if(isTop<0){
            isTop = 0;
        }

        $("#setupDiv").css("top",isTop+"px");

        $("#setupDiv").show();
        const screen = window.screen.availWidth/window.screen.availHeight;
        $("#base").css("visibility","");
        if(Platform.isTouchMode()){
            const left = $("#camera_controller_gui").offset().left/currentZoomValue;
            // if(left<= 720){
            //     $(".btn_changetotouch").addClass("btn_changetotouch_mobile").css("right","90px");;
            //     $(".btn_changetomobile").addClass("btn_changetomobile_touch");
            //     $(".btn_preset_list").addClass("btn_preset_list_touch");
            //     $(".btn_tracking").removeClass("btn_tracking_mobile").addClass("btn_tracking_mobile_touch");
            //     $("#power").css("width","120px");
            // }else{
            //     $(".btn_changetotouch").addClass("btn_changetotouch_mobile");
            //     $(".btn_changetomobile").addClass("btn_changetomobile_touch");
            //     $(".btn_preset_list").addClass("btn_preset_list_pc_touch");
            //     $(".btn_tracking").removeClass("btn_tracking_mobile").addClass("btn_tracking_mobile_touch");
            //     $("#power").css("width","120px");
            //     $(".btn_changetotouch_mobile").css("right","90px");
            // }
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
            }else{
                $(".btn_changetotouch").removeClass("btn_changetotouch_mobile")
                $(".btn_changetomobile").removeClass("btn_changetomobile_touch");
                $(".btn_preset_list").removeClass("btn_preset_list_pc_touch").removeClass("btn_preset_list_pc_touch").removeClass("btn_preset_list_touch");
                $(".btn_tracking").removeClass("btn_tracking_mobile_touch").addClass("btn_tracking_mobile");
            }
        }else{
            $(".btn_changetotouch").removeClass("btn_changetotouch_mobile");
            $(".btn_changetomobile").removeClass("btn_changetomobile_touch");
            $(".btn_preset_list").removeClass("btn_preset_list_touch").removeClass("btn_preset_list_pc_touch");
            $(".btn_tracking").removeClass("btn_tracking_mobile_touch").addClass("btn_tracking_mobile");
            $(".btn_changetotouch ").css("right","");
        }
    },_TIME)
}

let changeFlg = false;

function windowsIsResize(){
   try{
       setTimeout(function(){
           if(document.getElementById("camera_setup").style.display == "none"){
               if(adminPage){
                   return;
               }
               $("#camera_controller_gui").removeAttr("style");
               var windowWidth = $(window).width();
               var zoomValue = windowWidth / currentZoomValue;

               $('body').css("width", zoomValue + "px");
               $('#base_header').css("width", zoomValue + "px");
               $('#preset_list_area').css("width", zoomValue + "px");
               var imageWidth = $('body').width() - document.getElementById('camera_controller_gui').offsetWidth - document.getElementById('camera_live_area').offsetWidth -56;
               if(currentWindowWidth>=1920){
                   currentWindowWidth = 1450;
               }
               if(!IsIE()){
                   setTimeout(function(){
                       if(document.getElementById("mainViewHtml").contentWindow.document.getElementsByTagName("body")[0] !== undefined) {
                            document.getElementById("mainViewHtml").contentWindow.document.getElementsByTagName("body")[0].style.transform = "scale(" + 1 + ")";
                       }
                   },200);
               }
               if(imageWidth>=currentWindowWidth ){
                   windowsZoomControlOnResize();
                   var realWidth = currentZoomValue >= 1 ? currentWindowWidth - 100 : currentWindowWidth;
                   if (currentZoomValue >= 1) {
                       var left = document.getElementById('camera_controller_gui').offsetLeft;
                       var mainView = currentWindowWidth / 2 - (left - 270) / 2;
                       if (Math.abs(mainView) > 1) {
                           $("#tracking_controller").css("left", (Math.abs(mainView) + 270) + "px");
                       } else {
                           $("#tracking_controller").css("left", (277) + "px");
                       }
                   }
                   if(IsIE()){
                       if(window.frames["mainViewHtml"].document.WebVideo) {
                           window.frames["mainViewHtml"].document.getElementById("div_tally").style.width = window.frames["mainViewHtml"].document.WebVideo.width;
                           window.frames["mainViewHtml"].document.getElementById("div_tally_1").style.width = window.frames["mainViewHtml"].document.WebVideo.width;
                           window.frames["mainViewHtml"].document.getElementById("div_tally_2").style.width = window.frames["mainViewHtml"].document.WebVideo.width;
                           window.frames["mainViewHtml"].document.WebVideo.ViewWidth = realWidth*currentZoomValue;
                           window.frames["mainViewHtml"].document.WebVideo.ViewHeight = (realWidth/16*9)*currentZoomValue;

                       }
                       setTimeout(function(){
                           document.getElementById("mainViewHtml").contentWindow.document.getElementsByTagName("body")[0].style.transform = "scale(" + 1 + ")";
                           currentIeZoomValue = 1;
                       },500);
                   }else{
                       if(window.frames["mainViewHtml"].document.getElementById("WebVideo")){
                           window.frames["mainViewHtml"].document.getElementById("WebVideo").style.width = realWidth;
                           window.frames["mainViewHtml"].document.getElementById("WebVideo").style.height = realWidth/16*9;
                           window.frames["mainViewHtml"].document.getElementById("div_tally").style.width = realWidth;
                           window.frames["mainViewHtml"].document.getElementById("div_tally_1").style.width = realWidth;
                           window.frames["mainViewHtml"].document.getElementById("div_tally_2").style.width = realWidth;
                       }


                   }
                   $("#tracking_controller").css("width",realWidth+"px");
                   $('#iris_setting_mask').css("width", realWidth + "px");
                   $('#iris_setting_mask').css("height", (realWidth / 16 * 9) + "px");
                   isChangeHeight();
               }else{
                    windowsZoomControlOnResize();
                   if($('body').width()>1120){
                       changeFlg = true;
                       if(Math.abs(document.body.offsetWidth*currentZoomValue-$(window).width())<10){
                        //    windowsZoomControl(1120, SettingConst.WEB_APL_WINDOW_HEIGHT);
                        windowsZoomControl($('body').width(), SettingConst.WEB_APL_WINDOW_HEIGHT);
                       }else{
                           windowsZoomControl($('body').width(), SettingConst.WEB_APL_WINDOW_HEIGHT);
                       }
                       let imageWidth = $('body').width() - document.getElementById('camera_controller_gui').offsetWidth - document.getElementById('camera_live_area').offsetWidth -56;
                       if(imageWidth>=1450){
                           imageWidth = 1450;
                       }
                       if(IsIE()){
                           windowsIeZoomControl(imageWidth, SettingConst.WEB_APL_WINDOW_HEIGHT);
                           if(window.frames["mainViewHtml"].document.WebVideo){
                               window.frames["mainViewHtml"].document.WebVideo.ViewWidth = imageWidth*currentZoomValue;
                               window.frames["mainViewHtml"].document.WebVideo.ViewHeight = (imageWidth/16*9)*currentZoomValue;
                               window.frames["mainViewHtml"].document.getElementById("div_tally").style.width = window.frames["mainViewHtml"].document.WebVideo.width;
                               window.frames["mainViewHtml"].document.getElementById("div_tally_1").style.width = window.frames["mainViewHtml"].document.WebVideo.width;
                               window.frames["mainViewHtml"].document.getElementById("div_tally_2").style.width = window.frames["mainViewHtml"].document.WebVideo.width;
                           }

                       }else{
                            if( window.frames["mainViewHtml"].document.getElementById("WebVideo")){
                                window.frames["mainViewHtml"].document.getElementById("WebVideo").style.width = imageWidth;
                                window.frames["mainViewHtml"].document.getElementById("WebVideo").style.height = imageWidth/16*9;
                                window.frames["mainViewHtml"].document.getElementById("div_tally").style.width = imageWidth;
                                window.frames["mainViewHtml"].document.getElementById("div_tally_1").style.width = imageWidth;
                                window.frames["mainViewHtml"].document.getElementById("div_tally_2").style.width = imageWidth;
                            }

                       }
                       $("#tracking_controller").css("width",imageWidth+"px");
                       $('#iris_setting_mask').css("width", imageWidth + "px");
                       $('#iris_setting_mask').css("height", (imageWidth / 16 * 9) + "px");
                       const left = document.getElementById('camera_controller_gui').offsetLeft;
                       let mainView = (left - 280)/2-(imageWidth)/2;
                       if(mainView>1){
                           $("#tracking_controller").css("left",(mainView+280)+"px");
                       }else{
                           $("#tracking_controller").css("left",(280)+"px");
                       }
                   }else{


                       let viewWidth;
                       if(changeFlg){
                           windowsZoomControl(1121, SettingConst.WEB_APL_WINDOW_HEIGHT);

                           imageWidth = $('body').width() - document.getElementById('camera_controller_gui').offsetWidth - document.getElementById('camera_live_area').offsetWidth -56;
                           if(IsIE()){
                               windowsIeZoomControl(imageWidth, SettingConst.WEB_APL_WINDOW_HEIGHT);
                               if(window.frames["mainViewHtml"].document.WebVideo) {
                                   window.frames["mainViewHtml"].document.WebVideo.ViewWidth = imageWidth / currentZoomValue;
                                   window.frames["mainViewHtml"].document.WebVideo.ViewHeight = (imageWidth / 16 * 9) / currentZoomValue;
                                   window.frames["mainViewHtml"].document.getElementById("div_tally").style.width = window.frames["mainViewHtml"].document.WebVideo.width;
                                   window.frames["mainViewHtml"].document.getElementById("div_tally_1").style.width = window.frames["mainViewHtml"].document.WebVideo.width;
                                   window.frames["mainViewHtml"].document.getElementById("div_tally_2").style.width = window.frames["mainViewHtml"].document.WebVideo.width;
                                }
                           }else{
                                if(window.frames["mainViewHtml"].document.getElementById("WebVideo")){
                                    window.frames["mainViewHtml"].document.getElementById("WebVideo").style.width = imageWidth/ currentZoomValue;
                                    window.frames["mainViewHtml"].document.getElementById("WebVideo").style.height = imageWidth/currentZoomValue/16*9;
                                    window.frames["mainViewHtml"].document.getElementById("div_tally").style.width =   imageWidth/ currentZoomValue;
                                    window.frames["mainViewHtml"].document.getElementById("div_tally_1").style.width =  imageWidth/ currentZoomValue;
                                    window.frames["mainViewHtml"].document.getElementById("div_tally_2").style.width =  imageWidth/ currentZoomValue;
                                }

                           }
                           mainViewIsResize();
                       }else{
                           windowsZoomControl(1121, SettingConst.WEB_APL_WINDOW_HEIGHT);
                           viewWidth = 280;

                           mainViewIsResize();

                       }

                   }

               }

           }else{
               windowsZoomControlOnResize();
           }
           $("#header_center").css("left","50%");
           if(document.getElementById('header_center').offsetLeft <= 620){
               $("#header_center").css("left","620px");
           }
           isChangeHeight();
       },200);
   }catch (e){

   }
}
var firstFlg = true;
function presetListresize(){
    const listWidth = (174+15)*10-15;
    const listheight =126*5+(30*6);
    const divZoom = controllerPosition/(listWidth+50);
    const divleft = (controllerPosition - listWidth*divZoom)/2;
    const divtop = (1115-listheight*divZoom)/2 < 30 ? 30 :(1115-listheight*divZoom)/2;
    if(divtop > 30 || firstFlg){
        if(firstFlg){
            $("#preset_list_area").hide();
            firstFlg = false;
        }

        $("#preset_area").css({
            "top":divtop+"px"
        });
        $("#preset_area").css({
            "transform":"scale(" + divZoom + ") ",
            "left":divleft+"px"
        });
    }else{
        try{
            let zoom = $("#preset_area").css("transform").replace(/[^0-9\-,]/g,'').split(',')[0];
            console.log(zoom);
            zoom = zoom.substring(0,1)+"."+zoom.substring(1,zoom.length);
            var left = ($("#base_header").width()-1875*zoom)/2;
            $("#preset_area").css("left",left+"px");
        }catch(e){
            //なし
        }

    }
}

function mainViewIsResize(){

    try{
        setTimeout(function(){


            $("#camera_controller_gui").removeAttr("style");
            const windowWidth = $(window).width();
            const zoomValue = windowWidth / currentZoomValue;

            $('body').css("width", zoomValue + "px");
            $('#base_header').css("width", zoomValue + "px");
            let imageWidth = $('body').width() - document.getElementById('camera_controller_gui').offsetWidth - document.getElementById('camera_live_area').offsetWidth -56;
            if(imageWidth>=1920){
                imageWidth = 1450;
            }


            changeFlg = true;
            if(IsIE()){
                windowsIeZoomControl(imageWidth, SettingConst.WEB_APL_WINDOW_HEIGHT);
                if(window.frames["mainViewHtml"].document.WebVideo) {
                    window.frames["mainViewHtml"].document.WebVideo.ViewWidth = imageWidth * currentZoomValue;
                    window.frames["mainViewHtml"].document.WebVideo.ViewHeight = (imageWidth / 16 * 9) * currentZoomValue;
                    window.frames["mainViewHtml"].document.getElementById("div_tally").style.width = window.frames["mainViewHtml"].document.WebVideo.width;
                    window.frames["mainViewHtml"].document.getElementById("div_tally_1").style.width = window.frames["mainViewHtml"].document.WebVideo.width;
                    window.frames["mainViewHtml"].document.getElementById("div_tally_2").style.width = window.frames["mainViewHtml"].document.WebVideo.width;
                }
            }else{
                if(window.frames["mainViewHtml"].document.getElementById("WebVideo")){
                    window.frames["mainViewHtml"].document.getElementById("WebVideo").style.width = imageWidth;
                    window.frames["mainViewHtml"].document.getElementById("WebVideo").style.height = imageWidth/16*9;
                    window.frames["mainViewHtml"].document.getElementById("div_tally").style.width =   imageWidth;
                    window.frames["mainViewHtml"].document.getElementById("div_tally_1").style.width =  imageWidth;
                    window.frames["mainViewHtml"].document.getElementById("div_tally_2").style.width =  imageWidth;
                }

            }

            $("#tracking_controller").css("width",imageWidth+"px");
            $('#iris_setting_mask').css("width", imageWidth + "px");
            $('#iris_setting_mask').css("height", (imageWidth / 16 * 9) + "px");
            const left = document.getElementById('camera_controller_gui').offsetLeft;
            const mainView = (left - 280)/2-(imageWidth)/2;
            if(mainView>1){
                $("#tracking_controller").css("left",(mainView+280)+"px");
            }else{
                $("#tracking_controller").css("left",(280)+"px");
            }
        },300);
    }catch (e){

    }
}

function sendJpegConnectStop(url){
    $.get(url);
}
function mainViewStopLive() {
    try{
        window.frames["mainViewHtml"].mainview_StopLive();
    }catch (e){

    }

}

/**
 * ページエリア制御クラス
 * @class ページエリア制御クラス
 * @param {string} pageAreaDiv 追加対象となる画面構成要素のID
 * @param {number} displayPageNumber CSSクラス名
 * @param {function} callbackButtonClick コールバック関数
 * @constructor
 */
function PageCtrl(pPageAreaDiv, pDisplayPageNumber, callbackButtonClick, pageType) {
    /**
     * CSS設定対象ID
     * @type stringPage
     */
    var pageAreaDiv = pPageAreaDiv;

    /**
     * CSSクラス名称
     * @type string
     */
    var displayPageNumber = pDisplayPageNumber;

    /**
     * 画面に表示する文字
     * @type number
     */
    var currentTotalPageNumber = 1;

    /**
     * マウスカーソル時のポップアップテキスト
     * @type number
     */
    var currentPage = 0;

    /**
     * 画面要素(ページNoテキスト)
     * @type object
     */
    var btnPage = [];

    /**
     * 画面要素(前ページ遷移ボタン)
     * @type object
     */
    var btnPagePrev;

    /**
     * 画面要素(次ページ遷移ボタン)
     * @type object
     */
    var btnPageNext;

    /**
     * 画面要素(先頭ページ遷移ボタン)
     * @type object
     */
    var btnPageTop;

    /**
     * 画面要素(最終ページ遷移ボタン)
     * @type object
     */
    var btnPageEnd;

    /**
     * テキストボタンオブジェクト設定
     */
    function initPageList() {

        // ページ番号、ボタンの構築
        btnPagePrev = ButtonCtrl(pageAreaDiv, "btn_list_page_prev", "<", setPagePrev);
        if (2 < displayPageNumber && displayPageNumber < 5) {
            btnPageNext = ButtonCtrl(pageAreaDiv, "btn_list_page_next_4", ">", setPageNext);
        } else if (2 == displayPageNumber) {
            btnPageNext = ButtonCtrl(pageAreaDiv, "btn_list_page_next_2", ">", setPageNext);
        } else {
            btnPageNext = ButtonCtrl(pageAreaDiv, "btn_list_page_next", ">", setPageNext);
        }
        btnPagePrev.show();
        btnPageNext.show();

        for (var p = 0; p < displayPageNumber; p++) {
            btnPage[p] = $('<div class="btn_page_no"><p>' + (p + 1) + '</p></div>');
            btnPage[p].addClass('disable');
            btnPage[p].css({
                left: (70 + 32 * p) + 'px'
            });
            $('#' + pageAreaDiv).append(btnPage[p]);
            btnPage[p].click(setPage);
            btnPage[p].show();
        }

        if (pageType) {
            if (2 < displayPageNumber && displayPageNumber < 5) {
                btnPageTop = ButtonCtrl(pageAreaDiv, "btn_list_page_top", "|<", setPageTop);
                btnPageEnd = ButtonCtrl(pageAreaDiv, "btn_list_page_end_4", ">|", setPageEnd);
                btnPageTop.show();
                btnPageEnd.show();
            } else {
                btnPageTop = ButtonCtrl(pageAreaDiv, "btn_list_page_top", "|<", setPageTop);
                btnPageEnd = ButtonCtrl(pageAreaDiv, "btn_list_page_end", ">|", setPageEnd);
                btnPageTop.hide();
                btnPageEnd.hide();
            }
        } else {
            btnPageTop = ButtonCtrl(pageAreaDiv, "btn_list_page_top", "<<", setPageTop);
            btnPageEnd = ButtonCtrl(pageAreaDiv, "btn_list_page_end", ">>", setPageEnd);
            btnPageTop.show();
            btnPageEnd.show();
        }


    }

    /**
     * ページNoボタン押下時処理
     */
    function setPage() {
        // 遷移先ページ決定
        if (this.classList[1] != "disable") {
            currentPage = Number(this.innerText) - 1;
            if (displayPageNumber < 5) {
                callbackButtonClick(true);
            } else {
                callbackButtonClick(false);
            }
        }
    }

    /**
     * 前ページ遷移ボタン押下時処理
     * @param {number} mouse マウスイベント引数
     */
    function setPagePrev(mouse) {
        if (mouse == Button.MOUSE_DOWN) {
            btnPagePrev.displayOn();
            currentPage = currentPage - 1;
            if (currentPage < 0) {
                currentPage = 0;
            }
            if (displayPageNumber < 5) {
                callbackButtonClick(true);
            } else {
                callbackButtonClick(false);
            }
        }
    }

    /**
     * 次ページ遷移ボタン押下時処理
     * @param {number} mouse マウスイベント引数
     */
    function setPageNext(mouse) {
        if (mouse == Button.MOUSE_DOWN) {
            btnPageNext.displayOn();
            currentPage = currentPage + 1;
            if (currentPage > currentTotalPageNumber - 1) {
                currentPage = currentTotalPageNumber - 1;
            }
            if (displayPageNumber < 5) {
                callbackButtonClick(true);
            } else {
                callbackButtonClick(false);
            }
        }
    }

    /**
     * 先頭ページ遷移ボタン押下時処理
     * @param {number} mouse マウスイベント引数
     */
    function setPageTop(mouse) {
        if (mouse == Button.MOUSE_DOWN) {
            btnPageTop.displayOn();
            currentPage = currentPage - displayPageNumber;
            if (currentPage < 0) {
                currentPage = 0;
            }
            if (displayPageNumber < 5) {
                callbackButtonClick(true);
            } else {
                callbackButtonClick(false);
            }
        }
    }

    /**
     * 最終ページ遷移ボタン押下時処理
     * @param {number} mouse マウスイベント引数
     */
    function setPageEnd(mouse) {
        if (mouse == Button.MOUSE_DOWN) {
            btnPageEnd.displayOn();
            currentPage = currentPage + displayPageNumber;
            if (currentPage > currentTotalPageNumber - 1) {
                currentPage = currentTotalPageNumber - 1;
            }
            if (displayPageNumber < 5) {
                callbackButtonClick(true);
            } else {
                callbackButtonClick(false);
            }
        }
    }

    /**
     * ページボタンの表示更新制御
     */
    function updatePageButtonControl() {
        // currentPage=0なら前頁ボタンは無効
        if (currentPage <= 0) {
            btnPagePrev.displayDisabled();
        } else {
            btnPagePrev.displayOff();
        }

        // currentPage=currentTotalPageNumber-1なら次項ボタンは無効
        if (currentPage >= currentTotalPageNumber - 1) {
            btnPageNext.displayDisabled();
        } else {
            btnPageNext.displayOff();
        }

        // 最初の5ページ分が表示されているなら"<<"ボタンは無効
        if (parseInt(currentPage / displayPageNumber) === 0) {
            btnPageTop.displayDisabled();
        } else {
            btnPageTop.displayOff();
        }

        // 最終の5ページ分が表示されているなら">>"ボタンは無効
        var max_page_num = Math.ceil(currentTotalPageNumber / displayPageNumber) * displayPageNumber;
        if ((max_page_num - currentPage) <= displayPageNumber) {
            btnPageEnd.displayDisabled();
        } else {
            btnPageEnd.displayOff();
        }

        // ボタンの描画
        var weight = Math.floor(currentPage / displayPageNumber);
        for (var i = 0; i < displayPageNumber; i++) {
            var p = weight * displayPageNumber + i;
            btnPage[i][0].innerText = (p + 1).toString();

            if (p == currentPage) {
                // 選択中ページ
                btnPage[i].addClass('on');
                btnPage[i].removeClass('off');
                btnPage[i].removeClass('disable');
            } else {
                // 非選択ページ
                if (p < currentTotalPageNumber) {
                    // 選択可能
                    btnPage[i].removeClass('on');
                    btnPage[i].addClass('off');
                    btnPage[i].removeClass('disable');
                } else {
                    // 選択不可
                    btnPage[i].removeClass('on');
                    btnPage[i].removeClass('off');
                    btnPage[i].addClass('disable');
                }
            }
        }
    }

    initPageList();

    return {
        updatePageButtonControl: function (pCurrentTotalPageNumber) {
            currentTotalPageNumber = pCurrentTotalPageNumber;
            updatePageButtonControl();
        },
        setCurrentPage: function (value) {
            currentPage = value;
        },
        getCurrentPage: function () {
            return currentPage;
        },
        setPagePrev: setPagePrev,
        setPageNext: setPageNext
    };
}
// liqiang
/**
 * ページエリア制御クラス
 * @class ページエリア制御クラス
 * @param {string} pageAreaDiv 追加対象となる画面構成要素のID
 * @param {number} displayPageNumber CSSクラス名
 * @param {string} ImgUrl コールバック関数
 * @constructor
 */
 function ImgCtrl(pPageAreaDiv, pImgUrl,imgX,imgY,width,height, tilte, tilteX, tilteY) {
    /**
     * CSS設定対象ID
     * @type stringPage
     */
     var pageAreaDiv = pPageAreaDiv;

     /**
      * url
      * @type string
      */
      var ImgUrl = pImgUrl;

    var canvas=document.getElementById(pageAreaDiv);
    var ctx=canvas.getContext('2d');
    ctx.translate(0, 0);

    var img2 = new Image();
    img2.onload = function() {
        ctx.drawImage(img2,imgX,imgY,width,height);
    }
    img2.src= ImgUrl;
    ctx.restore();

    ctx.save();
    if (tilte != "") {
        ctx.font="bold 20px Georgia";
        ctx.fillStyle="#FFFFFF";
        ctx.fillText(tilte,tilteX,tilteY);
        ctx.restore();
    }
 }
