/* history.js — Système d'historique undo/redo pour le Studio
 *
 * Stocke les snapshots complets de l'état du workflow.
 * Limite configurable (défaut : 50 étapes).
 */

export function createHistory(maxSteps = 50) {
  const stack = [];
  let pointer = -1;

  function push(snapshot) {
    // Tronquer l'historique futur si on est au milieu
    if (pointer < stack.length - 1) {
      stack.splice(pointer + 1);
    }

    // Profondeur maximale
    if (stack.length >= maxSteps) {
      stack.shift();
    } else {
      pointer++;
    }

    stack[pointer] = JSON.parse(JSON.stringify(snapshot));
  }

  function undo() {
    if (pointer <= 0) return null;
    pointer--;
    return JSON.parse(JSON.stringify(stack[pointer]));
  }

  function redo() {
    if (pointer >= stack.length - 1) return null;
    pointer++;
    return JSON.parse(JSON.stringify(stack[pointer]));
  }

  function current() {
    if (pointer < 0 || pointer >= stack.length) return null;
    return JSON.parse(JSON.stringify(stack[pointer]));
  }

  function canUndo() {
    return pointer > 0;
  }

  function canRedo() {
    return pointer < stack.length - 1;
  }

  function clear() {
    stack.length = 0;
    pointer = -1;
  }

  function size() {
    return stack.length;
  }

  return {
    push,
    undo,
    redo,
    current,
    canUndo,
    canRedo,
    clear,
    size,
  };
}
