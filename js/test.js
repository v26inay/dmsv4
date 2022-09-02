$(function () {

    'use strict';

    const d = new Date();
    const currentYear = d.getFullYear();
    const currentMonth = '0' + parseInt(d.getMonth() + 1);
    const currentDate = '0' + d.getDate();

    $('#form-signin').on('submit', function (e) {
        e.preventDefault();
        if (!($.trim($('#email').val()) && $.trim($('#password').val()) && $.trim($('#totp').val()))) {
            $('#msg0').html('<b>Error:</b> Invalid data was submitted in field(s).');
            showAlertDanger();
            return;
        }
        if (!validateInteger($('#totp').val(), '6')) {
            $('#msg0').html('<b>Error:</b> TOTP must contain 6 digits.');
            showAlertDanger();
            return;
        }
        grecaptcha.ready(function () {
            grecaptcha.execute('6LcmZj4hAAAAAD_nfd1G2ElMlb7kTn6m-Zp1yS6N', {
                action: 'sign_in_to_dms'
            }).then(function (token) {
                let email, password, totp, url;
                email = $('#email').val();
                password = $('#password').val();
                totp = $('#totp').val();
                url = $('#url').val();
                attemptSignin(email, password, totp, url, token);
            });
        });
    });

    $('#form-recovercredentials').on('submit', function (e) {
        e.preventDefault();
        if (!($.trim($('#email-recovercredentials').val()) && $.trim($('#key').val()))) {
            $('#msg0').html('<b>Error:</b> Invalid data was submitted in field(s).');
            showAlertDanger();
            return;
        }
        if (!validateInteger($('#key').val(), '5,10')) {
            $('#msg0').html('<b>Error:</b> Key must contain minimum 5 and maximum 10 digits.');
            showAlertDanger();
            return;
        }
        grecaptcha.ready(function () {
            grecaptcha.execute('6LcmZj4hAAAAAD_nfd1G2ElMlb7kTn6m-Zp1yS6N', {
                action: 'recover_credentials'
            }).then(function (token) {
                let email, key;
                email = $('#email-recovercredentials').val();
                key = $('#key').val();
                attemptRecovercredentials(email, key, token);
            });
        });
    });

    $('#form-resetpass').on('submit', function (e) {
        e.preventDefault();
        if (!($.trim($('#newPass').val()) && $.trim($('#cnfPass').val()))) {
            $('#msg0').html('<b>Error:</b> Invalid data was submitted in field(s).');
            showAlertDanger();
            return;
        }
        if ($('#newPass').val() !== $('#cnfPass').val()) {
            $('#msg0').html('<b>Error:</b> New password & confirm new password do not match. Try again!');
            showAlertDanger();
            return;
        }
        grecaptcha.ready(function () {
            grecaptcha.execute('6LcmZj4hAAAAAD_nfd1G2ElMlb7kTn6m-Zp1yS6N', {
                action: 'reset_password'
            }).then(function (token) {
                let newPass, cnfPass, t, e;
                newPass = $('#newPass').val();
                cnfPass = $('#cnfPass').val();
                t = $('#t').val();
                e = $('#e').val();
                attemptResetpassword(newPass, cnfPass, t, e, token);
            });
        });
    });

    $('#form-radio-mobile').on('submit', function (e) {
        e.preventDefault();
        if (!($.trim($('#countryCode').val()) && $.trim($('#mobile').val()) && $.trim($('#curPassM').val()) && $.trim($('#totpM').val()))) {
            $('#msg0').html('Ahem! Required fields can\'t be left empty.');
            showAlertDanger();
            return;
        }
        if (!validateInteger($('#mobile').val(), '10')) {
            $('#msg0').html('<b>Error:</b> Mobile number must contain 10 digits.');
            showAlertDanger();
            return;
        }
        if (!validateInteger($('#totpM').val(), '6')) {
            $('#msg0').html('<b>Error:</b> TOTP must contain 6 digits.');
            showAlertDanger();
            return;
        }
        $.ajax({
            method: 'POST',
            url: 'index',
            data: $(this).serialize(),
            timeout: 14000,
            beforeSend: function () {
                $('#submitM').attr('disabled', true);
                $('#submitM').html('<i class="fa-solid fa-spinner fa-spin-pulse fa-xl fa-fw"></i>Submitting...');
            }
        }).done(function (res, textStatus, jqXHR) {
            if (jqXHR.getResponseHeader('content-security-policy')) {
                redirect();
                return;
            }
            setTimerVal();
            let data = JSON.parse(res);
            if (data.res === 1) {
                $('#form-radio-mobile').trigger('reset');
                if ($('select').length) {
                    $('#form-radio-mobile').find('.selectized').each(function (index, element) { element.selectize && element.selectize.clear() })
                }
                document.body.scrollTop = document.documentElement.scrollTop = 0;
                location.href = data.msg;
                return;
            }
            if (data.res === 0) {
                $('#msg0').html(data.msg);
                showAlertDanger();
                return;
            }
            if (data.res === 2) {
                localStorage.setItem('logout-event', 'logout' + Math.random());
                location.href = data.msg;
            }
        }).fail(function (jqXHR, textStatus, errorThrown) {
            $('#msg0').html('Error in processing request: ' + errorThrown + '.');
            showAlertDanger();
        }).always(function () {
            $('#submitM').html('Submit');
            $('#submitM').attr('disabled', false);
        });
    });

    $('#form-radio-key').on('submit', function (e) {
        e.preventDefault();
        if (!($.trim($('#key').val()) && $.trim($('#curPassK').val()) && $.trim($('#totpK').val()))) {
            $('#msg0').html('Ahem! Required fields can\'t be left empty.');
            showAlertDanger();
            return;
        }
        if (!validateInteger($('#key').val(), '5,10')) {
            $('#msg0').html('<b>Error:</b> Key must contain minimum 5 and maximum 10 digits.');
            showAlertDanger();
            return;
        }
        if (!validateInteger($('#totpK').val(), '6')) {
            $('#msg0').html('<b>Error:</b> TOTP must contain 6 digits.');
            showAlertDanger();
            return;
        }
        $.ajax({
            method: 'POST',
            url: 'index',
            data: $(this).serialize(),
            timeout: 14000,
            beforeSend: function () {
                $('#submitK').attr('disabled', true);
                $('#submitK').html('<i class="fa-solid fa-spinner fa-spin-pulse fa-xl fa-fw"></i>Submitting...');
            }
        }).done(function (res, textStatus, jqXHR) {
            if (jqXHR.getResponseHeader('content-security-policy')) {
                redirect();
                return;
            }
            setTimerVal();
            let data = JSON.parse(res);
            if (data.res === 1) {
                $('#form-radio-key').trigger('reset');
                document.body.scrollTop = document.documentElement.scrollTop = 0;
                location.href = data.msg;
                return;
            }
            if (data.res === 0) {
                $('#msg0').html(data.msg);
                showAlertDanger();
                return;
            }
            if (data.res === 2) {
                localStorage.setItem('logout-event', 'logout' + Math.random());
                location.href = data.msg;
            }
        }).fail(function (jqXHR, textStatus, errorThrown) {
            $('#msg0').html('Error in processing request: ' + errorThrown + '.');
            showAlertDanger();
        }).always(function () {
            $('#submitK').html('Submit');
            $('#submitK').attr('disabled', false);
        });
    });

    $('#form-radio-password').on('submit', function (e) {
        e.preventDefault();
        if (!($.trim($('#newPass').val()) && $.trim($('#cnfPass').val()) && $.trim($('#curPassP').val()) && $.trim($('#totpP').val()))) {
            $('#msg0').html('Ahem! Required fields can\'t be left empty.');
            showAlertDanger();
            return;
        }
        if ($('#newPass').val() !== $('#cnfPass').val()) {
            $('#msg0').html('<b>Error:</b> New password & confirm new password do not match. Try again!');
            showAlertDanger();
            return;
        }
        if ($('#newPass').val() === $('#curPassP').val()) {
            $('#msg0').html('<b>Error:</b> Current password and new password must not be same.');
            showAlertDanger();
            return;
        }
        if (!validateInteger($('#totpP').val(), '6')) {
            $('#msg0').html('<b>Error:</b> TOTP must contain 6 digits.');
            showAlertDanger();
            return;
        }
        $.ajax({
            method: 'POST',
            url: 'index',
            data: $(this).serialize(),
            timeout: 14000,
            beforeSend: function () {
                $('#submitP').attr('disabled', true);
                $('#submitP').html('<i class="fa-solid fa-spinner fa-spin-pulse fa-xl fa-fw"></i>Submitting...');
            }
        }).done(function (res, textStatus, jqXHR) {
            if (jqXHR.getResponseHeader('content-security-policy')) {
                redirect();
                return;
            }
            setTimerVal();
            let data = JSON.parse(res);
            if (data.res === 1) {
                $('#form-radio-password').trigger('reset');
                localStorage.setItem('logout-event', 'logout' + Math.random());
                location.href = data.msg;
                return;
            }
            if (data.res === 0) {
                $('#msg0').html(data.msg);
                showAlertDanger();
                return;
            }
            if (data.res === 2) {
                localStorage.setItem('logout-event', 'logout' + Math.random());
                location.href = data.msg;
            }
        }).fail(function (jqXHR, textStatus, errorThrown) {
            $('#msg0').html('Error in processing request: ' + errorThrown + '.');
            showAlertDanger();
        }).always(function () {
            $('#submitP').html('Submit');
            $('#submitP').attr('disabled', false);
        });
    });

    $('#form-email').on('submit', function (e) {
        e.preventDefault();
        if (!($.trim($('#subject').val()) && $.trim($('#message').val()))) {
            $('#msg0').html('<b>Error:</b> Invalid data was submitted in field(s).');
            showAlertDanger();
            return;
        }
        $.ajax({
            method: 'POST',
            url: 'index',
            data: $(this).serialize(),
            timeout: 14000,
            beforeSend: function () {
                $('#submit').attr('disabled', true);
                $('#submit').html('<i class="fa-solid fa-spinner fa-spin-pulse fa-xl fa-fw"></i>Submitting...');
            }
        }).done(function (res, textStatus, jqXHR) {
            if (jqXHR.getResponseHeader('content-security-policy')) {
                redirect();
                return;
            }
            setTimerVal();
            let data = JSON.parse(res);
            if (data.res === 1) {
                $('#msg1').html(data.msg);
                $('#form-email').trigger('reset');
                $('#form-email').find('*').filter(':input:visible:first').focus();
                showAlertSuccess();
                return;
            }
            if (data.res === 0) {
                $('#msg0').html(data.msg);
                showAlertDanger();
            }
        }).fail(function (jqXHR, textStatus, errorThrown) {
            $('#msg0').html('Error in processing request: ' + errorThrown + '.');
            showAlertDanger();
        }).always(function () {
            $('#submit').html('Submit');
            $('#submit').attr('disabled', false);
        });
    });

    $('#form-upload').on('submit', function (e) {
        e.preventDefault();
        $.ajax({
            method: 'POST',
            url: 'write',
            data: new FormData(this),
            timeout: 840000,
            contentType: false,
            processData: false,
            beforeSend: function () {
                $('#upload').attr('disabled', true);
                $('#upload').html('<i class="fa-solid fa-spinner fa-spin-pulse fa-xl fa-fw"></i>Uploading...');
                $('#file-progress-bar').width('0%');
                $('.progress').fadeIn('slow');
            },
            xhr: function () {
                let xhr = new window.XMLHttpRequest();
                xhr.upload.addEventListener('progress', function (element) {
                    if (element.lengthComputable) {
                        let percentComplete = Math.ceil((element.loaded / element.total) * 100);
                        $('#file-progress-bar').width(percentComplete + '%');
                        $('#file-progress-bar').html(percentComplete + '%');
                    }
                }, false);
                return xhr;
            }
        }).done(function (res, textStatus, jqXHR) {
            if (jqXHR.getResponseHeader('content-security-policy')) {
                redirect();
                return;
            }
            setTimerVal();
            let data = JSON.parse(res);
            if (data.res === 1) {
                $('#msg1').html(data.msg);
                $('#form-upload').trigger('reset');
                if ($('select').length) {
                    $('#form-upload').find('.selectized').each(function (index, element) { element.selectize && element.selectize.clear() })
                }
                showAlertSuccess();
                setTimeout(function () {
                    $('#form-upload').find('*').filter(':input:visible:first').focus();
                }, 1500);
                return;
            }
            if (data.res === 0) {
                $('#msg0').html(data.msg);
                showAlertDanger();
            }
        }).fail(function (jqXHR, textStatus, errorThrown) {
            $('#msg0').html('Error in processing request: ' + errorThrown + '.');
            showAlertDanger();
        }).always(function () {
            $('.progress').fadeOut('slow');
            $("#upload").html('Upload');
            $('#upload').attr('disabled', false);
        });
    });

    $('.radio-departments').on('click', function () {
        let department = $(this).val();
        $.ajax({
            method: 'POST',
            url: 'index',
            data: { department: department },
            timeout: 14000,
            beforeSend: function () {
                $('.alert, #tabledi-container').hide();
            }
        }).done(function (res, textStatus, jqXHR) {
            if (jqXHR.getResponseHeader('content-security-policy')) {
                redirect();
                return;
            }
            setTimerVal();
            let data = JSON.parse(res);
            if (data.res === 1) {
                if ($.fn.DataTable.isDataTable('#tabledi')) {
                    $('#tabledi').DataTable().clear().destroy();
                }
                $('#tbody').find('tr').remove();
                for (let key in data.msg) {
                    let row = `<tr><td>${data.msg[key]}</td><td class="fitContent"><a href="${data.dep + '/' + key.concat('/read')}"><button type="button" class="btn btn-primary btn-sm">Read</button></a>&nbsp;/&nbsp;<a href="${data.dep + '/' + key.concat('/write')}"><button type="button" class="btn btn-primary btn-sm">Write</button></a></td></tr>`;
                    $('#tbody').append(row);
                }
                $('#tabledi-container').fadeIn('slow');
                $('#tabledi').DataTable({
                    ordering: false
                });
                $('.dataTables_length select').addClass('form-select form-select-sm dark');
                $('.dataTables_filter input').addClass('form-control form-control-sm dark').focus();
                $('.dataTables_filter input')[0].scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' });
                return;
            }
            if (data.res === 0) {
                $('#msg0').html(data.msg);
                showAlertDanger();
            }
        }).fail(function (jqXHR, textStatus, errorThrown) {
            $('#msg0').html('Error in processing request: ' + errorThrown + '.');
            showAlertDanger();
        });
    });

    $('[data-selection-selectize="selectize"]').selectize({
        sortField: { field: 'text' }
    });

    $('[data-selection-selectize="selectizeC"]').selectize({
        sortField: { field: 'text' },
        create: true
    });

    $('[data-selection-selectize="selectizem"]').selectize({
        sortField: { field: 'text' },
        plugins: ['remove_button']
    });

    $('[data-selection-selectize="selectizemC"]').selectize({
        sortField: { field: 'text' },
        create: true,
        plugins: ['remove_button']
    });

    $('[data-selection-datepicker="date"]').datepicker({
        startView: 2,
        format: 'yyyy-mm-dd',
        startDate: currentYear - 12 + '-01-01',
        endDate: Date.now(),
        autoHide: true
    });

    $('[data-selection-datepicker="dateYM"]').datepicker({
        startView: 2,
        format: 'yyyy-mm',
        startDate: currentYear - 12 + '-01-01',
        endDate: Date.now(),
        autoHide: true
    });

    $('[data-selection-datepicker="dateY"]').datepicker({
        startView: 2,
        format: 'yyyy',
        startDate: currentYear - 12 + '-01-01',
        endDate: Date.now(),
        autoHide: true
    });

    $('[data-selection-datepicker="dateFY"]').datepicker({
        startView: 2,
        startDate: currentYear - 12 + '-01-01',
        endDate: Date.now(),
        format: 'yyyy',
        autoHide: true,
        pick: function (e) {
            e.preventDefault();
            let selYear = e.date.getFullYear();
            let nxtYear = selYear + 1;
            let finYear = selYear + '-' + nxtYear;
            $(this).val(finYear);
        }
    });

    $('[data-selection-datepicker="dateF"]').datepicker({
        startView: 2,
        format: 'yyyy-mm-dd',
        startDate: Date.now() + 86400000,
        endDate: currentYear + 12 + '-01-01',
        autoHide: true
    });

    $('[data-dd="spark_reports"]').on('change', function () {
        $('.hidden').hide();
        if ($(this).val() === 'Daily') {
            $('#dateBlock').fadeIn('slow');
        } else {
            $('#yearMonthBlock').fadeIn('slow');
        }
    });

    $('[data-dd="cashflows"]').on('change', function () {
        $('.hidden').hide();
        if ($(this).val() === 'Daily Cash Flow') {
            $('#dateBlock').fadeIn('slow');
        } else {
            $('#yearMonthBlock').fadeIn('slow');
        }
    });

    $('#tablei thead tr:eq(1) th').each(function () {
        let title = $(this).text();
        $(this).html('<input type="search" class="column_search form-control form-control-sm dark" placeholder="Search ' + title + '" />');
    });
    let tablei = $('#tablei').on('xhr.dt', function (e, settings, json, xhr) {
        if (xhr.getResponseHeader('content-security-policy')) {
            redirect();
            return;
        }
        if (xhr.statusText === 'timeout') {
            $('#msg0').html('Error in processing request: ' + xhr.statusText + '.');
            showAlertDanger();
        }
    }).DataTable({
        orderCellsTop: true,
        processing: true,
        serverSide: true,
        ajax: {
            method: 'POST',
            url: 'read',
            data: function (d) {
                d.csrfToken = $('#csrfToken').val();
            },
            timeout: 14000,
            beforeSend: function () {
                setTimeout(function () {
                    $('.alert').hide();
                }, 7000);
            },
            dataSrc: function (json) {
                setTimerVal();
                if (json.res === 0) {
                    $('#msg0').html(json.msg);
                    showAlertDanger();
                    return;
                }
                return json.data;
            }
        },
        deferRender: true,
        order: [[0, 'desc']],
        search: {
            return: true
        }
    });
    $('#tablei thead').on('keyup change clear', '.column_search', function (e) {
        if (e.keyCode === 13) {
            tablei.column($(this).parent().index()).search(this.value).draw();
        }
    });

    $('#tablec').on('click', 'button', function () {
        $(this).blur();
        $('.alert').hide();
        if ($(this).hasClass('show-alert')) {
            $('#msg0').html('Company / project not yet on DMS. We are working! Please check back in some days!');
            showAlertDanger();
        }
    });
    $('#tablec').DataTable({
        ordering: false
    });

    $('.dataTables_length select').addClass('form-select form-select-sm dark');
    $('.dataTables_filter input').addClass('form-control form-control-sm dark').focus();
    $.fn.dataTable.ext.errMode = 'none';
    $.fn.dataTable.ext.errMode = () => {
        $('#msg0').html('Error in processing request: Table error.');
        showAlertDanger();
    }

    $('#toggle-form-containers').on('click', function (e) {
        e.preventDefault();
        if ($(this).html() === '<i class="fa-solid fa-unlock fa-fw"></i>Recover credentials?') {
            $(this).html('<i class="fa-solid fa-right-to-bracket fa-fw"></i>Sign in to DMS?');
        } else {
            $(this).html('<i class="fa-solid fa-unlock fa-fw"></i>Recover credentials?');
        }
        $('#form-signin-container, #form-recovercredentials-container').toggle('slow');
    });

    $('.btn-close').on('click', function () {
        $(this).closest('.alert').fadeOut('slow');
    });

    $('.hide-alert').on('click', function () {
        $('.alert').hide();
    });

    $('.blur').on('click', function () {
        $(this).blur();
    });

    $('#newPass, #cnfPass').on('paste', function (e) {
        e.preventDefault();
    });

    $('[type="radio"]').prop('checked', false);

    $('.radio-teamprogress').on('click', function () {
        $('.hidden').hide();
        let input = $(this).val();
        $('#show' + input).fadeIn('slow');
    });

    $('.radio-userprofile').on('click', function () {
        $('.alert').hide();
        $('.hidden').hide();
        let input = $(this).val();
        $('#show-' + input).fadeIn('slow');
        $('#form-' + input).find('*').filter(':input:visible:first')[0].scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' });
        setTimeout(function () {
            $('#form-' + input).find('*').filter(':input:visible:first').focus();
        }, 500);
    });

    $('#logout').on('click', function () {
        localStorage.setItem('logout-event', 'logout' + Math.random());
    });

    $('#timer-reset').on('click', function (e) {
        e.preventDefault();
        setTimer();
        $('#timer-reset').css('pointer-events', 'none');
        setTimeout(function () {
            $('#timer-reset').css('pointer-events', 'auto');
        }, 60000);
    });

    if ($('#timer-reset').length) {
        setTimerVal();
    }

    $('#tablei tbody').on('click', 'a', function () {
        setTimerVal();
    });

    $('#form-email, #form-upload').find('*').filter(':input:visible:first').focus();

    $('#file').on('change', function () {
        if (!$('#file')[0].files.length) {
            return;
        }
        let file = this.files[0];
        let fileType = file.name.split('.').pop().toLowerCase();
        let fileSize = file.size;
        let validFileType = this.getAttribute('data-valid-file-type');
        let validFileSize = parseInt(this.getAttribute('data-valid-file-size'));
        if (validateFileType(fileType, validFileType)) {
            validateFileSize(fileSize, validFileSize);
        }
    });
});

