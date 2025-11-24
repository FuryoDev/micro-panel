package com.example.micropanel.web.dto;

import java.util.UUID;

public record SceneActionDto(
        String name,
        Object state,
        UUID uuid
) {
}
