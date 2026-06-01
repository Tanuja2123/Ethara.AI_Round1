from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.config import settings
from app.database import get_db
from app.models import Customer, Order, Product
from app.schemas import DashboardSummary, ProductResponse

router = APIRouter(tags=["Dashboard"])


@router.get("/dashboard", response_model=DashboardSummary)
def get_dashboard_summary(db: Session = Depends(get_db)):
    threshold = settings.low_stock_threshold
    low_stock = (
        db.query(Product)
        .filter(Product.quantity_in_stock <= threshold)
        .order_by(Product.quantity_in_stock)
        .all()
    )
    return DashboardSummary(
        total_products=db.query(Product).count(),
        total_customers=db.query(Customer).count(),
        total_orders=db.query(Order).count(),
        low_stock_products=[ProductResponse.model_validate(p) for p in low_stock],
    )
