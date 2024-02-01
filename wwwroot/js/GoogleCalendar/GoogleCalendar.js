

///* exported gapiLoaded */
///* exported gisLoaded */
///* exported handleAuthClick */
///* exported handleSignoutClick */

//// TODO(developer): Set to client ID and API key from the Developer Console
//const CLIENT_ID = '702440134969-k7qblvduplgqcm4kqog9kqf5ll6viso1.apps.googleusercontent.com';
//const API_KEY = 'AIzaSyDXUjL3xiIwyqi_O6wM_mPVuVIVaeGFUa4';

//// Discovery doc URL for APIs used by the quickstart
//const DISCOVERY_DOC = 'https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest';

//// Authorization scopes required by the API; multiple scopes can be
//// included, separated by spaces.
//const SCOPES = 'https://www.googleapis.com/auth/calendar.readonly';

//let tokenClient;
//let gapiInited = false;
//let gisInited = false;

//document.getElementById('authorize_button').style.visibility = 'hidden';
//document.getElementById('signout_button').style.visibility = 'hidden';

///**
// * Callback after api.js is loaded.
// */
//function gapiLoaded() {
//    gapi.load('client', initializeGapiClient);
//}

///**
// * Callback after the API client is loaded. Loads the
// * discovery doc to initialize the API.
// */
//async function initializeGapiClient() {
//    await gapi.client.init({
//        apiKey: API_KEY,
//        discoveryDocs: [DISCOVERY_DOC],
//    });
//    gapiInited = true;
//    maybeEnableButtons();
//}

///**
// * Callback after Google Identity Services are loaded.
// */
//function gisLoaded() {
//    tokenClient = google.accounts.oauth2.initTokenClient({
//        client_id: CLIENT_ID,
//        scope: SCOPES,
//        callback: '', // defined later
//    });
//    gisInited = true;
//    maybeEnableButtons();
//}

///**
// * Enables user interaction after all libraries are loaded.
// */
//function maybeEnableButtons() {
//    if (gapiInited && gisInited) {
//        document.getElementById('authorize_button').style.visibility = 'visible';
//    }
//}

///**
// *  Sign in the user upon button click.
// */
//function handleAuthClick() {
//    tokenClient.callback = async (resp) => {
//        if (resp.error !== undefined) {
//            throw (resp);
//        }
//        document.getElementById('signout_button').style.visibility = 'visible';
//        document.getElementById('authorize_button').innerText = 'Refresh';
//        await listUpcomingEvents();
//    };

//    if (gapi.client.getToken() === null) {
//        // Prompt the user to select a Google Account and ask for consent to share their data
//        // when establishing a new session.
//        tokenClient.requestAccessToken({ prompt: 'consent' });
//    } else {
//        // Skip display of account chooser and consent dialog for an existing session.
//        tokenClient.requestAccessToken({ prompt: '' });
//    }
//}

///**
// *  Sign out the user upon button click.
// */
//function handleSignoutClick() {
//    const token = gapi.client.getToken();
//    if (token !== null) {
//        google.accounts.oauth2.revoke(token.access_token);
//        gapi.client.setToken('');
//        document.getElementById('content').innerText = '';
//        document.getElementById('authorize_button').innerText = 'Authorize';
//        document.getElementById('signout_button').style.visibility = 'hidden';
//    }
//}

///**
// * Print the summary and start datetime/date of the next ten events in
// * the authorized user's calendar. If no events are found an
// * appropriate message is printed.
// */
//async function listUpcomingEvents() {
//    let response;
//    try {
//        const request = {
//            'calendarId': 'primary',
//            'timeMin': (new Date()).toISOString(),
//            'showDeleted': false,
//            'singleEvents': true,
//            'maxResults': 10,
//            'orderBy': 'startTime',
//        };
//        response = await gapi.client.calendar.events.list(request);
//    } catch (err) {
//        document.getElementById('content').innerText = err.message;
//        return;
//    }

//    const events = response.result.items;
//    if (!events || events.length == 0) {
//        document.getElementById('content').innerText = 'No events found.';
//        return;
//    }
//    // Flatten to string to display
//    const output = events.reduce(
//        (str, event) => `${str}${event.summary} (${event.start.dateTime || event.start.date})\n`,
//        'Events:\n');
//    document.getElementById('content').innerText = output;
//}

