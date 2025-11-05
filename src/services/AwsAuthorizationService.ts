import RedisService from "./RedisService"

const crypto = require("crypto")
const axios = require("axios")
const dns = require("dns").promises
const { EC2Client, DescribeAvailabilityZonesCommand } = require("@aws-sdk/client-ec2")

export class AwsAuthotizationService {
  private awsAccessKeyId = ""
  private awsSecretAccessKey = ""
  private region = ""
  private uri = ""
  private service = ""
  private host = ""
  private ip = ""
  private redisService = RedisService.getInstance()
  private redisClient = this.redisService.getClient()

  constructor(ip: string) {
    this.ip = ip
    this.awsAccessKeyId = process.env.PROTEUS_IAM_ACCESS_KEY_ID ?? ""
    this.awsSecretAccessKey = process.env.PROTEUS_IAM_SECRET_ACCESS_KEY ?? ""
    this.region = process.env.PROTEUS_IAM_DEFAULT_REGION ?? "us-east-1"
    this.service = process.env.PROTEUS_SERVICE ?? "proteus-preprod"
    this.host = process.env.PROTEUS_HOST ?? "discovery.us-east-1.gamma.proteus.ec2.aws.dev"
    this.uri = process.env.PROTEUS_URI ?? "/discover-zones"
  }

  getAuthorizationHeader() {
    const algorithm = "AWS4-HMAC-SHA256"
    const method = "POST"
    const canonicalQueryString = ""

    // Generate timestamps
    const now = new Date()
    const amzDate = now.toISOString().replace(/[:-]|\.\d{3}/g, "") // e.g., 20250127T123456Z
    const dateStamp = amzDate.slice(0, 8) // e.g., 20250127

    // Prepare payload
    const payloadString = JSON.stringify({clientIp: this.ip}) || ""
    const hashedPayload = crypto.createHash("sha256").update(payloadString).digest("hex")

    // Prepare canonical request
    const canonicalHeaders = `host:${this.host}\n` + `x-amz-date:${amzDate}\n`
    const signedHeaders = "host;x-amz-date"
    const canonicalRequest = [
      method,
      this.uri,
      canonicalQueryString,
      canonicalHeaders,
      signedHeaders,
      hashedPayload,
    ].join("\n")

    // Scope
    const credentialScope = `${dateStamp}/${this.region}/${this.service}/aws4_request`

    // String to sign
    const stringToSign = [
      algorithm,
      amzDate,
      credentialScope,
      crypto.createHash("sha256").update(canonicalRequest).digest("hex"),
    ].join("\n")

    // Calculate signature
    const kSecret = `AWS4${this.awsSecretAccessKey}`
    const kDate = crypto.createHmac("sha256", kSecret).update(dateStamp).digest()
    const kRegion = crypto.createHmac("sha256", kDate).update(this.region).digest()
    const kService = crypto.createHmac("sha256", kRegion).update(this.service).digest()
    const kSigning = crypto.createHmac("sha256", kService).update("aws4_request").digest()
    const signature = crypto.createHmac("sha256", kSigning).update(stringToSign).digest("hex")

    // Authorization header
    return `${algorithm} Credential=${this.awsAccessKeyId}/${credentialScope}, SignedHeaders=${signedHeaders}, Signature=${signature}`
  }

  async getAggregatorUrls(maxResults: number) {
    let error = ""
    const cacheKey = "aggregatorUrls"
    const cacheTTL = 15 * 60 * 1000 // 15 minutes in milliseconds
    try {
      const cachedData = await this.redisClient.get(cacheKey)
      if (cachedData) {
        console.log("Cache hit for aggregator URLs")
        return JSON.parse(cachedData) // Return cached data
      }
      console.log("Cache miss for aggregator URLs")

      const rawDate = new Date().toISOString()
      const amzDate = rawDate.replace(/[:-]|\.\d{3}/g, "")
      const url = `https://${this.host}${this.uri}`
      const authorizationHeader = this.getAuthorizationHeader()
      const headers = {
        "Accept-Encoding": "identity",
        "User-Agent": "aws-cli/2.2.35 Python/3.8.8 Linux/5.12.14-200.fc33.x86_64 exe/x86_64.fedora.33 prompt/off command/proteus.discover-zones",
        "X-Amz-Date": amzDate,
        Authorization: authorizationHeader,
      }

      // Send the HTTP request
      const response = await axios.post(url, JSON.stringify({clientIp: this.ip}), {
        headers,
        timeout: 10000, // Timeout in milliseconds
      })
      // Process the response
      const data =  await this.getAvailableZoneUrls(response.data || "", maxResults)
      await this.redisClient.set(cacheKey, JSON.stringify(data),  { EX: cacheTTL })
      return data

    } catch (err: any) {
      error += " " + err.message
      console.error("Error in getAggregatorUrls:", error)
    }

    return { urls: [], error }
  }

