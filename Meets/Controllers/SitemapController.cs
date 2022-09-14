using AutoMapper;
using Meets.Data;
using Meets.Extensions;
using Meets.Models;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Infrastructure;
using Microsoft.AspNetCore.Mvc.Routing;
using SimpleSiteMap;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;

namespace Meets.Controllers
{
    public class SitemapController : Controller
    {
        private ApplicationDbContext _db;
        private IWebHostEnvironment _hostEnv;
        private IHttpContextAccessor _httpContextAccessor;
        private IMapper _mapper;
        private SignInManager<ApplicationUser> _signInManager;
        private readonly IUrlHelper _urlHelper;


        public SitemapController(ApplicationDbContext db,
                                IWebHostEnvironment hostingEnvironment,
                                IHttpContextAccessor httpContextAccessor,
                                SignInManager<ApplicationUser> signInManager,
                                IMapper mapper,
                                IActionContextAccessor actionContextAccessor)
        {
            _db = db;
            _hostEnv = hostingEnvironment;
            _httpContextAccessor = httpContextAccessor;
            _mapper = mapper;
            _signInManager = signInManager;

            _urlHelper = new UrlHelper(actionContextAccessor.ActionContext);
        }


        //[Route("/sitemap.xml")]
        //public ContentResult SitemapXml()
        //{

        //    // 1. Grab our *partioned* data.
        //    //    We have 1 million products - so don't return EVERYTHING,
        //    //    just the 1st, 25,001, 50,001, 75,001, etc
        //    var products = _db.Events.ToList();

        //    // 2. Convert it to a sitemap collection.
        //    // NOTE: This creates a url/route based upon the ASP.NET Routes.

        //    List<SitemapNode> sitemapNodes = new List<SitemapNode>();

        //    sitemapNodes.Add(new SitemapNode(new Uri(_urlHelper.AbsoluteAction("UrlsetXml", "Sitemap")),
        //                                        DateTime.Now,
        //                                        appendPageQueryParam: false));

        //    // 3. Create the sitemap service.
        //    var sitemapService = new SitemapService();

        //    // 4. Get the sitemap answer! BOOM!
        //    var xml = sitemapService.ConvertToXmlSitemap(sitemapNodes);

        //    // 5. Return the result as xml.
        //    return Content(xml, "application/xml");

        //}

        //[Route("/urlset.xml")]
        //public ContentResult UrlsetXml()
        //{
        //    // 1. Grab our *partioned* data.
        //    //    We have 1 million products - so don't return EVERYTHING,
        //    //    just the 1st, 25,001, 50,001, 75,001, etc
        //    var products = _db.Events.ToList();

        //    // 2. Convert it to a sitemap collection.
        //    // NOTE: This creates a url/route based upon the ASP.NET Routes.

        //    List<SitemapNode> sitemapNodes = new List<SitemapNode>();

        //    string hostUrl = $"{this.Request.Scheme}://{this.Request.Host.ToString()}";

        //    sitemapNodes.Add(new SitemapNode(new Uri( $"{hostUrl}/Event/Search"),
        //                            DateTime.Now,
        //                            null,
        //                            null,
        //                            appendPageQueryParam: false));

        //    var eventSitemapNodes = (from p in products
        //                             select new SitemapNode(
        //                                 new Uri($"{hostUrl}/Event/Details/{p.Id}"),
        //                                     (p.CreatedDate == DateTime.MinValue) ? new DateTime(2021, 8, 1) : p.CreatedDate,
        //                                     null,
        //                                     null,
        //                                     appendPageQueryParam: false
        //                                 )
        //                        ).ToList();

        //    sitemapNodes.AddRange(eventSitemapNodes);

        //    // 3. Create the sitemap service.
        //    var sitemapService = new SitemapService();

        //    // 4. Get the sitemap answer! BOOM!
        //    var xml = sitemapService.ConvertToXmlUrlset(sitemapNodes);

        //    // 5. Return the result as xml.
        //    return Content(xml, "application/xml");

        //}

        [Route("/robots.txt")]
        public ContentResult RobotsTxt()
        {
            string stringRobotsTxt = $"User-agent: *" +
                                     $"\n\n" +
                                     $"Disallow: /Identity" +
                                     $"\n\n" +
                                     $"Sitemap: {_urlHelper.AbsoluteAction("SiteMapXml", "Sitemap")}";
            

            return Content(stringRobotsTxt, "text/plain");
        }

    }
}
