package dev.lipe.config;

import org.springframework.stereotype.Component;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import com.fasterxml.jackson.databind.ObjectMapper;

import java.io.IOException;
import java.util.HashSet;
import java.util.Set;

@Component
public class MyHandler extends TextWebSocketHandler {

  private final Set<WebSocketSession> sessions = new HashSet<>();
  private final ObjectMapper mapper = new ObjectMapper();

  @Override
  public void afterConnectionEstablished(WebSocketSession session) throws Exception {
    sessions.add(session);

    var username = this.getUsernameFromSession(session);
    this.sendMessageJson(session, new JsonMessage("Welcome to the chat " + username, "server"));
  }

  @Override
  protected void handleTextMessage(WebSocketSession sender, TextMessage message) throws Exception {

    var jsonMessage = this.mapper.readTree(message.getPayload());
    var text = jsonMessage.get("message").asText();
    var username = jsonMessage.get("sender").asText();

    for (WebSocketSession session : sessions) {
      if (!session.equals(sender)) {
        this.sendMessageJson(session, new JsonMessage(text, username));
      }
    }

  }

  @Override
  public void afterConnectionClosed(WebSocketSession session, CloseStatus status) throws Exception {
    sessions.remove(session);
  }

  private void sendMessageJson(WebSocketSession session, Object message) throws IOException {
    if (!session.isOpen()) {
      return;
    }
    session.sendMessage(new TextMessage(mapper.writeValueAsString(message)));
  }

  private String getUsernameFromSession(WebSocketSession session) {
    return session.getUri().toString().split("username=")[1];
  }

  private record JsonMessage(String message, String sender) {
  }
}
