using System;
using System.ComponentModel.DataAnnotations;

namespace CourtSystemAPI.Models
{
    public class User
    {
        public Guid Id { get; init; }
        [Required]
        public string Username { get; set; }
        [Required]
        [EmailAddress]
        public string Email { get; set; }
        [Required]
        public string Password { get; set; }
        [Required]
        public string Role { get; set; }
    }
}