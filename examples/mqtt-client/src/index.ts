import { MqttClient } from "@iota/iota2.js";

const MQTT_ENDPOINT = "mqtt://127.0.0.1:1883";

async function run() {
    const mqttClient = new MqttClient(MQTT_ENDPOINT);

    mqttClient.statusChanged(data => console.log("Status", data));

    mqttClient.milestonesLatest((topic, data) => console.log(topic, data))

    mqttClient.milestonesSolid((topic, data) => console.log(topic, data))

    mqttClient.messageMetadata("ec7c73e61295aba1c6ae82b06fb34964e22a8b719c008d42f8c9807fd4c8df2d", (topic, data) => console.log(topic, data))

    mqttClient.output("0".repeat(68), (topic, data) => console.log(topic, data))

    mqttClient.addressOutputs("625d17d4a4b21cd5edeb57544b9d2d66ce22985fb61f17d1d7cae958d0068618", (topic, data) => console.log(topic, data))

    mqttClient.messagesRaw((topic, messageId, data) => console.log(topic, messageId, data))

    mqttClient.messages((topic, messageId, data, raw) => console.log(topic, messageId, data))

    mqttClient.index("MY-DATA-INDEX", (topic, messageId, data, raw) => console.log(topic, messageId, data))

    mqttClient.indexRaw("MY-DATA-INDEX", (topic, messageId, data) => console.log(topic, messageId, data))

    mqttClient.messagesMetadata((topic, data) => console.log(topic, data))
}

run()
    .then(() => console.log("Done"))
    .catch((err) => console.error(err));