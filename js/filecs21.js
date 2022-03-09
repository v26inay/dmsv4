function validateFile(file) {
	var fileSize = file.files[0].size / 1024 / 1024;
    if (fileSize > 21) {
        alert('Filesize should not exceed 21 MB.');
        $(file).val('');
    } 
    else {
        var fileExtension = ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'msg', 'rar'];
        if ($.inArray($(frmFil).val().split('.').pop().toLowerCase(), fileExtension) == -1) {
            alert("Allowed filetypes: PDF, Word, Excel, PowerPoint, OutlookMail and RAR.");
            $(frmFil).val('');
        }
    }
};
function filecs21() {};