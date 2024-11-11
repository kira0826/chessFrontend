function isValidKnightMove(
    fromRow: number,
    fromCol: number,
    toRow: number,
    toCol: number,
  ): boolean {
    const rowDiff = Math.abs(toRow - fromRow);
    const colDiff = Math.abs(toCol - fromCol);
  
    if (
      (rowDiff === 2 && colDiff === 1) ||
      (rowDiff === 1 && colDiff === 2)
    ) {
      return true;
    }
    return false;
  }
  
export default isValidKnightMove