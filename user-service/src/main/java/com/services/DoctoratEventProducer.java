package com.services;

import com.events.DoctoratEvent;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

@Service
public class DoctoratEventProducer {

    private static final String TOPIC = "doctorat-events";

    private final KafkaTemplate<String, DoctoratEvent> kafkaTemplate;

    public DoctoratEventProducer(KafkaTemplate<String, DoctoratEvent> kafkaTemplate) {
        this.kafkaTemplate = kafkaTemplate;
    }

    public void publish(DoctoratEvent event) {
        kafkaTemplate.send(TOPIC, event.getId(), event);
    }
}
