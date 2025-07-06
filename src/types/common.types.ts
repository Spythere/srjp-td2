export type ViewMode = 'active' | 'storage' | 'journal';

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
  routeSpeedExit?: number;
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
  arrivalLineNumber: string;
  departureLineNumber: string;
  driveTime: number;
  abbrevs: string[];
  sceneryName: string;
  arrivalKm: string;
  arrivalSpeedL: number;
  arrivalSpeedP: number;
  arrivalTracks: number;
  departureKm: string;
  departureSpeedL: number;
  departureSpeedP: number;
  departureTracks: number;
  headUnits: string[];
  stockVmax: number;
  stockLength: number;
  stockMass: number;

  lastRowRef: StopRow | null;
}

export interface StopRowCZ {
  pointName: string;
  pointKm: string;
  isMain: boolean;
  stopTime: number;
  stopType: string;
  scheduledArrivalDate: Date | null;
  scheduledDepartureDate: Date | null;
  driveTime: number;
  sceneryName: string;
  arrivalSpeed: number;
  departureSpeed: number;
  arrivalTracks: number;
  departureTracks: number;
  headUnits: string[];
  stockVmax: number;
  stockLength: number;
  stockMass: number;

  arrivalDateStr: string;
  departureDateStr: string;
}

export interface TimetablePathData {
  sceneryName: string;
  sceneryData: SceneryData | null;
  arrivalLine: string;
  departureLine: string;
  arrivalLineData: SceneryRoute | null;
  departureLineData: SceneryRoute | null;
}

export interface JournalTimetableShort {
  id: number;
  allStopsCount: number;
  confirmedStopsCount: number;
  createdAt: string;
  beginDate: string;
  driverId: number;
  driverName: string;
  route: string;
  routeDistance: number;
  currentDistance: number;
  currentLocation: string[];
  currentSceneryName: string;
  currentSceneryHash: string;
  driverLevel: number;
  fulfilled: boolean;
  terminated: boolean;
  driverIsSupporter: boolean;
  trainCategoryCode: string;
  trainNo: number;
  region: string;
  hasDangerousCargo: boolean;
  hasExtraDeliveries: boolean;
  twr: boolean;
  skr: boolean;
}

export interface JournalTimetableDetailed extends JournalTimetableShort {
  id: number;
  schemaVersion: string;
  allStopsCount: number;
  authorId: number;
  authorName: string;
  beginDate: string;
  confirmedStopsCount: number;
  currentDistance: number;
  driverId: number;
  driverName: string;
  endDate: string;
  fulfilled: boolean;
  route: string;
  routeDistance: number;
  region: string;
  sceneriesString: string;
  scheduledBeginDate: string;
  scheduledEndDate: string;
  terminated: boolean;
  timetableId: number;
  trainCategoryCode: string;
  trainNo: number;
  twr: boolean;
  skr: boolean;
  stockString: string;
  stockMass: number;
  stockLength: number;
  maxSpeed: number;
  trainMaxSpeed: number;
  hashesString: string;
  currentSceneryName: string;
  currentSceneryHash: any;
  driverIsSupporter: boolean;
  driverLevel: number;
  createdAt: string;
  updatedAt: string;
  stockHistory: string[];
  routeSceneries: string;
  checkpointArrivals: any[];
  checkpointDepartures: any[];
  checkpointArrivalsScheduled: string[];
  checkpointDeparturesScheduled: string[];
  checkpointStopTypes: string[];
  currentLocation: string[];
  visitedSceneries: string[];
  sceneryHashes: string[];
  sceneryNames: string[];
  checkpointComments: string[];
  checkpointNames: string[];
  path: string;
  warningNotes: string;
  hasDangerousCargo: boolean;
  hasExtraDeliveries: boolean;
  stopListString?: string;
}

export interface TimetableData {
  trainNo: number;
  mass: number;
  length: number;
  driverName: string;
  driverId: number;
  hasDangerousCargo: boolean;
  hasExtraDeliveries: boolean;
  warningNotes: string;
  category: string;
  route: string;
  timetableId: number;
  path: string;
  trainMaxSpeed: number;
  stopListString: string;
  headUnits: string[];
  savedTimestamp?: number;
  journalCreatedAt?: number;
}

export interface VehicleData {
  id: number;
  name: string;
  type: string;
  group: VehicleGroup;
  cabinName?: string;
  restrictions?: VehicleRestrictions;
  simulatorVersion: string;
}

export interface VehicleRestrictions {
  sponsorOnly?: number;
  teamOnly?: boolean;
}

export interface VehicleGroup {
  id: number;
  name: string;
  speed: number;
  speedLoaded?: number;
  speedLoco?: number;
  length: number;
  weight: number;
  cargoTypes?: VehicleCargoType[];
  locoProps?: VehicleLocoProps;
  massSpeeds?: VehicleMassSpeeds;
}

export interface VehicleCargoType {
  id: string;
  weight: number;
}

export interface VehicleLocoProps {
  coldStart: boolean;
  doubleManned: boolean;
}

export interface VehicleMassSpeeds {
  none: number;
  cargo?: Record<string, number>;
  passenger?: Record<string, number>;
}
