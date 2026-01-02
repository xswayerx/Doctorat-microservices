package com.devbuild.inscriptionservice.streams;

import com.devbuild.inscriptionservice.dto.DoctoratEvent;
import org.apache.kafka.common.serialization.Serdes;
import org.apache.kafka.streams.KeyValue;
import org.apache.kafka.streams.kstream.Consumed;
import org.apache.kafka.streams.kstream.Grouped;
import org.apache.kafka.streams.kstream.KStream;
import org.apache.kafka.streams.kstream.KTable;
import org.apache.kafka.streams.kstream.Materialized;
import org.apache.kafka.streams.kstream.Produced;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.kafka.support.serializer.JsonSerde;

import java.time.Instant;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;

@Configuration
@ConditionalOnProperty(name = "doctorat.streams.enabled", havingValue = "true")
public class DoctoratStreamsTopology {

    private static final String INPUT_TOPIC = "doctorat-events";
    private static final String VALID_SOUTENANCES_TOPIC = "doctorat-soutenances-validees";
    private static final String SOUTENANCES_COUNT_TOPIC = "doctorat-soutenances-count";

    @Bean
    public KStream<String, DoctoratEvent> doctoratKStream(org.apache.kafka.streams.StreamsBuilder builder) {
        JsonSerde<DoctoratEvent> eventSerde = new JsonSerde<>(DoctoratEvent.class);

        KStream<String, DoctoratEvent> stream = builder.stream(
                INPUT_TOPIC,
                Consumed.with(Serdes.String(), eventSerde)
        );

        // Exemple section 2 : opérations stateless (filter + map)
        KStream<String, DoctoratEvent> soutenancesValidees = stream
                .filter((key, event) -> event != null && "SOUTENANCE_VALIDEE".equalsIgnoreCase(event.getType()))
                .map((key, event) -> KeyValue.pair(event.getId(), event));

        soutenancesValidees.to(VALID_SOUTENANCES_TOPIC, Produced.with(Serdes.String(), eventSerde));

        // Exemple section 3 : opération stateful (count par mois)
        DateTimeFormatter monthFormatter = DateTimeFormatter.ofPattern("yyyy-MM")
                .withZone(ZoneId.systemDefault());

        KTable<String, Long> soutenancesParMois = soutenancesValidees
                .groupBy(
                        (key, event) -> monthFormatter.format(event.getTimestamp() != null ? event.getTimestamp() : Instant.now()),
                        Grouped.with(Serdes.String(), eventSerde)
                )
                .count(Materialized.with(Serdes.String(), Serdes.Long()));

        soutenancesParMois
                .toStream()
                .map((month, count) -> KeyValue.pair(month, String.valueOf(count)))
                .to(SOUTENANCES_COUNT_TOPIC, Produced.with(Serdes.String(), Serdes.String()));

        return stream;
    }
}
