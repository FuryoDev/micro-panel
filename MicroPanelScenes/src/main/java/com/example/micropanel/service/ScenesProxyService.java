package com.example.micropanel.service;

import com.example.micropanel.config.UpstreamProperties;
import com.example.micropanel.web.dto.SceneDto;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestClientResponseException;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Map;

@Service
public class ScenesProxyService {
    private static final Logger logger = LoggerFactory.getLogger(ScenesProxyService.class);

    private final RestClient client;
    private final String scenesBasePath;

    public ScenesProxyService(RestClient.Builder builder, UpstreamProperties properties) {
        String sanitizedBase = properties.getBaseUrl().replaceAll("/+$", "");
        this.client = builder.baseUrl(sanitizedBase).build();
        this.scenesBasePath = sanitizedBase + "/scenes";
    }

    public List<SceneDto> fetchScenes() {
        try {
            ResponseEntity<List<SceneDto>> response = client.get()
                    .uri("/scenes")
                    .retrieve()
                    .toEntity(new ParameterizedTypeReference<>() {
                    });
            return response.getBody();
        } catch (RestClientResponseException ex) {
            logger.warn("Upstream responded with status {} for GET {}", ex.getStatusCode(), scenesBasePath);
            throw new ResponseStatusException(ex.getStatusCode(), ex.getResponseBodyAsString(), ex);
        } catch (RestClientException ex) {
            logger.error("Failed to reach upstream scenes endpoint {}", scenesBasePath, ex);
            throw new ResponseStatusException(HttpStatus.BAD_GATEWAY,
                    "Upstream unreachable: " + ex.getMessage(), ex);
        }
    }

    public ResponseEntity<Object> forwardPatch(String relativePath, Object body) {
        String target = scenesBasePath + relativePath;
        try {
            ResponseEntity<Object> response = client.patch()
                    .uri("/scenes" + relativePath)
                    .body(body != null ? body : Map.of())
                    .retrieve()
                    .toEntity(Object.class);
            return ResponseEntity.status(response.getStatusCode()).body(response.getBody());
        } catch (RestClientResponseException ex) {
            logger.warn("Upstream responded with status {} for PATCH {}", ex.getStatusCode(), target);
            return ResponseEntity.status(ex.getStatusCode()).body(ex.getResponseBodyAsString());
        } catch (RestClientException ex) {
            logger.error("Failed to reach upstream scenes endpoint {}", target, ex);
            return ResponseEntity.status(HttpStatus.BAD_GATEWAY)
                    .body(Map.of("error", "Upstream unreachable", "details", ex.getMessage()));
        }
    }
}
