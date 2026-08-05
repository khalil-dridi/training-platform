    package com.trainingplatform.common.exception;

    public class TokenAlreadyUsedException extends RuntimeException {
        public TokenAlreadyUsedException(String message) {
            super(message);
        }
    }
