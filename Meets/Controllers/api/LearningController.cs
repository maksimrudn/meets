using Meets.Controllers.api.dto;
using Meets.Controllers.api.dto.Learning;
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
    public class LearningController : ControllerBase
    {
        private ApplicationDbContext _db;

        public LearningController(ApplicationDbContext db)
        {
            _db = db;
        }

        [HttpPost("[area]/[controller]/[action]")]
        public IActionResult Create(CreateRequest request)
        {
            try
            {
                Learning learning = new Learning();
                learning.UserId = User.GetUserId();
                learning.CreatedDate = DateTime.Now;
                learning.StartDate = request.StartDate;
                learning.EndDate = request.EndDate;
                learning.Title = request.Title;

                _db.Learnings.Add(learning);
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
                Learning learning = _db.Learnings.Find(request.Id);

                if (learning is null) throw new Exception($"Запись с идентификатором {request.Id} - не найдена");

                learning.StartDate = request.StartDate;
                learning.EndDate = request.EndDate;
                learning.Title = request.Title;

                _db.Entry(learning).State = Microsoft.EntityFrameworkCore.EntityState.Modified;
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
                Learning learning = _db.Learnings.Find(Id);

                if (learning is null) throw new Exception($"Запись с идентификатором {Id} - не найдена");

                return Ok(learning);
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
                Learning learning = _db.Learnings.Find(Id);

                if (learning is null) throw new Exception($"Запись с идентификатором {Id} - не найдена");

                learning.IsDeleted = true;

                _db.Entry(learning).State = Microsoft.EntityFrameworkCore.EntityState.Modified;
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
