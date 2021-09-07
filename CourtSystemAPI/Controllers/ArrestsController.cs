using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CourtSystemAPI.Data;
using CourtSystemAPI.Models;
using CourtSystemAPI.Models.DTOs.Requests;
using System.Linq;

namespace CourtSystemAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ArrestsController : ControllerBase
    {
        private readonly ApiDbContext _context;

        public ArrestsController(ApiDbContext context)
        {
            _context = context;
        }

        // GET /arrests
        [HttpGet]
        public async Task<IActionResult> GetArrests()
        {
            var arrests = await _context.Arrests.ToListAsync();

            return Ok(arrests);
        }

        // GET /arrests/{id}
        [HttpGet("{id}")]
        public async Task<IActionResult> GetArrest(Guid id)
        {
            var arrest = await _context.Arrests.FirstOrDefaultAsync(x => x.Id == id);

            if (arrest == null)
                return NotFound();

            return Ok(arrest);
        }

        // POST /arrests
        [HttpPost]
        public async Task<IActionResult> CreateArrest(ArrestCreate data)
        {
            Arrest arrest = new()
            {
                Id = Guid.NewGuid(),
                FirstName = data.FirstName,
                LastName = data.LastName,
                NIC = data.NIC,
                Place = data.Place,
                Reason = data.Reason,
                Remark = data.Remark,
                Officer = data.Officer,
                Status = data.Status,
                CreatedDate = DateTimeOffset.UtcNow
            };

            if (ModelState.IsValid)
            {
                await _context.Arrests.AddAsync(arrest);
                await _context.SaveChangesAsync();

                return CreatedAtAction("GetArrest", new { id = arrest.Id }, data);
            }

            return new JsonResult("Something went wrong") { StatusCode = 500 };
        }

        // POST /arrests
        [HttpPut]
        public async Task<IActionResult> UpdateArrest(ArrestUpdate arrest)
        {
            var existItem = await _context.Arrests.FirstOrDefaultAsync(x => x.Id == arrest.Id);

            if (existItem == null)
                return NotFound();

            existItem.FirstName = arrest.FirstName;
            existItem.LastName = arrest.LastName;
            existItem.NIC = arrest.NIC;
            existItem.Place = arrest.Place;
            existItem.Reason = arrest.Reason;
            existItem.Remark = arrest.Remark;
            existItem.Officer = arrest.Officer;

            // Implement the changes on the database level
            await _context.SaveChangesAsync();

            return NoContent();
        }


        // PATCH /arrests
        [HttpPatch]
        public async Task<IActionResult> UpdateArrestStatus(ArrestUpdateStatus arrest)
        {
            var existItem = await _context.Arrests.FirstOrDefaultAsync(x => x.Id == arrest.Id);

            if (existItem == null)
                return NotFound();

            existItem.Status = arrest.Status;
            existItem.CreatedDate = DateTimeOffset.UtcNow;

            // Implement the changes on the database level
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // DELETE /arrests/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteArrest(Guid id)
        {
            var existItem = await _context.Arrests.FirstOrDefaultAsync(x => x.Id == id);

            if (existItem == null)
                return NotFound();

            _context.Arrests.Remove(existItem);
            await _context.SaveChangesAsync();

            return Ok(existItem);
        }

        [Route("GetArrestByStatus/{status}")]
        [HttpGet]
        public async Task<IActionResult> GetArrestByStatus(int status)
        {
            var arrests = await _context.Arrests.Where(x => x.Status == status).ToListAsync();

            return Ok(arrests);
        }
    }
}