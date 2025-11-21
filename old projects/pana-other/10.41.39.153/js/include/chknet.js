/**
 * check if IP is blank or not
 * @param arIP1
 * @param arIP2
 * @param arIP3
 * @param arIP4
 * @returns {boolean}
 */
function chknet_isIpBlank(arIP1, arIP2, arIP3, arIP4) {
    for (iIndex = 1; iIndex <= 4; iIndex++) {
        var sOctet = eval("arIP" + iIndex);
        if (sOctet.length == 0) {
            giErrNum = iIndex;
            return true;
        }
    }
    return false;
}

/**
 * check if IP is digit or not
 * @param arIP1
 * @param arIP2
 * @param arIP3
 * @param arIP4
 * @returns {boolean}
 */
function chknet_IsIpDigit(arIP1, arIP2, arIP3, arIP4) {
    for (var iIndex = 1; iIndex <= 4; iIndex++) {
        if (!capi_isDigit(eval("arIP" + iIndex))) {
            objErrCode = MSG_STATUS.mID_0010;
            giErrNum = iIndex;
            return false;
        }
    }
    return true;
}

/**
 * check the range
 * @param arIP1
 * @param arIP2
 * @param arIP3
 * @param arIP4
 * @returns {boolean}
 */
function chknet_CheckRange(arIP1, arIP2, arIP3, arIP4) {
    var arIP = new Array();
    var iIndex;
    for (iIndex = 1; iIndex <= 4; iIndex++) {
        if (!capi_isDigit(eval("arIP" + iIndex))) {
            objErrCode = MSG_STATUS.mID_0010;
            giErrNum = iIndex;
            return false;
        }
        arIP[iIndex] = parseInt(eval("arIP" + iIndex));
    }
    for (iIndex = 1; iIndex <= 4; iIndex++) {
        if (( arIP[iIndex] < 0 ) || ( arIP[iIndex] > 255 )) {
            objErrCode = MSG_STATUS.mID_0009;
            giErrNum = iIndex;
            return false;
        }
    }
    if (( arIP[1] == 0 ) || (( arIP[1] == 127 ) && ( arIP[2] == 0 ) && ( arIP[3] == 0 ) && ( arIP[4] == 1 ))) {
        objErrCode = MSG_STATUS.mID_0027;
        giErrNum = 1;
        return false;
    }
    if ((arIP[4] == 0 ) || ( arIP[4] == 255 )) {
        objErrCode = MSG_STATUS.mID_0027;
        giErrNum = 4;
        return false;
    }
    if (arIP[1] >= 224) {
        objErrCode = MSG_STATUS.mID_0027;
        giErrNum = 1;
        return false;
    }
    return true;
}

/**
 * check the portNo and address by sPort and strSevrer and ghttpsmode
 * @param sPort
 * @param strSevrer
 * @param ghttpsmode
 * @returns {boolean}
 */
function chknet_portNo(sPort, strSevrer, ghttpsmode) {
    if (sPort.length == 0) {
        objErrCode = MSG_STATUS.mID_0002;
        return false;
    }
    if (!capi_isDigit(sPort)) {
        objErrCode = MSG_STATUS.mID_0010;
        return false;
    }
    var iWork = parseInt(sPort);
    if (( iWork < 1 ) || ( 65535 < iWork )) {
        objErrCode = MSG_STATUS.mID_0009;
        return false;
    }
    if (!chknet_portReservedNo(sPort, strSevrer, ghttpsmode)) {
        return false;
    }
    return true;
}

/**
 * check portNo reserved by strSevrer
 * @param str
 * @param strSevrer
 * @param ghttpsmode
 * @returns {boolean}
 */
function chknet_portReservedNo(str, strSevrer, ghttpsmode) {
    var port = parseInt(str);
    if (strSevrer != "HTTP") {
        if (port == 80) {
            objErrCode = MSG_STATUS.mID_0016;
            return false;
        }
    }
    if (strSevrer != "FTP") {
        if (port == 20 || port == 21) {
            objErrCode = MSG_STATUS.mID_0017;
            return false;
        }
    }
    if (strSevrer != "SMTP") {
        if (port == 25) {
            objErrCode = MSG_STATUS.mID_0018;
            return false;
        }
    }
    if (strSevrer != "DNS") {
        if (port == 42 || port == 53) {
            objErrCode = MSG_STATUS.mID_0019;
            return false;
        }
    }
    if (strSevrer != "tFTP") {
        if (port == 69) {
            objErrCode = MSG_STATUS.mID_0020;
            return false;
        }
    }
    if (strSevrer != "Telnet") {
        if (port == 23) {
            objErrCode = MSG_STATUS.mID_0021;
            return false;
        }
    }
    if (strSevrer != "POP3") {
        if (port == 110 || port == 995) {
            objErrCode = MSG_STATUS.mID_0022;
            return false;
        }
    }
    if (strSevrer != "SNMP") {
        if (port == 161 || port == 162) {
            objErrCode = MSG_STATUS.mID_0023;
            return false;
        }
        if ((strSevrer == "HTTP" || strSevrer == "CMD" || strSevrer == "HTTPS") && (port == 61000)) {
            objErrCode = MSG_STATUS.mID_0028;
            return false;
        }
    }
    if (strSevrer != "NTP") {
        if (port == 123) {
            objErrCode = MSG_STATUS.mID_0024;
            return false;
        }
    }
    if (strSevrer != "BOOTP/DHCP") {
        if (port == 67 || port == 68) {
            objErrCode = MSG_STATUS.mID_0025;
            return false;
        }
    }
    if (strSevrer != "BOOTP") {
        if (port == 10669 || port == 10670) {
            objErrCode = MSG_STATUS.mID_0026;
            return false;
        }
    }
    if (ghttpsmode == 1) {

    }
    if (strSevrer != "HTTPS") {
        if (port == 443) {
            objErrCode = MSG_STATUS.mID_0029;
            return false;
        }
    }
    if (strSevrer != "RTSP") {
        if (port == 554) {
            objErrCode = MSG_STATUS.mID_0028;
            return false;
        }
    }
    if (port >= 59000 && port <= 61000) {
        objErrCode = MSG_STATUS.mID_0028;
        return false;
    }

    if (port == 546 || port == 547 || port == 11900 || (port >= 5960 && port <= 5985)  || (port >= 7960 && port <= 8060 )) {
        objErrCode = MSG_STATUS.mID_0028;
        return false;
    }

    if(['HTTP','NTP','RTSP','SRT','TSL'].indexOf(strSevrer) >= 0){
        if(port == httpsPort){
            objErrCode = MSG_STATUS.mID_0028;
            return false;
        }
    }

    return true;
}

