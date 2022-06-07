/**
 * Convierte un dato de tiempo en años, meses, días, horas, minutos y segundos.
 * @param ms Texto o número a convertir
 * @returns {string} El tiempo convertido a una fecha legible.
 */
export const ConvertorTime = (ms: string | number): string => {
    if (typeof ms == "string") ms = parseInt(ms);
    const años = Math.floor(ms / (1000 * 60 * 60 * 24 * 365));
    const meses = Math.floor((ms % (1000 * 60 * 60 * 24 * 365)) / (1000 * 60 * 60 * 24 * 30));
    const dias = Math.floor((ms % (1000 * 60 * 60 * 24 * 30)) / (1000 * 60 * 60 * 24));
    const horas = Math.floor((ms % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutos = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
    const segundos = Math.floor((ms % (1000 * 60)) / 1000);

    let final = "";
    if (años > 0) final += años > 1 ? `${años} años, ` : `${años} año, `;
    if (meses > 0) final += meses > 1 ? `${meses} meses, ` : `${meses} mes, `;
    if (dias > 0) final += dias > 1 ? `${dias} dias, ` : `${dias} dia, `;
    if (horas > 0) final += horas > 1 ? `${horas} horas, ` : `${horas} hora, `;
    if (minutos > 0) final += minutos > 1 ? `${minutos} minutos y ` : `${minutos} minuto y `;
    if (segundos > 0) final += segundos > 1 ? `${segundos} segundos.` : `${segundos} segundo.`;
    return final;
};
