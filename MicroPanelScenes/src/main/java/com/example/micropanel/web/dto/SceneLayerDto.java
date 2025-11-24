package com.example.micropanel.web.dto;

import java.util.List;
import java.util.UUID;

public class SceneLayerDto {

    private String name;
    private String path;
    private String sourceA;
    private String sourceB;
    private List<String> sources;
    private UUID uuid;

    public SceneLayerDto() {
    }

    public SceneLayerDto(String name, String path, String sourceA, String sourceB, List<String> sources, UUID uuid) {
        this.name = name;
        this.path = path;
        this.sourceA = sourceA;
        this.sourceB = sourceB;
        this.sources = sources;
        this.uuid = uuid;
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

    public String getSourceA() {
        return sourceA;
    }

    public void setSourceA(String sourceA) {
        this.sourceA = sourceA;
    }

    public String getSourceB() {
        return sourceB;
    }

    public void setSourceB(String sourceB) {
        this.sourceB = sourceB;
    }

    public List<String> getSources() {
        return sources;
    }

    public void setSources(List<String> sources) {
        this.sources = sources;
    }

    public UUID getUuid() {
        return uuid;
    }

    public void setUuid(UUID uuid) {
        this.uuid = uuid;
    }
}