/**
 * check server address by str
 * @param str
 * @returns {boolean}
 */
function chknet_ServerAddress(str) {
    if (chknet_ipaddr_familly(str) == "IPv6") {
        return chknet_IsValidIpv6(str);
    }
    else {
        var strSymbol = "._-";
        if (!capi_isAlphaNumSymbol(str, strSymbol)) {
            objErrCode = MSG_STATUS.mID_0009;
            return false;
        }
        if (!chknet_label(str)) {
            objErrCode = MSG_STATUS.mID_0009;
            return false;
        }
        var arIP = new Array();
        var prepos = 0;
        var index = 0;
        var deli = ".";
        var deli_length = deli.length;
        while (( pos = str.indexOf(deli, prepos)) != -1) {
            arIP[index++] = str.substring(prepos, pos);
            prepos = pos + deli_length;
        }
        arIP[index] = str.substring(prepos);
        if (capi_isNumSymbol(str, deli)) {
            if (index != 3) {
                objErrCode = MSG_STATUS.mID_0009;
                return false;
            }
            else {
                if (!chknet_CheckRange(arIP[0], arIP[1], arIP[2], arIP[3])) {
                    return false;
                }
            }
        }
    }
    return true;
}
/**
 * check server address by str
 * @param str
 * @returns {boolean}
 */
function chknet_ServerHostAddress(str) {
    if (chknet_ipaddr_familly(str) == "IPv6") {
        return chknet_IsValidIpv6(str);
    }
    else {
        var strSymbol = "._-/";
        if (!capi_isAlphaNumSymbol(str, strSymbol)) {
            objErrCode = MSG_STATUS.mID_0009;
            return false;
        }
        if (!chknet_label(str)) {
            objErrCode = MSG_STATUS.mID_0009;
            return false;
        }
        var arIP = new Array();
        var prepos = 0;
        var index = 0;
        var deli = ".";
        var deli_length = deli.length;
        while (( pos = str.indexOf(deli, prepos)) != -1) {
            arIP[index++] = str.substring(prepos, pos);
            prepos = pos + deli_length;
        }
        arIP[index] = str.substring(prepos);
        if (capi_isNumSymbol(str, deli)) {
            if (index != 3) {
                objErrCode = MSG_STATUS.mID_0009;
                return false;
            }
            else {
                if (!chknet_CheckRange(arIP[0], arIP[1], arIP[2], arIP[3])) {
                    return false;
                }
            }
        }
    }
    return true;
}
/**
 * check server address in network by str
 * HE40V2-BUG55486-[15/05/13]
 * @param str
 * @returns {boolean}
 */
function chknet_ServerAddressNetwork(str) {
    if (str.length == 0) {
        objErrCode = MSG_STATUS.mID_0009;
        return false;
    }
    else {
        var strSymbol = "._-:";
        if (!capi_isAlphaNumSymbol(str, strSymbol)) {
            objErrCode = MSG_STATUS.mID_0009;
            return false;
        }
    }
    return true;
}

/**
 * check if ip address is valid or not
 * @param sAddr
 * @returns {boolean}
 */
function chknet_IsValidIpAddress(sAddr) {
    if (chknet_ipaddr_familly(sAddr) == "IPv6") {
        return chknet_IsValidIpv6(sAddr);
    }
    else {
        var iIP = new Array();
        var sSymbol = ".";
        if (capi_CharCounter(sAddr, sSymbol) != 3) {
            objErrCode = MSG_STATUS.mID_0009;
            return false;
        }
        for (var iIndex = 0; iIndex < 4; iIndex++) {
            iIP[iIndex] = sAddr.split(sSymbol)[iIndex];
            if (!capi_isDigit(iIP[iIndex])) {
                objErrCode = MSG_STATUS.mID_0009;
                return false;
            }
            if (iIP[iIndex].length == 0) {
                objErrCode = MSG_STATUS.mID_0009;
                return false;
            }
        }
        return chknet_CheckRange(iIP[0], iIP[1], iIP[2], iIP[3]);
    }
}

