import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { toast } from '@/components/ui/use-toast';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

// Define the tool interface
interface Tool {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
}

interface ProduceKafkaMessageProps {
  tool: Tool;
}

const ProduceKafkaMessage = ({ tool }: ProduceKafkaMessageProps) => {
  const navigate = useNavigate();
  const [kafkaServer, setKafkaServer] = useState('localhost:9092');
  const [securityProtocol, setSecurityProtocol] = useState('PLAINTEXT');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [topic, setTopic] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [topics, setTopics] = useState([]);
  const [isConnected, setIsConnected] = useState(false);

  const handleTestConnection = async () => {
    // Check if credentials are provided when needed
    if (
      (securityProtocol === 'SASL_PLAINTEXT' ||
        securityProtocol === 'SASL_SSL') &&
      (!username || !password)
    ) {
      toast({
        title: 'Authentication Error',
        description:
          'Username and password are required for SASL authentication',
        variant: 'destructive',
      });
      return;
    }

    setIsTesting(true);
    setIsConnected(false);

    try {
      const result = await axios.post(
        //TODO: Update Change to ENV
        `http://localhost:4321/api/produce-kafka-message/test-connection`,
        {
          brokers: kafkaServer,
          securityProtocol,
          ...(showAuthFields && { username, password }),
        }
      );

      if (!result.data.success) {
        throw new Error(result.data.message || 'Connection failed');
      }

      const topicsResponse = result.data.topics || [];
      setTopics(topicsResponse);
      setIsConnected(true);

      toast({
        title: 'Connection Successful',
        description: 'Successfully connected to Kafka broker',
        variant: 'default',
      });
    } catch (error) {
      setTopics([]);
      setTopic('');
      toast({
        title: 'Connection Failed',
        description:
          error.response?.data?.message || 'Could not connect to Kafka broker',
        variant: 'destructive',
      });
      setIsConnected(false);
    } finally {
      setIsTesting(false);
    }
  };

  const formatJson = () => {
    try {
      // Parse the current message and format it with 2 spaces
      const parsedJson = JSON.parse(message);
      const formattedJson = JSON.stringify(parsedJson, null, 2);
      setMessage(formattedJson);

      toast({
        title: 'JSON Formatted',
        description: 'JSON has been successfully formatted',
        variant: 'default',
      });
    } catch (error) {
      toast({
        title: 'Invalid JSON',
        description: 'Please provide a valid JSON string',
        variant: 'destructive',
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!topic || !message) {
      toast({
        title: 'Validation Error',
        description: 'Please fill in all required fields',
        variant: 'destructive',
      });
      return;
    }

    // Check if credentials are provided when needed
    if (
      (securityProtocol === 'SASL_PLAINTEXT' ||
        securityProtocol === 'SASL_SSL') &&
      (!username || !password)
    ) {
      toast({
        title: 'Authentication Error',
        description:
          'Username and password are required for SASL authentication',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);

    try {
      await axios.post(
        'http://localhost:4321/api/produce-kafka-message/produce-message',
        {
          brokers: kafkaServer,
          securityProtocol,
          ...(showAuthFields && { username, password }),
          topic,
          message,
        }
      );
      toast({
        title: 'Message Sent',
        description: 'Your message has been successfully sent to Kafka',
        variant: 'default',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to send message',
        variant: 'destructive',
      });
      return;
    } finally {
      setIsLoading(false);
    }
  };

  // Show authentication fields only for SASL protocols
  const showAuthFields =
    securityProtocol === 'SASL_PLAINTEXT' || securityProtocol === 'SASL_SSL';

  return (
    <div className='max-w-4xl mx-auto p-6'>
      <Button variant='outline' onClick={() => navigate('/')} className='mb-6'>
        ← Back to Tools
      </Button>

      <div className='flex items-center gap-3 mb-8'>
        <div className='text-4xl'>{tool.icon}</div>
        <div>
          <h1 className='text-3xl font-bold'>{tool.name}</h1>
          <p className='text-gray-600'>{tool.description}</p>
        </div>
      </div>

      <div className='border p-6 rounded-md bg-white shadow-sm'>
        <form onSubmit={handleSubmit} className='space-y-6'>
          <div className='space-y-2'>
            <Label htmlFor='kafka-server'>Kafka Server</Label>
            <div className='flex gap-2'>
              <Input
                id='kafka-server'
                value={kafkaServer}
                onChange={(e) => setKafkaServer(e.target.value)}
                placeholder='localhost:9092'
                className='flex-1'
              />
              <Button
                type='button'
                variant='outline'
                onClick={handleTestConnection}
                disabled={isTesting}
                className='whitespace-nowrap'
              >
                {isTesting ? 'Testing...' : 'Test Connection'}
              </Button>
            </div>
          </div>

          <div className='space-y-2'>
            <Label htmlFor='security-protocol'>Security Protocol</Label>
            <Select
              value={securityProtocol}
              onValueChange={setSecurityProtocol}
            >
              <SelectTrigger id='security-protocol'>
                <SelectValue placeholder='Select protocol' />
              </SelectTrigger>
              <SelectContent>
                {[
                  'PLAINTEXT (No encryption)',
                  'SSL (Encryption without authentication)',
                  'SASL_PLAINTEXT (Authentication without encryption)',
                  'SASL_SSL (Authentication with encryption)',
                ].map((securityProtocol) => (
                  <SelectItem
                    key={securityProtocol}
                    value={securityProtocol.split(' ')[0]}
                  >
                    {securityProtocol}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {showAuthFields && (
            <>
              <div className='space-y-2'>
                <Label htmlFor='username'>Username</Label>
                <Input
                  id='username'
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder='Kafka username'
                />
              </div>

              <div className='space-y-2'>
                <Label htmlFor='password'>Password</Label>
                <Input
                  id='password'
                  type='password'
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder='Kafka password'
                />
              </div>
            </>
          )}

          <div className='space-y-2'>
            <Label htmlFor='topic'>Topic Name *</Label>
            <Select
              value={topic}
              onValueChange={setTopic}
              disabled={!isConnected}
            >
              <SelectTrigger id='topic'>
                <SelectValue placeholder='Select a topic' />
              </SelectTrigger>
              <SelectContent>
                {topics.length > 0 ? (
                  topics.map((topicName, i) => (
                    <SelectItem key={i} value={topicName}>
                      {topicName}
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem value='no-topics-available' disabled>
                    No topics available
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
            {!isConnected && (
              <p className='text-sm text-amber-600'>
                Connect to Kafka to view available topics
              </p>
            )}
          </div>

          <div className='space-y-2'>
            <div className='flex justify-between items-center'>
              <Label htmlFor='message'>Message Payload (JSON) *</Label>
              <Button
                type='button'
                variant='outline'
                size='sm'
                onClick={formatJson}
                disabled={!message.trim() || !isConnected}
                className='text-xs'
              >
                Format JSON
              </Button>
            </div>
            <Textarea
              id='message'
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder='{"key": "value"}'
              className='min-h-[150px] font-mono'
              required
              disabled={!isConnected}
            />
            {!isConnected && (
              <p className='text-sm text-amber-600'>
                Connect to Kafka first to send messages
              </p>
            )}
          </div>

          <Button
            type='submit'
            className='w-full bg-green-600 hover:bg-green-700'
            disabled={isLoading || !isConnected}
          >
            {isLoading ? 'Sending...' : 'Send Message'}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ProduceKafkaMessage;
