import { createClient } from "redis";

class RedisService {
  private static instance: RedisService; // Singleton instance
  private client;

  private constructor() {
    const redisSocketAddress = process.env.REDIS_SOCKET_ADDRESS || "127.0.0.1:6379";
    const redisDatabase = String(process.env.REDIS_DATABASE || 0);

    console.log(`Connecting to Redis at ${redisSocketAddress}, Database: ${redisDatabase}`);

    this.client = createClient({
      url: `redis://${redisSocketAddress}`,
      database: parseInt(redisDatabase, 10),
    });

    // Attach event listeners
    this.client.on("connect", () => {
      console.log("Redis client connected");
    });

    this.client.on("ready", () => {
      console.log("Redis client is ready");
    });

    this.client.on("error", (err: any) => {
      console.error("Redis error:", err);
    });

    this.client.on("end", () => {
      console.warn("Redis connection closed");
    });
  }

  // Ensure only one instance exists
  public static getInstance(): RedisService {
    if (!RedisService.instance) {
      RedisService.instance = new RedisService();
    }
    return RedisService.instance;
  }

  // Establish connection
  private async connect() {
    try {
      await this.client.connect();
    } catch (err) {
      console.error("Error connecting to Redis:", err);
    }
  }

  // Get the Redis client
  public getClient() {
    return this.client;
  }

  // Gracefully disconnect the Redis client
  public async disconnect() {
    try {
      await this.client.quit();
      console.log("Redis client disconnected");
    } catch (err) {
      console.error("Error disconnecting from Redis:", err);
    }
  }
}

export default RedisService;
