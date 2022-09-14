using Meets.Controllers.api.dto.Activity;
using Meets.Data;
using Meets.Extensions;
using Meets.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;

namespace Meets.Controllers.api
{
    [Area("api")]
    [ApiController]
    public class ActivityController : ControllerBase
    {
        private ApplicationDbContext _db;

        public ActivityController(ApplicationDbContext db)
        {
            _db = db;
        }

        [HttpPost("[area]/[controller]/[action]")]
        public IActionResult Create(CreateRequest request)
        {
            try
            {
                Activity activity = new Activity();
                activity.UserId = User.GetUserId();
                activity.CreatedDate = DateTime.Now;
                activity.Title = request.Title;

                _db.Activities.Add(activity);
                _db.SaveChanges();

                return Ok();
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError,
                                        new
                                        {
                                            errors = new[] {
                                                new
                                                {
                                                    code = "",
                                                    description = ex.Message
                                                }}
                                        });
            }
        }

        [HttpPost("[area]/[controller]/[action]")]
        public IActionResult Edit([FromForm] EditRequest request)
        {
            try
            {
                Activity activity = _db.Activities.Find(request.Id);

                if (activity is null) throw new Exception($"Запись с идентификатором {request.Id} - не найдена");

                activity.Title = request.Title;

                _db.Entry(activity).State = Microsoft.EntityFrameworkCore.EntityState.Modified;
                _db.SaveChanges();

                return Ok();
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError,
                                        new
                                        {
                                            errors = new[] {
                                                new
                                                {
                                                    code = "",
                                                    description = ex.Message
                                                }}
                                        });
            }
        }

        [HttpPost("[area]/[controller]/[action]")]
        public IActionResult Get([FromForm] Guid Id)
        {
            try
            {
                Activity activity = _db.Activities.Find(Id);

                if (activity is null) throw new Exception($"Запись с идентификатором {Id} - не найдена");

                return Ok(activity);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError,
                                        new
                                        {
                                            errors = new[] {
                                                new
                                                {
                                                    code = "",
                                                    description = ex.Message
                                                }}
                                        });
            }
        }

        [HttpPost("[area]/[controller]/[action]")]
        public IActionResult Remove([FromForm] Guid Id)
        {
            try
            {
                Activity activity = _db.Activities.Find(Id);

                if (activity is null) throw new Exception($"Запись с идентификатором {Id} - не найдена");

                activity.IsDeleted = true;

                _db.Entry(activity).State = Microsoft.EntityFrameworkCore.EntityState.Modified;
                _db.SaveChanges();

                return Ok();
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError,
                                        new
                                        {
                                            errors = new[] {
                                                new
                                                {
                                                    code = "",
                                                    description = ex.Message
                                                }}
                                        });
            }
        }

    }
}
