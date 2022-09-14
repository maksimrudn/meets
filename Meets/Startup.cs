using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.UI;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.HttpsPolicy;
using Microsoft.EntityFrameworkCore;
using Meets.Data;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Meets.Models;
using Microsoft.AspNetCore.Routing;
using Microsoft.AspNetCore.Http;
using AutoMapper;
using Meets.Models.Automapper;
using Meets.Properties;
using System.Diagnostics;
using Microsoft.AspNetCore.Mvc.Infrastructure;
using Meets.Extensions;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.SpaServices.ReactDevelopmentServer;
using System.Text.Json.Serialization;
using Microsoft.AspNetCore.Http.Features;
using Meets.Settings;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using System.Security.Claims;

namespace Meets
{
    public class Startup
    {
        public Startup(IWebHostEnvironment env, IConfiguration configuration)
        {
            //var builder = new ConfigurationBuilder()
            //    .SetBasePath(env.ContentRootPath)
            //    .AddJsonFile("appsettings.json", optional: false, reloadOnChange: true)
            //    .AddJsonFile($"appsettings.{env.EnvironmentName}.json", optional: true)
            //    .AddEnvironmentVariables();


            //Configuration = builder.Build();
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        public void ConfigureServices(IServiceCollection services)
        {
            //services.Configure<FormOptions>(options =>
            //{
            //    options.MultipartBodyLengthLimit = int.MaxValue; //268435456
            //});

            //services.Configure<IISServerOptions>(options =>
            //{
            //    options.AllowSynchronousIO = true;
            //    options.MaxRequestBodySize = int.MaxValue;
            //});

            services.AddDbContext<ApplicationDbContext>(options =>
                options.UseSqlServer(Configuration.GetConnectionString("DefaultConnection"))
                        .UseLazyLoadingProxies());

            services.AddIdentity<ApplicationUser, ApplicationRole>(options => options.SignIn.RequireConfirmedAccount = false)
                .AddEntityFrameworkStores<ApplicationDbContext>()
                .AddDefaultTokenProviders()
                .AddDefaultUI();

            services.Configure<IdentityOptions>(options =>
            {
                // Default Password settings.
                options.Password.RequireDigit = true;
                options.Password.RequireLowercase = false;
                options.Password.RequireNonAlphanumeric = false;
                options.Password.RequireUppercase = false;
                options.Password.RequiredLength = 8;
                options.Password.RequiredUniqueChars = 1;
            });

            services.Configure<JwtConfiguration>(Configuration.GetSection("JwtConfiguration"));

            services.Configure<Microsoft.AspNetCore.Mvc.ApiBehaviorOptions>(options =>
            {
                // настройка включает возможность ловить ModelValidationError в ExceptionHandlerMiddleware
                options.SuppressModelStateInvalidFilter = true;
            });

            services.AddScoped<Services.TokenManager>();

            //services.AddIdentityServer()
            //    .AddApiAuthorization<ApplicationUser, ApplicationDbContext>();

            //services.AddAuthentication()
            //    .AddIdentityServerJwt();


            services.AddSession();


            // Auto Mapper Configurations
            var mapperConfig = new MapperConfiguration(mc =>
            {
                mc.AddProfile(new MappingProfile());
            });
            IMapper mapper = mapperConfig.CreateMapper();
            services.AddSingleton(mapper);

            services.AddSingleton<IActionContextAccessor, ActionContextAccessor>();



            services.AddMvc(option => option.EnableEndpointRouting = false)
                .AddJsonOptions(opt => opt.JsonSerializerOptions.ReferenceHandler = System.Text.Json.Serialization.ReferenceHandler.IgnoreCycles);
            // .AddJsonOptions(x => x.JsonSerializerOptions.SerializerSettings.ReferenceLoopHandling = Newtonsoft.Json.ReferenceLoopHandling.Ignore); ;

            services.AddAuthentication(x =>
            {
                x.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                x.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
            })
                .AddJwtBearer(o =>
                {
                    o.TokenValidationParameters = new TokenValidationParameters()
                    {
                        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(Configuration["JwtConfiguration:AccessTokenSecret"])),
                        ValidIssuer = Configuration["JwtConfiguration:Issuer"],
                        ValidAudience = Configuration["JwtConfiguration:Audience"],
                        ValidateIssuerSigningKey = true,
                        ValidateIssuer = true,
                        ValidateAudience = true,
                        ClockSkew = TimeSpan.Zero
                    };
                });

            services.AddControllers()
                .AddJsonOptions(x =>
                {
                    // serialize enums as strings in api responses (e.g. Role)
                    x.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter());

                    //x.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.Preserve;
                    //x.JsonSerializerOptions.WriteIndented = true;
                    // ignore omitted parameters on models to enable optional params (e.g. User update)
                    x.JsonSerializerOptions.IgnoreNullValues = true;
                });

