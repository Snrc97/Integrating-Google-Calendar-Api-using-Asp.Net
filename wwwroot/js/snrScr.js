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

function Refresh() {
    window.location = window.location;
}