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

        [HttpPost("[area]/[controller]/[action]")]
        public IActionResult Edit(EditRequest request)
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

        [HttpPost("[area]/[controller]/[action]")]
        public IActionResult Get(ByWorkIdRequest request)
        {
            Work work = _db.Works.Find(request.Id);

            if (work is null) throw new Exception($"Запись с идентификатором {request.Id} - не найдена");

            return Ok(work);
        }

        [HttpPost("[area]/[controller]/[action]")]
        public IActionResult Remove(ByWorkIdRequest request)
        {
            Work work = _db.Works.Find(request.Id);

            if (work is null) throw new Exception($"Запись с идентификатором {request.Id} - не найдена");

            work.IsDeleted = true;

            _db.Entry(work).State = Microsoft.EntityFrameworkCore.EntityState.Modified;
            _db.SaveChanges();

            return Ok();
        }
    }
}
