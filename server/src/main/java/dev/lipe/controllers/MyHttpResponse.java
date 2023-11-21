package dev.lipe.controllers;

import org.springframework.http.HttpStatus;

public record MyHttpResponse<T>(HttpStatus statusCode, T data) {
}
