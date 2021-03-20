using Microsoft.AspNetCore.Mvc;
using System;
using System.Drawing;
using Newtonsoft.Json;
using System.IO.Compression;
using System.IO;
using System.Drawing.Imaging;

namespace ImageEditorAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CutterController : ControllerBase
    {
        private string tempPath;
        public CutterController() 
        {
            this.tempPath = Path.Combine(Environment.CurrentDirectory, "tempLocal");

        }

        [Route("submit")]
        [HttpPost]
        public ActionResult submit()
        {
            clearTempLocal();

            var httpRequest = Request.Form;
            var files = httpRequest.Files;
            Selection selection = JsonConvert.DeserializeObject<Selection>(httpRequest["selection"]);
            int i = 0;
            try
            {
                foreach (Image img in ImageCutter.processFiles(files, selection))
                {
                    img.Save(tempPath + "/Out/file" + i + ".png", ImageFormat.Png);
                    i++;
                }
            }
            catch (Exception e)
            {
                return new JsonResult(e);
            }

            string resultpath = this.tempPath + "/results.zip";
            System.IO.File.Delete(resultpath);
            ZipFile.CreateFromDirectory(this.tempPath + "/Out", resultpath);
            return PhysicalFile(resultpath, "application/zip", "result.zip");

        }

        private static void clearTempLocal()
        {
            string tempPath = Path.Combine(Environment.CurrentDirectory, "tempLocal");
            DirectoryInfo tempOut = new DirectoryInfo(tempPath + "/Out");
            foreach (FileInfo file in tempOut.EnumerateFiles())
            {
                file.Delete();
            }
            System.IO.File.Delete(tempPath+"/results.zip");
        }
    }
}