export const enum ActionTypes {
    // - Usuario logueado
    SET_USER,

    // Desconcido
    UNKNOWN,
}

export type DispatchType = (arg: unknown) => void;

export interface ActionParam {
    type?: ActionTypes;
}