window.addEventListener('storage', function (e) {
    if (e.key === 'logout-event') {
        location.href = '/logout';
    }
});

/* $(document).on('keydown', function (e) {
    if (e.keyCode == 123) {
        return false;
    }
    if (e.ctrlKey && e.shiftKey && e.keyCode == 73) {
        return false;
    }
    if (e.ctrlKey && e.shiftKey && e.keyCode == 74) {
        return false;
    }
    if (e.ctrlKey && e.keyCode == 85) {
        return false;
    }
});

$(document).on('contextmenu', function (e) {
    if (!($(e.target).is('[type="text"]') || $(e.target).is('textarea') || $(e.target).is('[type="search"]'))) {
        return false;
    }
}); */

function attemptSignin(email, password, totp, url, token) {
    $.ajax({
        method: 'POST',
        url: 'index',
        data: {
            email: email,
            password: password,
            totp: totp,
            url: url,
            token: token,
            action: 'sign_in_to_dms'
        },
        timeout: 14000,
        beforeSend: function () {
            $('#signin').attr('disabled', true);
            $('#signin').html('<i class="fa-solid fa-spinner fa-spin-pulse fa-xl fa-fw"></i>Signing in...');
        }
    }).done(function (res, textStatus, jqXHR) {
        let data = JSON.parse(res);
        if (data.res === 0) {
            $('#msg0').html(data.msg);
            showAlertDanger();
            return;
        }
        if (data.res === 1) {
            $('#form-signin').trigger('reset');
            location.href = data.msg;
        }
    }).fail(function (jqXHR, textStatus, errorThrown) {
        $('#msg0').html('Error in processing request: ' + errorThrown + '.');
        showAlertDanger();
    }).always(function () {
        $('#signin').html('Sign in');
        $('#signin').attr('disabled', false);
    });
}

