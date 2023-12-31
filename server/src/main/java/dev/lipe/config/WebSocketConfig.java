package dev.lipe.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.socket.config.annotation.EnableWebSocket;
import org.springframework.web.socket.config.annotation.WebSocketConfigurer;
import org.springframework.web.socket.config.annotation.WebSocketHandlerRegistry;

@Configuration
@EnableWebSocket
public class WebSocketConfig implements WebSocketConfigurer {

  @Override
  public void registerWebSocketHandlers(WebSocketHandlerRegistry registry) {
    registry.addHandler(this.webSocketHandler(), "/chat/{roomId}/{username}").setAllowedOrigins("*");
    registry.addHandler(this.videoHandler(), "/video").setAllowedOrigins("*");
  }

  @Bean
  public MyHandler webSocketHandler() {
    return new MyHandler();
  }

  @Bean
  public VideoHandler videoHandler() {
    return new VideoHandler();
  }

}
