using System;

namespace CourtSystemAPI.Models.DTOs.Requests
{
    public class ArrestCreate
    {
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string NIC { get; set; }
        public string Place { get; set; }
        public string Reason { get; set; }
        public string Remark { get; set; }
        public string Officer { get; set; }

    }
}