function attemptRecovercredentials(email, key, token) {
    $.ajax({
        method: 'POST',
        url: 'index',
        data: {
            'email-recovercredentials': email,
            key: key,
            token: token,
            action: 'recover_credentials'
        },
        timeout: 14000,
        beforeSend: function () {
            $('#submit').attr('disabled', true);
            $('#submit').html('<i class="fa-solid fa-spinner fa-spin-pulse fa-xl fa-fw"></i>Submitting...');
        }
    }).done(function (res, textStatus, jqXHR) {
        let data = JSON.parse(res);
        if (data.res === 0) {
            $('#msg0').html(data.msg);
            showAlertDanger();
            return;
        }
        if (data.res === 1) {
            $('#form-recovercredentials').trigger('reset');
            $('#msg1').html(data.msg);
            showAlertSuccess();
        }
    }).fail(function (jqXHR, textStatus, errorThrown) {
        $('#msg0').html('Error in processing request: ' + errorThrown + '.');
        showAlertDanger();
    }).always(function () {
        $('#submit').html('Submit');
        $('#submit').attr('disabled', false);
    });
}

function attemptResetpassword(newPass, cnfPass, t, e, token) {
    $.ajax({
        method: 'POST',
        url: 'index',
        data: {
            newPass: newPass,
            cnfPass: cnfPass,
            t: t,
            e: e,
            token: token,
            action: 'reset_password'
        },
        timeout: 14000,
        beforeSend: function () {
            $('#submit').attr('disabled', true);
            $('#submit').html('<i class="fa-solid fa-spinner fa-spin-pulse fa-xl fa-fw"></i>Submitting...');
        }
    }).done(function (res, textStatus, jqXHR) {
        let data = JSON.parse(res);
        if (data.res === 0) {
            $('#msg0').html(data.msg);
            showAlertDanger();
            return;
        }
        if (data.res === 1) {
            $('#form-resetpass').trigger('reset');
            location.href = data.msg;
        }
    }).fail(function (jqXHR, textStatus, errorThrown) {
        $('#msg0').html('Error in processing request: ' + errorThrown + '.');
        showAlertDanger();
    }).always(function () {
        $('#submit').html('Submit');
        $('#submit').attr('disabled', false);
    });
}