/**
 * check the label by str
 * @param str
 * @returns {boolean}
 */
function chknet_label(str) {
    var cnt = 0;
    var next = 0;
    var label = 0;
    while (next != -1) {
        next = str.indexOf(".", cnt);
        if (cnt == 0 && next == -1) {
            label = str.length;
        }
        else if (cnt != 0 && next == -1) {
            label = str.length - cnt;
        }
        else {
            label = next - cnt;
        }
        if (( label < 1 ) || (label > 63 )) {
            return false;
        }
        else {
            cnt = next + 1;
        }
    }
    return true;
}

/**
 * check if Ipv6 is valid or not
 * @param sAddr
 * @returns {boolean}
 */
function chknet_IsValidIpv6(sAddr) {
    var iChar = capi_CharCounter(sAddr, ":");
    if (( sAddr.length > 45 ) || ( iChar > 7 )) {
        objErrCode = MSG_STATUS.mID_0009;
        return false;
    }
    for (var iIndex = 0; iIndex < iChar; iIndex++) {
        if (sAddr.split(":")[iIndex].length > 4) {
            objErrCode = MSG_STATUS.mID_0009;
            return false;
        }
    }
    var sLaOct = sAddr.split(":")[iChar];
    if (capi_CharCounter(sLaOct, ".") == 3) {
        var iIP = new Array();
        for (var iIndex = 0; iIndex < 4; iIndex++) {
            iIP[iIndex] = sLaOct.split(".")[iIndex];
            if (!capi_isDigit(iIP[iIndex])) {
                objErrCode = MSG_STATUS.mID_0009;
                return false;
            }
            if (iIP[iIndex].length == 0) {
                objErrCode = MSG_STATUS.mID_0009;
                return false;
            }
        }
    }
    else {
        if (sLaOct.length > 4) {
            objErrCode = MSG_STATUS.mID_0009;
            return false;
        }
    }
    var iPosi = sAddr.indexOf("::");
    if (iPosi != -1) {
        if (sAddr.substring(iPosi + 2, iPosi + 3) == ":") {
            objErrCode = MSG_STATUS.mID_0009;
            return false;
        }
        if (sAddr.substring(iPosi + 2).indexOf("::") != -1) {
            objErrCode = MSG_STATUS.mID_0009;
            return false;
        }
    }
    var sStOct = sAddr.substring(0, 2).toLowerCase();
    if (sStOct == "ff") {
        objErrCode = MSG_STATUS.mID_0009;
        return false;
    }
    var strSymbol = new Array("abcdef:", "abcdef:.");
    if (capi_isNumSymbol(sAddr, strSymbol[0])) {
        return chknet_IsValidIpv6Address(sAddr);
    }
    else if (capi_isNumSymbol(sAddr, strSymbol[1])) {
        return chknet_IsValidIpv6Comp(sAddr);
    }
    else {
        objErrCode = MSG_STATUS.mID_0009;
        return false;
    }
}

/**
 * check if Ipv6 address is valid or not
 * @param sAddr
 * @returns {boolean}
 */
function chknet_IsValidIpv6Address(sAddr) {
    var iErCnt = 0;
    var iLen = 8;
    var sv6Addr = "";
    var iIPv6 = new Array();
    var iNGv6 = new Array();
    iNGv6[0] = new Array(0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0001);
    iNGv6[1] = new Array(0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000);
    sv6Addr = chknet_RepIpv6(sAddr, iLen);
    iIPv6 = chknet_RepIpv6_2(sv6Addr);
    if (iIPv6.length != iLen) {
        objErrCode = MSG_STATUS.mID_0009;
        return false;
    }
    for (var j = 0; j < iNGv6.length; j++) {
        for (var k = 0; k < iNGv6[j].length; k++) {
            if (iIPv6[k] == iNGv6[j][k]) {
                iErCnt++;
            }
        }
        if (iErCnt == iLen) {
            objErrCode = MSG_STATUS.mID_0009;
            return false;
        }
        else {
            iErCnt = 0;
        }
    }
// network address check
    for (var j = 4; j < iLen; j++) {
        if (iIPv6[j] != 0) {
            break;
        }
    }
    if (j == iLen) {
        objErrCode = MSG_STATUS.mID_0027;
        return false;
    }
    return true;
}

/**
 * check if Ipv6 comp is valid or not
 * @param sAddr
 * @returns {boolean}
 */
function chknet_IsValidIpv6Comp(sAddr) {
    var iErCnt = 0;
    var iLen = 6;
    var sv6Addr = "";
    var iIPv6 = new Array();
    var iCompv4 = new Array(0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000);
    if (capi_CharCounter(sAddr, ".") != 3) {
        objErrCode = MSG_STATUS.mID_0009;
        return false;
    }
    sv6Addr = sAddr.substring(0, sAddr.lastIndexOf(":") + 1);
    sv6Addr = chknet_RepIpv6(sv6Addr, iLen + 1);
    iIPv6 = chknet_RepIpv6_2(sv6Addr);
    if (iIPv6.length != iLen) {
        objErrCode = MSG_STATUS.mID_0009;
        return false;
    }
    for (var k = 0; k < iLen; k++) {
        if (iIPv6[k] == iCompv4[k]) {
            iErCnt++;
        }
    }
    if (iErCnt != iLen) {
        objErrCode = MSG_STATUS.mID_0009;
        return false;
    }
    return true;
}

