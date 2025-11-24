package com.example.micropanel.web.dto;

import java.util.List;
import java.util.UUID;

public record SceneLayerDto(
        String name,
        String path,
        String sourceA,
        String sourceB,
        List<String> sources,
        UUID uuid
) {
}
