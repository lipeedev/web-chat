package dev.lipe.config;

import org.springframework.stereotype.Component;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import com.fasterxml.jackson.databind.ObjectMapper;

import dev.lipe.utils.JsonMessage;

import java.io.IOException;
import java.util.HashSet;
import java.util.HashMap;
import java.util.Set;
import java.util.Map;

@Component
public class MyHandler extends TextWebSocketHandler {

  private final Map<String, Set<WebSocketSession>> rooms = new HashMap<String, Set<WebSocketSession>>();
  private final ObjectMapper mapper = new ObjectMapper();
  private String base64Received = "";

  @Override
  public void afterConnectionEstablished(WebSocketSession session) throws Exception {
    var pathVariables = this.extractPathVariables(session.getUri().getPath());

    if (!rooms.containsKey(pathVariables.roomId())) {
      rooms.put(pathVariables.roomId(), new HashSet<WebSocketSession>());
    }

    rooms.get(pathVariables.roomId()).add(session);

    var msgToUserConnected = String.format("Welcome to %s.", pathVariables.roomId());
    this.sendMessageJson(session, new JsonMessage(false, msgToUserConnected, "server", false, null));

    var msgToOtherUsers = String.format("%s joined the room.", pathVariables.username());

    for (var s : this.rooms.get(pathVariables.roomId())) {
      if (!s.equals(session)) {
        this.sendMessageJson(s, new JsonMessage(false, msgToOtherUsers, "server", false, null));
      }
    }
  }

  @Override
  protected void handleTextMessage(WebSocketSession sender, TextMessage message) throws Exception {

    var jsonMessage = this.mapper.readTree(message.getPayload());
    var username = jsonMessage.get("sender").asText();
    var profileImage = mapper.convertValue(jsonMessage.get("profileImage"), String.class);
    var isTyping = jsonMessage.get("isTyping").asBoolean();
    var isAudio = jsonMessage.get("isAudio").asBoolean();

    var pathVariables = this.extractPathVariables(sender.getUri().getPath());

    if (isTyping) {
      for (var session : this.rooms.get(pathVariables.roomId())) {
        if (!session.equals(sender)) {
          this.sendMessageJson(session, new JsonMessage(false, "", username, true, profileImage));
        }
      }
      return;
    }

    for (WebSocketSession session : this.rooms.get(pathVariables.roomId())) {
      if (!session.equals(sender)) {

        if (isAudio) {
          var isChunkEnd = jsonMessage.get("isChunkEnd").asBoolean();

          if (!isChunkEnd) {
            var chunkArray = mapper.convertValue(jsonMessage.get("message"), String[].class);
            this.base64Received += chunkArray[0];
          } else {
            this.sendMessageJson(session, new JsonMessage(true, base64Received, username, false, profileImage));
            this.base64Received = "";
          }

        } else {
          var text = jsonMessage.get("message").asText();
          this.sendMessageJson(session, new JsonMessage((isAudio) ? true : false, text, username, false, profileImage));
        }

      }
    }

  }

  @Override
  public void afterConnectionClosed(WebSocketSession session, CloseStatus status) throws Exception {
    var pathVariables = this.extractPathVariables(session.getUri().getPath());
    this.rooms.get(pathVariables.roomId()).remove(session);

    var msgToOtherUsers = String.format("%s left the room.", pathVariables.username());

    for (var s : this.rooms.get(pathVariables.roomId())) {
      if (!s.equals(session)) {
        this.sendMessageJson(s, new JsonMessage(false, msgToOtherUsers, "server", false, null));
      }
    }
  }

  private void sendMessageJson(WebSocketSession session, Object message) throws IOException {
    if (!session.isOpen()) {
      return;
    }
    session.sendMessage(new TextMessage(mapper.writeValueAsString(message)));
  }

  private WebSocketPathVariables extractPathVariables(String path) {
    String[] pathSegments = path.split("/");
    String roomId = (pathSegments.length >= 3) ? pathSegments[2] : null;
    String username = (pathSegments.length >= 3) ? pathSegments[3] : null;
    return new WebSocketPathVariables(roomId, username);
  }

  private record WebSocketPathVariables(String roomId, String username) {
  }
}
