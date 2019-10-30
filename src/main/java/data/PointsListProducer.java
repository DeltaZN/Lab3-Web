package data;

import model.Point;

import javax.annotation.PostConstruct;
import javax.enterprise.context.RequestScoped;
import javax.enterprise.event.Observes;
import javax.enterprise.event.Reception;
import javax.enterprise.inject.Produces;
import javax.faces.context.FacesContext;
import javax.inject.Inject;
import javax.inject.Named;
import javax.persistence.EntityManager;
import javax.persistence.Query;
import javax.servlet.http.HttpSession;
import java.util.List;

@RequestScoped
public class PointsListProducer {

    private List<Point> points;

    private Query query;

    @Inject
    private EntityManager em;

    @Produces
    @Named
    public List<Point> getPoints() {
        return points;
    }

    @SuppressWarnings({"unused", "unchecked"})
    public void onMemberListChanged(@Observes(notifyObserver = Reception.IF_EXISTS) final Point point) {
        points = query.getResultList();
        points.sort((p1, p2) -> p1.getId() > p2.getId() ? 1 : -1);
    }

    @SuppressWarnings("unchecked")
    @PostConstruct
    public void init() {
        FacesContext fCtx = FacesContext.getCurrentInstance();
        HttpSession session = (HttpSession) fCtx.getExternalContext().getSession(false);
        String sessionId = session.getId();

        query = em.createQuery("select p from Point p WHERE p.sessionId = :id");
        query.setParameter("id", sessionId);

        points = query.getResultList();
        points.sort((p1, p2) -> p1.getId() > p2.getId() ? 1 : -1);
    }
}