var _EventsList = [];
async function EventsList() {
    _EventsList = await AjaxGet("GoogleCalendar/List");
    DrawEventsListDataTable(_EventsList);
}
function DrawEventsListDataTable(data) {

    var table = $('#listEventsTable').DataTable();
    table.destroy();

    table = $('#listEventsTable').DataTable({
        paging: true,
        searching: true,
        ordering: true,
        data: data,
        retrieve: true,
        responsive: false,
        columns: [
            { data: "id", visible: false },
            {
                data: 'summary',
                width: "10px",
                title: 'Summary',
                render: function (data, type, row) {
                    if (type === 'display' || type === 'filter') {
                        return '<center><input class="row-input-text" id=\'Summary\' type=\'text\' value=\'' + row.summary + '\' onchange=\'OnUpdate(this, "' + row.id + '")\'/></center>';
                    }
                    return data;
                }
            },
            {
                data: 'start',
                width: "30px",
                title: 'Start Date',
                render: function (data, type, row) {
                    if (type === 'display' || type === 'filter') {
                        return '<center class="text-nowrap d-flex"><input class="row-input-date" id=\'StartDate\' type=\'date\' value=\'' + $.format.date(row.start, "yyyy-MM-dd") + '\' onchange=\'OnUpdate(this, "' + row.id + '")\'/><input class="row-input-time mx-auto" id=\'StartTime\' type=\'time\' value=\'' + $.format.date(row.start, "HH:mm:ss") + '\' min="0" max="23" onchange=\'OnUpdate(this, "' + row.id + '")\'/></center>';
                    }
                    return data;
                }
            },
            {
                data: 'end',
                width: "30px",
                title: 'End Date',
                render: function (data, type, row) {
                    if (type === 'display' || type === 'filter') {
                        return '<center class="text-nowrap d-flex"><input class="row-input-date" id=\'EndDate\' type=\'date\' value=\'' + $.format.date(row.end, "yyyy-MM-dd") + '\' onchange=\'OnUpdate(this, "' + row.id + '")\'/><input class="row-input-time mx-auto" id=\'EndTime\' type=\'time\' value=\'' + $.format.date(row.end, "HH:mm:ss") + '\' min="0" max="23" onchange=\'OnUpdate(this, "' + row.id + '")\'/></center>';
                    }
                    return data;
                }
            },
            {
                width: "30px",
                render: function (data, type, row) {
                    if (row.id.includes('-')) {
                        return "";
                    }
                    return '<center><button class="btn btn-success" onclick=\'EventUpdate("' + row.id + '")\'><i class="fa-solid fa-check"></i></button></center>';
                }
            },
            {
                width: "30px",
                render: function (data, type, row) {
                   
                    return '<center><button class="btn btn-danger" onclick=\'EventDelete("' + row.id + '")\'><i class="fa-solid fa-trash"></i></button></center>';
                }
            },
            {
                width: "30px",
                render: function (data, type, row) {
                    if (!row.id.includes('-')) {
                        return "";
                    }
                    return '<center><button class="btn btn-warning text-light" onclick=\'EventCreate("' + row.id + '")\'><i class="fa-solid fa-plus"></i></button></center>';
                }
            },
        ],
    });

    table.draw();

}

function OnAddEvent() {
    if (_EventsList.some(x => x.id.includes('-'))) {
        return;
    }

    var date = new Date(Date.now());
    var startDate = $.format.date(date.toString(), "yyyy-MM-ddTHH:mm:ss");
    var endDate = $.format.date(date.toString(), "yyyy-MM-ddTHH:mm:ss");

    var newEvent = { id: NewGuid(), start: startDate, end: endDate, summary: "Empty" }
    _EventsList.push(newEvent);
    DrawEventsListDataTable(_EventsList);
   
}

function OnUpdate(element, id) {
    
    let row = _EventsList.find(x => x.id == id);
    if (row == null) {
        return;
    }

    let inputid = $(element).attr("id");
    let parent = $(element).parent();
    let dateTime = null;

    

    switch (inputid) {
        case "StartDate":
        case "StartTime":
            let startDate = $(parent).find("#StartDate").val();
            let startTime = $(parent).find("#StartTime").val() + ":00";
            dateTime = $.format.date(startDate + " " + startTime, "yyyy-MM-ddTHH:mm:ss");
            row.start = dateTime;

            break;
        case "EndDate":
        case "EndTime":
            let endDate = $(parent).find("#EndDate").val();
            let endTime = $(parent).find("#EndTime").val() + ":00";
            dateTime = $.format.date(endDate + " " + endTime, "yyyy-MM-ddTHH:mm:ss");
            row.end = dateTime;

            break;

        case "Summary":
            row.summary = $(element).val();
            break;
    }
}


function EventCreate(id) {
   
    let row = _EventsList.find(x => x.id == id);
    if (row == null) {
        return;
    }

    var prm = { Id: row.id, Summary: row.summary, Start: row.start, End: row.end }
    AjaxPost("GoogleCalendar/Create", prm, EventCreateCallBack);
}

function EventCreateCallBack(res) {
    if (res) {
        Successful("Oluşturma işlemi Başarılı");
        EventsList();
        return;
    }

    Fail("Oluşturma işlemi Başarısız");
}

function EventUpdate(id) {
    
    let row = _EventsList.find(x => x.id == id);
    if (row == null) {
        return;
    }

    var prm = { Id: row.id, Summary: row.summary, Start: row.start, End: row.end }
    AjaxPost("GoogleCalendar/Update", prm, EventUpdateCallBack);
}

function EventUpdateCallBack(res) {
    if (res) {
        Successful("Güncelleme işlemi Başarılı");
        EventsList();
        return;
    }
    Fail("Güncelleme işlemi Başarısız");
}

function EventDelete(Id) {
    if (Id.includes('-')) {
        _EventsList = _EventsList.filter(x => x.id != Id);
        Successful("Silme işlemi Başarılı");
        DrawEventsListDataTable(_EventsList);
        return;
    }
    AjaxPost("GoogleCalendar/Delete", Id, EventDeleteCallBack);
}

function EventDeleteCallBack(res) {
    if (res) {
        Successful("Silme işlemi Başarılı");
        EventsList();
        return;
    }
    Fail("Silme işlemi Başarısız");
}

EventsList();