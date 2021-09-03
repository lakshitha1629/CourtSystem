using System;

namespace CourtSystemAPI.Models
{
    public class Arrest
    {
        public Guid Id { get; init; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string NIC { get; set; }
        public string Place { get; set; }
        public string Reason { get; set; }
        public string Remark { get; set; }
        public string Officer { get; set; }
        public int Status { get; set; }
        public DateTimeOffset CreatedDate { get; set; }

    }
}