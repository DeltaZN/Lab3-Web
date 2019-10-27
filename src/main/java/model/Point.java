package model;

import javax.persistence.*;

@Entity
@Table(name = "points")
public class Point {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE)
    private int id;

    private double x;
    private double y;
    private int r;
    private boolean hit;

    public Point() {}

    public Point(double x, double y, int r) {
        this.x = x;
        this.y = y;
        this.r = r;
        this.hit = isHitted(x, y, r);
    }

    public String getDrawPoint(int r) {
        return String.format("drawPoint(%s, %s, %s)", x, y, isHitted(x, y, r));
    }

    public int getId() {
        return id;
    }

    public double getX() {
        return x;
    }

    public double getY() {
        return y;
    }

    public int getR() {
        return r;
    }

    public boolean isHit() {
        return hit;
    }

    private static boolean isHitted(double x, double y, double r) {
        boolean rectangleHit = x >= 0 && y <= 0 && x <= r/2 && y >= -r;
        boolean triangleHit = x <= 0 && y >= 0 && y <= x + r;
        boolean sectorHit = x <= 0 && y <= 0 && r >= Math.sqrt(x*x + y*y);

        return rectangleHit || triangleHit || sectorHit;
    }

}
