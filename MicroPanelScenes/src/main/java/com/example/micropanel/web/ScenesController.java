package com.example.micropanel.web;

import com.example.micropanel.service.ScenesProxyService;
import com.example.micropanel.web.dto.SceneDto;

import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/scenes")
public class ScenesController {

    private final ScenesProxyService scenesProxyService;

    public ScenesController(ScenesProxyService scenesProxyService) {
        this.scenesProxyService = scenesProxyService;
    }

    @GetMapping
    public ResponseEntity<List<SceneDto>> getScenes() {
        List<SceneDto> s = scenesProxyService.fetchScenes();
        return ResponseEntity.ok(s);
    }

    @PatchMapping("/{sceneId}/{layerId}")
    public ResponseEntity<Object> patchLayer(@PathVariable String sceneId,
                                             @PathVariable String layerId,
                                             @RequestBody(required = false) Object body) {
        return scenesProxyService.forwardPatch("/" + sceneId + "/" + layerId, body);
    }

    @PatchMapping("/{sceneId}/snapshots/{uuid}")
    public ResponseEntity<Object> patchSnapshot(@PathVariable String sceneId,
                                                @PathVariable String uuid,
                                                @RequestBody(required = false) Object body) {
        return scenesProxyService.forwardPatch("/" + sceneId + "/snapshots/" + uuid, body);
    }

    @PatchMapping("/{sceneId}/macros/{uuid}")
    public ResponseEntity<Object> patchMacro(@PathVariable String sceneId,
                                             @PathVariable String uuid,
                                             @RequestBody(required = false) Object body) {
        return scenesProxyService.forwardPatch("/" + sceneId + "/macros/" + uuid, body);
    }
}
