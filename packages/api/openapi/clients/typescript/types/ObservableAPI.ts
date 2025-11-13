import { ResponseContext, RequestContext, HttpFile, HttpInfo } from '../http/http';
import { Configuration, ConfigurationOptions, mergeConfiguration } from '../configuration'
import type { Middleware } from '../middleware';
import { Observable, of, from } from '../rxjsStub';
import {mergeMap, map} from  '../rxjsStub';
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

import { DefaultApiRequestFactory, DefaultApiResponseProcessor} from "../apis/DefaultApi";
export class ObservableDefaultApi {
    private requestFactory: DefaultApiRequestFactory;
    private responseProcessor: DefaultApiResponseProcessor;
    private configuration: Configuration;

    public constructor(
        configuration: Configuration,
        requestFactory?: DefaultApiRequestFactory,
        responseProcessor?: DefaultApiResponseProcessor
    ) {
        this.configuration = configuration;
        this.requestFactory = requestFactory || new DefaultApiRequestFactory(configuration);
        this.responseProcessor = responseProcessor || new DefaultApiResponseProcessor();
    }

    /**
     * @param [body]
     */
    public eventsListEventsWithHttpInfo(body?: any, _options?: ConfigurationOptions): Observable<HttpInfo<EventsListEvents200Response>> {
        const _config = mergeConfiguration(this.configuration, _options);

        const requestContextPromise = this.requestFactory.eventsListEvents(body, _config);
        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (const middleware of _config.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => _config.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (const middleware of _config.middleware.reverse()) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.eventsListEventsWithHttpInfo(rsp)));
            }));
    }

    /**
     * @param [body]
     */
    public eventsListEvents(body?: any, _options?: ConfigurationOptions): Observable<EventsListEvents200Response> {
        return this.eventsListEventsWithHttpInfo(body, _options).pipe(map((apiResponse: HttpInfo<EventsListEvents200Response>) => apiResponse.data));
    }

    /**
     * @param [body]
     */
    public eventsListEventsLiveWithHttpInfo(body?: any, _options?: ConfigurationOptions): Observable<HttpInfo<EventsListEventsLive200Response>> {
        const _config = mergeConfiguration(this.configuration, _options);

        const requestContextPromise = this.requestFactory.eventsListEventsLive(body, _config);
        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (const middleware of _config.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => _config.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (const middleware of _config.middleware.reverse()) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.eventsListEventsLiveWithHttpInfo(rsp)));
            }));
    }

    /**
     * @param [body]
     */
    public eventsListEventsLive(body?: any, _options?: ConfigurationOptions): Observable<EventsListEventsLive200Response> {
        return this.eventsListEventsLiveWithHttpInfo(body, _options).pipe(map((apiResponse: HttpInfo<EventsListEventsLive200Response>) => apiResponse.data));
    }

    /**
     * @param [body]
     */
    public eventsListPartialEventsWithHttpInfo(body?: any, _options?: ConfigurationOptions): Observable<HttpInfo<EventsListEvents200Response>> {
        const _config = mergeConfiguration(this.configuration, _options);

        const requestContextPromise = this.requestFactory.eventsListPartialEvents(body, _config);
        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (const middleware of _config.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => _config.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (const middleware of _config.middleware.reverse()) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.eventsListPartialEventsWithHttpInfo(rsp)));
            }));
    }

    /**
     * @param [body]
     */
    public eventsListPartialEvents(body?: any, _options?: ConfigurationOptions): Observable<EventsListEvents200Response> {
        return this.eventsListPartialEventsWithHttpInfo(body, _options).pipe(map((apiResponse: HttpInfo<EventsListEvents200Response>) => apiResponse.data));
    }

    /**
     * @param [maxOutputs]
     */
    public healthLiveOkWithHttpInfo(maxOutputs?: number, _options?: ConfigurationOptions): Observable<HttpInfo<HealthLiveOk200Response>> {
        const _config = mergeConfiguration(this.configuration, _options);

        const requestContextPromise = this.requestFactory.healthLiveOk(maxOutputs, _config);
        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (const middleware of _config.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => _config.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (const middleware of _config.middleware.reverse()) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.healthLiveOkWithHttpInfo(rsp)));
            }));
    }

    /**
     * @param [maxOutputs]
     */
    public healthLiveOk(maxOutputs?: number, _options?: ConfigurationOptions): Observable<HealthLiveOk200Response> {
        return this.healthLiveOkWithHttpInfo(maxOutputs, _options).pipe(map((apiResponse: HttpInfo<HealthLiveOk200Response>) => apiResponse.data));
    }

    /**
     */
    public healthOkWithHttpInfo(_options?: ConfigurationOptions): Observable<HttpInfo<string>> {
        const _config = mergeConfiguration(this.configuration, _options);

        const requestContextPromise = this.requestFactory.healthOk(_config);
        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (const middleware of _config.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => _config.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (const middleware of _config.middleware.reverse()) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.healthOkWithHttpInfo(rsp)));
            }));
    }

    /**
     */
    public healthOk(_options?: ConfigurationOptions): Observable<string> {
        return this.healthOkWithHttpInfo(_options).pipe(map((apiResponse: HttpInfo<string>) => apiResponse.data));
    }

    /**
     */
    public odienceGetCategoryListWithHttpInfo(_options?: ConfigurationOptions): Observable<HttpInfo<{ [key: string]: string | null; }>> {
        const _config = mergeConfiguration(this.configuration, _options);

        const requestContextPromise = this.requestFactory.odienceGetCategoryList(_config);
        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (const middleware of _config.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => _config.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (const middleware of _config.middleware.reverse()) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.odienceGetCategoryListWithHttpInfo(rsp)));
            }));
    }

    /**
     */
    public odienceGetCategoryList(_options?: ConfigurationOptions): Observable<{ [key: string]: string | null; }> {
        return this.odienceGetCategoryListWithHttpInfo(_options).pipe(map((apiResponse: HttpInfo<{ [key: string]: string | null; }>) => apiResponse.data));
    }

    /**
     * @param odienceProvisionUserRequest
     */
    public odienceProvisionUserWithHttpInfo(odienceProvisionUserRequest: OdienceProvisionUserRequest, _options?: ConfigurationOptions): Observable<HttpInfo<OdienceProvisionUser200Response>> {
        const _config = mergeConfiguration(this.configuration, _options);

        const requestContextPromise = this.requestFactory.odienceProvisionUser(odienceProvisionUserRequest, _config);
        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (const middleware of _config.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => _config.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (const middleware of _config.middleware.reverse()) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.odienceProvisionUserWithHttpInfo(rsp)));
            }));
    }

    /**
     * @param odienceProvisionUserRequest
     */
    public odienceProvisionUser(odienceProvisionUserRequest: OdienceProvisionUserRequest, _options?: ConfigurationOptions): Observable<OdienceProvisionUser200Response> {
        return this.odienceProvisionUserWithHttpInfo(odienceProvisionUserRequest, _options).pipe(map((apiResponse: HttpInfo<OdienceProvisionUser200Response>) => apiResponse.data));
    }

    /**
     * @param odienceValidatePhoneNumberRequest
     */
    public odienceValidatePhoneNumberWithHttpInfo(odienceValidatePhoneNumberRequest: OdienceValidatePhoneNumberRequest, _options?: ConfigurationOptions): Observable<HttpInfo<OdienceValidatePhoneNumber200Response>> {
        const _config = mergeConfiguration(this.configuration, _options);

        const requestContextPromise = this.requestFactory.odienceValidatePhoneNumber(odienceValidatePhoneNumberRequest, _config);
        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (const middleware of _config.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => _config.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (const middleware of _config.middleware.reverse()) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.odienceValidatePhoneNumberWithHttpInfo(rsp)));
            }));
    }

    /**
     * @param odienceValidatePhoneNumberRequest
     */
    public odienceValidatePhoneNumber(odienceValidatePhoneNumberRequest: OdienceValidatePhoneNumberRequest, _options?: ConfigurationOptions): Observable<OdienceValidatePhoneNumber200Response> {
        return this.odienceValidatePhoneNumberWithHttpInfo(odienceValidatePhoneNumberRequest, _options).pipe(map((apiResponse: HttpInfo<OdienceValidatePhoneNumber200Response>) => apiResponse.data));
    }

    /**
     * @param streamGetStreamUrlsRequest
     */
    public streamGetStreamUrlsWithHttpInfo(streamGetStreamUrlsRequest: StreamGetStreamUrlsRequest, _options?: ConfigurationOptions): Observable<HttpInfo<StreamGetStreamUrls200Response>> {
        const _config = mergeConfiguration(this.configuration, _options);

        const requestContextPromise = this.requestFactory.streamGetStreamUrls(streamGetStreamUrlsRequest, _config);
        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (const middleware of _config.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => _config.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (const middleware of _config.middleware.reverse()) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.streamGetStreamUrlsWithHttpInfo(rsp)));
            }));
    }

    /**
     * @param streamGetStreamUrlsRequest
     */
    public streamGetStreamUrls(streamGetStreamUrlsRequest: StreamGetStreamUrlsRequest, _options?: ConfigurationOptions): Observable<StreamGetStreamUrls200Response> {
        return this.streamGetStreamUrlsWithHttpInfo(streamGetStreamUrlsRequest, _options).pipe(map((apiResponse: HttpInfo<StreamGetStreamUrls200Response>) => apiResponse.data));
    }

    /**
     * @param body
     */
    public userGetUserInfoWithHttpInfo(body: any, _options?: ConfigurationOptions): Observable<HttpInfo<UserGetUserInfo200Response>> {
        const _config = mergeConfiguration(this.configuration, _options);

        const requestContextPromise = this.requestFactory.userGetUserInfo(body, _config);
        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (const middleware of _config.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => _config.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (const middleware of _config.middleware.reverse()) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.userGetUserInfoWithHttpInfo(rsp)));
            }));
    }

    /**
     * @param body
     */
    public userGetUserInfo(body: any, _options?: ConfigurationOptions): Observable<UserGetUserInfo200Response> {
        return this.userGetUserInfoWithHttpInfo(body, _options).pipe(map((apiResponse: HttpInfo<UserGetUserInfo200Response>) => apiResponse.data));
    }

    /**
     * @param userGetUserInfoByMsisdnRequest
     */
    public userGetUserInfoByMsisdnWithHttpInfo(userGetUserInfoByMsisdnRequest: UserGetUserInfoByMsisdnRequest, _options?: ConfigurationOptions): Observable<HttpInfo<UserGetUserInfo200Response>> {
        const _config = mergeConfiguration(this.configuration, _options);

        const requestContextPromise = this.requestFactory.userGetUserInfoByMsisdn(userGetUserInfoByMsisdnRequest, _config);
        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (const middleware of _config.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => _config.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (const middleware of _config.middleware.reverse()) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.userGetUserInfoByMsisdnWithHttpInfo(rsp)));
            }));
    }

    /**
     * @param userGetUserInfoByMsisdnRequest
     */
    public userGetUserInfoByMsisdn(userGetUserInfoByMsisdnRequest: UserGetUserInfoByMsisdnRequest, _options?: ConfigurationOptions): Observable<UserGetUserInfo200Response> {
        return this.userGetUserInfoByMsisdnWithHttpInfo(userGetUserInfoByMsisdnRequest, _options).pipe(map((apiResponse: HttpInfo<UserGetUserInfo200Response>) => apiResponse.data));
    }

}
