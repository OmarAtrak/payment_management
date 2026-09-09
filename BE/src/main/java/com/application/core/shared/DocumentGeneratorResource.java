package com.application.core.shared;


import com.application.core.shared.entities.DocumentGenerator;
import com.application.core.shared.repository.DocumentGeneratorRepository;
import com.fasterxml.jackson.databind.JsonNode;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.MessageSource;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Locale;

@RestController
@RequestMapping("/api/document-generator")
@Validated
public class DocumentGeneratorResource {

    private final DocumentGeneratorRepository documentGeneratorRepository;
    private final MessageSource messages;

    @Autowired
    public DocumentGeneratorResource(DocumentGeneratorRepository documentGeneratorRepository, MessageSource messageSource) {
        this.documentGeneratorRepository = documentGeneratorRepository;
        this.messages = messageSource;
    }


    @RequestMapping(value = "/index", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> index(
            @RequestParam(name = "type", required = false) String type,
            Locale locale) {


        List<DocumentGenerator> documentGeneratorList;
        if (type != null) {
            documentGeneratorList = documentGeneratorRepository.findByActiveTrueAndType(type);
        } else {
            documentGeneratorList = documentGeneratorRepository.findByActiveTrue();
        }

        List<JsonNode> documentJsons = new ArrayList<>();
        for (DocumentGenerator document : documentGeneratorList) {
            documentJsons.add(document.toJson());
        }


        return new ResponseEntity<>(documentJsons, HttpStatus.OK);
    }

    @RequestMapping(
            value = "/get/{id}",
            method = RequestMethod.GET,
            produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> get(Locale locale, @PathVariable Long id) throws Exception {
        DocumentGenerator requestedDocumentGenerator = documentGeneratorRepository.findOneById(id);

        if (requestedDocumentGenerator == null)
            throw new Exception(messages.getMessage("message.no_item_to_display", new Object[]{"Document Model id :" + id}, locale));
        return new ResponseEntity<>(requestedDocumentGenerator.toJson(), HttpStatus.OK);
    }

}
