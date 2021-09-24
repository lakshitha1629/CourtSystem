using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace CourtSystemAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    // [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
    public class UserProfileController : ControllerBase
    {
        private readonly UserManager<IdentityUser> _userManager;
        public UserProfileController(UserManager<IdentityUser> userManager)
        {
            _userManager = userManager;
        }

        [HttpGet]
        [Authorize]
        //GET : /api/UserProfile
        public async Task<Object> GetUserProfile()
        {
            string userId = User.Claims.First(c => c.Type == "Id").Value;
            var user = await _userManager.FindByIdAsync(userId);
            var role = await _userManager.GetRolesAsync(user);

            return new
            {
                user.Email,
                user.UserName,
                role
            };
        }

        [HttpGet]
        [Authorize(Roles = "ADMIN")]
        [Route("ForAdmin")]
        public string GetForAdmin()
        {
            return "Web method for Admin";
        }

        [HttpGet]
        [Authorize(Roles = "POLICE")]
        [Route("ForPolice")]
        public string GetPolice()
        {
            return "Web method for Police";
        }

        [HttpGet]
        [Authorize(Roles = "JUDICIAL")]
        [Route("ForJudicial")]
        public string GetJudicial()
        {
            return "Web method for Judicial";
        }

        [HttpGet]
        [Authorize(Roles = "ATTORNEY")]
        [Route("ForAttorney")]
        public string GetAttorney()
        {
            return "Web method for Attorney";
        }

        [HttpGet]
        [Authorize(Roles = "VIEWER")]
        [Route("ForViewer")]
        public string GetViewer()
        {
            return "Web method for Viewer";
        }

        [HttpGet]
        [Authorize(Roles = "ADMIN,POLICE")]
        [Route("ForAdminOrPolice")]
        public string GetForAdminOrPolice()
        {
            return "Web method for Admin or Police";
        }
    }
}