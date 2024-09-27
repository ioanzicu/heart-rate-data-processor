import { HeartRateSamplesOutput, LapsOutput } from "./types";

export default function zip(lapsData: LapsOutput, heartRateSampleData: HeartRateSamplesOutput){
    const output = [];
    for (let i = 0; i < lapsData.length; i++) {
      output.push({
        ...lapsData[i],
        heartRateSamples: heartRateSampleData[i],
      });
    }
    return output
  }