/**
 * check if Ipv6 dgw is valid or not
 * @param sReAddr
 * @param sReGW
 * @param iLen
 * @returns {boolean}
 */
function chknet_CheckIPv6Dgw(sReAddr, sReGW, iLen) {
    var sAddrTmp = chknet_RepIpv6(sReAddr, 8);
    var sGWTmp = chknet_RepIpv6(sReGW, 8);
    var sAddr = chknet_RepIpv6_2(sAddrTmp);
    var sGW = chknet_RepIpv6_2(sGWTmp);
    if (iLen < 16) {
        objErrCode = MSG_STATUS.mID_0009;
        return false;
    }
    for (var i = 0; i < 8; i++) {
        if (iLen < 16) {
            if (((sAddr[i] ^ sGW[i]) >>> (16 - iLen) != 0) & (iLen > 0)) {
                objErrCode = MSG_STATUS.mID_0009;
                return false;
            }
            break;
        }
        else if (sAddr[i] != sGW[i]) {
            objErrCode = MSG_STATUS.mID_0009;
            return false;
        }
        iLen = iLen - 16
    }
    for (var i = 0; i < 8; i++) {
        if (sAddr[i] != sGW[i]) {
            break;
        }
        if (i >= 7) {
            objErrCode = MSG_STATUS.mID_0009;
            return false;
        }
    }
    return true;
}

/***
 * check the repIpv6
 * @param sReAddr
 * @param iLen
 * @returns {*}
 */
function chknet_RepIpv6(sReAddr, iLen) {
    var iCnt = 0;
    var iPosi = 0;
    var sOct = "";
    if (sReAddr.charAt(0) == ":") {
        sReAddr = "0" + sReAddr;
    }
    iCnt = iLen - capi_CharCounter(sReAddr, ":");
    iPosi = sReAddr.indexOf("::");
    if (iPosi != -1) {
        for (var i = 0; i < iCnt; i++) {
            sOct = sOct + "0:";
        }
        sReAddr = sReAddr.substring(0, iPosi + 1) + sOct + sReAddr.substring(iPosi + 2);
    }
    if (sReAddr.charAt(sReAddr.length - 1) == ":") {
        if (iLen == 8) {
            sReAddr = sReAddr + "0";
        }
        else {
            sReAddr = sReAddr.substring(0, sReAddr.length - 1);
        }
    }
    return sReAddr;
}

/**
 * check the if only ipv6 is valid or not
 * @param sAddr
 * @returns {boolean}
 */
