function cpage_initValue(obj,strValue,defaultValue) {
    if (strValue != "") {
        obj.value = strValue;
    }
    else {
        obj.value = defaultValue;
    }
}
function cpage_initSelect(obj, strValue, defaultIndex) {
    var length = 0;
    if (obj != undefined)
    {
        length = obj.length;
    }
    var index = defaultIndex;
    if (strValue == "blank") {
        index = -1;
    }
    else {
        for (var i = 0; i < length; i++) {
            if (strValue == obj[i].value) {
                index = i;
                break;
            }
        }
    }
    obj.selectedIndex = index;
}

function cpage_initValueNull(obj, strValue, defaultValue) {
    if (strValue != "" && strValue) {
        obj.value = strValue;
    }
    else {
        obj.value = defaultValue;
    }
}

function cpage_initChecked(obj, strValue, defaultIndex) {
    var length = obj.length;
    var index = defaultIndex;
    if (strValue == "blank") {
    }
    else {
        for (var i = 0; i < length; i++) {
            if (strValue == obj[i].value) {
                index = i;
                break;
            }
        }
        obj[index].checked = true;
    }
}
function cpage_initCheckBox( obj, strValue, defaultIndex ) {
    var index = defaultIndex;
    if (( strValue == "1" ) || ( strValue == "0" )) {
        index = strValue;
    }
    if (index == "1") {
        obj.checked = true;
    }
    else {
        obj.checked = false;
    }
}
function cpage_initTitle(obj,strValue) {
    len = strValue.length;
    Setlen = 0;
    for (i = len - 1; i >= 0; --i) {
        if (strValue.charAt(i) != " ") {
            Setlen = i + 1;
            break;
        }
    }
    obj.value = strValue.substring(0, Setlen);
}
function cpage_WriImgTab(iStMode, sDspMode) {
    var sTabName = "";
    if (iStMode == 0) {
        sTabName = "JPEG/MPEG-4";
    }
    else {
        sTabName = "JPEG/H.264";
    }
    if (sDspMode == "ON") {
        document.write("<td width=\"134\" class=\"CssTabOn\" colspan=\"7\">" + sTabName + "</td>");
    }
    else {
        document.write("<td width=\"134\" class=\"CssTabLink\" colspan=\"7\" tabindex=\"1\" onClick=\"GoURL('image');\" onKeyPress=\"GoURL('image');\">" + sTabName + "</td>");
    }
}
function cpage_WriJpgResol(gsImgMode, gsImgRatio, gsImgSvga, sSetId) {
    switch (gsImgMode) {
        case "3m":
            if (gsImgRatio == "4_3") {
                document.write("<option value=\"2048\">2048x1536</option>");
                document.write("<option value=\"1280\">1280x960</option>");
                document.write("<option value=\"800\">800x600</option>");
                document.write("<option value=\"640\">VGA</option>");
                document.write("<option value=\"400\">400x300</option>");
                document.write("<option value=\"320\">QVGA</option>");
                document.write("<option value=\"160\">160x120</option>");
                break;
            }
            else {
                break;
            }
        case "2m":
            if (gsImgRatio == "16_9") {
                document.write("<option value=\"1920\">1920x1080</option>");
                document.write("<option value=\"1280\">1280x720</option>");
                document.write("<option value=\"640\">640x360</option>");
                document.write("<option value=\"320\">320x180</option>");
                document.write("<option value=\"160\">160x90</option>");
                break;
            }
            else if (gsImgRatio == "4_3") {
                document.write("<option value=\"1600\">1600x1200</option>");
                document.write("<option value=\"1280\">1280x960</option>");
                document.write("<option value=\"800\">800x600</option>");
                document.write("<option value=\"640\">VGA</option>");
                document.write("<option value=\"400\">400x300</option>");
                document.write("<option value=\"320\">QVGA</option>");
                document.write("<option value=\"160\">160x120</option>");
                break;
            }
            else {
                break;
            }
        case "1.3m":
        default:
            if (gsImgRatio == "16_9") {
                document.write("<option value=\"1280\">1280x720</option>");
                document.write("<option value=\"640\">640x360</option>");
                document.write("<option value=\"320\">320x180</option>");
                document.write("<option value=\"160\">160x90</option>");
                break;
            }
            else if (gsImgRatio == "4_3") {
                document.write("<option value=\"1280\">1280x960</option>");
                document.write("<option value=\"800\">800x600</option>");
                document.write("<option value=\"640\">VGA</option>");
                document.write("<option value=\"400\">400x300</option>");
                document.write("<option value=\"320\">QVGA</option>");
                document.write("<option value=\"160\">160x120</option>");
                break;
            }
            else {
                break;
            }
    }
}

