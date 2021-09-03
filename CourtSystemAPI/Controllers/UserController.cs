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
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly ApiDbContext _context;

        public UserController(ApiDbContext context)
        {
            _context = context;
        }

        // GET /User
        [HttpGet]
        public async Task<IActionResult> GetUsers()
        {
            var users = await _context.User.ToListAsync();

            return Ok(users);
        }

        // GET /User/{id}
        [HttpGet("{id}")]
        public async Task<IActionResult> GetUser(Guid id)
        {
            var user = await _context.User.FirstOrDefaultAsync(x => x.Id == id);

            if (user == null)
                return NotFound();

            return Ok(user);
        }

        // POST /User
        [HttpPost]
        public async Task<IActionResult> CreateUser(UserRegistrationDto data)
        {
            User user = new()
            {
                Id = Guid.NewGuid(),
                Username = data.Username,
                Email = data.Email,
                Password = data.Password,
                Role = data.Role
            };

            if (ModelState.IsValid)
            {
                await _context.User.AddAsync(user);
                await _context.SaveChangesAsync();

                return CreatedAtAction("GetUser", new { id = user.Id }, data);
            }

            return new JsonResult("Something went wrong") { StatusCode = 500 };
        }

        // POST /User/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateUser(Guid id, User user)
        {
            if (id != user.Id)
                return BadRequest();

            var existItem = await _context.User.FirstOrDefaultAsync(x => x.Id == id);

            if (existItem == null)
                return NotFound();

            existItem.Username = user.Username;
            existItem.Email = user.Email;
            existItem.Password = " ";
            existItem.Role = user.Role;

            // Implement the changes on the database level
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // POST /User/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUser(Guid id)
        {
            var existUser = await _context.User.FirstOrDefaultAsync(x => x.Id == id);

            if (existUser == null)
                return NotFound();

            _context.User.Remove(existUser);
            await _context.SaveChangesAsync();

            return Ok(existUser);
        }


    }
}