function validateFile(l){if(l.files[0].size/1024/1024>21)alert("Filesize must not exceed 21 MB."),$(l).val("");else{-1==$.inArray($(frmFil).val().split(".").pop().toLowerCase(),["pdf","doc","docx","xls","xlsx","ppt","pptx","msg","rar"])&&(alert("Allowed filetypes: PDF, Word, Excel, PowerPoint, OutlookMail and RAR."),$(frmFil).val(""))}}function filecs21(){}