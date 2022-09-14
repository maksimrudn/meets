using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;

namespace Meets.Infrastructure
{
    public class MergeLocalityFileManager
    {
        public string MergeLocalityFileParts(int filePartCount, string folderFilePartPath)
        {
            List<string> filePartList = Directory.GetFiles(folderFilePartPath, "*part_*").ToList();
            string mergedLocalityFilePath = string.Empty;

            if (filePartList.Count == filePartCount)
            {
                // имя временного файла для объединения кусков загружаемого файла
                string mergedLocalityFileName = "MergedLocalityFileParts.tmp";
                mergedLocalityFilePath = Path.Combine(folderFilePartPath, mergedLocalityFileName);
                using (var FS = new FileStream(mergedLocalityFilePath, FileMode.CreateNew))
                {
                    foreach (string filePart in filePartList) // SortedFilePart filePart in orderedFilePartList
                    {
                        try
                        {
                            using (var filePartStream = new FileStream(filePart, FileMode.Open))
                            {
                                filePartStream.CopyTo(FS);
                            }
                        }
                        catch(IOException ex) 
                        {
                            throw ex;
                        }
                    }
                }
            }
            return mergedLocalityFilePath;
        }
    }
}
