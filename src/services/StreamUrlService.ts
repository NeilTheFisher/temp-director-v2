const axios = require("axios");
import { Repository, Like } from "typeorm"
import { AppDataSource } from "../data-source"
import { StreamUrl } from "../entity/StreamUrl"
import { User } from "../entity/User"
import { Stream } from "../entity/Stream"
import { Setting } from "../entity/Setting"
import { concatenateAndConvertToHex, parseDomainDetails, getPhoneDetails } from "../utils/utils"
import { SettingService } from "./SettingService"
import { MccMnc } from "../entity/MccMnc";
import { StreamUrlToken } from "../entity/StreamUrlToken";
import { DiscoveryLogs } from "../entity/DiscoveryLogs";
import { AwsAuthotizationService } from "./AwsAuthorizationService";
import RedisService from "./RedisService";


export class StreamUrlService {
  private streamUrlRepository: Repository<StreamUrl>
  private streamUrlTokenRepository: Repository<StreamUrlToken>
  private discoveryLogsRepository: Repository<DiscoveryLogs>
  private userRepository: Repository<User>
  private mccMncRepository: Repository<MccMnc>
  private redisService = RedisService.getInstance()
  private redisClient = this.redisService.getClient()

  constructor() {
    this.streamUrlRepository = AppDataSource.getRepository(StreamUrl)
    this.streamUrlTokenRepository = AppDataSource.getRepository(StreamUrlToken)
    this.userRepository = AppDataSource.getRepository(User)
    this.mccMncRepository = AppDataSource.getRepository(MccMnc)
    this.discoveryLogsRepository = AppDataSource.getRepository(DiscoveryLogs)
  }

