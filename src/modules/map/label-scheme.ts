

export function colorForIncidence(sevenDaysInfectionsPer100k: number | undefined): string {
  if (sevenDaysInfectionsPer100k == undefined) return '#fff';

  if (sevenDaysInfectionsPer100k == 0) return '#d2d2d2';
  if (sevenDaysInfectionsPer100k <= 5) return '#d7d3af';
  if (sevenDaysInfectionsPer100k <= 25) return '#d7d288';
  if (sevenDaysInfectionsPer100k <= 50) return '#cd9406';
  if (sevenDaysInfectionsPer100k <= 100) return '#af2632';
  if (sevenDaysInfectionsPer100k <= 500) return '#8c0619';
  return '#fff';
}