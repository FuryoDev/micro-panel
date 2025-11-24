package com.example.micropanel.web.dto;

import java.util.List;
import java.util.UUID;

public class SceneDto {

    private String name;
    private String path;
    private int tally;
    private UUID uuid;
    private List<SceneActionDto> actions;
    private List<SceneLayerDto> layers;
    private List<SceneSnapshotDto> snapshots;

    public SceneDto() {
    }

    public SceneDto(String name, String path, int tally, UUID uuid, List<SceneActionDto> actions, List<SceneLayerDto> layers, List<SceneSnapshotDto> snapshots) {
        this.name = name;
        this.path = path;
        this.tally = tally;
        this.uuid = uuid;
        this.actions = actions;
        this.layers = layers;
        this.snapshots = snapshots;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getPath() {
        return path;
    }

    public void setPath(String path) {
        this.path = path;
    }

    public int getTally() {
        return tally;
    }

    public void setTally(int tally) {
        this.tally = tally;
    }

    public UUID getUuid() {
        return uuid;
    }

    public void setUuid(UUID uuid) {
        this.uuid = uuid;
    }

    public List<SceneActionDto> getActions() {
        return actions;
    }

    public void setActions(List<SceneActionDto> actions) {
        this.actions = actions;
    }

    public List<SceneLayerDto> getLayers() {
        return layers;
    }

    public void setLayers(List<SceneLayerDto> layers) {
        this.layers = layers;
    }

    public List<SceneSnapshotDto> getSnapshots() {
        return snapshots;
    }

    public void setSnapshots(List<SceneSnapshotDto> snapshots) {
        this.snapshots = snapshots;
    }
}
