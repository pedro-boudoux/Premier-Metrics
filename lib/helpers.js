export function deRow(result) {
  if (!result.rows || result.rows.length === 0) return null;
  const firstRow = result.rows[0];
  const firstField = Object.keys(firstRow)[0];
  return firstRow[firstField];
}