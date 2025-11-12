import director.v2.client.apis.DefaultApi
import director.v2.client.apis.SseCallback
import kotlinx.coroutines.runBlocking
import kotlinx.coroutines.delay
import okhttp3.OkHttpClient
import java.security.cert.X509Certificate
import javax.net.ssl.SSLContext
import javax.net.ssl.TrustManager
import javax.net.ssl.X509TrustManager

fun main(args: Array<String>) {
    runBlocking {
        // Create a trust manager that does not validate certificate chains
        val trustAllCerts = arrayOf<TrustManager>(
            object : X509TrustManager {
                override fun checkClientTrusted(chain: Array<out X509Certificate>?, authType: String?) {}
                override fun checkServerTrusted(chain: Array<out X509Certificate>?, authType: String?) {}
                override fun getAcceptedIssuers(): Array<X509Certificate> = arrayOf()
            }
        )

        // Install the all-trusting trust manager
        val sslContext = SSLContext.getInstance("SSL")
        sslContext.init(null, trustAllCerts, java.security.SecureRandom())
        // Create an ssl socket factory with our all-trusting manager
        val sslSocketFactory = sslContext.socketFactory

        val okHttpClientBuilder = OkHttpClient.Builder()
            .sslSocketFactory(sslSocketFactory, trustAllCerts[0] as X509TrustManager)
            .hostnameVerifier { _, _ -> true }

        val okHttpClient = okHttpClientBuilder.build()
        val api = DefaultApi(basePath = "https://localhost:3001/api", client = okHttpClient)

        try {
            // Test regular endpoint
            val result = api.healthOk()
            println("Health OK: $result")
            
            // Test SSE endpoint with callback
            println("\nTesting SSE endpoint...")
            var eventCount = 0
            val eventSource = api.healthLiveOkSse(
                maxOutputs = java.math.BigDecimal("5"),
                callback = object : SseCallback {
                    override fun onEvent(event: String, data: String, id: String?) {
                        eventCount++
                        println("SSE Event #$eventCount - Type: $event, Data: $data, ID: $id")
                    }
                    
                    override fun onOpen() {
                        println("SSE Connection opened")
                    }
                    
                    override fun onClosed() {
                        println("SSE Connection closed")
                    }
                    
                    override fun onFailure(error: Throwable) {
                        println("SSE Error: ${error.message}")
                        error.printStackTrace()
                    }
                }
            )
            
            // Wait for events to come in
            println("Waiting for SSE events...")
            delay(10000) // Wait 10 seconds for events
            
            // Close the event source
            eventSource.cancel()
            println("EventSource cancelled")
            
        } catch (e: Exception) {
            println("Error: $e")
            e.printStackTrace()
        } finally {
            // Force close connections to allow the program to exit
            okHttpClient.dispatcher.executorService.shutdown()
            okHttpClient.connectionPool.evictAll()
        }
    }
}