function setTimer() {
    $.ajax({
        method: 'POST',
        url: '',
        data: { timer: 1 },
        timeout: 14000,
    }).done(function (res, textStatus, jqXHR) {
        if (jqXHR.getResponseHeader('content-security-policy')) {
            redirect();
            return;
        }
        let data = JSON.parse(res);
        if (data.res === 1) {
            setTimerVal();
        }
    }).fail(function (jqXHR, textStatus, errorThrown) {
        $('#msg0').html('Error in processing RESET TIMER request: ' + errorThrown + '.');
        showAlertDanger();
    });
}

function setTimerVal() {
    localStorage.timer = +new Date() + parseInt(840 * 1000);
    let x = setInterval(function () {
        let remaining = localStorage.timer - new Date();
        if (remaining >= 0) {
            let duration, minutes, seconds;
            duration = Math.floor(remaining / 1000);
            minutes = parseInt(duration / 60, 10);
            seconds = parseInt(duration % 60, 10);
            minutes = minutes < 10 ? '0' + minutes : minutes;
            seconds = seconds < 10 ? '0' + seconds : seconds;
            $('#timer').text(minutes + ':' + seconds);
        } else {
            clearInterval(x);
            location.href = '/logout?url=' + location.pathname + '&sess=0';
        }
    }, 100);
}

