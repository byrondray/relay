interface CoordinatesComparison {
  latitude: number;
  longitude: number;
}

export const areCoordinatesEqual = (
  coords1: CoordinatesComparison[],
  coords2: CoordinatesComparison[]
): boolean => {
  const threshold = 0.00001;

  if (coords1.length !== coords2.length) return false;

  return coords1.every((coord, index) => {
    const latEqual =
      Math.abs(coord.latitude - coords2[index].latitude) < threshold;
    const lonEqual =
      Math.abs(coord.longitude - coords2[index].longitude) < threshold;
    return latEqual && lonEqual;
  });
};
