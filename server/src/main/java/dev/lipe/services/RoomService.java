package dev.lipe.services;

import java.util.List;

import org.springframework.stereotype.Service;

import dev.lipe.entities.RoomEntity;
import dev.lipe.errors.MyError;
import dev.lipe.repositories.RoomRepository;

@Service
public class RoomService {
  private final RoomRepository repository;

  public RoomService(RoomRepository repository) {
    this.repository = repository;
  }

  public RoomEntity createRoom(String name) {
    var roomAlreadyExists = this.repository.findByName(name);

    if (roomAlreadyExists != null) {
      throw new MyError("Room " + name + " already exists");
    }

    var room = new RoomEntity(name);
    return this.repository.save(room);
  }

  public List<RoomEntity> getRooms() {
    return this.repository.findAll();
  }
}
