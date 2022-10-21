using Meets.Controllers.api.dto;
using Meets.Controllers.api.dto.Learning;
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

        [HttpPost("[area]/[controller]/[action]")]
        public IActionResult Edit(EditRequest request)
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

        [HttpPost("[area]/[controller]/[action]")]
        public IActionResult Get(ByLearningIdRequest request)
        {
            Learning learning = _db.Learnings.Find(request.Id);

            if (learning is null) throw new Exception($"Запись с идентификатором {request.Id} - не найдена");

            return Ok(learning);
        }

        [HttpPost("[area]/[controller]/[action]")]
        public IActionResult Remove(ByLearningIdRequest request)
        {
            Learning learning = _db.Learnings.Find(request.Id);

            if (learning is null) throw new Exception($"Запись с идентификатором {request.Id} - не найдена");

            learning.IsDeleted = true;

            _db.Entry(learning).State = Microsoft.EntityFrameworkCore.EntityState.Modified;
            _db.SaveChanges();

            return Ok();
        }
    }
}

