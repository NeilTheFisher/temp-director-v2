# DirectorV2.Client.Api.DefaultApi

All URIs are relative to *https://director.odience.com/api*

| Method | HTTP request | Description |
|--------|--------------|-------------|
| [**EventsListEvents**](DefaultApi.md#eventslistevents) | **POST** /events/listEvents |  |
| [**EventsListEventsLive**](DefaultApi.md#eventslisteventslive) | **POST** /events/listEventsLive |  |
| [**EventsListPartialEvents**](DefaultApi.md#eventslistpartialevents) | **POST** /events/listPartialEvents |  |
| [**HealthLiveOk**](DefaultApi.md#healthliveok) | **GET** /health/liveOk |  |
| [**HealthOk**](DefaultApi.md#healthok) | **GET** /health/ok |  |
| [**OdienceGetCategoryList**](DefaultApi.md#odiencegetcategorylist) | **POST** /odience/getCategoryList |  |
| [**OdienceProvisionUser**](DefaultApi.md#odienceprovisionuser) | **POST** /odience/provisionUser |  |
| [**OdienceValidatePhoneNumber**](DefaultApi.md#odiencevalidatephonenumber) | **POST** /odience/validatePhoneNumber |  |
| [**StreamGetStreamUrls**](DefaultApi.md#streamgetstreamurls) | **POST** /stream/getStreamUrls |  |
| [**UserGetUserInfo**](DefaultApi.md#usergetuserinfo) | **POST** /user/getUserInfo |  |
| [**UserGetUserInfoByMsisdn**](DefaultApi.md#usergetuserinfobymsisdn) | **POST** /user/getUserInfoByMsisdn |  |

<a id="eventslistevents"></a>
# **EventsListEvents**
> EventsListEvents200Response EventsListEvents (Object? body = null)



### Example
```csharp
using System.Collections.Generic;
using System.Diagnostics;
using DirectorV2.Client.Api;
using DirectorV2.Client.Client;
using DirectorV2.Client.Model;

namespace Example
{
    public class EventsListEventsExample
    {
        public static void Main()
        {
            Configuration config = new Configuration();
            config.BasePath = "https://director.odience.com/api";
            var apiInstance = new DefaultApi(config);
            var body = null;  // Object? |  (optional) 

            try
            {
                EventsListEvents200Response result = apiInstance.EventsListEvents(body);
                Debug.WriteLine(result);
            }
            catch (ApiException  e)
            {
                Debug.Print("Exception when calling DefaultApi.EventsListEvents: " + e.Message);
                Debug.Print("Status Code: " + e.ErrorCode);
                Debug.Print(e.StackTrace);
            }
        }
    }
}
```

#### Using the EventsListEventsWithHttpInfo variant
This returns an ApiResponse object which contains the response data, status code and headers.

```csharp
try
{
    ApiResponse<EventsListEvents200Response> response = apiInstance.EventsListEventsWithHttpInfo(body);
    Debug.Write("Status Code: " + response.StatusCode);
    Debug.Write("Response Headers: " + response.Headers);
    Debug.Write("Response Body: " + response.Data);
}
catch (ApiException e)
{
    Debug.Print("Exception when calling DefaultApi.EventsListEventsWithHttpInfo: " + e.Message);
    Debug.Print("Status Code: " + e.ErrorCode);
    Debug.Print(e.StackTrace);
}
```

### Parameters

| Name | Type | Description | Notes |
|------|------|-------------|-------|
| **body** | **Object?** |  | [optional]  |

### Return type

[**EventsListEvents200Response**](EventsListEvents200Response.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

<a id="eventslisteventslive"></a>
# **EventsListEventsLive**
> EventsListEventsLive200Response EventsListEventsLive (Object? body = null)



### Example
```csharp
using System.Collections.Generic;
using System.Diagnostics;
using DirectorV2.Client.Api;
using DirectorV2.Client.Client;
using DirectorV2.Client.Model;

namespace Example
{
    public class EventsListEventsLiveExample
    {
        public static void Main()
        {
            Configuration config = new Configuration();
            config.BasePath = "https://director.odience.com/api";
            var apiInstance = new DefaultApi(config);
            var body = null;  // Object? |  (optional) 

            try
            {
                EventsListEventsLive200Response result = apiInstance.EventsListEventsLive(body);
                Debug.WriteLine(result);
            }
            catch (ApiException  e)
            {
                Debug.Print("Exception when calling DefaultApi.EventsListEventsLive: " + e.Message);
                Debug.Print("Status Code: " + e.ErrorCode);
                Debug.Print(e.StackTrace);
            }
        }
    }
}
```

#### Using the EventsListEventsLiveWithHttpInfo variant
This returns an ApiResponse object which contains the response data, status code and headers.

```csharp
try
{
    ApiResponse<EventsListEventsLive200Response> response = apiInstance.EventsListEventsLiveWithHttpInfo(body);
    Debug.Write("Status Code: " + response.StatusCode);
    Debug.Write("Response Headers: " + response.Headers);
    Debug.Write("Response Body: " + response.Data);
}
catch (ApiException e)
{
    Debug.Print("Exception when calling DefaultApi.EventsListEventsLiveWithHttpInfo: " + e.Message);
    Debug.Print("Status Code: " + e.ErrorCode);
    Debug.Print(e.StackTrace);
}
```

### Parameters

| Name | Type | Description | Notes |
|------|------|-------------|-------|
| **body** | **Object?** |  | [optional]  |

### Return type

[**EventsListEventsLive200Response**](EventsListEventsLive200Response.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: text/event-stream


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

<a id="eventslistpartialevents"></a>
# **EventsListPartialEvents**
> EventsListEvents200Response EventsListPartialEvents (Object? body = null)



### Example
```csharp
using System.Collections.Generic;
using System.Diagnostics;
using DirectorV2.Client.Api;
using DirectorV2.Client.Client;
using DirectorV2.Client.Model;

namespace Example
{
    public class EventsListPartialEventsExample
    {
        public static void Main()
        {
            Configuration config = new Configuration();
            config.BasePath = "https://director.odience.com/api";
            var apiInstance = new DefaultApi(config);
            var body = null;  // Object? |  (optional) 

            try
            {
                EventsListEvents200Response result = apiInstance.EventsListPartialEvents(body);
                Debug.WriteLine(result);
            }
            catch (ApiException  e)
            {
                Debug.Print("Exception when calling DefaultApi.EventsListPartialEvents: " + e.Message);
                Debug.Print("Status Code: " + e.ErrorCode);
                Debug.Print(e.StackTrace);
            }
        }
    }
}
```

#### Using the EventsListPartialEventsWithHttpInfo variant
This returns an ApiResponse object which contains the response data, status code and headers.

```csharp
try
{
    ApiResponse<EventsListEvents200Response> response = apiInstance.EventsListPartialEventsWithHttpInfo(body);
    Debug.Write("Status Code: " + response.StatusCode);
    Debug.Write("Response Headers: " + response.Headers);
    Debug.Write("Response Body: " + response.Data);
}
catch (ApiException e)
{
    Debug.Print("Exception when calling DefaultApi.EventsListPartialEventsWithHttpInfo: " + e.Message);
    Debug.Print("Status Code: " + e.ErrorCode);
    Debug.Print(e.StackTrace);
}
```

### Parameters

| Name | Type | Description | Notes |
|------|------|-------------|-------|
| **body** | **Object?** |  | [optional]  |

### Return type

[**EventsListEvents200Response**](EventsListEvents200Response.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

<a id="healthliveok"></a>
# **HealthLiveOk**
> HealthLiveOk200Response HealthLiveOk (decimal? maxOutputs = null)



### Example
```csharp
using System.Collections.Generic;
using System.Diagnostics;
using DirectorV2.Client.Api;
using DirectorV2.Client.Client;
using DirectorV2.Client.Model;

namespace Example
{
    public class HealthLiveOkExample
    {
        public static void Main()
        {
            Configuration config = new Configuration();
            config.BasePath = "https://director.odience.com/api";
            var apiInstance = new DefaultApi(config);
            var maxOutputs = 8.14D;  // decimal? |  (optional) 

            try
            {
                HealthLiveOk200Response result = apiInstance.HealthLiveOk(maxOutputs);
                Debug.WriteLine(result);
            }
            catch (ApiException  e)
            {
                Debug.Print("Exception when calling DefaultApi.HealthLiveOk: " + e.Message);
                Debug.Print("Status Code: " + e.ErrorCode);
                Debug.Print(e.StackTrace);
            }
        }
    }
}
```

#### Using the HealthLiveOkWithHttpInfo variant
This returns an ApiResponse object which contains the response data, status code and headers.

```csharp
try
{
    ApiResponse<HealthLiveOk200Response> response = apiInstance.HealthLiveOkWithHttpInfo(maxOutputs);
    Debug.Write("Status Code: " + response.StatusCode);
    Debug.Write("Response Headers: " + response.Headers);
    Debug.Write("Response Body: " + response.Data);
}
catch (ApiException e)
{
    Debug.Print("Exception when calling DefaultApi.HealthLiveOkWithHttpInfo: " + e.Message);
    Debug.Print("Status Code: " + e.ErrorCode);
    Debug.Print(e.StackTrace);
}
```

### Parameters

| Name | Type | Description | Notes |
|------|------|-------------|-------|
| **maxOutputs** | **decimal?** |  | [optional]  |

### Return type

[**HealthLiveOk200Response**](HealthLiveOk200Response.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: text/event-stream


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

<a id="healthok"></a>
# **HealthOk**
> string HealthOk ()



### Example
```csharp
using System.Collections.Generic;
using System.Diagnostics;
using DirectorV2.Client.Api;
using DirectorV2.Client.Client;
using DirectorV2.Client.Model;

namespace Example
{
    public class HealthOkExample
    {
        public static void Main()
        {
            Configuration config = new Configuration();
            config.BasePath = "https://director.odience.com/api";
            var apiInstance = new DefaultApi(config);

            try
            {
                string result = apiInstance.HealthOk();
                Debug.WriteLine(result);
            }
            catch (ApiException  e)
            {
                Debug.Print("Exception when calling DefaultApi.HealthOk: " + e.Message);
                Debug.Print("Status Code: " + e.ErrorCode);
                Debug.Print(e.StackTrace);
            }
        }
    }
}
```

#### Using the HealthOkWithHttpInfo variant
This returns an ApiResponse object which contains the response data, status code and headers.

```csharp
try
{
    ApiResponse<string> response = apiInstance.HealthOkWithHttpInfo();
    Debug.Write("Status Code: " + response.StatusCode);
    Debug.Write("Response Headers: " + response.Headers);
    Debug.Write("Response Body: " + response.Data);
}
catch (ApiException e)
{
    Debug.Print("Exception when calling DefaultApi.HealthOkWithHttpInfo: " + e.Message);
    Debug.Print("Status Code: " + e.ErrorCode);
    Debug.Print(e.StackTrace);
}
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
| **200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

<a id="odiencegetcategorylist"></a>
# **OdienceGetCategoryList**
> Dictionary&lt;string, string&gt; OdienceGetCategoryList ()



### Example
```csharp
using System.Collections.Generic;
using System.Diagnostics;
using DirectorV2.Client.Api;
using DirectorV2.Client.Client;
using DirectorV2.Client.Model;

namespace Example
{
    public class OdienceGetCategoryListExample
    {
        public static void Main()
        {
            Configuration config = new Configuration();
            config.BasePath = "https://director.odience.com/api";
            var apiInstance = new DefaultApi(config);

            try
            {
                Dictionary<string, string> result = apiInstance.OdienceGetCategoryList();
                Debug.WriteLine(result);
            }
            catch (ApiException  e)
            {
                Debug.Print("Exception when calling DefaultApi.OdienceGetCategoryList: " + e.Message);
                Debug.Print("Status Code: " + e.ErrorCode);
                Debug.Print(e.StackTrace);
            }
        }
    }
}
```

#### Using the OdienceGetCategoryListWithHttpInfo variant
This returns an ApiResponse object which contains the response data, status code and headers.

```csharp
try
{
    ApiResponse<Dictionary<string, string>> response = apiInstance.OdienceGetCategoryListWithHttpInfo();
    Debug.Write("Status Code: " + response.StatusCode);
    Debug.Write("Response Headers: " + response.Headers);
    Debug.Write("Response Body: " + response.Data);
}
catch (ApiException e)
{
    Debug.Print("Exception when calling DefaultApi.OdienceGetCategoryListWithHttpInfo: " + e.Message);
    Debug.Print("Status Code: " + e.ErrorCode);
    Debug.Print(e.StackTrace);
}
```

### Parameters
This endpoint does not need any parameter.
### Return type

**Dictionary<string, string>**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

<a id="odienceprovisionuser"></a>
# **OdienceProvisionUser**
> OdienceProvisionUser200Response OdienceProvisionUser (OdienceProvisionUserRequest odienceProvisionUserRequest)



### Example
```csharp
using System.Collections.Generic;
using System.Diagnostics;
using DirectorV2.Client.Api;
using DirectorV2.Client.Client;
using DirectorV2.Client.Model;

namespace Example
{
    public class OdienceProvisionUserExample
    {
        public static void Main()
        {
            Configuration config = new Configuration();
            config.BasePath = "https://director.odience.com/api";
            var apiInstance = new DefaultApi(config);
            var odienceProvisionUserRequest = new OdienceProvisionUserRequest(); // OdienceProvisionUserRequest | 

            try
            {
                OdienceProvisionUser200Response result = apiInstance.OdienceProvisionUser(odienceProvisionUserRequest);
                Debug.WriteLine(result);
            }
            catch (ApiException  e)
            {
                Debug.Print("Exception when calling DefaultApi.OdienceProvisionUser: " + e.Message);
                Debug.Print("Status Code: " + e.ErrorCode);
                Debug.Print(e.StackTrace);
            }
        }
    }
}
```

#### Using the OdienceProvisionUserWithHttpInfo variant
This returns an ApiResponse object which contains the response data, status code and headers.

```csharp
try
{
    ApiResponse<OdienceProvisionUser200Response> response = apiInstance.OdienceProvisionUserWithHttpInfo(odienceProvisionUserRequest);
    Debug.Write("Status Code: " + response.StatusCode);
    Debug.Write("Response Headers: " + response.Headers);
    Debug.Write("Response Body: " + response.Data);
}
catch (ApiException e)
{
    Debug.Print("Exception when calling DefaultApi.OdienceProvisionUserWithHttpInfo: " + e.Message);
    Debug.Print("Status Code: " + e.ErrorCode);
    Debug.Print(e.StackTrace);
}
```

### Parameters

| Name | Type | Description | Notes |
|------|------|-------------|-------|
| **odienceProvisionUserRequest** | [**OdienceProvisionUserRequest**](OdienceProvisionUserRequest.md) |  |  |

### Return type

[**OdienceProvisionUser200Response**](OdienceProvisionUser200Response.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

<a id="odiencevalidatephonenumber"></a>
# **OdienceValidatePhoneNumber**
> OdienceValidatePhoneNumber200Response OdienceValidatePhoneNumber (OdienceValidatePhoneNumberRequest odienceValidatePhoneNumberRequest)



### Example
```csharp
using System.Collections.Generic;
using System.Diagnostics;
using DirectorV2.Client.Api;
using DirectorV2.Client.Client;
using DirectorV2.Client.Model;

namespace Example
{
    public class OdienceValidatePhoneNumberExample
    {
        public static void Main()
        {
            Configuration config = new Configuration();
            config.BasePath = "https://director.odience.com/api";
            var apiInstance = new DefaultApi(config);
            var odienceValidatePhoneNumberRequest = new OdienceValidatePhoneNumberRequest(); // OdienceValidatePhoneNumberRequest | 

            try
            {
                OdienceValidatePhoneNumber200Response result = apiInstance.OdienceValidatePhoneNumber(odienceValidatePhoneNumberRequest);
                Debug.WriteLine(result);
            }
            catch (ApiException  e)
            {
                Debug.Print("Exception when calling DefaultApi.OdienceValidatePhoneNumber: " + e.Message);
                Debug.Print("Status Code: " + e.ErrorCode);
                Debug.Print(e.StackTrace);
            }
        }
    }
}
```

#### Using the OdienceValidatePhoneNumberWithHttpInfo variant
This returns an ApiResponse object which contains the response data, status code and headers.

```csharp
try
{
    ApiResponse<OdienceValidatePhoneNumber200Response> response = apiInstance.OdienceValidatePhoneNumberWithHttpInfo(odienceValidatePhoneNumberRequest);
    Debug.Write("Status Code: " + response.StatusCode);
    Debug.Write("Response Headers: " + response.Headers);
    Debug.Write("Response Body: " + response.Data);
}
catch (ApiException e)
{
    Debug.Print("Exception when calling DefaultApi.OdienceValidatePhoneNumberWithHttpInfo: " + e.Message);
    Debug.Print("Status Code: " + e.ErrorCode);
    Debug.Print(e.StackTrace);
}
```

### Parameters

| Name | Type | Description | Notes |
|------|------|-------------|-------|
| **odienceValidatePhoneNumberRequest** | [**OdienceValidatePhoneNumberRequest**](OdienceValidatePhoneNumberRequest.md) |  |  |

### Return type

[**OdienceValidatePhoneNumber200Response**](OdienceValidatePhoneNumber200Response.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

<a id="streamgetstreamurls"></a>
# **StreamGetStreamUrls**
> StreamGetStreamUrls200Response StreamGetStreamUrls (StreamGetStreamUrlsRequest streamGetStreamUrlsRequest)



### Example
```csharp
using System.Collections.Generic;
using System.Diagnostics;
using DirectorV2.Client.Api;
using DirectorV2.Client.Client;
using DirectorV2.Client.Model;

namespace Example
{
    public class StreamGetStreamUrlsExample
    {
        public static void Main()
        {
            Configuration config = new Configuration();
            config.BasePath = "https://director.odience.com/api";
            var apiInstance = new DefaultApi(config);
            var streamGetStreamUrlsRequest = new StreamGetStreamUrlsRequest(); // StreamGetStreamUrlsRequest | 

            try
            {
                StreamGetStreamUrls200Response result = apiInstance.StreamGetStreamUrls(streamGetStreamUrlsRequest);
                Debug.WriteLine(result);
            }
            catch (ApiException  e)
            {
                Debug.Print("Exception when calling DefaultApi.StreamGetStreamUrls: " + e.Message);
                Debug.Print("Status Code: " + e.ErrorCode);
                Debug.Print(e.StackTrace);
            }
        }
    }
}
```

#### Using the StreamGetStreamUrlsWithHttpInfo variant
This returns an ApiResponse object which contains the response data, status code and headers.

```csharp
try
{
    ApiResponse<StreamGetStreamUrls200Response> response = apiInstance.StreamGetStreamUrlsWithHttpInfo(streamGetStreamUrlsRequest);
    Debug.Write("Status Code: " + response.StatusCode);
    Debug.Write("Response Headers: " + response.Headers);
    Debug.Write("Response Body: " + response.Data);
}
catch (ApiException e)
{
    Debug.Print("Exception when calling DefaultApi.StreamGetStreamUrlsWithHttpInfo: " + e.Message);
    Debug.Print("Status Code: " + e.ErrorCode);
    Debug.Print(e.StackTrace);
}
```

### Parameters

| Name | Type | Description | Notes |
|------|------|-------------|-------|
| **streamGetStreamUrlsRequest** | [**StreamGetStreamUrlsRequest**](StreamGetStreamUrlsRequest.md) |  |  |

### Return type

[**StreamGetStreamUrls200Response**](StreamGetStreamUrls200Response.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

<a id="usergetuserinfo"></a>
# **UserGetUserInfo**
> UserGetUserInfo200Response UserGetUserInfo (Object body)



### Example
```csharp
using System.Collections.Generic;
using System.Diagnostics;
using DirectorV2.Client.Api;
using DirectorV2.Client.Client;
using DirectorV2.Client.Model;

namespace Example
{
    public class UserGetUserInfoExample
    {
        public static void Main()
        {
            Configuration config = new Configuration();
            config.BasePath = "https://director.odience.com/api";
            var apiInstance = new DefaultApi(config);
            var body = null;  // Object | 

            try
            {
                UserGetUserInfo200Response result = apiInstance.UserGetUserInfo(body);
                Debug.WriteLine(result);
            }
            catch (ApiException  e)
            {
                Debug.Print("Exception when calling DefaultApi.UserGetUserInfo: " + e.Message);
                Debug.Print("Status Code: " + e.ErrorCode);
                Debug.Print(e.StackTrace);
            }
        }
    }
}
```

#### Using the UserGetUserInfoWithHttpInfo variant
This returns an ApiResponse object which contains the response data, status code and headers.

```csharp
try
{
    ApiResponse<UserGetUserInfo200Response> response = apiInstance.UserGetUserInfoWithHttpInfo(body);
    Debug.Write("Status Code: " + response.StatusCode);
    Debug.Write("Response Headers: " + response.Headers);
    Debug.Write("Response Body: " + response.Data);
}
catch (ApiException e)
{
    Debug.Print("Exception when calling DefaultApi.UserGetUserInfoWithHttpInfo: " + e.Message);
    Debug.Print("Status Code: " + e.ErrorCode);
    Debug.Print(e.StackTrace);
}
```

### Parameters

| Name | Type | Description | Notes |
|------|------|-------------|-------|
| **body** | **Object** |  |  |

### Return type

[**UserGetUserInfo200Response**](UserGetUserInfo200Response.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

<a id="usergetuserinfobymsisdn"></a>
# **UserGetUserInfoByMsisdn**
> UserGetUserInfo200Response UserGetUserInfoByMsisdn (UserGetUserInfoByMsisdnRequest userGetUserInfoByMsisdnRequest)



### Example
```csharp
using System.Collections.Generic;
using System.Diagnostics;
using DirectorV2.Client.Api;
using DirectorV2.Client.Client;
using DirectorV2.Client.Model;

namespace Example
{
    public class UserGetUserInfoByMsisdnExample
    {
        public static void Main()
        {
            Configuration config = new Configuration();
            config.BasePath = "https://director.odience.com/api";
            var apiInstance = new DefaultApi(config);
            var userGetUserInfoByMsisdnRequest = new UserGetUserInfoByMsisdnRequest(); // UserGetUserInfoByMsisdnRequest | 

            try
            {
                UserGetUserInfo200Response result = apiInstance.UserGetUserInfoByMsisdn(userGetUserInfoByMsisdnRequest);
                Debug.WriteLine(result);
            }
            catch (ApiException  e)
            {
                Debug.Print("Exception when calling DefaultApi.UserGetUserInfoByMsisdn: " + e.Message);
                Debug.Print("Status Code: " + e.ErrorCode);
                Debug.Print(e.StackTrace);
            }
        }
    }
}
```

#### Using the UserGetUserInfoByMsisdnWithHttpInfo variant
This returns an ApiResponse object which contains the response data, status code and headers.

```csharp
try
{
    ApiResponse<UserGetUserInfo200Response> response = apiInstance.UserGetUserInfoByMsisdnWithHttpInfo(userGetUserInfoByMsisdnRequest);
    Debug.Write("Status Code: " + response.StatusCode);
    Debug.Write("Response Headers: " + response.Headers);
    Debug.Write("Response Body: " + response.Data);
}
catch (ApiException e)
{
    Debug.Print("Exception when calling DefaultApi.UserGetUserInfoByMsisdnWithHttpInfo: " + e.Message);
    Debug.Print("Status Code: " + e.ErrorCode);
    Debug.Print(e.StackTrace);
}
```

### Parameters

| Name | Type | Description | Notes |
|------|------|-------------|-------|
| **userGetUserInfoByMsisdnRequest** | [**UserGetUserInfoByMsisdnRequest**](UserGetUserInfoByMsisdnRequest.md) |  |  |

### Return type

[**UserGetUserInfo200Response**](UserGetUserInfo200Response.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

