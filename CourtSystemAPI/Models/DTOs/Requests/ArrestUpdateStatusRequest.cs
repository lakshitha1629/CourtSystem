using System;

namespace CourtSystemAPI.Models.DTOs.Requests
{
    public class ArrestUpdateStatus
    {
        public Guid Id { get; init; }
        public int Status { get; set; }

    }
}