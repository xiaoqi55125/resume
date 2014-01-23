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

            if (ext && /^(html|zip|htm|)$/.test(ext)) {
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
            	$("#showDetail").html("");
            	$("#logErrAndDup").hide();
                oBtn.value = "上传成功,继续上传?";
                oRemind.innerHTML = "";
                var tempLog = "";
                if (response.data.err) {
                    $("#logErrAndDup").show();
                    tempLog += "<p>错误信息</p>"
                    tempLog += "<p>" + response.data.err + "</p>";
                }
                if (response.data.dup) {
                    $("#logErrAndDup").show();
                    tempLog += "<p>重复信息</p>"
                    tempLog += "<p>" + response.data.dup + "</p>";
                }
                $("#showDetail").append(tempLog);
            }
        }
    });
}