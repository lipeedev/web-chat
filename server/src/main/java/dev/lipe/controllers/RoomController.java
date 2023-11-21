package dev.lipe.controllers;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

import dev.lipe.services.RoomService;

@RestController
@RequestMapping("/api/rooms")
public class RoomController {
  private final RoomService service;

  public RoomController(RoomService service) {
    this.service = service;
  }

  private record RoomDTO(String name) {
  }

  @PostMapping
  public ResponseEntity<RoomDTO> createRoom(@RequestBody RoomDTO roomDTO) {
    var room = this.service.createRoom(roomDTO.name());

    return ResponseEntity.status(HttpStatus.CREATED).body(new RoomDTO(room.getName()));
  }

  @GetMapping
  public ResponseEntity<List<RoomDTO>> getRooms() {
    var rooms = this.service.getRooms();
    var roomsDTO = rooms.stream().map(room -> new RoomDTO(room.getName())).toList();

    return ResponseEntity.ok(roomsDTO);
  }
}
