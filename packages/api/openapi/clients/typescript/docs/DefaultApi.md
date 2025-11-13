# .DefaultApi

All URIs are relative to *https://director.odience.com/api*

Method | HTTP request | Description
------------- | ------------- | -------------
[**eventsListEvents**](DefaultApi.md#eventsListEvents) | **POST** /events/listEvents | 
[**eventsListEventsLive**](DefaultApi.md#eventsListEventsLive) | **POST** /events/listEventsLive | 
[**eventsListPartialEvents**](DefaultApi.md#eventsListPartialEvents) | **POST** /events/listPartialEvents | 
[**healthLiveOk**](DefaultApi.md#healthLiveOk) | **GET** /health/liveOk | 
[**healthOk**](DefaultApi.md#healthOk) | **GET** /health/ok | 
[**odienceGetCategoryList**](DefaultApi.md#odienceGetCategoryList) | **POST** /odience/getCategoryList | 
[**odienceProvisionUser**](DefaultApi.md#odienceProvisionUser) | **POST** /odience/provisionUser | 
[**odienceValidatePhoneNumber**](DefaultApi.md#odienceValidatePhoneNumber) | **POST** /odience/validatePhoneNumber | 
[**streamGetStreamUrls**](DefaultApi.md#streamGetStreamUrls) | **POST** /stream/getStreamUrls | 
[**userGetUserInfo**](DefaultApi.md#userGetUserInfo) | **POST** /user/getUserInfo | 
[**userGetUserInfoByMsisdn**](DefaultApi.md#userGetUserInfoByMsisdn) | **POST** /user/getUserInfoByMsisdn | 


# **eventsListEvents**
> EventsListEvents200Response eventsListEvents()


### Example


```typescript
import { createConfiguration, DefaultApi } from '';
import type { DefaultApiEventsListEventsRequest } from '';

const configuration = createConfiguration();
const apiInstance = new DefaultApi(configuration);

const request: DefaultApiEventsListEventsRequest = {
  
  body: null,
};

const data = await apiInstance.eventsListEvents(request);
console.log('API called successfully. Returned data:', data);
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **body** | **any**|  |


### Return type

**EventsListEvents200Response**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](README.md#documentation-for-api-endpoints) [[Back to Model list]](README.md#documentation-for-models) [[Back to README]](README.md)

# **eventsListEventsLive**
> EventsListEventsLive200Response eventsListEventsLive()


### Example


```typescript
import { createConfiguration, DefaultApi } from '';
import type { DefaultApiEventsListEventsLiveRequest } from '';

const configuration = createConfiguration();
const apiInstance = new DefaultApi(configuration);

const request: DefaultApiEventsListEventsLiveRequest = {
  
  body: null,
};

const data = await apiInstance.eventsListEventsLive(request);
console.log('API called successfully. Returned data:', data);
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **body** | **any**|  |


### Return type

**EventsListEventsLive200Response**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: text/event-stream


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](README.md#documentation-for-api-endpoints) [[Back to Model list]](README.md#documentation-for-models) [[Back to README]](README.md)

# **eventsListPartialEvents**
> EventsListEvents200Response eventsListPartialEvents()


### Example


```typescript
import { createConfiguration, DefaultApi } from '';
import type { DefaultApiEventsListPartialEventsRequest } from '';

const configuration = createConfiguration();
const apiInstance = new DefaultApi(configuration);

const request: DefaultApiEventsListPartialEventsRequest = {
  
  body: null,
};

const data = await apiInstance.eventsListPartialEvents(request);
console.log('API called successfully. Returned data:', data);
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **body** | **any**|  |


### Return type

**EventsListEvents200Response**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](README.md#documentation-for-api-endpoints) [[Back to Model list]](README.md#documentation-for-models) [[Back to README]](README.md)

# **healthLiveOk**
> HealthLiveOk200Response healthLiveOk()


### Example


```typescript
import { createConfiguration, DefaultApi } from '';
import type { DefaultApiHealthLiveOkRequest } from '';

const configuration = createConfiguration();
const apiInstance = new DefaultApi(configuration);

const request: DefaultApiHealthLiveOkRequest = {
  
  maxOutputs: 3.14,
};

const data = await apiInstance.healthLiveOk(request);
console.log('API called successfully. Returned data:', data);
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **maxOutputs** | [**number**] |  | (optional) defaults to undefined


### Return type

**HealthLiveOk200Response**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: text/event-stream


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](README.md#documentation-for-api-endpoints) [[Back to Model list]](README.md#documentation-for-models) [[Back to README]](README.md)

# **healthOk**
> string healthOk()


### Example


```typescript
import { createConfiguration, DefaultApi } from '';

const configuration = createConfiguration();
const apiInstance = new DefaultApi(configuration);

const request = {};

const data = await apiInstance.healthOk(request);
console.log('API called successfully. Returned data:', data);
```


### Parameters
This endpoint does not need any parameter.


### Return type

**string**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](README.md#documentation-for-api-endpoints) [[Back to Model list]](README.md#documentation-for-models) [[Back to README]](README.md)

# **odienceGetCategoryList**
> { [key: string]: string | null; } odienceGetCategoryList()


### Example


```typescript
import { createConfiguration, DefaultApi } from '';

const configuration = createConfiguration();
const apiInstance = new DefaultApi(configuration);

const request = {};

const data = await apiInstance.odienceGetCategoryList(request);
console.log('API called successfully. Returned data:', data);
```


### Parameters
This endpoint does not need any parameter.


### Return type

**{ [key: string]: string | null; }**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](README.md#documentation-for-api-endpoints) [[Back to Model list]](README.md#documentation-for-models) [[Back to README]](README.md)

# **odienceProvisionUser**
> OdienceProvisionUser200Response odienceProvisionUser(odienceProvisionUserRequest)


### Example


```typescript
import { createConfiguration, DefaultApi } from '';
import type { DefaultApiOdienceProvisionUserRequest } from '';

const configuration = createConfiguration();
const apiInstance = new DefaultApi(configuration);

const request: DefaultApiOdienceProvisionUserRequest = {
  
  odienceProvisionUserRequest: {
    msisdn: "msisdn_example",
    countryCode: "countryCode_example",
  },
};

const data = await apiInstance.odienceProvisionUser(request);
console.log('API called successfully. Returned data:', data);
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **odienceProvisionUserRequest** | **OdienceProvisionUserRequest**|  |


### Return type

**OdienceProvisionUser200Response**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](README.md#documentation-for-api-endpoints) [[Back to Model list]](README.md#documentation-for-models) [[Back to README]](README.md)

# **odienceValidatePhoneNumber**
> OdienceValidatePhoneNumber200Response odienceValidatePhoneNumber(odienceValidatePhoneNumberRequest)


### Example


```typescript
import { createConfiguration, DefaultApi } from '';
import type { DefaultApiOdienceValidatePhoneNumberRequest } from '';

const configuration = createConfiguration();
const apiInstance = new DefaultApi(configuration);

const request: DefaultApiOdienceValidatePhoneNumberRequest = {
  
  odienceValidatePhoneNumberRequest: {
    msisdn: "msisdn_example",
    countryCode: "countryCode_example",
  },
};

const data = await apiInstance.odienceValidatePhoneNumber(request);
console.log('API called successfully. Returned data:', data);
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **odienceValidatePhoneNumberRequest** | **OdienceValidatePhoneNumberRequest**|  |


### Return type

**OdienceValidatePhoneNumber200Response**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](README.md#documentation-for-api-endpoints) [[Back to Model list]](README.md#documentation-for-models) [[Back to README]](README.md)

# **streamGetStreamUrls**
> StreamGetStreamUrls200Response streamGetStreamUrls(streamGetStreamUrlsRequest)


### Example


```typescript
import { createConfiguration, DefaultApi } from '';
import type { DefaultApiStreamGetStreamUrlsRequest } from '';

const configuration = createConfiguration();
const apiInstance = new DefaultApi(configuration);

const request: DefaultApiStreamGetStreamUrlsRequest = {
  
  streamGetStreamUrlsRequest: {
    streamUrlId: -9007199254740991,
  },
};

const data = await apiInstance.streamGetStreamUrls(request);
console.log('API called successfully. Returned data:', data);
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **streamGetStreamUrlsRequest** | **StreamGetStreamUrlsRequest**|  |


### Return type

**StreamGetStreamUrls200Response**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](README.md#documentation-for-api-endpoints) [[Back to Model list]](README.md#documentation-for-models) [[Back to README]](README.md)

# **userGetUserInfo**
> UserGetUserInfo200Response userGetUserInfo(body)


### Example


```typescript
import { createConfiguration, DefaultApi } from '';
import type { DefaultApiUserGetUserInfoRequest } from '';

const configuration = createConfiguration();
const apiInstance = new DefaultApi(configuration);

const request: DefaultApiUserGetUserInfoRequest = {
  
  body: {},
};

const data = await apiInstance.userGetUserInfo(request);
console.log('API called successfully. Returned data:', data);
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **body** | **any**|  |


### Return type

**UserGetUserInfo200Response**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](README.md#documentation-for-api-endpoints) [[Back to Model list]](README.md#documentation-for-models) [[Back to README]](README.md)

# **userGetUserInfoByMsisdn**
> UserGetUserInfo200Response userGetUserInfoByMsisdn(userGetUserInfoByMsisdnRequest)


### Example


```typescript
import { createConfiguration, DefaultApi } from '';
import type { DefaultApiUserGetUserInfoByMsisdnRequest } from '';

const configuration = createConfiguration();
const apiInstance = new DefaultApi(configuration);

const request: DefaultApiUserGetUserInfoByMsisdnRequest = {
  
  userGetUserInfoByMsisdnRequest: {
    msisdn: "msisdn_example",
  },
};

const data = await apiInstance.userGetUserInfoByMsisdn(request);
console.log('API called successfully. Returned data:', data);
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **userGetUserInfoByMsisdnRequest** | **UserGetUserInfoByMsisdnRequest**|  |


### Return type

**UserGetUserInfo200Response**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](README.md#documentation-for-api-endpoints) [[Back to Model list]](README.md#documentation-for-models) [[Back to README]](README.md)


