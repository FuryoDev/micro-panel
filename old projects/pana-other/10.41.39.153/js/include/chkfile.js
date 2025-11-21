/**
 * check the directory of the file
 * @param sDir
 * @returns {boolean}
 */
function chkfile_directory(sDir) {
    if (sDir.length == 0) {
        objErrCode = MSG_STATUS.mID_0009;
        return false;
    }
    var sSymbol = "!#$%'()*+,-./:<=>?@[\\]^_`{|}~";
    if (!capi_isAlphaNumSymbol(sDir, sSymbol)) {
        objErrCode = MSG_STATUS.mID_0009;
        return false;
    }
    return true;
}

/**
 * check name of the file
 * @param sFile
 * @returns {boolean}
 */
function chkfile_filename(sFile) {
    if (sFile.length == 0) {
        objErrCode = MSG_STATUS.mID_0004;
        return false;
    }
    var sSymbol = "!#$%'()+,-.=@[]^_`{}~";
    if (!capi_isAlphaNumSymbol(sFile, sSymbol)) {
        objErrCode = MSG_STATUS.mID_0009;
        return false;
    }
    return true;
}

/**
 * check the path of file
 * @param sFile
 * @returns {boolean}
 */
function chkfile_uploadBackupFilename(sFile) {
    if (sFile.length == 0) {
        objErrCode = MSG_STATUS.mID_0004;
        return false;
    }
    if (sFile.length > 250) {
        objErrCode = MSG_STATUS.mID_0009;
        return false;
    }
    if (capi_IncludeSpace(sFile) || capi_includeZenkaku(sFile)) {
        objErrCode = MSG_STATUS.mID_0044;
        return false;
    }
    var sSymbol = "!#$%'()*+,-./:<=>?@[\\]^_`{|}~";
    if (!capi_isAlphaNumSymbol(sFile, sSymbol)) {
        objErrCode = MSG_STATUS.mID_0009;
        return false;
    }
    return true;
}

/**
 * check the path of file name
 * @param sFile
 * @returns {boolean}
 */
function chkfile_uploadFilename(sFile) {
    var lastIndex = 0;
    if (sFile.length == 0) {
        objErrCode = MSG_STATUS.mID_0004;
        return false;
    }
    if (sFile.length > 250) {
        objErrCode = MSG_STATUS.mID_0009;
        return false;
    }
    if (capi_IncludeSpace(sFile) || capi_includeZenkaku(sFile)) {
        objErrCode = MSG_STATUS.mID_0012;
        return false;
    }
    var sSymbol = "!#$%'()*+,-./:<=>?@[\\]^_`{|}~";
    if (!capi_isAlphaNumSymbol(sFile, sSymbol)) {
        objErrCode = MSG_STATUS.mID_0009;
        return false;
    }
    // lastIndex = sFile.lastIndexOf(".img");
    // if (( lastIndex < 0 ) || ( lastIndex != ( sFile.length - 4) )) {
    //     objErrCode = MSG_STATUS.mID_0009;
    //     return false;
    // }
    return true;
}


/**
 * check the install file name
 * @param sFile
 * @returns {boolean}
 */
function chkfile_installFilename(sFile) {
    if (sFile.length == 0) {
        objErrCode = MSG_STATUS.mID_0004;
        return false;
    }
    if (sFile.length > 250) {
        objErrCode = MSG_STATUS.mID_0009;
        return false;
    }
    if (capi_IncludeSpace(sFile) || capi_includeZenkaku(sFile)) {
        objErrCode = MSG_STATUS.mID_0013;
        return false;
    }
    var sSymbol = "!#$%%'()*+,-./:<=>?@[\\\\]^_`{|}~";
    if (!capi_isAlphaNumSymbol(sFile, sSymbol)) {
        objErrCode = MSG_STATUS.mID_0009;
        return false;
    }
    return true;
}
