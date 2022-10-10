namespace Etch.OrchardCore.Gallery.Settings
{
    public class GalleryPartSettings
    {
        public const int DefaultThumbnailWidth = 240;
        public const int DefaultThumbnailHeight = 240;

        public int ThumbnailWidth { get; set; } = DefaultThumbnailWidth;
        public int ThumbnailHeight { get; set; } = DefaultThumbnailHeight;
    }
}
