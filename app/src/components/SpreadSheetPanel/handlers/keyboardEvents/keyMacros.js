const DOWN = 'DOWN';
const UP = 'UP';

const CONTROL = 'Control';
const META = 'Meta';
const SHIFT = 'Shift';
const Z = 'z';
const Y = 'y';
const C = 'c';
const X = 'x';
const V = 'v';
const FLUFF = 'q';

const CTRL_DOWN = { id: CONTROL, status: DOWN };
const CTRL_UP = { id: CONTROL, status: UP };
const META_DOWN = { id: META, status: DOWN };
const META_UP = { id: META, status: UP };
const SHIFT_DOWN = { id: SHIFT, status: DOWN };
const SHIFT_UP = { id: SHIFT, status: UP };
const Z_DOWN = { id: Z, status: DOWN };
const Z_UP = { id: Z, status: UP };
const Y_DOWN = { id: Y, status: DOWN };
const Y_UP = { id: Y, status: UP };
const X_DOWN = { id: X, status: DOWN };
const X_UP = { id: X, status: UP };
const C_DOWN = { id: C, status: DOWN };
const C_UP = { id: C, status: UP };
const V_DOWN = { id: V, status: DOWN };
const V_UP = { id: V, status: UP };
const FLUFF_DOWN = { id: FLUFF, status: DOWN };
const FLUFF_UP = { id: FLUFF, status: UP };

const UNDO_DISPATCH = [CTRL_DOWN, Z_DOWN];
const UNDO_FINISH = [Z_UP, CTRL_UP];
const REDO_DISPATCH = [CTRL_DOWN, Y_DOWN];
const REDO_FINISH = [Y_UP, CTRL_UP];
const SIX_FINGERED_HAND_DISPATCH = [CTRL_DOWN, SHIFT_DOWN, Z_DOWN, X_DOWN, C_DOWN, V_DOWN];
const SIX_FINGERED_HAND_FINISH = [CTRL_UP, SHIFT_UP, Z_UP, X_UP, C_UP, V_UP];
const FLUFF_FULL = [FLUFF_DOWN, FLUFF_UP];

export { DOWN, UP, CONTROL, META, SHIFT, Z, Y, C, X, V, FLUFF, CTRL_DOWN, CTRL_UP, META_DOWN, META_UP, SHIFT_DOWN, SHIFT_UP, Z_DOWN, Z_UP, Y_DOWN, Y_UP, X_DOWN, X_UP, C_DOWN, C_UP, V_DOWN, V_UP, FLUFF_DOWN, FLUFF_UP, UNDO_DISPATCH, UNDO_FINISH, REDO_DISPATCH, REDO_FINISH, SIX_FINGERED_HAND_DISPATCH, SIX_FINGERED_HAND_FINISH, FLUFF_FULL };