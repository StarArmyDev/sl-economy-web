/**
 * Agrega una coma cada tres carácteres de un texto o número dado.
 * @param dinero Un string o número que se quiera dividir.
 * @param decimals Cantidad de decimales a mostrar.
 * @returns El string con una coma cada tres carácteres.
 */
export const ConvertString = (dinero: string | number, decimals?: number): string => {
    let newString = String(dinero).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');

    if (decimals) {
        if (newString.includes('.')) {
            newString = `${newString.split('.')[0]}.${
                newString.split('.')[1].length < decimals
                    ? parseInt(newString.split('.')[1] + '0', 10) * (decimals - newString.split('.')[1].length)
                    : newString.split('.')[1].substring(0, decimals)
            }`;

            if (newString.endsWith('.')) {
                newString = `${newString}${'0'.repeat(decimals)}`;
            }
        } else {
            newString = `${newString}.${'0'.repeat(decimals)}`;
        }
    }
    return newString;
};
