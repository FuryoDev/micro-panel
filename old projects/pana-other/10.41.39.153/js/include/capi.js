var gsCountry = new Array(
    "IS",
    "IE",
    "AZ",
    "AF",
    "US",
    "VI",
    "AS",
    "UM",
    "AE",
    "DZ",
    "AR",
    "AW",
    "AL",
    "AM",
    "AI",
    "AO",
    "AG",
    "AD",
    "YE",
    "GB",
    "IO",
    "VG",
    "IL",
    "IT",
    "IQ",
    "IR",
    "IN",
    "ID",
    "WF",
    "UG",
    "UA",
    "UZ",
    "UY",
    "EC",
    "EG",
    "EE",
    "ET",
    "ER",
    "SV",
    "AU",
    "AT",
    "AX",
    "OM",
    "NL",
    "AN",
    "GH",
    "CV",
    "GG",
    "GY",
    "KZ",
    "QA",
    "CA",
    "GA",
    "CM",
    "GM",
    "KH",
    "MP",
    "GN",
    "GW",
    "CY",
    "CU",
    "GR",
    "KI",
    "KG",
    "GT",
    "GP",
    "GU",
    "KW",
    "CK",
    "GL",
    "CX",
    "GE",
    "GD",
    "HR",
    "KY",
    "KE",
    "CI",
    "CC",
    "CR",
    "KM",
    "CO",
    "CG",
    "CD",
    "SA",
    "WS",
    "ST",
    "BL",
    "ZM",
    "PM",
    "SM",
    "MF",
    "SL",
    "DJ",
    "GI",
    "JE",
    "JM",
    "SY",
    "SG",
    "ZW",
    "CH",
    "SE",
    "SD",
    "SJ",
    "ES",
    "SR",
    "LK",
    "SK",
    "SI",
    "SZ",
    "SC",
    "GQ",
    "SN",
    "RS",
    "KN",
    "VC",
    "SH",
    "LC",
    "SO",
    "SB",
    "TC",
    "TH",
    "KR",
    "TW",
    "TJ",
    "TZ",
    "CZ",
    "TD",
    "CF",
    "CN",
    "TN",
    "KP",
    "CL",
    "TV",
    "DK",
    "DE",
    "TG",
    "TK",
    "DO",
    "DM",
    "TT",
    "TM",
    "TR",
    "TO",
    "NG",
    "NR",
    "NA",
    "AQ",
    "NU",
    "NI",
    "NE",
    "JP",
    "EH",
    "NC",
    "NZ",
    "NP",
    "NF",
    "NO",
    "BH",
    "HT",
    "PK",
    "VA",
    "PA",
    "VU",
    "BS",
    "PG",
    "BM",
    "PW",
    "PY",
    "BB",
    "PS",
    "HU",
    "BD",
    "TL",
    "PN",
    "FJ",
    "PH",
    "FI",
    "BT",
    "BV",
    "PR",
    "FO",
    "FK",
    "BR",
    "FR",
    "GF",
    "PF",
    "TF",
    "BG",
    "BF",
    "BN",
    "BI",
    "HM",
    "VN",
    "BJ",
    "VE",
    "BY",
    "BZ",
    "PE",
    "BE",
    "PL",
    "BA",
    "BW",
    "BO",
    "PT",
    "HK",
    "HN",
    "MH",
    "MO",
    "MK",
    "MG",
    "YT",
    "MW",
    "ML",
    "MT",
    "MQ",
    "MY",
    "IM",
    "FM",
    "ZA",
    "GS",
    "MM",
    "MX",
    "MU",
    "MR",
    "MZ",
    "MC",
    "MV",
    "MD",
    "MA",
    "MN",
    "ME",
    "MS",
    "JO",
    "LA",
    "LV",
    "LT",
    "LY",
    "LI",
    "LR",
    "RO",
    "LU",
    "RW",
    "LS",
    "LB",
    "RE",
    "RU",
    ""
)

/**
 * update error message
 * @param objForm
 * @param objMsg
 * @returns {boolean}
 */
