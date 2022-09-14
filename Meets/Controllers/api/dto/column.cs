namespace Meets.Controllers.api.dto
{
    public class column
    {
        public string data { get; set; }
        
        public string name { get; set; }

        public bool searchable { get; set; }

        public bool orderable { get; set; }

        public search search { get; set; }
    }
}
