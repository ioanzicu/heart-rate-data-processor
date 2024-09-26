function summaryProcessor(data: Summary): SummaryOutput {
  return {
    userId: data.userId,
    activityType: data.activityType,
    deviceName: data.deviceName,
    maxHeartRatePerMinute: data.maxHeartRateInBeatsPerMinute,
    durationInSeconds: data.durationInSeconds,
  };
}

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

const HEAR_RATE_SAMPLE_TYPE = "2"

function heartRateSamplesDataProcessor(
  data: HeartRateSamples
): HeartRateSamplesOutput {
  const heartRateSamples = [];
  for (let i = 0; i < data.length; ) {
    if (data[i]["sample-type"] === HEAR_RATE_SAMPLE_TYPE) {
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
