package com.devbuild.inscriptionservice.services;

import com.devbuild.inscriptionservice.dto.DoctoratEvent;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

@Service
public class DoctoratEventConsumer {

    private static final Logger log = LoggerFactory.getLogger(DoctoratEventConsumer.class);

    @KafkaListener(
            topics = "doctorat-events",
            groupId = "inscription-service-doctorat-events",
            containerFactory = "doctoratEventKafkaListenerContainerFactory"
    )
    public void consume(DoctoratEvent event) {
        log.info("Received doctorat event: id={}, type={}, payload={}", event.getId(), event.getType(), event.getPayload());
    }
}