function validateFileType(fileType, validFileType) {
    if (validFileType === 'common') {
        var allowedTypes = ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'eml', 'msg', 'rar'];
        var msg = 'PDF, Word, Excel, PowerPoint, WebMail, OutlookMail or RAR';
    }
    if (validFileType === 'pdf') {
        var allowedTypes = ['pdf'];
        var msg = 'PDF only';
    }
    if (!allowedTypes.includes(fileType)) {
        $('#file').val('');
        $('#fileErr').html('File Error: Please choose a valid file. (' + msg + ')');
        return false;
    }
    $('#fileErr').html('');
    return true;
}

function validateFileSize(fileSize, validFileSize) {
    if (fileSize > validFileSize * 1048576) {
        $('#file').val('');
        $('#fileErr').html('File Error: File size shouldn\'t exceed ' + validFileSize + ' MB.');
        return;
    }
    $('#fileErr').html('');
}

function showAlertDanger() {
    $('#res0').fadeIn('slow');
    $('#res0')[0].scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' });
}

function showAlertSuccess() {
    $('#res1').fadeIn('slow');
    $('#res1')[0].scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' });
}

function redirect() {
    location.href = '/?url=' + location.pathname + '&sess=0';
}

function validateInteger(int, length) {
    let thisRegex = new RegExp('^[0-9]{' + length + '}$');
    return thisRegex.test(int);
}

function dmsminjs() { }

let tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
let tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
    return new bootstrap.Tooltip(tooltipTriggerEl)
});