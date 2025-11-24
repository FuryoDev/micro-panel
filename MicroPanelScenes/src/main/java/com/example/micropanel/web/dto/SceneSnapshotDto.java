package com.example.micropanel.web.dto;

import java.util.UUID;

public record SceneSnapshotDto(
        String name,
        Object state,
        UUID uuid
) {
}
