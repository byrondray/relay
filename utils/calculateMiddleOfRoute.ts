interface Coordinate {
  latitude: number;
  longitude: number;
}

const calculateMidpoint = (coordinates: Coordinate[]): Coordinate | null => {
  const totalPoints = coordinates.length;
  if (totalPoints === 0) return null;

  const midpointIndex = Math.floor(totalPoints / 2);
  return coordinates[midpointIndex];
};
