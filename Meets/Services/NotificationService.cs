using Meets.Data;
using Meets.Models;
using System;
using System.Threading.Tasks;

namespace Meets.Services
{
    public class NotificationService
    {
        private ApplicationDbContext _db;

        public NotificationService(ApplicationDbContext db)
        {
            _db = db;
        }

        public async Task Edit(Meeting meeting)
        {
            Notification notification = new Notification();
            notification.SenderId = meeting.OwnerId;
            notification.ReceiverId = meeting.TargetId;
            notification.MeetingId = meeting.Id;
            notification.CreatedDate = DateTime.Now;
            notification.Type = Domain.NotificationType.Edited;
            //notification.Title = $"Встреча {mt.MeetingDate.ToString("dd.MM.yyyy HH:mm")} ({mt.Owner.FullName})";
            notification.Message = "изменена";

            _db.Notifications.Add(notification);
            await _db.SaveChangesAsync();
        }

        public async Task Invite(Meeting meeting)
        {
            Notification notification = new Notification();
            notification.SenderId = meeting.OwnerId;
            notification.ReceiverId = meeting.TargetId;
            notification.MeetingId = meeting.Id;
            notification.CreatedDate = DateTime.Now;
            notification.Type = Domain.NotificationType.Invite;
            //notification.Title = $"Встреча {meeting.MeetingDate.ToString("dd.MM.yyyy HH:mm")} ({meeting.Owner.FullName})";
            notification.Message = "вам отправлено приглашение";

            _db.Notifications.Add(notification);
            await _db.SaveChangesAsync();
        }

        public async Task Discuss(Meeting meeting)
        {
            Notification notification = new Notification();
            notification.SenderId = meeting.TargetId;
            notification.ReceiverId = meeting.OwnerId;
            notification.MeetingId = meeting.Id;
            notification.CreatedDate = DateTime.Now;
            notification.Type = Domain.NotificationType.Discussion;
            //notification.Title = $"Встреча {meeting.MeetingDate.ToString("dd.MM.yyyy HH:mm")} ({meeting.Target.FullName})";
            notification.Message = "начато обсуждение";

            _db.Notifications.Add(notification);
            await _db.SaveChangesAsync();
        }

        public async Task Confirm(Meeting meeting)
        {
            Notification notification = new Notification();
            notification.SenderId = meeting.TargetId;
            notification.ReceiverId = meeting.OwnerId;
            notification.MeetingId = meeting.Id;
            notification.CreatedDate = DateTime.Now;
            notification.Type = Domain.NotificationType.Confirmed;
            //notification.Title = $"Встреча {meeting.MeetingDate.ToString("dd.MM.yyyy HH:mm")} ({meeting.Target.FullName})";
            notification.Message = "подтверждена";

            _db.Notifications.Add(notification);
            await _db.SaveChangesAsync();
        }

        public async Task Cancel(Meeting meeting, ulong authUserId)
        {
            Notification notification = new Notification();
            notification.SenderId = authUserId;
            notification.ReceiverId = authUserId == meeting.OwnerId ? meeting.TargetId : meeting.OwnerId;
            notification.MeetingId = meeting.Id;
            notification.CreatedDate = DateTime.Now;
            notification.Type = Domain.NotificationType.Canceled;

            //string senderName = User.GetUserId() == meeting.OwnerId ? meeting.Target.FullName : meeting.Owner.FullName;
            //notification.Title = $"Встреча {meeting.MeetingDate.ToString("dd.MM.yyyy HH:mm")} ({senderName})";
            notification.Message = "завершена";

            _db.Notifications.Add(notification);
            await _db.SaveChangesAsync();
        }
    }
}
