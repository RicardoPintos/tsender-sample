export const calculateTotal = (amounts: string): number => {
  if (!amounts || amounts.trim() === '') {
    return 0;
  }

  // Split by both newlines and commas, then filter out empty strings
  const numbers = amounts
    .split(/[\n,]/) // Split by newlines or commas
    .map(str => str.trim()) // Remove whitespace
    .filter(str => str !== '') // Remove empty strings
    .map(str => parseFloat(str)) // Convert to numbers
    .filter(num => !isNaN(num)); // Remove invalid numbers

  // Sum all valid numbers
  return numbers.reduce((sum, num) => sum + num, 0);
};