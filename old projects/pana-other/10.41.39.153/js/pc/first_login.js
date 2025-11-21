/**
 * Created by kk-machong on 2018/08/29.
 */

(function initialize() {
    var isFirst = isFirstLogin();

    if (isFirst) {
        window.location.href = '/live/register.html';
    } else {
        $(function () {
                displayBaseHeaderTab.build();
            }
        )
    }
})();

/**
 * 初回ログイン判断
 */
function isFirstLogin() {
    var retValue = false;
    $.ajax({
        type: "get",
        url: "/cgi-bin/first_login",
        async: false,
        timeout: 100,
        success: function (data) {
            var params = eval("(" + data.replace(/&quot;/g, '"') + ")");
            var userNum = params['usernum'];
            if (userNum == 0) {
                retValue = true;
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
        }
    });
    return retValue;
}