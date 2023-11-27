package dev.lipe.controllers;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

import dev.lipe.dtos.RoomDTO;
import dev.lipe.services.RoomService;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/rooms")
@CrossOrigin(origins = "*")
public class RoomController {
  private final RoomService service;

  public RoomController(RoomService service) {
    this.service = service;
  }

  @PostMapping
  public ResponseEntity<?> createRoom(@RequestBody @Valid RoomDTO roomDTO) {

    var room = this.service.createRoom(roomDTO.name());
    var response = new MyHttpResponse<RoomDTO>(HttpStatus.CREATED, new RoomDTO(room.getName()));

    return ResponseEntity.status(response.code()).body(response);

  }

  @GetMapping
  public ResponseEntity<List<RoomDTO>> getRooms() {
    var rooms = this.service.getRooms();
    var roomsDTO = rooms.stream().map(room -> new RoomDTO(room.getName())).toList();

    return ResponseEntity.ok(roomsDTO);
  }
}
