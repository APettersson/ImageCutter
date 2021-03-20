using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Drawing;

namespace ImageEditorAPI
{
    public class Selection
    {
        public int x { get; set; }
        public int y { get; set; }
        public int width { get; set; }
        public int height { get; set; }

        public Selection(int x, int y, int width, int height)
        {
            // Makes sure the values of the selection are Absolute
            this.width = Math.Abs(width);
            this.height = Math.Abs(height);
            this.x = width < 0 ? x - this.width : x;
            this.y = height < 0 ? y - this.height : y;
        }

        public Rectangle rect()
        {
            return new Rectangle(this.x, this.y, this.width, this.height);
        }

        public override string ToString() 
        {
            return "x: " + this.x + "\ny: " + this.y + "\nwidth: " + this.width + "\nheight: " + this.height;
        }


    }
}
