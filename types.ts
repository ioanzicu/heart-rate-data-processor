type Summary = {
  userId: string;
  activityId: number;
  activityName: string;
  durationInSeconds: number;
  startTimeInSeconds: number;
  startTimeOffsetInSeconds: number;
  activityType: string;
  averageHeartRateInBeatsPerMinute: number;
  activeKilocalories: number;
  deviceName: string;
  maxHeartRateInBeatsPerMinute: number;
};

type SummaryOutput = {
  userId: string;
  activityType: string;
  deviceName: string;
  maxHeartRatePerMinute: number;
  durationInSeconds: number;
};

type Laps = Lap[];

type Lap = {
  startTimeInSeconds: number;
  airTemperatureCelsius: number;
  heartRate: number;
  totalDistanceInMeters: number;
  timerDurationInSeconds: number;
};

type LapsOutput = LapOutput[];

type LapOutput = {
  startTimeInSeconds: number;
  distanceInMeters: number;
  durationInSeconds: number;
};

type HeartRateSamples = HeartRateSample[];

type HeartRateSample = {
  "recording-rate": number;
  "sample-type": string;
  data: string;
};

type HeartRateSamplesOutput = HeartRateSampleOutput[][];

type HeartRateSampleOutput = {
  sampleIndex: number;
  heartRate: string;
};

type Output = P[];

type P = LapOutput & {
  heartRateSamples: HeartRateSampleOutput[];
};
