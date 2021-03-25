/**
 * Agrega una coma cada tres carácteres de un texto o número dado.
 * @param dinero Un string o número que se quiera dividir.
 * @returns El string con una coma cada tres carácteres.
 */
export const ConverString = (dinero: string | number) => String(dinero).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
