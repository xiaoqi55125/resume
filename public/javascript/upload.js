/**
 * load ajax upload
 * @return {null}
 */
function loadAjaxUpload() {
    var oBtn = document.getElementById("resumeInfo");
    var oShow = document.getElementById("uploadedName");
    var oRemind = document.getElementById("errorRemind");

    new AjaxUpload($("#resumeInfo"), {

        action: "/resume/upload",
        name: "file_source",
        responseType: "JSON",
        onSubmit: function(file, ext) {

            if (ext && /^(html|zip)$/.test(ext)) {
                oBtn.value = "正在上传…";
                //oBtn.disabled = "disabled";

            } else {
                oRemind.style.color = "#ff3300";
                oRemind.innerHTML = "不支持其他格式，请上传html或zip文件！";
                return false;
            }
        },
        onComplete: function(file, response) {
            if (!response.statusCode) {
                oBtn.value = "上传成功,继续上传?";
                oRemind.innerHTML = "";
            }
        }
    });
}