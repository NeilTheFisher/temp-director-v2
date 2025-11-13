# DefaultApi

All URIs are relative to *https://director.odience.com/api*

| Method | HTTP request | Description |
| ------------- | ------------- | ------------- |
| [**eventsListEvents**](DefaultApi.md#eventsListEvents) | **POST** /events/listEvents |  |
| [**eventsListEventsLive**](DefaultApi.md#eventsListEventsLive) | **POST** /events/listEventsLive |  |
| [**eventsListPartialEvents**](DefaultApi.md#eventsListPartialEvents) | **POST** /events/listPartialEvents |  |
| [**healthLiveOk**](DefaultApi.md#healthLiveOk) | **GET** /health/liveOk |  |
| [**healthOk**](DefaultApi.md#healthOk) | **GET** /health/ok |  |
| [**odienceGetCategoryList**](DefaultApi.md#odienceGetCategoryList) | **POST** /odience/getCategoryList |  |
| [**odienceProvisionUser**](DefaultApi.md#odienceProvisionUser) | **POST** /odience/provisionUser |  |
| [**odienceValidatePhoneNumber**](DefaultApi.md#odienceValidatePhoneNumber) | **POST** /odience/validatePhoneNumber |  |
| [**streamGetStreamUrls**](DefaultApi.md#streamGetStreamUrls) | **POST** /stream/getStreamUrls |  |
| [**userGetUserInfo**](DefaultApi.md#userGetUserInfo) | **POST** /user/getUserInfo |  |
| [**userGetUserInfoByMsisdn**](DefaultApi.md#userGetUserInfoByMsisdn) | **POST** /user/getUserInfoByMsisdn |  |


<a id="eventsListEvents"></a>
# **eventsListEvents**
> EventsListEvents200Response eventsListEvents(body)



### Example
```kotlin
// Import classes:
//import director.v2.client.infrastructure.*
//import director.v2.client.models.*

val apiInstance = DefaultApi()
val body : kotlin.Any =  // kotlin.Any | 
try {
    val result : EventsListEvents200Response = apiInstance.eventsListEvents(body)
    println(result)
} catch (e: ClientException) {
    println("4xx response calling DefaultApi#eventsListEvents")
    e.printStackTrace()
} catch (e: ServerException) {
    println("5xx response calling DefaultApi#eventsListEvents")
    e.printStackTrace()
}
```

### Parameters
| Name | Type | Description  | Notes |
| ------------- | ------------- | ------------- | ------------- |
| **body** | **kotlin.Any**|  | [optional] |

### Return type

[**EventsListEvents200Response**](EventsListEvents200Response.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

<a id="eventsListEventsLive"></a>
# **eventsListEventsLive**
> EventsListEventsLive200Response eventsListEventsLive(body)



### Example
```kotlin
// Import classes:
//import director.v2.client.infrastructure.*
//import director.v2.client.models.*

val apiInstance = DefaultApi()
val body : kotlin.Any =  // kotlin.Any | 
try {
    val result : EventsListEventsLive200Response = apiInstance.eventsListEventsLive(body)
    println(result)
} catch (e: ClientException) {
    println("4xx response calling DefaultApi#eventsListEventsLive")
    e.printStackTrace()
} catch (e: ServerException) {
    println("5xx response calling DefaultApi#eventsListEventsLive")
    e.printStackTrace()
}
```

### Parameters
| Name | Type | Description  | Notes |
| ------------- | ------------- | ------------- | ------------- |
| **body** | **kotlin.Any**|  | [optional] |

### Return type

[**EventsListEventsLive200Response**](EventsListEventsLive200Response.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: Not defined

<a id="eventsListPartialEvents"></a>
# **eventsListPartialEvents**
> EventsListEvents200Response eventsListPartialEvents(body)



### Example
```kotlin
// Import classes:
//import director.v2.client.infrastructure.*
//import director.v2.client.models.*

val apiInstance = DefaultApi()
val body : kotlin.Any =  // kotlin.Any | 
try {
    val result : EventsListEvents200Response = apiInstance.eventsListPartialEvents(body)
    println(result)
} catch (e: ClientException) {
    println("4xx response calling DefaultApi#eventsListPartialEvents")
    e.printStackTrace()
} catch (e: ServerException) {
    println("5xx response calling DefaultApi#eventsListPartialEvents")
    e.printStackTrace()
}
```

### Parameters
| Name | Type | Description  | Notes |
| ------------- | ------------- | ------------- | ------------- |
| **body** | **kotlin.Any**|  | [optional] |

### Return type

[**EventsListEvents200Response**](EventsListEvents200Response.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

<a id="healthLiveOk"></a>
# **healthLiveOk**
> HealthLiveOk200Response healthLiveOk(maxOutputs)



### Example
```kotlin
// Import classes:
//import director.v2.client.infrastructure.*
//import director.v2.client.models.*

val apiInstance = DefaultApi()
val maxOutputs : java.math.BigDecimal = 8.14 // java.math.BigDecimal | 
try {
    val result : HealthLiveOk200Response = apiInstance.healthLiveOk(maxOutputs)
    println(result)
} catch (e: ClientException) {
    println("4xx response calling DefaultApi#healthLiveOk")
    e.printStackTrace()
} catch (e: ServerException) {
    println("5xx response calling DefaultApi#healthLiveOk")
    e.printStackTrace()
}
```

### Parameters
| Name | Type | Description  | Notes |
| ------------- | ------------- | ------------- | ------------- |
| **maxOutputs** | **java.math.BigDecimal**|  | [optional] |

### Return type

[**HealthLiveOk200Response**](HealthLiveOk200Response.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined

<a id="healthOk"></a>
# **healthOk**
> kotlin.String healthOk()



### Example
```kotlin
// Import classes:
//import director.v2.client.infrastructure.*
//import director.v2.client.models.*

val apiInstance = DefaultApi()
try {
    val result : kotlin.String = apiInstance.healthOk()
    println(result)
} catch (e: ClientException) {
    println("4xx response calling DefaultApi#healthOk")
    e.printStackTrace()
} catch (e: ServerException) {
    println("5xx response calling DefaultApi#healthOk")
    e.printStackTrace()
}
```

### Parameters
This endpoint does not need any parameter.

### Return type

**kotlin.String**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a id="odienceGetCategoryList"></a>
# **odienceGetCategoryList**
> kotlin.collections.Map&lt;kotlin.String, kotlin.String&gt; odienceGetCategoryList()



### Example
```kotlin
// Import classes:
//import director.v2.client.infrastructure.*
//import director.v2.client.models.*

val apiInstance = DefaultApi()
try {
    val result : kotlin.collections.Map<kotlin.String, kotlin.String> = apiInstance.odienceGetCategoryList()
    println(result)
} catch (e: ClientException) {
    println("4xx response calling DefaultApi#odienceGetCategoryList")
    e.printStackTrace()
} catch (e: ServerException) {
    println("5xx response calling DefaultApi#odienceGetCategoryList")
    e.printStackTrace()
}
```

### Parameters
This endpoint does not need any parameter.

### Return type

**kotlin.collections.Map&lt;kotlin.String, kotlin.String&gt;**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a id="odienceProvisionUser"></a>
# **odienceProvisionUser**
> OdienceProvisionUser200Response odienceProvisionUser(odienceProvisionUserRequest)



### Example
```kotlin
// Import classes:
//import director.v2.client.infrastructure.*
//import director.v2.client.models.*

val apiInstance = DefaultApi()
val odienceProvisionUserRequest : OdienceProvisionUserRequest =  // OdienceProvisionUserRequest | 
try {
    val result : OdienceProvisionUser200Response = apiInstance.odienceProvisionUser(odienceProvisionUserRequest)
    println(result)
} catch (e: ClientException) {
    println("4xx response calling DefaultApi#odienceProvisionUser")
    e.printStackTrace()
} catch (e: ServerException) {
    println("5xx response calling DefaultApi#odienceProvisionUser")
    e.printStackTrace()
}
```

### Parameters
| Name | Type | Description  | Notes |
| ------------- | ------------- | ------------- | ------------- |
| **odienceProvisionUserRequest** | [**OdienceProvisionUserRequest**](OdienceProvisionUserRequest.md)|  | |

### Return type

[**OdienceProvisionUser200Response**](OdienceProvisionUser200Response.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

<a id="odienceValidatePhoneNumber"></a>
# **odienceValidatePhoneNumber**
> OdienceValidatePhoneNumber200Response odienceValidatePhoneNumber(odienceValidatePhoneNumberRequest)



### Example
```kotlin
// Import classes:
//import director.v2.client.infrastructure.*
//import director.v2.client.models.*

val apiInstance = DefaultApi()
val odienceValidatePhoneNumberRequest : OdienceValidatePhoneNumberRequest =  // OdienceValidatePhoneNumberRequest | 
try {
    val result : OdienceValidatePhoneNumber200Response = apiInstance.odienceValidatePhoneNumber(odienceValidatePhoneNumberRequest)
    println(result)
} catch (e: ClientException) {
    println("4xx response calling DefaultApi#odienceValidatePhoneNumber")
    e.printStackTrace()
} catch (e: ServerException) {
    println("5xx response calling DefaultApi#odienceValidatePhoneNumber")
    e.printStackTrace()
}
```

### Parameters
| Name | Type | Description  | Notes |
| ------------- | ------------- | ------------- | ------------- |
| **odienceValidatePhoneNumberRequest** | [**OdienceValidatePhoneNumberRequest**](OdienceValidatePhoneNumberRequest.md)|  | |

### Return type

[**OdienceValidatePhoneNumber200Response**](OdienceValidatePhoneNumber200Response.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

<a id="streamGetStreamUrls"></a>
# **streamGetStreamUrls**
> StreamGetStreamUrls200Response streamGetStreamUrls(streamGetStreamUrlsRequest)



### Example
```kotlin
// Import classes:
//import director.v2.client.infrastructure.*
//import director.v2.client.models.*

val apiInstance = DefaultApi()
val streamGetStreamUrlsRequest : StreamGetStreamUrlsRequest =  // StreamGetStreamUrlsRequest | 
try {
    val result : StreamGetStreamUrls200Response = apiInstance.streamGetStreamUrls(streamGetStreamUrlsRequest)
    println(result)
} catch (e: ClientException) {
    println("4xx response calling DefaultApi#streamGetStreamUrls")
    e.printStackTrace()
} catch (e: ServerException) {
    println("5xx response calling DefaultApi#streamGetStreamUrls")
    e.printStackTrace()
}
```

### Parameters
| Name | Type | Description  | Notes |
| ------------- | ------------- | ------------- | ------------- |
| **streamGetStreamUrlsRequest** | [**StreamGetStreamUrlsRequest**](StreamGetStreamUrlsRequest.md)|  | |

### Return type

[**StreamGetStreamUrls200Response**](StreamGetStreamUrls200Response.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

<a id="userGetUserInfo"></a>
# **userGetUserInfo**
> UserGetUserInfo200Response userGetUserInfo(body)



### Example
```kotlin
// Import classes:
//import director.v2.client.infrastructure.*
//import director.v2.client.models.*

val apiInstance = DefaultApi()
val body : kotlin.Any = Object // kotlin.Any | 
try {
    val result : UserGetUserInfo200Response = apiInstance.userGetUserInfo(body)
    println(result)
} catch (e: ClientException) {
    println("4xx response calling DefaultApi#userGetUserInfo")
    e.printStackTrace()
} catch (e: ServerException) {
    println("5xx response calling DefaultApi#userGetUserInfo")
    e.printStackTrace()
}
```

### Parameters
| Name | Type | Description  | Notes |
| ------------- | ------------- | ------------- | ------------- |
| **body** | **kotlin.Any**|  | |

### Return type

[**UserGetUserInfo200Response**](UserGetUserInfo200Response.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

<a id="userGetUserInfoByMsisdn"></a>
# **userGetUserInfoByMsisdn**
> UserGetUserInfo200Response userGetUserInfoByMsisdn(userGetUserInfoByMsisdnRequest)



### Example
```kotlin
// Import classes:
//import director.v2.client.infrastructure.*
//import director.v2.client.models.*

val apiInstance = DefaultApi()
val userGetUserInfoByMsisdnRequest : UserGetUserInfoByMsisdnRequest =  // UserGetUserInfoByMsisdnRequest | 
try {
    val result : UserGetUserInfo200Response = apiInstance.userGetUserInfoByMsisdn(userGetUserInfoByMsisdnRequest)
    println(result)
} catch (e: ClientException) {
    println("4xx response calling DefaultApi#userGetUserInfoByMsisdn")
    e.printStackTrace()
} catch (e: ServerException) {
    println("5xx response calling DefaultApi#userGetUserInfoByMsisdn")
    e.printStackTrace()
}
```

### Parameters
| Name | Type | Description  | Notes |
| ------------- | ------------- | ------------- | ------------- |
| **userGetUserInfoByMsisdnRequest** | [**UserGetUserInfoByMsisdnRequest**](UserGetUserInfoByMsisdnRequest.md)|  | |

### Return type

[**UserGetUserInfo200Response**](UserGetUserInfo200Response.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

