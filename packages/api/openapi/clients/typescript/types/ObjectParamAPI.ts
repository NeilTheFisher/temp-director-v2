import { ResponseContext, RequestContext, HttpFile, HttpInfo } from '../http/http';
import { Configuration, ConfigurationOptions } from '../configuration'
import type { Middleware } from '../middleware';

import { EventsListEvents200Response } from '../models/EventsListEvents200Response';
import { EventsListEventsLive200Response } from '../models/EventsListEventsLive200Response';
import { EventsListEventsLive200ResponseOneOf } from '../models/EventsListEventsLive200ResponseOneOf';
import { EventsListEventsLive200ResponseOneOf1 } from '../models/EventsListEventsLive200ResponseOneOf1';
import { EventsListEventsLive200ResponseOneOfData } from '../models/EventsListEventsLive200ResponseOneOfData';
import { HealthLiveOk200Response } from '../models/HealthLiveOk200Response';
import { HealthLiveOk200ResponseOneOf } from '../models/HealthLiveOk200ResponseOneOf';
import { HealthLiveOk200ResponseOneOf1 } from '../models/HealthLiveOk200ResponseOneOf1';
import { OdienceProvisionUser200Response } from '../models/OdienceProvisionUser200Response';
import { OdienceProvisionUserRequest } from '../models/OdienceProvisionUserRequest';
import { OdienceValidatePhoneNumber200Response } from '../models/OdienceValidatePhoneNumber200Response';
import { OdienceValidatePhoneNumberRequest } from '../models/OdienceValidatePhoneNumberRequest';
import { StreamGetStreamUrls200Response } from '../models/StreamGetStreamUrls200Response';
import { StreamGetStreamUrlsRequest } from '../models/StreamGetStreamUrlsRequest';
import { UserGetUserInfo200Response } from '../models/UserGetUserInfo200Response';
import { UserGetUserInfoByMsisdnRequest } from '../models/UserGetUserInfoByMsisdnRequest';

import { ObservableDefaultApi } from "./ObservableAPI";
import { DefaultApiRequestFactory, DefaultApiResponseProcessor} from "../apis/DefaultApi";

export interface DefaultApiEventsListEventsRequest {
    /**
     * 
     * @type any
     * @memberof DefaultApieventsListEvents
     */
    body?: any
}

export interface DefaultApiEventsListEventsLiveRequest {
    /**
     * 
     * @type any
     * @memberof DefaultApieventsListEventsLive
     */
    body?: any
}

export interface DefaultApiEventsListPartialEventsRequest {
    /**
     * 
     * @type any
     * @memberof DefaultApieventsListPartialEvents
     */
    body?: any
}

export interface DefaultApiHealthLiveOkRequest {
    /**
     * 
     * Defaults to: undefined
     * @type number
     * @memberof DefaultApihealthLiveOk
     */
    maxOutputs?: number
}

export interface DefaultApiHealthOkRequest {
}

export interface DefaultApiOdienceGetCategoryListRequest {
}

export interface DefaultApiOdienceProvisionUserRequest {
    /**
     * 
     * @type OdienceProvisionUserRequest
     * @memberof DefaultApiodienceProvisionUser
     */
    odienceProvisionUserRequest: OdienceProvisionUserRequest
}

export interface DefaultApiOdienceValidatePhoneNumberRequest {
    /**
     * 
     * @type OdienceValidatePhoneNumberRequest
     * @memberof DefaultApiodienceValidatePhoneNumber
     */
    odienceValidatePhoneNumberRequest: OdienceValidatePhoneNumberRequest
}

export interface DefaultApiStreamGetStreamUrlsRequest {
    /**
     * 
     * @type StreamGetStreamUrlsRequest
     * @memberof DefaultApistreamGetStreamUrls
     */
    streamGetStreamUrlsRequest: StreamGetStreamUrlsRequest
}

export interface DefaultApiUserGetUserInfoRequest {
    /**
     * 
     * @type any
     * @memberof DefaultApiuserGetUserInfo
     */
    body: any
}

