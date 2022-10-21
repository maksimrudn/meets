using Meets.Controllers.api.dto.Fact;
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
            Fact fact = new Fact();
            fact.UserId = User.GetUserId();
            fact.CreatedDate = DateTime.Now;
            fact.Title = request.Title;

            _db.Facts.Add(fact);
            _db.SaveChanges();

            return Ok();
        }

        [HttpPost("[area]/[controller]/[action]")]
        public IActionResult Edit(EditRequest request)
        {
            Fact fact = _db.Facts.Find(request.Id);

            if (fact is null) throw new Exception($"Запись с идентификатором {request.Id} - не найдена");

            fact.Title = request.Title;

            _db.Entry(fact).State = Microsoft.EntityFrameworkCore.EntityState.Modified;
            _db.SaveChanges();

            return Ok();
        }

        [HttpPost("[area]/[controller]/[action]")]
        public IActionResult Get(ByFactIdRequest request)
        {
            Fact fact = _db.Facts.Find(request.Id);

            if (fact is null) throw new Exception($"Запись с идентификатором {request.Id} - не найдена");

            return Ok(fact);
        }

        [HttpPost("[area]/[controller]/[action]")]
        public IActionResult Remove(ByFactIdRequest request)
        {
            Fact fact = _db.Facts.Find(request.Id);

            if (fact is null) throw new Exception($"Запись с идентификатором {request.Id} - не найдена");

            fact.IsDeleted = true;

            _db.Entry(fact).State = Microsoft.EntityFrameworkCore.EntityState.Modified;
            _db.SaveChanges();

            return Ok();
        }

    }
}
