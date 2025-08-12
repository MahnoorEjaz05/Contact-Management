package com.example.Contact.Manager.utils;

import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Before;
import org.aspectj.lang.annotation.AfterReturning;
import org.aspectj.lang.annotation.AfterThrowing;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

@Aspect
@Component
public class LoggingAspect {

    private static final Logger logger = LoggerFactory.getLogger(LoggingAspect.class);

    // Before method execution logging
    @Before("execution(* com.example.Contact.Manager.controller.*.*(..))")
    public void logBefore(JoinPoint joinPoint) {
        logger.info("Before method execution: " + joinPoint.getSignature().getName());
    }

    // After method execution logging
    @AfterReturning("execution(* com.example.Contact.Manager.controller.*.*(..))")
    public void logAfterReturning(JoinPoint joinPoint) {
        logger.info("After method execution: " + joinPoint.getSignature().getName());
    }

    // After method throws exception logging
    @AfterThrowing(pointcut = "execution(* com.example.Contact.Manager.controller.*.*(..))", throwing = "exception")
    public void logAfterThrowing(JoinPoint joinPoint, Throwable exception) {
        logger.error("Method " + joinPoint.getSignature().getName() + " threw exception: " + exception.getMessage());
    }
}
