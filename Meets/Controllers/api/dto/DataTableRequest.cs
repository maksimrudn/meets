using System.Collections.Generic;

namespace Meets.Controllers.api.dto
{
    public class DataTableRequest
    {
        public int draw { get; set; }

        public int start { get; set; }

        public int length { get; set; }

        public search search { get; set; }

        public List<column> columns { get; set; }

        public List<order> order { get; set; }
    }
}
