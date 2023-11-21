package dev.lipe.repositories;

import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import dev.lipe.entities.RoomEntity;

public interface RoomRepository
    extends JpaRepository<RoomEntity, UUID> {

}
