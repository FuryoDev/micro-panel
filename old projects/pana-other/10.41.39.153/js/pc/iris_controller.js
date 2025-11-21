/**
 * @fileOverview ログイン後の画面に関わる共通部を定義
 *
 * @author Panasonic Corporation
 */

/**
 * TACKING画面の制御に関わる基本クラスのインスタンス
 *  @type TrackingController
 */
var irisController = IrisController();
/**
 * Iris Process領域の制御処理の実体クラス
 * @class Iris Process領域の制御処理の実体クラス
 * @param {number} id 入力プロセスID
 * @return {function} build 構築処理
 * @return {function} rebuild 再構築処理
 * @constructor
 */
function IrisController() {
    /**
     * 構築済みフラグ
     * @type boolean
     */
    var buildFlag = false;
    function build() {
        if (!buildFlag) {
            buildFlag = true;
            initialMaskArea();
            initialSetupLiveMaskArea();
        } else {
            rebuild();
        }
    }
    function rebuild() {
        if (!buildFlag) {
            build();
        } else {
            initialMaskArea();
            $("#iris_setting_mask").show();
            initialSetupLiveMaskArea();
            $('#setup_live_iris_setting_mask', window.parent.document).show();
        }
    }
    function initialMaskArea() {
        $('#iris_setting_mask').empty();
        $('#iris_setting_mask').append($('<ol id="selectable">'));
        // var  $('#iris_setting_mask')
        for(var i= 0; i <45;i++){
            // $('#selectable').append($(`<li class="ui-state-default">${i}</li>`))
            $('#selectable').append($(`<li class="ui-state-default"></li>`))
        }
        // $(function() {
        $("#selectable").selectable({
            start: function (){
                $('#selectable>li').removeClass("ui-selected");
            },
            stop: function () {
                //   var result = $( "#select-result" ).empty();
                var result1
                var firstIndex
                var lastIndex
                $(".ui-selected", this).each(function () {
                    var index = $("#selectable li").index(this);
                    if(firstIndex == undefined){
                        firstIndex = index
                    }
                    lastIndex = index
                    // result.append( " #" + ( index + 1 ) );
                    // console.log('selected::::', index)
                    // console.log('x:',index % 9,'y:',parseInt(index / 9),'---')
                    // result1 = result1 ? (result1 + ',' + index) : index
                });
                // console.log('select result===', result1)
                // console.log('select firstIndex===', firstIndex)
                // console.log('select lastIndex===', lastIndex)
                var upperLeftH = firstIndex % 9;
                var upperLeftV = parseInt(firstIndex / 9);
                var bottomRightH = lastIndex % 9;
                var bottomRightV = parseInt(lastIndex / 9);
                cparam_set_iris_window_position(upperLeftH, upperLeftV, bottomRightH, bottomRightV);
                // console.log('cgi set===', upperLeftH + ':' + upperLeftV + ':' + bottomRightH + ':' + bottomRightV)
            },
            // autoRefresh:false
        });
        //   });
        // $('#iris_setting_mask').show()


        // $('.iris_setting_mask_item').addEventListener('')


    }
    function initialSetupLiveMaskArea() {
        $('#setup_live_iris_setting_mask', window.parent.document).empty();
        //$("#setup_live_iris_setting_mask", window.parent.document).css({'background-color':'red'});
        $('#setup_live_iris_setting_mask', window.parent.document).append($('<ol id="setup_live_selectable">'));
        for(var i= 0; i <45;i++){
            $('#setup_live_selectable', window.parent.document).append($(`<li class="ui-state-default"></li>`))
        }
        $("#setup_live_selectable", window.parent.document).selectable({
            start: function (){
                $('#setup_live_selectable>li', window.parent.document).removeClass("ui-selected");
            },
            stop: function () {
                var result1
                var firstIndex
                var lastIndex
                $(".ui-selected", this).each(function () {
                    var index = $("#setup_live_selectable li", window.parent.document).index(this);
                    if(firstIndex == undefined){
                        firstIndex = index
                    }
                    lastIndex = index
                });
                var upperLeftH = firstIndex % 9;
                var upperLeftV = parseInt(firstIndex / 9);
                var bottomRightH = lastIndex % 9;
                var bottomRightV = parseInt(lastIndex / 9);
                cparam_set_iris_window_position(upperLeftH, upperLeftV, bottomRightH, bottomRightV);
            },
        });
    }
    return {
        build: build,
        rebuild: rebuild,
        // changeSliderMode:function(mode) {
        //     hideChangeSlider(mode);
        //     showSlider();
        // },
        // hideChangeSliderMode: hideChangeSlider,
        // showSlider: showSlider
    };
}