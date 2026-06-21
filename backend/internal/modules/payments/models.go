package payments

import (
	"time"
)

type Payment struct {
	ID              int       `json:"id"`
	ViolationID     int       `json:"violation_id"`
	Amount          float64   `json:"amount"`
	PaymentScenario string    `json:"payment_scenario"`
	TransactionID   string    `json:"transaction_id"`
	Status          string    `json:"status"` 
	CreatedAt       time.Time `json:"created_at"`
}

type PaymentRepository interface {
	Save(p *Payment) error
}
