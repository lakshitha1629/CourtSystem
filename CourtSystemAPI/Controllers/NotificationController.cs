using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CourtSystemAPI.Data;
using CourtSystemAPI.Models;
using CourtSystemAPI.Models.DTOs.Requests;
using Microsoft.AspNetCore.Authorization;
using System.Linq;
using Microsoft.AspNetCore.Identity;

namespace CourtSystemAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class NotificationController : ControllerBase
    {
        private UserManager<IdentityUser> _userManager;
        private readonly ApiDbContext _context;

        public NotificationController(UserManager<IdentityUser> userManager, ApiDbContext context)
        {
            _userManager = userManager;
            _context = context;
        }

        // GET /Notifications
        [HttpGet]
        public async Task<IActionResult> GetNotifications()
        {
            var notifications = await _context.Notifications.ToListAsync();

            return Ok(notifications);
        }

        // GET /Notification/{id}
        [HttpGet("{id}")]
        public async Task<IActionResult> GetNotification(Guid id)
        {
            var notification = await _context.Notifications.FirstOrDefaultAsync(x => x.Id == id);

            if (notification == null)
                return NotFound();

            return Ok(notification);
        }

        // POST /Notifications 
        [HttpPost]
        [Authorize]
        public async Task<IActionResult> CreateNotification(NotificationCreate data)
        {
            string userId = User.Claims.First(c => c.Type == "Id").Value;
            var user = await _userManager.FindByIdAsync(userId);

            Notification notification = new()
            {
                Id = Guid.NewGuid(),
                UserTo = data.UserTo,
                UserFrom = user.Email,
                Message = data.Message,
                Status = data.Status,
                CreatedDate = DateTimeOffset.UtcNow
            };

            if (ModelState.IsValid)
            {
                await _context.Notifications.AddAsync(notification);
                await _context.SaveChangesAsync();

                return CreatedAtAction("GetNotification", new { id = notification.Id }, data);
            }

            return new JsonResult("Something went wrong") { StatusCode = 500 };
        }


        // PATCH /Notifications
        [HttpPatch]
        public async Task<IActionResult> UpdateNotificationStatus(NotificationsUpdateStatus notification)
        {
            var existItem = await _context.Notifications.FirstOrDefaultAsync(x => x.Id == notification.Id);

            if (existItem == null)
                return NotFound();

            existItem.Status = notification.Status;
            existItem.CreatedDate = DateTimeOffset.UtcNow;

            // Implement the changes on the database level
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // DELETE /arrests/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteArrest(Guid id)
        {
            var existItem = await _context.Notifications.FirstOrDefaultAsync(x => x.Id == id);

            if (existItem == null)
                return NotFound();

            _context.Notifications.Remove(existItem);
            await _context.SaveChangesAsync();

            return Ok(existItem);
        }
    }
}