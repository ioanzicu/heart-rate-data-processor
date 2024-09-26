import {
  summaryProcessor,
  lapsProcessor,
  heartRateSamplesDataProcessor,
  processSamplesOutput,
} from "./main.ts";

describe("summaryProcessor", () => {
  test("happy path", () => {
    const given = {
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
    const actual = summaryProcessor(given);

    const expected = {
      userId: "1234567890",
      activityType: "INDOOR_CYCLING",
      deviceName: "instinct2",
      maxHeartRatePerMinute: 190,
      durationInSeconds: 3667,
    };

    expect(actual).toEqual(expected);
  });
});

describe("lapsProcessor", () => {
  test("happy path", () => {
    const given = [
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
    const actual = lapsProcessor(given);

    const expected = [
      {
        startTimeInSeconds: 1661158927,
        distanceInMeters: 15,
        durationInSeconds: 600,
      },
      {
        startTimeInSeconds: 1661158929,
        distanceInMeters: 30,
        durationInSeconds: 900,
      },
    ];

    expect(actual).toEqual(expected);
  });
});

describe("heartRateSamplesDataProcessor", () => {
  test("happy path", () => {
    const given = [
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

    const actual = heartRateSamplesDataProcessor(given);

    const expected = [
      [
        {
          sampleIndex: 1,
          heartRate: "120,126,122,140,142,155,145",
        },
        {
          sampleIndex: 2,
          heartRate: "141,147,155,160,180,152,120",
        },
      ],
      [
        {
          sampleIndex: 5,
          heartRate: "143,151,164,null,173,181,180",
        },
        {
          sampleIndex: 6,
          heartRate: "182,170,188,181,174,172,158",
        },
      ],
    ];

    expect(actual).toEqual(expected);
  });
});

describe("processSamplesOutput", () => {
  test("happy path", () => {
    const given1 = [
      {
        startTimeInSeconds: 1661158927,
        distanceInMeters: 15,
        durationInSeconds: 600,
      },
      {
        startTimeInSeconds: 1661158929,
        distanceInMeters: 30,
        durationInSeconds: 900,
      },
    ];

    const given2 = [
      [
        {
          sampleIndex: 1,
          heartRate: "120,126,122,140,142,155,145",
        },
        {
          sampleIndex: 2,
          heartRate: "141,147,155,160,180,152,120",
        },
      ],
      [
        {
          sampleIndex: 5,
          heartRate: "143,151,164,null,173,181,180",
        },
        {
          sampleIndex: 6,
          heartRate: "182,170,188,181,174,172,158",
        },
      ],
    ];
    const actual = processSamplesOutput(given1, given2);

    const expected = [
      {
        startTimeInSeconds: 1661158927,
        distanceInMeters: 15,
        durationInSeconds: 600,
        heartRateSamples: [
          {
            sampleIndex: 1,
            heartRate: "120,126,122,140,142,155,145",
          },
          {
            sampleIndex: 2,
            heartRate: "141,147,155,160,180,152,120",
          },
        ],
      },
      {
        startTimeInSeconds: 1661158929,
        distanceInMeters: 30,
        durationInSeconds: 900,
        heartRateSamples: [
          {
            sampleIndex: 5,
            heartRate: "143,151,164,null,173,181,180",
          },
          {
            sampleIndex: 6,
            heartRate: "182,170,188,181,174,172,158",
          },
        ],
      },
    ]
    
    expect(actual).toEqual(expected);
  });
});
