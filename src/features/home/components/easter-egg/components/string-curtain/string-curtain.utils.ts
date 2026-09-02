// Ported from the reference implementation's utils.js/countries.js
// (marinabudarina/chimes).

// Column-major particle index — matches how the grid is built (outer loop
// over columns) so a particle and its neighbors can be looked up by (row,
// col) without storing a 2D array.
export function getPointID(row: number, col: number, gridH: number) {
  return col * gridH + row;
}

export function smoothstep(edge0: number, edge1: number, x: number) {
  const t = Math.max(0, Math.min(1, (x - edge0) / (edge1 - edge0)));
  return t * t * (3 - 2 * t);
}

// Row-major mapping of one long ribbon of text onto the grid: column i, row
// j reads character (j*gridW+i) of the text, wrapping via modulo once the
// text runs out. This is the CJK-vertical-writing reference's "horizontal"
// mode — the only one relevant here since the curtain text is Latin.
export function charForCell(text: string, i: number, j: number, gridW: number) {
  if (!text.length) return " ";
  const index = j * gridW + i;
  return text[index % text.length] || " ";
}

export function sizeCanvas(
  canvas: HTMLCanvasElement,
  cssWidth: number,
  cssHeight: number,
  dpr: number,
) {
  canvas.width = Math.round(cssWidth * dpr);
  canvas.height = Math.round(cssHeight * dpr);
  canvas.style.width = `${cssWidth}px`;
  canvas.style.height = `${cssHeight}px`;
}
