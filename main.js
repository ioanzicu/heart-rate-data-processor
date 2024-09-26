var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var summary = {
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
function summaryProcessor(data) {
    return {
        userId: data.userId,
        activityType: data.activityType,
        deviceName: data.deviceName,
        maxHeartRatePerMinute: data.maxHeartRateInBeatsPerMinute,
        durationInSeconds: data.durationInSeconds,
    };
}
var s = summaryProcessor(summary);
console.log("summary", s);
var laps = [
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
function lapsProcessor(data) {
    var laps = [];
    for (var _i = 0, data_1 = data; _i < data_1.length; _i++) {
        var element = data_1[_i];
        laps.push({
            startTimeInSeconds: element.startTimeInSeconds,
            distanceInMeters: element.totalDistanceInMeters,
            durationInSeconds: element.timerDurationInSeconds,
        });
    }
    return laps;
}
var a = lapsProcessor(laps);
console.log("laps", a);
var samplesData = [
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
function heartRateSamplesDataProcessor(data) {
    var heartRateSamples = [];
    for (var i = 0; i < data.length;) {
        // const type
        if (data[i]["sample-type"] === "2") {
            var sample = [
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
var o = heartRateSamplesDataProcessor(samplesData);
console.log("samples", o);
function processSamplesOutput(lapsData, heartRateSamples) {
    var output = [];
    for (var i = 0; i < lapsData.length; i++) {
        console.log("heartRateSamples", heartRateSamples[i]);
        output.push(__assign(__assign({}, lapsData[i]), { heartRateSamples: heartRateSamples[i] }));
    }
    return output;
}
var output = processSamplesOutput(a, o);
console.log("OUPUT", JSON.stringify(output, null, 4));
console.log("\n\n\nFINAL", JSON.stringify({
    activity: s,
    lapsData: output
}, null, 4));
