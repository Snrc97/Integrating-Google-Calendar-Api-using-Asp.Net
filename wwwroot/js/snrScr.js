// Function to make an AJAX POST request
function AjaxPost(url, data, callback) {

    
    let index = url.indexOf('/');
    let controller = url.substr(0, index + 1);
    url = url.replace(controller, ""); 
    controller = controller.replace("/", "");
    
    $.ajax({
        type: "POST",
        url: url,
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify(data),
        beforeSend: function () {
            swal.fire({
                html: '<h5>İşlem devam ediyor...</h5>',
                showConfirmButton: false,
                onRender: function () {
                    // there will only ever be one sweet alert open.
                    $('.swal2-content').prepend(sweet_loader);
                }
            });
        },
        success: function (data) {
            callback(data); // xhr.responseText
        },
        error: function (xhr) {
            callback(null);
        }
    });
}

function AjaxGet(url) {

    return new Promise((resolve, reject) => {
        let index = url.indexOf('/');
        let controller = url.substr(0, index + 1);
        url = url.replace(controller, "");
        controller = controller.replace("/", "");

        $.ajax({
            type: "GET",
            url: url,
            contentType: "application/json; charset=utf-8",
            success: function (data) {
                resolve(data);
            },
            error: function (jqXHR, textStatus, errorThrown) {
                reject({ jqXHR, textStatus, errorThrown }); // Reject the Promise with an error object
            }
        });
    });
}

function NewGuid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'
        .replace(/[xy]/g, function (c) {
            const r = Math.random() * 16 | 0,
                v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
}

function Successful(text) {
    Swal.fire({
        title: "Başarılı",
        text: text,
        icon: "success",
        timer: 1500,
        showCancelButton: false,
        showConfirmButton: false
    });
}

function Fail(text) {
    Swal.fire({
        title: "Hata",
        text: text,
        icon: "error"
    });
}

function Refresh() {
    window.location = window.location;
}