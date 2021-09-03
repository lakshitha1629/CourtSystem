using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CourtSystemAPI.Data;
using CourtSystemAPI.Models;
using CourtSystemAPI.Models.DTOs.Requests;
using CourtSystemAPI.Services;

namespace CourtSystemAPI.Controllers
{
    [Route("api/[controller]")] // api/authManagement
    [ApiController]
    public class AuthManagementController : ControllerBase
    {
        private readonly ApiDbContext _context;

        public AuthManagementController(ApiDbContext context)
        {
            _context = context;
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetUser(Guid id)
        {
            var user = await _context.User.FirstOrDefaultAsync(x => x.Id == id);

            if (user == null)
                return NotFound();

            return Ok(user);
        }

        [HttpPost]
        [Route("Register")]
        public async Task<IActionResult> Register(CustomerRegistrationDto data)
        {
            User user = new()
            {
                Id = Guid.NewGuid(),
                Username = data.Username,
                Email = data.Email,
                Password = data.Password,
                Role = "Customer"
            };

            if (ModelState.IsValid)
            {
                await _context.User.AddAsync(user);
                await _context.SaveChangesAsync();

                return CreatedAtAction("GetUser", new { id = user.Id }, user);
            }

            return new JsonResult("Something went wrong") { StatusCode = 500 };
        }

        [HttpPost]
        [Route("Login")]
        public async Task<ActionResult<dynamic>> Authenticate([FromBody] UserLoginRequest model)
        {
            var user = await _context.User.Where(x => x.Email.ToLower() == model.Email.ToLower() && x.Password == model.Password).FirstOrDefaultAsync();

            if (user == null)
                return NotFound(new { message = "User or password invalid" });

            var token = TokenService.CreateToken(user);
            user.Password = "";
            return new
            {
                user = user,
                token = token
            };
        }
    }
}