export interface DefaultApiUserGetUserInfoByMsisdnRequest {
    /**
     * 
     * @type UserGetUserInfoByMsisdnRequest
     * @memberof DefaultApiuserGetUserInfoByMsisdn
     */
    userGetUserInfoByMsisdnRequest: UserGetUserInfoByMsisdnRequest
}

export class ObjectDefaultApi {
    private api: ObservableDefaultApi

    public constructor(configuration: Configuration, requestFactory?: DefaultApiRequestFactory, responseProcessor?: DefaultApiResponseProcessor) {
        this.api = new ObservableDefaultApi(configuration, requestFactory, responseProcessor);
    }

    /**
     * @param param the request object
     */
    public eventsListEventsWithHttpInfo(param: DefaultApiEventsListEventsRequest = {}, options?: ConfigurationOptions): Promise<HttpInfo<EventsListEvents200Response>> {
        return this.api.eventsListEventsWithHttpInfo(param.body,  options).toPromise();
    }

    /**
     * @param param the request object
     */
    public eventsListEvents(param: DefaultApiEventsListEventsRequest = {}, options?: ConfigurationOptions): Promise<EventsListEvents200Response> {
        return this.api.eventsListEvents(param.body,  options).toPromise();
    }

    /**
     * @param param the request object
     */
    public eventsListEventsLiveWithHttpInfo(param: DefaultApiEventsListEventsLiveRequest = {}, options?: ConfigurationOptions): Promise<HttpInfo<EventsListEventsLive200Response>> {
        return this.api.eventsListEventsLiveWithHttpInfo(param.body,  options).toPromise();
    }

    /**
     * @param param the request object
     */
    public eventsListEventsLive(param: DefaultApiEventsListEventsLiveRequest = {}, options?: ConfigurationOptions): Promise<EventsListEventsLive200Response> {
        return this.api.eventsListEventsLive(param.body,  options).toPromise();
    }

    /**
     * @param param the request object
     */
    public eventsListPartialEventsWithHttpInfo(param: DefaultApiEventsListPartialEventsRequest = {}, options?: ConfigurationOptions): Promise<HttpInfo<EventsListEvents200Response>> {
        return this.api.eventsListPartialEventsWithHttpInfo(param.body,  options).toPromise();
    }

    /**
     * @param param the request object
     */
    public eventsListPartialEvents(param: DefaultApiEventsListPartialEventsRequest = {}, options?: ConfigurationOptions): Promise<EventsListEvents200Response> {
        return this.api.eventsListPartialEvents(param.body,  options).toPromise();
    }

    /**
     * @param param the request object
     */
    public healthLiveOkWithHttpInfo(param: DefaultApiHealthLiveOkRequest = {}, options?: ConfigurationOptions): Promise<HttpInfo<HealthLiveOk200Response>> {
        return this.api.healthLiveOkWithHttpInfo(param.maxOutputs,  options).toPromise();
    }

    /**
     * @param param the request object
     */
    public healthLiveOk(param: DefaultApiHealthLiveOkRequest = {}, options?: ConfigurationOptions): Promise<HealthLiveOk200Response> {
        return this.api.healthLiveOk(param.maxOutputs,  options).toPromise();
    }

    /**
     * @param param the request object
     */
    public healthOkWithHttpInfo(param: DefaultApiHealthOkRequest = {}, options?: ConfigurationOptions): Promise<HttpInfo<string>> {
        return this.api.healthOkWithHttpInfo( options).toPromise();
    }

    /**
     * @param param the request object
     */
    public healthOk(param: DefaultApiHealthOkRequest = {}, options?: ConfigurationOptions): Promise<string> {
        return this.api.healthOk( options).toPromise();
    }

    /**
     * @param param the request object
     */
    public odienceGetCategoryListWithHttpInfo(param: DefaultApiOdienceGetCategoryListRequest = {}, options?: ConfigurationOptions): Promise<HttpInfo<{ [key: string]: string | null; }>> {
        return this.api.odienceGetCategoryListWithHttpInfo( options).toPromise();
    }

