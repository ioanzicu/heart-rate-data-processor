import {
  summaryProcessor,
  lapsProcessor,
  heartRateSamplesDataProcessor,
  processSamplesOutput,
  DataProcessor,
} from "./main.ts";
import zip from "./privateFunctions.ts";

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
    ];

    expect(actual).toEqual(expected);
  });
});

describe("method DataProcessor.loadSummaryData", () => {
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

    const obj = new DataProcessor();
    obj.loadSummaryData(given);
    const actual = obj["summaryData"];

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

describe("method DataProcessor.lapsProcessor", () => {
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

    const obj = new DataProcessor();
    obj.loadLapsData(given);
    const actual = obj["lapsData"];

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

describe("zip function for private method DataProcessor.processSamplesOutput", () => {
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

    const actual = zip(given1, given2);

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
    ];

    expect(actual).toEqual(expected);
  });
});

describe("method DataProcessor.loadHeartRateSamplesDataProcessor", () => {
  const given1 = {
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

  const given2 = [
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

  test("happy path", () => {
    const given3 = [
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

    const obj = new DataProcessor();
    obj.loadSummaryData(given1);
    obj.loadLapsData(given2);
    obj.loadHeartRateSamplesDataProcessor(given3);
    const actual = obj["heartRateSampleData"];

    const expected = [
      [
        { heartRate: "120,126,122,140,142,155,145", sampleIndex: 1 },
        { heartRate: "141,147,155,160,180,152,120", sampleIndex: 2 },
      ],
      [
        { heartRate: "143,151,164,null,173,181,180", sampleIndex: 5 },
        { heartRate: "182,170,188,181,174,172,158", sampleIndex: 6 },
      ],
    ];
    expect(actual).toEqual(expected);
  });

  test("not two HEAR_RATE_SAMPLE_TYPE sequential objects", () => {
    const given3 = [
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
        "sample-type": "1",
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
        "sample-type": "5",
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

    const obj = new DataProcessor();
    obj.loadSummaryData(given1);
    obj.loadLapsData(given2);
    obj.loadHeartRateSamplesDataProcessor(given3);
    const actual = obj["heartRateSampleData"];

    const expected = [
      [{ heartRate: "120,126,122,140,142,155,145", sampleIndex: 1 }],
      [{ heartRate: "182,170,188,181,174,172,158", sampleIndex: 6 }],
    ];
    expect(actual).toEqual(expected);
  });
});

describe("method DataProcessor.build", () => {
  const given1 = {
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

  const given2 = [
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

  test("no summaryData set", () => {
    const obj = new DataProcessor();
    expect(() => obj.build()).toThrow(Error);
    expect(() => obj.build()).toThrow(
      "summaryData was not loaded, please use loadSummaryData method"
    );
  });

  test("no lapsData set", () => {
    const obj = new DataProcessor();
    obj.loadSummaryData(given1);

    expect(() => obj.build()).toThrow(Error);
    expect(() => obj.build()).toThrow(
      "lapsData was not loaded, please use loadLapsData method"
    );
  });

  test("no heartRateSampleData set", () => {
    const obj = new DataProcessor();
    obj.loadSummaryData(given1);
    obj.loadLapsData(given2);

    expect(() => obj.build()).toThrow(Error);
    expect(() => obj.build()).toThrow(
      "heartRateSampleData was not loaded, please use loadHeartRateSamplesDataProcessor method"
    );
  });
});

describe("method DataProcessor.getOutput", () => {
  test("happy path", () => {
    const given1 = {
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

    const given2 = [
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

    const given3 = [
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

    const obj = new DataProcessor();
    obj.loadSummaryData(given1);
    obj.loadLapsData(given2);
    obj.loadHeartRateSamplesDataProcessor(given3);
    obj.build();
    const actual = obj.getOutput();

    const expected = {
      activityOverview: {
        userId: "1234567890",
        activityType: "INDOOR_CYCLING",
        deviceName: "instinct2",
        maxHeartRatePerMinute: 190,
        durationInSeconds: 3667,
      },
      lapsData: [
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
      ],
    };

    expect(actual).toEqual(expected);
  });
});
