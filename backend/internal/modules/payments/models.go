package payments

import (
	"time"
)

// Payment represents a simulated payment transaction
type Payment struct {
	ID              int       `json:"id"`
	ViolationID     int       `json:"violation_id"`
	Amount          float64   `json:"amount"`
	PaymentScenario string    `json:"payment_scenario"`
	TransactionID   string    `json:"transaction_id"`
	Status          string    `json:"status"` // "paid", "failed"
	CreatedAt       time.Time `json:"created_at"`
}

// PaymentRepository abstracts database operations for payments
type PaymentRepository interface {
	Save(p *Payment) error
}
