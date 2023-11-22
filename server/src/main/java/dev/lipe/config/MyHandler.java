package dev.lipe.config;

import org.springframework.stereotype.Component;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import com.fasterxml.jackson.databind.ObjectMapper;

import java.io.IOException;
import java.util.HashSet;
import java.util.HashMap;
import java.util.Set;
import java.util.Map;

@Component
public class MyHandler extends TextWebSocketHandler {

  private final Map<String, Set<WebSocketSession>> rooms = new HashMap<String, Set<WebSocketSession>>();
  private final ObjectMapper mapper = new ObjectMapper();

  @Override
  public void afterConnectionEstablished(WebSocketSession session) throws Exception {
    var pathVariables = this.extractPathVariables(session.getUri().getPath());

    if (!rooms.containsKey(pathVariables.roomId())) {
      rooms.put(pathVariables.roomId(), new HashSet<WebSocketSession>());
    }

    rooms.get(pathVariables.roomId()).add(session);

    var msg = String.format("Welcome to %s", pathVariables.roomId());
    this.sendMessageJson(session, new JsonMessage(msg, "server", false));
  }

  @Override
  protected void handleTextMessage(WebSocketSession sender, TextMessage message) throws Exception {

    var jsonMessage = this.mapper.readTree(message.getPayload());
    var text = jsonMessage.get("message").asText();
    var username = jsonMessage.get("sender").asText();
    var isTyping = jsonMessage.get("isTyping").asBoolean();

    var pathVariables = this.extractPathVariables(sender.getUri().getPath());

    if (isTyping) {
      for (WebSocketSession session : this.rooms.get(pathVariables.roomId())) {
        if (!session.equals(sender)) {
          this.sendMessageJson(session, new JsonMessage("", username, true));
        }
      }
      return;
    }

    for (WebSocketSession session : this.rooms.get(pathVariables.roomId())) {
      if (!session.equals(sender)) {
        this.sendMessageJson(session, new JsonMessage(text, username, false));
      }
    }

  }

  @Override
  public void afterConnectionClosed(WebSocketSession session, CloseStatus status) throws Exception {
    var pathVariables = this.extractPathVariables(session.getUri().getPath());
    this.rooms.get(pathVariables.roomId()).remove(session);
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

  private record JsonMessage(String message, String sender, Boolean isTyping) {
  }

  private record WebSocketPathVariables(String roomId, String username) {
  }
}
