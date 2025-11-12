import director.v2.client.apis.DefaultApi
import director.v2.client.infrastructure.ApiClient
import kotlinx.coroutines.runBlocking
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
        val apiClient = ApiClient(baseUrl = "https://localhost:3001/api", callFactory = okHttpClient)
        val webService = apiClient.createService(DefaultApi::class.java)

        try {
            val result = webService.healthOk()
            println("Health OK: ${result.body()}")
        } catch (e: Exception) {
            println("Error: $e")
        } finally {
            // Force close connections to allow the program to exit
            okHttpClient.dispatcher.executorService.shutdown()
            okHttpClient.connectionPool.evictAll()
        }
    }
}