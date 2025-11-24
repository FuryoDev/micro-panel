package com.example.micropanel.web.dto;

import java.util.List;
import java.util.UUID;

public record SceneDto(
        String name,
        String path,
        int tally,
        UUID uuid,
        List<SceneActionDto> actions,
        List<SceneLayerDto> layers,
        List<SceneSnapshotDto> snapshots
) {
}
