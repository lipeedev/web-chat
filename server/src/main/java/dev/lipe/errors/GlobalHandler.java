package dev.lipe.errors;

import java.util.HashMap;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import dev.lipe.controllers.MyHttpResponse;

@ControllerAdvice
public class GlobalHandler {

  @ExceptionHandler(MethodArgumentNotValidException.class)
  public ResponseEntity<?> handleValidationExceptions(MethodArgumentNotValidException ex) {
    Map<String, String> errors = new HashMap<>();

    ex.getBindingResult().getAllErrors().forEach((error) -> {
      errors.put("error", error.getDefaultMessage());
    });

    var response = new MyHttpResponse<Map<String, String>>(HttpStatus.BAD_REQUEST, errors);
    return ResponseEntity.status(response.code()).body(response);
  }

  @ExceptionHandler(MyError.class)
  public ResponseEntity<MyHttpResponse<?>> handleMyException(Error err) {
    var errorMap = new HashMap<String, String>();
    errorMap.put("error", err.getMessage());

    var response = new MyHttpResponse<Map<String, String>>(HttpStatus.BAD_REQUEST, errorMap);

    return ResponseEntity.status(response.code()).body(response);
  }
}
