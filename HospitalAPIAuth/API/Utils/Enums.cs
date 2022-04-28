using System.ComponentModel;

namespace API.Utils
{
    public enum UserRole
    {
        [Description("Administrador")]
        Administrator = 1,

        [Description("Editor")]
        Editor = 2,

        [Description("Asistente")]
        Assistant = 3
    }
}
