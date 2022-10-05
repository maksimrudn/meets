using System.Collections.Generic;

namespace Meets.Controllers.api.dto.User
{
    public class GetListRequest
    {
        public string City { get; set; }

        public List<string> Tags { get; set; }

        public int? GrowthFrom { get; set; }

        public int? GrowthTo { get; set; }

        public int? WeightFrom { get; set; }

        public int? WeightTo { get; set; }

        public int? AgeFrom { get; set; }

        public int? AgeTo { get; set; }

        public string Company { get; set; }

        public string Learning { get; set; }

        public string Activity { get; set; }
    }
}
