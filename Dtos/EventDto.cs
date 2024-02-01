using Google.Apis.Calendar.v3.Data;

namespace GoogleCalendarSnrCiv.Dtos
{
    public class EventDto : BaseDto
    {
        public required string Id  { get; set; }
        public required string Summary { get; set; }
        public DateTime Start { get; set; }
        public DateTime End { get; set; }
    }
}
