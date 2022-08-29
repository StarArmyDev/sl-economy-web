/**
 * Verificar que un string sea una url.
 *
 * @param {string} url Texto a tratar.
 * @param {boolean} imagen Si se verificará como url de imagen.
 * @return {boolean} Si es o no válido.
 */
export const IsValidUrl = (url: string, imagen = false): boolean => {
    let pattern = /^((http|https):\/\/|www\.)[\w\d.-]+([a-z]{2,4})+(\/[\w\d.?%-=]+)?/gi;
    if (imagen) pattern = /^((http|https):\/\/|www\.)[\w\d.-]+([a-z]{2,4})+(\/[\w\d.?%-=]+)?(\.(jpg|png|gif))(\?width=\d{2,4}&height=\d{2,4})?$/gi;

    if (url === "") return false;
    if (url.match(pattern)) return true;
    else return false;
};
