import { useApiStore } from '../stores/api.store';

export function useVehicleMixin() {
  const apiStore = useApiStore();

  /**
   * Gets loco load (obc. lok.) in tons - effectively train mass without locomotive or lone locomotive / unit mass
   */
  function getLocoLoad(trainMass: number, stockString: string) {
    if (!apiStore.vehiclesData) return trainMass;

    const stockArray = stockString.split(';');
    const headUnitsNames = stockArray.slice(0, 3).filter((v) => /-\d{3,}$/.test(v));

    if (headUnitsNames.length == 1 && stockArray.length == 1) return trainMass;

    const headVehicleData = apiStore.vehiclesData.find((v) => v.name == headUnitsNames[0]);

    if (!headVehicleData) return trainMass;

    return Math.min(trainMass, trainMass - headVehicleData.group.weight);
  }

  return { getLocoLoad };
}
