package dev.lipe.dtos;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record RoomDTO(
    @NotBlank(message = "Name cannot be empty.") @NotNull(message = "Name cannot be empty.") @Size(max = 18, message = "Name size must be maximum 18.") @Pattern(regexp = ".*[a-zA-Z].*", message = "Name must be a string.") String name) {
}
