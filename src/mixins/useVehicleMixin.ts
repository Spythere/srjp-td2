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

    const headVehicleData = apiStore.vehiclesData.find((v) => v.name == headUnitsNames[0]);
    
    if (!headVehicleData) return trainMass;

    // 0t load for loco only
    if (headVehicleData.type.startsWith("loco") && stockArray.length == 1) return 0;

    return Math.min(trainMass, trainMass - headVehicleData.group.weight);
  }

  return { getLocoLoad };
}
