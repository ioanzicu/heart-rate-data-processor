const summary = {
  userId: "1234567890",
  activityId: 9480958402,
  activityName: "Indoor Cycling",
  durationInSeconds: 3667,
  startTimeInSeconds: 1661158927,
  startTimeOffsetInSeconds: 7200,
  activityType: "INDOOR_CYCLING",
  averageHeartRateInBeatsPerMinute: 150,
  activeKilocalories: 561,
  deviceName: "instinct2",
  maxHeartRateInBeatsPerMinute: 190,
};

function summaryProcessor(data: Summary): SummaryOutput {
  return {
    userId: data.userId,
    activityType: data.activityType,
    deviceName: data.deviceName,
    maxHeartRatePerMinute: data.maxHeartRateInBeatsPerMinute,
    durationInSeconds: data.durationInSeconds,
  };
}

const laps = [
  {
    startTimeInSeconds: 1661158927,
    airTemperatureCelsius: 28,
    heartRate: 109,
    totalDistanceInMeters: 15,
    timerDurationInSeconds: 600,
  },
  {
    startTimeInSeconds: 1661158929,
    airTemperatureCelsius: 28,
    heartRate: 107,
    totalDistanceInMeters: 30,
    timerDurationInSeconds: 900,
  },
];

function lapsProcessor(data: Laps): LapsOutput {
  const laps = [];
  for (const element of data) {
    laps.push({
      startTimeInSeconds: element.startTimeInSeconds,
      distanceInMeters: element.totalDistanceInMeters,
      durationInSeconds: element.timerDurationInSeconds,
    });
  }
  return laps;
}

const a = lapsProcessor(laps);

const samplesData = [
  {
    "recording-rate": 5,
    "sample-type": "0",
    data: "86,87,88,88,88,90,91",
  },
  {
    "recording-rate": 5,
    "sample-type": "2",
    data: "120,126,122,140,142,155,145",
  },
  {
    "recording-rate": 5,
    "sample-type": "2",
    data: "141,147,155,160,180,152,120",
  },
  {
    "recording-rate": 5,
    "sample-type": "0",
    data: "86,87,88,88,88,90,91",
  },
  {
    "recording-rate": 5,
    "sample-type": "1",
    data: "143,87,88,88,88,90,91",
  },
  {
    "recording-rate": 5,
    "sample-type": "2",
    data: "143,151,164,null,173,181,180",
  },
  {
    "recording-rate": 5,
    "sample-type": "2",
    data: "182,170,188,181,174,172,158",
  },
  {
    "recording-rate": 5,
    "sample-type": "3",
    data: "143,87,88,88,88,90,91",
  },
];

function heartRateSamplesDataProcessor(
  data: HeartRateSamples
): HeartRateSamplesOutput {
  const heartRateSamples = [];
  for (let i = 0; i < data.length; ) {
    if (data[i]["sample-type"] === "2") {
      const sample = [
        {
          sampleIndex: i,
          heartRate: data[i].data,
        },
      ];
      i++;
      sample.push({
        sampleIndex: i,
        heartRate: data[i].data,
      });
      i++;
      heartRateSamples.push(sample);
      continue;
    }
    i++;
  }
  return heartRateSamples;
}

function processSamplesOutput(
  lapsData: LapsOutput,
  heartRateSamples: HeartRateSamplesOutput
): Output {
  const output = [];
  for (let i = 0; i < lapsData.length; i++) {
    output.push({
      ...lapsData[i],
      heartRateSamples: heartRateSamples[i],
    });
  }
  return output;
}

export {
  summaryProcessor,
  lapsProcessor,
  heartRateSamplesDataProcessor,
  processSamplesOutput,
};
