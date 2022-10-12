using Meets.Controllers.api.dto.Work;
using Meets.Data;
using Meets.Extensions;
using Meets.Infrastructure;
using Meets.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;

namespace Meets.Controllers.api
{
    [Authorize]
    [Area("api")]
    [ApiController]
    public class WorkController : ControllerBase
    {
        private ApplicationDbContext _db;

        public WorkController(ApplicationDbContext db)
        {
            _db = db;
        }

        [HttpPost("[area]/[controller]/[action]")]
        public IActionResult Create(CreateRequest request)
        {
            try
            {
                Work work = new Work();
                work.UserId = User.GetUserId();
                work.CreatedDate = DateTime.Now;
                work.StartDate = request.StartDate;
                work.EndDate = request.EndDate;
                work.Title = request.Title;
                work.Post = request.Post;

                _db.Works.Add(work);
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
                Work work = _db.Works.Find(request.Id);

                if (work is null) throw new Exception($"Запись с идентификатором {request.Id} - не найдена");

                work.StartDate = request.StartDate;
                work.EndDate = request.EndDate;
                work.Title = request.Title;
                work.Post = request.Post;

                _db.Entry(work).State = Microsoft.EntityFrameworkCore.EntityState.Modified;
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
                Work work = _db.Works.Find(Id);

                if (work is null) throw new Exception($"Запись с идентификатором {Id} - не найдена");

                return Ok(work);
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
                Work work = _db.Works.Find(Id);

                if (work is null) throw new Exception($"Запись с идентификатором {Id} - не найдена");

                work.IsDeleted = true;

                _db.Entry(work).State = Microsoft.EntityFrameworkCore.EntityState.Modified;
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
