using Google.Apis.Calendar.v3.Data;
using Newtonsoft.Json;

namespace GoogleCalendarSnrCiv.Dtos
{
    public class BaseDto
    {

        public string ToJSON()
        {
            return JsonConvert.SerializeObject(this);
        }
        
    }
}
