package com.controller;

import com.events.DoctoratEvent;
import com.services.DoctoratEventProducer;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.Instant;
import java.util.UUID;

@RestController
@RequestMapping("/api/events")
public class DoctoratEventController {

    private final DoctoratEventProducer producer;

    public DoctoratEventController(DoctoratEventProducer producer) {
        this.producer = producer;
    }

    @PostMapping
    public ResponseEntity<Void> publish(@RequestBody DoctoratEvent event) {
        if (event.getId() == null || event.getId().isEmpty()) {
            event.setId(UUID.randomUUID().toString());
        }
        if (event.getTimestamp() == null) {
            event.setTimestamp(Instant.now());
        }
        producer.publish(event);
        return new ResponseEntity<>(HttpStatus.ACCEPTED);
    }
}