function cpage_ChangeFpsMode(gsImgFps,def) {
    var nr_content = "";
    var setMfr = 1;
    if (gsImgFps == 60) {
        nr_content += "<select name=\"H264NRFRAMERATE\" tabindex=\"1\">";
        nr_content += "<option value=\"60\" selected=\"selected\">60fps *</option>";
        nr_content += "</select>";
        setMfr = 60;
    }
    else {
        nr_content += "<select name=\"H264NRFRAMERATE\" tabindex=\"1\">";
        nr_content += "<option value=\"1\">1fps</option>";
        nr_content += "<option value=\"3\">3fps</option>";
        nr_content += "<option value=\"5\">5fps *</option>";
        nr_content += "<option value=\"7.5\">7.5fps *</option>";
        nr_content += "<option value=\"10\">10fps *</option>";
        nr_content += "<option value=\"12\">12fps *</option>";
        nr_content += "<option value=\"15\">15fps *</option>";
        nr_content += "<option value=\"20\">20fps *</option>";
        nr_content += "<option value=\"30\">30fps *</option>";
        nr_content += "</select>";
        var frt1 = document.getElementsByName('H264NRFRAMERATE')[0].selectedIndex;
        var frtval = document.getElementsByName('H264NRFRAMERATE')[0].options[frt1].value;
        if (frtval == 60) {
            setMfr = 30;
        }
        else {
            setMfr = frtval;
        }
    }
    var bIsIE = IsIE();
    if (bIsIE == true && getStreamMode() != 'rtmp') {
        document.getElementById('nr_frameid').innerHTML = nr_content;
    }
    else {
        document.getElementById('nr_frameid').firstElementChild.innerHTML = nr_content;
    }
    var nrc = document.getElementsByName('H264FPRIORITY')[0].selectedIndex;
    if ((nrc == 0) || (nrc == 2) || (gsImgFps == 60)) {
        f.H264NRFRAMERATE.disabled = true;
    }
    else {
        f.H264NRFRAMERATE.disabled = false;
    }
    cpage_initSelect(document.image2.H264NRFRAMERATE, setMfr, "4");
    var iH264_1_bmin_select = document.getElementsByName('H264BWCMIN')[0].selectedIndex;
    var iH264_1_bmin_value = document.getElementsByName('H264BWCMIN')[0].options[iH264_1_bmin_select].value;
    if ((gsImgFps == "60") && (parseInt(iH264_1_bmin_value) < 1024)) {
        iH264_1_bmin_value = "1024";
        cpage_initSelect(document.image2.H264BWCMIN, iH264_1_bmin_value, "6");
    }
}
function cpage_SetWriJpegResol(mInit) {
    var mIndex = document.getElementsByName('IMG_MODE')[0].selectedIndex;
    var jpg1rsl = "<select name=\"LIVESIZE\" style=\"width:90px;\" tabindex=\"1\" onChange=\"cpage_SetWriJpegResol(0)\">";
    var jpg2rsl = "<select name=\"LIVESIZE2\" style=\"width:90px;\" tabindex=\"1\" onChange=\"cpage_SetWriJpegResol(0)\">";
    var jpg3rsl = "<select name=\"LIVESIZE3\" style=\"width:90px;\" tabindex=\"1\" onChange=\"cpage_SetWriJpegResol(0)\">";
    var opt1 = "";
    var opt2 = "";
    var opt3 = "";
    var Slct1 = document.getElementsByName('LIVESIZE')[0].selectedIndex;
    var jSelect1 = document.getElementsByName('LIVESIZE')[0].options[Slct1].value;
    var Slct2 = document.getElementsByName('LIVESIZE2')[0].selectedIndex;
    var jSelect2 = document.getElementsByName('LIVESIZE2')[0].options[Slct2].value;
    var Slct3 = document.getElementsByName('LIVESIZE3')[0].selectedIndex;
    var jSelect3 = document.getElementsByName('LIVESIZE3')[0].options[Slct3].value;
    if (gsImgRatio == '4_3') {
        if ((mIndex == opeIndex) && (mInit == 1)) {
            jSelect1 = giJp1Resol;
            jSelect2 = giJp2Resol;
            jSelect3 = giJp3Resol;
        }
        else {
            if (bfrRatio == "16_9") {
                var Img4_3Array = new Array();
                if (gsImgMode == "3m") {
                    Img4_3Array['1920'] = 2048;
                }
                else {
                    if (gsImgMode == "2m") {
                        Img4_3Array['1920'] = 1600;
                    }
                }
                Img4_3Array['1280'] = 1280;
                Img4_3Array['640'] = 640;
                Img4_3Array['320'] = 320;
                Img4_3Array['160'] = 160;
                Img4_3Array['800'] = 800;
                Img4_3Array['400'] = 400;
                jSelect1 = String(jSelect1);
                jSelect2 = String(jSelect2);
                jSelect3 = String(jSelect3);
                jSelect1 = parseInt(Img4_3Array[jSelect1], 10);
                jSelect2 = parseInt(Img4_3Array[jSelect2], 10);
                jSelect3 = parseInt(Img4_3Array[jSelect3], 10);
            }
            else {
                if (gsImgRatio != bfrRatio) {
                    if (bfrMode == "2m") {
                        if (jSelect1 == 1600) {
                            jSelect1 = 2048;
                        }
                        else if (jSelect2 == 1600) {
                            jSelect2 = 2048;
                        }
                        else if (jSelect3 == 1600) {
                            jSelect3 = 2048;
                        }
                    }
                    else {
                        if (jSelect1 == 2048) {
                            jSelect1 = 1600;
                        }
                        else if (jSelect2 == 2048) {
                            jSelect2 = 1600;
                        }
                        else if (jSelect3 == 2048) {
                            jSelect3 = 1600;
                        }
                    }
                }
            }
        }
        if (gsImgMode == "3m") {
            if ((jSelect1 == 2048) || ((jSelect1 != 2048) && (jSelect2 != 2048) && (jSelect3 != 2048))) {
                opt1 += "<option value=\"2048\">2048x1536</option>";
            }
            if ((jSelect1 == 1280) || ((jSelect1 != 1280) && (jSelect2 != 1280) && (jSelect3 != 1280))) {
                opt1 += "<option value=\"1280\">1280x960</option>";
            }
            if ((jSelect1 == 800) || ((jSelect1 != 800) && (jSelect2 != 800) && (jSelect3 != 800))) {
                opt1 += "<option value=\"800\">800x600</option>";
            }
            if ((jSelect1 == 640) || ((jSelect1 != 640) && (jSelect2 != 640) && (jSelect3 != 640))) {
                opt1 += "<option value=\"640\">VGA</option>";
            }
            if ((jSelect1 == 400) || ((jSelect1 != 400) && (jSelect2 != 400) && (jSelect3 != 400))) {
                opt1 += "<option value=\"400\">400x300</option>";
            }
            if ((jSelect1 == 320) || ((jSelect1 != 320) && (jSelect2 != 320) && (jSelect3 != 320))) {
                opt1 += "<option value=\"320\">QVGA</option>";
            }
            if ((jSelect1 == 160) || ((jSelect1 != 160) && (jSelect2 != 160) && (jSelect3 != 160))) {
                opt1 += "<option value=\"160\">160x120</option>";
            }
            if ((jSelect2 == 1280) || ((jSelect1 != 1280) && (jSelect2 != 1280) && (jSelect3 != 1280))) {
                opt2 += "<option value=\"1280\">1280x960</option>";
            }
            if ((jSelect2 == 800) || ((jSelect1 != 800) && (jSelect2 != 800) && (jSelect3 != 800))) {
                opt2 += "<option value=\"800\">800x600</option>";
            }
            if ((jSelect2 == 640) || ((jSelect1 != 640) && (jSelect2 != 640) && (jSelect3 != 640))) {
                opt2 += "<option value=\"640\">VGA</option>";
            }
            if ((jSelect2 == 400) || ((jSelect1 != 400) && (jSelect2 != 400) && (jSelect3 != 400))) {
                opt2 += "<option value=\"400\">400x300</option>";
            }
            if ((jSelect2 == 320) || ((jSelect1 != 320) && (jSelect2 != 320) && (jSelect3 != 320))) {
                opt2 += "<option value=\"320\">QVGA</option>";
            }
            if ((jSelect2 == 160) || ((jSelect1 != 160) && (jSelect2 != 160) && (jSelect3 != 160))) {
                opt2 += "<option value=\"160\">160x120</option>";
            }
            if ((jSelect3 == 800) || ((jSelect1 != 800) && (jSelect2 != 800) && (jSelect3 != 800))) {
                opt3 += "<option value=\"800\">800x600</option>";
            }
            if ((jSelect3 == 640) || ((jSelect1 != 640) && (jSelect2 != 640) && (jSelect3 != 640))) {
                opt3 += "<option value=\"640\">VGA</option>";
            }
            if ((jSelect3 == 400) || ((jSelect1 != 400) && (jSelect2 != 400) && (jSelect3 != 400))) {
                opt3 += "<option value=\"400\">400x300</option>";
            }
            if ((jSelect3 == 320) || ((jSelect1 != 320) && (jSelect2 != 320) && (jSelect3 != 320))) {
                opt3 += "<option value=\"320\">QVGA</option>";
            }
            if ((jSelect3 == 160) || ((jSelect1 != 160) && (jSelect2 != 160) && (jSelect3 != 160))) {
                opt3 += "<option value=\"160\">160x120</option>";
            }
        }
        else if (gsImgMode == "2m") {
            if ((jSelect1 == 1600) || ((jSelect1 != 1600) && (jSelect2 != 1600) && (jSelect3 != 1600))) {
                opt1 += "<option value=\"1600\">1600x1200</option>";
            }
            if ((jSelect1 == 1280) || ((jSelect1 != 1280) && (jSelect2 != 1280) && (jSelect3 != 1280))) {
                opt1 += "<option value=\"1280\">1280x960</option>";
            }
            if ((jSelect1 == 800) || ((jSelect1 != 800) && (jSelect2 != 800) && (jSelect3 != 800))) {
                opt1 += "<option value=\"800\">800x600</option>";
            }
            if ((jSelect1 == 640) || ((jSelect1 != 640) && (jSelect2 != 640) && (jSelect3 != 640))) {
                opt1 += "<option value=\"640\">VGA</option>";
            }
            if ((jSelect1 == 400) || ((jSelect1 != 400) && (jSelect2 != 400) && (jSelect3 != 400))) {
                opt1 += "<option value=\"400\">400x300</option>";
            }
            if ((jSelect1 == 320) || ((jSelect1 != 320) && (jSelect2 != 320) && (jSelect3 != 320))) {
                opt1 += "<option value=\"320\">QVGA</option>";
            }
            if ((jSelect1 == 160) || ((jSelect1 != 160) && (jSelect2 != 160) && (jSelect3 != 160))) {
                opt1 += "<option value=\"160\">160x120</option>";
            }
            if ((jSelect2 == 1280) || ((jSelect1 != 1280) && (jSelect2 != 1280) && (jSelect3 != 1280))) {
                opt2 += "<option value=\"1280\">1280x960</option>";
            }
            if ((jSelect2 == 800) || ((jSelect1 != 800) && (jSelect2 != 800) && (jSelect3 != 800))) {
                opt2 += "<option value=\"800\">800x600</option>";
            }
            if ((jSelect2 == 640) || ((jSelect1 != 640) && (jSelect2 != 640) && (jSelect3 != 640))) {
                opt2 += "<option value=\"640\">VGA</option>";
            }
            if ((jSelect2 == 400) || ((jSelect1 != 400) && (jSelect2 != 400) && (jSelect3 != 400))) {
                opt2 += "<option value=\"400\">400x300</option>";
            }
            if ((jSelect2 == 320) || ((jSelect1 != 320) && (jSelect2 != 320) && (jSelect3 != 320))) {
                opt2 += "<option value=\"320\">QVGA</option>";
            }
            if ((jSelect2 == 160) || ((jSelect1 != 160) && (jSelect2 != 160) && (jSelect3 != 160))) {
                opt2 += "<option value=\"160\">160x120</option>";
            }
            if ((jSelect3 == 800) || ((jSelect1 != 800) && (jSelect2 != 800) && (jSelect3 != 800))) {
                opt3 += "<option value=\"800\">800x600</option>";
            }
            if ((jSelect3 == 640) || ((jSelect1 != 640) && (jSelect2 != 640) && (jSelect3 != 640))) {
                opt3 += "<option value=\"640\">VGA</option>";
            }
            if ((jSelect3 == 400) || ((jSelect1 != 400) && (jSelect2 != 400) && (jSelect3 != 400))) {
                opt3 += "<option value=\"400\">400x300</option>";
            }
            if ((jSelect3 == 320) || ((jSelect1 != 320) && (jSelect2 != 320) && (jSelect3 != 320))) {
                opt3 += "<option value=\"320\">QVGA</option>";
            }
            if ((jSelect3 == 160) || ((jSelect1 != 160) && (jSelect2 != 160) && (jSelect3 != 160))) {
                opt3 += "<option value=\"160\">160x120</option>";
            }
        }
        else {
            if ((jSelect1 == 1280) || ((jSelect1 != 1280) && (jSelect2 != 1280) && (jSelect3 != 1280))) {
                opt1 += "<option value=\"1280\">1280x960</option>";
            }
            if ((jSelect1 == 800) || ((jSelect1 != 800) && (jSelect2 != 800) && (jSelect3 != 800))) {
                opt1 += "<option value=\"800\">800x600</option>";
            }
            if ((jSelect1 == 640) || ((jSelect1 != 640) && (jSelect2 != 640) && (jSelect3 != 640))) {
                opt1 += "<option value=\"640\">VGA</option>";
            }
            if ((jSelect1 == 400) || ((jSelect1 != 400) && (jSelect2 != 400) && (jSelect3 != 400))) {
                opt1 += "<option value=\"400\">400x300</option>";
            }
            if ((jSelect1 == 320) || ((jSelect1 != 320) && (jSelect2 != 320) && (jSelect3 != 320))) {
                opt1 += "<option value=\"320\">QVGA</option>";
            }
            if ((jSelect1 == 160) || ((jSelect1 != 160) && (jSelect2 != 160) && (jSelect3 != 160))) {
                opt1 += "<option value=\"160\">160x120</option>";
            }
            if ((jSelect2 == 800) || ((jSelect1 != 800) && (jSelect2 != 800) && (jSelect3 != 800))) {
                opt2 += "<option value=\"800\">800x600</option>";
            }
            if ((jSelect2 == 640) || ((jSelect1 != 640) && (jSelect2 != 640) && (jSelect3 != 640))) {
                opt2 += "<option value=\"640\">VGA</option>";
            }
            if ((jSelect2 == 400) || ((jSelect1 != 400) && (jSelect2 != 400) && (jSelect3 != 400))) {
                opt2 += "<option value=\"400\">400x300</option>";
            }
            if ((jSelect2 == 320) || ((jSelect1 != 320) && (jSelect2 != 320) && (jSelect3 != 320))) {
                opt2 += "<option value=\"320\">QVGA</option>";
            }
            if ((jSelect2 == 160) || ((jSelect1 != 160) && (jSelect2 != 160) && (jSelect3 != 160))) {
                opt2 += "<option value=\"160\">160x120</option>";
            }
            if ((jSelect3 == 640) || ((jSelect1 != 640) && (jSelect2 != 640) && (jSelect3 != 640))) {
                opt3 += "<option value=\"640\">VGA</option>";
            }
            if ((jSelect3 == 400) || ((jSelect1 != 400) && (jSelect2 != 400) && (jSelect3 != 400))) {
                opt3 += "<option value=\"400\">400x300</option>";
            }
            if ((jSelect3 == 320) || ((jSelect1 != 320) && (jSelect2 != 320) && (jSelect3 != 320))) {
                opt3 += "<option value=\"320\">QVGA</option>";
            }
            if ((jSelect3 == 160) || ((jSelect1 != 160) && (jSelect2 != 160) && (jSelect3 != 160))) {
                opt3 += "<option value=\"160\">160x120</option>";
            }
        }
    }
    else {
        if (gsImgRatio != bfrRatio) {
            if ((jSelect1 == 800) || (jSelect2 == 800) || (jSelect3 == 800) || (jSelect1 == 400) || (jSelect2 == 400) || (jSelect3 == 400)) {
                if (gsImgMode == "2m") {
                    jSelect1 = 1920;
                } else {
                    jSelect1 = 1280;
                }
                jSelect2 = 640;
                jSelect3 = 320;
                alert("Since the selected value for \"Image capture size\" of JPEG cannot be switched, the \"Image capture size\" setting will automatically be set to default.");
            }
            else {
                var Img16_9Array = new Array();
                Img16_9Array['2048'] = 1920;
                Img16_9Array['1600'] = 1920;
                Img16_9Array['1280'] = 1280;
                Img16_9Array['800'] = 640;
                Img16_9Array['640'] = 640;
                Img16_9Array['400'] = 320;
                Img16_9Array['320'] = 320;
                Img16_9Array['160'] = 160;
                jSelect1 = String(jSelect1);
                jSelect2 = String(jSelect2);
                jSelect3 = String(jSelect3);
                jSelect1 = parseInt(Img16_9Array[jSelect1], 10);
                jSelect2 = parseInt(Img16_9Array[jSelect2], 10);
                jSelect3 = parseInt(Img16_9Array[jSelect3], 10);
            }
        }
        if (gsImgMode == "2m") {
            if ((jSelect1 == 1920) || ((jSelect1 != 1920) && (jSelect2 != 1920) && (jSelect3 != 1920))) {
                opt1 += "<option value=\"1920\">1920x1080</option>";
            }
        }
        if ((jSelect1 == 1280) || ((jSelect1 != 1280) && (jSelect2 != 1280) && (jSelect3 != 1280))) {
            opt1 += "<option value=\"1280\">1280x720</option>";
        }
        if ((jSelect1 == 640) || ((jSelect1 != 640) && (jSelect2 != 640) && (jSelect3 != 640))) {
            opt1 += "<option value=\"640\">640x360</option>";
        }
        if ((jSelect1 == 320) || ((jSelect1 != 320) && (jSelect2 != 320) && (jSelect3 != 320))) {
            opt1 += "<option value=\"320\">320x180</option>";
        }
        if ((jSelect1 == 160) || ((jSelect1 != 160) && (jSelect2 != 160) && (jSelect3 != 160))) {
            opt1 += "<option value=\"160\">160x90</option>";
        }
        if (gsImgMode == "2m") {
            if ((jSelect2 == 1280) || ((jSelect1 != 1280) && (jSelect2 != 1280) && (jSelect3 != 1280))) {
                opt2 += "<option value=\"1280\">1280x720</option>";
            }
        }
        if ((jSelect2 == 640) || ((jSelect1 != 640) && (jSelect2 != 640) && (jSelect3 != 640))) {
            opt2 += "<option value=\"640\">640x360</option>";
        }
        if ((jSelect2 == 320) || ((jSelect1 != 320) && (jSelect2 != 320) && (jSelect3 != 320))) {
            opt2 += "<option value=\"320\">320x180</option>";
        }
        if ((jSelect2 == 160) || ((jSelect1 != 160) && (jSelect2 != 160) && (jSelect3 != 160))) {
            opt2 += "<option value=\"160\">160x90</option>";
        }
        if (gsImgMode == "2m") {
            if ((jSelect3 == 640) || ((jSelect1 != 640) && (jSelect2 != 640) && (jSelect3 != 640))) {
                opt3 += "<option value=\"640\">640x360</option>";
            }
        }
        if ((jSelect3 == 320) || ((jSelect1 != 320) && (jSelect2 != 320) && (jSelect3 != 320))) {
            opt3 += "<option value=\"320\">320x180</option>";
        }
        if ((jSelect3 == 160) || ((jSelect1 != 160) && (jSelect2 != 160) && (jSelect3 != 160))) {
            opt3 += "<option value=\"160\">160x90</option>";
        }
    }
    jpg1rsl += opt1 + "</select>";
    jpg2rsl += opt2 + "</select>";
    jpg3rsl += opt3 + "</select>";
    var bIsIE = IsIE();
    if (bIsIE == true && getStreamMode() != 'rtmp') {
        document.getElementById('spnjpg1').innerHTML = jpg1rsl;
        document.getElementById('spnjpg2').innerHTML = jpg2rsl;
        document.getElementById('spnjpg3').innerHTML = jpg3rsl;
    }
    else {
        document.getElementById('spnjpg1').firstElementChild.innerHTML = jpg1rsl;
        document.getElementById('spnjpg2').firstElementChild.innerHTML = jpg2rsl;
        document.getElementById('spnjpg3').firstElementChild.innerHTML = jpg3rsl;
    }
    cpage_initSelect(f.LIVESIZE, jSelect1, 0);
    cpage_initSelect(f.LIVESIZE2, jSelect2, 0);
    cpage_initSelect(f.LIVESIZE3, jSelect3, 0);
    bfrMode = gsImgMode;
    bfrRatio = gsImgRatio;
}
function cpage_SetWriH264Resol() {
    var Slct1 = document.getElementsByName('H264SIZE')[0].selectedIndex;
    var hSelect1 = parseInt(document.getElementsByName('H264SIZE')[0].options[Slct1].value, 10);
    var Slct2 = document.getElementsByName('H264SIZE_2')[0].selectedIndex;
    var hSelect2 = parseInt(document.getElementsByName('H264SIZE_2')[0].options[Slct2].value, 10);
    var Slct3 = document.getElementsByName('H264SIZE_3')[0].selectedIndex;
    var hSelect3 = parseInt(document.getElementsByName('H264SIZE_3')[0].options[Slct3].value, 10);
    var Slct4 = document.getElementsByName('H264SIZE_4')[0].selectedIndex;
    var hSelect4 = parseInt(document.getElementsByName('H264SIZE_4')[0].options[Slct4].value, 10);
    var h264_1rsl = "<select name=\"H264SIZE\" tabindex=\"1\" onChange=\"cimage_ChangeBWC(1); cpage_SetWriH264Resol();\">";
    var h264_2rsl = "<select name=\"H264SIZE_2\" tabindex=\"1\" onChange=\"cimage_ChangeBWC(2); cpage_SetWriH264Resol();\">";
    var h264_3rsl = "<select name=\"H264SIZE_3\" tabindex=\"1\" onChange=\"cimage_ChangeBWC(3); cpage_SetWriH264Resol();\">";
    var h264_4rsl = "<select name=\"H264SIZE_4\" tabindex=\"1\" onChange=\"cimage_ChangeBWC(4); cpage_SetWriH264Resol();\">";
    var opt1 = "";
    var opt2 = "";
    var opt3 = "";
    var opt4 = "";
    var snear = false;
    if (gsImgRatio == '16_9') {
        if (gsImgFps == 60) {
            if (hSelect1 < 1280) {
                hSelect1 = 1280;
                snear = true;
            }
        }
        if (bfrRatio2 == '4_3') {
            if (hSelect1 == 2048) {
                hSelect1 = 1920;
            }
            if (hSelect2 == 2048) {
                hSelect2 = 1920;
            }
            if (hSelect1 == 1600) {
                hSelect1 = 1920;
            }
            if (hSelect2 == 1600) {
                hSelect2 = 1920;
            }
            if (hSelect1 == 800) {
                hSelect1 = 640;
                snear = true;
            }
            if (hSelect1 == 400) {
                hSelect1 = 320;
                snear = true;
            }
        }
        if (hSelect2 == 800) {
            hSelect2 = 640;
            snear = true;
        }
        if (hSelect3 == 800) {
            hSelect3 = 640;
            snear = true;
        }
        if (hSelect4 == 800) {
            hSelect4 = 640;
            snear = true;
        }
        if (hSelect2 == 400) {
            hSelect2 = 320;
            snear = true;
        }
        if (hSelect3 == 400) {
            hSelect3 = 320;
            snear = true;
        }
        if (hSelect4 == 400) {
            hSelect4 = 320;
            snear = true;
        }
        if (snear == true) {
            alert("Since the selected value for \"Image capture size\" of H.264 cannot be switched, the \"Image capture size\" setting will automatically be set to approximated value.");
        }
        if (gsImgMode == "2m") {
            opt1 += "<option value=\"1920\">1920x1080</option>";
        }
        opt1 += "<option value=\"1280\">1280x720</option>";
        if (gsImgFps == 60) {
        } else {
            opt1 += "<option value=\"640\">640x360</option>";
            opt1 += "<option value=\"320\">320x180</option>";
            opt1 += "<option value=\"160\">160x90</option>";
        }
        if (gsImgMode == "2m") {
            opt2 += "<option value=\"1920\">1920x1080</option>";
        }
        opt2 += "<option value=\"1280\">1280x720</option>";
        opt2 += "<option value=\"640\">640x360</option>";
        opt2 += "<option value=\"320\">320x180</option>";
        opt2 += "<option value=\"160\">160x90</option>";
        opt3 += "<option value=\"1280\">1280x720</option>";
        opt3 += "<option value=\"640\">640x360</option>";
        opt3 += "<option value=\"320\">320x180</option>";
        opt3 += "<option value=\"160\">160x90</option>";
        opt4 += "<option value=\"1280\">1280x720</option>";
        opt4 += "<option value=\"640\">640x360</option>";
        opt4 += "<option value=\"320\">320x180</option>";
        opt4 += "<option value=\"160\">160x90</option>";
    }
    else {
        if (gsImgFps == 60) {
            if (hSelect1 < 1280) {
                hSelect1 = 1280;
                snear = true;
            }
        }
        if (bfrRatio2 == '16_9') {
            if (gsImgMode == "3m") {
                if (hSelect1 == 1920) {
                    hSelect1 = 2048;
                }
                if (hSelect2 == 1920) {
                    hSelect2 = 2048;
                }
            }
            else {
                if (hSelect1 == 1920) {
                    hSelect1 = 1600;
                }
                if (hSelect2 == 1920) {
                    hSelect2 = 1600;
                }
            }
        }
        if (snear == true) {
            alert("Since the selected value for \"Image capture size\" of H.264 cannot be switched, the \"Image capture size\" setting will automatically be set to approximated value.");
        }
        if (gsImgMode == "3m") {
            opt1 += "<option value=\"2048\">2048x1536</option>";
        }
        if (gsImgMode == "2m") {
            opt1 += "<option value=\"1600\">1600x1200</option>";
        }
        opt1 += "<option value=\"1280\">1280x960</option>";
        opt1 += "<option value=\"800\">800x600</option>";
        opt1 += "<option value=\"640\">VGA</option>";
        opt1 += "<option value=\"400\">400x300</option>";
        opt1 += "<option value=\"320\">QVGA</option>";
        opt1 += "<option value=\"160\">160x120</option>";
        if (gsImgMode == "3m") {
            opt2 += "<option value=\"2048\">2048x1536</option>";
        }
        if (gsImgMode == "2m") {
            opt2 += "<option value=\"1600\">1600x1200</option>";
        }
        opt2 += "<option value=\"1280\">1280x960</option>";
        opt2 += "<option value=\"800\">800x600</option>";
        opt2 += "<option value=\"640\">VGA</option>";
        opt2 += "<option value=\"400\">400x300</option>";
        opt2 += "<option value=\"320\">QVGA</option>";
        opt2 += "<option value=\"160\">160x120</option>";
        opt3 += "<option value=\"1280\">1280x960</option>";
        opt3 += "<option value=\"800\">800x600</option>";
        opt3 += "<option value=\"640\">VGA</option>";
        opt3 += "<option value=\"400\">400x300</option>";
        opt3 += "<option value=\"320\">QVGA</option>";
        opt3 += "<option value=\"160\">160x120</option>";
        opt4 += "<option value=\"1280\">1280x960</option>";
        opt4 += "<option value=\"800\">800x600</option>";
        opt4 += "<option value=\"640\">VGA</option>";
        opt4 += "<option value=\"400\">400x300</option>";
        opt4 += "<option value=\"320\">QVGA</option>";
        opt4 += "<option value=\"160\">160x120</option>";
    }
    h264_1rsl += opt1 + "</select>";
    h264_2rsl += opt2 + "</select>";
    h264_3rsl += opt3 + "</select>";
    h264_4rsl += opt4 + "</select>";
    var bIsIE = IsIE();
    if (bIsIE == true && getStreamMode() != 'rtmp') {
        document.getElementById('h264rsl1').innerHTML = h264_1rsl;
        document.getElementById('h264rsl2').innerHTML = h264_2rsl;
        document.getElementById('h264rsl3').innerHTML = h264_3rsl;
        document.getElementById('h264rsl4').innerHTML = h264_4rsl;
    }
    else {
        document.getElementById('h264rsl1').firstElementChild.innerHTML = h264_1rsl;
        document.getElementById('h264rsl2').firstElementChild.innerHTML = h264_2rsl;
        document.getElementById('h264rsl3').firstElementChild.innerHTML = h264_3rsl;
        document.getElementById('h264rsl4').firstElementChild.innerHTML = h264_4rsl;
    }
    cpage_initSelect(f.H264SIZE, hSelect1, 0);
    cpage_initSelect(f.H264SIZE_2, hSelect2, 0);
    cpage_initSelect(f.H264SIZE_3, hSelect3, 0);
    cpage_initSelect(f.H264SIZE_4, hSelect4, 0);
    bfrRatio2 = gsImgRatio;
    cimage_SetMpegTransmit('stream1');
    cimage_SetMpegTransmit('stream2');
    cimage_SetMpegTransmit('stream3');
    cimage_SetMpegTransmit('stream4');
}
function cpage_SetModeStrings(sIndex,JpgImgRatio,Jpg1Rsl,Jpg2Rsl,Jpg3Rsl,H264Rsl1,H264Rsl2,H264Rsl3,H264Rsl4,iMPG,iMPG2,iMPG3,iMPG4) {
    Jpg1Rsl = String(Jpg1Rsl);
    Jpg2Rsl = String(Jpg2Rsl);
    Jpg3Rsl = String(Jpg3Rsl);
    H264Rsl1 = String(H264Rsl1);
    H264Rsl2 = String(H264Rsl2);
    H264Rsl3 = String(H264Rsl3);
    H264Rsl4 = String(H264Rsl4);
    var SetArray = new Array();
    if (JpgImgRatio == '4_3') {
        SetArray['2048'] = "2048x1536";
        SetArray['1600'] = "1600x1200";
        SetArray['1280'] = "1280x960";
        SetArray['800'] = "800x600";
        SetArray['640'] = "VGA";
        SetArray['400'] = "400x300";
        SetArray['320'] = "QVGA";
        SetArray['160'] = "160x120";
    }
    else {
        SetArray['1920'] = "1920x1080";
        SetArray['1280'] = "1280x720";
        SetArray['640'] = "640x360";
        SetArray['320'] = "320x180";
        SetArray['160'] = "160x90";
    }
    var rsl = "";
    if (sIndex == 0) {
        rsl = '(' + SetArray[Jpg1Rsl] + ')';
    }
    else if (sIndex == 1) {
        rsl = '(' + SetArray[Jpg2Rsl] + ')';
    }
    else if (sIndex == 2) {
        rsl = '(' + SetArray[Jpg3Rsl] + ')';
    }
    else if (sIndex == 3) {
        if (iMPG == 1) {
            rsl = '(' + SetArray[H264Rsl1] + ')';
        }
    }
    else if (sIndex == 4) {
        if (iMPG2 == 1) {
            rsl = '(' + SetArray[H264Rsl2] + ')';
        }
    }
    else if (sIndex == 5) {
        if (iMPG3 == 1) {
            rsl = '(' + SetArray[H264Rsl3] + ')';
        }
    }
    else if (sIndex == 6) {
        if (iMPG4 == 1) {
            rsl = '(' + SetArray[H264Rsl4] + ')';
        }
    }
    return rsl;
}
