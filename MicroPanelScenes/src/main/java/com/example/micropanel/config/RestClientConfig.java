package com.example.micropanel.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.client.ClientHttpRequestFactory;
import org.springframework.http.client.JdkClientHttpRequestFactory;
import org.springframework.web.client.RestClientCustomizer;

import java.net.http.HttpClient;

@Configuration
public class RestClientConfig {

    @Bean
    public RestClientCustomizer patchFriendlyRequestFactoryCustomizer() {
        HttpClient httpClient = HttpClient.newBuilder().build();
        ClientHttpRequestFactory requestFactory = new JdkClientHttpRequestFactory(httpClient);

        return builder -> builder.requestFactory(requestFactory);
    }
}
