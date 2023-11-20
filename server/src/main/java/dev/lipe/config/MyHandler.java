package dev.lipe.config;

import org.springframework.stereotype.Component;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import java.io.IOException;
import java.util.HashSet;
import java.util.Set;

@Component
public class MyHandler extends TextWebSocketHandler {

  private final Set<WebSocketSession> sessions = new HashSet<>();

  @Override
  public void afterConnectionEstablished(WebSocketSession session) throws Exception {
    sessions.add(session);
    session.sendMessage(new TextMessage("Welcome to the chat!"));
  }

  @Override
  protected void handleTextMessage(WebSocketSession sender, TextMessage message) throws Exception {
    for (WebSocketSession session : sessions) {
      if (!session.equals(sender)) {
        try {
          session.sendMessage(message);
        } catch (IOException e) {
          e.printStackTrace();
        }
      }
    }
  }

  @Override
  public void afterConnectionClosed(WebSocketSession session, CloseStatus status) throws Exception {
    sessions.remove(session);
  }
}
