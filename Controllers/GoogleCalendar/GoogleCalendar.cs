using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Google.Apis.Auth.OAuth2;
using Google.Apis.Calendar.v3;
using Google.Apis.Calendar.v3.Data;
using Google.Apis.Services;
using Microsoft.AspNetCore.Mvc;
using System.Web;
using GoogleCalendarSnrCiv.Models;
using GoogleCalendarSnrCiv.Dtos;
using Google.Apis.Util.Store;
/*
 Created by: Snrc97 (Github) 
 February 2024
*/

[Route("GoogleCalendar")]
public class GoogleCalendar : Controller
{
    // Get your credentials file from the Google Cloud Console
    private static string[] Scopes = { CalendarService.Scope.Calendar, CalendarService.Scope.CalendarEvents };
    private static string ApplicationName = "Web client 1";
    private string ClientSecretPath => _webHostEnvironment.WebRootPath + "/auth/client_secret.json"; // Got from Google Workspace
    private string credPath => _webHostEnvironment.WebRootPath + "/auth/credPath"; // The file inside the folder must be deleted when changed user inside GoogleWebAuthorizationBroker.AuthorizeAsync(
    public static string CalendarId = "81631d85ca67f34b13829723282807e3e4a539328d6820628f42d27ad74b60b4@group.calendar.google.com";

    IWebHostEnvironment _webHostEnvironment;
    public GoogleCalendar(IWebHostEnvironment webHostEnvironment)
    {
        _webHostEnvironment = webHostEnvironment;
    }

    [Route("Home")]
    public ActionResult Index()
    {
        return View("~/Views/GoogleCalendar/GoogleCalendar.cshtml");
    }

    [Route("List")]
    public async Task<ActionResult> ListEvents()
    {
        var service = await GetCalendarService();
        Events events = await service.Events.List(CalendarId).ExecuteAsync();
        var eventViewModels = new List<EventViewModel>();
        foreach(var ev in events.Items)
        {
            eventViewModels.Add(new EventViewModel { 
                Id = ev.Id, 
                Summary = ev.Summary,
                Start = ev.Start.DateTimeDateTimeOffset?.DateTime ?? DateTime.Now,
                End = ev.End.DateTimeDateTimeOffset?.DateTime ?? DateTime.Now,
            });
        }

        GC.SuppressFinalize(events);

        // Option 1: Using JsonResult class
        JsonResult jsonResult = new JsonResult(eventViewModels);
        

        return jsonResult;
    }

    [Route("Create")]
    public async Task<ActionResult> CreateEvent()
    {
        var service = await GetCalendarService();

        var newEvent = new Event
        {
            Summary = "New Event",
            Start = new EventDateTime { DateTimeDateTimeOffset = DateTime.Now },
            End = new EventDateTime { DateTimeDateTimeOffset = DateTime.Now.AddHours(1) },
        };

        await service.Events.Insert(newEvent, CalendarId).ExecuteAsync();

        return RedirectToAction("Index");
    }

    [Route("Update")]
    public async Task<ActionResult> UpdateEvent([FromBody] EventDto data)
    {
        var service = await GetCalendarService();

        // Get the existing event
        EventsResource.GetRequest getRequest = service.Events.Get(CalendarId, data.Id);
        Event existingEvent = getRequest.Execute();

        // Update the event (for example, changing the summary)
        existingEvent.Summary = data.Summary;
        existingEvent.Start.DateTimeRaw = data.Start.ToLocalTime().AddHours(-3).ToString("yyyy-MM-ddTHH:mm:ssK"); // data.Start.ToString("yyyy-MM-ddTHH:mm:ss"); //
        existingEvent.End.DateTimeRaw = data.End.ToLocalTime().AddHours(-3).ToString("yyyy-MM-ddTHH:mm:ssK"); // data.End.ToString("yyyy-MM-ddTHH:mm:ss"); // 

        // Execute the update request
        EventsResource.UpdateRequest updateRequest = service.Events.Update(existingEvent, CalendarId, data.Id);
        updateRequest.Execute();

        return RedirectToAction("Index"); // Redirect to the list of events or another appropriate action
    }

    [Route("Delete")]
    public async Task<ActionResult> DeleteEvent([FromBody] string Id)
    {
        var service = await GetCalendarService();

        await service.Events.Delete(CalendarId, Id).ExecuteAsync();

        return RedirectToAction("Index");
    }

    private async Task<CalendarService> GetCalendarService()
    {
        UserCredential credential;
        using (var stream = new System.IO.FileStream(ClientSecretPath, System.IO.FileMode.Open, System.IO.FileAccess.Read))
        {
            credential = await GoogleWebAuthorizationBroker.AuthorizeAsync(
                GoogleClientSecrets.FromStream(stream).Secrets,
                Scopes,
                "user1",
                CancellationToken.None,
                new FileDataStore(credPath, true)
            );
        }

        var service = new CalendarService(new BaseClientService.Initializer()
        {
            HttpClientInitializer = credential,
            ApplicationName = ApplicationName,
        });

        return service;
    }
}