const {
    CloudWatchLogsClient,
    DescribeLogStreamsCommand,
    CreateLogStreamCommand,
    PutLogEventsCommand
} = require("@aws-sdk/client-cloudwatch-logs");

// Cấu hình CloudWatch Logs Client từ AWS SDK v3
const cloudwatchlogs = new CloudWatchLogsClient({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
    }
});

async function sendLogToCloudWatch(logGroupName, logStreamName, message) {
    try {
        // Kiểm tra log stream tồn tại hay chưa
        const describeCommand = new DescribeLogStreamsCommand({
            logGroupName,
            logStreamNamePrefix: logStreamName
        });

        const streams = await cloudwatchlogs.send(describeCommand);
        let sequenceToken;

        if (streams.logStreams && streams.logStreams.length > 0) {
            sequenceToken = streams.logStreams[0].uploadSequenceToken;
        } else {
            // Nếu stream chưa tồn tại, tạo log stream mới
            const createCommand = new CreateLogStreamCommand({
                logGroupName,
                logStreamName
            });
            await cloudwatchlogs.send(createCommand);
        }

        // Gửi log lên CloudWatch
        const putLogCommand = new PutLogEventsCommand({
            logEvents: [
                {
                    message,
                    timestamp: new Date().getTime()
                }
            ],
            logGroupName,
            logStreamName,
            sequenceToken
        });

        await cloudwatchlogs.send(putLogCommand);
        console.log("Log sent to CloudWatch successfully");
    } catch (err) {
        console.error("Error sending log to CloudWatch:", err);
    }
}

const {
    CloudWatchClient,
    PutMetricDataCommand
} = require("@aws-sdk/client-cloudwatch");

const cloudwatch = new CloudWatchClient({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
    }
});

async function sendCustomMetric(namespace, metricName, value, unit) {
    try {
        const command = new PutMetricDataCommand({
            Namespace: namespace,
            MetricData: [
                {
                    MetricName: metricName,
                    Value: value,
                    Unit: unit,
                    Dimensions: [{ Name: "Axis", Value: "X" }],
                    Timestamp: new Date()
                }
            ]
        });

        await cloudwatch.send(command);
        console.log(
            `Metric ${metricName}: ${value} sent to CloudWatch successfully`
        );
    } catch (err) {
        console.error("Error sending custom metric to CloudWatch:", err);
    }
}

module.exports = {
    sendLogToCloudWatch,
    sendCustomMetric
};
