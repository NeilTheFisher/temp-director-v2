import { ResponseContext, RequestContext, HttpFile, HttpInfo, SSECallback, SSEErrorCallback, SSEDoneCallback, parseServerSentEvents } from '../http/http';
import { Configuration, PromiseConfigurationOptions, wrapOptions } from '../configuration'
import { PromiseMiddleware, Middleware, PromiseMiddlewareWrapper } from '../middleware';

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
import { ObservableDefaultApi } from './ObservableAPI';

import { DefaultApiRequestFactory, DefaultApiResponseProcessor} from "../apis/DefaultApi";
export class PromiseDefaultApi {
    private api: ObservableDefaultApi

    public constructor(
        configuration: Configuration,
        requestFactory?: DefaultApiRequestFactory,
        responseProcessor?: DefaultApiResponseProcessor
    ) {
        this.api = new ObservableDefaultApi(configuration, requestFactory, responseProcessor);
    }

    /**
     * @param [body]
     */
    public eventsListEventsWithHttpInfo(body?: any, _options?: PromiseConfigurationOptions): Promise<HttpInfo<EventsListEvents200Response>> {
        const observableOptions = wrapOptions(_options);
        const result = this.api.eventsListEventsWithHttpInfo(body, observableOptions);
        return result.toPromise();
    }

    /**
     * @param [body]
     */
    public eventsListEvents(body?: any, _options?: PromiseConfigurationOptions): Promise<EventsListEvents200Response> {
        const observableOptions = wrapOptions(_options);
        const result = this.api.eventsListEvents(body, observableOptions);
        return result.toPromise();
    }

    /**
     * @param [body]
     * @param onMessage Callback invoked for each SSE message event
     * @param onError Callback invoked when an SSE error event occurs
     * @param onDone Callback invoked when the SSE stream completes
     */
    public async eventsListEventsLive(body?: any, onMessage: SSECallback<EventsListEventsLive200Response>, onError?: SSEErrorCallback, onDone?: SSEDoneCallback, _options?: PromiseConfigurationOptions): Promise<void> {
        const observableOptions = wrapOptions(_options);
        const result = this.api.eventsListEventsLiveWithHttpInfo(body, observableOptions);
        const httpInfo = await result.toPromise();
        await parseServerSentEvents(httpInfo, onMessage, onError, onDone);
    }

    /**
     * @param [body]
     */
    public eventsListPartialEventsWithHttpInfo(body?: any, _options?: PromiseConfigurationOptions): Promise<HttpInfo<EventsListEvents200Response>> {
        const observableOptions = wrapOptions(_options);
        const result = this.api.eventsListPartialEventsWithHttpInfo(body, observableOptions);
        return result.toPromise();
    }

    /**
     * @param [body]
     */
    public eventsListPartialEvents(body?: any, _options?: PromiseConfigurationOptions): Promise<EventsListEvents200Response> {
        const observableOptions = wrapOptions(_options);
        const result = this.api.eventsListPartialEvents(body, observableOptions);
        return result.toPromise();
    }

    /**
     * @param [maxOutputs]
     * @param onMessage Callback invoked for each SSE message event
     * @param onError Callback invoked when an SSE error event occurs
     * @param onDone Callback invoked when the SSE stream completes
     */
    public async healthLiveOk(maxOutputs?: number, onMessage: SSECallback<HealthLiveOk200Response>, onError?: SSEErrorCallback, onDone?: SSEDoneCallback, _options?: PromiseConfigurationOptions): Promise<void> {
        const observableOptions = wrapOptions(_options);
        const result = this.api.healthLiveOkWithHttpInfo(maxOutputs, observableOptions);
        const httpInfo = await result.toPromise();
        await parseServerSentEvents(httpInfo, onMessage, onError, onDone);
    }

    /**
     */
    public healthOkWithHttpInfo(_options?: PromiseConfigurationOptions): Promise<HttpInfo<string>> {
        const observableOptions = wrapOptions(_options);
        const result = this.api.healthOkWithHttpInfo(observableOptions);
        return result.toPromise();
    }

    /**
     */
    public healthOk(_options?: PromiseConfigurationOptions): Promise<string> {
        const observableOptions = wrapOptions(_options);
        const result = this.api.healthOk(observableOptions);
        return result.toPromise();
    }

    /**
     */
    public odienceGetCategoryListWithHttpInfo(_options?: PromiseConfigurationOptions): Promise<HttpInfo<{ [key: string]: string | null; }>> {
        const observableOptions = wrapOptions(_options);
        const result = this.api.odienceGetCategoryListWithHttpInfo(observableOptions);
        return result.toPromise();
    }

    /**
     */
    public odienceGetCategoryList(_options?: PromiseConfigurationOptions): Promise<{ [key: string]: string | null; }> {
        const observableOptions = wrapOptions(_options);
        const result = this.api.odienceGetCategoryList(observableOptions);
        return result.toPromise();
    }

