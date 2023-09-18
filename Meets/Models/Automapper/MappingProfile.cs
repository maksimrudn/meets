using AutoMapper;

using Meets.Models.User;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Meets.Models.Automapper
{
    public class MappingProfile : AutoMapper.Profile
    {
        public MappingProfile()
        {

            CreateMap<ApplicationUser, UserDTO>()
                 .ForMember(x => x.Tags, opt => opt.MapFrom(c => !string.IsNullOrEmpty(c.Tags) ? c.Tags.Split(";", StringSplitOptions.None) : null))
                 .ForMember(x => x.Subscribers, opt => opt.Ignore())
                 .ForMember(x => x.Subscriptions, opt => opt.Ignore());

            //.ForMember(x => x.Subscribers, opt => opt.MapFrom(a => a.InboxFriendRequests.Count()))
            //.ForMember(x => x.Subscriptions, opt => opt.MapFrom(a => a.OutboxFriendRequests.Count()));

            CreateMap<UserDTO, ApplicationUser>()
                .ForMember(x => x.Tags, opt => opt.MapFrom(c => c.Tags != null ? string.Join(";", c.Tags) : ""))
                .ForMember(x => x.Latitude, opt => opt.Ignore())
                .ForMember(x => x.Longitude, opt => opt.Ignore());

        }
    }
}
