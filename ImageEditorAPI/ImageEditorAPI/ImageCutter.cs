using System;
using System.Collections.Generic;
using System.Drawing;
using Microsoft.AspNetCore.Http;

namespace ImageEditorAPI
{
    public class ImageCutter
    {
        public static IList<Image> processFiles(IFormFileCollection files, Selection selection)
        {
            IList<Image> images = new List<Image>();
            foreach (var file in files)
            {
                try
                {
                    using (Image img = Image.FromStream(file.OpenReadStream()))
                    {
                        images.Add(cutSelection(img, selection.rect()));
                    }
                }
                catch (Exception e) { System.Diagnostics.Debug.WriteLine(e); continue; }
            }
            return images;
        }

        public static Image cutSelection(Image file, Rectangle selection)
        {
            Bitmap bmp = new Bitmap(file);
            return (Image) bmp.Clone(selection, bmp.PixelFormat);
        }

    }
}
