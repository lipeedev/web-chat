package dev.lipe.utils;

public record JsonMessage(
  Boolean isAudio, 
  String message, 
  String sender, 
  Boolean isTyping, 
  String profileImage
) {}
