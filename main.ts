import zip from "./privateFunctions.ts";
import {
  HeartRateSamples,
  HeartRateSamplesOutput,
  Laps,
  LapsOutput,
  Output,
  Summary,
  SummaryOutput,
} from "./types.ts";

class DataProcessor {
  readonly HEAR_RATE_SAMPLE_TYPE: string = "2";

  private summaryData!: SummaryOutput;
  private lapsData!: LapsOutput;
  private heartRateSampleData!: HeartRateSamplesOutput;
  private output!: Output;

  // Load Summary
  loadSummaryData(data: Summary): this {
    this.summaryData = {
      userId: data.userId,
      activityType: data.activityType,
      deviceName: data.deviceName,
      maxHeartRatePerMinute: data.maxHeartRateInBeatsPerMinute,
      durationInSeconds: data.durationInSeconds,
    };
    return this;
  }

  // Load Laps
  loadLapsData(data: Laps): this {
    const laps = [];
    for (const element of data) {
      laps.push({
        startTimeInSeconds: element.startTimeInSeconds,
        distanceInMeters: element.totalDistanceInMeters,
        durationInSeconds: element.timerDurationInSeconds,
      });
    }
    this.lapsData = laps;
    return this;
  }

  // Load Samples
  loadHeartRateSamplesDataProcessor(data: HeartRateSamples): this {
    const heartRateSamples = [];
    for (let i = 0; i < data.length; i++) {
      if (data[i]["sample-type"] === this.HEAR_RATE_SAMPLE_TYPE) {
        const sample = [];
        sample.push({
          sampleIndex: i,
          heartRate: data[i].data,
        });

        i++;

        if (
          i < data.length &&
          data[i]["sample-type"] === this.HEAR_RATE_SAMPLE_TYPE
        ) {
          sample.push({
            sampleIndex: i,
            heartRate: data[i].data,
          });
        }
        heartRateSamples.push(sample);
      }
    }
    this.heartRateSampleData = heartRateSamples;
    this.processSamplesOutput();
    return this;
  }

  private processSamplesOutput(): void {
    this.output = zip(this.lapsData, this.heartRateSampleData);
  }

  build(): this | never {
    if (!this.summaryData) {
      throw new Error(
        "summaryData was not loaded, please use loadSummaryData method"
      );
    } else if (!this.lapsData) {
      throw new Error(
        "lapsData was not loaded, please use loadLapsData method"
      );
    } else if (!this.heartRateSampleData) {
      throw new Error(
        "heartRateSampleData was not loaded, please use loadHeartRateSamplesDataProcessor method"
      );
    }
    return this;
  }

  getOutput() {
    return {
      activityOverview: this.summaryData,
      lapsData: this.output,
    };
  }
}

export { DataProcessor };
