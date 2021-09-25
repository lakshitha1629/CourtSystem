using System;

namespace CourtSystemAPI.Models.DTOs.Requests
{
    public class NotificationCreate
    {
        public string UserTo { get; set; }
        public string Message { get; set; }
        public int Status { get; set; }
    }
}