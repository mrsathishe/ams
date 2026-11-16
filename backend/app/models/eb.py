from datetime import date, datetime, timezone
from typing import Literal

from pydantic import BaseModel, Field, model_validator


class EBAccountCreate(BaseModel):
    account_type: Literal["common", "individual"]
    flat_id: str | None = None
    name: str | None = Field(default=None, max_length=120)

    @model_validator(mode="after")
    def validate_flat_scope(self):
        if self.account_type == "common" and self.flat_id:
            raise ValueError("Common EB accounts belong to an apartment, not a flat")
        if self.account_type == "individual" and not self.flat_id:
            raise ValueError("Individual EB accounts require a flat")
        return self


class IndividualEBToggle(BaseModel):
    enabled: bool


class EBAccount(BaseModel):
    id: str
    apartment_id: str
    account_type: Literal["common", "individual"]
    flat_id: str | None = None
    name: str
    created_by: str
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class EBBillCreate(BaseModel):
    period_start: date
    period_end: date
    opening_balance: float = Field(default=0, ge=0, allow_inf_nan=False)
    bill_amount: float = Field(gt=0, allow_inf_nan=False)
    description: str | None = Field(default=None, max_length=500)

    @model_validator(mode="after")
    def validate_period(self):
        if self.period_end < self.period_start:
            raise ValueError("period_end must be on or after period_start")
        return self


class EBBillChange(BaseModel):
    period_start: date | None = None
    period_end: date | None = None
    opening_balance: float | None = Field(default=None, ge=0, allow_inf_nan=False)
    bill_amount: float | None = Field(default=None, gt=0, allow_inf_nan=False)
    description: str | None = Field(default=None, max_length=500)

    @model_validator(mode="after")
    def validate_change(self):
        if all(value is None for value in self.model_dump().values()):
            raise ValueError("At least one bill field must be provided")
        if self.period_start and self.period_end and self.period_end < self.period_start:
            raise ValueError("period_end must be on or after period_start")
        return self


class EBPaymentCreate(BaseModel):
    amount: float = Field(gt=0, allow_inf_nan=False)
    payment_date: datetime
    payment_method: str | None = Field(default=None, max_length=80)


class EBPaymentChange(BaseModel):
    amount: float | None = Field(default=None, gt=0, allow_inf_nan=False)
    payment_date: datetime | None = None
    payment_method: str | None = Field(default=None, max_length=80)

    @model_validator(mode="after")
    def require_change(self):
        if all(value is None for value in self.model_dump().values()):
            raise ValueError("At least one payment field must be provided")
        return self


class EBPaymentView(BaseModel):
    id: str
    bill_id: str
    paid_by: str
    payer_name: str
    amount: float
    payment_date: datetime
    payment_method: str | None = None
    created_at: datetime


class EBBillView(BaseModel):
    id: str
    account_id: str
    apartment_id: str
    flat_id: str | None = None
    period_start: date
    period_end: date
    opening_balance: float
    previous_balance: float
    bill_amount: float
    total_payable: float
    total_paid: float
    closing_balance: float
    payment_status: Literal["Pending", "Partially Paid", "Paid"]
    description: str | None = None
    created_by: str
    payments: list[EBPaymentView] = Field(default_factory=list)