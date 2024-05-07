import { S3 } from "@aws-sdk/client-s3"
export class S3Service {
  private config = {
    "credentials": {
      "accessKeyId": process.env.AWS_ACCESS_KEY_ID ?? "",
      "secretAccessKey": process.env.AWS_SECRET_ACCESS_KEY ?? "",
    },
    "region": process.env.AWS_DEFAULT_REGION ?? "ca-central-1",
    "endpoint": process.env.AWS_ENDPOINT ?? "",
    "sslEnabled": true,
    "s3ForcePathStyle" : process.env.AWS_USE_PATH_STYLE_ENDPOINT === "true",
  }
  private s3Client: S3
  private bucket: string = process.env.AWS_BUCKET ?? ""
  constructor() {
    this.s3Client = new S3(this.config)
  }

  async getAllItemsInFolder(folderPrefix: string): Promise<string[]> {
    try {
      const response = await this.s3Client.listObjects({Bucket: this.bucket, Prefix: folderPrefix })
      const keys = response.Contents?.map(object => object.Key).filter((key): key is string => typeof key === "string") ?? []
      return keys
    } catch (error) {
      console.error("Error retrieving items from S3 folder:", error)
      throw error
    }
  }

  getUrlFromPath(pathname: string) {
    const baseUrl = process.env.AWS_URL ?? ""
    // Ensure base URL ends with a trailing slash
    const baseUrlWithTrailingSlash = baseUrl.endsWith("/") ? baseUrl : baseUrl + "/"
    // Ensure path name doesn't start with a leading slash
    const trimmedPathname = pathname.startsWith("/") ? pathname.slice(1) : pathname
    const fullUrl = baseUrlWithTrailingSlash + trimmedPathname
    return fullUrl
  }
}
