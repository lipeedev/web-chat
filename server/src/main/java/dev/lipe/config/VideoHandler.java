package dev.lipe.config;

import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.io.IOException;
import java.util.HashSet;
import java.util.Set;

public class VideoHandler extends TextWebSocketHandler {
  private Set<WebSocketSession> sessions = new HashSet<>();
  private ObjectMapper mapper = new ObjectMapper();

  @Override
  public void afterConnectionEstablished(WebSocketSession session) throws Exception {
    sessions.add(session);
  }

  @Override
  public void afterConnectionClosed(WebSocketSession session, CloseStatus status) throws Exception {
    sessions.remove(session);
  }

  @Override
  public void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception {
    var jsonMessage = this.mapper.readTree(message.getPayload());
    var eventName = jsonMessage.get("event").asText();

    for (var s : this.sessions) {
      if (!s.equals(session)) {

        if (eventName.equals("timeChange")) {
          var currentTime = jsonMessage.get("data").get("currentTime").asDouble();
          sendMessageEventJson(s, new JsonEventMessage(eventName, new CurrentTime(currentTime)));
        } else {
          sendMessageEventJson(s, new JsonEventMessage(eventName, null));
        }

      }
    }

  }

  private void sendMessageEventJson(WebSocketSession session, Object message) throws IOException {
    if (!session.isOpen()) {
      return;
    }

    session.sendMessage(new TextMessage(mapper.writeValueAsString(message)));
  }

  private record JsonEventMessage(String event, Object data) {
  }

  private record CurrentTime(Double currentTime) {
  }
}
