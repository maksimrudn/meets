using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Meets.Migrations
{
    public partial class _2 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Areas");

            migrationBuilder.DropTable(
                name: "Comments");

            migrationBuilder.DropTable(
                name: "EventLink");

            migrationBuilder.DropTable(
                name: "EventOrganizers");

            migrationBuilder.DropTable(
                name: "Localities");

            migrationBuilder.DropTable(
                name: "Participations");

            migrationBuilder.DropTable(
                name: "Persons");

            migrationBuilder.DropTable(
                name: "Events");

            migrationBuilder.DropTable(
                name: "Categories");

            migrationBuilder.DropTable(
                name: "Places");

            migrationBuilder.DeleteData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: 2m);

            migrationBuilder.DropColumn(
                name: "Meets",
                table: "AspNetUsers");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "Meets",
                table: "AspNetUsers",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateTable(
                name: "Categories",
                columns: table => new
                {
                    Id = table.Column<decimal>(type: "decimal(20,0)", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    IsActive = table.Column<bool>(type: "bit", nullable: false, defaultValue: true),
                    Picture = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Title = table.Column<string>(type: "varchar(100)", unicode: false, maxLength: 100, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Categories", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Comments",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    TargetType = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    TargetId = table.Column<decimal>(type: "decimal(20,0)", nullable: false),
                    AuthorId = table.Column<decimal>(type: "decimal(20,0)", nullable: false),
                    CreateDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    ParentId = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    Text = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Comments", x => new { x.Id, x.TargetType, x.TargetId });
                    table.ForeignKey(
                        name: "FK_Comments_AspNetUsers_AuthorId",
                        column: x => x.AuthorId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Localities",
                columns: table => new
                {
                    Id = table.Column<decimal>(type: "decimal(20,0)", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    City = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Latitude = table.Column<double>(type: "float", nullable: true),
                    Longitude = table.Column<double>(type: "float", nullable: true),
                    Postcode = table.Column<string>(type: "nvarchar(30)", maxLength: 30, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Localities", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Persons",
                columns: table => new
                {
                    Id = table.Column<decimal>(type: "decimal(20,0)", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Description = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Name = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Persons", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Places",
                columns: table => new
                {
                    Id = table.Column<decimal>(type: "decimal(20,0)", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Address = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    AllEventsId = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Description = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Phone = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    RockGigId = table.Column<long>(type: "bigint", nullable: true),
                    Title = table.Column<string>(type: "nvarchar(250)", maxLength: 250, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Places", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Areas",
                columns: table => new
                {
                    Id = table.Column<decimal>(type: "decimal(20,0)", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    PlaceId = table.Column<decimal>(type: "decimal(20,0)", nullable: false),
                    AreaType = table.Column<int>(type: "int", nullable: false),
                    Title = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Areas", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Areas_Places_PlaceId",
                        column: x => x.PlaceId,
                        principalTable: "Places",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Events",
                columns: table => new
                {
                    Id = table.Column<decimal>(type: "decimal(20,0)", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    CategoryId = table.Column<decimal>(type: "decimal(20,0)", nullable: true),
                    CreatorId = table.Column<decimal>(type: "decimal(20,0)", nullable: false),
                    PlaceId = table.Column<decimal>(type: "decimal(20,0)", nullable: true),
                    Address = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    AgeFrom = table.Column<int>(type: "int", nullable: false),
                    AgeTo = table.Column<int>(type: "int", nullable: false),
                    AllEventsId = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    AutoLoaded = table.Column<bool>(type: "bit", nullable: false),
                    City = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    CreatedDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    CustomEventId = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Description = table.Column<string>(type: "varchar(max)", unicode: false, nullable: true),
                    EighteenPlus = table.Column<bool>(type: "bit", nullable: false),
                    EndDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    EventStatus = table.Column<int>(type: "int", nullable: false),
                    Image = table.Column<string>(type: "varchar(max)", unicode: false, nullable: true),
                    ImageUrl = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ItEventsId = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Latitude = table.Column<double>(type: "float", nullable: false),
                    LomovFightId = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Longitude = table.Column<double>(type: "float", nullable: false),
                    MaxFemaleCount = table.Column<int>(type: "int", nullable: false),
                    MaxMaleCount = table.Column<int>(type: "int", nullable: false),
                    MaxPeopleCount = table.Column<int>(type: "int", nullable: false),
                    OnlineOfflineStatus = table.Column<int>(type: "int", nullable: false),
                    Price = table.Column<double>(type: "float", nullable: true),
                    PriceInfo = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Published = table.Column<bool>(type: "bit", nullable: false),
                    RockGigId = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    SamopoznanieId = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ShortDescription = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    StartDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    Tags = table.Column<string>(type: "nvarchar(max)", nullable: false, defaultValue: ""),
                    Title = table.Column<string>(type: "varchar(250)", unicode: false, maxLength: 250, nullable: true),
                    Zalov9Id = table.Column<long>(type: "bigint", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Events", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Events_AspNetUsers_CreatorId",
                        column: x => x.CreatorId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Events_Categories_CategoryId",
                        column: x => x.CategoryId,
                        principalTable: "Categories",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_Events_Places_PlaceId",
                        column: x => x.PlaceId,
                        principalTable: "Places",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "EventLink",
                columns: table => new
                {
                    Id = table.Column<decimal>(type: "decimal(20,0)", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    EventId = table.Column<decimal>(type: "decimal(20,0)", nullable: false),
                    Title = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Url = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_EventLink", x => x.Id);
                    table.ForeignKey(
                        name: "FK_EventLink_Events_EventId",
                        column: x => x.EventId,
                        principalTable: "Events",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "EventOrganizers",
                columns: table => new
                {
                    EventId = table.Column<decimal>(type: "decimal(20,0)", nullable: false),
                    PersonId = table.Column<decimal>(type: "decimal(20,0)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_EventOrganizers", x => new { x.EventId, x.PersonId });
                    table.ForeignKey(
                        name: "FK_EventOrganizers_Events_EventId",
                        column: x => x.EventId,
                        principalTable: "Events",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_EventOrganizers_Persons_PersonId",
                        column: x => x.PersonId,
                        principalTable: "Persons",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Participations",
                columns: table => new
                {
                    Id = table.Column<decimal>(type: "decimal(20,0)", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    EventId = table.Column<decimal>(type: "decimal(20,0)", nullable: false),
                    ParticipantId = table.Column<decimal>(type: "decimal(20,0)", nullable: false),
                    CreateDate = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Participations", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Participations_AspNetUsers_ParticipantId",
                        column: x => x.ParticipantId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Participations_Events_EventId",
                        column: x => x.EventId,
                        principalTable: "Events",
                        principalColumn: "Id");
                });

            migrationBuilder.InsertData(
                table: "AspNetUsers",
                columns: new[] { "Id", "AccessFailedCount", "Avatar", "BirthDate", "City", "Company", "ConcurrencyStamp", "Description", "Email", "EmailConfirmed", "FullName", "Gender", "Growth", "Job", "Latitude", "LockoutEnabled", "LockoutEnd", "Longitude", "Meets", "NormalizedEmail", "NormalizedUserName", "PasswordHash", "PhoneNumber", "PhoneNumberConfirmed", "RoleId", "SecurityStamp", "Specialization", "Tags", "TwoFactorEnabled", "UserName", "Weight" },
                values: new object[] { 2m, 0, null, null, null, null, "3a770767-445a-4eef-93a3-2389c7949bb5", null, "loader@loader", false, "Загрузчик", null, 0, null, 0.0, false, null, 0.0, 0, "loader@loader", "LOADER@LOADER", "AQAAAAEAACcQAAAAEM0ZQUtQTujF33s3DNg2JAmlO/QceeCykr10VbntxSs+mwM8PBbEkqaeObrzCaE4XA==", null, false, null, "b8db65e3-df56-4cc6-ad87-16e1c108db13", null, "", false, "loader@loader", 0 });

            migrationBuilder.InsertData(
                table: "Categories",
                columns: new[] { "Id", "IsActive", "Picture", "Title" },
                values: new object[,]
                {
                    { 1m, true, "samopoznanie.svg", "Самопознание" },
                    { 2m, true, "travel.svg", "Путешествия" },
                    { 3m, true, "koncerty.svg", "Концерт" },
                    { 4m, true, "dance.svg", "Танцы" },
                    { 5m, true, "konferencii.svg", "Конференции" },
                    { 6m, true, "kino.svg", "Кино" },
                    { 7m, true, "sport.svg", "Спорт" },
                    { 8m, true, "flat.svg", "Квартирники" },
                    { 9m, true, "sorevnovaniya.svg", "Соревнования" },
                    { 10m, true, "obuchenie.svg", "Обучение" }
                });

            migrationBuilder.InsertData(
                table: "Places",
                columns: new[] { "Id", "Address", "AllEventsId", "Description", "Phone", "RockGigId", "Title" },
                values: new object[] { 1m, null, null, null, null, null, "Test Place" });

            migrationBuilder.CreateIndex(
                name: "IX_Areas_PlaceId",
                table: "Areas",
                column: "PlaceId");

            migrationBuilder.CreateIndex(
                name: "IX_Comments_AuthorId",
                table: "Comments",
                column: "AuthorId");

            migrationBuilder.CreateIndex(
                name: "IX_EventLink_EventId",
                table: "EventLink",
                column: "EventId");

            migrationBuilder.CreateIndex(
                name: "IX_EventOrganizers_PersonId",
                table: "EventOrganizers",
                column: "PersonId");

            migrationBuilder.CreateIndex(
                name: "IX_Events_CategoryId",
                table: "Events",
                column: "CategoryId");

            migrationBuilder.CreateIndex(
                name: "IX_Events_CreatorId",
                table: "Events",
                column: "CreatorId");

            migrationBuilder.CreateIndex(
                name: "IX_Events_PlaceId",
                table: "Events",
                column: "PlaceId");

            migrationBuilder.CreateIndex(
                name: "IX_Participations_EventId",
                table: "Participations",
                column: "EventId");

            migrationBuilder.CreateIndex(
                name: "IX_Participations_ParticipantId",
                table: "Participations",
                column: "ParticipantId");

            migrationBuilder.CreateIndex(
                name: "IX_Places_Title",
                table: "Places",
                column: "Title");
        }
    }
}
