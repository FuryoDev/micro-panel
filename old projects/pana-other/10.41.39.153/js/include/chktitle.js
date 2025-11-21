function chktitle_IsValidCameraTitle(sTitle) {
    if (sTitle.length == 0) {
        return true;
    }
    if (capi_includeCtrlCode(sTitle)) {
        objErrCode = MSG_STATUS.mID_0009;
        return false;
    }
    var sInvalid = "&\"";
    for (var iIndex = 0; iIndex < sTitle.length; iIndex++) {
        var cTmp = sTitle.substring(iIndex, iIndex + 1);
        if (sInvalid.indexOf(cTmp) >= 0) {
            objErrCode = MSG_STATUS.mID_0009;
            return false;
        }
    }
    if (capi_includeHalfKana(sTitle)) {
        objErrCode = MSG_STATUS.mID_0009;
        return false;
    }
    return true;
}

function chktitle_IsValidCameraId(sCamId) {
    var strCnt = 0;
    var strLength = 0;
    if (sCamId.length == 0) {
        return true;
    }
    if (capi_includeCtrlCode(sCamId)) {
        objErrCode = MSG_STATUS.mID_0009;
        return false;
    }
    var sInvalid = "ガギグゲゴザジズゼゾダヂヅデドヴ";
    sInvalid += "バビブベボパピプペポ";
    for (var iIndex = 0; iIndex < sCamId.length; iIndex++) {
        var cTmp = sCamId.substring(iIndex, iIndex + 1);
        if (sInvalid.indexOf(cTmp) >= 0) {
            strCnt++;
        }
    }
    if (strCnt > 10) {
        objErrCode = MSG_STATUS.mID_0009;
        return false;
    }
    else {
        strLength = sCamId.length + strCnt;
        if (strLength > 20) {
            objErrCode = MSG_STATUS.mID_0009;
            return false;
        }
    }
    var sInvalid2 = "!\"#$%&'()*+,-./0123456789:;=?";
    sInvalid2 += "ABCDEFGHIJKLMNOPQRSTUVWXYZ ";
    sInvalid2 += "アイウエオカキクケコサシスセソ";
    sInvalid2 += "タチツテトナニヌネノハヒフヘホ";
    sInvalid2 += "マミムメモヤユヨラリルレロワヲンー";
    sInvalid2 += "ァィゥェォッャュョ";
    sInvalid2 += "ガギグゲゴザジズゼゾダヂヅデドヴ";
    sInvalid2 += "バビブベボパピプペポ";
    for (var iIndex = 0; iIndex < sCamId.length; iIndex++) {
        var cTmp = sCamId.substring(iIndex, iIndex + 1);
        if (sInvalid2.indexOf(cTmp) < 0) {
            objErrCode = MSG_STATUS.mID_0009;
            return false;
        }
    }
    return true;
}