  async getStreamUrls(streamUrlId: number, userId: number, ip: string, maxResults: number = 10): Promise<any>
  {
    console.log({streamUrlId: streamUrlId, userId: userId, ip: ip, maxResults: maxResults})
    const urlsWithTokens: { url: string; description: string }[] = [];
    const finalUrls: any = [];
    let mcc = 0;
    let mnc = 0;
    let error: string = "";
    let description: string = "";
    let country: string = "N/A";
    let city: string = "N/A";
    let mobileUser = {mcc: 0, mnc: 0, city: "", error: "", country: country};
    try {
        const token = concatenateAndConvertToHex(6, String(userId));
        const streamUrl = await this.streamUrlRepository.findOne({
          where: { id: streamUrlId },
          relations: ["stream"]
        });
        if(streamUrl)
        {
          const user = await this.userRepository.findOne({
            where: { id: userId }
          });
          if(user)
          {
            if(user.type === "user")
            {
              const urls = [];
              const currentDomain =  parseDomainDetails(streamUrl.url).currentDomain;
              console.log('currentDomain', currentDomain)
              const settingService = new SettingService()
              const edgeDiscoverySetting = await settingService.getModelSetting(Setting.EDGE_DISCOVERY, String(streamUrl.stream.id), Stream.CLASS_NAME, "on");
              if(edgeDiscoverySetting === "on")
              {
                const countryCode  = getPhoneDetails(user.msisdn)?.countryCode || 0;
                const phoneIso  = getPhoneDetails(user.msisdn)?.regionCode || 'CA';
                if(ip != "")
                {
                  mobileUser = await this.getMobileUserInfo(ip);
                  console.log('mobileUser', mobileUser)
                  error = mobileUser.error
                  mcc = mobileUser.mcc
                  mnc = mobileUser.mnc
                  country = mobileUser.country
                  city = mobileUser.city
                }
                const mccMncUrl = await this.getMccMncRulesUrl(mcc, mnc, user.msisdn, city, countryCode, phoneIso)
                console.log('mccMncUrl', mccMncUrl)
                const mccMncDomain = mccMncUrl.url
                description = mccMncUrl.description
                if(mccMncDomain != "")
                {
                  urls.push({url: streamUrl.url.replace(currentDomain, mccMncDomain), description: description})
                }else if(ip !== "" && mccMncDomain === "")
                {
                  const proteusId = process.env.PROTEUS_IAM_ACCESS_KEY_ID ?? ""
                  const proteusKey = process.env.PROTEUS_IAM_SECRET_ACCESS_KEY ?? ""
                  if(proteusId != "" && proteusKey != "")
                  {
                    const proteusResult = await (new AwsAuthotizationService(ip)).getAggregatorUrls(maxResults)
                    Object.values(proteusResult.urls).forEach(function(result: any){
                      urls.push({url: streamUrl.url.replace(currentDomain, result.url), description: result.description})
                    })
                  }
                }
                if(urls.length === 0)
                {
                  urls.push({
                    url: (mccMncDomain === "") ? streamUrl.url : streamUrl.url.replace(currentDomain, mccMncDomain),
                    description: "Edge discovery not possible or yielded no URLs"})
                }
              }
              else
              {
                urls.push({
                  url: streamUrl.url,
                  description: "Edge discovery for the stream is off"})
              }
              console.log('urls', urls)
              for (const urlObject of Object.values(urls)) {
                let url = urlObject.url + "?key=" + token + "&userId=" + userId;
                const streamUrlToken = await this.streamUrlTokenRepository.findOne({
                  where: {
                    userId: userId,
                    url: Like(`%${url}%`),
                  },
                  order: {
                    date: "DESC",
                  },
                });

                if(streamUrlToken)
                {
                  const isExpired = (Date.now() / 1000 - streamUrlToken.date) >= StreamUrlToken.EXPIRATION_INTERVAL;
                  if(!isExpired)
                  {
                    url = streamUrlToken.url
                  }
                  else
                  {
                    await this.streamUrlTokenRepository.remove(streamUrlToken)
                    const newStreamTokenUrl = await this.streamUrlTokenRepository.create({url: url, token: token, date: Math.floor(Date.now() / 1000), userId: userId})
                    await this.streamUrlTokenRepository.save(newStreamTokenUrl);

                  }
                }
                else
                {
                  const newStreamTokenUrl = await this.streamUrlTokenRepository.create({url: url, token: token, date: Math.floor(Date.now() / 1000), userId: userId})
                  await this.streamUrlTokenRepository.save(newStreamTokenUrl);
                }
                urlsWithTokens.push({url: url, description: urlObject.description})
              }
              const streams = [];
              const descriptions = [];
              console.log('urlsWithTokens: ', urlsWithTokens)
              for (const urlWithToken of Object.values(urlsWithTokens))
              {
                streams.push(urlWithToken.url)
                descriptions.push(urlWithToken.description)
              }
              //TOFO redis stuff
              const joinedStreams = streams.join(",");
              const discoveryLog = await this.discoveryLogsRepository.create({
                msisdn: user.msisdn,
                ip: ip,
                streamUrl: joinedStreams.length > 190 ? joinedStreams.slice(0, 190) : joinedStreams,
                mcc: mcc,
                mnc: mnc,
                country: country,
                mobile: !(mcc === 0 && mnc === 0),
                timestamp:  Math.floor(Date.now() / 1000),
                description: (error === "") ? descriptions.join(",") : "live: "+ (streamUrl.stream.recordedType === 0 ? "true " : "false") + "error: "+error
              });
              await this.discoveryLogsRepository.save(discoveryLog);
            }
          }
          else
          {
            urlsWithTokens.push({url: streamUrl?.url, description: "Not a user, use default URL"});
          }
        }
        else
        {
          error = "stream URL not found";
        }
     }
    catch (error: any) {
      console.log(error)
      error = error.message;
    }
    for (const streamUrl of Object.values(urlsWithTokens))
    {
      const domain = process.env.DIRECTOR_PUBLIC_IP ?? "";
      finalUrls.push(streamUrl.url+"&domain="+domain)
    }
    return {
      urls: finalUrls,
      error: error
    };
  }

  async getMobileUserInfo(ip: string)
  {
    let mcc = 0;
    let mnc = 0;
    let city = "";
    let country = "";
    let error = "";
    const cacheKey =  `mobileUserInfo:${ip}`;
    const cacheTTL = 15 * 60 * 1000;
    try
    {
      const cachedData = await this.redisClient.get(cacheKey);
      if (cachedData) {
        console.log(`Cache hit for IP: ${ip}`);
        const parsedData = JSON.parse(cachedData);
        return {
          mcc: parsedData.mcc,
          mnc: parsedData.mnc,
          city: parsedData.city,
          country: parsedData.country,
          error: "",
        };
      }

      const mccMncUserInfo = await this.checkIpMccMnc(ip)
      mcc = mccMncUserInfo.mcc
      mnc = mccMncUserInfo.mnc
      city = mccMncUserInfo.city
      country = mccMncUserInfo.country
      error = mccMncUserInfo.error

      // Update the cache
      await this.redisClient.set(cacheKey,  JSON.stringify({ mcc: mcc, mnc: mnc, city: city, country: country}),  { EX: cacheTTL });
    }
    catch(error: any)
    {
      error = error.message;
      console.error(error);
    }
    return {mcc: mcc, mnc: mnc, city: city, country: country, error: error}
  }

