package com.example.micropanel.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.util.StringUtils;

@ConfigurationProperties(prefix = "panel.upstream")
public class UpstreamProperties {

    private String baseUrl = "http://10.41.40.130:1234/api";

    public String getBaseUrl() {
        return baseUrl;
    }

    public void setBaseUrl(String baseUrl) {
        if (StringUtils.hasText(baseUrl)) {
            this.baseUrl = baseUrl;
        }
    }
}
