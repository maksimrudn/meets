using Meets.Controllers.api.dto.Fact;
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
    public class FactController : ControllerBase
    {
        private ApplicationDbContext _db;

        public FactController(ApplicationDbContext db)
        {
            _db = db;
        }

        [HttpPost("[area]/[controller]/[action]")]
        public IActionResult Create(CreateRequest request)
        {
            try
            {
                Fact fact = new Fact();
                fact.UserId = User.GetUserId();
                fact.CreatedDate = DateTime.Now;
                fact.Title = request.Title;

                _db.Facts.Add(fact);
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
                Fact fact = _db.Facts.Find(request.Id);

                if (fact is null) throw new Exception($"Запись с идентификатором {request.Id} - не найдена");

                fact.Title = request.Title;

                _db.Entry(fact).State = Microsoft.EntityFrameworkCore.EntityState.Modified;
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
                Fact fact = _db.Facts.Find(Id);

                if (fact is null) throw new Exception($"Запись с идентификатором {Id} - не найдена");

                return Ok(fact);
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
                Fact fact = _db.Facts.Find(Id);

                if (fact is null) throw new Exception($"Запись с идентификатором {Id} - не найдена");

                fact.IsDeleted = true;

                _db.Entry(fact).State = Microsoft.EntityFrameworkCore.EntityState.Modified;
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
