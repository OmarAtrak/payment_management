package com.application.core.shared;


import com.application.core.shared.entities.MetaData;
import com.application.core.shared.repository.MetaDataRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.MessageSource;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import javax.validation.Valid;
import java.util.List;
import java.util.Locale;


/**
 * The HelloWorld program implements an application that
 * simply displays "Hello World!" to the standard output.
 *
 * @author Fayssal BenMoussa
 * @version 1.0
 * @since 2014-03-31
 */

@RestController
@RequestMapping("/api/product/metaData")
@Validated
public class MetaDataResource {

    private MetaDataRepository metaDataRepository;
    private MessageSource messages;

    @Autowired
    public MetaDataResource(MetaDataRepository metaDataRepository, MessageSource messages) {
        this.metaDataRepository = metaDataRepository;
        this.messages = messages;
    }

    /**
     * This method is used to  show MetaData.
     *
     * @return ResponseEntity list of MetaData.
     */
    @RequestMapping(value = "/index", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> index(Locale locale, HttpServletRequest request) {
        List<MetaData> metaDataList = metaDataRepository.findByActiveTrue();
        return new ResponseEntity<>(metaDataList, HttpStatus.OK);
    }


    /**
     * This method is used to Get MetaData.
     *
     * @return requested MetaData.
     */

    @RequestMapping(
            value = "/get/{id}",
            method = RequestMethod.GET,
            produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> get(Locale locale, HttpServletRequest request, @PathVariable Long id) throws Exception {
        MetaData requestedMetaData = metaDataRepository.findOneById(id);
        if (requestedMetaData == null)
            throw new Exception(messages.getMessage("message.no_item_to_display", new Object[] { " Metadata id :" +  id}, locale));
        return new ResponseEntity<>(requestedMetaData.toJson(), HttpStatus.OK);
    }


    /**
     * This method is used to save MetaData.
     *
     * @return saved MetaData.
     */
    @RequestMapping(value = "/save", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public ResponseEntity<?> save(@Valid @RequestBody MetaData metaData, HttpServletRequest request) {
        MetaData savedMetaData = metaDataRepository.save(metaData);
        return new ResponseEntity<>(savedMetaData.toJson(), HttpStatus.OK);
    }


    /**
     * This method is used to update MetaData.
     *
     * @return updated MetaData.
     */
    @RequestMapping(value = "/update", method = RequestMethod.PUT, produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public ResponseEntity<?> update(Locale locale, @Valid @RequestBody MetaData metaData, HttpServletRequest request) {
        MetaData requestedMetaData = metaDataRepository.findOneById(metaData.getId());

        if (requestedMetaData == null)
            throw new RuntimeException(messages.getMessage("message.item_not_deleted", new Object[] { "metaData id :" +  metaData.getId()}, locale));
        MetaData updatedCustomer = metaDataRepository.save(metaData);
        return new ResponseEntity<>(updatedCustomer.toJson(), HttpStatus.OK);
    }


    @RequestMapping(value = "/delete/{id}", method = RequestMethod.DELETE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> delete(Locale locale, @PathVariable("id") Long id) {
        MetaData metaData = metaDataRepository.findOneById(id);
        metaData.setActive(false);
        MetaData removedMetaData = metaDataRepository.save(metaData);
        if (!removedMetaData.getActive())
            return new ResponseEntity<>(messages.getMessage("message.item_deleted", new Object[]{"metaData id :" + metaData.getId()}, locale), HttpStatus.OK);
        throw new RuntimeException(messages.getMessage("message.item_not_deleted", new Object[] { "metaData id :" +  id}, locale));
    }

}



