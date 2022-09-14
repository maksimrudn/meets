namespace Meets.Domain
{
    public enum ImageType
    {
        // множество фотографий, связанных с каким либо объектом
        Photos,

        // логотип системы, который виден в левом верхнем углу. Используется только с ImageTargetType.System
        // размер 149 x 47, тип png
        BrandLogo
    }
}
