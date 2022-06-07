/**
 * Da formato a las hora en formato 12h am/pm
 * @param time Valor de fecha.
 */
export const Reloj = (time = new Date()): string => {
    const hrs = time.getHours();
    const mins = time.getMinutes();
    const secs = time.getSeconds();
    const ret = `${hrs > 12 ? hrs - 12 : hrs}:${mins}:${secs} ${hrs > 12 ? "PM" : "AM"}`;
    return ret;
};
