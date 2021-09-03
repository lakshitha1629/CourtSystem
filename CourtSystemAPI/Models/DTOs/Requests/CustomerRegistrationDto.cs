using System.ComponentModel.DataAnnotations;

namespace CourtSystemAPI.Models.DTOs.Requests
{
    public class CustomerRegistrationDto
    {
        [Required]
        public string Username { get; set; }
        [Required]
        [EmailAddress]
        public string Email { get; set; }
        [Required]
        public string Password { get; set; }
    }
}