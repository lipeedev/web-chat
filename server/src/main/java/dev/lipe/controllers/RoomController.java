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
  public ResponseEntity<?> createRoom(@RequestBody RoomDTO roomDTO) {

    try {
      var room = this.service.createRoom(roomDTO.name());
      var response = new MyHttpResponse<RoomDTO>(HttpStatus.CREATED, new RoomDTO(room.getName()));

      return ResponseEntity.status(response.statusCode()).body(response.data());

    } catch (Error e) {
      var response = new MyHttpResponse<String>(HttpStatus.BAD_REQUEST, e.getMessage());
      return ResponseEntity.status(response.statusCode()).body(response);
    }

  }

  @GetMapping
  public ResponseEntity<List<RoomDTO>> getRooms() {
    var rooms = this.service.getRooms();
    var roomsDTO = rooms.stream().map(room -> new RoomDTO(room.getName())).toList();

    return ResponseEntity.ok(roomsDTO);
  }
}
