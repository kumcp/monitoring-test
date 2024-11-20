const express = require("express");
const app = express();
const port = 3000;

const bodyParser = require("body-parser");
const path = require("path");

const dotenv = require("dotenv");
dotenv.config();

const {
    sendLogToCloudWatch,
    sendCustomMetric
} = require("./main/cloudwatchLog");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public/index.html"));
});

app.post("/", async (req, res) => {
    await sendLogToCloudWatch(
        "codestar-loggroup",
        "codestar-logstream",
        req.body.text
    );

    res.sendFile(path.join(__dirname, "public/index.html"));
});

app.post("/sendMetric", async (req, res) => {
    const { namespace, metricName, value, unit } = req.body;

    if (!namespace || !metricName || value === undefined || !unit) {
        return res.status(400).json({
            error: 'Parameters "namespace", "metricName", "value", and "unit" are required'
        });
    }

    try {
        await sendCustomMetric(namespace, metricName, parseFloat(value), unit);
        res.status(200).json({ message: "Metric sent successfully" });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            error: "Error sending custom metric to CloudWatch"
        });
    }
});

app.get("/metrics", async (req, res) => {
    res.send(`codestar_metrics 15 
user_count_metrics 18 
error_count 12 
request_per_session 30
`);
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