function chknet_IsValidIpv6Only(sAddr) {
    if (chknet_ipaddr_familly(sAddr) == "IPv6") {
        return chknet_IsValidIpv6(sAddr);
    }
    else {
        objErrCode = MSG_STATUS.mID_0009;
        return false;
    }
}
// /**
//  *
//  * @param str
//  * @returns {boolean}
//  */
// function isIPv6(str) {
//     return str.match(/:/g).length <= 7
//         && /::/.test(str)
//         ? /^([\da-f]{1,4}(:|::)){1,6}[\da-f]{1,4}$/i.test(str)
//         : /^([\da-f]{1,4}:){7}[\da-f]{1,4}$/i.test(str);
// }
//count 0F:or:10B
function cLength(str) {
    var reg = /([0-9a-f]{1,4}:)|(:[0-9a-f]{1,4})/gi;
    var temp = str.replace(reg, ' ');
    return temp.length;
}
/**
* ipv6 check
**/

 function isIPv6(tmpstr) {
    //CDCD:910A:2222:5498:8475:1111:3900:2020
    var patrn = /^([0-9a-f]{1,4}:){7}[0-9a-f]{1,4}$/i;
    var r = patrn.exec(tmpstr)
    if (r) {
        return true;
    }
    if (tmpstr == "::") {
        return true;
    }

    //F:F:F::1:1 F:F:F:F:F::1 F::F:F:F:F:1
    patrn = /^(([0-9a-f]{1,4}:){0,6})((:[0-9a-f]{1,4}){0,6})$/i;
    r = patrn.exec(tmpstr);
    if (r) {
        var c = cLength(tmpstr);
        if (c <= 7 && c > 0) {
            return true;
        }
    }

    //F:F:10F::
    patrn = /^([0-9a-f]{1,4}:){1,7}:$/i;
    r = patrn.exec(tmpstr);
    if (r) {
        return true;
    }

    //::F:F:10F
    patrn = /^:(:[0-9a-f]{1,4}){1,7}$/i;
    r = patrn.exec(tmpstr);
    if (r) {
        return true;
    }

    //F:0:0:0:0:0:10.0.0.1
    patrn = /^([0-9a-f]{1,4}:){6}(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/i;
    r = patrn.exec(tmpstr);
    if (r) {
        if (r[2] <= 255 && r[3] <= 255 && r[4] <= 255 && r[5] <= 255)
            return true;
    }

    //F::10.0.0.1
    patrn = /^([0-9a-f]{1,4}:){1,5}:(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/i;
    r = patrn.exec(tmpstr);
    if (r) {
        if (r[2] <= 255 && r[3] <= 255 && r[4] <= 255 && r[5] <= 255)
            return true;
    }

    //::10.0.0.1
    patrn = /^::(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/i;
    r = patrn.exec(tmpstr);
    if (r) {
        if (r[1] <= 255 && r[2] <= 255 && r[3] <= 255 && r[4] <= 255)
            return true;
    }
    objErrCode = MSG_STATUS.mID_0009;
    return false;
}
/**
 * check the range 2
 * @param arIP1
 * @param arIP2
 * @param arIP3
 * @param arIP4
 * @returns {boolean}
 */
function chknet_CheckRange2(arIP1, arIP2, arIP3, arIP4) {
    var arIP = new Array();
    var iIndex;
    for (iIndex = 1; iIndex <= 4; iIndex++) {
        if (!capi_isDigit(eval("arIP" + iIndex))) {
            objErrCode = MSG_STATUS.mID_0010;
            giErrNum = iIndex;
            return false;
        }
        arIP[iIndex] = parseInt(eval("arIP" + iIndex));
    }
    for (iIndex = 1; iIndex <= 4; iIndex++) {
        if (( arIP[iIndex] < 0 ) || ( arIP[iIndex] > 255 )) {
            objErrCode = MSG_STATUS.mID_0009;
            giErrNum = iIndex;
            return false;
        }
        if (iIndex == 1 && arIP[iIndex] == 0) {
            objErrCode = MSG_STATUS.mID_0027;
            giErrNum = iIndex;
            return false;
        }
    }
    return true;
}


function chknet_CheckRangeHost(arIP1, arIP2, arIP3, arIP4) {
    var arIP = new Array();
    var iIndex;
    for (iIndex = 1; iIndex <= 4; iIndex++) {
        if (!capi_isDigit(eval("arIP" + iIndex))) {
            if(iIndex == 4){
                if(arIP4.indexOf("/") !=-1){
                    var count = 0;
                    for (var i = 0; i < arIP4.length; i++) {
                        if (arIP4[i].indexOf('/')!=-1) {
                            if(i == 0){
                                objErrCode = MSG_STATUS.mID_0010;
                                giErrNum = iIndex;
                                return false;
                            }else{
                                count=count+1;
                            }
                        }
                    }
                    if(count!=1){
                        objErrCode = MSG_STATUS.mID_0010;
                        giErrNum = iIndex;
                        return false;
                    } else {
                        var retBuf = arIP4.split("/")[1];
                        if(1 > retBuf || retBuf > 32) {
                            objErrCode = MSG_STATUS.mID_0010;
                            giErrNum = iIndex;
                            return false;
                        }
                    }
                }
            }else{
                objErrCode = MSG_STATUS.mID_0010;
                giErrNum = iIndex;
                return false;
            }

        }
        arIP[iIndex] = parseInt(eval("arIP" + iIndex));
    }
    for (iIndex = 1; iIndex <= 4; iIndex++) {
        if (( arIP[iIndex] < 0 ) || ( arIP[iIndex] > 255 )) {
            objErrCode = MSG_STATUS.mID_0009;
            giErrNum = iIndex;
            return false;
        }
        if (iIndex == 1 && arIP[iIndex] == 0) {
            objErrCode = MSG_STATUS.mID_0027;
            giErrNum = iIndex;
            return false;
        }
    }
    return true;
}
/**
 * check ipv4 address by ulIpAddr and ulSubnet
 * @param ulIpAddr
 * @param ulSubnet
 * @returns {boolean}
 */
function chknet_CheckIPv4Addr(ulIpAddr, ulSubnet) {
    if (!chknet_CheckClass(ulIpAddr)) {
        objErrCode = MSG_STATUS.mID_0027;
        giErrNum = 1;
        return false;
    }
    else {
        if (0 == (ulIpAddr & ~ulSubnet)) {
            objErrCode = MSG_STATUS.mID_0027;
            giErrNum = 1;
            return false;
        }
        if ((0xFFFFFFFF & ~ulSubnet) == (ulIpAddr & ~ulSubnet)) {
            objErrCode = MSG_STATUS.mID_0027;
            giErrNum = 1;
            return false;
        }
        if (ulSubnet == (ulIpAddr & ulSubnet) >>> 0) {
            objErrCode = MSG_STATUS.mID_0027;
            giErrNum = 1;
            return false;
        }
        if (0x00000000 == (ulIpAddr & ulSubnet) >>> 0) {
            objErrCode = MSG_STATUS.mID_0027;
            giErrNum = 1;
            return false;
        }
    }
    return true;
}

/**
 * check ipv4 sub
 * @param ulSubnet
 * @returns {boolean}
 */
function chknet_CheckIPv4Sub(ulSubnet) {
    var iCheck = 0;
    var ulMask = 0x00000001;
    if(0xFFFFFFFF == ulSubnet){
        return true;
    }
    if (( 0xFFFFFFFF == ulSubnet ) || ( ( 0x80000000 & ulSubnet) == 0 )) {
        objErrCode = MSG_STATUS.mID_0027;
        giErrNum = 1;
        return false;
    }
    for (i = 0; i < 32; i++, ulMask <<= 1) {
        if (0 == iCheck) {
            if (0 != ( ulSubnet & ulMask )) {
                iCheck = 1;
                if (2 > i) {
                    objErrCode = MSG_STATUS.mID_0027;
                    giErrNum = 1;
                    return false;
                }
            }
        }
        else {
            if (0 == ( ulSubnet & ulMask )) {
                objErrCode = MSG_STATUS.mID_0027;
                giErrNum = 1;
                return false;
            }
        }
    }
    return true;
}

/**
 * check ipv4 dgw
 * @param ulIpAddr
 * @param ulSubnet
 * @param ulGateway
 * @returns {boolean}
 */
function chknet_CheckIPv4Dgw(ulIpAddr, ulSubnet, ulGateway) {
// [ip,gw] same adr?
    if (ulGateway == ulIpAddr) {
        objErrCode = MSG_STATUS.mID_0027;
        giErrNum = 1;
        return false;
    }
// [gw] is directed broadcast adr?
    if ((ulGateway & ~ulSubnet) == ~ulSubnet) {
        objErrCode = MSG_STATUS.mID_0027;
        giErrNum = 1;
        return false;
    }
// [gw] is network adr?
    if ((ulGateway & ~ulSubnet) == 0) {
        objErrCode = MSG_STATUS.mID_0027;
        giErrNum = 1;
        return false;
    }
    ulGateway &= ulSubnet;
    ulIpAddr &= ulSubnet;
    if (ulGateway != ulIpAddr) {
        objErrCode = MSG_STATUS.mID_0027;
        giErrNum = 1;
        return false;
    }
    return true;
}

/**
 * check ipv4 dns
 * @param ulDns
 * @param ulIpAddr
 * @param ulSubnet
 * @returns {boolean}
 */
function chknet_CheckIPv4Dns(ulDns, ulIpAddr, ulSubnet) {
    if (!chknet_CheckClass(ulDns)) {
        objErrCode = MSG_STATUS.mID_0027;
        return false;
    }
    if (ulIpAddr == ulDns) {
        objErrCode = MSG_STATUS.mID_0027;
        return false;
    }
    if ((ulIpAddr & ulSubnet) == (ulDns & ulSubnet)) {
        if (0 == (ulDns & ~ulSubnet)) {
            objErrCode = MSG_STATUS.mID_0027;
            return false;
        }
        if ((0xFFFFFFFF & ~ulSubnet) == (ulDns & ~ulSubnet)) {
            objErrCode = MSG_STATUS.mID_0027;
            return false;
        }
    }
    return true;
}

/**
 * check class by ulIpAddr
 * @param ulIpAddr
 * @returns {boolean}
 */
function chknet_CheckClass(ulIpAddr) {
    if (0 == ulIpAddr) {
        return false;
    }
    else if (4294967295 == ulIpAddr) {
        return false;
    }
    else if (4026531840 <= ulIpAddr) {
        return false;
    }
    else if (3758096384 <= ulIpAddr && 4026531839 >= ulIpAddr) {
        return false;
    }
    else if (2130706432 <= ulIpAddr && 2147483647 >= ulIpAddr) {
        return false;
    }
    return true;
}

/**
 * check portUsedNo
 * @param str
 * @param str1
 * @param str2
 * @param str3
 * @param str4
 * @param str5
 * @returns {boolean}
 */
function chknet_portUsedNo(str, str1, str2, str3, str4, str5) {
    var port = parseInt(str);
    var port1 = parseInt(str1);
    var port2 = parseInt(str2);
    var port3 = parseInt(str3);
    var port4 = parseInt(str4);
    var port5 = parseInt(str5);
    if (port == port1 || port == port2 || port == port3 || port == port4 || port == port5) {
        objErrCode = MSG_STATUS.mID_0028;
        return false;
    }
    return true;
}

/**
 * check multi address
 * @param sMultiAddr
 * @returns {boolean}
 */
function chknet_CheckMultiAddr(sMultiAddr) {
    var iAddr = new Array();
    var iIndex;
    var iChar = capi_CharCounter(sMultiAddr, ":");
    if (sMultiAddr.length == 0) {
        objErrCode = MSG_STATUS.mID_0003;
        return false;
    }
    if (chknet_ipaddr_familly(sMultiAddr) == "IPv6") {
        if (( sMultiAddr.length > 45 ) || ( iChar > 7 )) {
            objErrCode = MSG_STATUS.mID_0009;
            return false;
        }
        for (var iIndex = 0; iIndex < iChar; iIndex++) {
            if (sMultiAddr.split(":")[iIndex].length > 4) {
                objErrCode = MSG_STATUS.mID_0009;
                return false;
            }
        }
        var sLaOct = sMultiAddr.split(":")[iChar];
        if (capi_CharCounter(sMultiAddr, ".") == 3) {
            objErrCode = MSG_STATUS.mID_0009;
            return false;
        }
        else {
            if (sLaOct.length > 4) {
                objErrCode = MSG_STATUS.mID_0009;
                return false;
            }
        }
        var iPosi = sMultiAddr.indexOf("::");
        if (iPosi != -1) {
            if (sMultiAddr.substring(iPosi + 2, iPosi + 3) == ":") {
                objErrCode = MSG_STATUS.mID_0009;
                return false;
            }
            if (sMultiAddr.substring(iPosi + 2).indexOf("::") != -1) {
                objErrCode = MSG_STATUS.mID_0009;
                return false;
            }
        }
        var strSymbol = "abcdef:";
        if (!capi_isNumSymbol(sMultiAddr, strSymbol)) {
            objErrCode = MSG_STATUS.mID_0009;
            return false;
        }
        var sStOct = sMultiAddr.substring(0, 2).toLowerCase();
        if (sStOct != "ff") {
            objErrCode = MSG_STATUS.mID_0009;
            return false;
        }
    }
    else {
        if (capi_CharCounter(sMultiAddr, ".") != 3) {
            objErrCode = MSG_STATUS.mID_0009;
            return false;
        }
        for (var iIndex = 0; iIndex < 4; iIndex++) {
            iAddr[iIndex] = parseInt(sMultiAddr.split(".")[iIndex]);
            if (!capi_isDigit(iAddr[iIndex])) {
                objErrCode = MSG_STATUS.mID_0009;
                return false;
            }
            if (iAddr[iIndex].length == 0) {
                objErrCode = MSG_STATUS.mID_0009;
                return false;
            }
        }
        if (( iAddr[0] < 224 ) || ( iAddr[0] > 239 )) {
            objErrCode = MSG_STATUS.mID_0009;
            return false;
        }
        for (iIndex = 2; iIndex <= 4; iIndex++) {
            if (( iAddr[iIndex - 1] < 0 ) || ( 255 < iAddr[iIndex - 1] )) {
                objErrCode = MSG_STATUS.mID_0009;
                return false;
            }
        }
    }
    return true;
}

/**
 * check multi address
 * @param sMultiAddr
 * @returns {boolean}
 */
function chknet_CheckUniAddr(sMultiAddr,mode) {
    var iAddr = new Array();
    var iIndex;
    var iChar = capi_CharCounter(sMultiAddr, ":");
    if (sMultiAddr.length == 0 && mode == "IPOUT") {
        objErrCode = MSG_STATUS.mID_0005;
        return false;
    }else if(sMultiAddr.length == 0){
        objErrCode = MSG_STATUS.mID_0003;
        return false;
    }
    if (chknet_ipaddr_familly(sMultiAddr) == "IPv6") {
        if (( sMultiAddr.length > 45 ) || ( iChar > 7 )) {
            objErrCode = MSG_STATUS.mID_0009;
            return false;
        }
        for (var iIndex = 0; iIndex < iChar; iIndex++) {
            if (sMultiAddr.split(":")[iIndex].length > 4) {
                objErrCode = MSG_STATUS.mID_0009;
                return false;
            }
        }
        var sLaOct = sMultiAddr.split(":")[iChar];
        if (capi_CharCounter(sMultiAddr, ".") == 3) {
            objErrCode = MSG_STATUS.mID_0009;
            return false;
        }
        else {
            if (sLaOct.length > 4) {
                objErrCode = MSG_STATUS.mID_0009;
                return false;
            }
        }
        var iPosi = sMultiAddr.indexOf("::");
        if (iPosi != -1) {
            if (sMultiAddr.substring(iPosi + 2, iPosi + 3) == ":") {
                objErrCode = MSG_STATUS.mID_0009;
                return false;
            }
            if (sMultiAddr.substring(iPosi + 2).indexOf("::") != -1) {
                objErrCode = MSG_STATUS.mID_0009;
                return false;
            }
        }
        var strSymbol = "abcdef:";
        if (!capi_isNumSymbol(sMultiAddr, strSymbol)) {
            objErrCode = MSG_STATUS.mID_0009;
            return false;
        }
        var sStOct = sMultiAddr.substring(0, 2).toLowerCase();
        if (sStOct != "ff") {
            objErrCode = MSG_STATUS.mID_0009;
            return false;
        }
    }
    else {
        if (capi_CharCounter(sMultiAddr, ".") != 3) {
            objErrCode = MSG_STATUS.mID_0009;
            return false;
        }
        if(!capi_isNumSymbol(sMultiAddr, ".")){
          objErrCode = MSG_STATUS.mID_0009;
          return false;
        }
        for (var iIndex = 0; iIndex < 4; iIndex++) {
            iAddr[iIndex] = parseInt(sMultiAddr.split(".")[iIndex]);
            if(!iAddr[iIndex]&&iAddr[iIndex]!=0){
                objErrCode = MSG_STATUS.mID_0009;
                return false;
            }
            if (!capi_isDigit(iAddr[iIndex])) {
                objErrCode = MSG_STATUS.mID_0009;
                return false;
            }
            if (iAddr[iIndex].length == 0) {
                objErrCode = MSG_STATUS.mID_0009;
                return false;
            }
        }
        // if (( iAddr[0] < 224 ) || ( iAddr[0] > 239 )) {
        //     objErrCode = MSG_STATUS.mID_0009;
        //     return false;
        // }

        if(iAddr[0] >= 224 && iAddr[0]<=239 ){
            //警告文表示;
            objErrCode = MSG_STATUS.mID_0009;
            return false;
        }else {

        }
        if (chknet_isIpBlank(iAddr[0], iAddr[1], iAddr[2], iAddr[3])){
            return false;
        }
        if ((!chknet_IsIpDigit(iAddr[0], iAddr[1], iAddr[2], iAddr[3]))
            || (!chknet_CheckRange2(iAddr[0], iAddr[1], iAddr[2], iAddr[3]))) {
            return false
        }
        for (iIndex = 2; iIndex <= 4; iIndex++) {
            if (( iAddr[iIndex - 1] < 0 ) || ( 255 < iAddr[iIndex - 1] )) {
                objErrCode = MSG_STATUS.mID_0009;
                return false;
            }
        }
    }
    return true;
}

/**
 * check manual port by sPort
 * @param sPort
 * @param strSevrer
 * @param ghttpsmode
 * @returns {boolean}
 */
function chknet_ManualPort(sPort, strSevrer, ghttpsmode) {
    var sPortNum = sPort;
    var iPortNum = 0;
    if (sPortNum.length == 0) {
        objErrCode = MSG_STATUS.mID_0002;
        return false;
    }
    if (!capi_isDigit(sPortNum)) {
        objErrCode = MSG_STATUS.mID_0010;
        return false;
    }
    iPortNum = parseInt(sPortNum, 10);
    if (( iPortNum < 1024 ) || ( 50000 < iPortNum )) {
        objErrCode = MSG_STATUS.mID_0009;
        return false;
    }
    if (( iPortNum % 2 ) == 1) {
        objErrCode = MSG_STATUS.mID_0011;
        return false;
    }
    return chknet_portReservedNo(sPortNum, strSevrer, ghttpsmode);
}

/**
 * check ip address familly
 * @param sAddr
 * @returns {string}
 */
function chknet_ipaddr_familly(sAddr) {
    var sFamilly = "none";
    if (capi_CharCounter(sAddr, ":") >= 2) {
        sFamilly = "IPv6";
    }
    else if (capi_CharCounter(sAddr, ".") == 3) {
        sFamilly = "IPv4";
    }
    return sFamilly;
}

/**
 * check rep ipv6 by sAddr
 * @param sAddr
 * @returns {Array}
 */
function chknet_RepIpv6_2(sAddr) {
    var sRepAddr = sAddr.split(":");
    for (var i = 0; i < sRepAddr.length; i++) {
        sRepAddr[i] = parseInt("0x" + sRepAddr[i]);
    }
    return sRepAddr;
}

/**
 * check SysResvd portNo by str
 * @param str
 * @returns {boolean}
 */
function chknet_portSysResvdNo(str) {
    var iSysResvdNo = new Array(59000, 60999);
    var port = parseInt(str);
    if (( port >= iSysResvdNo[0] ) && ( port <= iSysResvdNo[1] )) {
        objErrCode = MSG_STATUS.mID_0028;
        return false;
    }
    return true;
}

/**
 * check set portNo
 * @param sSetPort
 * @param sHttpPort
 * @param sHttpsPort
 * @param ihttps
 * @returns {number}
 */
function chknet_CheckSetPortNo(sSetPort, sHttpPort, sHttpsPort, ihttps) {
    var sRetPortNo = 0;
    if (sSetPort == "") {
        if (ihttps == 0) {
            sRetPortNo = parseInt(sHttpPort);
        }
        else {
            sRetPortNo = parseInt(sHttpsPort);
        }
    }
    else {
        sRetPortNo = parseInt(sSetPort);
    }
    return sRetPortNo;
}

/**
 * check Nossl portUsedNo
 * @param str
 * @param str1
 * @param str2
 * @param str3
 * @param str4
 * @returns {boolean}
 */
function chknet_portUsedNo_Nossl(str, str1, str2, str3, str4) {
    var port = parseInt(str);
    var port1 = parseInt(str1);
    var port2 = parseInt(str2);
    var port3 = parseInt(str3);
    var port4 = parseInt(str4);
    if (port == port1 || port == port2 || port == port3 || port == port4) {
        objErrCode = MSG_STATUS.mID_0028;
        return false;
    }
    return true;
}

/**
 * check if SubPrefix is valid or not
 * @param iSubPrefix
 * @returns {boolean}
 */
function chknet_IsValidSubPrefix(iSubPrefix) {
    if ((iSubPrefix < 16) || (iSubPrefix > 128)) {
        objErrCode = MSG_STATUS.mID_0009;
        return false;
    }
    return true;
}
/**
 * check the portNo and address by sPort and strSevrer and ghttpsmode
 * @param sPort
 * @returns {boolean}
 */
function chknet_latency(sPort) {
    if (sPort.length == 0) {
        objErrCode = MSG_STATUS.mID_0002;
        return false;
    }
    if (!capi_isDigit(sPort)) {
        objErrCode = MSG_STATUS.mID_0010;
        return false;
    }
    var iWork = parseInt(sPort);
    if (( iWork < 0 ) || ( 65535 < iWork )) {
        objErrCode = MSG_STATUS.mID_0009;
        return false;
    }
    return true;
}
 function chknet_CycleTime(cycleTime){
    if (cycleTime.length == 0) {
        objErrCode = MSG_STATUS.mID_0116;
        return false;
    }
    var iWork = parseInt(cycleTime);
    if (Object.is(iWork, NaN) || ( iWork < 8 ) || ( 255 < iWork )) {
        objErrCode = MSG_STATUS.mID_0009;
        return false;
    }
    return true;
 }
