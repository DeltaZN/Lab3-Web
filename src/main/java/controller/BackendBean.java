package controller;

import model.Point;

import javax.annotation.Resource;
import javax.enterprise.event.Event;
import javax.inject.Inject;
import javax.persistence.EntityManager;
import javax.transaction.*;
import java.io.Serializable;

public class BackendBean implements Serializable {
    @Inject
    private EntityManager em;

    @Resource
    private UserTransaction userTransaction;

    @Inject
    private Event<Point> pointEvent;

    private double xCanvas;
    private double yCanvas;

    public void setxCanvas(double xCanvas) {
        this.xCanvas = (double) Math.round(xCanvas * 1000d) / 1000d;
    }

    public void setyCanvas(double yCanvas) {
        this.yCanvas = (double) Math.round(yCanvas * 1000d) / 1000d;
    }

    public double getxCanvas() {
        return xCanvas;
    }

    public double getyCanvas() {
        return yCanvas;
    }

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

    public void addPoint(Point point) throws SystemException, NotSupportedException, HeuristicRollbackException, HeuristicMixedException, RollbackException {
        userTransaction.begin();
        em.persist(point);
        userTransaction.commit();
        pointEvent.fire(point);
    }

    public void addPointFromCanvas() throws SystemException, NotSupportedException, HeuristicRollbackException, HeuristicMixedException, RollbackException {
        Point point = new Point(xCanvas, yCanvas, r);
        addPoint(point);
    }

    public void addPointFromForm() throws SystemException, NotSupportedException, HeuristicRollbackException, HeuristicMixedException, RollbackException {
        Point point = new Point(x, y, r);
        addPoint(point);
    }
}
