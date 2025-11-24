package com.example.micropanel;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.ConfigurationPropertiesScan;

@SpringBootApplication
@ConfigurationPropertiesScan
public class MicroPanelScenesApplication {

    public static void main(String[] args) {
        SpringApplication.run(MicroPanelScenesApplication.class, args);
    }
}