function capi_DispError(objForm, objMsg) {
    jAlert(objMsg,NPTZ_WORDING.wID_0039,function(){
        objForm.focus();
    });
    return false;
}

/**
 * Assignment to strRet by iNums
 * @param iNum
 * @returns {*}
 */
function capi_FormatNum(iNum) {
    var strRet = iNum;
    if (iNum < 10) {
        strRet = "0" + iNum;
    }
    return strRet;
}

/**
 * Assignment to iCnt by sStr/cChar
 * @param sStr
 * @param cChar
 * @returns {number}
 */
function capi_CharCounter(sStr, cChar) {
    var iCnt = 0;
    var iPtr = 0;
    while (iPtr < sStr.length) {
        iPtr = sStr.indexOf(cChar, iPtr);
        if (iPtr == -1) {
            break;
        }
        iCnt++;
        iPtr++;
    }
    return iCnt;
}


/**
 * get includeSpace flag by str
 * @param str
 * @returns {boolean}
 */
function capi_IncludeSpace(str) {
    for (var i = 0; i < str.length; i++) {
        var ch = str.charAt(i);
        if ((ch == ' ') || (ch == '\n') || (ch == '\t')) {
            return true;
        }
    }
    return false;
}

/**
 * get includeCtrlCode flag by str
 * @param str
 * @returns {boolean}
 */
function capi_includeCtrlCode(str) {
    for (var iIndex = 0; iIndex < str.length; iIndex++) {
        cTmp = str.charAt(iIndex);
        iTmp = str.charCodeAt(iIndex);
        if (( 0x00 <= iTmp ) && ( iTmp <= 0x1f )) {
            return true;
        }
    }
    return false;
}

/**
 * get includeHalfKana flag by str
 * @param str
 * @returns {boolean}
 */
function capi_includeHalfKana(str) {
    return false;
}

/**
 * get includeHalfKana flag by str
 * @param str
 * @returns {boolean}
 */
function capi_includeZenkaku(str) {
    for (var i = 0; i < str.length; i++) {
        var c = str.charCodeAt(i);
        if (( c > 255 ) && (( c < 0xff61 ) || ( 0xff9f < c ))) {
            return true;
        }
    }
    return false;
}

/**
 * get isDigit flag by str
 * @param str
 * @returns {boolean}
 */
function capi_isDigit(str) {
    for (var i = 0; i < str.length; i++) {
        var ch = str.charAt(i);
        if (ch < '0' || ch > '9') {
            return false;
        }
    }
    if (( str.length >= 2 ) && ( str.substring(0, 1) == "0" )) {
        return false;
    }
    return true;
}


/**
 * get isAlpha flag by str
 * @param str
 * @returns {boolean}
 */
function capi_isAlpha(str) {
    var sValid = "abcdefghijklmnopqrstuvwxyz";
    var sWork = str.toLowerCase();
    for (var i = 0; i < sWork.length; i++) {
        var ch = sWork.charAt(i);
        if (sValid.indexOf(ch) < 0) {
            return false;
        }
    }
    return true;
}

/**
 * get isAlphaNum flag by str
 * @param str
 * @returns {boolean}
 */
function capi_isAlphaNum(str) {
    var sValid = "abcdefghijklmnopqrstuvwxyz0123456789";
    var sWork = str.toLowerCase();
    for (var i = 0; i < sWork.length; i++) {
        var ch = sWork.charAt(i);
        if (sValid.indexOf(ch) < 0) {
            return false;
        }
    }
    return true;
}

/**
 * get isAlphaNumSymbol flag by str and strSymbol
 * @param str
 * @param strSymbol
 * @returns {boolean}
 */
function capi_isAlphaNumSymbol(str, strSymbol) {
    var sValid = "abcdefghijklmnopqrstuvwxyz0123456789" + strSymbol;
    var sWork = str.toLowerCase();
    for (var i = 0; i < sWork.length; i++) {
        var ch = sWork.charAt(i);
        if (sValid.indexOf(ch) < 0) {
            return false;
        }
    }
    return true;
}

