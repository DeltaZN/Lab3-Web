package controller;

import model.Point;

import javax.annotation.Resource;
import javax.enterprise.event.Event;
import javax.faces.bean.ManagedBean;
import javax.faces.bean.SessionScoped;
import javax.inject.Inject;
import javax.persistence.EntityManager;
import javax.transaction.*;
import java.io.Serializable;

@ManagedBean(name = "BackendBean", eager = true)
@SessionScoped
public class BackendBean implements Serializable {
    @Inject
    private EntityManager em;

    @Resource
    private UserTransaction userTransaction;

    @Inject
    private Event<Point> pointEvent;

    private int x;
    private double y;
    private int r = 1;

    public int getR() {
        return r;
    }

    public int getX() {
        return x;
    }

    public double getY() {
        return y;
    }

    public void setX(int x) {
        this.x = x;
    }

    public void setY(double y) {
        this.y = y;
    }

    public void setR(int r) {
        this.r = r;
    }

    public void addPoint() throws SystemException, NotSupportedException, HeuristicRollbackException, HeuristicMixedException, RollbackException {
        Point point = new Point(x, y, r);
        userTransaction.begin();
        em.persist(point);
        userTransaction.commit();
        pointEvent.fire(point);
    }
}