    /**
     * @param param the request object
     */
    public odienceGetCategoryList(param: DefaultApiOdienceGetCategoryListRequest = {}, options?: ConfigurationOptions): Promise<{ [key: string]: string | null; }> {
        return this.api.odienceGetCategoryList( options).toPromise();
    }

    /**
     * @param param the request object
     */
    public odienceProvisionUserWithHttpInfo(param: DefaultApiOdienceProvisionUserRequest, options?: ConfigurationOptions): Promise<HttpInfo<OdienceProvisionUser200Response>> {
        return this.api.odienceProvisionUserWithHttpInfo(param.odienceProvisionUserRequest,  options).toPromise();
    }

    /**
     * @param param the request object
     */
    public odienceProvisionUser(param: DefaultApiOdienceProvisionUserRequest, options?: ConfigurationOptions): Promise<OdienceProvisionUser200Response> {
        return this.api.odienceProvisionUser(param.odienceProvisionUserRequest,  options).toPromise();
    }

    /**
     * @param param the request object
     */
    public odienceValidatePhoneNumberWithHttpInfo(param: DefaultApiOdienceValidatePhoneNumberRequest, options?: ConfigurationOptions): Promise<HttpInfo<OdienceValidatePhoneNumber200Response>> {
        return this.api.odienceValidatePhoneNumberWithHttpInfo(param.odienceValidatePhoneNumberRequest,  options).toPromise();
    }

    /**
     * @param param the request object
     */
    public odienceValidatePhoneNumber(param: DefaultApiOdienceValidatePhoneNumberRequest, options?: ConfigurationOptions): Promise<OdienceValidatePhoneNumber200Response> {
        return this.api.odienceValidatePhoneNumber(param.odienceValidatePhoneNumberRequest,  options).toPromise();
    }

    /**
     * @param param the request object
     */
    public streamGetStreamUrlsWithHttpInfo(param: DefaultApiStreamGetStreamUrlsRequest, options?: ConfigurationOptions): Promise<HttpInfo<StreamGetStreamUrls200Response>> {
        return this.api.streamGetStreamUrlsWithHttpInfo(param.streamGetStreamUrlsRequest,  options).toPromise();
    }

    /**
     * @param param the request object
     */
    public streamGetStreamUrls(param: DefaultApiStreamGetStreamUrlsRequest, options?: ConfigurationOptions): Promise<StreamGetStreamUrls200Response> {
        return this.api.streamGetStreamUrls(param.streamGetStreamUrlsRequest,  options).toPromise();
    }

    /**
     * @param param the request object
     */
    public userGetUserInfoWithHttpInfo(param: DefaultApiUserGetUserInfoRequest, options?: ConfigurationOptions): Promise<HttpInfo<UserGetUserInfo200Response>> {
        return this.api.userGetUserInfoWithHttpInfo(param.body,  options).toPromise();
    }

    /**
     * @param param the request object
     */
    public userGetUserInfo(param: DefaultApiUserGetUserInfoRequest, options?: ConfigurationOptions): Promise<UserGetUserInfo200Response> {
        return this.api.userGetUserInfo(param.body,  options).toPromise();
    }

    /**
     * @param param the request object
     */
    public userGetUserInfoByMsisdnWithHttpInfo(param: DefaultApiUserGetUserInfoByMsisdnRequest, options?: ConfigurationOptions): Promise<HttpInfo<UserGetUserInfo200Response>> {
        return this.api.userGetUserInfoByMsisdnWithHttpInfo(param.userGetUserInfoByMsisdnRequest,  options).toPromise();
    }

    /**
     * @param param the request object
     */
    public userGetUserInfoByMsisdn(param: DefaultApiUserGetUserInfoByMsisdnRequest, options?: ConfigurationOptions): Promise<UserGetUserInfo200Response> {
        return this.api.userGetUserInfoByMsisdn(param.userGetUserInfoByMsisdnRequest,  options).toPromise();
    }

}
