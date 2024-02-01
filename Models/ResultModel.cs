using Microsoft.AspNetCore.Mvc;

namespace GoogleCalendarSnrCiv.Models
{
    public class ResultModel : IActionResult
    {
       public string data { get; set; }

        public Task ExecuteResultAsync(ActionContext context)
        {
            throw new NotImplementedException();
        }
    }
}
