package com.tracker.config;

import javax.servlet.http.HttpSessionEvent;
import javax.servlet.http.HttpSessionListener;

/**
 * Created by Perebeinis on 27.02.2018.
 */
public class SessionListener implements HttpSessionListener {

    @Override
    public void sessionCreated(HttpSessionEvent event) {
        System.out.println("==== Session is created ====");
        event.getSession().setMaxInactiveInterval(30*60);
    }

    @Override
    public void sessionDestroyed(HttpSessionEvent event) {
        System.out.println("==== Session is destroyed ====");
    }
}
