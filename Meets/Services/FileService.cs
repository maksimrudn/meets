using Meets.Domain;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text.RegularExpressions;

namespace Meets.Services
{    
    public class FileService
    {
        private IWebHostEnvironment _hostEnv;
        private const string _contentFolder = @"Content";
        private const string _eventsSubfolder = @"events";

        public FileService(IWebHostEnvironment hostEnv)
        {
            _hostEnv = hostEnv;
        }

        public void SaveImageList(ImageTargetType photoTarget, ulong targetId, ImageType imageType, IEnumerable<IFormFile> photos)
        {
            if (photos != null)
            {
                foreach (var photo in photos.ToList())
                {
                    SaveImage(photoTarget, targetId, imageType, photo);
                }
            }
        }

        async public void SaveImage(ImageTargetType photoTarget, ulong targetId, ImageType imageType, IFormFile photo)
        {
            switch (photoTarget)
            {
                case ImageTargetType.Event:

                    switch (imageType)
                    {
                        case ImageType.Photos:
                            // создаём папку объекта
                           string fullFolderPath = _getFullFolderPath(photoTarget, targetId, imageType);

                            if (!Directory.Exists(fullFolderPath))
                                Directory.CreateDirectory(fullFolderPath);


                            // получаем имя нового фото
                            string extension = photo.FileName.Split('.').Last();
                            string newImageName = string.Format("{0}.{1}", 
                                                                    _getNewImageId(photoTarget, targetId, imageType).ToString("000000000"),
                                                                    extension);


                            // сохраняем фото
                            string filePath = Path.Combine(fullFolderPath, newImageName);

                            using (Stream fileStream = new FileStream(filePath, FileMode.Create))
                            {
                                await photo.CopyToAsync(fileStream);
                            }
                            break;

                        default:
                            throw new Exception($"Не поддерживаемый тип загружаемой картинки: {imageType.ToString()}");
                    }

                    break;


                default:
                    throw new Exception($"Не поддерживаемый объект для загружаемой картинки: {photoTarget.ToString()}");
            }
        }

        private string _getFullFolderPath(ImageTargetType imageTarget, ulong targetId, ImageType imageType)
        {
            if (targetId == 0) throw new Exception("targetId не может быть 0");

            string folderName = targetId.ToString();
            string folderPath = null;
            string fullFolderPath = null;

            switch (imageTarget)
            {
                case ImageTargetType.Event:
                    folderPath = @$"{_hostEnv.WebRootPath}\\{_contentFolder}\\{_eventsSubfolder}";
                    break;

                default:
                    throw new Exception($"Не поддерживаемый объект для загружаемой картинки: {imageTarget.ToString()}");
            }

                        
            fullFolderPath = Path.Combine(folderPath, folderName);

            return fullFolderPath;
        }

        /// <summary>
        /// Получение нового имени (идентификатора) сохраняемой картинки
        /// </summary>
        /// <param name="imageTarget"></param>
        /// <param name="targetId"></param>
        /// <param name="imageType"></param>
        /// <returns></returns>
        private ulong _getNewImageId(ImageTargetType imageTarget, ulong targetId, ImageType imageType)
        {
            ulong? newImageId = null;
            string fullFolderPath = _getFullFolderPath(imageTarget, targetId, imageType);

            DirectoryInfo targetFolder = new DirectoryInfo(fullFolderPath);
            FileInfo[] files = targetFolder.GetFiles();

            // если в папке есть файлы, то берём имя последнего и делаем инкримент
            // формат имени файла: [id].[ext]
            if (files.Length > 0)
            {
                string lastFileName = files.Select(x => x.Name.Split('.').First())
                                            .OrderBy(x => x)
                                            .ToList()
                                            .Last();

                newImageId = ulong.Parse( _removeLeadingZeros( lastFileName) ) + 1;
            }
            else
                newImageId = 1;


            return newImageId.Value;
        }

        private string _removeLeadingZeros(string str)
        {
            string res = string.Empty;
            // Regex to remove leading
            // zeros from a string
            string regex = "^0+(?!$)";

            // Replaces the matched
            // value with given string
            res = Regex.Replace(str, regex, "");

            return res;
        }


        public string GetImageListJoined(ImageTargetType imageTarget, ulong targetId, ImageType imageType)
        {
            string res = string.Empty;

            string fullFolderPath = _getFullFolderPath(imageTarget, targetId, imageType);
            DirectoryInfo targetFolder = new DirectoryInfo(fullFolderPath);
            FileInfo[] files = targetFolder.GetFiles();

            res = string.Join(';', files.Select(x => x.Name));

            return res;
        }
    }
}