  async getAvailableZoneUrls(response: any, maxResults: number) {
    const results = []
    let error = ""
    const directorSocketAddress = process.env.DIRECTOR_PUBLIC_IP || "default-ip" // Replace with your config logic

    try {
      if (response) {
        const parsedResponse = typeof response === "string" ? JSON.parse(response) : response

        if (Array.isArray(parsedResponse?.zones)) {
          for (const zone of parsedResponse.zones) {
            if (results.length >= maxResults) break

            const zoneIds = zone.zoneIds || []
            const zoneRegion = zone.regionName || "DEFAULT_REGION"
            const zoneType = zone.zoneType || ""

            if (zoneType === "availability-zone" || zoneType === "wavelength-zone") {
              for (const zoneId of zoneIds) {
                if (results.length >= maxResults) break

                const zoneName = await this.getAvailabilityZonesNameById(zoneRegion, zoneId, zoneType)
                if (zoneName) {
                  const urlEnding = directorSocketAddress.includes("eu") ? "de" : "org"
                  const recordName = `agg.${zoneName}.odience.${urlEnding}`

                  try {
                    const dnsRecords = await dns.resolve(recordName)
                    if (dnsRecords.length > 0) {
                      const url = `agg.${zoneName}.odience.${urlEnding}`
                      const description = `Proteus rule was matched with the zone name: ${zoneName}`
                      results.push({ url: url, description: description })
                    }
                  } catch (dnsError: any) {
                    console.warn(`DNS resolution failed for ${recordName}:`, dnsError.message)
                  }
                }
              }
            }
          }
        }
      }
    } catch (err: any) {
      error += " " + err.message
      console.error("Error in getAvailableZoneUrls:", error)
    }

    return { urls: results, error }
  }

  async getAvailabilityZonesNameById(region: string, zoneId: string, zoneType: string) {
    try {
      const cacheTTL = 60 * 60 * 1000 // 15 minutes in milliseconds
      const cacheKey = `${region}:${zoneId}:${zoneType}`

      // Check the cache first
      const cachedData =  await this.redisClient.get(cacheKey)

      // Cache validity period (e.g., 1 hour)
      if (cachedData) {
        console.log(`Cache hit for zone: ${cacheKey}`)
        const parsedData = JSON.parse(cachedData)
        return parsedData.zoneName
      }

      let zoneName = ""
      if (zoneType === "availability-zone") {
        // Initialize EC2 client
        const ec2Client = new EC2Client({
          region,
          credentials: {
            accessKeyId: this.awsAccessKeyId,
            secretAccessKey: this.awsSecretAccessKey,
          },
        })

        // Describe availability zones
        const command = new DescribeAvailabilityZonesCommand({ ZoneIds: [zoneId] })
        const result = await ec2Client.send(command)

        zoneName = result.AvailabilityZones?.[0]?.ZoneName || ""
      } else if (zoneType === "wavelength-zone") {
        // Parse zone name from wavelength zone ID
        const parts = zoneId.split("wl1-")
        if (parts.length > 1) {
          zoneName = parts.pop() || "" // Take the last part
        }
      }

      if (zoneName) {
        await this.redisClient.set(cacheKey, JSON.stringify({zoneName: zoneName}),  { EX: cacheTTL })
      }

      return zoneName || ""
    }
    catch (error: any) {
      console.error("Error in getAvailabilityZonesNameById:", error.message)
      return ""
    }
  }
}