    /**
     * @param odienceProvisionUserRequest
     */
    public odienceProvisionUserWithHttpInfo(odienceProvisionUserRequest: OdienceProvisionUserRequest, _options?: PromiseConfigurationOptions): Promise<HttpInfo<OdienceProvisionUser200Response>> {
        const observableOptions = wrapOptions(_options);
        const result = this.api.odienceProvisionUserWithHttpInfo(odienceProvisionUserRequest, observableOptions);
        return result.toPromise();
    }

    /**
     * @param odienceProvisionUserRequest
     */
    public odienceProvisionUser(odienceProvisionUserRequest: OdienceProvisionUserRequest, _options?: PromiseConfigurationOptions): Promise<OdienceProvisionUser200Response> {
        const observableOptions = wrapOptions(_options);
        const result = this.api.odienceProvisionUser(odienceProvisionUserRequest, observableOptions);
        return result.toPromise();
    }

    /**
     * @param odienceValidatePhoneNumberRequest
     */
    public odienceValidatePhoneNumberWithHttpInfo(odienceValidatePhoneNumberRequest: OdienceValidatePhoneNumberRequest, _options?: PromiseConfigurationOptions): Promise<HttpInfo<OdienceValidatePhoneNumber200Response>> {
        const observableOptions = wrapOptions(_options);
        const result = this.api.odienceValidatePhoneNumberWithHttpInfo(odienceValidatePhoneNumberRequest, observableOptions);
        return result.toPromise();
    }

    /**
     * @param odienceValidatePhoneNumberRequest
     */
    public odienceValidatePhoneNumber(odienceValidatePhoneNumberRequest: OdienceValidatePhoneNumberRequest, _options?: PromiseConfigurationOptions): Promise<OdienceValidatePhoneNumber200Response> {
        const observableOptions = wrapOptions(_options);
        const result = this.api.odienceValidatePhoneNumber(odienceValidatePhoneNumberRequest, observableOptions);
        return result.toPromise();
    }

    /**
     * @param streamGetStreamUrlsRequest
     */
    public streamGetStreamUrlsWithHttpInfo(streamGetStreamUrlsRequest: StreamGetStreamUrlsRequest, _options?: PromiseConfigurationOptions): Promise<HttpInfo<StreamGetStreamUrls200Response>> {
        const observableOptions = wrapOptions(_options);
        const result = this.api.streamGetStreamUrlsWithHttpInfo(streamGetStreamUrlsRequest, observableOptions);
        return result.toPromise();
    }

    /**
     * @param streamGetStreamUrlsRequest
     */
    public streamGetStreamUrls(streamGetStreamUrlsRequest: StreamGetStreamUrlsRequest, _options?: PromiseConfigurationOptions): Promise<StreamGetStreamUrls200Response> {
        const observableOptions = wrapOptions(_options);
        const result = this.api.streamGetStreamUrls(streamGetStreamUrlsRequest, observableOptions);
        return result.toPromise();
    }

    /**
     * @param body
     */
    public userGetUserInfoWithHttpInfo(body: any, _options?: PromiseConfigurationOptions): Promise<HttpInfo<UserGetUserInfo200Response>> {
        const observableOptions = wrapOptions(_options);
        const result = this.api.userGetUserInfoWithHttpInfo(body, observableOptions);
        return result.toPromise();
    }

    /**
     * @param body
     */
    public userGetUserInfo(body: any, _options?: PromiseConfigurationOptions): Promise<UserGetUserInfo200Response> {
        const observableOptions = wrapOptions(_options);
        const result = this.api.userGetUserInfo(body, observableOptions);
        return result.toPromise();
    }

    /**
     * @param userGetUserInfoByMsisdnRequest
     */
    public userGetUserInfoByMsisdnWithHttpInfo(userGetUserInfoByMsisdnRequest: UserGetUserInfoByMsisdnRequest, _options?: PromiseConfigurationOptions): Promise<HttpInfo<UserGetUserInfo200Response>> {
        const observableOptions = wrapOptions(_options);
        const result = this.api.userGetUserInfoByMsisdnWithHttpInfo(userGetUserInfoByMsisdnRequest, observableOptions);
        return result.toPromise();
    }

    /**
     * @param userGetUserInfoByMsisdnRequest
     */
    public userGetUserInfoByMsisdn(userGetUserInfoByMsisdnRequest: UserGetUserInfoByMsisdnRequest, _options?: PromiseConfigurationOptions): Promise<UserGetUserInfo200Response> {
        const observableOptions = wrapOptions(_options);
        const result = this.api.userGetUserInfoByMsisdn(userGetUserInfoByMsisdnRequest, observableOptions);
        return result.toPromise();
    }


}