            //services.AddDefaultIdentity<ApplicationUser>(options => options.SignIn.RequireConfirmedAccount = true)
            //    .AddEntityFrameworkStores<ApplicationDbContext>();

            services.AddControllersWithViews();
            services.AddRazorPages()
                .AddRazorRuntimeCompilation();

            // настройки сессии
            services.AddHttpContextAccessor();

            // настройка работы с сессией
            // https://docs.microsoft.com/ru-ru/aspnet/core/fundamentals/app-state?view=aspnetcore-5.0
            services.AddDistributedMemoryCache();
            //services.AddSession();
            //services.AddSession(options =>
            //{
            //    options.IdleTimeout = TimeSpan.FromSeconds(10);
            //    options.Cookie.HttpOnly = true;
            //    options.Cookie.IsEssential = true;
            //});


            // In production, the React files will be served from this directory
            services.AddSpaStaticFiles(configuration =>
            {
                configuration.RootPath = "ClientApp/build";
            });

        }

        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            var httpContextAccessor = app.ApplicationServices.GetRequiredService<IHttpContextAccessor>();
            UrlHelperExtensions.Configure(httpContextAccessor);

            app.UseCheckUnsupportedBrowser();

            Resources.Culture = System.Globalization.CultureInfo.CurrentCulture;
            // данная настройка возвращает Response заголовок Content-Language
            // https://developer.mozilla.org/ru/docs/Web/HTTP/Headers/Accept-Language
            // https://developer.mozilla.org/ru/docs/Web/HTTP/Headers/Content-Language
            // https://developer.mozilla.org/en-US/docs/Web/HTTP/Content_negotiation
            app.UseRequestLocalization(new RequestLocalizationOptions
            {
                ApplyCurrentCultureToResponseHeaders = true
            });

            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
                app.UseDatabaseErrorPage();
            }
            else
            {
                app.UseDeveloperExceptionPage();
                //app.UseExceptionHandler("/Home/Error");
                // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
                app.UseHsts();
            }

            app.UseStatusCodePagesWithReExecute("/statuscode/{0}");

            app.UseHttpsRedirection();
            app.UseStaticFiles();
            app.UseSpaStaticFiles();

            app.UseRouting();

            app.UseCustomExceptionHandler();

            app.UseAuthentication();
            app.UseAuthorization();

            app.UseSession();

            //app.UseEndpoints(endpoints =>
            //{
            //    endpoints.MapControllerRoute(
            //        name: "default",
            //        pattern: "{controller=Home}/{action=Index}/{id?}");
            //    endpoints.MapRazorPages();
            //});

            app.UseMvc(routes =>
            {
                routes.MapRoute(
                   name: "area",
                   template: "{area:exists}/{controller=Home}/{action=Index}/{id?}");

                //routes.MapRoute(
                //   name: "main",
                //   template: "{controller}/{action}/{id?}");

                //routes.MapRoute(
                //    name: "default",
                //    template: "{controller=Event}/{action=Search}/{id?}");
            });

            app.UseSpa(spa =>
            {
                spa.Options.SourcePath = "ClientApp";

                if (env.IsDevelopment())
                {
                    spa.UseReactDevelopmentServer(npmScript: "start");
                }
            });

        }

    }
}
