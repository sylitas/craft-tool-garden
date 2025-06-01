import { Kafka } from 'kafkajs';
import { FastifyRequest, FastifyReply } from 'fastify';

type MessageRequest = FastifyRequest<{
  Body: {
    topic: string;
    message: string;
    key?: string;
  };
}>;

type TestConnectionRequest = FastifyRequest<{
  Body: { brokers: string };
}>;

export async function testConnection(
  req: TestConnectionRequest,
  res: FastifyReply
) {
  try {
    const {
      brokers: brokersStr,
      // securityProtocol,
      // username,
      // password
    } = req.body;

    const brokers = brokersStr.split(',').map((broker) => broker.trim());

    if (!brokers || !Array.isArray(brokers) || brokers.length === 0) {
      return res.status(400).send({
        success: false,
        message: 'Please provide an array of Kafka brokers',
      });
    }

    const kafka = new Kafka({ brokers });

    const admin = kafka.admin();

    // Try to connect
    await admin.connect();

    // Get broker information to verify connection
    const metadata = await admin.fetchTopicMetadata();

    // Disconnect after successful test
    await admin.disconnect();

    return res.send({
      success: true,
      message: 'Successfully connected to Kafka',
      brokers: brokers,
      topics: metadata.topics.map((topic) => topic.name),
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);

    return res.status(500).send({
      success: false,
      message: 'Failed to connect to Kafka',
      error: errorMessage,
    });
  }
}

type ProduceMessageBody = FastifyRequest<{
  Body: {
    brokers: string;
    securityProtocol?: string;
    username?: string;
    password?: string;
    topic: string;
    message: string;
    key?: string;
  };
}>;

export async function produceMessage(
  req: ProduceMessageBody,
  res: FastifyReply
) {
  const {
    brokers: brokersStr,
    securityProtocol,
    username,
    password,
    topic,
    message,
  } = req.body;

  const brokers = brokersStr.split(',').map((broker) => broker.trim());

  const kafka = new Kafka({ brokers });

  const producer = kafka.producer();

  await producer.connect();

  await producer.send({
    topic,
    messages: [{ value: message }],
  });

  await producer.disconnect();

  return res.send({
    success: true,
    message: 'Message produced successfully',
    topic,
  });
}
