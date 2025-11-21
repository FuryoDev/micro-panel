/**
 * Created by kk-wangpengze on 2020/09/21.
 */
var adminPage = false;
(function initialize() {
    isAdminPage();
})();

function isAdminPage() {

        if(window.parent.location.href.indexOf("admin") !="-1"){
            setTimeout(function(){
            $("#camera_controller_gui").css({
                "left":"0px",
                "top" :"60px"
            })
            $("#base").css("visibility","");
            //$('body').css("transform", "scale(1)");
            $("#preset_list_area,#base_header").hide();
            currentZoomValue = 1;
            },3000)
            adminPage = true;
        }

}