  async checkIpMccMnc(ip: string)
  {
    const cacheKey =  `mccMncIpInfo:${ip}`;
    const cacheTTL = 15 * 60 * 1000;
    let mcc = 0;
    let mnc = 0;
    let city = "N/A";
    let country = "N/A";
    let error = "";
    try
    {
      const cachedData = await this.redisClient.get(cacheKey);
      if (cachedData) {
        console.log(`Cache hit for IP: ${ip}`);
        const parsedData = JSON.parse(cachedData);
        return {
          mcc: parsedData.mcc,
          mnc: parsedData.mnc,
          city: parsedData.city,
          country: parsedData.country,
          error: "",
        };
      }
      const usernamePassword = process.env.WLZ_BELL_PASSWORD ?? ""
      const authHeader = 'Basic ' + Buffer.from(usernamePassword).toString('base64');
      const response = await axios.get(`https://geoip.maxmind.com/geoip/v2.1/city/${ip}`, {
        headers: {
          'Authorization': authHeader,
          'Content-Type': 'application/json',
        },
  });
     const data = response.data;
      if (data.traits && data.traits.mobile_country_code) {
        mcc = data.traits.mobile_country_code;
        mnc = data.traits.mobile_network_code || 0;
      }

      if (data.city && data.city.names && data.city.names.en) {
        city = data.city.names.en.toLowerCase();
      }

      if (data.country && data.country.names && data.country.names.en) {
        country = data.country.names.en.toLowerCase();
      }
      await this.redisClient.set(cacheKey,  JSON.stringify({ mcc: mcc, mnc: mnc, city: city, country: country}),  { EX: cacheTTL });
    }
    catch(error: any)
    {
      error = error.message;
      console.error("checkIpMccMnc: "+ error);
    }
    return {
      mcc: mcc,
      mnc: mnc,
      city: city,
      country: country,
      error: error
    };
  }

  async getMccMncRulesUrl(mcc: number = 0, mnc: number = 0, msisdn: string = '', city: string = "", countryCode: number = 0, regionCode: string = "")
  {
    let rules: any = {static: "", city: "", msisdn: ""};
    let result = {
      url: '',
      description: `No Rule was matched to the msisdn: ${msisdn}`,
    };
    const strCountryCode = String(countryCode);
    const strRegionCode = regionCode.toLowerCase();
    const strCity = city.toLowerCase();
    try {
      // Fetch MCC/MNC-specific rules from the database
      const mccMncData = await this.mccMncRepository.findOne({
        where: { mcc: mcc, mnc: mnc }
      })

      if (mccMncData) {
        rules = JSON.parse(mccMncData.rules || '{}');
      }

      const networkType = mcc === 0 && mnc === 0 ? 'wifi' : 'mobile';
      const msisdnRules = rules.msisdn || {};
      const cityRules = rules.city || {};
      const countryCodeRules = rules.country_code || {};
      const regionCodeRules = countryCodeRules[strCountryCode]?.region || {};

      // Process MSISDN-specific rules
      if (msisdn in msisdnRules) {
        const msisdnRule = msisdnRules[msisdn];
        if (msisdnRule.url) {
          result.url = msisdnRule.url;
          result.description = `Msisdn specific ${networkType} rule for msisdn: ${msisdn} was applied`;
          return result;
        } else if (msisdnRule.city && msisdnRule.city[strCity]?.url) {
          result.url = msisdnRule.city[strCity].url;
          result.description = `Msisdn specific ${networkType} rule for msisdn: ${msisdn} for a city ${strCity} was applied`;
          return result;
        }
      }

      // Process city-specific rules
      if (city in cityRules && cityRules[city].url) {
        result.url = cityRules[city].url;
        result.description = `${networkType.charAt(0).toUpperCase() + networkType.slice(1)} rule for city: ${city} and msisdn: ${msisdn} was applied`;
        return result;
      }

      // Process country and region-specific rules
      if (
        strCountryCode in countryCodeRules &&
        strRegionCode in regionCodeRules &&
        regionCodeRules[strRegionCode]?.url
      ) {
        result.url = regionCodeRules[strRegionCode].url;
        result.description = `${networkType.charAt(0).toUpperCase() + networkType.slice(1)} rule for country code: ${strCountryCode} and region: ${strRegionCode} and msisdn: ${msisdn} was applied`;
        return result;
      }

      // Apply general static rule if available
      if (rules.static) {
        result.url = rules.static;
        result.description = `General static rule for msisdn: ${msisdn} was applied`;
        return result;
      }
    } catch (error: any) {
      console.error('Error in getMccMncRulesUrl:', error.message);
    }
    return result;
  }
}
