using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.DTOs
{
    public class PropertyImageDTO
    {
        public string? IdPropertyImage { get; set; }

        public string? IdProperty { get; set; }

        public string? File { get; set; }

        public bool Enable { get; set; }
    }
}
