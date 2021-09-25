using System;

namespace CourtSystemAPI.Models
{
    public class Notification
    {
        public Guid Id { get; init; }
        public string UserTo { get; set; }
        public string UserFrom { get; set; }
        public string Message { get; set; }
        public int Status { get; set; }
        public DateTimeOffset CreatedDate { get; set; }
    }
}