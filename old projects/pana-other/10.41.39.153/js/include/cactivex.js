var cactivex_video_clsid = "clsid:5BE9B876-2CFB-4c26-A0A6-3C282C34F434";
var cactivex_audio_clsid = "clsid:5EC2AB4E-68AF-4bcc-BCA9-425A290ED323";
var cactivex_alarm_clsid = "clsid:96ADD1E5-1B8D-41bb-AB80-2C69FFB82E4A";
var cactivex_media_clsid = "clsid:3990D1DC-F936-4f97-B2D4-E67107E01B99";
var cactivex_video_version = "2,8,0,0";
var cactivex_audio_version = "2,4,0,0";
var cactivex_alarm_version = "1,1,3,0";
var cactivex_media_version = "1,7,3,0";

function cactivex_CreateVideoControl(SizeX, SizeY, Download) {
    var str = "";
    var down_str = "";
    if (Download == "enable") {
        down_str = " codebase=" + "\"" + "/nwcv4Ssetup.cab#Version=" + cactivex_video_version + "\"";
    }
    str = "<object tabindex=\"-1\" classid=" + "\"" + cactivex_video_clsid + "\"" +
        " id=" + "\"WebVideo\"" + " name=" + "\"WebVideo\"" +
        " style=" + "\"" + "width:" + SizeX + "px;" + " height:" + SizeY + "px;" +
        "\"" + down_str + "></object>";
    document.write(str);
}

/**
 * create audio element : <object></object>
 * @param Download
 */
function cactivex_CreateAudioControl(Download) {
    var str = "";
    var down_str = "";
    if (Download == "enable") {
        down_str = " codebase=" + "\"" + "/nwcv4Ssetup.cab#Version=" + cactivex_audio_version + "\"";
    }
    str = "<object tabindex=\"-1\" classid=" + "\"" + cactivex_audio_clsid + "\"" +
        " id=" + "\"WebAudio\"" + " name=" + "\"WebAudio\"" +
        " style=\"width:0px; height:0px;\"" +
        "\"" + down_str + "></object>";
    document.write(str);
}

function cactivex_CreateAlarmControl(Download) {
    var str = "";
    var down_str = "";
    if (Download == "enable") {
        down_str = " codebase=" + "\"" + "/nwcv4Ssetup.cab#Version=" + cactivex_alarm_version + "\"";
    }
    str = "<object tabindex=\"-1\" classid=" + "\"" + cactivex_alarm_clsid + "\"" +
        " id=" + "\"WebAlarmReceiver\"" + " name=" + "\"WebAlarmReceiver\"" +
        " style=\"width:0px; height:0px;\""
         + "></object>";
    document.write(str);
}

/**
 * create media control element : <object></object>
 * @param SizeX
 * @param SizeY
 * @param Download
 */
function cactivex_CreateMediaControl(SizeX, SizeY, Download) {
    var str = "";
    var down_str = "";
    if (Download == "enable") {
        down_str = " codebase=" + "\"" + "/nwcv4Ssetup.cab#Version=" + cactivex_media_version + "\"";
    }
    str = "<object tabindex=\"-1\" classid=" + "\"" + cactivex_media_clsid + "\"" +
        " id=" + "\"WebVideo\"" + " name=" + "\"WebVideo\"" +
        " style=" + "\"" + "width:" + SizeX + "px;" + " height:" + SizeY + "px;" +
        "\"" + down_str + "></object>";
    document.write(str);
}

////nulti views
function cactivex_CreateVideoCtrlMulti(SizeX, SizeY, Download, No) {
    var str = "";
    var down_str = "";
    if (Download == "enable") {
        down_str = " codebase=" + "\"" + "/nwcv4Ssetup.exe#Version=" + cactivex_video_version + "\"";
    } else {
// DO NOTHING
    }
    str = "<object tabindex=\"-1\" classid=" + "\"" + cactivex_video_clsid + "\"" +
        " id=" + "\"WebVideo" + No + "\"" + " name=" + "\"WebVideo" + No + "\"" +
        " style=" + "\"" + "width:" + SizeX + "px;" + " height:" + SizeY + "px;" +
        "\"" + down_str + "></object>";
//document.write(str);
    return str;
}
