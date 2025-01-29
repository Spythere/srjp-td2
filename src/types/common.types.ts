export interface ActiveData {
  trains: ActiveTrain[];
  activeSceneries: ActiveScenery[];
}

export interface ActiveTrain {
  id: string;
  trainNo: number;
  mass: number;
  speed: number;
  length: number;
  distance: number;
  stockString: string;
  driverName: string;
  driverId: number;
  driverIsSupporter: boolean;
  driverLevel: number;
  currentStationHash?: string;
  currentStationName: string;
  signal: string;
  connectedTrack: string;
  online: number;
  lastSeen: number;
  region: string;
  isTimeout: boolean;
  timetable?: ActiveTrainTimetable;
}

export interface ActiveTrainTimetable {
  SKR: boolean;
  TWR: boolean;
  hasDangerousCargo: boolean;
  hasExtraDeliveries: boolean;
  warningNotes: string;
  category: string;
  stopList: TimetableStop[];
  route: string;
  timetableId: number;
  sceneries: string[];
  path: string;
  trainMaxSpeed: number;
}

export interface TimetableStop {
  stopName: string;
  stopNameRAW: string;
  stopType: string;
  stopDistance: number;
  pointId: string;
  comments?: string;
  mainStop: boolean;
  arrivalLine?: string;
  arrivalTimestamp: number;
  arrivalRealTimestamp: number;
  arrivalDelay: number;
  departureLine?: string;
  departureTimestamp: number;
  departureRealTimestamp: number;
  departureDelay: number;
  beginsHere: boolean;
  terminatesHere: boolean;
  confirmed: number;
  stopped: number;
  stopTime?: number;
}

export interface ActiveScenery {
  dispatcherId: number;
  dispatcherName: string;
  dispatcherIsSupporter: boolean;
  stationName: string;
  stationHash: string;
  region: string;
  maxUsers: number;
  currentUsers: number;
  spawn: number;
  lastSeen: number;
  dispatcherExp: number;
  nameFromHeader: string;
  spawnString?: string;
  networkConnectionString: string;
  isOnline: number;
  dispatcherRate: number;
  dispatcherStatus: number;
}

export interface SceneryData {
  createdAt: string;
  updatedAt?: string;
  id: number;
  name: string;
  SUP: boolean;
  authors: string;
  availability: string;
  backupJSON: any;
  checkpoints?: string;
  controlType: string;
  lines?: string;
  project?: string;
  reqLevel: number;
  routes?: string;
  routesInfo: SceneryRoute[];
  signalType: string;
  supportersOnly?: boolean;
  url?: string;
  projectUrl?: string;
  hash?: string;
  abbr: string;
  hidden: boolean;
  ASDEK: boolean;
  hashHistory: string[];
}

export interface SceneryRoute {
  routeName: string;
  isElectric: boolean;
  isInternal: boolean;
  isRouteSBL: boolean;
  routeSpeed: number;
  routeLength: number;
  routeTracks: number;
  hidden?: boolean;
  realLineNo?: number;
}

export interface StopRow {
  pointName: string;
  pointKm: string;
  isMain: boolean;
  stopTime: number;
  stopType: string;
  scheduledArrivalDate: Date | null;
  scheduledDepartureDate: Date | null;
  realLine: string;
  driveTime: number;
  abbrevs: string[];
  sceneryName: string;
  arrivalKm: string;
  arrivalSpeed: number;
  arrivalTracks: number;
  departureKm: string;
  departureSpeed: number;
  departureTracks: number;
  headLocos: string[];
  stockVmax: number;
  stockLength: number;
  stockMass: number;
}
