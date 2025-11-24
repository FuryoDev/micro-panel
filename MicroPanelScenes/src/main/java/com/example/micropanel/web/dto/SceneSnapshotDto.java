package com.example.micropanel.web.dto;

import java.util.UUID;

public class SceneSnapshotDto {

    private String name;
    private Object state;
    private UUID uuid;

    public SceneSnapshotDto() {
    }

    public SceneSnapshotDto(String name, Object state, UUID uuid) {
        this.name = name;
        this.state = state;
        this.uuid = uuid;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Object getState() {
        return state;
    }

    public void setState(Object state) {
        this.state = state;
    }

    public UUID getUuid() {
        return uuid;
    }

    public void setUuid(UUID uuid) {
        this.uuid = uuid;
    }
}