/**
 * get isNumSymbol flag by str and strSymbol
 * @param str
 * @param strSymbol
 * @returns {boolean}
 */
function capi_isNumSymbol(str, strSymbol) {
    var sValid = "0123456789" + strSymbol;
    var sWork = str.toLowerCase();
    for (var i = 0; i < sWork.length; i++) {
        var ch = sWork.charAt(i);
        if (sValid.indexOf(ch) < 0) {
            return false;
        }
    }
    return true;
}

/**
 * get param by obj and len
 * @param obj
 * @param len
 * @returns {string}
 */
function capi_setHexData(obj, len) {
    var i = 0, param = "";
    for (; i < len; i++) {
        param += "0";
    }
    param += obj.toString(16);
    param = param.slice(len * -1);
    return param.toUpperCase();
}

/**
 * get param by obj and len
 * @param obj
 * @param len
 * @returns {string}
 */
function capi_setDecData(obj, len) {
    var i = 0, param = "";
    for (; i < len; i++) {
        param += "0";
    }
    param += obj;
    param = param.slice(len * -1);
    return param;
}

/**
 * get capi_ValueCmp flag by str and strSymbol
 * @param str1
 * @param str2
 * @returns {boolean}
 */
function capi_ValueCmp(str1, str2) {
    if (str1 != str2) {
        return false;
    }
    return true;
}
/**
 * get isIE flag
 * @returns {boolean}
 */
function capi_IsIE() {
    var userAgent = window.navigator.userAgent.toLowerCase();
    if (( userAgent.indexOf("ms ie") != -1 ) || ( userAgent.indexOf("msie") != -1 ) || ( userAgent.indexOf("trident") != -1 )) {
        return true;
    } else {
        return false;
    }
}

function capi_IsEdge() {
    var userAgent = navigator.userAgent;

    if(userAgent.indexOf("Edge") > -1){
        return true;
    }else{
        return false;
    }
}

function capi_IsSafari() {
    var userAgent = window.navigator.userAgent.toLowerCase();

    if (/Safari/.test(navigator.userAgent)) {
        return true;
    }else {
        return false;
    }
}

/**
 * get CmpIEVersion flag by sCmpVersion
 * @param sCmpVersion
 * @returns {boolean}
 */
function capi_CmpIEVersion(sCmpVersion) {
    var userAgent = window.navigator.userAgent;
    var bwInfo;
    var cutSt, cutEd;
    var bwVer;
    bwInfo = userAgent.indexOf("MSIE");
    cutSt = userAgent.indexOf(" ", bwInfo);
    cutEd = userAgent.indexOf(".", cutSt);
    bwVer = userAgent.substring(cutSt + 1, cutEd);
    var iVer = bwVer * 1;
    var iCmpVersion = sCmpVersion * 1;
    if (iVer < iCmpVersion) {
        return false;
    }
    else {
        return true;
    }
}

/**
 * get contryChk flag by str
 * @param str
 * @returns {boolean}
 */
function capi_ContryChk(str) {
    for (var i = 0; gsCountry[i] != ""; i++) {
        if ((str.indexOf(gsCountry[i], 0)) != -1) {
            return true;
        }
    }
    return false;
}
/**
 * get Preset flag by str
 * @returns {boolean}
 */
function getPresetIdStatus(){
    var presetIdListA = cparam_get_presetMaxNumberConfirmation("00");
    var presetIdListB = cparam_get_presetMaxNumberConfirmation("01");
    var presetIdListC = cparam_get_presetMaxNumberConfirmation("02");
    presetIdListA = ('0000000000000000000000000000000000000000' + presetIdListA).slice(-40).toUpperCase();
    presetIdListB = ('0000000000000000000000000000000000000000' + presetIdListB).slice(-40).toUpperCase();
    presetIdListC = ('00000000000000000000' + presetIdListC).slice(-20).toUpperCase();
    return (presetIdListC+presetIdListB+presetIdListA).split('');
}
